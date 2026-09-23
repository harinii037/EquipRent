import React, { useState } from 'react';
import { Wrench, Shield, UserCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../types/status';
import { api } from '../services/api';

export const AuthPage = () => {
  const { switchRole, loginUser, navigateTo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.CUSTOMER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        const newUser = await api.register({
          name: name || 'User',
          email,
          password,
          role: selectedRole,
        });
        loginUser(newUser);
        navigateTo(selectedRole === USER_ROLES.OWNER ? 'owner_dashboard' : 'marketplace');
      } else {
        const user = await api.login(email || (selectedRole === USER_ROLES.OWNER ? "owner@equiprent.com" : "customer@equiprent.com"), password || "password");
        loginUser(user);
        navigateTo(user.role === USER_ROLES.OWNER ? 'owner_dashboard' : 'marketplace');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#F7F7F8] border border-[#E5E5E5] rounded-md p-6 sm:p-8">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-[#1A1A1A] text-white rounded-md mb-3">
            <Wrench className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            {isRegister ? 'Create an Account' : 'Sign in to EquipRent'}
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            {isRegister ? 'Register as a Customer or Equipment Owner' : 'Enter your credentials to access your portal'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-[#DC2626] font-semibold rounded-md">
            {errorMsg}
          </div>
        )}

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#6B7280] mb-2 text-center">
            Select Account Role
          </label>
          <div className="grid grid-cols-2 gap-2 bg-white border border-[#E5E5E5] p-1.5 rounded-md">
            <button
              type="button"
              onClick={() => setSelectedRole(USER_ROLES.CUSTOMER)}
              className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                selectedRole === USER_ROLES.CUSTOMER
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole(USER_ROLES.OWNER)}
              className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                selectedRole === USER_ROLES.OWNER
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              <Shield className="w-4 h-4" />
              Equipment Owner
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alice Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder={selectedRole === USER_ROLES.OWNER ? "owner@equiprent.com" : "customer@equiprent.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1A1A1A] hover:bg-black rounded-md flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#6B7280] hover:text-[#1A1A1A] underline font-medium"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
};
