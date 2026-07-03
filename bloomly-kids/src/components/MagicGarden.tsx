import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Volume2, VolumeX, Flame } from "lucide-react";

// Web Audio API Synthesizer for Garden Sounds
class GardenSoundSynth {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPop() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn(e);
    }
  }

  playWaterPour() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Simulate splash noise
      const bufferSize = this.ctx.sampleRate * 0.3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.3);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Sweet chime at same time
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);
      oscGain.gain.setValueAtTime(0.08, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.3);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn(e);
    }
  }

  playHarvest() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Magical arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  playPetUnlock() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.1, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

const synth = new GardenSoundSynth();

// Types
interface GardenPlot {
  id: number;
  plantType: "apple" | "orange" | "flower" | "sunflower" | null;
  growthStage: 0 | 1 | 2 | 3; // 0: Seed, 1: Sprout, 2: Medium, 3: Fully Bloomed
  waterCount: number; // 0 to 3 to transition to next stage
}

interface Pet {
  id: string;
  emoji: string;
  name: string;
  cost: number;
  unlocked: boolean;
}

interface MagicGardenProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars: React.Dispatch<React.SetStateAction<number>>;
}

export default function MagicGarden({ onClose, globalStars, setGlobalStars }: MagicGardenProps) {
  const [plots, setPlots] = useState<GardenPlot[]>([]);
  const [unlockedPets, setUnlockedPets] = useState<string[]>([]);
  const [activePlotId, setActivePlotId] = useState<number | null>(null);
  
  // Modals
  const [showSeedShop, setShowSeedShop] = useState(false);
  const [showPetShop, setShowPetShop] = useState(false);
  const [wateringPlotId, setWateringPlotId] = useState<number | null>(null);
  
  // Notification banner
  const [noticeText, setNoticeText] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    // 5 default plots
    const savedPlots = localStorage.getItem("bloomly_garden_plots");
    if (savedPlots) {
      setPlots(JSON.parse(savedPlots));
    } else {
      const defaultPlots: GardenPlot[] = Array.from({ length: 5 }).map((_, i) => ({
        id: i + 1,
        plantType: null,
        growthStage: 0,
        waterCount: 0,
      }));
      setPlots(defaultPlots);
      localStorage.setItem("bloomly_garden_plots", JSON.stringify(defaultPlots));
    }

    // Unlocked pets
    const savedPets = localStorage.getItem("bloomly_unlocked_pets");
    if (savedPets) {
      setUnlockedPets(JSON.parse(savedPets));
    } else {
      setUnlockedPets([]);
      localStorage.setItem("bloomly_unlocked_pets", JSON.stringify([]));
    }
  }, []);

  // Save helper
  const saveGardenData = (newPlots: GardenPlot[], newPets?: string[]) => {
    setPlots(newPlots);
    localStorage.setItem("bloomly_garden_plots", JSON.stringify(newPlots));
    if (newPets) {
      setUnlockedPets(newPets);
      localStorage.setItem("bloomly_unlocked_pets", JSON.stringify(newPets));
    }
  };

  const updateStars = (diff: number) => {
    setGlobalStars(prev => {
      const next = Math.max(0, prev + diff);
      localStorage.setItem("bloomly_stars", next.toString());
      return next;
    });
  };

  const triggerNotice = (text: string) => {
    setNoticeText(text);
    setTimeout(() => {
      setNoticeText(null);
    }, 2500);
  };

  // Seed metadata
  const seedsData = [
    { type: "apple", name: "تفاحة حمراء 🍎", cost: 10, payout: 25 },
    { type: "orange", name: "برتقالة برتقالية 🍊", cost: 15, payout: 35 },
    { type: "flower", name: "زهرة القرنفل 🌸", cost: 8, payout: 20 },
    { type: "sunflower", name: "عباد الشمس 🌻", cost: 12, payout: 30 },
  ] as const;

  // Pets metadata
  const petsData: Pet[] = [
    { id: "rabbit", emoji: "🐰", name: "أرنوب القفاز", cost: 30, unlocked: false },
    { id: "cat", emoji: "🐱", name: "كيتي اللطيفة", cost: 40, unlocked: false },
    { id: "duck", emoji: "🦆", name: "بطوطة السباحة", cost: 50, unlocked: false },
    { id: "dog", emoji: "🐶", name: "شيبا الصديق", cost: 60, unlocked: false },
  ];

  // Planting logic
  const handlePlantSeed = (seedType: typeof seedsData[number]["type"]) => {
    const seed = seedsData.find(s => s.type === seedType);
    if (!seed || activePlotId === null) return;

    if (globalStars < seed.cost) {
      synth.playPop();
      triggerNotice("❌ ليس لديك نجوم كافية لشراء هذه البذرة!");
      return;
    }

    // Spend stars
    updateStars(-seed.cost);
    synth.playPop();

    const newPlots = plots.map(p => {
      if (p.id === activePlotId) {
        return {
          ...p,
          plantType: seedType,
          growthStage: 0 as const,
          waterCount: 0,
        };
      }
      return p;
    });
    
    saveGardenData(newPlots);
    setShowSeedShop(false);
    setActivePlotId(null);
    triggerNotice(`🌱 تم زراعة بذرة ${seed.name}!`);
  };

  // Watering logic
  const handleWaterPlant = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.plantType === null || plot.growthStage >= 3) return;

    const waterCost = 2;
    if (globalStars < waterCost) {
      synth.playPop();
      triggerNotice("❌ لا توجد نجوم كافية للري (تحتاج ٢ نجمة 💧)!");
      return;
    }

    // Spend stars & trigger animation
    updateStars(-waterCost);
    setWateringPlotId(plotId);
    synth.playWaterPour();

    setTimeout(() => {
      setWateringPlotId(null);
      const nextWaterCount = plot.waterCount + 1;
      let nextStage = plot.growthStage;
      let waterReset = nextWaterCount;

      if (nextWaterCount >= 3) {
        nextStage = (plot.growthStage + 1) as typeof plot.growthStage;
        waterReset = 0;
        synth.playHarvest();
        triggerNotice("✨ كبرت النبتة وحصلت على برعم جديد!");
      }

      const newPlots = plots.map(p => {
        if (p.id === plotId) {
          return {
            ...p,
            growthStage: nextStage,
            waterCount: waterReset,
          };
        }
        return p;
      });

      saveGardenData(newPlots);
    }, 1000);
  };

  // Harvesting logic
  const handleHarvest = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.plantType === null || plot.growthStage < 3) return;

    const seed = seedsData.find(s => s.type === plot.plantType);
    if (!seed) return;

    // Harvest reward!
    updateStars(seed.payout);
    synth.playHarvest();
    triggerNotice(`🎉 تهانينا! قمت بحصاد ${seed.name} وربحت ${seed.payout} نجمة!`);

    const newPlots = plots.map(p => {
      if (p.id === plotId) {
        return {
          id: p.id,
          plantType: null,
          growthStage: 0 as const,
          waterCount: 0,
        };
      }
      return p;
    });

    saveGardenData(newPlots);
  };

  // Buy pet logic
  const handleBuyPet = (petId: string) => {
    const pet = petsData.find(p => p.id === petId);
    if (!pet) return;

    if (unlockedPets.includes(petId)) {
      triggerNotice("😊 هذا الحيوان يتجول بالفعل في حديقتك!");
      return;
    }

    if (globalStars < pet.cost) {
      synth.playPop();
      triggerNotice(`❌ ليس لديك نجوم كافية لشراء ${pet.name}!`);
      return;
    }

    // Purchase
    updateStars(-pet.cost);
    synth.playPetUnlock();
    const nextPets = [...unlockedPets, petId];
    saveGardenData(plots, nextPets);
    triggerNotice(`🐣 مرحباً بك يا ${pet.name} في حديقتنا!`);
  };

  // Rendering plants representation helper
  const getPlantVisual = (type: GardenPlot["plantType"], stage: GardenPlot["growthStage"]) => {
    if (stage === 0) return "🌱";
    if (stage === 1) return "🌿";
    if (stage === 2) {
      if (type === "apple" || type === "orange") return "🌳"; // small tree
      return "🪴"; // pot bud
    }
    // Fully bloomed
    if (type === "apple") return "🍎🌳";
    if (type === "orange") return "🍊🌳";
    if (type === "flower") return "🌸✨";
    return "🌻✨";
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-gradient-to-b from-[#E3F2FD] via-[#FAF7FD] to-[#E8F5E9] select-none font-sans flex flex-col justify-between overflow-hidden">
      
      {/* 1. Header Area */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b-3 border-[#4D2B82] p-4 flex items-center justify-between shadow-sm relative z-30 select-none">
        {/* Back Button */}
        <button
          onClick={() => {
            synth.playPop();
            onClose();
          }}
          className="btn-bubbly-secondary text-sm py-2 px-5 text-[#4D2B82] bg-white rounded-full flex items-center gap-1 cursor-pointer border-2 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all"
        >
          <X className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-[#4D2B82] tracking-wide flex items-center gap-2 justify-center">
            حديقتك السحرية الكبيرة 🌿✨
          </h1>
          <p className="text-xs font-extrabold text-emerald-600">
            ازرع البذور، اروي النباتات، وافتح الحيوانات اللطيفة بالنجوم!
          </p>
        </div>

        {/* Info stats */}
        <div className="flex items-center gap-4">
          {/* Shop button */}
          <button
            onClick={() => {
              synth.playPop();
              setShowPetShop(true);
            }}
            className="btn-bubbly-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            🐾 متجر الحيوانات
          </button>

          {/* Global stars bubble */}
          <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-2 border-[#D97706] text-[#D97706] font-extrabold text-sm px-4 py-1.5 rounded-full shadow-inner select-none">
            <span className="text-lg text-yellow-400">★</span>
            <span>نجومك: {globalStars}</span>
          </div>
        </div>
      </header>

      {/* 2. Notice Banner */}
      <AnimatePresence>
        {noticeText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 inset-x-0 mx-auto w-fit max-w-sm px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{
              borderColor: noticeText.startsWith("❌") ? "#EF4444" : noticeText.startsWith("🌱") ? "#2ECC71" : "#FF9F29",
              color: noticeText.startsWith("❌") ? "#EF4444" : "#4D2B82",
            }}
          >
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Wide Scrollable Garden Field (Horizontal Scrolling!) */}
      <main className="flex-grow w-full overflow-x-auto scrollbar-none relative flex flex-col justify-end pb-8">
        
        {/* Sky Background Decor */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
          <div className="absolute top-10 left-[20%] text-6xl animate-pulse">☁️</div>
          <div className="absolute top-24 left-[60%] text-5xl animate-bounce-slow">☁️</div>
          <div className="absolute top-16 right-[15%] text-6xl">☁️</div>
          <div className="absolute top-48 left-[40%] text-2xl text-yellow-400">✨</div>
          <div className="absolute top-36 right-[35%] text-3xl text-yellow-300">✨</div>
        </div>

        {/* Horizontal Container Width (Large Garden) */}
        <div className="min-w-[150vw] sm:min-w-[1400px] h-full flex flex-col justify-end relative z-10">
          
          {/* Roaming Unlocked Pets */}
          {unlockedPets.map((petId, idx) => {
            const pet = petsData.find(p => p.id === petId);
            if (!pet) return null;

            // Generate different speed and bounding for each pet
            const speed = 12 + idx * 4;
            const direction = idx % 2 === 0 ? 1 : -1;

            return (
              <motion.div
                key={petId}
                animate={{
                  x: direction > 0 ? ["0vw", "130vw", "0vw"] : ["130vw", "0vw", "130vw"],
                  y: [0, -10, 0, -15, 0],
                  scaleX: direction > 0 ? [1, 1, -1, -1, 1] : [-1, -1, 1, 1, -1],
                }}
                transition={{
                  x: { repeat: Infinity, duration: speed, ease: "linear" },
                  y: { repeat: Infinity, duration: 1.2 + idx * 0.2, ease: "easeInOut" },
                }}
                className="absolute bottom-[24%] text-5xl z-20 pointer-events-none select-none select-none filter drop-shadow-md"
              >
                {pet.emoji}
              </motion.div>
            );
          })}

          {/* Landscape Grass Hills */}
          <div className="absolute bottom-0 inset-x-0 h-[48%] bg-[#4CAF50] border-t-5 border-[#4D2B82] z-0 shadow-lg rounded-t-[40px]">
            {/* Winding mud path for garden character */}
            <div className="absolute inset-x-0 top-6 h-8 bg-[#D7CCC8]/40 border-y-2 border-dashed border-[#8D6E63]/30" />
            <div className="absolute -left-10 -top-8 w-96 h-36 bg-[#81C784] rounded-full border-b-4 border-[#4D2B82] z-0 rotate-6" />
            <div className="absolute right-[20%] -top-12 w-80 h-32 bg-[#81C784] rounded-full border-b-4 border-[#4D2B82] z-0 -rotate-3" />
          </div>

          {/* 5 Plant Plots aligned horizontally */}
          <div className="w-full flex justify-around items-end px-12 relative z-10 pb-8 h-[250px]">
            {plots.map((plot) => {
              const isEmpty = plot.plantType === null;
              const isFullyGrown = plot.growthStage === 3;
              const isWatering = wateringPlotId === plot.id;

              return (
                <div
                  key={plot.id}
                  className="flex flex-col items-center gap-3 relative"
                >
                  
                  {/* Watering Can Animation Overlay */}
                  <AnimatePresence>
                    {isWatering && (
                      <motion.div
                        initial={{ opacity: 0, y: -40, rotate: 0 }}
                        animate={{ opacity: 1, y: -20, rotate: -25 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-24 left-4 z-40 text-4xl select-none"
                      >
                        🚿
                        {/* Water droplets */}
                        <motion.span
                          animate={{ y: [0, 15, 30], opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.3 }}
                          className="absolute top-6 left-[-10px] text-xs text-blue-400 block"
                        >
                          💧 💧
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Growth Progress Indicator Bubbles */}
                  {!isEmpty && !isFullyGrown && (
                    <div className="bg-white/90 border-2 border-[#4D2B82] rounded-full px-2.5 py-0.5 text-[9px] font-black text-blue-500 shadow-sm flex items-center gap-1">
                      <span>💧 {plot.waterCount}/3</span>
                      <span>مرحلة {plot.growthStage + 1}</span>
                    </div>
                  )}

                  {/* Active plant or Dirt Pile */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      synth.playPop();
                      if (isEmpty) {
                        setActivePlotId(plot.id);
                        setShowSeedShop(true);
                      }
                    }}
                    className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center relative cursor-pointer shadow-md select-none transition-all ${
                      isEmpty
                        ? "bg-[#8D6E63] border-[#4E342E] hover:bg-[#795548]"
                        : "bg-white/40 border-[#2ECC71]/30 hover:bg-white/50"
                    }`}
                  >
                    {isEmpty ? (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl text-white font-extrabold">+</span>
                        <span className="text-[10px] text-yellow-100 font-extrabold">بذرة جديدة</span>
                      </div>
                    ) : (
                      <motion.span
                        animate={
                          isFullyGrown 
                            ? { scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] } 
                            : { y: [0, -3, 0] }
                        }
                        transition={{ repeat: Infinity, duration: isFullyGrown ? 1.5 : 2 }}
                        className={`filter drop-shadow-md ${
                          isFullyGrown ? "text-6xl" : "text-5xl"
                        }`}
                      >
                        {getPlantVisual(plot.plantType, plot.growthStage)}
                      </motion.span>
                    )}

                    {/* Dirt base outline */}
                    <div className="absolute bottom-[-6px] w-[90%] h-4 bg-[#5D4037] border-2 border-[#3E2723] rounded-full z-0" />
                  </motion.div>

                  {/* Plot Controls buttons */}
                  {!isEmpty && (
                    <div className="flex gap-1.5 z-20">
                      {/* Water button */}
                      {!isFullyGrown && (
                        <button
                          onClick={() => handleWaterPlant(plot.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-black text-[10px] px-3 py-1.5 rounded-full border-2 border-blue-700 shadow-sm active:translate-y-0.5 cursor-pointer flex items-center gap-0.5"
                        >
                          <span>💧</span>
                          <span>ري (2⭐)</span>
                        </button>
                      )}

                      {/* Harvest button */}
                      {isFullyGrown && (
                        <button
                          onClick={() => handleHarvest(plot.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-[10px] px-3 py-1.5 rounded-full border-2 border-yellow-600 shadow-md active:translate-y-0.5 cursor-pointer flex items-center gap-0.5 animate-bounce-slow"
                        >
                          <span>🌾</span>
                          <span>احصد النجوم!</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Plot Label */}
                  <span className="text-xs font-black text-[#4E342E] bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200">
                    أرض {plot.id}
                  </span>

                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* 4. SEED SHOP MODAL */}
      <AnimatePresence>
        {showSeedShop && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-[#4D2B82] rounded-[32px] p-6 max-w-md w-full text-center shadow-[0_8px_0_0_#4D2B82] relative"
            >
              {/* Close shop */}
              <button
                onClick={() => {
                  synth.playPop();
                  setShowSeedShop(false);
                  setActivePlotId(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black text-[#4D2B82] mb-1">🌱 متجر البذور السحرية</h2>
              <p className="text-xs font-bold text-purple-400 mb-6">شراء البذرة يستهلك نجوماً، وتربح نجوماً مضاعفة عند الحصاد!</p>

              <div className="grid grid-cols-2 gap-4">
                {seedsData.map((seed) => (
                  <button
                    key={seed.type}
                    onClick={() => handlePlantSeed(seed.type)}
                    className="card-bubbly p-4 bg-purple-50/40 hover:bg-purple-50 flex flex-col items-center gap-2 cursor-pointer border-3"
                  >
                    <span className="text-4xl">{seed.type === "apple" ? "🍎" : seed.type === "orange" ? "🍊" : seed.type === "flower" ? "🌸" : "🌻"}</span>
                    <span className="text-sm font-extrabold text-[#4D2B82]">{seed.name}</span>
                    
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        الشراء: {seed.cost}⭐
                      </span>
                      <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        الحصاد: {seed.payout}⭐
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PET SHOP MODAL */}
      <AnimatePresence>
        {showPetShop && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-[#4D2B82] rounded-[32px] p-6 max-w-md w-full text-center shadow-[0_8px_0_0_#4D2B82] relative"
            >
              {/* Close shop */}
              <button
                onClick={() => {
                  synth.playPop();
                  setShowPetShop(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black text-[#4D2B82] mb-1">🐾 متجر الحيوانات الأليفة</h2>
              <p className="text-xs font-bold text-purple-400 mb-6">افتح حيوانات لطيفة بالنجوم لتتجول وتلعب بالحديقة السحرية!</p>

              <div className="grid grid-cols-2 gap-4">
                {petsData.map((pet) => {
                  const isUnlocked = unlockedPets.includes(pet.id);

                  return (
                    <button
                      key={pet.id}
                      onClick={() => handleBuyPet(pet.id)}
                      disabled={isUnlocked}
                      className={`card-bubbly p-4 flex flex-col items-center gap-2 border-3 cursor-pointer ${
                        isUnlocked 
                          ? "bg-gray-150 border-gray-300 opacity-60 cursor-default" 
                          : "bg-emerald-50/40 hover:bg-emerald-50"
                      }`}
                    >
                      <span className="text-5xl">{pet.emoji}</span>
                      <span className="text-sm font-extrabold text-[#4D2B82]">{pet.name}</span>
                      
                      <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                        isUnlocked
                          ? "bg-gray-100 text-gray-400 border-gray-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                        {isUnlocked ? "تم الفتح ✅" : `${pet.cost} نجمة ★`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
