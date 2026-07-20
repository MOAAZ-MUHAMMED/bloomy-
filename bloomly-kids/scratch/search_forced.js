const fs = require('fs');
const lines = fs.readFileSync('c:/Users/omar/Desktop/Huda-Nour-Site/bloomly-kids/src/components/GameZone.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (line.includes('forcedGameId')) {
    console.log(`${i+1}: ${line}`);
  }
});
