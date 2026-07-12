import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { islandsData } from './LearningPathMap';
import { SproutMascot } from './GameZone';
import { sfx } from '../utils/audio';

interface GameGridMenuProps {
  onSelectGame: (gameId: string) => void;
}

export const GameGridMenu: React.FC<GameGridMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-8">
      
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-[#4D2B82] to-[#6B21A8] rounded-[32px] p-6 sm:p-8 flex items-center justify-between gap-6 shadow-[0_10px_40px_rgba(77,43,130,0.3)] border-4 border-[#FFD700]/30 overflow-hidden"
      >
        {/* Background Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 z-10 w-full">
          <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm border-2 border-white/20 shadow-xl">
            <SproutMascot className="w-20 h-20" state="happy" />
          </div>
          <div className="text-center sm:text-right flex-1">
            <span className="inline-block text-xs font-black text-yellow-900 bg-gradient-to-r from-yellow-300 to-yellow-500 px-4 py-1 rounded-full border-2 border-yellow-200 mb-3 shadow-sm">
              صديقك برعم يرحب بك! 👋
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
              أهلاً بك يا بطل المزرعة! 🚜
            </h2>
            <p className="text-purple-200 font-bold text-lg max-w-xl">
              اختر لعبة من البطاقات السحرية بالأسفل لكي نلعب ونجمع النجوم معاً!
            </p>
          </div>
        </div>

        <button 
          onClick={() => sfx.speakArabic("أهلاً بك يا بطل المزرعة! اختر لعبة من البطاقات السحرية بالأسفل لكي نلعب ونجمع النجوم معاً!")}
          className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 border-4 border-white flex items-center justify-center text-2xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
          title="استمع لصوت برعم 🔊"
        >
          🔊
        </button>
      </motion.div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {islandsData.map((game, index) => {
          // Determine a premium gradient based on index
          const gradients = [
            "from-[#FF9A9E] to-[#FECFEF] border-pink-400 text-pink-700", // Pink
            "from-[#a1c4fd] to-[#c2e9fb] border-blue-400 text-blue-700", // Blue
            "from-[#ffecd2] to-[#fcb69f] border-orange-400 text-orange-700", // Orange
            "from-[#84fab0] to-[#8fd3f4] border-emerald-400 text-emerald-700", // Mint
            "from-[#e0c3fc] to-[#8ec5fc] border-indigo-400 text-indigo-700", // Purple
            "from-[#fccb90] to-[#d57eeb] border-purple-400 text-purple-700", // Sunset
          ];
          const style = gradients[index % gradients.length];
          const [bgFrom, bgTo, borderColor, textColor] = style.split(' ');

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative flex flex-col items-center text-center p-6 sm:p-8 bg-gradient-to-br ${bgFrom} ${bgTo} rounded-[40px] border-4 ${borderColor} shadow-[0_15px_30px_rgba(0,0,0,0.1),inset_0_4px_15px_rgba(255,255,255,0.7)] cursor-pointer overflow-hidden group`}
              onClick={() => onSelectGame(game.id)}
            >
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent h-1/2 pointer-events-none rounded-t-[36px]"></div>

              {/* Emoji Icon Container */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + index * 0.2, ease: "easeInOut" }}
                className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 bg-white/80 backdrop-blur-sm rounded-[28px] border-4 border-white shadow-xl flex items-center justify-center text-6xl sm:text-7xl mb-6 group-hover:rotate-6 transition-transform"
              >
                {game.emoji}
                {/* Character small badge */}
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl shadow-sm">
                  {game.characterEmoji}
                </div>
              </motion.div>

              {/* Text Content */}
              <div className="relative z-10 flex flex-col flex-1 w-full items-center">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-extrabold text-gray-700 shadow-sm mb-4 border border-white/50">
                  {game.badge}
                </span>
                
                <h3 className={`text-2xl sm:text-3xl font-black ${textColor} mb-3 drop-shadow-sm tracking-wide leading-tight`}>
                  {game.gameName}
                </h3>
                
                <p className="text-gray-700 font-bold text-sm sm:text-base leading-relaxed mb-8 opacity-90 px-2 line-clamp-2">
                  {game.quest}
                </p>

                {/* Play Button */}
                <button
                  className={`mt-auto w-full py-4 rounded-2xl bg-white/90 backdrop-blur-md border-b-[6px] border-black/10 text-xl font-black ${textColor} shadow-lg active:border-b-0 active:translate-y-[6px] transition-all flex items-center justify-center gap-2 hover:bg-white`}
                >
                  <Play className="w-6 h-6 fill-current" />
                  ابدأ اللعب!
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
