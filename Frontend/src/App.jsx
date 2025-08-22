import React, { useState,Suspense, lazy,useEffect } from "react";
import Navbar from "./Components/Navbar";
import LogoBar from "./Components/LogoBar";
import Filters from "./Pages/Filters";
import { Routes, Route } from "react-router";
import LandingPage from "./Pages/LandingPage";
import AuthForm from "./Pages/AuthForm";
import useAuthStore from "../Stores/useAuthStore";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import MessageBox from "./Pages/MessageBox";
import ProfileSetup from "./Pages/ProfileSetup";
import { useLocation } from "react-router-dom";
import ResetPassword from "./Pages/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword";
import OAuthSuccess from "./Pages/OAuthSuccess";
import { Toaster } from "sonner"
import PageWrapper from "./Components/PageWrapper";
import { AnimatePresence } from "framer-motion";
import { socket } from "./socket";


const Home = lazy(() => import("./Pages/Home"));
const Profile = lazy(() => import("./Pages/Profile"));
const Matches=lazy(() => import("./Pages/Matches"))


function App() {
  const [activePage, setActivePage] = useState("home");
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const currentUserId = useAuthStore((s) => s.user?._id);
  const isAuthPage = location.pathname === '/login' ||location.pathname ===  '/signup'|| location.pathname === '/'

  useEffect(() => {
    if (!currentUserId) return;
    socket.connect();
    socket.emit("join", currentUserId);

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);





  const handleLogout = () => {
    // TODO: Add logout logic here
    alert("Logged out!");
  };



  return (
    <div className=" flex flex-col bg-black">

      <LogoBar onLogout={handleLogout} />
      <AnimatePresence>
        <Suspense fallback={<div>Loading...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/signup" element={<AuthForm />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profileSetup" element={<ProtectedRoutes><ProfileSetup /></ProtectedRoutes>} />
          <Route path="/home" element={<ProtectedRoutes><PageWrapper><Home /></PageWrapper></ProtectedRoutes>} />
          <Route path="/matches" element={<ProtectedRoutes><PageWrapper><Matches /></PageWrapper></ProtectedRoutes>} />
          <Route path="message" element={<ProtectedRoutes><PageWrapper><MessageBox /></PageWrapper></ProtectedRoutes>} />
          <Route path="/profile" element={<ProtectedRoutes><PageWrapper><Profile /></PageWrapper></ProtectedRoutes>} />
          <Route path="/filters" element={<ProtectedRoutes><PageWrapper><Filters /></PageWrapper></ProtectedRoutes>} />

        </Routes>
        </Suspense>
      </AnimatePresence>
      <Toaster position="top-center" richColors closeButton theme="dark" />
      {isAuthenticated && !isAuthPage && (
        <Navbar active={activePage} onNavigate={setActivePage} />
      )}

    </div>
  );
}

export default App;
