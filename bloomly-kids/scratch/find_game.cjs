const fs = require('fs');
const lines = fs.readFileSync('src/components/GameZone.tsx', 'utf-8').split('\n');

// Find spelling game
let start = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('سباق الضغط السريع')) {
        start = i;
        break;
    }
}

if (start !== -1) {
    console.log("Found سباق الضغط السريع at line " + start);
    for (let i = start - 10; i < start + 10; i++) {
        if(i >= 0 && i < lines.length) console.log((i+1) + ": " + lines[i]);
    }
} else {
    console.log("Could not find سباق الضغط السريع.");
}
