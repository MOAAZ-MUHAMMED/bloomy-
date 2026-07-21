import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Confetti / Sparkle Effect Component ---
const ConfettiExplosion = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300 - 50,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute text-3xl drop-shadow-lg"
        >
          {['⭐', '✨', '🐊', '🍗'][i % 4]}
        </motion.div>
      ))}
    </div>
  );
};

interface MathHungryCrocodileProps {
  level?: number;
  onComplete: () => void;
  onBack?: () => void;
}

export default function MathHungryCrocodile({ level = 1, onComplete, onBack }: MathHungryCrocodileProps) {
  const [round, setRound] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState<'>' | '<' | '='>('>');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [crocState, setCrocState] = useState<'idle' | 'eatingLeft' | 'eatingRight' | 'confused'>('idle');

  const getMaxNum = (lvl: number) => {
    if (lvl <= 1) return 5;
    if (lvl === 2) return 10;
    if (lvl === 3) return 20;
    return 25; // Level 4+
  };

  // Generate question
  const generateLevel = () => {
    const maxN = getMaxNum(level);
    let n1 = Math.floor(Math.random() * maxN) + 1;
    let n2 = Math.floor(Math.random() * maxN) + 1;
    
    // Ensure we get a good mix of >, <, and =
    const rand = Math.random();
    if (rand < 0.2) {
      n2 = n1; // 20% chance of equal
    } else if (rand < 0.6) {
      while (n1 === n2) n2 = Math.floor(Math.random() * maxN) + 1;
    }

    setNum1(n1);
    setNum2(n2);
    
    if (n1 > n2) setCorrectAnswer('>');
    else if (n1 < n2) setCorrectAnswer('<');
    else setCorrectAnswer('=');
    
    setCrocState('idle');
  };

  useEffect(() => {
    generateLevel();
  }, [level, round]);

  const playSound = (type: 'win' | 'error' | 'eat') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'win') {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
      } else if (type === 'error') {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      } else {
        osc.type = "square";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
      }
      
      gain.gain.setValueAtTime(type === 'eat' ? 0.1 : 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (type === 'win' ? 0.4 : 0.3));
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const handleAnswer = (answer: '>' | '<' | '=') => {
    if (answer === correctAnswer) {
      if (answer === '>') {
        setCrocState('eatingLeft');
      } else if (answer === '<') {
        setCrocState('eatingRight');
      } else {
        setCrocState('confused');
      }
      
      playSound('eat');
      setTimeout(() => playSound('win'), 300);
      setShowConfetti(true);
      
      setTimeout(() => {
        if (round < 4) {
          setRound(r => r + 1);
        } else {
          onComplete();
        }
      }, 2000);
    } else {
      setIsWrong(true);
      playSound('error');
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const renderFood = (count: number) => {
    return (
      <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
        {[...Array(Math.min(count, 10))].map((_, i) => (
          <span key={i} className="text-xl sm:text-2xl drop-shadow-sm">🍗</span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#E0F2F1] via-[#B2DFDB] to-[#80CBC4] flex flex-col items-center justify-center p-4 font-sans select-none relative" dir="rtl">
      {/* Animated Swamp bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/40 rounded-full border border-white/60"
            style={{ width: Math.random() * 20 + 10, height: Math.random() * 20 + 10 }}
            initial={{ y: "110%", x: Math.random() * 800 }}
            animate={{ 
              y: "-20%", 
              x: (Math.random() - 0.5) * 50 + (Math.random() * 800)
            }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {showConfetti && <ConfettiExplosion onComplete={() => setShowConfetti(false)} />}

      {/* Top Bar with Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border-2 border-white flex items-center justify-center text-xl hover:bg-red-50 text-red-500 hover:scale-105 active:scale-95 transition-all z-50"
        >
          ✖
        </button>
      )}

      {/* Progress Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-10 h-3 rounded-full border-2 border-white transition-all duration-300 ${i <= round ? 'bg-[#4CAF50] shadow-[0_0_10px_#4CAF50]' : 'bg-black/10'}`} />
        ))}
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col items-center justify-center z-10 w-full max-w-3xl pt-12">
        
        {/* Title */}
        <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-[#009688] shadow-md mb-8">
          <h2 className="text-xl md:text-2xl font-black text-[#00796B]">التمساح الجائع يحب الأكبر! 🐊 (المستوى {level})</h2>
        </div>

        {/* The Numbers & Crocodile */}
        <div className="flex w-full items-center justify-between gap-3 md:gap-6 mb-10 px-2">
          
          {/* Number 1 */}
          <motion.div 
            className="flex-1 bg-white/90 rounded-3xl border-4 border-[#FF9800] p-4 md:p-6 flex flex-col items-center shadow-xl"
            animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <span className="text-5xl md:text-7xl font-black text-[#E65100] mb-2">{num1}</span>
            <div className="h-16 md:h-20 flex items-center justify-center">{renderFood(num1)}</div>
          </motion.div>

          {/* Central Crocodile Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center relative flex-shrink-0">
            <AnimatePresence mode="wait">
              {crocState === 'idle' && (
                <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl md:text-[100px] drop-shadow-xl filter grayscale-[30%]">
                  🐊
                </motion.div>
              )}
              {crocState === 'eatingRight' && (
                <motion.div key="eatR" initial={{ scale: 0.5, rotate: 0 }} animate={{ scale: 1.3, rotate: 15 }} className="text-8xl md:text-[120px] drop-shadow-2xl">
                  🦖
                </motion.div>
              )}
              {crocState === 'eatingLeft' && (
                <motion.div key="eatL" initial={{ scale: 0.5, rotate: 0 }} animate={{ scale: 1.3, rotate: -15, scaleX: -1 }} className="text-8xl md:text-[120px] drop-shadow-2xl">
                  🦖
                </motion.div>
              )}
              {crocState === 'confused' && (
                <motion.div key="confused" initial={{ scale: 0.5 }} animate={{ scale: 1.2, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="text-7xl md:text-[110px] drop-shadow-2xl">
                  😵
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Number 2 */}
          <motion.div 
            className="flex-1 bg-white/90 rounded-3xl border-4 border-[#2196F3] p-4 md:p-6 flex flex-col items-center shadow-xl"
            animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <span className="text-5xl md:text-7xl font-black text-[#1565C0] mb-2">{num2}</span>
            <div className="h-16 md:h-20 flex items-center justify-center">{renderFood(num2)}</div>
          </motion.div>

        </div>

        {/* Answer Buttons */}
        <div className="flex gap-4 sm:gap-8 bg-white/60 p-4 rounded-3xl backdrop-blur-md shadow-inner border border-white">
          <button 
            onClick={() => handleAnswer('>')}
            className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl flex items-center justify-center text-3xl sm:text-5xl text-white shadow-[0_6px_0_0_#1B5E20] active:translate-y-[6px] active:shadow-none transition-all border-2 border-white hover:scale-105 cursor-pointer"
          >
            &gt;
          </button>
          
          <button 
            onClick={() => handleAnswer('=')}
            className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#FFC107] to-[#FF8F00] rounded-2xl flex items-center justify-center text-3xl sm:text-5xl text-white shadow-[0_6px_0_0_#E65100] active:translate-y-[6px] active:shadow-none transition-all border-2 border-white hover:scale-105 cursor-pointer"
          >
            =
          </button>

          <button 
            onClick={() => handleAnswer('<')}
            className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#00BCD4] to-[#00838F] rounded-2xl flex items-center justify-center text-3xl sm:text-5xl text-white shadow-[0_6px_0_0_#006064] active:translate-y-[6px] active:shadow-none transition-all border-2 border-white hover:scale-105 cursor-pointer"
          >
            &lt;
          </button>
        </div>

      </div>
    </div>
  );
}
