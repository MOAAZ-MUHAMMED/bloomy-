const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'omar', 'Desktop', 'Huda-Nour-Site', 'bloomly-kids', 'src', 'components', 'GameZone.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// TASK 1: Maze
// Add state
content = content.replace(
  /const \[mazeRound, setMazeRound\] = useState\(1\);/,
  `const [mazeRound, setMazeRound] = useState(1);
  const [mazeGrid, setMazeGrid] = useState<number[][]>([]);
  const [mazeStarPositions, setMazeStarPositions] = useState<{x: number; y: number}[]>([]);
  const [mazeGridSize, setMazeGridSize] = useState(6);`
);

// Update generateMazeRound
content = content.replace(
  /const generateMazeRound = \(roundNum: number = 1\) => \{[\s\S]*?setCollectedStars\(\[\]\);\n  \};/,
  `const generateMazeRound = (roundNum: number = 1) => {
    setMazeFeedback("idle");
    setPlayerPosition({ x: 0, y: 0 });
    setCollectedStars([]);
    
    const levelStr = activeDifficulty || propChildLevel || "level1";
    let size = 6;
    if (levelStr === "level2") size = 9;
    else if (levelStr === "level3") size = 11;
    else if (levelStr === "level4") size = 13;

    const newGrid = Array.from({ length: size }, () => Array(size).fill(1));
    const stack = [{ x: 0, y: 0 }];
    newGrid[0][0] = 0;
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const dirs = [[0, -2], [0, 2], [-2, 0], [2, 0]];
      const neighbors = [];
      for (const [dx, dy] of dirs) {
        const nx = current.x + dx, ny = current.y + dy;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size && newGrid[ny][nx] === 1) {
          neighbors.push({ x: nx, y: ny, dx: dx / 2, dy: dy / 2 });
        }
      }
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        newGrid[current.y + next.dy][current.x + next.dx] = 0;
        newGrid[next.y][next.x] = 0;
        stack.push({ x: next.x, y: next.y });
      } else {
        stack.pop();
      }
    }
    newGrid[size - 1][size - 1] = 0;
    if (newGrid[size - 2] && newGrid[size - 2][size - 1] === 1 && newGrid[size - 1] && newGrid[size - 1][size - 2] === 1) {
      newGrid[size - 2][size - 1] = 0;
    }
    setMazeGrid(newGrid);
    setMazeGridSize(size);

    const stars: {x: number; y: number}[] = [];
    for (let i = 0; i < 3; i++) {
       let sx = Math.floor(Math.random() * size);
       let sy = Math.floor(Math.random() * size);
       if (newGrid[sy] && newGrid[sy][sx] === 0 && !(sx===0 && sy===0) && !(sx===size-1 && sy===size-1)) {
         stars.push({x: sx, y: sy});
       }
    }
    setMazeStarPositions(stars);
  };`
);

