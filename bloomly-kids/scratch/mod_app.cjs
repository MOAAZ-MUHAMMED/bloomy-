const fs = require('fs');

const path = 'src/App.tsx';
let text = fs.readFileSync(path, 'utf8');

// Ensure StatusBar is imported
if (!text.includes('import { StatusBar } from "@capacitor/status-bar";')) {
    text = text.replace(
        /import { ScreenOrientation } from "@capacitor\/screen-orientation";/,
        'import { ScreenOrientation } from "@capacitor/screen-orientation";\nimport { StatusBar } from "@capacitor/status-bar";'
    );
}

// Add a global useEffect to lock landscape and hide status bar on mount
const globalEffect = `
  useEffect(() => {
    const initApp = async () => {
      try {
        if (window.Capacitor?.isNativePlatform()) {
          await ScreenOrientation.lock({ type: 'landscape' });
          await StatusBar.hide();
        }
      } catch (e) {
        console.log("App init failed: ", e);
      }
    };
    initApp();
  }, []);
`;

if (!text.includes('await StatusBar.hide();')) {
    // Insert after const [showIntro, setShowIntro] = useState(true);
    text = text.replace(
        /const \[showIntro, setShowIntro\] = useState\(true\);/,
        `const [showIntro, setShowIntro] = useState(true);\n${globalEffect}`
    );
}

fs.writeFileSync(path, text, 'utf8');
console.log("App.tsx modified for fullscreen landscape on mount.");
