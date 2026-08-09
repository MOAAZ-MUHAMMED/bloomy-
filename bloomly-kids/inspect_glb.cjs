const fs = require('fs');

function inspectGlb(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  // Read GLB header
  const magic = buffer.toString('utf8', 0, 4);
  if (magic !== 'glTF') {
    console.error('Not a valid glTF/GLB file');
    return;
  }
  
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  console.log(`GLB Version: ${version}, Length: ${length} bytes`);
  
  // Read Chunk 0 (JSON)
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.toString('utf8', 16, 20);
  
  if (chunkType !== 'JSON') {
    console.error('First chunk is not JSON');
    return;
  }
  
  const jsonString = buffer.toString('utf8', 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonString);
  
  console.log('\n--- ANIMATIONS ---');
  if (gltf.animations) {
    gltf.animations.forEach((anim, idx) => {
      console.log(`Animation ${idx}: "${anim.name}"`);
    });
  } else {
    console.log('No animations found!');
  }
  
  console.log('\n--- MATERIALS ---');
  if (gltf.materials) {
    gltf.materials.forEach((mat, idx) => {
      console.log(`Material ${idx}: name="${mat.name}", pbrMetallicRoughness=${JSON.stringify(mat.pbrMetallicRoughness)}`);
    });
  } else {
    console.log('No materials found!');
  }
}

inspectGlb('public/Rainbow_animation.glb');
