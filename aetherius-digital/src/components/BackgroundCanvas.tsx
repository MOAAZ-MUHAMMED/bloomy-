import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  driftX: number;
  driftY: number;
  color: string;
}

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const colors = [
      "rgba(255, 255, 255,",
      "rgba(0, 210, 255,",
      "rgba(157, 78, 221,",
      "rgba(255, 0, 127,"
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const density = Math.floor((canvas.width * canvas.height) / 8000);
      const starCount = Math.max(80, Math.min(density, 250));

      for (let i = 0; i < starCount; i++) {
        const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          alphaSpeed: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
          driftX: (Math.random() * 0.05 - 0.025),
          driftY: (Math.random() * 0.05 - 0.025),
          color: colorPrefix,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw starry sky
      stars.forEach((star) => {
        // Twinkle
        star.alpha += star.alphaSpeed;
        if (star.alpha >= 1 || star.alpha <= 0.1) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        // Drift
        star.x += star.driftX;
        star.y += star.driftY;

        // Wrap around screen
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${star.alpha})`;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = "#ffffff";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#020208]"
    />
  );
};
