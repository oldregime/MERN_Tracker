import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const demoMode = sessionStorage.getItem('demoMode');
    
    if (demoMode === 'true') {
      enterDemoMode();
    } else if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('demoMode');
    sessionStorage.removeItem('demoData');
    setUser(null);
    setIsAuthenticated(false);
    setIsDemoMode(false);
  };

  const enterDemoMode = () => {
    const demoUser = {
      _id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      currency: 'USD',
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('demoMode', 'true');
    setUser(demoUser);
    setIsAuthenticated(true);
    setIsDemoMode(true);
    setLoading(false);
  };

  const updateProfile = async (profileData) => {
    try {
      if (isDemoMode) {
        // Update demo user locally
        setUser({ ...user, ...profileData });
        return true;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setUser(data.data);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      if (isDemoMode) {
        // Simulate password change in demo mode
        return true;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return true;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUser(data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isDemoMode,
    register,
    login,
    logout,
    loadUser,
    enterDemoMode,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

