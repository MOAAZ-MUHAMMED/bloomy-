const fs = require('fs');

const files = fs.readdirSync('src/components');
console.log('Files in src/components containing Space/Decoder/English:');
files.forEach((f) => {
  if (f.toLowerCase().includes('space') || f.toLowerCase().includes('decoder') || f.toLowerCase().includes('english')) {
    console.log(f);
  }
});
