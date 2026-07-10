import React, { useState, useEffect, useCallback, useRef } from "react";
import { audioSystem } from "@/utils/audio";
import { Play, Pause, RotateCcw, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface SnakeGameProps {
  onClose: () => void;
  embedded?: boolean;
}

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 120; // ms

export default function SnakeGame({ onClose, embedded = false }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [dir, setDir] = useState<Point>({ x: 0, y: -1 }); // Moving UP initially
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("aether_snake_highscore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random food coordinate, ensuring it doesn't land on the snake body
  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDir({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    audioSystem.playSuccess();
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const nextHead = {
        x: (head.x + dir.x + GRID_SIZE) % GRID_SIZE, // Wrapping boundaries
        y: (head.y + dir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      const selfCollision = prevSnake.some(
        (segment, index) => index > 0 && segment.x === nextHead.x && segment.y === nextHead.y
      );

      if (selfCollision) {
        setGameOver(true);
        setIsPlaying(false);
        audioSystem.playError();
        return prevSnake;
      }

      const nextSnake = [nextHead, ...prevSnake];

      // Check if food eaten
      if (nextHead.x === food.x && nextHead.y === food.y) {
        audioSystem.playKeyPress(true); // Treat eating food as a heavy sound clack
        setScore((prev) => {
          const nextScore = prev + 10;
          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem("aether_snake_highscore", nextScore.toString());
          }
          return nextScore;
        });
        setFood(generateFood(prevSnake));
      } else {
        nextSnake.pop(); // Remove tail segment
      }

      return nextSnake;
    });
  }, [dir, food, gameOver, isPlaying, highScore, generateFood]);

  // Game loop interval ticker
  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameIntervalRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    }
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [isPlaying, gameOver, moveSnake]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid scrolling the window when arrow keys are pressed
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.code === "Space" || e.code === "Enter") {
          resetGame();
        }
        return;
      }

      if (!isPlaying) {
        if (e.code === "Space" || e.code === "Enter") {
          setIsPlaying(true);
        }
        return;
      }

      switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
          if (dir.y !== 1) setDir({ x: 0, y: -1 });
          break;
        case "s":
        case "S":
        case "ArrowDown":
          if (dir.y !== -1) setDir({ x: 0, y: 1 });
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          if (dir.x !== 1) setDir({ x: -1, y: 0 });
          break;
        case "d":
        case "D":
        case "ArrowRight":
          if (dir.x !== -1) setDir({ x: 1, y: 0 });
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dir, gameOver, isPlaying, resetGame, onClose]);

  // Helper to change direction via UI buttons
  const changeDir = (newDir: Point, oppositeAxis: "x" | "y") => {
    if (gameOver || !isPlaying) return;
    if (oppositeAxis === "x" && dir.x !== 0) return;
    if (oppositeAxis === "y" && dir.y !== 0) return;
    setDir(newDir);
    audioSystem.playKeyPress();
  };

  return (
    <div className={`flex flex-col items-center bg-black/95 text-terminal-text border border-terminal-text/30 p-4 rounded-lg select-none ${embedded ? "w-full max-w-md" : "w-full max-w-lg mx-auto shadow-2xl glow-border"}`}>
      {/* Title Header */}
      <div className="flex justify-between items-center w-full mb-3 pb-2 border-b border-terminal-text/20">
        <div className="flex items-center gap-2">
          <span className="animate-pulse">■</span>
          <span className="font-bold tracking-widest font-mono text-sm">GRID_SNAKE.EXE</span>
        </div>
        {!embedded && (
          <button
            onClick={onClose}
            className="hover:bg-terminal-text hover:text-terminal-bg p-1 rounded transition duration-200"
            title="Exit game"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Info Stats */}
      <div className="flex justify-between w-full font-mono text-xs mb-3 text-terminal-text/80 px-1">
        <div>SCORE: <span className="text-white font-bold">{score}</span></div>
        <div>HIGH SCORE: <span className="text-white font-bold">{highScore}</span></div>
      </div>

      {/* Grid Canvas */}
      <div className="relative border-2 border-terminal-text/40 bg-terminal-bg/50 overflow-hidden w-full aspect-square max-w-[320px]">
        {/* Render Grid cells */}
        <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`w-full h-full flex items-center justify-center transition-all duration-75 text-[8px] font-mono
                  ${isHead ? "bg-terminal-text text-terminal-bg font-extrabold" : ""}
                  ${isBody ? "bg-terminal-text/40 border-[0.5px] border-black/40" : ""}
                  ${isFood ? "bg-red-500 animate-pulse rounded-full" : ""}
                `}
              >
                {isHead && "■"}
              </div>
            );
          })}
        </div>

        {/* Overlays (Start/Paused/GameOver) */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
            <h3 className="font-bold text-sm mb-2 uppercase tracking-wider text-white">SNAKE COMPILED</h3>
            <p className="text-[10px] text-terminal-text/70 mb-4 max-w-[200px]">
              Use Arrows/WASD keys to change heading direction. Wrap borders.
            </p>
            <button
              onClick={() => {
                setIsPlaying(true);
                audioSystem.playSuccess();
              }}
              className="flex items-center gap-2 px-4 py-2 border border-terminal-text hover:bg-terminal-text hover:text-terminal-bg font-mono text-xs font-bold transition duration-200 cursor-pointer"
            >
              <Play size={14} /> START_SNAKE
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-4">
            <h3 className="font-bold text-lg mb-1 tracking-widest text-red-500 animate-bounce">GAME OVER</h3>
            <p className="text-[10px] text-white/80 mb-4">FINAL SCORE: {score}</p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-mono text-xs font-bold transition duration-200 cursor-pointer"
            >
              <RotateCcw size={14} /> RUN_AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Retro D-Pad controls for touch devices / click navigation */}
      <div className="flex flex-col items-center gap-1 mt-4">
        <button
          onClick={() => changeDir({ x: 0, y: -1 }, "y")}
          className="p-2 border border-terminal-text/20 hover:bg-terminal-text/25 active:scale-95 rounded cursor-pointer"
        >
          <ArrowUp size={16} />
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => changeDir({ x: -1, y: 0 }, "x")}
            className="p-2 border border-terminal-text/20 hover:bg-terminal-text/25 active:scale-95 rounded cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              audioSystem.playKeyPress();
            }}
            className="p-2 border border-terminal-text/20 hover:bg-terminal-text/25 active:scale-95 rounded flex items-center justify-center cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => changeDir({ x: 1, y: 0 }, "x")}
            className="p-2 border border-terminal-text/20 hover:bg-terminal-text/25 active:scale-95 rounded cursor-pointer"
          >
            <ArrowRight size={16} />
          </button>
        </div>
        <button
          onClick={() => changeDir({ x: 0, y: 1 }, "y")}
          className="p-2 border border-terminal-text/20 hover:bg-terminal-text/25 active:scale-95 rounded cursor-pointer"
        >
          <ArrowDown size={16} />
        </button>
      </div>

      <div className="mt-4 font-mono text-[9px] text-terminal-text/50 text-center">
        PRESS ESCAPE TO TERMINATE COMPILATION
      </div>
    </div>
  );
}
