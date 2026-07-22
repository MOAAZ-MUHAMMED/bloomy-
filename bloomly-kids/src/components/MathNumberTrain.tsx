import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  level?: number;
  onComplete: () => void;
  onBack?: () => void;
}

export default function MathNumberTrain({ level = 1, onComplete, onBack }: Props) {
  const [round, setRound] = useState(1);
  const [placed, setPlaced] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [missingIndex, setMissingIndex] = useState<number>(2);
  const [missingValue, setMissingValue] = useState<number>(3);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const hasCompletedRef = useRef(false);

  // Max number based on level
  const getMaxNum = (lvl: number) => {
    if (lvl <= 1) return 5;
    if (lvl === 2) return 10;
    if (lvl === 3) return 20;
    return 25; // Level 4+ (1-25)
  };

  const generateTrainRound = () => {
    setPlaced(false);
    setFeedback('idle');
    const maxN = getMaxNum(level);
    
    // Generate a sequence of 4 consecutive numbers starting at startNum
    const maxStart = Math.max(1, maxN - 3);
    const startNum = Math.floor(Math.random() * maxStart) + 1;
    const seq = [startNum, startNum + 1, startNum + 2, startNum + 3];
    setSequence(seq);

    // Pick 1 missing position
    const missIdx = Math.floor(Math.random() * 4);
    setMissingIndex(missIdx);
    const correctVal = seq[missIdx];
    setMissingValue(correctVal);

    // Options: correct + 2 wrong options within level range
    const opts = [correctVal];
    while (opts.length < 3) {
      const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = Math.max(1, Math.min(maxN, correctVal + offset));
      if (!opts.includes(wrong)) {
        opts.push(wrong);
      }
    }
    opts.sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  useEffect(() => {
    hasCompletedRef.current = false;
    generateTrainRound();
  }, [level, round]);

  const handleOptionClick = (num: number) => {
    if (placed || feedback !== 'idle' || hasCompletedRef.current) return;

    if (num === missingValue) {
      setPlaced(true);
      setFeedback('correct');

      setTimeout(() => {
        if (round < 5) {
          setRound((prev) => prev + 1);
        } else {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete();
          }
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200 flex flex-col items-center justify-center font-sans overflow-hidden p-4 select-none" dir="rtl">
      {onBack && (
        <button onClick={onBack} className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg text-[#E01E5A] hover:bg-red-50 hover:scale-105 transition-all z-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      )}

      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-black text-[#4D2B82] mb-2 drop-shadow-sm">قطار الأرقام السريع 🚂</h1>
        <p className="text-base md:text-lg font-bold text-purple-700">ضع الرقم المناسب لإكمال عربة القطار!</p>
        <div className="inline-flex gap-4 mt-3 bg-white/80 backdrop-blur px-5 py-2 rounded-full border-2 border-purple-200 font-extrabold text-sm text-purple-900 shadow-sm">
          <span>المستوى: {level}</span>
          <span>•</span>
          <span>القطار: {round} / 5</span>
        </div>
      </div>

      {/* Train Cars */}
      <div className="flex gap-3 md:gap-5 mb-12 items-end justify-center w-full max-w-2xl px-4 overflow-x-auto py-6">
        {sequence.map((num, i) => {
          const isMissing = i === missingIndex;
          const showValue = !isMissing || placed;

          return (
            <div key={i} className="relative flex-shrink-0">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-xl transition-all border-4 ${
                  showValue
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-white'
                    : 'bg-white/80 border-dashed border-purple-400 text-purple-400 animate-pulse'
                }`}
              >
                {showValue ? (isMissing ? missingValue : num) : '?'}
              </motion.div>
              {/* Wheels */}
              <div className="absolute -bottom-3 left-2 w-5 h-5 bg-gray-800 rounded-full border-2 border-white shadow"></div>
              <div className="absolute -bottom-3 right-2 w-5 h-5 bg-gray-800 rounded-full border-2 border-white shadow"></div>
              {i > 0 && <div className="absolute top-1/2 -left-3 w-3 h-2 bg-purple-400 -translate-y-1/2 rounded"></div>}
            </div>
          );
        })}
      </div>

      {/* Options */}
      <div className="flex gap-4 md:gap-6">
        {options.map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOptionClick(num)}
            className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center text-3xl font-black text-amber-950 shadow-lg border-4 border-yellow-100 cursor-pointer"
          >
            {num}
          </motion.button>
        ))}
      </div>

      {/* Feedback modal */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-white/90 backdrop-blur-md px-8 py-6 rounded-3xl shadow-2xl border-4 border-green-400 flex flex-col items-center">
              <span className="text-7xl mb-2">🎉</span>
              <span className="text-2xl font-black text-green-600">ممتاز جداً!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
