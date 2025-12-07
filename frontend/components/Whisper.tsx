"use client";

import { motion } from "framer-motion";

interface WhisperProps {
    text: string;
}

export function Whisper({ text }: WhisperProps) {
    const words = text.split(" ");

    return (
        <div className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-cream-50 drop-shadow-md">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "easeOut"
                    }}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
}
