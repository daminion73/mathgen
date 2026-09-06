// Locus and coordinate geometry question generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Locus & Coordinate Geometry', subtopic, difficulty, gen });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const graph = (extra) => Object.assign({ type: 'graph', grid: true, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xstep: 1, ystep: 1 }, extra);
	const circle = (h, k, r) => `(x${F.st(-h, '')})${F.sup(2)}+(y${F.st(-k, '')})${F.sup(2)}=${r * r}`;

	add('loc-parabola-coeff', 'Parabola loci', 2, (r) => {
		const h = r.int(-3, 3), v = r.int(-2, 2), p = r.nonzeroInt(-3, 3), fy = v + p, d = v - p;
		return { marks: 5, text: `P(x,y) is equidistant from F${F.pt(h, fy)} and the directrix y=${d}. Derive its locus in the form x${F.sup(2)}+Ax+By+C=0. Find A, B and C.`, answer: multi([-2 * h, -4 * p, h * h + 4 * p * v], ['A', 'B', 'C']), solution: `<p>Equate (x&minus;${h})${F.sup(2)}+(y&minus;${fy})${F.sup(2)}=(y&minus;${d})${F.sup(2)} and expand.</p><p>A=${-2 * h}, B=${-4 * p}, C=${h * h + 4 * p * v}.</p>`, diagram: graph({ points: [[h, fy, 'F']], hlines: [{ y: d, label: 'directrix' }] }) };
	});

	add('loc-parabola-features', 'Parabola loci', 2, (r) => {
		const h = r.int(-3, 3), v = r.int(-3, 3), a = r.nonzeroInt(-3, 3);
		return { marks: 4, text: `A parabola has equation (x${F.st(-h, '')})${F.sup(2)}=${4 * a}(y${F.st(-v, '')}). Find its vertex and signed focal length a.`, answer: multi([h, v, a], ['vertex x', 'vertex y', 'signed focal length']), solution: `<p>Comparison with (x&minus;h)${F.sup(2)}=4a(y&minus;k) gives vertex <strong>${F.pt(h, v)}</strong> and a=<strong>${a}</strong>.</p>` };
	});

	add('loc-distance-exact', 'Perpendicular distance', 1, (r) => {
		const a = r.pick([3, 4, 5]), b = r.pick([4, -3, 12]), x = r.int(-3, 3), y = r.int(-3, 3), n = r.int(1, 3), norm = Math.hypot(a, b), c = n * norm - a * x - b * y;
		return { marks: 4, text: `Find the exact perpendicular distance from P${F.pt(x, y)} to ${F.lt(a, 'x')}${F.st(b, 'y')}${F.st(c, '')}=0.`, answer: { type: 'numeric', value: n, tolerance: 0.001, label: 'exact distance' }, solution: `<p>d=${F.frac(`|${a}(${x})${F.st(b, `(${y})`)}${F.st(c, '')}|`, F.sqrt(a * a + b * b))}=<strong>${n}</strong>.</p>` };
	});

	add('loc-distance-parameter', 'Perpendicular distance', 2, (r) => {
		const a = r.pick([2, 3, 4]), x = r.int(-2, 2), y = r.int(-2, 2), d = r.int(1, 3), s = Math.sqrt(a * a + 1), base = y - a * x, vals = [base - d * s, base + d * s].map(v => MG.round(v, 2));
		return { marks: 5, text: `The distance from P${F.pt(x, y)} to y=${a}x+k is ${d}. Find both values of k, correct to 2 decimal places.`, answer: multi(vals, ['smaller k (2 d.p.)', 'larger k (2 d.p.)'], 0.02), solution: `<p>${F.frac(`|${a}(${x})-${y}+k|`, F.sqrt(a * a + 1))}=${d}. Split the absolute-value equation.</p><p>k=<strong>${vals[0]}, ${vals[1]}</strong> (2 d.p.).</p>` };
	});

	add('loc-circle-complete', 'Circle equations', 1, (r) => {
		const h = r.int(-3, 3), k = r.int(-3, 3), rad = r.int(1, 3), c = h * h + k * k - rad * rad;
		return { marks: 4, text: `Complete the square for x${F.sup(2)}+y${F.sup(2)}${F.st(-2 * h, 'x')}${F.st(-2 * k, 'y')}${F.st(c, '')}=0, then find its centre and radius.`, answer: multi([h, k, rad], ['centre x', 'centre y', 'radius']), solution: `<p>The standard form is ${circle(h, k, rad)}.</p><p>Centre ${F.pt(h, k)}, radius ${rad}.</p>` };
	});

	add('loc-circle-tangent-k', 'Tangency', 2, (r) => {
		const m = r.pick([0, 3 / 4, 4 / 3]), rad = r.int(1, 3), h = r.int(-2, 2), v = r.int(-2, 2), q = rad * Math.sqrt(1 + m * m), base = v - m * h, vals = [MG.round(base - q, 2), MG.round(base + q, 2)];
		return { marks: 5, text: `The line y=${m}x+k is tangent to the circle ${circle(h, v, rad)}. Find both values of k, correct to 2 decimal places.`, answer: multi(vals, ['smaller k (2 d.p.)', 'larger k (2 d.p.)'], 0.02), solution: `<p>Tangency requires ${F.frac(`|${m}(${h})-${v}+k|`, F.sqrt(m * m + 1))}=${rad}.</p><p>Thus k=<strong>${vals[0]}, ${vals[1]}</strong> (2 d.p.); substitution gives discriminant zero in each case.</p>` };
	});

	add('loc-apollonius', 'Distance-ratio loci', 2, (r) => {
		const q = r.pick([2, 3]), ax = r.int(-2, 1), ay = r.int(-2, 2), bx = ax + r.int(1, 3), by = ay + r.nonzeroInt(-2, 2), den = 1 - q * q;
		const h = MG.round((ax - q * q * bx) / den, 2), k = MG.round((ay - q * q * by) / den, 2), rr = MG.round(q * Math.hypot(ax - bx, ay - by) / Math.abs(den), 2);
		return { marks: 6, text: `The locus of P satisfies PA=${q}PB, where A${F.pt(ax, ay)} and B${F.pt(bx, by)}. Derive its circle equation, then find the centre and radius correct to 2 decimal places.`, answer: multi([h, k, rr], ['centre x (2 d.p.)', 'centre y (2 d.p.)', 'radius (2 d.p.)'], 0.02), solution: `<p>Square PA=${q}PB, expand and complete both squares.</p><p>The centre is ${F.pt(h, k)} and radius is <strong>${rr}</strong> (2 d.p.).</p>`, diagram: graph({ points: [[ax, ay, 'A'], [bx, by, 'B']] }) };
	});

	add('loc-sum-squares', 'Combined loci', 2, (r) => {
		const h = r.int(-2, 2), k = r.int(-2, 2), dx = r.nonzeroInt(-2, 2), dy = r.nonzeroInt(-2, 2), rad = r.int(1, 3), a = [h - dx, k - dy], b = [h + dx, k + dy], total = 2 * (rad * rad + dx * dx + dy * dy);
		return { marks: 5, text: `P satisfies PA${F.sup(2)}+PB${F.sup(2)}=${total}, where A${F.pt(a[0], a[1])}, B${F.pt(b[0], b[1])}. Find the centre and radius of the locus.`, answer: multi([h, k, rad], ['centre x', 'centre y', 'radius']), solution: `<p>With M the midpoint, PA${F.sup(2)}+PB${F.sup(2)}=2PM${F.sup(2)}+${2 * (dx * dx + dy * dy)}.</p><p>Hence centre ${F.pt(h, k)}, radius ${rad}.</p>` };
	});

	add('loc-thales', 'Right-angle loci', 2, (r) => {
		const h = r.int(-2, 2), k = r.int(-2, 2), dx = r.pick([2, 3]), dy = r.pick([0, 2]), a = [h - dx, k - dy], b = [h + dx, k + dy], rad = MG.round(Math.hypot(dx, dy), 2);
		return { marks: 5, text: `The gradients of PA and PB have product &minus;1, where A${F.pt(a[0], a[1])}, B${F.pt(b[0], b[1])}. Identify the locus and find its centre and radius correct to 2 decimal places.`, answer: multi([h, k, rad], ['centre x', 'centre y', 'radius (2 d.p.)'], 0.02), solution: `<p>APB is a right angle, so AB is a diameter (including the vertical-line limiting cases).</p><p>Centre ${F.pt(h, k)}; radius ${rad} (2 d.p.).</p>` };
	});

	add('loc-bisector-circle-line', 'Combined loci', 3, (r) => {
		const h = r.int(-2, 2), k = r.int(-2, 2), rad = r.int(1, 3), a = [h - 2, k - 1], b = [h + 2, k + 1], q = [h + rad, k], s = MG.round(rad / Math.sqrt(2), 2), vals = [MG.round(h - s, 2), MG.round(h + s, 2)];
		return { marks: 7, text: `(i) Find the midpoint M determined by PA=PB for A${F.pt(a[0], a[1])}, B${F.pt(b[0], b[1])}. (ii) A circle centred at M passes through Q${F.pt(q[0], q[1])}. Hence find the two x-coordinates where it meets y&minus;${k}=x&minus;${h}, correct to 2 decimal places.`, answer: multi(vals, ['smaller x (2 d.p.)', 'larger x (2 d.p.)'], 0.02), solution: `<p>M=${F.pt(h, k)} and MQ=${rad}. Substitution in the circle gives 2(x&minus;${h})${F.sup(2)}=${rad * rad}.</p><p>x=<strong>${vals[0]}, ${vals[1]}</strong> (2 d.p.).</p>` };
	});

	add('loc-three-point-circle', 'Combined loci', 3, (r) => {
		const h = r.int(-2, 2), k = r.int(-2, 2), rad = r.int(1, 3), a = [h + rad, k], b = [h, k + rad], c = [h - rad, k];
		return { marks: 6, text: `A circle passes through A${F.pt(a[0], a[1])}, B${F.pt(b[0], b[1])} and C${F.pt(c[0], c[1])}. Use perpendicular bisectors to find its centre and radius.`, answer: multi([h, k, rad], ['centre x', 'centre y', 'radius']), solution: `<p>The perpendicular bisector of AC is x=${h}; intersect it with that of AB.</p><p>The centre is ${F.pt(h, k)} and radius ${rad}.</p>` };
	});

	add('loc-circle-line-intersections', 'Combined loci', 3, (r) => {
		const h = r.int(-2, 2), k = r.int(-2, 2), rad = r.pick([2, 3]), offset = r.pick([-1, 0, 1]), y = k + offset, d = MG.round(Math.sqrt(rad * rad - offset * offset), 2), vals = [MG.round(h - d, 2), MG.round(h + d, 2)];
		return { marks: 6, text: `(i) Complete the square for x${F.sup(2)}+y${F.sup(2)}${F.st(-2 * h, 'x')}${F.st(-2 * k, 'y')}${F.st(h * h + k * k - rad * rad, '')}=0. (ii) Hence find where it meets y=${y}; enter both x-coordinates correct to 2 decimal places.`, answer: multi(vals, ['smaller x (2 d.p.)', 'larger x (2 d.p.)'], 0.02), solution: `<p>The circle is ${circle(h, k, rad)}. Put y=${y}.</p><p>x=<strong>${vals[0]}, ${vals[1]}</strong> (2 d.p.).</p>` };
	});

	add('loc-tangent-from-point', 'Tangency', 3, (r) => {
		const rad = r.int(1, 3), t = r.pick([2, 3]), qx = rad * t, m = MG.round(rad / Math.sqrt(qx * qx - rad * rad), 2);
		const prompt = r.pick([
			`From Q${F.pt(qx, 0)}, two tangents are drawn to x${F.sup(2)}+y${F.sup(2)}=${rad * rad}. By imposing a zero discriminant on y=s(x&minus;${qx}), find the positive value of s correct to 2 decimal places.`,
			`The point Q${F.pt(qx, 0)} lies outside the circle x${F.sup(2)}+y${F.sup(2)}=${rad * rad}. A tangent line through Q has equation y=s(x&minus;${qx}). Using the discriminant condition for tangency, find the positive s correct to 2 decimal places.`,
			`Two tangent lines to the circle x${F.sup(2)}+y${F.sup(2)}=${rad * rad} pass through the external point Q${F.pt(qx, 0)}. Substitute y=s(x&minus;${qx}) into the circle and set the discriminant to zero; give the positive gradient s correct to 2 decimal places.`
		]);
		return { marks: 6, text: prompt, answer: { type: 'numeric', value: m, tolerance: 0.02, label: 's (2 d.p.)' }, solution: `<p>Substitution gives a quadratic in x. Setting its discriminant to zero gives s${F.sup(2)}=${F.frac(rad * rad, qx * qx - rad * rad)}.</p><p>The positive slope is <strong>${m}</strong> (2 d.p.).</p>` };
	});
})();
