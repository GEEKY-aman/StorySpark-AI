# 🌟 StorySpark AI - Magical Kids Video Creator

StorySpark AI is a production-ready React platform that transforms simple story ideas into fully-rendered, 5-minute animated videos for YouTube. Designed specifically for kids' storytelling, it leverages Google's latest Gemini AI models to automate the entire creative pipeline—from scripting to final export.

![StorySpark AI Banner](https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

- **Prompt to 5-Minute Movie**: Generate a complete 12-scene story with a single prompt.
- **AI Visual Arts**: Choose between Disney-style 3D static art (Gemini 2.5 Flash Image) or full cinematic video clips (Veo 3.1).
- **AI Voice Narration**: Warm, expressive narrators (Male/Female) optimized for children's ears using Gemini TTS.
- **Smart Storyboarding**: Automatic scene breakdown with visual consistency logic.
- **In-Browser Video Compiler**: Renders a high-quality WebM/MP4 file directly in your browser using Canvas and MediaRecorder API.
- **Dashboard & Editor**: Save your projects, edit scene scripts, and fine-tune your animations.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Routing**: React Router 7
- **Icons**: Lucide React
- **AI Engine**: Google GenAI SDK (@google/genai)
  - **Scripting**: `gemini-3-flash-preview`
  - **Images**: `gemini-2.5-flash-image`
  - **Videos**: `veo-3.1-fast-generate-preview`
  - **TTS**: `gemini-2.5-flash-preview-tts`
- **Animations**: CSS3 Keyframes & Framer-style transitions

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/storyspark-ai.git
   cd storyspark-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 🎥 AI Models Configuration

| Task | Model | Purpose |
| :--- | :--- | :--- |
| **Story Scripting** | `gemini-3-flash-preview` | Fast, creative reasoning for kids stories |
| **Visual Art** | `gemini-2.5-flash-image` | High-quality 16:9 cinematic illustrations |
| **Motion Video** | `veo-3.1-fast-generate-preview` | Generating animated sequences |
| **Narration** | `gemini-2.5-flash-preview-tts` | High-fidelity multi-voice speech |

## 🛡️ Security & Privacy

- **No Stored Credentials**: API keys are accessed via `process.env.API_KEY` and are never hardcoded.
- **Client-Side Rendering**: Video compilation happens in the user's browser; no video data is sent to external servers except for the initial AI generation.
- **Kid-Safe Logic**: System instructions are tuned to enforce educational and safe content generation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with ✨ and AI for the next generation of storytellers.*
