import React, { useState, useEffect } from "react";
import { ThreeCanvas } from "./components/ThreeCanvas";
import { audioManager } from "@/lib/AudioManager";
import { 
  Volume2, VolumeX, ExternalLink, RefreshCw, X, Play
} from "lucide-react";

// Project Showcase Data (Diamond Block)
const PROJECTS = [
  {
    id: "huda",
    title: "Huda Educational Portal | بوابة الهدى التعليمية",
    type: "Web Application",
    icon: "🟩",
    desc: "A comprehensive academic portal built with React, Vite, Express, and Tailwind CSS. Features full dashboard management, program directories, and parent communications.",
    tech: ["React", "Express", "Vite", "Drizzle ORM", "Tailwind CSS"],
    link: "#"
  },
  {
    id: "voxel",
    title: "Voxel Canvas Renderer | محرك الرسوم مكعب ثلاثي الأبعاد",
    type: "Three.js Engine",
    icon: "💎",
    desc: "A custom 3D voxel sandbox built directly in WebGL/Three.js. Features procedural terrain generation, ambient occlusion calculations, and live block building physics.",
    tech: ["Three.js", "TypeScript", "Vite", "Web Audio API"],
    link: "#"
  },
  {
    id: "terminal",
    title: "Terminal Universe | لعبة محاكاة الفضاء",
    type: "Interactive Game",
    icon: "🚀",
    desc: "An immersive retro text-adventure space simulator featuring canvas-rendered animations, dynamic sound synthesis, and real-time state tracking.",
    tech: ["React", "HTML5 Canvas", "TailwindCSS v4", "Web Audio synth"],
    link: "/terminal-universe"
  }
];

