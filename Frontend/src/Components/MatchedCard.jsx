import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import axios from "axios";

const MatchedCard = ({ username, age, avatar, _id }) => {
  const [viewProfile, setViewProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleViewProfile = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/profiles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedProfile(res.data);
      console.log(res.data)
       // <- access actual user object
      setViewProfile(true);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  return (
    <>
      {/* Card */}
      <div className="hover:p-1 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-700 mt-5">
        <div className="bg-zinc-900 rounded-2xl border-gray-500 border-2 w-full max-w-md mx-auto p-6  flex flex-col items-center text-center">
          <img
            src={avatar}
            alt={`${username}'s profile`}
            className="w-32 h-32 object-cover rounded-full shadow-md mb-2"
          />
          <h2 className="text-2xl font-semibold text-gray-200">
            {username}, <span className="text-gray-200 text-xl">{age}</span>
          </h2>

          <div className="flex gap-10 mt-3">
            <button
              onClick={() => handleViewProfile(_id)}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              View Profile
            </button>

            <Link to="/message">
              <button className="bg-gray-200 px-4 py-2 rounded-lg">
                Message
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal for View Profile */}
      {viewProfile && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setViewProfile(false)}
        >
        
            
            <ProfileCard profile={selectedProfile} />
          </div>
        
      )}
    </>
  );
};

export default MatchedCard;
