const fs = require('fs');

const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');

console.log('=== spellingEn bank and questions in GameZone ===');
const gzLines = gz.split('\n');
gzLines.forEach((l, i) => {
  if (i >= 3830 && i <= 3915) {
    console.log(`${i+1}: ${l}`);
  }
});

console.log('\n=== Space game section in GameZone ===');
gzLines.forEach((l, i) => {
  if (l.includes('startSpaceGame') || l.includes('spaceEnemies') || l.includes('space') && i > 6200 && i < 6360) {
    console.log(`${i+1}: ${l.substring(0, 100)}`);
  }
});
