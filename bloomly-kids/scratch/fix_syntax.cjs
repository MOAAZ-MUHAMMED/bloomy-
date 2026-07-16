const fs = require('fs');

function fixFile(file) {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/\\`/g, '`');
  text = text.replace(/\\\$/g, '$');
  fs.writeFileSync(file, text, 'utf8');
}

fixFile('src/components/games/NinjaGame.tsx');
fixFile('src/components/games/SpaceGame.tsx');
fixFile('src/components/games/SubwayGame.tsx');

// For GameGridMenu.tsx, the error is:
// src/components/GameGridMenu.tsx(61,9): error TS1005: '}' expected.
// Let's check what's wrong with GameGridMenu.tsx
let ggm = fs.readFileSync('src/components/GameGridMenu.tsx', 'utf8');
console.log(ggm.slice(0, 1000)); // We need to investigate GameGridMenu
