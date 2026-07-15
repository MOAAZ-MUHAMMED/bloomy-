import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface SubwayGameProps {
  onQuit: () => void;
  onWin: (stars: number) => void;
}

interface GameObject {
  id: number;
  lane: number; // 0 (left), 1 (center), 2 (right)
  type: "coin" | "obstacle" | "train";
  emoji: string;
  z: number; // 0 is far away, 100 is at player
}

export default function SubwayGame({ onQuit, onWin }: SubwayGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "won">("playing");
  
  const [playerLane, setPlayerLane] = useState(1);
  const [isJumping, setIsJumping] = useState(false);
  const [objects, setObjects] = useState<GameObject[]>([]);
  
  const requestRef = useRef<number>();
  const lastSpawnTime = useRef<number>(Date.now());
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const playSound = useCallback((type: "coin" | "hit" | "jump") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === "coin") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "hit") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "jump") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {}
  }, []);

  const spawnObject = () => {
    const lane = Math.floor(Math.random() * 3);
    const rand = Math.random();
    let type: "coin" | "obstacle" | "train" = "coin";
    let emoji = "🟡";
    
    if (rand < 0.4) {
      type = "coin";
      emoji = "🟡";
    } else if (rand < 0.8) {
      type = "obstacle";
      emoji = "🚧"; // Low obstacle, can jump over
    } else {
      type = "train";
      emoji = "🚆"; // High obstacle, must dodge
    }
    
    setObjects(prev => [...prev, {
      id: Date.now(),
      lane,
      type,
      emoji,
      z: 0 // spawn far away
    }]);
  };

  const updatePhysics = useCallback(() => {
    if (gameState !== "playing") return;
    const now = Date.now();
    
    // Spawn timing
    if (now - lastSpawnTime.current > Math.max(1000 - score * 2, 400)) {
      spawnObject();
      lastSpawnTime.current = now;
    }

    // Move objects towards screen (z goes 0 to 100)
    setObjects(prev => {
      let active = prev.map(o => ({ ...o, z: o.z + 1.5 + (score / 200) }));
      
      // Collision detection at z around 85-95
      active.forEach(o => {
        if (o.z > 85 && o.z < 95 && o.lane === playerLane) {
          if (o.type === "coin") {
            o.z = 200; // mark collected
            setScore(s => s + 10);
            playSound("coin");
          } else if (o.type === "obstacle") {
            if (!isJumping) {
              o.z = 200; // mark hit
              playSound("hit");
              setLives(l => {
                const newL = l - 1;
                if (newL <= 0) setGameState("gameover");
                return Math.max(0, newL);
              });
            }
          } else if (o.type === "train") {
            // Can't jump over train
            o.z = 200; // mark hit
            playSound("hit");
            setLives(l => {
              const newL = l - 1;
              if (newL <= 0) setGameState("gameover");
              return Math.max(0, newL);
            });
          }
        }
      });

      return active.filter(o => o.z < 100);
    });

    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [gameState, playerLane, isJumping, score, playSound]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [updatePhysics]);

  useEffect(() => {
    if (score >= 400) {
      setGameState("won");
      onWin(3);
    }
  }, [score, onWin]);

  // Handle Swipes
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartX.current = (e as React.MouseEvent).clientX;
      touchStartY.current = (e as React.MouseEvent).clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    let endX, endY;
    if ('changedTouches' in e) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    } else {
      endX = (e as React.MouseEvent).clientX;
      endY = (e as React.MouseEvent).clientY;
    }

    const diffX = endX - touchStartX.current;
    const diffY = endY - touchStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      // Horizontal swipe
      if (diffX > 0 && playerLane < 2) setPlayerLane(l => l + 1);
      else if (diffX < 0 && playerLane > 0) setPlayerLane(l => l - 1);
    } else if (Math.abs(diffY) > 30 && diffY < 0) {
      // Swipe up (Jump)
      if (!isJumping) {
        setIsJumping(true);
        playSound("jump");
        setTimeout(() => setIsJumping(false), 500); // jump duration
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerLane(l => Math.max(0, l - 1));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerLane(l => Math.min(2, l + 1));
      } else if (e.key === "ArrowUp" || e.key === "w") {
        if (!isJumping) {
          setIsJumping(true);
          playSound("jump");
          setTimeout(() => setIsJumping(false), 500);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isJumping, playSound]);

  // Utility to project 3D z onto 2D screen
  const getProjection = (lane: number, z: number) => {
    // lane 0,1,2 -> x pos -1, 0, 1
    const xBase = lane - 1; 
    
    // As z goes 0->100, scale goes small->large, y goes top->bottom
    const scale = 0.1 + (z / 100) * 0.9;
    
    // Perspective spread: x spreads out more as it gets closer
    const spread = 40 * scale; // vw spread
    const x = 50 + (xBase * spread); // center is 50vw
    
    const y = 30 + (z / 100) * 60; // 30vh to 90vh

    return { x, y, scale };
  };

  return (
    <div 
      className="fixed inset-0 bg-[#87CEEB] z-[9999] overflow-hidden select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      {/* City background skyline */}
      <div className="absolute top-[10%] w-full h-[30%] flex items-end justify-center pointer-events-none opacity-60">
        <div className="w-16 h-40 bg-gray-600 mx-2" />
        <div className="w-24 h-60 bg-gray-500 mx-2" />
        <div className="w-20 h-48 bg-gray-700 mx-2" />
        <div className="w-32 h-72 bg-gray-800 mx-2" />
        <div className="w-16 h-32 bg-gray-600 mx-2" />
      </div>

      {/* Perspective Ground */}
      <div className="absolute bottom-0 w-full h-[60%] bg-[#7CFC00]" style={{ perspective: "1000px" }}>
        {/* Tracks */}
        <div className="absolute w-[80vw] h-full left-[10vw] bg-[#A9A9A9] border-x-4 border-gray-400" 
             style={{ transform: "rotateX(70deg)", transformOrigin: "top" }}>
          <div className="w-full h-full flex justify-between">
            <div className="w-[33%] border-r-4 border-dashed border-white/50 animate-[slideDown_1s_linear_infinite]" />
            <div className="w-[33%] border-r-4 border-dashed border-white/50 animate-[slideDown_1s_linear_infinite]" />
            <div className="w-[33%]" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-8 flex justify-between items-center z-50 pointer-events-none">
        <button 
          onClick={onQuit}
          className="pointer-events-auto bg-white/40 hover:bg-white/60 text-[#4D2B82] rounded-full p-3 backdrop-blur-sm transition-all"
        >
          <ArrowLeft className="w-6 h-6 rtl:rotate-180" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[#4D2B82] font-black text-sm drop-shadow-md">العملات</span>
          <span className="text-[#F59E0B] font-black text-4xl sm:text-5xl drop-shadow-lg">{score}</span>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <span key={i} className={`text-2xl sm:text-3xl transition-all ${i <= lives ? 'text-red-500' : 'text-gray-500 grayscale opacity-50'}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Objects */}
      {objects.map(obj => {
        const p = getProjection(obj.lane, obj.z);
        return (
          <div
            key={obj.id}
            className="absolute text-6xl pointer-events-none filter drop-shadow-lg flex items-center justify-center"
            style={{
              left: `${p.x}vw`,
              top: `${p.y}vh`,
              transform: `translate(-50%, -100%) scale(${p.scale})`,
              zIndex: Math.floor(obj.z)
            }}
          >
            {obj.emoji}
          </div>
        );
      })}

      {/* Player Character */}
      {(() => {
        const p = getProjection(playerLane, 95); // Player is at z=95
        return (
          <motion.div
            className="absolute text-7xl pointer-events-none filter drop-shadow-2xl"
            animate={{
              left: `${p.x}vw`,
              top: `${p.y}vh`,
              transform: `translate(-50%, -100%) scale(${p.scale}) translateY(${isJumping ? '-15vh' : '0vh'})`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.8 }}
            style={{ zIndex: 100 }}
          >
            🏃‍♂️
          </motion.div>
        );
      })()}

      {/* Game Over / Win Screens */}
      <AnimatePresence>
        {gameState !== "playing" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-black/60 z-[200] flex flex-col items-center justify-center p-4 pointer-events-auto backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border-4 border-[#F59E0B]"
            >
              <div className="text-6xl mb-4">
                {gameState === "won" ? "🏅" : "💥"}
              </div>
              <h2 className="text-3xl font-black text-[#4D2B82] mb-2">
                {gameState === "won" ? "عداء أسطوري!" : "اوبس! اصطدمت"}
              </h2>
              <p className="text-[#F59E0B] font-bold text-lg mb-6">
                جمعت: {score} عملة
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setScore(0);
                    setLives(3);
                    setObjects([]);
                    setPlayerLane(1);
                    setGameState("playing");
                  }}
                  className="flex-1 bg-[#F59E0B] text-white font-black py-3 rounded-full hover:bg-[#D97706] active:scale-95 transition-all"
                >
                  العب مجدداً
                </button>
                <button
                  onClick={onQuit}
                  className="flex-1 bg-white text-[#E01E5A] font-black py-3 rounded-full border-2 border-[#E01E5A] hover:bg-red-50 active:scale-95 transition-all"
                >
                  خروج
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
