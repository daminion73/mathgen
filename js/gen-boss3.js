// Boss batch 3: algebra, functions and sequences multi-part chains.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const rad = MG.degToRad;
	const dp = (x, d) => MG.round(x, d);
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 3, gen });
	const num = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	// Boss questions should read as connected written-work tasks, rather than a
	// collection of short-answer prompts.  Make the opening part explicitly
	// require the model/reasoning which the later parts build on.
	const br = (i, s) => `<br><strong>(${i})</strong> ${i === 'i' ? 'Show that the given information leads to a definite result, stating the equation or rule used. Hence ' : ''}${s.charAt(0).toLowerCase()}${s.slice(1)}`;

	// 1. Tangency via the discriminant
	boss('boss3-discriminant-tangent', 'Discriminants + Tangency', function (r) {
		let m, e, b, d;
		do {
			m = r.int(-3, 3);
			e = r.nonzeroInt(-3, 3);
			b = m + 2 * e;
			d = r.int(-5, 8);
		} while (m === -e);
		const k = d - e * e;
		const x0 = -e;
		const y0 = x0 * x0 + b * x0 + d;
		return {
			marks: 6,
			text: `The line y = ${F.poly([m, 0])} + k is a tangent to the parabola y = ${F.poly([1, b, d])}.${br('i', 'Find the value of k.')}${br('ii', 'Find the x-coordinate of the point where the line touches the parabola.')}${br('iii', 'Find the y-coordinate of that point.')}`,
			diagram: { type: 'graph', xmin: -10, xmax: 10, ymin: -30, ymax: 150, grid: true, fns: [{ fn: (x) => x * x + b * x + d }] },
			answer: multi([k, x0, y0], ['k', 'x-coordinate', 'y-coordinate']),
			solution: `<p>(i) At an intersection, ${F.poly([1, b, d])} = ${F.poly([m, 0])} + k, i.e. ${F.poly([1, b - m])}${F.st(d, '')} &minus; k = 0.</p>
<p>Tangency means a repeated root, so the discriminant is zero: (${b - m})&sup2; &minus; 4(${d} &minus; k) = 0, giving k = ${d} &minus; ${F.frac(`${(b - m) * (b - m)}`, '4')} = <strong>${k}</strong>.</p>
<p>(ii) The repeated root is x = ${F.frac(`&minus;(${b - m})`, '2')} = <strong>${x0}</strong>.</p>
<p>(iii) Substituting into the parabola: y = ${x0}&sup2;${F.st(b * x0, '')}${F.st(d, '')} = <strong>${y0}</strong>.</p>`,
		};
	});

	// 2. Line meets circle: chord
	boss('boss3-line-circle-chord', 'Lines + Circles', function (r) {
		let p, q;
		do { p = r.int(-6, 6); q = r.int(-6, 6); } while (p >= q);
		const c = -(p + q);
		const R2 = c * c - 2 * p * q;
		const chord = Math.SQRT2 * (q - p);
		const dist = Math.abs(c) / Math.SQRT2;
		return {
			marks: 6,
			text: `The line y = x${F.st(c, '')} meets the circle x&sup2; + y&sup2; = ${R2} at two points. Give answers correct to 2 decimal places where necessary.${br('i', 'Find the x-coordinates of the two intersection points (smaller first).')}${br('ii', 'Find the length of the chord joining them.')}${br('iii', 'Find the perpendicular distance from the centre of the circle to the line.')}`,
			diagram: { type: 'graph', xmin: -16, xmax: 16, ymin: -16, ymax: 16, grid: true, fns: [{ fn: (x) => x + c }], circles: [{ c: [0, 0], r: Math.sqrt(R2), mark: true }] },
			answer: multi([p, q, dp(chord, 2), dp(dist, 2)], ['smaller x', 'larger x', 'chord length', 'distance'], 0.006),
			solution: `<p>(i) Substitute y = x${F.st(c, '')}: x&sup2; + (x${F.st(c, '')})&sup2; = ${R2}, which simplifies to 2x&sup2;${F.st(2 * c, 'x')}${F.st(c * c - R2, '')} = 0, i.e. x&sup2;${F.st(c, 'x')}${F.st((c * c - R2) / 2, '')} = 0.</p>
<p>Factorising: (x${F.st(-p, '')})(x${F.st(-q, '')}) = 0, so x = <strong>${p}</strong> and x = <strong>${q}</strong>.</p>
<p>(ii) The points are (${p}, ${p + c}) and (${q}, ${q + c}). Both coordinates change by ${q - p}, so the chord = &radic;2 &times; ${q - p} = <strong>${dp(chord, 2)}</strong>.</p>
<p>(iii) Half-chord and distance satisfy d&sup2; + (${dp(chord / 2, 3)})&sup2; = R&sup2; = ${R2}; equivalently d = ${F.frac(`|${c}|`, '&radic;2')} = <strong>${dp(dist, 2)}</strong>.</p>`,
		};
	});

	// 3. Vertex form chain
	boss('boss3-vertex-chain', 'Completing the square + Vertex', function (r) {
		let u, v, s, t;
		do {
			u = r.int(-6, 4);
			v = u + 2 * r.int(1, 5);
			s = r.int(1, 4);
			t = (v + s - u) * s;
		} while (t === v + s);
		const b = -(u + v), c = u * v;
		const x0 = (u + v) / 2;
		const mn = -((v - u) / 2) * ((v - u) / 2);
		return {
			marks: 6,
			text: `Let y = ${F.poly([1, b, c])}.${br('i', 'Find the x-coordinate of the vertex of the parabola.')}${br('ii', 'Find the minimum value of y.')}${br('iii', `Find the larger solution of ${F.poly([1, b, c])} = ${t}.`)}`,
			diagram: { type: 'graph', xmin: -12, xmax: 12, ymin: -30, ymax: 150, grid: true, fns: [{ fn: (x) => x * x + b * x + c }] },
			answer: multi([x0, mn, v + s], ['vertex x', 'minimum y', 'larger solution']),
			solution: `<p>(i) Completing the square: y = (x${F.st(-x0, '')})&sup2;${F.st(mn, '')}, so the vertex is at x = <strong>${x0}</strong>.</p>
<p>(ii) The squared bracket is at least 0, so the minimum value is <strong>${mn}</strong>.</p>
<p>(iii) ${F.poly([1, b, c])} = ${t} rearranges to ${F.poly([1, b, c - t])} = 0, which factorises as (x${F.st(-(u - s), '')})(x${F.st(-(v + s), '')}) = 0.</p>
<p>The larger solution is x = <strong>${v + s}</strong>.</p>`,
		};
	});

	// 4. Composite and inverse functions
	boss('boss3-composite-inverse', 'Composite + Inverse functions', function (r) {
		let p, q, a, b, c, w, n, m;
		do {
			p = r.int(-4, 3);
			q = p + r.int(1, 5);
			a = p + q;
			b = r.int(-5, 5);
			c = b + p * q;
			m = r.int(2, 4);
			w = r.int(-5, 8);
			n = a * w + b;
		} while (a === 0 || w === n || q === n);
		const fg = a * (m * m + c) + b;
		return {
			marks: 6,
			text: `Let f(x) = ${F.poly([a, b])} and g(x) = x&sup2;${F.st(c, '')}.${br('i', `Find f(g(${m})).`)}${br('ii', `Find f<sup>&minus;1</sup>(${n}).`)}${br('iii', 'Find the larger solution of f(x) = g(x).')}`,
			diagram: { type: 'graph', xmin: -10, xmax: 10, ymin: -20, ymax: 120, grid: true, fns: [{ fn: (x) => a * x + b }, { fn: (x) => x * x + c }] },
			answer: multi([fg, w, q], [`f(g(${m}))`, `f<sup>-1</sup>(${n})`, 'larger solution']),
			solution: `<p>(i) g(${m}) = ${m}&sup2;${F.st(c, '')} = ${m * m + c}, then f(${m * m + c}) = ${F.lt(a, '')} &times; ${m * m + c}${F.st(b, '')} = <strong>${fg}</strong>.</p>
<p>(ii) Solve ${F.poly([a, b])} = ${n}: x = ${F.frac(`${n}${F.st(-b, '')}`, String(a))} = <strong>${w}</strong>.</p>
<p>(iii) f(x) = g(x) gives x&sup2;${F.st(-a, 'x')}${F.st(c - b, '')} = 0, which factorises as (x${F.st(-p, '')})(x${F.st(-q, '')}) = 0.</p>
<p>The larger solution is x = <strong>${q}</strong>.</p>`,
		};
	});

	// 5. Arithmetic series in context
	boss('boss3-arithmetic-series', 'Arithmetic series + Thresholds', function (r) {
		const a = r.int(12, 20), d = r.int(2, 5), n = r.int(8, 15);
		const tn = a + (n - 1) * d;
		const sn = n * (2 * a + (n - 1) * d) / 2;
		const T = 10 * r.int(30, 60);
		let mrows = 1, tot = a;
		while (tot <= T) { mrows++; tot += a + (mrows - 1) * d; }
		return {
			marks: 6,
			text: `The front row of a theatre has ${a} seats, and each row behind has ${d} more seats than the row in front.${br('i', `How many seats are in row ${n}?`)}${br('ii', `How many seats are there in total in the first ${n} rows?`)}${br('iii', `What is the smallest number of rows needed for the theatre to hold more than ${T} seats?`)}`,
			answer: multi([tn, sn, mrows], [`seats in row ${n}`, 'total seats', 'rows needed']),
			solution: `<p>(i) This is an arithmetic sequence with first term ${a} and common difference ${d}: row ${n} has ${a} + ${n - 1} &times; ${d} = <strong>${tn}</strong> seats.</p>
<p>(ii) Sum = ${F.frac('n', '2')}(2a + (n &minus; 1)d) = ${F.frac(String(n), '2')}(${2 * a} + ${(n - 1) * d}) = <strong>${sn}</strong>.</p>
<p>(iii) We need ${F.frac('m', '2')}(${2 * a} + (m &minus; 1) &times; ${d}) &gt; ${T}. Trying values (or solving the quadratic): m = ${mrows - 1} gives ${tot - (a + (mrows - 1) * d)} seats, m = ${mrows} gives ${tot}.</p>
<p>So <strong>${mrows}</strong> rows are needed.</p>`,
		};
	});

	// 6. Geometric series to infinity
	boss('boss3-geometric-series', 'Geometric series + Convergence', function (r) {
		const [nu, de] = r.pick([[1, 2], [1, 3], [2, 3], [3, 4]]);
		const a = (de - nu) * r.int(2, 9);
		const ratio = nu / de;
		const t4 = a * Math.pow(ratio, 3);
		const s5 = a * (1 - Math.pow(ratio, 5)) / (1 - ratio);
		const sinf = a * de / (de - nu);
		return {
			marks: 6,
			text: `A geometric sequence has first term ${a} and common ratio ${F.frac(String(nu), String(de))}. Give answers correct to 3 decimal places where necessary.${br('i', 'Find the 4th term.')}${br('ii', 'Find the sum of the first 5 terms.')}${br('iii', 'Find the sum to infinity.')}`,
			answer: multi([dp(t4, 3), dp(s5, 3), sinf], ['4th term', 'sum of 5 terms', 'sum to infinity'], 0.0006),
			solution: `<p>(i) T&#8324; = ar&sup3; = ${a} &times; (${F.frac(String(nu), String(de))})&sup3; = ${a} &times; ${F.frac(String(nu ** 3), String(de ** 3))} = <strong>${dp(t4, 3)}</strong>.</p>
<p>(ii) S&#8325; = ${F.frac('a(1 &minus; r&#8309;)', '1 &minus; r')} = ${F.frac(`${a}(1 &minus; ${dp(Math.pow(ratio, 5), 5)})`, `${dp(1 - ratio, 4)}`)} = <strong>${dp(s5, 3)}</strong>.</p>
<p>(iii) Since |r| &lt; 1 the series converges: S&#8734; = ${F.frac('a', '1 &minus; r')} = ${F.frac(String(a), `${de - nu}/${de}`)} = <strong>${sinf}</strong>.</p>`,
		};
	});

	// 7. Quadratic sequence
	boss('boss3-quadratic-sequence', 'Quadratic sequences + nth term', function (r) {
		let a, b, c;
		do { a = r.int(1, 3); b = r.int(-2, 4); c = r.int(-3, 5); } while (3 * a + b <= 0);
		const term = (n) => a * n * n + b * n + c;
		const n = r.int(10, 14);
		const T = r.int(150, 400);
		let m = 1;
		while (term(m) <= T) m++;
		return {
			marks: 6,
			text: `A sequence has first four terms ${term(1)}, ${term(2)}, ${term(3)}, ${term(4)}. Its nth term is a quadratic in n.${br('i', 'Use the second differences to find the coefficient of n&sup2;.')}${br('ii', `Find the value of term ${n}.`)}${br('iii', `Find the position of the first term greater than ${T}.`)}`,
			answer: multi([a, term(n), m], ['coefficient of n&sup2;', `term ${n}`, 'position']),
			solution: `<p>(i) First differences: ${term(2) - term(1)}, ${term(3) - term(2)}, ${term(4) - term(3)}; second difference ${2 * a} throughout. The coefficient of n&sup2; is half of that: <strong>${a}</strong>.</p>
<p>(ii) Fitting the remaining coefficients gives the nth term ${F.poly([a, b, c], 'n')}. At n = ${n}: ${a} &times; ${n * n}${F.st(b * n, '')}${F.st(c, '')} = <strong>${term(n)}</strong>.</p>
<p>(iii) The terms increase for all n &ge; 1. Term ${m - 1} is ${term(m - 1)} and term ${m} is ${term(m)}, so the first term over ${T} is at position <strong>${m}</strong>.</p>`,
		};
	});

	// 8. Log laws chain
	boss('boss3-log-chain', 'Log laws + Evaluation', function (r) {
		let b, p, q;
		do {
			b = r.pick([2, 3, 5]);
			p = r.int(2, 4);
			q = r.int(1, 4);
		} while (q === p || Math.pow(b, p) > 700);
		const x = Math.pow(b, p);
		return {
			marks: 6,
			text: `Suppose log<sub>${b}</sub> x = ${p} and log<sub>${b}</sub> y = ${q}. Give answers correct to 3 decimal places where necessary.${br('i', 'Find log<sub>' + b + '</sub>(x&sup2;y).')}${br('ii', 'Find log<sub>' + b + '</sub>(' + b + 'x/y).')}${br('iii', 'Find the value of x.')}${br('iv', 'Find log<sub>x</sub> ' + b + '.')}`,
			answer: multi([2 * p + q, 1 + p - q, x, dp(1 / p, 3)], ['log of x&sup2;y', `log of ${b}x/y`, 'x', `log_x ${b}`], 0.0006),
			solution: `<p>(i) log(x&sup2;y) = 2 log x + log y = 2 &times; ${p} + ${q} = <strong>${2 * p + q}</strong>.</p>
<p>(ii) log(${b}x/y) = log ${b} + log x &minus; log y = 1 + ${p} &minus; ${q} = <strong>${1 + p - q}</strong>.</p>
<p>(iii) log<sub>${b}</sub> x = ${p} means x = ${b}<sup>${p}</sup> = <strong>${x}</strong>.</p>
<p>(iv) By the change-of-base rule, log<sub>x</sub> ${b} = ${F.frac('1', `log<sub>${b}</sub> x`)} = ${F.frac('1', String(p))} = <strong>${dp(1 / p, 3)}</strong>.</p>`,
		};
	});

	// 9. Half-life decay
	boss('boss3-decay-halflife', 'Half-life + Logarithmic time', function (r) {
		let M0, h, k, T, mass, kh;
		do {
			M0 = 80 * r.int(1, 6);
			h = r.pick([3, 4, 5, 6, 8, 10]);
			k = r.int(2, 4);
			kh = k * h;
			mass = M0 / Math.pow(2, k);
			T = r.int(2, 12);
		} while (mass === kh || mass === T || M0 % Math.pow(2, k) !== 0);
		let years = 1;
		while (M0 * Math.pow(0.5, years / h) >= T) years++;
		const m = r.int(5, 20);
		const pct = 100 * Math.pow(0.5, m / h);
		return {
			marks: 6,
			text: `A radioactive sample has mass ${M0} g and a half-life of ${h} years. Give answers correct to 1 decimal place where necessary.${br('i', `Find the mass remaining after ${kh} years.`)}${br('ii', `After how many whole years does the mass first fall below ${T} g?`)}${br('iii', `What percentage of the original mass remains after ${m} years?`)}`,
			answer: multi([mass, years, dp(pct, 1)], ['mass (g)', 'years', 'remaining (%)'], 0.06),
			solution: `<p>(i) ${kh} years is ${k} half-lives, so the mass is ${M0} &times; (${F.frac('1', '2')})<sup>${k}</sup> = <strong>${mass} g</strong>.</p>
<p>(ii) We need ${M0} &times; 0.5<sup>t/${h}</sup> &lt; ${T}. Taking logs: t &gt; ${h} &times; log&#8322;(${M0}/${T}) = ${dp(h * Math.log2(M0 / T), 2)}, so the first whole year is <strong>${years}</strong>.</p>
<p>(iii) 0.5<sup>${m}/${h}</sup> = ${dp(Math.pow(0.5, m / h), 4)}, i.e. <strong>${dp(pct, 1)}%</strong> remains.</p>`,
		};
	});

	// 10. Simple vs compound interest race
	boss('boss3-interest-race', 'Simple vs compound interest', function (r) {
		const P = 500 * r.int(2, 10);
		const s = r.int(7, 10);
		const c = s - r.int(2, 4);
		const n = r.int(5, 9);
		const An = P * (1 + n * s / 100);
		const Bn = P * Math.pow(1 + c / 100, n);
		let y = 1;
		while (P * Math.pow(1 + c / 100, y) <= P * (1 + y * s / 100) && y < 300) y++;
		return {
			marks: 6,
			text: `&pound;${P} is invested in each of two accounts. Account A pays ${s}% simple interest per year; account B pays ${c}% compound interest per year. Give money answers correct to 2 decimal places where necessary.${br('i', `Find the value of account A after ${n} years.`)}${br('ii', `Find the value of account B after ${n} years.`)}${br('iii', 'Find the first whole year at the end of which account B is worth more than account A.')}`,
			answer: multi([An, dp(Bn, 2), y], ['A (&pound;)', 'B (&pound;)', 'year'], 0.006),
			solution: `<p>(i) Simple interest adds ${F.frac(String(s), '100')} &times; ${P} = &pound;${P * s / 100} each year: after ${n} years, ${P} + ${n} &times; ${P * s / 100} = <strong>&pound;${An}</strong>.</p>
<p>(ii) Compound: ${P} &times; ${dp(1 + c / 100, 2)}<sup>${n}</sup> = <strong>&pound;${dp(Bn, 2)}</strong>.</p>
<p>(iii) B grows exponentially and A only linearly, so B eventually overtakes. Checking year by year, at the end of year ${y - 1}: B = &pound;${dp(P * Math.pow(1 + c / 100, y - 1), 2)} vs A = &pound;${dp(P * (1 + (y - 1) * s / 100), 2)}; at the end of year ${y}: B = &pound;${dp(P * Math.pow(1 + c / 100, y), 2)} vs A = &pound;${dp(P * (1 + y * s / 100), 2)}.</p>
<p>The first year B is ahead is year <strong>${y}</strong>.</p>`,
		};
	});

	// 11. Rectangle from perimeter and area
	boss('boss3-rectangle-quadratic', 'Quadratics + Rectangles', function (r) {
		const W = r.int(4, 10), L = W + r.int(1, 6);
		const p = 2 * (L + W), A = L * W;
		const diag = Math.sqrt(L * L + W * W);
		return {
			marks: 6,
			text: `A rectangle has perimeter ${p} cm and area ${A} cm&sup2;.${br('i', 'Find its length (the longer side). <em>Hint: form a quadratic whose roots are the two sides.</em>')}${br('ii', 'Find its width.')}${br('iii', 'Find the length of its diagonal, correct to 2 decimal places.')}`,
			diagram: { type: 'quad', pts: [[0, 0], [L, 0], [L, W], [0, W]], labels: ['', '', '', ''], rightAngles: [0, 1, 2, 3] },
			answer: multi([L, W, dp(diag, 2)], ['length (cm)', 'width (cm)', 'diagonal (cm)'], 0.006),
			solution: `<p>The sides satisfy L + W = ${p / 2} and LW = ${A}, so they are the roots of x&sup2; &minus; ${p / 2}x + ${A} = 0.</p>
<p>(i)&ndash;(ii) Factorising (or the quadratic formula) gives (x &minus; ${L})(x &minus; ${W}) = 0, so the length is <strong>${L} cm</strong> and the width <strong>${W} cm</strong>.</p>
<p>(iii) Diagonal = &radic;(${L}&sup2; + ${W}&sup2;) = &radic;${L * L + W * W} = <strong>${dp(diag, 2)} cm</strong>.</p>`,
		};
	});

	// 12. Surd-sided rectangle
	boss('boss3-surd-rectangle', 'Surds + Exact areas', function (r) {
		const a = r.int(4, 9);
		const b = r.pick([2, 3, 5, 6, 7, 10, 11]);
		const area = a * a - b;
		const per = 4 * a;
		const dsq = 2 * a * a + 2 * b;
		return {
			marks: 6,
			text: `A rectangle has sides (${a} + &radic;${b}) cm and (${a} &minus; &radic;${b}) cm. All answers are exact integers.${br('i', 'Find its area.')}${br('ii', 'Find its perimeter.')}${br('iii', 'Find the <em>square</em> of the length of its diagonal.')}`,
			diagram: { type: 'quad', pts: [[0, 0], [a + Math.sqrt(b), 0], [a + Math.sqrt(b), a - Math.sqrt(b)], [0, a - Math.sqrt(b)]], labels: ['', '', '', ''], sideLabels: [`${a} + &radic;${b} cm`, `${a} &minus; &radic;${b} cm`, '', ''], rightAngles: [0, 1, 2, 3] },
			answer: multi([area, per, dsq], ['area (cm&sup2;)', 'perimeter (cm)', 'diagonal&sup2; (cm&sup2;)']),
			solution: `<p>(i) (${a} + &radic;${b})(${a} &minus; &radic;${b}) = ${a}&sup2; &minus; ${b} = <strong>${area} cm&sup2;</strong> (difference of two squares).</p>
<p>(ii) The surds cancel in the sum of the sides: perimeter = 2[(${a} + &radic;${b}) + (${a} &minus; &radic;${b})] = 4 &times; ${a} = <strong>${per} cm</strong>.</p>
<p>(iii) d&sup2; = (${a} + &radic;${b})&sup2; + (${a} &minus; &radic;${b})&sup2; = (${a * a + b} + 2${a}&radic;${b}) + (${a * a + b} &minus; 2${a}&radic;${b}) = <strong>${dsq} cm&sup2;</strong>.</p>`,
		};
	});

	// 13. Factor theorem on a cubic
	boss('boss3-factor-theorem', 'Factor theorem + Root symmetry', function (r) {
		let m, n2, q, a, b, k, sumsq;
		do {
			m = r.nonzeroInt(-4, 5);
			n2 = r.nonzeroInt(-4, 5);
			q = r.nonzeroInt(-4, 5);
			a = -(m + n2 + q);
			b = m * n2 + m * q + n2 * q;
			k = -m * n2 * q;
			sumsq = a * a - 2 * b;
		} while (m === n2 || n2 === q || m === q || (Math.abs(k) > 3 && (k === a || k === b)) || sumsq === b || sumsq === a);
		return {
			marks: 6,
			text: `The cubic p(x) = x&sup3;${F.st(a, 'x&sup2;')}${F.st(b, 'x')} + k has (x${F.st(-m, '')}) as a factor.${br('i', 'Find the value of k.')}${br('ii', 'Find the sum of the other two roots.')}${br('iii', 'Find the sum of the squares of all three roots.')}`,
			answer: multi([k, n2 + q, sumsq], ['k', 'sum of other roots', 'sum of squares']),
			solution: `<p>(i) By the factor theorem p(${m}) = 0: ${m * m * m}${F.st(a * m * m, '')}${F.st(b * m, '')} + k = 0, so k = <strong>${k}</strong>.</p>
<p>(ii) The sum of all three roots is &minus;(${a}) = ${-a} (Vieta). Subtracting the known root ${m} leaves <strong>${n2 + q}</strong>.</p>
<p>(iii) For roots r&#8321;, r&#8322;, r&#8323;: &Sigma;r&sup2; = (&Sigma;r)&sup2; &minus; 2&Sigma;r&#7522;r&#11388; = (${-a})&sup2; &minus; 2 &times; ${b} = <strong>${sumsq}</strong>.</p>`,
		};
	});

	// 14. Rational equation
	boss('boss3-fraction-equation', 'Rational equations + Domains', function (r) {
		let p, q, x0, aa, bb, mEv;
		do {
			p = r.int(-4, 4);
			q = r.int(-4, 4);
			x0 = Math.max(p, q) + r.int(1, 4);
			aa = (x0 - p) * r.int(1, 3);
			bb = (x0 - q) * (aa / (x0 - p));
			mEv = x0 + r.int(2, 4);
		} while (p === q || x0 === p || x0 === q || (Math.abs(x0) > 3 && (x0 === aa || x0 === bb)) || mEv === p);
		const val = aa / (mEv - p);
		return {
			marks: 6,
			text: `Consider the equation ${F.frac(String(aa), `x${F.st(-p, '')}`)} = ${F.frac(String(bb), `x${F.st(-q, '')}`)}.${br('i', 'Solve the equation.')}${br('ii', `Evaluate the left-hand side at x = ${mEv}, correct to 2 decimal places where necessary.`)}${br('iii', 'Find the sum of the values of x for which the equation is not defined.')}`,
			diagram: { type: 'graph', xmin: -10, xmax: 10, ymin: -10, ymax: 10, grid: true, fns: [{ fn: (x) => x === p ? null : aa / (x - p) }, { fn: (x) => x === q ? null : bb / (x - q) }], vlines: [{ x: p, label: `x = ${p}` }, { x: q, label: `x = ${q}` }], hlines: [{ y: 0, label: 'y = 0' }] },
			answer: multi([x0, dp(val, 2), p + q], ['solution x', 'value', 'sum of excluded x'], 0.006),
			solution: `<p>(i) Cross-multiplying: ${aa}(x${F.st(-q, '')}) = ${bb}(x${F.st(-p, '')}), so ${aa}x${F.st(-aa * q, '')} = ${bb}x${F.st(-bb * p, '')}.</p>
<p>Collecting terms: ${aa - bb}x = ${aa * q - bb * p}, giving x = <strong>${x0}</strong>. (Check: both sides equal ${dp(aa / (x0 - p), 3)}.)</p>
<p>(ii) ${F.frac(String(aa), `${mEv}${F.st(-p, '')}`)} = ${F.frac(String(aa), String(mEv - p))} = <strong>${dp(val, 2)}</strong>.</p>
<p>(iii) The fractions are not defined when a denominator is zero: x = ${p} or x = ${q}, whose sum is <strong>${p + q}</strong>.</p>`,
		};
	});

	// 15. Return-trip quadratic
	boss('boss3-speed-quadratic', 'Speed-time quadratics', function (r) {
		let v, Dl, f, m, D;
		do {
			[v, Dl, f] = r.pick([[10, 5, 2], [10, 10, 3], [30, 10, 0.5], [20, 5, 0.6], [25, 5, 0.4]]);
			D = r.pick([20, 25, 30, 35, 40, 45, 50, 55, 60]);
			m = f * D;
		} while (m !== Math.round(m) || m === D || v === D || v === m);
		const dd = Dl;
		const tout = 60 * D / v;
		const tback = 60 * D / (v + dd);
		const avg = 2 * D / (D / v + D / (v + dd));
		return {
			marks: 7,
			text: `A cyclist rides ${D} km to town at a steady speed of v km/h, and returns along the same road at (v + ${dd}) km/h. The return takes ${m} minutes less than the ride out. Give answers correct to 1 decimal place where necessary.${br('i', 'Find v. <em>Hint: convert the time difference to hours and form a quadratic in v.</em>')}${br('ii', 'Find the time for the ride out, in minutes.')}${br('iii', 'Find the average speed for the whole round trip.')}`,
			answer: multi([v, dp(tout, 1), dp(avg, 1)], ['v (km/h)', 'time out (min)', 'average speed (km/h)'], 0.06),
			solution: `<p>(i) ${F.frac(String(D), 'v')} &minus; ${F.frac(String(D), `v + ${dd}`)} = ${F.frac(String(m), '60')} hours. Multiplying through by v(v + ${dd}):</p>
<p>${60 * D * dd} = ${m}v(v + ${dd}), i.e. v&sup2; + ${dd}v &minus; ${60 * D * dd / m} = 0. Factorising gives (v &minus; ${v})(v + ${v + dd}) = 0, so v = <strong>${v} km/h</strong>.</p>
<p>(ii) Time out = ${F.frac(String(D), String(v))} h = <strong>${dp(tout, 1)} min</strong>. (Return: ${dp(tback, 1)} min &mdash; exactly ${m} less.)</p>
<p>(iii) Average speed = total distance &divide; total time = ${F.frac(String(2 * D), `${dp(D / v + D / (v + dd), 3)}`)} = <strong>${dp(avg, 1)} km/h</strong>.</p>`,
		};
	});

	// 16. Pipes filling a tank
	boss('boss3-pipes', 'Rates + Combined work', function (r) {
		const [a, b] = r.pick([[3, 6], [4, 12], [6, 12], [5, 20], [10, 15], [12, 24], [6, 30], [8, 24], [20, 30], [12, 36]]);
		const togMin = 60 * a * b / (a + b);
		const rate1h = (a + b) / (a * b);
		const cc = Math.ceil(togMin / 60) + r.int(2, 20);
		const netRate = 1 / a + 1 / b - 1 / cc;
		const netMin = 60 / netRate;
		return {
			marks: 6,
			text: `Pipe A fills a tank in ${a} hours; pipe B fills it in ${b} hours. Give answers correct to 2 decimal places where necessary.${br('i', 'What fraction of the tank do the two pipes fill together in one hour? Give your answer as a decimal.')}${br('ii', 'How long, in minutes, do they take to fill the tank together?')}${br('iii', `A drain can empty the full tank in ${cc} hours. With both pipes running and the drain open, how long does filling take, in minutes?`)}`,
			answer: multi([dp(rate1h, 2), togMin, dp(netMin, 1)], ['fraction per hour', 'time (min)', 'time with drain (min)'], 0.006),
			solution: `<p>(i) Per hour: ${F.frac('1', String(a))} + ${F.frac('1', String(b))} = ${F.frac(String(a + b), String(a * b))} = <strong>${dp(rate1h, 2)}</strong> of the tank.</p>
<p>(ii) Time = 1 &divide; rate = ${F.frac(String(a * b), String(a + b))} hours = <strong>${togMin} minutes</strong>.</p>
<p>(iii) Net rate = ${F.frac('1', String(a))} + ${F.frac('1', String(b))} &minus; ${F.frac('1', String(cc))} = ${dp(netRate, 4)} tanks/hour, so time = ${F.frac('60', String(dp(netRate, 4)))} = <strong>${dp(netMin, 1)} minutes</strong>.</p>`,
		};
	});

	// 17. Reverse percentages
	boss('boss3-percent-chain', 'Reverse percentages + Chains', function (r) {
		let O, x, yy, factor, Pf;
		do {
			O = r.int(40, 90);
			x = 10 * r.int(1, 3);
			yy = 10 * r.int(1, 3);
			factor = (1 + x / 100) * (1 - yy / 100);
			Pf = O * factor;
		} while (Math.abs(Pf - Math.round(Pf * 100) / 100) > 1e-9);
		const overall = (factor - 1) * 100;
		const fallBack = 100 * x / (100 + x);
		return {
			marks: 6,
			text: `The price of an item rose by ${x}%, then fell by ${yy}%, and is now &pound;${dp(Pf, 2)}. Give answers correct to 2 decimal places where necessary.${br('i', 'Find the overall percentage change from the original price (negative if a decrease).')}${br('ii', 'Find the original price.')}${br('iii', 'After the rise (but before the fall), what single percentage fall would have returned the price exactly to the original?')}`,
			answer: multi([dp(overall, 2), O, dp(fallBack, 2)], ['overall change (%)', 'original (&pound;)', 'required fall (%)'], 0.006),
			solution: `<p>(i) The combined multiplier is ${dp(1 + x / 100, 2)} &times; ${dp(1 - yy / 100, 2)} = ${dp(factor, 4)}, an overall change of <strong>${dp(overall, 2)}%</strong>.</p>
<p>(ii) Original &times; ${dp(factor, 4)} = ${dp(Pf, 2)}, so original = ${F.frac(String(dp(Pf, 2)), String(dp(factor, 4)))} = <strong>&pound;${O}</strong>.</p>
<p>(iii) We need (1 + ${dp(x / 100, 2)})(1 &minus; f) = 1, so f = ${F.frac(String(x), String(100 + x))} = <strong>${dp(fallBack, 2)}%</strong>.</p>`,
		};
	});

})();
