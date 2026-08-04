import React from 'react';

export const MagicalForestBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-br from-[#FFFBEB] via-[#FDE047] to-[#F59E0B] select-none">
      {/* Premium playroom educational doodle patterns (faint outlines) */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="edu-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Science Flask */}
            <path d="M20 30 L20 20 H30 L30 30 L15 50 H35 Z" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Math plus and minus */}
            <path d="M70 20 V30 M65 25 H75" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M70 45 H80" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            {/* Star */}
            <polygon points="15,80 18,86 25,87 20,92 21,98 15,95 9,98 10,92 5,87 12,86" fill="none" stroke="#B45309" strokeWidth="2.5" />
            {/* Pencil */}
            <path d="M95 80 L105 90 L108 102 L98 99 Z" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Music Note */}
            <circle cx="50" cy="90" r="5" fill="none" stroke="#B45309" strokeWidth="2.5" />
            <path d="M55 70 V90" stroke="#B45309" strokeWidth="2.5" />
            <path d="M55 70 Q70 70, 70 80" fill="none" stroke="#B45309" strokeWidth="2.5" />
            {/* Atom outline */}
            <ellipse cx="60" cy="60" rx="15" ry="6" fill="none" stroke="#B45309" strokeWidth="1.5" transform="rotate(30 60 60)" />
            <ellipse cx="60" cy="60" rx="15" ry="6" fill="none" stroke="#B45309" strokeWidth="1.5" transform="rotate(-30 60 60)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#edu-pattern)" />
      </svg>
      {/* Decorative soft glowing playroom light rays */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300/30 rounded-full blur-[80px]" />
    </div>
  );
};
