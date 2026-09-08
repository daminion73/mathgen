// MathGen procedural SVG diagram engine.
// MG.diagram(spec) -> svg string. Every diagram is generated from data, never hand-drawn.
window.MG = window.MG || {};

(function () {
	const NS = 'http://www.w3.org/2000/svg';
	// Colors resolve from CSS variables so diagrams follow light/dark theme natively.
	const INK = 'var(--dg-ink, #141414)';
	const ACCENT = 'var(--dg-accent, #3d3d3d)';
	const LIGHT = 'var(--dg-light, #e9e9e9)';
	const FAINT = 'var(--dg-faint, #8c8c8c)';
	const SHADE1 = 'var(--dg-shade-1, rgba(20,20,20,0.05))';
	const SHADE2 = 'var(--dg-shade-2, rgba(20,20,20,0.10))';
	const SHADE3 = 'var(--dg-shade-3, rgba(20,20,20,0.15))';
	const SHADE4 = 'var(--dg-shade-4, rgba(20,20,20,0.22))';

	function esc(s) { return String(s); }

	function svgOpen(w, h) {
		return `<svg xmlns="${NS}" viewBox="0 0 ${w} ${h}" class="diagram" role="img">`;
	}
	function line(x1, y1, x2, y2, opts = {}) {
		return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${opts.stroke || INK}" stroke-width="${opts.w || 1.8}" ${opts.dash ? `stroke-dasharray="${opts.dash}"` : ''} stroke-linecap="round"/>`;
	}
	function poly(pts, opts = {}) {
		const d = pts.map((p) => p.join(',')).join(' ');
		return `<polygon points="${d}" fill="${opts.fill || 'none'}" stroke="${opts.stroke || INK}" stroke-width="${opts.w || 1.8}" stroke-linejoin="round"/>`;
	}
	function circle(cx, cy, r, opts = {}) {
		return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${opts.fill || 'none'}" stroke="${opts.stroke || INK}" stroke-width="${opts.w || 1.8}"/>`;
	}
	function text(x, y, s, opts = {}) {
		return `<text x="${x}" y="${y}" font-size="${opts.size || 14}" fill="${opts.fill || INK}" text-anchor="${opts.anchor || 'middle'}" font-style="${opts.italic ? 'italic' : 'normal'}" font-family="Georgia, serif">${esc(s)}</text>`;
	}
	function path(d, opts = {}) {
		return `<path d="${d}" fill="${opts.fill || 'none'}" stroke="${opts.stroke || INK}" stroke-width="${opts.w || 1.8}" ${opts.dash ? `stroke-dasharray="${opts.dash}"` : ''} stroke-linecap="round"/>`;
	}
	// small arc marking an interior angle at vertex V between points P and Q
	function angleArc(V, P, Q, r, label, opts = {}) {
		const a1 = Math.atan2(P[1] - V[1], P[0] - V[0]);
		const a2 = Math.atan2(Q[1] - V[1], Q[0] - V[0]);
		let d = a2 - a1;
		while (d <= -Math.PI) d += 2 * Math.PI;
		while (d > Math.PI) d -= 2 * Math.PI;
		const sweep = d > 0 ? 1 : 0;
		const s = [V[0] + r * Math.cos(a1), V[1] + r * Math.sin(a1)];
		const e = [V[0] + r * Math.cos(a2), V[1] + r * Math.sin(a2)];
		let out = path(`M ${s[0]} ${s[1]} A ${r} ${r} 0 0 ${sweep} ${e[0]} ${e[1]}`, { stroke: opts.stroke || ACCENT, w: 1.5 });
		if (label) {
			const mid = a1 + d / 2;
			const lr = r + 14;
			out += text(V[0] + lr * Math.cos(mid), V[1] + lr * Math.sin(mid) + 5, label, { size: opts.size || 13, fill: opts.stroke || ACCENT });
		}
		return out;
	}
	function rightAngleMark(V, P, Q, size = 12) {
		const u = norm([P[0] - V[0], P[1] - V[1]]);
		const v = norm([Q[0] - V[0], Q[1] - V[1]]);
		const a = [V[0] + u[0] * size, V[1] + u[1] * size];
		const b = [V[0] + (u[0] + v[0]) * size, V[1] + (u[1] + v[1]) * size];
		const c = [V[0] + v[0] * size, V[1] + v[1] * size];
		return path(`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]}`, { w: 1.5 });
	}
	function norm(v) { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; }
	function midOut(A, B, C, dist) {
		// point offset outward from midpoint of AB away from C (for side labels)
		const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
		const dir = norm([m[0] - C[0], m[1] - C[1]]);
		return [m[0] + dir[0] * dist, m[1] + dir[1] * dist];
	}

	const R = {};

	// ---- right triangle: {angleDeg, angleAt:'A'|'B', base:'label', height:'label', hyp:'label', markRight:true} ----
	R.rightTriangle = function (s) {
		const W = 300, H = 220;
		const A = [50, 180], B = [250, 180], C = [250, 50]; // right angle at B
		let out = svgOpen(W, H);
		out += poly([A, B, C]);
		out += rightAngleMark(B, A, C);
		if (s.angleLabel) out += angleArc(A, B, C, 28, s.angleLabel);
		if (s.topAngleLabel) out += angleArc(C, A, B, 26, s.topAngleLabel);
		if (s.base) out += text((A[0] + B[0]) / 2, 200, s.base);
		if (s.height) out += text(272, 120, s.height);
		if (s.hyp) out += text(130, 105, s.hyp);
		if (s.labels) {
			out += text(A[0] - 12, A[1] + 6, s.labels[0] || '', { italic: true });
			out += text(B[0] + 12, B[1] + 6, s.labels[1] || '', { italic: true });
			out += text(C[0] + 12, C[1] - 6, s.labels[2] || '', { italic: true });
		}
		return out + '</svg>';
	};

	// ---- generic triangle from 3 side lengths (scaled): {a,b,c (lengths), labels:[A,B,C], sideLabels:[a,b,c], angleLabels:[..]} ----
	// side a opposite A, etc.
	R.triangle = function (s) {
		const W = 320, H = 240;
		const { a, b, c } = s; // lengths: a=BC, b=CA, c=AB
		// place A at origin, B along x axis at distance c
		const A0 = [0, 0], B0 = [c, 0];
		const cosA = (b * b + c * c - a * a) / (2 * b * c);
		const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
		const C0 = [b * cosA, -b * sinA];
		// scale + center
		const xs = [A0[0], B0[0], C0[0]], ys = [A0[1], B0[1], C0[1]];
		const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
		const sc = Math.min((W - 90) / (maxX - minX || 1), (H - 90) / (maxY - minY || 1));
		const ox = (W - (maxX - minX) * sc) / 2 - minX * sc;
		const oy = (H - (maxY - minY) * sc) / 2 - minY * sc;
		const T = (p) => [p[0] * sc + ox, p[1] * sc + oy];
		const A = T(A0), B = T(B0), C = T(C0);
		let out = svgOpen(W, H);
		out += poly([A, B, C]);
		const L = s.labels || ['A', 'B', 'C'];
		const vOut = (P, other1, other2) => {
			const d = norm([P[0] - (other1[0] + other2[0]) / 2, P[1] - (other1[1] + other2[1]) / 2]);
			return [P[0] + d[0] * 16, P[1] + d[1] * 16 + 5];
		};
		out += text(...vOut(A, B, C), L[0], { italic: true });
		out += text(...vOut(B, A, C), L[1], { italic: true });
		out += text(...vOut(C, A, B), L[2], { italic: true });
		if (s.sideLabels) {
			if (s.sideLabels[0]) { const p = midOut(B, C, A, 16); out += text(p[0], p[1] + 5, s.sideLabels[0]); }
			if (s.sideLabels[1]) { const p = midOut(A, C, B, 16); out += text(p[0], p[1] + 5, s.sideLabels[1]); }
			if (s.sideLabels[2]) { const p = midOut(A, B, C, 16); out += text(p[0], p[1] + 5, s.sideLabels[2]); }
		}
		if (s.angleLabels) {
			if (s.angleLabels[0]) out += angleArc(A, B, C, 24, s.angleLabels[0]);
			if (s.angleLabels[1]) out += angleArc(B, C, A, 24, s.angleLabels[1]);
			if (s.angleLabels[2]) out += angleArc(C, A, B, 24, s.angleLabels[2]);
		}
		return out + '</svg>';
	};

	// ---- elevation/depression: two observation angles to a tower {h:'label', d1:'', ang1, ang2} ----
	R.elevation = function (s) {
		const W = 340, H = 220;
		const base = [40, 190];
		const towerTop = [40, 40];
		const p1 = [s.far ? 300 : 220, 190];
		const p2 = [140, 190];
		let out = svgOpen(W, H);
		out += line(20, 190, 320, 190, { w: 1.2 });
		out += line(base[0], base[1], towerTop[0], towerTop[1], { w: 2.5 });
		out += line(towerTop[0], towerTop[1], p1[0], p1[1], { dash: '5 4', stroke: FAINT });
		out += line(towerTop[0], towerTop[1], p2[0], p2[1], { dash: '5 4', stroke: FAINT });
		out += rightAngleMark(base, towerTop, p1);
		out += angleArc(p1, towerTop, [p1[0] - 40, p1[1]], 30, s.ang1);
		out += angleArc(p2, towerTop, [p2[0] - 40, p2[1]], 24, s.ang2);
		out += text(24, 118, s.h || 'h');
		out += text(p2[0], 210, s.p2 || 'B');
		out += text(p1[0], 210, s.p1 || 'A');
		out += text(towerTop[0], 30, s.top || 'T');
		return out + '</svg>';
	};

	// ---- bearings: legs [{bearing (deg from N), dist, label}] starting at O ----
	R.bearings = function (s) {
		const W = 320, H = 280;
		const pts = [[0, 0]];
		let cur = [0, 0];
		for (const leg of s.legs) {
			const th = MG.degToRad(leg.bearing);
			cur = [cur[0] + Math.sin(th) * leg.dist, cur[1] - Math.cos(th) * leg.dist];
			pts.push(cur.slice());
		}
		const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
		const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
		const sc = Math.min((W - 110) / (maxX - minX || 1), (H - 110) / (maxY - minY || 1));
		const ox = (W - (maxX - minX) * sc) / 2 - minX * sc;
		const oy = (H - (maxY - minY) * sc) / 2 - minY * sc;
		const T = (p) => [p[0] * sc + ox, p[1] * sc + oy];
		let out = svgOpen(W, H);
		const P = pts.map(T);
		// north lines at each point except last
		for (let i = 0; i < P.length - 1; i++) {
			out += line(P[i][0], P[i][1], P[i][0], P[i][1] - 46, { dash: '4 4', stroke: FAINT, w: 1.3 });
			out += text(P[i][0], P[i][1] - 52, 'N', { size: 12, fill: FAINT });
		}
		for (let i = 0; i < P.length - 1; i++) {
			out += line(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], { w: 2 });
			const leg = s.legs[i];
			const m = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2];
			out += text(m[0] + 14, m[1] - 6, leg.label || '', { size: 13 });
			// bearing arc from north
			out += angleArc(P[i], [P[i][0], P[i][1] - 40], P[i + 1], 20, leg.bearingLabel || '', { size: 12 });
		}
		if (s.close) out += line(P[P.length - 1][0], P[P.length - 1][1], P[0][0], P[0][1], { dash: '5 4', stroke: ACCENT, w: 1.6 });
		const names = s.names || [];
		P.forEach((p, i) => { if (names[i]) out += text(p[0] - 12, p[1] + 14, names[i], { italic: true }); out += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${INK}"/>`; });
		return out + '</svg>';
	};

	// ---- parallel lines with transversal: {kind:'alternate'|'co-interior'|'corresponding', topLabel, bottomLabel} ----
	R.parallelLines = function (s) {
		const W = 320, H = 210;
		const y1 = 60, y2 = 150;
		let out = svgOpen(W, H);
		out += line(30, y1, 290, y1);
		out += line(30, y2, 290, y2);
		// arrows to mark parallel
		out += path(`M 150 ${y1 - 5} L 162 ${y1} L 150 ${y1 + 5}`, { w: 1.4 });
		out += path(`M 150 ${y2 - 5} L 162 ${y2} L 150 ${y2 + 5}`, { w: 1.4 });
		// transversal
		const t1 = [90, 20], t2 = [230, 190];
		out += line(t1[0], t1[1], t2[0], t2[1]);
		// intersection points
		const ix = (y) => t1[0] + (t2[0] - t1[0]) * (y - t1[1]) / (t2[1] - t1[1]);
		const I1 = [ix(y1), y1], I2 = [ix(y2), y2];
		// top angle: between east ray and downward transversal (interior, right side)
		out += angleArc(I1, [290, y1], t2, 22, s.topLabel || '');
		// bottom angle depends on the relationship being illustrated
		if (s.kind === 'co-interior') {
			// same side (east), interior: between east ray and upward transversal
			out += angleArc(I2, [290, y2], t1, 22, s.bottomLabel || '');
		} else if (s.kind === 'corresponding') {
			// same position as top angle: between east ray and downward transversal
			out += angleArc(I2, [290, y2], t2, 22, s.bottomLabel || '');
		} else {
			// alternate: opposite side (west), interior: between west ray and upward transversal
			out += angleArc(I2, [30, y2], t1, 22, s.bottomLabel || '');
		}
		return out + '</svg>';
	};

	// ---- similar triangles, DE parallel to BC inside triangle ABC: {AD,DB,DE,BC labels} ----
	R.similarParallel = function (s) {
		const W = 320, H = 240;
		const A = [160, 30], B = [50, 210], C = [290, 210];
		const t = s.t || 0.45; // fraction down
		const D = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
		const E = [A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t];
		let out = svgOpen(W, H);
		out += poly([A, B, C]);
		out += line(D[0], D[1], E[0], E[1], { stroke: ACCENT, w: 2 });
		out += text(A[0], A[1] - 8, 'A', { italic: true });
		out += text(B[0] - 14, B[1] + 6, 'B', { italic: true });
		out += text(C[0] + 14, C[1] + 6, 'C', { italic: true });
		out += text(D[0] - 16, D[1] + 4, 'D', { italic: true });
		out += text(E[0] + 16, E[1] + 4, 'E', { italic: true });
		if (s.AD) out += text((A[0] + D[0]) / 2 - 22, (A[1] + D[1]) / 2, s.AD, { size: 13 });
		if (s.DB) out += text((D[0] + B[0]) / 2 - 22, (D[1] + B[1]) / 2, s.DB, { size: 13 });
		if (s.DE) out += text((D[0] + E[0]) / 2, D[1] - 8, s.DE, { size: 13, fill: ACCENT });
		if (s.BC) out += text((B[0] + C[0]) / 2, B[1] + 20, s.BC, { size: 13 });
		return out + '</svg>';
	};

	// ---- circle theorems ----
	// angle at centre vs circumference: {centralLabel, circumLabel}
	R.angleAtCentre = function (s) {
		const W = 300, H = 260;
		const O = [150, 135], r = 100;
		const aA = MG.degToRad(s.aA ?? 210), aB = MG.degToRad(s.aB ?? 330), aP = MG.degToRad(s.aP ?? 90);
		const P = [O[0] + r * Math.cos(aP), O[1] - r * Math.sin(aP)];
		const A = [O[0] + r * Math.cos(aA), O[1] - r * Math.sin(aA)];
		const B = [O[0] + r * Math.cos(aB), O[1] - r * Math.sin(aB)];
		let out = svgOpen(W, H);
		out += circle(O[0], O[1], r);
		out += line(P[0], P[1], A[0], A[1]);
		out += line(P[0], P[1], B[0], B[1]);
		out += line(O[0], O[1], A[0], A[1], { stroke: ACCENT, w: 2 });
		out += line(O[0], O[1], B[0], B[1], { stroke: ACCENT, w: 2 });
		out += `<circle cx="${O[0]}" cy="${O[1]}" r="2.5" fill="${INK}"/>`;
		out += text(O[0] + 12, O[1] - 4, 'O', { italic: true });
		out += text(P[0], P[1] - 10, 'P', { italic: true });
		out += text(A[0] - 12, A[1] + 12, 'A', { italic: true });
		out += text(B[0] + 12, B[1] + 12, 'B', { italic: true });
		if (s.centralLabel) out += angleArc(O, A, B, 22, s.centralLabel, { stroke: ACCENT });
		if (s.circumLabel) out += angleArc(P, A, B, 26, s.circumLabel, { stroke: FAINT });
		return out + '</svg>';
	};

	// cyclic quadrilateral: {labels:[..4], angleLabels:[..4]}
	R.cyclicQuad = function (s) {
		const W = 300, H = 260;
		const O = [150, 130], r = 105;
		const angs = s.angs || [100, 170, 260, 340];
		const pts = angs.map((d) => [O[0] + r * Math.cos(MG.degToRad(d)), O[1] - r * Math.sin(MG.degToRad(d))]);
		let out = svgOpen(W, H);
		out += circle(O[0], O[1], r);
		out += poly(pts);
		const L = s.labels || ['A', 'B', 'C', 'D'];
		pts.forEach((p, i) => {
			const dir = norm([p[0] - O[0], p[1] - O[1]]);
			out += text(p[0] + dir[0] * 16, p[1] + dir[1] * 16 + 5, L[i], { italic: true });
		});
		(s.angleLabels || []).forEach((lab, i) => {
			if (!lab) return;
			const prev = pts[(i + 3) % 4], next = pts[(i + 1) % 4];
			out += angleArc(pts[i], prev, next, 20, lab);
		});
		return out + '</svg>';
	};

	// angles in the same segment: chord AB, P and Q on the major arc: {pLabel, qLabel}
	R.sameArc = function (s) {
		const W = 300, H = 260;
		const O = [150, 132], r = 102;
		const pt = (deg) => [O[0] + r * Math.cos(MG.degToRad(deg)), O[1] - r * Math.sin(MG.degToRad(deg))];
		const A = pt(215), B = pt(325), P = pt(75), Q = pt(125);
		let out = svgOpen(W, H);
		out += circle(O[0], O[1], r);
		out += line(A[0], A[1], B[0], B[1], { dash: '5 4', stroke: FAINT });
		out += line(P[0], P[1], A[0], A[1]);
		out += line(P[0], P[1], B[0], B[1]);
		out += line(Q[0], Q[1], A[0], A[1]);
		out += line(Q[0], Q[1], B[0], B[1]);
		out += text(A[0] - 12, A[1] + 14, 'A', { italic: true });
		out += text(B[0] + 12, B[1] + 14, 'B', { italic: true });
		out += text(P[0] + 10, P[1] - 8, 'P', { italic: true });
		out += text(Q[0] - 12, Q[1] - 8, 'Q', { italic: true });
		if (s.pLabel) out += angleArc(P, A, B, 24, s.pLabel);
		if (s.qLabel) out += angleArc(Q, A, B, 24, s.qLabel);
		return out + '</svg>';
	};

	// tangent to circle from external point: {angleLabel}
	R.tangentRadius = function (s) {
		const W = 320, H = 240;
		const O = [120, 120], r = 80;
		const aT = MG.degToRad(s.aT ?? -35);
		const T = [O[0] + r * Math.cos(aT), O[1] + r * Math.sin(aT)];
		// tangent direction perpendicular to OT
		const d = norm([-(T[1] - O[1]), T[0] - O[0]]);
		const P = [T[0] + d[0] * 120, T[1] + d[1] * 120];
		const Q = [T[0] - d[0] * 60, T[1] - d[1] * 60];
		let out = svgOpen(W, H);
		out += circle(O[0], O[1], r);
		out += line(Q[0], Q[1], P[0], P[1]);
		out += line(O[0], O[1], T[0], T[1], { stroke: ACCENT, w: 2 });
		out += line(O[0], O[1], P[0], P[1], { dash: '5 4', stroke: FAINT });
		out += rightAngleMark(T, O, P);
		out += `<circle cx="${O[0]}" cy="${O[1]}" r="2.5" fill="${INK}"/>`;
		out += text(O[0] - 12, O[1] - 6, 'O', { italic: true });
		out += text(T[0] + 4, T[1] + 18, 'T', { italic: true });
		out += text(P[0] + 10, P[1] + 6, 'P', { italic: true });
		if (s.angleLabel) out += angleArc(P, O, T, 30, s.angleLabel);
		return out + '</svg>';
	};

	// ---- Venn 2 sets: {aOnly,bOnly,both,neither,labelA,labelB} ----
	R.venn2 = function (s) {
		const W = 320, H = 220;
		let out = svgOpen(W, H);
		out += `<rect x="20" y="25" width="280" height="170" fill="none" stroke="${INK}" stroke-width="1.5" rx="8"/>`;
		out += circle(130, 110, 62, { fill: SHADE1 });
		out += circle(195, 110, 62, { fill: SHADE2 });
		out += text(100, 48, s.labelA || 'A', { italic: true });
		out += text(228, 48, s.labelB || 'B', { italic: true });
		if (s.aOnly !== undefined) out += text(100, 116, s.aOnly);
		if (s.both !== undefined) out += text(162, 116, s.both);
		if (s.bOnly !== undefined) out += text(226, 116, s.bOnly);
		if (s.neither !== undefined) out += text(282, 186, s.neither);
		return out + '</svg>';
	};

	// ---- Venn 3 sets ----
	R.venn3 = function (s) {
		const W = 340, H = 280;
		const cA = [135, 105], cB = [205, 105], cC = [170, 168], r = 62;
		let out = svgOpen(W, H);
		out += `<rect x="20" y="18" width="300" height="244" fill="none" stroke="${INK}" stroke-width="1.5" rx="8"/>`;
		out += circle(...cA, r, { fill: SHADE1 });
		out += circle(...cB, r, { fill: SHADE2 });
		out += circle(...cC, r, { fill: SHADE3 });
		out += text(90, 45, s.labelA || 'A', { italic: true });
		out += text(252, 45, s.labelB || 'B', { italic: true });
		out += text(170, 252, s.labelC || 'C', { italic: true });
		const v = s.v || {}; // {a,b,c,ab,ac,bc,abc,none}
		if (v.a !== undefined) out += text(108, 92, v.a);
		if (v.b !== undefined) out += text(232, 92, v.b);
		if (v.c !== undefined) out += text(170, 205, v.c);
		if (v.ab !== undefined) out += text(170, 88, v.ab);
		if (v.ac !== undefined) out += text(134, 148, v.ac);
		if (v.bc !== undefined) out += text(206, 148, v.bc);
		if (v.abc !== undefined) out += text(170, 128, v.abc);
		if (v.none !== undefined) out += text(296, 250, v.none);
		return out + '</svg>';
	};

	// ---- two-stage probability tree: {stage1:[{label,prob}], stage2:[[{label,prob}...]...]} ----
	R.tree2 = function (s) {
		const n1 = s.stage1.length;
		const totalLeaves = s.stage2.reduce((t, arr) => t + arr.length, 0);
		const H = Math.max(180, totalLeaves * 46 + 40);
		const W = 340;
		let out = svgOpen(W, H);
		const x0 = 30, x1 = 150, x2 = 285;
		let leafY = 30;
		const rootY = H / 2;
		let branchYs = [];
		// compute leaf positions grouped by branch
		const groups = s.stage2.map((arr) => {
			const ys = arr.map(() => { const y = leafY; leafY += 46; return y; });
			return ys;
		});
		groups.forEach((ys, i) => branchYs.push(ys.reduce((a, b) => a + b, 0) / ys.length));
		s.stage1.forEach((b, i) => {
			const y = branchYs[i];
			out += line(x0, rootY, x1, y, { w: 1.6 });
			out += text((x0 + x1) / 2 - 6, (rootY + y) / 2 - 7, b.prob, { size: 12, fill: ACCENT });
			out += text(x1 + 16, y + 4, b.label, { size: 13 });
			groups[i].forEach((ly, j) => {
				const b2 = s.stage2[i][j];
				out += line(x1 + 34, y, x2 - 30, ly, { w: 1.6 });
				out += text((x1 + x2) / 2 + 4, (y + ly) / 2 - 7, b2.prob, { size: 12, fill: ACCENT });
				out += text(x2 - 8, ly + 4, b2.label, { size: 13 });
			});
		});
		return out + '</svg>';
	};

	// ---- box plot: {min,q1,med,q3,max, lo, hi} (lo/hi axis bounds) ----
	R.boxplot = function (s) {
		const W = 360, H = 130;
		const lo = s.lo ?? Math.floor(s.min - 1), hi = s.hi ?? Math.ceil(s.max + 1);
		const X = (v) => 30 + (v - lo) / (hi - lo) * 300;
		const yMid = 55, boxT = 35, boxB = 75;
		let out = svgOpen(W, H);
		// axis
		out += line(30, 105, 330, 105, { w: 1.2 });
		const step = Math.max(1, Math.round((hi - lo) / 10));
		for (let v = lo; v <= hi; v += step) {
			out += line(X(v), 101, X(v), 109, { w: 1 });
			out += text(X(v), 124, v, { size: 11 });
		}
		out += line(X(s.min), yMid, X(s.q1), yMid);
		out += line(X(s.q3), yMid, X(s.max), yMid);
		out += line(X(s.min), boxT + 8, X(s.min), boxB - 8);
		out += line(X(s.max), boxT + 8, X(s.max), boxB - 8);
		out += `<rect x="${X(s.q1)}" y="${boxT}" width="${X(s.q3) - X(s.q1)}" height="${boxB - boxT}" fill="${LIGHT}" stroke="${INK}" stroke-width="1.8"/>`;
		out += line(X(s.med), boxT, X(s.med), boxB, { w: 2.2, stroke: ACCENT });
		return out + '</svg>';
	};

	// ---- normal curve: {mean, sd, shadeFromZ, shadeToZ, labels:true} ----
	R.normal = function (s) {
		const W = 360, H = 170;
		const X = (z) => 180 + z * 42;
		const Y = (z) => 130 - 100 * Math.exp(-z * z / 2);
		let d = `M ${X(-3.4)} ${Y(-3.4)}`;
		for (let z = -3.4; z <= 3.4; z += 0.1) d += ` L ${X(z)} ${Y(z)}`;
		let out = svgOpen(W, H);
		if (s.shadeFromZ !== undefined) {
			const a = s.shadeFromZ, b = s.shadeToZ ?? 3.4;
			let sd2 = `M ${X(a)} 130`;
			for (let z = a; z <= b; z += 0.05) sd2 += ` L ${X(z)} ${Y(z)}`;
			sd2 += ` L ${X(b)} 130 Z`;
			out += path(sd2, { fill: SHADE4, stroke: 'none', w: 0 });
		}
		out += path(d, { w: 2 });
		out += line(20, 130, 340, 130, { w: 1.2 });
		for (let z = -3; z <= 3; z++) {
			out += line(X(z), 127, X(z), 133, { w: 1 });
			const label = s.mean !== undefined ? MG.round(s.mean + z * s.sd, 2) : z;
			out += text(X(z), 148, label, { size: 10.5 });
		}
		return out + '</svg>';
	};

	// ---- function graph: {fns:[{fn: x=>y, color}], xmin,xmax,ymin,ymax, degreesAxis:bool, pois:[[x,y]]} ----
	R.graph = function (s) {
		const W = 360, H = 260;
		const pad = 34;
		const xmin = s.xmin, xmax = s.xmax, ymin = s.ymin, ymax = s.ymax;
		const X = (x) => pad + (x - xmin) / (xmax - xmin) * (W - 2 * pad);
		const Y = (y) => H - pad - (y - ymin) / (ymax - ymin) * (H - 2 * pad);
		let out = svgOpen(W, H);
		// optional light gridlines (for coordinate-graphing questions)
		if (s.grid) {
			const gxs = s.xstep || Math.ceil((xmax - xmin) / 8);
			const gys = s.ystep || Math.ceil((ymax - ymin) / 8);
			for (let x = Math.ceil(xmin / gxs) * gxs; x <= xmax; x += gxs)
				out += line(X(x), pad - 6, X(x), H - pad + 6, { stroke: SHADE2, w: 1 });
			for (let y = Math.ceil(ymin / gys) * gys; y <= ymax; y += gys)
				out += line(pad - 6, Y(y), W - pad + 6, Y(y), { stroke: SHADE2, w: 1 });
		}
		// axes
		const x0 = xmin <= 0 && xmax >= 0 ? X(0) : pad;
		const y0 = ymin <= 0 && ymax >= 0 ? Y(0) : H - pad;
		// Keep axes, ticks and their labels above curves and guide lines.
		let foreground = line(pad - 6, y0, W - pad + 6, y0, { w: 1.3 });
		foreground += line(x0, pad - 6, x0, H - pad + 6, { w: 1.3 });
		foreground += text(W - pad + 14, y0 + 4, 'x', { italic: true, size: 13 });
		foreground += text(x0, pad - 12, 'y', { italic: true, size: 13 });
		// ticks
		const xstep = s.xstep || Math.ceil((xmax - xmin) / 8);
		for (let x = Math.ceil(xmin / xstep) * xstep; x <= xmax; x += xstep) {
			if (Math.abs(x) < 1e-9) continue;
			foreground += line(X(x), y0 - 3, X(x), y0 + 3, { w: 1 });
			foreground += text(X(x), y0 + 16, s.degreesAxis ? x + 'Â°' : x, { size: 10.5 });
		}
		const ystep = s.ystep || Math.ceil((ymax - ymin) / 8);
		for (let y = Math.ceil(ymin / ystep) * ystep; y <= ymax; y += ystep) {
			if (Math.abs(y) < 1e-9) continue;
			foreground += line(x0 - 3, Y(y), x0 + 3, Y(y), { w: 1 });
			foreground += text(x0 - 14, Y(y) + 4, y, { size: 10.5 });
		}
		// dashed guide lines (asymptotes, boundaries): vlines [{x,label?}], hlines [{y,label?}]
		(s.vlines || []).forEach((v) => {
			out += line(X(v.x), pad - 6, X(v.x), H - pad + 6, { dash: '5 4', stroke: FAINT, w: 1.4 });
			if (v.label) out += text(X(v.x) + 16, pad + 8, v.label, { size: 10.5, fill: FAINT, italic: true });
		});
		(s.hlines || []).forEach((hl) => {
			out += line(pad - 6, Y(hl.y), W - pad + 6, Y(hl.y), { dash: '5 4', stroke: FAINT, w: 1.4 });
			if (hl.label) out += text(W - pad - 10, Y(hl.y) - 7, hl.label, { size: 10.5, fill: FAINT, italic: true });
		});
		(s.fns || []).forEach((f) => {
			let d = '', started = false;
			const n = 240;
			for (let i = 0; i <= n; i++) {
				const x = xmin + (xmax - xmin) * i / n;
				const y = f.fn(x);
				if (!isFinite(y) || y < ymin - (ymax - ymin) || y > ymax + (ymax - ymin)) { started = false; continue; }
				const px = X(x), py = Y(Math.max(ymin - 1, Math.min(ymax + 1, y)));
				d += started ? ` L ${px.toFixed(1)} ${py.toFixed(1)}` : `M ${px.toFixed(1)} ${py.toFixed(1)}`;
				started = true;
			}
			out += path(d, { stroke: f.color || ACCENT, w: 2.2 });
		});
		out += foreground;
		(s.circles || []).forEach((c) => {
			// circle in graph coordinates (assumes roughly equal axis scaling)
			const rx = Math.abs(X(c.c[0] + c.r) - X(c.c[0]));
			const ry = Math.abs(Y(c.c[1] + c.r) - Y(c.c[1]));
			out += `<ellipse cx="${X(c.c[0]).toFixed(1)}" cy="${Y(c.c[1]).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="none" stroke="${c.color || ACCENT}" stroke-width="2"/>`;
			if (c.mark) out += `<circle cx="${X(c.c[0])}" cy="${Y(c.c[1])}" r="2.5" fill="${INK}"/>`;
		});
		(s.points || []).forEach((p) => {
			out += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.5" fill="${INK}"/>`;
			if (p[2]) out += text(X(p[0]) + (p[3] === 'left' ? -14 : 14), Y(p[1]) - 8, p[2], { italic: true, size: 13 });
		});
		(s.pois || []).forEach((p) => {
			out += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.5" fill="${ACCENT}"/>`;
		});
		// open/closed endpoint dots: [{at:[x,y], open:true}]
		(s.endpoints || []).forEach((p) => {
			out += `<circle cx="${X(p.at[0]).toFixed(1)}" cy="${Y(p.at[1]).toFixed(1)}" r="4" fill="${p.open ? 'var(--dg-bg, #ffffff)' : INK}" stroke="${INK}" stroke-width="1.6"/>`;
		});
		// free text at graph coordinates: [{at:[x,y], text, accent}]
		(s.flabels || []).forEach((t) => {
			out += text(X(t.at[0]), Y(t.at[1]), t.text, { size: 12, italic: true, fill: t.accent ? ACCENT : INK });
		});
		return out + '</svg>';
	};

	// ---- circle sector: {angle (deg, given), rLabel, angleLabel, segment:bool, chordLabel, arcLabel, showCircle:bool, centreLabel} ----
	R.sector = function (s) {
		const W = 300, H = 235;
		const O = [150, 128], R0 = 90;
		const ang = Math.max(15, Math.min(340, s.angle || 70)) * Math.PI / 180;
		const a1 = -Math.PI / 2 - ang / 2, a2 = -Math.PI / 2 + ang / 2;
		const P = [O[0] + R0 * Math.cos(a1), O[1] + R0 * Math.sin(a1)];
		const Q = [O[0] + R0 * Math.cos(a2), O[1] + R0 * Math.sin(a2)];
		const large = ang > Math.PI ? 1 : 0;
		let out = svgOpen(W, H);
		if (s.showCircle) out += circle(O[0], O[1], R0, { stroke: FAINT, w: 1.2, dash: '4 4' });
		out += path(`M ${O[0]} ${O[1]} L ${P[0]} ${P[1]} A ${R0} ${R0} 0 ${large} 1 ${Q[0]} ${Q[1]} Z`, { fill: s.segment ? 'none' : SHADE1 });
		if (s.segment) out += path(`M ${P[0]} ${P[1]} A ${R0} ${R0} 0 ${large} 1 ${Q[0]} ${Q[1]} L ${P[0]} ${P[1]} Z`, { fill: SHADE2, stroke: 'none' });
		if (s.segment || s.chordLabel) out += line(P[0], P[1], Q[0], Q[1], { stroke: ACCENT, w: 1.6 });
		out += circle(O[0], O[1], 2.4, { fill: INK, w: 0.1 });
		if (s.angleLabel) out += angleArc(O, P, Q, 22, s.angleLabel);
		out += text(O[0], O[1] + 18, s.centreLabel || 'O');
		if (s.rLabel) { const m = [(O[0] + P[0]) / 2, (O[1] + P[1]) / 2]; out += text(m[0] - 16, m[1], s.rLabel); }
		if (s.chordLabel) out += text((P[0] + Q[0]) / 2, Math.min(P[1], Q[1]) + 18, s.chordLabel, { fill: ACCENT });
		if (s.arcLabel) out += text(O[0], O[1] - R0 - 8, s.arcLabel);
		return out + '</svg>';
	};

	// ---- cuboid (oblique): {lLabel,wLabel,hLabel, diagonal:bool, baseDiagonal:bool, diagLabel, angleLabel, labels:[A,B,C,D,A',B',C',D'] front bottom-left/bottom-right/top-right/top-left then back} ----
	R.cuboid = function (s) {
		const W = 330, H = 235;
		const dx = 62, dy = -42;
		const A = [58, 195], B = [206, 195], C = [206, 108], D = [58, 108];
		const A2 = [A[0] + dx, A[1] + dy], B2 = [B[0] + dx, B[1] + dy], C2 = [C[0] + dx, C[1] + dy], D2 = [D[0] + dx, D[1] + dy];
		let out = svgOpen(W, H);
		out += line(A[0], A[1], A2[0], A2[1], { dash: '4 4', stroke: FAINT, w: 1.3 });
		out += line(A2[0], A2[1], B2[0], B2[1], { dash: '4 4', stroke: FAINT, w: 1.3 });
		out += line(A2[0], A2[1], D2[0], D2[1], { dash: '4 4', stroke: FAINT, w: 1.3 });
		out += poly([A, B, C, D]);
		out += line(B[0], B[1], B2[0], B2[1]);
		out += line(C[0], C[1], C2[0], C2[1]);
		out += line(D[0], D[1], D2[0], D2[1]);
		out += line(B2[0], B2[1], C2[0], C2[1]);
		out += line(C2[0], C2[1], D2[0], D2[1]);
		if (s.baseDiagonal || s.diagonal) {
			if (s.baseDiagonal) out += line(A[0], A[1], B2[0], B2[1], { dash: '4 4', stroke: FAINT, w: 1.4 });
			if (s.diagonal) {
				out += line(A[0], A[1], C2[0], C2[1], { dash: '6 4', stroke: ACCENT, w: 2 });
				if (s.diagLabel) out += text((A[0] + C2[0]) / 2 - 16, (A[1] + C2[1]) / 2 - 6, s.diagLabel, { fill: ACCENT });
				if (s.angleLabel && s.baseDiagonal) out += angleArc(A, B2, C2, 34, s.angleLabel);
			}
		}
		if (s.lLabel) out += text((A[0] + B[0]) / 2, A[1] + 18, s.lLabel);
		if (s.wLabel) out += text(B[0] + dx / 2 + 20, B[1] + dy / 2 + 10, s.wLabel);
		if (s.hLabel) out += text(A[0] - 18, (A[1] + D[1]) / 2 + 4, s.hLabel);
		if (s.labels) {
			const vs = [A, B, C, D, A2, B2, C2, D2];
			const offs = [[-11, 14], [11, 14], [12, -7], [-12, -7], [-11, 12], [14, 12], [13, -7], [-4, -9]];
			s.labels.forEach((t, i) => { if (t && vs[i]) out += text(vs[i][0] + offs[i][0], vs[i][1] + offs[i][1], t, { italic: true }); });
		}
		return out + '</svg>';
	};

	// ---- square pyramid: {baseLabel, heightLabel, slantLabel, edgeLabel, apexLabel} ----
	R.pyramid = function (s) {
		const W = 300, H = 235;
		const FL = [64, 196], FR = [226, 196], BR = [272, 154], BL = [110, 154], T = [168, 42];
		const Cb = [(FL[0] + BR[0]) / 2, (FL[1] + BR[1]) / 2];
		const Mf = [(FL[0] + FR[0]) / 2, (FL[1] + FR[1]) / 2];
		let out = svgOpen(W, H);
		out += line(BL[0], BL[1], BR[0], BR[1], { dash: '4 4', stroke: FAINT, w: 1.3 });
		out += line(BL[0], BL[1], FL[0], FL[1], { dash: '4 4', stroke: FAINT, w: 1.3 });
		out += line(T[0], T[1], BL[0], BL[1], { dash: '4 4', stroke: FAINT, w: 1.3 });
		out += line(FL[0], FL[1], FR[0], FR[1]);
		out += line(FR[0], FR[1], BR[0], BR[1]);
		out += line(T[0], T[1], FL[0], FL[1]);
		out += line(T[0], T[1], FR[0], FR[1]);
		out += line(T[0], T[1], BR[0], BR[1]);
		if (s.heightLabel) {
			out += line(T[0], T[1], Cb[0], Cb[1], { dash: '5 4', stroke: ACCENT, w: 1.6 });
			out += circle(Cb[0], Cb[1], 2, { fill: ACCENT, w: 0.1 });
			out += text((T[0] + Cb[0]) / 2 + 16, (T[1] + Cb[1]) / 2, s.heightLabel, { fill: ACCENT });
		}
		if (s.slantLabel) {
			out += line(T[0], T[1], Mf[0], Mf[1], { dash: '5 4', stroke: ACCENT, w: 1.6 });
			out += text((T[0] + Mf[0]) / 2 - 16, (T[1] + Mf[1]) / 2, s.slantLabel, { fill: ACCENT });
		}
		if (s.edgeLabel) out += text((T[0] + FR[0]) / 2 + 18, (T[1] + FR[1]) / 2, s.edgeLabel);
		if (s.baseLabel) out += text(Mf[0], Mf[1] + 18, s.baseLabel);
		if (s.apexLabel) out += text(T[0], T[1] - 10, s.apexLabel, { italic: true });
		return out + '</svg>';
	};

	// ---- cone: {rLabel,hLabel,slantLabel, inverted:bool, fillFrac (0..1, water level), fillLabel, frustumFrac (0..1 top-cut => frustum), topRLabel} ----
	R.cone = function (s) {
		const W = 280, H = 235;
		const cx = 140, rx = 92, ry = 17;
		const apexY = s.inverted ? 200 : 38, baseY = s.inverted ? 52 : 196;
		let out = svgOpen(W, H);
		const baseArcs = () => {
			let o = path(`M ${cx - rx} ${baseY} A ${rx} ${ry} 0 0 ${s.inverted ? 1 : 0} ${cx + rx} ${baseY}`);
			o += path(`M ${cx - rx} ${baseY} A ${rx} ${ry} 0 0 ${s.inverted ? 0 : 1} ${cx + rx} ${baseY}`, { dash: '4 4', stroke: FAINT, w: 1.3 });
			return o;
		};
		out += baseArcs();
		if (s.frustumFrac) {
			const k = Math.max(0.25, Math.min(0.85, s.frustumFrac));
			const trx = rx * k, tryy = ry * k, ty = apexY + (baseY - apexY) * k;
			out += line(cx - rx, baseY, cx - trx, ty);
			out += line(cx + rx, baseY, cx + trx, ty);
			out += `<ellipse cx="${cx}" cy="${ty}" rx="${trx}" ry="${tryy}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
			out += line(cx - trx, ty, cx, apexY, { dash: '4 4', stroke: FAINT, w: 1.3 });
			out += line(cx + trx, ty, cx, apexY, { dash: '4 4', stroke: FAINT, w: 1.3 });
			if (s.topRLabel) { out += line(cx, ty, cx + trx, ty, { stroke: ACCENT, w: 1.5 }); out += text(cx + trx / 2, ty - 7, s.topRLabel, { fill: ACCENT }); }
		} else {
			out += line(cx - rx, baseY, cx, apexY);
			out += line(cx + rx, baseY, cx, apexY);
		}
		if (s.fillFrac) {
			const f = Math.max(0.15, Math.min(0.9, s.fillFrac));
			const wy = apexY + (baseY - apexY) * f, wrx = rx * f, wry = ry * f;
			out += `<ellipse cx="${cx}" cy="${wy}" rx="${wrx}" ry="${wry}" fill="${SHADE2}" stroke="${ACCENT}" stroke-width="1.5"/>`;
			if (s.fillLabel) out += text(cx, wy - 10, s.fillLabel, { fill: ACCENT, size: 12 });
		}
		if (s.hLabel) {
			out += line(cx, apexY, cx, baseY, { dash: '5 4', stroke: ACCENT, w: 1.5 });
			out += text(cx + 16, (apexY + baseY) / 2, s.hLabel, { fill: ACCENT });
		}
		if (s.rLabel) { out += line(cx, baseY, cx + rx, baseY, { stroke: INK, w: 1.5 }); out += text(cx + rx / 2, baseY - 7, s.rLabel); }
		if (s.slantLabel) out += text((cx - rx + cx) / 2 - 16, (baseY + apexY) / 2, s.slantLabel);
		return out + '</svg>';
	};

	// ---- cylinder: {rLabel,hLabel, domeTop:bool (silo)} ----
	R.cylinder = function (s) {
		const W = 260, H = 235;
		const cx = 130, rx = 70, ry = 15, bot = 200;
		const top = s.domeTop ? 110 : 62;
		let out = svgOpen(W, H);
		out += line(cx - rx, top, cx - rx, bot);
		out += line(cx + rx, top, cx + rx, bot);
		out += path(`M ${cx - rx} ${bot} A ${rx} ${ry} 0 0 0 ${cx + rx} ${bot}`);
		out += path(`M ${cx - rx} ${bot} A ${rx} ${ry} 0 0 1 ${cx + rx} ${bot}`, { dash: '4 4', stroke: FAINT, w: 1.3 });
		if (s.domeTop) {
			out += path(`M ${cx - rx} ${top} A ${rx} ${rx * 0.82} 0 0 1 ${cx + rx} ${top}`);
			out += path(`M ${cx - rx} ${top} A ${rx} ${ry} 0 0 0 ${cx + rx} ${top}`, { dash: '4 4', stroke: FAINT, w: 1.3 });
		} else {
			out += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
		}
		out += line(cx, top, cx + rx, top, { stroke: ACCENT, w: 1.5 });
		out += circle(cx, top, 2, { fill: INK, w: 0.1 });
		if (s.rLabel) out += text(cx + rx / 2, top - 8, s.rLabel, { fill: ACCENT });
		if (s.hLabel) out += text(cx - rx - 20, (top + bot) / 2 + 4, s.hLabel);
		return out + '</svg>';
	};

	// ---- generic quadrilateral from math coords (y up): {pts:[[x,y]*4] in order A,B,C,D; labels, sideLabels:[AB,BC,CD,DA], angleLabels, diagonals:'AC'|'BD'|'both', diagLabels:[AC,BD], rightAngles:[vertex indices]} ----
	R.quad = function (s) {
		const W = 320, H = 240;
		const P0 = s.pts;
		const xs = P0.map((p) => p[0]), ys = P0.map((p) => p[1]);
		const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
		const sc = Math.min((W - 96) / (maxX - minX || 1), (H - 96) / (maxY - minY || 1));
		const mx = (W - (maxX - minX) * sc) / 2, my = (H - (maxY - minY) * sc) / 2;
		const T = (p) => [mx + (p[0] - minX) * sc, H - my - (p[1] - minY) * sc];
		const P = P0.map(T);
		const G = [P.reduce((a, p) => a + p[0], 0) / 4, P.reduce((a, p) => a + p[1], 0) / 4];
		let out = svgOpen(W, H);
		out += poly(P, { fill: SHADE1 });
		if (s.diagonals === 'AC' || s.diagonals === 'both') {
			out += line(P[0][0], P[0][1], P[2][0], P[2][1], { dash: '5 4', stroke: ACCENT, w: 1.5 });
			if (s.diagLabels && s.diagLabels[0]) out += text((P[0][0] + P[2][0]) / 2 + 12, (P[0][1] + P[2][1]) / 2 - 6, s.diagLabels[0], { fill: ACCENT });
		}
		if (s.diagonals === 'BD' || s.diagonals === 'both') {
			out += line(P[1][0], P[1][1], P[3][0], P[3][1], { dash: '5 4', stroke: ACCENT, w: 1.5 });
			if (s.diagLabels && s.diagLabels[1]) out += text((P[1][0] + P[3][0]) / 2 - 12, (P[1][1] + P[3][1]) / 2 - 6, s.diagLabels[1], { fill: ACCENT });
		}
		const L = s.labels || ['A', 'B', 'C', 'D'];
		P.forEach((p, i) => {
			const d = norm([p[0] - G[0], p[1] - G[1]]);
			out += text(p[0] + d[0] * 15, p[1] + d[1] * 15 + 5, L[i] || '', { italic: true });
		});
		if (s.sideLabels) {
			for (let i = 0; i < 4; i++) {
				if (!s.sideLabels[i]) continue;
				const A = P[i], B = P[(i + 1) % 4];
				const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
				const d = norm([m[0] - G[0], m[1] - G[1]]);
				out += text(m[0] + d[0] * 17, m[1] + d[1] * 17 + 5, s.sideLabels[i]);
			}
		}
		if (s.angleLabels) {
			for (let i = 0; i < 4; i++) {
				if (!s.angleLabels[i]) continue;
				out += angleArc(P[i], P[(i + 3) % 4], P[(i + 1) % 4], 20, s.angleLabels[i]);
			}
		}
		(s.rightAngles || []).forEach((i) => { out += rightAngleMark(P[i], P[(i + 3) % 4], P[(i + 1) % 4]); });
		return out + '</svg>';
	};

	// ---- regular polygon: {n, inscribed:bool, sideLabel, radiusLabel, centralAngleLabel, interiorAngleLabel, centreLabel} ----
	R.polygon = function (s) {
		const W = 280, H = 240;
		const O = [140, 126], R0 = 92, n = Math.max(3, Math.min(12, s.n || 6));
		const pts = [];
		for (let i = 0; i < n; i++) {
			const a = -Math.PI / 2 + i * 2 * Math.PI / n;
			pts.push([O[0] + R0 * Math.cos(a), O[1] + R0 * Math.sin(a)]);
		}
		let out = svgOpen(W, H);
		if (s.inscribed) out += circle(O[0], O[1], R0, { stroke: FAINT, w: 1.3 });
		out += poly(pts, { fill: SHADE1 });
		if (s.radiusLabel || s.centralAngleLabel) {
			out += line(O[0], O[1], pts[0][0], pts[0][1], { stroke: ACCENT, w: 1.5 });
			out += line(O[0], O[1], pts[1][0], pts[1][1], { stroke: ACCENT, w: 1.5 });
			out += circle(O[0], O[1], 2.2, { fill: INK, w: 0.1 });
			if (s.centreLabel !== '') out += text(O[0] - 12, O[1] + 14, s.centreLabel || 'O');
			if (s.radiusLabel) out += text((O[0] + pts[0][0]) / 2 - 14, (O[1] + pts[0][1]) / 2, s.radiusLabel, { fill: ACCENT });
			if (s.centralAngleLabel) out += angleArc(O, pts[0], pts[1], 20, s.centralAngleLabel);
		}
		if (s.interiorAngleLabel) out += angleArc(pts[1], pts[0], pts[2], 18, s.interiorAngleLabel);
		if (s.sideLabel) {
			const m = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
			const d = norm([m[0] - O[0], m[1] - O[1]]);
			out += text(m[0] + d[0] * 17, m[1] + d[1] * 17 + 4, s.sideLabel);
		}
		return out + '</svg>';
	};

	// ---- two circles: {r1, r2 (relative sizes), touch:'external'|'internal', gap:bool, r1Label, r2Label, labels:['A','B'], distLabel, tangentLine:bool} ----
	R.circles2 = function (s) {
		const W = 340, H = 210;
		const r1 = s.r1 || 1, r2 = s.r2 || 1;
		const dRel = s.touch === 'internal' ? Math.abs(r1 - r2) : s.touch === 'external' ? r1 + r2 : (r1 + r2) * 1.25;
		const sc = (W - 70) / (r1 + dRel + r2);
		const R1 = r1 * sc, R2 = r2 * sc;
		const cy = 102;
		const c1 = [35 + R1, cy], c2 = [c1[0] + dRel * sc, cy];
		let out = svgOpen(W, H);
		out += circle(c1[0], c1[1], R1);
		out += circle(c2[0], c2[1], R2);
		out += circle(c1[0], c1[1], 2.2, { fill: INK, w: 0.1 });
		out += circle(c2[0], c2[1], 2.2, { fill: INK, w: 0.1 });
		const L = s.labels || ['A', 'B'];
		out += text(c1[0], c1[1] + 16, L[0]);
		out += text(c2[0], c2[1] + 16, L[1]);
		out += line(c1[0], c1[1], c2[0], c2[1], { dash: '5 4', stroke: FAINT, w: 1.3 });
		if (s.distLabel) out += text((c1[0] + c2[0]) / 2, cy - 8, s.distLabel);
		if (s.r1Label) { out += line(c1[0], c1[1], c1[0] - R1 * 0.71, c1[1] - R1 * 0.71, { stroke: ACCENT, w: 1.5 }); out += text(c1[0] - R1 * 0.45, c1[1] - R1 * 0.45 - 8, s.r1Label, { fill: ACCENT }); }
		if (s.r2Label) { out += line(c2[0], c2[1], c2[0] + R2 * 0.71, c2[1] - R2 * 0.71, { stroke: ACCENT, w: 1.5 }); out += text(c2[0] + R2 * 0.45 + 4, c2[1] - R2 * 0.45 - 8, s.r2Label, { fill: ACCENT }); }
		if (s.tangentLine) { const ty = cy + Math.max(R1, R2); out += line(c1[0] - R1 - 14, ty, c2[0] + R2 + 14, ty, { stroke: ACCENT, w: 1.5 }); }
		return out + '</svg>';
	};

	// ---- two similar triangles side by side: {a,b,c (shape), k (visual scale of second, capped), labels1, labels2, sideLabels1:[a,b,c], sideLabels2:[a,b,c]} ----
	R.similarTriangles = function (s) {
		const W = 360, H = 210;
		const { a, b, c } = s;
		const k = Math.max(1.15, Math.min(1.8, s.k || 1.4));
		const cosA = (b * b + c * c - a * a) / (2 * b * c);
		const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
		const base = [[0, 0], [c, 0], [b * cosA, -b * sinA]];
		const draw = (sc, ox, oy, labels, sideLabels) => {
			const P = base.map((p) => [p[0] * sc + ox, p[1] * sc + oy]);
			let o = poly(P, { fill: SHADE1 });
			const G = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
			(labels || []).forEach((t, i) => {
				if (!t) return;
				const d = norm([P[i][0] - G[0], P[i][1] - G[1]]);
				o += text(P[i][0] + d[0] * 13, P[i][1] + d[1] * 13 + 4, t, { italic: true, size: 12 });
			});
			if (sideLabels) {
				const pairs = [[1, 2, 0], [0, 2, 1], [0, 1, 2]];
				sideLabels.forEach((t, i) => {
					if (!t) return;
					const [u, v, w] = pairs[i];
					const p = midOut(P[u], P[v], P[w], 13);
					o += text(p[0], p[1] + 4, t, { size: 12 });
				});
			}
			return o;
		};
		const maxX = Math.max(...base.map((p) => p[0])), minX = Math.min(...base.map((p) => p[0]));
		const hgt = Math.max(...base.map((p) => -p[1]));
		const sc1 = Math.min(120 / (maxX - minX || 1), 130 / (hgt || 1));
		const sc2 = sc1 * k;
		let out = svgOpen(W, H);
		out += draw(sc1, 22 - minX * sc1, 168, s.labels1 || ['A', 'B', 'C'], s.sideLabels1);
		out += draw(sc2, 175 - minX * sc2, 185, s.labels2 || ['P', 'Q', 'R'], s.sideLabels2);
		return out + '</svg>';
	};

	// ---- generic 3D wireframe (oblique projection) for worksheet-style solids ----
	// spec: {
	//   verts: { A:[x,y,z], ... }            world coords: x right, y depth (into page), z up
	//   edges: [ ['A','B'], ['B','C',{dash:true}], ['A','T',{accent:true,label:'h'}] ]
	//   An edge's labelOffset:[dx,dy] overrides its midpoint label position in SVG pixels.
	//   faces: [ ['A','B','C'] ]             optional lightly shaded faces (drawn first)
	//   angles: [ {at:'B', from:'A', to:'C', label:'&theta;', r:18} ]
	//   rightAngles: [ {at:'M', from:'T', to:'A', size:10} ]
	//   labels: false | { A:'A&prime;' }     vertex labels; defaults to the vertex keys
	// }
	// Hidden edges are NOT auto-detected: pass dash:true for them, as on the worksheets.
	R.solid3d = function (s) {
		const W = s.width || 340, H = s.height || 260, pad = s.pad || 34;
		const ky = 0.48, kz = 0.32; // oblique depth factors
		const proj = {};
		for (const k in s.verts) {
			const [x, y, z] = s.verts[k];
			proj[k] = [x + ky * y, -z - kz * y];
		}
		let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
		for (const k in proj) {
			minx = Math.min(minx, proj[k][0]); maxx = Math.max(maxx, proj[k][0]);
			miny = Math.min(miny, proj[k][1]); maxy = Math.max(maxy, proj[k][1]);
		}
		const sc = Math.min((W - 2 * pad) / Math.max(1e-9, maxx - minx), (H - 2 * pad) / Math.max(1e-9, maxy - miny));
		const ox = pad + (W - 2 * pad - (maxx - minx) * sc) / 2, oy = pad + (H - 2 * pad - (maxy - miny) * sc) / 2;
		const P = {};
		for (const k in proj) P[k] = [ox + (proj[k][0] - minx) * sc, oy + (proj[k][1] - miny) * sc];
		const cen = [0, 0]; let n = 0;
		for (const k in P) { cen[0] += P[k][0]; cen[1] += P[k][1]; n++; }
		cen[0] /= n; cen[1] /= n;
		let out = svgOpen(W, H);
		let edgeLabels = '';
		(s.faces || []).forEach((f) => { out += poly(f.map((k) => P[k]), { fill: SHADE1, stroke: 'none' }); });
		(s.edges || []).forEach((e) => {
			const a = e[0], b = e[1], o = e[2] || {};
			out += line(P[a][0], P[a][1], P[b][0], P[b][1], {
				dash: o.dash ? '5 4' : undefined,
				stroke: o.accent ? ACCENT : o.faint ? FAINT : INK,
				w: o.w || (o.dash ? 1.4 : 1.8),
			});
			if (o.label) {
				// offset perpendicular to the edge, on the side away from the centroid
				const mx = (P[a][0] + P[b][0]) / 2, my = (P[a][1] + P[b][1]) / 2;
				const dx = P[b][0] - P[a][0], dy = P[b][1] - P[a][1], L = Math.hypot(dx, dy) || 1;
				let px = -dy / L, py = dx / L;
				if ((mx + px - cen[0]) ** 2 + (my + py - cen[1]) ** 2 < (mx - px - cen[0]) ** 2 + (my - py - cen[1]) ** 2) { px = -px; py = -py; }
				const offset = o.labelOffset || [px * 13, py * 13 + 4];
				edgeLabels += text(mx + offset[0], my + offset[1], o.label, { size: 12.5, italic: true });
			}
		});
		(s.rightAngles || []).forEach((ra) => { out += rightAngleMark(P[ra.at], P[ra.from], P[ra.to], ra.size || 10); });
		(s.angles || []).forEach((an) => { out += angleArc(P[an.at], P[an.from], P[an.to], an.r || 18, an.label || ''); });
		out += edgeLabels;
		if (s.labels !== false) {
			for (const k in P) {
				const lbl = (s.labels && s.labels[k]) || k;
				const dir = norm([P[k][0] - cen[0], P[k][1] - cen[1]]);
				out += text(P[k][0] + dir[0] * 15, P[k][1] + dir[1] * 15 + 4, lbl, { italic: true, size: 13.5 });
			}
		}
		return out + '</svg>';
	};

	// Neutral ordered sample space. Repeated categories must have distinct physical labels.
	R.sampleSpace = function (s) {
		const W = 360, H = 330, left = 62, bottom = 266;
		const dx = 250 / s.xLabels.length, dy = 224 / s.yLabels.length;
		let out = svgOpen(W, H) + '<title>Ordered sample space; each dot is one equally likely outcome</title>';
		out += line(left - 12, 24, left - 12, bottom + 12);
		out += line(left - 12, bottom + 12, 326, bottom + 12);
		s.xLabels.forEach((label, i) => { out += text(left + (i + .5) * dx, 297, label, { size: 11 }); });
		s.yLabels.forEach((label, j) => {
			const y = bottom - (j + .5) * dy;
			out += text(left - 20, y + 4, label, { size: 11, anchor: 'end' });
			s.xLabels.forEach((_, i) => {
				if (!s.excludeDiagonal || i !== j) out += circle(left + (i + .5) * dx, y, 2.6, { fill: INK, w: 1 });
			});
		});
		out += text(192, 320, s.xTitle || 'First outcome', { size: 12 });
		out += text(180, 18, s.yTitle || 'Rows: second outcome', { size: 12 });
		return out + '</svg>';
	};

	// Discrete bars with given weights/frequencies, not necessarily normalised probabilities.
	R.discreteBars = function (s) {
		const W = 360, H = 255, ymax = Math.max(...s.heights), step = 272 / s.labels.length;
		let out = svgOpen(W, H) + '<title>Discrete distribution weights</title>';
		for (let i = 0; i <= 4; i++) {
			const y = 207 - 160 * i / 4;
			out += line(52, y, 330, y, { stroke: LIGHT, w: 1 });
			out += text(42, y + 4, MG.round(ymax * i / 4, 2), { size: 11, anchor: 'end' });
		}
		s.labels.forEach((label, i) => {
			const h = 160 * s.heights[i] / ymax, x = 55 + step * i;
			out += `<rect x="${x + step * .18}" y="${207 - h}" width="${step * .64}" height="${h}" fill="${SHADE3}" stroke="${INK}"/>`;
			out += text(x + step / 2, 200 - h, s.heights[i], { size: 11 });
			out += text(x + step / 2, 226, label, { size: 12 });
		});
		out += text(180, 24, s.yTitle || 'Weight', { size: 12 });
		out += text(190, 248, 'Value of X', { size: 12 });
		return out + '</svg>';
	};

	MG.diagram = function (spec) {
		const r = R[spec.type];
		if (!r) return '';
		return r(spec);
	};
})();
