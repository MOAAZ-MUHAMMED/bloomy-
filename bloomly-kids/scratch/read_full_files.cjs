const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\9a8554b1-9ff5-47a7-850e-04e0457cb285';

try {
  const planPath = path.join(targetDir, 'implementation_plan.md');
  const walkPath = path.join(targetDir, 'walkthrough.md');
  const taskPath = path.join(targetDir, 'task.md');

  if (fs.existsSync(planPath)) {
    console.log('--- IMPLEMENTATION PLAN ---');
    console.log(fs.readFileSync(planPath, 'utf8'));
  }
  if (fs.existsSync(walkPath)) {
    console.log('--- WALKTHROUGH ---');
    console.log(fs.readFileSync(walkPath, 'utf8'));
  }
  if (fs.existsSync(taskPath)) {
    console.log('--- TASK ---');
    console.log(fs.readFileSync(taskPath, 'utf8'));
  }
} catch (e) {
  console.error(e);
}
