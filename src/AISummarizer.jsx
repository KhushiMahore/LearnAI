import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Trash2,
  Copy,
  Download,
  RotateCcw,
  BookOpen,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Zap,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  FileUp,
  Sliders,
  BarChart2
} from 'lucide-react';

const SAMPLE_TEXT = `Operating systems (OS) manage hardware resources and provide services for computer programs. Core responsibilities include process management, memory management, storage management, and device control. Operating system virtual memory enables software to execute even if total RAM is insufficient by swapping memory pages with disk storage. In database systems, ACID properties guarantee reliable processing: Atomicity ensures all operations complete or none do; Consistency maintains database invariants; Isolation prevents concurrent transaction side effects; and Durability guarantees committed changes survive system failures. System design requires balancing latency, throughput, availability, and fault tolerance. Distributed systems use consensus algorithms like Paxos or Raft to maintain a consistent state across replicated nodes. Understanding OS kernel concepts, process scheduling algorithms, and inter-process communication (IPC) mechanisms is crucial for building high-performance software applications.`;

const DEMO_RECENT = [
  {
    id: 'rec-1',
    docName: 'OS_Process_Management.txt',
    length: 'Medium',
    language: 'English',
    sampleSnippet: 'Process scheduling, PCB structure, deadlock conditions, and IPC mechanisms in modern operating systems.'
  },
  {
    id: 'rec-2',
    docName: 'DBMS_ACID_Notes.txt',
    length: 'Short',
    language: 'Hinglish',
    sampleSnippet: 'Database transactions guarantee ACID properties: Atomicity, Consistency, Isolation, and Durability.'
  },
  {
    id: 'rec-3',
    docName: 'Network_Protocols.txt',
    length: 'Detailed',
    language: 'Hindi',
    sampleSnippet: 'TCP 3-way handshake process, IP routing, subnets, and OSI layer architecture breakdown.'
  }
];

