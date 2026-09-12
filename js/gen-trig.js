// Worksheet-calibre trigonometry generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt;
	const G = MG.generators;
	const rad = MG.degToRad;
	const rnd = MG.round;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Trigonometry', subtopic, difficulty, gen });
	const exact = (accept) => ({ type: 'text', accept, placeholder: 'Enter an exact value' });
	const dm = (x) => {
		let d = Math.floor(x), m = Math.round((x - d) * 60);
		if (m === 60) { d++; m = 0; }
		return [d, m];
	};
	const solid = (verts, edges, extras = {}) => ({ type: 'solid3d', verts, edges, ...extras });

	add('trig-exact-shift-chain', 'Exact values', 2, (r) => {
		const rows = [
			[30, 120, 'sqrt(3)/4', F.frac(F.sqrt(3), 4)], [45, 135, '-1/2', `&minus;${F.frac(1, 2)}`],
			[60, 150, '-3/4', `&minus;${F.frac(3, 4)}`], [120, 210, 'sqrt(3)/4', F.frac(F.sqrt(3), 4)],
			[135, 240, 'sqrt(6)/8', F.frac(F.sqrt(6), 8)], [150, 315, '-sqrt(2)/8', `&minus;${F.frac(F.sqrt(2), 8)}`]
		];
		const [a, b, key, shown] = r.pick(rows), k = r.pick([1, 2, 3]);
		return { marks: 4, text: `(i) Write sin ${a}&deg; and cos ${b}&deg; exactly.<br>(ii) Hence evaluate ${k} sin ${a}&deg; cos ${b}&deg; exactly, divided by ${k}.`, answer: exact([key]), solution: `<p>Use reference angles and ASTC. The factor ${k} cancels.</p><p><strong>${shown}</strong>.</p>` };
	});

	add('trig-exact-quadrant-chain', 'Exact values', 2, (r) => {
		const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]], [o, a, h] = r.pick(triples), q = r.pick([2, 3, 4]);
		const sign = q === 3 ? 1 : -1, key = `${sign < 0 ? '-' : ''}${o}/${a}`;
		return { marks: 4, text: `The angle &theta; lies in quadrant ${q} and |sin &theta;| = ${F.frac(o, h)}.<br>(i) Find |cos &theta;| exactly.<br>(ii) Hence find tan &theta; exactly.`, answer: exact([key]), solution: `<p>A reference triangle has sides ${o}, ${a}, ${h}, so |cos &theta;| = ${F.frac(a, h)}.</p><p>ASTC gives <strong>tan &theta; = ${sign < 0 ? '&minus;' : ''}${F.frac(o, a)}</strong>.</p>` };
	});

	add('trig-exact-surd-square', 'Exact values', 1, (r) => {
		const rows = [
			['sin', 15, 75, '(&radic;6 &minus; &radic;2)/4', '(&radic;6 + &radic;2)/4'],
			['cos', 15, 75, '(&radic;6 + &radic;2)/4', '(&radic;6 &minus; &radic;2)/4'],
			['sin', 105, 165, '(&radic;6 + &radic;2)/4', '(&radic;6 &minus; &radic;2)/4']
		], [fnName, a, b, fa, fb] = r.pick(rows), k = r.int(2, 12);
		const v = k / 4;
		return { marks: 3, text: `(i) Show that |${fnName} ${a}&deg;| = ${fa} and |${fnName} ${b}&deg;| = ${fb}.<br>(ii) Hence evaluate ${k} |${fnName} ${a}&deg;| |${fnName} ${b}&deg;| exactly.`, answer: { type: 'numeric', value: v, tolerance: 0.001, label: 'exact value' }, solution: `<p>Expand each angle using 45&deg; and 30&deg; (or a related angle).</p><p>The product of the two surd forms is (6 &minus; 2)/16 = ${F.frac(1, 4)}, so the answer is <strong>${F.frac(k, 4)} = ${v}</strong>.</p>` };
	});

	add('trig-sine-rule-area-chain', 'Non-right triangles', 2, (r) => {
		const A = r.int(38, 68), B = r.int(42, 72), a = r.int(9, 27), C = 180 - A - B;
		const b = a * Math.sin(rad(B)) / Math.sin(rad(A)), area = rnd(0.5 * a * b * Math.sin(rad(C)), 2);
		return { marks: 5, text: `In triangle ABC, A = ${A}&deg;, B = ${B}&deg; and a = ${a} cm.<br>(i) Find angle C.<br>(ii) Use the sine rule to find b.<br>(iii) Hence find the area, correct to 2 decimal places.`, diagram: { type: 'triangle', a, b, c: a * Math.sin(rad(C)) / Math.sin(rad(A)), labels: ['A', 'B', 'C'], sideLabels: [`${a} cm`, 'b', 'c'], angleLabels: [`${A}&deg;`, `${B}&deg;`, 'C'] }, answer: { type: 'numeric', value: area, tolerance: 0.01, label: 'area (cm²), 2 d.p.' }, solution: `<p>C = ${C}&deg;. By the sine rule, b = ${rnd(b, 3)} cm.</p><p>Area = ${F.frac(1, 2)}ab sin C = <strong>${area} cm&sup2;</strong>.</p>` };
	});

	add('trig-cosine-sine-chain', 'Non-right triangles', 3, (r) => {
		const b = r.int(12, 29), c = r.int(10, 25), A = r.int(48, 118), a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(rad(A)));
		const B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180 / Math.PI, out = dm(B);
		return { marks: 6, text: `Triangle ABC has b = ${b} m, c = ${c} m and included angle A = ${A}&deg;.<br>(i) Find side a using the cosine rule.<br>(ii) Hence find angle B to the nearest minute.`, diagram: { type: 'triangle', a, b, c, labels: ['A', 'B', 'C'], sideLabels: ['a', `${b} m`, `${c} m`], angleLabels: [`${A}&deg;`, 'B', ''] }, answer: { type: 'multinumeric', values: out, labels: ['B degrees (nearest minute)', 'B minutes'], tolerance: 0.01 }, solution: `<p>a&sup2; = ${b}&sup2; + ${c}&sup2; &minus; 2(${b})(${c})cos ${A}&deg;, so a = ${rnd(a, 3)} m.</p><p>The sine rule gives sin B/a = sin A/b. Use the side lengths to choose the angle consistent with this unique SAS triangle: <strong>B = ${out[0]}&deg; ${out[1]}'</strong>.</p>` };
	});

	add('trig-ambiguous-area', 'Non-right triangles', 3, (r) => {
		const A = r.int(26, 38), a = r.int(15, 25), b = a + r.int(2, 5), s = b * Math.sin(rad(A)) / a;
		const B1 = Math.asin(s) * 180 / Math.PI, B2 = 180 - B1, C1 = 180 - A - B1, C2 = 180 - A - B2;
		const areas = [rnd(0.5 * a * b * Math.sin(rad(C2)), 2), rnd(0.5 * a * b * Math.sin(rad(C1)), 2)].sort((x, y) => x - y);
		return { marks: 7, text: `In triangle ABC, A = ${A}&deg;, a = ${a} cm and b = ${b} cm.<br>(i) Explain why two triangles are possible.<br>(ii) Find both possible values of B.<br>(iii) Find the two possible areas in increasing order, correct to 2 decimal places.`, diagram: { type: 'triangle', a, b, c: 12, labels: ['A', 'B', 'C'], sideLabels: [`${a} cm`, `${b} cm`, 'c'], angleLabels: [`${A}&deg;`, 'B', ''] }, answer: { type: 'multinumeric', values: areas, labels: ['smaller area (cm²), 2 d.p.', 'larger area (cm²), 2 d.p.'], tolerance: 0.01 }, solution: `<p>sin B = ${rnd(s, 4)}, so B = ${rnd(B1, 2)}&deg; or ${rnd(B2, 2)}&deg;.</p><p>Use C = 180&deg; &minus; A &minus; B and area = ½ab sin C: <strong>${areas[0]} cm&sup2;, ${areas[1]} cm&sup2;</strong>.</p>` };
	});

	add('trig-bearing-elevation-chain', 'Bearings and elevation', 3, (r) => {
		const d = r.int(45, 140), bearing = r.int(25, 155), elev = r.int(18, 48), h = rnd(d * Math.tan(rad(elev)), 2);
		return { marks: 6, text: `From station P, the base B of a vertical tower is ${d} m away on a bearing of ${String(bearing).padStart(3, '0')}&deg;T. The angle of elevation of its top T is ${elev}&deg;.<br>(i) Mark the horizontal bearing at P.<br>(ii) Find BT, correct to 2 decimal places.`, diagram: { type: 'bearings', legs: [{ bearing, dist: d, label: `${d} m`, bearingLabel: `${String(bearing).padStart(3, '0')}&deg;T` }], names: ['P', 'B'] }, answer: { type: 'numeric', value: h, tolerance: 0.01, label: 'BT (m), 2 d.p.' }, solution: `<p>The bearing locates B in the horizontal plane. In vertical triangle PBT, tan ${elev}&deg; = BT/${d}.</p><p><strong>BT = ${h} m</strong>.</p>` };
	});

	add('trig-two-bearing-elevation', 'Bearings and elevation', 3, (r) => {
		const PA = r.int(50, 130), turn = r.int(50, 120), elev = r.int(20, 50), bearing = r.int(10, 100), PB = PA * Math.cos(rad(turn)), h = rnd(PB * Math.tan(rad(elev)), 2);
		return { marks: 7, text: `A surveyor walks ${PA} m from P on a bearing of ${String(bearing).padStart(3, '0')}&deg;T to A. From A, the bearing of the foot B of a tower differs from AP by ${turn}&deg;, and AB is perpendicular to PB. The elevation of T from A is ${elev}&deg;.<br>(i) Find AB.<br>(ii) Hence find the tower height, correct to 2 decimal places.`, diagram: { type: 'bearings', legs: [{ bearing, dist: PA, label: `${PA} m` }, { bearing: bearing + 180 - turn, dist: Math.abs(PA * Math.sin(rad(turn))), label: 'AB' }], names: ['P', 'A', 'B'], close: true }, answer: { type: 'numeric', value: h, tolerance: 0.01, label: 'tower height (m), 2 d.p.' }, solution: `<p>In right triangle PAB, AB = ${rnd(Math.abs(PA * Math.sin(rad(turn))), 2)} m.</p><p>BT = AB tan ${elev}&deg; = <strong>${h} m</strong>.</p>` };
	});

	add('trig-solid-cuboid-angle', '3D trigonometry', 2, (r) => {
		const l = r.int(8, 22), w = r.int(6, 18), h = r.int(5, 17), run = Math.hypot(l, w), out = dm(Math.atan(h / run) * 180 / Math.PI);
		const verts = { A: [0, 0, 0], B: [l, 0, 0], C: [l, w, 0], D: [0, w, 0], E: [0, 0, h], F: [l, 0, h], G: [l, w, h], H: [0, w, h] };
		return { marks: 5, text: `A cuboid has dimensions ${l} cm by ${w} cm by ${h} cm.<br>(i) Find the base diagonal AC exactly as a square root.<br>(ii) Find the angle between AG and the base, to the nearest minute.`, diagram: solid(verts, [['A', 'B'], ['B', 'C'], ['C', 'D', { dash: true }], ['D', 'A', { dash: true }], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E'], ['A', 'E'], ['B', 'F'], ['C', 'G'], ['D', 'H', { dash: true }], ['A', 'C', { dash: true, accent: true, label: 'AC' }], ['A', 'G', { accent: true, label: 'AG' }]], { angles: [{ at: 'A', from: 'C', to: 'G', label: '&theta;', r: 18 }], rightAngles: [{ at: 'C', from: 'G', to: 'A' }] }), answer: { type: 'multinumeric', values: out, labels: ['angle degrees (nearest minute)', 'angle minutes'], tolerance: 0.01 }, solution: `<p>AC = &radic;(${l}&sup2; + ${w}&sup2;) = &radic;${l * l + w * w} cm.</p><p>tan &theta; = ${h}/&radic;${l * l + w * w}, so <strong>&theta; = ${out[0]}&deg; ${out[1]}'</strong>.</p>` };
	});

	add('trig-solid-pyramid-edge', '3D trigonometry', 3, (r) => {
		const s = r.int(8, 24), h = r.int(7, 22), angle = Math.round(Math.atan(h / (s / Math.sqrt(2))) * 180 / Math.PI);
		const verts = { A: [-s / 2, -s / 2, 0], B: [s / 2, -s / 2, 0], C: [s / 2, s / 2, 0], D: [-s / 2, s / 2, 0], M: [0, 0, 0], T: [0, 0, h] };
		return { marks: 6, text: `A right square pyramid has base side ${s} cm and vertical height ${h} cm.<br>(i) Show that AM = ${F.frac(`${s}&radic;2`, 2)} cm.<br>(ii) Hence find the angle between edge AT and the base, to the nearest degree.`, diagram: solid(verts, [['A', 'B'], ['B', 'C'], ['C', 'D', { dash: true }], ['D', 'A', { dash: true }], ['T', 'A'], ['T', 'B'], ['T', 'C'], ['T', 'D', { dash: true }], ['A', 'M', { dash: true, accent: true, label: 'AM' }], ['T', 'M', { dash: true, accent: true, label: 'h' }]], { faces: [['A', 'B', 'T']], angles: [{ at: 'A', from: 'M', to: 'T', label: '&alpha;', r: 18 }], rightAngles: [{ at: 'M', from: 'T', to: 'A' }] }), answer: { type: 'numeric', value: angle, tolerance: 0.5, label: 'angle (nearest degree)' }, solution: `<p>The base diagonal is ${s}&radic;2, and M bisects it.</p><p>tan &alpha; = ${h}/(${s}/&radic;2), giving <strong>${angle}&deg;</strong>.</p>` };
	});

	add('trig-solid-tower-hill', '3D trigonometry', 3, (r) => {
		const slope = r.int(8, 20), walk = r.int(35, 90), near = r.int(28, 50), far = r.int(12, near - 8);
		const horizontal = walk * Math.cos(rad(slope)), rise = walk * Math.sin(rad(slope)), h = rnd(horizontal * Math.tan(rad(near)) - rise, 2);
		const verts = { P: [0, 0, 0], Q: [horizontal, 0, rise], B: [horizontal + 18, 0, rise], T: [horizontal + 18, 0, rise + h], R: [0, 18, 0] };
		return { marks: 8, text: `PQ is a straight path of length ${walk} m rising at ${slope}&deg;. From P and Q the angles of elevation of the top T of a vertical tower are ${far}&deg; and ${near}&deg; respectively.<br>(i) Resolve PQ horizontally and vertically.<br>(ii) Using the sightline from Q, find BT correct to 2 decimal places.<br>(iii) State how the sightline from P could check the result.`, diagram: solid(verts, [['P', 'Q', { accent: true, label: `${walk} m` }], ['Q', 'B'], ['B', 'T', { accent: true, label: 'h' }], ['P', 'T', { dash: true }], ['Q', 'T'], ['P', 'R', { dash: true }], ['R', 'B', { dash: true }]], { angles: [{ at: 'Q', from: 'B', to: 'T', label: `${near}&deg;`, r: 18 }, { at: 'P', from: 'Q', to: 'T', label: `${far}&deg;`, r: 20 }], rightAngles: [{ at: 'B', from: 'T', to: 'Q' }] }), answer: { type: 'numeric', value: h, tolerance: 0.01, label: 'BT (m), 2 d.p.' }, solution: `<p>Horizontal change = ${rnd(horizontal, 2)} m and rise = ${rnd(rise, 2)} m.</p><p>Relative to P's level, QT rises ${rnd(horizontal * Math.tan(rad(near)), 2)} m; subtract the path rise.</p><p><strong>BT = ${h} m</strong>. Substitute in the P triangle as a consistency check.</p>` };
	});

	add('trig-solid-pyramid-face', '3D trigonometry', 2, (r) => {
		const s = r.int(10, 28), h = r.int(8, 25), slant = rnd(Math.hypot(h, s / 2), 2);
		const verts = { A: [-s / 2, -s / 2, 0], B: [s / 2, -s / 2, 0], C: [s / 2, s / 2, 0], D: [-s / 2, s / 2, 0], M: [0, -s / 2, 0], O: [0, 0, 0], T: [0, 0, h] };
		return { marks: 5, text: `The apex T of a square pyramid is vertically above O. Its base side is ${s} cm and TO = ${h} cm.<br>(i) Explain why OM is half a base side.<br>(ii) Find the slant height TM, correct to 2 decimal places.`, diagram: solid(verts, [['A', 'B'], ['B', 'C'], ['C', 'D', { dash: true }], ['D', 'A', { dash: true }], ['T', 'A'], ['T', 'B'], ['T', 'C'], ['T', 'D', { dash: true }], ['T', 'O', { dash: true, accent: true, label: 'TO' }], ['O', 'M', { dash: true }], ['T', 'M', { accent: true, label: 'TM' }]], { rightAngles: [{ at: 'O', from: 'T', to: 'M' }], labels: { M: 'M', O: 'O', T: 'T' } }), answer: { type: 'numeric', value: slant, tolerance: 0.01, label: 'TM (cm), 2 d.p.' }, solution: `<p>O and M are the centres of the square and one side, so OM = ${s}/2 cm.</p><p>TM = &radic;(${h}&sup2; + (${s}/2)&sup2;) = <strong>${slant} cm</strong>.</p>` };
	});
})();
