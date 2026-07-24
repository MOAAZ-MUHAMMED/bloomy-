const fs = require('fs');
const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const lines = gz.split('\n');

const games = {
  catcher: ['startCatcherGame', 'catcherItem', 'catcherFeedback', 'handleCatch', 'catcherSpeed', 'catcherCloud', 'activeGame === "catcher"'],
  spaceCatcher: ['startSpaceCatcherGame', 'spaceCatcherItem', 'spaceCatcher', 'activeGame === "spaceCatcher"'],
  maze: ['startMazeGame', 'mazeGrid', 'mazePlayer', 'mazeRound', 'activeGame === "maze"', 'generateMaze'],
  safari: ['startSafariGame', 'safariItem', 'safariData', 'safariAnimals', 'activeGame === "safari"'],
  train: ['startTrainGame', 'trainPattern', 'trainRound', 'trainSequence', 'activeGame === "train"'],
  tapRacer: ['startTapRacerGame', 'tapRacer', 'activeGame === "tapRacer"'],
  arrowRacer: ['startRunnerGame', 'arrowRacer', 'activeGame === "arrowRacer"']
};

for (const [game, keywords] of Object.entries(games)) {
  console.log(`\n=== ${game.toUpperCase()} ===`);
  keywords.forEach(kw => {
    lines.forEach((l, i) => {
      if (l.includes(kw) && !l.trim().startsWith('//')) {
        console.log(`${i+1}: ${l.substring(0, 130)}`);
      }
    });
  });
}
