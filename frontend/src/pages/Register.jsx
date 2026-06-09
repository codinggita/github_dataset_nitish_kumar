import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Shield, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/uiSlice';
import { register, clearError } from '../store/authSlice';

// GitHub Octocat logo SVG
const GithubLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { darkMode } = useSelector((state) => state.ui);
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Clear previous error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const from = location.state?.from?.pathname || '/dashboard';

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      role: Yup.string()
        .oneOf(['user', 'admin'], 'Invalid role selected')
        .required('Role is required'),
    }),
    onSubmit: (values) => {
      dispatch(
        register({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        })
      )
        .unwrap()
        .then(() => {
          navigate(from, { replace: true });
        })
        .catch((err) => {
          console.error('Registration action rejected:', err);
        });
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0D1117] text-[#F0F6FC] px-4 select-none animate-fade-in relative py-12">
      
      {/* Theme Toggle in top corner */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-lg border border-[#30363D] text-[#8B949E] bg-[#161B22] hover:bg-[#21262D] hover:text-[#F0F6FC] transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </div>

      <div className="w-full max-w-[380px] space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-block hover:text-[#58A6FF] text-[#F0F6FC] transition-colors">
            <GithubLogo className="w-12 h-12 mx-auto" />
          </Link>
          <h2 className="text-2xl font-light tracking-tight text-[#F0F6FC]">
            Create your account
          </h2>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[#ff7b72] text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Credentials Form Box */}
        <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-lg space-y-4 shadow-md">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c9d1d9] block">
                Full name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                <input
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className={`w-full pl-10 pr-3 py-1.5 rounded-lg bg-[#0D1117] border text-xs text-[#F0F6FC] outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all font-semibold ${
                    formik.touched.name && formik.errors.name ? 'border-[#F85149]' : 'border-[#30363D]'
                  }`}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <div className="text-[10px] text-[#ff7b72] font-semibold">{formik.errors.name}</div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c9d1d9] block">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                <input
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full pl-10 pr-3 py-1.5 rounded-lg bg-[#0D1117] border text-xs text-[#F0F6FC] outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all font-semibold ${
                    formik.touched.email && formik.errors.email ? 'border-[#F85149]' : 'border-[#30363D]'
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-[10px] text-[#ff7b72] font-semibold">{formik.errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c9d1d9] block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full pl-10 pr-10 py-1.5 rounded-lg bg-[#0D1117] border text-xs text-[#F0F6FC] outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all font-semibold ${
                    formik.touched.password && formik.errors.password ? 'border-[#F85149]' : 'border-[#30363D]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-[#F0F6FC] cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-[10px] text-[#ff7b72] font-semibold">{formik.errors.password}</div>
              )}
            </div>

            {/* Role selector panel */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c9d1d9] block">
                Choose Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('role', 'user')}
                  className={`py-2 px-3 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    formik.values.role === 'user'
                      ? 'bg-[#21262D] border-[#8b949e] text-[#F0F6FC]'
                      : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:text-[#c9d1d9]'
                  }`}
                >
                  Standard User
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('role', 'admin')}
                  className={`py-2 px-3 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    formik.values.role === 'admin'
                      ? 'bg-purple-950/30 border-purple-800 text-purple-300'
                      : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:text-[#c9d1d9]'
                  }`}
                >
                  <Shield className="w-3 h-3 text-[#bc8cff]" />
                  Administrator
                </button>
              </div>
              {formik.touched.role && formik.errors.role && (
                <div className="text-[10px] text-[#ff7b72] font-semibold">{formik.errors.role}</div>
              )}
            </div>

            {/* Submit registration button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs rounded-lg border border-[rgba(240,246,252,0.1)] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/20 border-t-white" />
                  <span>Registering account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>

          </form>
        </div>

        {/* Footer link card */}
        <div className="border border-[#30363D] p-4 rounded-lg text-center text-xs text-[#8B949E]">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-[#58A6FF] hover:underline font-semibold"
          >
            Sign in
          </Link>
          .
        </div>

      </div>
    </div>
  );
};

export default Register;
