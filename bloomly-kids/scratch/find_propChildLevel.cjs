const fs = require('fs');
const content = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('propChildLevel')) {
    console.log(`Line ${index + 1}: ${line}`);
  }
});
