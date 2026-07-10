import { useState, useCallback } from "react";
import { audioSystem } from "@/utils/audio";

export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "success" | "system" | "accent";
  content: string;
  isHtml?: boolean;
}

// Virtual File System (VFS)
export interface VFSEntry {
  name: string;
  type: "file" | "directory";
  content?: string; // for files
  children?: { [key: string]: VFSEntry }; // for directories
}

const vfs: VFSEntry = {
  name: "/",
  type: "directory",
  children: {
    "welcome.txt": {
      name: "welcome.txt",
      type: "file",
      content: `================================================================
*                     AETHER-OS v1.42.0                        *
*         WORLD-CLASS RETRO FUTURISTIC INTERACTIVE CLI         *
================================================================
Type 'help' to view the list of available commands.
Type 'gui' or click the switch to morph into desktop mode.
Try playing 'snake' or running 'matrix' to witness the magic!
`
    },
    "about.txt": {
      name: "about.txt",
      type: "file",
      content: `AETHER-OS is a state-of-the-art virtual terminal experience.
Created by a visionary developer to demonstrate that retro-futurism
and high-end aesthetics can merge into a world-class UI.

Developer Info:
- Role: Full Stack Cyber-Engineer
- Specialization: Interactive UI/UX, WebAudio, Game Design
- Status: Ready to hack your next big project.
`
    },
    "skills.txt": {
      name: "skills.txt",
      type: "file",
      content: `[CORE CAPABILITIES]
----------------------------------------------------------------
- Languages:  TypeScript / JavaScript / Python / Go / Rust
- Front-End:  React 19 / Vite / Tailwind v4 / Framer Motion
- Back-End:   Node.js / Express / Bun / PostgreSQL / Drizzle
- Creative:   Web Audio API / Canvas / Shader Programming
- Devops:     Docker / AWS / CI-CD / Serverless
`
    },
    "projects": {
      name: "projects",
      type: "directory",
      children: {
        "bloomly_kids.txt": {
          name: "bloomly_kids.txt",
          type: "file",
          content: `Project: Bloomly Kids Landing Page
Description: An interactive, premium educational portal for children
featuring vibrant gamified learning setups.
Status: Completed
Tech Stack: React, Framer Motion, Tailwind CSS
URL: /bloomly-kids
`
        },
        "huda_nour_site.txt": {
          name: "huda_nour_site.txt",
          type: "file",
          content: `Project: Huda Nour Islamic Educational Center
Description: A full-scale website showcasing Islamic curriculums,
math, science, literacy, camps, and celebrations.
Status: Active Production
Tech Stack: React, Express, TS, PostgreSQL
`
        },
        "neural_visualizer.txt": {
          name: "neural_visualizer.txt",
          type: "file",
          content: `Project: Neural Network visualizer
Description: High-performance 3D canvas simulation displaying real-time
node synapse calculations and data weight transfers.
Status: R&D Prototype
`
        }
      }
    },
    "contact.txt": {
      name: "contact.txt",
      type: "file",
      content: `[CONNECT WITH ME]
----------------------------------------------------------------
Email:    cyber-engineer@aether-os.io
GitHub:   github.com/cyber-engineer-retro
LinkedIn: linkedin.com/in/retro-futurist-dev
Discord:  AetherDev#9999
`
    },
    "secret_vault": {
      name: "secret_vault",
      type: "directory",
      children: {
        "access_codes.txt": {
          name: "access_codes.txt",
          type: "file",
          content: `RESTRICTED CONTENT - SUDO AUTHORIZATION REQUIRED
[CODENAMES]
- Project Alpha: "Antigravity" (DeepMind agent system)
- Project Beta: "Quantum-Leap"
- Project Gamma: "Void-Walker"
`
        }
      }
    }
  }
};

const JOKES = [
  "Why do programmers wear glasses? Because they can't C#.",
  "There are 10 kinds of people in this world: Those who understand binary, and those who don't.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "['hip', 'hip'] (hip hip array!)",
  "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
  "Programming is like writing a book... except if you miss a single comma on page 126, the whole book makes no sense.",
  "What is a programmer's favorite hangout place? Foo Bar."
];

