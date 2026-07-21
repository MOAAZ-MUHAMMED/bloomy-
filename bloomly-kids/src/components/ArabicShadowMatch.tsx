import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  level?: number;
  onComplete: () => void;
  onBack?: () => void;
}

interface ShadowItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

const ITEMS_POOL: ShadowItem[] = [
  { id: 'lion', name: 'أسد', emoji: '🦁', color: '#FF9800' },
  { id: 'apple', name: 'تفاحة', emoji: '🍎', color: '#EF4444' },
  { id: 'rocket', name: 'صاروخ', emoji: '🚀', color: '#3B82F6' },
  { id: 'car', name: 'سيارة', emoji: '🚗', color: '#E11D48' },
  { id: 'plane', name: 'طائرة', emoji: '✈️', color: '#0EA5E9' },
  { id: 'bear', name: 'دبدوب', emoji: '🧸', color: '#D97706' },
  { id: 'cat', name: 'قطة', emoji: '🐱', color: '#A855F7' },
  { id: 'bird', name: 'عصفور', emoji: '🐦', color: '#10B981' },
  { id: 'butterfly', name: 'فراشة', emoji: '🦋', color: '#EC4899' },
  { id: 'flower', name: 'زهرة', emoji: '🌸', color: '#F43F5E' }
];

export default function ArabicShadowMatch({ level = 1, onComplete, onBack }: Props) {
  const [items, setItems] = useState<ShadowItem[]>([]);
  const [shuffledCards, setShuffledCards] = useState<ShadowItem[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const getItemCount = (lvl: number) => {
    if (lvl <= 1) return 2;
    if (lvl === 2) return 3;
    if (lvl === 3) return 4;
    return 5;
  };

  useEffect(() => {
    const count = getItemCount(level);
    const shuffledPool = [...ITEMS_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffledPool.slice(0, count);
    
    setItems(selected);
    setShuffledCards([...selected].sort(() => 0.5 - Math.random()));
    setMatchedIds([]);
    setSelectedId(null);
    setFeedback('idle');
  }, [level]);

  const playSound = (type: 'correct' | 'wrong' | 'pop') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const handleCardClick = (item: ShadowItem) => {
    if (matchedIds.includes(item.id)) return;
    playSound('pop');
    setSelectedId(item.id);
  };

  const handleShadowClick = (shadowItem: ShadowItem) => {
    if (matchedIds.includes(shadowItem.id)) return;
    if (!selectedId) return;

    if (selectedId === shadowItem.id) {
      // Correct Match!
      playSound('correct');
      setFeedback('correct');
      const newMatched = [...matchedIds, shadowItem.id];
      setMatchedIds(newMatched);
      setSelectedId(null);

      if (newMatched.length === items.length) {
        setTimeout(onComplete, 1800);
      } else {
        setTimeout(() => setFeedback('idle'), 800);
      }
    } else {
      // Wrong Match
      playSound('wrong');
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 600);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-between p-4 font-sans select-none relative overflow-hidden" dir="rtl">
      
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-purple-200 flex items-center justify-center text-xl text-purple-700 hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer"
        >
          ✖
        </button>
      )}

      {/* Header */}
      <div className="text-center pt-6 z-10">
        <h1 className="text-3xl sm:text-5xl font-black text-[#4D2B82] mb-2 drop-shadow-sm">مطابقة الظل 👤</h1>
        <p className="text-base sm:text-lg font-bold text-purple-700">اضغط الكارت الملون ثم اضغط علامة الظل المطابقة!</p>
        <span className="inline-block mt-3 bg-purple-600 text-white px-5 py-1.5 rounded-full font-black text-sm shadow">
          المستوى {level}
        </span>
      </div>

      {/* Top Area: Shadow Silhouettes */}
      <div className="w-full max-w-4xl flex flex-wrap justify-center items-center gap-4 sm:gap-6 my-6 z-10">
        {items.map((item) => {
          const isMatched = matchedIds.includes(item.id);

          return (
            <motion.div
              key={`shadow-${item.id}`}
              onClick={() => handleShadowClick(item)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-24 h-28 sm:w-36 sm:h-40 rounded-3xl flex flex-col items-center justify-center p-3 border-4 transition-all cursor-pointer relative shadow-lg
                ${isMatched 
                  ? 'bg-green-100 border-green-400 shadow-green-200' 
                  : selectedId 
                    ? 'bg-white border-purple-400 border-dashed animate-pulse' 
                    : 'bg-white/80 border-purple-300'}`}
            >
              <div className={`text-5xl sm:text-7xl transition-all ${isMatched ? 'brightness-100' : 'brightness-0 opacity-80 filter contrast-200'}`}>
                {item.emoji}
              </div>
              <span className={`text-xs sm:text-sm font-black mt-2 ${isMatched ? 'text-green-700' : 'text-purple-400'}`}>
                {isMatched ? item.name : '؟'}
              </span>

              {isMatched && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 text-3xl"
                >
                  ✅
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Area: Colored Item Cards */}
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-3xl border-4 border-white shadow-xl flex flex-wrap justify-center gap-4 sm:gap-6 z-10 mb-6">
        <AnimatePresence>
          {shuffledCards.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedId === item.id;

            if (isMatched) return null;

            return (
              <motion.div
                key={`card-${item.id}`}
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0 }}
                onClick={() => handleCardClick(item)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderColor: item.color }}
                className={`w-24 h-28 sm:w-32 sm:h-36 rounded-2xl flex flex-col items-center justify-center p-2 border-4 cursor-pointer shadow-md transition-all relative overflow-hidden bg-white
                  ${isSelected ? 'ring-4 ring-purple-500 scale-105 shadow-xl bg-purple-50' : 'hover:shadow-lg'}`}
              >
                <div className="text-4xl sm:text-6xl drop-shadow-md mb-1">{item.emoji}</div>
                <span className="text-sm sm:text-base font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-full w-full text-center">
                  {item.name}
                </span>

                {isSelected && (
                  <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white font-extrabold px-2 py-0.5 rounded-full animate-bounce">
                    محدد 👈
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
