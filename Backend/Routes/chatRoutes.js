import express from "express";
import Conversation from "../Models/Conversation.js";
import Message from "../Models/Message.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();


router.post("/start", authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).lean();

    if (!conversation) {
      conversation = new Conversation({participants: [senderId, receiverId]});
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    console.error("Start conversation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { conversationId, content,receiverId,senderId } = req.body;

    const message = new Message({conversationId,receiverId,senderId,content,timestamp: new Date()});

    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date()
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate("participants", "username email avatar")
      .sort({ updatedAt: -1 })
      .lean();

    res.json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/messages/:conversationId', authMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { before, limit = 30 } = req.query;

    const q = { conversationId };
    if (before) q.createdAt = { $lt: new Date(before) };

    const messages = await Message.find(q).sort({ timestamp: -1 }).limit(Number(limit)).lean();




    res.json({
      messages: messages.reverse(),
      nextCursor: messages.length ? messages[0].createdAt : null,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
