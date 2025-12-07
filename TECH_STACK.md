# Tech Stack: Recall

## 1. Architecture Overview
We use a **Hybrid Vibe Architecture**:
*   **Frontend (The Face):** Next.js (React) for a fluid, app-like experience.
*   **Backend (The Brain):** Python (FastAPI) for heavy AI orchestration and long-context management.
*   **AI Core (The Soul):** Google Gemini 3 Flash/Pro (Multimodal).

## 2. Frontend: "The Lens"
*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Framer Motion (Critical for the "Vibe").
*   **Key Libraries:**
    *   `react-webcam` (Video Input)
    *   `lucide-react` (Minimalist Icons)
    *   `use-sound` (For subtle auditory feedback)

## 3. Backend: "The Memory"
*   **Framework:** FastAPI (Python 3.11+)
*   **Database:** 
    *   *Metadata:* Simple JSON Store (Speed > Complexity for Hackathon).
    *   *Vector Store:* ChromaDB (Local persistance) for "Life Graph" retrieval.
*   **Key Libraries:**
    *   `google-generativeai` (Gemini SDK)
    *   `uvicorn` (Server)
    *   `python-multipart` (Image handling)

## 4. Data Flow (The "Wow" Loop)
1.  **Ingest:** User uploads "Memories" (Photos/Text) -> Stored in Vector DB.
2.  **Observe:** Frontend captures camera frame -> Sends to Backend.
3.  **Reason:** 
    *   Backend retrieves relevant context from Vector DB (RAG).
    *   Gemini 3 analyzes Frame + Context.
4.  **Respond:** Gemini generates a warm, contextual "whisper".
5.  **Present:** Frontend displays the text gently and speaks it out.

## 5. Directory Structure
```
deepmind-vibe-hackathon/
├── frontend/             # Next.js App
├── backend/              # FastAPI App
├── memories/             # Local storage for user uploaded photos/docs
└── MISSION.md
```
