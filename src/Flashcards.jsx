import React, { useState } from 'react';

// Pre-defined study decks with subject-specific questions and answers
const SAMPLE_DECKS = {
  os: {
    id: 'os',
    title: 'Operating Systems',
    description: 'Process management, virtual memory, deadlocks, and CPU scheduling.',
    difficulty: 'Medium',
    cards: [
      {
        id: 'os-1',
        question: 'What is the primary difference between a Process and a Thread?',
        answer: 'A Process is an executing program with its own dedicated memory space. A Thread is a lightweight subset of a process that shares memory and resources with sibling threads.'
      },
      {
        id: 'os-2',
        question: 'What are Coffman\'s four conditions required for a Deadlock to occur?',
        answer: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait'
      },
      {
        id: 'os-3',
        question: 'What is Virtual Memory and how is it implemented?',
        answer: 'Virtual Memory creates an illusion of a large main memory by swapping inactive memory pages from physical RAM to secondary disk storage.'
      },
      {
        id: 'os-4',
        question: 'What is the purpose of a Translation Lookaside Buffer (TLB)?',
        answer: 'The TLB is a high-speed hardware cache used by the MMU to accelerate virtual-to-physical address translation.'
      },
      {
        id: 'os-5',
        question: 'Explain the difference between Preemptive and Non-Preemptive scheduling.',
        answer: 'Preemptive scheduling allows the OS to forcibly interrupt a running process. Non-preemptive scheduling requires the process to voluntarily yield or terminate.'
      }
    ]
  },
  dbms: {
    id: 'dbms',
    title: 'Database Management Systems',
    description: 'SQL queries, ACID properties, normalization, and indexing strategies.',
    difficulty: 'Hard',
    cards: [
      {
        id: 'dbms-1',
        question: 'What are the ACID properties in database transactions?',
        answer: 'Atomicity (all or nothing), Consistency (valid state transitions), Isolation (independent concurrent execution), and Durability (permanent committed changes).'
      },
      {
        id: 'dbms-2',
        question: 'What is the key difference between 2NF and 3NF Normalization?',
        answer: '2NF eliminates partial functional dependencies on candidate keys. 3NF eliminates transitive dependencies between non-key attributes.'
      },
      {
        id: 'dbms-3',
        question: 'Why are B-Tree indexes preferred over Hash indexes in RDBMS?',
        answer: 'B-Trees support both exact-match equality queries and range-based queries (e.g. BETWEEN, >, <), whereas Hash indexes only support exact equality.'
      },
      {
        id: 'dbms-4',
        question: 'Explain the difference between INNER JOIN and LEFT JOIN.',
        answer: 'INNER JOIN returns only rows with matching values in both tables. LEFT JOIN returns all rows from the left table along with matched records from the right (filling NULL for unmatched).'
      }
    ]
  },
  cn: {
    id: 'cn',
    title: 'Computer Networks',
    description: 'OSI model layers, TCP/IP handshake, IP addressing, and routing.',
    difficulty: 'Medium',
    cards: [
      {
        id: 'cn-1',
        question: 'Explain the TCP 3-Way Handshake process.',
        answer: '1. Client sends a SYN packet.\n2. Server responds with SYN-ACK.\n3. Client replies with an ACK to establish a connection.'
      },
      {
        id: 'cn-2',
        question: 'What is the difference between TCP and UDP?',
        answer: 'TCP is connection-oriented, reliable, and guarantees packet delivery/order. UDP is connectionless, lightweight, and faster but does not guarantee delivery.'
      },
      {
        id: 'cn-3',
        question: 'What is Subnetting and why is it used?',
        answer: 'Subnetting partitions a single physical network into logical sub-networks to reduce broadcast traffic and optimize IP allocation.'
      }
    ]
  },
  dl: {
    id: 'dl',
    title: 'Digital Logic',
    description: 'Boolean algebra, logic gates, flip-flops, and sequential logic.',
    difficulty: 'Easy',
    cards: [
      {
        id: 'dl-1',
        question: 'State De Morgan’s Laws in Boolean Algebra.',
        answer: '1. NOT (A AND B) = (NOT A) OR (NOT B)\n2. NOT (A OR B) = (NOT A) AND (NOT B)'
      },
      {
        id: 'dl-2',
        question: 'What is the main difference between Combinational and Sequential circuits?',
        answer: 'Combinational circuit outputs depend solely on current inputs. Sequential circuit outputs depend on current inputs AND past states (uses memory/clock).'
      }
    ]
  },
  aiml: {
    id: 'aiml',
    title: 'Artificial Intelligence & ML',
    description: 'Supervised learning, neural networks, loss functions, and evaluation.',
    difficulty: 'Hard',
    cards: [
      {
        id: 'aiml-1',
        question: 'What is Overfitting and how can it be prevented?',
        answer: 'Overfitting happens when a model memorizes training noise instead of underlying patterns. Prevention: Cross-validation, Regularization (L1/L2), Dropout, and Early Stopping.'
      },
      {
        id: 'aiml-2',
        question: 'What is the difference between Precision and Recall?',
        answer: 'Precision = True Positives / (True Positives + False Positives).\nRecall = True Positives / (True Positives + False Negatives).'
      }
    ]
  }
};

