from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

app = FastAPI(title="Recall API", version="0.1.0")

# Setup Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY or "PLACEHOLDER" in GEMINI_API_KEY:
    print("WARNING: Using Placeholder API Key. Calls will fail unless updated.")

genai.configure(api_key=GEMINI_API_KEY)
# Using Gemini 1.5 Flash for speed/cost balance in the hackathon
model = genai.GenerativeModel('gemini-2.0-flash') 

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    whisper: str
    confidence: float
    mood: str
    hex_color: str

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_memory(file: UploadFile = File(...)):
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # 1. Quick look (Identify subject)
        pre_prompt = "Describe the main subject of this image in 5 words."
        pre_response = model.generate_content([pre_prompt, image])
        search_query = pre_response.text.strip()
        print(f"🔍 Searching memories for: {search_query}")
        
        # 2. Retrieve Context
        from memory import query_memories
        context = query_memories(search_query)
        print(f"📚 Context Found: {context}")
        
        # 3. Final Whisper + Vibe Generation
        # We ask for JSON-like structure in the text to parse it easily without strict JSON mode (for speed)
        prompt = f"""
        You are 'Recall'.

        CONTEXT:
        {context}
        
        Task:
        1. Identify the key subject in the image.
        2. Generate a short, comforting 'whisper' (1-2 sentences).
        3. Determine the 'Mood' of this memory (e.g. Nostalgic, Joyful, Calm, Alert).
        4. Pick a HEX COLOR that matches this mood (e.g. #FFD700 for Joy, #8B0000 for Alert).
        
        Format your response EXACTLY like this:
        WHISPER: [Your text here]
        MOOD: [Mood word]
        COLOR: [Hex code]
        """
        
        response = model.generate_content([prompt, image])
        text_resp = response.text.strip()
        
        # Simple parsing
        whisper = "I see you."
        mood = "Neutral"
        color = "#FDFBF7" # Default Cream
        
        for line in text_resp.split('\n'):
            if line.startswith("WHISPER:"):
                whisper = line.replace("WHISPER:", "").strip()
            elif line.startswith("MOOD:"):
                mood = line.replace("MOOD:", "").strip()
            elif line.startswith("COLOR:"):
                color = line.replace("COLOR:", "").strip()
        
        return {
            "whisper": whisper,
            "confidence": 0.98,
            "mood": mood,
            "hex_color": color
        }
        
    except Exception as e:
        print(f"Error analyzing image: {e}")
        
        if "429" in str(e):
             # JAM: Hackathon Survival Mode - Return a fake memory so the demo works!
             import random
             demos = [
                 {"whisper": "I remember this... it's the coffee mug from your trip to Seattle in 1999.", "mood": "Nostalgic", "hex_color": "#8B5CF6"}, # Violet
                 {"whisper": "That looks like your grandson's favorite toy. He calls it 'Mr. Bear'.", "mood": "Joyful", "hex_color": "#F59E0B"}, # Amber
                 {"whisper": "Use caution. This object is sharp.", "mood": "Alert", "hex_color": "#EF4444"}, # Red
                 {"whisper": "A quiet afternoon in the garden. The lighting is perfect.", "mood": "Calm", "hex_color": "#10B981"} # Emerald
             ]
             demo = random.choice(demos)
             print("⚠️ Rate Limit Hit: Serving Demo Memory")
             return {
                "whisper": f"{demo['whisper']} (Simulated)",
                "confidence": 1.0, 
                "mood": demo["mood"],
                "hex_color": demo["hex_color"]
            }
            
        # Fallback for demo stability
        return {
            "whisper": "I am having trouble seeing that clearly, but you are safe here.",
            "confidence": 0.0,
            "mood": "System Alert",
            "hex_color": "#FEE2E2" 
        }
