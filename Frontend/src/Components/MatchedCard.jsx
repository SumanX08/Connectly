import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import axios from "axios";
import { MessageCircle, User } from "lucide-react";
import { API_URL } from "../config";


const MatchedCard = ({ username, age, avatar, _id }) => {
  const [viewProfile, setViewProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleViewProfile = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/profiles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedProfile(res.data);
      setViewProfile(true);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  return (
    <>
      {/* Card */}
      <div className="p-1 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 mt-5 transition-transform duration-200 hover:scale-105">
        <div className="bg-zinc-900 rounded-2xl px-2 py-4 flex flex-col items-center text-center hover:border-transparent">
          <img
            src={avatar}
            alt={`${username}'s profile`}
            className="w-32 h-32 object-cover rounded-full shadow-md mb-2"
          />
          <h2 className="text-2xl  font-semibold text-gray-200">
            {username}, <span className="text-gray-200 text-xl">{age}23</span>
          </h2>

          <div className="flex gap-4 mt-4">
            {/* View Profile Button */}
            <button
              onClick={() => handleViewProfile(_id)}
              className="cursor-pointer flex items-center gap-1 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition"
            >
              <User size={18} />
              View Profile
            </button>

            {/* Message Button */}
            <Link to="/message">
              <button className="cursor-pointer flex items-center gap-1 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition">
                <MessageCircle size={18} />
                Message
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal for View Profile */}
      {viewProfile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setViewProfile(false)}
        >
          <ProfileCard profile={selectedProfile} />
        </div>
      )}
    </>
  );
};

export default MatchedCard;
