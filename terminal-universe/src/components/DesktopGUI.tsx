import React, { useState, useEffect, useRef, useCallback } from "react";
import { audioSystem } from "@/utils/audio";
import SnakeGame from "./games/SnakeGame";
import Terminal from "./Terminal";
import {
  Terminal as TermIcon,
  Gamepad2,
  Cpu,
  User,
  Music,
  FolderOpen,
  X,
  Minus,
  Square,
  Play,
  Pause,
  LogOut,
  Sliders,
  Settings,
  MonitorPlay,
  Volume2,
  VolumeX
} from "lucide-react";

interface DesktopGUIProps {
  theme: string;
  setTheme: (t: string) => void;
  setActiveMode: (m: "terminal" | "gui" | "matrix" | "snake") => void;
}

interface WindowInstance {
  id: string;
  title: string;
  isOpen: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  icon: React.ReactNode;
}

export default function DesktopGUI({ theme, setTheme, setActiveMode }: DesktopGUIProps) {
  // Sound and clock states
  const [time, setTime] = useState(new Date());
  const [isAudioMuted, setIsAudioMuted] = useState(audioSystem.isMuted());
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  // Music Synthesizer States
  const [musicPlaying, setMusicPlaying] = useState(false);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualizerAnimRef = useRef<number | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);

  // System statistics mock (CPU & Memory animated)
  const [cpuUsage, setCpuUsage] = useState(25);
  const [memUsage, setMemUsage] = useState(48);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const statsTimer = setInterval(() => {
      setCpuUsage((prev) => Math.max(10, Math.min(95, prev + Math.floor(Math.random() * 21) - 10)));
      setMemUsage((prev) => Math.max(40, Math.min(75, prev + Math.floor(Math.random() * 5) - 2)));
    }, 2000);
    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, []);

  // Draggable Windows State
  const [windows, setWindows] = useState<WindowInstance[]>([
    {
      id: "terminal",
      title: "Command Terminal (AetherShell)",
      isOpen: true,
      isMaximized: false,
      x: 80,
      y: 40,
      width: 680,
      height: 440,
      zIndex: 10,
      icon: <TermIcon size={14} />
    },
    {
      id: "snake",
      title: "Grid Snake v1.0",
      isOpen: false,
      isMaximized: false,
      x: 150,
      y: 80,
      width: 360,
      height: 520,
      zIndex: 5,
      icon: <Gamepad2 size={14} />
    },
    {
      id: "sysinfo",
      title: "System Performance Monitor",
      isOpen: false,
      isMaximized: false,
      x: 200,
      y: 120,
      width: 400,
      height: 320,
      zIndex: 4,
      icon: <Cpu size={14} />
    },
    {
      id: "about",
      title: "User Profile & Biography",
      isOpen: false,
      isMaximized: false,
      x: 250,
      y: 90,
      width: 480,
      height: 360,
      zIndex: 3,
      icon: <User size={14} />
    },
    {
      id: "synthesizer",
      title: "Cyber-Ambient Music Synthesizer",
      isOpen: false,
      isMaximized: false,
      x: 300,
      y: 150,
      width: 450,
      height: 280,
      zIndex: 6,
      icon: <Music size={14} />
    }
  ]);

  // Track dragging window
  const [dragState, setDragState] = useState<{
    windowId: string;
    startX: number;
    startY: number;
    startWinX: number;
    startWinY: number;
  } | null>(null);

  // Manage z-indexes
  const bringToFront = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
    setStartMenuOpen(false);
  };

  const openWindow = (id: string) => {
    audioSystem.playSuccess();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: true } : w))
    );
    bringToFront(id);
  };

  const closeWindow = (id: string) => {
    audioSystem.playKeyPress(true);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
  };

  const toggleMaximize = (id: string) => {
    audioSystem.playKeyPress();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  // Draggable logic listeners
  const startDrag = (e: React.MouseEvent, id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win || win.isMaximized) return;

    bringToFront(id);
    setDragState({
      windowId: id,
      startX: e.clientX,
      startY: e.clientY,
      startWinX: win.x,
      startWinY: win.y
    });
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      setWindows((prev) =>
        prev.map((w) =>
          w.id === dragState.windowId
            ? {
                ...w,
                x: Math.max(0, Math.min(window.innerWidth - 100, dragState.startWinX + deltaX)),
                y: Math.max(0, Math.min(window.innerHeight - 80, dragState.startWinY + deltaY))
              }
            : w
        )
      );
    };

    const handleMouseUp = () => {
      if (dragState) {
        setDragState(null);
      }
    };

    if (dragState) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState]);

  // Music Synth synthesizer logic
  const startSynthesizerMusic = () => {
    if (musicPlaying) return;

    // Web Audio synthesizer
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyserNodeRef.current = analyser;

    // Synthwave arpeggio pattern: minor chord progression
    // C3, Eb3, G3, Bb3, D4, Bb3, G3, Eb3...
    const notes = [
      [130.81, 155.56, 196.00, 233.08, 293.66, 233.08, 196.00, 155.56], // C minor 9
      [146.83, 174.61, 220.00, 261.63, 329.63, 261.63, 220.00, 174.61]  // D minor 9
    ];

    let noteIdx = 0;
    let chordIdx = 0;

    synthIntervalRef.current = setInterval(() => {
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      const currentChord = notes[chordIdx];
      const freq = currentChord[noteIdx];

      // Bass note oscillator
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);

      // Lead harmonic triangle oscillator
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, now); // Octave up

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.04, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.4);
      osc2.stop(now + 0.4);

      noteIdx = (noteIdx + 1) % currentChord.length;
      if (noteIdx === 0) {
        chordIdx = (chordIdx + 1) % notes.length;
      }
    }, 200);

    setMusicPlaying(true);
    drawVisualizer();
  };

  const stopSynthesizerMusic = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (visualizerAnimRef.current) {
      cancelAnimationFrame(visualizerAnimRef.current);
      visualizerAnimRef.current = null;
    }
    setMusicPlaying(false);
  };

  // Canvas visualizer drawer loop
  const drawVisualizer = () => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = analyserNodeRef.current;
    if (!ctx || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      visualizerAnimRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      // Theme-specific visualizer bars color
      let barColor = "#22c55e"; // Matrix green default
      if (theme === "amber") barColor = "#f97316";
      else if (theme === "cyberpunk") barColor = "#06b6d4";
      else if (theme === "cobalt") barColor = "#3b82f6";
      else if (theme === "classic") barColor = "#e2e8f0";

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5;

        ctx.fillStyle = barColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = barColor;
        
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };
    draw();
  };

  useEffect(() => {
    // Ensure clean synthesis tear down
    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (visualizerAnimRef.current) cancelAnimationFrame(visualizerAnimRef.current);
    };
  }, []);

  const handleToggleMute = () => {
    const nextMute = audioSystem.toggleMute();
    setIsAudioMuted(nextMute);
    if (!nextMute) {
      audioSystem.playSuccess();
    }
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none"
      style={{
        backgroundImage: `radial-gradient(rgba(10, 20, 40, 0.5) 1px, transparent 0), radial-gradient(rgba(10, 20, 40, 0.5) 1px, transparent 0)`,
        backgroundSize: "24px 24px",
        backgroundPosition: "0 0, 12px 12px"
      }}
    >
      {/* Scanline CRT overlay */}
      <div className="scanline animate-scanline"></div>

      {/* Desktop Workspace Icons Grid */}
      <div className="absolute top-6 left-6 flex flex-col gap-6 z-0">
        {/* Terminal Icon */}
        <button
          onDoubleClick={() => openWindow("terminal")}
          onClick={() => openWindow("terminal")}
          className="flex flex-col items-center gap-1.5 w-18 text-center cursor-pointer group"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded bg-slate-900/60 border border-slate-700/50 group-hover:border-terminal-text group-hover:bg-slate-800/80 transition duration-200 shadow-md">
            <TermIcon className="text-terminal-text" size={24} />
          </div>
          <span className="text-[11px] font-mono font-medium tracking-wide text-white/90 bg-slate-950/70 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-full">
            Shell.exe
          </span>
        </button>

        {/* Snake Icon */}
        <button
          onDoubleClick={() => openWindow("snake")}
          onClick={() => openWindow("snake")}
          className="flex flex-col items-center gap-1.5 w-18 text-center cursor-pointer group"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded bg-slate-900/60 border border-slate-700/50 group-hover:border-terminal-text group-hover:bg-slate-800/80 transition duration-200 shadow-md">
            <Gamepad2 className="text-amber-500" size={24} />
          </div>
          <span className="text-[11px] font-mono font-medium tracking-wide text-white/90 bg-slate-950/70 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-full">
            Snake.exe
          </span>
        </button>

        {/* Synth Music Icon */}
        <button
          onDoubleClick={() => openWindow("synthesizer")}
          onClick={() => openWindow("synthesizer")}
          className="flex flex-col items-center gap-1.5 w-18 text-center cursor-pointer group"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded bg-slate-900/60 border border-slate-700/50 group-hover:border-terminal-text group-hover:bg-slate-800/80 transition duration-200 shadow-md">
            <Music className="text-cyan-400" size={24} />
          </div>
          <span className="text-[11px] font-mono font-medium tracking-wide text-white/90 bg-slate-950/70 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-full">
            AudioSynth
          </span>
        </button>

        {/* Sys Monitor Icon */}
        <button
          onDoubleClick={() => openWindow("sysinfo")}
          onClick={() => openWindow("sysinfo")}
          className="flex flex-col items-center gap-1.5 w-18 text-center cursor-pointer group"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded bg-slate-900/60 border border-slate-700/50 group-hover:border-terminal-text group-hover:bg-slate-800/80 transition duration-200 shadow-md">
            <Cpu className="text-red-400" size={24} />
          </div>
          <span className="text-[11px] font-mono font-medium tracking-wide text-white/90 bg-slate-950/70 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-full">
            SysStats
          </span>
        </button>

        {/* Biography Icon */}
        <button
          onDoubleClick={() => openWindow("about")}
          onClick={() => openWindow("about")}
          className="flex flex-col items-center gap-1.5 w-18 text-center cursor-pointer group"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded bg-slate-900/60 border border-slate-700/50 group-hover:border-terminal-text group-hover:bg-slate-800/80 transition duration-200 shadow-md">
            <User className="text-emerald-400" size={24} />
          </div>
          <span className="text-[11px] font-mono font-medium tracking-wide text-white/90 bg-slate-950/70 px-1.5 py-0.5 rounded border border-white/5 truncate max-w-full">
            AboutMe
          </span>
        </button>
      </div>

      {/* Render Draggable Windows */}
      {windows.map((win) => {
        if (!win.isOpen) return null;

        const isTerminalWin = win.id === "terminal";
        const isSnakeWin = win.id === "snake";

        return (
          <div
            key={win.id}
            onClick={() => bringToFront(win.id)}
            style={{
              zIndex: win.zIndex,
              left: win.isMaximized ? "0" : `${win.x}px`,
              top: win.isMaximized ? "0" : `${win.y}px`,
              width: win.isMaximized ? "100vw" : `${win.width}px`,
              height: win.isMaximized ? "calc(100vh - 48px)" : `${win.height}px`
            }}
            className={`absolute flex flex-col glass-window rounded-lg overflow-hidden border border-white/15 transition-all duration-75 shadow-2xl ${
              dragState?.windowId === win.id ? "opacity-90 scale-[0.99]" : ""
            }`}
          >
            {/* Window Header Titlebar (Draggable trigger) */}
            <div
              onMouseDown={(e) => startDrag(e, win.id)}
              className="flex items-center justify-between bg-slate-900/90 border-b border-white/10 px-4 py-2 cursor-move select-none"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                {win.icon}
                <span>{win.title}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => closeWindow(win.id)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                  title="Minimize"
                >
                  <Minus size={11} />
                </button>
                <button
                  onClick={() => toggleMaximize(win.id)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                  title="Maximize"
                >
                  <Square size={10} />
                </button>
                <button
                  onClick={() => closeWindow(win.id)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-red-600 rounded text-slate-400 hover:text-white transition cursor-pointer"
                  title="Close"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Window Content Body */}
            <div className="flex-1 overflow-auto bg-slate-950/85">
              {isTerminalWin && (
                <div className="w-full h-full">
                  <Terminal
                    theme={theme}
                    setTheme={setTheme}
                    setActiveMode={setActiveMode}
                    isEmbedded={true}
                  />
                </div>
              )}

              {isSnakeWin && (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <SnakeGame onClose={() => closeWindow(win.id)} embedded={true} />
                </div>
              )}

              {win.id === "sysinfo" && (
                <div className="p-6 font-mono text-sm space-y-6 text-terminal-text leading-relaxed">
                  <div className="space-y-2 border-b border-terminal-text/20 pb-3">
                    <h3 className="font-bold text-white text-base">HARDWARE METRIC STREAMS</h3>
                    <p className="text-[10px] text-terminal-text/60">KERNEL LINK: ESTABLISHED</p>
                  </div>

                  {/* CPU gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>CPU LOAD:</span>
                      <span className="font-bold text-white">{cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded overflow-hidden border border-white/5">
                      <div
                        className="bg-red-500 h-full transition-all duration-500"
                        style={{ width: `${cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Memory gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>RAM ALLOCATION:</span>
                      <span className="font-bold text-white">{memUsage}% (983MB / 2048MB)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded overflow-hidden border border-white/5">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${memUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Network stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-terminal-text/20 mt-4 text-terminal-text/90">
                    <div>
                      <p>LATENCY: <span className="text-white font-bold">14ms</span></p>
                      <p>PACKETS: <span className="text-white font-bold">482 / sec</span></p>
                    </div>
                    <div>
                      <p>IP ADDRESS: <span className="text-white font-bold">127.0.0.1</span></p>
                      <p>HOST PORT: <span className="text-white font-bold">5100</span></p>
                    </div>
                  </div>
                </div>
              )}

              {win.id === "about" && (
                <div className="p-6 font-mono text-sm text-terminal-text/90 space-y-4 leading-relaxed">
                  <div className="flex gap-4 border-b border-terminal-text/20 pb-4">
                    <div className="w-16 h-16 rounded border border-terminal-text flex items-center justify-center text-4xl shadow-inner bg-slate-900 shrink-0">
                      👨‍💻
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">AETHER DEVELOPER</h3>
                      <p className="text-xs text-terminal-text/70">Virtual Architect / UI Visionary</p>
                      <p className="text-[10px] text-emerald-400 mt-1">AVAILABLE FOR CONTRACT HIRE</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p>
                      Greetings! I specialize in merging retro terminal aesthetics with modern, smooth React/TypeScript workflows.
                    </p>
                    <p>
                      I build fast, SEO-friendly, and visual-heavy web apps. If you love CRT filters, custom sound boards, and high-fidelity transitions, we should team up.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      onClick={() => openWindow("terminal")}
                      className="px-3 py-1.5 border border-terminal-text/50 hover:bg-terminal-text hover:text-terminal-bg text-xs font-bold font-mono transition duration-200 cursor-pointer"
                    >
                      SEND_PING_SIGNAL (Open Terminal)
                    </button>
                  </div>
                </div>
              )}

              {win.id === "synthesizer" && (
                <div className="p-6 font-mono text-sm space-y-4 text-terminal-text leading-relaxed flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-base">CYBER-SYNTHESIZER CONTROL</h3>
                    <p className="text-xs text-terminal-text/70">
                      Click start to synthesize a dynamic minor chord progression arpeggio using synthesized Web Audio oscillators.
                    </p>
                  </div>

                  {/* Audio Visualizer Canvas */}
                  <div className="border border-white/10 rounded overflow-hidden bg-black/80 h-24">
                    <canvas
                      ref={visualizerCanvasRef}
                      width={400}
                      height={96}
                      className="w-full h-full block"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    {!musicPlaying ? (
                      <button
                        onClick={startSynthesizerMusic}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg font-bold text-xs transition duration-200 cursor-pointer"
                      >
                        <Play size={14} /> START SYNTHESIZER
                      </button>
                    ) : (
                      <button
                        onClick={stopSynthesizerMusic}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-bold text-xs transition duration-200 cursor-pointer"
                      >
                        <Pause size={14} /> STOP SYNTHESIZER
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Bottom Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/90 border-t border-white/10 flex items-center justify-between px-4 z-40 select-none backdrop-blur-md">
        
        {/* Start Button */}
        <div className="relative">
          <button
            onClick={() => {
              audioSystem.playKeyPress();
              setStartMenuOpen(!startMenuOpen);
            }}
            className="h-8 flex items-center gap-2 px-3 bg-slate-800 border border-slate-700 hover:border-terminal-text hover:bg-slate-700/80 rounded font-mono text-xs font-bold text-white transition cursor-pointer shadow-md"
          >
            <Sliders size={14} className="text-terminal-text" />
            <span>START_OS</span>
          </button>

          {/* Start Menu Popover */}
          {startMenuOpen && (
            <div className="absolute bottom-10 left-0 w-56 bg-slate-900 border border-white/15 rounded-lg shadow-2xl p-2 z-50 flex flex-col gap-1 font-mono text-xs text-white/90">
              <div className="px-3 py-1.5 border-b border-white/10 text-[10px] text-slate-500 uppercase tracking-widest">
                System Utilities
              </div>
              <button
                onClick={() => {
                  openWindow("terminal");
                  setStartMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded text-left transition cursor-pointer"
              >
                <TermIcon size={14} className="text-terminal-text" />
                <span>Command Shell</span>
              </button>
              <button
                onClick={() => {
                  openWindow("snake");
                  setStartMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded text-left transition cursor-pointer"
              >
                <Gamepad2 size={14} className="text-amber-500" />
                <span>Snake Game</span>
              </button>
              <button
                onClick={() => {
                  openWindow("synthesizer");
                  setStartMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded text-left transition cursor-pointer"
              >
                <Music size={14} className="text-cyan-400" />
                <span>AudioSynth Panel</span>
              </button>
              <button
                onClick={() => {
                  openWindow("sysinfo");
                  setStartMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded text-left transition cursor-pointer"
              >
                <Cpu size={14} className="text-red-400" />
                <span>System Metrics</span>
              </button>
              <button
                onClick={() => {
                  setActiveMode("matrix");
                  setStartMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded text-left transition cursor-pointer"
              >
                <MonitorPlay size={14} className="text-green-500" />
                <span>Matrix Screen Saver</span>
              </button>
              
              <div className="h-px bg-white/10 my-1"></div>
              
              <button
                onClick={() => {
                  stopSynthesizerMusic();
                  setActiveMode("terminal");
                  setStartMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded text-left transition cursor-pointer"
              >
                <LogOut size={14} className="text-rose-500" />
                <span>Exit GUI Mode</span>
              </button>
            </div>
          )}
        </div>

        {/* Active Application Window Tabs */}
        <div className="flex-1 flex gap-2 mx-4 overflow-x-auto max-w-full">
          {windows.map((win) => {
            if (!win.isOpen) return null;
            const isFront = win.zIndex === Math.max(...windows.map((w) => w.zIndex));
            return (
              <button
                key={win.id}
                onClick={() => bringToFront(win.id)}
                className={`h-8 flex items-center gap-2 px-3 border rounded text-[11px] font-mono tracking-wide transition cursor-pointer truncate max-w-[140px]
                  ${
                    isFront
                      ? "bg-slate-800 border-terminal-text text-white font-bold"
                      : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-white"
                  }`}
              >
                {win.icon}
                <span>{win.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* System Settings & Clock Tray */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 select-none">
          {/* Sound Muter */}
          <button
            onClick={handleToggleMute}
            className="hover:text-white p-1 transition cursor-pointer"
            title={isAudioMuted ? "Unmute system" : "Mute system"}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Quick theme cycle */}
          <button
            onClick={() => {
              const themes = ["green", "amber", "cyberpunk", "cobalt", "classic"];
              const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
              setTheme(themes[nextIdx]);
              audioSystem.playSuccess();
            }}
            className="hover:text-white flex items-center justify-center p-1 cursor-pointer"
            title="Cycle system theme"
          >
            <Settings size={14} />
          </button>

          {/* Calendar & Time display */}
          <div className="text-right leading-tight hidden sm:block">
            <p className="text-white text-[11px] font-bold">
              {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-[9px] text-slate-500 font-medium">
              {time.toLocaleDateString([], { month: "short", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
