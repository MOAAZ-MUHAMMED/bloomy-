import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface NinjaGameProps {
  onQuit: () => void;
  onWin: (stars: number) => void;
}

interface GameObject {
  id: number;
  type: "fruit" | "bomb";
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  sliced: boolean;
  rotation: number;
  rotationSpeed: number;
}

const FRUITS = ["🍎", "🍉", "🍇", "🍓", "🍌", "🍍", "🥭", "🍊"];
const GRAVITY = 0.4;

export default function NinjaGame({ onQuit, onWin }: NinjaGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "won">("playing");
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [slicePoints, setSlicePoints] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastSpawnTime = useRef<number>(Date.now());
  const isSlicing = useRef(false);

  // Audio Context for sound effects
  const playSound = useCallback((type: "slice" | "bomb" | "gameover") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === "slice") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "bomb") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.warn("Audio error", e);
    }
  }, []);

  const spawnObject = () => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    const isBomb = Math.random() < 0.2; // 20% chance of bomb
    const emoji = isBomb ? "💣" : FRUITS[Math.floor(Math.random() * FRUITS.length)];
    
    // Spawn from bottom
    const startX = width * 0.2 + Math.random() * (width * 0.6); // 20% to 80% width
    const startY = height + 50;
    
    // Velocity aiming towards upper middle
    const targetX = width / 2;
    const targetY = height * 0.2;
    
    // Simple arc calculations
    const timeToPeak = 40; // frames
    const vy = -15 - Math.random() * 5; // upward velocity
    const vx = (targetX - startX) / (timeToPeak * 2) + (Math.random() * 4 - 2);
    
    const newObj: GameObject = {
      id: Date.now() + Math.random(),
      type: isBomb ? "bomb" : "fruit",
      emoji,
      x: startX,
      y: startY,
      vx,
      vy,
      sliced: false,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5
    };
    
    setObjects(prev => [...prev, newObj]);
  };

  const updatePhysics = useCallback(() => {
    if (gameState !== "playing") return;
    
    const now = Date.now();
    if (now - lastSpawnTime.current > 1000 - Math.min(score * 10, 600)) {
      spawnObject();
      lastSpawnTime.current = now;
    }

    setObjects(prev => {
      let activeObjects = prev.map(obj => {
        if (obj.sliced) return obj; // Sliced objects are handled separately or removed
        return {
          ...obj,
          x: obj.x + obj.vx,
          y: obj.y + obj.vy,
          vy: obj.vy + GRAVITY,
          rotation: obj.rotation + obj.rotationSpeed
        };
      });

      // Check missed fruits
      const containerHeight = containerRef.current?.getBoundingClientRect().height || 800;
      const missed = activeObjects.filter(obj => obj.y > containerHeight + 100 && obj.vy > 0 && !obj.sliced && obj.type === "fruit");
      
      if (missed.length > 0) {
        setLives(l => {
          const newLives = l - missed.length;
          if (newLives <= 0) setGameState("gameover");
          return Math.max(0, newLives);
        });
      }

      // Keep only objects that are visible or recently sliced
      return activeObjects.filter(obj => obj.y < containerHeight + 200 || obj.sliced);
    });

    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [gameState, score]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [updatePhysics]);

  useEffect(() => {
    if (score >= 200) {
      setGameState("won");
      onWin(3); // Award 3 stars
    }
  }, [score, onWin]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isSlicing.current = true;
    setSlicePoints([{ x: e.clientX, y: e.clientY }]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSlicing.current || gameState !== "playing") return;
    
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSlicePoints(prev => {
      const newPoints = [...prev, { x, y }];
      if (newPoints.length > 10) newPoints.shift(); // Keep tail short
      return newPoints;
    });

    // Collision detection
    setObjects(prev => {
      let scoreGained = 0;
      let hitBomb = false;

      const newObjects = prev.map(obj => {
        if (obj.sliced) return obj;
        
        // Simple distance check (radius ~ 40px)
        const dist = Math.hypot(obj.x - x, obj.y - y);
        if (dist < 40) {
          if (obj.type === "bomb") {
            hitBomb = true;
          } else {
            scoreGained += 10;
            playSound("slice");
          }
          return { ...obj, sliced: true };
        }
        return obj;
      });

      if (hitBomb) {
        playSound("bomb");
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) setGameState("gameover");
          return Math.max(0, newLives);
        });
      }
      
      if (scoreGained > 0) setScore(s => s + scoreGained);

      return newObjects;
    });
  };

  const handlePointerUp = () => {
    isSlicing.current = false;
    setSlicePoints([]);
  };

  return (
    <div 
      className="fixed inset-0 bg-[#2D1B4E] z-[9999] overflow-hidden select-none touch-none"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        <span className="text-[30vw] animate-pulse">⚔️</span>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-8 flex justify-between items-center z-50 pointer-events-none">
        <button 
          onClick={onQuit}
          className="pointer-events-auto bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-sm transition-all"
        >
          <ArrowLeft className="w-6 h-6 rtl:rotate-180" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-white/80 font-bold text-sm">النقاط</span>
          <span className="text-white font-black text-3xl sm:text-4xl drop-shadow-md">{score}</span>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <span key={i} className={`text-2xl sm:text-3xl transition-all ${i <= lives ? 'text-red-500' : 'text-gray-600 grayscale opacity-50'}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Render Objects */}
      <AnimatePresence>
        {objects.map(obj => {
          if (obj.sliced) {
            // Sliced halves animation
            if (obj.type === "bomb") {
              return (
                <motion.div
                  key={obj.id}
                  initial={{ x: obj.x, y: obj.y, scale: 1, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute text-7xl pointer-events-none"
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  💥
                </motion.div>
              );
            }
            return (
              <React.Fragment key={obj.id}>
                {/* Left Half */}
                <motion.div
                  initial={{ x: obj.x - 20, y: obj.y, rotate: obj.rotation, opacity: 1 }}
                  animate={{ x: obj.x - 100, y: obj.y + 300, rotate: obj.rotation - 90, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeIn" }}
                  className="absolute text-6xl pointer-events-none clip-half-left filter drop-shadow-lg"
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  {obj.emoji}
                </motion.div>
                {/* Right Half */}
                <motion.div
                  initial={{ x: obj.x + 20, y: obj.y, rotate: obj.rotation, opacity: 1 }}
                  animate={{ x: obj.x + 100, y: obj.y + 300, rotate: obj.rotation + 90, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeIn" }}
                  className="absolute text-6xl pointer-events-none clip-half-right filter drop-shadow-lg"
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  {obj.emoji}
                </motion.div>
                {/* Splatter effect */}
                <motion.div
                  initial={{ x: obj.x, y: obj.y, scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute w-20 h-20 bg-yellow-400/40 rounded-full pointer-events-none blur-md"
                  style={{ transform: "translate(-50%, -50%)" }}
                />
              </React.Fragment>
            );
          }

          // Normal flying object
          return (
            <div
              key={obj.id}
              className="absolute text-6xl pointer-events-none filter drop-shadow-lg"
              style={{
                left: obj.x,
                top: obj.y,
                transform: `translate(-50%, -50%) rotate(${obj.rotation}deg)`,
              }}
            >
              {obj.emoji}
            </div>
          );
        })}
      </AnimatePresence>

      {/* Render Slice Trail */}
      {slicePoints.length > 1 && (
        <svg className="absolute inset-0 pointer-events-none w-full h-full z-40">
          <polyline
            points={slicePoints.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          />
        </svg>
      )}

      {/* Game Over / Win Screens */}
      <AnimatePresence>
        {gameState !== "playing" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border-4 border-[#4D2B82]"
            >
              <div className="text-6xl mb-4">
                {gameState === "won" ? "🏆" : "💥"}
              </div>
              <h2 className="text-3xl font-black text-[#4D2B82] mb-2">
                {gameState === "won" ? "أنت نينجا أسطوري!" : "انتهت اللعبة!"}
              </h2>
              <p className="text-[#6B4E9E] font-bold text-lg mb-6">
                النقاط: {score}
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setScore(0);
                    setLives(3);
                    setObjects([]);
                    setGameState("playing");
                  }}
                  className="flex-1 bg-[#2ECC71] text-white font-black py-3 rounded-full border-b-4 border-[#27AE60] active:translate-y-1 active:border-b-0"
                >
                  العب مجدداً
                </button>
                <button
                  onClick={onQuit}
                  className="flex-1 bg-white text-[#E01E5A] font-black py-3 rounded-full border-2 border-[#E01E5A] active:translate-y-1"
                >
                  خروج
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS for slicing halves */}
      <style dangerouslySetInnerHTML={{__html: `
        .clip-half-left { clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%); }
        .clip-half-right { clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%); }
      `}} />
    </div>
  );
}
