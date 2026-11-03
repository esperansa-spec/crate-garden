// Exact minimum walking steps (moves incl. pushes) via Dijkstra over push states.
module.exports = function minSteps(m) {
  const H = m.length, W = Math.max(...m.map((r) => r.length));
  const walls = new Uint8Array(W * H), goals = new Set(); let boxes = [], p;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = m[y][x] || ' ', k = y * W + x; if (c === '#') walls[k] = 1; if ('.*+'.includes(c)) goals.add(k); if ('$*'.includes(c)) boxes.push(k); if ('@+'.includes(c)) p = k; }
  // treat outside cells as walls by bounds checks
  const D = [1, -1, W, -W];
  const ok = (n, d) => n >= 0 && n < W * H && !(d === 1 && n % W === 0) && !(d === -1 && n % W === W - 1);
  const heap = []; const push = (e) => { heap.push(e); let i = heap.length - 1; while (i) { const j = (i - 1) >> 1; if (heap[j][0] <= heap[i][0]) break; [heap[i], heap[j]] = [heap[j], heap[i]]; i = j; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let s = i; if (l < heap.length && heap[l][0] < heap[s][0]) s = l; if (r < heap.length && heap[r][0] < heap[s][0]) s = r; if (s === i) break; [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; } } return top; };
  const best = new Map();
  const enc = (b, pp) => b.slice().sort((a, c) => a - c).join(',') + '|' + pp;
  push([0, boxes, p]); best.set(enc(boxes, p), 0);
  const dist = new Int32Array(W * H);
  while (heap.length) {
    const [cost, b, pp] = pop();
    if (best.get(enc(b, pp)) < cost) continue;
    if (b.every((x) => goals.has(x))) return cost;
    const bs = new Set(b);
    dist.fill(-1); dist[pp] = 0; const q = [pp];
    for (let qi = 0; qi < q.length; qi++) { const c = q[qi]; for (const d of D) { const n = c + d; if (!ok(n, d) || walls[n] || bs.has(n) || dist[n] >= 0) continue; dist[n] = dist[c] + 1; q.push(n); } }
    for (const x of b) for (const d of D) {
      const from = x - d, to = x + d;
      if (!ok(from, -d) || dist[from] < 0 || !ok(to, d) || walls[to] || bs.has(to)) continue;
      const nb = b.map((y) => (y === x ? to : y)); const nc = cost + dist[from] + 1; const k = enc(nb, x);
      if (best.has(k) && best.get(k) <= nc) continue; best.set(k, nc); push([nc, nb, x]);
    }
  }
  return -1;
};
