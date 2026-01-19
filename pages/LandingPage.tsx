import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Youtube, Wand2, Star, Clock, Zap, ShieldCheck, ArrowRight, MousePointer2, Heart, Music, Video, Moon } from 'lucide-react';

const LandingPage: React.FC = () => {
  const samplePrompts = [
    { text: "A brave little mouse discovering a cheese planet.", icon: "🧀", color: "bg-amber-50", accent: "text-amber-500" },
    { text: "A robot who learns to paint rainbows.", icon: "🎨", color: "bg-blue-50", accent: "text-blue-500" },
    { text: "A dragon who loved strawberry ice cream.", icon: "🍦", color: "bg-pink-50", accent: "text-pink-500" },
    { text: "A submarine with a choir of singing whales.", icon: "🐋", color: "bg-cyan-50", accent: "text-cyan-500" }
  ];

  return (
    <div className="relative overflow-hidden bg-white selection:bg-violet-100">
      {/* Magical Background Particles */}
      <div className="blob w-[700px] h-[700px] bg-violet-200/40 -top-60 -left-40 animate-float" style={{ animationDuration: '12s' }} />
      <div className="blob w-[600px] h-[600px] bg-pink-200/40 top-[15%] -right-40 animate-float" style={{ animationDuration: '15s', animationDelay: '2s' }} />
      <div className="blob w-[500px] h-[500px] bg-amber-100/40 bottom-20 left-[10%] animate-float" style={{ animationDuration: '10s', animationDelay: '4s' }} />

      {/* Floating Elements */}
      <div className="star-float top-[15%] left-[10%] text-amber-400 opacity-40"><Star size={32} fill="currentColor" /></div>
      <div className="star-float top-[40%] right-[15%] text-violet-400 opacity-40 animate-float" style={{ animationDelay: '1s' }}><Sparkles size={48} /></div>
      <div className="star-float bottom-[20%] left-[20%] text-pink-400 opacity-30 animate-float" style={{ animationDelay: '3s' }}><Heart size={24} fill="currentColor" /></div>
      <div className="star-float top-[60%] left-[5%] text-blue-400 opacity-20 animate-float" style={{ animationDelay: '2s' }}><Music size={32} /></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-48 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-violet-100 text-violet-600 px-8 py-3 rounded-full font-black text-xs mb-14 shadow-xl shadow-violet-100/50 animate-in slide-in-from-top-12 duration-1000">
            <Sparkles size={16} className="animate-pulse" />
            <span className="uppercase tracking-[0.2em]">The Future of Kids Entertainment is Here</span>
          </div>
          
          <h1 className="text-8xl md:text-[11rem] font-[1000] text-slate-900 mb-12 leading-[0.85] tracking-tighter animate-in fade-in zoom-in duration-1000">
            Dream Big. <br />
            <span className="gradient-text italic px-4">Watch Magic.</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-slate-500 mb-20 max-w-4xl mx-auto leading-relaxed font-semibold animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Turn your imagination into high-quality 5-minute animated adventures. 
            Automated scripting, Disney-style visuals, and professional AI narration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-32 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300">
            <Link to="/create" className="group relative w-full sm:w-auto bg-slate-900 text-white px-16 py-8 rounded-[36px] font-black text-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 overflow-hidden animate-pulse-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Wand2 size={32} className="group-hover:rotate-45 transition-transform duration-500" />
              Create My Story
            </Link>
            <button className="w-full sm:w-auto glass text-slate-800 px-16 py-8 rounded-[36px] font-black text-2xl hover:bg-white transition-all flex items-center justify-center gap-4 border border-slate-200 shadow-2xl group">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </div>
              Watch Demo
            </button>
          </div>

          <div className="relative overflow-hidden py-10">
             <div className="scrolling-wrapper flex gap-20 items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 font-black text-lg uppercase tracking-[0.4em] whitespace-nowrap">
                    <Star size={24} className="fill-current text-amber-500" />
                    <span>Disney Inspired</span>
                    <Star size={24} className="fill-current text-violet-500" />
                    <span>5 Minute Pacing</span>
                    <Star size={24} className="fill-current text-pink-500" />
                    <span>AI Narrated</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Bento */}
      <section className="py-40 px-6 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-6 gap-10">
            
            <div className="lg:col-span-3 bg-white p-16 rounded-[64px] border border-slate-100 shadow-sm card-hover flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform">
                <Sparkles size={300} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-violet-600 rounded-[28px] flex items-center justify-center text-white mb-10 shadow-2xl shadow-violet-200 group-hover:rotate-12 transition-transform">
                  <Wand2 size={40} />
                </div>
                <h3 className="text-5xl font-black text-slate-900 mb-8 leading-tight">Prompt to <br/>Masterpiece</h3>
                <p className="text-2xl text-slate-500 leading-relaxed max-w-md font-medium">Type a simple idea. Our AI handles the script, storyboard, characters, and full animation cycle.</p>
              </div>
              <div className="mt-16 flex items-center gap-4 p-4 bg-slate-50 rounded-full w-fit">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">✨</div>
                <span className="text-sm font-black text-slate-400 italic pr-6">"A cat who explores Mars..."</span>
              </div>
            </div>

            <div className="lg:col-span-3 bg-slate-900 p-16 rounded-[64px] text-white flex flex-col justify-between card-hover relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[28px] flex items-center justify-center text-red-500 mb-10 border border-white/10 group-hover:scale-110 transition-transform">
                  <Youtube size={40} fill="currentColor" />
                </div>
                <h3 className="text-5xl font-black mb-8 leading-tight">YouTube <br/>Growth Engine</h3>
                <p className="text-slate-400 text-2xl leading-relaxed max-w-md font-medium">Optimized for high retention. Auto-generated metadata for maximum discoverability.</p>
              </div>
              <div className="mt-16 flex -space-x-4">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="w-16 h-16 rounded-3xl border-4 border-slate-900 bg-slate-800 flex items-center justify-center font-black text-xs shadow-xl">
                      <Video size={20} className="text-violet-400" />
                   </div>
                 ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-gradient-to-br from-pink-500 to-rose-600 p-16 rounded-[64px] text-white flex flex-col justify-between card-hover group">
              <div>
                <Heart size={64} className="mb-10 group-hover:scale-125 transition-transform" fill="currentColor" />
                <h3 className="text-4xl font-black mb-8 leading-tight">Safe for Kids</h3>
                <p className="text-white/80 text-xl font-medium">Built-in safety guardrails ensure every story is appropriate and educational.</p>
              </div>
              <ShieldCheck size={32} className="self-end opacity-40" />
            </div>

            <div className="lg:col-span-4 bg-white p-16 rounded-[64px] border border-slate-100 shadow-sm card-hover flex flex-col md:flex-row items-center gap-16 overflow-hidden relative group">
              <div className="flex-grow">
                <div className="w-20 h-20 bg-amber-100 rounded-[28px] flex items-center justify-center text-amber-500 mb-10 shadow-xl group-hover:-rotate-6 transition-transform">
                  <Moon size={40} fill="currentColor" />
                </div>
                <h3 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Bedtime Hero</h3>
                <p className="text-2xl text-slate-500 font-medium leading-relaxed">Create a personalized story for your child every single night. 5 minutes of pure magic.</p>
              </div>
              <div className="relative w-full md:w-80 h-80 bg-slate-100 rounded-[48px] overflow-hidden shadow-inner flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent" />
                 <Sparkles size={80} className="text-violet-600 animate-float" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Animated Suggestion Bubbles */}
      <section className="py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter">Instant Inspiration.</h2>
            <p className="text-2xl text-slate-500 font-semibold italic">Just one click to ignite the magic.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {samplePrompts.map((p, i) => (
              <Link 
                key={i} 
                to={`/create?prompt=${encodeURIComponent(p.text)}`}
                className={`group p-12 ${p.color} rounded-[64px] transition-all card-hover border-4 border-transparent hover:border-white hover:bg-white relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-1000">
                  <Sparkles size={120} />
                </div>
                <div className="text-8xl mb-12 group-hover:scale-125 transition-transform duration-700 filter drop-shadow-2xl inline-block">{p.icon}</div>
                <p className="text-3xl font-black text-slate-900 leading-tight mb-12 italic">"{p.text}"</p>
                <div className={`flex items-center gap-4 ${p.accent} font-black text-sm uppercase tracking-widest`}>
                  Start Now <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[80px] p-24 text-center text-white relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(139,92,246,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-pink-600/30 opacity-40" />
            <div className="star-float top-20 left-20 text-white/10"><Sparkles size={120} /></div>
            <div className="star-float bottom-10 right-20 text-white/5"><Heart size={160} fill="currentColor" /></div>
            
            <div className="relative z-10">
              <h2 className="text-7xl md:text-9xl font-black mb-12 tracking-tighter">Ready to <span className="gradient-text italic">Spark?</span></h2>
              <p className="text-2xl md:text-3xl text-slate-400 mb-16 max-w-3xl mx-auto font-medium">Join thousands of parents and creators building the next generation of kids media.</p>
              <Link to="/create" className="inline-flex items-center gap-6 bg-white text-slate-900 px-16 py-8 rounded-[36px] font-[1000] text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Get Started Free <Zap size={32} className="text-amber-500" fill="currentColor" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;