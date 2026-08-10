import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Model3D from './Model3D';
// @ts-ignore
import solarSystemModel from './orbiting_solar_system.glb?url';
// @ts-ignore
import astronautModel from './walking_astronaut.glb?url';
// @ts-ignore
import flyingSaucerModel from './flying_saucer.glb?url';

interface Props {
  onBack: () => void;
}

export default function SpacePreviewModal({ onBack }: Props) {
  const [astronautAnim, setAstronautAnim] = useState<'floating' | 'wave' | 'moon_walk'>('floating');

  const triggerAstronautAction = () => {
    if (astronautAnim !== 'floating') return;
    
    // Pick randomly between wave and moon_walk
    const nextAnim = Math.random() > 0.5 ? 'wave' : 'moon_walk';
    setAstronautAnim(nextAnim);
    
    // Reset to floating after 3.5 seconds
    setTimeout(() => {
      setAstronautAnim('floating');
    }, 3500);
  };
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
      <div className="relative w-[360px] h-[360px] md:w-[500px] md:h-[500px] flex items-center justify-center">
        
        {/* Glow behind Solar System */}
        <div className="absolute w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* 3D Orbiting Solar System */}
        <Model3D 
          src={solarSystemModel} 
          animationName="natural_orbit" 
          className="w-full h-full z-10"
          scaleAdjustment={1.1}
          colorMapping={false} // Preserve beautiful real planetary textures!
        />

        {/* 3D Flying Saucer UFO hovering in upper right */}
        <div className="absolute top-[5%] right-[5%] z-20 w-36 h-36 flex flex-col items-center">
          <Model3D 
            src={flyingSaucerModel} 
            animationName="hover" 
            className="w-full h-full"
            scaleAdjustment={1.25}
            autoRotate={true}
            rotationSpeed={0.006}
            colorMapping={true} // Add vibrant unlit emission
          />
          <div className="text-[10px] font-black text-center text-emerald-300 bg-black/50 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/30 shadow-md">
            🛸 زائر فضائي
          </div>
        </div>

        {/* 3D Interactive Astronaut floating in lower left */}
        <div className="absolute bottom-[2%] left-[2%] z-20 w-40 h-40 flex flex-col items-center select-none">
          <Model3D 
            src={astronautModel} 
            animationName={astronautAnim} 
            className="w-full h-full"
            scaleAdjustment={1.3}
            onClick={triggerAstronautAction}
            colorMapping={false} // Preserve detailed spacesuit texture!
          />
          <div className="text-[10px] font-black text-center text-purple-200 bg-purple-950/75 px-3 py-1 rounded-full border border-purple-500/30 shadow-lg animate-bounce select-none">
            {astronautAnim === 'floating' ? 'اضغط عليّ! 🧑‍🚀' : astronautAnim === 'wave' ? 'أهلاً بك! 👋' : 'أمشي على القمر! 🌙'}
          </div>
        </div>

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
