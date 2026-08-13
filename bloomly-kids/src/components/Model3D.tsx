import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// @ts-ignore
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface Model3DProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  animationName?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  customAnimation?: 'none' | 'jump' | 'float' | 'spin' | 'sway';
  scaleAdjustment?: number;
  onClick?: () => void;
  colorMapping?: boolean;
}

export default function Model3D({
  src,
  className = "w-48 h-48",
  style,
  animationName,
  autoRotate = false,
  rotationSpeed = 0.01,
  customAnimation = 'none',
  scaleAdjustment = 1.0,
  onClick,
  colorMapping = false
}: Model3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clickRef = useRef<(() => void) | undefined>(onClick);

  useEffect(() => {
    clickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    const container = containerRef.current;
    const width = container.clientWidth || 200;
    const height = container.clientHeight || 200;

    // Create Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(3, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight2.position.set(-3, -4, -2);
    scene.add(dirLight2);

    let mixer: THREE.AnimationMixer | null = null;
    let model: THREE.Group | null = null;
    let activeAction: THREE.AnimationAction | null = null;
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      src,
      (gltf: any) => {
        const loadedModel = gltf.scene;
        scene.add(loadedModel);

        // Center model geometry
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        loadedModel.position.sub(center);

        // Adjust vertical centering
        loadedModel.position.y += 0.05;

        // Auto-scale to fit bounds nicely
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = (2.2 / maxDim) * scaleAdjustment;
        loadedModel.scale.setScalar(scale);

        // Traverse through meshes to resolve black materials
        if (colorMapping) {
          loadedModel.traverse((child: any) => {
            if (child.isMesh && child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              const newMaterials = materials.map((oldMat: any) => {
                let color = new THREE.Color(0xffffff);
                if (oldMat.color) {
                  color.copy(oldMat.color);
                }

                // If texture exists, preserve it but make it unlit/Basic so it renders brightly
                if (oldMat.map) {
                  return new THREE.MeshBasicMaterial({
                    map: oldMat.map,
                    color: color,
                    transparent: oldMat.transparent || false,
                    opacity: oldMat.opacity ?? 1.0,
                    side: THREE.DoubleSide
                  });
                }

                // Map standard names to vibrant cartoon base colors
                const name = (oldMat.name || "").toLowerCase();
                if (name.includes("red")) color.setHex(0xff4444);
                else if (name.includes("orange")) color.setHex(0xff7800);
                else if (name.includes("yellow") || name.includes("gold")) color.setHex(0xffd700);
                else if (name.includes("green")) color.setHex(0x34d399);
                else if (name.includes("blue")) color.setHex(0x3b82f6);
                else if (name.includes("cyan")) color.setHex(0x22d3ee);
                else if (name.includes("violet") || name.includes("purple")) color.setHex(0xa855f7);
                else if (name.includes("white")) color.setHex(0xffffff);
                else {
                  if (oldMat.color) {
                    color.copy(oldMat.color);
                  }
                }

                return new THREE.MeshBasicMaterial({
                  color: color,
                  transparent: oldMat.transparent || false,
                  opacity: oldMat.opacity ?? 1.0,
                  side: THREE.DoubleSide
                });
              });

              child.material = Array.isArray(child.material) ? newMaterials : newMaterials[0];
            }
          });
        }

        // Setup animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(loadedModel);
          
          // Helper function to find a clip by name
          const playClip = (name: string) => {
            const clip = gltf.animations.find((anim: any) => 
              anim.name.toLowerCase() === name.toLowerCase() ||
              anim.name.toLowerCase().includes(name.toLowerCase())
            );
            if (clip) {
              if (activeAction) activeAction.stop();
              activeAction = mixer!.clipAction(clip);
              activeAction.play();
            }
          };

          if (animationName) {
            playClip(animationName);
          } else {
            // Default to first animation clip
            activeAction = mixer.clipAction(gltf.animations[0]);
            activeAction.play();
          }

          // Expose playClip helper to loaded model container
          (loadedModel as any)._playClip = playClip;
        }

        model = loadedModel;
      },
      undefined,
      (err: any) => {
        console.error(`Failed to load 3D model: ${src}`, err);
      }
    );

    // Click handler via raycasting
    const handleMouseClick = (event: MouseEvent) => {
      if (!model || !clickRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycaster.intersectObjects(model.children, true);

      if (intersects.length > 0) {
        clickRef.current();
      }
    };

    container.addEventListener('click', handleMouseClick);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      if (model) {
        // Auto rotate
        if (autoRotate) {
          model.rotation.y += rotationSpeed;
        }

        // Custom animation presets
        if (customAnimation === 'jump') {
          model.position.y = Math.abs(Math.sin(time * 3.5)) * 0.6 - 0.3;
        } else if (customAnimation === 'float') {
          model.position.y = Math.sin(time * 2.0) * 0.12;
          model.rotation.y = time * 0.4;
        } else if (customAnimation === 'spin') {
          model.rotation.y = time * 1.5;
        } else if (customAnimation === 'sway') {
          model.rotation.z = Math.sin(time * 1.5) * 0.12;
          model.position.x = Math.sin(time * 0.8) * 0.1;
        }
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
      container.removeEventListener('click', handleMouseClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
      dracoLoader.dispose();
    };
  }, [src, animationName, autoRotate, rotationSpeed, customAnimation, scaleAdjustment, colorMapping]);

  return (
    <div 
      ref={containerRef} 
      className={`relative flex items-center justify-center overflow-visible cursor-pointer ${className}`} 
      style={{ minWidth: 60, minHeight: 60, ...style }} 
    />
  );
}
