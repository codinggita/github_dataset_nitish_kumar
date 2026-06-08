import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowLeft, Sun, Moon, Shield } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/uiSlice';

const Register = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);
  const [showPassword, setShowPassword] = useState(false);

  // Formik Configuration
  const formik = useFormik({
    initialState: {
      name: '',
      email: '',
      password: '',
      role: 'user', // default role
    },
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
      console.log('Form submitted with values:', values);
      alert('PR 4 UI validation successful! Connection to Redux signup actions will be wired in PR 5.');
    },
  });

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0c10] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Back Button & Theme Toggle Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-3.5 py-1.5 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 bg-white dark:bg-dark-card hover:bg-slate-100 dark:hover:bg-dark-card/50 transition-colors cursor-pointer shadow-sm"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto items-stretch justify-center p-4 md:p-12">
        
        {/* Left Side: Branding Banner Column (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-between rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-purple-500 p-12 text-white shadow-xl shadow-brand-500/10 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <span className="font-heading font-bold text-lg tracking-wider">GitData.io</span>
          </div>

          <div className="space-y-6 relative z-10">
            <h2 className="text-4xl font-extrabold font-heading leading-tight">
              Join the Next-Gen Git Data Engine.
            </h2>
            <p className="text-brand-100 text-sm leading-relaxed max-w-md">
              Create an account to configure custom collections, run analytical queries, seed raw JSON sets, and perform database mutations.
            </p>
          </div>

          <div className="text-brand-200 text-xs font-semibold relative z-10">
            © 2026 GitData.io. Enterprise Data Console.
          </div>
        </div>

        {/* Right Side: Register Form Column */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-12 py-10 lg:py-0">
          <div className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-8 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none">
            
            <div className="mb-8">
              <h3 className="font-heading text-2xl font-bold mb-2">Create Account</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm">Get access to the dataset dashboard</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              
              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      formik.touched.name && formik.errors.name
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-xs text-rose-500 font-semibold">{formik.errors.name}</div>
                ) : null}
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      formik.touched.email && formik.errors.email
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-xs text-rose-500 font-semibold">{formik.errors.email}</div>
                ) : null}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                      formik.touched.password && formik.errors.password
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-xs text-rose-500 font-semibold">{formik.errors.password}</div>
                ) : null}
              </div>

              {/* Role Selector Toggle */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Account Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue('role', 'user')}
                    className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      formik.values.role === 'user'
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white'
                        : 'border-slate-200 dark:border-dark-border text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    Standard User
                  </button>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue('role', 'admin')}
                    className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      formik.values.role === 'admin'
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-900 text-purple-600 dark:text-purple-300'
                        : 'border-slate-200 dark:border-dark-border text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Administrator
                  </button>
                </div>
                {formik.touched.role && formik.errors.role ? (
                  <div className="text-xs text-rose-500 font-semibold">{formik.errors.role}</div>
                ) : null}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all cursor-pointer mt-4"
              >
                Sign Up
              </button>

            </form>

            {/* Navigation Footer */}
            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Sign In
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
