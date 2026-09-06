// Advanced geometry & trigonometry generators modelled on past-paper questions
// (3D box angles, surveyor towers, bearings to midpoints, produced-line similarity,
// trig quadratics/identities, tangents from external points, semicircle functions).
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const reg = (id, topic, subtopic, gen) => G.push({ id, topic, subtopic, difficulty: 1, gen });
	const num = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const dp = (x, d) => MG.round(x, d);
	const rad = MG.degToRad;
	const degOf = (x) => x * 180 / Math.PI;
	const cot = (aDeg) => 1 / Math.tan(rad(aDeg));
	const signed = (n) => n < 0 ? `&minus;${-n}` : `+${n}`;
	const br = (i, s) => `<br><strong>(${i})</strong> ${s}`;

	// 1. Rectangular prism: base diagonal, space diagonal, angle with base (2022 MC8 style)
	reg('advgeo-box-angle', 'Trigonometry', '3D trigonometry', function (r) {
		const a = r.int(4, 15), b = r.int(4, 15), c = r.int(4, 12);
		const base = Math.sqrt(a * a + b * b);
		const space = Math.sqrt(a * a + b * b + c * c);
		const ang = degOf(Math.atan(c / base));
		return {
			marks: 5,
			text: `ABCDEFGH is a rectangular box with AB = ${a} cm, BC = ${b} cm and height CG = ${c} cm. Give lengths correct to 2 decimal places and the angle to 1 decimal place.${br('i', 'Find the base diagonal AC.')}${br('ii', 'Find the space diagonal AG.')}${br('iii', 'Find the angle that AG makes with the base ABCD.')}`,
			answer: multi([dp(base, 2), dp(space, 2), dp(ang, 1)], ['AC (2 d.p.)', 'AG (2 d.p.)', 'angle (1 d.p.)'], 0.06),
			solution: `<p>(i) AC = ${F.sqrt(`${a}<sup>2</sup> + ${b}<sup>2</sup>`)} = <strong>${dp(base, 2)} cm</strong>.</p>
<p>(ii) AG&sup2; = AC&sup2; + CG&sup2;, so AG = ${F.sqrt(`${a * a + b * b} + ${c * c}`)} = <strong>${dp(space, 2)} cm</strong>.</p>
<p>(iii) In right triangle ACG, tan &theta; = ${F.frac(c, 'AC')}.</p>
<p>&theta; = tan<sup>&minus;1</sup>(${c} / ${dp(base, 2)}) = <strong>${dp(ang, 1)}&deg;</strong>.</p>`,
		};
	});

	// 2. Two surveyors at different bearings observe a tower (2022 B(f) style)
	reg('advgeo-two-surveyor-tower', 'Trigonometry', 'Elevation with bearings', function (r) {
		const alpha = r.int(6, 14), beta = alpha + r.int(2, 6);
		const bearing = r.int(20, 70); // bearing of B from the tower; A is due south
		const theta = 180 - bearing;   // horizontal angle ATB at the tower
		const D = 5 * r.int(8, 24);    // distance between the surveyors
		const cA = cot(alpha), cB = cot(beta);
		const h = D / Math.sqrt(cA * cA + cB * cB - 2 * cA * cB * Math.cos(rad(theta)));
		return {
			marks: 4,
			text: `Surveyor A is due south of a vertical tower and measures the angle of elevation of its top as ${alpha}&deg;. Surveyor B stands on a bearing of 0${bearing}&deg;T from the foot of the tower and measures the angle of elevation as ${beta}&deg;. The two surveyors are ${D} m apart. Find the height of the tower, to the nearest metre.`,
			answer: num(Math.round(h), 'height (nearest metre)', 0.5),
			solution: `<p>If the height is h, surveyor A is h&thinsp;cot ${alpha}&deg; from the foot and surveyor B is h&thinsp;cot ${beta}&deg; from it.</p>
<p>The horizontal angle between the two directions at the tower is 180&deg; &minus; ${bearing}&deg; = ${theta}&deg;.</p>
<p>By the cosine rule: ${D}&sup2; = h&sup2;(cot&sup2;${alpha}&deg; + cot&sup2;${beta}&deg; &minus; 2 cot ${alpha}&deg; cot ${beta}&deg; cos ${theta}&deg;).</p>
<p>Solving, h = ${D} / ${F.sqrt(dp(cA * cA + cB * cB - 2 * cA * cB * Math.cos(rad(theta)), 3))} &asymp; <strong>${Math.round(h)} m</strong>.</p>`,
		};
	});

	// 3. Bearing from a vertex to the midpoint of the opposite side (2022 E(b) style)
	reg('advgeo-bearing-midpoint', 'Trigonometry', 'Bearings in the plane', function (r) {
		let a, b, c;
		do { a = r.int(6, 13); b = r.int(6, 13); c = r.int(6, 13); }
		while (a + b <= c + 1 || b + c <= a + 1 || a + c <= b + 1);
		const th0 = r.int(30, 140); // bearing of B from A
		const A = degOf(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
		const B = [c * Math.sin(rad(th0)), c * Math.cos(rad(th0))];
		const C = [b * Math.sin(rad(th0 + A)), b * Math.cos(rad(th0 + A))];
		const M = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2];
		let bm = degOf(Math.atan2(M[0], M[1])); if (bm < 0) bm += 360;
		return {
			marks: 5,
			text: `Three beams form a horizontal triangle ABC with AB = ${c} m, BC = ${a} m and CA = ${b} m. Viewed from above, B has a bearing of ${String(th0).padStart(3, '0')}&deg;T from A, and C lies clockwise from B around A. A paint pot sits at M, the midpoint of BC.${br('i', 'Find &ang;BAC correct to 1 decimal place.')}${br('ii', 'Find the bearing of M from A, to the nearest degree.')}`,
			diagram: { type: 'triangle', a, b, c, labels: ['A', 'B', 'C'], sideLabels: [`${a}`, `${b}`, `${c}`] },
			answer: multi([dp(A, 1), Math.round(bm)], ['angle BAC (1 d.p.)', 'bearing of M (nearest degree)'], 0.55),
			solution: `<p>(i) Cosine rule at A: cos A = ${F.frac(`${b}<sup>2</sup> + ${c}<sup>2</sup> &minus; ${a}<sup>2</sup>`, `2 &times; ${b} &times; ${c}`)} = ${dp((b * b + c * c - a * a) / (2 * b * c), 4)}, so &ang;BAC = <strong>${dp(A, 1)}&deg;</strong>.</p>
<p>(ii) Place A at the origin with north up. B = (${dp(B[0], 2)}, ${dp(B[1], 2)}) and, rotating a further ${dp(A, 1)}&deg; clockwise, C = (${dp(C[0], 2)}, ${dp(C[1], 2)}).</p>
<p>M = (${dp(M[0], 2)}, ${dp(M[1], 2)}), so the bearing of M is tan<sup>&minus;1</sup>(east/north) &asymp; <strong>${String(Math.round(bm)).padStart(3, '0')}&deg;T</strong>.</p>`,
		};
	});

	// 4. Produced lines, similar triangles, right angle by converse Pythagoras, area ratio (2022 C(e))
	reg('advgeo-produced-similar-area', 'Geometry', 'Similarity & area ratios', function (r) {
		const [p, q, hyp] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]);
		const s = r.int(2, 5), u = r.int(1, s - 1);
		const AC = p * s, AE = q * s, CE = hyp * s, BD = p * u;
		const areaACE = AC * AE / 2;
		const ratio = u / s;
		const areaBDE = p * q * u * u / 2;
		return {
			marks: 5,
			text: `Lines AB and CD are produced to meet at E, with &ang;CAE = &ang;BDE, so that &triangle;ACE is similar to &triangle;DBE. Given AC = ${AC} cm, AE = ${AE} cm, CE = ${CE} cm and BD = ${BD} cm. Note that AC and BD are corresponding sides. Give the ratio correct to 2 decimal places where necessary.${br('i', 'State the similarity ratio BD : AC as a decimal.')}${br('ii', 'Explain why &triangle;ACE is right-angled, and find its area.')}${br('iii', 'Hence find the area of &triangle;BDE.')}`,
			answer: multi([dp(ratio, 2), areaACE, areaBDE], ['ratio (2 d.p.)', 'area ACE (cm&sup2;)', 'area BDE (cm&sup2;)'], 0.02),
			solution: `<p>(i) The ratio is ${BD} : ${AC} = <strong>${dp(ratio, 2)}</strong>.</p>
<p>(ii) ${AC}&sup2; + ${AE}&sup2; = ${AC * AC + AE * AE} = ${CE}&sup2;, so by the converse of Pythagoras the angle at A is 90&deg;.</p>
<p>Area of &triangle;ACE = ${F.frac(1, 2)} &times; ${AC} &times; ${AE} = <strong>${areaACE} cm&sup2;</strong>.</p>
<p>(iii) Areas of similar figures scale by the square of the ratio: ${areaACE} &times; (${dp(ratio, 2)})&sup2; = <strong>${areaBDE} cm&sup2;</strong>.</p>`,
		};
	});

	// 5. Quadratic trig equation via cos^2 -> sin (2022 C(b) style)
	reg('advgeo-trig-quadratic', 'Trigonometry', 'Trigonometric equations', function (r) {
		const e = r.pick([1, -1]);
		const m = r.pick([1, -1, 2, -2, 3, -3, 4, -4]);
		const bCo = 2 * m + e, cCo = e * m + 2; // 2cos²θ = c − b sinθ  ⇔  2sin²θ − b sinθ + (c−2) = 0 = (2s−e)(s−m)
		const sols = e === 1 ? [30, 150] : [210, 330];
		if (m === 1) sols.push(90);
		if (m === -1) sols.push(270);
		sols.sort((x, y) => x - y);
		return {
			marks: 3,
			text: `Consider the equation 2 cos<sup>2</sup>&theta; = ${cCo}${bCo >= 0 ? ' &minus; ' : ' + '}${Math.abs(bCo) === 1 ? '' : Math.abs(bCo)} sin &theta; for 0&deg; &lt; &theta; &lt; 360&deg;.${br('i', 'How many solutions does it have?')}${br('ii', 'Find the smallest solution, in degrees.')}${br('iii', 'Find the largest solution, in degrees.')}`,
			answer: multi([sols.length, sols[0], sols[sols.length - 1]], ['number of solutions', 'smallest (degrees)', 'largest (degrees)']),
			solution: `<p>Replace cos&sup2;&theta; with 1 &minus; sin&sup2;&theta;: 2 &minus; 2 sin&sup2;&theta; = ${cCo}${bCo >= 0 ? ' &minus; ' : ' + '}${Math.abs(bCo)} sin &theta;.</p>
<p>Rearranging: 2 sin&sup2;&theta; ${bCo >= 0 ? '&minus;' : '+'} ${Math.abs(bCo)} sin &theta; ${cCo - 2 >= 0 ? '+' : '&minus;'} ${Math.abs(cCo - 2)} = 0, which factors as (2 sin &theta; ${e === 1 ? '&minus; 1' : '+ 1'})(sin &theta; ${m >= 0 ? '&minus;' : '+'} ${Math.abs(m)}) = 0.</p>
<p>sin &theta; = ${e === 1 ? F.frac(1, 2) : `&minus;${F.frac(1, 2)}`}${Math.abs(m) > 1 ? ` (sin &theta; = ${m} is impossible)` : ` or sin &theta; = ${m}`}.</p>
<p>Solutions: ${sols.map((x) => x + '&deg;').join(', ')} — <strong>${sols.length}</strong> of them; smallest <strong>${sols[0]}&deg;</strong>, largest <strong>${sols[sols.length - 1]}&deg;</strong>.</p>`,
		};
	});

	// 6. Simplify a trig fraction to k·cot or k·tan (2022 C(c) style)
	reg('advgeo-identity-coefficient', 'Trigonometry', 'Trigonometric identities', function (r) {
		const n = r.int(2, 4), j = r.int(1, 3), k = n * j;
		const cotForm = r.next() < 0.5;
		const numer = cotForm
			? `${k} cos &theta; sin<sup>2</sup>&theta; + ${k} cos<sup>3</sup>&theta;`
			: `${k} sin &theta; cos<sup>2</sup>&theta; + ${k} sin<sup>3</sup>&theta;`;
		const denom = cotForm ? `${n} sin &theta;` : `${n} cos &theta;`;
		const fnName = cotForm ? 'cot' : 'tan';
		return {
			marks: 2,
			text: `The expression ${F.frac(numer, denom)} simplifies to c&thinsp;${fnName}&thinsp;&theta; for a constant c. Find c.`,
			answer: num(j, 'c'),
			solution: `<p>Factor the numerator: ${k} ${cotForm ? 'cos &theta;' : 'sin &theta;'}(${cotForm ? 'sin<sup>2</sup>&theta; + cos<sup>2</sup>&theta;' : 'cos<sup>2</sup>&theta; + sin<sup>2</sup>&theta;'}) = ${k} ${cotForm ? 'cos &theta;' : 'sin &theta;'}.</p>
<p>Dividing by ${denom} gives ${F.frac(k, n)} ${fnName} &theta;, so c = <strong>${j}</strong>.</p>`,
		};
	});

	// 7. Linear cos equation with a surd over 0..720 (2022 D(g) style)
	reg('advgeo-cos-surd-equation', 'Trigonometry', 'Trigonometric equations', function (r) {
		const [N, surd] = r.pick([[2, 3], [2, 2], [4, 12], [4, 8]]);
		const n = r.int(1, N - 1), mm = N - n;
		const plus = r.next() < 0.5; // plus: n cos x − √b = −m cos x  ⇒  cos x = +√b/N
		const A0 = (surd === 3 || surd === 12) ? 30 : 45;
		const sols = plus ? [A0, 360 - A0, 360 + A0, 720 - A0] : [180 - A0, 180 + A0, 540 - A0, 540 + A0];
		const cosVal = (surd === 3 || surd === 12) ? '&radic;3&frasl;2' : '&radic;2&frasl;2';
		return {
			marks: 3,
			text: `Solve ${n === 1 ? '' : n}&thinsp;cos x ${plus ? '&minus;' : '+'} &radic;${surd} = &minus;${mm === 1 ? '' : mm}&thinsp;cos x for 0&deg; &lt; x &lt; 720&deg;.${br('i', 'How many solutions are there?')}${br('ii', 'Find the smallest solution.')}${br('iii', 'Find the largest solution.')}`,
			answer: multi([sols.length, sols[0], sols[sols.length - 1]], ['number of solutions', 'smallest (degrees)', 'largest (degrees)']),
			solution: `<p>Collect the cosine terms: ${N} cos x = ${plus ? '' : '&minus;'}&radic;${surd}, so cos x = ${plus ? '' : '&minus;'}${cosVal}.</p>
<p>The related angle is ${A0}&deg;, and cosine is ${plus ? 'positive in quadrants 1 and 4' : 'negative in quadrants 2 and 3'}.</p>
<p>Over two full turns: ${sols.map((x) => x + '&deg;').join(', ')} — <strong>${sols.length}</strong> solutions, smallest <strong>${sols[0]}&deg;</strong>, largest <strong>${sols[sols.length - 1]}&deg;</strong>.</p>`,
		};
	});

	// 8. General-form circle + tangents from an external point (2022 E(e))
	reg('advgeo-circle-tangents-external', 'Coordinate Geometry', 'Circles', function (r) {
		let h, k, rr;
		do { h = r.nonzeroInt(-6, 6); k = r.nonzeroInt(-6, 6); rr = r.int(3, 6); } while (Math.abs(h) === rr || h * h + k * k === rr * rr);
		const D = -2 * h, E = -2 * k, Fc = h * h + k * k - rr * rr;
		const p = k + rr + r.int(2, 6);
		// tangents y = mx + p:  (h²−r²)m² + 2h(p−k)m + (p−k)²−r² = 0
		const A2 = h * h - rr * rr, B2 = 2 * h * (p - k), C2 = (p - k) * (p - k) - rr * rr;
		const disc = Math.sqrt(B2 * B2 - 4 * A2 * C2);
		const ms = [(-B2 - disc) / (2 * A2), (-B2 + disc) / (2 * A2)].sort((x, y) => x - y);
		return {
			marks: 6,
			text: `A circle has equation x<sup>2</sup> + y<sup>2</sup> ${signed(D)}x ${signed(E)}y ${signed(Fc)} = 0.${br('i', 'Find its centre.')}${br('ii', 'Find its radius.')}${br('iii', `Two tangents to the circle pass through the point P(0, ${p}). Find their gradients, correct to 2 decimal places.`)}`,
			answer: multi([h, k, rr, dp(ms[0], 2), dp(ms[1], 2)], ['centre x', 'centre y', 'radius', 'smaller gradient (2 d.p.)', 'larger gradient (2 d.p.)'], 0.02),
			solution: `<p>(i) Completing the square: (x ${signed(-h)})<sup>2</sup> + (y ${signed(-k)})<sup>2</sup> = ${rr * rr}. Centre <strong>${F.pt(h, k)}</strong>.</p>
<p>(ii) Radius = ${F.sqrt(rr * rr)} = <strong>${rr}</strong>.</p>
<p>(iii) A line y = mx + ${p} is tangent when its distance from ${F.pt(h, k)} equals ${rr}: ${F.frac(`|${h}m &minus; ${k} + ${p}|`, F.sqrt('m<sup>2</sup> + 1'))} = ${rr}.</p>
<p>Squaring: ${A2}m&sup2; ${signed(B2)}m ${signed(C2)} = 0.</p>
<p>The quadratic formula gives m = <strong>${dp(ms[0], 2)}</strong> and <strong>${dp(ms[1], 2)}</strong>.</p>`,
		};
	});

	// 9. Cosine rule, then sine rule, then area — with diagram
	reg('advgeo-cosine-sine-area', 'Trigonometry', 'Non-right-angled triangles', function (r) {
		const b = r.int(6, 10), c = b + r.int(1, 5), A = r.int(60, 130);
		const a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(rad(A)));
		const B = degOf(Math.asin(b * Math.sin(rad(A)) / a));
		const area = b * c * Math.sin(rad(A)) / 2;
		return {
			marks: 5,
			text: `In triangle ABC, AC = b = ${b} cm, AB = c = ${c} cm and &ang;A = ${A}&deg;.${br('i', 'Find BC = a, correct to 2 decimal places.')}${br('ii', 'Find &ang;B, correct to 1 decimal place.')}${br('iii', 'Find the area of the triangle, correct to 1 decimal place.')}`,
			diagram: { type: 'triangle', a: Math.max(a, 1), b, c, labels: ['A', 'B', 'C'], sideLabels: ['a = ?', `${b}`, `${c}`], angleLabels: [`${A}&#176;`, '', ''] },
			answer: multi([dp(a, 2), dp(B, 1), dp(area, 1)], ['a (2 d.p.)', 'angle B (1 d.p.)', 'area (1 d.p.)'], 0.06),
			solution: `<p>(i) Cosine rule: a&sup2; = ${b}&sup2; + ${c}&sup2; &minus; 2(${b})(${c})cos ${A}&deg; = ${dp(a * a, 3)}, so a = <strong>${dp(a, 2)} cm</strong>.</p>
<p>(ii) Sine rule: ${F.frac('sin B', b)} = ${F.frac(`sin ${A}&deg;`, dp(a, 2))}.</p>
<p>sin B = ${dp(b * Math.sin(rad(A)) / a, 4)}, so &ang;B = <strong>${dp(B, 1)}&deg;</strong> (acute, since b is the smallest side).</p>
<p>(iii) Area = ${F.frac(1, 2)}bc sin A = ${F.frac(1, 2)}(${b})(${c})sin ${A}&deg; = <strong>${dp(area, 1)} cm&sup2;</strong>.</p>`,
		};
	});

	// 10. Angles of depression to two points, with diagram
	reg('advgeo-double-depression', 'Trigonometry', 'Elevation & depression', function (r) {
		const d1 = r.int(25, 40), d2 = d1 + r.int(10, 25);
		const AB = r.int(15, 60);
		const h = AB / (cot(d1) - cot(d2));
		const nb = h * cot(d2);
		return {
			marks: 4,
			text: `From the top of a vertical cliff, the angles of depression of two buoys A and B, in line with its base, are ${d1}&deg; and ${d2}&deg; respectively. The buoys are ${AB} m apart, with A further from the cliff.${br('i', 'Find the height of the cliff, correct to 1 decimal place.')}${br('ii', 'Find the distance from the base of the cliff to buoy B, correct to 1 decimal place.')}`,
			diagram: { type: 'elevation', ang1: `${d1}&#176;`, ang2: `${d2}&#176;`, far: true, h: 'h', p1: 'A', p2: 'B', top: 'T' },
			answer: multi([dp(h, 1), dp(nb, 1)], ['height (1 d.p.)', 'distance to B (1 d.p.)'], 0.06),
			solution: `<p>Angles of depression equal the angles of elevation from the buoys. If the height is h, then A is h&thinsp;cot ${d1}&deg; from the base and B is h&thinsp;cot ${d2}&deg; from it.</p>
<p>(i) h(cot ${d1}&deg; &minus; cot ${d2}&deg;) = ${AB}, so h = ${F.frac(AB, dp(cot(d1) - cot(d2), 4))} = <strong>${dp(h, 1)} m</strong>.</p>
<p>(ii) Distance to B = h&thinsp;cot ${d2}&deg; = <strong>${dp(nb, 1)} m</strong>.</p>`,
		};
	});

	// 11. Square pyramid: edge/base and face/base angles
	reg('advgeo-pyramid-angles', 'Trigonometry', '3D trigonometry', function (r) {
		const a = 2 * r.int(3, 8), H = r.int(5, 14);
		const halfDiag = a * Math.SQRT2 / 2;
		const edgeAng = degOf(Math.atan(H / halfDiag));
		const faceAng = degOf(Math.atan(H / (a / 2)));
		const slantEdge = Math.sqrt(H * H + halfDiag * halfDiag);
		return {
			marks: 5,
			text: `A right pyramid has a square base of side ${a} cm and vertical height ${H} cm. Give angles correct to 1 decimal place and the length to 2 decimal places.${br('i', 'Find the angle between a slant edge and the base.')}${br('ii', 'Find the angle between a triangular face and the base.')}${br('iii', 'Find the length of a slant edge.')}`,
			answer: multi([dp(edgeAng, 1), dp(faceAng, 1), dp(slantEdge, 2)], ['edge angle (1 d.p.)', 'face angle (1 d.p.)', 'slant edge (2 d.p.)'], 0.06),
			solution: `<p>The apex sits above the centre of the base. Half the base diagonal is ${F.frac(`${a}&radic;2`, 2)} = ${dp(halfDiag, 3)} cm; half a side is ${a / 2} cm.</p>
<p>(i) tan &theta; = ${H} / ${dp(halfDiag, 3)}, so the edge angle is <strong>${dp(edgeAng, 1)}&deg;</strong>.</p>
<p>(ii) tan &phi; = ${H} / ${a / 2}, so the face angle is <strong>${dp(faceAng, 1)}&deg;</strong>.</p>
<p>(iii) Slant edge = ${F.sqrt(`${H}<sup>2</sup> + ${dp(halfDiag * halfDiag, 2)}`)} = <strong>${dp(slantEdge, 2)} cm</strong>.</p>`,
		};
	});

	// 12. Cyclic quadrilateral with algebraic opposite angles — with diagram
	reg('advgeo-cyclic-algebra', 'Geometry', 'Angle chasing', function (r) {
		const aCo = r.int(2, 4), cCo = r.int(2, 4), bC = r.int(5, 25);
		const x0 = r.int(12, Math.floor((165 - bC) / (aCo + cCo)));
		const dC = 180 - (aCo + cCo) * x0 - bC;
		const angA = aCo * x0 + bC;
		let g;
		do { g = r.int(40, 140); } while (g === angA || g === 180 - angA);
		return {
			marks: 4,
			text: `ABCD is a cyclic quadrilateral. &ang;A = (${aCo}x ${signed(bC)})&deg;, &ang;C = (${cCo}x ${signed(dC)})&deg; and &ang;B = ${g}&deg;.${br('i', 'Find x.')}${br('ii', 'Find &ang;A.')}${br('iii', 'Find &ang;D.')}`,
			diagram: { type: 'cyclicQuad', labels: ['A', 'B', 'C', 'D'], angleLabels: [`(${aCo}x+${bC})&#176;`, `${g}&#176;`, `(${cCo}x${dC >= 0 ? '+' : '&minus;'}${Math.abs(dC)})&#176;`, 'y&#176;'] },
			answer: multi([x0, angA, 180 - g], ['x', 'angle A (degrees)', 'angle D (degrees)']),
			solution: `<p>(i) Opposite angles of a cyclic quadrilateral are supplementary: (${aCo}x ${signed(bC)}) + (${cCo}x ${signed(dC)}) = 180.</p>
<p>${aCo + cCo}x = ${180 - bC - dC}, so x = <strong>${x0}</strong>.</p>
<p>(ii) &ang;A = ${aCo}(${x0}) ${signed(bC)} = <strong>${angA}&deg;</strong>.</p>
<p>(iii) &ang;D = 180&deg; &minus; &ang;B = 180&deg; &minus; ${g}&deg; = <strong>${180 - g}&deg;</strong>.</p>`,
		};
	});

	// 13. Ratio in which the x-axis divides a segment (2022 MC4 style)
	reg('advgeo-axis-ratio', 'Coordinate Geometry', 'Distance & midpoint', function (r) {
		const u = r.int(1, 9), v = r.int(1, 9);
		const g = MG.gcd(u, v), m = u / g, n = v / g;
		let x1, x2;
		do { x1 = r.int(-6, 6); x2 = r.int(-6, 6); } while (x1 === x2);
		const px = (n * x1 + m * x2) / (m + n);
		return {
			marks: 3,
			text: `The point P lies on the x-axis and on the segment joining A${F.pt(x1, -u)} to B${F.pt(x2, v)}.${br('i', 'Find the ratio AP : PB in simplest whole-number form (enter the two numbers).')}${br('ii', 'Find the x-coordinate of P, correct to 2 decimal places.')}`,
			answer: multi([m, n, dp(px, 2)], ['ratio first number', 'ratio second number', 'x-coordinate of P (2 d.p.)'], 0.02),
			solution: `<p>(i) Crossing the x-axis means the y-values ${-u} and ${v} are divided in the ratio ${u} : ${v}, i.e. <strong>${m} : ${n}</strong>.</p>
<p>(ii) P = ${F.frac(`${n}(${x1}) + ${m}(${x2})`, `${m} + ${n}`)} = <strong>${dp(px, 2)}</strong>.</p>`,
		};
	});

	// 14. Rhombus: diagonals, area, interior angle
	reg('advgeo-rhombus-diagonals', 'Geometry', 'Quadrilateral properties', function (r) {
		const s = r.int(6, 13), p = 2 * r.int(2, s - 1); // shorter/one diagonal (even, p < 2s)
		const q = 2 * Math.sqrt(s * s - (p / 2) * (p / 2));
		const area = p * q / 2;
		const ang = 2 * degOf(Math.atan((q / 2) / (p / 2)));
		return {
			marks: 5,
			text: `A rhombus has side length ${s} cm and one diagonal of length ${p} cm.${br('i', 'Find the other diagonal, correct to 2 decimal places.')}${br('ii', 'Find the area, correct to 1 decimal place.')}${br('iii', 'Find the interior angle through which the given diagonal passes, correct to 1 decimal place.')}`,
			answer: multi([dp(q, 2), dp(area, 1), dp(ang, 1)], ['diagonal (2 d.p.)', 'area (1 d.p.)', 'angle (1 d.p.)'], 0.06),
			solution: `<p>The diagonals of a rhombus bisect each other at right angles, forming four right triangles with hypotenuse ${s} and one leg ${p / 2}.</p>
<p>(i) Half the other diagonal = ${F.sqrt(`${s}<sup>2</sup> &minus; ${(p / 2) * (p / 2)}`)}, so it is <strong>${dp(q, 2)} cm</strong>.</p>
<p>(ii) Area = ${F.frac(1, 2)} d&#8321;d&#8322; = ${F.frac(1, 2)} &times; ${p} &times; ${dp(q, 2)} = <strong>${dp(area, 1)} cm&sup2;</strong>.</p>
<p>(iii) Half the angle satisfies tan = ${dp(q / 2, 3)} / ${p / 2}; doubling gives <strong>${dp(ang, 1)}&deg;</strong>.</p>`,
		};
	});

	// 15. Semicircle function y = k + sqrt(r² − (x−h)²) (2022 D(f) style)
	reg('advgeo-semicircle-function', 'Coordinate Geometry', 'Circles', function (r) {
		const h = r.nonzeroInt(-5, 5), k = r.nonzeroInt(-5, 5), rr = r.int(2, 6);
		return {
			marks: 3,
			text: `Consider the function y = ${k} + ${F.sqrt(`${rr * rr} &minus; (x ${signed(-h)})<sup>2</sup>`)}, an upper semicircle.${br('i', 'Find the smallest x in its domain.')}${br('ii', 'Find the largest x in its domain.')}${br('iii', 'Find the maximum value of y.')}`,
			answer: multi([h - rr, h + rr, k + rr], ['smallest x', 'largest x', 'maximum y']),
			solution: `<p>The graph is the top half of the circle (x ${signed(-h)})&sup2; + (y ${signed(-k)})&sup2; = ${rr * rr}, centre ${F.pt(h, k)} and radius ${rr}.</p>
<p>(i) Domain starts at ${h} &minus; ${rr} = <strong>${h - rr}</strong>.</p>
<p>(ii) Domain ends at ${h} + ${rr} = <strong>${h + rr}</strong>.</p>
<p>(iii) The top of the semicircle is at y = ${k} + ${rr} = <strong>${k + rr}</strong>.</p>`,
		};
	});

	// 16. Tangents from an external point: length and angles — with diagram
	reg('advgeo-tangent-pair-angle', 'Geometry', 'Circle theorems', function (r) {
		const rr = r.int(3, 8), d = rr + r.int(3, 9);
		const tan1 = Math.sqrt(d * d - rr * rr);
		const half = degOf(Math.asin(rr / d));
		return {
			marks: 4,
			text: `From an external point P, two tangents are drawn to a circle with centre O and radius ${rr} cm, touching it at T and T&prime;. The distance OP is ${d} cm.${br('i', 'Find the length of the tangent PT, correct to 2 decimal places.')}${br('ii', 'Find &ang;OPT, correct to 1 decimal place.')}${br('iii', 'Find the angle between the two tangents, correct to 1 decimal place.')}`,
			diagram: { type: 'tangentRadius', angleLabel: '&#952;' },
			answer: multi([dp(tan1, 2), dp(half, 1), dp(2 * half, 1)], ['PT (2 d.p.)', 'angle OPT (1 d.p.)', 'angle TPT&prime; (1 d.p.)'], 0.06),
			solution: `<p>A tangent is perpendicular to the radius at the point of contact, so &triangle;OTP is right-angled at T.</p>
<p>(i) PT = ${F.sqrt(`${d}<sup>2</sup> &minus; ${rr}<sup>2</sup>`)} = <strong>${dp(tan1, 2)} cm</strong>.</p>
<p>(ii) sin &ang;OPT = ${F.frac(rr, d)}, so &ang;OPT = <strong>${dp(half, 1)}&deg;</strong>.</p>
<p>(iii) By symmetry, OP bisects the angle between the tangents: 2 &times; ${dp(half, 1)}&deg; = <strong>${dp(2 * half, 1)}&deg;</strong>.</p>`,
		};
	});
})();
