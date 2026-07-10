import React, { useState } from "react";
import { BackgroundCanvas } from "./components/BackgroundCanvas";
import { ThreeDOrb } from "./components/ThreeDOrb";
import { MiniInteractiveCanvas } from "./components/MiniInteractiveCanvas";
import {
  Palette,
  Eye,
  Cpu,
  Shield,
  Activity,
  ArrowUpRight,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Realm {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  accentClass: string;
  glowClass: string;
  textGlow: string;
}

export default function App() {
  const [activeRealmIndex, setActiveRealmIndex] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const realms: Realm[] = [
    {
      id: "art",
      name: "Digital Art",
      icon: Palette,
      description: "Generative aesthetics pushing boundaries.",
      accentClass: "border-neon-blue text-neon-blue",
      glowClass: "glow-border-cyan",
      textGlow: "glow-text-cyan text-neon-blue",
    },
    {
      id: "vrar",
      name: "VR/AR",
      icon: Eye,
      description: "Immersive spatial projection experiences.",
      accentClass: "border-emerald-500 text-emerald-400",
      glowClass: "box-shadow: 0 0 15px rgba(16, 185, 129, 0.25); border-color: rgba(16, 185, 129, 0.4)",
      textGlow: "text-emerald-400 shadow-emerald-400/50 [text-shadow:0_0_10px_rgba(16,185,129,0.5)]",
    },
    {
      id: "web3",
      name: "web3",
      icon: Cpu,
      description: "Decentralized consensus & tokenized creative logic.",
      accentClass: "border-neon-pink text-neon-pink",
      glowClass: "box-shadow: 0 0 15px rgba(255, 0, 127, 0.25); border-color: rgba(255, 0, 127, 0.4)",
      textGlow: "text-neon-pink shadow-neon-pink/50 [text-shadow:0_0_10px_rgba(255,0,127,0.5)]",
    },
    {
      id: "ethics",
      name: "AI Ethics",
      icon: Shield,
      description: "Synthesized agency alignment constraints.",
      accentClass: "border-teal-500 text-teal-300",
      glowClass: "box-shadow: 0 0 15px rgba(20, 184, 166, 0.25); border-color: rgba(20, 184, 166, 0.4)",
      textGlow: "text-teal-300 shadow-teal-300/50 [text-shadow:0_0_10px_rgba(20,184,166,0.5)]",
    },
    {
      id: "sonic",
      name: "Sonic Design",
      icon: Activity,
      description: "Atmospheric acoustic waveforms & synthesis.",
      accentClass: "border-orange-500 text-orange-400",
      glowClass: "box-shadow: 0 0 15px rgba(249, 115, 22, 0.25); border-color: rgba(249, 115, 22, 0.4)",
      textGlow: "text-orange-400 shadow-orange-400/50 [text-shadow:0_0_10px_rgba(249,115,22,0.5)]",
    },
  ];

  const activeRealm = realms[activeRealmIndex];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden space-gradient text-slate-100 z-10 font-sans pb-8">
      {/* Background celestial stars */}
      <BackgroundCanvas />

      {/* Decorative radial blobs */}
      <div className="absolute inset-0 nebula-purple z-0" />
      <div className="absolute inset-0 nebula-blue z-0" />

      {/* Top Header Navbar */}
      <header className="relative w-full max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between z-50">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center p-[2px] transition-transform duration-500 group-hover:rotate-180">
            <div className="w-full h-full bg-[#03030c] rounded-md flex items-center justify-center font-mono font-bold text-xs text-white">
              AE
            </div>
          </div>
          <span className="font-mono text-base md:text-lg font-black tracking-[0.2em] text-white uppercase group-hover:text-neon-blue transition-colors">
            AETHERIUS DIGITAL
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-8 font-mono text-[11px] tracking-[0.2em] text-slate-300">
          <a href="#" className="hover:text-white transition-colors py-2">HOME</a>
          <a href="#" className="hover:text-white transition-colors py-2">SERVICES</a>
          <a
            href="#"
            className="text-white px-4 py-1.5 rounded-full border border-neon-blue/60 shadow-[0_0_12px_rgba(0,210,255,0.2)] bg-neon-blue/5 hover:bg-neon-blue/20 transition-all duration-300"
          >
            PORTFOLIO
          </a>
          <a href="#" className="hover:text-white transition-colors py-2">JOURNAL</a>
          <a href="#" className="hover:text-white transition-colors py-2">ABOUT</a>
          <a href="#" className="hover:text-white transition-colors py-2">CONTACT</a>
        </nav>

        {/* Get Started Button */}
        <div className="hidden lg:block">
          <button className="px-6 py-2.5 rounded-full font-mono text-[11px] tracking-[0.15em] text-white glass-panel hover:glow-border-cyan hover:bg-neon-blue/10 transition-all duration-300 cursor-pointer">
            GET STARTED
          </button>
        </div>

        {/* Mobile Hamburger menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-300 hover:text-white p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 bg-[#060613]/95 backdrop-blur-md border-b border-white/10 p-6 flex flex-col space-y-4 z-40 lg:hidden"
          >
            <a href="#" className="text-slate-300 hover:text-white text-sm font-mono tracking-widest py-2">HOME</a>
            <a href="#" className="text-slate-300 hover:text-white text-sm font-mono tracking-widest py-2">SERVICES</a>
            <a href="#" className="text-neon-blue text-sm font-mono tracking-widest py-2 font-bold">PORTFOLIO</a>
            <a href="#" className="text-slate-300 hover:text-white text-sm font-mono tracking-widest py-2">JOURNAL</a>
            <a href="#" className="text-slate-300 hover:text-white text-sm font-mono tracking-widest py-2">ABOUT</a>
            <a href="#" className="text-slate-300 hover:text-white text-sm font-mono tracking-widest py-2">CONTACT</a>
            <button className="w-full mt-2 py-3 rounded-full text-center font-mono text-xs tracking-widest text-white border border-white/20 bg-white/5">
              GET STARTED
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center items-center z-20">
        
        {/* Layout Grid wrapping Sidebars and Central 3D Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-items-center lg:my-4">
          
          {/* LEFT SIDEBAR: Explore Our Realms Swapper */}
          <div className="lg:col-span-3 w-full max-w-sm flex flex-row lg:flex-row items-center justify-between lg:justify-start lg:space-x-4 self-center space-y-0">
            {/* Vertical rotated text */}
            <div className="hidden lg:block text-slate-500 font-mono text-[10px] tracking-[0.6em] uppercase writing-mode-vertical rotate-180 opacity-60">
              EXPLORE OUR REALMS
            </div>

            {/* Glassmorphic buttons container */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 p-3 rounded-2xl glass-panel w-full">
              {realms.map((realm, index) => {
                const IconComponent = realm.icon;
                const isActive = index === activeRealmIndex;
                return (
                  <button
                    key={realm.id}
                    onClick={() => setActiveRealmIndex(index)}
                    className={`flex items-center space-x-3 w-fit lg:w-full px-3 py-2.5 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-white/[0.06] text-white border border-white/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg border transition-all duration-300 ${
                        isActive ? realm.accentClass : "border-slate-800 text-slate-500"
                      }`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <div className="hidden sm:block lg:block">
                      <div className="text-xs font-mono font-medium tracking-wider">{realm.name}</div>
                      <div className="text-[9px] text-slate-500 truncate max-w-[130px] font-sans">
                        {realm.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CENTER: 3D Orb Component */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center my-6 lg:my-0">
            <ThreeDOrb activeRealm={activeRealm.name} />
          </div>

          {/* RIGHT SIDEBAR: Slogan card */}
          <div className="lg:col-span-3 w-full max-w-sm lg:self-center">
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-neon-blue relative overflow-hidden group">
              {/* background light glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-neon-blue/10 blur-xl group-hover:bg-neon-blue/20 transition-all duration-500" />
              
              <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3">
                Mission Statement
              </div>
              
              <h3 className="font-title font-black text-sm md:text-base leading-relaxed tracking-wider text-slate-200 uppercase">
                Building the <span className="text-neon-blue glow-text-cyan">Unbuildable</span>.
                <br />
                Creating the <span className="text-neon-purple glow-text-purple">Unimaginable</span>.
              </h3>
              
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-sans">
                Aetherius Digital channels quantum synthesis & neural layers to create premium experiences tailored for next-generation spatial computing interfaces.
              </p>
            </div>
          </div>

        </div>

        {/* Center Title Headings (placed beneath the 3D canvas grid to match layout) */}
        <div className="w-full text-center max-w-4xl mt-6 mb-12">
          <h1 className="text-xl md:text-3xl font-title font-black leading-tight tracking-[0.08em] text-white uppercase select-none">
            AETHERIUS DIGITAL: REDEFINING THE{" "}
            <span className={`transition-all duration-500 ${activeRealm.textGlow}`}>
              FUTURE
            </span>{" "}
            OF CREATIVE TECHNOLOGY
          </h1>
          
          <p className="text-[9px] md:text-xs font-mono tracking-[0.35em] text-slate-400 uppercase mt-4 select-none">
            Where Imagination Meets Innovation. Your Vision, Amplified.
          </p>
        </div>

        {/* BOTTOM SHOWCASE CARDS */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          
          {/* Card 1: Immersive Ecosystems */}
          <div
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group glass-panel hover:glow-border-cyan rounded-2xl p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-neon-blue tracking-widest uppercase">
                  Module 01 / Spatial
                </span>
                <h4 className="font-title font-bold text-sm md:text-base tracking-wider uppercase text-white mt-1">
                  Immersive Ecosystems
                </h4>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-neon-blue group-hover:border-neon-blue/40 transition-all duration-300">
                <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
              </div>
            </div>
            
            <MiniInteractiveCanvas type="ecosystem" isHovered={hoveredCard === 0} />
            
            <p className="text-[10px] text-slate-400 leading-relaxed mt-4">
              Holographic layouts and generative space layers designed for direct spatial interfaces and Apple Vision Pro ecosystem.
            </p>
          </div>

          {/* Card 2: Neural Design */}
          <div
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group glass-panel hover:glow-border-purple rounded-2xl p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-neon-purple tracking-widest uppercase">
                  Module 02 / Cognitive
                </span>
                <h4 className="font-title font-bold text-sm md:text-base tracking-wider uppercase text-white mt-1">
                  Neural Design
                </h4>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-neon-purple group-hover:border-neon-purple/40 transition-all duration-300">
                <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
              </div>
            </div>
            
            <MiniInteractiveCanvas type="neural" isHovered={hoveredCard === 1} />
            
            <p className="text-[10px] text-slate-400 leading-relaxed mt-4">
              Leveraging neural models to programmatically generate branding styles, UI layout solutions, and cognitive feedback mechanisms.
            </p>
          </div>

          {/* Card 3: Quantum Applications */}
          <div
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group glass-panel hover:[box-shadow:0_0_15px_rgba(255,0,127,0.15)] hover:border-neon-pink/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-neon-pink tracking-widest uppercase">
                  Module 03 / Computing
                </span>
                <h4 className="font-title font-bold text-sm md:text-base tracking-wider uppercase text-white mt-1">
                  Quantum Applications
                </h4>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-neon-pink group-hover:border-neon-pink/40 transition-all duration-300">
                <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
              </div>
            </div>
            
            <MiniInteractiveCanvas type="quantum" isHovered={hoveredCard === 2} />
            
            <p className="text-[10px] text-slate-400 leading-relaxed mt-4">
              Building next-gen decentralized logic frameworks, leveraging quantum entropy systems, and fast encryption architectures.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 mt-12 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-600 border-t border-white/[0.03] pt-6 z-20">
        <div>
          &copy; 2026 AETHERIUS DIGITAL. ALL RIGHTS RESERVED.
        </div>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-slate-400 transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-slate-400 transition-colors">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-slate-400 transition-colors">SYSTEM STATUS</a>
        </div>
      </footer>
    </div>
  );
}
