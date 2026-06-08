import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './store/uiSlice';

// Placeholder Pages for subsequent PRs
const LoginPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-20">
    <h2 className="text-2xl font-bold mb-4">Sign In</h2>
    <p className="text-slate-500 mb-6">Credential form and JWT integration will be added in PR 4 & 5.</p>
    <Link to="/" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Back to Home</Link>
  </div>
);

const RegisterPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-20">
    <h2 className="text-2xl font-bold mb-4">Get Started</h2>
    <p className="text-slate-500 mb-6">User registration view and Formik validations will be added in PR 4 & 5.</p>
    <Link to="/" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Back to Home</Link>
  </div>
);

const ProfilePlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-20">
    <h2 className="text-2xl font-bold mb-4">My Profile</h2>
    <p className="text-slate-500 mb-6">Profile updates and password change views will be added in PR 6.</p>
    <Link to="/" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Back to Home</Link>
  </div>
);

const DashboardPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-20">
    <h2 className="text-2xl font-bold mb-4">Stats Dashboard</h2>
    <p className="text-slate-500 mb-6">Inventory counters and metadata summaries will be added in PR 7.</p>
    <Link to="/" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Back to Home</Link>
  </div>
);

const ExplorerPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-20">
    <h2 className="text-2xl font-bold mb-4">Datasets Explorer</h2>
    <p className="text-slate-500 mb-6">Datasets grid, pagination, sorting and filters will be added in PR 8 to 11.</p>
    <Link to="/" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Back to Home</Link>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-20">
    <h2 className="text-2xl font-bold mb-4">Analytics Insights</h2>
    <p className="text-slate-500 mb-6">Aggregation charts and graphs will be added in PR 16.</p>
    <Link to="/" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Back to Home</Link>
  </div>
);

// Landing Layout Component
const LandingPage = ({ apiStatus, darkMode, onToggleTheme }) => (
  <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 py-16 text-center max-w-5xl mx-auto animate-fade-in">
    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-dark-border">
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
          apiStatus === 'online' ? 'bg-emerald-400' : apiStatus === 'offline' ? 'bg-rose-400' : 'bg-amber-400'
        }`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          apiStatus === 'online' ? 'bg-emerald-500' : apiStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500'
        }`}></span>
      </span>
      API Status: {apiStatus === 'online' ? 'Connected' : apiStatus === 'offline' ? 'Disconnected' : 'Checking connection...'}
    </div>

    <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
      Modern Analytics & CRUD Dashboard for{' '}
      <span className="bg-gradient-to-r from-brand-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
        GitHub Datasets
      </span>
    </h1>

    <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
      Manage your MongoDB collections, analyze repository distributions, perform live CRUD actions, and configure granular authorization controls with our sleek user and admin control panel.
    </p>

    {/* Feature Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-12">
      {/* Card 1 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-200">
        <div className="h-12 w-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2">JWT Authentication</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Secure login, signup, password resets, and role-based guard rails to divide user and administrator privileges.
        </p>
      </div>

      {/* Card 2 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-200">
        <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2">MongoDB CRUD Grid</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Easily view, search, filter, paginate, and modify dataset items directly connected to MongoDB.
        </p>
      </div>

      {/* Card 3 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-200">
        <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2">Analytics Insights</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Visualize language frequency, source distribution, and document summaries via charts populated by aggregation.
        </p>
      </div>
    </div>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Link
        to="/register"
        className="px-8 py-3.5 rounded-xl font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-600/30 hover:-translate-y-0.5 transition-all duration-200"
      >
        Create Your Account
      </Link>
      <Link
        to="/login"
        className="px-8 py-3.5 rounded-xl font-semibold bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card/50 hover:-translate-y-0.5 transition-all duration-200"
      >
        Sign In Dashboard
      </Link>
    </div>
  </main>
);

function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    // Synchronize document classes with Redux theme slice
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetch('https://github-dataset-backend-vokd.onrender.com/api/v1/system/health')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API down');
      })
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphism dark:glassmorphism py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-400 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-purple-500 dark:from-brand-400 dark:to-purple-300 bg-clip-text text-transparent">
            GitData.io
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L5.757 5.757M12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
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
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Routing Configuration */}
      <Routes>
        <Route path="/" element={<LandingPage apiStatus={apiStatus} darkMode={darkMode} onToggleTheme={() => dispatch(toggleTheme())} />} />
        <Route path="/login" element={<LoginPlaceholder />} />
        <Route path="/register" element={<RegisterPlaceholder />} />
        <Route path="/profile" element={<ProfilePlaceholder />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        <Route path="/explorer" element={<ExplorerPlaceholder />} />
        <Route path="/analytics" element={<AnalyticsPlaceholder />} />
      </Routes>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-dark-border text-center text-sm text-slate-500 dark:text-slate-400">
        <p>© 2026 GitData.io. All rights reserved. Created for Nitish Kumar Full Stack project.</p>
      </footer>
    </div>
  );
}
export default App;
