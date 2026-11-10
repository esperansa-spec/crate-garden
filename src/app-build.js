// Step 2 of the build: bundle three.js in, so the game is one offline file.  node app-build.js page.html ../index.html
// Needs `npm install` in this folder first (three + esbuild).
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const src = fs.readFileSync(process.argv[2], 'utf8'); // built single page (assets + levels inlined)
const out = process.argv[3];
const modStart = src.indexOf('<script type="module">');
const modEnd = src.indexOf('</script>', modStart);
const code = src.slice(modStart + '<script type="module">'.length, modEnd);
const entry = path.join(__dirname, '.app-entry.js'), bundleFile = path.join(os.tmpdir(), 'crate-garden-bundle.js');
fs.writeFileSync(entry, code);
try {
  execFileSync('npx', ['esbuild', entry, '--bundle', '--minify', '--format=iife', '--alias:three/addons=./node_modules/three/examples/jsm', '--outfile=' + bundleFile, '--log-level=warning'], { cwd: __dirname, stdio: 'inherit' });
} finally { fs.unlinkSync(entry); }
const bundle = fs.readFileSync(bundleFile, 'utf8').replace(/<\/script/gi, '<\\/script');
let body = src.slice(0, modStart) + '<script>' + bundle + '</script>' + src.slice(modEnd + 9);
body = body.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#4fb3f6">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Crate Garden">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>[hidden]{display:none!important}</style>
`;
// pull <title>/<meta>/<link>/<style> of the page into head; rest goes in body
const styleEnd = body.indexOf('</style>') + 8;
const html = head + body.slice(0, styleEnd) + '\n</head>\n<body>\n' + body.slice(styleEnd) +
`\n<script>if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});</script>\n</body>\n</html>\n`;
fs.writeFileSync(out, html);
console.log('bytes', html.length);
