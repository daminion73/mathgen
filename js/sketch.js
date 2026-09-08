// Grade polylines in SVG plot units, independent of pointer speed and axis scale.
window.MG = window.MG || {};
MG.scoreSketch = function (a, strokes) {
	const width = 292, height = 192;
	const point = ([x, y]) => [(x - a.xmin) / (a.xmax - a.xmin) * width, (y - a.ymin) / (a.ymax - a.ymin) * height];
	const distance = (p, u, v) => {
		const dx = v[0] - u[0], dy = v[1] - u[1];
		const t = Math.max(0, Math.min(1, ((p[0] - u[0]) * dx + (p[1] - u[1]) * dy) / (dx * dx + dy * dy || 1)));
		return Math.hypot(p[0] - u[0] - t * dx, p[1] - u[1] - t * dy);
	};
	const segments = paths => paths.flatMap(path => path.slice(1).map((p, i) => [path[i], p]));
	// Sample by visible line length, not number or spacing of pointer events.
	const samples = lines => lines.flatMap(([u, v]) => {
		const length = Math.hypot(v[0] - u[0], v[1] - u[1]);
		const n = Math.max(1, Math.ceil(length / 2));
		return Array.from({ length: n }, (_, i) => ({ p: [u[0] + (v[0] - u[0]) * (i + .5) / n, u[1] + (v[1] - u[1]) * (i + .5) / n], weight: length / n }));
	});
	const drawn = segments(strokes.map(s => s.map(point)));
	const ink = samples(drawn);
	if (ink.reduce((s, p) => s + p.weight, 0) < 8) return null;
	const near = (p, lines, tolerance) => lines.some(([u, v]) => distance(p, u, v) <= tolerance);
	const fraction = (points, lines, tolerance) => {
		let hit = 0, total = 0;
		for (const { p, weight } of points) { total += weight; if (near(p, lines, tolerance)) hit += weight; }
		return total ? hit / total : 0;
	};
	// Split at poles and at every off-screen/domain gap. Never join separate branches.
	const branches = [];
	let branch = [], previous = null;
	const flush = () => {
		// A curve merely touching the viewport edge is a point, not a drawable branch.
		if (branch.some(p => Math.hypot(p[0] - branch[0][0], p[1] - branch[0][1]) > 1e-6)) branches.push(branch);
		branch = [];
	};
	const boundary = (u, v, y) => [u[0] + (v[0] - u[0]) * (y - u[1]) / (v[1] - u[1]), y];
	for (let i = 0; i <= 2400; i++) {
		const x = a.xmin + (a.xmax - a.xmin) * i / 2400, y = a.fn(x);
		if (previous && (a.breaks || []).some(b => previous[0] <= b && x >= b)) { flush(); previous = null; }
		if (!Number.isFinite(y)) { flush(); previous = null; continue; }
		const p = [x, y], inside = y >= a.ymin && y <= a.ymax;
		if (inside) {
			if (previous && !branch.length && (previous[1] < a.ymin || previous[1] > a.ymax)) branch.push(point(boundary(previous, p, previous[1] < a.ymin ? a.ymin : a.ymax)));
			branch.push(point(p));
		} else if (branch.length) {
			branch.push(point(boundary(previous, p, y < a.ymin ? a.ymin : a.ymax)));
			flush();
		}
		previous = p;
	}
	flush();
	const target = segments(branches), tolerance = 9;
	const coverage = branches.map(b => fraction(samples(segments([b])), drawn, tolerance));
	const cover = fraction(samples(target), drawn, tolerance);
	const clean = fraction(ink, target, tolerance);
	// Crossings and tangencies both count. Compare locations ON the axis, not just
	// proximity to a shallow curve that happens to approach it (e.g. an asymptote).
	const crossings = axis => drawn.flatMap(([u, v]) => {
		const zero = point([0, 0])[axis], du = u[axis] - zero, dv = v[axis] - zero;
		if (du * dv > 0) return [];
		if (du === dv) return samples([[u, v]]).map(s => s.p);
		const t = -du / (dv - du);
		return [[u[0] + t * (v[0] - u[0]), u[1] + t * (v[1] - u[1])]];
	});
	const intercepts = (expected, axis) => {
		const visible = expected.filter(([x, y]) => x >= a.xmin && x <= a.xmax && y >= a.ymin && y <= a.ymax).map(point);
		const crosses = crossings(axis);
		const hits = [...crosses, ...drawn.flat().filter(p => Math.abs(p[axis] - point([0, 0])[axis]) <= 2)];
		const hit = visible.filter(p => hits.some(h => Math.hypot(p[0] - h[0], p[1] - h[1]) <= 6)).length;
		// Pixel rounding can put a near-axis asymptotic tail ON the axis. Do not
		// invent a crossing when the ink is within the two-unit rendering allowance.
		const extra = crosses.some(h => !visible.some(p => Math.hypot(p[0] - h[0], p[1] - h[1]) <= 6) && !near(h, target, 2));
		return { hit, total: visible.length, extra, ok: hit === visible.length && !extra };
	};
	const x = intercepts(a.xIntercepts.map(x => [x, 0]), 1);
	const y = intercepts(a.yIntercept === null ? [] : [[0, a.yIntercept]], 0);
	const branchesOK = coverage.every(c => c >= .75);
	return { ok: target.length > 0 && cover >= .85 && clean >= .9 && branchesOK && x.ok && y.ok, cover, clean, branchesOK, x, y };
};
