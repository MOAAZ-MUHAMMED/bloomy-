const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'GameZone.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove initial showLevelMap based on forcedGame
content = content.replace(
  /setShowLevelMap\(forcedGame !== "quran" && forcedGame !== "stories"\);/g,
  'setShowLevelMap(false);'
);

// 2. In startLoadingAndOpenMap, don't show level map ever
content = content.replace(
  /if \(gameName !== "quran" && gameName !== "stories"\) \{\s*\/\/[^]*?setShowLevelMap\(true\);\s*\}/g,
  `if (gameName !== "quran" && gameName !== "stories") {
            if (propChildLevel) {
              setActiveDifficulty(propChildLevel as any);
              setEffectiveLevel(propChildLevel as any);
            }
            setShowLevelMap(false);
          }`
);

// 3. quitGame() and other places returning to map should return to menu
content = content.replace(
  /setShowLevelMap\(true\);/g,
  'setShowLevelMap(false); setActiveGame("menu");'
);

// 4. Change the "Level Map" button text to "Back to Menu"
content = content.replace(
  /🗺️ خريطة المستويات/g,
  '🏠 العودة للقائمة'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Patched GameZone.tsx successfully!');
