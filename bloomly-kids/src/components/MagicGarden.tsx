import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Sparkles, Droplet, Clock } from "lucide-react";

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
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
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
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.45);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.exponentialRampToValueAtTime(1479.98, now + 0.25);
      oscGain.gain.setValueAtTime(0.06, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.45);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn(e);
    }
  }

  playHarvest() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.4);
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
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.3);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

const synth = new GardenSoundSynth();

// --- Vector SVGs for Animals ---
export function SVGBunny({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      className={className}
      animate={isEating ? { rotate: [0, 15, 0, 15, 0], y: [0, 4, 0, 4, 0] } : {}}
      transition={{ duration: 1.5 }}
    >
      <ellipse cx="38" cy="20" rx="7" ry="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="38" cy="20" rx="3.5" ry="12" fill="#FFC0CB" />
      <ellipse cx="62" cy="20" rx="7" ry="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="62" cy="20" rx="3.5" ry="12" fill="#FFC0CB" />
      <circle cx="50" cy="72" r="24" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="50" cy="46" r="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="43" cy="43" r="2.5" fill="#4D2B82" />
      <circle cx="57" cy="43" r="2.5" fill="#4D2B82" />
      <circle cx="36" cy="49" r="3" fill="#FF8A8A" opacity="0.6" />
      <circle cx="64" cy="49" r="3" fill="#FF8A8A" opacity="0.6" />
      <polygon points="50,48 47,45 53,45" fill="#FF659F" />
      <path d="M 47 52 Q 50 55 53 52" stroke="#4D2B82" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="92" rx="8" ry="5" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="64" cy="92" rx="8" ry="5" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="74" cy="74" r="7" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="2.5" />
    </motion.svg>
  );
}

export function SVGKitty({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      className={className}
      animate={isEating ? { rotate: [0, -10, 0, -10, 0], y: [0, 3, 0, 3, 0] } : {}}
      transition={{ duration: 1.5 }}
    >
      <path d="M 75 75 Q 85 60 78 45" stroke="#FBBF24" strokeWidth="6" fill="none" strokeLinecap="round" />
      <polygon points="32,32 30,12 48,22" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      <polygon points="34,28 33,16 45,22" fill="#FCA5A5" />
      <polygon points="68,32 70,12 52,22" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      <polygon points="66,28 67,16 55,22" fill="#FCA5A5" />
      <ellipse cx="50" cy="70" rx="20" ry="22" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="50" cy="40" r="18" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="43" cy="38" rx="3.5" ry="4.5" fill="#10B981" stroke="#4D2B82" strokeWidth="1.5" />
      <ellipse cx="57" cy="38" rx="3.5" ry="4.5" fill="#10B981" stroke="#4D2B82" strokeWidth="1.5" />
      <polygon points="50,42 47,40 53,40" fill="#FF8A8A" />
      <path d="M 46 45 Q 50 48 54 45" stroke="#4D2B82" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="26" y1="43" x2="16" y2="41" stroke="#4D2B82" strokeWidth="2" />
      <line x1="74" y1="43" x2="84" y2="41" stroke="#4D2B82" strokeWidth="2" />
      <circle cx="36" cy="90" r="6" fill="#FBBF24" stroke="#4D2B82" strokeWidth="2.5" />
      <circle cx="64" cy="90" r="6" fill="#FBBF24" stroke="#4D2B82" strokeWidth="2.5" />
    </motion.svg>
  );
}

export function SVGDuck({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      className={className}
      animate={isEating ? { rotate: [0, 20, 0, 20, 0], y: [0, 4, 0, 4, 0] } : {}}
      transition={{ duration: 1.5 }}
    >
      <polygon points="20,55 8,45 22,40" fill="#FDE047" stroke="#4D2B82" strokeWidth="2.5" />
      <ellipse cx="48" cy="62" rx="26" ry="18" fill="#FDE047" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="48" cy="62" rx="14" ry="8" fill="#FFF59D" stroke="#4D2B82" strokeWidth="2" />
      <path d="M 64 62 C 68 50 68 44 68 38" stroke="#FDE047" strokeWidth="15" strokeLinecap="round" />
      <circle cx="70" cy="30" r="14" fill="#FDE047" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="74" cy="27" r="2" fill="#4D2B82" />
      <path d="M 82 28 Q 94 30 92 36 L 78 36 Z" fill="#F97316" stroke="#4D2B82" strokeWidth="2.5" />
      <ellipse cx="38" cy="81" rx="8" ry="4" fill="#F97316" stroke="#4D2B82" strokeWidth="2.5" />
      <ellipse cx="58" cy="81" rx="8" ry="4" fill="#F97316" stroke="#4D2B82" strokeWidth="2.5" />
    </motion.svg>
  );
}

