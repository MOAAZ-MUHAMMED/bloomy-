import { motion } from "framer-motion";

interface MascotCharacterProps {
  pose: "welcome" | "thinking" | "talking" | "victory";
  className?: string;
}

export default function MascotCharacter({ pose, className = "" }: MascotCharacterProps) {
  const images = {
    welcome: "/mascot_welcome.png",
    thinking: "/mascot_thinking.png",
    talking: "/mascot_talking.png",
    victory: "/mascot_victory.png",
  };

  return (
    <div className={`relative overflow-visible flex items-center justify-center ${className}`}>
      {/* Parent handles bounce scale and state transitions */}
      <motion.div
        key={pose}
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="w-full h-full flex items-center justify-center"
      >
        {/* Child handles continuous idle breathing */}
        <motion.img
          src={images[pose]}
          alt="Mascot"
          animate={{
            y: [0, -4, 0],
            scaleY: [1, 1.025, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "bottom center" }}
          className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
