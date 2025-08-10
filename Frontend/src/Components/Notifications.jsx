import React, { useState, useEffect } from 'react';
import BellButton from './BellButton';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { socket } from '../socket';
import axios from "axios";
import { toast } from 'sonner';
import useAuthStore from '../../Stores/useAuthStore';

const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    socket.connect();

    // When a new connection request arrives
    socket.on("receive-connection", ({ sender }) => {
      setNotifications(prev => [
        ...prev,
        { type: "connect", sender, receiver: { _id: currentUser?._id } }
      ]);
    });

    // Real-time accept notification for the sender
    socket.on("connection-accepted", ({ username }) => {
      toast.success(`${username} accepted your connection request`);
    });

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/connections/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure each notification has receiver info
        const withReceiver = res.data.map(n => ({
          ...n,
          receiver: n.receiver || { _id: currentUser?._id }
        }));

        setNotifications(withReceiver);
      } catch (error) {
        console.error("Error loading connect requests", error);
      }
    };

    fetchNotifications();

    return () => {
      socket.off("receive-connection");
      socket.off("connection-accepted");
    };
  }, [currentUser?._id]);

  const handleAccept = async (sender, receiver) => {
    console.log(sender,receiver)
    try {
      const senderId = sender?._id || sender;
      const receiverId = receiver?._id || receiver || currentUser?._id;

      await axios.post("http://localhost:5000/api/connections/accept", {
        senderId,
        receiverId
      });

      setNotifications(prev => prev.filter(n => (n.sender?._id || n.sender) !== senderId));

      // Toast for receiver only
      toast.success("Connection accepted successfully");

      // Notify sender in real-time
      socket.emit("accept-connection", {
        sender: senderId,
        receiver: receiverId,
        username: currentUser?.name || "Someone"
      });

    } catch (error) {
      console.error("Error accepting connection", error);
      toast.error("Failed to accept connection");
    }
  };

  const handleReject = async (sender, receiver) => {
    try {
      const senderId = sender?._id || sender;
      const receiverId = receiver?._id || receiver || currentUser?._id;

      setNotifications(prev => prev.filter(n => (n.sender?._id || n.sender) !== senderId));

      await axios.post("http://localhost:5000/api/connections/reject", {
        senderId,
        receiverId
      });
    } catch (error) {
      console.error("Error rejecting connection", error);
    }
  };

  return (
    <div className="relative">
      <BellButton onClick={() => setOpen(true)} />
      
      {notifications.length > 0 && (
        <>
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-3 h-3 animate-ping opacity-75"></span>
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center px-10">
            <div
              className="relative w-full max-w-lg bg-zinc-900 rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-5 text-gray-300 hover:text-red-500 text-4xl cursor-pointer "
                onClick={() => setOpen(false)}
              >
                &times;
              </button>

              <h3 className="font-semibold text-gray-300 text-xl mb-4 text-center">Notifications</h3>

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
                    <div className="flex gap-3">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-xs cursor-pointer"
                        onClick={() => handleAccept(n.sender, n.receiver)}
                      >
                        <FaCheckCircle size={24} />
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs cursor-pointer"
                        onClick={() => handleReject(n.sender, n.receiver)}
                      >
                        <FaTimesCircle size={24} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
