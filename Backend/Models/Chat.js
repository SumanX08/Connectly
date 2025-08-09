import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  lastMessage: {
    content: String,
    timestamp: Date,
  },
}, { timestamps: true });

export default mongoose.model("Chat", ChatSchema);
