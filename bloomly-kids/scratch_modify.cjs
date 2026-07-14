const fs = require('fs');
let c = fs.readFileSync('src/components/GameZone.tsx', 'utf-8');
c = c.replaceAll('setShowLevelMap(false); setActiveGame("menu");', 'setShowLevelMap(true);');
fs.writeFileSync('src/components/GameZone.tsx', c);
