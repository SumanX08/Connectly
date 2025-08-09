// --- TagInput.jsx ---
import { useState } from "react";
import { Plus, X } from "lucide-react";

const TagInput = ({ label, tags, setTags }) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <div className="flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md bg-[#0d1117]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${label.toLowerCase()}`}
          className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
        />
        <button
          type="button"
          onClick={addTag}
          className="text-gray-400 hover:text-white"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-800 text-white rounded-full"
          >
            <span>{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-red-400 text-gray-300"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
