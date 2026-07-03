import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Volume2, VolumeX, Sparkle } from "lucide-react";

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
      console.warn("Synth failed:", e);
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
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1479.98, now + 0.25); // F#6
      oscGain.gain.setValueAtTime(0.06, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.45);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("Synth failed:", e);
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
      console.warn("Synth failed:", e);
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
      console.warn("Synth failed:", e);
    }
  }
}

const synth = new GardenSoundSynth();

// Vector SVG Illustrations for pets
export function SVGBunny({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Ears */}
      <ellipse cx="38" cy="20" rx="7" ry="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="38" cy="20" rx="3.5" ry="12" fill="#FFC0CB" />
      <ellipse cx="62" cy="20" rx="7" ry="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="62" cy="20" rx="3.5" ry="12" fill="#FFC0CB" />
      {/* Body */}
      <circle cx="50" cy="72" r="24" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      {/* Head */}
      <circle cx="50" cy="46" r="18" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      {/* Eyes */}
      <circle cx="43" cy="43" r="2.5" fill="#4D2B82" />
      <circle cx="57" cy="43" r="2.5" fill="#4D2B82" />
      {/* Rosy cheeks */}
      <circle cx="36" cy="49" r="3" fill="#FF8A8A" opacity="0.6" />
      <circle cx="64" cy="49" r="3" fill="#FF8A8A" opacity="0.6" />
      {/* Nose/Mouth */}
      <polygon points="50,48 47,45 53,45" fill="#FF659F" />
      <path d="M 47 52 Q 50 55 53 52" stroke="#4D2B82" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="36" cy="92" rx="8" ry="5" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="64" cy="92" rx="8" ry="5" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="3" />
      {/* Fluffy tail */}
      <circle cx="74" cy="74" r="7" fill="#FFFFFF" stroke="#4D2B82" strokeWidth="2.5" />
    </svg>
  );
}

export function SVGKitty({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Tail */}
      <path d="M 75 75 Q 85 60 78 45" stroke="#FBBF24" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 75 75 Q 85 60 78 45" stroke="#D97706" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Ears */}
      <polygon points="32,32 30,12 48,22" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      <polygon points="34,28 33,16 45,22" fill="#FCA5A5" />
      <polygon points="68,32 70,12 52,22" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      <polygon points="66,28 67,16 55,22" fill="#FCA5A5" />
      {/* Body */}
      <ellipse cx="50" cy="70" rx="20" ry="22" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      {/* Stripes */}
      <path d="M 33 65 Q 40 68 33 71" stroke="#D97706" strokeWidth="2.5" fill="none" />
      <path d="M 67 65 Q 60 68 67 71" stroke="#D97706" strokeWidth="2.5" fill="none" />
      {/* Head */}
      <circle cx="50" cy="40" r="18" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
      {/* Eyes */}
      <ellipse cx="43" cy="38" rx="3.5" ry="4.5" fill="#10B981" stroke="#4D2B82" strokeWidth="1.5" />
      <circle cx="42.5" cy="36.5" r="1" fill="#FFFFFF" />
      <ellipse cx="57" cy="38" rx="3.5" ry="4.5" fill="#10B981" stroke="#4D2B82" strokeWidth="1.5" />
      <circle cx="56.5" cy="36.5" r="1" fill="#FFFFFF" />
      {/* Rosy cheeks */}
      <circle cx="36" cy="44" r="2.5" fill="#FF8A8A" opacity="0.6" />
      <circle cx="64" cy="44" r="2.5" fill="#FF8A8A" opacity="0.6" />
      {/* Nose */}
      <polygon points="50,42 47,40 53,40" fill="#FF8A8A" />
      {/* Mouth */}
      <path d="M 46 45 Q 50 48 54 45" stroke="#4D2B82" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="26" y1="43" x2="16" y2="41" stroke="#4D2B82" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="46" x2="14" y2="47" stroke="#4D2B82" strokeWidth="2" strokeLinecap="round" />
      <line x1="74" y1="43" x2="84" y2="41" stroke="#4D2B82" strokeWidth="2" strokeLinecap="round" />
      <line x1="74" y1="46" x2="86" y2="47" stroke="#4D2B82" strokeWidth="2" strokeLinecap="round" />
      {/* Feet */}
      <circle cx="36" cy="90" r="6" fill="#FBBF24" stroke="#4D2B82" strokeWidth="2.5" />
      <circle cx="64" cy="90" r="6" fill="#FBBF24" stroke="#4D2B82" strokeWidth="2.5" />
    </svg>
  );
}

