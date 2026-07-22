const fs = require('fs');

const gameZone = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const mapFile = fs.readFileSync('src/components/LearningPathMap.tsx', 'utf8');

console.log('--- GameZone triggerVictory & startNextLevel check ---');
const gzLines = gameZone.split('\n');
gzLines.forEach((line, i) => {
  if (line.includes('triggerVictory') || line.includes('startNextLevel') || line.includes('bloomly_stars_')) {
    console.log(`GameZone.tsx:${i + 1}`, line.trim().substring(0, 120));
  }
});

console.log('\n--- LearningPathMap starKey & scroll check ---');
const mapLines = mapFile.split('\n');
mapLines.forEach((line, i) => {
  if (line.includes('bloomly_stars_') || line.includes('scrollTo') || line.includes('isLocked') || line.includes('scrollTop')) {
    console.log(`LearningPathMap.tsx:${i + 1}`, line.trim().substring(0, 120));
  }
});
