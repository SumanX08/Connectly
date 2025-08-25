import  { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MessageCircle, User } from "lucide-react";
import { API_URL } from "../config";

const ProfileCard = lazy(() => import("./ProfileCard"));

const MatchedCard = ({ username, age, avatar, _id }) => {
  const [viewProfile, setViewProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleViewProfile = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/profiles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProfile(res.data);
      setViewProfile(true);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  return (
    <>
    <div className="p-[2px] w-9/10 m-auto rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 mt-5">
  <div className="bg-zinc-900 rounded-2xl px-4 py-6 flex flex-col items-center text-center">
          <img
            src={avatar}
            alt={`${username}'s profile`}
            className="md:w-32 md:h-32 w-28 h-28 object-cover rounded-full shadow-md mb-2"
          />
          <h2 className="text-xl font-semibold text-gray-200">
            {username}, <span className="text-gray-200 text-xl">{age}23</span>
          </h2>

          <div className="flex gap-4   mt-4">
            <button
              onClick={() => handleViewProfile(_id)}
              className="cursor-pointer flex items-center font-semibold gap-1 bg-gray-300 p-2 text-sm md:text-md rounded-lg hover:bg-gray-400 transition"
            >
              <User size={18} />
              View Profile
            </button>

            <Link to="/message">
              <button className="cursor-pointer flex items-center font-semibold gap-1 bg-gray-300 p-2 text-sm md:text-md rounded-lg hover:bg-gray-400 transition">
                <MessageCircle size={18} />
                Message
              </button>
            </Link>
          </div>
        </div>
      </div>

      {viewProfile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setViewProfile(false)}
        >
          <Suspense fallback={<div className="text-black">Loading...</div>}>
            <ProfileCard profile={selectedProfile} />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default MatchedCard;
