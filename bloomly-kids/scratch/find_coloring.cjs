const fs = require('fs');
const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lines = gz.split('\n');
lines.forEach((l, i) => {
  if (l.includes('startColoringGame') || l.includes('activeTemplate') || l.includes('drawTemplateOutline') || l.includes('coloringTemplates') || (l.includes('coloring') && l.includes('activeGame'))) {
    console.log(`${i+1}: ${l.substring(0, 120)}`);
  }
});
