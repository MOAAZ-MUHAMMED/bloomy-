const fs = require('fs');
const transcriptPath = 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\dd4f6815-0b3b-4843-91ad-88a537a59211\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(transcriptPath)) {
  const content = fs.readFileSync(transcriptPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('طبخ') || line.includes('مطبخ') || line.includes('Kitchen') || line.includes('kitchen')) {
      console.log(`Line ${idx}: ${line.substring(0, 150)}`);
    }
  });
} else {
  console.log('Transcript file not found.');
}
