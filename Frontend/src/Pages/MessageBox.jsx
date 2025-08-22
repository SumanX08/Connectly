
import React, { useEffect, useState } from 'react';
import useMatchedStore from "../../Stores/useMatchedStore.js"
import Sidebar from '../Components/Sidebar';
import ChatWindow from '../Components/ChatWindow';

const MessageBox = () => {
  const matchedProfiles = useMatchedStore((state) => state.matchedProfiles);
  const fetchMatchedProfilesWithLastMessages = useMatchedStore(
    (state) => state.fetchMatchedProfilesWithLastMessages
  );
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user"); 
    if (userId) {
      fetchMatchedProfilesWithLastMessages(userId);
    }
    
  }, []);

  return (
    <div className="flex  min-h-screen max-h-screen py-18  bg-black text-white px-6">
      <div
        className={`
          ${selectedUser ? "hidden" : "block"}
          md:block
          w-full md:w-1/4
          md:border-r md:border-gray-800
          
          overflow-auto
        `}
      >
        <Sidebar
          matchedProfiles={matchedProfiles}
          onSelect={setSelectedUser}
          selectedUser={selectedUser}
        />
      </div>
     
        <ChatWindow selectedUser={selectedUser} onBack={() => setSelectedUser(null)} />
    </div>
  );
};


export default MessageBox;