// Update movePlayer
content = content.replace(
  /const movePlayer = \(dx: number, dy: number\) => \{[\s\S]*?movePlayer\(dx, dy\)/,
  `const movePlayer = (dx: number, dy: number) => {
    if (mazeFeedback !== "idle" || activeGame !== "maze") return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX < 0 || newX >= mazeGridSize || newY < 0 || newY >= mazeGridSize) return;
    if (!mazeGrid || !mazeGrid[newY] || mazeGrid[newY][newX] === 1) return;

    setPlayerPosition({ x: newX, y: newY });
    sfx.playPop();

    const starStr = \`\${newX},\${newY}\`;
    const hasStar = mazeStarPositions.some(sp => sp.x === newX && sp.y === newY);
    if (hasStar && !collectedStars.includes(starStr)) {
      setCollectedStars(prev => [...prev, starStr]);
      sfx.playSuccess();
    }

    if (newX === mazeGridSize - 1 && newY === mazeGridSize - 1) {
      setMazeFeedback("success");
      sfx.playSuccess();
      addStars(1);

      setTimeout(() => {
        triggerVictory();
      }, 2000);
    }
  };
  
  // ignore this line`
);
content = content.replace(/\/\/ ignore this line/, '');

// Update maze header
content = content.replace(
  /<div className="font-extrabold text-\[\#4D2B82\]">\s*الجولة \{mazeRound\} من 5\s*<\/div>/,
  `<div className="font-extrabold text-[#4D2B82]">المتاهة السحرية</div>`
);

// Update maze JSX to use mazeGrid and sizes
content = content.replace(
  /className=\{`relative w-full aspect-square max-w-\[360px\] mx-auto border-4 border-\[\#4D2B82\] rounded-3xl overflow-hidden p-2 grid grid-cols-6 grid-rows-6 gap-1 shadow-md bg-white select-none \$\{mazeLevelsBank\[\(mazeRound - 1\) % mazeLevelsBank\.length\]\.obstacleBg\}`\}/,
  `className={\`relative w-full aspect-square max-w-[360px] mx-auto border-4 border-[#4D2B82] rounded-3xl overflow-hidden p-2 grid gap-1 shadow-md bg-white select-none \${mazeLevelsBank[(mazeRound - 1) % mazeLevelsBank.length].obstacleBg}\`} style={{ gridTemplateColumns: \`repeat(\${mazeGridSize}, minmax(0, 1fr))\`, gridTemplateRows: \`repeat(\${mazeGridSize}, minmax(0, 1fr))\` }}`
);

content = content.replace(
  /\{mazeLevelsBank\[\(mazeRound - 1\) % mazeLevelsBank\.length\]\.grid\.map/g,
  `{(mazeGrid && mazeGrid.length > 0 ? mazeGrid : mazeLevelsBank[(mazeRound - 1) % mazeLevelsBank.length].grid).map`
);

content = content.replace(
  /const isTarget = x === 5 && y === 5;/g,
  `const isTarget = x === mazeGridSize - 1 && y === mazeGridSize - 1;`
);

content = content.replace(
  /mazeLevelsBank\[\(mazeRound - 1\) % mazeLevelsBank\.length\]\.starPositions/g,
  `mazeStarPositions`
);

// TASK 2: Safari Game
content = content.replace(
  /\{ id: "duck", emoji: "🦆", name: "بطة تقوق", soundId: "duck" \}\n\s*\];/,
  `{ id: "duck", emoji: "🦆", name: "بطة تقوق", soundId: "duck" },
    { id: "penguin", emoji: "🐧", name: "بطريق يصيح", soundId: "penguin" },
    { id: "parrot", emoji: "🦜", name: "ببغاء يقلد", soundId: "parrot" },
    { id: "whale", emoji: "🐋", name: "حوت يغني", soundId: "whale" },
    { id: "dolphin", emoji: "🐬", name: "دلفين يصفر", soundId: "dolphin" },
    { id: "wolf", emoji: "🐺", name: "ذئب يعوي", soundId: "wolf" },
    { id: "bear", emoji: "🐻", name: "دب يزمجر", soundId: "bear" },
    { id: "tiger", emoji: "🐅", name: "نمر يزأر", soundId: "tiger" },
    { id: "panda", emoji: "🐼", name: "باندا يمضغ", soundId: "panda" },
    { id: "koala", emoji: "🐨", name: "كوالا يصيح", soundId: "koala" },
    { id: "giraffe", emoji: "🦒", name: "زرافة تمضغ", soundId: "giraffe" },
    { id: "zebra", emoji: "🦓", name: "حمار وحشي ينهق", soundId: "zebra" },
    { id: "kangaroo", emoji: "🦘", name: "كنغر يقفز", soundId: "kangaroo" },
    { id: "octopus", emoji: "🐙", name: "أخطبوط يسبح", soundId: "octopus" },
    { id: "butterfly", emoji: "🦋", name: "فراشة ترفرف", soundId: "butterfly" },
    { id: "ladybug", emoji: "🐞", name: "دعسوقة تطير", soundId: "ladybug" },
    { id: "turtle", emoji: "🐢", name: "سلحفاة تزحف", soundId: "turtle" },
    { id: "snail", emoji: "🐌", name: "حلزون ينزلق", soundId: "snail" },
    { id: "flamingo", emoji: "🦩", name: "فلامنغو يغرد", soundId: "flamingo" },
    { id: "peacock", emoji: "🦚", name: "طاووس يصيح", soundId: "peacock" },
    { id: "crocodile", emoji: "🐊", name: "تمساح يزمجر", soundId: "crocodile" }
  ];`
);

// TASK 3: TapRacer
// Remove theme state
content = content.replace(
  /const \[tapRacerTheme, setTapRacerTheme\] = useState<TapRacerTheme>\("run"\);\n/,
  ``
);

// initTapRacerRound - remove theme setting & update opponents
content = content.replace(
  /let theme: TapRacerTheme = "run";\n\s*if \(roundNum === 1\) theme = "run";\n\s*else if \(roundNum === 2\) theme = "cycle";\n\s*else \{\n\s*theme = Math.random\(\) > 0.5 \? "swim" : "fly";\n\s*\}\n\s*setTapRacerTheme\(theme\);/,
  ``
);
content = content.replace(
  /\{ id: 1, name: "الباندا بوبو 🐼", emoji: "🐼", progress: 0, speed: \(1.2 \+ Math.random\(\) \* 0.5\) \* difficultyMultiplier, color: "\#FF85A2" \},\n\s*\{ id: 2, name: "الأرنب سمسم 🐰", emoji: "🐰", progress: 0, speed: \(1.4 \+ Math.random\(\) \* 0.4\) \* difficultyMultiplier, color: "\#85FFD3" \},\n\s*\{ id: 3, name: "الثعلب فوفو 🦊", emoji: "🦊", progress: 0, speed: \(1.3 \+ Math.random\(\) \* 0.5\) \* difficultyMultiplier, color: "\#FFE885" \}/,
  `{ id: 1, name: "بلومي أحمر 🔴", emoji: "🔴", progress: 0, speed: (1.2 + Math.random() * 0.5) * difficultyMultiplier, color: "#FF3B30" },
      { id: 2, name: "بلومي أصفر 🟡", emoji: "🟡", progress: 0, speed: (1.4 + Math.random() * 0.4) * difficultyMultiplier, color: "#FFCC00" },
      { id: 3, name: "بلومي أزرق 🔵", emoji: "🔵", progress: 0, speed: (1.3 + Math.random() * 0.5) * difficultyMultiplier, color: "#007AFF" }`
);

// JSX TapRacer
content = content.replace(
  /className=\{`card-bubbly max-w-5xl mx-auto p-8 relative overflow-hidden border-8 border-\[\#4D2B82\] shadow-2xl \$\{\n\s*tapRacerTheme === "swim" \? "bg-gradient-to-b from-\[\#E0F2FE\] to-\[\#7DD3FC\]" :\n\s*tapRacerTheme === "cycle" \? "bg-gradient-to-b from-\[\#F1F5F9\] to-\[\#CBD5E1\]" :\n\s*tapRacerTheme === "run" \? "bg-gradient-to-b from-\[\#FEF3C7\] to-\[\#FCD34D\]" :\n\s*"bg-gradient-to-b from-\[\#ECFDF5\] to-\[\#6EE7B7\]"\n\s*\}\`\}/,
  `className="card-bubbly max-w-5xl mx-auto p-8 relative overflow-hidden border-8 border-[#4D2B82] shadow-2xl bg-gradient-to-b from-[#FEF3C7] to-[#FCD34D]"`
);

content = content.replace(
  /\{tapRacerTheme === "swim" && "🏊 سباق السباحة في البحر"\}\n\s*\{tapRacerTheme === "cycle" && "🚴 سباق الدراجات الهوائية"\}\n\s*\{tapRacerTheme === "run" && "🏃 سباق الجري السريع"\}\n\s*\{tapRacerTheme === "fly" && "🎈 سباق التحليق بالبالونات"\}/,
  `سباق الضغط السريع 🏁`
);

content = content.replace(
  /className="absolute top-1\/2 -translate-y-1\/2 text-5xl select-none drop-shadow-lg"\n\s*>\n\s*\{tapRacerTheme === "swim" \? "🏊" : tapRacerTheme === "cycle" \? "🚴" : tapRacerTheme === "run" \? "🏃" : "🎈"\}\{o\.emoji\}/,
  `className="absolute top-1/2 -translate-y-1/2 text-5xl select-none drop-shadow-lg animate-bounce"
                    >
                      {o.emoji}`
);

const playerEmojiRegex = /\{tapRacerTheme === "swim" && \([\s\S]*?\{tapRacerTheme === "fly" && \([\s\S]*?\}\)/;
content = content.replace(playerEmojiRegex, `<div className="relative flex flex-col items-center">
                        <MascotCharacter pose="victory" className="w-10 h-10 animate-bounce" />
                      </div>`);

fs.writeFileSync(filePath, content, 'utf-8');

// LEARNING PATH MAP
const lpPath = path.join('c:', 'Users', 'omar', 'Desktop', 'Huda-Nour-Site', 'bloomly-kids', 'src', 'components', 'LearningPathMap.tsx');
let lpContent = fs.readFileSync(lpPath, 'utf-8');

lpContent = lpContent.replace(
  /title: "سباق الحروف والسرعة 🏁",\n\s*character: "🐢 السلحفاة نينجا \(بطل التحدي\)",\n\s*characterEmoji: "🐢",\n\s*emoji: "🏁",\n\s*gameName: "سباق الحروف والسرعة",/,
  `title: "سباق الضغط السريع 🏁",
    character: "🔴 بلومي أحمر (بطل التحدي)",
    characterEmoji: "🔴",
    emoji: "🏁",
    gameName: "سباق الضغط السريع",`
);

fs.writeFileSync(lpPath, lpContent, 'utf-8');

console.log("Done");
