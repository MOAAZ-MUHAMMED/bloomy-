const fs = require('fs');

const compFiles = [
  'ArabicLetterTracing.tsx',
  'ArabicShadowMatch.tsx',
  'DrawingNeonArt.tsx',
  'DrawingSymmetry.tsx',
  'EnglishSpaceDecoder.tsx',
  'EnglishWordSafari.tsx',
  'KitchenMarketList.tsx',
  'KitchenSandwichMaker.tsx',
  'KitchenBakingCake.tsx',
  'MathHungryCrocodile.tsx',
  'MathNumberTrain.tsx',
  'MathSpaceTower.tsx'
];

compFiles.forEach(f => {
  const p = `src/components/${f}`;
  if (fs.existsSync(p)) {
    const code = fs.readFileSync(p, 'utf8');
    const hasLock = code.includes('hasCompletedRef') || code.includes('isCompleted') || code.includes('completedRef');
    console.log(`${f}: ${hasLock ? 'HAS LOCK' : 'NO LOCK KEYWORD'}`);
  }
});
