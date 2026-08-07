const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'mascot_apple_v2');

// 1. Premium 3D-shaded Apple Body
const body_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <!-- Ultra-premium 3D Radial Gradient for volumetric look -->
    <radialGradient id="apple3D" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FF6B6B" />
      <stop offset="40%" stop-color="#EE2E2E" />
      <stop offset="85%" stop-color="#B71C1C" />
      <stop offset="100%" stop-color="#7F0000" />
    </radialGradient>
    <!-- Soft Drop Shadow under the leaf/stem -->
    <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <!-- High-gloss lacquer highlight -->
    <linearGradient id="glossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.1"/>
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
        fill="url(#apple3D)" stroke="#4A0000" stroke-width="7" stroke-linejoin="round"/>

  <!-- Shadow under stem -->
  <ellipse cx="250" cy="135" rx="35" ry="12" fill="url(#shadowGrad)"/>

  <!-- Premium 3D Gloss Highlight -->
  <path d="M 125 175 
           C 135 135, 205 125, 245 140 
           C 195 145, 145 165, 135 205
           C 130 195, 123 185, 125 175 Z" 
        fill="url(#glossGrad)"/>
</svg>`;

// 2. 3D Eyeballs with soft inner depth shadow
const eye_left_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200" width="150" height="200">
  <defs>
    <radialGradient id="eyeShadow" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E0E0E0" />
    </radialGradient>
  </defs>
  <ellipse cx="75" cy="100" rx="45" ry="70" fill="url(#eyeShadow)" stroke="#212121" stroke-width="6"/>
</svg>`;

const eye_right_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200" width="150" height="200">
  <defs>
    <radialGradient id="eyeShadow" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E0E0E0" />
    </radialGradient>
  </defs>
  <ellipse cx="75" cy="100" rx="45" ry="70" fill="url(#eyeShadow)" stroke="#212121" stroke-width="6"/>
</svg>`;

// 3. Cute shiny Nose button
const nose_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <defs>
    <radialGradient id="noseGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FF8A80" />
      <stop offset="55%" stop-color="#FF2D2D" />
      <stop offset="100%" stop-color="#B71C1C" />
    </radialGradient>
  </defs>
  <circle cx="40" cy="40" r="30" fill="url(#noseGrad)" stroke="#4A0000" stroke-width="4"/>
  <circle cx="31" cy="29" r="8" fill="#FFFFFF" opacity="0.75"/>
</svg>`;

// 4. White Gloves with 3D gradient shading
const glove_left_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="gloveGrad" cx="40%" cy="40%" r="60%">
      <stop offset="75%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#ECEFF1" />
    </radialGradient>
  </defs>
  <!-- Glove Palm -->
  <circle cx="50" cy="50" r="30" fill="url(#gloveGrad)" stroke="#212121" stroke-width="5"/>
  <!-- Cuff -->
  <path d="M 30 25 C 40 20, 60 20, 70 25" fill="none" stroke="#212121" stroke-width="6" stroke-linecap="round"/>
</svg>`;

const glove_right_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="gloveGrad" cx="40%" cy="40%" r="60%">
      <stop offset="75%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#ECEFF1" />
    </radialGradient>
  </defs>
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
        fill="url(#gloveGrad)" stroke="#212121" stroke-width="5" stroke-linejoin="round"/>
  <!-- Glove Cuff -->
  <path d="M 45 92 C 55 98, 70 95, 78 88" fill="none" stroke="#212121" stroke-width="6" stroke-linecap="round"/>
</svg>`;

// Write premium versions to replace basic files
fs.writeFileSync(path.join(outputDir, "body.svg"), body_svg, 'utf8');
fs.writeFileSync(path.join(outputDir, "eye_left.svg"), eye_left_svg, 'utf8');
fs.writeFileSync(path.join(outputDir, "eye_right.svg"), eye_right_svg, 'utf8');
fs.writeFileSync(path.join(outputDir, "nose.svg"), nose_svg, 'utf8');
fs.writeFileSync(path.join(outputDir, "glove_left.svg"), glove_left_svg, 'utf8');
fs.writeFileSync(path.join(outputDir, "glove_right.svg"), glove_right_svg, 'utf8');

console.log("SUCCESS: Replaced SVG files with 3D-shaded premium vector versions!");
