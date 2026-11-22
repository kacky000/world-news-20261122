// Lays out the front page for Sunday 22 November 2026 and writes it to art/front-page.html (not kept in git).
// The words and the facts all live in art/stories.mjs; this file decides where they go and how they look.
//   node art/page.mjs      -> art/front-page.html
//   node art/shoot.mjs     -> runs this, then photographs the page into entry.png
import { writeFileSync } from 'node:fs';
import * as day from './stories.mjs';
import { PICTURES } from './pictures.mjs';
import { drawWorld } from './worldmap.mjs';

const text = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The seven regions, each with the colour used for its kicker, its number disc and its map pin.
const REGION_INK = new Map([
  ['EUROPE', '#2456a6'], ['MIDDLE EAST', '#b3261e'], ['ASIA', '#7b3fa0'], ['AFRICA', '#1f7a3a'],
  ['N. AMERICA', '#c25e00'], ['LATIN AMERICA', '#8a6d00'], ['OCEANIA', '#0f7f86'],
]);
const REGION_NAME = { 'EUROPE': 'Europe', 'MIDDLE EAST': 'Middle East', 'ASIA': 'Asia', 'AFRICA': 'Africa', 'N. AMERICA': 'N. America', 'LATIN AMERICA': 'Latin America', 'OCEANIA': 'Oceania' };

// The five words that say how sure a story is, and what each one means.
const HOW_SURE = [
  ['CONFIRMED', '#dcefdc', '#17602b', '2+ outlets'],
  ['OFFICIAL', '#dbe7f8', '#1c4587', 'the body itself'],
  ['REPORTED', '#e9e1f3', '#5b2b85', 'one outlet'],
  ['CLAIM', '#f8dcd6', '#a1281c', 'one side says'],
  ['FORECAST', '#f5e9c4', '#7a5a00', 'set for today'],
];
const sureStyle = Object.fromEntries(HOW_SURE.map(([word, bg, ink]) => [word, { bg, ink }]));

// Number everything in reading order: leads, then cards, then briefs.
const pictured = [...day.LEADS, ...day.CARDS];
const stories = [...pictured, ...day.BRIEFS];
stories.forEach((s, k) => { s.n = k + 1; });
for (const s of stories) {
  if (!REGION_INK.has(s.region)) throw new Error(`story ${s.n}: no region called ${s.region}`);
  if (s.tag && !sureStyle[s.tag]) throw new Error(`story ${s.n}: no tag called ${s.tag}`);
  if (s.pic && !PICTURES[s.pic[0]]) throw new Error(`story ${s.n}: no picture called ${s.pic[0]}`);
}
const ink = (s) => REGION_INK.get(s.region);
const regionCount = new Set(stories.map((s) => s.region)).size;
const fieldCount = new Set(stories.map((s) => s.field)).size;
const tally = `${stories.length} STORIES · ${regionCount} REGIONS · ${fieldCount} FIELDS · EVERY ONE FROM THIS ${day.DAY.weekday.toUpperCase()}`;

const disc = (s, d) => `<i class="disc" style="background:${ink(s)};width:${d}px;height:${d}px;line-height:${d}px;font-size:${Math.round(d * 0.62)}px">${s.n}</i>`;
const picture = (s, w, h) => `<svg class="pic" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${PICTURES[s.pic[0]](w, h, s.pic[1] ?? {})}</svg>`;
const sureLine = (s) => `<div class="sure"><b style="background:${sureStyle[s.tag].bg};color:${sureStyle[s.tag].ink}">${s.tag}</b><span>${text(s.by)}</span></div>`;
const kicker = (s, d) => `<div class="kick">${disc(s, d)}<b style="color:${ink(s)}">${s.region}</b> · ${text(s.field.toUpperCase())}</div>`;

const leadBox = (s) => `<article class="lead" style="border-color:${ink(s)}">${picture(s, 326, 82)}${kicker(s, 17)}<h2>${text(s.head)}</h2><p>${text(s.deck)}</p>${sureLine(s)}</article>`;
const cardBox = (s) => `<article class="card" style="border-color:${ink(s)}">${picture(s, 161, 48)}${kicker(s, 15)}<h3>${text(s.head)}</h3>${sureLine(s)}</article>`;

