// Hard geometry + extra Boss chains: multi-theorem, multi-part questions.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const rad = MG.degToRad;
	const dp = (x, d) => MG.round(x, d);
	const add = (id, topic, subtopic, difficulty, gen) => G.push({ id, topic, subtopic, difficulty: difficulty - 1, gen });
	const num = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const deg = (x) => `${x}&deg;`;
	const br = (i, s) => `<br><strong>(${i})</strong> ${s}`;
	const DEG = 180 / Math.PI;

	// =====================================================================
	// HARD GEOMETRY
	// =====================================================================

	// Power of a point: chords, secants, tangent-secant
	add('geoh-power-point', 'Geometry', 'Power of a point', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			let p, q, s;
			do { p = r.int(2, 9); q = r.int(2, 9); s = r.int(2, 12); } while ((p * q) % s !== 0 || s === p * q);
			const ans = p * q / s;
			return {
				marks: 3,
				text: `Two chords AB and CD intersect at P inside a circle. AP = ${p} cm, PB = ${q} cm and CP = ${s} cm.${br('i', 'Show that triangles APC and DPB are similar, stating the equal angles.')}${br('ii', 'Hence derive AP &times; PB = CP &times; PD and find PD.')}`,
				answer: num(ans, 'PD (cm)'),
				solution: `<p>Angles CAB and CDB stand on the same arc CB, so they are equal; the vertically opposite angles at P are also equal. Hence triangles APC and DPB are similar.</p>
<p>Matching sides: ${F.frac('AP', 'DP')} = ${F.frac('CP', 'BP')}, which rearranges to the intersecting-chords rule AP &times; PB = CP &times; PD.</p>
<p>${p} &times; ${q} = ${s} &times; PD, so PD = ${F.frac(String(p * q), String(s))}.</p>
<p><strong>PD = ${p * q / s} cm</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const k = r.int(1, 3), u = r.int(1, 2), v = r.int(u + 1, 4);
			const pa = k * u * u, pb = k * v * v, chord = pb - pa, pt = k * u * v;
			return {
				marks: 4,
				text: `From an external point P, PT is tangent to a circle at T. A secant from P meets the circle at A and then B, where PA = ${pa} cm and AB = ${chord} cm.${br('i', 'Show that triangles PTA and PBT are similar.')}${br('ii', 'Hence show that PT&sup2; = PA &times; PB and find PT.')}`,
				answer: num(pt, 'PT (cm)'),
				solution: `<p>The tangent-chord angle PTA equals the angle TBA in the alternate segment, and angle P is shared, so triangles PTA and PBT are similar.</p>
<p>Hence ${F.frac('PT', 'PB')} = ${F.frac('PA', 'PT')}, giving PT<sup>2</sup> = PA &times; PB.</p>
<p>PB = ${pa} + ${chord} = ${pb}, so PT<sup>2</sup> = ${pa} &times; ${pb} = ${pa * pb}.</p>
<p><strong>PT = ${pt} cm</strong>.</p>`,
			};
		}
		let pa, pb, pc;
		do { pa = r.int(2, 8); pb = pa + r.int(2, 10); pc = r.int(2, 8); } while ((pa * pb) % pc !== 0 || pa * pb / pc <= pc);
		const pd = pa * pb / pc;
		return {
			marks: 4,
			text: `Two secants from an external point P meet a circle at A then B, and C then D. PA = ${pa} cm, PB = ${pb} cm and PC = ${pc} cm.${br('i', 'Show that triangles PAC and PDB are similar.')}${br('ii', 'Hence obtain the secant-product relationship and find PD.')}`,
			answer: num(pd, 'PD (cm)'),
			solution: `<p>ABDC is a cyclic quadrilateral, so &ang;PAC (exterior angle) equals &ang;CDB &mdash; and angle P is shared, making triangles PAC and PDB similar.</p>
<p>This gives the secant-secant rule PA &times; PB = PC &times; PD.</p>
<p>${pa} &times; ${pb} = ${pc} &times; PD, so PD = ${F.frac(String(pa * pb), String(pc))}.</p>
<p><strong>PD = ${pd} cm</strong>.</p>`,
		};
	});

	// Alternate segment theorem in combination
	add('geoh-alt-segment', 'Geometry', 'Alternate segment & tangents', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			let t, g;
			do { t = r.int(30, 70); g = r.int(30, 70); } while (t + g > 145);
			const ans = 180 - t - g;
			return {
				marks: 3,
				text: `A tangent touches a circle at A. Chord AB makes an angle of ${deg(t)} with the tangent, while C on the major arc satisfies &ang;ABC = ${deg(g)}.${br('i', 'Use the alternate segment theorem to state &ang;ACB.')}${br('ii', 'Hence find &ang;BAC.')}`,
				answer: num(ans, 'angle BAC (degrees)'),
				solution: `<p>By the alternate segment theorem, the angle between the tangent and chord AB equals the inscribed angle in the alternate segment: &ang;ACB = ${deg(t)}.</p>
<p>Now use the angle sum of triangle ABC.</p>
<p>&ang;BAC = 180&deg; &minus; ${deg(t)} &minus; ${deg(g)}.</p>
<p><strong>&ang;BAC = ${ans}&deg;</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const P = 2 * r.int(15, 40); // even 30..80
			const ans = (180 - P) / 2;
			return {
				marks: 4,
				text: `Tangents from P touch a circle at A and B, with &ang;APB = ${deg(P)}. Point C lies on the major arc AB.${br('i', 'Show that triangle APB is isosceles and find &ang;PAB.')}${br('ii', 'Hence, using the alternate segment theorem, find &ang;ACB.')}`,
				diagram: { type: 'tangentRadius' },
				answer: num(ans, 'angle ACB (degrees)'),
				solution: `<p>PA = PB (equal tangents), so triangle APB is isosceles.</p>
<p>&ang;PAB = &ang;PBA = ${F.frac(`180 &minus; ${P}`, '2')} = ${(180 - P) / 2}&deg;.</p>
<p>&ang;PAB is the angle between the tangent at A and the chord AB, so by the alternate segment theorem &ang;ACB = &ang;PAB.</p>
<p><strong>&ang;ACB = ${ans}&deg;</strong>.</p>`,
			};
		}
		const c = 2 * r.int(30, 75); // even 60..150
		const ans = c / 2;
		return {
			marks: 3,
			text: `A and B lie on a circle with centre O, where &ang;AOB = ${deg(c)}. A tangent is drawn at A.${br('i', 'Show that an angle at the circumference standing on the same minor arc AB is half &ang;AOB.')}${br('ii', 'Hence find the acute angle between the tangent and chord AB.')}`,
			diagram: { type: 'angleAtCentre', centralLabel: deg(c) },
			answer: num(ans, 'angle (degrees)'),
			solution: `<p>The angle at the centre is twice the angle at the circumference: an inscribed angle on chord AB (major arc) is ${F.frac(String(c), '2')} = ${c / 2}&deg;.</p>
<p>By the alternate segment theorem, the tangent-chord angle at A equals that inscribed angle.</p>
<p><strong>The angle is ${ans}&deg;</strong>.</p>`,
		};
	});

	// Cyclic quad + centre chase (three linked parts)
	add('geoh-cyclic-chase', 'Geometry', 'Multi-step angle chasing', 4, function (r) {
		const d = r.int(50, 85);
		return {
			marks: 5,
			text: `ABCD is a cyclic quadrilateral on a circle with centre O, and &ang;ADC = ${deg(d)}.${br('i', 'Find &ang;ABC.')}${br('ii', 'Find the (non-reflex) angle &ang;AOC.')}${br('iii', 'Find &ang;OAC.')}`,
			diagram: { type: 'cyclicQuad', angleLabels: ['', '', '', deg(d)] },
			answer: multi([180 - d, 2 * d, 90 - d], ['&ang;ABC (degrees)', '&ang;AOC (degrees)', '&ang;OAC (degrees)']),
			solution: `<p>(i) Opposite angles of a cyclic quadrilateral add to 180&deg;: &ang;ABC = 180&deg; &minus; ${deg(d)} = <strong>${180 - d}&deg;</strong>.</p>
<p>(ii) &ang;ADC is an inscribed angle on chord AC, so the central angle on the same arc is twice it: &ang;AOC = 2 &times; ${deg(d)} = <strong>${2 * d}&deg;</strong>.</p>
<p>(iii) Triangle OAC is isosceles because OA = OC (radii).</p>
<p>&ang;OAC = ${F.frac(`180 &minus; ${2 * d}`, '2')} = <strong>${90 - d}&deg;</strong>.</p>`,
		};
	});

	// Areas and ratios
	add('geoh-area-ratio', 'Geometry', 'Areas & ratios', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			let p, q;
			do { p = r.int(2, 5); q = r.int(3, 8); } while (p >= q || q % p === 0 && q / p === 1);
			const t = r.int(2, 6);
			const small = t * p * p, bigA = t * q * q;
			return {
				marks: 3,
				text: `Two similar triangles have corresponding sides in the ratio ${p} : ${q}. The smaller has area ${small} cm&sup2;.${br('i', `Show that their areas are in the ratio ${p * p} : ${q * q}.`)}${br('ii', 'Hence find the area of the larger triangle.')}`,
				diagram: { type: 'similarTriangles', a: 3, b: 4, c: 5, k: q / p, sideLabels1: [`${p}`, '', ''], sideLabels2: [`${q}`, '', ''] },
				answer: num(bigA, 'area (cm&sup2;)'),
				solution: `<p>When lengths scale by a factor k, areas scale by k<sup>2</sup>.</p>
<p>The area ratio is ${p}<sup>2</sup> : ${q}<sup>2</sup> = ${p * p} : ${q * q}.</p>
<p>Larger area = ${small} &times; ${F.frac(String(q * q), String(p * p))}.</p>
<p><strong>= ${bigA} cm&sup2;</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const m = r.int(1, 4), n = r.int(1, 4), t = r.int(3, 9);
			const total = t * (m + n), part = t * m;
			return {
				marks: 3,
				text: `In triangle ABC, D lies on BC with BD : DC = ${m} : ${n}. The area of ABC is ${total} cm&sup2;.${br('i', 'Show that areas ABD : ADC = BD : DC by comparing their perpendicular heights.')}${br('ii', 'Hence find the area of triangle ABD.')}`,
				answer: num(part, 'area (cm&sup2;)'),
				solution: `<p>Triangles ABD and ADC share the apex A, so they have the same height onto line BC.</p>
<p>Their areas are therefore in the same ratio as their bases: ${m} : ${n}.</p>
<p>Area ABD = ${F.frac(String(m), String(m + n))} &times; ${total}.</p>
<p><strong>= ${part} cm&sup2;</strong>.</p>`,
			};
		}
		let a2, b2;
		do { a2 = r.int(2, 5); b2 = r.int(3, 9); } while (a2 >= b2);
		const t = r.int(1, 4);
		const areaTop = t * a2 * a2, areaBot = t * b2 * b2;
		return {
			marks: 4,
			text: `In trapezium ABCD, AB &parallel; DC, AB = ${a2} cm and DC = ${b2} cm. Its diagonals meet at O, and area(AOB) = ${areaTop} cm&sup2;.${br('i', 'Show that triangles AOB and COD are similar.')}${br('ii', 'Hence find area(COD).')}`,
			diagram: { type: 'quad', pts: [[0, 3], [a2, 3], [b2, 0], [0, 0]], sideLabels: [`${a2} cm`, '', `${b2} cm`, ''], diagonals: 'both' },
			answer: num(areaBot, 'area (cm&sup2;)'),
			solution: `<p>AB &parallel; DC gives equal alternate angles at the diagonals, so triangles AOB and COD are similar (AA).</p>
<p>The similarity ratio is AB : DC = ${a2} : ${b2}, so areas scale by ${a2 * a2} : ${b2 * b2}.</p>
<p>Area COD = ${areaTop} &times; ${F.frac(String(b2 * b2), String(a2 * a2))}.</p>
<p><strong>= ${areaBot} cm&sup2;</strong>.</p>`,
		};
	});

	// Midpoints: medial triangle and Varignon parallelogram
	add('geoh-midpoints', 'Geometry', 'Midpoints & parallels', 3, function (r) {
		if (r.next() < 0.5) {
			const a = 2 * r.int(3, 9), b = 2 * r.int(3, 9), c = 2 * r.int(Math.abs(a - b) / 2 + 1, (a + b) / 2 - 1);
			const per = (a + b + c) / 2;
			return {
				marks: 3,
				text: `Triangle ABC has side lengths ${a} cm, ${b} cm and ${c} cm. The three side midpoints are joined.${br('i', 'Show that each side of the medial triangle is parallel to, and half the length of, a side of ABC.')}${br('ii', 'Hence find the medial triangle&rsquo;s perimeter.')}`,
				answer: num(per, 'perimeter (cm)'),
				solution: `<p>A segment joining the midpoints of two sides is parallel to the third side and half its length (midsegment theorem).</p>
<p>So the medial triangle has sides ${a / 2}, ${b / 2} and ${c / 2} cm.</p>
<p>Perimeter = ${a / 2} + ${b / 2} + ${c / 2}.</p>
<p><strong>= ${per} cm</strong>.</p>`,
			};
		}
		const p = r.int(6, 16), q = r.int(6, 16), A = 2 * r.int(10, 60);
		const mode = r.pick([0, 1]);
		if (mode === 0) {
			return {
				marks: 4,
				text: `A quadrilateral has diagonals of lengths ${p} cm and ${q} cm. Its side midpoints are joined in order.${br('i', 'Use the midpoint theorem to show that the new quadrilateral is a parallelogram.')}${br('ii', 'Hence find its perimeter.')}`,
				answer: num(p + q, 'perimeter (cm)'),
				solution: `<p>In each triangle cut off by a diagonal, the segment joining two midpoints is parallel to that diagonal and half its length.</p>
<p>So the midpoint quadrilateral has two sides of length ${p}/2 = ${p / 2} parallel to one diagonal, and two of length ${q}/2 = ${q / 2} parallel to the other &mdash; opposite sides parallel makes it a parallelogram.</p>
<p>Perimeter = 2(${p / 2} + ${q / 2}).</p>
<p><strong>= ${p + q} cm</strong>.</p>`,
			};
		}
		return {
			marks: 4,
			text: `A quadrilateral has area ${A} cm&sup2;. Its side midpoints are joined in order.${br('i', 'Show, using a diagonal and the midpoint theorem, that the midpoint parallelogram occupies half the original area.')}${br('ii', 'Hence find its area.')}`,
			answer: num(A / 2, 'area (cm&sup2;)'),
			solution: `<p>Each corner triangle of the quadrilateral is similar to the triangle cut off by a diagonal with ratio 1 : 2, so its area is one quarter of that half of the quadrilateral.</p>
<p>The four corner triangles together cover a quarter + a quarter of each half &mdash; in total half of the quadrilateral.</p>
<p>So the midpoint parallelogram is the other half: ${A} &divide; 2.</p>
<p><strong>= ${A / 2} cm&sup2;</strong>.</p>`,
		};
	});

	// Polygon angles: find n
	add('geoh-polygon-n', 'Geometry', 'Polygon angles', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			const n = r.pick([5, 8, 9, 10, 12, 15, 18, 20]);
			const interior = 180 - 360 / n;
			return {
				marks: 3,
				text: `Each interior angle of a regular polygon is ${interior}&deg;.${br('i', 'Find its exterior angle and show that the exterior angles sum to 360&deg;.')}${br('ii', 'Hence find the number of sides.')}`,
				answer: num(n, 'number of sides'),
				solution: `<p>Each exterior angle is 180&deg; &minus; ${interior}&deg; = ${360 / n}&deg;.</p>
<p>The exterior angles of any polygon add to 360&deg;.</p>
<p>n = ${F.frac('360', String(360 / n))}.</p>
<p><strong>n = ${n}</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const n = r.pick([7, 9, 11, 13, 14, 16, 17, 19]);
			const S = 180 * (n - 2);
			return {
				marks: 3,
				text: `The interior angles of a polygon add to ${S}&deg;.${br('i', 'State the interior-angle sum for an n-sided polygon.')}${br('ii', 'Hence find n.')}`,
				answer: num(n, 'number of sides'),
				solution: `<p>The interior angle sum of an n-sided polygon is 180(n &minus; 2) degrees.</p>
<p>180(n &minus; 2) = ${S}, so n &minus; 2 = ${S / 180}.</p>
<p><strong>n = ${n}</strong>.</p>`,
			};
		}
		const n = r.pick([5, 6, 8, 9, 10, 12]);
		const known = 180 - 360 / n;
		const m = r.int(3, 5);
		const sumOthers = 180 * (m + 2 - 2) - known; // (m+2)-gon with one angle known
		return {
			marks: 4,
			text: `A non-regular ${m + 2}-gon has one interior angle equal to an interior angle of a regular ${n}-gon.${br('i', 'Find that regular-polygon angle from its exterior angle.')}${br('ii', `Hence find the sum of the remaining ${m + 1} interior angles.`)}`,
			answer: num(sumOthers, 'sum (degrees)'),
			solution: `<p>The interior angle of a regular ${n}-gon: each exterior angle is 360/${n} = ${360 / n}&deg;, so the interior angle is ${known}&deg;.</p>
<p>The angle sum of a ${m + 2}-sided polygon is 180(${m + 2} &minus; 2) = ${180 * m}&deg;.</p>
<p>Remaining sum = ${180 * m} &minus; ${known}.</p>
<p><strong>= ${sumOthers}&deg;</strong>.</p>`,
		};
	});

	// Common tangent to touching circles
	add('geoh-tangent-circles', 'Geometry', 'Tangent circles', 4, function (r) {
		const pair = r.pick([[3, 1], [3, 2], [4, 1], [4, 3], [5, 2], [5, 3]]);
		const k = r.int(1, 3);
		const R = k * pair[0] * pair[0], rr = k * pair[1] * pair[1];
		const L = 2 * k * pair[0] * pair[1];
		if (r.next() < 0.5) {
			return {
				marks: 4,
				text: `Two circles of radii ${R} cm and ${rr} cm touch externally. A direct common tangent touches them at A and B.${br('i', 'Show that the centres and the two radii form a right triangle with hypotenuse R + r and one leg R &minus; r.')}${br('ii', 'Hence show that AB&sup2; = 4Rr and find AB.')}`,
				diagram: { type: 'circles2', r1: R, r2: rr, touch: 'external', r1Label: `${R} cm`, r2Label: `${rr} cm`, tangentLine: true },
				answer: num(L, 'AB (cm)'),
				solution: `<p>The centres are ${R} + ${rr} = ${R + rr} cm apart (external touching). Both radii meet the tangent at 90&deg;, so OA &parallel; O'B.</p>
<p>Drawing a line through O' parallel to AB creates a right triangle with hypotenuse ${R + rr} and one leg ${R} &minus; ${rr} = ${R - rr}.</p>
<p>AB<sup>2</sup> = (${R + rr})<sup>2</sup> &minus; (${R - rr})<sup>2</sup> = ${(R + rr) ** 2 - (R - rr) ** 2} (this always simplifies to 4Rr).</p>
<p><strong>AB = ${L} cm</strong>.</p>`,
			};
		}
		return {
			marks: 4,
			text: `Two circles touch externally. Their direct common tangent meets them at A and B, with AB = ${L} cm. The larger radius is ${R} cm.${br('i', 'Show, by forming a right triangle between the centres, that AB&sup2; = 4Rr.')}${br('ii', 'Hence find the smaller radius r.')}`,
			answer: num(rr, 'radius (cm)'),
			solution: `<p>With centres ${'O'} and O&prime;, the distance OO&prime; = R + r, and the radii to A and B are parallel (both &perp; AB).</p>
<p>A right triangle with hypotenuse R + r and legs AB and R &minus; r gives AB<sup>2</sup> = (R + r)<sup>2</sup> &minus; (R &minus; r)<sup>2</sup> = 4Rr.</p>
<p>${L}<sup>2</sup> = 4 &times; ${R} &times; r, so r = ${F.frac(String(L * L), String(4 * R))}.</p>
<p><strong>r = ${rr} cm</strong>.</p>`,
		};
	});

	// Inscribed figures with exact relationships
	add('geoh-inscribed', 'Geometry', 'Inscribed figures', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			const R = r.int(3, 12);
			const s = 2 * R / Math.sqrt(5);
			return {
				marks: 4,
				text: `A square is inscribed in a semicircle of radius ${R} cm, with its base on the diameter and both upper vertices on the arc.${br('i', 'Show that its side s satisfies (s/2)&sup2; + s&sup2; = ' + R + '&sup2;.')}${br('ii', 'Find s exactly in radical form, then correct to 2 decimal places.')}`,
				answer: num(dp(s, 2), 'side (cm)', 0.006),
				solution: `<p>Let the side be s. By symmetry, a top corner sits at horizontal distance s/2 from the centre and height s.</p>
<p>That corner lies on the arc: (s/2)<sup>2</sup> + s<sup>2</sup> = ${R}<sup>2</sup>.</p>
<p>${F.frac('5s<sup>2</sup>', '4')} = ${R * R}, so s<sup>2</sup> = ${F.frac(String(4 * R * R), '5')} = ${dp(4 * R * R / 5, 3)}.</p>
<p><strong>s = ${dp(s, 2)} cm</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const R = r.int(3, 12);
			const side = R * Math.sqrt(3);
			const area = 3 * Math.sqrt(3) / 4 * R * R;
			return {
				marks: 4,
				text: `An equilateral triangle is inscribed in a circle of radius ${R} cm.${br('i', 'Show that each side subtends 120&deg; at the centre and hence has exact length ' + R + '&radic;3 cm.')}${br('ii', 'Find its side length and area, both correct to 2 decimal places.')}`,
				diagram: { type: 'polygon', n: 3, inscribed: true, radiusLabel: `${R} cm`, centralAngleLabel: '120&deg;' },
				answer: multi([dp(side, 2), dp(area, 2)], ['side (cm)', 'area (cm&sup2;)'], 0.006),
				solution: `<p>Each side subtends ${deg(120)} at the centre. Splitting that isosceles triangle in half: half a side = ${R} sin 60&deg;.</p>
<p>Side = 2 &times; ${R} sin 60&deg; = ${R}&radic;3 = <strong>${dp(side, 2)} cm</strong>.</p>
<p>Area = 3 &times; ${F.frac(1, 2)}(${R})<sup>2</sup> sin 120&deg; (three centre triangles).</p>
<p>= <strong>${dp(area, 2)} cm&sup2;</strong>.</p>`,
			};
		}
		const a = r.int(4, 14);
		const rIn = a / (2 * Math.sqrt(3));
		return {
			marks: 4,
			text: `A circle is inscribed in an equilateral triangle of side ${a} cm.${br('i', 'Show that an angle bisector and a perpendicular radius form a 30&deg;&ndash;60&deg;&ndash;90&deg; triangle.')}${br('ii', 'Hence express the radius exactly and find it correct to 2 decimal places.')}`,
			answer: num(dp(rIn, 2), 'radius (cm)', 0.006),
			solution: `<p>The incentre lies above the midpoint of a side. Joining it to a vertex bisects the 60&deg; angle into 30&deg;.</p>
<p>In the right triangle formed: tan 30&deg; = ${F.frac('r', String(a / 2))}.</p>
<p>r = ${dp(a / 2, 2)} &times; tan 30&deg; = ${F.frac(String(a), '2&radic;3')}.</p>
<p><strong>r = ${dp(rIn, 2)} cm</strong>.</p>`,
		};
	});

	// Trapezium diagonal ratios
	add('geoh-trapezium', 'Geometry', 'Similarity in trapezia', 3, function (r) {
		let a, b;
		do { a = r.int(2, 9); b = r.int(3, 12); } while (a >= b);
		if (r.next() < 0.5) {
			const t = r.int(2, 5);
			const L = (a + b) * t, ao = a * t;
			return {
				marks: 4,
				text: `In trapezium ABCD, AB &parallel; DC, AB = ${a} cm and DC = ${b} cm. Diagonal AC has length ${L} cm and the diagonals meet at O.${br('i', 'Show that triangles AOB and COD are similar.')}${br('ii', 'Hence show that AO : OC = AB : DC and find AO.')}`,
				diagram: { type: 'quad', pts: [[0, 3], [a, 3], [b, 0], [0, 0]], sideLabels: [`${a} cm`, '', `${b} cm`, ''], diagonals: 'both', diagLabels: [`${L} cm`, ''] },
				answer: num(ao, 'AO (cm)'),
				solution: `<p>Triangles AOB and COD are similar (AA, from the parallel sides), with ratio AB : DC = ${a} : ${b}.</p>
<p>So AO : OC = ${a} : ${b}, meaning O divides AC in that ratio.</p>
<p>AO = ${F.frac(String(a), String(a + b))} &times; ${L}.</p>
<p><strong>AO = ${ao} cm</strong>.</p>`,
			};
		}
		const u = r.int(2, 6), t = r.int(2, 5);
		const AB = a * u, ao = a * t, oc = b * t, CD = b * u;
		return {
			marks: 4,
			text: `In trapezium ABCD, AB &parallel; DC and its diagonals meet at O. AO = ${ao} cm, OC = ${oc} cm and AB = ${AB} cm.${br('i', 'Show that triangles AOB and COD are similar.')}${br('ii', 'Hence find DC.')}`,
			diagram: { type: 'quad', pts: [[0, 3], [a, 3], [b, 0], [0, 0]], sideLabels: [`${AB} cm`, '', '', ''], diagonals: 'both' },
			answer: num(CD, 'DC (cm)'),
			solution: `<p>Triangles AOB and COD are similar because AB &parallel; DC (alternate angles, plus vertically opposite angles at O).</p>
<p>The similarity ratio is AO : OC = ${ao} : ${oc} = ${a} : ${b}.</p>
<p>So DC = AB &times; ${F.frac(String(oc), String(ao))} = ${AB} &times; ${F.frac(String(b), String(a))}.</p>
<p><strong>DC = ${CD} cm</strong>.</p>`,
		};
	});

	// Isosceles chains
	add('geoh-isosceles-chain', 'Geometry', 'Isosceles chains', 3, function (r) {
		if (r.next() < 0.5) {
			const a = 2 * r.int(10, 17); // a < 36 degrees is required for D to lie on segment AC
			const base = (180 - a) / 2; // angle ABD = base - a
			return {
				marks: 4,
				text: `In triangle ABC, AB = AC and &ang;BAC = ${deg(a)}. Point D lies on AC and BD = BC.${br('i', 'Find the base angles of ABC and show that &ang;DBC = &ang;BAC.')}${br('ii', 'Hence find &ang;ABD.')}`,
				answer: num(base - a, 'angle ABD (degrees)'),
				solution: `<p>AB = AC, so &ang;ABC = &ang;ACB = ${F.frac(`180 &minus; ${a}`, '2')} = ${base}&deg;.</p>
<p>BD = BC makes triangle BDC isosceles: &ang;BDC = &ang;BCD = ${base}&deg;.</p>
<p>So &ang;DBC = 180&deg; &minus; 2 &times; ${base}&deg; = ${180 - 2 * base}&deg; = ${a}&deg;.</p>
<p>&ang;ABD = &ang;ABC &minus; &ang;DBC = ${base}&deg; &minus; ${a}&deg; = <strong>${base - a}&deg;</strong>.</p>`,
			};
		}
		const b = r.int(25, 55);
		const ans = 180 - 3 * b;
		return {
			marks: 4,
			text: `In triangle ABC, AB = AC and &ang;ABC = ${deg(b)}. Point D lies on BC and AD = DC.${br('i', 'Show that &ang;DAC = &ang;DCA and express both in terms of the given angle.')}${br('ii', 'Hence find &ang;BAD.')}`,
			answer: num(ans, 'angle BAD (degrees)'),
			solution: `<p>AB = AC gives &ang;ACB = &ang;ABC = ${b}&deg;.</p>
<p>AD = DC makes triangle ADC isosceles: &ang;DAC = &ang;DCA = ${b}&deg;, so &ang;ADC = ${180 - 2 * b}&deg; and hence &ang;ADB = ${2 * b}&deg;.</p>
<p>In triangle ABD: &ang;BAD = 180&deg; &minus; ${b}&deg; &minus; ${2 * b}&deg;.</p>
<p><strong>&ang;BAD = ${ans}&deg;</strong>.</p>`,
		};
	});

	// Chord distances inside one circle
	add('geoh-chord-distance', 'Geometry', 'Chords & distances', 3, function (r) {
		const T = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [20, 21, 29], [10, 24, 26], [15, 20, 25]]);
		if (r.next() < 0.5) {
			const [d, half, R] = T;
			return {
				marks: 3,
				text: `A chord of a circle of radius ${R} cm is ${d} cm from the centre.${br('i', 'Show that the perpendicular from the centre bisects the chord.')}${br('ii', 'Use Pythagoras to find the exact chord length.')}`,
				answer: num(2 * half, 'chord (cm)'),
				solution: `<p>The perpendicular from the centre bisects the chord, forming a right triangle: radius as hypotenuse, distance ${d} as one leg.</p>
<p>Half-chord = &radic;(${R}<sup>2</sup> &minus; ${d}<sup>2</sup>) = &radic;${R * R - d * d} = ${half}.</p>
<p>Chord = 2 &times; ${half}.</p>
<p><strong>= ${2 * half} cm</strong>.</p>`,
			};
		}
		const [dd, half, R] = T;
		return {
			marks: 4,
			text: `A chord of length ${2 * half} cm lies ${dd} cm from a circle&rsquo;s centre. A congruent parallel chord lies the same distance away on the opposite side.${br('i', 'Show that the perpendicular from the centre bisects each chord.')}${br('ii', 'Find the distance between the chords.')}${br('iii', 'Hence find the radius exactly.')}`,
			answer: multi([2 * dd, R], ['distance between chords (cm)', 'radius (cm)']),
			solution: `<p>Half the chord is ${half} cm, and the perpendicular from the centre to the chord is ${dd} cm.</p>
<p>Radius: &radic;(${half}<sup>2</sup> + ${dd}<sup>2</sup>) = &radic;${half * half + dd * dd} = ${R} cm.</p>
<p>The two parallel chords sit ${dd} cm either side of the centre.</p>
<p><strong>Distance between chords = ${2 * dd} cm; radius = ${R} cm</strong>.</p>`,
		};
	});

	// =====================================================================
	// NEW BOSS CHAINS (difficulty 4)
	// =====================================================================
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 3, gen });

	boss('boss-triangle-centres', 'Heron + incircle + circumcircle', function (r) {
		const T = r.pick([[6, 8, 10, 24], [5, 12, 13, 30], [9, 12, 15, 54], [8, 15, 17, 60], [13, 14, 15, 84], [12, 16, 20, 96], [10, 24, 26, 120], [15, 20, 25, 150], [7, 15, 20, 42], [11, 13, 20, 66]]);
		const kk = r.pick([1, 1, 2]);
		const [x, y, z] = [T[0] * kk, T[1] * kk, T[2] * kk];
		const A = T[3] * kk * kk;
		const s = (x + y + z) / 2;
		const rIn = A / s, Rc = x * y * z / (4 * A);
		return {
			marks: 6,
			text: `A triangle has sides ${x} cm, ${y} cm and ${z} cm.${br('i', 'Find its area.')}${br('ii', 'Find the radius of its inscribed circle, correct to 2 decimal places where necessary.')}${br('iii', 'Find the radius of its circumscribed circle, correct to 2 decimal places where necessary.')}`,
			diagram: { type: 'triangle', a: x, b: y, c: z, sideLabels: [`${x} cm`, `${y} cm`, `${z} cm`] },
			answer: multi([A, dp(rIn, 2), dp(Rc, 2)], ['area (cm&sup2;)', 'inradius (cm)', 'circumradius (cm)'], 0.006),
			solution: `<p>(i) ${x * x + y * y === z * z ? `${x}<sup>2</sup> + ${y}<sup>2</sup> = ${z}<sup>2</sup>, so the triangle is right-angled and area = ${F.frac(1, 2)}(${x})(${y}) = ${A} cm&sup2;.` : `Heron's formula with s = ${s}: area = &radic;(${s}(${s - x})(${s - y})(${s - z})) = ${A} cm&sup2;.`}</p>
<p>(ii) Splitting the triangle from the incentre gives area = rs, so r = ${F.frac(String(A), String(s))} = <strong>${dp(rIn, 2)} cm</strong>.</p>
<p>(iii) The sine rule gives 2R = a/sin A; combining with area = ${F.frac(1, 2)}bc sin A yields R = ${F.frac('abc', '4 &times; area')}.</p>
<p>R = ${F.frac(`${x} &times; ${y} &times; ${z}`, `4 &times; ${A}`)} = <strong>${dp(Rc, 2)} cm</strong>. (Area = <strong>${A} cm&sup2;</strong>.)</p>`,
		};
	});

	boss('boss-ferris', 'Trig modelling', function (r) {
		const R = r.int(5, 12), C = R + r.int(1, 3), T = r.pick([6, 12]);
		const t0 = r.pick([T / 6, T / 3]);
		const h0 = C - R * Math.cos(rad(360 * t0 / T));
		return {
			marks: 6,
			text: `A Ferris wheel of radius ${R} m turns at a steady rate, completing one revolution every ${T} minutes. Its axle is ${C} m above the ground and a passenger starts at the lowest point at t = 0, so their height is h = ${C} &minus; ${R} cos(${360 / T}t)&deg; metres after t minutes.${br('i', 'Find the maximum height reached.')}${br('ii', `Find the passenger's height at t = ${t0} minutes, correct to 1 decimal place where necessary.`)}${br('iii', `Find the exact first time at which the passenger is level with the axle, ${C} m high.`)}`,
			answer: multi([C + R, dp(h0, 1), T / 4], ['max height (m)', `height at t = ${t0} (m)`, 'time (min)'], 0.06),
			solution: `<p>(i) cos ranges between &minus;1 and 1, so h is largest when cos = &minus;1: h = ${C} + ${R} = <strong>${C + R} m</strong>.</p>
<p>(ii) At t = ${t0}: the angle is ${360 * t0 / T}&deg; and cos ${360 * t0 / T}&deg; = ${dp(Math.cos(rad(360 * t0 / T)), 2)}.</p>
<p>h = ${C} &minus; ${R}(${dp(Math.cos(rad(360 * t0 / T)), 2)}) = <strong>${dp(h0, 1)} m</strong>.</p>
<p>(iii) h = ${C} requires cos(${360 / T}t)&deg; = 0, first at ${360 / T}t = 90, i.e. t = <strong>${T / 4} min</strong> (a quarter turn, as the geometry suggests).</p>`,
		};
	});

	boss('boss-projectile', 'Quadratics + inequalities', function (r) {
		const k = r.int(3, 7), m = r.int(1, k - 1);
		const v = 10 * k, H = 5 * (k * k - m * m);
		return {
			marks: 6,
			text: `A flare is fired from ground level, and its height after t seconds is h = ${v}t &minus; 5t<sup>2</sup> metres.${br('i', 'Find its greatest height.')}${br('ii', 'Find the total time from launch until it lands.')}${br('iii', `For how many seconds is the flare higher than ${H} m?`)}`,
			answer: multi([5 * k * k, 2 * k, 2 * m], ['max height (m)', 'flight time (s)', 'seconds above'], 0.01),
			solution: `<p>(i) h = ${v}t &minus; 5t<sup>2</sup> peaks at the vertex t = ${F.frac(String(v), '10')} = ${k} s, giving h = <strong>${5 * k * k} m</strong>.</p>
<p>(ii) Landing: 5t(${2 * k} &minus; t) = 0, so t = <strong>${2 * k} s</strong>.</p>
<p>(iii) Solve ${v}t &minus; 5t<sup>2</sup> &gt; ${H}, i.e. t<sup>2</sup> &minus; ${2 * k}t + ${k * k - m * m} &lt; 0.</p>
<p>Factorising: (t &minus; ${k - m})(t &minus; ${k + m}) &lt; 0, so ${k - m} &lt; t &lt; ${k + m} &mdash; a window of <strong>${2 * m} s</strong> (symmetric about the peak).</p>`,
		};
	});

	boss('boss-circumcentre', 'Coordinate geometry chain', function (r) {
		const OFF = [[3, 4], [3, -4], [-3, 4], [-3, -4], [4, 3], [4, -3], [-4, 3], [-4, -3]];
		const k = r.pick([1, 1, 2]);
		let pts, p, q;
		do {
			p = r.int(-4, 4); q = r.int(-4, 4);
			const chosen = r.shuffle(OFF).slice(0, 3);
			pts = chosen.map((o) => [p + k * o[0], q + k * o[1]]);
		} while (Math.abs((pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[2][0] - pts[0][0]) * (pts[1][1] - pts[0][1])) < 1);
		const [A, B, C] = pts;
		const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
		return {
			marks: 6,
			text: `A triangle has vertices A(${A[0]}, ${A[1]}), B(${B[0]}, ${B[1]}) and C(${C[0]}, ${C[1]}). All three vertices lie on a single circle.${br('i', 'Find the coordinates of the centre of that circle (the circumcentre).')}${br('ii', 'Find its radius.')}${br('iii', 'Find the area of the triangle, correct to 1 decimal place where necessary.')} <em>Hint: the centre is equidistant from all three vertices &mdash; perpendicular bisectors, or solve with distances.</em>`,
			diagram: { type: 'graph', xmin: Math.min(A[0], B[0], C[0], 0) - 2, xmax: Math.max(A[0], B[0], C[0], 0) + 2, ymin: Math.min(A[1], B[1], C[1], 0) - 2, ymax: Math.max(A[1], B[1], C[1], 0) + 2, grid: true, points: [[...A, 'A'], [...B, 'B'], [...C, 'C']] },
			answer: multi([p, q, 5 * k, dp(area, 1)], ['centre x', 'centre y', 'radius', 'area'], 0.06),
			solution: `<p>(i) The centre (x, y) satisfies |PA| = |PB| = |PC|. Setting the squared distances to A and B equal kills the x<sup>2</sup> and y<sup>2</sup> terms, leaving a linear equation; likewise for A and C. Solving the two linear equations gives (${p}, ${q}).</p>
<p>Check: each vertex is a horizontal/vertical offset of (&plusmn;${3 * k}, &plusmn;${4 * k}) or (&plusmn;${4 * k}, &plusmn;${3 * k}) from (${p}, ${q}).</p>
<p>(ii) Radius = &radic;(${(3 * k) ** 2} + ${(4 * k) ** 2}) = <strong>${5 * k}</strong>.</p>
<p>(iii) Shoelace formula: area = ${F.frac(1, 2)}|x<sub>A</sub>(y<sub>B</sub>&minus;y<sub>C</sub>) + x<sub>B</sub>(y<sub>C</sub>&minus;y<sub>A</sub>) + x<sub>C</sub>(y<sub>A</sub>&minus;y<sub>B</sub>)| = <strong>${dp(area, 1)}</strong>. (Centre: <strong>(${p}, ${q})</strong>.)</p>`,
		};
	});

	boss('boss-chord-products', 'Chords + Pythagoras', function (r) {
		const T = r.pick([[5, 3], [5, 4], [10, 6], [13, 5], [13, 12], [15, 9], [17, 8], [25, 7]]);
		const [R, d] = T;
		const half = Math.sqrt(R * R - d * d);
		const pow = R * R - d * d;
		const divs = [];
		for (let c = 2; c <= R + d; c++) if (pow % c === 0 && pow / c >= 1) divs.push(c);
		const c = r.pick(divs);
		const me = pow / c;
		return {
			marks: 6,
			text: `A circle has centre O and radius ${R} cm. A chord AB has midpoint M, with OM = ${d} cm.${br('i', 'Find the length AM.')}${br('ii', 'Write down the value of AM &times; MB.')}${br('iii', `Another chord CE passes through M with CM = ${c} cm. Find ME.`)} <em>Hint for (iii): intersecting chords.</em>`,
			answer: multi([half, pow, me], ['AM (cm)', 'AM &times; MB (cm&sup2;)', 'ME (cm)'], 0.01),
			solution: `<p>(i) OM &perp; AB since M is the midpoint of the chord. Pythagoras in triangle OMA: AM = &radic;(${R}<sup>2</sup> &minus; ${d}<sup>2</sup>) = <strong>${half} cm</strong>.</p>
<p>(ii) MB = AM, so AM &times; MB = ${half}<sup>2</sup> = <strong>${pow} cm&sup2;</strong>.</p>
<p>(iii) For any two chords crossing at M, the products of the pieces are equal: CM &times; ME = AM &times; MB.</p>
<p>${c} &times; ME = ${pow}, so ME = <strong>${me} cm</strong>.</p>`,
		};
	});

	boss('boss-exp-race', 'Exponential growth race', function (r) {
		const a0 = r.pick([200, 300, 400, 500]), mult = r.pick([2, 3, 4]);
		const b0 = a0 * mult;
		const pp = r.int(8, 15), qq = r.int(2, 5);
		const n = r.int(3, 6);
		const afterN = a0 * (1 + pp / 100) ** n;
		const tStar = Math.log(mult) / Math.log((1 + pp / 100) / (1 + qq / 100));
		return {
			marks: 6,
			text: `Town A has population ${a0} and grows by ${pp}% per year. Town B has population ${b0} and grows by ${qq}% per year.${br('i', `Find the population of Town A after ${n} years, correct to 1 decimal place.`)}${br('ii', 'Find how many years it takes for the two towns to have equal populations, correct to 1 decimal place.')} <em>Hint for (ii): set the two models equal and isolate the ratio of growth factors before using logarithms.</em>`,
			diagram: { type: 'graph', xmin: 0, xmax: Math.ceil(tStar * 1.2), ymin: 0, ymax: Math.ceil(b0 * (1 + qq / 100) ** (tStar * 1.2) / 100) * 100, fns: [{ fn: (t) => a0 * (1 + pp / 100) ** t }, { fn: (t) => b0 * (1 + qq / 100) ** t }] },
			answer: multi([dp(afterN, 1), dp(tStar, 1)], ['population after ' + n + ' years', 'years to equality'], 0.06),
			solution: `<p>(i) A(t) = ${a0}(${dp(1 + pp / 100, 2)})<sup>t</sup>, so A(${n}) = ${a0} &times; ${dp((1 + pp / 100) ** n, 4)} = <strong>${dp(afterN, 1)}</strong>.</p>
<p>(ii) Set ${a0}(${dp(1 + pp / 100, 2)})<sup>t</sup> = ${b0}(${dp(1 + qq / 100, 2)})<sup>t</sup>. Dividing: (${F.frac(dp(1 + pp / 100, 2), dp(1 + qq / 100, 2))})<sup>t</sup> = ${mult}.</p>
<p>Take logs: t log(${dp((1 + pp / 100) / (1 + qq / 100), 4)}) = log ${mult}.</p>
<p>t = ${F.frac(`log ${mult}`, `log ${dp((1 + pp / 100) / (1 + qq / 100), 4)}`)} = <strong>${dp(tStar, 1)} years</strong>.</p>`,
		};
	});

	boss('boss-trig-equation', 'Trig equations', function (r) {
		const EQ = [
			{ eq: '2 sin<sup>2</sup>x &minus; sin x = 0', how: 'Factor: sin x(2 sin x &minus; 1) = 0, so sin x = 0 or sin x = 1/2', sols: [0, 30, 150, 180] },
			{ eq: '2 sin<sup>2</sup>x + sin x &minus; 1 = 0', how: 'Factor: (2 sin x &minus; 1)(sin x + 1) = 0, so sin x = 1/2 or sin x = &minus;1', sols: [30, 150, 270] },
			{ eq: '2 sin<sup>2</sup>x &minus; 3 sin x + 1 = 0', how: 'Factor: (2 sin x &minus; 1)(sin x &minus; 1) = 0, so sin x = 1/2 or sin x = 1', sols: [30, 90, 150] },
			{ eq: '2 cos<sup>2</sup>x &minus; cos x &minus; 1 = 0', how: 'Factor: (2 cos x + 1)(cos x &minus; 1) = 0, so cos x = &minus;1/2 or cos x = 1', sols: [0, 120, 240] },
			{ eq: '2 cos<sup>2</sup>x + cos x &minus; 1 = 0', how: 'Factor: (2 cos x &minus; 1)(cos x + 1) = 0, so cos x = 1/2 or cos x = &minus;1', sols: [60, 180, 300] },
			{ eq: '2 cos<sup>2</sup>x &minus; 3 cos x + 1 = 0', how: 'Factor: (2 cos x &minus; 1)(cos x &minus; 1) = 0, so cos x = 1/2 or cos x = 1', sols: [0, 60, 300] },
			{ eq: '4 sin<sup>2</sup>x &minus; 3 = 0', how: 'sin x = &plusmn;&radic;3/2', sols: [60, 120, 240, 300] },
			{ eq: '2 sin<sup>2</sup>x &minus; 1 = 0', how: 'sin x = &plusmn;1/&radic;2', sols: [45, 135, 225, 315] },
			{ eq: '4 cos<sup>2</sup>x &minus; 1 = 0', how: 'cos x = &plusmn;1/2', sols: [60, 120, 240, 300] },
			{ eq: '3 tan<sup>2</sup>x &minus; 1 = 0', how: 'tan x = &plusmn;1/&radic;3', sols: [30, 150, 210, 330] },
			{ eq: 'tan<sup>2</sup>x &minus; 3 = 0', how: 'tan x = &plusmn;&radic;3', sols: [60, 120, 240, 300] },
			{ eq: '2 cos<sup>2</sup>x &minus; 1 = 0', how: 'cos x = &plusmn;1/&radic;2', sols: [45, 135, 225, 315] },
		];
		const e = r.pick(EQ);
		const dbl = r.next() < 0.4;
		const sols = dbl ? [...e.sols, ...e.sols.map((s) => s + 360)] : e.sols;
		const hi = dbl ? 720 : 360;
		return {
			marks: 6,
			text: `Consider the equation ${e.eq} for 0&deg; &le; x &lt; ${hi}&deg;.${br('i', 'How many solutions does the equation have in this interval?')}${br('ii', 'Find the smallest solution (in degrees).')}${br('iii', 'Find the largest solution (in degrees).')} <em>Hint: treat it as a quadratic first, solve the basic equation, then use symmetry to find every angle.</em>`,
			answer: multi([sols.length, Math.min(...sols), Math.max(...sols)], ['number of solutions', 'smallest (degrees)', 'largest (degrees)'], 0.01),
			solution: `<p>${e.how}.</p>
<p>Use the unit circle (or CAST) to convert each basic value into all angles in 0&deg; &le; x &lt; ${hi}&deg;${dbl ? ', remembering each solution repeats after 360&deg;' : ''}.</p>
<p>Solutions: ${sols.join('&deg;, ')}&deg;.</p>
<p><strong>${sols.length} solutions; smallest ${Math.min(...sols)}&deg;, largest ${Math.max(...sols)}&deg;</strong>.</p>`,
		};
	});

	boss('boss-scale-model', 'Similarity: length, area, volume', function (r) {
		const pair = r.pick([[1, 2], [2, 3], [3, 4], [2, 5], [1, 3], [3, 5]]);
		const [h1u, h2u] = pair;
		const scale = r.pick([4, 5, 6]);
		const h1 = h1u * scale, h2 = h2u * scale;
		const u = r.int(2, 6), w = r.int(1, 4);
		const labelSmall = u * h1u * h1u, labelBig = u * h2u * h2u;
		const volSmall = w * h1u ** 3, volBig = w * h2u ** 3;
		const k2 = (h2u / h1u) ** 2;
		return {
			marks: 6,
			text: `Two bottles are exactly similar in shape. The small bottle is ${h1} cm tall; the large bottle is ${h2} cm tall.${br('i', 'The ratio of their surface areas is 1 : k. Find k, correct to 2 decimal places where necessary.')}${br('ii', `The label on the small bottle has area ${labelSmall} cm&sup2;. Find the area of the matching label on the large bottle.`)}${br('iii', `The small bottle holds ${volSmall} mL. How much does the large bottle hold?`)}`,
			answer: multi([dp(k2, 2), labelBig, volBig], ['k', 'label area (cm&sup2;)', 'capacity (mL)'], 0.006),
			solution: `<p>The length scale factor is ${h2} : ${h1} = ${h2u} : ${h1u}.</p>
<p>(i) Areas scale with the square: k = (${h2u}/${h1u})<sup>2</sup> = <strong>${dp(k2, 2)}</strong>.</p>
<p>(ii) Label area = ${labelSmall} &times; ${F.frac(String(h2u * h2u), String(h1u * h1u))} = <strong>${labelBig} cm&sup2;</strong>.</p>
<p>(iii) Volumes scale with the cube: ${volSmall} &times; ${F.frac(String(h2u ** 3), String(h1u ** 3))} = <strong>${volBig} mL</strong>.</p>`,
		};
	});

	boss('boss-normal-chain', 'Normal distribution chain', function (r) {
		const mu = r.int(60, 75), sig = 2 * r.int(2, 5);
		const z = r.pick([-2, -1.5, -1, 1, 1.5]);
		const x = mu + z * sig;
		return {
			marks: 6,
			text: `Test scores are normally distributed with mean ${mu} and standard deviation ${sig}.${br('i', `Find the z-score of a student who scored ${x}, correct to 1 decimal place where necessary.`)}${br('ii', `What percentage of students score between ${mu - sig} and ${mu + sig}? (Use the empirical rule.)`)}${br('iii', 'The top 2.5% of students receive a prize. Find the minimum score needed for a prize.')}`,
			diagram: { type: 'normal', shadeFromZ: 2 },
			answer: multi([z, 68, mu + 2 * sig], ['z-score', 'percentage (%)', 'cut-off score'], 0.06),
			solution: `<p>(i) z = ${F.frac(`${x} &minus; ${mu}`, String(sig))} = <strong>${z}</strong>.</p>
<p>(ii) The empirical rule: about 68% of data lies within 1 standard deviation of the mean: <strong>68%</strong>.</p>
<p>(iii) About 95% of data lies within 2 standard deviations, leaving 5% outside, split equally: 2.5% lies above &mu; + 2&sigma;.</p>
<p>Cut-off = ${mu} + 2 &times; ${sig} = <strong>${mu + 2 * sig}</strong>.</p>`,
		};
	});

	boss('boss-dice-game', 'Expected value', function (r) {
		const a = r.pick([6, 9, 12, 15]), b = r.pick([3, 4, 5]);
		const cost = r.int(2, 5);
		const E = (a + 2 * b) / 6;
		const profit = E - cost;
		return {
			marks: 6,
			text: `A stall runs a game: you pay $${cost} and roll one fair die. Rolling a six wins $${a}; rolling a four or five wins $${b}; anything else wins nothing.${br('i', 'Find the probability of winning some money, as a decimal correct to 2 decimal places where necessary.')}${br('ii', 'Find the expected winnings from one roll (ignoring the entry fee), correct to 2 decimal places where necessary.')}${br('iii', 'Find the expected profit or loss per game for a player (negative for a loss), correct to 2 decimal places where necessary.')}`,
			answer: multi([0.5, dp(E, 2), dp(profit, 2)], ['P(win)', 'expected winnings ($)', 'expected profit ($)'], 0.006),
			solution: `<p>(i) Winning outcomes are {4, 5, 6}: P = ${F.frac(3, 6)} = <strong>0.5</strong>.</p>
<p>(ii) E(winnings) = ${F.frac(1, 6)}(${a}) + ${F.frac(2, 6)}(${b}) + ${F.frac(3, 6)}(0) = ${F.frac(String(a + 2 * b), '6')}.</p>
<p>= <strong>$${dp(E, 2)}</strong>.</p>
<p>(iii) Expected profit = ${dp(E, 2)} &minus; ${cost} = <strong>$${dp(profit, 2)}</strong> &mdash; ${profit < 0 ? 'the stall makes money in the long run' : 'the player comes out ahead on average'}.</p>`,
		};
	});

	boss('boss-circle-tangent-length', 'Circle equations + tangents', function (r) {
		const T = r.pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [10, 24, 26], [20, 15, 25], [9, 40, 41]]);
		const [Rr, L, dd] = T;
		const aC = r.int(-5, 5), bC = r.int(-5, 5);
		const K = aC * aC + bC * bC - Rr * Rr;
		const off = r.pick([[dd, 0], [0, dd], T[0] === 6 ? [6, 8] : [dd, 0]]);
		const P = [aC + off[0], bC + off[1]];
		return {
			marks: 6,
			text: `A circle has equation x<sup>2</sup> + y<sup>2</sup> ${F.st(-2 * aC, 'x')} ${F.st(-2 * bC, 'y')} ${F.st(K, '')} = 0, and P is the point (${P[0]}, ${P[1]}).${br('i', 'Find the radius of the circle.')}${br('ii', 'Find the length of a tangent drawn from P to the circle.')}${br('iii', 'The two tangents from P touch the circle at A and B. Find the area of the kite formed by P, A, B and the centre.')} <em>Hint: complete the square first.</em>`,
			diagram: { type: 'graph', xmin: -50, xmax: 50, ymin: -50, ymax: 50, grid: true, fns: [{ fn: (x) => bC + Math.sqrt(Rr * Rr - (x - aC) ** 2) }, { fn: (x) => bC - Math.sqrt(Rr * Rr - (x - aC) ** 2) }], points: [[P[0], P[1], 'P']] },
			answer: multi([Rr, L, Rr * L], ['radius', 'tangent length', 'kite area'], 0.01),
			solution: `<p>(i) Completing the square: (x ${F.st(-aC, '')})<sup>2</sup> + (y ${F.st(-bC, '')})<sup>2</sup> = ${Rr * Rr}, so the centre is (${aC}, ${bC}) and radius = <strong>${Rr}</strong>.</p>
<p>(ii) Distance from P to the centre: &radic;(${off[0]}<sup>2</sup> + ${off[1]}<sup>2</sup>) = ${dd}. The radius meets the tangent at 90&deg;, so the tangent length is a leg of a right triangle.</p>
<p>Tangent = &radic;(${dd}<sup>2</sup> &minus; ${Rr}<sup>2</sup>) = <strong>${L}</strong>.</p>
<p>(iii) The kite splits into two congruent right triangles with legs ${Rr} and ${L}: area = 2 &times; ${F.frac(1, 2)} &times; ${Rr} &times; ${L} = <strong>${Rr * L}</strong>.</p>`,
		};
	});

	boss('boss-bearing-three-legs', 'Bearings: three legs', function (r) {
		let legs, x, y, dist;
		do {
			legs = [];
			let bearing = r.int(20, 120);
			for (let i = 0; i < 3; i++) {
				legs.push({ bearing, dist: r.int(4, 10) });
				bearing = (bearing + r.int(50, 110)) % 360;
			}
			x = legs.reduce((s, l) => s + l.dist * Math.sin(rad(l.bearing)), 0);
			y = legs.reduce((s, l) => s + l.dist * Math.cos(rad(l.bearing)), 0);
			dist = Math.hypot(x, y);
		} while (dist < 3);
		const back = (Math.atan2(-x, -y) * DEG + 360) % 360;
		const total = legs.reduce((s, l) => s + l.dist, 0);
		const saving = total - dist;
		const pad = (n) => String(n).padStart(3, '0');
		return {
			marks: 6,
			text: `A yacht sails three legs from a marina M: ${legs.map((l, i) => `${l.dist} km on a bearing of ${pad(l.bearing)}&deg;T`).join(', then ')}.${br('i', 'Find the yacht&rsquo;s final distance from the marina, correct to 1 decimal place.')}${br('ii', 'Find the bearing the yacht must sail to return directly to the marina, correct to 1 decimal place.')}${br('iii', 'How much shorter is the direct return than retracing the whole route? Give your answer correct to 1 decimal place.')}`,
			diagram: { type: 'bearings', legs: legs.map((l) => ({ bearing: l.bearing, dist: l.dist, label: `${l.dist} km` })), names: ['M', '', '', ''], close: true },
			answer: multi([dp(dist, 1), dp(back, 1), dp(total - dist, 1)], ['distance (km)', 'bearing (degrees)', 'saving (km)'], 0.06),
			solution: `<p>Resolve each leg: east = d sin(bearing), north = d cos(bearing).</p>
<p>Total east: ${legs.map((l) => `${l.dist} sin ${l.bearing}&deg;`).join(' + ')} = ${dp(x, 3)} km; total north: ${legs.map((l) => `${l.dist} cos ${l.bearing}&deg;`).join(' + ')} = ${dp(y, 3)} km.</p>
<p>(i) Distance = &radic;(${dp(x, 3)}<sup>2</sup> + ${dp(y, 3)}<sup>2</sup>) = <strong>${dp(dist, 1)} km</strong>.</p>
<p>(ii) The return vector is (${dp(-x, 3)}, ${dp(-y, 3)}); as a bearing this is <strong>${dp(back, 1)}&deg;T</strong>.</p>
<p>(iii) The outward route totals ${total} km, so the direct return saves ${total} &minus; ${dp(dist, 1)} = <strong>${dp(saving, 1)} km</strong>.</p>`,
		};
	});
})();
