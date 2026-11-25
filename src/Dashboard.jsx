import React, { useState, useEffect, useRef } from 'react';
import { 
  BrowserRouter as Router, Routes, Route, Navigate, 
  useLocation, useNavigate, NavLink, Outlet 
} from 'react-router-dom';
import { 
  Home, Folder, UploadCloud, MessageSquare, FileText, 
  Target, Layers, BarChart2, History, Settings as SettingsIcon, LogOut,
  Search, Bell, Globe, Menu, X, BookOpen, Sparkles,
  ChevronRight, File, ArrowRight, Check, User
} from 'lucide-react';
import MyDocuments from "./MyDocuments.jsx";
import UploadPDF from "./UploadPDF.jsx";
import AIChat from "./AIChat.jsx";
import AISummarizer from "./AISummarizer.jsx";
import QuizGenerator from "./QuizGenerator.jsx";
import Flashcards from "./Flashcards.jsx";
import Progress from "./Progress.jsx";
import ChatHistory from "./ChatHistory.jsx";
import Settings from './Settings.jsx';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'My Documents', path: '/documents', icon: Folder },
  { name: 'Upload PDF', path: '/upload', icon: UploadCloud },
  { name: 'Ask AI', path: '/ask-ai', icon: MessageSquare },
  { name: 'AI Summarizer', path: '/ai-summarizer', icon: FileText },
  { name: 'Quiz Generator', path: '/quiz', icon: Target },
  { name: 'Flashcards', path: '/flashcards', icon: Layers },
  { name: 'Progress', path: '/progress', icon: BarChart2 },
  { name: 'Chat History', path: '/chat', icon: History },
];

const STATS_DATA = [
  { title: 'Total Documents', value: '12', icon: Folder },
  { title: 'Quizzes Completed', value: '28', icon: Target },
  { title: 'Avg. Quiz Score', value: '86%', icon: BarChart2 },
  { title: 'Flashcards Reviewed', value: '450', icon: Layers },
];

const RECENT_DOCS = [
  { id: 1, name: 'Machine_Learning_Ch4.pdf', date: 'Oct 12, 2026', pages: 34 },
  { id: 2, name: 'Data_Structures_Notes.pdf', date: 'Oct 10, 2026', pages: 12 },
  { id: 3, name: 'OS_Midterm_Review.pdf', date: 'Oct 08, 2026', pages: 56 },
];

