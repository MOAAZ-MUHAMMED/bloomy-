import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function EnglishColorCloud({ onComplete, onBack }: Props) {
  const [raining, setRaining] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-100 to-blue-200 p-4 font-sans overflow-hidden">
      <div className="relative w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[3rem] p-8 flex flex-col items-center h-[500px]">
        {onBack && (
          <button onClick={onBack} className="absolute top-6 left-6 text-2xl hover:scale-110 transition-transform z-10">
            🔙
          </button>
        )}
        <h2 className="text-3xl font-bold text-cyan-600 mb-8 text-center z-10">Make it rain!</h2>
        
        <div className="relative flex-1 flex flex-col items-center w-full">
          <motion.div 
            animate={raining ? { y: [-5, 5, -5] } : {}} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[8rem] relative z-10 select-none drop-shadow-xl"
          >
            ☁️
          </motion.div>

          {raining && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute top-32 flex space-x-2 text-2xl z-0"
            >
              <motion.span animate={{ y: [0, 150], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }}>💧</motion.span>
              <motion.span animate={{ y: [0, 150], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}>💧</motion.span>
              <motion.span animate={{ y: [0, 150], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.4 }}>💧</motion.span>
            </motion.div>
          )}

          <div className="mt-auto pb-6 relative z-20">
            {!raining ? (
              <motion.div
                drag
                dragConstraints={{ top: -200, bottom: 0, left: -100, right: 100 }}
                onDragEnd={(e, info) => {
                  if (info.offset.y < -50) {
                    setRaining(true);
                    setTimeout(onComplete, 2000);
                  }
                }}
                className="text-6xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform drop-shadow-2xl"
              >
                🪣
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl text-cyan-700 font-bold bg-white/70 px-6 py-3 rounded-full">
                Splendid! 🌈
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