export function SVGPuppy({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      className={className}
      animate={isEating ? { rotate: [0, 15, 0, 15, 0], y: [0, 3, 0, 3, 0] } : {}}
      transition={{ duration: 1.5 }}
    >
      <path d="M 76 72 Q 86 64 88 50" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="72" rx="22" ry="18" fill="#BCAAA4" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="30" cy="44" rx="6" ry="12" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      <ellipse cx="70" cy="44" rx="6" ry="12" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      <circle cx="50" cy="44" r="17" fill="#BCAAA4" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="50" cy="48" rx="8" ry="6" fill="#FFFFFF" />
      <circle cx="42" cy="40" r="2.5" fill="#4D2B82" />
      <circle cx="58" cy="40" r="2.5" fill="#4D2B82" />
      <ellipse cx="50" cy="46" rx="3" ry="2" fill="#000000" />
      <path d="M 48 51 Q 50 59 52 51 Z" fill="#FF5A92" stroke="#4D2B82" strokeWidth="1.5" />
      <circle cx="38" cy="90" r="6" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      <circle cx="62" cy="90" r="6" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
    </motion.svg>
  );
}

export function SVGSheep({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      className={className}
      animate={isEating ? { rotate: [0, 12, 0, 12, 0], y: [0, 5, 0, 5, 0] } : {}}
      transition={{ duration: 1.5 }}
    >
      {/* Legs */}
      <rect x="30" y="70" width="6" height="18" fill="#1F2937" rx="2" />
      <rect x="42" y="72" width="6" height="18" fill="#1F2937" rx="2" />
      <rect x="52" y="72" width="6" height="18" fill="#1F2937" rx="2" />
      <rect x="64" y="70" width="6" height="18" fill="#1F2937" rx="2" />
      {/* Puffy Body */}
      <path d="M 28 50 C 22 45, 22 30, 32 30 C 28 18, 48 12, 54 22 C 58 12, 78 18, 74 30 C 84 30, 84 45, 78 50 C 84 62, 74 72, 64 70 C 58 78, 42 78, 36 70 C 22 72, 22 62, 28 50 Z" fill="#F3F4F6" stroke="#4D2B82" strokeWidth="3" strokeLinejoin="round" />
      {/* Head */}
      <ellipse cx="76" cy="42" rx="10" ry="12" fill="#1F2937" />
      {/* Eyes */}
      <circle cx="73" cy="39" r="1.5" fill="#FFFFFF" />
      <circle cx="79" cy="39" r="1.5" fill="#FFFFFF" />
      {/* Ears */}
      <ellipse cx="66" cy="38" rx="4" ry="2" fill="#1F2937" transform="rotate(-20 66 38)" />
      <ellipse cx="86" cy="38" rx="4" ry="2" fill="#1F2937" transform="rotate(20 86 38)" />
    </motion.svg>
  );
}

