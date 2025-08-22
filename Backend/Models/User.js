import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  age: { type: Number },
  password: { type: String},
  bio: { type: String },
  email: { type: String, required: true, unique: true },
  skills: { type: [String], required: false, default: [] },
  lookingFor: { type: [String], required: false, default: [] },
  location: { type: String, default: "" },
  avatar: { type: String, default: "" },

  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  notifications: [
    {
      type: {
        type: String, 
        default: "connect"
      },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      avatar: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
      username: String
    }
  ]



})

export default mongoose.model("User", UserSchema)