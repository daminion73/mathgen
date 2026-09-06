// Boss batch 2: geometry, trig and 3D multi-part chains.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const rad = MG.degToRad;
	const dp = (x, d) => MG.round(x, d);
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 3, gen });
	const num = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const deg = (x) => `${x}&deg;`;
	const br = (i, s) => `<br><strong>(${i})</strong> ${s}`;
	const DEG = 180 / Math.PI;
	const solid = (verts, edges, extras = {}) => ({ type: 'solid3d', verts, edges, ...extras });

	// 1. Sector folded into a cone
	boss('boss2-sector-cone', 'Sectors + Cones', function (r) {
		const combos = [];
		for (const [th, m] of [[90, 4], [120, 3], [144, 5], [180, 2], [216, 5], [240, 3], [270, 4]]) {
			for (let R = m; R <= 20; R += m) {
				const rb = R * th / 360;
				if (R >= 8 && rb >= 3 && rb <= R - 2) combos.push([th, R]);
			}
		}
		const [th, R] = r.pick(combos);
		const rb = R * th / 360;
		const h = Math.sqrt(R * R - rb * rb);
		const V = Math.PI * rb * rb * h / 3;
		return {
			marks: 6,
			diagram: { type: 'sector', angle: th, rLabel: `${R} cm`, angleLabel: deg(th) },
			text: `A sector of radius ${R} cm and angle ${deg(th)} is cut from card, and its two straight edges are taped together to form a cone, so the sector radius becomes the slant height.${br('i', 'Find the base radius of the cone.')}${br('ii', 'Find the vertical height of the cone, correct to 1 decimal place.')}${br('iii', 'Find the volume of the cone, correct to 1 decimal place.')}`,
			answer: multi([rb, dp(h, 1), dp(V, 1)], ['base radius (cm)', 'height (cm)', 'volume (cm&sup3;)'], 0.06),
			solution: `<p>(i) The arc of the sector becomes the base circumference: ${F.frac(String(th), '360')} &times; 2&pi; &times; ${R} = 2&pi;r, so r = ${F.frac(`${th} &times; ${R}`, '360')} = <strong>${rb} cm</strong>.</p>
<p>(ii) The slant height is ${R} cm, so by Pythagoras h = &radic;(${R}&sup2; &minus; ${rb}&sup2;) = &radic;${R * R - rb * rb} = <strong>${dp(h, 1)} cm</strong>.</p>
<p>(iii) V = ${F.frac('1', '3')}&pi;r&sup2;h = ${F.frac('1', '3')}&pi; &times; ${rb * rb} &times; ${dp(h, 2)} = <strong>${dp(V, 1)} cm&sup3;</strong>.</p>`,
		};
	});

	// 2. Cosine rule -> sine rule -> area
	boss('boss2-cosine-sine-area', 'Cosine rule + Sine rule', function (r) {
		const a = r.int(5, 12);
		let b; do { b = r.int(5, 12); } while (b === a);
		const C = r.int(90, 125);
		const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C)));
		const A = Math.asin(a * Math.sin(rad(C)) / c) * DEG;
		const area = 0.5 * a * b * Math.sin(rad(C));
		return {
			marks: 6,
			text: `In triangle ABC, side a = BC = ${a} cm, side b = AC = ${b} cm and the included angle C = ${deg(C)}. Give answers correct to 1 decimal place.${br('i', 'Find the third side c = AB.')}${br('ii', 'Find angle A.')}${br('iii', 'Find the area of the triangle.')}`,
			diagram: { type: 'triangle', a, b, c, labels: ['A', 'B', 'C'], sideLabels: [`${a} cm`, `${b} cm`, ''], angleLabels: ['', '', `${C}°`] },
			answer: multi([dp(c, 1), dp(A, 1), dp(area, 1)], ['c (cm)', 'angle A (degrees)', 'area (cm&sup2;)'], 0.06),
			solution: `<p>(i) Cosine rule: c&sup2; = ${a}&sup2; + ${b}&sup2; &minus; 2 &times; ${a} &times; ${b} cos ${deg(C)} = ${dp(c * c, 2)}, so c = <strong>${dp(c, 1)} cm</strong>.</p>
<p>(ii) Sine rule: ${F.frac('sin A', String(a))} = ${F.frac(`sin ${C}&deg;`, 'c')}, so sin A = ${dp(a * Math.sin(rad(C)) / c, 4)} and A = <strong>${dp(A, 1)}&deg;</strong>. (Since C is obtuse, A must be acute, so the sine inverse gives the correct angle.)</p>
<p>(iii) Area = ${F.frac('1', '2')}ab sin C = ${F.frac('1', '2')} &times; ${a} &times; ${b} &times; sin ${deg(C)} = <strong>${dp(area, 1)} cm&sup2;</strong>.</p>`,
		};
	});

	// 3. Cuboid diagonals and angle
	boss('boss2-cuboid-diagonal', 'Cuboids + 3D Pythagoras', function (r) {
		const a = r.int(4, 12), b = r.int(3, 10), c = r.int(3, 9);
		const d1 = Math.sqrt(a * a + b * b);
		const d2 = Math.sqrt(a * a + b * b + c * c);
		const ang = Math.atan(c / d1) * DEG;
		return {
			marks: 6,
			diagram: solid({ A:[0,0,0], B:[a,0,0], C:[a,b,0], D:[0,b,0], E:[0,0,c], F:[a,0,c], G:[a,b,c], H:[0,b,c] }, [['A','B',{label:`${a} cm`}],['B','C',{label:`${b} cm`}],['C','D',{dash:true}],['D','A',{dash:true}],['E','F'],['F','G'],['G','H'],['H','E'],['A','E',{label:`${c} cm`}],['B','F'],['C','G'],['D','H',{dash:true}],['A','C',{dash:true,accent:true,label:'AC'}],['A','G',{accent:true,label:'AG'}]], { angles:[{at:'A',from:'C',to:'G',label:'&theta;'}], rightAngles:[{at:'C',from:'G',to:'A'}] }),
			text: `A cuboid ABCD&ndash;EFGH measures ${a} cm by ${b} cm by ${c} cm (the last is the height). Give answers correct to 1 decimal place.${br('i', 'Show that triangle ACG is right-angled at C, then find AC.')}${br('ii', 'Hence find the longest diagonal AG.')}${br('iii', 'Hence find the angle AG makes with the base.')}`,
			answer: multi([dp(d1, 1), dp(d2, 1), dp(ang, 1)], ['base diagonal (cm)', 'space diagonal (cm)', 'angle (degrees)'], 0.06),
			solution: `<p>(i) Base diagonal = &radic;(${a}&sup2; + ${b}&sup2;) = &radic;${a * a + b * b} = <strong>${dp(d1, 1)} cm</strong>.</p>
<p>(ii) The space diagonal is the hypotenuse of a right triangle whose legs are the base diagonal and the height: &radic;(${a * a + b * b} + ${c}&sup2;) = &radic;${a * a + b * b + c * c} = <strong>${dp(d2, 1)} cm</strong>.</p>
<p>(iii) In that same right triangle, tan &theta; = ${F.frac(String(c), `&radic;${a * a + b * b}`)}, so &theta; = <strong>${dp(ang, 1)}&deg;</strong>.</p>`,
		};
	});

	// 4. Square pyramid built on a Pythagorean triple
	boss('boss2-square-pyramid', 'Pyramids + Surface area', function (r) {
		const T = r.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [8, 15, 17], [15, 8, 17]]);
		const k = r.pick([1, 2]);
		const u = k * T[0], h = k * T[1], l = k * T[2];
		const s = 2 * u;
		const tsa = s * s + 2 * s * l;
		const V = 4 * u * u * h / 3;
		const ang = Math.atan(h / u) * DEG;
		return {
			marks: 7,
			diagram: solid({ A:[-u,-u,0], B:[u,-u,0], C:[u,u,0], D:[-u,u,0], O:[0,0,0], M:[0,-u,0], T:[0,0,h] }, [['A','B',{label:`${s} cm`}],['B','C'],['C','D',{dash:true}],['D','A',{dash:true}],['T','A'],['T','B'],['T','C'],['T','D',{dash:true}],['T','O',{dash:true,accent:true,label:`${h} cm`}],['O','M',{dash:true}],['T','M',{accent:true,label:'l'}]], { faces:[['A','B','T']], rightAngles:[{at:'O',from:'T',to:'M'}], angles:[{at:'M',from:'O',to:'T',label:'&theta;'}] }),
			text: `A right pyramid has a square base of side ${s} cm and vertical height ${h} cm (the apex is above the centre of the base).${br('i', 'Find the slant height from the apex to the midpoint of a base edge.')}${br('ii', 'Find the total surface area (base included).')}${br('iii', 'Find the volume.')}${br('iv', 'Find the angle between a triangular face and the base, correct to 1 decimal place.')}`,
			answer: multi([l, tsa, V, dp(ang, 1)], ['slant height (cm)', 'surface area (cm&sup2;)', 'volume (cm&sup3;)', 'angle (degrees)'], 0.06),
			solution: `<p>(i) The apex sits above the centre, ${u} cm from the midpoint of each edge. Pythagoras: l = &radic;(${u}&sup2; + ${h}&sup2;) = <strong>${l} cm</strong>.</p>
<p>(ii) Four triangular faces of area ${F.frac('1', '2')} &times; ${s} &times; ${l} plus the base: ${s}&sup2; + 4 &times; ${s * l / 2} = <strong>${tsa} cm&sup2;</strong>.</p>
<p>(iii) V = ${F.frac('1', '3')} &times; base area &times; height = ${F.frac('1', '3')} &times; ${s * s} &times; ${h} = <strong>${V} cm&sup3;</strong>.</p>
<p>(iv) The face rises ${h} cm over a horizontal run of ${u} cm, so tan &theta; = ${F.frac(String(h), String(u))} and &theta; = <strong>${dp(ang, 1)}&deg;</strong>.</p>`,
		};
	});

	// 5. Regular polygon inscribed in a circle
	boss('boss2-polygon-in-circle', 'Polygons + Circle trig', function (r) {
		const n = r.int(5, 10), R = r.int(4, 12);
		const half = 180 / n;
		const side = 2 * R * Math.sin(rad(half));
		const apo = R * Math.cos(rad(half));
		const area = 0.5 * n * R * R * Math.sin(rad(360 / n));
		return {
			marks: 6,
			diagram: { type: 'polygon', n, inscribed: true, radiusLabel: `${R} cm` },
			text: `A regular ${n}-sided polygon is inscribed in a circle of radius ${R} cm. Give lengths correct to 2 decimal places and the area correct to 1 decimal place.${br('i', 'Find the length of one side. <em>Hint: an isosceles triangle at the centre.</em>')}${br('ii', 'Find the apothem (the distance from the centre to the midpoint of a side).')}${br('iii', 'Find the area of the polygon.')}`,
			answer: multi([dp(side, 2), dp(apo, 2), dp(area, 1)], ['side (cm)', 'apothem (cm)', 'area (cm&sup2;)'], 0.06),
			solution: `<p>(i) Each side subtends ${F.frac('360&deg;', String(n))} = ${deg(dp(360 / n, 1))} at the centre. Half of the isosceles triangle gives side = 2 &times; ${R} sin ${deg(dp(half, 1))} = <strong>${dp(side, 2)} cm</strong>.</p>
<p>(ii) The apothem is the adjacent side of that half-triangle: ${R} cos ${deg(dp(half, 1))} = <strong>${dp(apo, 2)} cm</strong>.</p>
<p>(iii) The polygon is ${n} triangles of area ${F.frac('1', '2')}R&sup2; sin ${deg(dp(360 / n, 1))}, giving ${F.frac('1', '2')} &times; ${n} &times; ${R}&sup2; &times; sin ${deg(dp(360 / n, 1))} = <strong>${dp(area, 1)} cm&sup2;</strong>.</p>`,
		};
	});

	// 6. Arc, sector, segment
	boss('boss2-arc-segment', 'Sectors + Segments', function (r) {
		const R = r.int(5, 12), th = 10 * r.int(5, 14);
		const arc = R * rad(th);
		const sector = th / 360 * Math.PI * R * R;
		const seg = sector - 0.5 * R * R * Math.sin(rad(th));
		return {
			marks: 6,
			diagram: { type: 'sector', angle: th, rLabel: `${R} cm`, angleLabel: deg(th), segment: true },
			text: `A sector of a circle has radius ${R} cm and angle ${deg(th)}. Give answers correct to 1 decimal place.${br('i', 'Find the arc length.')}${br('ii', 'Find the area of the sector.')}${br('iii', 'Find the area of the segment cut off by the chord joining the ends of the arc.')}`,
			answer: multi([dp(arc, 1), dp(sector, 1), dp(seg, 1)], ['arc length (cm)', 'sector area (cm&sup2;)', 'segment area (cm&sup2;)'], 0.06),
			solution: `<p>(i) Arc = ${F.frac(String(th), '360')} &times; 2&pi; &times; ${R} = <strong>${dp(arc, 1)} cm</strong>.</p>
<p>(ii) Sector = ${F.frac(String(th), '360')} &times; &pi; &times; ${R}&sup2; = <strong>${dp(sector, 1)} cm&sup2;</strong>.</p>
<p>(iii) Segment = sector &minus; triangle = ${dp(sector, 2)} &minus; ${F.frac('1', '2')} &times; ${R}&sup2; sin ${deg(th)} = ${dp(sector, 2)} &minus; ${dp(0.5 * R * R * Math.sin(rad(th)), 2)} = <strong>${dp(seg, 1)} cm&sup2;</strong>.</p>`,
		};
	});

	// 7. Common tangents to two circles
	boss('boss2-two-circles-tangent', 'Tangents + Two circles', function (r) {
		let p, Le, d, rr, R;
		do {
			const T = r.pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25], [7, 24, 25], [20, 21, 29], [10, 24, 26], [18, 24, 30]]);
			[p, Le, d] = T;
			const rmax = Math.floor((d - p - 1) / 2);
			if (rmax < 1) { rr = 0; continue; }
			rr = r.int(1, Math.min(rmax, 8));
			R = p + rr;
		} while (!rr || Le === R || Le === rr || R + rr >= d);
		const Li = Math.sqrt(d * d - (R + rr) * (R + rr));
		const diff = Le - Li;
		return {
			marks: 6,
			diagram: { type: 'circles2', r1: R, r2: rr, r1Label: `${R} cm`, r2Label: `${rr} cm`, distLabel: `${d} cm`, tangentLine: true },
			text: `Two circles have radii ${R} cm and ${rr} cm, and their centres are ${d} cm apart, so the circles do not touch or overlap. Give answers correct to 1 decimal place where necessary.${br('i', 'Find the length of a common external tangent (touching both circles on the same side). <em>Hint: draw the line joining the centres and a rectangle-plus-triangle.</em>')}${br('ii', 'Find the length of a common internal tangent (crossing between the circles).')}${br('iii', 'How much longer is the external tangent than the internal one?')}`,
			answer: multi([Le, dp(Li, 1), dp(diff, 1)], ['external tangent (cm)', 'internal tangent (cm)', 'difference (cm)'], 0.06),
			solution: `<p>(i) Sliding the tangent to pass through the smaller centre gives a right triangle with hypotenuse ${d} and one leg equal to the difference of radii, ${R} &minus; ${rr} = ${p}. So L = &radic;(${d}&sup2; &minus; ${p}&sup2;) = <strong>${Le} cm</strong>.</p>
<p>(ii) For the internal tangent the relevant leg is the sum of radii, ${R + rr}: L = &radic;(${d}&sup2; &minus; ${R + rr}&sup2;) = &radic;${d * d - (R + rr) * (R + rr)} = <strong>${dp(Li, 1)} cm</strong>.</p>
<p>(iii) ${Le} &minus; ${dp(Li, 2)} = <strong>${dp(diff, 1)} cm</strong>.</p>`,
		};
	});

	// 8. Water in an inverted cone (similar solids)
	boss('boss2-cone-water', 'Similar solids + Volume', function (r) {
		let numr, den, H, Rb, srad;
		do {
			[numr, den] = r.pick([[1, 2], [2, 3], [3, 4], [3, 5]]);
			H = den * r.int(2, 5);
			Rb = den * r.int(1, 3);
			srad = Rb * numr / den;
		} while (srad === H || srad < 2);
		const pct = Math.pow(numr / den, 3) * 100;
		const halfDepth = H / Math.pow(2, 1 / 3);
		return {
			marks: 6,
			diagram: { type: 'cone', inverted: true, rLabel: `${Rb} cm`, hLabel: `${H} cm`, fillFrac: numr / den, fillLabel: `${F.frac(String(numr), String(den))} height` },
			text: `An inverted cone (point down) has height ${H} cm and top radius ${Rb} cm. Water is poured in to a depth of ${F.frac(String(numr), String(den))} of the height. Give answers correct to 1 decimal place where necessary.${br('i', 'Find the radius of the circular water surface.')}${br('ii', 'What percentage of the cone&rsquo;s volume is filled?')}${br('iii', 'Find the depth of water when the cone is exactly half full by volume.')}`,
			answer: multi([srad, dp(pct, 1), dp(halfDepth, 1)], ['surface radius (cm)', 'filled (%)', 'depth (cm)'], 0.06),
			solution: `<p>(i) The water forms a cone similar to the whole cone with scale factor ${F.frac(String(numr), String(den))}, so its radius is ${F.frac(String(numr), String(den))} &times; ${Rb} = <strong>${srad} cm</strong>.</p>
<p>(ii) Volumes of similar solids scale with the cube: (${F.frac(String(numr), String(den))})&sup3; = ${dp(Math.pow(numr / den, 3), 4)}, i.e. <strong>${dp(pct, 1)}%</strong>.</p>
<p>(iii) Half full needs scale factor k with k&sup3; = ${F.frac('1', '2')}, so k = 2<sup>&minus;1/3</sup> &asymp; ${dp(1 / Math.pow(2, 1 / 3), 4)} and depth = ${H}k = <strong>${dp(halfDepth, 1)} cm</strong>.</p>`,
		};
	});

	// 9. Frustum from a cut cone
	boss('boss2-frustum', 'Frustums + Similarity', function (r) {
		let q, p, w, c, H, t, h, Rb, rcut;
		do {
			q = r.int(3, 6); p = r.int(1, q - 1); w = r.int(1, 3); c = r.int(2, 4);
			H = c * q; t = c * p; h = H - t; Rb = q * w; rcut = p * w;
		} while (rcut < 2 || rcut === H || rcut === h || rcut === Rb);
		const Vfrust = Math.PI / 3 * (Rb * Rb * H - rcut * rcut * t);
		const pct = Math.pow(p / q, 3) * 100;
		return {
			marks: 6,
			diagram: { type: 'cone', rLabel: `${Rb} cm`, hLabel: `${H} cm`, frustumFrac: p / q },
			text: `A cone has base radius ${Rb} cm and height ${H} cm. It is cut by a plane parallel to the base at a height of ${h} cm above the base, producing a small cone on top and a frustum below. Give answers correct to 1 decimal place where necessary.${br('i', 'Find the radius of the circular cut.')}${br('ii', 'Find the volume of the frustum.')}${br('iii', 'Find the volume of the small cone as a percentage of the original cone.')}`,
			answer: multi([rcut, dp(Vfrust, 1), dp(pct, 1)], ['cut radius (cm)', 'frustum volume (cm&sup3;)', 'small cone (%)'], 0.06),
			solution: `<p>(i) The small cone on top has height ${H} &minus; ${h} = ${t} cm, and is similar to the whole cone with scale factor ${F.frac(String(t), String(H))}. Its radius is ${F.frac(String(t), String(H))} &times; ${Rb} = <strong>${rcut} cm</strong>.</p>
<p>(ii) Frustum = whole cone &minus; small cone = ${F.frac('&pi;', '3')}(${Rb}&sup2; &times; ${H} &minus; ${rcut}&sup2; &times; ${t}) = ${F.frac('&pi;', '3')}(${Rb * Rb * H} &minus; ${rcut * rcut * t}) = <strong>${dp(Vfrust, 1)} cm&sup3;</strong>.</p>
<p>(iii) Volume scales as the cube of the scale factor: (${F.frac(String(p), String(q))})&sup3; &times; 100 = <strong>${dp(pct, 1)}%</strong>.</p>`,
		};
	});

	// 10. Melting and recasting solids
	boss('boss2-melt-recast', 'Volume conservation + Spheres', function (r) {
		const R = r.int(3, 6), N = r.int(4, 8), rc = r.int(1, 3);
		const r2 = r.int(1, R - 1);
		const V = 4 / 3 * Math.PI * R * R * R;
		const hcyl = 4 * R * R * R / (3 * N * rc * rc);
		const count = Math.floor(Math.pow(R / r2, 3));
		return {
			marks: 6,
			diagram: { type: 'cylinder', rLabel: `${rc} cm` },
			text: `A solid metal sphere has radius ${R} cm. Give answers correct to 1 decimal place where necessary.${br('i', 'Find the volume of the sphere.')}${br('ii', `The sphere is melted down and recast into ${N} identical solid cylinders of radius ${rc} cm. Find the height of each cylinder.`)}${br('iii', `If instead the metal were cast into small spheres of radius ${r2} cm, how many complete small spheres could be made?`)}`,
			answer: multi([dp(V, 1), dp(hcyl, 1), count], ['sphere volume (cm&sup3;)', 'cylinder height (cm)', 'number of spheres'], 0.06),
			solution: `<p>(i) V = ${F.frac('4', '3')}&pi;r&sup3; = ${F.frac('4', '3')}&pi; &times; ${R * R * R} = <strong>${dp(V, 1)} cm&sup3;</strong>.</p>
<p>(ii) Each cylinder gets ${F.frac('V', String(N))} of the metal: &pi; &times; ${rc}&sup2; &times; h = ${F.frac(String(dp(V, 2)), String(N))}, so h = ${F.frac(`4 &times; ${R * R * R}`, `3 &times; ${N} &times; ${rc * rc}`)} = <strong>${dp(hcyl, 1)} cm</strong>. (The &pi;s cancel.)</p>
<p>(iii) Volume ratio = (${R}/${r2})&sup3; = ${dp(Math.pow(R / r2, 3), 3)}, so <strong>${count}</strong> complete spheres can be made.</p>`,
		};
	});

	// 11. Tower observed from two points
	boss('boss2-tower-two-points', 'Elevation + Two observers', function (r) {
		const al = r.int(25, 40);
		const be = al + r.int(15, 30);
		const x = 2 * r.int(10, 30);
		const dB = x * Math.tan(rad(al)) / (Math.tan(rad(be)) - Math.tan(rad(al)));
		const h = dB * Math.tan(rad(be));
		const angMid = Math.atan(h / (dB + x / 2)) * DEG;
		return {
			marks: 6,
			text: `From a point A on level ground, the angle of elevation of the top of a tower is ${deg(al)}. From point B, which is ${x} m closer to the tower on the same straight line, the angle of elevation is ${deg(be)}. Give answers correct to 1 decimal place.${br('i', 'Find the distance from B to the base of the tower.')}${br('ii', 'Find the height of the tower.')}${br('iii', 'Find the angle of elevation from the midpoint of AB.')}`,
			diagram: { type: 'elevation', h: 'h', ang1: `${al}°`, ang2: `${be}°`, p1: 'A', p2: `B  (${x} m closer)`, top: 'T', far: true },
			answer: multi([dp(dB, 1), dp(h, 1), dp(angMid, 1)], ['B to tower (m)', 'height (m)', 'angle (degrees)'], 0.06),
			solution: `<p>Let the height be h and the distance from B to the tower be d. Then h = d tan ${deg(be)} and h = (d + ${x}) tan ${deg(al)}.</p>
<p>(i) Setting these equal: d(tan ${deg(be)} &minus; tan ${deg(al)}) = ${x} tan ${deg(al)}, so d = ${F.frac(`${x} &times; ${dp(Math.tan(rad(al)), 4)}`, `${dp(Math.tan(rad(be)), 4)} &minus; ${dp(Math.tan(rad(al)), 4)}`)} = <strong>${dp(dB, 1)} m</strong>.</p>
<p>(ii) h = d tan ${deg(be)} = <strong>${dp(h, 1)} m</strong>.</p>
<p>(iii) The midpoint of AB is ${x / 2} m behind B, so tan &theta; = ${F.frac('h', `d + ${x / 2}`)} and &theta; = <strong>${dp(angMid, 1)}&deg;</strong>.</p>`,
		};
	});

	// 12. Two-leg bearings journey via cosine rule
	boss('boss2-bearing-cosine', 'Bearings + Cosine rule', function (r) {
		const th1 = r.int(20, 60), dth = r.int(50, 110), th2 = th1 + dth;
		const d1 = r.int(5, 14), d2 = r.int(5, 14);
		const interior = 180 - dth;
		const x2 = d1 * Math.sin(rad(th1)) + d2 * Math.sin(rad(th2));
		const y2 = d1 * Math.cos(rad(th1)) + d2 * Math.cos(rad(th2));
		const dhome = Math.sqrt(x2 * x2 + y2 * y2);
		let brg = Math.atan2(-x2, -y2) * DEG;
		if (brg < 0) brg += 360;
		return {
			marks: 6,
			text: `A ship leaves port and sails ${d1} km on a bearing of ${deg(th1)}, then turns and sails ${d2} km on a bearing of ${deg(th2)}.${br('i', 'Find the angle between the two legs of the journey at the turning point.')}${br('ii', 'Find the direct distance from the ship back to the port, correct to 1 decimal place.')}${br('iii', 'Find the bearing of the port from the ship, correct to 1 decimal place.')}`,
			diagram: { type: 'bearings', legs: [{ bearing: th1, dist: d1, label: `${d1} km`, bearingLabel: `${th1}°` }, { bearing: th2, dist: d2, label: `${d2} km`, bearingLabel: `${th2}°` }], names: ['Port', 'Turn', 'Ship'], close: true },
			answer: multi([interior, dp(dhome, 1), dp(brg, 1)], ['interior angle (degrees)', 'distance (km)', 'bearing (degrees)'], 0.06),
			solution: `<p>(i) The bearing changes by ${th2} &minus; ${th1} = ${dth}&deg;; the interior angle of the triangle at the turn is 180&deg; &minus; ${dth}&deg; = <strong>${interior}&deg;</strong>.</p>
<p>(ii) Cosine rule: d&sup2; = ${d1}&sup2; + ${d2}&sup2; &minus; 2 &times; ${d1} &times; ${d2} cos ${deg(interior)} = ${dp(dhome * dhome, 2)}, so d = <strong>${dp(dhome, 1)} km</strong>.</p>
<p>(iii) Using east/north components, the ship is at (${dp(x2, 2)}, ${dp(y2, 2)}) km from the port. The vector back to port is (${dp(-x2, 2)}, ${dp(-y2, 2)}), whose bearing (measured clockwise from north) is <strong>${dp(brg, 1)}&deg;</strong>.</p>`,
		};
	});

	// 13. Incircle, circumcircle and Euler distance of a right triangle
	boss('boss2-right-triangle-circles', 'Right triangles + In/circumcircle', function (r) {
		const T = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]]);
		const k = r.int(1, 3);
		const a = k * T[0], b = k * T[1], c = k * T[2];
		const area = a * b / 2;
		const rin = (a + b - c) / 2;
		const Rc = c / 2;
		const OI = Math.sqrt(Rc * (Rc - 2 * rin));
		return {
			marks: 7,
			text: `A right-angled triangle has legs ${a} cm and ${b} cm and hypotenuse ${c} cm. Give answers correct to 2 decimal places where necessary.${br('i', 'Find its area.')}${br('ii', 'Find the radius of the inscribed circle. <em>Hint: for a right triangle, r = (a + b &minus; c)/2.</em>')}${br('iii', 'Find the radius of the circumscribed circle.')}${br('iv', 'Find the distance between the incentre and the circumcentre. <em>Hint: Euler&rsquo;s formula d&sup2; = R(R &minus; 2r).</em>')}`,
			diagram: { type: 'rightTriangle', base: `${a} cm`, height: `${b} cm`, hyp: `${c} cm` },
			answer: multi([area, rin, Rc, dp(OI, 2)], ['area (cm&sup2;)', 'inradius (cm)', 'circumradius (cm)', 'distance (cm)'], 0.006),
			solution: `<p>(i) Area = ${F.frac('1', '2')} &times; ${a} &times; ${b} = <strong>${area} cm&sup2;</strong>.</p>
<p>(ii) For a right triangle r = ${F.frac(`${a} + ${b} &minus; ${c}`, '2')} = <strong>${rin} cm</strong>. (Equivalently r = area &divide; semi-perimeter.)</p>
<p>(iii) The hypotenuse of a right triangle is a diameter of its circumcircle (angle in a semicircle), so R = ${F.frac(String(c), '2')} = <strong>${Rc} cm</strong>.</p>
<p>(iv) Euler&rsquo;s formula: d&sup2; = R(R &minus; 2r) = ${Rc}(${Rc} &minus; ${2 * rin}) = ${dp(Rc * (Rc - 2 * rin), 3)}, so d = <strong>${dp(OI, 2)} cm</strong>.</p>`,
		};
	});

	// 14. Ptolemy with a diameter
	boss('boss2-ptolemy', 'Cyclic quadrilaterals + Ptolemy', function (r) {
		const SETS = { 25: [[7, 24], [15, 20]], 50: [[14, 48], [30, 40]], 65: [[16, 63], [25, 60], [33, 56], [39, 52]], 85: [[13, 84], [36, 77], [40, 75], [51, 68]] };
		const c = r.pick([25, 50, 65, 85]);
		const pairs = SETS[c];
		let P1 = r.pick(pairs).slice(), P2 = r.pick(pairs).slice();
		if (r.next() < 0.5) P1.reverse();
		if (r.next() < 0.5) P2.reverse();
		const AB = P1[0], BC = P1[1], CD = P2[0], DA = P2[1];
		const BD = (AB * CD + BC * DA) / c;
		const arcAB = 2 * Math.asin(AB / c) * DEG;
		const arcCD = 2 * Math.asin(CD / c) * DEG;
		return {
			marks: 6,
			text: `ABCD is a cyclic quadrilateral in which the diagonal AC is a diameter of the circle, with AC = ${c} cm, AB = ${AB} cm and CD = ${CD} cm. Give answers correct to 2 decimal places where necessary.${br('i', 'Explain why angle ABC = 90&deg;, and find BC.')}${br('ii', 'Find AD.')}${br('iii', 'Use Ptolemy&rsquo;s theorem (AC &times; BD = AB &times; CD + BC &times; AD) to find the other diagonal BD.')}`,
			diagram: { type: 'cyclicQuad', labels: [`A (AC=${c} cm)`, `B (AB=${AB} cm)`, `C (CD=${CD} cm)`, 'D'], angs: [0, arcAB, 180, 180 + arcCD] },
			answer: multi([BC, DA, dp(BD, 2)], ['BC (cm)', 'AD (cm)', 'BD (cm)'], 0.006),
			solution: `<p>(i) AC is a diameter, so the angle in the semicircle at B is 90&deg;. Pythagoras: BC = &radic;(${c}&sup2; &minus; ${AB}&sup2;) = <strong>${BC} cm</strong>.</p>
<p>(ii) Similarly angle ADC = 90&deg;, so AD = &radic;(${c}&sup2; &minus; ${CD}&sup2;) = <strong>${DA} cm</strong>.</p>
<p>(iii) Ptolemy: ${c} &times; BD = ${AB} &times; ${CD} + ${BC} &times; ${DA} = ${AB * CD} + ${BC * DA} = ${AB * CD + BC * DA}.</p>
<p>BD = ${F.frac(String(AB * CD + BC * DA), String(c))} = <strong>${dp(BD, 2)} cm</strong>.</p>`,
		};
	});

	// 15. Lamppost shadow (similar triangles)
	boss('boss2-lamppost-shadow', 'Shadows + Similar triangles', function (r) {
		const p = r.int(1, 2);
		const H = p + r.int(3, 6);
		const m = r.int(2, 6);
		const d = (H - p) * m;
		const s = p * m;
		const tip = Math.sqrt((d + s) * (d + s) + H * H);
		return {
			marks: 6,
			diagram: { type: 'similarTriangles', a: 3, b: 4, c: 5, k: H / p, labels1: ['', '', 'person'], labels2: ['', '', 'pole'], sideLabels1: [`${p} m`, '', ''], sideLabels2: [`${H} m`, '', `${d} m`] },
			text: `A lamp is at the top of a ${H} m pole. A person of height ${p} m stands ${d} m from the base of the pole, casting a shadow away from the pole. Give answers correct to 1 decimal place where necessary.${br('i', 'Find the length of the shadow. <em>Hint: similar triangles from the lamp.</em>')}${br('ii', 'Find the distance from the lamp to the tip of the shadow.')}${br('iii', 'Find the length of the shadow when the person stands twice as far from the pole.')}`,
			answer: multi([s, dp(tip, 1), 2 * s], ['shadow (m)', 'lamp to tip (m)', 'new shadow (m)'], 0.06),
			solution: `<p>(i) Let the shadow be s. The big triangle (lamp to shadow tip) and the small one (head to shadow tip) are similar: ${F.frac(String(H), `${d} + s`)} = ${F.frac(String(p), 's')}.</p>
<p>Cross-multiplying: ${H}s = ${p}(${d} + s), so s(${H} &minus; ${p}) = ${p * d} and s = <strong>${s} m</strong>.</p>
<p>(ii) The lamp is ${H} m up and the tip is ${d} + ${s} = ${d + s} m away horizontally: &radic;(${d + s}&sup2; + ${H}&sup2;) = <strong>${dp(tip, 1)} m</strong>.</p>
<p>(iii) The shadow length is proportional to the distance from the pole, so doubling the distance doubles the shadow: <strong>${2 * s} m</strong>.</p>`,
		};
	});

	// 16. Isosceles trapezium via trig
	boss('boss2-trapezium-trig', 'Trapezia + Right-triangle trig', function (r) {
		const b = r.int(4, 8), w = r.int(2, 5), a = b + 2 * w;
		const th = r.int(35, 70);
		const h = w * Math.tan(rad(th));
		const leg = w / Math.cos(rad(th));
		const area = (a + b) / 2 * h;
		const per = a + b + 2 * leg;
		return {
			marks: 7,
			diagram: { type: 'quad', pts: [[0, 0], [a, 0], [a - w, h], [w, h]], sideLabels: [`${a} cm`, '', `${b} cm`, ''], angleLabels: [deg(th), deg(th), '', ''] },
			text: `An isosceles trapezium has parallel sides ${a} cm and ${b} cm, and each base angle is ${deg(th)}. Give answers correct to 1 decimal place.${br('i', 'Find the height of the trapezium.')}${br('ii', 'Find the length of each sloping side.')}${br('iii', 'Find the area.')}${br('iv', 'Find the perimeter.')}`,
			answer: multi([dp(h, 1), dp(leg, 1), dp(area, 1), dp(per, 1)], ['height (cm)', 'sloping side (cm)', 'area (cm&sup2;)', 'perimeter (cm)'], 0.06),
			solution: `<p>Dropping perpendiculars from the shorter side splits off two right triangles, each with base ${F.frac(`${a} &minus; ${b}`, '2')} = ${w} cm.</p>
<p>(i) h = ${w} tan ${deg(th)} = <strong>${dp(h, 1)} cm</strong>.</p>
<p>(ii) Sloping side = ${F.frac(String(w), `cos ${th}&deg;`)} = <strong>${dp(leg, 1)} cm</strong>.</p>
<p>(iii) Area = ${F.frac(`${a} + ${b}`, '2')} &times; h = ${(a + b) / 2} &times; ${dp(h, 2)} = <strong>${dp(area, 1)} cm&sup2;</strong>.</p>
<p>(iv) Perimeter = ${a} + ${b} + 2 &times; ${dp(leg, 2)} = <strong>${dp(per, 1)} cm</strong>.</p>`,
		};
	});

	// 17. Wedge (ramp) angles in 3D
	boss('boss2-wedge-angle', 'Ramps + 3D angles', function (r) {
		let L, h, slope, W;
		do {
			[L, h, slope] = r.pick([[4, 3, 5], [8, 6, 10], [12, 5, 13], [6, 8, 10], [12, 9, 15], [15, 8, 17], [16, 12, 20], [9, 12, 15]]);
			W = r.int(3, 10);
		} while (W === slope || W === L);
		const ang1 = Math.atan(h / L) * DEG;
		const diag = Math.sqrt(L * L + W * W + h * h);
		const ang2 = Math.atan(h / Math.sqrt(L * L + W * W)) * DEG;
		return {
			marks: 7,
			diagram: solid({ A:[0,0,0],B:[L,0,0],C:[L,W,0],D:[0,W,0],E:[L,0,h],F:[L,W,h] }, [['A','B',{label:`${L} m`}],['B','C',{label:`${W} m`}],['C','D',{dash:true}],['D','A',{dash:true}],['B','E',{label:`${h} m`}],['C','F'],['A','E'],['D','F'],['E','F'],['A','C',{dash:true,accent:true}],['A','F',{accent:true,label:'d'}]], { faces:[['A','E','F','D']], rightAngles:[{at:'C',from:'F',to:'A'}], angles:[{at:'A',from:'C',to:'F',label:'&phi;'}] }),
			text: `A wedge-shaped ramp has a horizontal rectangular base ${L} m long and ${W} m wide, rising to a height of ${h} m at the far end. Give answers correct to 1 decimal place where necessary.${br('i', 'Show that a vertical cross-section through the middle is right-angled, then find its slope length.')}${br('ii', 'Hence find the angle of that slope.')}${br('iii', 'Find the diagonal d from a bottom corner to the opposite top corner.')}${br('iv', 'Hence find the angle d makes with the horizontal base.')}`,
			answer: multi([slope, dp(ang1, 1), dp(diag, 1), dp(ang2, 1)], ['slope (m)', 'slope angle (degrees)', 'diagonal (m)', 'diagonal angle (degrees)'], 0.06),
			solution: `<p>(i) The slope is the hypotenuse over run ${L} and rise ${h}: &radic;(${L}&sup2; + ${h}&sup2;) = <strong>${slope} m</strong>.</p>
<p>(ii) tan &theta; = ${F.frac(String(h), String(L))}, so &theta; = <strong>${dp(ang1, 1)}&deg;</strong>.</p>
<p>(iii) The diagonal&rsquo;s horizontal projection is the base diagonal &radic;(${L}&sup2; + ${W}&sup2;) = ${dp(Math.sqrt(L * L + W * W), 2)} m, and it rises ${h} m. Length = &radic;(${L * L} + ${W * W} + ${h * h}) = <strong>${dp(diag, 1)} m</strong>.</p>
<p>(iv) tan &phi; = ${F.frac(String(h), `&radic;${L * L + W * W}`)}, so &phi; = <strong>${dp(ang2, 1)}&deg;</strong>.</p>`,
		};
	});

})();
