import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Search, Trophy, CheckCircle2, ArrowRight } from "lucide-react";

interface IqSpotDifferencesProps {
  onWin: (stars: number) => void;
  difficulty?: "level1" | "level2" | "level3" | "level4";
}

interface SceneDifference {
  id: string;
  name: string;
  cx: number;
  cy: number;
  r: number;
  origColor: string;
  modColor: string;
  origShape?: string;
  modShape?: string;
}

interface SceneData {
  id: number;
  title: string;
  bgGrad: string;
  differences: SceneDifference[];
}

// Bank of 25 Rich Scenes with Level-Based Differences (3, 5, 7, 8)
const SCENES_BANK: SceneData[] = Array.from({ length: 25 }, (_, i) => {
  const sceneId = i + 1;
  const targetDiffCount = sceneId <= 6 ? 3 : sceneId <= 12 ? 5 : sceneId <= 18 ? 7 : 8;

  const colorPalette = [
    ["#F87171", "#60A5FA"],
    ["#FBBF24", "#34D399"],
    ["#A78BFA", "#F472B6"],
    ["#38BDF8", "#F59E0B"],
    ["#4ADE80", "#E11D48"],
  ];
  const selectedPal = colorPalette[i % colorPalette.length];

  const diffs: SceneDifference[] = [
    { id: "sun", name: "الشمس", cx: 60, cy: 50, r: 24, origColor: "#FBBF24", modColor: "#F97316" },
    { id: "cloud1", name: "السحابة الأولى", cx: 200, cy: 45, r: 28, origColor: "#FFFFFF", modColor: "#94A3B8" },
    { id: "tree_apple", name: "تفاحة الشجرة", cx: 330, cy: 110, r: 16, origColor: "#EF4444", modColor: "#10B981" },
    { id: "house_door", name: "باب المنزل", cx: 140, cy: 210, r: 22, origColor: "#3B82F6", modColor: "#22C55E" },
    { id: "bird", name: "الطائر الطائر", cx: 150, cy: 80, r: 20, origColor: "#1E293B", modColor: "#EC4899" },
    { id: "flower", name: "الزهرة السحرية", cx: 280, cy: 230, r: 18, origColor: "#F43F5E", modColor: "#A855F7" },
    { id: "window", name: "نافذة الكوخ", cx: 90, cy: 170, r: 18, origColor: "#93C5FD", modColor: "#FDE047" },
    { id: "butterfly", name: "الفراشة الملونة", cx: 240, cy: 140, r: 18, origColor: "#F59E0B", modColor: "#06B6D4" },
  ].slice(0, targetDiffCount);

  return {
    id: sceneId,
    title: `المشهد السحري ${sceneId} 🎨`,
    bgGrad: selectedPal[0],
    differences: diffs,
  };
});

