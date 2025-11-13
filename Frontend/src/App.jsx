import React, { useState, Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import Navbar from "./Components/Navbar";
import LogoBar from "./Components/LogoBar";
import PageWrapper from "./Components/PageWrapper";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import useAuthStore from "../Stores/useAuthStore";
import useUnreadStore from "../Stores/useUnreadStore";
import { socket } from "./socket";
import axios from "axios";
import { API_URL } from "./config";

// Lazy pages
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const AuthForm = lazy(() => import("./Pages/AuthForm"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const OAuthSuccess = lazy(() => import("./Pages/OAuthSuccess"));
const ProfileSetup = lazy(() => import("./Pages/ProfileSetup"));
const Home = lazy(() => import("./Pages/Home"));
const Connections = lazy(() => import("./Pages/Connections"));
const MessageBox = lazy(() => import("./Pages/MessageBox"));
const Profile = lazy(() => import("./Pages/Profile"));
const Filters = lazy(() => import("./Pages/Filters"));

function App() {

  console.log(API_URL)
  const location = useLocation();
  const { user, isAuthenticated, token } = useAuthStore();
  const currentUserId = user?._id;
  const isAuthPage =
    ["/", "/login", "/signup"].includes(location.pathname);

  const setUnreadCounts = useUnreadStore((state) => state.setUnreadCounts);
  const incrementUnread = useUnreadStore((state) => state.incrementUnread);

  // --- Fetch conversations on load ---
  useEffect(() => {
    if (!currentUserId || !token) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Map to { conversationId: unreadCount }
        const counts = {};
        res.data.forEach((conv) => {
          counts[conv._id] = conv.unreadCount;
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };

    fetchConversations();
  }, [currentUserId, token, setUnreadCounts]);

  // --- Setup socket ---
  useEffect(() => {
    if (!currentUserId) return;

    socket.connect();
    socket.emit("join", currentUserId);

    socket.on("receive-message", (msg) => {
      if (!msg.conversationId) return;

      // If the chat page for this conversation is open, do not increment
      const activeConversationId = sessionStorage.getItem("activeConversationId");
      if (activeConversationId === msg.conversationId) return;

      incrementUnread(msg.conversationId);
    });

    return () => {
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [currentUserId, incrementUnread]);

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="flex flex-col bg-black min-h-screen">
      <LogoBar onLogout={handleLogout} />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="bg-black text-white">Loading...</div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/signup" element={<AuthForm />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/profileSetup"
              element={
                <ProtectedRoutes>
                  <ProfileSetup />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoutes>
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                </ProtectedRoutes>
              }
            />
            <Route
              path="/connections"
              element={
                <ProtectedRoutes>
                  <PageWrapper>
                    <Connections />
                  </PageWrapper>
                </ProtectedRoutes>
              }
            />
            <Route
              path="/message"
              element={
                <ProtectedRoutes>
                  <PageWrapper>
                    <MessageBox />
                  </PageWrapper>
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <PageWrapper>
                    <Profile />
                  </PageWrapper>
                </ProtectedRoutes>
              }
            />
            <Route
              path="/filters"
              element={
                <ProtectedRoutes>
                  <PageWrapper>
                    <Filters />
                  </PageWrapper>
                </ProtectedRoutes>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Toaster position="top-center" richColors closeButton theme="dark" />
      {isAuthenticated && !isAuthPage && <Navbar />}
    </div>
  );
}

export default App;
