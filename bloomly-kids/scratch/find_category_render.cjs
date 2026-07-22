const fs = require('fs');

const menu = fs.readFileSync('src/components/GameGridMenu.tsx', 'utf8');
const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');

console.log('=== GameGridMenu category games view ===');
menu.split('\n').forEach((l, i) => {
  if (l.includes('activeCategory') || l.includes('categoriesData') || l.includes('games.map') || l.includes('islandsData')) {
    console.log(`${i+1}: ${l.substring(0, 110)}`);
  }
});

console.log('\n=== GameZone category games view ===');
gz.split('\n').forEach((l, i) => {
  if (l.includes('activeCategory') && (l.includes('map') || l.includes('grid') || l.includes('Category'))) {
    console.log(`${i+1}: ${l.substring(0, 110)}`);
  }
});
