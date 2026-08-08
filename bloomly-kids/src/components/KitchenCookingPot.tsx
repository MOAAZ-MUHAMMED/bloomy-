import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Flame, RotateCcw } from 'lucide-react';
import DogMascot from './DogMascot';
import { Ingredient, IngredientSVG, INGREDIENTS_POOL } from './MarketShoppingGame';

// Synthesize Cute Sound Effects
const playSound = (freq = 440, type: OscillatorType = 'sine', duration = 0.15) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (type === 'triangle') {
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
    } else {
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

interface Props {
  collectedIngredients?: Ingredient[];
  onComplete: () => void;
  onBack: () => void;
}

export default function KitchenCookingPot({ collectedIngredients, onComplete, onBack }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [potIngredients, setPotIngredients] = useState<string[]>([]);
  const [cookingState, setCookingState] = useState<"preparation" | "mixing" | "cooked" | "feeding">("preparation");
  
  // Bloomly Dog Mascot Pose
  const [dogPose, setDogPose] = useState<"waving" | "happy" | "idle">("waving");
  const [instructionText, setInstructionText] = useState<string>("اسحب المكونات وضعها في حلة الطهي السحرية!");

  useEffect(() => {
    if (collectedIngredients && collectedIngredients.length === 5) {
      setIngredients(collectedIngredients);
    } else {
      // Default set if launched directly
      const shuffled = [...INGREDIENTS_POOL].sort(() => 0.5 - Math.random());
      setIngredients(shuffled.slice(0, 5));
    }
    speakGuide("أهلاً بك في المطبخ الصغير! اسحب المكونات وضعها داخل حلة الطهي السحرية لصنع حساء لذيذ!");
  }, [collectedIngredients]);

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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDropInPot = (e: React.DragEvent) => {
    e.preventDefault();
    if (cookingState !== "preparation") return;

    const droppedId = e.dataTransfer.getData("text/plain");
    if (ingredients.some(i => i.id === droppedId) && !potIngredients.includes(droppedId)) {
      // Add to pot!
      playSound(330, 'triangle', 0.2); // splash sound
      const nextPot = [...potIngredients, droppedId];
      setPotIngredients(nextPot);
      setDogPose("happy");

      if (nextPot.length === 5) {
        setInstructionText("كل المكونات جاهزة! اضغط على زر الطهي والخلط الآن! 🔥🍲");
        speakGuide("رائع! كل المكونات في الحلة الآن! اضغط على الزر الأحمر لنقوم بطهي الحساء!");
      } else {
        const remaining = 5 - nextPot.length;
        setInstructionText(`حسناً! ضع بقية المكونات (متبقي ${remaining})`);
      }
    }
  };

  const startCooking = () => {
    if (potIngredients.length < 5) return;
    setCookingState("mixing");
    setDogPose("idle");
    setInstructionText("جاري طهي المكونات وخلطها... ♨️🌪️");
    playSound(400, 'sawtooth', 1.0); // mix whirring sound

    // Loop boiling sound
    let count = 0;
    const interval = setInterval(() => {
      playSound(450 + Math.random() * 100, 'sine', 0.15);
      count++;
      if (count > 12) {
        clearInterval(interval);
        // Complete cooking
        setCookingState("cooked");
        setDogPose("happy");
        setInstructionText("واااو! الحساء جاهز ولذيذ جداً! اسحب الطبق لإطعام الكلب بلومي الجائع! 🥣🐕");
        speakGuide("واااو! رائحة الحساء ذكية ومثالية! اسحب طبق الحساء لإطعام الكلب بلومي الجائع!");
      }
    }, 200);
  };

  const feedBloomly = () => {
    setCookingState("feeding");
    playSound(700, 'sine', 0.25); // gulp gulp sound
    setTimeout(() => playSound(880, 'sine', 0.15), 150);
    setTimeout(() => playSound(950, 'sine', 0.2), 300);

    setDogPose("happy");
    setInstructionText("يممي! لقد أعجب بلومي الحساء كثيراً! أنت طباخ رائع يا بطل! 🌟🐾🎉");
    speakGuide("يممي يممي! الحساء لذيذ للغاية وبلومي سعيد جداً! شكراً لك يا شيف بلومي الصغير!");
    
    // Complete game in 3 seconds
    setTimeout(() => {
      onComplete();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#FFF5F5] to-[#FFE4E6] z-40 flex flex-col font-sans select-none overflow-hidden pb-6">
      
      {/* HEADER */}
      <div className="w-full px-6 py-4 flex items-center justify-between z-50">
        <button
          onClick={onBack}
          className="w-24 h-24 hover:scale-105 active:translate-y-1 active:scale-95 transition-all select-none cursor-pointer"
        >
          <svg viewBox="0 0 200 228" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="btnGradKitchenPot" x1="48" y1="38" x2="152" y2="168" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE04A"></stop>
                <stop offset="44%" stopColor="#FFAA00"></stop>
                <stop offset="100%" stopColor="#FF7800"></stop>
              </linearGradient>
              <radialGradient id="glossKitchenPot" cx="34%" cy="26%" r="50%" fx="25%" fy="17%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.90"></stop>
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.20"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="rimKitchenPot" cx="50%" cy="50%" r="50%">
                <stop offset="65%" stopColor="#ffffff" stopOpacity="0"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28"></stop>
              </radialGradient>
              <clipPath id="ccKitchenPot">
                <circle cx="100" cy="104" r="58"></circle>
              </clipPath>
            </defs>
            <circle cx="100" cy="112" r="58" fill="#C04800" opacity="0.9"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#btnGradKitchenPot)" stroke="white" strokeWidth="6"></circle>
            <circle cx="100" cy="104" r="58" fill="url(#rimKitchenPot)" clipPath="url(#ccKitchenPot)"></circle>
            <ellipse cx="78" cy="74" rx="36" ry="25" fill="url(#glossKitchenPot)" clipPath="url(#ccKitchenPot)"></ellipse>
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
            <rect x="92" y="112" width="16" height="14" rx="4" fill="url(#btnGradKitchenPot)"></rect>
          </svg>
        </button>

        {/* Board */}
        <div className="bg-[#E11D48] text-white font-black px-8 py-3 rounded-[24px] border-[4px] border-white shadow-md text-lg flex items-center gap-2">
          <span>🍲</span>
          <span>شيف المطبخ الصغير</span>
        </div>

        {/* Spacer */}
        <div className="w-14 h-14" />
      </div>

      {/* WORKSPACE */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative">
        
        {/* Left Side: Shelf with collected foods */}
        <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col gap-4 justify-center items-center">
          <div className="bg-[#9F1239]/10 border-4 border-rose-300 rounded-[30px] p-4 w-full max-w-[200px] shadow-lg flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 pointer-events-none" />
            
            <span className="block text-center font-black text-xs text-[#9F1239] relative z-10 border-b border-rose-200 pb-1 mb-1">
              المكونات الطازجة:
            </span>

            <div className="flex flex-row md:flex-col flex-wrap gap-3 justify-center items-center relative z-10">
              {ingredients.map((item) => {
                const inPot = potIngredients.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    draggable={!inPot && cookingState === "preparation"}
                    onDragStart={(e: any) => handleDragStart(e, item.id)}
                    whileHover={!inPot && cookingState === "preparation" ? { scale: 1.1 } : {}}
                    className={`w-14 h-14 bg-white border-2 border-rose-200 rounded-2xl flex items-center justify-center shadow-md relative ${
                      inPot ? 'opacity-30 filter grayscale cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    <IngredientSVG id={item.id} className="w-10 h-10" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: The Cooking Stove & Pot */}
        <div className="col-span-1 md:col-span-6 flex flex-col items-center justify-center gap-6">
          
          <div className="relative flex flex-col items-center">
            
            {/* Instruction banner */}
            <div className="mb-4 bg-white border-[4px] border-[#E11D48] px-6 py-2.5 rounded-[20px] shadow-md text-center max-w-sm">
              <span className="text-sm font-black text-[#E11D48]">
                {instructionText}
              </span>
            </div>

            {/* STOVE & POT */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropInPot}
              className="relative w-64 h-52 bg-slate-300 border-[6px] border-slate-500 rounded-[40px] shadow-2xl flex flex-col items-center justify-end p-4"
            >
              {/* Burner rings */}
              <div className="absolute top-2 w-48 h-10 bg-slate-400 rounded-full border-t-2 border-slate-500 shadow-inner flex items-center justify-center">
                {/* Fire particles under mixing state */}
                {cookingState === "mixing" && (
                  <div className="flex gap-2 text-rose-500 text-lg animate-bounce">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <Flame className="w-5 h-5 text-red-500 fill-red-500" />
                    <Flame className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </div>

              {/* The Magic Casserole Pot SVG */}
              <motion.div
                animate={cookingState === "mixing" ? {
                  y: [0, -6, 0, -4, 0],
                  rotate: [-1, 1, -1, 0, 1]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-48 h-36 relative z-10 flex flex-col items-center justify-end"
              >
                {/* Pot body */}
                <div className="w-full h-24 bg-gradient-to-b from-sky-400 to-indigo-600 border-[4px] border-indigo-900 rounded-b-[30px] rounded-t-[10px] shadow-inner relative overflow-hidden flex items-center justify-center">
                  
                  {/* Boiling liquid top */}
                  <div className="absolute top-0 inset-x-0 h-4 bg-sky-300 border-b-2 border-indigo-900 rounded-t-[6px] flex justify-around overflow-hidden">
                    {cookingState === "mixing" && (
                      <div className="flex w-full justify-around text-white font-extrabold text-[8px] animate-pulse">
                        <span>⚪</span>
                        <span>o</span>
                        <span>o</span>
                        <span>⚪</span>
                      </div>
                    )}
                  </div>

                  {/* Inside items indicator */}
                  <div className="flex flex-wrap items-center justify-center gap-1 max-w-[120px] pt-4 relative z-10">
                    {cookingState === "cooked" ? (
                      <span className="text-3xl animate-bounce">🥣✨</span>
                    ) : (
                      potIngredients.map((id) => (
                        <div key={id} className="w-7 h-7 bg-white/80 rounded-lg flex items-center justify-center shadow-inner">
                          <IngredientSVG id={id} className="w-5 h-5" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pot Handles */}
                <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-4 h-10 bg-indigo-900 rounded-l-md" />
                <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-4 h-10 bg-indigo-900 rounded-r-md" />
              </motion.div>

            </div>

          </div>

          {/* Action button */}
          {potIngredients.length === 5 && cookingState === "preparation" && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCooking}
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-black px-10 py-4 rounded-[28px] border-[4px] border-white shadow-lg text-lg cursor-pointer"
            >
              🔥 اطبخ واخلط الحساء!
            </motion.button>
          )}

          {/* Soup ready bowl for feeding */}
          {cookingState === "cooked" && (
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 280, top: -200, bottom: 200 }}
              onDragEnd={(e, info) => {
                // If dragged near the right side (where Bloomly sits)
                if (info.point.x > window.innerWidth * 0.6) {
                  feedBloomly();
                }
              }}
              whileHover={{ scale: 1.1 }}
              className="bg-white border-[4px] border-amber-400 p-4 rounded-[30px] shadow-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing relative z-30"
              style={{ boxShadow: '0 8px 0 0 #D97706' }}
            >
              {/* Bowl SVG */}
              <svg viewBox="0 0 100 60" className="w-24 h-16">
                <path d="M 5 10 L 15 50 C 15 55, 85 55, 85 50 L 95 10 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="4.5" />
                <ellipse cx="50" cy="12" rx="45" ry="6" fill="#F97316" stroke="#D97706" strokeWidth="2.5" />
                <path d="M 15 50 Q 50 56, 85 50" fill="none" stroke="#D97706" strokeWidth="4" />
                <text x="35" y="42" fontSize="24">🍲</text>
              </svg>
              <span className="text-[10px] font-black text-amber-900 mt-1 uppercase tracking-wider animate-pulse">
                اسحب الطبق لإطعام بلومي!
              </span>
            </motion.div>
          )}

        </div>

        {/* Right Side: Hungry Bloomly Dog Mascot */}
        <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center gap-2">
          
          <div className="w-40 h-40 bg-white/95 rounded-[44px] border-[5px] border-white shadow-xl flex items-center justify-center overflow-hidden">
            <DogMascot pose={dogPose} className="w-36 h-36" />
          </div>
          
          <span className="text-xs font-black text-rose-800 bg-rose-50 border-2 border-rose-300 px-4 py-1.5 rounded-full mt-2 shadow-md">
            {dogPose === "waving" ? "بلومي جائع! 👅🐶" : dogPose === "happy" ? "أحب طعامك! 😍🐾" : "ينتظر الطعام... 🤔"}
          </span>
        </div>

      </div>

    </div>
  );
}
