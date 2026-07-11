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
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-pulse" : ""}>
        {/* Ears */}
        <ellipse cx="32" cy="18" rx="7" ry="18" fill="#F3E5F5" stroke="#4D2B82" strokeWidth="3" transform="rotate(-10 32 18)" />
        <ellipse cx="32" cy="18" rx="3.5" ry="13" fill="#F8BBD0" />
        <ellipse cx="48" cy="18" rx="7" ry="18" fill="#F3E5F5" stroke="#4D2B82" strokeWidth="3" transform="rotate(10 48 18)" />
        <ellipse cx="48" cy="18" rx="3.5" ry="13" fill="#F8BBD0" />
        {/* Feet */}
        <ellipse cx="25" cy="72" rx="10" ry="6" fill="#EDE7F6" stroke="#4D2B82" strokeWidth="3" />
        <ellipse cx="55" cy="72" rx="10" ry="6" fill="#EDE7F6" stroke="#4D2B82" strokeWidth="3" />
        {/* Body */}
        <circle cx="40" cy="55" r="23" fill="#EDE7F6" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Tail */}
        <circle cx="17" cy="60" r="7" fill="#F3E5F5" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Head */}
        <circle cx="40" cy="36" r="16" fill="#F3E5F5" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Face */}
        <circle cx="34" cy="34" r="2" fill="#4D2B82" />
        <circle cx="46" cy="34" r="2" fill="#4D2B82" />
        <ellipse cx="31" cy="37" rx="3" ry="1.5" fill="#F8BBD0" opacity="0.6" />
        <ellipse cx="49" cy="37" rx="3" ry="1.5" fill="#F8BBD0" opacity="0.6" />
        <polygon points="40,38 37,36 43,36" fill="#E91E63" stroke="#4D2B82" strokeWidth="1" />
        <path d="M 37 41 Q 40 44 43 41" stroke="#4D2B82" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function SVGKitty({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-[bounce_0.6s_infinite]" : ""}>
        {/* Tail */}
        <path d="M 62 55 Q 74 40 70 30" stroke="#FFE082" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* Feet */}
        <circle cx="30" cy="72" r="6" fill="#FFECB3" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="50" cy="72" r="6" fill="#FFECB3" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Ears */}
        <polygon points="23,12 36,25 21,28" fill="#FFE082" stroke="#4D2B82" strokeWidth="3" />
        <polygon points="26,16 33,24 24,26" fill="#FFCDD2" />
        <polygon points="57,12 44,25 59,28" fill="#FFE082" stroke="#4D2B82" strokeWidth="3" />
        <polygon points="54,16 47,24 56,26" fill="#FFCDD2" />
        {/* Body */}
        <ellipse cx="40" cy="56" rx="20" ry="17" fill="#FFE082" stroke="#4D2B82" strokeWidth="3.5" />
        <path d="M 40 43 L 40 68" stroke="#FFD54F" strokeWidth="3" />
        {/* Head */}
        <circle cx="40" cy="30" r="15" fill="#FFECB3" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Eyes */}
        <ellipse cx="34" cy="27" rx="2" ry="3" fill="#4D2B82" />
        <ellipse cx="46" cy="27" rx="2" ry="3" fill="#4D2B82" />
        {/* Cheeks */}
        <circle cx="31" cy="32" r="2.5" fill="#FF8A8A" opacity="0.5" />
        <circle cx="49" cy="32" r="2.5" fill="#FF8A8A" opacity="0.5" />
        {/* Nose & Whiskers */}
        <polygon points="40,31 38,29 42,29" fill="#E91E63" />
        <line x1="32" y1="32" x2="24" y2="30" stroke="#4D2B82" strokeWidth="1.5" />
        <line x1="32" y1="34" x2="22" y2="36" stroke="#4D2B82" strokeWidth="1.5" />
        <line x1="48" y1="32" x2="56" y2="30" stroke="#4D2B82" strokeWidth="1.5" />
        <line x1="48" y1="34" x2="58" y2="36" stroke="#4D2B82" strokeWidth="1.5" />
        <path d="M 37 34 Q 40 37 43 34" stroke="#4D2B82" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

export function SVGPuppy({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-pulse" : ""}>
        {/* Tail */}
        <path d="M 18 55 Q 8 46 12 36" stroke="#A1887F" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* Back Feet */}
        <ellipse cx="28" cy="70" rx="7" ry="5" fill="#8D6E63" stroke="#4D2B82" strokeWidth="3" />
        <ellipse cx="52" cy="70" rx="7" ry="5" fill="#8D6E63" stroke="#4D2B82" strokeWidth="3" />
        {/* Body */}
        <ellipse cx="40" cy="54" rx="21" ry="18" fill="#8D6E63" stroke="#4D2B82" strokeWidth="3.5" />
        <circle cx="40" cy="54" r="10" fill="#FFE0B2" opacity="0.35" />
        {/* Ears */}
        <ellipse cx="22" cy="28" rx="6" ry="13" fill="#5D4037" stroke="#4D2B82" strokeWidth="3" transform="rotate(15 22 28)" />
        <ellipse cx="58" cy="28" rx="6" ry="13" fill="#5D4037" stroke="#4D2B82" strokeWidth="3" transform="rotate(-15 58 28)" />
        {/* Head */}
        <circle cx="40" cy="30" r="16" fill="#D7CCC8" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Eyes */}
        <circle cx="34" cy="27" r="3" fill="#4D2B82" />
        <circle cx="33" cy="26" r="1" fill="#FFFFFF" />
        <circle cx="46" cy="27" r="3" fill="#4D2B82" />
        <circle cx="45" cy="26" r="1" fill="#FFFFFF" />
        {/* Snout */}
        <ellipse cx="40" cy="35" rx="7" ry="5" fill="#FFE0B2" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="40" cy="33" r="2.5" fill="#4D2B82" />
        <path d="M 40 35 Q 38 38 36 37 M 40 35 Q 42 38 44 37" stroke="#4D2B82" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}

export function SVGDuck({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-[bounce_0.7s_infinite]" : ""}>
        {/* Wings */}
        <path d="M 18 46 Q 10 40 18 34 Z" fill="#FBC02D" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Feet */}
        <path d="M 33 65 L 30 73 L 26 73" stroke="#F57C00" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 47 65 L 50 73 L 54 73" stroke="#F57C00" strokeWidth="3.5" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx="40" cy="52" rx="22" ry="15" fill="#FFF59D" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Head */}
        <circle cx="47" cy="28" r="12" fill="#FFF9C4" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Eye */}
        <circle cx="51" cy="25" r="2" fill="#4D2B82" />
        {/* Beak */}
        <path d="M 57 28 Q 67 28 62 33 Q 57 34 57 28 Z" fill="#FFB74D" stroke="#4D2B82" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

export function SVGSheep({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-pulse" : ""}>
        {/* Legs */}
        <rect x="26" y="58" width="6" height="15" fill="#4B5563" rx="2" stroke="#4D2B82" strokeWidth="2.5" />
        <rect x="48" y="58" width="6" height="15" fill="#4B5563" rx="2" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Fluffy Body */}
        <circle cx="28" cy="38" r="14" fill="#F3F4F6" />
        <circle cx="52" cy="38" r="14" fill="#F3F4F6" />
        <circle cx="40" cy="52" r="15" fill="#F3F4F6" />
        <circle cx="40" cy="32" r="16" fill="#F3F4F6" />
        <ellipse cx="40" cy="44" rx="24" ry="18" fill="#F9FAFB" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Cute Head */}
        <ellipse cx="40" cy="30" rx="9" ry="11" fill="#E5E7EB" stroke="#4D2B82" strokeWidth="3" />
        {/* Eyes */}
        <circle cx="37" cy="28" r="1.5" fill="#4D2B82" />
        <circle cx="43" cy="28" r="1.5" fill="#4D2B82" />
        {/* Ears */}
        <ellipse cx="29" cy="26" rx="3" ry="7" fill="#D1D5DB" stroke="#4D2B82" strokeWidth="2.5" transform="rotate(-30 29 26)" />
        <ellipse cx="51" cy="26" rx="3" ry="7" fill="#D1D5DB" stroke="#4D2B82" strokeWidth="2.5" transform="rotate(30 51 26)" />
        {/* Top wool puff */}
        <circle cx="40" cy="18" r="6" fill="#F9FAFB" stroke="#4D2B82" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function SVGCow({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 90 90" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-[bounce_0.6s_infinite]" : ""}>
        {/* Udders */}
        <circle cx="45" cy="65" r="5" fill="#FF8A8A" opacity="0.6" />
        {/* Legs */}
        <rect x="25" y="60" width="8" height="22" fill="#ECEFF1" stroke="#4D2B82" strokeWidth="3" rx="2" />
        <rect x="25" y="72" width="8" height="10" fill="#374151" />
        <rect x="57" y="60" width="8" height="22" fill="#ECEFF1" stroke="#4D2B82" strokeWidth="3" rx="2" />
        <rect x="57" y="72" width="8" height="10" fill="#374151" />
        {/* Tail */}
        <path d="M 72 45 Q 85 55 80 65" stroke="#90A4AE" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="80" cy="65" r="4.5" fill="#374151" />
        {/* Large Body */}
        <ellipse cx="48" cy="48" rx="28" ry="20" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="4" />
        {/* Spots */}
        <ellipse cx="36" cy="40" rx="9" ry="7" fill="#374151" />
        <ellipse cx="60" cy="50" rx="7" ry="8" fill="#374151" />
        <circle cx="44" cy="54" r="5" fill="#374151" />
        {/* Head and neck */}
        <path d="M 24 36 L 16 16 L 36 22 Z" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
        {/* Horns */}
        <path d="M 17 12 Q 13 4 9 8" stroke="#CFD8DC" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 29 14 Q 33 6 37 10" stroke="#CFD8DC" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Ears */}
        <ellipse cx="10" cy="18" rx="4" ry="9" fill="#FFCDD2" stroke="#4D2B82" strokeWidth="2.5" transform="rotate(-30 10 18)" />
        <ellipse cx="36" cy="20" rx="4" ry="9" fill="#FFCDD2" stroke="#4D2B82" strokeWidth="2.5" transform="rotate(30 36 20)" />
        {/* Face */}
        <ellipse cx="22" cy="24" rx="11" ry="12" fill="#ECEFF1" stroke="#4D2B82" strokeWidth="3.5" />
        <ellipse cx="20" cy="30" rx="10" ry="7" fill="#FF8A8A" stroke="#4D2B82" strokeWidth="2.5" opacity="0.8" />
        {/* Nostrils & Eyes */}
        <circle cx="17" cy="29" r="1.5" fill="#4D2B82" />
        <circle cx="23" cy="29" r="1.5" fill="#4D2B82" />
        <circle cx="18" cy="20" r="2" fill="#4D2B82" />
        <circle cx="27" cy="20" r="2" fill="#4D2B82" />
      </g>
    </svg>
  );
}

