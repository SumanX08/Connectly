import useAuthStore from "../../Stores/useAuthStore";
import React from "react";


const MessageBubble =React.memo( ({ message }) => {
  const currentUserId = useAuthStore((state) => state.user?._id);

  
  const senderId =
    typeof message.senderId === "string"
      ? message.senderId
      : message.senderId?._id ??
        message.senderId?._id ??
        message.sender; 


  const isMe = senderId && currentUserId && senderId.toString() === currentUserId.toString();
  

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] px-2 py-1 rounded-lg text-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-zinc-800 text-white rounded-bl-none"}`}>
        {message.content}
        {message.createdAt || message.timestamp ? (
          <div className="text-xs text-gray-300 mt-1">
            {new Date(message.createdAt ?? message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        ) : null}
      </div>
    </div>
  );
})

export default MessageBubble;
