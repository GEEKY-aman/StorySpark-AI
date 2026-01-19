import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { PlusCircle, LayoutDashboard, Sparkles, AlertTriangle, Github, LayoutGrid, Youtube } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import CreateVideoPage from './pages/CreateVideoPage';
import EditorPage from './pages/EditorPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import { Story } from './types';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] p-6 text-white">
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[48px] p-12 text-center backdrop-blur-3xl shadow-2xl">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <AlertTriangle className="text-red-500" size={48} />
            </div>
            <h1 className="text-3xl font-black mb-4 italic">Studio Error</h1>
            <p className="text-white/50 mb-10 text-sm leading-relaxed">
              We encountered a hitch in the magic. <br/>
              <code className="text-red-400 font-mono block mt-4 bg-red-500/5 p-4 rounded-3xl border border-red-500/10">{this.state.error?.message}</code>
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-white text-slate-900 py-5 rounded-[24px] font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Back to Start
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Navbar = () => {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');
  const isAuth = location.pathname.startsWith('/auth');

  if (isEditor || isAuth) return null; // Hide navbar in editor and auth for max focus

  return (
    <nav className="glass sticky top-0 z-[60] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 p-2.5 rounded-2xl text-white group-hover:rotate-[15deg] transition-transform duration-500 shadow-xl shadow-slate-200">
              <Sparkles size={24} className="text-amber-400" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">StorySpark<span className="text-violet-600">.</span></span>
          </Link>
          <div className="flex items-center gap-8 md:gap-10">
            <Link to="/dashboard" className="hidden sm:flex text-slate-500 hover:text-slate-900 font-black text-xs uppercase tracking-widest items-center gap-2 transition-all group">
              <LayoutGrid size={16} className="group-hover:rotate-90 transition-transform duration-500" />
              Library
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-slate-900 hover:text-violet-600 font-black text-xs uppercase tracking-widest transition-colors px-4">
                Log In
              </Link>
              <Link to="/create" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">
                <PlusCircle size={20} />
                Create
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('storyspark_stories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('storyspark_stories', JSON.stringify(stories));
    } catch (e) {}
  }, [stories]);

  const addStory = (story: Story) => setStories(prev => [story, ...prev]);
  const updateStory = (updated: Story) => setStories(prev => prev.map(s => s.id === updated.id ? updated : s));

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/create" element={<CreateVideoPage onStoryCreated={addStory} />} />
              <Route path="/editor/:id" element={<EditorPage stories={stories} onUpdate={updateStory} />} />
              <Route path="/dashboard" element={<DashboardPage stories={stories} />} />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100"><Sparkles size={20} className="text-violet-600" /></div>
                 <span className="font-black text-xl tracking-tighter">StorySpark AI</span>
              </div>
              <p className="text-slate-400 text-sm font-medium">© 2024 StorySpark AI. Direct-to-YouTube Kids Content Engine.</p>
              <div className="flex gap-6 text-slate-300">
                <Github size={20} className="hover:text-slate-900 transition-colors cursor-pointer" />
                <Youtube size={20} className="hover:text-red-600 transition-colors cursor-pointer" />
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