const WEATHER_REPORTS = [
  `
  .---.      AETHER-OS WEATHER TERMINAL
 (     )     --------------------------
(   '   )    City: Neo-Tokyo / Cyber-Grid
 '---'       Condition: Cyber-Rain & Neon Fog
 / / /       Temp: 19°C (66°F)
/ / /        Wind: 14 km/h West
  `,
  `
   \\  /      AETHER-OS WEATHER TERMINAL
  -- * --    --------------------------
   /  \\      City: Cairo / Solar-Core
  .---.      Condition: Radiative Heatwave
 (     )     Temp: 38°C (100°F)
 '---'       Humidity: 12%
  `,
  `
  .-.        AETHER-OS WEATHER TERMINAL
 (   ).      --------------------------
(___(__)     City: Cyber-Space / Cloud-9
             Condition: High Data Flow
             Temp: 0° Kelvin (Absolute Cool)
             Packet Loss: 0.00%
  `
];

export function useTerminal(
  setTheme: (t: string) => void,
  setActiveMode: (m: "terminal" | "gui" | "matrix" | "snake") => void
) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentPath, setCurrentPath] = useState<string[]>([]); // Array of dir names from root
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "init-welcome",
      type: "system",
      content: `AETHER-OS Virtual Machine [Version 1.42.0]
(c) 2026 Aether Corporation. All rights reserved.
`
    },
    {
      id: "init-guide",
      type: "accent",
      content: `Type 'welcome.txt' or 'cat welcome.txt' to view the welcome banner.
Type 'help' to list commands.`
    }
  ]);

  // Helper to get VFS node at current path
  const getDirectoryAt = useCallback((path: string[]): VFSEntry | null => {
    let current: VFSEntry = vfs;
    for (const segment of path) {
      if (current.children && current.children[segment]) {
        current = current.children[segment];
      } else {
        return null;
      }
    }
    return current;
  }, []);

  const addLine = useCallback((content: string, type: TerminalLine["type"] = "output", isHtml = false) => {
    setLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        type,
        content,
        isHtml
      }
    ]);
  }, []);

  const executeCommand = useCallback((cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Save to history
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((c) => c !== trimmed)];
      return next.slice(0, 50); // cap history at 50
    });
    setHistoryIndex(-1);

    // Print command input
    const pathString = currentPath.length === 0 ? "~" : `~/${currentPath.join("/")}`;
    addLine(`guest@aether-os:${pathString}$ ${trimmed}`, "input");

    // Parse command arguments
    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check if the user typed a filename directly as a shortcut (e.g. welcome.txt)
    const currentDir = getDirectoryAt(currentPath);
    if (currentDir && currentDir.children && currentDir.children[trimmed]) {
      const fileNode = currentDir.children[trimmed];
      if (fileNode.type === "file") {
        audioSystem.playSuccess();
        addLine(fileNode.content || "", "output");
        return;
      }
    }

    switch (command) {
      case "help":
        audioSystem.playSuccess();
        addLine(`
Available Commands:
----------------------------------------------------------------
SYSTEM & MODES:
  help             Display this reference list
  gui              Morph system into Glassmorphism Desktop Mode
  matrix           Boot Matrix digital rain screen saver
  snake            Launch retro Snake game inside terminal
  clear            Clear terminal screen buffer
  theme [name]     Change color scheme (green, amber, cyberpunk, cobalt, classic)
  audio            Toggle system synth sound effects
  date             Show current host system date and time
  neofetch         Display system hardware and configuration info
  whoami           Show current active user credentials

FILESYSTEM COMMANDS:
  ls               List files and directories in current path
  cd [dir]         Navigate to directory (e.g. 'cd projects', 'cd ..')
  cat [file]       Print contents of a text file (e.g. 'cat welcome.txt')
  pwd              Print active working directory

FUN & UTILITIES:
  joke             Tell a random tech joke
  weather          Fetch retro weather report from cyber-satellites
  echo [text]      Display custom message text
  sudo [command]   Request administrative override permission
  `, "output");
        break;

      case "clear":
        setLines([]);
        break;

      case "gui":
        audioSystem.playSuccess();
        addLine("Morphed to GUI mode. Initializing window manager...", "success");
        setTimeout(() => {
          setActiveMode("gui");
        }, 300);
        break;

      case "matrix":
        audioSystem.playSuccess();
        addLine("Initializing digital stream projection...", "success");
        setTimeout(() => {
          setActiveMode("matrix");
        }, 500);
        break;

      case "snake":
        audioSystem.playSuccess();
        addLine("Loading Grid-Snake compilation...", "success");
        setTimeout(() => {
          setActiveMode("snake");
        }, 500);
        break;

      case "date":
        addLine(new Date().toString(), "output");
        break;

      case "whoami":
        addLine("user: guest@aether-os\nrole: cyber-explorer\npermissions: read-only (type 'sudo' for admin access)", "output");
        break;

      case "echo":
        addLine(args.join(" "), "output");
        break;

      case "audio":
        const muted = audioSystem.toggleMute();
        addLine(muted ? "System audio: MUTED" : "System audio: PLAYING (clicks, chimes active)", "success");
        if (!muted) {
          audioSystem.playSuccess();
        }
        break;

      case "theme":
        if (args.length === 0) {
          addLine("Usage: theme [green | amber | cyberpunk | cobalt | classic]", "error");
        } else {
          const themeName = args[0].toLowerCase();
          if (["green", "amber", "cyberpunk", "cobalt", "classic"].includes(themeName)) {
            setTheme(themeName);
            audioSystem.playSuccess();
            addLine(`System theme successfully updated to: ${themeName.toUpperCase()}`, "success");
          } else {
            audioSystem.playError();
            addLine(`Unknown theme: '${themeName}'. Try: green, amber, cyberpunk, cobalt, classic`, "error");
          }
        }
        break;

      case "joke":
        audioSystem.playSuccess();
        const randJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
        addLine(randJoke, "accent");
        break;

      case "weather":
        audioSystem.playSuccess();
        const randWeather = WEATHER_REPORTS[Math.floor(Math.random() * WEATHER_REPORTS.length)];
        addLine(randWeather, "output");
        break;

      case "sudo":
        audioSystem.playError();
        if (args.length === 0) {
          addLine("sudo: administrative privileges required. Specify action.", "error");
        } else {
          const action = args.join(" ");
          if (action.toLowerCase() === "make sandwich") {
            addLine("What? Make it yourself.", "error");
          } else {
            addLine(`Access Denied: User guest is not in the sudoers file. This incident has been logged and sent to Santa Claus.`, "error");
          }
        }
        break;

      case "neofetch":
        audioSystem.playSuccess();
        const memoryUsed = Math.floor(Math.random() * 200) + 400; // 400-600MB
        addLine(`
\x1b[32m       .---.       \x1b[0m   \x1b[1;32mguest@aether-os\x1b[0m
\x1b[32m      /     \\      \x1b[0m   ---------------
\x1b[32m      \\     /      \x1b[0m   OS: Aether-OS v1.42.0 x86_64
\x1b[32m   .---'---'---.   \x1b[0m   Host: Virtual Machine (Web Audio & Canvas)
\x1b[32m  /             \\  \x1b[0m   Kernel: 5.26.1-AETHER-RELEASE
\x1b[32m  \\             /  \x1b[0m   Uptime: ${Math.floor(performance.now() / 1000)}s
\x1b[32m   '---.---.---'   \x1b[0m   Shell: bash 5.1.16
\x1b[32m      /     \\      \x1b[0m   Resolution: ${window.innerWidth}x${window.innerHeight}
\x1b[32m      '---'        \x1b[0m   DE: Retro-Futurism CLI v4
                      CPU: Google Gemini Quantum v3 (16) @ 4.80GHz
                      GPU: WebGL Canvas Overlay Node
                      Memory: ${memoryUsed}MB / 2048MB (30%)
                      Palette: [■] [■] [■] [■] [■]
`, "output");
        break;

      case "ls":
        audioSystem.playSuccess();
        const activeDir = getDirectoryAt(currentPath);
        if (activeDir && activeDir.children) {
          const contents = Object.values(activeDir.children)
            .map((entry) => {
              if (entry.type === "directory") {
                return `\x1b[34m${entry.name}/\x1b[0m`; // blue directory
              }
              return entry.name;
            })
            .join("   ");
          addLine(contents || "Directory is empty.", "output");
        } else {
          addLine("Error: Unable to read directory.", "error");
        }
        break;

      case "pwd":
        addLine(`/${currentPath.join("/")}`, "output");
        break;

      case "cd":
        const target = args[0];
        if (!target || target === "~" || target === "/") {
          setCurrentPath([]);
          audioSystem.playSuccess();
        } else if (target === "..") {
          if (currentPath.length > 0) {
            setCurrentPath((prev) => prev.slice(0, prev.length - 1));
            audioSystem.playSuccess();
          } else {
            audioSystem.playError();
            addLine("Already at root directory.", "error");
          }
        } else {
          // Navigate to subdirectory
          const activeFolder = getDirectoryAt(currentPath);
          if (activeFolder && activeFolder.children && activeFolder.children[target]) {
            const node = activeFolder.children[target];
            if (node.type === "directory") {
              setCurrentPath((prev) => [...prev, target]);
              audioSystem.playSuccess();
            } else {
              audioSystem.playError();
              addLine(`cd: not a directory: ${target}`, "error");
            }
          } else {
            audioSystem.playError();
            addLine(`cd: no such file or directory: ${target}`, "error");
          }
        }
        break;

      case "cat":
        const fileTarget = args[0];
        if (!fileTarget) {
          audioSystem.playError();
          addLine("Usage: cat [filename]", "error");
        } else {
          const activeDirNode = getDirectoryAt(currentPath);
          if (activeDirNode && activeDirNode.children && activeDirNode.children[fileTarget]) {
            const node = activeDirNode.children[fileTarget];
            if (node.type === "file") {
              audioSystem.playSuccess();
              addLine(node.content || "", "output");
            } else {
              audioSystem.playError();
              addLine(`cat: ${fileTarget}: Is a directory`, "error");
            }
          } else {
            audioSystem.playError();
            addLine(`cat: ${fileTarget}: No such file or directory`, "error");
          }
        }
        break;

      default:
        audioSystem.playError();
        addLine(`command not found: ${command}. Type 'help' to see list of valid commands.`, "error");
    }
  }, [currentPath, addLine, getDirectoryAt, setTheme, setActiveMode]);

  // Tab completion helper
  const handleTabComplete = useCallback((inputVal: string): string => {
    if (!inputVal) return "";
    
    const parts = inputVal.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    
    // Commands completion if we only typed 1 word
    const allCommands = [
      "help", "clear", "gui", "matrix", "snake", "date", "whoami", 
      "echo", "audio", "theme", "joke", "weather", "sudo", "neofetch",
      "ls", "pwd", "cd", "cat"
    ];

    const activeFolder = getDirectoryAt(currentPath);
    const folderContents = activeFolder && activeFolder.children ? Object.keys(activeFolder.children) : [];

    if (parts.length === 1) {
      // Complete command
      const matches = allCommands.filter((c) => c.startsWith(cmd));
      const fileMatches = folderContents.filter((f) => f.startsWith(cmd));
      
      const allMatches = [...matches, ...fileMatches];
      
      if (allMatches.length === 1) {
        audioSystem.playSuccess();
        return allMatches[0];
      } else if (allMatches.length > 1) {
        // List possible matches
        audioSystem.playSuccess();
        addLine(`guest@aether-os:~$ tab completions:`, "accent");
        addLine(allMatches.join("    "), "output");
      }
    } else if (parts.length === 2 && (cmd === "cat" || cmd === "cd" || cmd === "./")) {
      // Complete filename or directory
      const arg = parts[1];
      const matches = folderContents.filter((f) => f.startsWith(arg));
      
      if (matches.length === 1) {
        audioSystem.playSuccess();
        return `${cmd} ${matches[0]}`;
      } else if (matches.length > 1) {
        audioSystem.playSuccess();
        addLine(`guest@aether-os:~$ matches for '${arg}':`, "accent");
        addLine(matches.join("    "), "output");
      }
    } else if (parts.length === 2 && cmd === "theme") {
      const arg = parts[1].toLowerCase();
      const themes = ["green", "amber", "cyberpunk", "cobalt", "classic"];
      const matches = themes.filter((t) => t.startsWith(arg));
      if (matches.length === 1) {
        audioSystem.playSuccess();
        return `theme ${matches[0]}`;
      } else if (matches.length > 1) {
        audioSystem.playSuccess();
        addLine(matches.join("    "), "output");
      }
    }
    
    return inputVal;
  }, [currentPath, addLine, getDirectoryAt]);

  return {
    lines,
    currentPath,
    history,
    historyIndex,
    setHistoryIndex,
    executeCommand,
    handleTabComplete,
    clearTerminal: () => setLines([])
  };
}
