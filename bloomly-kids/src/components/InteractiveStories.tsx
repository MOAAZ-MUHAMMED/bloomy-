import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Square, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface StoryPage {
  id: number;
  text: string;
  illustration: (isAnimating: boolean) => React.ReactNode;
}

interface Story {
  id: number;
  title: string;
  desc: string;
  emoji: string;
  moral: string;
  pages: StoryPage[];
}

// --- Custom SVGs for Story illustrations ---
function SVGArnoobCarrot(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      {/* Background forest */}
      <rect x="0" y="0" width="200" height="150" fill="#E8F5E9" rx="16" />
      <circle cx="20" cy="130" r="30" fill="#A5D6A7" opacity="0.6" />
      <circle cx="180" cy="120" r="25" fill="#A5D6A7" opacity="0.6" />
      
      {/* Golden Carrot */}
      <motion.g
        animate={isAnimating ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        transform="translate(110, 80)"
      >
        {/* Carrot Body */}
        <polygon points="0,0 20,-45 -20,-45" fill="#F59E0B" stroke="#4D2B82" strokeWidth="3" strokeLinejoin="round" />
        {/* Shine */}
        <polygon points="5,-5 12,-40 0,-40" fill="#FFF" opacity="0.3" />
        {/* Leaves */}
        <path d="M 0 -45 Q -10 -60 -5 -65 M 0 -45 Q 0 -62 5 -60 M 0 -45 Q 10 -58 12 -54" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Arnoob Rabbit */}
      <motion.g 
        animate={isAnimating ? { y: [0, -8, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}
        transform="translate(50, 60)"
      >
        {/* Ears */}
        <ellipse cx="-10" cy="-25" rx="4" ry="12" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <ellipse cx="6" cy="-25" rx="4" ry="12" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        {/* Body */}
        <circle cx="-2" cy="25" r="16" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        {/* Head */}
        <circle cx="-2" cy="0" r="12" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        {/* Eye */}
        <circle cx="2" cy="-2" r="1.5" fill="#4D2B82" />
        {/* Cheeks */}
        <circle cx="-6" cy="2" r="2" fill="#FF8A8A" opacity="0.6" />
        {/* Happy hands */}
        <line x1="10" y1="18" x2="22" y2="12" stroke="#4D2B82" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

function SVGArnoobSquirrel(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#E8F5E9" rx="16" />
      
      {/* Arnoob on Left */}
      <g transform="translate(60, 70)">
        <ellipse cx="-8" cy="-20" rx="3.5" ry="10" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <ellipse cx="4" cy="-20" rx="3.5" ry="10" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-2" cy="20" r="14" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-2" cy="0" r="10" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="2" cy="-2" r="1.2" fill="#4D2B82" />
      </g>

      {/* Hungry Squirrel on Right */}
      <motion.g
        animate={isAnimating ? { x: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        transform="translate(130, 70)"
      >
        {/* Tail */}
        <path d="M 15 25 Q 35 10 25 -10" stroke="#D97706" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Body */}
        <circle cx="0" cy="20" r="14" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        {/* Head */}
        <circle cx="-2" cy="2" r="10" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-5" cy="0" r="1.2" fill="#4D2B82" />
        {/* Sad mouth */}
        <path d="M -6 6 Q -4 4 -2 6" stroke="#4D2B82" strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Thought bubble */}
      <circle cx="108" cy="40" r="8" fill="#FFF" stroke="#4D2B82" strokeWidth="1.5" />
      <circle cx="98" cy="48" r="4" fill="#FFF" stroke="#4D2B82" strokeWidth="1" />
      <span className="absolute top-[28%] left-[54%] text-xs pointer-events-none">🥕?</span>
    </svg>
  );
}

function SVGArnoobSharing(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#FFFDE7" rx="16" />
      
      {/* Big Apple Tree shade */}
      <path d="M 0 0 C 40 40, 160 40, 200 0 Z" fill="#81C784" opacity="0.8" />

      {/* Arnoob and Squirrel sitting together holding the split carrot */}
      <g transform="translate(70, 85)">
        {/* Rabbit */}
        <ellipse cx="-6" cy="-18" rx="3.5" ry="9" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <ellipse cx="4" cy="-18" rx="3.5" ry="9" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-1" cy="16" r="12" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-1" cy="0" r="9" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="2" cy="-2" r="1" fill="#4D2B82" />
      </g>

      <g transform="translate(130, 85)">
        {/* Squirrel */}
        <path d="M 12 20 Q 28 8 20 -8" stroke="#D97706" strokeWidth="6" fill="none" />
        <circle cx="0" cy="16" r="12" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-2" cy="0" r="9" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-4" cy="-2" r="1" fill="#4D2B82" />
      </g>

      {/* Half Carrots on the table/ground */}
      <motion.g
        animate={isAnimating ? { y: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}
        transform="translate(100, 95)"
      >
        <polygon points="0,0 8,-15 -8,-15" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

function SVGArnoobForest(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#E8F5E9" rx="16" />
      
      {/* Sparkling carrot tree */}
      <g transform="translate(100, 90)">
        <rect x="-6" y="0" width="12" height="30" fill="#78350F" stroke="#4D2B82" strokeWidth="2" />
        <path d="M -30 0 C -50 -30, 50 -30, 30 0 Z" fill="#4CAF50" stroke="#4D2B82" strokeWidth="2.5" />
        
        {/* Glowing sparkles */}
        <motion.circle cx="-15" cy="-20" r="3" fill="#FFF" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} />
        <motion.circle cx="15" cy="-15" r="3" fill="#FFD700" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2 }} />
      </g>

      {/* Two happy friends waving */}
      <motion.g 
        animate={isAnimating ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        transform="translate(60, 95)"
      >
        <circle cx="0" cy="12" r="10" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill="#FFF" stroke="#4D2B82" strokeWidth="2" />
      </motion.g>
      <motion.g 
        animate={isAnimating ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.1 }}
        transform="translate(140, 95)"
      >
        <circle cx="0" cy="12" r="10" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

function SVGSproutSleeping(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#F3E8FF" rx="16" />
      
      {/* Tree trunk */}
      <rect x="140" y="50" width="20" height="80" fill="#78350F" stroke="#4D2B82" strokeWidth="2.5" />
      <path d="M 110 50 C 90 20, 190 20, 170 50 Z" fill="#81C784" />

      {/* Lazy Sprout Mascot Sleeping */}
      <motion.g
        animate={isAnimating ? { scaleY: [1, 0.96, 1], rotate: [-2, 2, -2] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        transform="translate(80, 95)"
      >
        {/* Head leaves */}
        <path d="M 0 -18 Q -10 -28 -5 -30 M 0 -18 Q 10 -28 5 -30" stroke="#81C784" strokeWidth="2.5" fill="none" />
        {/* Body */}
        <circle cx="0" cy="0" r="16" fill="#2ECC71" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Sleeping eyes */}
        <path d="M -8 -2 Q -5 1 -2 -2" stroke="#4D2B82" strokeWidth="2" fill="none" />
        <path d="M 2 -2 Q 5 1 8 -2" stroke="#4D2B82" strokeWidth="2" fill="none" />
      </motion.g>

      {/* Floating Z's */}
      <motion.span
        animate={{ y: [0, -15], x: [0, 5], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute top-[45%] left-[45%] text-purple-600 font-extrabold text-sm"
      >
        Zzz
      </motion.span>
    </svg>
  );
}

function SVGSproutTurtle(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#F3E8FF" rx="16" />
      
      {/* Sprout Sitting */}
      <g transform="translate(60, 90)">
        <circle cx="0" cy="0" r="15" fill="#2ECC71" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="-5" cy="-2" r="1.5" fill="#4D2B82" />
        <circle cx="5" cy="-2" r="1.5" fill="#4D2B82" />
        {/* Question mark */}
        <text x="-5" y="-22" className="text-xs font-black fill-purple-700">؟</text>
      </g>

      {/* Wise Turtle on Right */}
      <motion.g
        animate={isAnimating ? { y: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}
        transform="translate(130, 90)"
      >
        {/* Shell */}
        <ellipse cx="0" cy="0" rx="18" ry="14" fill="#38BDF8" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Head */}
        <circle cx="-22" cy="-4" r="7" fill="#81C784" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="-24" cy="-6" r="1" fill="#4D2B82" />
        {/* Feet */}
        <circle cx="-10" cy="14" r="4.5" fill="#81C784" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="10" cy="14" r="4.5" fill="#81C784" stroke="#4D2B82" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

function SVGSproutWorking(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#E0F2FE" rx="16" />
      
      {/* Sprout Carrying water bucket */}
      <motion.g
        animate={isAnimating ? { x: [0, 8, 0], y: [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.4 }}
        transform="translate(50, 90)"
      >
        <circle cx="0" cy="0" r="14" fill="#2ECC71" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="4" cy="-2" r="1.5" fill="#4D2B82" />
        {/* Bucket */}
        <rect x="12" y="-2" width="10" height="12" fill="#94A3B8" stroke="#4D2B82" strokeWidth="1.5" rx="1" />
        <path d="M 12 -2 Q 17 -8 22 -2" stroke="#4D2B82" strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Wise Turtle walking ahead */}
      <motion.g
        animate={isAnimating ? { x: [0, 6, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.6 }}
        transform="translate(130, 90)"
      >
        <ellipse cx="0" cy="0" rx="16" ry="12" fill="#38BDF8" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="-20" cy="-2" r="6" fill="#81C784" stroke="#4D2B82" strokeWidth="2" />
        {/* Small bucket */}
        <rect x="-14" y="8" width="6" height="8" fill="#94A3B8" stroke="#4D2B82" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

function SVGSproutBlooming(isAnimating: boolean) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full max-h-[220px]">
      <rect x="0" y="0" width="200" height="150" fill="#DCFCE7" rx="16" />
      
      {/* Smiling Sprout Mascot with a HUGE blooming flower on head */}
      <motion.g
        animate={isAnimating ? { scale: [1, 1.08, 1], rotate: [-3, 3, -3] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        transform="translate(100, 85)"
      >
        {/* Body */}
        <circle cx="0" cy="0" r="22" fill="#2ECC71" stroke="#4D2B82" strokeWidth="3" />
        <circle cx="-6" cy="-4" r="2" fill="#4D2B82" />
        <circle cx="6" cy="-4" r="2" fill="#4D2B82" />
        <circle cx="-12" cy="1" r="3" fill="#FF8A8A" opacity="0.6" />
        <circle cx="12" cy="1" r="3" fill="#FF8A8A" opacity="0.6" />
        <path d="M -6 4 Q 0 10 6 4" stroke="#4D2B82" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Huge Blooming Golden Flower */}
        <g transform="translate(0, -26)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse key={deg} cx="0" cy="0" rx="3.5" ry="11" fill="#FBBF24" stroke="#4D2B82" strokeWidth="1.5" transform={`rotate(${deg})`} />
          ))}
          <circle cx="0" cy="0" r="6" fill="#78350F" stroke="#4D2B82" strokeWidth="2" />
        </g>
      </motion.g>

      {/* Floating sparkles */}
      <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute top-[20%] left-[38%] text-yellow-500 text-xl">✨</motion.span>
      <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute top-[35%] left-[58%] text-yellow-500 text-lg">✨</motion.span>
    </svg>
  );
}

// --- Stories Database ---
const stories: Story[] = [
  {
    id: 1,
    title: "الأرنب الصغير والجزرة الذهبية",
    desc: "قصة مشوقة تعلم الأطفال قيمة المشاركة والأمانة في التعامل مع الأصدقاء.",
    emoji: "🐰🥕",
    moral: "الأمانة والمشاركة تجلب البركة والسعادة للجميع!",
    pages: [
      {
        id: 1,
        text: "كان الأرنب الصغير أرنوب يتجول في الغابة الخضراء السعيدة يبحث عن طعام، وفجأة وجد جزرة ذهبية كبيرة تلمع تحت أشعة الشمس.",
        illustration: (isAnim) => SVGArnoobCarrot(isAnim)
      },
      {
        id: 2,
        text: "فرح أرنوب كثيراً وأراد أن يأكلها بمفرده، لكنه تذكر صديقه السنجاب الجائع الذي لم يجد طعاماً اليوم، فقرر الذهاب لمشاركته.",
        illustration: (isAnim) => SVGArnoobSquirrel(isAnim)
      },
      {
        id: 3,
        text: "تقاسم الصديقان الجزرة الذهبية تحت ظل شجرة التفاح الكبيرة، وشكرا الله على طعامهما اللذيذ وهما يشعران بالسعادة البالغة.",
        illustration: (isAnim) => SVGArnoobSharing(isAnim)
      },
      {
        id: 4,
        text: "وفجأة، نمت شجرة جزر ذهبية عملاقة في مكان جلوسهما، تعطي جرزاً حلواً طوال العام، لأن أرنوب اختار الأمانة والمشاركة!",
        illustration: (isAnim) => SVGArnoobForest(isAnim)
      }
    ]
  },
  {
    id: 2,
    title: "السلحفاة والبرعم النشيط",
    desc: "قصة شيقة تحفز الأطفال على التعاون والعمل الجماعي وتجنب الكسل.",
    emoji: "🐢🌱",
    moral: "العمل الجماعي والنشاط يجعلنا نزهر ونكبر بنجاح وفخر!",
    pages: [
      {
        id: 1,
        text: "كان برعم الصغير يستلقي كسلاناً تحت الشجرة طوال اليوم، يرفض مساعدة أصدقائه في سقاية زهور الحديقة وجمع البذور.",
        illustration: (isAnim) => SVGSproutSleeping(isAnim)
      },
      {
        id: 2,
        text: "جاءت السلحفاة الحكيمة وقالت له بلطف: يا برعم، الكسل لا يفيد. النباتات النشيطة التي تعمل وتساعد بعضها هي فقط من تزهر!",
        illustration: (isAnim) => SVGSproutTurtle(isAnim)
      },
      {
        id: 3,
        text: "شعر برعم بالخجل وقرر النهوض فوراً. حمل الدلو وساعد السلحفاة في نقل الماء وسقاية أراضي الحديقة بجد ونشاط.",
        illustration: (isAnim) => SVGSproutWorking(isAnim)
      },
      {
        id: 4,
        text: "وبعد قليل، تفتحت على رأس برعم زهرة ذهبية عملاقة وجميلة جداً، ففرح كثيراً وعرف أن ثمرة العمل الجماعي والنشاط هي النجاح!",
        illustration: (isAnim) => SVGSproutBlooming(isAnim)
      }
    ]
  }
];

interface InteractiveStoriesProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
}

export default function InteractiveStories({ onClose, globalStars, setGlobalStars }: InteractiveStoriesProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [noticeText, setNoticeText] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const triggerNotice = (text: string) => {
    setNoticeText(text);
    setTimeout(() => setNoticeText(null), 2500);
  };

  const updateStars = (diff: number) => {
    if (setGlobalStars) {
      setGlobalStars(prev => {
        const next = Math.max(0, prev + diff);
        localStorage.setItem("bloomly_stars", next.toString());
        return next;
      });
    } else {
      const prev = parseInt(localStorage.getItem("bloomly_stars") || "0", 10);
      localStorage.setItem("bloomly_stars", Math.max(0, prev + diff).toString());
    }
  };

  // Browser Text-To-Speech with boundary word highlighting helper
  const handlePlayVoiceover = () => {
    if (!activeStory) return;
    
    // Reset standard speech
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}

    const textStr = activeStory.pages[currentPageIdx].text;
    const utterance = new SpeechSynthesisUtterance(textStr);
    utteranceRef.current = utterance;
    
    // Set Arabic language
    utterance.lang = "ar-SA";
    utterance.rate = 0.82; // slower speed for kids

    utterance.onstart = () => {
      setIsPlaying(true);
      setActiveWordIdx(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setActiveWordIdx(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveWordIdx(null);
    };

    // Calculate currently spoken word index from character position index
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const charIdx = event.charIndex;
        const sub = textStr.substring(0, charIdx);
        const words = sub.trim().split(/\s+/);
        const wordIndex = sub.trim() === "" ? 0 : words.length;
        setActiveWordIdx(wordIndex);
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech failed:", err);
      setIsPlaying(false);
    }
  };

  const handleStopVoiceover = () => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    setIsPlaying(false);
    setActiveWordIdx(null);
  };

  const handleNextPage = () => {
    if (!activeStory) return;
    handleStopVoiceover();

    if (currentPageIdx < activeStory.pages.length - 1) {
      setCurrentPageIdx(prev => prev + 1);
    } else {
      // Completed last page!
      updateStars(10); // Reward 10 stars as requested
      triggerNotice("🏆 عمل رائع! لقد أنهيت قراءة القصة وحصلت على ١٠ نجوم سحرية! ⭐");
      setActiveStory(null);
      setCurrentPageIdx(0);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      handleStopVoiceover();
      setCurrentPageIdx(prev => prev - 1);
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      try {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, []);

  // Split text to span elements
  const renderTextSpans = (text: string) => {
    const words = text.split(" ");
    return words.map((word, idx) => {
      const isHighlighted = activeWordIdx === idx;
      return (
        <span
          key={idx}
          className={`inline-block mx-1 px-1 rounded-md transition-colors text-2xl font-black ${
            isHighlighted 
              ? "bg-yellow-300 text-purple-900 scale-105 shadow-sm" 
              : "text-[#4D2B82]"
          }`}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-gradient-to-b from-[#FFFDF0] via-[#FAF7FD] to-[#FFFCE6] select-none font-sans flex flex-col justify-between overflow-hidden">
      
      {/* 1. Header Area */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b-4 border-[#4D2B82] p-4 flex items-center justify-between shadow-md relative z-30">
        <button
          onClick={() => {
            handleStopVoiceover();
            onClose();
          }}
          className="btn-bubbly-secondary text-sm py-2 px-5 text-[#4D2B82] bg-white rounded-full flex items-center gap-1 cursor-pointer border-2 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all"
        >
          <X className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-[#4D2B82] tracking-wide flex items-center gap-2 justify-center">
            قصص بلومي التفاعلية المصورة 📚✨
          </h1>
          <p className="text-xs font-bold text-emerald-600">
            شاهد الرسومات، استمع للقصة، وتتبع الكلمات المقروءة لتقرأ مثل الكبار!
          </p>
        </div>

        {/* Global Stars */}
        <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-2 border-[#D97706] text-[#D97706] font-extrabold text-sm px-4 py-1.5 rounded-full shadow-inner">
          <span className="text-lg text-yellow-400">★</span>
          <span>نجومك: {globalStars}</span>
        </div>
      </header>

      {/* 2. Notice Banner */}
      <AnimatePresence>
        {noticeText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 inset-x-0 mx-auto w-fit max-w-sm px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{
              borderColor: noticeText.startsWith("❌") ? "#EF4444" : noticeText.startsWith("🌱") ? "#2ECC71" : "#FF9F29",
              color: noticeText.startsWith("❌") ? "#EF4444" : "#4D2B82",
            }}
          >
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Area */}
      <main className="flex-grow w-full flex items-center justify-center p-6 relative z-10 overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!activeStory ? (
            
            // STORY SELECT VIEW
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="max-w-4xl w-full text-center select-none"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-[#4D2B82] mb-1">📖 مكتبة القصص التفاعلية</h2>
              <p className="text-xs font-extrabold text-purple-400 mb-8">اختر قصة جميلة لتنطلق في رحلة القراءة والتعلم السحرية!</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => {
                      setActiveStory(story);
                      setCurrentPageIdx(0);
                    }}
                    className="card-bubbly p-6 bg-white hover:bg-yellow-50/30 flex flex-col items-center gap-3 border-3 cursor-pointer text-center relative group"
                  >
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{story.emoji}</span>
                    <h3 className="text-lg font-black text-[#4D2B82]">{story.title}</h3>
                    <p className="text-xs font-bold text-purple-400">{story.desc}</p>
                    
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mt-2">
                      💡 القيمة: {story.moral.split(" ")[0] || "التربية"}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

          ) : (
            
            // STORY READER VIEW
            <motion.div
              key="reader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-white border-4 border-[#4D2B82] rounded-[36px] shadow-[0_12px_0_0_#4D2B82] p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative min-h-[500px]"
            >
              
              {/* Reader Header */}
              <div className="flex items-center justify-between border-b-2 border-purple-100 pb-3 mb-4 select-none">
                <button
                  onClick={() => {
                    handleStopVoiceover();
                    setActiveStory(null);
                  }}
                  className="text-xs font-black text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  📖 العودة للمكتبة
                </button>
                
                <span className="font-extrabold text-sm text-[#4D2B82]">
                  صفحة {currentPageIdx + 1} من {activeStory.pages.length}
                </span>

                <div className="flex gap-2">
                  {!isPlaying ? (
                    <button
                      onClick={handlePlayVoiceover}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>استمع للقصة 🔊</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopVoiceover}
                      className="bg-red-500 hover:bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      <span>إيقاف الصوت</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Illustration Area */}
              <div className="flex-grow flex items-center justify-center p-3 mb-4">
                <div className="w-full max-w-[320px] rounded-2xl overflow-hidden border-2 border-purple-100 p-2 bg-slate-50 flex items-center justify-center shadow-inner">
                  {activeStory.pages[currentPageIdx].illustration(isPlaying)}
                </div>
              </div>

              {/* Story Arabic Text (With highlighted word span) */}
              <div className="text-center leading-relaxed px-4 py-3 bg-purple-50/30 rounded-2xl border border-purple-100 min-h-[100px] flex items-center justify-center">
                <div className="text-right tracking-wide leading-loose">
                  {renderTextSpans(activeStory.pages[currentPageIdx].text)}
                </div>
              </div>

              {/* Page Flipping Navigation Controls */}
              <div className="flex items-center justify-between border-t-2 border-purple-100 pt-4 select-none">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPageIdx === 0}
                  className="bg-white hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed border-3 border-[#4D2B82] text-[#4D2B82] font-black text-xs py-2.5 px-5 rounded-full shadow-[0_3px_0_0_#4D2B82] active:translate-y-[1px] active:shadow-[0_1.5px_0_0_#4D2B82] flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الصفحة السابقة</span>
                </button>

                <button
                  onClick={handleNextPage}
                  className="btn-bubbly-primary text-xs py-2.5 px-6 flex items-center gap-1"
                >
                  <span>{currentPageIdx === activeStory.pages.length - 1 ? "أنهيت القراءة 🏆" : "الصفحة التالية"}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
}
