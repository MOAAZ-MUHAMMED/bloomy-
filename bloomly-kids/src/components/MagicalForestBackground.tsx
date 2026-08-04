import React from 'react';

export const MagicalForestBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-br from-[#FFFBEB] via-[#FDE047] to-[#F59E0B] select-none">
      {/* Premium playroom dot grid pattern */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(#B45309 2px, transparent 2px)`,
          backgroundSize: '32px 32px'
        }}
      />
      {/* Decorative soft glowing playroom light rays */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300/30 rounded-full blur-[80px]" />
    </div>
  );
};
