const fs = require('fs');

const path = 'src/components/GameZone.tsx';
let text = fs.readFileSync(path, 'utf8');

// 1. Add activeCategory state
if (!text.includes('const [activeCategory, setActiveCategory]')) {
    text = text.replace(
        /const \[activeGame, setActiveGame\] = useState<[^>]+>\("menu"\);/,
        `$&
  const [activeCategory, setActiveCategory] = useState<string | null>(null);`
    );
}

// 2. Add startLoadingAndOpenCategory function
if (!text.includes('const startLoadingAndOpenCategory')) {
    text = text.replace(
        /const startLoadingAndOpenMap = \(gameName: typeof activeGame\) => \{/,
        `const startLoadingAndOpenCategory = (categoryId: string) => {
    setIsLoadingGame(true);
    setLoadingProgress(0);
    
    // Animate progress to 100% over 1.5 seconds
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 150);

    // After loading completes, close loading screen and show category
    setTimeout(() => {
      setIsLoadingGame(false);
      setActiveCategory(categoryId);
      // Ensure landscape orientation is locked
      try {
        if ((window as any).Capacitor && (window as any).Capacitor.Plugins && (window as any).Capacitor.Plugins.ScreenOrientation) {
          (window as any).Capacitor.Plugins.ScreenOrientation.lock({ orientation: 'landscape' });
        }
      } catch (e) {
        console.log("Orientation lock failed:", e);
      }
    }, 1800);
  };

  $&`
    );
}

// 3. Update the MENU VIEW rendering in GameZone.tsx
if (text.includes('activeGame === "menu" && (')) {
    text = text.replace(
        /\{\/\* --- MENU VIEW ---\s*\*\/\}[\s\S]*?\{activeGame === "menu" && \([\s\S]*?<\/>\s*\)}/,
        `{/* --- MENU VIEW --- */}
      {activeGame === "menu" && (
        <>
          <GameGridMenu 
            onSelectCategory={(categoryId) => requireProfile(() => startLoadingAndOpenCategory(categoryId))}
            onSelectGame={(gameId) => requireProfile(() => startLoadingAndOpenMap(gameId as any))}
            activeCategory={activeCategory}
            onBackToCategories={() => setActiveCategory(null)}
          />
        </>
      )}`
    );
}

fs.writeFileSync(path, text, 'utf8');
console.log("GameZone updated with category logic!");
