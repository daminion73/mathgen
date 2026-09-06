// Quadratic Theory question generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Quadratic Theory', subtopic, difficulty, gen });
	const quad = (a, b, c) => `${F.poly([a, b, c])}=0`;
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const numeric = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	const mc = (r, choices, wanted) => { const shuffled = r.shuffle(choices); return { type: 'mc', choices: shuffled, correct: shuffled.indexOf(wanted) }; };
	const range = (n) => n < 0 ? `&minus;${-n}` : `${n}`;

	add('qt-vieta-power-chain', 'Sum & product of roots', 2, (r) => {
		const s = r.nonzeroInt(-8, 8), p = r.nonzeroInt(-9, 9), a = r.int(1, 5);
		const sq = s * s - 2 * p, cube = s ** 3 - 3 * p * s;
		return { marks: 5, text: `The roots of ${quad(a, -a * s, a * p)} are &alpha; and &beta;. Without solving the equation, find:<br>(i) &alpha;&sup2;+&beta;&sup2;;<br>(ii) &alpha;&sup3;+&beta;&sup3;.`, answer: multi([sq, cube], ['α²+β²', 'α³+β³']), solution: `<p>By Vieta, s=&alpha;+&beta;=${s} and p=&alpha;&beta;=${p}.</p><p>s&sup2;&minus;2p=<strong>${sq}</strong>, while s&sup3;&minus;3ps=<strong>${cube}</strong>.</p>` };
	});

	add('qt-vieta-ratio', 'Sum & product of roots', 2, (r) => {
		let u = r.nonzeroInt(-8, 8), v = r.nonzeroInt(-8, 8); if (u === v) v += 1;
		const s = u + v, p = u * v, n0 = s * s - 2 * p, g = MG.gcd(n0, p), n = p / g < 0 ? -n0 / g : n0 / g, d = Math.abs(p / g), a = r.int(1, 4);
		return { marks: 4, text: `The roots &alpha;, &beta; of ${quad(a, -a * s, a * p)} are non-zero. Find the exact value of ${F.frac('&alpha;', '&beta;')}+${F.frac('&beta;', '&alpha;')}. Enter the reduced numerator and positive denominator.`, answer: multi([n, d], ['exact numerator', 'exact denominator']), solution: `<p>The expression is ${F.frac('(&alpha;+&beta;)&sup2;&minus;2&alpha;&beta;', '&alpha;&beta;')}=${F.frac(n0, p)}=<strong>${MG.fracReduced(n, d)}</strong>.</p>` };
	});

	add('qt-vieta-transform', 'Transformed roots', 2, (r) => {
		const u = r.nonzeroInt(-6, 6), v = r.nonzeroInt(-6, 6), s = u + v, p = u * v, shift = r.pick([-2, -1, 1, 2]);
		const ns = s + 2 * shift, np = p + shift * s + shift * shift;
		return { marks: 4, text: `The roots of x&sup2;${F.st(-s, 'x')}${F.st(p, '')}=0 are &alpha; and &beta;. A monic equation with roots &alpha;${F.st(shift, '')} and &beta;${F.st(shift, '')} is x&sup2;+Bx+C=0. Find B and C.`, answer: multi([-ns, np], ['B', 'C']), solution: `<p>The new sum is ${s}+2(${shift})=${ns}; the new product is ${p}+${shift}(${s})+${shift * shift}=${np}.</p><p>Thus <strong>B=${-ns}, C=${np}</strong>.</p>` };
	});

	add('qt-vieta-reciprocal-transform', 'Transformed roots', 3, (r) => {
		const u = r.nonzeroInt(-5, 5), v = r.nonzeroInt(-5, 5), s = u + v, p = u * v, a = r.int(1, 4);
		const ns = s + s / p, np = p + 2 + 1 / p, scale = Math.abs(p), B = -scale * ns, C = scale * np;
		return { marks: 7, text: `The non-zero roots of ${quad(a, -a * s, a * p)} are &alpha;, &beta;.<br>(i) Find the exact sum and product of &alpha;+${F.frac(1, '&beta;')} and &beta;+${F.frac(1, '&alpha;')}.<br>(ii) Hence form an equation ${scale}x&sup2;+Bx+C=0 with these roots. Enter B and C.`, answer: multi([B, C], ['B', 'C']), solution: `<p>The sum is s+${F.frac('s', 'p')}=${ns}; the product is p+2+${F.frac(1, 'p')}=${np}.</p><p>Multiplying the monic equation by ${scale} gives <strong>B=${B}, C=${C}</strong>.</p>` };
	});

	add('qt-fenced-corner', 'Optimisation applications', 2, (r) => {
		const L = 4 * r.int(6, 15), h = L / 2, area = L * L / 4, place = r.pick(['school garden', 'wildlife enclosure', 'community garden', 'dog exercise yard']);
		return { marks: 4, text: `${L} m of fencing is used to make a rectangular ${place} against two perpendicular existing walls, so only the other two sides need fencing. If one fenced side is x metres:<br>(i) Show that its area is A=x(${L}&minus;x).<br>(ii) Hence find the dimensions giving the maximum area and state that area.`, answer: multi([h, h, area], ['first side (m)', 'second side (m)', 'maximum area (m²)']), solution: `<p>The unfenced sides lie on the walls and the fenced sides total ${L}, so A=x(${L}&minus;x).</p><p>The parabola's vertex occurs midway between the zeros 0 and ${L}, so both fenced sides are ${h} m and <strong>A=${area} m&sup2;</strong>.</p>` };
	});

	add('qt-wire-square-circle', 'Optimisation applications', 3, (r) => {
		const L = r.pick([24, 32, 40, 48, 56, 64]), pi = Math.PI, x = 4 * L / (16 + 4 * pi), area = x * x / 16 + (L - x) ** 2 / (4 * pi);
		const material = r.pick(['A wire', 'A length of cable', 'A strip of wire', 'A piece of cord']);
		return { marks: 6, text: `${material} ${L} cm long is cut in two. One piece of length x cm is bent into a square and the remainder into a circle.<br>(i) Show that the total enclosed area is A=${F.frac('x&sup2;', 16)}+${F.frac(`(${L}&minus;x)&sup2;`, '4&pi;')}.<br>(ii) Find, to 1 decimal place, the length used for the square that minimises the total area, and the minimum area.`, answer: multi([x, area], ['square length (cm), 1 d.p.', 'minimum area (cm²), 1 d.p.'], 0.06), solution: `<p>The square has side x/4. The circle has radius (${L}&minus;x)/(2&pi;), giving the stated model.</p><p>A&prime;=x/8&minus;(${L}&minus;x)/(2&pi;)=0, so <strong>x=${x.toFixed(1)} cm</strong> and <strong>A=${area.toFixed(1)} cm&sup2;</strong>.</p>` };
	});

	add('qt-orchard-production', 'Optimisation applications', 2, (r) => {
		const baseTrees = r.int(30, 60) * 10, baseYield = r.int(6, 12) * 10, loss = r.int(1, 4), step = r.pick([5, 10]);
		const b = step * baseYield - loss * baseTrees, c = baseTrees * baseYield, x = Math.max(0, Math.round(b / (2 * step * loss))), N = -step * loss * x * x + b * x + c;
		const crop = r.pick(['orange', 'apple', 'peach', 'macadamia']);
		return { marks: 4, text: `An orchard has ${baseTrees} ${crop} trees, each producing ${baseYield} kg per year. For every extra group of ${step} trees planted, the yield of every tree falls by ${loss} kg. If x extra groups are planted:<br>(i) Show that total production is N=${F.poly([-step * loss, b, c])}.<br>(ii) Using the model, find the whole number of extra groups giving the greatest production, and that production.`, answer: multi([x, N], ['extra groups', 'maximum production (kg)']), solution: `<p>N=(${baseTrees}+${step}x)(${baseYield}&minus;${loss}x), which expands as shown.</p><p>The axis is x=${b}/(${2 * step * loss}) and comparison of neighbouring integers gives <strong>x=${x}, N=${N} kg</strong>.</p>` };
	});

	add('qt-vehicles-approach', 'Optimisation applications', 3, (r) => {
		const a = r.int(6, 12) * 10, b = r.int(5, 10) * 10, u = r.int(3, 7) * 10, v = r.int(3, 6) * 10;
		const t = (a * u + b * v) / (u * u + v * v), dist = Math.sqrt((a - u * t) ** 2 + (b - v * t) ** 2);
		const pair = r.pick(['two cars', 'two cyclists', 'two emergency vehicles', 'two delivery vans']);
		return { marks: 6, text: `${pair} travel towards the same intersection on perpendicular straight roads. Initially they are ${a} m and ${b} m from it, travelling at ${u} m/min and ${v} m/min respectively.<br>(i) Show that after t minutes their squared separation is d&sup2;=(${a}&minus;${u}t)&sup2;+(${b}&minus;${v}t)&sup2;.<br>(ii) Find when they are closest and their minimum separation, both to 1 decimal place.`, answer: multi([t, dist], ['time (min), 1 d.p.', 'minimum distance (m), 1 d.p.'], 0.06), solution: `<p>Pythagoras gives the stated expression. Its vertex occurs at t=${F.frac(a * u + b * v, u * u + v * v)}.</p><p>Thus <strong>t=${t.toFixed(1)} min</strong> and <strong>d=${dist.toFixed(1)} m</strong>.</p>` };
	});

	add('qt-frame-border', 'Optimisation applications', 2, (r) => {
		const W = r.int(12, 24), H = r.int(8, W - 2), target = r.int(35, 65) / 100 * W * H;
		const B = W + H, disc = B * B - (W * H - target), x = (B - Math.sqrt(disc)) / 4;
		return { marks: 4, text: `A ${W} cm by ${H} cm photograph is covered by a frame of uniform width x cm inside its edges. The visible photograph has area ${target.toFixed(1)} cm&sup2;.<br>(i) Show that (${W}&minus;2x)(${H}&minus;2x)=${target.toFixed(1)}.<br>(ii) Find the physically possible width, to 1 decimal place.`, answer: numeric(x, 'frame width (cm), 1 d.p.', 0.06), solution: `<p>The visible dimensions are ${W}&minus;2x and ${H}&minus;2x. Expanding and solving the resulting quadratic, then rejecting the impossible larger root, gives <strong>x=${x.toFixed(1)} cm</strong>.</p>` };
	});

	add('qt-projectile-chain', 'Optimisation applications', 2, (r) => {
		const b = r.int(2, 5), peakTime = r.int(3, 8), a = 2 * b * peakTime, peak = b * peakTime * peakTime;
		const item = r.pick(['model rocket', 'flare', 'ball', 'water jet']);
		return { marks: 4, text: `The height of a ${item} after t seconds is h=${a}t&minus;${b}t&sup2; metres.<br>(i) Find the time at which it reaches maximum height.<br>(ii) Find that maximum height.`, answer: multi([peakTime, peak], ['time (s)', 'maximum height (m)']), solution: `<p>h=&minus;${b}(t&minus;${peakTime})&sup2;+${peak}. Hence the vertex gives <strong>t=${peakTime} s, h=${peak} m</strong>.</p>` };
	});

	add('qt-discriminant-factor-range', 'Discriminant', 2, (r) => {
		let p = r.int(-8, 2), q = p + 2 * r.int(2, 6); const mid = (p + q) / 2, half = (q - p) / 2, c = (mid * mid - half * half) / 4;
		const choices = [`k &lt; ${range(p)} or k &gt; ${range(q)}`, `${range(p)} &lt; k &lt; ${range(q)}`, `k &le; ${range(p)} or k &ge; ${range(q)}`, `All real k`], wanted = choices[0];
		return { marks: 4, text: `For which values of k does x&sup2;+kx${F.st(c, '')}=0 have two distinct real roots?`, answer: mc(r, choices, wanted), solution: `<p>&Delta;=k&sup2;&minus;4(${c})=(k&minus;(${p}))(k&minus;(${q})).</p><p>For two distinct roots &Delta;&gt;0, so <strong>${wanted}</strong>.</p>` };
	});

	add('qt-positive-definite-integer', 'Definite & indefinite', 2, (r) => {
		const a = r.int(1, 5), c = r.int(1, 5), t = r.int(3, 12); let k = a + 1;
		while ((2 * t) ** 2 - 4 * (k - a) * (k + c) >= 0) k++;
		return { marks: 5, text: `Find the least integer k for which (k&minus;${a})x&sup2;${F.st(2 * t, 'x')}+(k${F.st(c, '')}) is positive definite.`, answer: numeric(k, 'least integer k'), solution: `<p>We need k&gt;${a} and &Delta;=${4 * t * t}&minus;4(k&minus;${a})(k${F.st(c, '')})&lt;0.</p><p>Testing integers satisfying the first condition, the least is <strong>${k}</strong>.</p>` };
	});

	add('qt-tangent-line', 'Tangency & intersection', 2, (r) => {
		const h = r.nonzeroInt(-6, 6), p = r.nonzeroInt(-8, 8), q = r.nonzeroInt(-9, 9), intercept = q - h * h, m = 2 * h + p;
		return { marks: 4, text: `The line y=mx${F.st(intercept, '')} is tangent to y=x&sup2;${F.st(p, 'x')}${F.st(q, '')}. Find m.`, answer: numeric(m, 'm'), solution: `<p>Equating gives x&sup2;+(${p}&minus;m)x${F.st(q - intercept, '')}=0. Tangency requires &Delta;=0.</p><p>Solving gives <strong>m=${m}</strong>, with contact at x=${h}.</p>` };
	});

	add('qt-intersection-count', 'Tangency & intersection', 2, (r) => {
		const h = r.nonzeroInt(-5, 5), kind = r.pick([-1, 0, 1]), p = r.nonzeroInt(-6, 6), q = r.nonzeroInt(-8, 8), m = p + 2 * h, c = q - h * h + kind * r.int(1, 7);
		const choices = ['No intersections', 'One intersection (tangent)', 'Two intersections', 'Infinitely many'], wanted = kind > 0 ? 'No intersections' : kind === 0 ? 'One intersection (tangent)' : 'Two intersections';
		return { marks: 3, text: `How many points of intersection are there between y=x&sup2;${F.st(p, 'x')}${F.st(q, '')} and y=${F.lt(m, 'x')}${F.st(c, '')}?`, answer: mc(r, choices, wanted), solution: `<p>After equating, the discriminant is ${4 * (q - h * h - c)}. Its sign gives <strong>${wanted.toLowerCase()}</strong>.</p>` };
	});

	add('qt-discriminant-boundary-chain', 'Discriminant', 3, (r) => {
		const m = r.int(2, 7), c = m * m;
		const opening = r.pick([
			`Consider x&sup2;+kx+${c}=0.`,
			`The quadratic equation x&sup2;+kx+${c}=0 depends on the constant k.`,
			`Let k be a real constant in x&sup2;+kx+${c}=0.`
		]);
		return { marks: 7, text: `${opening}<br>(i) Show that its discriminant is a difference of two squares and factorise it.<br>(ii) State the range of k for which there are no real roots, entering both endpoints in increasing order.<br>(iii) For the smaller boundary value of k, find the repeated root.`, answer: multi([-2 * m, 2 * m, m], ['lower endpoint of no-root interval', 'upper endpoint of no-root interval', 'repeated root at lower endpoint']), solution: `<p>&Delta;=k&sup2;&minus;4(${c})=(k&minus;2&radic;${c})(k+2&radic;${c})=(k&minus;${2 * m})(k+${2 * m}).</p><p>It is negative for <strong>&minus;${2 * m}&lt;k&lt;${2 * m}</strong>.</p><p>At k=&minus;${2 * m} the repeated root is x=&minus;k/2=<strong>${m}</strong>.</p>` };
	});
})();
