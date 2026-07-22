const fs = require('fs');
const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');

gz.split('\n').forEach((l, i) => {
  if (l.toLowerCase().includes('connectdots') || l.toLowerCase().includes('connect_dots') || l.includes('توصيل الأرقام')) {
    console.log(`${i + 1}: ${l.substring(0, 110)}`);
  }
});
