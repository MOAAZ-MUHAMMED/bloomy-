import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  level?: number;
  onComplete: () => void;
  onBack?: () => void;
}

interface SafariWord {
  word: string;
  emoji: string;
  arabicName: string;
}

const SAFARI_WORDS_LEVEL1: SafariWord[] = [
  { word: 'CAT', emoji: '🐱', arabicName: 'قطة' },
  { word: 'DOG', emoji: '🐶', arabicName: 'كلب' },
  { word: 'SUN', emoji: '☀️', arabicName: 'شمس' },
  { word: 'BUS', emoji: '🚌', arabicName: 'حافلة' },
  { word: 'CAR', emoji: '🚗', arabicName: 'سيارة' },
  { word: 'PEN', emoji: '✏️', arabicName: 'قلم' },
  { word: 'CUP', emoji: '☕', arabicName: 'كوب' },
  { word: 'HAT', emoji: '🎩', arabicName: 'قبعة' },
  { word: 'FOX', emoji: '🦊', arabicName: 'ثعلب' },
  { word: 'BOX', emoji: '📦', arabicName: 'صندوق' }
];

const SAFARI_WORDS_LEVEL2: SafariWord[] = [
  { word: 'LION', emoji: '🦁', arabicName: 'أسد' },
  { word: 'BIRD', emoji: '🐦', arabicName: 'عصفور' },
  { word: 'FISH', emoji: '🐟', arabicName: 'سمكة' },
  { word: 'STAR', emoji: '⭐', arabicName: 'نجمة' },
  { word: 'FROG', emoji: '🐸', arabicName: 'ضفدع' },
  { word: 'DUCK', emoji: '🦆', arabicName: 'بطة' },
  { word: 'TREE', emoji: '🌳', arabicName: 'شجرة' },
  { word: 'BEAR', emoji: '🐻', arabicName: 'دبدوب' }
];

const SAFARI_WORDS_LEVEL3: SafariWord[] = [
  { word: 'MONKEY', emoji: '🐒', arabicName: 'قرد' },
  { word: 'RABBIT', emoji: '🐰', arabicName: 'أرنب' },
  { word: 'TIGER', emoji: '🐅', arabicName: 'نمر' },
  { word: 'ROCKET', emoji: '🚀', arabicName: 'صاروخ' },
  { word: 'APPLE', emoji: '🍎', arabicName: 'تفاحة' },
  { word: 'ORANGE', emoji: '🍊', arabicName: 'برتقالة' }
];

export default function EnglishWordSafari({ level = 1, onComplete, onBack }: Props) {
  const [round, setRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<SafariWord>(SAFARI_WORDS_LEVEL1[0]);
  const [options, setOptions] = useState<SafariWord[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const getWordPool = (lvl: number) => {
    if (lvl <= 1) return SAFARI_WORDS_LEVEL1;
    if (lvl === 2) return SAFARI_WORDS_LEVEL2;
    return [...SAFARI_WORDS_LEVEL2, ...SAFARI_WORDS_LEVEL3];
  };

  const speak = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {}
  };

  const playSound = (type: 'win' | 'error' | 'click') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const generateRound = () => {
    setFeedback('idle');
    setSelectedWord(null);

    const pool = getWordPool(level);
    const target = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(target);

    // Create 3 options (target + 2 distractors)
    const distractors = pool.filter((item) => item.word !== target.word);
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());
    const opts = [target, ...shuffledDistractors.slice(0, 2)].sort(() => 0.5 - Math.random());
    setOptions(opts);

    setTimeout(() => speak(target.word), 600);
  };

  useEffect(() => {
    generateRound();
  }, [level, round]);

  const handleSelect = (item: SafariWord) => {
    if (selectedWord !== null || feedback !== 'idle') return;
    setSelectedWord(item.word);

    if (item.word === currentQuestion.word) {
      playSound('win');
      setFeedback('correct');
      speak(`Great! ${item.word}`);

      setTimeout(() => {
        if (round < 5) {
          setRound((r) => r + 1);
        } else {
          onComplete();
        }
      }, 1800);
    } else {
      playSound('error');
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('idle');
        setSelectedWord(null);
      }, 1000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-emerald-800 via-teal-900 to-slate-900 flex flex-col items-center justify-between p-4 font-sans select-none relative overflow-hidden text-white" dir="ltr">
      
      {/* Safari Leaves Floating */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            initial={{ y: "110%", x: Math.random() * 800 }}
            animate={{ 
              y: "-20%", 
              rotate: [0, 180, 360],
              x: (Math.random() - 0.5) * 200 + (Math.random() * 800)
            }}
            transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, ease: "linear" }}
          >
            {['🍃', '🌿', '🦁', '🌴'][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Top Bar with Back & Audio Buttons */}
      <div className="w-full max-w-4xl flex justify-between items-center z-50 pt-2">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/20 backdrop-blur rounded-full border border-white/40 flex items-center justify-center text-xl hover:bg-red-500/40 transition-all cursor-pointer shadow-lg"
          >
            ✖
          </button>
        )}
        <button
          onClick={() => speak(currentQuestion.word)}
          className="w-12 h-12 bg-white/20 backdrop-blur rounded-full border border-white/40 flex items-center justify-center text-xl hover:bg-emerald-500/40 transition-all cursor-pointer shadow-lg"
        >
          🔊
        </button>
      </div>

      {/* Title & Level Info */}
      <div className="text-center z-10 my-2">
        <h1 className="text-3xl sm:text-5xl font-black text-amber-300 mb-1 drop-shadow-md">English Word Safari 🦁</h1>
        <p className="text-sm sm:text-base font-bold text-emerald-200">Listen carefully and pick the matching English word!</p>
        <div className="inline-flex gap-4 mt-3 bg-emerald-950/80 backdrop-blur px-5 py-1.5 rounded-full border border-emerald-400/50 text-xs sm:text-sm font-black shadow">
          <span>Level: {level}</span>
          <span>•</span>
          <span>Round: {round} / 5</span>
        </div>
      </div>

      {/* Safari Mascot / Target Image Card */}
      <div className="z-10 flex flex-col items-center my-4">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="w-40 h-40 sm:w-48 sm:h-48 bg-white/10 backdrop-blur-md rounded-3xl border-4 border-amber-400/60 shadow-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden"
        >
          <span className="text-7xl sm:text-8xl drop-shadow-xl mb-2">{currentQuestion.emoji}</span>
          <span className="text-xs sm:text-sm font-extrabold text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-300/30">
            {currentQuestion.arabicName}
          </span>
        </motion.div>
      </div>

      {/* Safari Word Options */}
      <div className="w-full max-w-2xl flex flex-wrap justify-center gap-4 sm:gap-6 z-10 mb-8 px-4">
        {options.map((item) => {
          const isSelected = selectedWord === item.word;

          return (
            <motion.button
              key={item.word}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(item)}
              className={`flex-1 min-w-[140px] max-w-[200px] py-4 sm:py-5 px-6 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl border-4 transition-all cursor-pointer
                ${isSelected 
                  ? feedback === 'correct' 
                    ? 'bg-green-500 border-white text-white scale-105' 
                    : 'bg-red-500 border-white text-white' 
                  : 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-amber-100 text-slate-900 hover:shadow-2xl'}`}
            >
              {item.word}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-white/90 backdrop-blur-md px-8 py-6 rounded-3xl shadow-2xl border-4 border-green-500 flex flex-col items-center text-slate-900">
              <span className="text-7xl mb-2">🎉🦁</span>
              <span className="text-3xl font-black text-green-600">Safari Master!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
