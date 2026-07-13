import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { islandsData } from './LearningPathMap';
import { SproutMascot } from './GameZone';

interface GameGridMenuProps {
  onSelectGame: (gameId: string) => void;
}

export const GameGridMenu: React.FC<GameGridMenuProps> = ({ onSelectGame }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const speakArabic = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % islandsData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + islandsData.length) % islandsData.length);
  };

  const getCardStyle = (index: number) => {
    const diff = (index - activeIndex + islandsData.length) % islandsData.length;
    let x = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10;
    
    // Smooth endless carousel logic for 3 visible cards
    if (diff === 0) {
      // Active center
      x = 0;
      scale = 1.1;
      zIndex = 30;
      opacity = 1;
    } else if (diff === 1 || diff === - (islandsData.length - 1)) {
      // Right
      x = 220;
      scale = 0.8;
      zIndex = 20;
      opacity = 0.6;
    } else if (diff === islandsData.length - 1 || diff === -1) {
      // Left
      x = -220;
      scale = 0.8;
      zIndex = 20;
      opacity = 0.6;
    } else {
      // Hidden behind
      x = 0;
      scale = 0.5;
      zIndex = 0;
      opacity = 0;
    }

    return { x, scale, opacity, zIndex };
  };

  const activeGame = islandsData[activeIndex];

  const gradients = [
    "from-[#FF9A9E] to-[#FECFEF]",
    "from-[#a1c4fd] to-[#c2e9fb]",
    "from-[#ffecd2] to-[#fcb69f]",
    "from-[#84fab0] to-[#8fd3f4]",
    "from-[#e0c3fc] to-[#8ec5fc]",
    "from-[#fccb90] to-[#d57eeb]",
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[85vh] py-8 relative">
      
      {/* Magical Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/40 backdrop-blur-md rounded-full px-8 py-4 flex items-center justify-between mb-12 shadow-[0_8px_32px_rgba(255,255,255,0.4)] border-2 border-white/60"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/50 p-2 rounded-full border border-white/80 shadow-sm">
            <SproutMascot className="w-16 h-16" state="happy" />
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-purple-800 drop-shadow-sm">
              أهلاً بك في عالم السحر! ✨
            </h2>
            <p className="text-purple-600 font-bold text-sm">
              اسحب البطاقات واختر مغامرتك القادمة...
            </p>
          </div>
        </div>
        <button 
          onClick={() => speakArabic("أهلاً بك في عالم السحر! اسحب البطاقات واختر مغامرتك القادمة")}
          className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-300 border-2 border-white flex items-center justify-center text-xl shadow-md transition-transform hover:scale-110 cursor-pointer"
        >
          🔊
        </button>
      </motion.div>

      {/* 3D Carousel Container */}
      <div className="relative w-full max-w-5xl h-[450px] flex items-center justify-center perspective-[1000px]">
        
        {/* Navigation Buttons */}
        <button 
          onClick={handleNext}
          className="absolute right-4 md:right-10 z-50 w-16 h-16 bg-white/70 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center text-purple-700 shadow-xl hover:scale-110 hover:bg-white active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight size={32} strokeWidth={3} />
        </button>

        <button 
          onClick={handlePrev}
          className="absolute left-4 md:left-10 z-50 w-16 h-16 bg-white/70 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center text-purple-700 shadow-xl hover:scale-110 hover:bg-white active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft size={32} strokeWidth={3} />
        </button>

        {/* Carousel Cards */}
        {islandsData.map((game, index) => {
          const { x, scale, opacity, zIndex } = getCardStyle(index);
          const isActive = index === activeIndex;
          const bgStyle = gradients[index % gradients.length];

          return (
            <motion.div
              key={game.id}
              initial={false}
              animate={{ x, scale, opacity, zIndex }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => {
                if (!isActive) {
                  setActiveIndex(index);
                }
              }}
              className={`absolute w-[300px] sm:w-[340px] h-[400px] rounded-[40px] border-[4px] border-white/60 bg-gradient-to-br ${bgStyle} p-6 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer overflow-hidden backdrop-blur-lg ${isActive ? 'ring-4 ring-white/50' : ''}`}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-white/20 pointer-events-none" />
              
              <div className="relative z-10 bg-white/80 w-28 h-28 rounded-full flex items-center justify-center text-6xl shadow-inner border-4 border-white mb-4 mt-2">
                {game.emoji}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border-2 border-purple-100 flex items-center justify-center text-2xl shadow-md">
                  {game.characterEmoji}
                </div>
              </div>

              <span className="relative z-10 bg-white/90 px-4 py-1 rounded-full text-xs font-black text-purple-600 mb-3 border border-white shadow-sm">
                {game.badge}
              </span>

              <h3 className="relative z-10 text-2xl font-black text-white drop-shadow-md mb-2 leading-tight">
                {game.gameName}
              </h3>

              {isActive && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 text-white/90 font-bold text-sm mb-6 leading-relaxed px-2 line-clamp-3"
                >
                  {game.quest}
                </motion.p>
              )}

              {isActive && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGame(game.id);
                  }}
                  className="relative z-10 mt-auto w-full py-4 rounded-3xl bg-white text-purple-700 text-xl font-black shadow-[0_6px_0_0_rgba(255,255,255,0.4)] hover:bg-purple-50 active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-6 h-6 fill-current" />
                  {game.id === 'quran' ? 'احفظ الآن!' : 'ابدأ اللعب!'}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Active Game Info Banner */}
      <motion.div 
        key={`info-${activeIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/50 shadow-sm text-center"
      >
        <p className="text-purple-800 font-bold">
          ✨ القوة المكتسبة: <span className="text-purple-900 font-black">{activeGame.superpower}</span>
        </p>
      </motion.div>

    </div>
  );
};
