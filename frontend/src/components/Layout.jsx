import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Top Navigation Header */}
      <Navbar />

      {/* Main Core Body */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Nav Navigation */}
        <Sidebar />

        {/* Dynamic Inner Right Content */}
        <div className="flex-1 flex flex-col h-[calc(100vh-65px)] overflow-y-auto bg-slate-50/50 dark:bg-dark-bg/20">
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
