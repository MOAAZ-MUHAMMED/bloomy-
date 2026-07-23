const fs = require('fs');
const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lines = gz.split('\n');
lines.forEach((l, i) => {
  if (l.includes('drawingSymmetry') || l.includes('DrawingSymmetry') || l.includes('drawingNeonArt') || l.includes('DrawingNeonArt')) {
    console.log(`${i+1}: ${l.substring(0, 130)}`);
  }
});
