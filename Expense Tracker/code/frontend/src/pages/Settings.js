import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, isDemoMode, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    monthlyReports: false,
    compactView: false,
    showDecimals: true
  });

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSettingChange = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    alert('Exporting your data... (Feature coming soon)');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm === 'DELETE') {
      if (isDemoMode) {
        alert('Cannot delete demo account. Please create a real account to use this feature.');
        return;
      }
      // In a real app, this would call the delete account API
      alert('Account deletion requested. This feature will be implemented soon.');
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      {isDemoMode && (
        <div className="alert alert-info mb-4">
          <i className="fas fa-info-circle"></i>
          <strong>Demo Mode:</strong> You're using demo mode. Settings changes won't be saved permanently.
        </div>
      )}

      {/* Account Settings */}
      <div className="card mb-4">
        <div className="card-header">
          <h3><i className="fas fa-user-cog"></i> Account Settings</h3>
        </div>
        <div className="card-body">
          <div className="settings-item">
            <div>
              <h4>Email</h4>
              <p>{user?.email}</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/profile')}>
              Edit Profile
            </button>
          </div>

          <div className="settings-item">
            <div>
              <h4>Currency</h4>
              <p>{user?.currency || 'USD'}</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/profile')}>
              Change Currency
            </button>
          </div>

          <div className="settings-item">
            <div>
              <h4>Account Status</h4>
              <p>{user?.isEmailVerified ? 'Verified' : 'Unverified'}</p>
            </div>
            {!user?.isEmailVerified && (
              <button className="btn btn-primary">
                Verify Email
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card mb-4">
        <div className="card-header">
          <h3><i className="fas fa-bell"></i> Notifications</h3>
        </div>
        <div className="card-body">
          <div className="settings-toggle">
            <div>
              <h4>Email Notifications</h4>
              <p>Receive email updates about your account</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleSettingChange('emailNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <div>
              <h4>Budget Alerts</h4>
              <p>Get notified when you're close to budget limits</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.budgetAlerts}
                onChange={() => handleSettingChange('budgetAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <div>
              <h4>Monthly Reports</h4>
              <p>Receive monthly financial summary reports</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.monthlyReports}
                onChange={() => handleSettingChange('monthlyReports')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card mb-4">
        <div className="card-header">
          <h3><i className="fas fa-palette"></i> Display</h3>
        </div>
        <div className="card-body">
          <div className="settings-toggle">
            <div>
              <h4>Dark Mode</h4>
              <p>Use dark theme for the interface</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <div>
              <h4>Compact View</h4>
              <p>Show more data in less space</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.compactView}
                onChange={() => handleSettingChange('compactView')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <div>
              <h4>Show Decimals</h4>
              <p>Display decimal places in amounts</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showDecimals}
                onChange={() => handleSettingChange('showDecimals')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card mb-4">
        <div className="card-header">
          <h3><i className="fas fa-database"></i> Data Management</h3>
        </div>
        <div className="card-body">
          <div className="settings-item">
            <div>
              <h4>Export Data</h4>
              <p>Download all your financial data as CSV</p>
            </div>
            <button className="btn btn-outline" onClick={handleExportData}>
              <i className="fas fa-download"></i> Export
            </button>
          </div>

          <div className="settings-item">
            <div>
              <h4>Import Data</h4>
              <p>Import transactions from CSV file</p>
            </div>
            <button className="btn btn-outline">
              <i className="fas fa-upload"></i> Import
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card card-danger mb-4">
        <div className="card-header">
          <h3><i className="fas fa-exclamation-triangle"></i> Danger Zone</h3>
        </div>
        <div className="card-body">
          <div className="settings-item">
            <div>
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all data</p>
            </div>
            <button 
              className="btn btn-danger" 
              onClick={() => setShowDeleteModal(true)}
              disabled={isDemoMode}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-triangle"></i>
                <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
              </div>
              
              <p>Type <strong>DELETE</strong> to confirm:</p>
              <input
                type="text"
                className="form-control"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE'}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
