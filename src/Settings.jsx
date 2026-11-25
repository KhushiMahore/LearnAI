import React, { useState, useEffect } from 'react';

// Default application settings
const DEFAULT_SETTINGS = {
  // Account Profile
  name: 'Alex Johnson',
  email: 'alex.johnson@student.edu',

  // Appearance
  theme: 'light', // 'light' | 'dark'
  accentColor: 'purple', // 'purple' | 'blue' | 'teal'
  fontSize: 'medium', // 'small' | 'medium' | 'large'

  // Learning Preferences
  language: 'English', // 'English' | 'Hindi' | 'Hinglish'
  quizDifficulty: 'Medium', // 'Easy' | 'Medium' | 'Hard'
  studyFormat: 'Quizzes', // 'Summaries' | 'Quizzes' | 'Flashcards'
  personalizedRecs: true,

  // Notifications
  studyReminders: true,
  progressUpdates: true,
  quizResults: true,
  featureAnnouncements: false,

  // AI Preferences
  aiLanguage: 'English',
  aiStyle: 'Step-by-step', // 'Simple' | 'Detailed' | 'Step-by-step'
  aiExamples: true,
  aiQuizExplanations: true,
};

const LOCAL_STORAGE_KEY = 'learning_ai_user_settings_v1';

export default function Settings() {
  // Load saved settings or fallback to default
  const [savedSettings, setSavedSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (err) {
      console.error('Error reading localStorage settings:', err);
    }
    return DEFAULT_SETTINGS;
  });

  // Current active form state
  const [settings, setSettings] = useState(savedSettings);

  // Profile Edit Toggle State
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Toast Notification Banner State
  const [toast, setToast] = useState(null);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPwd: '',
    confirmPwd: '',
  });
  const [pwdFeedback, setPwdFeedback] = useState(null);

  // Show Toast Banner Helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper: Get Primary Accent Hex
  const getAccentHex = (color) => {
    switch (color) {
      case 'blue':
        return '#2563EB';
      case 'teal':
        return '#0D9488';
      case 'purple':
      default:
        return '#7C3AED';
    }
  };

  const getAccentHoverHex = (color) => {
    switch (color) {
      case 'blue':
        return '#1D4ED8';
      case 'teal':
        return '#0F766E';
      case 'purple':
      default:
        return '#6D28D9';
    }
  };

  const getAccentLightHex = (color) => {
    switch (color) {
      case 'blue':
        return '#EFF6FF';
      case 'teal':
        return '#F0FDFA';
      case 'purple':
      default:
        return '#F5F3FF';
    }
  };

  // Save All Changes
  const handleSave = () => {
    if (!settings.name.trim()) {
      showToast('error', 'Account Name cannot be empty.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!settings.email.trim() || !emailRegex.test(settings.email)) {
      showToast('error', 'Please enter a valid email address.');
      return;
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
      setSavedSettings(settings);
      setIsEditingProfile(false);
      showToast('success', 'Your settings and preferences have been saved!');
    } catch (err) {
      showToast('error', 'Failed to save settings to localStorage.');
    }
  };

  // Discard Unsaved Changes
  const handleCancel = () => {
    setSettings(savedSettings);
    setIsEditingProfile(false);
    showToast('info', 'Unsaved changes discarded.');
  };

  // Password Change Handler (Demo Validation)
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPwdFeedback(null);

    if (!passwordForm.current || !passwordForm.newPwd || !passwordForm.confirmPwd) {
      setPwdFeedback({ type: 'error', text: 'Please fill out all password fields.' });
      return;
    }

    if (passwordForm.newPwd.length < 6) {
      setPwdFeedback({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (passwordForm.newPwd !== passwordForm.confirmPwd) {
      setPwdFeedback({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setPwdFeedback({
      type: 'info',
      text: 'Demo Validation Success: Password format is valid! (Note: Real password changes require backend authentication).',
    });
    setPasswordForm({ current: '', newPwd: '', confirmPwd: '' });
  };

  // Clear Chat History Demo Handler
  const handleClearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear your local AI chat history?')) {
      try {
        localStorage.removeItem('learning_ai_chat_history');
        showToast('success', 'Local AI chat history cleared successfully.');
      } catch (e) {
        showToast('error', 'Failed to clear chat history.');
      }
    }
  };

  // Delete Account Demo Handler
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'DEMO ACTION: Request account deletion? Note: No real server data will be affected in this frontend prototype.'
      )
    ) {
      showToast(
        'info',
        'Demo Action: Account deletion requested. In production, a signal would be sent to your backend server.'
      );
    }
  };

  // Export Settings as JSON File
  const handleExportSettings = () => {
    try {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(settings, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'learning_ai_settings.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('success', 'Settings exported successfully as JSON!');
    } catch (e) {
      showToast('error', 'Failed to export settings file.');
    }
  };

  // Reset Preferences to Factory Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all preferences to default factory settings?')) {
      setSettings(DEFAULT_SETTINGS);
      setSavedSettings(DEFAULT_SETTINGS);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
        showToast('success', 'Settings reset to factory defaults.');
      } catch (e) {
        showToast('error', 'Failed to reset settings.');
      }
    }
  };

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'AI';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isDark = settings.theme === 'dark';
  const primaryColor = getAccentHex(settings.accentColor);
  const primaryHover = getAccentHoverHex(settings.accentColor);
  const primaryLight = getAccentLightHex(settings.accentColor);

  return (
    <div
      className={`stg-container ${isDark ? 'stg-dark-theme' : ''}`}
      style={{
        '--stg-primary': primaryColor,
        '--stg-primary-hover': primaryHover,
        '--stg-primary-light': primaryLight,
        fontSize:
          settings.fontSize === 'small'
            ? '14px'
            : settings.fontSize === 'large'
            ? '17px'
            : '15px',
      }}
    >
      {/* Scoped In-Page CSS */}
      <style>{`
        .stg-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #0F172A;
          background-color: #F8FAFC;
          min-height: 100vh;
          box-sizing: border-box;
          line-height: 1.5;
        }

        .stg-container * {
          box-sizing: border-box;
        }

        .stg-container.stg-dark-theme {
          background-color: #0F172A;
          color: #F8FAFC;
        }

        /* Header */
        .stg-header {
          margin-bottom: 2rem;
        }

        .stg-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.35rem;
        }

        .stg-title-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background-color: var(--stg-primary-light);
          color: var(--stg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stg-main-title {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0;
          color: inherit;
        }

        .stg-subtitle {
          font-size: 0.95rem;
          color: #64748B;
          margin: 0;
        }

        .stg-dark-theme .stg-subtitle {
          color: #94A3B8;
        }

        /* Toast Alert Banner */
        .stg-toast {
          padding: 0.875rem 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .stg-toast-success {
          background-color: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
        }

        .stg-dark-theme .stg-toast-success {
          background-color: rgba(6, 95, 70, 0.3);
          border-color: #059669;
          color: #6EE7B7;
        }

        .stg-toast-error {
          background-color: #FEF2F2;
          border: 1px solid #FECACA;
          color: #991B1B;
        }

        .stg-dark-theme .stg-toast-error {
          background-color: rgba(153, 27, 27, 0.3);
          border-color: #DC2626;
          color: #FCA5A5;
        }

        .stg-toast-info {
          background-color: #EFF6FF;
          border: 1px solid #BFDBFE;
          color: #1E40AF;
        }

        .stg-dark-theme .stg-toast-info {
          background-color: rgba(30, 64, 175, 0.3);
          border-color: #2563EB;
          color: #93C5FD;
        }

        /* Settings Card */
        .stg-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .stg-dark-theme .stg-card {
          background-color: #1E293B;
          border-color: #334155;
        }

        .stg-card-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .stg-dark-theme .stg-card-header {
          border-bottom-color: #334155;
        }

        .stg-card-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          color: inherit;
        }

        .stg-section-icon {
          width: 20px;
          height: 20px;
          color: var(--stg-primary);
          flex-shrink: 0;
        }

        /* Avatar Block */
        .stg-avatar-block {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
          padding: 1rem;
          background-color: #F8FAFC;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }

        .stg-dark-theme .stg-avatar-block {
          background-color: #0F172A;
          border-color: #334155;
        }

        .stg-avatar-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--stg-primary);
          color: #FFFFFF;
          font-size: 1.25rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stg-avatar-info {
          flex: 1;
        }

        .stg-avatar-name {
          font-weight: 700;
          font-size: 1.05rem;
          margin: 0 0 0.15rem 0;
        }

        .stg-avatar-email {
          font-size: 0.85rem;
          color: #64748B;
          margin: 0;
        }

        .stg-dark-theme .stg-avatar-email {
          color: #94A3B8;
        }

        /* Form Controls */
        .stg-form-group {
          margin-bottom: 1.25rem;
        }

        .stg-form-group:last-child {
          margin-bottom: 0;
        }

        .stg-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.375rem;
          color: inherit;
        }

        .stg-input, .stg-select {
          width: 100%;
          padding: 0.625rem 0.875rem;
          font-size: 0.9rem;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background-color: #FFFFFF;
          color: #0F172A;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .stg-dark-theme .stg-input,
        .stg-dark-theme .stg-select {
          background-color: #0F172A;
          border-color: #475569;
          color: #F8FAFC;
        }

        .stg-input:focus, .stg-select:focus {
          border-color: var(--stg-primary);
          box-shadow: 0 0 0 3px var(--stg-primary-light);
        }

        .stg-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* Segmented Button Group */
        .stg-segmented {
          display: flex;
          background-color: #F1F5F9;
          padding: 0.25rem;
          border-radius: 10px;
          gap: 0.25rem;
        }

        .stg-dark-theme .stg-segmented {
          background-color: #0F172A;
        }

        .stg-seg-btn {
          flex: 1;
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: #64748B;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .stg-dark-theme .stg-seg-btn {
          color: #94A3B8;
        }

        .stg-seg-btn.active {
          background-color: #FFFFFF;
          color: var(--stg-primary);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stg-dark-theme .stg-seg-btn.active {
          background-color: #1E293B;
          color: #FFFFFF;
        }

        /* Color Swatches */
        .stg-color-grid {
          display: flex;
          gap: 0.75rem;
        }

        .stg-color-swatch {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .stg-dark-theme .stg-color-swatch {
          background: #0F172A;
          border-color: #475569;
          color: #F8FAFC;
        }

        .stg-color-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
        }

        .stg-color-swatch.active {
          border-color: var(--stg-primary);
          background-color: var(--stg-primary-light);
          color: var(--stg-primary);
        }

        /* Toggle Row Switches */
        .stg-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #F1F5F9;
          gap: 1rem;
        }

        .stg-dark-theme .stg-toggle-row {
          border-bottom-color: #334155;
        }

        .stg-toggle-row:last-child {
          border-bottom: none;
        }

        .stg-toggle-text {
          flex: 1;
        }

        .stg-toggle-title {
          font-weight: 600;
          font-size: 0.9rem;
          margin: 0 0 0.15rem 0;
          color: inherit;
        }

        .stg-toggle-desc {
          font-size: 0.8rem;
          color: #64748B;
          margin: 0;
        }

        .stg-dark-theme .stg-toggle-desc {
          color: #94A3B8;
        }

        /* Custom Pure CSS Switch */
        .stg-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .stg-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .stg-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #CBD5E1;
          transition: 0.3s;
          border-radius: 24px;
        }

        .stg-dark-theme .stg-slider {
          background-color: #475569;
        }

        .stg-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .stg-slider {
          background-color: var(--stg-primary);
        }

        input:checked + .stg-slider:before {
          transform: translateX(20px);
        }

        /* Buttons */
        .stg-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .stg-btn-sm {
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
        }

        .stg-btn-primary {
          background-color: var(--stg-primary);
          color: #FFFFFF;
        }

        .stg-btn-primary:hover {
          background-color: var(--stg-primary-hover);
        }

        .stg-btn-secondary {
          background-color: transparent;
          border: 1px solid #CBD5E1;
          color: #334155;
        }

        .stg-dark-theme .stg-btn-secondary {
          border-color: #475569;
          color: #CBD5E1;
        }

        .stg-btn-secondary:hover {
          background-color: #F1F5F9;
        }

        .stg-dark-theme .stg-btn-secondary:hover {
          background-color: #334155;
        }

        .stg-btn-danger-outline {
          background-color: transparent;
          border: 1px solid #EF4444;
          color: #EF4444;
        }

        .stg-btn-danger-outline:hover {
          background-color: #FEF2F2;
        }

        .stg-dark-theme .stg-btn-danger-outline:hover {
          background-color: rgba(239, 68, 68, 0.15);
        }

        .stg-btn-danger {
          background-color: #DC2626;
          color: #FFFFFF;
        }

        .stg-btn-danger:hover {
          background-color: #B91C1C;
        }

        /* Info Box */
        .stg-info-box {
          padding: 0.875rem 1rem;
          background-color: #F1F5F9;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #475569;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .stg-dark-theme .stg-info-box {
          background-color: #0F172A;
          color: #94A3B8;
        }

        /* Bottom In-Flow Actions Bar */
        .stg-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid #E2E8F0;
        }

        .stg-dark-theme .stg-actions-bar {
          border-top-color: #334155;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .stg-grid-2 {
            grid-template-columns: 1fr;
          }
          .stg-color-grid {
            flex-direction: column;
          }
          .stg-actions-bar {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .stg-actions-bar button {
            width: 100%;
          }
        }
      `}</style>

      {/* Page Header (In-Flow, Not Fixed) */}
      <header className="stg-header">
        <div className="stg-title-row">
          <div className="stg-title-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h1 className="stg-main-title">Settings</h1>
        </div>
        <p className="stg-subtitle">
          Manage your account profile, customize interface appearance, and configure AI learning preferences.
        </p>
      </header>

      {/* Toast Alert Banner */}
      {toast && (
        <div className={`stg-toast stg-toast-${toast.type}`}>
          <span>
            {toast.type === 'success' ? '✅ ' : toast.type === 'error' ? '⚠️ ' : 'ℹ️ '}
            {toast.message}
          </span>
          <button
            type="button"
            className="stg-toast-close"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* SECTION A: ACCOUNT PROFILE */}
      <section className="stg-card">
        <div className="stg-card-header">
          <svg
            className="stg-section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h2 className="stg-card-title">Account Profile</h2>
        </div>

        <div className="stg-avatar-block">
          <div className="stg-avatar-circle">{getInitials(settings.name)}</div>
          <div className="stg-avatar-info">
            <h3 className="stg-avatar-name">{settings.name || 'Student Learner'}</h3>
            <p className="stg-avatar-email">{settings.email}</p>
          </div>
          <button
            type="button"
            className="stg-btn stg-btn-secondary stg-btn-sm"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            {isEditingProfile ? 'Done Editing' : 'Edit Profile'}
          </button>
        </div>

        <div className="stg-grid-2">
          <div className="stg-form-group">
            <label className="stg-label" htmlFor="stg-name-input">
              Display Name
            </label>
            <input
              id="stg-name-input"
              type="text"
              className="stg-input"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div className="stg-form-group">
            <label className="stg-label" htmlFor="stg-email-input">
              Email Address
            </label>
            <input
              id="stg-email-input"
              type="email"
              className="stg-input"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="student@university.edu"
            />
          </div>
        </div>
      </section>

      {/* SECTION B: APPEARANCE */}
      <section className="stg-card">
        <div className="stg-card-header">
          <svg
            className="stg-section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a7 7 0 1 0 10 10" />
          </svg>
          <h2 className="stg-card-title">Appearance</h2>
        </div>

        <div className="stg-form-group">
          <label className="stg-label">Theme Mode</label>
          <div className="stg-segmented">
            <button
              type="button"
              className={`stg-seg-btn ${settings.theme === 'light' ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, theme: 'light' })}
            >
              ☀️ Light Theme
            </button>
            <button
              type="button"
              className={`stg-seg-btn ${settings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, theme: 'dark' })}
            >
              🌙 Dark Theme
            </button>
          </div>
        </div>

        <div className="stg-form-group">
          <label className="stg-label">Accent Color</label>
          <div className="stg-color-grid">
            <button
              type="button"
              className={`stg-color-swatch ${settings.accentColor === 'purple' ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, accentColor: 'purple' })}
            >
              <span className="stg-color-dot" style={{ backgroundColor: '#7C3AED' }}></span>
              Purple
            </button>

            <button
              type="button"
              className={`stg-color-swatch ${settings.accentColor === 'blue' ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, accentColor: 'blue' })}
            >
              <span className="stg-color-dot" style={{ backgroundColor: '#2563EB' }}></span>
              Blue
            </button>

            <button
              type="button"
              className={`stg-color-swatch ${settings.accentColor === 'teal' ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, accentColor: 'teal' })}
            >
              <span className="stg-color-dot" style={{ backgroundColor: '#0D9488' }}></span>
              Teal
            </button>
          </div>
        </div>

        <div className="stg-form-group">
          <label className="stg-label">Font Size</label>
          <div className="stg-segmented">
            <button
              type="button"
              className={`stg-seg-btn ${settings.fontSize === 'small' ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, fontSize: 'small' })}
            >
              Small
            </button>
            <button
              type="button"
              className={`stg-seg-btn ${settings.fontSize === 'medium' ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, fontSize: 'medium' })}
            >
              Medium
            </button>
            <button
              type="button"
              className={`stg-seg-btn ${settings.fontSize === 'large' ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, fontSize: 'large' })}
            >
              Large
            </button>
          </div>
        </div>
      </section>

      {/* SECTION C: LEARNING PREFERENCES */}
      <section className="stg-card">
        <div className="stg-card-header">
          <svg
            className="stg-section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <h2 className="stg-card-title">Learning Preferences</h2>
        </div>

        <div className="stg-grid-2">
          <div className="stg-form-group">
            <label className="stg-label" htmlFor="stg-lang-select">
              Preferred Learning Language
            </label>
            <select
              id="stg-lang-select"
              className="stg-select"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>

          <div className="stg-form-group">
            <label className="stg-label">Default Quiz Difficulty</label>
            <div className="stg-segmented">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  className={`stg-seg-btn ${settings.quizDifficulty === diff ? 'active' : ''}`}
                  onClick={() => setSettings({ ...settings, quizDifficulty: diff })}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="stg-form-group">
          <label className="stg-label">Preferred Study Format</label>
          <div className="stg-segmented">
            {['Summaries', 'Quizzes', 'Flashcards'].map((format) => (
              <button
                key={format}
                type="button"
                className={`stg-seg-btn ${settings.studyFormat === format ? 'active' : ''}`}
                onClick={() => setSettings({ ...settings, studyFormat: format })}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="stg-toggle-row">
          <div className="stg-toggle-text">
            <p className="stg-toggle-title">Personalized Recommendations</p>
            <p className="stg-toggle-desc">
              Receive smart topic suggestions based on your study history and quiz scores.
            </p>
          </div>
          <label className="stg-switch">
            <input
              type="checkbox"
              checked={settings.personalizedRecs}
              onChange={(e) => setSettings({ ...settings, personalizedRecs: e.target.checked })}
            />
            <span className="stg-slider"></span>
          </label>
        </div>
      </section>

      {/* SECTION D: NOTIFICATIONS */}
      <section className="stg-card">
        <div className="stg-card-header">
          <svg
            className="stg-section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <h2 className="stg-card-title">Notifications</h2>
        </div>

        <div className="stg-toggle-row">
          <div className="stg-toggle-text">
            <p className="stg-toggle-title">Study Reminders</p>
            <p className="stg-toggle-desc">Daily reminders to maintain your study schedule and streak.</p>
          </div>
          <label className="stg-switch">
            <input
              type="checkbox"
              checked={settings.studyReminders}
              onChange={(e) => setSettings({ ...settings, studyReminders: e.target.checked })}
            />
            <span className="stg-slider"></span>
          </label>
        </div>

        <div className="stg-toggle-row">
          <div className="stg-toggle-text">
            <p className="stg-toggle-title">Learning Progress Updates</p>
            <p className="stg-toggle-desc">Weekly summary notifications of completed topics and accuracy.</p>
          </div>
          <label className="stg-switch">
            <input
              type="checkbox"
              checked={settings.progressUpdates}
              onChange={(e) => setSettings({ ...settings, progressUpdates: e.target.checked })}
            />
            <span className="stg-slider"></span>
          </label>
        </div>

        <div className="stg-toggle-row">
          <div className="stg-toggle-text">
            <p className="stg-toggle-title">Quiz Results</p>
            <p className="stg-toggle-desc">Instant score notifications after finishing practice quizzes.</p>
          </div>
          <label className="stg-switch">
            <input
              type="checkbox"
              checked={settings.quizResults}
              onChange={(e) => setSettings({ ...settings, quizResults: e.target.checked })}
            />
            <span className="stg-slider"></span>
          </label>
        </div>

        <div className="stg-toggle-row">
          <div className="stg-toggle-text">
            <p className="stg-toggle-title">New Feature Announcements</p>
            <p className="stg-toggle-desc">Stay updated on new AI capabilities and platform enhancements.</p>
          </div>
          <label className="stg-switch">
            <input
              type="checkbox"
              checked={settings.featureAnnouncements}
              onChange={(e) => setSettings({ ...settings, featureAnnouncements: e.target.checked })}
            />
            <span className="stg-slider"></span>
          </label>
        </div>
      </section>

      {/* SECTION E: AI PREFERENCES */}
      <section className="stg-card">
        <div className="stg-card-header">
          <svg
            className="stg-section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8.01" y2="16" />
            <line x1="16" y1="16" x2="16.01" y2="16" />
          </svg>
          <h2 className="stg-card-title">AI Preferences</h2>
        </div>

        <div className="stg-grid-2">
          <div className="stg-form-group">
            <label className="stg-label" htmlFor="stg-ai-lang">
              Default AI Language
            </label>
            <select
              id="stg-ai-lang"
              className="stg-select"
              value={settings.aiLanguage}
              onChange={(e) => setSettings({ ...settings, aiLanguage: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>

          <div className="stg-form-group">
            <label className="stg-label">Explanation Style</label>
            <select
              className="stg-select"
              value={settings.aiStyle}
              onChange={(e) => setSettings({ ...settings, aiStyle: e.target.value })}
            >
              <option value="Simple">Simple & Plain</option>
              <option value="Detailed">Detailed & In-Depth</option>
              <option value="Step-by-step">Step-by-Step Breakdown</option>
            </select>
          </div>
        </div>

        <div className="stg-toggle-row">
          <div className="stg-toggle-text">
            <p className="stg-toggle-title">Show Examples in AI Explanations</p>
            <p className="stg-toggle-desc">Include practical code snippets and real-world examples in responses.</p>
          </div>
          <label className="stg-switch">
            <input
              type="checkbox"
              checked={settings.aiExamples}
              onChange={(e) => setSettings({ ...settings, aiExamples: e.target.checked })}
            />
            <span className="stg-slider"></span>
          </label>
        </div>

        <div className="stg-toggle-row">
          <div className="stg-toggle-text">
            <p className="stg-toggle-title">Include Quiz Answer Explanations</p>
            <p className="stg-toggle-desc">Automatically display detailed step-by-step logic alongside quiz options.</p>
          </div>
          <label className="stg-switch">
            <input
              type="checkbox"
              checked={settings.aiQuizExplanations}
              onChange={(e) => setSettings({ ...settings, aiQuizExplanations: e.target.checked })}
            />
            <span className="stg-slider"></span>
          </label>
        </div>
      </section>

      {/* SECTION F: PRIVACY AND SECURITY */}
      <section className="stg-card">
        <div className="stg-card-header">
          <svg
            className="stg-section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h2 className="stg-card-title">Privacy and Security</h2>
        </div>

        <div className="stg-info-box">
          <span>📧 Connected Account: <strong>{settings.email}</strong></span>
        </div>

        <form onSubmit={handlePasswordSubmit} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.875rem 0' }}>Change Password</h3>

          {pwdFeedback && (
            <div className={`stg-toast stg-toast-${pwdFeedback.type}`} style={{ marginBottom: '1rem' }}>
              <span>{pwdFeedback.text}</span>
            </div>
          )}

          <div className="stg-form-group">
            <label className="stg-label" htmlFor="stg-curr-pwd">
              Current Password
            </label>
            <input
              id="stg-curr-pwd"
              type="password"
              className="stg-input"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="stg-grid-2">
            <div className="stg-form-group">
              <label className="stg-label" htmlFor="stg-new-pwd">
                New Password
              </label>
              <input
                id="stg-new-pwd"
                type="password"
                className="stg-input"
                value={passwordForm.newPwd}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPwd: e.target.value })}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="stg-form-group">
              <label className="stg-label" htmlFor="stg-confirm-pwd">
                Confirm New Password
              </label>
              <input
                id="stg-confirm-pwd"
                type="password"
                className="stg-input"
                value={passwordForm.confirmPwd}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPwd: e.target.value })}
                placeholder="Repeat new password"
              />
            </div>
          </div>

          <button type="submit" className="stg-btn stg-btn-secondary" style={{ marginTop: '0.5rem' }}>
            Validate Password Change
          </button>
        </form>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem 0', color: '#DC2626' }}>
            Danger Zone
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="stg-btn stg-btn-danger-outline"
              onClick={handleClearChatHistory}
            >
              Clear AI Chat History
            </button>
            <button
              type="button"
              className="stg-btn stg-btn-danger"
              onClick={handleDeleteAccount}
            >
              Delete Account (Demo)
            </button>
          </div>
        </div>
      </section>

      {/* SECTION G: DATA MANAGEMENT */}
      <section className="stg-card">
        <div className="stg-card-header">
          <svg
            className="stg-section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
          <h2 className="stg-card-title">Data Management</h2>
        </div>

        <div className="stg-info-box">
          <span>ℹ️ Note: All preferences are saved locally in your browser's local storage for this frontend prototype.</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="stg-btn stg-btn-secondary" onClick={handleExportSettings}>
            Export Settings (JSON)
          </button>
          <button type="button" className="stg-btn stg-btn-secondary" onClick={handleResetDefaults}>
            Reset to Defaults
          </button>
        </div>
      </section>

      {/* BOTTOM IN-FLOW ACTION CONTROLS */}
      <div className="stg-actions-bar">
        <button type="button" className="stg-btn stg-btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" className="stg-btn stg-btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}