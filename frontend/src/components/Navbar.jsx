import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { toggleTheme, toggleSidebar } from '../store/uiSlice';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { darkMode } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glassmorphism py-3 px-4 md:px-6 flex justify-between items-center transition-all duration-300 border-b border-slate-200 dark:border-dark-border">
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-400 flex items-center justify-center shadow-md shadow-brand-500/20">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <span className="font-heading font-bold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-purple-500 dark:from-brand-400 dark:to-purple-300 bg-clip-text text-transparent hidden sm:inline-block">
            GitData.io
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {/* User Profile Info */}
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-all text-sm"
            >
              <div className="h-6 w-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                {user?.name ? user.name.charAt(0) : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium max-w-[120px] truncate hidden md:inline-block">
                {user?.name || 'User'}
              </span>
              {user?.role === 'admin' && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 rounded uppercase tracking-wider">
                  Admin
                </span>
              )}
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-500 border border-rose-100 dark:border-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
