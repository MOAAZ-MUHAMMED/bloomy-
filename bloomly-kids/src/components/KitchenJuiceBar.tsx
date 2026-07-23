import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

const FRUITS = [
  { id: 'strawberry', name: 'فراولة', emoji: '🍓', color: '#ef4444' },
  { id: 'banana', name: 'موز', emoji: '🍌', color: '#eab308' },
  { id: 'mango', name: 'مانجو', emoji: '🥭', color: '#f97316' },
  { id: 'watermelon', name: 'بطيخ', emoji: '🍉', color: '#dc2626' },
  { id: 'kiwi', name: 'كيوي', emoji: '🥝', color: '#65a30d' },
  { id: 'orange', name: 'برتقال', emoji: '🍊', color: '#f97316' },
  { id: 'blueberry', name: 'توت', emoji: '🫐', color: '#3b82f6' }
];

export default function KitchenJuiceBar({ onComplete, onBack }: Props) {
  const [selectedFruits, setSelectedFruits] = useState<{ id: string; emoji: string; color: string }[]>([]);
  const [hasIce, setHasIce] = useState(false);
  const [hasMilk, setHasMilk] = useState(false);
  const [isBlending, setIsBlending] = useState(false);
  const [isBlended, setIsBlended] = useState(false);
  const [done, setDone] = useState(false);
  const hasCompletedRef = useRef(false);

  const playSound = (type: 'drop' | 'blend' | 'win') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'drop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      } else if (type === 'blend') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (type === 'drop' ? 0.1 : 0.6));
    } catch (e) {}
  };

  const addFruit = (fruit: typeof FRUITS[0]) => {
    if (selectedFruits.length >= 6 || isBlending || isBlended) return;
    setSelectedFruits(prev => [...prev, { id: `${fruit.id}-${Date.now()}`, emoji: fruit.emoji, color: fruit.color }]);
    playSound('drop');
  };

  const handleBlend = () => {
    if (selectedFruits.length === 0 || isBlending || isBlended) return;
    setIsBlending(true);
    playSound('blend');

    setTimeout(() => {
      setIsBlending(false);
      setIsBlended(true);
      playSound('win');
    }, 2200);
  };

  const handleFinish = () => {
    if (done || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setDone(true);
    playSound('win');

    setTimeout(() => {
      onComplete();
    }, 1800);
  };

  // Mix color computation
  const juiceColor = selectedFruits.length > 0 ? selectedFruits[selectedFruits.length - 1].color : '#ec4899';

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-100 flex flex-col items-center justify-center font-sans touch-none p-4 select-none" dir="rtl">
      {onBack && (
        <button onClick={onBack} className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg text-[#E01E5A] hover:bg-red-50 hover:scale-105 transition-all z-50 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      )}

      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-5xl font-black text-purple-900 mb-2 drop-shadow-sm">عصير بلومي المنعش 🍹</h1>
        <p className="text-base md:text-lg font-bold text-purple-700">
          {!isBlended ? 'اختر الفواكه المفضلة وأضف الحليب والثلج في الخلاط السحري! 🌪️' : 'عصيدك جاهز ولذيذ! صحة وهنا 🍹'}
        </p>
      </div>

      {/* Blender / Glass View */}
      <div className="relative my-4 flex items-center justify-center">
        {!isBlended ? (
          // Blender Container
          <div className={`w-52 h-72 sm:w-64 sm:h-80 rounded-b-3xl rounded-t-lg border-4 border-slate-300 bg-white/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-end p-4 shadow-2xl transition-all
            ${isBlending ? 'animate-bounce border-pink-400' : ''}`}
          >
            {/* Liquid level */}
            <motion.div
              initial={{ height: '0%' }}
              animate={{ height: isBlending ? '80%' : `${Math.min(75, selectedFruits.length * 15 + (hasMilk ? 15 : 0))}%` }}
              className="w-full rounded-b-2xl transition-all duration-700 opacity-80"
              style={{ backgroundColor: juiceColor }}
            />

            {/* Floating fruit pieces inside blender */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 p-6 pointer-events-none">
              {selectedFruits.map(f => (
                <motion.span
                  key={f.id}
                  animate={isBlending ? { rotate: 360, scale: [1, 1.3, 0.8, 1] } : { y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: isBlending ? 0.4 : 2 }}
                  className="text-3xl sm:text-4xl filter drop-shadow-sm"
                >
                  {f.emoji}
                </motion.span>
              ))}
              {hasIce && <span className="text-3xl animate-pulse">🧊</span>}
              {hasMilk && <span className="text-3xl animate-pulse">🥛</span>}
            </div>

            {/* Blender base */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-44 h-10 bg-slate-800 rounded-t-xl border-t-2 border-slate-600 flex items-center justify-center">
              <div className={`w-4 h-4 rounded-full ${isBlending ? 'bg-green-400 animate-ping' : 'bg-red-500'}`} />
            </div>
          </div>
        ) : (
          // Served Glass View
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-56 h-80 rounded-b-full border-4 border-pink-300 bg-white/50 backdrop-blur-md relative overflow-hidden flex flex-col justify-end p-4 shadow-2xl"
          >
            <div className="w-full h-[85%] rounded-b-full transition-all duration-500 relative flex items-center justify-center" style={{ backgroundColor: juiceColor }}>
              <span className="text-5xl absolute -top-8">🍹</span>
              <span className="text-4xl absolute top-4 right-6">☂️</span>
              <span className="text-4xl absolute -top-12 left-8">🥤</span>
            </div>
          </motion.div>
        )}

        {/* Victory Celebration Overlay */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-3xl z-40 p-4 text-center border-4 border-purple-400"
            >
              <div className="text-6xl mb-2">🍹🎉⭐</div>
              <p className="text-2xl font-black text-purple-900">عصير منعش ولذيذ جداً!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fruit & Addons Toolbar */}
      {!isBlended && (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border-2 border-purple-200 max-w-xl w-full flex flex-col gap-3">
          <span className="text-xs font-black text-purple-900 block text-center">اضغط لإضافة الفواكه والإضافات للخلاط:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {FRUITS.map(f => (
              <button
                key={f.id}
                onClick={() => addFruit(f)}
                className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 px-3 py-2 rounded-2xl flex items-center gap-1 font-bold text-purple-900 text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-2xl">{f.emoji}</span>
                <span>{f.name}</span>
              </button>
            ))}
            <button
              onClick={() => { setHasIce(prev => !prev); playSound('drop'); }}
              className={`px-3 py-2 rounded-2xl flex items-center gap-1 font-bold text-sm shadow-sm transition-all cursor-pointer border-2 ${hasIce ? 'bg-blue-100 border-blue-400 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
            >
              <span className="text-2xl">🧊</span>
              <span>ثلج</span>
            </button>
            <button
              onClick={() => { setHasMilk(prev => !prev); playSound('drop'); }}
              className={`px-3 py-2 rounded-2xl flex items-center gap-1 font-bold text-sm shadow-sm transition-all cursor-pointer border-2 ${hasMilk ? 'bg-pink-100 border-pink-400 text-pink-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
            >
              <span className="text-2xl">🥛</span>
              <span>حليب</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => { setSelectedFruits([]); setHasIce(false); setHasMilk(false); setIsBlended(false); setIsBlending(false); setDone(false); hasCompletedRef.current = false; }}
          className="bg-white text-purple-800 px-6 py-3 rounded-2xl font-bold shadow-md border-2 border-purple-200 hover:bg-purple-50 transition-all cursor-pointer"
        >
          🧹 عصير جديد
        </button>

        {selectedFruits.length > 0 && !isBlended && (
          <button
            onClick={handleBlend}
            disabled={isBlending}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-purple-300 cursor-pointer flex items-center gap-2 text-lg"
          >
            🌪️ خلط العصير!
          </button>
        )}

        {isBlended && !done && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleFinish}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-green-300 cursor-pointer text-lg"
          >
            🌟 شرب العصير!
          </motion.button>
        )}
      </div>
    </div>
  );
}
