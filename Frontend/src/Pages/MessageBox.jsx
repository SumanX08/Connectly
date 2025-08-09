// src/Pages/MessageBox.jsx

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
    const userId = localStorage.getItem("user"); // or however you store it
    if (userId) {
      fetchMatchedProfilesWithLastMessages(userId);
    }
  }, []);

  return (
    <div className="flex min-h-screen max-h-screen py-20 gap-4 bg-black text-white px-6">
      <Sidebar
        matchedProfiles={matchedProfiles}
        onSelect={setSelectedUser}
        selectedUser={selectedUser}
      />
      <ChatWindow selectedUser={selectedUser} />
    </div>
  );
};

export default MessageBox;
