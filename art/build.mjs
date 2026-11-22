// Builds art/front-page.html: one 1024x1024 front page for Sunday 22 November 2026.
// Everything on the page comes from the data in art/stories.mjs; this file only lays it out and draws it.
//   node art/build.mjs        writes art/front-page.html (git-ignored)
//   node art/render.mjs       builds, then screenshots it to entry.png with a headless browser
import { writeFileSync } from 'node:fs';
import { DAY, LEADS, CARDS, BRIEFS, CLOCK, OLDER, LATER, SOURCES } from './stories.mjs';
import { SCENES } from './scenes.mjs';
import { worldMap } from './map.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// One colour per region; the same colour marks the kicker, the number badge and the map pin.
const REGIONS = {
  'EUROPE': '#2456a6',
  'MIDDLE EAST': '#b3261e',
  'ASIA': '#7b3fa0',
  'AFRICA': '#1f7a3a',
  'N. AMERICA': '#c25e00',
  'LATIN AMERICA': '#8a6d00',
  'OCEANIA': '#0f7f86',
};

// How sure each drawn story is. The word is printed on the tag, the colour repeats in the legend.
const SURE = {
  CONFIRMED: { fill: '#dcefdc', ink: '#17602b', note: '2+ outlets' },
  OFFICIAL: { fill: '#dbe7f8', ink: '#1c4587', note: 'the body itself' },
  REPORTED: { fill: '#e9e1f3', ink: '#5b2b85', note: 'one outlet' },
  CLAIM: { fill: '#f8dcd6', ink: '#a1281c', note: 'one side says' },
  FORECAST: { fill: '#f5e9c4', ink: '#7a5a00', note: 'set for today' },
};

const drawn = [...LEADS, ...CARDS];
drawn.forEach((s, i) => { s.n = i + 1; });
BRIEFS.forEach((b, i) => { b.n = drawn.length + i + 1; });
const all = [...drawn, ...BRIEFS];
for (const s of all) {
  if (!REGIONS[s.region]) throw new Error(`unknown region on story ${s.n}: ${s.region}`);
  if (s.sure && !SURE[s.sure]) throw new Error(`unknown tag on story ${s.n}: ${s.sure}`);
}
const regionsUsed = new Set(all.map((s) => s.region));
const fields = new Set(all.map((s) => s.field));

const badge = (s, size) =>
  `<span class="num" style="background:${REGIONS[s.region]};width:${size}px;height:${size}px;line-height:${size}px;font-size:${Math.round(size * 0.62)}px">${s.n}</span>`;

const tag = (s) => {
  const t = SURE[s.sure];
  return `<div class="tagrow"><span class="tag" style="background:${t.fill};color:${t.ink}">${s.sure}</span><span class="src">${esc(s.src)}</span></div>`;
};

const art = (s, w, h) => {
  const scene = SCENES[s.art[0]];
  if (!scene) throw new Error(`no scene called ${s.art[0]} (story ${s.n})`);
  return `<svg class="art" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${scene(w, h, s.art[1] ?? {})}</svg>`;
};

const lead = (s) => `<article class="lead" style="border-top-color:${REGIONS[s.region]}">
${art(s, 326, 82)}
<div class="kick">${badge(s, 17)}<b style="color:${REGIONS[s.region]}">${s.region}</b> · ${esc(s.field.toUpperCase())}</div>
<h2>${esc(s.head)}</h2>
<p>${esc(s.deck)}</p>
${tag(s)}</article>`;

const card = (s) => `<article class="card" style="border-top-color:${REGIONS[s.region]}">
${art(s, 161, 48)}
<div class="kick">${badge(s, 15)}<b style="color:${REGIONS[s.region]}">${s.region}</b> · ${esc(s.field.toUpperCase())}</div>
<h3>${esc(s.head)}</h3>
${tag(s)}</article>`;

const brief = (b) => `<li>${badge(b, 14)}<b>${esc(b.place)}:</b> ${esc(b.text)}</li>`;

