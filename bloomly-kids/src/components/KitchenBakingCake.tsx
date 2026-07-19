import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function KitchenBakingCake({ onComplete, onBack }: Props) {
  const [stirCount, setStirCount] = useState(0);
  const [step, setStep] = useState<'stir' | 'bake' | 'decorate'>('stir');
  const [decorations, setDecorations] = useState<{x: number, y: number, emoji: string}[]>([]);

  const handleStir = () => {
    if (step === 'stir') {
      const nextCount = stirCount + 1;
      setStirCount(nextCount);
      if (nextCount >= 10) {
        setStep('bake');
      }
    }
  };

  const handleBake = () => {
    if (step === 'bake') {
      setStep('decorate');
    }
  };

  const handleDecorate = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step === 'decorate') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newDecs = [...decorations, { x, y, emoji: ['🍓', '🍒', '✨', '🍫'][Math.floor(Math.random() * 4)] }];
      setDecorations(newDecs);
      if (newDecs.length >= 5) {
        setTimeout(onComplete, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 bg-purple-100 rounded-3xl shadow-xl relative overflow-hidden">
      {onBack && (
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/50 hover:bg-white text-purple-500 p-2 rounded-full shadow-md transition-colors font-bold z-10">
          ← Back
        </button>
      )}
      <h2 className="text-3xl font-extrabold text-purple-500 mb-6 drop-shadow-sm font-sans tracking-wide">
        Bake a Cake! 🎂
      </h2>
      
      {step === 'stir' && (
        <div className="text-center">
          <p className="text-purple-400 mb-4 font-medium text-lg">Tap to stir the bowl!</p>
          <motion.div 
            className="w-48 h-48 bg-purple-200 rounded-full border-8 border-purple-300 shadow-inner flex items-center justify-center text-6xl cursor-pointer select-none mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 15 }}
            onClick={handleStir}
          >
            🥣
          </motion.div>
          <div className="mt-6 w-48 bg-purple-200 rounded-full h-4 overflow-hidden mx-auto">
            <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${(stirCount / 10) * 100}%` }}></div>
          </div>
        </div>
      )}

      {step === 'bake' && (
        <div className="text-center">
          <p className="text-purple-400 mb-4 font-medium text-lg">Put it in the oven!</p>
          <motion.button 
            className="w-48 h-48 bg-gray-700 rounded-xl shadow-xl flex items-center justify-center text-7xl hover:bg-gray-600 transition-colors mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBake}
          >
            🔥
          </motion.button>
        </div>
      )}

      {step === 'decorate' && (
        <div className="text-center">
          <p className="text-purple-400 mb-4 font-medium text-lg">Tap the cake to decorate! (Need 5)</p>
          <div 
            className="relative w-64 h-64 bg-pink-200 rounded-t-full rounded-b-xl border-b-8 border-pink-300 shadow-lg cursor-pointer overflow-hidden mx-auto"
            onClick={handleDecorate}
          >
            {decorations.map((dec, i) => (
              <motion.span 
                key={i} 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute text-3xl pointer-events-none drop-shadow-md"
                style={{ left: dec.x - 15, top: dec.y - 15 }}
              >
                {dec.emoji}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
