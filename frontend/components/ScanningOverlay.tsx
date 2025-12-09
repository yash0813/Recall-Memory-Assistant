"use client";

import { motion } from "framer-motion";

export const ScanningOverlay = ({ isProcessing }: { isProcessing: boolean }) => {
    if (!isProcessing) return null;

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {/* Scanning Line */}
            <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />

            {/* Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle,black,transparent_80%)]" />

            {/* Pulse Text */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-white/80 text-xs font-mono tracking-widest uppercase">Analyzing</span>
            </div>
        </div>
    );
};
