// src/settings/Settings.jsx
import React from 'react';
import './Settings.css'; // Import the styles for the settings page from the correct directory

export function Settings() {
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <p className="settings-description">Manage your application preferences and account settings here.</p>

      <section className="settings-section">
        <h2 className="section-title">Account Information</h2>
        <div className="setting-item">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value="Ai N" readOnly />
        </div>
        <div className="setting-item">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value="ainiimura.wae@gmail.com" readOnly />
        </div>
        {/* In a real app, you might have editable fields and a save button */}
        <button className="settings-button">Edit Profile</button>
      </section>

      <section className="settings-section">
        <h2 className="section-title">Notification Preferences</h2>
        <div className="setting-item checkbox-item">
          <input type="checkbox" id="email-notifications" defaultChecked />
          <label htmlFor="email-notifications">Receive email notifications</label>
        </div>
        <div className="setting-item checkbox-item">
          <input type="checkbox" id="app-notifications" />
          <label htmlFor="app-notifications">Receive in-app notifications</label>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="section-title">Security</h2>
        <button className="settings-button">Change Password</button>
        <button className="settings-button secondary-button">Two-Factor Authentication</button>
      </section>

      <section className="settings-section danger-zone">
        <h2 className="section-title">Danger Zone</h2>
        <button className="settings-button danger-button">Delete Account</button>
      </section>
    </div>
  );
}

export default Settings;
