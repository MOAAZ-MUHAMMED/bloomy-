import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface SpaceGameProps {
  onQuit: () => void;
  onWin: (stars: number) => void;
}

interface GameObject {
  id: number;
  x: number;
  y: number;
  type: "player" | "laser" | "enemy" | "explosion";
  emoji?: string;
  width: number;
  height: number;
}

const ENEMIES = ["👾", "👽", "🛸", "☄️"];

export default function SpaceGame({ onQuit, onWin }: SpaceGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "won">("playing");
  
  const [playerX, setPlayerX] = useState(50); // percentage 0-100
  const [lasers, setLasers] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<GameObject[]>([]);
  const [explosions, setExplosions] = useState<{id: number, x: number, y: number}[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastShotTime = useRef<number>(Date.now());
  const lastEnemyTime = useRef<number>(Date.now());

  const playSound = useCallback((type: "shoot" | "explosion" | "hit") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === "shoot") {
        osc.type = "square";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "explosion") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {}
  }, []);

  const updatePhysics = useCallback(() => {
    if (gameState !== "playing") return;
    const now = Date.now();
    
    // Auto shoot
    if (now - lastShotTime.current > 400) {
      setLasers(prev => [...prev, {
        id: Date.now(),
        x: playerX,
        y: 80, // percentage from top
        type: "laser",
        width: 4,
        height: 20
      }]);
      playSound("shoot");
      lastShotTime.current = now;
    }

    // Spawn enemies
    if (now - lastEnemyTime.current > Math.max(800 - score * 2, 300)) {
      setEnemies(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 90 + 5,
        y: -10,
        type: "enemy",
        emoji: ENEMIES[Math.floor(Math.random() * ENEMIES.length)],
        width: 40,
        height: 40
      }]);
      lastEnemyTime.current = now;
    }

    // Move Lasers up
    setLasers(prev => prev.map(l => ({ ...l, y: l.y - 2 })).filter(l => l.y > -10));

    // Move Enemies down
    setEnemies(prev => {
      let missedCount = 0;
      const moved = prev.map(e => ({ ...e, y: e.y + 0.5 + (score / 500) }));
      const active = moved.filter(e => {
        if (e.y > 110) {
          missedCount++;
          return false;
        }
        return true;
      });
      
      if (missedCount > 0) {
        setLives(l => {
          const newL = l - missedCount;
          if (newL <= 0) setGameState("gameover");
          return Math.max(0, newL);
        });
      }
      return active;
    });

    // Collision detection
    setLasers(currentLasers => {
      let lasersToKeep = [...currentLasers];
      setEnemies(currentEnemies => {
        let enemiesToKeep = [...currentEnemies];
        
        for (let i = lasersToKeep.length - 1; i >= 0; i--) {
          const l = lasersToKeep[i];
          for (let j = enemiesToKeep.length - 1; j >= 0; j--) {
            const e = enemiesToKeep[j];
            // Simple percentage bounding box collision roughly
            if (Math.abs(l.x - e.x) < 5 && Math.abs(l.y - e.y) < 5) {
              // Hit!
              lasersToKeep.splice(i, 1);
              enemiesToKeep.splice(j, 1);
              setScore(s => s + 10);
              playSound("explosion");
              setExplosions(ex => [...ex, { id: Date.now() + Math.random(), x: e.x, y: e.y }]);
              break;
            }
          }
        }
        return enemiesToKeep;
      });
      return lasersToKeep;
    });

    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [gameState, playerX, score, playSound]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [updatePhysics]);

  useEffect(() => {
    if (score >= 300) {
      setGameState("won");
      onWin(3);
    }
  }, [score, onWin]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== "playing" || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, x)));
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0B0C10] z-[9999] overflow-hidden select-none touch-none"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
    >
      {/* Starfield Background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({length: 50}).map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-8 flex justify-between items-center z-50 pointer-events-none">
        <button 
          onClick={onQuit}
          className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-all"
        >
          <ArrowLeft className="w-6 h-6 rtl:rotate-180" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-cyan-400 font-bold text-sm">النقاط</span>
          <span className="text-white font-black text-3xl sm:text-4xl drop-shadow-[0_0_10px_#00E5FF]">{score}</span>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <span key={i} className={`text-2xl sm:text-3xl transition-all ${i <= lives ? 'text-red-500 drop-shadow-[0_0_5px_red]' : 'text-gray-800 grayscale'}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Player Spaceship */}
      <div 
        className="absolute bottom-[10%] text-5xl pointer-events-none filter drop-shadow-[0_0_15px_#00E5FF]"
        style={{ left: `${playerX}%`, transform: "translateX(-50%)" }}
      >
        🚀
      </div>

      {/* Lasers */}
      {lasers.map(l => (
        <div
          key={l.id}
          className="absolute bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] rounded-full pointer-events-none"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            width: `${l.width}px`,
            height: `${l.height}px`,
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}

      {/* Enemies */}
      {enemies.map(e => (
        <div
          key={e.id}
          className="absolute text-4xl pointer-events-none filter drop-shadow-[0_0_10px_#FF0055]"
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            transform: "translate(-50%, -50%)"
          }}
        >
          {e.emoji}
        </div>
      ))}

      {/* Explosions */}
      <AnimatePresence>
        {explosions.map(ex => (
          <motion.div
            key={ex.id}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute text-5xl pointer-events-none"
            style={{
              left: `${ex.x}%`,
              top: `${ex.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            onAnimationComplete={() => {
              setExplosions(prev => prev.filter(p => p.id !== ex.id));
            }}
          >
            💥
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Game Over / Win Screens */}
      <AnimatePresence>
        {gameState !== "playing" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 pointer-events-auto backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1F2833] rounded-3xl p-8 max-w-sm w-full text-center border-4 border-[#00E5FF] shadow-[0_0_30px_#00E5FF]"
            >
              <div className="text-6xl mb-4">
                {gameState === "won" ? "🌍" : "☠️"}
              </div>
              <h2 className="text-3xl font-black text-white mb-2">
                {gameState === "won" ? "أنت بطل الفضاء!" : "غزونا الفضائيين!"}
              </h2>
              <p className="text-[#00E5FF] font-bold text-lg mb-6">
                النقاط: {score}
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setScore(0);
                    setLives(3);
                    setEnemies([]);
                    setLasers([]);
                    setGameState("playing");
                  }}
                  className="flex-1 bg-[#00E5FF] text-black font-black py-3 rounded-full hover:bg-white active:scale-95 transition-all"
                >
                  العب مجدداً
                </button>
                <button
                  onClick={onQuit}
                  className="flex-1 bg-transparent text-[#00E5FF] font-black py-3 rounded-full border-2 border-[#00E5FF] active:scale-95 transition-all"
                >
                  خروج
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
