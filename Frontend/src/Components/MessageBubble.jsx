import useAuthStore from "../../Stores/useAuthStore";

const MessageBubble = ({ message }) => {
  console.log(message)
  const currentUserId = useAuthStore((state) => state.user?._id);

  // message may be returned different shapes:
  // - { senderId: ObjectId/string, content, ... }
  // - { sender: { _id, username }, content, ... } (if populated)
  
  const senderId =
    typeof message.senderId === "string"
      ? message.senderId
      : message.senderId?._id ??
        message.senderId?._id ??
        message.sender; // last fallback


  const isMe = senderId && currentUserId && senderId.toString() === currentUserId.toString();
  console.log(senderId,currentUserId)

  console.log(isMe)

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] px-2 py-1 rounded-lg text-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-600 text-white rounded-bl-none"}`}>
        {message.content}
        {/* optional timestamp */}
        {message.createdAt || message.timestamp ? (
          <div className="text-xs text-gray-300 mt-1">
            {new Date(message.createdAt ?? message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MessageBubble;
