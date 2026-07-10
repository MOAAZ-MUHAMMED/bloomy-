import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { audioSystem } from "@/utils/audio";
import { Terminal as TermIcon, Volume2, VolumeX, Sun, Layout, HelpCircle } from "lucide-react";

interface TerminalProps {
  theme: string;
  setTheme: (t: string) => void;
  setActiveMode: (m: "terminal" | "gui" | "matrix" | "snake") => void;
  isEmbedded?: boolean;
}

// Simple ANSI color code formatter to render color terminal blocks in React
function renderAnsiText(text: string) {
  const parts = text.split(/(\x1b\[[0-9;]*m)/);
  let currentClass = "";
  
  return parts.map((part, index) => {
    if (part.startsWith("\x1b[")) {
      // Parse ANSI color code
      const code = part.slice(2, -1);
      if (code === "0") {
        currentClass = ""; // Reset
      } else if (code === "32" || code === "1;32") {
        currentClass = "text-emerald-500 font-bold glow-text"; // Green
      } else if (code === "34" || code === "1;34") {
        currentClass = "text-blue-500 font-bold"; // Blue
      } else if (code === "33") {
        currentClass = "text-amber-500 font-bold"; // Yellow/Amber
      } else if (code === "31") {
        currentClass = "text-red-500 font-bold"; // Red
      }
      return null;
    }
    
    return currentClass ? (
      <span key={index} className={currentClass}>{part}</span>
    ) : (
      <span key={index}>{part}</span>
    );
  });
}

export default function Terminal({ theme, setTheme, setActiveMode, isEmbedded = false }: TerminalProps) {
  const [inputVal, setInputVal] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(audioSystem.isMuted());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    lines,
    currentPath,
    history,
    historyIndex,
    setHistoryIndex,
    executeCommand,
    handleTabComplete
  } = useTerminal(setTheme, setActiveMode);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  // Focus input on click
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    audioSystem.playKeyPress();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = inputVal;
      setInputVal("");
      audioSystem.playKeyPress(true); // Deeper click sound for Enter
      executeCommand(command);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < history.length) {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
        audioSystem.playKeyPress();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
        audioSystem.playKeyPress();
      } else {
        setHistoryIndex(-1);
        setInputVal("");
        audioSystem.playKeyPress();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completed = handleTabComplete(inputVal);
      if (completed) {
        setInputVal(completed);
      }
    } else if (e.key === "Backspace") {
      audioSystem.playKeyPress();
    }
  };

  const handleToggleMute = () => {
    const nextMute = audioSystem.toggleMute();
    setIsAudioMuted(nextMute);
    if (!nextMute) {
      audioSystem.playSuccess();
    }
  };

  const pathString = currentPath.length === 0 ? "~" : `~/${currentPath.join("/")}`;

  return (
    <div
      onClick={focusInput}
      className={`crt-container relative flex flex-col font-mono bg-terminal-bg text-terminal-text overflow-hidden ${
        isEmbedded 
          ? "w-full h-full border border-terminal-text/30 rounded"
          : "w-screen h-screen p-4 md:p-6"
      }`}
      style={{ minHeight: isEmbedded ? "auto" : "100vh" }}
    >
      {/* Scanline CRT overlay */}
      <div className="scanline animate-scanline"></div>
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-terminal-text/25 pb-2 mb-4 text-xs select-none">
        <div className="flex items-center gap-2">
          <TermIcon size={14} className="animate-pulse" />
          <span className="font-bold tracking-wider">AETHER-OS SHELL v1.42 [Theme: {theme.toUpperCase()}]</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick Command Help */}
          <button 
            onClick={() => executeCommand("help")}
            className="flex items-center gap-1 hover:bg-terminal-text hover:text-terminal-bg px-2 py-0.5 rounded transition cursor-pointer"
            title="Show commands"
          >
            <HelpCircle size={12} /> <span className="hidden sm:inline">Help</span>
          </button>

          {/* Sound Toggle */}
          <button 
            onClick={handleToggleMute}
            className="flex items-center gap-1 hover:bg-terminal-text hover:text-terminal-bg px-2 py-0.5 rounded transition cursor-pointer"
            title={isAudioMuted ? "Unmute system sounds" : "Mute system sounds"}
          >
            {isAudioMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            <span className="hidden sm:inline">{isAudioMuted ? "Sound Off" : "Sound On"}</span>
          </button>

          {/* Switch Theme */}
          <button 
            onClick={() => {
              const themes = ["green", "amber", "cyberpunk", "cobalt", "classic"];
              const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
              executeCommand(`theme ${themes[nextIdx]}`);
            }}
            className="flex items-center gap-1 hover:bg-terminal-text hover:text-terminal-bg px-2 py-0.5 rounded transition cursor-pointer"
            title="Next Color Theme"
          >
            <Sun size={12} /> <span className="hidden sm:inline">Theme</span>
          </button>

          {/* Morph to GUI */}
          <button 
            onClick={() => executeCommand("gui")}
            className="flex items-center gap-1 hover:bg-terminal-text hover:text-terminal-bg px-2 py-0.5 rounded transition font-bold text-white cursor-pointer"
            title="Morph to GUI desktop mode"
          >
            <Layout size={12} /> <span>GUI Mode</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2 text-sm leading-relaxed"
      >
        {lines.map((line) => {
          let lineClass = "";
          if (line.type === "input") lineClass = "text-white font-semibold";
          else if (line.type === "error") lineClass = "text-red-500 font-medium";
          else if (line.type === "success") lineClass = "text-emerald-400 font-bold glow-text";
          else if (line.type === "accent") lineClass = "text-amber-400";
          else if (line.type === "system") lineClass = "text-terminal-text/75 font-light";

          return (
            <div key={line.id} className={`${lineClass} whitespace-pre-wrap font-mono break-all`}>
              {line.type === "input" ? (
                <span>{line.content}</span>
              ) : (
                renderAnsiText(line.content)
              )}
            </div>
          );
        })}

        {/* Input prompt area */}
        <div className="flex items-center gap-2 text-white font-semibold pt-1">
          <span className="text-terminal-text shrink-0">{`guest@aether-os:${pathString}$`}</span>
          <div className="relative flex-1 flex items-center">
            {/* The actual text typed, layered underneath */}
            <span className="font-mono text-white whitespace-pre break-all relative z-10">
              {inputVal}
            </span>
            {/* Blinking box cursor positioned dynamically */}
            <span className="inline-block w-2.5 h-4.5 bg-terminal-text cursor-blink ml-0.5 shrink-0 relative z-10"></span>
            
            {/* Fully transparent input overlaying the typing area to capture keyboards */}
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full h-full opacity-0 outline-none border-none cursor-default font-mono z-0"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Bottom Status bar */}
      {!isEmbedded && (
        <div className="flex justify-between items-center border-t border-terminal-text/25 pt-2 mt-4 text-[10px] text-terminal-text/60 select-none">
          <div className="flex gap-4">
            <span>SYS: ONLINE</span>
            <span>SPEED: 9600 BAUD</span>
            <span>ENCODING: UTF-8</span>
          </div>
          <div className="hidden md:block text-center font-bold">
            TYPE 'HELP' FOR SYSTEM UTILITIES
          </div>
          <div>
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}
