const fs = require('fs');

const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');

gz.split('\n').forEach((l, i) => {
  if (l.includes('englishWordSafari') || l.includes('EnglishWordSafari') || l.includes('startEnglishWordSafari')) {
    console.log(`${i+1}: ${l}`);
  }
});
