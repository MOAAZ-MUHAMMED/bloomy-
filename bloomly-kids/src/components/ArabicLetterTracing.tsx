import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, X, Star } from 'lucide-react';

interface Letter {
  letter: string;
  name: string;
  word: string;
  color: string;
  startSpot: { x: number; y: number };
}

const ARABIC_LETTERS: Letter[] = [
  { letter: 'أ', name: 'ألف', word: 'أسد 🦁', color: '#EF4444', startSpot: { x: 150, y: 70 } },
  { letter: 'ب', name: 'باء', word: 'بطة 🦆', color: '#3B82F6', startSpot: { x: 80, y: 160 } },
  { letter: 'ت', name: 'تاء', word: 'تفاحة 🍎', color: '#10B981', startSpot: { x: 80, y: 160 } },
  { letter: 'ث', name: 'ثاء', word: 'ثعلب 🦊', color: '#F59E0B', startSpot: { x: 80, y: 160 } },
  { letter: 'ج', name: 'جيم', word: 'جمل 🐪', color: '#8B5CF6', startSpot: { x: 220, y: 100 } },
  { letter: 'ح', name: 'حاء', word: 'حصان 🐴', color: '#EC4899', startSpot: { x: 220, y: 100 } },
  { letter: 'خ', name: 'خاء', word: 'خاروف 🐑', color: '#06B6D4', startSpot: { x: 220, y: 100 } },
  { letter: 'د', name: 'دال', word: 'دب 🧸', color: '#F43F5E', startSpot: { x: 200, y: 110 } },
  { letter: 'ذ', name: 'ذال', word: 'ذئب 🐺', color: '#10B981', startSpot: { x: 200, y: 110 } },
  { letter: 'ر', name: 'راء', word: 'رمان 🍎', color: '#EAB308', startSpot: { x: 190, y: 120 } },
  { letter: 'ز', name: 'زاي', word: 'زرافة 🦒', color: '#D97706', startSpot: { x: 190, y: 120 } },
  { letter: 'س', name: 'سين', word: 'سمكة 🐟', color: '#6366F1', startSpot: { x: 220, y: 110 } },
  { letter: 'ش', name: 'شين', word: 'شمس ☀️', color: '#FF7A00', startSpot: { x: 220, y: 110 } },
  { letter: 'ص', name: 'صاد', word: 'صقر 🦅', color: '#059669', startSpot: { x: 160, y: 130 } },
  { letter: 'ض', name: 'ضاد', word: 'ضفدع 🐸', color: '#A855F7', startSpot: { x: 160, y: 130 } },
  { letter: 'ط', name: 'طاء', word: 'طائرة ✈️', color: '#38BDF8', startSpot: { x: 120, y: 140 } },
  { letter: 'ظ', name: 'ظاء', word: 'ظرف ✉️', color: '#4B5563', startSpot: { x: 120, y: 140 } },
  { letter: 'ع', name: 'عين', word: 'عصفور 🐦', color: '#EC4899', startSpot: { x: 210, y: 100 } },
  { letter: 'غ', name: 'غين', word: 'غزال 🦌', color: '#10B981', startSpot: { x: 210, y: 100 } },
  { letter: 'ف', name: 'فاء', word: 'فيل 🐘', color: '#3B82F6', startSpot: { x: 200, y: 110 } },
  { letter: 'ق', name: 'قاف', word: 'قرد 🐒', color: '#EA580C', startSpot: { x: 200, y: 100 } },
  { letter: 'ك', name: 'كاف', word: 'كلب 🐕', color: '#14B8A6', startSpot: { x: 210, y: 90 } },
  { letter: 'ل', name: 'لام', word: 'ليمون 🍋', color: '#84CC16', startSpot: { x: 210, y: 90 } },
  { letter: 'م', name: 'ميم', word: 'موز 🍌', color: '#EF4444', startSpot: { x: 190, y: 110 } },
  { letter: 'ن', name: 'نون', word: 'نحلة 🐝', color: '#8B5CF6', startSpot: { x: 200, y: 115 } },
  { letter: 'هـ', name: 'هاء', word: 'هلال 🌙', color: '#F43F5E', startSpot: { x: 190, y: 110 } },
  { letter: 'و', name: 'واو', word: 'وردة 🌹', color: '#10B981', startSpot: { x: 200, y: 115 } },
  { letter: 'ي', name: 'ياء', word: 'يمامة 🕊️', color: '#06B6D4', startSpot: { x: 200, y: 120 } }
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

export default function ArabicLetterTracing({ onComplete, onBack }: Props) {
  const [showSplash, setShowSplash] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [traced, setTraced] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokePointsRef = useRef<number>(0);
  const userStrokePointsRef = useRef<{ x: number; y: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const particleIdRef = useRef<number>(0);
  const hasCompletedRef = useRef<boolean>(false);

  const currentItem = ARABIC_LETTERS[currentIndex];

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

  // Add draw stroke guides
  const drawLetterGuide = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear canvas background
    ctx.fillStyle = '#FFFDF8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const letter = currentItem.letter;
    const strokeColor = currentItem.color;

    // Font setting
    ctx.font = '900 220px "Outfit", "Inter", "sans-serif"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 10;

    // 1. Draw thick outer shadow
    ctx.strokeStyle = strokeColor + '30';
    ctx.lineWidth = 38;
    ctx.strokeText(letter, cx, cy);

    // 2. Draw thick bubble outline
    ctx.fillStyle = '#FCE7F3';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 26;
    ctx.strokeText(letter, cx, cy);
    ctx.fillText(letter, cx, cy);

    // 3. Draw dashed guide centerline
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(letter, cx, cy);
    ctx.setLineDash([]);
  };

  // Animation Loop (Updates drawing guide, strokes, particles)
  const animateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Redraw Guide Letter
    drawLetterGuide(ctx, canvas);

    // 2. Draw user traced stroke points
    if (userStrokePointsRef.current.length > 0) {
      ctx.beginPath();
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentItem.color;
      ctx.shadowColor = currentItem.color;
      ctx.shadowBlur = 12;

      const p0 = userStrokePointsRef.current[0];
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < userStrokePointsRef.current.length; i++) {
        ctx.lineTo(userStrokePointsRef.current[i].x, userStrokePointsRef.current[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
    }

    // 3. Draw pulsing start spot (if not traced)
    if (!traced) {
      const pulse = 1 + Math.sin(Date.now() / 150) * 0.1;
      ctx.beginPath();
      ctx.arc(currentItem.startSpot.x, currentItem.startSpot.y, 10 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#FBBF24';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 4. Update and Draw Particles
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.alpha -= 0.016; // fade
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
    if (!showSplash) {
      // Start animation loop when canvas is visible
      requestRef.current = requestAnimationFrame(animateCanvas);
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [showSplash, currentIndex, traced]);

  const addTracingSparkle = (x: number, y: number) => {
    // Generate beautiful colorful star particles following pointer
    const colors = ['#FFD700', '#FF5A92', '#3B82F6', '#2ECC71', '#A855F7', '#FF7A00'];
    for (let i = 0; i < 2; i++) {
      particleIdRef.current += 1;
      particlesRef.current.push({
        id: particleIdRef.current,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 1,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
  };

  const spawnStarburstCelebration = () => {
    // Burst of 70+ golden stars shooting outward from the center
    const colors = ['#FFD700', '#FBBF24', '#FCD34D', '#FFF9C4', '#F59E0B'];
    const canvas = canvasRef.current;
    const cx = canvas ? canvas.width / 2 : 150;
    const cy = canvas ? canvas.height / 2 : 150;

    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      particleIdRef.current += 1;
      particlesRef.current.push({
        id: particleIdRef.current,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // burst slightly upwards
        size: 6 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15
      });
    }
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (traced) return;
    setIsDrawing(true);
    userStrokePointsRef.current = [];
    strokePointsRef.current = 0;
    handlePointerDrag(e);
  };

  const handlePointerDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || traced) return;

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
    strokePointsRef.current += 1;

    addTracingSparkle(x, y);

    // If traced 26 points, trigger local completion
    if (strokePointsRef.current >= 26 && !traced) {
      completeTracing();
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

    // Reset traced status to false but don't auto-move, let arrow buttons handle it
  };

  const handleNextLetter = () => {
    if (currentIndex < ARABIC_LETTERS.length - 1) {
      userStrokePointsRef.current = [];
      strokePointsRef.current = 0;
      setTraced(false);
      setIsDrawing(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevLetter = () => {
    if (currentIndex > 0) {
      userStrokePointsRef.current = [];
      strokePointsRef.current = 0;
      setTraced(false);
      setIsDrawing(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full select-none overflow-hidden bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#e0f2fe] flex flex-col p-4">
      {/* Sky clouds layers */}
      <div className="absolute top-2 right-4 text-4xl animate-pulse pointer-events-none select-none">☀️</div>
      <motion.div animate={{ x: [-100, 500] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} className="absolute top-6 left-0 text-3xl opacity-20 pointer-events-none">☁️</motion.div>
      <motion.div animate={{ x: [500, -100] }} transition={{ duration: 38, repeat: Infinity, ease: "linear" }} className="absolute top-12 right-0 text-2xl opacity-25 pointer-events-none">☁️</motion.div>

      {/* Decorative Forest background */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#10B981] to-[#34D399] z-0 border-t-4 border-emerald-600 flex items-center justify-between px-6 pointer-events-none" />

      {/* Exit button */}
      {onBack && (
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={onBack}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-red-400 to-red-600 border-[4px] border-white shadow-[0_6px_0_0_#991b1b,_inset_0_2px_0_rgba(255,255,255,0.4)] flex items-center justify-center text-white cursor-pointer hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_0_#991b1b] transition-all"
          >
            <X className="w-7 h-7 stroke-[3px]" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. WELCOME SPLASH SCREEN */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-[#E0F2FE] z-40 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Background forest sky inside splash */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#e0f2fe] pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#10B981] to-[#34D399] border-t-4 border-emerald-600 pointer-events-none" />

            {/* Apple Mascot left */}
            <div className="absolute bottom-4 left-8 w-44 h-44 z-10 pointer-events-none">
              <img src="/assets/mascots/apple_mascot_css.svg" className="w-full h-full object-contain animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            {/* Dog Mascot right */}
            <div className="absolute bottom-4 right-8 w-44 h-44 z-10 pointer-events-none">
              <img src="/assets/mascots/dog_mascot_css.svg" className="w-full h-full object-contain animate-bounce" style={{ animationDuration: '3.5s' }} />
            </div>

            <div className="relative bg-white/95 border-[6px] border-[#4D2B82] p-8 rounded-[40px] shadow-[0_12px_0_0_#4D2B82] max-w-lg z-20 flex flex-col items-center">
              <span className="text-5xl mb-4">✏️🎨</span>
              <h2 className="text-3xl font-black text-[#4D2B82] leading-tight mb-2">تتبع الحروف السحري</h2>
              <p className="text-sm font-extrabold text-[#6B4E9E] mb-8">استمتع بتعلم كتابة الحروف مع بلومي الكلب وصديقته التفاحة المضيئة!</p>
              
              {/* Giant Glassy Start Button */}
              <button
                onClick={() => {
                  playPopSound();
                  setShowSplash(false);
                }}
                className="px-10 py-4.5 rounded-[26px] bg-gradient-to-b from-green-400 to-green-600 text-white font-black text-xl border-[5px] border-white shadow-[0_8px_0_0_#166534,_inset_0_3px_0_rgba(255,255,255,0.45)] hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_0_#166534] transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Glossy overlay reflection */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[20px]" />
                <span>ابدأ اللعب الآن 🚀</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. MAIN TRACING INTERFACE */}
      {/* ========================================================================= */}
      {!showSplash && (
        <div className="flex-grow w-full flex flex-col justify-between items-center relative z-10 select-none">
          
          {/* Top Title Board */}
          <div className="pt-2 z-20 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-[#4D2B82] drop-shadow-sm bg-white/90 border-3 border-[#4D2B82] px-6 py-2 rounded-full shadow-lg">
              تتبع حرف {currentItem.name} - {currentItem.word}
            </h2>
          </div>

          {/* Core Content Stage */}
          <div className="flex-grow w-full max-w-4xl flex items-center justify-between px-6 gap-6 relative">
            
            {/* Apple Mascot on the left */}
            <div className="hidden md:flex flex-col items-center z-10 w-40 select-none">
              <img
                src="/assets/mascots/apple_mascot_css.svg"
                alt="Apple Mascot"
                className="w-40 h-40 object-contain animate-float-slow"
              />
              <div className="w-24 h-2.5 bg-black/10 rounded-full blur-[2px] mt-0.5"></div>
            </div>

            {/* Tracing Canvas Card */}
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="relative w-80 h-80 bg-white/95 border-[6px] border-white rounded-[36px] shadow-2xl overflow-hidden flex items-center justify-center cursor-crosshair">
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

                {/* Local Complete Celebration overlay stamp */}
                <AnimatePresence>
                  {traced && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1.5, rotate: 0 }}
                      className="absolute text-8xl pointer-events-none z-30"
                    >
                      ✨🎉
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Guide prompt */}
              <p className="text-[11px] font-black text-rose-800 bg-white/80 border border-rose-200 px-4 py-1.5 rounded-full mt-3 shadow-sm">
                {traced ? 'ممتاز! تم تتبع الحرف بنجاح! 🌟' : '💡 ابدأ التتبع من النقطة الصفراء المتوهجة!'}
              </p>
            </div>

            {/* Dog Mascot on the right */}
            <div className="hidden md:flex flex-col items-center z-10 w-40 select-none">
              <img
                src="/assets/mascots/dog_mascot_css.svg"
                alt="Dog Mascot"
                className="w-40 h-40 object-contain animate-float"
              />
              <div className="w-24 h-2.5 bg-black/10 rounded-full blur-[2px] mt-0.5"></div>
            </div>

          </div>

          {/* Bottom Navigation Buttons Panel */}
          <div className="pb-6 z-20 flex items-center gap-6">
            
            {/* Prev Arrow Button (Glassy green) */}
            <button
              onClick={() => {
                playPopSound();
                handlePrevLetter();
              }}
              disabled={currentIndex === 0}
              className="w-14 h-14 rounded-full bg-gradient-to-b from-green-400 to-green-600 border-[4px] border-white shadow-[0_6px_0_0_#166534,_inset_0_2px_0_rgba(255,255,255,0.4)] flex items-center justify-center text-white cursor-pointer hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_0_#166534] disabled:opacity-50 disabled:pointer-events-none transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-full" />
              <ArrowLeft className="w-6 h-6 stroke-[3.5px] rtl:rotate-180" />
            </button>

            {/* Letters Progress Tracker Badge */}
            <div className="bg-white/95 border-[4px] border-[#4D2B82] px-6 py-2.5 rounded-[22px] shadow-lg flex items-center justify-center font-black text-sm text-[#4D2B82]">
              الحرف {currentIndex + 1} من {ARABIC_LETTERS.length}
            </div>

            {/* Next Arrow Button (Glassy green) */}
            <button
              onClick={() => {
                playPopSound();
                handleNextLetter();
              }}
              disabled={currentIndex === ARABIC_LETTERS.length - 1}
              className="w-14 h-14 rounded-full bg-gradient-to-b from-green-400 to-green-600 border-[4px] border-white shadow-[0_6px_0_0_#166534,_inset_0_2px_0_rgba(255,255,255,0.4)] flex items-center justify-center text-white cursor-pointer hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_0_#166534] disabled:opacity-50 disabled:pointer-events-none transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-full" />
              <ArrowRight className="w-6 h-6 stroke-[3.5px] rtl:rotate-180" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
