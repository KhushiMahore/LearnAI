import React, { useState, useMemo } from 'react';

// Initial Sample Chat History Dataset
const INITIAL_CONVERSATIONS = [
  {
    id: 'chat-101',
    title: 'Explain OS Scheduling Algorithms',
    category: 'general', // 'general' or 'pdf'
    subject: 'Operating Systems',
    pdfName: null,
    lastActive: '2026-10-14T14:30:00',
    displayDate: '2 hours ago',
    pinned: true,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Can you explain the difference between FCFS, Shortest Job First (SJF), and Round Robin CPU scheduling?',
        timestamp: '2:30 PM'
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'Certainly! Here is a breakdown of the three key CPU scheduling algorithms:\n\n1. **First-Come, First-Served (FCFS)**: Non-preemptive. Executes processes in arrival order. Can suffer from the "Convoy Effect" if a long process arrives first.\n2. **Shortest Job First (SJF)**: Prioritizes processes with the smallest CPU burst time. Minimizes average waiting time, but can cause starvation for longer jobs.\n3. **Round Robin (RR)**: Preemptive and time-sliced. Each process gets a fixed time quantum. Excellent for interactive systems.',
        timestamp: '2:30 PM'
      },
      {
        id: 'm3',
        sender: 'user',
        text: 'Which algorithm works best for a time-sharing operating system?',
        timestamp: '2:32 PM'
      },
      {
        id: 'm4',
        sender: 'ai',
        text: 'Round Robin (RR) is specifically designed for time-sharing systems. Because each process gets a small unit of CPU time (time quantum), all users get a responsive experience without any single process monopolizing the processor.',
        timestamp: '2:32 PM'
      }
    ]
  },
  {
    id: 'chat-102',
    title: 'DBMS Normalization Doubts',
    category: 'pdf',
    subject: 'Database Management Systems',
    pdfName: 'DBMS_Unit_2_Normalization.pdf',
    lastActive: '2026-10-14T09:15:00',
    displayDate: '7 hours ago',
    pinned: true,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Based on page 14 of the uploaded PDF, what is the exact condition for 3NF?',
        timestamp: '9:15 AM'
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'According to page 14 of `DBMS_Unit_2_Normalization.pdf`, a relation is in Third Normal Form (3NF) if:\n1. It is already in 2NF.\n2. No non-prime attribute is transitively dependent on the primary key.\n\nIn mathematical notation: for every non-trivial functional dependency $X \\rightarrow A$, either $X$ is a super key or $A$ is a prime attribute.',
        timestamp: '9:15 AM'
      }
    ]
  },
  {
    id: 'chat-103',
    title: 'Questions from Computer Networks PDF',
    category: 'pdf',
    subject: 'Computer Networks',
    pdfName: 'Computer_Networks_TCP_IP.pdf',
    lastActive: '2026-10-13T18:45:00',
    displayDate: 'Yesterday',
    pinned: false,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Explain the TCP 3-way handshake mechanism described in the document.',
        timestamp: '6:45 PM'
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'As detailed in Section 3.2 of `Computer_Networks_TCP_IP.pdf`, the TCP 3-way handshake establishes a reliable connection:\n\n1. **SYN**: Client sends a SYN segment with an initial sequence number (ISN).\n2. **SYN-ACK**: Server acknowledges by returning a SYN-ACK segment.\n3. **ACK**: Client sends a final ACK segment confirming receipt, establishing the two-way connection.',
        timestamp: '6:46 PM'
      }
    ]
  },
  {
    id: 'chat-104',
    title: 'Digital Logic Boolean Algebra',
    category: 'general',
    subject: 'Digital Logic',
    pdfName: null,
    lastActive: '2026-10-12T11:20:00',
    displayDate: '2 days ago',
    pinned: false,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'How do I simplify the Boolean expression: A\'B + AB + AB\'?',
        timestamp: '11:20 AM'
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'Here is the step-by-step simplification:\n\n1. Combine the last two terms using distributive law: `A\'B + A(B + B\')`\n2. Apply inverse law `(B + B\' = 1)`: `A\'B + A(1)`\n3. Simplify identity: `A\'B + A`\n4. Apply distributive expansion `(A + A\')(A + B)`: `(1)(A + B)`\n5. **Final Result**: `A + B`',
        timestamp: '11:21 AM'
      }
    ]
  },
  {
    id: 'chat-105',
    title: 'AI and Machine Learning Basics',
    category: 'general',
    subject: 'AI & Machine Learning',
    pdfName: null,
    lastActive: '2026-10-10T16:00:00',
    displayDate: '4 days ago',
    pinned: false,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'What is the trade-off between Bias and Variance in ML models?',
        timestamp: '4:00 PM'
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'The Bias-Variance Tradeoff is a core concept in machine learning:\n\n- **High Bias**: The model is underfitting (too simple, over-generalizes, misses data trends).\n- **High Variance**: The model is overfitting (too complex, memorizes training noise, fails on new test data).\n\n**Goal**: Find the sweet spot that minimizes total error by balancing complexity.',
        timestamp: '4:01 PM'
      }
    ]
  },
  {
    id: 'chat-106',
    title: 'GATE Exam Preparation Doubts',
    category: 'general',
    subject: 'General Prep',
    pdfName: null,
    lastActive: '2026-10-08T10:00:00',
    displayDate: '6 days ago',
    pinned: false,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Which subjects carry the highest weightage in GATE CS paper?',
        timestamp: '10:00 AM'
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'Historically, the GATE CS weightage roughly breaks down as:\n\n1. **Data Structures & Algorithms**: ~15-20%\n2. **Operating Systems & DBMS**: ~15-18%\n3. **Computer Networks**: ~8-10%\n4. **Theory of Computation & Compiler**: ~12-15%\n5. **Engineering Mathematics & Aptitude**: Fixed 28% total.',
        timestamp: '10:01 AM'
      }
    ]
  }
];

