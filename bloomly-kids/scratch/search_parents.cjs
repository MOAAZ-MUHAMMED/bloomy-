const fs = require('fs');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const lines = app.split('\n');
lines.forEach((l, i) => {
  if (l.includes('لوحة تحكم') || l.includes('id="parents"')) {
    console.log(i + 1, l.trim());
  }
});
