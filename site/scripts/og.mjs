// Renders public/og.png (1200x630) from the hero line and the current screenshots.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { parse } from './parse.mjs';
import { launch } from './browser.mjs';

const root = path.resolve(import.meta.dirname, '..');
const { entries } = parse();
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(root, 'node_modules/geist/dist/fonts', f)).toString('base64');
const img = (slug) => 'data:image/webp;base64,' + fs.readFileSync(path.join(root, 'public/shots', `${slug}.webp`)).toString('base64');
const shots = entries.slice(0, 4);
const html = `<!doctype html><html><head><style>
@font-face{font-family:G;src:url(${font('geist-sans/Geist-Variable.woff2')})}@font-face{font-family:GM;src:url(${font('geist-mono/GeistMono-Variable.woff2')})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;background:#0a0a0a;color:#fafafa;font-family:G;position:relative}
body:before{content:"";position:absolute;inset:0;background:radial-gradient(520px 260px at 24% 34%,rgba(120,119,198,.28),transparent 70%)}
.l{position:absolute;left:64px;top:70px;width:520px}.wm{font-weight:700;font-size:28px;letter-spacing:-.02em}.wm span{color:#8f8f8f;font-weight:500}
.pill{display:inline-block;margin-top:56px;font:16px GM;border:1px solid #333;border-radius:999px;padding:7px 16px;color:#a3a3a3}
h1{font-size:82px;line-height:.98;letter-spacing:-.045em;font-weight:700;margin-top:22px}h1 em{font-style:normal;background:linear-gradient(90deg,#fff,#9d9de6);-webkit-background-clip:text;color:transparent}
p{font-size:24px;color:#a3a3a3;margin-top:24px;line-height:1.35}
.r{position:absolute;left:640px;top:56px;width:620px;display:grid;grid-template-columns:1fr 1fr;gap:16px;transform:rotate(-4deg)}
.r figure{border:1px solid #2a2a2a;border-radius:14px;overflow:hidden;background:#000;aspect-ratio:16/10;box-shadow:0 20px 40px rgba(0,0,0,.5)}
.r img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}.r figure:nth-child(2n){transform:translateY(40px)}
</style></head><body><div class="l"><div class="wm">grokpages<span>.com</span></div><div class="pill">Grok Bot Pages templates</div>
<h1>Copy a <em>Grok Bot Page.</em></h1><p>Live public Pages plus the exact prompts that built them.</p></div>
<div class="r">${shots.map((e) => `<figure><img src="${img(e.slug)}"></figure>`).join('')}</div></body></html>`;
const b = await launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
const buf = await p.screenshot();
await sharp(buf).png({ compressionLevel: 9, palette: false }).toFile(path.join(root, 'public/og.png'));
await b.close();
console.log('Wrote public/og.png');
