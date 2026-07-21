const fs = require('fs');

const catData = fs.readFileSync('src/CategoriesData.ts', 'utf8');
console.log('--- CategoriesData.ts snippet ---');
console.log(catData.substring(0, 1500));

const files = fs.readdirSync('src/components');
console.log('--- All components ---');
console.log(files);
