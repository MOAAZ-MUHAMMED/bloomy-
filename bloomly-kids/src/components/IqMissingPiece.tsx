import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface IqMissingPieceProps {
  onWin: (stars: number) => void;
}

const levels = [
  {
    grid: [
      ['🍎', '🍎', '🍎'],
      ['🍎', '?', '🍎'],
      ['🍎', '🍎', '🍎']
    ],
    options: ['🍌', '🍎', '🍇'],
    correctIndex: 1
  },
  {
    grid: [
      ['🐶', '🐱', '🐶'],
      ['🐱', '🐶', '🐱'],
      ['🐶', '?', '🐶']
    ],
    options: ['🐱', '🐰', '🐶'],
    correctIndex: 0
  },
  {
    grid: [
      ['🔴', '🔵', '🔴'],
      ['🔵', '🔴', '🔵'],
      ['🔴', '🔵', '?']
    ],
    options: ['🟡', '🔵', '🔴'],
    correctIndex: 2
  },
  {
    grid: [
      ['🚗', '🚕', '🚙'],
      ['🚗', '🚕', '🚙'],
      ['🚗', '?', '🚙']
    ],
    options: ['🚓', '🚕', '🚗'],
    correctIndex: 1
  },
  {
    grid: [
      ['⭐', '🌙', '⭐'],
      ['🌙', '?', '🌙'],
      ['⭐', '🌙', '⭐']
    ],
    options: ['⭐', '☀️', '🌙'],
    correctIndex: 0
  }
];

export default function IqMissingPiece({ onWin }: IqMissingPieceProps) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [wrongShakeId, setWrongShakeId] = useState<number | null>(null);

  const currentLevel = levels[levelIndex];

  const handleOptionClick = (idx: number) => {
    if (gameOver) return;

    if (idx === currentLevel.correctIndex) {
      if ((window as any).sfx) (window as any).sfx.playPop();
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4ade80', '#3b82f6', '#fbbf24']
      });

      if (levelIndex < levels.length - 1) {
        setTimeout(() => setLevelIndex(prev => prev + 1), 800);
      } else {
        setGameOver(true);
        setTimeout(() => onWin(25), 1500);
      }
    } else {
      if ((window as any).sfx) (window as any).sfx.playWrong();
      setWrongShakeId(idx);
      setTimeout(() => setWrongShakeId(null), 500);
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-6">🧩</motion.div>
        <h2 className="text-4xl font-black text-indigo-800 mb-4 drop-shadow-md">بطل البازل!</h2>
        <p className="text-xl text-indigo-600 font-bold mb-8 text-center px-4">أكملت جميع الأنماط بنجاح وذكاء!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4" dir="ltr">
      <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-indigo-200 shadow-md mb-8">
        <h2 className="text-2xl font-black text-indigo-700">أين الجزء الناقص؟ 🧩</h2>
        <div className="flex gap-1 justify-center mt-2">
          {levels.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= levelIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-indigo-200'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={levelIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          {/* The Puzzle Grid */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-slate-200 mb-8">
            <div className="grid grid-cols-3 gap-2">
              {currentLevel.grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`} 
                    className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-5xl sm:text-6xl rounded-2xl ${cell === '?' ? 'bg-slate-100 border-4 border-dashed border-slate-300' : 'bg-slate-50'}`}
                  >
                    {cell !== '?' && <span className="drop-shadow-sm">{cell}</span>}
                    {cell === '?' && <span className="text-slate-300 text-4xl">?</span>}
                  </div>
                ))
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex gap-4">
            {currentLevel.options.map((option, idx) => (
              <motion.button
                key={idx}
                animate={{
                  x: wrongShakeId === idx ? [-10, 10, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.4 }}
                onClick={() => handleOptionClick(idx)}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl flex items-center justify-center text-5xl sm:text-6xl cursor-pointer shadow-[0_6px_0_0_#cbd5e1] hover:translate-y-1 hover:shadow-[0_3px_0_0_#cbd5e1] active:translate-y-2 active:shadow-[0_0_0_0_#cbd5e1] border-2 border-slate-100 transition-all"
              >
                <span className="drop-shadow-sm">{option}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
