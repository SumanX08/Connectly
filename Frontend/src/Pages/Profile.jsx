import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuthStore from "../../Stores/useAuthStore";
import { Plus } from "lucide-react";

const initialProfile = {
  username: "",
  age: null,
  location: "",
  bio: "",
  skills: [],
  lookingFor: [],
  image: "",
};

function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const navigate = useNavigate();
  const { user, token } = useAuthStore.getState();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/profiles/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    if (user?._id) fetchProfile();
  }, [user, token]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/profiles/setup/${user._id}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile saved!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const removeItem = (key, idx) => {
    const updated = [...profile[key]];
    updated.splice(idx, 1);
    setProfile((prev) => ({ ...prev, [key]: updated }));
  };

  const addTag = (e, key) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !profile[key].includes(value)) {
        setProfile((prev) => ({ ...prev, [key]: [...prev[key], value] }));
      }
      e.target.value = "";
    }
  };

  // Fetch city suggestions from Nominatim (only cities)
  const fetchCities = useCallback(async (query) => {
    if (!query.trim()) {
      setCitySuggestions([]);
      return;
    }

    setLoadingCities(true);
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
          featuretype: "city",
        },
        headers: {
          "User-Agent": "SkillNetApp/1.0 (contact@yourapp.com)",
        },
      });

      const filtered = res.data
        .filter((item) =>
          item.address &&
          (item.address.city || item.address.town || item.address.village)
        )
        .map((item) => ({
          name:
            item.address.city ||
            item.address.town ||
            item.address.village,
          country: item.address.country,
        }));

      setCitySuggestions(filtered);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // Debounce city search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (profile.location) fetchCities(profile.location);
    }, 300);
    return () => clearTimeout(timeout);
  }, [profile.location, fetchCities]);

  const handleCityInput = (e) => {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, location: value }));
  };

  const selectCity = (cityName, country) => {
    const formatted = `${cityName}, ${country}`;
    setProfile((prev) => ({ ...prev, location: formatted }));
    setCitySuggestions([]);
  };

  return (
    <div className="min-h-screen mb-14 flex justify-center items-center text-white">
      <form
        onSubmit={handleSave}
        className="bg-zinc-900 border-gray-500 border-2 rounded-xl shadow-lg p-6 w-full max-w-3xl"
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={
                profile.image ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(profile.username || "")
              }
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border border-gray-600"
            />
            <label className="absolute bottom-0 right-0 bg-black hover:bg-gray-600 text-white rounded-full p-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-1.688 1.687M7.5 16.5H3.75M7.5 16.5v-3.75M16.862 4.487L7.5 16.5"
                />
              </svg>
            </label>
          </div>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="bg-black border border-gray-600 rounded-lg px-4 py-2 w-full text-center text-white"
            placeholder="Username"
            required
          />
        </div>

        {/* Age & Location */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            name="age"
            value={profile.age || ""}
            onChange={handleChange}
            className="bg-black border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="Age"
            min={16}
            required
          />

          <div className="relative">
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleCityInput}
              className="bg-black border border-gray-600 rounded-lg px-4 py-2 text-white w-full"
              placeholder="Enter your city"
              autoComplete="off"
            />
            {loadingCities && (
              <div className="text-gray-400 text-sm mt-1">Loading...</div>
            )}
            {citySuggestions.length > 0 && (
              <ul className="absolute bg-black border border-gray-600 rounded-lg mt-1 w-full max-h-40 overflow-y-auto z-10">
                {citySuggestions.map((city, idx) => (
                  <li
                    key={idx}
                    onClick={() => selectCity(city.name, city.country)}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  >
                    {city.name}, {city.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bio */}
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          className="bg-black border border-gray-600 rounded-lg px-4 py-2 w-full text-white mb-3"
          placeholder="Bio"
          required
        />

        {/* Skills & Looking For */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {["skills", "lookingFor"].map((key) => (
            <div key={key}>
              <label className="block mb-2 text-lg text-gray-200 capitalize">
                {key === "lookingFor" ? "Looking For" : "Skills"}
              </label>
              <div>
                <div className="flex gap-2">
                  <input
                    onKeyDown={(e) => addTag(e, key)}
                    placeholder={`Add ${key === "lookingFor" ? "role" : "skill"}`}
                    className="bg-black text-white px-4 py-2 rounded-lg border border-gray-600 w-full"
                  />
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {profile[key].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-black text-white px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(key, idx)}
                        className="text-white text-xs hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-center items-center w-1/2 mx-auto">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 w-full"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
