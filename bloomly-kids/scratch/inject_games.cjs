const fs = require('fs');

let gameZone = fs.readFileSync('src/components/GameZone.tsx', 'utf-8');

// 1. Update activeGame type
gameZone = gameZone.replace(
  /"menu" \| "math" \| "spelling" \| "memory" \| "catcher" \| "coloring" \| "spellingEn" \| "sorting" \| "spaceCatcher" \| "connectDots" \| "maze" \| "safari" \| "chef" \| "farm" \| "train" \| "arrowRacer" \| "tapRacer" \| "quran" \| "stories" \| "dailyHabits"/g,
  '"menu" | "math" | "spelling" | "memory" | "catcher" | "coloring" | "spellingEn" | "sorting" | "spaceCatcher" | "connectDots" | "maze" | "safari" | "chef" | "farm" | "train" | "arrowRacer" | "tapRacer" | "quran" | "stories" | "dailyHabits" | "ninja" | "space"'
);

// 2. Replace Turbo Arrow Racer State with ALL NEW STATES (Runner + Ninja + Space)
const statesMarkerStart = "// NEW GAME: TURBO ARROW RACER (سباق الاتجاهات الخارق)";
const statesMarkerEnd = "// NEW GAME 1: MAGIC SORTING BASKET (تصنيف بلومي السحري)";

const runnerLogicText = fs.readFileSync('scratch/RunnerLogic.tsx', 'utf-8');
const ninjaLogicText = fs.readFileSync('scratch/FruitNinjaLogic.tsx', 'utf-8');
const spaceLogicText = fs.readFileSync('scratch/SpaceShooterLogic.tsx', 'utf-8');

const getBlock = (text, startMarker, endMarker) => {
  const parts = text.split(startMarker);
  if (parts.length < 2) return '';
  return parts[1].split(endMarker)[0];
};

const extractStates = (text) => text.split('const start')[0];
const extractLogic = (text) => 'const start' + text.split('// UI BLOCK')[0].split('const start')[1];
const extractUI = (text) => text.split('// UI BLOCK')[1];

const allNewStates = 
  extractStates(runnerLogicText) + '\n' + 
  extractStates(ninjaLogicText) + '\n' + 
  extractStates(spaceLogicText);

const allNewLogic = 
  extractLogic(runnerLogicText) + '\n' + 
  extractLogic(ninjaLogicText) + '\n' + 
  extractLogic(spaceLogicText);

const allNewUI = 
  extractUI(runnerLogicText) + '\n' + 
  extractUI(ninjaLogicText) + '\n' + 
  extractUI(spaceLogicText);

// Find exact indices for replacement
const stateStartIndex = gameZone.indexOf(statesMarkerStart);
const stateEndIndex = gameZone.indexOf(statesMarkerEnd);
if (stateStartIndex !== -1 && stateEndIndex !== -1) {
  gameZone = gameZone.substring(0, stateStartIndex) + allNewStates + '\n  ' + gameZone.substring(stateEndIndex);
}

// 3. Replace Turbo Arrow Racer Logic
const logicMarkerStart = "// NEW GAME: TURBO ARROW RACER (سباق الاتجاهات الخارق) LOGIC";
const logicMarkerEnd = "// NEW GAME 14: MAGICAL SHAPES TRAIN (قطار الأشكال السحري)";

const logicStartIndex = gameZone.indexOf(logicMarkerStart);
const logicEndIndex = gameZone.indexOf(logicMarkerEnd);
if (logicStartIndex !== -1 && logicEndIndex !== -1) {
  gameZone = gameZone.substring(0, logicStartIndex) + allNewLogic + '\n  ' + gameZone.substring(logicEndIndex);
}

// 4. Replace Turbo Arrow Racer UI
const uiMarkerStart = "{/* --- TURBO ARROW RACER PLAY VIEW --- */}";
const uiMarkerEnd = "{/* --- FAST TAPPING RACER PLAY VIEW --- */}";

const uiStartIndex = gameZone.indexOf(uiMarkerStart);
const uiEndIndex = gameZone.indexOf(uiMarkerEnd);
if (uiStartIndex !== -1 && uiEndIndex !== -1) {
  gameZone = gameZone.substring(0, uiStartIndex) + allNewUI + '\n      ' + gameZone.substring(uiEndIndex);
}

// 5. Add Menu Cards for Ninja and Space
const cardsEndMarker = '{/* --- EXISTING MENU CARDS END --- */}'; // Need to find where to put the new cards.
// They are inside `<div className="grid grid-cols-2...`
// Let's just find the last card (dailyHabits) and append.
const dailyHabitCard = `onClick={() => startDailyHabitsGame()}
              className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white/20 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-6xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 drop-shadow-xl">
                  📝
                </div>
                <div>
                  <h3 className="font-extrabold text-2xl text-white drop-shadow-md tracking-wide mb-1">عاداتي اليومية</h3>
                  <p className="text-indigo-100 font-medium text-sm">أضف عاداتك واكسب النجوم!</p>
                </div>
              </div>
            </button>`;

const newCards = `
            {/* NINJA CARD */}
            <button
              onClick={() => startNinjaGame()}
              className="group relative overflow-hidden bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white/20 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 col-span-2 sm:col-span-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-6xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 drop-shadow-xl">
                  🍉
                </div>
                <div>
                  <h3 className="font-extrabold text-2xl text-white drop-shadow-md tracking-wide mb-1">النينجا القاطع</h3>
                  <p className="text-orange-100 font-medium text-sm">اقطع الفواكه كالمحترفين!</p>
                </div>
              </div>
            </button>
            {/* SPACE CARD */}
            <button
              onClick={() => startSpaceGame()}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white/20 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 col-span-2 sm:col-span-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-6xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 drop-shadow-xl">
                  🚀
                </div>
                <div>
                  <h3 className="font-extrabold text-2xl text-white drop-shadow-md tracking-wide mb-1">حرب الفضاء</h3>
                  <p className="text-indigo-200 font-medium text-sm">دمر الغزاة الفضائيين!</p>
                </div>
              </div>
            </button>
`;

if (gameZone.includes("startDailyHabitsGame()")) {
  // Find the closing tag of the daily habits button
  const parts = gameZone.split('عاداتي اليومية');
  if (parts.length > 1) {
    const after = parts[1];
    const buttonEndIndex = after.indexOf('</button>') + '</button>'.length;
    gameZone = parts[0] + 'عاداتي اليومية' + after.substring(0, buttonEndIndex) + newCards + after.substring(buttonEndIndex);
  }
}

// 6. Update Turbo Arrow Racer Card text
gameZone = gameZone.replace(
  />سباق الاتجاهات الخارق</g,
  '>سباق التزلج اللانهائي<'
);
gameZone = gameZone.replace(
  new RegExp('>وجه سيارتك في الاتجاه الصحيح<', 'g'),
  '>تزلج وتفادى العقبات بسلاسة!<'
);


fs.writeFileSync('src/components/GameZone.tsx', gameZone);
console.log("Successfully injected new games!");
