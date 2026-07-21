const fs = require('fs');
const content = fs.readFileSync('src/components/LearningPathMap.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('النيون')) {
    console.log(i + 1, line);
  }
});
