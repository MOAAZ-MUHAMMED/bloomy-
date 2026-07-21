const fs = require('fs');
const content = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('activeGame === "spelling"') && line.includes('!showLevelMap')) {
    console.log(i + 1, line.trim());
  }
});
