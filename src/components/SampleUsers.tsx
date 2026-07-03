import React, { useState } from 'react';
import { 
  Users, ShieldCheck, Key, Lock, Mail, ArrowRight, CheckCircle, 
  Sparkles, Terminal, Copy, Check, Store, Truck, ShoppingBag, 
  Percent, Settings, Award, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_SAMPLE_USERS } from '../dummyData';
import { SampleUserCredential } from '../types';

interface SampleUsersProps {
  onNavigate: (view: string) => void;
  onLogin: (name: string, email: string, role: string, targetView: string) => void;
}

export default function SampleUsers({ onNavigate, onLogin }: SampleUsersProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedPass, setCopiedPass] = useState<string | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  const handleCopy = (text: string, type: 'email' | 'pass', id: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(id);
      setTimeout(() => setCopiedEmail(null), 2000);
    } else {
      setCopiedPass(id);
      setTimeout(() => setCopiedPass(null), 2000);
    }
  };

  const filteredUsers = selectedRoleFilter === 'all' 
    ? MOCK_SAMPLE_USERS 
    : MOCK_SAMPLE_USERS.filter(u => u.role === selectedRoleFilter);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'merchant': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'supplier': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'sales': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-teal-100 text-teal-800 border-teal-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#0F4C81] via-[#1E88E5] to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-blue-200">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Multi-Vendor Quality Assurance Suite</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Test Accounts & Role Access Hub
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Explore DXMARKET across all user dimensions. We have provisioned sample test credentials for customers, marketplace merchants, global B2B suppliers, affiliate sales agents, and administrative control roles. Click any profile below to simulate instant login.
            </p>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider pl-2">Filter Roles:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Roles (6)' },
                { id: 'customer', label: 'Customers' },
                { id: 'merchant', label: 'Merchants' },
                { id: 'supplier', label: 'Suppliers' },
                { id: 'sales', label: 'Sales Leads' },
                { id: 'admin', label: 'Admins' },
                { id: 'superadmin', label: 'Super Admin' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRoleFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    selectedRoleFilter === tab.id
                      ? 'bg-[#0F4C81] text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-800">{filteredUsers.length}</span> active profiles
          </div>
        </div>

        {/* User Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, idx) => (
            <motion.div
              key={user.email}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-5">
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-gray-100 group-hover:scale-105 transition duration-300"
                    />
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border mb-1 ${getRoleBadgeColor(user.role)}`}>
                        {user.roleTitle}
                      </span>
                      <h3 className="font-black text-base text-gray-900 leading-tight">{user.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Scope Description */}
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Access Scope:</p>
                  <p className="text-xs text-gray-700 font-semibold leading-relaxed">{user.accessScope || user.testScenario}</p>
                </div>

                {/* Login Credentials Box */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-xs min-w-0">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 font-medium">Email:</span>
                      <span className="font-mono font-bold text-gray-900 truncate">{user.email}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(user.email, 'email', user.email)}
                      className="text-gray-400 hover:text-[#0F4C81] transition p-1 cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedEmail === user.email ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-xs min-w-0">
                      <Key className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 font-medium">Password:</span>
                      <span className="font-mono font-bold text-gray-900">{user.password}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(user.password, 'pass', user.email)}
                      className="text-gray-400 hover:text-[#0F4C81] transition p-1 cursor-pointer"
                      title="Copy Password"
                    >
                      {copiedPass === user.email ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Test Scenario Instructions */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-black uppercase text-[#0F4C81] tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-600" />
                    <span>Recommended QA Test Scenario:</span>
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    {user.testScenario}
                  </p>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-400 font-bold">Target View: <code className="text-gray-600 bg-white px-1.5 py-0.5 rounded border">{user.targetView}</code></span>
                <button
                  onClick={() => onLogin(user.name, user.email, user.role, user.targetView)}
                  className="bg-gradient-to-r from-[#0F4C81] to-[#1E88E5] hover:from-[#0c3e69] hover:to-[#1976d2] text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Instant Auto-Login ⚡</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer QA Guidelines */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 font-black">
              💡
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-950">Quick Testing Tips for DXMARKET</h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Switch between accounts anytime using the header navigation or by returning to this Test Hub. All role permissions, menu items, and interactive dashboards adjust automatically!
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="bg-amber-900 hover:bg-amber-950 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <span>Return to Storefront</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
