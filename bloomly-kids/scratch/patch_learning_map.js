const fs = require('fs');
const file = 'c:/Users/omar/Desktop/Huda-Nour-Site/bloomly-kids/src/components/LearningPathMap.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  `onClick={() => {
                playBubbleSound();
                if (isLocked) {
                  triggerNotice("هذه الجزيرة مقفلة! العب الجزر السابقة واكسب نجوم لتفتحها 🌟", true);
                  return;
                }
                setSelectedIslandIndex(index);
              }}`,
  `onClick={() => {
                playBubbleSound();
                if (isLocked) {
                  triggerNotice("هذه الجزيرة مقفلة! العب الجزر السابقة واكسب نجوم لتفتحها 🌟", true);
                  return;
                }
                if (island.id === "neonArt") {
                  onSelectGame(island.id);
                } else {
                  setSelectedIslandIndex(index);
                }
              }}`
);
fs.writeFileSync(file, code);
console.log('patched LearningPathMap');
