import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

const INGREDIENTS = [
  { id: 'bread-bottom', name: 'Bread', emoji: '🍞' },
  { id: 'lettuce', name: 'Lettuce', emoji: '🥬' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀' },
  { id: 'burger', name: 'Burger', emoji: '🍔' },
  { id: 'bread-top', name: 'Bread', emoji: '🍞' },
];

export default function KitchenSandwichMaker({ onComplete, onBack }: Props) {
  const [stack, setStack] = useState<string[]>([]);
  const targetOrder = INGREDIENTS.map(i => i.id);

  const handleAdd = (id: string) => {
    if (stack.length < targetOrder.length) {
      const newStack = [...stack, id];
      setStack(newStack);
      if (newStack.length === targetOrder.length) {
        if (newStack.every((val, index) => val === targetOrder[index])) {
          setTimeout(() => onComplete(), 1000);
        } else {
          // Reset if wrong
          setTimeout(() => setStack([]), 1000);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 bg-pink-100 rounded-3xl shadow-xl relative overflow-hidden">
      {onBack && (
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/50 hover:bg-white text-pink-500 p-2 rounded-full shadow-md transition-colors font-bold z-10">
          ← Back
        </button>
      )}
      <h2 className="text-3xl font-extrabold text-pink-500 mb-6 drop-shadow-sm font-sans tracking-wide">
        Sandwich Maker! 🥪
      </h2>
      <p className="text-pink-400 mb-6 font-medium text-lg text-center">Build: Bread 🍞 ➔ Lettuce 🥬 ➔ Cheese 🧀 ➔ Burger 🍔 ➔ Bread 🍞</p>
      
      <div className="flex gap-4 mb-8 flex-wrap justify-center">
        {INGREDIENTS.map((ing) => (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            key={ing.id + '-btn'}
            onClick={() => handleAdd(ing.id)}
            className="text-5xl bg-white rounded-2xl p-4 shadow-lg border-4 border-pink-200 hover:border-pink-400 transition-colors"
          >
            {ing.emoji}
          </motion.button>
        ))}
      </div>

      <div className="relative w-64 h-64 bg-white/40 rounded-3xl border-4 border-dashed border-pink-300 flex flex-col-reverse items-center justify-start p-4 overflow-hidden">
        <AnimatePresence>
          {stack.map((id, index) => {
            const ingredient = INGREDIENTS.find(i => i.id === id);
            return (
              <motion.div
                key={index + '-' + id}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-6xl -mt-6 drop-shadow-xl"
                style={{ zIndex: index }}
              >
                {ingredient?.emoji}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {stack.length === 0 && <span className="text-pink-300/50 font-bold text-xl my-auto">Plate Empty</span>}
      </div>
      <button onClick={() => setStack([])} className="mt-4 text-pink-500 underline font-semibold hover:text-pink-600">Clear Plate</button>
    </div>
  );
}
