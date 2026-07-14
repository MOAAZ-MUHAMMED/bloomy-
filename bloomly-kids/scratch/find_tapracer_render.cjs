const fs = require('fs');
const lines = fs.readFileSync('src/components/GameZone.tsx', 'utf-8').split('\n');

for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('activeGame === "tapRacer"') && lines[i].includes('?')) {
        console.log("Found tapRacer render at line " + i);
        for (let j = i - 2; j < i + 100; j++) {
            if(j >= 0 && j < lines.length) console.log((j+1) + ": " + lines[j]);
        }
        break;
    }
}
