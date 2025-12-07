"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";

export interface LensHandle {
    capture: () => string | null;
}

export const Lens = forwardRef<LensHandle>((props, ref) => {
    const webcamRef = useRef<Webcam>(null);
    const [mounted, setMounted] = useState(false);

    useImperativeHandle(ref, () => ({
        capture: () => {
            if (webcamRef.current) {
                return webcamRef.current.getScreenshot();
            }
            return null;
        }
    }));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    facingMode: "user",
                    width: 1280,
                    height: 720,
                }}
                className="absolute inset-0 w-full h-full object-cover filter contrast-110 saturate-110" // Slight filter for "Vibe"
            />
            {/* Overlay Gradient for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {/* Scanline / Grain effect (Optional Vibe) */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
        </div>
    );
});

Lens.displayName = "Lens";
