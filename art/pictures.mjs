// Small flat pictures for the front page, built from plain SVG shapes (no photos, logos or likenesses).
// Every picture is a function of (width, height, options) and returns an SVG fragment; the page wraps it.
// Sizes are worked out as fractions of the box, so the same picture serves a lead (wide) and a card (small).

const round = (v) => Math.round(v * 10) / 10;
const clean = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// el('rect', { x: 1, fill: 'red' }) -> <rect x="1" fill="red"/>; numbers are rounded to one decimal.
function el(name, attrs, inner) {
  const list = Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k.replace(/_/g, '-')}="${typeof v === 'number' ? round(v) : v}"`)
    .join(' ');
  return inner === undefined ? `<${name} ${list}/>` : `<${name} ${list}>${inner}</${name}>`;
}

const SANS = 'Arial, Helvetica, sans-serif';

// A dark or coloured label box with white capitals: says in words what the picture shows.
function label(w, h, words, corner = 'top-left', bg = '#1b1b1b') {
  if (!words) return '';
  const fs = w > 200 ? 11.5 : 10.5;
  const bw = words.length * fs * 0.66 + 10;
  const bh = fs + 5;
  const left = corner.endsWith('left') ? 3 : corner.endsWith('right') ? w - bw - 3 : (w - bw) / 2;
  const top = corner.startsWith('top') ? 3 : h - bh - 3;
  return el('rect', { x: left, y: top, width: bw, height: bh, rx: 2, fill: bg }) +
    el('text', { x: left + bw / 2, y: top + fs + 0.5, font_family: SANS, font_size: fs, font_weight: 700, letter_spacing: 0.6, fill: '#fff', text_anchor: 'middle' }, clean(words));
}

// A large number with a caption under it, kept in the lower part of the box.
function bigNumber(w, h, cx, big, caption, colour = '#1b1b1b') {
  const fs = h * (String(big).length > 5 ? 0.38 : 0.44);
  const base = caption ? h * 0.7 : h * 0.8;
  let out = el('text', { x: cx, y: base, font_family: SANS, font_size: fs, font_weight: 900, fill: colour, text_anchor: 'middle' }, clean(big));
  if (caption) out += el('text', { x: cx, y: base + (h > 60 ? 15 : 11.5), font_family: SANS, font_size: h > 60 ? 11.5 : 10.5, font_weight: 700, letter_spacing: 0.5, fill: colour, text_anchor: 'middle' }, clean(caption));
  return out;
}

// A stick-free figure: round head over a rounded body. Used for crowds and delegates.
function figure(x, feet, size, colour) {
  return el('circle', { cx: x, cy: feet - size * 1.5, r: size * 0.4, fill: colour }) +
    el('rect', { x: x - size * 0.4, y: feet - size * 1.06, width: size * 0.8, height: size * 1.06, rx: size * 0.28, fill: colour });
}

// Horizontal or vertical colour bands with a thin outline.
function banner(x, y, bw, bh, colours, vertical = false) {
  const step = (vertical ? bw : bh) / colours.length;
  const bands = colours.map((c, i) => vertical
    ? el('rect', { x: x + step * i, y, width: step, height: bh, fill: c })
    : el('rect', { x, y: y + step * i, width: bw, height: step, fill: c })).join('');
  return bands + el('rect', { x, y, width: bw, height: bh, fill: 'none', stroke: '#1b1b1b', stroke_width: 0.6 });
}

function star(cx, cy, size, colour) {
  const pts = [];
  for (let k = 0; k < 14; k++) {
    const angle = (k / 14) * Math.PI * 2;
    const reach = k % 2 ? size * 0.42 : size;
    pts.push(`${round(cx + Math.cos(angle) * reach)},${round(cy + Math.sin(angle) * reach)}`);
  }
  return el('polygon', { points: pts.join(' '), fill: colour, stroke: '#d9531e', stroke_width: 1 });
}

function sea(w, h, top, colour = '#2f7fb5') {
  let crest = `M0 ${round(top + 5)}`;
  for (let k = 0; k < 8; k++) crest += ` q ${round(w / 16)} -4 ${round(w / 8)} 0`;
  return el('rect', { x: 0, y: top, width: w, height: h - top, fill: colour }) +
    el('path', { d: crest, fill: 'none', stroke: '#fff', stroke_opacity: 0.5, stroke_width: 1.2 });
}

export const PICTURES = {
  // A round summit emblem, rows of delegates and, when the talks ran long, a clock.
  summit(w, h, o) {
    let out = el('rect', { width: w, height: h, fill: o.bg ?? '#dff0e4' });
    out += el('circle', { cx: w * 0.2, cy: h * 0.48, r: h * 0.32, fill: '#3d8fc4', stroke: '#1b1b1b', stroke_width: 0.8 });
    out += el('ellipse', { cx: w * 0.19, cy: h * 0.42, rx: h * 0.13, ry: h * 0.09, fill: '#4fae5a' });
    out += el('ellipse', { cx: w * 0.23, cy: h * 0.58, rx: h * 0.08, ry: h * 0.1, fill: '#4fae5a' });
    const seats = w > 200 ? 9 : 5;
    for (let k = 0; k < seats; k++) out += figure(w * 0.42 + k * (w * 0.5 / seats), h * 0.94, h * 0.19, k % 3 ? '#1b1b1b' : '#56565c');
    if (o.clock) {
      const cx = w * 0.86, cy = h * 0.32, rad = h * 0.2;
      out += el('circle', { cx, cy, r: rad, fill: '#fff', stroke: '#b3261e', stroke_width: 2 });
      out += el('path', { d: `M${round(cx)} ${round(cy)} V ${round(cy - rad * 0.72)} M${round(cx)} ${round(cy)} L ${round(cx + rad * 0.5)} ${round(cy + rad * 0.3)}`, stroke: '#1b1b1b', stroke_width: 1.6, stroke_linecap: 'round' });
    }
    return out + label(w, h, o.label, 'top-centre', '#17602b') + label(w, h, o.label2, 'bottom-right', '#b3261e');
  },

  // A large figure on a plain ground, for a story that is a number.
  bigfigure(w, h, o) {
    return el('rect', { width: w, height: h, fill: o.bg ?? '#eef1f6' }) +
      bigNumber(w, h, w * 0.5, o.big, o.small, o.ink ?? '#1b1b1b') + label(w, h, o.label, 'top-left', o.tag ?? '#1b1b1b');
  },

  // A columned government building under a dome, with the country's colours on the mast.
  building(w, h, o) {
    const cx = w * (o.x ?? 0.28);
    let out = el('rect', { width: w, height: h, fill: o.bg ?? '#e8eef5' });
    out += el('rect', { x: cx - h * 0.6, y: h * 0.56, width: h * 1.2, height: h * 0.44, fill: '#f4f1ea', stroke: '#8a8f96', stroke_width: 0.8 });
    out += el('path', { d: `M${round(cx - h * 0.25)} ${round(h * 0.56)} a ${round(h * 0.25)} ${round(h * 0.3)} 0 0 1 ${round(h * 0.5)} 0z`, fill: '#dcd6c8', stroke: '#8a8f96', stroke_width: 0.8 });
    out += el('line', { x1: cx, y1: h * 0.26, x2: cx, y2: h * 0.07, stroke: '#1b1b1b', stroke_width: 1.2 });
    if (o.colours) out += banner(cx, h * 0.07, h * 0.3, h * 0.17, o.colours, o.vertical);
    for (let k = 0; k < 6; k++) out += el('rect', { x: cx - h * 0.52 + k * h * 0.2, y: h * 0.64, width: 3, height: h * 0.36, fill: '#b9b3a4' });
    if (o.big) out += bigNumber(w, h, w * 0.72, o.big, o.small, o.ink ?? '#1b1b1b');
    return out + label(w, h, o.label, 'top-right', o.tag ?? '#1b1b1b') + label(w, h, o.label2, 'bottom-right', '#b3261e');
  },

  // Sport: a ball, a bat, a car or a racket shape, and the score or the stake.
  sport(w, h, o) {
    let out = el('rect', { width: w, height: h, fill: o.bg ?? '#2f8f4e' });
    const x = w * 0.2, y = h * 0.5;
    switch (o.kind) {
      case 'car':
        out += el('path', { d: `M${round(x - h * 0.5)} ${round(h * 0.66)} h ${round(h)} l ${round(-h * 0.12)} ${round(-h * 0.16)} h ${round(-h * 0.3)} l ${round(-h * 0.1)} ${round(-h * 0.12)} h ${round(-h * 0.2)} l ${round(-h * 0.1)} ${round(h * 0.14)}z`, fill: o.body ?? '#d33' });
        out += el('circle', { cx: x - h * 0.28, cy: h * 0.7, r: h * 0.1, fill: '#111' }) + el('circle', { cx: x + h * 0.3, cy: h * 0.7, r: h * 0.1, fill: '#111' });
        break;
      case 'bike':
        out += el('circle', { cx: x - h * 0.3, cy: h * 0.68, r: h * 0.15, fill: 'none', stroke: '#111', stroke_width: 3 });
        out += el('circle', { cx: x + h * 0.3, cy: h * 0.68, r: h * 0.15, fill: 'none', stroke: '#111', stroke_width: 3 });
        out += el('path', { d: `M${round(x - h * 0.3)} ${round(h * 0.68)} L ${round(x)} ${round(h * 0.45)} L ${round(x + h * 0.3)} ${round(h * 0.68)} M${round(x - h * 0.1)} ${round(h * 0.45)} h ${round(h * 0.3)}`, stroke: '#f1c40f', stroke_width: 3, fill: 'none' });
        break;
      case 'cricket':
        out += el('rect', { x: x - 4, y: h * 0.12, width: 9, height: h * 0.55, rx: 3, fill: '#e2c48a', stroke: '#6b4a2a', stroke_width: 0.8, transform: `rotate(24 ${round(x)} ${round(y)})` });
        out += el('circle', { cx: x + h * 0.36, cy: h * 0.72, r: h * 0.11, fill: '#b3261e' });
        break;
      case 'tennis':
        out += el('circle', { cx: x, cy: y, r: h * 0.26, fill: '#d7e84a' });
        out += el('path', { d: `M${round(x - h * 0.2)} ${round(y - h * 0.16)} q ${round(h * 0.2)} ${round(h * 0.16)} 0 ${round(h * 0.34)}`, fill: 'none', stroke: '#fff', stroke_width: 1.6 });
        break;
      case 'oval':
        out += el('ellipse', { cx: x, cy: y, rx: h * 0.34, ry: h * 0.21, fill: '#8a4f22', stroke: '#fff', stroke_width: 1.2, transform: `rotate(-24 ${round(x)} ${round(y)})` });
        out += el('path', { d: `M${round(x - h * 0.12)} ${round(y)} h ${round(h * 0.24)}`, stroke: '#fff', stroke_width: 1.4 });
        break;
      default:
        out += el('circle', { cx: x, cy: y, r: h * 0.27, fill: '#fff', stroke: '#1b1b1b', stroke_width: 1 });
        out += el('circle', { cx: x, cy: y, r: h * 0.09, fill: '#1b1b1b' });
    }
    if (o.big) out += bigNumber(w, h, w * 0.66, o.big, o.small, '#fff');
    return out + label(w, h, o.label, 'top-left');
  },

  // A vessel on the water: submarine or freighter.
  vessel(w, h, o) {
    const line = h * 0.62;
    let out = el('rect', { width: w, height: h, fill: o.sky ?? '#cfe6f2' }) + sea(w, h, line, o.water);
    const x = w * (o.x ?? 0.3), len = h * 1.6;
    if (o.sub) {
      out += el('ellipse', { cx: x, cy: line + 2, rx: len / 2, ry: h * 0.1, fill: '#2a2f38' });
      out += el('rect', { x: x - h * 0.1, y: line - h * 0.2, width: h * 0.22, height: h * 0.16, rx: 2, fill: '#2a2f38' });
    } else {
      out += el('polygon', { points: `${round(x - len / 2)},${round(line - h * 0.15)} ${round(x + len / 2)},${round(line - h * 0.15)} ${round(x + len / 2 - 8)},${round(line + 3)} ${round(x - len / 2 + 5)},${round(line + 3)}`, fill: '#7a2a22' });
    }
    return out + label(w, h, o.label, 'top-right') + label(w, h, o.label2, 'bottom-right', '#b3261e');
  },

  // Bad weather: cloud, lightning or snow, roofs below.
  weather(w, h, o) {
    let out = el('rect', { width: w, height: h, fill: '#55606e' });
    out += el('ellipse', { cx: w * 0.3, cy: h * 0.2, rx: w * 0.2, ry: h * 0.2, fill: '#2f3742' });
    out += el('ellipse', { cx: w * 0.52, cy: h * 0.16, rx: w * 0.18, ry: h * 0.18, fill: '#3a4350' });
    for (let k = 0; k < 20; k++) {
      const fx = (k * 41) % w, fy = h * 0.42 + (k % 4) * h * 0.1;
      out += o.snow ? el('circle', { cx: fx, cy: fy, r: 1.4, fill: '#fff' }) : el('line', { x1: fx, y1: fy, x2: fx - 3, y2: fy + 7, stroke: '#bcd3e6', stroke_width: 1 });
    }
    for (let k = 0; k < 4; k++) out += el('polygon', { points: `${round(w * (0.55 + k * 0.11))},${h} ${round(w * (0.6 + k * 0.11))},${round(h * 0.68)} ${round(w * (0.65 + k * 0.11))},${h}`, fill: k % 2 ? '#e0703a' : '#f1ede2' });
    return out + label(w, h, o.label, 'top-right') + label(w, h, o.label2, 'bottom-left', '#b3261e');
  },

  // Two flags joined by a handshake bar.
  twoflags(w, h, o) {
    const fw = h * 0.72, fh = h * 0.46, top = h * 0.18;
    let out = el('rect', { width: w, height: h, fill: o.bg ?? '#eef1f6' });
    out += banner(w * 0.5 - fw - h * 0.3, top, fw, fh, o.a, o.av);
    out += banner(w * 0.5 + h * 0.3, top, fw, fh, o.b, o.bv);
    out += el('line', { x1: w * 0.5 - h * 0.22, y1: top + fh / 2, x2: w * 0.5 + h * 0.22, y2: top + fh / 2, stroke: '#1b1b1b', stroke_width: 2.4, stroke_linecap: 'round' });
    out += el('circle', { cx: w * 0.5, cy: top + fh / 2, r: 3.4, fill: '#1b1b1b' });
    return out + label(w, h, o.label, 'bottom-centre');
  },

  // A pin on a coastline, with rings for a quake and the magnitude beside it.
  pin(w, h, o) {
    let out = el('rect', { width: w, height: h, fill: '#cfe6f2' });
    out += el('path', { d: `M0 ${round(h * 0.22)} Q ${round(w * 0.3)} ${round(h * 0.06)} ${round(w * 0.55)} ${round(h * 0.3)} T ${w} ${round(h * 0.36)} V ${h} H 0z`, fill: o.land ?? '#e6dcc0' });
    const px = w * (o.x ?? 0.26), py = h * 0.64;
    if (o.rings) for (let k = 1; k <= 3; k++) out += el('circle', { cx: px, cy: py - 6, r: k * h * 0.12, fill: 'none', stroke: '#b3261e', stroke_opacity: 0.8 - k * 0.2, stroke_width: 1.2 });
    out += el('path', { d: `M${round(px)} ${round(py)} l -6 -12 a 6.5 6.5 0 1 1 12 0z`, fill: '#b3261e', stroke: '#fff', stroke_width: 0.8 });
    if (o.big) out += bigNumber(w, h, w * 0.7, o.big, o.small);
    return out + label(w, h, o.label, 'top-left') + label(w, h, o.label2, 'bottom-right', '#b3261e');
  },

  // A pylon with a broken line: power cuts.
  power(w, h, o) {
    let out = el('rect', { width: w, height: h, fill: o.bg ?? '#262b36' });
    const px = w * 0.16;
    out += el('path', { d: `M${round(px - h * 0.22)} ${h} L ${round(px)} ${round(h * 0.12)} L ${round(px + h * 0.22)} ${h} M${round(px - h * 0.3)} ${round(h * 0.3)} h ${round(h * 0.6)} M${round(px - h * 0.22)} ${round(h * 0.5)} h ${round(h * 0.44)}`, stroke: '#c9ced8', stroke_width: 2, fill: 'none' });
    out += el('path', { d: `M${round(px + h * 0.3)} ${round(h * 0.3)} q ${round(w * 0.08)} ${round(h * 0.12)} ${round(w * 0.16)} 0`, stroke: '#c9ced8', stroke_width: 1.4, fill: 'none' });
    out += el('path', { d: `M${round(px + h * 0.3 + w * 0.2)} ${round(h * 0.22)} l -6 10 h 7 l -6 12`, stroke: '#ffd24a', stroke_width: 2.2, fill: 'none' });
    for (let k = 0; k < 5; k++) out += el('rect', { x: w * (0.06 + k * 0.05), y: h * 0.78, width: w * 0.035, height: h * 0.16, fill: k % 2 ? '#3a4050' : '#ffd24a', opacity: k % 2 ? 1 : 0.35 });
    if (o.big) out += bigNumber(w, h, w * 0.68, o.big, o.small, o.ink ?? '#ffd24a');
    return out + label(w, h, o.label, 'top-right', '#b3261e');
  },

  // A wreath and a candle: a death announced.
  candle(w, h, o) {
    const cx = w * 0.22;
    let out = el('rect', { width: w, height: h, fill: o.bg ?? '#e9e6df' });
    out += el('rect', { x: cx - h * 0.08, y: h * 0.42, width: h * 0.16, height: h * 0.5, fill: '#f8f4ea', stroke: '#8a8f96', stroke_width: 0.8 });
    out += el('path', { d: `M${round(cx)} ${round(h * 0.4)} q ${round(-h * 0.08)} ${round(-h * 0.12)} 0 ${round(-h * 0.26)} q ${round(h * 0.08)} ${round(h * 0.14)} 0 ${round(h * 0.26)}z`, fill: '#f0a030' });
    if (o.big) out += bigNumber(w, h, w * 0.66, o.big, o.small);
    return out + label(w, h, o.label, 'top-right');
  },
};
