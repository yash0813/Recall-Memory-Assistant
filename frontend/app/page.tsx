"use client";

import { Lens, LensHandle } from "@/components/Lens";
import { Whisper } from "@/components/Whisper";
import { HistorySidebar } from "@/components/HistorySidebar";
import { ScanningOverlay } from "@/components/ScanningOverlay";
import { analyzeImage } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, AlertCircle, RefreshCw } from "lucide-react";

interface HistoryItem {
  id: string;
  whisper: string;
  mood: string;
  hex_color: string;
  timestamp: string;
}

export default function Home() {
  const lensRef = useRef<LensHandle>(null);

  // State
  const [whisperText, setWhisperText] = useState("Initializing memory sensors...");
  const [moodColor, setMoodColor] = useState("#FDFBF7");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false); // Default to Manual to save Quota

  // Helper
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const captureAndAnalyze = async () => {
    if (!lensRef.current || isProcessing) return;

    const screenshot = lensRef.current.capture();
    if (!screenshot) return;

    setIsProcessing(true);
    setError(null);

    try {
      const blob = dataURItoBlob(screenshot);
      const result = await analyzeImage(blob);

      // Update State
      setWhisperText(result.whisper);

      if (result.hex_color) {
        setMoodColor(result.hex_color);
      }

      // Add to History
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        whisper: result.whisper,
        mood: result.mood || "Neutral",
        hex_color: result.hex_color || "#FDFBF7",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50

    } catch (err: any) {
      console.error("Memory retrieval failed", err);
      setError("Connection to Memory Core lost. Please check backend.");
      setWhisperText("...");
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoMode) {
      interval = setInterval(captureAndAnalyze, 8000); // 8s loop
    }
    return () => clearInterval(interval);
  }, [autoMode, isProcessing]);

  return (
    <motion.main
      animate={{ backgroundColor: moodColor }}
      transition={{ duration: 2.0, ease: "easeInOut" }}
      className="flex h-screen w-full overflow-hidden relative font-sans text-stone-800"
    >

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">

        {/* Header */}
        <header className="absolute top-8 left-8 flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tighter text-stone-900 font-serif">Recall</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-xs font-mono text-stone-500 uppercase tracking-widest">
              {isProcessing ? 'RECOVERING CONTEXT...' : 'SYSTEM ONLINE'}
            </span>
          </div>
        </header>

        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-8 right-8 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg"
            >
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Lens Container */}
        <div className="relative w-full max-w-4xl aspect-[4/3] md:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-[1px] border-white/20 ring-1 ring-black/5">
          <Lens ref={lensRef} />
          <ScanningOverlay isProcessing={isProcessing} />

          {/* Whisper Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
            <Whisper text={whisperText} />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center gap-6">
          <button
            onClick={() => setAutoMode(!autoMode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${autoMode ? 'bg-stone-800 text-stone-100 border-stone-800' : 'bg-transparent text-stone-600 border-stone-300 hover:bg-stone-100'}`}
          >
            {autoMode ? 'Auto-Scan: ON' : 'Auto-Scan: OFF'}
          </button>

          <button
            onClick={captureAndAnalyze}
            disabled={isProcessing}
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-xl hover:scale-105 active:scale-95 transition-all text-stone-900 border-4 border-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <RefreshCw className="animate-spin" />
            ) : (
              <Camera size={28} className="group-hover:text-amber-600 transition-colors" />
            )}
          </button>
        </div>

      </div>

      {/* Right Sidebar */}
      <div className="relative z-20 h-full">
        <HistorySidebar history={history} />
      </div>

    </motion.main>
  );
}