export function SVGDuck({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Tail feathers */}
      <polygon points="20,55 8,45 22,40" fill="#FDE047" stroke="#4D2B82" strokeWidth="2.5" />
      {/* Body */}
      <ellipse cx="48" cy="62" rx="26" ry="18" fill="#FDE047" stroke="#4D2B82" strokeWidth="3" />
      {/* Wing */}
      <ellipse cx="48" cy="62" rx="14" ry="8" fill="#FFF59D" stroke="#4D2B82" strokeWidth="2" />
      {/* Neck */}
      <path d="M 64 62 C 68 50 68 44 68 38" stroke="#FDE047" strokeWidth="15" strokeLinecap="round" />
      <path d="M 58 64 L 58 60" stroke="#4D2B82" strokeWidth="3" />
      {/* Head */}
      <circle cx="70" cy="30" r="14" fill="#FDE047" stroke="#4D2B82" strokeWidth="3" />
      {/* Eye */}
      <circle cx="74" cy="27" r="2" fill="#4D2B82" />
      <circle cx="73.5" cy="26" r="0.6" fill="#FFFFFF" />
      {/* Bill (Orange) */}
      <path d="M 82 28 Q 94 30 92 36 L 78 36 Z" fill="#F97316" stroke="#4D2B82" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Feet */}
      <ellipse cx="38" cy="81" rx="8" ry="4" fill="#F97316" stroke="#4D2B82" strokeWidth="2.5" />
      <ellipse cx="58" cy="81" rx="8" ry="4" fill="#F97316" stroke="#4D2B82" strokeWidth="2.5" />
    </svg>
  );
}

export function SVGPuppy({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Tail */}
      <path d="M 76 72 Q 86 64 88 50" stroke="#8D6E63" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="50" cy="72" rx="22" ry="18" fill="#BCAAA4" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="36" cy="74" r="8" fill="#8D6E63" />
      {/* Ears */}
      <ellipse cx="30" cy="44" rx="6" ry="12" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      <ellipse cx="70" cy="44" rx="6" ry="12" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      {/* Head */}
      <circle cx="50" cy="44" r="17" fill="#BCAAA4" stroke="#4D2B82" strokeWidth="3" />
      <ellipse cx="50" cy="48" rx="8" ry="6" fill="#FFFFFF" />
      {/* Spot on eye */}
      <circle cx="42" cy="40" r="5" fill="#8D6E63" />
      {/* Eyes */}
      <circle cx="42" cy="40" r="2.5" fill="#4D2B82" />
      <circle cx="58" cy="40" r="2.5" fill="#4D2B82" />
      {/* Nose */}
      <ellipse cx="50" cy="46" rx="3" ry="2" fill="#000000" />
      {/* Tongue */}
      <path d="M 48 51 Q 50 59 52 51 Z" fill="#FF5A92" stroke="#4D2B82" strokeWidth="1.5" />
      {/* Feet */}
      <circle cx="38" cy="90" r="6" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
      <circle cx="62" cy="90" r="6" fill="#8D6E63" stroke="#4D2B82" strokeWidth="2.5" />
    </svg>
  );
}

