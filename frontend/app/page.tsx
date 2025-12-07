"use client";

import { Lens, LensHandle } from "@/components/Lens";
import { Whisper } from "@/components/Whisper";
import { analyzeImage } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const lensRef = useRef<LensHandle>(null);
  const [whisperText, setWhisperText] = useState("Initializing memory sensors...");
  const [moodColor, setMoodColor] = useState("#FDFBF7"); // Default Cream
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to convert Base64 to Blob
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

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!lensRef.current || isProcessing) return;

      const screenshot = lensRef.current.capture();
      if (screenshot) {
        setIsProcessing(true);
        try {
          const blob = dataURItoBlob(screenshot);
          const result = await analyzeImage(blob);
          setWhisperText(result.whisper);
          if (result.hex_color) {
            setMoodColor(result.hex_color);
          }
        } catch (error) {
          console.error("Memory retrieval failed", error);
        } finally {
          setIsProcessing(false);
        }
      }
    }, 6000); // Check every 6 seconds for a "slow vibe"

    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <motion.main
      animate={{ backgroundColor: moodColor }}
      transition={{ duration: 2.0, ease: "easeInOut" }}
      className="flex h-screen w-full flex-col items-center justify-center p-4 md:p-8 overflow-hidden"
    >

      {/* Header */}
      <header className="absolute top-6 left-8 z-10">
        <h1 className="text-3xl font-bold tracking-tighter text-stone-900/80">Recall</h1>
        {isProcessing && <div className="text-xs font-mono text-stone-500 mt-1 animate-pulse">RECOVERING CONTEXT...</div>}
      </header>

      {/* Main Container */}
      <div className="flex w-full h-full max-w-6xl gap-6 relative">

        {/* Visual Feed */}
        <section className="flex-1 relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-video bg-black/5 shadow-2xl border-4 border-white/50 transition-colors duration-1000">
          <Lens ref={lensRef} />

          {/* The "Whisper" Overlay */}
          <div className="absolute bottom-12 left-12 right-12 z-20 pointer-events-none">
            <Whisper text={whisperText} />
          </div>
        </section>

      </div>

    </motion.main>
  );
}
