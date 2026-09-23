import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES } from '../types/status';
import { MOCK_USERS } from '../mock/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(USER_ROLES.CUSTOMER);
  const [user, setUser] = useState(MOCK_USERS.customer1);
  const [activeTab, setActiveTab] = useState('marketplace'); // Default screen

  useEffect(() => {
    if (role === USER_ROLES.OWNER) {
      setUser(MOCK_USERS.owner);
      setActiveTab('owner_dashboard');
    } else {
      setUser(MOCK_USERS.customer1);
      setActiveTab('marketplace');
    }
  }, [role]);

  const switchRole = (newRole) => {
    setRole(newRole);
  };

  const navigateTo = (tabName, params = null) => {
    setActiveTab(tabName);
    if (params) {
      window._navigationParams = params;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        switchRole,
        activeTab,
        setActiveTab,
        navigateTo,
        isOwner: role === USER_ROLES.OWNER,
        isCustomer: role === USER_ROLES.CUSTOMER,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
