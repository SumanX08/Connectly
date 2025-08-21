import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuthStore from "../../Stores/useAuthStore";
import { Plus, Camera } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "../config";


const initialProfile = {
  username: "",
  age: "",
  location: "",
  bio: "",
  skills: [],
  lookingFor: [],
  image: "",
};

const Profile=React.memo(()=> {
  const [profile, setProfile] = useState(initialProfile);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const navigate = useNavigate();
  const { user, token } = useAuthStore.getState();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/profiles/${user._id}`,
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
      await axios.post(
        `${API_URL}/api/profiles/setup/${user._id}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile saved!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile");
    }
  };

  const removeItem = (key, idx) => {
    const updated = [...profile[key]];
    updated.splice(idx, 1);
    setProfile((prev) => ({ ...prev, [key]: updated }));
  };

  const addTag = (key, value) => {
    value = value.trim();
    if (value && !profile[key].includes(value)) {
      setProfile((prev) => ({ ...prev, [key]: [...prev[key], value] }));
    }
  };

  // handle Enter
  const handleTagInput = (e, key) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(key, e.target.value);
      e.target.value = "";
    }
  };

  // Fetch city suggestions
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
          "User-Agent": "Connectly/1.0 (contact@connectly.com)",
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (profile.location) fetchCities(profile.location);
    }, 300);
    return () => clearTimeout(timeout);
  }, [profile.location, fetchCities]);

  const handleCityInput = (e) => {
    setProfile((prev) => ({ ...prev, location: e.target.value }));
  };

  const selectCity = (cityName, country) => {
    setProfile((prev) => ({ ...prev, location: `${cityName}, ${country}` }));
    setCitySuggestions([]);
  };

  return (
    <div className="min-h-screen flex justify-center items-center text-white px-4">
      <form
        onSubmit={handleSave}
        className="bg-zinc-900 md:border-gray-500 md:border-2 md:rounded-xl shadow-lg p-6 w-full max-w-3xl"
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
              <Camera />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            name="age"
            value={profile.age}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {["skills", "lookingFor"].map((key) => (
            <div key={key}>
              <label className="block mb-2 text-lg text-gray-200 capitalize">
                {key === "lookingFor" ? "Looking For" : "Skills"}
              </label>
              <div className="flex gap-2">
                <input
                  onKeyDown={(e) => handleTagInput(e, key)}
                  placeholder={`Add ${key === "lookingFor" ? "role" : "skill"}`}
                  className="bg-black  text-white px-4 py-2 rounded-lg border border-gray-600 w-full"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement.querySelector("input");
                    addTag(key, input.value);
                    input.value = "";
                  }}
                  className=" text-white rounded-md px-2"
                >
                  <Plus size={18} />
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
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-center items-center w-full sm:w-1/2 mx-auto">
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
})

export default Profile;
