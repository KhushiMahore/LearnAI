import React, { useState } from 'react';

// Pre-defined Sample Activity Datasets (Weekly vs Monthly)
const ACTIVITY_DATASETS = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sessions: [3, 5, 2, 8, 6, 4, 7],
    quizzes: [1, 2, 1, 3, 2, 1, 3],
    flashcards: [15, 25, 10, 40, 30, 20, 35],
    maxVal: 40
  },
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    sessions: [18, 24, 20, 28],
    quizzes: [8, 12, 10, 15],
    flashcards: [110, 145, 120, 180],
    maxVal: 180
  }
};

// Subject Learning Progress Sample Data
const INITIAL_SUBJECTS = [
  { id: 'os', name: 'Operating Systems', completedTopics: 8, totalTopics: 10, difficulty: 'Strong', badgeColor: '#10B981' },
  { id: 'dbms', name: 'Database Management Systems', completedTopics: 5, totalTopics: 10, difficulty: 'Needs Focus', badgeColor: '#F59E0B' },
  { id: 'cn', name: 'Computer Networks', completedTopics: 6, totalTopics: 8, difficulty: 'In Progress', badgeColor: '#3B82F6' },
  { id: 'dl', name: 'Digital Logic', completedTopics: 7, totalTopics: 7, difficulty: 'Mastered', badgeColor: '#6847E8' },
  { id: 'aiml', name: 'AI & Machine Learning', completedTopics: 4, totalTopics: 9, difficulty: 'In Progress', badgeColor: '#3B82F6' }
];

// Document Activity Sample Data
const INITIAL_DOCUMENTS = [
  { id: 'doc-1', name: 'Operating_Systems_Process_Control.pdf', uploadDate: 'Oct 10, 2026', summaryCreated: true, questionsAsked: 14, quizCreated: true, flashcardsCreated: true },
  { id: 'doc-2', name: 'DBMS_Unit_2_Normalization.pdf', uploadDate: 'Oct 08, 2026', summaryCreated: true, questionsAsked: 8, quizCreated: true, flashcardsCreated: false },
  { id: 'doc-3', name: 'Computer_Networks_TCP_IP.pdf', uploadDate: 'Oct 05, 2026', summaryCreated: true, questionsAsked: 19, quizCreated: false, flashcardsCreated: true },
  { id: 'doc-4', name: 'Digital_Logic_K_Maps.pdf', uploadDate: 'Sep 28, 2026', summaryCreated: false, questionsAsked: 3, quizCreated: true, flashcardsCreated: false }
];

// Recent Timeline Activity Sample Data
const INITIAL_TIMELINE = [
  { id: 'act-1', title: 'Completed DBMS Quiz', type: 'Quiz', detail: 'Scored 90% in Normalization test', timestamp: '2 hours ago', icon: '🎯' },
  { id: 'act-2', title: 'Reviewed OS Flashcards', type: 'Flashcards', detail: 'Marked 12 cards as "Known"', timestamp: '5 hours ago', icon: '⚡' },
  { id: 'act-3', title: 'Generated AI Summary', type: 'Summary', detail: 'Operating_Systems_Process_Control.pdf', timestamp: 'Yesterday', icon: '📝' },
  { id: 'act-4', title: 'Asked AI Assistant Question', type: 'Chat', detail: 'Clarified TCP 3-way handshake mechanism', timestamp: '2 days ago', icon: '💬' },
  { id: 'act-5', title: 'Uploaded Study PDF', type: 'Upload', detail: 'Computer_Networks_TCP_IP.pdf', timestamp: '3 days ago', icon: '📄' }
];