export default function Flashcards({ onOpenDashboard, onOpenDocuments, onOpenUploadPDF }) {
  // Active Deck State
  const [activeDeckKey, setActiveDeckKey] = useState('os');
  const [deckCards, setDeckCards] = useState(SAMPLE_DECKS.os.cards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Performance Rating Trackers
  const [knownCardIds, setKnownCardIds] = useState(new Set());
  const [reviewAgainCardIds, setReviewAgainCardIds] = useState(new Set());

  // AI Flashcard Generation Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [genTopic, setGenTopic] = useState('');
  const [genDifficulty, setGenDifficulty] = useState('Medium');
  const [genCount, setGenCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSuccessMsg, setGenSuccessMsg] = useState('');

  // Safe Navigation Handler Callbacks
  const handleNavDashboard = () => onOpenDashboard && onOpenDashboard();
  const handleNavDocuments = () => onOpenDocuments && onOpenDocuments();
  const handleNavUploadPDF = () => onOpenUploadPDF && onOpenUploadPDF();

  // Switch Active Deck
  const handleSelectDeck = (deckKey) => {
    const targetDeck = SAMPLE_DECKS[deckKey];
    if (!targetDeck) return;

    setActiveDeckKey(deckKey);
    setDeckCards(targetDeck.cards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setGenSuccessMsg('');
  };

  // Flip Card Action
  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  // Previous Card Action
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  // Next Card Action
  const handleNextCard = () => {
    if (currentCardIndex < deckCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  // Shuffle Deck
  const handleShuffleDeck = () => {
    const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
    setDeckCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Restart Study Session
  const handleRestartSession = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Mark "I Know This"
  const handleMarkKnown = () => {
    const currentCard = deckCards[currentCardIndex];
    if (!currentCard) return;

    const newKnown = new Set(knownCardIds);
    const newReview = new Set(reviewAgainCardIds);

    newKnown.add(currentCard.id);
    newReview.delete(currentCard.id);

    setKnownCardIds(newKnown);
    setReviewAgainCardIds(newReview);

    handleNextCard();
  };

  // Mark "Review Again"
  const handleMarkReviewAgain = () => {
    const currentCard = deckCards[currentCardIndex];
    if (!currentCard) return;

    const newKnown = new Set(knownCardIds);
    const newReview = new Set(reviewAgainCardIds);

    newReview.add(currentCard.id);
    newKnown.delete(currentCard.id);

    setKnownCardIds(newKnown);
    setReviewAgainCardIds(newReview);

    handleNextCard();
  };

  // File Upload Input Handler & Validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    setGenSuccessMsg('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Invalid file type. Please upload a PDF document.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError('File size exceeds the 15 MB maximum limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Simulated AI Flashcards Generator
  const handleGenerateFlashcards = (e) => {
    e.preventDefault();
    setFileError('');
    setGenSuccessMsg('');

    if (!genTopic.trim() && !selectedFile) {
      setFileError('Please enter a study topic or attach a PDF file.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);

      const topicName = genTopic.trim() || (selectedFile ? selectedFile.name.replace(/\.pdf$/i, '') : 'AI Study Notes');

      const generatedCards = Array.from({ length: Number(genCount) }).map((_, idx) => ({
        id: `gen-${Date.now()}-${idx}`,
        question: `[${genDifficulty}] ${topicName}: Key Concept #${idx + 1}?`,
        answer: `This is a generated revision answer for concept #${idx + 1} regarding "${topicName}". (Frontend Demo Generated Data)`
      }));

      setDeckCards(generatedCards);
      setActiveDeckKey('custom');
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setGenSuccessMsg(`Generated ${genCount} flashcards for "${topicName}" (${genDifficulty})!`);
    }, 1200);
  };

  // Computed Values
  const activeDeckTitle = activeDeckKey === 'custom' 
    ? 'Generated Flashcards Deck' 
    : (SAMPLE_DECKS[activeDeckKey]?.title || 'Study Deck');

  const currentCard = deckCards[currentCardIndex] || { 
    question: 'No cards available in this deck.', 
    answer: 'Please select a deck from the list below.' 
  };

  const totalCardsCount = deckCards.length;
  const progressPercent = totalCardsCount > 0 ? Math.round(((currentCardIndex + 1) / totalCardsCount) * 100) : 0;
  
  const knownCount = knownCardIds.size;
  const reviewCount = reviewAgainCardIds.size;
  const totalReviewedCount = knownCount + reviewCount;

  return (
    <div className="flashcards-root">
      {/* Scoped CSS Styles */}
      <style>{`
        .flashcards-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #F8F9FD;
          color: #20243A;
          min-height: 100vh;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        /* Top Header Navigation */
        .flashcards-header {
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

        .flashcards-header-brand {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .flashcards-logo {
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

        .flashcards-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #20243A;
          margin: 0 0 0.15rem 0;
        }

        .flashcards-subtitle {
          font-size: 0.85rem;
          color: #77758A;
          margin: 0;
        }

        .flashcards-header-actions {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .flashcards-avatar {
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

        /* Buttons Styling */
        .flashcards-btn {
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

        .flashcards-btn-primary {
          background: #6847E8;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(104, 71, 232, 0.2);
        }

        .flashcards-btn-primary:hover:not(:disabled) {
          background: #5736D7;
          transform: translateY(-1px);
        }

        .flashcards-btn-secondary {
          background: #F8F9FD;
          color: #20243A;
          border: 1px solid #E7E5EF;
        }

        .flashcards-btn-secondary:hover {
          background: #EDE8FF;
          color: #6847E8;
          border-color: #EDE8FF;
        }

        .flashcards-btn-outline {
          background: #FFFFFF;
          color: #20243A;
          border: 1px solid #E7E5EF;
        }

        .flashcards-btn-outline:hover:not(:disabled) {
          border-color: #6847E8;
          color: #6847E8;
        }

        .flashcards-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .flashcards-btn-text {
          background: transparent;
          border: none;
          color: #6847E8;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 0.35rem;
        }

        .flashcards-btn-text:hover {
          background: #EDE8FF;
        }

        /* Main Grid Workspace */
        .flashcards-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 992px) {
          .flashcards-main-grid {
            grid-template-columns: 1fr 340px;
          }
        }

        /* Main Study Area */
        .flashcards-stage {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.02);
          display: flex;
          flex-direction: column;
        }

        .flashcards-stage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .flashcards-deck-badge {
          background: #EDE8FF;
          color: #6847E8;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.3rem 0.75rem;
          border-radius: 0.5rem;
          margin-right: 0.75rem;
        }

        .flashcards-card-counter {
          font-size: 0.85rem;
          color: #77758A;
          font-weight: 600;
        }

        .flashcards-progress-bg {
          width: 100%;
          height: 6px;
          background: #E7E5EF;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .flashcards-progress-fill {
          height: 100%;
          background: #6847E8;
          transition: width 0.3s ease;
        }

        /* 3D Flip Card Container */
        .flashcards-flip-wrapper {
          perspective: 1000px;
          min-height: 280px;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }

        .flashcards-flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 280px;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
        }

        .flashcards-flip-card.flipped {
          transform: rotateY(180deg);
        }

        .flashcards-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 1rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #E7E5EF;
          box-sizing: border-box;
        }

        .flashcards-card-front {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FD 100%);
          border-color: #E7E5EF;
        }

        .flashcards-card-back {
          background: linear-gradient(135deg, #EDE8FF 0%, #FFFFFF 100%);
          border-color: #6847E8;
          transform: rotateY(180deg);
        }

        .flashcards-face-tag {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #77758A;
        }

        .flashcards-face-tag-back {
          color: #6847E8;
        }

        .flashcards-card-text {
          font-size: 1.15rem;
          font-weight: 700;
          color: #20243A;
          line-height: 1.6;
          white-space: pre-line;
          margin: 1rem 0;
          text-align: center;
        }

        .flashcards-hint-text {
          font-size: 0.75rem;
          color: #77758A;
          text-align: center;
        }

        /* Controls Toolbar */
        .flashcards-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        /* Rating Feedback Panel */
        .flashcards-feedback-panel {
          border-top: 1px solid #E7E5EF;
          padding-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .flashcards-feedback-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #77758A;
        }

        .flashcards-feedback-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .flashcards-btn-know {
          background: #E6F4EA;
          color: #137333;
        }

        .flashcards-btn-know:hover {
          background: #CEEAD6;
        }

        .flashcards-btn-review {
          background: #FEF7E0;
          color: #B06000;
        }

        .flashcards-btn-review:hover {
          background: #FCE8B2;
        }

        /* Right Sidebar Widgets */
        .flashcards-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .flashcards-widget {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.25rem;
          box-shadow: 0 4px 14px rgba(32, 36, 58, 0.02);
        }

        .flashcards-widget-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #20243A;
          margin: 0 0 1rem 0;
        }

        .flashcards-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          text-align: center;
        }

        .flashcards-stat-box {
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.75rem;
          padding: 0.75rem 0.25rem;
          display: flex;
          flex-direction: column;
        }

        .flashcards-stat-num {
          font-size: 1.2rem;
          font-weight: 800;
          color: #137333;
        }

        .flashcards-stat-num.review {
          color: #B06000;
        }

        .flashcards-stat-num.purple {
          color: #6847E8;
        }

        .flashcards-stat-lbl {
          font-size: 0.7rem;
          color: #77758A;
          margin-top: 0.25rem;
        }

        .flashcards-recs-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .flashcards-rec-item {
          font-size: 0.8rem;
          color: #77758A;
          line-height: 1.4;
          padding: 0.6rem;
          background: #F8F9FD;
          border-radius: 0.5rem;
          border-left: 3px solid #6847E8;
        }

        .flashcards-rec-item.warning {
          border-left-color: #B06000;
          background: #FEF7E0;
        }

        .flashcards-rec-item.success {
          border-left-color: #137333;
          background: #E6F4EA;
        }

        /* AI Generator Form */
        .flashcards-gen-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .flashcards-field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .flashcards-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .flashcards-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #20243A;
        }

        .flashcards-input, .flashcards-select, .flashcards-file-input {
          width: 100%;
          padding: 0.55rem 0.75rem;
          background: #F8F9FD;
          border: 1px solid #E7E5EF;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          color: #20243A;
          outline: none;
          box-sizing: border-box;
        }

        .flashcards-input:focus, .flashcards-select:focus {
          border-color: #6847E8;
          background: #FFFFFF;
        }

        .flashcards-file-name {
          font-size: 0.7rem;
          color: #6847E8;
          font-weight: 600;
        }

        .flashcards-btn-generate {
          width: 100%;
          background: #6847E8;
          color: #FFFFFF;
          margin-top: 0.25rem;
        }

        .flashcards-btn-generate:hover:not(:disabled) {
          background: #5736D7;
        }

        .flashcards-alert {
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .flashcards-alert.error {
          background: #FCE8E6;
          color: #C5221F;
        }

        .flashcards-alert.success {
          background: #E6F4EA;
          color: #137333;
        }

        /* Subject Decks Grid */
        .flashcards-decks-section {
          margin-top: 1.5rem;
        }

        .flashcards-section-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #20243A;
          margin: 0 0 1rem 0;
        }

        .flashcards-decks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .flashcards-deck-card {
          background: #FFFFFF;
          border: 1px solid #E7E5EF;
          border-radius: 1rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease;
        }

        .flashcards-deck-card:hover {
          box-shadow: 0 6px 16px rgba(32, 36, 58, 0.06);
          border-color: rgba(104, 71, 232, 0.4);
        }

        .flashcards-deck-card.selected {
          border-color: #6847E8;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8F9FD 100%);
          box-shadow: 0 4px 14px rgba(104, 71, 232, 0.12);
        }

        .flashcards-deck-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .flashcards-deck-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #20243A;
          margin: 0;
        }

        .flashcards-diff-pill {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 0.35rem;
          text-transform: uppercase;
        }

        .flashcards-diff-pill.easy {
          background: #E6F4EA;
          color: #137333;
        }

        .flashcards-diff-pill.medium {
          background: #FEF7E0;
          color: #B06000;
        }

        .flashcards-diff-pill.hard {
          background: #FCE8E6;
          color: #C5221F;
        }

        .flashcards-deck-desc {
          font-size: 0.8rem;
          color: #77758A;
          margin: 0 0 1rem 0;
          line-height: 1.4;
        }

        .flashcards-deck-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #E7E5EF;
          padding-top: 0.75rem;
        }

        .flashcards-deck-meta {
          font-size: 0.75rem;
          font-weight: 600;
          color: #77758A;
        }
      `}</style>

      {/* Header Bar */}
      <header className="flashcards-header">
        <div className="flashcards-header-brand">
          <div className="flashcards-logo">L</div>
          <div>
            <h1 className="flashcards-title">Learning AI • Flashcards</h1>
            <p className="flashcards-subtitle">Learn smarter. Revise faster.</p>
          </div>
        </div>

        <div className="flashcards-header-actions">
          <button type="button" className="flashcards-btn flashcards-btn-secondary" onClick={handleNavDashboard}>
            📌 Dashboard
          </button>
          <button type="button" className="flashcards-btn flashcards-btn-secondary" onClick={handleNavDocuments}>
            📁 My Documents
          </button>
          <button type="button" className="flashcards-btn flashcards-btn-secondary" onClick={handleNavUploadPDF}>
            ⬆️ Upload PDF
          </button>
          <div className="flashcards-avatar" title="Student Profile">
            S
          </div>
        </div>
      </header>

      {/* Main Flashcard Stage & Sidebar Grid */}
      <div className="flashcards-main-grid">
        {/* Flashcard Study Stage */}
        <section className="flashcards-stage">
          <div className="flashcards-stage-header">
            <div>
              <span className="flashcards-deck-badge">{activeDeckTitle}</span>
              <span className="flashcards-card-counter">
                Card {currentCardIndex + 1} of {totalCardsCount}
              </span>
            </div>

            <div>
              <button type="button" className="flashcards-btn-text" onClick={handleShuffleDeck} title="Shuffle Cards">
                🔀 Shuffle
              </button>
              <button type="button" className="flashcards-btn-text" onClick={handleRestartSession} title="Restart Session">
                🔄 Restart
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flashcards-progress-bg">
            <div className="flashcards-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          {/* Flip Flashcard Workspace */}
          <div className="flashcards-flip-wrapper" onClick={handleFlipCard}>
            <div className={`flashcards-flip-card ${isFlipped ? 'flipped' : ''}`}>
              {/* Card Front */}
              <div className="flashcards-card-face flashcards-card-front">
                <span className="flashcards-face-tag">QUESTION / CONCEPT</span>
                <p className="flashcards-card-text">{currentCard.question}</p>
                <span className="flashcards-hint-text">💡 Click or tap to flip card</span>
              </div>

              {/* Card Back */}
              <div className="flashcards-card-face flashcards-card-back">
                <span className="flashcards-face-tag flashcards-face-tag-back">ANSWER / EXPLANATION</span>
                <p className="flashcards-card-text">{currentCard.answer}</p>
                <span className="flashcards-hint-text">💡 Click or tap to flip back</span>
              </div>
            </div>
          </div>

          {/* Stage Controls */}
          <div className="flashcards-controls">
            <button
              type="button"
              className="flashcards-btn flashcards-btn-outline"
              disabled={currentCardIndex === 0}
              onClick={handlePrevCard}
            >
              ⬅️ Previous
            </button>

            <button type="button" className="flashcards-btn flashcards-btn-primary" onClick={handleFlipCard}>
              🔄 Flip Card
            </button>

            <button
              type="button"
              className="flashcards-btn flashcards-btn-outline"
              disabled={currentCardIndex === totalCardsCount - 1}
              onClick={handleNextCard}
            >
              Next ➡️
            </button>
          </div>

          {/* Feedback & Rating Buttons */}
          <div className="flashcards-feedback-panel">
            <span className="flashcards-feedback-label">Rate your recall for this card:</span>
            <div className="flashcards-feedback-buttons">
              <button type="button" className="flashcards-btn flashcards-btn-know" onClick={handleMarkKnown}>
                ✅ I Know This
              </button>
              <button type="button" className="flashcards-btn flashcards-btn-review" onClick={handleMarkReviewAgain}>
                🔁 Review Again
              </button>
            </div>
          </div>
        </section>

        {/* Sidebar Widgets Column */}
        <aside className="flashcards-sidebar">
          {/* Performance Summary Widget */}
          <div className="flashcards-widget">
            <h3 className="flashcards-widget-title">📊 Study Performance</h3>
            <div className="flashcards-stats-grid">
              <div className="flashcards-stat-box">
                <span className="flashcards-stat-num">{knownCount}</span>
                <span className="flashcards-stat-lbl">Known</span>
              </div>
              <div className="flashcards-stat-box">
                <span className="flashcards-stat-num review">{reviewCount}</span>
                <span className="flashcards-stat-lbl">Review Again</span>
              </div>
              <div className="flashcards-stat-box">
                <span className="flashcards-stat-num purple">{totalReviewedCount}</span>
                <span className="flashcards-stat-lbl">Reviewed</span>
              </div>
              <div className="flashcards-stat-box">
                <span className="flashcards-stat-num purple">{progressPercent}%</span>
                <span className="flashcards-stat-lbl">Progress</span>
              </div>
            </div>
          </div>

          {/* Personalized Recommendations Widget */}
          <div className="flashcards-widget">
            <h3 className="flashcards-widget-title">💡 Recommended for You</h3>
            <ul className="flashcards-recs-list">
              {reviewCount > 0 ? (
                <li className="flashcards-rec-item warning">
                  ⚠️ You have <strong>{reviewCount}</strong> cards marked for review. Run a quick repeat session to strengthen recall.
                </li>
              ) : (
                <li className="flashcards-rec-item success">
                  🌟 Excellent recall! No urgent cards marked for review in this session.
                </li>
              )}
              {activeDeckKey === 'os' && (
                <li className="flashcards-rec-item">
                  Suggested Next Deck: Try <strong>Database Management Systems</strong> to practice ACID transactions.
                </li>
              )}
              <li className="flashcards-rec-item">
                Study Tip: Spaced repetition with 10-minute active recall yields optimal exam performance.
              </li>
            </ul>
          </div>

          {/* Create Flashcards from PDF Generator Widget */}
          <div className="flashcards-widget">
            <h3 className="flashcards-widget-title">✨ Create Flashcards with AI</h3>

            {fileError && <div className="flashcards-alert error">{fileError}</div>}
            {genSuccessMsg && <div className="flashcards-alert success">{genSuccessMsg}</div>}

            <form onSubmit={handleGenerateFlashcards} className="flashcards-gen-form">
              <div className="flashcards-field">
                <label className="flashcards-label">Upload Study PDF (Optional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="flashcards-file-input"
                  onChange={handleFileChange}
                />
                {selectedFile && <span className="flashcards-file-name">📄 {selectedFile.name}</span>}
              </div>

              <div className="flashcards-field">
                <label className="flashcards-label">Topic / Keywords</label>
                <input
                  type="text"
                  placeholder="e.g. Memory Allocation, Page Replacement"
                  className="flashcards-input"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                />
              </div>

              <div className="flashcards-field-row">
                <div className="flashcards-field">
                  <label className="flashcards-label">Difficulty</label>
                  <select
                    className="flashcards-select"
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="flashcards-field">
                  <label className="flashcards-label">Card Count</label>
                  <select
                    className="flashcards-select"
                    value={genCount}
                    onChange={(e) => setGenCount(e.target.value)}
                  >
                    <option value={5}>5 Cards</option>
                    <option value={10}>10 Cards</option>
                    <option value={15}>15 Cards</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="flashcards-btn flashcards-btn-generate" disabled={isGenerating}>
                {isGenerating ? '⌛ Generating Flashcards...' : '⚡ Generate Flashcards'}
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Select Subject Deck Section */}
      <section className="flashcards-decks-section">
        <h2 className="flashcards-section-title">Select a Subject Deck</h2>
        <div className="flashcards-decks-grid">
          {Object.keys(SAMPLE_DECKS).map((key) => {
            const deck = SAMPLE_DECKS[key];
            const isSelected = activeDeckKey === key;

            return (
              <div key={key} className={`flashcards-deck-card ${isSelected ? 'selected' : ''}`}>
                <div className="flashcards-deck-header">
                  <h3 className="flashcards-deck-title">{deck.title}</h3>
                  <span className={`flashcards-diff-pill ${deck.difficulty.toLowerCase()}`}>
                    {deck.difficulty}
                  </span>
                </div>
                <p className="flashcards-deck-desc">{deck.description}</p>
                <div className="flashcards-deck-footer">
                  <span className="flashcards-deck-meta">{deck.cards.length} Cards</span>
                  <button
                    type="button"
                    className={`flashcards-btn ${isSelected ? 'flashcards-btn-primary' : 'flashcards-btn-outline'}`}
                    onClick={() => handleSelectDeck(key)}
                  >
                    {isSelected ? 'Currently Studying' : 'Start Studying'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}