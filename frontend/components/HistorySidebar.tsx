"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HistoryItem {
    id: string;
    whisper: string;
    mood: string;
    hex_color: string;
    timestamp: string;
}

export const HistorySidebar = ({ history }: { history: HistoryItem[] }) => {
    return (
        <div className="w-80 h-full bg-white/40 backdrop-blur-xl border-l border-white/20 p-6 flex flex-col gap-4 overflow-hidden rounded-l-3xl shadow-xl">
            <h2 className="text-stone-800 font-serif font-bold text-xl mb-2">Memory Stream</h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-stone-200">
                <AnimatePresence initial={false}>
                    {history.length === 0 && (
                        <div className="text-stone-400 text-sm italic">No recent memories...</div>
                    )}
                    {history.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 rounded-xl bg-white/60 shadow-sm border border-white/40 hover:bg-white/80 transition-colors"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full shadow-inner"
                                        style={{ backgroundColor: item.hex_color }}
                                    />
                                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">{item.mood}</span>
                                </div>
                                <span className="text-[10px] text-stone-400">{item.timestamp}</span>
                            </div>
                            <p className="text-stone-700 text-sm font-medium leading-relaxed font-serif">
                                "{item.whisper}"
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