export default function Progress({ onOpenDashboard, onOpenDocuments, onOpenUploadPDF }) {
  // Local Demo State
  const [timeRange, setTimeRange] = useState('week'); // 'week' | 'month'
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [actionNotification, setActionNotification] = useState('');

  // Safe Navigation Callbacks
  const handleNavDashboard = () => onOpenDashboard && onOpenDashboard();
  const handleNavDocuments = () => onOpenDocuments && onOpenDocuments();
  const handleNavUploadPDF = () => onOpenUploadPDF && onOpenUploadPDF();

  // Show Toast Message
  const triggerNotification = (msg) => {
    setActionNotification(msg);
    setTimeout(() => setActionNotification(''), 3500);
  };

  // Demo Action: Continue Learning Increment
  const handleContinueLearning = (subjectId) => {
    setSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id === subjectId) {
          const newTopics = Math.min(subj.totalTopics, subj.completedTopics + 1);
          const isFinished = newTopics === subj.totalTopics;
          const updatedDifficulty = isFinished ? 'Mastered' : newTopics > 6 ? 'Strong' : 'In Progress';
          const updatedColor = isFinished ? '#6847E8' : newTopics > 6 ? '#10B981' : '#3B82F6';

          triggerNotification(`Advanced 1 topic in ${subj.name}! (${newTopics}/${subj.totalTopics} completed)`);

          return {
            ...subj,
            completedTopics: newTopics,
            difficulty: updatedDifficulty,
            badgeColor: updatedColor
          };
        }
        return subj;
      })
    );

    // Append entry to activity timeline
    const targetSubj = subjects.find((s) => s.id === subjectId);
    if (targetSubj) {
      const newEntry = {
        id: `act-${Date.now()}`,
        title: `Studied ${targetSubj.name}`,
        type: 'Session',
        detail: `Completed topic in ${targetSubj.name}`,
        timestamp: 'Just now',
        icon: '📖'
      };
      setTimeline([newEntry, ...timeline]);
    }
  };

  const activeDataset = ACTIVITY_DATASETS[timeRange];

  // Calculated Aggregate Stats
  const totalUploadedDocs = INITIAL_DOCUMENTS.length;
  const totalSummaries = INITIAL_DOCUMENTS.filter((d) => d.summaryCreated).length;
  const totalQuizzesAttempted = 14;
  const avgQuizScore = 86;
  const totalFlashcardsReviewed = 185;
  const totalStudySessions = activeDataset.sessions.reduce((a, b) => a + b, 0);

  // Subject Lowest Topic Progress for Dynamic Recommendation
  const lowestSubj = [...subjects].sort(
    (a, b) => a.completedTopics / a.totalTopics - b.completedTopics / b.totalTopics
  )[0];

  return (
    <div className="progress-root">
      {/* Scoped CSS Styles inside a single <style> tag */}
      <style>{`
        .progress-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #F8F9FD;
          color: #20243A;
          min-height: 100vh;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        .progress-container {
          max-width: 1240px;
          margin: 0 auto;
        }

        /* Top Header Navigation */
        .progress-header {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(32, 36, 58, 0.03);
        }

        .progress-header-brand {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .progress-logo {
          width: 2.5rem;
          height: 2.5rem;
          background: #6847E8;
          color: #FFFFFF;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
          box-shadow: 0 4px 10px rgba(104, 71, 232, 0.25);
        }

        .progress-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #20243A;
          margin: 0 0 0.15rem 0;
        }

        .progress-subtitle {
          font-size: 0.85rem;
          color: #77758A;
          margin: 0;
        }

        .progress-header-actions {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .progress-avatar {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          background: #EDE8FF;
          color: #6847E8;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(104, 71, 232, 0.2);
          margin-left: 0.5rem;
        }

        /* Buttons */
        .progress-btn {
          padding: 0.6rem 1.1rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .progress-btn-primary {
          background: #6847E8;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.2);
        }

        .progress-btn-primary:hover {
          background: #5736D7;
          transform: translateY(-1px);
        }

        .progress-btn-secondary {
          background: #F8F9FD;
          color: #20243A;
          border: 1px solid #E7E5EF;
        }

        .progress-btn-secondary:hover {
          background: #EDE8FF;
          color: #6847E8;
          border-color: #EDE8FF;
        }

        .progress-btn-outline {
          background: #FFFFFF;
          color: #20243A;
          border: 1px solid #E7E5EF;
        }

        .progress-btn-outline:hover {
          border-color: #6847E8;
          color: #6847E8;
        }

        /* Generic Card Styles */
        .progress-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.02);
          margin-bottom: 1.5rem;
        }

        .progress-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Overview Stat Grid */
        .progress-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .progress-stat-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease;
        }

        .progress-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(104, 71, 232, 0.08);
          border-color: rgba(104, 71, 232, 0.3);
        }

        .progress-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .progress-stat-icon {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .progress-stat-val {
          font-size: 1.5rem;
          font-weight: 800;
          color: #20243A;
          margin: 0;
        }

        .progress-stat-lbl {
          font-size: 0.775rem;
          color: #77758A;
          margin: 0.2rem 0 0 0;
        }

        .progress-trend {
          font-size: 0.7rem;
          font-weight: 700;
          color: #10B981;
          background: #ECFDF5;
          padding: 0.15rem 0.4rem;
          border-radius: 0.35rem;
        }

        /* Layout Columns */
        .progress-two-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 992px) {
          .progress-two-cols {
            grid-template-columns: 1.6fr 1fr;
          }
        }

        /* Activity Chart Component */
        .progress-chart-controls {
          display: flex;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.5rem;
          padding: 0.15rem;
        }

        .progress-chart-tab {
          padding: 0.3rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: #77758A;
          border-radius: 0.35rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .progress-chart-tab.active {
          background: #FFFFFF;
          color: #6847E8;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .progress-chart-svg-wrap {
          width: 100%;
          height: 230px;
          margin-top: 1rem;
        }

        .progress-chart-legend {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 1rem;
          justify-content: center;
        }

        .progress-legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #77758A;
          font-weight: 500;
        }

        .progress-legend-dot {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
        }

        /* Horizontal Progress Bars */
        .progress-subj-item {
          margin-bottom: 1rem;
        }

        .progress-subj-item:last-child {
          margin-bottom: 0;
        }

        .progress-subj-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
        }

        .progress-subj-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #20243A;
        }

        .progress-subj-meta {
          font-size: 0.75rem;
          color: #77758A;
        }

        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background: #E7E5EF;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.4s ease;
        }

        .progress-pill-badge {
          font-size: 0.675rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 0.35rem;
          color: #FFFFFF;
        }

        /* Document Table */
        .progress-table-wrap {
          overflow-x: auto;
        }

        .progress-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.825rem;
          text-align: left;
        }

        .progress-table th {
          background: #F8F9FD;
          color: #77758A;
          font-weight: 600;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #E7E5EF;
        }

        .progress-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #E7E5EF;
          color: #20243A;
        }

        .progress-table tr:last-child td {
          border-bottom: none;
        }

        .progress-status-check {
          color: #10B981;
          font-weight: 700;
        }

        .progress-status-dash {
          color: #9CA3AF;
        }

        /* Recommendations List */
        .progress-recs-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .progress-rec-card {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-left: 4px solid #6847E8;
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .progress-rec-text {
          font-size: 0.825rem;
          color: #20243A;
          line-height: 1.4;
          margin: 0;
        }

        /* Timeline Items */
        .progress-timeline {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .progress-tl-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding-bottom: 0.875rem;
          border-bottom: 1px solid #E7E5EF;
        }

        .progress-tl-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .progress-tl-icon-box {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: #EDE8FF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          shrink: 0;
        }

        .progress-tl-title {
          font-size: 0.825rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.15rem 0;
        }

        .progress-tl-detail {
          font-size: 0.75rem;
          color: #77758A;
          margin: 0;
        }

        .progress-tl-time {
          font-size: 0.7rem;
          color: #9CA3AF;
          margin-left: auto;
          shrink: 0;
        }

        /* Toast Popup Notification */
        .progress-toast {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          background: #20243A;
          color: #FFFFFF;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.825rem;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
          z-index: 100;
          animation: progressSlideUp 0.3s ease-out;
        }

        @keyframes progressSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Floating Toast Notification */}
      {actionNotification && (
        <div className="progress-toast">
          ✨ {actionNotification}
        </div>
      )}

      <div className="progress-container">
        {/* Header Navigation Bar */}
        <header className="progress-header">
          <div className="progress-header-brand">
            <div className="progress-logo">L</div>
            <div>
              <h1 className="progress-title">My Learning Progress</h1>
              <p className="progress-subtitle">Track your learning, celebrate your growth.</p>
            </div>
          </div>

          <div className="progress-header-actions">
            <button type="button" className="progress-btn progress-btn-secondary" onClick={handleNavDashboard}>
              📌 Dashboard
            </button>
            <button type="button" className="progress-btn progress-btn-secondary" onClick={handleNavDocuments}>
              📁 My Documents
            </button>
            <button type="button" className="progress-btn progress-btn-primary" onClick={handleNavUploadPDF}>
              ⬆️ Upload PDF
            </button>
            <div className="progress-avatar" title="Student Account">
              A
            </div>
          </div>
        </header>

        {/* Section 1: Overview Analytics Cards */}
        <section className="progress-stats-grid">
          <div className="progress-stat-card">
            <div className="progress-stat-top">
              <div className="progress-stat-icon" style={{ background: '#EDE8FF', color: '#6847E8' }}>📄</div>
              <span className="progress-trend">+2 this week</span>
            </div>
            <p className="progress-stat-val">{totalUploadedDocs}</p>
            <p className="progress-stat-lbl">Documents Uploaded</p>
          </div>

          <div className="progress-stat-card">
            <div className="progress-stat-top">
              <div className="progress-stat-icon" style={{ background: '#E0F2FE', color: '#0284C7' }}>📝</div>
              <span className="progress-trend">100% Extracted</span>
            </div>
            <p className="progress-stat-val">{totalSummaries}</p>
            <p className="progress-stat-lbl">Summaries Created</p>
          </div>

          <div className="progress-stat-card">
            <div className="progress-stat-top">
              <div className="progress-stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>🎯</div>
              <span className="progress-trend">High Accuracy</span>
            </div>
            <p className="progress-stat-val">{totalQuizzesAttempted}</p>
            <p className="progress-stat-lbl">Quizzes Attempted</p>
          </div>

          <div className="progress-stat-card">
            <div className="progress-stat-top">
              <div className="progress-stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>🏆</div>
              <span className="progress-trend">Top 10%</span>
            </div>
            <p className="progress-stat-val">{avgQuizScore}%</p>
            <p className="progress-stat-lbl">Average Quiz Score</p>
          </div>

          <div className="progress-stat-card">
            <div className="progress-stat-top">
              <div className="progress-stat-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>⚡</div>
              <span className="progress-trend">Active Recall</span>
            </div>
            <p className="progress-stat-val">{totalFlashcardsReviewed}</p>
            <p className="progress-stat-lbl">Flashcards Reviewed</p>
          </div>

          <div className="progress-stat-card">
            <div className="progress-stat-top">
              <div className="progress-stat-icon" style={{ background: '#E0E7FF', color: '#4338CA' }}>⏱️</div>
              <span className="progress-trend">{timeRange === 'week' ? '7 Days' : '4 Weeks'}</span>
            </div>
            <p className="progress-stat-val">{totalStudySessions}</p>
            <p className="progress-stat-lbl">Study Sessions</p>
          </div>
        </section>

        {/* Section 2: Two-Column Dashboard Layout (Chart + Subject Progress) */}
        <div className="progress-two-cols">
          {/* Left Column: Learning Activity Chart */}
          <div className="progress-card">
            <div className="progress-card-title">
              <span>📊 Learning Activity Overview</span>
              <div className="progress-chart-controls">
                <button
                  type="button"
                  className={`progress-chart-tab ${timeRange === 'week' ? 'active' : ''}`}
                  onClick={() => setTimeRange('week')}
                >
                  This Week
                </button>
                <button
                  type="button"
                  className={`progress-chart-tab ${timeRange === 'month' ? 'active' : ''}`}
                  onClick={() => setTimeRange('month')}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* SVG Embedded Activity Bar Chart */}
            <div className="progress-chart-svg-wrap">
              <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#E7E5EF" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#E7E5EF" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#E7E5EF" strokeDasharray="3 3" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#E7E5EF" />

                {/* Bars Iteration */}
                {activeDataset.labels.map((label, idx) => {
                  const stepX = 500 / activeDataset.labels.length;
                  const centerX = idx * stepX + stepX / 2;

                  // Heights based on values relative to max
                  const flashVal = activeDataset.flashcards[idx];
                  const sessVal = activeDataset.sessions[idx];

                  const h1 = (flashVal / activeDataset.maxVal) * 130;
                  const h2 = (sessVal / (timeRange === 'week' ? 10 : 35)) * 110;

                  return (
                    <g key={label} onMouseEnter={() => setHoveredBarIndex(idx)} onMouseLeave={() => setHoveredBarIndex(null)}>
                      {/* Flashcards Bar (Purple) */}
                      <rect
                        x={centerX - 14}
                        y={180 - h1}
                        width="12"
                        height={h1}
                        fill={hoveredBarIndex === idx ? '#5736D7' : '#6847E8'}
                        rx="3"
                      />
                      {/* Study Sessions Bar (Teal) */}
                      <rect
                        x={centerX + 2}
                        y={180 - h2}
                        width="12"
                        height={h2}
                        fill={hoveredBarIndex === idx ? '#0D9488' : '#14B8A6'}
                        rx="3"
                      />

                      {/* X Axis Label */}
                      <text x={centerX} y="196" fontSize="10" fill="#77758A" textAnchor="middle">
                        {label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="progress-chart-legend">
              <div className="progress-legend-item">
                <span className="progress-legend-dot" style={{ background: '#6847E8' }}></span> Flashcards Reviewed
              </div>
              <div className="progress-legend-item">
                <span className="progress-legend-dot" style={{ background: '#14B8A6' }}></span> Study Sessions
              </div>
            </div>
          </div>

          {/* Right Column: Subject-Wise Progress */}
          <div className="progress-card">
            <div className="progress-card-title">
              <span>📚 Subject-Wise Progress</span>
            </div>

            <div>
              {subjects.map((subj) => {
                const percent = Math.round((subj.completedTopics / subj.totalTopics) * 100);

                return (
                  <div key={subj.id} className="progress-subj-item">
                    <div className="progress-subj-info">
                      <div>
                        <span className="progress-subj-name">{subj.name}</span>
                        <span className="progress-pill-badge" style={{ background: subj.badgeColor, marginLeft: '0.5rem' }}>
                          {subj.difficulty}
                        </span>
                      </div>
                      <span className="progress-subj-meta">{percent}% ({subj.completedTopics}/{subj.totalTopics} Topics)</span>
                    </div>

                    <div className="progress-bar-bg" style={{ marginBottom: '0.4rem' }}>
                      <div className="progress-bar-fill" style={{ width: `${percent}%`, background: subj.badgeColor }}></div>
                    </div>

                    <button
                      type="button"
                      className="progress-btn progress-btn-outline"
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                      onClick={() => handleContinueLearning(subj.id)}
                    >
                      + Complete Topic
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Performance Summary Cards (Quiz vs Flashcard Breakdown) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Quiz Performance Card */}
          <div className="progress-card" style={{ marginBottom: 0 }}>
            <div className="progress-card-title">
              <span>🎯 Quiz Performance Breakdown</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ background: '#F8F9FD', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #E7E5EF' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>128</span>
                <span style={{ fontSize: '0.7rem', color: '#77758A', display: 'block' }}>Correct Answers</span>
              </div>
              <div style={{ background: '#F8F9FD', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #E7E5EF' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#EF4444' }}>22</span>
                <span style={{ fontSize: '0.7rem', color: '#77758A', display: 'block' }}>Incorrect Answers</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#77758A', margin: 0, lineHeight: '1.4' }}>
              Best Subject: <strong>Digital Logic (100%)</strong> • Needs Revision: <strong>DBMS (75%)</strong>
            </p>
          </div>

          {/* Flashcards Activity Card */}
          <div className="progress-card" style={{ marginBottom: 0 }}>
            <div className="progress-card-title">
              <span>⚡ Flashcard Revision Summary</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ background: '#ECFDF5', padding: '0.75rem 0.25rem', borderRadius: '0.75rem', border: '1px solid #A7F3D0' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>142</span>
                <span style={{ fontSize: '0.7rem', color: '#047857', display: 'block' }}>I Know This</span>
              </div>
              <div style={{ background: '#FEF3C7', padding: '0.75rem 0.25rem', borderRadius: '0.75rem', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706' }}>43</span>
                <span style={{ fontSize: '0.7rem', color: '#B45309', display: 'block' }}>Review Again</span>
              </div>
              <div style={{ background: '#EDE8FF', padding: '0.75rem 0.25rem', borderRadius: '0.75rem', border: '1px solid #DDD6FE' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6847E8' }}>77%</span>
                <span style={{ fontSize: '0.7rem', color: '#5B21B6', display: 'block' }}>Mastery Rate</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#77758A', margin: 0, lineHeight: '1.4' }}>
              Tip: Re-attempting cards marked "Review Again" within 24 hours increases retention by 60%.
            </p>
          </div>
        </div>

        {/* Section 4: Document Learning Activity */}
        <div className="progress-card">
          <div className="progress-card-title">
            <span>📁 Document Learning Activity</span>
          </div>

          <div className="progress-table-wrap">
            <table className="progress-table">
              <thead>
                <tr>
                  <th>PDF Document Name</th>
                  <th>Upload Date</th>
                  <th>AI Summary</th>
                  <th>Questions Asked</th>
                  <th>Quiz Created</th>
                  <th>Flashcards Created</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_DOCUMENTS.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 700 }}>{doc.name}</td>
                    <td style={{ color: '#77758A' }}>{doc.uploadDate}</td>
                    <td>{doc.summaryCreated ? <span className="progress-status-check">✓ Yes</span> : <span className="progress-status-dash">—</span>}</td>
                    <td style={{ fontWeight: 600 }}>{doc.questionsAsked} queries</td>
                    <td>{doc.quizCreated ? <span className="progress-status-check">✓ Yes</span> : <span className="progress-status-dash">—</span>}</td>
                    <td>{doc.flashcardsCreated ? <span className="progress-status-check">✓ Yes</span> : <span className="progress-status-dash">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Recommendations & Recent Activity */}
        <div className="progress-two-cols">
          {/* Recommendations */}
          <div className="progress-card">
            <div className="progress-card-title">
              <span>💡 Recommended Next Steps</span>
            </div>

            <div className="progress-recs-list">
              <div className="progress-rec-card" style={{ borderLeftColor: '#F59E0B' }}>
                <p className="progress-rec-text">
                  Revise <strong>{lowestSubj.name}</strong> normalization and key dependencies ({lowestSubj.completedTopics}/{lowestSubj.totalTopics} completed).
                </p>
                <button
                  type="button"
                  className="progress-btn progress-btn-outline"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => handleContinueLearning(lowestSubj.id)}
                >
                  Study
                </button>
              </div>

              <div className="progress-rec-card" style={{ borderLeftColor: '#6847E8' }}>
                <p className="progress-rec-text">
                  You have <strong>43 Flashcards</strong> marked "Review Again". Run a quick 5-minute refresher session.
                </p>
                <button
                  type="button"
                  className="progress-btn progress-btn-primary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => triggerNotification('Opening Flashcards review deck...')}
                >
                  Review
                </button>
              </div>

              <div className="progress-rec-card" style={{ borderLeftColor: '#10B981' }}>
                <p className="progress-rec-text">
                  Your quiz score in <strong>Digital Logic</strong> is high (100%). Try an <strong>AI/ML Hard Quiz</strong> next.
                </p>
                <button
                  type="button"
                  className="progress-btn progress-btn-outline"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => triggerNotification('Opening Quiz Generator...')}
                >
                  Take Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="progress-card">
            <div className="progress-card-title">
              <span>🕒 Recent Activity Timeline</span>
            </div>

            <div className="progress-timeline">
              {timeline.map((act) => (
                <div key={act.id} className="progress-tl-item">
                  <div className="progress-tl-icon-box">{act.icon}</div>
                  <div>
                    <p className="progress-tl-title">{act.title}</p>
                    <p className="progress-tl-detail">{act.detail}</p>
                  </div>
                  <span className="progress-tl-time">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}