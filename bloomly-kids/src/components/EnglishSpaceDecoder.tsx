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
          {['⭐', '✨', '🚀', '💫'][i % 4]}
        </motion.div>
      ))}
    </div>
  );
};

const WORDS = [
  { word: 'CAT', image: '🐱' },
  { word: 'DOG', image: '🐶' },
  { word: 'SUN', image: '☀️' },
  { word: 'STAR', image: '⭐' },
  { word: 'FISH', image: '🐟' },
  { word: 'BIRD', image: '🐦' }
];

interface EnglishSpaceDecoderProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function EnglishSpaceDecoder({ onComplete, onBack }: EnglishSpaceDecoderProps) {
  const [level, setLevel] = useState(0);
  const [currentWord, setCurrentWord] = useState(WORDS[0]);
  const [targetLetters, setTargetLetters] = useState<string[]>([]);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [meteorites, setMeteorites] = useState<{ id: string, letter: string, x: number, y: number }[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  // Text-to-Speech Helper
  const speak = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {}
  };

  const playSound = (type: 'win' | 'error' | 'click') => {
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
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      }
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (type === 'win' ? 0.4 : 0.3));
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const startLevel = (lvlIndex: number) => {
    const wordObj = WORDS[lvlIndex % WORDS.length];
    setCurrentWord(wordObj);
    const letters = wordObj.word.split('');
    setTargetLetters(letters);
    setCollectedLetters([]);

    // Create meteorites: target letters + 2-3 distractors
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const distractors = Array.from({ length: 3 }).map(() => alphabet[Math.floor(Math.random() * alphabet.length)]);
    
    const allLetters = [...letters, ...distractors].sort(() => 0.5 - Math.random());
    
    const mets = allLetters.map((l, i) => ({
      id: `${l}-${i}-${Math.random()}`,
      letter: l,
      x: 10 + Math.random() * 80, // percentage
      y: 20 + Math.random() * 50  // percentage
    }));
    
    setMeteorites(mets);
    setTimeout(() => speak(wordObj.word), 1000);
  };

  useEffect(() => {
    startLevel(level);
  }, [level]);

  useEffect(() => {
    if (targetLetters.length === 0 || collectedLetters.length >= targetLetters.length) return;
    const nextExpected = targetLetters[collectedLetters.length];
    const hasNextLetter = meteorites.some(m => m.letter === nextExpected);

    if (!hasNextLetter) {
      const newMeteor = {
        id: `${nextExpected}-${Date.now()}-${Math.random()}`,
        letter: nextExpected,
        x: 15 + Math.random() * 70,
        y: 25 + Math.random() * 45
      };
      setMeteorites(prev => [...prev, newMeteor]);
    }
  }, [collectedLetters, targetLetters, meteorites]);

  const handleMeteoriteClick = (met: { id: string, letter: string }) => {
    const nextExpectedLetter = targetLetters[collectedLetters.length];
    
    if (met.letter === nextExpectedLetter) {
      playSound('click');
      const newCollected = [...collectedLetters, met.letter];
      setCollectedLetters(newCollected);
      setMeteorites(prev => prev.filter(m => m.id !== met.id));
      
      if (newCollected.length === targetLetters.length) {
        // Level complete!
        playSound('win');
        setShowConfetti(true);
        speak(`Great! ${currentWord.word}`);
        
        setTimeout(() => {
          if (level < 2) {
            setLevel(level + 1);
          } else {
            speak("You are a space spelling master!");
            onComplete();
          }
        }, 2500);
      }
    } else {
      playSound('error');
      setWrongId(met.id);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  return (
    <div className="w-full h-[100vh] sm:h-auto sm:aspect-[4/3] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative select-none bg-indigo-950 font-sans" dir="ltr">
      
      {/* Dynamic Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black" />
      
      {/* Twinkling Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {showConfetti && <ConfettiExplosion onComplete={() => setShowConfetti(false)} />}

      {/* Top Bar with Back Button */}
      <div className="absolute top-4 left-4 z-50 flex gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 flex items-center justify-center text-xl hover:bg-red-500/50 text-white hover:scale-105 active:scale-95 transition-all"
          >
            ✖
          </button>
        )}
        <button
          onClick={() => speak(currentWord.word)}
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 flex items-center justify-center text-xl hover:bg-blue-500/50 text-white hover:scale-105 active:scale-95 transition-all"
        >
          🔊
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-6 right-1/2 translate-x-1/2 flex gap-2 z-20" dir="rtl">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`w-10 h-3 rounded-full border border-white/50 transition-all duration-300 ${i <= level ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-black/40'}`} />
        ))}
      </div>

      {/* Alien / UFO Area */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-7xl sm:text-8xl filter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mb-4"
        >
          🛸
        </motion.div>
        
        {/* Word Building Slots */}
        <div className="flex gap-2 sm:gap-4 bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20">
          <div className="text-4xl sm:text-5xl mr-4 filter drop-shadow-md">{currentWord.image}</div>
          {targetLetters.map((letter, idx) => {
            const isFilled = idx < collectedLetters.length;
            const isCurrent = idx === collectedLetters.length;
            return (
              <div 
                key={idx} 
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all duration-300
                  ${isFilled ? 'bg-cyan-400 text-slate-900 shadow-[0_0_15px_#22d3ee] scale-105' : 
                    isCurrent ? 'bg-white/20 border-2 border-cyan-400 border-dashed text-cyan-200 animate-pulse' : 
                    'bg-black/30 border border-white/20 text-transparent'}
                `}
              >
                {isFilled ? letter : letter}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Meteorites */}
      <div className="absolute inset-0 top-40 z-10">
        <AnimatePresence>
          {meteorites.map((met) => (
            <motion.button
              key={met.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={wrongId === met.id 
                ? { x: [0, -10, 10, -10, 10, 0], scale: 1, opacity: 1 } 
                : { 
                  scale: 1, 
                  opacity: 1, 
                  y: [0, -20, 0], 
                  rotate: [0, 10, -10, 0] 
                }}
              transition={wrongId === met.id 
                ? { duration: 0.4 } 
                : { repeat: Infinity, duration: 3 + Math.random() * 2 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleMeteoriteClick(met)}
              className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-black text-cyan-300 border-[3px] border-slate-500 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_-5px_15px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 cursor-pointer"
              style={{ left: `${met.x}%`, top: `${met.y}%` }}
            >
              {/* Craters */}
              <div className="absolute w-3 h-3 bg-black/30 rounded-full top-2 left-3 shadow-inner" />
              <div className="absolute w-4 h-4 bg-black/30 rounded-full bottom-3 right-4 shadow-inner" />
              <div className="absolute w-2 h-2 bg-black/30 rounded-full bottom-4 left-4 shadow-inner" />
              
              <span className="relative z-10 filter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">{met.letter}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
