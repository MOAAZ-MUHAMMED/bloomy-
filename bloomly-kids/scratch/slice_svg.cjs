const fs = require('fs');
const path = require('path');

const outputFolder = path.join(__dirname, '..', 'mascot_apple_layers');
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// 1. Defs common definitions
const defs = `
  <defs>
    <radialGradient id="apple-grad" cx="42%" cy="28%" r="65%">
      <stop offset="0%" stop-color="#FF6B6B" />
      <stop offset="40%" stop-color="#FF3838" />
      <stop offset="80%" stop-color="#D90000" />
      <stop offset="100%" stop-color="#8F0000" />
    </radialGradient>
    <linearGradient id="apple-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C5F942" />
      <stop offset="100%" stop-color="#3F7A1E" />
    </linearGradient>
  </defs>
`;

const layers = [
  {
    name: 'body.svg',
    width: 200,
    height: 180,
    content: `
      <path d="M 100 28 
               C 72 8, 5 10, 5 80 
               C 5 145, 50 170, 95 168 
               C 98 166, 102 166, 105 168 
               C 150 170, 195 145, 195 80 
               C 195 10, 128 8, 100 28 Z" 
            fill="url(#apple-grad)" 
            stroke="#3D0B00" 
            stroke-width="5.5"/>
      <path d="M 30 34 C 50 24, 86 26, 92 31 C 65 33, 42 45, 30 34 Z" fill="url(#apple-highlight)" />
    `
  },
  {
    name: 'leaf.svg',
    width: 80,
    height: 50,
    content: `
      <path d="M 5 25 C 25 7, 55 15, 55 25 C 55 41, 25 41, 5 25 Z" fill="url(#leaf-grad)" stroke="#224D0F" stroke-width="3"/>
    `
  },
  {
    name: 'stem.svg',
    width: 30,
    height: 60,
    content: `
      <path d="M 25 57 Q 19 17, 11 5" fill="none" stroke="#5D4037" stroke-width="10" stroke-linecap="round"/>
    `
  },
  {
    name: 'eye_left.svg',
    width: 40,
    height: 55,
    content: `
      <g transform="translate(20, 26)">
        <ellipse cx="0" cy="0" rx="17" ry="24" fill="#FFF" stroke="#222" stroke-width="4"/>
        <ellipse cx="2" cy="2" rx="10.5" ry="14" fill="#111"/>
        <circle cx="0.5" cy="-4" r="5" fill="#FFF"/>
        <circle cx="5" cy="5" r="2.5" fill="#FFF"/>
      </g>
    `
  },
  {
    name: 'eye_right.svg',
    width: 40,
    height: 55,
    content: `
      <g transform="translate(20, 26)">
        <ellipse cx="0" cy="0" rx="17" ry="24" fill="#FFF" stroke="#222" stroke-width="4"/>
        <ellipse cx="-2" cy="2" rx="10.5" ry="14" fill="#111"/>
        <circle cx="-3.5" cy="-4" r="5" fill="#FFF"/>
        <circle cx="1" cy="5" r="2.5" fill="#FFF"/>
      </g>
    `
  },
  {
    name: 'eyebrows.svg',
    width: 120,
    height: 30,
    content: `
      <path d="M 12 18 Q 30 8, 46 16" fill="none" stroke="#222" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M 74 16 Q 90 8, 108 18" fill="none" stroke="#222" stroke-width="4.5" stroke-linecap="round"/>
    `
  },
  {
    name: 'mouth.svg',
    width: 60,
    height: 45,
    content: `
      <g transform="translate(5, 5)">
        <path d="M6 6 Q26 -4, 46 6 Q51 34, 26 34 Q1 34, 6 6 Z" fill="#421200" stroke="#222" stroke-width="4" stroke-linejoin="round"/>
        <path d="M13 3.5 Q26 1, 39 3.5 L37 11 Q26 12, 15 11 Z" fill="#FFF"/>
        <path d="M13 25 C16 18, 36 18, 39 25 C34 32, 18 32, 13 25 Z" fill="#FF8A80"/>
      </g>
    `
  },
  {
    name: 'left_arm_glove.svg',
    width: 60,
    height: 80,
    content: `
      <path d="M 45 5 C 18 18, 21 48, 28 68" fill="none" stroke="#222" stroke-width="7" stroke-linecap="round"/>
      <g transform="translate(15, 58) rotate(-15)">
        <path d="M15 5 C22 5, 27 10, 27 18 C27 26, 20 30, 13 30 C6 30, 1 25, 1 18 C1 10, 8 5, 15 5 Z" fill="#FFF" stroke="#222" stroke-width="3"/>
        <path d="M7 14 C10 11, 16 11, 19 14" fill="none" stroke="#222" stroke-width="2"/>
        <line x1="11" y1="12" x2="9" y2="24" stroke="#222" stroke-width="2"/>
        <line x1="15" y1="12" x2="14" y2="24" stroke="#222" stroke-width="2"/>
      </g>
    `
  },
  {
    name: 'right_arm.svg',
    width: 50,
    height: 70,
    content: `
      <path d="M 5 62 C 32 53, 37 29, 29 2" fill="none" stroke="#222" stroke-width="7" stroke-linecap="round"/>
    `
  },
  {
    name: 'right_glove.svg',
    width: 45,
    height: 45,
    content: `
      <g transform="translate(5, 5) rotate(15)">
        <path d="M12 28 
                 C10 28, 4 24, 4 18 
                 C4 12, 10 12, 12 18 
                 C12 10, 18 10, 18 18 
                 C18 9, 24 9, 24 18 
                 C24 10, 29 12, 29 19
                 C29 26, 22 30, 12 28 Z" 
              fill="#FFF" stroke="#222" stroke-width="3" stroke-linejoin="round"/>
        <line x1="11" y1="21" x2="10" y2="27" stroke="#222" stroke-width="2"/>
        <line x1="15" y1="21" x2="16" y2="27" stroke="#222" stroke-width="2"/>
      </g>
    `
  }
];

layers.forEach(layer => {
  const filePath = path.join(outputFolder, layer.name);
  const fileContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${layer.width}" height="${layer.height}" viewBox="0 0 ${layer.width} ${layer.height}" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  ${layer.content}
</svg>`;
  
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Saved: ${filePath}`);
});

console.log('All apple layers sliced and exported as SVGs successfully!');