export function SVGBee({ className = "w-10 h-10", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 70 70" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-[bounce_0.5s_infinite]" : "animate-[wiggle_1.2s_ease-in-out_infinite]"}>
        {/* Wings */}
        <ellipse cx="24" cy="16" rx="6" ry="12" fill="#E0F2FE" stroke="#4D2B82" strokeWidth="2" opacity="0.8" transform="rotate(-25 24 16)" />
        <ellipse cx="40" cy="16" rx="6" ry="12" fill="#E0F2FE" stroke="#4D2B82" strokeWidth="2" opacity="0.8" transform="rotate(25 40 16)" />
        {/* Antennae */}
        <path d="M 28 20 Q 22 10 16 12" stroke="#4D2B82" strokeWidth="2" fill="none" />
        <circle cx="16" cy="12" r="1.5" fill="#4D2B82" />
        <path d="M 38 20 Q 44 10 50 12" stroke="#4D2B82" strokeWidth="2" fill="none" />
        <circle cx="50" cy="12" r="1.5" fill="#4D2B82" />
        {/* Oval Body */}
        <ellipse cx="33" cy="38" rx="17" ry="14" fill="#FCD34D" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Black Stripes */}
        <path d="M 24 26 C 24 26, 26 49, 24 49" stroke="#374151" strokeWidth="3.5" fill="none" />
        <path d="M 32 24 C 32 24, 34 51, 32 51" stroke="#374151" strokeWidth="3.5" fill="none" />
        <path d="M 40 26 C 40 26, 42 49, 40 49" stroke="#374151" strokeWidth="3.5" fill="none" />
        {/* Stinger */}
        <polygon points="50,38 56,36 50,34" fill="#374151" stroke="#4D2B82" strokeWidth="1.5" />
        {/* Face */}
        <circle cx="21" cy="34" r="2" fill="#374151" />
        <path d="M 18 39 Q 21 42 24 39" stroke="#4D2B82" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}

export function SVGFish({ className = "w-11 h-11", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-pulse" : "animate-[wiggle_1.5s_infinite]"}>
        {/* Tail Fin */}
        <path d="M 12 40 L 2 28 L 6 40 L 2 52 Z" fill="#FF7A00" stroke="#4D2B82" strokeWidth="3" strokeLinejoin="round" />
        {/* Dorsal Fin */}
        <path d="M 38 23 Q 28 12 24 25" fill="#FF7A00" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Pectoral Fin */}
        <path d="M 46 48 Q 42 58 38 48" fill="#FF9E00" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Streamlined Body */}
        <ellipse cx="40" cy="38" rx="23" ry="14" fill="#FFA500" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Scales decoration */}
        <path d="M 28 35 Q 31 38 34 35 M 32 41 Q 35 44 38 41" stroke="#FF7A00" strokeWidth="1.5" fill="none" />
        {/* Gill Cover */}
        <path d="M 49 30 Q 46 38 49 46" stroke="#4D2B82" strokeWidth="2.5" fill="none" />
        {/* Large Eye */}
        <circle cx="56" cy="33" r="3.5" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="2" />
        <circle cx="57" cy="32" r="1.5" fill="#4D2B82" />
        {/* Mouth */}
        <path d="M 62 39 Q 58 41 61 43" stroke="#4D2B82" strokeWidth="2.5" fill="none" />
      </g>
    </svg>
  );
}

export function SVGBird({ className = "w-11 h-11", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-pulse" : "animate-[wiggle_1.4s_infinite]"}>
        {/* Tail feathers */}
        <path d="M 20 44 L 8 40 L 6 48 L 18 50 Z" fill="#60A5FA" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Feet */}
        <path d="M 33 60 L 33 69 M 43 60 L 43 69" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        {/* Main Body */}
        <ellipse cx="38" cy="46" rx="20" ry="15" fill="#3B82F6" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Flapping Wing */}
        <ellipse cx="38" cy="44" rx="10" ry="6" fill="#60A5FA" stroke="#4D2B82" strokeWidth="2.5" transform="rotate(-15 38 44)" />
        {/* Cute Head */}
        <circle cx="48" cy="30" r="11" fill="#60A5FA" stroke="#4D2B82" strokeWidth="3" />
        <circle cx="50" cy="27" r="1.5" fill="#4D2B82" />
        {/* Tiny Beak */}
        <polygon points="58,28 66,31 57,34" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2" />
      </g>
    </svg>
  );
}

// ─── NEW 6 ANIMAL COMPONENTS (VECTORS) ──────────────────────────

export function SVGMonkey({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-[bounce_0.6s_infinite]" : ""}>
        {/* Curly Tail */}
        <path d="M 22 58 Q 10 65 14 50 Q 18 38 8 44" stroke="#8B5A2B" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* Ears */}
        <circle cx="21" cy="32" r="7" fill="#8B5A2B" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="21" cy="32" r="3.5" fill="#FFD39B" />
        <circle cx="59" cy="32" r="7" fill="#8B5A2B" stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="59" cy="32" r="3.5" fill="#FFD39B" />
        {/* Body */}
        <ellipse cx="40" cy="56" rx="18" ry="16" fill="#8B5A2B" stroke="#4D2B82" strokeWidth="3.5" />
        <ellipse cx="40" cy="56" rx="11" ry="10" fill="#FFD39B" opacity="0.8" />
        {/* Head */}
        <circle cx="40" cy="34" r="15" fill="#8B5A2B" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Face (Heart shaped monkey face mask) */}
        <path d="M 31 35 C 31 29, 40 28, 40 33 C 40 28, 49 29, 49 35 C 49 41, 40 45, 40 45 C 40 45, 31 41, 31 35 Z" fill="#FFD39B" />
        {/* Face features */}
        <circle cx="36" cy="33" r="2" fill="#4D2B82" />
        <circle cx="44" cy="33" r="2" fill="#4D2B82" />
        <circle cx="40" cy="37" r="2" fill="#CD5B45" />
        <path d="M 37 40 Q 40 43 43 40" stroke="#4D2B82" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}

export function SVGChicken({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-pulse" : ""}>
        {/* Comb on head */}
        <path d="M 40 18 Q 42 8 45 18 M 45 18 Q 48 6 51 18 M 51 18 Q 54 10 55 20" fill="#EF4444" stroke="#4D2B82" strokeWidth="2" />
        {/* Legs */}
        <line x1="34" y1="58" x2="34" y2="70" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="46" y1="58" x2="46" y2="70" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        {/* Wattle (under beak) */}
        <ellipse cx="56" cy="35" rx="2.5" ry="4" fill="#EF4444" />
        {/* Body */}
        <ellipse cx="38" cy="48" rx="20" ry="16" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Tail feathers */}
        <path d="M 20 44 Q 10 32 18 36 Z" fill="#FEE2E2" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Head */}
        <circle cx="48" cy="28" r="11" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
        {/* Beak */}
        <polygon points="56,26 66,29 56,32" fill="#F59E0B" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Eye */}
        <circle cx="47" cy="25" r="1.8" fill="#4D2B82" />
      </g>
    </svg>
  );
}

