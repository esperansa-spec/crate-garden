// Step 1 of the build: inline the models, font and levels into one page.  node build.js out.html
const fs = require('fs'), path = require('path');
const here = (f) => path.join(__dirname, f);
const levels = JSON.parse(fs.readFileSync(here('levels.json'), 'utf8'));
const font = fs.readFileSync(here('fredoka.woff2')).toString('base64');
const fontCss = `@font-face { font-family: "Fredoka"; font-weight: 400 700; font-display: swap; src: url(data:font/woff2;base64,${font}) format("woff2"); }`;
let h = fs.readFileSync(here('game.src.html'), 'utf8');
h = h.replace('/*FONT*/', () => fontCss)
  .replace('/*ASSETS*/', () => fs.readFileSync(here('assets.js'), 'utf8'))
  .replace('/*LEVELS*/', () => JSON.stringify(levels));
fs.writeFileSync(process.argv[2], h);
console.log('bytes', h.length);
