const fs = require('fs');
const content = fs.readFileSync('src/components/GameZone.tsx', 'utf8');

let openBraces = 0;
let closeBraces = 0;
const lines = content.split('\n');

lines.forEach((line, idx) => {
  for (let char of line) {
    if (char === '{') openBraces++;
    if (char === '}') closeBraces++;
  }
});

console.log(`Open Braces {: ${openBraces}`);
console.log(`Close Braces }: ${closeBraces}`);
console.log(`Difference: ${openBraces - closeBraces}`);
