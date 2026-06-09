import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShieldCheck, 
  Database, 
  BarChart3, 
  FileJson, 
  Users, 
  Sun,
  Moon,
  Zap,
  ArrowRight
} from 'lucide-react';
import { toggleTheme } from '../store/uiSlice';

const LandingPage = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    fetch(`${baseUrl}/system/health`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API down');
      })
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0c10] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* 1. Public Header/Navbar */}
      <header className="sticky top-0 z-50 glassmorphism py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 border-b border-slate-200/50 dark:border-dark-border/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-purple-500 dark:from-brand-400 dark:to-purple-300 bg-clip-text text-transparent">
            GitData.io
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <Link
            to="/login"
            className="px-5 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* 2. Hero Presentation */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 md:px-12 text-center max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* API Health Pill */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              apiStatus === 'online' ? 'bg-emerald-400' : apiStatus === 'offline' ? 'bg-rose-400' : 'bg-amber-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              apiStatus === 'online' ? 'bg-emerald-500' : apiStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500'
            }`}></span>
          </span>
          <span className="text-slate-600 dark:text-slate-300">
            API Gateway: {apiStatus === 'online' ? 'Operational' : apiStatus === 'offline' ? 'Offline' : 'Connecting...'}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-5xl">
          Supercharge Your Analytics For{' '}
          <span className="bg-gradient-to-r from-brand-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            GitHub Datasets
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
          Unlock granular dataset operations. Manage MongoDB collections, analyze repository distributions, perform live CRUD actions, and configure RBAC authorization policies in one beautiful panel.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-16">
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-600/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-xl font-bold bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
          >
            Sign In Dashboard
          </Link>
        </div>

        {/* Mockup Dashboard Preview Container */}
        <div className="w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-dark-border bg-white/70 dark:bg-dark-card/30 p-4 shadow-2xl backdrop-blur-md animate-fade-in mb-24">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-dark-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-rose-500" />
              <span className="h-3.5 w-3.5 rounded-full bg-amber-500" />
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
            </div>
            <div className="px-6 py-1 rounded bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-dark-border text-xs text-slate-400 select-none">
              https://gitdata.io/dashboard
            </div>
            <div className="w-8" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50">
              <div className="text-xs text-slate-400 mb-1">Total Datasets</div>
              <div className="text-2xl font-bold font-heading text-brand-600 dark:text-brand-400">115,011</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50">
              <div className="text-xs text-slate-400 mb-1">Active Repositories</div>
              <div className="text-2xl font-bold font-heading text-purple-500">2,481</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50">
              <div className="text-xs text-slate-400 mb-1">Total Python Functions</div>
              <div className="text-2xl font-bold font-heading text-emerald-500">42,912</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50">
              <div className="text-xs text-slate-400 mb-1">API Response Time</div>
              <div className="text-2xl font-bold font-heading text-blue-500">48 ms</div>
            </div>
          </div>
        </div>

      </section>

      {/* 3. Features Cards Grid */}
      <section className="py-20 bg-slate-100/50 dark:bg-dark-card/10 border-t border-slate-200/50 dark:border-dark-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Features Engineered for Excellence</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Our dashboard comes packed with premium architectural designs and robust data-management capabilities out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-3">JWT Auth & Route Guards</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Secure signup, login, and password management. Supports strict role authentication blocks dividing administrators from standard accounts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-3">Interactive MongoDB Grid</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Explore dataset collections seamlessly. Complete query builder support for paginated views, alphabetical sorting, and dynamic headers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-3">Analytics Visualization</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Graph distributions of programming languages, framework usage, and repository sources dynamically using rich Recharts graphs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-3">Live Regex Filters & Search</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Search through 115,000+ records instantly. Employs optimized backend indexing to query text, code fragments, and parameters safely.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
                <FileJson className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-3">JSON Import & CSV Export</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Import local JSON datasets to seed database collections directly, or stream the filtered items list into local CSV files.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-3">Admin Roster Control</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Administrator-exclusive panels to manage active user rosters, configure permissions, and toggle system roles.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-dark-border text-center text-sm text-slate-500 dark:text-slate-400 mt-auto bg-white dark:bg-dark-card/30">
        <p>© 2026 GitData.io. All rights reserved. Created for Nitish Kumar Full Stack project.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
