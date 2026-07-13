import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Firefly {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const MagicalForestBackground: React.FC = () => {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [leaves, setLeaves] = useState<{ id: number, x: number, delay: number, duration: number, size: number }[]>([]);

  useEffect(() => {
    // Generate initial falling leaves
    const initialLeaves = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
      size: 15 + Math.random() * 20
    }));
    setLeaves(initialLeaves);

    // Global pointer move listener for interactive fireflies
    const handlePointerMove = (e: PointerEvent) => {
      // Limit spawn rate
      if (Math.random() > 0.3) return;
      
      const newFirefly: Firefly = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: ['#A7F3D0', '#FDE68A', '#D9F99D', '#6EE7B7'][Math.floor(Math.random() * 4)]
      };

      setFireflies(prev => [...prev.slice(-15), newFirefly]);

      // Remove firefly after 1.5 seconds
      setTimeout(() => {
        setFireflies(prev => prev.filter(f => f.id !== newFirefly.id));
      }, 1500);
    };

    window.addEventListener('pointermove', handlePointerMove);
    // Support touch devices
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
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-gradient-to-br from-[#111827] via-[#1E1B4B] to-[#064E3B]">
      {/* Background Magic Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />

      {/* Falling Leaves */}
      {leaves.map(leaf => (
        <motion.div
          key={leaf.id}
          className="absolute top-[-10%]"
          initial={{ y: '-10vh', x: `${leaf.x}vw`, rotate: 0, opacity: 0 }}
          animate={{ 
            y: '110vh', 
            x: [`${leaf.x}vw`, `${leaf.x - 8}vw`, `${leaf.x + 8}vw`, `${leaf.x}vw`],
            rotate: 360, 
            opacity: [0, 0.6, 0.6, 0] 
          }}
          transition={{
            y: { duration: leaf.duration, repeat: Infinity, ease: 'linear', delay: leaf.delay },
            x: { duration: leaf.duration / 2, repeat: Infinity, ease: 'easeInOut', delay: leaf.delay },
            rotate: { duration: leaf.duration * 0.8, repeat: Infinity, ease: 'linear' },
            opacity: { duration: leaf.duration, repeat: Infinity, ease: 'linear', delay: leaf.delay }
          }}
          style={{ width: leaf.size, height: leaf.size, filter: 'drop-shadow(0 0 3px rgba(52, 211, 153, 0.4))' }}
        >
          {/* Simple leaf SVG */}
          <svg viewBox="0 0 24 24" fill="rgba(52, 211, 153, 0.5)" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C7 2 3 7 3 12C3 17 7 22 12 22C17 22 21 17 21 12C21 7 17 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" />
            <path d="M12 4C12 4 16 8 16 12C16 16 12 20 12 20C12 20 8 16 8 12C8 8 12 4 12 4Z" fill="rgba(16, 185, 129, 0.3)" />
          </svg>
        </motion.div>
      ))}

      {/* Floating ambient fireflies */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 3,
            height: Math.random() * 4 + 3,
            backgroundColor: ['#A7F3D0', '#FDE68A', '#D9F99D', '#6EE7B7'][Math.floor(Math.random() * 4)],
            boxShadow: `0 0 12px 3px ${['#A7F3D0', '#FDE68A', '#D9F99D'][Math.floor(Math.random() * 3)]}`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -150 - 50, 0],
            x: [0, Math.random() * 150 - 75, 0],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Interactive fireflies on pointer move */}
      <AnimatePresence>
        {fireflies.map(f => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, scale: 1.5, x: f.x, y: f.y }}
            animate={{ 
              opacity: 0, 
              scale: 0, 
              y: f.y - 120, 
              x: f.x + (Math.random() * 120 - 60) 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: f.color,
              boxShadow: `0 0 15px 5px ${f.color}`,
              zIndex: 0
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
