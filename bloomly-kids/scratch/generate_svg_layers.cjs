const fs = require('fs');
const path = require('path');

// Create folder mascot_apple_v2 in project root
const outputDir = path.join(__dirname, '..', 'mascot_apple_v2');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// SVG contents for each layer

// 1. body.svg - Beautiful apple shape with radial red gradient and glossy highlight
const body_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="redGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FF5252" />
      <stop offset="70%" stop-color="#E53935" />
      <stop offset="100%" stop-color="#C62828" />
    </radialGradient>
    <linearGradient id="glossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Apple Body Shape -->
  <path d="M 250 130 
           C 285 105, 390 100, 420 180 
           C 450 260, 390 380, 310 410 
           C 275 425, 260 415, 250 415 
           C 240 415, 225 425, 190 410 
           C 110 380, 50 260, 80 180 
           C 110 100, 215 105, 250 130 Z" 
        fill="url(#redGrad)" stroke="#4A0E0E" stroke-width="6" stroke-linejoin="round"/>
        
  <!-- Glossy Highlight Area on the top left -->
  <path d="M 120 180 
           C 130 140, 200 130, 240 145 
           C 200 150, 140 170, 130 210
           C 125 200, 118 190, 120 180 Z" 
        fill="url(#glossGrad)"/>
</svg>`;

// 2. eye_left.svg - White left oval eye
const eye_left_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200" width="150" height="200">
  <ellipse cx="75" cy="100" rx="45" ry="70" fill="#FFFFFF" stroke="#263238" stroke-width="5"/>
</svg>`;

// 3. eye_right.svg - White right oval eye
const eye_right_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200" width="150" height="200">
  <ellipse cx="75" cy="100" rx="45" ry="70" fill="#FFFFFF" stroke="#263238" stroke-width="5"/>
</svg>`;

// 4. pupil_left.svg - Black pupil with white reflections
const pupil_left_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150" width="100" height="150">
  <!-- Black Pupil -->
  <ellipse cx="50" cy="75" rx="25" ry="40" fill="#212121"/>
  <!-- Highlight Shines -->
  <circle cx="42" cy="55" r="9" fill="#FFFFFF"/>
  <circle cx="58" cy="95" r="5" fill="#FFFFFF"/>
</svg>`;

// 5. pupil_right.svg - Black pupil with white reflections
const pupil_right_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150" width="100" height="150">
  <!-- Black Pupil -->
  <ellipse cx="50" cy="75" rx="25" ry="40" fill="#212121"/>
  <!-- Highlight Shines -->
  <circle cx="42" cy="55" r="9" fill="#FFFFFF"/>
  <circle cx="58" cy="95" r="5" fill="#FFFFFF"/>
</svg>`;

// 6. eyebrows.svg - Happy curved eyebrows
const eyebrows_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
  <!-- Left Eyebrow Arch -->
  <path d="M 30 70 C 50 30, 100 30, 120 65" fill="none" stroke="#212121" stroke-width="8" stroke-linecap="round"/>
  <!-- Right Eyebrow Arch -->
  <path d="M 180 65 C 200 30, 250 30, 270 70" fill="none" stroke="#212121" stroke-width="8" stroke-linecap="round"/>
</svg>`;

// 7. nose.svg - Small round red button nose
const nose_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <defs>
    <radialGradient id="noseGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FF8A80" />
      <stop offset="60%" stop-color="#FF5252" />
      <stop offset="100%" stop-color="#D50000" />
    </radialGradient>
  </defs>
  <circle cx="40" cy="40" r="30" fill="url(#noseGrad)" stroke="#4A0E0E" stroke-width="3"/>
  <circle cx="32" cy="30" r="7" fill="#FFFFFF" opacity="0.6"/>
