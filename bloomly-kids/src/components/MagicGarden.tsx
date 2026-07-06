import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Droplet, Clock, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { ScreenOrientation } from '@capacitor/screen-orientation';

// ─── Web Audio API Synthesizer ────────────────────────────────────
class GardenSoundSynth {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  playPop() {
    try {
      this.initCtx(); if (!this.ctx) return;
      const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
      osc.connect(gain); gain.connect(this.ctx.destination); osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(450, now); osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
      gain.gain.setValueAtTime(0.18, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now); osc.stop(now + 0.08);
    } catch (e) { console.warn(e); }
  }

  playWaterPour() {
    try {
      this.initCtx(); if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter(); filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, now); filter.frequency.exponentialRampToValueAtTime(400, now + 0.45);
      filter.Q.setValueAtTime(3.0, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
      const osc = this.ctx.createOscillator(); const oscGain = this.ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.exponentialRampToValueAtTime(1479.98, now + 0.25);
      oscGain.gain.setValueAtTime(0.06, now); oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(oscGain); oscGain.connect(this.ctx.destination);
      noise.start(now); noise.stop(now + 0.45); osc.start(now); osc.stop(now + 0.3);
    } catch (e) { console.warn(e); }
  }

  playHarvest() {
    try {
      this.initCtx(); if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator(); const gain = this.ctx!.createGain();
        osc.type = "sine"; osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);
        osc.connect(gain); gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07); osc.stop(now + idx * 0.07 + 0.4);
      });
    } catch (e) { console.warn(e); }
  }

  playPetUnlock() {
    try {
      this.initCtx(); if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator(); const gain = this.ctx!.createGain();
        osc.type = "triangle"; osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);
        osc.connect(gain); gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.05); osc.stop(now + idx * 0.05 + 0.3);
      });
    } catch (e) { console.warn(e); }
  }

  playFeed() {
    try {
      this.initCtx(); if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [380, 480, 380, 480, 560].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator(); const gain = this.ctx!.createGain();
        osc.type = "sine"; osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
        osc.connect(gain); gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.06); osc.stop(now + idx * 0.06 + 0.15);
      });
    } catch (e) { console.warn(e); }
  }

  playCollect() {
    try {
      this.initCtx(); if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator(); const gain = this.ctx!.createGain();
        osc.type = "sine"; osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain); gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) { console.warn(e); }
  }
}

const synth = new GardenSoundSynth();

// ─── SVG Animal Components ────────────────────────────────────────

export function SVGBunny({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { rotate: [0, 15, 0, 15, 0], y: [0, 4, 0, 4, 0] } : {}} transition={{ duration: 1.5 }}>
      <ellipse cx="38" cy="20" rx="7" ry="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="38" cy="20" rx="3.5" ry="12" fill="#FFC0CB" />
      <ellipse cx="62" cy="20" rx="7" ry="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="62" cy="20" rx="3.5" ry="12" fill="#FFC0CB" />
      <circle cx="50" cy="72" r="24" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="50" cy="46" r="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="43" cy="43" r="2.5" fill="#4D2B82" /><circle cx="57" cy="43" r="2.5" fill="#4D2B82" />
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
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { rotate: [0, -10, 0, -10, 0], y: [0, 3, 0, 3, 0] } : {}} transition={{ duration: 1.5 }}>
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
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { rotate: [0, 20, 0, 20, 0], y: [0, 4, 0, 4, 0] } : {}} transition={{ duration: 1.5 }}>
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
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { rotate: [0, 15, 0, 15, 0], y: [0, 3, 0, 3, 0] } : {}} transition={{ duration: 1.5 }}>
      <path d="M 76 72 Q 86 64 88 50" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="72" rx="22" ry="18" fill="#BCAAA4" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="30" cy="44" rx="6" ry="12" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      <ellipse cx="70" cy="44" rx="6" ry="12" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      <circle cx="50" cy="44" r="17" fill="#BCAAA4" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="50" cy="48" rx="8" ry="6" fill="#FFFFFF" />
      <circle cx="42" cy="40" r="2.5" fill="#4D2B82" /><circle cx="58" cy="40" r="2.5" fill="#4D2B82" />
      <ellipse cx="50" cy="46" rx="3" ry="2" fill="#000000" />
      <path d="M 48 51 Q 50 59 52 51 Z" fill="#FF5A92" stroke="#4D2B82" strokeWidth="1.5" />
      <circle cx="38" cy="90" r="6" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      <circle cx="62" cy="90" r="6" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
    </motion.svg>
  );
}

export function SVGSheep({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { rotate: [0, 12, 0, 12, 0], y: [0, 5, 0, 5, 0] } : {}} transition={{ duration: 1.5 }}>
      <rect x="30" y="70" width="6" height="18" fill="#1F2937" rx="2" />
      <rect x="42" y="72" width="6" height="18" fill="#1F2937" rx="2" />
      <rect x="52" y="72" width="6" height="18" fill="#1F2937" rx="2" />
      <rect x="64" y="70" width="6" height="18" fill="#1F2937" rx="2" />
      <path d="M 28 50 C 22 45, 22 30, 32 30 C 28 18, 48 12, 54 22 C 58 12, 78 18, 74 30 C 84 30, 84 45, 78 50 C 84 62, 74 72, 64 70 C 58 78, 42 78, 36 70 C 22 72, 22 62, 28 50 Z" fill="#F3F4F6" stroke="#4D2B82" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="76" cy="42" rx="10" ry="12" fill="#1F2937" />
      <circle cx="73" cy="39" r="1.5" fill="#FFFFFF" /><circle cx="79" cy="39" r="1.5" fill="#FFFFFF" />
      <ellipse cx="66" cy="38" rx="4" ry="2" fill="#1F2937" transform="rotate(-20 66 38)" />
      <ellipse cx="86" cy="38" rx="4" ry="2" fill="#1F2937" transform="rotate(20 86 38)" />
    </motion.svg>
  );
}

export function SVGCow({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { rotate: [0, 10, 0, 10, 0], y: [0, 4, 0, 4, 0] } : {}} transition={{ duration: 1.5 }}>
      <rect x="28" y="74" width="7" height="16" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="2" rx="2" />
      <rect x="42" y="76" width="7" height="16" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="2" rx="2" />
      <rect x="52" y="76" width="7" height="16" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="2" rx="2" />
      <rect x="65" y="74" width="7" height="16" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="2" rx="2" />
      <ellipse cx="50" cy="60" rx="28" ry="20" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="38" cy="55" rx="10" ry="8" fill="#1F2937" opacity="0.8" />
      <ellipse cx="64" cy="65" rx="8" ry="6" fill="#1F2937" opacity="0.8" />
      <circle cx="50" cy="35" r="16" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <path d="M 36 22 Q 30 12 34 18" stroke="#D4A017" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 64 22 Q 70 12 66 18" stroke="#D4A017" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="43" cy="32" r="2.5" fill="#4D2B82" /><circle cx="57" cy="32" r="2.5" fill="#4D2B82" />
      <ellipse cx="50" cy="40" rx="9" ry="6" fill="#FFC0CB" stroke="#4D2B82" strokeWidth="2" />
      <circle cx="46" cy="39" r="1.5" fill="#4D2B82" /><circle cx="54" cy="39" r="1.5" fill="#4D2B82" />
      <path d="M 47 43 Q 50 46 53 43" stroke="#4D2B82" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="80" rx="7" ry="4" fill="#FFC0CB" />
      <path d="M 78 55 Q 90 45 86 60" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}

export function SVGBee({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { y: [0, -8, 0, -8, 0], rotate: [0, 5, 0, -5, 0] } : { y: [0, -4, 0], rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration: isEating ? 1.5 : 2.5, repeat: Infinity }}>
      <ellipse cx="35" cy="32" rx="12" ry="18" fill="#E0F7FF" stroke="#87CEEB" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="65" cy="32" rx="12" ry="18" fill="#E0F7FF" stroke="#87CEEB" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="50" cy="55" rx="18" ry="24" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      <rect x="32" y="46" width="36" height="4" fill="#1F2937" rx="2" />
      <rect x="32" y="55" width="36" height="4" fill="#1F2937" rx="2" />
      <rect x="32" y="64" width="36" height="4" fill="#1F2937" rx="2" />
      <circle cx="50" cy="30" r="12" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      <line x1="44" y1="20" x2="38" y2="10" stroke="#4D2B82" strokeWidth="2" />
      <circle cx="38" cy="10" r="3" fill="#4D2B82" />
      <line x1="56" y1="20" x2="62" y2="10" stroke="#4D2B82" strokeWidth="2" />
      <circle cx="62" cy="10" r="3" fill="#4D2B82" />
      <circle cx="45" cy="28" r="2.5" fill="#4D2B82" /><circle cx="55" cy="28" r="2.5" fill="#4D2B82" />
      <path d="M 46 34 Q 50 38 54 34" stroke="#4D2B82" strokeWidth="2" fill="none" strokeLinecap="round" />
      <polygon points="50,79 46,74 54,74" fill="#4D2B82" />
    </motion.svg>
  );
}

