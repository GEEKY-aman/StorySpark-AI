import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowRight, Github, Chrome, ShieldCheck, Loader2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob w-[600px] h-[600px] bg-violet-200/30 -top-40 -left-20 animate-float" />
      <div className="blob w-[500px] h-[500px] bg-pink-200/30 bottom-[-10%] right-[-10%] animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-6xl w-full bg-white rounded-[56px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* Left Side: Marketing/Visual */}
        <div className="md:w-1/2 bg-slate-900 p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-20 left-20 w-40 h-40 border border-white/20 rounded-full animate-float" />
             <div className="absolute bottom-40 right-10 w-64 h-64 border border-white/10 rounded-[64px] rotate-12 animate-float" style={{ animationDelay: '3s' }} />
          </div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-20 group w-fit">
              <div className="bg-white p-2.5 rounded-2xl text-slate-900 group-hover:rotate-[15deg] transition-transform duration-500 shadow-xl">
                <Sparkles size={24} className="text-violet-600" />
              </div>
              <span className="font-black text-2xl tracking-tighter">StorySpark<span className="text-violet-400">.</span></span>
            </Link>

            <h2 className="text-5xl font-black mb-8 leading-[1.1] tracking-tight">
              Join the future of <br />
              <span className="text-violet-400 italic text-6xl">storytelling.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium max-w-sm leading-relaxed italic">
              Create, edit and share magical 5-minute animated stories for the next generation.
            </p>
          </div>

          <div className="relative z-10 space-y-6 pt-12">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest text-white">Safe & Secure</p>
                <p className="text-xs text-slate-500 font-bold">Kid-friendly content generation by default.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 md:p-20 bg-white">
          <div className="max-w-sm mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                {isLogin ? 'Welcome back!' : 'Start for free'}
              </h1>
              <p className="text-slate-500 font-medium">
                {isLogin ? 'Login to your creator dashboard' : 'Create your account in seconds'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      required 
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-100 focus:bg-white p-5 pl-14 rounded-[24px] outline-none font-bold transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-100 focus:bg-white p-5 pl-14 rounded-[24px] outline-none font-bold transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                  {isLogin && <button type="button" className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-100 focus:bg-white p-5 pl-14 rounded-[24px] outline-none font-bold transition-all shadow-inner"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-4 text-slate-300">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
                <Chrome size={20} className="text-slate-600" />
                <span className="font-bold text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
                <Github size={20} className="text-slate-600" />
                <span className="font-bold text-sm">Github</span>
              </button>
            </div>

            <p className="mt-12 text-center text-slate-500 font-bold text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-violet-600 hover:underline decoration-2 underline-offset-4"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
