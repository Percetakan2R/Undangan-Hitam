import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.resolve(rootDir, 'docs');

await build({
  configFile: path.resolve(rootDir, 'vite.config.ts'),
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
  },
});

const htmlPath = path.join(docsDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const cssMatch = html.match(/<link\s+rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/i);
if (cssMatch) {
  const cssRel = cssMatch[1].replace(/^\.\//, '');
  const cssPath = path.join(docsDir, cssRel);
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  html = html.replace(cssMatch[0], () => `<style>\n${cssContent}\n</style>`);
}

const jsMatch = html.match(/<script\s+type="module"[^>]*src="([^"]+\.js)"[^>]*><\/script>/i);
if (jsMatch) {
  const jsRel = jsMatch[1].replace(/^\.\//, '');
  const jsPath = path.join(docsDir, jsRel);
  const jsContent = fs.readFileSync(jsPath, 'utf8').replace(/<\/script/gi, '<\\/script');
  html = html.replace(jsMatch[0], () => `<script type="module">\n${jsContent}\n</script>`);
}

fs.writeFileSync(htmlPath, html, 'utf8');

const assetsDir = path.join(docsDir, 'assets');
if (fs.existsSync(assetsDir)) {
  fs.rmSync(assetsDir, { recursive: true, force: true });
}

const nojekyllPath = path.join(docsDir, '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '', 'utf8');
}

const sizeMb = (fs.statSync(htmlPath).size / (1024 * 1024)).toFixed(2);
console.log(`Standalone single-file built at docs/index.html (${sizeMb} MB)`);
