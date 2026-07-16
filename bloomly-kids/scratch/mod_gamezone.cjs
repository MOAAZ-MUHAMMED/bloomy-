const fs = require('fs');

const path = 'src/components/GameZone.tsx';
let text = fs.readFileSync(path, 'utf8');

// Modify GameGridMenu usage
const oldGGM = `<GameGridMenu 
            onSelectCategory={(categoryId) => requireProfile(() => startLoadingAndOpenCategory(categoryId))}
            onSelectGame={(gameId) => requireProfile(() => startLoadingAndOpenMap(gameId as any))}
            activeCategory={activeCategory}
            onBackToCategories={() => setActiveCategory(null)}
          />`;

const newGGM = `<GameGridMenu 
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
              // Wait, the user said: "يوديه على المكان اللي هو تحت بتاع اولياء الامور"
              // That means scroll down to the Parents Dashboard.
              const parentsEl = document.getElementById('parents-dashboard');
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
          />`;

if (text.includes(oldGGM)) {
    text = text.replace(oldGGM, newGGM);
} else {
    // try to match loosely
    text = text.replace(/<GameGridMenu[\s\S]*?onBackToCategories=\{\(\) => setActiveCategory\(null\)\}\n\s*\/>/m, newGGM);
}

// Move header to the left: change flex-row to flex-row-reverse or just change layout
const oldHeader = `<div className="flex flex-col sm:flex-row items-center justify-between bg-white border-3 border-[#4D2B82] rounded-[24px] p-6 mb-12 shadow-[0_6px_0_0_#4D2B82] gap-4">`;
const newHeader = `<div className="flex flex-col sm:flex-row-reverse items-center justify-between bg-white/80 backdrop-blur-md border-3 border-[#4D2B82] rounded-[24px] p-4 mb-4 shadow-[0_6px_0_0_#4D2B82] gap-4 absolute top-4 left-4 z-50 w-auto">`;

if (text.includes(oldHeader)) {
    text = text.replace(oldHeader, newHeader);
    // Also change the intro header inside the menu if it's there? No, the GameGridMenu has its own header.
    // The user said: "خلي البوكس اللي فوق خالص ده اللي فيه برعم ونجوم وحروف ده خليه على الشمال"
    // "البوكس اللي فيه برعم ونجوم وحروف"
}

fs.writeFileSync(path, text, 'utf8');
console.log("GameZone.tsx modified!");
