const https = require('https');
https.get('https://bloomy11.pages.dev/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="\/assets\/index-.*?\.js"/g);
    console.log('HTML contains main JS:', match);
  });
});
