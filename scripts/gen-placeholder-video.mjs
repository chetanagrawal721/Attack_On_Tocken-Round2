// Generates placeholder videos with Playwright's recorder (no ffmpeg needed).
//   node scripts/gen-placeholder-video.mjs            -> all three placeholders
//   node scripts/gen-placeholder-video.mjs galat      -> only one
// Replace them by dropping your own files (same name, .mp4) into public/media/.
import { chromium } from '@playwright/test';
import { mkdtempSync, renameSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SPECS = {
  intrusion: { out: 'intrusion.webm', secs: 6, bg: '#101426', glow: 'conic-gradient(from 0deg,#3b5bfd,#8b5cf6,#14b8a6,#3b5bfd)', emoji: '✦', title: 'PLACEHOLDER VIDEO', sub: 'replace public/media/intrusion.mp4' },
  galat: { out: 'galat-ghanta.webm', secs: 4, bg: '#1a0a06', glow: 'conic-gradient(from 0deg,#ff6a00,#ee0979,#ffb347,#ff6a00)', emoji: '🔔', title: 'GALAT GHANTA', sub: 'placeholder · replace public/media/galat-ghanta.mp4' },
  start: { out: 'get-started.webm', secs: 4, bg: '#041a1a', glow: 'conic-gradient(from 0deg,#00c9a7,#845ec2,#00d2fc,#00c9a7)', emoji: '🚀', title: 'UNEXPECTED VIDEO', sub: 'placeholder · replace public/media/get-started.mp4' },
};

const only = process.argv[2];
const browser = await chromium.launch();
for (const [key, v] of Object.entries(SPECS)) {
  if (only && only !== key) continue;
  const dir = mkdtempSync(join(tmpdir(), 'halo-vid-'));
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 }, recordVideo: { dir, size: { width: 960, height: 540 } } });
  const page = await ctx.newPage();
  await page.setContent(`<body style="margin:0;height:100vh;display:grid;place-items:center;font-family:system-ui;color:#fff;overflow:hidden;background:${v.bg}">
<div id=b style="position:absolute;inset:-20%;background:${v.glow};filter:blur(80px);opacity:.55"></div>
<div style="position:relative;text-align:center"><div style="font-size:72px">${v.emoji}</div><div style="font-size:34px;font-weight:700">${v.title}</div><div style="opacity:.75;margin-top:8px">${v.sub}</div></div>
<script>let a=0;(function f(){a+=2;document.getElementById('b').style.transform='rotate('+a+'deg)';requestAnimationFrame(f)})()</script></body>`);
  await page.waitForTimeout(v.secs * 1000);
  await ctx.close();
  const f = readdirSync(dir).find((x) => x.endsWith('.webm'));
  renameSync(join(dir, f), join('public', 'media', v.out));
  console.log('wrote public/media/' + v.out);
}
await browser.close();
