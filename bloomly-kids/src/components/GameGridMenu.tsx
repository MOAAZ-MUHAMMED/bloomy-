import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { islandsData } from './LearningPathMap';
import { SproutMascot } from './GameZone';
import { categoriesData } from './CategoriesData';

interface GameGridMenuProps {
  onSelectCategory?: (categoryId: string) => void;
  onSelectGame: (gameId: string) => void;
  activeCategory?: string | null;
  onBackToCategories?: () => void;
  onOpenParents?: () => void;
  onOpenMap?: () => void;
  onOpenAbout?: () => void;
}

export const GameGridMenu: React.FC<GameGridMenuProps> = ({ 
  onSelectCategory, 
  onSelectGame, 
  activeCategory, 
  onBackToCategories,
  onOpenParents,
  onOpenMap,
  onOpenAbout
}) => {
  const speakArabic = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const customBoxes = [
    {
      id: "parents",
      title: "أولياء الأمور",
      englishTitle: "PARENTS AREA",
      icon: "👨‍👩‍👧‍👦",
      bgGradient: "from-[#8E2DE2]/90 to-[#4A00E0]/90",
      textColor: "text-purple-700",
      borderColor: "border-purple-400",
      action: onOpenParents
    },
    {
      id: "island_map",
      title: "خريطة الجزيرة",
      englishTitle: "ISLAND MAP",
      icon: "🗺️",
      bgGradient: "from-[#11998e]/90 to-[#38ef7d]/90",
      textColor: "text-green-700",
      borderColor: "border-green-400",
      action: onOpenMap
    },
    {
      id: "about_us",
      title: "بنعرف عن نفسنا",
      englishTitle: "ABOUT US",
      icon: "ℹ️",
      bgGradient: "from-[#fc4a1a]/90 to-[#f7b733]/90",
      textColor: "text-orange-700",
      borderColor: "border-orange-400",
      action: onOpenAbout
    }
  ];

  const allBoxes = [
    ...categoriesData,
    customBoxes[0], // Parents
    customBoxes[1], // Map
    customBoxes[2]  // About Us
  ];

  // View 1: Main Category Selection (Lamsa-style Layout)
  if (!activeCategory) {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-8 relative z-10 select-none">
        {/* Header / Intro banner */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col items-start gap-2 bg-white/60 p-4 rounded-3xl backdrop-blur-md border border-white/50 shadow-lg">
            <h2 className="text-3xl font-black text-[#4D2B82] drop-shadow-sm flex items-center gap-3">
              <SproutMascot className="w-12 h-12" state="talking" />
              مرحباً يا بطل! اختر مسارك ✨
            </h2>
            <p className="text-purple-700 font-bold px-2">اضغط على أي صندوق لتكتشف الألعاب السحرية بداخله!</p>
          </div>
        </div>

        {/* Lamsa-style Horizontal Scrolling Boxes */}
        <div 
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory hide-scrollbar" 
          dir="rtl"
          style={{ scrollBehavior: 'smooth' }}
        >
          {allBoxes.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                speakArabic(cat.title);
                if ((cat as any).action) {
                  (cat as any).action();
                } else if (onSelectCategory) {
                  onSelectCategory(cat.id);
                }
              }}
              className="snap-center shrink-0 flex flex-col items-center cursor-pointer group"
              style={{ width: '220px' }}
            >
              {/* Main Box containing icon/image */}
              <div className="w-full h-[280px] bg-white rounded-[32px] border-[5px] shadow-[0_8px_15px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-300" style={{ borderColor: cat.borderColor.replace('border-', '') }}>
                
                {/* Background decorative gradient blob */}
                <div className={\`absolute inset-0 opacity-20 bg-gradient-to-br \${cat.bgGradient}\`} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                {/* English title at the top of the box */}
                <div className="absolute top-4 w-full text-center">
                  <span className={\`font-black text-[11px] uppercase tracking-widest opacity-80 \${cat.textColor}\`}>
                    {cat.englishTitle}
                  </span>
                </div>

                {/* Main Icon/Emoji */}
                <motion.div 
                  className="text-7xl sm:text-8xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)] z-10"
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + index * 0.5, ease: "easeInOut" }}
                >
                  {cat.icon}
                </motion.div>

                {/* Decorative particles */}
                <div className="absolute bottom-4 left-4 text-xl opacity-50 animate-pulse">✨</div>
                <div className="absolute top-1/2 right-4 text-sm opacity-50 animate-bounce">⭐</div>
              </div>

              {/* Box Title (Arabic) below the box */}
              <div className="mt-4 bg-white/80 backdrop-blur-sm border-2 border-white px-6 py-2 rounded-full shadow-sm">
                <h3 className={\`text-lg font-black \${cat.textColor}\`}>
                  {cat.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Styles for horizontal scrollbar hiding */}
        <style dangerouslySetInnerHTML={{__html: \`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        \`}} />
      </div>
    );
  }

  // View 2: Games inside the selected Category (The old grid view but filtered)
  const currentCategory = categoriesData.find(c => c.id === activeCategory);
  const categoryGames = islandsData.filter(game => currentCategory?.games.includes(game.id));

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8 relative z-10">
      
      {/* Category Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/60 backdrop-blur-xl rounded-[40px] p-6 sm:p-8 flex items-center justify-between gap-4 sm:gap-6 shadow-lg border-4"
        style={{ borderColor: currentCategory?.borderColor.replace('border-', '') || '#4D2B82' }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 z-10 w-full">
          {/* Back Button */}
          <button 
            onClick={onBackToCategories}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 border-3 border-gray-200 flex items-center justify-center text-gray-500 shadow-sm active:scale-95 transition-all self-start sm:self-center shrink-0"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          
          <div className="text-center sm:text-right flex-1">
            <span className={\`inline-block text-sm font-black bg-white/80 px-4 py-1 rounded-full mb-2 \${currentCategory?.textColor}\`}>
              {currentCategory?.englishTitle}
            </span>
            <h2 className={\`text-3xl sm:text-4xl font-black mb-2 \${currentCategory?.textColor}\`}>
              {currentCategory?.icon} {currentCategory?.title}
            </h2>
            <p className="text-gray-600 font-bold text-sm sm:text-lg max-w-2xl bg-white/50 rounded-xl p-2 inline-block">
              اختر لعبة من هذه المجموعة للبدء في المغامرة!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid of Games for this category */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {categoryGames.map((game, index) => {
          // Keep the existing pastel gradients logic for game cards
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
              className={\`relative flex flex-col items-center text-center p-6 bg-gradient-to-br \${bgFrom} \${bgTo} backdrop-blur-xl rounded-[40px] border-[3px] border-white/50 shadow-[0_15px_35px_rgba(0,0,0,0.1),inset_0_5px_15px_rgba(255,255,255,0.8)] cursor-pointer overflow-hidden group\`}
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
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border-4 border-white flex items-center justify-center text-2xl shadow-lg">
                  {game.characterEmoji}
                </div>
              </motion.div>

              {/* Text Content */}
              <div className="relative z-10 flex flex-col flex-1 w-full items-center">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-gray-600 shadow-sm mb-4 border border-white">
                  {game.badge}
                </span>
                
                <h3 className={\`text-xl sm:text-2xl font-black \${textColor} mb-3 drop-shadow-md leading-tight\`}>
                  {game.gameName}
                </h3>
                
                <p className="text-gray-800 font-bold text-xs sm:text-sm leading-relaxed mb-6 opacity-80 px-2 line-clamp-2">
                  {game.quest}
                </p>

                {/* 3D Play Button */}
                <div
                  className={\`mt-auto w-full py-3.5 rounded-3xl bg-white border-b-[6px] border-black/10 text-lg font-black \${textColor} shadow-lg group-hover:bg-gray-50 group-active:border-b-0 group-active:translate-y-[6px] transition-all flex items-center justify-center gap-2\`}
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
