const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\omar\\.gemini\\antigravity\\brain';

try {
  if (!fs.existsSync(brainDir)) {
    console.log('Brain directory does not exist:', brainDir);
    process.exit(0);
  }

  const items = fs.readdirSync(brainDir);
  console.log('Found conversation directories:', items);

  for (const item of items) {
    const itemPath = path.join(brainDir, item);
    try {
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        const planPath = path.join(itemPath, 'implementation_plan.md');
        const walkPath = path.join(itemPath, 'walkthrough.md');
        const taskPath = path.join(itemPath, 'task.md');

        console.log(`\n========================================`);
        console.log(`Conversation ID: ${item}`);
        console.log(`========================================`);

        if (fs.existsSync(planPath)) {
          console.log(`[implementation_plan.md] Found. Previewing content:`);
          const content = fs.readFileSync(planPath, 'utf8');
          console.log(content.substring(0, 1500));
        } else {
          console.log(`[implementation_plan.md] Not found.`);
        }

        if (fs.existsSync(walkPath)) {
          console.log(`[walkthrough.md] Found. Previewing content:`);
          const content = fs.readFileSync(walkPath, 'utf8');
          console.log(content.substring(0, 1500));
        } else {
          console.log(`[walkthrough.md] Not found.`);
        }

        if (fs.existsSync(taskPath)) {
          console.log(`[task.md] Found. Previewing content:`);
          const content = fs.readFileSync(taskPath, 'utf8');
          console.log(content.substring(0, 800));
        } else {
          console.log(`[task.md] Not found.`);
        }
      }
    } catch (e) {
      console.log(`Could not process folder ${item}: ${e.message}`);
    }
  }
} catch (err) {
  console.error('Error scanning brain directory:', err);
}
