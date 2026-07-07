import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ScreenOrientation as CapScreenOrientation } from '@capacitor/screen-orientation';
import QuranIsland from "./QuranIsland";
import InteractiveStories from "./InteractiveStories";

export function SproutMascot({ className = "w-24 h-24", state = "idle" }: { className?: string; state?: "idle" | "happy" | "sad" | "talking" }) {
  const bodyAnimation = state === "happy"
    ? { 
        y: [0, -25, 0], 
        scale: [1, 1.15, 0.95, 1],
        rotate: [0, 15, -15, 0] 
      }
    : state === "sad"
    ? { 
        y: [0, 2, 0],
        scale: [1, 0.92, 1],
        rotate: [0, -3, 3, 0]
      }
    : { 
        y: [0, -6, 0],
        scale: [1, 1.03, 1] 
      };

  return (
    <motion.div
      animate={bodyAnimation}
      transition={state === "happy" 
        ? { duration: 0.6, repeat: 2, ease: "easeInOut" } 
        : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      className={`relative select-none flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]">
        {/* Star Body with golden gradient */}
        <path 
          d="M 50 10 Q 52 22 62 28 Q 72 34 85 36 Q 74 46 72 56 Q 70 66 78 76 Q 66 72 56 70 Q 46 68 34 76 Q 32 66 30 56 Q 28 46 17 36 Q 30 34 40 28 Q 48 22 50 10 Z" 
          fill="url(#starMascotGrad)" 
          stroke="#4D2B82" 
          strokeWidth="3.5" 
          strokeLinejoin="round"
        />

        {/* Eyes (Blinking Animation) */}
        <g style={{ transformOrigin: "50% 48%" }}>
          {state === "sad" ? (
            <>
              {/* Sad/crying eyes */}
              <path d="M 33 50 Q 38 46 43 51" fill="none" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
              <path d="M 67 50 Q 62 46 57 51" fill="none" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <motion.ellipse 
                cx="38" 
                cy="48" 
                rx="6" 
                ry="8" 
                fill="#2C3E50"
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 4.5, times: [0, 0.94, 0.96, 0.98, 1] }}
                style={{ transformOrigin: "38px 48px" }}
              />
              <circle cx="36" cy="45" r="2.2" fill="#FFF" />
              <circle cx="39" cy="50" r="1" fill="#FFF" />

              {/* Right Eye */}
              <motion.ellipse 
                cx="62" 
                cy="48" 
                rx="6" 
                ry="8" 
                fill="#2C3E50"
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 4.5, times: [0, 0.94, 0.96, 0.98, 1] }}
                style={{ transformOrigin: "62px 48px" }}
              />
              <circle cx="60" cy="45" r="2.2" fill="#FFF" />
              <circle cx="63" cy="50" r="1" fill="#FFF" />
            </>
          )}
        </g>

        {/* Blush Cheeks */}
        <circle cx="28" cy="56" r="5" fill="#FF5A92" opacity="0.5" />
        <circle cx="72" cy="56" r="5" fill="#FF5A92" opacity="0.5" />

        {/* Interactive Mouth (Talking Animation) */}
        {state === "talking" ? (
          <motion.ellipse 
            cx="50" 
            cy="58" 
            rx="4" 
            ry="6" 
            fill="#2C3E50"
            animate={{ scaleY: [1, 0.4, 1.4, 0.5, 1.2, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            style={{ transformOrigin: "50px 58px" }}
          />
        ) : state === "sad" ? (
          <path d="M 45 61 Q 50 56 55 61" fill="none" stroke="#2C3E50" strokeWidth="3.5" strokeLinecap="round" />
        ) : (
          <path d="M 43 56 Q 50 64 57 56" fill="none" stroke="#2C3E50" strokeWidth="3.5" strokeLinecap="round" />
        )}

        {/* Gradients */}
        <defs>
          <linearGradient id="starMascotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE57F" />
            <stop offset="60%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#FF8F00" />
          </linearGradient>
        </defs>
      </svg>

      {/* Sparkles overlay on happy state */}
      {state === "happy" && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.6, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="absolute -top-3 text-2xl pointer-events-none select-none"
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  );
}

// --- Browser Sound Synthesizer (Zero Dependencies) ---
class SoundEffects {
  private ctx: AudioContext | null = null;

  constructor() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("AudioContext constructor failed:", e);
    }
  }

  private init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(err => console.warn("Failed to resume AudioContext:", err));
      }
    } catch (e) {
      console.warn("AudioContext init failed:", e);
      this.ctx = null;
    }
  }

  resumeAudioContext() {
    try {
      this.init();
    } catch (e) {
      console.warn("resumeAudioContext failed:", e);
    }
  }

  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08);
      gain.gain.setValueAtTime(0.4, now); // was 0.15
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn(e);
    }
  }

  playBalloonPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      
      noiseGain.gain.setValueAtTime(0.4, now); // was 0.2
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
      
      gain.gain.setValueAtTime(0.5, now); // was 0.3
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      
      osc.start(now);
      osc.stop(now + 0.08);
      noise.start(now);
      noise.stop(now + 0.05);
    } catch (e) {
      console.warn(e);
    }
  }

  playSynthesizedSafari(soundId: string) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (soundId === "cat") {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = "triangle";
        
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.4);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (soundId === "dog") {
        const playBark = (time: number) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.type = "triangle";
          
          osc.frequency.setValueAtTime(220, time);
          osc.frequency.exponentialRampToValueAtTime(100, time + 0.12);
          
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.3, time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
          
          osc.start(time);
          osc.stop(time + 0.12);
        };
        playBark(now);
        playBark(now + 0.18);
      } else if (soundId === "bell") {
        const freqs = [1200, 1500, 2000];
        freqs.forEach((freq, index) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.type = "sine";
          
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.12 / (index + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          
          osc.start(now);
          osc.stop(now + 0.8);
        });
      } else if (soundId === "monkey") {
        const playChirp = (time: number) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          const filter = this.ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1500, time);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(800, time);
          osc.frequency.exponentialRampToValueAtTime(2000, time + 0.08);
          
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
          
          osc.start(time);
          osc.stop(time + 0.08);
        };
        playChirp(now);
        playChirp(now + 0.12);
        playChirp(now + 0.24);
      } else if (soundId === "duck") {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(280, now + 0.2);
        
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(2.5, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn("playSynthesizedSafari error:", e);
    }
  }

  playSafariSound(soundId: string) {
    try {
      this.init();
      if (!this.ctx) return;

      if (soundId === "train") {
        const playToot = (startTime: number) => {
          if (!this.ctx) return;
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gainNode = this.ctx.createGain();

          osc1.frequency.setValueAtTime(587.33, startTime); // D5
          osc2.frequency.setValueAtTime(698.46, startTime); // F5

          osc1.type = "triangle";
          osc2.type = "sine";

          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
          gainNode.gain.setValueAtTime(0.3, startTime + 0.22);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.27);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(this.ctx.destination);

          osc1.start(startTime);
          osc1.stop(startTime + 0.27);
          osc2.start(startTime);
          osc2.stop(startTime + 0.27);
        };

        const now = this.ctx.currentTime;
        playToot(now);
        playToot(now + 0.35);
        return;
      }

      let url = "";
      if (soundId === "cat") {
        url = "https://commons.wikimedia.org/wiki/Special:FilePath/Cat_meow.ogg";
      } else if (soundId === "dog") {
        url = "https://commons.wikimedia.org/wiki/Special:FilePath/Golden_Retriever_bark.ogg";
      } else if (soundId === "bell") {
        url = "https://commons.wikimedia.org/wiki/Special:FilePath/Table_bell.ogg";
      } else if (soundId === "monkey") {
        url = "https://commons.wikimedia.org/wiki/Special:FilePath/Howler_Monkey_screams.ogg";
      } else if (soundId === "duck") {
        url = "https://commons.wikimedia.org/wiki/Special:FilePath/Quacking.ogg";
      }

      if (url) {
        const audio = new Audio(url);
        audio.volume = 0.65;
        audio.play().catch(err => {
          console.warn("Audio playback failed, falling back to synthesized safari sound:", err);
          this.playSynthesizedSafari(soundId);
        });

        // Force stop/fade out after 1.5 seconds maximum duration
        setTimeout(() => {
          let vol = audio.volume;
          const fadeInterval = setInterval(() => {
            if (vol > 0.05) {
              vol -= 0.05;
              audio.volume = Math.max(0, vol);
            } else {
              clearInterval(fadeInterval);
              audio.pause();
              audio.currentTime = 0;
            }
          }, 40);
        }, 1200);
      }
    } catch (e) {
      console.warn("playSafariSound error:", e);
    }
  }

  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Note 1 (C5)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.3, now); // was 0.12
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Note 2 (E5) after 80ms
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, now + 0.08);
      gain2.gain.setValueAtTime(0.3, now + 0.08); // was 0.12
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.33);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.33);

      // Note 3 (G5) after 160ms
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(783.99, now + 0.16);
      gain3.gain.setValueAtTime(0.3, now + 0.16); // was 0.12
      gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.41);
      osc3.start(now + 0.16);
      osc3.stop(now + 0.41);
    } catch (e) {
      console.warn(e);
    }
  }

  playWrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "triangle";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.4, now); // was 0.2
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn(e);
    }
  }

  playVictory() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Fanfare Chord Progression:
      const chords = [
        { time: 0, notes: [261.63, 329.63, 392.00, 523.25], duration: 0.22 }, // C4 triad
        { time: 0.25, notes: [349.23, 440.00, 523.25, 698.46], duration: 0.22 }, // F4 triad
        { time: 0.50, notes: [392.00, 493.88, 587.33, 783.99], duration: 0.22 }, // G4 triad
        { time: 0.75, notes: [523.25, 659.25, 783.99, 1046.50], duration: 1.2 } // C5 triad resolution
      ];

      chords.forEach(chord => {
        chord.notes.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx!.destination);
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + chord.time);
          
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(400, now + chord.time);
          filter.frequency.exponentialRampToValueAtTime(2000, now + chord.time + 0.1);
          
          gain.gain.setValueAtTime(0, now + chord.time);
          gain.gain.linearRampToValueAtTime(0.25, now + chord.time + 0.04); // was 0.08
          gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + chord.duration);
          
          osc.start(now + chord.time);
          osc.stop(now + chord.time + chord.duration);
        });
      });

      // 2. Magical rising chime arpeggio sweep
      const chimeNotes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51];
      chimeNotes.forEach((freq, i) => {
        const startTime = now + 0.85 + (i * 0.05);
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.18, startTime); // was 0.05
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });

      // 3. Synthesized Crowd Cheering & Applause Sound:
      const bufferSize = this.ctx.sampleRate * 2.2; 
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1100, now);
      noiseFilter.Q.setValueAtTime(1.2, now);
      
      const noiseGain = this.ctx.createGain();
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.4); // was 0.05
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      
      noise.start(now);
      noise.stop(now + 2.2);

      // 4. Voice "woohoo" chirps
      const kidsCheerTimes = [0.15, 0.3, 0.45, 0.6];
      kidsCheerTimes.forEach((startTime) => {
        const startFreq = 450 + Math.random() * 100;
        const endFreq = startFreq + 250 + Math.random() * 100;
        
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(startFreq, now + startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + startTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(startFreq - 100, now + startTime + 0.3);
        
        gain.gain.setValueAtTime(0, now + startTime);
        gain.gain.linearRampToValueAtTime(0.12, now + startTime + 0.05); // was 0.03
        gain.gain.exponentialRampToValueAtTime(0.001, now + startTime + 0.3);
        
        osc.start(now + startTime);
        osc.stop(now + startTime + 0.3);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  playEngineRev() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn(e);
    }
  }

  playTireScreech() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn(e);
    }
  }

  speakArabic(text: string, voiceType?: "welcome" | "correct" | "wrong") {
    try {
      if (voiceType) {
        const savedVoice = localStorage.getItem(`parent_voice_${voiceType}`);
        if (savedVoice) {
          const audio = new Audio(savedVoice);
          audio.volume = 0.9;
          audio.play().catch(e => console.warn("Parent voice playback failed, falling back:", e));
          return;
        }
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ar-EG";
        utterance.rate = 0.92; // kid-friendly rate
        utterance.pitch = 1.35; // cute, animated pitch
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("speakArabic error:", e);
    }
  }

  private bgAudio: HTMLAudioElement | null = null;
  private isBgMusicPlaying = false;

  playBackgroundMusic() {
    try {
      if (this.isBgMusicPlaying) return;
      this.isBgMusicPlaying = true;

      if (!this.bgAudio) {
        // Stream high-quality nursery rhyme instrumental loop from Wikimedia Commons
        this.bgAudio = new Audio("https://upload.wikimedia.org/wikipedia/commons/f/fb/Alphabet_song.ogg");
        this.bgAudio.loop = true;
        this.bgAudio.volume = 0.18; // soft background volume
      }

      this.bgAudio.play().catch(err => {
        console.warn("Background music autoplay failed:", err);
      });
    } catch (e) {
      console.warn("playBackgroundMusic error:", e);
    }
  }

  stopBackgroundMusic() {
    this.isBgMusicPlaying = false;
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
  }
}

const sfx = new SoundEffects();

// --- Confetti Types ---
interface ConfettiParticle {
  id: number;
  startX: string;
  startY: string;
  peakX: string;
  endX: string;
  peakY: string;
  endY: string;
  color: string;
  size: number;
  height: number;
  duration: number;
  delay: number;
  spin: number;
}

// --- Catch Game Item Types ---
interface CatchItem {
  id: number;
  x: number;
  y: number;
  type: "star" | "balloon" | "cloud";
  color: string;
  emoji: string;
  speed: number;
  duration?: number;
}

interface FloatingScore {
  id: number;
  x: number;
  y: number;
  text: string;
}

// Queue-based flood fill algorithm for coloring book shapes
const floodFill = (
  canvas: HTMLCanvasElement,
  startX: number,
  startY: number,
  fillColorHex: string
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Convert fill color hex to RGBA
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 1;
  tempCanvas.height = 1;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;
  tempCtx.fillStyle = fillColorHex;
  tempCtx.fillRect(0, 0, 1, 1);
  const fillPixel = tempCtx.getImageData(0, 0, 1, 1).data;
  const fillR = fillPixel[0];
  const fillG = fillPixel[1];
  const fillB = fillPixel[2];
  const fillA = fillPixel[3];

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Get target color
  const targetIdx = (startY * width + startX) * 4;
  const targetR = data[targetIdx];
  const targetG = data[targetIdx + 1];
  const targetB = data[targetIdx + 2];
  const targetA = data[targetIdx + 3];

  // If target color is same as fill color, do nothing
  if (
    Math.abs(targetR - fillR) < 5 &&
    Math.abs(targetG - fillG) < 5 &&
    Math.abs(targetB - fillB) < 5 &&
    Math.abs(targetA - fillA) < 5
  ) {
    return;
  }

  // We want to avoid filling the purple border line (RGB 77, 43, 130)
  const isMatch = (idx: number) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    // If it's close to the outline border (#4D2B82 / RGB 77, 43, 130), it's not a match (boundary)
    if (Math.abs(r - 77) < 35 && Math.abs(g - 43) < 35 && Math.abs(b - 130) < 35) {
      return false;
    }
    
    // Also if it's a dark color (e.g. anti-aliased border pixels), don't fill over it
    if (r < 110 && g < 80 && b < 150) {
      return false;
    }

    return (
      Math.abs(r - targetR) < 40 &&
      Math.abs(g - targetG) < 40 &&
      Math.abs(b - targetB) < 40 &&
      Math.abs(a - targetA) < 40
    );
  };

  const queue: number[] = [startX, startY];
  let head = 0;
  const visited = new Uint8Array(width * height);

  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

    const vIdx = cy * width + cx;
    if (visited[vIdx]) continue;
    visited[vIdx] = 1;

    const idx = vIdx * 4;
    if (isMatch(idx)) {
      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
      data[idx + 3] = fillA;

      if (cx + 1 < width) queue.push(cx + 1, cy);
      if (cx - 1 >= 0) queue.push(cx - 1, cy);
      if (cy + 1 < height) queue.push(cx, cy + 1);
      if (cy - 1 >= 0) queue.push(cx, cy - 1);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

// Image processing function to turn full color emojis into outlines
const convertToOutline = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  const outputImageData = ctx.createImageData(width, height);
  const outData = outputImageData.data;

  // Set background of output image data to solid white
  for (let i = 0; i < outData.length; i += 4) {
    outData[i] = 255;
    outData[i + 1] = 255;
    outData[i + 2] = 255;
    outData[i + 3] = 255;
  }

  // Check if pixel is white or transparent
  const isWhite = (idx: number) => {
    const a = data[idx + 3];
    if (a < 10) return true; // transparent is white
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return r > 245 && g > 245 && b > 245;
  };

  // Border detection & edge extraction filter
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      if (isWhite(idx)) {
        continue;
      }

      // Check 4 neighbors
      let isEdge = false;
      const neighborOffsets = [
        ((y - 1) * width + x) * 4, // Top
        ((y + 1) * width + x) * 4, // Bottom
        (y * width + (x - 1)) * 4, // Left
        (y * width + (x + 1)) * 4, // Right
      ];

      for (const nIdx of neighborOffsets) {
        if (isWhite(nIdx)) {
          isEdge = true;
          break;
        }

        // Color difference for internal outlines (e.g. leaf outline vs fruit body)
        const dist = Math.abs(data[idx] - data[nIdx]) + 
                     Math.abs(data[idx + 1] - data[nIdx + 1]) + 
                     Math.abs(data[idx + 2] - data[nIdx + 2]);
        if (dist > 120) {
          isEdge = true;
          break;
        }
      }

      if (isEdge) {
        // Paint edge pixel in purple theme "#4D2B82" (RGB 77, 43, 130)
        outData[idx] = 77;
        outData[idx + 1] = 43;
        outData[idx + 2] = 130;
        outData[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(outputImageData, 0, 0);
};

interface GameZoneProps {
  onNeedRegister?: () => void;
  globalStars?: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
  childLevel?: "level1" | "level2" | "level3" | "level4" | null;
  forcedGame?: string | null;
  setForcedGame?: React.Dispatch<React.SetStateAction<string | null>>;
}

export function GameZone({ onNeedRegister, globalStars = 0, setGlobalStars, childLevel: propChildLevel = "level1", forcedGame, setForcedGame }: GameZoneProps = {}) {
  const [activeGame, setActiveGame] = useState<"menu" | "math" | "spelling" | "memory" | "catcher" | "coloring" | "spellingEn" | "sorting" | "spaceCatcher" | "connectDots" | "maze" | "safari" | "chef" | "farm" | "train" | "arrowRacer" | "tapRacer" | "quran" | "stories">("menu");
  const gameZoneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (forcedGame && setForcedGame) {
      setActiveGame(forcedGame as any);
      setShowLevelMap(forcedGame !== "quran" && forcedGame !== "stories");
      setForcedGame(null);
      if (gameZoneRef.current) {
        gameZoneRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [forcedGame, setForcedGame]);
  const mapScrollRef = useRef<HTMLDivElement>(null);
  
  // Game Level Map & Loading States
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingGameName, setLoadingGameName] = useState("");
  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number | null>(null);
  const [showPortraitPrompt, setShowPortraitPrompt] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState<"level1" | "level2" | "level3" | "level4">("level1");

  const [effectiveLevel, setEffectiveLevel] = useState<"level1" | "level2" | "level3" | "level4">("level1");
  
  // Find current active level (first level with 0 stars)
  const getActiveLevelNumber = () => {
    for (let l = 1; l <= 100; l++) {
      const starKey = `bloomly_stars_${activeGame}_level_${l}`;
      const stars = parseInt(localStorage.getItem(starKey) || "0", 10);
      if (stars === 0) {
        return l;
      }
    }
    return 100;
  };

  useEffect(() => {
    if (showLevelMap) {
      setTimeout(() => {
        const activeLvl = getActiveLevelNumber();
        const element = document.getElementById(`level-node-${activeLvl}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        } else {
          // Centering calculation fallback
          const targetX = (activeLvl - 1) * 180 - window.innerWidth / 2 + 100;
          if (mapScrollRef.current) {
            mapScrollRef.current.scrollLeft = Math.max(0, targetX);
          }
        }
      }, 200);
    }
  }, [showLevelMap, activeGame]);

  useEffect(() => {
    if (propChildLevel) {
      setEffectiveLevel(propChildLevel as any);
    }
  }, [propChildLevel]);

  const childLevel = showLevelMap ? activeDifficulty : effectiveLevel;

  const lockOrientationLandscape = async () => {
    try {
      await CapScreenOrientation.lock({ orientation: 'landscape' });
    } catch (e) {
      console.warn("Capacitor Screen Orientation lock failed, attempting web standard:", e);
      try {
        const anyOrientation = screen.orientation as any;
        if (anyOrientation && anyOrientation.lock) {
          await anyOrientation.lock('landscape');
        }
      } catch (err) {
        console.warn("Web Screen Orientation lock failed:", err);
      }
    }
  };

  const unlockOrientation = async () => {
    try {
      await CapScreenOrientation.unlock();
    } catch (e) {
      console.warn("Capacitor Screen Orientation unlock failed, attempting web standard:", e);
      try {
        const anyOrientation = screen.orientation as any;
        if (anyOrientation && anyOrientation.unlock) {
          anyOrientation.unlock();
        }
      } catch (err) {
        console.warn("Web Screen Orientation unlock failed:", err);
      }
    }
  };

  useEffect(() => {
    if (activeGame === "menu") {
      setShowPortraitPrompt(false);
      unlockOrientation();
      return;
    }

    lockOrientationLandscape();

    const checkOrientation = () => {
      if (window.innerHeight > window.innerWidth) {
        setShowPortraitPrompt(true);
      } else {
        setShowPortraitPrompt(false);
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    
    return () => {
      window.removeEventListener("resize", checkOrientation);
      unlockOrientation();
    };
  }, [activeGame]);

  useEffect(() => {
    if (activeGame !== "menu" && gameZoneRef.current) {
      setTimeout(() => {
        gameZoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeGame]);

  const startLoadingAndOpenMap = (gameName: typeof activeGame) => {
    setLoadingGameName(gameName);
    setLoadingProgress(0);
    setIsLoadingGame(true);
    
    // Play a friendly intro voice-over
    if (gameName === "quran") {
      sfx.speakArabic("استعد يا بطل! سنقوم الآن بفتح جزيرة القرآن الكريم!", "welcome");
    } else if (gameName === "stories") {
      sfx.speakArabic("استعد يا بطل! سنقوم الآن بفتح جزيرة القصص التفاعلية!", "welcome");
    } else {
      sfx.speakArabic("استعد يا بطل! سنقوم الآن بفتح خريطة المغامرة السحرية!", "welcome");
    }
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoadingGame(false);
          setActiveGame(gameName);
          setShowLevelMap(gameName !== "quran" && gameName !== "stories");
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const [starsEarnedThisSession, setStarsEarnedThisSession] = useState(0);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  
  // Music & Volume States
  const [isMusicMuted, setIsMusicMuted] = useState(() => {
    return localStorage.getItem("isMusicMuted") !== "false"; // Default to muted (true) on first launch
  });

  useEffect(() => {
    if (activeGame !== "menu" && !isMusicMuted) {
      sfx.playBackgroundMusic();
    } else {
      sfx.stopBackgroundMusic();
    }
    return () => {
      sfx.stopBackgroundMusic();
    };
  }, [activeGame, isMusicMuted]);

  // Celebration & Flying Stars States
  const [flyingStars, setFlyingStars] = useState<{ id: number; startX: number; startY: number; endX: number; endY: number }[]>([]);
  const [isStarCounterBouncing, setIsStarCounterBouncing] = useState(false);
  const [victoryBalloons, setVictoryBalloons] = useState<{ id: number; type: "balloon" | "star" | "heart" | "bubble" | "paper"; x: number; color: string; speed: number; delay: number; label: string }[]>([]);

  // Helper: check if child is registered before launching a game
  const requireProfile = (launchFn: () => void) => {
    const saved = localStorage.getItem("childProfile");
    if (!saved) {
      onNeedRegister?.();
      return;
    }
    launchFn();
  };

  // Global handler to unlock AudioContext on first user interaction (capture phase)
  useEffect(() => {
    const resumeAudio = () => {
      sfx.resumeAudioContext();
    };
    window.addEventListener("click", resumeAudio, true);
    window.addEventListener("touchstart", resumeAudio, true);
    return () => {
      window.removeEventListener("click", resumeAudio, true);
      window.removeEventListener("touchstart", resumeAudio, true);
    };
  }, []);

  // ==========================================
  // NEW GAME: TURBO ARROW RACER (سباق الاتجاهات الخارق)
  // ==========================================
  const [racerRound, setRacerRound] = useState(1);
  const [racerSequence, setRacerSequence] = useState<("up" | "down" | "left" | "right")[]>([]);
  const [racerInputIndex, setRacerInputIndex] = useState(0);
  const [racerSpeed, setRacerSpeed] = useState(80); // Default start speed is 80 km/h so it's always moving!
  const [racerFeedback, setRacerFeedback] = useState<"idle" | "correct" | "wrong" | "drift">("idle");
  const [racerObstacle, setRacerObstacle] = useState<string>("🚧");
  const [racerScore, setRacerScore] = useState(0);
  const [racerLane, setRacerLane] = useState(0);
  const [racerYOffset, setRacerYOffset] = useState(0);
  const [racerTimeLeft, setRacerTimeLeft] = useState(30);
  const [racerActive, setRacerActive] = useState(false);


  // ==========================================
  // NEW GAME 1: MAGIC SORTING BASKET (تصنيف بلومي السحري)
  // ==========================================
  const sortingBank = [
    // Animals
    { emoji: "🦁", type: "animal", name: "أسد" },
    { emoji: "🦒", type: "animal", name: "زرافة" },
    { emoji: "🐘", type: "animal", name: "فيل" },
    { emoji: "🐒", type: "animal", name: "قرد" },
    { emoji: "🐰", type: "animal", name: "أرنب" },
    { emoji: "🐧", type: "animal", name: "بطريق" },
    { emoji: "🐢", type: "animal", name: "سلحفاة" },
    { emoji: "🦉", type: "animal", name: "بومة" },
    { emoji: "🦊", type: "animal", name: "ثعلب" },
    { emoji: "🐬", type: "animal", name: "دولفين" },
    // Letters
    { emoji: "أ", type: "letter", name: "أ" },
    { emoji: "ب", type: "letter", name: "ب" },
    { emoji: "ت", type: "letter", name: "ت" },
    { emoji: "ج", type: "letter", name: "ج" },
    { emoji: "ح", type: "letter", name: "ح" },
    { emoji: "خ", type: "letter", name: "خ" },
    { emoji: "د", type: "letter", name: "د" },
    { emoji: "ر", type: "letter", name: "ر" },
    { emoji: "س", type: "letter", name: "س" },
    { emoji: "م", type: "letter", name: "م" },
    // Numbers
    { emoji: "١", type: "number", name: "١" },
    { emoji: "٢", type: "number", name: "٢" },
    { emoji: "٣", type: "number", name: "٣" },
    { emoji: "٤", type: "number", name: "٤" },
    { emoji: "٥", type: "number", name: "٥" },
    { emoji: "٦", type: "number", name: "٦" },
    { emoji: "٧", type: "number", name: "٧" },
    { emoji: "٨", type: "number", name: "٨" },
    { emoji: "٩", type: "number", name: "٩" },
    { emoji: "١٠", type: "number", name: "١٠" }
  ];

  const [sortingRound, setSortingRound] = useState(1);
  const [sortingItem, setSortingItem] = useState<{ emoji: string; type: string; name: string } | null>(null);
  const [sortingFeedback, setSortingFeedback] = useState<"correct" | "wrong" | "idle">("idle");
  const [sortingSelectedBasket, setSortingSelectedBasket] = useState<string | null>(null);

  const startSortingGame = () => {
    setSortingRound(1);
    setStarsEarnedThisSession(0);
    setSortingFeedback("idle");
    setSortingSelectedBasket(null);
    setActiveGame("sorting");
    generateSortingItem();
  };

  const generateSortingItem = () => {
    setSortingFeedback("idle");
    setSortingSelectedBasket(null);
    const randomIndex = Math.floor(Math.random() * sortingBank.length);
    setSortingItem(sortingBank[randomIndex]);
  };

  const handleSortingAnswer = (basketType: string) => {
    if (sortingFeedback !== "idle" || !sortingItem) return;
    setSortingSelectedBasket(basketType);
    if (sortingItem.type === basketType) {
      setSortingFeedback("correct");
      sfx.playSuccess();
      addStars(1);
      setTimeout(() => {
        if (sortingRound < 5) {
          setSortingRound((prev) => prev + 1);
          generateSortingItem();
        } else {
          triggerVictory();
        }
      }, 1500);
    } else {
      setSortingFeedback("wrong");
      sfx.playWrong();
      setTimeout(() => {
        if (sortingRound < 5) {
          setSortingRound((prev) => prev + 1);
          generateSortingItem();
        } else {
          triggerVictory();
        }
      }, 1500);
    }
  };

  // ==========================================
  // NEW GAME 8: SPACE LETTER CATCHER (صائد الحروف الفضائي)
  // ==========================================
  const arabicLetters = ["أ", "ب", "ت", "ج", "ح", "خ", "د", "ر", "س", "ش", "ص", "ط", "ع", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];
  const englishLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  const simpleNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"];

  interface SpaceMeteor {
    id: number;
    x: number;
    value: string;
    speed: number;
    delay: number;
    color: string;
  }

  const [spaceRound, setSpaceRound] = useState(1);
  const [spaceTarget, setSpaceTarget] = useState<string>("");
  const [spaceTargetType, setSpaceTargetType] = useState<"letter" | "number" | "letterEn">("letter");
  const [spaceMeteors, setSpaceMeteors] = useState<SpaceMeteor[]>([]);
  const [spaceFeedback, setSpaceFeedback] = useState<"correct" | "wrong" | "idle">("idle");
  const [spaceExplodedId, setSpaceExplodedId] = useState<number | null>(null);

  const startSpaceCatcherGame = () => {
    setSpaceRound(1);
    setStarsEarnedThisSession(0);
    setSpaceFeedback("idle");
    setSpaceExplodedId(null);
    setActiveGame("spaceCatcher");
    generateSpaceCatcherRound();
  };

  const generateSpaceCatcherRound = () => {
    setSpaceFeedback("idle");
    setSpaceExplodedId(null);
    
    // Pick random category
    const categories: ("letter" | "number" | "letterEn")[] = ["letter", "number", "letterEn"];
    const chosenType = categories[Math.floor(Math.random() * categories.length)];
    setSpaceTargetType(chosenType);

    // Determine target list & value
    let list: string[] = [];
    if (chosenType === "letter") list = arabicLetters;
    else if (chosenType === "letterEn") list = englishLetters;
    else list = simpleNumbers;

    const targetValue = list[Math.floor(Math.random() * list.length)];
    setSpaceTarget(targetValue);

    // Generate 5 meteors (1 correct, 4 wrong of same category)
    const wrongValues = list.filter((v) => v !== targetValue);
    const shuffledWrong = [...wrongValues].sort(() => Math.random() - 0.5);
    const roundValues = [targetValue, ...shuffledWrong.slice(0, 4)];
    const shuffledRoundValues = [...roundValues].sort(() => Math.random() - 0.5);

    const colors = ["#FF5A92", "#5BC0F8", "#2ECC71", "#FFD700", "#A855F7", "#FF9F29"];
    
    const newMeteors = shuffledRoundValues.map((val, idx) => {
      return {
        id: Date.now() + idx,
        x: 10 + idx * 17 + Math.random() * 5,
        value: val,
        speed: 3 + Math.random() * 4.5,
        delay: Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
    setSpaceMeteors(newMeteors);
  };

  const handleMeteorClick = (meteorId: number, value: string) => {
    if (spaceFeedback !== "idle") return;
    
    if (value === spaceTarget) {
      setSpaceFeedback("correct");
      setSpaceExplodedId(meteorId);
      sfx.playSuccess();
      addStars(2); // generous for space
      
      setTimeout(() => {
        setSpaceMeteors((prev) => prev.filter((m) => m.id !== meteorId));
      }, 400);

      setTimeout(() => {
        if (spaceRound < 5) {
          setSpaceRound((prev) => prev + 1);
          generateSpaceCatcherRound();
        } else {
          triggerVictory();
        }
      }, 1500);
    } else {
      setSpaceExplodedId(meteorId);
      sfx.playWrong();
      setSpaceFeedback("wrong");
      
      setTimeout(() => {
        setSpaceMeteors((prev) => prev.filter((m) => m.id !== meteorId));
      }, 400);

      setTimeout(() => {
        if (spaceRound < 5) {
          setSpaceRound((prev) => prev + 1);
          generateSpaceCatcherRound();
        } else {
          triggerVictory();
        }
      }, 1500);
    }
  };

  // ==========================================
  // NEW GAME 3: CONNECT THE DOTS (توصيل الأرقام السحرية)
  // ==========================================
  interface DotPoint {
    num: number;
    x: number;
    y: number;
  }

  interface ConnectShape {
    id: string;
    name: string;
    emoji: string;
    color: string;
    points: DotPoint[];
  }

  const connectShapesBank: ConnectShape[] = [
    {
      id: "star",
      name: "نجمة سحرية",
      emoji: "⭐",
      color: "#FFD700",
      points: [
        { num: 1, x: 200, y: 50 },
        { num: 2, x: 310, y: 280 },
        { num: 3, x: 90, y: 130 },
        { num: 4, x: 310, y: 130 },
        { num: 5, x: 90, y: 280 }
      ]
    },
    {
      id: "heart",
      name: "قلب طيب",
      emoji: "❤️",
      color: "#FF5A92",
      points: [
        { num: 1, x: 200, y: 110 },
        { num: 2, x: 270, y: 50 },
        { num: 3, x: 340, y: 120 },
        { num: 4, x: 200, y: 270 },
        { num: 5, x: 60, y: 120 },
        { num: 6, x: 130, y: 50 }
      ]
    },
    {
      id: "house",
      name: "منزل صغير",
      emoji: "🏠",
      color: "#FF9F29",
      points: [
        { num: 1, x: 200, y: 50 },
        { num: 2, x: 300, y: 130 },
        { num: 3, x: 300, y: 270 },
        { num: 4, x: 100, y: 270 },
        { num: 5, x: 100, y: 130 }
      ]
    },
    {
      id: "diamond",
      name: "جوهرة ثمينة",
      emoji: "💎",
      color: "#5BC0F8",
      points: [
        { num: 1, x: 140, y: 60 },
        { num: 2, x: 260, y: 60 },
        { num: 3, x: 330, y: 130 },
        { num: 4, x: 200, y: 270 },
        { num: 5, x: 70, y: 130 }
      ]
    },
    {
      id: "crown",
      name: "تاج الملوك",
      emoji: "👑",
      color: "#A855F7",
      points: [
        { num: 1, x: 80, y: 250 },
        { num: 2, x: 80, y: 130 },
        { num: 3, x: 140, y: 180 },
        { num: 4, x: 200, y: 100 },
        { num: 5, x: 260, y: 180 },
        { num: 6, x: 320, y: 130 },
        { num: 7, x: 320, y: 250 }
      ]
    }
  ];

  const [dotsRound, setDotsRound] = useState(1);
  const [dotsShape, setDotsShape] = useState<ConnectShape | null>(null);
  const [dotsNextNum, setDotsNextNum] = useState(1);
  const [dotsLines, setDotsLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [dotsFeedback, setDotsFeedback] = useState<"correct" | "wrong" | "idle">("idle");
  const [dotsRevealed, setDotsRevealed] = useState(false);

  const startConnectDotsGame = () => {
    setDotsRound(1);
    setStarsEarnedThisSession(0);
    setDotsFeedback("idle");
    setDotsRevealed(false);
    setActiveGame("connectDots");
    generateConnectDotsRound(1);
  };

  const generateConnectDotsRound = (roundNum: number = 1) => {
    setDotsFeedback("idle");
    setDotsRevealed(false);
    setDotsLines([]);
    setDotsNextNum(1);
    const shape = connectShapesBank[(roundNum - 1) % connectShapesBank.length];
    setDotsShape(shape);
  };

  const handleDotClick = (point: DotPoint) => {
    if (dotsFeedback !== "idle" || dotsRevealed || !dotsShape) return;

    if (point.num === dotsNextNum) {
      sfx.playPop(); // Pop note sound

      // Add line to connect dots if not the first dot
      if (dotsNextNum > 1) {
        const prevPoint = dotsShape.points.find((p) => p.num === dotsNextNum - 1);
        if (prevPoint) {
          setDotsLines((prev) => [
            ...prev,
            { x1: prevPoint.x, y1: prevPoint.y, x2: point.x, y2: point.y }
          ]);
        }
      }

      // Check if this was the last dot
      if (dotsNextNum === dotsShape.points.length) {
        // Connect last dot to the first dot to close shape
        const firstPoint = dotsShape.points.find((p) => p.num === 1);
        if (firstPoint) {
          setDotsLines((prev) => [
            ...prev,
            { x1: point.x, y1: point.y, x2: firstPoint.x, y2: firstPoint.y }
          ]);
        }

        setDotsRevealed(true);
        sfx.playSuccess();
        addStars(1);

        setTimeout(() => {
          if (dotsRound < 5) {
            const nextR = dotsRound + 1;
            setDotsRound(nextR);
            generateConnectDotsRound(nextR);
          } else {
            triggerVictory();
          }
        }, 2000);
      } else {
        setDotsNextNum((prev) => prev + 1);
      }
    } else {
      setDotsFeedback("wrong");
      sfx.playWrong();
      setDotsRevealed(true);
      setTimeout(() => {
        if (dotsRound < 5) {
          const nextR = dotsRound + 1;
          setDotsRound(nextR);
          generateConnectDotsRound(nextR);
        } else {
          triggerVictory();
        }
      }, 1800);
    }
  };

  // ==========================================
  // NEW GAME 4: BLOOMLY'S MAGIC MAZE (متاهة بلومي السحرية)
  // ==========================================
  interface MazeLevel {
    id: number;
    playerEmoji: string;
    targetEmoji: string;
    obstacleEmoji: string;
    obstacleBg: string;
    pathBg: string;
    name: string;
    grid: number[][]; // 6x6 grid. 0 = path, 1 = obstacle
    starPositions: { x: number; y: number }[];
  }

  const mazeLevelsBank: MazeLevel[] = [
    {
      id: 1,
      name: "متاهة النحلة النشيطة 🐝",
      playerEmoji: "🐝",
      targetEmoji: "🌸",
      obstacleEmoji: "🌳",
      obstacleBg: "bg-green-100",
      pathBg: "bg-yellow-50/50",
      grid: [
        [0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0]
      ],
      starPositions: [{ x: 1, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 5 }]
    },
    {
      id: 2,
      name: "متاهة الأرنب القفاز 🐰",
      playerEmoji: "🐰",
      targetEmoji: "🥕",
      obstacleEmoji: "🌿",
      obstacleBg: "bg-emerald-50",
      pathBg: "bg-emerald-50/20",
      grid: [
        [0, 1, 0, 0, 0, 1],
        [0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0]
      ],
      starPositions: [{ x: 2, y: 1 }, { x: 4, y: 3 }, { x: 2, y: 5 }]
    },
    {
      id: 3,
      name: "متاهة القرد الشقي 🐒",
      playerEmoji: "🐒",
      targetEmoji: "🍌",
      obstacleEmoji: "🌴",
      obstacleBg: "bg-emerald-50",
      pathBg: "bg-emerald-50/20",
      grid: [
        [0, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0]
      ],
      starPositions: [{ x: 2, y: 0 }, { x: 4, y: 1 }, { x: 3, y: 3 }]
    },
    {
      id: 4,
      name: "متاهة الفأر السريع 🐭",
      playerEmoji: "🐭",
      targetEmoji: "🧀",
      obstacleEmoji: "🧱",
      obstacleBg: "bg-red-50/50",
      pathBg: "bg-stone-50",
      grid: [
        [0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0]
      ],
      starPositions: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 2, y: 5 }]
    },
    {
      id: 5,
      name: "متاهة الفضاء السحرية 🧑‍🚀",
      playerEmoji: "🧑‍🚀",
      targetEmoji: "🚀",
      obstacleEmoji: "🪐",
      obstacleBg: "bg-indigo-950/10",
      pathBg: "bg-indigo-50/40",
      grid: [
        [0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0]
      ],
      starPositions: [{ x: 2, y: 1 }, { x: 4, y: 3 }, { x: 3, y: 5 }]
    }
  ];

  const [mazeRound, setMazeRound] = useState(1);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [collectedStars, setCollectedStars] = useState<string[]>([]);
  const [mazeFeedback, setMazeFeedback] = useState<"success" | "idle">("idle");

  const startMazeGame = () => {
    setMazeRound(1);
    setStarsEarnedThisSession(0);
    setMazeFeedback("idle");
    setActiveGame("maze");
    generateMazeRound(1);
  };

  const generateMazeRound = (roundNum: number = 1) => {
    setMazeFeedback("idle");
    setPlayerPosition({ x: 0, y: 0 });
    setCollectedStars([]);
  };

  const movePlayer = (dx: number, dy: number) => {
    if (mazeFeedback !== "idle" || activeGame !== "maze") return;

    const currentLevel = mazeLevelsBank[(mazeRound - 1) % mazeLevelsBank.length];
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX < 0 || newX > 5 || newY < 0 || newY > 5) return;
    if (currentLevel.grid[newY][newX] === 1) return;

    setPlayerPosition({ x: newX, y: newY });
    sfx.playPop();

    const starStr = `${newX},${newY}`;
    const hasStar = currentLevel.starPositions.some(sp => sp.x === newX && sp.y === newY);
    if (hasStar && !collectedStars.includes(starStr)) {
      setCollectedStars(prev => [...prev, starStr]);
      sfx.playSuccess();
    }

    if (newX === 5 && newY === 5) {
      setMazeFeedback("success");
      sfx.playSuccess();
      addStars(1);

      setTimeout(() => {
        setMazeRound(r => {
          if (r < 5) {
            const nextR = r + 1;
            setPlayerPosition({ x: 0, y: 0 });
            setCollectedStars([]);
            setMazeFeedback("idle");
            return nextR;
          } else {
            triggerVictory();
            return r;
          }
        });
      }, 2000);
    }
  };

  useEffect(() => {
    if (activeGame !== "maze") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        movePlayer(1, 0);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        movePlayer(-1, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeGame, playerPosition, collectedStars, mazeRound, mazeFeedback]);

  // ==========================================
  // NEW GAME 5: BLOOMLY'S SOUND SAFARI (سفاري الأصوات السحرية)
  // ==========================================
  interface SafariQuestion {
    id: string;
    emoji: string;
    name: string;
    soundId: string;
  }

  const safariBank: SafariQuestion[] = [
    { id: "dog", emoji: "🐕", name: "كلب ينبح", soundId: "dog" },
    { id: "train", emoji: "🚂", name: "قطار يصفر", soundId: "train" },
    { id: "bell", emoji: "🔔", name: "جرس يرن", soundId: "bell" },
    { id: "cat", emoji: "🐱", name: "قطة تموء", soundId: "cat" },
    { id: "monkey", emoji: "🐒", name: "قرد يصرخ", soundId: "monkey" },
    { id: "duck", emoji: "🦆", name: "بطة تقوق", soundId: "duck" }
  ];

  const [safariRound, setSafariRound] = useState(1);
  const [safariTarget, setSafariTarget] = useState<SafariQuestion | null>(null);
  const [safariOptions, setSafariOptions] = useState<SafariQuestion[]>([]);
  const [safariFeedback, setSafariFeedback] = useState<"correct" | "wrong" | "idle">("idle");
  const [safariSelectedId, setSafariSelectedId] = useState<string | null>(null);

  const startSafariGame = () => {
    setSafariRound(1);
    setStarsEarnedThisSession(0);
    setSafariFeedback("idle");
    setSafariSelectedId(null);
    setActiveGame("safari");
    generateSafariRound(1);
  };

  const generateSafariRound = (roundNum: number = 1) => {
    setSafariFeedback("idle");
    setSafariSelectedId(null);

    const target = safariBank[(roundNum - 1) % safariBank.length];
    setSafariTarget(target);

    const baits = safariBank.filter(item => item.id !== target.id);
    const shuffledBaits = [...baits].sort(() => 0.5 - Math.random());
    const selectedOptions = [target, shuffledBaits[0], shuffledBaits[1]];
    
    setSafariOptions(selectedOptions.sort(() => 0.5 - Math.random()));

    setTimeout(() => {
      sfx.playSafariSound(target.soundId);
    }, 400);
  };

  const handleSafariAnswer = (selectedId: string) => {
    if (safariFeedback !== "idle" || !safariTarget) return;

    setSafariSelectedId(selectedId);

    if (selectedId === safariTarget.id) {
      setSafariFeedback("correct");
      sfx.playSuccess();
      addStars(1);

      setTimeout(() => {
        if (safariRound < 5) {
          const nextR = safariRound + 1;
          setSafariRound(nextR);
          generateSafariRound(nextR);
        } else {
          triggerVictory();
        }
      }, 1800);
    } else {
      setSafariFeedback("wrong");
      sfx.playWrong();

      setTimeout(() => {
        if (safariRound < 5) {
          const nextR = safariRound + 1;
          setSafariRound(nextR);
          generateSafariRound(nextR);
        } else {
          triggerVictory();
        }
      }, 1800);
    }
  };

  // ==========================================
  // NEW GAME 6: BLOOMLY'S CANDY CHEF (مطبخ الحلوى السحري)
  // ==========================================
  interface Recipe {
    name: string;
    ingredients: string[];
    yieldEmoji: string;
    yieldName: string;
  }

  const chefRecipesBank: Recipe[] = [
    { name: "آيس كريم الفراولة اللذيذ 🍧", ingredients: ["🥛", "🍓", "🍦"], yieldEmoji: "🍨", yieldName: "آيس كريم فراولة سحري!" },
    { name: "كعكة الشوكولاتة اللامعة 🎂", ingredients: ["🥚", "🍫", "🧁"], yieldEmoji: "🎂", yieldName: "كعكة شوكولاتة سحرية!" },
    { name: "عصير كوكتيل بلومي 🍹", ingredients: ["🍊", "🍌", "🧊"], yieldEmoji: "🍹", yieldName: "عصير كوكتيل سحري!" },
    { name: "دوناتس العسل والسمسم 🍩", ingredients: ["🌾", "🍯", "🍩"], yieldEmoji: "🍩", yieldName: "دوناتس العسل السحرية!" },
    { name: "سلطة فواكه قوس قزح 🥗", ingredients: ["🍎", "🍇", "🍉"], yieldEmoji: "🥗", yieldName: "سلطة فواكه سحرية!" }
  ];

  const chefAllIngredients = ["🥛", "🍓", "🍦", "🍫", "🥚", "🧁", "🍊", "🍌", "🧊", "🌾", "🍯", "🍩", "🍎", "🍇", "🍉"];

  const [chefRound, setChefRound] = useState(1);
  const [chefRecipe, setChefRecipe] = useState<Recipe | null>(null);
  const [chefIngredientsList, setChefIngredientsList] = useState<string[]>([]);
  const [chefProgress, setChefProgress] = useState<string[]>([]);
  const [chefFeedback, setChefFeedback] = useState<"mixing" | "success" | "wrong" | "idle">("idle");

  const startChefGame = () => {
    setChefRound(1);
    setStarsEarnedThisSession(0);
    setChefFeedback("idle");
    setChefProgress([]);
    setActiveGame("chef");
    generateChefRound(1);
  };

  const generateChefRound = (roundNum: number = 1) => {
    setChefFeedback("idle");
    setChefProgress([]);

    const recipe = chefRecipesBank[(roundNum - 1) % chefRecipesBank.length];
    setChefRecipe(recipe);

    const nonRecipeItems = chefAllIngredients.filter(item => !recipe.ingredients.includes(item));
    const uniqueBaits = Array.from(new Set(nonRecipeItems)).sort(() => 0.5 - Math.random()).slice(0, 3);

    const options = [...recipe.ingredients, ...uniqueBaits];
    setChefIngredientsList(options.sort(() => 0.5 - Math.random()));
  };

  const handleChefIngredientClick = (item: string) => {
    if (chefFeedback !== "idle" || !chefRecipe) return;

    const nextIndex = chefProgress.length;
    const correctIngredient = chefRecipe.ingredients[nextIndex];

    if (item === correctIngredient) {
      sfx.playPop();
      const newProgress = [...chefProgress, item];
      setChefProgress(newProgress);

      if (newProgress.length === 3) {
        setChefFeedback("mixing");
        
        setTimeout(() => {
          setChefFeedback("success");
          sfx.playSuccess();
          addStars(1);
          
          setTimeout(() => {
            if (chefRound < 5) {
              const nextR = chefRound + 1;
              setChefRound(nextR);
              generateChefRound(nextR);
            } else {
              triggerVictory();
            }
          }, 2500);
        }, 1200);
      }
    } else {
      setChefFeedback("wrong");
      sfx.playWrong();

      setTimeout(() => {
        if (chefRound < 5) {
          const nextR = chefRound + 1;
          setChefRound(nextR);
          generateChefRound(nextR);
        } else {
          triggerVictory();
        }
      }, 1800);
    }
  };

  // ==========================================
  // NEW GAME 13: HUNGRY ANIMALS FARM (مزرعة الحيوانات الجائعة)
  // ==========================================
  const animalsData = [
    { id: "rabbit", emoji: "🐰", name: "أرنب" },
    { id: "monkey", emoji: "🐵", name: "قرد" },
    { id: "cat", emoji: "🐱", name: "قطة" },
    { id: "elephant", emoji: "🐘", name: "فيل" },
    { id: "dog", emoji: "🐶", name: "كلب" },
    { id: "mouse", emoji: "🐭", name: "فأر" },
    { id: "bear", emoji: "🐻", name: "دب" },
    { id: "panda", emoji: "🐼", name: "باندا" },
    { id: "lion", emoji: "🦁", name: "أسد" },
    { id: "cow", emoji: "🐮", name: "بقرة" },
    { id: "sheep", emoji: "🐑", name: "خروف" },
    { id: "horse", emoji: "🐴", name: "حصان" },
    { id: "chicken", emoji: "🐔", name: "دجاجة" },
    { id: "frog", emoji: "🐸", name: "ضفدع" },
    { id: "turtle", emoji: "🐢", name: "سلحفاة" },
    { id: "penguin", emoji: "🐧", name: "بطريق" },
    { id: "camel", emoji: "🐫", name: "جمل" },
    { id: "giraffe", emoji: "🦒", name: "زرافة" },
    { id: "koala", emoji: "🐨", name: "كوالا" },
    { id: "deer", emoji: "🦌", name: "غزال" },
    { id: "squirrel", emoji: "🐿️", name: "سنجاب" }
  ] as const;

  const foodData = [
    { id: "carrot", emoji: "🥕", name: "جزر" },
    { id: "banana", emoji: "🍌", name: "موز" },
    { id: "fish", emoji: "🐟", name: "سمك" },
    { id: "peanut", emoji: "🥜", name: "فول سوداني" },
    { id: "bone", emoji: "🦴", name: "عظم" },
    { id: "cheese", emoji: "🧀", name: "جبن" },
    { id: "honey", emoji: "🍯", name: "عسل" },
    { id: "bamboo", emoji: "🎋", name: "خيزران" },
    { id: "meat", emoji: "🥩", name: "لحم" },
    { id: "grass", emoji: "🌿", name: "عشب" },
    { id: "corn", emoji: "🌽", name: "ذرة" },
    { id: "fly", emoji: "🪰", name: "ذبابة" },
    { id: "lettuce", emoji: "🥬", name: "خس" },
    { id: "leaves", emoji: "🍂", name: "أوراق شجر" },
    { id: "acorn", emoji: "🌰", name: "بندق" }
  ] as const;

  type AnimalType = typeof animalsData[number]["id"];
  type FoodType = typeof foodData[number]["id"];

  const animalFoodMap: Record<AnimalType, FoodType> = {
    rabbit: "carrot",
    monkey: "banana",
    cat: "fish",
    elephant: "peanut",
    dog: "bone",
    mouse: "cheese",
    bear: "honey",
    panda: "bamboo",
    lion: "meat",
    cow: "grass",
    sheep: "grass",
    horse: "carrot",
    chicken: "corn",
    frog: "fly",
    turtle: "lettuce",
    penguin: "fish",
    camel: "grass",
    giraffe: "leaves",
    koala: "leaves",
    deer: "grass",
    squirrel: "acorn"
  };

  const [farmRound, setFarmRound] = useState(1);
  const [activeAnimal, setActiveAnimal] = useState<typeof animalsData[number]>(animalsData[0]);
  const [farmFeedback, setFarmFeedback] = useState<"correct" | "wrong" | "idle">("idle");
  const [farmSelectedFood, setFarmSelectedFood] = useState<FoodType | null>(null);
  const [farmCurrentFoods, setFarmCurrentFoods] = useState<typeof foodData[number][]>([]);

  const generateFarmRound = () => {
    setFarmFeedback("idle");
    setFarmSelectedFood(null);
    const randomAnimal = animalsData[Math.floor(Math.random() * animalsData.length)];
    setActiveAnimal(randomAnimal);

    const correctFoodId = animalFoodMap[randomAnimal.id];
    const correctFood = foodData.find(f => f.id === correctFoodId)!;
    
    const wrongFoods = foodData.filter(f => f.id !== correctFoodId);
    const shuffledWrong = [...wrongFoods].sort(() => Math.random() - 0.5).slice(0, 3);
    
    const roundFoods = [correctFood, ...shuffledWrong].sort(() => Math.random() - 0.5);
    setFarmCurrentFoods(roundFoods);
  };

  const startFarmGame = () => {
    setFarmRound(1);
    setStarsEarnedThisSession(0);
    setActiveGame("farm");
    generateFarmRound();
  };

  const handleFoodClick = (foodId: FoodType) => {
    if (farmFeedback !== "idle") return;
    
    setFarmSelectedFood(foodId);
    if (animalFoodMap[activeAnimal.id as AnimalType] === foodId) {
      setFarmFeedback("correct");
      sfx.playSuccess();
      addStars(2);
      setTimeout(() => {
        if (farmRound < 5) {
          setFarmRound(prev => prev + 1);
          generateFarmRound();
        } else {
          triggerVictory();
        }
      }, 2000);
    } else {
      setFarmFeedback("wrong");
      sfx.playWrong();
      setTimeout(() => {
        setFarmFeedback("idle");
        setFarmSelectedFood(null);
      }, 1500);
    }
  };

  // ==========================================
  // NEW GAME: TURBO ARROW RACER (سباق الاتجاهات الخارق) LOGIC
  // ==========================================
  const generateRacerRound = (round: number) => {
    setRacerFeedback("idle");
    setRacerInputIndex(0);
    setRacerLane(0);
    setRacerYOffset(0);
    
    const obstacles = ["🚧", "🪨", "🪵", "🧱", "💧", "🌪️", "📦"];
    setRacerObstacle(obstacles[Math.floor(Math.random() * obstacles.length)]);

    const directions: ("up" | "down" | "left" | "right")[] = ["up", "down", "left", "right"];
    // Increase length as round goes up, up to 7 arrows max
    const length = Math.min(2 + round, 7); 
    const seq: typeof racerSequence = [];
    for (let i = 0; i < length; i++) {
      seq.push(directions[Math.floor(Math.random() * directions.length)]);
    }
    setRacerSequence(seq);
  };

  const startRacerGame = () => {
    requireProfile(() => {
      setRacerRound(1);
      setStarsEarnedThisSession(0);
      setRacerSpeed(80); // baseline speed is 80 km/h so it's always moving!
      setRacerScore(0);
      setRacerTimeLeft(35); // 35 seconds time trial!
      setRacerActive(true);
      setActiveGame("arrowRacer");
      sfx.speakArabic("أهلاً بك في سباق الاتجاهات الخارق! وجه بالأسهم وتفادى العقبات!", "welcome");
      generateRacerRound(1);
    });
  };

  const handleRacerInput = (direction: "up" | "down" | "left" | "right") => {
    if (racerFeedback === "wrong" || !racerActive) return;
    
    const expected = racerSequence[racerInputIndex];
    if (direction === expected) {
      const nextIndex = racerInputIndex + 1;
      setRacerInputIndex(nextIndex);
      
      setRacerSpeed(prev => Math.min(prev + 25, 220));
      
      // Update vehicle positions based on steering
      if (direction === "left") {
        setRacerLane(-1);
      } else if (direction === "right") {
        setRacerLane(1);
      } else if (direction === "up") {
        setRacerYOffset(-30);
        setTimeout(() => setRacerYOffset(0), 200);
      } else if (direction === "down") {
        setRacerYOffset(20);
        setTimeout(() => setRacerYOffset(0), 200);
      }

      // Play Engine Rev
      try {
        sfx.playEngineRev();
      } catch (e) {}

      if (nextIndex === racerSequence.length) {
        setRacerFeedback("drift");
        addStars(3);
        setRacerScore(prev => prev + 150);
        setRacerLane(0);
        setRacerYOffset(0);
        
        try {
          sfx.playSuccess();
        } catch (e) {}

        // Go to next round indefinitely until timer runs out
        setTimeout(() => {
          const nextRound = racerRound + 1;
          setRacerRound(nextRound);
          generateRacerRound(nextRound);
        }, 1200);
      } else {
        setRacerFeedback("correct");
        setTimeout(() => setRacerFeedback("idle"), 250);
      }
    } else {
      setRacerFeedback("wrong");
      // Drops to 80 km/h minimum so it is always moving!
      setRacerSpeed(prev => Math.max(prev - 50, 80));
      setRacerLane(0);
      setRacerYOffset(0);
      
      try {
        sfx.playTireScreech();
      } catch (e) {}

      setTimeout(() => {
        setRacerInputIndex(0);
        setRacerFeedback("idle");
      }, 1000);
    }
  };

  useEffect(() => {
    if (activeGame !== "arrowRacer") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        handleRacerInput("up");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleRacerInput("down");
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleRacerInput("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleRacerInput("right");
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      
      const threshold = 30;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            handleRacerInput("right");
          } else {
            handleRacerInput("left");
          }
        }
      } else {
        if (Math.abs(diffY) > threshold) {
          if (diffY > 0) {
            handleRacerInput("down");
          } else {
            handleRacerInput("up");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeGame, racerRound, racerSequence, racerInputIndex, racerFeedback]);

  useEffect(() => {
    if (activeGame !== "arrowRacer" || !racerActive) return;

    if (racerTimeLeft <= 0) {
      setRacerActive(false);
      triggerVictory();
      return;
    }

    const timer = setInterval(() => {
      setRacerTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeGame, racerActive, racerTimeLeft]);

  // ==========================================
  // NEW GAME 14: MAGICAL SHAPES TRAIN (قطار الأشكال السحري)
  // ==========================================
  type ShapeType = "circle" | "square" | "triangle" | "star" | "heart" | "diamond" | "hexagon" | "crescent" | "cross" | "cloud" | "sun" | "lightning";
  interface TrainPart {
    id: string;
    shape: ShapeType;
    filled: boolean;
    color: string;
  }

  const allShapesData = [
    { type: "circle", emoji: "🟢", name: "دائرة" },
    { type: "square", emoji: "🟩", name: "مربع" },
    { type: "triangle", emoji: "🔺", name: "مثلث" },
    { type: "star", emoji: "⭐", name: "نجمة" },
    { type: "heart", emoji: "❤️", name: "قلب" },
    { type: "diamond", emoji: "♦️", name: "معين" },
    { type: "hexagon", emoji: "🛑", name: "سداسي" },
    { type: "crescent", emoji: "🌙", name: "هلال" },
    { type: "cross", emoji: "❌", name: "خطأ" },
    { type: "cloud", emoji: "☁️", name: "سحابة" },
    { type: "sun", emoji: "☀️", name: "شمس" },
    { type: "lightning", emoji: "⚡", name: "برق" }
  ] as const;

  const [trainRound, setTrainRound] = useState(1);
  const [trainParts, setTrainParts] = useState<TrainPart[]>([]);
  const [trainFeedback, setTrainFeedback] = useState<"success" | "wrong" | "idle">("idle");
  const [trainDeparting, setTrainDeparting] = useState(false);
  const [trainActiveTarget, setTrainActiveTarget] = useState<string | null>(null);
  const [trainCurrentOptions, setTrainCurrentOptions] = useState<typeof allShapesData[number][]>([]);

  const startTrainGame = () => {
    setTrainRound(1);
    setStarsEarnedThisSession(0);
    setActiveGame("train");
    generateTrainRound(1);
  };

  const generateTrainRound = (round: number) => {
    setTrainFeedback("idle");
    setTrainDeparting(false);
    setTrainActiveTarget(null);
    
    let numWagons = 3;
    let numDistractors = 5;
    
    if (childLevel === "level2") { numWagons = 4; numDistractors = 6; }
    if (childLevel === "level3") { numWagons = 5; numDistractors = 6; }
    if (childLevel === "level4") { numWagons = 5; numDistractors = 7; }

    // Select random required shapes
    const shuffled = [...allShapesData].sort(() => Math.random() - 0.5);
    const requiredShapes = shuffled.slice(0, numWagons);
    
    const newParts: TrainPart[] = requiredShapes.map((s, idx) => ({
      id: `part_${idx}`,
      shape: s.type as ShapeType,
      filled: false,
      color: ["#FF5A92", "#5BC0F8", "#2ECC71", "#FFD700", "#A855F7", "#FF9F29"][Math.floor(Math.random() * 6)]
    }));
    setTrainParts(newParts);
    
    // Create options tray
    const requiredTypes = requiredShapes.map(s => s.type);
    const remainingShapes = allShapesData.filter(s => !requiredTypes.includes(s.type));
    const wrongShapes = [...remainingShapes].sort(() => Math.random() - 0.5).slice(0, numDistractors);
    
    const options = [...requiredShapes, ...wrongShapes].sort(() => Math.random() - 0.5);
    setTrainCurrentOptions(options);
  };

  const handleShapeClick = (shapeType: ShapeType) => {
    if (trainFeedback !== "idle" || trainDeparting) return;
    
    // Find first unfilled part that matches
    const targetPart = trainParts.find(p => !p.filled && p.shape === shapeType);
    
    if (targetPart) {
      setTrainActiveTarget(targetPart.id);
      setTrainParts(prev => prev.map(p => p.id === targetPart.id ? { ...p, filled: true } : p));
      sfx.playPop();
      
      const allFilled = trainParts.every(p => (p.id === targetPart.id ? true : p.filled));
      if (allFilled) {
        setTrainFeedback("success");
        setTrainDeparting(true);
        sfx.playSuccess();
        addStars(2);
        
        setTimeout(() => {
          if (trainRound < 5) {
            setTrainRound(prev => prev + 1);
            generateTrainRound(trainRound + 1);
          } else {
            triggerVictory();
          }
        }, 3000);
      } else {
        setTimeout(() => {
          setTrainActiveTarget(null);
        }, 500);
      }
    } else {
      setTrainFeedback("wrong");
      sfx.playWrong();
      setTimeout(() => {
        setTrainFeedback("idle");
      }, 1000);
    }
  };

  // ==========================================
  // NEW GAME 15: FAST TAPPING RACER (لعبة الضغط السريع)
  // ==========================================
  type TapRacerTheme = "swim" | "cycle" | "run" | "fly";
  interface Opponent {
    id: number;
    name: string;
    emoji: string;
    progress: number;
    speed: number;
    color: string;
  }

  const [tapRacerRound, setTapRacerRound] = useState(1);
  const [tapRacerTheme, setTapRacerTheme] = useState<TapRacerTheme>("run");
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [tapRacerState, setTapRacerState] = useState<"idle" | "countdown" | "racing" | "finished">("idle");
  const [tapRacerCountdown, setTapRacerCountdown] = useState(3);
  const [tapRacerFeedback, setTapRacerFeedback] = useState("");
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [tapRacerStars, setTapRacerStars] = useState(0);

  const startTapRacerGame = () => {
    setTapRacerRound(1);
    setStarsEarnedThisSession(0);
    setTapRacerStars(0);
    initTapRacerRound(1);
    setActiveGame("tapRacer");
    sfx.speakArabic("أهلاً بك في سباق الضغط السريع! اضغط بأسرع ما يمكن لتفوز!", "welcome");
  };

  const initTapRacerRound = (roundNum: number) => {
    setPlayerProgress(0);
    setWinnerId(null);
    setTapRacerState("idle");
    setTapRacerCountdown(3);
    setTapRacerFeedback("");

    let theme: TapRacerTheme = "run";
    if (roundNum === 1) theme = "run";
    else if (roundNum === 2) theme = "cycle";
    else {
      theme = Math.random() > 0.5 ? "swim" : "fly";
    }
    setTapRacerTheme(theme);

    const currentLevel = selectedLevelIndex || 1;
    const difficultyMultiplier = 0.7 + (currentLevel / 100) * 1.5;

    const opponentData = [
      { id: 1, name: "الباندا بوبو 🐼", emoji: "🐼", progress: 0, speed: (1.2 + Math.random() * 0.5) * difficultyMultiplier, color: "#FF85A2" },
      { id: 2, name: "الأرنب سمسم 🐰", emoji: "🐰", progress: 0, speed: (1.4 + Math.random() * 0.4) * difficultyMultiplier, color: "#85FFD3" },
      { id: 3, name: "الثعلب فوفو 🦊", emoji: "🦊", progress: 0, speed: (1.3 + Math.random() * 0.5) * difficultyMultiplier, color: "#FFE885" }
    ];
    setOpponents(opponentData);
    setTapRacerState("countdown");
  };

  useEffect(() => {
    if (activeGame !== "tapRacer" || tapRacerState !== "countdown") return;

    if (tapRacerCountdown <= 0) {
      setTapRacerFeedback("انطلق! 🏁");
      setTapRacerState("racing");
      const clearFeedback = setTimeout(() => {
        setTapRacerFeedback("");
      }, 1000);
      return () => clearTimeout(clearFeedback);
    }

    const timer = setTimeout(() => {
      setTapRacerCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeGame, tapRacerState, tapRacerCountdown]);

  useEffect(() => {
    if (activeGame !== "tapRacer" || tapRacerState !== "racing") return;

    const interval = setInterval(() => {
      setOpponents(prev => {
        let winningOpponentId: number | null = null;
        let opponentWon = false;

        const next = prev.map(o => {
          const nextProg = Math.min(o.progress + o.speed, 100);
          if (nextProg >= 100 && winningOpponentId === null) {
            opponentWon = true;
            winningOpponentId = o.id;
          }
          return { ...o, progress: nextProg };
        });

        if (opponentWon && winnerId === null) {
          clearInterval(interval);
          setWinnerId(winningOpponentId);
          setTapRacerState("finished");
          
          const ahead = next.filter(o => o.progress > playerProgress).length + 1;
          let earned = 0;
          if (ahead === 2) {
            earned = 1;
            sfx.speakArabic("رائع! المركز الثاني! 🥈", "correct");
          } else {
            sfx.speakArabic("حاول مجدداً في الجولة القادمة! 💪", "wrong");
          }
          setTapRacerStars(p => p + earned);
          setStarsEarnedThisSession(p => p + earned);
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeGame, tapRacerState, playerProgress, winnerId]);

  const handleTapRacerClick = () => {
    if (tapRacerState !== "racing" || winnerId !== null) return;

    sfx.playPop();
    setPlayerProgress(prev => {
      const next = Math.min(prev + 4, 100);
      if (next >= 100 && winnerId === null) {
        setWinnerId(0);
        setTapRacerState("finished");
        
        let earned = 0;
        if (tapRacerRound === 1) earned = 2;
        else if (tapRacerRound === 2) earned = 2;
        else earned = 1;

        setTapRacerStars(p => p + earned);
        setStarsEarnedThisSession(p => p + earned);
        sfx.speakArabic("ممتاز! لقد فزت بالمركز الأول! 🏆", "correct");
      }
      return next;
    });
  };

  // Trigger star flying animation from a source coordinates to the header counter
  const triggerStarFlight = (sourceElementId?: string) => {
    const dest = document.getElementById("global-star-bubble")?.getBoundingClientRect();
    const destX = dest ? dest.left + dest.width / 2 : window.innerWidth - 100;
    const destY = dest ? dest.top + dest.height / 2 : 50;

    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (sourceElementId) {
      const el = document.getElementById(sourceElementId)?.getBoundingClientRect();
      if (el) {
        startX = el.left + el.width / 2;
        startY = el.top + el.height / 2;
      }
    }

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const starId = Date.now() + Math.random() + i;
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;

        setFlyingStars((prev) => [
          ...prev,
          {
            id: starId,
            startX: startX + offsetX,
            startY: startY + offsetY,
            endX: destX,
            endY: destY,
          },
        ]);

        setTimeout(() => {
          setFlyingStars((prev) => prev.filter((s) => s.id !== starId));
          setIsStarCounterBouncing(true);
          sfx.playPop();
          setTimeout(() => setIsStarCounterBouncing(false), 200);
        }, 800);
      }, i * 150);
    }
  };

  // Update global stars helper
  const addStars = (amount: number, sourceElementId?: string) => {
    triggerStarFlight(sourceElementId);
    if (setGlobalStars) {
      setGlobalStars((prev) => {
        const next = prev + amount;
        localStorage.setItem("bloomly_stars", next.toString());
        return next;
      });
    } else {
      const saved = localStorage.getItem("bloomly_stars");
      const prev = saved ? parseInt(saved, 10) : 0;
      const next = prev + amount;
      localStorage.setItem("bloomly_stars", next.toString());
    }
    setStarsEarnedThisSession((prev) => prev + amount);
  };

  // Launch Victory Fanfare & Confetti
  const triggerVictory = () => {
    setShowVictoryModal(true);
    sfx.playVictory();
    
    // Save level stars to map progress
    if (selectedLevelIndex !== null) {
      const starKey = `bloomly_stars_${activeGame}_level_${selectedLevelIndex}`;
      const calculatedStars = starsEarnedThisSession >= 5 ? 3 : starsEarnedThisSession >= 3 ? 2 : 1;
      const currentSaved = parseInt(localStorage.getItem(starKey) || "0", 10);
      if (calculatedStars > currentSaved) {
        localStorage.setItem(starKey, String(calculatedStars));
      }
    }
    
    // Play custom narrator voice audio files as requested by user
    try {
      let audioPath = "";
      if (starsEarnedThisSession === 5) {
        audioPath = "/excellent.mp3";
      } else if (starsEarnedThisSession > 0) {
        audioPath = "/well_done_hero.mp3";
      }
      if (audioPath) {
        const audio = new Audio(audioPath);
        audio.volume = 1.0;
        audio.play().catch(e => console.warn("Victory custom audio play blocked:", e));
      }
    } catch (e) {
      console.warn("Victory custom audio player error:", e);
    }
    
    // Spawn 180 confetti particles (falling colored papers) exploding from left and right corners
    const colors = ["#FF5A92", "#5BF8A3", "#FFD700", "#5BC0F8", "#A855F7", "#FF9F29"];
    const particles = Array.from({ length: 180 }).map((_, i) => {
      const isLeft = i % 2 === 0;
      const startX = isLeft ? 6 : 94; // right near the poppers
      const startY = 88;
      
      // Peak of the arc (explodes upwards and inwards)
      const peakX = isLeft 
        ? 20 + Math.random() * 50  // shoots towards center/right
        : 30 + Math.random() * 50; // shoots towards center/left
      const peakY = 5 + Math.random() * 35; // rises high into top 5% to 40%
      
      // End landing position (drifts down)
      const endX = peakX + (Math.random() * 20 - 10);
      const endY = 115;
      
      const size = 7 + Math.random() * 12;
      return {
        id: Date.now() + i + Math.random(),
        startX: `${startX}%`,
        startY: `${startY}%`,
        peakX: `${peakX}%`,
        endX: `${endX}%`,
        peakY: `${peakY}%`,
        endY: `${endY}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: size,
        height: size * (0.4 + Math.random() * 0.8), // ribbon shape
        duration: 1.6 + Math.random() * 1.4, // fast rise and slower drift down
        delay: Math.random() * 0.35, // rapid shooting delays
        spin: Math.random() * 1080 - 540,
      };
    });
    setConfetti(particles);

    // Empty victory balloons to focus purely on the beautiful double corner-poppers explosion
    setVictoryBalloons([]);
  };

  const popVictoryBalloon = (id: number, clientX: number, clientY: number, color: string) => {
    sfx.playBalloonPop();
    setVictoryBalloons((prev) => prev.filter((b) => b.id !== id));
    
    // Convert click coordinates to window percentages
    const xPercent = (clientX / window.innerWidth) * 100;
    const yPercent = (clientY / window.innerHeight) * 100;
    
    const colors = ["#FF5A92", "#5BF8A3", "#FFD700", "#5BC0F8", "#A855F7", "#FF9F29", color];
    const newConfetti = Array.from({ length: 15 }).map((_, i) => {
      const peakX = xPercent + (Math.random() * 20 - 10);
      const peakY = yPercent - (Math.random() * 15 + 5);
      const endX = peakX + (Math.random() * 10 - 5);
      const endY = 115;
      const size = 8 + Math.random() * 10;
      return {
        id: Date.now() + i + Math.random(),
        startX: `${xPercent}%`,
        startY: `${yPercent}%`,
        peakX: `${peakX}%`,
        endX: `${endX}%`,
        peakY: `${peakY}%`,
        endY: `${endY}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: size,
        height: size * (0.4 + Math.random() * 0.8),
        duration: 1.2 + Math.random() * 1.0,
        delay: 0,
        spin: Math.random() * 360 - 180,
      };
    });
    
    setConfetti((prev) => [...prev, ...newConfetti]);
  };

  // Clean confetti and victory balloons
  useEffect(() => {
    if (showVictoryModal) {
      const timer1 = setTimeout(() => setConfetti([]), 5000);
      const timer2 = setTimeout(() => setVictoryBalloons([]), 10000); // 10 seconds to allow all balloons to float away
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showVictoryModal]);

  const quitGame = () => {
    setShowLevelMap(true);
    setStarsEarnedThisSession(0);
    setRacerActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (gameLoopIntervalRef.current) clearInterval(gameLoopIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setCatcherCountdown(null);
  };

  const startNextLevel = () => {
    try {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } catch (e) {}
    setShowVictoryModal(false);
    setVictoryBalloons([]);
    setConfetti([]);

    if (selectedLevelIndex !== null && selectedLevelIndex < 100) {
      const nextLvl = selectedLevelIndex + 1;
      setSelectedLevelIndex(nextLvl);
      
      const difficulty = nextLvl <= 25 ? "level1" : nextLvl <= 50 ? "level2" : nextLvl <= 75 ? "level3" : "level4";
      setActiveDifficulty(difficulty as any);
      setEffectiveLevel(difficulty as any);
      
      if (activeGame === "math") startMathGame();
      else if (activeGame === "spelling") startSpellingGame();
      else if (activeGame === "memory") initMemoryGame();
      else if (activeGame === "catcher") startCatcherGame();
      else if (activeGame === "coloring") startColoringGame();
      else if (activeGame === "spellingEn") startSpellingEnGame();
      else if (activeGame === "sorting") startSortingGame();
      else if (activeGame === "spaceCatcher") startSpaceCatcherGame();
      else if (activeGame === "connectDots") startConnectDotsGame();
      else if (activeGame === "maze") startMazeGame();
      else if (activeGame === "safari") startSafariGame();
      else if (activeGame === "chef") startChefGame();
      else if (activeGame === "farm") startFarmGame();
      else if (activeGame === "train") startTrainGame();
      else if (activeGame === "arrowRacer") startRacerGame();
      else if (activeGame === "tapRacer") startTapRacerGame();
    } else {
      setActiveGame("menu");
    }
  };

  // ==========================================
  // 1. GAME: EASY MATH GARDEN (حديقة الحساب)
  // ==========================================
  const [mathRound, setMathRound] = useState(1);
  const [mathQuestion, setMathQuestion] = useState<{
    text: string;
    emojis?: string;
    correct: number;
    options: number[];
  }>({ text: "", correct: 0, options: [] });
  const [mathFeedback, setMathFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [mathSelectedOption, setMathSelectedOption] = useState<number | null>(null);

  const generateMathQuestion = () => {
    setMathFeedback("idle");
    setMathSelectedOption(null);

    let maxNum = 5;
    let allowSubtraction = false;
    let allowMultiplication = false;

    if (childLevel === "level2") {
      maxNum = 10;
      allowSubtraction = true;
    } else if (childLevel === "level3") {
      maxNum = 20;
      allowSubtraction = true;
    } else if (childLevel === "level4") {
      maxNum = 12; // for multiplication
      allowSubtraction = true;
      allowMultiplication = true;
    }

    const mode = Math.random();
    
    // Level 1 mostly counts emojis
    if (childLevel === "level1" && mode > 0.3) {
      const count = 2 + Math.floor(Math.random() * maxNum); // 2 to 6
      const emojiList = ["🐞", "🌸", "⭐", "🍎", "🐝"];
      const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
      const text = `كم عدد الـ (${emoji}) في المستطيل أدناه؟`;
      const emojis = Array.from({ length: count }).map(() => emoji).join(" ");
      
      const options = [count];
      while (options.length < 4) {
        const rand = 1 + Math.floor(Math.random() * (maxNum + 2));
        if (!options.includes(rand) && rand > 0) options.push(rand);
      }
      options.sort(() => Math.random() - 0.5);

      setMathQuestion({ text, emojis, correct: count, options });
      return;
    }

    // Arithmetic
    let a = 1 + Math.floor(Math.random() * maxNum);
    let b = 1 + Math.floor(Math.random() * maxNum);
    let operation = "+";
    let ans = a + b;

    if (allowMultiplication && mode > 0.6) {
      operation = "×";
      ans = a * b;
    } else if (allowSubtraction && mode > 0.3) {
      operation = "-";
      if (b > a) { const temp = a; a = b; b = temp; }
      ans = a - b;
    }

    const text = `كم يساوي: ${a} ${operation} ${b} ؟`;
    const emojis = operation === "+" && ans <= 10 
      ? Array.from({ length: a }).map(() => "🍊").join(" ") + "   +   " + Array.from({ length: b }).map(() => "🍊").join(" ") 
      : undefined;

    const options = [ans];
    while (options.length < 4) {
      let offset = Math.floor(Math.random() * 5) + 1;
      let rand = Math.random() > 0.5 ? ans + offset : ans - offset;
      if (rand < 0 && operation !== "-") rand = ans + offset + 2;
      if (!options.includes(rand)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);

    setMathQuestion({ text, emojis, correct: ans, options });
  };

  const handleMathAnswer = (option: number) => {
    if (mathSelectedOption !== null) return;
    setMathSelectedOption(option);

    if (option === mathQuestion.correct) {
      setMathFeedback("correct");
      sfx.playSuccess();
      sfx.speakArabic("ممتاز!", "correct");
      addStars(1);
    } else {
      setMathFeedback("wrong");
      sfx.playWrong();
      sfx.speakArabic("حاول مرة أخرى!", "wrong");
    }

    setTimeout(() => {
      if (mathRound < 5) {
        setMathRound((prev) => prev + 1);
        generateMathQuestion();
      } else {
        triggerVictory();
      }
    }, 1500);
  };

  const startMathGame = () => {
    setMathRound(1);
    setStarsEarnedThisSession(0);
    setActiveGame("math");
    sfx.speakArabic("أهلاً بك في حديقة الحساب! احسب العملية الحسابية واختر الإجابة!", "welcome");
    // Generate initial question
    setTimeout(() => generateMathQuestion(), 50);
  };

  // ==========================================
  // 2. GAME: LETTER ADVENTURE (مغامرة الحروف)
  // ==========================================
  const [spellingRound, setSpellingRound] = useState(1);
  const [spellingQuestion, setSpellingQuestion] = useState<{
    emoji: string;
    word: string;
    correctLetter: string;
    options: string[];
    qType: "letter" | "word";
  }>({ emoji: "", word: "", correctLetter: "", options: [], qType: "letter" });
  const [spellingFeedback, setSpellingFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [spellingSelected, setSpellingSelected] = useState<string | null>(null);

  const spellingBank = [
    { emoji: "🍎", word: "تُفَّاحَة", correctLetter: "ت" },
    { emoji: "🐰", word: "أَرْنَب", correctLetter: "أ" },
    { emoji: "🐱", word: "قِطَّة", correctLetter: "ق" },
    { emoji: "🚗", word: "سَيَّارَة", correctLetter: "س" },
    { emoji: "🐟", word: "سَمَكَة", correctLetter: "س" },
    { emoji: "🐒", word: "قِرْد", correctLetter: "ق" },
    { emoji: "🏠", word: "بَيْت", correctLetter: "ب" },
    { emoji: "🍌", word: "مَوْز", correctLetter: "م" },
    { emoji: "🦆", word: "بَطَّة", correctLetter: "ب" },
    { emoji: "🌴", word: "نَخْلَة", correctLetter: "ن" },
    { emoji: "🦁", word: "أَسَد", correctLetter: "أ" },
    { emoji: "🐪", word: "جَمَل", correctLetter: "ج" },
  ];

  const generateSpellingQuestion = () => {
    setSpellingFeedback("idle");
    setSpellingSelected(null);

    const questionItem = spellingBank[Math.floor(Math.random() * spellingBank.length)];
    let qType: "letter" | "word" = "letter";
    const mode = Math.random();
    
    if (childLevel === "level1") {
      qType = "letter";
    } else if (childLevel === "level2") {
      qType = mode < 0.5 ? "letter" : "word";
    } else if (childLevel === "level3") {
      qType = mode < 0.1 ? "letter" : "word";
    } else if (childLevel === "level4") {
      qType = "word";
    }

    let options: string[] = [];
    let correctLetter = "";

    if (qType === "letter") {
      correctLetter = questionItem.correctLetter;
      const distractorLetters = ["أ", "ب", "ت", "ج", "س", "ق", "م", "ن", "ح", "خ", "د", "ل"];
      options.push(correctLetter);
      while (options.length < 4) {
        const rand = distractorLetters[Math.floor(Math.random() * distractorLetters.length)];
        if (!options.includes(rand)) options.push(rand);
      }
    } else {
      correctLetter = questionItem.word;
      options.push(correctLetter);
      while (options.length < 4) {
        const randItem = spellingBank[Math.floor(Math.random() * spellingBank.length)];
        if (!options.includes(randItem.word)) options.push(randItem.word);
      }
    }
    options.sort(() => Math.random() - 0.5);

    setSpellingQuestion({
      emoji: questionItem.emoji,
      word: questionItem.word,
      correctLetter,
      options,
      qType
    });
  };

  const handleSpellingAnswer = (letter: string) => {
    if (spellingSelected !== null) return;
    setSpellingSelected(letter);

    if (letter === spellingQuestion.correctLetter) {
      setSpellingFeedback("correct");
      sfx.playSuccess();
      sfx.speakArabic("ممتاز!", "correct");
      addStars(1);
    } else {
      setSpellingFeedback("wrong");
      sfx.playWrong();
      sfx.speakArabic("حاول مرة أخرى!", "wrong");
    }

    setTimeout(() => {
      if (spellingRound < 5) {
        setSpellingRound((prev) => prev + 1);
        generateSpellingQuestion();
      } else {
        triggerVictory();
      }
    }, 1500);
  };

  const startSpellingGame = () => {
    setSpellingRound(1);
    setStarsEarnedThisSession(0);
    setActiveGame("spelling");
    sfx.speakArabic("أهلاً بك في مغامرة الحروف! اختر الحرف الصحيح أو الكلمة المطابقة للصورة!", "welcome");
    setTimeout(() => generateSpellingQuestion(), 50);
  };

  // ==========================================
  // 3. GAME: MAGIC MEMORY MATCH (كروت الذاكرة)
  // ==========================================
  interface MemoryCard {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [memoryMatchesFound, setMemoryMatchesFound] = useState(0);
  const [memoryTargetMatches, setMemoryTargetMatches] = useState(4);

  const initMemoryGame = () => {
    setStarsEarnedThisSession(0);
    setMemoryMatchesFound(0);
    setSelectedCardIds([]);
    let pairsCount = 4;
    if (childLevel === "level2") pairsCount = 6;
    if (childLevel === "level3") pairsCount = 8;
    if (childLevel === "level4") pairsCount = 10;
    setMemoryTargetMatches(pairsCount);

    const allEmojis = ["🦁", "🐰", "🐼", "🦊", "🐸", "🐨", "🐯", "🐻", "🐮", "🐷", "🐧", "🐙"];
    const emojis = allEmojis.slice(0, pairsCount);
    const doubled = [...emojis, ...emojis];
    
    // Shuffle
    const shuffled = doubled
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setMemoryCards(shuffled);
    setActiveGame("memory");
  };

  const handleCardClick = (id: number) => {
    // Ignore if already matched, flipped, or two are already selected
    const card = memoryCards.find((c) => c.id === id);
    if (!card || card.isMatched || card.isFlipped || selectedCardIds.length >= 2) return;

    sfx.playPop();

    // Flip card
    setMemoryCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );

    const nextSelected = [...selectedCardIds, id];
    setSelectedCardIds(nextSelected);

    if (nextSelected.length === 2) {
      const [firstId, secondId] = nextSelected;
      const firstCard = memoryCards.find((c) => c.id === firstId);
      const secondCard = memoryCards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // MATCH FOUND
        setTimeout(() => {
          sfx.playSuccess();
          setMemoryMatchesFound((prev) => {
            const next = prev + 1;
            addStars(1); // Give a star for every match
            
            if (next === memoryTargetMatches) {
              setTimeout(() => triggerVictory(), 1000);
            }
            return next;
          });
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setSelectedCardIds([]);
        }, 600);
      } else {
        // NO MATCH - FLIP BACK
        setTimeout(() => {
          sfx.playWrong();
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCardIds([]);
        }, 1200);
      }
    }
  };

  // ==========================================
  // 4. GAME: BALLOON & STAR CATCHER (صيد البالونات)
  // ==========================================
  const [catchScore, setCatchScore] = useState(0);
  const [catchTimeLeft, setCatchTimeLeft] = useState(20);
  const [catchItems, setCatchItems] = useState<CatchItem[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [catcherCountdown, setCatcherCountdown] = useState<number | "GO" | null>(null);
  const catcherContainerRef = useRef<HTMLDivElement>(null);
  const gameLoopIntervalRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const startCatcherGame = () => {
    setCatchScore(0);
    setCatchTimeLeft(20);
    setStarsEarnedThisSession(0);
    setCatchItems([]);
    setFloatingScores([]);
    setActiveGame("catcher");
    setCatcherCountdown(3);

    // Initial countdown tick sound
    sfx.playPop();

    let currentCount = 3;
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setCatcherCountdown(currentCount);
        sfx.playPop();
      } else if (currentCount === 0) {
        setCatcherCountdown("GO");
        sfx.playSuccess();
      } else {
        clearInterval(countdownIntervalRef.current);
        setCatcherCountdown(null);
        startGameLoops();
      }
    }, 1000);
  };

  const startGameLoops = () => {
    // Start Timer countdown
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setCatchTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          clearInterval(gameLoopIntervalRef.current);
          // Finish game
          setTimeout(() => {
            // Earn 1 star for every 3 points, minimum 2 stars
            const earned = Math.max(2, Math.floor(catchScore / 3));
            addStars(earned);
            triggerVictory();
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn loop
    let itemIdCounter = 0;
    if (gameLoopIntervalRef.current) clearInterval(gameLoopIntervalRef.current);
    gameLoopIntervalRef.current = setInterval(() => {
      const rand = Math.random();
      let type: "star" | "balloon" | "cloud" = "balloon";
      let emoji = "🎈";
      let color = "#FF5A92";
      
      if (rand < 0.35) {
        type = "star";
        emoji = "⭐";
        color = "#FFD700";
      } else if (rand > 0.82) {
        type = "cloud";
        emoji = "⛈️";
        color = "#4D2B82";
      } else {
        const ballEmojis = ["🎈", "🎈", "🎈", "🎈"];
        const ballColors = ["#FF5A92", "#5BC0F8", "#A855F7", "#FF9F29"];
        const randIndex = Math.floor(Math.random() * ballColors.length);
        emoji = ballEmojis[randIndex];
        color = ballColors[randIndex];
      }

      const speed = 0.6 + Math.random() * 0.6;
      // Calculate smooth CSS animation duration (5 to 10 seconds based on speed)
      const duration = parseFloat((6.0 / speed).toFixed(2));

      const newItem: CatchItem = {
        id: itemIdCounter++,
        x: 8 + Math.random() * 84, // keep inside margins slightly
        y: type === "star" ? -12 : 112,
        type,
        emoji,
        color,
        speed,
        duration,
      };

      setCatchItems((prev) => [...prev, newItem]);
    }, 1300); // Slower spawn rate (every 1.3 seconds)
  };

  const handleItemAnimationEnd = (id: number) => {
    setCatchItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clean intervals
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (gameLoopIntervalRef.current) clearInterval(gameLoopIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const handleCatcherItemClick = (e: React.MouseEvent, item: CatchItem) => {
    e.stopPropagation();
    sfx.playPop();

    // Remove item
    setCatchItems((prev) => prev.filter((i) => i.id !== item.id));

    // Get click coords relative to container
    let clickX = 50;
    let clickY = 50;
    if (catcherContainerRef.current) {
      const rect = catcherContainerRef.current.getBoundingClientRect();
      clickX = ((e.clientX - rect.left) / rect.width) * 100;
      clickY = ((e.clientY - rect.top) / rect.height) * 100;
    }

    // Set points
    let points = 1;
    let text = "+1";
    if (item.type === "star") {
      sfx.playSuccess();
      points = 3;
      text = "+3 ⭐";
    } else if (item.type === "cloud") {
      sfx.playWrong();
      points = -2;
      text = "-2 ⛈️";
    }

    setCatchScore((prev) => Math.max(0, prev + points));

    // Floating text indicator
    const newFloat: FloatingScore = {
      id: Date.now(),
      x: clickX,
      y: clickY,
      text
    };
    setFloatingScores((prev) => [...prev, newFloat]);

    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((f) => f.id !== newFloat.id));
    }, 1000);
  };

  // ==========================================
  // 5. GAME: ENGLISH SPELLING ADVENTURE (مغامرة الحروف الإنجليزية)
  // ==========================================
  const [spellingEnRound, setSpellingEnRound] = useState(1);
  const [spellingEnQuestion, setSpellingEnQuestion] = useState<{
    emoji: string;
    word: string;
    correctLetter: string;
    options: string[];
    qType: "letter" | "word";
  }>({ emoji: "", word: "", correctLetter: "", options: [], qType: "letter" });
  const [spellingEnFeedback, setSpellingEnFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [spellingEnSelected, setSpellingEnSelected] = useState<string | null>(null);

  const spellingEnBank = [
    { emoji: "🍎", word: "APPLE", correctLetter: "A" },
    { emoji: "🐱", word: "CAT", correctLetter: "C" },
    { emoji: "🚗", word: "CAR", correctLetter: "C" },
    { emoji: "🐟", word: "FISH", correctLetter: "F" },
    { emoji: "🦁", word: "LION", correctLetter: "L" },
    { emoji: "🏠", word: "HOUSE", correctLetter: "H" },
    { emoji: "🍌", word: "BANANA", correctLetter: "B" },
    { emoji: "🦆", word: "DUCK", correctLetter: "D" },
    { emoji: "🐘", word: "ELEPHANT", correctLetter: "E" },
    { emoji: "🐒", word: "MONKEY", correctLetter: "M" },
    { emoji: "🍇", word: "GRAPES", correctLetter: "G" },
    { emoji: "🚀", word: "ROCKET", correctLetter: "R" },
  ];

  const generateSpellingEnQuestion = () => {
    setSpellingEnFeedback("idle");
    setSpellingEnSelected(null);

    const questionItem = spellingEnBank[Math.floor(Math.random() * spellingEnBank.length)];
    let qType: "letter" | "word" = "letter";
    const mode = Math.random();
    
    if (childLevel === "level1") {
      qType = "letter";
    } else if (childLevel === "level2") {
      qType = mode < 0.5 ? "letter" : "word";
    } else if (childLevel === "level3") {
      qType = mode < 0.1 ? "letter" : "word";
    } else if (childLevel === "level4") {
      qType = "word";
    }

    let options: string[] = [];
    let correctLetter = "";

    if (qType === "letter") {
      correctLetter = questionItem.correctLetter;
      const distractorLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "L", "M", "P", "R", "S", "T", "W", "Y"];
      options.push(correctLetter);
      while (options.length < 4) {
        const rand = distractorLetters[Math.floor(Math.random() * distractorLetters.length)];
        if (!options.includes(rand)) options.push(rand);
      }
    } else {
      correctLetter = questionItem.word;
      options.push(correctLetter);
      while (options.length < 4) {
        const randItem = spellingEnBank[Math.floor(Math.random() * spellingEnBank.length)];
        if (!options.includes(randItem.word)) options.push(randItem.word);
      }
    }
    options.sort(() => Math.random() - 0.5);

    setSpellingEnQuestion({
      emoji: questionItem.emoji,
      word: questionItem.word,
      correctLetter,
      options,
      qType
    });
  };

  const handleSpellingEnAnswer = (letter: string) => {
    if (spellingEnSelected !== null) return;
    setSpellingEnSelected(letter);

    if (letter === spellingEnQuestion.correctLetter) {
      setSpellingEnFeedback("correct");
      sfx.playSuccess();
      addStars(1);
    } else {
      setSpellingEnFeedback("wrong");
      sfx.playWrong();
    }

    setTimeout(() => {
      if (spellingEnRound < 5) {
        setSpellingEnRound((prev) => prev + 1);
        generateSpellingEnQuestion();
      } else {
        triggerVictory();
      }
    }, 1500);
  };

  const startSpellingEnGame = () => {
    setSpellingEnRound(1);
    setStarsEarnedThisSession(0);
    setActiveGame("spellingEn");
    setTimeout(() => generateSpellingEnQuestion(), 50);
  };

  // ==========================================
  // 6. GAME: ART COLORING STUDIO (ورشة الفنان للتلوين)
  // ==========================================
  const [activeTemplate, setActiveTemplate] = useState<"apple" | "orange" | "cat" | "monkey" | "dove" | "rocket" | "free">("apple");
  const [currentColor, setCurrentColor] = useState("#FF5A92");
  const [brushSize, setBrushSize] = useState(8);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const coloringTemplates = [
    { id: "apple", emoji: "🍎", name: "تفاحة" },
    { id: "orange", emoji: "🍊", name: "برتقالة" },
    { id: "cat", emoji: "🐱", name: "قطة" },
    { id: "monkey", emoji: "🐒", name: "قرد" },
    { id: "dove", emoji: "🕊️", name: "حمامة" },
    { id: "rocket", emoji: "🚀", name: "صاروخ" },
    { id: "free", emoji: "🎨", name: "رسم حر" },
  ];

  const coloringColors = [
    "#E60023", // Dark Red
    "#FF5A92", // Rose Pink
    "#FF8E9F", // Soft Pink
    "#FF9F29", // Orange
    "#FFD700", // Yellow
    "#2ECC71", // Green
    "#198754", // Dark Green
    "#4FD1C5", // Teal
    "#5BC0F8", // Sky Blue
    "#1D4ED8", // Royal Blue
    "#A855F7", // Purple
    "#8B5CF6", // Violet
    "#78350F", // Brown
    "#FDBA74", // Peach
    "#000000", // Black
    "#FFFFFF", // White (Eraser/Clear)
  ];

  // Helper to draw template emoji and convert to outline
  const drawTemplateOutline = (canvas: HTMLCanvasElement, templateId: string) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const template = coloringTemplates.find((t) => t.id === templateId);
    if (!template || templateId === "free") return;

    ctx.save();
    // Font size relative to canvas
    const fontSize = Math.min(canvas.width, canvas.height) * 0.65;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black"; // Emojis draw full color
    ctx.fillText(template.emoji, canvas.width / 2, canvas.height / 2);
    ctx.restore();

    // Extract boundaries & empty out colored body
    convertToOutline(canvas);
  };

  // Perform flood fill
  const performFloodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    floodFill(canvas, Math.round(startX), Math.round(startY), currentColor);
  };

  // Initialize Canvas Size and background
  useEffect(() => {
    if (activeGame === "coloring" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set standard resolution matching display size
        canvas.width = canvas.offsetWidth || 500;
        canvas.height = canvas.offsetHeight || 375;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (activeTemplate !== "free") {
          drawTemplateOutline(canvas, activeTemplate);
        }
      }
    }
  }, [activeGame, activeTemplate]);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (activeTemplate !== "free") {
      performFloodFill(x, y);
      isDrawingRef.current = false;
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
      isDrawingRef.current = true;
    }
  };

  const draw = (e: any) => {
    if (!isDrawingRef.current) return;
    if (activeTemplate !== "free") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const startColoringGame = () => {
    setStarsEarnedThisSession(0);
    setActiveTemplate("apple");
    setCurrentColor("#FF5A92");
    setBrushSize(8);
    setActiveGame("coloring");
  };

  const playBubbleSound = () => {
    sfx.playPop();
  };

  const getMapTheme = () => {
    switch (activeGame) {
      case "math":
        return {
          name: "حديقة الحساب الساحرة 🍎",
          bgClass: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600",
          nodeBg: "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-600",
          nodeEmoji: "🌸",
          decor: ["🐞", "🌸", "🦋", "🐝", "🥕"],
          pathColor: "border-emerald-300",
          title: "امشِ على كروت الزهور لحل العمليات الحسابية!"
        };
      case "spelling":
        return {
          name: "مغامرة الحروف والرمال 🏜️",
          bgClass: "bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-600",
          nodeBg: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-600",
          nodeEmoji: "🐫",
          decor: ["🌵", "🐫", "🌴", "☀️", "🏺"],
          pathColor: "border-yellow-300",
          title: "اعبر الأهرامات لتكشف أسرار الحروف العربية!"
        };
      case "memory":
        return {
          name: "كروت بحر الذاكرة السري 🌊",
          bgClass: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
          nodeBg: "bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-600",
          nodeEmoji: "🐚",
          decor: ["🐠", "🐚", "🐙", "🦀", "🐬"],
          pathColor: "border-cyan-300",
          title: "طابق كروت الحيوانات المائية في أعماق المحيط!"
        };
      case "arrowRacer":
        return {
          name: "سباق الاتجاهات الخارق 🏁",
          bgClass: "bg-gradient-to-br from-gray-700 via-slate-800 to-zinc-900",
          nodeBg: "bg-red-100 hover:bg-red-200 text-red-800 border-red-600",
          nodeEmoji: "🏎️",
          decor: ["🏁", "🏆", "🚦", "🔥", "💨"],
          pathColor: "border-red-400",
          title: "وجّه الموتوسيكل بالسرعة القصوى وتفادى العوائق!"
        };
      default:
        return {
          name: "جزيرة بلومي الطائرة ☁️",
          bgClass: "bg-gradient-to-br from-purple-400 via-indigo-500 to-pink-500",
          nodeBg: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-600",
          nodeEmoji: "⭐",
          decor: ["⭐", "🎈", "☁️", "🚀", "🪐"],
          pathColor: "border-pink-300",
          title: "امشِ في مسار النجوم الطائرة وحل الألغاز!"
        };
    }
  };

  return (
    <section id="game-zone" ref={gameZoneRef} className={activeGame === "menu" ? "container mx-auto px-4 py-20 relative z-20" : "fixed inset-0 z-[9900] bg-[#FAF7FD] overflow-y-auto p-4 md:p-8 flex items-center justify-center select-none"}>
      
      {/* self-contained CSS for victory balloons & colorful shapes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatUpVictoryBalloon {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-60vh) rotate(8deg);
          }
          100% {
            transform: translateY(-130vh) rotate(-8deg);
          }
        }
        .animate-victory-balloon {
          animation-name: floatUpVictoryBalloon;
          animation-timing-function: ease-out;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        @keyframes driftSide {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: 15px; }
        }
        .animate-drift-side {
          animation: driftSide 3s ease-in-out infinite;
        }
        @keyframes catcherSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes catcherWobble {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-catcher-spin {
          animation: catcherSpin 3s linear infinite;
          display: inline-block;
        }
        .animate-catcher-wobble {
          animation: catcherWobble 1.2s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes flutterPaper {
          0% { transform: rotate(0deg) scaleX(1); }
          25% { transform: rotate(90deg) scaleX(0.4); }
          50% { transform: rotate(180deg) scaleX(1); }
          75% { transform: rotate(270deg) scaleX(0.4); }
          100% { transform: rotate(360deg) scaleX(1); }
        }
      `}} />

      {/* Flying Stars Animation */}
      <AnimatePresence>
        {flyingStars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ x: star.startX, y: star.startY, scale: 0.2, opacity: 1, rotate: 0 }}
            animate={{ 
              x: star.endX, 
              y: star.endY, 
              scale: [0.2, 1.5, 1], 
              opacity: [1, 1, 0.8, 0],
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed left-0 top-0 text-4xl text-yellow-400 select-none z-[99999] pointer-events-none filter drop-shadow-md"
          >
            ★
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Victory Balloons & Colorful Elements screen overlay */}
      <div className="fixed inset-0 pointer-events-none z-[10010] overflow-hidden">
        <AnimatePresence>
          {victoryBalloons.map((b) => (
            <div
              key={b.id}
              className="absolute pointer-events-none select-none"
              style={{
                left: `${b.x}%`,
                bottom: "-150px",
                animation: `floatUpVictoryBalloon ${b.speed}s ease-out ${b.delay}s 1 forwards`,
              }}
            >
              <div 
                className="flex flex-col items-center"
                style={{
                  animation: `driftSide 3s ease-in-out infinite`
                }}
              >
                {b.type === "paper" ? (
                  <div
                    style={{
                      width: `${10 + Math.random() * 12}px`,
                      height: `${24 + Math.random() * 18}px`,
                      backgroundColor: b.color,
                      borderRadius: "3px",
                      transform: `rotate(${Math.random() * 360}deg)`,
                      animation: `flutterPaper ${1 + Math.random() * 1.2}s linear infinite`,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                    }}
                  />
                ) : b.type === "balloon" ? (
                  <>
                    <div
                      className="w-16 h-20 rounded-full flex items-center justify-center text-white font-extrabold text-3xl border-3 border-[#4D2B82] shadow-lg relative"
                      style={{ backgroundColor: b.color }}
                    >
                      {b.label}
                      <div
                        className="absolute bottom-[-6px] left-0 right-0 mx-auto w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6"
                        style={{ borderTopColor: b.color }}
                      />
                    </div>
                    <div className="w-[2px] h-8 bg-gray-400/60" />
                  </>
                ) : b.type === "star" ? (
                  <div
                    className="w-16 h-16 rounded-[30%] flex items-center justify-center text-white font-extrabold text-4xl border-3 border-[#4D2B82] shadow-lg relative"
                    style={{ backgroundColor: b.color }}
                  >
                    <span className="animate-spin-slow">⭐</span>
                  </div>
                ) : b.type === "heart" ? (
                  <div
                    className="w-16 h-16 rounded-[40%] flex items-center justify-center text-white font-extrabold text-4xl border-3 border-[#4D2B82] shadow-lg relative"
                    style={{ backgroundColor: b.color }}
                  >
                    <span className="animate-pulse">❤️</span>
                  </div>
                ) : (
                  /* bubble */
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-3xl border-3 bg-gradient-to-tr from-cyan-300/40 to-pink-300/40 shadow-inner backdrop-blur-xs relative"
                    style={{ borderColor: b.color }}
                  >
                    <span>✨</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Confetti Explosion (rendered when victory modal is open) - z-index raised to 10020 */}
      <div className="fixed inset-0 pointer-events-none z-[10020] overflow-hidden">
        <AnimatePresence>
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              initial={{ left: c.startX, top: c.startY, rotate: 0, scale: 0 }}
              animate={{ 
                left: [c.startX, c.peakX, c.endX],
                top: [c.startY, c.peakY, c.endY],
                rotate: [0, c.spin / 2, c.spin],
                scale: [0, 1.2, 1, 0.8]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: c.duration, 
                ease: "easeOut",
                delay: c.delay
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
        </AnimatePresence>
      </div>

      {/* 1. Loading Screen with custom Star Mascot */}
      {isLoadingGame && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#FFE3E3] via-white to-[#E3F2FD] z-[10030] flex flex-col items-center justify-center p-6 select-none">
          <div className="text-center max-w-md w-full flex flex-col items-center gap-6">
            <SproutMascot className="w-48 h-48" state="talking" />
            
            <div className="text-right w-full">
              <h3 className="text-2xl font-black text-[#4D2B82] text-center mb-1">
                جاري تحميل مغامرة بلومي السحرية...
              </h3>
              <p className="text-sm font-bold text-purple-400 text-center">
                استعد للمتعة واللعب بالنجوم! ✨
              </p>
            </div>

            {/* Bouncy Progress Bar */}
            <div className="w-full bg-purple-100 h-6 rounded-full border-3 border-[#4D2B82] overflow-hidden p-0.5 shadow-md relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-pink-400 via-yellow-400 to-emerald-400 rounded-full"
                style={{ width: `${loadingProgress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-[#4D2B82]">
                {loadingProgress}%
              </span>
            </div>
          </div>
        </div>
      )}



      {/* Global Star Indicator Header */}
      {activeGame === "menu" && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white border-3 border-[#4D2B82] rounded-[24px] p-6 mb-12 shadow-[0_6px_0_0_#4D2B82] gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#E8F5E9] border-2 border-[#4CAF50] flex items-center justify-center text-2xl">
            🎮
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-extrabold text-[#4D2B82]">منطقة الألعاب السحرية</h2>
            <p className="text-sm font-bold text-purple-400">العب، تعلّم، واكسب النجوم الحقيقية لبروفايلك!</p>
          </div>
        </div>

        {/* Global Score Bubble */}
        <motion.div
          id="global-star-bubble"
          animate={isStarCounterBouncing ? { scale: [1, 1.35, 1.05, 1] } : { scale: [1, 1.05, 1] }}
          transition={isStarCounterBouncing ? { duration: 0.3 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex items-center gap-2 bg-[#FFFDE6] border-2 border-[#D97706] text-[#D97706] font-extrabold text-xl px-6 py-2.5 rounded-full shadow-inner select-none"
        >
          <span className="text-2xl text-yellow-400 animate-spin-slow">★</span>
          <span>مجموع نجومك: {globalStars}</span>
        </motion.div>
      </div>
      )}

      {/* 3. Themed Level Map Screen */}
      {activeGame !== "menu" && showLevelMap && (() => {
        const theme = getMapTheme();
        return (
          <div className={`relative min-h-[500px] w-full max-w-4xl mx-auto rounded-[32px] border-4 border-[#4D2B82] ${theme.bgClass} p-8 overflow-hidden shadow-2xl flex flex-col items-center justify-between text-white font-extrabold select-none z-10`}>
            
            {/* Background elements / Floating clouds */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-10 left-10 text-6xl animate-pulse">☁️</div>
              <div className="absolute bottom-10 right-20 text-6xl animate-pulse">☁️</div>
              <div className="absolute top-1/2 left-1/3 text-4xl">✨</div>
              <div className="absolute bottom-1/3 right-1/4 text-4xl">✨</div>
              {theme.decor.map((emoji, i) => (
                <span 
                  key={i} 
                  className="absolute text-5xl opacity-40 animate-bounce" 
                  style={{
                    left: `${15 + i * 20}%`, 
                    top: `${20 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            {/* Header: Title and mascot welcoming them */}
            <div className="w-full flex items-center justify-between border-b-2 border-white/20 pb-4 relative z-10">
              <button 
                onClick={() => {
                  setShowLevelMap(false);
                  setActiveGame("menu");
                  unlockOrientation();
                }}
                className="btn-bubbly-secondary text-sm py-2 px-5 text-[#4D2B82] bg-white rounded-full flex items-center gap-1 cursor-pointer border-2 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-[0_0_0_0_#4D2B82] transition-all"
              >
                <span>🏠 العودة للقائمة</span>
              </button>

              <div className="text-center flex-1">
                <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  {theme.name}
                </h2>
                <p className="text-xs sm:text-sm text-white/95 mt-1 font-bold">
                  {theme.title}
                </p>
              </div>

              {/* Star Mascot small inside header */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex items-center gap-2">
                <SproutMascot className="w-12 h-12" state="idle" />
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-yellow-300 font-bold block">مساعدك السحري ⭐</span>
                  <span className="text-xs font-black">اختر مستوى للبدء!</span>
                </div>
              </div>
            </div>

            {/* Horizontal Scrollable 100-Level winding Map Path */}
            {(() => {
              const totalLevels = 100;
              const levels = Array.from({ length: totalLevels }).map((_, idx) => {
                const lvlNum = idx + 1;
                const x = 100 + idx * 180;
                const y = 160 + Math.sin(idx * 0.7) * 90; // smooth sine wave
                
                // Determine difficulty
                const difficulty = lvlNum <= 25 ? "level1" : lvlNum <= 50 ? "level2" : lvlNum <= 75 ? "level3" : "level4";
                
                // Lock system: Level 1 is always unlocked. Any other is unlocked if the previous has >= 1 star.
                const isLocked = lvlNum === 1 ? false : (() => {
                  const prevStarKey = `bloomly_stars_${activeGame}_level_${lvlNum - 1}`;
                  const prevStars = parseInt(localStorage.getItem(prevStarKey) || "0", 10);
                  return prevStars === 0;
                })();

                return { x, y, label: `المستوى ${lvlNum}`, difficulty, lvlNum, isLocked };
              });

              // Construct winding connecting path line
              let pathD = `M ${levels[0].x} ${levels[0].y}`;
              for (let i = 1; i < levels.length; i++) {
                const prev = levels[i - 1];
                const curr = levels[i];
                const cpX1 = prev.x + 90;
                const cpY1 = prev.y;
                const cpX2 = curr.x - 90;
                const cpY2 = curr.y;
                pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
              }

              return (
                <div className="relative w-full overflow-hidden select-none">
                  {/* Left Floating Arrow button to navigate left */}
                  <button 
                    onClick={() => {
                      if (mapScrollRef.current) {
                        mapScrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
                      }
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#4D2B82] border-3 border-[#4D2B82] shadow-lg flex items-center justify-center text-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    title="السابق"
                  >
                    ◀
                  </button>

                  {/* Right Floating Arrow button to navigate right */}
                  <button 
                    onClick={() => {
                      if (mapScrollRef.current) {
                        mapScrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#4D2B82] border-3 border-[#4D2B82] shadow-lg flex items-center justify-center text-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    title="التالي"
                  >
                    ▶
                  </button>

                  <div 
                    ref={mapScrollRef} 
                    className="w-full overflow-x-auto scrollbar-none py-10 relative select-none z-10 cursor-grab active:cursor-grabbing"
                  >
                    <div 
                      className="relative h-[320px]" 
                      style={{ width: `${totalLevels * 180 + 200}px` }}
                    >
                      {/* SVG Connecting Path */}
                      <svg 
                        className="absolute inset-0 h-full stroke-white/35 stroke-[8px] fill-none pointer-events-none z-0"
                        style={{ width: `${totalLevels * 180 + 200}px` }}
                      >
                        <path d={pathD} strokeDasharray="12, 16" strokeLinecap="round" />
                      </svg>

                      {/* Nodes mapping */}
                      {levels.map((node, idx) => {
                        const starKey = `bloomly_stars_${activeGame}_level_${node.lvlNum}`;
                        const stars = parseInt(localStorage.getItem(starKey) || "0", 10);
                        
                        return (
                          <motion.button
                            key={idx}
                            id={`level-node-${node.lvlNum}`}
                            disabled={node.isLocked}
                            whileHover={node.isLocked ? {} : { scale: 1.15 }}
                            whileTap={node.isLocked ? {} : { scale: 0.95 }}
                            onClick={() => {
                              setActiveDifficulty(node.difficulty as any);
                              setSelectedLevelIndex(node.lvlNum);
                              setShowLevelMap(false);
                              
                              // Trigger specific game startup
                              if (activeGame === "math") startMathGame();
                              else if (activeGame === "spelling") startSpellingGame();
                              else if (activeGame === "memory") initMemoryGame();
                              else if (activeGame === "arrowRacer") startRacerGame();
                              else if (activeGame === "tapRacer") startTapRacerGame();
                              else {
                                // Generic start mapping for other games
                                if (activeGame === "catcher") startCatcherGame();
                                else if (activeGame === "coloring") startColoringGame();
                                else if (activeGame === "spellingEn") startSpellingEnGame();
                                else if (activeGame === "sorting") startSortingGame();
                                else if (activeGame === "spaceCatcher") startSpaceCatcherGame();
                                else if (activeGame === "connectDots") startConnectDotsGame();
                                else if (activeGame === "maze") startMazeGame();
                                else if (activeGame === "safari") startSafariGame();
                                else if (activeGame === "chef") startChefGame();
                                else if (activeGame === "farm") startFarmGame();
                                else if (activeGame === "train") startTrainGame();
                              }
                            }}
                            className={`absolute w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 ${theme.nodeBg} shadow-[0_8px_0_0_#4D2B82] flex flex-col items-center justify-center cursor-pointer transition-all active:translate-y-1 active:shadow-[0_4px_0_0_#4D2B82] ${node.isLocked ? "opacity-50 cursor-not-allowed filter grayscale" : ""}`}
                            style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
                          >
                            {node.isLocked ? (
                              <span className="text-2xl sm:text-3xl mb-0.5">🔒</span>
                            ) : (
                              <span className="text-2xl sm:text-3xl mb-0.5">{theme.nodeEmoji}</span>
                            )}
                            <span className="text-[10px] sm:text-xs font-black tracking-tight">{node.label}</span>
                            
                            {/* Render Star progress */}
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[1, 2, 3].map((s) => (
                                <span 
                                  key={s} 
                                  className={`text-[10px] ${s <= stars ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Footer tips */}
            <div className="w-full text-center text-xs text-white/85 bg-black/15 py-2 px-6 rounded-full border border-white/10 relative z-10">
              💡 نصيحة سحرية: احصل على ٣ نجوم في كل مستوى لتثبت جدارتك وتتفوق على الجميع!
            </div>
          </div>
        );
      })()}

      {/* --- MENU VIEW --- */}
      {activeGame === "menu" && (
        <div className="flex flex-col gap-6 w-full">
          {/* Sprout Mascot Welcome Card */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-bubbly bg-gradient-to-r from-emerald-50/70 to-green-50/70 border-3 border-emerald-400 p-5 flex items-center justify-between gap-4 select-none"
          >
            <div className="flex items-center gap-3">
              <SproutMascot className="w-16 h-16" state="idle" />
              <div className="text-right flex-1">
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  صديقك برعم يرحب بك! 👋
                </span>
                <p className="text-sm font-extrabold text-[#4D2B82] mt-2">
                  "أهلاً بك يا بطل! اختر لعبة لكي نلعب ونجمع النجوم السحرية معاً!"
                </p>
              </div>
            </div>
            <button 
              onClick={() => sfx.speakArabic("أهلاً بك يا بطل! اختر لعبة لكي نلعب ونجمع النجوم السحرية معاً!")}
              className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-purple-900 flex items-center justify-center text-lg shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="استمع لصوت برعم 🔊"
            >
              🔊
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Game 1 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none"
                          >🍎</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">حديقة الحساب السريع</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">مسائل حسابية وعد مبسطة للأطفال الأذكياء.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("math"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 2 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.div 
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-red-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-[0_4px_0_0_#4D2B82] border-3 border-[#4D2B82] mb-4 select-none"
                            style={{ animationDelay: "0.5s" }}
                          >
                            أ ب ت
                          </motion.div>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">مغامرة الحروف والكلمات</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">تعرف على الحرف الأول للحيوانات والأشكال.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("spelling"))}
                            className="w-full btn-bubbly-purple mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 3 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ rotateY: [0, 180, 360] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none"
                          >🃏</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">كروت الذاكرة السحرية</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">طابق كروت الحيوانات المتشابهة لتفوز.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("memory"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 4 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none"
                          >🎈</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">صائد النجوم والبالونات</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">اختبر سرعتك وصِد البالونات والنجوم الطائرة.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("catcher"))}
                            className="w-full btn-bubbly-purple mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 5 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none"
                          >🎨</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">ورشة الفنان للتلوين</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">لوّن الأشكال الكرتونية الجميلة أو ارسم بحرية.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("coloring"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 6 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-red-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-[0_4px_0_0_#4D2B82] border-3 border-[#4D2B82] mb-4 select-none font-sans" 
                            style={{ animationDelay: "2.5s" }}
                          >
                            abc
                          </motion.div>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">مغامرة الحروف (EN)</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">تعرّف على الحرف الأول للكلمات بالإنجليزية.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("spellingEn"))}
                            className="w-full btn-bubbly-purple mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 7 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.div 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            className="relative w-16 h-18 flex items-center justify-center mb-4 select-none"
                          >
                            <span className="text-5xl z-10">🤖</span>
                            <span className="absolute text-xl top-[-10px] right-[-10px] animate-bounce">🦁</span>
                            <span className="absolute text-xl top-[-10px] left-[-10px] animate-bounce" style={{ animationDelay: "0.4s" }}>أ</span>
                            <span className="absolute text-xl bottom-[-6px] left-[50%] -translate-x-1/2 animate-bounce" style={{ animationDelay: "0.8s" }}>7</span>
                          </motion.div>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">تصنيف بلومي السحري</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">صنّف الكائنات السحرية داخل السلال المناسبة.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("sorting"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 8 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.div 
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
                            className="relative w-14 h-18 flex flex-col items-center mb-4 select-none z-10"
                          >
                            <div className="text-5xl animate-bounce" style={{ animationDuration: '3s' }}>☄️</div>
                          </motion.div>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">صائد الحروف الفضائي</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">انطلق في الفضاء وصِد النيازك التي تحمل الحروف!</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("spaceCatcher"))}
                            className="w-full btn-bubbly-purple mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 9 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ x: [0, 3, -3, 0], y: [0, -3, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none"
                          >✏️</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">توصيل الأرقام السحرية</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">وصّل النقاط بالترتيب الرقمي لتكشف الشكل السري.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("connectDots"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 10 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="text-5xl mb-4 select-none"
                          >🌀</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">متاهة بلومي السحرية</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">وجّه البطل في المتاهة وجمّع النجوم الطائرة لتصل للهدف.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("maze"))}
                            className="w-full btn-bubbly-purple mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 11 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none"
                          >🎵</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">سفاري الأصوات السحرية</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">استمع للأصوات الطبيعية والحيوانات لتكشف سرها.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("safari"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 12 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none"
                          >🧁</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">مطبخ الحلوى السحري</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">اخلط المكونات بالترتيب لتصنع أشهى الحلوى السحرية.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("chef"))}
                            className="w-full btn-bubbly-purple mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 13 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none inline-block"
                          >🏍️</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">سباق الاتجاهات الخارق</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">وجّه الموتوسيكل بالأسهم الصحيحة ليتفادى العقبات ويفوز!</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("arrowRacer"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 14 Card (formerly 13) */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none inline-block"
                          >🐼</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">مزرعة الحيوانات الجائعة</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">أطعم الحيوانات طعامها المفضل لتكسب النجوم.</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("farm"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 14 Card */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ x: [0, -5, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none inline-block"
                          >🚂</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">قطار الأشكال السحري</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">ركّب الأشكال الناقصة في القطار ليتحرك بسرعة!</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("train"))}
                            className="w-full btn-bubbly-purple mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 15 Card: Tap Racer */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
            >
              <motion.span 
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-5xl mb-4 select-none inline-block"
              >⚡</motion.span>
              <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">سباق الضغط السريع</h3>
              <p className="text-sm font-medium text-purple-400 mb-4">اضغط بأسرع ما يمكن لتفوز بسباق السباحة، الدراجات، الجري والبالونات!</p>
              <button
                onClick={() => requireProfile(() => startLoadingAndOpenMap("tapRacer"))}
                className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
              >
                العب الآن 🚀
              </button>
            </motion.div>

            {/* Game 16 Card: Quran */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none inline-block"
                          >🕋</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">جزيرة القرآن الكريم</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">حفظ قصار السور بالتكرار التفاعلي مع تلاوة بصوتك!</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("quran"))}
                            className="w-full btn-bubbly-primary mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>

            {/* Game 16 Card: Stories */}
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="card-bubbly p-6 flex flex-col items-center text-center bg-white cursor-default select-none"
                        >
                          <motion.span 
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="text-5xl mb-4 select-none inline-block"
                          >📚</motion.span>
                          <h3 className="text-xl font-extrabold text-[#4D2B82] mb-2">قصص بلومي التفاعلية</h3>
                          <p className="text-sm font-medium text-purple-400 mb-4">قصص مصورة هادفة مع خاصية تتبع الكلمات مسموعة!</p>
                          <button
                            onClick={() => requireProfile(() => startLoadingAndOpenMap("stories"))}
                            className="w-full btn-bubbly-purple mt-auto text-sm py-2.5"
                          >
                            العب الآن 🚀
                          </button>
                        </motion.div>
          </div>
        </div>
      )}

      {/* --- MATH GAME PLAY VIEW --- */}
      {activeGame === "math" && !showLevelMap && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-6">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            
            <div className="font-extrabold text-[#4D2B82]">
              السؤال {mathRound} من 5
            </div>
            
            <div className="text-sm font-bold text-green-500">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-2xl font-extrabold text-[#4D2B82] text-center mb-8">
            {mathQuestion.text}
          </h3>

          {/* Visual Display */}
          {mathQuestion.emojis && (
            <div className="bg-[#FAF7FD] border-3 border-dashed border-[#4D2B82]/20 rounded-2xl p-8 text-center text-4xl tracking-widest mb-10 select-none">
              {mathQuestion.emojis}
            </div>
          )}

          {/* Feedback Overlay */}
          <AnimatePresence>
            {mathFeedback !== "idle" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-x-0 top-[40%] mx-auto w-48 py-3 rounded-full text-center font-extrabold text-lg border-3 z-30 shadow-md select-none"
                style={{
                  backgroundColor: mathFeedback === "correct" ? "#E8F5E9" : "#FFEBEE",
                  color: mathFeedback === "correct" ? "#2E7D32" : "#C62828",
                  borderColor: mathFeedback === "correct" ? "#2E7D32" : "#C62828",
                }}
              >
                {mathFeedback === "correct" ? "🎉 إجابة صحيحة! +1 ⭐" : "😢 إجابة خاطئة!"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choices Grid */}
          <div className="grid grid-cols-2 gap-4">
            {mathQuestion.options.map((option, idx) => {
              const isSelected = mathSelectedOption === option;
              const isCorrect = option === mathQuestion.correct;
              
              let btnClass = "btn-bubbly-secondary text-2xl py-6";
              if (isSelected) {
                btnClass = isCorrect
                  ? "w-full rounded-full border-3 border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32] py-6 font-extrabold text-2xl shadow-[0_4px_0_0_#2E7D32]"
                  : "w-full rounded-full border-3 border-[#C62828] bg-[#FFEBEE] text-[#C62828] py-6 font-extrabold text-2xl shadow-[0_4px_0_0_#C62828] animate-shake";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleMathAnswer(option)}
                  disabled={mathSelectedOption !== null}
                  className={btnClass}
                >
                  {option}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* --- SPELLING GAME PLAY VIEW --- */}
      {activeGame === "spelling" && !showLevelMap && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-6">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            
            <div className="font-extrabold text-[#4D2B82]">
              السؤال {spellingRound} من 5
            </div>
            
            <div className="text-sm font-bold text-green-500">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-[#4D2B82] text-center mb-6">
            {spellingQuestion.qType === "letter" ? "ما هو الحرف الأول لاسم الشكل التالي؟" : "ما اسم الشكل التالي؟"}
          </h3>

          {/* Emoji/Word Area */}
          <div className="flex flex-col items-center bg-[#FAF7FD] border-3 border-dashed border-[#4D2B82]/20 rounded-2xl p-6 mb-8 select-none">
            <span className="text-7xl mb-2 animate-bounce-slow">{spellingQuestion.emoji}</span>
            {spellingSelected !== null ? (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-extrabold text-purple-600"
              >
                {spellingQuestion.word}
              </motion.span>
            ) : (
              spellingQuestion.qType === "word" ? (
                <span className="text-2xl font-extrabold text-purple-300 tracking-widest select-none">
                  {spellingQuestion.word.split("").map(() => "❓").join(" ")}
                </span>
              ) : null
            )}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {spellingFeedback !== "idle" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-x-0 top-[40%] mx-auto w-48 py-3 rounded-full text-center font-extrabold text-lg border-3 z-30 shadow-md select-none"
                style={{
                  backgroundColor: spellingFeedback === "correct" ? "#E8F5E9" : "#FFEBEE",
                  color: spellingFeedback === "correct" ? "#2E7D32" : "#C62828",
                  borderColor: spellingFeedback === "correct" ? "#2E7D32" : "#C62828",
                }}
              >
                {spellingFeedback === "correct" ? "🎉 أحسنت! +1 ⭐" : "😢 حاول مرة أخرى!"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choices Grid */}
          <div className="grid grid-cols-2 gap-4">
            {spellingQuestion.options.map((letter, idx) => {
              const isSelected = spellingSelected === letter;
              const isCorrect = letter === spellingQuestion.correctLetter;
              
              let btnClass = spellingQuestion.qType === "letter" 
                ? "btn-bubbly-secondary text-3xl py-6" 
                : "btn-bubbly-secondary text-xl sm:text-2xl py-4 sm:py-6";
              if (isSelected) {
                btnClass = isCorrect
                  ? `w-full rounded-full border-3 border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32] py-4 sm:py-6 font-extrabold shadow-[0_4px_0_0_#2E7D32] ${spellingQuestion.qType === "letter" ? "text-3xl" : "text-xl sm:text-2xl"}`
                  : `w-full rounded-full border-3 border-[#C62828] bg-[#FFEBEE] text-[#C62828] py-4 sm:py-6 font-extrabold shadow-[0_4px_0_0_#C62828] animate-shake ${spellingQuestion.qType === "letter" ? "text-3xl" : "text-xl sm:text-2xl"}`;
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSpellingAnswer(letter)}
                  disabled={spellingSelected !== null}
                  className={btnClass}
                >
                  {spellingQuestion.qType === "letter" ? `الحرف ( ${letter} )` : letter}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* --- MEMORY GAME PLAY VIEW --- */}
      {activeGame === "memory" && !showLevelMap && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-8">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            
            <div className="font-extrabold text-[#4D2B82]">
              تطابق الكروت السحرية 🧠
            </div>
            
            <div className="text-sm font-bold text-green-500">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-4 gap-4 justify-items-center">
            {memoryCards.map((card) => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={{ scale: isRevealed ? 1 : 1.05 }}
                  className={`w-16 h-20 sm:w-24 sm:h-28 rounded-2xl border-3 border-[#4D2B82] flex items-center justify-center text-4xl cursor-pointer select-none transition-all duration-300 shadow-sm ${
                    isRevealed
                      ? "bg-white rotate-y-180"
                      : "bg-gradient-to-tr from-purple-400 to-[#A855F7] shadow-[0_4px_0_0_#4D2B82]"
                  }`}
                >
                  {isRevealed ? (
                    <span className="animate-wiggle">{card.emoji}</span>
                  ) : (
                    <span className="text-white text-2xl font-bold">❓</span>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>
      )}

      {/* --- BALLOON & STAR CATCHER GAME PLAY VIEW --- */}
      {activeGame === "catcher" && !showLevelMap && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            
            <div className="bg-red-50 border border-red-200 text-red-500 font-extrabold px-4 py-1 rounded-full text-sm">
              ⏱️ الوقت المتبقي: {catchTimeLeft}ث
            </div>

            <div className="bg-yellow-50 border border-yellow-200 text-[#D97706] font-extrabold px-4 py-1 rounded-full text-sm">
              🎈 النتيجة: {catchScore}
            </div>
          </div>

          {/* Gameplay Container */}
          <div 
            ref={catcherContainerRef}
            className="w-full h-[380px] bg-gradient-to-b from-[#E3F2FD] to-[#BBDEFB] border-3 border-[#4D2B82] rounded-2xl relative overflow-hidden select-none cursor-crosshair z-10"
          >
            
            {/* Background Clouds */}
            <div className="absolute top-[8%] left-[8%] text-white/40 text-4xl pointer-events-none select-none animate-pulse">☁️</div>
            <div className="absolute top-[18%] right-[12%] text-white/35 text-5xl pointer-events-none select-none animate-pulse" style={{ animationDelay: "1s" }}>☁️</div>
            <div className="absolute top-[50%] left-[15%] text-white/30 text-3xl pointer-events-none select-none animate-pulse" style={{ animationDelay: "2s" }}>☁️</div>
            <div className="absolute top-[35%] left-[60%] text-white/25 text-4xl pointer-events-none select-none animate-pulse" style={{ animationDelay: "1.5s" }}>☁️</div>
            <div className="absolute top-[65%] right-[25%] text-white/20 text-3xl pointer-events-none select-none animate-pulse" style={{ animationDelay: "0.5s" }}>☁️</div>

            {/* 3-2-1 Bouncy Countdown Overlay */}
            {catcherCountdown !== null && (
              <div className="absolute inset-0 bg-[#4D2B82]/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-40 select-none">
                <motion.div
                  key={catcherCountdown}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-white font-extrabold text-7xl select-none"
                  style={{ textShadow: "0 4px 0 #3b1d6b" }}
                >
                  {catcherCountdown === "GO" ? "انطلق! 🚀" : catcherCountdown}
                </motion.div>
                <div className="text-yellow-200 font-extrabold text-base sm:text-lg mt-6 animate-pulse select-none">
                  صِد البالونات والنجوم! وتجنب السحب الرعدية! ⛈️
                </div>
              </div>
            )}

            {/* Click-floating score indicators */}
            <AnimatePresence>
              {floatingScores.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 1, y: `${f.y}%`, x: `${f.x}%`, scale: 0.5 }}
                  animate={{ opacity: 0, y: `${f.y - 12}%`, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute pointer-events-none font-extrabold text-xl z-50 text-[#E01E5A]"
                  style={{ textShadow: "1px 1px 0 white, -1px -1px 0 white" }}
                >
                  {f.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Game Floating items with enlarged click area */}
            {catchItems.map((item) => (
              <div
                key={item.id}
                onClick={(e) => handleCatcherItemClick(e, item)}
                onAnimationEnd={() => handleItemAnimationEnd(item.id)}
                className={`absolute w-20 h-20 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 z-30 ${
                  item.type === "star" ? "catch-fall-down" : "catch-float-up"
                }`}
                style={{
                  left: `${item.x}%`,
                  animationDuration: `${item.duration || 6}s`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className={`select-none pointer-events-none text-4xl ${
                  item.type === "star" ? "animate-catcher-spin" : "animate-catcher-wobble"
                }`}>
                  {item.emoji}
                </span>
              </div>
            ))}

          </div>

        </div>
      )}

      {/* --- ENGLISH SPELLING GAME PLAY VIEW --- */}
      {activeGame === "spellingEn" && !showLevelMap && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-8 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-6">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج (Exit)</span>
            </button>
            <div className="font-extrabold text-[#4D2B82] font-sans">
              Round {spellingEnRound} of 5
            </div>
            <div className="text-sm font-bold text-green-500">
              ⭐ نجوم: {starsEarnedThisSession}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#4D2B82] text-center mb-2 font-sans">
            {spellingEnQuestion.qType === "letter" ? "What is the first letter of this picture? 🤔" : "What is the name of this picture? 🤔"}
          </h3>
          <p className="text-xs font-bold text-[#6B4E9E] text-center mb-6">
            {spellingEnQuestion.qType === "letter" ? "ما هو الحرف الأول لهذه الصورة باللغة الإنجليزية؟" : "ما اسم هذه الصورة باللغة الإنجليزية؟"}
          </p>

          {/* Visual Display */}
          <div className="bg-[#FAF7FD] border-3 border-dashed border-[#4D2B82]/20 rounded-2xl p-6 text-center text-8xl mb-6 select-none">
            {spellingEnQuestion.emoji}
          </div>

          {/* Hint Word with blank */}
          <div className="text-center font-bold text-purple-400 text-lg mb-6 select-none font-sans tracking-widest uppercase">
            {spellingEnQuestion.qType === "letter" ? (
              <>_ {spellingEnQuestion.word.substring(1)}</>
            ) : (
              spellingEnSelected !== null ? (
                <span className="text-purple-600">{spellingEnQuestion.word}</span>
              ) : (
                spellingEnQuestion.word.split("").map(() => "❓").join(" ")
              )
            )}
          </div>

          {/* Feedback Overlay */}
          <AnimatePresence>
            {spellingEnFeedback !== "idle" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-x-0 top-[40%] mx-auto w-48 py-3 rounded-full text-center font-extrabold text-lg border-3 z-30 shadow-md select-none font-sans"
                style={{
                  backgroundColor: spellingEnFeedback === "correct" ? "#EAFDF3" : "#FFEBEB",
                  borderColor: spellingEnFeedback === "correct" ? "#2ECC71" : "#EF4444",
                  color: spellingEnFeedback === "correct" ? "#198754" : "#EF4444",
                }}
              >
                {spellingEnFeedback === "correct" ? "Excellent! 🎉" : "Try Again! ❌"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {spellingEnQuestion.options.map((option) => {
              const isSelected = spellingEnSelected === option;
              const isCorrect = option === spellingEnQuestion.correctLetter;
              
              let btnClass = "bg-white text-[#4D2B82] border-gray-200 hover:bg-gray-50 hover:scale-105 active:scale-95";
              if (spellingEnSelected !== null) {
                if (isSelected) {
                  btnClass = isCorrect
                    ? "bg-[#2ECC71] text-white border-[#198754] scale-105"
                    : "bg-[#EF4444] text-white border-[#C53030]";
                } else if (isCorrect) {
                  btnClass = "bg-[#2ECC71]/20 text-[#198754] border-[#198754]/30";
                }
              }

              const isWordType = spellingEnQuestion.qType === "word";

              return (
                <button
                  key={option}
                  onClick={() => handleSpellingEnAnswer(option)}
                  disabled={spellingEnSelected !== null}
                  className={`card-bubbly p-5 font-extrabold border-3 rounded-2xl flex items-center justify-center transition-all duration-150 cursor-pointer font-sans ${isWordType ? "text-xl sm:text-2xl" : "text-4xl"} ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- ART COLORING GAME PLAY VIEW --- */}
      {activeGame === "coloring" && !showLevelMap && (
        <div className="card-bubbly bg-white max-w-3xl mx-auto p-6 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-[#4D2B82]">
              🎨 ورشة الفنان للتلوين السحري
            </div>
            <div className="text-sm font-bold text-green-500">
              ⭐ نجوم: {starsEarnedThisSession}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Sidebar Tools - 4 cols */}
            <div className="md:col-span-4 flex flex-col gap-4">
              
              {/* Template Picker */}
              <div className="bg-[#FAF7FD] border-2 border-purple-100 rounded-2xl p-3">
                <span className="text-xs font-extrabold text-[#4D2B82] block mb-2 text-right">اختر شكلاً لتلوينه:</span>
                <div className="grid grid-cols-2 gap-2">
                  {coloringTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        playBubbleSound();
                        setActiveTemplate(t.id as any);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border-2 flex flex-col items-center gap-1 cursor-pointer ${
                        activeTemplate === t.id
                          ? "border-[#A855F7] bg-purple-50 text-[#A855F7]"
                          : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="text-[10px]">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-[#FAF7FD] border-2 border-purple-100 rounded-2xl p-3">
                <span className="text-xs font-extrabold text-[#4D2B82] block mb-2 text-right">اختر لون الفرشاة:</span>
                <div className="grid grid-cols-4 gap-2">
                  {coloringColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        playBubbleSound();
                        setCurrentColor(color);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        currentColor === color 
                          ? "scale-110 border-[#4D2B82] shadow-md" 
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color === "#FFFFFF" ? "ممحاة" : color}
                    />
                  ))}
                </div>
                
                {/* Brush size slider */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#6B4E9E] mb-1">
                    <span>حجم الفرشاة:</span>
                    <span>{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#A855F7]"
                  />
                </div>
              </div>

              {/* Utility controls */}
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button
                  onClick={() => {
                    playBubbleSound();
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        if (activeTemplate !== "free") {
                          drawTemplateOutline(canvas, activeTemplate);
                        }
                      }
                    }
                  }}
                  className="btn-bubbly-secondary text-xs py-2 px-1.5 flex items-center justify-center gap-1 cursor-pointer"
                >
                  🧹 مسح الكل
                </button>
                
                <button
                  onClick={() => {
                    // Win 5 stars for coloring!
                    addStars(5);
                    triggerVictory();
                  }}
                  className="btn-bubbly-primary text-xs py-2 px-1.5 flex items-center justify-center gap-1 cursor-pointer"
                >
                  🎉 إنهاء ورسم
                </button>
              </div>
            </div>

            {/* Canvas Area - 8 cols */}
            <div className="md:col-span-8 flex flex-col justify-center">
              <div className="relative w-full aspect-[4/3] bg-white border-3 border-[#4D2B82] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center select-none cursor-crosshair">
                
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full z-10"
                />

                {/* Outline is drawn directly on the canvas */}
              </div>
              <p className="text-[10px] font-bold text-purple-400 text-center mt-2">
                💡 استخدم الماوس أو اللمس للرسم وتلوين الأشكال السحرية!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- MAGIC SORTING BASKET PLAY VIEW --- */}
      {activeGame === "sorting" && !showLevelMap && sortingItem && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-8 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-6">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-[#4D2B82]">
              الجولة {sortingRound} من 5
            </div>
            <div className="text-sm font-bold text-green-500">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-[#4D2B82] text-center mb-8">
            صنّف الكائن السحري! ضع الشيء في سلته الصحيحة 🧺
          </h3>

          {/* Item bubble area */}
          <div className="h-44 flex items-center justify-center mb-10 relative">
            <AnimatePresence mode="wait">
              {sortingFeedback === "idle" && (
                <motion.div
                  key={sortingItem.emoji}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1.1, rotate: 0 }}
                  exit={
                    (sortingFeedback as string) === "correct" 
                      ? { 
                          y: 220, 
                          x: sortingItem.type === "animal" ? 140 : sortingItem.type === "number" ? -140 : 0,
                          scale: 0.4, 
                          opacity: 0, 
                          transition: { duration: 0.8 } 
                        }
                      : { x: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }
                  }
                  className="w-32 h-32 rounded-full bg-purple-50 border-4 border-[#4D2B82] flex flex-col items-center justify-center shadow-[0_6px_0_0_#4D2B82] relative z-20 cursor-pointer"
                >
                  <span className="text-6xl select-none">{sortingItem.emoji}</span>
                  <span className="text-xs font-bold text-purple-400 mt-1 select-none">{sortingItem.name}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Temporary falling item when correct */}
            {sortingFeedback === "correct" && (
              <motion.div
                initial={{ x: 0, y: 0, scale: 1.1, opacity: 1 }}
                animate={{ 
                  y: 220, 
                  x: sortingItem.type === "animal" ? 140 : sortingItem.type === "number" ? -140 : 0,
                  scale: 0.5, 
                  opacity: 0 
                }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                className="w-32 h-32 rounded-full bg-purple-50 border-4 border-[#4D2B82] flex flex-col items-center justify-center shadow-[0_6px_0_0_#4D2B82] absolute z-20"
              >
                <span className="text-6xl">{sortingItem.emoji}</span>
                <span className="text-xs font-bold text-purple-400 mt-1">{sortingItem.name}</span>
              </motion.div>
            )}

            {/* Error shaking item */}
            {sortingFeedback === "wrong" && (
              <motion.div
                animate={{ x: [0, -15, 15, -15, 15, 0] }}
                transition={{ duration: 0.5 }}
                className="w-32 h-32 rounded-full bg-red-50 border-4 border-[#EF4444] flex flex-col items-center justify-center shadow-[0_6px_0_0_#EF4444] absolute z-20"
              >
                <span className="text-6xl">{sortingItem.emoji}</span>
                <span className="text-xs font-bold text-red-400 mt-1">{sortingItem.name}</span>
              </motion.div>
            )}
          </div>

          {/* Feedback Overlay */}
          <AnimatePresence>
            {sortingFeedback !== "idle" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-x-0 top-[40%] mx-auto w-48 py-3 rounded-full text-center font-extrabold text-lg border-3 z-30 shadow-md select-none font-sans"
                style={{
                  backgroundColor: sortingFeedback === "correct" ? "#EAFDF3" : "#FFEBEB",
                  borderColor: sortingFeedback === "correct" ? "#2ECC71" : "#EF4444",
                  color: sortingFeedback === "correct" ? "#198754" : "#EF4444",
                }}
              >
                {sortingFeedback === "correct" ? "🎉 أحسنت! +1 ⭐" : "😢 حاول مرة أخرى!"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Baskets Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            
            {/* Basket 1: Animals */}
            <button
              onClick={() => handleSortingAnswer("animal")}
              disabled={sortingFeedback !== "idle"}
              className={`card-bubbly p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                sortingSelectedBasket === "animal" && sortingFeedback === "correct"
                  ? "bg-green-100 border-green-500 scale-105"
                  : sortingSelectedBasket === "animal" && sortingFeedback === "wrong"
                  ? "bg-red-100 border-red-500 animate-shake"
                  : "bg-amber-50 hover:bg-amber-100 border-amber-300"
              }`}
            >
              <span className="text-4xl mb-2">🦁</span>
              <span className="font-extrabold text-sm text-[#4D2B82]">سلة الحيوانات</span>
            </button>

            {/* Basket 2: Letters */}
            <button
              onClick={() => handleSortingAnswer("letter")}
              disabled={sortingFeedback !== "idle"}
              className={`card-bubbly p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                sortingSelectedBasket === "letter" && sortingFeedback === "correct"
                  ? "bg-green-100 border-green-500 scale-105"
                  : sortingSelectedBasket === "letter" && sortingFeedback === "wrong"
                  ? "bg-red-100 border-red-500 animate-shake"
                  : "bg-blue-50 hover:bg-blue-100 border-blue-300"
              }`}
            >
              <span className="text-4xl mb-2">📚</span>
              <span className="font-extrabold text-sm text-[#4D2B82]">سلة الحروف</span>
            </button>

            {/* Basket 3: Numbers */}
            <button
              onClick={() => handleSortingAnswer("number")}
              disabled={sortingFeedback !== "idle"}
              className={`card-bubbly p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                sortingSelectedBasket === "number" && sortingFeedback === "correct"
                  ? "bg-green-100 border-green-500 scale-105"
                  : sortingSelectedBasket === "number" && sortingFeedback === "wrong"
                  ? "bg-red-100 border-red-500 animate-shake"
                  : "bg-purple-50 hover:bg-purple-100 border-purple-300"
              }`}
            >
              <span className="text-4xl mb-2">🔢</span>
              <span className="font-extrabold text-sm text-[#4D2B82]">سلة الأرقام</span>
            </button>

          </div>
        </div>
      )}

      {/* --- SPACE LETTER CATCHER PLAY VIEW --- */}
      {activeGame === "spaceCatcher" && !showLevelMap && (
        <div className="card-bubbly bg-[#0F172A] max-w-2xl mx-auto p-6 relative overflow-hidden text-white">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fallMeteor {
              0% { transform: translateY(-150px); }
              100% { transform: translateY(450px); }
            }
            .animate-fall-meteor {
              animation-name: fallMeteor;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
              animation-fill-mode: backwards;
            }
            
            /* Twinkling stars */
            .star-bg {
              background-image: 
                radial-gradient(1px 1px at 10% 20%, white, rgba(0,0,0,0)),
                radial-gradient(1.5px 1.5px at 30% 50%, white, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 80% 80%, white, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 90% 10%, white, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 50% 30%, white, rgba(0,0,0,0));
              background-size: 100px 100px;
              animation: twinkle 5s linear infinite;
            }
            @keyframes twinkle {
              0% { opacity: 0.8; }
              50% { opacity: 1; }
              100% { opacity: 0.8; }
            }
          `}} />

          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-white/20 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#FF5A92] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-white">
              الجولة {spaceRound} من 5
            </div>
            <div className="text-sm font-bold text-green-400">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          {/* Instruction Bar */}
          <div className="bg-white/10 border-2 border-white/20 backdrop-blur-md rounded-2xl p-4 mb-4 text-center relative z-20">
            <h3 className="text-xl font-extrabold text-white">
              {spaceTargetType === "letter" && (
                <>اصطد نيزك الحرف العربي: <span className="text-3xl text-[#5BC0F8] ml-2">{spaceTarget}</span></>
              )}
              {spaceTargetType === "letterEn" && (
                <span className="font-sans">Catch English Letter: <span className="text-3xl text-[#5BC0F8] ml-2">{spaceTarget}</span></span>
              )}
              {spaceTargetType === "number" && (
                <>اصطد نيزك الرقم: <span className="text-3xl text-[#5BC0F8] ml-2">{spaceTarget}</span></>
              )}
            </h3>
          </div>

          {/* Feedback Overlay */}
          <AnimatePresence>
            {spaceFeedback !== "idle" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-x-0 top-[40%] mx-auto w-48 py-3 rounded-full text-center font-extrabold text-lg border-3 z-[999] shadow-md select-none font-sans"
                style={{
                  backgroundColor: spaceFeedback === "correct" ? "#EAFDF3" : "#FFEBEB",
                  borderColor: spaceFeedback === "correct" ? "#2ECC71" : "#EF4444",
                  color: spaceFeedback === "correct" ? "#198754" : "#EF4444",
                }}
              >
                {spaceFeedback === "correct" ? "🚀 صيد رائع! +2 ⭐" : "💥 نيزك خاطئ!"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Space Sky Container */}
          <div className="relative w-full h-[400px] bg-slate-900 border-3 border-indigo-500 rounded-[24px] overflow-hidden mb-4 shadow-inner star-bg">
            
            {/* Spaceship at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-6xl drop-shadow-[0_0_15px_rgba(91,192,248,0.8)] z-10">
              🚀
            </div>

            {/* Meteors */}
            <AnimatePresence>
              {spaceMeteors.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ scale: 1, opacity: 1 }}
                  animate={spaceExplodedId === m.id ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleMeteorClick(m.id, m.value)}
                  className="absolute animate-fall-meteor cursor-pointer select-none flex items-center justify-center z-20"
                  style={{
                    left: `${m.x}%`,
                    top: "-50px",
                    animationDuration: `${m.speed}s`,
                    animationDelay: `${m.delay}s`,
                  }}
                >
                  <div className="relative w-16 h-16 flex items-center justify-center group">
                    {/* Fire tail */}
                    <div className="absolute top-[-20px] w-8 h-12 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                    {/* Meteor Rock */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-2xl border-4 border-slate-700 shadow-xl relative z-10"
                      style={{
                        backgroundColor: m.color,
                        fontFamily: spaceTargetType === "letterEn" ? "sans-serif" : "inherit",
                        boxShadow: `inset -5px -5px 15px rgba(0,0,0,0.5)`
                      }}
                    >
                      {m.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>
          <p className="text-[10px] font-bold text-blue-200 text-center">
            💡 ركز جيداً واضغط على النيزك الذي يحمل الهدف الصحيح قبل أن يصطدم بسفينة الفضاء!
          </p>
        </div>
      )}

      {/* --- CONNECT THE DOTS PLAY VIEW --- */}
      {activeGame === "connectDots" && !showLevelMap && dotsShape && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-6 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-[#4D2B82]">
              الجولة {dotsRound} من 5
            </div>
            <div className="text-sm font-bold text-green-500">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-[#4D2B82] text-center mb-6">
            وصّل الأرقام بالترتيب لتكشف الشكل! ✏️
          </h3>

          {/* Feedback Overlay */}
          <AnimatePresence>
            {dotsFeedback !== "idle" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-x-0 top-[40%] mx-auto w-48 py-3 rounded-full text-center font-extrabold text-lg border-3 z-[999] shadow-md select-none font-sans"
                style={{
                  backgroundColor: dotsFeedback === "correct" ? "#EAFDF3" : "#FFEBEB",
                  borderColor: dotsFeedback === "correct" ? "#2ECC71" : "#EF4444",
                  color: dotsFeedback === "correct" ? "#198754" : "#EF4444",
                }}
              >
                {dotsFeedback === "correct" ? "🎉 رائع! +1 ⭐" : "😢 الرقم غير صحيح!"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dots Playing Board */}
          <div className="relative w-full aspect-[4/3] bg-purple-50/50 border-3 border-[#4D2B82]/20 rounded-3xl overflow-hidden mb-6 flex items-center justify-center">
            
            {/* SVG Connecting Lines */}
            <svg 
              viewBox="0 0 400 300" 
              className="w-full h-full absolute inset-0 pointer-events-none z-10"
            >
              {dotsLines.map((line, idx) => (
                <line
                  key={idx}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={dotsShape.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {/* Dotted outlines to guide children */}
            {!dotsRevealed && (
              <svg 
                viewBox="0 0 400 300" 
                className="w-full h-full absolute inset-0 pointer-events-none z-0 opacity-20"
              >
                {/* Draw dotted outline of all points in order */}
                {dotsShape.points.map((p, idx) => {
                  const nextP = dotsShape.points[(idx + 1) % dotsShape.points.length];
                  return (
                    <line
                      key={idx}
                      x1={p.x}
                      y1={p.y}
                      x2={nextP.x}
                      y2={nextP.y}
                      stroke="#4D2B82"
                      strokeWidth="3"
                      strokeDasharray="6, 6"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
            )}

            {/* Dot buttons */}
            {!dotsRevealed && dotsShape.points.map((p) => {
              const isClicked = p.num < dotsNextNum;
              const isNext = p.num === dotsNextNum;

              return (
                <button
                  key={p.num}
                  onClick={() => handleDotClick(p)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-3 flex items-center justify-center font-extrabold text-sm transition-all z-20 cursor-pointer shadow-md select-none ${
                    isClicked
                      ? "bg-green-400 border-[#198754] text-white shadow-inner"
                      : isNext
                      ? "bg-yellow-200 border-[#FF7A00] text-[#FF7A00] scale-110 animate-bounce-slow"
                      : "bg-white border-[#4D2B82] text-[#4D2B82] hover:bg-purple-50"
                  }`}
                  style={{
                    left: `${(p.x / 400) * 100}%`,
                    top: `${(p.y / 300) * 100}%`,
                  }}
                >
                  {p.num}
                </button>
              );
            })}

            {/* Revealing Emoji shape when done */}
            {dotsRevealed && (
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1.5, rotate: 360, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute flex flex-col items-center gap-2 z-30 select-none pointer-events-none"
              >
                <span className="text-8xl filter drop-shadow-md">{dotsShape.emoji}</span>
                <span className="text-lg font-extrabold text-[#4D2B82] bg-white/80 backdrop-blur-sm border-2 border-[#4D2B82]/20 px-3 py-1 rounded-full">{dotsShape.name}</span>
              </motion.div>
            )}

          </div>

          <p className="text-[10px] font-bold text-purple-400 text-center">
            💡 اضغط على الأرقام بالترتيب الرقمي التصاعدي (1 ثم 2 ثم 3...) لتوصيل النقاط!
          </p>
        </div>
      )}

      {/* --- MAZE GAME PLAY VIEW --- */}
      {activeGame === "maze" && !showLevelMap && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-[#4D2B82]">
              الجولة {mazeRound} من 5
            </div>
            <div className="text-sm font-bold text-green-500">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-[#4D2B82] text-center mb-1">
            متاهة بلومي السحرية 🌀
          </h3>
          <p className="text-sm font-bold text-purple-400 text-center mb-4">
            {mazeLevelsBank[(mazeRound - 1) % mazeLevelsBank.length].name}
          </p>

          {/* Success Overlay */}
          <AnimatePresence>
            {mazeFeedback === "success" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-x-0 top-[40%] mx-auto w-56 py-3 rounded-full text-center font-extrabold text-lg border-3 z-[999] shadow-md select-none bg-[#EAFDF3] border-[#2ECC71] text-[#198754] font-sans"
              >
                🎉 رائع! تم حل المتاهة! +2 ⭐
              </motion.div>
            )}
          </AnimatePresence>

          {/* Maze Grid Board */}
          <div className={`relative w-full aspect-square max-w-[360px] mx-auto border-4 border-[#4D2B82] rounded-3xl overflow-hidden p-2 grid grid-cols-6 grid-rows-6 gap-1 shadow-md bg-white select-none ${mazeLevelsBank[(mazeRound - 1) % mazeLevelsBank.length].obstacleBg}`}>
            
            {mazeLevelsBank[(mazeRound - 1) % mazeLevelsBank.length].grid.map((row, y) => 
              row.map((cell, x) => {
                const isObstacle = cell === 1;
                const isPlayer = playerPosition.x === x && playerPosition.y === y;
                const isTarget = x === 5 && y === 5;
                const starStr = `${x},${y}`;
                const hasStar = mazeLevelsBank[(mazeRound - 1) % mazeLevelsBank.length].starPositions.some(sp => sp.x === x && sp.y === y);
                const isStarCollected = collectedStars.includes(starStr);
                const currentLevel = mazeLevelsBank[(mazeRound - 1) % mazeLevelsBank.length];

                const isAdjacent = Math.abs(playerPosition.x - x) + Math.abs(playerPosition.y - y) === 1;

                return (
                  <button
                    key={`${x}-${y}`}
                    onClick={() => {
                      if (isAdjacent && !isObstacle) {
                        movePlayer(x - playerPosition.x, y - playerPosition.y);
                      }
                    }}
                    disabled={isObstacle || mazeFeedback !== "idle"}
                    className={`relative rounded-xl flex items-center justify-center text-2xl transition-all ${
                      isObstacle
                        ? "bg-white/40 cursor-default select-none shadow-sm"
                        : "cursor-pointer hover:bg-black/5"
                    }`}
                  >
                    {!isObstacle && (
                      <div className="absolute inset-0.5 rounded-lg bg-white/60 -z-10" />
                    )}

                    {isObstacle && (
                      <span className="filter drop-shadow-sm select-none scale-110">
                        {currentLevel.obstacleEmoji}
                      </span>
                    )}

                    {isTarget && !isPlayer && (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="filter drop-shadow-md select-none text-3xl"
                      >
                        {currentLevel.targetEmoji}
                      </motion.span>
                    )}

                    {hasStar && !isStarCollected && !isPlayer && (
                      <motion.span
                        animate={{ scale: [0.9, 1.1, 0.9], rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="text-yellow-400 text-lg filter drop-shadow-sm select-none z-10"
                      >
                        ★
                      </motion.span>
                    )}

                    {isPlayer && (
                      <motion.div
                        layoutId="mazePlayer"
                        className="absolute inset-0 flex items-center justify-center text-3xl z-20 select-none filter drop-shadow-md"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {currentLevel.playerEmoji}
                      </motion.div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* D-Pad controls for mobile & ease of play */}
          <div className="mt-6 flex flex-col items-center gap-1.5 select-none relative z-20" dir="ltr">
            <button
              onClick={() => movePlayer(0, -1)}
              disabled={mazeFeedback !== "idle"}
              className="w-14 h-14 bg-purple-100 border-3 border-[#4D2B82] rounded-2xl flex items-center justify-center text-2xl font-bold active:scale-95 transition-all text-[#4D2B82] cursor-pointer shadow-md disabled:opacity-50"
            >
              ⬆️
            </button>
            <div className="flex gap-12">
              <button
                onClick={() => movePlayer(1, 0)}
                disabled={mazeFeedback !== "idle"}
                className="w-14 h-14 bg-purple-100 border-3 border-[#4D2B82] rounded-2xl flex items-center justify-center text-2xl font-bold active:scale-95 transition-all text-[#4D2B82] cursor-pointer shadow-md disabled:opacity-50"
              >
                ⬅️
              </button>
              <button
                onClick={() => movePlayer(0, 1)}
                disabled={mazeFeedback !== "idle"}
                className="w-14 h-14 bg-purple-100 border-3 border-[#4D2B82] rounded-2xl flex items-center justify-center text-2xl font-bold active:scale-95 transition-all text-[#4D2B82] cursor-pointer shadow-md disabled:opacity-50"
              >
                ⬇️
              </button>
              <button
                onClick={() => movePlayer(-1, 0)}
                disabled={mazeFeedback !== "idle"}
                className="w-14 h-14 bg-purple-100 border-3 border-[#4D2B82] rounded-2xl flex items-center justify-center text-2xl font-bold active:scale-95 transition-all text-[#4D2B82] cursor-pointer shadow-md disabled:opacity-50"
              >
                ➡️
              </button>
            </div>
          </div>

          <p className="text-[10px] font-bold text-purple-400 text-center mt-6">
            💡 اضغط على الأزرار الملونة، أو استخدم الأسهم بلوحة المفاتيح، أو اضغط مباشرة على الخلايا المجاورة لمساعدة البطل في الوصول لنهاية المتاهة وتجميع النجوم الطائرة!
          </p>
        </div>
      )}

      {/* --- SOUND SAFARI PLAY VIEW --- */}
      {activeGame === "safari" && !showLevelMap && safariTarget && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-[#4D2B82]">
              الجولة {safariRound} من 5
            </div>
            <div className="text-sm font-bold text-green-500">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-[#4D2B82] text-center mb-6">
            استمع للصوت واختر الصورة الصحيحة! 🔊
          </h3>

          {/* Sound play button */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sfx.playSafariSound(safariTarget.soundId)}
              className="w-28 h-28 bg-[#FFFCE6] border-4 border-[#FF7A00] rounded-full flex items-center justify-center text-4xl shadow-md cursor-pointer animate-pulse animate-bounce-slow"
            >
              🔊
            </motion.button>
            <span className="text-sm font-bold text-[#FF7A00]">اضغط هنا للاستماع للصوت السحري</span>
          </div>

          {/* Feedback Overlay */}
          <AnimatePresence>
            {safariFeedback !== "idle" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-x-0 top-[40%] mx-auto w-48 py-3 rounded-full text-center font-extrabold text-lg border-3 z-30 shadow-md select-none bg-[#EAFDF3] border-[#2ECC71] text-[#198754] font-sans"
                style={{
                  backgroundColor: safariFeedback === "correct" ? "#EAFDF3" : "#FFEBEB",
                  borderColor: safariFeedback === "correct" ? "#2ECC71" : "#EF4444",
                  color: safariFeedback === "correct" ? "#198754" : "#EF4444",
                }}
              >
                {safariFeedback === "correct" ? "🎉 أحسنت! +1 ⭐" : "😢 اختيار خاطئ!"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards Options Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {safariOptions.map((opt) => {
              const isSelected = safariSelectedId === opt.id;
              const isCorrect = safariFeedback === "correct" && opt.id === safariTarget.id;
              const isWrong = safariFeedback === "wrong" && isSelected;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSafariAnswer(opt.id)}
                  disabled={safariFeedback !== "idle"}
                  className={`card-bubbly p-6 flex flex-col items-center justify-center gap-3 cursor-pointer select-none transition-all active:scale-95 ${
                    isCorrect
                      ? "bg-green-100 border-green-500 scale-105"
                      : isWrong
                      ? "bg-red-100 border-red-500 animate-shake"
                      : "bg-[#FDFBFF] hover:bg-purple-50/50 border-[#4D2B82]/20"
                  }`}
                >
                  <span className="text-5xl filter drop-shadow-sm select-none">{opt.emoji}</span>
                  <span className="font-extrabold text-sm text-[#4D2B82]">{opt.name}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[10px] font-bold text-purple-400 text-center">
            💡 اضغط على زر مكبر الصوت الأصفر للاستماع إلى النغمة الموسيقية للحيوان أو القطار، ثم اختر الكارت المطابق له!
          </p>
        </div>
      )}

      {/* --- CANDY CHEF PLAY VIEW --- */}
      {activeGame === "chef" && !showLevelMap && chefRecipe && (
        <div className="card-bubbly bg-white max-w-2xl mx-auto p-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-[#4D2B82]">
              الجولة {chefRound} من 5
            </div>
            <div className="text-sm font-bold text-green-500">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          {/* Recipe Card top banner */}
          <div className="bg-[#FFFCE6] border-3 border-[#FF7A00] rounded-2xl p-4 mb-6 text-center shadow-sm select-none">
            <span className="text-xs font-extrabold text-[#FF7A00] block mb-1">وصفتنا السحرية اليوم 🥣</span>
            <h3 className="text-xl font-extrabold text-[#4D2B82] mb-3">
              {chefRecipe.name}
            </h3>
            
            {/* Step sequence visualization */}
            <div className="flex items-center justify-center gap-4" dir="ltr">
              {chefRecipe.ingredients.map((ing, idx) => {
                const isAdded = chefProgress.length > idx;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <motion.div
                      animate={isAdded ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl shadow-sm ${
                        isAdded 
                          ? "bg-green-100 border-[#2ECC71]" 
                          : "bg-white border-[#4D2B82]/20 opacity-60"
                      }`}
                    >
                      {ing}
                    </motion.div>
                    {idx < 2 && (
                      <span className="text-xl text-[#FF7A00] font-bold">➔</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mixing bowl & final product display */}
          <div className="relative w-full h-44 bg-[#FAF7FD] border-3 border-dashed border-[#4D2B82]/20 rounded-2xl overflow-hidden mb-6 flex items-center justify-center select-none">
            
            {/* Mixing / Success / Wrong Overlays */}
            <AnimatePresence>
              {chefFeedback === "mixing" && (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                  className="text-6xl z-10"
                >
                  🥣
                </motion.div>
              )}

              {chefFeedback === "success" && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1.3, rotate: 0 }}
                  className="flex flex-col items-center gap-1 z-20"
                >
                  <span className="text-7xl filter drop-shadow-md select-none">{chefRecipe.yieldEmoji}</span>
                  <span className="text-xs font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-300">{chefRecipe.yieldName}</span>
                </motion.div>
              )}

              {chefFeedback === "wrong" && (
                <motion.div
                  animate={{ x: [0, -10, 10, -10, 0] }}
                  className="text-6xl text-red-500 z-10"
                >
                  💥
                </motion.div>
              )}

              {chefFeedback === "idle" && chefProgress.length === 0 && (
                <div className="text-center text-purple-300">
                  <span className="text-5xl block mb-1">🥣</span>
                  <span className="text-xs font-bold">وعاء الخلط فارغ، أضف المكونات بالترتيب!</span>
                </div>
              )}

              {/* Display ingredients currently inside the bowl */}
              {chefFeedback === "idle" && chefProgress.length > 0 && (
                <div className="flex gap-2">
                  {chefProgress.map((ing, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: -50, scale: 0, opacity: 0 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      className="text-4xl filter drop-shadow-sm select-none"
                    >
                      {ing}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Feedback alerts positioned at the bottom of the mixing bowl area */}
            <AnimatePresence>
              {chefFeedback === "success" && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="absolute bottom-2 inset-x-0 mx-auto w-52 py-1 px-3 rounded-full text-center font-extrabold text-sm border-2 z-30 shadow-sm select-none bg-[#EAFDF3] border-[#2ECC71] text-[#198754] font-sans"
                >
                  🎉 رائع! خلطة صحيحة! +2 ⭐
                </motion.div>
              )}

              {chefFeedback === "wrong" && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="absolute bottom-2 inset-x-0 mx-auto w-52 py-1 px-3 rounded-full text-center font-extrabold text-sm border-2 z-30 shadow-sm select-none bg-[#FFEBEB] border-[#EF4444] text-[#EF4444] font-sans"
                >
                  😢 ترتيب خاطئ! أعد المحاولة.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ingredient cards options */}
          <div className="grid grid-cols-6 gap-2.5 mb-6">
            {chefIngredientsList.map((ing, idx) => {
              const isUsed = chefProgress.includes(ing);

              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChefIngredientClick(ing)}
                  disabled={chefFeedback !== "idle" || isUsed}
                  className={`h-16 rounded-2xl border-3 flex flex-col items-center justify-center text-3xl shadow-sm cursor-pointer select-none active:scale-95 transition-all ${
                    isUsed
                      ? "bg-gray-100 border-gray-300 opacity-40 cursor-default"
                      : "bg-[#FDFBFF] hover:bg-purple-50/50 border-[#4D2B82]/20"
                  }`}
                >
                  {ing}
                </motion.button>
              );
            })}
          </div>

          <p className="text-[10px] font-bold text-purple-400 text-center">
            💡 انظر إلى المكونات المطلوبة في أعلى البطاقة بالترتيب، واضغط عليها بالترتيب الرقمي الصحيح لخلطها في الوعاء وتجهيز الحلوى اللذيذة!
          </p>
        </div>
      )}

      {/* --- TURBO ARROW RACER PLAY VIEW --- */}
      {activeGame === "arrowRacer" && !showLevelMap && (
        <div className="card-bubbly bg-[#0F172A] max-w-2xl mx-auto p-6 relative overflow-hidden text-white border-4 border-yellow-400">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-700 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#FF5A92] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-yellow-400 text-base flex items-center gap-2">
              <span>الجولة {racerRound} 🏁</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider ${racerTimeLeft <= 10 ? 'bg-red-600 animate-pulse text-white' : 'bg-slate-800 text-slate-300'}`}>
                ⏱️ {racerTimeLeft}ث
              </span>
            </div>
            <div className="text-sm font-bold text-[#38BDF8]">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-yellow-400 text-center mb-4">
            سباق الاتجاهات الخارق 🏍️💨
          </h3>

          {/* Racetrack Window */}
          <div className="relative w-full h-64 bg-[#1e293b] border-4 border-slate-700 rounded-3xl mb-6 flex flex-col items-center justify-between p-4 shadow-2xl overflow-hidden">
            
            {/* Real Scrolling Road Background */}
            <div 
              className="absolute inset-0 animate-scroll-road" 
              style={{ 
                animationDuration: racerSpeed > 0 ? `${12 / racerSpeed}s` : '0s' 
              }} 
            />

            {/* Center Lane Divider */}
            <div className="absolute inset-y-0 left-1/2 w-2 border-r-4 border-dashed border-yellow-400 opacity-50 pointer-events-none transform -translate-x-1/2" />

            {/* Speed Lines Background (only moving if speed > 80) */}
            {racerSpeed > 80 && (
              <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-20">
                <div className="h-1 w-full bg-white animate-pulse" />
                <div className="h-1 w-full bg-white animate-pulse" />
              </div>
            )}

            {/* Parallax Clouds (Drifting slow background) */}
            <div 
              className="absolute left-[10%] top-2 text-4xl select-none pointer-events-none opacity-30 animate-parallax-element"
              style={{
                animationDuration: racerSpeed > 0 ? `${48 / racerSpeed}s` : '0s',
                animationDelay: '0s'
              }}
            >☁️</div>
            <div 
              className="absolute right-[12%] top-6 text-4xl select-none pointer-events-none opacity-30 animate-parallax-element"
              style={{
                animationDuration: racerSpeed > 0 ? `${56 / racerSpeed}s` : '0s',
                animationDelay: '-1.5s'
              }}
            >☁️</div>

            {/* Parallax Trees on Left Margin */}
            <div 
              className="absolute left-[4%] top-4 text-4xl select-none pointer-events-none animate-parallax-element"
              style={{
                animationDuration: racerSpeed > 0 ? `${18 / racerSpeed}s` : '0s',
                animationDelay: '0s'
              }}
            >🌲</div>
            <div 
              className="absolute left-[14%] top-8 text-4xl select-none pointer-events-none animate-parallax-element"
              style={{
                animationDuration: racerSpeed > 0 ? `${22 / racerSpeed}s` : '0s',
                animationDelay: '-0.9s'
              }}
            >🌳</div>

            {/* Parallax Trees on Right Margin */}
            <div 
              className="absolute right-[4%] top-3 text-4xl select-none pointer-events-none animate-parallax-element"
              style={{
                animationDuration: racerSpeed > 0 ? `${16 / racerSpeed}s` : '0s',
                animationDelay: '-0.4s'
              }}
            >🌲</div>
            <div 
              className="absolute right-[14%] top-10 text-4xl select-none pointer-events-none animate-parallax-element"
              style={{
                animationDuration: racerSpeed > 0 ? `${20 / racerSpeed}s` : '0s',
                animationDelay: '-1.3s'
              }}
            >🌴</div>

            {/* Moving Obstacle */}
            {racerFeedback !== "drift" && (
              <motion.div
                initial={{ y: -40, scale: 0.3, opacity: 0 }}
                animate={{
                  y: racerFeedback === "correct" ? 180 : 40,
                  scale: racerFeedback === "correct" ? 1.5 : 0.8,
                  opacity: racerFeedback === "correct" ? 0 : 1,
                  // Position obstacle in a different lane to make it look dodged
                  x: racerFeedback === "correct" ? -racerLane * 100 : 0
                }}
                transition={{ duration: 0.8 }}
                className="text-5xl z-10 select-none absolute top-10"
              >
                {racerObstacle}
              </motion.div>
            )}

            {/* Player Vehicle */}
            <motion.div
              animate={{
                x: racerLane * 80,
                y: racerYOffset + (racerFeedback === "wrong" ? 10 : 0),
                scale: racerFeedback === "correct" ? 1.15 : racerFeedback === "drift" ? 1.2 : 1,
                rotate: racerFeedback === "wrong" ? [0, -15, 15, -15, 15, 0] : racerLane * 15
              }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="text-7xl z-20 select-none absolute bottom-4 drop-shadow-[0_12px_12px_rgba(0,0,0,0.6)]"
            >
              {racerFeedback === "wrong" ? "💥" : racerRound % 2 === 0 ? "🏎️" : "🏍️"}
              
              {/* Drift smoke / Nitro sparks */}
              {racerFeedback === "drift" && (
                <span className="absolute -bottom-2 -left-4 text-3xl animate-bounce">💨</span>
              )}
              {racerSpeed > 100 && racerFeedback === "correct" && (
                <span className="absolute -bottom-2 -left-6 text-3xl">🔥</span>
              )}
            </motion.div>

            {/* Score & Speed Dashboard */}
            <div className="w-full flex justify-between items-center z-20 pointer-events-none mt-auto">
              {/* Speedometer */}
              <div className="bg-slate-950/80 px-4 py-2 rounded-2xl border-2 border-slate-700 flex flex-col items-center">
                <span className="text-xs text-slate-400 font-bold">السرعة</span>
                <span className="text-xl font-black text-green-400 tracking-wider">
                  {racerSpeed} <span className="text-xs">كم/س</span>
                </span>
              </div>

              {/* Score */}
              <div className="bg-slate-950/80 px-4 py-2 rounded-2xl border-2 border-slate-700 flex flex-col items-center">
                <span className="text-xs text-slate-400 font-bold">النقاط</span>
                <span className="text-xl font-black text-yellow-400 tracking-wider">
                  {racerScore}
                </span>
              </div>
            </div>
          </div>

          {/* Sequence Arrows */}
          <div className="flex flex-col items-center mb-6">
            <span className="text-xs font-bold text-slate-400 mb-2">تسلسل الأسهم المطلوب:</span>
            <div className="flex gap-3 justify-center items-center">
              {racerSequence.map((dir, idx) => {
                const isPassed = idx < racerInputIndex;
                const isCurrent = idx === racerInputIndex;
                const arrowMap = {
                  up: "⬆️",
                  down: "⬇️",
                  left: "⬅️",
                  right: "➡️"
                };

                return (
                  <motion.div
                    key={idx}
                    animate={isCurrent ? { scale: [1, 1.2, 1], y: [0, -4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className={`w-12 h-12 rounded-full border-3 flex items-center justify-center text-2xl font-bold shadow-md transition-all ${
                      isPassed
                        ? "bg-green-500 border-green-300 scale-95 opacity-80"
                        : isCurrent
                        ? "bg-yellow-400 border-yellow-200 ring-4 ring-yellow-400/50 scale-110"
                        : "bg-slate-800 border-slate-600 opacity-40"
                    }`}
                  >
                    {arrowMap[dir]}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* On-Screen Arrow Controller */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-xs font-bold text-slate-400">تحكم باللمس للاتجاهات:</span>
            
            <div className="relative w-40 h-40">
              {/* Up button */}
              <button
                onClick={() => handleRacerInput("up")}
                className="absolute top-0 left-12 w-16 h-12 bg-blue-600 hover:bg-blue-500 border-b-4 border-blue-800 rounded-t-2xl flex items-center justify-center text-2xl active:scale-95 transition-transform"
              >
                ⬆️
              </button>
              {/* Left button */}
              <button
                onClick={() => handleRacerInput("left")}
                className="absolute top-12 left-0 w-12 h-16 bg-blue-600 hover:bg-blue-500 border-r-4 border-blue-800 rounded-l-2xl flex items-center justify-center text-2xl active:scale-95 transition-transform"
              >
                ⬅️
              </button>
              {/* Middle Circle */}
              <div className="absolute top-12 left-12 w-16 h-16 bg-slate-850 rounded-full border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                DRIVE
              </div>
              {/* Right button */}
              <button
                onClick={() => handleRacerInput("right")}
                className="absolute top-12 right-0 w-12 h-16 bg-blue-600 hover:bg-blue-500 border-l-4 border-blue-800 rounded-r-2xl flex items-center justify-center text-2xl active:scale-95 transition-transform"
              >
                ➡️
              </button>
              {/* Down button */}
              <button
                onClick={() => handleRacerInput("down")}
                className="absolute bottom-0 left-12 w-16 h-12 bg-blue-600 hover:bg-blue-500 border-t-4 border-blue-800 rounded-b-2xl flex items-center justify-center text-2xl active:scale-95 transition-transform"
              >
                ⬇️
              </button>
            </div>
          </div>
          
          <p className="text-[10px] font-bold text-slate-400 text-center">
            💡 اسحب على الشاشة 📱 أو اضغط أزرار الأسهم في الكيبورد ⌨️ أو استخدم لوحة التحكم الملونة!
          </p>
        </div>
      )}

      {/* --- FAST TAPPING RACER PLAY VIEW --- */}
      {activeGame === "tapRacer" && !showLevelMap && (
        <div className={`card-bubbly max-w-2xl mx-auto p-6 relative overflow-hidden border-4 border-[#4D2B82] ${
          tapRacerTheme === "swim" ? "bg-gradient-to-b from-[#E0F2FE] to-[#7DD3FC]" :
          tapRacerTheme === "cycle" ? "bg-gradient-to-b from-[#F1F5F9] to-[#CBD5E1]" :
          tapRacerTheme === "run" ? "bg-gradient-to-b from-[#FEF3C7] to-[#FCD34D]" :
          "bg-gradient-to-b from-[#ECFDF5] to-[#6EE7B7]"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-200 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#FF5A92] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-[#4D2B82] text-base flex items-center gap-2">
              <span>الجولة {tapRacerRound} من ٣ 🏁</span>
            </div>
            <div className="text-sm font-bold text-[#D97706]">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          {/* Theme Banner */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-black text-[#4D2B82] flex items-center justify-center gap-2">
              {tapRacerTheme === "swim" && "🏊 سباق السباحة في البحر"}
              {tapRacerTheme === "cycle" && "🚴 سباق الدراجات الهوائية"}
              {tapRacerTheme === "run" && "🏃 سباق الجري السريع"}
              {tapRacerTheme === "fly" && "🎈 سباق التحليق بالبالونات"}
            </h3>
            <p className="text-xs font-bold text-[#4d2b82]/70 mt-1">
              اضغط بأسرع ما يمكن لتصل لخط النهاية قبل الجميع!
            </p>
          </div>

          {/* The Racetrack Wrapper */}
          <div className="relative w-full bg-white/60 backdrop-blur-xs border-4 border-[#4D2B82] rounded-3xl p-4 shadow-inner overflow-hidden mb-6">
            
            {/* Tracks */}
            <div className="flex flex-col gap-4 relative">
              {/* Finish line line */}
              <div className="absolute right-[12%] top-0 bottom-0 border-r-4 border-dashed border-[#4D2B82]/20 z-0" />
              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 text-2xl z-10 select-none">🏁</div>

              {/* Lane 1: Opponents */}
              {opponents.map((o) => (
                <div key={o.id} className="relative h-12 flex items-center border-b border-purple-200/50 pb-2 last:border-0">
                  <div className="w-16 text-right font-black text-[10px] text-purple-800 truncate pl-1">{o.name}</div>
                  <div className="flex-grow h-6 bg-purple-100/50 rounded-full relative overflow-visible">
                    <motion.div
                      animate={{ left: `${o.progress * 0.8}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="absolute top-1/2 -translate-y-1/2 text-3xl select-none"
                    >
                      {tapRacerTheme === "swim" ? "🏊" : tapRacerTheme === "cycle" ? "🚴" : tapRacerTheme === "run" ? "🏃" : "🎈"}{o.emoji}
                    </motion.div>
                  </div>
                </div>
              ))}

              {/* Lane 4: Player */}
              <div className="relative h-12 flex items-center">
                <div className="w-16 text-right font-black text-xs text-[#FF5A92] pl-1">أنت 🦁</div>
                <div className="flex-grow h-8 bg-purple-200/70 border-2 border-[#FF5A92]/40 rounded-full relative overflow-visible shadow-inner">
                  <motion.div
                    animate={{ left: `${playerProgress * 0.8}%` }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className="absolute top-1/2 -translate-y-1/2 text-4xl select-none drop-shadow-md"
                  >
                    {tapRacerTheme === "swim" ? "🏊🦁" : tapRacerTheme === "cycle" ? "🚴🦁" : tapRacerTheme === "run" ? "🏃🦁" : "🎈🦁"}
                  </motion.div>
                </div>
              </div>

            </div>

            {/* Countdown Overlay */}
            {tapRacerState === "countdown" && (
              <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-xs flex flex-col items-center justify-center z-30">
                <motion.div
                  key={tapRacerCountdown}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-7xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                >
                  {tapRacerCountdown}
                </motion.div>
              </div>
            )}

            {/* Start signal overlay */}
            {tapRacerFeedback && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.5, 1], opacity: 1 }}
                  className="text-6xl font-black text-yellow-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                >
                  {tapRacerFeedback}
                </motion.div>
              </div>
            )}

            {/* Winner Overlay */}
            {tapRacerState === "finished" && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center z-30 p-4 text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  {winnerId === 0 ? (
                    <>
                      <span className="text-6xl select-none block mb-2">🏆</span>
                      <h4 className="text-xl font-black text-green-600 mb-1">المركز الأول! 🥇</h4>
                      <p className="text-sm font-bold text-green-700">لقد فزت ببراعة يا بطل! (+{tapRacerRound === 3 ? 1 : 2}⭐)</p>
                    </>
                  ) : (
                    <>
                      <span className="text-6xl select-none block mb-2">
                        {opponents.find(o => o.id === winnerId)?.progress && opponents.filter(o => o.progress > playerProgress).length === 1 ? "🥈" : "💪"}
                      </span>
                      <h4 className="text-xl font-black text-purple-600 mb-1">انتهى السباق!</h4>
                      <p className="text-sm font-bold text-purple-700">
                        {opponents.find(o => o.id === winnerId)?.name} وصل أولاً!
                      </p>
                      <p className="text-xs font-semibold text-purple-500 mt-1">
                        لقد حققت المركز {opponents.filter(o => o.progress > playerProgress).length + 1}!
                        {opponents.filter(o => o.progress > playerProgress).length === 1 ? " حصلت على (+1⭐)" : ""}
                      </p>
                    </>
                  )}

                  <div className="mt-4 flex gap-3 justify-center">
                    {tapRacerRound < 3 ? (
                      <button
                        onClick={() => {
                          sfx.playPop();
                          setTapRacerRound(prev => prev + 1);
                          initTapRacerRound(tapRacerRound + 1);
                        }}
                        className="btn-bubbly-primary px-6 py-2.5 text-sm"
                      >
                        الجولة التالية ➡️
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sfx.playPop();
                          addStars(tapRacerStars);
                          triggerVictory();
                        }}
                        className="btn-bubbly-purple px-6 py-2.5 text-sm"
                      >
                        عرض النتيجة النهائية 🎉
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

          </div>

          {/* Large Click Button */}
          <div className="flex flex-col items-center gap-2 mb-2 relative z-20">
            <motion.button
              disabled={tapRacerState !== "racing" || winnerId !== null}
              onClick={handleTapRacerClick}
              whileTap={{ scale: 0.95 }}
              animate={tapRacerState === "racing" ? { scale: [1, 1.03, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className={`w-full max-w-sm py-5 text-xl font-black rounded-3xl border-b-8 shadow-xl transition-all flex items-center justify-center gap-2 active:border-b-2 active:translate-y-1 ${
                tapRacerState === "racing" 
                  ? "bg-[#FF5A92] hover:bg-[#FF4081] text-white border-[#C2185B]"
                  : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
              }`}
            >
              <span>⚡</span>
              <span>اضغط هنا بسرعة!</span>
              <span>👆</span>
            </motion.button>
          </div>

          <p className="text-[10px] font-bold text-[#4D2B82]/60 text-center mt-3">
            💡 كل ضغطة تمنح شخصيتك دفعة قوية للأمام! تسابق واعبر خط النهاية لتفوز بالنجوم!
          </p>
        </div>
      )}

      {/* --- HUNGRY ANIMALS FARM PLAY VIEW --- */}
      {activeGame === "farm" && !showLevelMap && activeAnimal && (
        <div className="card-bubbly bg-[#E8F5E9] max-w-2xl mx-auto p-6 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-green-200 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-green-800">
              الجولة {farmRound} من 5
            </div>
            <div className="text-sm font-bold text-[#D97706]">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-green-800 text-center mb-6">
            ماذا يأكل هذا الحيوان اللطيف؟ 🐾
          </h3>

          <div className="relative w-full h-48 bg-white/50 border-3 border-green-400 rounded-3xl mb-8 flex flex-col items-center justify-end pb-4 shadow-sm">
            {/* Animal */}
            <motion.div
              animate={
                farmFeedback === "correct"
                  ? { y: [0, -30, 0, -30, 0] }
                  : farmFeedback === "wrong"
                  ? { x: [0, -10, 10, -10, 0] }
                  : { scale: [1, 1.05, 1] }
              }
              transition={
                farmFeedback === "correct"
                  ? { duration: 1 }
                  : { repeat: Infinity, duration: 2 }
              }
              className="text-8xl z-10 select-none relative"
            >
              {activeAnimal.emoji}
              
              {/* Thought Bubble */}
              {farmFeedback === "idle" && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-12 -right-8 w-16 h-12 bg-white rounded-[50%] border-2 border-gray-300 flex items-center justify-center text-2xl shadow-sm"
                >
                  ❓
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-white border border-gray-300" />
                  <div className="absolute -bottom-5 -left-4 w-2 h-2 rounded-full bg-white border border-gray-300" />
                </motion.div>
              )}
            </motion.div>

            {/* Selected Food dropping in */}
            <AnimatePresence>
              {farmSelectedFood && farmFeedback === "correct" && (
                <motion.div
                  initial={{ y: -100, x: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: -40, x: 20, opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute text-5xl z-20 pointer-events-none"
                >
                  {foodData.find(f => f.id === farmSelectedFood)?.emoji}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name label */}
            <div className="mt-2 text-green-700 font-bold bg-white/80 px-3 py-1 rounded-full shadow-sm text-sm border border-green-200">
              {activeAnimal.name}
            </div>

            {/* Feedback overlay inside animal box */}
            <AnimatePresence>
              {farmFeedback !== "idle" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute inset-x-0 top-4 mx-auto w-48 py-2 rounded-full text-center font-extrabold text-sm border-2 z-30 shadow-sm bg-white"
                  style={{
                    borderColor: farmFeedback === "correct" ? "#2ECC71" : "#EF4444",
                    color: farmFeedback === "correct" ? "#198754" : "#EF4444",
                  }}
                >
                  {farmFeedback === "correct" ? "😋 يم يم! شكراً لك!" : "🤢 لا أحب هذا الطعام!"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Food Options */}
          <div className="grid grid-cols-4 gap-3 mb-2">
            {farmCurrentFoods.map((food) => (
              <motion.button
                key={food.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleFoodClick(food.id as FoodType)}
                disabled={farmFeedback !== "idle"}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center shadow-md border-3 transition-colors ${
                  farmSelectedFood === food.id
                    ? (farmFeedback === "correct" ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400")
                    : "bg-white border-[#4D2B82]/10 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <span className="text-4xl mb-1">{food.emoji}</span>
                <span className="text-xs font-bold text-gray-600">{food.name}</span>
              </motion.button>
            ))}
          </div>
          
          <p className="text-[10px] font-bold text-green-700/60 text-center mt-4">
            💡 اختر الطعام المناسب لكل حيوان واسحبه (أو اضغط عليه) لإطعامه!
          </p>
        </div>
      )}

      {/* --- MAGICAL SHAPES TRAIN PLAY VIEW --- */}
      {activeGame === "train" && !showLevelMap && trainParts.length > 0 && (
        <div className="card-bubbly bg-[#F8FAFC] max-w-2xl mx-auto p-6 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-blue-100 pb-4 mb-4 relative z-20">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#E01E5A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-blue-900">
              الجولة {trainRound} من 5
            </div>
            <div className="text-sm font-bold text-[#D97706]">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-blue-900 text-center mb-6">
            أكمل أجزاء القطار ليتحرك! 🚂
          </h3>

          <div className="relative w-full h-56 bg-sky-100 border-3 border-sky-300 rounded-3xl mb-8 flex items-end justify-center overflow-hidden pb-4">
            {/* Tracks */}
            <div className="absolute bottom-4 left-0 w-full border-b-4 border-dashed border-sky-800 opacity-30" />

            {/* Train Container */}
            <motion.div
              animate={trainDeparting ? { x: -800 } : { x: 0 }}
              transition={{ duration: 2, ease: "easeIn" }}
              className="relative flex items-end z-10"
            >
              {/* Locomotive Base */}
              <div className="w-[300px] sm:w-[380px] h-36 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-3xl rounded-br-3xl border-4 border-blue-800 relative shadow-lg flex items-center justify-center">
                
                {/* Driver Window */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-sky-200 border-2 border-blue-800 rounded-lg shadow-inner flex items-end overflow-hidden">
                  <div className="w-full h-4 bg-sky-300 opacity-50" />
                </div>
                
                {/* Train Details / Stripes */}
                <div className="absolute top-1/2 left-0 right-20 h-2 bg-yellow-400 border-y border-yellow-500 shadow-sm z-10" />
                
                {/* Chimney */}
                <div className="absolute -top-14 left-6 w-10 h-14 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-lg border-2 border-gray-800 shadow-md">
                   <div className="absolute -top-2 -left-1 -right-1 h-3 bg-gray-800 rounded-sm" />
                </div>
                {trainDeparting && (
                  <motion.div
                    animate={{ y: [-10, -50], x: [0, -20], opacity: [1, 0], scale: [1, 2.5] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="absolute -top-20 left-2 text-4xl text-gray-400/80 pointer-events-none"
                  >
                    ☁️
                  </motion.div>
                )}
                
                {/* Front grill / Cowcatcher */}
                <div className="absolute -left-6 bottom-0 w-8 h-12 bg-gray-600 border-t-2 border-l-2 border-gray-800 rounded-tl-full transform -skew-x-12 z-0 shadow-md" />

                {/* Train Parts Slots (Cargo Area) */}
                <div className="absolute bottom-6 left-6 right-20 flex justify-around px-1 z-20 gap-1 sm:gap-2">
                  {trainParts.map((part) => (
                    <div
                      key={part.id}
                      className={`${trainParts.length > 3 ? 'w-10 h-10' : 'w-12 h-12'} border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center bg-black/10 shadow-inner overflow-hidden relative`}
                    >
                      {!part.filled && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
                           <span className={`${trainParts.length > 3 ? 'text-xl' : 'text-2xl'} grayscale`}>{allShapesData.find(s => s.type === part.shape)?.emoji}</span>
                        </div>
                      )}
                      
                      {part.filled && (
                        <motion.div
                          initial={{ scale: 0, rotate: 90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute inset-0 flex items-center justify-center rounded-md shadow-md z-10"
                          style={{ backgroundColor: part.color }}
                        >
                          <span className="text-2xl">{allShapesData.find(s => s.type === part.shape)?.emoji}</span>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Wheels */}
                <div className="absolute -bottom-6 left-2 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-400 shadow-md flex items-center justify-center z-30">
                  <div className="w-4 h-4 bg-gray-400 rounded-full animate-[spin_3s_linear_infinite]" />
                </div>
                <div className="absolute -bottom-6 right-8 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-400 shadow-md flex items-center justify-center z-30">
                  <div className="w-4 h-4 bg-gray-400 rounded-full animate-[spin_3s_linear_infinite]" />
                </div>
                
                {/* Connecting rod for wheels */}
                <div className="absolute -bottom-1 left-6 w-36 h-2 bg-yellow-500 border border-yellow-600 rounded-full z-40" />

              </div>
            </motion.div>

            {/* Feedback */}
            <AnimatePresence>
              {trainFeedback === "wrong" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute inset-x-0 top-10 mx-auto w-48 py-2 rounded-full text-center font-extrabold text-sm border-2 z-30 shadow-sm bg-red-50 border-red-400 text-red-500"
                >
                  ❌ شكل غير مناسب!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Shapes Toolbox */}
          <div className="grid grid-cols-4 gap-3 mb-2">
            {trainCurrentOptions.map((shape) => {
              const isNeededAndUnfilled = trainParts.some(p => p.shape === shape.type && !p.filled);
              
              return (
                <motion.button
                  key={shape.type}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleShapeClick(shape.type as ShapeType)}
                  disabled={trainFeedback === "success" || trainDeparting}
                  className="aspect-square rounded-2xl bg-white border-3 border-blue-200 flex flex-col items-center justify-center shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <span className="text-4xl mb-1">{shape.emoji}</span>
                  <span className="text-xs font-bold text-gray-600">{shape.name}</span>
                </motion.button>
              );
            })}
          </div>
          
          <p className="text-[10px] font-bold text-blue-700/60 text-center mt-4">
            💡 اضغط على الأشكال الموجودة بالأسفل لتثبيتها في الأماكن الفارغة بالقطار.
          </p>
        </div>
      )}

      {activeGame === "quran" && (
        <QuranIsland
          onClose={() => setActiveGame("menu")}
          globalStars={globalStars}
          setGlobalStars={setGlobalStars}
        />
      )}

      {activeGame === "stories" && (
        <InteractiveStories
          onClose={() => setActiveGame("menu")}
          globalStars={globalStars}
          setGlobalStars={setGlobalStars}
        />
      )}


      {/* --- VICTORY CELEBRATION MODAL --- */}
      <AnimatePresence>
        {showVictoryModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            {/* Victory Party Poppers on Left & Right */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {/* Left Popper */}
              <motion.div
                initial={{ x: -150, y: 150, rotate: 45, opacity: 0, scale: 0.5 }}
                animate={{ x: 0, y: 0, rotate: 45, opacity: 1, scale: [1, 1.1, 1] }}
                transition={{ 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 12,
                  scale: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                }}
                className="absolute bottom-6 left-6 select-none origin-bottom-left"
              >
                <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
                  {/* Blast lines */}
                  <path d="M40 45 Q45 25 35 10" fill="none" stroke="#5BF8A3" strokeWidth="4" strokeLinecap="round" />
                  <path d="M50 45 Q55 20 62 8" fill="none" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
                  <path d="M60 45 Q52 30 68 18" fill="none" stroke="#5BC0F8" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Blast particles */}
                  <circle cx="28" cy="22" r="4.5" fill="#FF5A92" />
                  <circle cx="72" cy="26" r="4" fill="#A855F7" />
                  <circle cx="50" cy="4" r="5" fill="#FF9F29" />
                  <rect x="44" y="24" width="8" height="4" rx="1" fill="#FF5A92" transform="rotate(15 48 26)" />
                  <rect x="58" y="28" width="6" height="10" rx="1" fill="#5BF8A3" transform="rotate(-30 61 33)" />

                  {/* Cone */}
                  <path d="M50 95 L25 50 L75 50 Z" fill="#FF9F29" stroke="#4D2B82" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M50 95 L35 50 L65 50 Z" fill="#FFD700" stroke="#4D2B82" strokeWidth="3" strokeLinejoin="round" />
                  <ellipse cx="50" cy="50" rx="25" ry="6" fill="#4D2B82" />
                </svg>
              </motion.div>
              
              {/* Right Popper */}
              <motion.div
                initial={{ x: 150, y: 150, rotate: -45, opacity: 0, scale: 0.5 }}
                animate={{ x: 0, y: 0, rotate: -45, opacity: 1, scale: [1, 1.1, 1] }}
                transition={{ 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 12,
                  scale: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                }}
                className="absolute bottom-6 right-6 select-none origin-bottom-right"
              >
                <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 transform -scale-x-100">
                  {/* Blast lines */}
                  <path d="M40 45 Q45 25 35 10" fill="none" stroke="#5BF8A3" strokeWidth="4" strokeLinecap="round" />
                  <path d="M50 45 Q55 20 62 8" fill="none" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
                  <path d="M60 45 Q52 30 68 18" fill="none" stroke="#5BC0F8" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Blast particles */}
                  <circle cx="28" cy="22" r="4.5" fill="#FF5A92" />
                  <circle cx="72" cy="26" r="4" fill="#A855F7" />
                  <circle cx="50" cy="4" r="5" fill="#FF9F29" />
                  <rect x="44" y="24" width="8" height="4" rx="1" fill="#FF5A92" transform="rotate(15 48 26)" />
                  <rect x="58" y="28" width="6" height="10" rx="1" fill="#5BF8A3" transform="rotate(-30 61 33)" />

                  {/* Cone */}
                  <path d="M50 95 L25 50 L75 50 Z" fill="#FF9F29" stroke="#4D2B82" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M50 95 L35 50 L65 50 Z" fill="#FFD700" stroke="#4D2B82" strokeWidth="3" strokeLinejoin="round" />
                  <ellipse cx="50" cy="50" rx="25" ry="6" fill="#4D2B82" />
                </svg>
              </motion.div>
            </div>

            <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white border-4 border-[#4D2B82] rounded-[32px] p-8 max-w-md w-full text-center shadow-[0_12px_0_0_#4D2B82] relative overflow-hidden"
          >
            
            {/* Star Background shine */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-100 rounded-full filter blur-3xl opacity-50 z-0 pointer-events-none animate-pulse" />

            {/* Triumphant Content */}
            <div className="relative z-10">
              
            {/* Bouncing Trophy with rotating sparkle stars background */}
            <div className="relative inline-block mb-4">
              {/* Orbiting decorations */}
              {[
                { color: "#FF5A92", size: { w: 16, h: 8 }, top: "-top-6", left: "left-6", delay: 0, rotate: 45 },
                { color: "#5BF8A3", size: { w: 8, h: 16 }, top: "top-4", left: "-left-10", delay: 0.5, rotate: -30 },
                { color: "#FFD700", size: { w: 12, h: 12 }, top: "-top-2", left: "-left-8", delay: 1.0, rotate: 15 },
                { color: "#5BC0F8", size: { w: 14, h: 6 }, top: "-top-8", left: "-right-6", delay: 0.3, rotate: 60 },
                { color: "#A855F7", size: { w: 6, h: 14 }, top: "top-8", left: "right-8", delay: 0.7, rotate: -45 },
                { color: "#FF9F29", size: { w: 10, h: 10 }, top: "bottom-0", left: "right-6", delay: 1.2, rotate: 120 },
                { color: "#FF5A92", size: { w: 15, h: 8 }, top: "bottom-6", left: "-left-4", delay: 0.2, rotate: -15 },
              ].map((dec, idx) => (
                <motion.div
                  key={idx}
                  animate={{ 
                    y: [0, -12, 12, 0],
                    rotate: [dec.rotate, dec.rotate + 180, dec.rotate + 360],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3 + Math.random() * 2, 
                    delay: dec.delay,
                    ease: "easeInOut"
                  }}
                  className={`absolute ${dec.top} ${dec.left} rounded-xs pointer-events-none z-20`}
                  style={{
                    width: dec.size.w,
                    height: dec.size.h,
                    backgroundColor: dec.color,
                    boxShadow: "0 2px 3px rgba(0,0,0,0.1)"
                  }}
                />
              ))}
              
              {/* Trophy */}
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="inline-block relative z-10"
              >
                <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto">
                  {/* Glow/shine behind trophy */}
                  <circle cx="50" cy="45" r="28" fill="#FFF59D" opacity="0.3" className="animate-pulse" />
                  
                  {/* Left Cup Handle */}
                  <path d="M32 30 C20 30 20 50 32 52" fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                  <path d="M32 34 C24 34 24 46 32 48" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Right Cup Handle */}
                  <path d="M68 30 C80 30 80 50 68 52" fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                  <path d="M68 34 C76 34 76 46 68 48" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />

                  {/* Trophy Cup Body */}
                  <path d="M30 25 L70 25 L68 55 C68 65 50 70 50 70 C50 70 32 65 32 55 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="4" strokeLinejoin="round" />
                  {/* Trophy Shine Highlight */}
                  <path d="M35 29 L45 29 L40 58 C38 58 36 54 36 52 Z" fill="#FFF" opacity="0.4" />
                  
                  {/* Stem / Stand connection */}
                  <path d="M50 70 L50 82" stroke="#D97706" strokeWidth="8" strokeLinecap="round" />
                  <path d="M50 70 L50 82" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Base */}
                  <path d="M32 82 L68 82 L64 92 L36 92 Z" fill="#78350F" stroke="#451A03" strokeWidth="4" strokeLinejoin="round" />
                  <rect x="42" y="85" width="16" height="5" rx="1" fill="#FBBF24" />
                  
                  {/* Star on Cup */}
                  <path d="M50 35 L53 41 L60 42 L55 47 L56 54 L50 50 L44 54 L45 47 L40 42 L47 41 Z" fill="#D97706" />
                </svg>
              </motion.div>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 mb-3">
              <SproutMascot className="w-20 h-20 mb-1" state="happy" />
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                صديقك برعم فخور بك! 🌿
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-[#4D2B82] mb-3">عمل رائع يا بطل!</h2>
                
                <p className="text-lg font-bold text-[#6B4E9E] mb-6 leading-relaxed">
                  لقد تفوّقت وحققت فوزاً مذهلاً! طفلك ذكي جداً ويستحق هذه النجوم.
                </p>

                {/* Score Summary Box */}
                <div className="bg-[#FFFCE6] border-2 border-[#D97706] rounded-2xl p-4 mb-8 flex items-center justify-center gap-2 max-w-[240px] mx-auto shadow-sm">
                  <span className="text-3xl text-yellow-400">★</span>
                  <span className="text-xl font-extrabold text-[#D97706]">
                    ربحت: +{starsEarnedThisSession} نجوم!
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                   <button
                    onClick={startNextLevel}
                    className="flex-1 btn-bubbly-primary text-sm py-3"
                  >
                    الدور التالي 🚀
                  </button>
                  <button
                    onClick={() => {
                      try {
                        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                      } catch (e) {}
                      setShowVictoryModal(false);
                      setVictoryBalloons([]);
                      setConfetti([]);
                      // Re-initialize active game
                      if (activeGame === "math") startMathGame();
                      else if (activeGame === "spelling") startSpellingGame();
                      else if (activeGame === "memory") initMemoryGame();
                      else if (activeGame === "catcher") startCatcherGame();
                      else if (activeGame === "coloring") startColoringGame();
                      else if (activeGame === "spellingEn") startSpellingEnGame();
                      else if (activeGame === "sorting") startSortingGame();
                      else if (activeGame === "spaceCatcher") startSpaceCatcherGame();
                      else if (activeGame === "connectDots") startConnectDotsGame();
                      else if (activeGame === "maze") startMazeGame();
                      else if (activeGame === "safari") startSafariGame();
                      else if (activeGame === "chef") startChefGame();
                      else if (activeGame === "farm") startFarmGame();
                      else if (activeGame === "train") startTrainGame();
                      else if (activeGame === "arrowRacer") startRacerGame();
                      else if (activeGame === "tapRacer") startTapRacerGame();
                    }}
                    className="flex-1 btn-bubbly-secondary text-sm py-3"
                  >
                    إعادة الدور 🔁
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Music Box Toggle Button */}
      {activeGame !== "menu" && (
        <button
          onClick={() => {
            const nextVal = !isMusicMuted;
            setIsMusicMuted(nextVal);
            localStorage.setItem("isMusicMuted", nextVal.toString());
          }}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-yellow-400 border-4 border-[#4D2B82] flex items-center justify-center text-3xl shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          title={isMusicMuted ? "تشغيل الموسيقى 🎵" : "كتم الموسيقى 🔇"}
        >
          {isMusicMuted ? "🔇" : "🎵"}
        </button>
      )}

    </section>
  );
}
