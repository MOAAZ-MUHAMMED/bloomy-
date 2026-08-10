import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, X, Star, Home } from 'lucide-react';
import DogMascot from './DogMascot';
import MascotCharacter from './MascotCharacter';
import Rainbow3D from './Rainbow3D';
import Model3D from './Model3D';
// @ts-ignore
import owlModel from './owl.glb?url';

const VectorTree = ({ className = "w-20 h-28" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={`${className} filter drop-shadow-md select-none pointer-events-none`}>
    <path d="M46,80 L54,80 L52,120 L48,120 Z" fill="#78350F" />
    <circle cx="50" cy="55" r="28" fill="#10B981" />
    <circle cx="36" cy="65" r="20" fill="#059669" />
    <circle cx="64" cy="65" r="20" fill="#047857" />
    <circle cx="50" cy="40" r="20" fill="#34D399" />
  </svg>
);

interface Letter {
  letter: string;
  name: string;
  word: string;
  color: string;
  startSpot: { x: number; y: number };
  checkpoints: { x: number; y: number }[];
}

const ENGLISH_LETTERS: Letter[] = [
  { letter: 'A', name: 'A', word: 'Apple 🍎', color: '#EF4444', startSpot: { x: 150, y: 70 }, checkpoints: [{ x: 150, y: 70 }, { x: 100, y: 160 }, { x: 70, y: 230 }, { x: 230, y: 230 }, { x: 150, y: 160 }] },
  { letter: 'B', name: 'B', word: 'Balloon 🎈', color: '#3B82F6', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 100, y: 220 }, { x: 100, y: 70 }, { x: 180, y: 100 }, { x: 110, y: 140 }, { x: 190, y: 180 }, { x: 100, y: 220 }] },
  { letter: 'C', name: 'C', word: 'Cat 🐱', color: '#10B981', startSpot: { x: 210, y: 100 }, checkpoints: [{ x: 210, y: 100 }, { x: 140, y: 80 }, { x: 90, y: 150 }, { x: 140, y: 220 }, { x: 210, y: 200 }] },
  { letter: 'D', name: 'D', word: 'Dog 🐶', color: '#F59E0B', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 100, y: 220 }, { x: 100, y: 70 }, { x: 200, y: 110 }, { x: 200, y: 180 }, { x: 100, y: 220 }] },
  { letter: 'E', name: 'E', word: 'Elephant 🐘', color: '#8B5CF6', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 100, y: 220 }, { x: 100, y: 70 }, { x: 200, y: 70 }, { x: 100, y: 145 }, { x: 180, y: 145 }, { x: 100, y: 220 }, { x: 200, y: 220 }] },
  { letter: 'F', name: 'F', word: 'Fish 🐟', color: '#EC4899', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 100, y: 220 }, { x: 100, y: 70 }, { x: 200, y: 70 }, { x: 100, y: 145 }, { x: 180, y: 145 }] },
  { letter: 'G', name: 'G', word: 'Grapes 🍇', color: '#06B6D4', startSpot: { x: 210, y: 100 }, checkpoints: [{ x: 210, y: 100 }, { x: 140, y: 80 }, { x: 90, y: 150 }, { x: 140, y: 220 }, { x: 210, y: 220 }, { x: 210, y: 160 }, { x: 160, y: 160 }] },
  { letter: 'H', name: 'H', word: 'House 🏠', color: '#F43F5E', startSpot: { x: 90, y: 70 }, checkpoints: [{ x: 90, y: 70 }, { x: 90, y: 220 }, { x: 210, y: 70 }, { x: 210, y: 220 }, { x: 90, y: 145 }, { x: 210, y: 145 }] },
  { letter: 'I', name: 'I', word: 'Ice Cream 🍦', color: '#10B981', startSpot: { x: 150, y: 70 }, checkpoints: [{ x: 150, y: 70 }, { x: 150, y: 220 }, { x: 100, y: 70 }, { x: 200, y: 70 }, { x: 100, y: 220 }, { x: 200, y: 220 }] },
  { letter: 'J', name: 'J', word: 'Juice 🥤', color: '#EAB308', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 200, y: 70 }, { x: 150, y: 70 }, { x: 150, y: 190 }, { x: 100, y: 210 }] },
  { letter: 'K', name: 'K', word: 'Kite 🪁', color: '#D97706', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 100, y: 220 }, { x: 100, y: 145 }, { x: 200, y: 70 }, { x: 100, y: 145 }, { x: 200, y: 220 }] },
  { letter: 'L', name: 'L', word: 'Lion 🦁', color: '#6366F1', startSpot: { x: 110, y: 70 }, checkpoints: [{ x: 110, y: 70 }, { x: 110, y: 220 }, { x: 200, y: 220 }] },
  { letter: 'M', name: 'M', word: 'Monkey 🐒', color: '#FF7A00', startSpot: { x: 80, y: 220 }, checkpoints: [{ x: 80, y: 220 }, { x: 80, y: 70 }, { x: 150, y: 150 }, { x: 220, y: 70 }, { x: 220, y: 220 }] },
  { letter: 'N', name: 'N', word: 'Nest 🪹', color: '#059669', startSpot: { x: 90, y: 220 }, checkpoints: [{ x: 90, y: 220 }, { x: 90, y: 70 }, { x: 210, y: 220 }, { x: 210, y: 70 }] },
  { letter: 'O', name: 'O', word: 'Orange 🍊', color: '#A855F7', startSpot: { x: 150, y: 70 }, checkpoints: [{ x: 150, y: 70 }, { x: 90, y: 145 }, { x: 150, y: 220 }, { x: 210, y: 145 }, { x: 150, y: 70 }] },
  { letter: 'P', name: 'P', word: 'Panda 🐼', color: '#38BDF8', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 100, y: 220 }, { x: 100, y: 70 }, { x: 190, y: 100 }, { x: 100, y: 145 }] },
  { letter: 'Q', name: 'Q', word: 'Queen 👑', color: '#4B5563', startSpot: { x: 150, y: 70 }, checkpoints: [{ x: 150, y: 70 }, { x: 90, y: 145 }, { x: 150, y: 220 }, { x: 210, y: 145 }, { x: 150, y: 70 }, { x: 160, y: 160 }, { x: 220, y: 220 }] },
  { letter: 'R', name: 'R', word: 'Rabbit 🐰', color: '#EC4899', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 100, y: 220 }, { x: 100, y: 70 }, { x: 190, y: 100 }, { x: 100, y: 145 }, { x: 190, y: 220 }] },
  { letter: 'S', name: 'S', word: 'Sun ☀️', color: '#10B981', startSpot: { x: 200, y: 90 }, checkpoints: [{ x: 200, y: 90 }, { x: 140, y: 80 }, { x: 100, y: 120 }, { x: 150, y: 150 }, { x: 200, y: 180 }, { x: 140, y: 220 }, { x: 90, y: 200 }] },
  { letter: 'T', name: 'T', word: 'Tree 🌳', color: '#3B82F6', startSpot: { x: 100, y: 70 }, checkpoints: [{ x: 100, y: 70 }, { x: 200, y: 70 }, { x: 150, y: 70 }, { x: 150, y: 220 }] },
  { letter: 'U', name: 'U', word: 'Umbrella 🪂', color: '#EA580C', startSpot: { x: 90, y: 80 }, checkpoints: [{ x: 90, y: 80 }, { x: 90, y: 180 }, { x: 150, y: 220 }, { x: 210, y: 180 }, { x: 210, y: 80 }] },
  { letter: 'V', name: 'V', word: 'Violin 🎻', color: '#14B8A6', startSpot: { x: 90, y: 80 }, checkpoints: [{ x: 90, y: 80 }, { x: 150, y: 220 }, { x: 210, y: 80 }] },
  { letter: 'W', name: 'W', word: 'Watermelon 🍉', color: '#84CC16', startSpot: { x: 80, y: 80 }, checkpoints: [{ x: 80, y: 80 }, { x: 110, y: 220 }, { x: 150, y: 140 }, { x: 190, y: 220 }, { x: 220, y: 80 }] },
  { letter: 'X', name: 'X', word: 'Xylophone 🪘', color: '#EF4444', startSpot: { x: 90, y: 80 }, checkpoints: [{ x: 90, y: 80 }, { x: 210, y: 220 }, { x: 210, y: 80 }, { x: 90, y: 220 }] },
  { letter: 'Y', name: 'Y', word: 'Yo-Yo 🪀', color: '#8B5CF6', startSpot: { x: 90, y: 80 }, checkpoints: [{ x: 90, y: 80 }, { x: 150, y: 140 }, { x: 210, y: 80 }, { x: 150, y: 140 }, { x: 150, y: 220 }] },
  { letter: 'Z', name: 'Z', word: 'Zebra 🦓', color: '#F43F5E', startSpot: { x: 90, y: 80 }, checkpoints: [{ x: 90, y: 80 }, { x: 210, y: 80 }, { x: 90, y: 220 }, { x: 210, y: 220 }] }
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function EnglishLetterTracing({ onComplete, onBack }: Props) {
  const [showSplash, setShowSplash] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [traced, setTraced] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userStrokePointsRef = useRef<{ x: number; y: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const particleIdRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(Date.now());

  const currentItem = ENGLISH_LETTERS[currentIndex];

  const playPopSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  // Draw star polygon in canvas
  const drawStarShape = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // Render bubble guide and confined user drawing brush
  const drawLetterGuideAndStroke = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = '#FFFDF8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const letter = currentItem.letter;
    const strokeColor = currentItem.color;

    // Font setting
    ctx.font = '900 230px "Outfit", "Inter", "sans-serif"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 10;

    // 1. Draw thick outer shadow
    ctx.strokeStyle = strokeColor + '20';
    ctx.lineWidth = 38;
    ctx.strokeText(letter, cx, cy);

    // 2. Draw light background shape (Destination)
    ctx.fillStyle = '#FCE7F3'; // Light pink guide fill
    ctx.fillText(letter, cx, cy);

    // Draw bubble outline border
    ctx.strokeStyle = strokeColor + '50';
    ctx.lineWidth = 26;
    ctx.strokeText(letter, cx, cy);

    // 3. DRAW USER STROKE WITH MASKING (source-atop)
    if (userStrokePointsRef.current.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';

      ctx.beginPath();
      ctx.lineWidth = 28;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = strokeColor;

      const p0 = userStrokePointsRef.current[0];
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < userStrokePointsRef.current.length; i++) {
        ctx.lineTo(userStrokePointsRef.current[i].x, userStrokePointsRef.current[i].y);
      }
      ctx.stroke();

      ctx.restore();
    }

    // 4. Draw dashed centerline guide on top
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(letter, cx, cy);
    ctx.setLineDash([]);
  };

  // Animation Loop
  const animateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw letters guide + stroke
    drawLetterGuideAndStroke(ctx, canvas);

    // 1. Draw Checkpoints dots
    if (!traced && currentItem.checkpoints) {
      currentItem.checkpoints.forEach((cp, index) => {
        const isCompleted = index < activeCheckpoint;
        const isActive = index === activeCheckpoint;

        ctx.beginPath();
        ctx.arc(cp.x, cp.y, isActive ? 10 : 7, 0, Math.PI * 2);
        
        if (isCompleted) {
          ctx.fillStyle = '#10B981';
          ctx.strokeStyle = '#FFFFFF';
        } else if (isActive) {
          const pulse = 1 + Math.sin(Date.now() / 120) * 0.15;
          ctx.arc(cp.x, cp.y, 11 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = '#FBBF24';
          ctx.strokeStyle = '#FFFFFF';
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#CBD5E1';
          ctx.strokeStyle = '#FFFFFF';
        }

        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    // Adaptive Guidance Hint (Sliding yellow pointer after 4 seconds of inactivity)
    const showHint = Date.now() - lastMoveTimeRef.current > 4000;
    if (showHint && !traced && currentItem.checkpoints) {
      const start = activeCheckpoint === 0 
        ? currentItem.startSpot 
        : currentItem.checkpoints[activeCheckpoint - 1];
      const end = currentItem.checkpoints[activeCheckpoint];
      if (start && end) {
        const t = (Date.now() % 1500) / 1500;
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        
        ctx.save();
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.font = '22px sans-serif';
        ctx.fillText('👆', x, y + 20);
        ctx.restore();
      }
    }

    // 2. Update and Draw Particles
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.alpha -= 0.016;
      p.rotation += p.rotationSpeed;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      drawStarShape(ctx, p.x, p.y, 5, p.size, p.size / 2, p.color, p.alpha);
    }

    requestRef.current = requestAnimationFrame(animateCanvas);
  };

  useEffect(() => {
    lastMoveTimeRef.current = Date.now();
    if (!showSplash) {
      requestRef.current = requestAnimationFrame(animateCanvas);
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [showSplash, currentIndex, traced, activeCheckpoint]);

  const addTracingSparkle = (x: number, y: number) => {
    const colors = ['#FFD700', '#FF5A92', '#3B82F6', '#2ECC71', '#A855F7', '#FF7A00'];
    for (let i = 0; i < 3; i++) {
      particleIdRef.current += 1;
      particlesRef.current.push({
        id: particleIdRef.current,
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5 - 1.5,
        size: 6 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12
      });
    }
  };

  const spawnStarburstCelebration = () => {
    const colors = ['#FFD700', '#FBBF24', '#FCD34D', '#FFF9C4', '#F59E0B', '#60A5FA', '#34D399'];
    const canvas = canvasRef.current;
    const cx = canvas ? canvas.width / 2 : 150;
    const cy = canvas ? canvas.height / 2 : 150;

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      particleIdRef.current += 1;
      particlesRef.current.push({
        id: particleIdRef.current,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 7 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 16
      });
    }
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (traced) return;
    lastMoveTimeRef.current = Date.now();
    setIsDrawing(true);
    handlePointerDrag(e);
  };

  const handlePointerDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || traced) return;
    lastMoveTimeRef.current = Date.now();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    userStrokePointsRef.current.push({ x, y });

    addTracingSparkle(x, y);

    // Verify checkpoints sequence
    const currentCp = currentItem.checkpoints[activeCheckpoint];
    if (currentCp) {
      const distance = Math.hypot(x - currentCp.x, y - currentCp.y);
      if (distance < 28) {
        playPopSound();
        if (activeCheckpoint === currentItem.checkpoints.length - 1) {
          completeTracing();
        } else {
          setActiveCheckpoint(prev => prev + 1);
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const completeTracing = () => {
    setTraced(true);
    setIsDrawing(false);
    spawnStarburstCelebration();
    playPopSound();

    // Reward stars via parent trigger complete callback
    onComplete();
  };

  const handleNextLetter = () => {
    if (currentIndex < ENGLISH_LETTERS.length - 1) {
      userStrokePointsRef.current = [];
      setTraced(false);
      setIsDrawing(false);
      setActiveCheckpoint(0);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevLetter = () => {
    if (currentIndex > 0) {
      userStrokePointsRef.current = [];
      setTraced(false);
      setIsDrawing(false);
      setActiveCheckpoint(0);
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full select-none overflow-hidden bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd] flex flex-col p-4 z-50">
      
      {/* 1. SKY & FLOATING CLOUDS LAYERS */}
      <div className="absolute top-2 left-6 text-4xl animate-pulse pointer-events-none select-none z-10">☀️</div>
      <motion.div animate={{ x: [-150, window.innerWidth + 150] }} transition={{ duration: 55, repeat: Infinity, ease: "linear" }} className="absolute top-8 left-0 text-3xl opacity-20 pointer-events-none z-10">☁️</motion.div>
      <motion.div animate={{ x: [window.innerWidth + 150, -150] }} transition={{ duration: 42, repeat: Infinity, ease: "linear" }} className="absolute top-16 right-0 text-2xl opacity-25 pointer-events-none z-10">☁️</motion.div>
      
      {/* Floating 3D Rainbow */}
      <Rainbow3D className="absolute w-56 h-56 z-10 pointer-events-none" style={{ left: '50%', top: '10%', transform: 'translateX(-50%)' }} />

      {/* 2. BEAUTIFUL LAYERED LANDSCAPE */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-[#34D399] z-0 border-t-8 border-emerald-600 flex items-center justify-between pointer-events-none">
        <div className="absolute -top-14 left-1/4 w-72 h-32 bg-[#10B981] rounded-full opacity-60 blur-[1px]"></div>
        <div className="absolute -top-16 right-1/4 w-80 h-36 bg-[#059669] rounded-full opacity-40 blur-[1px]"></div>
        
        {/* Real Vector Trees standing on the grass */}
        <div className="absolute bottom-10 left-4 z-10 opacity-70">
          <VectorTree className="w-20 h-28" />
        </div>
        <div className="absolute bottom-12 left-16 z-10 opacity-50 scale-75">
          <VectorTree className="w-20 h-28" />
        </div>
        <div className="absolute bottom-10 right-4 z-10 opacity-70">
          <VectorTree className="w-20 h-28" />
        </div>
        <div className="absolute bottom-12 right-16 z-10 opacity-50 scale-75">
          <VectorTree className="w-20 h-28" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. WELCOME SPLASH SCREEN */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#E0F2FE] z-50 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd] pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-44 bg-[#34D399] border-t-8 border-emerald-600 pointer-events-none" />

            {/* Apple Mascot left */}
            <div className="absolute bottom-6 left-12 w-48 h-48 z-10 pointer-events-none">
              <img src="/assets/mascots/apple_mascot_css.svg" className="w-full h-full object-contain animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            {/* Dog Mascot right */}
            <div className="absolute bottom-6 right-12 w-48 h-48 z-10 pointer-events-none">
              <DogMascot pose="happy" className="w-48 h-48" />
            </div>

            <div className="relative bg-white/95 border-[6px] border-[#4D2B82] p-8 rounded-[40px] shadow-[0_12px_0_0_#4D2B82] max-w-lg z-20 flex flex-col items-center">
              <span className="text-5xl mb-4 animate-bounce">✏️</span>
              <h2 className="text-3xl font-black text-[#4D2B82] leading-tight mb-2">Magic Letter Tracing</h2>
              <p className="text-sm font-extrabold text-[#6B4E9E] mb-8">Trace English letters with puppy Boolny and shiny Apple mascot!</p>
              
              {/* Giant Glassy Start Button */}
              <button
                onClick={() => {
                  playPopSound();
                  setShowSplash(false);
                }}
                className="px-10 py-4.5 rounded-[28px] bg-gradient-to-b from-green-400 to-green-600 text-white font-black text-xl border-[4px] border-white shadow-[0_6px_0_0_#15803d,_inset_0_4px_0_rgba(255,255,255,0.4)] hover:scale-105 active:translate-y-[4px] active:shadow-[0_2px_0_0_#15803d] transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[20px]" />
                <span>Start Tracing Now! 🚀</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. MAIN GAMEPLAY PLATFORM */}
      {/* ========================================================================= */}
      {!showSplash && (
        <div className="absolute inset-0 flex flex-col justify-between items-center z-20 p-4">
          
          {/* HEADER BAR */}
          <div className="w-full flex items-center justify-between z-30">
            {/* Top-Left: Green Sprout Mascot in bubble card */}
            <div className="flex items-center gap-3 bg-white/95 border-[4px] border-white rounded-[24px] px-3.5 py-1.5 shadow-lg shadow-black/10">
              <div className="w-12 h-12 bg-emerald-100 rounded-full border-2 border-emerald-400 overflow-visible flex items-center justify-center p-1">
                <MascotCharacter pose="victory" className="w-10 h-10" />
              </div>
              <div className="text-left font-sans">
                <span className="block text-[10px] font-black text-emerald-600 leading-none">Magic Guide</span>
                <span className="text-xs font-black text-[#4D2B82]">Little Sprout</span>
              </div>
            </div>

            {/* Center: Title */}
            <div className="bg-white/95 border-[4px] border-[#4D2B82] px-6 py-2 rounded-full shadow-lg shadow-black/10 text-center">
              <h2 className="text-lg sm:text-xl font-black text-[#4D2B82]">
                Letter {currentItem.letter} - {currentItem.word}
              </h2>
            </div>

            {/* Top-Right: Home return button (Orange Glassy 3D Button) */}
            {onBack && (
              <button
                onClick={onBack}
                className="w-28 h-28 hover:scale-105 active:translate-y-[4px] active:scale-95 transition-all cursor-pointer select-none"
              >
                <svg viewBox="0 0 200 228" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="btnGrad" x1="48" y1="38" x2="152" y2="168" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFE04A"></stop>
                      <stop offset="44%" stopColor="#FFAA00"></stop>
                      <stop offset="100%" stopColor="#FF7800"></stop>
                    </linearGradient>
                    <radialGradient id="gloss" cx="34%" cy="26%" r="50%" fx="25%" fy="17%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.90"></stop>
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.20"></stop>
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                    </radialGradient>
                    <radialGradient id="rim" cx="50%" cy="50%" r="50%">
                      <stop offset="65%" stopColor="#ffffff" stopOpacity="0"></stop>
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28"></stop>
                    </radialGradient>
                    <clipPath id="cc">
                      <circle cx="100" cy="104" r="58"></circle>
                    </clipPath>
                  </defs>
                  <circle cx="100" cy="112" r="58" fill="#C04800" opacity="0.9"></circle>
                  <circle cx="100" cy="104" r="58" fill="url(#btnGrad)" stroke="white" strokeWidth="6"></circle>
                  <circle cx="100" cy="104" r="58" fill="url(#rim)" clipPath="url(#cc)"></circle>
                  <ellipse cx="78" cy="74" rx="36" ry="25" fill="url(#gloss)" clipPath="url(#cc)"></ellipse>
                  <path d="
                    M 100,83
                    Q 100,80 103,83
                    L 120,100
                    Q 123,103 123,106
                    L 123,123
                    Q 123,126 120,126
                    L 80,126
                    Q 77,126 77,123
                    L 77,106
                    Q 77,103 80,100
                    L 97,83
                    Q 100,80 100,83
                    Z
                  " fill="white"></path>
                  <rect x="92" y="112" width="16" height="14" rx="4" fill="url(#btnGrad)"></rect>
                </svg>
              </button>
            )}
          </div>

          {/* PLAYGROUND STAGE */}
          <div className="flex-grow w-full max-w-5xl flex items-center justify-between px-6 gap-2 relative">
            
            {/* Apple Mascot standing firmly on the grass */}
            <div className="hidden md:flex absolute bottom-[-16px] left-0 flex-col items-center z-20 w-44 select-none">
              <img
                src="/assets/mascots/apple_mascot_css.svg"
                alt="Apple Mascot"
                className="w-40 h-40 object-contain"
              />
              <div className="w-24 h-2 bg-black/15 rounded-full blur-[2px] mt-1"></div>
            </div>

            {/* Tracing Canvas Card */}
            <div className="flex-grow flex flex-col items-center justify-center z-10">
              <div className="relative w-80 h-80 bg-white/95 border-[6px] border-[#4D2B82] rounded-[42px] shadow-2xl overflow-hidden flex items-center justify-center cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerDrag}
                  onMouseUp={handlePointerUp}
                  onMouseLeave={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerDrag}
                  onTouchEnd={handlePointerUp}
                  className="w-full h-full touch-none select-none"
                />

                {/* Celebration stamp overlay */}
                <AnimatePresence>
                  {traced && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1.5, rotate: 0 }}
                      className="absolute text-8xl pointer-events-none z-30"
                    >
                      ✨⭐
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Guide prompt */}
              <p className="text-[11px] font-black text-rose-800 bg-white/90 border-2 border-rose-300 px-5 py-1.5 rounded-full mt-3 shadow-md">
                {traced ? 'Great! Letter completed successfully! 🌟' : '💡 Draw the letter by matching the yellow dots!'}
              </p>
            </div>

            {/* Floating 3D Owl Mascot */}
            <div className="hidden md:flex absolute bottom-[10px] right-0 flex-col items-center z-20 w-56 h-56 select-none pointer-events-none">
              <Model3D 
                src={owlModel} 
                customAnimation={traced ? "spin" : "float"} 
                className="w-full h-full" 
                scaleAdjustment={1.2}
              />
              <div className="w-24 h-2 bg-black/10 rounded-full blur-[3px] mt-0.5 animate-pulse"></div>
            </div>

            {/* Far Right Sidebar with mascot cards (exactly like in photo) */}
            <div className="hidden lg:flex flex-col gap-3.5 bg-white/40 backdrop-blur-md border border-white/60 p-3 rounded-[32px] shadow-lg">
              <div className="w-16 h-16 bg-[#e0f2fe] border-3 border-[#3b82f6] rounded-[20px] flex items-center justify-center p-1.5 shadow-md">
                <Model3D src={owlModel} customAnimation="float" className="w-full h-full" />
              </div>
              <div className="w-16 h-16 bg-[#fee2e2] border-3 border-[#ef4444] rounded-[20px] flex items-center justify-center p-1 shadow-md">
                <img src="/assets/mascots/apple_mascot_css.svg" className="w-full h-full object-contain" />
              </div>
              <div className="w-16 h-16 bg-[#d1fae5] border-3 border-[#10b981] rounded-[20px] flex items-center justify-center p-1.5 shadow-md">
                <MascotCharacter pose="victory" className="w-full h-full" />
              </div>
            </div>

          </div>

          {/* BOTTOM NAVIGATION CONTROL PANEL */}
          <div className="pb-4 z-30 flex items-center gap-6">
            
            {/* Prev Letter Arrow */}
            <button
              onClick={() => {
                playPopSound();
                handlePrevLetter();
              }}
              disabled={currentIndex === 0}
              className="w-14 h-14 rounded-full bg-gradient-to-b from-green-400 to-green-600 border-[4px] border-white shadow-[0_6px_0_0_#15803d,_inset_0_4px_0_rgba(255,255,255,0.4)] flex items-center justify-center text-white cursor-pointer hover:scale-105 active:translate-y-[4px] active:shadow-[0_2px_0_0_#15803d] disabled:opacity-50 disabled:pointer-events-none transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-full" />
              <ArrowLeft className="w-6 h-6 stroke-[3.5px]" />
            </button>

            {/* Letter tracker badge */}
            <div className="bg-white/95 border-[4px] border-[#4D2B82] px-6 py-2.5 rounded-[22px] shadow-lg flex items-center justify-center font-black text-sm text-[#4D2B82]">
              Letter {currentItem.letter} ({currentIndex + 1} of {ENGLISH_LETTERS.length})
            </div>

            {/* Next Letter Arrow */}
            <button
              onClick={() => {
                playPopSound();
                handleNextLetter();
              }}
              disabled={currentIndex === ENGLISH_LETTERS.length - 1}
              className="w-14 h-14 rounded-full bg-gradient-to-b from-green-400 to-green-600 border-[4px] border-white shadow-[0_6px_0_0_#15803d,_inset_0_4px_0_rgba(255,255,255,0.4)] flex items-center justify-center text-white cursor-pointer hover:scale-105 active:translate-y-[4px] active:shadow-[0_2px_0_0_#15803d] disabled:opacity-50 disabled:pointer-events-none transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-full" />
              <ArrowRight className="w-6 h-6 stroke-[3.5px]" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
