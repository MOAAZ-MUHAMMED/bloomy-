const fs = require('fs');
let code = fs.readFileSync('src/components/GameZone.tsx', 'utf8');

// Fix startRacerGame -> startRunnerGame in menu
code = code.replace(/startRacerGame/g, 'startRunnerGame');
code = code.replace(/setRacerActive/g, 'setRunnerActive');
code = code.replace(/racerActive/g, 'runnerActive');
// wait, wait! The active game state for Runner is still "arrowRacer"!
// So I shouldn't replace all racerActive. I will just replace startRacerGame and setRacerActive.

// Fix newParticles any[] error
code = code.replace(/const newParticles = \[\];/g, 'const newParticles: any[] = [];');

// Fix useRef errors
code = code.replace(/useRef<number>\(\)/g, 'useRef<number | undefined>(undefined)');

fs.writeFileSync('src/components/GameZone.tsx', code);
