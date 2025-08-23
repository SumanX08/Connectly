import React from 'react';
import useAuthStore from '../../Stores/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import Notifications from './Notifications';
import { LogOut } from 'lucide-react'; // ✅ Lucide icon

function LogoBar() {
  const logout = useAuthStore((state) => state.logout);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const isAuth = location.pathname === '/login' || location.pathname === '/signup' || location.pathname==='/';

  return (
    <div className="bg-black fixed flex items-center justify-between px-4 pb-2 border-b border-gray-50 w-full top-0 left-0 right-0 z-20 shadow-md">
      <div className="w-[100px] mt-2 justify-start">
        {!isAuth && isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer flex items-center justify-center w-12 h-[45px] rounded-[5px] bg-[#2e2e2e] shadow-md transition-transform duration-150 active:scale-90"
          >
            <LogOut size={20} color="#f3f3f3" strokeWidth={2} />
          </button>
        ) : (
          <div className="w-12 h-[45px]" /> 
        )}
      </div>

      <img
        src="../assets/l1.png"
        alt="Connectly"
        className="w-20 h-5 object-contain text-gray-50 font-semi text-xl"
      />

      <div className="w-[100px] mt-2 flex justify-end">
        {!isAuth && isAuthenticated ? null : <Notifications />}
      </div>
    </div>
  );
}

export default LogoBar;
