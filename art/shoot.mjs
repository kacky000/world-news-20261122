// Photographs the front page: runs art/page.mjs, then has a headless Chromium-family browser save a
// 1024x1024 screenshot of art/front-page.html as entry.png at the repository root.
//   node art/shoot.mjs            (set CHROME to the browser's path if it is somewhere unusual)
import { execFileSync } from 'node:child_process';
import { existsSync, statSync, openSync, readSync, closeSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const local = (rel) => fileURLToPath(new URL(rel, import.meta.url));

const chrome = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
].find((path) => path && existsSync(path));
if (!chrome) throw new Error('no Chromium-family browser found; set CHROME');

execFileSync(process.execPath, [local('./page.mjs')], { stdio: 'inherit' });

const target = local('../entry.png');
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1024,1024', `--screenshot=${target}`, pathToFileURL(local('./front-page.html')).href,
], { stdio: 'ignore' });

// Read just the PNG header to report the size and refuse anything over the contest limits.
const header = Buffer.alloc(24);
const fd = openSync(target, 'r');
readSync(fd, header, 0, 24, 0);
closeSync(fd);
const size = statSync(target).size;
const [w, h] = [header.readUInt32BE(16), header.readUInt32BE(20)];
console.log(`entry.png ${w}x${h}, ${size} bytes`);
if (w > 1024 || h > 1024 || size > 1048576) throw new Error('entry.png breaks the 1024 px / 1 MiB limits');
