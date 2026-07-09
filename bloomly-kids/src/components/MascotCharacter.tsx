import { motion } from "framer-motion";

interface MascotCharacterProps {
  pose: "welcome" | "thinking" | "talking" | "victory";
  className?: string;
}

export default function MascotCharacter({ pose, className = "" }: MascotCharacterProps) {
  // Common colors from design guide
  const colors = {
    skin: "#F7C59F",
    skinShadow: "#DCA27A",
    hair: "#5A3526",
    hairOutline: "#3D2014",
    hoodie: "#1D5DBF",
    hoodieDark: "#103A78",
    hoodieLight: "#3D8BFF",
    star: "#FFD24D",
    starOutline: "#B88A00",
    jeans: "#2C3E50",
    jeansDark: "#1A252F",
    white: "#FFFFFF",
    pink: "#FF5A92"
  };

  // Determine animations based on active pose
  const rightArmAnimation = pose === "welcome"
    ? {
        rotate: [15, -45, 15],
        y: [0, -10, 0],
      }
    : pose === "victory"
    ? {
        rotate: [-140, -120, -140],
      }
    : {
        rotate: 0,
      };

  const leftArmAnimation = pose === "victory"
    ? {
        rotate: [140, 120, 140],
      }
    : {
        rotate: 0,
      };

  const headAnimation = pose === "thinking"
    ? {
        rotate: [-8, -4, -8],
      }
    : {
        rotate: [0, 2, -2, 0],
      };

  return (
    <div className={`relative overflow-visible flex items-center justify-center select-none ${className}`}>
      {/* 100% Vector SVG Mascot Boy */}
      <motion.svg
        viewBox="0 0 160 220"
        className="w-full h-full filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.15)]"
        animate={{
          y: [0, -3, 0],
          scaleY: [1, 1.02, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: "bottom center" }}
      >
        {/* Left Leg */}
        <rect
          x="62"
          y="158"
          width="15"
          height="38"
          rx="5"
          fill={colors.jeans}
          stroke={colors.jeansDark}
          strokeWidth="3.5"
        />
        {/* Left Shoe */}
        <path
          d="M 54 195 L 75 195 C 77 195 79 198 77 202 L 72 205 L 54 205 Z"
          fill={colors.hoodie}
          stroke={colors.hoodieDark}
          strokeWidth="3.5"
        />
        <rect x="52" y="202" width="23" height="4" fill={colors.white} rx="1" />

        {/* Right Leg */}
        <rect
          x="83"
          y="158"
          width="15"
          height="38"
          rx="5"
          fill={colors.jeans}
          stroke={colors.jeansDark}
          strokeWidth="3.5"
        />
        {/* Right Shoe */}
        <path
          d="M 85 195 L 106 195 C 108 195 110 198 108 202 L 103 205 L 85 205 Z"
          fill={colors.hoodie}
          stroke={colors.hoodieDark}
          strokeWidth="3.5"
        />
        <rect x="83" y="202" width="23" height="4" fill={colors.white} rx="1" />

        {/* Left Arm */}
        <motion.g
          animate={leftArmAnimation}
          transition={{ repeat: pose === "victory" ? Infinity : 0, duration: 1.2, ease: "easeInOut" }}
          style={{ transformOrigin: "55px 120px" }}
        >
          <path
            d="M 55 120 C 40 135 32 145 35 155"
            fill="none"
            stroke={colors.hoodie}
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M 55 120 C 40 135 32 145 35 155"
            fill="none"
            stroke={colors.hoodieLight}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Left Hand */}
          <circle cx="34" cy="158" r="8" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="2.5" />
        </motion.g>

        {/* Torso/Hoodie Body */}
        <rect
          x="53"
          y="108"
          width="54"
          height="54"
          rx="16"
          fill={colors.hoodie}
          stroke={colors.hoodieDark}
          strokeWidth="4"
        />
        {/* Hoodie Pocket */}
        <path
          d="M 62 138 L 98 138 Q 96 156 80 156 Q 64 156 62 138 Z"
          fill={colors.hoodieDark}
          stroke={colors.hoodieLight}
          strokeWidth="2.5"
        />
        {/* Yellow Star logo on chest */}
        <polygon
          points="80,114 83,120 89,121 85,125 86,131 80,128 74,131 75,125 71,121 77,120"
          fill={colors.star}
          stroke={colors.starOutline}
          strokeWidth="1.5"
        />
        {/* Hoodie White Strings */}
        <path d="M 74 106 Q 72 120 70 125" fill="none" stroke={colors.white} strokeWidth="3" strokeLinecap="round" />
        <path d="M 86 106 Q 88 120 90 125" fill="none" stroke={colors.white} strokeWidth="3" strokeLinecap="round" />

        {/* Right Arm */}
        <motion.g
          animate={rightArmAnimation}
          transition={{ repeat: (pose === "welcome" || pose === "victory") ? Infinity : 0, duration: 1.2, ease: "easeInOut" }}
          style={{ transformOrigin: "105px 120px" }}
        >
          <path
            d="M 105 120 C 120 135 128 145 125 155"
            fill="none"
            stroke={colors.hoodie}
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M 105 120 C 120 135 128 145 125 155"
            fill="none"
            stroke={colors.hoodieLight}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Right Hand */}
          <circle cx="126" cy="158" r="8" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="2.5" />
        </motion.g>

        {/* Neck */}
        <rect x="74" y="94" width="12" height="15" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="2.5" />

        {/* Head & Face Group */}
        <motion.g
          animate={headAnimation}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ transformOrigin: "80px 95px" }}
        >
          {/* Left Ear */}
          <circle cx="45" cy="74" r="8" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="2.5" />
          {/* Right Ear */}
          <circle cx="115" cy="74" r="8" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="2.5" />

          {/* Face Base */}
          <circle cx="80" cy="74" r="32" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="3.5" />

          {/* Spikey Brown Hair */}
          <path
            d="M 44 65 Q 40 46 56 42 Q 66 26 80 36 Q 94 26 104 42 Q 120 46 116 65 Q 118 76 113 74 Q 109 60 98 60 Q 90 48 80 58 Q 70 48 62 60 Q 51 60 47 74 Z"
            fill={colors.hair}
            stroke={colors.hairOutline}
            strokeWidth="4"
          />

          {/* Eyes (Change based on pose) */}
          {pose === "victory" ? (
            <>
              {/* Happy closed cartoon eyes */}
              <path d="M 62 76 Q 68 70 74 76" fill="none" stroke={colors.jeans} strokeWidth="4" strokeLinecap="round" />
              <path d="M 86 76 Q 92 70 98 76" fill="none" stroke={colors.jeans} strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Standard large cartoon eyes */}
              <ellipse cx="68" cy="74" rx="5.5" ry="8" fill={colors.jeans} />
              <circle cx="66" cy="71" r="2" fill={colors.white} />
              <circle cx="69" cy="76" r="0.8" fill={colors.white} />

              <ellipse cx="92" cy="74" rx="5.5" ry="8" fill={colors.jeans} />
              <circle cx="90" cy="71" r="2" fill={colors.white} />
              <circle cx="93" cy="76" r="0.8" fill={colors.white} />
            </>
          )}

          {/* Blush Cheeks */}
          <circle cx="56" cy="80" r="4.5" fill={colors.pink} opacity="0.45" />
          <circle cx="104" cy="80" r="4.5" fill={colors.pink} opacity="0.45" />

          {/* Eyebrows */}
          <path d="M 60 63 Q 68 61 72 65" fill="none" stroke={colors.hairOutline} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 100 63 Q 92 61 88 65" fill="none" stroke={colors.hairOutline} strokeWidth="2.5" strokeLinecap="round" />

          {/* Mouth (Open talking, smiling, or thinking) */}
          {pose === "talking" ? (
            <ellipse cx="80" cy="88" rx="5" ry="7" fill={colors.jeans} />
          ) : pose === "thinking" ? (
            <path d="M 75 87 Q 80 84 85 87" fill="none" stroke={colors.jeans} strokeWidth="3.5" strokeLinecap="round" />
          ) : (
            <path d="M 73 85 Q 80 95 87 85" fill="none" stroke={colors.jeans} strokeWidth="3.5" strokeLinecap="round" />
          )}
        </motion.g>
      </motion.svg>
    </div>
  );
}
