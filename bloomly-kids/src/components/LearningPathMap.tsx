import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const islandsData = [
  {
    id: "math",
    title: "حديقة الحساب 🍎",
    character: "🐰 الأرنب سمسم (عبقري الحساب)",
    characterEmoji: "🐰",
    emoji: "🍎",
    gameName: "حديقة الحساب السهل",
    quest: "أهلاً يا صديقي! أنا الأرنب سمسم. سنقوم هنا بحل مسائل الجمع والطرح البسيطة وعد الفواكه لنكسب عقل الحساب السريع ونهزم الكسل الحسابي!",
    superpower: "الحساب السريع وحل المسائل في رمشة عين! 🧠",
    badge: "عمر 5-9 سنوات",
    x: 10,
    y: 15
  },
  {
    id: "spelling",
    title: "مغامرة الحروف 📚",
    character: "🦉 البومة كوكو (حكيم القراءة)",
    characterEmoji: "🦉",
    emoji: "📚",
    gameName: "مغامرة الحروف أ ب ت",
    quest: "أهلاً يا صديقي! أنا البومة كوكو. سننطلق معاً في رحلة لتعلّم الحروف العربية ونطقها الصحيح بمطابقة الصور والكلمات في الغابة السحرية!",
    superpower: "قراءة الكتب والخرائط القديمة بطلاقة وسرعة فائقة! ⚡",
    badge: "عمر 4-8 سنوات",
    x: 25,
    y: 25
  },
  {
    id: "memory",
    title: "كروت الذاكرة 🃏",
    character: "🦊 الثعلب فطن (المفكر العبقري)",
    characterEmoji: "🦊",
    emoji: "🃏",
    gameName: "كروت الذاكرة السحرية",
    quest: "يا هلا بك في معسكري! أنا الثعلب فطن. سنقوي تركيزنا ونشاط ذاكرتنا بمطابقة أزواج كروت الحيوانات والأشكال المخفية بأسرع وقت ممكن!",
    superpower: "التركيز الخارق وكشف كل الأسرار وحل الألغاز الصعبة! 🎯",
    badge: "معسكر نشط",
    x: 45,
    y: 15
  },
  {
    id: "catcher",
    title: "صائد النجوم 🎈",
    character: "🐵 القرد شادي (صائد الفواكه)",
    characterEmoji: "🐵",
    emoji: "🎈",
    gameName: "صائد النجوم والبالونات",
    quest: "مرحباً! أنا القرد شادي. سنصطاد معاً النجوم والبالونات الطائرة ونعبر السحاب لنتعلّم التركيز السريع وحصد الجوائز الملونة!",
    superpower: "السرعة الفائقة والتركيز الخارق في التقاط الفرص! ⚡",
    badge: "سرعة وتركيز",
    x: 65,
    y: 20
  },
  {
    id: "coloring",
    title: "ورشة التلوين 🎨",
    character: "🦋 الفراشة رسمة (ملكة الألوان)",
    characterEmoji: "🦋",
    emoji: "🎨",
    gameName: "ورشة الفنان للتلوين",
    quest: "أهلاً يا فناننا الصغير! أنا الفراشة رسمة. سنطلق العنان لإبداعنا بتلوين الأشكال وتصميم لوحات سحرية رائعة بألوان قوس قزح الجميلة!",
    superpower: "تحويل خيالك ورسوماتك البسيطة إلى لوحات فنية تبهر الجميع! 🌈",
    badge: "ورش عمل إبداعية",
    x: 85,
    y: 15
  },
  {
    id: "spellingEn",
    title: "الحروف الإنجليزية 🔤",
    character: "🦁 الأسد سيمبا (متحدث اللغات)",
    characterEmoji: "🦁",
    emoji: "🔤",
    gameName: "مغامرة الحروف (EN)",
    quest: "Hi my friend! أنا الأسد سيمبا. سنستكشف الحروف والكلمات الإنجليزية لتتحدث بطلاقة وتكتشف مفردات جديدة وممتعة!",
    superpower: "التحدث باللغة الإنجليزية وتكوين صداقات حول العالم! 🌍",
    badge: "عمر 4-10 سنوات",
    x: 85,
    y: 35
  },
  {
    id: "sorting",
    title: "تصنيف بلومي 🤖",
    character: "🤖 الروبوت بلومي (منظم الكائنات)",
    characterEmoji: "🤖",
    emoji: "🤖",
    gameName: "تصنيف بلومي السحري",
    quest: "مرحباً! أنا الروبوت بلومي. سنقوم بتصنيف الكائنات والأشكال ووضعها في السلال المناسبة لنرتب الجزيرة السحرية معاً!",
    superpower: "التفكير المنطقي والترتيب الذكي لكل شيء من حولك! 🧩",
    badge: "ذكاء منطقي",
    x: 65,
    y: 45
  },
  {
    id: "spaceCatcher",
    title: "البالونات الطائرة ☁️",
    character: "🐨 الكوالا فرفور (مفجر البالونات)",
    characterEmoji: "🐨",
    emoji: "☁️",
    gameName: "بالونات بلومي الطائرة",
    quest: "أهلاً بك! أنا الكوالا فرفور. سنقوم هنا بتفجير البالونات التي تحمل الحرف أو الرقم الصحيح لنصعد إلى السماء ونكسب النجوم!",
    superpower: "سرعة البديهة والتقاط الرموز الصحيحة في غمضة عين! 🎯",
    badge: "سرعة بديهة",
    x: 45,
    y: 35
  },
  {
    id: "connectDots",
    title: "توصيل الأرقام ✏️",
    character: "🦘 الكنغر قفاز (رسام الأشكال)",
    characterEmoji: "🦘",
    emoji: "✏️",
    gameName: "توصيل الأرقام السحرية",
    quest: "مرحباً! أنا الكنغر قفاز. سنقوم بتوصيل النقاط المرقمة بالترتيب لنكشف الأشكال والحيوانات السرية المختبئة وراء الخطوط!",
    superpower: "الدقة الهندسية ورسم الأشكال الرائعة بيسر وسهولة! 📐",
    badge: "رسم وهندسة",
    x: 25,
    y: 45
  },
  {
    id: "maze",
    title: "متاهة بلومي 🌀",
    character: "🐹 الهامستر سريع (مكتشف المتاهات)",
    characterEmoji: "🐹",
    emoji: "🌀",
    gameName: "متاهة بلومي السحرية",
    quest: "أهلاً بك! أنا الهامستر سريع. سنقود بطلنا عبر المتاهات المليئة بالخضار والعوائق لجمع النجوم والوصول للهدف بسلام!",
    superpower: "التخطيط الذكي وتخطي العقبات والوصول لأي هدف تريده! 🧭",
    badge: "توجيه وتخطيط",
    x: 10,
    y: 60
  },
  {
    id: "safari",
    title: "سفاري الأصوات 🎵",
    character: "🦁 الأسد زئير (مستكشف الأصوات)",
    characterEmoji: "🦁",
    emoji: "🎵",
    gameName: "سفاري الأصوات السحرية",
    quest: "مرحباً! أنا الأسد زئير. سنستمع معاً لأصوات الطبيعة والقطارات والحيوانات لنميزها ونعرف الكروت المطابقة لها!",
    superpower: "قوة الاستماع والتركيز السمعي الخارق لتمييز الأصوات! 👂",
    badge: "تركيز سمعي",
    x: 30,
    y: 65
  },
  {
    id: "chef",
    title: "مطبخ الحلوى 🧁",
    character: "🐼 الباندا فودي (شيف الحلويات)",
    characterEmoji: "🐼",
    emoji: "🧁",
    gameName: "مطبخ الحلوى السحري",
    quest: "أهلاً يا شيف! أنا الباندا فودي. سنقوم معاً بخلط المكونات بالترتيب الصحيح لنطبخ أشهى وأجمل الحلويات السحرية الملونة!",
    superpower: "الطبخ الإبداعي والترتيب الدقيق للخطوات والوصفات! 🎂",
    badge: "طهي ووصفات",
    x: 50,
    y: 55
  },
  {
    id: "train",
    title: "قطار الأشكال 🚂",
    character: "🐶 الكلب مهندس (سائق القطار)",
    characterEmoji: "🐶",
    emoji: "🚂",
    gameName: "قطار بلومي السريع",
    quest: "أهلاً بك! أنا السائق مهندس. هيا بنا نركّب الأشكال الهندسية في عربات القطار لنتمكن من الانطلاق برحلتنا السعيدة!",
    superpower: "معرفة الأشكال الهندسية والتركيب الذكي! 📐",
    badge: "هندسة وتركيب",
    x: 70,
    y: 65
  },
  {
    id: "arrowRacer",
    title: "سباق الاتجاهات 🏍️",
    character: "🐆 الفهد طلقة (متسابق السرعة)",
    characterEmoji: "🐆",
    emoji: "🏍️",
    gameName: "سباق الاتجاهات الخارق",
    quest: "مرحباً! أنا طلقة. هل أنت مستعد للسباق؟ اقرأ الأسهم بسرعة واستخدم الاتجاهات لتفادي العقبات والفوز بالسباق الكبير!",
    superpower: "السرعة الفائقة والتمييز السريع للاتجاهات! ⚡",
    badge: "سرعة وانتباه",
    x: 90,
    y: 75
  },
  {
    id: "tapRacer",
    title: "سباق الحروف والسرعة 🏁",
    character: "🐢 السلحفاة نينجا (بطل التحدي)",
    characterEmoji: "🐢",
    emoji: "🏁",
    gameName: "سباق الحروف والسرعة",
    quest: "أهلاً يا بطل! أنا نينجا. هنا سنتدرب على سرعة النقر والتقاط الحروف الصحيحة لنتسابق مع الزمن!",
    superpower: "رد الفعل السريع والدقة المطلقة! 🎯",
    badge: "رد فعل سريع",
    x: 70,
    y: 85
  },
  {
    id: "quran",
    title: "جزيرة القرآن 🕋",
    character: "🦉 الهدهد هدهد (معلم التلاوة)",
    characterEmoji: "🪶",
    emoji: "🕋",
    gameName: "حفظ قصار السور بالتكرار التفاعلي",
    quest: "أهلاً بك يا صديقي الصغير! أنا الهدهد هدهد. سنستمع معاً لآيات الله الكريمة ونكررها لنكسب الأجر ونحفظ القرآن الكريم في قلوبنا ونفوز بالنجوم المضاعفة!",
    superpower: "حفظ سور القرآن وتلاوتها بصوت ندي وجميل! 🕋✨",
    badge: "تحفيظ وقيم",
    x: 45,
    y: 80
  },
  {
    id: "stories",
    title: "قصص بلومي 📚",
    character: "🦊 الثعلب حكواتي (راوي القصص)",
    characterEmoji: "🦊",
    emoji: "📚",
    gameName: "قصص تفاعلية مصورة تتبع الكلمات",
    quest: "أهلاً بك في خيمتي السحرية! أنا الراوي حكواتي. سنقرأ معاً أروع القصص المصورة التي تعلمنا القيم والأخلاق، ونتبع الكلمات المقروءة كلمة بكلمة!",
    superpower: "قراءة القصص بطلاقة وتعلم الأخلاق الكريمة والأمانة! 🌟📖",
    badge: "قصص وقيم",
    x: 20,
    y: 85
  }
];

