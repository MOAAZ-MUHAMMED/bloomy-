const fs = require('fs');

const path = 'src/components/IntroScreen.tsx';
let text = fs.readFileSync(path, 'utf8');

// Fix 1: Make "العب" stay longer and be more central
text = text.replace(/left: "calc\(50% \+ 22vw\)"/g, 'left: "calc(50% + 15vw)"');
text = text.replace(/x: \["0vw", "-22vw", "-22vw", "22vw", "22vw", "0vw"\]/g, 'x: ["0vw", "-15vw", "-15vw", "15vw", "15vw", "0vw"]');
text = text.replace(/left: "calc\(50% - 22vw\)"/g, 'left: "calc(50% - 15vw)"');

// Increase time it stays on screen
text = text.replace(/const playWordExitTimer = setTimeout\(\(\) => \{\n      setPlayCardState\("exit"\);\n    \}, 1800\);/g, 'const playWordExitTimer = setTimeout(() => { setPlayCardState("exit"); }, 2000);');

fs.writeFileSync(path, text, 'utf8');
console.log("IntroScreen fixed!");
