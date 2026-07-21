const fs = require('fs');
const file = 'c:/Users/omar/Desktop/Huda-Nour-Site/bloomly-kids/src/components/GameZone.tsx';
let code = fs.readFileSync(file, 'utf8');

// Delete Template Picker section
const startStr = '{/* Template Picker */}';
const endStr = '{/* Color Palette */}';
const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
  fs.writeFileSync(file, code);
  console.log('Removed template picker');
} else {
  console.log('Could not find template picker');
}
