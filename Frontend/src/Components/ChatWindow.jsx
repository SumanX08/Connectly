import  { useEffect, useState,useRef } from "react";
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
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);


  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

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
  }, [selectedUser]);

  useEffect(() => {
 const handler = ({ message }) => {
     if (message.conversationId === chatId) {
       setMessages((prev) => [...prev, message]);
     }
   };
   socket.on("receive-message", handler);

     return () => {
     socket.off("receive-message", handler);
   };
  }, [chatId]);

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
        setMessages(res.data.messages);
        setNextCursor(res.data.nextCursor)
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [chatId]);

  const handleLoadMore = async () => {
  if (!chatId || !nextCursor || loadingMore) return;

  setLoadingMore(true);
  try {
    const res = await axios.get(
      `${API_URL}/api/messages/messages/${chatId}?before=${nextCursor}&limit=30 `,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    setMessages((prev) => [...res.data.messages, ...prev]);
    setNextCursor(res.data.nextCursor);
  } catch (err) {
    console.error("Failed to load more messages:", err);
  } finally {
    setLoadingMore(false);
  }
};


  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      socket.emit("send-message", {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        message: sentMessage,
      });

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

 <div
  className="flex-grow overflow-y-auto pr-2 pb-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
  onScroll={(e) => {
    if (e.target.scrollTop === 0) {
      handleLoadMore();
    }
  }}
>
  {loadingMore && (
    <div className="text-center text-white text-xl">Loading...</div>
  )}
  {messages.map((msg, i) => (
    <MessageBubble key={i} message={msg} />
  ))}
  <div ref={messagesEndRef} />
</div>

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
