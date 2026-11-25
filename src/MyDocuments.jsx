import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, MoreVertical, Trash2, Download, 
  Sparkles, MessageSquare, HelpCircle, Search, 
  ArrowUpDown, Plus, X 
} from 'lucide-react';

// Demo data simulating a backend response
const INITIAL_DOCUMENTS = [
  { id: 'doc-1', name: 'Operating Systems Notes.pdf', size: '4.2 MB', uploadDate: 'Oct 10, 2026', pages: 42 },
  { id: 'doc-2', name: 'DBMS Unit 2.pdf', size: '2.8 MB', uploadDate: 'Oct 08, 2026', pages: 28 },
  { id: 'doc-3', name: 'Computer Networks Revision.pdf', size: '6.1 MB', uploadDate: 'Oct 05, 2026', pages: 65 },
  { id: 'doc-4', name: 'Digital Logic Notes.pdf', size: '1.9 MB', uploadDate: 'Sep 28, 2026', pages: 18 }
];

export default function MyDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [activeMenuDocId, setActiveMenuDocId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setDocuments(documents.filter(doc => doc.id !== id));
      showToast(`Deleted "${name}" successfully.`);
      setActiveMenuDocId(null);
    }
  };

  const filteredDocuments = documents
    .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0; // 'recent' keeps original array order for demo
    });

  return (
    <div className="md-container">
      {/* 
        All styling is self-contained in this style tag to ensure 
        the SaaS aesthetic is preserved without external CSS files.
      */}
      <style>{`
        .md-container {
          font-family: 'Inter', 'Poppins', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          color: #20243A;
          animation: fadeIn 0.3s ease-in-out;
        }
        .md-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 640px) {
          .md-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .md-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.25rem 0; color: #20243A; }
        .md-subtitle { font-size: 0.875rem; color: #77758A; margin: 0; }
        .md-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #6847E8;
          color: #FFFFFF;
          padding: 0.625rem 1.25rem;
          border-radius: 0.75rem;
          font-weight: 500;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.2);
        }
        .md-btn-primary:hover { background: #5736d7; transform: translateY(-1px); }
        
        .md-toolbar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #FFFFFF;
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid #E7E5EF;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 640px) {
          .md-toolbar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .md-search-box {
          position: relative;
          flex: 1;
        }
        .md-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #77758A;
        }
        .md-search-input {
          width: 100%;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #20243A;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .md-search-input:focus { border-color: #6847E8; }
        
        .md-sort-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .md-sort-select {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #20243A;
          outline: none;
          cursor: pointer;
        }
        
        .md-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 768px) { .md-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .md-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .md-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease-in-out;
        }
        .md-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(104, 71, 232, 0.08);
          border-color: #EDE8FF;
        }
        
        .md-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .md-icon-wrapper {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .md-menu-btn {
          background: none;
          border: none;
          color: #77758A;
          padding: 0.25rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }
        .md-menu-btn:hover { background: #F8F9FD; }
        
        .md-dropdown {
          position: absolute;
          right: 0;
          top: 2rem;
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 0.375rem;
          z-index: 20;
          min-width: 11rem;
        }
        .md-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: none;
          background: none;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 0.5rem;
          cursor: pointer;
          text-align: left;
        }
        .md-dropdown-item:hover { background: #EDE8FF; color: #6847E8; }
        .md-dropdown-item.danger:hover { background: #fef2f2; color: #dc2626; }
        
        .md-doc-name { font-size: 0.875rem; font-weight: 700; margin: 0 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .md-doc-meta { font-size: 0.75rem; color: #77758A; margin: 0 0 1rem 0; line-height: 1.4; }
        
        .md-actions {
          border-top: 1px solid #E7E5EF;
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .md-action-btn-main {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem;
          background: #EDE8FF;
          color: #6847E8;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .md-action-btn-main:hover { background: #6847E8; color: #FFFFFF; }
        
        .md-action-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .md-action-btn-sub {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 0.375rem;
          background: #F8F9FD;
          color: #20243A;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .md-action-btn-sub:hover { background: #EDE8FF; border-color: #EDE8FF; }
        
        .md-empty-state {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 3rem 1.5rem;
          text-align: center;
          max-width: 32rem;
          margin: 2rem auto;
        }
        .md-empty-icon {
          width: 4rem;
          height: 4rem;
          background: #EDE8FF;
          color: #6847E8;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }
        .md-empty-title { font-size: 1.125rem; font-weight: 700; margin: 0 0 0.5rem 0; }
        .md-empty-desc { font-size: 0.875rem; color: #77758A; margin: 0 0 1.5rem 0; }
        
        .md-toast {
          background: #EDE8FF;
          color: #6847E8;
          border: 1px solid rgba(104, 71, 232, 0.2);
          padding: 1rem;
          border-radius: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          animation: slideDown 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* Toast Notification */}
      {notification && (
        <div className="md-toast">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header Area */}
      <div className="md-header">
        <div>
          <h1 className="md-title">My Documents</h1>
          <p className="md-subtitle">All your study materials, organized in one place. ({documents.length} files)</p>
        </div>
        <button onClick={() => navigate('/upload')} className="md-btn-primary">
          <Plus size={18} /> Upload New PDF
        </button>
      </div>

      {/* Toolbar Area */}
      <div className="md-toolbar">
        <div className="md-search-box">
          <Search className="md-search-icon" size={18} />
          <input
            type="text"
            placeholder="Search your documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md-search-input"
          />
        </div>
        <div className="md-sort-box">
          <ArrowUpDown size={16} color="#77758A" />
          <span style={{ fontSize: '0.75rem', color: '#77758A', fontWeight: 500 }}>Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="md-sort-select">
            <option value="recent">Recently Added</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>
        </div>
      </div>

      {/* Document Grid or Empty State */}
      {filteredDocuments.length === 0 ? (
        <div className="md-empty-state">
          <div className="md-empty-icon"><FileText size={32} /></div>
          <h3 className="md-empty-title">Your study space starts here</h3>
          <p className="md-empty-desc">Upload your first PDF to start summarizing, asking questions, and generating quizzes.</p>
          <button onClick={() => navigate('/upload')} className="md-btn-primary">
            Upload Your First PDF
          </button>
        </div>
      ) : (
        <div className="md-grid">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="md-card">
              <div>
                <div className="md-card-header">
                  <div className="md-icon-wrapper"><FileText size={24} /></div>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id)}
                      className="md-menu-btn"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenuDocId === doc.id && (
                      <div className="md-dropdown">
                        <button
                          onClick={() => { showToast(`Simulating download for ${doc.name}...`); setActiveMenuDocId(null); }}
                          className="md-dropdown-item"
                        >
                          <Download size={14} /> Download PDF
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.name)}
                          className="md-dropdown-item danger"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="md-doc-name" title={doc.name}>{doc.name}</h3>
                <p className="md-doc-meta">
                  {doc.size} • {doc.pages} pages <br/>
                  Uploaded: {doc.uploadDate}
                </p>
              </div>

              <div className="md-actions">
                <button
                  onClick={() => navigate('/summarizer', { state: { documentId: doc.id } })}
                  className="md-action-btn-main"
                >
                  <Sparkles size={14} /> Summarize PDF
                </button>
                <div className="md-action-row">
                  <button
                    onClick={() => navigate('/ask-ai', { state: { documentId: doc.id } })}
                    className="md-action-btn-sub"
                  >
                    <MessageSquare size={13} /> Ask AI
                  </button>
                  <button
                    onClick={() => navigate('/quiz', { state: { documentId: doc.id } })}
                    className="md-action-btn-sub"
                  >
                    <HelpCircle size={13} /> Quiz
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
