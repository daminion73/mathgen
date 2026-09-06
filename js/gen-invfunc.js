// Inverse function question generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Functions', subtopic, difficulty, gen });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const lin = (a, b, x = 'x') => `${F.lt(a, x)}${F.st(b, '')}`;
	const plot = (f, inv, extra = {}) => Object.assign({ type: 'graph', grid: true, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xstep: 1, ystep: 1, fns: [{ fn: f }, { fn: inv, color: '#b44' }, { fn: x => x, color: '#888' }], flabels: [{ at: [-4, -3.5], text: 'y = f(x)' }, { at: [3, 3.5], text: 'y = x' }] }, extra);

	add('inv-mobius-coeff', 'Rational inverses', 2, (r) => {
		const a = r.nonzeroInt(-3, 3), b = r.nonzeroInt(-3, 3), c = r.nonzeroInt(-3, 3);
		let d = r.nonzeroInt(-3, 3);
		if (a * d === b * c) { d += d > 0 ? 1 : -1; }
		return { marks: 5, text: `For f(x)=${F.frac(lin(a, b), lin(c, d))}, write f${F.sup('&minus;1')}(x) in the form ${F.frac('Ax+B', 'Cx+D')}. Find A, B, C and D using the normalisation A=&minus;d.`, answer: multi([-d, b, c, -a], ['A', 'B', 'C', 'D']), solution: `<p>Set y=f(x), collect the x-terms, then swap variables.</p><p>f${F.sup('&minus;1')}(x)=${F.frac(`${-d}x${F.st(b, '')}`, `${c}x${F.st(-a, '')}`)}.</p>` };
	});

	add('inv-mobius-evaluate', 'Rational inverses', 2, (r) => {
		let a = r.nonzeroInt(-3, 3), b = r.nonzeroInt(-3, 3), c = r.nonzeroInt(-2, 2), d = r.nonzeroInt(-3, 3), t = r.int(-3, 3);
		if (a * d === b * c) b += b > 0 ? 1 : -1;
		if (c * t + d === 0) t++;
		const y = (a * t + b) / (c * t + d);
		return { marks: 4, text: `Let f(x)=${F.frac(lin(a, b), lin(c, d))}. Without fully simplifying the inverse rule, evaluate f${F.sup('&minus;1')}(${MG.round(y, 3)}), correct to 2 decimal places.`, answer: { type: 'numeric', value: t, tolerance: 0.02, label: 'value (2 d.p.)' }, solution: `<p>Solve ${F.frac(lin(a, b, 'u'), lin(c, d, 'u'))}=${MG.round(y, 3)} for u.</p><p>u=<strong>${t}</strong> (2 d.p.).</p>` };
	});

	add('inv-domain-branch', 'Domain restriction', 1, (r) => {
		const h = r.int(-3, 3), side = r.pick([-1, 1]), correct = side > 0 ? `x ≥ ${h}` : `x ≤ ${h}`, choices = r.shuffle([correct, side > 0 ? `x ≤ ${h}` : `x ≥ ${h}`, `x > ${h + 1}`, 'all real x']);
		return { marks: 4, text: `For f(x)=(x${F.st(-h, '')})${F.sup(2)}, choose the maximal domain containing ${h + side * 2} on which f has an inverse function.`, answer: { type: 'mc', choices, correct: choices.indexOf(correct) }, solution: `<p>The turning point is at x=${h}; choose the monotonic branch containing the stated point: <strong>${correct}</strong>.</p>` };
	});

	add('inv-quadratic-range', 'Domain restriction', 2, (r) => {
		const h = r.int(-3, 3), k = r.int(-3, 3), w = r.int(2, 4), top = k + w * w;
		return { marks: 4, text: `On ${h}&le;x&le;${h + w}, f(x)=(x${F.st(-h, '')})${F.sup(2)}${F.st(k, '')}. Find the endpoints of the domain of f${F.sup('&minus;1')}.`, answer: multi([k, top], ['lower endpoint', 'upper endpoint']), solution: `<p>The inverse domain is the range of f. It runs from the vertex value ${k} to ${top}.</p>` };
	});

	add('inv-composition-identity', 'Inverse reasoning', 1, (r) => {
		const x = r.int(-3, 3), a = r.nonzeroInt(-4, 4), b = r.int(-3, 3), correct = x, choices = r.shuffle([...new Set([correct, a * x + b, x + b, -x, a])].slice(0, 4).map(String));
		return { marks: 3, text: `If f is one-to-one and f(${x})=${a * x + b}, what is f${F.sup('&minus;1')}(f(${x}))?`, answer: { type: 'mc', choices, correct: choices.indexOf(String(correct)) }, solution: `<p>An inverse undoes f on its domain, so the answer is <strong>${x}</strong>.</p>` };
	});

	add('inv-graph-asymptote', 'Graphs of inverses', 2, (r) => {
		const h = r.int(-3, 3), k = r.int(-3, 3), q = r.nonzeroInt(-3, 3), f = x => k + q / (x - h), inv = x => h + q / (x - k);
		return { marks: 4, text: `The graph shows y=f(x), its reflection in y=x, and dashed asymptote guides. Find the vertical asymptote of f${F.sup('&minus;1')}.`, diagram: plot(f, inv, { vlines: [{ x: h }], hlines: [{ y: k }] }), answer: { type: 'numeric', value: k, tolerance: 0.001, label: 'x-coordinate' }, solution: `<p>The horizontal asymptote y=${k} of f reflects to the vertical asymptote <strong>x=${k}</strong> of its inverse.</p>` };
	});

	add('inv-composite-chain', 'Composite inverses', 2, (r) => {
		const a = r.nonzeroInt(-3, 3), b = r.int(-3, 3), m = r.nonzeroInt(-3, 3), n = r.int(-3, 3), x = r.int(-3, 3), value = m * (a * x + b) + n;
		return { marks: 5, text: `Let f(x)=${lin(a, b)} and g(x)=${lin(m, n)}. Explain why (f&compfn;g)${F.sup('&minus;1')}=g${F.sup('&minus;1')}&compfn;f${F.sup('&minus;1')}, then evaluate (f&compfn;g)${F.sup('&minus;1')}(${value}).`, answer: { type: 'numeric', value: x, tolerance: 0.001, label: 'value' }, solution: `<p>Inverse operations are applied in reverse order. Apply f${F.sup('&minus;1')} then g${F.sup('&minus;1')} to obtain <strong>${x}</strong>.</p>` };
	});

	add('inv-exponential', 'Exponential and logarithmic inverses', 2, (r) => {
		const a = r.int(1, 3), base = r.pick([2, 3, 5]), c = r.int(-2, 2), x = r.int(0, 3), input = a * base ** x + c;
		return { marks: 5, text: `For f(x)=${a}(${base})${F.sup('x')}${F.st(c, '')}, derive f${F.sup('&minus;1')}(x), then evaluate f${F.sup('&minus;1')}(${input}) correct to 2 decimal places.`, answer: { type: 'numeric', value: x, tolerance: 0.02, label: 'value (2 d.p.)' }, solution: `<p>f${F.sup('&minus;1')}(x)=log${F.sub ? F.sub(base) : `<sub>${base}</sub>`}${F.frac(`x${F.st(-c, '')}`, a)}.</p><p>The value is <strong>${x}</strong> (2 d.p.).</p>` };
	});

	add('inv-log-pair', 'Exponential and logarithmic inverses', 2, (r) => {
		const base = r.pick([2, 3, 5]), h = r.int(-2, 2), k = r.int(-2, 2), t = r.int(1, 3), value = h + base ** (t - k);
		return { marks: 4, text: `The inverse of f(x)=log<sub>${base}</sub>(x${F.st(-h, '')})${F.st(k, '')} is exponential. Find f${F.sup('&minus;1')}(${t}), correct to 2 decimal places.`, answer: { type: 'numeric', value, tolerance: 0.02, label: 'value (2 d.p.)' }, solution: `<p>Swap x and y: f${F.sup('&minus;1')}(x)=${h}+${base}${F.sup(`x${F.st(-k, '')}`)}.</p><p>The value is <strong>${value}</strong> (2 d.p.).</p>` };
	});

	add('inv-quadratic-chain', 'Restricted inverses', 3, (r) => {
		const h = r.int(-3, 3), k = r.int(-2, 2), a = r.pick([1, 2, 3]), t = r.int(1, 3), v = a * t * t + k;
		return { marks: 7, text: `(i) Show f(x)=${a}(x${F.st(-h, '')})${F.sup(2)}${F.st(k, '')} is one-to-one on x&ge;${h}. (ii) Write f${F.sup('&minus;1')}(x)=h+A√(B(x&minus;k)) and find A and B. (iii) Hence evaluate f${F.sup('&minus;1')}(${v}). Enter A, B and the final value.`, answer: multi([1, 1 / a, h + t], ['A', 'B exact', 'inverse value']), solution: `<p>On the stated branch f is increasing. Taking the positive root gives f${F.sup('&minus;1')}(x)=${h}+√(${F.frac(`x${F.st(-k, '')}`, a)}).</p><p>A=1, B=${1 / a}; the final value is ${h + t}.</p>` };
	});

	add('inv-graph-quadratic', 'Graphs of inverses', 3, (r) => {
		const h = r.int(-2, 2), k = r.int(-2, 2), t = r.int(1, 3), f = x => x < h ? null : (x - h) ** 2 + k, inv = x => x < k ? null : h + Math.sqrt(x - k), value = h + t;
		return { marks: 6, text: `The restricted graph y=f(x)=(x${F.st(-h, '')})${F.sup(2)}${F.st(k, '')}, x&ge;${h}, and its inverse are shown with y=x. If f(x)=${t * t + k}, find x on the restricted branch.`, diagram: plot(f, inv, { endpoints: [{ at: [h, k], open: false }], vlines: [{ x: t * t + k }], hlines: [{ y: value }] }), answer: { type: 'numeric', value, tolerance: 0.001, label: 'x' }, solution: `<p>Choose the positive-root branch: x=${h}+√${t * t}=<strong>${value}</strong>.</p>` };
	});

	add('inv-mobius-chain', 'Rational inverses', 3, (r) => {
		let a = r.nonzeroInt(-3, 3), b = r.nonzeroInt(-3, 3), c = r.nonzeroInt(-2, 2), d = r.nonzeroInt(-3, 3), t = r.int(-2, 2);
		if (a * d === b * c) b += 1;
		if (c * t + d === 0) t += 1;
		const y = (a * t + b) / (c * t + d);
		return { marks: 7, text: `(i) Find f${F.sup('&minus;1')} for f(x)=${F.frac(lin(a, b), lin(c, d))}. (ii) State its excluded domain value. (iii) Verify f${F.sup('&minus;1')}(f(x))=x and hence evaluate f${F.sup('&minus;1')}(${MG.round(y, 3)}) correct to 2 decimal places.`, answer: { type: 'numeric', value: t, tolerance: 0.02, label: 'final value (2 d.p.)' }, solution: `<p>f${F.sup('&minus;1')}(x)=${F.frac(`${b}${F.st(-d, 'x')}`, `${c}x${F.st(-a, '')}`)}, excluding x=${a / c}. Direct composition simplifies to x.</p><p>The final value is <strong>${t}</strong> (2 d.p.).</p>` };
	});
})();
