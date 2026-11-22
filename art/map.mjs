// A small flat world map (plate carree, cropped) with one pin per story.
// The outlines are coarse on purpose: at 318 px wide the map only has to say "which part of the world".

const LAND = [
  // North America
  [[-168, 66], [-156, 71], [-125, 70], [-95, 72], [-82, 70], [-62, 58], [-55, 50], [-66, 44], [-76, 35], [-81, 25], [-90, 30], [-97, 26], [-97, 18], [-88, 15], [-83, 10], [-78, 8], [-85, 12], [-95, 16], [-105, 20], [-112, 30], [-124, 40], [-125, 49], [-135, 58], [-152, 58], [-165, 60]],
  // Greenland
  [[-52, 60], [-42, 60], [-22, 70], [-20, 78], [-60, 78], [-70, 76], [-55, 68]],
  // South America
  [[-78, 8], [-62, 10], [-50, 0], [-35, -6], [-39, -18], [-48, -26], [-58, -38], [-65, -45], [-69, -52], [-74, -50], [-72, -35], [-70, -18], [-80, -5]],
  // Europe
  [[-9, 37], [-9, 43], [-1, 44], [-4, 48], [2, 51], [8, 54], [8, 57], [5, 60], [12, 66], [25, 71], [40, 68], [60, 68], [60, 50], [48, 46], [40, 47], [36, 45], [28, 41], [23, 36], [20, 40], [13, 38], [16, 41], [12, 44], [7, 43], [3, 42], [0, 39], [-5, 36]],
  // Britain and Ireland
  [[-5, 50], [1, 51], [0, 54], [-3, 58], [-6, 56], [-4, 53]],
  [[-10, 52], [-6, 52], [-6, 55], [-10, 54]],
  // Africa
  [[-17, 15], [-16, 24], [-9, 32], [-5, 36], [10, 37], [20, 32], [32, 31], [35, 28], [43, 12], [51, 11], [42, -2], [40, -15], [35, -24], [28, -33], [19, -34], [13, -20], [12, -5], [9, 4], [-8, 5], [-13, 9]],
  // Madagascar
  [[44, -16], [50, -15], [48, -25], [44, -24]],
  // Asia
  [[28, 41], [36, 45], [40, 47], [48, 46], [60, 50], [60, 68], [80, 73], [105, 77], [140, 73], [170, 69], [180, 66], [170, 60], [160, 60], [156, 51], [143, 54], [135, 44], [129, 38], [126, 34], [122, 30], [120, 23], [110, 20], [108, 12], [105, 9], [100, 13], [103, 2], [98, 8], [94, 18], [90, 22], [80, 13], [77, 8], [72, 20], [67, 25], [57, 25], [51, 25], [56, 18], [45, 13], [43, 13], [35, 28], [36, 36]],
  // Japan
  [[130, 32], [136, 34], [141, 36], [142, 41], [145, 44], [141, 45], [139, 38], [133, 35]],
  // Indonesia and Borneo
  [[95, 5], [105, -6], [115, -8], [125, -9], [120, -3], [118, 5], [110, 2], [104, -1]],
  // Philippines
  [[120, 18], [123, 17], [126, 8], [122, 7], [120, 12]],
  // New Guinea
  [[132, -2], [141, -3], [150, -6], [146, -9], [138, -8]],
  // Australia
  [[114, -22], [122, -17], [131, -12], [137, -15], [142, -11], [146, -19], [153, -27], [150, -37], [144, -39], [135, -35], [129, -32], [118, -35], [114, -30]],
  // New Zealand
  [[173, -35], [178, -38], [175, -41], [169, -46], [167, -45], [172, -41]],
];

const WEST = -170, EAST = 180, NORTH = 78, SOUTH = -52;

export function worldMap(w, h, stories, colours) {
  const px = (lon) => ((lon - WEST) / (EAST - WEST)) * w;
  const py = (lat) => ((NORTH - lat) / (NORTH - SOUTH)) * h;
  let out = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;margin-top:2px">`;
  out += `<rect width="${w}" height="${h}" fill="#dbe8ee"/>`;
  for (const ring of LAND) {
    out += `<polygon points="${ring.map(([lon, lat]) => `${px(lon).toFixed(1)},${py(lat).toFixed(1)}`).join(' ')}" fill="#ece3cc" stroke="#b8ad90" stroke-width="0.6"/>`;
  }
  // Briefs first as small dots, then the drawn stories as numbered pins on top.
  const pinned = stories.filter((s) => s.at);
  for (const s of pinned.filter((s) => !s.art)) {
    out += `<circle cx="${px(s.at[0]).toFixed(1)}" cy="${py(s.at[1]).toFixed(1)}" r="2.6" fill="${colours[s.region]}" stroke="#fff" stroke-width="0.7"/>`;
  }
  for (const s of pinned.filter((s) => s.art)) {
    const x = px(s.at[0]) + (s.nudge?.[0] ?? 0), y = py(s.at[1]) + (s.nudge?.[1] ?? 0);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${colours[s.region]}" stroke="#fff" stroke-width="1.2"/>`;
    out += `<text x="${x.toFixed(1)}" y="${(y + 3.6).toFixed(1)}" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">${s.n}</text>`;
  }
  return out + '</svg>';
}
