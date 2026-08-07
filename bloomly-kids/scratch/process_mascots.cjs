const fs = require('fs');
const path = require('path');

let Jimp;
try {
  Jimp = require('jimp');
} catch (e) {
  console.log('Jimp is not installed. Please run: npm install jimp');
  process.exit(1);
}

const assetsDir = path.join(__dirname, '..', 'public', 'assets', 'mascots');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const imagesToProcess = [
  {
    src: 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\\isolated_apple_1786015538891.jpg',
    dest: 'apple_idle.png'
  },
  {
    src: 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\\apple_eyes_closed_1786016171246.jpg',
    dest: 'apple_blink.png'
  },
  {
    src: 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\\apple_waving_1786016183638.jpg',
    dest: 'apple_wave.png'
  },
  {
    src: 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\\isolated_orange_1786015546473.jpg',
    dest: 'orange_idle.png'
  },
  {
    src: 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\\orange_eyes_closed_1786016194674.jpg',
    dest: 'orange_blink.png'
  },
  {
    src: 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\\orange_waving_1786016202422.jpg',
    dest: 'orange_wave.png'
  }
];

async function processImages() {
  for (const item of imagesToProcess) {
    if (!fs.existsSync(item.src)) {
      console.error(`Source file does not exist: ${item.src}`);
      continue;
    }

    console.log(`Processing: ${item.dest}...`);
    try {
      const image = await Jimp.read(item.src);
      
      // Go through pixels and remove solid white background
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // If pixel is close to white (R, G, B all > 240)
        // Adjust threshold if needed. 240 is usually very safe for white backgrounds.
        if (r > 240 && g > 240 && b > 240) {
          this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (fully transparent)
        }
      });

      const destPath = path.join(assetsDir, item.dest);
      await image.writeAsync(destPath);
      console.log(`Saved transparent image to: ${destPath}`);
    } catch (err) {
      console.error(`Failed to process ${item.dest}:`, err);
    }
  }
  console.log('Background removal complete!');
}

processImages();
