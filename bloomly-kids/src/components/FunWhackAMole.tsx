import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function FunWhackAMole({ onComplete, onBack }: Props) {
  const [moles, setMoles] = useState<boolean[]>(Array(6).fill(false));
  const [hitIndex, setHitIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const targetScore = 5;

  const completedRef = useRef(false);
  const activePopIds = useRef<number[]>(Array(6).fill(0));

  useEffect(() => {
    if (score >= targetScore) {
      if (!completedRef.current) {
        completedRef.current = true;
        setTimeout(() => {
          onComplete();
        }, 500);
      }
      return;
    }

    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 6);
      const popId = Date.now();
      activePopIds.current[rand] = popId;

      setMoles(prev => {
        const next = [...prev];
        next[rand] = true;
        return next;
      });

      // Auto pop down after 900ms
      setTimeout(() => {
        setMoles(current => {
          // Only pull down if this is still the same pop event
          if (activePopIds.current[rand] === popId) {
            const temp = [...current];
            temp[rand] = false;
            return temp;
          }
          return current;
        });
      }, 900);
    }, 1100);

    return () => clearInterval(interval);
  }, [score, onComplete]);

  const handleWhack = (index: number) => {
    // Prevent double clicking on the same mole
    if (!moles[index] || completedRef.current) return;

    // Invalidate popId immediately so auto-timeout doesn't interfere
    activePopIds.current[index] = 0;

    // Pop down immediately
    setMoles(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });

    setHitIndex(index);
    setTimeout(() => setHitIndex(null), 300);

    setScore(s => s + 1);
  };

  return (
    <div className="fixed inset-0 w-full h-full p-6 bg-gradient-to-b from-green-100 to-emerald-200 text-white font-sans select-none flex flex-col items-center justify-center" dir="rtl">
      {onBack && (
        <button onClick={onBack} className="absolute top-4 right-4 bg-white/70 hover:bg-white text-green-700 px-4 py-2 rounded-full shadow-md transition-colors font-bold z-10 text-sm">
          ← خروج
        </button>
      )}

      <h2 className="text-3xl font-extrabold text-green-800 mb-1 drop-shadow-sm tracking-wide">
        اضرب الدودة 🐛
      </h2>
      <p className="text-green-700 mb-6 font-bold text-lg bg-white/60 px-5 py-1.5 rounded-full shadow-sm border border-green-300">
        النقاط: <span className="text-emerald-700 text-xl font-black">{score}</span> / {targetScore} ⭐
      </p>

      <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
        {moles.map((isUp, i) => (
          <div key={i} className="relative w-24 h-24 bg-[#6A4028] rounded-full overflow-hidden border-4 border-[#4A2B18] shadow-[inset_0_8px_12px_rgba(0,0,0,0.6)] flex items-end justify-center">
            {/* Dirt hole overlay */}
            <div className="absolute w-full h-1/2 bg-[#3D2211]/40 bottom-0 rounded-b-full pointer-events-none border-t border-[#8B5A2B]/40" />

            {/* Hit star effect */}
            {hitIndex === i && (
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center text-4xl z-20 pointer-events-none"
              >
                💥
              </motion.div>
            )}

            <AnimatePresence>
              {isUp && (
                <motion.button
                  initial={{ y: 55 }}
                  animate={{ y: 0 }}
                  exit={{ y: 55 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  onClick={() => handleWhack(i)}
                  className="text-5xl absolute bottom-1 hover:scale-110 active:scale-95 transition-transform origin-bottom cursor-pointer select-none drop-shadow-md z-10"
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
