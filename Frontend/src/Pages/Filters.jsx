import React, { useState } from 'react';
import useFilterStore from '../../Stores/useFilterStore';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';


export default function Filters() {
  const {
    setSkills,
    setLocation,
    setAgeRange,
    filters: { skills, location, ageRange },
  } = useFilterStore();

  const [localSkills, setLocalSkills] = useState(skills.length ? skills : []);
  const [skillInput, setSkillInput] = useState('');
  const [localLocation, setLocalLocation] = useState(location);
  const [localAgeRange, setLocalAgeRange] = useState(ageRange);
  const navigate=useNavigate()

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !localSkills.includes(trimmed)) {
      setLocalSkills((prev) => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (idx) => {
    setLocalSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAgeChange = (idx, value) => {
    const newRange = [...localAgeRange];
    newRange[idx] = Number(value);
    setLocalAgeRange(newRange);
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setSkills(localSkills);
  setLocation(localLocation);
  setAgeRange(localAgeRange);

  // ✅ Log local values (actual submission data)
  console.log("Submitting filters:", {
    skills: localSkills,
    location: localLocation,
    ageRange: localAgeRange,
  });

  toast.info("Filter Applied")
  navigate("/home")

};

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 rounded-2xl shadow-md border border-gray-500 p-6 w-full max-w-lg flex flex-col gap-6 mx-2"
      >
        <h2 className="text-2xl font-bold text-gray-50 mb-2">Filters</h2>

        {/* Skills Input */}
        <div className="flex flex-col gap-2 text-gray-50">
          <label className="font-medium">Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add skill"
              className="bg-black text-white px-4 py-2 rounded-lg border border-2 border-gray-600 w-full"
            />
            <button
              type="button"
              onClick={addSkill}
              className="text-gray-400 hover:text-white"
            >
              <Plus />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {localSkills.map((item, idx) => (
              <div
                key={idx}
                className="bg-black text-white px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="text-white text-xs hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2 text-gray-50">
          <label className="font-medium">Location</label>
          <input
            type="text"
            value={localLocation}
            onChange={(e) => setLocalLocation(e.target.value)}
            className="border bg-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="e.g. New York, Remote"
          />
        </div>

        {/* Age Range */}
        <div className="flex flex-col gap-2 text-gray-50">
          <label className="font-medium">Age Range</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
      
              value={localAgeRange[0]}
              onChange={(e) => handleAgeChange(0, e.target.value)}
              className="border bg-black rounded-lg px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              
              value={localAgeRange[1]}
              onChange={(e) => handleAgeChange(1, e.target.value)}
              className="border bg-black rounded-lg px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
}
