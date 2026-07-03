import React, { useState } from 'react';
import { Mail, Lock, User, Key, KeyRound, AlertCircle, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { MOCK_SAMPLE_USERS } from '../dummyData';
import { SampleUserCredential } from '../types';

interface AuthPagesProps {
  initialView: string; // 'login' | 'register' | 'forgot' | 'verify' | '2fa'
  onNavigate: (view: string) => void;
  onSuccess: (name: string, email: string, role?: string, targetView?: string) => void;
}

export default function AuthPages({
  initialView,
  onNavigate,
  onSuccess,
}: AuthPagesProps) {
  const [currentScreen, setCurrentScreen] = useState(initialView);
  const [selectedTestUser, setSelectedTestUser] = useState<SampleUserCredential | null>(null);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide correct credentials.');
      return;
    }
    // Forward to 2FA verification step
    setCurrentScreen('2fa');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }
    // Forward to Email verification step
    setCurrentScreen('verify');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
      setError('Please enter the complete 4-digit code.');
      return;
    }
    setSuccess('Email successfully verified! Log in to secure your account.');
    setTimeout(() => {
      const targetRole = selectedTestUser ? selectedTestUser.role : 'customer';
      const targetView = selectedTestUser ? selectedTestUser.targetView : 'customer-dashboard';
      onSuccess(selectedTestUser ? selectedTestUser.name : (name || 'Demo Customer'), email || 'demo@dxmarket.com', targetRole, targetView);
    }, 1500);
  };

  const handleMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length < 6) {
      setError('Multi-factor authentication key must be 6 digits.');
      return;
    }
    const targetRole = selectedTestUser ? selectedTestUser.role : 'customer';
    const targetView = selectedTestUser ? selectedTestUser.targetView : 'customer-dashboard';
    onSuccess(selectedTestUser ? selectedTestUser.name : 'Demo Customer', email || 'customer@dxmarket.com', targetRole, targetView);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required.');
      return;
    }
    setSuccess('Recovery dispatch completed! Inspect your spam folders for the reset token.');
  };

  return (
    <div className="max-w-md mx-auto my-12" id="auth-suite-container">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-md space-y-6">
        
        {/* Logo and Headings */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#1E88E5] flex items-center justify-center shadow mx-auto">
            <span className="text-white font-black text-xl">DX</span>
          </div>
          <h2 className="text-lg font-extrabold text-[#0F4C81] tracking-tight">
            {currentScreen === 'login' && 'Sign In to Your Workspace'}
            {currentScreen === 'register' && 'Register Multi-Vendor Account'}
            {currentScreen === 'forgot' && 'Reset Secure Passwords'}
            {currentScreen === 'verify' && 'Confirm Email Registration'}
            {currentScreen === '2fa' && 'Two-Factor Authentication'}
          </h2>
          <p className="text-[11px] text-gray-500">
            {currentScreen === 'login' && 'Access customer, merchant, and supplier dashboard controls.'}
            {currentScreen === 'register' && 'Join thousand of enterprise level retailers and wholesale suppliers.'}
            {currentScreen === 'forgot' && 'Specify registration emails to authorize a reset link.'}
            {currentScreen === 'verify' && 'Type the 4-digit token dispatched to your email.'}
            {currentScreen === '2fa' && 'Enter the 6-digit dynamic key generated on your device.'}
          </p>
        </div>

        {/* Global Error/Success logs */}
        {error && (
          <div className="bg-rose-50 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* 1. LOGIN SCREEN */}
        {currentScreen === 'login' && (
          <>
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#0F4C81] flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                  <span>One-Click Test Accounts</span>
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('sample-users')}
                  className="text-[10px] text-purple-700 font-extrabold hover:underline cursor-pointer"
                >
                  View Full Test Hub 🚀
                </button>
              </div>
              <p className="text-[11px] text-gray-600">
                Click any profile below to auto-fill login details and switch roles instantly for evaluation:
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {MOCK_SAMPLE_USERS.map((user, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedTestUser(user);
                      setEmail(user.email);
                      setPassword(user.password);
                      setError('');
                    }}
                    className={`p-2 rounded-lg border text-left transition cursor-pointer flex items-center gap-2 ${
                      selectedTestUser?.email === user.email
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[10px] font-black uppercase line-clamp-1 ${selectedTestUser?.email === user.email ? 'text-blue-200' : 'text-gray-400'}`}>
                        {user.role}
                      </p>
                      <p className="text-xs font-bold line-clamp-1">{user.name}</p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedTestUser && (
                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-gray-700 font-semibold truncate">
                    Ready: <span className="font-bold text-[#0F4C81]">{selectedTestUser.name}</span> ({selectedTestUser.roleTitle})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSuccess(selectedTestUser.name, selectedTestUser.email, selectedTestUser.role, selectedTestUser.targetView);
                    }}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow transition flex items-center gap-1 cursor-pointer animate-pulse whitespace-nowrap"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Instant Login ⚡</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-gray-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase font-bold text-gray-400">Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('forgot')}
                  className="text-[10px] text-[#1E88E5] font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F4C81] hover:bg-[#1E88E5] text-white font-bold py-2 rounded text-xs transition cursor-pointer"
            >
              Authorize Account
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentScreen('register')}
                className="text-[#1E88E5] font-bold hover:underline"
              >
                Sign Up Now
              </button>
            </p>
          </form>
          </>
        )}

        {/* 2. REGISTER SCREEN */}
        {currentScreen === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-gray-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-gray-400">Choose Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F4C81] hover:bg-[#1E88E5] text-white font-bold py-2 rounded text-xs transition cursor-pointer"
            >
              Verify Registration
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setCurrentScreen('login')}
                className="text-[#1E88E5] font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          </form>
        )}

        {/* 3. FORGOT PASSWORD */}
        {currentScreen === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-gray-400">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F4C81] hover:bg-[#1E88E5] text-white font-bold py-2 rounded text-xs transition cursor-pointer"
            >
              Request Password Reset
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('login')}
              className="w-full py-2 border border-gray-300 rounded text-xs text-gray-600 font-semibold hover:bg-gray-50"
            >
              Return to Login Screen
            </button>
          </form>
        )}

        {/* 4. EMAIL VERIFICATION SCREEN */}
        {currentScreen === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold text-gray-400 block text-center">Verification Code</label>
              <div className="flex justify-center gap-3">
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="1234"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-24 text-center text-lg tracking-widest font-black py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F4C81] hover:bg-[#1E88E5] text-white font-bold py-2 rounded text-xs transition cursor-pointer"
            >
              Verify Code
            </button>
          </form>
        )}

        {/* 5. TWO-FACTOR AUTHENTICATION SCREEN */}
        {currentScreen === '2fa' && (
          <form onSubmit={handleMfa} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-gray-400 block text-center">Google Authenticator Key</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-sm font-black py-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F4C81] hover:bg-[#1E88E5] text-white font-bold py-2 rounded text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm 2FA Validation</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
