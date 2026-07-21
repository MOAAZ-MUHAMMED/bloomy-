const fs = require('fs');
const files = fs.readdirSync('src/components');
const matches = files.filter(f => 
  f.toLowerCase().includes('arabic') || 
  f.toLowerCase().includes('spelling') || 
  f.toLowerCase().includes('sort') || 
  f.toLowerCase().includes('market') ||
  f.toLowerCase().includes('kitchen')
);
console.log('Arabic & Kitchen Component Files:', matches);
