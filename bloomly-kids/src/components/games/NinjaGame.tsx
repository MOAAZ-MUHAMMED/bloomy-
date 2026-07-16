import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";

interface NinjaGameProps {
  onQuit: () => void;
  onWin: (stars: number) => void;
}

const FRUITS = ["🍎", "🍉", "🍇", "🍓", "🍌", "🍍", "🥭", "🍊"];
const BOMB = "💣";
const GRAVITY = 0.4;

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
  size: number;
}

export default function NinjaGame({ onQuit, onWin }: NinjaGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "won">("playing");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const objectsRef = useRef<GameObject[]>([]);
  const slicePointsRef = useRef<{ x: number; y: number }[]>([]);
  const isSlicingRef = useRef(false);
  const lastSpawnTime = useRef<number>(Date.now());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);

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
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "bomb") {
        osc.type = "square";
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const spawnObject = (width: number, height: number) => {
    const isBomb = Math.random() < 0.2;
    const emoji = isBomb ? BOMB : FRUITS[Math.floor(Math.random() * FRUITS.length)];
    const x = Math.random() * (width - 60) + 30;
    const vx = (width / 2 - x) * 0.02 + (Math.random() - 0.5) * 5;
    const vy = -(Math.random() * 5 + 15);
    
    objectsRef.current.push({
      id: Date.now() + Math.random(),
      type: isBomb ? "bomb" : "fruit",
      emoji,
      x,
      y: height + 50,
      vx,
      vy,
      sliced: false,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      size: 50
    });
  };

  const updateAndDraw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    if (gameState !== "playing") return;

    // Spawn new objects
    const now = Date.now();
    if (now - lastSpawnTime.current > 800 - Math.min(scoreRef.current * 10, 500)) {
      spawnObject(width, height);
      lastSpawnTime.current = now;
    }

    // Update and draw objects
    for (let i = objectsRef.current.length - 1; i >= 0; i--) {
      const obj = objectsRef.current[i];
      obj.x += obj.vx;
      obj.y += obj.vy;
      obj.vy += GRAVITY;
      obj.rotation += obj.rotationSpeed;

      // Draw Emoji
      ctx.save();
      ctx.translate(obj.x, obj.y);
      ctx.rotate(obj.rotation);
      ctx.font = \`\${obj.size}px Arial\`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (obj.sliced) {
        ctx.globalAlpha = 0.5;
        // Basic split effect
        ctx.fillText(obj.emoji, -10, -10);
        ctx.fillText(obj.emoji, 10, 10);
      } else {
        ctx.fillText(obj.emoji, 0, 0);
      }
      ctx.restore();

      // Check offscreen
      if (obj.y > height + 100) {
        if (obj.type === "fruit" && !obj.sliced) {
          livesRef.current -= 1;
          setLives(livesRef.current);
          if (livesRef.current <= 0) {
            setGameState("gameover");
          }
        }
        objectsRef.current.splice(i, 1);
      }
    }

    // Draw Slice Trail
    if (slicePointsRef.current.length > 1) {
      ctx.beginPath();
      ctx.moveTo(slicePointsRef.current[0].x, slicePointsRef.current[0].y);
      for (let i = 1; i < slicePointsRef.current.length; i++) {
        ctx.lineTo(slicePointsRef.current[i].x, slicePointsRef.current[i].y);
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      
      // Fade out trail
      if (!isSlicingRef.current) {
        slicePointsRef.current.shift();
      } else if (slicePointsRef.current.length > 10) {
         slicePointsRef.current.shift();
      }
    }

    // Check Win
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

  const handlePointerDown = (e: React.PointerEvent) => {
    isSlicingRef.current = true;
    slicePointsRef.current = [{ x: e.clientX, y: e.clientY }];
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSlicingRef.current || gameState !== "playing") return;
    
    const newPoint = { x: e.clientX, y: e.clientY };
    slicePointsRef.current.push(newPoint);

    // Collision detection
    objectsRef.current.forEach(obj => {
      if (!obj.sliced) {
        const dx = obj.x - newPoint.x;
        const dy = obj.y - newPoint.y;
        if (dx * dx + dy * dy < (obj.size) * (obj.size)) {
          obj.sliced = true;
          if (obj.type === "bomb") {
            playSound("bomb");
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
              setGameState("gameover");
            }
          } else {
            playSound("slice");
            scoreRef.current += 1;
            setScore(scoreRef.current);
          }
        }
      }
    });
  };

  const handlePointerUp = () => {
    isSlicingRef.current = false;
  };

  return (
    <div className="fixed inset-0 bg-[#2C3E50] overflow-hidden select-none touch-none" style={{ touchAction: 'none' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#34495E_0%,_#2C3E50_100%)]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <button
          onClick={onQuit}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/30 cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 rtl:rotate-180" />
        </button>
        <div className="flex gap-4">
          <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 shadow-lg text-white font-black text-xl flex items-center gap-2">
            <span>🍎</span> {score}
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-lg text-white font-black text-xl flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < lives ? "opacity-100" : "opacity-30 grayscale"}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair relative z-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Game Over Screen */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border-4 border-red-500">
            <h2 className="text-4xl font-black text-red-600 mb-4">انتهت اللعبة!</h2>
            <p className="text-xl font-bold text-gray-700 mb-6">جمعت {score} فاكهة 🍎</p>
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
                className="flex-1 bg-green-500 text-white py-3 rounded-full font-black text-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
              >
                حاول مرة أخرى
              </button>
              <button
                onClick={onQuit}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-full font-black text-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameState === "won" && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border-4 border-yellow-400">
            <h2 className="text-4xl font-black text-yellow-500 mb-4">أنت بطل نينجا! 🌟</h2>
            <p className="text-xl font-bold text-gray-700 mb-6">جمعت {score} فاكهة ببراعة!</p>
            <button
              onClick={() => onWin(3)}
              className="w-full bg-yellow-400 text-white py-3 rounded-full font-black text-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
            >
              استمرار
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
