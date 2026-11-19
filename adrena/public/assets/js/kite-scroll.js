/* Adrena: scroll-animated kitesurfer (section.adrena-kite in index.html). Moved from adrena-kitesurfer.html. */
(() => {
const root = document.querySelector('.adrena-kite');
if (!root) return;
const stage = root.querySelector('.adrena-kite__stage');
// markup sits in a <template> so the {{placeholders}} are never parsed as live SVG attributes
const tpl = stage.querySelector('template.adrena-kite__tpl');
const REDUCE = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const parts = tpl ? tpl.content.cloneNode(true) : null;
class DCLogic { constructor() { this.props = {}; this.state = {}; } setState(o) { Object.assign(this.state, o); schedule(); } }

class Component extends DCLogic {
componentDidMount() {
if (REDUCE) return; // reduced motion: one still frame, nothing listens to scroll
// The page scrolls normally. The trick's progress is plain scroll distance: 0 at the top of the page,
// 1 once half of the scene has scrolled away (long before the next sections are fully on screen).
// Layout is measured only on load/resize; the scroll path reads scrollY alone, so no layout work per frame.
this._measure = () => {
const el = this._track;
if (!el) return;
const sticky = parseFloat(getComputedStyle(stage).top) || 0;
const top = el.getBoundingClientRect().top + window.scrollY;
this._start = Math.max(0, top - sticky);
this._span = Math.max(1, top - sticky + el.offsetHeight - stage.offsetHeight * 0.5 - this._start);
if (story) story.measure();
};
this._onWin = () => {
if (this._raf) return;
this._raf = requestAnimationFrame(() => {
this._raf = 0;
const y = window.scrollY;
const v = Math.max(0, Math.min(1, (y - this._start) / this._span));
const cur = (this.state && this.state.p) || 0;
if (Math.abs(v - cur) > 0.0005 || y !== this.state.y) this.setState({ p: v, y });
});
};
this._onResize = () => { this._measure(); this._onWin(); };
this._measure();
window.addEventListener('scroll', this._onWin, { passive: true });
window.addEventListener('resize', this._onResize);
window.addEventListener('load', this._onResize);
this._onWin();
}
componentWillUnmount() {
if (this.ro) this.ro.disconnect();
window.removeEventListener('scroll', this._onWin);
window.removeEventListener('resize', this._onResize);
window.removeEventListener('load', this._onResize);
if (this._raf) cancelAnimationFrame(this._raf);
}
trackRefFn() {
if (!this._tr) this._tr = el => { this._track = el; };
return this._tr;
}
measureRef() {
if (!this._mref) {
this._mref = el => {
if (this.ro) { this.ro.disconnect(); this.ro = null; }
if (!el || typeof ResizeObserver !== 'function') return;
this.ro = new ResizeObserver(en => {
const r = en[0].contentRect, s = this.state || {};
if (r.width > 0 && r.height > 0 && (Math.abs((s.aw || 0) - r.width) > 1 || Math.abs((s.ah || 0) - r.height) > 1)) this.setState({ aw: r.width, ah: r.height });
});
this.ro.observe(el);
};
}
return this._mref;
}
scrollHandler() {
if (!this._sh) {
this._sh = e => {
const el = e.currentTarget;
const v = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
const cur = (this.state && this.state.p) || 0;
if (Math.abs(v - cur) > 0.0005) this.setState({ p: v });
};
}
return this._sh;
}
renderVals() {
const st = this.state || {};
const p = REDUCE ? 1 : (st.p || 0); // reduced motion shows the final frame
const aw = st.aw || 1440, ah = st.ah || 900;
const A = aw / ah;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const sstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => { const X = hex(a), Y = hex(b); return 'rgb(' + X.map((v, i) => Math.round(lerp(v, Y[i], t))).join(',') + ')'; };
const toHex = c => '#' + c.match(/\d+/g).map(n => (+n).toString(16).padStart(2, '0')).join('');
const shade = (h, k) => 'rgb(' + hex(h).map(v => Math.round(v * k)).join(',') + ')';
const f = n => Math.round(n * 10) / 10;
const P = v => f(v[0]) + ' ' + f(v[1]);
const nrm = a => ((a + 180) % 360 + 360) % 360 - 180;
const wave = (y, amp, len, off) => { const s0 = -1200 + ((off % len) + len) % len - len; let d = 'M' + f(s0) + ' ' + y; for (let x = s0; x < 2800; x += len) d += ' q' + len / 4 + ' ' + (-amp) + ' ' + len / 2 + ' 0 t' + len / 2 + ' 0'; return d; };
const circ = (cx, cy, r) => 'M' + f(cx - r) + ' ' + f(cy) + 'a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(2 * r) + ' 0a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(-2 * r) + ' 0';
const dots = arr => arr.map(([cx, cy, r]) => circ(cx, cy, Math.max(0.6, r))).join('');
const ell = (cx, cy, rx, ry) => 'M' + f(cx - rx) + ' ' + f(cy) + 'a' + f(rx) + ' ' + f(ry) + ' 0 1 0 ' + f(2 * rx) + ' 0a' + f(rx) + ' ' + f(ry) + ' 0 1 0 ' + f(-2 * rx) + ' 0';
const limb = (pts, ws, dx, dy) => {
const o = dx || 0, q = dy || 0;
const Q = pts.map(([a, b]) => [a + o, b + q]);
const L = [], R = [];
for (let i = 0; i < Q.length; i++) {
const a = Q[Math.max(0, i - 1)], b = Q[Math.min(Q.length - 1, i + 1)];
let vx = b[0] - a[0], vy = b[1] - a[1]; const m = Math.hypot(vx, vy) || 1; vx /= m; vy /= m;
const w2 = ws[i] / 2;
L.push([Q[i][0] - vy * w2, Q[i][1] + vx * w2]); R.push([Q[i][0] + vy * w2, Q[i][1] - vx * w2]);
}
let d = 'M' + L.map(P).join(' L') + ' L' + R.reverse().map(P).join(' L') + 'Z';
Q.forEach((v, i) => { d += circ(v[0], v[1], ws[i] / 2); });
return d;
};
const edge = (pts, ws, side) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const vx = b[0] - a[0], vy = b[1] - a[1]; const m = Math.hypot(vx, vy) || 1; const k = side * (ws[i] / 2 - 2); out.push(P([pts[i][0] - vy / m * k, pts[i][1] + vx / m * k])); } return 'M' + out.join(' L'); };
const ik = (S, C, l1, l2, bend) => { const dx = C[0] - S[0], dy = C[1] - S[1]; const d = Math.max(1, Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01)); const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)); const b = Math.atan2(dy, dx) + bend * a; return [S[0] + Math.cos(b) * l1, S[1] + Math.sin(b) * l1]; };
const rot = (v, deg) => { const r = deg * Math.PI / 180; return [v[0] * Math.cos(r) - v[1] * Math.sin(r), v[0] * Math.sin(r) + v[1] * Math.cos(r)]; };

