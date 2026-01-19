import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Wand2, Loader2, CheckCircle2, AlertCircle, Sparkles, Languages, Users, MessageSquareText, Mic2, Cpu, Layout, Film, Clock, Video } from 'lucide-react';
import { generateStoryScript, generateSceneImage, generateSceneAudio, generateSceneVideo } from '../services/geminiService';
import { Story, GenerationProgress } from '../types';

// Fix: Augment the AIStudio interface directly as window.aistudio is already typed as AIStudio in this environment.
// Re-declaring 'aistudio' on 'Window' with a literal type causes "identical modifiers" and "same type" errors.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

interface CreateVideoPageProps {
  onStoryCreated: (story: Story) => void;
}

const CreateVideoPage: React.FC<CreateVideoPageProps> = ({ onStoryCreated }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState(searchParams.get('prompt') || '');
  const [audience, setAudience] = useState<'3-6' | '6-10'>('3-6');
  const [language, setLanguage] = useState('English');
  const [narration, setNarration] = useState('Playful Male');
  const [useMotion, setUseMotion] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({
    step: 'idle',
    percentage: 0,
    message: ''
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    if (useMotion) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Assuming success as per instructions
      }
    }
    
    setIsGenerating(true);
    setError(null);
    setProgress({ step: 'script', percentage: 5, message: 'Consulting the magic scrolls...' });

    try {
      const storyBase = await generateStoryScript(prompt, audience, language);
      
      const newStory: Story = {
        id: Math.random().toString(36).substr(2, 9),
        title: storyBase.title || 'Untitled Magic Story',
        prompt,
        characterDescription: storyBase.characterDescription || 'Friendly characters',
        fullScript: storyBase.fullScript || '',
        scenes: storyBase.scenes || [],
        audience,
        language,
        narrationStyle: narration,
        createdAt: Date.now(),
        status: 'generating'
      };

      if (!newStory.scenes.length) throw new Error("Failed to create scenes.");

      const processedScenes = [];
      const total = newStory.scenes.length;

      for (let i = 0; i < total; i++) {
        const scene = newStory.scenes[i];
        const stepMsg = useMotion ? `Animating Scene ${i + 1} (AI Video)...` : `Painting Scene ${i + 1} with Disney magic...`;
        setProgress({ 
          step: 'scenes', 
          percentage: 10 + (i / total) * 60, 
          message: stepMsg
        });

        try {
          if (useMotion) {
            const videoUrl = await generateSceneVideo(scene.visualPrompt, newStory.characterDescription);
            processedScenes.push({ ...scene, videoUrl });
          } else {
            const imageUrl = await generateSceneImage(scene.visualPrompt, newStory.characterDescription);
            processedScenes.push({ ...scene, imageUrl });
          }
        } catch (vidErr) {
          console.error("Visual generation error", vidErr);
          processedScenes.push({ ...scene, imageUrl: `https://placehold.co/1280x720/6366f1/ffffff?text=Scene+${i+1}` });
        }
      }

      const finalScenes = [];
      for (let i = 0; i < processedScenes.length; i++) {
        const scene = processedScenes[i];
        setProgress({ 
          step: 'audio', 
          percentage: 70 + (i / total) * 25, 
          message: `Finding the perfect narrator voice for Scene ${i + 1}...` 
        });
        
        try {
          const audioData = await generateSceneAudio(scene.script, narration);
          finalScenes.push({ ...scene, audioData });
        } catch (audioErr) {
          console.error("Audio generation error", audioErr);
          finalScenes.push({ ...scene });
        }
      }

      const finalStory: Story = { 
        ...newStory, 
        scenes: finalScenes,
        status: 'completed' 
      };

      setProgress({ step: 'done', percentage: 100, message: 'Production Complete! Opening the Studio...' });
      onStoryCreated(finalStory);
      
      setTimeout(() => navigate(`/editor/${finalStory.id}`), 1000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "The magic was interrupted. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {!isGenerating ? (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="text-center">
              <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Studio Setup</h1>
              <p className="text-xl text-slate-500 font-medium">Fine-tune your story's settings before we begin the render.</p>
            </div>

            <div className="bg-white rounded-[56px] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-16">
              <div className="flex-grow space-y-10">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                    <Sparkles size={16} className="text-violet-500" />
                    Video Concept
                  </label>
                  <div className="relative group">
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. A space pirate who only steals healthy snacks for his crew..."
                      className="w-full h-56 p-10 rounded-[40px] bg-slate-50 border-4 border-transparent focus:border-violet-100 outline-none text-2xl font-bold resize-none shadow-inner transition-all placeholder:text-slate-300"
                    />
                    <div className="absolute bottom-6 right-8 text-xs font-black text-slate-300 uppercase tracking-widest bg-white px-4 py-2 rounded-full shadow-sm">
                      AI GENERATED
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Audience', icon: Users, value: audience, setter: setAudience, options: [{l: 'Kids (3-6)', v: '3-6'}, {l: 'Kids (6-10)', v: '6-10'}] },
                    { label: 'Language', icon: Languages, value: language, setter: setLanguage, options: [{l: 'English', v: 'English'}, {l: 'Spanish', v: 'Spanish'}, {l: 'Hindi', v: 'Hindi'}] },
                    { label: 'Narrator', icon: Mic2, value: narration, setter: setNarration, options: [{l: 'Playful Male', v: 'Playful Male'}, {l: 'Warm Female', v: 'Warm Female'}] },
                    { 
                      label: 'Rendering', 
                      icon: Video, 
                      value: useMotion ? 'AI Video' : 'AI Static', 
                      setter: (val: string) => setUseMotion(val === 'AI Video'),
                      options: [{l: 'Static Art', v: 'AI Static'}, {l: 'Motion (Veo)', v: 'AI Video'}] 
                    }
                  ].map((field, i) => (
                    <div key={i} className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <field.icon size={12} /> {field.label}
                      </label>
                      <select 
                        value={field.value} 
                        onChange={(e: any) => field.setter(e.target.value)}
                        className={`w-full p-6 rounded-[24px] border-2 border-transparent focus:border-violet-100 outline-none font-black text-sm cursor-pointer shadow-sm ${field.label === 'Rendering' && useMotion ? 'bg-violet-600 text-white' : 'bg-slate-50 text-slate-700'}`}
                      >
                        {field.options.map(opt => <option key={opt.v} value={opt.v} className="bg-white text-slate-900">{opt.l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="p-8 bg-red-50 text-red-700 rounded-[32px] border-2 border-red-100 flex items-center gap-4 text-lg font-bold animate-shake">
                    <AlertCircle size={28} />
                    <p>{error}</p>
                  </div>
                )}

                <button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className={`w-full py-8 text-white rounded-[32px] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 group ${useMotion ? 'bg-gradient-to-r from-violet-600 to-pink-600 shadow-violet-200' : 'bg-slate-900 hover:bg-black shadow-slate-300'}`}
                >
                  <Wand2 size={32} className="group-hover:rotate-12 transition-transform" />
                  {useMotion ? 'Generate Animated Movie' : 'Generate Magic Movie'}
                </button>
              </div>

              <div className="hidden lg:flex w-80 flex-col gap-6">
                <div className="p-8 bg-violet-50 rounded-[40px] border border-violet-100 space-y-4">
                  <h4 className="font-black text-violet-600 text-xs uppercase tracking-widest">Studio Features</h4>
                  <ul className="space-y-4 text-sm font-bold text-violet-900/60">
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} /> 12 Full Cinematic Scenes</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} /> Professional AI Voice</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} /> {useMotion ? 'Full AI Video Clips' : 'Disney-style Visuals'}</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} /> YouTube Metadata</li>
                  </ul>
                </div>
                <div className="p-8 bg-pink-50 rounded-[40px] border border-pink-100 flex-grow">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-500 shadow-sm mb-4">
                     <Clock size={24} />
                   </div>
                   <h4 className="font-black text-pink-900 text-sm mb-2">Duration Fixed</h4>
                   <p className="text-pink-900/40 text-xs font-bold leading-relaxed">All StorySpark videos are optimized at exactly 5 minutes for max retention.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center">
            <div className="relative w-64 h-64 mb-16">
                <div className="absolute inset-0 border-[12px] border-slate-100 rounded-full" />
                <div 
                  className="absolute inset-0 border-[12px] border-violet-600 rounded-full transition-all duration-700 ease-out" 
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${progress.percentage > 25 ? '100% 0%' : '100% ' + (100 - (progress.percentage*4)) + '%'}, ${progress.percentage > 50 ? '100% 100%' : progress.percentage > 25 ? (100 - (progress.percentage-25)*4) + '% 100%' : '100% 100%'}, ${progress.percentage > 75 ? '0% 100%' : progress.percentage > 50 ? '0% 100%' : '0% 100%'}, ${progress.percentage >= 100 ? '0% 0%' : '0% 0%'})`,
                    transform: 'rotate(-90deg)'
                  }} 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Wand2 size={48} className="text-violet-600 animate-float mb-2" />
                    <span className="text-4xl font-black text-slate-900">{progress.percentage}%</span>
                </div>
            </div>
            
            <h2 className="text-5xl font-black text-slate-900 mb-6 italic tracking-tight text-center max-w-2xl">{progress.message}</h2>
            {useMotion && (
              <p className="text-slate-400 font-bold text-sm mb-8 animate-pulse uppercase tracking-widest">Veo Video Generation takes longer but looks magical...</p>
            )}
            
            <div className="grid sm:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
               {[
                 { l: 'Scripting', icon: MessageSquareText, active: progress.step === 'script' || progress.percentage > 10 },
                 { l: 'Visualizing', icon: Layout, active: progress.step === 'scenes' || progress.percentage > 70 },
                 { l: 'Recording', icon: Mic2, active: progress.step === 'audio' || progress.percentage > 95 }
               ].map((s, i) => (
                 <div key={i} className={`p-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 ${s.active ? 'bg-white border-violet-100 shadow-xl' : 'bg-slate-50 border-transparent opacity-30'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.active ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <s.icon size={20} />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{s.l}</span>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateVideoPage;