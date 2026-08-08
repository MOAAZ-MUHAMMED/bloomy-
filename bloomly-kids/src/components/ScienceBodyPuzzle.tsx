import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Check } from 'lucide-react';
import SproutMascot from './MascotCharacter';

// Audio Synthesizer
const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.15) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

interface BodyPart {
  id: string;
  name: string;
  emoji: string;
  targetX: number; // percentage
  targetY: number; // percentage
  info: string;
}

const BODY_PARTS: BodyPart[] = [
  { id: 'brain', name: 'العقل والذكاء', emoji: '🧠', targetX: 50, targetY: 15, info: "هذا هو الدماغ! يفكر، ويتخيل، ويساعدنا على التعلم وحفظ الدروس!" },
  { id: 'heart', name: 'القلب النابض', emoji: '❤️', targetX: 50, targetY: 38, info: "هذا هو القلب! ينبض ويضخ الدم في كل أنحاء الجسم ليمدنا بالنشاط والقوة!" },
  { id: 'hand', name: 'اليد والذراع', emoji: '🖐️', targetX: 20, targetY: 42, info: "هذه هي اليد! نمسك بها الأشياء، ونرسم بها اللوحات، ونلوح لأصحابنا!" },
  { id: 'head', name: 'الوجه والرأس', emoji: '👦', targetX: 50, targetY: 23, info: "هذا هو الوجه والرأس! يحتوي على العينين لنرى، والأذنين لنسمع، والفم لنأكل ونتكلم!" },
  { id: 'foot', name: 'الرجل والقدم', emoji: '👟', targetX: 50, targetY: 80, info: "هذه هي القدم! نمشي ونجري بها، ونقفز عالياً في الحديقة السحرية!" }
];

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function ScienceBodyPuzzle({ onComplete, onBack }: Props) {
  const [completedParts, setCompletedParts] = useState<string[]>([]);
  const [activePartIndex, setActivePartIndex] = useState<number>(0);
  const [instructionText, setInstructionText] = useState<string>("");
  const [mascotState, setMascotState] = useState<string>("talking");

  useEffect(() => {
    guideNextPart(0);
  }, []);

  const speakGuide = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.pitch = 1.15;
      utterance.rate = 0.95;
      utterance.onstart = () => setMascotState("talking");
      utterance.onend = () => setMascotState("neutral");
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const guideNextPart = (index: number) => {
    if (index >= BODY_PARTS.length) {
      setInstructionText("مذهل! لقد أكملت تركيب كل أجزاء الجسم بنجاح باهر! 🎉🐾");
      speakGuide("أحسنت يا بطل! لقد أكملت تركيب كل أجزاء جسم الإنسان وتعرفت على وظائفها الحيوية! أنت عالم عبقري!");
      setTimeout(onComplete, 4000);
      return;
    }
    const current = BODY_PARTS[index];
    setActivePartIndex(index);
    setInstructionText(`اسحب (${current.name}) وضعه في مكانه الصحيح!`);
    speakGuide(`اسحب ${current.name} وضعه في مكانه الصحيح على مجسم الطفل!`);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDropOnTarget = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const currentTarget = BODY_PARTS[activePartIndex];

    if (draggedId === currentTarget.id && targetId === currentTarget.id) {
      // Success Match!
      playBeep(600, 'sine', 0.2);
      const nextCompleted = [...completedParts, draggedId];
      setCompletedParts(nextCompleted);
      setMascotState("happy");

      // Speak info about the part
      speakGuide(currentTarget.info);

      // Wait for speech description to complete, then move to next part
      setTimeout(() => {
        guideNextPart(nextCompleted.length);
      }, 5500);
    } else {
      // Fail Match
      playBeep(220, 'triangle', 0.25);
      setMascotState("thinking");
      speakGuide(`ليست هذه! ابحث عن ${currentTarget.name} واسحبها لمكانها الوامض!`);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#FFF5F5] via-[#FFF5EB] to-[#FFFBEB] z-40 flex flex-col font-sans select-none overflow-hidden pb-6">
      
      {/* HEADER */}
      <div className="w-full px-6 py-4 flex items-center justify-between z-50">
        <button
          onClick={onBack}
          className="w-24 h-24 hover:scale-105 active:translate-y-1 active:scale-95 transition-all select-none cursor-pointer"
        >
          <svg viewBox="0 0 200 228" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="btnGradBody" x1="48" y1="38" x2="152" y2="168" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE04A"></stop>
                <stop offset="44%" stopColor="#FFAA00"></stop>
                <stop offset="100%" stopColor="#FF7800"></stop>
              </linearGradient>
              <radialGradient id="glossBody" cx="34%" cy="26%" r="50%" fx="25%" fy="17%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.90"></stop>
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.20"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="rimBody" cx="50%" cy="50%" r="50%">
                <stop offset="65%" stopColor="#ffffff" stopOpacity="0"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28"></stop>
              </radialGradient>
              <clipPath id="ccBody">
                <circle cx="100" cy="104" r="58"></circle>
              </clipPath>
            </defs>
            <circle cx="100" cy="112" r="58" fill="#C04800" opacity="0.9"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#btnGradBody)" stroke="white" strokeWidth="6"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#rimBody)" clipPath="url(#ccBody)"></circle>
            <ellipse cx="78" cy="74" rx="36" ry="25" fill="url(#glossBody)" clipPath="url(#ccBody)"></ellipse>
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
            <rect x="92" y="112" width="16" height="14" rx="4" fill="url(#btnGradBody)"></rect>
          </svg>
        </button>

        {/* Board */}
        <div className="bg-[#A855F7] text-white font-black px-8 py-3 rounded-[24px] border-[4px] border-white shadow-md text-lg flex items-center gap-2">
          <span>🧠</span>
          <span>علوم: تركيب جسم الإنسان</span>
        </div>

        {/* Audio Helper */}
        <button
          onClick={() => speakGuide(instructionText)}
          className="w-14 h-14 bg-amber-400 hover:bg-amber-500 border-[3.5px] border-white shadow-lg text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <Volume2 className="w-7 h-7 stroke-[2.5px]" />
        </button>
      </div>

      {/* WORKSPACE */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative">
        
        {/* Left column: Mascot Sprout (Mercurial guide) */}
        <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col items-center justify-center gap-4">
          <div className="w-32 h-32 md:w-44 md:h-44 bg-white/90 rounded-[40px] border-[5px] border-white shadow-xl flex items-center justify-center overflow-hidden scale-x-[-1]">
            <SproutMascot className="w-[100px] h-[100px] md:w-[150px] md:h-[150px]" state={mascotState} />
          </div>
          <div className="relative bg-white border-[4px] border-[#4D2B82] p-4 rounded-[24px] shadow-[0_5px_0_0_#4D2B82] text-right max-w-[200px]">
            <p className="text-[11px] font-black text-[#4D2B82] leading-relaxed">
              {instructionText}
            </p>
          </div>
        </div>

        {/* Center column: Silhouette Body Grid */}
        <div className="col-span-1 md:col-span-6 w-full flex items-center justify-center relative">
          
          <div className="relative w-72 h-[380px] bg-sky-100/50 border-4 border-dashed border-sky-300 rounded-[50px] flex items-center justify-center shadow-inner overflow-hidden">
            
            {/* Outline Child Mascot Body SVG */}
            <svg viewBox="0 0 100 150" className="absolute inset-0 w-full h-full opacity-35 fill-none stroke-sky-400 stroke-[1.5] stroke-dasharray-[4 2]">
              {/* Head */}
              <circle cx="50" cy="35" r="18" />
              {/* Body */}
              <rect x="36" y="53" width="28" height="46" rx="6" />
              {/* Arms */}
              <line x1="36" y1="58" x2="16" y2="76" strokeLinecap="round" />
              <line x1="64" y1="58" x2="84" y2="76" strokeLinecap="round" />
              {/* Legs */}
              <line x1="42" y1="99" x2="42" y2="135" strokeLinecap="round" />
              <line x1="58" y1="99" x2="58" y2="135" strokeLinecap="round" />
            </svg>

            {/* Drop Target Slots */}
            {BODY_PARTS.map((part, idx) => {
              const isMatched = completedParts.includes(part.id);
              const isActive = activePartIndex === idx && completedParts.length === idx;

              return (
                <div
                  key={part.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnTarget(e, part.id)}
                  className={`absolute w-12 h-12 rounded-full border-[3px] flex items-center justify-center transition-all ${
                    isMatched
                      ? 'bg-purple-500 border-white text-white shadow-md'
                      : isActive
                      ? 'bg-amber-300/40 border-amber-500 text-amber-900 border-dashed animate-pulse scale-110 shadow-lg'
                      : 'bg-slate-200/50 border-slate-300 text-slate-400'
                  }`}
                  style={{
                    left: `${part.targetX}%`,
                    top: `${part.targetY}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: isActive ? '0 0 15px #f59e0b' : 'none'
                  }}
                >
                  <span className="text-xl">{isMatched ? part.emoji : "?"}</span>
                  {isMatched && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border border-white rounded-full flex items-center justify-center text-[8px] text-white">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}

          </div>

        </div>

        {/* Right column: Drag Source Shelf */}
        <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col gap-4 justify-center items-center">
          
          <div className="bg-[#A855F7]/10 border-4 border-purple-300 rounded-[30px] p-4 w-full max-w-[200px] shadow-lg flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 pointer-events-none" />
            
            <span className="block text-center font-black text-xs text-[#7C3AED] relative z-10 border-b border-purple-200 pb-1 mb-1">
              أعضاء الجسم:
            </span>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 justify-items-center relative z-10">
              {BODY_PARTS.map((part) => {
                const isMatched = completedParts.includes(part.id);
                return (
                  <motion.div
                    key={part.id}
                    draggable={!isMatched}
                    onDragStart={(e) => handleDragStart(e, part.id)}
                    whileHover={!isMatched ? { scale: 1.1 } : {}}
                    className={`w-14 h-14 bg-white border-[3px] border-purple-200 rounded-2xl flex flex-col items-center justify-center shadow-md relative ${
                      isMatched ? 'opacity-30 filter grayscale cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    <span className="text-2xl">{part.emoji}</span>
                    <span className="text-[8px] font-black text-purple-900 leading-none mt-1">{part.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
