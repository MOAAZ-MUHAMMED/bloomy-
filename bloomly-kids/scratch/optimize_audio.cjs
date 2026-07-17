const fs = require('fs');

function optimizeGameAudio(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the playSound function start and replace AudioContext creation
  // We can do it by replacing the start of playSound
  const targetPattern = /const playSound = useCallback\(\(type:.*?\n\s*try \{/s;
  
  // If target pattern exists, we insert audioCtxRef before playSound
  if (content.includes('AudioContext = window.AudioContext')) {
    content = content.replace('const playSound =', 'const audioCtxRef = useRef(null);\n  const playSound =');
    content = content.replace(/const AudioContext = window\.AudioContext \|\| \(window as any\)\.webkitAudioContext;\s*if \(!AudioContext\) return;\s*const ctx = new AudioContext\(\);/g, 
      `if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();`
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Audio optimized for: ${filePath}`);
  } else {
    console.log(`Already optimized or pattern not found in: ${filePath}`);
  }
}

optimizeGameAudio('src/components/games/NinjaGame.tsx');
optimizeGameAudio('src/components/games/SpaceGame.tsx');
optimizeGameAudio('src/components/games/SubwayGame.tsx');
