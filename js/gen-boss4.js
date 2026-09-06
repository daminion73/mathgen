// Boss batch 4: probability, statistics and coordinate geometry chains.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const dp = (x, d) => MG.round(x, d);
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 3, gen });
	const num = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	// The opening of every Boss chain assesses the modelling argument; later
	// parts then use that result.  This also prevents otherwise routine first
	// parts being treated as unsupported calculator answers.
	const br = (i, s) => `<br><strong>(${i})</strong> ${i === 'i' ? 'Show that the given information leads to a definite result, stating the equation or rule used. Hence ' : ''}${s.charAt(0).toLowerCase()}${s.slice(1)}`;

	// 1. Two draws without replacement
	boss('boss4-two-draws', 'Probability without replacement', function (r) {
		const colours = r.pick([['red', 'blue'], ['green', 'yellow'], ['black', 'white']]);
		let a, b;
		do { a = r.int(3, 9); b = r.int(3, 9); } while (a === b);
		const t = a + b;
		const both = a * (a - 1) / (t * (t - 1));
		const oneEach = 2 * a * b / (t * (t - 1));
		const cond = (a - 1) / (t - 1);
		return {
			marks: 6,
			text: `A bag contains ${a} ${colours[0]} and ${b} ${colours[1]} counters. Two counters are drawn at random without replacement. Give probabilities as decimals, correct to 3 decimal places.${br('i', `Find the probability that both counters are ${colours[0]}.`)}${br('ii', 'Find the probability of drawing one counter of each colour.')}${br('iii', `Given that the first counter is ${colours[0]}, find the probability that the second is also ${colours[0]}.`)}`,
			diagram: { type: 'tree2', stage1: [{ label: colours[0], prob: `${a}/${t}` }, { label: colours[1], prob: `${b}/${t}` }], stage2: [[{ label: colours[0], prob: `${a - 1}/${t - 1}` }, { label: colours[1], prob: `${b}/${t - 1}` }], [{ label: colours[0], prob: `${a}/${t - 1}` }, { label: colours[1], prob: `${b - 1}/${t - 1}` }]] },
			answer: multi([dp(both, 3), dp(oneEach, 3), dp(cond, 3)], [`P(both ${colours[0]})`, 'P(one of each)', 'P(2nd | 1st)'], 0.0006),
			solution: `<p>(i) P = ${F.frac(String(a), String(t))} &times; ${F.frac(String(a - 1), String(t - 1))} = ${F.frac(String(a * (a - 1)), String(t * (t - 1)))} = <strong>${dp(both, 3)}</strong>.</p>
<p>(ii) Either order works: 2 &times; ${F.frac(String(a), String(t))} &times; ${F.frac(String(b), String(t - 1))} = ${F.frac(String(2 * a * b), String(t * (t - 1)))} = <strong>${dp(oneEach, 3)}</strong>.</p>
<p>(iii) After removing one ${colours[0]}, ${a - 1} of the remaining ${t - 1} are ${colours[0]}: ${F.frac(String(a - 1), String(t - 1))} = <strong>${dp(cond, 3)}</strong>.</p>`,
		};
	});

	// 2. Repeated independent trials
	boss('boss4-repeated-trials', 'Repeated trials + Complements', function (r) {
		const s = r.int(5, 10);
		const w = r.int(1, Math.min(3, s - 2));
		const n = r.int(3, 4);
		const p = w / s;
		const all = Math.pow(p, n);
		const none = Math.pow(1 - p, n);
		const atLeast = 1 - none;
		const exactly1 = n * p * Math.pow(1 - p, n - 1);
		return {
			marks: 7,
			text: `A spinner has ${s} equal sectors, of which ${w} ${w === 1 ? 'is' : 'are'} winning sectors. The spinner is spun ${n} times. Give probabilities as decimals, correct to 3 decimal places.${br('i', 'Find the probability of winning on every spin.')}${br('ii', 'Find the probability of never winning.')}${br('iii', 'Find the probability of winning at least once.')}${br('iv', 'Find the probability of winning exactly once.')}`,
			answer: multi([dp(all, 3), dp(none, 3), dp(atLeast, 3), dp(exactly1, 3)], ['P(all wins)', 'P(no wins)', 'P(at least one)', 'P(exactly one)'], 0.0006),
			solution: `<p>Each spin wins with probability p = ${F.frac(String(w), String(s))} = ${dp(p, 3)}, independently.</p>
<p>(i) p<sup>${n}</sup> = <strong>${dp(all, 3)}</strong>.</p>
<p>(ii) (1 &minus; p)<sup>${n}</sup> = ${dp(1 - p, 3)}<sup>${n}</sup> = <strong>${dp(none, 3)}</strong>.</p>
<p>(iii) The complement of &ldquo;never&rdquo;: 1 &minus; ${dp(none, 4)} = <strong>${dp(atLeast, 3)}</strong>.</p>
<p>(iv) The win can come on any of the ${n} spins: ${n} &times; p(1 &minus; p)<sup>${n - 1}</sup> = <strong>${dp(exactly1, 3)}</strong>.</p>`,
		};
	});

	// 3. Two machines, defect rates, Bayes
	boss('boss4-machine-defect', 'Conditional probability + Bayes', function (r) {
		const pA = r.pick([40, 55, 60, 65, 70]);
		let dA, dB;
		do { dA = r.pick([2, 3, 4, 5, 6, 8, 10]); dB = r.pick([2, 3, 4, 5, 6, 8, 10]); } while (dA === dB);
		const pAD = pA / 100 * dA / 100;
		const pD = pAD + (100 - pA) / 100 * dB / 100;
		const bayes = pAD / pD;
		return {
			marks: 6,
			text: `In a factory, machine A makes ${pA}% of the items and machine B makes the rest. ${dA}% of machine A&rsquo;s items are faulty, and ${dB}% of machine B&rsquo;s. One item is picked at random. Give probabilities as decimals, correct to 3 decimal places.${br('i', 'Find the probability that it was made by A and is faulty.')}${br('ii', 'Find the probability that it is faulty.')}${br('iii', 'Given that it is faulty, find the probability it was made by A.')}`,
			diagram: { type: 'tree2', stage1: [{ label: 'A', prob: `${pA}%` }, { label: 'B', prob: `${100 - pA}%` }], stage2: [[{ label: 'faulty', prob: `${dA}%` }, { label: 'not faulty', prob: `${100 - dA}%` }], [{ label: 'faulty', prob: `${dB}%` }, { label: 'not faulty', prob: `${100 - dB}%` }]] },
			answer: multi([dp(pAD, 3), dp(pD, 3), dp(bayes, 3)], ['P(A and faulty)', 'P(faulty)', 'P(A | faulty)'], 0.0006),
			solution: `<p>(i) P(A and faulty) = ${dp(pA / 100, 2)} &times; ${dp(dA / 100, 2)} = <strong>${dp(pAD, 3)}</strong>.</p>
<p>(ii) Adding the B branch: ${dp(pAD, 4)} + ${dp(1 - pA / 100, 2)} &times; ${dp(dB / 100, 2)} = ${dp(pAD, 4)} + ${dp((100 - pA) / 100 * dB / 100, 4)} = <strong>${dp(pD, 3)}</strong>.</p>
<p>(iii) Bayes: P(A | faulty) = ${F.frac('P(A and faulty)', 'P(faulty)')} = ${F.frac(String(dp(pAD, 4)), String(dp(pD, 4)))} = <strong>${dp(bayes, 3)}</strong>.</p>`,
		};
	});

	// 4. Expected value of a dice game with a fee
	boss('boss4-game-fee', 'Expected value + Fair games', function (r) {
		const w = r.int(6, 12);
		const v = r.int(2, w - 2);
		const f = r.int(2, 4);
		const N = 6 * r.int(5, 20);
		const E = (w + 2 * v) / 6;
		const profit = E - f;
		const total = N * profit;
		return {
			marks: 6,
			text: `A game costs &pound;${f} to play. You roll one fair die: a six wins &pound;${w}, a four or a five wins &pound;${v}, and anything else wins nothing. Give money answers correct to 2 decimal places where necessary (use negatives for losses).${br('i', 'Find the expected winnings from one roll, before the fee.')}${br('ii', 'Find the expected profit per game, after the fee.')}${br('iii', `Find the expected total profit over ${N} games.`)}`,
			answer: multi([dp(E, 2), dp(profit, 2), dp(total, 2)], ['expected winnings (&pound;)', 'profit per game (&pound;)', `total over ${N} games (&pound;)`], 0.006),
			solution: `<p>(i) E = ${F.frac('1', '6')} &times; ${w} + ${F.frac('2', '6')} &times; ${v} + ${F.frac('3', '6')} &times; 0 = ${F.frac(String(w + 2 * v), '6')} = <strong>&pound;${dp(E, 2)}</strong>.</p>
<p>(ii) Subtract the fee: ${dp(E, 4)} &minus; ${f} = <strong>&pound;${dp(profit, 2)}</strong> per game.</p>
<p>(iii) Expectation adds over independent games: ${N} &times; ${dp(profit, 4)} = <strong>&pound;${dp(total, 2)}</strong>.</p>`,
		};
	});

	// 5. Three-set Venn reconstruction
	boss('boss4-venn-three', 'Three-set Venn + Inclusion-exclusion', function (r) {
		const [sA, sB, sC] = r.pick([['football', 'basketball', 'tennis'], ['French', 'German', 'Spanish'], ['guitar', 'piano', 'drums']]);
		const oa = r.int(2, 9), ob = r.int(2, 9), oc = r.int(2, 9);
		const x = r.int(2, 8), y = r.int(2, 8), z = r.int(2, 8), g = r.int(2, 6);
		const none = r.int(3, 10);
		const total = oa + ob + oc + x + y + z + g + none;
		const A = oa + x + y + g, B = ob + x + z + g, C = oc + y + z + g;
		const exactlyTwo = x + y + z;
		const atLeastOne = (total - none) / total;
		return {
			marks: 6,
			text: `In a survey of ${total} students: ${A} do ${sA}, ${B} do ${sB} and ${C} do ${sC}. Also, ${x + g} do both ${sA} and ${sB}, ${y + g} do both ${sA} and ${sC}, ${z + g} do both ${sB} and ${sC}, and ${g} do all three.${br('i', 'How many students do none of the three?')}${br('ii', 'How many do exactly two of the three?')}${br('iii', 'Find the probability that a randomly chosen student does at least one, as a decimal correct to 3 decimal places.')}`,
			diagram: { type: 'venn3', labelA: sA, labelB: sB, labelC: sC },
			answer: multi([none, exactlyTwo, dp(atLeastOne, 3)], ['none', 'exactly two', 'P(at least one)'], 0.0006),
			solution: `<p>(i) Inclusion-exclusion: |at least one| = ${A} + ${B} + ${C} &minus; ${x + g} &minus; ${y + g} &minus; ${z + g} + ${g} = ${total - none}.</p>
<p>So none = ${total} &minus; ${total - none} = <strong>${none}</strong>.</p>
<p>(ii) &ldquo;Exactly two&rdquo; counts each pairwise overlap without the triple: (${x + g} &minus; ${g}) + (${y + g} &minus; ${g}) + (${z + g} &minus; ${g}) = <strong>${exactlyTwo}</strong>.</p>
<p>(iii) ${F.frac(String(total - none), String(total))} = <strong>${dp(atLeastOne, 3)}</strong>.</p>`,
		};
	});

	// 6. Combining group means
	boss('boss4-combined-mean', 'Weighted means + Reconstruction', function (r) {
		let g, b, mg, mb, tot, M, snew;
		do {
			g = r.int(8, 15); b = r.int(8, 15);
			mg = r.int(55, 75); mb = r.int(55, 75);
			tot = g * mg + b * mb;
			M = r.int(Math.min(mg, mb), Math.max(mg, mb));
			snew = M * (g + b + 1) - tot;
		} while (mg === mb || snew < 0 || snew > 100 || snew === M || snew === mg || snew === mb);
		const comb = tot / (g + b);
		return {
			marks: 6,
			text: `In a class test, the ${g} girls scored a mean of ${mg} and the ${b} boys a mean of ${mb}.${br('i', 'Find the total of all the scores.')}${br('ii', 'Find the mean for the whole class, correct to 2 decimal places.')}${br('iii', `A new student then sits the test and the class mean becomes exactly ${M}. What did the new student score?`)}`,
			answer: multi([tot, dp(comb, 2), snew], ['total', 'class mean', 'new score'], 0.006),
			solution: `<p>(i) Total = ${g} &times; ${mg} + ${b} &times; ${mb} = ${g * mg} + ${b * mb} = <strong>${tot}</strong>.</p>
<p>(ii) Mean = ${F.frac(String(tot), String(g + b))} = <strong>${dp(comb, 2)}</strong>.</p>
<p>(iii) With ${g + b + 1} students the total must be ${M} &times; ${g + b + 1} = ${M * (g + b + 1)}, so the new score is ${M * (g + b + 1)} &minus; ${tot} = <strong>${snew}</strong>.</p>`,
		};
	});

	// 7. Comparing scores with z-values
	boss('boss4-zscore-compare', 'z-scores + Standardising', function (r) {
		const ZS = [-1.5, -1, -0.5, 0.5, 1, 1.5, 2];
		let m1, s1, m2, s2, z1, z2, x1, x2, eq;
		do {
			m1 = r.int(60, 70); s1 = r.pick([4, 6, 8, 10]);
			m2 = r.int(45, 75); s2 = r.pick([6, 10, 12, 14]);
			z1 = r.pick(ZS); z2 = r.pick(ZS);
			x1 = m1 + z1 * s1; x2 = m2 + z2 * s2;
			eq = m2 + z1 * s2;
		} while (m1 === m2 || z1 === z2 || eq === x2 || eq === x1 || x1 === x2);
		return {
			marks: 6,
			text: `Two exams have different scales. Exam 1 has mean ${m1} and standard deviation ${s1}; exam 2 has mean ${m2} and standard deviation ${s2}. Priya scores ${x1} on exam 1 and ${x2} on exam 2. Give z-scores correct to 2 decimal places where necessary.${br('i', 'Find her z-score on exam 1.')}${br('ii', 'Find her z-score on exam 2.')}${br('iii', 'What score on exam 2 would represent the same relative performance as her exam 1 score?')}`,
			answer: multi([z1, z2, eq], ['z on exam 1', 'z on exam 2', 'equivalent score'], 0.006),
			solution: `<p>(i) z = ${F.frac(`${x1} &minus; ${m1}`, String(s1))} = <strong>${z1}</strong>.</p>
<p>(ii) z = ${F.frac(`${x2} &minus; ${m2}`, String(s2))} = <strong>${z2}</strong>.</p>
<p>(iii) The same z-score of ${z1} on exam 2&rsquo;s scale: ${m2} + ${z1} &times; ${s2} = <strong>${eq}</strong>.</p>`,
		};
	});

	// 8. Completing a parallelogram
	boss('boss4-parallelogram', 'Parallelograms + Vectors', function (r) {
		let A, B, C, cross;
		do {
			A = [r.int(-6, 8), r.int(-6, 8)];
			B = [r.int(-6, 8), r.int(-6, 8)];
			C = [r.int(-6, 8), r.int(-6, 8)];
			cross = (B[0] - A[0]) * (C[1] - B[1]) - (C[0] - B[0]) * (B[1] - A[1]);
		} while (cross === 0);
		const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
		const area = Math.abs(cross);
		const AC = Math.sqrt((C[0] - A[0]) ** 2 + (C[1] - A[1]) ** 2);
		return {
			marks: 7,
			text: `ABCD is a parallelogram (vertices in that order) with A(${A[0]}, ${A[1]}), B(${B[0]}, ${B[1]}) and C(${C[0]}, ${C[1]}).${br('i', 'Find the x-coordinate of D.')}${br('ii', 'Find the y-coordinate of D.')}${br('iii', 'Find the area of the parallelogram.')}${br('iv', 'Find the length of the diagonal AC, correct to 2 decimal places where necessary.')}`,
			diagram: { type: 'graph', xmin: -16, xmax: 16, ymin: -16, ymax: 16, grid: true, xstep: 4, ystep: 4, points: [[A[0], A[1], 'A'], [B[0], B[1], 'B'], [C[0], C[1], 'C']] },
			answer: multi([D[0], D[1], area, dp(AC, 2)], ['D x', 'D y', 'area', 'AC'], 0.006),
			solution: `<p>(i)&ndash;(ii) In a parallelogram the diagonals bisect each other, so D = A + C &minus; B = (${A[0]} + ${C[0]} &minus; ${B[0]}, ${A[1]} + ${C[1]} &minus; ${B[1]}) = <strong>(${D[0]}, ${D[1]})</strong>.</p>
<p>(iii) Using the vectors AB = (${B[0] - A[0]}, ${B[1] - A[1]}) and BC = (${C[0] - B[0]}, ${C[1] - B[1]}), the area is |cross product| = |${B[0] - A[0]} &times; ${C[1] - B[1]} &minus; ${C[0] - B[0]} &times; ${B[1] - A[1]}| = <strong>${area}</strong>.</p>
<p>(iv) AC = &radic;((${C[0] - A[0]})&sup2; + (${C[1] - A[1]})&sup2;) = &radic;${(C[0] - A[0]) ** 2 + (C[1] - A[1]) ** 2} = <strong>${dp(AC, 2)}</strong>.</p>`,
		};
	});

	// 9. Perpendicular bisector
	boss('boss4-perp-bisector', 'Perpendicular bisectors + Loci', function (r) {
		let A, B, dx, dy;
		do {
			A = [r.int(-6, 6), r.int(-6, 6)];
			B = [r.int(-6, 6), r.int(-6, 6)];
			dx = B[0] - A[0]; dy = B[1] - A[1];
		} while (dx === 0 || dy === 0 || (A[0] + B[0]) % 2 !== 0 || (A[1] + B[1]) % 2 !== 0);
		const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
		const mb = -dx / dy;
		const c = M[1] - mb * M[0];
		const PA = Math.sqrt(A[0] * A[0] + (A[1] - c) * (A[1] - c));
		return {
			marks: 7,
			text: `Let A = (${A[0]}, ${A[1]}) and B = (${B[0]}, ${B[1]}). Consider the perpendicular bisector of AB. Give answers correct to 2 decimal places where necessary.${br('i', 'Find the x-coordinate of the midpoint of AB.')}${br('ii', 'Find the gradient of the perpendicular bisector.')}${br('iii', 'Find its y-intercept.')}${br('iv', 'Let P be the point where the bisector crosses the y-axis. Find the distance PA.')}`,
			diagram: { type: 'graph', xmin: -8, xmax: 8, ymin: -8, ymax: 8, grid: true, xstep: 2, ystep: 2, points: [[A[0], A[1], 'A'], [B[0], B[1], 'B']] },
			answer: multi([M[0], dp(mb, 2), dp(c, 2), dp(PA, 2)], ['midpoint x', 'gradient', 'y-intercept', 'PA'], 0.006),
			solution: `<p>(i) Midpoint M = (${M[0]}, ${M[1]}).</p>
<p>(ii) Gradient of AB = ${F.frac(String(dy), String(dx))}; the bisector is perpendicular, so its gradient is the negative reciprocal: ${F.frac(String(-dx), String(dy))} = <strong>${dp(mb, 2)}</strong>.</p>
<p>(iii) Through M: c = ${M[1]} &minus; (${dp(mb, 3)}) &times; ${M[0]} = <strong>${dp(c, 2)}</strong>.</p>
<p>(iv) P = (0, ${dp(c, 2)}), so PA = &radic;(${A[0]}&sup2; + (${A[1]} &minus; ${dp(c, 2)})&sup2;) = <strong>${dp(PA, 2)}</strong>. (Any point on the bisector is equidistant from A and B, so PB is the same.)</p>`,
		};
	});

	// 10. Foot of the perpendicular and distance to a line
	boss('boss4-foot-perp', 'Distance to a line + Projections', function (r) {
		let m, c, P;
		do {
			m = r.nonzeroInt(-3, 3);
			c = r.int(-5, 5);
			P = [r.int(-6, 6), r.int(-6, 6)];
		} while (P[1] === m * P[0] + c);
		const perpM = -1 / m;
		const xF = (m * P[1] + P[0] - m * c) / (m * m + 1);
		const dist = Math.abs(m * P[0] - P[1] + c) / Math.sqrt(m * m + 1);
		return {
			marks: 6,
			text: `Consider the line y = ${F.poly([m, c])} and the point P(${P[0]}, ${P[1]}), which is not on the line. Give answers correct to 2 decimal places where necessary.${br('i', 'Find the gradient of the perpendicular from P to the line.')}${br('ii', 'Find the x-coordinate of the foot of the perpendicular.')}${br('iii', 'Find the shortest distance from P to the line.')}`,
			diagram: { type: 'graph', xmin: -8, xmax: 8, ymin: -12, ymax: 12, grid: true, xstep: 2, ystep: 3, fns: [{ fn: (x) => m * x + c }], points: [[P[0], P[1], 'P']] },
			answer: multi([dp(perpM, 2), dp(xF, 2), dp(dist, 2)], ['perpendicular gradient', 'foot x', 'distance'], 0.006),
			solution: `<p>(i) Perpendicular gradients multiply to &minus;1, so the gradient is ${F.frac('&minus;1', String(m))} = <strong>${dp(perpM, 2)}</strong>.</p>
<p>(ii) The perpendicular through P is y = ${dp(perpM, 3)}(x &minus; ${P[0]}) + ${P[1]}. Setting it equal to the line and solving: x = ${F.frac(`${m} &times; ${P[1]} + ${P[0]} &minus; ${m} &times; ${c}`, `${m * m + 1}`)} = <strong>${dp(xF, 2)}</strong>.</p>
<p>(iii) Distance = ${F.frac(`|${m} &times; ${P[0]} &minus; ${P[1]}${F.st(c, '')}|`, `&radic;${m * m + 1}`)} = <strong>${dp(dist, 2)}</strong>.</p>`,
		};
	});

	// 11. Reflection in y = x + c
	boss('boss4-reflect-line', 'Reflections + Mirror lines', function (r) {
		let c, P;
		do {
			c = r.int(-4, 4);
			P = [r.int(-6, 7), r.int(-6, 7)];
		} while (P[1] === P[0] + c);
		const img = [P[1] - c, P[0] + c];
		const distPP = Math.SQRT2 * Math.abs(P[1] - P[0] - c);
		const midY = (P[1] + P[0] + c) / 2;
		return {
			marks: 7,
			text: `The point P(${P[0]}, ${P[1]}) is reflected in the mirror line y = x${F.st(c, '')} to give the image P&prime;. Give answers correct to 2 decimal places where necessary.${br('i', 'Find the x-coordinate of P&prime;.')}${br('ii', 'Find the y-coordinate of P&prime;.')}${br('iii', 'Find the distance PP&prime;.')}${br('iv', 'Find the y-coordinate of the midpoint of PP&prime; (which lies on the mirror line).')}`,
			diagram: { type: 'graph', xmin: -8, xmax: 8, ymin: -10, ymax: 10, grid: true, xstep: 2, ystep: 2, fns: [{ fn: (x) => x + c }], points: [[P[0], P[1], 'P']] },
			answer: multi([img[0], img[1], dp(distPP, 2), midY], ['P&prime; x', 'P&prime; y', 'PP&prime;', 'midpoint y'], 0.006),
			solution: `<p>Reflecting in y = x + c swaps the roles of x and y after allowing for the shift: (x, y) &rarr; (y &minus; ${c === 0 ? '0' : c}, x${F.st(c, '')}).</p>
<p>(i)&ndash;(ii) P&prime; = (${P[1]} ${c >= 0 ? '&minus; ' + c : '+ ' + (-c)}, ${P[0]}${F.st(c, '')}) = <strong>(${img[0]}, ${img[1]})</strong>.</p>
<p>(iii) PP&prime; = &radic;((${img[0] - P[0]})&sup2; + (${img[1] - P[1]})&sup2;) = <strong>${dp(distPP, 2)}</strong>.</p>
<p>(iv) Midpoint y = ${F.frac(`${P[1]} + ${img[1]}`, '2')} = <strong>${midY}</strong>. Check: the midpoint x is ${(P[0] + img[0]) / 2} and indeed ${midY} = ${(P[0] + img[0]) / 2}${F.st(c, '')}.</p>`,
		};
	});

	// 12. Centroid and medians
	boss('boss4-centroid-median', 'Centroids + Medians', function (r) {
		let A, B, C, cross;
		const pickC = (sx, sy) => {
			const xs = [], ys = [];
			for (let v = -6; v <= 8; v++) {
				if (((v + sx) % 3 + 3) % 3 === 0) xs.push(v);
				if (((v + sy) % 3 + 3) % 3 === 0) ys.push(v);
			}
			return [r.pick(xs), r.pick(ys)];
		};
		do {
			A = [r.int(-6, 6), r.int(-6, 6)];
			B = [r.int(-6, 6), r.int(-6, 6)];
			C = pickC(A[0] + B[0], A[1] + B[1]);
			cross = (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]);
		} while (cross === 0);
		const Gx = (A[0] + B[0] + C[0]) / 3, Gy = (A[1] + B[1] + C[1]) / 3;
		const Mbc = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2];
		const med = Math.sqrt((Mbc[0] - A[0]) ** 2 + (Mbc[1] - A[1]) ** 2);
		const area = Math.abs(cross) / 2;
		return {
			marks: 7,
			text: `Triangle ABC has vertices A(${A[0]}, ${A[1]}), B(${B[0]}, ${B[1]}) and C(${C[0]}, ${C[1]}). Give answers correct to 2 decimal places where necessary.${br('i', 'Find the x-coordinate of the centroid.')}${br('ii', 'Find the y-coordinate of the centroid.')}${br('iii', 'Find the length of the median from A to the midpoint of BC.')}${br('iv', 'Find the area of the triangle.')}`,
			diagram: { type: 'graph', xmin: -8, xmax: 10, ymin: -8, ymax: 10, grid: true, xstep: 2, ystep: 2, points: [[A[0], A[1], 'A'], [B[0], B[1], 'B'], [C[0], C[1], 'C']] },
			answer: multi([Gx, Gy, dp(med, 2), dp(area, 2)], ['centroid x', 'centroid y', 'median length', 'area'], 0.006),
			solution: `<p>(i)&ndash;(ii) The centroid averages the vertices: G = (${F.frac(`${A[0]} + ${B[0]} + ${C[0]}`, '3')}, ${F.frac(`${A[1]} + ${B[1]} + ${C[1]}`, '3')}) = <strong>(${Gx}, ${Gy})</strong>.</p>
<p>(iii) Midpoint of BC = (${Mbc[0]}, ${Mbc[1]}); median = &radic;((${Mbc[0]} &minus; ${A[0]})&sup2; + (${Mbc[1]} &minus; ${A[1]})&sup2;) = <strong>${dp(med, 2)}</strong>.</p>
<p>(iv) Shoelace: area = ${F.frac('1', '2')}|(${B[0] - A[0]})(${C[1] - A[1]}) &minus; (${C[0] - A[0]})(${B[1] - A[1]})| = <strong>${dp(area, 2)}</strong>.</p>`,
		};
	});

	// 13. Two dice, conditional
	boss('boss4-two-dice', 'Dice sums + Conditioning', function (r) {
		const k = r.pick([4, 5, 6, 8, 9, 10]);
		const t = r.int(7, 10);
		let cEq = 0, cGe = 0, cDblGe = 0;
		for (let d1 = 1; d1 <= 6; d1++) for (let d2 = 1; d2 <= 6; d2++) {
			const S = d1 + d2;
			if (S === k) cEq++;
			if (S >= t) { cGe++; if (d1 === d2) cDblGe++; }
		}
		const pEq = cEq / 36, pGe = cGe / 36, pCond = cDblGe / cGe;
		return {
			marks: 6,
			text: `Two fair six-sided dice are rolled and their scores are added. Give probabilities as decimals, correct to 3 decimal places.${br('i', `Find the probability that the total is exactly ${k}.`)}${br('ii', `Find the probability that the total is at least ${t}.`)}${br('iii', `Given that the total is at least ${t}, find the probability that the two dice show the same number.`)}`,
			answer: multi([dp(pEq, 3), dp(pGe, 3), dp(pCond, 3)], [`P(total = ${k})`, `P(total &ge; ${t})`, 'P(double | total)'], 0.0006),
			solution: `<p>There are 36 equally likely outcomes.</p>
<p>(i) ${cEq} outcomes give a total of ${k}: ${F.frac(String(cEq), '36')} = <strong>${dp(pEq, 3)}</strong>.</p>
<p>(ii) ${cGe} outcomes give a total of at least ${t}: ${F.frac(String(cGe), '36')} = <strong>${dp(pGe, 3)}</strong>.</p>
<p>(iii) Of those ${cGe} outcomes, ${cDblGe} are doubles: ${F.frac(String(cDblGe), String(cGe))} = <strong>${dp(pCond, 3)}</strong>.</p>`,
		};
	});

	// 14. Grouped frequency table
	boss('boss4-grouped-mean', 'Grouped data + Estimated mean', function (r) {
		let fr, modal, pctTop, mean, total;
		do {
			fr = [r.int(3, 12), r.int(3, 12), r.int(3, 12), r.int(3, 12)];
			const mx = Math.max(...fr);
			modal = fr.indexOf(mx);
			total = fr[0] + fr[1] + fr[2] + fr[3];
			mean = (5 * fr[0] + 15 * fr[1] + 25 * fr[2] + 35 * fr[3]) / total;
			pctTop = 100 * (fr[2] + fr[3]) / total;
		} while (fr.filter((f) => f === Math.max(...fr)).length !== 1 || fr.includes(dp(pctTop, 1)));
		const mids = [5, 15, 25, 35];
		return {
			marks: 6,
			text: `The masses of ${total} parcels (in kg) are grouped as: 0&ndash;10 kg: ${fr[0]} parcels; 10&ndash;20 kg: ${fr[1]}; 20&ndash;30 kg: ${fr[2]}; 30&ndash;40 kg: ${fr[3]}.${br('i', 'Using midpoints, estimate the mean mass, correct to 2 decimal places.')}${br('ii', 'Write down the midpoint of the modal class.')}${br('iii', 'What percentage of the parcels weigh 20 kg or more? Give 1 decimal place where necessary.')}`,
			answer: multi([dp(mean, 2), mids[modal], dp(pctTop, 1)], ['estimated mean (kg)', 'modal midpoint (kg)', 'percentage (%)'], 0.006),
			solution: `<p>(i) Using midpoints 5, 15, 25, 35: mean &asymp; ${F.frac(`5 &times; ${fr[0]} + 15 &times; ${fr[1]} + 25 &times; ${fr[2]} + 35 &times; ${fr[3]}`, String(total))} = ${F.frac(String(5 * fr[0] + 15 * fr[1] + 25 * fr[2] + 35 * fr[3]), String(total))} = <strong>${dp(mean, 2)} kg</strong>.</p>
<p>(ii) The modal class has the highest frequency (${fr[modal]}), so its midpoint is <strong>${mids[modal]} kg</strong>.</p>
<p>(iii) ${F.frac(`${fr[2]} + ${fr[3]}`, String(total))} &times; 100 = <strong>${dp(pctTop, 1)}%</strong>.</p>`,
		};
	});

	// 15. Two-stage journey and target speed
	boss('boss4-unit-speeds', 'Average speed + Unit conversion', function (r) {
		let t1, t2, v1, v2, d1, d2, T, totalT;
		do {
			t1 = 6 * r.int(2, 8); t2 = 6 * r.int(2, 8);
			v1 = 10 * r.int(3, 8); v2 = 10 * r.int(3, 8);
			d1 = v1 * t1 / 60; d2 = v2 * t2 / 60;
			totalT = t1 + t2;
			T = totalT + r.pick([-1, 1]) * 6 * r.int(1, 4);
		} while (v1 === v2 || d1 !== Math.round(d1) || d2 !== Math.round(d2) || T <= 0 || T === totalT || d1 === totalT || d2 === totalT);
		const avg = (d1 + d2) / (totalT / 60);
		const needed = (d1 + d2) / (T / 60);
		return {
			marks: 6,
			text: `A driver covers ${d1} km at ${v1} km/h, then ${d2} km at ${v2} km/h. Give speeds correct to 1 decimal place where necessary.${br('i', 'Find the total journey time, in minutes.')}${br('ii', 'Find the average speed for the whole journey.')}${br('iii', `What constant speed would cover the same total distance in ${T} minutes?`)}`,
			answer: multi([totalT, dp(avg, 1), dp(needed, 1)], ['total time (min)', 'average speed (km/h)', 'required speed (km/h)'], 0.06),
			solution: `<p>(i) Leg 1: ${F.frac(String(d1), String(v1))} h = ${t1} min. Leg 2: ${F.frac(String(d2), String(v2))} h = ${t2} min. Total = <strong>${totalT} min</strong>.</p>
<p>(ii) Average speed = total distance &divide; total time = ${F.frac(String(d1 + d2), `${totalT}/60`)} = <strong>${dp(avg, 1)} km/h</strong>. (Not the mean of the two speeds!)</p>
<p>(iii) ${F.frac(String(d1 + d2), `${T}/60`)} = <strong>${dp(needed, 1)} km/h</strong>.</p>`,
		};
	});

	// 16. Quartiles from a raw list
	boss('boss4-list-iqr', 'Quartiles + Spread', function (r) {
		let vals, iqr, range, mean;
		do {
			vals = [];
			for (let i = 0; i < 11; i++) vals.push(r.int(12, 58));
			vals.sort((x, y) => x - y);
			iqr = vals[8] - vals[2];
			range = vals[10] - vals[0];
			mean = vals.reduce((s, v) => s + v, 0) / 11;
		} while (vals.includes(iqr) || vals.includes(range) || vals[0] === vals[10] || (Number.isInteger(mean) && vals.includes(mean)));
		return {
			marks: 6,
			text: `Here are 11 measurements, already in order: ${vals.join(', ')}. Take the lower quartile as the 3rd value and the upper quartile as the 9th value.${br('i', 'Find the interquartile range.')}${br('ii', 'Find the range.')}${br('iii', 'Find the mean, correct to 2 decimal places.')}`,
			answer: multi([iqr, range, dp(mean, 2)], ['IQR', 'range', 'mean'], 0.006),
			solution: `<p>(i) Q1 = ${vals[2]} (3rd value) and Q3 = ${vals[8]} (9th value), so IQR = ${vals[8]} &minus; ${vals[2]} = <strong>${iqr}</strong>.</p>
<p>(ii) Range = ${vals[10]} &minus; ${vals[0]} = <strong>${range}</strong>.</p>
<p>(iii) The values total ${vals.reduce((s, v) => s + v, 0)}, so the mean is ${F.frac(String(vals.reduce((s, v) => s + v, 0)), '11')} = <strong>${dp(mean, 2)}</strong>.</p>`,
		};
	});

})();