export default function ChatHistory({ onOpenDashboard, onOpenAIChat, onOpenDocuments }) {
  // State Management
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedChatId, setSelectedChatId] = useState('chat-101');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'general' | 'pdf' | 'pinned' | 'recent'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'alphabetical'

  // Modal / Inline Rename & Notification State
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [mobileShowDetails, setMobileShowDetails] = useState(false);

  // Safe Navigation Callbacks
  const handleNavDashboard = () => onOpenDashboard && onOpenDashboard();
  const handleNavAIChat = () => onOpenAIChat && onOpenAIChat();
  const handleNavDocuments = () => onOpenDocuments && onOpenDocuments();

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Conversation Action Handlers
  const handleTogglePin = (e, chatId) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const nextPinned = !c.pinned;
          showToast(nextPinned ? 'Conversation pinned to top.' : 'Conversation unpinned.');
          return { ...c, pinned: nextPinned };
        }
        return c;
      })
    );
  };

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setRenamingChatId(chat.id);
    setNewTitleInput(chat.title);
  };

  const handleSaveRename = (e, chatId) => {
    e.preventDefault();
    if (!newTitleInput.trim()) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title: newTitleInput.trim() } : c))
    );
    setRenamingChatId(null);
    showToast('Conversation renamed.');
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    const targetChat = conversations.find((c) => c.id === chatId);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${targetChat?.title || 'this conversation'}"?`
    );

    if (confirmDelete) {
      const remaining = conversations.filter((c) => c.id !== chatId);
      setConversations(remaining);

      if (selectedChatId === chatId) {
        setSelectedChatId(remaining.length > 0 ? remaining[0].id : null);
      }
      showToast('Conversation deleted.');
    }
  };

  const handleCopyChatText = (chat) => {
    if (!chat || !chat.messages) return;
    const formatted = chat.messages
      .map((m) => `[${m.sender.toUpperCase()}] ${m.timestamp}:\n${m.text}`)
      .join('\n\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(formatted)
        .then(() => showToast('Conversation text copied to clipboard!'))
        .catch(() => showToast('Clipboard action unavailable.'));
    } else {
      showToast('Clipboard API unavailable in this browser.');
    }
  };

  const handleContinueChat = () => {
    showToast('Redirecting to AI Chat session...');
    if (onOpenAIChat) {
      onOpenAIChat();
    }
  };

  // Filter & Sort Pipeline
  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Search Query (title, message content, subject, pdf filename)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => {
        const titleMatch = c.title.toLowerCase().includes(q);
        const subjMatch = c.subject.toLowerCase().includes(q);
        const pdfMatch = c.pdfName && c.pdfName.toLowerCase().includes(q);
        const msgMatch = c.messages.some((m) => m.text.toLowerCase().includes(q));
        return titleMatch || subjMatch || pdfMatch || msgMatch;
      });
    }

    // Category Filter
    if (categoryFilter === 'general') {
      result = result.filter((c) => c.category === 'general');
    } else if (categoryFilter === 'pdf') {
      result = result.filter((c) => c.category === 'pdf');
    } else if (categoryFilter === 'pinned') {
      result = result.filter((c) => c.pinned);
    } else if (categoryFilter === 'recent') {
      // Recent defined as within last 2 days
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      result = result.filter((c) => new Date(c.lastActive) >= twoDaysAgo);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.lastActive) - new Date(a.lastActive);
      } else if (sortBy === 'oldest') {
        return new Date(a.lastActive) - new Date(b.lastActive);
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [conversations, searchQuery, categoryFilter, sortBy]);

  // Selected Chat Entity
  const activeChat = conversations.find((c) => c.id === selectedChatId) || null;

  // Aggregate Stats
  const totalCount = conversations.length;
  const generalCount = conversations.filter((c) => c.category === 'general').length;
  const pdfCount = conversations.filter((c) => c.category === 'pdf').length;
  const pinnedCount = conversations.filter((c) => c.pinned).length;

  return (
    <div className="chat-history-root">
      {/* Scoped CSS inside <style> tag */}
      <style>{`
        .chat-history-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #F8F9FD;
          color: #20243A;
          min-height: 100vh;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        .chat-history-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* Top Header Navigation */
        .chat-history-header {
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

        .chat-history-brand {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .chat-history-logo {
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

        .chat-history-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #20243A;
          margin: 0 0 0.15rem 0;
        }

        .chat-history-subtitle {
          font-size: 0.85rem;
          color: #77758A;
          margin: 0;
        }

        .chat-history-actions {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .chat-history-avatar {
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
        .chat-history-btn {
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

        .chat-history-btn-primary {
          background: #6847E8;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.2);
        }

        .chat-history-btn-primary:hover {
          background: #5736D7;
          transform: translateY(-1px);
        }

        .chat-history-btn-secondary {
          background: #F8F9FD;
          color: #20243A;
          border: 1px solid #E7E5EF;
        }

        .chat-history-btn-secondary:hover {
          background: #EDE8FF;
          color: #6847E8;
          border-color: #EDE8FF;
        }

        .chat-history-btn-outline {
          background: #FFFFFF;
          color: #20243A;
          border: 1px solid #E7E5EF;
        }

        .chat-history-btn-outline:hover {
          border-color: #6847E8;
          color: #6847E8;
        }

        .chat-history-btn-sm {
          padding: 0.3rem 0.6rem;
          font-size: 0.75rem;
          border-radius: 0.5rem;
        }

        /* Stats Cards Bar */
        .chat-history-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .chat-history-stat-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 0.875rem;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.02);
        }

        .chat-history-stat-num {
          font-size: 1.4rem;
          font-weight: 800;
          color: #20243A;
          margin: 0;
        }

        .chat-history-stat-lbl {
          font-size: 0.75rem;
          color: #77758A;
          margin: 0.15rem 0 0 0;
        }

        .chat-history-stat-icon {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          background: #F8F9FD;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        /* Main Dual Column Layout */
        .chat-history-workspace {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 992px) {
          .chat-history-workspace {
            grid-template-columns: 380px 1fr;
          }
        }

        /* Left Sidebar - Chat List */
        .chat-history-sidebar-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.25rem;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.02);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 280px);
          min-height: 550px;
        }

        /* Search & Controls */
        .chat-history-search-input {
          width: 100%;
          padding: 0.65rem 0.875rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          font-size: 0.825rem;
          color: #20243A;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 0.75rem;
        }

        .chat-history-search-input:focus {
          border-color: #6847E8;
          background: #FFFFFF;
        }

        .chat-history-filter-row {
          display: flex;
          gap: 0.35rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .chat-history-chip {
          padding: 0.3rem 0.65rem;
          font-size: 0.725rem;
          font-weight: 600;
          border-radius: 2rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          color: #77758A;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .chat-history-chip.active {
          background: #6847E8;
          color: #FFFFFF;
          border-color: #6847E8;
        }

        .chat-history-sort-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: #77758A;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #E7E5EF;
        }

        .chat-history-select {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.35rem;
          font-size: 0.725rem;
          color: #20243A;
          padding: 0.25rem 0.4rem;
          outline: none;
        }

        /* List Items */
        .chat-history-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .chat-history-item {
          padding: 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid #E7E5EF;
          background: #F8F9FD;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .chat-history-item:hover {
          border-color: #6847E8;
          background: #FFFFFF;
        }

        .chat-history-item.selected {
          border-color: #6847E8;
          background: #EDE8FF;
        }

        .chat-history-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.35rem;
        }

        .chat-history-item-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #20243A;
          margin: 0;
          line-height: 1.3;
          flex: 1;
          padding-right: 0.5rem;
        }

        .chat-history-item-meta {
          font-size: 0.7rem;
          color: #77758A;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.35rem;
        }

        .chat-history-tag-pdf {
          background: #E0F2FE;
          color: #0369A1;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
        }

        .chat-history-item-actions {
          display: flex;
          gap: 0.35rem;
          margin-top: 0.5rem;
          justify-content: flex-end;
        }

        .chat-history-icon-btn {
          background: transparent;
          border: none;
          color: #77758A;
          cursor: pointer;
          font-size: 0.85rem;
          padding: 0.2rem;
          border-radius: 0.25rem;
        }

        .chat-history-icon-btn:hover {
          color: #6847E8;
          background: rgba(104, 71, 232, 0.1);
        }

        /* Right Panel - Conversation Details */
        .chat-history-details-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.02);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 280px);
          min-height: 550px;
        }

        .chat-history-details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E7E5EF;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .chat-history-chat-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #20243A;
          margin: 0 0 0.25rem 0;
        }

        .chat-history-chat-sub {
          font-size: 0.775rem;
          color: #77758A;
          margin: 0;
        }

        /* Messages Stream */
        .chat-history-messages-stream {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-right: 0.5rem;
        }

        .chat-history-msg-row {
          display: flex;
          flex-direction: column;
          max-width: 82%;
        }

        .chat-history-msg-row.user {
          align-self: flex-end;
          align-items: flex-end;
        }

        .chat-history-msg-row.ai {
          align-self: flex-start;
          align-items: flex-start;
        }

        .chat-history-msg-bubble {
          padding: 0.875rem 1.15rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-line;
        }

        .chat-history-msg-row.user .chat-history-msg-bubble {
          background: #6847E8;
          color: #FFFFFF;
          border-bottom-right-radius: 0.2rem;
        }

        .chat-history-msg-row.ai .chat-history-msg-bubble {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          color: #20243A;
          border-bottom-left-radius: 0.2rem;
        }

        .chat-history-msg-time {
          font-size: 0.675rem;
          color: #9CA3AF;
          margin-top: 0.25rem;
        }

        /* Conversation Footer Controls */
        .chat-history-details-footer {
          padding-top: 1rem;
          border-top: 1px solid #E7E5EF;
          margin-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        /* Empty State */
        .chat-history-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #77758A;
          padding: 2rem;
        }

        .chat-history-empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        /* Toast Message */
        .chat-history-toast {
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
          animation: chatHistorySlideUp 0.3s ease-out;
        }

        @keyframes chatHistorySlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Mobile Utility */
        @media (max-width: 991px) {
          .chat-history-mobile-hide {
            display: none !important;
          }
        }
      `}</style>

      {/* Floating Toast Notification */}
      {toastMessage && <div className="chat-history-toast">✨ {toastMessage}</div>}

      <div className="chat-history-container">
        {/* Top Header Navigation */}
        <header className="chat-history-header">
          <div className="chat-history-brand">
            <div className="chat-history-logo">L</div>
            <div>
              <h1 className="chat-history-title">Chat History</h1>
              <p className="chat-history-subtitle">
                Revisit your previous conversations and learning sessions.
              </p>
            </div>
          </div>

          <div className="chat-history-actions">
            <button
              type="button"
              className="chat-history-btn chat-history-btn-secondary"
              onClick={handleNavDashboard}
            >
              📌 Dashboard
            </button>
            <button
              type="button"
              className="chat-history-btn chat-history-btn-primary"
              onClick={handleNavAIChat}
            >
              💬 AI Chat
            </button>
            <button
              type="button"
              className="chat-history-btn chat-history-btn-secondary"
              onClick={handleNavDocuments}
            >
              📁 Documents
            </button>
            <div className="chat-history-avatar" title="Student Profile">
              A
            </div>
          </div>
        </header>

        {/* Statistics Summary Bar */}
        <section className="chat-history-stats-grid">
          <div className="chat-history-stat-card">
            <div>
              <p className="chat-history-stat-num">{totalCount}</p>
              <p className="chat-history-stat-lbl">Total Conversations</p>
            </div>
            <div className="chat-history-stat-icon" style={{ color: '#6847E8' }}>
              💬
            </div>
          </div>

          <div className="chat-history-stat-card">
            <div>
              <p className="chat-history-stat-num">{generalCount}</p>
              <p className="chat-history-stat-lbl">General AI Chats</p>
            </div>
            <div className="chat-history-stat-icon" style={{ color: '#3B82F6' }}>
              🤖
            </div>
          </div>

          <div className="chat-history-stat-card">
            <div>
              <p className="chat-history-stat-num">{pdfCount}</p>
              <p className="chat-history-stat-lbl">PDF Q&A Sessions</p>
            </div>
            <div className="chat-history-stat-icon" style={{ color: '#0284C7' }}>
              📄
            </div>
          </div>

          <div className="chat-history-stat-card">
            <div>
              <p className="chat-history-stat-num">{pinnedCount}</p>
              <p className="chat-history-stat-lbl">Pinned Favorites</p>
            </div>
            <div className="chat-history-stat-icon" style={{ color: '#EAB308' }}>
              📌
            </div>
          </div>
        </section>

        {/* Main Workspace (Sidebar List + Details Panel) */}
        <div className="chat-history-workspace">
          {/* Left Column: Conversation Search & List */}
          <div
            className={`chat-history-sidebar-card ${
              mobileShowDetails ? 'chat-history-mobile-hide' : ''
            }`}
          >
            {/* Search Input */}
            <input
              type="text"
              className="chat-history-search-input"
              placeholder="🔍 Search title, subject, PDF, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Filter Chips */}
            <div className="chat-history-filter-row">
              <button
                type="button"
                className={`chat-history-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                className={`chat-history-chip ${categoryFilter === 'general' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('general')}
              >
                General ({generalCount})
              </button>
              <button
                type="button"
                className={`chat-history-chip ${categoryFilter === 'pdf' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('pdf')}
              >
                PDF Q&A ({pdfCount})
              </button>
              <button
                type="button"
                className={`chat-history-chip ${categoryFilter === 'pinned' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('pinned')}
              >
                Pinned ({pinnedCount})
              </button>
              <button
                type="button"
                className={`chat-history-chip ${categoryFilter === 'recent' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('recent')}
              >
                Recent
              </button>
            </div>

            {/* Sort Bar */}
            <div className="chat-history-sort-wrap">
              <span>Showing {filteredConversations.length} sessions</span>
              <select
                className="chat-history-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Scrollable Conversation List */}
            <div className="chat-history-list">
              {filteredConversations.length === 0 ? (
                <div className="chat-history-empty-state">
                  <div className="chat-history-empty-icon">🔍</div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>
                    No matching conversations found.
                  </p>
                  <button
                    type="button"
                    className="chat-history-btn chat-history-btn-outline chat-history-btn-sm"
                    style={{ marginTop: '0.75rem' }}
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredConversations.map((chat) => {
                  const isSelected = chat.id === selectedChatId;
                  const isRenaming = renamingChatId === chat.id;

                  return (
                    <div
                      key={chat.id}
                      className={`chat-history-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedChatId(chat.id);
                        setMobileShowDetails(true);
                      }}
                    >
                      <div className="chat-history-item-header">
                        {isRenaming ? (
                          <form
                            onSubmit={(e) => handleSaveRename(e, chat.id)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: 'flex', gap: '0.25rem', width: '100%' }}
                          >
                            <input
                              type="text"
                              className="chat-history-search-input"
                              style={{ margin: 0, padding: '0.25rem 0.5rem' }}
                              value={newTitleInput}
                              onChange={(e) => setNewTitleInput(e.target.value)}
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="chat-history-btn chat-history-btn-primary chat-history-btn-sm"
                            >
                              Save
                            </button>
                          </form>
                        ) : (
                          <h4 className="chat-history-item-title">
                            {chat.pinned && <span style={{ color: '#EAB308' }}>📌 </span>}
                            {chat.title}
                          </h4>
                        )}
                      </div>

                      <div className="chat-history-item-meta">
                        <span>{chat.subject}</span>
                        <span>•</span>
                        <span>{chat.displayDate}</span>
                        <span>•</span>
                        <span>{chat.messages.length} msgs</span>
                      </div>

                      {chat.pdfName && (
                        <div style={{ marginTop: '0.35rem' }}>
                          <span className="chat-history-tag-pdf">📄 {chat.pdfName}</span>
                        </div>
                      )}

                      {/* Quick Hover/Card Actions */}
                      <div className="chat-history-item-actions">
                        <button
                          type="button"
                          className="chat-history-icon-btn"
                          title={chat.pinned ? 'Unpin' : 'Pin to Top'}
                          onClick={(e) => handleTogglePin(e, chat.id)}
                        >
                          {chat.pinned ? '📌' : '📍'}
                        </button>
                        <button
                          type="button"
                          className="chat-history-icon-btn"
                          title="Rename"
                          onClick={(e) => handleStartRename(e, chat)}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="chat-history-icon-btn"
                          title="Delete"
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation Message History */}
          <div
            className={`chat-history-details-card ${
              !mobileShowDetails ? 'chat-history-mobile-hide' : ''
            }`}
          >
            {activeChat ? (
              <>
                {/* Details Top Bar */}
                <div className="chat-history-details-header">
                  <div>
                    <button
                      type="button"
                      className="chat-history-btn chat-history-btn-outline chat-history-btn-sm"
                      style={{ marginBottom: '0.5rem', display: 'inline-block' }}
                      onClick={() => setMobileShowDetails(false)}
                    >
                      ← Back to Conversations
                    </button>
                    <h3 className="chat-history-chat-title">{activeChat.title}</h3>
                    <p className="chat-history-chat-sub">
                      Subject: <strong>{activeChat.subject}</strong>
                      {activeChat.pdfName && (
                        <>
                          {' '}
                          • Context Document: <strong>{activeChat.pdfName}</strong>
                        </>
                      )}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="chat-history-btn chat-history-btn-outline chat-history-btn-sm"
                      onClick={() => handleCopyChatText(activeChat)}
                      title="Copy Conversation Text"
                    >
                      📋 Copy
                    </button>
                    <button
                      type="button"
                      className="chat-history-btn chat-history-btn-primary chat-history-btn-sm"
                      onClick={handleContinueChat}
                    >
                      💬 Continue in AI Chat
                    </button>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="chat-history-messages-stream">
                  {activeChat.messages.map((msg) => (
                    <div key={msg.id} className={`chat-history-msg-row ${msg.sender}`}>
                      <div className="chat-history-msg-bubble">{msg.text}</div>
                      <span className="chat-history-msg-time">
                        {msg.sender === 'user' ? 'You' : 'Learning AI Assistant'} • {msg.timestamp}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Details Footer Actions */}
                <div className="chat-history-details-footer">
                  <span style={{ fontSize: '0.75rem', color: '#77758A' }}>
                    Session ID: {activeChat.id} • Last active: {activeChat.displayDate}
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="chat-history-btn chat-history-btn-outline chat-history-btn-sm"
                      onClick={(e) => handleDeleteChat(e, activeChat.id)}
                    >
                      Delete Session
                    </button>
                    <button
                      type="button"
                      className="chat-history-btn chat-history-btn-primary chat-history-btn-sm"
                      onClick={handleNavAIChat}
                    >
                      + Start New Chat
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="chat-history-empty-state">
                <div className="chat-history-empty-icon">💬</div>
                <h3>No Conversation Selected</h3>
                <p style={{ maxWidth: '320px', fontSize: '0.85rem' }}>
                  Select a session from the list on the left to review messages, or start a new
                  learning session.
                </p>
                <button
                  type="button"
                  className="chat-history-btn chat-history-btn-primary"
                  style={{ marginTop: '1rem' }}
                  onClick={handleNavAIChat}
                >
                  Start New AI Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}