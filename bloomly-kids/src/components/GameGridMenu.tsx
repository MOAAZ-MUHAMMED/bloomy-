import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ArrowLeft } from 'lucide-react';
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

  // Solid, vibrant colors for the "Clay/Toy" material look
  const clayItems = [
    { id: 'farm', title: 'مزرعتي السحرية', englishTitle: 'MY FARM', icon: farmBox?.icon || '🚜', action: () => onSelectCategory?.('farm'), bgColor: '#a6f366', color: 'text-green-900' },
    { id: 'island_map', title: 'خريطة الجزيرة', englishTitle: 'ISLAND MAP', icon: '🗺️', action: onOpenMap, bgColor: '#4dd2ff', color: 'text-cyan-900' },
    { id: 'stories', title: 'هيا نقرأ', englishTitle: 'LET\'S READ', icon: storiesBox?.icon || '📖', action: () => onSelectCategory?.('stories'), bgColor: '#c68cff', color: 'text-purple-900' },
    { id: 'math', title: 'أرقام وحساب', englishTitle: 'MATH', icon: mathBox?.icon || '🔢', action: () => onSelectCategory?.('math'), bgColor: '#ff8c42', color: 'text-orange-950' },
    { id: 'arabic', title: 'حروفي العربية', englishTitle: 'ARABIC', icon: arabicBox?.icon || 'أ', action: () => onSelectCategory?.('arabic'), bgColor: '#ffd11a', color: 'text-yellow-900' },
    { id: 'english', title: 'حروفي الإنجليزية', englishTitle: 'ENGLISH', icon: englishBox?.icon || 'A', action: () => onSelectCategory?.('english'), bgColor: '#ff7eb3', color: 'text-pink-900' },
    { id: 'fun_games', title: 'ألعاب ومرح', englishTitle: 'FUN GAMES', icon: funGamesBox?.icon || '🎈', action: () => onSelectCategory?.('fun_games'), bgColor: '#9999ff', color: 'text-indigo-900' },
    { id: 'kitchen', title: 'المطبخ الصغير', englishTitle: 'KITCHEN', icon: kitchenBox?.icon || '🍳', action: () => onSelectCategory?.('kitchen'), bgColor: '#ffa366', color: 'text-orange-900' },
    { id: 'coloring', title: 'لوّن وارسم', englishTitle: 'COLORING', icon: coloringBox?.icon || '🎨', action: () => onSelectCategory?.('coloring'), bgColor: '#4df0a3', color: 'text-emerald-900' },
    { id: 'habits', title: 'عادات صحية', englishTitle: 'HABITS', icon: habitsBox?.icon || '🧼', action: () => onSelectCategory?.('habits'), bgColor: '#e6f2ff', color: 'text-slate-800' },
    { id: 'parents', title: 'أولياء الأمور', englishTitle: 'PARENTS AREA', icon: '👨‍👩‍👧‍👦', action: onOpenParents, bgColor: '#66e0ff', color: 'text-cyan-900' },
    { id: 'about_us', title: 'عن التطبيق', englishTitle: 'ABOUT US', icon: 'ℹ️', action: onOpenAbout, bgColor: '#ffb3e6', color: 'text-fuchsia-900' },
  ];

  // View 1: 3D Claymorphism Symmetrical Grid
  if (!activeCategory) {
    return (
      <div className="flex flex-col w-full min-h-screen relative z-10 select-none overflow-x-hidden justify-start items-center bg-transparent">
        
        {/* Top Profile / Coins Bar */}
        <div className="flex justify-between items-center mb-8 mt-6 w-full max-w-6xl mx-auto px-4 z-50">
          <div 
            className="flex items-center gap-3 bg-white/70 backdrop-blur-md p-2 pr-4 rounded-[30px] border-4 border-white"
            style={{ boxShadow: '10px 10px 20px rgba(0,0,0,0.1), inset 4px 4px 10px rgba(255,255,255,0.8)' }}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-[3px] border-white bg-white shadow-inner">
              <SproutMascot className="w-full h-full" state="idle" />
            </div>
            <div className="text-right text-[#4D2B82]">
              <h3 className="text-sm font-black drop-shadow-sm">
                {childProfile?.name || 'البطل السحري'}
              </h3>
              <span className="text-[11px] font-bold text-white bg-[#4D2B82]/90 px-3 py-0.5 rounded-full shadow-inner block mt-1">
                {childProfile?.age ? `${childProfile.age} سنوات` : '٥ سنوات'}
              </span>
            </div>
            <div className="bg-yellow-400 text-yellow-900 font-black text-sm px-4 py-2 rounded-full flex items-center gap-1.5 border-[3px] border-white shadow-md ml-2 mr-3 relative">
              <span className="text-lg absolute -right-3 -top-2">⭐</span>
              <span className="pl-1">{globalStars}</span>
            </div>
          </div>
        </div>

        {/* The Symmetrical Clay Grid */}
        <div className="w-full max-w-6xl mx-auto px-4 pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
          {clayItems.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.05, 
                  type: 'spring', 
                  stiffness: 250, 
                  damping: 20 
                }}
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ y: 5, scale: 0.95 }}
                className="relative cursor-pointer flex flex-col items-center justify-center p-6 md:p-8 rounded-[40px] border-[5px] border-white/40 group w-full aspect-[4/5] md:aspect-square"
                style={{
                  backgroundColor: item.bgColor,
                  // The magic of Claymorphism: Outer drop shadow + Inner dark shadow + Inner light shadow
                  boxShadow: `
                    12px 15px 25px rgba(0,0,0,0.15), 
                    inset -10px -10px 20px rgba(0,0,0,0.12), 
                    inset 10px 10px 20px rgba(255,255,255,0.8)
                  `
                }}
                onClick={() => {
                  speakArabic(item.title);
                  if (item.action) item.action();
                }}
              >
                {/* Floating Icon */}
                <motion.div 
                  className="text-7xl md:text-8xl mb-6 relative z-10"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + (index % 3), ease: "easeInOut" }}
                  style={{ filter: 'drop-shadow(0px 15px 10px rgba(0,0,0,0.15))' }}
                >
                  {item.icon}
                </motion.div>
                
                {/* Text Badge */}
                <div className="mt-auto flex flex-col items-center w-full">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">
                    {item.englishTitle}
                  </span>
                  <div 
                    className="w-full bg-white/95 backdrop-blur-sm px-3 py-2 rounded-[20px] z-10 border-2 border-white flex items-center justify-center"
                    style={{ boxShadow: '0 8px 15px rgba(0,0,0,0.05), inset 0 2px 5px rgba(255,255,255,0.8)' }}
                  >
                    <h3 className={`text-[13px] md:text-[16px] font-black ${item.color} text-center leading-tight`}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // View 2: Games inside the selected Category
  const currentCategory = categoriesData.find(c => c.id === activeCategory);
  const categoryGames = islandsData.filter(game => currentCategory?.games.includes(game.id));
  const activeClay = clayItems.find(c => c.id === activeCategory);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-8 relative z-10 min-h-screen bg-transparent justify-start">
      
      {/* Category Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative rounded-[40px] p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-[6px] border-white/50"
        style={{ 
          backgroundColor: activeClay?.bgColor || '#e0c3fc',
          boxShadow: `
            15px 20px 30px rgba(0,0,0,0.15), 
            inset -12px -12px 25px rgba(0,0,0,0.12), 
            inset 12px 12px 25px rgba(255,255,255,0.8)
          `
        }}
      >
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 z-10 w-full">
          {/* Back Button */}
          <button 
            onClick={onBackToCategories}
            className="w-14 h-14 rounded-full bg-white border-[4px] border-white shadow-[5px_5px_15px_rgba(0,0,0,0.1),inset_2px_2px_5px_rgba(255,255,255,0.9)] flex items-center justify-center text-gray-600 active:scale-95 transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
          
          <div className="text-center sm:text-right flex-1">
            <span className={`inline-block text-xs font-black bg-white/70 px-4 py-1.5 rounded-full mb-3 shadow-inner ${activeClay?.color}`}>
              {activeClay?.englishTitle}
            </span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-3 drop-shadow-md ${activeClay?.color}`}>
              {activeClay?.icon} {activeClay?.title}
            </h2>
            <p className="text-gray-800 font-bold text-sm sm:text-lg max-w-2xl bg-white/80 rounded-[20px] p-3 inline-block shadow-sm border border-white">
              اختر لعبة من هذه المجموعة للبدء في المغامرة!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid of Games for this category */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 pb-16">
        {categoryGames.map((game, index) => {
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 250, damping: 20 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ y: 5, scale: 0.95 }}
              className="relative flex flex-col items-center text-center p-5 bg-white rounded-[40px] border-[5px] border-white cursor-pointer group"
              style={{
                boxShadow: `
                  10px 15px 25px rgba(0,0,0,0.1), 
                  inset -8px -8px 20px rgba(0,0,0,0.05), 
                  inset 8px 8px 20px rgba(255,255,255,0.9)
                `
              }}
              onClick={() => onSelectGame(game.id)}
            >
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + index * 0.2, ease: "easeInOut" }}
                className="relative z-10 w-20 h-20 bg-gray-50 rounded-full border-[4px] border-white shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
              >
                <div style={{ filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.15))' }}>
                  {game.emoji}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-[3px] border-white flex items-center justify-center text-xl shadow-md">
                  {game.characterEmoji}
                </div>
              </motion.div>

              <div className="relative z-10 flex flex-col flex-1 w-full items-center">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 shadow-inner mb-3">
                  {game.badge}
                </span>
                
                <h3 className="text-lg sm:text-xl font-black text-gray-800 mb-2 drop-shadow-sm leading-tight">
                  {game.gameName}
                </h3>
                
                <p className="text-gray-500 font-bold text-[10px] sm:text-xs leading-relaxed mb-5 px-1 line-clamp-2">
                  {game.quest}
                </p>

                <div
                  className="mt-auto w-full py-2.5 rounded-[20px] text-sm font-black shadow-md flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: activeClay?.bgColor || '#f0f0f0',
                    color: activeClay?.color || '#333',
                    boxShadow: `0 5px 0px rgba(0,0,0,0.1)`
                  }}
                >
                  <Play className="w-5 h-5 fill-current" />
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

