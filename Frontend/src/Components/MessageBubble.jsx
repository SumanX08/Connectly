import useAuthStore from "../../Stores/useAuthStore";

const MessageBubble = ({ message }) => {
  const user = useAuthStore((state) => state.user._id);

  const senderId = typeof message.senderId === "string" ? message.senderId : message.senderId?._id;
  const isMe = senderId === user;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
          isMe
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-600 text-white rounded-bl-none"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