// The clock strip: 00:00 to 24:00 UTC, a dot for each timed event; hollow dots are set but not yet happened.
function clockStrip() {
  const left = 96, right = 952, mid = 22;
  const xOf = (hhmm) => { const [hh, mm] = hhmm.split(':').map(Number); return left + ((hh * 60 + mm) / 1440) * (right - left); };
  const bits = [
    `<text x="0" y="17" font-size="11.5" font-weight="700" fill="#a1281c" letter-spacing="0.8">THE DAY</text>`,
    `<text x="0" y="31" font-size="11.5" font-weight="700" fill="#a1281c" letter-spacing="0.8">IN UTC</text>`,
    `<line x1="${left}" y1="${mid}" x2="${right}" y2="${mid}" stroke="#1b1b1b" stroke-width="1.4"/>`,
    `<text x="${left - 6}" y="${mid + 4}" font-size="11" fill="#555" text-anchor="end">00:00</text>`,
    `<text x="${right + 6}" y="${mid + 4}" font-size="11" fill="#555">24:00</text>`,
  ];
  for (let hh = 0; hh <= 24; hh += 3) {
    const x = left + (hh / 24) * (right - left);
    bits.push(`<line x1="${x}" y1="${mid - 3}" x2="${x}" y2="${mid + 3}" stroke="#1b1b1b"/>`);
  }
  day.CLOCK.forEach((c, k) => {
    const x = xOf(c.t);
    const above = c.above ?? k % 2 === 0;
    bits.push(c.set
      ? `<circle cx="${x}" cy="${mid}" r="4" fill="#fff" stroke="#7a5a00" stroke-width="1.6"/>`
      : `<circle cx="${x}" cy="${mid}" r="4" fill="#a1281c" stroke="#fff"/>`);
    bits.push(`<text x="${x + (c.dx ?? 0)}" y="${above ? mid - 8 : mid + 17}" font-size="12" text-anchor="${c.anchor ?? 'middle'}" fill="${c.set ? '#7a5a00' : '#1b1b1b'}"><tspan font-weight="700">${c.t}</tspan> ${text(c.label)}</text>`);
  });
  return `<svg width="996" height="44" viewBox="0 0 996 44" xmlns="http://www.w3.org/2000/svg" font-family="Arial, Helvetica, sans-serif">${bits.join('')}</svg>`;
}

// Briefs fill two columns; the row height stretches so the columns reach the foot of the page.
const perColumn = Math.ceil(day.BRIEFS.length / 2);
const rowHeight = Math.min(21, Math.floor((326 / perColumn) * 10) / 10);
const briefRow = (s) => `<li>${disc(s, 14)}<b>${text(s.place)}:</b> ${text(s.text)}</li>`;

const legend = HOW_SURE.map(([word, bg, fg, meaning]) => `<span class="lg"><b style="background:${bg};color:${fg}">${word}</b> ${meaning}</span>`).join(' ');
const regionKey = [...REGION_INK].map(([r, c]) => `<span class="rk"><i style="background:${c}"></i>${REGION_NAME[r]} ${stories.filter((s) => s.region === r).length}</span>`).join(' ');

