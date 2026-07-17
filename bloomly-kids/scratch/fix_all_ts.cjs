const fs = require('fs');

// 1. Fix webkitAudioContext typing in the three game components
function fixAudioContextTyping(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    'const AudioContextClass = window.AudioContext || window.webkitAudioContext;',
    'const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;'
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`AudioContext typing fixed for: ${filePath}`);
}

fixAudioContextTyping('src/components/games/NinjaGame.tsx');
fixAudioContextTyping('src/components/games/SpaceGame.tsx');
fixAudioContextTyping('src/components/games/SubwayGame.tsx');

// 2. Fix JSON.parse string cast inside GameZone.tsx
let gzContent = fs.readFileSync('src/components/GameZone.tsx', 'utf8');
gzContent = gzContent.replace(
  'childProfile={localStorage.getItem("childProfile") ? JSON.parse(localStorage.getItem("childProfile")) : null}',
  'childProfile={localStorage.getItem("childProfile") ? JSON.parse(localStorage.getItem("childProfile") as string) : null}'
);
fs.writeFileSync('src/components/GameZone.tsx', gzContent, 'utf8');
console.log("GameZone.tsx JSON.parse cast fixed!");
