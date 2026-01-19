import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Film, CheckCircle, X, Volume2 } from 'lucide-react';
import { Story, Scene } from '../types';
import { decodeBase64Audio, decodeAudioData } from '../services/geminiService';

interface VideoCompilerProps {
  story: Story;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
}

const VideoCompiler: React.FC<VideoCompilerProps> = ({ story, onComplete, onCancel }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const WIDTH = 1280;
  const HEIGHT = 720;
  const FPS = 30;

  const startRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set up Audio Capture
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const destination = audioCtx.createMediaStreamDestination();
    
    // Choose MimeType
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

    // Combine Canvas + Audio Stream
    const canvasStream = canvas.captureStream(FPS);
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...destination.stream.getAudioTracks()
    ]);

    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 8000000
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      onComplete(blob);
      audioCtx.close();
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    await renderLoop(ctx, audioCtx, destination);
  };

  const renderLoop = async (ctx: CanvasRenderingContext2D, audioCtx: AudioContext, destination: MediaStreamAudioDestinationNode) => {
    const totalScenes = story.scenes.length;
    
    for (let i = 0; i < totalScenes; i++) {
      setCurrentSceneIdx(i);
      const scene = story.scenes[i];
      
      let visualElement: HTMLImageElement | HTMLVideoElement;
      
      if (scene.videoUrl) {
        const video = document.createElement('video');
        video.src = scene.videoUrl;
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.loop = true;
        await new Promise((resolve) => {
          video.oncanplaythrough = resolve;
          video.load();
        });
        await video.play();
        visualElement = video;
      } else if (scene.imageUrl) {
        const img = new Image();
        if (scene.imageUrl.startsWith('http')) img.crossOrigin = "anonymous";
        img.src = scene.imageUrl;
        await new Promise((resolve) => { img.onload = resolve; });
        visualElement = img;
      } else {
        continue;
      }

      // Handle AI Audio Narration
      let sceneDuration = 5; // Default fallback
      let audioBuffer: AudioBuffer | null = null;
      
      if (scene.audioData) {
        try {
          const rawData = decodeBase64Audio(scene.audioData);
          audioBuffer = await decodeAudioData(rawData, audioCtx);
          sceneDuration = audioBuffer.duration;
          
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(destination);
          source.start();
        } catch (err) {
          console.error("Audio playback error for scene", i, err);
        }
      }

      const frames = Math.ceil(sceneDuration * FPS);
      for (let f = 0; f < frames; f++) {
        const frameProgress = f / frames;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        
        if (visualElement instanceof HTMLImageElement) {
          // Ken Burns effect for static images
          const scale = 1 + (frameProgress * 0.1); 
          const drawWidth = WIDTH * scale;
          const drawHeight = HEIGHT * scale;
          const offsetX = (WIDTH - drawWidth) / 2;
          const offsetY = (HEIGHT - drawHeight) / 2;
          ctx.drawImage(visualElement, offsetX, offsetY, drawWidth, drawHeight);
        } else {
          // Normal video clip rendering
          ctx.drawImage(visualElement, 0, 0, WIDTH, HEIGHT);
        }

        // Draw Subtitles
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.roundRect(100, HEIGHT - 150, WIDTH - 200, 100, 32);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px "Quicksand", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(scene.script, WIDTH / 2, HEIGHT - 90);

        setProgress(Math.round(((i * frames + f) / (totalScenes * frames)) * 100));
        await new Promise(r => setTimeout(r, 1000 / FPS));
      }

      if (visualElement instanceof HTMLVideoElement) {
        visualElement.pause();
        visualElement.src = "";
        visualElement.load();
      }
    }

    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
  };

  useEffect(() => {
    setTimeout(startRecording, 1000);
    return () => {
      if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/98 backdrop-blur-2xl flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[48px] p-12 text-center shadow-2xl border border-white/20">
        <div className="w-32 h-32 bg-violet-100 text-violet-600 rounded-[40px] flex items-center justify-center mx-auto mb-10 relative">
          <Film size={64} className="animate-pulse" />
          <div className="absolute -top-4 -right-4 bg-pink-500 text-white p-3 rounded-full shadow-lg ring-4 ring-white">
            <Volume2 size={24} className="animate-bounce" />
          </div>
        </div>

        <h2 className="text-4xl font-black text-slate-900 mb-4 italic">Baking Your Movie</h2>
        <p className="text-slate-500 mb-10 font-medium">Adding professional AI narration and visual magic. This will take a moment...</p>

        <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mb-10">
          <span className="text-sm font-black text-violet-600 bg-violet-50 px-5 py-2 rounded-full uppercase tracking-widest">
            SCENE {currentSceneIdx + 1}/12
          </span>
          <span className="text-sm font-black text-slate-400">
            {progress}% MAGIC
          </span>
        </div>

        <button onClick={onCancel} className="text-slate-400 hover:text-red-500 font-black text-xs uppercase tracking-widest">Cancel Export</button>

        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="hidden" />
      </div>
    </div>
  );
};

export default VideoCompiler;