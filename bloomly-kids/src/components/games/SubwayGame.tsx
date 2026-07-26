import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Zap, Trophy, ShieldAlert } from "lucide-react";

interface SuperCarRacerProps {
  onQuit: () => void;
  onWin: (stars: number) => void;
}

interface RacingCar {
  id: number;
  lane: number; // 0 (left), 1 (center), 2 (right)
  type: "coin" | "nitro" | "traffic_red" | "traffic_blue" | "oil_slick";
  emoji: string;
  z: number; // 0 far, 100 near
  speed: number;
  color: string;
}

export default function SubwayGame({ onQuit, onWin }: SuperCarRacerProps) {
  const [score, setScore] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(120);
  const [nitroFuel, setNitroFuel] = useState(100);
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "won">("playing");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const playerLaneRef = useRef(1);
  const objectsRef = useRef<RacingCar[]>([]);
  const lastSpawnTime = useRef<number>(Date.now());

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const speedRef = useRef(120);
  const nitroRef = useRef(100);
  const isNitroRef = useRef(false);

  const audioCtxRef = useRef<any>(null);

  const playSound = useCallback((type: "engine" | "coin" | "nitro" | "crash") => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === "coin") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "nitro") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "crash") {
        osc.type = "square";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const triggerNitro = () => {
    if (nitroRef.current > 20 && !isNitroRef.current) {
      isNitroRef.current = true;
      setIsNitroActive(true);
      playSound("nitro");

      setTimeout(() => {
        isNitroRef.current = false;
        setIsNitroActive(false);
      }, 2500);
    }
  };

  const updateAndDraw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // 1. Cyber Sunset Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
    skyGrad.addColorStop(0, "#0F172A");
    skyGrad.addColorStop(0.5, "#31103F");
    skyGrad.addColorStop(1, "#701A75");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.45);

    // Glowing Sunset Sun
    const sunY = height * 0.38;
    const sunGrad = ctx.createRadialGradient(width / 2, sunY, 10, width / 2, sunY, 70);
    sunGrad.addColorStop(0, "#FDE047");
    sunGrad.addColorStop(0.5, "#F97316");
    sunGrad.addColorStop(1, "transparent");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(width / 2, sunY, 70, 0, Math.PI * 2);
    ctx.fill();

    // 2. Asphalt Highway Floor
    const horizonY = height * 0.45;
    const bottomY = height;
    const center = width / 2;

    const groundGrad = ctx.createLinearGradient(0, horizonY, 0, bottomY);
    groundGrad.addColorStop(0, "#1E293B");
    groundGrad.addColorStop(1, "#090D16");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, width, bottomY - horizonY);

    // 3. Perspective 3-Lane Asphalt Road
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(center - width * 0.08, horizonY);
    ctx.lineTo(center + width * 0.08, horizonY);
    ctx.lineTo(center + width * 0.48, bottomY);
    ctx.lineTo(center - width * 0.48, bottomY);
    ctx.closePath();
    ctx.fill();

    // Glowing Neon Guard Rails & Lane Dividers
    ctx.strokeStyle = "#EC4899";
    ctx.shadowColor = "#F43F5E";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 4;

    // Outer Left/Right Rails
    ctx.beginPath();
    ctx.moveTo(center - width * 0.08, horizonY);
    ctx.lineTo(center - width * 0.48, bottomY);
    ctx.moveTo(center + width * 0.08, horizonY);
    ctx.lineTo(center + width * 0.48, bottomY);
    ctx.stroke();

    // Inner Lane Lines
    ctx.strokeStyle = "#FACC15";
    ctx.shadowColor = "#EAB308";
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(center - width * 0.026, horizonY);
    ctx.lineTo(center - width * 0.16, bottomY);
    ctx.moveTo(center + width * 0.026, horizonY);
    ctx.lineTo(center + width * 0.16, bottomY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    if (gameState !== "playing") return;

    // Speed calculation
    const baseSpeed = isNitroRef.current ? 220 : 120 + Math.min(scoreRef.current * 2, 100);
    speedRef.current = baseSpeed;
    setSpeedKmh(Math.floor(baseSpeed));

    // Nitro consumption
    if (isNitroRef.current && nitroRef.current > 0) {
      nitroRef.current = Math.max(0, nitroRef.current - 0.8);
      setNitroFuel(Math.floor(nitroRef.current));
    }

    // 4. Object Spawning
    const now = Date.now();
    const spawnInterval = isNitroRef.current ? 400 : Math.max(500, 1100 - scoreRef.current * 15);
    if (now - lastSpawnTime.current > spawnInterval) {
      lastSpawnTime.current = now;
      const r = Math.random();
      let type: RacingCar["type"] = "coin";
      let emoji = "🪙";
      let color = "#FACC15";

      if (r > 0.82) {
        type = "nitro";
        emoji = "⚡";
        color = "#38BDF8";
      } else if (r > 0.5) {
        type = "traffic_red";
        emoji = "🏎️";
        color = "#EF4444";
      } else if (r > 0.3) {
        type = "traffic_blue";
        emoji = "🚘";
        color = "#3B82F6";
      } else if (r > 0.2) {
        type = "oil_slick";
        emoji = "🛢️";
        color = "#64748B";
      }

      objectsRef.current.push({
        id: Date.now(),
        lane: Math.floor(Math.random() * 3),
        type,
        emoji,
        z: 0,
        speed: (type.startsWith("traffic") ? 1.4 : 0.9) * (baseSpeed / 120),
        color
      });
    }

    // Sort z for depth rendering
    objectsRef.current.sort((a, b) => a.z - b.z);

    for (let i = objectsRef.current.length - 1; i >= 0; i--) {
      const obj = objectsRef.current[i];
      obj.z += obj.speed * 1.8;

      const scale = obj.z / 100;
      const y = horizonY + (bottomY - horizonY) * scale;

      let xOff = 0;
      if (obj.lane === 0) xOff = -width * 0.32;
      if (obj.lane === 2) xOff = width * 0.32;
      const x = center + xOff * scale;

      const size = 16 + 75 * scale;

      ctx.font = `${size}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(obj.emoji, x, y);

      // 5. Collision Detection
      if (obj.z > 85 && obj.z < 105 && obj.lane === playerLaneRef.current) {
        if (obj.type === "coin") {
          playSound("coin");
          scoreRef.current += 1;
          setScore(scoreRef.current);
        } else if (obj.type === "nitro") {
          playSound("nitro");
          nitroRef.current = Math.min(100, nitroRef.current + 35);
          setNitroFuel(Math.floor(nitroRef.current));
        } else {
          // Hit opponent car or oil slick!
          if (!isNitroRef.current) {
            playSound("crash");
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
              setGameState("gameover");
            }
          }
        }
        objectsRef.current.splice(i, 1);
        continue;
      }

      if (obj.z > 120) {
        objectsRef.current.splice(i, 1);
      }
    }

    // 6. Draw Player GT Sports Supercar
    let pXOff = 0;
    if (playerLaneRef.current === 0) pXOff = -width * 0.32;
    if (playerLaneRef.current === 2) pXOff = width * 0.32;
    const px = center + pXOff;
    const py = bottomY - 30;

    // Nitro speed flame trail behind player car
    if (isNitroRef.current) {
      ctx.fillStyle = "#38BDF8";
      ctx.shadowColor = "#38BDF8";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(px, py + 10, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Player Car Body
    ctx.font = "90px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("🏎️", px, py);

    // Win condition check
    if (scoreRef.current >= 25 && gameState === "playing") {
      setGameState("won");
      setTimeout(() => onWin(3), 1200);
    }
  };

  const gameLoop = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        updateAndDraw(ctx, canvasRef.current.width, canvasRef.current.height);
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

  // Keyboard Steering Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if ((e.key === "ArrowLeft" || e.key === "a") && playerLaneRef.current > 0) {
        playerLaneRef.current -= 1;
      }
      if ((e.key === "ArrowRight" || e.key === "d") && playerLaneRef.current < 2) {
        playerLaneRef.current += 1;
      }
      if (e.key === " " || e.key === "ArrowUp") {
        triggerNitro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden select-none touch-none font-sans" style={{ touchAction: "none" }} dir="rtl">
      
      {/* HUD Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <button
          onClick={onQuit}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all border border-pink-500/40 cursor-pointer pointer-events-auto shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 rtl:rotate-180" />
        </button>

        {/* Speedometer & Stats HUD */}
        <div className="flex items-center gap-4">
          {/* Digital Speedometer */}
          <div className="bg-black/70 backdrop-blur-md px-5 py-2 rounded-2xl border border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)] text-right">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
              {speedKmh} <span className="text-xs text-yellow-200">KM/H</span>
            </span>
          </div>

          {/* Score Counter */}
          <div className="bg-black/70 backdrop-blur-md px-5 py-2 rounded-2xl border border-blue-400/50 shadow-md text-white font-black text-xl flex items-center gap-2">
            <span>🪙</span> {score}
          </div>

          {/* Lives */}
          <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-red-400/50 shadow-md flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < lives ? "opacity-100 filter drop-shadow" : "opacity-30 grayscale"}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="block w-full h-full relative z-0" />

      {/* Touch Steering & Nitro Controls */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
        {/* Steering Buttons */}
        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={() => { if (playerLaneRef.current > 0) playerLaneRef.current -= 1; }}
            className="w-20 h-20 bg-slate-900/80 backdrop-blur-md text-white rounded-2xl border-2 border-cyan-400 flex items-center justify-center text-3xl active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={() => { if (playerLaneRef.current < 2) playerLaneRef.current += 1; }}
            className="w-20 h-20 bg-slate-900/80 backdrop-blur-md text-white rounded-2xl border-2 border-cyan-400 flex items-center justify-center text-3xl active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer"
          >
            ▶
          </button>
        </div>

        {/* Nitro Boost Button */}
        <button
          onClick={triggerNitro}
          disabled={nitroFuel < 20}
          className={`px-8 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all pointer-events-auto cursor-pointer border-2 shadow-2xl ${
            isNitroActive
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.9)] animate-pulse"
              : nitroFuel >= 20
              ? "bg-gradient-to-r from-amber-500 to-red-600 text-white border-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95"
              : "bg-slate-800 text-slate-500 border-slate-700 opacity-50 cursor-not-allowed"
          }`}
        >
          <Zap className="w-7 h-7 fill-current" />
          <span>نيترو TURBO 🔥</span>
        </button>
      </div>

      {/* Game Over Modal */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-slate-900 border-4 border-red-500 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-4xl font-black text-red-500 mb-2 drop-shadow-md">تحطمت سيارتك! 💥</h2>
            <p className="text-xl font-bold text-slate-300 mb-6">جمعت {score} عملة ذهبية 🪙</p>
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
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-full font-black text-lg shadow-lg active:scale-95"
              >
                إعادة 🔄
              </button>
              <button
                onClick={onQuit}
                className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-full font-black text-lg border border-slate-700 active:scale-95"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Win Modal */}
      {gameState === "won" && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-slate-900 border-4 border-yellow-400 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(250,204,21,0.5)]">
            <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-2 animate-bounce" />
            <h2 className="text-4xl font-black text-yellow-300 mb-2 drop-shadow-md">بطل السباق الخارق! 🏎️</h2>
            <p className="text-lg font-bold text-slate-200 mb-6">لقد تجاوزت المنافسين ووصلت لخط النهاية!</p>
            <button
              onClick={() => onWin(3)}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 py-3.5 rounded-full font-black text-xl shadow-lg active:scale-95"
            >
              استلم الكأس والنجوم 🎁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