const kiteColor = this.props.kiteColor ?? '#FF5A36';
const suitColor0 = this.props.suitColor ?? '#13212E';
const showCaptions = this.props.showCaptions ?? true;

// screen mode: wide screens see the whole bay, narrow screens get a camera that follows the rider
const wide = A >= 1.45;
const ks = wide ? 1 : A < 0.9 ? 0.62 : 0.85;
const ksz = wide ? 1 : A < 0.9 ? 0.8 : 0.9;
const g = clamp(p * 1.05, 0, 1);

// phases: ride 0-0.36, set up 0.36-0.46, pop 0.46, air 0.46-0.74, landing 0.74-0.80, ride out
const xBase = lerp(250, 860, ease(p));
const setup = sstep(0.36, 0.46, p) * (1 - sstep(0.46, 0.5, p));
const t = clamp((p - 0.46) / 0.28, 0, 1);
const air = t > 0 && t < 1;
const loopPull = p < 0.46 ? 0 : p <= 0.74 ? 80 * sstep(0, 1, t) : 80 * (1 - sstep(0.8, 1, p));
const x = xBase + loopPull;
const H = 500;
const h = air ? H * (1 - Math.pow(Math.abs(2 * t - 1), 2.4)) : 0;
const u = clamp((t - 0.06) / 0.86, 0, 1);
const rotP = u + Math.sin(2 * Math.PI * u) * 0.75 / (2 * Math.PI);
const roll = air ? -360 * rotP : 0;
const tuck = air ? Math.pow(Math.sin(Math.PI * u), 1.3) : 0;
const v = clamp((p - 0.74) / 0.06, 0, 1);
const absorb = Math.sin(Math.PI * v);
const sink = absorb * 6;
const bob = air ? 0 : Math.sin(p * 70) * 3 * (1 - setup);
const lean = air ? lerp(-28, -12, t) : lerp(-16, -28, setup) - absorb * 6 + Math.sin(p * 40) * 2 * (1 - setup);
const ang = lean + roll;
const wA = air ? sstep(0, 0.1, t) * (1 - sstep(0.88, 1, t)) : 0;
const lift = tuck * 46 + absorb * 16;

