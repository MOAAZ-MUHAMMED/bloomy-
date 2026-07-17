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

  const renderCard = (cat: any, width: string, height: string, isTall: boolean) => {
    if (!cat) return null;
    return (
      <motion.div
        key={cat.id}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          speakArabic(cat.title);
          if (cat.action) {
            cat.action();
          } else if (onSelectCategory) {
            onSelectCategory(cat.id);
          }
        }}
        className="flex flex-col items-center cursor-pointer shrink-0"
        style={{ width }}
      >
        <div 
          className="w-full bg-white rounded-[36px] border-[5px] shadow-[0_12px_25px_rgba(0,0,0,0.2)] flex flex-col items-center justify-between p-5 relative overflow-hidden transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:-translate-y-2" 
          style={{ 
            height,
            borderColor: cat.borderColor ? cat.borderColor.replace('border-', '') : '#4D2B82' 
          }}
        >
          {/* Background decorative gradient blob */}
          <div className={`absolute inset-0 opacity-15 bg-gradient-to-br ${cat.bgGradient || 'from-purple-100 to-indigo-100'}`} />
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />

          {/* English title at the top of the box */}
          {isTall && (
            <div className="w-full text-center mt-2 z-10">
              <span className={`font-black text-[10px] uppercase tracking-wider opacity-85 ${cat.textColor || 'text-purple-700'}`}>
                {cat.englishTitle}
              </span>
            </div>
          )}

          {/* Main Icon/Emoji */}
          <motion.div 
            className={`${isTall ? 'text-7xl sm:text-8xl' : 'text-5xl'} filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.12)] z-10 flex-1 flex items-center justify-center`}
            animate={isTall ? { y: [0, -6, 0], rotate: [0, 3, -3, 0] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            {cat.icon}
          </motion.div>

          {/* Decorative particles */}
          {isTall && (
            <>
              <div className="absolute bottom-4 left-4 text-lg opacity-40 animate-pulse">✨</div>
              <div className="absolute top-1/2 right-4 text-xs opacity-40 animate-bounce">⭐</div>
            </>
          )}
        </div>

        {/* Box Title (Arabic) below the box */}
        <div className="mt-2 bg-white/95 border border-purple-100 px-4 py-1 rounded-full shadow-xs">
          <h3 className={`text-xs font-black text-center ${cat.textColor || 'text-[#4D2B82]'}`}>
            {cat.title}
          </h3>
        </div>
      </motion.div>
    );
  };

  // View 1: Main Category Selection (Lamsa-style Layout)
  if (!activeCategory) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-[#3D1E6D] px-4 py-6 relative z-10 select-none overflow-hidden justify-start items-center">
        
        {/* Top Profile / Coins Bar */}
        <div className="flex justify-between items-center mb-6 w-full max-w-7xl mx-auto px-2">
          {/* Left: Avatar, Name, Age, Coins */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white">
              <SproutMascot className="w-full h-full" state="idle" />
            </div>
            <div className="text-right text-white">
              <h3 className="text-sm font-black">
                {childProfile?.name || 'البطل السحري'}
              </h3>
              <span className="text-[10px] font-bold text-purple-200 bg-white/10 px-2 py-0.5 rounded-full">
                {childProfile?.age ? `${childProfile.age} سنوات` : '٥ سنوات'}
              </span>
            </div>
            
            {/* Coins container */}
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-yellow-300 shadow-md">
              <span>⭐</span>
              <span>{globalStars}</span>
            </div>
          </div>

          {/* Right: Hamburger menu, download button, and promo banner */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-[#FF3366] text-white font-black text-xs px-4 py-1.5 rounded-full items-center gap-1 animate-pulse">
              <span>🔥</span>
              <span>خصم 50% لفترة محدودة</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-lg cursor-pointer">
              📥
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-lg cursor-pointer">
              ☰
            </button>
          </div>
        </div>

        <div 
          className="flex gap-8 overflow-x-auto pb-10 pt-6 px-4 hide-scrollbar w-full max-w-7xl mx-auto items-center" 
          dir="ltr"
          style={{ scrollBehavior: 'smooth', minHeight: '400px' }}
        >
          {/* Column 1: Farm (Tall) */}
          {farmBox && renderCard(
            { ...farmBox, action: () => onSelectCategory?.('farm') }, 
            '220px', 
            '280px', 
            true
          )}

          {/* Column 2: Island Map (Tall) */}
          {renderCard(
            {
              id: "island_map",
              title: "خريطة الجزيرة",
              englishTitle: "ISLAND MAP",
              icon: "🗺️",
              bgGradient: "from-[#11998e]/90 to-[#38ef7d]/90",
              textColor: "text-green-700",
              borderColor: "border-[#38ef7d]",
              action: onOpenMap
            }, 
            '220px', 
            '280px', 
            true
          )}

          {/* Column 3: Stack (Fun Games & Kitchen) */}
          <div className="flex flex-col justify-between h-[320px] shrink-0 gap-3">
            {funGamesBox && renderCard(funGamesBox, '190px', '125px', false)}
            {kitchenBox && renderCard(kitchenBox, '190px', '125px', false)}
          </div>

          {/* Column 4: Let's Read (Tall) */}
          {storiesBox && renderCard(storiesBox, '220px', '280px', true)}

          {/* Column 5: Stack (Math & Arabic/English) */}
          <div className="flex flex-col justify-between h-[320px] shrink-0 gap-3">
            {mathBox && renderCard(mathBox, '220px', '125px', false)}
            <div className="flex gap-2 w-[220px] justify-between">
              {arabicBox && renderCard(arabicBox, '105px', '125px', false)}
              {englishBox && renderCard(englishBox, '105px', '125px', false)}
            </div>
          </div>

          {/* Column 6: Stack (Coloring & Habits) */}
          <div className="flex flex-col justify-between h-[320px] shrink-0 gap-3">
            {coloringBox && renderCard(coloringBox, '190px', '125px', false)}
            {habitsBox && renderCard(habitsBox, '190px', '125px', false)}
          </div>

          {/* Column 7: Parents Area (Tall) */}
          {renderCard(
            {
              id: "parents",
              title: "أولياء الأمور",
              englishTitle: "PARENTS AREA",
              icon: "👨‍👩‍👧‍👦",
              bgGradient: "from-[#8E2DE2]/90 to-[#4A00E0]/90",
              textColor: "text-purple-700",
              borderColor: "border-[#8E2DE2]",
              action: onOpenParents
            }, 
            '220px', 
            '280px', 
            true
          )}

          {/* Column 8: About Us (Tall) */}
          {renderCard(
            {
              id: "about_us",
              title: "بنعرف عن نفسنا",
              englishTitle: "ABOUT US",
              icon: "ℹ️",
              bgGradient: "from-[#fc4a1a]/90 to-[#f7b733]/90",
              textColor: "text-orange-700",
              borderColor: "border-[#fc4a1a]",
              action: onOpenAbout
            }, 
            '220px', 
            '280px', 
            true
          )}
        </div>

        {/* Global Styles for horizontal scrollbar hiding */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
      </div>
    );
  }

  // View 2: Games inside the selected Category (The old grid view but filtered)
  const currentCategory = categoriesData.find(c => c.id === activeCategory);
  const categoryGames = islandsData.filter(game => currentCategory?.games.includes(game.id));

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8 relative z-10 min-h-screen bg-[#3D1E6D] justify-start">
      
      {/* Category Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/95 rounded-[40px] p-6 flex items-center justify-between gap-6 shadow-lg border-4"
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
