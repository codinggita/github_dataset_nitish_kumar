import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, Key, ArrowLeft, CheckCircle } from 'lucide-react';
import apiClient from '../services/api';

// GitHub Octocat logo SVG
const GithubLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve email and OTP from route state if they navigated from ForgotPassword
  const initialEmail = location.state?.email || '';
  const initialOtp = location.state?.otp || '';

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      email: initialEmail,
      otp: initialOtp,
      newPassword: '',
      confirmPassword: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      otp: Yup.string()
        .length(6, 'OTP must be exactly 6 digits')
        .required('Verification OTP is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm new password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.post('/auth/reset-password', {
          email: values.email,
          otp: values.otp,
          newPassword: values.newPassword,
        });
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error('Reset password error:', err);
        setError(err.response?.data?.message || 'Password reset failed. Please verify email and OTP.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0D1117] text-[#F0F6FC] px-4 select-none animate-fade-in relative py-12">
      
      <div className="w-full max-w-[360px] space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-4">
          <Link to="/login" className="inline-block hover:text-[#58A6FF] text-[#F0F6FC] transition-colors">
            <GithubLogo className="w-12 h-12 mx-auto" />
          </Link>
          <h2 className="text-2xl font-light tracking-tight text-[#F0F6FC]">
            Reset your password
          </h2>
        </div>

        {success ? (
          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-lg text-center space-y-4 shadow-md">
            <div className="h-10 w-10 rounded-full bg-[#3FB950]/10 text-[#3FB950] flex items-center justify-center mx-auto border border-[#3FB950]/20 animate-bounce">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F0F6FC]">Password Reset Successfully</h3>
            <p className="text-[#8B949E] text-xs leading-relaxed">
              Your password has been updated. Redirecting you to the login screen...
            </p>
          </div>
        ) : (
          <>
            {/* Error Alert */}
            {error && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[#ff7b72] text-xs font-semibold">
                {error}
              </div>
            )}

            {/* OTP Code Indicator Badge */}
            {initialOtp && (
              <div className="p-3 rounded-lg bg-[#3FB950]/10 border border-[#3FB950]/20 text-[#3FB950] text-xs font-semibold">
                Mock OTP Code captured: <span className="font-mono underline font-bold">{initialOtp}</span>
              </div>
            )}

            {/* Reset Form Box */}
            <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-lg space-y-4 shadow-md">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                
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

                {/* OTP Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#c9d1d9] block">
                    OTP Verification Code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                    <input
                      type="text"
                      name="otp"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.otp}
                      className={`w-full pl-10 pr-3 py-1.5 rounded-lg bg-[#0D1117] border text-xs text-[#F0F6FC] outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all font-semibold ${
                        formik.touched.otp && formik.errors.otp ? 'border-[#F85149]' : 'border-[#30363D]'
                      }`}
                    />
                  </div>
                  {formik.touched.otp && formik.errors.otp && (
                    <div className="text-[10px] text-[#ff7b72] font-semibold">{formik.errors.otp}</div>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#c9d1d9] block">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                    <input
                      type="password"
                      name="newPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newPassword}
                      className={`w-full pl-10 pr-3 py-1.5 rounded-lg bg-[#0D1117] border text-xs text-[#F0F6FC] outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all font-semibold ${
                        formik.touched.newPassword && formik.errors.newPassword ? 'border-[#F85149]' : 'border-[#30363D]'
                      }`}
                    />
                  </div>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <div className="text-[10px] text-[#ff7b72] font-semibold">{formik.errors.newPassword}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#c9d1d9] block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
                    <input
                      type="password"
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      className={`w-full pl-10 pr-3 py-1.5 rounded-lg bg-[#0D1117] border text-xs text-[#F0F6FC] outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] transition-all font-semibold ${
                        formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-[#F85149]' : 'border-[#30363D]'
                      }`}
                    />
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="text-[10px] text-[#ff7b72] font-semibold">{formik.errors.confirmPassword}</div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs rounded-lg border border-[rgba(240,246,252,0.1)] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? 'Resetting password...' : 'Reset password'}
                </button>

              </form>
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="text-center text-xs">
          <Link 
            to="/login" 
            className="text-[#58A6FF] hover:underline font-semibold flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
