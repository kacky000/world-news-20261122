// The drawings. Each scene is a function (w, h, options) that returns SVG for a w-by-h picture.
// A lead picture is 326x82 and a card picture 161x48, so every scene is drawn in proportions of w and h.
// All of it is original flat artwork made of plain shapes: no photographs, logos or likenesses.

const F = 'font-family="Arial, Helvetica, sans-serif"';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r = (n) => Number(n.toFixed(1));

// A name plate: the caption that says what the picture is, so the story reads from the picture alone.
function plate(w, h, text, { at = 'bl', fill = '#1b1b1b', ink = '#fff' } = {}) {
  if (!text) return '';
  const size = w > 200 ? 11.5 : 10.5;
  const tw = text.length * size * 0.66 + 10, th = size + 5;
  const x = at.includes('r') ? w - tw - 3 : at.includes('c') ? (w - tw) / 2 : 3;
  const y = at.includes('t') ? 3 : h - th - 3;
  return `<rect x="${r(x)}" y="${r(y)}" width="${r(tw)}" height="${r(th)}" rx="2" fill="${fill}"/>` +
    `<text x="${r(x + tw / 2)}" y="${r(y + size + 0.5)}" ${F} font-size="${size}" font-weight="700" letter-spacing="0.6" fill="${ink}" text-anchor="middle">${esc(text)}</text>`;
}

// A big figure with a short caption, for stories that are a number.
// It sits in the lower part of the picture, clear of a name plate along the top edge.
function figure(w, h, x, big, small, ink = '#1b1b1b') {
  const size = h * (big.length > 5 ? 0.38 : 0.44);
  const y = small ? h * 0.7 : h * 0.8;
  // Arial, not Georgia: Georgia's figures hang below the line and would run into the caption.
  return `<text x="${r(x)}" y="${r(y)}" ${F} font-size="${r(size)}" font-weight="900" letter-spacing="-0.5" fill="${ink}" text-anchor="middle">${esc(big)}</text>` +
    (small ? `<text x="${r(x)}" y="${r(y + (h > 60 ? 15 : 11.5))}" ${F} font-size="${h > 60 ? 11.5 : 10.5}" font-weight="700" letter-spacing="0.5" fill="${ink}" text-anchor="middle">${esc(small)}</text>` : '');
}

// A flag made of plain stripes: dir 'h' stacks them, 'v' sets them side by side.
function flag(x, y, fw, fh, stripes, dir = 'h') {
  let out = '';
  stripes.forEach((c, i) => {
    out += dir === 'h'
      ? `<rect x="${r(x)}" y="${r(y + (fh / stripes.length) * i)}" width="${r(fw)}" height="${r(fh / stripes.length)}" fill="${c}"/>`
      : `<rect x="${r(x + (fw / stripes.length) * i)}" y="${r(y)}" width="${r(fw / stripes.length)}" height="${r(fh)}" fill="${c}"/>`;
  });
  return out + `<rect x="${r(x)}" y="${r(y)}" width="${r(fw)}" height="${r(fh)}" fill="none" stroke="#1b1b1b" stroke-width="0.6"/>`;
}

function burst(x, y, size, fill = '#ffd24a') {
  let pts = '';
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16, d = i % 2 ? size * 0.45 : size;
    pts += `${r(x + Math.cos(a) * d)},${r(y + Math.sin(a) * d)} `;
  }
  return `<polygon points="${pts.trim()}" fill="${fill}" stroke="#e2571c" stroke-width="1"/>`;
}

function skyline(w, h, base, fill, tall) {
  let out = '', x = 0, i = 0;
  const heights = [0.22, 0.36, 0.18, 0.3, 0.42, 0.24, 0.34, 0.2, 0.38, 0.26, 0.31, 0.19];
  while (x < w) {
    const bw = w / 13, bh = h * heights[i % heights.length];
    out += `<rect x="${r(x)}" y="${r(base - bh)}" width="${r(bw - 1.5)}" height="${r(bh)}" fill="${fill}"/>`;
    x += bw; i++;
  }
  if (tall) out += `<polygon points="${r(w * tall - 5)},${r(base)} ${r(w * tall - 3)},${r(h * 0.16)} ${r(w * tall + 3)},${r(h * 0.16)} ${r(w * tall + 5)},${r(base)}" fill="${fill}"/>`;
  return out;
}

