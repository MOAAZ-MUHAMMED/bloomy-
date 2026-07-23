const fs = require('fs');
const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lines = gz.split('\n');
lines.forEach((l, i) => {
  if (l.includes('startChefGame') || l.includes('chefRecipes') || l.includes('chefRound') || (l.includes('chef') && l.includes('activeGame'))) {
    console.log(`${i+1}: ${l.substring(0, 120)}`);
  }
});
