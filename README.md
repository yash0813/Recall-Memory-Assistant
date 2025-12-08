# Recall: The AI Memory Companion 🧠

**"Reconnecting the dots for early-stage dementia."**

Recall is a multimodal AI assistant that "sees" the world through a camera and whispers missing context to the user (e.g., names of family members, stories behind objects). It adapts its visual interface ("Chameleon Engine") to match the emotional tone of the memory.

Built for the **Google DeepMind Vibe Coding Hackathon**.

## ⚡ Features
*   **Visual Memory:** Recognizes people and objects using Gemini 1.5 Flash.
*   **Context Injection:** Retrieves long-term memories from ChromaDB vector store.
*   **The "Whisper":** Gentle, typewriter-style text delivery.
*   **Chameleon Engine:** The UI color shifts (Gold/Blue/Red) based on the *emotional sentiment* of the memory.

## 🛠️ Tech Stack
*   **AI:** Google Gemini 1.5 Flash (Multimodal)
*   **Backend:** Python FastAPI + ChromaDB
*   **Frontend:** Next.js 13 + Tailwind CSS v3 + Framer Motion

## 🚀 How to Setup

### 1. Clone the Repo
```bash
git clone https://github.com/yash0813/recall-memory-assistant.git
cd recall-memory-assistant
```

### 2. Get your Gemini API Key
Get a free API key from [Google AI Studio](https://aistudio.google.com/).

### 3. Configure Env
Create `backend/.env` and paste your key inside:
```bash
GEMINI_API_KEY=AIzaSy...
```

### 4. Run it (One-Click)
We have a magic script that installs dependencies and launches everything:
```bash
chmod +x start.sh
./start.sh
```

*The App will open at [http://localhost:3000](http://localhost:3000)*

---
*Created with ❤️ by Yash.*
