import React from 'react';

export const MagicalForestBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-b from-[#FEF08A] via-[#FDE047] to-[#EAB308] select-none">
      {/* Soft Playroom Ambient Background Texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(#CA8A04 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />
      {/* Subtle Warm Playroom Center Highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-white/20 rounded-full blur-3xl" />
    </div>
  );
};
