import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function DrawingSymmetry({ onComplete, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw left half of butterfly
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#f472b6'; // pink-400
    
    // Draw body
    ctx.beginPath();
    ctx.ellipse(150, 150, 10, 40, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#a78bfa'; // purple-400
    ctx.fill();
    ctx.stroke();

    // Draw left wings
    ctx.beginPath();
    ctx.moveTo(140, 130);
    ctx.bezierCurveTo(50, 50, 20, 150, 140, 150);
    ctx.moveTo(140, 150);
    ctx.bezierCurveTo(40, 180, 60, 250, 145, 170);
    ctx.stroke();
    
    // Guide line for right side
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(160, 130);
    ctx.bezierCurveTo(250, 50, 280, 150, 160, 150);
    ctx.moveTo(160, 150);
    ctx.bezierCurveTo(260, 180, 240, 250, 155, 170);
    ctx.stroke();
    
    ctx.setLineDash([]);
  }, []);

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
    
    if (progress > 50 && !done) {
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
    ctx.strokeStyle = '#f472b6';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (x > 150) {
      setProgress(p => p + 1);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center font-sans touch-none">
      {onBack && (
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md text-yellow-500 hover:text-yellow-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      )}
      <h1 className="text-4xl font-bold text-pink-400 mb-8">Draw the Missing Half 🦋</h1>
      
      <div className="bg-white p-4 rounded-3xl shadow-xl relative">
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
          className="border-2 border-pink-100 rounded-2xl cursor-crosshair"
        />
        {done && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center text-6xl bg-white/50 rounded-2xl"
          >
            ✨
          </motion.div>
        )}
      </div>
      
      <div className="mt-8 text-gray-400 font-medium">Trace the dashed lines!</div>
    </div>
  );
}
