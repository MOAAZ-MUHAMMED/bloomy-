const fs = require('fs');

const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lpm = fs.readFileSync('src/components/LearningPathMap.tsx', 'utf8');
const ggm = fs.readFileSync('src/components/GameGridMenu.tsx', 'utf8');

console.log('=== Checking GameZone triggerVictory calls ===');
const matches = [];
gz.split('\n').forEach((line, idx) => {
  if (line.includes('triggerVictory') || line.includes('startNextLevel') || line.includes('selectedLevelIndex')) {
    matches.push(`${idx + 1}: ${line.trim()}`);
  }
});
console.log(matches.join('\n'));

console.log('\n=== Checking LearningPathMap Star Keys & Locks ===');
const lpmMatches = [];
lpm.split('\n').forEach((line, idx) => {
  if (line.includes('bloomly_stars_') || line.includes('isLocked') || line.includes('scrollTop') || line.includes('scrollTo')) {
    lpmMatches.push(`${idx + 1}: ${line.trim()}`);
  }
});
console.log(lpmMatches.join('\n'));
