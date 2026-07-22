const fs = require('fs');

const gz = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
const croc = fs.readFileSync('src/components/MathHungryCrocodile.tsx', 'utf8');
const train = fs.readFileSync('src/components/MathNumberTrain.tsx', 'utf8');
const tower = fs.readFileSync('src/components/MathSpaceTower.tsx', 'utf8');

console.log('=== MathHungryCrocodile getMaxNum ===');
croc.split('\n').forEach((l, i) => {
  if (l.includes('getMaxNum')) console.log(`${i+1}: ${l}`);
});

console.log('=== MathNumberTrain getMaxNum ===');
train.split('\n').forEach((l, i) => {
  if (l.includes('getMaxNum')) console.log(`${i+1}: ${l}`);
});

console.log('=== MathSpaceTower getMaxNum ===');
tower.split('\n').forEach((l, i) => {
  if (l.includes('getMaxNum')) console.log(`${i+1}: ${l}`);
});

console.log('=== GameZone connectDots points ===');
gz.split('\n').forEach((l, i) => {
  if (l.includes('connectDots') || l.includes('connect_dots')) console.log(`${i+1}: ${l.substring(0, 100)}`);
});
