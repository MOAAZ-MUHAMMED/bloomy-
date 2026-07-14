const fs = require('fs');
const lines = fs.readFileSync('src/components/GameZone.tsx', 'utf-8').split('\n');

// 1. Print lines for typing game
let start = lines.findIndex(l => l.includes('activeGame === "typing"'));
if (start !== -1) {
    console.log("Found typing game at line " + start);
    for (let i = start - 2; i < start + 150; i++) {
        console.log((i+1) + ": " + lines[i]);
    }
} else {
    console.log("Could not find typing game.");
}
