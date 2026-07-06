import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Custom local Sound Synthesizer for the Intro ---
class IntroSound {
  private ctx: AudioContext | null = null;

  private init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Intro AudioContext init failed:", e);
    }
  }

  playIntroFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Rising magical arpeggio sweep
      const sweepNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      sweepNotes.forEach((freq, i) => {
        const startTime = now + (i * 0.08);
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });

      // 2. Resolve Chord Fanfare at the end
      const finalChord = [523.25, 659.25, 783.99, 1046.50];
      finalChord.forEach(freq => {
        const startTime = now + 0.56;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

        osc.start(startTime);
        osc.stop(startTime + 1.2);
      });

      // 3. Kids Cheering white-noise synthesis
      const cheerDur = 1.8;
      const bufferSize = this.ctx.sampleRate * cheerDur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1000, now + 0.3);
      noiseFilter.Q.setValueAtTime(1.0, now + 0.3);

      const noiseGain = this.ctx.createGain();
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.15, now + 0.4);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + cheerDur);

      noise.start(now + 0.2);
      noise.stop(now + cheerDur);

      // 4. "Woohoo" happy chirps
      const chirps = [0.35, 0.5, 0.65];
      chirps.forEach((delayTime) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = "sine";
        const startFreq = 400 + Math.random() * 100;
        osc.frequency.setValueAtTime(startFreq, now + delayTime);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 300, now + delayTime + 0.2);

        gain.gain.setValueAtTime(0, now + delayTime);
        gain.gain.linearRampToValueAtTime(0.1, now + delayTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delayTime + 0.2);

        osc.start(now + delayTime);
        osc.stop(now + delayTime + 0.2);
      });

    } catch (e) {
      console.warn("Fanfare playback failed:", e);
    }
  }

  playJump() {
    try {
      this.init();
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
      console.warn("Jump sound failed:", e);
    }
  }
}

const introSfx = new IntroSound();

interface IntroScreenProps {
  onFinish: () => void;
}