export function SVGFish({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { x: [0, 10, 0, -10, 0] } : { x: [0, 5, 0, -5, 0] }}
      transition={{ duration: isEating ? 1.2 : 3, repeat: Infinity }}>
      <ellipse cx="48" cy="50" rx="28" ry="16" fill="#3B82F6" stroke="#4D2B82" strokeWidth="3" />
      <polygon points="76,50 92,36 92,64" fill="#60A5FA" stroke="#4D2B82" strokeWidth="2" />
      <polygon points="48,34 40,20 56,20" fill="#60A5FA" stroke="#4D2B82" strokeWidth="2" />
      <circle cx="34" cy="46" r="5" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="2" />
      <circle cx="35" cy="45" r="2.5" fill="#4D2B82" />
      <circle cx="22" cy="52" r="2.5" fill="#1E40AF" />
      <path d="M 38 42 Q 44 38 50 42" stroke="#2563EB" strokeWidth="1.5" fill="none" />
      <path d="M 50 42 Q 56 38 62 42" stroke="#2563EB" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="54" r="3" fill="#FF8A8A" opacity="0.5" />
    </motion.svg>
  );
}

export function SVGBird({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className}
      animate={isEating ? { rotate: [0, -15, 0, -15, 0], y: [0, 3, 0, 3, 0] } : {}} transition={{ duration: 1.5 }}>
      <polygon points="75,55 92,40 88,65" fill="#10B981" stroke="#4D2B82" strokeWidth="2" />
      <polygon points="75,55 95,50 90,70" fill="#059669" stroke="#4D2B82" strokeWidth="2" />
      <ellipse cx="50" cy="55" rx="22" ry="18" fill="#10B981" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="56" cy="50" rx="14" ry="10" fill="#059669" stroke="#4D2B82" strokeWidth="2" />
      <circle cx="30" cy="40" r="14" fill="#10B981" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="25" cy="37" r="4" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="1.5" />
      <circle cx="24" cy="36" r="2" fill="#4D2B82" />
      <polygon points="16,42 6,38 6,46" fill="#F97316" stroke="#4D2B82" strokeWidth="2" />
      <ellipse cx="42" cy="62" rx="10" ry="7" fill="#FDE047" />
      <line x1="42" y1="72" x2="38" y2="86" stroke="#F97316" strokeWidth="3" />
      <line x1="52" y1="72" x2="56" y2="86" stroke="#F97316" strokeWidth="3" />
      <polygon points="30,26 27,16 34,20" fill="#EF4444" stroke="#4D2B82" strokeWidth="1.5" />
      <polygon points="34,26 32,14 38,19" fill="#EF4444" stroke="#4D2B82" strokeWidth="1.5" />
    </motion.svg>
  );
}

// ─── NEW: Detailed Customized Feeding Dishes ──────────────────────
export function SVGFeedingDish({ type, hungry }: { type: PaddockType; hungry: boolean }) {
  switch (type) {
    case "sheep":
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-11 filter drop-shadow-md">
          {/* Wooden trough */}
          <rect x="5" y="15" width="50" height="20" fill="#8B5A2B" stroke="#4D2B82" strokeWidth="3" rx="3" />
          <line x1="10" y1="35" x2="5" y2="39" stroke="#4D2B82" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="35" x2="55" y2="39" stroke="#4D2B82" strokeWidth="3" strokeLinecap="round" />
          {!hungry && (
            // Overflowing yellow straw/hay
            <path d="M 8 18 Q 15 5 25 14 Q 35 3 45 15 Q 52 10 52 18 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
          )}
        </svg>
      );
    case "rabbit":
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          {/* Basket crate */}
          <rect x="8" y="15" width="44" height="22" fill="#DDB892" stroke="#4D2B82" strokeWidth="3" rx="4" />
          <line x1="8" y1="26" x2="52" y2="26" stroke="#4D2B82" strokeWidth="2.5" />
          {!hungry && (
            <>
              {/* Carrots sticking out */}
              <path d="M 12 18 L 16 4 L 20 18" fill="#F97316" stroke="#4D2B82" strokeWidth="1.5" />
              <path d="M 16 4 Q 14 -1 18 1" stroke="#22C55E" strokeWidth="1.5" fill="none" />
              <path d="M 24 18 L 28 2 L 32 18" fill="#F97316" stroke="#4D2B82" strokeWidth="1.5" />
              <path d="M 28 2 Q 26 -3 30 -1" stroke="#22C55E" strokeWidth="1.5" fill="none" />
              <path d="M 36 18 L 40 6 L 44 18" fill="#F97316" stroke="#4D2B82" strokeWidth="1.5" />
              <path d="M 40 6 Q 38 1 42 3" stroke="#22C55E" strokeWidth="1.5" fill="none" />
            </>
          )}
        </svg>
      );
    case "duck":
      return (
        <svg viewBox="0 0 60 40" className="w-14 h-11 filter drop-shadow-md">
          {/* Floating water lilypad tray */}
          <ellipse cx="30" cy="25" rx="25" ry="12" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
          <path d="M 10 25 C 20 28, 40 28, 50 25" stroke="#047857" strokeWidth="1.5" fill="none" />
          {!hungry && (
            // Yellow fish pond grains
            <g>
              <circle cx="20" cy="20" r="3" fill="#FBBF24" />
              <circle cx="25" cy="23" r="2.5" fill="#F59E0B" />
              <circle cx="30" cy="18" r="3.5" fill="#FBBF24" />
              <circle cx="35" cy="22" r="3" fill="#F59E0B" />
              <circle cx="40" cy="19" r="2.5" fill="#FBBF24" />
            </g>
          )}
        </svg>
      );
    case "pet":
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          {/* Premium animal bowl */}
          <ellipse cx="30" cy="30" rx="22" ry="8" fill="#E11D48" stroke="#4D2B82" strokeWidth="3" />
          <path d="M 8 22 Q 30 12 52 22 L 52 30 Q 30 20 8 30 Z" fill="#FDA4AF" stroke="#4D2B82" strokeWidth="3" />
          <rect x="23" y="21" width="14" height="4" fill="#FFFFFF" rx="1.5" />
          <circle cx="23" cy="23" r="2.5" fill="#FFFFFF" />
          <circle cx="37" cy="23" r="2.5" fill="#FFFFFF" />
          {!hungry && (
            // Kibble pile
            <g>
              <ellipse cx="30" cy="18" rx="14" ry="6" fill="#78350F" stroke="#4D2B82" strokeWidth="1.5" />
              <circle cx="24" cy="17" r="2.5" fill="#92400E" />
              <circle cx="35" cy="18" r="2.5" fill="#92400E" />
              <circle cx="30" cy="16" r="3" fill="#78350F" />
            </g>
          )}
        </svg>
      );
    case "cow":
      return (
        <svg viewBox="0 0 60 40" className="w-15 h-12 filter drop-shadow-md">
          {/* Large ranch trough */}
          <rect x="4" y="10" width="52" height="24" fill="#78350F" stroke="#4D2B82" strokeWidth="3.5" rx="4" />
          <line x1="12" y1="10" x2="12" y2="34" stroke="#4D2B82" strokeWidth="2.5" />
          <line x1="22" y1="10" x2="22" y2="34" stroke="#4D2B82" strokeWidth="2.5" />
          <line x1="32" y1="10" x2="32" y2="34" stroke="#4D2B82" strokeWidth="2.5" />
          <line x1="42" y1="10" x2="42" y2="34" stroke="#4D2B82" strokeWidth="2.5" />
          {!hungry && (
            // Rich green grass feed
            <path d="M 6 12 Q 13 -7 18 12 Q 25 -10 32 12 Q 40 -7 48 12 Q 52 -5 54 12 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
          )}
        </svg>
      );
    case "bee":
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          {/* Ceramic bowl filled with flowers for honey feeding */}
          <ellipse cx="30" cy="30" rx="20" ry="8" fill="#F59E0B" stroke="#4D2B82" strokeWidth="3" />
          <path d="M 10 22 Q 30 14 50 22 L 50 30 Q 30 22 10 30 Z" fill="#FEF3C7" stroke="#4D2B82" strokeWidth="3" />
          {!hungry && (
            // Golden sweet sugar nectar
            <g>
              <ellipse cx="30" cy="18" rx="13" ry="5" fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
              <circle cx="28" cy="18" r="4" fill="#EF4444" />
              <circle cx="28" cy="18" r="1.5" fill="#FDE047" />
              <circle cx="34" cy="17" r="3.5" fill="#A855F7" />
              <circle cx="34" cy="17" r="1.2" fill="#FDE047" />
            </g>
          )}
        </svg>
      );
    case "fish":
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          {/* Professional water feeding ring */}
          <ellipse cx="30" cy="20" rx="22" ry="11" fill="none" stroke="#F43F5E" strokeWidth="4.5" />
          {!hungry && (
            // Floating pellets inside
            <g>
              <circle cx="22" cy="19" r="2.5" fill="#DC2626" />
              <circle cx="35" cy="18" r="2" fill="#854D0E" />
              <circle cx="28" cy="22" r="2.5" fill="#DC2626" />
              <circle cx="32" cy="21" r="2.2" fill="#854D0E" />
              <circle cx="29" cy="17" r="2" fill="#DC2626" />
            </g>
          )}
        </svg>
      );
    case "bird":
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          {/* Hanging bird plate tray with chain */}
          <line x1="30" y1="0" x2="14" y2="24" stroke="#4D2B82" strokeWidth="2.5" />
          <line x1="30" y1="0" x2="46" y2="24" stroke="#4D2B82" strokeWidth="2.5" />
          <rect x="10" y="22" width="40" height="10" fill="#4B5563" stroke="#4D2B82" strokeWidth="3" rx="2" />
          {!hungry && (
            // Grain feed seeds
            <path d="M 12 24 Q 30 14 48 24 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
          )}
        </svg>
      );
  }
}

// ─── Plants & Decorations ─────────────────────────────────────────

