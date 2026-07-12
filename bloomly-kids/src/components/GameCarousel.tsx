import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Play, Sparkles } from 'lucide-react';
import { islandsData } from './LearningPathMap';

interface GameCarouselProps {
  onSelectGame: (gameId: string) => void;
}

export const GameCarousel: React.FC<GameCarouselProps> = ({ onSelectGame }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % islandsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + islandsData.length) % islandsData.length);
  };

  const handleSelect = (index: number) => {
    if (index === currentIndex) {
      onSelectGame(islandsData[index].id);
    } else {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative w-full h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1A0B2E] via-[#2D1B4E] to-[#1A0B2E]">
      
      {/* Background stars / magical effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center z-20 mb-8 mt-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 drop-shadow-lg mb-2">
          اختر مغامرتك القادمة
        </h2>
        <p className="text-purple-200 text-lg font-bold">حرك يميناً ويساراً لاستكشاف الألعاب السحرية!</p>
      </div>

      {/* 3D Carousel Container */}
      <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center perspective-[1200px] z-10">
        <AnimatePresence initial={false}>
          {islandsData.map((game, index) => {
            // Calculate relative position
            let diff = index - currentIndex;
            // Handle wrap around
            if (diff > islandsData.length / 2) diff -= islandsData.length;
            if (diff < -islandsData.length / 2) diff += islandsData.length;

            // Only render items that are somewhat close to center for performance
            if (Math.abs(diff) > 3) return null;

            const isCenter = diff === 0;
            const xOffset = diff * 140; // Horizontal spread
            const zOffset = Math.abs(diff) * -80; // Depth spread
            const rotateY = diff * -15; // Rotation
            const scale = isCenter ? 1 : Math.max(0.6, 1 - Math.abs(diff) * 0.15);
            const opacity = isCenter ? 1 : Math.max(0.3, 1 - Math.abs(diff) * 0.25);
            const zIndex = 100 - Math.abs(diff);

            return (
              <motion.div
                key={game.id}
                onClick={() => handleSelect(index)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                className={`absolute w-[260px] md:w-[300px] rounded-3xl cursor-pointer ${
                  isCenter ? 'shadow-[0_0_40px_rgba(255,215,0,0.4)]' : 'shadow-xl'
                } border-4 ${isCenter ? 'border-yellow-400' : 'border-purple-500/50'} overflow-hidden transform-style-3d`}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Game Card Content */}
                <div className="flex flex-col items-center p-6 h-[340px] relative">
                  
                  {isCenter && (
                    <div className="absolute top-0 right-0 p-2">
                      <Sparkles className="text-yellow-400 w-6 h-6 animate-spin-slow" />
                    </div>
                  )}

                  {/* Icon Area */}
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-6xl mb-4 shadow-inner bg-purple-50`}>
                    {game.characterEmoji}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-extrabold text-[#4D2B82] mb-2 text-center">
                    {game.title}
                  </h3>

                  {/* Description Badge */}
                  <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-sm mb-4">
                    {game.badge}
                  </span>

                  {/* Play Button - only clickable if center */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`mt-auto w-full py-3 rounded-xl flex items-center justify-center gap-2 font-extrabold text-lg transition-all ${
                      isCenter 
                        ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF9D42] text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    disabled={!isCenter}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCenter) onSelectGame(game.id);
                    }}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    العب الآن
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-8 mt-8 z-20">
        <button 
          onClick={handleNext}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
        
        {/* Pagination Dots */}
        <div className="flex gap-2">
          {islandsData.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-yellow-400' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={handlePrev}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

    </div>
  );
};
