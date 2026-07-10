import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { audioManager } from "@/lib/AudioManager";

interface ThreeCanvasProps {
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  joystickInput: { x: number; y: number } | null;
  jumpTriggered: boolean;
  clearJumpTrigger: () => void;
  showHUDNotify: string;
  setHUDNotify: (msg: string) => void;
  navTrigger: { action: string; time: number } | null;
  clearNavTrigger: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  activeModal,
  setActiveModal,
  joystickInput,
  jumpTriggered,
  clearJumpTrigger,
  setHUDNotify,
  navTrigger,
  clearNavTrigger
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeModalRef = useRef(activeModal);
  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  const joystickInputRef = useRef(joystickInput);
  useEffect(() => {
    joystickInputRef.current = joystickInput;
  }, [joystickInput]);

  const engineRef = useRef<{
    physics: {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      isGrounded: boolean;
      speed: number;
      jumpForce: number;
      navigationTarget: THREE.Vector3 | null;
      navigationTargetAction: string | null;
    };
    interactiveObjects: { name: string; mesh: THREE.Object3D; action: string }[];
  } | null>(null);

  const [coords, setCoords] = useState({ x: 0, y: 1, z: 0 });

  // --- Dynamic Pixel Canvas Painting Helpers ---
  const createPixelTexture = (
    width: number,
    height: number,
    paintFn: (ctx: CanvasRenderingContext2D) => void
  ): THREE.Texture => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    paintFn(ctx);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  };

  const drawNoiseRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    colors: string[],
    pixelSize = 2
  ) => {
    for (let py = y; py < y + h; py += pixelSize) {
      for (let px = x; px < x + w; px += pixelSize) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(px, py, pixelSize, pixelSize);
      }
    }
  };

  // --- Steve Materials Generation (6 Materials per Box) ---
  const createSteveMaterials = (part: "head" | "torso" | "arm" | "leg"): THREE.MeshStandardMaterial[] => {
    const materials: THREE.MeshStandardMaterial[] = [];

    const SKIN = ["#f3b088", "#e5a17a", "#fabca0"];
    const HAIR = ["#4c2810", "#3d200c", "#562f13"];
    const SHIRT = ["#00a3a3", "#009191", "#12b0b0"];
    const PANTS = ["#2c3b96", "#232e7c", "#3c4ca8"];
    const SHOES = ["#5c5c5c", "#4c4c4c", "#6c6c6c"];

    const getTexture = (faceName: "front" | "back" | "left" | "right" | "top" | "bottom") => {
      return createPixelTexture(32, 32, (ctx) => {
        if (part === "head") {
          if (faceName === "top") {
            drawNoiseRect(ctx, 0, 0, 32, 32, HAIR);
          } else if (faceName === "bottom") {
            drawNoiseRect(ctx, 0, 0, 32, 32, SKIN);
          } else if (faceName === "back") {
            drawNoiseRect(ctx, 0, 0, 32, 32, HAIR);
          } else if (faceName === "left" || faceName === "right") {
            drawNoiseRect(ctx, 0, 0, 32, 32, SKIN);
            drawNoiseRect(ctx, 0, 0, 32, 16, HAIR);
            if (faceName === "left") {
              drawNoiseRect(ctx, 24, 16, 8, 16, HAIR);
            } else {
              drawNoiseRect(ctx, 0, 16, 8, 16, HAIR);
            }
          } else if (faceName === "front") {
            drawNoiseRect(ctx, 0, 0, 32, 32, SKIN);
            drawNoiseRect(ctx, 0, 0, 32, 12, HAIR);
            drawNoiseRect(ctx, 0, 12, 4, 4, HAIR);
            drawNoiseRect(ctx, 28, 12, 4, 4, HAIR);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(4, 16, 4, 4);
            ctx.fillRect(24, 16, 4, 4);
            ctx.fillStyle = "#4a1fb8";
            ctx.fillRect(8, 16, 4, 4);
            ctx.fillRect(20, 16, 4, 4);
            ctx.fillStyle = "#df946c";
            ctx.fillRect(12, 20, 8, 4);
            ctx.fillStyle = "#3d200c";
            ctx.fillRect(8, 24, 16, 4);
            ctx.fillRect(12, 28, 8, 4);
          }
        } else if (part === "torso") {
          drawNoiseRect(ctx, 0, 0, 32, 32, SHIRT);
          if (faceName === "front") {
            ctx.fillStyle = "#df946c";
            ctx.fillRect(10, 0, 12, 4);
            ctx.fillRect(12, 4, 8, 4);
          }
        } else if (part === "arm") {
          if (faceName === "top") {
            drawNoiseRect(ctx, 0, 0, 32, 32, SHIRT);
          } else if (faceName === "bottom") {
            drawNoiseRect(ctx, 0, 0, 32, 32, SKIN);
          } else {
            drawNoiseRect(ctx, 0, 0, 32, 12, SHIRT);
            drawNoiseRect(ctx, 0, 12, 32, 20, SKIN);
          }
        } else if (part === "leg") {
          if (faceName === "bottom") {
            drawNoiseRect(ctx, 0, 0, 32, 32, SHOES);
          } else if (faceName === "top") {
            drawNoiseRect(ctx, 0, 0, 32, 32, PANTS);
          } else {
            drawNoiseRect(ctx, 0, 0, 32, 26, PANTS);
            drawNoiseRect(ctx, 0, 26, 32, 6, SHOES);
          }
        }
      });
    };

    materials.push(new THREE.MeshStandardMaterial({ map: getTexture("right"), roughness: 0.95 }));
    materials.push(new THREE.MeshStandardMaterial({ map: getTexture("left"), roughness: 0.95 }));
    materials.push(new THREE.MeshStandardMaterial({ map: getTexture("top"), roughness: 0.95 }));
    materials.push(new THREE.MeshStandardMaterial({ map: getTexture("bottom"), roughness: 0.95 }));
    materials.push(new THREE.MeshStandardMaterial({ map: getTexture("front"), roughness: 0.95 }));
    materials.push(new THREE.MeshStandardMaterial({ map: getTexture("back"), roughness: 0.95 }));

    return materials;
  };

  // --- Ore Blocks Texturing (Diamond, Gold, Emerald) ---
  const createOreMaterials = (type: "diamond" | "gold" | "emerald"): THREE.MeshStandardMaterial[] => {
    const stoneColors = ["#828282", "#707070", "#909090", "#787878"];
    let oreColors: string[] = [];

    if (type === "diamond") oreColors = ["#38bdf8", "#0ea5e9", "#7dd3fc"];
    else if (type === "gold") oreColors = ["#f59e0b", "#d97706", "#fbbf24"];
    else if (type === "emerald") oreColors = ["#10b981", "#059669", "#34d399"];

    const tex = createPixelTexture(16, 16, (ctx) => {
      drawNoiseRect(ctx, 0, 0, 16, 16, stoneColors, 1);
      ctx.fillStyle = oreColors[0];
      ctx.fillRect(2, 3, 2, 2);
      ctx.fillRect(10, 4, 3, 2);
      ctx.fillRect(4, 11, 2, 3);
      ctx.fillRect(12, 10, 2, 2);

      ctx.fillStyle = oreColors[1];
      ctx.fillRect(3, 4, 1, 1);
      ctx.fillRect(11, 3, 1, 1);
      ctx.fillRect(5, 12, 1, 1);
      ctx.fillRect(13, 11, 1, 1);

      ctx.fillStyle = oreColors[2];
      ctx.fillRect(1, 2, 1, 1);
      ctx.fillRect(9, 5, 1, 1);
      ctx.fillRect(3, 10, 1, 1);
    });

    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 });
    return Array(6).fill(mat);
  };

  // --- Floating 3D Text Badge Sprite ---
  const createTextSprite = (text: string, color: string): THREE.Sprite => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 256, 64);

    ctx.fillStyle = "rgba(10, 12, 24, 0.85)";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(4, 4, 248, 56, 12);
    } else {
      ctx.rect(4, 4, 248, 56);
    }
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.8, 0.45, 1);
    return sprite;
  };

  const generateGrassMaterials = (): THREE.MeshStandardMaterial[] => {
    const grassTop = createPixelTexture(16, 16, (ctx) => {
      drawNoiseRect(ctx, 0, 0, 16, 16, ["#5c8e32", "#4c7828", "#68a03c", "#3d6420"], 1);
    });
    const grassSide = createPixelTexture(16, 16, (ctx) => {
      drawNoiseRect(ctx, 0, 0, 16, 16, ["#866043", "#745037", "#5c3e29", "#4a3220"], 1);
      ctx.fillStyle = "#5c8e32";
      for (let x = 0; x < 16; x++) {
        const h = 3 + Math.floor(Math.sin(x) * 1.2);
        ctx.fillRect(x, 0, 1, h);
      }
    });
    const dirtTex = createPixelTexture(16, 16, (ctx) => {
      drawNoiseRect(ctx, 0, 0, 16, 16, ["#866043", "#745037", "#5c3e29", "#4a3220"], 1);
    });

    return [
      new THREE.MeshStandardMaterial({ map: grassSide, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: grassSide, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: grassTop, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: grassSide, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: grassSide, roughness: 0.9 }),
    ];
  };

  // Sync Hotbar Navigation Trigger
  useEffect(() => {
    if (navTrigger && engineRef.current) {
      const engine = engineRef.current;
      const targetObj = engine.interactiveObjects.find(o => o.action === navTrigger.action);
      if (targetObj) {
        engine.physics.navigationTarget = targetObj.mesh.position.clone();
        engine.physics.navigationTargetAction = targetObj.action;
        setHUDNotify(`Walking to ${targetObj.name}...`);
      }
      clearNavTrigger();
    }
  }, [navTrigger]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0c0f1c");
    scene.fog = new THREE.FogExp2("#0c0f1c", 0.045);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 8);

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight("#222538", 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#e8ddff", 2.2);
    sunLight.position.set(15, 25, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    const d = 10;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // --- Stepped Jungle Terrain Configuration ---
    const grassMats = generateGrassMaterials();

    // 1. Main Island Grass Platform (Height 0)
    const mainIslandGeom = new THREE.BoxGeometry(10, 2, 10);
    const mainIsland = new THREE.Mesh(mainIslandGeom, grassMats);
    mainIsland.position.set(0, -1, 0);
    mainIsland.receiveShadow = true;
    scene.add(mainIsland);

    // 2. Left Jungle Hill (Height +1.0)
    const leftHillGeom = new THREE.BoxGeometry(4, 3, 4);
    const leftHill = new THREE.Mesh(leftHillGeom, grassMats);
    leftHill.position.set(-3.5, -0.5, -1);
    leftHill.receiveShadow = true;
    leftHill.castShadow = true;
    scene.add(leftHill);

    // 3. Right Jungle Ridge (Height +0.5)
    const rightHillGeom = new THREE.BoxGeometry(4, 2.5, 4);
    const rightHill = new THREE.Mesh(rightHillGeom, grassMats);
    rightHill.position.set(3.5, -0.75, 1);
    rightHill.receiveShadow = true;
    rightHill.castShadow = true;
    scene.add(rightHill);

    // 4. Back cliff where waterfall originates (Height +2.0)
    const backCliffGeom = new THREE.BoxGeometry(10, 4, 3);
    const backCliff = new THREE.Mesh(backCliffGeom, grassMats);
    backCliff.position.set(0, 0, -4.5);
    backCliff.receiveShadow = true;
    backCliff.castShadow = true;
    scene.add(backCliff);

    // Stepping stepping stones
    const stepGeom = new THREE.BoxGeometry(1.0, 0.5, 1.0);
    const step1 = new THREE.Mesh(stepGeom, grassMats);
    step1.position.set(-1.8, 0.25, -1.8);
    step1.receiveShadow = true;
    step1.castShadow = true;
    scene.add(step1);

    const step2 = new THREE.Mesh(stepGeom, grassMats);
    step2.position.set(1.8, 0.25, 1.8);
    step2.receiveShadow = true;
    step2.castShadow = true;
    scene.add(step2);

    // --- Giant Jungle Trees & Swaying Vines ---
    const trunkTex = createPixelTexture(16, 16, (ctx) => {
      drawNoiseRect(ctx, 0, 0, 16, 16, ["#5c3d24", "#4a311c", "#6e4b2d"], 1);
    });
    const trunkMat = new THREE.MeshStandardMaterial({ map: trunkTex, roughness: 0.95 });
    
    // Left Giant Tree (placed on the hill)
    const tree1Trunk = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.0, 0.8), trunkMat);
    tree1Trunk.position.set(-3.5, 3.5, -1);
    tree1Trunk.castShadow = true;
    scene.add(tree1Trunk);

    const leavesMat = new THREE.MeshStandardMaterial({
      color: "#22c55e", // jungle green
      roughness: 0.75,
      transparent: true,
      opacity: 0.95,
    });
    
    const tree1Leaves = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 2.8), leavesMat);
    tree1Leaves.position.set(-3.5, 6.5, -1);
    tree1Leaves.castShadow = true;
    scene.add(tree1Leaves);

    // Swaying Vines hanging from tree leaves
    const vineGroup = new THREE.Group();
    vineGroup.position.set(-2.5, 5.2, -1.0); // hangs from the branch
    const vineGeom = new THREE.BoxGeometry(0.12, 1.5, 0.12);
    const vineMat = new THREE.MeshStandardMaterial({
      color: "#166534", // dark forest green
      transparent: true,
      opacity: 0.8,
    });
    const vine1 = new THREE.Mesh(vineGeom, vineMat);
    vine1.position.set(0, -0.75, 0); // pivot offset
    vineGroup.add(vine1);
    scene.add(vineGroup);

    // Right jungle tree
    const tree2Trunk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.0, 0.6), trunkMat);
    tree2Trunk.position.set(3.5, 2.5, 1);
    tree2Trunk.castShadow = true;
    scene.add(tree2Trunk);

    const tree2Leaves = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 2.2), leavesMat);
    tree2Leaves.position.set(3.5, 4.8, 1);
    tree2Leaves.castShadow = true;
    scene.add(tree2Leaves);

    // --- Bamboo Stalks ---
    const bambooMat = new THREE.MeshStandardMaterial({ color: "#4ade80", roughness: 0.6 });
    const bambooGeom = new THREE.BoxGeometry(0.08, 2.2, 0.08);
    const bamboos = [
      [-1.5, 1.1, -1.5], [1.5, 1.1, 1.5], [-4.0, 2.1, 2.5], [3.8, 1.6, -1.5]
    ];
    bamboos.forEach(([bx, by, bz]) => {
      const b = new THREE.Mesh(bambooGeom, bambooMat);
      b.position.set(bx, by, bz);
      b.castShadow = true;
      scene.add(b);
    });

    // --- Stepped Animated Waterfall ---
    const waterColorMat = new THREE.MeshStandardMaterial({
      color: "#38bdf8",
      emissive: "#0284c7",
      transparent: true,
      opacity: 0.75,
      roughness: 0.15,
    });

    // We build 3 steps cascading down from the cliff
    const wf1Geom = new THREE.BoxGeometry(1.6, 1.2, 0.35);
    const waterfallStep1 = new THREE.Mesh(wf1Geom, waterColorMat);
    waterfallStep1.position.set(0, 2.4, -3.8); // top
    scene.add(waterfallStep1);

    const wf2Geom = new THREE.BoxGeometry(1.7, 1.2, 0.35);
    const waterfallStep2 = new THREE.Mesh(wf2Geom, waterColorMat);
    waterfallStep2.position.set(0, 1.3, -3.5); // middle
    scene.add(waterfallStep2);

    const wf3Geom = new THREE.BoxGeometry(1.8, 1.2, 0.35);
    const waterfallStep3 = new THREE.Mesh(wf3Geom, waterColorMat);
    waterfallStep3.position.set(0, 0.3, -3.2); // bottom
    scene.add(waterfallStep3);

    // Water pool at bottom
    const poolGeom = new THREE.BoxGeometry(2.4, 0.15, 2.4);
    const pool = new THREE.Mesh(poolGeom, waterColorMat);
    pool.position.set(0, 0.08, -2.2);
    scene.add(pool);

    // Point lights for bioluminescent colors
    const bluePoint = new THREE.PointLight("#38bdf8", 3, 5);
    bluePoint.position.set(-3.5, 1.8, -1);
    scene.add(bluePoint);

    const goldPoint = new THREE.PointLight("#f59e0b", 3, 5);
    goldPoint.position.set(3.5, 1.5, 1);
    scene.add(goldPoint);

    const greenPoint = new THREE.PointLight("#10b981", 3, 5);
    greenPoint.position.set(0, 1.2, 3);
    scene.add(greenPoint);

    // --- Interactive Ore Blocks (Projects, Works, About) ---
    const interactiveObjects: { name: string; mesh: THREE.Object3D; action: string }[] = [];
    const blockGeom = new THREE.BoxGeometry(1, 1, 1);

    // 1. Projects Box: Diamond Ore (Left hill)
    const projectsBlock = new THREE.Mesh(blockGeom, createOreMaterials("diamond"));
    projectsBlock.position.set(-3.5, 1.5, -1);
    projectsBlock.castShadow = true;
    projectsBlock.receiveShadow = true;
    scene.add(projectsBlock);

    const labelProjects = createTextSprite("Projects / مشاريعي", "#38bdf8");
    labelProjects.position.set(-3.5, 2.4, -1);
    scene.add(labelProjects);

    interactiveObjects.push({ name: "Projects Block", mesh: projectsBlock, action: "portal" });

    // 2. Works Box: Gold Ore (Right hill)
    const worksBlock = new THREE.Mesh(blockGeom, createOreMaterials("gold"));
    worksBlock.position.set(3.5, 1.0, 1);
    worksBlock.castShadow = true;
    worksBlock.receiveShadow = true;
    scene.add(worksBlock);

    const labelWorks = createTextSprite("Works / الأعمال", "#f59e0b");
    labelWorks.position.set(3.5, 1.9, 1);
    scene.add(labelWorks);

    interactiveObjects.push({ name: "Works Block", mesh: worksBlock, action: "crafting" });

    // 3. About Me Box: Emerald Ore (Front Center)
    const aboutBlock = new THREE.Mesh(blockGeom, createOreMaterials("emerald"));
    aboutBlock.position.set(0, 0.5, 3);
    aboutBlock.castShadow = true;
    aboutBlock.receiveShadow = true;
    scene.add(aboutBlock);

    const labelAbout = createTextSprite("About Me / عني", "#10b981");
    labelAbout.position.set(0, 1.4, 3);
    scene.add(labelAbout);

    interactiveObjects.push({ name: "About Me Block", mesh: aboutBlock, action: "chest" });

    // --- Particle Systems ---
    const portalPartCount = 60;
    const portalPartGeom = new THREE.BufferGeometry();
    const portalPartPositions = new Float32Array(portalPartCount * 3);
    for (let i = 0; i < portalPartCount; i++) {
      portalPartPositions[i * 3] = -3.5 + (Math.random() - 0.5) * 1.5;
      portalPartPositions[i * 3 + 1] = 1.0 + Math.random() * 1.5;
      portalPartPositions[i * 3 + 2] = -1.0 + (Math.random() - 0.5) * 1.5;
    }
    portalPartGeom.setAttribute("position", new THREE.BufferAttribute(portalPartPositions, 3));
    const portalPartMat = new THREE.PointsMaterial({
      color: "#60a5fa",
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });
    const portalParticles = new THREE.Points(portalPartGeom, portalPartMat);
    scene.add(portalParticles);

    const cherryCount = 50;
    const cherryGeom = new THREE.BufferGeometry();
    const cherryPositions = new Float32Array(cherryCount * 3);
    for (let i = 0; i < cherryCount; i++) {
      cherryPositions[i * 3] = -3.5 + (Math.random() - 0.5) * 3;
      cherryPositions[i * 3 + 1] = 3.5 + Math.random() * 3;
      cherryPositions[i * 3 + 2] = -3.5 + (Math.random() - 0.5) * 3;
    }
    cherryGeom.setAttribute("position", new THREE.BufferAttribute(cherryPositions, 3));
    const cherryMat = new THREE.PointsMaterial({
      color: "#f472b6",
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });
    const cherryParticles = new THREE.Points(cherryGeom, cherryMat);
    scene.add(cherryParticles);

    // --- Wandering Voxel Sheep ---
    const sheepGroup = new THREE.Group();
    sheepGroup.position.set(1.5, 0, 0);
    scene.add(sheepGroup);

    const sheepBodyGeom = new THREE.BoxGeometry(0.7, 0.5, 0.5);
    const sheepBodyMat = new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.9 });
    const sheepBody = new THREE.Mesh(sheepBodyGeom, sheepBodyMat);
    sheepBody.position.set(0, 0.35, 0);
    sheepBody.castShadow = true;
    sheepGroup.add(sheepBody);

    const sheepHeadGeom = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const sheepHeadTex = createPixelTexture(16, 16, (ctx) => {
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(0, 0, 16, 6);
      ctx.fillStyle = "#fbcfe8";
      ctx.fillRect(0, 6, 16, 10);
      ctx.fillStyle = "#000000";
      ctx.fillRect(2, 8, 2, 2);
      ctx.fillRect(12, 8, 2, 2);
    });
    const sheepHeadMat = [
      new THREE.MeshStandardMaterial({ color: "#fbcfe8" }),
      new THREE.MeshStandardMaterial({ color: "#fbcfe8" }),
      new THREE.MeshStandardMaterial({ color: "#e2e8f0" }),
      new THREE.MeshStandardMaterial({ color: "#fbcfe8" }),
      new THREE.MeshStandardMaterial({ map: sheepHeadTex }),
      new THREE.MeshStandardMaterial({ color: "#e2e8f0" }),
    ];
    const sheepHead = new THREE.Mesh(sheepHeadGeom, sheepHeadMat);
    sheepHead.position.set(0, 0.5, 0.32);
    sheepHead.castShadow = true;
    sheepGroup.add(sheepHead);

    const sheepLegGeom = new THREE.BoxGeometry(0.12, 0.3, 0.12);
    const sheepLegMat = new THREE.MeshStandardMaterial({ color: "#fbcfe8", roughness: 0.9 });

    const sLegL1 = new THREE.Mesh(sheepLegGeom, sheepLegMat);
    sLegL1.position.set(-0.2, 0.15, 0.15);
    sLegL1.castShadow = true;
    sheepGroup.add(sLegL1);

    const sLegR1 = new THREE.Mesh(sheepLegGeom, sheepLegMat);
    sLegR1.position.set(0.2, 0.15, 0.15);
    sLegR1.castShadow = true;
    sheepGroup.add(sLegR1);

    const sLegL2 = new THREE.Mesh(sheepLegGeom, sheepLegMat);
    sLegL2.position.set(-0.2, 0.15, -0.15);
    sLegL2.castShadow = true;
    sheepGroup.add(sLegL2);

    const sLegR2 = new THREE.Mesh(sheepLegGeom, sheepLegMat);
    sLegR2.position.set(0.2, 0.15, -0.15);
    sLegR2.castShadow = true;
    sheepGroup.add(sLegR2);

    const sheepAI = {
      velocity: new THREE.Vector3(0, 0, 0),
      dir: new THREE.Vector3(0, 0, 0),
      changeTimer: 0,
      isWalking: false,
    };

    // --- Steve Character Model (Multi-Material) ---
    const steveGroup = new THREE.Group();
    steveGroup.position.set(0, 0, 0);
    scene.add(steveGroup);

    const headMats = createSteveMaterials("head");
    const torsoMats = createSteveMaterials("torso");
    const armMats = createSteveMaterials("arm");
    const legMats = createSteveMaterials("leg");

    const torsoGeom = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const torsoMesh = new THREE.Mesh(torsoGeom, torsoMats);
    torsoMesh.position.set(0, 0.6, 0);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    steveGroup.add(torsoMesh);

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.2, 0);
    const headGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMesh = new THREE.Mesh(headGeom, headMats);
    headMesh.position.set(0, 0.4, 0);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headPivot.add(headMesh);
    steveGroup.add(headPivot);

    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.6, 1.1, 0);
    const armGeom = new THREE.BoxGeometry(0.4, 1.2, 0.4);
    const leftArmMesh = new THREE.Mesh(armGeom, armMats);
    leftArmMesh.position.set(0, -0.5, 0);
    leftArmMesh.castShadow = true;
    leftArmPivot.add(leftArmMesh);
    steveGroup.add(leftArmPivot);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.6, 1.1, 0);
    const rightArmMesh = new THREE.Mesh(armGeom, armMats);
    rightArmMesh.position.set(0, -0.5, 0);
    rightArmMesh.castShadow = true;
    rightArmPivot.add(rightArmMesh);
    steveGroup.add(rightArmPivot);

    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.21, 0.0, 0);
    const legGeom = new THREE.BoxGeometry(0.38, 1.2, 0.4);
    const leftLegMesh = new THREE.Mesh(legGeom, legMats);
    leftLegMesh.position.set(0, -0.6, 0);
    leftLegMesh.castShadow = true;
    leftLegPivot.add(leftLegMesh);
    steveGroup.add(leftLegPivot);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.21, 0.0, 0);
    const rightLegMesh = new THREE.Mesh(legGeom, legMats);
    rightLegMesh.position.set(0, -0.6, 0);
    rightLegMesh.castShadow = true;
    rightLegPivot.add(rightLegMesh);
    steveGroup.add(rightLegPivot);

    const capeGeom = new THREE.BoxGeometry(0.6, 1.2, 0.05);
    const capeMat = new THREE.MeshStandardMaterial({ color: "#991b1b", roughness: 0.95 });
    const cape = new THREE.Mesh(capeGeom, capeMat);
    cape.position.set(0, 0.6, -0.23);
    cape.castShadow = true;
    steveGroup.add(cape);

    // --- Controls ---
    const keys: { [key: string]: boolean } = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalRef.current) return;
      keys[e.key.toLowerCase()] = true;
      
      // Interrupt auto-walking on manual input
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
        if (engineRef.current) {
          engineRef.current.physics.navigationTarget = null;
          engineRef.current.physics.navigationTargetAction = null;
        }
      }

      if (e.key.toLowerCase() === "e") {
        checkInteraction();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const mouse = new THREE.Vector2();
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- Raycaster Click to Move Ground targets ---
    const raycaster = new THREE.Raycaster();
    const handleCanvasClick = (e: MouseEvent) => {
      if (activeModalRef.current || !engineRef.current) return;
      
      // Normalize coordinates
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      // Raycast against the grass terrains
      const intersects = raycaster.intersectObjects([mainIsland, leftHill, rightHill, backCliff, step1, step2]);
      
      if (intersects.length > 0) {
        const point = intersects[0].point;
        
        // Double check if clicked close to an ore block
        let clickedBlockAction: string | null = null;
        for (const obj of interactiveObjects) {
          const dist = point.distanceTo(obj.mesh.position);
          if (dist < 1.8) {
            clickedBlockAction = obj.action;
            engineRef.current.physics.navigationTarget = obj.mesh.position.clone();
            engineRef.current.physics.navigationTargetAction = obj.action;
            setHUDNotify(`Walking to ${obj.name}...`);
            break;
          }
        }

        if (!clickedBlockAction) {
          // Normal click-to-move point
          engineRef.current.physics.navigationTarget = point.clone();
          engineRef.current.physics.navigationTargetAction = null;
          setHUDNotify("Walking to clicked target...");
        }
      }
    };
    renderer.domElement.addEventListener("click", handleCanvasClick);

    const physics = {
      position: new THREE.Vector3(0, 1, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      isGrounded: false,
      speed: 4.8,
      jumpForce: 7.2,
      navigationTarget: null as THREE.Vector3 | null,
      navigationTargetAction: null as string | null,
    };

    engineRef.current = { physics, interactiveObjects };

    const checkInteraction = () => {
      const playerPos = steveGroup.position;
      for (const obj of interactiveObjects) {
        const dist = playerPos.distanceTo(obj.mesh.position);
        if (dist < 2.0) {
          audioManager.playSound(
            obj.action === "chest" ? "chest_open" : obj.action === "crafting" ? "craft" : "portal_teleport"
          );
          setActiveModal(obj.action);
          break;
        }
      }
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    steveGroup.position.copy(physics.position);

    // --- Game Loop ---
    let animId: number;
    const clock = new THREE.Clock();
    let stepAccumulator = 0;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime() * 0.05;

      // Sun
      const sunAngle = time;
      sunLight.position.x = Math.cos(sunAngle) * 30;
      sunLight.position.y = Math.sin(sunAngle) * 30;
      sunLight.position.z = Math.sin(sunAngle * 0.5) * 15;

      const sunAlt = Math.sin(sunAngle);
      if (sunAlt > 0) {
        scene.background = new THREE.Color().setHSL(0.6, 0.7, 0.08 + sunAlt * 0.28);
        (scene.fog as THREE.FogExp2).color.copy(scene.background as THREE.Color);
        sunLight.intensity = sunAlt * 2.2;
        ambientLight.color.setHex(0x2a324d);
        ambientLight.intensity = 1.0 + sunAlt * 0.8;
      } else {
        scene.background = new THREE.Color("#05060f");
        (scene.fog as THREE.FogExp2).color.setHex(0x05060f);
        sunLight.intensity = 0.0;
        ambientLight.color.setHex(0x0f1124);
        ambientLight.intensity = 0.5;
      }

      // Rotate Ores
      projectsBlock.rotation.y += 0.5 * delta;
      worksBlock.rotation.y += 0.5 * delta;
      aboutBlock.rotation.y += 0.5 * delta;

      // Sway vines
      vineGroup.rotation.z = Math.sin(clock.getElapsedTime() * 2) * 0.12;

      // Animate Waterfall blocks (Stepped cascading)
      const waterOffset = Math.sin(clock.getElapsedTime() * 15) * 0.02;
      waterfallStep1.scale.y = 1.0 + waterOffset;
      waterfallStep2.scale.y = 1.0 - waterOffset;
      waterfallStep3.scale.y = 1.0 + waterOffset;

      // --- Wandering Sheep AI ---
      sheepAI.changeTimer -= delta;
      if (sheepAI.changeTimer <= 0) {
        sheepAI.isWalking = Math.random() > 0.4;
        if (sheepAI.isWalking) {
          const angle = Math.random() * Math.PI * 2;
          sheepAI.dir.set(Math.cos(angle), 0, Math.sin(angle));
        } else {
          sheepAI.dir.set(0, 0, 0);
        }
        sheepAI.changeTimer = 2 + Math.random() * 4;
      }

      if (sheepAI.isWalking) {
        const sSpeed = 1.2 * delta;
        sheepGroup.position.x += sheepAI.dir.x * sSpeed;
        sheepGroup.position.z += sheepAI.dir.z * sSpeed;

        // Bounding checks on main grass island
        if (Math.abs(sheepGroup.position.x) > 4.5) {
          sheepAI.dir.x *= -1;
          sheepGroup.position.x = Math.max(-4.5, Math.min(4.5, sheepGroup.position.x));
        }
        if (Math.abs(sheepGroup.position.z) > 4.5) {
          sheepAI.dir.z *= -1;
          sheepGroup.position.z = Math.max(-4.5, Math.min(4.5, sheepGroup.position.z));
        }

        const targetRot = Math.atan2(sheepAI.dir.x, sheepAI.dir.z);
        let sDiff = targetRot - sheepGroup.rotation.y;
        while (sDiff < -Math.PI) sDiff += Math.PI * 2;
        while (sDiff > Math.PI) sDiff -= Math.PI * 2;
        sheepGroup.rotation.y += sDiff * 0.15;

        const sSwing = Math.sin(clock.getElapsedTime() * 8);
        sLegL1.rotation.x = sSwing * 0.4;
        sLegR1.rotation.x = -sSwing * 0.4;
        sLegL2.rotation.x = -sSwing * 0.4;
        sLegR2.rotation.x = sSwing * 0.4;
      } else {
        sLegL1.rotation.x = 0;
        sLegR1.rotation.x = 0;
        sLegL2.rotation.x = 0;
        sLegR2.rotation.x = 0;
      }

      // Keep Labels always looking at Camera
      labelProjects.lookAt(camera.position);
      labelWorks.lookAt(camera.position);
      labelAbout.lookAt(camera.position);

      // --- Movement Inputs (Keyboard & Joystick) ---
      let moveX = 0;
      let moveZ = 0;

      // Read keyboard inputs if active modal is closed
      if (!activeModalRef.current) {
        if (keys["w"] || keys["arrowup"]) moveZ -= 1;
        if (keys["s"] || keys["arrowdown"]) moveZ += 1;
        if (keys["a"] || keys["arrowleft"]) moveX -= 1;
        if (keys["d"] || keys["arrowright"]) moveX += 1;
      }

      // Read mobile joystick inputs
      if (joystickInputRef.current && !activeModalRef.current) {
        moveX = joystickInputRef.current.x;
        moveZ = -joystickInputRef.current.y;
        // Interrupt auto-walking when joystick moves
        if (Math.abs(moveX) > 0.1 || Math.abs(moveZ) > 0.1) {
          physics.navigationTarget = null;
          physics.navigationTargetAction = null;
        }
      }

      // --- Auto-Navigation / Click-to-Move Pathing ---
      if (physics.navigationTarget && !activeModalRef.current) {
        const dx = physics.navigationTarget.x - physics.position.x;
        const dz = physics.navigationTarget.z - physics.position.z;
        const hDist = Math.sqrt(dx * dx + dz * dz);

        if (hDist > 0.8) {
          // Set direction walk
          moveX = dx;
          moveZ = dz;
        } else {
          // Arrived!
          if (physics.navigationTargetAction) {
            // Trigger Modal
            const action = physics.navigationTargetAction;
            audioManager.playSound(
              action === "chest" ? "chest_open" : action === "crafting" ? "craft" : "portal_teleport"
            );
            setActiveModal(action);
          }
          physics.navigationTarget = null;
          physics.navigationTargetAction = null;
          setHUDNotify("Arrived at target!");
        }
      }

      // Keyboard Jump check
      if (keys[" "] && physics.isGrounded && !activeModalRef.current) {
        physics.velocity.y = physics.jumpForce;
        physics.isGrounded = false;
        audioManager.playSound("jump");
      }

      const moveVec = new THREE.Vector3(moveX, 0, moveZ);
      if (moveVec.lengthSq() > 0.01) {
        moveVec.normalize();
        const speed = physics.speed * delta;
        physics.position.x += moveVec.x * speed;
        physics.position.z += moveVec.z * speed;

        const targetRotation = Math.atan2(moveVec.x, moveVec.z);
        let diff = targetRotation - steveGroup.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        steveGroup.rotation.y += diff * 0.15;
      }

      // --- Gravity & Stepped Voxel Collision Math ---
      physics.velocity.y -= 18.0 * delta;
      physics.position.y += physics.velocity.y * delta;

      const px = physics.position.x;
      const pz = physics.position.z;
      let platformHeight = -100;

      // Calculate stepped heightmap
      if (Math.abs(px) <= 5.0 && Math.abs(pz) <= 5.0) {
        platformHeight = 0; // base island height
        
        // Left hill (X:[-5, -1.5], Z:[-3, 1]) -> Height 1.0
        if (px >= -5.5 && px <= -1.5 && pz >= -3.0 && pz <= 1.0) {
          platformHeight = 1.0;
        }
        // Right ridge (X:[1.5, 5], Z:[-1, 3]) -> Height 0.5
        else if (px >= 1.5 && px <= 5.5 && pz >= -1.0 && pz <= 3.0) {
          platformHeight = 0.5;
        }
        // Back cliff (X:[-5, 5], Z:[-5.5, -3]) -> Height 2.0
        else if (px >= -5.5 && px <= 5.5 && pz >= -5.5 && pz <= -3.0) {
          platformHeight = 2.0;
        }
        // Stepping stone 1
        else if (Math.abs(px - -1.8) <= 0.6 && Math.abs(pz - -1.8) <= 0.6) {
          platformHeight = 0.5;
        }
        // Stepping stone 2
        else if (Math.abs(px - 1.8) <= 0.6 && Math.abs(pz - 1.8) <= 0.6) {
          platformHeight = 0.5;
        }
      }

      if (physics.position.y <= platformHeight) {
        physics.position.y = platformHeight;
        physics.velocity.y = 0;
        physics.isGrounded = true;
      } else {
        physics.isGrounded = false;
      }

      if (physics.position.y < -8) {
        physics.position.set(0, 3, 0);
        physics.velocity.set(0, 0, 0);
        physics.isGrounded = false;
        physics.navigationTarget = null;
        physics.navigationTargetAction = null;
        setHUDNotify("Dropped out of the world! Respawned.");
      }

      steveGroup.position.copy(physics.position);
      setCoords({
        x: Math.round(physics.position.x * 10) / 10,
        y: Math.round(physics.position.y * 10) / 10,
        z: Math.round(physics.position.z * 10) / 10,
      });

      // Character animations
      const isMoving = moveVec.lengthSq() > 0.01;
      const animSpeed = 10.0;
      const swingRange = 0.6;

      if (isMoving && physics.isGrounded) {
        const swing = Math.sin(clock.getElapsedTime() * animSpeed);
        leftArmPivot.rotation.x = swing * swingRange;
        rightArmPivot.rotation.x = -swing * swingRange;
        leftLegPivot.rotation.x = -swing * swingRange;
        rightLegPivot.rotation.x = swing * swingRange;
        steveGroup.children[0].rotation.x = 0.08;

        stepAccumulator += delta;
        if (stepAccumulator > 0.32) {
          audioManager.playSound("step_grass");
          stepAccumulator = 0;
        }
      } else if (!physics.isGrounded) {
        leftArmPivot.rotation.x = -0.3;
        rightArmPivot.rotation.x = -0.3;
        leftLegPivot.rotation.x = 0.1;
        rightLegPivot.rotation.x = -0.1;
        steveGroup.children[0].rotation.x = 0.0;
      } else {
        const breath = Math.sin(clock.getElapsedTime() * 1.5) * 0.03;
        leftArmPivot.rotation.x = breath;
        rightArmPivot.rotation.x = -breath;
        leftLegPivot.rotation.x = 0;
        rightLegPivot.rotation.x = 0;
        leftArmPivot.rotation.z = -breath * 0.5;
        rightArmPivot.rotation.z = breath * 0.5;
        steveGroup.children[0].rotation.x = 0;
      }

      // Head look
      const headTargetY = mouse.x * 0.5;
      const headTargetX = -mouse.y * 0.4;
      headPivot.rotation.y += (headTargetY - headPivot.rotation.y) * 0.1;
      headPivot.rotation.x += (headTargetX - headPivot.rotation.x) * 0.1;

      // Object distances checks
      let nearProjects = false;
      let nearWorks = false;
      let nearAbout = false;

      interactiveObjects.forEach(obj => {
        const dist = steveGroup.position.distanceTo(obj.mesh.position);
        if (dist < 1.8) {
          if (obj.action === "portal") nearProjects = true;
          if (obj.action === "crafting") nearWorks = true;
          if (obj.action === "chest") nearAbout = true;
        }
      });

      if (nearProjects && !activeModalRef.current) setHUDNotify("Press [E] or click to open Projects");
      else if (nearWorks && !activeModalRef.current) setHUDNotify("Press [E] or click to open Works");
      else if (nearAbout && !activeModalRef.current) setHUDNotify("Press [E] or click to open About Me");

      // Camera follow
      const camOffset = new THREE.Vector3(0, 3.2, 5.5);
      const targetCamPos = steveGroup.position.clone().add(camOffset);
      camera.position.lerp(targetCamPos, 0.08);
      camera.lookAt(steveGroup.position.clone().add(new THREE.Vector3(0, 0.8, 0)));

      // Particles
      const portalPos = portalParticles.geometry.attributes.position.array as Float32Array;
      const portalCount = portalPos.length / 3;
      for (let i = 0; i < portalCount; i++) {
        portalPos[i * 3 + 1] += 1.0 * delta;
        portalPos[i * 3] += Math.sin(time + i) * 0.1 * delta;
        if (portalPos[i * 3 + 1] > 2.5) {
          portalPos[i * 3 + 1] = 0.5;
          portalPos[i * 3] = -3.5 + (Math.random() - 0.5) * 1.5;
        }
      }
      portalParticles.geometry.attributes.position.needsUpdate = true;

      const cherryPos = cherryParticles.geometry.attributes.position.array as Float32Array;
      const cCount = cherryPos.length / 3;
      for (let i = 0; i < cCount; i++) {
        cherryPos[i * 3 + 1] -= 0.6 * delta;
        cherryPos[i * 3] += Math.sin(time * 0.8 + i) * 0.2 * delta;
        if (cherryPos[i * 3 + 1] < 0) {
          cherryPos[i * 3 + 1] = 4.5 + Math.random() * 2;
          cherryPos[i * 3] = -3.5 + (Math.random() - 0.5) * 3;
        }
      }
      cherryParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleCanvasClick);
      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {}
      }
      renderer.dispose();
    };
  }, []);

  // touch controls jump sync
  useEffect(() => {
    if (jumpTriggered && engineRef.current) {
      const engine = engineRef.current;
      if (engine.physics.isGrounded && !activeModal) {
        engine.physics.velocity.y = engine.physics.jumpForce;
        engine.physics.isGrounded = false;
        audioManager.playSound("jump");
      }
      clearJumpTrigger();
    }
  }, [jumpTriggered]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 z-20 font-mono text-xs text-brand-cyan/80 bg-slate-900/60 p-2 rounded backdrop-blur border border-white/5 select-none pointer-events-none">
        <div>XYZ: {coords.x} / {coords.y} / {coords.z}</div>
        <div>Biome: Jungle Ridge</div>
        <div>FPS: 60</div>
      </div>
    </div>
  );
};
