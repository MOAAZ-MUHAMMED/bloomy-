import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Sparkles } from 'lucide-react';
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

// Particle Component for explosion effect on click
const ClickSparkles = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-visible flex items-center justify-center">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
        animate={{ 
          opacity: [1, 1, 0], 
          scale: [0, 1.5, 0.5],
          x: (Math.random() - 0.5) * 150,
          y: (Math.random() - 0.5) * 150,
          rotate: Math.random() * 360
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute text-yellow-400 text-2xl drop-shadow-md"
      >
        <Sparkles fill="currentColor" />
      </motion.div>
    ))}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`dot-${i}`}
        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
        animate={{ 
          opacity: [1, 1, 0], 
          scale: [0, 1, 0],
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`absolute w-3 h-3 rounded-full ${['bg-pink-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-green-400'][i % 4]}`}
      />
    ))}
  </div>
);

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
  const [clickedId, setClickedId] = useState<string | null>(null);

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

  // Upgraded Premium Colors (Candy Pastels / Macaron Style)
  const clayItems = [
    { id: 'farm', title: 'مزرعتي السحرية', englishTitle: 'MY FARM', icon: farmBox?.icon || '🚜', action: () => onSelectCategory?.('farm'), bgGradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)', color: 'text-green-900', glow: 'rgba(150,230,161,0.6)' },
    { id: 'island_map', title: 'خريطة الجزيرة', englishTitle: 'ISLAND MAP', icon: '🗺️', action: onOpenMap, bgGradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', color: 'text-cyan-900', glow: 'rgba(161,196,253,0.6)' },
    { id: 'stories', title: 'هيا نقرأ', englishTitle: 'LET\'S READ', icon: storiesBox?.icon || '📖', action: () => onSelectCategory?.('stories'), bgGradient: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', color: 'text-indigo-900', glow: 'rgba(224,195,252,0.6)' },
    { id: 'math', title: 'أرقام وحساب', englishTitle: 'MATH', icon: mathBox?.icon || '🔢', action: () => onSelectCategory?.('math'), bgGradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)', color: 'text-orange-950', glow: 'rgba(252,182,159,0.6)' },
    { id: 'arabic', title: 'حروفي العربية', englishTitle: 'ARABIC', icon: arabicBox?.icon || 'أ', action: () => onSelectCategory?.('arabic'), bgGradient: 'linear-gradient(135deg, #f6d365, #fda085)', color: 'text-orange-900', glow: 'rgba(253,160,133,0.6)' },
    { id: 'english', title: 'حروفي الإنجليزية', englishTitle: 'ENGLISH', icon: englishBox?.icon || 'A', action: () => onSelectCategory?.('english'), bgGradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)', color: 'text-pink-900', glow: 'rgba(255,154,158,0.6)' },
    { id: 'fun_games', title: 'ألعاب ومرح', englishTitle: 'FUN GAMES', icon: funGamesBox?.icon || '🎈', action: () => onSelectCategory?.('fun_games'), bgGradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', color: 'text-purple-900', glow: 'rgba(161,140,209,0.6)' },
    { id: 'kitchen', title: 'المطبخ الصغير', englishTitle: 'KITCHEN', icon: kitchenBox?.icon || '🍳', action: () => onSelectCategory?.('kitchen'), bgGradient: 'linear-gradient(135deg, #fad0c4, #ffd1ff)', color: 'text-rose-900', glow: 'rgba(250,208,196,0.6)' },
    { id: 'coloring', title: 'لوّن وارسم', englishTitle: 'COLORING', icon: coloringBox?.icon || '🎨', action: () => onSelectCategory?.('coloring'), bgGradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)', color: 'text-teal-900', glow: 'rgba(132,250,176,0.6)' },
    { id: 'habits', title: 'عادات صحية', englishTitle: 'HABITS', icon: habitsBox?.icon || '🧼', action: () => onSelectCategory?.('habits'), bgGradient: 'linear-gradient(135deg, #e0c3fc, #cfd9df)', color: 'text-slate-800', glow: 'rgba(224,195,252,0.6)' },
    { id: 'iq', title: 'ألعاب الذكاء', englishTitle: 'IQ GAMES', icon: '🧠', action: () => onSelectCategory?.('iq'), bgGradient: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', color: 'text-indigo-900', glow: 'rgba(166,193,238,0.6)' },
    { id: 'parents', title: 'أولياء الأمور', englishTitle: 'PARENTS AREA', icon: '👨‍👩‍👧‍👦', action: onOpenParents, bgGradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)', color: 'text-blue-900', glow: 'rgba(137,247,254,0.6)' },
    { id: 'about_us', title: 'عن التطبيق', englishTitle: 'ABOUT US', icon: 'ℹ️', action: onOpenAbout, bgGradient: 'linear-gradient(135deg, #fccb90, #d57eeb)', color: 'text-fuchsia-900', glow: 'rgba(213,126,235,0.6)' },
  ];

  // View 1: 3D Premium Claymorphism Symmetrical Grid
  if (!activeCategory) {
    return (
      <div className="flex flex-col w-full min-h-screen relative z-10 select-none overflow-x-hidden justify-start items-center bg-transparent">
        
        {/* Top Profile / Coins Bar */}
        <div className="flex justify-between items-center mb-8 mt-6 w-full max-w-6xl mx-auto px-4 z-50">
          <div 
            className="flex items-center gap-3 bg-white/70 backdrop-blur-md p-2 pr-4 rounded-[30px] border-[4px] border-white/80"
            style={{ boxShadow: '0px 15px 30px rgba(0,0,0,0.1), inset 0px 4px 10px rgba(255,255,255,0.9)' }}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-[3px] border-white bg-white shadow-inner relative">
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
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-sm px-4 py-2 rounded-full flex items-center gap-1.5 border-[3px] border-white shadow-md ml-2 mr-3 relative overflow-hidden group">
              <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="text-lg absolute -right-3 -top-2 drop-shadow-md">⭐</span>
              <span className="pl-1 drop-shadow-sm">{globalStars}</span>
            </div>
          </div>
        </div>

        {/* The Premium Symmetrical Clay Grid */}
        <div className="w-full max-w-6xl mx-auto px-4 pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-fr relative">
          {clayItems.map((item, index) => {
            const isClicked = clickedId === item.id;
            
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
                whileHover={{ y: -10, scale: 1.04 }}
                whileTap={{ y: 5, scale: 0.95 }}
                className="relative cursor-pointer flex flex-col items-center justify-center p-6 md:p-8 rounded-[40px] border-[4px] border-white/60 group w-full aspect-[4/5] md:aspect-square overflow-hidden"
                style={{
                  background: item.bgGradient,
                  // Glass-Clay Hybrid: Frosted look with deep 3D shadows and outer glow on hover
                  boxShadow: `
                    0px 20px 40px rgba(0,0,0,0.15), 
                    inset -12px -12px 25px rgba(0,0,0,0.15), 
                    inset 12px 12px 25px rgba(255,255,255,0.9)
                  `
                }}
                onClick={() => {
                  speakArabic(item.title);
                  if (item.action) item.action();
                }}
              >
                {/* Noise Texture for Premium Material feel */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

                {/* Shimmer Effect overlay */}
                <div className="absolute top-0 left-[-100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] animate-[shimmer_4s_infinite] pointer-events-none opacity-50 group-hover:opacity-100" style={{ animationDelay: `${index * 0.2}s` }} />

                {/* Ambient Glow behind icon */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Floating 3D Icon with dynamic shadow */}
                <div className="relative mb-6 z-10 flex flex-col items-center justify-center">
                  <motion.div 
                    className="text-7xl md:text-8xl relative z-10"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 + (index % 3), ease: "easeInOut" }}
                    style={{ filter: 'drop-shadow(0px 10px 8px rgba(0,0,0,0.2))' }}
                  >
                    {item.icon}
                  </motion.div>
                  {/* Dynamic Floor Shadow tracking the bounce */}
                  <motion.div 
                    className="absolute -bottom-2 w-12 h-3 bg-black/20 rounded-[100%] blur-sm"
                    animate={{ scale: [1, 0.6, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.5 + (index % 3), ease: "easeInOut" }}
                  />
                </div>
                
                {/* Text Badge */}
                <div className="mt-auto flex flex-col items-center w-full z-10 relative">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-black/50 mb-1 drop-shadow-sm">
                    {item.englishTitle}
                  </span>
                  <div 
                    className="w-full bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-[20px] z-10 border-[3px] border-white flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,0.8)' }}
                  >
                    <h3 className={`text-[13px] md:text-[16px] font-black ${item.color} text-center leading-tight drop-shadow-sm`}>
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Sparkle Explosion removed for performance and speed */}
                
                {/* Custom Hover Glow Style injected via DOM */}
                <style dangerouslySetInnerHTML={{__html: `
                  .group:hover { box-shadow: 0px 25px 50px ${item.glow}, inset -12px -12px 25px rgba(0,0,0,0.15), inset 12px 12px 25px rgba(255,255,255,0.9) !important; }
                `}} />
              </motion.div>
            );
          })}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer { 
            0% { left: -100%; } 
            20% { left: 200%; }
            100% { left: 200%; }
          }
        `}} />
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
        className="relative rounded-[40px] p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-[6px] border-white/60 overflow-hidden"
        style={{ 
          background: activeClay?.bgGradient || 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
          boxShadow: `
            0px 25px 50px rgba(0,0,0,0.2), 
            inset -15px -15px 30px rgba(0,0,0,0.15), 
            inset 15px 15px 30px rgba(255,255,255,0.9)
          `
        }}
      >
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 z-10 w-full">
          {/* Back Button */}
          <button 
            onClick={onBackToCategories}
            className="w-14 h-14 rounded-full bg-white border-[4px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.15),inset_2px_2px_5px_rgba(255,255,255,0.9)] flex items-center justify-center text-gray-600 hover:scale-110 active:scale-95 transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
          
          <div className="text-center sm:text-right flex-1">
            <span className={`inline-block text-xs font-black bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full mb-3 shadow-inner ${activeClay?.color}`}>
              {activeClay?.englishTitle}
            </span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-3 drop-shadow-md ${activeClay?.color}`}>
              <motion.span 
                className="inline-block"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {activeClay?.icon}
              </motion.span> 
              {' '} {activeClay?.title}
            </h2>
            <p className="text-gray-800 font-bold text-sm sm:text-lg max-w-2xl bg-white/85 backdrop-blur-md rounded-[20px] p-3 inline-block shadow-[0_5px_15px_rgba(0,0,0,0.05)] border-2 border-white">
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
              whileHover={{ y: -8, scale: 1.04 }}
              whileTap={{ y: 5, scale: 0.95 }}
              className="relative flex flex-col items-center text-center p-5 bg-white/95 backdrop-blur-xl rounded-[40px] border-[5px] border-white cursor-pointer group"
              style={{
                boxShadow: `
                  0px 15px 30px rgba(0,0,0,0.1), 
                  inset -8px -8px 20px rgba(0,0,0,0.05), 
                  inset 8px 8px 20px rgba(255,255,255,0.9)
                `
              }}
              onClick={() => onSelectGame(game.id)}
            >
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + index * 0.2, ease: "easeInOut" }}
                className="relative z-10 w-20 h-20 bg-gray-50 rounded-full border-[4px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.1),inset_4px_4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
              >
                <div style={{ filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.15))' }}>
                  {game.emoji}
                </div>
                <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full border-[3px] border-white flex items-center justify-center text-xl shadow-lg">
                  {game.characterEmoji}
                </div>
              </motion.div>

              <div className="relative z-10 flex flex-col flex-1 w-full items-center">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 shadow-inner mb-3 border border-white">
                  {game.badge}
                </span>
                
                <h3 className="text-lg sm:text-xl font-black text-gray-800 mb-2 drop-shadow-sm leading-tight group-hover:text-[#4D2B82] transition-colors">
                  {game.gameName}
                </h3>
                
                <p className="text-gray-500 font-bold text-[10px] sm:text-xs leading-relaxed mb-5 px-1 line-clamp-2">
                  {game.quest}
                </p>

                <div
                  className="mt-auto w-full py-2.5 rounded-[20px] text-sm font-black shadow-md flex items-center justify-center gap-1.5 transition-all relative overflow-hidden"
                  style={{
                    background: activeClay?.bgGradient || '#f0f0f0',
                    color: activeClay?.color || '#333',
                    boxShadow: `0 5px 0px rgba(0,0,0,0.1)`
                  }}
                >
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1s_infinite]" />
                  <Play className="w-5 h-5 fill-current relative z-10" />
                  <span className="relative z-10">{game.id === 'quran' ? 'احفظ الآن!' : 'ابدأ اللعب!'}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