const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1024px;height:1024px;overflow:hidden;background:#f6f1e6;color:#1b1b1b;font-family:Arial,Helvetica,sans-serif}
.sheet{position:relative;width:1024px;height:1024px;padding:7px 14px 0}
.masthead{display:flex;justify-content:space-between;height:15px;font-size:11.5px;font-weight:700;letter-spacing:1.1px}
.masthead .red{color:#a1281c}
h1{height:77px;font:700 80px/72px Cambria,Georgia,'Times New Roman',serif;letter-spacing:-1.6px;text-align:center;white-space:nowrap;border-bottom:3px solid #1b1b1b}
.strip{height:46px;margin-bottom:6px;border-bottom:1px solid #1b1b1b}
.row3{display:grid;grid-template-columns:repeat(3,326px);gap:9px;height:205px}
.row6{display:grid;grid-template-columns:repeat(6,161px);gap:6px;height:137px;margin-top:6px}
article{position:relative;overflow:hidden;background:#fffdf8;border-top:3px solid}
.pic{display:block}
.kick{padding:4px 6px 0;font-size:11px;letter-spacing:.4px;color:#555;white-space:nowrap;overflow:hidden}
.card .kick{padding:4px 5px 0;font-size:10.5px;letter-spacing:.1px}
.disc{display:inline-block;margin-right:4px;border-radius:50%;color:#fff;font-style:normal;font-weight:700;text-align:center;vertical-align:-2px;letter-spacing:0}
h2{padding:2px 7px 0;font:700 21.5px/23px Georgia,serif;letter-spacing:-.3px}
h3{padding:2px 6px 0;font:700 14px/15.5px Georgia,serif;letter-spacing:-.2px}
.lead p{padding:3px 7px 0;font-size:12px;line-height:14.5px;color:#2a2a2a}
.sure{position:absolute;left:6px;right:4px;bottom:4px;white-space:nowrap;overflow:hidden;font-size:11px}
.sure b,.lg b{padding:1px 4px;border-radius:2px;font-size:10.5px;letter-spacing:.5px}
.sure span{margin-left:5px;font-weight:700;color:#444;letter-spacing:.2px}
.bottom{display:grid;grid-template-columns:318px minmax(0,1fr);gap:12px;margin-top:7px;padding-top:4px;border-top:2px solid #1b1b1b}
.head{display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;letter-spacing:1.1px}
.head span{font-weight:400;color:#555;letter-spacing:.3px}
.rks{margin-top:1px;font-size:11px;line-height:13px}
.rk{margin-right:7px;white-space:nowrap}.rk i{display:inline-block;width:8px;height:8px;margin-right:3px;border-radius:50%}
.legend{margin-top:3px;font-size:11px;line-height:15px}.legend>b{margin-right:4px;font-size:11.5px;letter-spacing:1.1px}
.lg{margin-right:6px;white-space:nowrap}
.check{margin-top:4px;padding:3px 6px;border:1.5px solid #a1281c;background:#fbeeea}
.check .t{font-size:11.5px;font-weight:700;letter-spacing:1px;color:#a1281c}
.check table{width:100%;border-collapse:collapse;font-size:11.5px;line-height:13.5px}
.check td+td{text-align:right;font-weight:700;color:#a1281c;white-space:nowrap}
.check .later{margin-top:1px;font-size:11.5px;line-height:13.5px}
.cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 14px}
.cols ul{list-style:none}
.cols li{height:${rowHeight}px;line-height:${rowHeight}px;font-size:12.4px;white-space:nowrap;overflow:hidden;border-bottom:1px dotted #b9b2a3}
.foot{position:absolute;left:14px;right:14px;bottom:4px;display:flex;justify-content:space-between;padding-top:2px;border-top:1px solid #1b1b1b;font-size:11px;white-space:nowrap}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${text(day.DAY.long)}</title><style>${css}</style></head>
<body><div class="sheet">
<div class="masthead"><span class="red">THE WORLD'S NEWS OF ONE DAY, ON ONE PAGE</span><span>${tally}</span></div>
<h1>${text(day.DAY.long)}</h1>
<div class="strip">${clockStrip()}</div>
<section class="row3">${day.LEADS.map(leadBox).join('')}</section>
<section class="row6">${day.CARDS.slice(0, 6).map(cardBox).join('')}</section>
<section class="row6">${day.CARDS.slice(6, 12).map(cardBox).join('')}</section>
<section class="bottom">
<div>
<div class="head">WHERE IT HAPPENED <span>numbers match the stories</span></div>
${drawWorld(318, 132, stories, ink)}
<div class="rks">${regionKey}</div>
<div class="legend"><b>HOW SURE</b>${legend}</div>
<div class="check"><div class="t">DATE CHECK · OTHER DAYS' NEWS, LEFT OUT</div>
<table>${day.OLDER.map((o) => `<tr><td>${text(o.what)}</td><td>${text(o.when)}</td></tr>`).join('')}</table>
<div class="later"><b>Later today:</b> ${text(day.LATER)}</div></div>
</div>
<div>
<div class="head">ALSO ON ${text(day.DAY.short.toUpperCase())} <span>numbered on from the pictures above</span></div>
<div class="cols"><ul>${day.BRIEFS.slice(0, perColumn).map(briefRow).join('')}</ul><ul>${day.BRIEFS.slice(perColumn).map(briefRow).join('')}</ul></div>
</div>
</section>
<div class="foot"><b>Every story here happened, or was first reported, on ${text(day.DAY.long)}.</b><span>Sources: ${text(day.SOURCES)}. Original drawings.</span></div>
</div></body></html>
`;

writeFileSync(new URL('./front-page.html', import.meta.url), html);
console.log(tally);
