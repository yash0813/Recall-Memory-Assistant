import chromadb
from chromadb.utils import embedding_functions
import os

# Initialize ChromaDB (Persistent)
# Stores data in 'backend/chroma_db'
db_client = chromadb.PersistentClient(path="./chroma_db")

# Use Google Generative AI Embeddings if key exists, otherwise default (all-MiniLM-L6-v2) is used by Chroma
# For hackathon speed, we will rely on Chroma's default sentence-transformers for now to avoid complexity
# unless specifically requested to use Gemini embeddings.

collection = db_client.get_or_create_collection(name="recall_memories")

def add_memory(text: str, metadata: dict = None):
    """
    Adds a memory to the vector store.
    """
    if metadata is None:
        metadata = {}
    
    # Simple ID generation
    memory_id = f"mem_{collection.count() + 1}"
    
    collection.add(
        documents=[text],
        metadatas=[metadata],
        ids=[memory_id]
    )
    print(f"✅ Memory stored: [{memory_id}] {text}")

def query_memories(query_text: str, n_results: int = 3) -> str:
    """
    Retrieves relevant memories based on semantic similarity.
    Returns a formatted string of context.
    """
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    
    documents = results['documents'][0]
    
    if not documents:
        return ""
        
    context_string = "\n".join([f"- {doc}" for doc in documents])
    return context_string

# --- Seed Initial Data (Hackathon Demo Vibe) ---
# We populate this if empty so the user has immediate "fake" history to recall.
if collection.count() == 0:
    print("🌱 Seeding initial memories...")
    seeds = [
        "My grandson is named David. He was born in 2015. He loves baseball.",
        "I visited Paris in 1990 with my wife, Sarah. We stayed near the Eiffel Tower.",
        "I have a golden retriever named 'Buster'. He loves tennis balls.",
        "My favorite coffee mug is blue with a chip on the handle. I bought it in Seattle.",
        "I took medication at 8:00 AM. It was the blue pill.",
        "The wifi password is 'Triangle44'."
    ]
    for seed in seeds:
        add_memory(seed, {"source": "manual_entry"})
