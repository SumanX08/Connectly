// src/Components/ChatWindow.jsx

import MessageBubble from "./MessageBubble";
import { Send } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import useAuthStore from "../../Stores/useAuthStore";
import { socket } from "../socket";

const ChatWindow = ({ selectedUser }) => {
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
        "http://localhost:5000/api/messages/start",
        { receiverId: selectedUser._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatId(res.data._id);
      
  console.log(selectedUser._id)

    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };
  startChat();
}, [selectedUser]);

  // 🔹 Join socket room for the logged-in user

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

  // 🔹 Fetch conversation and messages when selectedUser changes
useEffect(() => {
  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/messages/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };
  fetchMessages();
}, [chatId]);

  // 🔹 Send message
  const handleSend = async () => {
  if (!input.trim()) return;
  try {
    const res = await axios.post(
      "http://localhost:5000/api/messages/send",
      {
        conversationId: chatId,
        content: input.trim(),
        receiverId:selectedUser._id,
        senderId:currentUserId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(selectedUser._id)

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
      <div className="flex-1 flex items-center justify-center text-2xl text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-4 bg-black">
      {/* Header */}
      <div className="flex gap-5 items-center mb-4">
        <img className="w-14 h-14 rounded-full" src={selectedUser.avatar} alt="" />
        <h2 className="text-gray-200 font-bold text-2xl">{selectedUser.username}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          type="text"
          placeholder="Write a message..."
          className="w-full p-3 rounded bg-[#161B22] text-white border border-gray-600"
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
    </div>
  );
};

export default ChatWindow;
