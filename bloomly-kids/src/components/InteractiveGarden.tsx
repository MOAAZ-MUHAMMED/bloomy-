import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Web Audio API Synthesizer for Retro Game Sounds (Zero Dependency)
class KidsSoundSynth {
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
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playJump() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "triangle";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Note 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.1, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Note 2 (slightly delayed)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(783.99, now + 0.08); // G5
      gain2.gain.setValueAtTime(0.1, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.38);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playMagic() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      osc.frequency.linearRampToValueAtTime(450, now + 0.2);
      osc.frequency.linearRampToValueAtTime(900, now + 0.3);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }
}

const synth = new KidsSoundSynth();

interface FloatingStar {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface FloatingLetter {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface FloatingBubble {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function InteractiveGarden() {
  const [skyMode, setSkyMode] = useState<"day" | "sunset" | "night">("day");
  const [characterJumping, setCharacterJumping] = useState(false);
  const [stars, setStars] = useState<FloatingStar[]>([]);
  const [letters, setLetters] = useState<FloatingLetter[]>([]);
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  const [starCount, setStarCount] = useState(3);
  const [sunEyesOpen, setSunEyesOpen] = useState(false);
  const characterRef = useRef<HTMLDivElement>(null);

  // Trigger character bounce
  const triggerCharacterJump = () => {
    if (characterJumping) return;
    setCharacterJumping(true);
    synth.playJump();
    setTimeout(() => setCharacterJumping(false), 600);
  };

  // Button 1: Spawn Flying Stars
  const handleButton1 = () => {
    synth.playChime();
    setStarCount((prev) => prev + 1);
    const newStars = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40, // percent inside garden
      y: 70 + Math.random() * 10,
      color: ["#FFD700", "#FF659F", "#4FD1C5", "#F6AD55", "#9F7AEA"][Math.floor(Math.random() * 5)],
    }));
    setStars((prev) => [...prev, ...newStars]);
  };

  // Button 2: Spawn Sprout Jump
  const handleButton2 = () => {
    triggerCharacterJump();
  };

