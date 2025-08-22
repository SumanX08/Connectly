import  { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";
import useAuthStore from "../../Stores/useAuthStore";
import { Plus, Camera } from "lucide-react";
import { API_URL } from "../config";


const ProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuthStore.getState();

  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    age: "",
    location: "",
    skills: [],        
    lookingFor: [],   
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const selectCity = (cityName, country) => {
    const formatted = `${cityName}, ${country}`;
    setProfile((prev) => ({ ...prev, location: formatted }));
    setCitySuggestions([]);
  };

  const addTag = (key, value) => {
    value = value.trim();
    if (value && !profile[key].includes(value)) {
      setProfile((prev) => ({ ...prev, [key]: [...prev[key], value] }));
    }
  };

  const handleTagInput = (e, key) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(key, e.target.value);
      e.target.value = "";
    }
  };

  const removeItem = (key, idx) => {
    const updated = [...profile[key]];
    updated.splice(idx, 1);
    setProfile((prev) => ({ ...prev, [key]: updated }));
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
navigate("/home");
    for (let [key, value] of formData.entries()) {
      (`${key}:`, value);
    }

    const res = await axios.post(
      `${API_URL}/api/profiles/setup/${user._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProfile(res.data)

    
  } catch (err) {
console.error("❌ Error saving profile:", err.response?.data || err.message);  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center text-white px-4">
      <form
        onSubmit={handleSave}
        className="bg-zinc-900 md:border-gray-500 md:border-2 md:rounded-xl shadow-lg p-6 w-full max-w-3xl"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={
                profile.avatar
                  ? URL.createObjectURL(profile.avatar)
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(profile.username || "User")
              }
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border border-gray-600"
            />
            <label className="absolute bottom-0 right-0 bg-black hover:bg-gray-600 text-white rounded-full p-2 cursor-pointer">
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
              <Camera />
            </label>
          </div>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="bg-zinc-950 border border-gray-600 rounded-lg px-4 py-2 w-full text-center text-white focus:ring focus:ring-blue-600"
            placeholder="Username"
            required
          />
        </div>

         <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 mb-6 relative">
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            className="bg-zinc-950 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring focus:ring-blue-600"
            placeholder="Age"
            min={16}
            required
          />
          <div className="relative">
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
              className="bg-zinc-950 border border-gray-600 rounded-lg px-4 py-2 text-white w-full focus:ring focus:ring-blue-600"
              placeholder="Enter your city"
              autoComplete="off"
            />
            {loadingCities && (
              <div className="text-gray-400 text-sm mt-1">Loading...</div>
            )}
            {citySuggestions.length > 0 && (
              <ul className="absolute bg-zinc-950 border border-gray-600 rounded-lg mt-1 w-full max-h-40 overflow-y-auto z-10">
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

        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          className="bg-zinc-950 border border-gray-600 rounded-lg px-4 py-2 w-full text-white mb-3 focus:ring focus:ring-blue-600"
          placeholder="Bio"
          required
        />

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {["skills", "lookingFor"].map((key) => (
            <div key={key}>
              <label className="block mb-2 text-lg text-gray-200 capitalize">
                {key === "lookingFor" ? "Looking For" : "Skills"}
              </label>
              <div className="flex gap-2">
                <input
                  onKeyDown={(e) => handleTagInput(e, key)}
                  placeholder={`Add ${key === "lookingFor" ? "role" : "skill"}`}
                  className="bg-zinc-950 text-white px-4 py-2 rounded-lg border border-gray-600 w-full focus:ring focus:ring-blue-600"
                />
                <button
                  type="button"
                  className=" px-3 rounded-md"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement.querySelector("input");
                    addTag(key, input.value);
                    input.value = "";
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {profile[key].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-black text-white px-3 py-1 text-center rounded-full flex items-center gap-2"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(key, idx)}
                      className="text-white text-xs text-center hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center w-full sm:w-1/2 mx-auto">
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
