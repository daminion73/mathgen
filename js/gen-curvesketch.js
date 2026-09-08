// Worksheet-calibre curve analysis generators.
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Curve Sketching', subtopic, difficulty, gen });
	const nums = [-3, -2, -1, 1, 2, 3];
	const small = (r) => r.pick(nums);
	const pair = (r) => {
		let a = small(r), b = small(r);
		while (a === b) b = small(r);
		return [Math.min(a, b), Math.max(a, b)];
	};
	const fac = (a) => a < 0 ? `(x + ${-a})` : `(x &minus; ${a})`;
	const graph = (fn, extra = {}) => ({ type: 'graph', xmin: -5, xmax: 5, ymin: -5, ymax: 5, xstep: 1, ystep: 1, grid: true, fns: [{ fn, color: '#444' }], ...extra });
	const multi = (values, labels) => ({ type: 'multinumeric', values, labels, tolerance: 0.001 });
	const mc = (r, correct, distractors) => {
		const choices = r.shuffle([correct, ...distractors]);
		return { type: 'mc', choices, correct: choices.indexOf(correct) };
	};

	add('cs-triple-branch', 'Rational curves', 2, (r) => {
		const [a, b] = pair(r), k = small(r), mid = (a + b) / 2;
		const fn = (x) => k / ((x - a) * (x - b));
		const sign = Math.sign(fn(mid));
		return { marks: 5, text: `For y = ${F.frac(k, `${fac(a)}${fac(b)}`)}, state both vertical asymptotes and whether the middle branch lies above (+1) or below (&minus;1) the x-axis.`, answer: multi([a, b, sign], ['left asymptote x =', 'right asymptote x =', 'middle-branch sign (+1 or -1)']), solution: `<p>The denominator vanishes at ${a} and ${b}. Between them its sign is opposite to the outside factors.</p><p>Answers: <strong>${a}, ${b}, ${sign}</strong>.</p><div class="diagram-wrap">${MG.diagram(graph(fn, { vlines: [{ x: a }, { x: b }] }))}</div>` };
	});

	add('cs-triple-branch-behaviour', 'Rational curves', 3, (r) => {
		const [a, b] = pair(r), k = small(r), fn = (x) => k / ((x - a) * (x - b));
		const left = -Math.sign(k), right = Math.sign(k);
		return { marks: 6, text: `Analyse y = ${F.frac(k, `${fac(a)}${fac(b)}`)}. Give the two vertical asymptotes, then the signs of y as x approaches the left asymptote from inside and the right asymptote from outside (use +1 for +&infin;, &minus;1 for &minus;&infin;).`, answer: multi([a, b, left, right], ['left asymptote', 'right asymptote', 'inside-left limit sign', 'outside-right limit sign']), solution: `<p>A sign table about the two simple denominator zeros gives <strong>${a}, ${b}, ${left}, ${right}</strong>.</p><div class="diagram-wrap">${MG.diagram(graph(fn, { vlines: [{ x: a }, { x: b }] }))}</div>` };
	});

	add('cs-match-bell-equation', 'Reciprocal quadratics', 2, (r) => {
		const h = small(r), c = r.int(1, 3), fn = (x) => 1 / ((x - h) ** 2 + c);
		const correct = `y = ${F.frac(1, `${fac(h)}${F.sup(2)} + ${c}`)}`;
		return { marks: 4, text: `Which equation matches this reciprocal-quadratic curve? Its peak has been marked.`, diagram: graph(fn, { pois: [[h, 1 / c]], hlines: [{ y: 0 }] }), answer: mc(r, correct, [`y = ${F.frac(1, `${fac(-h)}${F.sup(2)} + ${c}`)}`, `y = ${F.frac(-1, `${fac(h)}${F.sup(2)} + ${c}`)}`, `y = ${F.frac(1, `${fac(h)}${F.sup(2)} &minus; ${c}`)}`]), solution: `<p>The centre of symmetry gives the horizontal shift; positivity and the marked height fix the remaining signs.</p><p><strong>${correct}</strong>.</p>` };
	});

	add('cs-match-double-pole', 'Reciprocal quadratics', 2, (r) => {
		const h = small(r), k = small(r), fn = (x) => k / (x - h) ** 2;
		const correct = `y = ${F.frac(k, `${fac(h)}${F.sup(2)}`)}`;
		const prompt = r.pick([
			'Select the equation for the shown curve. Use its common vertical asymptote and the side of the x-axis occupied by both branches.',
			'Both branches of the displayed curve share one vertical asymptote. Choose the matching equation.',
			'Infer the vertical asymptote from the two branches. Which equation produces this curve?',
			'Identify the equation of the graphed reciprocal-square curve from its asymptote and sign.'
		]);
		return { marks: 4, text: prompt, diagram: graph(fn), answer: mc(r, correct, [`y = ${F.frac(-k, `${fac(h)}${F.sup(2)}`)}`, `y = ${F.frac(k, fac(h))}`, `y = ${F.frac(k, `${fac(-h)}${F.sup(2)}`)}`]), solution: `<p>An even-power pole puts both branches on the same side. The displacement identifies <strong>${correct}</strong>.</p>` };
	});

	add('cs-reciprocal-of-f-asymptotes', 'Reciprocal reasoning', 2, (r) => {
		const [a, b] = pair(r), s = r.sign(), f = (x) => s * (x - a) * (x - b);
		return { marks: 4, text: `The diagram is y=f(x), a quadratic. For g(x)=${F.frac(1, 'f(x)')}, state both vertical asymptotes.`, diagram: graph(f, { points: [[a, 0, 'A'], [b, 0, 'B']] }), answer: multi([a, b], ['left asymptote x =', 'right asymptote x =']), solution: `<p>The zeros of f become denominator zeros of 1/f, hence <strong>x=${a}</strong> and <strong>x=${b}</strong>.</p>` };
	});

	add('cs-reciprocal-small-values', 'Reciprocal reasoning', 3, (r) => {
		const c = r.pick([2, 3]), h = small(r), f = (x) => (x - h) ** 2 - c * c;
		const lo = MG.round(h - Math.sqrt(c * c - 1), 2), hi = MG.round(h + Math.sqrt(c * c - 1), 2);
		const prompt = r.pick([
			`The graph is y=f(x). For g(x)=${F.frac(1, 'f(x)')}, find the endpoints of the interval containing x=${h} on which |g(x)| &le; 1, correct to 2 decimal places.`,
			`For the graphed quadratic y=f(x), consider its reciprocal g(x)=${F.frac(1, 'f(x)')}. Around x=${h}, |g(x)| &le; 1 on one closed interval; give both endpoints correct to 2 decimal places.`,
			`Let g(x)=${F.frac(1, 'f(x)')} for the displayed parabola y=f(x). Determine, correct to 2 decimal places, the endpoints of the interval about x=${h} where |g(x)| &le; 1.`
		]);
		return { marks: 6, text: prompt, diagram: graph(f, { hlines: [{ y: 1 }, { y: -1 }] }), answer: multi([lo, hi], ['left endpoint (2 d.p.)', 'right endpoint (2 d.p.)']), solution: `<p>|1/f|&le;1 means |f|&ge;1. On the central part f&le;&minus;1, so (x&minus;${h})${F.sup(2)}&le;${c * c - 1}.</p><p>The endpoints are ${h}&plusmn;&radic;${c * c - 1}: <strong>${lo}</strong> and <strong>${hi}</strong> (2 d.p.).</p>` };
	});

	add('cs-symmetry-from-graph', 'Symmetry', 2, (r) => {
		const kind = r.pick(['Even', 'Odd', 'Neither']), a = r.int(1, 3), b = small(r);
		const fn = kind === 'Even' ? (x) => a / (x * x + 1) : kind === 'Odd' ? (x) => a * x / (x * x + 1) : (x) => a / ((x - b) ** 2 + 1);
		return { marks: 4, text: `Classify the displayed curve as even, odd or neither. Parameter card: ${a}:${b}.`, diagram: graph(fn, { hlines: [{ y: 0 }] }), answer: mc(r, kind, ['Even', 'Odd', 'Neither'].filter((v) => v !== kind)), solution: `<p>Check reflection in the y-axis and rotation through the origin. This curve is <strong>${kind.toLowerCase()}</strong>.</p>` };
	});

	add('cs-domain-range-chain', 'Domain and range', 3, (r) => {
		const h = small(r), k = small(r), q = r.int(1, 3), fn = (x) => k + 1 / ((x - h) ** 2 + q);
		return { marks: 6, text: `For y=${k}+${F.frac(1, `${fac(h)}${F.sup(2)}+${q}`)}, state the axis of symmetry, the excluded lower range boundary, and the maximum y-value. Give exact values.`, answer: multi([h, k, k + 1 / q], ['axis x =', 'range lower boundary y =', 'maximum y-value (exact)']), solution: `<p>The squared term is least at x=${h}. The reciprocal tends to zero but stays positive.</p><p>Required values: <strong>${h}, ${k}, ${MG.fracReduced(k * q + 1, q)}</strong>.</p><div class="diagram-wrap">${MG.diagram(graph(fn, { hlines: [{ y: k }] }))}</div>` };
	});

	add('cs-restricted-composite', 'Domain and range', 3, (r) => {
		const h = small(r), width = r.int(1, 3), k = small(r), fn = (x) => Math.sqrt(Math.max(0, width * width - (x - h) ** 2)) + k;
		return { marks: 6, text: `The upper semicircle shown is y=${F.sqrt(`${width * width}&minus;${fac(h)}${F.sup(2)}`)}${F.st(k, '')}. State its domain endpoints and its minimum and maximum y-values.`, diagram: graph((x) => Math.abs(x - h) <= width ? fn(x) : NaN, { endpoints: [{ at: [h - width, k], open: false }, { at: [h + width, k], open: false }] }), answer: multi([h - width, h + width, k, k + width], ['domain left endpoint', 'domain right endpoint', 'minimum y', 'maximum y']), solution: `<p>The radicand requires |x&minus;${h}|&le;${width}; the square root runs from 0 to ${width}.</p><p><strong>${h - width}, ${h + width}, ${k}, ${k + width}</strong>.</p>` };
	});

	add('cs-full-rational-chain', 'Full curve analysis', 3, (r) => {
		const [a, b] = pair(r), z = nums.find((n) => n !== a && n !== b) || 0, k = r.sign();
		const fn = (x) => k * (x - z) / ((x - a) * (x - b));
		return { marks: 7, text: `For y=${k < 0 ? '&minus;' : ''}${F.frac(fac(z), `${fac(a)}${fac(b)}`)}, give (i) the x-intercept, (ii) both vertical asymptotes, and (iii) the horizontal limiting value as x&rarr;&infin;.`, answer: multi([z, a, b, 0], ['x-intercept', 'left vertical asymptote', 'right vertical asymptote', 'limit at infinity']), solution: `<p>The numerator gives ${z}; denominator factors give ${a}, ${b}; the denominator degree is larger.</p><p><strong>${z}, ${a}, ${b}, 0</strong>.</p><div class="diagram-wrap">${MG.diagram(graph(fn, { vlines: [{ x: a }, { x: b }] }))}</div>` };
	});

	add('cs-oblique-rational-chain', 'Full curve analysis', 3, (r) => {
		const a = small(r), m = r.pick([-2, -1, 1, 2]), c = small(r), fn = (x) => m * x + c + 1 / (x - a);
		return { marks: 6, text: `For y=${F.lt(m, 'x')}${F.st(c, '')}+${F.frac(1, fac(a))}, state the vertical asymptote and the gradient and intercept of the oblique asymptote.`, answer: multi([a, m, c], ['vertical asymptote x =', 'oblique gradient', 'oblique y-intercept']), solution: `<p>The reciprocal term is not defined at x=${a} and tends to zero for large |x|. Thus the oblique asymptote is y=${F.lt(m, 'x')}${F.st(c, '')}.</p><div class="diagram-wrap">${MG.diagram(graph(fn, { vlines: [{ x: a }] }))}</div>` };
	});

	add('cs-general-transform-point', 'Transformation chains', 3, (r) => {
		const x = small(r), y = small(r), A = r.pick([-2, -1, 1, 2]), b = r.pick([-2, -1, 1, 2]), h = small(r), k = small(r);
		const nx = h + x / b, ny = A * y + k;
		return { marks: 7, text: `Point P lies on y=f(x). Find its image on y=${A}f(${b}(x${F.st(-h, '')}))${F.st(k, '')}. Give exact coordinates.`, diagram: graph((t) => (t - x) ** 2 + y, { points: [[x, y, 'P']] }), answer: multi([nx, ny], ['image x-coordinate (exact)', 'image y-coordinate (exact)']), solution: `<p>Solve b(X&minus;h)=${x}, then transform the ordinate: Y=${A}(${y})+${k}.</p><p>The image is <strong>${F.pt(nx, ny)}</strong>.</p>` };
	});
})();