export function SVGHorse({ className = "w-13 h-13", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 90 90" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-[bounce_0.7s_infinite]" : ""}>
        {/* Mane */}
        <path d="M 28 20 C 30 10, 24 5, 20 18 C 18 10, 14 12, 16 26" fill="#8B4513" stroke="#4D2B82" strokeWidth="2" />
        {/* Legs */}
        <rect x="24" y="58" width="8" height="24" fill="#CD853F" stroke="#4D2B82" strokeWidth="3" rx="2" />
        <rect x="24" y="74" width="8" height="8" fill="#3E2723" />
        <rect x="52" y="58" width="8" height="24" fill="#CD853F" stroke="#4D2B82" strokeWidth="3" rx="2" />
        <rect x="52" y="74" width="8" height="8" fill="#3E2723" />
        {/* Tail */}
        <path d="M 68 45 Q 82 50 78 68" stroke="#8B4513" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx="44" cy="46" rx="26" ry="18" fill="#CD853F" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Neck */}
        <path d="M 22 36 L 14 14 L 32 20 Z" fill="#CD853F" stroke="#4D2B82" strokeWidth="3" />
        {/* Ears */}
        <polygon points="12,12 16,3 19,10" fill="#8B4513" stroke="#4D2B82" strokeWidth="2" />
        <polygon points="26,16 30,7 32,14" fill="#8B4513" stroke="#4D2B82" strokeWidth="2" />
        {/* Head */}
        <ellipse cx="18" cy="22" rx="10" ry="11" fill="#CD853F" stroke="#4D2B82" strokeWidth="3.5" />
        <ellipse cx="15" cy="27" rx="8" ry="6" fill="#FFB90F" stroke="#4D2B82" strokeWidth="2" opacity="0.9" />
        {/* Eye */}
        <circle cx="16" cy="18" r="2.2" fill="#4D2B82" />
      </g>
    </svg>
  );
}

export function SVGGoat({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-pulse" : ""}>
        {/* Horns */}
        <path d="M 33 16 Q 28 4 23 8" stroke="#707070" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 43 16 Q 48 4 53 8" stroke="#707070" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Legs */}
        <rect x="25" y="58" width="6" height="15" fill="#D3D3D3" stroke="#4D2B82" strokeWidth="2.5" rx="2" />
        <rect x="47" y="58" width="6" height="15" fill="#D3D3D3" stroke="#4D2B82" strokeWidth="2.5" rx="2" />
        {/* Beard */}
        <polygon points="46,42 48,52 50,42" fill="#FFFFFF" />
        {/* Body */}
        <ellipse cx="38" cy="48" rx="22" ry="16" fill="#F5F5F5" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Tail */}
        <path d="M 18 44 L 14 36 C 14 36, 12 40, 16 44 Z" fill="#D3D3D3" stroke="#4D2B82" strokeWidth="2" />
        {/* Head */}
        <ellipse cx="46" cy="30" rx="9" ry="11" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
        {/* Eyes */}
        <circle cx="43" cy="27" r="1.5" fill="#4D2B82" />
        <circle cx="49" cy="27" r="1.5" fill="#4D2B82" />
        {/* Ears */}
        <ellipse cx="37" cy="28" rx="3" ry="8" fill="#E0E0E0" stroke="#4D2B82" strokeWidth="2" transform="rotate(-40 37 28)" />
        <ellipse cx="55" cy="28" rx="3" ry="8" fill="#E0E0E0" stroke="#4D2B82" strokeWidth="2" transform="rotate(40 55 28)" />
      </g>
    </svg>
  );
}

export function SVGCamel({ className = "w-13 h-13", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 90 90" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-[bounce_0.6s_infinite]" : ""}>
        {/* Legs */}
        <rect x="25" y="60" width="6" height="22" fill="#D9A05B" stroke="#4D2B82" strokeWidth="3" rx="1.5" />
        <rect x="48" y="60" width="6" height="22" fill="#D9A05B" stroke="#4D2B82" strokeWidth="3" rx="1.5" />
        {/* Tail */}
        <path d="M 68 45 Q 75 52 72 65" stroke="#B37D43" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Hump 1 */}
        <circle cx="36" cy="26" r="10" fill="#B37D43" stroke="#4D2B82" strokeWidth="3" />
        {/* Hump 2 */}
        <circle cx="50" cy="26" r="10" fill="#B37D43" stroke="#4D2B82" strokeWidth="3" />
        {/* Body */}
        <ellipse cx="44" cy="44" rx="26" ry="18" fill="#D9A05B" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Long Neck */}
        <path d="M 22 38 Q 12 28 14 16 L 22 18 Z" fill="#D9A05B" stroke="#4D2B82" strokeWidth="3" />
        {/* Head */}
        <ellipse cx="12" cy="14" rx="7" ry="9" fill="#D9A05B" stroke="#4D2B82" strokeWidth="3" />
        {/* Ear */}
        <polygon points="10,6 12,1 14,5" fill="#B37D43" stroke="#4D2B82" strokeWidth="1.5" />
        {/* Snout */}
        <ellipse cx="8" cy="18" rx="5" ry="4" fill="#FFC58D" stroke="#4D2B82" strokeWidth="2" opacity="0.9" />
        {/* Eye */}
        <circle cx="11" cy="11" r="1.8" fill="#4D2B82" />
      </g>
    </svg>
  );
}

