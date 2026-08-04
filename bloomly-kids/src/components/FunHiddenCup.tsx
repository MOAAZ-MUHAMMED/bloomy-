import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
  level?: string;
}

export default function FunHiddenCup({ onComplete, onBack, level = "level1" }: Props) {
  // Level configuration
  const cupCount = level === "level4" ? 5 : level === "level3" ? 4 : 3;
  const shuffleSteps = level === "level4" ? 9 : level === "level3" ? 7 : level === "level2" ? 5 : 4;
  const shuffleDelay = level === "level4" ? 220 : level === "level3" ? 280 : level === "level2" ? 340 : 420;

  const [cups, setCups] = useState<number[]>(Array.from({ length: cupCount }, (_, i) => i));
  const [ballIndex, setBallIndex] = useState(1);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealed, setRevealed] = useState<number | null>(null);
  const [message, setMessage] = useState("شاهد مكان الكورة السحرية 🔮");
  const [hasStarted, setHasStarted] = useState(false);

  const completedRef = useRef(false);

  useEffect(() => {
    // Pick random ball position at start
    setBallIndex(Math.floor(Math.random() * cupCount));
    setCups(Array.from({ length: cupCount }, (_, i) => i));
  }, [cupCount]);

  const startGame = async () => {
    setHasStarted(true);
    setRevealed(ballIndex);
    setMessage("احفظ موقع الكورة السحرية 🔮...");
    setIsShuffling(true);

    // Initial show for 1.5s
    await new Promise(r => setTimeout(r, 1500));
    setRevealed(null);
    setMessage("جاري خلط الأكواب السحرية! 💫");
    await new Promise(r => setTimeout(r, 500));

    let currentCups = [...Array.from({ length: cupCount }, (_, i) => i)];

    for (let step = 0; step < shuffleSteps; step++) {
      const idx1 = Math.floor(Math.random() * cupCount);
      let idx2 = Math.floor(Math.random() * cupCount);
      while (idx1 === idx2) {
        idx2 = Math.floor(Math.random() * cupCount);
      }

      const temp = currentCups[idx1];
      currentCups[idx1] = currentCups[idx2];
      currentCups[idx2] = temp;

      setCups([...currentCups]);
      await new Promise(r => setTimeout(r, shuffleDelay));
    }

    setIsShuffling(false);
    setMessage("أين تخبأت الكورة السحرية؟ اختر الكوب! 🤔");
  };

  const handleCupClick = (cupVal: number) => {
    if (isShuffling || !hasStarted || revealed !== null) return;

    setRevealed(cupVal);
    if (cupVal === ballIndex) {
      setMessage("🎉 رائع جداً! وجدت الكورة السحرية! ⭐");
      if (!completedRef.current) {
        completedRef.current = true;
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    } else {
      setMessage("😅 إجابة خاطئة! حاول مرة أخرى.");
      setTimeout(() => {
        setHasStarted(false);
        setRevealed(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full p-6 bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 text-white font-sans select-none flex flex-col items-center justify-center" dir="rtl">
      {/* Background glow effects */}
      <div className="absolute top-0 inset-x-0 h-40 bg-purple-500/10 blur-3xl pointer-events-none" />

      {onBack && (
        <button onClick={onBack} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-yellow-300 border border-yellow-400/30 px-4 py-2 rounded-full shadow-md transition-all font-bold z-20 text-sm">
          ← خروج
        </button>
      )}

      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 mb-1 drop-shadow-md tracking-wide z-10">
        الأكواب السحرية المخفية 🎩
      </h2>
      <p className="text-purple-200 mb-8 font-extrabold text-lg bg-black/40 backdrop-blur-md px-6 py-2 rounded-full shadow-inner border border-purple-400/30 z-10 h-11 flex items-center justify-center">
        {message}
      </p>

      {!hasStarted && (
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={startGame}
          className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-900 font-black py-3.5 px-10 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:shadow-[0_0_40px_rgba(251,191,36,0.9)] transition-all text-xl mb-8 z-20 cursor-pointer border-2 border-yellow-200"
        >
          ابدأ التحدي الآن 🚀
        </motion.button>
      )}

      {/* Realistic 3D Inverted Cups & Magical Sphere Container */}
      <div className="flex gap-6 justify-center items-end relative w-full max-w-2xl h-48 py-4 mb-4 z-10">
        {cups.map((cupVal) => {
          const isThisCupRevealed = revealed === cupVal;
          const hasBall = cupVal === ballIndex;

          return (
            <motion.div
              key={cupVal}
              layout
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="flex flex-col items-center relative cursor-pointer group"
              onClick={() => handleCupClick(cupVal)}
              style={{ zIndex: isThisCupRevealed ? 30 : 10 }}
            >
              {/* 3D Realistic Inverted Cup */}
              <motion.div
                animate={{ y: isThisCupRevealed ? -80 : 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="relative w-24 h-32 group-hover:scale-105 transition-transform"
              >
                {/* Cup Body (Inverted Trapezoid) */}
                <div 
                  className="w-full h-full rounded-b-xl shadow-2xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #d97706 0%, #b45309 40%, #78350f 70%, #451a03 100%)",
                    clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
                    boxShadow: "inset 0 10px 15px rgba(255,255,255,0.4), 0 20px 25px rgba(0,0,0,0.8)"
                  }}
                >
                  {/* Metallic Light Refraction Overlay */}
                  <div className="absolute inset-y-0 left-3 w-4 bg-white/20 skew-x-12 blur-[1px]" />
                  {/* Gold Star Crest on Cup */}
                  <div className="absolute inset-0 flex items-center justify-center text-yellow-300 text-2xl font-black opacity-80 filter drop-shadow">
                    ⭐
                  </div>
                </div>

                {/* Top Inverted Cup Knob/Handle Base */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600 rounded-t-lg shadow-md border-b border-amber-800" />
                {/* Bottom Rim Line */}
                <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-500 rounded-b-md shadow-inner" />
              </motion.div>

              {/* Realistic Glowing 3D Magical Glass Orb / Sphere */}
              {hasBall && isThisCupRevealed && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-0 flex flex-col items-center">
                  <motion.div 
                    animate={{ scale: [1, 1.12, 1], filter: ["hue-rotate(0deg)", "hue-rotate(30deg)", "hue-rotate(0deg)"] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-12 h-12 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.9)] border-2 border-cyan-200 relative overflow-hidden"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #93c5fd 0%, #3b82f6 50%, #1d4ed8 85%, #1e3a8a 100%)"
                    }}
                  >
                    {/* Glass Specular Highlight */}
                    <div className="absolute top-1 left-2 w-4 h-3 bg-white/70 rounded-full blur-[0.5px] -rotate-45" />
                    {/* Inner Glowing Core */}
                    <div className="absolute inset-2 rounded-full bg-cyan-300/40 blur-[2px]" />
                  </motion.div>
                  {/* Sphere Shadow on Floor */}
                  <div className="w-10 h-2 bg-black/60 rounded-full blur-[2px] mt-1" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
