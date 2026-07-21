const fs = require('fs');
const path = require('path');

const files = [
  'src/components/DailyHabitsGame.tsx',
  'src/components/DrawingSymmetry.tsx',
  'src/components/GameZone.tsx',
  'src/components/LearningPathMap.tsx'
];

files.forEach(f => {
  const fullPath = path.resolve(f);
  if (!fs.existsSync(fullPath)) {
    console.error('Missing file:', f);
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  console.log(`Checking ${f}: ${content.length} bytes`);
});

console.log('All checked!');
