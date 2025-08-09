import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/User.js";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ email: profile.emails[0].value });
    
    if (existingUser) return done(null, existingUser);

    const newUser = await User.create({
      email: profile.emails[0].value,
      username: profile.displayName,
      avatar: profile.photos[0].value,
      password: "google_oauth", // won't be used
    });

    done(null, newUser);
  } catch (err) {
    done(err, null);
  }
}));
