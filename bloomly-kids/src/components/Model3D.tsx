import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// @ts-ignore
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Model3DProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  animationName?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  customAnimation?: 'none' | 'jump' | 'float' | 'spin' | 'sway';
  scaleAdjustment?: number;
  onClick?: (name?: string) => void;
  colorMapping?: boolean;
  enableOrbitControls?: boolean;
  timeScale?: number;
  focusTarget?: string; // Specify a child mesh name to focus the camera lookAt on
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
  colorMapping = false,
  enableOrbitControls = false,
  timeScale = 1.0,
  focusTarget
}: Model3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clickRef = useRef<((name?: string) => void) | undefined>(onClick);
  
  // Refs for dynamic states to avoid re-triggering the main GLB load effect
  const autoRotateRef = useRef(autoRotate);
  const rotationSpeedRef = useRef(rotationSpeed);
  const customAnimationRef = useRef(customAnimation);
  const scaleAdjustmentRef = useRef(scaleAdjustment);
  const timeScaleRef = useRef(timeScale);
  const focusTargetRef = useRef(focusTarget);
  
  // References to three.js objects
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const animationsRef = useRef<any[]>([]);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Sync basic event handlers
  useEffect(() => {
    clickRef.current = onClick;
  }, [onClick]);

  // Sync dynamic values to refs to prevent re-triggering GLB load
  useEffect(() => {
    autoRotateRef.current = autoRotate;
    rotationSpeedRef.current = rotationSpeed;
    customAnimationRef.current = customAnimation;
    timeScaleRef.current = timeScale;
    focusTargetRef.current = focusTarget;
    
    if (activeActionRef.current) {
      activeActionRef.current.timeScale = timeScale;
    }
  }, [autoRotate, rotationSpeed, customAnimation, timeScale, focusTarget]);

  // Handle scale changes and camera distance updates dynamically
  useEffect(() => {
    scaleAdjustmentRef.current = scaleAdjustment;
    const model = modelRef.current;
    const camera = cameraRef.current;
    if (model && camera) {
      // Find the specific node if focusTarget is specified
      let focusNode: THREE.Object3D | null = null;
      if (focusTargetRef.current) {
        model.traverse((child: any) => {
          if (child.name && (
            child.name.toLowerCase() === focusTargetRef.current!.toLowerCase() ||
            child.name.toLowerCase().includes(focusTargetRef.current!.toLowerCase())
          )) {
            focusNode = child;
          }
        });
      }

      const box = new THREE.Box3().setFromObject(focusNode || model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      const fovRad = (camera.fov * Math.PI) / 180;
      let distance = (maxDim / 2) / Math.tan(fovRad / 2);
      distance = (distance * 1.05) / scaleAdjustment;
      distance = Math.max(1.0, Math.min(distance, 150));
      
      camera.position.set(center.x, center.y, center.z + distance);
      camera.lookAt(center);
    }
  }, [scaleAdjustment, focusTarget]);

  // Switch animation clips dynamically without reloading GLB or clearing WebGL context
  useEffect(() => {
    const mixer = mixerRef.current;
    const animations = animationsRef.current;
    if (!mixer || !animations || animations.length === 0) return;

    const playClip = (name: string) => {
      const clip = animations.find((anim: any) => 
        anim.name.toLowerCase() === name.toLowerCase() ||
        anim.name.toLowerCase().includes(name.toLowerCase())
      );
      if (clip) {
        if (activeActionRef.current) activeActionRef.current.stop();
        activeActionRef.current = mixer.clipAction(clip);
        activeActionRef.current.timeScale = timeScaleRef.current;
        activeActionRef.current.play();
      }
    };

    if (animationName) {
      playClip(animationName);
    } else {
      if (activeActionRef.current) activeActionRef.current.stop();
      activeActionRef.current = mixer.clipAction(animations[0]);
      activeActionRef.current.timeScale = timeScaleRef.current;
      activeActionRef.current.play();
    }
  }, [animationName]);

  // Main loader useEffect: only runs once per model src
  useEffect(() => {
    if (!containerRef.current || !src) return;

    const container = containerRef.current;
    const width = container.clientWidth || 200;
    const height = container.clientHeight || 200;

    // Create Scene
    const scene = new THREE.Scene();

    // Create Camera with high far plane to avoid clipping large models like the solar system
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 500);
    cameraRef.current = camera;

    // Create WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // Orbit Controls initialization if enabled
    let controls: any = null;
    if (enableOrbitControls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxDistance = 150;
      controls.minDistance = 1.5;
    }

    // Dynamic High-Quality Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    let mixer: THREE.AnimationMixer | null = null;
    let model: THREE.Group | null = null;
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      src,
      (gltf: any) => {
        const loadedModel = gltf.scene;
        scene.add(loadedModel);
        modelRef.current = loadedModel;

        // Keep the loaded model exactly at (0,0,0) to prevent bone/mesh coordinates separation in animated models
        loadedModel.position.set(0, 0, 0);

        // Find the specific node if focusTarget is specified
        let focusNode: THREE.Object3D | null = null;
        if (focusTargetRef.current) {
          loadedModel.traverse((child: any) => {
            if (child.name && (
              child.name.toLowerCase() === focusTargetRef.current!.toLowerCase() ||
              child.name.toLowerCase().includes(focusTargetRef.current!.toLowerCase())
            )) {
              focusNode = child;
            }
          });
        }

        // Center camera view on model's (or focused node's) bounding box
        const box = new THREE.Box3().setFromObject(focusNode || loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Calculate view distance based on size to fit model cleanly inside viewport
        const maxDim = Math.max(size.x, size.y, size.z);
        const fovRad = (camera.fov * Math.PI) / 180;
        let distance = (maxDim / 2) / Math.tan(fovRad / 2);
        
        // Scale distance with scaleAdjustment
        distance = (distance * 1.05) / scaleAdjustmentRef.current;
        distance = Math.max(1.0, Math.min(distance, 150));

        // Position camera directly in front of the model center
        camera.position.set(center.x, center.y, center.z + distance);
        camera.lookAt(center);

        if (controls) {
          controls.target.copy(center);
          controls.update();
        }

        // Setup animations
        animationsRef.current = gltf.animations || [];
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(loadedModel);
          mixerRef.current = mixer;
          
          const playClip = (name: string) => {
            const clip = gltf.animations.find((anim: any) => 
              anim.name.toLowerCase() === name.toLowerCase() ||
              anim.name.toLowerCase().includes(name.toLowerCase())
            );
            if (clip) {
              if (activeActionRef.current) activeActionRef.current.stop();
              activeActionRef.current = mixer!.clipAction(clip);
              activeActionRef.current.timeScale = timeScaleRef.current;
              activeActionRef.current.play();
            }
          };

          if (animationName) {
            playClip(animationName);
          } else {
            activeActionRef.current = mixer.clipAction(gltf.animations[0]);
            activeActionRef.current.timeScale = timeScaleRef.current;
            activeActionRef.current.play();
          }

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
        let clickedObj = intersects[0].object;
        let objectName = clickedObj.name || "";
        
        let parent = clickedObj.parent;
        while (parent && parent !== model) {
          if (parent.name && parent.name.length > 1) {
            objectName = parent.name;
          }
          parent = parent.parent;
        }
        
        clickRef.current(objectName);
      }
    };

    container.addEventListener('click', handleMouseClick);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (mixer) {
        mixer.update(delta);
      }

      if (controls) {
        controls.update();
      }

      if (model) {
        // Auto rotate
        if (autoRotateRef.current) {
          model.rotation.y += rotationSpeedRef.current;
        }

        // Custom animation presets
        const curAnim = customAnimationRef.current;
        if (curAnim === 'jump') {
          model.position.y = Math.abs(Math.sin(time * 3.5)) * 0.6 - 0.3;
        } else if (curAnim === 'float') {
          model.position.y = Math.sin(time * 2.0) * 0.12;
          model.rotation.y = time * 0.4;
        } else if (curAnim === 'spin') {
          model.rotation.y = time * 1.5;
        } else if (curAnim === 'sway') {
          model.rotation.z = Math.sin(time * 1.5) * 0.12;
          model.position.x = Math.sin(time * 0.8) * 0.1;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer to handle orientation/window changes
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    // Clean up WebGL resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('click', handleMouseClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
      if (controls) controls.dispose();
      mixerRef.current = null;
      activeActionRef.current = null;
      modelRef.current = null;
      cameraRef.current = null;
    };
  }, [src]);

  return (
    <div 
      ref={containerRef} 
      className={`relative flex items-center justify-center overflow-visible cursor-pointer ${className}`} 
      style={{ minWidth: 60, minHeight: 60, ...style }} 
    />
  );
}
