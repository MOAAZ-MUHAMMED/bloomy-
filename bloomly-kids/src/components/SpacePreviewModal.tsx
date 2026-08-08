import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onBack: () => void;
}

export default function SpacePreviewModal({ onBack }: Props) {
  // Play click sound
  const playPopSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#070A13] z-50 flex flex-col items-center justify-center select-none overflow-hidden font-sans">
      
      {/* 1. TWINKLING STARS BACKGROUND */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:48px_48px] animate-pulse pointer-events-none" />

      {/* 2. SOLAR SYSTEM PREVIEW AREA */}
      <div className="relative w-[360px] h-[360px] md:w-[480px] md:h-[480px] flex items-center justify-center">
        
        {/* Glow behind Sun */}
        <div className="absolute w-44 h-44 bg-amber-400/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Sun (Center) */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-20 h-20 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-full border-4 border-white shadow-[0_0_30px_#f59e0b] z-20 flex items-center justify-center text-4xl"
        >
          ☀️
        </motion.div>

        {/* Orbit 1: Earth */}
        <div className="absolute w-[180px] h-[180px] border-2 border-white/10 rounded-full z-10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-[180px] h-[180px] z-10"
        >
          <div className="absolute -top-3 left-[calc(50%-12px)] w-7 h-7 bg-gradient-to-b from-blue-400 to-sky-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs">
            🌍
          </div>
        </motion.div>

        {/* Orbit 2: Mars */}
        <div className="absolute w-[270px] h-[270px] border-2 border-white/5 rounded-full z-10" />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[270px] h-[270px] z-10"
        >
          <div className="absolute -top-2.5 left-[calc(50%-10px)] w-6 h-6 bg-gradient-to-b from-red-400 to-rose-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs">
            🔴
          </div>
        </motion.div>

        {/* Orbit 3: Saturn */}
        <div className="absolute w-[360px] h-[360px] border-2 border-white/5 rounded-full z-10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="absolute w-[360px] h-[360px] z-10"
        >
          <div className="absolute -top-4 left-[calc(50%-16px)] w-9 h-9 flex items-center justify-center">
            {/* Saturn Sphere */}
            <div className="absolute w-6 h-6 bg-gradient-to-b from-amber-400 to-yellow-600 rounded-full border border-white shadow-sm" />
            {/* Saturn Ring */}
            <div className="absolute w-10 h-2.5 border-[2px] border-amber-300 rounded-full transform rotate-[20deg]" />
          </div>
        </motion.div>

        {/* 3. ANIMATED ROCKET DRIFTING */}
        <motion.div
          animate={{
            x: [-120, 120, -120],
            y: [-60, 60, -60],
            rotate: [15, 45, 15]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-16 h-16 z-30 text-5xl pointer-events-none drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)]"
        >
          🚀
        </motion.div>
      </div>

      {/* 4. TITLE & SUBTITLE HEADER */}
      <div className="text-center z-40 max-w-md px-6 -mt-8 flex flex-col items-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-amber-300 mb-3 drop-shadow-sm leading-tight">
          مغامرة الفضاء السحرية قريباً!
        </h2>
        <p className="text-sm font-bold text-purple-200/80 mb-8 leading-relaxed">
          تحضر معنا لنحلق بالصاروخ بين الكواكب وجمع النجوم الفضائية المتوهجة في التحديث القادم! 🪐🛸🌟
        </p>

        {/* Huge Premium 3D Home Button (Sized w-28 h-28 as requested) */}
        <button
          onClick={() => {
            playPopSound();
            onBack();
          }}
          className="w-28 h-28 hover:scale-105 active:translate-y-[4px] active:scale-95 transition-all cursor-pointer select-none"
        >
          <svg viewBox="0 0 200 228" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="btnGradSpaceBack" x1="48" y1="38" x2="152" y2="168" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE04A"></stop>
                <stop offset="44%" stopColor="#FFAA00"></stop>
                <stop offset="100%" stopColor="#FF7800"></stop>
              </linearGradient>
              <radialGradient id="glossSpaceBack" cx="34%" cy="26%" r="50%" fx="25%" fy="17%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.90"></stop>
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.20"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="rimSpaceBack" cx="50%" cy="50%" r="50%">
                <stop offset="65%" stopColor="#ffffff" stopOpacity="0"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28"></stop>
              </radialGradient>
              <clipPath id="ccSpaceBack">
                <circle cx="100" cy="104" r="58"></circle>
              </clipPath>
            </defs>
            <circle cx="100" cy="112" r="58" fill="#C04800" opacity="0.9"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#btnGradSpaceBack)" stroke="white" strokeWidth="6"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#rimSpaceBack)" clipPath="url(#ccSpaceBack)"></circle>
            <ellipse cx="78" cy="74" rx="36" ry="25" fill="url(#glossSpaceBack)" clipPath="url(#ccSpaceBack)"></ellipse>
            <path d="
              M 100,83
              Q 100,80 103,83
              L 120,100
              Q 123,103 123,106
              L 123,123
              Q 123,126 120,126
              L 80,126
              Q 77,126 77,123
              L 77,106
              Q 77,103 80,100
              L 97,83
              Q 100,80 100,83
              Z
            " fill="white"></path>
            <rect x="92" y="112" width="16" height="14" rx="4" fill="url(#btnGradSpaceBack)"></rect>
          </svg>
        </button>
      </div>

    </div>
  );
}
