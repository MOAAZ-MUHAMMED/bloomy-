import React, { useState, useEffect, useCallback } from "react";
import Terminal from "@/components/Terminal";
import DesktopGUI from "@/components/DesktopGUI";
import MatrixRain from "@/components/effects/MatrixRain";
import SnakeGame from "@/components/games/SnakeGame";
import { audioSystem } from "@/utils/audio";
import { Monitor } from "lucide-react";

type Mode = "boot" | "terminal" | "gui" | "matrix" | "snake";

const BOOT_MESSAGES = [
  "AETHER BIOS Version 4.10.42",
  "Copyright (C) 1989-2026, Aether Systems Corp.",
  "--------------------------------------------------",
  "CPU: Google Gemini Quantum @ 4.80GHz",
  "TESTING MEMORY: 2048MB OK",
  "DETECTING PRIMARY IDE HARD DISK ... FOUND (AetherOS VFS)",
  "BOOT SECTOR: READ SUCCESSFUL",
  "LOADING AETHER-KERNEL MODULES ................... OK",
  "INITIALIZING VIRTUAL FILESYSTEM ................. OK",
  "CONNECTING WEB AUDIO FREQUENCY CHANNELS ......... OK",
  "ESTABLISHING HOST ENVIRONMENT LINK .............. OK",
  "SYSTEM INTEGRITY STATUS: 100% HEALTHY",
  "READY TO BOOT SHELL COMPILATION..."
];

export default function App() {
  const [activeMode, setActiveMode] = useState<Mode>("boot");
  const [theme, setTheme] = useState<string>("green");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootIndex, setBootIndex] = useState(0);

  // Sync theme with document element attribute for CSS styling
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // BIOS Boot sequence animation
  useEffect(() => {
    if (activeMode !== "boot") return;

    if (bootIndex < BOOT_MESSAGES.length) {
      const delay = bootIndex === 0 ? 300 : Math.floor(Math.random() * 200) + 80;
      const timer = setTimeout(() => {
        setBootLines((prev) => [...prev, BOOT_MESSAGES[bootIndex]]);
        setBootIndex((prev) => prev + 1);
        audioSystem.playKeyPress(); // Subtle mechanical tick sound for boots
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Boot complete, transition to terminal CLI mode
      const timer = setTimeout(() => {
        audioSystem.playBoot();
        audioSystem.startHum();
        setActiveMode("terminal");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [bootIndex, activeMode]);

  // Keypress listener to skip BIOS boot sequence on Space / Enter
  useEffect(() => {
    if (activeMode !== "boot") return;

    const handleSkip = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        audioSystem.playBoot();
        audioSystem.startHum();
        setActiveMode("terminal");
      }
    };

    window.addEventListener("keydown", handleSkip);
    return () => window.removeEventListener("keydown", handleSkip);
  }, [activeMode]);

  const handleReturnToTerminal = useCallback(() => {
    audioSystem.playSuccess();
    setActiveMode("terminal");
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-terminal-bg text-terminal-text select-none">
      
      {/* 1. BIOS Boot Screen */}
      {activeMode === "boot" && (
        <div className="crt-container relative w-full h-full bg-[#030303] text-zinc-300 font-mono p-6 md:p-12 flex flex-col justify-between leading-relaxed">
          <div className="scanline animate-scanline"></div>
          
          <div className="space-y-1.5 text-xs md:text-sm">
            {bootLines.map((line, idx) => (
              <p key={idx} className="whitespace-pre-wrap">
                {line}
              </p>
            ))}
            {bootIndex < BOOT_MESSAGES.length && (
              <span className="inline-block w-2 h-4 bg-zinc-300 cursor-blink ml-1"></span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 border-t border-zinc-800 pt-4 text-zinc-500 text-[10px] uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Monitor size={12} className="animate-pulse" />
              <span>Press ENTER or SPACEBAR to skip boot sequence</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Core Terminal CLI Shell */}
      {activeMode === "terminal" && (
        <Terminal
          theme={theme}
          setTheme={setTheme}
          setActiveMode={setActiveMode}
        />
      )}

      {/* 3. Glassmorphic Desktop GUI Workspace */}
      {activeMode === "gui" && (
        <DesktopGUI
          theme={theme}
          setTheme={setTheme}
          setActiveMode={setActiveMode}
        />
      )}

      {/* 4. Canvas-based Matrix digital rain screen saver */}
      {activeMode === "matrix" && (
        <MatrixRain
          theme={theme}
          onExit={handleReturnToTerminal}
        />
      )}

      {/* 5. Fullscreen dedicated Retro Snake Game */}
      {activeMode === "snake" && (
        <div className="crt-container relative w-full h-full bg-[#020202] flex items-center justify-center p-4">
          <div className="scanline animate-scanline"></div>
          <SnakeGame onClose={handleReturnToTerminal} />
        </div>
      )}
    </div>
  );
}
