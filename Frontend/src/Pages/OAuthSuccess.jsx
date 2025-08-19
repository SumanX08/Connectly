import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../Stores/useAuthStore";
import { API_URL } from "../config";


const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      console.error("No token found in URL");
      navigate("/login");
      return;
    }

    // Fetch the user profile to decide where to redirect
    fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          console.error("No user returned from /me endpoint");
          navigate("/login");
          return;
        }

        // Save to Zustand
        setUser(data.user, token);

        // Check if the user has completed profile
        const isProfileComplete =
          data.user.username && data.user.skills?.length > 0;

        if (isProfileComplete) {
          navigate("/home");
        } else {
          navigate("/profileSetup");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        navigate("/login");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Logging you in...
    </div>
  );
};

export default OAuthSuccess;
