import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
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
  childProfile?: any;
  globalStars?: number;
}

export const GameGridMenu: React.FC<GameGridMenuProps> = ({ 
  onSelectCategory, 
  onSelectGame, 
  activeCategory, 
  onBackToCategories,
  onOpenParents,
  onOpenMap,
  onOpenAbout,
  childProfile,
  globalStars = 0
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

  const farmBox = categoriesData.find(c => c.id === 'farm');
  const funGamesBox = categoriesData.find(c => c.id === 'fun_games');
  const kitchenBox = categoriesData.find(c => c.id === 'kitchen');
  const storiesBox = categoriesData.find(c => c.id === 'stories');
  const mathBox = categoriesData.find(c => c.id === 'math');
  const arabicBox = categoriesData.find(c => c.id === 'arabic');
  const englishBox = categoriesData.find(c => c.id === 'english');
  const coloringBox = categoriesData.find(c => c.id === 'coloring');
  const habitsBox = categoriesData.find(c => c.id === 'habits');

  // 3D Carousel Items
  const carouselItems = [
    { id: 'farm', title: 'مزرعتي السحرية', englishTitle: 'MY FARM', icon: farmBox?.icon || '🚜', action: () => onSelectCategory?.('farm'), bgGradient: 'from-[#a8ff78] to-[#78ffd6]', color: 'text-green-800' },
    { id: 'island_map', title: 'خريطة الجزيرة', englishTitle: 'ISLAND MAP', icon: '🗺️', action: onOpenMap, bgGradient: 'from-[#11998e] to-[#38ef7d]', color: 'text-emerald-900' },
    { id: 'stories', title: 'هيا نقرأ', englishTitle: 'LET\'S READ', icon: storiesBox?.icon || '📖', action: () => onSelectCategory?.('stories'), bgGradient: 'from-[#e0c3fc] to-[#8ec5fc]', color: 'text-indigo-900' },
    { id: 'math', title: 'أرقام وحساب', englishTitle: 'MATH', icon: mathBox?.icon || '🔢', action: () => onSelectCategory?.('math'), bgGradient: 'from-[#a1c4fd] to-[#c2e9fb]', color: 'text-blue-900' },
    { id: 'arabic', title: 'حروفي العربية', englishTitle: 'ARABIC', icon: arabicBox?.icon || 'أ', action: () => onSelectCategory?.('arabic'), bgGradient: 'from-[#f6d365] to-[#fda085]', color: 'text-orange-900' },
    { id: 'english', title: 'حروفي الإنجليزية', englishTitle: 'ENGLISH', icon: englishBox?.icon || 'A', action: () => onSelectCategory?.('english'), bgGradient: 'from-[#ff9a9e] to-[#fecfef]', color: 'text-pink-900' },
    { id: 'fun_games', title: 'ألعاب ومرح', englishTitle: 'FUN GAMES', icon: funGamesBox?.icon || '🎈', action: () => onSelectCategory?.('fun_games'), bgGradient: 'from-[#a18cd1] to-[#fbc2eb]', color: 'text-purple-900' },
    { id: 'kitchen', title: 'المطبخ الصغير', englishTitle: 'KITCHEN', icon: kitchenBox?.icon || '🍳', action: () => onSelectCategory?.('kitchen'), bgGradient: 'from-[#ffecd2] to-[#fcb69f]', color: 'text-red-900' },
    { id: 'coloring', title: 'لوّن وارسم', englishTitle: 'COLORING', icon: coloringBox?.icon || '🎨', action: () => onSelectCategory?.('coloring'), bgGradient: 'from-[#84fab0] to-[#8fd3f4]', color: 'text-teal-900' },
    { id: 'habits', title: 'عادات صحية', englishTitle: 'HABITS', icon: habitsBox?.icon || '🧼', action: () => onSelectCategory?.('habits'), bgGradient: 'from-[#cfd9df] to-[#e2ebf0]', color: 'text-slate-800' },
    { id: 'parents', title: 'أولياء الأمور', englishTitle: 'PARENTS AREA', icon: '👨‍👩‍👧‍👦', action: onOpenParents, bgGradient: 'from-[#4facfe] to-[#00f2fe]', color: 'text-cyan-900' },
    { id: 'about_us', title: 'بنعرف عن نفسنا', englishTitle: 'ABOUT US', icon: 'ℹ️', action: onOpenAbout, bgGradient: 'from-[#fccb90] to-[#d57eeb]', color: 'text-fuchsia-900' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // View 1: 3D Glassmorphism Carousel
  if (!activeCategory) {
    return (
      <div className="flex flex-col w-full min-h-screen relative z-10 select-none overflow-hidden justify-start items-center">
        
        {/* Top Profile / Coins Bar */}
        <div className="flex justify-between items-center mb-2 mt-6 w-full max-w-7xl mx-auto px-4 z-50">
          <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 pr-4 rounded-full border border-white/50 shadow-lg">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white">
              <SproutMascot className="w-full h-full" state="idle" />
            </div>
            <div className="text-right text-[#4D2B82]">
              <h3 className="text-sm font-black">
                {childProfile?.name || 'البطل السحري'}
              </h3>
              <span className="text-[10px] font-bold text-white bg-[#4D2B82]/60 px-2 py-0.5 rounded-full">
                {childProfile?.age ? `${childProfile.age} سنوات` : '٥ سنوات'}
              </span>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-yellow-300 shadow-md mr-2">
              <span>⭐</span>
              <span>{globalStars}</span>
            </div>
          </div>
        </div>

        {/* 3D Carousel Area */}
        <div className="relative w-full flex-1 flex items-center justify-center -mt-8 sm:mt-0 min-h-[500px]">
          
          {/* Navigation Arrows */}
          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-12 z-50 w-14 h-14 md:w-20 md:h-20 bg-white/60 backdrop-blur-xl border-4 border-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer text-[#4D2B82]"
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          <button 
            onClick={handlePrev}
            className="absolute left-4 md:left-12 z-50 w-14 h-14 md:w-20 md:h-20 bg-white/60 backdrop-blur-xl border-4 border-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer text-[#4D2B82]"
          >
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Carousel Items */}
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center" style={{ perspective: 1200 }}>
            <AnimatePresence initial={false}>
              {carouselItems.map((item, index) => {
                // Calculate relative position based on a circular array distance
                let diff = index - currentIndex;
                const len = carouselItems.length;
                
                // Find shortest path in circular array
                if (diff > len / 2) diff -= len;
                else if (diff < -len / 2) diff += len;

                // Only render items that are close (e.g. +/- 3 items)
                if (Math.abs(diff) > 3) return null;

                const isCenter = diff === 0;
                // Calculate transforms
                const x = diff * (window.innerWidth < 768 ? 120 : 180); // Spread on X axis
                const z = -Math.abs(diff) * 120; // Push backward
                const rotateY = diff * -25; // Rotate facing center
                const scale = 1 - Math.abs(diff) * 0.15; // Scale down distant items
                const zIndex = 50 - Math.abs(diff);

                return (
                  <motion.div
                    key={item.id}
                    className="absolute cursor-pointer"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      x, 
                      z, 
                      rotateY, 
                      scale, 
                      zIndex,
                      opacity: Math.abs(diff) >= 3 ? 0 : 1
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => {
                      if (isCenter) {
                        speakArabic(item.title);
                        if (item.action) item.action();
                      } else {
                        setCurrentIndex(index);
                      }
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = offset.x * velocity.x;
                      if (swipe < -10000 || offset.x < -80) {
                        handleNext();
                      } else if (swipe > 10000 || offset.x > 80) {
                        handlePrev();
                      }
                    }}
                  >
                    {/* The Glassmorphism Card */}
                    <div className={`w-[240px] h-[340px] sm:w-[280px] sm:h-[380px] md:w-[320px] md:h-[440px] rounded-[40px] relative flex flex-col items-center justify-between p-6 border-[4px] border-white/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 group ${isCenter ? 'ring-8 ring-white/30 hover:ring-white/50' : 'hover:border-white/90'}`}>
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-70`} />
                      
                      {/* Shimmer Effect */}
                      <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_2s_infinite]" />

                      {/* Content */}
                      <div className="relative z-10 w-full text-center mt-2">
                        <span className="font-black text-[10px] md:text-xs uppercase tracking-widest text-white/95 drop-shadow-md bg-black/10 px-4 py-1 rounded-full">
                          {item.englishTitle}
                        </span>
                      </div>

                      <motion.div 
                        className="relative z-10 text-[100px] sm:text-[120px] md:text-[140px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)]"
                        animate={isCenter ? { y: [0, -15, 0], rotate: [0, 5, -5, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      >
                        {item.icon}
                      </motion.div>

                      <div className="relative z-10 w-full bg-white/95 backdrop-blur-md border-[3px] border-white px-4 py-3 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.1)] mb-2 group-hover:-translate-y-1 transition-transform">
                        <h3 className={`text-base sm:text-lg md:text-2xl font-black text-center ${item.color}`}>
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Styles for the shimmer effect */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer { 100% { left: 200%; } }
        `}} />
      </div>
    );
  }

  // View 2: Games inside the selected Category (The old grid view but filtered)
  const currentCategory = categoriesData.find(c => c.id === activeCategory);
  const categoryGames = islandsData.filter(game => currentCategory?.games.includes(game.id));

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8 relative z-10 min-h-screen bg-transparent justify-start">
      
      {/* Category Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/95 backdrop-blur-xl rounded-[40px] p-6 flex items-center justify-between gap-6 shadow-2xl border-4"
        style={{ borderColor: currentCategory?.borderColor.replace('border-', '') || '#4D2B82' }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 z-10 w-full">
          {/* Back Button */}
          <button 
            onClick={onBackToCategories}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 border-3 border-gray-200 flex items-center justify-center text-gray-500 shadow-sm active:scale-95 transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          
          <div className="text-center sm:text-right flex-1">
            <span className={`inline-block text-sm font-black bg-white/80 px-4 py-1 rounded-full mb-2 ${currentCategory?.textColor}`}>
              {currentCategory?.englishTitle}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black mb-2 ${currentCategory?.textColor}`}>
              {currentCategory?.icon} {currentCategory?.title}
            </h2>
            <p className="text-gray-600 font-bold text-sm sm:text-lg max-w-2xl bg-white/50 rounded-xl p-2 inline-block">
              اختر لعبة من هذه المجموعة للبدء في المغامرة!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid of Games for this category */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 pb-16">
        {categoryGames.map((game, index) => {
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
              className={`relative flex flex-col items-center text-center p-6 bg-gradient-to-br ${bgFrom} ${bgTo} backdrop-blur-xl rounded-[40px] border-[3px] border-white/50 shadow-[0_15px_35px_rgba(0,0,0,0.15),inset_0_5px_15px_rgba(255,255,255,0.8)] cursor-pointer overflow-hidden group`}
              onClick={() => onSelectGame(game.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 pointer-events-none rounded-t-[36px]" />
              <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]" />

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

