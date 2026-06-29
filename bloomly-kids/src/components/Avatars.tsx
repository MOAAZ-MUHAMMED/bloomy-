interface AvatarProps {
  className?: string;
}

export function BoyAvatar({ className }: AvatarProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle Gradient */}
      <circle cx="60" cy="60" r="56" fill="url(#boyGrad)" stroke="#4D2B82" strokeWidth="4" />
      <defs>
        <linearGradient id="boyGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#87CEFA" />
          <stop offset="100%" stopColor="#1E90FF" />
        </linearGradient>
      </defs>
      
      {/* Neck */}
      <rect x="52" y="80" width="16" height="15" rx="4" fill="#FCE3C6" stroke="#4D2B82" strokeWidth="3" />
      
      {/* Face */}
      <circle cx="60" cy="55" r="32" fill="#FCE3C6" stroke="#4D2B82" strokeWidth="4" />
      
      {/* Ears */}
      <circle cx="26" cy="55" r="8" fill="#FCE3C6" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="94" cy="55" r="8" fill="#FCE3C6" stroke="#4D2B82" strokeWidth="3" />
      
      {/* Hair (Cute brown spikes) */}
      <path d="M 28 50 C 28 20, 92 20, 92 50 C 82 25, 38 25, 28 50 Z" fill="#8B4513" stroke="#4D2B82" strokeWidth="3" />
      <path d="M 40 28 Q 50 15 60 25 Q 70 15 80 28" fill="#8B4513" stroke="#4D2B82" strokeWidth="3" />
      
      {/* Eyes (Sparkly) */}
      <circle cx="48" cy="52" r="4.5" fill="#4D2B82" />
      <circle cx="46.5" cy="50.5" r="1.5" fill="white" />
      <circle cx="72" cy="52" r="4.5" fill="#4D2B82" />
      <circle cx="70.5" cy="50.5" r="1.5" fill="white" />
      
      {/* Rosy Cheeks */}
      <circle cx="38" cy="62" r="4" fill="#FF8A8A" opacity="0.6" />
      <circle cx="82" cy="62" r="4" fill="#FF8A8A" opacity="0.6" />
      
      {/* Smile */}
      <path d="M 52 64 Q 60 74 68 64" stroke="#4D2B82" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      
      {/* T-Shirt Collar */}
      <path d="M 40 94 Q 60 106 80 94" fill="#1E90FF" stroke="#4D2B82" strokeWidth="3.5" />
      <path d="M 36 94 L 84 94 L 76 114 L 44 114 Z" fill="#FFD700" stroke="#4D2B82" strokeWidth="3" />
    </svg>
  );
}

export function GirlAvatar({ className }: AvatarProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle Gradient */}
      <circle cx="60" cy="60" r="56" fill="url(#girlGrad)" stroke="#4D2B82" strokeWidth="4" />
      <defs>
        <linearGradient id="girlGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA07A" />
          <stop offset="100%" stopColor="#FF69B4" />
        </linearGradient>
      </defs>
      
      {/* Neck */}
      <rect x="52" y="80" width="16" height="15" rx="4" fill="#FCE3C6" stroke="#4D2B82" strokeWidth="3" />
      
      {/* Face */}
      <circle cx="60" cy="55" r="32" fill="#FCE3C6" stroke="#4D2B82" strokeWidth="4" />
      
      {/* Ears */}
      <circle cx="26" cy="55" r="8" fill="#FCE3C6" stroke="#4D2B82" strokeWidth="3" />
      <circle cx="94" cy="55" r="8" fill="#FCE3C6" stroke="#4D2B82" strokeWidth="3" />
      
      {/* Hair (Cute bob hair with bangs) */}
      <path d="M 26 55 C 22 20, 98 20, 94 55 C 96 68, 92 72, 90 72 C 86 52, 34 52, 30 72 C 28 72, 24 68, 26 55 Z" fill="#D2691E" stroke="#4D2B82" strokeWidth="3" />
      
      {/* Pink Hair Bow */}
      <path d="M 52 20 L 68 20 L 60 28 Z" fill="#E01E5A" stroke="#4D2B82" strokeWidth="2.5" />
      <circle cx="60" cy="20" r="4.5" fill="#FFD700" stroke="#4D2B82" strokeWidth="2" />
      
      {/* Eyes with Lashes */}
      <circle cx="48" cy="52" r="4.5" fill="#4D2B82" />
      <circle cx="46.5" cy="50.5" r="1.5" fill="white" />
      <path d="M 42 48 Q 46 45 49 48" stroke="#4D2B82" strokeWidth="2" strokeLinecap="round" fill="none" />
      
      <circle cx="72" cy="52" r="4.5" fill="#4D2B82" />
      <circle cx="70.5" cy="50.5" r="1.5" fill="white" />
      <path d="M 78 48 Q 74 45 71 48" stroke="#4D2B82" strokeWidth="2" strokeLinecap="round" fill="none" />
      
      {/* Rosy Cheeks */}
      <circle cx="38" cy="62" r="4" fill="#FF8A8A" opacity="0.6" />
      <circle cx="82" cy="62" r="4" fill="#FF8A8A" opacity="0.6" />
      
      {/* Smile */}
      <path d="M 52 64 Q 60 74 68 64" stroke="#4D2B82" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      
      {/* T-Shirt Collar */}
      <path d="M 40 94 Q 60 106 80 94" fill="#FF69B4" stroke="#4D2B82" strokeWidth="3.5" />
      <path d="M 36 94 L 84 94 L 76 114 L 44 114 Z" fill="#FFF0F5" stroke="#4D2B82" strokeWidth="3" />
    </svg>
  );
}
