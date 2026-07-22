const fs = require('fs');

const crocFile = fs.readFileSync('src/components/MathHungryCrocodile.tsx', 'utf8');
console.log('=== MathHungryCrocodile.tsx ===');
console.log(crocFile);