// The day by the clock: a line from 00:00 to 24:00 UTC with each timed event hung on it.
const clock = () => {
  const x0 = 96, x1 = 952, w = 996, yLine = 22;
  const at = (t) => { const [h, m] = t.split(':').map(Number); return x0 + ((h * 60 + m) / 1440) * (x1 - x0); };
  let out = `<svg viewBox="0 0 ${w} 44" width="${w}" height="44" xmlns="http://www.w3.org/2000/svg" font-family="Arial, Helvetica, sans-serif">`;
  out += `<text x="0" y="17" font-size="11.5" font-weight="700" fill="#a1281c" letter-spacing="0.8">THE DAY</text><text x="0" y="31" font-size="11.5" font-weight="700" fill="#a1281c" letter-spacing="0.8">IN UTC</text>`;
  out += `<line x1="${x0}" y1="${yLine}" x2="${x1}" y2="${yLine}" stroke="#1b1b1b" stroke-width="1.4"/>`;
  for (let h = 0; h <= 24; h += 3) {
    const x = x0 + (h / 24) * (x1 - x0);
    out += `<line x1="${x}" y1="${yLine - 3}" x2="${x}" y2="${yLine + 3}" stroke="#1b1b1b" stroke-width="1"/>`;
  }
  out += `<text x="${x0 - 6}" y="${yLine + 4}" font-size="11" fill="#555" text-anchor="end">00:00</text><text x="${x1 + 6}" y="${yLine + 4}" font-size="11" fill="#555">24:00</text>`;
  CLOCK.forEach((c, i) => {
    const x = at(c.t), up = i % 2 === 0;
    const anchor = c.anchor ?? 'middle';
    const dot = c.set ? `fill="#fff" stroke="#7a5a00" stroke-width="1.6"` : `fill="#a1281c" stroke="#fff" stroke-width="1"`;
    out += `<circle cx="${x}" cy="${yLine}" r="4" ${dot}/>`;
    out += `<text x="${x + (c.dx ?? 0)}" y="${up ? yLine - 8 : yLine + 17}" font-size="12" text-anchor="${anchor}" fill="${c.set ? '#7a5a00' : '#1b1b1b'}"><tspan font-weight="700">${c.t}</tspan> ${esc(c.label)}</text>`;
  });
  return out + '</svg>';
};

const legend = () => Object.entries(SURE).map(([k, v]) =>
  `<span class="lg"><span class="tag" style="background:${v.fill};color:${v.ink}">${k}</span> ${v.note}</span>`).join(' ');

// Region names as they read in the key under the map, with how many stories each has.
const NAMES = { 'EUROPE': 'Europe', 'MIDDLE EAST': 'Middle East', 'ASIA': 'Asia', 'AFRICA': 'Africa', 'N. AMERICA': 'N. America', 'LATIN AMERICA': 'Latin America', 'OCEANIA': 'Oceania' };
const regionKey = () => Object.entries(REGIONS).map(([k, v]) =>
  `<span class="rk"><i style="background:${v}"></i>${NAMES[k]} ${all.filter((s) => s.region === k).length}</span>`).join(' ');

