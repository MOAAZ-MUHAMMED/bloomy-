import React, { useState, useEffect, useRef, useCallback } from "react";
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
  speed: number;
}

const LANES = [0, 1, 2];
const COINS = ["🪙", "💎", "💰"];
const OBSTACLES = ["🚧", "🛑", "🪵"];
const TRAINS = ["🚂", "🚆", "🚄"];

export default function SubwayGame({ onQuit, onWin }: SubwayGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "won">("playing");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const playerLaneRef = useRef(1);
  const isJumpingRef = useRef(false);
  const jumpTimeRef = useRef(0);
  const objectsRef = useRef<GameObject[]>([]);
  const lastSpawnTime = useRef<number>(Date.now());
  
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  
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
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "hit") {
        osc.type = "square";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "jump") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const updateAndDraw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Draw sky
    const grad = ctx.createLinearGradient(0, 0, 0, height/2);
    grad.addColorStop(0, "#87CEEB");
    grad.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height/2);

    // Draw Ground
    ctx.fillStyle = "#8FBC8F";
    ctx.fillRect(0, height/2, width, height/2);

    // Draw Tracks
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
    const horizonY = height/2;
    const bottomY = height;
    const center = width/2;
    
    // Perspective lines
    ctx.beginPath();
    ctx.moveTo(center, horizonY);
    ctx.lineTo(center - width/2, bottomY);
    ctx.moveTo(center, horizonY);
    ctx.lineTo(center - width/6, bottomY);
    ctx.moveTo(center, horizonY);
    ctx.lineTo(center + width/6, bottomY);
    ctx.moveTo(center, horizonY);
    ctx.lineTo(center + width/2, bottomY);
    ctx.stroke();

    if (gameState !== "playing") return;

    const now = Date.now();
    if (now - lastSpawnTime.current > 800 - Math.min(scoreRef.current * 10, 400)) {
      lastSpawnTime.current = now;
      const r = Math.random();
      let type: "coin" | "obstacle" | "train" = "coin";
      let emoji = COINS[Math.floor(Math.random() * COINS.length)];
      
      if (r > 0.8) {
        type = "train";
        emoji = TRAINS[Math.floor(Math.random() * TRAINS.length)];
      } else if (r > 0.5) {
        type = "obstacle";
        emoji = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
      }

      objectsRef.current.push({
        id: Date.now(),
        lane: Math.floor(Math.random() * 3),
        type,
        emoji,
        z: 0,
        speed: type === "train" ? 1.5 : 0.8 + (scoreRef.current * 0.02)
      });
    }

    // Sort objects by z to draw back-to-front
    objectsRef.current.sort((a, b) => a.z - b.z);

    for (let i = objectsRef.current.length - 1; i >= 0; i--) {
      const obj = objectsRef.current[i];
      obj.z += obj.speed;

      // Projection
      const scale = obj.z / 100;
      const y = horizonY + (bottomY - horizonY) * scale;
      
      let xOff = 0;
      if (obj.lane === 0) xOff = -width/3;
      if (obj.lane === 2) xOff = width/3;
      const x = center + (xOff * scale);
      
      const size = 10 + 80 * scale;

      ctx.font = `${size}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(obj.emoji, x, y);

      // Collision
      if (obj.z > 90 && obj.z < 110 && obj.lane === playerLaneRef.current) {
        // Simple jump bypass for obstacles
        const isSafe = isJumpingRef.current && (obj.type === "obstacle");
        
        if (!isSafe) {
          if (obj.type === "coin") {
            playSound("coin");
            scoreRef.current += 1;
            setScore(scoreRef.current);
          } else {
            playSound("hit");
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
              setGameState("gameover");
            }
          }
          objectsRef.current.splice(i, 1);
          continue;
        }
      }

      // Remove passed objects
      if (obj.z > 120) {
        objectsRef.current.splice(i, 1);
      }
    }

    // Draw Player
    let jumpOffset = 0;
    if (isJumpingRef.current) {
      const jumpProgress = (now - jumpTimeRef.current) / 500; // 500ms jump
      if (jumpProgress < 1) {
        jumpOffset = Math.sin(jumpProgress * Math.PI) * 100;
      } else {
        isJumpingRef.current = false;
      }
    }

    let pXOff = 0;
    if (playerLaneRef.current === 0) pXOff = -width/3;
    if (playerLaneRef.current === 2) pXOff = width/3;
    const px = center + pXOff;
    const py = bottomY - 20 - jumpOffset;

    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("🏃", px, py);

    // Win condition
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

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartX.current = e.clientX;
      touchStartY.current = e.clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    let endX, endY;
    if ('changedTouches' in e) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    } else {
      endX = e.clientX;
      endY = e.clientY;
    }

    const diffX = endX - touchStartX.current;
    const diffY = endY - touchStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 30 && playerLaneRef.current < 2) {
        playerLaneRef.current += 1; // right
      } else if (diffX < -30 && playerLaneRef.current > 0) {
        playerLaneRef.current -= 1; // left
      }
    } else {
      // Vertical swipe
      if (diffY < -30 && !isJumpingRef.current) {
        isJumpingRef.current = true;
        jumpTimeRef.current = Date.now();
        playSound("jump");
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="fixed inset-0 bg-[#87CEEB] overflow-hidden select-none touch-none" style={{ touchAction: 'none' }}>
      
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <button
          onClick={onQuit}
          className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-[#4D2B82] hover:bg-white/80 transition-all border-2 border-white cursor-pointer pointer-events-auto"
        >
          <ArrowLeft className="w-6 h-6 rtl:rotate-180" />
        </button>
        <div className="flex gap-4">
          <div className="bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white shadow-sm text-[#4D2B82] font-black text-xl flex items-center gap-2">
            <span>🪙</span> {score}
          </div>
          <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white shadow-sm text-white font-black text-xl flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < lives ? "opacity-100" : "opacity-30 grayscale"}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-grab active:cursor-grabbing relative z-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      />

      {/* On-screen controls for PC */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 pointer-events-none">
         <div className="flex flex-col items-center gap-2 bg-white/30 backdrop-blur-sm p-4 rounded-3xl pointer-events-auto">
            <button 
              className="w-16 h-16 bg-white/80 rounded-full font-black text-2xl active:bg-gray-200"
              onClick={() => {
                if (!isJumpingRef.current) {
                  isJumpingRef.current = true;
                  jumpTimeRef.current = Date.now();
                  playSound("jump");
                }
              }}
            >
              ⬆️
            </button>
            <div className="flex gap-4 mt-2">
              <button 
                className="w-16 h-16 bg-white/80 rounded-full font-black text-2xl active:bg-gray-200"
                onClick={() => { if(playerLaneRef.current > 0) playerLaneRef.current -= 1; }}
              >
                ⬅️
              </button>
              <button 
                className="w-16 h-16 bg-white/80 rounded-full font-black text-2xl active:bg-gray-200"
                onClick={() => { if(playerLaneRef.current < 2) playerLaneRef.current += 1; }}
              >
                ➡️
              </button>
            </div>
         </div>
      </div>

      {/* Game Over Screen */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border-4 border-red-500">
            <h2 className="text-4xl font-black text-red-600 mb-4">انتهت اللعبة!</h2>
            <p className="text-xl font-bold text-gray-700 mb-6">جمعت {score} عملة 🪙</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  scoreRef.current = 0;
                  livesRef.current = 3;
                  setScore(0);
                  setLives(3);
                  objectsRef.current = [];
                  playerLaneRef.current = 1;
                  setGameState("playing");
                }}
                className="flex-1 bg-green-500 text-white py-3 rounded-full font-black text-xl border-b-4 border-green-700 active:translate-y-1"
              >
                إعادة
              </button>
              <button
                onClick={onQuit}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-full font-black text-xl border-b-4 border-gray-400 active:translate-y-1"
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
            <h2 className="text-4xl font-black text-yellow-500 mb-4">بطل الجري! 🏃</h2>
            <p className="text-xl font-bold text-gray-700 mb-6">لقد وصلت لخط النهاية!</p>
            <button
              onClick={() => onWin(3)}
              className="w-full bg-yellow-400 text-white py-3 rounded-full font-black text-xl border-b-4 border-yellow-600 active:translate-y-1"
            >
              استمرار
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
