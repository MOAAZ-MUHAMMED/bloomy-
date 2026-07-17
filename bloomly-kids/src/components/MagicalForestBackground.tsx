import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bubble {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const MagicalForestBackground: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [floatingStars, setFloatingStars] = useState<{ id: number, x: number, delay: number, duration: number, size: number }[]>([]);

  useEffect(() => {
    // Reduce floating stars from 20 to 8 for performance
    const initialStars = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
      size: 15 + Math.random() * 20
    }));
    setFloatingStars(initialStars);

    let lastMoveTime = 0;
    const handlePointerMove = (e: PointerEvent) => {
      // Throttle pointer move to max 1 bubble per 150ms
      const now = Date.now();
      if (now - lastMoveTime < 150) return;
      lastMoveTime = now;
      
      const newBubble: Bubble = {
        id: now + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: ['#FDE047', '#F472B6', '#60A5FA', '#34D399'][Math.floor(Math.random() * 4)]
      };

      setBubbles(prev => [...prev.slice(-6), newBubble]); // keep only last 7 bubbles

      setTimeout(() => {
        setBubbles(prev => prev.filter(f => f.id !== newBubble.id));
      }, 1500);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handlePointerMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY } as PointerEvent);
      }
    });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', () => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fdf4ff] via-[#fff1f2] to-[#fce7f3]">
      {/* Sunbeams - simplified */}
      <div className="absolute top-0 right-0 w-[150%] h-[150%] origin-top-right animate-spin-slow opacity-20" style={{
        background: 'conic-gradient(from 0deg at 100% 0%, transparent 0deg, rgba(253, 224, 71, 0.3) 15deg, transparent 30deg, rgba(253, 224, 71, 0.3) 45deg, transparent 60deg, rgba(253, 224, 71, 0.3) 75deg, transparent 90deg)',
      }} />

      {/* Background Soft Glows - reduced blur to blur-3xl (64px) for better performance */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute top-[30%] left-[40%] w-[50%] h-[50%] rounded-full bg-yellow-200/40 blur-3xl" />

      {/* Hot Air Balloons */}
      <motion.div
        className="absolute top-[20%]"
        initial={{ x: '-20vw' }}
        animate={{ x: '120vw', y: [0, -20, 0] }}
        transition={{ x: { duration: 60, repeat: Infinity, ease: "linear" }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="text-6xl drop-shadow-sm">🎈</span>
      </motion.div>
      <motion.div
        className="absolute top-[40%]"
        initial={{ x: '120vw' }}
        animate={{ x: '-20vw', y: [0, 30, 0] }}
        transition={{ x: { duration: 80, repeat: Infinity, ease: "linear", delay: 10 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        style={{ transform: 'scaleX(-1)' }}
      >
        <span className="text-7xl drop-shadow-sm">🎈</span>
      </motion.div>

      {/* Floating Stars and Magic Shapes - reduced drop shadows */}
      {floatingStars.map(star => (
        <motion.div
          key={star.id}
          className="absolute top-[-10%]"
          initial={{ y: '110vh', x: `${star.x}vw`, rotate: 0, opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            x: [`${star.x}vw`, `${star.x - 8}vw`, `${star.x + 8}vw`, `${star.x}vw`],
            rotate: 360, 
            opacity: [0, 0.8, 0.8, 0] 
          }}
          transition={{
            y: { duration: star.duration, repeat: Infinity, ease: 'linear', delay: star.delay },
            x: { duration: star.duration / 2, repeat: Infinity, ease: 'easeInOut', delay: star.delay },
            rotate: { duration: star.duration * 0.8, repeat: Infinity, ease: 'linear' },
            opacity: { duration: star.duration, repeat: Infinity, ease: 'linear', delay: star.delay }
          }}
          style={{ width: star.size, height: star.size }}
        >
          {star.id % 2 === 0 ? (
            <svg viewBox="0 0 24 24" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          ) : (
            <div className="w-full h-full rounded-full bg-white/60 shadow-sm" />
          )}
        </motion.div>
      ))}

      {/* Floating ambient bubbles - reduced from 30 to 12 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute rounded-full border border-white/50 backdrop-blur-sm"
          style={{
            width: Math.random() * 15 + 10,
            height: Math.random() * 15 + 10,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -200 - 100, 0],
            x: [0, Math.random() * 150 - 75, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Interactive magical dust / bubbles on pointer move - simplified */}
      <AnimatePresence>
        {bubbles.map(b => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0.8, scale: 0, x: b.x, y: b.y }}
            animate={{ 
              opacity: 0, 
              scale: 1.5, 
              y: b.y - 100, 
              x: b.x + (Math.random() * 60 - 30) 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed rounded-full"
            style={{
              width: 10,
              height: 10,
              backgroundColor: b.color,
              zIndex: 0
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