export default function IqSpotDifferences({ onWin, difficulty = "level1" }: IqSpotDifferencesProps) {
  const targetRequiredCount = difficulty === "level1" ? 3 : difficulty === "level2" ? 5 : difficulty === "level3" ? 7 : 8;

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [foundDiffIds, setFoundDiffIds] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"playing" | "won">("playing");

  const currentScene = SCENES_BANK[currentSceneIndex % SCENES_BANK.length];
  const activeDiffs = currentScene.differences.slice(0, targetRequiredCount);

  const handleDiffClick = (diffId: string) => {
    if (foundDiffIds.includes(diffId) || gameState !== "playing") return;

    const newFound = [...foundDiffIds, diffId];
    setFoundDiffIds(newFound);

    if ((window as any).sfx) (window as any).sfx.playPop();

    if (newFound.length === activeDiffs.length) {
      setGameState("won");
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38BDF8", "#FACC15", "#4ADE80", "#EC4899"],
      });

      setTimeout(() => {
        onWin(25);
      }, 1500);
    }
  };

  const nextScene = () => {
    setFoundDiffIds([]);
    setGameState("playing");
    setCurrentSceneIndex((prev) => (prev + 1) % SCENES_BANK.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 py-4 font-sans select-none" dir="rtl">
      {/* HUD Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border-2 border-indigo-500/50 shadow-md mb-4 flex items-center justify-between gap-6 max-w-2xl w-full">
        <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-base">
          <Search className="w-5 h-5 text-yellow-400" />
          <span>{currentScene.title}</span>
        </div>

        {/* Counter */}
        <div className="bg-indigo-950 px-4 py-1.5 rounded-full border border-indigo-500/40 text-yellow-300 font-black text-sm flex items-center gap-2">
          <span>الاختلافات:</span>
          <span className="text-rose-400 text-lg">{foundDiffIds.length}</span>
          <span>من {activeDiffs.length}</span>
        </div>
      </div>

      <p className="text-xs font-bold text-indigo-300 mb-4 text-center">
        💡 قارن الصورة العلوية بالصورة السفلية واضغط على الاختلافات في الصورة السفلية!
      </p>

      {/* Two Images Stack */}
      <div className="flex flex-col gap-4 w-full max-w-md items-center">
        {/* Top Image (Original) */}
        <div className="relative w-full">
          <div className="absolute top-2 right-2 bg-indigo-600/90 backdrop-blur-sm text-white font-black text-xs px-3 py-1 rounded-full z-10 border border-indigo-400/40 shadow">
            الصورة الأصلية 🖼️
          </div>
          <svg viewBox="0 0 400 280" className="w-full h-auto bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-lg block">
            <rect x="0" y="220" width="400" height="60" fill="#15803D" />
            <path d="M280 120 L360 120 L320 40 Z" fill="#166534" />
            <rect x="310" y="120" width="20" height="100" fill="#78350F" />
            <rect x="70" y="140" width="100" height="80" fill="#DC2626" />
            <polygon points="60,140 120,80 180,140" fill="#B45309" />
            <rect x="85" y="155" width="28" height="28" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="2" />
            <rect x="130" y="175" width="30" height="45" fill="#3B82F6" rx="3" />
            <circle cx="60" cy="50" r="24" fill="#FBBF24" />
            <ellipse cx="200" cy="45" rx="35" ry="20" fill="#FFFFFF" />
            <circle cx="330" cy="110" r="12" fill="#EF4444" />
            <circle cx="280" cy="230" r="10" fill="#F43F5E" />
            <path d="M 140 70 Q 150 50 160 70 Q 170 50 180 70" fill="none" stroke="#F8FAFC" strokeWidth="3" />
          </svg>
        </div>

        {/* Bottom Image (Modified - Interactive) */}
        <div className="relative w-full">
          <div className="absolute top-2 right-2 bg-rose-600/90 backdrop-blur-sm text-white font-black text-xs px-3 py-1 rounded-full z-10 border border-rose-400/40 shadow">
            أوجد الاختلاف هنا 🔍
          </div>
          <svg viewBox="0 0 400 280" className="w-full h-auto bg-slate-900 rounded-3xl border-4 border-rose-500/60 shadow-xl block cursor-crosshair">
            <rect x="0" y="220" width="400" height="60" fill="#15803D" />
            <path d="M280 120 L360 120 L320 40 Z" fill="#166534" />
            <rect x="310" y="120" width="20" height="100" fill="#78350F" />
            <rect x="70" y="140" width="100" height="80" fill="#DC2626" />
            <polygon points="60,140 120,80 180,140" fill="#B45309" />

            {/* Interactive Target Areas */}
            {activeDiffs.map((diff) => {
              const isFound = foundDiffIds.includes(diff.id);
              return (
                <g key={diff.id} onClick={() => handleDiffClick(diff.id)} className="cursor-pointer">
                  <circle cx={diff.cx} cy={diff.cy} r={diff.r} fill={diff.modColor} />
                  {isFound && (
                    <circle
                      cx={diff.cx}
                      cy={diff.cy}
                      r={diff.r + 6}
                      stroke="#38BDF8"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="6 4"
                      className="animate-spin"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Victory Action */}
      {gameState === "won" && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={nextScene}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg px-8 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            المشهد التالي 🎨
          </button>
        </div>
      )}
    </div>
  );
}
