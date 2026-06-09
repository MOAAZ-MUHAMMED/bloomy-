import { useState } from "react";

interface DoorIntroProps {
  onComplete: () => void;
}

export function DoorIntro({ onComplete }: DoorIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const handleOpenDoors = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Remove the component from DOM after the transition finishes (2.2s animation duration)
    setTimeout(() => {
      setShouldRender(false);
      onComplete();
    }, 2200);
  };

  if (!shouldRender) return null;

  // Gold Corner Ornament SVG
  const CornerOrnament = ({ rotationClass = "" }: { rotationClass?: string }) => (
    <svg className={`w-12 h-12 text-amber-500/70 absolute ${rotationClass}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M 10 10 L 90 10 L 90 30 L 70 30 L 70 70 L 30 70 L 30 90 L 10 90 Z" strokeDasharray="2 2" />
      <path d="M 20 20 C 40 20, 50 30, 50 50 C 30 50, 20 40, 20 20" fill="currentColor" className="opacity-10" />
      <path d="M 15 15 L 60 15 C 40 30, 30 40, 15 60 Z" />
      <circle cx="25" cy="25" r="4" fill="currentColor" />
    </svg>
  );

  // Large Gold Mandala Splits
  const MandalaHalfLeft = () => (
    <svg className="w-56 h-[450px] text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M 100 0 A 100 100 0 0 0 100 200" strokeWidth="2" />
      <path d="M 100 10 A 90 90 0 0 0 100 190" strokeDasharray="4 2" />
      <path d="M 100 20 A 80 80 0 0 0 100 180" />
      <path d="M 100 35 A 65 65 0 0 0 100 165" strokeWidth="1.5" />
      <path d="M 100 50 A 50 50 0 0 0 100 150" strokeDasharray="6 3" />
      <path d="M 100 70 A 30 30 0 0 0 100 130" strokeWidth="2" />
      <path d="M 100 100 L 0 100 L 50 50 L 100 100 L 50 150 Z" fill="currentColor" className="opacity-5" />
      <path d="M 100 100 L 20 50 L 50 20 L 100 100 L 50 180 L 20 150 Z" />
      <path d="M 100 100 L 35 25 L 80 10 L 100 100 L 80 190 L 35 175 Z" />
      <path d="M 100 30 C 50 30, 30 60, 100 100 C 30 140, 50 170, 100 170" />
      <path d="M 100 60 C 70 60, 60 80, 100 100 C 60 120, 70 140, 100 140" />
      <path d="M 100 80 A 20 20 0 0 0 100 120" fill="currentColor" className="opacity-20" />
    </svg>
  );

  const MandalaHalfRight = () => (
    <svg className="w-56 h-[450px] text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M 0 0 A 100 100 0 0 1 0 200" strokeWidth="2" />
      <path d="M 0 10 A 90 90 0 0 1 0 190" strokeDasharray="4 2" />
      <path d="M 0 20 A 80 80 0 0 1 0 180" />
      <path d="M 0 35 A 65 65 0 0 1 0 165" strokeWidth="1.5" />
      <path d="M 0 50 A 50 50 0 0 1 0 150" strokeDasharray="6 3" />
      <path d="M 0 70 A 30 30 0 0 1 0 130" strokeWidth="2" />
      <path d="M 0 100 L 100 100 L 50 50 L 0 100 L 50 150 Z" fill="currentColor" className="opacity-5" />
      <path d="M 0 100 L 80 50 L 50 20 L 0 100 L 50 180 L 80 150 Z" />
      <path d="M 0 100 L 65 25 L 20 10 L 0 100 L 20 190 L 65 175 Z" />
      <path d="M 0 30 C 50 30, 70 60, 0 100 C 70 140, 50 170, 0 170" />
      <path d="M 0 60 C 30 60, 40 80, 0 100 C 40 120, 30 140, 0 140" />
      <path d="M 0 80 A 20 20 0 0 1 0 120" fill="currentColor" className="opacity-20" />
    </svg>
  );

  return (
    <div 
      onClick={handleOpenDoors}
      className={`fixed inset-0 z-[99999] flex overflow-hidden bg-transparent cursor-pointer select-none ${
        isOpen ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      {/* Glow aura behind the doors when opening */}
      <div 
        className={`absolute inset-0 bg-amber-500/10 mix-blend-screen transition-opacity duration-[1500ms] ${
          isOpen ? "opacity-100" : "opacity-0"
        }`} 
      />

      {/* Left Door Panel */}
      <div
        className="w-1/2 h-full bg-[#1b0d06] border-r-4 border-amber-500/30 shadow-[inset_-30px_0_60px_rgba(0,0,0,0.95)] relative flex items-center justify-end transition-transform duration-[2200ms] cubic-bezier(0.77, 0, 0.175, 1)"
        style={{
          transform: isOpen ? "translateX(-100%)" : "translateX(0)",
          backgroundImage: "linear-gradient(to left, rgba(0,0,0,0.3), rgba(255,255,255,0.01))"
        }}
      >
        {/* Door Frame/Borders */}
        <div className="absolute inset-y-6 left-6 right-8 border-[8px] border-[#291409] rounded-lg bg-[#140a04] shadow-[inset_0_4px_20px_rgba(0,0,0,0.9)] flex flex-col justify-between py-12 px-6">
          <div className="w-full h-[45%] border-2 border-[#221007] rounded bg-[#0d0603] shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)] relative p-4">
            <CornerOrnament rotationClass="top-2 left-2 rotate-0" />
            <CornerOrnament rotationClass="top-2 right-2 rotate-90" />
            <CornerOrnament rotationClass="bottom-2 left-2 -rotate-90" />
            <CornerOrnament rotationClass="bottom-2 right-2 rotate-180" />
          </div>
          <div className="w-full h-[45%] border-2 border-[#221007] rounded mt-4 bg-[#0d0603] shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)] relative p-4">
            <CornerOrnament rotationClass="top-2 left-2 rotate-0" />
            <CornerOrnament rotationClass="top-2 right-2 rotate-90" />
            <CornerOrnament rotationClass="bottom-2 left-2 -rotate-90" />
            <CornerOrnament rotationClass="bottom-2 right-2 rotate-180" />
          </div>
        </div>

        {/* Center Split Mandala */}
        <div className="absolute right-0 flex items-center translate-x-[2px] z-10">
          <MandalaHalfLeft />
          
          {/* Majestic Gold Handle */}
          <div className="absolute right-3 w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)] transform translate-y-[20px]">
            <div className="w-8 h-8 rounded-full border border-amber-200/50 bg-[#0d0603] flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-amber-400 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Door Panel */}
      <div
        className="w-1/2 h-full bg-[#1b0d06] border-l-4 border-amber-500/30 shadow-[inset_30px_0_60px_rgba(0,0,0,0.95)] relative flex items-center justify-start transition-transform duration-[2200ms] cubic-bezier(0.77, 0, 0.175, 1)"
        style={{
          transform: isOpen ? "translateX(100%)" : "translateX(0)",
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.3), rgba(255,255,255,0.01))"
        }}
      >
        {/* Door Frame/Borders */}
        <div className="absolute inset-y-6 right-6 left-8 border-[8px] border-[#291409] rounded-lg bg-[#140a04] shadow-[inset_0_4px_20px_rgba(0,0,0,0.9)] flex flex-col justify-between py-12 px-6">
          <div className="w-full h-[45%] border-2 border-[#221007] rounded bg-[#0d0603] shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)] relative p-4">
            <CornerOrnament rotationClass="top-2 left-2 rotate-0" />
            <CornerOrnament rotationClass="top-2 right-2 rotate-90" />
            <CornerOrnament rotationClass="bottom-2 left-2 -rotate-90" />
            <CornerOrnament rotationClass="bottom-2 right-2 rotate-180" />
          </div>
          <div className="w-full h-[45%] border-2 border-[#221007] rounded mt-4 bg-[#0d0603] shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)] relative p-4">
            <CornerOrnament rotationClass="top-2 left-2 rotate-0" />
            <CornerOrnament rotationClass="top-2 right-2 rotate-90" />
            <CornerOrnament rotationClass="bottom-2 left-2 -rotate-90" />
            <CornerOrnament rotationClass="bottom-2 right-2 rotate-180" />
          </div>
        </div>

        {/* Center Split Mandala */}
        <div className="absolute left-0 flex items-center translate-x-[-2px] z-10">
          <MandalaHalfRight />

          {/* Majestic Gold Handle */}
          <div className="absolute left-3 w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)] transform translate-y-[20px]">
            <div className="w-8 h-8 rounded-full border border-amber-200/50 bg-[#0d0603] flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-amber-400 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Click Hint Overlay (fades out immediately when clicked) */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center z-30 transition-opacity duration-500 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="bg-[#1b0d06]/90 border border-amber-500/40 px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] text-center transform translate-y-36">
          <p className="text-amber-400 font-bold text-xl font-arabic tracking-wide animate-pulse">
            اضغط هنا لفتح الباب والدخول
          </p>
        </div>
      </div>

      {/* Middle Vertical Glow Line */}
      <div 
        className="absolute top-0 bottom-0 left-1/2 w-[6px] -translate-x-1/2 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-300 shadow-[0_0_15px_#f59e0b,0_0_30px_#d97706] z-20 pointer-events-none transition-all duration-[1200ms]"
        style={{
          opacity: isOpen ? 0 : 0.9,
          transform: isOpen ? "scaleY(0) translateX(-50%)" : "scaleY(1) translateX(-50%)"
        }}
      />
    </div>
  );
}
