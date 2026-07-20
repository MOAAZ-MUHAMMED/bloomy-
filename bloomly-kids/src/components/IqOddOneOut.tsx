import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface IqOddOneOutProps {
  onWin: (stars: number) => void;
}

const levels = [
  { normal: '🐶', odd: '🐱' },
  { normal: '🍎', odd: '🍌' },
  { normal: '🚗', odd: '✈️' },
  { normal: '🌳', odd: '🌵' },
  { normal: '⚽', odd: '🏀' },
  { normal: '🍔', odd: '🍕' },
  { normal: '🎈', odd: '🪁' },
  { normal: '🦁', odd: '🐯' },
  { normal: '🚀', odd: '🛸' },
  { normal: '🎸', odd: '🎻' },
];

export default function IqOddOneOut({ onWin }: IqOddOneOutProps) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [items, setItems] = useState<{ id: number; emoji: string; isOdd: boolean }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [wrongShakeId, setWrongShakeId] = useState<number | null>(null);

  const initLevel = () => {
    const level = levels[levelIndex];
    let newItems = [
      { id: 1, emoji: level.normal, isOdd: false },
      { id: 2, emoji: level.normal, isOdd: false },
      { id: 3, emoji: level.normal, isOdd: false },
      { id: 4, emoji: level.odd, isOdd: true },
    ];
    // Shuffle
    newItems.sort(() => Math.random() - 0.5);
    setItems(newItems);
  };

  useEffect(() => {
    initLevel();
  }, [levelIndex]);

  const handleItemClick = (isOdd: boolean, id: number) => {
    if (gameOver) return;

    if (isOdd) {
      // Play pop sound via global sfx if available or just proceed
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
        setTimeout(() => onWin(25), 1500); // Earn 25 stars for completing all levels
      }
    } else {
      // Wrong answer
      if ((window as any).sfx) (window as any).sfx.playWrong();
      setWrongShakeId(id);
      setTimeout(() => setWrongShakeId(null), 500);
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-6">🏆</motion.div>
        <h2 className="text-4xl font-black text-indigo-800 mb-4 drop-shadow-md">أنت عبقري!</h2>
        <p className="text-xl text-indigo-600 font-bold mb-8 text-center px-4">نجحت في اكتشاف جميع الأشياء المختلفة!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-indigo-200 shadow-md mb-8">
        <h2 className="text-2xl font-black text-indigo-700">اكتشف المختلف 🕵️‍♂️</h2>
        <div className="flex gap-1 justify-center mt-2">
          {levels.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= levelIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-indigo-200'}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-lg w-full">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.button
              key={item.id + '-' + levelIndex} // Force re-animation on level change
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotate: 0,
                x: wrongShakeId === item.id ? [-10, 10, -10, 10, 0] : 0
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
              onClick={() => handleItemClick(item.isOdd, item.id)}
              className="aspect-square bg-white rounded-3xl sm:rounded-[2rem] flex items-center justify-center text-6xl sm:text-8xl cursor-pointer shadow-[0_8px_0_0_#cbd5e1] hover:translate-y-1 hover:shadow-[0_4px_0_0_#cbd5e1] active:translate-y-2 active:shadow-[0_0_0_0_#cbd5e1] border-4 border-slate-100 transition-all"
            >
              <span className="drop-shadow-lg">{item.emoji}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
