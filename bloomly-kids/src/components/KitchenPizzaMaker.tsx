import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

const TOPPINGS = [
  { id: 'pepperoni', name: 'ببروني', emoji: '🍕', color: '#dc2626' },
  { id: 'mushroom', name: 'فطر', emoji: '🍄', color: '#92400e' },
  { id: 'olive', name: 'زيتون', emoji: '🫒', color: '#15803d' },
  { id: 'pepper', name: 'فلفل', emoji: '🫑', color: '#16a34a' },
  { id: 'pineapple', name: 'أناناس', emoji: '🍍', color: '#eab308' },
  { id: 'tomato', name: 'طماطم', emoji: '🍅', color: '#ef4444' },
  { id: 'cheese', name: 'جبن إضافي', emoji: '🧀', color: '#f59e0b' }
];

export default function KitchenPizzaMaker({ onComplete, onBack }: Props) {
  const [toppingsOnPizza, setToppingsOnPizza] = useState<{ id: string; emoji: string; x: number; y: number }[]>([]);
  const [sauceAdded, setSauceAdded] = useState(false);
  const [isBaking, setIsBaking] = useState(false);
  const [isBaked, setIsBaked] = useState(false);
  const [done, setDone] = useState(false);
  const hasCompletedRef = useRef(false);

  const playSound = (type: 'pop' | 'bake' | 'win') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      } else if (type === 'bake') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
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
      osc.stop(ctx.currentTime + (type === 'pop' ? 0.1 : 0.5));
    } catch (e) {}
  };

  const handlePizzaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sauceAdded) {
      setSauceAdded(true);
      playSound('pop');
      return;
    }

    if (isBaked || isBaking || done) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // DistFromCenter check (stay within circle)
    const dx = x - 50;
    const dy = y - 50;
    if (Math.sqrt(dx * dx + dy * dy) < 40) {
      const randomTopping = TOPPINGS[Math.floor(Math.random() * TOPPINGS.length)];
      setToppingsOnPizza(prev => [...prev, { id: `${randomTopping.id}-${Date.now()}`, emoji: randomTopping.emoji, x, y }]);
      playSound('pop');
    }
  };

  const addToppingDirect = (toppingEmoji: string) => {
    if (!sauceAdded) setSauceAdded(true);
    if (isBaked || isBaking || done) return;

    // Random placement within dough circle
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 32;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);

    setToppingsOnPizza(prev => [...prev, { id: `${toppingEmoji}-${Date.now()}-${Math.random()}`, emoji: toppingEmoji, x, y }]);
    playSound('pop');
  };

  const handleBake = () => {
    if (!sauceAdded || isBaking || isBaked) return;
    setIsBaking(true);
    playSound('bake');

    setTimeout(() => {
      setIsBaking(false);
      setIsBaked(true);
      playSound('win');
    }, 2000);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center font-sans touch-none p-4 select-none" dir="rtl">
      {onBack && (
        <button onClick={onBack} className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg text-[#E01E5A] hover:bg-red-50 hover:scale-105 transition-all z-50 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      )}

      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-5xl font-black text-amber-900 mb-2 drop-shadow-sm">بيتزا بلومي الإيطالية 🍕</h1>
        <p className="text-base md:text-lg font-bold text-amber-700">
          {!sauceAdded ? 'اضغط على العجينة لإضافة صوص الصلصة والجبن 🍅🧀' : !isBaked ? 'أضف المكونات المفضلة ثم خبزها في الفرن! ♨️' : 'البيتزا جاهزة وشهية جداً! 🎉'}
        </p>
      </div>

      {/* Main Interactive Pizza Area */}
      <div className="relative my-4">
        <div 
          onClick={handlePizzaClick}
          className={`w-72 h-72 sm:w-96 sm:h-96 rounded-full relative shadow-2xl transition-all duration-700 cursor-pointer flex items-center justify-center border-8 border-amber-300 overflow-hidden
            ${isBaking ? 'brightness-125 scale-105 animate-pulse' : ''}
            ${isBaked ? 'bg-[#c2782b] border-[#8d5015]' : sauceAdded ? 'bg-[#d946ef]/10 bg-amber-200 border-amber-400' : 'bg-[#fef3c7]'}`}
        >
          {/* Dough base */}
          <div className={`w-full h-full rounded-full transition-all duration-700 flex items-center justify-center ${isBaked ? 'bg-[#d97706]' : sauceAdded ? 'bg-[#ef4444]' : 'bg-[#fde68a]'}`}>
            {/* Cheese layer if sauce added */}
            {sauceAdded && (
              <div className={`w-[88%] h-[88%] rounded-full transition-all duration-700 border-4 border-dashed border-amber-200 ${isBaked ? 'bg-[#f59e0b]' : 'bg-[#fef08a]'}`} />
            )}
          </div>

          {/* Render toppings on pizza */}
          {toppingsOnPizza.map(item => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, rotate: Math.random() * 360 }}
              animate={{ scale: 1.2, rotate: Math.random() * 360 }}
              className="absolute text-3xl sm:text-4xl pointer-events-none drop-shadow-md"
              style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {item.emoji}
            </motion.div>
          ))}

          {/* Oven Baking Overlay */}
          {isBaking && (
            <div className="absolute inset-0 bg-orange-600/40 backdrop-blur-xs flex flex-col items-center justify-center text-white font-black text-2xl z-30">
              <span className="text-6xl animate-bounce mb-2">🔥</span>
              <span>جاري الخبز في الفرن...</span>
            </div>
          )}
        </div>

        {/* Victory Celebration Overlay */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-full z-40 p-4 text-center border-4 border-amber-400"
            >
              <div className="text-6xl mb-2">🍕🎉⭐</div>
              <p className="text-2xl font-black text-amber-900">بيتزا رائعة وشهية!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toppings Picker Toolbar */}
      {!isBaked && (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border-2 border-amber-200 max-w-xl w-full">
          <span className="text-xs font-black text-amber-900 block mb-2 text-center">اضغط لإضافة المكونات:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {TOPPINGS.map(t => (
              <button
                key={t.id}
                onClick={() => addToppingDirect(t.emoji)}
                className="bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 px-3 py-2 rounded-2xl flex items-center gap-1 font-bold text-amber-900 text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-2xl">{t.emoji}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => { setToppingsOnPizza([]); setSauceAdded(false); setIsBaked(false); setIsBaking(false); setDone(false); hasCompletedRef.current = false; }}
          className="bg-white text-amber-800 px-6 py-3 rounded-2xl font-bold shadow-md border-2 border-amber-200 hover:bg-amber-50 transition-all cursor-pointer"
        >
          🧹 بيتزا جديدة
        </button>

        {sauceAdded && !isBaked && (
          <button
            onClick={handleBake}
            disabled={isBaking}
            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-orange-300 cursor-pointer flex items-center gap-2 text-lg"
          >
            ♨️ خبز البيتزا!
          </button>
        )}

        {isBaked && !done && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleFinish}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-green-300 cursor-pointer text-lg"
          >
            🌟 تقديم وتذوق!
          </motion.button>
        )}
      </div>
    </div>
  );
}
