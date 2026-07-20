import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface IqSpotDifferencesProps {
  onWin: (stars: number) => void;
}

const DIFFERENCES = ['sun', 'cloud', 'apple', 'door', 'bird'];

export default function IqSpotDifferences({ onWin }: IqSpotDifferencesProps) {
  const [foundList, setFoundList] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const handleDiffClick = (id: string) => {
    if (gameOver || foundList.includes(id)) return;

    const newList = [...foundList, id];
    setFoundList(newList);
    
    if ((window as any).sfx) (window as any).sfx.playPop();

    if (newList.length === DIFFERENCES.length) {
      setGameOver(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#3b82f6', '#fbbf24', '#f87171']
      });
      setTimeout(() => onWin(30), 2000);
    }
  };

  const Scene = ({ isModified }: { isModified: boolean }) => (
    <div className="relative w-full max-w-sm mx-auto">
      <svg viewBox="0 0 400 300" className="w-full h-auto bg-sky-100 rounded-3xl border-4 border-slate-300 shadow-sm block">
        {/* Ground */}
        <rect x="0" y="250" width="400" height="50" fill="#4ade80" />
        
        {/* Sun */}
        <g onClick={() => isModified && handleDiffClick('sun')} className={isModified ? 'cursor-pointer hover:opacity-90' : ''}>
          <circle cx="60" cy="60" r="35" fill={isModified ? '#f97316' : '#eab308'} />
          {foundList.includes('sun') && <circle cx="60" cy="60" r="45" stroke="#ef4444" strokeWidth="4" fill="none" strokeDasharray="6 6" className="animate-[spin_4s_linear_infinite]" />}
        </g>
        
        {/* Cloud */}
        <g onClick={() => isModified && handleDiffClick('cloud')} className={isModified ? 'cursor-pointer hover:opacity-90' : ''}>
          <ellipse cx="220" cy="50" rx="45" ry="25" fill={isModified ? '#cbd5e1' : '#ffffff'} />
          {foundList.includes('cloud') && <ellipse cx="220" cy="50" rx="55" ry="35" stroke="#ef4444" strokeWidth="4" fill="none" strokeDasharray="6 6" />}
        </g>
        
        {/* Tree */}
        <rect x="290" y="140" width="20" height="110" fill="#8B4513" />
        <circle cx="300" cy="130" r="55" fill="#22c55e" />
        
        {/* Apple */}
        <g onClick={() => isModified && handleDiffClick('apple')} className={isModified ? 'cursor-pointer hover:opacity-90' : ''}>
          <circle cx="275" cy="110" r="12" fill={isModified ? '#a3e635' : '#ef4444'} />
          {foundList.includes('apple') && <circle cx="275" cy="110" r="20" stroke="#ef4444" strokeWidth="4" fill="none" strokeDasharray="4 4" />}
        </g>
        
        {/* House Base */}
        <rect x="70" y="150" width="110" height="100" fill="#f87171" />
        <polygon points="60,150 125,80 190,150" fill="#92400e" />
        
        {/* House Window */}
        <rect x="85" y="165" width="30" height="30" fill="#bfdbfe" border="2" />
        
        {/* Door */}
        <g onClick={() => isModified && handleDiffClick('door')} className={isModified ? 'cursor-pointer hover:opacity-90' : ''}>
          <rect x="135" y="190" width="35" height="60" fill={isModified ? '#22c55e' : '#3b82f6'} rx="4" />
          <circle cx="145" cy="220" r="3" fill="#ffffff" />
          {foundList.includes('door') && <rect x="125" y="180" width="55" height="80" stroke="#ef4444" strokeWidth="4" fill="none" strokeDasharray="6 6" rx="8" />}
        </g>
        
        {/* Bird */}
        <g onClick={() => isModified && handleDiffClick('bird')} className={isModified ? 'cursor-pointer hover:opacity-90' : ''}>
          <path d={isModified ? "M 130 50 Q 140 70 150 50 Q 160 70 170 50 Q 150 40 130 50" : "M 130 70 Q 140 50 150 70 Q 160 50 170 70 Q 150 80 130 70"} fill={isModified ? '#d946ef' : '#1e293b'} />
          {foundList.includes('bird') && <circle cx="150" cy="60" r="30" stroke="#ef4444" strokeWidth="4" fill="none" strokeDasharray="4 4" />}
        </g>
      </svg>
      
      {isModified && foundList.length === DIFFERENCES.length && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] rounded-3xl flex items-center justify-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl drop-shadow-xl">🏆</motion.div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-[60vh] w-full px-4 pb-12">
      <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-3xl border-2 border-indigo-200 shadow-md mb-6 w-full max-w-2xl text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-indigo-700 mb-2">أوجد الاختلافات الخمسة 🔍</h2>
        <div className="flex items-center justify-center gap-2 text-indigo-900 font-bold bg-indigo-50 py-2 rounded-xl">
          <span>اكتشفت:</span>
          <span className="text-2xl text-rose-500">{foundList.length}</span>
          <span>من 5</span>
        </div>
        <p className="text-sm text-indigo-500 mt-2">اضغط على الاختلافات في الصورة السفلية!</p>
      </div>

      <div className="flex flex-col gap-6 w-full items-center">
        {/* Original Image */}
        <div className="relative group">
          <div className="absolute -left-4 top-4 bg-indigo-500 text-white font-bold py-1 px-3 rounded-r-lg z-10 shadow-sm text-sm">
            الصورة الأصلية
          </div>
          <Scene isModified={false} />
        </div>
        
        {/* Modified Image */}
        <div className="relative">
          <div className="absolute -left-4 top-4 bg-rose-500 text-white font-bold py-1 px-3 rounded-r-lg z-10 shadow-sm text-sm">
            أين الاختلاف؟
          </div>
          <Scene isModified={true} />
        </div>
      </div>
    </div>
  );
}
