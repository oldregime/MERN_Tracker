import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Page Components
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { sidebarOpen } = useSidebar();
  const { isAuthenticated } = useAuth();

  return (
    <div className={`app ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {isAuthenticated && <Header />}

      <div className="main-container">
        {isAuthenticated && <Sidebar />}

        <main className={`content ${!isAuthenticated ? 'auth-layout' : ''}`}>
          <Routes>
            {/* Redirect root to register if not authenticated */}
            <Route path="/" element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/register" />
            } />

            {/* Auth routes */}
            <Route path="/register" element={
              !isAuthenticated ? <Register /> : <Navigate to="/" />
            } />
            <Route path="/login" element={
              !isAuthenticated ? <Login /> : <Navigate to="/" />
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route path="/profile" element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" />
            } />
            <Route path="/expenses" element={
              isAuthenticated ? <Expenses /> : <Navigate to="/login" />
            } />
            <Route path="/income" element={
              isAuthenticated ? <Income /> : <Navigate to="/login" />
            } />
            <Route path="/budgets" element={
              isAuthenticated ? <Budgets /> : <Navigate to="/login" />
            } />
            <Route path="/reports" element={
              isAuthenticated ? <Reports /> : <Navigate to="/login" />
            } />
            <Route path="/settings" element={
              isAuthenticated ? <Settings /> : <Navigate to="/login" />
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;