// board: level on the water, follows the body only in the air
const waterTilt = Math.sin(p * 55) * 1.5 * (1 - setup) - 5 * setup - (v > 0 && v < 1 ? 9 * (1 - sstep(0, 0.6, v)) : 0);
const boardRel = lerp(waterTilt - nrm(ang), 0, wA);
const footB = rot([-33, -12], boardRel), footF = rot([33, -12], boardRel);
const ankB = [footB[0], footB[1] - lift], ankF = [footF[0], footF[1] - lift];

// rider placement: board on the water when riding, body centre on the jump arc in the air
const Rf = (lx, ly) => { const r = rot([lx, ly + 80], ang); return [r[0], r[1] - 80]; };
const bLoc = Rf(0, -lift);
const waterY = 670 + bob + sink;
const tx = lerp(x - bLoc[0], x, wA), ty = lerp(waterY - bLoc[1], 664 - h, wA);
const W = (lx, ly) => { const r = Rf(lx, ly); return [tx + r[0], ty + r[1]]; };
const boardW = W(0, -lift);
const pivotW = W(0, -80);

const hipB = [-10, -86], hipF = [6, -86];
const kneeB = ik(hipB, ankB, 40, 40, -1), kneeF = ik(hipF, ankF, 40, 40, -1);
const legW = [24, 17, 11];
const legBackPts = [hipB, kneeB, ankB], legFrontPts = [hipF, kneeF, ankF];
const along = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const pad = (knee, ank) => [along(knee, ank, 0.06), along(knee, ank, 0.34)];

const pull = Math.max(tuck, setup * 0.4);
const bx = 36 - pull * 16, by = -118 + pull * 10;
const barTop = [bx - 2, by - 22], barBot = [bx + 2, by + 20];
const handFar = [bx - 1, by - 12], handNear = [bx + 1, by + 10];
const shF = [-20, -138], shN = [-26, -134];
const elF = ik(shF, handFar, 32, 32, 1), elN = ik(shN, handNear, 36, 36, 1);
const armW = [13, 11, 9];
const armNearPts = [shN, elN, handNear];
const chicken = [30, -110];

// kite: always the same line length from the bar. In normal flight it sits ahead and up;
// during the backroll it travels a full circle around him at that same distance, in line with the bar,
// so the lines never shorten and always run straight out from the bar, clear of his head.
const zen = sstep(0.43, 0.49, p) * (1 - sstep(0.68, 0.73, p));
const dive = sstep(0.71, 0.76, p) * (1 - sstep(0.8, 0.9, p));
const sway = 1 - Math.max(zen, setup);
let kdx = lerp(340, 270, setup), kdy = lerp(250, 228, setup), krt = lerp(20, 10, setup);
kdx = lerp(kdx, 30, zen); kdy = lerp(kdy, 170, zen); krt = lerp(krt, 0, zen);
kdx = lerp(kdx, 230, dive); kdy = lerp(kdy, 290, dive); krt = lerp(krt, 34, dive);
const LINE = 280 * (wide ? 1 : Math.max(ks, ksz));
const bcW = W(bx, by);
const phiN = Math.atan2((kdy + Math.cos(p * 16) * 12 * sway) - 546, kdx + Math.sin(p * 20) * 30 * sway) * 180 / Math.PI;
const krOffN = krt - (phiN + 90) + Math.sin(p * 20) * 7 * sway;
const loopB = air ? sstep(0, 0.12, u) * (1 - sstep(0.88, 1, u)) : 0;
const barDir = Math.atan2(by + 80, bx) * 180 / Math.PI;
const phiL = barDir + ang;
const phi = phiL + nrm(phiN - phiL) * (1 - loopB);
const th = phi * Math.PI / 180;
let kx = bcW[0] + LINE * Math.cos(th), ky = bcW[1] + LINE * Math.sin(th);
const kr = phi + 90 + krOffN * (1 - loopB);
const fx = (1 + zen * 0.1) * ksz, fy = (1 - zen * 0.08) * ksz;
const krr = kr * Math.PI / 180;
const kOff = Math.max(...[[-165, 48], [165, 48], [0, -44], [-118, -14], [118, -14], [-60, -38], [60, -38]].map(([a, c]) => a * fx * Math.sin(krr) + c * fy * Math.cos(krr)));
const kUp = Math.max(...[[-165, 48], [165, 48], [0, -44], [-118, -14], [118, -14], [-60, -38], [60, -38]].map(([a, c]) => -(a * fx * Math.sin(krr) + c * fy * Math.cos(krr))));
const kr2 = kr * Math.PI / 180;
const kp = (lx, ly) => { const a = lx * fx, b = ly * fy; return [kx + a * Math.cos(kr2) - b * Math.sin(kr2), ky + a * Math.sin(kr2) + b * Math.cos(kr2)]; };

