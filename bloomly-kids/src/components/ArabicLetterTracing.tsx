import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

const LETTERS_POOL = [
  { letter: 'أ', name: 'ألف', word: 'أسد 🦁', color: '#FF5A92' },
  { letter: 'ب', name: 'باء', word: 'بطة 🦆', color: '#5BC0F8' },
  { letter: 'ت', name: 'تاء', word: 'تفاحة 🍎', color: '#2ECC71' },
  { letter: 'ث', name: 'ثاء', word: 'ثعلب 🦊', color: '#FFD700' },
  { letter: 'ج', name: 'جيم', word: 'جمل 🐪', color: '#A855F7' },
  { letter: 'ح', name: 'حاء', word: 'حصان 🐴', color: '#FF9F29' },
  { letter: 'خ', name: 'خاء', word: 'خاروف 🐑', color: '#10B981' },
  { letter: 'د', name: 'دال', word: 'دبدوب 🧸', color: '#EC4899' },
  { letter: 'ذ', name: 'ذال', word: 'ذئب 🐺', color: '#6366F1' },
  { letter: 'ر', name: 'راء', word: 'رمان 🍎', color: '#F43F5E' }
];

export default function ArabicLetterTracing({ onComplete, onBack }: Props) {
  const [sessionLetters, setSessionLetters] = useState<typeof LETTERS_POOL>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [traced, setTraced] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    // Select 5 random letters for this round
    const shuffled = [...LETTERS_POOL].sort(() => 0.5 - Math.random());
    setSessionLetters(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setTraced(false);
  }, []);

  const currentItem = sessionLetters[currentIndex] || LETTERS_POOL[0];

  const playPopSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const handleTraceComplete = () => {
    if (traced) return;
    setTraced(true);
    setShowSparkles(true);
    playPopSound();

    setTimeout(() => {
      setShowSparkles(false);
      if (currentIndex + 1 < 5) {
        setCurrentIndex((prev) => prev + 1);
        setTraced(false);
      } else {
        onComplete();
      }
    }, 1400);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-purple-200 flex flex-col items-center justify-between p-4 font-sans select-none relative overflow-hidden" dir="rtl">
      
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-pink-200 flex items-center justify-center text-xl text-pink-600 hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer"
        >
          ✖
        </button>
      )}

      {/* Progress Dots Bar (5 Letters) */}
      <div className="pt-6 z-10 flex flex-col items-center">
        <h1 className="text-3xl sm:text-5xl font-black text-rose-700 mb-2 drop-shadow-sm">تتبع الحروف العربية ✍️</h1>
        <p className="text-base sm:text-lg font-bold text-rose-600 mb-3">حرك القلم السحري لتتبع الحرف كاملًا!</p>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-6 py-2 rounded-full border-2 border-pink-300 shadow">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div 
              key={idx}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                idx < currentIndex 
                  ? 'bg-green-500 text-white scale-110' 
                  : idx === currentIndex 
                    ? 'bg-rose-500 text-white animate-bounce' 
                    : 'bg-rose-100 text-rose-400'
              }`}
            >
              {idx < currentIndex ? '✓' : idx + 1}
            </div>
          ))}
          <span className="mr-3 font-extrabold text-sm text-rose-800">الحرف {currentIndex + 1} من 5</span>
        </div>
      </div>

      {/* Letter Tracing Card */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-xl border-4 border-white shadow-2xl rounded-[3rem] p-8 flex flex-col items-center my-4 z-10">
        <div className="text-xl font-black text-slate-700 bg-rose-50 border-2 border-rose-200 px-6 py-1.5 rounded-full mb-6 shadow-sm">
          حرف {currentItem.name} - {currentItem.word}
        </div>

        <div className="relative text-[10rem] sm:text-[12rem] font-black text-rose-200 leading-none my-4 select-none flex items-center justify-center w-64 h-64 border-4 border-dashed border-rose-300 rounded-3xl bg-rose-50/50">
          <span style={{ color: traced ? currentItem.color : '#FCA5A5' }} className="transition-colors duration-500">
            {currentItem.letter}
          </span>

          {!traced && (
            <motion.div
              drag
              dragConstraints={{ top: -80, bottom: 80, left: -80, right: 80 }}
              onDragEnd={handleTraceComplete}
              onClick={handleTraceComplete}
              className="absolute w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-full cursor-grab active:cursor-grabbing shadow-xl border-4 border-white flex items-center justify-center text-2xl text-white hover:scale-110 active:scale-95 transition-transform"
            >
              ✏️
            </motion.div>
          )}

          {showSparkles && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1.5, rotate: 0 }}
              className="absolute text-6xl"
            >
              ✨🌟
            </motion.div>
          )}
        </div>

        <button
          onClick={handleTraceComplete}
          className="mt-4 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-lg rounded-full shadow-lg hover:shadow-xl active:translate-y-0.5 transition-all cursor-pointer border-2 border-white"
        >
          {traced ? 'تم التتبع! ✅' : 'تتبع الحرف ✨'}
        </button>
      </div>

    </div>
  );
}
