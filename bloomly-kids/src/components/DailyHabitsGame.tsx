import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { ScreenOrientation } from '@capacitor/screen-orientation';

interface DailyHabitsGameProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
}

type HabitType = "TEETH" | "ROOM" | "WASH" | "BREAKFAST" | "WATER" | "HAIR" | "LAUNDRY" | "BED" | "SLEEP";

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

  const triggerNotice = (text: string, isError = false) => {
    setNoticeText(isError ? "❌ " + text : text);
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
    if (h === "ROOM") {
      setRoomItems(initialRoomItems);
    }
    if (h === "WASH") {
      setWashPhase("FACE");
      setFaceSpots([1, 2, 3, 4]);
      setHandBubbles([1, 2, 3, 4, 5, 6, 7, 8]);
    }
    if (h === "TEETH") {
      setTeethDirt(Array(10).fill(100));
    }
    if (h === "WATER") setWaterLevel(100);
    if (h === "BREAKFAST") {
      setBreakfastItems(initialBreakfastItems);
    }
    if (h === "HAIR") {
      setHairMessy(100);
    }
    if (h === "BED") {
      setPlacedBedItems([]);
    }
    if (h === "SLEEP") setLightsOn(true);
  };

  // --- 1. TEETH GAME ---
  const [teethDirt, setTeethDirt] = useState<number[]>(Array(10).fill(100));
  const handleBrushTooth = (index: number) => {
    if (teethDirt[index] > 0) {
      const newDirt = [...teethDirt];
      newDirt[index] = Math.max(0, newDirt[index] - 5); // slow brushing
      setTeethDirt(newDirt);
      if (newDirt.every(d => d === 0)) {
        completeHabit("TEETH");
      }
    }
  };

  // --- 2. ROOM TIDYING (3 Boxes) ---
  type RoomItemType = "TOY" | "CLOTHES" | "OTHER";
  const initialRoomItems = [
    { id: 1, type: "TOY" as RoomItemType, emoji: "🚗", x: 10, y: 20 },
    { id: 2, type: "TOY" as RoomItemType, emoji: "🧸", x: 70, y: 15 },
    { id: 3, type: "CLOTHES" as RoomItemType, emoji: "👕", x: 30, y: 70 },
    { id: 4, type: "CLOTHES" as RoomItemType, emoji: "🧦", x: 80, y: 65 },
    { id: 5, type: "OTHER" as RoomItemType, emoji: "📚", x: 20, y: 50 },
    { id: 6, type: "OTHER" as RoomItemType, emoji: "🎒", x: 60, y: 80 }
  ];
  const [roomItems, setRoomItems] = useState(initialRoomItems);
  
  const handleDropRoomItem = (id: number, boxType: RoomItemType) => {
    const item = roomItems.find(i => i.id === id);
    if (item && item.type === boxType) {
      const newItems = roomItems.filter(i => i.id !== id);
      setRoomItems(newItems);
      if (newItems.length === 0) completeHabit("ROOM");
    } else {
      triggerNotice("هذا ليس الصندوق الصحيح!", true);
    }
  };

  // --- 3. WASH (Face & Hands Combo) ---
  const [washPhase, setWashPhase] = useState<"FACE" | "HANDS">("FACE");
  const [faceSpots, setFaceSpots] = useState([1, 2, 3, 4]);
  const [handBubbles, setHandBubbles] = useState([1,2,3,4,5,6,7,8]);

  const handleWashFace = (id: number) => {
    const newSpots = faceSpots.filter(s => s !== id);
    setFaceSpots(newSpots);
    if (newSpots.length === 0) {
      setTimeout(() => setWashPhase("HANDS"), 1000); // Transition to hands
    }
  };
  const handlePopBubble = (id: number) => {
    const newBubbles = handBubbles.filter(b => b !== id);
    setHandBubbles(newBubbles);
    if (newBubbles.length === 0) completeHabit("WASH");
  };

  // --- 4. BREAKFAST ---
  const initialBreakfastItems = [
    { id: 1, isHealthy: true, emoji: "🍎" },
    { id: 2, isHealthy: true, emoji: "🥛" },
    { id: 3, isHealthy: true, emoji: "🥚" },
    { id: 4, isHealthy: false, emoji: "🍬" },
    { id: 5, isHealthy: false, emoji: "🥤" },
  ];
  const [breakfastItems, setBreakfastItems] = useState(initialBreakfastItems);
  const handleFeed = (id: number) => {
    const item = breakfastItems.find(i => i.id === id);
    if (item) {
      if (item.isHealthy) {
        const newItems = breakfastItems.filter(i => i.id !== id);
        setBreakfastItems(newItems);
        if (newItems.filter(i => i.isHealthy).length === 0) {
          completeHabit("BREAKFAST");
        }
      } else {
        triggerNotice("هذا طعام غير صحي! يضر الأسنان والصحة.", true);
      }
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
      setHairMessy(prev => Math.max(0, prev - 2)); // Takes time
      if (hairMessy - 2 <= 0) completeHabit("HAIR");
    }
  };

  // --- 7. MAKE BED ---
  const [placedBedItems, setPlacedBedItems] = useState<string[]>([]);
  const handlePlaceBedItem = (item: string) => {
    if (!placedBedItems.includes(item)) {
      const newItems = [...placedBedItems, item];
      setPlacedBedItems(newItems);
      if (newItems.length === 3) completeHabit("BED"); // 2 pillows + 1 blanket
    }
  };

  // --- 8. SLEEP EARLY ---
  const [lightsOn, setLightsOn] = useState(true);
  const handleTurnOffLight = () => {
    if (lightsOn) {
      setLightsOn(false);
      completeHabit("SLEEP");
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
            className="absolute top-24 inset-x-0 mx-auto w-fit px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{ borderColor: noticeText.includes("❌") ? "#EF4444" : "#FF9F29", color: noticeText.includes("❌") ? "#EF4444" : "#4D2B82" }}
          >
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow w-full flex items-center justify-center p-6 relative z-10 overflow-hidden overflow-y-auto">
        
        {!activeHabit ? (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl text-center pb-20 mt-16">
            <h2 className="text-3xl font-black text-[#4D2B82] mb-2">🌟 عاداتي اليومية مع برعم 🌟</h2>
            <p className="text-sm font-extrabold text-purple-500 mb-8">ساعد صديقنا برعم في مهامه اليومية ليكون طفلاً رائعاً!</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              
              {[
                { id: "TEETH", title: "غسل الأسنان", icon: "🦷" },
                { id: "ROOM", title: "الغرفة النظيفة", icon: "🧸" },
                { id: "WASH", title: "النظافة الشخصية", icon: "🧼" },
                { id: "BREAKFAST", title: "إفطار صحي", icon: "🍳" },
                { id: "WATER", title: "شرب الماء", icon: "💧" },
                { id: "HAIR", title: "تمشيط الشعر", icon: "🪮" },
                { id: "BED", title: "ترتيب السرير", icon: "🛏️" },
                { id: "SLEEP", title: "النوم مبكراً", icon: "😴" },
              ].map(habit => (
                <button
                  key={habit.id}
                  onClick={() => startHabit(habit.id as HabitType)}
                  className={`card-bubbly p-4 bg-white flex flex-col items-center justify-center gap-2 border-4 rounded-3xl cursor-pointer transition-all hover:scale-105 ${completedHabits.includes(habit.id as HabitType) ? 'border-emerald-400 bg-emerald-50' : 'border-[#4D2B82] hover:bg-purple-50'}`}
                >
                  <div className="text-5xl mb-1 relative">
                    {habit.icon}
                    {completedHabits.includes(habit.id as HabitType) && <CheckCircle className="absolute -top-1 -right-2 w-6 h-6 text-emerald-500 fill-white bg-white rounded-full shadow-md" />}
                  </div>
                  <h3 className="text-sm font-black text-[#4D2B82]">{habit.title}</h3>
                </button>
              ))}

            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl h-[70vh] bg-white border-4 border-[#4D2B82] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col mt-8">
            
            {/* Header Area */}
            <div className="bg-[#4D2B82] text-white p-4 text-center font-black text-xl rounded-b-3xl mx-auto px-8 shadow-md z-20">
              {activeHabit === "TEETH" && "أمسك الفرشاة 🪥 ونظف كل أسنان برعم!"}
              {activeHabit === "ROOM" && "اسحب الألعاب، الملابس، والأشياء للصناديق الصحيحة!"}
              {activeHabit === "WASH" && (washPhase === "FACE" ? "أمسك الصابونة 🧼 وامسح البقع من وجه برعم!" : "فرقع الفقاعات لغسل اليدين!")}
              {activeHabit === "BREAKFAST" && "اسحب الطعام الصحي 🍎 إلى فم برعم واحذر من غير الصحي!"}
              {activeHabit === "WATER" && "اضغط على كوب الماء لتشرب حتى ترتوي!"}
              {activeHabit === "HAIR" && "أمسك المشط 🪮 وسرح شعر برعم ببطء لترتيبه!"}
              {activeHabit === "BED" && "اسحب المخدات والغطاء إلى أماكنها لترتيب السرير!"}
              {activeHabit === "SLEEP" && "أطفئ النور لنوم هادئ ومريح!"}
            </div>

            {/* Game Content Area */}
            <div className="flex-grow relative bg-[#F8FAFC] flex items-center justify-center p-4">
              
              {/* --- 1. TEETH GAME --- */}
              {activeHabit === "TEETH" && (
                <div className="relative w-80 h-80 bg-[#FFB6C1] rounded-[60px] border-8 border-[#FF69B4] flex flex-col justify-between p-8"
                     style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" style=\"font-size:30px\"><text y=\"30\">🪥</text></svg>'), auto" }}>
                  {/* Top Teeth */}
                  <div className="flex justify-center gap-1">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} 
                           onMouseMove={() => handleBrushTooth(i)}
                           onTouchMove={() => handleBrushTooth(i)}
                           className="w-10 h-14 bg-white rounded-b-xl border-2 border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#8B4513] transition-opacity duration-100" style={{ opacity: teethDirt[i] / 100 }} />
                      </div>
                    ))}
                  </div>
                  {/* Bottom Teeth */}
                  <div className="flex justify-center gap-1">
                    {[5,6,7,8,9].map(i => (
                      <div key={i} 
                           onMouseMove={() => handleBrushTooth(i)}
                           onTouchMove={() => handleBrushTooth(i)}
                           className="w-10 h-14 bg-white rounded-t-xl border-2 border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#8B4513] transition-opacity duration-100" style={{ opacity: teethDirt[i] / 100 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- 2. ROOM TIDYING --- */}
              {activeHabit === "ROOM" && (
                <div className="w-full h-full relative">
                  {/* 3 Boxes */}
                  <div className="absolute bottom-10 inset-x-0 flex justify-center gap-8 z-10">
                    <div className="w-32 h-28 bg-[#FCD34D] border-4 border-[#D97706] rounded-xl shadow-xl flex flex-col items-center justify-center" id="box-TOY">
                      <span className="text-3xl">🧸</span>
                      <span className="font-bold text-[#D97706]">ألعاب</span>
                    </div>
                    <div className="w-32 h-28 bg-[#93C5FD] border-4 border-[#2563EB] rounded-xl shadow-xl flex flex-col items-center justify-center" id="box-CLOTHES">
                      <span className="text-3xl">👕</span>
                      <span className="font-bold text-[#2563EB]">ملابس</span>
                    </div>
                    <div className="w-32 h-28 bg-[#D8B4E2] border-4 border-[#9333EA] rounded-xl shadow-xl flex flex-col items-center justify-center" id="box-OTHER">
                      <span className="text-3xl">📚</span>
                      <span className="font-bold text-[#9333EA]">أخرى</span>
                    </div>
                  </div>
                  
                  {/* Draggable Items */}
                  {roomItems.map(item => (
                    <motion.div
                      key={item.id}
                      drag
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        const x = info.point.x;
                        const w = window.innerWidth;
                        let droppedBox: RoomItemType | null = null;
                        
                        if (x > w/2 - 200 && x < w/2 - 80) droppedBox = "TOY";
                        else if (x >= w/2 - 80 && x <= w/2 + 80) droppedBox = "CLOTHES";
                        else if (x > w/2 + 80 && x < w/2 + 200) droppedBox = "OTHER";

                        if (info.point.y > window.innerHeight / 2 && droppedBox) {
                          handleDropRoomItem(item.id, droppedBox);
                        }
                      }}
                      initial={{ left: `${item.x}%`, top: `${item.y}%` }}
                      className="absolute text-5xl cursor-grab active:cursor-grabbing z-30 drop-shadow-md bg-white/50 p-2 rounded-full"
                    >
                      {item.emoji}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* --- 3. WASH (Face & Hands) --- */}
              {activeHabit === "WASH" && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    {washPhase === "FACE" ? (
                      <motion.div key="face" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                                  className="relative w-80 h-80 bg-orange-100 rounded-[80px] border-4 border-orange-200 flex items-center justify-center shadow-lg"
                                  style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" style=\"font-size:30px\"><text y=\"30\">🧼</text></svg>'), auto" }}>
                        <span className="text-[140px] select-none">👦</span>
                        {faceSpots.map(spot => (
                          <div key={spot} 
                               onMouseMove={() => handleWashFace(spot)}
                               onTouchMove={() => handleWashFace(spot)}
                               className="absolute w-12 h-12 bg-amber-800/80 rounded-full blur-[2px]"
                               style={{ 
                                 top: spot === 1 ? '25%' : spot === 2 ? '45%' : spot === 3 ? '60%' : '50%',
                                 left: spot === 1 ? '30%' : spot === 2 ? '65%' : spot === 3 ? '35%' : '70%' 
                               }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div key="hands" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                  className="relative w-80 h-80 flex items-center justify-center bg-blue-50 rounded-full border-4 border-blue-200">
                        <span className="text-[140px]">👐</span>
                        {handBubbles.map(b => (
                          <motion.div
                            key={b}
                            onMouseMove={() => handlePopBubble(b)}
                            onTouchMove={() => handlePopBubble(b)}
                            className="absolute w-16 h-16 rounded-full bg-blue-200/60 border border-blue-300 shadow-inner flex items-center justify-center cursor-pointer backdrop-blur-sm"
                            style={{ top: `${10 + Math.random() * 70}%`, left: `${10 + Math.random() * 70}%` }}
                            animate={{ y: [-5, 5, -5], x: [-2, 2, -2] }}
                            transition={{ repeat: Infinity, duration: 2 + Math.random() }}
                          >
                            🫧
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* --- 4. BREAKFAST --- */}
              {activeHabit === "BREAKFAST" && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  {/* Mouth target */}
                  <div className="absolute text-[150px] mb-20 z-10 opacity-90">😋</div>
                  
                  {/* Food items scattered around */}
                  {breakfastItems.map(food => (
                    <motion.div
                      key={food.id}
                      drag
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        // If dragged near center
                        const w = window.innerWidth;
                        const h = window.innerHeight;
                        if (Math.abs(info.point.x - w/2) < 100 && Math.abs(info.point.y - h/2) < 100) {
                          handleFeed(food.id);
                        }
                      }}
                      initial={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
                      className="absolute text-7xl cursor-grab active:cursor-grabbing bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg border-4 border-yellow-300 z-30"
                    >
                      {food.emoji}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* --- 5. WATER --- */}
              {activeHabit === "WATER" && (
                <div className="flex flex-col items-center cursor-pointer" onClick={handleDrink}>
                  <div className="w-32 h-48 border-4 border-blue-300 rounded-b-2xl bg-white relative overflow-hidden shadow-inner">
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-400"
                      animate={{ height: `${waterLevel}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="mt-4 text-xl font-bold text-blue-600">اضغط لتشرب!</p>
                </div>
              )}

              {/* --- 6. HAIR --- */}
              {activeHabit === "HAIR" && (
                <div className="relative w-80 h-80 flex flex-col items-center justify-center" 
                     style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"50\" style=\"font-size:40px\"><text y=\"40\">🪮</text></svg>'), auto" }}>
                  <div className="w-64 h-64 bg-orange-100 rounded-[100px] flex items-center justify-center overflow-hidden border-4 border-orange-200 relative">
                    <span className="text-[140px] mt-10 select-none">👦</span>
                    {/* Messy hair overlay */}
                    <div className="absolute top-0 inset-x-0 h-32"
                         onMouseMove={handleComb} onTouchMove={handleComb}>
                      <motion.div className="w-full h-full bg-orange-800/90"
                        style={{ clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 70% 80%, 50% 100%, 30% 80%, 10% 100%)", opacity: hairMessy / 100 }}
                      />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-48 h-4 bg-gray-200 rounded-full mt-8 overflow-hidden border border-gray-300">
                    <motion.div className="h-full bg-emerald-400" style={{ width: `${100 - hairMessy}%` }} />
                  </div>
                </div>
              )}

              {/* --- 7. MAKE BED --- */}
              {activeHabit === "BED" && (
                <div className="w-full h-full relative flex items-center justify-center">
                  {/* The Bed */}
                  <div className="w-80 h-[28rem] bg-amber-100 rounded-3xl border-8 border-amber-600 relative flex flex-col justify-end p-4 shadow-xl">
                    
                    {/* Pillow 1 Placeholder */}
                    <div className={`absolute top-4 left-6 w-32 h-16 rounded-xl border-4 border-dashed ${placedBedItems.includes('pillow1') ? 'border-transparent' : 'border-amber-400/50 bg-amber-50/30'}`} />
                    {/* Pillow 2 Placeholder */}
                    <div className={`absolute top-4 right-6 w-32 h-16 rounded-xl border-4 border-dashed ${placedBedItems.includes('pillow2') ? 'border-transparent' : 'border-amber-400/50 bg-amber-50/30'}`} />
                    
                    {/* Blanket Placeholder */}
                    <div className={`absolute bottom-0 inset-x-0 h-3/4 rounded-t-xl border-4 border-dashed ${placedBedItems.includes('blanket') ? 'border-transparent' : 'border-amber-400/50 bg-amber-50/30'}`} />
                    
                    {/* Placed Items */}
                    {placedBedItems.includes('pillow1') && <div className="absolute top-4 left-6 w-32 h-16 bg-white rounded-xl shadow-md border-2 border-gray-200 flex items-center justify-center text-3xl">☁️</div>}
                    {placedBedItems.includes('pillow2') && <div className="absolute top-4 right-6 w-32 h-16 bg-white rounded-xl shadow-md border-2 border-gray-200 flex items-center justify-center text-3xl">☁️</div>}
                    {placedBedItems.includes('blanket') && <div className="absolute bottom-0 inset-x-0 h-3/4 bg-blue-400 rounded-t-xl border-4 border-blue-500 shadow-inner flex items-center justify-center text-5xl">🌌</div>}
                  </div>

                  {/* Draggable Pillow 1 */}
                  {!placedBedItems.includes('pillow1') && (
                    <motion.div drag dragMomentum={false}
                      onDragEnd={(e, info) => { if (info.point.y < window.innerHeight/2 && info.point.x < window.innerWidth/2) handlePlaceBedItem('pillow1'); }}
                      className="absolute bottom-10 left-10 w-32 h-16 bg-white rounded-xl shadow-xl border-2 border-gray-200 cursor-grab active:cursor-grabbing z-30 flex items-center justify-center text-3xl"
                    >☁️</motion.div>
                  )}
                  {/* Draggable Pillow 2 */}
                  {!placedBedItems.includes('pillow2') && (
                    <motion.div drag dragMomentum={false}
                      onDragEnd={(e, info) => { if (info.point.y < window.innerHeight/2 && info.point.x > window.innerWidth/2) handlePlaceBedItem('pillow2'); }}
                      className="absolute bottom-10 right-10 w-32 h-16 bg-white rounded-xl shadow-xl border-2 border-gray-200 cursor-grab active:cursor-grabbing z-30 flex items-center justify-center text-3xl"
                    >☁️</motion.div>
                  )}
                  {/* Draggable Blanket */}
                  {!placedBedItems.includes('blanket') && (
                    <motion.div drag dragMomentum={false}
                      onDragEnd={(e, info) => { if (info.point.y > window.innerHeight/2) handlePlaceBedItem('blanket'); }}
                      className="absolute top-1/2 left-10 w-40 h-40 bg-blue-400 rounded-xl shadow-xl border-4 border-blue-500 cursor-grab active:cursor-grabbing z-30 flex items-center justify-center text-5xl"
                    >🌌</motion.div>
                  )}
                </div>
              )}

              {/* --- 8. SLEEP --- */}
              {activeHabit === "SLEEP" && (
                <div className={`w-full h-full relative transition-colors duration-1000 flex items-center justify-center ${lightsOn ? 'bg-yellow-50' : 'bg-[#0F172A]'}`}>
                  {lightsOn ? (
                    <div className="flex flex-col items-center">
                      <div className="text-[120px]">👦</div>
                      <button onClick={handleTurnOffLight} className="mt-8 px-8 py-4 bg-blue-500 text-white font-bold rounded-full text-2xl shadow-lg hover:scale-105 active:scale-95 border-4 border-blue-600">أطفئ النور للوم</button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-[120px] mb-4">😴</div>
                      <motion.div animate={{ y: [-10, -30], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-5xl text-white font-black">zZz</motion.div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
