const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Fix Capacitor types
app = app.replace('if (window.Capacitor && window.Capacitor.isNative) {', 'if ((window as any).Capacitor && (window as any).Capacitor.isNative) {');
app = app.replace("await ScreenOrientation.lock({ type: 'landscape' });", "await ScreenOrientation.lock({ orientation: 'landscape' } as any);");

fs.writeFileSync('src/App.tsx', app, 'utf8');
console.log("App.tsx fixed");