// lines: front lines run from the chicken loop through the bar, steering lines from the bar ends
const sag = 14 * (1 - Math.max(zen, air ? 1 : 0, loopB));
const ctrl = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
const qd = (a, b, o) => { const c = ctrl(a, b); const k = o || 0; return 'M' + P([a[0] + k, a[1] + k]) + ' Q' + P([c[0] + k, c[1] + k]) + ' ' + P([b[0] + k, b[1] + k]); };
const qpt = (a, b, tt) => { const c = ctrl(a, b), m = 1 - tt; return [m * m * a[0] + 2 * m * tt * c[0] + tt * tt * b[0], m * m * a[1] + 2 * m * tt * c[1] + tt * tt * b[1]]; };
const bc = W(bx, by), bt = W(barTop[0], barTop[1]), bb = W(barBot[0], barBot[1]), ckW = W(chicken[0], chicken[1]);
const fl1 = kp(-40, 70), fl2 = kp(40, 70), st1 = kp(-165, 48), st2 = kp(165, 48);
const frontLines = 'M' + P(ckW) + ' L' + P(bc) + ' ' + qd(bc, fl1) + ' ' + qd(bc, fl2);
const steerLines = qd(bt, st1) + ' ' + qd(bb, st2);
const lineGlint = [qd(bc, fl1, -0.9), qd(bc, fl2, -0.9), qd(bt, st1, -0.9), qd(bb, st2, -0.9)].join(' ');
const floaters = dots([qpt(bc, fl1, 0.3).concat([3]), qpt(bc, fl2, 0.3).concat([3])]);

// water effects
let wake = '', spray = '', foamNear = '', foamMid = '', foamFar = '', chop = '';
if (!air && p > 0.005 && p < 0.998) {
const regrow = p > 0.74 ? clamp((p - 0.74) / 0.1, 0.08, 1) : 1;
const n = Math.max(1, Math.round(12 * regrow));
const tail = boardW[0] - 76;
const pts = [], wp = [];
for (let k = 1; k <= n; k++) { const px = tail - k * 34, py = 676 + Math.sin(k * 0.9 + p * 50) * 3 * (1 - setup) - k * k * 0.55 * setup; wp.push([px, py]); pts.push(P([px, py])); }
wake = 'M' + P([tail, 674]) + ' L' + pts.join(' L');
const fb = [[], [], []];
wp.forEach((q, k) => { for (let j = 0; j < 3; j++) { const jx = Math.sin(k * 7.1 + j * 2.3 + p * 30) * 14, jy = Math.cos(k * 3.7 + j * 1.9 + p * 26) * 5; fb[k < 4 ? 0 : k < 8 ? 1 : 2].push([q[0] + jx, q[1] + jy, Math.max(1.2, 3.6 - k * 0.2 - j * 0.5)]); } });
foamNear = dots(fb[0]); foamMid = dots(fb[1]); foamFar = dots(fb[2]);
const ch = []; for (let i = 0; i < 5; i++) { const cx = boardW[0] - 30 + i * 26 + Math.sin(p * 40 + i) * 6, cy = 686 + (i % 2) * 6; ch.push('M' + f(cx) + ' ' + cy + ' q5 -' + (2 + (i % 3)) + ' 10 0'); } chop = ch.join(' ');
const big = 1 + setup * 1.4;
const sp = [];
for (let i = 0; i < 12; i++) sp.push([tail - 2 - i * 13 * big + Math.sin(p * 90 + i) * 6, 664 - Math.abs(Math.sin(p * 70 + i * 1.7)) * (40 - i * 2) * big, (7 - i * 0.5) * (1 + setup * 0.5)]);
spray = dots(sp);
}

