import { motion } from "framer-motion";

interface MascotCharacterProps {
  pose: "welcome" | "thinking" | "talking" | "victory";
  className?: string;
}

export default function MascotCharacter({ pose, className = "" }: MascotCharacterProps) {
  // Leaf animations based on pose
  const leafLeftAnim = pose === "victory" ? { rotate: [-20, 20] } : { rotate: [-5, 5] };
  const leafRightAnim = pose === "victory" ? { rotate: [20, -20] } : { rotate: [5, -5] };
  
  const leafTransition = pose === "victory" 
    ? { repeat: 5, repeatType: "mirror" as const, duration: 0.3 } 
    : { repeat: Infinity, repeatType: "mirror" as const, duration: 0.6 };

  // Body jump animations based on pose
  const bodyAnim = pose === "victory" ? {
    y: [0, -25, 0],
    scaleX: [1, 0.85, 1],
    scaleY: [1, 1.15, 1],
  } : pose === "welcome" ? {
    y: [0, -10, 0],
    scaleX: [1, 0.95, 1],
    scaleY: [1, 1.05, 1],
  } : {
    y: [0, -4, 0],
    scaleX: [1, 0.98, 1],
    scaleY: [1, 1.02, 1],
  };

  const bodyTransition = pose === "victory" ? {
    repeat: 2, // 1 initial + 2 repeats = 3 jumps
    duration: 0.6,
    ease: "easeInOut" as const
  } : {
    repeat: Infinity,
    duration: pose === "welcome" ? 1.5 : 2.5,
    ease: "easeInOut" as const
  };

  return (
    <div className={`relative overflow-visible flex items-center justify-center select-none ${className}`} style={{ overflow: 'visible' }}>
      {/* 100% Vector SVG Green Sprout Mascot (Replaces old Boy) */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.15)]"
        animate={bodyAnim}
        transition={bodyTransition}
        style={{ transformOrigin: "50px 95px", overflow: "visible" }}
      >
        {/* Left Hand */}
        <circle cx="14" cy="65" r="6" fill="#2ECC71" stroke="#4D2B82" strokeWidth="3" />
        {/* Right Hand */}
        <circle cx="86" cy="65" r="6" fill="#2ECC71" stroke="#4D2B82" strokeWidth="3" />

        {/* Left Leaf */}
        <motion.path 
          d="M 48 35 C 30 35 30 9 30 9 C 48 9 48 35 48 35 Z" 
          fill="#81C784" 
          stroke="#4D2B82" 
          strokeWidth="3" 
          strokeLinejoin="round"
          animate={leafLeftAnim}
          transition={leafTransition}
          style={{ transformOrigin: "48px 35px" }}
        />
        {/* Right Leaf */}
        <motion.path 
          d="M 52 35 C 70 35 70 9 70 9 C 52 9 52 35 52 35 Z" 
          fill="#81C784" 
          stroke="#4D2B82" 
          strokeWidth="3" 
          strokeLinejoin="round"
          animate={leafRightAnim}
          transition={leafTransition}
          style={{ transformOrigin: "52px 35px" }}
        />

        {/* Body (Outer with shadow) */}
        <clipPath id="bodyClip">
          <circle cx="50" cy="65" r="34" />
        </clipPath>
        
        <g clipPath="url(#bodyClip)">
          {/* Base shadow color */}
          <rect x="0" y="0" width="100" height="100" fill="#27AE60" />
          {/* Main body color shifted top-left to create the beautiful inset shadow */}
          <circle cx="47" cy="47" r="34" fill="#2ECC71" />
        </g>
        
        {/* Body Stroke */}
        <circle cx="50" cy="65" r="34" fill="none" stroke="#4D2B82" strokeWidth="3" />

        {/* Eyes (Happy closed eyes for victory, open for others) */}
        {pose === "victory" ? (
          <>
            {/* Happy Eyes */}
            <path d="M 33 50 Q 38 46 43 50" fill="none" stroke="#4D2B82" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 57 50 Q 62 46 67 50" fill="none" stroke="#4D2B82" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Open Cute Eyes */}
            <circle cx="38" cy="50" r="5.5" fill="#4D2B82" />
            <circle cx="36" cy="48" r="2" fill="white" />
            
            <circle cx="62" cy="50" r="5.5" fill="#4D2B82" />
            <circle cx="60" cy="48" r="2" fill="white" />
          </>
        )}

        {/* Pink Cheeks */}
        <ellipse cx="27" cy="57" rx="5.5" ry="3.5" fill="#FF6B6B" opacity="0.6" />
        <ellipse cx="73" cy="57" rx="5.5" ry="3.5" fill="#FF6B6B" opacity="0.6" />

        {/* Smiling Mouth */}
        <mask id="mouthMask">
          <path d="M 40 60 A 10 9 0 0 0 60 60 Z" fill="white" />
        </mask>
        <path d="M 40 60 A 10 9 0 0 0 60 60 Z" fill="#4D2B82" />
        {/* Pink Tongue */}
        <circle cx="50" cy="68" r="5" fill="#FF6B6B" mask="url(#mouthMask)" />
      </motion.svg>
    </div>
  );
}
