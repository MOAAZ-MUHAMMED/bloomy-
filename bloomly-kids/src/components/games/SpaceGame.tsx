import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";

interface SpaceGameProps {
  onQuit: () => void;
  onWin: (stars: number) => void;
}

const ENEMIES = ["👾", "👽", "🛸", "☄️"];

interface GameObject {
  id: number;
  type: "laser" | "enemy" | "explosion";
  emoji?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vy?: number;
  life?: number; // for explosions
}

export default function SpaceGame({ onQuit, onWin }: SpaceGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "won">("playing");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const playerXRef = useRef(50); // percentage 0-100
  const objectsRef = useRef<GameObject[]>([]);
  
  const lastShotTime = useRef<number>(Date.now());
  const lastEnemyTime = useRef<number>(Date.now());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);

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
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
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
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const shoot = (width: number, height: number) => {
    const now = Date.now();
    if (now - lastShotTime.current < 200) return;
    lastShotTime.current = now;
    playSound("shoot");
    
    objectsRef.current.push({
      id: Date.now(),
      type: "laser",
      x: (playerXRef.current / 100) * width,
      y: height - 100,
      width: 4,
      height: 20
    });
  };

  const updateAndDraw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    if (gameState !== "playing") return;

    const now = Date.now();
    
    // Auto-fire
    shoot(width, height);

    // Spawn Enemy
    if (now - lastEnemyTime.current > 1000 - Math.min(scoreRef.current * 15, 600)) {
      lastEnemyTime.current = now;
      objectsRef.current.push({
        id: Date.now() + Math.random(),
        type: "enemy",
        emoji: ENEMIES[Math.floor(Math.random() * ENEMIES.length)],
        x: Math.random() * (width - 60) + 30,
        y: -50,
        width: 40,
        height: 40,
        vy: 2 + Math.random() * 2 + (scoreRef.current * 0.05)
      });
    }

    // Draw Player (Spaceship)
    const px = (playerXRef.current / 100) * width;
    const py = height - 80;
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🚀", px, py);

    // Update and draw objects
    for (let i = objectsRef.current.length - 1; i >= 0; i--) {
      const obj = objectsRef.current[i];
      
      if (obj.type === "laser") {
        obj.y -= 10;
        ctx.fillStyle = "#00FFFF";
        ctx.fillRect(obj.x - obj.width/2, obj.y - obj.height/2, obj.width, obj.height);
        
        // Laser offscreen
        if (obj.y < 0) {
          objectsRef.current.splice(i, 1);
          continue;
        }
        
        // Collision with enemy
        let hit = false;
        for (let j = objectsRef.current.length - 1; j >= 0; j--) {
          const enemy = objectsRef.current[j];
          if (enemy.type === "enemy") {
            const dx = obj.x - enemy.x;
            const dy = obj.y - enemy.y;
            if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
              // Hit!
              playSound("explosion");
              scoreRef.current += 1;
              setScore(scoreRef.current);
              
              // Spawn explosion
              objectsRef.current.push({
                id: Date.now(),
                type: "explosion",
                x: enemy.x,
                y: enemy.y,
                width: 50,
                height: 50,
                life: 1.0
              });
              
              objectsRef.current.splice(j, 1); // remove enemy
              hit = true;
              break;
            }
          }
        }
        if (hit) {
          objectsRef.current.splice(i, 1); // remove laser
        }
      } 
      else if (obj.type === "enemy") {
        obj.y += obj.vy || 2;
        ctx.font = "40px Arial";
        ctx.fillText(obj.emoji || "👾", obj.x, obj.y);
        
        // Check collision with player
        const pdx = px - obj.x;
        const pdy = py - obj.y;
        if (Math.abs(pdx) < 40 && Math.abs(pdy) < 40) {
          playSound("explosion");
          livesRef.current -= 1;
          setLives(livesRef.current);
          objectsRef.current.splice(i, 1);
          if (livesRef.current <= 0) {
            setGameState("gameover");
          }
          continue;
        }
        
        // Enemy offscreen (missed)
        if (obj.y > height + 50) {
          livesRef.current -= 1;
          setLives(livesRef.current);
          objectsRef.current.splice(i, 1);
          if (livesRef.current <= 0) {
            setGameState("gameover");
          }
        }
      }
      else if (obj.type === "explosion") {
        if (obj.life !== undefined) {
          obj.life -= 0.05;
          if (obj.life <= 0) {
            objectsRef.current.splice(i, 1);
            continue;
          }
          ctx.font = `${40 + (1 - obj.life) * 20}px Arial`;
          ctx.globalAlpha = obj.life;
          ctx.fillText("💥", obj.x, obj.y);
          ctx.globalAlpha = 1.0;
        }
      }
    }

    if (scoreRef.current >= 30 && gameState === "playing") {
      setGameState("won");
      setTimeout(() => onWin(3), 1500);
    }
  };

  const gameLoop = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const { width, height } = canvasRef.current;
        updateAndDraw(ctx, width, height);
      }
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== "playing") return;
    const x = Math.max(5, Math.min(95, (e.clientX / window.innerWidth) * 100));
    playerXRef.current = x;
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A2A] overflow-hidden select-none touch-none" style={{ touchAction: 'none' }}>
      {/* Background Starfield */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZyBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjMiPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE1MCIgcj0iMSIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjUwIiByPSIxIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMzAwIiByPSIxLjUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1MCIgcj0iMSIvPjwvZz48L3N2Zz4=')] bg-repeat opacity-50 animate-[driftSide_10s_linear_infinite]" />
      
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <button
          onClick={onQuit}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20 cursor-pointer shadow-[0_0_15px_rgba(0,255,255,0.2)]"
        >
          <ArrowLeft className="w-6 h-6 rtl:rotate-180" />
        </button>
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] text-cyan-300 font-black text-xl flex items-center gap-2">
            <span>👾</span> {score}
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-pink-500/30 shadow-[0_0_15px_rgba(255,0,128,0.2)] text-white font-black text-xl flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < lives ? "opacity-100" : "opacity-30 grayscale"}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair relative z-0"
        onPointerMove={handlePointerMove}
      />

      {/* Game Over Screen */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-[#1A1A3A] rounded-3xl p-8 max-w-sm w-full text-center border-4 border-cyan-500 shadow-[0_0_50px_rgba(0,255,255,0.3)]">
            <h2 className="text-4xl font-black text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">انتهت المهمة!</h2>
            <p className="text-xl font-bold text-cyan-100 mb-6">دمرت {score} فضائي 👾</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  scoreRef.current = 0;
                  livesRef.current = 3;
                  setScore(0);
                  setLives(3);
                  objectsRef.current = [];
                  setGameState("playing");
                }}
                className="flex-1 bg-cyan-500 text-[#0A0A2A] py-3 rounded-full font-black text-xl hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={onQuit}
                className="flex-1 bg-transparent text-cyan-500 border-2 border-cyan-500 py-3 rounded-full font-black text-xl hover:bg-cyan-500/10 transition-all"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameState === "won" && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-[#1A1A3A] rounded-3xl p-8 max-w-sm w-full text-center border-4 border-yellow-400 shadow-[0_0_50px_rgba(255,255,0,0.3)]">
            <h2 className="text-4xl font-black text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">بطل الفضاء! 🌟</h2>
            <p className="text-xl font-bold text-yellow-100 mb-6">لقد أنقذت المجرة!</p>
            <button
              onClick={() => onWin(3)}
              className="w-full bg-yellow-400 text-[#0A0A2A] py-3 rounded-full font-black text-xl shadow-[0_0_15px_rgba(255,255,0,0.5)] transition-all"
            >
              استمرار
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
