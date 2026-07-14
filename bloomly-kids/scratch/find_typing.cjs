const fs = require('fs');
const lines = fs.readFileSync('src/components/GameZone.tsx', 'utf-8').split('\n');

// Find typing game
let start = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('activeGame === "typing"')) {
        start = i;
        break;
    }
}

if (start !== -1) {
    console.log("Found typing game at line " + start);
    for (let i = start - 2; i < start + 100; i++) {
        if(i >= 0 && i < lines.length) console.log((i+1) + ": " + lines[i]);
    }
} else {
    console.log("Could not find typing game.");
}
