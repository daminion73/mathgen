// Worksheet-calibre draw-the-curve questions.
// Sketch answers carry exact intercepts and discontinuities for drawing checks.
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Sketch', subtopic, difficulty, gen });
	const fac = (a) => a === 0 ? 'x' : a < 0 ? `(x + ${-a})` : `(x &minus; ${a})`;
	const pair = (r) => {
		let a = r.int(-3, 2), b = r.int(-2, 3);
		while (a === b) b = r.int(-2, 3);
		return [Math.min(a, b), Math.max(a, b)];
	};
	const win = (xmin, xmax, ymin, ymax, extra = {}) => ({ xmin, xmax, ymin, ymax, ...extra });
	const sk = (fn, w, xIntercepts = [], breaks = [], features = {}) => ({ type: 'sketch', fn, ...w, xIntercepts: [...new Set(xIntercepts)], yIntercept: Number.isFinite(fn(0)) ? fn(0) : null, breaks, asymptotes: features });
	const graphSol = (fn, w, extra = {}) => `<div class="diagram-wrap">${MG.diagram({ type: 'graph', grid: true, fns: [{ fn }], ...w, ...extra })}</div>`;
	// Isolate every real polynomial root, including repeated roots at stationary points.
	const roots = coefficients => {
		if (coefficients.length === 2) return [-coefficients[1] / coefficients[0]];
		const value = x => coefficients.reduce((v, c) => v * x + c, 0);
		const bound = 1 + Math.max(...coefficients.slice(1).map(c => Math.abs(c / coefficients[0])));
		const stationary = roots(coefficients.slice(0, -1).map((c, i) => c * (coefficients.length - 1 - i))).filter(x => x > -bound && x < bound);
		const cuts = [-bound, ...stationary, bound], found = stationary.filter(x => Math.abs(value(x)) < 1e-9);
		for (let i = 1; i < cuts.length; i++) {
			let lo = cuts[i - 1], hi = cuts[i];
			if (Math.abs(value(lo)) < 1e-9 || Math.abs(value(hi)) < 1e-9 || value(lo) * value(hi) >= 0) continue;
			for (let j = 0; j < 60; j++) { const mid = (lo + hi) / 2; if (value(lo) * value(mid) <= 0) hi = mid; else lo = mid; }
			found.push((lo + hi) / 2);
		}
		return found.sort((a, b) => a - b);
	};

	add('sketch-triple-branch', 'Rational curves', 2, (r) => {
		const [a, b] = pair(r), k = r.pick([-3, -2, -1, 1, 2, 3]), w = win(-5, 5, -6, 6);
		const fn = (x) => k / ((x - a) * (x - b));
		return { marks: 7, text: `Sketch y=${F.frac(k, `${fac(a)}${fac(b)}`)}. Draw all three branches, then state every asymptote and intercept.`, answer: sk(fn, w, [], [a, b], { vertical: [a, b], horizontal: [0] }), solution: `<p>The denominator gives vertical asymptotes x=${a}, ${b}; y=0 is horizontal. Use a sign table in the three intervals.</p>${graphSol(fn, w, { vlines: [{ x: a }, { x: b }], hlines: [{ y: 0 }] })}` };
	});

	add('sketch-linear-over-quadratic', 'Rational curves', 3, (r) => {
		const [a, b] = pair(r), z = r.pick([-3, -2, -1, 0, 1, 2, 3].filter(x => x !== a && x !== b)), s = r.sign(), w = win(-5, 5, -7, 7);
		const fn = (x) => s * (x - z) / ((x - a) * (x - b));
		return { marks: 9, text: `Sketch y=${s < 0 ? '&minus;' : ''}${F.frac(fac(z), `${fac(a)}${fac(b)}`)}. Include every branch, then state every asymptote and intercept.`, answer: sk(fn, w, [z], [a, b], { vertical: [a, b], horizontal: [0] }), solution: `<p>The intercept is x=${z}; poles are x=${a}, ${b}; y=0 is the end asymptote. A sign chart fixes each branch.</p>${graphSol(fn, w, { vlines: [{ x: a }, { x: b }], hlines: [{ y: 0 }] })}` };
	});

	add('sketch-reciprocal-bell', 'Reciprocal quadratics', 2, (r) => {
		const h = r.int(-3, 3), c = r.int(1, 4), A = r.pick([1, 2, 3]), w = win(-6, 6, -1, 4);
		const fn = (x) => A / ((x - h) ** 2 + c);
		return { marks: 6, text: `Sketch y=${F.frac(A, `${fac(h)}${F.sup(2)}+${c}`)}, including the maximum, then state every asymptote and intercept.`, answer: sk(fn, w, [], [], { horizontal: [0] }), solution: `<p>The curve is positive and symmetric about x=${h}. Its maximum is ${F.pt(h, A / c)} and it tapers to y=0.</p>${graphSol(fn, w, { hlines: [{ y: 0 }] })}` };
	});

	add('sketch-reciprocal-parabola', 'Reciprocal reasoning', 3, (r) => {
		const [a, b] = pair(r), s = r.sign(), w = win(-5, 5, -6, 6), f = (x) => s * (x - a) * (x - b), fn = (x) => 1 / f(x);
		return { marks: 9, text: `The displayed curve is y=f(x). On the answer grid sketch y=${F.frac(1, 'f(x)')}, then state every asymptote and intercept.`, diagram: { type: 'graph', ...w, grid: true, fns: [{ fn: f, color: '#444' }], points: [[a, 0, 'A'], [b, 0, 'B']] }, answer: sk(fn, w, [], [a, b], { vertical: [a, b], horizontal: [0] }), solution: `<p>The zeros ${a}, ${b} become vertical asymptotes. Reciprocal values retain the sign of f and tend to zero away from the roots.</p>${graphSol(fn, w, { vlines: [{ x: a }, { x: b }], hlines: [{ y: 0 }] })}` };
	});

	add('sketch-absolute-cubic', 'Modulus transformations', 3, (r) => {
		const [a, b] = pair(r), c = r.int(-3, 3), w = win(-5, 5, -8, 8), base = (x) => (x - a) * (x - b) * (x - c), fn = (x) => Math.abs(base(x));
		return { marks: 8, text: `The diagram shows f(x)=${fac(a)}${fac(b)}${fac(c)}. Sketch y=|f(x)| on the answer grid, then state its intercepts and whether it has any asymptotes.`, diagram: { type: 'graph', ...w, grid: true, fns: [{ fn: base, color: '#777' }] }, answer: sk(fn, w, [a, b, c]), solution: `<p>Keep the parts above the x-axis and reflect every part below it upwards. A polynomial has no asymptotes.</p>${graphSol(fn, w)}` };
	});

	add('sketch-shifted-semicircle', 'Restricted curves', 2, (r) => {
		const h = r.int(-2, 2), k = r.int(-2, 2), rad = r.int(2, 4), s = r.sign(), w = win(-7, 7, -7, 7);
		const fn = (x) => Math.abs(x - h) <= rad ? k + s * Math.sqrt(Math.max(0, rad * rad - (x - h) ** 2)) : NaN;
		const zeros = k * s <= 0 && Math.abs(k) <= rad ? [h - Math.sqrt(rad * rad - k * k), h + Math.sqrt(rad * rad - k * k)] : [];
		return { marks: 6, text: `Sketch the ${s > 0 ? 'upper' : 'lower'} semicircle y=${k}${s > 0 ? '+' : '&minus;'}${F.sqrt(`${rad * rad}&minus;${fac(h)}${F.sup(2)}`)}, marking both endpoints and the extreme point, then state its intercepts.`, answer: sk(fn, w, zeros), solution: `<p>It belongs to the circle centred at ${F.pt(h, k)} with radius ${rad}; retain only the stated half. It has no asymptotes.</p>${graphSol(fn, w)}` };
	});

	add('sketch-shifted-exponential', 'Exponential curves', 2, (r) => {
		const base = r.pick([2, 3]), h = r.int(-2, 2), k = r.int(-3, 3), s = r.pick([-1, 1]), w = win(-5, 5, -7, 7);
		const fn = (x) => Math.pow(base, s * (x - h)) + k;
		return { marks: 6, text: `Sketch y=${base}${F.sup(`${s < 0 ? '&minus;' : ''}${fac(h)}`)}${F.st(k, '')}, including the point where x=${h}, then state every asymptote and intercept.`, answer: sk(fn, w, k < 0 ? [h + Math.log(-k) / (s * Math.log(base))] : [], [], { horizontal: [k] }), solution: `<p>The horizontal asymptote is y=${k}; the translated key point is ${F.pt(h, k + 1)}. The sign in the exponent determines growth direction.</p>${graphSol(fn, w, { hlines: [{ y: k }] })}` };
	});

	add('sketch-shifted-log', 'Logarithmic curves', 3, (r) => {
		const base = r.pick([2, 3]), h = r.int(-3, 2), k = r.int(-2, 2), w = win(-5, 12, -6, 6);
		const fn = (x) => x > h ? Math.log(x - h) / Math.log(base) + k : NaN;
		return { marks: 7, text: `Sketch y=log<sub>${base}</sub>${fac(h)}${F.st(k, '')}, including a translated key point, then state every asymptote and intercept.`, answer: sk(fn, w, [h + base ** -k], [h], { vertical: [h] }), solution: `<p>The asymptote is x=${h}; translating (1,0) gives ${F.pt(h + 1, k)}.</p>${graphSol(fn, w, { vlines: [{ x: h }] })}` };
	});

	add('sketch-oblique-reciprocal', 'Addition of ordinates', 3, (r) => {
		const m = r.pick([-2, -1, 1, 2]), c = r.int(-2, 2), a = r.int(-3, 3), q = r.pick([-2, -1, 1, 2]), w = win(-5, 5, -8, 8);
		const fn = (x) => m * x + c + q / (x - a);
		return { marks: 9, text: `Sketch y=${F.lt(m, 'x')}${F.st(c, '')}${F.st(q, '')}/${fac(a)}. Then state every asymptote and intercept.`, answer: sk(fn, w, roots([m, c - m * a, q - c * a]), [a], { vertical: [a], oblique: [m, c] }), solution: `<p>The reciprocal term gives x=${a}; as it tends to zero the curve approaches y=${F.lt(m, 'x')}${F.st(c, '')}.</p>${graphSol(fn, w, { vlines: [{ x: a }], fns: [{ fn }, { fn: (x) => m * x + c, color: 'var(--dg-faint, #8c8c8c)' }] })}` };
	});

	add('sketch-quadratic-plus-reciprocal', 'Addition of ordinates', 3, (r) => {
		const h = r.int(-2, 2), a = r.int(-3, 3), q = r.pick([-2, -1, 1, 2]), w = win(-5, 5, -8, 10);
		const fn = (x) => (x - h) ** 2 + q / (x - a);
		return { marks: 11, text: `Sketch y=${fac(h)}${F.sup(2)}${F.st(q, '')}/${fac(a)}. Then state its vertical and parabolic asymptotes and every intercept.`, answer: sk(fn, w, roots([1, -a - 2 * h, h * h + 2 * a * h, q - a * h * h]), [a], { vertical: [a], parabolic: [1, -2 * h, h * h] }), solution: `<p>The pole is x=${a}. For large |x| the reciprocal term disappears, so the curve approaches y=${fac(h)}${F.sup(2)}.</p>${graphSol(fn, w, { vlines: [{ x: a }] })}` };
	});
})();
