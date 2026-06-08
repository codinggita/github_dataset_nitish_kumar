import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  User, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { toggleSidebar } from '../store/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Datasets Explorer', path: '/explorer', icon: Database },
    { name: 'Analytics Insights', path: '/analytics', icon: BarChart3 },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  // If user is administrator, add the admin menu item
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const displayItems = isAdmin 
    ? [...menuItems, { name: 'Admin Users', path: '/admin/users', icon: ShieldAlert }] 
    : menuItems;

  return (
    <aside 
      className={`relative h-[calc(100vh-65px)] border-r border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card/30 flex flex-col transition-all duration-300 z-30 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Links list */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {displayItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-card/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle trigger */}
      <div className="p-3 border-t border-slate-200 dark:border-dark-border flex justify-end">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-dark-border text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-colors cursor-pointer"
          aria-label={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
