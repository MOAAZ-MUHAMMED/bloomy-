const fs = require('fs');

const code = `import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { ScreenOrientation } from '@capacitor/screen-orientation';

interface DailyHabitsGameProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
}

type HabitType = "TEETH" | "ROOM" | "HANDS" | "BREAKFAST" | "WATER" | "HAIR" | "FACE" | "LAUNDRY" | "BED" | "BOOK" | "SLEEP" | "WUDU" | "PRAY";

export default function DailyHabitsGame({ onClose, globalStars, setGlobalStars }: DailyHabitsGameProps) {
  const [activeHabit, setActiveHabit] = useState<HabitType | null>(null);
  const [completedHabits, setCompletedHabits] = useState<HabitType[]>([]);
  const [noticeText, setNoticeText] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (ScreenOrientation) ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
    } catch (e) {}
    return () => {
      try {
        if (ScreenOrientation) ScreenOrientation.unlock().catch(() => {});
      } catch (e) {}
    };
  }, []);

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

  const triggerCelebration = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const completeHabit = (habit: HabitType) => {
    triggerCelebration();
    if (!completedHabits.includes(habit)) {
      setCompletedHabits([...completedHabits, habit]);
      updateStars(15);
      triggerNotice("🎉 ممتاز جداً! حصلت على ١٥ نجمة 🌟");
    } else {
      triggerNotice("🎉 أحسنت عملاً!");
    }
    setTimeout(() => {
      setActiveHabit(null);
    }, 2500);
  };

  const startHabit = (h: HabitType) => {
    setActiveHabit(h);
    // Reset specific states
    if (h === "ROOM") setToysInBox([]);
    if (h === "HANDS") setBubbles([1, 2, 3, 4, 5, 6, 7, 8]);
    if (h === "TEETH") setTeethDirt(Array(10).fill(100));
    if (h === "WATER") setWaterLevel(100);
    if (h === "BREAKFAST") setEatenFood([]);
    if (h === "HAIR") setHairMessy(100);
    if (h === "FACE") setFaceSpots([1, 2, 3, 4]);
    if (h === "LAUNDRY") setLaundryInBasket([]);
    if (h === "BED") setBedState(0);
    if (h === "BOOK") setBookPage(0);
    if (h === "SLEEP") setLightsOn(true);
    if (h === "WUDU") setWuduStep(0);
    if (h === "PRAY") setPrayStep(0);
  };

  // --- 1. TEETH GAME ---
  const [teethDirt, setTeethDirt] = useState<number[]>(Array(10).fill(100));
  const handleBrushTooth = (index: number) => {
    if (teethDirt[index] > 0) {
      const newDirt = [...teethDirt];
      newDirt[index] = Math.max(0, newDirt[index] - 25);
      setTeethDirt(newDirt);
      if (newDirt.every(d => d === 0)) {
        completeHabit("TEETH");
      }
    }
  };

  // --- 2. ROOM TIDYING ---
  const [toysInBox, setToysInBox] = useState<number[]>([]);
  const toysList = [
    { id: 1, type: "🚗", x: 10, y: 30, color: "#EF4444" },
    { id: 2, type: "🧸", x: 70, y: 20, color: "#3B82F6" },
    { id: 3, type: "⚽", x: 40, y: 80, color: "#10B981" },
    { id: 4, type: "🎨", x: 85, y: 65, color: "#F59E0B" },
    { id: 5, type: "📚", x: 20, y: 70, color: "#8B5CF6" },
    { id: 6, type: "🧩", x: 60, y: 85, color: "#EC4899" },
    { id: 7, type: "✈️", x: 30, y: 15, color: "#6366F1" },
    { id: 8, type: "🚂", x: 15, y: 55, color: "#14B8A6" },
    { id: 9, type: "🎸", x: 75, y: 40, color: "#84CC16" },
    { id: 10, type: "🥁", x: 50, y: 45, color: "#F43F5E" }
  ];
  const handleDropToy = (id: number) => {
    if (!toysInBox.includes(id)) {
      const newBox = [...toysInBox, id];
      setToysInBox(newBox);
      if (newBox.length === toysList.length) completeHabit("ROOM");
    }
  };

  // --- 3. HANDS WASHING ---
  const [bubbles, setBubbles] = useState([1,2,3,4,5,6,7,8]);
  const handlePopBubble = (id: number) => {
    setBubbles(bubbles.filter(b => b !== id));
    if (bubbles.length === 1) completeHabit("HANDS");
  };

  // --- 4. BREAKFAST ---
  const [eatenFood, setEatenFood] = useState<number[]>([]);
  const foodList = [
    { id: 1, emoji: "🍎", name: "تفاحة" },
    { id: 2, emoji: "🥚", name: "بيضة" },
    { id: 3, emoji: "🥛", name: "حليب" }
  ];
  const handleEatFood = (id: number) => {
    if (!eatenFood.includes(id)) {
      const newFood = [...eatenFood, id];
      setEatenFood(newFood);
      if (newFood.length === foodList.length) completeHabit("BREAKFAST");
    }
  };

  // --- 5. DRINK WATER ---
  const [waterLevel, setWaterLevel] = useState(100);
  const handleDrink = () => {
    if (waterLevel > 0) {
      setWaterLevel(prev => Math.max(0, prev - 34));
      if (waterLevel - 34 <= 0) completeHabit("WATER");
    }
  };

  // --- 6. COMB HAIR ---
  const [hairMessy, setHairMessy] = useState(100);
  const handleComb = () => {
    if (hairMessy > 0) {
      setHairMessy(prev => Math.max(0, prev - 25));
      if (hairMessy - 25 <= 0) completeHabit("HAIR");
    }
  };

  // --- 7. WASH FACE ---
  const [faceSpots, setFaceSpots] = useState([1, 2, 3, 4]);
  const handleWashFace = (id: number) => {
    const newSpots = faceSpots.filter(s => s !== id);
    setFaceSpots(newSpots);
    if (newSpots.length === 0) completeHabit("FACE");
  };

  // --- 8. LAUNDRY ---
  const [laundryInBasket, setLaundryInBasket] = useState<number[]>([]);
  const laundryItems = [{id: 1, emoji: "👕", x: 20, y: 30}, {id: 2, emoji: "🧦", x: 70, y: 60}, {id: 3, emoji: "👖", x: 40, y: 80}, {id: 4, emoji: "👗", x: 80, y: 20}];
  const handleDropLaundry = (id: number) => {
    if (!laundryInBasket.includes(id)) {
      const newB = [...laundryInBasket, id];
      setLaundryInBasket(newB);
      if (newB.length === laundryItems.length) completeHabit("LAUNDRY");
    }
  };

  // --- 9. MAKE BED ---
  const [bedState, setBedState] = useState(0); // 0: messy, 1: blanket, 2: pillows
  const handleMakeBed = () => {
    if (bedState < 2) {
      setBedState(prev => prev + 1);
      if (bedState + 1 === 2) completeHabit("BED");
    }
  };

  // --- 10. READ BOOK ---
  const [bookPage, setBookPage] = useState(0);
  const handleTurnPage = () => {
    if (bookPage < 3) {
      setBookPage(prev => prev + 1);
      if (bookPage + 1 === 3) completeHabit("BOOK");
    }
  };

  // --- 11. SLEEP EARLY ---
  const [lightsOn, setLightsOn] = useState(true);
  const handleTurnOffLight = () => {
    if (lightsOn) {
      setLightsOn(false);
      completeHabit("SLEEP");
    }
  };

  // --- 12. WUDU ---
  const [wuduStep, setWuduStep] = useState(0);
  const wuduSteps = ["غسل اليدين", "المضمضة والاستنشاق", "غسل الوجه", "غسل اليدين للمرافق", "مسح الرأس والأذنين", "غسل الرجلين"];
  const handleWudu = () => {
    if (wuduStep < wuduSteps.length - 1) {
      setWuduStep(prev => prev + 1);
    } else {
      completeHabit("WUDU");
    }
  };

  // --- 13. PRAY ---
  const [prayStep, setPrayStep] = useState(0);
  const handlePray = () => {
    if (prayStep < 4) {
      setPrayStep(prev => prev + 1);
      if (prayStep + 1 === 4) completeHabit("PRAY");
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-gradient-to-b from-[#E0F2FE] via-[#F0FDFA] to-[#FAF7FD] select-none font-sans flex flex-col justify-between overflow-hidden">
      
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-[9990] select-none pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-3 border-[#D97706] text-[#D97706] font-black text-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-lg text-yellow-400">★</span>
          <span>نجومك: {globalStars}</span>
        </div>
      </div>
      
      <div className="absolute top-4 left-4 z-[9990] select-none pointer-events-auto flex items-center gap-2">
        {activeHabit && (
          <button
            onClick={() => setActiveHabit(null)}
            className="w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-full flex items-center justify-center cursor-pointer border-3 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowRight className="w-6 h-6 stroke-[3px]" />
          </button>
        )}
        <button
          onClick={onClose}
          className="w-12 h-12 bg-white hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center cursor-pointer border-3 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all"
        >
          <X className="w-6 h-6 stroke-[3px]" />
        </button>
      </div>

      <AnimatePresence>
        {noticeText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 inset-x-0 mx-auto w-fit max-w-sm px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{ borderColor: "#FF9F29", color: "#4D2B82" }}
          >
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow w-full flex items-center justify-center p-6 relative z-10 overflow-hidden overflow-y-auto">
        
        {!activeHabit ? (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl text-center pb-20">
            <h2 className="text-3xl font-black text-[#4D2B82] mb-2">🌟 عاداتي اليومية مع برعم 🌟</h2>
            <p className="text-sm font-extrabold text-purple-500 mb-8">ساعد صديقنا برعم في مهامه اليومية ليكون طفلاً رائعاً!</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              
              {[
                { id: "TEETH", title: "غسل الأسنان", icon: "🦷" },
                { id: "ROOM", title: "ترتيب الغرفة", icon: "🧸" },
                { id: "HANDS", title: "غسل اليدين", icon: "🧼" },
                { id: "BREAKFAST", title: "إفطار صحي", icon: "🍳" },
                { id: "WATER", title: "شرب الماء", icon: "💧" },
                { id: "HAIR", title: "تمشيط الشعر", icon: "梳" },
                { id: "FACE", title: "غسل الوجه", icon: "🙂" },
                { id: "LAUNDRY", title: "ملابس نظيفة", icon: "🧺" },
                { id: "BED", title: "ترتيب السرير", icon: "🛏️" },
                { id: "BOOK", title: "قراءة كتاب", icon: "📖" },
                { id: "WUDU", title: "الوضوء", icon: "🚰" },
                { id: "PRAY", title: "الصلاة", icon: "🕋" },
                { id: "SLEEP", title: "النوم مبكراً", icon: "😴" },
              ].map(habit => (
                <button
                  key={habit.id}
                  onClick={() => startHabit(habit.id as HabitType)}
                  className={\`card-bubbly p-4 bg-white flex flex-col items-center justify-center gap-2 border-4 rounded-3xl cursor-pointer transition-all hover:scale-105 \${completedHabits.includes(habit.id as HabitType) ? 'border-emerald-400 bg-emerald-50' : 'border-[#4D2B82] hover:bg-purple-50'}\`}
                >
                  <div className="text-5xl mb-1 relative">
                    {habit.id === "HAIR" ? "💇" : habit.icon}
                    {completedHabits.includes(habit.id as HabitType) && <CheckCircle className="absolute -top-1 -right-2 w-6 h-6 text-emerald-500 fill-white bg-white rounded-full" />}
                  </div>
                  <h3 className="text-sm font-black text-[#4D2B82]">{habit.title}</h3>
                </button>
              ))}

            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl h-[70vh] bg-white border-4 border-[#4D2B82] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Header Area */}
            <div className="bg-[#4D2B82] text-white p-4 text-center font-black text-xl rounded-b-3xl mx-auto px-8 shadow-md z-20">
              {activeHabit === "TEETH" && "مرر الفرشاة على كل سن لتنظيفه بفرشاة برعم!"}
              {activeHabit === "ROOM" && "اسحب الألعاب إلى صندوق الألعاب لترتيب الغرفة!"}
              {activeHabit === "HANDS" && "فرقع الفقاعات لغسل يدي برعم بالصابون!"}
              {activeHabit === "BREAKFAST" && "اسحب الطعام الصحي إلى فم برعم!"}
              {activeHabit === "WATER" && "اضغط على كوب الماء لتشرب حتى ترتوي!"}
              {activeHabit === "HAIR" && "مرر المشط على شعر برعم لترتيبه!"}
              {activeHabit === "FACE" && "اضغط على البقع لتنظيف وجه برعم!"}
              {activeHabit === "LAUNDRY" && "اجمع الملابس المتسخة في سلة الغسيل!"}
              {activeHabit === "BED" && "اضغط لترتيب غطاء السرير والوسائد!"}
              {activeHabit === "BOOK" && "اقلب الصفحات لإنهاء القصة المفيدة!"}
              {activeHabit === "SLEEP" && "أطفئ النور لنوم هادئ ومريح!"}
              {activeHabit === "WUDU" && \`خطوات الوضوء: \${wuduSteps[wuduStep]}\`}
              {activeHabit === "PRAY" && \`الصلاة: الركعة \${prayStep + 1} من 4\`}
            </div>

            {/* Game Content Area */}
            <div className="flex-grow relative bg-[#F8FAFC] flex items-center justify-center p-4">
              
              {/* --- 1. TEETH GAME --- */}
              {activeHabit === "TEETH" && (
                <div className="relative w-80 h-80 bg-[#FFB6C1] rounded-[60px] border-8 border-[#FF69B4] flex flex-col justify-between p-8">
                  {/* Top Teeth */}
                  <div className="flex justify-center gap-1">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} 
                           onMouseMove={() => handleBrushTooth(i)}
                           onTouchMove={() => handleBrushTooth(i)}
                           className="w-10 h-14 bg-white rounded-b-xl border-2 border-gray-200 shadow-sm relative overflow-hidden cursor-crosshair">
                        <div className="absolute inset-0 bg-[#8B4513] transition-opacity duration-300" style={{ opacity: teethDirt[i] / 100 }} />
                      </div>
                    ))}
                  </div>
                  {/* Bottom Teeth */}
                  <div className="flex justify-center gap-1">
                    {[5,6,7,8,9].map(i => (
                      <div key={i} 
                           onMouseMove={() => handleBrushTooth(i)}
                           onTouchMove={() => handleBrushTooth(i)}
                           className="w-10 h-14 bg-white rounded-t-xl border-2 border-gray-200 shadow-sm relative overflow-hidden cursor-crosshair">
                        <div className="absolute inset-0 bg-[#8B4513] transition-opacity duration-300" style={{ opacity: teethDirt[i] / 100 }} />
                      </div>
                    ))}
                  </div>
                  {/* Floating Toothbrush instruction */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                    <span className="text-8xl">🪥</span>
                  </div>
                </div>
              )}

              {/* --- 2. ROOM TIDYING --- */}
              {activeHabit === "ROOM" && (
                <div className="w-full h-full relative">
                  {/* Background details: Sofa, window, shelves */}
                  <div className="absolute bottom-20 left-10 w-48 h-24 bg-[#FDA4AF] rounded-xl border-4 border-[#E11D48] flex items-end shadow-md">
                    <div className="w-full h-1/2 bg-[#E11D48] opacity-50 rounded-b-lg"></div>
                    <span className="absolute -top-10 left-16 text-6xl">🛋️</span>
                  </div>
                  <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 border-8 border-white shadow-lg flex items-center justify-center rounded-md">
                    <span className="text-4xl">☀️</span>
                  </div>
                  <div className="absolute top-20 right-20 w-40 h-4 bg-[#8B4513] rounded shadow-md">
                    <span className="absolute -top-10 left-2 text-4xl">🪴</span>
                    <span className="absolute -top-10 left-20 text-4xl">📚</span>
                  </div>

                  {/* Toy Box */}
                  <div className="absolute bottom-5 right-5 w-40 h-32 bg-[#FCD34D] border-4 border-[#D97706] rounded-xl shadow-xl flex items-center justify-center z-10">
                    <span className="text-4xl">📦</span>
                  </div>
                  
                  {/* Toys to drag */}
                  {toysList.map(toy => !toysInBox.includes(toy.id) && (
                    <motion.div
                      key={toy.id}
                      drag
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        // Check if dropped near the box
                        if (info.point.x > window.innerWidth / 2 && info.point.y > window.innerHeight / 2) {
                          handleDropToy(toy.id);
                        }
                      }}
                      initial={{ left: \`\${toy.x}%\`, top: \`\${toy.y}%\` }}
                      className="absolute text-5xl cursor-grab active:cursor-grabbing z-30"
                    >
                      {toy.type}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* --- 3. HANDS WASHING --- */}
              {activeHabit === "HANDS" && (
                <div className="relative w-80 h-80 flex items-center justify-center">
                  <span className="text-[150px]">👐</span>
                  {bubbles.map(b => (
                    <motion.div
                      key={b}
                      onClick={() => handlePopBubble(b)}
                      className="absolute w-12 h-12 rounded-full bg-blue-200/60 border border-blue-300 shadow-inner flex items-center justify-center cursor-pointer backdrop-blur-sm"
                      style={{
                        top: \`\${20 + Math.random() * 60}%\`,
                        left: \`\${20 + Math.random() * 60}%\`
                      }}
                      animate={{ y: [-5, 5, -5], x: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 2 + Math.random() }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}

              {/* --- 4. BREAKFAST --- */}
              {activeHabit === "BREAKFAST" && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="text-[120px] mb-10">😋</div>
                  <div className="flex gap-8">
                    {foodList.map(food => !eatenFood.includes(food.id) && (
                      <motion.div
                        key={food.id}
                        drag
                        dragMomentum={false}
                        onDragEnd={(e, info) => {
                          if (info.point.y < window.innerHeight / 2) handleEatFood(food.id);
                        }}
                        className="text-6xl cursor-grab active:cursor-grabbing bg-white p-4 rounded-full shadow-lg border-4 border-yellow-300"
                      >
                        {food.emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- 5. WATER --- */}
              {activeHabit === "WATER" && (
                <div className="flex flex-col items-center cursor-pointer" onClick={handleDrink}>
                  <div className="w-32 h-48 border-4 border-blue-300 rounded-b-2xl bg-white relative overflow-hidden shadow-inner">
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-400"
                      animate={{ height: \`\${waterLevel}%\` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="mt-4 text-xl font-bold text-blue-600">اضغط لتشرب!</p>
                </div>
              )}

              {/* --- 6. HAIR --- */}
              {activeHabit === "HAIR" && (
                <div className="relative w-64 h-64 flex flex-col items-center justify-center cursor-ns-resize" onMouseMove={handleComb} onTouchMove={handleComb}>
                  <div className="w-48 h-48 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-orange-300 relative">
                    <span className="text-[100px] mt-10">👦</span>
                    {/* Messy hair overlay */}
                    <motion.div className="absolute top-0 inset-x-0 h-24 bg-orange-800"
                      style={{ clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 60% 80%, 40% 100%, 20% 80%)", opacity: hairMessy / 100 }}
                    />
                  </div>
                </div>
              )}

              {/* --- 7. FACE --- */}
              {activeHabit === "FACE" && (
                <div className="relative w-64 h-64 bg-orange-100 rounded-full border-4 border-orange-200 flex items-center justify-center shadow-lg">
                  <span className="text-[120px]">👦</span>
                  {faceSpots.map(spot => (
                    <div key={spot} onClick={() => handleWashFace(spot)} 
                         className="absolute w-8 h-8 bg-amber-800/60 rounded-full cursor-pointer hover:scale-110"
                         style={{ 
                           top: spot === 1 ? '30%' : spot === 2 ? '40%' : spot === 3 ? '60%' : '50%',
                           left: spot === 1 ? '20%' : spot === 2 ? '70%' : spot === 3 ? '30%' : '75%' 
                         }}
                    />
                  ))}
                </div>
              )}

              {/* --- 8. LAUNDRY --- */}
              {activeHabit === "LAUNDRY" && (
                <div className="w-full h-full relative">
                  <div className="absolute bottom-10 right-10 text-[100px] z-10">🧺</div>
                  {laundryItems.map(item => !laundryInBasket.includes(item.id) && (
                    <motion.div
                      key={item.id}
                      drag
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        if (info.point.x > window.innerWidth / 2) handleDropLaundry(item.id);
                      }}
                      className="absolute text-6xl cursor-grab z-20"
                      style={{ top: \`\${item.y}%\`, left: \`\${item.x}%\` }}
                    >
                      {item.emoji}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* --- 9. MAKE BED --- */}
              {activeHabit === "BED" && (
                <div className="w-80 h-96 bg-blue-100 rounded-3xl border-4 border-blue-300 relative cursor-pointer flex flex-col justify-end p-4 shadow-xl" onClick={handleMakeBed}>
                  <div className="w-full h-1/4 flex gap-2 mb-2">
                    <motion.div className="w-1/2 bg-white rounded-xl shadow-md border-2 border-gray-100" animate={{ y: bedState >= 2 ? 0 : 20, rotate: bedState >= 2 ? 0 : -10 }} />
                    <motion.div className="w-1/2 bg-white rounded-xl shadow-md border-2 border-gray-100" animate={{ y: bedState >= 2 ? 0 : 30, rotate: bedState >= 2 ? 0 : 15 }} />
                  </div>
                  <motion.div 
                    className="w-full bg-blue-400 rounded-t-xl border-4 border-blue-500 shadow-inner"
                    animate={{ height: bedState >= 1 ? '75%' : '40%' }}
                  />
                  <p className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white/50 pointer-events-none">اضغط للترتيب</p>
                </div>
              )}

              {/* --- 10. BOOK --- */}
              {activeHabit === "BOOK" && (
                <div className="w-96 h-64 bg-white rounded-r-3xl border-l-[10px] border-[#4D2B82] shadow-2xl flex items-center justify-center cursor-pointer" onClick={handleTurnPage}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{bookPage === 0 ? "🦁" : bookPage === 1 ? "🐘" : bookPage === 2 ? "🦒" : "✨"}</div>
                    <p className="text-2xl font-bold text-[#4D2B82]">صفحة {bookPage + 1}</p>
                    <p className="text-sm text-gray-500 mt-2">اضغط لقلب الصفحة</p>
                  </div>
                </div>
              )}

              {/* --- 11. SLEEP --- */}
              {activeHabit === "SLEEP" && (
                <div className={\`w-full h-full relative transition-colors duration-1000 flex items-center justify-center \${lightsOn ? 'bg-yellow-50' : 'bg-[#0F172A]'}\`}>
                  {lightsOn ? (
                    <div className="flex flex-col items-center">
                      <div className="text-[100px]">👦</div>
                      <button onClick={handleTurnOffLight} className="mt-8 px-6 py-3 bg-blue-500 text-white font-bold rounded-full text-xl shadow-lg hover:scale-105 active:scale-95">أطفئ النور</button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-[100px] mb-4">😴</div>
                      <motion.div animate={{ y: [-10, -30], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl text-white">zZz</motion.div>
                    </div>
                  )}
                </div>
              )}

              {/* --- 12. WUDU --- */}
              {activeHabit === "WUDU" && (
                <div className="flex flex-col items-center justify-center cursor-pointer" onClick={handleWudu}>
                  <div className="w-48 h-48 bg-blue-100 rounded-full border-8 border-blue-400 flex items-center justify-center overflow-hidden">
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-[100px]">💦</motion.div>
                  </div>
                  <div className="mt-8 px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-full text-xl shadow-md">
                    اضغط للمتابعة
                  </div>
                </div>
              )}

              {/* --- 13. PRAY --- */}
              {activeHabit === "PRAY" && (
                <div className="flex flex-col items-center justify-center cursor-pointer" onClick={handlePray}>
                  <div className="w-64 h-96 bg-[#10B981] rounded-t-full border-8 border-[#047857] flex flex-col items-center justify-end p-8 shadow-2xl relative overflow-hidden">
                     {/* Pattern decoration */}
                     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                     <motion.div animate={{ y: prayStep % 2 === 0 ? 0 : 40 }} className="text-[100px] z-10">👦</motion.div>
                  </div>
                  <div className="mt-6 text-xl font-bold text-emerald-700 bg-emerald-100 px-6 py-2 rounded-full shadow-sm">
                    اضغط لأداء الركعة
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/components/DailyHabitsGame.tsx', code);
console.log('Done writing DailyHabitsGame.tsx');
