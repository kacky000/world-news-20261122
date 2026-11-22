// The entry: one image that sums up the world's news of Sunday 22 November 2026.
// entry.png beside this file is the finished front page (drawn by art/build.mjs, photographed by art/render.mjs);
// this program hands the grader those exact bytes, so every run writes the same file.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PNG_SIGNATURE = '89504e470d0a1a0a';
const MAX_BYTES = 1048576;
const MAX_SIDE = 1024;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const image = readFileSync(new URL('./entry.png', import.meta.url));

// Refuse to hand in a file the gate would turn away, and say why.
if (image.subarray(0, 8).toString('hex') !== PNG_SIGNATURE) throw new Error('entry.png is not a PNG');
const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (image.length > MAX_BYTES) throw new Error(`entry.png is ${image.length} bytes, over ${MAX_BYTES}`);
if (width > MAX_SIDE || height > MAX_SIDE) throw new Error(`entry.png is ${width}x${height}, over ${MAX_SIDE}`);

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'entry.png'), image);
console.log(`wrote entry.png: ${width}x${height}, ${image.length} bytes`);
