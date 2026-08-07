const fs = require('fs');
const path = require('path');

const oldDir = 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\9a8554b1-9ff5-47a7-850e-04e0457cb285';
const newDir = 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e';

try {
  const files = fs.readdirSync(oldDir);
  console.log('Files in old dir:', files);
  
  files.forEach(file => {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      const src = path.join(oldDir, file);
      const dest = path.join(newDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} to current conversation directory.`);
    }
  });
} catch (e) {
  console.error(e);
}
