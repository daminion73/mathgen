// Worksheet-calibre draw-the-curve questions.
// Sketch answer contract: { type:'sketch', fn, xmin, xmax, ymin, ymax, xstep?, ystep?, tolerance? }
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Sketch', subtopic, difficulty, gen });
	const fac = (a) => a < 0 ? `(x + ${-a})` : `(x &minus; ${a})`;
	const pair = (r) => {
		let a = r.int(-3, 2), b = r.int(-2, 3);
		while (a === b) b = r.int(-2, 3);
		return [Math.min(a, b), Math.max(a, b)];
	};
	const win = (xmin, xmax, ymin, ymax, extra = {}) => ({ xmin, xmax, ymin, ymax, ...extra });
	const sk = (fn, w) => ({ type: 'sketch', fn, ...w });
	const graphSol = (fn, w, extra = {}) => `<div class="diagram-wrap">${MG.diagram({ type: 'graph', grid: true, fns: [{ fn, color: '#444' }], ...w, ...extra })}</div>`;

	add('sketch-triple-branch', 'Rational curves', 2, (r) => {
		const [a, b] = pair(r), k = r.pick([-3, -2, -1, 1, 2, 3]), w = win(-5, 5, -6, 6);
		const fn = (x) => k / ((x - a) * (x - b));
		return { marks: 5, text: `Sketch y=${F.frac(k, `${fac(a)}${fac(b)}`)}. Draw all three branches and show both vertical and the horizontal asymptotes.`, diagram: { type: 'graph', ...w, grid: true, fns: [], vlines: [{ x: a }, { x: b }], hlines: [{ y: 0 }] }, answer: sk(fn, w), solution: `<p>The denominator gives vertical asymptotes x=${a}, ${b}; y=0 is horizontal. Use a sign table in the three intervals.</p>${graphSol(fn, w, { vlines: [{ x: a }, { x: b }], hlines: [{ y: 0 }] })}` };
	});

	add('sketch-linear-over-quadratic', 'Rational curves', 3, (r) => {
		const [a, b] = pair(r), z = r.int(-3, 3), s = r.sign(), w = win(-5, 5, -7, 7);
		const fn = (x) => s * (x - z) / ((x - a) * (x - b));
		return { marks: 7, text: `Sketch y=${s < 0 ? '&minus;' : ''}${F.frac(fac(z), `${fac(a)}${fac(b)}`)}. Mark its x-intercept and show every asymptote and branch.`, diagram: { type: 'graph', ...w, grid: true, fns: [], vlines: [{ x: a }, { x: b }], hlines: [{ y: 0 }] }, answer: sk(fn, w), solution: `<p>The intercept is x=${z}; poles are x=${a}, ${b}; y=0 is the end asymptote. A sign chart fixes each branch.</p>${graphSol(fn, w, { vlines: [{ x: a }, { x: b }], hlines: [{ y: 0 }] })}` };
	});

	add('sketch-reciprocal-bell', 'Reciprocal quadratics', 2, (r) => {
		const h = r.int(-3, 3), c = r.int(1, 4), A = r.pick([1, 2, 3]), w = win(-6, 6, -1, 4);
		const fn = (x) => A / ((x - h) ** 2 + c);
		return { marks: 4, text: `Sketch y=${F.frac(A, `${fac(h)}${F.sup(2)}+${c}`)}, marking the maximum and horizontal asymptote.`, diagram: { type: 'graph', ...w, grid: true, fns: [], hlines: [{ y: 0 }] }, answer: sk(fn, w), solution: `<p>The curve is positive and symmetric about x=${h}. Its maximum is ${F.pt(h, A / c)} and it tapers to y=0.</p>${graphSol(fn, w, { hlines: [{ y: 0 }] })}` };
	});

	add('sketch-reciprocal-parabola', 'Reciprocal reasoning', 3, (r) => {
		const [a, b] = pair(r), s = r.sign(), w = win(-5, 5, -6, 6), f = (x) => s * (x - a) * (x - b), fn = (x) => 1 / f(x);
		return { marks: 7, text: `The displayed curve is y=f(x). On the answer grid sketch y=${F.frac(1, 'f(x)')}, showing the asymptotes and the sign of every branch.`, diagram: { type: 'graph', ...w, grid: true, fns: [{ fn: f, color: '#444' }], points: [[a, 0, 'A'], [b, 0, 'B']] }, answer: sk(fn, w), solution: `<p>The zeros ${a}, ${b} become vertical asymptotes. Reciprocal values retain the sign of f and tend to zero away from the roots.</p>${graphSol(fn, w, { vlines: [{ x: a }, { x: b }], hlines: [{ y: 0 }] })}` };
	});

	add('sketch-absolute-cubic', 'Modulus transformations', 3, (r) => {
		const [a, b] = pair(r), c = r.int(-3, 3), w = win(-5, 5, -8, 8), base = (x) => (x - a) * (x - b) * (x - c), fn = (x) => Math.abs(base(x));
		return { marks: 6, text: `The diagram shows f(x)=${fac(a)}${fac(b)}${fac(c)}. Sketch y=|f(x)| on the answer grid, retaining all intercepts.`, diagram: { type: 'graph', ...w, grid: true, fns: [{ fn: base, color: '#777' }] }, answer: sk(fn, w), solution: `<p>Keep the parts above the x-axis and reflect every part below it upwards.</p>${graphSol(fn, w)}` };
	});

	add('sketch-shifted-semicircle', 'Restricted curves', 2, (r) => {
		const h = r.int(-2, 2), k = r.int(-2, 2), rad = r.int(2, 4), s = r.sign(), w = win(h - rad, h + rad, k - rad - 1, k + rad + 1);
		const fn = (x) => k + s * Math.sqrt(Math.max(0, rad * rad - (x - h) ** 2));
		return { marks: 4, text: `Sketch the ${s > 0 ? 'upper' : 'lower'} semicircle y=${k}${s > 0 ? '+' : '&minus;'}${F.sqrt(`${rad * rad}&minus;${fac(h)}${F.sup(2)}`)}, marking both endpoints and the extreme point.`, answer: sk(fn, w), solution: `<p>It belongs to the circle centred at ${F.pt(h, k)} with radius ${rad}; retain only the stated half.</p>${graphSol(fn, w)}` };
	});

	add('sketch-shifted-exponential', 'Exponential curves', 2, (r) => {
		const base = r.pick([2, 3]), h = r.int(-2, 2), k = r.int(-3, 3), s = r.pick([-1, 1]), w = win(-5, 5, -7, 7);
		const fn = (x) => Math.pow(base, s * (x - h)) + k;
		return { marks: 4, text: `Sketch y=${base}${F.sup(`${s < 0 ? '&minus;' : ''}${fac(h)}`)}${F.st(k, '')}, marking its horizontal asymptote and the point where x=${h}.`, diagram: { type: 'graph', ...w, grid: true, fns: [], hlines: [{ y: k }] }, answer: sk(fn, w), solution: `<p>The horizontal asymptote is y=${k}; the translated key point is ${F.pt(h, k + 1)}. The sign in the exponent determines growth direction.</p>${graphSol(fn, w, { hlines: [{ y: k }] })}` };
	});

	add('sketch-shifted-log', 'Logarithmic curves', 3, (r) => {
		const base = r.pick([2, 3]), h = r.int(-3, 2), k = r.int(-2, 2), w = win(h, h + 7, -6, 6);
		const fn = (x) => Math.log(Math.max(x - h, 1e-9)) / Math.log(base) + k;
		return { marks: 5, text: `Sketch y=log<sub>${base}</sub>${fac(h)}${F.st(k, '')}, showing the vertical asymptote and one translated key point.`, diagram: { type: 'graph', ...w, grid: true, fns: [], vlines: [{ x: h }] }, answer: sk(fn, w), solution: `<p>The asymptote is x=${h}; translating (1,0) gives ${F.pt(h + 1, k)}.</p>${graphSol(fn, w, { vlines: [{ x: h }] })}` };
	});

	add('sketch-oblique-reciprocal', 'Addition of ordinates', 3, (r) => {
		const m = r.pick([-2, -1, 1, 2]), c = r.int(-2, 2), a = r.int(-3, 3), q = r.pick([-2, -1, 1, 2]), w = win(-5, 5, -8, 8);
		const fn = (x) => m * x + c + q / (x - a);
		return { marks: 7, text: `Sketch y=${F.lt(m, 'x')}${F.st(c, '')}${F.st(q, '')}/${fac(a)}. Show the vertical asymptote and the oblique asymptote approached by both branches.`, diagram: { type: 'graph', ...w, grid: true, fns: [{ fn: (x) => m * x + c, color: '#aaa' }], vlines: [{ x: a }] }, answer: sk(fn, w), solution: `<p>The reciprocal term gives x=${a}; as it tends to zero the curve approaches y=${F.lt(m, 'x')}${F.st(c, '')}.</p>${graphSol(fn, w, { vlines: [{ x: a }], fns: [{ fn, color: '#444' }, { fn: (x) => m * x + c, color: '#aaa' }] })}` };
	});

	add('sketch-quadratic-plus-reciprocal', 'Addition of ordinates', 3, (r) => {
		const h = r.int(-2, 2), a = r.int(-3, 3), q = r.pick([-2, -1, 1, 2]), w = win(-5, 5, -8, 10);
		const fn = (x) => (x - h) ** 2 + q / (x - a);
		return { marks: 8, text: `Sketch y=${fac(h)}${F.sup(2)}${F.st(q, '')}/${fac(a)}. Show the vertical asymptote and the parabolic end behaviour.`, diagram: { type: 'graph', ...w, grid: true, fns: [{ fn: (x) => (x - h) ** 2, color: '#aaa' }], vlines: [{ x: a }] }, answer: sk(fn, w), solution: `<p>The pole is x=${a}. For large |x| the reciprocal term disappears, so the curve approaches the shown parabola.</p>${graphSol(fn, w, { vlines: [{ x: a }] })}` };
	});
})();
