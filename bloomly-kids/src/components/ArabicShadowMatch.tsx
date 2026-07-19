import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function ArabicShadowMatch({ onComplete, onBack }: Props) {
  const [matched, setMatched] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-indigo-200 p-4 font-sans">
      <div className="relative w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[3rem] p-8 flex flex-col items-center overflow-hidden">
        {onBack && (
          <button onClick={onBack} className="absolute top-6 left-6 text-2xl hover:scale-110 transition-transform">
            🔙
          </button>
        )}
        <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">Match the shadow</h2>
        
        <div className="flex justify-between w-full mb-16 px-4">
          <div className="text-7xl filter brightness-0 opacity-30 select-none">🐱</div>
          <div className="text-7xl filter brightness-0 opacity-30 select-none">🐶</div>
        </div>

        <div className="flex space-x-6 relative z-10">
          {!matched ? (
            <motion.div
              drag
              dragConstraints={{ top: -200, bottom: 50, left: -150, right: 150 }}
              onDragEnd={() => { setMatched(true); setTimeout(onComplete, 1500); }}
              className="px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl text-3xl font-bold text-indigo-500 cursor-grab active:cursor-grabbing border-2 border-indigo-100"
            >
              قطة
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-8 text-5xl">
              🎉👏
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