const half = Math.ceil(BRIEFS.length / 2);
const count = `${all.length} STORIES · ${regionsUsed.size} REGIONS · ${fields.size} FIELDS · EVERY ONE FROM THIS ${DAY.weekday.toUpperCase()}`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${DAY.long}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1024px;height:1024px;overflow:hidden;background:#f6f1e6;color:#1b1b1b;font-family:Arial,Helvetica,sans-serif}
.page{position:relative;width:1024px;height:1024px;padding:7px 14px 0}
.top{display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;letter-spacing:1.1px;height:15px}
.top .l{color:#a1281c}
h1{font-family:Cambria,Georgia,'Times New Roman',serif;font-weight:700;font-size:80px;line-height:72px;height:77px;letter-spacing:-1.6px;white-space:nowrap;text-align:center;border-bottom:3px solid #1b1b1b}
.clock{height:46px;border-bottom:1px solid #1b1b1b;margin-bottom:6px}
.leads{display:grid;grid-template-columns:repeat(3,326px);gap:9px;height:205px}
.cards{display:grid;grid-template-columns:repeat(6,161px);gap:6px;margin-top:6px;height:137px}
article{background:#fffdf8;border-top:3px solid;overflow:hidden;position:relative}
.art{display:block}
.kick{font-size:11px;letter-spacing:.4px;color:#555;padding:4px 6px 0;white-space:nowrap;overflow:hidden}
.card .kick{font-size:10.5px;letter-spacing:.1px;padding:4px 5px 0}
.num{display:inline-block;border-radius:50%;color:#fff;text-align:center;font-weight:700;margin-right:4px;vertical-align:-2px;letter-spacing:0;flex:none}
h2{font-family:Georgia,serif;font-size:21.5px;line-height:23px;padding:2px 7px 0;letter-spacing:-.3px}
.lead p{font-size:12px;line-height:14.5px;padding:3px 7px 0;color:#2a2a2a}
h3{font-family:Georgia,serif;font-size:14px;line-height:15.5px;padding:2px 6px 0;letter-spacing:-.2px}
.tagrow{position:absolute;left:6px;bottom:4px;right:4px;white-space:nowrap;overflow:hidden;font-size:11px}
.tag{font-size:10.5px;font-weight:700;letter-spacing:.5px;padding:1px 4px;border-radius:2px}
.src{font-size:11px;color:#444;margin-left:5px;font-weight:700;letter-spacing:.2px}
.low{display:grid;grid-template-columns:318px minmax(0,1fr);gap:12px;margin-top:7px;border-top:2px solid #1b1b1b;padding-top:4px}
.hd{font-size:11.5px;font-weight:700;letter-spacing:1.1px;display:flex;justify-content:space-between}
.hd span{color:#555;font-weight:400;letter-spacing:.3px}
.rks{font-size:11px;line-height:13px;margin-top:1px}
.rk{margin-right:7px;white-space:nowrap}.rk i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:3px}
.sure{margin-top:3px;font-size:11px;line-height:15px}
.sure b{letter-spacing:1.1px;font-size:11.5px;margin-right:4px}
.lg{margin-right:6px;white-space:nowrap}
.check{margin-top:4px;border:1.5px solid #a1281c;background:#fbeeea;padding:3px 6px 3px}
.check .ch{color:#a1281c;font-size:11.5px;font-weight:700;letter-spacing:1px}
.check table{width:100%;border-collapse:collapse;font-size:11.5px;line-height:13.5px}
.check td:last-child{text-align:right;font-weight:700;color:#a1281c;white-space:nowrap}
.check .ny{font-size:11.5px;line-height:13.5px;margin-top:1px}
.briefs{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 14px}
.briefs ul{list-style:none}
.briefs li{font-size:12.4px;line-height:17.6px;height:17.6px;white-space:nowrap;overflow:hidden;border-bottom:1px dotted #b9b2a3}
.foot{position:absolute;left:14px;right:14px;bottom:4px;font-size:11px;display:flex;justify-content:space-between;border-top:1px solid #1b1b1b;padding-top:2px;white-space:nowrap}
</style></head><body><div class="page">
<div class="top"><span class="l">THE WORLD'S NEWS OF ONE DAY, ON ONE PAGE</span><span>${count}</span></div>
<h1>${DAY.long}</h1>
<div class="clock">${clock()}</div>
<section class="leads">${LEADS.map(lead).join('')}</section>
<section class="cards">${CARDS.slice(0, 6).map(card).join('')}</section>
<section class="cards">${CARDS.slice(6, 12).map(card).join('')}</section>
<section class="low">
<div>
<div class="hd">WHERE IT HAPPENED <span>numbers match the stories</span></div>
${worldMap(318, 132, all, REGIONS)}
<div class="rks">${regionKey()}</div>
<div class="sure"><b>HOW SURE</b>${legend()}</div>
<div class="check"><div class="ch">DATE CHECK · OTHER DAYS' NEWS, LEFT OUT</div>
<table>${OLDER.map((o) => `<tr><td>${esc(o.what)}</td><td>${esc(o.when)}</td></tr>`).join('')}</table>
<div class="ny"><b>Later today:</b> ${esc(LATER)}</div></div>
</div>
<div>
<div class="hd">ALSO ON ${DAY.short.toUpperCase()} <span>numbered on from the pictures above</span></div>
<div class="briefs"><ul>${BRIEFS.slice(0, half).map(brief).join('')}</ul><ul>${BRIEFS.slice(half).map(brief).join('')}</ul></div>
</div>
</section>
<div class="foot"><span><b>Every story here happened, or was first reported, on ${DAY.long}.</b></span><span>Sources: ${esc(SOURCES)}. Original drawings.</span></div>
</div></body></html>
`;

writeFileSync(new URL('./front-page.html', import.meta.url), html);
console.log(`front-page.html: ${count}`);
