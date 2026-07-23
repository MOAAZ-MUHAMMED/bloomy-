import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  level?: number;
  onComplete: () => void;
  onBack?: () => void;
}

// Each shape = { name, color, leftPath (SVG-like on canvas), rightDashPath }
// All shapes drawn symmetrically around x=200 (center of 400px canvas)
const shapesData = [
  { // Level 1: Butterfly
    name: 'فراشة 🦋',
    color: '#f472b6',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 3; ctx.strokeStyle = '#f472b6'; ctx.fillStyle = '#fce7f3';
      // Body
      ctx.beginPath(); ctx.ellipse(200, 160, 8, 35, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      // Top wing
      ctx.beginPath(); ctx.moveTo(192, 135); ctx.bezierCurveTo(120, 70, 80, 140, 192, 160); ctx.fill(); ctx.stroke();
      // Bottom wing
      ctx.beginPath(); ctx.moveTo(192, 160); ctx.bezierCurveTo(90, 180, 110, 240, 192, 185); ctx.fill(); ctx.stroke();
    },
    drawRightGuide: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2; ctx.strokeStyle = '#d1d5db'; ctx.setLineDash([6, 6]);
      // Top wing
      ctx.beginPath(); ctx.moveTo(208, 135); ctx.bezierCurveTo(280, 70, 320, 140, 208, 160); ctx.stroke();
      // Bottom wing
      ctx.beginPath(); ctx.moveTo(208, 160); ctx.bezierCurveTo(310, 180, 290, 240, 208, 185); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  { // Level 2: Apple
    name: 'تفاحة 🍎',
    color: '#ef4444',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 3; ctx.strokeStyle = '#ef4444'; ctx.fillStyle = '#fee2e2';
      ctx.beginPath(); ctx.moveTo(200, 90); ctx.bezierCurveTo(100, 60, 80, 240, 200, 270); ctx.fill(); ctx.stroke();
      // Stem
      ctx.lineWidth = 3; ctx.strokeStyle = '#16a34a';
      ctx.beginPath(); ctx.moveTo(200, 90); ctx.quadraticCurveTo(180, 55, 200, 50); ctx.stroke();
    },
    drawRightGuide: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2; ctx.strokeStyle = '#d1d5db'; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(200, 90); ctx.bezierCurveTo(300, 60, 320, 240, 200, 270); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  { // Level 3: Heart
    name: 'قلب ❤️',
    color: '#ec4899',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 3; ctx.strokeStyle = '#ec4899'; ctx.fillStyle = '#fce7f3';
      ctx.beginPath(); ctx.moveTo(200, 120); ctx.bezierCurveTo(100, 20, 60, 180, 200, 270); ctx.fill(); ctx.stroke();
    },
    drawRightGuide: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2; ctx.strokeStyle = '#d1d5db'; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(200, 120); ctx.bezierCurveTo(300, 20, 340, 180, 200, 270); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  { // Level 4: House
    name: 'منزل 🏠',
    color: '#3b82f6',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 3; ctx.strokeStyle = '#3b82f6'; ctx.fillStyle = '#dbeafe';
      // Roof left
      ctx.beginPath(); ctx.moveTo(200, 70); ctx.lineTo(90, 160); ctx.lineTo(200, 160); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Wall left
      ctx.fillStyle = '#eff6ff';
      ctx.beginPath(); ctx.moveTo(110, 160); ctx.lineTo(110, 270); ctx.lineTo(200, 270); ctx.lineTo(200, 160); ctx.closePath(); ctx.fill(); ctx.stroke();
    },
    drawRightGuide: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2; ctx.strokeStyle = '#d1d5db'; ctx.setLineDash([6, 6]);
      // Roof right
      ctx.beginPath(); ctx.moveTo(200, 70); ctx.lineTo(310, 160); ctx.lineTo(200, 160); ctx.stroke();
      // Wall right
      ctx.beginPath(); ctx.moveTo(290, 160); ctx.lineTo(290, 270); ctx.lineTo(200, 270); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  { // Level 5: Rocket
    name: 'صاروخ 🚀',
    color: '#8b5cf6',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 3; ctx.strokeStyle = '#8b5cf6'; ctx.fillStyle = '#ede9fe';
      ctx.beginPath(); ctx.moveTo(200, 50); ctx.quadraticCurveTo(120, 120, 140, 240); ctx.lineTo(200, 240); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Fin
      ctx.fillStyle = '#c4b5fd';
      ctx.beginPath(); ctx.moveTo(140, 200); ctx.lineTo(90, 270); ctx.lineTo(140, 240); ctx.closePath(); ctx.fill(); ctx.stroke();
    },
    drawRightGuide: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2; ctx.strokeStyle = '#d1d5db'; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(200, 50); ctx.quadraticCurveTo(280, 120, 260, 240); ctx.lineTo(200, 240); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(260, 200); ctx.lineTo(310, 270); ctx.lineTo(260, 240); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  { // Level 6: Ice Cream
    name: 'آيس كريم 🍦',
    color: '#f59e0b',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 3; ctx.strokeStyle = '#f59e0b'; ctx.fillStyle = '#fef3c7';
      // Cone left
      ctx.beginPath(); ctx.moveTo(200, 280); ctx.lineTo(120, 150); ctx.lineTo(200, 150); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Scoop left
      ctx.fillStyle = '#fde68a';
      ctx.beginPath(); ctx.arc(200, 150, 65, Math.PI, 1.5 * Math.PI); ctx.lineTo(200, 150); ctx.closePath(); ctx.fill(); ctx.stroke();
    },
    drawRightGuide: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2; ctx.strokeStyle = '#d1d5db'; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(200, 280); ctx.lineTo(280, 150); ctx.lineTo(200, 150); ctx.stroke();
      ctx.beginPath(); ctx.arc(200, 150, 65, 1.5 * Math.PI, 2 * Math.PI); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  { // Level 7: Tree
    name: 'شجرة 🌳',
    color: '#22c55e',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      // Trunk left
      ctx.lineWidth = 3; ctx.strokeStyle = '#92400e'; ctx.fillStyle = '#d2b48c';
      ctx.beginPath(); ctx.moveTo(200, 280); ctx.lineTo(170, 280); ctx.lineTo(175, 200); ctx.lineTo(200, 200); ctx.closePath(); ctx.fill(); ctx.stroke();
      // Crown left
      ctx.fillStyle = '#dcfce7'; ctx.strokeStyle = '#22c55e';
      ctx.beginPath(); ctx.arc(200, 140, 75, Math.PI * 0.5, Math.PI * 1.5); ctx.closePath(); ctx.fill(); ctx.stroke();
    },
    drawRightGuide: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2; ctx.strokeStyle = '#d1d5db'; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(200, 280); ctx.lineTo(230, 280); ctx.lineTo(225, 200); ctx.lineTo(200, 200); ctx.stroke();
      ctx.beginPath(); ctx.arc(200, 140, 75, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  { // Level 8: Star
    name: 'نجمة ⭐',
    color: '#eab308',
    drawLeft: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 3; ctx.strokeStyle = '#eab308'; ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.moveTo(200, 50); ctx.lineTo(165, 125); ctx.lineTo(80, 135); ctx.lineTo(145, 195); ctx.lineTo(125, 280); ctx.lineTo(200, 240);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    },
    drawRightGuide: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2; ctx.strokeStyle = '#d1d5db'; ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(200, 50); ctx.lineTo(235, 125); ctx.lineTo(320, 135); ctx.lineTo(255, 195); ctx.lineTo(275, 280); ctx.lineTo(200, 240);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
];

export default function DrawingSymmetry({ level = 1, onComplete, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [done, setDone] = useState(false);
  const hasCompletedRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const shapeIndex = (level - 1) % shapesData.length;
  const currentShape = shapesData[shapeIndex];

  // Draw the reference shape (left half) and guide (right dashed half)
  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // White background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Center dividing line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 320);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw the left reference half
    currentShape.drawLeft(ctx);
    
    // Draw the right dashed guide
    currentShape.drawRightGuide(ctx);
  }, [currentShape]);

  useEffect(() => {
    drawGuide();
    setStrokeCount(0);
    setDone(false);
    hasCompletedRef.current = false;
    lastPosRef.current = null;
  }, [level, drawGuide]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX: number, clientY: number;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (done) return;
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    lastPosRef.current = pos;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || done) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getPos(e);
    if (!pos || !lastPosRef.current) return;

    // Only allow drawing on the RIGHT side (x > 200)
    if (pos.x > 180) {
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentShape.color;
      ctx.setLineDash([]);
      
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    
    lastPosRef.current = pos;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setStrokeCount(prev => prev + 1);
    }
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  // Check completion based on strokes
  useEffect(() => {
    if (strokeCount >= 3 && !done && !hasCompletedRef.current) {
      // After 3+ pen lifts, show "done" button
    }
  }, [strokeCount, done]);

  const handleFinish = () => {
    if (done || hasCompletedRef.current || strokeCount < 1) return;
    hasCompletedRef.current = true;
    setDone(true);
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const actx = new AudioContext();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046, actx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.4);
      osc.connect(gain); gain.connect(actx.destination);
      osc.start(); osc.stop(actx.currentTime + 0.5);
    } catch(e) {}

    setTimeout(() => onComplete(), 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center font-sans touch-none p-4" dir="rtl">
      {onBack && (
        <button onClick={onBack} className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg text-[#E01E5A] hover:bg-red-50 hover:scale-105 transition-all z-50 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      )}
      
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-black text-[#4D2B82] mb-2 drop-shadow-sm">رسم النصف الآخر 🎨</h1>
        <p className="text-base font-bold text-gray-500">ارسم النصف المفقود ليطابق النصف الأول!</p>
        <span className="inline-block mt-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
          المستوى {level}: {currentShape.name}
        </span>
      </div>
      
      <div className="bg-white p-4 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(77,43,130,0.3)] relative border-4 border-purple-100">
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="rounded-2xl cursor-crosshair bg-slate-50 max-w-full"
          style={{ touchAction: 'none' }}
        />
        
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-[2rem] z-20"
            >
              <div className="text-center">
                <div className="text-7xl mb-4">✨🎉✨</div>
                <p className="text-2xl font-black text-purple-700">ممتاز! رسمة رائعة!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => { drawGuide(); setStrokeCount(0); setDone(false); hasCompletedRef.current = false; lastPosRef.current = null; }}
          className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-bold shadow-md border-2 border-purple-200 hover:bg-purple-50 transition-all cursor-pointer"
        >
          🧹 مسح وإعادة
        </button>
        {strokeCount >= 1 && !done && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleFinish}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-green-300"
          >
            ✅ أنهيت رسمتي!
          </motion.button>
        )}
      </div>
      
      <div className="mt-6 text-purple-400 font-extrabold bg-white/80 px-6 py-3 rounded-full shadow-sm text-sm border-2 border-purple-100">
        💡 ارسم على الجزء الأيمن (المنقّط) لإكمال الرسمة!
      </div>
    </div>
  );
}
