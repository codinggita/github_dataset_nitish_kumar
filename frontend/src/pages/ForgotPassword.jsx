import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import apiClient from '../services/api';

// GitHub Octocat logo SVG
const GithubLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/auth/forgot-password', { email: values.email });
        const otp = response.data.data?.otp;
        console.log('Forgot password request successful, OTP:', otp);
        
        // Redirect immediately to the ResetPassword page passing email and mock OTP in state
        navigate('/reset-password', { 
          state: { 
            email: values.email, 
            otp: otp || '' 
          } 
        });
      } catch (err) {
        console.error('Forgot password error:', err);
        setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0D1117] text-[#F0F6FC] px-4 select-none animate-fade-in relative">
      
      <div className="w-full max-w-[340px] space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-4">
          <Link to="/login" className="inline-block hover:text-[#58A6FF] text-[#F0F6FC] transition-colors">
            <GithubLogo className="w-12 h-12 mx-auto" />
          </Link>
          <h2 className="text-2xl font-light tracking-tight text-[#F0F6FC]">
            Recover your password
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[#ff7b72] text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Recover Box */}
        <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-lg space-y-4 shadow-md">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c9d1d9] block">
                Enter your email address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs rounded-lg border border-[rgba(240,246,252,0.1)] transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting request...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send OTP code</span>
                </>
              )}
            </button>
          </form>
        </div>

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

export default ForgotPassword;