// take-off burst: droplets thrown up and back, plus a sheet of spray
const pq = clamp((p - 0.46) / 0.06, 0, 1);
const x0 = lerp(250, 860, ease(0.46)) - 76;
let burst = '', sheet = '';
if (pq > 0 && pq < 1) {
const d = [];
for (let i = 0; i < 28; i++) {
const ang0 = (200 + ((i * 37) % 60)) * Math.PI / 180, sp0 = 140 + ((i * 53) % 120);
d.push([x0 + Math.cos(ang0) * sp0 * pq, 672 + Math.sin(ang0) * sp0 * pq * 0.9 + 260 * pq * pq, (2 + (i % 5) * 1.1) * (1 - pq * 0.5)]);
}
burst = dots(d);
const L1 = 180 * pq, H1 = 70 * Math.sin(Math.PI * Math.min(1, pq * 1.4));
sheet = 'M' + f(x0) + ' 674 Q' + f(x0 - L1 * 0.4) + ' ' + f(670 - H1 * 1.4) + ' ' + f(x0 - L1) + ' ' + f(672 - H1 * 0.4) + ' Q' + f(x0 - L1 * 0.5) + ' ' + f(676 - H1 * 0.5) + ' ' + f(x0) + ' 678Z';
}
const lq = clamp((p - 0.74) / 0.07, 0, 1);
let splash = '';
if (lq > 0 && lq < 1) { const sp = []; for (let i = 0; i < 18; i++) { const a = Math.PI + (i / 17) * Math.PI; sp.push([boardW[0] - 30 + Math.cos(a) * 150 * lq, 674 + Math.sin(a) * 90 * lq + lq * lq * 44, 7 - i % 3]); } splash = dots(sp); }
const xLand = lerp(250, 860, ease(0.74)) + 80;
const rq = clamp((p - 0.74) / 0.16, 0, 1);
let rings = '';
if (rq > 0 && rq < 1) { for (let k = 0; k < 3; k++) { const rx = rq * 170 - k * 34; if (rx > 4) rings += ell(xLand - 30, 682, rx, rx * 0.16); } }
let drips = '';
if (air && t > 0.04) { const dd = []; for (let i = 0; i < 8; i++) { const fall = (t * 900 + i * 53) % 150; dd.push([boardW[0] - 30 + i * 9 + Math.sin(i * 3) * 6, boardW[1] + 6 + fall, 2.2 - (i % 3) * 0.4]); } drips = dots(dd); }
const waterCover = !air || wA < 0.05 ? ell(boardW[0], boardW[1] + 6, 92, 1.5 + sink * 0.9) : '';

// sky, sun and reflections
const sunY = lerp(150, 505, sstep(0, 1, g));
const sparkle = []; for (let i = 0; i < 9; i++) { const tw = Math.sin(p * 80 + i * 2.3); if (tw > 0.3) { const sx = 1130 + ((i * 97) % 260), sy = 600 + ((i * 41) % 110), k = 4 * tw * (0.5 + g); sparkle.push('M' + f(sx) + ' ' + f(sy - k) + ' L' + f(sx + k * 0.25) + ' ' + f(sy - k * 0.25) + ' L' + f(sx + k) + ' ' + f(sy) + ' L' + f(sx + k * 0.25) + ' ' + f(sy + k * 0.25) + ' L' + f(sx) + ' ' + f(sy + k) + ' L' + f(sx - k * 0.25) + ' ' + f(sy + k * 0.25) + ' L' + f(sx - k) + ' ' + f(sy) + ' L' + f(sx - k * 0.25) + ' ' + f(sy - k * 0.25) + 'Z'); } }
const rows = Math.round(lerp(6, 16, g));
const shim = []; for (let i = 0; i < rows; i++) { const wdt = (120 - i * 5) * (1 + 0.28 * Math.sin(p * 60 + i * 1.7)) * lerp(0.8, 1.2, g), sx = 1250 + Math.sin(p * 30 + i) * 8 * g - wdt / 2, sy = 590 + i * 14; shim.push('M' + f(sx) + ' ' + sy + ' h' + f(wdt) + ' v3 h' + f(-wdt) + 'Z'); }

