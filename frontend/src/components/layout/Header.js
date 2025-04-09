import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../contexts/SidebarContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'DU';

    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
          </button>
          <Link to="/" className="logo">
            <i className="fas fa-wallet"></i>
            <span>Finance Tracker</span>
          </Link>
        </div>

        {/* Always show user menu in bypass mode */}
        <div className="user-menu">
          <div className="user-menu-button" onClick={toggleUserMenu}>
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <span>{user?.name || 'Demo User'}</span>
            <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
          </div>

          {showUserMenu && (
            <div className="user-menu-dropdown">
              <Link to="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                <i className="fas fa-user"></i> Profile
              </Link>
              <Link to="/settings" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                <i className="fas fa-cog"></i> Settings
              </Link>
              <div className="user-menu-item logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
