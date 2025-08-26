import { Server } from "socket.io";
import User from "./Models/User.js";
import jwt from "jsonwebtoken"; 


let io;
const connectedUsers = new Map();

export const initSocket = (server,allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"],
  });

    io.use((socket, next) => {

    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;


      if (!token) {
        return next(new Error('Unauthorized'));

      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (e) {

      next(new Error('Unauthorized'));
    }
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

   socket.on("send-message", ({ senderId, receiverId, content, tempId, conversationId }) => {
  const receiverSocketId = connectedUsers.get(receiverId);
  const senderSocketId = connectedUsers.get(senderId);

  const messagePayload = {
    _id: tempId, 
    senderId,
    receiverId,
    content,
    createdAt: new Date().toISOString(),
    conversationId,
  };

  if (receiverSocketId) io.to(receiverSocketId).emit("receive-message", messagePayload);
  


    socket.on("disconnect", () => {
      for (let [userId, id] of connectedUsers.entries()) {
        if (id === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
})};

export { io };
