const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Wrap main sections from MagicalForestBackground to GameZone in currentView === 'main' check
// Find index of <MagicalForestBackground />
const forestBg = '<MagicalForestBackground />';
const forestBgIdx = content.indexOf(forestBg);

// Find index of <GameZone
const gameZone = '<GameZone';
const gameZoneIdx = content.indexOf(gameZone);

// Find index of the closing of <GameZone ... />
const gameZoneClose = '/>';
const gameZoneCloseIdx = content.indexOf(gameZoneClose, gameZoneIdx);

if (forestBgIdx !== -1 && gameZoneIdx !== -1 && gameZoneCloseIdx !== -1) {
  // We want to slice:
  // Before forestBg: content up to forestBg + forestBg.length
  // Then we insert: {currentView === 'main' && (
  //                      <>
  // Then content from forestBg to gameZoneCloseIdx + 2
  // Then we insert:      </>
  //                 )}
  
  const before = content.substring(0, forestBgIdx + forestBg.length);
  const mainContent = content.substring(forestBgIdx + forestBg.length, gameZoneCloseIdx + 2);
  const after = content.substring(gameZoneCloseIdx + 2);
  
  content = before + '\n      {currentView === \'main\' && (\n        <>\n' + mainContent + '\n        </>\n      )}' + after;
  console.log("Wrapped main sections successfully!");
} else {
  console.log("Could not find forest bg or GameZone indices!");
}

// 2. Now let's update GameZone's instantiation to pass callbacks
// Since we inserted the wrapper, let's search for <GameZone in the new content
const gzIdx = content.indexOf('<GameZone');
const gzCloseIdx = content.indexOf('/>', gzIdx);

if (gzIdx !== -1 && gzCloseIdx !== -1) {
  const gzBody = `      <GameZone 
        onNeedRegister={() => setShowRegister(true)} 
        globalStars={globalStars} 
        setGlobalStars={setGlobalStars}
        childLevel={childProfile?.level}
        forcedGame={forcedGame}
        setForcedGame={setForcedGame}
        onOpenParents={() => {
          setCurrentView('parents');
          if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("لوحة التحكم لأولياء الأمور"));
        }}
        onOpenAbout={() => {
          setCurrentView('about');
          if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("معلومات عن التطبيق"));
        }}
      />`;
  
  content = content.substring(0, gzIdx) + gzBody + content.substring(gzCloseIdx + 2);
  console.log("GameZone props updated!");
}

// 3. Disable original what-we-teach and parents sections
// Find what-we-teach section:
content = content.replace('<section id="what-we-teach"', '{false && <section id="what-we-teach"');
content = content.replace('<section id="parents"', '}</section>\n      {false && <section id="parents"');
// Since parents section was already replaced by {false && <section id="parents" in stage 1,
// let's verify if parents section closing is correct.
// We can just verify it in git diff.

// 4. Update IntroScreen onFinish to lock orientation and hide status bar
const introTarget = `<IntroScreen onFinish={() => {
            setShowIntro(false);
            if (!childProfile) {
              setShowLogin(true);
            }
          }} />`;

const introReplacement = `<IntroScreen onFinish={() => {
            setShowIntro(false);
            try {
              if (window.Capacitor) {
                ScreenOrientation.lock({ orientation: 'landscape' }).catch(e => console.log(e));
                StatusBar.hide().catch(e => console.log(e));
              }
            } catch(e) {}
            if (!childProfile) {
              setShowLogin(true);
            }
          }} />`;

if (content.includes(introTarget)) {
  content = content.replace(introTarget, introReplacement);
  console.log("Intro Screen onFinish updated!");
} else {
  // Fuzzy replace
  content = content.replace(/<IntroScreen onFinish[\s\S]*?\}\s*\}\s*\/>/, introReplacement);
  console.log("Intro Screen onFinish updated via fuzzy regex!");
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log("App.tsx stage 2 rewritten!");
