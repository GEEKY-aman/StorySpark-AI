import React from 'react';
import { Link } from 'react-router-dom';
import { Play, PlusCircle, Trash2, Youtube, Sparkles, Clock, ArrowRight, Video, Shapes } from 'lucide-react';
import { Story } from '../types';

interface DashboardPageProps {
  stories: Story[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ stories }) => {
  return (
    <div className="max-w-7xl mx-auto py-24 px-8 sm:px-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.3em]">
            <Shapes size={12} /> Creator Hub
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight">Your Stories.</h1>
          <p className="text-xl text-slate-500 font-medium max-w-md italic">Manage your library of AI-powered magical adventures.</p>
        </div>
        <Link to="/create" className="group relative bg-violet-600 text-white px-12 py-6 rounded-[32px] font-black text-xl flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-violet-200 active:scale-95 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <PlusCircle size={28} />
          Create New Adventure
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="bg-white rounded-[64px] p-32 text-center border-4 border-dashed border-slate-100 flex flex-col items-center">
          <div className="w-32 h-32 bg-slate-50 rounded-[48px] flex items-center justify-center mb-12 border border-slate-100 shadow-inner group">
            <Video size={56} className="text-slate-200 group-hover:text-violet-600 transition-colors duration-500" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6">No productions yet.</h2>
          <p className="text-xl text-slate-500 mb-16 max-w-md mx-auto leading-relaxed font-medium">Your creative journey is waiting for its first spark. Let's build something amazing for the kids!</p>
          <Link to="/create" className="bg-slate-900 text-white px-12 py-6 rounded-[28px] font-black text-xl shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-4">
            Start My First Project <ArrowRight size={24} />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {stories.map(story => (
            <div key={story.id} className="group bg-white rounded-[56px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 flex flex-col h-full hover:-translate-y-3">
              <div className="relative aspect-video overflow-hidden">
                <img 
                    src={story.scenes[0]?.imageUrl || 'https://images.placehold.co/1280x720?text=Rendering...'} 
                    alt={story.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                    <Link to={`/editor/${story.id}`} className="bg-white text-slate-900 px-10 py-4 rounded-[24px] font-black text-lg flex items-center gap-3 shadow-2xl hover:scale-110 active:scale-95 transition-all">
                        <Play size={20} fill="currentColor" /> Enter Studio
                    </Link>
                </div>
                <div className="absolute top-6 right-6 glass px-4 py-2 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest border border-white/20">
                  {story.audience} Yrs
                </div>
                <div className="absolute bottom-6 left-6 flex gap-2">
                   <div className="glass px-4 py-2 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} /> 5:00
                   </div>
                </div>
              </div>
              <div className="p-12 flex-grow flex flex-col">
                <h3 className="font-black text-3xl text-slate-900 line-clamp-1 mb-4 group-hover:text-violet-600 transition-colors leading-tight italic">{story.title}</h3>
                <p className="text-slate-400 font-bold text-base line-clamp-2 mb-10 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{story.prompt}"</p>
                
                <div className="mt-auto pt-10 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${story.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {story.status === 'completed' ? 'Aired' : 'Rendering'}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                    {new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          <Link to="/create" className="group border-4 border-dashed border-slate-100 rounded-[56px] aspect-square flex flex-col items-center justify-center p-12 hover:border-violet-200 hover:bg-violet-50 transition-all cursor-pointer">
             <div className="w-20 h-20 bg-slate-50 group-hover:bg-violet-100 rounded-[32px] flex items-center justify-center mb-8 transition-colors shadow-inner">
               <PlusCircle size={40} className="text-slate-200 group-hover:text-violet-600 transition-colors" />
             </div>
             <p className="font-black text-slate-300 uppercase tracking-[0.3em] group-hover:text-violet-600 transition-colors text-xs">New Movie</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;