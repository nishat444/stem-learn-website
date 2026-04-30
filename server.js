const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files from /docs
app.use(express.static(path.join(__dirname, 'docs')));

// Default route → send index.html inside /docs
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  const base = `http://localhost:${PORT}`;
  console.log(`Server running on ${base}`);
  console.log('Open in browser:');
  console.log(`  ${base}/local-pages.html  (all preview links)`);
  console.log(`  ${base}/`);
  console.log(`  ${base}/mentors.html`);
  console.log(`  ${base}/registration.html`);
  console.log(`  ${base}/success-stories.html`);
  console.log(`  ${base}/monthly-payment.html`);
  console.log(`  ${base}/index.html#courses`);
  console.log(`  ${base}/index.html#registration`);
});