// seagulls: wings always form a clear M shape, each with its own rhythm
const gull = (gx, gy, sc, sp, ph) => { const fl = Math.sin(p * sp + ph); const a = (5 + 4 * fl) * sc, tip = (2 - 5 * fl) * sc, wd = 12 * sc; return 'M' + f(gx - wd) + ' ' + f(gy + tip) + ' Q' + f(gx - wd * 0.5) + ' ' + f(gy - a) + ' ' + f(gx) + ' ' + f(gy) + ' Q' + f(gx + wd * 0.5) + ' ' + f(gy - a) + ' ' + f(gx + wd) + ' ' + f(gy + tip); };
const birds = gull(520 + p * 300, 230 - p * 60, 1, 120, 0) + ' ' + gull(580 + p * 330, 205 - p * 70, 0.8, 150, 1.7) + ' ' + gull(556 + p * 280, 262 - p * 50, 0.7, 100, 3.1);

// camera
let vbX, vbY, vbW, vbH;
if (wide) {
vbH = 900; vbW = 900 * A; vbX = 800 - vbW / 2;
const riderTop = Math.min(W(-26, -188)[1], W(-80, -lift - 14)[1], W(80, -lift - 14)[1]);
vbY = Math.min(0, Math.min(ky - kUp, riderTop) - 40);
}
else {
const need = Math.max(200 + ks * 380 + ksz * 170 + 60, 2 * (LINE + 60 + ksz * 170 + 30));
vbW = need; vbH = vbW / A; if (vbH < 720) { vbH = 720; vbW = vbH * A; }
const leftRide = x - 200, leftLoop = pivotW[0] - vbW / 2;
vbX = lerp(leftRide, leftLoop, sstep(0, 0.15, u) * (1 - sstep(0.85, 1, u)) * (air ? 1 : 0));
const kW = Math.max(...[[-165, 48], [165, 48], [0, -44], [-118, -14], [118, -14]].map(([a, c]) => Math.abs(a * fx * Math.cos(krr) - c * fy * Math.sin(krr))));
vbX = Math.min(vbX, kx - kW - 16);
vbX = Math.max(vbX, kx + kW + 16 - vbW);
vbX = Math.min(vbX, pivotW[0] - 150);
vbX = Math.max(vbX, pivotW[0] + 150 - vbW);
vbY = Math.min(40, 430 - vbH * 0.52);
const riderTopN = Math.min(W(-26, -188)[1], W(-80, -lift - 14)[1], W(80, -lift - 14)[1]);
vbY = Math.min(vbY, Math.min(ky - kUp, riderTopN) - 30);
}

// captions: free water at the bottom right on wide screens, bottom centre on phones
const capFade = (a, b, c, d) => { const o = sstep(a, b, p) * (1 - sstep(c, d, p)); const y = (1 - sstep(a, b, p)) * 24 - sstep(c, d, p) * 24; return [f(o * 100) / 100, f(y)]; };
const c1 = capFade(-1, -0.5, 0.36, 0.41), c2 = capFade(0.42, 0.47, 0.73, 0.78), c3 = capFade(0.79, 0.84, 2, 3);
const capSize = wide ? Math.round(clamp(aw / 22, 40, 72)) : Math.round(clamp(aw / 11, 28, 44));
const capBox = wide ? 'right: 64px; bottom: 56px; width: 60%; height: ' + capSize + 'px; text-align: right; font-size: ' + capSize + 'px' : 'left: 24px; right: 24px; bottom: 48px; height: ' + capSize + 'px; text-align: center; font-size: ' + capSize + 'px';

