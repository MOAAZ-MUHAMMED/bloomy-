const fs = require('fs');
const lines = fs.readFileSync('src/components/GameZone.tsx', 'utf-8').split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('activeGame === "tapRacer"')) {
        console.log("Found tapRacer UI at line " + i);
        for (let j = i - 2; j < i + 100; j++) {
            if(j >= 0 && j < lines.length) console.log((j+1) + ": " + lines[j]);
        }
        break;
    }
}
