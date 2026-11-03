// Procedural level generator: random room + reverse (pull) BFS from solved state to find the start farthest from solved.
const [,, seedArg, nArg, boxesArg, wArg, hArg] = process.argv;
let seed = +seedArg || 1; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const DENS = +(process.argv[7] || 0.24);
const NB = +boxesArg, IW = +wArg, IH = +hArg, W = IW + 2, H = IH + 2;
const D = [1, -1, W, -W];
function makeRoom() {
  const wall = new Array(W * H).fill(true);
  for (let y = 1; y <= IH; y++) for (let x = 1; x <= IW; x++) wall[y * W + x] = rnd() < DENS;
  // keep largest component
  const seen = new Array(W * H).fill(false); let best = [];
  for (let i = 0; i < W * H; i++) if (!wall[i] && !seen[i]) { const comp = [i], st = [i]; seen[i] = true; while (st.length) { const c = st.pop(); for (const d of D) { const n = c + d; if (!wall[n] && !seen[n]) { seen[n] = true; comp.push(n); st.push(n); } } } if (comp.length > best.length) best = comp; }
  const floor = new Set(best);
  for (let i = 0; i < W * H; i++) if (!floor.has(i)) wall[i] = true;
  // trim dead-end corridor tips (cells with one neighbour) a couple of times
  for (let k = 0; k < 2; k++) for (const c of [...floor]) { if (D.filter((d) => floor.has(c + d)).length <= 1) { floor.delete(c); wall[c] = true; } }
  return { wall, floor: [...floor] };
}
function reach(p, wall, boxSet) { const seen = new Set([p]), st = [p]; let mn = p; while (st.length) { const c = st.pop(); for (const d of D) { const n = c + d; if (wall[n] || boxSet.has(n) || seen.has(n)) continue; seen.add(n); st.push(n); if (n < mn) mn = n; } } return { seen, mn }; }
function generate() {
  const { wall, floor } = makeRoom();
  if (floor.length < NB * 5 + 6 || floor.length > 48) return null;
  // goals: random floor cells, not in corners of walls on 3 sides
  const cand = floor.filter((c) => D.filter((d) => !wall[c + d]).length >= 2);
  if (cand.length < NB) return null;
  const goals = []; while (goals.length < NB) { const g = cand[(rnd() * cand.length) | 0]; if (!goals.includes(g)) goals.push(g); }
  const gs = new Set(goals);
  // initial states: every player region
  let frontier = [], visited = new Map();
  const done = new Set();
  for (const c of floor) { if (gs.has(c) || done.has(c)) continue; const r = reach(c, wall, gs); r.seen.forEach((x) => done.add(x)); const b = goals.slice().sort((a, b) => a - b); const k = b.join(',') + '|' + r.mn; visited.set(k, 0); frontier.push([b, c]); }
  let depth = 0, last = frontier;
  while (frontier.length) {
    const nf = [];
    for (const [b, p] of frontier) {
      const bs = new Set(b); const { seen } = reach(p, wall, bs);
      for (const x of b) for (const d of D) {
        const ps = x + d, pt = x + 2 * d; // player stands at ps, steps back to pt, box follows to ps
        if (!seen.has(ps) || wall[pt] || bs.has(pt)) continue;
        const nb = b.map((y) => (y === x ? ps : y)).sort((a, c) => a - c);
        const nbs = new Set(nb); const r = reach(pt, wall, nbs); const k = nb.join(',') + '|' + r.mn;
        if (visited.has(k)) continue; visited.set(k, depth + 1); nf.push([nb, pt]);
      }
    }
    if (visited.size > 1.5e6) return null;
    if (nf.length) { depth++; last = nf; } frontier = nf;
  }
  // choose farthest state with fewest boxes already home
  last.sort((a, b) => a[0].filter((x) => gs.has(x)).length - b[0].filter((x) => gs.has(x)).length);
  const [boxes, p] = last[0];
  const map = [];
  for (let y = 0; y < H; y++) { let row = ''; for (let x = 0; x < W; x++) { const i = y * W + x; if (wall[i]) row += '#'; else { const b = boxes.includes(i), g = gs.has(i); row += i === p ? (g ? '+' : '@') : b ? (g ? '*' : '$') : g ? '.' : ' '; } } map.push(row); }
  return { pushes: depth, onGoal: boxes.filter((x) => gs.has(x)).length, map };
}
const out = [];
for (let i = 0; i < +nArg; i++) { const r = generate(); if (r && r.onGoal === 0) out.push(r); }
out.sort((a, b) => b.pushes - a.pushes);
console.log(JSON.stringify(out.slice(0, 6)));
