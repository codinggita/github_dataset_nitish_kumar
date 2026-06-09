import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  User as UserIcon, 
  LogOut, 
  Menu,
  Settings,
  Check,
  AlertCircle
} from 'lucide-react';
import { toggleTheme, toggleSidebar } from '../store/uiSlice';
import { logout } from '../store/authSlice';
import { setSearchQuery } from '../store/datasetSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { darkMode } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Search input state
  const [searchVal, setSearchVal] = useState('');
  
  // Dropdowns states
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const clickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchVal));
    if (location.pathname !== '/explorer') {
      navigate('/explorer');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  // Mock notifications list
  const notifications = [
    { id: 1, text: 'MongoDB datasets synchronized successfully.', time: '10m ago', unread: true, type: 'success' },
    { id: 2, text: 'Python functions dataset imported.', time: '1h ago', unread: false, type: 'info' },
    { id: 3, text: 'Backup operation completed.', time: '1d ago', unread: false, type: 'info' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#161B22] border-b border-[#30363D] px-4 py-2.5 flex items-center justify-between transition-all duration-300">
      
      {/* 1. Left Section: Sidebar Toggle & Brand Logo */}
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-md text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#30363D] transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 mr-4">
          <span className="font-semibold text-sm tracking-tight text-[#F0F6FC] hover:text-[#58A6FF] transition-all font-mono select-none hidden sm:inline-block">
            GitData.io
          </span>
        </Link>

        {/* Global Dataset Search Box */}
        <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-64 md:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
          <input
            type="text"
            placeholder="Search datasets globally..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-[#0D1117] border border-[#30363D] rounded-md text-xs text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all font-semibold"
          />
        </form>
      </div>

      {/* 2. Right Section: Theme Toggle, Notifications, User Dropdown */}
      <div className="flex items-center gap-3">
        
        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-1.5 rounded-md text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#30363D] transition-colors cursor-pointer border border-[#30363D]"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-1.5 rounded-md text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#30363D] transition-colors cursor-pointer border border-[#30363D] relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#F0883E]" />
                )}
              </button>

              {/* Notification Dropdown Pane */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#21262D] border border-[#30363D] shadow-2xl p-2 z-50 text-xs animate-fade-in text-[#c9d1d9]">
                  <div className="px-3 py-2 border-b border-[#30363D] font-bold text-[#F0F6FC] flex justify-between items-center">
                    <span>Notifications</span>
                    <span className="text-[10px] text-[#58A6FF] hover:underline cursor-pointer">Mark all read</span>
                  </div>
                  
                  <div className="divide-y divide-[#30363D] max-h-60 overflow-y-auto mt-1">
                    {notifications.map((item) => (
                      <div key={item.id} className="p-3 hover:bg-[#161B22] transition-colors space-y-1 rounded-md">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-[#F0F6FC] pr-2 leading-relaxed">{item.text}</p>
                          {item.unread && <span className="h-2 w-2 rounded-full bg-[#58A6FF] mt-1 flex-shrink-0" />}
                        </div>
                        <span className="text-[10px] text-[#8B949E]">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar & Dropdown Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 rounded-md hover:bg-[#30363D] transition-colors cursor-pointer"
              >
                <div className="h-7 w-7 rounded-full bg-[#0969da] text-white flex items-center justify-center text-xs font-bold uppercase select-none border border-[#30363D]">
                  {user?.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#21262D] border border-[#30363D] shadow-2xl z-50 overflow-hidden animate-fade-in text-xs">
                  <div className="p-3 border-b border-[#30363D] text-[#8B949E]">
                    <span className="block text-[#c9d1d9] font-bold">Signed in as</span>
                    <span className="block font-semibold text-[#F0F6FC] truncate">{user?.email || 'user@example.com'}</span>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="w-full text-left px-3 py-2 text-[#c9d1d9] hover:bg-[#30363D] hover:text-[#F0F6FC] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-[#8B949E]" /> Profile Settings
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="w-full text-left px-3 py-2 text-[#c9d1d9] hover:bg-[#30363D] hover:text-[#F0F6FC] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4 text-[#8B949E]" /> Developer Settings
                    </Link>
                  </div>

                  <div className="p-1.5 border-t border-[#30363D]">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#c9d1d9] hover:text-[#F0F6FC] border border-[#30363D] hover:bg-[#30363D] transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white transition-all shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

    </header>
  );
};

export default Navbar;
