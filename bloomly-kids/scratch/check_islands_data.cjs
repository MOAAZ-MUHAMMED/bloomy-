const fs = require('fs');

const lpm = fs.readFileSync('src/components/LearningPathMap.tsx', 'utf8');

console.log('=== islandsData game IDs ===');
lpm.split('\n').forEach((l, i) => {
  if (l.includes('id:') || l.includes('title:') || l.includes('gameName:')) {
    console.log(`${i+1}: ${l}`);
  }
});
