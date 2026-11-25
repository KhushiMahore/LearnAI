import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, Sparkles, Plus, MessageSquare, 
  FileText, HelpCircle, BookOpen, Layers, Check, 
  Clock, AlertCircle, Bot, User, Trash2, ChevronRight 
} from 'lucide-react';

const SAMPLE_HISTORIES = [
  {
    id: 'hist-1',
    title: 'DBMS Normalization',
    context: 'Database Systems Notes.pdf',
    date: '2 hours ago',
    messages: [
      { sender: 'student', text: 'Can you explain 3NF normalization with an example?', time: '10:14 AM' },
      { sender: 'ai', text: 'A table is in 3NF if it is in 2NF and has no transitive dependencies. In simple terms: non-key attributes must depend ON ONLY the primary key!\n\nFor example: Student (ID, Department, DeptHead). Here, DeptHead depends on Department, not directly on ID. To achieve 3NF, move Department & DeptHead into a separate table.', time: '10:15 AM' }
    ]
  },
  {
    id: 'hist-2',
    title: 'Operating System Basics',
    context: 'OS_Chapter3_Processes.pdf',
    date: 'Yesterday',
    messages: [
      { sender: 'student', text: 'What is the difference between a process and a thread?', time: '04:30 PM' },
      { sender: 'ai', text: 'A Process is an execution of a program with its own memory space. A Thread is a lightweight sub-execution path within a process that shares memory with other threads of the same process.', time: '04:31 PM' }
    ]
  },
  {
    id: 'hist-3',
    title: 'Computer Networks Revision',
    context: 'General Study Question',
    date: '3 days ago',
    messages: [
      { sender: 'student', text: 'Give me 3 common exam questions on TCP vs UDP.', time: '02:10 PM' },
      { sender: 'ai', text: '1. Why is TCP called connection-oriented while UDP is connectionless?\n2. Compare TCP and UDP overhead and header sizes.\n3. Which protocol is best suited for video streaming and why?', time: '02:11 PM' }
    ]
  }
];

const INITIAL_MESSAGES = [
  {
    sender: 'ai',
    text: "Hi! I'm your AI Study Assistant. What would you like to learn today? You can ask general study questions or select an uploaded PDF to ask questions directly from your notes.",
    time: 'Just now'
  }
];