export function SVGDonkey({ className = "w-12 h-12", isEating = false }: { className?: string; isEating?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} filter drop-shadow-md`}>
      <g className={isEating ? "animate-pulse" : ""}>
        {/* Long Ears */}
        <ellipse cx="30" cy="14" rx="4" ry="14" fill="#78909C" stroke="#4D2B82" strokeWidth="2.5" transform="rotate(-15 30 14)" />
        <ellipse cx="30" cy="14" rx="1.5" ry="9" fill="#FFCDD2" />
        <ellipse cx="46" cy="14" rx="4" ry="14" fill="#78909C" stroke="#4D2B82" strokeWidth="2.5" transform="rotate(15 46 14)" />
        <ellipse cx="46" cy="14" rx="1.5" ry="9" fill="#FFCDD2" />
        {/* Legs */}
        <rect x="26" y="58" width="6" height="15" fill="#90A4AE" stroke="#4D2B82" strokeWidth="2.5" rx="2" />
        <rect x="48" y="58" width="6" height="15" fill="#90A4AE" stroke="#4D2B82" strokeWidth="2.5" rx="2" />
        {/* Body */}
        <ellipse cx="38" cy="48" rx="22" ry="16" fill="#90A4AE" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Tail */}
        <path d="M 18 44 Q 10 50 12 58" stroke="#78909C" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Head */}
        <ellipse cx="38" cy="30" rx="11" ry="13" fill="#B0BEC5" stroke="#4D2B82" strokeWidth="3.5" />
        {/* Snout */}
        <ellipse cx="38" cy="37" rx="9" ry="5.5" fill="#ECEFF1" stroke="#4D2B82" strokeWidth="2" opacity="0.9" />
        <circle cx="35" cy="36" r="1.5" fill="#4D2B82" />
        <circle cx="41" cy="36" r="1.5" fill="#4D2B82" />
        {/* Eyes */}
        <circle cx="34" cy="26" r="1.8" fill="#4D2B82" />
        <circle cx="42" cy="26" r="1.8" fill="#4D2B82" />
      </g>
    </svg>
  );
}

// ─── Custom Food Dishes ──────────────────────────────────────────

export function SVGFeedingDish({ type, hungry }: { type: PaddockType; hungry: boolean }) {
  switch (type) {
    case "sheep":
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          <ellipse cx="30" cy="30" rx="21" ry="8" fill="#15803D" stroke="#4D2B82" strokeWidth="3" />
          <path d="M 9 22 Q 30 12 51 22 L 51 30 Q 30 20 9 30 Z" fill="#86EFAC" stroke="#4D2B82" strokeWidth="3" />
          {!hungry && (
            <path d="M 15 17 Q 30 5 45 17" fill="#4ADE80" stroke="#15803D" strokeWidth="2" />
          )}
        </svg>
      );
    case "rabbit":
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          <rect x="8" y="15" width="44" height="22" fill="#DDB892" stroke="#4D2B82" strokeWidth="3" rx="4" />
          <line x1="8" y1="26" x2="52" y2="26" stroke="#4D2B82" strokeWidth="2.5" />
          {!hungry && (
            <>
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
          <ellipse cx="30" cy="25" rx="25" ry="12" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
          <path d="M 10 25 C 20 28, 40 28, 50 25" stroke="#047857" strokeWidth="1.5" fill="none" />
          {!hungry && (
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
          <ellipse cx="30" cy="30" rx="22" ry="8" fill="#E11D48" stroke="#4D2B82" strokeWidth="3" />
          <path d="M 8 22 Q 30 12 52 22 L 52 30 Q 30 20 8 30 Z" fill="#FDA4AF" stroke="#4D2B82" strokeWidth="3" />
          <rect x="23" y="21" width="14" height="4" fill="#FFFFFF" rx="1.5" />
          <circle cx="23" cy="23" r="2.5" fill="#FFFFFF" />
          <circle cx="37" cy="23" r="2.5" fill="#FFFFFF" />
          {!hungry && (
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
          <rect x="4" y="10" width="52" height="24" fill="#78350F" stroke="#4D2B82" strokeWidth="3.5" rx="4" />
          <line x1="12" y1="10" x2="12" y2="34" stroke="#4D2B82" strokeWidth="2.5" />
          <line x1="22" y1="10" x2="22" y2="34" stroke="#4D2B82" strokeWidth="2.5" />
          <line x1="32" y1="10" x2="32" y2="34" stroke="#4D2B82" strokeWidth="2.5" />
          <line x1="42" y1="10" x2="42" y2="34" stroke="#4D2B82" strokeWidth="2.5" />
          {!hungry && (
            <path d="M 6 12 Q 13 -7 18 12 Q 25 -10 32 12 Q 40 -7 48 12 Q 52 -5 54 12 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
          )}
        </svg>
      );
    case "bee":
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          <ellipse cx="30" cy="30" rx="20" ry="8" fill="#F59E0B" stroke="#4D2B82" strokeWidth="3" />
          <path d="M 10 22 Q 30 14 50 22 L 50 30 Q 30 22 10 30 Z" fill="#FEF3C7" stroke="#4D2B82" strokeWidth="3" />
          {!hungry && (
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
          <ellipse cx="30" cy="20" rx="22" ry="11" fill="none" stroke="#F43F5E" strokeWidth="4.5" />
          {!hungry && (
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
          <line x1="30" y1="0" x2="14" y2="24" stroke="#4D2B82" strokeWidth="2.5" />
          <line x1="30" y1="0" x2="46" y2="24" stroke="#4D2B82" strokeWidth="2.5" />
          <rect x="10" y="22" width="40" height="10" fill="#4B5563" stroke="#4D2B82" strokeWidth="3" rx="2" />
          {!hungry && (
            <path d="M 12 24 Q 30 14 48 24 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
          )}
        </svg>
      );
    default: // Monkey, Chicken, Horse, Goat, Camel, Donkey dishes
      return (
        <svg viewBox="0 0 60 40" className="w-13 h-10 filter drop-shadow-md">
          <ellipse cx="30" cy="30" rx="20" ry="8" fill="#8B4513" stroke="#4D2B82" strokeWidth="3" />
          <path d="M 10 22 Q 30 14 50 22 L 50 30 Q 30 22 10 30 Z" fill="#FFD39B" stroke="#4D2B82" strokeWidth="3" />
          {!hungry && (
            <g>
              <circle cx="25" cy="19" r="3.5" fill="#FCD34D" />
              <circle cx="35" cy="19" r="3.5" fill="#F59E0B" />
              <circle cx="30" cy="17" r="4" fill="#CD853F" />
            </g>
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

export type PaddockType = "sheep" | "rabbit" | "duck" | "pet" | "cow" | "bee" | "fish" | "bird" | "monkey" | "chicken" | "horse" | "goat" | "camel" | "donkey";

export interface PaddockConfig {
  name: string;
  emoji: string;
  buyCost: number;
  feedCost: number;
  productEmoji: string;
  productName: string;
  productStars: number;
}

export const PADDOCK_DATA: Record<PaddockType, PaddockConfig> = {
  duck:    { name: "بحيرة البط",     emoji: "🦆",   buyCost: 12, feedCost: 2, productEmoji: "🥚", productName: "بيض بط",      productStars: 5  },
  bird:    { name: "قفص العصافير",   emoji: "🦜",   buyCost: 10, feedCost: 1, productEmoji: "🎵", productName: "ألحان عذبة",  productStars: 3  },
  rabbit:  { name: "حظيرة الأرانب",   emoji: "🐰",   buyCost: 15, feedCost: 2, productEmoji: "🥕", productName: "جزر حلو",      productStars: 4  },
  bee:     { name: "خلية النحل",     emoji: "🐝",   buyCost: 25, feedCost: 4, productEmoji: "🍯", productName: "عسل سدر",     productStars: 8  },
  sheep:   { name: "حظيرة الخراف",   emoji: "🐑",   buyCost: 20, feedCost: 3, productEmoji: "🧶", productName: "صوف دافئ",    productStars: 5  },
  pet:     { name: "حظيرة الأصدقاء",  emoji: "🐱",   buyCost: 18, feedCost: 2, productEmoji: "❤️", productName: "حب وسعادة",   productStars: 4  },
  fish:    { name: "بركة السمك",     emoji: "🐟",   buyCost: 30, feedCost: 5, productEmoji: "🐠", productName: "لؤلؤ بحر",    productStars: 5  },
  cow:     { name: "حظيرة الأبقار",   emoji: "🐄",   buyCost: 35, feedCost: 5, productEmoji: "🥛", productName: "حليب طازج",   productStars: 7  },
  monkey:  { name: "حظيرة القرود",   emoji: "🐒",   buyCost: 24, feedCost: 3, productEmoji: "🍌", productName: "موز لذيذ",    productStars: 5  },
  chicken: { name: "حظيرة الدجاج",   emoji: "🐔",   buyCost: 16, feedCost: 2, productEmoji: "🥚", productName: "بيض دجاج",  productStars: 4  },
  horse:   { name: "إسطبل الأحصنة",  emoji: "🐴",   buyCost: 38, feedCost: 6, productEmoji: "🧲", productName: "حدوة حظ",   productStars: 8  },
  goat:    { name: "حظيرة الماعز",   emoji: "🐐",   buyCost: 20, feedCost: 3, productEmoji: "🧀", productName: "جبن ماعز",  productStars: 5  },
  camel:   { name: "واحة الجمال",    emoji: "🐫",   buyCost: 40, feedCost: 7, productEmoji: "🌴", productName: "تمر حلو",     productStars: 9  },
  donkey:  { name: "حظيرة الحمير",   emoji: "🫏",   buyCost: 22, feedCost: 3, productEmoji: "🌾", productName: "ربطة قش",   productStars: 4  },
};

const ALL_PADDOCK_TYPES: PaddockType[] = ["sheep", "rabbit", "duck", "pet", "cow", "bee", "fish", "bird", "monkey", "chicken", "horse", "goat", "camel", "donkey"];

// Animal movement bounds - RELATIVE to paddock internal area (with safety margins)
// Animals are w-14 h-14 (~56px), so we subtract 80px from each edge for safety
const getPaddockBounds = (type: PaddockType) => {
  const layout = PADDOCK_LAYOUT[type];
  return {
    minX: 40,
    maxX: layout.width - 120,
    minY: 60,
    maxY: layout.height - 120,
  };
};

const PADDOCK_LAYOUT: Record<PaddockType, {
  left: number; top: number; width: number; height: number;
  bg: string; border: string; textColor: string;
  borderRadius: string;
}> = {
  duck:    { left: 120,  top: 120,  width: 660, height: 470, bg: "from-[#93C5FD] to-[#2563EB]",  border: "border-[#1E3A8A] shadow-[0_8px_0_0_#1E3A8A]", textColor: "text-blue-900",    borderRadius: "rounded-[60px]" },
  bird:    { left: 1050, top: 120,  width: 720, height: 480, bg: "from-[#E8F8F5] to-[#A3E4D7]",  border: "border-[#0E6251] shadow-[0_8px_0_0_#0E6251]", textColor: "text-teal-900",    borderRadius: "rounded-[36px]" },
  rabbit:  { left: 2300, top: 120,  width: 550, height: 460, bg: "from-[#E2F0D9] to-[#C5E1A5]",  border: "border-[#33691E] shadow-[0_8px_0_0_#33691E]", textColor: "text-green-950",   borderRadius: "rounded-[32px]" },
  bee:     { left: 2930, top: 140,  width: 520, height: 440, bg: "from-[#FEF3C7] to-[#FCD34D]",  border: "border-[#78350F] shadow-[0_8px_0_0_#78350F]", textColor: "text-amber-950",   borderRadius: "rounded-[36px]" },
  sheep:   { left: 100,  top: 680,  width: 640, height: 460, bg: "from-[#E8F5E9] to-[#C8E6C9]",  border: "border-[#1B5E20] shadow-[0_8px_0_0_#1B5E20]", textColor: "text-green-900",   borderRadius: "rounded-[40px]" },
  pet:     { left: 2280, top: 660,  width: 580, height: 470, bg: "from-[#FFF3E0] to-[#FFE0B2]",  border: "border-[#E65100] shadow-[0_8px_0_0_#E65100]", textColor: "text-orange-950",  borderRadius: "rounded-[40px]" },
  fish:    { left: 140,  top: 1230, width: 620, height: 480, bg: "from-[#22D3EE] to-[#0891B2]",  border: "border-[#164E63] shadow-[0_8px_0_0_#164E63]", textColor: "text-cyan-950",    borderRadius: "rounded-[60px]" },
  cow:     { left: 1000, top: 1850, width: 780, height: 520, bg: "from-[#FEF9C3] to-[#F0FDF4]",  border: "border-[#3F6212] shadow-[0_8px_0_0_#3F6212]", textColor: "text-lime-950",    borderRadius: "rounded-[40px]" },
  monkey:  { left: 2930, top: 680,  width: 540, height: 460, bg: "from-[#FFEBCD] to-[#CD853F]",  border: "border-[#8B4513] shadow-[0_8px_0_0_#8B4513]", textColor: "text-amber-950",   borderRadius: "rounded-[40px]" },
  chicken: { left: 2320, top: 1220, width: 530, height: 450, bg: "from-[#FFF5F5] to-[#FEB2B2]",  border: "border-[#9B2C2C] shadow-[0_8px_0_0_#9B2C2C]", textColor: "text-red-950",     borderRadius: "rounded-[36px]" },
  horse:   { left: 2930, top: 1240, width: 560, height: 470, bg: "from-[#E6F4EA] to-[#A8DADC]",  border: "border-[#457B9D] shadow-[0_8px_0_0_#457B9D]", textColor: "text-sky-950",     borderRadius: "rounded-[40px]" },
  goat:    { left: 2290, top: 1780, width: 570, height: 480, bg: "from-[#F3F4F6] to-[#D1D5DB]",  border: "border-[#374151] shadow-[0_8px_0_0_#374151]", textColor: "text-gray-900",    borderRadius: "rounded-[32px]" },
  camel:   { left: 120,  top: 1800, width: 650, height: 490, bg: "from-[#FEF9C3] to-[#D97706]",  border: "border-[#78350F] shadow-[0_8px_0_0_#78350F]", textColor: "text-yellow-950",  borderRadius: "rounded-[40px]" },
  donkey:  { left: 2910, top: 1800, width: 530, height: 460, bg: "from-[#ECEFF1] to-[#CFD8DC]",  border: "border-[#455A64] shadow-[0_8px_0_0_#455A64]", textColor: "text-blue-gray-900",borderRadius: "rounded-[36px]" },
};

interface GardenPlot {
  id: number;
  plantType: "apple" | "orange" | "flower" | "sunflower" | null;
  isWatered: boolean;
  growthEndTime: number | null;
}

interface AnimalState {
  id: number;
  x: number;
  y: number;
  isEating: boolean;
  angle: number;
}

interface FeedingData {
  lastFedTime: number;
  fedCount: number;
}

interface MagicGardenProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars: React.Dispatch<React.SetStateAction<number>>;
  spectateMode?: boolean;
  spectateFarmData?: string;
}

const uprightStyle = { transform: "rotateZ(-45deg) rotateX(-58deg) translateZ(0)", transformOrigin: "bottom center" };

export default function MagicGarden({ onClose, globalStars, setGlobalStars, spectateMode = false, spectateFarmData }: MagicGardenProps) {
  // ─── UI / System States ─────────────────────────────────────────
  const [zoomScale, setZoomScale] = useState(0.85);
  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("day");
  const [noticeText, setNoticeText] = useState<string | null>(null);
  const [selectedPaddockToBuy, setSelectedPaddockToBuy] = useState<PaddockType | null>(null);
  const [introActive, setIntroActive] = useState(true);
  const [timeTick, setTimeTick] = useState(0);

  // ─── Garden Plots state (20 plots) ──────────────────────────────
  const [plots, setPlots] = useState<GardenPlot[]>(() => {
    const arr: GardenPlot[] = [];
    for (let i = 1; i <= 20; i++) {
      arr.push({ id: i, plantType: null, isWatered: false, growthEndTime: null });
    }
    return arr;
  });
  const [activePlotId, setActivePlotId] = useState<number | null>(null);
  const [showSeedShop, setShowSeedShop] = useState(false);

  // ─── Animals state (14 kinds) ───────────────────────────────────
  const [animalCounts, setAnimalCounts] = useState<Record<PaddockType, number>>(() => {
    const counts: any = {};
    ALL_PADDOCK_TYPES.forEach(type => { counts[type] = 0; });
    return counts;
  });
  const [animalLists, setAnimalLists] = useState<Record<PaddockType, AnimalState[]>>(() => {
    const lists: any = {};
    ALL_PADDOCK_TYPES.forEach(type => { lists[type] = []; });
    return lists;
  });
  const [feedingState, setFeedingState] = useState<Record<PaddockType, FeedingData>>(() => {
    const feeds: any = {};
    ALL_PADDOCK_TYPES.forEach(type => { feeds[type] = { lastFedTime: 0, fedCount: 0 }; });
    return feeds;
  });
  const [pendingProducts, setPendingProducts] = useState<Record<PaddockType, boolean>>(() => {
    const prods: any = {};
    ALL_PADDOCK_TYPES.forEach(type => { prods[type] = false; });
    return prods;
  });

  // ─── Unlocked Fences (Stars purchasable protection walls) ────────
  const [unlockedFences, setUnlockedFences] = useState<Record<PaddockType, boolean>>(() => {
    const fences: any = {};
    ALL_PADDOCK_TYPES.forEach(type => { fences[type] = false; });
    return fences;
  });

  // Force Landscape Orientation on mobile
  useEffect(() => {
    try {
      ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
    } catch (e) {}
    const tOut = setTimeout(() => setIntroActive(false), 1600);
    return () => clearTimeout(tOut);
  }, []);

  // Load Data / Spectator init
  useEffect(() => {
    if (spectateMode && spectateFarmData) {
      try {
        const data = JSON.parse(spectateFarmData);
        if (data.plots) setPlots(data.plots);
        if (data.animalCounts) setAnimalCounts(data.animalCounts);
        if (data.feedingState) setFeedingState(data.feedingState);
        if (data.pendingProducts) setPendingProducts(data.pendingProducts);
        if (data.unlockedFences) setUnlockedFences(data.unlockedFences);
      } catch (e) {
        console.warn("Failed to parse spectated farm data:", e);
      }
      return;
    }

    // Load Local Data (normal mode)
    const savedPlots = localStorage.getItem("bloomly_garden_plots_v2");
    if (savedPlots) {
      try { setPlots(JSON.parse(savedPlots)); } catch (e) {}
    }
    const counts: any = {};
    ALL_PADDOCK_TYPES.forEach(type => {
      const val = parseInt(localStorage.getItem(`bloomly_${type}_count`) || "0", 10);
      counts[type] = val;
    });
    setAnimalCounts(counts);

    const savedFeeding = localStorage.getItem("bloomly_feeding_state");
    if (savedFeeding) {
      try { setFeedingState(JSON.parse(savedFeeding)); } catch (e) {}
    }
    const savedProds = localStorage.getItem("bloomly_pending_products");
    if (savedProds) {
      try { setPendingProducts(JSON.parse(savedProds)); } catch (e) {}
    }
    const savedFences = localStorage.getItem("bloomly_unlocked_fences");
    if (savedFences) {
      try { setUnlockedFences(JSON.parse(savedFences)); } catch (e) {}
    }
  }, [spectateMode, spectateFarmData]);

  // Timer Tick (1s)
  useEffect(() => {
    const timer = setInterval(() => setTimeTick(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animal Wandering Loop (with constraints)
  useEffect(() => {
    const makeAnimals = (type: PaddockType, count: number) => {
      const bounds = getPaddockBounds(type);
      const rangeX = bounds.maxX - bounds.minX;
      const rangeY = bounds.maxY - bounds.minY;
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: bounds.minX + Math.random() * rangeX,
        y: bounds.minY + Math.random() * rangeY,
        isEating: false,
        angle: Math.random() * 360,
      }));
    };

    const newLists: Record<PaddockType, AnimalState[]> = {} as any;
    ALL_PADDOCK_TYPES.forEach(type => {
      newLists[type] = makeAnimals(type, animalCounts[type]);
    });
    setAnimalLists(newLists);
  }, [animalCounts]);

  useEffect(() => {
    const wanderInterval = setInterval(() => {
      const updateWander = (type: PaddockType, list: AnimalState[]) => {
        const bounds = getPaddockBounds(type);
        return list.map(ani => {
          if (Math.random() < 0.3) return { ...ani, isEating: true };
          return {
            ...ani, isEating: false,
            x: Math.max(bounds.minX, Math.min(bounds.maxX, ani.x + (Math.random() * 80 - 40))),
            y: Math.max(bounds.minY, Math.min(bounds.maxY, ani.y + (Math.random() * 60 - 30))),
            angle: Math.random() * 360,
          };
        });
      };

      setAnimalLists(prev => {
        const next = { ...prev };
        ALL_PADDOCK_TYPES.forEach(type => { next[type] = updateWander(type, prev[type]); });
        return next;
      });
    }, 3500);
    return () => clearInterval(wanderInterval);
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────

  const syncFarmDataToBackend = (
    currentPlots = plots,
    currentCounts = animalCounts,
    currentFeeding = feedingState,
    currentProducts = pendingProducts,
    currentFences = unlockedFences
  ) => {
    const profile = JSON.parse(localStorage.getItem("childProfile") || "null");
    if (!profile || !profile.id) return;
    const farmObj = {
      plots: currentPlots,
      animalCounts: currentCounts,
      feedingState: currentFeeding,
      pendingProducts: currentProducts,
      unlockedFences: currentFences
    };
    const ip = localStorage.getItem("bloomly_server_ip") || "";
    const origin = ip ? `http://${ip}:5000` : window.location.origin;
    const url = `${origin}/api/child-profiles/${profile.id}/farm`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmData: JSON.stringify(farmObj) })
    }).catch(err => console.warn("Failed to sync farm data:", err));
  };

  const handleBuyFence = (type: PaddockType) => {
    if (globalStars < 15) {
      synth.playPop(); triggerNotice("❌ تحتاج ١٥ نجمة لبناء سور حماية!"); return;
    }
    const nextFences = { ...unlockedFences, [type]: true };
    setUnlockedFences(nextFences);
    localStorage.setItem("bloomly_unlocked_fences", JSON.stringify(nextFences));
    updateStars(-15);
    synth.playPetUnlock();
    triggerNotice("🚧 تم بناء سور الحماية بنجاح! -15⭐");
    syncFarmDataToBackend(plots, animalCounts, feedingState, pendingProducts, nextFences);
    setSelectedPaddockToBuy(null);
  };

  const savePlots = (newPlots: GardenPlot[]) => {
    setPlots(newPlots);
    localStorage.setItem("bloomly_garden_plots_v2", JSON.stringify(newPlots));
    syncFarmDataToBackend(newPlots, animalCounts, feedingState, pendingProducts, unlockedFences);
  };

  const saveAnimalCount = (type: PaddockType, val: number) => {
    localStorage.setItem(`bloomly_${type}_count`, val.toString());
    const nextCounts = { ...animalCounts, [type]: val };
    setAnimalCounts(nextCounts);
    syncFarmDataToBackend(plots, nextCounts, feedingState, pendingProducts, unlockedFences);
  };

  const saveFeedingState = (newState: Record<PaddockType, FeedingData>) => {
    setFeedingState(newState);
    localStorage.setItem("bloomly_feeding_state", JSON.stringify(newState));
    syncFarmDataToBackend(plots, animalCounts, newState, pendingProducts, unlockedFences);
  };

  const savePendingProducts = (newProds: Record<PaddockType, boolean>) => {
    setPendingProducts(newProds);
    localStorage.setItem("bloomly_pending_products", JSON.stringify(newProds));
    syncFarmDataToBackend(plots, animalCounts, feedingState, newProds, unlockedFences);
  };

  const updateStars = (diff: number) => {
    setGlobalStars(prev => {
      const next = Math.max(0, prev + diff);
      localStorage.setItem("bloomly_stars", next.toString());
      const profile = JSON.parse(localStorage.getItem("childProfile") || "null");
      if (profile && profile.id) {
        const ip = localStorage.getItem("bloomly_server_ip") || "";
        const origin = ip ? `http://${ip}:5000` : window.location.origin;
        fetch(`${origin}/api/child-profiles/${profile.id}/stars`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stars: next })
        }).catch(err => console.warn("Failed to sync stars:", err));
      }
      return next;
    });
  };

  const triggerNotice = (text: string) => {
    setNoticeText(text);
    setTimeout(() => setNoticeText(null), 2500);
  };

  // ─── Farm Logic Handlers ────────────────────────────────────────

  const isHungry = (type: PaddockType) => {
    const data = feedingState[type];
    if (!data || !data.lastFedTime) return true;
    const elapsed = Date.now() - data.lastFedTime;
    return elapsed >= 16000;
  };

  const isAdult = (type: PaddockType) => {
    return (feedingState[type]?.fedCount || 0) >= 5;
  };

  const handlePlantSeed = (seedType: "apple" | "orange" | "flower" | "sunflower") => {
    if (activePlotId === null) return;
    const cost = seedType === "apple" || seedType === "orange" ? 5 : 2;
    if (globalStars < cost) {
      synth.playPop(); triggerNotice("❌ ليس لديك نجوم كافية لشراء هذه البذور!"); return;
    }
    updateStars(-cost); synth.playWaterPour();
    const newPlots = plots.map(p => p.id === activePlotId ? { ...p, plantType: seedType, isWatered: false, growthEndTime: null } : p);
    savePlots(newPlots); triggerNotice("🌱 تم زرع البذور بنجاح! اسقها لتنمو.");
    setShowSeedShop(false); setActivePlotId(null);
  };

  const handleWater = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || plot.isWatered) return;
    synth.playWaterPour();
    const duration = plot.plantType === "apple" || plot.plantType === "orange" ? 30000 : 15000;
    const endTime = Date.now() + duration;
    const newPlots = plots.map(p => p.id === plotId ? { ...p, isWatered: true, growthEndTime: endTime } : p);
    savePlots(newPlots); triggerNotice("💧 تم ري الأرض السحرية بنجاح! بدأت الثمار تنمو...");
  };

  const handleHarvest = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || !plot.growthEndTime || Date.now() < plot.growthEndTime) return;
    synth.playHarvest();
    const reward = plot.plantType === "apple" || plot.plantType === "orange" ? 10 : 4;
    updateStars(reward);
    const newPlots = plots.map(p => p.id === plotId ? { id: p.id, plantType: null, isWatered: false, growthEndTime: null } : p);
    savePlots(newPlots); triggerNotice(`✨ حصدت الثمار بنجاح! +${reward} نجوم ⭐`);
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
    if (currentCount >= 24) {
      synth.playPop(); triggerNotice(`❌ ${config.name} ممتلئة بالكامل (الحد الأقصى ٢٤ حيوان).`); return;
    }
    if (globalStars < config.buyCost) {
      synth.playPop(); triggerNotice("❌ ليس لديك نجوم كافية لشراء هذا الحيوان!"); return;
    }
    updateStars(-config.buyCost); synth.playPetUnlock();
    saveAnimalCount(type, currentCount + 1);
    triggerNotice(`🐣 تم شراء ${config.emoji} جديد وإضافته لـ${config.name}!`);
  };

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

  const toggleTimeOfDay = () => {
    synth.playPop();
    setTimeOfDay(prev => prev === "day" ? "sunset" : prev === "sunset" ? "night" : "day");
  };

  const outerBg = timeOfDay === "day" ? "bg-[#DCFCE7]" : timeOfDay === "sunset" ? "bg-[#FFE8CC]" : "bg-[#0f172a]";
  const mapBg = timeOfDay === "day"
    ? "bg-gradient-to-br from-[#6ABF69] via-[#7ECB7E] to-[#5DB85D]"
    : timeOfDay === "sunset"
    ? "bg-gradient-to-br from-[#E8B878] via-[#D4956A] to-[#8CB87A]"
    : "bg-gradient-to-br from-[#1a2a3a] via-[#1e3040] to-[#1a3a2a]";
  const roadColor = timeOfDay === "night" ? "bg-[#6B5335]" : "bg-[#C4A265]";
  const roadBorder = timeOfDay === "night" ? "border-[#5A4025]/60" : "border-[#8C6D47]/60";

  const renderAnimalSVG = (type: PaddockType, animal: AnimalState, adult: boolean) => {
    const size = "w-14 h-14";
    switch (type) {
      case "sheep": return <SVGSheep className={size} isEating={animal.isEating} />;
      case "rabbit": return <SVGBunny className={size} isEating={animal.isEating} />;
      case "duck": return <SVGDuck className={size} isEating={animal.isEating} />;
      case "pet": return animal.id % 2 === 0 ? <SVGKitty className={size} isEating={animal.isEating} /> : <SVGPuppy className={size} isEating={animal.isEating} />;
      case "cow": return <SVGCow className={size} isEating={animal.isEating} />;
      case "bee": return <SVGBee className={size} isEating={animal.isEating} />;
      case "fish": return <SVGFish className={size} isEating={animal.isEating} />;
      case "bird": return <SVGBird className={size} isEating={animal.isEating} />;
      case "monkey": return <SVGMonkey className={size} isEating={animal.isEating} />;
      case "chicken": return <SVGChicken className={size} isEating={animal.isEating} />;
      case "horse": return <SVGHorse className={size} isEating={animal.isEating} />;
      case "goat": return <SVGGoat className={size} isEating={animal.isEating} />;
      case "camel": return <SVGCamel className={size} isEating={animal.isEating} />;
      case "donkey": return <SVGDonkey className={size} isEating={animal.isEating} />;
    }
  };

  const getTimerString = (endTime: number | null) => {
    if (!endTime) return "";
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    return `${remaining}ث`;
  };

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

      {/* ─── Top Bar Controls ─────────────────────────────────────── */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-3 border-b-4 border-emerald-800/10 flex items-center justify-between z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { synth.playPop(); onClose(); }}
            className="bg-[#FF5A92] hover:bg-[#FF4081] text-white border-3 border-red-700 shadow-[0_4px_0_0_#B91C1C] px-5 py-2 rounded-full font-black text-sm cursor-pointer transition-all active:translate-y-[2px] active:shadow-[0_2px_0_0_#B91C1C]"
          >
            خروج 🚪
          </button>
          
          <button 
            onClick={toggleTimeOfDay}
            className="bg-white hover:bg-slate-50 border-3 border-slate-300 text-slate-700 shadow-[0_4px_0_0_#94A3B8] px-4 py-2 rounded-full font-black text-xs cursor-pointer transition-all active:translate-y-[2px] active:shadow-[0_2px_0_0_#94A3B8]"
          >
            {timeOfDay === "day" ? "🌅 مغرب" : timeOfDay === "sunset" ? "🌌 ليل" : "☀️ نهار"}
          </button>
        </div>

        {spectateMode && (
          <div className="bg-purple-100 border-2 border-purple-300 text-purple-700 font-black px-4 py-1.5 rounded-full text-xs animate-pulse">
            👁️ وضع المشاهدة فقط (لا يمكن التعديل)
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Zoom controls */}
          <div className="bg-slate-100 rounded-full p-1 border-2 border-slate-200 flex items-center gap-1.5">
            <button onClick={() => setZoomScale(s => Math.min(1.2, s + 0.05))} className="p-1.5 text-slate-600 hover:text-[#4D2B82] cursor-pointer"><ZoomIn className="w-4 h-4" /></button>
            <span className="text-[10px] font-black text-slate-500">{Math.round(zoomScale * 100)}%</span>
            <button onClick={() => setZoomScale(s => Math.max(0.5, s - 0.05))} className="p-1.5 text-slate-600 hover:text-[#4D2B82] cursor-pointer"><ZoomOut className="w-4 h-4" /></button>
            <button onClick={() => setZoomScale(0.85)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"><Maximize2 className="w-3.5 h-3.5" /></button>
          </div>

          <div className="bg-yellow-100 border-3 border-yellow-500 rounded-full px-5 py-2 flex items-center gap-1.5 shadow-sm">
            <span className="text-xl">⭐</span>
            <span className="text-yellow-800 font-extrabold text-base">{globalStars}</span>
          </div>
        </div>
      </header>

      {/* ─── Main Map Viewport ────────────────────────────────────── */}
      <main className={`flex-grow w-full overflow-auto scrollbar-none relative border-t-2 ${timeOfDay === "night" ? "border-indigo-900" : "border-emerald-800"} transition-colors duration-1000`}>
        <div style={{
          width: `${3600 * zoomScale}px`,
          height: `${2600 * zoomScale}px`,
          overflow: "hidden",
          position: "relative",
          transition: "width 0.3s ease, height 0.3s ease"
        }}>
          <div 
            className={`w-[3600px] h-[2600px] p-8 overflow-hidden select-none transition-all duration-1000 ${mapBg}`}
            style={{
              transform: `scale(${zoomScale}) rotateX(60deg) rotateZ(-45deg)`,
              transformOrigin: "top left",
              position: "absolute",
              top: 0,
              left: 0,
              transformStyle: "preserve-3d"
            }}
          >

            {/* Roads */}
            <div className={`absolute top-[680px] left-[100px] w-[3400px] h-12 ${roadColor} border-y-3 border-dashed ${roadBorder} z-0 transition-colors duration-1000 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]`} />
            <div className={`absolute top-[160px] left-[840px] w-12 h-[2200px] ${roadColor} border-x-3 border-dashed ${roadBorder} z-0 transition-colors duration-1000 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]`} />
            <div className={`absolute top-[1360px] left-[100px] w-[3400px] h-12 ${roadColor} border-y-3 border-dashed ${roadBorder} z-0 transition-colors duration-1000 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]`} />
            <div className={`absolute top-[2040px] left-[100px] w-[3400px] h-12 ${roadColor} border-y-3 border-dashed ${roadBorder} z-0 transition-colors duration-1000 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]`} />

            {/* Premium River */}
            <div className="absolute top-0 left-[2000px] w-48 h-[2600px] bg-gradient-to-b from-blue-400 via-cyan-400 to-blue-500 opacity-80 z-0 border-x-4 border-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.4)]" style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))" }}>
              <div className="w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMjAgQzEwIDEwIDMwIDEwIDQwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-repeat animate-[slide_10s_linear_infinite]" />
            </div>
            {/* River Bridge */}
            <div className="absolute top-[660px] left-[1980px] w-[240px] h-[52px] bg-amber-800 border-4 border-amber-950 rounded-md z-0 shadow-xl" />
            <div className="absolute top-[1340px] left-[1980px] w-[240px] h-[52px] bg-amber-800 border-4 border-amber-950 rounded-md z-0 shadow-xl" />
            <div className="absolute top-[2020px] left-[1980px] w-[240px] h-[52px] bg-amber-800 border-4 border-amber-950 rounded-md z-0 shadow-xl" />

            {/* Premium Perimeter Wooden Fence */}
            <div className="absolute inset-8 border-[12px] border-amber-800/80 rounded-[80px] pointer-events-none z-10 shadow-[0_0_0_4px_rgba(69,26,3,0.5),inset_0_0_0_4px_rgba(69,26,3,0.5)]">
               <div className="absolute inset-0 border-[8px] border-dashed border-amber-900/60 rounded-[68px]" />
            </div>

            {/* Twinkling Stars (Night) */}
            {timeOfDay === "night" && (
              <div className="absolute inset-0 pointer-events-none z-0">
                {[{x:150,y:250},{x:400,y:100},{x:850,y:300},{x:1200,y:180},{x:1600,y:290},{x:1900,y:120},{x:2300,y:350},{x:2700,y:150},{x:3100,y:280}].map((s,i) => (
                  <motion.div key={i} className="absolute text-yellow-200 text-sm" style={{ left: s.x, top: s.y }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5 + i * 0.4, repeat: Infinity }}>
                    ✦
                  </motion.div>
                ))}
              </div>
            )}

            {/* 🌲 Path from Farmer's House to Road */}
            <div className="absolute left-[190px] top-[720px] w-6 h-[290px] bg-amber-900/10 border-x-2 border-dashed border-amber-800/10 pointer-events-none" />

            {/* 🌲 Landscape Decors */}
            <div className="absolute left-[370px] top-[120px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-14 h-14" /></div>
            <div className="absolute left-[780px] top-[130px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-14 h-14" /></div>
            <div className="absolute left-[1110px] top-[110px] pointer-events-none opacity-85" style={uprightStyle}><SVGDecorFlowers className="w-10 h-10" /></div>
            <div className="absolute left-[390px] top-[490px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-16 h-16" /></div>
            <div className="absolute left-[820px] top-[500px] pointer-events-none opacity-85" style={uprightStyle}><SVGDecorFlowers className="w-10 h-10" /></div>
            <div className="absolute left-[380px] top-[800px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-14 h-14" /></div>
            <div className="absolute left-[920px] top-[880px] pointer-events-none opacity-80" style={uprightStyle}><SVGDecorTree className="w-16 h-16" /></div>

            {/* ════════════ 14 DYNAMIC ANIMAL PADDOCKS ════════════ */}
            {ALL_PADDOCK_TYPES.map((type) => {
              const config = PADDOCK_DATA[type];
              const layout = PADDOCK_LAYOUT[type];
              const count = animalCounts[type];
              const foodHungry = isHungry(type);
              const collectReady = pendingProducts[type];
              const adultState = isAdult(type);
              
              return (
                <div 
                  key={type}
                  onClick={() => {
                    if (spectateMode) return;
                    synth.playPop(); 
                    setSelectedPaddockToBuy(type); 
                  }}
                  className={`absolute bg-gradient-to-br ${layout.bg} ${layout.borderRadius} border-[10px] ${layout.border} flex flex-col justify-between p-4 overflow-visible z-10 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all shadow-xl`}
                  style={{
                    left: `${layout.left}px`,
                    top: `${layout.top}px`,
                    width: `${layout.width}px`,
                    height: `${layout.height}px`,
                  }}
                >
                  <div className={`font-black text-xs bg-black/30 w-fit px-2.5 py-0.5 rounded-full z-20 text-white`} style={uprightStyle}>
                    {config.emoji} {config.name} ({count}/24)
                  </div>
                  
                  {/* Premium Wooden Fence border decoration if unlocked */}
                  {unlockedFences[type] && (
                    <div className="absolute inset-[-14px] border-[12px] border-[#654321]/90 rounded-[inherit] pointer-events-none z-20 shadow-[0_4px_8px_rgba(0,0,0,0.3)] border-double" />
                  )}

                  {/* Food dish */}
                  {count > 0 && !spectateMode && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedPaddock(type, e);
                      }}
                      className={`absolute bottom-3 right-3 z-30 cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${foodHungry ? 'animate-bounce' : ''}`}
                      style={uprightStyle}
                    >
                      <SVGFeedingDish type={type} hungry={foodHungry} />
                      {foodHungry && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow">!</span>
                      )}
                    </div>
                  )}

                  {/* Product pickup */}
                  {collectReady && !spectateMode && (
                    <motion.div
                      animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCollectProduct(type, e);
                      }}
                      className="absolute top-2 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
                      style={uprightStyle}
                    >
                      <div className="bg-white border-3 border-yellow-500 rounded-full px-3 py-1.5 text-sm font-black shadow-lg hover:bg-yellow-50 transition-all flex items-center gap-1">
                        <span>{config.productEmoji}</span>
                        <span className="text-yellow-700">+{adultState ? config.productStars * 2 : config.productStars}⭐</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Adult Star Indicator */}
                  {adultState && count > 0 && (
                    <div className="absolute top-2 right-2 z-20 bg-purple-500 text-white text-[8px] font-black rounded-full px-2 py-0.5 shadow" style={uprightStyle}>⭐ بالغ</div>
                  )}

                  {/* Animals rendering inside paddock */}
                  <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                    {animalLists[type]?.map((a) => (
                      <div key={a.id} className="absolute transition-all duration-[3000ms] ease-in-out" style={{ left: `${a.x}px`, top: `${a.y}px`, transformStyle: "preserve-3d" }}>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/15 rounded-full blur-[1px] z-0" />
                        <div style={uprightStyle} className="relative z-10">
                          {renderAnimalSVG(type, a, adultState)}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}

            {/* ════════════ TREE PLOTS (حقول النباتات) ════════════ */}
            <div className="absolute left-[900px] top-[760px] w-[1000px] h-[920px] bg-[#A1887F]/30 rounded-[40px] border-4 border-dashed border-[#8D6E63] p-12 grid grid-cols-5 gap-y-24 gap-x-12 justify-items-center items-center z-10 shadow-inner" style={{ transformStyle: "preserve-3d" }}>
              {plots.map((plot) => {
                const isEmpty = plot.plantType === null;
                const isWatered = plot.isWatered;
                const hasEndTime = plot.growthEndTime !== null;
                const isFullyGrown = hasEndTime && Date.now() >= (plot.growthEndTime || 0);
                return (
                  <div key={plot.id} className="flex flex-col items-center gap-1.5 relative select-none w-18" style={{ transformStyle: "preserve-3d" }}>
                    {!isEmpty && (
                      <div className="absolute top-[-26px] z-20 flex gap-0.5" style={uprightStyle}>
                        {!isWatered && !spectateMode && (
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
                            {!spectateMode && (
                              <button onClick={(e) => handleFastForward(plot.id, e)}
                                className="ml-1 bg-yellow-400 text-yellow-900 border border-yellow-600 rounded-full px-1 py-0 text-[6px] hover:bg-yellow-500 font-extrabold cursor-pointer">
                                ⚡
                              </button>
                            )}
                          </div>
                        )}
                        {isFullyGrown && !spectateMode && (
                          <button onClick={() => handleHarvest(plot.id)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-full p-1 border-2 border-yellow-600 shadow-lg animate-bounce-slow flex items-center justify-center cursor-pointer font-black text-xs"
                            title="احصد النجوم! 🌾">
                            ⭐
                          </button>
                        )}
                      </div>
                    )}
                    <div onClick={() => { if (spectateMode) return; synth.playPop(); if (isEmpty) { setActivePlotId(plot.id); setShowSeedShop(true); } }}
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

            {/* 🏡 FARMER'S HOUSE (منزل المزارع) */}
            <div 
              onClick={() => {
                synth.playPop();
                triggerNotice("🏡 مرحباً بك في منزلي السعيد! أنا المزارع سعيد 👨‍🌾👋");
              }}
              className="absolute left-[100px] top-[2000px] w-[680px] h-[520px] z-10 cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all"
              style={uprightStyle}
            >
              <SVGFarmerHouse className="w-full h-full" />
            </div>

          </div>
        </div>
      </main>

      {/* Notice Banner */}
      <AnimatePresence>
        {noticeText && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#4D2B82] text-white border-2 border-yellow-400 px-6 py-2.5 rounded-full font-black text-xs shadow-2xl flex items-center gap-2">
            <span>✨</span>
            <span>{noticeText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Seed Selection Shop Overlay ────────────────────────────── */}
      <AnimatePresence>
        {showSeedShop && (
          <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/55 select-none">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-emerald-800 rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative text-right">
              <button onClick={() => { synth.playPop(); setShowSeedShop(false); setActivePlotId(null); }}
                className="absolute top-4 left-4 bg-slate-100 hover:bg-red-50 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-slate-200 cursor-pointer">✕</button>
              
              <h3 className="text-xl font-black text-[#4D2B82] mb-1">متجر البذور السحرية 🌱</h3>
              <p className="text-xs font-bold text-slate-400 mb-5">اختر البذور التي تريد زراعتها في الأرض رقم {activePlotId}:</p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: "apple", name: "تفاح أحمر 🍎", desc: "ينتج تفاحاً شهياً", cost: 5, icon: "🍎" },
                  { type: "orange", name: "برتقال طازج 🍊", desc: "ينتج ثمار البرتقال", cost: 5, icon: "🍊" },
                  { type: "flower", name: "وردة الزينة 🌸", desc: "تنبت زهوراً وردية", cost: 2, icon: "🌸" },
                  { type: "sunflower", name: "عباد الشمس 🌻", desc: "ينمو كقرص شمس ذهبي", cost: 2, icon: "🌻" }
                ].map((seed) => (
                  <div key={seed.type} onClick={() => handlePlantSeed(seed.type as any)}
                    className="border-3 border-slate-200 hover:border-emerald-600 rounded-2xl p-3 text-center cursor-pointer transition-all hover:bg-emerald-50/50 flex flex-col justify-between items-center min-h-[120px]">
                    <span className="text-3xl">{seed.icon}</span>
                    <span className="text-xs font-black text-slate-700 block mt-1">{seed.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">{seed.desc}</span>
                    <span className="mt-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-black text-[10px] border border-yellow-300">
                      تكلفة: {seed.cost}⭐
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Paddock Buy/Action Modal ─────────────────────────────── */}
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
                العدد الحالي: {animalCounts[selectedPaddockToBuy]}/24
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
                  <span className="text-xs font-bold text-gray-600 text-right">
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

              <div className="flex flex-col gap-2">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { handleBuyAnimal(selectedPaddockToBuy); setSelectedPaddockToBuy(null); }}
                    disabled={animalCounts[selectedPaddockToBuy] >= 24}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 text-yellow-900 border-3 border-yellow-600 px-6 py-2.5 rounded-full font-black text-sm cursor-pointer shadow-[0_3px_0_0_#D97706] active:translate-y-0.5 active:shadow-none flex-grow">
                    شراء ({PADDOCK_DATA[selectedPaddockToBuy].buyCost}⭐)
                  </button>
                  <button onClick={() => { synth.playPop(); setSelectedPaddockToBuy(null); }}
                    className="bg-white hover:bg-gray-50 border-3 border-gray-300 px-6 py-2.5 rounded-full font-black text-sm text-gray-500 cursor-pointer shadow-[0_3px_0_0_#94A3B8] active:translate-y-0.5 active:shadow-none">
                    إغلاق
                  </button>
                </div>

                {/* Fence buying option */}
                {animalCounts[selectedPaddockToBuy] > 0 && (
                  <div className="border-t border-slate-100 pt-3 mt-1 flex justify-center">
                    {unlockedFences[selectedPaddockToBuy] ? (
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">🚧 تم بناء سور الحماية لهذا الحيوان</span>
                    ) : (
                      <button
                        onClick={() => handleBuyFence(selectedPaddockToBuy)}
                        className="bg-amber-600 hover:bg-amber-700 text-white border-3 border-amber-800 px-6 py-2 rounded-full font-black text-xs cursor-pointer shadow-[0_3px_0_0_#78350F] active:translate-y-0.5 active:shadow-none"
                      >
                        🚧 شراء سور حماية (15⭐)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
