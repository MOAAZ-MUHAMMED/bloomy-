import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  level?: number;
  onComplete: () => void;
  onBack?: () => void;
}

const shapesData = [
  { // Level 1: Butterfly
    name: 'فراشة (Butterfly)',
    color: '#f472b6',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.ellipse(150, 150, 10, 40, 0, 0, 2 * Math.PI);
      ctx.fillStyle = '#a78bfa'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(140, 130); ctx.bezierCurveTo(50, 50, 20, 150, 140, 150);
      ctx.moveTo(140, 150); ctx.bezierCurveTo(40, 180, 60, 250, 145, 170); ctx.stroke();
    },
    drawRightDash: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(160, 130); ctx.bezierCurveTo(250, 50, 280, 150, 160, 150);
      ctx.moveTo(160, 150); ctx.bezierCurveTo(260, 180, 240, 250, 155, 170); ctx.stroke();
    }
  },
  { // Level 2: Apple
    name: 'تفاحة (Apple)',
    color: '#ef4444',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 80); ctx.bezierCurveTo(50, 50, 50, 220, 150, 250); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(150, 80); ctx.quadraticCurveTo(130, 50, 150, 40); ctx.strokeStyle = '#22c55e'; ctx.stroke();
    },
    drawRightDash: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 80); ctx.bezierCurveTo(250, 50, 250, 220, 150, 250); ctx.stroke();
    }
  },
  { // Level 3: Heart
    name: 'قلب (Heart)',
    color: '#ec4899',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 100); ctx.bezierCurveTo(50, 0, 0, 150, 150, 250); ctx.stroke();
    },
    drawRightDash: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 100); ctx.bezierCurveTo(250, 0, 300, 150, 150, 250); ctx.stroke();
    }
  },
  { // Level 4: House
    name: 'منزل (House)',
    color: '#3b82f6',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 50); ctx.lineTo(50, 150); ctx.lineTo(150, 150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(70, 150); ctx.lineTo(70, 250); ctx.lineTo(150, 250); ctx.stroke();
    },
    drawRightDash: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 50); ctx.lineTo(250, 150); ctx.lineTo(150, 150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(230, 150); ctx.lineTo(230, 250); ctx.lineTo(150, 250); ctx.stroke();
    }
  },
  { // Level 5: Rocket
    name: 'صاروخ (Rocket)',
    color: '#8b5cf6',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 30); ctx.quadraticCurveTo(80, 100, 100, 220); ctx.lineTo(150, 220); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(100, 180); ctx.lineTo(50, 250); ctx.lineTo(100, 220); ctx.stroke();
    },
    drawRightDash: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 30); ctx.quadraticCurveTo(220, 100, 200, 220); ctx.lineTo(150, 220); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(200, 180); ctx.lineTo(250, 250); ctx.lineTo(200, 220); ctx.stroke();
    }
  },
  { // Level 6: Ice Cream
    name: 'آيس كريم (Ice Cream)',
    color: '#f59e0b',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 260); ctx.lineTo(70, 130); ctx.lineTo(150, 130); ctx.stroke();
      ctx.beginPath(); ctx.arc(150, 130, 60, Math.PI, 1.5 * Math.PI); ctx.stroke();
    },
    drawRightDash: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 260); ctx.lineTo(230, 130); ctx.lineTo(150, 130); ctx.stroke();
      ctx.beginPath(); ctx.arc(150, 130, 60, 1.5 * Math.PI, 2 * Math.PI); ctx.stroke();
    }
  },
  { // Level 7: Tree
    name: 'شجرة (Tree)',
    color: '#22c55e',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 260); ctx.lineTo(120, 260); ctx.lineTo(130, 180); ctx.stroke();
      ctx.beginPath(); ctx.arc(150, 120, 70, Math.PI, 1.5 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(100, 150, 40, 0.5 * Math.PI, 1.5 * Math.PI); ctx.stroke();
    },
    drawRightDash: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 260); ctx.lineTo(180, 260); ctx.lineTo(170, 180); ctx.stroke();
      ctx.beginPath(); ctx.arc(150, 120, 70, 1.5 * Math.PI, 2 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(200, 150, 40, 1.5 * Math.PI, 2.5 * Math.PI); ctx.stroke();
    }
  },
  { // Level 8: Star
    name: 'نجمة (Star)',
    color: '#eab308',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 30); ctx.lineTo(110, 110); ctx.lineTo(20, 120); ctx.lineTo(90, 180); ctx.lineTo(70, 270); ctx.lineTo(150, 220); ctx.stroke();
    },
    drawRightDash: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath(); ctx.moveTo(150, 30); ctx.lineTo(190, 110); ctx.lineTo(280, 120); ctx.lineTo(210, 180); ctx.lineTo(230, 270); ctx.lineTo(150, 220); ctx.stroke();
    }
  }
];

export default function DrawingSymmetry({ level = 1, onComplete, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const shapeIndex = (level - 1) % shapesData.length;
  const currentShape = shapesData[shapeIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentShape.color;
    
    currentShape.drawLeft(ctx);
    
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#e2e8f0';
    currentShape.drawRightDash(ctx);
    
    ctx.setLineDash([]);
  }, [level, currentShape]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    
    if (progress > 30 && !done) {
      setDone(true);
      setTimeout(onComplete, 1500);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || done) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentShape.color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (x > 150) {
      setProgress(p => p + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 flex flex-col items-center justify-center font-sans touch-none p-4" dir="rtl">
      {onBack && (
        <button onClick={onBack} className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg text-[#E01E5A] hover:bg-red-50 hover:scale-105 transition-all z-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-[#4D2B82] mb-3 drop-shadow-sm">رسم النصف الآخر 🎨</h1>
        <p className="text-lg font-bold text-gray-600">ارسم النصف المفقود ليطابق النصف الأول!</p>
        <span className="inline-block mt-3 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
          مستوى {level}: {currentShape.name}
        </span>
      </div>
      
      <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_15px_40px_-10px_rgba(77,43,130,0.3)] relative border-4 border-purple-100">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="rounded-2xl cursor-crosshair bg-slate-50"
        />
        {done && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center text-7xl bg-white/70 backdrop-blur-sm rounded-[2rem]"
          >
            ✨🎉✨
          </motion.div>
        )}
      </div>
      
      <div className="mt-10 text-purple-500 font-extrabold bg-white/80 px-6 py-3 rounded-full shadow-sm animate-pulse text-sm md:text-base border-2 border-purple-100">
        💡 تتبع الخطوط المتقطعة لإكمال الرسمة!
      </div>
    </div>
  );
}
