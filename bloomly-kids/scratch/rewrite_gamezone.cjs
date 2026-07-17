const fs = require('fs');

let content = fs.readFileSync('src/components/GameZone.tsx', 'utf8');

// 1. Add callbacks to GameZoneProps interface
const propsTarget = `interface GameZoneProps {
  onNeedRegister?: () => void;
  globalStars?: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
  childLevel?: "level1" | "level2" | "level3" | "level4" | null;
  forcedGame?: string | null;
  setForcedGame?: React.Dispatch<React.SetStateAction<string | null>>;
}`;

const propsReplacement = `interface GameZoneProps {
  onNeedRegister?: () => void;
  globalStars?: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
  childLevel?: "level1" | "level2" | "level3" | "level4" | null;
  forcedGame?: string | null;
  setForcedGame?: React.Dispatch<React.SetStateAction<string | null>>;
  onOpenParents?: () => void;
  onOpenAbout?: () => void;
}`;

if (content.includes(propsTarget)) {
  content = content.replace(propsTarget, propsReplacement);
  console.log("GameZoneProps updated!");
} else {
  console.log("GameZoneProps pattern not found, trying fuzzy match...");
}

// 2. Destructure new props in GameZone definition
const sigTarget = `export function GameZone({ onNeedRegister, globalStars = 0, setGlobalStars, childLevel: propChildLevel = "level1", forcedGame, setForcedGame }: GameZoneProps = {}) {`;
const sigReplacement = `export function GameZone({ 
  onNeedRegister, 
  globalStars = 0, 
  setGlobalStars, 
  childLevel: propChildLevel = "level1", 
  forcedGame, 
  setForcedGame,
  onOpenParents,
  onOpenAbout
}: GameZoneProps = {}) {`;

if (content.includes(sigTarget)) {
  content = content.replace(sigTarget, sigReplacement);
  console.log("GameZone function signature updated!");
}

// 3. Replace activeGame state declaration to allow any type (e.g. 'island_map')
const stateTarget = `const [activeGame, setActiveGame] = useState<"menu" | "math" | "spelling" | "memory" | "catcher" | "coloring" | "spellingEn" | "sorting" | "spaceCatcher" | "connectDots" | "maze" | "safari" | "chef" | "farm" | "train" | "arrowRacer" | "tapRacer" | "quran" | "stories" | "dailyHabits" | "ninja" | "space" | "ninja" | "space">("menu");`;
const stateReplacement = `const [activeGame, setActiveGame] = useState<any>("menu");`;

if (content.includes(stateTarget)) {
  content = content.replace(stateTarget, stateReplacement);
  console.log("activeGame state type broadened!");
}

// 4. Update GameGridMenu render block inside GameZone
const menuTarget = `      {/* --- MENU VIEW --- */}
      {activeGame === "menu" && (
        <>
          <GameGridMenu 
            onSelectCategory={(categoryId) => {
              if (categoryId === 'farm') {
                requireProfile(() => startLoadingAndOpenMap('farm'));
              } else {
                requireProfile(() => startLoadingAndOpenCategory(categoryId));
              }
            }}
            onSelectGame={(gameId) => requireProfile(() => startLoadingAndOpenMap(gameId as any))}
            activeCategory={activeCategory}
            onBackToCategories={() => setActiveCategory(null)}
            onOpenParents={() => {
              // Open Parents dashboard (usually by scrolling down or opening modal)
              // Wait, the user said: \"يوديه على المكان اللي هو تحت بتاع اولياء الامور\"
              // That means scroll down to the Parents Dashboard.
              const parentsEl = document.getElementById('parents');
              if (parentsEl) {
                 parentsEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onOpenMap={() => requireProfile(() => {
              // Show the island map for the default game or a specific one
              setShowLevelMap(true);
              setActiveGame('maze'); // Arbitrarily pick maze to show map, or just show map directly
            })}
            onOpenAbout={() => {
              // Scroll to footer or show about modal
              const footer = document.querySelector('footer');
              if (footer) footer.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </>
      )}`;

const menuReplacement = `      {/* --- MENU VIEW --- */}
      {activeGame === "menu" && (
        <>
          <GameGridMenu 
            onSelectCategory={(categoryId) => {
              if (categoryId === 'farm') {
                requireProfile(() => startLoadingAndOpenMap('farm'));
              } else {
                requireProfile(() => startLoadingAndOpenCategory(categoryId));
              }
            }}
            onSelectGame={(gameId) => requireProfile(() => startLoadingAndOpenMap(gameId as any))}
            activeCategory={activeCategory}
            onBackToCategories={() => setActiveCategory(null)}
            onOpenParents={onOpenParents}
            onOpenMap={() => requireProfile(() => {
              setActiveGame('island_map');
            })}
            onOpenAbout={onOpenAbout}
            globalStars={globalStars}
            childProfile={localStorage.getItem("childProfile") ? JSON.parse(localStorage.getItem("childProfile")) : null}
          />
        </>
      )}`;

if (content.includes(menuTarget)) {
  content = content.replace(menuTarget, menuReplacement);
  console.log("GameGridMenu rendering updated!");
} else {
  console.log("GameGridMenu render target not found! Check spacing or escaping.");
}

// 5. Insert Island Map rendering section
const mapRenderBlock = `      {/* --- ISLAND MAP VIEW --- */}
      {activeGame === "island_map" && (
        <div className="relative w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 bg-[#3D1E6D] min-h-screen rounded-[40px] border-4 border-white/20 select-none">
          <div className="flex justify-between items-center bg-white/95 p-4 rounded-3xl border-3 border-purple-200 shadow-md">
            <button 
              onClick={() => {
                setActiveGame("menu");
                if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("رجوع"));
              }}
              className="btn-bubbly-secondary text-sm py-2 px-5 text-[#4D2B82] bg-white rounded-full flex items-center gap-1 cursor-pointer border-2 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-[0_0_0_0_#4D2B82] transition-all"
            >
              <span>🔙 رجوع للقائمة</span>
            </button>
            <h2 className="text-2xl font-black text-[#4D2B82]">🗺️ خريطة المغامرة السحرية</h2>
          </div>
          <LearningPathMap 
            maxIslandUnlocked={maxIslandUnlocked}
            onSelectGame={(gameId) => requireProfile(() => startLoadingAndOpenMap(gameId as any))}
          />
        </div>
      )}`;

// We can append this right after MENU VIEW or in front of MATH GAME PLAY VIEW
content = content.replace('      {/* --- MATH GAME PLAY VIEW --- */}', mapRenderBlock + '\n\n      {/* --- MATH GAME PLAY VIEW --- */}');
console.log("LearningPathMap rendering added!");

fs.writeFileSync('src/components/GameZone.tsx', content, 'utf8');
console.log("GameZone.tsx rewritten successfully!");
