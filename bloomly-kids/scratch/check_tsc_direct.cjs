const { execSync } = require('child_process');
try {
  const out = execSync('npx tsc', { encoding: 'utf8' });
  console.log('TSC SUCCESS:', out);
} catch (e) {
  console.log('TSC ERROR:\n', e.stdout || e.message);
}
