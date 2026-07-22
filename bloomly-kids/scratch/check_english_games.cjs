const fs = require('fs');

const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const cat = fs.readFileSync('src/components/CategoriesData.ts', 'utf8');

console.log('=== CategoriesData english category ===');
cat.split('\n').forEach((l, i) => {
  if (l.includes('english') || (i >= 63 && i <= 73)) {
    console.log(`${i+1}: ${l}`);
  }
});

console.log('\n=== Searching GameZone for activeCategory === "english" ===');
gz.split('\n').forEach((l, i) => {
  if (l.includes('activeCategory === "english"') || l.includes('activeCategory === \'english\'') || l.includes('activeCategory') && l.includes('english')) {
    console.log(`${i+1}: ${l}`);
  }
});
