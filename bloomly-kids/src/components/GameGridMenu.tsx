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
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          {/* Tractor body */}
          <rect x="25" y="40" width="40" height="30" rx="6" fill="#10B981" stroke="#fff" strokeWidth="4" />
          <rect x="45" y="25" width="20" height="20" rx="4" fill="#60A5FA" stroke="#fff" strokeWidth="4" />
          {/* Chimney */}
          <rect x="30" y="20" width="6" height="20" fill="#374151" stroke="#fff" strokeWidth="2" />
          {/* Wheels */}
          <circle cx="32" cy="70" r="14" fill="#1F2937" stroke="#fff" strokeWidth="4" className="animate-spin-wheel" />
          <circle cx="32" cy="70" r="6" fill="#FBBF24" />
          <circle cx="62" cy="70" r="10" fill="#1F2937" stroke="#fff" strokeWidth="4" className="animate-spin-wheel" />
          <circle cx="62" cy="70" r="4" fill="#FBBF24" />
        </svg>
      );
    case 'island_map':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float">
          {/* Map outline */}
          <rect x="15" y="20" width="70" height="60" rx="12" fill="#FDE047" stroke="#fff" strokeWidth="4" />
          {/* Island path */}
          <path d="M25 50 Q 50 30, 75 50" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="6,6" strokeLinecap="round" />
          {/* Flag marker */}
          <polygon points="70,30 85,37 70,44" fill="#EF4444" stroke="#fff" strokeWidth="2" />
          <line x1="70" y1="30" x2="70" y2="55" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
          <circle cx="25" cy="50" r="6" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case 'stories':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          <rect x="15" y="20" width="70" height="64" rx="10" fill="#6366F1" stroke="#fff" strokeWidth="4" />
          <path d="M50 20 V84" stroke="#fff" strokeWidth="4" />
          {/* Story lines */}
          <line x1="25" y1="35" x2="42" y2="35" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="25" y1="50" x2="42" y2="50" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="58" y1="35" x2="75" y2="35" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="58" y1="50" x2="75" y2="50" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="33" cy="65" r="4" fill="#FBBF24" />
          <circle cx="67" cy="65" r="4" fill="#FBBF24" />
        </svg>
      );
    case 'math':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <g className="animate-float">
            <rect x="12" y="30" width="30" height="30" rx="8" fill="#EF4444" stroke="#fff" strokeWidth="4" />
            <text x="27" y="52" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="sans-serif">1</text>
          </g>
          <g className="animate-float" style={{ animationDelay: '0.5s' }}>
            <rect x="58" y="30" width="30" height="30" rx="8" fill="#3B82F6" stroke="#fff" strokeWidth="4" />
            <text x="73" y="52" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="sans-serif">+</text>
          </g>
          <g className="animate-float" style={{ animationDelay: '1s' }}>
            <rect x="35" y="58" width="30" height="30" rx="8" fill="#10B981" stroke="#fff" strokeWidth="4" />
            <text x="50" y="80" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="sans-serif">2</text>
          </g>
        </svg>
      );
    case 'arabic':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          {/* Book */}
          <rect x="15" y="35" width="70" height="50" rx="8" fill="#F59E0B" stroke="#fff" strokeWidth="4" />
          <path d="M50 35 V85" stroke="#fff" strokeWidth="3" />
          {/* Arabic Letter */}
          <text x="32" y="70" fontSize="32" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="sans-serif">أ</text>
          {/* Animated Writing Pencil */}
          <g className="animate-write" style={{ transformOrigin: '70px 30px' }}>
            <path d="M60 45 L78 20 L84 26 L66 51 Z" fill="#EF4444" stroke="#fff" strokeWidth="3" />
            <polygon points="60,45 56,49 61,51" fill="#FCD34D" stroke="#fff" strokeWidth="1.5" />
          </g>
        </svg>
      );
    case 'quran':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-glow">
          {/* Kaaba base */}
          <rect x="22" y="25" width="56" height="56" rx="10" fill="#111827" stroke="#fff" strokeWidth="4.5" />
          {/* Kiswah gold band */}
          <rect x="22" y="40" width="56" height="10" fill="#FBBF24" />
          {/* Golden Gate */}
          <rect x="42" y="55" width="16" height="26" fill="#FBBF24" stroke="#fff" strokeWidth="2.5" rx="3" />
          <line x1="50" y1="55" x2="50" y2="81" stroke="#fff" strokeWidth="1.5" />
        </svg>
      );
    case 'english':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <g className="animate-float">
            <circle cx="32" cy="40" r="16" fill="#EC4899" stroke="#fff" strokeWidth="3.5" />
            <text x="32" y="49" fontSize="20" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="sans-serif">A</text>
          </g>
          <g className="animate-float" style={{ animationDelay: '0.4s' }}>
            <circle cx="68" cy="40" r="16" fill="#8B5CF6" stroke="#fff" strokeWidth="3.5" />
            <text x="68" y="49" fontSize="20" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="sans-serif">B</text>
          </g>
          <g className="animate-float" style={{ animationDelay: '0.8s' }}>
            <circle cx="50" cy="72" r="16" fill="#06B6D4" stroke="#fff" strokeWidth="3.5" />
            <text x="50" y="81" fontSize="20" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="sans-serif">C</text>
          </g>
        </svg>
      );
    case 'fun_games':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          {/* Balloon 1 */}
          <g className="animate-float" style={{ animationDelay: '0.2s' }}>
            <circle cx="35" cy="42" r="15" fill="#EF4444" stroke="#fff" strokeWidth="3" />
            <path d="M35 57 L35 75" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Balloon 2 */}
          <g className="animate-float" style={{ animationDelay: '0.7s' }}>
            <circle cx="65" cy="38" r="15" fill="#10B981" stroke="#fff" strokeWidth="3" />
            <path d="M65 53 L65 75" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Star symbol */}
          <polygon points="50,15 53,24 62,24 55,29 57,38 50,32 43,38 45,29 38,24 47,24" fill="#FBBF24" className="animate-glow" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          {/* Steam rising */}
          <path d="M42 22 Q45 15, 42 8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" className="animate-steam-1" />
          <path d="M58 22 Q61 15, 58 8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" className="animate-steam-2" />
          {/* Pot body */}
          <rect x="25" y="42" width="50" height="32" rx="8" fill="#F43F5E" stroke="#fff" strokeWidth="4" />
          {/* Pot handles */}
          <rect x="17" y="48" width="8" height="12" rx="4" fill="#9F1239" stroke="#fff" strokeWidth="2" />
          <rect x="75" y="48" width="8" height="12" rx="4" fill="#9F1239" stroke="#fff" strokeWidth="2" />
          {/* Pot lid */}
          <path d="M22 42 H78 L70 30 H30 Z" fill="#FDA4AF" stroke="#fff" strokeWidth="4" />
          <circle cx="50" cy="26" r="6" fill="#F43F5E" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case 'coloring':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          {/* Paint palette */}
          <path d="M20 70 C 10 50, 15 20, 48 20 C 68 20, 85 35, 82 62 C 79 78, 45 88, 20 70 Z" fill="#F59E0B" stroke="#fff" strokeWidth="4.5" className="animate-float-slow" />
          {/* Paint spots */}
          <circle cx="34" cy="38" r="6" fill="#EF4444" />
          <circle cx="52" cy="32" r="6" fill="#3B82F6" />
          <circle cx="66" cy="46" r="6" fill="#10B981" />
          <circle cx="48" cy="62" r="6" fill="#EC4899" />
          {/* Animated Brush */}
          <g className="animate-brush">
            <path d="M20 80 L35 55 L45 65 Z" fill="#FDE047" stroke="#fff" strokeWidth="3" />
            <path d="M15 85 L22 78 L25 82 Z" fill="#6B7280" />
          </g>
        </svg>
      );
    case 'habits':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          {/* Tooth */}
          <path d="M30 45 C 30 25, 70 25, 70 45 C 70 65, 60 75, 60 85 H 40 C 40 75, 30 65, 30 45 Z" fill="#E2E8F0" stroke="#fff" strokeWidth="4.5" className="animate-float" />
          <circle cx="44" cy="45" r="4" fill="#4B5563" />
          <circle cx="56" cy="45" r="4" fill="#4B5563" />
          <path d="M44 60 Q50 66, 56 60" fill="none" stroke="#4B5563" strokeWidth="3.5" strokeLinecap="round" />
          {/* Animated Toothbrush scrubbing */}
          <g className="animate-scrub" style={{ transformOrigin: '70px 50px' }}>
            <rect x="25" y="32" width="50" height="8" rx="3" fill="#38BDF8" stroke="#fff" strokeWidth="3" />
            <rect x="25" y="24" width="16" height="8" rx="2" fill="#fff" />
          </g>
        </svg>
      );
    case 'iq':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          {/* Bohr atom center */}
          <circle cx="50" cy="50" r="14" fill="#EF4444" stroke="#fff" strokeWidth="4.5" className="animate-float" />
          {/* Electron orbit rings */}
          <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#3B82F6" strokeWidth="3.5" className="animate-orbit" />
          <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#10B981" strokeWidth="3.5" className="animate-orbit-rev" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#F59E0B" strokeWidth="3.5" className="animate-orbit" transform="rotate(-60 50 50)" />
          {/* Electron particles */}
          <circle cx="14" cy="50" r="5" fill="#FBBF24" stroke="#fff" strokeWidth="2.5" />
          <circle cx="86" cy="50" r="5" fill="#FBBF24" stroke="#fff" strokeWidth="2.5" />
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
        
        {/* Dynamic CSS Keyframe Animations Injected directly */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes write {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(8px, -4px) rotate(-15deg); }
          }
          @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-6px) scale(1.05); }
          }
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-4px) rotate(3deg); }
          }
          @keyframes pulseGlow {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.6)); }
            50% { filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.95)); }
          }
          @keyframes scrub {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-8px, 4px) rotate(-12deg); }
          }
          @keyframes spinWheel {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes brushStroke {
            0%, 100% { transform: rotate(0deg) translate(0, 0); }
            50% { transform: rotate(15deg) translate(4px, -4px); }
          }
          @keyframes steamRise {
            0% { transform: translateY(4px) scale(0.9); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-12px) scale(1.1); opacity: 0; }
          }
          .animate-write { animation: write 2s ease-in-out infinite; }
          .animate-orbit { animation: orbit 5s linear infinite; transform-origin: 50px 50px; }
          .animate-orbit-rev { animation: orbit 7s linear infinite reverse; transform-origin: 50px 50px; }
          .animate-float { animation: float 2.5s ease-in-out infinite; }
          .animate-float-slow { animation: floatSlow 3s ease-in-out infinite; }
          .animate-glow { animation: pulseGlow 2s ease-in-out infinite; }
          .animate-scrub { animation: scrub 1.6s ease-in-out infinite; }
          .animate-spin-wheel { animation: spinWheel 4s linear infinite; transform-origin: center; }
          .animate-brush { animation: brushStroke 1.8s ease-in-out infinite; transform-origin: 25px 75px; }
          .animate-steam-1 { animation: steamRise 2s infinite; }
          .animate-steam-2 { animation: steamRise 2s infinite 0.7s; }
        `}} />

        {/* Top Header Navigation Panel */}
        <div className="flex justify-between items-center mb-6 mt-6 w-full max-w-6xl mx-auto px-4 z-50">
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

        {/* Mascot Sprout Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 mt-2 max-w-2xl px-6 text-center sm:text-right relative z-30">
          <div className="w-36 h-36 bg-white/80 rounded-full border-[5px] border-white shadow-xl flex items-center justify-center overflow-hidden">
            <SproutMascot className="w-[120px] h-[120px]" state="talking" />
          </div>
          <div className="relative bg-white border-[5px] border-[#4D2B82] p-5 rounded-[30px] shadow-[0_8px_0_0_#4D2B82] max-w-sm">
            <span className="text-[#4D2B82] font-black text-lg block leading-snug">
              أهلاً بك يا بطل في مغامرات بلومي! اختر بوابة لتبدأ اللعب والمرح! 🌟🦁
            </span>
            <div className="hidden sm:block absolute top-1/2 -left-3 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-[#4D2B82]" />
          </div>
        </div>

        {/* Categories Grid */}
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
                <div className="relative mb-6 z-10 flex flex-col items-center justify-center">
                  {render3DIcon(item.id)}
                </div>
                
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

  const currentCategory = categoriesData.find(c => c.id === activeCategory);
  const categoryGames = islandsData.filter(game => currentCategory?.games.includes(game.id));
  const activeClay = clayItems.find(c => c.id === activeCategory);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-8 relative z-10 min-h-screen bg-transparent justify-start">
      
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
