'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    shop_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Multi-step form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        shop_name: formData.shop_name,
        phone: formData.phone,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const goToNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.full_name && formData.shop_name && formData.phone) {
      setStep(2);
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image/Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300 rounded-full opacity-20"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4">Start Free Today</h2>
          <p className="text-xl mb-8 font-light">
            Join thousands of businesses using Agrifarm ERP to manage their operations
          </p>

          {/* Benefits */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3 bg-white bg-opacity-10 p-3 rounded-lg">
              <span className="text-2xl">🚀</span>
              <span>Get started in minutes</span>
            </div>
            <div className="flex items-center space-x-3 bg-white bg-opacity-10 p-3 rounded-lg">
              <span className="text-2xl">📱</span>
              <span>Access anywhere, anytime</span>
            </div>
            <div className="flex items-center space-x-3 bg-white bg-opacity-10 p-3 rounded-lg">
              <span className="text-2xl">🎯</span>
              <span>Grow your business faster</span>
            </div>
            <div className="flex items-center space-x-3 bg-white bg-opacity-10 p-3 rounded-lg">
              <span className="text-2xl">💰</span>
              <span>Save time and money</span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-12 bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm border border-white border-opacity-20">
            <p className="italic mb-3">"Best ERP system we've used!"</p>
            <p className="text-sm font-semibold">- Business Owner</p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">Agrifarm ERP</h1>
            <p className="text-gray-600">Create Your Account</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className="mx-2 text-sm font-semibold text-gray-600">
              Step {step} of 2
            </div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">⚠️ Error</p>
              <p className="text-sm">{error || authError}</p>
            </div>
          )}

          <form onSubmit={step === 1 ? goToNextStep : handleSubmit} className="space-y-5">
            {/* Step 1: Business Info */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Shop/Business Name *</label>
                  <input
                    type="text"
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="e.g., ABC Trading Company"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="+92 XXX XXXXXXX"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105"
                >
                  Continue →
                </button>
              </>
            )}

            {/* Step 2: Account Info */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Minimum 6 characters"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Re-enter your password"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 transition transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                        Creating...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Divider */}
          {step === 1 && (
            <>
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="px-4 text-gray-500 text-sm">or</div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-purple-600 font-bold hover:text-purple-700 transition">
                    Login
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Footer */}
          {step === 1 && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Agrifarm ERP - Enterprise Resource Planning System</p>
              <p className="mt-2">© 2026 Softtech. All rights reserved.</p>
              <p className="mt-1 text-gray-400">Powered by <span className="font-semibold text-gray-600">Softtech</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