const wet = sstep(0.74, 0.8, p) * 0.24;
const suitBase = toHex(mix(suitColor0, '#000000', wet));
const strapEnd = [bx + 9, by - 28];

return {
trackRef: this.trackRefFn(), stageRef: this.measureRef(),
vb: f(vbX) + ' ' + f(vbY) + ' ' + f(vbW) + ' ' + f(vbH),
kiteColor, kiteDark: shade(kiteColor, 0.74), suitColor: suitBase, suitShade: mix(suitBase, '#000000', 0.38), suitLight: mix(suitBase, '#FFFFFF', 0.32 - wet * 0.5), showCaptions,
capBox, c1o: c1[0], c1y: c1[1], c2o: c2[0], c2y: c2[1], c3o: c3[0], c3y: c3[1],
skyTop: mix('#5DB8E8', '#7C7FB8', g), skyBot: mix('#D2ECF6', '#FFB27A', g),
seaTop: mix('#2BB3B0', '#3B8F9C', g), seaBot: mix('#0B6F7C', '#1B4C5E', g),
sandColor: mix('#E9D8A6', '#DDB283', g), beachColor: mix('#EFE2B8', '#E4BE8E', g), sunColor: mix('#FFF6DA', '#FF9E52', g),
sunY: f(sunY), sunGlow: f(lerp(200, 300, g)), reflectOp: f(lerp(0.12, 0.85, g) * 100) / 100,
cloudShade: mix('#D6E9F2', '#F09868', g), cloudFill: mix('#FFFFFF', '#FFE6D2', g), birds, grassRot: f(Math.sin(p * 30) * 7),
shimmer: shim.join(' '), sparkles: sparkle.join(' '),
bg1T: 'translate(' + f(((300 + p * 1100) % 1700) - 50) + ' 598) scale(0.55)', bg2T: 'translate(' + f(1450 - p * 650) + ' 606) scale(0.65)', bg3T: 'translate(' + f(((1000 + p * 500) % 1700) - 50) + ' 618) scale(0.8)',
cloudT: 'translate(' + f(-p * 520) + ' 0)', windT: 'translate(' + f(-p * 1700) + ' 0)',
duneT: 'translate(' + f(-p * 180) + ' 0)', boatT: 'translate(' + f(-p * 90) + ' 0)',
wave1: wave(622, 6, 180, -p * 900), wave2: wave(712, 9, 240, -p * 1500), wave3: wave(830, 12, 320, -p * 2400), wave4: wave(960, 14, 380, -p * 2900),
shadowX: f(boardW[0]), shadowRx: f(Math.max(16, 74 * (1 - h / 400))), shadowOp: f(0.34 * Math.pow(1 - h / 420, 1.6) * 100) / 100,
wake, spray, foamNear, foamMid, foamFar, chop, burst, sheet, burstOp: f((1 - pq) * 100) / 100, splash, splashOp: f((1 - lq) * 100) / 100,
rings, ringOp: rq > 0 && rq < 1 ? f((1 - rq) * 70) / 100 : 0, drips, waterCover,
frontLines, steerLines, lineGlint, floaters,
kiteT: 'translate(' + f(kx) + ' ' + f(ky) + ') rotate(' + f(kr) + ') scale(' + f(fx * 100) / 100 + ' ' + f(fy * 100) / 100 + ')',
riderT: 'translate(' + f(tx) + ' ' + f(ty) + ') rotate(' + f(ang) + ' 0 -80)',
boardT: 'translate(0 ' + f(-lift) + ') rotate(' + f(boardRel) + ')',
legBackShade: limb(legBackPts, legW), legBack: limb(legBackPts, legW.map(q => q * 0.7), 2, -1),
legFrontShade: limb(legFrontPts, legW), legFront: limb(legFrontPts, legW.map(q => q * 0.74), 2.5, -1),
legFrontEdge: edge(legFrontPts, legW, -1),
padBack: limb(pad(kneeB, ankB), [16, 14]), padFront: limb(pad(kneeF, ankF), [17, 15]),
padGlint: edge(pad(kneeF, ankF), [17, 15], -1),
shortBack: limb([hipB, along(hipB, kneeB, 0.32)], [27, 25]), shortFront: limb([hipF, along(hipF, kneeF, 0.32)], [27, 25]),
armFar: limb([shF, elF, handFar], armW),
armNearShade: limb(armNearPts, armW), armNear: limb(armNearPts, armW.map(q => q * 0.72), 1.5, -1.5), armNearEdge: edge(armNearPts, armW, -1),
bar: 'M' + P(barTop) + ' L' + P(barBot),
barGrips: 'M' + P(barTop) + ' L' + P([barTop[0] + 0.5, barTop[1] + 8]) + ' M' + P(barBot) + ' L' + P([barBot[0] - 0.5, barBot[1] - 8]),
depower: 'M' + P(chicken) + ' L' + P([bx, by]),
strap: 'M' + P([bx, by]) + ' L' + P(strapEnd), ballX: f(strapEnd[0]), ballY: f(strapEnd[1]),
handFarT: 'translate(' + P(handFar) + ')', handNearT: 'translate(' + P(handNear) + ')',
hintOp: p > 0.03 ? 0 : 1, barW: f(p * 100) + '%',
p, mode: wide ? 'wide' : A < 0.9 ? 'narrow' : 'mid'
};
}
}

