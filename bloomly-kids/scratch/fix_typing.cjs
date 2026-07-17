const fs = require('fs');

function fixRefTyping(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace('const audioCtxRef = useRef(null);', 'const audioCtxRef = useRef<any>(null);');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Typing fixed for: ${filePath}`);
}

fixRefTyping('src/components/games/NinjaGame.tsx');
fixRefTyping('src/components/games/SpaceGame.tsx');
fixRefTyping('src/components/games/SubwayGame.tsx');
