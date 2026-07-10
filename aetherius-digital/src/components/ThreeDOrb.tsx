import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeDOrbProps {
  activeRealm: string;
}

export const ThreeDOrb: React.FC<ThreeDOrbProps> = ({ activeRealm }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Define color schemes for different realms
  const getRealmColors = (realm: string) => {
    switch (realm) {
      case "Digital Art":
        return {
          primary: new THREE.Color("#00d2ff"), // Cyan
          secondary: new THREE.Color("#0066ff"), // Deep Blue
          accent: new THREE.Color("#ffffff"),
        };
      case "VR/AR":
        return {
          primary: new THREE.Color("#10b981"), // Emerald Green
          secondary: new THREE.Color("#059669"), // Dark Green
          accent: new THREE.Color("#a7f3d0"),
        };
      case "web3":
        return {
          primary: new THREE.Color("#ff007f"), // Neon Pink
          secondary: new THREE.Color("#9d4edd"), // Neon Purple
          accent: new THREE.Color("#ffffff"),
        };
      case "AI Ethics":
        return {
          primary: new THREE.Color("#e2e8f0"), // Silver
          secondary: new THREE.Color("#0d9488"), // Teal
          accent: new THREE.Color("#ccfbf1"),
        };
      case "Sonic Design":
        return {
          primary: new THREE.Color("#f97316"), // Orange
          secondary: new THREE.Color("#eab308"), // Gold
          accent: new THREE.Color("#fef08a"),
        };
      default:
        return {
          primary: new THREE.Color("#00d2ff"),
          secondary: new THREE.Color("#9d4edd"),
          accent: new THREE.Color("#ffffff"),
        };
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03030c, 0.05);

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Helpers to create soft round particle texture
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();

    // 1. Central Core Sphere Particles
    const coreCount = 400;
    const coreGeometry = new THREE.BufferGeometry();
    const corePositions = new Float32Array(coreCount * 3);
    const coreRadius = 1.3;

    for (let i = 0; i < coreCount; i++) {
      // Uniform distribution on sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = coreRadius * (0.85 + Math.random() * 0.15); // Layered shell

      corePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      corePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      corePositions[i * 3 + 2] = r * Math.cos(phi);
    }

    coreGeometry.setAttribute("position", new THREE.BufferAttribute(corePositions, 3));

    const colors = getRealmColors(activeRealm);

    const coreMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: colors.primary,
    });

    const corePoints = new THREE.Points(coreGeometry, coreMaterial);
    scene.add(corePoints);

    // 2. Orbiting Rings (Three rings with different inclinations)
    const ringCount = 120;
    const createRing = (radius: number, inclinationX: number, inclinationY: number) => {
      const geom = new THREE.BufferGeometry();
      const pos = new Float32Array(ringCount * 3);

      for (let i = 0; i < ringCount; i++) {
        const theta = (i / ringCount) * Math.PI * 2;
        pos[i * 3] = radius * Math.cos(theta);
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = radius * Math.sin(theta);
      }

      geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.08,
        map: particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: colors.secondary,
      });

      const ring = new THREE.Points(geom, mat);
      ring.rotation.x = inclinationX;
      ring.rotation.y = inclinationY;
      scene.add(ring);
      return { ring, mat };
    };

    const ring1 = createRing(2.0, Math.PI / 3, Math.PI / 6);
    const ring2 = createRing(2.3, -Math.PI / 4, Math.PI / 4);
    const ring3 = createRing(1.7, Math.PI / 2.2, -Math.PI / 8);

    // 3. Swirling Helix Filaments
    // Generating floating curves that spin around the core
    const filamentGeom = new THREE.BufferGeometry();
    const filamentPoints = 300;
    const filamentPos = new Float32Array(filamentPoints * 3);
    const fRadius = 1.4;

    for (let i = 0; i < filamentPoints; i++) {
      const t = i / filamentPoints;
      const angle = t * Math.PI * 12; // Swirling spiral
      const phi = Math.acos(2.0 * t - 1.0); // Winding from top to bottom

      filamentPos[i * 3] = fRadius * Math.sin(phi) * Math.cos(angle);
      filamentPos[i * 3 + 1] = fRadius * Math.sin(phi) * Math.sin(angle);
      filamentPos[i * 3 + 2] = fRadius * Math.cos(phi);
    }

    filamentGeom.setAttribute("position", new THREE.BufferAttribute(filamentPos, 3));
    const filamentMaterial = new THREE.PointsMaterial({
      size: 0.1,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: colors.accent,
    });

    const filamentPointsObj = new THREE.Points(filamentGeom, filamentMaterial);
    scene.add(filamentPointsObj);

    // Light for glow reflection if needed
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Interaction mouse drag state
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    const handleMouseDown = () => {
      isDragging = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      if (isDragging) {
        targetRotation.y += deltaMove.x * 0.005;
        targetRotation.x += deltaMove.y * 0.005;
      }

      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY,
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch Support for Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaMove = {
          x: e.touches[0].clientX - previousMousePosition.x,
          y: e.touches[0].clientY - previousMousePosition.y,
        };

        targetRotation.y += deltaMove.x * 0.008;
        targetRotation.x += deltaMove.y * 0.008;

        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", handleMouseDown);
    domEl.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    domEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    domEl.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // Animation Loop
    let clock = new THREE.Clock();
    let animateId: number;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth rotate if not dragging
      if (!isDragging) {
        targetRotation.y += 0.15 * delta;
        targetRotation.x = Math.sin(elapsed * 0.2) * 0.15; // subtle weave
      }

      // Interpolate rotation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

      // Apply rotation to objects
      corePoints.rotation.x = currentRotation.x;
      corePoints.rotation.y = currentRotation.y;

      ring1.ring.rotation.y = currentRotation.y * 1.5;
      ring2.ring.rotation.y = -currentRotation.y * 1.2;
      ring3.ring.rotation.x = currentRotation.x * 1.1;

      filamentPointsObj.rotation.y = -currentRotation.y * 0.8;
      filamentPointsObj.rotation.z = elapsed * 0.05;

      // Pulsing scale core
      const scale = 1.0 + Math.sin(elapsed * 2) * 0.04;
      corePoints.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
      animateId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", handleResize);

      domEl.removeEventListener("mousedown", handleMouseDown);
      domEl.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      domEl.removeEventListener("touchstart", handleTouchStart);
      domEl.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }

      coreGeometry.dispose();
      coreMaterial.dispose();
      ring1.ring.geometry.dispose();
      ring1.mat.dispose();
      ring2.ring.geometry.dispose();
      ring2.mat.dispose();
      ring3.ring.geometry.dispose();
      ring3.mat.dispose();
      filamentGeom.dispose();
      filamentMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [activeRealm]);

  return (
    <div className="relative w-[340px] h-[340px] md:w-[480px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-10" />

      {/* Futuristic Center Text Ring */}
      <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none select-none text-center bg-[#020208]/30 backdrop-blur-xs p-4 rounded-full border border-white/5 w-[160px] h-[160px] md:w-[220px] md:h-[220px]">
        <div className="text-[10px] md:text-xs tracking-[0.3em] font-mono text-neon-blue uppercase mb-1 md:mb-2 glow-text-cyan animate-pulse">
          Active Realm
        </div>
        <h2 className="text-sm md:text-lg font-title font-bold leading-tight tracking-wider text-white select-none">
          THE {activeRealm.toUpperCase()}
        </h2>
        <div className="w-8 h-[2px] bg-gradient-to-r from-neon-blue to-neon-purple mt-2 md:mt-3" />
        <div className="text-[9px] font-mono text-slate-400 mt-2 tracking-[0.15em] select-none">
          PROJECT ALPHA
        </div>
      </div>
      
      {/* Visual ring wrapper borders around the canvas */}
      <div className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full border border-white/[0.04] pointer-events-none animate-slow-rotate z-0" />
      <div className="absolute w-[290px] h-[290px] md:w-[415px] md:h-[415px] rounded-full border border-dashed border-white/[0.02] pointer-events-none animate-slow-rotate z-0 reverse" />
    </div>
  );
};