// Helper to render beautiful custom logos for each game on the map
export const renderGameLogo = (id: string, isActive: boolean) => {
  switch (id) {
    case "math":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-100 rounded-full">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] animate-wiggle">🍎</span>
          <span className="absolute bottom-1 right-1 bg-green-500 text-white font-extrabold text-[8px] sm:text-[9px] px-1 rounded-full border border-white">
            +
          </span>
        </div>
      );
    case "spelling":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 to-red-400 text-white rounded-xl border-2 border-white shadow-sm overflow-hidden p-1">
          <span className="font-extrabold text-xs sm:text-sm leading-none whitespace-nowrap">أ ب ت</span>
        </div>
      );
    case "memory":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">🃏</span>
        </div>
      );
    case "catcher":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-red-100 rounded-full">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] animate-float">🎈</span>
          <span className="absolute top-1 right-1 text-xs sm:text-sm animate-pulse">⭐</span>
        </div>
      );
    case "coloring":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 rounded-full">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">🎨</span>
        </div>
      );
    case "spellingEn":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-xl border-2 border-white shadow-sm overflow-hidden p-1 font-sans">
          <span className="font-extrabold text-xs sm:text-sm leading-none uppercase">abc</span>
        </div>
      );
    case "sorting":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">🤖</span>
        </div>
      );
    case "spaceCatcher":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 rounded-full relative p-0.5 sm:p-1">
          <div className="w-8 h-9 bg-red-400 border-2 border-[#4D2B82] rounded-full flex items-center justify-center text-white font-extrabold text-[10px] sm:text-xs relative shadow-sm">
            أ
            <div className="absolute bottom-[-3px] left-0 right-0 mx-auto w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-red-400" />
          </div>
          <div className="w-[1px] h-1.5 bg-gray-400" />
        </div>
      );
    case "connectDots":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-full">
          <span className="text-2xl sm:text-3xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">✏️</span>
          <span className="absolute bottom-0.5 right-1 text-[7px] sm:text-[8px] font-extrabold text-[#1B5E20] bg-white px-0.5 rounded border border-gray-300">
            1-2
          </span>
        </div>
      );
    case "maze":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 rounded-full">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] animate-spin-slow">🌀</span>
        </div>
      );
    case "safari":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFF9C4] to-[#FFF59D] rounded-full">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">🎵</span>
          <span className="absolute bottom-0.5 right-0.5 text-[8px] sm:text-[10px]">🦁</span>
        </div>
      );
    case "chef":
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] rounded-full">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">🧁</span>
        </div>
      );
    default:
      const island = islandsData.find(i => i.id === id);
      return <span className="text-3xl">{island ? island.emoji : "❓"}</span>;
  }
};

