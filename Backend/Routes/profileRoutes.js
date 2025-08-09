import express from 'express';
import User from '../Models/User.js';
import authMiddleware from '../Middleware/authMiddleware.js';
import upload from '../Middleware/uploadMiddleware.js'


const router = express.Router();




// routes/profile.js
router.get("/suggestions", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills = [], location, minAge, maxAge } = req.query;

    const currentUser = await User.findById(userId).select("matches");
    const excludeIds = [userId, ...currentUser.matches];
    console.log(skills,location)

    const filters = {
      _id: { $nin: excludeIds },
    };

    if (skills.length > 0) {
      filters.skills = { $in: Array.isArray(skills) ? skills : [skills] };
    }

    if (location) {
      filters.location = { $regex: new RegExp(location, "i") };
    }

    if (minAge || maxAge) {
      filters.age = {};
      if (minAge) filters.age.$gte = parseInt(minAge);
      if (maxAge) filters.age.$lte = parseInt(maxAge);
    }

    console.log("MongoDB filters:", filters); // ✅ helpful log

    const suggestedUsers = await User.find(filters).select("-password");
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(500).json({ error: "Failed to fetch suggested profiles" });
  }
});




// Express.js
router.post("/setup/:id", authMiddleware,upload.single("avatar"), async (req, res) => {
  if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
    }
try {
  
  const { username, bio, skills,lookingFor,location } = req.body;
  const imageUrl = req.file?.path || ""; // multer stores path

  const profile = await User.findById(req.user._id);

    if (!profile) {
      console.log("❌ No user found with id:",username);
      return res.status(404).json({ message: "User not found" });
    }

    profile.username = username;
    profile.bio = bio;
    profile.location = location;
    profile.skills = typeof skills === "string" ? JSON.parse(skills) : skills;
    profile.lookingFor = typeof lookingFor === "string" ? JSON.parse(lookingFor) : lookingFor;
    if (imageUrl) {
  profile.avatar = imageUrl;
}

  await profile.save();
  res.json(profile);
} catch (error) {
console.error("❌ Error in profile setup:", error);
    res.status(500).json({ message: "Something went wrong" });}
  
});


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