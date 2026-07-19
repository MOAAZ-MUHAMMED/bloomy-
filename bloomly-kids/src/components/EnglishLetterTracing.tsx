import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function EnglishLetterTracing({ onComplete, onBack }: Props) {
  const [traced, setTraced] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 p-4 font-sans">
      <div className="relative w-full max-w-md bg-white/40 backdrop-blur-md border border-white/60 shadow-2xl rounded-[3rem] p-8 flex flex-col items-center">
        {onBack && (
          <button onClick={onBack} className="absolute top-6 left-6 text-2xl hover:scale-110 transition-transform">
            🔙
          </button>
        )}
        <h2 className="text-3xl font-bold text-orange-500 mb-8 text-center">Trace Letter A</h2>
        
        <div className="relative text-[12rem] font-black text-orange-200 leading-none mb-10 select-none">
          A
          {!traced && (
            <motion.div
              drag
              dragConstraints={{ top: -50, bottom: 50, left: -50, right: 50 }}
              onDragEnd={() => { setTraced(true); setTimeout(onComplete, 1500); }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full cursor-grab active:cursor-grabbing shadow-lg border-4 border-orange-300 flex items-center justify-center text-2xl"
            >
              🍎
            </motion.div>
          )}
          {traced && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 text-5xl"
            >
              🌟
            </motion.div>
          )}
        </div>
        
        <p className="text-orange-600 font-medium text-lg bg-white/60 px-6 py-3 rounded-full shadow-sm">
          {traced ? 'Awesome! 🎈' : 'Drag the apple! 🍎'}
        </p>
      </div>
    </div>
  );
}
