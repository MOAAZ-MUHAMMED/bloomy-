import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
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
    camera.position.set(0, 0.5, 3.8);

    // Renderer (Alpha: true for transparent background)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 5, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffe0b2, 0.5);
    dirLight2.position.set(-2, 2, -3);
    scene.add(dirLight2);

    let mixer: THREE.AnimationMixer | null = null;
    let model: THREE.Group | null = null;
    const clock = new THREE.Clock();
    let animationFrameId: number;

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/Rainbow_animation.glb',
      (gltf) => {
        model = gltf.scene;
        scene.add(model);

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        // Adjust model height to sit nicely
        model.position.y += 0.2;

        // Auto-scale to fit within camera bounds
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / maxDim;
        model.scale.setScalar(scale);

        // Play animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          
          // Try to find the jump & turn animation or fall back to the first clip
          const clip = gltf.animations.find(anim => 
            anim.name.toLowerCase().includes('jump') || 
            anim.name.toLowerCase().includes('turn') ||
            anim.name.toLowerCase().includes('jumb')
          ) || gltf.animations[0];

          const action = mixer.clipAction(clip);
          action.play();
        }
      },
      undefined,
      (error) => {
        console.error("Failed to load Rainbow_animation.glb:", error);
      }
    );

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      // Gentle auto-rotation if no animation is active
      if (model && !mixer) {
        model.rotation.y += 0.01;
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