  // Button 3: Spawn Bubbles
  const handleButton3 = () => {
    synth.playPop();
    const newBubbles = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      y: 75,
      size: 15 + Math.random() * 20,
    }));
    setBubbles((prev) => [...prev, ...newBubbles]);
  };

  // Button 4: Spawn Floating Arabic Letters
  const handleButton4 = () => {
    synth.playChime();
    const alphabet = ["أ", "ب", "ت", "ج", "ح", "خ", "د", "م", "ن", "و"];
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const newLetter = {
      id: Date.now(),
      x: 40 + Math.random() * 20,
      y: 70,
      text: randomLetter,
    };
    setLetters((prev) => [...prev, newLetter]);
  };

  // Button 5: Toggle Sky Mode (Day -> Sunset -> Night)
  const handleButton5 = () => {
    synth.playMagic();
    setSkyMode((prev) => {
      if (prev === "day") return "sunset";
      if (prev === "sunset") return "night";
      return "day";
    });
  };

  // Cleanup old floating elements
  useEffect(() => {
    const timer = setInterval(() => {
      setStars((prev) => prev.filter((s) => Date.now() - s.id < 1500));
      setLetters((prev) => prev.filter((l) => Date.now() - l.id < 2000));
      setBubbles((prev) => prev.filter((b) => Date.now() - b.id < 2000));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Sky styling based on mode
  const getSkyBg = () => {
    if (skyMode === "day") return "from-[#E3F2FD] to-[#BBDEFB]";
    if (skyMode === "sunset") return "from-[#FEE1BA] to-[#F48FB1]";
    return "from-[#1A237E] to-[#0D47A1]";
  };

  return (
    <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-[32px] border-4 border-[#4D2B82] shadow-[0_12px_0_0_#4D2B82] bg-white overflow-hidden select-none">
      
      {/* 1. Sky Area */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getSkyBg()} transition-all duration-1000 z-0`}>
        
        {/* Floating Background Blobs inside Sky */}
        <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
        
        {/* Night Stars / Crescent Moon */}
        {skyMode === "night" && (
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-[15%] left-[15%] text-yellow-200 text-4xl select-none"
            >
              🌙
            </motion.div>
            <div className="absolute top-[10%] right-[20%] w-2 h-2 bg-white rounded-full animate-ping" />
            <div className="absolute top-[30%] right-[40%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <div className="absolute top-[25%] left-[45%] w-2 h-2 bg-yellow-100 rounded-full animate-pulse" />
          </>
        )}

        {/* Sun (Visible in Day and Sunset) */}
        {skyMode !== "night" && (
          <motion.div
            className="absolute top-[12%] left-[12%] cursor-pointer z-10"
            onMouseEnter={() => setSunEyesOpen(true)}
            onMouseLeave={() => setSunEyesOpen(false)}
            onClick={() => { synth.playPop(); setSunEyesOpen(!sunEyesOpen); }}
            animate={{
              rotate: sunEyesOpen ? 360 : 0,
            }}
            transition={{
              rotate: sunEyesOpen ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.5 }
            }}
          >
            {/* Sun Body */}
            <div className="relative w-16 h-16 bg-yellow-400 rounded-full border-3 border-[#4D2B82] flex items-center justify-center">
              {/* Sun Rays */}
              <div className="absolute w-20 h-20 border-2 border-dashed border-yellow-500/40 rounded-full animate-spin-slow" />
              {/* Face */}
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <div className="flex space-x-2">
                  <span className="text-[10px] font-bold">{sunEyesOpen ? "👀" : "◡◡"}</span>
                </div>
                <div className="w-2 h-1 bg-[#4D2B82] rounded-full" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Clouds */}
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] text-white/95 text-4xl select-none filter drop-shadow-[0_2px_0_#4D2B82] pointer-events-none"
        >
          ☁️
        </motion.div>
        
        <motion.div
          animate={{ x: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-[12%] right-[50%] text-white/80 text-3xl select-none filter drop-shadow-[0_2px_0_#4D2B82] pointer-events-none"
        >
          ☁️
        </motion.div>

        {/* Floating Stars Elements */}
        <AnimatePresence>
          {stars.map((star) => (
            <motion.div
              key={star.id}
              initial={{ opacity: 0, scale: 0.2, y: "70%" }}
              animate={{ opacity: 1, scale: 1.4, y: "15%", rotate: 180 }}
              exit={{ opacity: 0, scale: 0.1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute pointer-events-none z-30 text-2xl"
              style={{ left: `${star.x}%`, color: star.color, filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.1))" }}
            >
              ★
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Floating Arabic Letters */}
        <AnimatePresence>
          {letters.map((letObj) => (
            <motion.div
              key={letObj.id}
              initial={{ opacity: 0, scale: 0.5, y: "70%" }}
              animate={{ opacity: 1, scale: 1.6, y: "20%", rotate: Math.random() * 60 - 30 }}
              exit={{ opacity: 0, scale: 0.1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute pointer-events-none z-30 font-bold bg-white text-[#E01E5A] px-2 py-0.5 rounded-full border-2 border-[#4D2B82] shadow-sm text-lg"
              style={{ left: `${letObj.x}%` }}
            >
              {letObj.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Floating Bubbles */}
        <AnimatePresence>
          {bubbles.map((bub) => (
            <motion.div
              key={bub.id}
              initial={{ opacity: 0, y: "75%" }}
              animate={{ opacity: 0.7, y: "15%", scale: [1, 1.2, 0.9, 1.1] }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              onClick={() => { synth.playPop(); setBubbles(prev => prev.filter(b => b.id !== bub.id)); }}
              className="absolute rounded-full border-2 border-white/60 bg-white/20 shadow-inner cursor-pointer z-30"
              style={{
                left: `${bub.x}%`,
                width: bub.size,
                height: bub.size,
                backdropFilter: "blur(1px)"
              }}
            />
          ))}
        </AnimatePresence>

      </div>

      {/* 2. Landscape Hills */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[#4CAF50] border-t-4 border-[#4D2B82] z-10 overflow-hidden">
        {/* Secondary Hill for depth */}
        <div className="absolute -left-12 -top-12 w-64 h-32 bg-[#81C784] rounded-full border-b-4 border-[#4D2B82] rotate-12 z-0" />
        
        {/* Bouncing character */}
        <motion.div
          ref={characterRef}
          onClick={triggerCharacterJump}
          className="absolute left-[38%] bottom-[12%] cursor-pointer z-20"
          animate={{
            y: characterJumping ? -90 : 0,
            scaleX: characterJumping ? [0.8, 1, 1.1, 0.85, 1] : 1,
            scaleY: characterJumping ? [1.2, 1, 0.9, 1.15, 1] : 1,
            rotate: characterJumping ? [0, -15, 15, 0] : 0,
          }}
          transition={{
            y: { duration: 0.5, ease: "easeOut" },
            default: { duration: 0.5 }
          }}
        >
          {/* Sprout Character */}
          <div className="relative flex flex-col items-center">
            {/* Head Leaves */}
            <div className="flex space-x-0.5 -mb-2 z-10">
              <motion.div 
                animate={{ rotate: characterJumping ? [-15, 15] : [-5, 5] }}
                transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
                className="w-5 h-7 bg-[#81C784] rounded-tl-full rounded-br-full border-2 border-[#4D2B82] origin-bottom-right"
              />
              <motion.div 
                animate={{ rotate: characterJumping ? [15, -15] : [5, -5] }}
                transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
                className="w-5 h-7 bg-[#81C784] rounded-tr-full rounded-bl-full border-2 border-[#4D2B82] origin-bottom-left"
              />
            </div>
            
            {/* Sprout Body (Cute Green Apple/Bean) */}
            <div className="w-16 h-16 bg-[#2ECC71] rounded-full border-3 border-[#4D2B82] shadow-[inset_-3px_-3px_0_0_#27AE60] flex flex-col items-center justify-center">
              {/* Cute Eyes */}
              <div className="flex space-x-3 mt-1.5">
                <div className="w-3.5 h-3.5 bg-[#4D2B82] rounded-full flex items-start justify-start p-0.5">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <div className="w-3.5 h-3.5 bg-[#4D2B82] rounded-full flex items-start justify-start p-0.5">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
              
              {/* Pink Cheeks */}
              <div className="flex justify-between w-11 -mt-1 px-1">
                <div className="w-2.5 h-1.5 bg-[#FF6B6B] rounded-full opacity-60" />
                <div className="w-2.5 h-1.5 bg-[#FF6B6B] rounded-full opacity-60" />
              </div>

              {/* Smiling Mouth (Open happy cartoon smile with a pink tongue) */}
              <div className="w-5 h-3 bg-[#4D2B82] rounded-b-full relative overflow-hidden mt-0.5 flex items-end justify-center">
                <div className="w-3 h-2 bg-[#FF6B6B] rounded-full translate-y-[1px]" />
              </div>
            </div>

            {/* Tiny Hands */}
            <div className="absolute top-[50%] left-[-6px] w-3 h-3 bg-[#2ECC71] rounded-full border-2 border-[#4D2B82]" />
            <div className="absolute top-[50%] right-[-6px] w-3 h-3 bg-[#2ECC71] rounded-full border-2 border-[#4D2B82]" />
          </div>
        </motion.div>

        {/* Ladybug crawling */}
        <motion.div
          animate={{
            x: [40, 320, 40],
            y: [50, 45, 50],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          }}
          onClick={() => { synth.playPop(); }}
          className="absolute bottom-[8%] left-0 w-8 h-6 bg-[#E01E5A] rounded-t-full border-2 border-[#4D2B82] flex items-center justify-center cursor-pointer z-20"
        >
          {/* Spots */}
          <div className="absolute left-1 top-1 w-1.5 h-1.5 bg-[#4D2B82] rounded-full" />
          <div className="absolute right-1 top-1 w-1.5 h-1.5 bg-[#4D2B82] rounded-full" />
          <div className="absolute left-2.5 top-3.5 w-1 h-1 bg-[#4D2B82] rounded-full" />
          {/* Black Head */}
          <div className="absolute left-0 bottom-0.5 w-2.5 h-4 bg-[#4D2B82] rounded-l-full border-r border-[#4D2B82]" />
        </motion.div>

        {/* Cute blooming flowers */}
        <motion.div
          whileHover={{ scale: 1.3, rotate: 15 }}
          className="absolute left-[15%] bottom-[15%] w-6 h-6 flex items-center justify-center cursor-pointer z-10"
        >
          {/* Petals */}
          <div className="absolute w-2 h-2 bg-[#FF659F] rounded-full -top-1" />
          <div className="absolute w-2 h-2 bg-[#FF659F] rounded-full -bottom-1" />
          <div className="absolute w-2 h-2 bg-[#FF659F] rounded-full -left-1" />
          <div className="absolute w-2 h-2 bg-[#FF659F] rounded-full -right-1" />
          {/* Center */}
          <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full z-10 border border-[#4D2B82]" />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.3, rotate: -15 }}
          className="absolute right-[18%] bottom-[10%] w-8 h-8 flex items-center justify-center cursor-pointer z-10"
        >
          {/* Petals */}
          <div className="absolute w-3 h-3 bg-purple-400 rounded-full -top-1.5" />
          <div className="absolute w-3 h-3 bg-purple-400 rounded-full -bottom-1.5" />
          <div className="absolute w-3 h-3 bg-purple-400 rounded-full -left-1.5" />
          <div className="absolute w-3 h-3 bg-purple-400 rounded-full -right-1.5" />
          {/* Center */}
          <div className="w-3.5 h-3.5 bg-yellow-300 rounded-full z-10 border border-[#4D2B82]" />
        </motion.div>
      </div>

      {/* 3. Floating Pill Badges */}
      
      {/* Top Right Star Badge */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-4 right-4 z-20 bg-yellow-100/90 backdrop-blur-sm border-2 border-[#D97706] text-[#D97706] text-xs font-extrabold px-3 py-1 rounded-full shadow-sm flex items-center gap-1"
      >
        <span>★</span>
        <span>كسبت {starCount}+ نجوم!</span>
      </motion.div>

      {/* Bottom Left Read Badge */}
      <motion.div
        animate={{ y: [0, 3, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute bottom-16 left-4 z-20 bg-white/95 backdrop-blur-sm border-2 border-[#4D2B82] text-[#4D2B82] text-xs font-extrabold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5"
      >
        <span>📖</span>
        <span>يوسف قرأ "نور"!</span>
      </motion.div>

      {/* 4. Interactive Button Bar (Overlay on grass bottom) */}
      <div className="absolute bottom-3 inset-x-0 mx-auto w-[90%] max-w-[320px] bg-white/90 backdrop-blur-sm border-3 border-[#4D2B82] rounded-full p-1.5 flex items-center justify-around z-30 shadow-md">
        
        <button
          onClick={handleButton1}
          title="نجوم طائرة"
          className="w-10 h-10 rounded-full bg-yellow-300 border-2 border-[#4D2B82] text-white font-extrabold flex items-center justify-center shadow-[0_2.5px_0_0_#4D2B82] active:translate-y-[2px] active:shadow-none hover:-translate-y-[1px] hover:bg-yellow-400 transition-all cursor-pointer text-sm"
        >
          ⭐
        </button>

        <button
          onClick={handleButton2}
          title="قفز البرعم"
          className="w-10 h-10 rounded-full bg-green-400 border-2 border-[#4D2B82] text-white font-extrabold flex items-center justify-center shadow-[0_2.5px_0_0_#4D2B82] active:translate-y-[2px] active:shadow-none hover:-translate-y-[1px] hover:bg-green-500 transition-all cursor-pointer text-sm"
        >
          🌱
        </button>

        <button
          onClick={handleButton3}
          title="فقاعات"
          className="w-10 h-10 rounded-full bg-blue-300 border-2 border-[#4D2B82] text-white font-extrabold flex items-center justify-center shadow-[0_2.5px_0_0_#4D2B82] active:translate-y-[2px] active:shadow-none hover:-translate-y-[1px] hover:bg-blue-400 transition-all cursor-pointer text-sm"
        >
          🫧
        </button>

        <button
          onClick={handleButton4}
          title="حروف عربية"
          className="w-10 h-10 rounded-full bg-pink-300 border-2 border-[#4D2B82] text-[#4D2B82] font-extrabold flex items-center justify-center shadow-[0_2.5px_0_0_#4D2B82] active:translate-y-[2px] active:shadow-none hover:-translate-y-[1px] hover:bg-pink-400 transition-all cursor-pointer text-base"
        >
          أ
        </button>

        <button
          onClick={handleButton5}
          title="تغيير السماء"
          className="w-10 h-10 rounded-full bg-purple-300 border-2 border-[#4D2B82] text-white font-extrabold flex items-center justify-center shadow-[0_2.5px_0_0_#4D2B82] active:translate-y-[2px] active:shadow-none hover:-translate-y-[1px] hover:bg-purple-400 transition-all cursor-pointer text-sm"
        >
          ☁️
        </button>

      </div>

    </div>
  );
}
