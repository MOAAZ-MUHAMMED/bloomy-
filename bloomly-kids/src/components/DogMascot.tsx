import React from 'react';
import { motion } from 'framer-motion';

interface DogMascotProps {
  className?: string;
  pose?: 'idle' | 'happy' | 'waving';
}

export default function DogMascot({ className = "", pose = "idle" }: DogMascotProps) {
  // Head animation
  const headAnim = pose === 'happy'
    ? { y: [0, -5, 0], rotate: [-2, 2, -2] }
    : pose === 'waving'
      ? { rotate: [-1, 3, -1] }
      : { y: [0, -2, 0] };

  // Tail animation
  const tailAnim = pose === 'happy'
    ? { rotate: [0, 25, -25, 25, 0] }
    : { rotate: [0, 8, -8, 0] };

  // Left Paw waving animation
  const pawAnim = pose === 'waving'
    ? { rotate: [0, -40, -10, -40, 0], y: [0, -8, 0] }
    : { rotate: 0 };

  return (
    <div className={`relative overflow-visible select-none flex items-center justify-center ${className}`}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        className="w-full h-full filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.12)]"
        style={{ overflow: 'visible' }}
      >
        {/* Left Back Foot */}
        <ellipse cx="42" cy="100" rx="10" ry="8" fill="#d97706" stroke="#4a2711" strokeWidth="2.5" />
        <circle cx="36" cy="102" r="3" fill="#b45309" />
        <circle cx="42" cy="104" r="3" fill="#b45309" />
        
        {/* Right Back Foot */}
        <ellipse cx="78" cy="100" rx="10" ry="8" fill="#d97706" stroke="#4a2711" strokeWidth="2.5" />
        <circle cx="78" cy="104" r="3" fill="#b45309" />
        <circle cx="84" cy="102" r="3" fill="#b45309" />

        {/* Back Tail (Wagging) */}
        <motion.path
          d="M 88 88 C 105 82, 112 62, 108 52 C 102 58, 92 78, 80 82"
          fill="#d97706"
          stroke="#4a2711"
          strokeWidth="2.5"
          strokeLinejoin="round"
          animate={tailAnim}
          transition={{ repeat: Infinity, duration: pose === 'happy' ? 0.4 : 1.2, ease: "easeInOut" }}
          style={{ transformOrigin: "80px 82px" }}
        />

        {/* Body */}
        <path d="M 40 70 C 35 88, 42 102, 60 102 C 78 102, 85 88, 80 70 Z" fill="#f59e0b" stroke="#4a2711" strokeWidth="3" />
        
        {/* Front Chest (White patch) */}
        <path d="M 45 74 C 42 85, 48 98, 60 98 C 72 98, 78 85, 75 74 Z" fill="#ffffff" />

        {/* Left Front Paw (Waving) */}
        <motion.path
          d="M 44 82 C 40 92, 42 104, 52 104 C 55 104, 55 88, 52 82 Z"
          fill="#f59e0b"
          stroke="#4a2711"
          strokeWidth="2.5"
          animate={pawAnim}
          transition={{ repeat: pose === 'waving' ? Infinity : 0, duration: 0.8 }}
          style={{ transformOrigin: "48px 82px" }}
        />
        <circle cx="46" cy="102" r="2.5" fill="#ffffff" opacity="0.8" />
        <circle cx="51" cy="102" r="2.5" fill="#ffffff" opacity="0.8" />

        {/* Right Front Paw */}
        <path d="M 76 82 C 80 92, 78 104, 68 104 C 65 104, 65 88, 68 82 Z" fill="#f59e0b" stroke="#4a2711" strokeWidth="2.5" />
        <circle cx="69" cy="102" r="2.5" fill="#ffffff" opacity="0.8" />
        <circle cx="74" cy="102" r="2.5" fill="#ffffff" opacity="0.8" />

        {/* Collar (Blue) */}
        <path d="M 38 68 C 45 74, 75 74, 82 68 C 84 71, 78 76, 60 76 C 42 76, 36 71, 38 68 Z" fill="#3b82f6" stroke="#4a2711" strokeWidth="2.5" />

        {/* Medallion (Golden Bell/Badge) */}
        <circle cx="60" cy="79" r="7.5" fill="#fbbf24" stroke="#4a2711" strokeWidth="2" />
        <circle cx="60" cy="79" r="4" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />

        {/* Head and Ears grouping to bob together */}
        <motion.g
          animate={headAnim}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
          style={{ transformOrigin: "60px 70px" }}
        >
          {/* Left Ear (Big Floppy) */}
          <path d="M 34 26 C 14 30, 8 68, 22 76 C 34 82, 38 52, 36 32 Z" fill="#b45309" stroke="#4a2711" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 28 32 C 16 38, 14 62, 22 68 C 28 72, 32 52, 30 38 Z" fill="#f87171" opacity="0.4" />

          {/* Right Ear (Big Floppy) */}
          <path d="M 86 26 C 106 30, 112 68, 98 76 C 86 82, 82 52, 84 32 Z" fill="#b45309" stroke="#4a2711" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 92 32 C 104 38, 106 62, 98 68 C 92 72, 88 52, 90 38 Z" fill="#f87171" opacity="0.4" />

          {/* Head */}
          <circle cx="60" cy="42" r="30" fill="#f59e0b" stroke="#4a2711" strokeWidth="3.5" />

          {/* Forehead highlight (Cute white star/patch) */}
          <path d="M 60 12 C 57 24, 52 30, 52 30 C 60 32, 68 30, 60 12 Z" fill="#ffffff" />

          {/* Eyes (Big Sparkling Anime-like Eyes) */}
          {/* Left Eye */}
          <ellipse cx="46" cy="38" rx="8" ry="10" fill="#1e293b" stroke="#4a2711" strokeWidth="1" />
          <ellipse cx="44" cy="36" rx="3.5" ry="4.5" fill="#ffffff" />
          <circle cx="49" cy="42" r="1.5" fill="#ffffff" />
          
          {/* Right Eye */}
          <ellipse cx="74" cy="38" rx="8" ry="10" fill="#1e293b" stroke="#4a2711" strokeWidth="1" />
          <ellipse cx="72" cy="36" rx="3.5" ry="4.5" fill="#ffffff" />
          <circle cx="77" cy="42" r="1.5" fill="#ffffff" />

          {/* Eyebrows (Expression) */}
          <path d="M 38 25 Q 46 22, 50 26" fill="none" stroke="#4a2711" strokeWidth="3" strokeLinecap="round" />
          <path d="M 82 25 Q 74 22, 70 26" fill="none" stroke="#4a2711" strokeWidth="3" strokeLinecap="round" />

          {/* Muzzle (White nose/mouth area) */}
          <path d="M 45 48 C 45 44, 75 44, 75 48 C 75 58, 45 58, 45 48 Z" fill="#ffffff" stroke="#4a2711" strokeWidth="2.5" />

          {/* Nose (Cute Black Heart-shape) */}
          <path d="M 56 46 C 56 44, 64 44, 64 46 C 64 49, 60 52, 60 52 C 60 52, 56 49, 56 46 Z" fill="#1e293b" />
          <circle cx="58.5" cy="46" r="1" fill="#ffffff" />

          {/* Mouth Line & Open Tongue */}
          <path d="M 52 50 Q 60 54, 68 50" fill="none" stroke="#4a2711" strokeWidth="2" strokeLinecap="round" />
          <path d="M 54 51 C 54 51, 56 61, 60 61 C 64 61, 66 51, 66 51 Z" fill="#f43f5e" stroke="#4a2711" strokeWidth="2" />
          <path d="M 57 55 Q 60 57, 63 55" fill="none" stroke="#fecdd3" strokeWidth="1" />

          {/* Cute Pink Cheeks */}
          <ellipse cx="36" cy="46" rx="5" ry="3.5" fill="#f43f5e" opacity="0.4" />
          <ellipse cx="84" cy="46" rx="5" ry="3.5" fill="#f43f5e" opacity="0.4" />
        </motion.g>
      </motion.svg>
    </div>
  );
}
