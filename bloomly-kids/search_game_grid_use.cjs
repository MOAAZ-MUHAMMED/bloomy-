const fs = require('fs');
const content = fs.readFileSync('./src/components/GameZone.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('GameGridMenu')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print 5 lines before and 5 after
    const start = Math.max(0, idx - 5);
    const end = Math.min(lines.length - 1, idx + 5);
    for (let i = start; i <= end; i++) {
      console.log(`  [${i + 1}] ${lines[i]}`);
    }
  }
});
