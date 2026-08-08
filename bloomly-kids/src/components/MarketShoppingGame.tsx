import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Star, Check } from 'lucide-react';
import SproutMascot from './MascotCharacter';

// Audio Context Helper for Synthesizing Cute Sound Effects
const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.15) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (type === 'triangle') {
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
    } else {
      osc.frequency.exponentialRampToValueAtTime(freq * 2, ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

// 1. INGREDIENTS DEF & HAND-DRAWN VECTOR SVGs
export interface Ingredient {
  id: string;
  name: string;
  englishName: string;
  color: string;
}

export const INGREDIENTS_POOL: Ingredient[] = [
  { id: 'tomato', name: 'طماطم', englishName: 'Tomato', color: '#EF4444' },
  { id: 'potato', name: 'بطاطس', englishName: 'Potato', color: '#D97706' },
  { id: 'onion', name: 'بصل', englishName: 'Onion', color: '#C084FC' },
  { id: 'pepper', name: 'فلفل', englishName: 'Pepper', color: '#10B981' },
  { id: 'carrot', name: 'جزر', englishName: 'Carrot', color: '#F97316' },
  { id: 'eggplant', name: 'باذنجان', englishName: 'Eggplant', color: '#7C3AED' },
  { id: 'garlic', name: 'ثوم', englishName: 'Garlic', color: '#F3F4F6' },
  { id: 'cucumber', name: 'خيار', englishName: 'Cucumber', color: '#22C55E' }
];

export function IngredientSVG({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case 'tomato':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="55" r="30" fill="#EF4444" stroke="#7F1D1D" strokeWidth="4.5" />
          <circle cx="38" cy="42" r="8" fill="#FF8A8A" />
          <path d="M 50 25 Q 50 15, 52 10 Q 48 15, 50 25" fill="#15803D" stroke="#166534" strokeWidth="3" />
          <path d="M 50 25 Q 38 18, 30 20 Q 42 22, 50 25" fill="#15803D" stroke="#166534" strokeWidth="3" />
          <path d="M 50 25 Q 62 18, 70 20 Q 58 22, 50 25" fill="#15803D" stroke="#166534" strokeWidth="3" />
        </svg>
      );
    case 'potato':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 25 50 C 25 30, 75 30, 75 50 C 75 70, 25 70, 25 50 Z" fill="#D97706" stroke="#78350F" strokeWidth="4.5" />
          <circle cx="38" cy="42" r="3" fill="#78350F" />
          <circle cx="62" cy="58" r="3" fill="#78350F" />
          <circle cx="50" cy="62" r="2.5" fill="#78350F" />
          <circle cx="58" cy="40" r="2.5" fill="#78350F" />
        </svg>
      );
    case 'onion':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 50 10 C 20 45, 20 85, 50 85 C 80 85, 80 45, 50 10 Z" fill="#C084FC" stroke="#6B21A8" strokeWidth="4.5" />
          <path d="M 50 10 Q 38 45, 42 85" fill="none" stroke="#6B21A8" strokeWidth="3" />
          <path d="M 50 10 Q 62 45, 58 85" fill="none" stroke="#6B21A8" strokeWidth="3" />
          <path d="M 45 85 L 43 93 M 50 85 L 50 95 M 55 85 L 57 93" fill="none" stroke="#9CA3AF" strokeWidth="3" />
        </svg>
      );
    case 'pepper':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 30 30 C 20 40, 20 80, 50 85 C 80 80, 80 40, 70 30 C 60 25, 40 25, 30 30 Z" fill="#10B981" stroke="#065F46" strokeWidth="4.5" />
          <path d="M 50 28 L 50 12" fill="none" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
          <path d="M 50 30 Q 50 80, 50 85" fill="none" stroke="#065F46" strokeWidth="3.5" />
          <path d="M 38 40 Q 34 60, 36 75" fill="none" stroke="#34D399" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    case 'carrot':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 40 25 C 60 25, 60 35, 50 90 C 40 90, 30 35, 40 25 Z" fill="#F97316" stroke="#9A3412" strokeWidth="4.5" />
          <path d="M 46 25 Q 40 5, 35 2 Q 43 12, 46 25" fill="#15803D" stroke="#166534" strokeWidth="3" />
          <path d="M 50 25 Q 50 5, 50 0 Q 50 12, 50 25" fill="#15803D" stroke="#166534" strokeWidth="3" />
          <path d="M 54 25 Q 60 5, 65 2 Q 57 12, 54 25" fill="#15803D" stroke="#166534" strokeWidth="3" />
          <path d="M 38 45 Q 46 45, 54 48" fill="none" stroke="#9A3412" strokeWidth="3" />
          <path d="M 40 65 Q 48 65, 52 67" fill="none" stroke="#9A3412" strokeWidth="3" />
        </svg>
      );
    case 'eggplant':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 50 15 C 38 15, 25 35, 25 60 C 25 80, 75 80, 75 60 C 75 35, 62 15, 50 15 Z" fill="#581C87" stroke="#3B0764" strokeWidth="4.5" />
          <ellipse cx="40" cy="45" rx="6" ry="14" fill="#A855F7" opacity="0.6" transform="rotate(-15 40 45)" />
          <path d="M 50 15 C 45 15, 40 25, 35 28 C 45 28, 50 22, 50 15 C 50 22, 55 28, 65 28 C 60 25, 55 15, 50 15 Z" fill="#15803D" stroke="#166534" strokeWidth="3" />
          <path d="M 50 15 L 50 5" fill="none" stroke="#166534" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'garlic':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 50 15 C 28 35, 25 80, 50 82 C 75 80, 72 35, 50 15 Z" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="4.5" />
          <path d="M 50 15 Q 38 50, 42 81" fill="none" stroke="#D1D5DB" strokeWidth="3" />
          <path d="M 50 15 Q 62 50, 58 81" fill="none" stroke="#D1D5DB" strokeWidth="3" />
          <path d="M 50 15 Q 28 50, 32 80" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
          <path d="M 50 15 Q 72 50, 68 80" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
        </svg>
      );
    case 'cucumber':
      return (
        <svg viewBox="0 0 100 100" className={className} transform="rotate(30 50 50)">
          <rect x="32" y="15" width="36" height="70" rx="18" fill="#15803D" stroke="#166534" strokeWidth="4.5" />
          <path d="M 42 15 Q 42 50, 42 85" fill="none" stroke="#166534" strokeWidth="3.5" />
          <path d="M 58 15 Q 58 50, 58 85" fill="none" stroke="#166534" strokeWidth="3.5" />
          <path d="M 50 15 L 50 5" fill="none" stroke="#166534" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

interface Props {
  onComplete: (collected: Ingredient[]) => void;
  onBack: () => void;
}

export default function MarketShoppingGame({ onComplete, onBack }: Props) {
  // Navigation: "list_writing" | "market_shopping"
  const [phase, setPhase] = useState<"list_writing" | "market_shopping">("list_writing");
  const [targetList, setTargetList] = useState<Ingredient[]>([]);
  const [completedList, setCompletedList] = useState<string[]>([]); // matched ids in part 1
  const [basketList, setBasketList] = useState<string[]>([]);       // matched ids in part 2
  
  // Audio Speech Recognition Voice instructions
  const [mascotPose, setMascotPose] = useState<"welcome" | "thinking" | "talking" | "victory">("talking");
  const [instructionText, setInstructionText] = useState<string>("");
  const [wordChoices, setWordChoices] = useState<Ingredient[]>([]);
  const [marketChoices, setMarketChoices] = useState<Ingredient[]>([]);

  // Initialize Game Lists
  useEffect(() => {
    // Select 5 random unique ingredients from pool
    const shuffled = [...INGREDIENTS_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setTargetList(selected);
    generateWordChoices(selected[0], shuffled);
  }, []);

  const speakGuide = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.pitch = 1.15;
      utterance.rate = 0.95;
      utterance.onstart = () => setMascotPose("talking");
      utterance.onend = () => setMascotPose("welcome");
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const generateWordChoices = (currentItem: Ingredient, allPool: Ingredient[]) => {
    if (!currentItem) return;
    const fillers = allPool.filter(i => i.id !== currentItem.id).slice(0, 3);
    const mixed = [currentItem, ...fillers].sort(() => 0.5 - Math.random());
    setWordChoices(mixed);
    setInstructionText(`اسحب كلمة (${currentItem.name}) وضَعها في مكانها باللوحة!`);
    speakGuide(`اسحب كلمة ${currentItem.name} وضَعها في مكانها الصحيح في لوحة المكونات!`);
  };

  const generateMarketChoices = (currentItem: Ingredient, allPool: Ingredient[]) => {
    if (!currentItem) return;
    const fillers = allPool.filter(i => i.id !== currentItem.id).slice(0, 5); // 6 items on shelves
    const mixed = [currentItem, ...fillers].sort(() => 0.5 - Math.random());
    setMarketChoices(mixed);
    setInstructionText(`اسحب ثمرة (${currentItem.name}) من الرف وضعها في صندوقك الخشبي!`);
    speakGuide(`ابحث عن الـ ${currentItem.name} على الرف واسحبها إلى صندوقك الخشبي!`);
  };

  // Drag and drop handlers - PART 1
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDropOnList = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData("text/plain");
    const nextIndex = completedList.length;
    const currentTarget = targetList[nextIndex];

    if (droppedId === currentTarget.id) {
      // Success Match!
      playBeep(660, 'sine', 0.18);
      const nextCompleted = [...completedList, droppedId];
      setCompletedList(nextCompleted);
      setMascotPose("victory");

      if (nextCompleted.length === 5) {
        // Switch to market shopping
        setTimeout(() => {
          setPhase("market_shopping");
          setMascotPose("victory");
          generateMarketChoices(targetList[0], INGREDIENTS_POOL);
        }, 1200);
      } else {
        setTimeout(() => {
          generateWordChoices(targetList[nextCompleted.length], INGREDIENTS_POOL);
        }, 1000);
      }
    } else {
      // Failed Match
      playBeep(220, 'triangle', 0.25);
      setMascotPose("thinking");
      speakGuide(`حاول مرة أخرى يا بطل! ابحث عن كلمة ${currentTarget.name}!`);
    }
  };

  // Drag and drop handlers - PART 2
  const handleDropInBasket = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData("text/plain");
    const nextIndex = basketList.length;
    const currentTarget = targetList[nextIndex];

    if (droppedId === currentTarget.id) {
      // Match!
      playBeep(880, 'sine', 0.2);
      const nextBasket = [...basketList, droppedId];
      setBasketList(nextBasket);
      setMascotPose("victory");

      if (nextBasket.length === 5) {
        // Complete Game!
        speakGuide("أحسنت يا بطل! لقد جمعت كل طلبات التسوق بنجاح ساحق! لننتقل للطهي الآن!");
        setTimeout(() => {
          onComplete(targetList);
        }, 1500);
      } else {
        setTimeout(() => {
          generateMarketChoices(targetList[nextBasket.length], INGREDIENTS_POOL);
        }, 1000);
      }
    } else {
      // Mistake
      playBeep(220, 'triangle', 0.25);
      setMascotPose("thinking");
      speakGuide(`ليست هذه! ابحث عن ثمرة الـ ${currentTarget.name} اللذيذة!`);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#FFFCE6] to-[#FFF3CD] z-40 flex flex-col font-sans select-none overflow-hidden pb-6">
      
      {/* 1. CLAY STYLE TOP HEADER */}
      <div className="w-full px-6 py-4 flex items-center justify-between z-50">
        <button
          onClick={onBack}
          className="w-24 h-24 hover:scale-105 active:translate-y-1 active:scale-95 transition-all select-none cursor-pointer"
        >
          <svg viewBox="0 0 200 228" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="btnGradShopping" x1="48" y1="38" x2="152" y2="168" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE04A"></stop>
                <stop offset="44%" stopColor="#FFAA00"></stop>
                <stop offset="100%" stopColor="#FF7800"></stop>
              </linearGradient>
              <radialGradient id="glossShopping" cx="34%" cy="26%" r="50%" fx="25%" fy="17%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.90"></stop>
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.20"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="rimShopping" cx="50%" cy="50%" r="50%">
                <stop offset="65%" stopColor="#ffffff" stopOpacity="0"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28"></stop>
              </radialGradient>
              <clipPath id="ccShopping">
                <circle cx="100" cy="104" r="58"></circle>
              </clipPath>
            </defs>
            <circle cx="100" cy="112" r="58" fill="#C04800" opacity="0.9"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#btnGradShopping)" stroke="white" strokeWidth="6"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#rimShopping)" clipPath="url(#ccShopping)"></circle>
            <ellipse cx="78" cy="74" rx="36" ry="25" fill="url(#glossShopping)" clipPath="url(#ccShopping)"></ellipse>
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
            <rect x="92" y="112" width="16" height="14" rx="4" fill="url(#btnGradShopping)"></rect>
          </svg>
        </button>

        {/* Title Board */}
        <div className="bg-[#4D2B82] text-white font-black px-8 py-3 rounded-[24px] border-[4px] border-white shadow-md text-lg flex items-center gap-2">
          <span>🛒</span>
          <span>{phase === "list_writing" ? "كتابة قائمة المشتريات" : "مغامرة التسوق في السوق"}</span>
        </div>

        {/* Audio helper button */}
        <button
          onClick={() => speakGuide(instructionText)}
          className="w-14 h-14 bg-amber-400 hover:bg-amber-500 border-[3.5px] border-white shadow-lg text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <Volume2 className="w-7 h-7 stroke-[2.5px]" />
        </button>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative">
        
        {/* Left column: Mascot Sprout (Mercurial guide) */}
        <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col items-center justify-center gap-4">
          <div className="w-32 h-32 md:w-44 md:h-44 bg-white/90 rounded-[40px] border-[5px] border-white shadow-xl flex items-center justify-center overflow-hidden scale-x-[-1]">
            <SproutMascot className="w-[100px] h-[100px] md:w-[150px] md:h-[150px]" pose={mascotPose} />
          </div>
          <div className="relative bg-white border-[4px] border-[#4D2B82] p-4 rounded-[24px] shadow-[0_5px_0_0_#4D2B82] text-right max-w-[200px]">
            <p className="text-[11px] font-black text-[#4D2B82] leading-relaxed">
              {instructionText}
            </p>
          </div>
        </div>

        {/* Center column: Active Game Board */}
        <div className="col-span-1 md:col-span-9 w-full flex flex-col items-center justify-center gap-6 relative">
          
          <AnimatePresence mode="wait">
            {phase === "list_writing" ? (
              
              /* ================================================================= */
              /* PHASE 1: LIST WRITING (Drag text block) */
              /* ================================================================= */
              <motion.div
                key="writing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg flex flex-col items-center gap-6"
              >
                {/* The Wooden Board Crate container */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropOnList}
                  className="w-full bg-[#8B5A2B] border-[6px] border-[#5C3A21] rounded-[36px] p-6 shadow-2xl relative overflow-hidden"
                >
                  {/* Outer wooden border lines */}
                  <div className="absolute inset-2 border-[2px] border-dashed border-[#FFFCE6]/30 rounded-[28px] pointer-events-none" />
                  
                  <h4 className="text-center font-black text-[#FFFCE6] text-xl mb-4 border-b-2 border-dashed border-[#FFFCE6]/25 pb-2">
                    📋 قائمة المكونات للطهي
                  </h4>

                  {/* List Items */}
                  <div className="flex flex-col gap-3">
                    {targetList.map((item, idx) => {
                      const isMatched = completedList.length > idx;
                      const isActive = completedList.length === idx;

                      return (
                        <div
                          key={item.id}
                          className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between border-2 transition-all ${
                            isMatched
                              ? 'bg-emerald-500/10 border-emerald-400 text-white'
                              : isActive
                              ? 'bg-amber-400/10 border-amber-300 text-amber-900 animate-pulse border-dashed'
                              : 'bg-[#704214]/50 border-transparent text-[#FFFCE6]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-sm opacity-60">#{idx + 1}</span>
                            <span className="font-black text-base">{isMatched ? item.name : "................"}</span>
                          </div>
                          
                          {/* Checked slot icon */}
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            isMatched ? 'bg-emerald-500 border-white text-white' : 'border-[#FFFCE6]/30'
                          }`}>
                            {isMatched && <Check className="w-4 h-4 stroke-[3px]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Draggable Word Choices */}
                <div className="flex flex-wrap justify-center gap-4 w-full mt-2">
                  {wordChoices.map((choice) => {
                    const isAlreadyMatched = completedList.includes(choice.id);
                    return (
                      <motion.div
                        key={choice.id}
                        draggable={!isAlreadyMatched}
                        onDragStart={(e: any) => handleDragStart(e, choice.id)}
                        whileHover={!isAlreadyMatched ? { scale: 1.05 } : {}}
                        whileTap={!isAlreadyMatched ? { scale: 0.95 } : {}}
                        className={`px-6 py-4 rounded-[24px] border-[4px] font-black text-lg text-center shadow-lg transition-all ${
                          isAlreadyMatched
                            ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed scale-90 opacity-55'
                            : 'bg-white border-purple-400 hover:border-purple-600 text-purple-900 cursor-grab active:cursor-grabbing'
                        }`}
                        style={{
                          boxShadow: !isAlreadyMatched ? '0 6px 0 0 #D8B4FE' : 'none'
                        }}
                      >
                        {choice.name}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              
              /* ================================================================= */
              /* PHASE 2: MARKET SHOPPING (Drag visual food) */
              /* ================================================================= */
              <motion.div
                key="shopping"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex flex-col md:flex-row gap-6 items-center justify-between"
              >
                
                {/* 1. Left side: The Shelf of Fresh Foods */}
                <div className="flex-grow w-full max-w-md bg-[#D97706]/10 border-4 border-amber-300 rounded-[36px] p-6 shadow-xl relative overflow-hidden flex flex-col gap-6">
                  <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                  
                  <h4 className="text-right font-black text-[#78350F] text-lg mb-2 relative z-10">
                    🧺 رفوف الخضراوات الطازجة:
                  </h4>

                  {/* Market Items grid */}
                  <div className="grid grid-cols-3 gap-6 relative z-10">
                    {marketChoices.map((item) => {
                      const isAlreadyInBasket = basketList.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col items-center justify-center"
                        >
                          <motion.div
                            draggable={!isAlreadyInBasket}
                            onDragStart={(e: any) => handleDragStart(e, item.id)}
                            whileHover={!isAlreadyInBasket ? { scale: 1.15 } : {}}
                            whileTap={!isAlreadyInBasket ? { scale: 0.95 } : {}}
                            className={`w-20 h-20 bg-white border-[3.5px] border-amber-200 rounded-[24px] flex items-center justify-center shadow-md relative ${
                              isAlreadyInBasket
                                ? 'opacity-25 filter grayscale cursor-not-allowed'
                                : 'cursor-grab active:cursor-grabbing hover:border-amber-400'
                            }`}
                          >
                            <IngredientSVG id={item.id} className="w-14 h-14 object-contain" />
                            {isAlreadyInBasket && (
                              <div className="absolute inset-0 bg-black/10 rounded-[20px] flex items-center justify-center text-emerald-500 font-bold">
                                ✓
                              </div>
                            )}
                          </motion.div>
                          <span className="text-[11px] font-black text-amber-900 mt-1">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Right side: The Shopping Wooden Crate */}
                <div className="flex flex-col items-center gap-4">
                  
                  {/* Shopping crate target box */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropInBasket}
                    className="relative w-52 h-40 bg-[#92400E] border-[6px] border-[#451A03] rounded-[28px] shadow-2xl flex flex-col items-center justify-center p-4"
                  >
                    {/* Metal corner highlights */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-500 rounded-tl-[20px]" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-500 rounded-tr-[20px]" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-yellow-500 rounded-bl-[20px]" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-yellow-500 rounded-br-[20px]" />

                    {/* Basket items listing preview inside */}
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-[160px] relative z-10">
                      {basketList.length === 0 ? (
                        <span className="text-center font-extrabold text-sm text-[#FCD34D] animate-pulse">
                          اسحب الخضراوات هنا!
                        </span>
                      ) : (
                        basketList.map((bid) => (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            key={bid}
                            className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-inner"
                          >
                            <IngredientSVG id={bid} className="w-8 h-8 object-contain" />
                          </motion.div>
                        ))
                      )}
                    </div>

                    <div className="absolute bottom-2 font-black text-[10px] text-amber-100 uppercase tracking-widest">
                      صندوق بلومي للتسوق
                    </div>
                  </div>

                  {/* Completed tasks mini-checklist board */}
                  <div className="bg-[#78350F] text-amber-100 border-[3.5px] border-white rounded-[22px] p-3 shadow-md w-full max-w-[180px]">
                    <span className="block text-center font-black text-[10px] uppercase border-b border-amber-800 pb-1 mb-1.5">
                      قائمة المشتريات:
                    </span>
                    <div className="flex flex-col gap-1 text-[11px]">
                      {targetList.map((item, idx) => {
                        const inBasket = basketList.includes(item.id);
                        return (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className={inBasket ? "line-through opacity-50" : "font-extrabold"}>
                              {item.name}
                            </span>
                            <span className={inBasket ? "text-emerald-400" : "text-amber-500"}>
                              {inBasket ? "✓" : "○"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
