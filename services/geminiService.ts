import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Story, Scene } from "../types";

const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) throw new Error("API Key is missing. Please check your environment configuration.");
  return key;
};

const cleanJson = (text: string) => {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return text;
    return text.substring(start, end + 1);
  } catch (e) {
    return text;
  }
};

export const generateStoryScript = async (
  prompt: string,
  audience: string,
  language: string
): Promise<Partial<Story>> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a captivating, kid-friendly story script for a 5-minute YouTube video. 
    Target Audience: ${audience}. Language: ${language}. Prompt: ${prompt}.`,
    config: {
      systemInstruction: `You are an expert kids' storyteller. 
      Divide the story into EXACTLY 12 scenes.
      Return ONLY a JSON object with: 
      - title
      - characterDescription: A detailed physical description of the main characters to ensure visual consistency (e.g. "A fluffy orange cat with a green bowtie").
      - fullScript
      - scenes: each with {script, visualPrompt, duration: 25}`,
      responseMimeType: "application/json",
    },
  });

  try {
    const data = JSON.parse(cleanJson(response.text || '{}'));
    return {
      title: data.title || 'A New Adventure',
      characterDescription: data.characterDescription || 'Friendly characters',
      fullScript: data.fullScript || '',
      scenes: (data.scenes || []).map((s: any, i: number) => ({
        ...s,
        id: Math.random().toString(36).substr(2, 9),
        order: i,
        duration: 25
      }))
    };
  } catch (err) {
    throw new Error("Failed to parse story script. Try a simpler prompt.");
  }
};

export const generateSceneImage = async (visualPrompt: string, characterDescription: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `High-quality Disney 3D animation style, cinematic lighting. Main Character: ${characterDescription}. Scene Action: ${visualPrompt}` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = '';
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) throw new Error("Could not generate scene image.");
  return imageUrl;
};

export const generateSceneVideo = async (visualPrompt: string, characterDescription: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Animated kids movie style, Disney/Pixar 3D animation, bright colors, friendly atmosphere. Character: ${characterDescription}. Action: ${visualPrompt}. High quality, smooth movement.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");
  
  const response = await fetch(`${downloadLink}&key=${apiKey}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const generateSceneAudio = async (text: string, style: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const voiceName = style.includes('Female') ? 'Kore' : 'Puck';

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this story scene warmly and expressively for kids: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Voice generation failed.");
  return base64Audio;
};

// Audio Utilities
export const decodeBase64Audio = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const downloadFile = (dataUrl: string, filename: string) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};