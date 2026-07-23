const fs = require('fs');
const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lines = gz.split('\n');
lines.forEach((l, i) => {
  if (l.includes('triggerVictory') && !l.includes('//')) {
    console.log(`${i+1}: ${l.substring(0, 130)}`);
  }
});
console.log('\n=== convertToOutline ===');
lines.forEach((l, i) => {
  if (l.includes('convertToOutline') || l.includes('floodFill')) {
    console.log(`${i+1}: ${l.substring(0, 130)}`);
  }
});
