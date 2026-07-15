const fs = require('fs');
const path = 'src/components/GameZone.tsx';
let text = fs.readFileSync(path, 'utf8');

// 1. Add imports at the top
const imports = `import NinjaGame from "./games/NinjaGame";
import SpaceGame from "./games/SpaceGame";
import SubwayGame from "./games/SubwayGame";
`;
text = text.replace('import { motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";\n' + imports);

// 2. Add game rendering blocks right before the closing </section>
const gameBlocks = `
      {/* --- NINJA GAME PLAY VIEW --- */}
      {activeGame === "ninja" && !showLevelMap && (
        <NinjaGame 
          onQuit={quitGame}
          onWin={(stars) => {
            awardStarsAndFinishLevel(stars);
            quitGame();
          }}
        />
      )}

      {/* --- SPACE GAME PLAY VIEW --- */}
      {activeGame === "space" && !showLevelMap && (
        <SpaceGame 
          onQuit={quitGame}
          onWin={(stars) => {
            awardStarsAndFinishLevel(stars);
            quitGame();
          }}
        />
      )}

      {/* --- SUBWAY GAME PLAY VIEW (replaces arrowRacer) --- */}
      {activeGame === "arrowRacer" && !showLevelMap && (
        <SubwayGame 
          onQuit={quitGame}
          onWin={(stars) => {
            awardStarsAndFinishLevel(stars);
            quitGame();
          }}
        />
      )}
`;

// Replace `</section>` with `gameBlocks + </section>`
const lastIndexOfSection = text.lastIndexOf('</section>');
if (lastIndexOfSection !== -1) {
  text = text.substring(0, lastIndexOfSection) + gameBlocks + text.substring(lastIndexOfSection);
}

fs.writeFileSync(path, text, 'utf8');
console.log("GameZone.tsx updated with new games!");
