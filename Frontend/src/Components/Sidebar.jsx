const Sidebar = ({ matchedProfiles, onSelect, selectedUser }) => {
  return (
    <div className="border-r border-gray-800 max-w-sm w-1/3 p-4">
      {Array.isArray(matchedProfiles)&&matchedProfiles.map((user, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(user)}
          className={`flex gap-3 items-center p-2 cursor-pointer rounded transition ${
            selectedUser?._id === user._id ? "bg-zinc-800 rounded rounded-lg" : "hover:bg-zinc-900 rounded rounded-lg"
          }`}
        >
          <img className="w-12 h-12 rounded-full" src={user.avatar} alt={user.username} />
          <div>
            <h2 className="text-gray-200 font-bold">{user.username}</h2>
            <p className="text-gray-400 text-sm">{user.lastMessage}</p>
          </div>
          
        </div>
        
      ))}
    </div>
  );
};

export default Sidebar;
