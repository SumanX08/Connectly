import { Server } from "socket.io";
import User from "./Models/User.js";

let io;
const connectedUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });
  

  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      socket.join(userId); 
      connectedUsers.set(userId, socket.id);
    });

    socket.on("send-connection", async ({ sender, receiver }) => {
      const receiverSocketId = connectedUsers.get(receiver);
      const senderUser = await User.findById(sender);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-connection", {
          sender:{
          _id: senderUser._id,
          name: senderUser.name,
          avatar: senderUser.avatar
          }
        });
      }
    });

    socket.on("accept-connection", ({ sender, receiver }) => {
      const senderSocketId = connectedUsers.get(sender);
      if (senderSocketId) {
        io.to(senderSocketId).emit("connection-accepted", { receiver });
      }
    });

    socket.on("decline-connection", ({ sender, receiver }) => {
      const senderSocketId = connectedUsers.get(sender);
      if (senderSocketId) {
        io.to(senderSocketId).emit("connection-decline", { receiver });
      }
    });

    // ✅ Send real-time message to receiver's room
    socket.on("send-message", ({ senderId, receiverId, message }) => {
      io.to(receiverId).emit("receive-message", {
        senderId,
        message,
        timestamp: Date.now(),
      });
    });

    socket.on("disconnect", () => {
      for (let [userId, id] of connectedUsers.entries()) {
        if (id === socket.id) { // ✅ fixed bug here (was = instead of ===)
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
};

export { io };
