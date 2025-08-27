import express from 'express';
import User from '../Models/User.js';
import authMiddleware from '../Middleware/authMiddleware.js';
import upload from '../Middleware/uploadMiddleware.js'


const router = express.Router();





router.get("/suggestions", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills = [], location, minAge, maxAge ,page = 1, limit = 20,} = req.query;

    const currentUser = await User.findById(userId).select("matches").lean();
    const excludeIds = [userId, ...currentUser.matches];

    const filters = {
      _id: { $nin: excludeIds },
    };

    if (skills.length > 0) {
      filters.skills = { $in: Array.isArray(skills) ? skills : [skills] };
    }

    if (location) {
      filters.location = { $regex: new RegExp(String(location), "i") };
    }

    if (minAge || maxAge) {
      filters.age = {};
      if (minAge) filters.age.$gte = parseInt(minAge);
      if (maxAge) filters.age.$lte = parseInt(maxAge);
    }

        const skip = (Number(page) - 1) * Number(limit);


    const suggestedUsers = await User.find(filters).select("-password").lean().skip(skip).limit(Number(limit));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(500).json({ error: "Failed to fetch suggested profiles" });
  }
});




router.post("/setup/:id",authMiddleware,upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
      }

      const { username, bio, skills, lookingFor, location, age } = req.body;
      const imageUrl = req.file?.path || "";

      const profile = await User.findById(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!username || username.trim().length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters long" });
      }

      if (username.includes(" ")) {
        return res.status(400).json({ message: "Username cannot contain spaces" });
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" });
      }

      const existingUser = await User.findOne({
        username: username.trim(),
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      if (age && (isNaN(age) || age < 16)) {
        return res.status(400).json({ message: "Minimum age is 16" });
      }

      if (bio && bio.length > 200) {
        return res.status(400).json({ message: "Bio cannot exceed 200 characters" });
      }

      let parsedSkills = [];
      try {
        parsedSkills = typeof skills === "string" ? JSON.parse(skills) : skills;
      } catch {
        parsedSkills = [];
      }
      if (parsedSkills.length > 10) {
        return res.status(400).json({ message: "You can only add up to 10 skills" });
      }

      let parsedLookingFor = [];
      try {
        parsedLookingFor =
          typeof lookingFor === "string" ? JSON.parse(lookingFor) : lookingFor;
      } catch {
        parsedLookingFor = [];
      }

      profile.username = username.trim();
      profile.bio = bio || "";
      profile.location = location || "";
      profile.age = age ? Number(age) : profile.age;
      profile.skills = parsedSkills;
      profile.lookingFor = parsedLookingFor;

      if (imageUrl) {
        profile.avatar = imageUrl;
      }

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error("❌ Error in profile setup:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);


router.get("/:id",authMiddleware,async(req,res)=>{
  const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password");
       if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json( user );
    } catch (error) {
         res.status(500).json({ error: 'Server error' });
    }
    
})



export default router;
