const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace('<section className="container mx-auto px-4 py-16 relative z-10">', '<section id="what-we-teach" className="container mx-auto px-4 py-16 relative z-10">');
fs.writeFileSync('src/App.tsx', app, 'utf8');
console.log("App.tsx what-we-teach ID added!");
