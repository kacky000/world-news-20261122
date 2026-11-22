// Builds the page and photographs it: art/front-page.html -> entry.png (1024x1024).
//   node art/render.mjs
// Needs a Chromium-family browser; set BROWSER_BIN if it is not where this script looks.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = (name) => fileURLToPath(new URL(name, import.meta.url));

const candidates = [
  process.env.BROWSER_BIN,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error('no browser found: set BROWSER_BIN');

const built = spawnSync(process.execPath, [here('./build.mjs')], { stdio: 'inherit' });
if (built.status !== 0) process.exit(built.status ?? 1);

const png = here('../entry.png');
const shot = spawnSync(browser, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1024,1024', `--screenshot=${png}`, pathToFileURL(here('./front-page.html')).href,
], { stdio: 'ignore' });
if (shot.status !== 0) throw new Error(`browser exited with ${shot.status}`);

const bytes = readFileSync(png);
const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
console.log(`entry.png: ${bytes.length} bytes, ${width}x${height}`);
if (width > 1024 || height > 1024 || bytes.length > 1048576) throw new Error('entry.png is over the limits');
