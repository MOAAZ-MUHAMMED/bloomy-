const fs = require('fs');
const path = require('path');
function searchDir(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      searchDir(fullPath, query);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (line.includes(query)) {
          console.log(`${file}:${i+1}: ${line.trim()}`);
        }
      });
    }
  }
}
searchDir('c:/Users/omar/Desktop/Huda-Nour-Site/bloomly-kids/src/components', 'الفنان');
searchDir('c:/Users/omar/Desktop/Huda-Nour-Site/bloomly-kids/src/components', 'النصف');
searchDir('c:/Users/omar/Desktop/Huda-Nour-Site/bloomly-kids/src/components', 'النيون');
