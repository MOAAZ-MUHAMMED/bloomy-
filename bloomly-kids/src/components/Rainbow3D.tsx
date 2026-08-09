import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface Rainbow3DProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Rainbow3D({ className = "w-40 h-40", style }: Rainbow3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 160;
    const height = container.clientHeight || 160;

    // Create Scene
    const scene = new THREE.Scene();

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);

    // Renderer (Alpha: true for transparent background)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights (Basic ambient for general brightness)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    let model: THREE.Group | null = null;
    const clock = new THREE.Clock();
    let animationFrameId: number;

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/Rainbow_animation.glb',
      (gltf: any) => {
        model = gltf.scene;
        scene.add(model);

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        // Auto-scale to fit within camera bounds nicely
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        model.scale.setScalar(scale);

        // Traverse through meshes and assign vibrant unlit colors to avoid black model rendering
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;

            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              const newMaterials = materials.map((oldMat: any) => {
                let color = new THREE.Color(0xffffff);
                if (oldMat.color) {
                  color.copy(oldMat.color);
                }

                // Force vibrant colors based on standard rainbow names
                const name = (oldMat.name || "").toLowerCase();
                if (name.includes("red")) color.setHex(0xff4444);
                else if (name.includes("orange")) color.setHex(0xff7800);
                else if (name.includes("yellow")) color.setHex(0xffd700);
                else if (name.includes("green")) color.setHex(0x34d399);
                else if (name.includes("blue")) color.setHex(0x3b82f6);
                else if (name.includes("cyan")) color.setHex(0x22d3ee);
                else if (name.includes("violet") || name.includes("purple")) color.setHex(0xa855f7);
                else if (name.includes("white")) color.setHex(0xffffff);

                return new THREE.MeshBasicMaterial({
                  color: color,
                  transparent: oldMat.transparent || false,
                  opacity: oldMat.opacity ?? 1.0,
                  side: THREE.DoubleSide
                });
              });

              child.material = Array.isArray(child.material) ? newMaterials : newMaterials[0];
            }
          }
        });
      },
      undefined,
      (error: any) => {
        console.error("Failed to load Rainbow_animation.glb:", error);
      }
    );

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Custom "Jump & Turn" animation inside code (since GLB does not have embedded animations)
      if (model) {
        // 1. Jumping: Bounces up and down smoothly
        model.position.y = Math.abs(Math.sin(time * 3.5)) * 0.8 - 0.4;
        
        // 2. Turning: Rotates around Y-axis
        model.rotation.y = time * 1.8;
        
        // 3. Tilting: Slight tilt while turning for dynamic effect
        model.rotation.z = Math.sin(time * 2) * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative flex items-center justify-center overflow-visible ${className}`} 
      style={{ minWidth: 100, minHeight: 100, ...style }} 
    />
  );
}
