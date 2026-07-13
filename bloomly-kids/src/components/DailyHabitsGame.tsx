import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { ScreenOrientation } from '@capacitor/screen-orientation';

interface DailyHabitsGameProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
}

type HabitType = "TEETH" | "ROOM" | "WASH" | "BREAKFAST" | "HAIR" | "BED";
type RoomItemType = "TOY" | "CLOTHES" | "TRASH";

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
    const end = Date.now() + 2000;
    const frame = () => {
      confetti({
        particleCount: 5, angle: 60, spread: 55, origin: { x: 0 },
        colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
        zIndex: 99999
      });
      confetti({
        particleCount: 5, angle: 120, spread: 55, origin: { x: 1 },
        colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
        zIndex: 99999
      });
      if (Date.now() < end && document.getElementById("daily-habits-container")) {
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

  const initialRoomItems = [
    { id: 1, type: "TOY" as RoomItemType, emoji: "🚗" },
    { id: 2, type: "TOY" as RoomItemType, emoji: "🧸" },
    { id: 3, type: "TOY" as RoomItemType, emoji: "⚽" },
    { id: 4, type: "CLOTHES" as RoomItemType, emoji: "👕" },
    { id: 5, type: "CLOTHES" as RoomItemType, emoji: "🧦" },
    { id: 6, type: "CLOTHES" as RoomItemType, emoji: "👖" },
    { id: 7, type: "TRASH" as RoomItemType, emoji: "🍌" },
    { id: 8, type: "TRASH" as RoomItemType, emoji: "🧻" },
    { id: 9, type: "TRASH" as RoomItemType, emoji: "🗑️" }
  ].sort(() => Math.random() - 0.5);

  const initialBreakfastItems = [
    { id: 1, isHealthy: true, emoji: "🍎" },
    { id: 2, isHealthy: true, emoji: "🥛" },
    { id: 3, isHealthy: true, emoji: "🥚" },
    { id: 4, isHealthy: false, emoji: "🍬" },
    { id: 5, isHealthy: false, emoji: "🥤" },
  ].sort(() => Math.random() - 0.5);

  const [roomItems, setRoomItems] = useState(initialRoomItems);
  const [washPhase, setWashPhase] = useState<"FACE" | "HANDS">("FACE");
  const [faceSpots, setFaceSpots] = useState([1, 2, 3, 4]);
  const [handBubbles, setHandBubbles] = useState([1,2,3,4,5,6,7,8]);
  const [teethDirt, setTeethDirt] = useState<number[]>(Array(10).fill(100));
  const [breakfastItems, setBreakfastItems] = useState(initialBreakfastItems);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [hairMessy, setHairMessy] = useState(100);
  const [placedBedItems, setPlacedBedItems] = useState<string[]>([]);

  const startHabit = (h: HabitType) => {
    setActiveHabit(h);
    if (h === "ROOM") setRoomItems(initialRoomItems);
    if (h === "WASH") {
      setWashPhase("FACE"); setFaceSpots([1, 2, 3, 4]); setHandBubbles([1, 2, 3, 4, 5, 6, 7, 8]);
    }
    if (h === "TEETH") setTeethDirt(Array(10).fill(100));
    if (h === "BREAKFAST") { setBreakfastItems(initialBreakfastItems); setIsMouthOpen(false); }
    if (h === "HAIR") setHairMessy(100);
    if (h === "BED") setPlacedBedItems([]);
  };

  // --- Helper to check drop zone with scroll offset ---
  const checkDropZone = (info: any, selector: string): Element | null => {
    let foundTarget: Element | null = null;
    const targets = document.querySelectorAll(selector);
    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const left = rect.left + window.scrollX;
      const right = rect.right + window.scrollX;
      const top = rect.top + window.scrollY;
      const bottom = rect.bottom + window.scrollY;
      
      if (info.point.x >= left && info.point.x <= right &&
          info.point.y >= top && info.point.y <= bottom) {
        foundTarget = target;
      }
    });
    return foundTarget;
  };

  // --- 1. TEETH ---
  const handleBrushTooth = (index: number) => {
    if (teethDirt[index] > 0) {
      const newDirt = [...teethDirt];
      newDirt[index] = Math.max(0, newDirt[index] - 5);
      setTeethDirt(newDirt);
      if (newDirt.every(d => d === 0)) completeHabit("TEETH");
    }
  };

  // --- 2. ROOM ---
  const handleDropRoomItem = (e: any, info: any, item: any) => {
    const target = checkDropZone(info, '[data-box]');
    let boxId = target ? target.getAttribute('data-box') : null;
    
    if (boxId) {
      if (boxId === item.type) {
        const newItems = roomItems.filter(i => i.id !== item.id);
        setRoomItems(newItems);
        if (newItems.length === 0) completeHabit("ROOM");
      } else {
        triggerNotice("هذا ليس الصندوق الصحيح!", true);
      }
    }
  };

  // --- 3. WASH ---
  const handleWashFace = (id: number) => {
    const newSpots = faceSpots.filter(s => s !== id);
    setFaceSpots(newSpots);
    if (newSpots.length === 0) setTimeout(() => setWashPhase("HANDS"), 1000);
  };
  const handlePopBubble = (id: number) => {
    const newBubbles = handBubbles.filter(b => b !== id);
    setHandBubbles(newBubbles);
    if (newBubbles.length === 0) completeHabit("WASH");
  };

  // --- 4. BREAKFAST ---
  const handleBreakfastDrag = (e: any, info: any) => {
    const target = checkDropZone(info, '[data-mouth]');
    setIsMouthOpen(!!target);
  };
  
  const handleBreakfastDrop = (e: any, info: any, item: any) => {
    setIsMouthOpen(false);
    const target = checkDropZone(info, '[data-mouth]');
    
    if (target) {
      if (item.isHealthy) {
        const newItems = breakfastItems.filter(i => i.id !== item.id);
        setBreakfastItems(newItems);
        if (newItems.filter(i => i.isHealthy).length === 0) completeHabit("BREAKFAST");
      } else {
        triggerNotice("هذا طعام غير صحي! يضر الأسنان والصحة.", true);
      }
    }
  };

  // --- 5. HAIR ---
  const handleComb = () => {
    if (hairMessy > 0) {
      setHairMessy(prev => {
        const next = Math.max(0, prev - 2);
        if (next === 0) completeHabit("HAIR");
        return next;
      });
    }
  };

  // --- 6. BED ---
  const handleBedDrop = (e: any, info: any, itemType: string) => {
    const target = checkDropZone(info, '[data-zone]');
    if (target) {
      const zoneId = target.getAttribute('data-zone');
      if (zoneId === itemType) {
        const newPlaced = [...placedBedItems, itemType];
        setPlacedBedItems(newPlaced);
        if (newPlaced.length === 3) completeHabit("BED");
      }
    }
  };

  return (
    <div id="daily-habits-container" className="fixed inset-0 z-[9990] bg-gradient-to-b from-[#E0F2FE] via-[#F0FDFA] to-[#FAF7FD] select-none font-sans flex flex-col justify-between overflow-hidden">
      <div className="absolute top-4 right-4 z-[9990] select-none pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-3 border-[#D97706] text-[#D97706] font-black text-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-lg text-yellow-400">★</span><span>نجومك: {globalStars}</span>
        </div>
      </div>
      <div className="absolute top-4 left-4 z-[9990] select-none pointer-events-auto flex items-center gap-2">
        {activeHabit && (
          <button onClick={() => setActiveHabit(null)} className="w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-full flex items-center justify-center cursor-pointer border-3 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all">
            <ArrowRight className="w-6 h-6 stroke-[3px]" />
          </button>
        )}
        <button onClick={onClose} className="w-12 h-12 bg-white hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center cursor-pointer border-3 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all">
          <X className="w-6 h-6 stroke-[3px]" />
        </button>
      </div>

      <AnimatePresence>
        {noticeText && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 inset-x-0 mx-auto w-fit px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{ borderColor: noticeText.includes("❌") ? "#EF4444" : "#FF9F29", color: noticeText.includes("❌") ? "#EF4444" : "#4D2B82" }}>
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow w-full flex items-center justify-center p-6 relative z-10 overflow-hidden overflow-y-auto">
        {!activeHabit ? (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl text-center pb-20 mt-16">
            <h2 className="text-3xl font-black text-[#4D2B82] mb-2">🌟 عاداتي اليومية مع برعم 🌟</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              {[
                { id: "TEETH", title: "غسل الأسنان", icon: "🦷" },
                { id: "ROOM", title: "الغرفة النظيفة", icon: "🧸" },
                { id: "WASH", title: "النظافة الشخصية", icon: "🧼" },
                { id: "BREAKFAST", title: "إفطار صحي", icon: "🍳" },
                { id: "HAIR", title: "تمشيط الشعر", icon: "🪮" },
                { id: "BED", title: "ترتيب السرير", icon: "🛏️" },
              ].map(habit => (
                <button key={habit.id} onClick={() => startHabit(habit.id as HabitType)}
                  className={`card-bubbly p-6 bg-white flex flex-col items-center justify-center gap-3 border-4 rounded-3xl cursor-pointer transition-all hover:scale-105 ${completedHabits.includes(habit.id as HabitType) ? 'border-emerald-400 bg-emerald-50' : 'border-[#4D2B82] hover:bg-purple-50'}`}>
                  <div className="text-6xl mb-1 relative">
                    {habit.icon}
                    {completedHabits.includes(habit.id as HabitType) && <CheckCircle className="absolute -top-1 -right-2 w-8 h-8 text-emerald-500 fill-white bg-white rounded-full shadow-md" />}
                  </div>
                  <h3 className="text-xl font-black text-[#4D2B82]">{habit.title}</h3>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl h-[75vh] bg-white border-4 border-[#4D2B82] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col mt-4">
            <div className="bg-[#4D2B82] text-white p-4 text-center font-black text-xl rounded-b-3xl mx-auto px-8 shadow-md z-20">
              {activeHabit === "TEETH" && "أمسك الفرشاة 🪥 ونظف كل أسنان برعم!"}
              {activeHabit === "ROOM" && "اسحب كل عنصر للصندوق الصحيح!"}
              {activeHabit === "WASH" && (washPhase === "FACE" ? "أمسك الصابونة 🧼 وامسح البقع من وجه برعم!" : "فرقع الفقاعات لغسل اليدين!")}
              {activeHabit === "BREAKFAST" && "اسحب الطعام الصحي 🍎 لفم برعم واحذر من غير الصحي!"}
              {activeHabit === "HAIR" && "أمسك المشط 🪮 وسرح شعر برعم ببطء لترتيبه!"}
              {activeHabit === "BED" && "اسحب المخدات والغطاء إلى أماكنها المحددة في السرير!"}
            </div>

            <div className="flex-grow relative bg-[#F8FAFC] flex items-center justify-center p-4">
              
              {/* --- TEETH --- */}
              {activeHabit === "TEETH" && (
                <div className="relative w-[400px] h-[340px] bg-red-50 rounded-[40px] border-8 border-red-200 flex flex-col justify-center gap-2 p-8 overflow-hidden shadow-inner"
                     style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" style=\"font-size:30px\"><text y=\"30\">🪥</text></svg>'), auto" }}>
                  <div className="flex justify-center gap-1.5 w-full bg-pink-400 rounded-b-full p-3 pb-8 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)]">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} onMouseMove={() => handleBrushTooth(i)} onTouchMove={() => handleBrushTooth(i)}
                           className="w-12 h-20 bg-white rounded-[24px] rounded-t-[4px] shadow-[0_4px_6px_rgba(0,0,0,0.15)] relative overflow-hidden border-2 border-gray-100">
                        <div className="absolute inset-0 bg-yellow-600/80 transition-opacity duration-100" style={{ opacity: teethDirt[i] / 100 }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-1.5 w-full bg-pink-400 rounded-t-full p-3 pt-8 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)] mt-2">
                    {[5,6,7,8,9].map(i => (
                      <div key={i} onMouseMove={() => handleBrushTooth(i)} onTouchMove={() => handleBrushTooth(i)}
                           className="w-12 h-20 bg-white rounded-[24px] rounded-b-[4px] shadow-[0_-4px_6px_rgba(0,0,0,0.15)] relative overflow-hidden border-2 border-gray-100">
                        <div className="absolute inset-0 bg-yellow-600/80 transition-opacity duration-100" style={{ opacity: teethDirt[i] / 100 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- ROOM --- */}
              {activeHabit === "ROOM" && (
                <div className="w-full h-full relative flex flex-col">
                  {/* Top Items Tray */}
                  <div className="h-36 bg-purple-50 rounded-xl border-4 border-purple-200 mb-auto flex flex-wrap justify-center items-center gap-4 p-4 z-20">
                    {roomItems.map(item => (
                      <motion.div key={item.id} drag dragMomentum={false}
                        onDragEnd={(e, info) => handleDropRoomItem(e, info, item)}
                        className="text-5xl cursor-grab active:cursor-grabbing bg-white shadow-md p-2 rounded-xl border-2 border-gray-100 hover:scale-110 z-30"
                      >
                        {item.emoji}
                      </motion.div>
                    ))}
                    {roomItems.length === 0 && <span className="text-2xl font-bold text-purple-400">ممتاز! تم ترتيب كل شيء!</span>}
                  </div>

                  {/* 3 Boxes at Bottom */}
                  <div className="absolute bottom-6 inset-x-0 flex justify-center gap-6 z-10">
                    <div data-box="TOY" className="w-36 h-36 bg-[#FCD34D] border-4 border-[#D97706] rounded-2xl shadow-xl flex flex-col items-center justify-center">
                      <span className="text-4xl">🧸</span><span className="font-bold text-[#D97706] text-lg">ألعاب</span>
                    </div>
                    <div data-box="CLOTHES" className="w-36 h-36 bg-[#93C5FD] border-4 border-[#2563EB] rounded-2xl shadow-xl flex flex-col items-center justify-center">
                      <span className="text-4xl">👕</span><span className="font-bold text-[#2563EB] text-lg">ملابس</span>
                    </div>
                    <div data-box="TRASH" className="w-36 h-36 bg-[#D1D5DB] border-4 border-[#4B5563] rounded-2xl shadow-xl flex flex-col items-center justify-center">
                      <span className="text-4xl">🗑️</span><span className="font-bold text-[#4B5563] text-lg">مهملات</span>
                    </div>
                  </div>
                </div>
              )}

              {/* --- WASH --- */}
              {activeHabit === "WASH" && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    {washPhase === "FACE" ? (
                      <motion.div key="face" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                        className="relative w-80 h-80 bg-orange-50 rounded-full border-8 border-orange-200 flex items-center justify-center shadow-lg"
                        style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" style=\"font-size:30px\"><text y=\"30\">🧼</text></svg>'), auto" }}>
                        <span className="text-[140px] select-none pointer-events-none">👦</span>
                        {faceSpots.map(spot => (
                          <div key={spot} onMouseMove={() => handleWashFace(spot)} onTouchMove={() => handleWashFace(spot)}
                            className="absolute w-12 h-12 bg-amber-800/80 rounded-full blur-[2px]"
                            style={{ top: spot === 1 ? '25%' : spot === 2 ? '45%' : spot === 3 ? '60%' : '50%', left: spot === 1 ? '30%' : spot === 2 ? '65%' : spot === 3 ? '35%' : '70%' }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div key="hands" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="relative w-80 h-80 flex items-center justify-center bg-blue-50 rounded-full border-4 border-blue-200">
                        <span className="text-[140px]">👐</span>
                        {handBubbles.map(b => (
                          <motion.div key={b} onMouseMove={() => handlePopBubble(b)} onTouchMove={() => handlePopBubble(b)}
                            className="absolute w-16 h-16 rounded-full bg-blue-200/60 border border-blue-300 shadow-inner flex items-center justify-center cursor-pointer backdrop-blur-sm"
                            style={{ top: `${10 + Math.random() * 70}%`, left: `${10 + Math.random() * 70}%` }}
                            animate={{ y: [-5, 5, -5], x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2 + Math.random() }}>
                            🫧
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* --- BREAKFAST --- */}
              {activeHabit === "BREAKFAST" && (
                <div className="relative w-full h-full flex flex-col justify-between">
                  {/* Face in middle */}
                  <div className="flex-grow flex items-center justify-center z-10 pointer-events-none">
                    <div data-mouth="true" className="text-[160px] pointer-events-auto flex items-center justify-center w-64 h-64 transition-transform duration-200">
                      {isMouthOpen ? "😮" : "👦"}
                    </div>
                  </div>
                  {/* Tray at bottom - Add pb-6 so it's not cut off by the rounded container corners */}
                  <div className="bg-amber-50 rounded-t-3xl border-t-8 border-amber-200 flex justify-center items-center gap-6 z-20 py-6 px-4 shrink-0">
                    {breakfastItems.map(food => (
                      <motion.div key={food.id} drag dragMomentum={false}
                        onDrag={(e, info) => handleBreakfastDrag(e, info)}
                        onDragEnd={(e, info) => handleBreakfastDrop(e, info, food)}
                        className="text-6xl cursor-grab active:cursor-grabbing bg-white p-3 rounded-full shadow-lg border-4 border-yellow-300 z-30 hover:scale-110"
                      >
                        {food.emoji}
                      </motion.div>
                    ))}
                    {breakfastItems.length === 0 && <span className="text-2xl font-bold text-amber-500">شبعت! الحمد لله.</span>}
                  </div>
                </div>
              )}

              {/* --- HAIR --- */}
              {activeHabit === "HAIR" && (
                <div className="relative w-80 h-80 flex flex-col items-center justify-center" 
                     style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"50\" style=\"font-size:40px\"><text y=\"40\">🪮</text></svg>'), auto" }}>
                  <div className="w-64 h-64 bg-orange-100 rounded-[100px] flex items-center justify-center overflow-hidden border-4 border-orange-200 relative">
                    <span className="text-[140px] mt-10 select-none pointer-events-none">👦</span>
                    <div className="absolute top-0 inset-x-0 h-32" onMouseMove={handleComb} onTouchMove={handleComb}>
                      <motion.div className="w-full h-full bg-orange-800/90"
                        style={{ clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 70% 80%, 50% 100%, 30% 80%, 10% 100%)", opacity: hairMessy / 100 }}
                      />
                    </div>
                  </div>
                  <div className="w-48 h-4 bg-gray-200 rounded-full mt-8 overflow-hidden border border-gray-300">
                    <motion.div className="h-full bg-emerald-400" style={{ width: `${100 - hairMessy}%` }} />
                  </div>
                </div>
              )}

              {/* --- BED --- */}
              {activeHabit === "BED" && (
                <div className="w-full h-full relative flex items-center justify-center">
                  {/* Draggable Tray (Left Side) */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
                    {!placedBedItems.includes('pillow1') && (
                      <motion.div drag dragMomentum={false} onDragEnd={(e, info) => handleBedDrop(e, info, 'pillow1')}
                        className="w-24 h-16 bg-white rounded-xl shadow-lg border-2 border-gray-200 cursor-grab flex items-center justify-center text-3xl">☁️</motion.div>
                    )}
                    {!placedBedItems.includes('pillow2') && (
                      <motion.div drag dragMomentum={false} onDragEnd={(e, info) => handleBedDrop(e, info, 'pillow2')}
                        className="w-24 h-16 bg-white rounded-xl shadow-lg border-2 border-gray-200 cursor-grab flex items-center justify-center text-3xl">☁️</motion.div>
                    )}
                    {!placedBedItems.includes('blanket') && (
                      <motion.div drag dragMomentum={false} onDragEnd={(e, info) => handleBedDrop(e, info, 'blanket')}
                        className="w-32 h-32 bg-blue-400 rounded-xl shadow-lg border-4 border-blue-500 cursor-grab flex items-center justify-center text-5xl">🌌</motion.div>
                    )}
                  </div>

                  {/* Bed Structure */}
                  <div className="w-80 h-[26rem] bg-amber-100 rounded-3xl border-8 border-amber-600 relative flex flex-col justify-end p-4 shadow-xl z-10 ml-20">
                    <div data-zone="pillow1" className={`absolute top-4 right-6 w-32 h-16 rounded-xl border-4 border-dashed ${placedBedItems.includes('pillow1') ? 'border-transparent' : 'border-amber-400/50 bg-amber-50/30'}`} />
                    <div data-zone="pillow2" className={`absolute top-4 left-6 w-32 h-16 rounded-xl border-4 border-dashed ${placedBedItems.includes('pillow2') ? 'border-transparent' : 'border-amber-400/50 bg-amber-50/30'}`} />
                    <div data-zone="blanket" className={`absolute bottom-0 inset-x-0 h-3/4 rounded-t-xl border-4 border-dashed ${placedBedItems.includes('blanket') ? 'border-transparent' : 'border-amber-400/50 bg-amber-50/30'}`} />
                    
                    {placedBedItems.includes('pillow1') && <div className="absolute top-4 right-6 w-32 h-16 bg-white rounded-xl shadow-md border-2 border-gray-200 flex items-center justify-center text-3xl pointer-events-none">☁️</div>}
                    {placedBedItems.includes('pillow2') && <div className="absolute top-4 left-6 w-32 h-16 bg-white rounded-xl shadow-md border-2 border-gray-200 flex items-center justify-center text-3xl pointer-events-none">☁️</div>}
                    {placedBedItems.includes('blanket') && <div className="absolute bottom-0 inset-x-0 h-3/4 bg-blue-400 rounded-t-xl border-4 border-blue-500 shadow-inner flex items-center justify-center text-5xl pointer-events-none">🌌</div>}
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
