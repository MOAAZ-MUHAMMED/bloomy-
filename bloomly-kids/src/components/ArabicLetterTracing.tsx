import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

const LETTERS_POOL = [
  { letter: 'أ', name: 'ألف', word: 'أسد 🦁', color: '#FF5A92' },
  { letter: 'ب', name: 'باء', word: 'بطة 🦆', color: '#5BC0F8' },
  { letter: 'ت', name: 'تاء', word: 'تفاحة 🍎', color: '#2ECC71' },
  { letter: 'ث', name: 'ثاء', word: 'ثعلب 🦊', color: '#FFD700' },
  { letter: 'ج', name: 'جيم', word: 'جمل 🐪', color: '#A855F7' },
  { letter: 'ح', name: 'حاء', word: 'حصان 🐴', color: '#FF9F29' },
  { letter: 'خ', name: 'خاء', word: 'خاروف 🐑', color: '#10B981' },
  { letter: 'د', name: 'دال', word: 'دبدوب 🧸', color: '#EC4899' },
  { letter: 'ذ', name: 'ذال', word: 'ذئب 🐺', color: '#6366F1' },
  { letter: 'ر', name: 'راء', word: 'رمان 🍎', color: '#F43F5E' }
];

export default function ArabicLetterTracing({ onComplete, onBack }: Props) {
  const [sessionLetters, setSessionLetters] = useState<typeof LETTERS_POOL>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [traced, setTraced] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const strokePointsRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    hasCompletedRef.current = false;
    const shuffled = [...LETTERS_POOL].sort(() => 0.5 - Math.random());
    setSessionLetters(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setTraced(false);
  }, []);

  const currentItem = sessionLetters[currentIndex] || LETTERS_POOL[0];

  // Draw initial background guide letter on Canvas
  const drawGuideLetter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background card color
    ctx.fillStyle = '#FFF5F5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Guide Letter Outline
    ctx.font = '900 190px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FCE7F3';
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    
    ctx.fillText(currentItem.letter, canvas.width / 2, canvas.height / 2 + 10);
    ctx.strokeText(currentItem.letter, canvas.width / 2, canvas.height / 2 + 10);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    strokePointsRef.current = 0;
    setTraced(false);
    drawGuideLetter();
  }, [currentIndex, sessionLetters]);

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

  const startPenDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (traced || hasCompletedRef.current) return;
    setIsDrawing(true);
    drawPenStroke(e);
  };

  const stopPenDraw = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const drawPenStroke = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    if (traced || hasCompletedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentItem.color;
    ctx.shadowColor = currentItem.color;
    ctx.shadowBlur = 10;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    strokePointsRef.current += 1;

    // Check if user traced enough of the letter (20+ stroke points)
    if (strokePointsRef.current >= 20 && !traced) {
      finishLetterTracing();
    }
  };

  const finishLetterTracing = () => {
    if (traced || hasCompletedRef.current) return;
    setTraced(true);
    setShowSparkles(true);
    playPopSound();

    setTimeout(() => {
      setShowSparkles(false);
      if (currentIndex + 1 < 5) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete();
        }
      }
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-purple-200 flex flex-col items-center justify-between p-4 font-sans select-none relative overflow-hidden" dir="rtl">
      
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-pink-200 flex items-center justify-center text-xl text-pink-600 hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer"
        >
          ✖
        </button>
      )}

      {/* Progress Bar (5 Letters) */}
      <div className="pt-6 z-10 flex flex-col items-center">
        <h1 className="text-3xl sm:text-5xl font-black text-rose-700 mb-2 drop-shadow-sm">تتبع الحروف بالمرسام السحري ✏️</h1>
        <p className="text-base sm:text-lg font-bold text-rose-600 mb-3">امسك القلم وارسم الحرف كاملاً على الشاشة!</p>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-6 py-2 rounded-full border-2 border-pink-300 shadow">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div 
              key={idx}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                idx < currentIndex 
                  ? 'bg-green-500 text-white scale-110' 
                  : idx === currentIndex 
                    ? 'bg-rose-500 text-white animate-bounce' 
                    : 'bg-rose-100 text-rose-400'
              }`}
            >
              {idx < currentIndex ? '✓' : idx + 1}
            </div>
          ))}
          <span className="mr-3 font-extrabold text-sm text-rose-800">الحرف {currentIndex + 1} من 5</span>
        </div>
      </div>

      {/* Real Canvas Letter Tracing Board */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-xl border-4 border-white shadow-2xl rounded-[3rem] p-6 flex flex-col items-center my-4 z-10">
        <div className="text-xl font-black text-slate-700 bg-rose-50 border-2 border-rose-200 px-6 py-1.5 rounded-full mb-4 shadow-sm">
          حرف {currentItem.name} - {currentItem.word}
        </div>

        {/* The Interactive Drawing Canvas */}
        <div className="relative w-72 h-72 border-4 border-dashed border-rose-300 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center bg-rose-50/50 cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onMouseDown={startPenDraw}
            onMouseMove={drawPenStroke}
            onMouseUp={stopPenDraw}
            onMouseLeave={stopPenDraw}
            onTouchStart={startPenDraw}
            onTouchMove={drawPenStroke}
            onTouchEnd={stopPenDraw}
            className="w-full h-full touch-none select-none"
          />

          {showSparkles && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1.6, rotate: 0 }}
              className="absolute text-7xl pointer-events-none"
            >
              ✨🌟
            </motion.div>
          )}
        </div>

        <div className="flex gap-3 mt-4 w-full justify-center">
          <button
            onClick={drawGuideLetter}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-full border border-slate-300 transition-all cursor-pointer"
          >
            🧹 مسح وإعادة
          </button>
          
          <button
            onClick={finishLetterTracing}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-sm rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white"
          >
            {traced ? 'تم التتبع! ✅' : 'أكملت الرسمة ✨'}
          </button>
        </div>
      </div>

    </div>
  );
}
