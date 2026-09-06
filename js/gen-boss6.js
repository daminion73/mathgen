// Boss batch 6: mixed advanced multi-part chains.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const rad = MG.degToRad;
	const dp = (x, d) => MG.round(x, d);
	const boss = (id, subtopic, gen) => G.push({
		id, topic: 'Boss', subtopic, difficulty: 3,
		gen: (r) => {
			const q = gen(r);
			q.marks += 1;
			q.text += br('iv', 'Verify the final result using an independent relation, inverse operation or limiting check, and state why the result is reasonable.');
			q.solution += '<p><strong>(iv)</strong> Substitution in the original data (rather than the rearranged equation) reproduces the stated measurements or constraints; the units, sign and size are therefore consistent.</p>';
			return q;
		},
	});
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const deg = (x) => `${x}&deg;`;
	const br = (i, s) => `<br><strong>(${i})</strong> ${i === 'i' ? 'Show from the given information which relation is required, then ' : ''}${s}`;
	const comb = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };

	// 1. Arithmetic progression from two given terms
	boss('boss6-ap-two-terms', 'AP from two terms + Threshold', function (r) {
		const a = r.int(2, 9), d = r.int(2, 7);
		const T3 = a + 2 * d, T8 = a + 7 * d;
		const N = 10 * r.int(10, 30);
		let n = 1;
		while (a + (n - 1) * d <= N) n++;
		return {
			marks: 6,
			text: `The 3rd term of an arithmetic sequence is ${T3} and the 8th term is ${T8}.${br('i', 'Find the common difference.')}${br('ii', 'Find the first term.')}${br('iii', `Find the position n of the first term that is greater than ${N}.`)}`,
			answer: multi([d, a, n], ['common difference', 'first term', 'n']),
			solution: `<p>(i) From the 3rd to the 8th term is 5 steps: d = ${F.frac(`${T8} &minus; ${T3}`, '5')} = <strong>${d}</strong>.</p>
<p>(ii) First term = ${T3} &minus; 2 &times; ${d} = <strong>${a}</strong>.</p>
<p>(iii) We need ${a} + (n &minus; 1) &times; ${d} &gt; ${N}, so n &gt; ${dp((N - a) / d + 1, 2)}. The first integer is <strong>${n}</strong> (term ${a + (n - 1) * d}).</p>`,
		};
	});

	// 2. Frequency table with a hidden frequency
	boss('boss6-missing-frequency', 'Frequency tables + Unknown frequency', function (r) {
		let f, others, mean, N, sum, mode, unique;
		do {
			others = [r.int(2, 9), r.int(2, 9), r.int(2, 9), r.int(2, 9)];
			f = r.int(2, 9);
			const fr = [others[0], others[1], f, others[2], others[3]];
			N = fr.reduce((a, b) => a + b, 0);
			sum = fr.reduce((a, c, i) => a + c * (i + 1), 0);
			mean = sum / N;
			const mx = Math.max(...fr);
			mode = fr.indexOf(mx) + 1;
			unique = fr.filter((v) => v === mx).length === 1;
		} while ((sum * 10) % N !== 0 || Math.abs(mean - 3) < 1e-9 || !unique);
		const meanShown = MG.round(mean, 1);
		const So = sum - 3 * f, No = N - f;
		return {
			marks: 6,
			text: `Quiz scores from 1 to 5 have frequencies: score 1: ${others[0]}; score 2: ${others[1]}; score 3: <em>f</em>; score 4: ${others[2]}; score 5: ${others[3]}. The mean score is exactly ${meanShown}.${br('i', 'Find the value of f.')}${br('ii', 'Find the total number of scores recorded.')}${br('iii', 'State the mode.')}`,
			answer: multi([f, N, mode], ['f', 'total scores', 'mode']),
			solution: `<p>(i) The known rows contribute ${So} to &Sigma;fx from ${No} scores, so ${So} + 3f = ${meanShown}(${No} + f).</p>
<p>Rearranging: f(3 &minus; ${meanShown}) = ${meanShown} &times; ${No} &minus; ${So}, giving f = <strong>${f}</strong>.</p>
<p>(ii) Total = ${No} + ${f} = <strong>${N}</strong>.</p>
<p>(iii) The largest frequency belongs to score <strong>${mode}</strong>.</p>`,
		};
	});

	// 3. Sphere inscribed in a cube
	boss('boss6-sphere-cube', 'Spheres in cubes', function (r) {
		const s = r.int(4, 18);
		const Vs = Math.PI * s ** 3 / 6;
		const left = s ** 3 - Vs;
		const R = s * Math.sqrt(3) / 2;
		return {
			marks: 6,
			text: `A cube has side length ${s} cm. A sphere is inscribed in the cube (touching all six faces). Give answers correct to 1 decimal place, except the last which needs 2 decimal places.${br('i', 'Find the volume of the sphere.')}${br('ii', 'Find the volume inside the cube but outside the sphere.')}${br('iii', 'Find the radius of the sphere that passes through all eight <em>vertices</em> of the cube.')}`,
			answer: multi([dp(Vs, 1), dp(left, 1), dp(R, 2)], ['sphere (cm&sup3;)', 'gap (cm&sup3;)', 'circumradius (cm)'], 0.06),
			solution: `<p>(i) The inscribed sphere has radius ${s / 2}: V = ${F.frac('4', '3')}&pi; &times; ${s / 2}&sup3; = <strong>${dp(Vs, 1)} cm&sup3;</strong>.</p>
<p>(ii) Cube volume ${s ** 3} minus the sphere: <strong>${dp(left, 1)} cm&sup3;</strong>.</p>
<p>(iii) The circumscribed sphere&rsquo;s diameter is the space diagonal ${s}&radic;3: R = ${F.frac(`${s}&radic;3`, '2')} = <strong>${dp(R, 2)} cm</strong>.</p>`,
		};
	});

	// 4. Linear function from two values, then a composite equation
	boss('boss6-linear-composite', 'Linear functions + Composition', function (r) {
		const a = r.int(2, 5), b = r.nonzeroInt(-9, 9);
		const p = a + b, q = 4 * a + b;
		const x0 = r.int(-4, 6);
		const m = a * a * x0 + a * b + b;
		return {
			marks: 6,
			text: `A linear function satisfies f(1) = ${p} and f(4) = ${q}.${br('i', 'Find the gradient of f.')}${br('ii', 'Find the constant term of f.')}${br('iii', `Solve f(f(x)) = ${m}.`)}`,
			diagram: { type: 'graph', xmin: -5, xmax: 5, ymin: -40, ymax: 40, grid: true, fns: [{ fn: (x) => a * x + b }], points: [[1, p, '(1, ' + p + ')'], [4, q, '(4, ' + q + ')']] },
			answer: multi([a, b, x0], ['gradient', 'constant', 'x']),
			solution: `<p>(i) Gradient = ${F.frac(`${q} &minus; ${p}`, '4 &minus; 1')} = <strong>${a}</strong>.</p>
<p>(ii) f(1) = ${a} + c = ${p}, so c = <strong>${b}</strong>, i.e. f(x) = ${F.poly([a, b])}.</p>
<p>(iii) f(f(x)) = ${a}(${F.poly([a, b])})${F.st(b, '')} = ${F.poly([a * a, a * b + b])}. Setting this equal to ${m}: ${a * a}x = ${m - a * b - b}, so x = <strong>${x0}</strong>.</p>`,
		};
	});

	// 5. Bounds from rounded measurements
	boss('boss6-bounds', 'Bounds + Error intervals', function (r) {
		let L, W;
		do { L = r.int(6, 30); W = r.int(4, 20); } while (L === W);
		const ub = (L + 0.5) * (W + 0.5);
		const lb = (L - 0.5) * (W - 0.5);
		const maxPer = 2 * (L + W) + 2;
		return {
			marks: 6,
			text: `A rectangle is measured as ${L} cm by ${W} cm, each length correct to the nearest centimetre. Give areas correct to 2 decimal places.${br('i', 'Find the upper bound of the area.')}${br('ii', 'Find the lower bound of the area.')}${br('iii', 'Find the greatest possible perimeter.')}`,
			diagram: { type: 'quad', pts: [[0, 0], [L, 0], [L, W], [0, W]], labels: ['', '', '', ''], sideLabels: [`${L} cm`, `${W} cm`, `${L} cm`, `${W} cm`], rightAngles: [0, 1, 2, 3] },
			answer: multi([dp(ub, 2), dp(lb, 2), maxPer], ['upper bound (cm&sup2;)', 'lower bound (cm&sup2;)', 'max perimeter (cm)'], 0.006),
			solution: `<p>The true lengths lie in [${L - 0.5}, ${L + 0.5}) and [${W - 0.5}, ${W + 0.5}).</p>
<p>(i) Upper bound = ${L + 0.5} &times; ${W + 0.5} = <strong>${dp(ub, 2)} cm&sup2;</strong>.</p>
<p>(ii) Lower bound = ${L - 0.5} &times; ${W - 0.5} = <strong>${dp(lb, 2)} cm&sup2;</strong>.</p>
<p>(iii) Greatest perimeter = 2(${L + 0.5} + ${W + 0.5}) = <strong>${maxPer} cm</strong>.</p>`,
		};
	});

	// 6. Proportionality chain
	boss('boss6-proportion-square', 'Proportion to a square', function (r) {
		const k = r.int(2, 5), x0 = r.int(2, 6);
		let x2, x3;
		do { x2 = r.int(2, 9); x3 = r.int(2, 9); } while (x2 === x0 || x3 === x0 || x3 === x2);
		const y0 = k * x0 * x0, y2 = k * x2 * x2, Y = k * x3 * x3;
		return {
			marks: 6,
			text: `A quantity y is directly proportional to the <em>square</em> of x, and y = ${y0} when x = ${x0}.${br('i', 'Find the constant of proportionality.')}${br('ii', `Find y when x = ${x2}.`)}${br('iii', `Find the positive value of x when y = ${Y}.`)}`,
			answer: multi([k, y2, x3], ['constant k', 'y', 'x']),
			solution: `<p>(i) y = kx&sup2;: ${y0} = k &times; ${x0 * x0}, so k = <strong>${k}</strong>.</p>
<p>(ii) y = ${k} &times; ${x2}&sup2; = <strong>${y2}</strong>.</p>
<p>(iii) ${Y} = ${k}x&sup2;, so x&sup2; = ${x3 * x3} and the positive root is x = <strong>${x3}</strong>.</p>`,
		};
	});

	// 7. Boat in a current
	boss('boss6-river-current', 'Boats + Currents', function (r) {
		const b = r.int(6, 14), c = r.int(1, Math.min(5, b - 3));
		const D = r.int(12, 60);
		const t1 = D / (b + c), t2 = D / (b - c);
		const avg = (b * b - c * c) / b;
		return {
			marks: 6,
			text: `A boat travels at ${b} km/h in still water on a river whose current flows at ${c} km/h. It goes ${D} km downstream and then returns. Give answers correct to 2 decimal places.${br('i', 'Find the time for the downstream leg, in hours.')}${br('ii', 'Find the time for the upstream leg, in hours.')}${br('iii', 'Find the average speed for the whole round trip.')}`,
			answer: multi([dp(t1, 2), dp(t2, 2), dp(avg, 2)], ['downstream (h)', 'upstream (h)', 'average (km/h)'], 0.006),
			solution: `<p>(i) Downstream speed ${b} + ${c} = ${b + c} km/h: t = ${F.frac(String(D), String(b + c))} = <strong>${dp(t1, 2)} h</strong>.</p>
<p>(ii) Upstream speed ${b} &minus; ${c} = ${b - c} km/h: t = ${F.frac(String(D), String(b - c))} = <strong>${dp(t2, 2)} h</strong>.</p>
<p>(iii) Average = ${F.frac(`2 &times; ${D}`, `${dp(t1, 4)} + ${dp(t2, 4)}`)} = ${F.frac(`(${b}&sup2; &minus; ${c}&sup2;)`, String(b))} = <strong>${dp(avg, 2)} km/h</strong> &mdash; less than ${b} km/h, because the slow leg takes longer.</p>`,
		};
	});

	// 8. Diluting a drink
	boss('boss6-concentration', 'Concentration + Dilution', function (r) {
		let p, V, W, t, addl;
		do {
			p = r.int(12, 40); V = 100 * r.int(2, 6); W = 50 * r.int(1, 6);
			t = r.int(5, 20);
			const juice = p * V / 100;
			addl = 100 * juice / t - V;
		} while (t >= p || !Number.isInteger(addl) || addl <= W);
		const juice = p * V / 100;
		const newPct = 100 * juice / (V + W);
		return {
			marks: 6,
			text: `A jug holds ${V} ml of drink that is ${p}% pure juice. Give the percentage correct to 1 decimal place.${br('i', 'How many millilitres of pure juice does it contain?')}${br('ii', `If ${W} ml of water is added, what percentage of the mixture is juice?`)}${br('iii', `How much water in total (instead of the ${W} ml) must be added to the original drink to bring it down to exactly ${t}% juice?`)}`,
			answer: multi([juice, dp(newPct, 1), addl], ['juice (ml)', 'new percentage (%)', 'total water (ml)'], 0.06),
			solution: `<p>(i) ${p}% of ${V} = <strong>${juice} ml</strong>.</p>
<p>(ii) The juice is unchanged but the volume grows: ${F.frac(String(juice), String(V + W))} &times; 100 = <strong>${dp(newPct, 1)}%</strong>.</p>
<p>(iii) We need ${F.frac(String(juice), `${V} + w`)} = ${t}%, so ${V} + w = ${100 * juice / t} and w = <strong>${addl} ml</strong>.</p>`,
		};
	});

	// 9. Triangle by coordinates: side, area, perimeter
	boss('boss6-shoelace', 'Shoelace area + Perimeter', function (r) {
		let A, B, C, area2;
		do {
			A = [r.int(-4, 5), r.int(-4, 5)];
			B = [r.int(-4, 5), r.int(-4, 5)];
			C = [r.int(-4, 5), r.int(-4, 5)];
			area2 = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]));
		} while (area2 === 0 || area2 % 2 !== 0 || area2 < 8);
		const area = area2 / 2;
		const len = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
		const ab = len(A, B);
		const per = ab + len(B, C) + len(C, A);
		return {
			marks: 6,
			text: `Triangle ABC has vertices A(${A[0]}, ${A[1]}), B(${B[0]}, ${B[1]}) and C(${C[0]}, ${C[1]}). Give lengths correct to 2 decimal places.${br('i', 'Find the length AB.')}${br('ii', 'Find the area of the triangle. <em>Hint: the shoelace formula.</em>')}${br('iii', 'Find the perimeter.')}`,
			diagram: { type: 'graph', xmin: -5, xmax: 6, ymin: -5, ymax: 6, grid: true, points: [[A[0], A[1], 'A'], [B[0], B[1], 'B'], [C[0], C[1], 'C']], fns: [] },
			answer: multi([dp(ab, 2), area, dp(per, 2)], ['AB', 'area', 'perimeter'], 0.006),
			solution: `<p>(i) AB = &radic;((${B[0]} &minus; ${A[0]})&sup2; + (${B[1]} &minus; ${A[1]})&sup2;) = <strong>${dp(ab, 2)}</strong>.</p>
<p>(ii) Shoelace: &frac12;|x<sub>A</sub>(y<sub>B</sub> &minus; y<sub>C</sub>) + x<sub>B</sub>(y<sub>C</sub> &minus; y<sub>A</sub>) + x<sub>C</sub>(y<sub>A</sub> &minus; y<sub>B</sub>)| = &frac12; &times; ${area2} = <strong>${area}</strong>.</p>
<p>(iii) Adding BC = ${dp(len(B, C), 2)} and CA = ${dp(len(C, A), 2)}: perimeter = <strong>${dp(per, 2)}</strong>.</p>`,
		};
	});

	// 10. Alternate segment theorem chain
	boss('boss6-alt-segment', 'Alternate segment theorem', function (r) {
		const al = r.int(25, 70);
		const centre = 2 * al;
		const ota = 90 - al;
		const other = 180 - al;
		return {
			marks: 6,
			text: `PT is a tangent to a circle with centre O, touching it at T. The chord TA makes an angle of ${deg(al)} with the tangent.${br('i', 'Find the angle subtended by the chord TA at the centre O.')}${br('ii', 'Find the angle OTA.')}${br('iii', 'A point Q lies on the <em>minor</em> arc TA. Find the angle TQA.')}`,
			answer: multi([centre, ota, other], ['angle TOA (degrees)', 'angle OTA (degrees)', 'angle TQA (degrees)']),
			solution: `<p>By the alternate segment theorem, the angle in the alternate (major) segment equals the tangent&ndash;chord angle, ${deg(al)}.</p>
<p>(i) The angle at the centre is twice the angle at the circumference: 2 &times; ${al}&deg; = <strong>${deg(centre)}</strong>.</p>
<p>(ii) The radius OT is perpendicular to the tangent, so angle OTA = 90&deg; &minus; ${al}&deg; = <strong>${deg(ota)}</strong>. (Check: triangle OTA is isosceles, and ${ota}&deg; + ${ota}&deg; + ${centre}&deg; = 180&deg;.)</p>
<p>(iii) Opposite angles of the cyclic quadrilateral TQA&hellip; the angle in the <em>other</em> segment is supplementary: 180&deg; &minus; ${al}&deg; = <strong>${deg(other)}</strong>.</p>`,
		};
	});

	// 11. First-order recurrence with a fixed point
	boss('boss6-recurrence-fixed', 'Recurrences + Fixed points', function (r) {
		let a, pfix, u1;
		do {
			a = r.int(2, 4);
			pfix = r.nonzeroInt(-6, 6);
			u1 = r.int(-8, 8);
		} while (u1 === pfix || Math.abs(u1 - pfix) > 6);
		const b = pfix * (1 - a);
		const u2 = a * u1 + b;
		const u3 = a * u2 + b;
		const u4 = a * u3 + b;
		return {
			marks: 6,
			text: `A sequence is defined by u<sub>n+1</sub> = ${a}u<sub>n</sub>${F.st(b, '')} with u<sub>1</sub> = ${u1}.${br('i', 'Find u&#8322;.')}${br('ii', 'Find u&#8324;.')}${br('iii', 'Find the value of u&#8321; for which the sequence would be constant.')}`,
			answer: multi([u2, u4, pfix], ['u&#8322;', 'u&#8324;', 'constant value']),
			solution: `<p>(i) u&#8322; = ${a} &times; ${u1}${F.st(b, '')} = <strong>${u2}</strong>.</p>
<p>(ii) u&#8323; = ${a} &times; ${u2}${F.st(b, '')} = ${u3}, then u&#8324; = ${a} &times; ${u3}${F.st(b, '')} = <strong>${u4}</strong>.</p>
<p>(iii) A constant sequence needs x = ${a}x${F.st(b, '')}, so ${a - 1}x = ${-b} and x = <strong>${pfix}</strong>.</p>`,
		};
	});

	// 12. Committee selection
	boss('boss6-committee', 'Combinations + At least one', function (r) {
		const m = r.int(4, 9), w = r.int(4, 9);
		const total = comb(m + w, 3);
		const allW = comb(w, 3);
		const atLeast1 = total - allW;
		return {
			marks: 6,
			text: `A committee of 3 people is chosen at random from ${m} men and ${w} women.${br('i', 'How many different committees are possible?')}${br('ii', 'How many committees consist entirely of women?')}${br('iii', 'How many committees contain at least one man?')}`,
			answer: multi([total, allW, atLeast1], ['total', 'all women', 'at least one man']),
			solution: `<p>(i) Choose 3 from ${m + w}: ${F.frac(`${m + w} &times; ${m + w - 1} &times; ${m + w - 2}`, '3 &times; 2 &times; 1')} = <strong>${total}</strong>.</p>
<p>(ii) Choose 3 from the ${w} women: <strong>${allW}</strong>.</p>
<p>(iii) The complement of &ldquo;no men&rdquo;: ${total} &minus; ${allW} = <strong>${atLeast1}</strong>.</p>`,
		};
	});

	// 13. First success on the nth trial
	boss('boss6-first-success', 'First success + Complements', function (r) {
		const k = r.int(8, 18);
		const p = k / 20;
		const ctx = r.pick([
			['A quality inspector finds a flaw in a sampled item', 'items are inspected one at a time'],
			['A fisherman gets a bite on a cast', 'casts are made one after another'],
			['A player wins a fairground game', 'games are played repeatedly'],
		]);
		const on2 = (1 - p) * p;
		const on3 = (1 - p) * (1 - p) * p;
		const within3 = 1 - (1 - p) ** 3;
		return {
			marks: 6,
			text: `${ctx[0]} with probability ${dp(p, 2)} each time, independently, and ${ctx[1]}. Give probabilities correct to 3 decimal places.${br('i', 'Find the probability the first success occurs on the 2nd attempt.')}${br('ii', 'Find the probability the first success occurs on the 3rd attempt.')}${br('iii', 'Find the probability of at least one success within the first 3 attempts.')}`,
			answer: multi([dp(on2, 3), dp(on3, 3), dp(within3, 3)], ['on 2nd', 'on 3rd', 'within 3'], 0.0006),
			solution: `<p>(i) Fail then succeed: ${dp(1 - p, 2)} &times; ${dp(p, 2)} = <strong>${dp(on2, 3)}</strong>.</p>
<p>(ii) Two failures then a success: ${dp(1 - p, 2)}&sup2; &times; ${dp(p, 2)} = <strong>${dp(on3, 3)}</strong>.</p>
<p>(iii) Complement of three failures: 1 &minus; ${dp(1 - p, 2)}&sup3; = <strong>${dp(within3, 3)}</strong>.</p>`,
		};
	});

	// 14. Adding a value changes the mean
	boss('boss6-mean-shift', 'Means + Adding a value', function (r) {
		let n, m, m2;
		do { n = r.int(6, 15); m = r.int(10, 60); m2 = m + r.nonzeroInt(-4, 4); } while (m2 <= 0);
		const oldT = n * m, newT = (n + 1) * m2, x = newT - oldT;
		return {
			marks: 6,
			text: `The mean of ${n} test scores is ${m}. When one more score is added, the mean of all ${n + 1} scores becomes ${m2}.${br('i', 'Find the total of the original scores.')}${br('ii', 'Find the total of all the scores after the addition.')}${br('iii', 'Find the added score.')}`,
			answer: multi([oldT, newT, x], ['original total', 'new total', 'added score']),
			solution: `<p>(i) Total = ${n} &times; ${m} = <strong>${oldT}</strong>.</p>
<p>(ii) New total = ${n + 1} &times; ${m2} = <strong>${newT}</strong>.</p>
<p>(iii) Added score = ${newT} &minus; ${oldT} = <strong>${x}</strong> &mdash; ${x > m ? 'above' : 'below'} the old mean, which is why the mean ${m2 > m ? 'rose' : 'fell'}.</p>`,
		};
	});

	// 15. Last digits of large powers
	boss('boss6-last-digit', 'Last digits + Cycles', function (r) {
		let a, b2;
		do { a = r.pick([2, 3, 7, 8]); b2 = r.pick([2, 3, 7, 8]); } while (a === b2);
		const n = r.int(15, 99), m = r.int(15, 99);
		const last = (base, e) => {
			const cyc = [base % 10, base ** 2 % 10, base ** 3 % 10, base ** 4 % 10];
			return cyc[(e - 1) % 4];
		};
		const d1 = last(a, n), d2 = last(b2, m), d3 = (d1 + d2) % 10;
		return {
			marks: 6,
			text: `The last digits of powers repeat in cycles of length 4 for the base ${a}: ${a % 10}, ${a ** 2 % 10}, ${a ** 3 % 10}, ${a ** 4 % 10}, &hellip;${br('i', `Find the last digit of ${a}<sup>${n}</sup>.`)}${br('ii', `Find the last digit of ${b2}<sup>${m}</sup>.`)}${br('iii', `Find the last digit of ${a}<sup>${n}</sup> + ${b2}<sup>${m}</sup>.`)}`,
			answer: multi([d1, d2, d3], [`last digit of ${a}^${n}`, `last digit of ${b2}^${m}`, 'last digit of the sum']),
			solution: `<p>(i) ${n} = 4 &times; ${Math.floor((n - 1) / 4)} + ${((n - 1) % 4) + 1}, so ${a}<sup>${n}</sup> ends like ${a}<sup>${((n - 1) % 4) + 1}</sup>: <strong>${d1}</strong>.</p>
<p>(ii) The cycle for ${b2} is ${b2 % 10}, ${b2 ** 2 % 10}, ${b2 ** 3 % 10}, ${b2 ** 4 % 10}. Position ${((m - 1) % 4) + 1} gives <strong>${d2}</strong>.</p>
<p>(iii) (${d1} + ${d2}) mod 10 = <strong>${d3}</strong>.</p>`,
		};
	});

	// 16. Line meets parabola
	boss('boss6-line-parabola', 'Lines meeting parabolas', function (r) {
		let r1, r2, mm;
		do {
			r1 = r.int(-5, 4); r2 = r1 + r.int(2, 7); mm = r.int(-3, 4);
		} while (r2 > 6);
		const C = r.int(-6, 6);
		const slope = mm;
		// construct: x^2 + Bp x + C = slope x + K has roots r1, r2 => Bp - slope = -(r1+r2), C - K = r1 r2
		const Bp = slope - r1 - r2;
		const K = C - r1 * r2;
		const dist = (r2 - r1) * Math.hypot(1, slope);
		return {
			marks: 6,
			text: `The line y = ${F.poly([slope, K])} meets the parabola y = ${F.poly([1, Bp, C])} at two points. Give the distance correct to 2 decimal places.${br('i', 'Find the smaller x-coordinate of the intersection points.')}${br('ii', 'Find the larger x-coordinate.')}${br('iii', 'Find the distance between the two intersection points.')}`,
			diagram: { type: 'graph', xmin: -7, xmax: 8, ymin: -60, ymax: 160, grid: true, fns: [{ fn: (x) => slope * x + K }, { fn: (x) => x * x + Bp * x + C }] },
			answer: multi([r1, r2, dp(dist, 2)], ['smaller x', 'larger x', 'distance'], 0.006),
			solution: `<p>Setting equal: ${F.poly([1, Bp, C])} = ${F.poly([slope, K])} gives ${F.poly([1, Bp - slope, C - K])} = 0, which factorises as (x${F.st(-r1, '')})(x${F.st(-r2, '')}) = 0.</p>
<p>(i)&ndash;(ii) x = <strong>${r1}</strong> and x = <strong>${r2}</strong>.</p>
<p>(iii) The x-gap is ${r2 - r1}; along a line of gradient ${slope} the distance is ${r2 - r1}&radic;(1 + ${slope}&sup2;) = <strong>${dp(dist, 2)}</strong>.</p>`,
		};
	});

	// 17. Area, cosine rule, circumradius
	boss('boss6-area-circumradius', 'Area + Circumradius', function (r) {
		const a = r.int(5, 12), b = r.int(5, 12);
		const C = r.pick([30, 45, 60, 120, 135]);
		const area = 0.5 * a * b * Math.sin(rad(C));
		const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C)));
		const R = c / (2 * Math.sin(rad(C)));
		return {
			marks: 7,
			text: `In triangle ABC, a = ${a} cm, b = ${b} cm and the included angle C = ${deg(C)}. Give answers correct to 2 decimal places.${br('i', 'Find the area of the triangle.')}${br('ii', 'Find the third side c.')}${br('iii', 'Find the radius of the circle passing through all three vertices. <em>Hint: sine rule.</em>')}`,
			diagram: { type: 'triangle', a, b, c, labels: ['A', 'B', 'C'], sideLabels: [a + ' cm', b + ' cm', ''], angleLabels: ['', '', C + '°'] },
			answer: multi([dp(area, 2), dp(c, 2), dp(R, 2)], ['area (cm&sup2;)', 'c (cm)', 'circumradius (cm)'], 0.006),
			solution: `<p>(i) Area = &frac12;ab sin C = &frac12; &times; ${a} &times; ${b} &times; sin ${C}&deg; = <strong>${dp(area, 2)} cm&sup2;</strong>.</p>
<p>(ii) Cosine rule: c&sup2; = ${a}&sup2; + ${b}&sup2; &minus; 2 &times; ${a} &times; ${b} cos ${C}&deg; = ${dp(c * c, 3)}, so c = <strong>${dp(c, 2)} cm</strong>.</p>
<p>(iii) The sine rule gives the circumdiameter: 2R = ${F.frac('c', 'sin C')} = ${F.frac(String(dp(c, 3)), `sin ${C}&deg;`)}, so R = <strong>${dp(R, 2)} cm</strong>.</p>`,
		};
	});

	// 18. Kite from its diagonals
	boss('boss6-kite', 'Kites + Pythagoras', function (r) {
		let s1, s2, h;
		do { s1 = r.int(2, 9); s2 = r.int(2, 9); h = r.int(2, 6); } while (s1 >= s2);
		const area = (s1 + s2) * h;
		const side1 = Math.hypot(s1, h), side2 = Math.hypot(s2, h);
		const per = 2 * (side1 + side2);
		return {
			marks: 6,
			text: `In a kite, the axis of symmetry is a diagonal of length ${s1 + s2} cm; the other diagonal, of length ${2 * h} cm, crosses it at right angles, ${s1} cm from one end. Give lengths correct to 2 decimal places.${br('i', 'Find the area of the kite.')}${br('ii', 'Find the length of the shorter pair of sides.')}${br('iii', 'Find the perimeter.')}`,
			diagram: { type: 'quad', pts: [[0, s1], [h, 0], [0, -s2], [-h, 0]], labels: ['A', 'B', 'C', 'D'], sideLabels: ['', '', '', ''], diagonals: 'both', diagLabels: [`${s1 + s2} cm`, `${2 * h} cm`] },
			answer: multi([area, dp(side1, 2), dp(per, 2)], ['area (cm&sup2;)', 'shorter side (cm)', 'perimeter (cm)'], 0.006),
			solution: `<p>(i) Area of a kite = &frac12; &times; product of diagonals = &frac12; &times; ${s1 + s2} &times; ${2 * h} = <strong>${area} cm&sup2;</strong>.</p>
<p>(ii) The crossing point splits the axis into ${s1} and ${s2}, and the short diagonal into two halves of ${h}. Shorter side = &radic;(${s1}&sup2; + ${h}&sup2;) = <strong>${dp(side1, 2)} cm</strong>.</p>
<p>(iii) Longer side = &radic;(${s2}&sup2; + ${h}&sup2;) = ${dp(side2, 2)}. Perimeter = 2(${dp(side1, 2)} + ${dp(side2, 2)}) = <strong>${dp(per, 2)} cm</strong>.</p>`,
		};
	});

	// 19. Depreciation vs half value
	boss('boss6-depreciation', 'Depreciation + Half-value time', function (r) {
		const V0 = 1000 * r.int(8, 40);
		const p = r.int(12, 30);
		const n = r.int(3, 6);
		const Vn = V0 * (1 - p / 100) ** n;
		const loss = 100 * (1 - (1 - p / 100) ** n);
		let y = 1;
		while ((1 - p / 100) ** y > 0.5) y++;
		return {
			marks: 6,
			text: `A van costs &pound;${V0} and loses ${p}% of its value each year.${br('i', `Find its value after ${n} years, to the nearest pound.`)}${br('ii', `Find the overall percentage loss over those ${n} years, correct to 1 decimal place.`)}${br('iii', 'After how many whole years is the van first worth less than half its original price?')}`,
			answer: multi([Math.round(Vn), dp(loss, 1), y], ['value (&pound;)', 'loss (%)', 'years'], 0.06),
			solution: `<p>(i) ${V0} &times; ${dp(1 - p / 100, 2)}<sup>${n}</sup> = <strong>&pound;${Math.round(Vn)}</strong>.</p>
<p>(ii) The multiplier over ${n} years is ${dp((1 - p / 100) ** n, 4)}, a loss of <strong>${dp(loss, 1)}%</strong> &mdash; more than ${n} &times; ${p}% would suggest is wrong: percentage losses do not simply add.</p>
<p>(iii) We need ${dp(1 - p / 100, 2)}<sup>t</sup> &lt; 0.5; testing whole years gives t = <strong>${y}</strong>.</p>`,
		};
	});

	// 20. Gear trains
	boss('boss6-gears', 'Gear trains + Ratios', function (r) {
		const tB = 4 * r.int(3, 6);
		const m1 = r.int(2, 4);
		const tA = m1 * tB;
		const tD = 4 * r.int(3, 6);
		const m2 = r.int(2, 3);
		const tC = m2 * tD;
		const rpmA = r.int(10, 30);
		const rpmB = rpmA * m1;
		const rpmD = rpmB * m2;
		const T = r.int(3, 8);
		return {
			marks: 6,
			text: `Gear A (${tA} teeth) drives gear B (${tB} teeth). On the same axle as B is gear C (${tC} teeth), which drives gear D (${tD} teeth). Gear A turns at ${rpmA} revolutions per minute.${br('i', 'Find the speed of gear B, in rpm.')}${br('ii', 'Find the speed of gear D, in rpm.')}${br('iii', `How many complete revolutions does gear D make in ${T} minutes?`)}`,
			diagram: { type: 'circles2', r1: tA, r2: tB, touch: 'external', r1Label: `${tA} teeth`, r2Label: `${tB} teeth`, labels: ['A', 'B'] },
			answer: multi([rpmB, rpmD, rpmD * T], ['B (rpm)', 'D (rpm)', 'revolutions']),
			solution: `<p>(i) Meshed gears swap speed in inverse ratio of teeth: B = ${rpmA} &times; ${F.frac(String(tA), String(tB))} = <strong>${rpmB} rpm</strong>.</p>
<p>(ii) C turns with B (same axle) at ${rpmB} rpm, and D = ${rpmB} &times; ${F.frac(String(tC), String(tD))} = <strong>${rpmD} rpm</strong>.</p>
<p>(iii) ${rpmD} &times; ${T} = <strong>${rpmD * T}</strong> revolutions.</p>`,
		};
	});

	// 21. Cylinder melted into wire
	boss('boss6-wire', 'Volume conservation + Wire', function (r) {
		const R = r.int(3, 6), H = r.int(8, 20);
		const rw = r.pick([0.2, 0.25, 0.5]);
		const V = Math.PI * R * R * H;
		const L = R * R * H / (rw * rw);
		const P = r.int(2, 6);
		const pieces = Math.floor(L / (100 * P));
		return {
			marks: 6,
			text: `A solid metal cylinder of radius ${R} cm and height ${H} cm is melted down and drawn into a wire of radius ${rw} cm. Give the volume correct to 1 decimal place.${br('i', 'Find the volume of the metal.')}${br('ii', 'Find the length of the wire, in centimetres.')}${br('iii', `How many complete ${P} m pieces can be cut from the wire?`)}`,
			diagram: { type: 'cylinder', rLabel: `${R} cm`, hLabel: `${H} cm`, domeTop: false },
			answer: multi([dp(V, 1), L, pieces], ['volume (cm&sup3;)', 'length (cm)', 'pieces'], 0.06),
			solution: `<p>(i) V = &pi;r&sup2;h = &pi; &times; ${R * R} &times; ${H} = <strong>${dp(V, 1)} cm&sup3;</strong>.</p>
<p>(ii) The volume is conserved: &pi; &times; ${rw}&sup2; &times; L = &pi; &times; ${R * R * H}, so L = ${F.frac(String(R * R * H), `${rw * rw}`)} = <strong>${L} cm</strong>. (The &pi; cancels.)</p>
<p>(iii) ${P} m = ${100 * P} cm: ${F.frac(String(L), String(100 * P))} = ${dp(L / (100 * P), 2)}, so <strong>${pieces}</strong> complete pieces.</p>`,
		};
	});

	// 22. Linear programming corners
	boss('boss6-linear-prog', 'Linear programming + Corners', function (r) {
		let a, b;
		do { a = r.int(2, 7); b = r.int(2, 7); } while (a === b);
		const s = r.int(8, 15);
		const c = r.int(3, s - 3);
		const P1 = a * c + b * (s - c);
		const P2 = b * s;
		const best = Math.max(0, a * c, P1, P2);
		return {
			marks: 6,
			text: `A region is defined by x &ge; 0, y &ge; 0, x &le; ${c} and x + y &le; ${s}. The objective is P = ${F.lt(a, 'x')}${F.st(b, 'y')}.${br('i', `Find P at the corner (${c}, ${s - c}).`)}${br('ii', `Find P at the corner (0, ${s}).`)}${br('iii', 'Find the maximum value of P over the whole region. <em>Hint: a linear objective is maximised at a corner.</em>')}`,
			diagram: { type: 'graph', xmin: 0, xmax: s + 1, ymin: 0, ymax: s + 1, grid: true, fns: [{ fn: (x) => s - x }], points: [[0, 0], [c, 0], [c, s - c], [0, s]] },
			answer: multi([P1, P2, best], [`P(${c}, ${s - c})`, `P(0, ${s})`, 'maximum P']),
			solution: `<p>The corners of the region are (0, 0), (${c}, 0), (${c}, ${s - c}) and (0, ${s}).</p>
<p>(i) P = ${a} &times; ${c} + ${b} &times; ${s - c} = <strong>${P1}</strong>.</p>
<p>(ii) P = ${b} &times; ${s} = <strong>${P2}</strong>.</p>
<p>(iii) The values at the corners are 0, ${a * c}, ${P1} and ${P2}; the maximum is <strong>${best}</strong>.</p>`,
		};
	});

	// 23. Expanding a surd expression
	boss('boss6-surd-expand', 'Surds + Conjugates', function (r) {
		let p, q;
		do { p = r.int(2, 7); q = r.int(2, 30); } while (Math.round(Math.sqrt(q)) ** 2 === q);
		const A = p * p + q, Bc = 2 * p, C = p * p - q;
		return {
			marks: 6,
			text: `Let x = ${p} + &radic;${q}. All answers are integers.${br('i', `x&sup2; can be written as a + b&radic;${q}. Find a.`)}${br('ii', 'Find b.')}${br('iii', `Find the value of x(${p} &minus; &radic;${q}).`)}`,
			answer: multi([A, Bc, C], ['a', 'b', `x(${p} &minus; &radic;${q})`]),
			solution: `<p>(i)&ndash;(ii) x&sup2; = (${p} + &radic;${q})&sup2; = ${p * p} + 2 &times; ${p}&radic;${q} + ${q} = <strong>${A}</strong> + <strong>${Bc}</strong>&radic;${q}.</p>
<p>(iii) This is a difference of squares: (${p} + &radic;${q})(${p} &minus; &radic;${q}) = ${p * p} &minus; ${q} = <strong>${C}</strong> &mdash; the surd cancels, which is exactly why conjugates are used to rationalise denominators.</p>`,
		};
	});

	// 24. Isosceles triangle angle chase
	boss('boss6-angle-chase', 'Isosceles triangles + Angle chase', function (r) {
		const al = 2 * r.int(11, 60);
		const base = (180 - al) / 2;
		const ext = 180 - base;
		const reflex = 360 - al;
		return {
			marks: 6,
			text: `Triangle ABC is isosceles with AB = AC, and the apex angle at A is ${deg(al)}. The side BC is extended beyond C to a point D.${br('i', 'Find the base angle ABC.')}${br('ii', 'Find the exterior angle ACD.')}${br('iii', 'Find the reflex angle at A (the angle on the outside of the triangle at vertex A).')}`,
			diagram: { type: 'triangle', a: 2 * Math.sin(rad(al / 2)), b: 1, c: 1, labels: ['A', 'B', 'C'], sideLabels: ['', 'equal', 'equal'], angleLabels: [al + '°', '', ''] },
			answer: multi([base, ext, reflex], ['angle ABC (degrees)', 'angle ACD (degrees)', 'reflex at A (degrees)']),
			solution: `<p>(i) The base angles are equal: ${F.frac(`180 &minus; ${al}`, '2')} = <strong>${deg(base)}</strong>.</p>
<p>(ii) Angles on the straight line BCD: 180&deg; &minus; ${base}&deg; = <strong>${deg(ext)}</strong>. (Equivalently, the exterior angle equals the sum of the two opposite interior angles: ${al}&deg; + ${base}&deg;.)</p>
<p>(iii) Angles around point A total 360&deg;: 360&deg; &minus; ${al}&deg; = <strong>${deg(reflex)}</strong>.</p>`,
		};
	});

	// 25. Standard deviation of a small data set
	boss('boss6-stdev', 'Standard deviation from scratch', function (r) {
		let xs, sum, mean, varr;
		do {
			xs = [r.int(2, 15), r.int(2, 15), r.int(2, 15), r.int(2, 15), r.int(2, 15)];
			sum = xs.reduce((a, b) => a + b, 0);
			mean = sum / 5;
			varr = xs.reduce((a, x) => a + (x - mean) ** 2, 0) / 5;
		} while (sum % 5 !== 0 || varr < 0.5);
		const sumsq = xs.reduce((a, x) => a + x * x, 0);
		const sd = Math.sqrt(varr);
		return {
			marks: 6,
			text: `Five readings are recorded: ${xs.join(', ')}. Give the standard deviation correct to 2 decimal places.${br('i', 'Find the mean.')}${br('ii', 'Find &Sigma;x&sup2;, the sum of the squares of the readings.')}${br('iii', 'Find the (population) standard deviation. <em>Hint: &sigma;&sup2; = &Sigma;x&sup2;/n &minus; mean&sup2;.</em>')}`,
			answer: multi([mean, sumsq, dp(sd, 2)], ['mean', '&Sigma;x&sup2;', 'standard deviation'], 0.006),
			solution: `<p>(i) Mean = ${F.frac(String(sum), '5')} = <strong>${mean}</strong>.</p>
<p>(ii) ${xs.map((x) => `${x}&sup2;`).join(' + ')} = <strong>${sumsq}</strong>.</p>
<p>(iii) &sigma;&sup2; = ${F.frac(String(sumsq), '5')} &minus; ${mean}&sup2; = ${dp(varr, 4)}, so &sigma; = <strong>${dp(sd, 2)}</strong>.</p>`,
		};
	});

})();