// Vector SVG Illustrations for tree and plants growth stages
export function SVGTree({ type, stage }: { type: "apple" | "orange"; stage: number }) {
  const fruitColor = type === "apple" ? "#EF4444" : "#F97316";
  const leafColor = "#22C55E";

  if (stage === 0) {
    // Stage 0: Little seed sprouting out of rich soil pile
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        {/* Soil pile */}
        <path d="M 15 85 Q 50 55 85 85 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3.5" />
        <path d="M 25 80 Q 50 65 75 80 Z" fill="#4E3629" />
        {/* Little double-leaf sprout */}
        <motion.path 
          animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2 }}
          d="M 50 62 C 45 52, 40 52, 38 56 C 36 60, 44 64, 50 62 C 56 64, 64 60, 62 56 C 60 52, 55 52, 50 62 M 50 62 L 50 72" 
          stroke="#AEEA00" 
          strokeWidth="3.5" 
          fill="#AEEA00" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (stage === 1) {
    // Stage 1: Budding leafy plant with a small stem
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        {/* Soil base */}
        <path d="M 20 85 Q 50 65 80 85 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3" />
        {/* Stem */}
        <path d="M 50 85 L 50 45" stroke="#78350F" strokeWidth="5.5" strokeLinecap="round" />
        {/* Leaves */}
        <circle cx="38" cy="55" r="9" fill={leafColor} stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="62" cy="55" r="9" fill={leafColor} stroke="#4D2B82" strokeWidth="2.5" />
        <circle cx="50" cy="40" r="10" fill={leafColor} stroke="#4D2B82" strokeWidth="2.5" />
      </svg>
    );
  }

  if (stage === 2) {
    // Stage 2: Medium sized bushy tree without fruits
    return (
      <svg viewBox="0 0 100 100" className="w-28 h-28">
        {/* Soil base */}
        <path d="M 22 88 Q 50 74 78 88 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3" />
        {/* Trunk */}
        <path d="M 50 88 L 50 50" stroke="#78350F" strokeWidth="9" strokeLinecap="round" />
        {/* Bushy Green Canopy */}
        <path 
          d="M 32 50 C 20 50, 16 34, 30 25 C 22 10, 48 4, 50 16 C 52 4, 78 10, 70 25 C 84 34, 80 50, 68 50 Z" 
          fill="#16A34A" 
          stroke="#4D2B82" 
          strokeWidth="3.5" 
          strokeLinejoin="round" 
        />
        {/* Shadow details in canopy */}
        <path d="M 38 42 C 44 38, 56 38, 62 42" stroke="#15803D" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // Stage 3: Fully bloomed and fruited gorgeous large tree
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      {/* Soil base */}
      <path d="M 24 102 Q 60 88 96 102 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3" />
      {/* Trunk */}
      <path d="M 60 102 L 60 55" stroke="#78350F" strokeWidth="12" strokeLinecap="round" />
      <path d="M 60 65 L 42 48" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
      <path d="M 60 60 L 78 46" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
      
      {/* Giant Bushy Green Canopy with vibrant gradients */}
      <path 
        d="M 40 55 C 22 55, 18 36, 36 26 C 26 8, 58 2, 60 18 C 62 2, 94 8, 84 26 C 102 36, 98 55, 80 55 Z" 
        fill="url(#canopyGrad)" 
        stroke="#4D2B82" 
        strokeWidth="4" 
        strokeLinejoin="round" 
      />

      {/* Hanging shiny fruits */}
      <g>
        {/* Fruit 1 */}
        <circle cx="38" cy="38" r="7" fill={fruitColor} stroke="#4D2B82" strokeWidth="2.5" />
        <path d="M 38 31 Q 40 28 38 29" stroke="#78350F" strokeWidth="1.5" fill="none" />
        
        {/* Fruit 2 */}
        <circle cx="52" cy="46" r="7" fill={fruitColor} stroke="#4D2B82" strokeWidth="2.5" />
        <path d="M 52 39 Q 54 36 52 37" stroke="#78350F" strokeWidth="1.5" fill="none" />
        
        {/* Fruit 3 */}
        <circle cx="68" cy="36" r="7" fill={fruitColor} stroke="#4D2B82" strokeWidth="2.5" />
        
        {/* Fruit 4 */}
        <circle cx="80" cy="44" r="7" fill={fruitColor} stroke="#4D2B82" strokeWidth="2.5" />
      </g>

      <defs>
        <linearGradient id="canopyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="60%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SVGFlower({ type, stage }: { type: "flower" | "sunflower"; stage: number }) {
  if (stage === 0) {
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <path d="M 15 85 Q 50 55 85 85 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3.5" />
        <motion.path 
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          d="M 50 62 C 45 52, 40 52, 38 56 C 36 60, 44 64, 50 62 C 56 64, 64 60, 62 56 M 50 62 L 50 72" 
          stroke="#AEEA00" 
          strokeWidth="3.5" 
          fill="#AEEA00" 
        />
      </svg>
    );
  }

  if (stage === 1) {
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <path d="M 20 85 Q 50 65 80 85 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3" />
        <path d="M 50 85 L 50 52" stroke="#22C55E" strokeWidth="5.5" strokeLinecap="round" />
        {/* Closed bud */}
        <ellipse cx="50" cy="46" rx="8" ry="11" fill="#EF4444" stroke="#4D2B82" strokeWidth="2.5" />
        <path d="M 44 50 C 47 42, 53 42, 56 50" fill="none" stroke="#22C55E" strokeWidth="2" />
      </svg>
    );
  }

  if (stage === 2) {
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <path d="M 20 85 Q 50 65 80 85 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3" />
        <path d="M 50 85 L 50 42" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
        {/* Semi open flower */}
        <circle cx="50" cy="34" r="14" fill="#FBBF24" stroke="#4D2B82" strokeWidth="3" />
        <path d="M 40 34 C 44 26, 56 26, 60 34" fill="none" stroke="#F59E0B" strokeWidth="2" />
      </svg>
    );
  }

  // Stage 3: Fully bloomed and gorgeous flower (Rose or Sunflower)
  if (type === "flower") {
    return (
      <svg viewBox="0 0 100 100" className="w-28 h-28">
        <path d="M 20 90 Q 50 72 80 90 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3" />
        <path d="M 50 90 L 50 45" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" />
        <path d="M 50 65 Q 36 60 40 55" stroke="#22C55E" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        
        {/* Rose Petals (Vector Layering) */}
        <g>
          {/* Outer petals */}
          <circle cx="34" cy="38" r="13" fill="#EC4899" stroke="#4D2B82" strokeWidth="2.5" />
          <circle cx="66" cy="38" r="13" fill="#EC4899" stroke="#4D2B82" strokeWidth="2.5" />
          <circle cx="50" cy="22" r="13" fill="#EC4899" stroke="#4D2B82" strokeWidth="2.5" />
          <circle cx="50" cy="54" r="13" fill="#EC4899" stroke="#4D2B82" strokeWidth="2.5" />
          {/* Inner petals */}
          <circle cx="50" cy="38" r="14" fill="#F43F5E" stroke="#4D2B82" strokeWidth="3" />
          <circle cx="50" cy="38" r="7" fill="#E11D48" />
        </g>
      </svg>
    );
  }

  // Sunflower
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28">
      <path d="M 20 90 Q 50 72 80 90 Z" fill="#5C4033" stroke="#4D2B82" strokeWidth="3" />
      <path d="M 50 90 L 50 45" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" />
      
      {/* Sunflower Petals ring */}
      <g>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <ellipse
            key={deg}
            cx="50"
            cy="36"
            rx="5"
            ry="18"
            fill="#FBBF24"
            stroke="#4D2B82"
            strokeWidth="2"
            transform={`rotate(${deg} 50 36)`}
          />
        ))}
        {/* Core Center Seed ring */}
        <circle cx="50" cy="36" r="11" fill="#78350F" stroke="#4D2B82" strokeWidth="2.5" />
        {/* Cute Face */}
        <circle cx="47" cy="34" r="1" fill="#FFF" />
        <circle cx="53" cy="34" r="1" fill="#FFF" />
        <path d="M 48 38 Q 50 40 52 38" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
      
      {/* Sun rays path rotation */}
      <g className="animate-[spin_40s_linear_infinite]" style={{ transformOrigin: "50px 50px" }}>
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
      
      {/* Sun Body */}
      <circle cx="50" cy="50" r="24" fill="url(#sunGrad)" stroke="#4D2B82" strokeWidth="3.5" />
      
      {/* Face details */}
      <circle cx="43" cy="46" r="2.5" fill="#4D2B82" />
      <circle cx="57" cy="46" r="2.5" fill="#4D2B82" />
      <circle cx="37" cy="51" r="2" fill="#FF8A8A" opacity="0.6" />
      <circle cx="63" cy="51" r="2" fill="#FF8A8A" opacity="0.6" />
      <path d="M 45 52 Q 50 58 55 52" stroke="#4D2B82" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Types
