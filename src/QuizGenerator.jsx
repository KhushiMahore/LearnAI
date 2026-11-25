import React, { useState, useEffect } from 'react';

// Sample fallback database of deterministic demo questions by topic
const DEMO_QUESTION_BANK = {
  default: [
    {
      id: 1,
      type: 'mcq',
      topic: 'General AI Concepts',
      question: 'What is the primary objective of Supervised Machine Learning?',
      options: [
        'To learn mapping functions from input variables to an output variable',
        'To group unstructured data into natural clusters',
        'To maximize cumulative rewards through trial and error',
        'To compress large datasets without losing information'
      ],
      correctAnswer: 0,
      explanation: 'Supervised learning uses labeled dataset to learn a function that maps inputs (X) to desired outputs (Y).',
      hint: 'Think about having known labels during training.'
    },
    {
      id: 2,
      type: 'true_false',
      topic: 'Deep Learning',
      question: 'A Convolutional Neural Network (CNN) is primarily designed for sequential time-series data.',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'CNNs are optimized for spatial data like images. Recurrent Neural Networks (RNNs) and Transformers are built for sequential data.',
      hint: 'Consider what type of architecture is best for image processing vs text/audio.'
    },
    {
      id: 3,
      type: 'multi_select',
      topic: 'Neural Networks',
      question: 'Which of the following are popular activation functions in Deep Learning? (Select all that apply)',
      options: ['ReLU', 'Sigmoid', 'Softmax', 'Linear Regression'],
      correctAnswer: [0, 1, 2],
      explanation: 'ReLU, Sigmoid, and Softmax are activation functions. Linear Regression is a statistical learning algorithm, not an activation function.',
      hint: 'One of the choices is an algorithm, not a node output function.'
    },
    {
      id: 4,
      type: 'mcq',
      topic: 'Model Evaluation',
      question: 'What does an Overfitting model typically display during evaluation?',
      options: [
        'High training error and high testing error',
        'Low training error and high testing error',
        'High training error and low testing error',
        'Low training error and low testing error'
      ],
      correctAnswer: 1,
      explanation: 'Overfitting happens when a model memorizes the training data (low training error) but fails to generalize to new unseen test data (high test error).',
      hint: 'The model performs great on familiar data but poorly on new data.'
    },
    {
      id: 5,
      type: 'true_false',
      topic: 'Natural Language Processing',
      question: 'The Transformer architecture relies on self-attention mechanisms to process sequential tokens in parallel.',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Transformers eliminated the recurrent sequential bottleneck of RNNs by using self-attention to process all tokens in parallel.',
      hint: 'Self-attention allows parallelization across sentence length.'
    }
  ]
};

// Initial Sample Recent Quizzes History
const INITIAL_RECENT_QUIZZES = [
  {
    id: 'rq-101',
    title: 'Operating Systems - Process Scheduling',
    topic: 'Operating Systems',
    difficulty: 'Medium',
    questionsCount: 5,
    scorePercent: 80,
    date: 'Oct 12, 2026',
    isDemo: true
  },
  {
    id: 'rq-102',
    title: 'Database Management - Normalization',
    topic: 'DBMS',
    difficulty: 'Hard',
    questionsCount: 10,
    scorePercent: 90,
    date: 'Oct 10, 2026',
    isDemo: true
  },
  {
    id: 'rq-103',
    title: 'Computer Networks - OSI Model',
    topic: 'Networking',
    difficulty: 'Easy',
    questionsCount: 5,
    scorePercent: 100,
    date: 'Oct 08, 2026',
    isDemo: true
  }
];

