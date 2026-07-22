const fs = require('fs');
const path = require('path');

const compDir = 'src/components';
const files = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx'));

console.log('=== Auditing onComplete calls in components ===');
files.forEach(file => {
  const filePath = path.join(compDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('onComplete')) {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('onComplete(')) {
        console.log(`${file}:${idx + 1}`, line.trim());
      }
    });
  }
});
