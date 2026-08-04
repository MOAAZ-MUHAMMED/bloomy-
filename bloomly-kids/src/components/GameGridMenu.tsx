import React from 'react';
import { Play, ArrowRight, Shield, Info } from 'lucide-react';
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

const render3DIcon = (id: string) => {
  switch (id) {
    case 'farm':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <rect x="15" y="45" width="70" height="40" rx="10" fill="#E879F9" stroke="#fff" strokeWidth="4" />
          <polygon points="10,45 50,15 90,45" fill="#EF4444" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
          <rect x="40" y="55" width="20" height="30" fill="#FCD34D" stroke="#fff" strokeWidth="3" />
          <circle cx="30" cy="30" r="6" fill="#FBBF24" />
          <rect x="70" y="60" width="10" height="15" fill="#3B82F6" rx="2" />
        </svg>
      );
    case 'island_map':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <path d="M10 80 Q 20 20, 50 10 T 90 80 Z" fill="#60A5FA" stroke="#fff" strokeWidth="4" />
          <circle cx="30" cy="50" r="12" fill="#34D399" stroke="#fff" strokeWidth="3" />
          <circle cx="70" cy="60" r="8" fill="#FBBF24" stroke="#fff" strokeWidth="3" />
          <path d="M40 75 Q 50 65, 60 75" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="4,4" />
        </svg>
      );
    case 'stories':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <rect x="15" y="15" width="70" height="70" rx="10" fill="#3B82F6" stroke="#fff" strokeWidth="4" />
          <rect x="25" y="15" width="50" height="70" fill="#60A5FA" />
          <line x1="35" y1="30" x2="65" y2="30" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <line x1="35" y1="45" x2="65" y2="45" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <line x1="35" y1="60" x2="55" y2="60" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'math':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <rect x="15" y="15" width="30" height="30" rx="6" fill="#F87171" stroke="#fff" strokeWidth="3" />
          <text x="30" y="38" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle">1</text>
          <rect x="55" y="15" width="30" height="30" rx="6" fill="#60A5FA" stroke="#fff" strokeWidth="3" />
          <text x="70" y="38" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle">+</text>
          <rect x="35" y="55" width="30" height="30" rx="6" fill="#34D399" stroke="#fff" strokeWidth="3" />
          <text x="50" y="78" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle">2</text>
        </svg>
      );
    case 'arabic':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <circle cx="50" cy="50" r="35" fill="#F59E0B" stroke="#fff" strokeWidth="4" />
          <text x="50" y="65" fontSize="48" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="sans-serif">أ</text>
        </svg>
      );
    case 'quran':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <rect x="20" y="25" width="60" height="60" rx="10" fill="#111827" stroke="#fff" strokeWidth="4" />
          <rect x="20" y="40" width="60" height="10" fill="#FBBF24" />
          <line x1="50" y1="50" x2="50" y2="85" stroke="#FBBF24" strokeWidth="6" />
        </svg>
      );
    case 'english':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <circle cx="50" cy="50" r="35" fill="#EC4899" stroke="#fff" strokeWidth="4" />
          <text x="50" y="62" fontSize="36" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="sans-serif">ABC</text>
        </svg>
      );
    case 'fun_games':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <rect x="20" y="30" width="60" height="45" rx="10" fill="#EF4444" stroke="#fff" strokeWidth="4" />
          <circle cx="35" cy="52" r="8" fill="#FDE047" stroke="#fff" strokeWidth="3" />
          <circle cx="65" cy="52" r="8" fill="#60A5FA" stroke="#fff" strokeWidth="3" />
          <rect x="42" y="45" width="16" height="16" rx="2" fill="#fff" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <circle cx="50" cy="55" r="30" fill="#10B981" stroke="#fff" strokeWidth="4" />
          <path d="M30 40 Q 50 10, 70 40 Z" fill="#EF4444" stroke="#fff" strokeWidth="4" />
          <rect x="25" y="36" width="50" height="8" rx="4" fill="#FCD34D" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case 'coloring':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <path d="M20 70 C 10 50, 20 20, 50 20 C 70 20, 85 40, 80 65 C 75 80, 40 90, 20 70 Z" fill="#FCD34D" stroke="#fff" strokeWidth="4" />
          <circle cx="35" cy="40" r="6" fill="#EF4444" />
          <circle cx="55" cy="35" r="6" fill="#3B82F6" />
          <circle cx="65" cy="52" r="6" fill="#10B981" />
          <circle cx="45" cy="65" r="6" fill="#A855F7" />
        </svg>
      );
    case 'habits':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <circle cx="50" cy="50" r="35" fill="#38BDF8" stroke="#fff" strokeWidth="4" />
          <circle cx="38" cy="45" r="10" fill="#E2E8F0" />
          <circle cx="62" cy="45" r="10" fill="#E2E8F0" />
          <path d="M40 65 Q 50 75, 60 65" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'iq':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <path d="M30 40 C 25 15, 75 15, 70 40 C 65 55, 55 60, 55 70 H 45 C 45 60, 35 55, 30 40 Z" fill="#A855F7" stroke="#fff" strokeWidth="4" />
          <rect x="42" y="75" width="16" height="10" rx="3" fill="#FCD34D" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    default:
      return <span>❓</span>;
  }
};

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

  // 12 Premium 3D clay items to match the mockup completely
  const clayItems = [
    { id: 'farm', title: 'مزرعتي السحرية', englishTitle: 'MY FARM', action: () => onSelectCategory?.('farm'), bgGradient: 'from-[#A7F3D0] to-[#047857]', color: 'text-emerald-950', shadowColor: '#065f46' },
    { id: 'island_map', title: 'خريطة المغامرة', englishTitle: 'ADVENTURE MAP', action: onOpenMap, bgGradient: 'from-[#BAE6FD] to-[#0369A1]', color: 'text-sky-950', shadowColor: '#075985' },
    { id: 'stories', title: 'هيا نقرأ', englishTitle: 'LET\'S READ', action: () => onSelectGame('stories'), bgGradient: 'from-[#C7D2FE] to-[#4338CA]', color: 'text-indigo-950', shadowColor: '#3730a3' },
    { id: 'math', title: 'أرقام وحساب', englishTitle: 'MATH', action: () => onSelectCategory?.('math'), bgGradient: 'from-[#FDE68A] to-[#D97706]', color: 'text-amber-950', shadowColor: '#b45309' },
    { id: 'arabic', title: 'حروفي العربية', englishTitle: 'ARABIC', action: () => onSelectCategory?.('arabic'), bgGradient: 'from-[#FED7AA] to-[#C2410C]', color: 'text-orange-950', shadowColor: '#9a3412' },
    { id: 'quran', title: 'جزيرة القرآن', englishTitle: 'QURAN', action: () => onSelectGame('quran'), bgGradient: 'from-[#D1FAE5] to-[#065F46]', color: 'text-emerald-900', shadowColor: '#064e3b' },
    { id: 'english', title: 'حروفي الإنجليزية', englishTitle: 'ENGLISH', action: () => onSelectCategory?.('english'), bgGradient: 'from-[#FBCFE8] to-[#BE185D]', color: 'text-pink-950', shadowColor: '#9d174d' },
    { id: 'fun_games', title: 'ألعاب ومرح', englishTitle: 'FUN GAMES', action: () => onSelectCategory?.('fun_games'), bgGradient: 'from-[#DDD6FE] to-[#6D28D9]', color: 'text-violet-950', shadowColor: '#5b21b6' },
    { id: 'kitchen', title: 'المطبخ الصغير', englishTitle: 'KITCHEN', action: () => onSelectCategory?.('kitchen'), bgGradient: 'from-[#FECDD3] to-[#BE123C]', color: 'text-rose-950', shadowColor: '#9f1239' },
    { id: 'coloring', title: 'لوّن وارسم', englishTitle: 'COLORING', action: () => onSelectCategory?.('coloring'), bgGradient: 'from-[#A7F3D0] to-[#0D9488]', color: 'text-teal-950', shadowColor: '#115e59' },
    { id: 'habits', title: 'عادات صحية', englishTitle: 'HABITS', action: () => onSelectGame('dailyHabits'), bgGradient: 'from-[#E0F2FE] to-[#0284C7]', color: 'text-sky-900', shadowColor: '#075985' },
    { id: 'iq', title: 'ألعاب الذكاء', englishTitle: 'IQ GAMES', action: () => onSelectCategory?.('iq'), bgGradient: 'from-[#FBCFE8] to-[#7C3AED]', color: 'text-purple-950', shadowColor: '#6d28d9' }
  ];

  if (!activeCategory) {
    return (
      <div className="flex flex-col w-full min-h-screen relative z-10 select-none overflow-x-hidden justify-start items-center bg-transparent">
        
        {/* Top Header Navigation Panel */}
        <div className="flex justify-between items-center mb-6 mt-6 w-full max-w-6xl mx-auto px-4 z-50">
          {/* Left: Coins / Stars Counter */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md p-2.5 pr-5 rounded-[32px] border-[5px] border-white shadow-lg">
            <div className="w-14 h-14 rounded-full overflow-hidden border-[3px] border-white bg-white shadow-inner relative flex items-center justify-center text-4xl">
              🦁
            </div>
            <div className="text-right text-[#4D2B82]">
              <h3 className="text-sm font-black drop-shadow-sm">
                {childProfile?.name || 'البطل السحري'}
              </h3>
              <span className="text-[11px] font-bold text-white bg-[#4D2B82]/90 px-3 py-0.5 rounded-full shadow-inner block mt-1">
                {childProfile?.age ? `${childProfile.age} سنوات` : '٥ سنوات'}
              </span>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-sm px-4 py-2.5 rounded-full flex items-center gap-1.5 border-[3px] border-white shadow-md ml-2 mr-3 relative overflow-hidden">
              <span className="text-lg drop-shadow-md">⭐</span>
              <span className="pl-1 drop-shadow-sm">{globalStars}</span>
            </div>
          </div>

          {/* Right: Premium Separated Header Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onOpenParents}
              className="w-16 h-16 rounded-[22px] bg-gradient-to-b from-blue-400 to-blue-600 border-[4px] border-white/95 shadow-[0_6px_0_0_#1d4ed8,_inset_0_2px_0_rgba(255,255,255,0.4)] flex items-center justify-center text-white cursor-pointer hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_0_#1d4ed8] transition-all"
            >
              <Shield className="w-8 h-8" />
            </button>
            <button
              onClick={onOpenAbout}
              className="w-16 h-16 rounded-[22px] bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 border-[4px] border-white/95 shadow-[0_6px_0_0_#86198f,_inset_0_2px_0_rgba(255,255,255,0.4)] flex items-center justify-center text-white cursor-pointer hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_0_#86198f] transition-all"
            >
              <Info className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Mascot Character Sprout (برعم) Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 mt-2 max-w-2xl px-6 text-center sm:text-right relative z-30">
          <div className="w-36 h-36 bg-white/80 rounded-full border-[5px] border-white shadow-xl flex items-center justify-center overflow-hidden">
            <SproutMascot className="w-[120px] h-[120px]" state="talking" />
          </div>
          <div className="relative bg-white border-[5px] border-[#4D2B82] p-5 rounded-[30px] shadow-[0_8px_0_0_#4D2B82] max-w-sm">
            <span className="text-[#4D2B82] font-black text-lg block leading-snug">
              أهلاً بك يا بطل في مغامرات بلومي! اختر بوابة لتبدأ اللعب والمرح! 🌟🦁
            </span>
            {/* Spech bubble arrow */}
            <div className="hidden sm:block absolute top-1/2 -left-3 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-[#4D2B82]" />
          </div>
        </div>

        {/* Crisp Symmetrical 3D Toy-Style Grid */}
        <div className="w-full max-w-6xl mx-auto px-4 pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 auto-rows-fr relative">
          {clayItems.map((item) => {
            return (
              <div
                key={item.id}
                className="relative cursor-pointer flex flex-col items-center justify-center p-6 md:p-8 rounded-[40px] border-[6px] border-white/95 transition-all hover:scale-105 active:translate-y-1 w-full aspect-[4/5] md:aspect-square overflow-hidden bg-gradient-to-b"
                style={{
                  backgroundImage: `linear-gradient(to bottom, ${item.bgGradient.split(' ')[1]}, ${item.bgGradient.split(' ')[3]})`,
                  boxShadow: `0 12px 0 0 ${item.shadowColor}, inset 0 4px 0 rgba(255,255,255,0.4)`
                }}
                onClick={() => {
                  speakArabic(item.title);
                  if (item.action) item.action();
                }}
              >
                {/* 3D Inline SVG Icon */}
                <div className="relative mb-6 z-10 flex flex-col items-center justify-center">
                  {render3DIcon(item.id)}
                </div>
                
                {/* Bottom Text Badge */}
                <div className="mt-auto flex flex-col items-center w-full z-10 relative">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-1 drop-shadow-sm">
                    {item.englishTitle}
                  </span>
                  <div 
                    className="w-full bg-white px-3 py-2.5 rounded-[22px] z-10 border-[3px] border-white flex items-center justify-center shadow-md"
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
          background: activeClay ? `linear-gradient(to bottom, ${activeClay.bgGradient.split(' ')[1]}, ${activeClay.bgGradient.split(' ')[3]})` : 'linear-gradient(135deg, #e0c3fc, #8ec5fc)'
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
              <span>{activeClay ? render3DIcon(activeClay.id) : null}</span> {' '} {activeClay?.title}
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
                    background: activeClay ? `linear-gradient(to bottom, ${activeClay.bgGradient.split(' ')[1]}, ${activeClay.bgGradient.split(' ')[3]})` : '#f0f0f0',
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
