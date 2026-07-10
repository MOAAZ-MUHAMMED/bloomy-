class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientInterval: any = null;
  private ambientDrone: OscillatorNode | null = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    // Initialized lazily on first user interaction
  }

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.init();

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isMuted) {
      this.stopMusic();
      this.stopDrone();
    } else {
      this.startMusic();
      this.startDrone();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private startDrone() {
    if (this.isMuted || !this.ctx || this.ambientDrone) return;

    try {
      // Create a low nether portal/ambient hum drone
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.value = 55; // A1 note
      osc2.type = "triangle";
      osc2.frequency.value = 55.5; // detuned slightly for chorus effect

      filter.type = "lowpass";
      filter.frequency.value = 120; // very muffled

      gain.gain.value = 0.04; // very quiet

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc2.start();

      this.ambientDrone = osc;
    } catch (e) {
      console.warn("Failed to start ambient drone:", e);
    }
  }

  private stopDrone() {
    if (this.ambientDrone) {
      try {
        this.ambientDrone.stop();
      } catch (e) {}
      this.ambientDrone = null;
    }
  }

  // Play a simple synthesized sound effect
  public playSound(type: "step_grass" | "step_stone" | "chest_open" | "chest_close" | "craft" | "jump" | "portal_teleport") {
    if (this.isMuted || !this.ctx) return;
    
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    try {
      switch (type) {
        case "step_grass": {
          // Generate high pass filtered white noise
          const bufferSize = this.ctx.sampleRate * 0.06; // 60ms
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(800, now);
          filter.Q.setValueAtTime(3, now);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          noise.start(now);
          break;
        }
        case "step_stone": {
          // A short metallic tap
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }
        case "chest_open": {
          // Creaking chest sound (pitch slide up)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.linearRampToValueAtTime(350, now + 0.25);

          gain.gain.setValueAtTime(0.0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }
        case "chest_close": {
          // Creaking chest sound (pitch slide down)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(120, now + 0.22);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.28);
          break;
        }
        case "craft": {
          // High pitch click/pop representing item crafting
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(600, now);
          osc1.frequency.setValueAtTime(1200, now + 0.04);

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(200, now);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.16);
          osc2.stop(now + 0.16);
          break;
        }
        case "jump": {
          // A bouncy swoosh pitch bend
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }
        case "portal_teleport": {
          // Retro windup sweep
          const duration = 1.2;
          const osc = this.ctx.createOscillator();
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          const gain = this.ctx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(80, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + duration);

          lfo.type = "sine";
          lfo.frequency.value = 16; // tremolo/vibrato
          lfoGain.gain.value = 30; // vibrato range

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);

          lfo.start(now);
          osc.start(now);

          lfo.stop(now + duration);
          osc.stop(now + duration);
          break;
        }
      }
    } catch (e) {
      console.warn("Sound effect playback failed:", e);
    }
  }

  // Play a soft, beautiful ambient background melody (reminiscent of C418's piano/synth works)
  private startMusic() {
    if (this.isMuted || !this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // A beautiful slow progression of notes (G major / E minor pentatonic scale)
    const melody = [
      { note: 392.00, dur: 1.5, delay: 0 },    // G4
      { note: 440.00, dur: 1.5, delay: 1.5 },  // A4
      { note: 493.88, dur: 3.0, delay: 3.0 },  // B4
      { note: 587.33, dur: 1.5, delay: 6.5 },  // D5
      { note: 493.88, dur: 1.5, delay: 8.0 },  // B4
      { note: 440.00, dur: 4.0, delay: 9.5 },  // A4
      
      { note: 329.63, dur: 2.0, delay: 15.0 }, // E4
      { note: 392.00, dur: 2.0, delay: 17.0 }, // G4
      { note: 293.66, dur: 4.0, delay: 19.0 }, // D4
      
      { note: 587.33, dur: 2.0, delay: 24.0 }, // D5
      { note: 659.25, dur: 2.0, delay: 26.0 }, // E5
      { note: 783.99, dur: 4.0, delay: 28.0 }, // G5
      { note: 739.99, dur: 4.0, delay: 32.0 }, // F#5
    ];

    const playMelodyInstance = () => {
      if (this.isMuted || !this.ctx || !this.isMusicPlaying) return;

      const now = this.ctx.currentTime;
      const synthVoice = (freq: number, startTime: number, duration: number) => {
        if (!this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const delay = this.ctx.createDelay();
        const feedback = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1000, startTime);
        filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.3); // soft attack
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        // Simple echo effect
        delay.delayTime.value = 0.45;
        feedback.gain.value = 0.35;

        osc.connect(filter);
        filter.connect(gain);
        
        // Connect to output
        gain.connect(this.ctx.destination);
        
        // Connect feedback echo
        gain.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 1.0);
      };

      melody.forEach(item => {
        synthVoice(item.note, now + item.delay, item.dur);
      });
    };

    // Run melody initially
    playMelodyInstance();

    // Loop every 40 seconds (giving some quiet pause between repetitions like actual Minecraft)
    this.ambientInterval = setInterval(() => {
      playMelodyInstance();
    }, 45000);
  }

  private stopMusic() {
    this.isMusicPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const audioManager = new AudioManager();
