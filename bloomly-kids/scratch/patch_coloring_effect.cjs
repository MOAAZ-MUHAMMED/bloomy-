const fs = require('fs');
const file = 'c:/Users/omar/Desktop/Huda-Nour-Site/bloomly-kids/src/components/GameZone.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const effectCode = `  // Auto-select template based on level for Coloring Game
  useEffect(() => {
    if (activeGame === 'coloring') {
      const levelNum = parseInt(propChildLevel.replace('level', '')) || 1;
      const templates = ['apple', 'orange', 'rocket', 'cat', 'monkey', 'dove', 'free'];
      const index = (levelNum - 1) % templates.length;
      setActiveTemplate(templates[index] as any);
    }
  }, [activeGame, propChildLevel]);
`;

// Insert after line 3627 (index 3626)
lines.splice(3627, 0, effectCode);
fs.writeFileSync(file, lines.join('\n'));
console.log('patched coloring effect');
