const fs = require('fs');
const lines = fs.readFileSync('src/components/GameZone.tsx', 'utf-8').split('\n');

let start = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('activeGame === "tapRacer"')) {
        start = i;
        break;
    }
}

if (start !== -1) {
    console.log("Found tapRacer UI at line " + start);
    for (let i = start - 2; i < start + 180; i++) {
        if(i >= 0 && i < lines.length) console.log((i+1) + ": " + lines[i]);
    }
} else {
    console.log("Could not find tapRacer.");
}
