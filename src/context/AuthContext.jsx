import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES } from '../types/status';

const AuthContext = createContext();

const DEFAULT_CUSTOMER = {
  id: 'user_cust_1',
  name: 'Alice Smith',
  email: 'customer@equiprent.com',
  role: USER_ROLES.CUSTOMER,
};

const DEFAULT_OWNER = {
  id: 'user_owner_1',
  name: 'Robert Jenkins',
  email: 'owner@equiprent.com',
  role: USER_ROLES.OWNER,
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('equiprent_user_role') || USER_ROLES.CUSTOMER);
  
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('equiprent_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CUSTOMER;
  });

  const [activeTab, setActiveTab] = useState('marketplace');

  useEffect(() => {
    localStorage.setItem('equiprent_user_role', role);
  }, [role]);

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('equiprent_user_role', newRole);

    let updatedUser = { ...user, role: newRole };
    if (newRole === USER_ROLES.OWNER && user.email === DEFAULT_CUSTOMER.email) {
      updatedUser = DEFAULT_OWNER;
    } else if (newRole === USER_ROLES.CUSTOMER && user.email === DEFAULT_OWNER.email) {
      updatedUser = DEFAULT_CUSTOMER;
    }

    setUser(updatedUser);
    localStorage.setItem('equiprent_user', JSON.stringify(updatedUser));

    if (newRole === USER_ROLES.OWNER && activeTab === 'marketplace') {
      setActiveTab('owner_dashboard');
    } else if (newRole === USER_ROLES.CUSTOMER && activeTab === 'owner_dashboard') {
      setActiveTab('marketplace');
    }
  };

  const loginUser = (userObj) => {
    setUser(userObj);
    setRole(userObj.role || USER_ROLES.CUSTOMER);
    localStorage.setItem('equiprent_user', JSON.stringify(userObj));
    localStorage.setItem('equiprent_user_role', userObj.role || USER_ROLES.CUSTOMER);
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
        loginUser,
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
