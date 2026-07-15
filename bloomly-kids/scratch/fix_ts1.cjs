const fs = require('fs');

// Fix GameZone.tsx
const gzPath = 'src/components/GameZone.tsx';
let gzText = fs.readFileSync(gzPath, 'utf8');
gzText = gzText.replace(/awardStarsAndFinishLevel/g, 'addStars');
fs.writeFileSync(gzPath, gzText, 'utf8');

// Fix NinjaGame.tsx, SpaceGame.tsx, SubwayGame.tsx
const games = ['NinjaGame.tsx', 'SpaceGame.tsx', 'SubwayGame.tsx'];
for (const game of games) {
  const p = 'src/components/games/' + game;
  let text = fs.readFileSync(p, 'utf8');
  // find out what line has TS2554
  // It's probably playSound("slice") where the signature is playSound(type: "slice" | "bomb" | "gameover")
  // wait, line 33 in NinjaGame: osc.start(now); ?
  // In standard typescript dom lib, oscillator.start(when?: number) expects no arguments or 1 argument.
  // Wait, no. oscillator.start(now) has 1 argument. What is missing 1 argument?
  // Let's just remove the argument or check what's wrong.
  // Actually, I can just typecast it to avoid TS issues. `(osc as any).start(now);`
  // Wait, the error is `src/components/games/NinjaGame.tsx(33,22): error TS2554: Expected 1 arguments, but got 0.`
  // Let's see what is at line 33 of NinjaGame.tsx.
}

console.log("GameZone fixed!");