export function SVGTopDownPlant({ type, stage }: { type: "apple" | "orange" | "flower" | "sunflower"; stage: number }) {
  const leafColor = "#22C55E";
  const isTree = type === "apple" || type === "orange";

  if (stage === 0) {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto">
        <circle cx="50" cy="50" r="30" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        <ellipse cx="50" cy="50" rx="18" ry="10" fill="#4E3629" />
        <path d="M 50 35 Q 40 25 42 32 Q 45 42 50 35 C 55 42, 58 32, 50 35" fill="#AEEA00" stroke="#4D2B82" strokeWidth="1.5" />
      </svg>
    );
  }
  if (stage === 1) {
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
    return (
      <svg viewBox="0 0 100 100" className="w-18 h-18 mx-auto">
        <circle cx="50" cy="50" r="34" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        {isTree ? (
          <><circle cx="50" cy="50" r="28" fill="#16A34A" stroke="#4D2B82" strokeWidth="3" />
          <circle cx="45" cy="45" r="18" fill="#4ADE80" opacity="0.4" /></>
        ) : (
          <><path d="M 50 50 L 50 20" stroke="#15803D" strokeWidth="5" />
          <circle cx="50" cy="20" r="12" fill="#FBBF24" stroke="#4D2B82" strokeWidth="2.5" /></>
        )}
      </svg>
    );
  }
  if (type === "apple") {
    return (
      <svg viewBox="0 0 100 100" className="w-22 h-22 mx-auto">
        <circle cx="50" cy="50" r="35" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="38" fill="#16A34A" stroke="#4D2B82" strokeWidth="3.5" />
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
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto">
      <circle cx="50" cy="50" r="35" fill="#5C4033" stroke="#4D2B82" strokeWidth="2.5" />
      <path d="M 50 50 L 50 25" stroke="#15803D" strokeWidth="6" />
      <g transform="translate(50, 25)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse key={deg} cx="0" cy="0" rx="4" ry="14" fill="#FBBF24" stroke="#4D2B82" strokeWidth="1.5" transform={`rotate(${deg})`} />
        ))}
        <circle cx="0" cy="0" r="8" fill="#78350F" stroke="#4D2B82" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function SVGSun({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs><linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF275" /><stop offset="100%" stopColor="#FF9F29" />
      </linearGradient></defs>
      <g className="animate-[spin_45s_linear_infinite]" style={{ transformOrigin: "50px 50px" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <polygon key={deg} points="50,12 43,30 57,30" fill="#FFD700" stroke="#4D2B82" strokeWidth="2.5" transform={`rotate(${deg} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="24" fill="url(#sunGrad)" stroke="#4D2B82" strokeWidth="3.5" />
      <circle cx="43" cy="46" r="2.5" fill="#4D2B82" /><circle cx="57" cy="46" r="2.5" fill="#4D2B82" />
      <circle cx="37" cy="51" r="2" fill="#FF8A8A" opacity="0.6" />
      <circle cx="63" cy="51" r="2" fill="#FF8A8A" opacity="0.6" />
      <path d="M 45 52 Q 50 58 55 52" stroke="#4D2B82" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function SVGFarmerHouse({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className}>
      <defs>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D4D" />
          <stop offset="100%" stopColor="#C0392B" />
        </linearGradient>
        <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#ECEFF1" />
        </linearGradient>
        <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>
      </defs>
      {/* Stone Foundation */}
      <rect x="25" y="115" width="150" height="20" fill="#7F8C8D" stroke="#2C3E50" strokeWidth="3" rx="3" />
      {/* Wall */}
      <rect x="30" y="55" width="140" height="60" fill="url(#wallGrad)" stroke="#4D2B82" strokeWidth="4" />
      {/* Roof */}
      <polygon points="15,55 100,10 185,55" fill="url(#roofGrad)" stroke="#4D2B82" strokeWidth="4" />
      <polygon points="35,55 100,20 165,55" fill="#E74C3C" opacity="0.3" />
      {/* Chimney */}
      <rect x="135" y="18" width="18" height="25" fill="#7B241C" stroke="#4D2B82" strokeWidth="3" />
      <rect x="131" y="14" width="26" height="5" fill="#C0392B" stroke="#4D2B82" strokeWidth="2" />
      {/* Chimney Smoke Puffs */}
      <motion.circle cx="144" cy="5" r="4" fill="#BDC3C7" opacity="0.6" animate={{ y: [-5, -25], scale: [1, 2], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} />
      <motion.circle cx="144" cy="5" r="5" fill="#ECF0F1" opacity="0.8" animate={{ y: [-5, -35], scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.8, ease: "easeOut" }} />
      
      {/* Door */}
      <rect x="85" y="75" width="30" height="40" fill="url(#doorGrad)" stroke="#4D2B82" strokeWidth="3.5" rx="2" />
      <circle cx="110" cy="95" r="3" fill="#F1C40F" stroke="#4D2B82" strokeWidth="1" />
      {/* Windows */}
      <rect x="45" y="70" width="22" height="22" fill="#FEDE43" stroke="#4D2B82" strokeWidth="3.5" rx="3" />
      <line x1="56" y1="70" x2="56" y2="92" stroke="#4D2B82" strokeWidth="2.5" />
      <line x1="45" y1="81" x2="67" y2="81" stroke="#4D2B82" strokeWidth="2.5" />
      
      <rect x="133" y="70" width="22" height="22" fill="#FEDE43" stroke="#4D2B82" strokeWidth="3.5" rx="3" />
      <line x1="144" y1="70" x2="144" y2="92" stroke="#4D2B82" strokeWidth="2.5" />
      <line x1="133" y1="81" x2="155" y2="81" stroke="#4D2B82" strokeWidth="2.5" />
      
      {/* Cute Attic Window */}
      <circle cx="100" cy="38" r="10" fill="#FEDE43" stroke="#4D2B82" strokeWidth="3" />
      <line x1="100" y1="28" x2="100" y2="48" stroke="#4D2B82" strokeWidth="2" />
      <line x1="90" y1="38" x2="110" y2="38" stroke="#4D2B82" strokeWidth="2" />
      
      {/* Flower Bed / bushes in front */}
      <circle cx="35" cy="115" r="8" fill="#2ECC71" />
      <circle cx="45" cy="117" r="7" fill="#27AE60" />
      <circle cx="32" cy="113" r="3" fill="#E74C3C" />
      <circle cx="42" cy="114" r="3.5" fill="#E74C3C" />
      <circle cx="160" cy="115" r="9" fill="#2ECC71" />
      <circle cx="152" cy="116" r="7" fill="#27AE60" />
      <circle cx="158" cy="112" r="3.5" fill="#F1C40F" />
      <circle cx="150" cy="114" r="3" fill="#F1C40F" />
    </svg>
  );
}

export function SVGDecorTree({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path d="M 50 80 L 50 50" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="40" r="22" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
      <circle cx="42" cy="32" r="14" fill="#4ADE80" opacity="0.6" />
    </svg>
  );
}

export function SVGDecorFlowers({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 50" className={className}>
      <circle cx="25" cy="25" r="8" fill="#F43F5E" />
      <circle cx="15" cy="25" r="7" fill="#F43F5E" />
      <circle cx="35" cy="25" r="7" fill="#F43F5E" />
      <circle cx="25" cy="15" r="7" fill="#F43F5E" />
      <circle cx="25" cy="35" r="7" fill="#F43F5E" />
      <circle cx="25" cy="25" r="5" fill="#FEF08A" />
    </svg>
  );
}

// ─── Configuration & Interfaces ───────────────────────────────────

type PaddockType = "sheep" | "rabbit" | "duck" | "pet" | "cow" | "bee" | "fish" | "bird";

const HUNGER_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in ms

const PADDOCK_DATA: Record<PaddockType, {
  name: string; emoji: string; buyCost: number; feedCost: number;
  productEmoji: string; productName: string; productStars: number;
}> = {
  sheep:  { name: "حظيرة الخراف",   emoji: "🐑",   buyCost: 20, feedCost: 3, productEmoji: "🧶", productName: "صوف",   productStars: 5  },
  rabbit: { name: "حظيرة الأرانب",  emoji: "🐰",   buyCost: 15, feedCost: 3, productEmoji: "🥕", productName: "جزر",   productStars: 4  },
  duck:   { name: "بحيرة البط",     emoji: "🦆",   buyCost: 22, feedCost: 3, productEmoji: "🥚", productName: "بيض",   productStars: 5  },
  pet:    { name: "حظيرة الأصدقاء", emoji: "🐱🐶", buyCost: 25, feedCost: 3, productEmoji: "❤️", productName: "حب",    productStars: 4  },
  cow:    { name: "حظيرة الأبقار",  emoji: "🐄",   buyCost: 35, feedCost: 5, productEmoji: "🥛", productName: "حليب",  productStars: 7  },
  bee:    { name: "خلية النحل",     emoji: "🐝",   buyCost: 30, feedCost: 4, productEmoji: "🍯", productName: "عسل",   productStars: 8  },
  fish:   { name: "بركة السمك",     emoji: "🐟",   buyCost: 18, feedCost: 3, productEmoji: "🐠", productName: "سمك",   productStars: 5  },
  bird:   { name: "قفص العصافير",   emoji: "🦜",   buyCost: 12, feedCost: 2, productEmoji: "🎵", productName: "أغاني", productStars: 3  },
};

const ALL_PADDOCK_TYPES: PaddockType[] = ["sheep", "rabbit", "duck", "pet", "cow", "bee", "fish", "bird"];

interface GardenPlot {
  id: number;
  plantType: "apple" | "orange" | "flower" | "sunflower" | null;
  isWatered: boolean;
  growthEndTime: number | null;
}

interface AnimalState {
  id: number; x: number; y: number; isEating: boolean; angle: number;
}

interface FeedingData {
  lastFedTime: number;
  fedCount: number;
}

interface MagicGardenProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars: React.Dispatch<React.SetStateAction<number>>;
}

// ─── Component ────────────────────────────────────────────────────

export default function MagicGarden({ onClose, globalStars, setGlobalStars }: MagicGardenProps) {
  const [introActive, setIntroActive] = useState(true);

  // Dynamic zoom scale state
  const [zoomScale, setZoomScale] = useState<number>(0.8);

  // 3D upright transform to cancel map rotation and make elements stand perpendicular to the ground
  const uprightStyle = {
    transform: "rotateZ(45deg) rotateX(-58deg)",
    transformOrigin: "bottom center",
    transformStyle: "preserve-3d" as const,
  };

  // Plots
  const [plots, setPlots] = useState<GardenPlot[]>([]);

  // Animal counts (all 8 types)
  const [animalCounts, setAnimalCounts] = useState<Record<PaddockType, number>>({
    sheep: 0, rabbit: 0, duck: 0, pet: 0, cow: 0, bee: 0, fish: 0, bird: 0,
  });

  // Animal visual lists
  const [animalLists, setAnimalLists] = useState<Record<PaddockType, AnimalState[]>>({
    sheep: [], rabbit: [], duck: [], pet: [], cow: [], bee: [], fish: [], bird: [],
  });

  // Feeding state
  const [feedingState, setFeedingState] = useState<Record<PaddockType, FeedingData>>({
    sheep: { lastFedTime: 0, fedCount: 0 }, rabbit: { lastFedTime: 0, fedCount: 0 },
    duck: { lastFedTime: 0, fedCount: 0 }, pet: { lastFedTime: 0, fedCount: 0 },
    cow: { lastFedTime: 0, fedCount: 0 }, bee: { lastFedTime: 0, fedCount: 0 },
    fish: { lastFedTime: 0, fedCount: 0 }, bird: { lastFedTime: 0, fedCount: 0 },
  });

  // Products ready to collect
  const [pendingProducts, setPendingProducts] = useState<Record<PaddockType, boolean>>({
    sheep: false, rabbit: false, duck: false, pet: false,
    cow: false, bee: false, fish: false, bird: false,
  });

  // Weather / Time of day
  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("day");

  // Modals & UI
  const [activePlotId, setActivePlotId] = useState<number | null>(null);
  const [showSeedShop, setShowSeedShop] = useState(false);
  const [selectedPaddockToBuy, setSelectedPaddockToBuy] = useState<PaddockType | null>(null);
  const [noticeText, setNoticeText] = useState<string | null>(null);
  const [timeTick, setTimeTick] = useState(0);

  // Seed metadata
  const seedsData = [
    { type: "apple", name: "شجرة التفاح 🍎", cost: 10, payout: 25 },
    { type: "orange", name: "شجرة البرتقال 🍊", cost: 15, payout: 35 },
    { type: "flower", name: "زهرة الورد الجوري 🌸", cost: 8, payout: 20 },
    { type: "sunflower", name: "عباد الشمس السعيد 🌻", cost: 12, payout: 30 },
  ] as const;

  // ─── Effects ──────────────────────────────────────────────────

  // Lock screen orientation to landscape on mobile
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

  // Initialize / Load state
  useEffect(() => {
    setTimeout(() => setIntroActive(false), 2000);

    // Auto zoom based on mobile screen width
    if (window.innerWidth < 800) {
      setZoomScale(0.55); // Zoom out automatically on phone so they can view it all
    }

    // Load plots
    const savedPlots = localStorage.getItem("bloomly_garden_plots_v2");
    if (savedPlots) {
      setPlots(JSON.parse(savedPlots));
    } else {
      const defaultPlots: GardenPlot[] = Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1, plantType: null, isWatered: false, growthEndTime: null,
      }));
      setPlots(defaultPlots);
      localStorage.setItem("bloomly_garden_plots_v2", JSON.stringify(defaultPlots));
    }

    // Load animal counts
    const counts: Record<PaddockType, number> = {
      sheep: Number(localStorage.getItem("bloomly_sheep_count") || "1"),
      rabbit: Number(localStorage.getItem("bloomly_rabbit_count") || "1"),
      duck: Number(localStorage.getItem("bloomly_duck_count") || "1"),
      pet: Number(localStorage.getItem("bloomly_pet_count") || "1"),
      cow: Number(localStorage.getItem("bloomly_cow_count") || "0"),
      bee: Number(localStorage.getItem("bloomly_bee_count") || "0"),
      fish: Number(localStorage.getItem("bloomly_fish_count") || "0"),
      bird: Number(localStorage.getItem("bloomly_bird_count") || "0"),
    };
    setAnimalCounts(counts);

    // Load feeding state
    const savedFeeding = localStorage.getItem("bloomly_feeding_state");
    if (savedFeeding) {
      try { setFeedingState(JSON.parse(savedFeeding)); } catch (e) {}
    }

    // Load pending products
    const savedProducts = localStorage.getItem("bloomly_pending_products");
    if (savedProducts) {
      try { setPendingProducts(JSON.parse(savedProducts)); } catch (e) {}
    }
  }, []);

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => setTimeTick(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animal wandering
  useEffect(() => {
    const makeAnimals = (count: number) =>
      Array.from({ length: count }).map((_, i) => ({
        id: i, x: 40 + Math.random() * 160, y: 40 + Math.random() * 140,
        isEating: false, angle: Math.random() * 360,
      }));

    const newLists: Record<PaddockType, AnimalState[]> = {} as any;
    ALL_PADDOCK_TYPES.forEach(type => {
      newLists[type] = makeAnimals(animalCounts[type]);
    });
    setAnimalLists(newLists);
  }, [animalCounts]);

  useEffect(() => {
    const wanderInterval = setInterval(() => {
      const updateWander = (list: AnimalState[]) =>
        list.map(ani => {
          if (Math.random() < 0.3) return { ...ani, isEating: true };
          return {
            ...ani, isEating: false,
            x: Math.max(20, Math.min(220, ani.x + (Math.random() * 60 - 30))),
            y: Math.max(20, Math.min(180, ani.y + (Math.random() * 50 - 25))),
            angle: Math.random() * 360,
          };
        });

      setAnimalLists(prev => {
        const next = { ...prev };
        ALL_PADDOCK_TYPES.forEach(type => { next[type] = updateWander(prev[type]); });
        return next;
      });
    }, 3500);
    return () => clearInterval(wanderInterval);
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────

  const savePlots = (newPlots: GardenPlot[]) => {
    setPlots(newPlots);
    localStorage.setItem("bloomly_garden_plots_v2", JSON.stringify(newPlots));
  };

  const saveAnimalCount = (type: PaddockType, val: number) => {
    localStorage.setItem(`bloomly_${type}_count`, val.toString());
    setAnimalCounts(prev => ({ ...prev, [type]: val }));
  };

  const saveFeedingState = (newState: Record<PaddockType, FeedingData>) => {
    setFeedingState(newState);
    localStorage.setItem("bloomly_feeding_state", JSON.stringify(newState));
  };

  const savePendingProducts = (newProds: Record<PaddockType, boolean>) => {
    setPendingProducts(newProds);
    localStorage.setItem("bloomly_pending_products", JSON.stringify(newProds));
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

  const isHungry = (type: PaddockType) => {
    const fs = feedingState[type];
    if (!fs || fs.lastFedTime === 0) return true;
    return Date.now() - fs.lastFedTime > HUNGER_INTERVAL;
  };

  const isAdult = (type: PaddockType) => {
    return (feedingState[type]?.fedCount || 0) >= 5;
  };

  // Zoom control handlers
  const handleZoomIn = () => setZoomScale(prev => Math.min(1.4, prev + 0.1));
  const handleZoomOut = () => setZoomScale(prev => Math.max(0.4, prev - 0.1));
  const handleZoomReset = () => setZoomScale(window.innerWidth < 800 ? 0.55 : 0.8);

  const getTimerString = (endTime: number | null) => {
    if (!endTime) return "";
    const diff = endTime - Date.now();
    if (diff <= 0) return "جاهز! ★";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // ─── Handlers ─────────────────────────────────────────────────

  const handlePlantSeed = (seedType: typeof seedsData[number]["type"]) => {
    const seed = seedsData.find(s => s.type === seedType);
    if (!seed || activePlotId === null) return;
    if (globalStars < seed.cost) {
      synth.playPop(); triggerNotice("❌ ليس لديك نجوم كافية لشراء هذه البذرة!"); return;
    }
    updateStars(-seed.cost); synth.playPop();
    const newPlots = plots.map(p => p.id === activePlotId ? { ...p, plantType: seedType, isWatered: false, growthEndTime: null } : p);
    savePlots(newPlots); setShowSeedShop(false); setActivePlotId(null);
    triggerNotice(`🌱 تم زراعة بذرة ${seed.name}! اسقها الآن لتبدأ النمو.`);
  };

  const handleWater = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.plantType === null || plot.isWatered) return;
    if (globalStars < 2) { synth.playPop(); triggerNotice("❌ تحتاج ٢ نجمة 💧 للري!"); return; }
    updateStars(-2); synth.playWaterPour();
    const endTime = Date.now() + 30 * 60 * 1000;
    const newPlots = plots.map(p => p.id === plotId ? { ...p, isWatered: true, growthEndTime: endTime } : p);
    savePlots(newPlots); triggerNotice("💧 تم الري بنجاح! ستبدأ النبتة بالنمو، وتكتمل بعد ٣٠ دقيقة.");
  };

  const handleHarvest = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.plantType === null || !plot.isWatered || !plot.growthEndTime) return;
    if (Date.now() < plot.growthEndTime) return;
    updateStars(10); synth.playHarvest();
    triggerNotice(`🎉 تهانينا! قمت بحصاد النجمة وحصلت على +10 نجوم! ⭐`);
    const newPlots = plots.map(p => p.id === plotId ? { id: p.id, plantType: null, isWatered: false, growthEndTime: null } : p);
    savePlots(newPlots);
  };

  const handleFastForward = (plotId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const plot = plots.find(p => p.id === plotId);
    if (!plot || !plot.isWatered) return;
    synth.playHarvest();
    const newPlots = plots.map(p => p.id === plotId ? { ...p, growthEndTime: Date.now() - 1000 } : p);
    savePlots(newPlots); triggerNotice("⚡ تم تسريع النمو بنجاح للفحص السريع!");
  };

  const handleBuyAnimal = (type: PaddockType) => {
    const config = PADDOCK_DATA[type];
    const currentCount = animalCounts[type];
    if (currentCount >= 12) {
      synth.playPop(); triggerNotice(`❌ ${config.name} ممتلئة بالكامل (الحد الأقصى ١٢ حيوان).`); return;
    }
    if (globalStars < config.buyCost) {
      synth.playPop(); triggerNotice("❌ ليس لديك نجوم كافية لشراء هذا الحيوان!"); return;
    }
    updateStars(-config.buyCost); synth.playPetUnlock();
    saveAnimalCount(type, currentCount + 1);
    triggerNotice(`🐣 تم شراء ${config.emoji} جديد وإضافته لـ${config.name}!`);
  };

  // Feeding system
  const handleFeedPaddock = (type: PaddockType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (animalCounts[type] === 0) {
      synth.playPop(); triggerNotice("❌ لا يوجد حيوانات في هذه الحظيرة! اشترِ حيواناً أولاً."); return;
    }
    if (!isHungry(type)) {
      synth.playPop(); triggerNotice("😊 الحيوانات شبعانة! الطبق لسه ممتلئ."); return;
    }
    const config = PADDOCK_DATA[type];
    if (globalStars < config.feedCost) {
      synth.playPop(); triggerNotice(`❌ تحتاج ${config.feedCost} نجوم لملء الطبق!`); return;
    }
    updateStars(-config.feedCost); synth.playFeed();
    const newFeeding = { ...feedingState, [type]: { lastFedTime: Date.now(), fedCount: (feedingState[type]?.fedCount || 0) + 1 } };
    saveFeedingState(newFeeding);
    const newProds = { ...pendingProducts, [type]: true };
    savePendingProducts(newProds);
    const newFedCount = newFeeding[type].fedCount;
    if (newFedCount === 5) {
      triggerNotice(`🎉 حيوانات ${config.name} كبرت! أصبحت بالغة وتنتج ضعف النجوم! ⭐⭐`);
    } else {
      triggerNotice(`🍽️ تم ملء طبق ${config.name}! الحيوانات بتأكل... ${config.productEmoji}`);
    }
  };

  // Collect products
  const handleCollectProduct = (type: PaddockType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pendingProducts[type]) return;
    const config = PADDOCK_DATA[type];
    const stars = isAdult(type) ? config.productStars * 2 : config.productStars;
    updateStars(stars); synth.playCollect();
    const newProds = { ...pendingProducts, [type]: false };
    savePendingProducts(newProds);
    triggerNotice(`${config.productEmoji} تم جمع ${config.productName}! +${stars} نجوم ⭐${isAdult(type) ? " (ضعف - بالغ!)" : ""}`);
  };

  // Weather toggle
  const toggleTimeOfDay = () => {
    synth.playPop();
    setTimeOfDay(prev => prev === "day" ? "sunset" : prev === "sunset" ? "night" : "day");
  };

  // Weather-based backgrounds
  const outerBg = timeOfDay === "day" ? "bg-[#DCFCE7]" : timeOfDay === "sunset" ? "bg-[#FFE8CC]" : "bg-[#0f172a]";
  const mapBg = timeOfDay === "day"
    ? "bg-gradient-to-br from-[#A2E3A2] via-[#B2EBB2] to-[#AEE8AE]"
    : timeOfDay === "sunset"
    ? "bg-gradient-to-br from-[#FFD4A2] via-[#FFB088] to-[#C8E6C9]"
    : "bg-gradient-to-br from-[#1a2a3a] via-[#2a3a4a] to-[#1a3a2a]";
  const roadColor = timeOfDay === "night" ? "bg-[#8B7355]" : "bg-[#E1C699]";
  const roadBorder = timeOfDay === "night" ? "border-[#6B5335]/40" : "border-[#8C6D47]/40";

  // Render animal SVG by type
  const renderAnimalSVG = (type: PaddockType, animal: AnimalState, adult: boolean) => {
    const size = adult ? "w-11 h-11" : "w-7 h-7";
    switch (type) {
      case "sheep": return <SVGSheep className={size} isEating={animal.isEating} />;
      case "rabbit": return <SVGBunny className={size} isEating={animal.isEating} />;
      case "duck": return <SVGDuck className={size} isEating={animal.isEating} />;
      case "pet": return animal.id % 2 === 0 ? <SVGKitty className={size} isEating={animal.isEating} /> : <SVGPuppy className={size} isEating={animal.isEating} />;
      case "cow": return <SVGCow className={size} isEating={animal.isEating} />;
      case "bee": return <SVGBee className={size} isEating={animal.isEating} />;
      case "fish": return <SVGFish className={size} isEating={animal.isEating} />;
      case "bird": return <SVGBird className={size} isEating={animal.isEating} />;
    }
  };

  // ─── JSX Render ───────────────────────────────────────────────

  return (
    <div className={`fixed inset-0 z-[9990] select-none font-sans flex flex-col justify-between overflow-hidden transition-colors duration-1000 ${outerBg}`}>

      {/* Cloud Intro */}
      <AnimatePresence>
        {introActive && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex pointer-events-none select-none">
            <motion.div initial={{ x: 0 }} animate={{ x: "-100%" }} transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-[#E0F2FE] flex items-center justify-end relative shadow-2xl">
              <div className="absolute right-[-80px] w-48 h-full flex flex-col justify-around text-white/95 text-9xl">
                <span>☁️</span><span>☁️</span><span>☁️</span>
              </div>
            </motion.div>
            <motion.div initial={{ x: 0 }} animate={{ x: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-[#E0F2FE] flex items-center justify-start relative shadow-2xl">
              <div className="absolute left-[-80px] w-48 h-full flex flex-col justify-around text-white/95 text-9xl">
                <span>☁️</span><span>☁️</span><span>☁️</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Stars (Top-Right) */}
      <div className="absolute top-4 right-4 z-[9990] select-none pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-3 border-[#D97706] text-[#D97706] font-black text-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-lg text-yellow-400">★</span>
          <span>نجومك: {globalStars}</span>
        </div>
      </div>

      {/* Floating Exit (Top-Left) */}
      <div className="absolute top-4 left-4 z-[9990] select-none pointer-events-auto">
        <button onClick={() => { synth.playPop(); onClose(); }}
          className="w-12 h-12 bg-white hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center cursor-pointer border-3 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all">
          <X className="w-6 h-6 stroke-[3px]" />
        </button>
      </div>

      {/* Floating Zoom Control Panel (Left Center Side) */}
      <div className="absolute top-4 left-20 z-[9990] select-none pointer-events-auto flex items-center gap-1 bg-white/95 border-3 border-[#4D2B82] rounded-full p-1 shadow-lg backdrop-blur-xs">
        <button onClick={handleZoomOut}
          className="w-10 h-10 hover:bg-purple-100 text-[#4D2B82] font-black text-lg rounded-full flex items-center justify-center cursor-pointer transition-colors">
          <ZoomOut className="w-5 h-5" />
        </button>
        <span onClick={handleZoomReset}
          className="text-xs font-black text-[#4D2B82] px-2.5 cursor-pointer select-none hover:text-purple-600 transition-colors">
          {Math.round(zoomScale * 100)}%
        </span>
        <button onClick={handleZoomIn}
          className="w-10 h-10 hover:bg-purple-100 text-[#4D2B82] font-black text-lg rounded-full flex items-center justify-center cursor-pointer transition-colors">
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Weather Toggle Button (Top-Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9990] select-none pointer-events-auto">
        <button onClick={toggleTimeOfDay}
          className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border-3 shadow-lg active:scale-95 transition-all text-2xl ${
            timeOfDay === "day" ? "bg-[#FEF9C3] border-[#D97706] shadow-[0_4px_0_0_#D97706]"
            : timeOfDay === "sunset" ? "bg-[#FFE4C4] border-[#C2410C] shadow-[0_4px_0_0_#C2410C]"
            : "bg-[#1e293b] border-[#6366F1] shadow-[0_4px_0_0_#6366F1]"
          }`}>
          {timeOfDay === "day" ? "☀️" : timeOfDay === "sunset" ? "🌅" : "🌙"}
        </button>
      </div>

      {/* Notification Banner */}
      <AnimatePresence>
        {noticeText && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 inset-x-0 mx-auto w-fit max-w-sm px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{
              borderColor: noticeText.startsWith("❌") ? "#EF4444" : noticeText.startsWith("🌱") ? "#2ECC71" : "#FF9F29",
              color: noticeText.startsWith("❌") ? "#EF4444" : "#4D2B82",
            }}>
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Map (3D Isometric Pop-up View) ─────────────────────────── */}
      <main 
        className={`flex-grow w-full overflow-auto scrollbar-none relative border-t-2 ${
          timeOfDay === "night" ? "bg-gradient-to-b from-[#111827] via-[#311042] to-[#1E1B4B]" : "bg-gradient-to-b from-[#A0C4FF] via-[#E2F0D9] to-[#FDFFB6]"
        } transition-colors duration-1000`}
        style={{
          perspective: "2500px",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Scrollable container with padding to allow full rotation without clipping */}
        <div className="flex items-center justify-center p-[200px] md:p-[300px] min-w-max min-h-max" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Floating 3D Island */}
          <div 
            className={`w-[1800px] h-[1300px] p-8 select-none transition-all duration-1000 ${mapBg}`}
            style={{
              transform: `scale(${zoomScale}) rotateX(56deg) rotateZ(-45deg)`,
              transformOrigin: "center center",
              transformStyle: "preserve-3d",
              borderRadius: "80px",
              border: "12px solid #4D2B82",
              boxShadow: timeOfDay === "night" 
                ? "0 22px 0 0 #2A100B, 0 44px 0 0 #150604, 0 60px 120px rgba(0,0,0,0.8)" 
                : "0 22px 0 0 #8B5A2B, 0 44px 0 0 #5C3A21, 0 60px 120px rgba(0,0,0,0.45)",
              position: "relative"
            }}
          >

            {/* Dirt roads */}
            <div className={`absolute top-[340px] left-[50px] w-[1700px] h-12 ${roadColor} border-y-3 border-dashed ${roadBorder} z-0 transition-colors duration-1000`} />
            <div className={`absolute top-[80px] left-[420px] w-12 h-[1100px] ${roadColor} border-x-3 border-dashed ${roadBorder} z-0 transition-colors duration-1000`} />
            <div className={`absolute top-[680px] left-[50px] w-[1700px] h-12 ${roadColor} border-y-3 border-dashed ${roadBorder} z-0 transition-colors duration-1000`} />

            {/* Sky decoration */}
            {timeOfDay === "day" && (
              <div className="absolute top-8 right-24 pointer-events-none opacity-40 z-0">
                <SVGSun className="w-28 h-28" />
              </div>
            )}
            {timeOfDay === "sunset" && (
              <div className="absolute top-4 right-20 pointer-events-none z-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#FF6B35] to-[#FFD700] opacity-40 blur-xl" />
                <SVGSun className="w-24 h-24 absolute top-4 left-4 opacity-60" />
              </div>
            )}
            {timeOfDay === "night" && (
              <div className="absolute top-6 right-20 pointer-events-none z-0">
                <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-80">
                  <path d="M 60 20 Q 30 20, 30 50 Q 30 80, 60 80 Q 40 70, 40 50 Q 40 30, 60 20 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
                </svg>
                {/* Twinkling stars */}
                {[{x:100,y:30},{x:200,y:60},{x:350,y:20},{x:500,y:50},{x:650,y:15},{x:800,y:45},{x:1000,y:25},{x:1200,y:55},{x:1400,y:30},{x:1550,y:50}].map((s,i) => (
                  <motion.div key={i} className="absolute text-yellow-200 text-xs" style={{ left: s.x, top: s.y }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}>
                    ✦
                  </motion.div>
                ))}
              </div>
            )}

            {/* 🌲 Path from Farmer's House to Road */}
            <div className="absolute left-[190px] top-[720px] w-6 h-[290px] bg-amber-900/10 border-x-2 border-dashed border-amber-800/10 pointer-events-none" />
            
            {/* 🌲 Landscape Decors (Trees and Flowers) */}
            <div className="absolute left-[370px] top-[120px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-14 h-14" /></div>
            <div className="absolute left-[780px] top-[130px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-14 h-14" /></div>
            <div className="absolute left-[1110px] top-[110px] pointer-events-none opacity-85" style={uprightStyle}><SVGDecorFlowers className="w-10 h-10" /></div>
            <div className="absolute left-[390px] top-[490px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-16 h-16" /></div>
            <div className="absolute left-[820px] top-[500px] pointer-events-none opacity-85" style={uprightStyle}><SVGDecorFlowers className="w-10 h-10" /></div>
            <div className="absolute left-[380px] top-[800px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-14 h-14" /></div>
            <div className="absolute left-[920px] top-[880px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-16 h-16" /></div>
            <div className="absolute left-[1420px] top-[390px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-15 h-15" /></div>
            <div className="absolute left-[1460px] top-[410px] pointer-events-none opacity-85" style={uprightStyle}><SVGDecorFlowers className="w-10 h-10" /></div>
            <div className="absolute left-[110px] top-[950px] pointer-events-none opacity-85" style={uprightStyle}><SVGDecorFlowers className="w-9 h-9" /></div>

            {/* ════════════ PADDOCK 1: DUCK POND (بحيرة البط) ════════════ */}
            <div 
              onClick={() => { synth.playPop(); setSelectedPaddockToBuy("duck"); }}
              className="absolute left-[50px] top-[60px] w-[340px] h-[240px] bg-gradient-to-tr from-[#93C5FD] to-[#2563EB] rounded-[60px] border-4 border-[#1E3A8A] shadow-[0_8px_0_0_#1E3A8A] flex flex-col justify-between p-4 overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="text-white font-black text-xs bg-blue-900/60 w-fit px-2.5 py-0.5 rounded-full z-20" style={uprightStyle}>
                🦆 بحيرة البط ({animalCounts.duck}/12)
              </div>
              
              {/* Detailed custom food dish for duck pond */}
              {animalCounts.duck > 0 && (
                <div 
                  onClick={(e) => handleFeedPaddock("duck", e)}
                  className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${isHungry("duck") ? 'animate-bounce' : ''}`}
                  style={uprightStyle}
                >
                  <SVGFeedingDish type="duck" hungry={isHungry("duck")} />
                  {isHungry("duck") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                  )}
                </div>
              )}

              {/* Product pickup */}
              {pendingProducts.duck && (
                <motion.div
                  animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => handleCollectProduct("duck", e)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                  style={uprightStyle}
                >
                  <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                    <span>🥚</span>
                    <span className="text-yellow-700">+{isAdult("duck") ? 10 : 5}⭐</span>
                  </div>
                </motion.div>
              )}

              {isAdult("duck") && animalCounts.duck > 0 && (
                <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
              )}

              <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                {animalLists.duck.map((a) => (
                  <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/15 rounded-full blur-[1px] z-0" />
                    <div style={uprightStyle} className="relative z-10">
                      {renderAnimalSVG("duck", a, isAdult("duck"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════════════ PADDOCK 2: BIRD CAGE (قفص العصافير) ════════════ */}
            <div 
              onClick={() => { synth.playPop(); setSelectedPaddockToBuy("bird"); }}
              className="absolute left-[460px] top-[60px] w-[300px] h-[230px] bg-gradient-to-br from-[#E8F8F5] to-[#A3E4D7] rounded-[36px] border-4 border-[#0E6251] shadow-[0_8px_0_0_#0E6251] p-4 flex flex-col justify-between overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="text-[#0E6251] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#0E6251] z-20" style={uprightStyle}>
                🦜 قفص العصافير ({animalCounts.bird}/12)
              </div>
              
              {/* Detailed custom food dish for bird */}
              {animalCounts.bird > 0 && (
                <div 
                  onClick={(e) => handleFeedPaddock("bird", e)}
                  className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${isHungry("bird") ? 'animate-bounce' : ''}`}
                  style={uprightStyle}
                >
                  <SVGFeedingDish type="bird" hungry={isHungry("bird")} />
                  {isHungry("bird") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                  )}
                </div>
              )}

              {/* Product pickup */}
              {pendingProducts.bird && (
                <motion.div
                  animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => handleCollectProduct("bird", e)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                  style={uprightStyle}
                >
                  <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                    <span>🎵</span>
                    <span className="text-yellow-700">+{isAdult("bird") ? 6 : 3}⭐</span>
                  </div>
                </motion.div>
              )}

              {isAdult("bird") && animalCounts.bird > 0 && (
                <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
              )}

              <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                {animalLists.bird.map((a) => (
                  <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                    <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-6 h-1.5 bg-black/10 rounded-full blur-[1px] z-0" />
                    <div style={{
                      transform: "rotateZ(45deg) rotateX(-58deg) translateZ(40px)",
                      transformOrigin: "bottom center",
                      transformStyle: "preserve-3d"
                    }} className="relative z-10">
                      {renderAnimalSVG("bird", a, isAdult("bird"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════════════ PADDOCK 3: RABBIT (حظيرة الأرانب) ════════════ */}
            <div 
              onClick={() => { synth.playPop(); setSelectedPaddockToBuy("rabbit"); }}
              className="absolute left-[810px] top-[60px] w-[280px] h-[230px] bg-gradient-to-br from-[#E2F0D9] to-[#C5E1A5] rounded-[32px] border-4 border-[#33691E] shadow-[0_8px_0_0_#33691E] p-3 flex flex-col justify-between overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="text-[#33691E] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#33691E] z-20" style={uprightStyle}>
                🐰 حظيرة الأرانب ({animalCounts.rabbit}/12)
              </div>
 
              {/* Detailed custom food dish for rabbit */}
              {animalCounts.rabbit > 0 && (
                <div 
                  onClick={(e) => handleFeedPaddock("rabbit", e)}
                  className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${isHungry("rabbit") ? 'animate-bounce' : ''}`}
                  style={uprightStyle}
                >
                  <SVGFeedingDish type="rabbit" hungry={isHungry("rabbit")} />
                  {isHungry("rabbit") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                  )}
                </div>
              )}
 
              {/* Product pickup */}
              {pendingProducts.rabbit && (
                <motion.div
                  animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => handleCollectProduct("rabbit", e)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                  style={uprightStyle}
                >
                  <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                    <span>🥕</span>
                    <span className="text-yellow-700">+{isAdult("rabbit") ? 8 : 4}⭐</span>
                  </div>
                </motion.div>
              )}
 
              {isAdult("rabbit") && animalCounts.rabbit > 0 && (
                <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
              )}
 
              <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                {animalLists.rabbit.map((a) => (
                  <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-2 bg-black/15 rounded-full blur-[1px] z-0" />
                    <div style={uprightStyle} className="relative z-10">
                      {renderAnimalSVG("rabbit", a, isAdult("rabbit"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* ════════════ PADDOCK 4: BEEHIVE (خلية النحل) ════════════ */}
            <div 
              onClick={() => { synth.playPop(); setSelectedPaddockToBuy("bee"); }}
              className="absolute left-[1140px] top-[60px] w-[280px] h-[230px] bg-gradient-to-br from-[#FEF3C7] to-[#FCD34D] rounded-[36px] border-4 border-[#78350F] shadow-[0_8px_0_0_#78350F] p-4 flex flex-col justify-between overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="text-[#78350F] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#78350F] z-20" style={uprightStyle}>
                🐝 خلية النحل ({animalCounts.bee}/12)
              </div>
 
              {/* Detailed custom food dish for bees */}
              {animalCounts.bee > 0 && (
                <div 
                  onClick={(e) => handleFeedPaddock("bee", e)}
                  className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${isHungry("bee") ? 'animate-bounce' : ''}`}
                  style={uprightStyle}
                >
                  <SVGFeedingDish type="bee" hungry={isHungry("bee")} />
                  {isHungry("bee") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                  )}
                </div>
              )}
 
              {/* Product pickup */}
              {pendingProducts.bee && (
                <motion.div
                  animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => handleCollectProduct("bee", e)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                  style={uprightStyle}
                >
                  <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                    <span>🍯</span>
                    <span className="text-yellow-700">+{isAdult("bee") ? 16 : 8}⭐</span>
                  </div>
                </motion.div>
              )}
 
              {isAdult("bee") && animalCounts.bee > 0 && (
                <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
              )}
 
              <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                {animalLists.bee.map((a) => (
                  <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-5 h-1.5 bg-black/10 rounded-full blur-[1px] z-0" />
                    <div style={{
                      transform: "rotateZ(45deg) rotateX(-58deg) translateZ(35px)",
                      transformOrigin: "bottom center",
                      transformStyle: "preserve-3d"
                    }} className="relative z-10">
                      {renderAnimalSVG("bee", a, isAdult("bee"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════════════ PADDOCK 5: SHEEP (حظيرة الخراف) ════════════ */}
            <div 
              onClick={() => { synth.playPop(); setSelectedPaddockToBuy("sheep"); }}
              className="absolute left-[50px] top-[400px] w-[320px] h-[250px] bg-[#E8F5E9] rounded-[40px] border-4 border-[#1B5E20] shadow-[0_8px_0_0_#1B5E20] p-4 flex flex-col justify-between overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="text-[#1B5E20] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#1B5E20] z-20" style={uprightStyle}>
                🐑 حظيرة الخراف ({animalCounts.sheep}/12)
              </div>

              {/* Detailed custom food dish for sheep */}
              {animalCounts.sheep > 0 && (
                <div 
                  onClick={(e) => handleFeedPaddock("sheep", e)}
                  className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${isHungry("sheep") ? 'animate-bounce' : ''}`}
                  style={uprightStyle}
                >
                  <SVGFeedingDish type="sheep" hungry={isHungry("sheep")} />
                  {isHungry("sheep") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                  )}
                </div>
              )}

              {/* Product pickup */}
              {pendingProducts.sheep && (
                <motion.div
                  animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => handleCollectProduct("sheep", e)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                  style={uprightStyle}
                >
                  <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                    <span>🧶</span>
                    <span className="text-yellow-700">+{isAdult("sheep") ? 10 : 5}⭐</span>
                  </div>
                </motion.div>
              )}

              {isAdult("sheep") && animalCounts.sheep > 0 && (
                <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
              )}

              <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                {animalLists.sheep.map((a) => (
                  <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/15 rounded-full blur-[1px] z-0" />
                    <div style={uprightStyle} className="relative z-10">
                      {renderAnimalSVG("sheep", a, isAdult("sheep"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════════════ TREE PLOTS (حقول الأشجار) ════════════ */}
            <div className="absolute left-[450px] top-[380px] w-[500px] h-[460px] bg-[#A1887F]/30 rounded-[40px] border-4 border-dashed border-[#8D6E63] p-6 grid grid-cols-5 gap-y-12 gap-x-6 justify-items-center items-center z-10 shadow-inner" style={{ transformStyle: "preserve-3d" }}>
              {plots.map((plot) => {
                const isEmpty = plot.plantType === null;
                const isWatered = plot.isWatered;
                const hasEndTime = plot.growthEndTime !== null;
                const isFullyGrown = hasEndTime && Date.now() >= (plot.growthEndTime || 0);
                return (
                  <div key={plot.id} className="flex flex-col items-center gap-1.5 relative select-none w-18" style={{ transformStyle: "preserve-3d" }}>
                    {!isEmpty && (
                      <div className="absolute top-[-26px] z-20 flex gap-0.5" style={uprightStyle}>
                        {!isWatered && (
                          <button onClick={() => handleWater(plot.id)}
                            className="bg-blue-400 hover:bg-blue-500 text-white rounded-full p-1 border-2 border-blue-600 shadow-md animate-bounce cursor-pointer flex items-center justify-center"
                            title="اسقِ النبتة 💧">
                            <Droplet className="w-3.5 h-3.5 fill-white" />
                          </button>
                        )}
                        {isWatered && !isFullyGrown && (
                          <div className="bg-white border-2 border-emerald-600 rounded-full px-1.5 py-0.5 text-[8px] font-black text-emerald-700 flex items-center gap-0.5 shadow-sm">
                            <Clock className="w-2.5 h-2.5 text-emerald-500" />
                            <span>{getTimerString(plot.growthEndTime)}</span>
                            <button onClick={(e) => handleFastForward(plot.id, e)}
                              className="ml-1 bg-yellow-400 text-yellow-900 border border-yellow-600 rounded-full px-1 py-0 text-[6px] hover:bg-yellow-500 font-extrabold cursor-pointer">
                              ⚡
                            </button>
                          </div>
                        )}
                        {isFullyGrown && (
                          <button onClick={() => handleHarvest(plot.id)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-full p-1 border-2 border-yellow-600 shadow-lg animate-bounce-slow flex items-center justify-center cursor-pointer font-black text-xs"
                            title="احصد النجوم! 🌾">
                            ⭐
                          </button>
                        )}
                      </div>
                    )}
                    <div onClick={() => { synth.playPop(); if (isEmpty) { setActivePlotId(plot.id); setShowSeedShop(true); } }}
                      className={`w-14 h-14 rounded-full flex flex-col justify-end items-center relative cursor-pointer ${
                        isEmpty ? "bg-[#8D6E63] border-3 border-[#4E342E] hover:bg-[#795548] shadow-inner" : "bg-transparent"
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {isEmpty ? (
                        <span className="text-white font-extrabold text-lg mb-1" style={uprightStyle}>+</span>
                      ) : (
                        <div className="mb-[-6px] relative z-10" style={uprightStyle}>
                          <SVGTopDownPlant type={plot.plantType!} stage={isFullyGrown ? 3 : isWatered ? 2 : 1} />
                        </div>
                      )}
                      <div className="absolute bottom-0 w-12 h-3.5 bg-[#5D4037]/60 rounded-full z-0" />
                    </div>
                    <span className="text-[8px] font-black text-[#5D4037] bg-white/60 px-1 py-0.2 rounded border border-amber-200" style={uprightStyle}>
                      أرض {plot.id}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ════════════ PADDOCK 6: PET (حظيرة الأصدقاء) ════════════ */}
            <div 
              onClick={() => { synth.playPop(); setSelectedPaddockToBuy("pet"); }}
              className="absolute left-[1020px] top-[400px] w-[360px] h-[260px] bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] rounded-[40px] border-4 border-[#E65100] shadow-[0_8px_0_0_#E65100] p-4 flex flex-col justify-between overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="text-[#E65100] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#E65100] z-20" style={uprightStyle}>
                🐱🐶 حظيرة الأصدقاء ({animalCounts.pet}/12)
              </div>

              {/* Detailed custom food dish for pets */}
              {animalCounts.pet > 0 && (
                <div 
                  onClick={(e) => handleFeedPaddock("pet", e)}
                  className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${isHungry("pet") ? 'animate-bounce' : ''}`}
                  style={uprightStyle}
                >
                  <SVGFeedingDish type="pet" hungry={isHungry("pet")} />
                  {isHungry("pet") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                  )}
                </div>
              )}

              {/* Product pickup */}
              {pendingProducts.pet && (
                <motion.div
                  animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => handleCollectProduct("pet", e)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                  style={uprightStyle}
                >
                  <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                    <span>❤️</span>
                    <span className="text-yellow-700">+{isAdult("pet") ? 8 : 4}⭐</span>
                  </div>
                </motion.div>
              )}

              {isAdult("pet") && animalCounts.pet > 0 && (
                <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
              )}

              <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                {animalLists.pet.map((a) => (
                  <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/15 rounded-full blur-[1px] z-0" />
                    <div style={uprightStyle} className="relative z-10">
                      {renderAnimalSVG("pet", a, isAdult("pet"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════════════ PADDOCK 7: FISH POND (بركة السمك) ════════════ */}
            <div 
              onClick={() => { synth.playPop(); setSelectedPaddockToBuy("fish"); }}
              className="absolute left-[50px] top-[730px] w-[340px] h-[240px] bg-gradient-to-br from-[#22D3EE] to-[#0891B2] rounded-[60px] border-4 border-[#164E63] shadow-[0_8px_0_0_#164E63] p-4 flex flex-col justify-between overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="text-white font-black text-xs bg-cyan-900/60 w-fit px-2.5 py-0.5 rounded-full z-20" style={uprightStyle}>
                🐟 بركة السمك ({animalCounts.fish}/12)
              </div>

              {/* Detailed custom food dish for fish */}
              {animalCounts.fish > 0 && (
                <div 
                  onClick={(e) => handleFeedPaddock("fish", e)}
                  className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${isHungry("fish") ? 'animate-bounce' : ''}`}
                  style={uprightStyle}
                >
                  <SVGFeedingDish type="fish" hungry={isHungry("fish")} />
                  {isHungry("fish") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                  )}
                </div>
              )}

              {/* Product pickup */}
              {pendingProducts.fish && (
                <motion.div
                  animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => handleCollectProduct("fish", e)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                  style={uprightStyle}
                >
                  <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                    <span>🐠</span>
                    <span className="text-yellow-700">+{isAdult("fish") ? 10 : 5}⭐</span>
                  </div>
                </motion.div>
              )}

              {isAdult("fish") && animalCounts.fish > 0 && (
                <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
              )}

              {/* Water ripple decoration */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
                <div className="w-32 h-8 border-2 border-white rounded-full" />
                <div className="w-24 h-6 border-2 border-white rounded-full mx-auto mt-1" />
              </div>
              <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                {animalLists.fish.map((a) => (
                  <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                    <div style={uprightStyle} className="relative z-10">
                      {renderAnimalSVG("fish", a, isAdult("fish"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════════════ PADDOCK 8: COW (حظيرة الأبقار) ════════════ */}
            <div 
              onClick={() => { synth.playPop(); setSelectedPaddockToBuy("cow"); }}
              className="absolute left-[460px] top-[900px] w-[400px] h-[280px] bg-gradient-to-br from-[#FEF9C3] to-[#F0FDF4] rounded-[40px] border-4 border-[#3F6212] shadow-[0_8px_0_0_#3F6212] p-4 flex flex-col justify-between overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <div className="text-[#3F6212] font-black text-xs bg-white/70 w-fit px-2.5 py-0.5 rounded-full border border-[#3F6212] z-20" style={uprightStyle}>
                🐄 حظيرة الأبقار ({animalCounts.cow}/12)
              </div>

              {/* Detailed custom food dish for cow */}
              {animalCounts.cow > 0 && (
                <div 
                  onClick={(e) => handleFeedPaddock("cow", e)}
                  className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${isHungry("cow") ? 'animate-bounce' : ''}`}
                  style={uprightStyle}
                >
                  <SVGFeedingDish type="cow" hungry={isHungry("cow")} />
                  {isHungry("cow") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                  )}
                </div>
              )}

              {/* Product pickup */}
              {pendingProducts.cow && (
                <motion.div
                  animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => handleCollectProduct("cow", e)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                  style={uprightStyle}
                >
                  <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                    <span>🥛</span>
                    <span className="text-yellow-700">+{isAdult("cow") ? 14 : 7}⭐</span>
                  </div>
                </motion.div>
              )}

              {isAdult("cow") && animalCounts.cow > 0 && (
                <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
              )}

              {/* Fence decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-6 opacity-20 flex items-end gap-3 px-4 pointer-events-none">
                {Array.from({length: 12}).map((_,i) => <div key={i} className="w-2 h-5 bg-amber-800 rounded-t-sm" />)}
              </div>
              <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                {animalLists.cow.map((a) => (
                  <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-2.5 bg-black/15 rounded-full blur-[1px] z-0" />
                    <div style={uprightStyle} className="relative z-10">
                      {renderAnimalSVG("cow", a, isAdult("cow"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🏡 FARMER'S HOUSE (منزل المزارع) */}
            <div 
              onClick={() => {
                synth.playPop();
                triggerNotice("🏡 مرحباً بك في منزلي السعيد! أنا المزارع سعيد 👨‍🌾👋");
              }}
              className="absolute left-[50px] top-[1000px] w-[340px] h-[260px] z-10 cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all"
              style={uprightStyle}
            >
              <SVGFarmerHouse />
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-white/90 border-2 border-amber-300 px-3.5 py-1 rounded-full text-[10px] font-black text-amber-800 shadow-md whitespace-nowrap">
                🏡 منزل المزارع سعيد
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ─── Seed Shop Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showSeedShop && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-[#4D2B82] rounded-[32px] p-6 max-w-md w-full text-center shadow-[0_8px_0_0_#4D2B82] relative">
              <button onClick={() => { synth.playPop(); setShowSeedShop(false); setActivePlotId(null); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black text-[#4D2B82] mb-1">🌱 متجر البذور السحرية</h2>
              <p className="text-xs font-bold text-purple-400 mb-6">شراء البذرة يستهلك نجوماً، وتربح نجوماً مضاعفة عند الحصاد!</p>
              <div className="grid grid-cols-2 gap-4">
                {seedsData.map((seed) => (
                  <button key={seed.type} onClick={() => handlePlantSeed(seed.type)}
                    className="card-bubbly p-4 bg-purple-50/40 hover:bg-purple-50 flex flex-col items-center gap-2 cursor-pointer border-3">
                    <span className="text-5xl">{seed.type === "apple" ? "🍎" : seed.type === "orange" ? "🍊" : seed.type === "flower" ? "🌸" : "🌻"}</span>
                    <span className="text-sm font-extrabold text-[#4D2B82]">{seed.name}</span>
                    <div className="flex flex-col items-center gap-1 mt-2">
                      <span className="text-xs font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">الشراء: {seed.cost}⭐</span>
                      <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">الحصاد: 10⭐</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Paddock Buy Modal (Universal) ─────────────────────── */}
      <AnimatePresence>
        {selectedPaddockToBuy && (
          <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/55 select-none">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white border-4 border-[#4D2B82] rounded-[32px] p-6 shadow-2xl relative text-center">
              <button onClick={() => { synth.playPop(); setSelectedPaddockToBuy(null); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#4D2B82] cursor-pointer">
                <X className="w-6 h-6" />
              </button>
              <div className="text-5xl mb-3 mt-4">{PADDOCK_DATA[selectedPaddockToBuy].emoji}</div>
              <h3 className="text-xl font-black text-[#4D2B82] mb-1">{PADDOCK_DATA[selectedPaddockToBuy].name}</h3>
              <p className="text-xs font-bold text-gray-500 mb-2">
                العدد الحالي: {animalCounts[selectedPaddockToBuy]}/12
              </p>

              {/* Evolution progress */}
              <div className="mb-4">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-purple-500">
                  <span>تطور:</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-4 h-4 rounded-full border-2 ${
                        (feedingState[selectedPaddockToBuy]?.fedCount || 0) >= i
                          ? 'bg-purple-500 border-purple-600'
                          : 'bg-gray-200 border-gray-300'
                      }`} />
                    ))}
                  </div>
                  <span>{isAdult(selectedPaddockToBuy) ? '⭐ بالغ!' : `${feedingState[selectedPaddockToBuy]?.fedCount || 0}/5`}</span>
                </div>
              </div>

              {/* Feeding status */}
              <div className="mb-4 p-3 rounded-2xl bg-slate-50 border-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600">
                    {isHungry(selectedPaddockToBuy) ? '🍽️ طبق الأكل فارغ — الحيوانات جائعة!' : '🥘 طبق الأكل ممتلئ!'}
                  </span>
                  {isHungry(selectedPaddockToBuy) && animalCounts[selectedPaddockToBuy] > 0 && (
                    <button onClick={(e) => { handleFeedPaddock(selectedPaddockToBuy, e); }}
                      className="bg-amber-400 hover:bg-amber-500 text-amber-900 border-2 border-amber-600 px-3 py-1 rounded-full font-black text-xs cursor-pointer">
                      ملء ({PADDOCK_DATA[selectedPaddockToBuy].feedCost}⭐)
                    </button>
                  )}
                </div>
                {pendingProducts[selectedPaddockToBuy] && (
                  <button onClick={(e) => handleCollectProduct(selectedPaddockToBuy, e)}
                    className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-2 border-yellow-600 px-4 py-2 rounded-full font-black text-sm cursor-pointer animate-pulse">
                    {PADDOCK_DATA[selectedPaddockToBuy].productEmoji} اجمع {PADDOCK_DATA[selectedPaddockToBuy].productName} (+{isAdult(selectedPaddockToBuy) ? PADDOCK_DATA[selectedPaddockToBuy].productStars * 2 : PADDOCK_DATA[selectedPaddockToBuy].productStars}⭐)
                  </button>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { handleBuyAnimal(selectedPaddockToBuy); setSelectedPaddockToBuy(null); }}
                  disabled={animalCounts[selectedPaddockToBuy] >= 12}
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 text-yellow-900 border-3 border-yellow-600 px-6 py-2.5 rounded-full font-black text-sm cursor-pointer shadow-[0_3px_0_0_#D97706] active:translate-y-0.5 active:shadow-none">
                  شراء ({PADDOCK_DATA[selectedPaddockToBuy].buyCost}⭐)
                </button>
                <button onClick={() => { synth.playPop(); setSelectedPaddockToBuy(null); }}
                  className="bg-white hover:bg-gray-50 border-3 border-gray-300 px-6 py-2.5 rounded-full font-black text-sm text-gray-500 cursor-pointer shadow-[0_3px_0_0_#94A3B8] active:translate-y-0.5 active:shadow-none">
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