// --- Vector SVGs for Plants & Trees (Centered top-down versions) ---
export function SVGTopDownPlant({ type, stage }: { type: "apple" | "orange" | "flower" | "sunflower"; stage: number }) {
  const isTree = type === "apple" || type === "orange";
  const leafColor = "#22C55E";

  if (stage === 0) {
    // Stage 0: Sprout in soil pile
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto">
        <circle cx="50" cy="50" r="30" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        <ellipse cx="50" cy="50" rx="18" ry="10" fill="#4E3629" />
        <path d="M 50 35 Q 40 25 42 32 Q 45 42 50 35 C 55 42, 58 32, 50 35" fill="#AEEA00" stroke="#4D2B82" strokeWidth="1.5" />
      </svg>
    );
  }

  if (stage === 1) {
    // Stage 1: Budding/Leaves
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto">
        <circle cx="50" cy="50" r="32" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        <path d="M 50 50 L 50 25" stroke="#15803D" strokeWidth="4" />
        <circle cx="36" cy="36" r="10" fill={leafColor} stroke="#4D2B82" strokeWidth="2" />
        <circle cx="64" cy="36" r="10" fill={leafColor} stroke="#4D2B82" strokeWidth="2" />
      </svg>
    );
  }

  if (stage === 2) {
    // Stage 2: Medium grown plant / Potted or Trunk with small canopy
    return (
      <svg viewBox="0 0 100 100" className="w-18 h-18 mx-auto">
        <circle cx="50" cy="50" r="34" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        {isTree ? (
          <>
            <circle cx="50" cy="50" r="28" fill="#16A34A" stroke="#4D2B82" strokeWidth="3" />
            <circle cx="45" cy="45" r="18" fill="#4ADE80" opacity="0.4" />
          </>
        ) : (
          <>
            <path d="M 50 50 L 50 20" stroke="#15803D" strokeWidth="5" />
            <circle cx="50" cy="20" r="12" fill="#FBBF24" stroke="#4D2B82" strokeWidth="2.5" />
          </>
        )}
      </svg>
    );
  }

  // Stage 3: Fully bloomed
  if (type === "apple") {
    return (
      <svg viewBox="0 0 100 100" className="w-22 h-22 mx-auto">
        <circle cx="50" cy="50" r="35" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="38" fill="#16A34A" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Apples */}
        <circle cx="36" cy="36" r="6" fill="#EF4444" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="64" cy="36" r="6" fill="#EF4444" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="42" cy="62" r="6" fill="#EF4444" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="60" cy="58" r="6" fill="#EF4444" stroke="#4D2B82" strokeWidth="1.5" />
      </svg>
    );
  }

  if (type === "orange") {
    return (
      <svg viewBox="0 0 100 100" className="w-22 h-22 mx-auto">
        <circle cx="50" cy="50" r="35" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="38" fill="#16A34A" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Oranges */}
        <circle cx="36" cy="36" r="6" fill="#F97316" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="64" cy="36" r="6" fill="#F97316" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="42" cy="62" r="6" fill="#F97316" stroke="#4D2B82" strokeWidth="1.5" />
        <circle cx="60" cy="58" r="6" fill="#F97316" stroke="#4D2B82" strokeWidth="1.5" />
      </svg>
    );
  }

  if (type === "flower") {
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto">
        <circle cx="50" cy="50" r="35" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        <path d="M 50 50 L 50 25" stroke="#15803D" strokeWidth="6" />
        <g transform="translate(50, 25)">
          <circle cx="-12" cy="0" r="10" fill="#EC4899" stroke="#4D2B82" strokeWidth="2" />
          <circle cx="12" cy="0" r="10" fill="#EC4899" stroke="#4D2B82" strokeWidth="2" />
          <circle cx="0" cy="-12" r="10" fill="#EC4899" stroke="#4D2B82" strokeWidth="2" />
          <circle cx="0" cy="12" r="10" fill="#EC4899" stroke="#4D2B82" strokeWidth="2" />
          <circle cx="0" cy="0" r="9" fill="#E11D48" stroke="#4D2B82" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  // Sunflower
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto">
      <circle cx="50" cy="50" r="35" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
      <path d="M 50 50 L 50 25" stroke="#15803D" strokeWidth="6" />
      <g transform="translate(50, 25)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="0"
            rx="4"
            ry="14"
            fill="#FBBF24"
            stroke="#4D2B82"
            strokeWidth="1.5"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="8" fill="#78350F" stroke="#4D2B82" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function SVGSun({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="100%" stopColor="#FF9F29" />
        </linearGradient>
      </defs>
      <g className="animate-[spin_45s_linear_infinite]" style={{ transformOrigin: "50px 50px" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <polygon
            key={deg}
            points="50,12 43,30 57,30"
            fill="#FFD700"
            stroke="#4D2B82"
            strokeWidth="2.5"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="24" fill="url(#sunGrad)" stroke="#4D2B82" strokeWidth="3.5" />
      <circle cx="43" cy="46" r="2.5" fill="#4D2B82" />
      <circle cx="57" cy="46" r="2.5" fill="#4D2B82" />
      <circle cx="37" cy="51" r="2" fill="#FF8A8A" opacity="0.6" />
      <circle cx="63" cy="51" r="2" fill="#FF8A8A" opacity="0.6" />
      <path d="M 45 52 Q 50 58 55 52" stroke="#4D2B82" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Interfaces
interface GardenPlot {
  id: number;
  plantType: "apple" | "orange" | "flower" | "sunflower" | null;
  isWatered: boolean;
  growthEndTime: number | null; // Timestamp in ms
}

interface AnimalState {
  id: number;
  x: number;
  y: number;
  isEating: boolean;
  angle: number;
}

interface MagicGardenProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars: React.Dispatch<React.SetStateAction<number>>;
}

export default function MagicGarden({ onClose, globalStars, setGlobalStars }: MagicGardenProps) {
  // Cloud Intro Animation state
  const [introActive, setIntroActive] = useState(true);

  // 20 Plots State
  const [plots, setPlots] = useState<GardenPlot[]>([]);
  
  // Animal Paddock Counts
  const [sheepCount, setSheepCount] = useState(0);
  const [rabbitCount, setRabbitCount] = useState(0);
  const [duckCount, setDuckCount] = useState(0);
  const [petCount, setPetCount] = useState(0); // combined cat/dog

  // Animal instances for visual wandering
  const [sheepList, setSheepList] = useState<AnimalState[]>([]);
  const [rabbitList, setRabbitList] = useState<AnimalState[]>([]);
  const [duckList, setDuckList] = useState<AnimalState[]>([]);
  const [petList, setPetList] = useState<AnimalState[]>([]);

  // Modals & Notifications
  const [activePlotId, setActivePlotId] = useState<number | null>(null);
  const [showSeedShop, setShowSeedShop] = useState(false);
  const [showAnimalShop, setShowAnimalShop] = useState(false);
  const [noticeText, setNoticeText] = useState<string | null>(null);
  
  // Time updates trigger
  const [timeTick, setTimeTick] = useState(0);

  // Seed metadata
  const seedsData = [
    { type: "apple", name: "شجرة التفاح 🍎", cost: 10, payout: 25 },
    { type: "orange", name: "شجرة البرتقال 🍊", cost: 15, payout: 35 },
    { type: "flower", name: "زهرة الورد الجوري 🌸", cost: 8, payout: 20 },
    { type: "sunflower", name: "عباد الشمس السعيد 🌻", cost: 12, payout: 30 },
  ] as const;

  // Initialize/Load State
  useEffect(() => {
    // Cloud transition trigger
    setTimeout(() => {
      setIntroActive(false);
    }, 2000);

    // Load 20 Plots
    const savedPlots = localStorage.getItem("bloomly_garden_plots_v2");
    if (savedPlots) {
      setPlots(JSON.parse(savedPlots));
    } else {
      const defaultPlots: GardenPlot[] = Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1,
        plantType: null,
        isWatered: false,
        growthEndTime: null,
      }));
      setPlots(defaultPlots);
      localStorage.setItem("bloomly_garden_plots_v2", JSON.stringify(defaultPlots));
    }

    // Load Animal Counts
    setSheepCount(Number(localStorage.getItem("bloomly_sheep_count") || "1"));
    setRabbitCount(Number(localStorage.getItem("bloomly_rabbit_count") || "1"));
    setDuckCount(Number(localStorage.getItem("bloomly_duck_count") || "1"));
    setPetCount(Number(localStorage.getItem("bloomly_pet_count") || "1"));
  }, []);

  // Save state helpers
  const savePlots = (newPlots: GardenPlot[]) => {
    setPlots(newPlots);
    localStorage.setItem("bloomly_garden_plots_v2", JSON.stringify(newPlots));
  };

  const saveAnimalCount = (type: "sheep" | "rabbit" | "duck" | "pet", val: number) => {
    localStorage.setItem(`bloomly_${type}_count`, val.toString());
    if (type === "sheep") setSheepCount(val);
    if (type === "rabbit") setRabbitCount(val);
    if (type === "duck") setDuckCount(val);
    if (type === "pet") setPetCount(val);
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
    setTimeout(() => setNoticeText(null), 2500);
  };

  // --- Real-time Countdown Timer tick loop ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Animal Wandering Simulation Loop ---
  useEffect(() => {
    const makeAnimals = (count: number) => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: 40 + Math.random() * 160, // random x in paddock box
        y: 40 + Math.random() * 140, // random y in paddock box
        isEating: false,
        angle: Math.random() * 360,
      }));
    };

    setSheepList(makeAnimals(sheepCount));
    setRabbitList(makeAnimals(rabbitCount));
    setDuckList(makeAnimals(duckCount));
    setPetList(makeAnimals(petCount));
  }, [sheepCount, rabbitCount, duckCount, petCount]);

  useEffect(() => {
    const wanderInterval = setInterval(() => {
      const updateWander = (list: AnimalState[]) => {
        return list.map(ani => {
          // 30% chance to eat, 70% chance to walk
          const eatChance = Math.random() < 0.3;
          if (eatChance) {
            return { ...ani, isEating: true };
          }
          return {
            ...ani,
            isEating: false,
            x: Math.max(20, Math.min(220, ani.x + (Math.random() * 60 - 30))),
            y: Math.max(20, Math.min(180, ani.y + (Math.random() * 50 - 25))),
            angle: Math.random() * 360,
          };
        });
      };

      setSheepList(prev => updateWander(prev));
      setRabbitList(prev => updateWander(prev));
      setDuckList(prev => updateWander(prev));
      setPetList(prev => updateWander(prev));
    }, 3500);

    return () => clearInterval(wanderInterval);
  }, []);

  // --- Actions ---
  const handlePlantSeed = (seedType: typeof seedsData[number]["type"]) => {
    const seed = seedsData.find(s => s.type === seedType);
    if (!seed || activePlotId === null) return;

    if (globalStars < seed.cost) {
      synth.playPop();
      triggerNotice("❌ ليس لديك نجوم كافية لشراء هذه البذرة!");
      return;
    }

    updateStars(-seed.cost);
    synth.playPop();

    const newPlots = plots.map(p => {
      if (p.id === activePlotId) {
        return {
          ...p,
          plantType: seedType,
          isWatered: false,
          growthEndTime: null,
        };
      }
      return p;
    });

    savePlots(newPlots);
    setShowSeedShop(false);
    setActivePlotId(null);
    triggerNotice(`🌱 تم زراعة بذرة ${seed.name}! اسقها الآن لتبدأ النمو.`);
  };

  const handleWater = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.plantType === null || plot.isWatered) return;

    if (globalStars < 2) {
      synth.playPop();
      triggerNotice("❌ تحتاج ٢ نجمة 💧 للري!");
      return;
    }

    updateStars(-2);
    synth.playWaterPour();

    const endTime = Date.now() + 30 * 60 * 1000; // 30 minutes in future

    const newPlots = plots.map(p => {
      if (p.id === plotId) {
        return {
          ...p,
          isWatered: true,
          growthEndTime: endTime,
        };
      }
      return p;
    });

    savePlots(newPlots);
    triggerNotice("💧 تم الري بنجاح! ستبدأ النبتة بالنمو، وتكتمل بعد ٣٠ دقيقة.");
  };

  const handleHarvest = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.plantType === null || !plot.isWatered || !plot.growthEndTime) return;

    if (Date.now() < plot.growthEndTime) return; // not ready

    const seed = seedsData.find(s => s.type === plot.plantType);
    if (!seed) return;

    updateStars(10); // Reward exactly 10 stars as requested
    synth.playHarvest();
    triggerNotice(`🎉 تهانينا! قمت بحصاد النجمة وحصلت على +10 نجوم! ⭐`);

    const newPlots = plots.map(p => {
      if (p.id === plotId) {
        return {
          id: p.id,
          plantType: null,
          isWatered: false,
          growthEndTime: null,
        };
      }
      return p;
    });

    savePlots(newPlots);
  };

  // CHEAT/DEVELOPER Fast-forward helper to instant grow
  const handleFastForward = (plotId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const plot = plots.find(p => p.id === plotId);
    if (!plot || !plot.isWatered) return;

    synth.playHarvest();
    const newPlots = plots.map(p => {
      if (p.id === plotId) {
        return {
          ...p,
          growthEndTime: Date.now() - 1000, // force complete
        };
      }
      return p;
    });
    savePlots(newPlots);
    triggerNotice("⚡ تم تسريع النمو بنجاح للفحص السريع!");
  };

  const handleBuyAnimal = (type: "sheep" | "rabbit" | "duck" | "pet", cost: number, name: string) => {
    let currentCount = 0;
    if (type === "sheep") currentCount = sheepCount;
    if (type === "rabbit") currentCount = rabbitCount;
    if (type === "duck") currentCount = duckCount;
    if (type === "pet") currentCount = petCount;

    if (currentCount >= 12) {
      synth.playPop();
      triggerNotice(`❌ عذراً! حظيرة ${name} ممتلئة بالكامل (الحد الأقصى ١٢ حيوان).`);
      return;
    }

    if (globalStars < cost) {
      synth.playPop();
      triggerNotice("❌ ليس لديك نجوم كافية لشراء هذا الحيوان!");
      return;
    }

    updateStars(-cost);
    synth.playPetUnlock();
    saveAnimalCount(type, currentCount + 1);
    triggerNotice(`🐣 تم شراء ${name} جديد وإضافته للحظيرة!`);
  };

  // Timer String helper
  const getTimerString = (endTime: number | null) => {
    if (!endTime) return "";
    const diff = endTime - Date.now();
    if (diff <= 0) return "جاهز! ★";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-[#DCFCE7] select-none font-sans flex flex-col justify-between overflow-hidden">
      
      {/* --- CLOUD INTRO PARTING ANIMATION --- */}
      <AnimatePresence>
        {introActive && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex pointer-events-none select-none"
          >
            {/* Left Cloud Panel */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-[#E0F2FE] flex items-center justify-end relative shadow-2xl"
            >
              {/* Cloud Puff Vector Layer */}
              <div className="absolute right-[-80px] w-48 h-full flex flex-col justify-around text-white/95 text-9xl">
                <span>☁️</span>
                <span>☁️</span>
                <span>☁️</span>
              </div>
            </motion.div>

            {/* Right Cloud Panel */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-[#E0F2FE] flex items-center justify-start relative shadow-2xl"
            >
              <div className="absolute left-[-80px] w-48 h-full flex flex-col justify-around text-white/95 text-9xl">
                <span>☁️</span>
                <span>☁️</span>
                <span>☁️</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Navigation */}
      <header className="garden-header w-full bg-white/90 backdrop-blur-md border-b-4 border-[#4D2B82] p-4 flex items-center justify-between shadow-md relative z-30">
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
            مزرعتك السحرية الكبيرة من الأعلى 🌿🛸
          </h1>
          <p className="text-xs font-bold text-emerald-600">
            أقسام حظائر الحيوانات بحد أقصى ١٢، و٢٠ شجرة مع مؤقت ٣٠ دقيقة!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              synth.playPop();
              setShowAnimalShop(true);
            }}
            className="btn-bubbly-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            🐾 متجر حظائر الحيوانات
          </button>

          <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-2 border-[#D97706] text-[#D97706] font-extrabold text-sm px-4 py-1.5 rounded-full shadow-inner">
            <span className="text-lg text-yellow-400">★</span>
            <span>نجومك: {globalStars}</span>
          </div>
        </div>
      </header>

      {/* 2. Notification Overlay Banner */}
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

      {/* 3. Infinite Scrollable Top-Down Map Field */}
      <main className="flex-grow w-full overflow-auto scrollbar-none relative bg-[#C2F0C2] border-t-2 border-emerald-800">
        
        {/* Large 1500px x 1000px coordinate grid */}
        <div className="w-[1500px] h-[1000px] relative z-10 bg-gradient-to-br from-[#A2E3A2] via-[#B2EBB2] to-[#AEE8AE] p-8 overflow-hidden select-none">
          
          {/* Paths and dirt roads decor */}
          <div className="absolute top-[380px] left-[50px] w-[1400px] h-12 bg-[#E1C699] border-y-3 border-dashed border-[#8C6D47]/40 z-0" />
          <div className="absolute top-[80px] left-[450px] w-12 h-[800px] bg-[#E1C699] border-x-3 border-dashed border-[#8C6D47]/40 z-0" />

          {/* Glowing sun element decorative */}
          <div className="absolute top-8 right-24 pointer-events-none opacity-40 z-0">
            <SVGSun className="w-28 h-28" />
          </div>

          {/* ==============================================
              SECTION A: ANIMAL PADDOCKS (حظائر الحيوانات)
              ============================================== */}

          {/* 1. DUCK POND (بحيرة البط) */}
          <div 
            className="absolute left-[50px] top-[60px] w-[360px] h-[260px] bg-gradient-to-tr from-[#93C5FD] to-[#3B82F6] rounded-[60px] border-4 border-[#1E3A8A] shadow-lg flex flex-col justify-between p-4 overflow-hidden z-10"
          >
            <div className="text-white font-black text-xs bg-blue-900/60 w-fit px-2.5 py-0.5 rounded-full">
              🦆 بحيرة البط ({duckCount}/12)
            </div>
            
            {/* Ducks swimming inside pond */}
            <div className="relative w-full h-full">
              {duckList.map((duck) => (
                <div
                  key={duck.id}
                  className="absolute transition-all duration-[3000ms] ease-in-out"
                  style={{ left: `${duck.x}px`, top: `${duck.y}px` }}
                >
                  <SVGDuck className="w-10 h-10" isEating={duck.isEating} />
                </div>
              ))}
            </div>
          </div>

          {/* 2. RABBIT PADDOCK (حظيرة الأرانب) */}
          <div 
            className="absolute left-[880px] top-[60px] w-[320px] h-[240px] bg-[#C5E1A5] rounded-[32px] border-4 border-[#33691E] shadow-md p-3 flex flex-col justify-between overflow-hidden z-10"
          >
            <div className="text-[#33691E] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#33691E]">
              🐰 حظيرة الأرانب ({rabbitCount}/12)
            </div>
            <div className="absolute top-12 right-6 text-2xl opacity-40">🥕 🥕</div>

            <div className="relative w-full h-full">
              {rabbitList.map((rab) => (
                <div
                  key={rab.id}
                  className="absolute transition-all duration-[3000ms] ease-in-out"
                  style={{ left: `${rab.x}px`, top: `${rab.y}px` }}
                >
                  <SVGBunny className="w-10 h-10" isEating={rab.isEating} />
                </div>
              ))}
            </div>
          </div>

          {/* 3. SHEEP PADDOCK (حظيرة الخراف) */}
          <div 
            className="absolute left-[50px] top-[480px] w-[350px] h-[280px] bg-[#E8F5E9] rounded-[40px] border-4 border-[#1B5E20] shadow-md p-4 flex flex-col justify-between overflow-hidden z-10"
          >
            <div className="text-[#1B5E20] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#1B5E20]">
              🐑 حظيرة الخراف ({sheepCount}/12)
            </div>

            <div className="relative w-full h-full">
              {sheepList.map((sheep) => (
                <div
                  key={sheep.id}
                  className="absolute transition-all duration-[3000ms] ease-in-out"
                  style={{ left: `${sheep.x}px`, top: `${sheep.y}px` }}
                >
                  <SVGSheep className="w-11 h-11" isEating={sheep.isEating} />
                </div>
              ))}
            </div>
          </div>

          {/* 4. CAT & DOG PADDOCK (حظيرة القطط والكلاب) */}
          <div 
            className="absolute left-[1050px] top-[480px] w-[380px] h-[300px] bg-[#FFE0B2] rounded-[40px] border-4 border-[#E65100] shadow-md p-4 flex flex-col justify-between overflow-hidden z-10"
          >
            <div className="text-[#E65100] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#E65100]">
              🐱🐶 حظيرة الأصدقاء ({petCount}/12)
            </div>
            <div className="absolute top-14 left-6 text-2xl opacity-40">🦴 🧶</div>

            <div className="relative w-full h-full">
              {petList.map((pet) => (
                <div
                  key={pet.id}
                  className="absolute transition-all duration-[3000ms] ease-in-out"
                  style={{ left: `${pet.x}px`, top: `${pet.y}px` }}
                >
                  {pet.id % 2 === 0 ? (
                    <SVGKitty className="w-11 h-11" isEating={pet.isEating} />
                  ) : (
                    <SVGPuppy className="w-11 h-11" isEating={pet.isEating} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ==============================================
              SECTION B: 20 TREE PLOTS GRID (حقول الأشجار العشرون)
              ============================================== */}
          <div 
            className="absolute left-[480px] top-[380px] w-[500px] h-[480px] bg-[#A1887F]/30 rounded-[40px] border-4 border-dashed border-[#8D6E63] p-6 grid grid-cols-5 gap-y-12 gap-x-6 justify-items-center items-center z-10 shadow-inner"
          >
            {plots.map((plot) => {
              const isEmpty = plot.plantType === null;
              const isWatered = plot.isWatered;
              const hasEndTime = plot.growthEndTime !== null;
              const isFullyGrown = hasEndTime && Date.now() >= (plot.growthEndTime || 0);

              return (
                <div 
                  key={plot.id}
                  className="flex flex-col items-center gap-1.5 relative select-none w-18"
                >
                  
                  {/* Floating Action Button Cue overlay */}
                  {!isEmpty && (
                    <div className="absolute top-[-26px] z-20 flex gap-0.5">
                      
                      {/* Water requirement droplet icon */}
                      {!isWatered && (
                        <button
                          onClick={() => handleWater(plot.id)}
                          className="bg-blue-400 hover:bg-blue-500 text-white rounded-full p-1 border-2 border-blue-600 shadow-md animate-bounce cursor-pointer flex items-center justify-center"
                          title="اسقِ النبتة 💧"
                        >
                          <Droplet className="w-3.5 h-3.5 fill-white" />
                        </button>
                      )}

                      {/* Remaining Timer Countdown or Harvest Golden Star */}
                      {isWatered && !isFullyGrown && (
                        <div className="bg-white border-2 border-emerald-600 rounded-full px-1.5 py-0.5 text-[8px] font-black text-emerald-700 flex items-center gap-0.5 shadow-sm">
                          <Clock className="w-2.5 h-2.5 text-emerald-500" />
                          <span>{getTimerString(plot.growthEndTime)}</span>
                          
                          {/* Cheat Speedup button */}
                          <button
                            onClick={(e) => handleFastForward(plot.id, e)}
                            className="ml-1 bg-yellow-400 text-yellow-900 border border-yellow-600 rounded-full px-1 py-0 text-[6px] hover:bg-yellow-500 font-extrabold cursor-pointer"
                          >
                            ⚡
                          </button>
                        </div>
                      )}

                      {/* Ready to Harvest Star button */}
                      {isFullyGrown && (
                        <button
                          onClick={() => handleHarvest(plot.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-full p-1 border-2 border-yellow-600 shadow-lg animate-bounce-slow flex items-center justify-center cursor-pointer font-black text-xs"
                          title="احصد النجوم! 🌾"
                        >
                          ⭐
                        </button>
                      )}
                    </div>
                  )}

                  {/* Soil Pot/Plant Representation */}
                  <div
                    onClick={() => {
                      synth.playPop();
                      if (isEmpty) {
                        setActivePlotId(plot.id);
                        setShowSeedShop(true);
                      }
                    }}
                    className={`w-14 h-14 rounded-full flex flex-col justify-end items-center relative cursor-pointer ${
                      isEmpty 
                        ? "bg-[#8D6E63] border-3 border-[#4E342E] hover:bg-[#795548] shadow-inner" 
                        : "bg-transparent"
                    }`}
                  >
                    {isEmpty ? (
                      <span className="text-white font-extrabold text-lg mb-1">+</span>
                    ) : (
                      <div className="mb-[-6px] relative z-10">
                        <SVGTopDownPlant
                          type={plot.plantType!}
                          stage={isFullyGrown ? 3 : isWatered ? 2 : 1}
                        />
                      </div>
                    )}
                    {/* Dirt base plate */}
                    <div className="absolute bottom-0 w-12 h-3.5 bg-[#5D4037]/60 rounded-full z-0" />
                  </div>

                  <span className="text-[8px] font-black text-[#5D4037] bg-white/60 px-1 py-0.2 rounded border border-amber-200">
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
                    <span className="text-5xl">{seed.type === "apple" ? "🍎" : seed.type === "orange" ? "🍊" : seed.type === "flower" ? "🌸" : "🌻"}</span>
                    <span className="text-sm font-extrabold text-[#4D2B82]">{seed.name}</span>
                    
                    <div className="flex flex-col items-center gap-1 mt-2">
                      <span className="text-xs font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        الشراء: {seed.cost}⭐
                      </span>
                      <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        الحصاد: 10⭐
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. ANIMAL SHOP MODAL */}
      <AnimatePresence>
        {showAnimalShop && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-[#4D2B82] rounded-[32px] p-6 max-w-md w-full text-center shadow-[0_8px_0_0_#4D2B82] relative"
            >
              <button
                onClick={() => {
                  synth.playPop();
                  setShowAnimalShop(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black text-[#4D2B82] mb-1">🐾 متجر حظائر الحيوانات</h2>
              <p className="text-xs font-bold text-purple-400 mb-6">افتح حيوانات جديدة لحظائرك باستخدام النجوم! (الحد الأقصى ١٢ حيوان بكل حظيرة)</p>

              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                {/* 1. Sheep */}
                <div className="flex items-center justify-between p-3 border-2 border-purple-100 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">🐑</span>
                    <div className="text-right">
                      <h4 className="font-extrabold text-sm text-[#4D2B82]">خروف الحظيرة</h4>
                      <p className="text-[10px] text-gray-500">تم الشراء: {sheepCount}/12</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyAnimal("sheep", 20, "الخراف")}
                    disabled={sheepCount >= 12}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-150 disabled:text-gray-400 text-yellow-900 border-2 border-yellow-600 px-4 py-1.5 rounded-full font-black text-xs cursor-pointer"
                  >
                    {sheepCount >= 12 ? "ممتلئ" : "شراء (20⭐)"}
                  </button>
                </div>

                {/* 2. Rabbit */}
                <div className="flex items-center justify-between p-3 border-2 border-purple-100 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">🐰</span>
                    <div className="text-right">
                      <h4 className="font-extrabold text-sm text-[#4D2B82]">أرنوب القفاز</h4>
                      <p className="text-[10px] text-gray-500">تم الشراء: {rabbitCount}/12</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyAnimal("rabbit", 15, "الأرانب")}
                    disabled={rabbitCount >= 12}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-150 disabled:text-gray-400 text-yellow-900 border-2 border-yellow-600 px-4 py-1.5 rounded-full font-black text-xs cursor-pointer"
                  >
                    {rabbitCount >= 12 ? "ممتلئ" : "شراء (15⭐)"}
                  </button>
                </div>

                {/* 3. Duck */}
                <div className="flex items-center justify-between p-3 border-2 border-purple-100 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">🦆</span>
                    <div className="text-right">
                      <h4 className="font-extrabold text-sm text-[#4D2B82]">بطوطة البحيرة</h4>
                      <p className="text-[10px] text-gray-500">تم الشراء: {duckCount}/12</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyAnimal("duck", 22, "البط")}
                    disabled={duckCount >= 12}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-150 disabled:text-gray-400 text-yellow-900 border-2 border-yellow-600 px-4 py-1.5 rounded-full font-black text-xs cursor-pointer"
                  >
                    {duckCount >= 12 ? "ممتلئ" : "شراء (22⭐)"}
                  </button>
                </div>

                {/* 4. Friends */}
                <div className="flex items-center justify-between p-3 border-2 border-purple-100 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">🐱🐶</span>
                    <div className="text-right">
                      <h4 className="font-extrabold text-sm text-[#4D2B82]">القط والكلب الأصدقاء</h4>
                      <p className="text-[10px] text-gray-500">تم الشراء: {petCount}/12</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyAnimal("pet", 25, "الأصدقاء")}
                    disabled={petCount >= 12}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-150 disabled:text-gray-400 text-yellow-900 border-2 border-yellow-600 px-4 py-1.5 rounded-full font-black text-xs cursor-pointer"
                  >
                    {petCount >= 12 ? "ممتلئ" : "شراء (25⭐)"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
