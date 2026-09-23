import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopNavbar } from './components/common/TopNavbar';
import { BottomTabBar } from './components/common/BottomTabBar';

import { AuthPage } from './pages/AuthPage';
import { Marketplace } from './pages/customer/Marketplace';
import { EquipmentDetails } from './pages/customer/EquipmentDetails';
import { MyRentals } from './pages/customer/MyRentals';
import { CustomerRentalDetails } from './pages/customer/CustomerRentalDetails';

import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { ManageEquipment } from './pages/owner/ManageEquipment';
import { MyEquipmentList } from './pages/owner/MyEquipmentList';
import { RentalRequests } from './pages/owner/RentalRequests';
import { OwnerRentalDetails } from './pages/owner/OwnerRentalDetails';
import { RentalHistory } from './pages/owner/RentalHistory';

const MainLayout = () => {
  const { activeTab } = useAuth();

  const renderScreen = () => {
    switch (activeTab) {
      // Customer Views
      case 'marketplace':
        return <Marketplace />;
      case 'equipment_details':
        return <EquipmentDetails />;
      case 'my_rentals':
        return <MyRentals />;
      case 'customer_rental_details':
        return <CustomerRentalDetails />;

      // Owner Views
      case 'owner_dashboard':
        return <OwnerDashboard />;
      case 'manage_equipment':
        return <ManageEquipment />;
      case 'my_equipment':
        return <MyEquipmentList />;
      case 'rental_requests':
        return <RentalRequests />;
      case 'owner_rental_details':
        return <OwnerRentalDetails />;
      case 'rental_history':
        return <RentalHistory />;

      case 'auth':
        return <AuthPage />;

      default:
        return <Marketplace />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans">
      <TopNavbar />
      <main className="flex-1 w-full">
        {renderScreen()}
      </main>
      <BottomTabBar />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