function waves(w, y, h, fill = '#2f7fb5') {
  return `<rect x="0" y="${r(y)}" width="${w}" height="${r(h - y)}" fill="${fill}"/>` +
    `<path d="M0 ${r(y + 5)} q ${r(w / 16)} -4 ${r(w / 8)} 0 t ${r(w / 8)} 0 t ${r(w / 8)} 0 t ${r(w / 8)} 0 t ${r(w / 8)} 0 t ${r(w / 8)} 0 t ${r(w / 8)} 0 t ${r(w / 8)} 0" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.2"/>`;
}

function person(x, y, s, fill = '#1b1b1b') {
  return `<circle cx="${r(x)}" cy="${r(y - s * 1.55)}" r="${r(s * 0.42)}" fill="${fill}"/><rect x="${r(x - s * 0.42)}" y="${r(y - s * 1.1)}" width="${r(s * 0.84)}" height="${r(s * 1.1)}" rx="${r(s * 0.3)}" fill="${fill}"/>`;
}

export const SCENES = {
  // Missiles or drones arcing in over a night city and bursting against interceptors.
  intercept(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="#17233f"/>`;
    out += skyline(w, h, h, '#0b1226', o.tower ?? 0.3);
    const hits = o.hits ?? 3;
    for (let i = 0; i < hits; i++) {
      const x = w * (0.48 + i * 0.17), y = h * (0.3 + (i % 2) * 0.14);
      out += `<path d="M${r(w)} ${r(h * 0.05 + i * 5)} Q ${r(x + w * 0.12)} ${r(y - h * 0.2)} ${r(x)} ${r(y)}" fill="none" stroke="#ff8a5c" stroke-width="1.4" stroke-dasharray="4 3"/>`;
      out += `<path d="M${r(x - w * 0.1)} ${h} L ${r(x)} ${r(y)}" fill="none" stroke="#9fd0ff" stroke-width="1"/>`;
      out += burst(x, y, h * 0.13);
    }
    return out + plate(w, h, o.label, { at: 'tl', fill: '#b3261e' }) + plate(w, h, o.label2, { at: 'br' });
  },

  // A conference hall: a round emblem, rows of delegates, a clock if the talks ran over.
  talks(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#dff0e4'}"/>`;
    out += `<circle cx="${r(w * 0.2)}" cy="${r(h * 0.46)}" r="${r(h * 0.32)}" fill="#3d8fc4" stroke="#1b1b1b" stroke-width="0.8"/>`;
    out += `<path d="M${r(w * 0.2 - h * 0.2)} ${r(h * 0.4)} q ${r(h * 0.1)} ${r(-h * 0.2)} ${r(h * 0.24)} ${r(-h * 0.06)} q ${r(h * 0.1)} ${r(h * 0.12)} ${r(-h * 0.02)} ${r(h * 0.22)} q ${r(-h * 0.12)} ${r(h * 0.1)} ${r(-h * 0.22)} ${r(-h * 0.16)}z" fill="#4fae5a"/>`;
    const n = w > 200 ? 9 : 5;
    for (let i = 0; i < n; i++) out += person(w * 0.42 + i * (w * 0.5 / n), h * 0.92, h * 0.19, i % 3 === 0 ? '#555' : '#1b1b1b');
    if (o.clock) {
      const cx = w * 0.86, cy = h * 0.3, cr = h * 0.2;
      out += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(cr)}" fill="#fff" stroke="#b3261e" stroke-width="2"/><path d="M${r(cx)} ${r(cy)} V ${r(cy - cr * 0.7)} M${r(cx)} ${r(cy)} L ${r(cx + cr * 0.55)} ${r(cy + cr * 0.25)}" stroke="#1b1b1b" stroke-width="1.6" stroke-linecap="round"/>`;
    }
    return out + plate(w, h, o.label, { at: 'tc', fill: o.plate ?? '#17602b' }) + plate(w, h, o.label2, { at: 'br', fill: '#b3261e' });
  },

  // Two flags side by side with a link or a break between them.
  flags(w, h, o) {
    const fw = h * 0.72, fh = h * 0.46, y = h * 0.2;
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#eef1f6'}"/>`;
    out += flag(w * 0.5 - fw - h * 0.3, y, fw, fh, o.a, o.adir);
    out += flag(w * 0.5 + h * 0.3, y, fw, fh, o.b, o.bdir);
    out += o.rift
      ? `<path d="M${r(w * 0.5 + 3)} ${r(y - 4)} l -6 ${r(fh * 0.4)} l 7 2 l -6 ${r(fh * 0.6)}" fill="none" stroke="#b3261e" stroke-width="2.2"/>`
      : `<path d="M${r(w * 0.5 - h * 0.22)} ${r(y + fh / 2)} H ${r(w * 0.5 + h * 0.22)}" stroke="#1b1b1b" stroke-width="2.4" stroke-linecap="round"/><circle cx="${r(w * 0.5)}" cy="${r(y + fh / 2)}" r="3.4" fill="#1b1b1b"/>`;
    return out + plate(w, h, o.label, { at: 'bc', fill: o.plate ?? '#1b1b1b' });
  },

  // A courthouse front with scales, or a figure, beside it.
  court(w, h, o) {
    const cx = w * (o.x ?? 0.3), bw = h * 1.2, top = h * 0.3, base = h * 0.9;
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#efe6d6'}"/>`;
    out += `<polygon points="${r(cx - bw / 2 - 4)},${r(top)} ${r(cx)},${r(h * 0.08)} ${r(cx + bw / 2 + 4)},${r(top)}" fill="#8f8572"/>`;
    out += `<rect x="${r(cx - bw / 2)}" y="${r(top)}" width="${r(bw)}" height="${r(h * 0.07)}" fill="#6f6757"/><rect x="${r(cx - bw / 2 - 3)}" y="${r(base - h * 0.07)}" width="${r(bw + 6)}" height="${r(h * 0.07)}" fill="#6f6757"/>`;
    for (let i = 0; i < 5; i++) out += `<rect x="${r(cx - bw / 2 + 3 + i * (bw - 12) / 4)}" y="${r(top + h * 0.07)}" width="6" height="${r(base - top - h * 0.14)}" fill="#b9af9a"/>`;
    if (o.big) out += figure(w, h, w * 0.74, o.big, o.small, '#a1281c');
    else {
      const sx = cx + bw * 0.5 + w * 0.2, sy = h * 0.26;
      out += `<path d="M${r(sx)} ${r(sy)} V ${r(h * 0.86)} M${r(sx - h * 0.3)} ${r(sy + 4)} H ${r(sx + h * 0.3)}" stroke="#1b1b1b" stroke-width="2"/>`;
      out += `<path d="M${r(sx - h * 0.44)} ${r(h * 0.56)} h ${r(h * 0.28)} l ${r(-h * 0.14)} ${r(-h * 0.26)}z M${r(sx + h * 0.16)} ${r(h * 0.66)} h ${r(h * 0.28)} l ${r(-h * 0.14)} ${r(-h * 0.36)}z" fill="#c9a227" stroke="#1b1b1b" stroke-width="0.8"/>`;
    }
    return out + plate(w, h, o.label, { at: 'tr' });
  },

  // A chart line that rises or falls, with the figure beside it.
  chart(w, h, o) {
    const up = o.up, ink = up ? '#17602b' : '#a1281c';
    let out = `<rect width="${w}" height="${h}" fill="${up ? '#e6f3e6' : '#fbe9e4'}"/>`;
    const pts = up ? [0.82, 0.7, 0.74, 0.55, 0.6, 0.38, 0.42, 0.2] : [0.2, 0.3, 0.26, 0.45, 0.4, 0.6, 0.58, 0.82];
    const x0 = w * 0.06, span = w * 0.42;
    out += `<polyline points="${pts.map((p, i) => `${r(x0 + (span / 7) * i)},${r(h * p)}`).join(' ')}" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/>`;
    out += `<polygon points="${r(x0 + span + 7)},${r(h * pts[7])} ${r(x0 + span - 3)},${r(h * pts[7] - (up ? -1 : 9))} ${r(x0 + span - 3)},${r(h * pts[7] + (up ? 9 : -1))}" fill="${ink}"/>`;
    out += figure(w, h, w * 0.75, o.big, o.small, ink);
    return out + plate(w, h, o.label, { at: 'tl', fill: ink });
  },

  // A big figure on a tinted ground: for a sum of money, a count, a score.
  number(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#eef1f6'}"/>`;
    out += figure(w, h, w * 0.5, o.big, o.small, o.ink ?? '#1b1b1b');
    return out + plate(w, h, o.label, { at: 'tl', fill: o.plate ?? '#1b1b1b' });
  },

  // A ship at sea; with smoke if it was hit, people on deck if it carried migrants.
  ship(w, h, o) {
    const sea = h * 0.68, x = w * (o.x ?? 0.3), len = h * 1.5;
    let out = `<rect width="${w}" height="${h}" fill="${o.sky ?? '#cfe6f2'}"/>` + waves(w, sea, h);
    out += `<polygon points="${r(x - len / 2)},${r(sea - h * 0.16)} ${r(x + len / 2)},${r(sea - h * 0.16)} ${r(x + len / 2 - 8)},${r(sea + 3)} ${r(x - len / 2 + 5)},${r(sea + 3)}" fill="${o.hull ?? '#7a2a22'}"/>`;
    out += `<rect x="${r(x - len / 2 + 4)}" y="${r(sea - h * 0.36)}" width="${r(len * 0.2)}" height="${r(h * 0.2)}" fill="#f1ede2" stroke="#1b1b1b" stroke-width="0.6"/>`;
    if (o.smoke) out += `<path d="M${r(x + len * 0.2)} ${r(sea - h * 0.18)} q -6 ${r(-h * 0.2)} 4 ${r(-h * 0.32)} q 10 ${r(-h * 0.12)} 0 ${r(-h * 0.26)}" fill="none" stroke="#444" stroke-width="5" stroke-linecap="round" opacity="0.75"/>` + burst(x + len * 0.2, sea - h * 0.2, h * 0.12, '#ff9a3c');
    if (o.people) for (let i = 0; i < 6; i++) out += person(x - len * 0.2 + i * len * 0.11, sea - h * 0.16, h * 0.1);
    if (o.big) out += figure(w, h, w * 0.74, o.big, o.small, '#fff');
    return out + plate(w, h, o.label, { at: 'tr' }) + plate(w, h, o.label2, { at: 'br', fill: '#b3261e' });
  },

  // A rocket leaving the pad.
  rocket(w, h, o) {
    const x = w * 0.26;
    let out = `<rect width="${w}" height="${h}" fill="#101a35"/>`;
    for (let i = 0; i < 14; i++) out += `<circle cx="${r((i * 53) % w)}" cy="${r((i * 29) % (h * 0.8))}" r="0.9" fill="#fff"/>`;
    out += `<path d="M${r(x)} ${r(h * 0.1)} q 6 ${r(h * 0.18)} 5 ${r(h * 0.5)} h -10 q -1 ${r(-h * 0.32)} 5 ${r(-h * 0.5)}z" fill="#f1ede2"/>`;
    out += `<polygon points="${r(x - 5)},${r(h * 0.6)} ${r(x + 5)},${r(h * 0.6)} ${r(x)},${r(h * 0.98)}" fill="#ff9a3c"/>`;
    out += `<ellipse cx="${r(x)}" cy="${h}" rx="${r(h * 0.5)}" ry="${r(h * 0.12)}" fill="#c9c9c9" opacity="0.8"/>`;
    if (o.big) out += figure(w, h, w * 0.68, o.big, o.small, '#fff');
    return out + plate(w, h, o.label, { at: 'tr', fill: '#2456a6' });
  },

  // A storm: cloud, lightning, rain, and roofs below.
  storm(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="#55606e"/>`;
    out += `<ellipse cx="${r(w * 0.3)}" cy="${r(h * 0.2)}" rx="${r(w * 0.2)}" ry="${r(h * 0.2)}" fill="#2f3742"/><ellipse cx="${r(w * 0.52)}" cy="${r(h * 0.16)}" rx="${r(w * 0.18)}" ry="${r(h * 0.18)}" fill="#3a4350"/>`;
    out += `<polygon points="${r(w * 0.4)},${r(h * 0.28)} ${r(w * 0.32)},${r(h * 0.6)} ${r(w * 0.39)},${r(h * 0.58)} ${r(w * 0.33)},${r(h * 0.92)} ${r(w * 0.47)},${r(h * 0.5)} ${r(w * 0.41)},${r(h * 0.52)} ${r(w * 0.46)},${r(h * 0.28)}" fill="#ffd24a"/>`;
    for (let i = 0; i < 18; i++) out += `<path d="M${r((i * 37) % w)} ${r(h * 0.4 + (i % 3) * 6)} l -3 8" stroke="#bcd3e6" stroke-width="1"/>`;
    for (let i = 0; i < 4; i++) out += `<polygon points="${r(w * (0.55 + i * 0.11))},${h} ${r(w * (0.6 + i * 0.11))},${r(h * 0.66)} ${r(w * (0.65 + i * 0.11))},${h}" fill="${i % 2 ? '#e0703a' : '#f1ede2'}"/>`;
    return out + plate(w, h, o.label, { at: 'tr', fill: '#1b1b1b' }) + plate(w, h, o.label2, { at: 'bl', fill: '#b3261e' });
  },

  // A cyclone spiral over a coast.
  cyclone(w, h, o) {
    const cx = w * 0.62, cy = h * 0.5;
    let out = `<rect width="${w}" height="${h}" fill="#bfe0ee"/><polygon points="0,0 ${r(w * 0.36)},0 ${r(w * 0.28)},${r(h * 0.5)} ${r(w * 0.4)},${h} 0,${h}" fill="#e6dcc0"/>`;
    for (let i = 0; i < 3; i++) out += `<path d="M${r(cx)} ${r(cy)} m ${r(-h * (0.14 + i * 0.12))} 0 a ${r(h * (0.14 + i * 0.12))} ${r(h * (0.14 + i * 0.12))} 0 1 1 ${r(h * (0.14 + i * 0.12))} ${r(h * (0.14 + i * 0.12))}" fill="none" stroke="#3b6f93" stroke-width="2.4" stroke-linecap="round"/>`;
    out += `<circle cx="${r(cx)}" cy="${r(cy)}" r="3" fill="#b3261e"/>`;
    return out + plate(w, h, o.label, { at: 'tl' }) + plate(w, h, o.label2, { at: 'br', fill: '#b3261e' });
  },

  // A ballot box with a paper going in.
  vote(w, h, o) {
    const x = w * (o.x ?? 0.26);
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#eef1f6'}"/>`;
    out += `<rect x="${r(x - h * 0.4)}" y="${r(h * 0.42)}" width="${r(h * 0.8)}" height="${r(h * 0.5)}" fill="#2456a6"/><rect x="${r(x - h * 0.22)}" y="${r(h * 0.4)}" width="${r(h * 0.44)}" height="3" fill="#0b1226"/>`;
    out += `<rect x="${r(x - h * 0.16)}" y="${r(h * 0.1)}" width="${r(h * 0.32)}" height="${r(h * 0.34)}" fill="#fff" stroke="#1b1b1b" stroke-width="0.7" transform="rotate(8 ${r(x)} ${r(h * 0.3)})"/>`;
    if (o.big) out += figure(w, h, w * 0.7, o.big, o.small, o.ink ?? '#1b1b1b');
    return out + plate(w, h, o.label, { at: 'tr', fill: o.plate ?? '#1b1b1b' }) + plate(w, h, o.label2, { at: 'br', fill: '#b3261e' });
  },

  // A crowd with placards.
  march(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#f3e9d8'}"/>`;
    const n = w > 200 ? 12 : 7;
    for (let i = 0; i < n; i++) {
      const x = w * 0.06 + i * (w * 0.9 / n), s = h * (0.2 + (i % 3) * 0.02);
      out += person(x, h, s, i % 2 ? '#3a3a3a' : '#1b1b1b');
      if (i % 2 === 0) out += `<path d="M${r(x + s * 0.5)} ${r(h * 0.7)} V ${r(h * 0.3)}" stroke="#6b4a2a" stroke-width="1.4"/><rect x="${r(x - s * 0.3)}" y="${r(h * 0.12)}" width="${r(s * 1.7)}" height="${r(h * 0.24)}" fill="${o.sign ?? '#fff'}" stroke="#1b1b1b" stroke-width="0.7"/>`;
    }
    return out + plate(w, h, o.label, { at: 'tr', fill: o.plate ?? '#b3261e' });
  },

  // A sports result: a ball, a car or a bat, and the score.
  sport(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#2f8f4e'}"/>`;
    const x = w * 0.2, y = h * 0.5;
    if (o.kind === 'cricket') out += `<rect x="${r(x - 4)}" y="${r(h * 0.12)}" width="9" height="${r(h * 0.55)}" rx="3" fill="#e2c48a" stroke="#6b4a2a" stroke-width="0.8" transform="rotate(24 ${r(x)} ${r(y)})"/><circle cx="${r(x + h * 0.36)}" cy="${r(h * 0.72)}" r="${r(h * 0.11)}" fill="#b3261e"/>`;
    else if (o.kind === 'rugby') out += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(h * 0.34)}" ry="${r(h * 0.22)}" fill="#a8672e" stroke="#fff" stroke-width="1.2" transform="rotate(-24 ${r(x)} ${r(y)})"/>`;
    else if (o.kind === 'tennis') out += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(h * 0.26)}" fill="#d7e84a"/><path d="M${r(x - h * 0.2)} ${r(y - h * 0.16)} q ${r(h * 0.2)} ${r(h * 0.16)} 0 ${r(h * 0.34)}" fill="none" stroke="#fff" stroke-width="1.6"/>`;
    else if (o.kind === 'car') out += `<path d="M${r(x - h * 0.5)} ${r(h * 0.66)} h ${r(h * 1.0)} l ${r(-h * 0.12)} ${r(-h * 0.16)} h ${r(-h * 0.3)} l ${r(-h * 0.1)} ${r(-h * 0.12)} h ${r(-h * 0.2)} l ${r(-h * 0.1)} ${r(h * 0.14)}z" fill="#d33"/><circle cx="${r(x - h * 0.28)}" cy="${r(h * 0.7)}" r="${r(h * 0.1)}" fill="#111"/><circle cx="${r(x + h * 0.3)}" cy="${r(h * 0.7)}" r="${r(h * 0.1)}" fill="#111"/>`;
    else if (o.kind === 'golf') out += `<path d="M${r(x)} ${r(h * 0.85)} V ${r(h * 0.15)}" stroke="#fff" stroke-width="1.4"/><polygon points="${r(x)},${r(h * 0.15)} ${r(x + h * 0.3)},${r(h * 0.25)} ${r(x)},${r(h * 0.35)}" fill="#b3261e"/><circle cx="${r(x - h * 0.2)}" cy="${r(h * 0.8)}" r="${r(h * 0.07)}" fill="#fff"/>`;
    else out += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(h * 0.27)}" fill="#fff" stroke="#1b1b1b" stroke-width="1"/><polygon points="${r(x)},${r(y - h * 0.12)} ${r(x + h * 0.11)},${r(y - h * 0.03)} ${r(x + h * 0.07)},${r(y + h * 0.1)} ${r(x - h * 0.07)},${r(y + h * 0.1)} ${r(x - h * 0.11)},${r(y - h * 0.03)}" fill="#1b1b1b"/>`;
    if (o.big) out += figure(w, h, w * 0.66, o.big, o.small, '#fff');
    return out + plate(w, h, o.label, { at: 'tl', fill: '#1b1b1b' });
  },

  // A hospital front with a cross.
  hospital(w, h, o) {
    const x = w * 0.26;
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#e3eef2'}"/>`;
    out += `<rect x="${r(x - h * 0.5)}" y="${r(h * 0.26)}" width="${h}" height="${r(h * 0.74)}" fill="#fff" stroke="#8a8f96" stroke-width="0.8"/>`;
    out += `<path d="M${r(x)} ${r(h * 0.34)} v ${r(h * 0.3)} M${r(x - h * 0.15)} ${r(h * 0.49)} h ${r(h * 0.3)}" stroke="#c0271d" stroke-width="5"/>`;
    out += `<rect x="${r(x - h * 0.1)}" y="${r(h * 0.76)}" width="${r(h * 0.2)}" height="${r(h * 0.24)}" fill="#8a8f96"/>`;
    if (o.big) out += figure(w, h, w * 0.7, o.big, o.small, '#1b1b1b');
    return out + plate(w, h, o.label, { at: 'tr' });
  },

  // An aircraft over a horizon.
  plane(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="${o.sky ?? '#cfe6f2'}"/><rect y="${r(h * 0.8)}" width="${w}" height="${r(h * 0.2)}" fill="#c8bfa5"/>`;
    const x = w * 0.3, y = h * 0.44;
    out += `<path d="M${r(x - h * 0.6)} ${r(y)} q ${r(h * 0.5)} ${r(-h * 0.2)} ${r(h * 1.2)} 0 q ${r(-h * 0.6)} ${r(h * 0.16)} ${r(-h * 1.2)} 0z" fill="#f4f4f4" stroke="#1b1b1b" stroke-width="0.8"/>`;
    out += `<polygon points="${r(x - h * 0.1)},${r(y)} ${r(x - h * 0.34)},${r(y + h * 0.3)} ${r(x - h * 0.16)},${r(y + h * 0.3)} ${r(x + h * 0.2)},${r(y)}" fill="#9aa3ad"/><polygon points="${r(x - h * 0.56)},${r(y - 1)} ${r(x - h * 0.7)},${r(y - h * 0.26)} ${r(x - h * 0.5)},${r(y - h * 0.26)} ${r(x - h * 0.36)},${r(y - 2)}" fill="${o.tail ?? '#2456a6'}"/>`;
    if (o.big) out += figure(w, h, w * 0.74, o.big, o.small, '#1b1b1b');
    return out + plate(w, h, o.label, { at: 'tr' });
  },

  // A place on a small map: a coast, a pin and its name.
  place(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="#cfe6f2"/><path d="M0 ${r(h * 0.2)} Q ${r(w * 0.3)} ${r(h * 0.05)} ${r(w * 0.55)} ${r(h * 0.3)} T ${w} ${r(h * 0.35)} V ${h} H 0z" fill="${o.land ?? '#e6dcc0'}"/>`;
    const x = w * (o.x ?? 0.3), y = h * 0.62;
    if (o.rings) for (let i = 1; i <= 3; i++) out += `<circle cx="${r(x)}" cy="${r(y - 6)}" r="${r(i * h * 0.12)}" fill="none" stroke="#b3261e" stroke-opacity="${r(0.8 - i * 0.2)}" stroke-width="1.2"/>`;
    out += `<path d="M${r(x)} ${r(y)} l -6 -12 a 6.5 6.5 0 1 1 12 0z" fill="#b3261e" stroke="#fff" stroke-width="0.8"/>`;
    if (o.big) out += figure(w, h, w * 0.7, o.big, o.small, o.ink ?? '#1b1b1b');
    return out + plate(w, h, o.label, { at: 'tl' }) + plate(w, h, o.label2, { at: 'br', fill: '#b3261e' });
  },

  // A drone or missile over a damaged town.
  strike(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="${o.sky ?? '#d9dee6'}"/>`;
    out += skyline(w, h, h, '#6d7480', 0);
    const x = w * (o.x ?? 0.36);
    out += burst(x, h * 0.62, h * 0.2, '#ff9a3c');
    out += `<path d="M${r(x - 3)} ${r(h * 0.5)} q -8 ${r(-h * 0.2)} 3 ${r(-h * 0.36)}" fill="none" stroke="#3a3a3a" stroke-width="6" stroke-linecap="round" opacity="0.7"/>`;
    out += `<path d="M${r(w * 0.72)} ${r(h * 0.2)} l ${r(h * 0.3)} ${r(-h * 0.06)} l ${r(-h * 0.06)} ${r(h * 0.12)}z M${r(w * 0.72)} ${r(h * 0.2)} l ${r(-h * 0.16)} ${r(-h * 0.1)} M${r(w * 0.72)} ${r(h * 0.2)} l ${r(-h * 0.12)} ${r(h * 0.12)}" fill="#1b1b1b" stroke="#1b1b1b" stroke-width="2"/>`;
    if (o.big) out += figure(w, h, w * 0.6, o.big, o.small, '#1b1b1b');
    return out + plate(w, h, o.label, { at: 'tl', fill: '#b3261e' }) + plate(w, h, o.label2, { at: 'br' });
  },

  // A government building with a dome and a flagpole.
  capitol(w, h, o) {
    const x = w * (o.x ?? 0.28);
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#e8eef5'}"/>`;
    out += `<rect x="${r(x - h * 0.6)}" y="${r(h * 0.56)}" width="${r(h * 1.2)}" height="${r(h * 0.44)}" fill="#f4f1ea" stroke="#8a8f96" stroke-width="0.8"/>`;
    out += `<path d="M${r(x - h * 0.24)} ${r(h * 0.56)} a ${r(h * 0.24)} ${r(h * 0.3)} 0 0 1 ${r(h * 0.48)} 0z" fill="#dcd6c8" stroke="#8a8f96" stroke-width="0.8"/><path d="M${r(x)} ${r(h * 0.26)} V ${r(h * 0.08)}" stroke="#1b1b1b" stroke-width="1.2"/>`;
    if (o.flag) out += flag(x, h * 0.08, h * 0.3, h * 0.16, o.flag, o.fdir);
    for (let i = 0; i < 6; i++) out += `<rect x="${r(x - h * 0.52 + i * h * 0.2)}" y="${r(h * 0.64)}" width="3" height="${r(h * 0.36)}" fill="#b9b3a4"/>`;
    if (o.big) out += figure(w, h, w * 0.72, o.big, o.small, o.ink ?? '#1b1b1b');
    return out + plate(w, h, o.label, { at: 'tr', fill: o.plate ?? '#1b1b1b' }) + plate(w, h, o.label2, { at: 'br', fill: '#b3261e' });
  },

  // Flames over trees or buildings.
  fire(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="#3b2a26"/>`;
    for (let i = 0; i < 6; i++) {
      const x = w * (0.08 + i * 0.1), fh = h * (0.5 + (i % 3) * 0.14);
      out += `<path d="M${r(x)} ${h} q ${r(-w * 0.05)} ${r(-fh * 0.5)} ${r(w * 0.01)} ${r(-fh)} q ${r(w * 0.06)} ${r(fh * 0.5)} ${r(w * 0.04)} ${r(fh)}z" fill="${i % 2 ? '#ff9a3c' : '#ffd24a'}"/>`;
    }
    if (o.big) out += figure(w, h, w * 0.76, o.big, o.small, '#fff');
    return out + plate(w, h, o.label, { at: 'tr', fill: '#b3261e' });
  },

  // A chip: technology stories.
  chip(w, h, o) {
    const x = w * 0.24, s = h * 0.5;
    let out = `<rect width="${w}" height="${h}" fill="${o.bg ?? '#e9eef4'}"/>`;
    out += `<rect x="${r(x - s / 2)}" y="${r(h * 0.25)}" width="${r(s)}" height="${r(s)}" rx="3" fill="#20324f"/><rect x="${r(x - s / 4)}" y="${r(h * 0.25 + s / 4)}" width="${r(s / 2)}" height="${r(s / 2)}" fill="#6fb1e0"/>`;
    for (let i = 0; i < 4; i++) out += `<path d="M${r(x - s / 2 + 4 + i * (s - 8) / 3)} ${r(h * 0.25)} v -5 M${r(x - s / 2 + 4 + i * (s - 8) / 3)} ${r(h * 0.25 + s)} v 5 M${r(x - s / 2)} ${r(h * 0.25 + 4 + i * (s - 8) / 3)} h -5 M${r(x + s / 2)} ${r(h * 0.25 + 4 + i * (s - 8) / 3)} h 5" stroke="#20324f" stroke-width="1.6"/>`;
    if (o.big) out += figure(w, h, w * 0.7, o.big, o.small, o.ink ?? '#1b1b1b');
    return out + plate(w, h, o.label, { at: 'tr', fill: o.plate ?? '#1b1b1b' });
  },

  // Water over rooftops: floods.
  flood(w, h, o) {
    let out = `<rect width="${w}" height="${h}" fill="#9fb4c4"/>`;
    for (let i = 0; i < 5; i++) {
      const x = w * (0.06 + i * 0.12), bw = w * 0.08;
      out += `<rect x="${r(x)}" y="${r(h * 0.42)}" width="${r(bw)}" height="${r(h * 0.4)}" fill="#e9e2d0"/><polygon points="${r(x - 2)},${r(h * 0.44)} ${r(x + bw / 2)},${r(h * 0.24)} ${r(x + bw + 2)},${r(h * 0.44)}" fill="#a0442e"/>`;
    }
    out += waves(w, h * 0.66, h, '#5b7f9a');
    if (o.big) out += figure(w, h, w * 0.8, o.big, o.small, '#fff');
    return out + plate(w, h, o.label, { at: 'tr' }) + plate(w, h, o.label2, { at: 'bl', fill: '#b3261e' });
  },
};
