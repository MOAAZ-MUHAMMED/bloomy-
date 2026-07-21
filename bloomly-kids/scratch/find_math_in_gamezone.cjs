const fs = require('fs');
const content = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('Math') || line.includes('math') || line.includes('حساب') || line.includes('توصيل')) {
    if (line.includes('const') || line.includes('function') || line.includes('<') || line.includes('activeGame')) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  }
});
