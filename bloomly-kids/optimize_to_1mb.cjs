const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { KHRONOS_EXTENSIONS } = require('@gltf-transform/extensions');
const { Jimp } = require('jimp');
const gltfPipeline = require('gltf-pipeline');
const processGlb = gltfPipeline.processGlb;

const dir = './src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.glb'));

async function run() {
  console.log(`Found ${files.length} GLB models to compress below 1MB.`);
  const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);

  for (const file of files) {
    const filepath = path.join(dir, file);
    const origSize = fs.statSync(filepath).size / (1024 * 1024);
    
    if (origSize < 0.1) {
      console.log(`Skipping tiny file: ${file} (${origSize.toFixed(2)} MB)`);
      continue;
    }

    console.log(`\n========================================`);
    console.log(`Compressing below 1MB: ${file} (Original Size: ${origSize.toFixed(2)} MB)`);
    console.log(`========================================`);

    try {
      const doc = await io.read(filepath);
      const textures = doc.getRoot().listTextures();
      console.log(`- Found ${textures.length} embedded textures.`);
      
      // Sizing strategy to get ALL files under 1MB:
      // Heavy models get 128px textures, others get 256px textures
      const isHeavy = file === 'orbiting_solar_system.glb' || file === 'walking_astronaut.glb' || file === 'merlin.glb' || file === 'celebration_balloons.glb';
      const maxDim = isHeavy ? 128 : 256;
      console.log(`- Resizing textures to max ${maxDim}px (Preserving PNG/JPEG MIME types correctly)...`);
      
      let optimizedCount = 0;
      for (const tex of textures) {
        const origBuffer = tex.getImage();
        const mimeType = tex.getMimeType(); // e.g. 'image/png' or 'image/jpeg'
        
        // Skip optimizing if already very tiny
        if (origBuffer.byteLength < 5 * 1024) continue;

        try {
          const img = await Jimp.read(Buffer.from(origBuffer));
          
          let modified = false;
          if (img.bitmap.width > maxDim || img.bitmap.height > maxDim) {
            const aspect = img.bitmap.height / img.bitmap.width;
            let newW, newH;
            if (img.bitmap.width > img.bitmap.height) {
              newW = maxDim;
              newH = Math.round(newW * aspect);
            } else {
              newH = maxDim;
              newW = Math.round(newH / aspect);
            }
            img.resize({ w: newW, h: newH });
            modified = true;
          }
          
          // Re-encode preserving format & quality (fixing MIME type mismatch bug!)
          let newBuffer;
          if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
            img.quality(70);
            newBuffer = await img.getBuffer('image/jpeg');
            tex.setImage(new Uint8Array(newBuffer));
            tex.setMimeType('image/jpeg');
          } else {
            // Keep PNG to preserve transparency/alpha mapping
            newBuffer = await img.getBuffer('image/png');
            tex.setImage(new Uint8Array(newBuffer));
            tex.setMimeType('image/png');
          }
          optimizedCount++;
        } catch (imgErr) {
          console.log(`  - Failed to process a texture:`, imgErr.message);
          continue;
        }
      }
      
      console.log(`- Optimized ${optimizedCount} textures.`);
      
      // Save intermediate GLB
      console.log(`- Saving intermediate GLB...`);
      const intermediateGlb = await io.writeBinary(doc);
      
      // Apply Draco compression (Using default settings)
      console.log(`- Applying Draco geometry compression...`);
      const dracoOptions = {
        dracoOptions: {
          compressionLevel: 7
        }
      };
      
      const dracoResult = await processGlb(Buffer.from(intermediateGlb), dracoOptions);
      fs.writeFileSync(filepath, dracoResult.glb);
      
      const finalSize = fs.statSync(filepath).size / (1024 * 1024);
      console.log(`- Success: ${file} optimized to ${finalSize.toFixed(2)} MB (${((1 - finalSize / origSize) * 100).toFixed(1)}% total savings)`);
      
    } catch (err) {
      console.error(`- Error optimizing ${file}:`, err.message);
    }
  }
  
  console.log('\nAll model compressions completed successfully!');
}

run();
