import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function MathNumberTrain({ onComplete, onBack }: Props) {
  const [placed, setPlaced] = useState(false);
  const [options] = useState([5, 3, 7]);
  
  const handleDragEnd = (event: any, info: any, num: number) => {
    if (num === 3) {
      if (info.point.y < window.innerHeight / 2) {
        setPlaced(true);
        setTimeout(onComplete, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center font-sans overflow-hidden">
      {onBack && (
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md text-pink-400 hover:text-pink-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      )}
      <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-12 drop-shadow-sm">Number Train 🚂</h1>
      
      <div className="flex gap-4 mb-20 items-end">
        {[1, 2, null, 4].map((num, i) => (
          <div key={i} className="relative">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg ${num ? 'bg-blue-300' : 'bg-gray-200 border-4 border-dashed border-gray-300'}`}>
              {num || (placed ? '3' : '?')}
            </div>
            {/* Wheels */}
            <div className="absolute -bottom-4 left-2 w-6 h-6 bg-gray-700 rounded-full border-4 border-gray-400"></div>
            <div className="absolute -bottom-4 right-2 w-6 h-6 bg-gray-700 rounded-full border-4 border-gray-400"></div>
            {i > 0 && <div className="absolute top-1/2 -left-4 w-4 h-2 bg-gray-400 -translate-y-1/2"></div>}
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {options.map((num) => (
          <motion.div
            key={num}
            drag={!placed}
            dragSnapToOrigin={true}
            onDragEnd={(e, info) => handleDragEnd(e, info, num)}
            className={`w-16 h-16 md:w-20 md:h-20 bg-yellow-300 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-md cursor-grab active:cursor-grabbing ${placed && num === 3 ? 'opacity-0' : 'opacity-100'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {num}
          </motion.div>
        ))}
      </div>
      
      {placed && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1/4 text-6xl"
        >
          🎉
        </motion.div>
      )}
    </div>
  );
}
