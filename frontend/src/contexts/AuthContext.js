import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Change this line to export the context
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Default mock user for bypassing authentication
  const defaultUser = {
    id: 'default-user-id',
    name: 'Demo User',
    email: 'demo@example.com',
    currency: 'INR',
    isEmailVerified: true,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false); // Set to false to avoid loading state
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated

  // Keep these functions for future use, but they won't actually change the authentication state
  const register = async (formData) => {
    console.log('Registration bypassed:', formData);
    return true;
  };

  const login = async (credentials) => {
    console.log('Login bypassed:', credentials);
    return true;
  };

  const logout = () => {
    console.log('Logout bypassed');
    // In a real app, this would clear the user state
  };

  const loadUser = async () => {
    // In bypass mode, we always use the default user
    setLoading(false);
  };

  // No need to load user on mount since we're using a default user
  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated, // Always true in bypass mode
    register,
    login,
    logout,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



