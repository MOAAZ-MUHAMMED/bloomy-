const fs = require('fs');

const path = 'src/components/GameZone.tsx';
let text = fs.readFileSync(path, 'utf8');

if (!text.includes('startNinjaGame()')) {
    text = text.replace(/else if \(activeGame === "farm"\) startFarmGame\(\);/g, 'else if (activeGame === "farm") startFarmGame();\n                            else if (activeGame === "ninja") startNinjaGame();\n                            else if (activeGame === "space") startSpaceGame();');
    fs.writeFileSync(path, text, 'utf8');
    console.log("Added ninja and space to GameZone buttons!");
} else {
    console.log("Already added.");
}
