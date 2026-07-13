import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Square, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { ScreenOrientation } from '@capacitor/screen-orientation';

interface StoryPage {
  id: number;
  text: string;
  illustration: (isAnimating: boolean) => React.ReactNode;
}

export interface Story {
  id: number;
  title: string;
  desc: string;
  emoji: string;
  moral: string;
  pages: StoryPage[];
}

// --- Custom SVGs for Story illustrations ---
function SVGArnoobCarrot(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      {/* Background forest */}
      <rect x="0" y="0" width="200" height="150" fill="#E8F5E9" rx="16" />
      <circle cx="20" cy="130" r="30" fill="#A5D6A7" opacity="0.6" />
      <circle cx="180" cy="120" r="25" fill="#A5D6A7" opacity="0.6" />
      
      {/* Golden Carrot */}
      <motion.g
        animate={isAnimating ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        transform="translate(110, 80)"
      >
        {/* Carrot Body */}
        <polygon points="0,0 20,-45 -20,-45" fill="#F59E0B" stroke="#4D2B82" strokeWidth="3" strokeLinejoin="round" />
        {/* Shine */}
        <polygon points="5,-5 12,-40 0,-40" fill="#FFF" opacity="0.3" />
        {/* Leaves */}
        <path d="M 0 -45 Q -10 -60 -5 -65 M 0 -45 Q 0 -62 5 -60 M 0 -45 Q 10 -58 12 -54" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Arnoob Rabbit */}
      <motion.g 
        animate={isAnimating ? { y: [0, -8, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}
        transform="translate(50, 60)"
      >
        {/* Ears */}
        <ellipse cx="-10" cy="-25" rx="4" ry="12" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <ellipse cx="6" cy="-25" rx="4" ry="12" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        {/* Body */}
        <circle cx="-2" cy="25" r="16" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        {/* Head */}
        <circle cx="-2" cy="0" r="12" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        {/* Eye */}
        <circle cx="2" cy="-2" r="1.5" fill="#4D2B82" />
        {/* Cheeks */}
        <circle cx="-6" cy="2" r="2" fill="#FF8A8A" opacity="0.6" />
        {/* Happy hands */}
        <line x1="10" y1="18" x2="22" y2="12" stroke="#4D2B82" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

function SVGArnoobSquirrel(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#E8F5E9" rx="16" />
      
      {/* Arnoob on Left */}
      <g transform="translate(60, 70)">
        <ellipse cx="-8" cy="-20" rx="3.5" ry="10" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <ellipse cx="4" cy="-20" rx="3.5" ry="10" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-2" cy="20" r="14" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-2" cy="0" r="10" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="2" cy="-2" r="1.2" fill="#4D2B82" />
      </g>

      {/* Hungry Squirrel on Right */}
      <motion.g
        animate={isAnimating ? { x: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        transform="translate(130, 70)"
      >
        {/* Tail */}
        <path d="M 15 25 Q 35 10 25 -10" stroke="#D97706" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Body */}
        <circle cx="0" cy="20" r="14" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        {/* Head */}
        <circle cx="-2" cy="2" r="10" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-5" cy="0" r="1.2" fill="#4D2B82" />
        {/* Sad mouth */}
        <path d="M -6 6 Q -4 4 -2 6" stroke="#4D2B82" strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Thought bubble */}
      <circle cx="108" cy="40" r="8" fill="#FFF" stroke="#4D2B82" strokeWidth="1.5" />
      <circle cx="98" cy="48" r="4" fill="#FFF" stroke="#4D2B82" strokeWidth="1" />
      <span className="absolute top-[28%] left-[54%] text-xs pointer-events-none">🥕?</span>
    </svg>
  );
}

function SVGArnoobSharing(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#FFFDE7" rx="16" />
      
      {/* Big Apple Tree shade */}
      <path d="M 0 0 C 40 40, 160 40, 200 0 Z" fill="#81C784" opacity="0.8" />

      {/* Arnoob and Squirrel sitting together holding the split carrot */}
      <g transform="translate(70, 85)">
        {/* Rabbit */}
        <ellipse cx="-6" cy="-18" rx="3.5" ry="9" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <ellipse cx="4" cy="-18" rx="3.5" ry="9" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-1" cy="16" r="12" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-1" cy="0" r="9" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="2" cy="-2" r="1" fill="#4D2B82" />
      </g>

      <g transform="translate(130, 85)">
        {/* Squirrel */}
        <path d="M 12 20 Q 28 8 20 -8" stroke="#D97706" strokeWidth="6" fill="none" />
        <circle cx="0" cy="16" r="12" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-2" cy="0" r="9" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-4" cy="-2" r="1" fill="#4D2B82" />
      </g>

      {/* Half Carrots on the table/ground */}
      <motion.g
        animate={isAnimating ? { y: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}
        transform="translate(100, 95)"
      >
        <polygon points="0,0 8,-15 -8,-15" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

function SVGArnoobForest(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#E8F5E9" rx="16" />
      
      {/* Sparkling carrot tree */}
      <g transform="translate(100, 90)">
        <rect x="-6" y="0" width="12" height="30" fill="#78350F" stroke="#4D2B82" strokeWidth="2" />
        <path d="M -30 0 C -50 -30, 50 -30, 30 0 Z" fill="#4CAF50" stroke="#4D2B82" strokeWidth="2.5" />
        
        {/* Glowing sparkles */}
        <motion.circle cx="-15" cy="-20" r="3" fill="#FFF" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} />
        <motion.circle cx="15" cy="-15" r="3" fill="#FFD700" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2 }} />
      </g>

      {/* Two happy friends waving */}
      <motion.g 
        animate={isAnimating ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        transform="translate(60, 95)"
      >
        <circle cx="0" cy="12" r="10" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
      </motion.g>
      <motion.g 
        animate={isAnimating ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.1 }}
        transform="translate(140, 95)"
      >
        <circle cx="0" cy="12" r="10" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

function SVGSproutSleeping(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#F3E8FF" rx="16" />
      
      {/* Tree trunk */}
      <rect x="140" y="50" width="20" height="80" fill="#78350F" stroke="#4D2B82" strokeWidth="2.5" />
      <path d="M 110 50 C 90 20, 190 20, 170 50 Z" fill="#81C784" />

      {/* Lazy Sprout Mascot Sleeping */}
      <motion.g
        animate={isAnimating ? { scaleY: [1, 0.96, 1], rotate: [-2, 2, -2] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        transform="translate(80, 95)"
      >
        {/* Head leaves */}
        <path d="M 0 -18 Q -10 -28 -5 -30 M 0 -18 Q 10 -28 5 -30" stroke="#81C784" strokeWidth="2.5" fill="none" />
        {/* Body */}
        <circle cx="0" cy="0" r="16" fill="#2ECC71" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Sleeping eyes */}
        <path d="M -8 -2 Q -5 1 -2 -2" stroke="#4D2B82" strokeWidth="2" fill="none" />
        <path d="M 2 -2 Q 5 1 8 -2" stroke="#4D2B82" strokeWidth="2" fill="none" />
      </motion.g>

      {/* Floating Z's */}
      <motion.span
        animate={{ y: [0, -15], x: [0, 5], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute top-[45%] left-[45%] text-purple-600 font-extrabold text-sm"
      >
        Zzz
      </motion.span>
    </svg>
  );
}

function SVGSproutTurtle(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#F3E8FF" rx="16" />
      
      {/* Sprout Sitting */}
      <g transform="translate(60, 90)">
        <circle cx="0" cy="0" r="15" fill="#2ECC71" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="-5" cy="-2" r="1.5" fill="#4D2B82" />
        <circle cx="5" cy="-2" r="1.5" fill="#4D2B82" />
        {/* Question mark */}
        <text x="-5" y="-22" className="text-xs font-black fill-purple-700">؟</text>
      </g>

      {/* Wise Turtle on Right */}
      <motion.g
        animate={isAnimating ? { y: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}
        transform="translate(130, 90)"
      >
        {/* Shell */}
        <ellipse cx="0" cy="0" rx="18" ry="14" fill="#38BDF8" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Head */}
        <circle cx="-22" cy="-4" r="7" fill="#81C784" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-24" cy="-6" r="1" fill="#4D2B82" />
        {/* Feet */}
        <circle cx="-10" cy="14" r="4.5" fill="#81C784" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="10" cy="14" r="4.5" fill="#81C784" stroke="#4D2B82" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

function SVGSproutWorking(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#E0F2FE" rx="16" />
      
      {/* Sprout Carrying water bucket */}
      <motion.g
        animate={isAnimating ? { x: [0, 8, 0], y: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.4 }}
        transform="translate(50, 90)"
      >
        <circle cx="0" cy="0" r="14" fill="#2ECC71" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="4" cy="-2" r="1.5" fill="#4D2B82" />
        {/* Bucket */}
        <rect x="12" y="-2" width="10" height="12" fill="#94A3B8" stroke="#4D2B82" strokeWidth="1.5" rx="1" />
        <path d="M 12 -2 Q 17 -8 22 -2" stroke="#4D2B82" strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Wise Turtle walking ahead */}
      <motion.g
        animate={isAnimating ? { x: [0, 6, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.6 }}
        transform="translate(130, 90)"
      >
        <ellipse cx="0" cy="0" rx="16" ry="12" fill="#38BDF8" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="-20" cy="-2" r="6" fill="#81C784" stroke="#4D2B82" strokeWidth="2" />
        {/* Small bucket */}
        <rect x="-14" y="8" width="6" height="8" fill="#94A3B8" stroke="#4D2B82" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

function SVGSproutBlooming(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#DCFCE7" rx="16" />
      
      {/* Smiling Sprout Mascot with a HUGE blooming flower on head */}
      <motion.g
        animate={isAnimating ? { scale: [1, 1.08, 1], rotate: [-3, 3, -3] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        transform="translate(100, 85)"
      >
        {/* Body */}
        <circle cx="0" cy="0" r="22" fill="#2ECC71" stroke="#4D2B82" strokeWidth="3" />
        <circle cx="-6" cy="-4" r="2" fill="#4D2B82" />
        <circle cx="6" cy="-4" r="2" fill="#4D2B82" />
        <circle cx="-12" cy="1" r="3" fill="#FF8A8A" opacity="0.6" />
        <circle cx="12" cy="1" r="3" fill="#FF8A8A" opacity="0.6" />
        <path d="M -6 4 Q 0 10 6 4" stroke="#4D2B82" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Huge Blooming Golden Flower */}
        <g transform="translate(0, -26)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse key={deg} cx="0" cy="0" rx="3.5" ry="11" fill="#FBBF24" stroke="#4D2B82" strokeWidth="1.5" transform={`rotate(${deg})`} />
          ))}
          <circle cx="0" cy="0" r="6" fill="#78350F" stroke="#4D2B82" strokeWidth="2" />
        </g>
      </motion.g>

      {/* Floating sparkles */}
      <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute top-[20%] left-[38%] text-yellow-500 text-xl">✨</motion.span>
      <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute top-[35%] left-[58%] text-yellow-500 text-lg">✨</motion.span>
    </svg>
  );
}

function SVGAntStory(pageIdx: number, isAnimating: boolean) {
  const antAnim = isAnimating ? { scale: [1, 1.05, 1], rotate: [-2, 2, -2] } : {};
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#FFF8E1" rx="16" />
      {/* Honey Drop */}
      <motion.ellipse
        cx="100" cy="80" rx={pageIdx === 2 ? 22 : 14} ry={pageIdx === 2 ? 30 : 20}
        fill="#FFB300" stroke="#4D2B82" strokeWidth="2.5"
        animate={isAnimating && pageIdx === 2 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      {/* Ant */}
      <motion.g
        animate={antAnim}
        transition={{ repeat: Infinity, duration: 1.2 }}
        transform={
          pageIdx === 1 ? "translate(50, 80)" :
          pageIdx === 2 ? "translate(100, 80)" :
          pageIdx === 3 ? "translate(100, 80)" : "translate(130, 80)"
        }
      >
        <circle cx="0" cy="0" r="7" fill="#2C3E50" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="-10" cy="2" r="6" fill="#2C3E50" />
        <circle cx="10" cy="-2" r="6" fill="#2C3E50" />
        {pageIdx === 3 && (
          <circle cx="13" cy="-4" r="1.5" fill="#E74C3C" />
        )}
      </motion.g>
      {/* Rescuing Friend Ant in page 4 */}
      {pageIdx === 4 && (
        <g transform="translate(70, 80)">
          <circle cx="0" cy="0" r="7" fill="#8D6E63" stroke="#4D2B82" strokeWidth="1.5" />
          <circle cx="-10" cy="2" r="6" fill="#8D6E63" />
          <circle cx="10" cy="-2" r="6" fill="#8D6E63" />
        </g>
      )}
    </svg>
  );
}

function SVGBirdStory(pageIdx: number, isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#E0F7FA" rx="16" />
      {/* Cat */}
      {(pageIdx === 2 || pageIdx === 3 || pageIdx === 4) && (
        <motion.g
          animate={isAnimating ? { x: [0, 5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          transform={pageIdx === 4 ? "translate(60, 95)" : "translate(110, 95)"}
        >
          <ellipse cx="0" cy="0" rx="18" ry="12" fill="#F97316" stroke="#4D2B82" strokeWidth="2" />
          <circle cx="-14" cy="-10" r="8" fill="#F97316" stroke="#4D2B82" strokeWidth="2" />
          <circle cx="-16" cy="-12" r="1" fill="#FFF" />
        </motion.g>
      )}
      {/* Blue Bird */}
      <motion.g
        animate={isAnimating && pageIdx === 4 ? { y: [0, -10, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}
        transform={
          pageIdx === 1 ? "translate(100, 100)" :
          pageIdx === 2 ? "translate(110, 75)" :
          pageIdx === 3 ? "translate(50, 60)" : "translate(130, 50)"
        }
      >
        <circle cx="0" cy="0" r="10" fill="#38BDF8" stroke="#4D2B82" strokeWidth="2" />
        <polygon points="8,0 15,-4 8,-8" fill="#FBBF24" />
        {pageIdx === 1 && (
          <path d="M -8 10 Q 0 4 8 10" stroke="#EF4444" strokeWidth="2.5" fill="none" />
        )}
      </motion.g>
      {/* Nest in page 3 */}
      {pageIdx === 3 && (
        <g transform="translate(50, 80)">
          <path d="M -20 0 Q 0 16 20 0 Z" fill="#D97706" stroke="#4D2B82" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}

function SVGFishStory(pageIdx: number, isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill={pageIdx === 1 ? "#ECEFF1" : "#E0F2FE"} rx="16" />
      {/* Water Waves */}
      <path d="M 0 120 Q 50 110 100 120 T 200 120 L 200 150 L 0 150 Z" fill="#0EA5E9" opacity="0.4" />
      {/* Garbage in page 1 & 3 */}
      {(pageIdx === 1 || pageIdx === 3) && (
        <g transform="translate(130, 80)" opacity={pageIdx === 3 ? 0.4 : 1}>
          <rect x="-10" y="-10" width="16" height="20" fill="#94A3B8" rx="2" stroke="#4D2B82" strokeWidth="1.5" />
          <line x1="-4" y1="-10" x2="-4" y2="10" stroke="#FFF" strokeWidth="1.5" />
        </g>
      )}
      {/* Gold Fish */}
      <motion.g
        animate={isAnimating ? { y: [0, -4, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.4 }}
        transform={pageIdx === 4 ? "translate(60, 80)" : "translate(60, 90)"}
      >
        <ellipse cx="0" cy="0" rx="14" ry="10" fill="#F97316" stroke="#4D2B82" strokeWidth="2" />
        <polygon points="-12,0 -22,-8 -22,8" fill="#F97316" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="6" cy="-2" r="1.5" fill="#FFF" />
      </motion.g>
      {/* Frog in page 2, 3, 4 */}
      {(pageIdx === 2 || pageIdx === 3 || pageIdx === 4) && (
        <motion.g
          animate={isAnimating && pageIdx === 3 ? { x: [0, -10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1.6 }}
          transform="translate(120, 95)"
        >
          <ellipse cx="0" cy="0" rx="12" ry="10" fill="#22C55E" stroke="#4D2B82" strokeWidth="2" />
          <circle cx="-5" cy="-8" r="4.5" fill="#22C55E" stroke="#4D2B82" strokeWidth="1.5" />
          <circle cx="5" cy="-8" r="4.5" fill="#22C55E" stroke="#4D2B82" strokeWidth="1.5" />
        </motion.g>
      )}
    </svg>
  );
}

function SVGLionStory(pageIdx: number, isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#FEF3C7" rx="16" />
      {/* Lion Mane */}
      <motion.g
        animate={isAnimating && pageIdx !== 1 ? { rotate: [-2, 2, -2] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        transform="translate(100, 75)"
      >
        <circle cx="0" cy="0" r="34" fill="#D97706" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="24" fill="#FBBF24" stroke="#4D2B82" strokeWidth="2" />
        {/* Face */}
        <circle cx="-8" cy="-4" r="2.5" fill="#4D2B82" />
        <circle cx="8" cy="-4" r="2.5" fill="#4D2B82" />
        <path d="M -6 6 Q 0 11 6 6" stroke="#4D2B82" strokeWidth="2.5" fill="none" />
      </motion.g>
      {/* Net lines in page 3 */}
      {pageIdx === 3 && (
        <path d="M 50 20 L 150 130 M 150 20 L 50 130 M 50 75 L 150 75 M 100 20 L 100 130" stroke="#78350F" strokeWidth="3" opacity="0.75" />
      )}
      {/* Mouse */}
      <motion.g
        animate={isAnimating ? { y: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        transform={
          pageIdx === 1 ? "translate(100, 36)" :
          pageIdx === 2 ? "translate(142, 90)" :
          pageIdx === 3 ? "translate(45, 95)" : "translate(48, 95)"
        }
      >
        <ellipse cx="0" cy="0" rx="8" ry="6" fill="#94A3B8" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="-5" cy="-7" r="4.5" fill="#94A3B8" stroke="#4D2B82" strokeWidth="1" />
        <circle cx="2" cy="-2" r="1" fill="#4D2B82" />
      </motion.g>
    </svg>
  );
}

function SVGOwlKnowledgeStory(pageIdx: number, isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#F5F5F5" rx="16" />
      {/* Books or Chest */}
      {pageIdx === 1 && (
        <g transform="translate(140, 75)">
          <rect x="-15" y="-30" width="10" height="60" fill="#F43F5E" rx="1" />
          <rect x="-5" y="-30" width="10" height="60" fill="#3B82F6" rx="1" />
          <rect x="5" y="-30" width="10" height="60" fill="#10B981" rx="1" />
        </g>
      )}
      {pageIdx === 3 && (
        <g transform="translate(140, 90)">
          <rect x="-15" y="-10" width="30" height="20" fill="#B45309" stroke="#4D2B82" strokeWidth="2" />
          <circle cx="0" cy="-16" r="6" fill="#FBBF24" stroke="#4D2B82" strokeWidth="1.5" />
          <rect x="-2" y="-10" width="4" height="10" fill="#FBBF24" />
        </g>
      )}
      {pageIdx === 4 && (
        <motion.g
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          transform="translate(130, 80)"
        >
          <rect x="-20" y="-15" width="40" height="30" fill="#B45309" stroke="#4D2B82" strokeWidth="2.5" />
          <circle cx="-15" cy="-25" r="2.5" fill="#FBBF24" />
          <circle cx="15" cy="-28" r="2.5" fill="#FBBF24" />
          <circle cx="0" cy="-35" r="3" fill="#FFF" />
        </motion.g>
      )}
      {/* Owl */}
      <motion.g
        animate={isAnimating ? { y: [0, -4, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        transform={pageIdx === 3 ? "translate(60, 85)" : "translate(70, 85)"}
      >
        <circle cx="0" cy="0" r="16" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-6" cy="-4" r="5" fill="#FFF" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="6" cy="-4" r="5" fill="#FFF" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="-5" cy="-4" r="1.8" fill="#000" />
        <circle cx="5" cy="-4" r="1.8" fill="#000" />
        <polygon points="0,0 -3,5 3,5" fill="#F59E0B" />
      </motion.g>
    </svg>
  );
}

// --- Stories Database ---
const baseStories: Story[] = [
  {
    id: 1,
    title: "الأرنب سمسم والجزر المفقود",
    desc: "التعاون ومساعدة الآخرين يجلب السعادة",
    emoji: "🐰",
    moral: "التعاون ومساعدة الآخرين يجلب السعادة",
    pages: [
      { id: 1, text: "كان الأرنب سمسم يحب الجزر كثيراً. وفي يوم من الأيام، فقد سلة الجزر الخاصة به.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 2, text: "بحث سمسم في كل مكان، وسأل أصدقاءه الحيوانات في الغابة عن الجزر.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 3, text: "قرر السنجاب والبومة مساعدة سمسم في البحث، وتعاونوا معاً.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 4, text: "أخيراً وجدوا الجزر مخبأً خلف شجرة البلوط، وشكرهم سمسم على تعاونهم ومساعدتهم.", illustration: (anim) => SVGArnoobCarrot(anim) },
    ]
  },
  {
    id: 2,
    title: "السنجاب النشيط وحبات البلوط",
    desc: "العمل الجاد والاستعداد للمستقبل",
    emoji: "🐿️",
    moral: "العمل الجاد والاستعداد للمستقبل",
    pages: [
      { id: 1, text: "السنجاب بندق كان يجمع حبات البلوط كل يوم بجد ونشاط استعداداً لفصل الشتاء.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 2, text: "بينما كانت بعض الحيوانات تلعب، كان بندق يعمل بجد لجمع طعامه.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 3, text: "جاء الشتاء البارد ولم يجد الكثيرون طعاماً ليأكلوه.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 4, text: "لكن بندق كان مستعداً، وشارك طعامه مع أصدقائه، فعرفوا أهمية العمل الجاد.", illustration: (anim) => SVGArnoobSquirrel(anim) },
    ]
  },
  {
    id: 3,
    title: "الدب العسول في رحلة الغابة",
    desc: "الاعتماد على النفس والاستكشاف",
    emoji: "🐻",
    moral: "الاعتماد على النفس والاستكشاف",
    pages: [
      { id: 1, text: "خرج الدب دبدوب في رحلة للبحث عن عسل لذيذ في الغابة الكبيرة.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 2, text: "كانت الرحلة طويلة ومليئة بالمغامرات واكتشاف الأماكن الجديدة.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 3, text: "اعتمد دبدوب على نفسه وتتبع رائحة الأزهار ليجد خلية النحل.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 4, text: "بعد تعب، وجد دبدوب العسل، وتعلم أن الاعتماد على النفس يجعله أقوى.", illustration: (anim) => SVGArnoobSharing(anim) },
    ]
  },
  {
    id: 4,
    title: "القرد والفيل في حديقة المرح",
    desc: "الصداقة أقوى من أي اختلافات",
    emoji: "🐘",
    moral: "الصداقة أقوى من أي اختلافات",
    pages: [
      { id: 1, text: "كان القرد فرفوش والفيل ضخم يلعبان دائماً معاً رغم اختلاف حجمهما.", illustration: (anim) => SVGSproutWorking(anim) },
      { id: 2, text: "كان فرفوش يقفز عالياً، بينما ضخم يستخدم خرطومه لرش الماء.", illustration: (anim) => SVGSproutWorking(anim) },
      { id: 3, text: "في أحد الأيام، سخر بعض الحيوانات من صداقتهما الغريبة.", illustration: (anim) => SVGSproutWorking(anim) },
      { id: 4, text: "لكنهما أثبتا للجميع أن الصداقة الحقيقية تعتمد على المحبة وليس الشكل.", illustration: (anim) => SVGSproutWorking(anim) },
    ]
  },
  {
    id: 5,
    title: "السلحفاة الحكيمة والأرنب المغرور",
    desc: "الغرور يؤدي للفشل، والعمل المستمر يؤدي للنجاح",
    emoji: "🐢",
    moral: "الغرور يؤدي للفشل، والعمل المستمر يؤدي للنجاح",
    pages: [
      { id: 1, text: "تحدى الأرنب السريع السلحفاة البطيئة في سباق ركض.", illustration: (anim) => SVGSproutTurtle(anim) },
      { id: 2, text: "بدأ السباق وانطلق الأرنب بسرعة فائقة تاركاً السلحفاة خلفه بكثير.", illustration: (anim) => SVGSproutTurtle(anim) },
      { id: 3, text: "اغتر الأرنب بسرعته وقرر أن ينام قليلاً تحت شجرة، بينما استمرت السلحفاة في السير.", illustration: (anim) => SVGSproutTurtle(anim) },
      { id: 4, text: "استيقظ الأرنب ليجد السلحفاة قد وصلت لخط النهاية وفازت بالسباق!", illustration: (anim) => SVGSproutTurtle(anim) },
    ]
  },
  {
    id: 6,
    title: "العصفور الصغير والطيران",
    desc: "الشجاعة وتجربة أشياء جديدة",
    emoji: "🐦",
    moral: "الشجاعة وتجربة أشياء جديدة",
    pages: [
      { id: 1, text: "كان العصفور زقزوق يخاف من الطيران ويفضل البقاء في العش.", illustration: (anim) => SVGSproutBlooming(anim) },
      { id: 2, text: "شجعه أصدقاؤه وأمه على فرد جناحيه وتجربة الطيران.", illustration: (anim) => SVGSproutBlooming(anim) },
      { id: 3, text: "أخذ زقزوق نفساً عميقاً، وأغمض عينيه، وقفز من العش عالياً.", illustration: (anim) => SVGSproutBlooming(anim) },
      { id: 4, text: "فتح عينيه ليجد نفسه يحلق في السماء الزرقاء، فشعر بالفخر والشجاعة.", illustration: (anim) => SVGSproutBlooming(anim) },
    ]
  },
  {
    id: 7,
    title: "النحلة زينة تصنع العسل",
    desc: "النظام والعمل الجماعي يحقق الأهداف",
    emoji: "🐝",
    moral: "النظام والعمل الجماعي يحقق الأهداف",
    pages: [
      { id: 1, text: "كانت زينة نحلة نشيطة، تطير من زهرة لزهرة لجمع الرحيق كل صباح.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "كل نحلة في الخلية كان لها دور مهم، يعملون معاً كنظام واحد.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "يوم بعد يوم، امتلأت الخلية بالعسل اللذيذ بفضل جهودهم المشتركة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أدركت زينة أن العمل الجماعي يجعل تحقيق الأهداف أسهل وأسرع.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 8,
    title: "النملة النشيطة وحبة القمح",
    desc: "الجهد الصغير المستمر يصنع إنجازاً كبيراً",
    emoji: "🐜",
    moral: "الجهد الصغير المستمر يصنع إنجازاً كبيراً",
    pages: [
      { id: 1, text: "كانت نملة صغيرة تحاول حمل حبة قمح ثقيلة إلى منزلها.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 2, text: "سقطت الحبة منها عدة مرات، لكنها لم تستسلم وحاولت مراراً وتكراراً.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 3, text: "رآها الجندب وسخر منها، لكنها واصلت المحاولة بعزيمة قوية.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 4, text: "أخيراً، أوصلت حبة القمح إلى بيتها، وأثبتت أن الإصرار مفتاح النجاح.", illustration: (anim) => SVGArnoobCarrot(anim) },
    ]
  },
  {
    id: 9,
    title: "الفراشة الملونة والزهرة الجريحة",
    desc: "اللطف والعطف على الآخرين",
    emoji: "🦋",
    moral: "اللطف والعطف على الآخرين",
    pages: [
      { id: 1, text: "كانت هناك فراشة جميلة تطير وتستعرض ألوانها الزاهية للجميع.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "رأت زهرة ذابلة حزينة لأن أحداً لا يقف عليها.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "قررت الفراشة أن تقف على الزهرة وتواسيها وتتحدث معها كل يوم.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "عادت الزهرة للحياة وأزهرت من جديد بفضل لطف وعطف الفراشة.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 10,
    title: "السمكة الذهبية وبحر الأسرار",
    desc: "القناعة كنز لا يفنى",
    emoji: "🐟",
    moral: "القناعة كنز لا يفنى",
    pages: [
      { id: 1, text: "عاشت سمكة ذهبية في بركة صغيرة، وكانت تحلم بالعيش في بحر كبير.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 2, text: "في يوم ما، نقلها صياد طيب إلى النهر الكبير.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 3, text: "اكتشفت السمكة أن النهر مليء بالأسماك المفترسة والمخاطر الكثيرة.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 4, text: "عادت تتمنى بركتها الصغيرة الآمنة، وعرفت أهمية القناعة بما نملك.", illustration: (anim) => SVGArnoobSharing(anim) },
    ]
  },
  {
    id: 11,
    title: "القطة الشقية وكرة الخيط",
    desc: "الاستئذان قبل استخدام أشياء الآخرين",
    emoji: "🐈",
    moral: "الاستئذان قبل استخدام أشياء الآخرين",
    pages: [
      { id: 1, text: "لعبت القطة مشمشة بكرة الخيط الخاصة بجدتها دون أن تستأذن.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 2, text: "تشابك الخيط حول الأثاث وأحدث فوضى كبيرة في الغرفة.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 3, text: "عندما عادت الجدة، حزنت لرؤية الفوضى.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 4, text: "اعتذرت مشمشة وتعلمت أن تستأذن قبل أن تأخذ شيئاً ليس لها.", illustration: (anim) => SVGArnoobSquirrel(anim) },
    ]
  },
  {
    id: 12,
    title: "الكلب الوفي وصديقه الضائع",
    desc: "الوفاء والبحث عن الأصدقاء وقت الشدة",
    emoji: "🐕",
    moral: "الوفاء والبحث عن الأصدقاء وقت الشدة",
    pages: [
      { id: 1, text: "كان للكلب شجاع صديق حميم وهو قط صغير يدعى بسبوس.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 2, text: "في يوم عاصف، ضل بسبوس طريقه ولم يعد للمنزل.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 3, text: "خرج شجاع يبحث عنه في كل مكان رغم البرد والمطر.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 4, text: "وجد شجاع بسبوس مختبئاً، وعادا معاً للمنزل بأمان.", illustration: (anim) => SVGArnoobSharing(anim) },
    ]
  },
  {
    id: 13,
    title: "الطاووس المغرور وريشه",
    desc: "الجمال الحقيقي هو جمال الأخلاق",
    emoji: "🦚",
    moral: "الجمال الحقيقي هو جمال الأخلاق",
    pages: [
      { id: 1, text: "كان الطاووس يتباهى بريشه الجميل أمام كل الطيور ويسخر منهم.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "في يوم من الأيام، علق ذيله الجميل في بعض الأشواك ولم يستطع التخلص منها.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "طلب المساعدة من الطيور التي سخر منها سابقاً.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "ساعدوه بكل طيبة، فأدرك الطاووس أن الأخلاق أهم من الشكل الجميل.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 14,
    title: "البومة الحكيمة والظلام",
    desc: "لا يجب أن نخاف من الأشياء التي لا نعرفها",
    emoji: "🦉",
    moral: "لا يجب أن نخاف من الأشياء التي لا نعرفها",
    pages: [
      { id: 1, text: "كانت الحيوانات تخاف من الظلام ولا تخرج ليلاً أبداً.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "أخبرتهم البومة الحكيمة أن الليل هادئ وجميل وفيه نجوم تلمع.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "أخذت الحيوانات في جولة ليلية ليروا جمال القمر.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أدرك الجميع أن الظلام ليس مخيفاً بل له سحره الخاص.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 15,
    title: "الثعلب الماكر والعنب العالي",
    desc: "الاعتراف بالخطأ بدلاً من اختلاق الأعذار",
    emoji: "🦊",
    moral: "الاعتراف بالخطأ بدلاً من اختلاق الأعذار",
    pages: [
      { id: 1, text: "حاول الثعلب قطف عنب لذيذ معلق على غصن شجرة عالٍ.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 2, text: "قفز وقفز لكنه لم يستطع الوصول إليه أبداً.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 3, text: "بدلاً من أن يعترف بعجزه، قال: العنب حامض ولا أريده.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 4, text: "سمعه العصفور وقال له: كان الأجدر بك أن تطلب المساعدة أو تعترف بصعوبة الأمر.", illustration: (anim) => SVGArnoobCarrot(anim) },
    ]
  },
  {
    id: 16,
    title: "الأسد الملك وقانون الغابة",
    desc: "العدل أساس الملك والمحبة",
    emoji: "🦁",
    moral: "العدل أساس الملك والمحبة",
    pages: [
      { id: 1, text: "قرر الأسد أن يضع قانوناً جديداً للغابة يضمن حقوق جميع الحيوانات.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 2, text: "اجتمع الجميع لسماع القانون الذي يمنع القوي من أكل طعام الضعيف.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 3, text: "فرحت الحيوانات الصغيرة وشعرت بالأمان لأول مرة.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 4, text: "أصبح الأسد محبوباً ومحترماً لعدله ورحمته.", illustration: (anim) => SVGArnoobSharing(anim) },
    ]
  },
  {
    id: 17,
    title: "الضفدع الصغير والمطر",
    desc: "التفاؤل ورؤية الجانب المشرق",
    emoji: "🐸",
    moral: "التفاؤل ورؤية الجانب المشرق",
    pages: [
      { id: 1, text: "كانت الحيوانات تختبئ وراء الأشجار هرباً من المطر الشديد.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "لكن الضفدع الصغير كان يقفز بسعادة في البرك المائية ويغني.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "استغرب الجميع من سعادته وسط المطر.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أخبرهم الضفدع أن المطر يسقي الزرع ويجلب الحياة، فتعلموا التفاؤل.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 18,
    title: "البقرة الحلوب والعشب الأخضر",
    desc: "الشكر والامتنان على النعم",
    emoji: "🐄",
    moral: "الشكر والامتنان على النعم",
    pages: [
      { id: 1, text: "كانت البقرة تأكل من العشب الأخضر اللذيذ كل يوم.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 2, text: "في يوم سألها الخروف: لماذا أنتِ سعيدة دائماً؟", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 3, text: "أجابت البقرة: لأنني أشكر الله كل يوم على هذا المرعى الجميل.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 4, text: "تعلم الخروف أن الامتنان والشكر يجلبان السعادة والراحة.", illustration: (anim) => SVGArnoobSquirrel(anim) },
    ]
  },
  {
    id: 19,
    title: "الحصان السريع والسباق الكبير",
    desc: "الرياضة أخلاق قبل أن تكون فوزاً",
    emoji: "🐎",
    moral: "الرياضة أخلاق قبل أن تكون فوزاً",
    pages: [
      { id: 1, text: "شارك الحصان البرق في سباق كبير للخيول.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 2, text: "كان البرق يتصدر السباق عندما رأى حصاناً آخر يتعثر ويسقط.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 3, text: "بدلاً من إكمال السباق والفوز، توقف البرق لمساعدة الحصان المصاب.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 4, text: "خسر البرق السباق لكنه فاز باحترام وتقدير الجميع لأخلاقه.", illustration: (anim) => SVGArnoobCarrot(anim) },
    ]
  },
  {
    id: 20,
    title: "الديك الصياح والشمس المشرقة",
    desc: "أهمية الاستيقاظ مبكراً والنشاط",
    emoji: "🐓",
    moral: "أهمية الاستيقاظ مبكراً والنشاط",
    pages: [
      { id: 1, text: "كان الديك كوكو يوقظ المزرعة كل صباح بصياحه الجميل.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "في يوم كسل كوكو ولم يصحُ، فتأخر الجميع عن أعمالهم.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "عندما استيقظ، أدرك أهمية صياحه ونشاطه للجميع.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "وعد نفسه أن لا يتكاسل أبداً وأن يظل نشيطاً ومستيقظاً مبكراً.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 21,
    title: "الزرافة الطويلة والأوراق العالية",
    desc: "استغلال الميزات لمساعدة الآخرين",
    emoji: "🦒",
    moral: "استغلال الميزات لمساعدة الآخرين",
    pages: [
      { id: 1, text: "كانت الزرافة تتمتع برقبة طويلة جداً تمكنها من الوصول للأشجار العالية.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 2, text: "كانت بقية الحيوانات جائعة ولا تستطيع الوصول للأوراق اللذيذة.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 3, text: "قررت الزرافة أن تقطف الأوراق وتوزعها على أصدقائها.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 4, text: "علمت الزرافة أن ميزاتها خُلقت لتكون عوناً للآخرين.", illustration: (anim) => SVGArnoobSharing(anim) },
    ]
  },
  {
    id: 22,
    title: "الفأر الذكي والشبكة القوية",
    desc: "الذكاء يتغلب على القوة",
    emoji: "🐁",
    moral: "الذكاء يتغلب على القوة",
    pages: [
      { id: 1, text: "علق الأسد القوي في شبكة الصيادين ولم يستطع تمزيقها بقوته.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 2, text: "مر الفأر الصغير ورأى الأسد في مأزق.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 3, text: "بأسنانه الصغيرة، بدأ الفأر يقضم حبال الشبكة بذكاء وصبر.", illustration: (anim) => SVGArnoobSquirrel(anim) },
      { id: 4, text: "انقطعت الشبكة وتحرر الأسد، وعلم أن الذكاء والصبر يتغلبان على القوة.", illustration: (anim) => SVGArnoobSquirrel(anim) },
    ]
  },
  {
    id: 23,
    title: "الحمامة البيضاء والسلام",
    desc: "نشر السلام والمحبة بين الجميع",
    emoji: "🕊️",
    moral: "نشر السلام والمحبة بين الجميع",
    pages: [
      { id: 1, text: "كانت الحمامة بيضاء جميلة تطير بين القرى تنشر السلام.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "كلما رأت شجاراً بين عصفورين، كانت تتدخل بلطف لتصلح بينهما.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "أصبحت الغابة مكاناً هادئاً ومليئاً بالمحبة بفضل جهودها.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أدرك الجميع أن السلام والمحبة هما أجمل ما في الحياة.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 24,
    title: "البطريق الشجاع والجليد الرقيق",
    desc: "الحذر والتفكير قبل التصرف",
    emoji: "🐧",
    moral: "الحذر والتفكير قبل التصرف",
    pages: [
      { id: 1, text: "كان البطريق كيمو يحب القفز على الجليد بحماس.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "حذره أصدقاؤه من الجليد الرقيق لكنه لم يستمع.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "كاد كيمو أن يقع في الماء البارد لولا مساعدة أصدقائه.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "تعلم كيمو أهمية الحذر والاستماع لنصائح الآخرين قبل التصرف.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 25,
    title: "الغزال الرشيق والنبع الصافي",
    desc: "الابتعاد عن الغرور بالمظهر",
    emoji: "🦌",
    moral: "الابتعاد عن الغرور بالمظهر",
    pages: [
      { id: 1, text: "وقف الغزال ينظر إلى انعكاس صورته في النبع الصافي معجباً بقرونه الجميلة.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 2, text: "لكنه كان يستاء من شكل ساقيه النحيفتين.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 3, text: "عندما ظهر ذئب مفترس، كانت ساقاه النحيفتان هما ما ساعده على الركض والنجاة، بينما كادت قرونه أن تعلقه بالشجر.", illustration: (anim) => SVGArnoobCarrot(anim) },
      { id: 4, text: "أدرك الغزال أن الفائدة الحقيقية أهم بكثير من المظهر الجميل.", illustration: (anim) => SVGArnoobCarrot(anim) },
    ]
  },
  {
    id: 26,
    title: "الخروف الصغير والذئب المتنكر",
    desc: "عدم الانخداع بالمظاهر",
    emoji: "🐑",
    moral: "عدم الانخداع بالمظاهر",
    pages: [
      { id: 1, text: "جاء الذئب متخفياً بجلد خروف ليقترب من القطيع.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 2, text: "كان الخروف الصغير ذكياً ولاحظ أن أسنان هذا الخروف الجديد حادة جداً.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 3, text: "أخبر الكلب الحارس فوراً، فكشف الكلب خدعة الذئب وطرده.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 4, text: "تعلم القطيع أن لا ينخدعوا بالمظاهر ويكونوا حذرين.", illustration: (anim) => SVGArnoobSharing(anim) },
    ]
  },
  {
    id: 27,
    title: "النعامة السريعة والرياح",
    desc: "مواجهة المشاكل بشجاعة",
    emoji: "🦤",
    moral: "مواجهة المشاكل بشجاعة",
    pages: [
      { id: 1, text: "عندما تهب رياح قوية، كانت النعامة تدفن رأسها في الرمال هرباً.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "في يوم، اقترب خطر حقيقي، ولم يفلح دفن الرأس في الحماية.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "أدركت النعامة أن الهروب من المشاكل لا يحلها.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "رفعت رأسها وواجهت الموقف بشجاعة وركضت للنجاة.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 28,
    title: "التمساح الباكي ودموع التماسيح",
    desc: "الصدق في المشاعر والتعبير",
    emoji: "🐊",
    moral: "الصدق في المشاعر والتعبير",
    pages: [
      { id: 1, text: "كان التمساح يتظاهر بالبكاء لجذب الحيوانات الطيبة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "اكتشف القرد خدعته وأخبر بقية الحيوانات.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "عندما مرض التمساح وبكى بصدق، لم يصدقه أحد ولم يساعده.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "تعلم التمساح درساً قاسياً عن أهمية الصدق في المشاعر.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 29,
    title: "الخفاش والنهار المشرق",
    desc: "تقبل الاختلافات وعدم الخوف منها",
    emoji: "🦇",
    moral: "تقبل الاختلافات وعدم الخوف منها",
    pages: [
      { id: 1, text: "كان الخفاش ينام نهاراً ويطير ليلاً، مما جعل بقية الطيور تستغربه.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "قرر الخفاش أن يشرح للطيور عن طبيعته وفائدته في أكل الحشرات الضارة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "فهمت الطيور أسلوب حياة الخفاش واحترمت اختلافه.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أصبح الجميع يعيشون بسلام وتفهم لاختلافات بعضهم البعض.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 30,
    title: "البجعة الجميلة والبحيرة الصافية",
    desc: "النظافة والحفاظ على البيئة",
    emoji: "🦢",
    moral: "النظافة والحفاظ على البيئة",
    pages: [
      { id: 1, text: "كانت البجعة تحب العيش في بحيرة صافية ونظيفة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "لاحظت أن بعض الحيوانات ترمي الأوساخ في البحيرة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "قامت البجعة بتنظيف البحيرة يومياً وشجعت الحيوانات على الحفاظ عليها.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أصبحت البحيرة أجمل مكان في الغابة بفضل النظافة.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 31,
    title: "الحلزون الصبور والوصول للقمة",
    desc: "الصبر وعدم الاستعجال لتحقيق الهدف",
    emoji: "🐌",
    moral: "الصبر وعدم الاستعجال لتحقيق الهدف",
    pages: [
      { id: 1, text: "قرر الحلزون تسلق أطول شجرة في الغابة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "ضحكت الحشرات من بطئه، لكنه لم يتأثر وواصل طريقه بهدوء.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "استغرق الأمر أياماً، لكنه وصل للقمة واستمتع بأجمل منظر للغابة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أثبت الحلزون أن الصبر والمثابرة يوصلان لأعلى القمم.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 32,
    title: "الغراب والجرّة العطشى",
    desc: "التفكير الذكي لحل المشكلات",
    emoji: "🐦‍⬛",
    moral: "التفكير الذكي لحل المشكلات",
    pages: [
      { id: 1, text: "كان الغراب عطشاناً جداً ووجد جرة فيها القليل من الماء في القاع.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "لم يستطع الوصول للماء بمنقاره، ففكر في حل ذكي.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "بدأ يجمع الحصى ويرميها في الجرة حتى ارتفع الماء للأعلى.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "شرب الغراب وارتوى، وتأكد أن التفكير يحل أصعب المشكلات.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 33,
    title: "النورس والبحر الهائج",
    desc: "التكيف مع الظروف الصعبة",
    emoji: "🕊️",
    moral: "التكيف مع الظروف الصعبة",
    pages: [
      { id: 1, text: "هبت عاصفة قوية جعلت البحر هائجاً ومخيفاً.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "كان النورس هادئاً، وبدلاً من الخوف، استخدم الرياح القوية للتحليق عالياً دون مجهود.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "تعلمت بقية الطيور كيف تستغل الظروف الصعبة لصالحها.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أدركوا أن التكيف أفضل من الاستسلام للخوف.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 34,
    title: "الدودة القز وفستان الحرير",
    desc: "العطاء دون انتظار المقابل",
    emoji: "🐛",
    moral: "العطاء دون انتظار المقابل",
    pages: [
      { id: 1, text: "كانت دودة القز تنسج خيوط الحرير الناعمة وتصنع منها أجمل الثياب.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "كانت تعطي الخيوط للحيوانات ليصنعوا منها ملابس شتوية دافئة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "لم تطلب شيئاً بالمقابل، كانت سعيدة برؤية أصدقائها دافئين.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أصبحت دودة القز محبوبة الجميع لكرمها وعطائها.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 35,
    title: "النمر المخطط وفقدان خطوطه",
    desc: "الثقة بالنفس وتقبل الذات",
    emoji: "🐅",
    moral: "الثقة بالنفس وتقبل الذات",
    pages: [
      { id: 1, text: "تخيل النمر أنه فقد خطوطه السوداء الجميلة، فشعر بالحزن والخجل.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 2, text: "اختبأ ولم يخرج للصيد أو اللعب مع أصدقائه.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 3, text: "عندما نظر في البحيرة، وجد أن خطوطه ما زالت موجودة، وأن الأمر مجرد وهم.", illustration: (anim) => SVGArnoobSharing(anim) },
      { id: 4, text: "تعلم النمر أن يثق بنفسه وبشكله ولا يدع الأوهام تسيطر عليه.", illustration: (anim) => SVGArnoobSharing(anim) },
    ]
  },
  {
    id: 36,
    title: "الدلفين المنقذ والغريق",
    desc: "مساعدة المحتاجين وقت الخطر",
    emoji: "🐬",
    moral: "مساعدة المحتاجين وقت الخطر",
    pages: [
      { id: 1, text: "كان الدلفين يلعب في البحر حين رأى طائراً صغيراً يغرق.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "أسرع الدلفين ورفع الطائر على ظهره وأخرجه للشاطئ.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "شكر الطائر الدلفين على إنقاذ حياته.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "تعلم الدلفين أن مساعدة الآخرين هي أجمل أنواع اللعب.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 37,
    title: "الطائر المقلد وتعلم الألحان",
    desc: "التعلم من الآخرين واكتساب المهارات",
    emoji: "🦜",
    moral: "التعلم من الآخرين واكتساب المهارات",
    pages: [
      { id: 1, text: "كان الطائر المقلد يستمع لغناء الطيور الأخرى ويحاول تقليد ألحانهم.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "بمرور الوقت، أصبح يمتلك أجمل وأتنوع صوت في الغابة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "سألوه كيف فعل ذلك، فأجاب: بالاستماع والتعلم المستمر.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "أدرك الجميع أن التعلم من الآخرين يزيدنا جمالاً ومعرفة.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 38,
    title: "العنكبوت الماهر وشبكة الأمان",
    desc: "إتقان العمل والصبر عليه",
    emoji: "🕷️",
    moral: "إتقان العمل والصبر عليه",
    pages: [
      { id: 1, text: "كان العنكبوت ينسج شبكته بكل دقة ومهارة بين الأغصان.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "كلما هدمت الرياح شبكته، كان يعيد بناءها بصبر أكبر وإتقان أفضل.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "في النهاية، صنع شبكة قوية لم تتأثر بالرياح.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "تعلمت الحيوانات من العنكبوت أن إتقان العمل يحتاج لصبر وعزيمة.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 39,
    title: "الخنفساء الصغيرة والكرة الكبيرة",
    desc: "عدم استصغار القدرات الذاتية",
    emoji: "🪲",
    moral: "عدم استصغار القدرات الذاتية",
    pages: [
      { id: 1, text: "كانت خنفساء صغيرة تدحرج كرة طعام أكبر منها بكثير.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "سخرت الحيوانات الكبيرة من حجمها الصغير وطموحها الكبير.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "لكنها لم تتوقف ودحرجت الكرة حتى أوصلتها لبيتها.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "انبهر الجميع بقوتها وعزيمتها، وتعلموا ألا يستصغروا أحداً لحجمه.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
  {
    id: 40,
    title: "السحلية والذيل المقطوع",
    desc: "التجدد وعدم اليأس بعد الخسارة",
    emoji: "🦎",
    moral: "التجدد وعدم اليأس بعد الخسارة",
    pages: [
      { id: 1, text: "هربت السحلية من خطر كبير ولكنها فقدت ذيلها في هذه الحادثة.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 2, text: "حزنت في البداية واعتقدت أنها فقدت جزءاً من جمالها وقوتها.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 3, text: "لكن مع مرور الأيام، بدأ ذيلها ينمو من جديد.", illustration: (anim) => SVGArnoobForest(anim) },
      { id: 4, text: "تعلمت السحلية أن الخسارة ليست النهاية، وأننا قادرون على التجدد والبدء من جديد بقوة أكبر.", illustration: (anim) => SVGArnoobForest(anim) },
    ]
  },
];


// Helper to generate a generic story
function generateGenericStory(id: number): Story {
  return {
    id,
    title: `مغامرات برعم - الجزء ${id}`,
    desc: "قصة جديدة وممتعة بانتظارك، اقرأها لتكتشف المزيد من أسرار الغابة السحرية!",
    emoji: "🌟🌱",
    moral: "الاستكشاف والتعلم يفتح لنا آفاقاً جديدة كل يوم!",
    pages: [
      {
        id: 1,
        text: `في يوم جميل من أيام الربيع المشرقة، استيقظ برعم وأصدقاؤه لبدء مغامرة جديدة رقم ${id} في الغابة.`,
        illustration: (isAnim) => SVGArnoobForest(isAnim)
      },
      {
        id: 2,
        text: "واجه الأصدقاء تحدياً صغيراً في طريقهم، لكنهم تذكروا أهمية التعاون والعمل الجماعي لحل المشكلات.",
        illustration: (isAnim) => SVGSproutWorking(isAnim)
      },
      {
        id: 3,
        text: "بفضل التفكير الذكي والتعاون المستمر، استطاعوا التغلب على التحدي ووجدوا صندوقاً مليئاً بالمعرفة والحكمة.",
        illustration: (isAnim) => SVGOwlKnowledgeStory(3, isAnim)
      },
      {
        id: 4,
        text: "انتهت المغامرة بسلام وعاد الجميع سعداء ومسرورين، وقد تعلموا درساً مفيداً جديداً سيظل محفوراً في ذاكرتهم.",
        illustration: (isAnim) => SVGSproutBlooming(isAnim)
      }
    ]
  };
}

const stories: Story[] = [...baseStories];
for (let i = baseStories.length + 1; i <= 40; i++) {
  stories.push(generateGenericStory(i));
}

interface InteractiveStoriesProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
}

export default function InteractiveStories({ onClose, globalStars, setGlobalStars }: InteractiveStoriesProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [noticeText, setNoticeText] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Lock screen orientation to landscape on mobile
  useEffect(() => {
    try {
      if (ScreenOrientation) {
        ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
      }
    } catch (e) {}
    return () => {
      try {
        if (ScreenOrientation) {
          ScreenOrientation.unlock().catch(() => {});
        }
      } catch (e) {}
    };
  }, []);

  const triggerNotice = (text: string) => {
    setNoticeText(text);
    setTimeout(() => setNoticeText(null), 2500);
  };

  const updateStars = (diff: number) => {
    if (setGlobalStars) {
      setGlobalStars(prev => {
        const next = Math.max(0, prev + diff);
        localStorage.setItem("bloomly_stars", next.toString());
        return next;
      });
    } else {
      const prev = parseInt(localStorage.getItem("bloomly_stars") || "0", 10);
      localStorage.setItem("bloomly_stars", Math.max(0, prev + diff).toString());
    }
  };

  // Browser Text-To-Speech with boundary word highlighting helper
  const handlePlayVoiceover = () => {
    if (!activeStory) return;
    
    // Reset standard speech
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}

    const textStr = activeStory.pages[currentPageIdx].text;
    const utterance = new SpeechSynthesisUtterance(textStr);
    utteranceRef.current = utterance;
    
    // Set Arabic language
    utterance.lang = "ar-SA";
    utterance.rate = 0.82; // slower speed for kids

    utterance.onstart = () => {
      setIsPlaying(true);
      setActiveWordIdx(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setActiveWordIdx(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveWordIdx(null);
    };

    // Calculate currently spoken word index from character position index
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const charIdx = event.charIndex;
        const sub = textStr.substring(0, charIdx);
        const words = sub.trim().split(/\s+/);
        const wordIndex = sub.trim() === "" ? 0 : words.length;
        setActiveWordIdx(wordIndex);
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech failed:", err);
      setIsPlaying(false);
    }
  };

  const handleStopVoiceover = () => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    setIsPlaying(false);
    setActiveWordIdx(null);
  };

  const handleNextPage = () => {
    if (!activeStory) return;
    handleStopVoiceover();

    if (currentPageIdx < activeStory.pages.length - 1) {
      setCurrentPageIdx(prev => prev + 1);
    } else {
      // Completed last page!
      updateStars(10); // Reward 10 stars as requested
      triggerNotice("🏆 عمل رائع! لقد أنهيت قراءة القصة وحصلت على ١٠ نجوم سحرية! ⭐");
      setActiveStory(null);
      setCurrentPageIdx(0);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      handleStopVoiceover();
      setCurrentPageIdx(prev => prev - 1);
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      try {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, []);

  // Split text to span elements
  const renderTextSpans = (text: string) => {
    const words = text.split(" ");
    return words.map((word, idx) => {
      const isHighlighted = activeWordIdx === idx;
      return (
        <span
          key={idx}
          className={`inline-block mx-1 px-1 rounded-md transition-colors text-2xl font-black ${
            isHighlighted 
              ? "bg-yellow-300 text-purple-900 scale-105 shadow-sm" 
              : "text-[#4D2B82]"
          }`}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-gradient-to-b from-[#FFFDF0] via-[#FAF7FD] to-[#FFFCE6] select-none font-sans flex flex-col justify-between overflow-y-auto">
      
      {/* Floating Exit Button (Top-Left) and Stars Indicator (Top-Right) */}
      <div className="absolute top-4 right-4 z-[9990] select-none pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-3 border-[#D97706] text-[#D97706] font-black text-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-lg text-yellow-400">★</span>
          <span>نجومك: {globalStars}</span>
        </div>
      </div>
      
      <div className="absolute top-4 left-4 z-[9990] select-none pointer-events-auto">
        <button
          onClick={() => {
            handleStopVoiceover();
            onClose();
          }}
          className="w-12 h-12 bg-white hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center cursor-pointer border-3 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all"
        >
          <X className="w-6 h-6 stroke-[3px]" />
        </button>
      </div>

      {/* 2. Notice Banner */}
      <AnimatePresence>
        {noticeText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 inset-x-0 mx-auto w-fit max-w-sm px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{
              borderColor: noticeText.startsWith("❌") ? "#EF4444" : noticeText.startsWith("🌱") ? "#2ECC71" : "#FF9F29",
              color: noticeText.startsWith("❌") ? "#EF4444" : "#4D2B82",
            }}
          >
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Area */}
      <main className="flex-grow w-full flex items-center justify-center p-6 relative z-10 overflow-y-auto overflow-x-hidden min-h-0">
        
        <AnimatePresence mode="wait">
          {!activeStory ? (
            
            // STORY SELECT VIEW
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="max-w-4xl w-full text-center select-none"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-[#4D2B82] mb-1">📖 مكتبة القصص التفاعلية</h2>
              <p className="text-xs font-extrabold text-purple-400 mb-8">اختر قصة جميلة لتنطلق في رحلة القراءة والتعلم السحرية!</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story, index) => {
                  // Calculate unlocked stories based on global stars. Each 10 stars unlocks a new story
                  const unlockedCount = Math.min(40, 1 + Math.floor(globalStars / 10));
                  const isLocked = index >= unlockedCount;
                  
                  return (
                  <button
                    key={story.id}
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        setActiveStory(story);
                        setCurrentPageIdx(0);
                      }
                    }}
                    className={`card-bubbly p-6 flex flex-col items-center gap-3 border-3 text-center relative group transition-all duration-300 ${isLocked ? 'bg-gray-100 border-gray-300 opacity-80 cursor-not-allowed grayscale' : 'bg-white hover:bg-yellow-50/30 cursor-pointer'}`}
                  >
                    {isLocked && (
                      <div className="absolute top-2 left-2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white shadow-md z-10">
                        🔒
                      </div>
                    )}
                    <span className={`text-6xl ${!isLocked ? 'group-hover:scale-110 transition-transform duration-300' : ''}`}>{story.emoji}</span>
                    <h3 className={`text-lg font-black ${isLocked ? 'text-gray-500' : 'text-[#4D2B82]'}`}>{story.title}</h3>
                    <p className={`text-xs font-bold ${isLocked ? 'text-gray-400' : 'text-purple-400'}`}>{isLocked ? `اجمع ${((index + 1) * 10) - 10} نجمة لفتح هذه القصة السحرية` : story.desc}</p>
                    
                    {!isLocked && (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mt-2">
                        💡 القيمة: {story.moral.split(" ")[0] || "التربية"}
                      </span>
                    )}
                  </button>
                  );
                })}
              </div>
            </motion.div>

          ) : (
            
            // STORY READER VIEW
            <motion.div
              key="reader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="story-reader-card max-w-2xl w-full bg-white border-4 border-[#4D2B82] rounded-[36px] shadow-[0_12px_0_0_#4D2B82] p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative min-h-[500px]"
            >
              
              {/* Reader Header */}
              <div className="flex items-center justify-between border-b-2 border-purple-100 pb-3 mb-4 select-none">
                <button
                  onClick={() => {
                    handleStopVoiceover();
                    setActiveStory(null);
                  }}
                  className="text-xs font-black text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  📖 العودة للمكتبة
                </button>
                
                <span className="font-extrabold text-sm text-[#4D2B82]">
                  صفحة {currentPageIdx + 1} من {activeStory.pages.length}
                </span>

                <div className="flex gap-2">
                  {!isPlaying ? (
                    <button
                      onClick={handlePlayVoiceover}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>استمع للقصة 🔊</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopVoiceover}
                      className="bg-red-500 hover:bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      <span>إيقاف الصوت</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Responsive main wrapper */}
              <div className="story-main-wrapper flex flex-col md:flex-row flex-grow items-center justify-center gap-4 overflow-hidden mb-4">
                
                {/* Left Column: Illustration */}
                <div className="story-left-col flex items-center justify-center p-2 w-full md:w-1/2">
                  <div className="story-illustration-container w-full max-w-[320px] rounded-2xl overflow-hidden border-2 border-purple-100 p-2 bg-slate-50 flex items-center justify-center shadow-inner">
                    {activeStory.pages[currentPageIdx].illustration(isPlaying)}
                  </div>
                </div>

                {/* Right Column: Text */}
                <div className="story-right-col w-full md:w-1/2 flex flex-col justify-center">
                  {/* Story Arabic Text (With highlighted word span) */}
                  <div className="text-center leading-relaxed px-4 py-3 bg-purple-50/30 rounded-2xl border border-purple-100 min-h-[100px] flex items-center justify-center">
                    <div className="text-right tracking-wide leading-loose">
                      {renderTextSpans(activeStory.pages[currentPageIdx].text)}
                    </div>
                  </div>
                </div>

              </div>

              {/* Page Flipping Navigation Controls */}
              <div className="flex items-center justify-between border-t-2 border-purple-100 pt-4 select-none">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPageIdx === 0}
                  className="bg-white hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed border-3 border-[#4D2B82] text-[#4D2B82] font-black text-xs py-2.5 px-5 rounded-full shadow-[0_3px_0_0_#4D2B82] active:translate-y-[1px] active:shadow-[0_1.5px_0_0_#4D2B82] flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الصفحة السابقة</span>
                </button>

                <button
                  onClick={handleNextPage}
                  className="btn-bubbly-primary text-xs py-2.5 px-6 flex items-center gap-1"
                >
                  <span>{currentPageIdx === activeStory.pages.length - 1 ? "أنهيت القراءة 🏆" : "الصفحة التالية"}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
}
