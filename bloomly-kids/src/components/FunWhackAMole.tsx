import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function FunWhackAMole({ onComplete, onBack }: Props) {
  const [moles, setMoles] = useState<boolean[]>(Array(6).fill(false));
  const [score, setScore] = useState(0);
  const targetScore = 5;

  useEffect(() => {
    if (score >= targetScore) {
      setTimeout(onComplete, 500);
      return;
    }
    
    const interval = setInterval(() => {
      setMoles(prev => {
        const next = [...prev];
        const rand = Math.floor(Math.random() * 6);
        next[rand] = true;
        setTimeout(() => {
          setMoles(current => {
            const temp = [...current];
            temp[rand] = false;
            return temp;
          });
        }, 800);
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [score, onComplete]);

  const handleWhack = (index: number) => {
    if (moles[index]) {
      setMoles(prev => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
      setScore(s => s + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 bg-green-100 rounded-3xl shadow-xl relative overflow-hidden">
      {onBack && (
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/50 hover:bg-white text-green-600 p-2 rounded-full shadow-md transition-colors font-bold z-10">
          ← Back
        </button>
      )}
      <h2 className="text-3xl font-extrabold text-green-600 mb-2 drop-shadow-sm font-sans tracking-wide">
        Whack-a-Worm! 🐛
      </h2>
      <p className="text-green-500 mb-6 font-bold text-xl bg-white/50 px-4 py-2 rounded-full shadow-sm">
        Score: {score} / {targetScore}
      </p>

      <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
        {moles.map((isUp, i) => (
          <div key={i} className="relative w-24 h-24 bg-[#8B4513] rounded-full overflow-hidden border-8 border-[#654321] shadow-inner flex items-end justify-center">
            <div className="absolute w-full h-1/2 bg-black/20 bottom-0 rounded-b-full pointer-events-none"></div>
            <AnimatePresence>
              {isUp && (
                <motion.button
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  exit={{ y: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => handleWhack(i)}
                  className="text-6xl absolute bottom-0 hover:scale-110 active:scale-90 transition-transform origin-bottom cursor-pointer"
                >
                  🐛
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
