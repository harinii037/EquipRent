import React, { useState } from 'react';
import { Wrench, Shield, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../types/status';

export const AuthPage = () => {
  const { switchRole, navigateTo } = useAuth();
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.CUSTOMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    navigateTo(selectedRole === USER_ROLES.OWNER ? 'owner_dashboard' : 'marketplace');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#F7F7F8] border border-[#E5E5E5] rounded-md p-6 sm:p-8">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-[#1A1A1A] text-white rounded-md mb-3">
            <Wrench className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">Welcome to EquipRent</h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Sign in to manage equipment rentals or browse available inventory.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#6B7280] mb-2 text-center">
            Select Your Account Role
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder={selectedRole === USER_ROLES.OWNER ? "owner@equiprent.com" : "customer@example.com"}
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
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1A1A1A] hover:bg-black rounded-md flex items-center justify-center gap-2 transition-colors mt-2"
          >
            Continue as {selectedRole === USER_ROLES.OWNER ? 'Owner' : 'Customer'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-center text-xs text-[#6B7280]">
          Demo Mode: Click continue to enter without password verification.
        </div>
      </div>
    </div>
  );
};
