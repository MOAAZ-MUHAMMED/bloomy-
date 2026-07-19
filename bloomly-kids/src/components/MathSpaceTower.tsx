import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function MathSpaceTower({ onComplete, onBack }: Props) {
  const [stack, setStack] = useState<number[]>([]);
  const [available] = useState([2, 4, 1, 3]);
  const [wobble, setWobble] = useState<number | null>(null);

  const handleBlockClick = (num: number) => {
    if (stack.includes(num)) return;
    
    const expected = stack.length + 1;
    if (num === expected) {
      const newStack = [...stack, num];
      setStack(newStack);
      if (newStack.length === 4) {
        setTimeout(onComplete, 2000);
      }
    } else {
      setWobble(num);
      setTimeout(() => setWobble(null), 500);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center py-10 font-sans">
      {onBack && (
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md text-indigo-400 hover:text-indigo-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      )}
      <h1 className="text-4xl font-bold text-purple-500 mb-8">Space Tower 🚀</h1>
      
      <div className="flex-1 flex w-full max-w-2xl px-4">
        {/* Available Blocks */}
        <div className="flex-1 flex flex-col items-center gap-4 pt-10">
          {available.map((num) => (
            !stack.includes(num) && (
              <motion.button
                key={num}
                onClick={() => handleBlockClick(num)}
                animate={wobble === num ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="w-24 h-16 bg-pink-300 rounded-lg shadow-md flex items-center justify-center text-3xl font-bold text-white hover:bg-pink-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {num}
              </motion.button>
            )
          ))}
        </div>

        {/* Tower Building Area */}
        <div className="flex-1 flex flex-col justify-end items-center pb-10 border-l-4 border-dashed border-indigo-200">
          <div className="w-32 flex flex-col-reverse items-center">
            {stack.map((num) => (
              <motion.div
                key={num}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-28 h-16 bg-teal-300 rounded-lg shadow-lg border-2 border-white flex items-center justify-center text-3xl font-bold text-white mb-1"
              >
                {num}
              </motion.div>
            ))}
            {/* Base */}
            <div className="w-40 h-8 bg-gray-400 rounded-t-xl mt-1 flex items-center justify-center text-white text-sm font-bold">PAD</div>
          </div>
        </div>
      </div>
      
      {stack.length === 4 && (
        <motion.div initial={{ y: 200 }} animate={{ y: -500 }} transition={{ duration: 2 }} className="absolute text-8xl">
          🚀
        </motion.div>
      )}
    </div>
  );
}
