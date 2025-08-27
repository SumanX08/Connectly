import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import crypto from 'crypto'
import { sendResetEmail } from '../Utils/sendEmail.js';
import passport from "passport";

const router = express.Router();
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";


const required = (v) => typeof v === 'string' && v.trim().length > 0;

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

     if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    const userObj = newUser.toObject();
    delete userObj.password;

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: userObj,
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d", algorithm: "HS256" });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: 'No user found with that email' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000; 

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

        

    const resetLink = `${frontendURL}/${token}`; 

    await sendResetEmail(email, resetLink);

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
})

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
})

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${frontendURL}/oauth-success?token=${token}`);
    
  }
);

router.get("/me", async(req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password').lean();


     if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
    
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});



export default router;
