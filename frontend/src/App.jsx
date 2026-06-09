import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StatsDashboard from './pages/StatsDashboard';
import DatasetsExplorer from './pages/DatasetsExplorer';
import DatasetForm from './pages/DatasetForm';
import DatasetDetail from './pages/DatasetDetail';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminUsers from './pages/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ToastContainer from './components/ToastContainer';
import { showNotification } from './store/uiSlice';

const ProfilePlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-12">
    <h2 className="text-2xl font-bold mb-4">My Profile Settings</h2>
    <p className="text-slate-500 dark:text-slate-400 mb-6">Profile updates and password change views will be added in PR 6.</p>
    <Link to="/dashboard" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Go to Dashboard</Link>
  </div>
);

const DashboardPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-12">
    <h2 className="text-2xl font-bold mb-4">Stats Dashboard</h2>
    <p className="text-slate-500 dark:text-slate-400 mb-6">Inventory counters and metadata summaries will be added in PR 7.</p>
    <Link to="/explorer" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Explore Datasets</Link>
  </div>
);

const ExplorerPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-12">
    <h2 className="text-2xl font-bold mb-4">Datasets Explorer</h2>
    <p className="text-slate-500 dark:text-slate-400 mb-6">Datasets grid, pagination, sorting and filters will be added in PR 8 to 11.</p>
    <Link to="/analytics" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Go to Analytics</Link>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-12">
    <h2 className="text-2xl font-bold mb-4">Analytics Insights</h2>
    <p className="text-slate-500 dark:text-slate-400 mb-6">Aggregation charts and graphs will be added in PR 16.</p>
    <Link to="/dashboard" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Back to Dashboard</Link>
  </div>
);

const AdminUsersPlaceholder = () => (
  <div className="flex-1 flex flex-col justify-center items-center py-12">
    <h2 className="text-2xl font-bold mb-4 text-rose-500">Admin User Roster</h2>
    <p className="text-slate-500 dark:text-slate-400 mb-6">User permissions management will be added in PR 17.</p>
    <Link to="/dashboard" className="px-5 py-2 bg-brand-600 text-white rounded-xl">Back to Dashboard</Link>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);

  useEffect(() => {
    // Synchronize document classes with Redux theme slice
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleRateLimit = () => {
      dispatch(showNotification({
        message: 'Rate limit exceeded. Please wait a moment before trying again.',
        type: 'warning'
      }));
    };

    window.addEventListener('api-rate-limit', handleRateLimit);
    return () => window.removeEventListener('api-rate-limit', handleRateLimit);
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Dashboard Protected Layout Route */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<StatsDashboard />} />
          <Route path="/explorer" element={<DatasetsExplorer />} />
          <Route path="/explorer/new" element={<DatasetForm />} />
          <Route path="/explorer/:id" element={<DatasetDetail />} />
          <Route path="/explorer/:id/edit" element={<DatasetForm />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
