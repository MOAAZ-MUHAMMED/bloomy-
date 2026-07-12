import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { ScreenOrientation } from '@capacitor/screen-orientation';

interface DailyHabitsGameProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
}

type HabitType = "TEETH" | "ROOM" | "HANDS";

export default function DailyHabitsGame({ onClose, globalStars, setGlobalStars }: DailyHabitsGameProps) {
  const [activeHabit, setActiveHabit] = useState<HabitType | null>(null);
  const [completedHabits, setCompletedHabits] = useState<HabitType[]>([]);
  
  // Game states
  const [progress, setProgress] = useState(0);
  const [noticeText, setNoticeText] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (ScreenOrientation) {
        ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
      }
    } catch (e) {}
    return () => {
      try {
        if (ScreenOrientation) {
          ScreenOrientation.unlock().catch(() => {});
        }
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

  const completeHabit = (habit: HabitType) => {
    if (!completedHabits.includes(habit)) {
      setCompletedHabits([...completedHabits, habit]);
      updateStars(15);
      triggerNotice("🎉 ممتاز جداً! حصلت على ١٥ نجمة 🌟");
    }
    setTimeout(() => {
      setActiveHabit(null);
      setProgress(0);
    }, 2000);
  };

  // 1. Teeth Brushing Game logic
  const handleBrush = () => {
    if (progress < 100) {
      setProgress(p => Math.min(100, p + 15));
    }
    if (progress >= 85) {
      completeHabit("TEETH");
    }
  };

  // 2. Room Tidying Game logic (drag toys to toy box)
  const [toys, setToys] = useState([
    { id: 1, x: 20, y: 30, color: "#EF4444" },
    { id: 2, x: 70, y: 20, color: "#3B82F6" },
    { id: 3, x: 40, y: 70, color: "#10B981" },
    { id: 4, x: 80, y: 60, color: "#F59E0B" }
  ]);
  const [toysInBox, setToysInBox] = useState<number[]>([]);

  const handleToyDrop = (id: number) => {
    if (!toysInBox.includes(id)) {
      const newBox = [...toysInBox, id];
      setToysInBox(newBox);
      setProgress((newBox.length / toys.length) * 100);
      if (newBox.length === toys.length) {
        completeHabit("ROOM");
      }
    }
  };

  // 3. Washing Hands Game logic (tap bubbles to clean)
  const [bubbles, setBubbles] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const handlePopBubble = (id: number) => {
    setBubbles(bubbles.filter(b => b !== id));
    setProgress(((8 - (bubbles.length - 1)) / 8) * 100);
    if (bubbles.length === 1) {
      completeHabit("HANDS");
    }
  };

  const startHabit = (h: HabitType) => {
    setActiveHabit(h);
    setProgress(0);
    if (h === "ROOM") {
      setToysInBox([]);
    }
    if (h === "HANDS") {
      setBubbles([1, 2, 3, 4, 5, 6, 7, 8]);
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

      <main className="flex-grow w-full flex items-center justify-center p-6 relative z-10 overflow-hidden">
        
        {!activeHabit ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl text-center"
          >
            <h2 className="text-3xl font-black text-[#4D2B82] mb-2">🌟 عاداتي اليومية مع برعم 🌟</h2>
            <p className="text-sm font-extrabold text-purple-500 mb-8">ساعد صديقنا برعم في مهامه اليومية ليكون طفلاً نظيفاً ومرتباً!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Teeth Habit */}
              <button
                onClick={() => startHabit("TEETH")}
                className={`card-bubbly p-6 bg-white flex flex-col items-center justify-center gap-4 border-4 rounded-[32px] cursor-pointer transition-all hover:scale-105 ${completedHabits.includes("TEETH") ? 'border-emerald-400 bg-emerald-50' : 'border-[#4D2B82] hover:bg-purple-50'}`}
              >
                <div className="text-6xl mb-2 relative">
                  🦷
                  {completedHabits.includes("TEETH") && <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-emerald-500 fill-white" />}
                </div>
                <h3 className="text-xl font-black text-[#4D2B82]">غسل الأسنان</h3>
                <p className="text-xs font-bold text-gray-500">حرك الفرشاة لتنظيف أسنان برعم لتصبح بيضاء لامعة!</p>
              </button>

              {/* Room Habit */}
              <button
                onClick={() => startHabit("ROOM")}
                className={`card-bubbly p-6 bg-white flex flex-col items-center justify-center gap-4 border-4 rounded-[32px] cursor-pointer transition-all hover:scale-105 ${completedHabits.includes("ROOM") ? 'border-emerald-400 bg-emerald-50' : 'border-[#4D2B82] hover:bg-purple-50'}`}
              >
                <div className="text-6xl mb-2 relative">
                  🧸
                  {completedHabits.includes("ROOM") && <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-emerald-500 fill-white" />}
                </div>
                <h3 className="text-xl font-black text-[#4D2B82]">ترتيب الغرفة</h3>
                <p className="text-xs font-bold text-gray-500">اجمع ألعاب برعم المتناثرة وضعها في صندوق الألعاب!</p>
              </button>

              {/* Hands Habit */}
              <button
                onClick={() => startHabit("HANDS")}
                className={`card-bubbly p-6 bg-white flex flex-col items-center justify-center gap-4 border-4 rounded-[32px] cursor-pointer transition-all hover:scale-105 ${completedHabits.includes("HANDS") ? 'border-emerald-400 bg-emerald-50' : 'border-[#4D2B82] hover:bg-purple-50'}`}
              >
                <div className="text-6xl mb-2 relative">
                  🧼
                  {completedHabits.includes("HANDS") && <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-emerald-500 fill-white" />}
                </div>
                <h3 className="text-xl font-black text-[#4D2B82]">غسل اليدين</h3>
                <p className="text-xs font-bold text-gray-500">اضغط على فقاعات الصابون لتنظيف يدي برعم من الجراثيم!</p>
              </button>

            </div>
          </motion.div>
        ) : (
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white border-4 border-[#4D2B82] rounded-[36px] shadow-[0_12px_0_0_#4D2B82] p-8 flex flex-col items-center relative"
          >
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6 border-2 border-gray-300 overflow-hidden">
              <motion.div
                className="bg-emerald-500 h-full rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>

            {/* TEETH GAME */}
            {activeHabit === "TEETH" && (
              <div className="flex flex-col items-center w-full">
                <h3 className="text-2xl font-black text-[#4D2B82] mb-2">غسل أسنان برعم 🦷</h3>
                <p className="text-sm font-bold text-purple-500 mb-6">المس الأسنان وحرك إصبعك (أو الماوس) لتنظيفها بالفرشاة!</p>
                
                <div 
                  className="w-48 h-48 relative cursor-crosshair select-none bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-200 overflow-hidden"
                  onMouseMove={(e) => {
                    // simulate brushing speed
                    if (e.buttons === 1) handleBrush();
                  }}
                  onTouchMove={() => handleBrush()}
                >
                  <div className="text-[100px] z-10 transition-all duration-300" style={{ filter: `grayscale(${100 - progress}%) brightness(${1 + progress/100})` }}>
                    😁
                  </div>
                  {/* Dirt overlays */}
                  <AnimatePresence>
                    {progress < 100 && (
                      <motion.div 
                        className="absolute inset-0 opacity-50 z-20 pointer-events-none"
                        style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2" fill="%238B4513"/></svg>')` }}
                        animate={{ opacity: (100 - progress) / 100 * 0.5 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Sparkles when clean */}
                  {progress >= 100 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-4 right-4 text-yellow-400 z-30"
                    >
                      <Sparkles className="w-10 h-10 fill-yellow-400" />
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* ROOM GAME */}
            {activeHabit === "ROOM" && (
              <div className="flex flex-col items-center w-full">
                <h3 className="text-2xl font-black text-[#4D2B82] mb-2">ترتيب الغرفة 🧸</h3>
                <p className="text-sm font-bold text-purple-500 mb-6">اسحب الألعاب المتناثرة وضعها في الصندوق!</p>
                
                <div className="w-full h-64 bg-orange-50 rounded-3xl border-4 border-orange-200 relative overflow-hidden flex flex-col items-center justify-end p-4">
                  
                  {/* Toy Box */}
                  <div className="w-32 h-24 bg-amber-600 rounded-b-xl rounded-t-sm border-4 border-amber-800 relative z-10 flex items-center justify-center text-white font-black">
                    صندوق الألعاب
                  </div>
                  
                  {/* Draggable Toys */}
                  {toys.map(toy => {
                    if (toysInBox.includes(toy.id)) return null;
                    return (
                      <motion.div
                        key={toy.id}
                        drag
                        dragConstraints={{ left: -150, right: 150, top: -200, bottom: 50 }}
                        onDragEnd={(_, info) => {
                          // Simple drop logic: if it drops near the bottom center (box area)
                          if (info.point.y > window.innerHeight / 2 && info.point.x > window.innerWidth / 2 - 100 && info.point.x < window.innerWidth / 2 + 100) {
                            handleToyDrop(toy.id);
                          }
                        }}
                        className="absolute text-4xl cursor-grab active:cursor-grabbing z-20"
                        style={{ top: `${toy.y}%`, left: `${toy.x}%` }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {toy.id === 1 ? '🚗' : toy.id === 2 ? '⚽' : toy.id === 3 ? '🚂' : '🚁'}
                      </motion.div>
                    );
                  })}

                  {progress >= 100 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-white/50 z-30 flex items-center justify-center backdrop-blur-sm"
                    >
                      <span className="text-4xl text-emerald-600 font-black">غرفة مرتبة! ✨</span>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* HANDS GAME */}
            {activeHabit === "HANDS" && (
              <div className="flex flex-col items-center w-full">
                <h3 className="text-2xl font-black text-[#4D2B82] mb-2">غسل اليدين 🧼</h3>
                <p className="text-sm font-bold text-purple-500 mb-6">افقع جميع فقاعات الصابون لتنظيف يدي برعم!</p>
                
                <div className="w-full h-64 bg-cyan-50 rounded-3xl border-4 border-cyan-200 relative flex items-center justify-center overflow-hidden">
                  <div className="text-[120px] z-10 select-none">
                    🖐️
                  </div>
                  
                  {bubbles.map((id) => (
                    <motion.button
                      key={id}
                      onClick={() => handlePopBubble(id)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, y: [0, -10, 0], x: [0, 5, -5, 0] }}
                      transition={{ y: { repeat: Infinity, duration: 2 + Math.random() }, x: { repeat: Infinity, duration: 3 + Math.random() } }}
                      className="absolute w-12 h-12 bg-white/60 backdrop-blur-sm border-2 border-cyan-300 rounded-full shadow-sm cursor-pointer z-20 flex items-center justify-center group hover:bg-cyan-100"
                      style={{
                        top: `${20 + Math.random() * 50}%`,
                        left: `${10 + Math.random() * 70}%`
                      }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2" />
                    </motion.button>
                  ))}

                  {progress >= 100 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-white/50 z-30 flex items-center justify-center backdrop-blur-sm"
                    >
                      <span className="text-4xl text-emerald-600 font-black">يدين نظيفتين! ✨</span>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

          </motion.div>

        )}

      </main>

    </div>
  );
}
