import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";
import useAuthStore from "../../Stores/useAuthStore";

const ProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");
  const navigate = useNavigate();
  const debounceTimer = useRef(null);
  const { user, token } = useAuthStore.getState();

  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    age: "",
    location: "",
    skills: [""],
    lookingFor: [""],
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "location") {
      setLocationQuery(value);
    }
  };

  // Debounced fetch
  useEffect(() => {
    if (!locationQuery.trim()) {
      setCitySuggestions([]);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      fetchCities(locationQuery);
    }, 400); // 400ms delay
  }, [locationQuery]);

  const fetchCities = async (query) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          "Accept-Language": "en",
        },
      });

      const cities = res.data
        .filter((item) =>
          ["city", "town", "municipality", "village"].includes(item.type)
        )
        .map((item) => {
          const cityName =
            item.address.city ||
            item.address.town ||
            item.address.village ||
            item.address.municipality;
          const country = item.address.country;
          return {
            id: item.place_id,
            name: `${cityName}, ${country}`,
          };
        });

      setCitySuggestions(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const selectCity = (cityName) => {
    setProfile((prev) => ({
      ...prev,
      location: cityName,
    }));
    setCitySuggestions([]);
  };

  const handleSkillChange = (idx, value) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[idx] = value;
    setProfile((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleLookingForChange = (idx, value) => {
    const updated = [...profile.lookingFor];
    updated[idx] = value;
    setProfile((prev) => ({ ...prev, lookingFor: updated }));
  };

  const addSkill = () => {
    setProfile((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeSkill = (idx) => {
    const updated = profile.skills.filter((_, i) => i !== idx);
    setProfile((prev) => ({ ...prev, skills: updated }));
  };

  const addLookingForField = () => {
    setProfile((prev) => ({ ...prev, lookingFor: [...prev.lookingFor, ""] }));
  };

  const removeLookingFor = (idx) => {
    const updated = profile.lookingFor.filter((_, i) => i !== idx);
    setProfile((prev) => ({ ...prev, lookingFor: updated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("username", profile.username);
      formData.append("bio", profile.bio);
      formData.append("location", profile.location);
      formData.append("age", profile.age);
      formData.append("skills", JSON.stringify(profile.skills));
      formData.append("lookingFor", JSON.stringify(profile.lookingFor));

      if (profile.avatar) {
        const compressedAvatar = await imageCompression(profile.avatar, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 512,
          useWebWorker: true,
        });
        formData.append("avatar", compressedAvatar);
      }

      const res = await axios.post(
         `http://localhost:5000/api/profiles/setup/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile saved:", res.data);
      navigate("/home");
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mb-14 flex justify-center items-center text-white">
      <form
        onSubmit={handleSave}
        className="bg-zinc-900 rounded-xl shadow-lg p-6 w-full max-w-3xl"
      >
        {/* Avatar & Username */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={
                profile.avatar
                  ? URL.createObjectURL(profile.avatar)
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(profile.username)
              }
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border border-gray-600"
            />
            <label className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    avatar: e.target.files[0],
                  }))
                }
              />
              📷
            </label>
          </div>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full text-center text-white"
            placeholder="Username"
            required
          />
        </div>

        {/* Age & Location */}
        <div className="grid grid-cols-2 gap-4 mb-6 relative">
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="Age"
            min={16}
            required
          />
          <div className="relative">
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white w-full"
              placeholder="Enter your city"
              required
            />
            {citySuggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1 z-10">
                {citySuggestions.map((city) => (
                  <li
                    key={city.id}
                    onClick={() => selectCity(city.name)}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  >
                    {city.name}
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
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full text-white mb-6"
          placeholder="Bio"
          required
        />

        {/* Skills */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 text-gray-400">Skills</label>
            <div className="flex flex-col gap-2">
              {profile.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(idx, e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white flex-1"
                    placeholder="Skill"
                    required
                  />
                  {profile.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSkill}
                className="text-gray-400 hover:text-white"
              >
                + Add Skill
              </button>
            </div>
          </div>

          {/* Looking For */}
          <div>
            <label className="block mb-2 text-gray-400">Looking For</label>
            <div className="flex flex-col gap-2">
              {profile.lookingFor.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleLookingForChange(idx, e.target.value)
                    }
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white flex-1"
                    placeholder="Looking for"
                    required
                  />
                  {profile.lookingFor.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLookingFor(idx)}
                      className="text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLookingForField}
                className="text-gray-400 hover:text-white"
              >
                + Add More
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center items-center w-1/2 mx-auto">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg px-4 py-2 w-full ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Setting up your profile..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;
