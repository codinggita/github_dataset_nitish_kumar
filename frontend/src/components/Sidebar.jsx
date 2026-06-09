import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Star, 
  Settings as SettingsIcon,
  Shield, 
  ChevronLeft, 
  ChevronRight,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { toggleSidebar } from '../store/uiSlice';
import { logout } from '../store/authSlice';

// GitHub Octocat logo SVG
const GithubLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Sync favorites count from local storage
  const syncFavorites = () => {
    const list = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoritesCount(list.length);
  };

  useEffect(() => {
    syncFavorites();
    // Listen to storage changes
    window.addEventListener('storage', syncFavorites);
    // Focus listener to sync count when user returns to tab
    window.addEventListener('focus', syncFavorites);
    
    return () => {
      window.removeEventListener('storage', syncFavorites);
      window.removeEventListener('focus', syncFavorites);
    };
  }, [location.pathname]); // Re-sync on page navigation

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Datasets', path: '/explorer', icon: Database },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Favorites', path: '/favorites', icon: Star, badge: true },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside 
      className={`relative h-[calc(100vh-65px)] border-r border-[#d0d7de] dark:border-[#30363D] bg-[#f6f8fa] dark:bg-[#161B22] flex flex-col justify-between transition-all duration-300 z-30 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Links and Logo header */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Collapsible Logo Brand Header */}
        <div className={`p-4 border-b border-[#d0d7de] dark:border-[#30363D] flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <Link to="/" className="flex items-center gap-2.5 text-[#24292f] dark:text-[#f0f6fc] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors">
            <GithubLogo className="w-6 h-6 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="font-bold text-sm tracking-tight font-mono select-none">
                GitData explorer
              </span>
            )}
          </Link>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isFav = item.badge === true;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 group text-sm font-semibold select-none ${
                    isActive
                      ? 'bg-[#eaf5ff] text-[#0969da] dark:bg-[#21262D] dark:text-[#58A6FF] border-l-2 border-[#0969da] dark:border-[#58a6ff]'
                      : 'text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#eaeef2] dark:hover:bg-[#21262D]/60 hover:text-[#0969da] dark:hover:text-[#58a6ff]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4.5 h-4.5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </div>
                
                {/* Favorites notification bubble */}
                {isFav && !sidebarCollapsed && favoritesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eaeef2] dark:bg-[#21262D] border border-[#d0d7de] dark:border-[#30363D] text-[#57606a] dark:text-[#8b949e]">
                    {favoritesCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 2. User Profile Bottom Section */}
      <div className="border-t border-[#d0d7de] dark:border-[#30363D] p-3 space-y-2 bg-[#eaeef2]/30 dark:bg-[#0D1117]/30">
        
        {isAuthenticated && user && (
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            
            {/* User Meta Card */}
            <Link 
              to="/profile" 
              className={`flex items-center gap-2.5 overflow-hidden flex-1 p-1 hover:bg-[#eaeef2] dark:hover:bg-[#21262D] rounded-md transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <div className="h-7 w-7 rounded-full bg-[#0969da] text-white flex items-center justify-center text-xs font-bold uppercase select-none flex-shrink-0">
                {user.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
              </div>
              
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 leading-snug">
                  <p className="text-xs font-bold text-[#24292f] dark:text-[#f0f6fc] truncate">{user.name}</p>
                  <span className="text-[10px] text-[#57606a] dark:text-[#8b949e] font-mono capitalize tracking-wide flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#3FB950]" /> {user.role}
                  </span>
                </div>
              )}
            </Link>

            {/* Logout button (hidden on collapsed) */}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer"
                title="Logout Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>
        )}

        {/* Sidebar Collapse Toggle trigger */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 w-full rounded-md border border-[#d0d7de] dark:border-[#30363D] text-[#57606a] dark:text-[#8b949e] hover:bg-[#eaeef2] dark:hover:bg-[#21262D] transition-colors cursor-pointer flex justify-center items-center"
            aria-label={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-semibold select-none">
                <ChevronLeft className="w-4 h-4" /> Collapse Sidebar
              </div>
            )}
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
