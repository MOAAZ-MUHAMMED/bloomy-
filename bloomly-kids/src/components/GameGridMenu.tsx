import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { islandsData } from './LearningPathMap';
import { SproutMascot } from './GameZone';

interface GameGridMenuProps {
  onSelectGame: (gameId: string) => void;
}

export const GameGridMenu: React.FC<GameGridMenuProps> = ({ onSelectGame }) => {
  const speakArabic = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8 relative z-10">
      
      {/* Premium Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/40 backdrop-blur-xl rounded-[40px] p-8 flex items-center justify-between gap-6 shadow-[0_8px_32px_rgba(255,255,255,0.4)] border border-white/60 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 z-10 w-full">
          <div className="bg-white/50 p-3 rounded-full backdrop-blur-md border border-white shadow-xl">
            <SproutMascot className="w-24 h-24" state="happy" />
          </div>
          <div className="text-center sm:text-right flex-1">
            <span className="inline-block text-sm font-black text-purple-600 bg-white/80 backdrop-blur-sm px-6 py-1.5 rounded-full border border-purple-100 mb-3 shadow-sm">
              أهلاً بك في عالم السحر والألعاب! ✨
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#4D2B82] mb-3 drop-shadow-sm">
              اختر مغامرتك يا بطل! 🚀
            </h2>
            <p className="text-purple-700 font-bold text-lg max-w-2xl bg-white/30 rounded-2xl p-3 inline-block">
              اضغط على أي بطاقة بالأسفل لتبدأ اللعب، التعلم، وجمع النجوم!
            </p>
          </div>
        </div>

        <button 
          onClick={() => speakArabic("أهلاً بك في عالم السحر والألعاب! اضغط على أي بطاقة بالأسفل لتبدأ اللعب، التعلم، وجمع النجوم!")}
          className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-yellow-400 hover:bg-yellow-300 border-4 border-white flex items-center justify-center text-3xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
          title="استمع لصوت برعم 🔊"
        >
          🔊
        </button>
      </motion.div>

      {/* Premium Grid of Games */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {islandsData.map((game, index) => {
          // Premium pastel gradients
          const gradients = [
            "from-[#ff9a9e]/80 to-[#fecfef]/80 border-pink-300 text-pink-700", 
            "from-[#a1c4fd]/80 to-[#c2e9fb]/80 border-blue-300 text-blue-700", 
            "from-[#ffecd2]/80 to-[#fcb69f]/80 border-orange-300 text-orange-700", 
            "from-[#84fab0]/80 to-[#8fd3f4]/80 border-emerald-300 text-emerald-700", 
            "from-[#e0c3fc]/80 to-[#8ec5fc]/80 border-indigo-300 text-indigo-700", 
            "from-[#fccb90]/80 to-[#d57eeb]/80 border-purple-300 text-purple-700", 
          ];
          const style = gradients[index % gradients.length];
          const [bgFrom, bgTo, borderColor, textColor] = style.split(' ');

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center text-center p-6 bg-gradient-to-br ${bgFrom} ${bgTo} backdrop-blur-xl rounded-[40px] border-[3px] border-white/50 shadow-[0_15px_35px_rgba(0,0,0,0.1),inset_0_5px_15px_rgba(255,255,255,0.8)] cursor-pointer overflow-hidden group`}
              onClick={() => onSelectGame(game.id)}
            >
              {/* Animated Light Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 pointer-events-none rounded-t-[36px]" />
              <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]" />

              {/* Floating Emoji Icon Container */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + index * 0.2, ease: "easeInOut" }}
                className="relative z-10 w-24 h-24 bg-white/90 backdrop-blur-md rounded-full border-4 border-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] flex items-center justify-center text-6xl mb-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
              >
                {game.emoji}
                {/* Character small badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border-4 border-white flex items-center justify-center text-2xl shadow-lg">
                  {game.characterEmoji}
                </div>
              </motion.div>

              {/* Text Content */}
              <div className="relative z-10 flex flex-col flex-1 w-full items-center">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-gray-600 shadow-sm mb-4 border border-white">
                  {game.badge}
                </span>
                
                <h3 className={`text-xl sm:text-2xl font-black ${textColor} mb-3 drop-shadow-md leading-tight`}>
                  {game.gameName}
                </h3>
                
                <p className="text-gray-800 font-bold text-xs sm:text-sm leading-relaxed mb-6 opacity-80 px-2 line-clamp-2">
                  {game.quest}
                </p>

                {/* 3D Play Button */}
                <div
                  className={`mt-auto w-full py-3.5 rounded-3xl bg-white border-b-[6px] border-black/10 text-lg font-black ${textColor} shadow-lg group-hover:bg-gray-50 group-active:border-b-0 group-active:translate-y-[6px] transition-all flex items-center justify-center gap-2`}
                >
                  <Play className="w-6 h-6 fill-current" />
                  {game.id === 'quran' ? 'احفظ الآن!' : 'ابدأ اللعب!'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