export function IntroScreen({ onFinish }: IntroScreenProps) {
  // Step control states
  const [playCardState, setPlayCardState] = useState<"hidden" | "visible" | "exit">("hidden");
  const [learnCardState, setLearnCardState] = useState<"hidden" | "visible" | "exit">("hidden");
  const [showSprout, setShowSprout] = useState(false);
  const [sproutJumping, setSproutJumping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<any[]>([]);

  // Green paint splatters states
  const [showStartSplatter, setShowStartSplatter] = useState(false);
  const [showPlaySplatter, setShowPlaySplatter] = useState(false);
  const [showLearnSplatter, setShowLearnSplatter] = useState(false);

  // 9 delayed splash particles popping around the sprout when it appears
  const splashParticles = [
    { emoji: "🧸", delay: 1.5, startX: "38%", startY: "48%", endX: "-12vw", endY: "8vh", scale: 1.2 },
    { emoji: "🦆", delay: 1.6, startX: "42%", startY: "44%", endX: "-18vw", endY: "-12vh", scale: 1.3 },
    { emoji: "⭐", delay: 1.7, startX: "46%", startY: "42%", endX: "-8vw", endY: "-20vh", scale: 1.1 },
    { emoji: "🎨", delay: 1.8, startX: "54%", startY: "42%", endX: "8vw", endY: "-20vh", scale: 1.2 },
    { emoji: "🐱", delay: 1.9, startX: "58%", startY: "44%", endX: "18vw", endY: "-12vh", scale: 1.3 },
    { emoji: "🌸", delay: 2.0, startX: "62%", startY: "48%", endX: "16vw", endY: "8vh", scale: 1.1 },
    { emoji: "🎈", delay: 2.1, startX: "50%", startY: "50%", endX: "0vw", endY: "18vh", scale: 1.4 },
    { emoji: "🎵", delay: 2.2, startX: "45%", startY: "48%", endX: "-10vw", endY: "18vh", scale: 1.2 },
    { emoji: "📚", delay: 2.3, startX: "55%", startY: "48%", endX: "10vw", endY: "18vh", scale: 1.3 },
  ];

  useEffect(() => {
    // Play Welcome Audio (أهلاً بك يا بطل)
    const playWelcome = () => {
      const audio = new Audio("/welcome_hero.mp3");
      audio.volume = 0.95;
      audio.play().catch(() => {
        // Fallback: play on first user interaction
        const playOnInteract = () => {
          audio.play().catch(() => {});
          window.removeEventListener("mousedown", playOnInteract);
          window.removeEventListener("touchstart", playOnInteract);
        };
        window.addEventListener("mousedown", playOnInteract);
        window.addEventListener("touchstart", playOnInteract);
      });
    };
    const welcomeTimer = setTimeout(playWelcome, 200);

    // Start splatter triggers at 50ms
    const startSmokeTimer = setTimeout(() => setShowStartSplatter(true), 50);
    const startSmokeOff = setTimeout(() => setShowStartSplatter(false), 500);

    // 1. Reveal "العب" word & paint splatter at 400ms (when dot hits it)
    const playWordTimer = setTimeout(() => {
      setPlayCardState("visible");
      setShowPlaySplatter(true);
    }, 400);
    const playSmokeOff = setTimeout(() => setShowPlaySplatter(false), 900);

    // 1.5 Make "العب" camera viewport shift at 1200ms (as dot leaves it)
    const playWordExitTimer = setTimeout(() => {
      setPlayCardState("exit");
    }, 1800); // Extended duration so user can read it

    // 2. Reveal "تعلم" word & paint splatter at 1600ms (when dot hits it)
    const learnWordTimer = setTimeout(() => {
      setLearnCardState("visible");
      setShowLearnSplatter(true);
    }, 1600);
    const learnSmokeOff = setTimeout(() => setShowLearnSplatter(false), 2100);

    // 2.5 Make "تعلم" camera viewport shift at 2400ms (as dot leaves it)
    const learnWordExitTimer = setTimeout(() => {
      setLearnCardState("exit");
    }, 2800); // Extended duration so user can read it

    // 3. Reveal Sprout mascot and play chimes/fanfare/TTS at 3000ms (when dot finishes the race)
    const sproutTimer = setTimeout(() => {
      setShowSprout(true);
      introSfx.playIntroFanfare();
      
      // Confetti burst from corners
      setShowConfetti(true);
      const colors = ["#FF5A92", "#5BF8A3", "#FFD700", "#5BC0F8", "#A855F7", "#FF9F29"];
      const particles = Array.from({ length: 65 }).map((_, i) => {
        const isLeft = i % 2 === 0;
        const startX = isLeft ? 6 : 94;
        const startY = 85;
        const peakX = isLeft ? 15 + Math.random() * 40 : 45 + Math.random() * 40;
        const peakY = 10 + Math.random() * 30;
        const endX = peakX + (Math.random() * 16 - 8);
        const endY = 110;
        const size = 8 + Math.random() * 10;
        return {
          id: i,
          startX: `${startX}%`,
          startY: `${startY}%`,
          peakX: `${peakX}%`,
          endX: `${endX}%`,
          peakY: `${peakY}%`,
          endY: `${endY}%`,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: size,
          height: size * (0.5 + Math.random() * 0.7),
          duration: 1.4 + Math.random() * 1.0,
          spin: Math.random() * 720 - 360,
        };
      });
      setConfettiParticles(particles);

      // Cute Arabic TTS saying "بلومي!"
      try {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("بلومي");
          utterance.lang = "ar-SA";
          utterance.rate = 0.8;
          utterance.pitch = 1.6; // High child-like pitch

          const voices = window.speechSynthesis.getVoices();
          const arVoice = voices.find(v => v.lang.includes("ar"));
          if (arVoice) utterance.voice = arVoice;

          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn("Intro TTS failed:", err);
      }
    }, 3000);

    // 4. Make Sprout jump and play jump sound at 3300ms (lands at 3900ms)
    const jumpTimer = setTimeout(() => {
      setSproutJumping(true);
      introSfx.playJump();
    }, 3300);

    const jumpEndTimer = setTimeout(() => {
      setSproutJumping(false);
    }, 3900);

    // 5. Fade out and transition to Adventure Map at 5500ms
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 5500);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(startSmokeTimer);
      clearTimeout(startSmokeOff);
      clearTimeout(playWordTimer);
      clearTimeout(playSmokeOff);
      clearTimeout(playWordExitTimer);
      clearTimeout(learnWordTimer);
      clearTimeout(learnSmokeOff);
      clearTimeout(learnWordExitTimer);
      clearTimeout(sproutTimer);
      clearTimeout(jumpTimer);
      clearTimeout(jumpEndTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100vh",
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 bg-[#FFFFFF] z-[99999] overflow-hidden select-none flex items-center justify-center"
    >
      {/* SVG gooey liquid filter */}
      <svg className="hidden">
        <defs>
          <filter id="goo-fluid">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Global Camera Viewport Wrapper (Handles Pan/Zoom Parallax) */}
      <motion.div
        animate={{
          scale: [2.2, 2.2, 2.2, 1.4, 1.4, 1.0],
          x: ["0vw", "-22vw", "-22vw", "22vw", "22vw", "0vw"],
          y: ["-25vh", "-5vh", "-5vh", "15vh", "15vh", "5vh"]
        }}
        transition={{
          duration: 3.0,
          times: [0, 0.133, 0.4, 0.533, 0.8, 1.0],
          ease: "easeInOut"
        }}
        className="w-full h-full relative flex items-center justify-center origin-center"
      >
        {/* 1. Splashing Elements (appear when Sprout pops at 1.5s) */}
        {showSprout && splashParticles.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ left: p.startX, top: p.startY, scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              left: [p.startX, `calc(${p.startX} + ${p.endX})`],
              top: [p.startY, `calc(${p.startY} + ${p.endY})`],
              scale: [0, p.scale, 0],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360 * (idx % 2 === 0 ? 1 : -1)]
            }}
            transition={{
              duration: 1.4,
              delay: p.delay,
              ease: "easeOut"
            }}
            className="absolute text-4xl select-none pointer-events-none z-30"
          >
            {p.emoji}
          </motion.div>
        ))}

        {/* 2. Liquid Green Blob (Gooey Paint Droplet - Styled exactly like the custom canvas ball) */}
        <div style={{ filter: "url(#goo-fluid)" }} className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          {/* Main Blob */}
          <motion.div
            animate={{
              x: ["0vw", "22vw", "22vw", "-22vw", "-22vw", "0vw"],
              y: ["25vh", "5vh", "5vh", "-15vh", "-15vh", "-5vh"],
              scale: [1, 1.2, 1, 1.2, 1, 0],
              rotate: [0, 45, 0, -45, 0, 0],
            }}
            transition={{
              duration: 3.0,
              times: [0, 0.133, 0.4, 0.533, 0.8, 1.0],
              ease: "easeInOut"
            }}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #39FF14 0%, #009933 100%)",
            }}
            className="absolute"
          />

          {/* Stretchy Liquid Trail Droplet 1 */}
          <motion.div
            animate={{
              x: ["0vw", "20vw", "20vw", "-20vw", "-20vw", "0vw"],
              y: ["27vh", "7vh", "7vh", "-13vh", "-13vh", "-5vh"],
              scale: [0.8, 1.0, 0.8, 1.0, 0.8, 0],
            }}
            transition={{
              duration: 3.0,
              times: [0, 0.133, 0.4, 0.533, 0.8, 1.0],
              ease: "easeInOut"
            }}
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#00aa44",
            }}
            className="absolute rounded-full"
          />

          {/* Stretchy Liquid Trail Droplet 2 */}
          <motion.div
            animate={{
              x: ["0vw", "18vw", "18vw", "-18vw", "-18vw", "0vw"],
              y: ["29vh", "9vh", "9vh", "-11vh", "-11vh", "-5vh"],
              scale: [0.5, 0.8, 0.5, 0.8, 0.5, 0],
            }}
            transition={{
              duration: 3.0,
              times: [0, 0.133, 0.4, 0.533, 0.8, 1.0],
              ease: "easeInOut"
            }}
            style={{
              width: "4px",
              height: "4px",
              backgroundColor: "#00aa44",
            }}
            className="absolute rounded-full"
          />
        </div>


        {/* 2.5 Green Paint Splatters left on collision */}
        <AnimatePresence>
          {showStartSplatter && (
            <motion.div 
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute z-10 w-16 h-12 flex items-center justify-center pointer-events-none"
              style={{ left: "50%", top: "calc(50% + 25vh)", transform: "translate(-50%, -50%)" }}
            >
              <div className="w-5 h-5 bg-[#2ECC71]/70 rounded-full" />
              <div className="w-7 h-7 bg-[#2ECC71]/60 rounded-full -ml-3" />
              <div className="w-4 h-4 bg-[#2ECC71]/70 rounded-full -ml-2" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPlaySplatter && (
            <motion.div 
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute z-10 w-16 h-12 flex items-center justify-center pointer-events-none"
              style={{ left: "calc(50% + 22vw)", top: "calc(50% + 5vh)", transform: "translate(-50%, -50%)" }}
            >
              <div className="w-5 h-5 bg-[#2ECC71]/70 rounded-full" />
              <div className="w-7 h-7 bg-[#2ECC71]/60 rounded-full -ml-3" />
              <div className="w-4 h-4 bg-[#2ECC71]/70 rounded-full -ml-2" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLearnSplatter && (
            <motion.div 
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute z-10 w-16 h-12 flex items-center justify-center pointer-events-none"
              style={{ left: "calc(50% - 22vw)", top: "calc(50% - 15vh)", transform: "translate(-50%, -50%)" }}
            >
              <div className="w-5 h-5 bg-[#2ECC71]/70 rounded-full" />
              <div className="w-7 h-7 bg-[#2ECC71]/60 rounded-full -ml-3" />
              <div className="w-4 h-4 bg-[#2ECC71]/70 rounded-full -ml-2" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Word Cards (Redesigned to be modern, bubbly, and readable) */}
        {/* Right Word Card: "العب" */}
        <motion.div
          style={{
            position: "absolute",
            left: "calc(50% + 22vw)",
            top: "calc(50% + 5vh)",
            transform: "translate(-50%, -50%)",
            zIndex: 10
          }}
          variants={{
            hidden: { scale: 0, opacity: 0, y: 50 },
            visible: { 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            },
            exit: { 
              scale: 0.5, 
              opacity: 0,
              y: -50,
              transition: { duration: 0.4, ease: "easeIn" }
            }
          }}
          initial="hidden"
          animate={playCardState}
        >
          <div className="bg-white border-4 border-[#4D2B82] rounded-[36px] shadow-[0_8px_0_0_#4D2B82] px-6 py-2 sm:px-10 sm:py-4 transform -rotate-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A92] to-[#FF7A00] text-4xl sm:text-5xl md:text-7xl font-black tracking-wider">العب</span>
          </div>
        </motion.div>

        {/* Left Word Card: "تعلم" */}
        <motion.div
          style={{
            position: "absolute",
            left: "calc(50% - 22vw)",
            top: "calc(50% - 15vh)",
            transform: "translate(-50%, -50%)",
            zIndex: 10
          }}
          variants={{
            hidden: { scale: 0, opacity: 0, y: 50 },
            visible: { 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            },
            exit: { 
              scale: 0.5, 
              opacity: 0,
              y: -50,
              transition: { duration: 0.4, ease: "easeIn" }
            }
          }}
          initial="hidden"
          animate={learnCardState}
        >
          <div className="bg-white border-4 border-[#4D2B82] rounded-[36px] shadow-[0_8px_0_0_#4D2B82] px-6 py-2 sm:px-10 sm:py-4 transform rotate-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BC0F8] to-[#A855F7] text-4xl sm:text-5xl md:text-7xl font-black tracking-wider">تعلم</span>
          </div>
        </motion.div>

        {/* 4. Central Sprout Mascot Container (Reveals at 1.5s) */}
        <AnimatePresence>
          {showSprout && (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
              style={{ transform: "translateY(-5vh)" }}
            >
              {/* Bouncing/Jumping Sprout */}
              <motion.div
                initial={{ scale: 0, y: 150, opacity: 0 }}
                animate={{ 
                  scale: sproutJumping ? [1, 0.85, 1.15, 0.9, 1] : 1,
                  y: sproutJumping ? -75 : 0,
                  rotate: sproutJumping ? [0, -12, 12, 0] : 0,
                  opacity: 1
                }}
                transition={{
                  y: { duration: 0.55, ease: "easeOut" },
                  scale: { duration: 0.55 },
                  rotate: { duration: 0.55 }
                }}
                className="w-32 h-32 relative flex flex-col items-center justify-center mb-6 cursor-pointer pointer-events-auto"
              >
                {/* Head Leaves */}
                <div className="flex space-x-0.5 -mb-2 z-10">
                  <motion.div 
                    animate={{ rotate: sproutJumping ? [-15, 15] : [-5, 5] }}
                    transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
                    className="w-8 h-11 bg-[#81C784] rounded-tl-full rounded-br-full border-2.5 border-[#4D2B82] origin-bottom-right"
                  />
                  <motion.div 
                    animate={{ rotate: sproutJumping ? [15, -15] : [5, -5] }}
                    transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
                    className="w-8 h-11 bg-[#81C784] rounded-tr-full rounded-bl-full border-2.5 border-[#4D2B82] origin-bottom-left"
                  />
                </div>
                
                {/* Sprout Body (w-24 h-24 matches interactive garden scale) */}
                <div className="w-24 h-24 bg-[#2ECC71] rounded-full border-3.5 border-[#4D2B82] shadow-[inset_-5px_-5px_0_0_#27AE60] flex flex-col items-center justify-center relative">
                  {/* Cute Eyes */}
                  <div className="flex space-x-5 mt-2.5">
                    <div className="w-5 h-5 bg-[#4D2B82] rounded-full flex items-start justify-start p-1 relative">
                      <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1" />
                    </div>
                    <div className="w-5 h-5 bg-[#4D2B82] rounded-full flex items-start justify-start p-1 relative">
                      <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1" />
                    </div>
                  </div>
                  
                  {/* Pink Cheeks */}
                  <div className="flex justify-between w-[70px] -mt-1.5 px-1.5">
                    <div className="w-3.5 h-2 bg-[#FF6B6B] rounded-full opacity-60" />
                    <div className="w-3.5 h-2 bg-[#FF6B6B] rounded-full opacity-60" />
                  </div>

                  {/* Smiling Mouth (Open happy cartoon smile with a pink tongue) */}
                  <div className="w-7 h-4 bg-[#4D2B82] rounded-b-full relative overflow-hidden mt-1.5 flex items-end justify-center">
                    <div className="w-4 h-2.5 bg-[#FF6B6B] rounded-full translate-y-[1px]" />
                  </div>
                </div>

                {/* Tiny Hands */}
                <div className="absolute top-[55%] left-[2px] w-4 h-4 bg-[#2ECC71] rounded-full border-2.5 border-[#4D2B82] z-0" />
                <div className="absolute top-[55%] right-[2px] w-4 h-4 bg-[#2ECC71] rounded-full border-2.5 border-[#4D2B82] z-0" />
              </motion.div>

              {/* Bloomly Logo Text Card */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
                className="text-center"
              >
                <h1 className="text-5xl sm:text-6xl font-extrabold text-[#4D2B82] mb-1 font-sans tracking-wide filter drop-shadow-xs flex items-center justify-center gap-2">
                  بلومي <span className="text-[#2ECC71]">Kids</span>
                </h1>
                <p className="text-sm font-extrabold text-purple-400 bg-white border-2 border-[#4D2B82] px-5 py-1.5 rounded-full inline-block shadow-[0_3px_0_0_#4D2B82]">
                  تأسيس ذكي .. عقول تزهر 🌱
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 5. Confetti Blast overlay (stays absolute on the screen viewport, independent of camera movements) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {confettiParticles.map((c) => (
            <motion.div
              key={c.id}
              initial={{ left: c.startX, top: c.startY, rotate: 0, scale: 0 }}
              animate={{ 
                left: [c.startX, c.peakX, c.endX],
                top: [c.startY, c.peakY, c.endY],
                rotate: [0, c.spin / 2, c.spin],
                scale: [0, 1.2, 1, 0.8]
              }}
              transition={{ 
                duration: c.duration, 
                ease: "easeOut",
              }}
              className="absolute rounded-xs"
              style={{
                width: c.size,
                height: c.height,
                backgroundColor: c.color,
                boxShadow: "0 2px 3px rgba(0,0,0,0.15)",
                transformOrigin: "center"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