export default function QuizGenerator() {
  // Navigation & Source State
  const [sourceType, setSourceType] = useState('topic'); // 'topic' or 'file'
  const [topicText, setTopicText] = useState('');
  const [pastedNotes, setPastedNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  // Quiz Configuration State
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [selectedTypes, setSelectedTypes] = useState(['mcq', 'true_false', 'multi_select']);
  const [language, setLanguage] = useState('English');
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [includeHints, setIncludeHints] = useState(true);
  const [focusCoreConcepts, setFocusCoreConcepts] = useState(true);

  // App Execution Flow States: 'configure' | 'generating' | 'active' | 'results' | 'review'
  const [appState, setAppState] = useState('configure');
  const [configError, setConfigError] = useState('');

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { qId: answerVal }
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // History State
  const [recentQuizzes, setRecentQuizzes] = useState(INITIAL_RECENT_QUIZZES);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // File Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'txt'];
    const fileExt = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      setFileError('Invalid file type. Please upload a PDF or TXT file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError('File size exceeds 15 MB limit. Please select a smaller file.');
      setSelectedFile(null);
      return;
    }

    setFileError('');
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length === 1) return; // Must have at least 1
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Generate Quiz Trigger
  const handleGenerateQuiz = () => {
    setConfigError('');

    // Validation
    if (sourceType === 'topic') {
      if (!topicText.trim() && !pastedNotes.trim()) {
        setConfigError('Please enter a study topic or paste text notes to generate your quiz.');
        return;
      }
    } else if (sourceType === 'file') {
      if (!selectedFile) {
        setConfigError('Please upload a PDF or TXT document before proceeding.');
        return;
      }
    }

    setAppState('generating');

    // Simulate AI generation process / Python Backend API delay
    setTimeout(() => {
      // Deterministically build quiz based on user preferences or fallback bank
      let questionsList = DEMO_QUESTION_BANK.default;

      // Filter by selected question types if necessary
      let filtered = questionsList.filter((q) => selectedTypes.includes(q.type));
      if (filtered.length === 0) filtered = questionsList;

      // Duplicate/Slice to match desired numQuestions count
      let generated = [];
      let counter = 0;
      while (generated.length < numQuestions) {
        const base = filtered[counter % filtered.length];
        generated.push({
          ...base,
          id: `gen_${generated.length + 1}`,
          question: `${base.question}${generated.length >= filtered.length ? ` (Variation ${Math.floor(generated.length / filtered.length) + 1})` : ''}`
        });
        counter++;
      }

      setActiveQuiz(generated);
      setUserAnswers({});
      setCurrentQuestionIdx(0);
      setShowHint(false);
      setTimerSeconds(0);
      setTimerActive(true);
      setAppState('active');
    }, 1800);
  };

  // Option selection in Active Quiz
  const handleOptionSelect = (qId, optionIdx, isMulti = false) => {
    if (isMulti) {
      const current = userAnswers[qId] || [];
      let updated;
      if (current.includes(optionIdx)) {
        updated = current.filter((i) => i !== optionIdx);
      } else {
        updated = [...current, optionIdx];
      }
      setUserAnswers({ ...userAnswers, [qId]: updated });
    } else {
      setUserAnswers({ ...userAnswers, [qId]: optionIdx });
    }
  };

  const handleClearAnswer = (qId) => {
    const updated = { ...userAnswers };
    delete updated[qId];
    setUserAnswers(updated);
  };

  const handleFinishQuiz = () => {
    setTimerActive(false);
    setAppState('results');

    // Save to demo history
    const scoreInfo = calculateScore();
    const newHistoryItem = {
      id: `rq-${Date.now()}`,
      title: sourceType === 'file' ? (selectedFile ? selectedFile.name : 'Uploaded File') : (topicText.trim() || 'Custom Notes Quiz'),
      topic: topicText.trim() || 'General Study',
      difficulty: difficulty,
      questionsCount: activeQuiz.length,
      scorePercent: scoreInfo.percentage,
      date: 'Just now',
      isDemo: true
    };
    setRecentQuizzes([newHistoryItem, ...recentQuizzes.slice(0, 4)]);
  };

  // Scoring Calculation Logic
  const calculateScore = () => {
    let correctCount = 0;
    let unansweredCount = 0;

    activeQuiz.forEach((q) => {
      const ans = userAnswers[q.id];

      if (ans === undefined || ans === null || (Array.isArray(ans) && ans.length === 0)) {
        unansweredCount++;
        return;
      }

      if (q.type === 'multi_select') {
        const sortedUser = [...ans].sort();
        const sortedCorrect = [...q.correctAnswer].sort();
        if (JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect)) {
          correctCount++;
        }
      } else {
        if (ans === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    const total = activeQuiz.length;
    const incorrectCount = total - correctCount - unansweredCount;
    const percentage = Math.round((correctCount / total) * 100);

    return {
      total,
      correctCount,
      incorrectCount,
      unansweredCount,
      percentage
    };
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const scoreInfo = calculateScore();

  return (
    <div className="qg-root">
      <style>{`
        .qg-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #F8F9FD;
          color: #20243A;
          min-height: 100vh;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        .qg-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Header Styling */
        .qg-header {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(32, 36, 58, 0.03);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .qg-header-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #20243A;
          margin: 0 0 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .qg-header-subtitle {
          font-size: 0.875rem;
          color: #77758A;
          margin: 0;
        }

        .qg-badge-ai {
          background: #EDE8FF;
          color: #6847E8;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 2rem;
          border: 1px solid rgba(104, 71, 232, 0.2);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        /* Card Container */
        .qg-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.02);
        }

        .qg-card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Options & Segmented Control */
        .qg-segmented-tabs {
          display: flex;
          background: #F8F9FD;
          padding: 0.25rem;
          border-radius: 0.75rem;
          border: 1px solid #E7E5EF;
          margin-bottom: 1.25rem;
        }

        .qg-tab-btn {
          flex: 1;
          padding: 0.65rem 1rem;
          border: none;
          background: transparent;
          font-size: 0.875rem;
          font-weight: 600;
          color: #77758A;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .qg-tab-btn.active {
          background: #FFFFFF;
          color: #6847E8;
          box-shadow: 0 2px 6px rgba(104, 71, 232, 0.12);
        }

        /* Drag & Drop Upload Zone */
        .qg-dropzone {
          border: 2px dashed #E7E5EF;
          border-radius: 0.875rem;
          padding: 2rem;
          text-align: center;
          background: #F8F9FD;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .qg-dropzone:hover {
          border-color: #6847E8;
          background: #EDE8FF;
        }

        .qg-dropzone-icon {
          width: 48px;
          height: 48px;
          background: #EDE8FF;
          color: #6847E8;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem auto;
          font-size: 1.25rem;
        }

        .qg-file-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #EDE8FF;
          border: 1px solid rgba(104, 71, 232, 0.3);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          margin-top: 0.75rem;
        }

        /* Form Controls */
        .qg-input-text, .qg-textarea, .qg-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #20243A;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .qg-input-text:focus, .qg-textarea:focus, .qg-select:focus {
          border-color: #6847E8;
          background: #FFFFFF;
        }

        .qg-grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .qg-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 0.75rem;
        }

        .qg-choice-chip {
          padding: 0.65rem 0.5rem;
          border: 1px solid #E7E5EF;
          background: #F8F9FD;
          border-radius: 0.75rem;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: #77758A;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .qg-choice-chip:hover {
          border-color: #6847E8;
          color: #6847E8;
        }

        .qg-choice-chip.selected {
          background: #6847E8;
          color: #FFFFFF;
          border-color: #6847E8;
          box-shadow: 0 3px 8px rgba(104, 71, 232, 0.25);
        }

        .qg-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: #20243A;
          cursor: pointer;
        }

        .qg-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #6847E8;
          cursor: pointer;
        }

        /* Buttons */
        .qg-btn-primary {
          background: linear-gradient(135deg, #6847E8 0%, #512BD4 100%);
          color: #FFFFFF;
          border: none;
          padding: 0.875rem 1.75rem;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(104, 71, 232, 0.3);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }

        .qg-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(104, 71, 232, 0.4);
        }

        .qg-btn-secondary {
          background: #EDE8FF;
          color: #6847E8;
          border: 1px solid rgba(104, 71, 232, 0.2);
          padding: 0.65rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .qg-btn-secondary:hover {
          background: #6847E8;
          color: #FFFFFF;
        }

        .qg-btn-outline {
          background: #FFFFFF;
          color: #77758A;
          border: 1px solid #E7E5EF;
          padding: 0.65rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .qg-btn-outline:hover {
          border-color: #6847E8;
          color: #6847E8;
        }

        /* Alert Banners */
        .qg-alert-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fee2e2;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .qg-notice-demo {
          background: #EDE8FF;
          color: #6847E8;
          border: 1px dashed #6847E8;
          padding: 0.65rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.8rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Active Quiz Screen */
        .qg-quiz-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E7E5EF;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .qg-progress-bar-bg {
          width: 100%;
          height: 8px;
          background: #E7E5EF;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .qg-progress-bar-fill {
          height: 100%;
          background: #6847E8;
          transition: width 0.3s ease;
        }

        .qg-option-card {
          border: 1px solid #E7E5EF;
          background: #F8F9FD;
          padding: 1rem 1.25rem;
          border-radius: 0.875rem;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.925rem;
          color: #20243A;
        }

        .qg-option-card:hover {
          border-color: #6847E8;
          background: #FFFFFF;
        }

        .qg-option-card.selected {
          border-color: #6847E8;
          background: #EDE8FF;
          color: #6847E8;
          font-weight: 600;
        }

        .qg-option-card.review-correct {
          border-color: #10B981;
          background: #ecfdf5;
          color: #065f46;
          font-weight: 600;
        }

        .qg-option-card.review-incorrect {
          border-color: #EF4444;
          background: #fef2f2;
          color: #991b1b;
          font-weight: 600;
        }

        .qg-indicator-box {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #E7E5EF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          shrink: 0;
        }

        .selected .qg-indicator-box {
          border-color: #6847E8;
          background: #6847E8;
          color: #FFFFFF;
        }

        /* Results Screen Stats */
        .qg-score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6847E8 0%, #512BD4 100%);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
          box-shadow: 0 6px 18px rgba(104, 71, 232, 0.3);
        }

        .qg-score-num {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }

        .qg-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1rem;
          text-align: center;
          margin: 1.5rem 0;
        }

        .qg-stat-box {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .qg-stat-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: #20243A;
        }

        .qg-stat-lbl {
          font-size: 0.75rem;
          color: #77758A;
          margin-top: 0.25rem;
        }

        /* Recent Quizzes List */
        .qg-recent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .qg-recent-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 0.875rem;
          padding: 1rem;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .qg-recent-card:hover {
          border-color: #6847E8;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.08);
        }

        /* Spinner */
        .qg-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #EDE8FF;
          border-top-color: #6847E8;
          border-radius: 50%;
          animation: qgSpin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes qgSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="qg-container">
        {/* PAGE HEADER */}
        <div className="qg-header">
          <div>
            <h1 className="qg-header-title">
              <span>Quiz Generator</span>
              <span className="qg-badge-ai">✨ AI Powered</span>
            </h1>
            <p className="qg-header-subtitle">
              Turn your study material into personalized quizzes and test your understanding.
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#77758A', background: '#F8F9FD', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #E7E5EF' }}>
              📚 Connected to Learning AI Workspace
            </span>
          </div>
        </div>

        {/* STATE 1: CONFIGURATION FORM */}
        {appState === 'configure' && (
          <>
            {configError && <div className="qg-alert-error">{configError}</div>}

            {/* STEP 1: CHOOSE STUDY MATERIAL */}
            <div className="qg-card">
              <h2 className="qg-card-title">1. Choose Your Study Material</h2>

              <div className="qg-segmented-tabs">
                <button
                  type="button"
                  className={`qg-tab-btn ${sourceType === 'topic' ? 'active' : ''}`}
                  onClick={() => setSourceType('topic')}
                >
                  📝 Enter Topic or Paste Notes
                </button>
                <button
                  type="button"
                  className={`qg-tab-btn ${sourceType === 'file' ? 'active' : ''}`}
                  onClick={() => setSourceType('file')}
                >
                  📄 Upload PDF / Document
                </button>
              </div>

              {sourceType === 'topic' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Study Topic / Subject
                    </label>
                    <input
                      type="text"
                      className="qg-input-text"
                      placeholder="e.g., Operating Systems, Neural Networks, DBMS Normalization"
                      value={topicText}
                      onChange={(e) => setTopicText(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Paste Course Notes or Lecture Content (Optional)
                    </label>
                    <textarea
                      className="qg-textarea"
                      rows={4}
                      placeholder="Paste your chapter text, summary notes, or definitions here to generate specific questions..."
                      value={pastedNotes}
                      onChange={(e) => setPastedNotes(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="qg-dropzone"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('qg-file-input').click()}
                  >
                    <div className="qg-dropzone-icon">📁</div>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: 700, fontSize: '0.95rem' }}>
                      Drag and drop your PDF / TXT here
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#77758A' }}>
                      Supports PDF or TXT up to 15 MB
                    </p>
                    <input
                      id="qg-file-input"
                      type="file"
                      accept=".pdf,.txt"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>

                  {fileError && <div className="qg-alert-error" style={{ marginTop: '0.75rem' }}>{fileError}</div>}

                  {selectedFile && (
                    <div className="qg-file-preview">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📑</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{selectedFile.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#77758A' }}>
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.name.endsWith('.pdf') ? 'PDF Document' : 'Text File'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="qg-btn-outline"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="qg-notice-demo">
                    ℹ️ <strong>Demo Note:</strong> Document upload validates size & format. AI PDF parsing will connect via Python Flask backend API.
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: CUSTOMIZE YOUR QUIZ */}
            <div className="qg-card">
              <h2 className="qg-card-title">2. Customize Your Quiz</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Number of Questions */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    Number of Questions
                  </label>
                  <div className="qg-grid-4">
                    {[5, 10, 15, 20].map((num) => (
                      <div
                        key={num}
                        className={`qg-choice-chip ${numQuestions === num ? 'selected' : ''}`}
                        onClick={() => setNumQuestions(num)}
                      >
                        {num} Questions
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    Difficulty Level
                  </label>
                  <div className="qg-grid-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {['Easy', 'Medium', 'Hard'].map((lvl) => (
                      <div
                        key={lvl}
                        className={`qg-choice-chip ${difficulty === lvl ? 'selected' : ''}`}
                        onClick={() => setDifficulty(lvl)}
                      >
                        {lvl}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question Types */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    Question Types
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
                    <label className="qg-checkbox-label">
                      <input
                        type="checkbox"
                        className="qg-checkbox"
                        checked={selectedTypes.includes('mcq')}
                        onChange={() => handleTypeToggle('mcq')}
                      />
                      Multiple Choice (MCQs)
                    </label>

                    <label className="qg-checkbox-label">
                      <input
                        type="checkbox"
                        className="qg-checkbox"
                        checked={selectedTypes.includes('true_false')}
                        onChange={() => handleTypeToggle('true_false')}
                      />
                      True / False
                    </label>

                    <label className="qg-checkbox-label">
                      <input
                        type="checkbox"
                        className="qg-checkbox"
                        checked={selectedTypes.includes('multi_select')}
                        onChange={() => handleTypeToggle('multi_select')}
                      />
                      Multiple-Answer Choice
                    </label>
                  </div>
                </div>

                {/* Language & Extra Options */}
                <div className="qg-grid-2">
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Language
                    </label>
                    <select
                      className="qg-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Hinglish">Hinglish</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                    <label className="qg-checkbox-label">
                      <input
                        type="checkbox"
                        className="qg-checkbox"
                        checked={includeExplanations}
                        onChange={(e) => setIncludeExplanations(e.target.checked)}
                      />
                      Include Answer Explanations
                    </label>

                    <label className="qg-checkbox-label">
                      <input
                        type="checkbox"
                        className="qg-checkbox"
                        checked={includeHints}
                        onChange={(e) => setIncludeHints(e.target.checked)}
                      />
                      Enable Question Hints
                    </label>

                    <label className="qg-checkbox-label">
                      <input
                        type="checkbox"
                        className="qg-checkbox"
                        checked={focusCoreConcepts}
                        onChange={(e) => setFocusCoreConcepts(e.target.checked)}
                      />
                      Focus on Core Concepts
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* GENERATE BUTTON */}
            <button type="button" className="qg-btn-primary" onClick={handleGenerateQuiz}>
              ⚡ Generate My Quiz
            </button>
          </>
        )}

        {/* STATE 2: GENERATING LOADING INDICATOR */}
        {appState === 'generating' && (
          <div className="qg-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div className="qg-spinner"></div>
            <h3 style={{ marginTop: '1.25rem', marginBottom: '0.5rem', color: '#20243A' }}>
              Creating Your Custom Quiz...
            </h3>
            <p style={{ color: '#77758A', fontSize: '0.875rem', margin: 0 }}>
              Analyzing study material and formulating {numQuestions} {difficulty}-level questions.
            </p>
          </div>
        )}

        {/* STATE 3: ACTIVE QUIZ TAKING */}
        {appState === 'active' && activeQuiz.length > 0 && (
          <div className="qg-card">
            {/* Top Bar Info */}
            <div className="qg-quiz-header-bar">
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6847E8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {difficulty} • {language}
                </span>
                <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.1rem', color: '#20243A' }}>
                  {sourceType === 'file' ? (selectedFile ? selectedFile.name : 'Uploaded Document') : (topicText.trim() || 'Custom Study Quiz')}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#77758A' }}>
                  ⏱️ {formatTimer(timerSeconds)}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, background: '#EDE8FF', color: '#6847E8', padding: '0.35rem 0.75rem', borderRadius: '0.5rem' }}>
                  Question {currentQuestionIdx + 1} of {activeQuiz.length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="qg-progress-bar-bg">
              <div
                className="qg-progress-bar-fill"
                style={{ width: `${((currentQuestionIdx + 1) / activeQuiz.length) * 100}%` }}
              ></div>
            </div>

            {/* Current Question */}
            {(() => {
              const currentQ = activeQuiz[currentQuestionIdx];
              const userAns = userAnswers[currentQ.id];

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#77758A', background: '#F8F9FD', padding: '0.2rem 0.5rem', borderRadius: '0.35rem', border: '1px solid #E7E5EF' }}>
                      {currentQ.type === 'mcq' ? 'Multiple Choice' : currentQ.type === 'true_false' ? 'True / False' : 'Multiple Answers (Select all that apply)'}
                    </span>

                    {userAns !== undefined && (
                      <button
                        type="button"
                        onClick={() => handleClearAnswer(currentQ.id)}
                        style={{ background: 'none', border: 'none', color: '#77758A', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#20243A', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                    {currentQuestionIdx + 1}. {currentQ.question}
                  </h3>

                  {/* Options List */}
                  <div>
                    {currentQ.options.map((opt, idx) => {
                      let isSelected = false;
                      if (currentQ.type === 'multi_select') {
                        isSelected = Array.isArray(userAns) && userAns.includes(idx);
                      } else {
                        isSelected = userAns === idx;
                      }

                      return (
                        <div
                          key={idx}
                          className={`qg-option-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleOptionSelect(currentQ.id, idx, currentQ.type === 'multi_select')}
                        >
                          <div className="qg-indicator-box">
                            {isSelected ? (currentQ.type === 'multi_select' ? '✓' : '●') : String.fromCharCode(65 + idx)}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hint Section */}
                  {includeHints && currentQ.hint && (
                    <div style={{ marginTop: '1rem' }}>
                      {!showHint ? (
                        <button
                          type="button"
                          className="qg-btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                          onClick={() => setShowHint(true)}
                        >
                          💡 Need a hint?
                        </button>
                      ) : (
                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#92400E' }}>
                          💡 <strong>Hint:</strong> {currentQ.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Footer */}
                  <div style={{ display: 'flex', justifyBetween: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #E7E5EF' }}>
                    <button
                      type="button"
                      className="qg-btn-outline"
                      disabled={currentQuestionIdx === 0}
                      style={{ opacity: currentQuestionIdx === 0 ? 0.5 : 1, cursor: currentQuestionIdx === 0 ? 'not-allowed' : 'pointer' }}
                      onClick={() => {
                        setCurrentQuestionIdx((prev) => prev - 1);
                        setShowHint(false);
                      }}
                    >
                      ← Previous
                    </button>

                    {currentQuestionIdx < activeQuiz.length - 1 ? (
                      <button
                        type="button"
                        className="qg-btn-secondary"
                        onClick={() => {
                          setCurrentQuestionIdx((prev) => prev + 1);
                          setShowHint(false);
                        }}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="qg-btn-primary"
                        style={{ width: 'auto' }}
                        onClick={handleFinishQuiz}
                      >
                        Finish & Submit Quiz ✅
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* STATE 4: RESULTS & SCORE SCREEN */}
        {appState === 'results' && (
          <div className="qg-card" style={{ textAlign: 'center' }}>
            <div className="qg-score-circle">
              <span className="qg-score-num">{scoreInfo.percentage}%</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Score</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#20243A', margin: '0 0 0.5rem 0' }}>
              {scoreInfo.percentage >= 80 ? '🎉 Outstanding Performance!' : scoreInfo.percentage >= 50 ? '👍 Good Effort!' : '📚 Keep Practicing!'}
            </h2>
            <p style={{ color: '#77758A', fontSize: '0.875rem', margin: 0 }}>
              You answered {scoreInfo.correctCount} out of {scoreInfo.total} questions correctly.
            </p>

            <div className="qg-results-grid">
              <div className="qg-stat-box">
                <div className="qg-stat-val" style={{ color: '#10B981' }}>{scoreInfo.correctCount}</div>
                <div className="qg-stat-lbl">Correct</div>
              </div>
              <div className="qg-stat-box">
                <div className="qg-stat-val" style={{ color: '#EF4444' }}>{scoreInfo.incorrectCount}</div>
                <div className="qg-stat-lbl">Incorrect</div>
              </div>
              <div className="qg-stat-box">
                <div className="qg-stat-val" style={{ color: '#F59E0B' }}>{scoreInfo.unansweredCount}</div>
                <div className="qg-stat-lbl">Unanswered</div>
              </div>
              <div className="qg-stat-box">
                <div className="qg-stat-val">{formatTimer(timerSeconds)}</div>
                <div className="qg-stat-lbl">Time Taken</div>
              </div>
            </div>

            {/* Personalized Learning Insights */}
            <div style={{ background: '#F8F9FD', border: '1px solid #E7E5EF', borderRadius: '0.75rem', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#20243A' }}>💡 Personalized Learning Insights</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#77758A', lineHeight: '1.6' }}>
                {scoreInfo.percentage < 100 && (
                  <li>Review core concepts in <strong>{activeQuiz[0]?.topic || 'this subject'}</strong> to improve accuracy.</li>
                )}
                <li>Recommended next difficulty: <strong>{scoreInfo.percentage >= 80 ? 'Hard' : 'Medium'}</strong>.</li>
                <li>Consistent quick practice helps convert short-term study into long-term recall.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="qg-btn-secondary"
                onClick={() => {
                  setCurrentQuestionIdx(0);
                  setAppState('review');
                }}
              >
                🔍 Review Answers & Explanations
              </button>
              <button
                type="button"
                className="qg-btn-outline"
                onClick={() => {
                  setUserAnswers({});
                  setCurrentQuestionIdx(0);
                  setTimerSeconds(0);
                  setTimerActive(true);
                  setAppState('active');
                }}
              >
                🔄 Retake Quiz
              </button>
              <button
                type="button"
                className="qg-btn-primary"
                style={{ width: 'auto' }}
                onClick={() => setAppState('configure')}
              >
                ✨ Generate New Quiz
              </button>
            </div>
          </div>
        )}

        {/* STATE 5: ANSWER REVIEW MODE */}
        {appState === 'review' && activeQuiz.length > 0 && (
          <div className="qg-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E7E5EF', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#20243A' }}>
                Answer Review & Explanations ({currentQuestionIdx + 1} / {activeQuiz.length})
              </h3>
              <button
                type="button"
                className="qg-btn-outline"
                onClick={() => setAppState('results')}
              >
                Back to Results
              </button>
            </div>

            {(() => {
              const q = activeQuiz[currentQuestionIdx];
              const userAns = userAnswers[q.id];

              return (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#20243A', marginBottom: '1rem' }}>
                    {currentQuestionIdx + 1}. {q.question}
                  </h4>

                  <div>
                    {q.options.map((opt, idx) => {
                      let cardClass = 'qg-option-card';
                      let isUserSelection = false;
                      let isCorrectSelection = false;

                      if (q.type === 'multi_select') {
                        isUserSelection = Array.isArray(userAns) && userAns.includes(idx);
                        isCorrectSelection = q.correctAnswer.includes(idx);
                      } else {
                        isUserSelection = userAns === idx;
                        isCorrectSelection = q.correctAnswer === idx;
                      }

                      if (isCorrectSelection) {
                        cardClass += ' review-correct';
                      } else if (isUserSelection && !isCorrectSelection) {
                        cardClass += ' review-incorrect';
                      }

                      return (
                        <div key={idx} className={cardClass} style={{ cursor: 'default' }}>
                          <div className="qg-indicator-box">
                            {isCorrectSelection ? '✓' : isUserSelection ? '✕' : String.fromCharCode(65 + idx)}
                          </div>
                          <span style={{ flex: 1 }}>{opt}</span>
                          {isCorrectSelection && <span style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>Correct Answer</span>}
                          {isUserSelection && !isCorrectSelection && <span style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700 }}>Your Selection</span>}
                        </div>
                      );
                    })}
                  </div>

                  {includeExplanations && q.explanation && (
                    <div style={{ background: '#EDE8FF', border: '1px solid rgba(104, 71, 232, 0.3)', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem' }}>
                      <div style={{ fontWeight: 700, color: '#6847E8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        📖 Explanation
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#20243A', lineHeight: '1.5' }}>
                        {q.explanation}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E7E5EF' }}>
                    <button
                      type="button"
                      className="qg-btn-outline"
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      className="qg-btn-secondary"
                      disabled={currentQuestionIdx === activeQuiz.length - 1}
                      onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* RECENT QUIZZES HISTORY SECTION */}
        <div className="qg-card">
          <h2 className="qg-card-title">🕒 Recent Quizzes & Practice History</h2>
          <div className="qg-recent-grid">
            {recentQuizzes.map((item) => (
              <div key={item.id} className="qg-recent-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6847E8', background: '#EDE8FF', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                      {item.difficulty}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#77758A' }}>{item.date}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#20243A', marginBottom: '0.25rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#77758A', marginBottom: '0.75rem' }}>
                    {item.questionsCount} Questions • Score: <strong style={{ color: '#10B981' }}>{item.scorePercent}%</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="qg-btn-outline"
                  style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => {
                    setTopicText(item.topic);
                    setSourceType('topic');
                    setAppState('configure');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Retake Similar Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}