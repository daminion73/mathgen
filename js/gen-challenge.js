// Challenge generators: multi-step, non-routine questions.
// Advanced Geometry blends trigonometry with circle/triangle geometry; the rest
// add deeper-thinking problems (parameters, discriminants, Bayes, optimisation)
// to the existing topics.
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
	const DEG = 180 / Math.PI;

	// =====================================================================
	// ADVANCED GEOMETRY - trig + geometry hybrids
	// =====================================================================

	// Circumcircle via cosine rule then sine rule
	add('advgeo-circumradius', 'Advanced Geometry', 'Circumcircle & sine rule', 3, function (r) {
		const b = r.int(6, 13), c = r.int(6, 13), A = 5 * r.int(8, 24); // 40..120
		const a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(rad(A)));
		const R = a / (2 * Math.sin(rad(A)));
		return {
			marks: 4,
			text: `In triangle ABC, AB = ${c} cm, AC = ${b} cm and &ang;BAC = ${deg(A)}. A circle is drawn through all three vertices.<br>(i) Show that BC&sup2; = ${b * b + c * c} &minus; ${2 * b * c} cos ${deg(A)}.<br>(ii) Find BC and the circumradius, both correct to 2 decimal places.`,
			diagram: { type: 'triangle', a, b, c, sideLabels: ['', `${b} cm`, `${c} cm`], angleLabels: [deg(A), '', ''] },
			answer: multi([dp(a, 2), dp(R, 2)], ['BC (cm)', 'circumradius (cm)'], 0.006),
			solution: `<p>The circle through all three vertices is the circumcircle, so its radius comes from the sine rule once BC is known.</p>
<p>Cosine rule: BC<sup>2</sup> = ${b}<sup>2</sup> + ${c}<sup>2</sup> &minus; 2(${b})(${c})cos ${deg(A)} = ${dp(b * b + c * c - 2 * b * c * Math.cos(rad(A)), 3)}.</p>
<p>So BC = ${dp(a, 4)} &asymp; <strong>${dp(a, 2)} cm</strong>.</p>
<p>The sine rule gives ${F.frac('BC', 'sin A')} = 2R, so R = ${F.frac(dp(a, 4), `2 sin ${deg(A)}`)} = <strong>${dp(R, 2)} cm</strong>.</p>`,
		};
	});

	// Segment of a circle: forwards (angle given) and backwards (chord given)
	add('advgeo-segment', 'Advanced Geometry', 'Arcs, chords & segments', 3, function (r) {
		const R0 = r.int(5, 10);
		if (r.next() < 0.5) {
			const th = 10 * r.int(5, 14); // 50..140
			const chord = 2 * R0 * Math.sin(rad(th / 2));
			const seg = 0.5 * R0 * R0 * (rad(th) - Math.sin(rad(th)));
			return {
				marks: 4,
				text: `A chord AB of a circle with radius ${R0} cm subtends ${deg(th)} at O.<br>(i) Show that AB = 2(${R0})sin ${deg(th / 2)}.<br>(ii) Hence find AB and the area of the minor segment, both correct to 2 decimal places.`,
				diagram: { type: 'angleAtCentre', centralLabel: deg(th) },
				answer: multi([dp(chord, 2), dp(seg, 2)], ['chord (cm)', 'segment area (cm&sup2;)'], 0.006),
				solution: `<p>Split the isosceles triangle OAB with the perpendicular from O: half the chord is ${R0} sin(${th / 2}&deg;).</p>
<p>AB = 2 &times; ${R0} sin ${deg(th / 2)} = <strong>${dp(chord, 2)} cm</strong>.</p>
<p>Segment = sector &minus; triangle = ${F.frac(1, 2)}r<sup>2</sup>(&theta; &minus; sin &theta;) with &theta; in radians.</p>
<p>= ${F.frac(1, 2)}(${R0})<sup>2</sup>(${dp(rad(th), 4)} &minus; ${dp(Math.sin(rad(th)), 4)}) = <strong>${dp(seg, 2)} cm&sup2;</strong>.</p>`,
			};
		}
		const chord = r.int(R0, 2 * R0 - 1);
		const th = 2 * Math.asin(chord / (2 * R0)) * DEG;
		const seg = 0.5 * R0 * R0 * (rad(th) - Math.sin(rad(th)));
		return {
			marks: 4,
			text: `A chord of length ${chord} cm is drawn in a circle of radius ${R0} cm.<br>(i) Show that sin(&theta;/2) = ${F.frac(chord, 2 * R0)}, where &theta; is the angle at the centre.<br>(ii) Find &theta; to 1 decimal place and the minor-segment area to 2 decimal places.`,
			answer: multi([dp(th, 1), dp(seg, 2)], ['angle (degrees)', 'segment area (cm&sup2;)'], 0.06),
			solution: `<p>Work backwards from the chord: half the chord and a radius form a right triangle at the midpoint of the chord.</p>
<p>sin(&theta;/2) = ${F.frac(chord, 2 * R0)}, so &theta;/2 = ${dp(Math.asin(chord / (2 * R0)) * DEG, 3)}&deg;.</p>
<p>&theta; = <strong>${dp(th, 1)}&deg;</strong>.</p>
<p>Segment = ${F.frac(1, 2)}r<sup>2</sup>(&theta; &minus; sin &theta;) in radians = ${F.frac(1, 2)}(${R0})<sup>2</sup>(${dp(rad(th), 4)} &minus; ${dp(Math.sin(rad(th)), 4)}) = <strong>${dp(seg, 2)} cm&sup2;</strong>.</p>`,
		};
	});

	// Cevian length: cosine rule used twice
	add('advgeo-cevian', 'Advanced Geometry', 'Cevians & medians', 4, function (r) {
		let a, b, c;
		do { a = r.int(8, 14); c = r.int(6, 12); b = r.int(4, 14); }
		while (b >= a + c - 1 || a >= b + c - 1 || c >= a + b - 1);
		const median = r.next() < 0.4;
		const k = median ? a / 2 : r.int(2, a - 2);
		const cosB = (a * a + c * c - b * b) / (2 * a * c);
		const ad = Math.sqrt(c * c + k * k - 2 * c * k * cosB);
		const where = median ? `M is the midpoint of BC` : `D lies on BC with BD = ${k} cm`;
		const pName = median ? 'M' : 'D';
		return {
			marks: 5,
			text: `In triangle ABC, AB = ${c} cm, BC = ${a} cm and CA = ${b} cm. The point ${where}.<br>(i) Show that cos B = ${F.frac(a * a + c * c - b * b, 2 * a * c)}.<br>(ii) Hence find A${pName}, correct to 2 decimal places.`,
			diagram: { type: 'triangle', a, b, c, sideLabels: [`${a} cm`, `${b} cm`, `${c} cm`] },
			answer: num(dp(ad, 2), `A${pName} (cm)`, 0.006),
			solution: `<p>A${pName} sits inside triangle AB${pName}, but that triangle only has two known sides (AB and B${pName} = ${dp(k, 2)}). The included angle B must come from the whole triangle.</p>
<p>Cosine rule in ABC: cos B = ${F.frac(`${a}<sup>2</sup> + ${c}<sup>2</sup> &minus; ${b}<sup>2</sup>`, `2(${a})(${c})`)} = ${dp(cosB, 4)}.</p>
<p>Now apply the cosine rule in triangle AB${pName}: A${pName}<sup>2</sup> = ${c}<sup>2</sup> + ${dp(k, 2)}<sup>2</sup> &minus; 2(${c})(${dp(k, 2)})(${dp(cosB, 4)}) = ${dp(c * c + k * k - 2 * c * k * cosB, 3)}.</p>
<p>A${pName} = <strong>${dp(ad, 2)} cm</strong>.</p>`,
		};
	});

	// 3D box: diagonals and angles
	add('advgeo-box', 'Advanced Geometry', '3D trigonometry', 3, function (r) {
		const a = r.int(3, 12), b = r.int(3, 12), c = r.int(3, 10);
		const dBase = Math.hypot(a, b), d3 = Math.hypot(a, b, c);
		const mode = r.pick([0, 1, 2]);
		const intro = `A rectangular box has a ${a} cm by ${b} cm base and height ${c} cm. Its space diagonal runs from A to the opposite vertex G. First show that the square of the base diagonal is ${a * a + b * b} cm&sup2;.`;
		if (mode === 0) {
			return {
				marks: 3,
				text: `${intro}<br>Hence find AG, correct to 2 decimal places.`,
				answer: num(dp(d3, 2), 'AG (cm)', 0.006),
				solution: `<p>First find the base diagonal AC with Pythagoras: AC = &radic;(${a}<sup>2</sup> + ${b}<sup>2</sup>) = ${dp(dBase, 4)}.</p>
<p>AG is the hypotenuse of the vertical right triangle ACG: AG = &radic;(AC<sup>2</sup> + ${c}<sup>2</sup>) = &radic;(${a * a + b * b + c * c}).</p>
<p>AG = <strong>${dp(d3, 2)} cm</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const ang = Math.atan(c / dBase) * DEG;
			return {
				marks: 4,
				text: `${intro}<br>Hence find the angle that AG makes with the base, correct to 1 decimal place.`,
				answer: num(dp(ang, 1), 'angle (degrees)', 0.06),
				solution: `<p>The projection of AG onto the base is the base diagonal AC = &radic;(${a}<sup>2</sup> + ${b}<sup>2</sup>) = ${dp(dBase, 4)} cm.</p>
<p>The angle between AG and the base lives in right triangle ACG: tan &theta; = ${F.frac('height', 'AC')} = ${F.frac(c, dp(dBase, 4))}.</p>
<p>&theta; = tan<sup>&minus;1</sup>(${dp(c / dBase, 4)}) = <strong>${dp(ang, 1)}&deg;</strong>.</p>`,
			};
		}
		const ang = Math.acos(a / d3) * DEG;
		return {
			marks: 4,
			text: `${intro}<br>Show that AG&sup2; = ${a * a + b * b + c * c} cm&sup2;, then find the angle between AG and the ${a} cm edge at A, correct to 1 decimal place.`,
			answer: num(dp(ang, 1), 'angle (degrees)', 0.06),
			solution: `<p>AG = &radic;(${a}<sup>2</sup> + ${b}<sup>2</sup> + ${c}<sup>2</sup>) = ${dp(d3, 4)} cm.</p>
<p>The edge is adjacent to the angle and AG is the hypotenuse of a right triangle (the edge, the diagonal of the opposite face, and AG).</p>
<p>cos &theta; = ${F.frac(a, dp(d3, 4))}, so &theta; = <strong>${dp(ang, 1)}&deg;</strong>.</p>`,
		};
	});

	// Square pyramid: dihedral vs edge angles
	add('advgeo-pyramid', 'Advanced Geometry', '3D trigonometry', 4, function (r) {
		const a = r.pick([6, 8, 10, 12, 14]);
		if (r.next() < 0.5) {
			const h = r.int(4, 12);
			const faceAng = Math.atan(2 * h / a) * DEG;
			const edgeAng = Math.atan(h * Math.SQRT2 / a) * DEG;
			return {
				marks: 5,
				text: `A right pyramid has a square base of side ${a} cm and vertical height ${h} cm.<br>(i) Show that the centre-to-edge and centre-to-vertex distances are ${a / 2} cm and ${F.frac(`${a}&radic;2`, 2)} cm.<br>(ii) Find the face-base and slant-edge-base angles, correct to 1 decimal place.`,
				answer: multi([dp(faceAng, 1), dp(edgeAng, 1)], ['face-base angle (degrees)', 'edge-base angle (degrees)'], 0.06),
				solution: `<p>For the face angle, use the apothem: from the centre to the midpoint of a base edge is ${a}/2 = ${a / 2} cm. The face rises along this line.</p>
<p>tan(face angle) = ${F.frac(h, a / 2)}, so face angle = <strong>${dp(faceAng, 1)}&deg;</strong>.</p>
<p>For the edge angle, the slant edge meets the base at a corner, whose distance from the centre is half the base diagonal: ${F.frac(`${a}&radic;2`, 2)} = ${dp(a * Math.SQRT2 / 2, 4)} cm.</p>
<p>tan(edge angle) = ${F.frac(h, dp(a * Math.SQRT2 / 2, 4))}, so edge angle = <strong>${dp(edgeAng, 1)}&deg;</strong>. The edge angle is always smaller because the corner is further from the centre.</p>`,
			};
		}
		const fa = r.int(35, 65);
		const h = (a / 2) * Math.tan(rad(fa));
		const slantEdge = Math.sqrt(h * h + a * a / 2);
		return {
			marks: 5,
			text: `A right pyramid has a square base of side ${a} cm. Each triangular face makes ${deg(fa)} with the base.<br>(i) Show that h = ${a / 2} tan ${deg(fa)}.<br>(ii) Find the vertical height and a slant edge, correct to 2 decimal places.`,
			answer: multi([dp(h, 2), dp(slantEdge, 2)], ['height (cm)', 'slant edge (cm)'], 0.006),
			solution: `<p>The face-base angle is measured along the apothem, which is ${a}/2 = ${a / 2} cm from the centre to a base edge.</p>
<p>h = ${a / 2} tan ${deg(fa)} = <strong>${dp(h, 2)} cm</strong>.</p>
<p>A slant edge ends at a base corner, at distance ${F.frac(`${a}&radic;2`, 2)} = ${dp(a * Math.SQRT2 / 2, 4)} cm from the centre.</p>
<p>Slant edge = &radic;(h<sup>2</sup> + ${dp(a * a / 2, 2)}) = <strong>${dp(slantEdge, 2)} cm</strong>.</p>`,
		};
	});

	// Ambiguous case of the sine rule
	add('advgeo-ambiguous', 'Advanced Geometry', 'Ambiguous sine rule', 4, function (r) {
		let A, b, a, lo;
		do {
			A = r.int(25, 50); b = r.int(8, 15);
			lo = Math.ceil(b * Math.sin(rad(A)));
			a = r.int(lo + 1, b - 1);
		} while (lo + 1 > b - 1 || a <= b * Math.sin(rad(A)));
		const sinB = b * Math.sin(rad(A)) / a;
		const B1 = Math.asin(sinB) * DEG, B2 = 180 - B1;
		return {
			marks: 4,
			text: `In triangle ABC, &ang;A = ${deg(A)}, a = ${a} cm and b = ${b} cm.<br>(i) Show that sin B = ${F.frac(`${b} sin ${deg(A)}`, a)} and explain why two triangles are possible.<br>(ii) Find both values of B, correct to 1 decimal place.`,
			answer: multi([dp(B1, 1), dp(B2, 1)], ['acute B (degrees)', 'obtuse B (degrees)'], 0.06),
			solution: `<p>Sine rule: ${F.frac('sin B', String(b))} = ${F.frac(`sin ${deg(A)}`, String(a))}, so sin B = ${dp(sinB, 4)}.</p>
<p>The calculator gives the acute solution B = ${dp(B1, 2)}&deg;, but sin is also positive in the second quadrant, so B = 180&deg; &minus; ${dp(B1, 2)}&deg; is a second candidate.</p>
<p>Check the obtuse case: ${dp(B2, 1)}&deg; + ${A}&deg; &lt; 180&deg;, so a valid triangle remains. This happens because a &lt; b (the side opposite the known angle is the shorter one).</p>
<p><strong>B = ${dp(B1, 1)}&deg; or B = ${dp(B2, 1)}&deg;</strong>.</p>`,
		};
	});

	// Incircle radius from area = rs
	add('advgeo-incircle', 'Advanced Geometry', 'Incircle & area', 3, function (r) {
		const T = r.pick([[6, 8, 10, 24], [5, 12, 13, 30], [9, 12, 15, 54], [8, 15, 17, 60], [13, 14, 15, 84], [12, 16, 20, 96], [10, 24, 26, 120], [15, 20, 25, 150], [9, 40, 41, 180], [7, 15, 20, 42], [11, 13, 20, 66]]);
		const k = r.pick([1, 1, 2]);
		const [x, y, z] = [T[0] * k, T[1] * k, T[2] * k];
		const area = T[3] * k * k;
		const s = (x + y + z) / 2;
		const rIn = area / s;
		const right = x * x + y * y === z * z;
		return {
			marks: 4,
			text: `A triangle has sides ${x} cm, ${y} cm and ${z} cm, and an incircle of radius r.<br>(i) Find its area.<br>(ii) By splitting it into three triangles, show that area = rs, where s is the semiperimeter.<br>(iii) Hence find r, correct to 2 decimal places where necessary.`,
			answer: multi([area, dp(rIn, 2)], ['area (cm&sup2;)', 'inradius (cm)'], 0.006),
			solution: `<p>${right ? `Since ${x}<sup>2</sup> + ${y}<sup>2</sup> = ${z}<sup>2</sup>, the triangle is right-angled, so area = ${F.frac(1, 2)}(${x})(${y}) = ${area} cm&sup2;.` : `Heron's formula with s = ${s}: area = &radic;(${s}(${s - x})(${s - y})(${s - z})) = ${area} cm&sup2;.`}</p>
<p>Joining the incentre to the three vertices splits the triangle into three smaller triangles, each with height r on a side as base.</p>
<p>So area = ${F.frac(1, 2)}r(${x} + ${y} + ${z}) = rs, giving r = ${F.frac(String(area), String(s))}.</p>
<p><strong>Area = ${area} cm&sup2;, r = ${dp(rIn, 2)} cm</strong>.</p>`,
		};
	});

	// Altitude-on-hypotenuse geometric mean relations
	add('advgeo-geomean', 'Advanced Geometry', 'Right-triangle altitude', 3, function (r) {
		const u = r.int(1, 3), v = r.int(u + 1, 4), k = r.int(1, 4);
		const p = k * u * u, q = k * v * v, h = k * u * v, hyp = p + q;
		if (r.next() < 0.5) {
			const area = hyp * h / 2;
			return {
				marks: 4,
				text: `In right triangle ABC, altitude CD meets hypotenuse AB at D. Given AD = ${p} cm and DB = ${q} cm:<br>(i) Use similarity to show that CD&sup2; = AD &times; DB.<br>(ii) Find CD and the area of ABC, correct to 1 decimal place where necessary.`,
				answer: multi([h, dp(area, 1)], ['CD (cm)', 'area (cm&sup2;)'], 0.06),
				solution: `<p>Triangles ACD and CBD are similar (both are similar to ABC), so ${F.frac('AD', 'CD')} = ${F.frac('CD', 'DB')}.</p>
<p>Hence CD<sup>2</sup> = AD &times; DB = ${p} &times; ${q} = ${p * q}, so CD = ${h} cm.</p>
<p>AB = ${p} + ${q} = ${hyp} cm and CD is the height onto AB.</p>
<p>Area = ${F.frac(1, 2)} &times; ${hyp} &times; ${h} = <strong>${dp(area, 1)} cm&sup2;</strong>. (CD = <strong>${h} cm</strong>.)</p>`,
			};
		}
		return {
			marks: 4,
			text: `In right triangle ABC, altitude CD meets hypotenuse AB at D, with CD = ${h} cm and AD = ${p} cm.<br>(i) Use similarity to show that CD&sup2; = AD &times; DB.<br>(ii) Hence find DB and AB, correct to 1 decimal place where necessary.`,
			answer: multi([q, hyp], ['DB (cm)', 'AB (cm)'], 0.06),
			solution: `<p>The altitude to the hypotenuse is the geometric mean of the two segments it creates: CD<sup>2</sup> = AD &times; DB.</p>
<p>${h}<sup>2</sup> = ${p} &times; DB, so DB = ${F.frac(String(h * h), String(p))} = ${q} cm.</p>
<p>AB = AD + DB = ${p} + ${q}.</p>
<p><strong>DB = ${q} cm, AB = ${hyp} cm</strong>.</p>`,
		};
	});

	// Acute angle between two lines
	add('advgeo-lines-angle', 'Advanced Geometry', 'Angle between lines', 3, function (r) {
		let m1, m2;
		do { m1 = r.nonzeroInt(-4, 4); m2 = r.nonzeroInt(-4, 4); } while (m1 === m2 || 1 + m1 * m2 === 0);
		const t = Math.abs((m1 - m2) / (1 + m1 * m2));
		const ang = Math.atan(t) * DEG;
		const c1 = r.nonzeroInt(-6, 6), c2 = r.nonzeroInt(-6, 6);
		const mode = r.pick([0, 1]);
		let text;
		if (mode === 0) {
			text = `Find the acute angle between the lines y = ${F.co(m1, 'x')}${F.st(c1, '')} and y = ${F.co(m2, 'x')}${F.st(c2, '')}, correct to 1 decimal place. <em>Hint: each gradient is the tangent of an angle with the x-axis.</em>`;
		} else {
			const x1 = r.int(-4, 2), y1 = r.int(-4, 4), x2 = x1 + r.int(1, 4);
			const y2 = y1 + m2 * (x2 - x1);
			text = `Line L<sub>1</sub> has equation y = ${F.co(m1, 'x')}${F.st(c1, '')}. Line L<sub>2</sub> passes through (${x1}, ${y1}) and (${x2}, ${y2}). Find the acute angle between L<sub>1</sub> and L<sub>2</sub>, correct to 1 decimal place.`;
		}
		return {
			marks: 3,
			text: `(i) Determine the two gradients.${mode === 0 ? '<br>(ii) Show that tan &theta; = |(m<sub>1</sub>&minus;m<sub>2</sub>)/(1+m<sub>1</sub>m<sub>2</sub>)|.<br>(iii) ' : '<br>(ii) Hence '}${text}`,
			answer: num(dp(ang, 1), 'angle (degrees)', 0.06),
			solution: `<p>${mode === 1 ? `Gradient of L<sub>2</sub>: rise over run gives m<sub>2</sub> = ${m2}.` : `The gradients are m<sub>1</sub> = ${m1} and m<sub>2</sub> = ${m2}.`}</p>
<p>Each line makes angle tan<sup>&minus;1</sup>(m) with the x-axis; subtracting them leads to the formula tan &theta; = ${F.frac('|m<sub>1</sub> &minus; m<sub>2</sub>|', '|1 + m<sub>1</sub>m<sub>2</sub>|')}.</p>
<p>tan &theta; = ${F.frac(Math.abs(m1 - m2), Math.abs(1 + m1 * m2))} = ${dp(t, 4)}.</p>
<p>&theta; = <strong>${dp(ang, 1)}&deg;</strong>.</p>`,
		};
	});

	// Regular polygons in circles
	add('advgeo-polygon', 'Advanced Geometry', 'Regular polygons & circles', 3, function (r) {
		const n = r.pick([5, 6, 8, 9, 10, 12]);
		const mode = r.pick([0, 1, 2]);
		const central = 360 / n;
		if (mode === 0) {
			const R0 = r.int(4, 12);
			const area = 0.5 * n * R0 * R0 * Math.sin(rad(central));
			const side = 2 * R0 * Math.sin(rad(central / 2));
			return {
				marks: 4,
				text: `A regular ${n}-sided polygon is inscribed in a circle of radius ${R0} cm.<br>(i) Show that each central angle is ${dp(central, 2)}&deg;.<br>(ii) Hence find its side length and area, both correct to 2 decimal places.`,
				answer: multi([dp(side, 2), dp(area, 2)], ['side (cm)', 'area (cm&sup2;)'], 0.006),
				solution: `<p>Joining the centre to each vertex gives ${n} congruent isosceles triangles with apex angle ${F.frac(360, n)} = ${dp(central, 2)}&deg; and equal sides ${R0} cm.</p>
<p>Each side: 2 &times; ${R0} sin(${dp(central / 2, 2)}&deg;) = <strong>${dp(side, 2)} cm</strong>.</p>
<p>Each triangle: ${F.frac(1, 2)}(${R0})<sup>2</sup> sin ${dp(central, 2)}&deg;, and there are ${n} of them.</p>
<p>Area = <strong>${dp(area, 2)} cm&sup2;</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const R0 = r.int(4, 12);
			const areaGiven = dp(0.5 * n * R0 * R0 * Math.sin(rad(central)), 1);
			const Rback = Math.sqrt(2 * areaGiven / (n * Math.sin(rad(central))));
			return {
				marks: 4,
				text: `A regular ${n}-sided polygon has area ${areaGiven} cm&sup2;.<br>(i) Show that its area is ${F.frac(n, 2)}R&sup2; sin ${dp(central, 2)}&deg;.<br>(ii) Hence find its circumradius, correct to 2 decimal places.`,
				answer: num(dp(Rback, 2), 'radius (cm)', 0.01),
				solution: `<p>Cutting the polygon into ${n} triangles at the centre gives area = ${F.frac(1, 2)}nR<sup>2</sup> sin(360&deg;/n).</p>
<p>${areaGiven} = ${F.frac(1, 2)}(${n})R<sup>2</sup> sin ${dp(central, 2)}&deg;.</p>
<p>R<sup>2</sup> = ${F.frac(`2 &times; ${areaGiven}`, `${n} sin ${dp(central, 2)}&deg;`)} = ${dp(Rback * Rback, 4)}.</p>
<p>R = <strong>${dp(Rback, 2)} cm</strong>.</p>`,
			};
		}
		const sSide = r.int(4, 12);
		const area = n * sSide * sSide / (4 * Math.tan(rad(180 / n)));
		return {
			marks: 4,
			text: `A regular ${n}-sided polygon has side length ${sSide} cm.<br>(i) Show that its apothem is ${F.frac(sSide / 2, `tan ${dp(180 / n, 2)}&deg;`)} cm.<br>(ii) Hence find its area, correct to 2 decimal places.`,
			answer: num(dp(area, 2), 'area (cm&sup2;)', 0.006),
			solution: `<p>The apothem a, half a side, and the half-angle at the centre (${dp(180 / n, 2)}&deg;) form a right triangle: tan ${dp(180 / n, 2)}&deg; = ${F.frac(sSide / 2, 'a')}.</p>
<p>a = ${F.frac(String(sSide / 2), `tan ${dp(180 / n, 2)}&deg;`)} = ${dp((sSide / 2) / Math.tan(rad(180 / n)), 4)} cm.</p>
<p>Area = ${F.frac(1, 2)} &times; perimeter &times; apothem = ${F.frac(1, 2)}(${n * sSide})(${dp((sSide / 2) / Math.tan(rad(180 / n)), 4)}).</p>
<p>= <strong>${dp(area, 2)} cm&sup2;</strong>.</p>`,
		};
	});

	// Two tangents from an external point (kite)
	add('advgeo-tangent-kite', 'Advanced Geometry', 'Tangents from a point', 4, function (r) {
		const R0 = r.int(3, 9), phi = r.int(15, 35);
		const OP = R0 / Math.sin(rad(phi));
		const PA = R0 / Math.tan(rad(phi));
		const area = R0 * PA;
		return {
			marks: 5,
			text: `From P, tangents PA and PB touch a circle of radius ${R0} cm and centre O. &ang;APB = ${deg(2 * phi)}.<br>(i) Show that OP bisects &ang;APB and OA is perpendicular to PA.<br>(ii) Hence find OP and the area of kite OAPB, correct to 2 decimal places.`,
			diagram: { type: 'tangentRadius', angleLabel: deg(phi) },
			answer: multi([dp(OP, 2), dp(area, 2)], ['OP (cm)', 'area (cm&sup2;)'], 0.006),
			solution: `<p>A radius meets a tangent at 90&deg;, so triangle OAP is right-angled at A. By symmetry OP bisects the ${deg(2 * phi)} angle, so &ang;APO = ${deg(phi)}.</p>
<p>sin ${deg(phi)} = ${F.frac('OA', 'OP')} = ${F.frac(R0, 'OP')}, so OP = ${F.frac(R0, `sin ${deg(phi)}`)} = <strong>${dp(OP, 2)} cm</strong>.</p>
<p>The tangent length: PA = ${F.frac(R0, `tan ${deg(phi)}`)} = ${dp(PA, 4)} cm.</p>
<p>OAPB is two congruent right triangles: area = 2 &times; ${F.frac(1, 2)} &times; ${R0} &times; ${dp(PA, 4)} = <strong>${dp(area, 2)} cm&sup2;</strong>.</p>`,
		};
	});

	// Cyclic quadrilateral: diagonal via supplementary opposite angles
	add('advgeo-cyclic-trig', 'Advanced Geometry', 'Cyclic quadrilaterals & trig', 4, function (r) {
		let a, b, c, d, cosB, ac2;
		do {
			a = r.int(4, 11); b = r.int(4, 11); c = r.int(4, 11); d = r.int(4, 11);
			cosB = (a * a + b * b - c * c - d * d) / (2 * (a * b + c * d));
			ac2 = a * a + b * b - 2 * a * b * cosB;
		} while (Math.abs(cosB) > 0.9 || ac2 < 2);
		const B = Math.acos(cosB) * DEG;
		const AC = Math.sqrt(ac2);
		return {
			marks: 6,
			text: `Cyclic quadrilateral ABCD has AB = ${a} cm, BC = ${b} cm, CD = ${c} cm and DA = ${d} cm.<br>(i) Show that cos B = ${F.frac(a * a + b * b - c * c - d * d, 2 * (a * b + c * d))}.<br>(ii) Find B to 1 decimal place and diagonal AC to 2 decimal places.`,
			diagram: { type: 'cyclicQuad' },
			answer: multi([dp(B, 1), dp(AC, 2)], ['angle ABC (degrees)', 'AC (cm)'], 0.06),
			solution: `<p>Opposite angles of a cyclic quadrilateral are supplementary, so &ang;ADC = 180&deg; &minus; &ang;ABC and cos(&ang;ADC) = &minus;cos(&ang;ABC).</p>
<p>Cosine rule in triangle ABC: AC<sup>2</sup> = ${a}<sup>2</sup> + ${b}<sup>2</sup> &minus; 2(${a})(${b})cos B.</p>
<p>Cosine rule in triangle ACD: AC<sup>2</sup> = ${c}<sup>2</sup> + ${d}<sup>2</sup> + 2(${c})(${d})cos B.</p>
<p>Setting these equal: cos B = ${F.frac(`${a * a + b * b} &minus; ${c * c + d * d}`, `2(${a * b} + ${c * d})`)} = ${dp(cosB, 4)}, so &ang;ABC = <strong>${dp(B, 1)}&deg;</strong>.</p>
<p>Substituting back: AC<sup>2</sup> = ${dp(ac2, 4)}, so AC = <strong>${dp(AC, 2)} cm</strong>.</p>`,
		};
	});

	// Two-leg bearing journey: distance home and return bearing
	add('advgeo-bearing-return', 'Advanced Geometry', 'Bearings & non-right triangles', 3, function (r) {
		let th1, th2, d1, d2, x, y, dist;
		do {
			th1 = r.int(30, 150); d1 = r.int(5, 12);
			th2 = (th1 + r.int(50, 110)) % 360; d2 = r.int(5, 12);
			x = d1 * Math.sin(rad(th1)) + d2 * Math.sin(rad(th2));
			y = d1 * Math.cos(rad(th1)) + d2 * Math.cos(rad(th2));
			dist = Math.hypot(x, y);
		} while (dist < 2.5);
		const back = (Math.atan2(-x, -y) * DEG + 360) % 360;
		return {
			marks: 5,
			text: `A hiker walks ${d1} km from O on ${String(th1).padStart(3, '0')}&deg;T to A, then ${d2} km on ${String(th2).padStart(3, '0')}&deg;T to B.<br>(i) Show that the east and north displacements are found using d sin &theta; and d cos &theta;.<br>(ii) Find the distance and bearing from B back to O, both correct to 1 decimal place.`,
			diagram: { type: 'bearings', legs: [{ bearing: th1, dist: d1, label: `${d1} km`, bearingLabel: deg(th1) }, { bearing: th2, dist: d2, label: `${d2} km`, bearingLabel: deg(th2) }], names: ['O', 'A', 'B'], close: true },
			answer: multi([dp(dist, 1), dp(back, 1)], ['distance (km)', 'bearing (degrees)'], 0.06),
			solution: `<p>Resolve each leg into east and north components: east = d sin(bearing), north = d cos(bearing).</p>
<p>East: ${d1} sin ${deg(th1)} + ${d2} sin ${deg(th2)} = ${dp(x, 3)} km. North: ${d1} cos ${deg(th1)} + ${d2} cos ${deg(th2)} = ${dp(y, 3)} km.</p>
<p>Distance OB = &radic;(${dp(x, 3)}<sup>2</sup> + ${dp(y, 3)}<sup>2</sup>) = <strong>${dp(dist, 1)} km</strong>.</p>
<p>The return vector is (${dp(-x, 3)}, ${dp(-y, 3)}); converting to a bearing (clockwise from north) gives <strong>${dp(back, 1)}&deg;T</strong>.</p>`,
		};
	});

	// Three sides: largest angle then area
	add('advgeo-heron-angle', 'Advanced Geometry', 'Cosine rule & area', 3, function (r) {
		let a, b, c;
		do { a = r.int(6, 15); b = r.int(6, 15); c = r.int(6, 15); }
		while (a >= b + c - 1 || b >= a + c - 1 || c >= a + b - 1 || (a === b && b === c));
		const big = Math.max(a, b, c);
		const others = [a, b, c].slice();
		others.splice(others.indexOf(big), 1);
		const cosBig = (others[0] ** 2 + others[1] ** 2 - big * big) / (2 * others[0] * others[1]);
		const bigAng = Math.acos(cosBig) * DEG;
		const area = 0.5 * others[0] * others[1] * Math.sin(rad(bigAng));
		return {
			marks: 4,
			text: `A triangle has sides ${a} cm, ${b} cm and ${c} cm.<br>(i) Explain why its largest angle lies opposite the ${big} cm side.<br>(ii) Find that angle and the area, both correct to 1 decimal place.`,
			diagram: { type: 'triangle', a, b, c, sideLabels: [`${a} cm`, `${b} cm`, `${c} cm`] },
			answer: multi([dp(bigAng, 1), dp(area, 1)], ['largest angle (degrees)', 'area (cm&sup2;)'], 0.06),
			solution: `<p>The largest angle is opposite the longest side (${big} cm).</p>
<p>Cosine rule: cos &theta; = ${F.frac(`${others[0]}<sup>2</sup> + ${others[1]}<sup>2</sup> &minus; ${big}<sup>2</sup>`, `2(${others[0]})(${others[1]})`)} = ${dp(cosBig, 4)}.</p>
<p>&theta; = <strong>${dp(bigAng, 1)}&deg;</strong>${cosBig < 0 ? ' (obtuse, as the negative cosine warns)' : ''}.</p>
<p>Area = ${F.frac(1, 2)}(${others[0]})(${others[1]}) sin &theta; = <strong>${dp(area, 1)} cm&sup2;</strong>.</p>`,
		};
	});

	// =====================================================================
	// DEEPER-THINKING ALGEBRA / COORDINATE GEOMETRY
	// =====================================================================

	// Quadratics with a parameter, solved via Vieta
	add('chal-quad-param', 'Algebra', 'Roots with conditions', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			const t = r.sign() * r.int(1, 4), bq = 3 * t, k = 2 * t * t;
			return {
				marks: 3,
				text: `The roots of x<sup>2</sup>${F.st(bq, 'x')}+k=0 are r and 2r.<br>(i) Use the sum of roots to find r.<br>(ii) Hence find k.`,
				answer: num(k, 'k'),
				solution: `<p>Let the roots be r and 2r. The sum of the roots is r + 2r = 3r = ${-bq}.</p>
<p>So r = ${-t}, and the roots are ${-t} and ${-2 * t}.</p>
<p>The product of the roots equals k: k = (${-t})(${-2 * t}) = <strong>${k}</strong>.</p>`,
			};
		}
		if (mode === 1) {
			let bq = r.sign() * r.int(2, 8), dd = r.int(2, 6);
			if ((bq + dd) % 2 !== 0) dd += 1;
			const k = (bq * bq - dd * dd) / 4;
			return {
				marks: 3,
				text: `The roots of x<sup>2</sup>${F.st(bq, 'x')}+k=0 differ by ${dd}.<br>(i) Writing them as m and m+${dd}, use their sum to find m.<br>(ii) Hence find k.`,
				answer: num(k, 'k'),
				solution: `<p>Let the roots be m and m + ${dd}. Their sum is 2m + ${dd} = ${-bq}, so m = ${(-bq - dd) / 2}.</p>
<p>The roots are ${(-bq - dd) / 2} and ${(-bq - dd) / 2 + dd}.</p>
<p>k is their product: k = (${(-bq - dd) / 2})(${(-bq - dd) / 2 + dd}) = <strong>${k}</strong>.</p>`,
			};
		}
		const t = r.sign() * r.int(1, 3), bq = 4 * t, k = 3 * t * t;
		return {
			marks: 3,
			text: `The roots of x<sup>2</sup>${F.st(bq, 'x')}+k=0 are in the ratio 1:3.<br>(i) Let them be r and 3r and find r.<br>(ii) Hence find k.`,
			answer: num(k, 'k'),
			solution: `<p>Let the roots be r and 3r. Their sum is 4r = ${-bq}, so r = ${-t}.</p>
<p>The roots are ${-t} and ${-3 * t}.</p>
<p>k is the product of the roots: k = (${-t})(${-3 * t}) = <strong>${k}</strong>.</p>`,
		};
	});

	// Tangency via the discriminant / distance from centre
	add('chal-tangency', 'Coordinate Geometry', 'Tangency & discriminant', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			let p = r.nonzeroInt(-6, 6), m = r.nonzeroInt(-6, 6);
			if ((p - m) % 2 !== 0) m += 1;
			if (m === 0) m = 2;
			if (m === p) m += 2;
			const q = r.nonzeroInt(-8, 8);
			const cc = q - ((p - m) ** 2) / 4;
			return {
				marks: 4,
				text: `The line y=${F.co(m, 'x')}+c is tangent to y=x&sup2;${F.st(p, 'x')}${F.st(q, '')}.<br>(i) Form the quadratic equation for their intersections.<br>(ii) Show that tangency requires its discriminant to be zero.<br>(iii) Hence find c.`,
				answer: num(cc, 'c'),
				solution: `<p>At an intersection, x<sup>2</sup>${F.st(p, 'x')}${F.st(q, '')} = ${F.co(m, 'x')} + c.</p>
<p>Rearranged: x<sup>2</sup>${F.st(p - m, 'x')} + (${q} &minus; c) = 0. A tangent touches once, so this quadratic needs exactly one solution: discriminant = 0.</p>
<p>(${p - m})<sup>2</sup> &minus; 4(${q} &minus; c) = 0.</p>
<p>Solving: c = ${q} &minus; ${F.frac(`${(p - m) ** 2}`, '4')} = <strong>${cc}</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const t = r.int(1, 5), q = r.int(-5, 9), cc = q - t * t;
			return {
				marks: 4,
				text: `The line y=mx${F.st(cc, '')} may be tangent to y=x&sup2;${F.st(q, '')}.<br>(i) Show that tangency gives m&sup2;=${4 * t * t}.<br>(ii) Hence find both values of m.`,
				answer: multi([-2 * t, 2 * t], ['smaller m', 'larger m']),
				solution: `<p>Intersection: x<sup>2</sup>${F.st(q, '')} = mx${F.st(cc, '')}, i.e. x<sup>2</sup> &minus; mx + ${q - cc} = 0.</p>
<p>Tangency requires the discriminant to vanish: m<sup>2</sup> &minus; 4(${q - cc}) = 0.</p>
<p>m<sup>2</sup> = ${4 * t * t}.</p>
<p><strong>m = ${-2 * t} or m = ${2 * t}</strong> &mdash; the two tangents of this gradient family, one on each side.</p>`,
			};
		}
		const R0 = r.int(2, 8);
		const cc = R0 * Math.SQRT2;
		return {
			marks: 4,
			text: `The line y=x+c is tangent to x&sup2;+y&sup2;=${R0 * R0}.<br>(i) Show that its distance from the origin is |c|/&radic;2.<br>(ii) Hence find both values of c, correct to 2 decimal places.`,
			answer: multi([dp(-cc, 2), dp(cc, 2)], ['smaller c', 'larger c'], 0.006),
			solution: `<p>The circle has centre (0, 0) and radius ${R0}. A tangent line is exactly ${R0} units from the centre.</p>
<p>The distance from (0, 0) to x &minus; y + c = 0 is ${F.frac('|c|', '&radic;2')}.</p>
<p>${F.frac('|c|', '&radic;2')} = ${R0}, so |c| = ${R0}&radic;2 = ${dp(cc, 4)}.</p>
<p><strong>c = ${dp(-cc, 2)} or c = ${dp(cc, 2)}</strong>.</p>`,
		};
	});

	// Surd equations with an extraneous root
	add('chal-surd-eq', 'Algebra', 'Surd equations', 3, function (r) {
		let x0, cc, aa, bb, x1;
		do {
			x0 = r.int(1, 8); cc = r.int(1, 5); aa = r.int(2, 6);
			bb = (x0 + cc) * (x0 + cc) - aa * x0;
			x1 = aa - 2 * cc - x0;
		} while (x0 <= aa - cc || bb < 1 || x1 === x0);
		return {
			marks: 3,
			text: `Consider &radic;(${F.co(aa, 'x')}${F.st(bb, '')})=x${F.st(cc, '')}.<br>(i) Square and factor the resulting quadratic.<br>(ii) Check both candidates in the original equation.<br>(iii) Enter the valid solution.`,
			answer: num(x0, 'x'),
			solution: `<p>Square both sides: ${F.co(aa, 'x')}${F.st(bb, '')} = x<sup>2</sup>${F.st(2 * cc, 'x')}${F.st(cc * cc, '')}.</p>
<p>Rearranged: x<sup>2</sup>${F.st(2 * cc - aa, 'x')}${F.st(cc * cc - bb, '')} = 0, which factors as (x ${x0 >= 0 ? '&minus; ' + x0 : '+ ' + -x0})(x ${x1 >= 0 ? '&minus; ' + x1 : '+ ' + -x1}) = 0.</p>
<p>Candidates: x = ${x0} and x = ${x1}. Squaring can create false solutions, so both must be checked against the original equation.</p>
<p>x = ${x1} gives a right-hand side of ${x1 + cc}, which is negative &mdash; but a square root is never negative, so it is rejected. <strong>x = ${x0}</strong>.</p>`,
		};
	});

	// =====================================================================
	// DEEPER-THINKING LOGARITHMS
	// =====================================================================

	add('chal-log-nocalc', 'Logarithms', 'Logs without a calculator', 3, function (r) {
		const p = 0.301, q = 0.477;
		const item = r.pick([
			{ n: '12', v: 2 * p + q, e: 'log 12 = log(2<sup>2</sup> &times; 3) = 2 log 2 + log 3' },
			{ n: '18', v: p + 2 * q, e: 'log 18 = log(2 &times; 3<sup>2</sup>) = log 2 + 2 log 3' },
			{ n: '24', v: 3 * p + q, e: 'log 24 = log(2<sup>3</sup> &times; 3) = 3 log 2 + log 3' },
			{ n: '36', v: 2 * p + 2 * q, e: 'log 36 = log(2<sup>2</sup> &times; 3<sup>2</sup>) = 2 log 2 + 2 log 3' },
			{ n: '48', v: 4 * p + q, e: 'log 48 = log(2<sup>4</sup> &times; 3) = 4 log 2 + log 3' },
			{ n: '54', v: p + 3 * q, e: 'log 54 = log(2 &times; 3<sup>3</sup>) = log 2 + 3 log 3' },
			{ n: '72', v: 3 * p + 2 * q, e: 'log 72 = log(2<sup>3</sup> &times; 3<sup>2</sup>) = 3 log 2 + 2 log 3' },
			{ n: '5', v: 1 - p, e: 'log 5 = log(10/2) = log 10 &minus; log 2 = 1 &minus; log 2' },
			{ n: '15', v: 1 - p + q, e: 'log 15 = log(3 &times; 10/2) = log 3 + 1 &minus; log 2' },
			{ n: '45', v: 1 - p + 2 * q, e: 'log 45 = log(3<sup>2</sup> &times; 10/2) = 2 log 3 + 1 &minus; log 2' },
			{ n: '2.25', v: 2 * q - 2 * p, e: 'log 2.25 = log(9/4) = 2 log 3 &minus; 2 log 2' },
			{ n: '13.5', v: 3 * q - p, e: 'log 13.5 = log(27/2) = 3 log 3 &minus; log 2' },
		]);
		return {
			marks: 3,
			text: `Given log<sub>10</sub>2 &asymp; 0.301 and log<sub>10</sub>3 &asymp; 0.477:<br>(i) Express ${item.n} using factors of 2, 3 and 10.<br>(ii) Hence evaluate log<sub>10</sub>${item.n} without a calculator, correct to 3 decimal places.`,
			answer: num(dp(item.v, 3), `log<sub>10</sub> ${item.n}`, 0.003),
			solution: `<p>${item.e}.</p>
<p>Substituting the given values leads to the total step by step.</p>
<p>= <strong>${dp(item.v, 3)}</strong>.</p>`,
		};
	});

	add('chal-exp-model', 'Logarithms', 'Exponential modelling', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			const T = r.int(3, 9), M = r.pick([5, 10, 20, 50]);
			const t = T * Math.log(M) / Math.log(2);
			return {
				marks: 4,
				text: `A colony doubles every ${T} hours.<br>(i) Show that N/N<sub>0</sub>=2<sup>t/${T}</sup>.<br>(ii) Hence find when it is ${M} times its original size, correct to 1 decimal place.`,
				answer: num(dp(t, 1), 'hours', 0.06),
				solution: `<p>Set up 2<sup>t/${T}</sup> = ${M}.</p>
<p>Take logarithms: ${F.frac('t', String(T))} log 2 = log ${M}.</p>
<p>t = ${T} &times; ${F.frac(`log ${M}`, 'log 2')} = ${T} &times; ${dp(Math.log(M) / Math.log(2), 4)}.</p>
<p>= <strong>${dp(t, 1)} hours</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const H = 5 * r.int(1, 6), fPct = r.pick([20, 10, 5, 1]);
			const t = H * Math.log(100 / fPct) / Math.log(2);
			return {
				marks: 4,
				text: `A sample has half-life ${H} years.<br>(i) Show that its remaining fraction is (1/2)<sup>t/${H}</sup>.<br>(ii) Find when ${fPct}% remains, correct to 1 decimal place.`,
				answer: num(dp(t, 1), 'years', 0.06),
				solution: `<p>After t years the fraction remaining is (${F.frac(1, 2)})<sup>t/${H}</sup>.</p>
<p>Solve (${F.frac(1, 2)})<sup>t/${H}</sup> = ${fPct / 100}. Taking logs: ${F.frac('t', String(H))} log 0.5 = log ${fPct / 100}.</p>
<p>t = ${H} &times; ${F.frac(`log ${fPct / 100}`, 'log 0.5')} = ${H} &times; ${dp(Math.log(fPct / 100) / Math.log(0.5), 4)}.</p>
<p>= <strong>${dp(t, 1)} years</strong>.</p>`,
			};
		}
		const g = r.int(4, 12), M = r.pick([2, 3, 5]);
		const t = Math.log(M) / Math.log(1 + g / 100);
		return {
			marks: 4,
			text: `An investment grows by ${g}% yearly.<br>(i) Show that V/V<sub>0</sub>=${dp(1 + g / 100, 2)}<sup>t</sup>.<br>(ii) Find the model time at which it reaches ${M} times its starting value, correct to 1 decimal place.`,
			answer: num(dp(t, 1), 'years', 0.06),
			solution: `<p>Solve (1 + ${g}/100)<sup>t</sup> = ${M}, i.e. ${dp(1 + g / 100, 2)}<sup>t</sup> = ${M}.</p>
<p>Take logs of both sides: t log ${dp(1 + g / 100, 2)} = log ${M}.</p>
<p>t = ${F.frac(`log ${M}`, `log ${dp(1 + g / 100, 2)}`)} = ${F.frac(dp(Math.log(M), 4), dp(Math.log(1 + g / 100), 4))} (natural logs work equally well).</p>
<p>= <strong>${dp(t, 1)} years</strong>.</p>`,
		};
	});

	// =====================================================================
	// OPTIMISATION (max/min via completing the square)
	// =====================================================================

	add('chal-optimise', 'Algebra', 'Optimisation', 3, function (r) {
		const mode = r.pick([0, 1, 2]);
		if (mode === 0) {
			const Fm = 4 * r.pick([10, 12, 14, 16, 20, 25]);
			const x = Fm / 4, A = Fm * Fm / 8;
			return {
				marks: 4,
				text: `A farmer uses ${Fm} m of fencing for three sides of a rectangle against a wall.<br>(i) Show that A=x(${Fm}&minus;2x), where x is its width.<br>(ii) Hence find the width and maximum area.`,
				answer: multi([x, A], ['width (m)', 'max area (m&sup2;)']),
				solution: `<p>Let the width be x. Then the length is ${Fm} &minus; 2x, and the area is A = x(${Fm} &minus; 2x) = ${Fm}x &minus; 2x<sup>2</sup>.</p>
<p>This is a downward parabola; its maximum is at the vertex: x = ${F.frac(String(Fm), '4')} = ${x}.</p>
<p>The paddock is then ${x} m by ${Fm - 2 * x} m &mdash; note it is <em>not</em> a square, because the wall replaces one side.</p>
<p><strong>Width = ${x} m, maximum area = ${A} m&sup2;</strong>.</p>`,
			};
		}
		if (mode === 1) {
			const k = r.int(2, 6), v = 10 * k, h0 = r.int(0, 2);
			const t = k / 1, hmax = 5 * k * k + h0;
			return {
				marks: 4,
				text: `A ball has height h=&minus;5t&sup2;${F.st(v, 't')}${h0 ? F.st(h0, '') : ''} metres.<br>(i) Complete the square to show the turning point is a maximum.<br>(ii) Find its time and height.`,
				answer: multi([t, hmax], ['time (s)', 'max height (m)']),
				solution: `<p>The height is a downward parabola in t, so the maximum occurs at the vertex.</p>
<p>t = ${F.frac('&minus;b', '2a')} = ${F.frac(String(v), '10')} = ${t} s.</p>
<p>Substitute back: h = &minus;5(${t})<sup>2</sup> + ${v}(${t})${h0 ? ' + ' + h0 : ''} = ${hmax}.</p>
<p><strong>t = ${t} s, greatest height = ${hmax} m</strong>.</p>`,
			};
		}
		const k = r.int(2, 6), bq = 6 * k, c = r.int(5, 40);
		const x = k, P = 3 * k * k + c;
		return {
			marks: 4,
			text: `Daily profit is P=&minus;3x&sup2;${F.st(bq, 'x')}${F.st(c, '')} dollars.<br>(i) Complete the square to show P has a maximum.<br>(ii) Find the number of items and maximum profit.`,
			answer: multi([x, P], ['items', 'max profit ($)']),
			solution: `<p>P is a downward parabola, so the maximum is at the vertex.</p>
<p>x = ${F.frac('&minus;b', '2a')} = ${F.frac(String(bq), '6')} = ${x}.</p>
<p>P(${x}) = &minus;3(${x})<sup>2</sup> + ${bq}(${x}) + ${c} = ${P}.</p>
<p><strong>${x} items, maximum profit $${P}</strong>.</p>`,
		};
	});

	// =====================================================================
	// DEEPER PROBABILITY
	// =====================================================================

	// Reverse conditional probability (Bayes reasoning via counts / trees)
	add('chal-bayes', 'Probability & Statistics', 'Conditional probability', 3, function (r) {
		if (r.next() < 0.5) {
			const p = r.pick([2, 4, 5, 10]), sens = r.pick([85, 90, 95]), fp = r.pick([5, 8, 10, 15]);
			const tp = p * sens, fpos = (100 - p) * fp;
			const ans = tp / (tp + fpos);
			return {
				marks: 4,
				text: `${p}% of a population has a condition. A test has ${sens}% sensitivity and a ${fp}% false-positive rate.<br>(i) For 10&thinsp;000 people, find the true- and false-positive counts.<br>(ii) Hence find P(condition | positive), correct to 3 decimal places.`,
				answer: num(dp(ans, 3), 'probability', 0.002),
				solution: `<p>Imagine 10&thinsp;000 people: ${100 * p} have the condition and ${10000 - 100 * p} do not.</p>
<p>True positives: ${sens}% of ${100 * p} = ${tp}. False positives: ${fp}% of ${10000 - 100 * p} = ${fpos}.</p>
<p>So ${tp + fpos} people test positive in total, of whom ${tp} really have the condition.</p>
<p>P(condition | positive) = ${F.frac(String(tp), String(tp + fpos))} = <strong>${dp(ans, 3)}</strong> &mdash; often surprisingly low, because false positives outnumber true ones.</p>`,
			};
		}
		const nA = r.pick([5, 6, 8, 10]), rA = r.int(1, nA - 1);
		const nB = r.pick([5, 6, 8, 10]), rB = r.int(1, nB - 1);
		const pA = rA / nA, pB = rB / nB;
		const ans = (0.5 * pA) / (0.5 * pA + 0.5 * pB);
		return {
			marks: 4,
			text: `Bag A has ${rA} red and ${nA - rA} blue marbles; B has ${rB} red and ${nB - rB} blue. A fair coin chooses a bag, then a red marble is drawn.<br>(i) Find P(A and red) and P(B and red).<br>(ii) Hence find P(A | red), correct to 3 decimal places.`,
			diagram: { type: 'tree2', stage1: [{ label: 'Bag A', prob: '1/2' }, { label: 'Bag B', prob: '1/2' }], stage2: [[{ label: 'red', prob: `${rA}/${nA}` }, { label: 'blue', prob: `${nA - rA}/${nA}` }], [{ label: 'red', prob: `${rB}/${nB}` }, { label: 'blue', prob: `${nB - rB}/${nB}` }]] },
			answer: num(dp(ans, 3), 'probability', 0.002),
			solution: `<p>P(A and red) = ${F.frac(1, 2)} &times; ${F.frac(rA, nA)} = ${dp(0.5 * pA, 4)}; P(B and red) = ${F.frac(1, 2)} &times; ${F.frac(rB, nB)} = ${dp(0.5 * pB, 4)}.</p>
<p>P(red) = ${dp(0.5 * pA, 4)} + ${dp(0.5 * pB, 4)} = ${dp(0.5 * pA + 0.5 * pB, 4)}.</p>
<p>P(A | red) = ${F.frac('P(A and red)', 'P(red)')} = ${F.frac(dp(0.5 * pA, 4), dp(0.5 * pA + 0.5 * pB, 4))}.</p>
<p>= <strong>${dp(ans, 3)}</strong>.</p>`,
		};
	});

	// "Smallest n" with the complement + logarithms
	add('chal-atleast-n', 'Probability & Statistics', 'Smallest n problems', 3, function (r) {
		const setup = r.pick([
			{ p: 1 / 6, one: 'rolls of a fair die', ev: 'at least one six', single: 'a six on one roll is 1/6' },
			{ p: 1 / 4, one: 'draws (with replacement) from a suit-marked deck', ev: 'at least one heart', single: 'a heart on one draw is 1/4' },
			{ p: 0.3, one: 'shots by a basketballer who scores 30% of attempts', ev: 'at least one score', single: 'scoring on one shot is 0.3' },
			{ p: 0.2, one: 'attempts at a claw machine with a 20% win rate', ev: 'at least one win', single: 'winning one attempt is 0.2' },
		]);
		const target = r.pick([0.8, 0.9, 0.95, 0.99]);
		const exact = Math.log(1 - target) / Math.log(1 - setup.p);
		const n = Math.ceil(exact - 1e-12);
		return {
			marks: 3,
			text: `Independent ${setup.one} are made.<br>(i) Show that P(${setup.ev})=1&minus;(${dp(1 - setup.p, 4)})<sup>n</sup>.<br>(ii) Hence find the smallest n for which this probability is greater than ${target}.`,
			answer: num(n, 'smallest n'),
			solution: `<p>The probability of ${setup.single}, so the probability of failing every time in n trials is (${dp(1 - setup.p, 4)})<sup>n</sup>.</p>
<p>We need 1 &minus; (${dp(1 - setup.p, 4)})<sup>n</sup> &gt; ${target}, i.e. (${dp(1 - setup.p, 4)})<sup>n</sup> &lt; ${dp(1 - target, 2)}.</p>
<p>Taking logs (and flipping the inequality, since log of a number below 1 is negative): n &gt; ${F.frac(`log ${dp(1 - target, 2)}`, `log ${dp(1 - setup.p, 4)}`)} = ${dp(exact, 2)}.</p>
<p>The smallest whole number is <strong>n = ${n}</strong>.</p>`,
		};
	});

	// =====================================================================
	// BOSS: chained geometry + trig
	// =====================================================================

	add('boss-tower-two-angles', 'Boss', 'Sine rule + elevation', 4, function (r) {
		const d = 5 * r.int(8, 18);
		let beta, gamma;
		do { beta = r.int(40, 70); gamma = r.int(40, 70); } while (beta + gamma > 130);
		const alpha = r.int(15, 40);
		const AT = d * Math.sin(rad(gamma)) / Math.sin(rad(beta + gamma));
		const h = AT * Math.tan(rad(alpha));
		const br = (i, s) => `<br><strong>(${i})</strong> ${s}`;
		return {
			marks: 6,
			text: `Observers A and B are ${d} m apart on level ground. Tower base T is also on this level. &ang;TAB=${deg(beta)}, &ang;TBA=${deg(gamma)}, and the elevation of the top from A is ${deg(alpha)}.${br('i', `Show that &ang;ATB=${deg(180 - beta - gamma)}.`)}${br('ii', `Find AT, correct to 1 decimal place.`)}${br('iii', `Hence find the tower height, correct to 1 decimal place.`)}`,
			answer: multi([dp(AT, 1), dp(h, 1)], ['AT (m)', 'height (m)'], 0.06),
			solution: `<p>(i) In triangle ABT, the angle at T is 180&deg; &minus; ${beta}&deg; &minus; ${gamma}&deg; = ${180 - beta - gamma}&deg;.</p>
<p>Sine rule: ${F.frac('AT', `sin ${deg(gamma)}`)} = ${F.frac(String(d), `sin ${deg(180 - beta - gamma)}`)}, so AT = ${dp(AT, 3)} &asymp; <strong>${dp(AT, 1)} m</strong>.</p>
<p>(ii) The tower is vertical, so triangle (A, T, top) is right-angled at T, entirely in a vertical plane.</p>
<p>h = AT tan ${deg(alpha)} = ${dp(AT, 3)} &times; ${dp(Math.tan(rad(alpha)), 4)} = <strong>${dp(h, 1)} m</strong>.</p>`,
		};
	});

	add('boss-circle-chain', 'Boss', 'Circle geometry + trig', 4, function (r) {
		const R0 = r.int(5, 12), th = 2 * r.int(30, 70); // even 60..140
		const chord = 2 * R0 * Math.sin(rad(th / 2));
		const seg = 0.5 * R0 * R0 * (rad(th) - Math.sin(rad(th)));
		const br = (i, s) => `<br><strong>(${i})</strong> ${s}`;
		return {
			marks: 6,
			text: `A and B lie on a circle with centre O and radius ${R0} cm, with &ang;AOB = ${deg(th)}. P is a point on the major arc AB.${br('i', 'Find the length of the chord AB, correct to 2 decimal places.')}${br('ii', 'Write down the size of &ang;APB in degrees.')}${br('iii', 'Find the area of the minor segment cut off by AB, correct to 2 decimal places.')}`,
			diagram: { type: 'angleAtCentre', centralLabel: deg(th), circumLabel: 'x' },
			answer: multi([dp(chord, 2), th / 2, dp(seg, 2)], ['AB (cm)', '&ang;APB (degrees)', 'segment area (cm&sup2;)'], 0.006),
			solution: `<p>(i) Halve the isosceles triangle AOB: AB = 2 &times; ${R0} sin ${deg(th / 2)} = <strong>${dp(chord, 2)} cm</strong>.</p>
<p>(ii) The angle at the centre is twice the angle at the circumference standing on the same arc.</p>
<p>&ang;APB = ${F.frac(String(th), '2')} = <strong>${th / 2}&deg;</strong>.</p>
<p>(iii) Minor segment = sector &minus; triangle = ${F.frac(1, 2)}r<sup>2</sup>(&theta; &minus; sin &theta;) with &theta; = ${dp(rad(th), 4)} rad.</p>
<p>= ${F.frac(1, 2)}(${R0})<sup>2</sup>(${dp(rad(th), 4)} &minus; ${dp(Math.sin(rad(th)), 4)}) = <strong>${dp(seg, 2)} cm&sup2;</strong>.</p>`,
		};
	});
})();
