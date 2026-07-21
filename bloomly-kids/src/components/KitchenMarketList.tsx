import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Confetti / Sparkle Effect Component ---
const ConfettiExplosion = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 250,
            y: (Math.random() - 0.5) * 250 - 50,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute text-2xl drop-shadow-lg"
        >
          {['⭐', '✨', '🌟', '💖'][i % 4]}
        </motion.div>
      ))}
    </div>
  );
};

// --- Game Data ---
const ALL_ITEMS = [
  { word: "طماطم", emoji: "🍅" },
  { word: "بصل", emoji: "🧅" },
  { word: "جزر", emoji: "🥕" },
  { word: "بطاطس", emoji: "🥔" },
  { word: "باذنجان", emoji: "🍆" },
  { word: "فلفل", emoji: "🫑" },
  { word: "تفاح", emoji: "🍎" },
  { word: "موز", emoji: "🍌" }
];

interface KitchenMarketListProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function KitchenMarketList({ onComplete, onBack }: KitchenMarketListProps) {
  const [phase, setPhase] = useState<'intro' | 'list_building' | 'market_intro' | 'shopping'>('intro');
  const [targetList, setTargetList] = useState<{ word: string; emoji: string }[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [availableEmojis, setAvailableEmojis] = useState<{ word: string; emoji: string }[]>([]);
  
  const [listStep, setListStep] = useState(0); // 0 to 4
  const [shoppingStep, setShoppingStep] = useState(0); // 0 to 4
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize Game Data
  useEffect(() => {
    // Pick 5 random items for the list
    const shuffled = [...ALL_ITEMS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setTargetList(selected);
    
    // Shuffle the words for the drag drop pool
    const words = selected.map(i => i.word).sort(() => 0.5 - Math.random());
    setAvailableWords(words);
    
    // Pick 7 emojis for the market (the 5 correct ones + 2 random distractors)
    const distractors = ALL_ITEMS.filter(i => !selected.includes(i)).slice(0, 2);
    const emojis = [...selected, ...distractors].sort(() => 0.5 - Math.random());
    setAvailableEmojis(emojis);
  }, []);

  // Text-to-Speech Helper
  const speak = (text: string, onEnd?: () => void) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ar-SA";
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          if (onEnd) onEnd();
        };
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("TTS not supported or failed", e);
      if (onEnd) onEnd();
    }
  };

  const playSnapSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const playErrorSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  };

  // --- Phase Handlers ---
  const handleStartList = () => {
    setPhase('list_building');
    setTimeout(() => {
      speak(`أحتاجُ إلى ${targetList[0].word}`);
    }, 500);
  };

  const handleStartMarket = () => {
    setPhase('shopping');
    setTimeout(() => {
      speak(`هيا نجمع الأغراض في الكيس! أولاً نحتاج ${targetList[0].word}`);
    }, 500);
  };

  const checkListWord = (draggedWord: string) => {
    const currentTarget = targetList[listStep].word;
    if (draggedWord === currentTarget) {
      // Correct!
      playSnapSound();
      setShowConfetti(true);
      setAvailableWords(prev => prev.filter(w => w !== draggedWord));
      
      const nextStep = listStep + 1;
      setListStep(nextStep);
      
      if (nextStep < targetList.length) {
        setTimeout(() => {
          speak(`رائع! الآن أحتاجُ إلى ${targetList[nextStep].word}`);
        }, 1000);
      } else {
        speak("أحسنت! القائمة مكتملة، هيا إلى السوق!");
        setTimeout(() => {
          setPhase('market_intro');
        }, 1200);
      }
    } else {
      // Wrong
      playErrorSound();
    }
  };

  const checkMarketItem = (draggedItem: string) => {
    const currentTarget = targetList[shoppingStep].word;
    if (draggedItem === currentTarget) {
      // Correct!
      playSnapSound();
      setShowConfetti(true);
      
      const nextStep = shoppingStep + 1;
      setShoppingStep(nextStep);
      
      if (nextStep < targetList.length) {
        setTimeout(() => {
          speak(`ممتاز! ماذا بعد؟ آه، ${targetList[nextStep].word}`);
        }, 1000);
      } else {
        setTimeout(() => {
          speak("رائع يا بطل! لقد جمعنا كل الطلبات، المطبخ بانتظارنا!");
          setTimeout(onComplete, 2500);
        }, 1000);
      }
    } else {
      // Wrong
      playErrorSound();
    }
  };

  return (
    <div className="w-full h-[100vh] sm:h-auto sm:aspect-[4/3] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative select-none" dir="rtl">
      
      {/* Dynamic Backgrounds */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${phase.includes('list') ? 'bg-gradient-to-br from-[#FFFCE6] to-[#FFE0B2]' : 'bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2]'}`} />
      
      {/* Animated Floating Elements based on phase */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            initial={{ y: "110%", x: Math.random() * 800 }}
            animate={{ 
              y: "-20%", 
              rotate: [0, 90, -90, 0],
              x: (Math.random() - 0.5) * 200 + (Math.random() * 800)
            }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
          >
            {phase.includes('list') ? '📝' : '🛒'}
          </motion.div>
        ))}
      </div>

      {showConfetti && <ConfettiExplosion onComplete={() => setShowConfetti(false)} />}

      {/* Top Bar with Back Button */}
      <div className="absolute top-4 right-4 z-50 flex gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border-2 border-white flex items-center justify-center text-xl hover:bg-red-50 text-red-500 hover:scale-105 active:scale-95 transition-all"
          >
            ✖
          </button>
        )}
        <button
          onClick={() => {
            if (phase === 'list_building') speak(`أحتاجُ إلى ${targetList[listStep]?.word}`);
            if (phase === 'shopping') speak(`نحتاج الآن إلى ${targetList[shoppingStep]?.word}`);
          }}
          className={`w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border-2 border-white flex items-center justify-center text-xl hover:bg-blue-50 text-blue-500 hover:scale-105 active:scale-95 transition-all ${isSpeaking ? 'animate-pulse bg-blue-100 border-blue-400' : ''}`}
        >
          🔊
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- Intro Phase --- */}
        {phase === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4"
          >
            <div className="bg-white/90 backdrop-blur-md border-4 border-[#FFB74D] p-8 rounded-[40px] text-center shadow-2xl max-w-lg w-full">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl mb-4"
              >
                🌱
              </motion.div>
              <h2 className="text-3xl font-black text-[#E65100] mb-2">قائمة تسوق البرعم</h2>
              <p className="text-[#F57C00] font-bold text-lg mb-8 leading-relaxed">
                البرعم يريد إعداد طبخة لذيذة، لكنه يحتاج لمساعدتك في كتابة قائمة التسوق، ثم الذهاب للسوق لشراء الأغراض!
              </p>
              <button 
                onClick={handleStartList}
                className="btn-bubbly-primary text-2xl py-4 px-12 bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white rounded-full shadow-[0_6px_0_0_#E65100] active:translate-y-[6px] active:shadow-none transition-all font-black border-4 border-white"
              >
                هيا نبدأ! 📝
              </button>
            </div>
          </motion.div>
        )}

        {/* --- List Building Phase --- */}
        {phase === 'list_building' && (
          <motion.div 
            key="list_building"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute inset-0 flex flex-col items-center justify-start pt-16 p-4 z-10"
          >
            {/* The Notebook */}
            <div className="bg-white border-4 border-amber-200 w-full max-w-md md:max-w-lg rounded-r-3xl rounded-l-md shadow-2xl relative overflow-hidden mb-6 h-[400px] sm:h-[440px] flex flex-col">
              {/* Binder rings */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gray-100 border-l border-gray-300 flex flex-col justify-evenly items-center z-20">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-400 shadow-inner" />
                ))}
              </div>
              
              <div className="mr-8 p-4 sm:p-6 flex-1 flex flex-col">
                <h3 className="text-center font-black text-2xl md:text-3xl text-[#FF9800] mb-4 border-b-4 border-dashed border-[#FFCC80] pb-2">
                  قائمة المشتريات 📝
                </h3>
                
                <div className="flex-1 flex flex-col gap-3 justify-center">
                  {targetList.map((item, index) => {
                    const isCompleted = index < listStep;
                    const isActive = index === listStep;
                    return (
                      <div 
                        key={index} 
                        className={`w-full h-14 rounded-xl flex items-center justify-between px-4 font-extrabold text-xl md:text-2xl transition-all duration-300 relative overflow-hidden
                          ${isCompleted ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm' : 
                            isActive ? 'bg-[#FFF3E0] border-4 border-[#FF9800] shadow-md scale-105' : 
                            'bg-gray-50 border-2 border-dashed border-gray-300 text-gray-400'}`}
                      >
                        {isCompleted && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center w-full justify-between"
                          >
                            <span>{item.word}</span>
                            <span className="text-green-500">✅</span>
                          </motion.div>
                        )}
                        {isActive && (
                          <div className="flex items-center w-full justify-between animate-pulse">
                            <span className="text-[#FF9800]">اضغط أو اسحب الكلمة هنا...</span>
                            <span>👈</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Draggable & Tappable Words */}
            <div className="w-full max-w-xl flex flex-wrap gap-3 sm:gap-4 justify-center">
              <AnimatePresence>
                {availableWords.map((word) => (
                  <motion.div
                    key={word}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    drag
                    dragSnapToOrigin={true}
                    onClick={() => checkListWord(word)}
                    onDragEnd={(event, info) => {
                      if (info.offset.y < -50) {
                        checkListWord(word);
                      }
                    }}
                    className="bg-white px-6 py-3 rounded-2xl shadow-[0_4px_0_0_#E0E0E0] border-2 border-gray-200 text-2xl font-black text-[#5C3A21] cursor-pointer hover:bg-[#FFFCE6] hover:border-[#FFCA28] transition-colors z-20"
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1, zIndex: 50, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  >
                    {word}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-4 text-gray-500 font-bold text-sm bg-white/50 px-4 py-1 rounded-full">
              استمع للصوت واسحب الكلمة المطابقة إلى الدفتر
            </div>
          </motion.div>
        )}

        {/* --- Market Intro Phase --- */}
        {phase === 'market_intro' && (
          <motion.div 
            key="market_intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4"
          >
            <div className="bg-white/90 backdrop-blur-md border-4 border-[#00BCD4] p-8 rounded-[40px] text-center shadow-2xl max-w-lg w-full">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl mb-4"
              >
                🛒
              </motion.div>
              <h2 className="text-3xl font-black text-[#00838F] mb-2">أهلاً بك في السوق!</h2>
              <p className="text-[#00ACC1] font-bold text-lg mb-8 leading-relaxed">
                الآن لدينا القائمة. لنبحث عن الخضار والفواكه ونضعها في الكيس بنفس الترتيب!
              </p>
              <button 
                onClick={handleStartMarket}
                className="btn-bubbly-primary text-2xl py-4 px-12 bg-gradient-to-r from-[#00BCD4] to-[#00ACC1] text-white rounded-full shadow-[0_6px_0_0_#00838F] active:translate-y-[6px] active:shadow-none transition-all font-black border-4 border-white"
              >
                دخول السوق 🏪
              </button>
            </div>
          </motion.div>
        )}

        {/* --- Shopping Phase --- */}
        {phase === 'shopping' && (
          <motion.div 
            key="shopping"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute inset-0 flex flex-col items-center justify-between pt-16 pb-8 p-4 z-10"
          >
            {/* Top Area: Reference List & Shopping Bag */}
            <div className="w-full max-w-3xl flex justify-between items-start gap-4">
              
              {/* Mini Reference List */}
              <div className="bg-yellow-50 border-2 border-yellow-200 p-3 rounded-xl shadow-md w-40 transform -rotate-2 origin-top-right">
                <div className="w-4 h-4 bg-red-400 rounded-full mx-auto -mt-5 mb-2 shadow-sm border border-red-500" />
                <h4 className="font-black text-center text-yellow-800 border-b-2 border-dashed border-yellow-300 mb-2 pb-1 text-sm">القائمة</h4>
                <div className="flex flex-col gap-1">
                  {targetList.map((item, index) => {
                    const isDone = index < shoppingStep;
                    const isActive = index === shoppingStep;
                    return (
                      <div key={index} className={`text-sm font-bold flex items-center gap-1 ${isDone ? 'text-gray-400 line-through' : isActive ? 'text-blue-600 bg-blue-50 px-1 rounded scale-105' : 'text-gray-700'}`}>
                        <span>{index + 1}.</span> {item.word} {isDone && '✅'}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shopping Bag (Drop Target) */}
              <div className="flex-1 flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-end justify-center">
                  <motion.div 
                    animate={showConfetti ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
                    className="text-[120px] filter drop-shadow-xl z-30"
                  >
                    🛍️
                  </motion.div>
                  {/* Items already collected peeking out */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-wrap-reverse justify-center w-28 gap-[-10px] z-20">
                    {targetList.slice(0, shoppingStep).map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl -ml-2 filter drop-shadow-md"
                        style={{ rotate: `${(idx % 3 - 1) * 15}deg` }}
                      >
                        {item.emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="text-xl font-black text-[#00838F] mt-2 bg-white/50 px-4 py-1 rounded-full">
                  اسحب الخضار هنا بالترتيب!
                </div>
              </div>
            </div>

            {/* Bottom Area: Crates / Items to Drag */}
            <div className="w-full max-w-4xl bg-[#8D6E63] p-4 sm:p-6 rounded-t-[40px] border-t-8 border-[#795548] shadow-[0_-10px_20px_rgba(0,0,0,0.15)] flex flex-wrap justify-center gap-3 sm:gap-6 mt-auto">
              <AnimatePresence>
                {availableEmojis.map((item, idx) => {
                  // Only render if it hasn't been collected yet (for target items)
                  // If it's a distractor, leave it there.
                  const isCollectedTarget = targetList.slice(0, shoppingStep).find(i => i.word === item.word);
                  if (isCollectedTarget) return null;

                  return (
                    <motion.div
                      key={`${item.word}-${idx}`}
                      initial={{ scale: 0, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      drag
                      dragSnapToOrigin={true}
                      onDragEnd={(event, info) => {
                        // Drop zone is upwards towards the bag
                        if (info.offset.y < -100) {
                          checkMarketItem(item.word);
                        }
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileDrag={{ scale: 1.2, zIndex: 50 }}
                      className="bg-[#D7CCC8] w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl cursor-grab active:cursor-grabbing border-4 border-[#BCAAA4] shadow-[inset_0_-4px_0_0_#A1887F,0_4px_8px_rgba(0,0,0,0.2)] relative overflow-hidden group"
                    >
                      {/* Wood texture lines */}
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_48%,#3E2723_50%,transparent_52%)] bg-[length:10px_10px]" />
                      <span className="relative z-10 group-hover:animate-bounce-slow filter drop-shadow-md">{item.emoji}</span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
