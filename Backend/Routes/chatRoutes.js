import express from "express"
import Chat from "../Models/Chat.js"
import Message from "../Models/Message.js";
import authMiddleware from "../Middleware/authMiddleware.js"

const router = express.Router();

// Create or get chat between two users
router.post("/", authMiddleware,async (req, res) => {
    
  const { senderId, receiverId } = req.body;

  try {
    let chat = await Chat.findOne({ members: { $all: [senderId, receiverId] } });

    if (!chat) {
      chat = await Chat.create({ members: [senderId, receiverId] });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chat" });
  }
});


router.post("/send", authMiddleware, async (req, res) => {
  const senderId = req.user._id;

  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const receiverId = chat.members.find(
      (id) => id.toString() !== senderId.toString()
    );

    const newMessage = new Message({
      chatId,
      senderId,
      receiverId,
      content,
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await savedMessage.populate("senderId", "name avatar");

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: populatedMessage.content,
      updatedAt: Date.now(),
    });

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message", err });
  }
});

router.get("/:chatId",authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    const userId = req.user._id;

    if (!chat.members.includes(userId)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const messages = await Message.find({ chatId: chat._id })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});



export default router;
