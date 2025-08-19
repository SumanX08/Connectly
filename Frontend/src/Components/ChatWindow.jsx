// src/Components/ChatWindow.jsx
import React, { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import { Send, ArrowLeft } from "lucide-react";
import axios from "axios";
import useAuthStore from "../../Stores/useAuthStore";
import { socket } from "../socket";
import {motion,AnimatePresence} from "framer-motion"
import { API_URL } from "../config";

const ChatWindow = ({ selectedUser, onBack }) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  const token = useAuthStore((state) => state.token);

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const startChat = async () => {
      if (!selectedUser) return;
      try {
        const res = await axios.post(
          `${API_URL}/api/messages/start`,
          { receiverId: selectedUser._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChatId(res.data._id);
      } catch (err) {
        console.error("Failed to start chat:", err);
      }
    };
    startChat();
    console.log(selectedUser)
  }, [selectedUser]);

  useEffect(() => {
    if (currentUserId) {
      socket.connect();
      socket.emit("join", currentUserId);
    }

    socket.on("receive-message", ({ message }) => {
      if (message.conversationId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [currentUserId, chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      try {
        const res = await axios.get(
          `${API_URL}/api/messages/messages/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(
        `${API_URL}/api/messages/send`,
        {
          conversationId: chatId,
          content: input.trim(),
          receiverId: selectedUser._id,
          senderId: currentUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sentMessage = res.data;

      socket.emit("send-message", {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        message: sentMessage,
      });

      setMessages((prev) => [...prev, sentMessage]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-2xl text-gray-400 hidden  md:flex">
        Select a chat to start messaging
      </div>
    );
  }

return (
  <AnimatePresence mode="wait">

  <motion.div 
  key={selectedUser._id}
  initial={{opacity:0,x:-50}}
  animate={{opacity:1,x:0}}
  exit={{opacity:0,x:50}}
  transition={{duration:0.3}}
  className="flex flex-col md:px-6 bg-black w-full md:w-3/4" >
    <div className="flex-shrink-0 flex gap-2 items-center mb-4 pb-2 border-b border-gray-800 h-16">
      <button
        onClick={onBack}
        className="md:hidden flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="flex items-center gap-4">
        <img
          className="md:w-14 md:h-14 w-10 h-10 rounded-full"
          src={selectedUser.avatar}
          alt=""
        />
        <h2 className="text-gray-200 font-bold text-xl md:text-2xl">{selectedUser.username}</h2>
      </div>
    </div>

    {/* MESSAGES (scrollable) */}
    <div className="flex-grow flex justify-end flex-col overflow-y-auto pr-2 pb-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
    </div>

    {/* INPUT (fixed at bottom) */}
    <div className="flex-shrink-0 flex gap-2 p-2 border-t border-gray-800 bg-black">
      <input
        value={input}
        type="text"
        placeholder="Write a message..."
        className="w-full p-3 rounded bg-[#121212] text-white border border-gray-600"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="text-white p-2 rounded-full hover:bg-zinc-800 transition"
      >
        <Send size={24} className="text-gray-200" />
      </button>
    </div>
  </motion.div>
  </AnimatePresence>
);



};

export default ChatWindow;