export default function LearningPathMap({ 
  onSelectGame, 
  maxIslandUnlocked = 0 
}: { 
  onSelectGame: (gameId: string) => void,
  maxIslandUnlocked: number
}) {
  const [selectedIslandIndex, setSelectedIslandIndex] = useState<number | null>(null);

  const playBubbleSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.error(e);
    }
  };

  const playErrorSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.error(e);
    }
  };

  // Generate path coordinates
  const svgPathStr = islandsData.map((isl, idx) => `${idx === 0 ? 'M' : 'L'} ${isl.x} ${isl.y}`).join(' ');

  return (
    <div className="w-full overflow-x-auto rounded-[36px] border-4 border-[#4D2B82] shadow-inner mb-8 bg-[#29B6F6] custom-scrollbar" style={{ minHeight: '600px' }} dir="rtl">
      <div className="relative min-w-[1200px] h-[800px] md:h-[1200px] select-none cursor-default z-10" style={{
        backgroundImage: `radial-gradient(#0288D1 1.5px, transparent 1.5px), linear-gradient(to bottom, #29B6F6, #0288D1)`,
        backgroundSize: '24px 24px, 100% 100%'
      }}>
      
      {/* Ocean waves emojis floating in background */}
      <div className="absolute top-[5%] left-[8%] text-blue-100/30 text-3xl pointer-events-none select-none">🌊</div>
      <div className="absolute top-[85%] left-[90%] text-blue-100/30 text-4xl pointer-events-none select-none">🌊</div>
      <div className="absolute top-[50%] left-[92%] text-blue-100/30 text-3xl pointer-events-none select-none">🌊</div>
      <div className="absolute top-[90%] left-[10%] text-blue-100/30 text-2xl pointer-events-none select-none">⛵</div>
      <div className="absolute top-[12%] left-[82%] text-blue-100/30 text-2xl pointer-events-none select-none">🐠</div>

      {/* Sand Shore layer - organic shaped island covering most of the map */}
      <div className="absolute inset-[4%] bg-[#FFE0B2] border-3 border-[#E5A93C] shadow-2xl pointer-events-none" style={{
        borderRadius: "42% 45% 40% 48% / 45% 42% 48% 40%"
      }}>
        {/* Green forest landmass */}
        <div className="absolute inset-[2.5%] bg-gradient-to-br from-[#81C784] via-[#4CAF50] to-[#2E7D32] shadow-inner" style={{
          borderRadius: "40% 43% 38% 45% / 43% 40% 45% 38%"
        }}>
          {/* Subtle grass texture */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1b5e20_15%,transparent_15%)] bg-[length:18px_18px]" />
        </div>
      </div>

      {/* Decorative island icons in empty spaces */}
      <div className="absolute top-[26%] left-[24%] text-2xl select-none pointer-events-none opacity-85 animate-float">🌴</div>
      <div className="absolute top-[32%] left-[72%] text-2xl select-none pointer-events-none opacity-85 animate-float" style={{ animationDelay: "1.2s" }}>🌴</div>
      <div className="absolute top-[20%] left-[48%] text-3xl select-none pointer-events-none opacity-85 animate-bounce-slow">⛰️</div>
      <div className="absolute top-[68%] left-[16%] text-2xl select-none pointer-events-none opacity-85">⛺</div>
      <div className="absolute top-[65%] left-[84%] text-2xl select-none pointer-events-none opacity-85 animate-pulse">🏰</div>
      <div className="absolute top-[7%] left-[86%] text-2xl select-none pointer-events-none opacity-85">🌲</div>
      <div className="absolute top-[82%] left-[85%] text-2xl select-none pointer-events-none opacity-85">🌴</div>
      <div className="absolute top-[52%] left-[45%] text-2xl select-none pointer-events-none opacity-50">🌸</div>
      
      {/* Decorative Map Dotted Lines connecting islands */}
      <svg className="absolute inset-0 w-full h-full stroke-dashed stroke-purple-800/40 stroke-[4px] fill-none pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={svgPathStr} strokeDasharray="3, 4" />
      </svg>

      {/* Islands Markers */}
      {islandsData.map((island, index) => {
        const isActive = selectedIslandIndex === index;
        const isCard = index === 1 || index === 5;
        const isLocked = false;
        const isNextToUnlock = false;

        return (
          <div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: `${island.x}%`, top: `${island.y}%` }}
          >
            <button
              onClick={() => {
                if (isLocked) {
                  playErrorSound();
                  alert("عليك إكمال التحدي السابق لفتح هذه الجزيرة السحرية يا بطل!");
                  return;
                }
                setSelectedIslandIndex(index);
                playBubbleSound();
              }}
              className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-4xl shadow-xl cursor-pointer transition-all duration-300 relative border-4 
                ${isLocked ? 'filter grayscale brightness-75 border-gray-400 bg-gray-200' : 
                  isActive ? 'border-[#FF7A00] scale-110 shadow-[0_6px_0_0_#FF7A00] bg-yellow-50' : 
                  isNextToUnlock ? 'border-green-400 bg-green-50 animate-pulse' : 'border-[#4D2B82] bg-white hover:border-[#FF7A00]'
                }
                ${!isLocked && 'hover:scale-110 active:scale-95'}
              `}
              style={{
                borderRadius: isCard ? "14px" : "9999px"
              }}
            >
              {/* Island custom logo */}
              {renderGameLogo(island.id, isActive)}

              {/* Locked overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center" style={{ borderRadius: isCard ? "10px" : "9999px" }}>
                  <span className="text-2xl drop-shadow-md">🔒</span>
                </div>
              )}

              {/* Next to play indicator */}
              {isNextToUnlock && !isActive && (
                <span className="absolute -top-3 -right-3 text-2xl animate-bounce drop-shadow-md">✨</span>
              )}
            </button>

            {/* Island Name Label below */}
            <div className={`absolute top-[110%] left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-[9px] sm:text-[11px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20 shadow-sm ${isLocked ? 'bg-gray-600' : 'bg-[#4D2B82]'}`}>
              {island.title}
            </div>
          </div>
        );
      })}

      {/* Centered Modal popup */}
      <AnimatePresence>
        {selectedIslandIndex !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
            {/* Backdrop Click to Close */}
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={() => setSelectedIslandIndex(null)} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white border-4 border-[#4D2B82] rounded-[36px] shadow-[0_12px_0_0_#4D2B82] max-w-md w-full p-6 sm:p-8 text-right font-sans overflow-hidden max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Top corner close button */}
              <button 
                onClick={() => {
                  setSelectedIslandIndex(null);
                  playBubbleSound();
                }}
                className="absolute top-4 left-4 bg-gray-100 hover:bg-red-100 border-2 border-[#4D2B82] text-[#E01E5A] w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-lg cursor-pointer transition-colors shadow-[0_3px_0_0_#4D2B82] active:translate-y-[2px] active:shadow-[0_1px_0_0_#4D2B82]"
              >
                ✕
              </button>

              {/* Character Avatar Banner */}
              <div className="flex flex-col items-center text-center mt-4 mb-6">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-purple-100 to-indigo-50 border-3 border-[#4D2B82] flex items-center justify-center text-6xl shadow-md mb-3 transform -rotate-3 hover:rotate-0 transition-transform duration-300 relative">
                  {islandsData[selectedIslandIndex].characterEmoji}
                  <span className="absolute -bottom-1 -right-1 text-2xl animate-pulse">✨</span>
                </div>
                
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  مرشد الجزيرة السحرية 🦉
                </span>
                <h3 className="text-2xl font-black text-[#4D2B82] mt-2">
                  {islandsData[selectedIslandIndex].character.split(" ")[1] || islandsData[selectedIslandIndex].character}
                </h3>
              </div>

              {/* Island Details */}
              <div className="space-y-4">
                {/* Game Target */}
                <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-3 text-right">
                  <span className="text-[10px] font-extrabold text-purple-400 block mb-0.5">المهمة السحرية 🎮:</span>
                  <span className="text-lg font-black text-[#4D2B82]">
                    {islandsData[selectedIslandIndex].gameName}
                  </span>
                </div>

                {/* Quest Description */}
                <p className="text-sm font-bold text-[#6B4E9E] leading-relaxed">
                  {islandsData[selectedIslandIndex].quest}
                </p>

                {/* Superpower */}
                <div className="bg-[#FFFDF0] border-2 border-yellow-300 rounded-2xl p-4 text-right shadow-sm">
                  <span className="text-xs font-extrabold text-[#FF7A00] block mb-1">
                    ✨ القوة المكتسبة:
                  </span>
                  <span className="text-sm font-black text-[#D97706] leading-relaxed">
                    {islandsData[selectedIslandIndex].superpower}
                  </span>
                </div>

                {/* Age Badge */}
                <div className="flex items-center justify-between text-xs font-bold text-[#6B4E9E] bg-gray-50 border border-gray-100 rounded-xl p-2.5">
                  <span>الجزيرة رقم: {selectedIslandIndex + 1} / {islandsData.length}</span>
                  <span className="bg-purple-100 text-[#4D2B82] px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">
                    {islandsData[selectedIslandIndex].badge}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const gameId = islandsData[selectedIslandIndex].id;
                    setSelectedIslandIndex(null);
                    onSelectGame(gameId);
                  }}
                  className="flex-1 btn-bubbly-primary text-sm py-3.5 cursor-pointer shadow-[0_5px_0_0_#1B5E20] hover:shadow-[0_2px_0_0_#1B5E20]"
                  style={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                    borderColor: '#1B5E20',
                  }}
                >
                  انطلق للمغامرة الآن! 🚀
                </button>
                
                <button
                  onClick={() => {
                    setSelectedIslandIndex(null);
                    playBubbleSound();
                  }}
                  className="btn-bubbly-secondary text-sm py-3.5 px-6 cursor-pointer"
                >
                  تراجع ↩
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
