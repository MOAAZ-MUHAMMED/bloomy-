import React from 'react';
import { Play, ArrowRight, Shield, Info, Home, Menu } from 'lucide-react';
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
    case 'math':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          <circle cx="50" cy="50" r="42" fill="url(#mathGrad)" stroke="#fff" strokeWidth="4" />
          <path d="M 12 36 A 42 42 0 0 1 88 36 A 42 32 0 0 0 12 36 Z" fill="url(#glassShine)" opacity="0.65" />
          
          <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
            <circle cx="42" cy="56" r="15" fill="url(#appleRed)" stroke="#5c0606" strokeWidth="2" />
            <path d="M 42 41 Q 45 35, 41 32" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="37" cy="53" r="2.5" fill="#1e293b" />
            <circle cx="47" cy="53" r="2.5" fill="#1e293b" />
            <ellipse cx="33" cy="57" rx="3" ry="1.5" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="51" cy="57" rx="3" ry="1.5" fill="#f43f5e" opacity="0.6" />
            <path d="M 39 59 Q 42 62, 45 59" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          <g className="animate-float" style={{ animationDelay: '0.4s' }}>
            <text x="74" y="38" fontSize="22" fontWeight="950" fill="#2563eb" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" fontFamily="sans-serif">1</text>
          </g>
          <g className="animate-float" style={{ animationDelay: '0.9s' }}>
            <text x="78" y="68" fontSize="20" fontWeight="950" fill="#16a34a" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" fontFamily="sans-serif">2</text>
          </g>
          <g className="animate-float" style={{ animationDelay: '1.4s' }}>
            <text x="22" y="38" fontSize="24" fontWeight="950" fill="#ea580c" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" fontFamily="sans-serif">+</text>
          </g>

          <defs>
            <linearGradient id="mathGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="appleRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="glassShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'quran':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-glow">
          <circle cx="50" cy="50" r="42" fill="url(#quranGrad)" stroke="#fff" strokeWidth="4" />
          <path d="M 12 36 A 42 42 0 0 1 88 36 A 42 32 0 0 0 12 36 Z" fill="url(#glassShine)" opacity="0.65" />

          <g className="animate-float-slow">
            <path d="M 68 18 A 12 12 0 1 0 74 38 A 15 15 0 1 1 68 18" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
            <path d="M 28 64 L 72 64 L 64 74 L 36 74 Z" fill="#d97706" stroke="#451a03" strokeWidth="2.5" />
            <path d="M 32 50 L 50 64 L 68 50 L 60 44 L 50 52 L 40 44 Z" fill="#b45309" stroke="#451a03" strokeWidth="2" />
            <path d="M 33 48 C 42 48, 48 56, 50 56 C 52 56, 58 48, 67 48 L 65 38 C 58 38, 52 45, 50 45 C 48 45, 42 38, 35 38 Z" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
            <path d="M 38 42 H 45 M 39 45 H 44 M 56 42 H 63 M 55 45 H 61" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          
          <defs>
            <linearGradient id="quranGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="glassShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'stories':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          <circle cx="50" cy="50" r="42" fill="url(#storiesGrad)" stroke="#fff" strokeWidth="4" />
          <path d="M 12 36 A 42 42 0 0 1 88 36 A 42 32 0 0 0 12 36 Z" fill="url(#glassShine)" opacity="0.65" />

          <g className="animate-float">
            <rect x="44" y="24" width="12" height="20" fill="#f472b6" stroke="#4c1d95" strokeWidth="2" />
            <polygon points="40,24 50,10 60,24" fill="#818cf8" stroke="#4c1d95" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="50" cy="30" r="2.5" fill="#fef08a" />
            
            <path d="M 28 62 L 72 62 L 66 52 L 34 52 Z" fill="#93c5fd" stroke="#4c1d95" strokeWidth="2" />
            <path d="M 24 52 Q 50 48, 76 52 L 72 42 Q 50 38, 28 42 Z" fill="#ffffff" stroke="#4c1d95" strokeWidth="2" />
          </g>

          <circle cx="32" cy="22" r="2" fill="#fff" className="animate-pulse" />
          <circle cx="68" cy="20" r="1.5" fill="#fff" className="animate-pulse" style={{ animationDelay: '0.5s' }} />

          <defs>
            <linearGradient id="storiesGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c7d2fe" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
            <linearGradient id="glassShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'coloring':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float">
          <circle cx="50" cy="50" r="42" fill="url(#coloringGrad)" stroke="#fff" strokeWidth="4" />
          <path d="M 12 36 A 42 42 0 0 1 88 36 A 42 32 0 0 0 12 36 Z" fill="url(#glassShine)" opacity="0.65" />

          <g className="animate-float-slow">
            <path d="M 28 66 C 22 55, 26 36, 48 34 C 64 32, 76 42, 74 58 C 72 70, 52 76, 28 66 Z" fill="#fcd34d" stroke="#78350f" strokeWidth="2" />
            <circle cx="36" cy="46" r="3.5" fill="#ef4444" />
            <circle cx="48" cy="42" r="3.5" fill="#3b82f6" />
            <circle cx="60" cy="48" r="3.5" fill="#2ecc71" />
            <circle cx="58" cy="58" r="3.5" fill="#ec4899" />
            
            <ellipse cx="38" cy="58" rx="3" ry="4" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />

            <g className="animate-brush">
              <path d="M 72 30 L 32 70 L 38 76 L 78 36 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
              <rect x="67" y="30" width="8" height="6" fill="#cbd5e1" stroke="#78350f" strokeWidth="1.5" transform="rotate(-45 71 33)" />
              <path d="M 74 24 C 74 24, 79 30, 77 33 C 75 36, 71 33, 71 33 Z" fill="#ef4444" stroke="#78350f" strokeWidth="1.5" />
            </g>
          </g>

          <defs>
            <linearGradient id="coloringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="glassShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'english':
    case 'spellingEn':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          <circle cx="50" cy="50" r="42" fill="url(#englishGrad)" stroke="#fff" strokeWidth="4" />
          <path d="M 12 36 A 42 42 0 0 1 88 36 A 42 32 0 0 0 12 36 Z" fill="url(#glassShine)" opacity="0.65" />

          <g className="animate-float">
            <text x="32" y="44" fontSize="24" fontWeight="950" fill="#ec4899" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" fontFamily="Outfit, Inter, sans-serif" textAnchor="middle">A</text>
          </g>
          <g className="animate-float" style={{ animationDelay: '0.4s' }}>
            <text x="68" y="44" fontSize="24" fontWeight="950" fill="#8b5cf6" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" fontFamily="Outfit, Inter, sans-serif" textAnchor="middle">B</text>
          </g>
          <g className="animate-float" style={{ animationDelay: '0.8s' }}>
            <text x="50" y="74" fontSize="24" fontWeight="950" fill="#06b6d4" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" fontFamily="Outfit, Inter, sans-serif" textAnchor="middle">C</text>
          </g>

          <defs>
            <linearGradient id="englishGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
            <linearGradient id="glassShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'farm':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          <rect x="15" y="45" width="70" height="40" rx="10" fill="#10B981" stroke="#fff" strokeWidth="4" />
          <polygon points="10,45 50,15 90,45" fill="#EF4444" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
          <rect x="40" y="55" width="20" height="30" fill="#FCD34D" stroke="#fff" strokeWidth="3" />
          <circle cx="30" cy="30" r="6" fill="#FBBF24" />
          <circle cx="32" cy="70" r="14" fill="#1F2937" stroke="#fff" strokeWidth="4" className="animate-spin-wheel" />
          <circle cx="32" cy="70" r="6" fill="#FBBF24" />
          <circle cx="62" cy="70" r="10" fill="#1F2937" stroke="#fff" strokeWidth="4" className="animate-spin-wheel" />
          <circle cx="62" cy="70" r="4" fill="#FBBF24" />
        </svg>
      );
    case 'island_map':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float">
          <rect x="15" y="20" width="70" height="60" rx="12" fill="#FDE047" stroke="#fff" strokeWidth="4" />
          <path d="M25 50 Q 50 30, 75 50" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="6,6" strokeLinecap="round" />
          <polygon points="70,30 85,37 70,44" fill="#EF4444" stroke="#fff" strokeWidth="2" />
          <line x1="70" y1="30" x2="70" y2="55" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
          <circle cx="25" cy="50" r="6" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case 'arabic':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          <circle cx="50" cy="50" r="42" fill="url(#arabicBadgeGrad)" stroke="#fff" strokeWidth="4.5" />
          <path d="M 25 35 H 75 L 70 75 H 30 Z" fill="#F59E0B" stroke="#5c2e0b" strokeWidth="3" />
          <path d="M50 35 V75" stroke="#fff" strokeWidth="2.5" />
          <text x="36" y="62" fontSize="26" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="sans-serif">أ</text>
          <text x="64" y="62" fontSize="26" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="sans-serif">ب</text>
          <defs>
            <linearGradient id="arabicBadgeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'fun_games':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <g className="animate-float" style={{ animationDelay: '0.2s' }}>
            <circle cx="35" cy="42" r="15" fill="#EF4444" stroke="#fff" strokeWidth="3" />
            <path d="M35 57 L35 75" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="animate-float" style={{ animationDelay: '0.7s' }}>
            <circle cx="65" cy="38" r="15" fill="#10B981" stroke="#fff" strokeWidth="3" />
            <path d="M65 53 L65 75" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </g>
          <polygon points="50,15 53,24 62,24 55,29 57,38 50,32 43,38 45,29 38,24 47,24" fill="#FBBF24" className="animate-glow" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float-slow">
          <path d="M42 22 Q45 15, 42 8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" className="animate-steam-1" />
          <path d="M58 22 Q61 15, 58 8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" className="animate-steam-2" />
          <rect x="25" y="42" width="50" height="32" rx="8" fill="#F43F5E" stroke="#fff" strokeWidth="4" />
          <rect x="17" y="48" width="8" height="12" rx="4" fill="#9F1239" stroke="#fff" strokeWidth="2" />
          <rect x="75" y="48" width="8" height="12" rx="4" fill="#9F1239" stroke="#fff" strokeWidth="2" />
          <path d="M22 42 H78 L70 30 H30 Z" fill="#FDA4AF" stroke="#fff" strokeWidth="4" />
          <circle cx="50" cy="26" r="6" fill="#F43F5E" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case 'habits':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <circle cx="50" cy="50" r="35" fill="#38BDF8" stroke="#fff" strokeWidth="4.5" className="animate-float" />
          <circle cx="38" cy="45" r="10" fill="#E2E8F0" />
          <circle cx="62" cy="45" r="10" fill="#E2E8F0" />
          <path d="M40 65 Q50 75, 60 65" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          <g className="animate-scrub" style={{ transformOrigin: '70px 50px' }}>
            <rect x="25" y="32" width="50" height="8" rx="3" fill="#38BDF8" stroke="#fff" strokeWidth="3" />
            <rect x="25" y="24" width="16" height="8" rx="2" fill="#fff" />
          </g>
        </svg>
      );
    case 'iq':
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md">
          <circle cx="50" cy="50" r="14" fill="#EF4444" stroke="#fff" strokeWidth="4.5" className="animate-float" />
          <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#3B82F6" strokeWidth="3.5" className="animate-orbit" />
          <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#10B981" strokeWidth="3.5" className="animate-orbit-rev" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#F59E0B" strokeWidth="3.5" className="animate-orbit" transform="rotate(-60 50 50)" />
          <circle cx="14" cy="50" r="5" fill="#FBBF24" stroke="#fff" strokeWidth="2.5" />
          <circle cx="86" cy="50" r="5" fill="#FBBF24" stroke="#fff" strokeWidth="2.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md animate-float">
          <polygon points="50,15 63,40 90,42 70,60 76,87 50,72 24,87 30,60 10,42 37,40" fill="url(#starLogoGrad)" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="43" cy="50" r="3" fill="#1e293b" />
          <circle cx="57" cy="50" r="3" fill="#1e293b" />
          <path d="M 46 58 Q 50 62, 54 58" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="starLogoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      );
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
  // Capacitor landscape orientation lock/unlock logic
  React.useEffect(() => {
    if (activeCategory) {
      try {
        if ((window as any).Capacitor && (window as any).Capacitor.Plugins && (window as any).Capacitor.Plugins.ScreenOrientation) {
          (window as any).Capacitor.Plugins.ScreenOrientation.lock({ orientation: 'landscape' });
        } else if (screen.orientation && (screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch (e) {
        console.log("Capacitor lock failed:", e);
      }
    } else {
      try {
        if ((window as any).Capacitor && (window as any).Capacitor.Plugins && (window as any).Capacitor.Plugins.ScreenOrientation) {
          (window as any).Capacitor.Plugins.ScreenOrientation.lock({ orientation: 'portrait' });
        } else if (screen.orientation && (screen.orientation as any).unlock) {
          screen.orientation.unlock();
        }
      } catch (e) {
        console.log("Capacitor unlock failed:", e);
      }
    }
  }, [activeCategory]);

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
    { id: 'quran', title: 'الدين القيم والقرآن', englishTitle: 'DIN & QURAN', action: () => onSelectGame('quran'), bgGradient: 'from-[#FFE4E6] to-[#BE123C]', color: 'text-rose-950', shadowColor: '#9f1239' },
    { id: 'english', title: 'حروفي الإنجليزية', englishTitle: 'ENGLISH', action: () => onSelectCategory?.('english'), bgGradient: 'from-[#FBCFE8] to-[#BE185D]', color: 'text-pink-950', shadowColor: '#9d174d' },
    { id: 'fun_games', title: 'ألعاب ومرح', englishTitle: 'FUN GAMES', action: () => onSelectCategory?.('fun_games'), bgGradient: 'from-[#DDD6FE] to-[#6D28D9]', color: 'text-violet-950', shadowColor: '#5b21b6' },
    { id: 'kitchen', title: 'المطبخ الصغير', englishTitle: 'KITCHEN', action: () => onSelectCategory?.('kitchen'), bgGradient: 'from-[#FECDD3] to-[#BE123C]', color: 'text-rose-950', shadowColor: '#9f1239' },
    { id: 'coloring', title: 'لوّن وارسم', englishTitle: 'COLORING', action: () => onSelectCategory?.('coloring'), bgGradient: 'from-[#A7F3D0] to-[#0D9488]', color: 'text-teal-950', shadowColor: '#115e59' },
    { id: 'habits', title: 'عادات صحية', englishTitle: 'HABITS', action: () => onSelectGame('dailyHabits'), bgGradient: 'from-[#E0F2FE] to-[#0284C7]', color: 'text-sky-900', shadowColor: '#075985' },
    { id: 'iq', title: 'ألعاب الذكاء', englishTitle: 'IQ GAMES', action: () => onSelectCategory?.('iq'), bgGradient: 'from-[#FBCFE8] to-[#7C3AED]', color: 'text-purple-950', shadowColor: '#6d28d9' }
  ];

  const getSubcategories = (catId: string) => {
    switch (catId) {
      case 'arabic':
        return [
          { title: 'Phonemic Awareness (الوعي الفونيمي)', gameIds: ['arabicLetterTracing', 'arabicShadowMatch'] },
          { title: 'Knowledge of Books (معرفة المطبوعات)', gameIds: ['sorting', 'spelling'] }
        ];
      case 'english':
        return [
          { title: 'Phonemic Awareness (الوعي الصوتي)', gameIds: ['englishLetterTracing', 'spellingEn'] },
          { title: 'English Word Adventure (مغامرة الكلمات)', gameIds: ['englishSpaceDecoder', 'englishWordSafari'] }
        ];
      case 'math':
        return [
          { title: 'Numbers & Counting (الأرقام والعد السحري)', gameIds: ['mathNumberTrain', 'mathSpaceTower'] },
          { title: 'Math Operations (العمليات الحسابية والجمع)', gameIds: ['math', 'connectDots', 'mathHungryCrocodile'] }
        ];
      case 'fun_games':
        return [
          { title: 'Speed & Action (السرعة والنشاط اللانهائي)', gameIds: ['arrowRacer', 'tapRacer', 'ninja'] },
          { title: 'Safari & Catching (صيد النجوم والتركيز)', gameIds: ['safari', 'catcher', 'spaceCatcher', 'maze'] },
          { title: 'Fun & Adventure (المرح والمحاكاة)', gameIds: ['train', 'funWhackAMole', 'funHiddenCup'] }
        ];
      case 'kitchen':
        return [
          { title: 'Bloomly Chef (شيف بلومي الصغير)', gameIds: ['chef', 'kitchenPizzaMaker'] },
          { title: 'Market & Juices (العصائر والتسوق)', gameIds: ['kitchenJuiceBar', 'kitchenMarketList'] }
        ];
      case 'coloring':
        return [
          { title: 'Paint Workshop (ورشة الألوان السحرية)', gameIds: ['coloring', 'drawingSymmetry'] },
          { title: 'Neon Art (رسم النيون المضيء)', gameIds: ['drawingNeonArt'] }
        ];
      case 'iq':
        return [
          { title: 'Spot Differences (ألعاب الفروق والتفكير)', gameIds: ['iqSpotDifferences', 'spaceCatcher'] },
          { title: 'Logic Puzzles (الذكاء والمنطق)', gameIds: ['memory', 'iqOddOneOut', 'iqMissingPiece'] }
        ];
      default:
        const cat = categoriesData.find(c => c.id === catId);
        const games = cat ? cat.games : [];
        if (games.length <= 2) {
          return [{ title: 'Level 1 (المستوى الأول)', gameIds: games }];
        }
        const mid = Math.ceil(games.length / 2);
        return [
          { title: 'Level 1 (المستوى الأول)', gameIds: games.slice(0, mid) },
          { title: 'Level 2 (المستوى الثاني)', gameIds: games.slice(mid) }
        ];
    }
  };

  // View 1: 3D Category Selection Menu
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

  // View 2: Highly Polished Landscape Lamsa-Style Subcategories
  const currentCategory = categoriesData.find(c => c.id === activeCategory);
  const activeClay = clayItems.find(c => c.id === activeCategory);
  const subcategories = getSubcategories(activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-[#163824] flex flex-col text-white font-sans select-none overflow-hidden">
      
      {/* Decorative Faint Outlines Chalk Background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="chalk-pattern" width="160" height="160" patternUnits="userSpaceOnUse">
            <path d="M30 40 L30 25 H45 L45 40 L25 65 H55 Z" fill="none" stroke="#fff" strokeWidth="3" />
            <path d="M90 30 V45 M82 37 H98" stroke="#fff" strokeWidth="3" />
            <polygon points="20,110 24,118 34,120 28,126 30,135 20,130 10,135 12,126 6,120 16,118" fill="none" stroke="#fff" strokeWidth="3" />
            <path d="M120 120 L130 130 L134 146 L124 142 Z" fill="none" stroke="#fff" strokeWidth="3" />
            <circle cx="70" cy="110" r="8" fill="none" stroke="#fff" strokeWidth="3" />
            <path d="M78 80 V110" stroke="#fff" strokeWidth="3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chalk-pattern)" />
      </svg>

      {/* Transparent Header */}
      <div className="h-20 shrink-0 w-full px-6 flex items-center justify-between bg-transparent relative z-30">
        
        {/* Left Header items: Home / Back button + Star Capsule badge */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToCategories}
            className="w-14 h-14 rounded-full bg-[#10B981] border-[4px] border-white shadow-lg flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform shrink-0 cursor-pointer"
          >
            <Home className="w-7 h-7" />
          </button>
          
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 border-[3px] border-white shadow-md relative overflow-hidden">
            <span className="text-lg drop-shadow-md">⭐</span>
            <span className="pl-1 drop-shadow-sm font-black">{globalStars}</span>
          </div>
        </div>

        {/* Center Header: Category Title + Icon */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-inner">
            {activeClay ? render3DIcon(activeClay.id) : null}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black drop-shadow-md tracking-wide">
            {activeClay?.title}
          </h2>
        </div>

        {/* Right Header: Burger Options button */}
        <button 
          onClick={onOpenParents}
          className="w-14 h-14 rounded-full bg-white/20 border-[4px] border-white/50 shadow-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform shrink-0 cursor-pointer"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Scrollable Main Area (Multiple horizontal rows scroll vertically) */}
      <div className="flex-1 w-full overflow-y-auto px-6 py-4 flex flex-col gap-8 pb-10 relative z-20 scrollbar-thin">
        {subcategories.map((sub, rowIdx) => {
          const matchedGames = islandsData.filter(game => sub.gameIds.includes(game.id));
          if (matchedGames.length === 0) return null;

          return (
            <div key={rowIdx} className="flex flex-col gap-3">
              {/* Row title */}
              <h3 className="text-xl font-black text-white/90 drop-shadow-sm tracking-wide px-1">
                {sub.title}
              </h3>

              {/* Horizontal scroll grid */}
              <div className="w-full overflow-x-auto flex gap-6 pb-4 scrollbar-none scroll-smooth">
                {matchedGames.map((game, idx) => {
                  // All games are now unlocked per user request
                  const isLocked = false;

                  return (
                    <div
                      key={game.id}
                      className="w-[280px] sm:w-[320px] aspect-[16/10] shrink-0 rounded-[28px] border-[5px] border-white/95 relative overflow-hidden shadow-xl cursor-pointer hover:scale-103 active:scale-97 transition-all flex flex-col justify-end"
                      style={{
                        background: activeClay 
                          ? `linear-gradient(135deg, ${activeClay.bgGradient.split(' ')[1]}, ${activeClay.bgGradient.split(' ')[3]})`
                          : 'linear-gradient(135deg, #10B981, #059669)'
                      }}
                      onClick={() => {
                        onSelectGame(game.id);
                      }}
                    >
                      {/* Playful 3D-shaded Illustration overlay inside the card */}
                      <div className="absolute inset-0 flex items-center justify-center pb-8 scale-[1.1] pointer-events-none">
                        {render3DIcon(game.id)}
                      </div>

                      {/* Top Left Tag Indicator */}
                      <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-white shadow-md">
                        ✓
                      </div>

                      {/* Bottom Banner overlay containing play and title */}
                      <div className="w-full bg-black/40 backdrop-blur-md py-3 px-4 border-t border-white/20 flex items-center justify-between z-10">
                        <span className="text-sm font-black text-white truncate pr-2">
                          {game.gameName}
                        </span>
                        
                        <div className="w-9 h-9 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-md">
                          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
