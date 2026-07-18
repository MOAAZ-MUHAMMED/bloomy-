import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // The Living Blobs Data (Mosaic Layout)
  const blobItems = [
    { id: 'farm', title: 'مزرعتي السحرية', englishTitle: 'MY FARM', icon: farmBox?.icon || '🚜', action: () => onSelectCategory?.('farm'), bgFrom: '#a8ff78', bgTo: '#78ffd6', color: 'text-green-800', span: 'col-span-2 row-span-2 min-h-[300px]' },
    { id: 'island_map', title: 'خريطة الجزيرة', englishTitle: 'ISLAND MAP', icon: '🗺️', action: onOpenMap, bgFrom: '#11998e', bgTo: '#38ef7d', color: 'text-emerald-900', span: 'col-span-1 row-span-1 min-h-[140px]' },
    { id: 'fun_games', title: 'ألعاب ومرح', englishTitle: 'FUN GAMES', icon: funGamesBox?.icon || '🎈', action: () => onSelectCategory?.('fun_games'), bgFrom: '#a18cd1', bgTo: '#fbc2eb', color: 'text-purple-900', span: 'col-span-1 row-span-1 min-h-[140px]' },
    { id: 'stories', title: 'هيا نقرأ', englishTitle: 'LET\'S READ', icon: storiesBox?.icon || '📖', action: () => onSelectCategory?.('stories'), bgFrom: '#e0c3fc', bgTo: '#8ec5fc', color: 'text-indigo-900', span: 'col-span-2 row-span-1 min-h-[140px]' },
    { id: 'math', title: 'أرقام وحساب', englishTitle: 'MATH', icon: mathBox?.icon || '🔢', action: () => onSelectCategory?.('math'), bgFrom: '#a1c4fd', bgTo: '#c2e9fb', color: 'text-blue-900', span: 'col-span-1 row-span-2 min-h-[300px]' },
    { id: 'kitchen', title: 'المطبخ الصغير', englishTitle: 'KITCHEN', icon: kitchenBox?.icon || '🍳', action: () => onSelectCategory?.('kitchen'), bgFrom: '#ffecd2', bgTo: '#fcb69f', color: 'text-red-900', span: 'col-span-1 row-span-1 min-h-[140px]' },
    { id: 'arabic', title: 'حروفي العربية', englishTitle: 'ARABIC', icon: arabicBox?.icon || 'أ', action: () => onSelectCategory?.('arabic'), bgFrom: '#f6d365', bgTo: '#fda085', color: 'text-orange-900', span: 'col-span-1 row-span-1 min-h-[140px]' },
    { id: 'english', title: 'حروفي الإنجليزية', englishTitle: 'ENGLISH', icon: englishBox?.icon || 'A', action: () => onSelectCategory?.('english'), bgFrom: '#ff9a9e', bgTo: '#fecfef', color: 'text-pink-900', span: 'col-span-1 row-span-1 min-h-[140px]' },
    { id: 'coloring', title: 'لوّن وارسم', englishTitle: 'COLORING', icon: coloringBox?.icon || '🎨', action: () => onSelectCategory?.('coloring'), bgFrom: '#84fab0', bgTo: '#8fd3f4', color: 'text-teal-900', span: 'col-span-2 row-span-1 min-h-[140px]' },
    { id: 'habits', title: 'عادات صحية', englishTitle: 'HABITS', icon: habitsBox?.icon || '🧼', action: () => onSelectCategory?.('habits'), bgFrom: '#cfd9df', bgTo: '#e2ebf0', color: 'text-slate-800', span: 'col-span-1 row-span-1 min-h-[140px]' },
    { id: 'parents', title: 'أولياء الأمور', englishTitle: 'PARENTS AREA', icon: '👨‍👩‍👧‍👦', action: onOpenParents, bgFrom: '#4facfe', bgTo: '#00f2fe', color: 'text-cyan-900', span: 'col-span-1 row-span-1 min-h-[140px]' },
    { id: 'about_us', title: 'بنعرف عن نفسنا', englishTitle: 'ABOUT US', icon: 'ℹ️', action: onOpenAbout, bgFrom: '#fccb90', bgTo: '#d57eeb', color: 'text-fuchsia-900', span: 'col-span-2 row-span-1 min-h-[140px]' },
  ];

  // View 1: The Living Blobs Mosaic
  if (!activeCategory) {
    return (
      <div className="flex flex-col w-full min-h-screen relative z-10 select-none overflow-x-hidden justify-start items-center bg-transparent">
        
        {/* Top Profile / Coins Bar */}
        <div className="flex justify-between items-center mb-6 mt-6 w-full max-w-7xl mx-auto px-4 z-50">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 pr-4 rounded-full border-[3px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white">
              <SproutMascot className="w-full h-full" state="idle" />
            </div>
            <div className="text-right text-[#4D2B82]">
              <h3 className="text-sm font-black">
                {childProfile?.name || 'البطل السحري'}
              </h3>
              <span className="text-[10px] font-bold text-white bg-[#4D2B82]/80 px-2 py-0.5 rounded-full">
                {childProfile?.age ? `${childProfile.age} سنوات` : '٥ سنوات'}
              </span>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border-2 border-yellow-300 shadow-md mr-2">
              <span>⭐</span>
              <span>{globalStars}</span>
            </div>
          </div>
        </div>

        {/* The Magic Blobs Grid */}
        <div className="w-full max-w-5xl mx-auto px-4 pb-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-auto">
          {blobItems.map((item, index) => {
            // Alternating organic shapes
            const radiusAnim = index % 2 === 0 
              ? ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 50% 40% 50%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
              : ["50% 50% 30% 70% / 50% 60% 40% 40%", "40% 60% 70% 30% / 60% 50% 40% 50%", "50% 50% 30% 70% / 50% 60% 40% 40%"];

            return (
              <motion.div
                key={item.id}
                layoutId={`magic-blob-container-${item.id}`} // The hero magic layout connection
                className={`relative cursor-pointer flex flex-col items-center justify-center p-6 border-[4px] border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.15)] group overflow-hidden ${item.span}`}
                animate={{ borderRadius: radiusAnim, y: [0, -8, 0] }}
                transition={{ 
                  borderRadius: { repeat: Infinity, duration: 6 + index * 0.2, ease: "easeInOut" },
                  y: { repeat: Infinity, duration: 4 + index * 0.3, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: `linear-gradient(135deg, ${item.bgFrom}, ${item.bgTo})`,
                  backdropFilter: 'blur(10px)'
                }}
                onClick={() => {
                  speakArabic(item.title);
                  if (item.action) item.action();
                }}
              >
                {/* Internal Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <motion.div 
                  className={`drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] z-10 ${item.span.includes('row-span-2') ? 'text-8xl md:text-9xl' : 'text-6xl md:text-7xl'}`}
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5 + index * 0.1, ease: "easeInOut" }}
                >
                  {item.icon}
                </motion.div>
                
                <div className="mt-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.1)] z-10 pointer-events-none border-2 border-white/50">
                  <h3 className={`text-sm md:text-lg font-black ${item.color} whitespace-nowrap`}>
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // View 2: Games inside the selected Category (The Hero Expanded State)
  const currentCategory = categoriesData.find(c => c.id === activeCategory);
  const activeBlob = blobItems.find(b => b.id === activeCategory);
  const categoryGames = islandsData.filter(game => currentCategory?.games.includes(game.id));

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 py-6 relative z-10 min-h-screen bg-transparent justify-start">
      
      {/* Category Header (The Expanded Blob!) */}
      <motion.div 
        layoutId={`magic-blob-container-${activeCategory}`}
        className="relative p-6 flex items-center justify-between shadow-2xl border-[4px] border-white overflow-hidden rounded-[40px] md:rounded-[50px] min-h-[160px]"
        style={{ 
          background: `linear-gradient(135deg, ${activeBlob?.bgFrom || '#e0c3fc'}, ${activeBlob?.bgTo || '#8ec5fc'})`,
        }}
      >
        {/* Soft white overlay so text is highly readable */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 z-10 w-full">
          {/* Back Button */}
          <button 
            onClick={onBackToCategories}
            className="w-14 h-14 rounded-full bg-white hover:bg-gray-50 border-4 border-white shadow-[0_5px_15px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-600 active:scale-95 transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
          
          <div className="text-center sm:text-right flex-1">
            <span className={`inline-block text-xs font-black bg-white/90 px-4 py-1.5 rounded-full mb-2 shadow-sm ${activeBlob?.color}`}>
              {activeBlob?.englishTitle}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black mb-2 drop-shadow-md ${activeBlob?.color}`}>
              {activeBlob?.icon} {activeBlob?.title}
            </h2>
            <p className="text-gray-800 font-bold text-sm sm:text-lg max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl p-3 inline-block shadow-sm border border-white/50">
              اختر لعبة من هذه المجموعة للبدء في المغامرة!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid of Games for this category */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16 mt-4">
        {categoryGames.map((game, index) => {
          const gradients = [
            "from-[#ff9a9e]/90 to-[#fecfef]/90 border-pink-300 text-pink-800", 
            "from-[#a1c4fd]/90 to-[#c2e9fb]/90 border-blue-300 text-blue-800", 
            "from-[#ffecd2]/90 to-[#fcb69f]/90 border-orange-300 text-orange-800", 
            "from-[#84fab0]/90 to-[#8fd3f4]/90 border-emerald-300 text-emerald-800", 
            "from-[#e0c3fc]/90 to-[#8ec5fc]/90 border-indigo-300 text-indigo-800", 
            "from-[#fccb90]/90 to-[#d57eeb]/90 border-purple-300 text-purple-800", 
          ];
          const style = gradients[index % gradients.length];
          const [bgFrom, bgTo, borderColor, textColor] = style.split(' ');

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 250, damping: 20 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center text-center p-5 bg-gradient-to-br ${bgFrom} ${bgTo} backdrop-blur-xl rounded-[36px] border-[4px] border-white shadow-[0_12px_25px_rgba(0,0,0,0.12)] cursor-pointer overflow-hidden group`}
              onClick={() => onSelectGame(game.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent h-1/2 pointer-events-none rounded-t-[32px]" />

              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + index * 0.2, ease: "easeInOut" }}
                className="relative z-10 w-20 h-20 bg-white/95 backdrop-blur-md rounded-full border-4 border-white shadow-[0_8px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-5xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
              >
                {game.emoji}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-[3px] border-white flex items-center justify-center text-xl shadow-md">
                  {game.characterEmoji}
                </div>
              </motion.div>

              <div className="relative z-10 flex flex-col flex-1 w-full items-center">
                <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-gray-700 shadow-sm mb-3 border border-gray-100">
                  {game.badge}
                </span>
                
                <h3 className={`text-lg sm:text-xl font-black ${textColor} mb-2 drop-shadow-sm leading-tight`}>
                  {game.gameName}
                </h3>
                
                <p className="text-gray-800 font-bold text-[10px] sm:text-xs leading-relaxed mb-5 opacity-85 px-1 line-clamp-2">
                  {game.quest}
                </p>

                <div
                  className={`mt-auto w-full py-2.5 rounded-2xl bg-white border-b-[5px] border-black/10 text-sm font-black ${textColor} shadow-md group-hover:bg-gray-50 group-active:border-b-0 group-active:translate-y-[5px] transition-all flex items-center justify-center gap-1.5`}
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

