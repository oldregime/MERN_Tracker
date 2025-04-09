import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'USD'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });

    // Clear error when user types
    if (profileErrors[e.target.name]) {
      setProfileErrors({
        ...profileErrors,
        [e.target.name]: ''
      });
    }

    // Clear success message when user makes changes
    if (profileSuccess) {
      setProfileSuccess(false);
    }
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });

    // Clear error when user types
    if (passwordErrors[e.target.name]) {
      setPasswordErrors({
        ...passwordErrors,
        [e.target.name]: ''
      });
    }

    // Clear success message when user makes changes
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};

    if (!profileForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!profileForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(profileForm.email)) {
      errors.email = 'Email is invalid';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    setIsSubmittingProfile(true);

    try {
      // In a real app, this would call the updateProfile function from AuthContext
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('Profile updated:', profileForm);
      setProfileSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsSubmittingPassword(true);

    try {
      // In a real app, this would call the changePassword function from AuthContext
      // For now, we'll just simulate a successful password change
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('Password changed');
      setPasswordSuccess(true);

      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors({ submit: 'Failed to change password. Please try again.' });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';

    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex align-center gap-3 mb-4">
            <div className="profile-avatar">
              {getUserInitials()}
            </div>
            <div>
              <h2>{user?.name || 'User'}</h2>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <h4>Member Since</h4>
                <p>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="stat-item">
              <i className="fas fa-money-bill-wave"></i>
              <div>
                <h4>Preferred Currency</h4>
                <p>{user?.currency || 'USD'}</p>
              </div>
            </div>

            <div className="stat-item">
              <i className="fas fa-check-circle"></i>
              <div>
                <h4>Account Status</h4>
                <p>{user?.isEmailVerified ? 'Verified' : 'Unverified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="card profile-form-card">
          <div className="card-header">
            <h3>Update Profile</h3>
          </div>
          <div className="card-body">
            {profileSuccess && (
              <div className="alert alert-success">
                Profile updated successfully!
              </div>
            )}

            {profileErrors.submit && (
              <div className="alert alert-danger">
                {profileErrors.submit}
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                />
                {profileErrors.name && <div className="form-error">{profileErrors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                />
                {profileErrors.email && <div className="form-error">{profileErrors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="currency" className="form-label">Preferred Currency</label>
                <select
                  id="currency"
                  name="currency"
                  className="form-control"
                  value={profileForm.currency}
                  onChange={handleProfileChange}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmittingProfile}
              >
                {isSubmittingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

        <div className="card profile-form-card">
          <div className="card-header">
            <h3>Change Password</h3>
          </div>
          <div className="card-body">
            {passwordSuccess && (
              <div className="alert alert-success">
                Password changed successfully!
              </div>
            )}

            {passwordErrors.submit && (
              <div className="alert alert-danger">
                {passwordErrors.submit}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="form-control"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
                {passwordErrors.currentPassword && <div className="form-error">{passwordErrors.currentPassword}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="form-control"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
                {passwordErrors.newPassword && <div className="form-error">{passwordErrors.newPassword}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
                {passwordErrors.confirmPassword && <div className="form-error">{passwordErrors.confirmPassword}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmittingPassword}
              >
                {isSubmittingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;