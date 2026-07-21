const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir);

const mathFiles = files.filter(f => f.toLowerCase().includes('math') || f.toLowerCase().includes('train') || f.toLowerCase().includes('tower') || f.toLowerCase().includes('crocodile') || f.toLowerCase().includes('connect') || f.toLowerCase().includes('dots'));

console.log('Math related files in components:', mathFiles);