export default function AIChat({ onOpenUploadPDF }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContext, setSelectedContext] = useState('general'); // 'general', 'ask_pdf', 'summarize_pdf'
  const [attachedPdf, setAttachedPdf] = useState(null);
  const [activeHistoryId, setActiveHistoryId] = useState(null);
  const [histories, setHistories] = useState(SAMPLE_HISTORIES);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const triggerToast = (msg) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  const handleSendMessage = (customText) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    if (selectedContext !== 'general' && !attachedPdf) {
      triggerToast('Please attach or select a PDF first to use PDF study context.');
    }

    const newStudentMsg = {
      sender: 'student',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newStudentMsg]);
    if (!customText) setInputText('');
    setIsTyping(true);

    // Mock Response Generator with Delay
    setTimeout(() => {
      let replyText = `I have received your query: "${textToSend}". `;

      if (selectedContext === 'ask_pdf' && attachedPdf) {
        replyText += `Searching inside "${attachedPdf.name}"...\n\nBased on your notes, this topic relates to key concepts covered in the document. [Prototype AI Answer: Connect Python Flask + RAG/LangChain backend to extract live PDF content].`;
      } else if (selectedContext === 'summarize_pdf' && attachedPdf) {
        replyText += `Here is a structured summary of "${attachedPdf.name}":\n\n1. Key Definition & Scope\n2. Core Concepts & Examples\n3. Formulae / Summary Checklist.`;
      } else {
        replyText += `Here is a step-by-step breakdown:\n\n• Core Idea: Breakdown complex topics into manageable pieces.\n• Exam Tip: Make sure to highlight definitions and draw block diagrams during exams.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    setActiveHistoryId(null);
    setSelectedContext('general');
    setAttachedPdf(null);
    setInputText('');
    triggerToast('Started a new study session.');
  };

  const handleSelectHistory = (history) => {
    setActiveHistoryId(history.id);
    setMessages(history.messages);
    if (history.context !== 'General Study Question') {
      setSelectedContext('ask_pdf');
      setAttachedPdf({ name: history.context });
    } else {
      setSelectedContext('general');
      setAttachedPdf(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        triggerToast('Please select a valid PDF file.');
        return;
      }
      setAttachedPdf(file);
      setSelectedContext('ask_pdf');
      triggerToast(`Loaded "${file.name}" into study context.`);
    }
  };

  const applyLearningTool = (promptPrefix) => {
    const fullPrompt = `${promptPrefix} ${inputText}`.trim();
    if (inputText.trim()) {
      handleSendMessage(fullPrompt);
    } else {
      setInputText(promptPrefix + ' ');
    }
  };

  return (
    <div className="ai-chat-wrapper">
      <style>{`
        .ai-chat-wrapper {
          font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #20243A;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-height: calc(100vh - 5rem);
        }

        /* Header Bar */
        .ai-chat-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1.25rem;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 4px 12px rgba(32, 36, 58, 0.02);
        }

        @media (min-width: 640px) {
          .ai-chat-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .ai-chat-title-box {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .ai-chat-header-icon {
          width: 2.75rem;
          height: 2.75rem;
          background: #EDE8FF;
          color: #6847E8;
          border-radius: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          shrink: 0;
        }

        .ai-chat-h1 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.2rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ai-chat-sub {
          font-size: 0.825rem;
          color: #77758A;
          margin: 0;
        }

        .ai-chat-status-tag {
          font-size: 0.7rem;
          background: #EDE8FF;
          color: #6847E8;
          padding: 0.2rem 0.6rem;
          border-radius: 0.5rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .ai-chat-status-dot {
          width: 0.4rem;
          height: 0.4rem;
          background: #10B981;
          border-radius: 50%;
        }

        .ai-chat-btn-new {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #6847E8;
          color: #FFFFFF;
          border: none;
          padding: 0.625rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.2);
        }

        .ai-chat-btn-new:hover {
          background: #5736d7;
          transform: translateY(-1px);
        }

        /* Context Selector Toolbar */
        .ai-chat-context-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 0.875rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .ai-chat-context-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .ai-chat-context-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #20243A;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          shrink: 0;
        }

        .ai-chat-context-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ai-chat-ctx-btn {
          padding: 0.45rem 0.875rem;
          border-radius: 0.625rem;
          border: 1px solid #E7E5EF;
          background: #F8F9FD;
          color: #77758A;
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .ai-chat-ctx-btn:hover {
          background: #EDE8FF;
          color: #6847E8;
        }

        .ai-chat-ctx-btn.active {
          background: #EDE8FF;
          border-color: #6847E8;
          color: #6847E8;
        }

        .ai-chat-pdf-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
          padding: 0.35rem 0.75rem;
          border-radius: 0.625rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Two Column Body Grid */
        .ai-chat-body-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          flex: 1;
        }

        @media (min-width: 900px) {
          .ai-chat-body-grid {
            grid-template-columns: 1fr 300px;
          }
        }

        /* Main Conversation Column */
        .ai-chat-main-panel {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1.25rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 12px rgba(32, 36, 58, 0.02);
          overflow: hidden;
          height: 600px;
        }

        .ai-chat-scroll-area {
          flex: 1;
          padding: 1.25rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #FFFFFF;
        }

        .ai-chat-msg-row {
          display: flex;
          gap: 0.75rem;
          max-width: 85%;
        }

        .ai-chat-msg-row.student {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .ai-chat-msg-row.ai {
          align-self: flex-start;
        }

        .ai-chat-avatar {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          shrink: 0;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .ai-chat-avatar.ai {
          background: #EDE8FF;
          color: #6847E8;
          border: 1px solid rgba(104, 71, 232, 0.2);
        }

        .ai-chat-avatar.student {
          background: #6847E8;
          color: #FFFFFF;
        }

        .ai-chat-bubble {
          padding: 0.875rem 1.125rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .ai-chat-bubble.student {
          background: #6847E8;
          color: #FFFFFF;
          border-bottom-right-radius: 0.25rem;
        }

        .ai-chat-bubble.ai {
          background: #F8F9FD;
          color: #20243A;
          border: 1px solid #E7E5EF;
          border-bottom-left-radius: 0.25rem;
        }

        .ai-chat-msg-meta {
          font-size: 0.675rem;
          color: #77758A;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .student .ai-chat-msg-meta {
          justify-content: flex-end;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Typing Indicator Animation */
        .ai-chat-typing-dots {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.5rem;
        }

        .ai-chat-typing-dot {
          width: 0.4rem;
          height: 0.4rem;
          background: #6847E8;
          border-radius: 50%;
          animation: aiBounce 1.2s infinite ease-in-out;
        }

        .ai-chat-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .ai-chat-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes aiBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Quick Learning Tools Strip */
        .ai-chat-tools-bar {
          padding: 0.625rem 1.25rem;
          background: #F8F9FD;
          border-top: 1px solid #E7E5EF;
          border-bottom: 1px solid #E7E5EF;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .ai-chat-tool-chip {
          padding: 0.35rem 0.75rem;
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 0.5rem;
          font-size: 0.725rem;
          font-weight: 600;
          color: #20243A;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .ai-chat-tool-chip:hover {
          background: #EDE8FF;
          border-color: #6847E8;
          color: #6847E8;
        }

        /* Input Controls Area */
        .ai-chat-input-area {
          padding: 0.875rem 1.25rem;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ai-chat-input-row {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.875rem;
          padding: 0.5rem 0.75rem;
        }

        .ai-chat-input-row:focus-within {
          border-color: #6847E8;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(104, 71, 232, 0.1);
        }

        .ai-chat-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: #20243A;
          resize: none;
          max-height: 80px;
          min-height: 24px;
          line-height: 1.4;
          font-family: inherit;
        }

        .ai-chat-btn-icon {
          background: transparent;
          border: none;
          color: #77758A;
          padding: 0.4rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-chat-btn-icon:hover {
          background: #EDE8FF;
          color: #6847E8;
        }

        .ai-chat-btn-send {
          background: #6847E8;
          color: #FFFFFF;
          border: none;
          padding: 0.5rem 0.875rem;
          border-radius: 0.625rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-chat-btn-send:hover {
          background: #5736d7;
        }

        .ai-chat-input-note {
          font-size: 0.675rem;
          color: #77758A;
          display: flex;
          justify-content: space-between;
          padding: 0 0.25rem;
        }

        /* Right Side History & Prompts Column */
        .ai-chat-side-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ai-chat-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1.25rem;
          padding: 1.25rem;
          box-shadow: 0 4px 12px rgba(32, 36, 58, 0.02);
        }

        .ai-chat-card-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.875rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Starter Prompts Grid */
        .ai-chat-prompts-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ai-chat-prompt-btn {
          text-align: left;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          font-size: 0.775rem;
          color: #20243A;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ai-chat-prompt-btn:hover {
          border-color: #6847E8;
          background: #EDE8FF;
          color: #6847E8;
        }

        /* History List */
        .ai-chat-history-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ai-chat-history-item {
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid #E7E5EF;
          background: #F8F9FD;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ai-chat-history-item:hover, .ai-chat-history-item.active {
          border-color: #6847E8;
          background: #EDE8FF;
        }

        .ai-chat-hist-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 0.15rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ai-chat-hist-meta {
          font-size: 0.675rem;
          color: #77758A;
          display: flex;
          justify-content: space-between;
        }

        /* Notification Toast */
        .ai-chat-toast {
          background: #20243A;
          color: #FFFFFF;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 100;
          animation: aiSlideUp 0.3s ease-out forwards;
        }

        @keyframes aiSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Toast Notice */}
      {showNotification && (
        <div className="ai-chat-toast">
          <Sparkles size={16} color="#EDE8FF" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="ai-chat-header">
        <div className="ai-chat-title-box">
          <div className="ai-chat-header-icon">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="ai-chat-h1">
              AI Study Assistant 
              <span className="ai-chat-status-tag">
                <span className="ai-chat-status-dot"></span> Active
              </span>
            </h1>
            <p className="ai-chat-sub">Ask questions, understand concepts, and learn smarter with AI.</p>
          </div>
        </div>

        <button onClick={handleNewChat} className="ai-chat-btn-new">
          <Plus size={16} /> New Chat
        </button>
      </div>

      {/* Study Context Selector Card */}
      <div className="ai-chat-context-card">
        <div className="ai-chat-context-label">
          <BookOpen size={16} color="#6847E8" />
          <span>Study Context:</span>
        </div>

        <div className="ai-chat-context-options">
          <button 
            className={`ai-chat-ctx-btn ${selectedContext === 'general' ? 'active' : ''}`}
            onClick={() => setSelectedContext('general')}
          >
            General Study Question
          </button>

          <button 
            className={`ai-chat-ctx-btn ${selectedContext === 'ask_pdf' ? 'active' : ''}`}
            onClick={() => {
              setSelectedContext('ask_pdf');
              if (!attachedPdf) fileInputRef.current?.click();
            }}
          >
            <FileText size={14} /> Ask About Uploaded PDF
          </button>

          <button 
            className={`ai-chat-ctx-btn ${selectedContext === 'summarize_pdf' ? 'active' : ''}`}
            onClick={() => {
              setSelectedContext('summarize_pdf');
              if (!attachedPdf) fileInputRef.current?.click();
            }}
          >
            <Sparkles size={14} /> Summarize Uploaded PDF
          </button>
        </div>

        {attachedPdf ? (
          <div className="ai-chat-pdf-pill">
            <FileText size={14} />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {attachedPdf.name}
            </span>
            <Trash2 
              size={13} 
              style={{ cursor: 'pointer', marginLeft: '0.25rem' }} 
              onClick={() => {
                setAttachedPdf(null);
                setSelectedContext('general');
                triggerToast('Removed PDF context.');
              }}
            />
          </div>
        ) : (
          selectedContext !== 'general' && (
            <span 
              onClick={() => fileInputRef.current?.click()} 
              style={{ fontSize: '0.75rem', color: '#6847E8', cursor: 'pointer', fontWeight: 600 }}
            >
              + Choose PDF
            </span>
          )
        )}
      </div>

      {/* Main Body Layout */}
      <div className="ai-chat-body-grid">
        {/* Main Conversation Column */}
        <div className="ai-chat-main-panel">
          {/* Messages Scroll View */}
          <div className="ai-chat-scroll-area">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-chat-msg-row ${msg.sender}`}>
                <div className={`ai-chat-avatar ${msg.sender}`}>
                  {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div>
                  <div className={`ai-chat-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                  <div className="ai-chat-msg-meta">
                    <Clock size={10} /> {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-chat-msg-row ai">
                <div className="ai-chat-avatar ai"><Bot size={16} /></div>
                <div className="ai-chat-bubble ai">
                  <div className="ai-chat-typing-dots">
                    <span className="ai-chat-typing-dot"></span>
                    <span className="ai-chat-typing-dot"></span>
                    <span className="ai-chat-typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Learning Tools Strip */}
          <div className="ai-chat-tools-bar">
            <button className="ai-chat-tool-chip" onClick={() => applyLearningTool('Explain simply:')}>💡 Explain Simply</button>
            <button className="ai-chat-tool-chip" onClick={() => applyLearningTool('Give an example of:')}>📌 Give Examples</button>
            <button className="ai-chat-tool-chip" onClick={() => applyLearningTool('Solve step-by-step:')}>🔢 Step-by-Step</button>
            <button className="ai-chat-tool-chip" onClick={() => applyLearningTool('Generate 3 practice questions on:')}>❓ Practice Questions</button>
          </div>

          {/* Input Area */}
          <div className="ai-chat-input-area">
            {/* Hidden Native File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="application/pdf" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />

            <div className="ai-chat-input-row">
              <button 
                className="ai-chat-btn-icon" 
                onClick={() => fileInputRef.current?.click()}
                title="Attach PDF Document"
              >
                <Paperclip size={18} />
              </button>

              <textarea
                className="ai-chat-textarea"
                placeholder={
                  selectedContext === 'ask_pdf' && attachedPdf 
                    ? `Ask questions about "${attachedPdf.name}"...` 
                    : "Ask anything about your studies (Enter to send)..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />

              <button 
                className="ai-chat-btn-send" 
                onClick={() => handleSendMessage()}
              >
                <Send size={16} />
              </button>
            </div>

            <div className="ai-chat-input-note">
              <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for line break</span>
              <span>Prototype Mode (Connect Python Backend for live AI)</span>
            </div>
          </div>
        </div>

        {/* Right Side Column: Prompts & History */}
        <div className="ai-chat-side-panel">
          {/* Suggested Prompts */}
          <div className="ai-chat-card">
            <h3 className="ai-chat-card-title">
              <span>Try Asking</span>
              <Sparkles size={16} color="#6847E8" />
            </h3>
            <div className="ai-chat-prompts-list">
              <button 
                className="ai-chat-prompt-btn"
                onClick={() => handleSendMessage("Explain this concept in simple words.")}
              >
                <span>Explain this concept in simple words</span>
                <ChevronRight size={14} />
              </button>
              <button 
                className="ai-chat-prompt-btn"
                onClick={() => handleSendMessage("Give me an example of normalization in DBMS.")}
              >
                <span>Example of DBMS Normalization</span>
                <ChevronRight size={14} />
              </button>
              <button 
                className="ai-chat-prompt-btn"
                onClick={() => handleSendMessage("Help me prepare for my upcoming exam.")}
              >
                <span>Help me prepare for an exam</span>
                <ChevronRight size={14} />
              </button>
              <button 
                className="ai-chat-prompt-btn"
                onClick={() => handleSendMessage("Summarize my study material.")}
              >
                <span>Summarize study material</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Recent Chat History */}
          <div className="ai-chat-card">
            <h3 className="ai-chat-card-title">
              <span>Recent Conversations</span>
              <Clock size={16} color="#77758A" />
            </h3>
            <div className="ai-chat-history-list">
              {histories.map((hist) => (
                <div 
                  key={hist.id} 
                  className={`ai-chat-history-item ${activeHistoryId === hist.id ? 'active' : ''}`}
                  onClick={() => handleSelectHistory(hist)}
                >
                  <p className="ai-chat-hist-title">{hist.title}</p>
                  <div className="ai-chat-hist-meta">
                    <span>{hist.date}</span>
                    <span style={{ fontWeight: 600, color: '#6847E8' }}>{hist.messages.length} msgs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}