const fs = require('fs');

const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const sym = fs.readFileSync('src/components/DrawingSymmetry.tsx', 'utf8');
const neon = fs.readFileSync('src/components/DrawingNeonArt.tsx', 'utf8');

console.log('=== DrawingSymmetry snippet ===');
console.log(sym.substring(0, 1500));

console.log('\n=== Coloring section in GameZone ===');
gz.split('\n').forEach((l, i) => {
  if (l.includes('activeGame === "coloring"') || l.includes('activeTemplate') || l.includes('drawTemplateOutline')) {
    console.log(`${i+1}: ${l.substring(0, 100)}`);
  }
});
