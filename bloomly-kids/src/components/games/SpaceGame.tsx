import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ShieldAlert, Zap } from "lucide-react";

interface SpaceGameProps {
  onQuit: () => void;
  onWin: (stars: number) => void;
  level?: number;
}

const REGULAR_ENEMIES = [
  { emoji: "👾", maxHp: 1, color: "#A855F7", score: 10 },
  { emoji: "🤖", maxHp: 2, color: "#3B82F6", score: 20 },
  { emoji: "🛸", maxHp: 3, color: "#2ECC71", score: 30 },
  { emoji: "👹", maxHp: 5, color: "#EF4444", score: 50 },
];

interface GameObject {
  id: number;
  type: "laser" | "enemy" | "boss" | "boss_fireball" | "explosion";
  emoji?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vy?: number;
  vx?: number;
  hp?: number;
  maxHp?: number;
  color?: string;
  life?: number;
}

export default function SpaceGame({ onQuit, onWin, level = 1 }: SpaceGameProps) {
  const isBossLevel = level % 10 === 0 || level === 10;
  const bossMaxHp = 30 + Math.floor(level / 10 - 1) * 15;

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bossHp, setBossHp] = useState<number | null>(isBossLevel ? bossMaxHp : null);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "won">("playing");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const playerXRef = useRef(50);
  const objectsRef = useRef<GameObject[]>([]);

  const lastShotTime = useRef<number>(Date.now());
  const lastEnemyTime = useRef<number>(Date.now());
  const lastBossShotTime = useRef<number>(Date.now());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bossHpRef = useRef<number | null>(isBossLevel ? bossMaxHp : null);

  const audioCtxRef = useRef<any>(null);
  const playSound = useCallback((type: "shoot" | "explosion" | "hit" | "boss_hit") => {
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

      if (type === "shoot") {
        osc.type = "square";
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "explosion") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "boss_hit") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Initialize Boss if Boss level
  useEffect(() => {
    if (isBossLevel) {
      objectsRef.current.push({
        id: 9999,
        type: "boss",
        emoji: "👾👑",
        x: window.innerWidth / 2,
        y: 120,
        width: 100,
        height: 100,
        vx: 3,
        hp: bossMaxHp,
        maxHp: bossMaxHp,
      });
    }
  }, [isBossLevel, bossMaxHp]);

  const shoot = (width: number, height: number) => {
    const now = Date.now();
    if (now - lastShotTime.current < 200) return;
    lastShotTime.current = now;
    playSound("shoot");

    const px = (playerXRef.current / 100) * width;
    objectsRef.current.push({
      id: Date.now() + Math.random(),
      type: "laser",
      x: px,
      y: height - 110,
      width: 5,
      height: 24,
    });
  };

  const updateAndDraw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    if (gameState !== "playing") return;

    const now = Date.now();
    shoot(width, height);

    // Regular enemies spawn (if not Boss or alongside Boss)
    if (now - lastEnemyTime.current > 1200 - Math.min(scoreRef.current * 10, 500)) {
      lastEnemyTime.current = now;
      const enemyData = REGULAR_ENEMIES[Math.floor(Math.random() * REGULAR_ENEMIES.length)];
      objectsRef.current.push({
        id: Date.now() + Math.random(),
        type: "enemy",
        emoji: enemyData.emoji,
        x: Math.random() * (width - 80) + 40,
        y: -40,
        width: 44,
        height: 44,
        vy: 2 + Math.random() * 1.5,
        hp: enemyData.maxHp,
        maxHp: enemyData.maxHp,
        color: enemyData.color,
      });
    }

    // Draw Vector Sci-Fi Spaceship Player Graphic
    const px = (playerXRef.current / 100) * width;
    const py = height - 70;

    // Thruster Flame Canvas Render
    const thrusterGrad = ctx.createLinearGradient(px, py + 20, px, py + 45);
    thrusterGrad.addColorStop(0, "rgba(56, 189, 248, 0.9)");
    thrusterGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.6)");
    thrusterGrad.addColorStop(1, "transparent");
    ctx.fillStyle = thrusterGrad;
    ctx.beginPath();
    ctx.arc(px, py + 25, 12, 0, Math.PI * 2);
    ctx.fill();

    // Spaceship Metal Body
    ctx.fillStyle = "#0284C7";
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px, py - 35);
    ctx.lineTo(px + 28, py + 25);
    ctx.lineTo(px, py + 15);
    ctx.lineTo(px - 28, py + 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cockpit Glass
    ctx.fillStyle = "#E0F2FE";
    ctx.beginPath();
    ctx.ellipse(px, py - 8, 7, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Side Laser Guns
    ctx.fillStyle = "#38BDF8";
    ctx.fillRect(px - 26, py, 4, 16);
    ctx.fillRect(px + 22, py, 4, 16);

    // Update Objects
    for (let i = objectsRef.current.length - 1; i >= 0; i--) {
      const obj = objectsRef.current[i];

      // Boss Behavior
      if (obj.type === "boss") {
        obj.x += obj.vx || 2;
        if (obj.x > width - 60 || obj.x < 60) {
          obj.vx = -(obj.vx || 2);
        }

        // Boss Shoot Fireballs
        if (now - lastBossShotTime.current > 1300) {
          lastBossShotTime.current = now;
          objectsRef.current.push({
            id: Date.now() + Math.random(),
            type: "boss_fireball",
            emoji: "🔥",
            x: obj.x,
            y: obj.y + 40,
            width: 30,
            height: 30,
            vy: 4.5,
          });
        }

        // Render Boss
        ctx.font = "75px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(obj.emoji || "👾👑", obj.x, obj.y);

        continue;
      }

      // Boss Fireball Movement & Player Collision
      if (obj.type === "boss_fireball") {
        obj.y += obj.vy || 4;
        ctx.font = "32px Arial";
        ctx.fillText(obj.emoji || "🔥", obj.x, obj.y);

        if (Math.abs(px - obj.x) < 35 && Math.abs(py - obj.y) < 35) {
          playSound("explosion");
          livesRef.current -= 1;
          setLives(livesRef.current);
          objectsRef.current.splice(i, 1);
          if (livesRef.current <= 0) {
            setGameState("gameover");
          }
        }
        if (obj.y > height + 40) {
          objectsRef.current.splice(i, 1);
        }
        continue;
      }

      // Lasers
      if (obj.type === "laser") {
        obj.y -= 14;
        ctx.fillStyle = "#38BDF8";
        ctx.shadowColor = "#38BDF8";
        ctx.shadowBlur = 10;
        ctx.fillRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
        ctx.shadowBlur = 0;

        if (obj.y < 0) {
          objectsRef.current.splice(i, 1);
          continue;
        }

        // Laser vs Boss Collision
        let hit = false;
        for (let j = objectsRef.current.length - 1; j >= 0; j--) {
          const target = objectsRef.current[j];
          if (target.type === "boss") {
            if (Math.abs(obj.x - target.x) < 50 && Math.abs(obj.y - target.y) < 50) {
              playSound("boss_hit");
              hit = true;
              if (target.hp !== undefined) {
                target.hp -= 1;
                bossHpRef.current = target.hp;
                setBossHp(target.hp);

                if (target.hp <= 0) {
                  playSound("explosion");
                  scoreRef.current += 100;
                  setScore(scoreRef.current);
                  objectsRef.current.splice(j, 1);
                  setGameState("won");
                  setTimeout(() => onWin(3), 1200);
                }
              }
              break;
            }
          } else if (target.type === "enemy") {
            if (Math.abs(obj.x - target.x) < 28 && Math.abs(obj.y - target.y) < 28) {
              hit = true;
              if (target.hp !== undefined) {
                target.hp -= 1;
                playSound("shoot");

                if (target.hp <= 0) {
                  playSound("explosion");
                  scoreRef.current += (target.maxHp || 1) * 10;
                  setScore(scoreRef.current);

                  // Explosion particle
                  objectsRef.current.push({
                    id: Date.now(),
                    type: "explosion",
                    x: target.x,
                    y: target.y,
                    width: 45,
                    height: 45,
                    life: 1.0,
                  });

                  objectsRef.current.splice(j, 1);
                }
              }
              break;
            }
          }
        }

        if (hit) {
          objectsRef.current.splice(i, 1);
        }
      } else if (obj.type === "enemy") {
        obj.y += obj.vy || 2;

        // Render Enemy
        ctx.font = "42px Arial";
        ctx.textAlign = "center";
        ctx.fillText(obj.emoji || "👾", obj.x, obj.y);

        // Render mini HP bar for multi-hit enemies
        if (obj.maxHp && obj.maxHp > 1 && obj.hp) {
          const barW = 30;
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(obj.x - barW / 2, obj.y - 30, barW, 4);
          ctx.fillStyle = "#10B981";
          ctx.fillRect(obj.x - barW / 2, obj.y - 30, (obj.hp / obj.maxHp) * barW, 4);
        }

        // Player Collision
        if (Math.abs(px - obj.x) < 35 && Math.abs(py - obj.y) < 35) {
          playSound("explosion");
          livesRef.current -= 1;
          setLives(livesRef.current);
          objectsRef.current.splice(i, 1);
          if (livesRef.current <= 0) {
            setGameState("gameover");
          }
          continue;
        }

        if (obj.y > height + 40) {
          objectsRef.current.splice(i, 1);
        }
      } else if (obj.type === "explosion") {
        if (obj.life !== undefined) {
          obj.life -= 0.06;
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

    // Standard win condition for non-boss levels
    if (!isBossLevel && scoreRef.current >= 30 && gameState === "playing") {
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

  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== "playing") return;
    const x = Math.max(5, Math.min(95, (e.clientX / window.innerWidth) * 100));
    playerXRef.current = x;
  };

  return (
    <div className="fixed inset-0 bg-[#060919] overflow-hidden select-none touch-none font-sans" style={{ touchAction: "none" }} dir="rtl">
      {/* HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <button
          onClick={onQuit}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20 cursor-pointer pointer-events-auto shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 rtl:rotate-180" />
        </button>

        {/* Boss HUD Health Bar */}
        {bossHp !== null && (
          <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-2xl border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] text-center pointer-events-auto w-64">
            <div className="flex justify-between items-center text-xs font-black text-red-400 mb-1">
              <span>👾👑 البيج بوس (BIG BOSS)</span>
              <span>{bossHp} / {bossMaxHp} HP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-red-900">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-yellow-400 transition-all duration-150"
                style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 pointer-events-auto">
          <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-2xl border border-cyan-500/40 shadow-md text-cyan-300 font-black text-xl flex items-center gap-2">
            <span>👾</span> {score}
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-pink-500/40 shadow-md flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={i < lives ? "opacity-100" : "opacity-30 grayscale"}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair relative z-0" onPointerMove={handlePointerMove} />

      {/* Game Over Modal */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#111827] rounded-3xl p-8 max-w-sm w-full text-center border-4 border-red-500 shadow-2xl">
            <h2 className="text-4xl font-black text-red-500 mb-2">تحطمت سفينتك! 💥</h2>
            <p className="text-xl font-bold text-slate-300 mb-6">النقاط: {score}</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  scoreRef.current = 0;
                  livesRef.current = 3;
                  setScore(0);
                  setLives(3);
                  objectsRef.current = [];
                  if (isBossLevel) {
                    setBossHp(bossMaxHp);
                    bossHpRef.current = bossMaxHp;
                    objectsRef.current.push({
                      id: 9999,
                      type: "boss",
                      emoji: "👾👑",
                      x: window.innerWidth / 2,
                      y: 120,
                      width: 100,
                      height: 100,
                      vx: 3,
                      hp: bossMaxHp,
                      maxHp: bossMaxHp,
                    });
                  }
                  setGameState("playing");
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-full font-black text-lg shadow-lg active:scale-95"
              >
                إعادة 🔄
              </button>
              <button onClick={onQuit} className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-full font-black text-lg border border-slate-700 active:scale-95">
                خروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Win Modal */}
      {gameState === "won" && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#111827] rounded-3xl p-8 max-w-sm w-full text-center border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)]">
            <h2 className="text-4xl font-black text-yellow-300 mb-2">بطل الفضاء! 🌟</h2>
            <p className="text-lg font-bold text-slate-200 mb-6">لقد دمرت الغزاة وأنقذت المجرة!</p>
            <button
              onClick={() => onWin(3)}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 py-3.5 rounded-full font-black text-xl shadow-lg active:scale-95"
            >
              المستوى التالي 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