interface GardenPlot {
  id: number;
  plantType: "apple" | "orange" | "flower" | "sunflower" | null;
  growthStage: 0 | 1 | 2 | 3;
  waterCount: number;
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

    const savedPets = localStorage.getItem("bloomly_unlocked_pets");
    if (savedPets) {
      setUnlockedPets(JSON.parse(savedPets));
    } else {
      setUnlockedPets([]);
      localStorage.setItem("bloomly_unlocked_pets", JSON.stringify([]));
    }
  }, []);

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
    { type: "apple", name: "شجرة التفاح 🍎", cost: 10, payout: 25 },
    { type: "orange", name: "شجرة البرتقال 🍊", cost: 15, payout: 35 },
    { type: "flower", name: "زهرة الورد الجوري 🌸", cost: 8, payout: 20 },
    { type: "sunflower", name: "عباد الشمس السعيد 🌻", cost: 12, payout: 30 },
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

    updateStars(-pet.cost);
    synth.playPetUnlock();
    const nextPets = [...unlockedPets, petId];
    saveGardenData(plots, nextPets);
    triggerNotice(`🐣 مرحباً بك يا ${pet.name} في حديقتنا!`);
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-gradient-to-b from-[#E0F2FE] via-[#FAF7FD] to-[#DCFCE7] select-none font-sans flex flex-col justify-between overflow-hidden">
      
      {/* 1. Header Area */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b-4 border-[#4D2B82] p-4 flex items-center justify-between shadow-md relative z-30 select-none">
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
          <button
            onClick={() => {
              synth.playPop();
              setShowPetShop(true);
            }}
            className="btn-bubbly-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            🐾 متجر الحيوانات
          </button>

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

      {/* 3. Wide Scrollable Garden Field (Horizontal Scrolling!) */}
      <main className="flex-grow w-full overflow-x-auto scrollbar-none relative flex flex-col justify-end pb-8">
        
        {/* Sky Background Decor */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Beautiful Illustrative Sun */}
          <div className="absolute top-8 left-[10%] z-10">
            <SVGSun />
          </div>
          
          <div className="absolute top-12 left-[30%] text-6xl opacity-30 animate-pulse">☁️</div>
          <div className="absolute top-20 left-[70%] text-5xl opacity-40 animate-bounce-slow">☁️</div>
          <div className="absolute top-14 right-[10%] text-6xl opacity-30">☁️</div>
        </div>

        {/* Horizontal Container Width (Large Garden) */}
        <div className="min-w-[160vw] sm:min-w-[1500px] h-full flex flex-col justify-end relative z-10">
          
          {/* Roaming Unlocked Pets */}
          {unlockedPets.map((petId, idx) => {
            const pet = petsData.find(p => p.id === petId);
            if (!pet) return null;

            const speed = 15 + idx * 4;
            const direction = idx % 2 === 0 ? 1 : -1;

            return (
              <motion.div
                key={petId}
                animate={{
                  x: direction > 0 ? ["0vw", "140vw", "0vw"] : ["140vw", "0vw", "140vw"],
                  y: [0, -16, 0, -22, 0],
                  scaleX: direction > 0 ? [1, 1, -1, -1, 1] : [-1, -1, 1, 1, -1],
                }}
                transition={{
                  x: { repeat: Infinity, duration: speed, ease: "linear" },
                  y: { repeat: Infinity, duration: 1.1 + idx * 0.25, ease: "easeInOut" },
                }}
                className="absolute bottom-[20%] z-20 pointer-events-none select-none filter drop-shadow-lg"
              >
                {petId === "rabbit" && <SVGBunny className="w-18 h-18" />}
                {petId === "cat" && <SVGKitty className="w-18 h-18" />}
                {petId === "duck" && <SVGDuck className="w-18 h-18" />}
                {petId === "dog" && <SVGPuppy className="w-18 h-18" />}
              </motion.div>
            );
          })}

          {/* Landscape Grass Hills & White Picket Fence */}
          <div className="absolute bottom-0 inset-x-0 h-[48%] z-0 select-none">
            {/* White Picket Fence */}
            <div className="absolute top-[-20px] inset-x-0 h-8 flex justify-around pointer-events-none z-10" dir="ltr">
              {Array.from({ length: 45 }).map((_, i) => (
                <div key={i} className="w-2.5 h-10 bg-white border-2 border-[#4D2B82] rounded-t-sm shadow-sm relative">
                  <div className="absolute top-3 inset-x-[-4px] h-1.5 bg-white border-y border-[#4D2B82]" />
                </div>
              ))}
            </div>

            {/* Grass Layers with SVG wavy gradients */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1000 100">
              <path d="M 0 40 Q 250 20 500 50 Q 750 80 1000 40 L 1000 100 L 0 100 Z" fill="url(#grassGrad1)" stroke="#4D2B82" strokeWidth="2.5" />
              <path d="M 0 60 Q 300 80 600 50 Q 850 30 1000 70 L 1000 100 L 0 100 Z" fill="url(#grassGrad2)" opacity="0.9" />
              
              <defs>
                <linearGradient id="grassGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="100%" stopColor="#16A34A" />
                </linearGradient>
                <linearGradient id="grassGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#15803D" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 5 Plant Plots aligned horizontally */}
          <div className="w-full flex justify-around items-end px-16 relative z-10 pb-8 h-[280px]">
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
                        initial={{ opacity: 0, y: -45, x: 25, rotate: 0 }}
                        animate={{ opacity: 1, y: -25, x: 35, rotate: -35 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-28 left-4 z-40 text-5xl select-none"
                      >
                        🚿
                        <motion.span
                          animate={{ y: [0, 20, 40], opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.25 }}
                          className="absolute top-8 left-[-15px] text-xs text-blue-400 block"
                        >
                          💧 💧
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Growth Progress Indicator */}
                  {!isEmpty && !isFullyGrown && (
                    <div className="bg-white border-2 border-[#4D2B82] rounded-full px-3 py-0.5 text-[10px] font-black text-blue-500 shadow-sm flex items-center gap-1">
                      <span>💧 {plot.waterCount}/3</span>
                      <span className="text-gray-400">|</span>
                      <span>مستوى {plot.growthStage + 1}</span>
                    </div>
                  )}

                  {/* Custom SVG Tree or Sprout representation */}
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      synth.playPop();
                      if (isEmpty) {
                        setActivePlotId(plot.id);
                        setShowSeedShop(true);
                      }
                    }}
                    className={`w-32 h-32 rounded-full flex flex-col items-center justify-end relative cursor-pointer select-none transition-all pb-3`}
                  >
                    {isEmpty ? (
                      <div className="w-24 h-24 rounded-full bg-[#8D6E63] border-4 border-[#4E342E] hover:bg-[#795548] flex flex-col items-center justify-center shadow-inner relative z-10">
                        <span className="text-3xl text-white font-extrabold">+</span>
                        <span className="text-[10px] text-yellow-100 font-extrabold">بذرة جديدة</span>
                      </div>
                    ) : (
                      <motion.div
                        animate={
                          isFullyGrown 
                            ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } 
                            : { y: [0, -2, 0] }
                        }
                        transition={{ repeat: Infinity, duration: isFullyGrown ? 1.8 : 2 }}
                        className="relative z-10 mb-[-12px]"
                      >
                        {(plot.plantType === "apple" || plot.plantType === "orange") ? (
                          <SVGTree type={plot.plantType} stage={plot.growthStage} />
                        ) : (
                          <SVGFlower type={plot.plantType as "flower" | "sunflower"} stage={plot.growthStage} />
                        )}
                      </motion.div>
                    )}

                    {/* Rich Mud Pile Outline base */}
                    <div className="absolute bottom-2 w-28 h-5 bg-[#5D4037] border-2 border-[#3E2723] rounded-full z-0" />
                  </motion.div>

                  {/* Plot Controls buttons */}
                  {!isEmpty && (
                    <div className="flex gap-1.5 z-20">
                      {!isFullyGrown && (
                        <button
                          onClick={() => handleWaterPlant(plot.id)}
                          className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-black text-[11px] px-3.5 py-2 rounded-full border-2 border-[#0369A1] shadow-md active:translate-y-0.5 cursor-pointer flex items-center gap-1"
                        >
                          <span>💧</span>
                          <span>ري (2⭐)</span>
                        </button>
                      )}

                      {isFullyGrown && (
                        <button
                          onClick={() => handleHarvest(plot.id)}
                          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-yellow-950 font-black text-[11px] px-3.5 py-2 rounded-full border-2 border-[#B45309] shadow-md active:translate-y-0.5 cursor-pointer flex items-center gap-1 animate-bounce-slow"
                        >
                          <span>🌾</span>
                          <span>احصد النجوم!</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Plot Label */}
                  <span className="text-xs font-black text-[#4E342E] bg-amber-50/90 px-3 py-0.5 rounded-full border border-amber-200 shadow-xs">
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