// Works Data (Gold Block)
const WORKS = [
  {
    id: "w1",
    title: "Lead Full-Stack Builder | كبير مطوري الويب",
    company: "Voxel Forge Media",
    period: "2024 - PRESENT",
    desc: "Architected 3D hardware-accelerated user experiences, web portals, and database integrations. Improved site rendering speeds by 40%."
  },
  {
    id: "w2",
    title: "UI/UX Creative Builder | مصمم واجهات تفاعلية",
    company: "Blocky Lab",
    period: "2022 - 2024",
    desc: "Designed and implemented interactive landing pages, custom retro animations, and WebGL components for over 15 clients."
  },
  {
    id: "w3",
    title: "Voxel Systems Developer | مطور محركات رسومية",
    company: "Pixel Craft Studios",
    period: "2020 - 2022",
    desc: "Built procedural mesh algorithms and game client systems using JavaScript, TypeScript, and HTML5 WebGL Canvas."
  }
];

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hudNotify, setHUDNotify] = useState("Move Steve close to ore blocks to interact!");
  
  // Mobile controls
  const [joystickInput, setJoystickInput] = useState<{ x: number; y: number } | null>(null);
  const [jumpTriggered, setJumpTriggered] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [navTrigger, setNavTrigger] = useState<{ action: string; time: number } | null>(null);

  // Fade out notifier message after a delay
  useEffect(() => {
    if (hudNotify !== "") {
      const timer = setTimeout(() => {
        setHUDNotify("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hudNotify]);

  // Audio Toggle
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioManager.setMute(newMuted);
  };

  // Start world
  const enterWorld = () => {
    setHasStarted(true);
    setIsMuted(false);
    audioManager.setMute(false);
    setHUDNotify("Welcome! Use WASD/Arrows to walk, Space to jump.");
  };

  // Joystick handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setJoystickInput({ x: 0, y: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 50;
    
    if (dist === 0) {
      setJoystickInput({ x: 0, y: 0 });
    } else {
      const angle = Math.atan2(dy, dx);
      const intensity = Math.min(dist / maxDist, 1.0);
      setJoystickInput({
        x: Math.cos(angle) * intensity,
        y: -Math.sin(angle) * intensity
      });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setJoystickInput(null);
  };

  // Close modal
  const closeModal = () => {
    audioManager.playSound("chest_close");
    setActiveModal(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans select-none crt-overlay">
      {/* 3D Canvas */}
      {hasStarted && (
        <ThreeCanvas
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          joystickInput={joystickInput}
          jumpTriggered={jumpTriggered}
          clearJumpTrigger={() => setJumpTriggered(false)}
          showHUDNotify={hudNotify}
          setHUDNotify={setHUDNotify}
          navTrigger={navTrigger}
          clearNavTrigger={() => setNavTrigger(null)}
        />
      )}

      {/* --- Splash / Load Screen --- */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-radial from-[#1e1430] to-[#0c0a13] px-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.1)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
          
          <div className="mb-6 animate-bounce">
            <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">🟩</span>
          </div>
          
          <h1 className="font-pixel text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-[#9333ea] to-pink-500 mb-2 leading-relaxed tracking-wider">
            STEVE'S VOXEL REALM
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md font-light mb-8">
            An interactive 3D WebGL showcase built using Three.js, React, and Tailwind CSS.
          </p>

          <button
            onClick={enterWorld}
            className="flex items-center gap-3 px-8 py-4 font-pixel text-xs bg-gradient-to-r from-brand-cyan to-brand-purple hover:scale-105 active:scale-95 text-slate-900 font-bold rounded-lg shadow-lg shadow-brand-cyan/20 transition duration-200 cursor-pointer"
          >
            <Play size={16} fill="currentColor" />
            ENTER WORLD / دخول العالم
          </button>

          <div className="absolute bottom-6 text-slate-500 text-xs font-mono">
            Powered by Web Audio API & Three.js • 2026
          </div>
        </div>
      )}

      {/* --- HUD Controls --- */}
      {hasStarted && (
        <>
          {/* Top Right Buttons: Audio, Restart */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={toggleMute}
              className="p-3 glass-panel rounded-full text-slate-200 hover:text-white hover:bg-slate-800/40 active:scale-95 transition cursor-pointer"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX size={20} className="text-rose-400" /> : <Volume2 size={20} className="text-green-400" />}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="p-3 glass-panel rounded-full text-slate-200 hover:text-white hover:bg-slate-800/40 active:scale-95 transition cursor-pointer"
              title="Reset Scene"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Screen notification HUD center top */}
          {hudNotify && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-6 py-2 glass-panel border-brand-cyan/30 rounded-full text-brand-cyan font-pixel text-[10px] md:text-xs text-center tracking-wide shadow-md animate-pulse">
              {hudNotify}
            </div>
          )}

          {/* Bottom HUD */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center gap-3 px-4 pointer-events-none">
            {/* Status bars (Hearts & Food) */}
            <div className="flex justify-between w-64 md:w-80 px-2 select-none pointer-events-none">
              <div className="flex gap-0.5 text-rose-500 filter drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]">
                {Array(10).fill("❤️").map((h, i) => (
                  <span key={i} className="text-[10px] md:text-xs animate-bounce" style={{ animationDelay: `${i * 0.08}s`, animationDuration: "2s" }}>{h}</span>
                ))}
              </div>
              <div className="flex gap-0.5 text-orange-500 filter drop-shadow-[0_0_4px_rgba(249,115,22,0.4)]">
                {Array(10).fill("🍗").map((f, i) => (
                  <span key={i} className="text-[10px] md:text-xs">{f}</span>
                ))}
              </div>
            </div>

            {/* Hotbar */}
            <div className="flex items-center gap-1.5 p-1.5 glass-panel rounded-lg border-white/10 pointer-events-auto">
              {[
                { label: "Projects / المشاريع", icon: "💎", action: () => setNavTrigger({ action: "portal", time: Date.now() }) },
                { label: "Works / الأعمال", icon: "🪙", action: () => setNavTrigger({ action: "crafting", time: Date.now() }) },
                { label: "About Me / عني", icon: "🟢", action: () => setNavTrigger({ action: "chest", time: Date.now() }) },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-10 h-10 md:w-12 md:h-12 flex flex-col items-center justify-center bg-slate-950/40 hover:bg-slate-800/60 active:scale-95 border border-white/5 rounded text-lg transition cursor-pointer relative group"
                >
                  <span>{item.icon}</span>
                  <span className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 border border-white/10 text-[9px] rounded text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              ))}
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-950/20 border border-dashed border-white/10 rounded text-slate-600 text-xs">
                  -
                </div>
              ))}
            </div>

            {/* Keyboard HUD Helper */}
            <div className="hidden md:block text-[10px] text-slate-500 font-mono tracking-wide">
              WASD / ARROWS to Move • SPACE to Jump • [E] to Open Blocks
            </div>
          </div>

          {/* Mobile Joystick */}
          <div className="absolute bottom-6 left-6 z-20 block md:hidden pointer-events-auto">
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-24 h-24 rounded-full bg-slate-950/50 backdrop-blur border border-white/10 flex items-center justify-center relative touch-none"
            >
              <div
                className="w-10 h-10 rounded-full bg-brand-cyan/80 shadow-lg absolute transition-all"
                style={{
                  transform: joystickInput
                    ? `translate(${joystickInput.x * 25}px, ${-joystickInput.y * 25}px)`
                    : "translate(0px, 0px)"
                }}
              />
            </div>
          </div>

          {/* Mobile Jump Button */}
          <div className="absolute bottom-8 right-6 z-20 block md:hidden pointer-events-auto">
            <button
              onTouchStart={() => setJumpTriggered(true)}
              className="w-14 h-14 rounded-full bg-slate-950/60 backdrop-blur border border-white/20 flex items-center justify-center text-slate-300 active:bg-brand-purple active:text-white transition"
            >
              JUMP
            </button>
          </div>
        </>
      )}

      {/* --- MODAL 1: Projects Page (Diamond Block) --- */}
      {activeModal === "portal" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl glass-panel border-[#0ea5e9]/40 rounded-xl shadow-2xl flex flex-col h-[75vh] animate-fadeIn">
            
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">💎</span>
                <div>
                  <h2 className="font-pixel text-[11px] md:text-xs text-[#0ea5e9]">PROJECTS / مشاريعي</h2>
                  <p className="text-[10px] text-slate-400">Personal projects constructed by code</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 bg-rose-950/40 text-rose-400 hover:bg-rose-900 hover:text-white rounded border border-rose-900/50 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Close Page"
              >
                <X size={16} /> Close / إغلاق
              </button>
            </div>

            {/* List */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-950/20">
              {PROJECTS.map((proj) => (
                <div 
                  key={proj.id}
                  className="p-4 rounded-lg bg-slate-900/60 border border-white/5 hover:border-[#0ea5e9]/40 hover:bg-slate-900/80 transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="text-2xl mt-0.5">{proj.icon}</span>
                      <div>
                        <h3 className="font-semibold text-slate-200 group-hover:text-[#0ea5e9] transition">{proj.title}</h3>
                        <span className="text-[9px] text-[#0ea5e9] font-mono bg-[#0ea5e9]/10 px-2 py-0.5 rounded">
                          {proj.type}
                        </span>
                      </div>
                    </div>
                    
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition border border-white/5"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 font-light leading-relaxed">
                    {proj.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.tech.map((t, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-850 text-slate-400 px-2 py-0.5 rounded font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Close */}
            <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 font-pixel text-[10px] bg-[#0ea5e9] text-slate-950 font-bold hover:scale-105 transition rounded cursor-pointer"
              >
                Return to World / عودة للعالم
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 2: Works Page (Gold Block) --- */}
      {activeModal === "crafting" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl glass-panel border-[#f59e0b]/40 rounded-xl shadow-2xl flex flex-col h-[75vh] animate-fadeIn">
            
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <div>
                  <h2 className="font-pixel text-[11px] md:text-xs text-[#f59e0b]">WORKS / أعمالي</h2>
                  <p className="text-[10px] text-slate-400">Professional timeline & experience</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 bg-rose-950/40 text-rose-400 hover:bg-rose-900 hover:text-white rounded border border-rose-900/50 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Close Page"
              >
                <X size={16} /> Close / إغلاق
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-950/20">
              <div className="border-l-2 border-[#f59e0b] pl-4 ml-2 space-y-6">
                {WORKS.map((work) => (
                  <div key={work.id} className="relative group">
                    {/* Glowing golden dot */}
                    <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#f59e0b] border-2 border-slate-950 group-hover:scale-125 transition" />
                    
                    <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <div>
                          <h3 className="font-semibold text-slate-200 group-hover:text-[#f59e0b] transition">{work.title}</h3>
                          <span className="text-xs text-slate-400 font-mono">{work.company}</span>
                        </div>
                        <span className="text-[9px] font-pixel text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded whitespace-nowrap self-start">
                          {work.period}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 font-light leading-relaxed">
                        {work.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Close */}
            <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 font-pixel text-[10px] bg-[#f59e0b] text-slate-950 font-bold hover:scale-105 transition rounded cursor-pointer"
              >
                Return to World / عودة للعالم
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 3: About Me Page (Emerald Block) --- */}
      {activeModal === "chest" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl glass-panel border-[#10b981]/40 rounded-xl shadow-2xl flex flex-col h-[75vh] animate-fadeIn">
            
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">🟢</span>
                <div>
                  <h2 className="font-pixel text-[11px] md:text-xs text-[#10b981]">ABOUT STEVE / عني</h2>
                  <p className="text-[10px] text-slate-400">Steve's biography and logs</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 bg-rose-950/40 text-rose-400 hover:bg-rose-900 hover:text-white rounded border border-rose-900/50 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Close Page"
              >
                <X size={16} /> Close / إغلاق
              </button>
            </div>

            {/* Bio Content */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-950/20 text-slate-300 text-xs md:text-sm font-light leading-relaxed">
              <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5 space-y-3">
                <h3 className="font-semibold text-white text-sm">👤 Biography / السيرة الذاتية</h3>
                <p>
                  Steve is a skilled builder and web architect, using components like JavaScript, CSS, React, and Three.js to build premium, immersive experiences in standard browsers.
                </p>
                <p className="text-slate-400">
                  ستيف هو مطور ومصمم واجهات ويب محترف، يدمج بين قوة البرمجة ثلاثية الأبعاد والتصميم العصري لإنشاء منصات تفاعلية مذهلة تترك انطباعاً رائعاً لدى المستخدمين.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5 space-y-2">
                  <h4 className="font-semibold text-white">🧭 Current Coordinates / الإحداثيات</h4>
                  <div className="text-slate-400 font-mono text-xs space-y-1">
                    <div>Biome: Floating Cherry Grove</div>
                    <div>Location: Egypt (Cairo GMT+3)</div>
                    <div>Level: 99 Builder</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5 space-y-2">
                  <h4 className="font-semibold text-white">🗺️ Future Quests / الأهداف المستقبلية</h4>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    <li>Develop hardware-accelerated shaders</li>
                    <li>Construct WebXR virtual worlds</li>
                    <li>Master Rust WebAssembly backend tools</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Close */}
            <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 font-pixel text-[10px] bg-[#10b981] text-slate-950 font-bold hover:scale-105 transition rounded cursor-pointer"
              >
                Return to World / عودة للعالم
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
