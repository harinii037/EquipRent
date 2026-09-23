import React from 'react';
import { Wrench, ShoppingBag, Clock, LayoutDashboard, FolderPlus, CheckSquare, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../types/status';
import { api } from '../../services/api';

export const TopNavbar = () => {
  const { role, user, switchRole, activeTab, navigateTo } = useAuth();

  const handleResetData = async () => {
    if (window.confirm('Reset mock data back to initial state?')) {
      await api.resetDataToDefaults();
    }
  };

  return (
    <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(role === USER_ROLES.OWNER ? 'owner_dashboard' : 'marketplace')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="p-2 bg-[#1A1A1A] text-white rounded-md group-hover:bg-black transition-colors">
              <Wrench className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#1A1A1A]">EquipRent</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-gray-100 border border-[#E5E5E5] rounded text-[#6B7280]">
                {role === USER_ROLES.OWNER ? 'Owner Portal' : 'Marketplace'}
              </span>
            </div>
          </button>
        </div>

        {/* Center / Right Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {role === USER_ROLES.CUSTOMER ? (
            <>
              <button
                onClick={() => navigateTo('marketplace')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === 'marketplace'
                    ? 'bg-[#F7F7F8] text-[#1A1A1A] border border-[#E5E5E5]'
                    : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Equipment
              </button>
              <button
                onClick={() => navigateTo('my_rentals')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === 'my_rentals' || activeTab === 'customer_rental_details'
                    ? 'bg-[#F7F7F8] text-[#1A1A1A] border border-[#E5E5E5]'
                    : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                My Rentals & Requests
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('owner_dashboard')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === 'owner_dashboard'
                    ? 'bg-[#F7F7F8] text-[#1A1A1A] border border-[#E5E5E5]'
                    : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('my_equipment')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === 'my_equipment' || activeTab === 'manage_equipment'
                    ? 'bg-[#F7F7F8] text-[#1A1A1A] border border-[#E5E5E5]'
                    : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                <FolderPlus className="w-4 h-4" />
                My Equipment
              </button>
              <button
                onClick={() => navigateTo('rental_requests')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === 'rental_requests' || activeTab === 'owner_rental_details'
                    ? 'bg-[#F7F7F8] text-[#1A1A1A] border border-[#E5E5E5]'
                    : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                Rental Requests
              </button>
            </>
          )}
        </nav>

        {/* Far Right: User Role Switcher & Controls */}
        <div className="flex items-center gap-3">
          {/* Demo Data Reset */}
          <button
            onClick={handleResetData}
            title="Reset Mock Data"
            className="p-2 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-100 rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Role Switcher Toggle Badge */}
          <div className="flex items-center bg-[#F7F7F8] border border-[#E5E5E5] p-1 rounded-md text-xs font-semibold">
            <button
              onClick={() => switchRole(USER_ROLES.CUSTOMER)}
              className={`px-2.5 py-1 rounded transition-colors ${
                role === USER_ROLES.CUSTOMER
                  ? 'bg-white text-[#1A1A1A] border border-[#E5E5E5] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => switchRole(USER_ROLES.OWNER)}
              className={`px-2.5 py-1 rounded transition-colors ${
                role === USER_ROLES.OWNER
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              Owner
            </button>
          </div>

          {/* User Info Avatar */}
          <div className="hidden sm:flex items-center gap-2 border-l border-[#E5E5E5] pl-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-[#1A1A1A] flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-[#1A1A1A] leading-tight">{user.name}</p>
              <p className="text-[#6B7280]">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
