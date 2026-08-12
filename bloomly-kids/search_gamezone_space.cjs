const fs = require('fs');
const content = fs.readFileSync('./src/components/GameZone.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('space') && line.includes(':')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
