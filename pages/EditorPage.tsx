import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Download, Youtube, ChevronLeft, RefreshCw, Volume2, Pause, Loader2, Info, LayoutGrid, Type, Mic2 } from 'lucide-react';
import { Story } from '../types';
import { generateSceneImage, downloadFile, decodeBase64Audio, decodeAudioData } from '../services/geminiService';
import VideoCompiler from '../components/VideoCompiler';

interface EditorPageProps {
  stories: Story[];
  onUpdate: (story: Story) => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ stories, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!id) return;
    const found = stories.find(s => s.id === id);
    if (found) setStory(found);
  }, [id, stories]);

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
  };

  const playSceneAudio = async (idx: number) => {
    const scene = story?.scenes[idx];
    if (!scene?.audioData) return;

    stopAudio();

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const rawData = decodeBase64Audio(scene.audioData);
    const buffer = await decodeAudioData(rawData, audioCtxRef.current);
    
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtxRef.current.destination);
    
    source.onended = () => {
      if (isPlaying && story && idx < story.scenes.length - 1) {
        setActiveSceneIdx(idx + 1);
      } else if (isPlaying) {
        setIsPlaying(false);
      }
    };

    audioSourceRef.current = source;
    source.start();
    return buffer.duration;
  };

  useEffect(() => {
    if (isPlaying) {
      playSceneAudio(activeSceneIdx);
      if (videoRef.current) videoRef.current.play();
    } else {
      stopAudio();
      if (videoRef.current) videoRef.current.pause();
    }
    return () => stopAudio();
  }, [isPlaying, activeSceneIdx]);

  if (!story) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <Loader2 className="animate-spin text-violet-400 mb-6" size={48} />
      <p className="font-black tracking-[0.3em] text-xs uppercase opacity-40">Initializing Studio...</p>
    </div>
  );

  const activeScene = story.scenes?.[activeSceneIdx];

  const handleFullExport = () => {
    setIsPlaying(false);
    setIsCompiling(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-900 overflow-hidden">
      {isCompiling && (
        <VideoCompiler 
          story={story} 
          onComplete={(blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${story.title.replace(/\s+/g, '_')}_Magic_Movie.webm`;
            a.click();
            setIsCompiling(false);
          }} 
          onCancel={() => setIsCompiling(false)} 
        />
      )}

      {/* Toolbar */}
      <div className="glass-dark border-b border-white/5 px-8 py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-xl text-white/50 hover:text-white transition-all">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-black text-xl text-white leading-tight">{story.title}</h1>
            <div className="flex items-center gap-3 mt-1">
               <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-500/20">Production Ready</span>
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{story.scenes.length} Scenes • 5:00 Duration</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={handleFullExport} className="flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-[20px] font-black text-sm hover:scale-[1.02] transition-all shadow-2xl shadow-violet-900/40 active:scale-95">
            <Youtube size={20} /> Export 4K WebM
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Stage Area */}
        <div className="flex-grow flex flex-col overflow-hidden relative">
          <div className="flex-grow flex items-center justify-center p-8 bg-[#0a0f1d]">
            <div className="relative aspect-video w-full max-w-5xl rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 ring-1 ring-white/10 group">
                {activeScene.videoUrl ? (
                    <video 
                        ref={videoRef}
                        key={activeScene.videoUrl}
                        src={activeScene.videoUrl} 
                        className="w-full h-full object-cover pointer-events-none"
                        loop
                        muted
                        playsInline
                    />
                ) : activeScene.imageUrl ? (
                    <img 
                        key={activeScene.imageUrl}
                        src={activeScene.imageUrl} 
                        className={`w-full h-full object-cover transition-transform duration-[15s] ease-linear pointer-events-none ${isPlaying ? 'scale-125' : 'scale-100'}`}
                        alt="Scene visual"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white/20 italic">
                       <Loader2 className="animate-spin mr-3" /> Rendering visual canvas...
                    </div>
                )}
                
                {/* Subtitles Overlay */}
                <div className="absolute bottom-12 left-0 right-0 px-20 text-center pointer-events-none z-20">
                    <p className="bg-black/60 backdrop-blur-3xl text-white py-6 px-12 rounded-[40px] text-2xl font-bold inline-block border border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                        {activeScene.script}
                    </p>
                </div>

                {/* Central Play/Pause Toggle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-[2px] cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/20 hover:scale-110 transition-transform">
                        {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
                    </div>
                </div>

                {/* Play State Indicator */}
                {isPlaying && (
                  <div className="absolute top-10 right-10 flex items-center gap-3">
                    <div className="glass-dark text-white px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-2 border border-white/10 shadow-2xl">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                      LIVE PREVIEW
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="glass-dark border-t border-white/5 p-8 flex items-center gap-8">
            <div className="flex-grow space-y-3">
               <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                 <span>{activeSceneIdx + 1} / {story.scenes.length} Scenes</span>
                 <span>05:00 Final Length</span>
               </div>
               <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-1000 shadow-[0_0_20px_rgba(139,92,246,0.6)]" style={{ width: `${((activeSceneIdx + 1) / 12) * 100}%` }} />
               </div>
               <div className="flex justify-between gap-1">
                 {Array.from({length: 12}).map((_, idx) => (
                   <button 
                    key={idx} 
                    onClick={() => { setIsPlaying(false); setActiveSceneIdx(idx); }}
                    className={`h-2 flex-grow rounded-full transition-all ${idx === activeSceneIdx ? 'bg-violet-500 h-3 -translate-y-0.5 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : idx < activeSceneIdx ? 'bg-violet-500/40' : 'bg-white/10 hover:bg-white/20'}`} 
                   />
                 ))}
               </div>
            </div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-5 rounded-2xl transition-all shadow-2xl ${isPlaying ? 'bg-white text-slate-900 scale-95' : 'bg-violet-600 text-white hover:scale-105'}`}
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
            </button>
          </div>
        </div>

        {/* Assets Sidebar */}
        <div className="w-full md:w-[480px] glass-dark border-l border-white/5 overflow-y-auto p-10 flex flex-col gap-10 z-20">
            <div>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white"><Type size={16} /></div>
                    <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Scene Content</h3>
                  </div>
                  <span className="bg-white/5 text-white/60 px-4 py-1.5 rounded-xl text-[10px] font-black border border-white/5">S{activeSceneIdx + 1}</span>
                </div>

                <div className="space-y-6">
                    <div className="group">
                        <textarea 
                            value={activeScene.script}
                            onChange={(e) => {
                              const newScenes = [...story.scenes];
                              newScenes[activeSceneIdx].script = e.target.value;
                              onUpdate({ ...story, scenes: newScenes });
                            }}
                            className="w-full h-56 p-8 bg-white/5 rounded-[32px] text-white text-lg leading-relaxed border-2 border-transparent focus:border-violet-500/50 outline-none resize-none transition-all shadow-inner font-medium placeholder:text-white/20"
                            placeholder="Write dialogue here..."
                        />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => playSceneAudio(activeSceneIdx)} className="flex-grow py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[24px] text-sm font-black text-white/80 transition-all flex items-center justify-center gap-3 active:scale-95">
                            <Mic2 size={20} className="text-pink-400" /> Listen to Narration
                        </button>
                        <button className="p-5 bg-white/5 hover:bg-white/10 rounded-[24px] text-white/50 border border-white/10 transition-all active:scale-95">
                          <RefreshCw size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5 pt-10">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white"><LayoutGrid size={16} /></div>
                  <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Story Timeline</h3>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    {story.scenes.map((s, i) => (
                        <button 
                            key={s.id}
                            onClick={() => { setIsPlaying(false); setActiveSceneIdx(i); }}
                            className={`group relative rounded-[32px] overflow-hidden border-4 transition-all aspect-video shadow-2xl ${activeSceneIdx === i ? 'border-violet-600 scale-[0.98]' : 'border-transparent opacity-30 hover:opacity-100 hover:scale-[1.05]'}`}
                        >
                            {s.videoUrl ? (
                              <video src={s.videoUrl} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" muted />
                            ) : (
                              <img src={s.imageUrl} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" alt={`Scene ${i+1}`} />
                            )}
                            <div className={`absolute inset-x-0 bottom-0 p-3 text-[10px] text-white font-black backdrop-blur-xl transition-all ${activeSceneIdx === i ? 'bg-violet-600/60' : 'bg-black/60 opacity-0 group-hover:opacity-100'}`}>
                              SCENE {i+1}
                            </div>
                            {i < activeSceneIdx && (
                                <div className="absolute top-2 right-2 p-1 bg-emerald-500 rounded-full shadow-lg">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;