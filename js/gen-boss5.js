// Boss batch 5: mixed advanced multi-part chains.
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
	const DEG = 180 / Math.PI;

	// 1. Vectors: magnitude, dot product, parallelism
	boss('boss5-vectors-parallel', 'Vectors + Parallelism', function (r) {
		let b1, b2, k0, t, a1, a2, mag;
		do {
			b1 = r.nonzeroInt(-4, 4); b2 = r.nonzeroInt(-4, 4);
			k0 = r.nonzeroInt(-4, 4); t = r.nonzeroInt(-3, 5);
			a1 = t - k0 * b1; a2 = 2 * t - k0 * b2;
			mag = Math.hypot(a1 + b1, a2 + b2);
		} while (2 * b1 === b2 || (a1 === 0 && a2 === 0) || mag < 0.5);
		const dot = a1 * b1 + a2 * b2;
		return {
			marks: 6,
			text: `Let <strong>a</strong> = (${a1}, ${a2}) and <strong>b</strong> = (${b1}, ${b2}). Give answers correct to 2 decimal places where necessary.${br('i', 'Find |<strong>a</strong> + <strong>b</strong>|.')}${br('ii', 'Find the dot product <strong>a</strong> &middot; <strong>b</strong>.')}${br('iii', 'Find the value of k for which <strong>a</strong> + k<strong>b</strong> is parallel to (1, 2).')}`,
			answer: multi([dp(mag, 2), dot, k0], ['|a + b|', 'a &middot; b', 'k'], 0.006),
			solution: `<p>(i) <strong>a</strong> + <strong>b</strong> = (${a1 + b1}, ${a2 + b2}), so |<strong>a</strong> + <strong>b</strong>| = &radic;(${(a1 + b1) ** 2} + ${(a2 + b2) ** 2}) = <strong>${dp(mag, 2)}</strong>.</p>
<p>(ii) ${a1} &times; ${b1} + ${a2} &times; ${b2} = <strong>${dot}</strong>.</p>
<p>(iii) <strong>a</strong> + k<strong>b</strong> = (${a1}${F.st(b1, 'k')}, ${a2}${F.st(b2, 'k')}). Parallel to (1, 2) means the second component is twice the first:</p>
<p>${a2}${F.st(b2, 'k')} = 2(${a1}${F.st(b1, 'k')}), so k(${b2 - 2 * b1}) = ${2 * a1 - a2}, giving k = <strong>${k0}</strong>. (Then <strong>a</strong> + k<strong>b</strong> = (${t}, ${2 * t}).)</p>`,
		};
	});

	// 2. Sine rule: the ambiguous case
	boss('boss5-sine-ambiguous', 'Sine rule: ambiguous case', function (r) {
		let A, b, a;
		do {
			A = r.int(30, 40);
			b = r.int(8, 14);
			a = r.int(2, 13);
		} while (!(a > b * Math.sin(rad(A)) + 0.15 && a <= b - 1));
		const B1 = Math.asin(b * Math.sin(rad(A)) / a) * DEG;
		const B2 = 180 - B1;
		const C1 = 180 - A - B1;
		const c1 = a * Math.sin(rad(C1)) / Math.sin(rad(A));
		return {
			marks: 6,
			text: `In triangle ABC, angle A = ${deg(A)}, the side a (opposite A) is ${a} cm and the side b is ${b} cm. Since a &lt; b, there are <em>two</em> possible triangles. Give answers correct to 1 decimal place.${br('i', 'Find the acute possibility for angle B.')}${br('ii', 'Find the obtuse possibility for angle B.')}${br('iii', 'Find the largest possible value of angle C.')}`,
			diagram: { type: 'triangle', a, b, c: c1, labels: ['A', 'B', 'C'], sideLabels: [`${a} cm`, `${b} cm`, ''], angleLabels: [`${A}°`, '', ''] },
			answer: multi([dp(B1, 1), dp(B2, 1), dp(C1, 1)], ['acute B (degrees)', 'obtuse B (degrees)', 'largest C (degrees)'], 0.06),
			solution: `<p>(i) Sine rule: sin B = ${F.frac(`${b} sin ${A}&deg;`, String(a))} = ${dp(b * Math.sin(rad(A)) / a, 4)}, so the acute solution is B = <strong>${dp(B1, 1)}&deg;</strong>.</p>
<p>(ii) Sine is also positive in the second quadrant: B = 180&deg; &minus; ${dp(B1, 1)}&deg; = <strong>${dp(B2, 1)}&deg;</strong>. (Both are valid because a &lt; b but a &gt; b sin A.)</p>
<p>(iii) C = 180&deg; &minus; A &minus; B. The smaller B gives the larger C: 180 &minus; ${A} &minus; ${dp(B1, 1)} = <strong>${dp(C1, 1)}&deg;</strong>.</p>`,
		};
	});

	// 3. Counting integer solutions of a quadratic inequality
	boss('boss5-quadratic-inequality-count', 'Inequalities + Integer counting', function (r) {
		const u = r.int(-8, 0), v = u + r.int(3, 9);
		const b = -(u + v), c = u * v;
		const count = v - u - 1;
		return {
			marks: 6,
			text: `Consider the inequality ${F.poly([1, b, c])} &lt; 0.${br('i', 'Find the smaller root of the corresponding equation.')}${br('ii', 'Find the larger root.')}${br('iii', 'How many integers satisfy the inequality?')}`,
			answer: multi([u, v, count], ['smaller root', 'larger root', 'number of integers']),
			solution: `<p>(i)&ndash;(ii) ${F.poly([1, b, c])} = (x${F.st(-u, '')})(x${F.st(-v, '')}), so the roots are <strong>${u}</strong> and <strong>${v}</strong>.</p>
<p>(iii) A positive quadratic is negative strictly between its roots: ${u} &lt; x &lt; ${v}.</p>
<p>The integers are ${u + 1}, &hellip;, ${v - 1}: that is ${v - 1} &minus; ${u + 1} + 1 = <strong>${count}</strong> integers.</p>`,
		};
	});

	// 4. Three unknowns from three purchases
	boss('boss5-three-unknowns', 'Simultaneous equations: three unknowns', function (r) {
		const items = r.pick([['apple', 'banana', 'cherry tart'], ['pen', 'notebook', 'folder'], ['coffee', 'muffin', 'juice']]);
		let x, y, z;
		do { x = r.int(2, 9); y = r.int(2, 9); z = r.int(2, 9); } while (x === y || y === z || x === z);
		const t1 = 2 * x + y, t2 = y + 3 * z, t3 = x + z;
		return {
			marks: 6,
			text: `At a shop: two ${items[0]}s and one ${items[1]} cost &pound;${t1}; one ${items[1]} and three ${items[2]}s cost &pound;${t2}; one ${items[0]} and one ${items[2]} cost &pound;${t3}.${br('i', `Find the price of one ${items[0]}.`)}${br('ii', `Find the price of one ${items[1]}.`)}${br('iii', `Find the price of one ${items[2]}.`)}`,
			answer: multi([x, y, z], [`${items[0]} (&pound;)`, `${items[1]} (&pound;)`, `${items[2]} (&pound;)`]),
			solution: `<p>Let the prices be x, y, z. Then 2x + y = ${t1}, y + 3z = ${t2}, x + z = ${t3}.</p>
<p>From the third equation x = ${t3} &minus; z. Substituting into the first: 2(${t3} &minus; z) + y = ${t1}, so y = ${t1 - 2 * t3} + 2z.</p>
<p>Substituting into the second: ${t1 - 2 * t3} + 2z + 3z = ${t2}, so 5z = ${t2 - t1 + 2 * t3} and z = <strong>${z}</strong>.</p>
<p>Then x = ${t3} &minus; ${z} = <strong>${x}</strong> and y = ${t1} &minus; ${2 * x} = <strong>${y}</strong>.</p>`,
		};
	});

	// 5. Chained ratios
	boss('boss5-ratio-shares', 'Chained ratios + Sharing', function (r) {
		const p = r.int(1, 4), q = r.int(p + 1, 6), s = r.int(1, 4), t = r.int(s + 1, 6);
		const A = p * s, B = q * s, C = q * t;
		const k = r.int(2, 9);
		const M = k * (A + B + C);
		return {
			marks: 6,
			text: `Three friends share &pound;${M}. Amir&rsquo;s share to Bella&rsquo;s share is in the ratio ${p} : ${q}, and Bella&rsquo;s share to Carlos&rsquo;s share is in the ratio ${s} : ${t}.${br('i', 'Find Amir&rsquo;s share.')}${br('ii', 'Find Bella&rsquo;s share.')}${br('iii', 'Find Carlos&rsquo;s share.')}`,
			answer: multi([k * A, k * B, k * C], ['Amir (&pound;)', 'Bella (&pound;)', 'Carlos (&pound;)']),
			solution: `<p>Scale the two ratios so Bella&rsquo;s parts agree: ${p} : ${q} = ${A} : ${B} and ${s} : ${t} = ${B} : ${C} (multiplying by ${s} and ${q} respectively).</p>
<p>So Amir : Bella : Carlos = ${A} : ${B} : ${C}, a total of ${A + B + C} parts.</p>
<p>Each part is worth ${F.frac(String(M), String(A + B + C))} = &pound;${k}.</p>
<p>Shares: <strong>&pound;${k * A}</strong>, <strong>&pound;${k * B}</strong>, <strong>&pound;${k * C}</strong>.</p>`,
		};
	});

	// 6. Recurring decimals as fractions
	boss('boss5-recurring-decimal', 'Recurring decimals + Fractions', function (r) {
		let d1, d2;
		do { d1 = r.int(1, 9); d2 = r.int(0, 9); } while (d1 === d2);
		const n = 10 * d1 + d2;
		const g = MG.gcd(n, 99);
		const numr = n / g, den = 99 / g;
		const N = r.pick([51, 76, 99, 100, 123, 150, 201, 250]);
		const digitN = N % 2 === 1 ? d1 : d2;
		return {
			marks: 6,
			text: `Let x = 0.${d1}${d2}${d1}${d2}${d1}${d2}&hellip; (the digits ${d1}${d2} repeat forever).${br('i', 'Write x as a fraction in lowest terms, and give its numerator.')}${br('ii', 'Give its denominator.')}${br('iii', `What is the ${N}th digit after the decimal point?`)}`,
			answer: multi([numr, den, digitN], ['numerator', 'denominator', `${N}th digit`]),
			solution: `<p>(i)&ndash;(ii) Let x = 0.&#773;${d1}&#773;${d2}&hellip;. Then 100x = ${n}.${d1}${d2}&hellip;, so 100x &minus; x = ${n} and x = ${F.frac(String(n), '99')}.</p>
<p>Dividing top and bottom by ${g}: x = ${F.frac(String(numr), String(den))}, so the numerator is <strong>${numr}</strong> and the denominator <strong>${den}</strong>.</p>
<p>(iii) Odd positions show ${d1} and even positions show ${d2}. Position ${N} is ${N % 2 === 1 ? 'odd' : 'even'}, so the digit is <strong>${digitN}</strong>.</p>`,
		};
	});

	// 7. Standard form arithmetic
	boss('boss5-standard-form', 'Standard form + Index laws', function (r) {
		const COEF = [1.2, 1.5, 2, 2.4, 2.5, 3, 3.2, 4, 4.8, 5, 6, 8];
		let a, b, m, n;
		do {
			a = r.pick(COEF); b = r.pick(COEF);
			m = r.int(3, 8); n = r.int(2, 6);
		} while (a === b || m === n);
		let prodC = dp(a * b, 4), prodE = m + n;
		while (prodC >= 10) { prodC = dp(prodC / 10, 4); prodE++; }
		let quotC = dp(a / b, 4), quotE = m - n;
		while (quotC < 1) { quotC = dp(quotC * 10, 4); quotE--; }
		while (quotC >= 10) { quotC = dp(quotC / 10, 4); quotE++; }
		return {
			marks: 6,
			text: `Let A = ${a} &times; 10<sup>${m}</sup> and B = ${b} &times; 10<sup>${n}</sup>. Write both answers in standard form c &times; 10<sup>e</sup> with 1 &le; c &lt; 10, giving c correct to 2 decimal places where necessary.${br('i', 'For A &times; B, find the coefficient c.')}${br('ii', 'For A &times; B, find the exponent e.')}${br('iii', 'For A &divide; B, find the exponent e.')}`,
			answer: multi([dp(prodC, 2), prodE, quotE], ['product coefficient', 'product exponent', 'quotient exponent'], 0.006),
			solution: `<p>(i)&ndash;(ii) A &times; B = (${a} &times; ${b}) &times; 10<sup>${m}+${n}</sup> = ${dp(a * b, 4)} &times; 10<sup>${m + n}</sup>.</p>
<p>${a * b >= 10 ? `Since ${dp(a * b, 4)} &ge; 10, shift: ${dp(prodC, 4)} &times; 10<sup>${prodE}</sup>.` : 'This is already in standard form.'} So c = <strong>${dp(prodC, 2)}</strong> and e = <strong>${prodE}</strong>.</p>
<p>(iii) A &divide; B = ${F.frac(String(a), String(b))} &times; 10<sup>${m}&minus;${n}</sup> = ${dp(a / b, 4)} &times; 10<sup>${m - n}</sup>${a / b < 1 ? `; since the coefficient is below 1, shift to ${dp(quotC, 4)} &times; 10<sup>${quotE}</sup>` : ''}.</p>
<p>The exponent is <strong>${quotE}</strong>.</p>`,
		};
	});

	// 8. Alloy density
	boss('boss5-alloy-density', 'Density + Mixtures', function (r) {
		let d1, d2, v1, v2, m1, m2, dens;
		do {
			d1 = r.pick([2, 4, 5, 8]); d2 = r.pick([3, 6, 9, 10]);
			v1 = r.int(3, 12); v2 = r.int(3, 12);
			m1 = d1 * v1; m2 = d2 * v2;
			dens = (m1 + m2) / (v1 + v2);
		} while (v1 === m1 || v2 === m2 || v1 + v2 === m1 || v1 + v2 === m2);
		return {
			marks: 6,
			text: `An alloy is made by melting together ${m1} g of metal P (density ${d1} g/cm&sup3;) and ${m2} g of metal Q (density ${d2} g/cm&sup3;). Assume no volume is lost. Give the final answer correct to 2 decimal places where necessary.${br('i', 'Find the volume of metal P used.')}${br('ii', 'Find the total volume of the alloy.')}${br('iii', 'Find the density of the alloy.')}`,
			answer: multi([v1, v1 + v2, dp(dens, 2)], ['volume P (cm&sup3;)', 'total volume (cm&sup3;)', 'density (g/cm&sup3;)'], 0.006),
			solution: `<p>(i) Volume = mass &divide; density = ${F.frac(String(m1), String(d1))} = <strong>${v1} cm&sup3;</strong>.</p>
<p>(ii) Metal Q: ${F.frac(String(m2), String(d2))} = ${v2} cm&sup3;. Total = ${v1} + ${v2} = <strong>${v1 + v2} cm&sup3;</strong>.</p>
<p>(iii) Density = total mass &divide; total volume = ${F.frac(String(m1 + m2), String(v1 + v2))} = <strong>${dp(dens, 2)} g/cm&sup3;</strong>. (Between ${Math.min(d1, d2)} and ${Math.max(d1, d2)}, as expected.)</p>`,
		};
	});

	// 9. Exactly k successes in three attempts
	boss('boss5-exactly-two', 'Repeated trials: exactly k', function (r) {
		const k = r.int(8, 18);
		const p = k / 20;
		const ctx = r.pick([
			['A basketball player scores each free throw', 'She takes three throws', 'scores'],
			['A darts player hits the treble twenty', 'He makes three attempts', 'hits'],
			['An archer hits the gold ring', 'She fires three arrows', 'hits'],
			['A goalkeeper saves each penalty', 'Three penalties are taken', 'saves'],
		]);
		const all3 = p * p * p;
		const exactly2 = 3 * p * p * (1 - p);
		const atMost1 = 1 - all3 - exactly2;
		return {
			marks: 6,
			text: `${ctx[0]} with probability ${dp(p, 2)}, independently. ${ctx[1]}. Give probabilities as decimals, correct to 3 decimal places.${br('i', `Find the probability of ${ctx[2] === 'saves' ? 'saving' : ctx[2] === 'scores' ? 'scoring' : 'hitting'} all three.`)}${br('ii', 'Find the probability of exactly two successes.')}${br('iii', 'Find the probability of at most one success.')}`,
			answer: multi([dp(all3, 3), dp(exactly2, 3), dp(atMost1, 3)], ['P(all three)', 'P(exactly two)', 'P(at most one)'], 0.0006),
			solution: `<p>(i) ${dp(p, 2)}&sup3; = <strong>${dp(all3, 3)}</strong>.</p>
<p>(ii) The failure can be on any of the 3 attempts: 3 &times; ${dp(p, 2)}&sup2; &times; ${dp(1 - p, 2)} = <strong>${dp(exactly2, 3)}</strong>.</p>
<p>(iii) &ldquo;At most one&rdquo; is the complement of &ldquo;two or three&rdquo;: 1 &minus; ${dp(exactly2, 4)} &minus; ${dp(all3, 4)} = <strong>${dp(atMost1, 3)}</strong>.</p>`,
		};
	});

	// 10. Cumulative frequency and the median class
	boss('boss5-cumfreq-median', 'Cumulative frequency + Median class', function (r) {
		let fr, total, medMid, below;
		const mids = [10, 30, 50, 70];
		do {
			fr = [r.int(5, 15), r.int(5, 15), r.int(5, 15), r.int(5, 15)];
			total = fr[0] + fr[1] + fr[2] + fr[3];
			below = [fr[0], fr[0] + fr[1], fr[0] + fr[1] + fr[2], total];
			const pos = (total + 1) / 2;
			medMid = mids[below.findIndex((cf) => cf >= pos)];
		} while (total % 2 === 0);
		const pctTop = 100 * fr[3] / total;
		return {
			marks: 6,
			text: `The journey times (minutes) of ${total} commuters are grouped as: 0&ndash;20 min: ${fr[0]}; 20&ndash;40 min: ${fr[1]}; 40&ndash;60 min: ${fr[2]}; 60&ndash;80 min: ${fr[3]}.${br('i', 'How many journeys took less than 40 minutes?')}${br('ii', 'Using cumulative frequencies, find the midpoint of the class containing the median.')}${br('iii', 'What percentage of journeys took 60 minutes or more? Give 1 decimal place where necessary.')}`,
			answer: multi([below[1], medMid, dp(pctTop, 1)], ['below 40 min', 'median class midpoint', 'percentage (%)'], 0.06),
			solution: `<p>(i) Cumulative frequencies: ${below[0]}, ${below[1]}, ${below[2]}, ${below[3]}. Below 40 minutes: <strong>${below[1]}</strong>.</p>
<p>(ii) The median is the ${(total + 1) / 2}th value. The first cumulative frequency reaching that position identifies the class; its midpoint is <strong>${medMid} min</strong>.</p>
<p>(iii) ${F.frac(String(fr[3]), String(total))} &times; 100 = <strong>${dp(pctTop, 1)}%</strong>.</p>`,
		};
	});

	// 11. Fitting a linear model
	boss('boss5-linear-model', 'Linear models + Prediction', function (r) {
		let mRate, c, k1, k2, B;
		do {
			mRate = r.pick([2, 2.5, 3, 3.5, 4]);
			c = r.int(2, 6);
			k1 = r.int(3, 8); k2 = k1 + r.int(2, 7);
			B = r.int(25, 60);
		} while ((B - c) % mRate === 0 || B === c + mRate * k1 || B === c + mRate * k2);
		const F1 = c + mRate * k1, F2 = c + mRate * k2;
		const kmax = Math.floor((B - c) / mRate);
		return {
			marks: 6,
			text: `A taxi firm charges a fixed pick-up fee plus a constant rate per kilometre. A ${k1} km ride costs &pound;${F1}, and a ${k2} km ride costs &pound;${F2}. Give money answers correct to 2 decimal places where necessary.${br('i', 'Find the rate per kilometre.')}${br('ii', 'Find the pick-up fee.')}${br('iii', `With a budget of &pound;${B}, what is the greatest whole number of kilometres you can ride?`)}`,
			diagram: { type: 'graph', xmin: 0, xmax: Math.max(k2 + 2, 12), ymin: 0, ymax: Math.ceil(Math.max(F2, B) / 10) * 10, grid: true, points: [[k1, F1, `(${k1}, ${F1})`], [k2, F2, `(${k2}, ${F2})`]] },
			answer: multi([mRate, c, kmax], ['rate (&pound;/km)', 'pick-up fee (&pound;)', 'max whole km'], 0.006),
			solution: `<p>(i) The extra ${k2 - k1} km cost &pound;${F2} &minus; &pound;${F1} = &pound;${dp(F2 - F1, 2)}, so the rate is ${F.frac(String(dp(F2 - F1, 2)), String(k2 - k1))} = <strong>&pound;${mRate}</strong> per km.</p>
<p>(ii) Fee = ${F1} &minus; ${mRate} &times; ${k1} = <strong>&pound;${c}</strong>.</p>
<p>(iii) Need ${c} + ${mRate}k &le; ${B}, so k &le; ${dp((B - c) / mRate, 3)}. The greatest whole number is <strong>${kmax} km</strong>.</p>`,
		};
	});

	// 12. Sector from its perimeter
	boss('boss5-sector-inverse', 'Sectors: inverse problems', function (r) {
		let R, arc;
		do { R = r.int(5, 10); arc = r.int(8, 20); } while (arc === R || arc === 2 * R);
		const P = 2 * R + arc;
		const ang = arc / R * DEG;
		const area = 0.5 * R * arc;
		return {
			marks: 6,
			text: `A sector of a circle has radius ${R} cm and total perimeter ${P} cm (two radii plus the arc). Give answers correct to 1 decimal place where necessary.${br('i', 'Find the arc length.')}${br('ii', 'Find the angle of the sector, in degrees.')}${br('iii', 'Find the area of the sector. <em>Hint: area = &frac12;r &times; arc.</em>')}`,
			answer: multi([arc, dp(ang, 1), dp(area, 1)], ['arc (cm)', 'angle (degrees)', 'area (cm&sup2;)'], 0.06),
			solution: `<p>(i) Arc = perimeter &minus; two radii = ${P} &minus; ${2 * R} = <strong>${arc} cm</strong>.</p>
<p>(ii) Arc = ${F.frac('&theta;', '360')} &times; 2&pi;R, so &theta; = ${F.frac(`360 &times; ${arc}`, `2&pi; &times; ${R}`)} = <strong>${dp(ang, 1)}&deg;</strong>.</p>
<p>(iii) Area = ${F.frac('1', '2')} &times; r &times; arc = ${F.frac('1', '2')} &times; ${R} &times; ${arc} = <strong>${dp(area, 1)} cm&sup2;</strong> (this shortcut follows from area/arc both being proportional to &theta;).</p>`,
		};
	});

	// 13. Doubling time of a growing population
	boss('boss5-doubling-time', 'Growth + Doubling time', function (r) {
		const P0 = 500 * r.int(2, 18);
		const p = r.int(3, 9);
		const n = r.int(4, 8);
		const Pn = P0 * Math.pow(1 + p / 100, n);
		let yDouble = 1;
		while (Math.pow(1 + p / 100, yDouble) < 2) yDouble++;
		const factor10 = Math.pow(1 + p / 100, 10);
		return {
			marks: 6,
			text: `A town&rsquo;s population is ${P0} and grows by ${p}% each year.${br('i', `Find the population after ${n} years, to the nearest whole number.`)}${br('ii', 'After how many whole years will the population first be at least double its current size?')}${br('iii', 'By what overall factor does the population grow over 10 years? Give 2 decimal places.')}`,
			answer: multi([Math.round(Pn), yDouble, dp(factor10, 2)], ['population', 'years to double', '10-year factor'], 0.006),
			solution: `<p>(i) ${P0} &times; ${dp(1 + p / 100, 2)}<sup>${n}</sup> = <strong>${Math.round(Pn)}</strong>.</p>
<p>(ii) We need ${dp(1 + p / 100, 2)}<sup>t</sup> &ge; 2, i.e. t &ge; ${F.frac('log 2', `log ${dp(1 + p / 100, 2)}`)} = ${dp(Math.log(2) / Math.log(1 + p / 100), 2)}. The first whole year is <strong>${yDouble}</strong>.</p>
<p>(iii) ${dp(1 + p / 100, 2)}<sup>10</sup> = <strong>${dp(factor10, 2)}</strong>.</p>`,
		};
	});

	// 14. Square from two opposite vertices
	boss('boss5-square-diagonal', 'Squares + Rotation', function (r) {
		let A, C;
		do {
			A = [r.int(-5, 6), r.int(-5, 6)];
			C = [A[0] + 2 * r.int(-3, 3), A[1] + 2 * r.int(-3, 3)];
		} while (A[0] === C[0] && A[1] === C[1]);
		const M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
		const B = [M[0] - (A[1] - M[1]), M[1] + (A[0] - M[0])];
		const AC2 = (C[0] - A[0]) ** 2 + (C[1] - A[1]) ** 2;
		const area = AC2 / 2;
		const side = Math.sqrt(AC2 / 2);
		return {
			marks: 7,
			text: `A(${A[0]}, ${A[1]}) and C(${C[0]}, ${C[1]}) are <em>opposite</em> vertices of a square ABCD. Give answers correct to 2 decimal places where necessary.${br('i', 'Find the x-coordinate of one of the other two vertices. <em>Hint: rotate A by 90&deg; about the centre of the square.</em>')}${br('ii', 'Find its y-coordinate.')}${br('iii', 'Find the area of the square.')}${br('iv', 'Find its side length.')}`,
			diagram: { type: 'graph', xmin: Math.min(A[0], C[0], -1) - 2, xmax: Math.max(A[0], C[0], 1) + 2, ymin: Math.min(A[1], C[1], -1) - 2, ymax: Math.max(A[1], C[1], 1) + 2, grid: true, xstep: 1, ystep: 1, points: [[A[0], A[1], 'A'], [C[0], C[1], 'C']] },
			answer: multi([B[0], B[1], area, dp(side, 2)], ['vertex x', 'vertex y', 'area', 'side'], 0.006),
			solution: `<p>The centre is the midpoint M = (${M[0]}, ${M[1]}). Rotating A by 90&deg; about M sends the offset (${A[0] - M[0]}, ${A[1] - M[1]}) to (${-(A[1] - M[1])}, ${A[0] - M[0]}).</p>
<p>(i)&ndash;(ii) One missing vertex is (${M[0]} ${A[1] - M[1] >= 0 ? '&minus; ' + (A[1] - M[1]) : '+ ' + (M[1] - A[1])}, ${M[1]}${F.st(A[0] - M[0], '')}) = <strong>(${B[0]}, ${B[1]})</strong>. (The other is its reflection through M.)</p>
<p>(iii) The diagonal squared is AC&sup2; = ${AC2}; a square&rsquo;s area is half the diagonal squared: <strong>${area}</strong>.</p>
<p>(iv) Side = &radic;${area} = <strong>${dp(side, 2)}</strong>.</p>`,
		};
	});

	// 15. Heron's formula and an altitude
	boss('boss5-heron-altitude', 'Heron + Altitudes', function (r) {
		let a, b, c;
		do {
			a = r.int(4, 12); b = r.int(4, 12); c = r.int(4, 12);
		} while ((a + b + c) % 2 !== 0 || a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1 || (a === b && b === c));
		const s = (a + b + c) / 2;
		const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
		const longest = Math.max(a, b, c);
		const alt = 2 * area / longest;
		return {
			marks: 6,
			text: `A triangle has sides ${a} cm, ${b} cm and ${c} cm. Give answers correct to 1 decimal place where necessary.${br('i', 'Find the semi-perimeter s.')}${br('ii', 'Use Heron&rsquo;s formula to find the area.')}${br('iii', 'Find the shortest altitude of the triangle (the one drawn to the longest side).')}`,
			diagram: { type: 'triangle', a, b, c, sideLabels: [`${a} cm`, `${b} cm`, `${c} cm`] },
			answer: multi([s, dp(area, 1), dp(alt, 1)], ['s (cm)', 'area (cm&sup2;)', 'altitude (cm)'], 0.06),
			solution: `<p>(i) s = ${F.frac(`${a} + ${b} + ${c}`, '2')} = <strong>${s} cm</strong>.</p>
<p>(ii) Area = &radic;(s(s&minus;a)(s&minus;b)(s&minus;c)) = &radic;(${s} &times; ${s - a} &times; ${s - b} &times; ${s - c}) = &radic;${s * (s - a) * (s - b) * (s - c)} = <strong>${dp(area, 1)} cm&sup2;</strong>.</p>
<p>(iii) Area = ${F.frac('1', '2')} &times; base &times; height with base ${longest}: height = ${F.frac(`2 &times; ${dp(area, 2)}`, String(longest))} = <strong>${dp(alt, 1)} cm</strong>. (The longest side carries the shortest altitude.)</p>`,
		};
	});

	// 16. Grain silo: cylinder + cone
	boss('boss5-silo', 'Composite solids + Volume', function (r) {
		const rr = r.int(3, 6), hc = r.int(6, 14), hcone = r.int(3, 8);
		const Vc = Math.PI * rr * rr * hc;
		const Vcone = Math.PI * rr * rr * hcone / 3;
		const pct = 100 * Vcone / (Vc + Vcone);
		return {
			marks: 6,
			text: `A grain silo is a cylinder of radius ${rr} m and height ${hc} m, topped by a cone of the same radius and height ${hcone} m. Give answers correct to 1 decimal place.${br('i', 'Find the volume of the cylindrical part.')}${br('ii', 'Find the total volume of the silo.')}${br('iii', 'What percentage of the total volume is in the cone?')}`,
			answer: multi([dp(Vc, 1), dp(Vc + Vcone, 1), dp(pct, 1)], ['cylinder (m&sup3;)', 'total (m&sup3;)', 'cone (%)'], 0.06),
			solution: `<p>(i) V = &pi;r&sup2;h = &pi; &times; ${rr * rr} &times; ${hc} = <strong>${dp(Vc, 1)} m&sup3;</strong>.</p>
<p>(ii) Cone: ${F.frac('1', '3')}&pi; &times; ${rr * rr} &times; ${hcone} = ${dp(Vcone, 1)} m&sup3;. Total = <strong>${dp(Vc + Vcone, 1)} m&sup3;</strong>.</p>
<p>(iii) ${F.frac(String(dp(Vcone, 1)), String(dp(Vc + Vcone, 1))) } &times; 100 = <strong>${dp(pct, 1)}%</strong>. (Equivalently ${F.frac(String(hcone), `3 &times; ${hc} + ${hcone}`)} &times; 100 &mdash; the radius cancels.)</p>`,
		};
	});

	// 17. Trains approaching each other
	boss('boss5-trains-meet', 'Relative speed + Meeting', function (r) {
		let D, vA, vB;
		do {
			D = 10 * r.int(6, 24);
			vA = 10 * r.int(4, 9); vB = 10 * r.int(4, 9);
		} while (vA === vB || vA + vB === D);
		const closing = vA + vB;
		const tmin = 60 * D / closing;
		const distA = vA * D / closing;
		return {
			marks: 6,
			text: `Two stations are ${D} km apart. A train leaves the first at ${vA} km/h while, at the same moment, a train leaves the second at ${vB} km/h towards it, on a parallel track. Give answers correct to 1 decimal place where necessary.${br('i', 'At what combined speed do the trains approach each other?')}${br('ii', 'After how many minutes do they pass each other?')}${br('iii', 'How far from the first station do they pass?')}`,
			answer: multi([closing, dp(tmin, 1), dp(distA, 1)], ['closing speed (km/h)', 'time (min)', 'distance (km)'], 0.06),
			solution: `<p>(i) The gap shrinks at ${vA} + ${vB} = <strong>${closing} km/h</strong>.</p>
<p>(ii) Time = ${F.frac(String(D), String(closing))} h = ${dp(D / closing, 4)} h = <strong>${dp(tmin, 1)} min</strong>.</p>
<p>(iii) The first train covers ${vA} &times; ${dp(D / closing, 4)} = <strong>${dp(distA, 1)} km</strong>.</p>`,
		};
	});

	// 18. HCF and LCM from prime powers
	boss('boss5-hcf-lcm', 'HCF/LCM + Prime factors', function (r) {
		let p1, q1, p2, q2, a, b;
		do {
			p1 = r.int(1, 4); q1 = r.int(0, 3);
			p2 = r.int(1, 4); q2 = r.int(0, 3);
			a = 2 ** p1 * 3 ** q1; b = 2 ** p2 * 3 ** q2;
		} while (a === b || a > 400 || b > 400 || (q1 === 0 && q2 === 0));
		const h = 2 ** Math.min(p1, p2) * 3 ** Math.min(q1, q2);
		const l = 2 ** Math.max(p1, p2) * 3 ** Math.max(q1, q2);
		const k = b / h;
		return {
			marks: 6,
			text: `Let a = ${a} and b = ${b}.${br('i', 'Find the highest common factor of a and b. <em>Hint: write both as products of prime powers.</em>')}${br('ii', 'Find their lowest common multiple.')}${br('iii', 'Find the smallest positive integer k such that ak is a multiple of b.')}`,
			answer: multi([h, l, k], ['HCF', 'LCM', 'k']),
			solution: `<p>a = 2<sup>${p1}</sup>${q1 ? ` &times; 3<sup>${q1}</sup>` : ''} and b = 2<sup>${p2}</sup>${q2 ? ` &times; 3<sup>${q2}</sup>` : ''}.</p>
<p>(i) HCF takes the lower power of each prime: 2<sup>${Math.min(p1, p2)}</sup> &times; 3<sup>${Math.min(q1, q2)}</sup> = <strong>${h}</strong>.</p>
<p>(ii) LCM takes the higher power: 2<sup>${Math.max(p1, p2)}</sup> &times; 3<sup>${Math.max(q1, q2)}</sup> = <strong>${l}</strong>. (Check: HCF &times; LCM = ${h} &times; ${l} = ${h * l} = a &times; b.)</p>
<p>(iii) ak must contain every prime factor of b; the smallest such k is ${F.frac('b', 'HCF')} = ${F.frac(String(b), String(h))} = <strong>${k}</strong>. (Then ak = LCM.)</p>`,
		};
	});

	// 19. Regular polygon: angles and diagonals
	boss('boss5-polygon-diagonals', 'Polygon angles + Diagonals', function (r) {
		const n = r.int(7, 24);
		const ext = 360 / n;
		const inter = 180 - ext;
		const diag = n * (n - 3) / 2;
		const opener = r.pick([
			`Consider a regular polygon with ${n} sides.`,
			`A regular ${n}-sided polygon is drawn.`,
			`A regular polygon has ${n} vertices.`,
		]);
		return {
			marks: 6,
			text: `${opener} Give angles correct to 1 decimal place where necessary.${br('i', 'Find the size of each exterior angle.')}${br('ii', 'Find the size of each interior angle.')}${br('iii', 'How many diagonals does the polygon have? <em>Hint: count the pairs of vertices, then remove the sides.</em>')}`,
			diagram: n <= 12 ? { type: 'polygon', n } : undefined,
			answer: multi([dp(ext, 1), dp(inter, 1), diag], ['exterior (degrees)', 'interior (degrees)', 'diagonals'], 0.06),
			solution: `<p>(i) The exterior angles of any polygon sum to 360&deg;: each is ${F.frac('360', String(n))} = <strong>${dp(ext, 1)}&deg;</strong>.</p>
<p>(ii) Interior = 180&deg; &minus; exterior = <strong>${dp(inter, 1)}&deg;</strong>.</p>
<p>(iii) Each of the ${n} vertices connects to ${n - 3} non-adjacent vertices; dividing by 2 to avoid double counting: ${F.frac(`${n} &times; ${n - 3}`, '2')} = <strong>${diag}</strong>.</p>`,
		};
	});

	// 20. Tax brackets
	boss('boss5-tax-brackets', 'Piecewise rates + Tax', function (r) {
		const T1 = 10000;
		const T2 = T1 + 10000 * r.int(1, 3);
		const I = T2 + 1000 * r.int(5, 30);
		const r1 = r.pick([10, 15, 20]);
		const r2 = r1 + r.pick([10, 15, 20]);
		const tax = (T2 - T1) * r1 / 100 + (I - T2) * r2 / 100;
		const eff = 100 * tax / I;
		const home = I - tax;
		return {
			marks: 6,
			text: `In a country, the first &pound;${T1} of income is tax-free, income from &pound;${T1} to &pound;${T2} is taxed at ${r1}%, and income above &pound;${T2} is taxed at ${r2}%. Aisha earns &pound;${I}. Give the effective rate correct to 2 decimal places.${br('i', 'Find the total tax she pays.')}${br('ii', 'Find her effective (average) tax rate, as a percentage of her whole income.')}${br('iii', 'Find her take-home pay.')}`,
			answer: multi([tax, dp(eff, 2), home], ['tax (&pound;)', 'effective rate (%)', 'take-home (&pound;)'], 0.006),
			solution: `<p>(i) Middle band: (${T2} &minus; ${T1}) &times; ${r1}% = &pound;${(T2 - T1) * r1 / 100}. Top band: (${I} &minus; ${T2}) &times; ${r2}% = &pound;${(I - T2) * r2 / 100}.</p>
<p>Total tax = <strong>&pound;${tax}</strong>.</p>
<p>(ii) ${F.frac(String(tax), String(I))} &times; 100 = <strong>${dp(eff, 2)}%</strong> &mdash; well below ${r2}% because the lower bands are taxed lightly.</p>
<p>(iii) ${I} &minus; ${tax} = <strong>&pound;${home}</strong>.</p>`,
		};
	});

	// 21. Circle from its general form
	boss('boss5-circle-general', 'Circle equations: general form', function (r) {
		let h, k2, R;
		do { h = r.int(-5, 6); k2 = r.int(-5, 6); R = r.int(2, 7); } while (h === 0 && k2 === 0);
		const D = -2 * h, E = -2 * k2, Fc = h * h + k2 * k2 - R * R;
		const distO = Math.hypot(h, k2);
		return {
			marks: 7,
			text: `A circle has equation x&sup2; + y&sup2;${F.st(D, 'x')}${F.st(E, 'y')}${F.st(Fc, '')} = 0. Give answers correct to 2 decimal places where necessary.${br('i', 'Find the x-coordinate of the centre.')}${br('ii', 'Find the y-coordinate of the centre.')}${br('iii', 'Find the radius.')}${br('iv', 'Find the distance from the origin to the centre.')}`,
			answer: multi([h, k2, R, dp(distO, 2)], ['centre x', 'centre y', 'radius', 'distance'], 0.006),
			solution: `<p>Complete the square in each variable:</p>
<p>(x${F.st(-h, '')})&sup2; + (y${F.st(-k2, '')})&sup2; = ${h * h} + ${k2 * k2}${F.st(-Fc, '')} = ${R * R}.</p>
<p>(i)&ndash;(ii) The centre is <strong>(${h}, ${k2})</strong>.</p>
<p>(iii) Radius = &radic;${R * R} = <strong>${R}</strong>.</p>
<p>(iv) Distance = &radic;(${h}&sup2; + ${k2}&sup2;) = &radic;${h * h + k2 * k2} = <strong>${dp(distO, 2)}</strong>.</p>`,
		};
	});

	// 22. Annulus
	boss('boss5-annulus', 'Annulus + Equivalent circles', function (r) {
		let R, rr;
		do { R = r.int(6, 14); rr = r.int(3, R - 2); } while (R - rr < 2);
		const areaAnn = Math.PI * (R * R - rr * rr);
		const pct = 100 * (R * R - rr * rr) / (R * R);
		const req = Math.sqrt(R * R - rr * rr);
		return {
			marks: 6,
			text: `An annulus (a ring) is the region between two concentric circles of radii ${R} cm and ${rr} cm. Give answers correct to 2 decimal places where necessary.${br('i', 'Find the area of the annulus.')}${br('ii', 'What percentage of the larger circle&rsquo;s area does the annulus occupy?')}${br('iii', 'Find the radius of the single circle whose area equals the annulus.')}`,
			diagram: { type: 'graph', xmin: -R - 2, xmax: R + 2, ymin: -R - 2, ymax: R + 2, circles: [{ c: [0, 0], r: R }, { c: [0, 0], r: rr }] },
			answer: multi([dp(areaAnn, 2), dp(pct, 2), dp(req, 2)], ['area (cm&sup2;)', 'percentage (%)', 'radius (cm)'], 0.006),
			solution: `<p>(i) Area = &pi;(${R}&sup2; &minus; ${rr}&sup2;) = &pi; &times; ${R * R - rr * rr} = <strong>${dp(areaAnn, 2)} cm&sup2;</strong>.</p>
<p>(ii) ${F.frac(`${R}&sup2; &minus; ${rr}&sup2;`, `${R}&sup2;`)} &times; 100 = ${F.frac(String(R * R - rr * rr), String(R * R))} &times; 100 = <strong>${dp(pct, 2)}%</strong>.</p>
<p>(iii) &pi;x&sup2; = &pi; &times; ${R * R - rr * rr}, so x = &radic;${R * R - rr * rr} = <strong>${dp(req, 2)} cm</strong>.</p>`,
		};
	});

	// 23. Rectangle with a semicircular end
	boss('boss5-compound-shape', 'Compound shapes + Perimeter', function (r) {
		const W = 2 * r.int(2, 6), L = W + r.int(2, 8);
		const semiA = Math.PI * (W / 2) * (W / 2) / 2;
		const area = L * W + semiA;
		const per = 2 * L + W + Math.PI * W / 2;
		const pct = 100 * semiA / area;
		return {
			marks: 6,
			text: `A window is a rectangle ${L} m long and ${W} m wide, with a semicircle (diameter ${W} m) attached to one of the short ends. Give answers correct to 2 decimal places.${br('i', 'Find the total area.')}${br('ii', 'Find the perimeter of the whole shape.')}${br('iii', 'What percentage of the total area is the semicircle?')}`,
			answer: multi([dp(area, 2), dp(per, 2), dp(pct, 2)], ['area (m&sup2;)', 'perimeter (m)', 'semicircle (%)'], 0.006),
			solution: `<p>(i) Rectangle: ${L} &times; ${W} = ${L * W}. Semicircle: ${F.frac('1', '2')}&pi;(${W / 2})&sup2; = ${dp(semiA, 3)}. Total = <strong>${dp(area, 2)} m&sup2;</strong>.</p>
<p>(ii) The straight edges are two lengths and one width (the other width is replaced by the arc): 2 &times; ${L} + ${W} + &pi; &times; ${W / 2} = <strong>${dp(per, 2)} m</strong>.</p>
<p>(iii) ${F.frac(String(dp(semiA, 3)), String(dp(area, 3)))} &times; 100 = <strong>${dp(pct, 2)}%</strong>.</p>`,
		};
	});

	// 24. Cliff and two boats (angles of depression)
	boss('boss5-cliff-boats', 'Depression + Two boats', function (r) {
		const h = 5 * r.int(6, 18);
		const d1a = r.int(40, 65);
		const d2a = r.int(20, d1a - 12);
		const near = h / Math.tan(rad(d1a));
		const far = h / Math.tan(rad(d2a));
		return {
			marks: 6,
			text: `From the top of a vertical cliff ${h} m high, the angles of depression of two boats, both due east of the cliff, are ${deg(d1a)} and ${deg(d2a)}. Give answers correct to 1 decimal place.${br('i', 'Find the distance from the base of the cliff to the nearer boat.')}${br('ii', 'Find the distance to the farther boat.')}${br('iii', 'Find the distance between the two boats.')}`,
			diagram: { type: 'elevation', h: `${h} m`, ang1: `${d2a}°`, ang2: `${d1a}°`, far: true, p1: 'far boat', p2: 'near boat', top: 'cliff top' },
			answer: multi([dp(near, 1), dp(far, 1), dp(far - near, 1)], ['nearer (m)', 'farther (m)', 'between (m)'], 0.06),
			solution: `<p>The angle of depression from the top equals the angle of elevation from the boat (alternate angles), and the steeper angle belongs to the nearer boat.</p>
<p>(i) tan ${deg(d1a)} = ${F.frac(String(h), 'd')}, so d = ${F.frac(String(h), `tan ${d1a}&deg;`)} = <strong>${dp(near, 1)} m</strong>.</p>
<p>(ii) Similarly ${F.frac(String(h), `tan ${d2a}&deg;`)} = <strong>${dp(far, 1)} m</strong>.</p>
<p>(iii) ${dp(far, 2)} &minus; ${dp(near, 2)} = <strong>${dp(far - near, 1)} m</strong>.</p>`,
		};
	});

	// 25. Similar figures from an area ratio
	boss('boss5-similar-area-ratio', 'Similarity: reversing area ratios', function (r) {
		let p, q, m2, x, P2;
		do {
			p = r.int(2, 4); q = r.int(p + 1, 6);
			m2 = r.int(2, 6);
			x = p * r.int(2, 5);
			P2 = q * r.int(6, 15);
		} while (MG.gcd(p, q) !== 1 || m2 * p * p === x || m2 * q * q === P2);
		const A1 = m2 * p * p, A2 = m2 * q * q;
		const sf = q / p;
		const xBig = x * q / p;
		const P1 = P2 * p / q;
		return {
			marks: 6,
			text: `Two similar triangles have areas ${A1} cm&sup2; and ${A2} cm&sup2;. Give the scale factor correct to 2 decimal places where necessary.${br('i', 'Find the scale factor of enlargement from the smaller to the larger (for lengths).')}${br('ii', `A side of the smaller triangle is ${x} cm. Find the corresponding side of the larger.`)}${br('iii', `The perimeter of the larger triangle is ${P2} cm. Find the perimeter of the smaller.`)}`,
			diagram: { type: 'similarTriangles', a: 3, b: 4, c: 5, k: sf, sideLabels1: ['', '', `${x} cm`] },
			answer: multi([dp(sf, 2), xBig, P1], ['scale factor', 'side (cm)', 'perimeter (cm)'], 0.006),
			solution: `<p>(i) Areas of similar figures scale with the <em>square</em> of the length scale factor: k&sup2; = ${F.frac(String(A2), String(A1))} = ${F.frac(String(q * q), String(p * p))}, so k = ${F.frac(String(q), String(p))} = <strong>${dp(sf, 2)}</strong>.</p>
<p>(ii) ${x} &times; ${F.frac(String(q), String(p))} = <strong>${xBig} cm</strong>.</p>
<p>(iii) Perimeter is a length, so divide by k: ${P2} &times; ${F.frac(String(p), String(q))} = <strong>${P1} cm</strong>.</p>`,
		};
	});

})();
