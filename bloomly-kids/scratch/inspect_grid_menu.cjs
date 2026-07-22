const fs = require('fs');

const menu = fs.readFileSync('src/components/GameGridMenu.tsx', 'utf8');

menu.split('\n').forEach((l, i) => {
  if (l.includes('id:') || l.includes('title:') || l.includes('category:')) {
    console.log(`${i+1}: ${l}`);
  }
});