const PlaceholderPage = ({ title, icon: Icon, description }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="p-4 bg-[#EDE8FF] text-[#6847E8] rounded-2xl mb-4 shadow-sm border border-[#E7E5EF]">
        <Icon size={48} />
      </div>
      <h2 className="text-2xl font-bold text-[#20243A] mb-2">{title}</h2>
      <p className="text-[#77758A] max-w-md">
        {description || "This feature is currently under development. Check back soon for updates!"}
      </p>
    </div>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#20243A]/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#E7E5EF]
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-[#E7E5EF] justify-between shrink-0">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-[#6847E8] p-1.5 rounded-lg text-white">
              <Sparkles size={18} />
            </div>
            <span className="text-lg font-bold text-[#20243A]">Learning AI</span>
          </div>
          <button className="md:hidden text-[#77758A]" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close on mobile click
              className={({ isActive }) => `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#EDE8FF] text-[#6847E8]' 
                  : 'text-[#77758A] hover:bg-gray-50 hover:text-[#20243A]'
              }`}
            >
              <item.icon size={18} className="mr-3 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#E7E5EF] space-y-1 shrink-0">
          <NavLink 
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-[#EDE8FF] text-[#6847E8]' 
                : 'text-[#77758A] hover:bg-gray-50 hover:text-[#20243A]'
            }`}
          >
            <SettingsIcon size={18} className="mr-3 shrink-0" />
            Settings
          </NavLink>
          <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} className="mr-3 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

const Topbar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'lang', 'notifications', 'profile'
  const navigate = useNavigate();
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/documents?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E7E5EF] flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center flex-1">
        <button 
          onClick={toggleSidebar}
          className="mr-4 md:hidden text-[#77758A] hover:text-[#20243A] focus:outline-none"
        >
          <Menu size={24} />
        </button>
        
        {/* Breadcrumb / Title */}
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-[#20243A]">Dashboard</h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="ml-auto sm:ml-8 flex-1 max-w-md hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-[#77758A]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your documents, summaries..."
              className="block w-full pl-10 pr-3 py-2 border border-[#E7E5EF] rounded-lg bg-[#F8F9FD] text-sm text-[#20243A] placeholder-[#77758A] focus:outline-none focus:ring-1 focus:ring-[#6847E8] focus:border-[#6847E8] transition-shadow"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 ml-4 dropdown-container relative">
        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => toggleDropdown('lang')}
            className={`text-[#77758A] hover:text-[#20243A] p-2 rounded-full hover:bg-gray-50 transition-colors ${activeDropdown === 'lang' ? 'bg-gray-100 text-[#20243A]' : ''}`}
            title="Language"
          >
            <Globe size={20} />
          </button>
          {activeDropdown === 'lang' && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E7E5EF] py-1 z-50">
              <div className="px-4 py-2 text-xs font-semibold text-[#77758A] uppercase tracking-wider border-b border-[#E7E5EF]">Select Language</div>
              <button className="w-full text-left px-4 py-2 text-sm text-[#20243A] hover:bg-[#F8F9FD] flex items-center justify-between">
                English <Check size={16} className="text-[#6847E8]" />
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-[#77758A] hover:bg-[#F8F9FD]">Spanish</button>
              <button className="w-full text-left px-4 py-2 text-sm text-[#77758A] hover:bg-[#F8F9FD]">French</button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => toggleDropdown('notifications')}
            className={`text-[#77758A] hover:text-[#20243A] p-2 rounded-full hover:bg-gray-50 transition-colors relative ${activeDropdown === 'notifications' ? 'bg-gray-100 text-[#20243A]' : ''}`}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#6847E8] rounded-full border border-white"></span>
          </button>
          {activeDropdown === 'notifications' && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#E7E5EF] py-1 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E7E5EF] flex justify-between items-center bg-[#F8F9FD]">
                <h3 className="font-semibold text-[#20243A] text-sm">Notifications</h3>
                <span className="text-xs text-[#6847E8] font-medium cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 border-b border-[#E7E5EF] hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-[#20243A]"><span className="font-medium">AI Summary</span> for "Machine_Learning_Ch4.pdf" is ready!</p>
                  <p className="text-xs text-[#77758A] mt-1">2 hours ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-[#20243A]">Reminder: You have a quiz pending for Data Structures.</p>
                  <p className="text-xs text-[#77758A] mt-1">Yesterday</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-[#E7E5EF] text-center">
                <button className="text-xs text-[#77758A] hover:text-[#6847E8] font-medium">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => toggleDropdown('profile')}
            className={`h-8 w-8 rounded-full bg-[#6847E8] text-white flex items-center justify-center font-semibold text-sm cursor-pointer shadow-sm hover:opacity-90 transition-opacity ${activeDropdown === 'profile' ? 'ring-2 ring-offset-2 ring-[#6847E8]' : ''}`}
            title="Profile"
          >
            AL
          </div>
          {activeDropdown === 'profile' && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E7E5EF] py-1 z-50">
              <div className="px-4 py-3 border-b border-[#E7E5EF]">
                <p className="text-sm font-semibold text-[#20243A]">Alex Learner</p>
                <p className="text-xs text-[#77758A] truncate">alex.learner@university.edu</p>
              </div>
              <div className="py-1">
                <button onClick={() => { navigate('/profile'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-[#20243A] hover:bg-[#F8F9FD] flex items-center gap-2">
                  <User size={16} className="text-[#77758A]" /> My Profile
                </button>
                <button onClick={() => { navigate('/settings'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-[#20243A] hover:bg-[#F8F9FD] flex items-center gap-2">
                  <Settings size={16} className="text-[#77758A]" /> Settings
                </button>
              </div>
              <div className="py-1 border-t border-[#E7E5EF]">
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const WelcomeBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#20243A]">Welcome back, Alex! 👋</h2>
      <p className="text-[#77758A] mt-1 mb-6">Ready to learn something new today?</p>
      
      <div className="bg-[#EDE8FF] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-sm border border-[#E7E5EF]">
        <div className="relative z-10 sm:max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#20243A] mb-3">Learn smarter, not harder.</h3>
          <p className="text-[#20243A] opacity-80 mb-6 text-sm sm:text-base leading-relaxed">
            Upload your course PDFs and let Learning AI instantly generate summaries, flashcards, and interactive quizzes to supercharge your study sessions.
          </p>
         
<button
  onClick={() => navigate('/upload')}
  className="text-sm font-medium text-[#6847E8] hover:underline"
>
  Go to Upload Page
</button>

        </div>
        
        {/* Decorative Graphic */}
        <div className="hidden sm:block absolute right-[-5%] lg:right-[5%] opacity-90">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl"></div>
            <BookOpen size={120} className="text-[#6847E8] transform -rotate-12 absolute top-4 right-4" />
            <Sparkles size={40} className="text-[#6847E8] absolute bottom-0 left-0 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, path }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => path && navigate(path)}
      className={`bg-white p-5 rounded-xl border border-[#E7E5EF] shadow-sm flex items-start justify-between ${path ? 'cursor-pointer hover:border-[#6847E8] hover:shadow-md transition-all' : ''}`}
    >
      <div>
        <p className="text-sm font-medium text-[#77758A] mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-[#20243A]">{value}</h4>
      </div>
      <div className="p-2.5 bg-[#F8F9FD] rounded-lg text-[#6847E8]">
        <Icon size={20} />
      </div>
    </div>
  );
};

const RecentDocuments = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-[#E7E5EF] rounded-xl shadow-sm flex flex-col h-full">
      <div className="p-5 border-b border-[#E7E5EF] flex items-center justify-between">
        <h3 className="font-bold text-[#20243A]">Recent Documents</h3>
        <button 
          onClick={() => navigate('/documents')}
          className="text-sm text-[#6847E8] font-medium hover:underline focus:outline-none"
        >
          View All
        </button>
      </div>
      <div className="p-2 flex-1">
        {RECENT_DOCS.length > 0 ? (
          <ul className="space-y-1">
            {RECENT_DOCS.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between p-3 hover:bg-[#F8F9FD] rounded-lg transition-colors group cursor-pointer" onClick={() => navigate(`/documents/${doc.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#EDE8FF] text-[#6847E8] rounded-lg">
                    <File size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#20243A] truncate w-40 sm:w-56">{doc.name}</p>
                    <p className="text-xs text-[#77758A] mt-0.5">Opened {doc.date} • {doc.pages} pages</p>
                  </div>
                </div>
                <button 
                  className="text-[#77758A] p-2 hover:bg-white hover:shadow-sm rounded-md hover:text-[#6847E8] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Open Document"
                >
                  <ChevronRight size={18} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-8 text-center px-4">
            <div className="p-3 bg-[#F8F9FD] text-[#77758A] rounded-full mb-3">
              <Folder size={24} />
            </div>
            <p className="text-sm font-medium text-[#20243A]">No documents yet</p>
            <p className="text-xs text-[#77758A] mt-1 mb-4">Upload your first PDF to get started.</p>
            <button 
              onClick={() => navigate('/upload')}
              className="text-sm font-medium text-[#6847E8] hover:underline"
            >
              Go to Upload Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const RecommendationCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-[#E7E5EF] rounded-xl shadow-sm flex flex-col h-full">
      <div className="p-5 border-b border-[#E7E5EF]">
        <h3 className="font-bold text-[#20243A]">Recommended for You</h3>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="bg-[#F8F9FD] border border-[#E7E5EF] p-4 rounded-xl mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-[#6847E8]">
            <Target size={64} />
          </div>
          <div className="relative z-10">
            <span className="inline-block px-2 py-1 bg-[#EDE8FF] text-[#6847E8] text-xs font-bold rounded-md mb-2">Needs Review</span>
            <h4 className="font-semibold text-[#20243A] mb-1">Operating Systems: Deadlocks</h4>
            <p className="text-sm text-[#77758A] mb-4">You scored 65% on this quiz topic recently. Review the AI summary and re-take the quiz to improve your mastery.</p>
            <button 
              onClick={() => navigate('/quiz')}
              className="flex items-center text-sm font-medium text-[#6847E8] hover:text-[#5233c7] transition-colors focus:outline-none"
            >
              Start Review Session <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
        
        <div className="mt-auto cursor-pointer group" onClick={() => navigate('/progress')}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#77758A] group-hover:text-[#20243A] transition-colors">Daily Goal: 30 mins</span>
            <span className="font-medium text-[#20243A]">12 mins completed</span>
          </div>
          <div className="w-full bg-[#E7E5EF] h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#6847E8] h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-sans flex text-[#20243A]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar toggleSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Main Content Area - Renders the active route's component */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  return (
    <div className="fade-in">
      <WelcomeBanner />
      
      {/* Stats Grid - Now interactive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard title="Total Documents" value="12" icon={Folder} path="/documents" />
        <StatCard title="Quizzes Completed" value="28" icon={Target} path="/progress" />
        <StatCard title="Avg. Quiz Score" value="86%" icon={BarChart2} path="/progress" />
        <StatCard title="Flashcards Reviewed" value="450" icon={Layers} path="/flashcards" />
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDocuments />
        <RecommendationCard />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Layout Wrapping Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          
          {/* Functional Placeholders for remaining required routes */}
<Route path="/documents" element={<MyDocuments />} />
          <Route path="/documents/:id" element={<PlaceholderPage title="Document Viewer" icon={FileText} description="The PDF viewer and AI interaction panel will load here." />} />
          <Route
  path="/upload"
  element={<UploadPDF />}
/>
          <Route path="/ask-ai" element={<AIChat />} />
         <Route path="/ai-summarizer" element={<AISummarizer />} />
        <Route path="/quiz" element={<QuizGenerator />} />
          <Route path="/flashcards" element={<Flashcards/>} />
          <Route path="/progress" element={<Progress/>} />
          <Route path="/chat" element={<ChatHistory />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" icon={Settings} description="Manage your profile, subscription, theme preferences, and API connections." />} />
          <Route path="/profile" element={<PlaceholderPage title="My Profile" icon={User} description="View your student profile and learning achievements." />} />
        </Route>

        {/* Catch-all for 404s */}
        <Route path="*" element={
          <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-4">
             <div className="text-center">
                <h2 className="text-2xl font-bold text-[#20243A] mb-2">404 - Page Not Found</h2>
                <p className="text-[#77758A] mb-6">The page you are looking for doesn't exist.</p>
                <NavLink to="/dashboard" className="px-5 py-2.5 bg-[#6847E8] text-white rounded-lg font-medium">Return to Dashboard</NavLink>
             </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}