// Web Audio API Retro Sound Effects Synthesizer

let audioCtx: AudioContext | null = null;
let isMutedState = false;
let humOscillator: OscillatorNode | null = null;
let humGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Lazy initialization on first user interaction
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const audioSystem = {
  isMuted() {
    return isMutedState;
  },

  toggleMute() {
    isMutedState = !isMutedState;
    if (isMutedState) {
      this.stopHum();
    } else {
      this.startHum();
    }
    return isMutedState;
  },

  setMuted(muted: boolean) {
    isMutedState = muted;
    if (isMutedState) {
      this.stopHum();
    } else {
      this.startHum();
    }
  },

  // Mechanical typing sound clack
  playKeyPress(isSpecialKey = false) {
    if (isMutedState) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // We combine a noise source (or a fast frequency modulation) and a bandpass filter
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (isSpecialKey) {
      // Deeper clack (Enter, Space, Backspace)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
      
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      // Normal keys clack
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      
      osc.start(now);
      osc.stop(now + 0.04);
    }
  },

  // Retro system error beep/buzz
  playError() {
    if (isMutedState) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  },

  // Retro system success chime
  playSuccess() {
    if (isMutedState) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (ascending arpeggio)
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gainNode.gain.setValueAtTime(0.08, now + idx * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  },

  // Retro BIOS boot chime
  playBoot() {
    if (isMutedState) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Nostalgic major chord (C3, G3, C4, E4)
    const chord = [130.81, 196.00, 261.63, 329.63];
    
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      
      // Delay entrance slightly for vintage feel
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.04, now + 0.2 + idx * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.6);
    });
  },

  // Ambient fan/transformer hum
  startHum() {
    if (isMutedState || humOscillator) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A hum
      
      gainNode.gain.setValueAtTime(0.004, ctx.currentTime); // Extremely quiet
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      
      humOscillator = osc;
      humGain = gainNode;
    } catch (e) {
      console.warn("Could not start background hum:", e);
    }
  },

  stopHum() {
    if (humOscillator) {
      try {
        humOscillator.stop();
        humOscillator.disconnect();
      } catch (e) {}
      humOscillator = null;
    }
    if (humGain) {
      try {
        humGain.disconnect();
      } catch (e) {}
      humGain = null;
    }
  }
};
