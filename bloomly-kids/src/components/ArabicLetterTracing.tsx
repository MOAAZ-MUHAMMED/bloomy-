import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function ArabicLetterTracing({ onComplete, onBack }: Props) {
  const [traced, setTraced] = useState(false);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 20) {
      setTraced(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 to-rose-100 p-4 font-sans">
      <div className="relative w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/60 shadow-2xl rounded-[3rem] p-8 flex flex-col items-center">
        {onBack && (
          <button onClick={onBack} className="absolute top-6 left-6 text-2xl text-pink-500 hover:scale-110 transition-transform">
            🔙
          </button>
        )}
        <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center">Trace the letter Baa</h2>
        
        <div className="relative text-[10rem] font-bold text-pink-300 leading-none mb-10 select-none">
          ب
          {!traced && (
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 80 }}
              onDragEnd={handleDragEnd}
              className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-12 h-12 bg-pink-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-4 border-white"
            />
          )}
          {traced && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] text-4xl"
            >
              ✨
            </motion.div>
          )}
        </div>
        
        <p className="text-pink-500 font-medium text-lg bg-white/50 px-6 py-3 rounded-full">
          {traced ? 'Perfect! 🎉' : 'Drag the dot down! 👇'}
        </p>
      </div>
    </div>
  );
}
