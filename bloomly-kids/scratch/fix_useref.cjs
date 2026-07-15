const fs = require('fs');

const games = [
  'src/components/games/NinjaGame.tsx',
  'src/components/games/SpaceGame.tsx',
  'src/components/games/SubwayGame.tsx'
];

for (const game of games) {
  let text = fs.readFileSync(game, 'utf8');
  text = text.replace(/useRef<number>\(\)/g, 'useRef<number>(0)');
  fs.writeFileSync(game, text, 'utf8');
}

console.log("Fixed TS errors in games!");
