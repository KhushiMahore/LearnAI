
import { useState } from "react";

import LoginPage from "./LoginPage.jsx";
import Dashboard from "./Dashboard.jsx";
import MyDocuments from "./MyDocuments.jsx";
import RegisterPage from "./RegisterPage.jsx";
import UploadPDF from "./UploadPDF.jsx";
import AIChat from "./AIChat.jsx";
import AISummarizer from "./AISummarizer.jsx";
import QuizGenerator from "./QuizGenerator.jsx";
import Flashcards from "./Flashcards.jsx";
import Progress from "./Progress.jsx";
import ChatHistory from "./ChatHistory.jsx";
import Settings from "./Settings.jsx"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  // Register Page
  if (!isLoggedIn && currentPage === "register") {
    return (
      <RegisterPage
        onNavigate={(page) => setCurrentPage(page)}
      />
    );
  }

  // Login Page
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setCurrentPage("dashboard");
        }}
        onCreateAccount={() => setCurrentPage("register")}
      />
    );
  }

  // My Documents Page
  if (currentPage === "documents") {
    return (
      <MyDocuments
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  // Upload PDF Page
  if (currentPage === "upload") {
    return (
      <UploadPDF
        onNavigate={(page) => setCurrentPage(page)}
        onOpenDashboard={() => setCurrentPage("dashboard")}
        onOpenDocuments={() => setCurrentPage("documents")}
        onOpenUploadPDF={() => setCurrentPage("upload")}
      />
    );
  }

  // AI Chat Page
  if (currentPage === "ai-chat") {
    return (
      <AIChat
        onOpenUploadPDF={() => setCurrentPage("upload")}
      />
    );
  }

  // AI Summarizer Page
  if (currentPage === "ai-summarizer") {
    return (
      <AISummarizer
        onNavigate={(page) => setCurrentPage(page)}
        onOpenDashboard={() => setCurrentPage("dashboard")}
        onOpenDocuments={() => setCurrentPage("documents")}
        onOpenUploadPDF={() => setCurrentPage("upload")}
      />
    );
  }

  // Quiz Generator Page
  if (currentPage === "quiz-generator") {
    return <QuizGenerator />;
  }
  //Flashcard page
  if (currentPage === "flashcards") {
  return (
    <Flashcards
      onOpenDashboard={() => setCurrentPage("dashboard")}
      onOpenDocuments={() => setCurrentPage("documents")}
      onOpenUploadPDF={() => setCurrentPage("upload")}
    />
  );
}
//Progress page
if (currentPage === "progress") {
  return (
    <Progress
      onOpenDashboard={() => setCurrentPage("dashboard")}
      onOpenDocuments={() => setCurrentPage("documents")}
      onOpenUploadPDF={() => setCurrentPage("upload")}
    />
  );
}

//CHAT PAGE
if (currentPage === "ChatHistory"){
  return (
    <ChatHistory
    onOpenDashboard={() => navigateTo('dashboard')}
    onOpenAIChat={() => navigateTo('ai-chat')}
    onOpenDocuments={() => navigateTo('documents')}
  />
);
}
{currentPage === 'settings' && (
  <Settings
    onOpenDashboard={() => navigateTo('dashboard')}
    onOpenDocuments={() => navigateTo('documents')}
    onOpenUploadPDF={() => navigateTo('upload')}
    onOpenAIChat={() => navigateTo('ai-chat')}
    
  />
)}
  // Dashboard Page
  return (
    <Dashboard
      onOpenDocuments={() => setCurrentPage("documents")}
      onOpenUploadPDF={() => setCurrentPage("upload")}
      onOpenAIChat={() => setCurrentPage("ai-chat")}
      onOpenAISummarizer={() => setCurrentPage("ai-summarizer")}
      onOpenQuizGenerator={() => setCurrentPage("quiz-generator")}
    />
  );
}



export default App;
