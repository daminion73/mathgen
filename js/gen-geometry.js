// Coordinate Geometry + Geometry question generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const reg = (id, topic, subtopic, difficulty, gen) => G.push({ id, topic, subtopic, difficulty, gen });
	const num = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const dp = (x, n = 2) => MG.round(x, n);

	reg('cg-circle-tangent', 'Coordinate Geometry', 'Circles', 2, (r) => {
		const h = r.int(-4, 4), k = r.int(-4, 4), rad = r.int(3, 8), extra = r.int(2, 7), px = h + rad + extra, length = dp(Math.sqrt((rad + extra) ** 2 - rad ** 2));
		return { marks: 5, text: `A circle has equation (x${F.st(-h, '')})<sup>2</sup>+(y${F.st(-k, '')})<sup>2</sup>=${rad * rad}. The point P${F.pt(px, k)} lies outside it. Find the tangent length from P, correct to 2 decimal places.`, diagram: { type: 'tangentRadius', angleLabel: '90°' }, answer: num(length, 'tangent length (2 d.p.)', 0.01), solution: `<p>The centre is ${F.pt(h, k)}, radius ${rad}, and OP=${rad + extra}. Radius OT is perpendicular to the tangent, so PT=${F.sqrt(`${(rad + extra) ** 2}-${rad ** 2}`)}=<strong>${length}</strong>.</p>` };
	});

	reg('cg-circle-common-chord', 'Coordinate Geometry', 'Circles', 3, (r) => {
		const rad = r.int(5, 10), d = r.int(2, rad - 1), half = dp(Math.sqrt(rad * rad - d * d)), chord = dp(2 * half);
		return { marks: 7, text: `Two equal circles have radius ${rad} units and centres ${2 * d} units apart. Their common chord is perpendicular to the line of centres. Show that this line bisects the chord, then find its length correct to 2 decimal places.`, diagram: { type: 'circles2', r1: rad, r2: rad, labels: ['A', 'B'], distLabel: `${2 * d}`, r1Label: 'r', r2Label: 'r' }, answer: num(chord, 'common chord (2 d.p.)', 0.01), solution: `<p>Equal radii to each intersection give two congruent kite halves, so the centre line perpendicularly bisects the chord. Half-chord=${F.sqrt(`${rad ** 2}-${d ** 2}`)}=${half}; hence the chord is <strong>${chord}</strong>.</p>` };
	});

	reg('geo-centre-algebra', 'Geometry', 'Circle theorems', 2, (r) => {
		const x = r.int(12, 38), c = r.pick([5, 10, 15]), circum = 2 * x + c, centre = 2 * circum;
		return { marks: 5, text: `The angle at the centre standing on arc AB is ${centre}&deg;. The angle at P on the same arc is (2x+${c})&deg;. Find (i) x and (ii) &ang;APB.`, diagram: { type: 'angleAtCentre', centralLabel: `${centre}°`, circumLabel: `(2x+${c})°` }, answer: multi([x, circum], ['(i) x', '(ii) angle APB (degrees)']), solution: `<p>The centre angle is twice the circumference angle: ${centre}=2(2x+${c}). Thus <strong>x=${x}</strong>, then &ang;APB=2(${x})+${c}=<strong>${circum}&deg;</strong>.</p>` };
	});

	reg('geo-same-arc-algebra', 'Geometry', 'Circle theorems', 2, (r) => {
		const x = r.int(10, 42), a = r.pick([2, 3]), c = r.int(4, 16), d = r.int(2, 12), angle = a * x + c, b = angle - x - d;
		return { marks: 5, text: `Angles APB and AQB stand on chord AB. They are (${a}x+${c})&deg; and (x+${b})&deg;. Find x and the common angle.`, diagram: { type: 'sameArc', pLabel: `${a}x+${c}°`, qLabel: `x+${b}°` }, answer: multi([x, angle], ['x', 'common angle (degrees)']), solution: `<p>Angles in the same segment are equal, so ${a}x+${c}=x+${b}. Hence <strong>x=${x}</strong> and the common angle is <strong>${angle}&deg;</strong>.</p>` };
	});

	reg('geo-cyclic-algebra', 'Geometry', 'Circle theorems', 2, (r) => {
		const x = r.int(12, 35), a = r.pick([2, 3]), c = r.int(5, 20), A = a * x + c, C = 180 - A, b = C - x;
		return { marks: 5, text: `ABCD is cyclic. Opposite angles A and C are (${a}x+${c})&deg; and (x+${b})&deg;. Find x and &ang;A.`, diagram: { type: 'cyclicQuad', angleLabels: [`${a}x+${c}°`, '', `x+${b}°`, ''] }, answer: multi([x, A], ['x', 'angle A (degrees)']), solution: `<p>Opposite angles in a cyclic quadrilateral sum to 180&deg;: (${a}x+${c})+(x+${b})=180. Thus <strong>x=${x}</strong> and <strong>&ang;A=${A}&deg;</strong>.</p>` };
	});

	reg('geo-cyclic-tangent', 'Geometry', 'Circle theorems', 3, (r) => {
		const a = r.int(28, 68), b = r.int(22, 62), C = 180 - a, final = 180 - b;
		return { marks: 7, text: `ABCD is cyclic. &ang;A=${a}&deg;. A tangent at C makes an angle of ${b}&deg; with chord CB. Find (i) &ang;C and (ii) the obtuse angle between the tangent and the extension of CB. Give reasons.`, diagram: { type: 'cyclicQuad', angleLabels: [`${a}°`, '', 'x', ''] }, answer: multi([C, final], ['(i) angle C (degrees)', '(ii) obtuse tangent angle (degrees)']), solution: `<p>(i) Opposite cyclic angles are supplementary, so C=180-${a}=<strong>${C}&deg;</strong>. (ii) Adjacent angles on the tangent line sum to 180&deg;, giving <strong>${final}&deg;</strong>.</p>` };
	});

	reg('geo-tangent-chain', 'Geometry', 'Circle theorems', 3, (r) => {
		const p = r.int(18, 58), centre = 90 - p, isos = (180 - centre) / 2;
		return { marks: 6, text: `PT is tangent at T to a circle with centre O. In right triangle OPT, &ang;OPT=${p}&deg;. (i) Find &ang;POT. (ii) If A is on the circle and OA=OT, find each base angle of triangle AOT. Give answers to 1 decimal place where necessary.`, diagram: { type: 'tangentRadius', angleLabel: `${p}°` }, answer: multi([centre, isos], ['(i) POT (1 d.p.)', '(ii) base angle (1 d.p.)'], 0.05), solution: `<p>OT&perp;PT, so POT=90-${p}=<strong>${centre}&deg;</strong>. Since OA=OT, triangle AOT is isosceles; each base angle is (180-${centre})/2=<strong>${isos}&deg;</strong>.</p>` };
	});

	reg('geo-circle-exact-length', 'Geometry', 'Circle theorems', 2, (r) => {
		const k = r.int(3, 9), angle = r.pick([30, 45]), factor = angle === 45 ? 'sqrt(2)' : '2', shown = angle === 45 ? `${k}&radic;2` : `${2 * k}`, accept = angle === 45 ? [`${k}sqrt(2)`, `${k}*sqrt(2)`, String(dp(k * Math.sqrt(2), 2))] : [String(2 * k)];
		return { marks: 4, text: `AB is a diameter. Chord DE has length ${k} cm and subtends an angle of ${angle}&deg; at the circumference in the shown configuration. Find AB in exact form.`, diagram: { type: 'sameArc', pLabel: `${angle}°`, qLabel: 'same arc' }, answer: { type: 'text', accept, placeholder: 'exact value' }, answerShown: shown, solution: `<p>The corresponding right-triangle chord relation gives AB=${k}&divide;sin ${angle}&deg;=<strong>${shown} cm</strong> (${factor}).</p>` };
	});

	reg('geo-similar-parallel-two', 'Geometry', 'Similarity', 2, (r) => {
		const ad = r.int(3, 8), db = r.int(2, 7), de = r.int(3, 10), ae = r.int(4, 11), scale = (ad + db) / ad, bc = dp(de * scale), ac = dp(ae * scale);
		return { marks: 5, text: `In triangle ABC, DE &parallel; BC. AD=${ad}, DB=${db}, DE=${de} and AE=${ae}. Find BC and AC, correct to 2 decimal places.`, diagram: { type: 'similarParallel', t: ad / (ad + db), AD: String(ad), DB: String(db), DE: String(de), BC: 'x' }, answer: multi([bc, ac], ['BC (2 d.p.)', 'AC (2 d.p.)'], 0.01), solution: `<p>&triangle;ADE|||&triangle;ABC by corresponding angles. Scale factor=${F.frac(ad + db, ad)}. Hence <strong>BC=${bc}</strong> and <strong>AC=${ac}</strong>.</p>` };
	});

	reg('geo-similar-proof-chain', 'Geometry', 'Similarity', 3, (r) => {
		const ad = r.int(3, 8), db = r.int(2, 7), de = r.int(4, 11), value = dp(de * (ad + db) / ad);
		return { marks: 7, text: `In triangle ABC, D lies on AB, E lies on AC and DE &parallel; BC. Show that triangles ADE and ABC are similar, then hence find BC correct to 2 decimal places when AD=${ad}, DB=${db}, DE=${de}.`, diagram: { type: 'similarParallel', t: ad / (ad + db), AD: String(ad), DB: String(db), DE: String(de), BC: 'x' }, answer: num(value, 'BC (2 d.p.)', 0.01), solution: `<p>&ang;ADE=&ang;ABC and &ang;AED=&ang;ACB (corresponding angles), so the triangles are similar by AA. Therefore ${F.frac('BC', de)}=${F.frac(ad + db, ad)}, giving <strong>BC=${value}</strong>.</p>` };
	});

	reg('geo-intersecting-chords', 'Geometry', 'Circle theorems', 2, (r) => {
		const a = r.int(3, 9), b = r.int(4, 12), c = r.int(2, 7), value = dp(a * b / c);
		return { marks: 4, text: `Chords AB and CD intersect at P inside a circle. AP=${a}, PB=${b}, CP=${c}. Find PD correct to 2 decimal places.`, diagram: { type: 'cyclicQuad', labels: ['A', 'C', 'B', 'D'], angleLabels: ['', '', '', ''] }, answer: num(value, 'PD (2 d.p.)', 0.01), solution: `<p>Intersecting chords theorem: AP&times;PB=CP&times;PD. Thus PD=${F.frac(`${a}&times;${b}`, c)}=<strong>${value}</strong>.</p>` };
	});

	reg('geo-secant-power', 'Geometry', 'Circle theorems', 3, (r) => {
		const ext = r.int(2, 7), inside = r.int(3, 10), tangent = dp(Math.sqrt(ext * (ext + inside)));
		return { marks: 6, text: `From an external point P, a secant meets a circle at A then B with PA=${ext} and AB=${inside}. A tangent PT is also drawn. Find PT correct to 2 decimal places and justify the equation used.`, diagram: { type: 'tangentRadius', angleLabel: 'x' }, answer: num(tangent, 'PT (2 d.p.)', 0.01), solution: `<p>By power of a point, PT<sup>2</sup>=PA&times;PB=${ext}(${ext + inside}). Therefore PT=${F.sqrt(ext * (ext + inside))}=<strong>${tangent}</strong>.</p>` };
	});

	reg('geo-cyclic-similar-proof', 'Geometry', 'Circle theorems', 3, (r) => {
		const ab = r.int(3, 8), dc = r.int(4, 10), ad = r.int(3, 9), value = dp(ab * dc / ad);
		return { marks: 8, text: `ABCD is cyclic and an auxiliary line is drawn so that two pairs of angles stand on the same arcs. Show that triangles formed by the diagonal are similar. Hence, given AB=${ab}, DC=${dc} and AD=${ad}, find the corresponding side x correct to 2 decimal places.`, diagram: { type: 'cyclicQuad', angleLabels: ['', 'α', '', 'α'] }, answer: num(value, 'x (2 d.p.)', 0.01), solution: `<p>Equal angles in the same segment give two matching angle pairs, so the triangles are similar by AA. Corresponding sides give ${F.frac('x', dc)}=${F.frac(ab, ad)}; hence <strong>x=${value}</strong>.</p>` };
	});
})();
