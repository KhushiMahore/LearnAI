import React, { useState, useRef } from 'react';
import { 
  BookOpen, FileText, Upload, Sparkles, MessageSquare, 
  HelpCircle, Layers, TrendingUp, History, Globe, 
  Check, X, File, AlertCircle, ArrowRight, Info, CheckCircle2,
  Trash2, RefreshCw, Award, Sliders
} from 'lucide-react';

export default function UploadPDF({ 
  onNavigate, 
  onOpenDashboard, 
  onOpenDocuments, 
  onOpenUploadPDF 
}) {
  // Navigation helper to support both unified onNavigate('page') and direct page callbacks
  const handleNavigate = (page) => {
    if (page === 'dashboard' && onOpenDashboard) return onOpenDashboard();
    if (page === 'documents' && onOpenDocuments) return onOpenDocuments();
    if (page === 'upload' && onOpenUploadPDF) return onOpenUploadPDF();
    if (onNavigate) return onNavigate(page);
  };

  // Drag & Drop / File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const fileInputRef = useRef(null);

  // PDF Processing Feature Options
  const [features, setFeatures] = useState({
    summarize: true,
    askAi: true,
    quiz: false,
    flashcards: false,
  });

  // Quiz Preferences
  const [quizSettings, setQuizSettings] = useState({
    difficulty: 'Medium',
    numQuestions: '10',
    questionType: 'Multiple Choice',
  });

  // Learning Preferences
  const [learningPreferences, setLearningPreferences] = useState({
    language: 'English',
    goal: 'Concept Understanding',
  });

  // Action Submission State
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(false);

  // File Validation Rules
  const MAX_FILE_SIZE_MB = 20;
  const ALLOWED_TYPE = 'application/pdf';

  const validateAndProcessFile = (file) => {
    setFileError(null);
    setActionError(null);
    setActionSuccess(false);

    if (!file) return;

    if (file.type !== ALLOWED_TYPE && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Invalid file format. Please upload a standard PDF file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File size exceeds the ${MAX_FILE_SIZE_MB} MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB selected).`);
      return;
    }

    // Local file accepted -> Simulate local processing load
    setSelectedFile(file);
    setIsSimulatingUpload(true);
    setUploadProgress(0);
    setIsUploadComplete(false);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setUploadProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsSimulatingUpload(false);
        setIsUploadComplete(true);
      }
    }, 150);
  };

  // Native File Input Change
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    validateAndProcessFile(file);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
    setIsUploadComplete(false);
    setUploadProgress(0);
    setActionError(null);
    setActionSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleFeature = (key) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
    if (actionError) setActionError(null);
  };

  const handleStartLearning = () => {
    if (!selectedFile) {
      setActionError('Please select or drag a PDF file first.');
      return;
    }

    if (!isUploadComplete) {
      setActionError('Please wait for the PDF to finish loading.');
      return;
    }

    const selectedOptionsCount = Object.values(features).filter(Boolean).length;
    if (selectedOptionsCount === 0) {
      setActionError('Please select at least one study feature (e.g. Summarize or Quiz).');
      return;
    }

    setActionError(null);
    setActionSuccess(true);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="up-layout">
      {/* Self-contained styling */}
      <style>{`
        .up-layout {
          min-height: 100vh;
          background-color: #F8F9FD;
          color: #20243A;
          display: block;
          font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Sidebar Styling */
        .up-sidebar {
          width: 260px;
          background: #FFFFFF;
          border-right: 1px solid #E7E5EF;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          shrink: 0;
        }

        .up-brand {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .up-logo {
          width: 2.25rem;
          height: 2.25rem;
          background: #6847E8;
          color: #FFFFFF;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.125rem;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.2);
        }

        .up-brand-title {
          font-weight: 700;
          font-size: 1.125rem;
          color: #20243A;
        }

        .up-nav {
          padding: 0.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .up-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          background: transparent;
          color: #77758A;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .up-nav-btn:hover {
          background: #F8F9FD;
          color: #20243A;
        }

        .up-nav-btn.active {
          background: #EDE8FF;
          color: #6847E8;
          font-weight: 600;
        }

        .up-user-footer {
          padding: 1rem;
          border-top: 1px solid #E7E5EF;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .up-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: #EDE8FF;
          color: #6847E8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          border: 1px solid rgba(104, 71, 232, 0.2);
        }

        /* Main Workspace */
        .up-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-y: auto;
        }

        .up-topbar {
          background: #FFFFFF;
          border-bottom: 1px solid #E7E5EF;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .up-breadcrumb {
          font-size: 0.75rem;
          color: #77758A;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .up-breadcrumb-active {
          color: #6847E8;
          font-weight: 600;
        }

        .up-content {
          padding: 2rem;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .up-header-section {
          margin-bottom: 2rem;
        }

        .up-page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.35rem 0;
        }

        .up-page-subtitle {
          font-size: 0.875rem;
          color: #77758A;
          margin: 0;
        }

        /* Responsive Two Column Layout */
        .up-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .up-grid {
            grid-template-columns: 1.6fr 1fr;
          }
        }

        /* Card Container */
        .up-card {
          background: #FFFFFF;
          border-radius: 1.25rem;
          border: 1px solid #E7E5EF;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(32, 36, 58, 0.02);
          margin-bottom: 1.5rem;
        }

        .up-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Drag & Drop Zone */
        .up-dropzone {
          border: 2px dashed #E7E5EF;
          border-radius: 1rem;
          padding: 2.5rem 1.5rem;
          text-align: center;
          background: #F8F9FD;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          position: relative;
        }

        .up-dropzone:hover, .up-dropzone.dragging {
          border-color: #6847E8;
          background: #EDE8FF;
        }

        .up-upload-icon-circle {
          width: 4rem;
          height: 4rem;
          background: #EDE8FF;
          color: #6847E8;
          border-radius: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }

        .up-drop-title {
          font-size: 1rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.25rem 0;
        }

        .up-drop-desc {
          font-size: 0.825rem;
          color: #77758A;
          margin: 0 0 1.25rem 0;
        }

        .up-browse-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #6847E8;
          color: #FFFFFF;
          padding: 0.625rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.2);
        }

        .up-browse-btn:hover {
          background: #5736d7;
        }

        .up-file-info-tag {
          margin-top: 1rem;
          font-size: 0.75rem;
          color: #77758A;
        }

        /* File Preview Box */
        .up-file-preview {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .up-file-details {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          min-width: 0;
        }

        .up-pdf-badge {
          width: 2.75rem;
          height: 2.75rem;
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          shrink: 0;
        }

        .up-file-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.15rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .up-file-size {
          font-size: 0.75rem;
          color: #77758A;
          margin: 0;
        }

        .up-progress-bar-bg {
          width: 100%;
          height: 6px;
          background: #E7E5EF;
          border-radius: 3px;
          margin-top: 0.5rem;
          overflow: hidden;
        }

        .up-progress-bar-fill {
          height: 100%;
          background: #6847E8;
          transition: width 0.2s ease;
        }

        .up-btn-icon-danger {
          background: transparent;
          border: none;
          color: #77758A;
          padding: 0.35rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .up-btn-icon-danger:hover {
          background: #fef2f2;
          color: #ef4444;
        }

        /* Processing Feature Cards */
        .up-features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.875rem;
        }

        @media (min-width: 640px) {
          .up-features-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .up-feature-card {
          border: 1px solid #E7E5EF;
          background: #F8F9FD;
          border-radius: 1rem;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          user-select: none;
        }

        .up-feature-card:hover {
          border-color: #6847E8;
          background: #FFFFFF;
        }

        .up-feature-card.selected {
          border-color: #6847E8;
          background: #EDE8FF;
        }

        .up-feature-icon {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          background: #FFFFFF;
          color: #6847E8;
          display: flex;
          align-items: center;
          justify-content: center;
          shrink: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }

        .up-feature-card.selected .up-feature-icon {
          background: #6847E8;
          color: #FFFFFF;
        }

        .up-feature-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.15rem 0;
        }

        .up-feature-desc {
          font-size: 0.75rem;
          color: #77758A;
          margin: 0;
          line-height: 1.35;
        }

        .up-checkbox-dot {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 0.35rem;
          border: 1px solid #E7E5EF;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          shrink: 0;
        }

        .up-feature-card.selected .up-checkbox-dot {
          background: #6847E8;
          border-color: #6847E8;
          color: #FFFFFF;
        }

        /* Quiz Preferences Form */
        .up-quiz-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #E7E5EF;
        }

        @media (min-width: 640px) {
          .up-quiz-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .up-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .up-label {
          font-size: 0.775rem;
          font-weight: 600;
          color: #20243A;
        }

        .up-select {
          padding: 0.6rem 0.75rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          font-size: 0.825rem;
          color: #20243A;
          outline: none;
          cursor: pointer;
          font-weight: 500;
        }

        .up-select:focus {
          border-color: #6847E8;
          background: #FFFFFF;
        }

        /* Submit Action Button */
        .up-submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: #6847E8;
          color: #FFFFFF;
          border: none;
          border-radius: 0.875rem;
          font-size: 0.925rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(104, 71, 232, 0.25);
          margin-top: 1rem;
        }

        .up-submit-btn:hover {
          background: #5736d7;
          transform: translateY(-1px);
        }

        /* Alerts & Banners */
        .up-alert-danger {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fee2e2;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.825rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .up-alert-success {
          background: #EDE8FF;
          color: #6847E8;
          border: 1px solid rgba(104, 71, 232, 0.2);
          padding: 1.25rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-top: 1rem;
        }

        /* Right Panel Tips & Sample History */
        .up-tip-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #E7E5EF;
        }

        .up-tip-item:last-child {
          border-bottom: none;
        }

        .up-tip-bullet {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: #EDE8FF;
          color: #6847E8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          shrink: 0;
        }

        .up-tip-text {
          font-size: 0.825rem;
          color: #77758A;
          line-height: 1.4;
          margin: 0;
        }

        .up-sample-doc-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0.75rem;
          background: #F8F9FD;
          border-radius: 0.75rem;
          margin-bottom: 0.5rem;
          border: 1px solid #E7E5EF;
        }

        .up-sample-doc-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #20243A;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .up-demo-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          background: #EDE8FF;
          color: #6847E8;
          padding: 0.15rem 0.5rem;
          border-radius: 0.35rem;
          margin-bottom: 0.75rem;
        }
      `}</style>

      {/* Shared Sidebar */}
   

      {/* Main Content Area */}
      <div className="up-main">
        {/* Top Header Bar */}
        <header className="up-topbar">
          <div className="up-breadcrumb">
            <span 
              style={{ cursor: 'pointer' }} 
              onClick={() => handleNavigate('dashboard')}
            >
              Dashboard
            </span> 
            / <span className="up-breadcrumb-active">Upload PDF</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={16} color="#6847E8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{learningPreferences.language}</span>
          </div>
        </header>

        {/* Page Container */}
        <div className="up-content">
          <div className="up-header-section">
            <h1 className="up-page-title">Upload Your PDF</h1>
            <p className="up-page-subtitle">Turn your study materials into a personalized learning experience.</p>
          </div>

          <div className="up-grid">
            {/* Left Main Column */}
            <div>
              {/* Section 1: Drag and Drop Upload Card */}
              <div className="up-card">
                <h2 className="up-card-title"><Upload size={18} color="#6847E8" /> 1. Select Study Material</h2>

                {/* Hidden Native File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="application/pdf" 
                  onChange={handleFileSelect} 
                  style={{ display: 'none' }} 
                />

                {!selectedFile ? (
                  <div 
                    className={`up-dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <div className="up-upload-icon-circle">
                      <Upload size={28} />
                    </div>
                    <h3 className="up-drop-title">Upload your study material</h3>
                    <p className="up-drop-desc">Drag and drop your PDF here, or browse files from your device.</p>
                    <button type="button" className="up-browse-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
                      Choose PDF
                    </button>
                    <div className="up-file-info-tag">Supported format: PDF • Maximum file size: {MAX_FILE_SIZE_MB} MB</div>
                  </div>
                ) : (
                  <div className="up-file-preview">
                    <div className="up-file-details">
                      <div className="up-pdf-badge"><FileText size={22} /></div>
                      <div style={{ minWidth: 0 }}>
                        <p className="up-file-name" title={selectedFile.name}>{selectedFile.name}</p>
                        <p className="up-file-size">
                          {formatFileSize(selectedFile.size)} • {isSimulatingUpload ? 'Loading file...' : 'Ready for processing'}
                        </p>
                        {isSimulatingUpload && (
                          <div className="up-progress-bar-bg">
                            <div className="up-progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleRemoveFile} 
                      className="up-btn-icon-danger"
                      title="Remove PDF"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}

                {fileError && (
                  <div className="up-alert-danger">
                    <AlertCircle size={16} />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>

              {/* Section 2: AI Processing Options */}
              <div className="up-card">
                <h2 className="up-card-title"><Sparkles size={18} color="#6847E8" /> 2. What would you like to do with this PDF?</h2>
                
                <div className="up-features-grid">
                  {/* Option A: Summarize */}
                  <div 
                    className={`up-feature-card ${features.summarize ? 'selected' : ''}`}
                    onClick={() => toggleFeature('summarize')}
                  >
                    <div className="up-feature-icon"><Sparkles size={16} /></div>
                    <div>
                      <h4 className="up-feature-title">Summarize PDF</h4>
                      <p className="up-feature-desc">Generate concise notes and key bullet points.</p>
                    </div>
                    <div className="up-checkbox-dot">{features.summarize && <Check size={12} />}</div>
                  </div>

                  {/* Option B: Ask Questions */}
                  <div 
                    className={`up-feature-card ${features.askAi ? 'selected' : ''}`}
                    onClick={() => toggleFeature('askAi')}
                  >
                    <div className="up-feature-icon"><MessageSquare size={16} /></div>
                    <div>
                      <h4 className="up-feature-title">Ask Questions</h4>
                      <p className="up-feature-desc">Ask direct Q&A from notes.</p>
                    </div>
                    <div className="up-checkbox-dot">{features.askAi && <Check size={12} />}</div>
                  </div>

                  {/* Option C: Generate Quiz */}
                  <div 
                    className={`up-feature-card ${features.quiz ? 'selected' : ''}`}
                    onClick={() => toggleFeature('quiz')}
                  >
                    <div className="up-feature-icon"><HelpCircle size={16} /></div>
                    <div>
                      <h4 className="up-feature-title">Generate Quiz</h4>
                      <p className="up-feature-desc">Create practice quizzes to test knowledge.</p>
                    </div>
                    <div className="up-checkbox-dot">{features.quiz && <Check size={12} />}</div>
                  </div>

                  {/* Option D: Create Flashcards */}
                  <div 
                    className={`up-feature-card ${features.flashcards ? 'selected' : ''}`}
                    onClick={() => toggleFeature('flashcards')}
                  >
                    <div className="up-feature-icon"><Layers size={16} /></div>
                    <div>
                      <h4 className="up-feature-title">Create Flashcards</h4>
                      <p className="up-feature-desc">Build active recall card decks automatically.</p>
                    </div>
                    <div className="up-checkbox-dot">{features.flashcards && <Check size={12} />}</div>
                  </div>
                </div>

                {/* Sub-section: Quiz Settings (Displayed when Generate Quiz is toggled) */}
                {features.quiz && (
                  <div className="up-quiz-grid">
                    <div className="up-form-group">
                      <label className="up-label">Difficulty Level</label>
                      <select 
                        value={quizSettings.difficulty} 
                        onChange={(e) => setQuizSettings({...quizSettings, difficulty: e.target.value})}
                        className="up-select"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="up-form-group">
                      <label className="up-label">Number of Questions</label>
                      <select 
                        value={quizSettings.numQuestions} 
                        onChange={(e) => setQuizSettings({...quizSettings, numQuestions: e.target.value})}
                        className="up-select"
                      >
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                        <option value="15">15 Questions</option>
                      </select>
                    </div>

                    <div className="up-form-group">
                      <label className="up-label">Question Type</label>
                      <select 
                        value={quizSettings.questionType} 
                        onChange={(e) => setQuizSettings({...quizSettings, questionType: e.target.value})}
                        className="up-select"
                      >
                        <option value="Multiple Choice">Multiple Choice</option>
                        <option value="True/False">True / False</option>
                        <option value="Mixed">Mixed Format</option>
                      </select>
                    </div>
                  </div>
                )}

                {actionError && (
                  <div className="up-alert-danger">
                    <AlertCircle size={16} />
                    <span>{actionError}</span>
                  </div>
                )}

                {actionSuccess ? (
                  <div className="up-alert-success">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <CheckCircle2 size={18} /> Processing Request (Prototype)
                    </div>
                    Your PDF <strong>"{selectedFile?.name}"</strong> has been queued locally for processing with options:{' '}
                    {Object.keys(features).filter(k => features[k]).map(k => k.toUpperCase()).join(', ')}. Connect python backend logic here.
                  </div>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleStartLearning} 
                    className="up-submit-btn"
                  >
                    <span>Start Learning</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Side Column: Preferences & Upload Guidelines */}
            <div>
              {/* Card A: Learning Preferences */}
              <div className="up-card">
                <h2 className="up-card-title"><Sliders size={18} color="#6847E8" /> Learning Preferences</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="up-form-group">
                    <label className="up-label">Explanation Language</label>
                    <select 
                      value={learningPreferences.language}
                      onChange={(e) => setLearningPreferences({...learningPreferences, language: e.target.value})}
                      className="up-select"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>

                  <div className="up-form-group">
                    <label className="up-label">Learning Goal</label>
                    <select 
                      value={learningPreferences.goal}
                      onChange={(e) => setLearningPreferences({...learningPreferences, goal: e.target.value})}
                      className="up-select"
                    >
                      <option value="Quick Revision">Quick Revision</option>
                      <option value="Exam Preparation">Exam Preparation</option>
                      <option value="Concept Understanding">Concept Understanding</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card B: Helpful Upload Tips */}
              <div className="up-card">
                <h2 className="up-card-title"><Info size={18} color="#6847E8" /> Helpful Upload Tips</h2>
                <div>
                  <div className="up-tip-item">
                    <div className="up-tip-bullet">1</div>
                    <p className="up-tip-text">Upload selectable, text-based PDFs rather than scanned images for clear summaries.</p>
                  </div>
                  <div className="up-tip-item">
                    <div className="up-tip-bullet">2</div>
                    <p className="up-tip-text">Ensure file size is under 20 MB for smooth processing.</p>
                  </div>
                  <div className="up-tip-item">
                    <div className="up-tip-bullet">3</div>
                    <p className="up-tip-text">Select "Generate Quiz" to automatically test your memory on major textbook concepts.</p>
                  </div>
                </div>
              </div>

              {/* Card C: Sample Demonstration History */}
              <div className="up-card">
                <div className="up-demo-badge">SAMPLE DEMO DATA</div>
                <h2 className="up-card-title" style={{ fontSize: '0.9rem' }}><History size={16} color="#6847E8" /> Sample Recent Documents</h2>
                <div>
                  <div className="up-sample-doc-item">
                    <div>
                      <p className="up-sample-doc-title">Operating Systems Notes.pdf</p>
                      <span style={{ fontSize: '0.7rem', color: '#77758A' }}>4.2 MB • Summarized</span>
                    </div>
                  </div>
                  <div className="up-sample-doc-item">
                    <div>
                      <p className="up-sample-doc-title">DBMS Unit 2.pdf</p>
                      <span style={{ fontSize: '0.7rem', color: '#77758A' }}>2.8 MB • 10 Quiz Questions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}