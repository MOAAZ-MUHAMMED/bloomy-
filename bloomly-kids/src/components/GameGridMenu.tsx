import React, { useState } from 'react';
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
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [activeCategory]);

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
    { id: 'farm', title: 'مزرعتي السحرية', englishTitle: 'MY FARM', icon: farmBox?.icon || '🚜', action: () => onSelectCategory?.('farm'), bgGradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)', color: 'text-green-900' },
    { id: 'island_map', title: 'خريطة الجزيرة', englishTitle: 'ISLAND MAP', icon: '🗺️', action: onOpenMap, bgGradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', color: 'text-cyan-900' },
    { id: 'stories', title: 'هيا نقرأ', englishTitle: 'LET\'S READ', icon: storiesBox?.icon || '📖', action: () => onSelectGame('stories'), bgGradient: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', color: 'text-indigo-900' },
    { id: 'math', title: 'أرقام وحساب', englishTitle: 'MATH', icon: mathBox?.icon || '🔢', action: () => onSelectCategory?.('math'), bgGradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)', color: 'text-orange-950' },
    { id: 'arabic', title: 'حروفي العربية', englishTitle: 'ARABIC', icon: arabicBox?.icon || 'أ', action: () => onSelectCategory?.('arabic'), bgGradient: 'linear-gradient(135deg, #f6d365, #fda085)', color: 'text-orange-900' },
    { id: 'quran', title: 'جزيرة القرآن', englishTitle: 'QURAN', icon: '🕋', action: () => onSelectGame('quran'), bgGradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)', color: 'text-green-900' },
    { id: 'english', title: 'حروفي الإنجليزية', englishTitle: 'ENGLISH', icon: englishBox?.icon || 'A', action: () => onSelectCategory?.('english'), bgGradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)', color: 'text-pink-900' },
    { id: 'fun_games', title: 'ألعاب ومرح', englishTitle: 'FUN GAMES', icon: funGamesBox?.icon || '🎈', action: () => onSelectCategory?.('fun_games'), bgGradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', color: 'text-purple-900' },
    { id: 'kitchen', title: 'المطبخ الصغير', englishTitle: 'KITCHEN', icon: kitchenBox?.icon || '🍳', action: () => onSelectCategory?.('kitchen'), bgGradient: 'linear-gradient(135deg, #fad0c4, #ffd1ff)', color: 'text-rose-900' },
    { id: 'coloring', title: 'لوّن وارسم', englishTitle: 'COLORING', icon: coloringBox?.icon || '🎨', action: () => onSelectCategory?.('coloring'), bgGradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)', color: 'text-teal-900' },
    { id: 'habits', title: 'عادات صحية', englishTitle: 'HABITS', icon: habitsBox?.icon || '🧼', action: () => onSelectGame('dailyHabits'), bgGradient: 'linear-gradient(135deg, #e0c3fc, #cfd9df)', color: 'text-slate-800' },
    { id: 'iq', title: 'ألعاب الذكاء', englishTitle: 'IQ GAMES', icon: '🧠', action: () => onSelectCategory?.('iq'), bgGradient: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', color: 'text-indigo-900' },
    { id: 'parents', title: 'أولياء الأمور', englishTitle: 'PARENTS AREA', icon: '👨‍👩‍👧‍👦', action: onOpenParents, bgGradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)', color: 'text-blue-900' },
    { id: 'about_us', title: 'عن التطبيق', englishTitle: 'ABOUT US', icon: 'ℹ️', action: onOpenAbout, bgGradient: 'linear-gradient(135deg, #fccb90, #d57eeb)', color: 'text-fuchsia-900' },
  ];

  // View 1: 3D Premium Claymorphism Symmetrical Grid
  if (!activeCategory) {
    return (
      <div className="flex flex-col w-full min-h-screen relative z-10 select-none overflow-x-hidden justify-start items-center bg-transparent">
        
        {/* Top Profile / Coins Bar */}
        <div className="flex justify-between items-center mb-8 mt-6 w-full max-w-6xl mx-auto px-4 z-50">
          <div 
            className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 pr-4 rounded-[30px] border-[4px] border-white/90 shadow-md"
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
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-sm px-4 py-2 rounded-full flex items-center gap-1.5 border-[3px] border-white shadow-md ml-2 mr-3 relative overflow-hidden">
              <span className="text-lg absolute -right-3 -top-2 drop-shadow-md">⭐</span>
              <span className="pl-1 drop-shadow-sm">{globalStars}</span>
            </div>
          </div>
        </div>

        {/* Crisp Symmetrical Grid - Zero Lag */}
        <div className="w-full max-w-6xl mx-auto px-4 pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-fr relative">
          {clayItems.map((item) => {
            return (
              <div
                key={item.id}
                className="relative cursor-pointer flex flex-col items-center justify-center p-6 md:p-8 rounded-[40px] border-[4px] border-white/80 transition-transform active:scale-95 hover:scale-105 w-full aspect-[4/5] md:aspect-square overflow-hidden shadow-lg"
                style={{
                  background: item.bgGradient,
                }}
                onClick={() => {
                  speakArabic(item.title);
                  if (item.action) item.action();
                }}
              >
                {/* Clean Solid Icon */}
                <div className="relative mb-6 z-10 flex flex-col items-center justify-center">
                  <div className="text-7xl md:text-8xl relative z-10 drop-shadow-md">
                    {item.icon}
                  </div>
                </div>
                
                {/* Text Badge */}
                <div className="mt-auto flex flex-col items-center w-full z-10 relative">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-black/60 mb-1 drop-shadow-sm">
                    {item.englishTitle}
                  </span>
                  <div 
                    className="w-full bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-[20px] z-10 border-[3px] border-white flex items-center justify-center shadow-md"
                  >
                    <h3 className={`text-[13px] md:text-[16px] font-black ${item.color} text-center leading-tight drop-shadow-sm`}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
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
      <div 
        className="relative rounded-[40px] p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-[6px] border-white/60 overflow-hidden shadow-xl"
        style={{ 
          background: activeClay?.bgGradient || 'linear-gradient(135deg, #e0c3fc, #8ec5fc)'
        }}
      >
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 z-10 w-full">
          <button 
            onClick={onBackToCategories}
            className="w-14 h-14 rounded-full bg-white border-[4px] border-white shadow-md flex items-center justify-center text-gray-600 hover:scale-110 active:scale-95 transition-transform self-start sm:self-center shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
          
          <div className="text-center sm:text-right flex-1">
            <span className={`inline-block text-xs font-black bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full mb-3 shadow-inner ${activeClay?.color}`}>
              {activeClay?.englishTitle}
            </span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-3 drop-shadow-md ${activeClay?.color}`}>
              <span>{activeClay?.icon}</span> {' '} {activeClay?.title}
            </h2>
            <p className="text-gray-800 font-bold text-sm sm:text-lg max-w-2xl bg-white/85 backdrop-blur-md rounded-[20px] p-3 inline-block shadow-sm border-2 border-white">
              اختر لعبة من هذه المجموعة للبدء في المغامرة!
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Games for this category - Zero Lag */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 pb-16">
        {categoryGames.map((game) => {
          return (
            <div
              key={game.id}
              className="relative flex flex-col items-center text-center p-5 bg-white/95 backdrop-blur-md rounded-[40px] border-[5px] border-white cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-lg"
              onClick={() => onSelectGame(game.id)}
            >
              <div className="relative z-10 w-20 h-20 bg-gray-50 rounded-full border-[4px] border-white shadow-inner flex items-center justify-center text-5xl mb-4">
                <div style={{ filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.15))' }}>
                  {game.emoji}
                </div>
                <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full border-[3px] border-white flex items-center justify-center text-xl shadow-md">
                  {game.characterEmoji}
                </div>
              </div>

              <div className="relative z-10 flex flex-col flex-1 w-full items-center">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 shadow-inner mb-3 border border-white">
                  {game.badge}
                </span>
                
                <h3 className="text-lg sm:text-xl font-black text-gray-800 mb-2 drop-shadow-sm leading-tight">
                  {game.gameName}
                </h3>
                
                <p className="text-gray-500 font-bold text-[10px] sm:text-xs leading-relaxed mb-5 px-1 line-clamp-2">
                  {game.quest}
                </p>

                <div
                  className="mt-auto w-full py-2.5 rounded-[20px] text-sm font-black shadow-md flex items-center justify-center gap-1.5 transition-transform"
                  style={{
                    background: activeClay?.bgGradient || '#f0f0f0',
                    color: activeClay?.color || '#333'
                  }}
                >
                  <Play className="w-5 h-5 fill-current relative z-10" />
                  <span className="relative z-10">{game.id === 'quran' ? 'احفظ الآن!' : 'ابدأ اللعب!'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
