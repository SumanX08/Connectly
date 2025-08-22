import  { useState, useEffect, useCallback, useRef } from "react";
import { Bell, SquareCheck, SquareX, X } from "lucide-react";
import { socket } from "../socket";
import axios from "axios";
import { toast } from "sonner";
import useAuthStore from "../../Stores/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../config";

const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const currentUser = useAuthStore((state) => state.user);
  const tokenRef = useRef(localStorage.getItem("token"));

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/connections/notifications`, {
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });

      const withReceiver = res.data.map((n) => ({
        ...n,
        receiver: n.receiver || { _id: currentUser?._id },
      }));

      setNotifications(withReceiver);
    } catch (error) {
      console.error("Error loading connect requests", error);
    }
  }, [currentUser?._id]);

  const handleAccept = useCallback(
    async (sender, receiver) => {
      try {
        const senderId = sender?._id || sender;
        const receiverId = receiver?._id || receiver || currentUser?._id;

        await axios.post(
          `${API_URL}/api/connections/accept`,
          { senderId, receiverId },
          { headers: { Authorization: `Bearer ${tokenRef.current}` } }
        );

        setNotifications((prev) =>
          prev.filter((n) => (n.sender?._id || n.sender) !== senderId)
        );

        toast.success("Connection accepted successfully");

        socket.emit("accept-connection", {
          sender: senderId,
          receiver: receiverId,
          username: currentUser?.name || "Someone",
        });
      } catch (error) {
        console.error("Error accepting connection", error);
        toast.error("Failed to accept connection");
      }
    },
    [currentUser?._id]
  );

  const handleReject = useCallback(
    async (sender, receiver) => {
      try {
        const senderId = sender?._id || sender;
        const receiverId = receiver?._id || receiver || currentUser?._id;

        setNotifications((prev) =>
          prev.filter((n) => (n.sender?._id || n.sender) !== senderId)
        );

        await axios.post(
          `${API_URL}/api/connections/reject`,
          { senderId, receiverId },
          { headers: { Authorization: `Bearer ${tokenRef.current}` } }
        );
      } catch (error) {
        console.error("Error rejecting connection", error);
      }
    },
    [currentUser?._id]
  );

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const receiveConnection = ({ sender }) => {
      setNotifications((prev) => [
        ...prev,
        { type: "connect", sender, receiver: { _id: currentUser?._id } },
      ]);
    };

    const connectionAccepted = ({ username }) => {
      toast.success(`${username} accepted your connection request`);
    };

    socket.on("receive-connection", receiveConnection);
    socket.on("connection-accepted", connectionAccepted);

    fetchNotifications();

    return () => {
      socket.off("receive-connection", receiveConnection);
      socket.off("connection-accepted", connectionAccepted);
    };
  }, [currentUser?._id, fetchNotifications]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer relative flex items-center justify-center w-12 h-[45px] rounded-[5px] bg-[#2e2e2e] shadow-md transition-transform duration-150 active:scale-90"
      >
        <Bell size={20} color="#f3f3f3" strokeWidth={2} />
        {notifications.length > 0 && (
          <>
            <span className="absolute top-0 right-0 bg-red-500 rounded-full w-3 h-3 animate-ping opacity-75"></span>
            <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, x: 1000, y: -500, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 1000, y: -500, scale: 0.3 }}
              transition={{ ease: "easeIn", duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-10"
            >
              <div
                className="relative w-full max-w-lg bg-zinc-900 rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-7 right-5 text-gray-300 hover:text-red-500 text-4xl cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <X size={24}/>
                </button>

                <h3 className="font-semibold text-gray-300 text-xl mb-4 text-center">
                  Notifications
                </h3>

                {notifications.length === 0 ? (
                  <p className="text-gray-100 text-center">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.sender?._id || n.sender}
                      className="flex items-center justify-between border-b border-gray-50 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={n.sender?.avatar}
                          alt="avatar"
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-100">
                          <strong className="text-lg">{n.sender?.name}</strong> wants to connect
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className=" text-white p-1   rounded-md cursor-pointer"
                          onClick={() => handleAccept(n.sender, n.receiver)}
                        >
                          <SquareCheck size={28} />
                        </button>
                        <button
                          className=" text-white p-1 rounded-md cursor-pointer"
                          onClick={() => handleReject(n.sender, n.receiver)}
                        >
                          <SquareX size={28} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
