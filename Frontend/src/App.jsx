import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import LogoBar from "./Components/LogoBar";
import Home from "./Pages/Home";
import Matches from "./Pages/Matches";
import Profile from "./Pages/Profile";
import Filters from "./Pages/Filters";
import { Routes,Route } from "react-router";
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
import {Toaster} from "sonner"


function App() {
  const [activePage, setActivePage] = useState("home");
    const { isAuthenticated } = useAuthStore();
const location = useLocation();
  const isLandingPage = location.pathname === '/';
    

  const handleLogout = () => {
    // TODO: Add logout logic here
    alert("Logged out!");
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home />;
      case "matches":
        return <Matches />;
      case "profile":
        return <Profile />;
      case "filters":
        return <Filters />;
      default:
        return <Home />;
    }
  };

  return (
    <div className=" flex flex-col bg-black">
        <LogoBar onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/signup" element={<AuthForm />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profileSetup" element={<ProtectedRoutes><ProfileSetup/></ProtectedRoutes>} />
          <Route path="/home" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
          <Route path="/matches" element={<ProtectedRoutes><Matches /></ProtectedRoutes>} /> 
          <Route path="message" element={<ProtectedRoutes><MessageBox/></ProtectedRoutes>} />
          <Route path="/profile" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
          <Route path="/filters" element={<ProtectedRoutes><Filters /></ProtectedRoutes>} />
         
        </Routes>
         <Toaster position="top-center" richColors closeButton theme="dark" />
   {isAuthenticated && !isLandingPage && (
        <Navbar active={activePage} onNavigate={setActivePage} />
      )}
      
    </div>
  );
}

export default App;
