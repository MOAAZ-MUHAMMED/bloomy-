import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onBack?: () => void;
}

export default function MathEquationCards({ onBack }: Props) {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#38BDF8] to-[#0284C7] flex flex-col justify-between p-3 sm:p-5 font-sans select-none overflow-hidden text-slate-900" dir="ltr">
      
      {/* Top Header */}
      <div className="flex justify-between items-center w-full z-20">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/90 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-red-500 font-black text-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            🏠
          </button>
        )}
        <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border-2 border-white text-purple-900 font-black text-lg">
          ✏️ بطاقات الأرقام والعمليات الحسابية 3D
        </div>
      </div>

      {/* 🪵 MAIN STACKED WOODEN CARDS CONTAINER */}
      <div className="flex-grow flex flex-col gap-4 items-center justify-center w-full max-w-2xl mx-auto my-auto py-2 overflow-y-auto">
        
        {/* WOODEN CARD 1: 1 × 3 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="w-full h-32 sm:h-40 rounded-3xl p-4 sm:p-6 shadow-2xl flex items-center justify-around relative bg-amber-800 border-4 border-amber-600 text-white"
        >
          <span className="text-5xl font-black text-amber-200">1</span>
          <span className="text-4xl font-black text-amber-400">×</span>
          <span className="text-5xl font-black text-amber-200">3</span>
        </motion.div>

        {/* WOODEN CARD 2: 6 ÷ 4 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="w-full h-32 sm:h-40 rounded-3xl p-4 sm:p-6 shadow-2xl flex items-center justify-around relative bg-amber-800 border-4 border-amber-600 text-white"
        >
          <span className="text-5xl font-black text-amber-200">6</span>
          <span className="text-4xl font-black text-amber-400">÷</span>
          <span className="text-5xl font-black text-amber-200">4</span>
        </motion.div>

        {/* WOODEN CARD 3: 7 = 5 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="w-full h-32 sm:h-40 rounded-3xl p-4 sm:p-6 shadow-2xl flex items-center justify-around relative bg-amber-800 border-4 border-amber-600 text-white"
        >
          <span className="text-5xl font-black text-amber-200">7</span>
          <span className="text-4xl font-black text-amber-400">=</span>
          <span className="text-5xl font-black text-amber-200">5</span>
        </motion.div>

      </div>

    </div>
  );
}
