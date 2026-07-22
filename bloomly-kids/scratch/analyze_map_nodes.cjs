const fs = require('fs');

const gameZone = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const learningPath = fs.readFileSync('src/components/LearningPathMap.tsx', 'utf8');

console.log('=== GameZone level map generation snippet ===');
const gzLines = gameZone.split('\n');
gzLines.forEach((line, i) => {
  if (line.includes('isLocked') || line.includes('startNextLevel') || line.includes('selectedLevelIndex') || line.includes('triggerVictory')) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});

console.log('\n=== LearningPathMap scroll & level modal snippet ===');
const lpLines = learningPath.split('\n');
lpLines.forEach((line, i) => {
  if (line.includes('scrollTo') || line.includes('scrollTop') || line.includes('modal') || line.includes('selectedIsland')) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});