export default function AISummarizer() {
  // Input mode: 'pasted' or 'file'
  const [inputMode, setInputMode] = useState('pasted');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  // Settings State
  const [summaryLength, setSummaryLength] = useState('Medium'); // 'Short', 'Medium', 'Detailed'
  const [summaryFormat, setSummaryFormat] = useState('Bullet Points'); // 'Paragraph', 'Bullet Points', 'Key Takeaways', 'Study Notes'
  const [outputLanguage, setOutputLanguage] = useState('English'); // 'English', 'Hindi', 'Hinglish'
  const [difficultyLevel, setDifficultyLevel] = useState('Standard'); // 'Simple', 'Standard', 'Advanced'
  
  // Toggles
  const [optKeywords, setOptKeywords] = useState(true);
  const [optDefinitions, setOptDefinitions] = useState(true);
  const [optFormulas, setOptFormulas] = useState(true);

  // Generation & Results State
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [expandDefinitions, setExpandDefinitions] = useState(true);
  const [expandFormulas, setExpandFormulas] = useState(true);

  // File Upload Handlers
  const handleFileSelect = (file) => {
    setFileError(null);
    if (!file) return;

    const allowedTypes = ['application/pdf', 'text/plain'];
    const maxBytes = 10 * 1024 * 1024; // 10MB

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

    if (!isPdf && !isTxt) {
      setFileError('Unsupported file type. Please upload a .pdf or .txt document.');
      return;
    }

    if (file.size > maxBytes) {
      setFileError('File size exceeds 10 MB maximum limit.');
      return;
    }

    setSelectedFile(file);

    if (isTxt) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target.result || '');
      };
      reader.readAsText(file);
    } else {
      setInputText('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSelectedFile(null);
    setFileError(null);
    setSummaryResult(null);
  };

  const handleLoadSample = () => {
    setInputMode('pasted');
    setSelectedFile(null);
    setFileError(null);
    setInputText(SAMPLE_TEXT);
  };

  // Simple deterministic demo summary generator
  const handleGenerateSummary = () => {
    if (selectedFile && selectedFile.name.endsWith('.pdf') && !inputText.trim()) {
      setFileError('PDF text extraction requires Python Flask backend parsing. Please paste text or load sample text for frontend demo mode.');
      return;
    }

    const rawText = inputText.trim();
    if (!rawText) return;

    setIsGenerating(true);
    setSummaryResult(null);

    setTimeout(() => {
      const words = rawText.split(/\s+/).filter(Boolean);
      const originalWordCount = words.length;

      // Extract basic sentences
      const sentences = rawText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
      
      let sentenceCount = 2;
      if (summaryLength === 'Medium') sentenceCount = Math.min(4, Math.max(2, sentences.length));
      if (summaryLength === 'Detailed') sentenceCount = Math.min(7, Math.max(3, sentences.length));

      const selectedSentences = sentences.slice(0, sentenceCount);
      let formattedSummary = '';

      if (summaryFormat === 'Bullet Points') {
        formattedSummary = selectedSentences.map(s => `• ${s}`).join('\n\n');
      } else if (summaryFormat === 'Paragraph') {
        formattedSummary = selectedSentences.join(' ');
      } else if (summaryFormat === 'Key Takeaways') {
        formattedSummary = selectedSentences.map((s, idx) => `Key Takeaway ${idx + 1}: ${s}`).join('\n\n');
      } else {
        formattedSummary = `=== STUDY REVISION NOTES ===\n\n${selectedSentences.map(s => `- ${s}`).join('\n')}`;
      }

      // Add demo language prefix notice if non-English requested
      if (outputLanguage !== 'English') {
        formattedSummary = `[Language Preference: ${outputLanguage} — Demo translation placeholder]\n\n${formattedSummary}`;
      }

      // Extract dummy keywords (words > 6 chars)
      const uniqueWords = Array.from(new Set(words.map(w => w.replace(/[^a-zA-Z]/g, ''))))
        .filter(w => w.length > 5)
        .slice(0, 6);

      // Simple mock definitions & formulas
      const mockDefinitions = optDefinitions ? [
        { term: 'ACID Properties', def: 'Atomicity, Consistency, Isolation, and Durability guarantees for database transactions.' },
        { term: 'Virtual Memory', def: 'Memory management technique that creates an illusion of large main memory using disk storage.' }
      ] : [];

      const mockFormulas = optFormulas ? [
        { title: 'Throughput', content: 'Throughput = Total Completed Operations / Total Execution Time' },
        { title: 'Database Consistency', content: 'C = Invariant Check (Valid States)' }
      ] : [];

      const summaryWords = formattedSummary.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.ceil(summaryWords / 200));

      setSummaryResult({
        text: formattedSummary,
        originalCount: originalWordCount,
        summaryCount: summaryWords,
        readingTime,
        keywords: optKeywords ? uniqueWords : [],
        definitions: mockDefinitions,
        formulas: mockFormulas,
        length: summaryLength,
        format: summaryFormat,
        language: outputLanguage,
        difficulty: difficultyLevel
      });

      setIsGenerating(false);
    }, 900);
  };

  const handleCopy = async () => {
    if (!summaryResult) return;
    try {
      await navigator.clipboard.writeText(summaryResult.text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      alert('Failed to copy to clipboard.');
    }
  };

  const handleDownload = () => {
    if (!summaryResult) return;
    const element = document.createElement('a');
    const file = new Blob([summaryResult.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `LearningAI_Summary_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="ais-container">
      <style>{`
        .ais-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.5rem;
          color: #20243A;
          background-color: #F8F9FD;
          min-height: 100vh;
          box-sizing: border-box;
        }

        /* Top Header Area */
        .ais-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .ais-breadcrumb {
          font-size: 0.775rem;
          color: #77758A;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 500;
        }

        .ais-breadcrumb-active {
          color: #6847E8;
          font-weight: 600;
        }

        .ais-title-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          .ais-title-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .ais-h1 {
          font-size: 1.65rem;
          font-weight: 800;
          color: #20243A;
          margin: 0 0 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .ais-subtitle {
          font-size: 0.875rem;
          color: #77758A;
          margin: 0;
        }

        .ais-badge-ai {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #EDE8FF;
          color: #6847E8;
          border: 1px solid rgba(104, 71, 232, 0.2);
          padding: 0.35rem 0.75rem;
          border-radius: 0.625rem;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .ais-counter-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 0.875rem;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 2px 6px rgba(32, 36, 58, 0.02);
        }

        .ais-counter-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: #EDE8FF;
          color: #6847E8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ais-counter-val {
          font-size: 0.95rem;
          font-weight: 800;
          color: #20243A;
          margin: 0;
        }

        .ais-counter-lbl {
          font-size: 0.7rem;
          color: #77758A;
          margin: 0;
        }

        /* Two Column Main Workspace */
        .ais-workspace {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 1024px) {
          .ais-workspace {
            grid-template-columns: 1.25fr 0.9fr;
          }
        }

        /* Generic Card Container */
        .ais-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1.25rem;
          padding: 1.25rem;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.03);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ais-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #20243A;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Mode Switcher Tabs */
        .ais-tab-group {
          display: flex;
          background: #F8F9FD;
          padding: 0.25rem;
          border-radius: 0.75rem;
          border: 1px solid #E7E5EF;
          gap: 0.25rem;
        }

        .ais-tab-btn {
          flex: 1;
          padding: 0.5rem;
          border: none;
          background: transparent;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #77758A;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .ais-tab-btn.active {
          background: #FFFFFF;
          color: #6847E8;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        /* Upload Zone */
        .ais-dropzone {
          border: 2px dashed #E7E5EF;
          background: #F8F9FD;
          border-radius: 1rem;
          padding: 1.75rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ais-dropzone:hover {
          border-color: #6847E8;
          background: #EDE8FF;
        }

        .ais-drop-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 1rem;
          background: #EDE8FF;
          color: #6847E8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem auto;
        }

        .ais-file-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          padding: 0.75rem 1rem;
          border-radius: 0.875rem;
        }

        .ais-file-badge {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          background: #fef2f2;
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          shrink: 0;
        }

        /* Text Input Area */
        .ais-textarea-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .ais-textarea {
          width: 100%;
          min-height: 200px;
          padding: 0.875rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.875rem;
          font-family: inherit;
          font-size: 0.875rem;
          color: #20243A;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
          line-height: 1.5;
        }

        .ais-textarea:focus {
          border-color: #6847E8;
          background: #FFFFFF;
        }

        .ais-textarea-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #77758A;
        }

        .ais-btn-text-action {
          background: none;
          border: none;
          color: #6847E8;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .ais-btn-text-action:hover {
          text-decoration: underline;
        }

        /* Controls / Options Panel */
        .ais-setting-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .ais-setting-label {
          font-size: 0.775rem;
          font-weight: 700;
          color: #20243A;
        }

        .ais-btn-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .ais-btn-grid-4 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        @media (min-width: 640px) {
          .ais-btn-grid-4 {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .ais-opt-btn {
          padding: 0.5rem 0.35rem;
          border: 1px solid #E7E5EF;
          background: #F8F9FD;
          border-radius: 0.625rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #77758A;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .ais-opt-btn:hover {
          background: #EDE8FF;
          color: #6847E8;
        }

        .ais-opt-btn.active {
          background: #6847E8;
          color: #FFFFFF;
          border-color: #6847E8;
          box-shadow: 0 2px 6px rgba(104, 71, 232, 0.25);
        }

        .ais-select {
          width: 100%;
          padding: 0.55rem 0.75rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.625rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #20243A;
          outline: none;
          cursor: pointer;
        }

        .ais-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0;
        }

        .ais-toggle-lbl {
          font-size: 0.8rem;
          font-weight: 500;
          color: #20243A;
        }

        .ais-toggle-cb {
          accent-color: #6847E8;
          width: 1rem;
          height: 1rem;
          cursor: pointer;
        }

        /* Generate Primary Button */
        .ais-btn-generate {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #6847E8 0%, #5736d7 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 0.875rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(104, 71, 232, 0.3);
          margin-top: 0.5rem;
        }

        .ais-btn-generate:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(104, 71, 232, 0.4);
        }

        .ais-btn-generate:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Alert Banners */
        .ais-alert {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fee2e2;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          font-size: 0.775rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.4;
        }

        /* Summary Results Card */
        .ais-results-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1.25rem;
          padding: 1.5rem;
          box-shadow: 0 6px 20px rgba(104, 71, 232, 0.06);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ais-demo-tag {
          font-size: 0.675rem;
          font-weight: 800;
          background: #EDE8FF;
          color: #6847E8;
          padding: 0.2rem 0.6rem;
          border-radius: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* Stats Bar */
        .ais-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          background: #F8F9FD;
          padding: 0.875rem;
          border-radius: 0.875rem;
          border: 1px solid #E7E5EF;
        }

        @media (min-width: 640px) {
          .ais-stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .ais-stat-item {
          display: flex;
          flex-direction: column;
        }

        .ais-stat-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: #20243A;
        }

        .ais-stat-lbl {
          font-size: 0.7rem;
          color: #77758A;
        }

        .ais-summary-text-box {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.875rem;
          padding: 1.125rem;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #20243A;
          white-space: pre-wrap;
        }

        /* Keywords Chips */
        .ais-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .ais-chip {
          background: #EDE8FF;
          color: #6847E8;
          border: 1px solid rgba(104, 71, 232, 0.2);
          padding: 0.25rem 0.625rem;
          border-radius: 0.5rem;
          font-size: 0.725rem;
          font-weight: 600;
        }

        /* Collapsible Boxes */
        .ais-collapse-card {
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .ais-collapse-head {
          background: #F8F9FD;
          padding: 0.625rem 0.875rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          color: #20243A;
          cursor: pointer;
        }

        .ais-collapse-body {
          padding: 0.875rem;
          background: #FFFFFF;
          font-size: 0.825rem;
          line-height: 1.5;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Results Toolbar */
        .ais-results-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          padding-top: 0.5rem;
          border-top: 1px solid #E7E5EF;
        }

        .ais-action-btn {
          padding: 0.5rem 0.875rem;
          border: 1px solid #E7E5EF;
          background: #FFFFFF;
          border-radius: 0.625rem;
          font-size: 0.775rem;
          font-weight: 600;
          color: #20243A;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.2s ease;
        }

        .ais-action-btn:hover {
          background: #EDE8FF;
          color: #6847E8;
          border-color: #6847E8;
        }

        /* Recent Summaries Section */
        .ais-recent-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1.25rem;
          padding: 1.25rem;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.02);
        }

        .ais-recent-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.875rem;
          margin-top: 0.875rem;
        }

        @media (min-width: 768px) {
          .ais-recent-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .ais-recent-item {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.875rem;
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.75rem;
          transition: all 0.2s ease;
        }

        .ais-recent-item:hover {
          border-color: #6847E8;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.08);
        }

        .ais-recent-name {
          font-size: 0.825rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.25rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ais-recent-snippet {
          font-size: 0.75rem;
          color: #77758A;
          margin: 0;
          line-clamp: 2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ais-spinner {
          width: 1.125rem;
          height: 1.125rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: aisSpin 0.8s linear infinite;
        }

        @keyframes aisSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Page Header */}
      <div className="ais-header">
        <div className="ais-breadcrumb">
          <span>Dashboard</span> / <span>AI Tools</span> / <span className="ais-breadcrumb-active">AI Summarizer</span>
        </div>

        <div className="ais-title-row">
          <div>
            <h1 className="ais-h1">
              <Sparkles className="text-[#6847E8]" size={26} color="#6847E8" />
              AI Summarizer
              <span className="ais-badge-ai"><Zap size={12} /> PROTOTYPE</span>
            </h1>
            <p className="ais-subtitle">Turn lengthy study materials into clear, concise, and easy-to-understand summaries.</p>
          </div>

          <div className="ais-counter-card">
            <div className="ais-counter-icon"><BookOpen size={18} /></div>
            <div>
              <p className="ais-counter-val">12 Documents</p>
              <p className="ais-counter-lbl">Summarized this term</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="ais-workspace">
        {/* Left Column — Input Material */}
        <div className="ais-card">
          <div className="ais-card-title">
            <span>1. Select or Paste Study Material</span>
            <button onClick={handleLoadSample} className="ais-btn-text-action">
              Load Sample Text
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="ais-tab-group">
            <button
              className={`ais-tab-btn ${inputMode === 'pasted' ? 'active' : ''}`}
              onClick={() => setInputMode('pasted')}
            >
              <FileText size={14} /> Paste Text
            </button>
            <button
              className={`ais-tab-btn ${inputMode === 'file' ? 'active' : ''}`}
              onClick={() => setInputMode('file')}
            >
              <FileUp size={14} /> Upload PDF / TXT
            </button>
          </div>

          {/* File Mode Area */}
          {inputMode === 'file' ? (
            <div>
              {!selectedFile ? (
                <div
                  className="ais-dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('ais-file-input')?.click()}
                >
                  <div className="ais-drop-icon"><Upload size={24} /></div>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 700, fontSize: '0.9rem' }}>
                    Drag & Drop PDF or TXT here
                  </p>
                  <p style={{ margin: '0 0 0.875rem 0', fontSize: '0.75rem', color: '#77758A' }}>
                    Supported formats: .pdf, .txt (Max size: 10 MB)
                  </p>
                  <button className="ais-action-btn" type="button">Browse Files</button>
                  <input
                    id="ais-file-input"
                    type="file"
                    accept=".pdf,.txt"
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="ais-file-preview">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="ais-file-badge"><FileText size={18} /></div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>{selectedFile.name}</p>
                      <p style={{ margin: 0, fontSize: '0.725rem', color: '#77758A' }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.endsWith('.pdf') ? 'PDF (Requires Text Extraction)' : 'Text File'}
                      </p>
                    </div>
                  </div>
                  <button onClick={handleClear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#77758A' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Text Area Mode */
            <div className="ais-textarea-wrap">
              <textarea
                className="ais-textarea"
                placeholder="Paste your lecture notes, textbook chapters, or study material here..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (fileError) setFileError(null);
                }}
              />
              <div className="ais-textarea-footer">
                <span>{wordCount} words • {charCount} characters</span>
                {inputText && (
                  <button onClick={handleClear} className="ais-btn-text-action" style={{ color: '#ef4444' }}>
                    Clear Text
                  </button>
                )}
              </div>
            </div>
          )}

          {fileError && (
            <div className="ais-alert">
              <AlertCircle size={16} style={{ shrink: 0, marginTop: '2px' }} />
              <span>{fileError}</span>
            </div>
          )}
        </div>

        {/* Right Column — Settings & Controls */}
        <div className="ais-card">
          <div className="ais-card-title">
            <span>2. Summary Settings</span>
            <Sliders size={16} color="#6847E8" />
          </div>

          {/* Length */}
          <div className="ais-setting-group">
            <label className="ais-setting-label">Summary Length</label>
            <div className="ais-btn-grid">
              {['Short', 'Medium', 'Detailed'].map((len) => (
                <button
                  key={len}
                  className={`ais-opt-btn ${summaryLength === len ? 'active' : ''}`}
                  onClick={() => setSummaryLength(len)}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="ais-setting-group">
            <label className="ais-setting-label">Format Style</label>
            <div className="ais-btn-grid-4">
              {['Paragraph', 'Bullet Points', 'Key Takeaways', 'Study Notes'].map((fmt) => (
                <button
                  key={fmt}
                  className={`ais-opt-btn ${summaryFormat === fmt ? 'active' : ''}`}
                  onClick={() => setSummaryFormat(fmt)}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Output Language & Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="ais-setting-group">
              <label className="ais-setting-label">Output Language</label>
              <select
                className="ais-select"
                value={outputLanguage}
                onChange={(e) => setOutputLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>

            <div className="ais-setting-group">
              <label className="ais-setting-label">Difficulty</label>
              <select
                className="ais-select"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                <option value="Simple">Simple</option>
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Additional Toggles */}
          <div className="ais-setting-group" style={{ borderTop: '1px solid #E7E5EF', paddingTop: '0.75rem' }}>
            <label className="ais-setting-label" style={{ marginBottom: '0.25rem' }}>Content Extraction Options</label>
            
            <div className="ais-toggle-row">
              <span className="ais-toggle-lbl">Include Key Keywords</span>
              <input
                type="checkbox"
                className="ais-toggle-cb"
                checked={optKeywords}
                onChange={(e) => setOptKeywords(e.target.checked)}
              />
            </div>

            <div className="ais-toggle-row">
              <span className="ais-toggle-lbl">Highlight Key Definitions</span>
              <input
                type="checkbox"
                className="ais-toggle-cb"
                checked={optDefinitions}
                onChange={(e) => setOptDefinitions(e.target.checked)}
              />
            </div>

            <div className="ais-toggle-row">
              <span className="ais-toggle-lbl">Extract Formulas / Core Rules</span>
              <input
                type="checkbox"
                className="ais-toggle-cb"
                checked={optFormulas}
                onChange={(e) => setOptFormulas(e.target.checked)}
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            className="ais-btn-generate"
            disabled={(!inputText.trim() && !selectedFile) || isGenerating}
            onClick={handleGenerateSummary}
          >
            {isGenerating ? (
              <>
                <div className="ais-spinner"></div>
                <span>Generating Summary...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Summary Results Section */}
      {summaryResult && (
        <div className="ais-results-card" style={{ marginBottom: '2rem' }}>
          <div className="ais-card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Your Summary</span>
              <span className="ais-demo-tag">Demo Summary — AI backend not connected</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#77758A', fontWeight: 500 }}>
              Generated in {summaryResult.language} • {summaryResult.difficulty} Level
            </span>
          </div>

          {/* Stats Metrics Bar */}
          <div className="ais-stats-grid">
            <div className="ais-stat-item">
              <span className="ais-stat-val">{summaryResult.originalCount}</span>
              <span className="ais-stat-lbl">Original Words</span>
            </div>
            <div className="ais-stat-item">
              <span className="ais-stat-val" style={{ color: '#6847E8' }}>{summaryResult.summaryCount}</span>
              <span className="ais-stat-lbl">Summary Words</span>
            </div>
            <div className="ais-stat-item">
              <span className="ais-stat-val">
                {Math.round((1 - summaryResult.summaryCount / Math.max(1, summaryResult.originalCount)) * 100)}%
              </span>
              <span className="ais-stat-lbl">Compression Ratio</span>
            </div>
            <div className="ais-stat-item">
              <span className="ais-stat-val">{summaryResult.readingTime} min</span>
              <span className="ais-stat-lbl">Est. Reading Time</span>
            </div>
          </div>

          {/* Summary Body Text */}
          <div className="ais-summary-text-box">
            {summaryResult.text}
          </div>

          {/* Extracted Keywords */}
          {summaryResult.keywords.length > 0 && (
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Extracted Keywords:</p>
              <div className="ais-chips-wrap">
                {summaryResult.keywords.map((kw, idx) => (
                  <span key={idx} className="ais-chip">#{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible Key Definitions */}
          {summaryResult.definitions.length > 0 && (
            <div className="ais-collapse-card">
              <div
                className="ais-collapse-head"
                onClick={() => setExpandDefinitions(!expandDefinitions)}
              >
                <span>Key Definitions ({summaryResult.definitions.length})</span>
                {expandDefinitions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandDefinitions && (
                <div className="ais-collapse-body">
                  {summaryResult.definitions.map((item, idx) => (
                    <div key={idx}>
                      <strong style={{ color: '#6847E8' }}>{item.term}:</strong> {item.def}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collapsible Formulas */}
          {summaryResult.formulas.length > 0 && (
            <div className="ais-collapse-card">
              <div
                className="ais-collapse-head"
                onClick={() => setExpandFormulas(!expandFormulas)}
              >
                <span>Core Formulas & Concepts ({summaryResult.formulas.length})</span>
                {expandFormulas ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandFormulas && (
                <div className="ais-collapse-body">
                  {summaryResult.formulas.map((item, idx) => (
                    <div key={idx} style={{ fontFamily: 'monospace', background: '#F8F9FD', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <strong>{item.title}:</strong> {item.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Results Action Buttons */}
          <div className="ais-results-actions">
            <button className="ais-action-btn" onClick={handleCopy}>
              {copySuccess ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copySuccess ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button className="ais-action-btn" onClick={handleDownload}>
              <Download size={14} /> Download (.txt)
            </button>
            <button className="ais-action-btn" onClick={handleGenerateSummary}>
              <RotateCcw size={14} /> Regenerate
            </button>
            <button className="ais-action-btn" onClick={handleClear} style={{ color: '#ef4444' }}>
              <Trash2 size={14} /> Clear & Start New
            </button>
          </div>
        </div>
      )}

      {/* Recent Sample Summaries */}
      <div className="ais-recent-card">
        <div className="ais-card-title">
          <span>Recent Sample Summaries</span>
          <span style={{ fontSize: '0.75rem', color: '#77758A', fontWeight: 500 }}>Demo Examples</span>
        </div>

        <div className="ais-recent-grid">
          {DEMO_RECENT.map((rec) => (
            <div key={rec.id} className="ais-recent-item">
              <div>
                <p className="ais-recent-name">{rec.docName}</p>
                <p className="ais-recent-snippet">{rec.sampleSnippet}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', borderTop: '1px solid #E7E5EF', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#77758A' }}>
                  {rec.length} • {rec.language}
                </span>
                <button
                  className="ais-btn-text-action"
                  onClick={() => {
                    setInputMode('pasted');
                    setInputText(rec.sampleSnippet);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  Open <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}