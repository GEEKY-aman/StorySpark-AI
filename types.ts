export interface Scene {
  id: string;
  order: number;
  script: string;
  visualPrompt: string;
  imageUrl?: string;
  videoUrl?: string; // URL to AI generated video clip
  audioData?: string; // Base64 PCM data from Gemini TTS
  duration: number; // in seconds
}

export interface Story {
  id: string;
  title: string;
  prompt: string;
  characterDescription: string; // Global context for visual consistency
  fullScript: string;
  scenes: Scene[];
  audience: '3-6' | '6-10';
  language: string;
  narrationStyle: string;
  createdAt: number;
  status: 'draft' | 'generating' | 'completed';
}

export interface GenerationProgress {
  step: 'idle' | 'script' | 'scenes' | 'audio' | 'render' | 'done';
  percentage: number;
  message: string;
}