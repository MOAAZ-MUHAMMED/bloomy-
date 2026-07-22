const fs = require('fs');

const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const tracing = fs.readFileSync('src/components/ArabicLetterTracing.tsx', 'utf8');

console.log('=== Arabic Letter Tracing code snippet ===');
console.log(tracing.substring(0, 1500));

console.log('\n=== Spelling question generation snippet in GameZone ===');
const gzLines = gz.split('\n');
gzLines.forEach((l, i) => {
  if (i >= 3270 && i <= 3360) {
    console.log(`${i+1}: ${l}`);
  }
});