const c = new Component();
c.props = { kiteColor: root.dataset.kiteColor || '#FF5A36', suitColor: root.dataset.suitColor || '#13212E', showCaptions: root.dataset.captions !== 'false' };
// bind every {{hole}} in the markup once, then only update those attributes
const binds = [];
const walk = el => {
  for (const a of [...el.attributes]) if (a.value.includes('{{')) { binds.push([el, a.name, a.value]); if (a.name !== 'style') el.removeAttribute(a.name); }
  for (const ch of el.childNodes) {
    if (ch.nodeType === 3 && ch.nodeValue.includes('{{')) binds.push([ch, null, ch.nodeValue]);
    else if (ch.nodeType === 1) walk(ch);
  }
};
if (parts) { for (const el of parts.children) walk(el); tpl.replaceWith(parts); } else walk(stage);
root.classList.add('is-drawn');
const ifs = [...stage.querySelectorAll('[data-if]')];
const fill = (t, v) => t.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => (typeof v[k] === 'function' ? '' : String(v[k] ?? '')));
let raf = 0;
function update() {
  raf = 0;
  const v = c.renderVals();
  for (const [el, name, t] of binds) { const s = fill(t, v); if (name === null) { if (el.nodeValue !== s) el.nodeValue = s; } else if (el.getAttribute(name) !== s) el.setAttribute(name, s); }
  for (const el of ifs) el.style.display = v[el.dataset.if] ? '' : 'none';
  if (story) story.render(c.state.y || 0, v.p);
}

/* ---- Hero text: each block slides up out of its mask as it scrolls into view (same scroll value, same frame) ---- */
const story = (() => {
  const box = root.querySelector('.story');
  if (!box || REDUCE) return null;
  const chs = [...box.querySelectorAll('.story-ch')];
  const hint = stage.querySelector('.story-hint');
  chs.forEach(ch => ch.querySelectorAll('.ln').forEach((ln, i) => ln.style.setProperty('--i', i)));
  let thr = chs.map(() => 0), shown = chs.map(() => null), hintGone = null;
  return {
    // cached on load/resize: the scrollY at which each block's top reaches 88% of the viewport
    measure() { const vh = window.innerHeight; thr = chs.map(ch => ch.getBoundingClientRect().top + window.scrollY - vh * 0.88); },
    render(y) {
      chs.forEach((ch, i) => {
        const on = shown[i] ? y > thr[i] - 48 : y >= thr[i]; // small hysteresis, no flicker at the edge
        if (on !== shown[i]) { shown[i] = on; ch.classList.toggle('is-in', on); }
      });
      const gone = y > 8;
      if (hint && gone !== hintGone) { hintGone = gone; hint.classList.toggle('is-gone', gone); }
    }
  };
})();
if (story) root.classList.add('is-story');
function schedule() { if (!raf) raf = requestAnimationFrame(update); }
const v0 = c.renderVals();
if (v0.trackRef) v0.trackRef(root);
if (v0.stageRef) v0.stageRef(stage);
c.componentDidMount && c.componentDidMount();
update();
})();
