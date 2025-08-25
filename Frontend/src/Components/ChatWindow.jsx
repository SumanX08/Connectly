import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Send, ArrowLeft } from "lucide-react";
import axios from "axios";
import useAuthStore from "../../Stores/useAuthStore";
import { socket } from "../socket";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../config";

const ChatWindow = ({ selectedUser, onBack }) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  const token = useAuthStore((state) => state.token);

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom instantly on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  // Start chat when selected user changes
  useEffect(() => {
    if (!selectedUser) return;

    const startChat = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/api/messages/start`,
          { receiverId: selectedUser._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChatId(res.data._id);
      } catch (err) {
        console.error("Failed to start chat:", err);
      }
    };

    startChat();
    setMessages([]); // reset messages when switching chats
    setNextCursor(null);
  }, [selectedUser]);

  // Fetch messages for the chat
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/messages/messages/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data.messages);
        setNextCursor(res.data.nextCursor);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Load older messages (pagination)
  const handleLoadMore = async () => {
    if (!chatId || !nextCursor || loadingMore) return;

    setLoadingMore(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/messages/messages/${chatId}?before=${nextCursor}&limit=30`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...res.data.messages, ...prev]);
      setNextCursor(res.data.nextCursor);
    } catch (err) {
      console.error("Failed to load more messages:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Fully stable socket listener for real-time messages
  useEffect(() => {
    const handler = (message) => {
      // only add message if it belongs to current chat
      if (message.conversationId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive-message", handler);

    return () => socket.off("receive-message", handler);
  }, [chatId]);

  // Send message with optimistic UI
  const handleSend = () => {
  const messageToSend = input.trim();
  if (!messageToSend) return;

  // 1. Clear input immediately
  setInput("");

  // 2. Optimistic message
  const tempId = Math.random().toString(36);
  setMessages((prev) => [
    ...prev,
    {
      _id: tempId,
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: messageToSend,
      createdAt: new Date().toISOString(),
    },
  ]);

  // 3. Socket emit (non-blocking)
  socket.emit("send-message", {
    senderId: currentUserId,
    receiverId: selectedUser._id,
    content: messageToSend,
    tempId,
  });

  // 4. Axios post (async, non-blocking)
  
    })
    .catch((err) => {
      console.error("Failed to send message:", err);
      // optionally mark message as failed
    });
};


  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-2xl text-gray-400 hidden md:flex">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedUser._id}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:px-6 bg-black w-full md:w-3/4"
      >
        {/* Chat header */}
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
            <h2 className="text-gray-200 font-bold text-xl md:text-2xl">
              {selectedUser.username}
            </h2>
          </div>
        </div>

        {/* Messages list */}
        <div
          className="flex-grow overflow-y-auto pr-2 pb-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          onScroll={(e) => {
            if (e.target.scrollTop === 0) handleLoadMore();
          }}
        >
          {loadingMore && (
            <div className="text-center text-white text-xl">Loading...</div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg._id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
