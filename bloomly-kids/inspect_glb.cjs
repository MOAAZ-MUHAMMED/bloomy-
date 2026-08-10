const fs = require('fs');
const path = require('path');

function inspectGlb(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Read GLB header
    const magic = buffer.toString('utf8', 0, 4);
    if (magic !== 'glTF') {
      return null;
    }
    
    const chunkLength = buffer.readUInt32LE(12);
    const chunkType = buffer.toString('utf8', 16, 20);
    
    if (chunkType !== 'JSON') {
      return null;
    }
    
    const jsonString = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonString);
    
    const animations = gltf.animations ? gltf.animations.map(a => a.name) : [];
    const materials = gltf.materials ? gltf.materials.map(m => m.name || 'unnamed') : [];
    
    return { animations, materials };
  } catch (e) {
    return null;
  }
}

const assetsDir = 'c:\\Users\\omar\\Desktop\\bloomy_assets 3d';
const files = fs.readdirSync(assetsDir);

console.log('Inspecting animations in GLB files...\n');
files.forEach(file => {
  if (file.toLowerCase().endsWith('.glb')) {
    const filePath = path.join(assetsDir, file);
    const result = inspectGlb(filePath);
    if (result) {
      console.log(`=== File: ${file} ===`);
      if (result.animations.length > 0) {
        console.log('Animations found:');
        result.animations.forEach((name, idx) => {
          console.log(`  - [${idx}] ${name}`);
        });
      } else {
        console.log('  (No animations found)');
      }
      console.log('');
    }
  }
});

