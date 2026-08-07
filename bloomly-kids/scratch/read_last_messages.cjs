const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:\\Users\\omar\\.gemini\\antigravity\\brain\\9a8554b1-9ff5-47a7-850e-04e0457cb285\\.system_generated\\logs\\transcript.jsonl';

try {
  if (fs.existsSync(transcriptPath)) {
    const content = fs.readFileSync(transcriptPath, 'utf8');
    const lines = content.trim().split('\n');
    console.log(`Total steps: ${lines.length}`);
    
    // Print the last 40 steps
    const lastLines = lines.slice(-40);
    lastLines.forEach((line, index) => {
      try {
        const data = JSON.parse(line);
        console.log(`\n--- Line ${lines.length - 40 + index} - Step ${data.step_index || index} (${data.source || 'unknown'} - ${data.type || 'unknown'}) ---`);
        if (data.type === 'USER_INPUT') {
          console.log('USER:', data.content);
        } else if (data.type === 'PLANNER_RESPONSE') {
          console.log('MODEL:', data.content ? data.content.substring(0, 1000) : '(No text content)');
          if (data.tool_calls) {
            console.log('TOOL CALLS:', JSON.stringify(data.tool_calls.map(tc => tc.name || tc.function?.name)));
          }
        } else {
          // Print snippet
          console.log(data.content ? data.content.substring(0, 300) : JSON.stringify(data).substring(0, 300));
        }
      } catch (err) {
        console.log(`Failed to parse line: ${err.message}`);
      }
    });
  } else {
    console.log('Transcript not found at:', transcriptPath);
  }
} catch (e) {
  console.error(e);
}
