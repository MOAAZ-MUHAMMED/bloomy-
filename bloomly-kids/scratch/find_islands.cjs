const fs = require('fs');
const lpm = fs.readFileSync('src/components/LearningPathMap.tsx', 'utf8');
const lines = lpm.split('\n');
const games = ['catcher', 'spaceCatcher', 'tapRacer', 'arrowRacer', 'maze', 'safari', 'train'];
games.forEach(g => {
  lines.forEach((l, i) => {
    if (l.includes(`id: "${g}"`) || (l.includes(`"${g}"`) && l.includes('title:'))) {
      // Print 15 lines from match
      for (let j = i; j < Math.min(i + 14, lines.length); j++) {
        console.log(`${j+1}: ${lines[j].substring(0, 120)}`);
      }
      console.log('---');
    }
  });
});
