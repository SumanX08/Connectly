const Sidebar = ({ matchedProfiles, onSelect, selectedUser, }) => {
  return (
    <div className=" h-full md:max-w-sm py-4">
      {Array.isArray(matchedProfiles) &&
        matchedProfiles.map((user, idx) => (
          <div
            key={user._id ?? idx}
            onClick={() => {onSelect(user)
            }}
            className={`flex gap-3 items-center rounded p-2 cursor-pointer  transition border-b border-gray-800 ${
              selectedUser?._id === user._id ? "bg-zinc-800 " : "hover:bg-zinc-900 "
            }`}
          >
            <img className="w-12 h-12 rounded-full" src={user.avatar} alt={user.username} />
            <div>
              <h2 className="text-gray-200 font-bold">{user.username}</h2>
              <p className="text-gray-400 text-sm">{user.lastMessage ?? "No messages yet"}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
