import React from 'react';
import { ShoppingBag, Clock, LayoutDashboard, Wrench, CheckSquare, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../types/status';

export const BottomTabBar = () => {
  const { role, switchRole, activeTab, navigateTo } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] z-40 px-2 py-1.5 flex items-center justify-around">
      {role === USER_ROLES.CUSTOMER ? (
        <>
          <button
            onClick={() => navigateTo('marketplace')}
            className={`flex flex-col items-center py-1 px-3 rounded-md text-xs font-medium ${
              activeTab === 'marketplace' ? 'text-[#16A34A] font-bold' : 'text-[#6B7280]'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            Marketplace
          </button>
          <button
            onClick={() => navigateTo('my_rentals')}
            className={`flex flex-col items-center py-1 px-3 rounded-md text-xs font-medium ${
              activeTab === 'my_rentals' || activeTab === 'customer_rental_details'
                ? 'text-[#16A34A] font-bold'
                : 'text-[#6B7280]'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            My Rentals
          </button>
          <button
            onClick={() => switchRole(USER_ROLES.OWNER)}
            className="flex flex-col items-center py-1 px-3 rounded-md text-xs font-medium text-gray-500 hover:text-[#1A1A1A]"
          >
            <UserCheck className="w-5 h-5 mb-0.5" />
            Switch to Owner
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => navigateTo('owner_dashboard')}
            className={`flex flex-col items-center py-1 px-3 rounded-md text-xs font-medium ${
              activeTab === 'owner_dashboard' ? 'text-[#16A34A] font-bold' : 'text-[#6B7280]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            Dashboard
          </button>
          <button
            onClick={() => navigateTo('my_equipment')}
            className={`flex flex-col items-center py-1 px-3 rounded-md text-xs font-medium ${
              activeTab === 'my_equipment' || activeTab === 'manage_equipment'
                ? 'text-[#16A34A] font-bold'
                : 'text-[#6B7280]'
            }`}
          >
            <Wrench className="w-5 h-5 mb-0.5" />
            Equipment
          </button>
          <button
            onClick={() => navigateTo('rental_requests')}
            className={`flex flex-col items-center py-1 px-3 rounded-md text-xs font-medium ${
              activeTab === 'rental_requests' || activeTab === 'owner_rental_details'
                ? 'text-[#16A34A] font-bold'
                : 'text-[#6B7280]'
            }`}
          >
            <CheckSquare className="w-5 h-5 mb-0.5" />
            Requests
          </button>
          <button
            onClick={() => switchRole(USER_ROLES.CUSTOMER)}
            className="flex flex-col items-center py-1 px-3 rounded-md text-xs font-medium text-gray-500 hover:text-[#1A1A1A]"
          >
            <UserCheck className="w-5 h-5 mb-0.5" />
            Switch to Customer
          </button>
        </>
      )}
    </nav>
  );
};
