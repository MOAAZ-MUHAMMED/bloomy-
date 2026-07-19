const fs = require('fs');

const path = 'src/components/LearningPathMap.tsx';
let content = fs.readFileSync(path, 'utf8');

// Match the islandsData array
const regex = /export const islandsData: IslandData\[\] = \[([\s\S]*?)\];/;
const match = content.match(regex);

if (match) {
  let arrayContent = match[1];
  
  // Split into individual objects
  // A bit hacky but works for this specific formatting
  const parts = arrayContent.split('},');
  
  let currentY = 5;
  const spacingY = 10;
  
  const modifiedParts = parts.map((part, index) => {
    let modified = part;
    
    // Zig-zag X coordinate
    const newX = index % 2 === 0 ? 30 : 70;
    modified = modified.replace(/x:\s*\d+,/, `x: ${newX},`);
    
    // Increment Y coordinate
    modified = modified.replace(/y:\s*\d+/, `y: ${currentY}`);
    currentY += spacingY;
    
    return modified;
  });
  
  const newArrayContent = modifiedParts.join('},');
  content = content.replace(regex, `export const islandsData: IslandData[] = [${newArrayContent}];`);
  
  // Also update container height
  const containerHeightMatch = content.match(/height:\s*'(\d+)px'/);
  if (containerHeightMatch) {
     const newHeight = currentY * 25 + 200; // 25px per Y unit roughly
     content = content.replace(/height:\s*'\d+px'/, `height: '${newHeight}px'`);
  }
  
  fs.writeFileSync(path, content, 'utf8');
  console.log("Successfully scaled map points.");
} else {
  console.log("Could not find islandsData array.");
}
