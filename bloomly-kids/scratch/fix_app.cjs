const fs = require('fs');

const path = 'src/App.tsx';
let text = fs.readFileSync(path, 'utf8');

// Ensure Capacitor ScreenOrientation is imported
if (!text.includes('import { ScreenOrientation } from "@capacitor/screen-orientation";')) {
    text = text.replace(
        /import { motion, AnimatePresence } from "framer-motion";/,
        'import { motion, AnimatePresence } from "framer-motion";\nimport { ScreenOrientation } from "@capacitor/screen-orientation";'
    );
}

// Add the global landscape lock inside the Intro onFinish callback
text = text.replace(
    /onFinish=\{\(\) => \{\n\s*setShowIntro\(false\);\n\s*if \(\!childProfile\) \{/,
    `onFinish={async () => {
            setShowIntro(false);
            try {
              if (window.Capacitor?.isNativePlatform()) {
                await ScreenOrientation.lock({ type: 'landscape' });
              }
            } catch (e) {
              console.log("Landscape lock failed: ", e);
            }
            if (!childProfile) {`
);

fs.writeFileSync(path, text, 'utf8');
console.log("App.tsx orientation lock added!");
