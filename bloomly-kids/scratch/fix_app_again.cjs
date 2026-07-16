const fs = require('fs');
const cp = require('child_process');
cp.execSync('git checkout src/App.tsx');

let app = fs.readFileSync('src/App.tsx', 'utf8');
const search1 = 'import { StatusBar } from "@capacitor/status-bar";\n\nimport { StatusBar } from "@capacitor/status-bar";';
const search2 = 'import { StatusBar } from "@capacitor/status-bar";\r\n\r\nimport { StatusBar } from "@capacitor/status-bar";';
const search3 = 'import { StatusBar } from "@capacitor/status-bar";\r\nimport { StatusBar } from "@capacitor/status-bar";';
const search4 = 'import { StatusBar } from "@capacitor/status-bar";\nimport { StatusBar } from "@capacitor/status-bar";';

app = app.replace(search1, 'import { StatusBar } from "@capacitor/status-bar";');
app = app.replace(search2, 'import { StatusBar } from "@capacitor/status-bar";');
app = app.replace(search3, 'import { StatusBar } from "@capacitor/status-bar";');
app = app.replace(search4, 'import { StatusBar } from "@capacitor/status-bar";');

fs.writeFileSync('src/App.tsx', app, 'utf8');
console.log("App.tsx fixed");
