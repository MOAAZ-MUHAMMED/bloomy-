import React from 'react';
import { motion } from 'framer-motion';

interface DogMascotProps {
  className?: string;
  pose?: 'idle' | 'happy' | 'waving';
}

export default function DogMascot({ className = "", pose = "idle" }: DogMascotProps) {
  // Playful bouncy and floating animations depending on the state
  const anim = pose === 'happy'
    ? { 
        y: [0, -18, 0], 
        scaleX: [1, 1.05, 0.95, 1], 
        scaleY: [1, 0.95, 1.05, 1],
        rotate: [-2, 2, -2]
      }
    : pose === 'waving'
      ? { 
          rotate: [-4, 4, -4],
          scale: [1, 1.02, 1]
        }
      : { 
          y: [0, -4, 0],
          rotate: [-1, 1, -1]
        };

  const trans = pose === 'happy'
    ? { 
        duration: 0.6, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    : pose === 'waving'
      ? { 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      : { 
          duration: 2.2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        };

  return (
    <div className={`relative flex items-center justify-center select-none overflow-visible ${className}`} style={{ overflow: 'visible' }}>
      <motion.img
        src="/dog.png"
        alt="Dog Mascot"
        className="w-full h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.15)]"
        animate={anim}
        transition={trans}
        style={{ transformOrigin: "bottom center" }}
      />
    </div>
  );
}
