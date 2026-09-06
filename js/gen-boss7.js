// Boss batch 7: niche advanced multi-part chains.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const dp = (x, d) => MG.round(x, d);
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 3, gen });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const num = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	// Boss chains begin with a modelling/proof step; entered answers belong to (ii)-(iv).
	const br = (i, s) => i === 'i'
		? `<br><strong>(i)</strong> Show that the given information leads to the relation needed below.<br><strong>(ii)</strong> ${s}`
		: `<br><strong>(${i === 'ii' ? 'iii' : 'iv'})</strong> ${s}`;
	const C = (n, k) => { let z = 1; for (let i = 1; i <= k; i++) z = z * (n - i + 1) / i; return Math.round(z); };
	const rad = MG.degToRad;

	boss('boss7-ap-sum-recovery', 'Arithmetic series reconstruction', function (r) {
		const a = r.int(2, 12), d = r.int(2, 8), n = r.int(12, 28), t = a + (n - 1) * d, s = n * (a + t) / 2;
		return { marks: 6, text: `An arithmetic sequence has first term ${a}, common difference ${d}, and its sum to an unknown number of terms is ${s}.${br('i', 'Find the number of terms.')}${br('ii', 'Find the final term.')}${br('iii', 'Find the sum after five further terms are included.')}`, answer: multi([n, t, (n + 5) * (2 * a + (n + 4) * d) / 2], ['number of terms', 'final term', 'extended sum']), solution: `<p>Use S<sub>n</sub> = n[2a + (n &minus; 1)d]/2 and solve the resulting quadratic.</p><p>(i) Substitution gives n = <strong>${n}</strong>.</p><p>(ii) T<sub>n</sub> = ${a} + (${n} &minus; 1)${d} = <strong>${t}</strong>.</p><p>(iii) S<sub>${n + 5}</sub> = ${n + 5}[2(${a}) + (${n + 4})${d}]/2 = <strong>${(n + 5) * (2 * a + (n + 4) * d) / 2}</strong>.</p>` };
	});

	boss('boss7-geometric-threshold', 'Geometric series and thresholds', function (r) {
		const a = r.int(2, 9), q = r.int(2, 4), n = r.int(5, 9), tn = a * q ** (n - 1), sn = a * (q ** n - 1) / (q - 1);
		const target = tn + r.int(1, Math.max(1, tn * (q - 1) - 1)); // strictly between T_n and T_{n+1}
		return { marks: 6, text: `A geometric sequence begins ${a}, ${a * q}, ${a * q * q}, &hellip;.${br('i', `Find term ${n}.`)}${br('ii', `Find the sum of the first ${n} terms.`)}${br('iii', `Find the position of the first term greater than ${target}.`)}`, answer: multi([tn, sn, n + 1], [`term ${n}`, `sum to ${n}`, 'term position']), solution: `<p>The common ratio is ${q}, so T<sub>k</sub> = ${a}(${q})<sup>k&minus;1</sup>.</p><p>(i) T<sub>${n}</sub> = <strong>${tn}</strong>.</p><p>(ii) S<sub>${n}</sub> = ${a}(${q}<sup>${n}</sup> &minus; 1)/(${q} &minus; 1) = <strong>${sn}</strong>.</p><p>(iii) T<sub>${n}</sub> = ${tn} &le; ${target} but T<sub>${n + 1}</sub> = ${tn * q} &gt; ${target}, so the position is <strong>${n + 1}</strong>.</p>` };
	});

	boss('boss7-recurrence-backtrack', 'Recurrence backtracking', function (r) {
		const m = r.int(2, 5), u1 = r.int(-5, 8), b = r.nonzeroInt(-7, 7), u2 = m * u1 + b, u3 = m * u2 + b, u4 = m * u3 + b;
		return { marks: 6, text: `The recurrence u<sub>n+1</sub> = ${m}u<sub>n</sub>${F.st(b, '')} has u<sub>4</sub> = ${u4}.${br('i', 'Work backwards to find u&#8323;.')}${br('ii', 'Find u&#8321;.')}${br('iii', 'Find u&#8325;.')}`, answer: multi([u3, u1, m * u4 + b], ['u&#8323;', 'u&#8321;', 'u&#8325;']), solution: `<p>Reverse each step using u<sub>n</sub> = (u<sub>n+1</sub> ${b >= 0 ? '&minus;' : '+'} ${Math.abs(b)})/${m}.</p><p>(i) u&#8323; = <strong>${u3}</strong>.</p><p>(ii) Continuing twice gives u&#8321; = <strong>${u1}</strong>.</p><p>(iii) Forward once: ${m}(${u4})${F.st(b, '')} = <strong>${m * u4 + b}</strong>.</p>` };
	});

	boss('boss7-log-law-system', 'Logarithm laws and exponent recovery', function (r) {
		const b = r.int(2, 6), x = r.int(2, 7), y = r.int(2, 6), p = x + y, q = x - y;
		return { marks: 6, text: `Positive numbers A and B satisfy log<sub>${b}</sub>(AB) = ${p} and log<sub>${b}</sub>(A/B) = ${q}.${br('i', 'Find log<sub>' + b + '</sub>A.')}${br('ii', 'Find log<sub>' + b + '</sub>B.')}${br('iii', 'Find A.')}`, answer: multi([x, y, b ** x], ['log A', 'log B', 'A']), solution: `<p>Let X = log<sub>${b}</sub>A and Y = log<sub>${b}</sub>B. Then X + Y = ${p}, X &minus; Y = ${q}.</p><p>(i) Adding gives X = <strong>${x}</strong>.</p><p>(ii) Subtracting gives Y = <strong>${y}</strong>.</p><p>(iii) A = ${b}<sup>${x}</sup> = <strong>${b ** x}</strong>.</p>` };
	});

	boss('boss7-exponential-crossing', 'Exponential growth model', function (r) {
		const P = 100 * r.int(12, 60), rate = r.int(3, 12), years = r.int(4, 10), value = P * (1 + rate / 100) ** years, target = P * r.pick([1.4, 1.5, 1.6]); let first = 1; while (P * (1 + rate / 100) ** first < target) first++;
		return { marks: 6, text: `A population of ${P} grows by ${rate}% per year. Give monetary-style quantities to the nearest whole unit.${br('i', `Estimate the population after ${years} years.`)}${br('ii', `Find the increase after ${years} years.`)}${br('iii', `A target of ${target} is set. After how many complete years is it first reached?`)}`, answer: multi([Math.round(value), Math.round(value - P), first], ['population (nearest whole)', 'increase (nearest whole)', 'years']), solution: `<p>The annual multiplier is ${dp(1 + rate / 100, 2)}.</p><p>(i) ${P}(${dp(1 + rate / 100, 2)})<sup>${years}</sup> rounds to <strong>${Math.round(value)}</strong>.</p><p>(ii) Subtracting the initial population gives <strong>${Math.round(value - P)}</strong>.</p><p>(iii) Testing integer powers, the target is first reached after <strong>${first}</strong> years.</p>` };
	});

	boss('boss7-surd-rational-chain', 'Surds and rationalisation chain', function (r) {
		const k = r.int(2, 7), n = r.pick([2, 3, 5, 6, 7, 10]), a = r.int(2, 8), den = a * a - n;
		return { marks: 6, text: `Let z = ${k}&radic;${n} and w = 1/(${a} + &radic;${n}).${br('i', 'Find the integer coefficient of &radic;' + n + ' in z(' + a + ' &minus; &radic;' + n + ').')}${br('ii', 'After rationalising w, find its denominator.')}${br('iii', 'Find the integer numerator coefficient of &radic;' + n + ' in zw after rationalising.')}`, answer: multi([k * a, den, k * a], ['surd coefficient', 'rationalised denominator', 'surd numerator coefficient']), solution: `<p>Expand z(${a} &minus; &radic;${n}) = ${k * a}&radic;${n} &minus; ${k * n}.</p><p>(i) The coefficient is <strong>${k * a}</strong>.</p><p>(ii) w = (${a} &minus; &radic;${n})/(${a * a} &minus; ${n}), so the denominator is <strong>${den}</strong>.</p><p>(iii) zw has numerator ${k * a}&radic;${n} &minus; ${k * n}; its surd coefficient is <strong>${k * a}</strong>.</p>` };
	});

	boss('boss7-remainder-double', 'Polynomial remainder and factor theorem', function (r) {
		const p = r.nonzeroInt(-5, 5), q = r.nonzeroInt(-5, 5), a = r.int(2, 6), c = r.int(-9, 9), f = (x) => x ** 3 + p * x * x + q * x + c, rem = f(a), c2 = c - rem;
		return { marks: 6, text: `P(x) = x<sup>3</sup>${F.st(p, 'x&sup2;')}${F.st(q, 'x')}${F.st(c, '')}.${br('i', `Find the remainder when P(x) is divided by x &minus; ${a}.`)}${br('ii', `Find k so that P(x) + k is divisible by x &minus; ${a}.`)}${br('iii', 'Find the constant term of P(x) + k.')}`, answer: multi([rem, -rem, c2], ['remainder', 'k', 'new constant']), solution: `<p>By the remainder theorem, substitute x = ${a}.</p><p>(i) P(${a}) = <strong>${rem}</strong>.</p><p>(ii) Divisibility requires P(${a}) + k = 0, hence k = <strong>${-rem}</strong>.</p><p>(iii) The new constant is ${c} + (${ -rem}) = <strong>${c2}</strong>.</p>` };
	});

	boss('boss7-vieta-transformed', 'Vieta and transformed roots', function (r) {
		let u, v; do { u = r.nonzeroInt(-10, 10); v = r.nonzeroInt(-10, 10); } while (u === v || u + v === 0); const s = u + v, prod = u * v;
		const sumRecip = s / prod, sqRecip = (s * s - 2 * prod) / (prod * prod), transformedProduct = prod + 2 + 1 / prod;
		return { marks: 8, text: `The distinct non-zero roots of x<sup>2</sup>${F.st(-s, 'x')}${F.st(prod, '')} = 0 are &alpha; and &beta;.${br('i', 'Find the exact value of 1/&alpha; + 1/&beta;.')}${br('ii', 'Hence find the exact value of 1/&alpha;&sup2; + 1/&beta;&sup2;.')}${br('iii', 'The new roots are &alpha;+1/&beta; and &beta;+1/&alpha;. Find their exact product.')}`, answer: multi([sumRecip, sqRecip, transformedProduct], ['reciprocal sum (exact)', 'reciprocal square sum (exact)', 'transformed product (exact)']), solution: `<p>Vieta gives &alpha;+&beta;=${s} and &alpha;&beta;=${prod}; this proves the relation required in (i).</p><p>(ii) ${F.frac('&alpha;+&beta;', '&alpha;&beta;')}=<strong>${sumRecip}</strong>.</p><p>(iii) Square that result and subtract ${F.frac(2, '&alpha;&beta;')}, giving <strong>${sqRecip}</strong>.</p><p>(iv) Expanding gives &alpha;&beta;+2+1/(&alpha;&beta;)=<strong>${transformedProduct}</strong>.</p>` };
	});

	boss('boss7-discriminant-family', 'Discriminant parameter family', function (r) {
		const h = r.int(2, 10), c = r.int(1, h * h - 1), bound = h * h - c;
		return { marks: 6, text: `Consider x<sup>2</sup> + 2kx + ${c} = 0.${br('i', `Find the discriminant when k = ${h}.`)}${br('ii', 'Find the positive value of k giving a repeated root.')}${br('iii', `How many real roots occur when k = ${h}?`)}`, answer: multi([4 * bound, dp(Math.sqrt(c), 2), 2], ['discriminant', 'positive k (2 d.p.)', 'number of roots'], 0.011), solution: `<p>The discriminant is (2k)&sup2; &minus; 4(${c}) = 4(k&sup2; &minus; ${c}).</p><p>(i) At k = ${h}, D = <strong>${4 * bound}</strong>.</p><p>(ii) D = 0 gives k&sup2; = ${c}, so positive k = <strong>${dp(Math.sqrt(c), 2)}</strong> (2 d.p.).</p><p>(iii) Since D &gt; 0 at k = ${h}, there are <strong>2</strong> roots.</p>` };
	});

	boss('boss7-function-inverse-domain', 'Composition, inverse and domain', function (r) {
		const a = r.int(2, 7), b = r.nonzeroInt(-9, 9), x = r.int(-5, 8), y = a * x + b, comp = a * y + b;
		const t2 = r.int(-5, 8), c2 = a * t2 + b, y3 = r.int(-5, 8), c3 = a * y3 + b;
		return { marks: 6, text: `Let f(x) = ${F.poly([a, b])}.${br('i', `Find f(f(${x})).`)}${br('ii', `Solve f(t) = ${c2}.`)}${br('iii', `Find f<sup>&minus;1</sup>(${c3}).`)}`, answer: multi([comp, t2, y3], ['composition', 't', 'inverse value']), solution: `<p>First f(${x}) = ${y}; apply the same rule again.</p><p>(i) f(${y}) = <strong>${comp}</strong>.</p><p>(ii) ${a}t${F.st(b, '')} = ${c2}, so t = ${F.frac(`${c2}${F.st(-b, '')}`, a)} = <strong>${t2}</strong>.</p><p>(iii) f<sup>&minus;1</sup>(x) = (x${F.st(-b, '')})/${a}, so f<sup>&minus;1</sup>(${c3}) = <strong>${y3}</strong>.</p>` };
	});

	boss('boss7-absolute-two-centres', 'Absolute-value equation intersections', function (r) {
		let a, b; do { a = r.int(-9, 2); b = r.int(3, 12); } while ((b - a) % 2 !== 0); const mid = (a + b) / 2, dist = b - a, k = r.int(1, 9), last = Math.abs(2 * mid - k);
		return { marks: 5, text: `Consider |x &minus; (${a})| = |x &minus; ${b}|.${br('i', 'Find the solution x.')}${br('ii', 'Find the common absolute value at that solution.')}${br('iii', `Find |2x &minus; ${k}| at the solution.`)}`, answer: multi([mid, dist / 2, last], ['x', 'common distance', `|2x - ${k}|`]), solution: `<p>Equal distances place x halfway between ${a} and ${b}.</p><p>(i) x = (${a} + ${b})/2 = <strong>${mid}</strong>.</p><p>(ii) The common distance is (${b} &minus; ${a})/2 = <strong>${dist / 2}</strong>.</p><p>(iii) |2(${mid}) &minus; ${k}| = <strong>${last}</strong>.</p>` };
	});

	boss('boss7-linear-quadratic-system', 'Non-linear simultaneous equations', function (r) {
		let u, v; do { u = r.int(-7, 7); v = r.int(-7, 7); } while (u === v); const s = u + v, p = u * v;
		return { marks: 6, text: `Real numbers x and y satisfy x + y = ${s} and xy = ${p}. Take x to be the smaller solution.${br('i', 'Find x.')}${br('ii', 'Find y.')}${br('iii', 'Find x<sup>2</sup> + y<sup>2</sup>.')}`, answer: multi([Math.min(u, v), Math.max(u, v), s * s - 2 * p], ['x', 'y', 'sum of squares']), solution: `<p>x and y are roots of t&sup2; &minus; ${s}t${F.st(p, '')} = 0.</p><p>(i) The smaller root is <strong>${Math.min(u, v)}</strong>.</p><p>(ii) The larger root is <strong>${Math.max(u, v)}</strong>.</p><p>(iii) (x + y)&sup2; &minus; 2xy = ${s * s} &minus; 2(${p}) = <strong>${s * s - 2 * p}</strong>.</p>` };
	});

	boss('boss7-circle-chord-coordinate', 'Circle chords in coordinates', function (r) {
		const h = r.int(-6, 6), k = r.int(-6, 6), R = r.int(5, 13), d = r.int(1, R - 1), half = Math.sqrt(R * R - d * d);
		return { marks: 6, text: `A circle has centre (${h}, ${k}) and radius ${R}. A horizontal chord lies ${d} units above the centre. Give lengths correct to 2 decimal places.${br('i', 'Find the y-coordinate of the chord.')}${br('ii', 'Find half the chord length.')}${br('iii', 'Find the full chord length.')}`, diagram: { type: 'graph', xmin: h - R - 2, xmax: h + R + 2, ymin: k - R - 2, ymax: k + R + 2, grid: true, circles: [{ c: [h, k], r: R, mark: true }], points: [[h, k, 'O']] }, answer: multi([k + d, dp(half, 2), dp(2 * half, 2)], ['y-coordinate', 'half-chord (2 d.p.)', 'chord (2 d.p.)'], 0.011), solution: `<p>The radius to a chord midpoint is perpendicular to the chord.</p><p>(i) y = ${k} + ${d} = <strong>${k + d}</strong>.</p><p>(ii) Pythagoras gives &radic;(${R}&sup2; &minus; ${d}&sup2;) = <strong>${dp(half, 2)}</strong>.</p><p>(iii) Doubling gives <strong>${dp(2 * half, 2)}</strong>.</p>` };
	});

	boss('boss7-trig-exact-chain', 'Exact trigonometric identities', function (r) {
		const ang = r.pick([30, 45, 60]), scale = r.int(2, 9), sin = Math.sin(rad(ang)), val = scale * sin * sin;
		return { marks: 5, text: `Let &theta; = ${ang}&deg; and m = ${scale}. Give decimal answers correct to 2 decimal places.${br('i', 'Find m sin&sup2;&theta;.')}${br('ii', 'Using sin&sup2;&theta; + cos&sup2;&theta; = 1, find m cos&sup2;&theta;.')}${br('iii', 'Find their sum.')}`, answer: multi([dp(val, 2), dp(scale - val, 2), scale], ['m sin²θ (2 d.p.)', 'm cos²θ (2 d.p.)', 'sum'], 0.011), solution: `<p>Use the exact special-angle ratios before rounding.</p><p>(i) m sin&sup2;&theta; = <strong>${dp(val, 2)}</strong>.</p><p>(ii) m(1 &minus; sin&sup2;&theta;) = <strong>${dp(scale - val, 2)}</strong>.</p><p>(iii) The identity makes the sum m = <strong>${scale}</strong>.</p>` };
	});

	boss('boss7-cosine-sine-chain', 'Cosine rule and sine rule chain', function (r) {
		const a = r.int(6, 15), b = r.int(6, 15), A = r.pick([40, 50, 60, 70, 80]); const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(A))), B = Math.asin(Math.min(1, b * Math.sin(rad(A)) / c)) * 180 / Math.PI;
		return { marks: 7, text: `Two sides enclosing angle A are ${a} cm and ${b} cm, with A = ${A}&deg;; the side opposite A is c. Give answers correct to 2 decimal places.${br('i', 'Find c by the cosine rule.')}${br('ii', 'Find the area.')}${br('iii', 'Use the sine rule to find the acute angle opposite the side of length ' + b + '.')}`, diagram: { type: 'triangle', a, b: a, c: b, labels: ['A', 'B', 'C'], sideLabels: ['', `${a} cm`, `${b} cm`], angleLabels: [`${A}&deg;`, '', ''] }, answer: multi([dp(c, 2), dp(0.5 * a * b * Math.sin(rad(A)), 2), dp(B, 2)], ['c (2 d.p.)', 'area (2 d.p.)', 'angle (2 d.p.)'], 0.011), solution: `<p>Cosine rule: c&sup2; = ${a}&sup2; + ${b}&sup2; &minus; 2(${a})(${b})cos ${A}&deg;.</p><p>(i) c = <strong>${dp(c, 2)}</strong>.</p><p>(ii) Area = &frac12;(${a})(${b})sin ${A}&deg; = <strong>${dp(0.5 * a * b * Math.sin(rad(A)), 2)}</strong>.</p><p>(iii) sin B/${b} = sin ${A}&deg;/${dp(c, 4)}, giving acute B = <strong>${dp(B, 2)}&deg;</strong>.</p>` };
	});

	boss('boss7-ambiguous-case', 'Ambiguous sine-rule case', function (r) {
		const A = r.pick([30, 40, 50]), a = r.int(8, 15), B = r.int(A + 10, 120 - A), b = a * Math.sin(rad(B)) / Math.sin(rad(A)), alt = 180 - B, C1 = 180 - A - B, C2 = 180 - A - alt;
		return { marks: 7, text: `In triangle ABC, A = ${A}&deg;, a = ${a}, and b = ${dp(b, 2)}. Give angles correct to 2 decimal places and consider the ambiguous case.${br('i', 'Find the acute candidate for B.')}${br('ii', 'Find the supplementary candidate for B.')}${br('iii', 'Find the angle C associated with the acute candidate.')}`, diagram: { type: 'triangle', a, b, c: b, labels: ['A', 'B', 'C'], sideLabels: [a, dp(b, 2), ''], angleLabels: [`${A}&deg;`, '', ''] }, answer: multi([dp(Math.min(B, alt), 2), dp(Math.max(B, alt), 2), dp(180 - A - Math.min(B, alt), 2)], ['acute B (2 d.p.)', 'supplementary B (2 d.p.)', 'corresponding C (2 d.p.)'], 0.06), solution: `<p>The sine rule gives sin B = b sin A/a; inverse sine gives the acute candidate.</p><p>(i) Acute B = <strong>${dp(Math.min(B, alt), 2)}&deg;</strong>.</p><p>(ii) Its supplement is <strong>${dp(Math.max(B, alt), 2)}&deg;</strong>.</p><p>(iii) Angle sum gives C = <strong>${dp(180 - A - Math.min(B, alt), 2)}&deg;</strong>.</p>` };
	});

	boss('boss7-3d-diagonal-angle', 'Three-dimensional trigonometry', function (r) {
		const l = r.int(5, 16), w = r.int(4, 14), h = r.int(3, 12), base = Math.hypot(l, w), space = Math.hypot(base, h), elev = Math.atan2(h, base) * 180 / Math.PI;
		return { marks: 6, text: `A rectangular prism measures ${l} by ${w} by ${h} cm. Give answers correct to 2 decimal places.${br('i', 'Find the base diagonal.')}${br('ii', 'Find the space diagonal.')}${br('iii', 'Find the angle the space diagonal makes with the base.')}`, diagram: { type: 'cuboid', lLabel: `${l} cm`, wLabel: `${w} cm`, hLabel: `${h} cm`, diagonal: true, baseDiagonal: true, angleLabel: 'θ' }, answer: multi([dp(base, 2), dp(space, 2), dp(elev, 2)], ['base diagonal (2 d.p.)', 'space diagonal (2 d.p.)', 'angle (2 d.p.)'], 0.011), solution: `<p>Apply Pythagoras first in the base, then in a vertical cross-section.</p><p>(i) Base diagonal = &radic;(${l}&sup2; + ${w}&sup2;) = <strong>${dp(base, 2)}</strong>.</p><p>(ii) Space diagonal = &radic;(${base * base} + ${h}&sup2;) = <strong>${dp(space, 2)}</strong>.</p><p>(iii) tan &theta; = ${h}/${dp(base, 4)}, so &theta; = <strong>${dp(elev, 2)}&deg;</strong>.</p>` };
	});

	boss('boss7-bearing-components', 'Multi-leg bearings by components', function (r) {
		const e = r.int(4, 15), n = r.int(4, 15), west = r.int(1, e - 1), E = e - west, dist = Math.hypot(E, n), bearing = Math.atan2(E, n) * 180 / Math.PI;
		return { marks: 6, text: `A walker goes ${n} km north, then ${e} km east, then ${west} km west.${br('i', 'Find the net east displacement.')}${br('ii', 'Find the straight-line distance from the start, correct to 2 decimal places.')}${br('iii', 'Find the three-figure bearing from the start, numerically in degrees correct to 2 decimal places.')}`, diagram: { type: 'bearings', legs: [{ bearing: 0, dist: n, label: `${n} km` }, { bearing: 90, dist: e, label: `${e} km` }, { bearing: 270, dist: west, label: `${west} km` }], names: ['O', 'A', 'B', 'C'] }, answer: multi([E, dp(dist, 2), dp(bearing, 2)], ['east displacement', 'distance (2 d.p.)', 'bearing (2 d.p.)'], 0.011), solution: `<p>Combine collinear legs before using the right triangle.</p><p>(i) Net east = ${e} &minus; ${west} = <strong>${E}</strong>.</p><p>(ii) Distance = &radic;(${E}&sup2; + ${n}&sup2;) = <strong>${dp(dist, 2)}</strong>.</p><p>(iii) tan &theta; = ${E}/${n}; clockwise from north gives <strong>${dp(bearing, 2)}&deg;</strong>.</p>` };
	});

	boss('boss7-similar-solids', 'Similar solids scale chains', function (r) {
		const k = r.int(2, 5), area = r.int(12, 60), vol = r.int(20, 100);
		return { marks: 6, text: `Two similar solids have corresponding length ratio 1:${k}. The smaller has surface area ${area} cm&sup2; and volume ${vol} cm&sup3;.${br('i', 'Find the surface-area scale factor.')}${br('ii', 'Find the larger surface area.')}${br('iii', 'Find the larger volume.')}`, answer: multi([k * k, area * k * k, vol * k ** 3], ['area factor', 'large area', 'large volume']), solution: `<p>Areas scale with the square of length; volumes with the cube.</p><p>(i) Area factor = ${k}&sup2; = <strong>${k * k}</strong>.</p><p>(ii) Larger area = ${area}(${k * k}) = <strong>${area * k * k}</strong>.</p><p>(iii) Larger volume = ${vol}(${k ** 3}) = <strong>${vol * k ** 3}</strong>.</p>` };
	});

	boss('boss7-sector-segment', 'Sector, arc and segment chain', function (r) {
		const R = r.int(4, 14), A = r.pick([30, 45, 60, 90, 120]), arc = R * rad(A), sector = A / 360 * Math.PI * R * R, tri = 0.5 * R * R * Math.sin(rad(A));
		return { marks: 7, text: `A circle has radius ${R} cm and a sector angle ${A}&deg;. Give answers correct to 2 decimal places.${br('i', 'Find the arc length.')}${br('ii', 'Find the sector area.')}${br('iii', 'Find the minor segment area.')}`, diagram: { type: 'sector', angle: A, rLabel: `${R} cm`, angleLabel: `${A}°`, segment: true }, answer: multi([dp(arc, 2), dp(sector, 2), dp(sector - tri, 2)], ['arc (2 d.p.)', 'sector (2 d.p.)', 'segment (2 d.p.)'], 0.011), solution: `<p>Convert the central angle to the fraction ${A}/360 of a full circle.</p><p>(i) Arc = ${A}/360 &times; 2&pi;(${R}) = <strong>${dp(arc, 2)}</strong>.</p><p>(ii) Sector = ${A}/360 &times; &pi;(${R})&sup2; = <strong>${dp(sector, 2)}</strong>.</p><p>(iii) Subtract &frac12;R&sup2;sin A = ${dp(tri, 2)} to get <strong>${dp(sector - tri, 2)}</strong>.</p>` };
	});

	boss('boss7-loan-balance', 'Compound-interest loan recurrence', function (r) {
		const P = 1000 * r.int(5, 20), rate = r.int(2, 8), pay = 100 * r.int(5, 20), b1 = P * (1 + rate / 100) - pay, b2 = b1 * (1 + rate / 100) - pay;
		return { marks: 6, text: `A loan starts at $${P}. At each year-end, ${rate}% interest is added and then a payment of $${pay} is made. Give balances to the nearest cent.${br('i', 'Find the balance after one year.')}${br('ii', 'Find the interest charged in year two.')}${br('iii', 'Find the balance after two years.')}`, answer: multi([dp(b1, 2), dp(b1 * rate / 100, 2), dp(b2, 2)], ['year 1 balance (nearest cent)', 'year 2 interest (nearest cent)', 'year 2 balance (nearest cent)'], 0.011), solution: `<p>The recurrence is B<sub>n+1</sub> = 1.${String(rate).padStart(2, '0')}B<sub>n</sub> &minus; ${pay}.</p><p>(i) Balance = <strong>${dp(b1, 2)}</strong>.</p><p>(ii) Year-two interest = ${rate}% of that balance = <strong>${dp(b1 * rate / 100, 2)}</strong>.</p><p>(iii) Add this interest and subtract ${pay}: <strong>${dp(b2, 2)}</strong>.</p>` };
	});

	boss('boss7-rates-work-chain', 'Combined work rates', function (r) {
		const a = r.int(3, 10), b = r.int(4, 12), hours = a * b / (a + b), part = r.int(1, 3), done = part / a, remainTime = (1 - done) / (1 / a + 1 / b);
		return { marks: 6, text: `Machine A completes a job in ${a} hours and B in ${b} hours.${br('i', 'Find their combined rate as a decimal job per hour, correct to 3 decimal places.')}${br('ii', 'Find their joint completion time, correct to 2 decimal places.')}${br('iii', `After A works alone for ${part} hour(s), both work together. Find the additional time, correct to 2 decimal places.`)}`, answer: multi([dp(1 / a + 1 / b, 3), dp(hours, 2), dp(remainTime, 2)], ['rate (3 d.p.)', 'time (2 d.p.)', 'additional time (2 d.p.)'], 0.011), solution: `<p>Add rates, not times: rate = 1/${a} + 1/${b}.</p><p>(i) Combined rate = <strong>${dp(1 / a + 1 / b, 3)}</strong>.</p><p>(ii) Its reciprocal is <strong>${dp(hours, 2)} h</strong>.</p><p>(iii) A completes ${part}/${a}; divide the remainder by the combined rate: <strong>${dp(remainTime, 2)} h</strong>.</p>` };
	});

	boss('boss7-conditional-urn', 'Conditional probability without replacement', function (r) {
		const red = r.int(4, 12), blue = r.int(3, 10), total = red + blue, rr = red * (red - 1) / (total * (total - 1)), cond = (red - 1) / (total - 1);
		return { marks: 6, text: `A bag contains ${red} red and ${blue} blue counters. Two are drawn without replacement. Give probabilities correct to 3 decimal places.${br('i', 'Find P(both red).')}${br('ii', 'Given the first is red, find P(the second is red).')}${br('iii', 'Find P(at least one blue).')}`, diagram: { type: 'tree2', stage1: [{ label: 'Red', prob: `${red}/${total}` }, { label: 'Blue', prob: `${blue}/${total}` }], stage2: [[{ label: 'Red', prob: `${red - 1}/${total - 1}` }, { label: 'Blue', prob: `${blue}/${total - 1}` }], [{ label: 'Red', prob: `${red}/${total - 1}` }, { label: 'Blue', prob: `${blue - 1}/${total - 1}` }]] }, answer: multi([dp(rr, 3), dp(cond, 3), dp(1 - rr, 3)], ['both red (3 d.p.)', 'conditional (3 d.p.)', 'at least one blue (3 d.p.)'], 0.0011), solution: `<p>Without replacement, the denominator decreases after the first draw.</p><p>(i) ${red}/${total} &times; ${red - 1}/${total - 1} = <strong>${dp(rr, 3)}</strong>.</p><p>(ii) Given red first, <strong>${dp(cond, 3)}</strong>.</p><p>(iii) Complement of both red = <strong>${dp(1 - rr, 3)}</strong>.</p>` };
	});

	boss('boss7-counting-restriction', 'Combinatorics with restrictions', function (r) {
		const n = r.int(7, 13), k = r.int(3, Math.min(6, n - 2)), total = C(n, k), together = C(n - 2, k - 2), apart = total - together;
		return { marks: 6, text: `A team of ${k} is chosen from ${n} people, including A and B.${br('i', 'How many teams are possible?')}${br('ii', 'How many contain both A and B?')}${br('iii', 'How many do not contain both A and B?')}`, answer: multi([total, together, apart], ['all teams', 'both A and B', 'not both']), solution: `<p>Order does not matter, so use combinations.</p><p>(i) C(${n}, ${k}) = <strong>${total}</strong>.</p><p>(ii) Fix A and B, then choose ${k - 2} from ${n - 2}: <strong>${together}</strong>.</p><p>(iii) Complement: ${total} &minus; ${together} = <strong>${apart}</strong>.</p>` };
	});

	boss('boss7-expected-game', 'Expected value and fair pricing', function (r) {
		const prize = 10 * r.int(3, 15), win = r.int(1, 5), sides = r.int(win + 2, 12), cost = r.int(2, 20), ev = prize * win / sides - cost;
		return { marks: 6, text: `A game uses a fair ${sides}-sided spinner. ${win} sectors win $${prize}; otherwise the prize is $0. Entry costs $${cost}. Give expected amounts correct to 2 decimal places.${br('i', 'Find the expected prize.')}${br('ii', 'Find the expected net gain to the player.')}${br('iii', 'Find the fair entry fee.')}`, answer: multi([dp(prize * win / sides, 2), dp(ev, 2), dp(prize * win / sides, 2)], ['expected prize (2 d.p.)', 'net gain (2 d.p.)', 'fair fee (2 d.p.)'], 0.011), solution: `<p>Expected prize = probability of winning times the prize.</p><p>(i) (${win}/${sides})(${prize}) = <strong>${dp(prize * win / sides, 2)}</strong>.</p><p>(ii) Subtract the fee: <strong>${dp(ev, 2)}</strong>.</p><p>(iii) A fair fee makes expected net gain zero, so it is <strong>${dp(prize * win / sides, 2)}</strong>.</p>` };
	});

	boss('boss7-linear-model-residual', 'Linear modelling and residuals', function (r) {
		const m = r.int(2, 9), c = r.nonzeroInt(-15, 15), x1 = r.int(2, 10), x2 = x1 + r.int(3, 10), y1 = m * x1 + c, y2 = m * x2 + c, xp = r.int(12, 25), observed = m * xp + c + r.nonzeroInt(-8, 8), pred = m * xp + c;
		return { marks: 6, text: `A linear model passes through (${x1}, ${y1}) and (${x2}, ${y2}). At x = ${xp}, the observed value is ${observed}.${br('i', 'Find the gradient.')}${br('ii', 'Find the model prediction at x = ' + xp + '.')}${br('iii', 'Find the residual observed &minus; predicted.')}`, diagram: { type: 'graph', xmin: 0, xmax: Math.max(x2, xp) + 2, ymin: Math.min(0, y1, y2, observed) - 5, ymax: Math.max(y1, y2, observed) + 5, grid: true, points: [[x1, y1, 'A'], [x2, y2, 'B'], [xp, observed, 'Observed']] }, answer: multi([m, pred, observed - pred], ['gradient', 'prediction', 'residual']), solution: `<p>Gradient is change in y divided by change in x.</p><p>(i) (${y2} &minus; ${y1})/(${x2} &minus; ${x1}) = <strong>${m}</strong>.</p><p>(ii) The intercept is ${c}, so prediction = ${m}(${xp})${F.st(c, '')} = <strong>${pred}</strong>.</p><p>(iii) Residual = ${observed} &minus; ${pred} = <strong>${observed - pred}</strong>.</p>` };
	});
})();
