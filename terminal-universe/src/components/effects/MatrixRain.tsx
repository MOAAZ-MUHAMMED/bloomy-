import React, { useEffect, useRef } from "react";

interface MatrixRainProps {
  theme: string;
  onExit: () => void;
}

const themeColorMap: { [key: string]: string } = {
  green: "#22c55e",
  amber: "#f97316",
  cyberpunk: "#06b6d4",
  cobalt: "#3b82f6",
  classic: "#f8fafc",
};

export default function MatrixRain({ theme, onExit }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle full screen sizing
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Characters definition (Matrix kana + latin numbers)
    const characters = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ*+-/%=<>&|[]";
    const charArr = characters.split("");

    const fontSize = 16;
    const columns = Math.floor(width / fontSize);

    // Track y position for each column
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100; // Start at randomized negative heights to stagger falls
    }

    // Get current theme color
    const textColor = themeColorMap[theme] || themeColorMap.green;

    // Animation Loop
    let animationFrameId: number;
    const draw = () => {
      // Create trailing blur effect by drawing semi-transparent background
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Pick random character
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        
        // Lead character of stream is drawn brighter
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = textColor;
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop to top once it goes offscreen, or randomly reset it to stagger streams
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Event listeners to exit Matrix mode on key or click
    const handleKeyPress = () => {
      onExit();
    };
    const handleClick = () => {
      onExit();
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleClick);
    };
  }, [theme, onExit]);

  return (
    <div className="absolute inset-0 z-50 cursor-pointer overflow-hidden bg-black select-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-pulse font-sans text-xs tracking-widest text-white/55 bg-black/60 px-4 py-2 rounded-full border border-white/10 uppercase">
        Press any key to return to terminal
      </div>
    </div>
  );
}
