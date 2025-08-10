// socket.js
import { Server } from "socket.io";
import User from "./Models/User.js";
import Conversation from "./Models/Conversation.js";
import Message from "./Models/Message.js";

let io;
const connectedUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      socket.join(userId);
      connectedUsers.set(userId, socket.id);
    });

    socket.on("send-connection", async ({ sender, receiver }) => {
      const receiverSocketId = connectedUsers.get(receiver);
      const senderUser = await User.findById(sender).select("username name avatar");
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-connection", {
          sender: {
            _id: senderUser._id,
            name: senderUser.name || senderUser.username,
            avatar: senderUser.avatar
          }
        });
      }
    });

    socket.on("accept-connection", async ({ sender, receiver }) => {
      const senderSocketId = connectedUsers.get(sender);

      // Fetch receiver details
      const receiverUser = await User.findById(receiver).select("username name avatar");

      if (senderSocketId) {
        io.to(senderSocketId).emit("connection-accepted", {
          username: receiverUser.name || receiverUser.username,
          avatar: receiverUser.avatar
        });
      }
    });

    socket.on("decline-connection", ({ sender, receiver }) => {
      const senderSocketId = connectedUsers.get(sender);
      if (senderSocketId) {
        io.to(senderSocketId).emit("connection-decline", { receiver });
      }
    });

    socket.on("send-message", ({ senderId, receiverId, message }) => {
      io.to(receiverId).emit("receive-message", { message });
    });

    socket.on("disconnect", () => {
      for (let [userId, id] of connectedUsers.entries()) {
        if (id === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
};

export { io };
