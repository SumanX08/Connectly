// models/Conversation.js
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  lastMessage: {
    content: { type: String, default: "" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date }
  }
}, { timestamps: true });

export default mongoose.model("Conversation", ConversationSchema);
