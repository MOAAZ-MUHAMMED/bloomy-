const { execSync } = require('child_process');
const fs = require('fs');

try {
  const stdout = execSync('cmd.exe /c "npm run build"', { encoding: 'utf8', stdio: 'pipe' });
  fs.writeFileSync('scratch/build_result.txt', 'FULL BUILD SUCCESSFUL:\n' + stdout);
} catch (err) {
  const output = (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message;
  fs.writeFileSync('scratch/build_result.txt', 'FULL BUILD FAILED:\n' + output);
}
