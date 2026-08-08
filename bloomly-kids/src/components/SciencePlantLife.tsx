import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Sun, CloudRain } from 'lucide-react';
import SproutMascot from './MascotCharacter';

// Synthesize Cute Sound Effects
const playSound = (freq = 440, type: OscillatorType = 'sine', duration = 0.15) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function SciencePlantLife({ onComplete, onBack }: Props) {
  // Game stages: 
  // 1. "seed" (need to drag seed to soil)
  // 2. "water1" (need to water soil to sprout)
  // 3. "sun" (need to drag sun to grow plant)
  // 4. "water2" (need to water once more to bloom)
  // 5. "bloomed" (celebration!)
  const [stage, setStage] = useState<"seed" | "water1" | "sun" | "water2" | "bloomed">("seed");
  const [isWatering, setIsWatering] = useState<boolean>(false);
  const [instructionText, setInstructionText] = useState<string>("اسحب البذرة السحرية وازرعها في التربة الطينية!");

  const speakGuide = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.pitch = 1.15;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData("text/plain", item);
  };

  const handleDropOnSoil = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer ? e.dataTransfer.getData("text/plain") : "";
    
    // Fallback or explicit drag item match
    if (stage === "seed") {
      playSound(330, 'triangle', 0.25); // digging sound
      setStage("water1");
      setInstructionText("أحسنت! اسحب مرش المياه لتسقي التربة بقطرات الماء! 💧🌧️");
      speakGuide("أحسنت زراعة البذرة! الآن اسحب مرش المياه لتسقي التربة بالماء العذب!");
    }
  };

  const triggerWatering = () => {
    if (stage === "water1") {
      setIsWatering(true);
      playSound(600, 'sine', 0.6); // water sound
      setTimeout(() => {
        setIsWatering(false);
        setStage("sun");
        setInstructionText("رائع! لقد نمت البذرة لتصبح برعماً صغيراً! اسحب الشمس الضاحكة لتدفئتها! ☀️🌱");
        speakGuide("بركات الماء! لقد نمت البذرة لتصبح برعماً صغيراً! اسحب الشمس الضاحكة لتدفئتها وتنشيط البناء الضوئي!");
      }, 1500);
    } else if (stage === "water2") {
      setIsWatering(true);
      playSound(650, 'sine', 0.8);
      setTimeout(() => {
        setIsWatering(false);
        setStage("bloomed");
        setInstructionText("يا للروعة! لقد تفتحت زهرة بلومي السحرية! أنت عالم أحياء رائع! 🌸✨🎉");
        speakGuide("يا للروعة والجمال! لقد تفتحت زهرة بلومي السحرية وصارت ترقص مبهجة! أنت عالم أحياء عبقري!");
        setTimeout(onComplete, 4000);
      }, 1800);
    }
  };

  const triggerSunlight = () => {
    if (stage === "sun") {
      playSound(880, 'sine', 0.45); // magic growth chime
      setStage("water2");
      setInstructionText("حسناً! النبتة كبرت وصار لها برعم زهرة! اسحب مرش المياه مرة أخيرة لتتفتح! 💧🌿");
      speakGuide("مذهل! شمس الدفء جعلت النبتة تكبر ويظهر برعم زهرة! اسحب مرش المياه مرة أخيرة لتتفتح الزهرة!");
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#F0FDFA] z-40 flex flex-col font-sans select-none overflow-hidden pb-6">
      
      {/* HEADER */}
      <div className="w-full px-6 py-4 flex items-center justify-between z-50">
        <button
          onClick={onBack}
          className="w-24 h-24 hover:scale-105 active:translate-y-1 active:scale-95 transition-all select-none cursor-pointer"
        >
          <svg viewBox="0 0 200 228" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="btnGradPlant" x1="48" y1="38" x2="152" y2="168" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE04A"></stop>
                <stop offset="44%" stopColor="#FFAA00"></stop>
                <stop offset="100%" stopColor="#FF7800"></stop>
              </linearGradient>
              <radialGradient id="glossPlant" cx="34%" cy="26%" r="50%" fx="25%" fy="17%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.90"></stop>
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.20"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="rimPlant" cx="50%" cy="50%" r="50%">
                <stop offset="65%" stopColor="#ffffff" stopOpacity="0"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28"></stop>
              </radialGradient>
              <clipPath id="ccPlant">
                <circle cx="100" cy="104" r="58"></circle>
              </clipPath>
            </defs>
            <circle cx="100" cy="112" r="58" fill="#C04800" opacity="0.9"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#btnGradPlant)" stroke="white" strokeWidth="6"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#rimPlant)" clipPath="url(#ccPlant)"></circle>
            <ellipse cx="78" cy="74" rx="36" ry="25" fill="url(#glossPlant)" clipPath="url(#ccPlant)"></ellipse>
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
            <rect x="92" y="112" width="16" height="14" rx="4" fill="url(#btnGradPlant)"></rect>
          </svg>
        </button>

        {/* Board */}
        <div className="bg-[#0D9488] text-white font-black px-8 py-3 rounded-[24px] border-[4px] border-white shadow-md text-lg flex items-center gap-2">
          <span>🌿</span>
          <span>علوم: دورة حياة النبات</span>
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
        
        {/* Left Side: Seed Packet / Watering Can / Sun Tools */}
        <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col gap-6 justify-center items-center">
          
          {/* 1. Seed Packet Card */}
          {stage === "seed" && (
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 300, top: -150, bottom: 200 }}
              onDragEnd={(e, info) => {
                // If dropped near the soil in the center
                if (info.point.x > window.innerWidth * 0.4 && info.point.x < window.innerWidth * 0.7) {
                  handleDropOnSoil(e as any);
                }
              }}
              whileHover={{ scale: 1.1 }}
              className="bg-white border-[4px] border-amber-400 p-4 rounded-[28px] shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing w-36 h-40"
              style={{ boxShadow: '0 6px 0 0 #D97706' }}
            >
              {/* Seed packet design */}
              <div className="text-3xl mb-1">🌱</div>
              <span className="font-black text-xs text-amber-900 text-center">بذور بلومي السحرية</span>
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-2 animate-pulse">
                اسحب للتربة
              </span>
            </motion.div>
          )}

          {/* 2. Watering Can */}
          {(stage === "water1" || stage === "water2") && (
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 300, top: -150, bottom: 200 }}
              onDragEnd={(e, info) => {
                if (info.point.x > window.innerWidth * 0.4 && info.point.x < window.innerWidth * 0.7) {
                  triggerWatering();
                }
              }}
              whileHover={{ scale: 1.1 }}
              className="bg-white border-[4px] border-sky-400 p-4 rounded-[28px] shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing w-36 h-40"
              style={{ boxShadow: '0 6px 0 0 #0284C7' }}
            >
              {/* Watering Can SVG */}
              <svg viewBox="0 0 100 80" className="w-20 h-16">
                <path d="M 20 20 L 60 20 L 70 70 L 10 70 Z" fill="#0EA5E9" stroke="#0369A1" strokeWidth="4" />
                <path d="M 70 45 L 92 30" fill="none" stroke="#0369A1" strokeWidth="6" strokeLinecap="round" />
                <path d="M 10 30 Q -5 45, 10 60" fill="none" stroke="#0369A1" strokeWidth="4.5" />
              </svg>
              <span className="font-black text-xs text-sky-900 mt-2 text-center">مرش المياه</span>
              <span className="text-[10px] text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full mt-1.5 animate-pulse">
                اسحب لتسقي
              </span>
            </motion.div>
          )}

          {/* 3. The Smiling Sun */}
          {stage === "sun" && (
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 300, top: -150, bottom: 200 }}
              onDragEnd={(e, info) => {
                if (info.point.x > window.innerWidth * 0.4 && info.point.x < window.innerWidth * 0.7) {
                  triggerSunlight();
                }
              }}
              whileHover={{ scale: 1.1 }}
              className="bg-white border-[4px] border-amber-400 p-4 rounded-[28px] shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing w-36 h-40"
              style={{ boxShadow: '0 6px 0 0 #D97706' }}
            >
              <Sun className="w-16 h-16 text-amber-500 fill-amber-300 animate-spin" style={{ animationDuration: '20s' }} />
              <span className="font-black text-xs text-amber-900 mt-2 text-center">شمس الدفء</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-1.5 animate-pulse">
                اسحب لتسخين
              </span>
            </motion.div>
          )}

        </div>

        {/* Center: The Soil Bed & Sprout Growth stages */}
        <div className="col-span-1 md:col-span-6 flex flex-col items-center justify-center gap-6">
          
          <div className="mb-2 bg-white border-[4px] border-[#0D9488] px-6 py-2.5 rounded-[22px] shadow-md text-center max-w-sm">
            <span className="text-xs md:text-sm font-black text-[#0D9488]">
              {instructionText}
            </span>
          </div>

          {/* PLANT BED CONTAINER */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnSoil}
            className="relative w-72 h-72 bg-gradient-to-b from-sky-100 to-amber-50 border-[5px] border-emerald-600 rounded-[50px] shadow-2xl flex flex-col items-center justify-end p-6 overflow-hidden"
          >
            
            {/* Twinkling Water Drops Animation */}
            {isWatering && (
              <div className="absolute inset-x-0 top-6 flex justify-around text-sky-400 text-3xl animate-bounce z-20">
                <span>💧</span>
                <span>💧</span>
                <span>💧</span>
                <span>💧</span>
              </div>
            )}

            {/* Sunlight rays overlay */}
            {stage === "water2" && (
              <div className="absolute inset-0 bg-yellow-300/10 pointer-events-none z-10 animate-pulse" />
            )}

            {/* Soil Mound */}
            <div className="absolute bottom-0 w-60 h-20 bg-[#653B18] border-t-4 border-[#3D220D] rounded-t-[40px] z-10 flex items-center justify-center">
              {stage === "seed" && (
                <span className="text-sm font-black text-[#FFD3B6]/60 animate-pulse">
                  ضع البذرة هنا!
                </span>
              )}
            </div>

            {/* STAGE GRAPHICS */}
            <div className="relative z-10 mb-12 flex flex-col items-center">
              <AnimatePresence mode="wait">
                
                {stage === "seed" && (
                  <motion.div key="stage0" className="w-10 h-10" />
                )}

                {stage === "water1" && (
                  <motion.div
                    key="stage1"
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-16 h-8 bg-amber-800 border-2 border-[#3D220D] rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-amber-100">بذرة مزروعة</span>
                  </motion.div>
                )}

                {stage === "sun" && (
                  <motion.div
                    key="stage2"
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1.1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    {/* Tiny Sprout SVG */}
                    <svg viewBox="0 0 40 40" className="w-16 h-16">
                      <path d="M 20 40 Q 20 20, 26 12" fill="none" stroke="#22C55E" strokeWidth="4.5" strokeLinecap="round" />
                      {/* Leaf Left */}
                      <path d="M 20 25 Q 10 18, 12 12 Q 20 18, 20 25" fill="#4ADE80" stroke="#166534" strokeWidth="1.5" />
                      {/* Leaf Right */}
                      <path d="M 22 20 Q 32 15, 30 10 Q 24 15, 22 20" fill="#4ADE80" stroke="#166534" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}

                {stage === "water2" && (
                  <motion.div
                    key="stage3"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1.15, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    {/* Small Plant with Bud */}
                    <svg viewBox="0 0 50 60" className="w-24 h-24">
                      <path d="M 25 60 Q 22 30, 25 15" fill="none" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
                      {/* Leaves */}
                      <path d="M 24 40 Q 10 32, 12 25 Q 22 32, 24 40" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                      <path d="M 25 30 Q 40 22, 38 15 Q 28 22, 25 30" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                      {/* Small Bud on top */}
                      <circle cx="25" cy="12" r="7" fill="#F43F5E" stroke="#9F1239" strokeWidth="2.5" />
                    </svg>
                  </motion.div>
                )}

                {stage === "bloomed" && (
                  <motion.div
                    key="stage4"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: [1, 1.1, 1], rotate: 0 }}
                    transition={{ scale: { duration: 0.5 }, rotate: { duration: 0.5 } }}
                    className="flex flex-col items-center animate-bounce"
                    style={{ animationDuration: '3s' }}
                  >
                    {/* Fully Bloomed Smiling SunFlower */}
                    <svg viewBox="0 0 100 120" className="w-36 h-36">
                      {/* Stem */}
                      <path d="M 50 120 Q 46 80, 50 60" fill="none" stroke="#16A34A" strokeWidth="7.5" strokeLinecap="round" />
                      {/* Big Leaves */}
                      <path d="M 48 90 Q 25 80, 28 70 Q 42 78, 48 90" fill="#22C55E" stroke="#15803D" strokeWidth="3" />
                      <path d="M 52 80 Q 75 70, 72 60 Q 58 68, 52 80" fill="#22C55E" stroke="#15803D" strokeWidth="3" />
                      
                      {/* Yellow Petals Circle */}
                      <circle cx="50" cy="45" r="28" fill="#FBBF24" stroke="#D97706" strokeWidth="3.5" strokeDasharray="10 5" />
                      {/* Flower Center */}
                      <circle cx="50" cy="45" r="18" fill="#78350F" stroke="#451A03" strokeWidth="3.5" />
                      {/* Smiling Face */}
                      <circle cx="43" cy="40" r="2.5" fill="#FFF" />
                      <circle cx="57" cy="40" r="2.5" fill="#FFF" />
                      <path d="M 45 48 Q 50 53, 55 48" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* Right Side: Mascot Sprout (Mercurial guide) */}
        <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col items-center justify-center gap-4">
          <div className="w-32 h-32 md:w-44 md:h-44 bg-white/90 rounded-[40px] border-[5px] border-white shadow-xl flex items-center justify-center overflow-hidden scale-x-[-1]">
            <SproutMascot className="w-[100px] h-[100px] md:w-[150px] md:h-[150px]" pose={stage === "bloomed" ? "victory" : "talking"} />
          </div>
          
          <span className="text-xs font-black text-emerald-800 bg-emerald-50 border-2 border-emerald-300 px-4 py-1.5 rounded-full mt-2 shadow-md">
            {stage === "bloomed" ? "زهرة بلومي نمت! 🌸🎉" : "ساعد البذرة لتنمو! 🌱☀️"}
          </span>
        </div>

      </div>

    </div>
  );
}
