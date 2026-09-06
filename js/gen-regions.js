// Inequalities and regions question generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Inequalities & Regions', subtopic, difficulty, gen });
	const line = (m, c) => `${F.lt(m, 'x')}${F.st(c, '')}`;
	const graph = (fns, extra = {}) => ({ type: 'graph', grid: true, xmin: -3, xmax: 3, ymin: -3, ymax: 3, xstep: 1, ystep: 1, fns, ...extra });
	const shuffledMC = (r, correct, wrong) => {
		const choices = r.shuffle([correct, ...wrong]);
		return { type: 'mc', choices, correct: choices.indexOf(correct) };
	};

	add('reg-quadratic-between', 'Quadratic inequalities', 2, (r) => {
		const a = r.int(-2, 0), b = a + r.int(1, 2), h = r.int(0, 2), k = r.pick([1, 2]);
		const parabola = (x) => k * (x - a) * (x - b) + h;
		const wording = r.pick(['left and right x-extremes', 'two horizontal endpoints', 'minimum and maximum x-values', 'two boundary-intersection abscissae']);
		return { marks: 3, text: `The shown region is on or above the parabola with leading coefficient ${k} and on or below y=${h}. Find its ${wording}.`, diagram: graph([{ fn: parabola }, { fn: () => h }]), answer: { type: 'multinumeric', values: [a, b], labels: ['left extreme', 'right extreme'], tolerance: 0.001 }, solution: `<p>At an extreme the boundaries meet: ${k}(x${F.st(-a, '')})(x${F.st(-b, '')})=0. Hence the extremes are <strong>${a} and ${b}</strong>.</p>` };
	});

	add('reg-quadratic-outside', 'Quadratic inequalities', 2, (r) => {
		const a = r.int(-2, 0), b = a + r.int(1, 2), c = r.int(-1, 1), strict = r.pick([true, false]);
		const outside = r.pick([true, false]), rel = outside ? (strict ? '&gt;' : '&ge;') : (strict ? '&lt;' : '&le;'), prefix = r.pick(['', 'Solution: ', 'Required set: ']), correct = prefix + (outside ? `x ${strict ? '&lt;' : '&le;'} ${a} or x ${strict ? '&gt;' : '&ge;'} ${b}` : `${a} ${strict ? '&lt;' : '&le;'} x ${strict ? '&lt;' : '&le;'} ${b}`);
		return { marks: 3, text: `For the displayed parabola y=(x${F.st(-a, '')})(x${F.st(-b, '')})${F.st(c, '')}, identify where y ${rel} ${c}.`, diagram: graph([{ fn: (x) => (x - a) * (x - b) + c }, { fn: () => c }]), answer: shuffledMC(r, correct, [outside ? `${a} ${strict ? '&lt;' : '&le;'} x ${strict ? '&lt;' : '&le;'} ${b}` : `x ${strict ? '&lt;' : '&le;'} ${a} or x ${strict ? '&gt;' : '&ge;'} ${b}`, `x ${strict ? '&gt;' : '&ge;'} ${a}`, `x ${strict ? '&lt;' : '&le;'} ${b}`]), solution: `<p>Compare the upward-opening parabola with its root-level on each interval. Thus <strong>${correct}</strong>.</p>` };
	});

	add('reg-absolute-bounds', 'Absolute value', 2, (r) => {
		const cx = r.int(-1, 1), cy = r.int(-1, 1), rad = r.pick([1, 2]), floor = cy - rad + r.pick([0, 1]);
		const top = cy + Math.sqrt(rad * rad - (cx - cx) ** 2);
		return { marks: 3, text: `A region is inside (x${F.st(-cx, '')})${F.sup(2)}+(y${F.st(-cy, '')})${F.sup(2)} &le; ${rad * rad}, above y=${floor}, and to the right of x=${cx}. Find its greatest y-coordinate.`, diagram: graph([{ fn: () => floor }, { fn: (x) => 20 * (x - cx) }], { circles: [{ c: [cx, cy], r: rad }] }), answer: { type: 'numeric', value: top, tolerance: 0.001, label: 'greatest y-coordinate' }, solution: `<p>The highest point of the circle is directly above its centre and satisfies both linear constraints. Its y-coordinate is ${cy}+${rad}=<strong>${top}</strong>.</p>` };
	});

	add('reg-absolute-outside', 'Absolute value', 2, (r) => {
		const c = r.int(-1, 1), d = r.pick([1, 2]), strict = r.pick([true, false]), noun = r.pick(['lines', 'boundaries', 'parallel edges']), correct = `Outside the two ${noun}${strict ? ', with neither included' : ', with both included'}`;
		return { marks: 3, text: `The diagram shows y=x${F.st(c - d, '')} and y=x${F.st(c + d, '')}. Which description matches |y&minus;x${F.st(-c, '')}| ${strict ? '&gt;' : '&ge;'} ${d}?`, diagram: graph([{ fn: (x) => x + c - d }, { fn: (x) => x + c + d }]), answer: shuffledMC(r, correct, ['Between the lines, including both lines', 'Between the lines, excluding both lines', 'Above both lines only']), solution: `<p>The absolute value measures displacement from y=x${F.st(c, '')}. Values at least ${d} away lie outside the strip. Therefore <strong>${correct}</strong>.</p>` };
	});

	add('reg-absolute-equation-check', 'Absolute value', 2, (r) => {
		const a = r.int(-2, 2), m = r.pick([-2, -1, 1, 2]), n = r.int(-2, 2);
		const candidates = [(a + n) / (1 - m), (a - n) / (m + 1)].filter(Number.isFinite);
		const valid = candidates.filter((x, i, ar) => Math.abs(Math.abs(x - a) - (m * x + n)) < 1e-8 && ar.indexOf(x) === i).length;
		return { marks: 3, text: `For |x${F.st(-a, '')}|=${line(m, n)}, state the centre, solve both linear cases and reject candidates that fail the original equation.`, answer: { type: 'multinumeric', values: [a, valid], labels: ['centre', 'number of solutions'], tolerance: 0.001 }, solution: `<p>The centre is ${a}. The two cases produce candidates, but the right side must be non-negative. Substitution leaves <strong>${valid}</strong> distinct real solution(s).</p>` };
	});

	add('reg-rational', 'Rational inequalities', 2, (r) => {
		const pole = r.int(-2, 1), zero = pole + r.pick([1, 2]), strict = r.pick([true, false]);
		const correct = `${pole} &lt; x ${strict ? '&lt;' : '&le;'} ${zero}`;
		return { marks: 3, text: `Solve ${F.frac(`${zero}&minus;x`, `x${F.st(-pole, '')}`)} ${strict ? '&gt;' : '&ge;'} 0.`, diagram: graph([{ fn: (x) => (zero - x) / (x - pole) }]), answer: shuffledMC(r, correct, [`x &lt; ${pole} or x &gt; ${zero}`, `${pole} &le; x &le; ${zero}`, `x ${strict ? '&gt;' : '&ge;'} ${zero}`]), solution: `<p>The denominator changes sign at x=${pole}, which is always excluded; the numerator is zero at x=${zero}. A sign chart gives <strong>${correct}</strong>.</p>` };
	});

	add('reg-point-test', 'Regions in the plane', 2, (r) => {
		const m = r.pick([-1, 1]), c = r.int(-1, 1), rad = r.pick([1, 2]), strict = r.pick([true, false]);
		const shift = r.pick([-1, 0, 1]), pts = [[0, c], [shift, c + 1], [2, c - 1], [-2, c + 2]];
		const sat = (p) => (strict ? p[1] > m * p[0] + c : p[1] >= m * p[0] + c) && p[0] * p[0] + (p[1] - c) ** 2 <= rad * rad;
		const value = pts.filter(sat).length;
		return { marks: 3, text: `How many of ${pts.map((p) => F.pt(p[0], p[1])).join(', ')} satisfy both y ${strict ? '&gt;' : '&ge;'} ${line(m, c)} and x${F.sup(2)}+(y${F.st(-c, '')})${F.sup(2)} &le; ${rad * rad}?`, diagram: graph([{ fn: (x) => m * x + c }], { circles: [{ c: [0, c], r: rad }], points: pts }), answer: { type: 'numeric', value, tolerance: 0.001, label: 'number of points' }, solution: `<p>Test each point in both constraints, noting that equality ${strict ? 'is excluded on the line' : 'is included'}. Exactly <strong>${value}</strong> points satisfy both.</p>` };
	});

	add('reg-system-description', 'Regions in the plane', 2, (r) => {
		const m = r.pick([-1, 1]), c = r.int(-1, 1), rad = r.pick([1, 2]), above = r.pick([true, false]);
		const correct = `Inside/on the circle and ${above ? 'above/on' : 'below/on'} the line`;
		return { marks: 3, text: `The boundaries are the shown line y=${line(m, c)} and circle x${F.sup(2)}+y${F.sup(2)}=${rad * rad}. The intended shaded part contains the point ${F.pt(0, above ? rad : -rad)}. Which system describes it?`, diagram: graph([{ fn: (x) => m * x + c }], { circles: [{ c: [0, 0], r: rad }] }), answer: shuffledMC(r, correct, [`Outside the circle and ${above ? 'above' : 'below'} the line`, `Inside/on the circle and ${above ? 'below/on' : 'above/on'} the line`, 'Inside the circle and on the line only']), solution: `<p>The named test point selects the stated side of the line, while the required bounded part is inside the circle. Choose <strong>${correct}</strong>.</p>` };
	});

	add('reg-lattice-count', 'Regions in the plane', 2, (r) => {
		const rad = r.pick([1, 2]), h = r.int(-1, 1), strict = r.pick([true, false]), points = [];
		for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) if (x * x + y * y <= rad * rad && (strict ? y > h : y >= h)) points.push([x, y]);
		const value = points.length;
		return { marks: 3, text: `Count the integer lattice points inside/on x${F.sup(2)}+y${F.sup(2)} &le; ${rad * rad} that also satisfy y ${strict ? '&gt;' : '&ge;'} ${h}.`, diagram: graph([{ fn: () => h }], { circles: [{ c: [0, 0], r: rad }] }), answer: { type: 'numeric', value, tolerance: 0.001, label: 'lattice points' }, solution: `<p>Enumerating integer coordinates in the circle and then applying the horizontal constraint gives <strong>${value}</strong> points.</p>` };
	});

	add('reg-parabola-intersection', 'Intersection & union', 3, (r) => {
		const p = r.int(-2, 0), q = p + r.pick([1, 2]), h = r.int(-1, 1), ceiling = h + r.pick([1, 2]);
		return { marks: 4, text: `The feasible region lies above y=(x${F.st(-p, '')})(x${F.st(-q, '')})${F.st(h, '')}, below y=${h}, and below y=${ceiling}. Find its x-interval.`, diagram: graph([{ fn: (x) => (x - p) * (x - q) + h }, { fn: () => h }, { fn: () => ceiling }]), answer: { type: 'multinumeric', values: [p, q], labels: ['left endpoint', 'right endpoint'], tolerance: 0.001 }, solution: `<p>The tighter horizontal boundary is y=${h}. Equating it to the parabola gives (x${F.st(-p, '')})(x${F.st(-q, '')})=0. Hence <strong>${p} &le; x &le; ${q}</strong>.</p>` };
	});

	add('reg-triangle-area', 'Intersection & union', 2, (r) => {
		const a = r.pick([1, 2]), b = r.pick([1, 2]), value = a * b / 2, lead = r.pick(['A feasible region', 'The admissible set', 'The bounded solution region', 'A polygonal region']);
		return { marks: 3, text: `${lead} satisfies x &ge; 0, y &ge; 0, x/${a}+y/${b} &le; 1 and x+y &le; 3. Find its area in square units.`, diagram: graph([{ fn: (x) => b - b * x / a }, { fn: (x) => 3 - x }]), answer: { type: 'numeric', value, tolerance: 0.001, label: 'area (exact)' }, solution: `<p>The first three constraints form a right triangle with intercepts ${a} and ${b}; the final constraint is redundant. Area=${F.frac(1, 2)}&times;${a}&times;${b}=<strong>${value}</strong> square units.</p>` };
	});

	add('reg-full-analysis', 'Intersection & union', 3, (r) => {
		const w = r.pick([1, 2]), h = r.pick([1, 2]), sx = r.pick([-1, 0]), sy = r.pick([-1, 0]);
		const vertices = [[sx, sy], [sx + w, sy], [sx + w, sy + h], [sx, sy + h]];
		const scores = vertices.map((p) => p[0] + p[1]), value = Math.max(...scores), winner = scores.indexOf(value) + 1;
		return { marks: 6, text: `The feasible polygon satisfies x &ge; ${sx}, x &le; ${sx + w}, y &ge; ${sy}, y &le; ${sy + h}, and x+y &le; ${value}. (1) List its four vertices in anticlockwise order from the lower-left. (2) Find the maximum of x+y. (3) Enter the vertex number where it occurs.`, diagram: graph([{ fn: () => sy }, { fn: () => sy + h }, { fn: (x) => value - x }, { fn: (x) => 20 * (x - sx) }, { fn: (x) => 20 * (x - sx - w) }]), answer: { type: 'multinumeric', values: [...vertices.flat(), value, winner], labels: ['v1 x', 'v1 y', 'v2 x', 'v2 y', 'v3 x', 'v3 y', 'v4 x', 'v4 y', 'maximum', 'vertex number'], tolerance: 0.001 }, solution: `<p>The axis-aligned boundaries give vertices ${vertices.map((p) => F.pt(p[0], p[1])).join(', ')}. A linear expression is maximised at a vertex; evaluating x+y gives its maximum at vertex ${winner}. Thus the maximum is <strong>${value}</strong>.</p>` };
	});
})();
