import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, MessageSquare, HelpCircle, 
  User, Mail, Lock, Building, GraduationCap, Calendar, 
  CheckCircle, Eye, EyeOff, ArrowRight, AlertCircle 
} from 'lucide-react';

export default function RegisterPage({ onNavigate }) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    course: '',
    yearOfStudy: '1st Year',
    agreeTerms: false
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Input Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation Logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course/Department is required';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the Terms and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Mock Registration Flow (For Python Flask Backend Integration)
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="reg-wrapper">
      <style>{`
        .reg-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #F8F9FD;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          box-sizing: border-box;
          font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #20243A;
        }

        .reg-card {
          width: 100%;
          max-width: 1100px;
          background: #FFFFFF;
          border-radius: 1.5rem;
          border: 1px solid #E7E5EF;
          box-shadow: 0 20px 40px rgba(32, 36, 58, 0.05);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr;
        }

        @media (min-width: 900px) {
          .reg-card {
            grid-template-columns: 0.95fr 1.05fr;
          }
        }

        /* Left Side Panel */
        .reg-promo {
          background: linear-gradient(135deg, #EDE8FF 0%, #f3efff 100%);
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #E7E5EF;
          position: relative;
        }

        .reg-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .reg-logo-icon {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #6847E8;
          color: #FFFFFF;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.25);
        }

        .reg-brand-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #20243A;
        }

        .reg-headline {
          font-size: 1.85rem;
          font-weight: 800;
          line-height: 1.25;
          color: #20243A;
          margin-bottom: 1rem;
        }

        .reg-description {
          font-size: 0.925rem;
          color: #77758A;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .reg-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reg-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          padding: 0.875rem 1rem;
          border-radius: 1rem;
          border: 1px solid rgba(231, 229, 239, 0.8);
        }

        .reg-feature-icon {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          background: #EDE8FF;
          color: #6847E8;
          display: flex;
          align-items: center;
          justify-content: center;
          shrink: 0;
        }

        .reg-feature-text h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #20243A;
          margin: 0 0 0.15rem 0;
        }

        .reg-feature-text p {
          font-size: 0.775rem;
          color: #77758A;
          margin: 0;
        }

        .reg-promo-footer {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(231, 229, 239, 0.8);
          font-size: 0.825rem;
          color: #77758A;
        }

        /* Right Side Form Panel */
        .reg-form-panel {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .reg-form-header {
          margin-bottom: 2rem;
        }

        .reg-form-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.35rem 0;
        }

        .reg-form-subtitle {
          font-size: 0.875rem;
          color: #77758A;
          margin: 0;
        }

        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 1.125rem;
        }

        .reg-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.125rem;
        }

        @media (min-width: 600px) {
          .reg-grid-2 {
            grid-template-columns: 1fr 1fr;
          }
        }

        .reg-field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .reg-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #20243A;
        }

        .reg-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .reg-input-icon {
          position: absolute;
          left: 0.875rem;
          color: #77758A;
          pointer-events: none;
        }

        .reg-input {
          width: 100%;
          padding: 0.675rem 0.875rem 0.675rem 2.5rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #20243A;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .reg-input:focus {
          border-color: #6847E8;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(104, 71, 232, 0.1);
        }

        .reg-input.has-error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .reg-select {
          appearance: none;
          cursor: pointer;
        }

        .reg-toggle-pwd {
          position: absolute;
          right: 0.875rem;
          background: none;
          border: none;
          color: #77758A;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .reg-error-msg {
          font-size: 0.75rem;
          color: #ef4444;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.15rem;
        }

        .reg-checkbox-field {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          margin-top: 0.25rem;
        }

        .reg-checkbox {
          accent-color: #6847E8;
          width: 1rem;
          height: 1rem;
          margin-top: 0.15rem;
          cursor: pointer;
        }

        .reg-checkbox-label {
          font-size: 0.8rem;
          color: #77758A;
          line-height: 1.4;
        }

        .reg-link {
          color: #6847E8;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
        }

        .reg-link:hover {
          text-decoration: underline;
        }

        .reg-btn-submit {
          width: 100%;
          padding: 0.85rem;
          background: #6847E8;
          color: #FFFFFF;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.925rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(104, 71, 232, 0.25);
          margin-top: 0.5rem;
        }

        .reg-btn-submit:hover:not(:disabled) {
          background: #5736d7;
          transform: translateY(-1px);
        }

        .reg-btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .reg-footer-link {
          text-align: center;
          font-size: 0.85rem;
          color: #77758A;
          margin-top: 1.25rem;
        }

        .reg-success-box {
          background: #EDE8FF;
          border: 1px solid rgba(104, 71, 232, 0.3);
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .reg-success-icon {
          width: 3.5rem;
          height: 3.5rem;
          background: #6847E8;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reg-spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="reg-card">
        {/* Promotional Side Banner */}
        <div className="reg-promo">
          <div>
            <div className="reg-brand">
              <div className="reg-logo-icon">L</div>
              <span className="reg-brand-title">Learning AI</span>
            </div>

            <h1 className="reg-headline">Start Your Smarter Learning Journey</h1>
            <p className="reg-description">
              Transform long lecture notes, research papers, and textbooks into bite-sized summaries, active recall flashcards, and instant practice quizzes.
            </p>

            <div className="reg-features">
              <div className="reg-feature-item">
                <div className="reg-feature-icon"><Sparkles size={18} /></div>
                <div className="reg-feature-text">
                  <h4>Smart PDF Summaries</h4>
                  <p>Extract key concepts from heavy study materials in seconds.</p>
                </div>
              </div>

              <div className="reg-feature-item">
                <div className="reg-feature-icon"><MessageSquare size={18} /></div>
                <div className="reg-feature-text">
                  <h4>Contextual Q&A</h4>
                  <p>Ask direct questions from your course notes and get clear answers.</p>
                </div>
              </div>

              <div className="reg-feature-item">
                <div className="reg-feature-icon"><HelpCircle size={18} /></div>
                <div className="reg-feature-text">
                  <h4>AI Quiz Generation</h4>
                  <p>Auto-generate quizzes to test your memory and track score growth.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="reg-promo-footer">
            Joined by students preparing for CSE, IT, and Engineering exams.
          </div>
        </div>

        {/* Form Section */}
        <div className="reg-form-panel">
          <div className="reg-form-header">
            <h2 className="reg-form-title">Create an Account</h2>
            <p className="reg-form-subtitle">Fill in your academic details to get started.</p>
          </div>

          {isSuccess ? (
            <div className="reg-success-box">
              <div className="reg-success-icon"><CheckCircle size={32} /></div>
              <h3 style={{ margin: 0, color: '#20243A', fontSize: '1.25rem', fontWeight: 700 }}>Registration Successful!</h3>
              <p style={{ margin: 0, color: '#77758A', fontSize: '0.875rem' }}>
                Your Learning AI profile has been initialized. You can now sign in to start uploading your documents.
              </p>
              <button 
                onClick={() => onNavigate('login')} 
                className="reg-btn-submit"
                style={{ marginTop: '0.5rem' }}
              >
                Proceed to Sign In <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reg-form" noValidate>
              {/* Full Name */}
              <div className="reg-field">
                <label className="reg-label">Full Name *</label>
                <div className="reg-input-wrap">
                  <User className="reg-input-icon" size={16} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. Alex Johnson"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`reg-input ${errors.fullName ? 'has-error' : ''}`}
                  />
                </div>
                {errors.fullName && <span className="reg-error-msg"><AlertCircle size={12} /> {errors.fullName}</span>}
              </div>

              {/* Email Address */}
              <div className="reg-field">
                <label className="reg-label">Email Address *</label>
                <div className="reg-input-wrap">
                  <Mail className="reg-input-icon" size={16} />
                  <input
                    type="email"
                    name="email"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className={`reg-input ${errors.email ? 'has-error' : ''}`}
                  />
                </div>
                {errors.email && <span className="reg-error-msg"><AlertCircle size={12} /> {errors.email}</span>}
              </div>

              {/* Passwords Grid */}
              <div className="reg-grid-2">
                <div className="reg-field">
                  <label className="reg-label">Password *</label>
                  <div className="reg-input-wrap">
                    <Lock className="reg-input-icon" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="At least 8 chars"
                      value={formData.password}
                      onChange={handleChange}
                      className={`reg-input ${errors.password ? 'has-error' : ''}`}
                    />
                    <button
                      type="button"
                      className="reg-toggle-pwd"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <span className="reg-error-msg"><AlertCircle size={12} /> {errors.password}</span>}
                </div>

                <div className="reg-field">
                  <label className="reg-label">Confirm Password *</label>
                  <div className="reg-input-wrap">
                    <Lock className="reg-input-icon" size={16} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`reg-input ${errors.confirmPassword ? 'has-error' : ''}`}
                    />
                    <button
                      type="button"
                      className="reg-toggle-pwd"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="reg-error-msg"><AlertCircle size={12} /> {errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Academic Details */}
              <div className="reg-field">
                <label className="reg-label">College / University Name (Optional)</label>
                <div className="reg-input-wrap">
                  <Building className="reg-input-icon" size={16} />
                  <input
                    type="text"
                    name="collegeName"
                    placeholder="e.g. State Institute of Technology"
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="reg-input"
                  />
                </div>
              </div>

              <div className="reg-grid-2">
                <div className="reg-field">
                  <label className="reg-label">Course / Department *</label>
                  <div className="reg-input-wrap">
                    <GraduationCap className="reg-input-icon" size={16} />
                    <input
                      type="text"
                      name="course"
                      placeholder="e.g. B.Tech CSE / IT"
                      value={formData.course}
                      onChange={handleChange}
                      className={`reg-input ${errors.course ? 'has-error' : ''}`}
                    />
                  </div>
                  {errors.course && <span className="reg-error-msg"><AlertCircle size={12} /> {errors.course}</span>}
                </div>

                <div className="reg-field">
                  <label className="reg-label">Year of Study *</label>
                  <div className="reg-input-wrap">
                    <Calendar className="reg-input-icon" size={16} />
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      className="reg-input reg-select"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="reg-field">
                <div className="reg-checkbox-field">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="reg-checkbox"
                  />
                  <label htmlFor="agreeTerms" className="reg-checkbox-label">
                    I agree to the <span className="reg-link">Terms of Service</span> and <span className="reg-link">Privacy Policy</span>.
                  </label>
                </div>
                {errors.agreeTerms && <span className="reg-error-msg"><AlertCircle size={12} /> {errors.agreeTerms}</span>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="reg-btn-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="reg-spinner"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Sign In Link */}
              <div className="reg-footer-link">
                Already have an account?{' '}
                <span onClick={(onBackToLogin) => onNavigate('login')} className="reg-link">
                  Sign In
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}