</svg>`;

// 8. mouth.svg - Open D-shape smiling mouth with teeth and tongue
const mouth_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
  <defs>
    <clipPath id="mouthClip">
      <path d="M 10 20 L 190 20 C 190 20, 170 110, 100 110 C 30 110, 10 20, 10 20 Z" />
    </clipPath>
  </defs>
  <!-- Main Mouth Cavity -->
  <path d="M 10 20 L 190 20 C 190 20, 170 110, 100 110 C 30 110, 10 20, 10 20 Z" 
        fill="#212121" stroke="#4A0E0E" stroke-width="5" stroke-linejoin="round"/>
        
  <!-- Inside Mouth (Teeth and Tongue clipped inside) -->
  <g clip-path="url(#mouthClip)">
    <!-- White Upper Tooth -->
    <path d="M 15 20 L 185 20 L 185 45 C 150 45, 50 45, 15 45 Z" fill="#FFFFFF" />
    <!-- Pink Tongue -->
    <path d="M 50 110 C 50 80, 150 80, 150 110 Z" fill="#FF8A80" stroke="#FF5252" stroke-width="2"/>
  </g>
</svg>`;

// 9. stem.svg - Curved brown stem
const stem_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200">
  <path d="M 50 180 C 45 120, 20 60, 10 30" fill="none" stroke="#5D4037" stroke-width="14" stroke-linecap="round"/>
</svg>`;

// 10. leaf.svg - Pointy green leaf with veins
const leaf_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="150" height="100">
  <defs>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#81C784" />
      <stop offset="100%" stop-color="#4CAF50" />
    </linearGradient>
  </defs>
  <!-- Leaf Shape -->
  <path d="M 10 80 C 40 40, 100 30, 140 20 C 110 50, 70 80, 10 80 Z" 
        fill="url(#leafGrad)" stroke="#1B5E20" stroke-width="4" stroke-linejoin="round"/>
  <!-- Central Vein -->
  <path d="M 10 80 C 50 60, 100 45, 140 20" fill="none" stroke="#1B5E20" stroke-width="2"/>
</svg>`;

// 11. arm_left.svg - Curved left arm (resting pose)
const arm_left_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="150" height="150">
  <path d="M 130 20 C 80 50, 50 80, 40 120" fill="none" stroke="#212121" stroke-width="10" stroke-linecap="round"/>
</svg>`;

// 12. arm_right.svg - Curved right arm (raised waving pose)
const arm_right_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="150" height="150">
  <path d="M 20 130 C 50 100, 80 70, 120 40" fill="none" stroke="#212121" stroke-width="10" stroke-linecap="round"/>
</svg>`;

// 13. glove_left.svg - Left glove resting on hip
const glove_left_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Glove Palm -->
  <circle cx="50" cy="50" r="30" fill="#FFFFFF" stroke="#212121" stroke-width="4"/>
  <!-- Cuff -->
  <path d="M 30 25 C 40 20, 60 20, 70 25" fill="none" stroke="#212121" stroke-width="6" stroke-linecap="round"/>
</svg>`;

// 14. glove_right.svg - Waving right hand glove with 4 open fingers
const glove_right_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <!-- Waving Glove Palm & Fingers splayed open -->
  <path d="M 30 65 
           C 25 50, 30 30, 42 32 
           C 48 33, 46 45, 52 40
           C 58 35, 60 15, 70 18
           C 78 20, 72 40, 80 38
           C 88 36, 92 20, 100 24
           C 106 27, 98 48, 102 52
           C 106 55, 115 48, 118 56
           C 120 64, 105 85, 80 95
           C 55 105, 35 80, 30 65 Z" 
        fill="#FFFFFF" stroke="#212121" stroke-width="4" stroke-linejoin="round"/>
  <!-- Glove Cuff -->
  <path d="M 45 92 C 55 98, 70 95, 78 88" fill="none" stroke="#212121" stroke-width="5" stroke-linecap="round"/>
</svg>`;

// Write all layers to mascot_apple_v2/
const layers = {
  "body.svg": body_svg,
  "eye_left.svg": eye_left_svg,
  "eye_right.svg": eye_right_svg,
  "pupil_left.svg": pupil_left_svg,
  "pupil_right.svg": pupil_right_svg,
  "eyebrows.svg": eyebrows_svg,
  "nose.svg": nose_svg,
  "mouth.svg": mouth_svg,
  "stem.svg": stem_svg,
  "leaf.svg": leaf_svg,
  "arm_left.svg": arm_left_svg,
  "arm_right.svg": arm_right_svg,
  "glove_left.svg": glove_left_svg,
  "glove_right.svg": glove_right_svg
};

for (const [filename, content] of Object.entries(layers)) {
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, content, 'utf8');
}

console.log("SUCCESS: Generated 14 SVG layers inside mascot_apple_v2/ folder!");
