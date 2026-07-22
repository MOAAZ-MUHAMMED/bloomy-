import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  level?: number;
  onComplete: () => void;
  onBack?: () => void;
}

export default function MathSpaceTower({ level = 1, onComplete, onBack }: Props) {
  const [stack, setStack] = useState<number[]>([]);
  const [targetOrder, setTargetOrder] = useState<number[]>([]);
  const [available, setAvailable] = useState<number[]>([]);
  const [wobble, setWobble] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const hasCompletedRef = useRef(false);

  const getMaxNum = (lvl: number) => {
    if (lvl <= 1) return 5;
    if (lvl === 2) return 10;
    if (lvl === 3) return 20;
    return 30; // Level 4+
  };

  useEffect(() => {
    hasCompletedRef.current = false;
    const maxN = getMaxNum(level);
    // Pick 4 unique random numbers in range [1..maxN]
    const numsSet = new Set<number>();
    while (numsSet.size < 4) {
      const rand = Math.floor(Math.random() * maxN) + 1;
      numsSet.add(rand);
    }
    const sorted = Array.from(numsSet).sort((a, b) => a - b);
    const shuffled = [...sorted].sort(() => Math.random() - 0.5);
    setTargetOrder(sorted);
    setAvailable(shuffled);
    setStack([]);
    setWon(false);
  }, [level]);

  const handleBlockClick = (num: number) => {
    if (stack.includes(num) || won || hasCompletedRef.current) return;
    
    const expected = targetOrder[stack.length];
    if (num === expected) {
      const newStack = [...stack, num];
      setStack(newStack);
      if (newStack.length === 4) {
        setWon(true);
        setTimeout(() => {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete();
          }
        }, 2200);
      }
    } else {
      setWobble(num);
      setTimeout(() => setWobble(null), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center py-8 font-sans select-none text-white p-4" dir="rtl">
      {onBack && (
        <button onClick={onBack} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full shadow-lg text-white transition-all z-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      )}

      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-black text-amber-300 mb-2 drop-shadow-md">برج الفضاء 🚀</h1>
        <p className="text-base md:text-lg font-bold text-indigo-200">ابنِ برج الصاروخ برص الأرقام من الأصغر إلى الأكبر!</p>
        <span className="inline-block mt-3 bg-indigo-800/80 backdrop-blur border border-indigo-500/50 text-indigo-100 px-4 py-1.5 rounded-full font-bold text-sm">
          المستوى: {level}
        </span>
      </div>
      
      <div className="flex-1 flex w-full max-w-2xl px-4 gap-6 items-center justify-center">
        {/* Available Blocks */}
        <div className="flex-1 flex flex-col items-center gap-4 py-6">
          <h2 className="text-sm font-extrabold text-indigo-300 mb-2">اضغط الرقم الأصغر:</h2>
          {available.map((num) => (
            !stack.includes(num) && (
              <motion.button
                key={num}
                onClick={() => handleBlockClick(num)}
                animate={wobble === num ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="w-24 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg border-2 border-indigo-300 flex items-center justify-center text-3xl font-black text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {num}
              </motion.button>
            )
          ))}
        </div>

        {/* Tower Building Area */}
        <div className="flex-1 flex flex-col justify-end items-center pb-6 border-r-2 border-dashed border-indigo-500/30 pr-6">
          <div className="w-36 flex flex-col-reverse items-center min-h-[300px] justify-start">
            {/* Base Pad */}
            <div className="w-36 h-10 bg-slate-700 rounded-t-2xl border-t-4 border-cyan-400 flex items-center justify-center text-cyan-300 text-xs font-black shadow-lg">
              منصة الإطلاق 🛸
            </div>
            {stack.map((num) => (
              <motion.div
                key={num}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-32 h-16 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center text-3xl font-black text-slate-900 my-1"
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {won && (
        <motion.div
          initial={{ y: 200, opacity: 1 }}
          animate={{ y: -600, opacity: 0 }}
          transition={{ duration: 2.2, ease: "easeIn" }}
          className="fixed bottom-10 text-9xl z-50 pointer-events-none"
        >
          🚀✨
        </motion.div>
      )}
    </div>
  );
}
