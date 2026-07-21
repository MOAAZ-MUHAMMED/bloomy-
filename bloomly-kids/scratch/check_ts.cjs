const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('npx tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
  fs.writeFileSync('scratch/tsc_output.txt', 'SUCCESS\n' + output);
} catch (error) {
  fs.writeFileSync('scratch/tsc_output.txt', 'ERROR\n' + error.stdout + '\n' + error.stderr);
}
