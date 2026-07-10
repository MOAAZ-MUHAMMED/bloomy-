import React, { useEffect, useRef } from "react";

interface MiniInteractiveCanvasProps {
  type: "ecosystem" | "neural" | "quantum";
  isHovered: boolean;
}

export const MiniInteractiveCanvas: React.FC<MiniInteractiveCanvasProps> = ({
  type,
  isHovered,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Set dimensions
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 250;
      canvas.height = 100;
    };
    resize();

    // Neural nodes structure
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    if (type === "neural") {
      const nodeCount = 18;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    }

    // Quantum particles structure
    const electrons: { angle: number; speed: number; radiusX: number; radiusY: number; inclination: number }[] = [];
    if (type === "quantum") {
      electrons.push(
        { angle: 0, speed: 0.03, radiusX: 55, radiusY: 15, inclination: Math.PI / 6 },
        { angle: Math.PI / 3, speed: 0.04, radiusX: 50, radiusY: 18, inclination: -Math.PI / 4 },
        { angle: (2 * Math.PI) / 3, speed: 0.05, radiusX: 60, radiusY: 12, inclination: Math.PI / 3 }
      );
    }

    const drawEcosystem = (speedMultiplier: number) => {
      ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
      ctx.lineWidth = isHovered ? 1.5 : 1;
      
      const rows = 6;
      const cols = 20;
      const cellW = canvas.width / (cols - 1);
      const cellH = canvas.height / (rows - 1);

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const x = c * cellW;
          // Calculate wave height using sine/cosine curves
          const yOffset = Math.sin(c * 0.3 + time * 0.05 * speedMultiplier) * 12 + 
                          Math.cos(r * 0.5 + time * 0.03 * speedMultiplier) * 6;
          const y = r * cellH * 0.6 + 20 + yOffset;
          
          if (c === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    const drawNeural = (speedMultiplier: number) => {
      ctx.fillStyle = "rgba(157, 78, 221, 0.8)";
      ctx.strokeStyle = "rgba(157, 78, 221, 0.15)";
      ctx.lineWidth = 1;

      // Update & Draw nodes
      nodes.forEach((node) => {
        node.x += node.vx * speedMultiplier;
        node.y += node.vy * speedMultiplier;

        // Boundaries
        if (node.x < 0 || node.x > canvas.width) node.vx = -node.vx;
        if (node.y < 0 || node.y > canvas.height) node.vy = -node.vy;

        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 45) {
            ctx.strokeStyle = `rgba(157, 78, 221, ${0.35 - dist / 45})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawQuantum = (speedMultiplier: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw nucleus
      const gradient = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, 8);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.3, "rgba(255, 0, 127, 1)");
      gradient.addColorStop(1, "rgba(255, 0, 127, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw orbits and electrons
      electrons.forEach((electron) => {
        electron.angle += electron.speed * speedMultiplier;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(electron.inclination);

        // Draw orbit ring
        ctx.strokeStyle = "rgba(255, 0, 127, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, electron.radiusX, electron.radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw electron
        const elX = Math.cos(electron.angle) * electron.radiusX;
        const elY = Math.sin(electron.angle) * electron.radiusY;

        ctx.fillStyle = isHovered ? "#ffffff" : "rgba(255, 0, 127, 0.9)";
        ctx.shadowColor = "#ff007f";
        ctx.shadowBlur = isHovered ? 8 : 4;
        ctx.beginPath();
        ctx.arc(elX, elY, isHovered ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      const speedMultiplier = isHovered ? 2.5 : 1;

      if (type === "ecosystem") {
        drawEcosystem(speedMultiplier);
      } else if (type === "neural") {
        drawNeural(speedMultiplier);
      } else if (type === "quantum") {
        drawQuantum(speedMultiplier);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, isHovered]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[100px] mt-4 opacity-75 hover:opacity-100 transition-opacity duration-300"
    />
  );
};
