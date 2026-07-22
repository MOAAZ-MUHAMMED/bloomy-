import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// --- Confetti / Sparkle Effect Component ---
const ConfettiExplosion = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 2, 0],
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400 - 100,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        >
          {['✨', '🌟', '🎨', '🎉'][i % 4]}
        </motion.div>
      ))}
    </div>
  );
};

interface DrawingNeonArtProps {
  onComplete: () => void;
  onBack?: () => void;
}

const COLORS = [
  { id: 'pink', value: '#ff00ff', glow: 'rgba(255,0,255,0.8)' },
  { id: 'cyan', value: '#00ffff', glow: 'rgba(0,255,255,0.8)' },
  { id: 'green', value: '#39ff14', glow: 'rgba(57,255,20,0.8)' },
  { id: 'yellow', value: '#ffff00', glow: 'rgba(255,255,0,0.8)' },
  { id: 'white', value: '#ffffff', glow: 'rgba(255,255,255,0.8)' }
];

export default function DrawingNeonArt({ onComplete, onBack }: DrawingNeonArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeColor, setActiveColor] = useState(COLORS[0].value);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set internal resolution
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initial black background fill
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
    
    // Ensure pen clicks register as dots
    draw(e);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Neon Style config
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeColor;
    
    // The Neon Glow Magic
    ctx.shadowBlur = 15;
    ctx.shadowColor = activeColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Draw again slightly thinner and whiter in the center for super intense neon core
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.stroke();
    
    // Reset path so we don't redraw from start on next move
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#0f172a'; // slate-900
    // Disable shadow when clearing
    ctx.shadowBlur = 0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    hasCompletedRef.current = false;
  };

  const handleFinishDrawing = () => {
    if (!hasDrawn || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
    
    setShowConfetti(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="w-full h-[100vh] sm:h-[80vh] max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative select-none flex flex-col bg-slate-900 border-4 border-slate-700" dir="rtl">
      
      {showConfetti && <ConfettiExplosion onComplete={() => setShowConfetti(false)} />}

      {/* Top Bar */}
      <div className="absolute top-4 left-0 right-0 z-50 flex justify-between px-6 items-center pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-bold flex items-center gap-2 pointer-events-auto shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          ✨ لوحة النيون السحرية ✨
        </div>
        
        {onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 flex items-center justify-center text-xl hover:bg-red-500/50 text-white hover:scale-105 active:scale-95 transition-all pointer-events-auto"
          >
            ✖
          </button>
        )}
      </div>

      {/* Drawing Canvas */}
      <div className="flex-1 w-full relative touch-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
          onPointerCancel={stopDrawing}
        />
        
        {/* Placeholder text if empty */}
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <h2 className="text-4xl md:text-6xl font-black text-white mix-blend-overlay">ارسم هنا...</h2>
          </div>
        )}
      </div>

      {/* Bottom Tools Toolbar */}
      <div className="h-24 bg-slate-800/90 backdrop-blur-lg border-t border-slate-700 flex items-center justify-between px-4 sm:px-8 z-20">
        
        {/* Colors */}
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveColor(c.value)}
              className={`w-12 h-12 rounded-full transition-all flex-shrink-0 ${activeColor === c.value ? 'scale-125 border-4 border-white' : 'scale-100 border-2 border-transparent hover:scale-110'}`}
              style={{ 
                backgroundColor: c.value, 
                boxShadow: activeColor === c.value ? `0 0 15px ${c.glow}` : 'none' 
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 items-center">
          <button 
            onClick={clearCanvas}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-bold transition-colors border border-slate-600 flex items-center gap-2"
          >
            🗑️ مسح
          </button>
          <button 
            onClick={handleFinishDrawing}
            disabled={!hasDrawn}
            className={`px-6 py-3 rounded-xl font-black text-white shadow-lg transition-all border-2 border-white/20
              ${hasDrawn 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] cursor-pointer' 
                : 'bg-slate-600 opacity-50 cursor-not-allowed'}`}
          >
            أنهيت رسمتي! 🌟
          </button>
        </div>

      </div>

    </div>
  );
}
