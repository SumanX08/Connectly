import React from 'react';
import useAuthStore from '../../Stores/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import Notifications from './Notifications';

function LogoBar() {
  const logout = useAuthStore((state) => state.logout);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLanding = location.pathname === '/';

  return (
    <div className="bg-black fixed flex items-center justify-between px-4 py-2 border-b border-gray-50 w-full top-0 left-0 right-0 z-20 shadow-md h-[60px]">
      {/* Left section (Logout button or empty space) */}
      <div className="w-[100px] flex justify-start">
        {!isLanding && isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="group flex items-center justify-start w-12 hover:w-28 h-[45px] rounded-[5px] bg-[#2e2e2e] shadow-md overflow-hidden transition-all duration-300 ease-linear active:translate-x-[2px] active:translate-y-[2px]"
          >
            <div className="w-full flex items-center justify-center transition-all duration-300 group-hover:-translate-x-9">
              <svg viewBox="0 0 512 512" className="w-5">
                <path
                  fill="#f3f3f3"
                  d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                />
              </svg>
            </div>
            <div className="absolute right-0 w-0 opacity-0 text-[#f3f3f3] text-[1.2em] font-semibold transition-all duration-300 group-hover:w-[70%] group-hover:opacity-100 group-hover:pr-[10px]">
              Logout
            </div>
          </button>
        ) : (
          <div className="w-12 h-[45px]" /> // placeholder for layout consistency
        )}
      </div>

      {/* Center Logo */}
      <img
        src="../assets/l1.png"
        alt="Connectly"
        className="w-20 h-5 object-contain text-gray-50 font-bold text-lg"
      />

      {/* Right section (Notifications or empty space) */}
      <div className="w-[100px] flex justify-end">
        {!isLanding && isAuthenticated ? (
          <Notifications />
        ) : (
          <div className="w-8 h-8" /> // placeholder
        )}
      </div>
    </div>
  );
}

export default LogoBar;
