// Extended worksheet-calibre trigonometry generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators, rad = MG.degToRad, rnd = MG.round;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Trigonometry', subtopic, difficulty, gen });
	const solid = (verts, edges, extras = {}) => ({ type: 'solid3d', verts, edges, ...extras });

	add('trigplus-identity-numeric', 'Identities', 2, (r) => {
		const a = r.int(12, 78), k = r.int(2, 9), value = rnd(k * (Math.sin(rad(a)) ** 2 + Math.cos(rad(a)) ** 2), 2);
		return { marks: 4, text: `(i) Verify numerically that sin&sup2; ${a}&deg; + cos&sup2; ${a}&deg; = 1.<br>(ii) Hence evaluate ${k}(sin&sup2; ${a}&deg; + cos&sup2; ${a}&deg;).`, answer: { type: 'numeric', value, tolerance: 0.001, label: 'identity value' }, solution: `<p>The squared ratios sum to 1, so the required value is <strong>${value}</strong>.</p>` };
	});

	add('trigplus-identity-rational', 'Identities', 3, (r) => {
		const n = r.int(2, 8), a = r.int(15, 75), value = rnd(n / (1 + Math.tan(rad(a)) ** 2) / (Math.cos(rad(a)) ** 2), 6);
		return { marks: 6, text: `For &theta; = ${a}&deg;, verify sec&sup2;&theta; &minus; tan&sup2;&theta; = 1.<br>Hence evaluate ${n} sec&sup2;&theta;/(1 + tan&sup2;&theta;), giving the exact integer.`, answer: { type: 'numeric', value, tolerance: 0.001, label: 'exact integer' }, solution: `<p>Since 1 + tan&sup2;&theta; = sec&sup2;&theta;, the quotient is 1.</p><p>The value is <strong>${value}</strong>.</p>` };
	});

	add('trigplus-equation-special', 'Trig equations', 2, (r) => {
		const rows = [['sin', 30, [30, 150]], ['sin', 45, [45, 135]], ['cos', 60, [60, 300]], ['cos', 45, [45, 315]], ['tan', 30, [30, 210]], ['tan', 60, [60, 240]]], [fn, ref, vals] = r.pick(rows), sign = r.pick([1, -1]);
		const out = sign > 0 ? vals : fn === 'sin' ? vals.map(x => x + 180).map(x => x % 360).sort((x, y) => x - y) : fn === 'cos' ? [180 - ref, 180 + ref] : [180 - ref, 360 - ref];
		const rhs = ref === 30 ? (fn === 'tan' ? `1/${F.sqrt(3)}` : F.frac(1, 2)) : ref === 45 ? (fn === 'tan' ? '1' : F.frac(F.sqrt(2), 2)) : (fn === 'tan' ? F.sqrt(3) : F.frac(1, 2));
		return { marks: 4, text: `Solve ${fn} x = ${sign < 0 ? '&minus;' : ''}${rhs} for 0&deg; &le; x &le; 360&deg;. Give all solutions exactly in increasing order.`, answer: { type: 'multinumeric', values: out, labels: ['smaller exact angle', 'larger exact angle'], tolerance: 0.01 }, solution: `<p>The reference angle is ${ref}&deg;. ASTC selects the required quadrants.</p><p><strong>x = ${out.join('&deg;, ')}&deg;</strong>.</p>` };
	});

	add('trigplus-equation-quadratic', 'Trig equations', 3, (r) => {
		const rows = [
			['2sin&sup2;x &minus; sin x = 0', [30, 150, 180]],
			['2cos&sup2;x &minus; cos x &minus; 1 = 0', [120, 240]],
			['2sin&sup2;x + sin x &minus; 1 = 0', [30, 150, 270]],
			['2cos&sup2;x + cos x &minus; 1 = 0', [60, 180, 300]]
		], [eq, vals] = r.pick(rows), shift = r.int(1, 6);
		return { marks: 6, text: `Factorise and solve ${eq} on the open interval 0&deg; &lt; x &lt; 360&deg;. As a check, add ${shift}&deg; to each solution mentally, but enter the original solutions in increasing order.`, answer: { type: 'multinumeric', values: vals, labels: vals.map((_, i) => `solution ${i + 1} (exact degrees)`), tolerance: 0.01 }, solution: `<p>Factorise as a quadratic in sin x or cos x, reject ratios outside [&minus;1,1] and the excluded endpoints, then apply ASTC.</p><p><strong>x = ${vals.join('&deg;, ')}&deg;</strong>.</p>` };
	});

	add('trigplus-equation-minute', 'Trig equations', 3, (r) => {
		const c = r.int(12, 88) / 100, a = Math.asin(c) * 180 / Math.PI, vals = [rnd(a, 2), rnd(180 - a, 2)];
		return { marks: 5, text: `Solve sin x = ${c} for 0&deg; &le; x &le; 360&deg;, giving both solutions correct to 2 decimal places.`, answer: { type: 'multinumeric', values: vals, labels: ['smaller x (2 d.p.)', 'larger x (2 d.p.)'], tolerance: 0.01 }, solution: `<p>The principal value is ${vals[0]}&deg;; sine is also positive in quadrant II.</p><p><strong>x = ${vals[0]}&deg;, ${vals[1]}&deg;</strong>.</p>` };
	});

	add('trigplus-arc-sector-chain', 'Radians and sectors', 2, (r) => {
		const radius = r.int(4, 16), theta = r.int(5, 24) / 10, arc = rnd(radius * theta, 2), area = rnd(0.5 * radius * radius * theta, 2);
		return { marks: 5, text: `A sector has radius ${radius} cm and angle ${theta} radians.<br>(i) Find its arc length.<br>(ii) Hence find its area, both correct to 2 decimal places.`, diagram: { type: 'sector', angle: theta * 180 / Math.PI, rLabel: `${radius} cm`, angleLabel: `${theta} rad` }, answer: { type: 'multinumeric', values: [arc, area], labels: ['arc length (cm), 2 d.p.', 'sector area (cm²), 2 d.p.'], tolerance: 0.01 }, solution: `<p>s = r&theta; = ${arc} cm.</p><p>A = ½r&sup2;&theta; = <strong>${area} cm&sup2;</strong>.</p>` };
	});

	add('trigplus-sector-inverse', 'Radians and sectors', 3, (r) => {
		const radius = r.int(5, 18), theta = r.int(6, 25) / 10, arc = rnd(radius * theta, 2), perimeter = rnd(2 * radius + arc, 2);
		return { marks: 6, text: `A sector has arc length ${arc} cm and angle ${theta} radians.<br>(i) Find its radius.<br>(ii) Hence find its perimeter, both correct to 2 decimal places.`, diagram: { type: 'sector', angle: theta * 180 / Math.PI, rLabel: 'r', angleLabel: `${theta} rad` }, answer: { type: 'multinumeric', values: [rnd(arc / theta, 2), perimeter], labels: ['radius (cm), 2 d.p.', 'perimeter (cm), 2 d.p.'], tolerance: 0.01 }, solution: `<p>r = s/&theta; = ${rnd(arc / theta, 2)} cm.</p><p>P = 2r + s = <strong>${perimeter} cm</strong>.</p>` };
	});

	add('trigplus-segment-chain', 'Radians and sectors', 3, (r) => {
		const radius = r.int(6, 17), theta = r.int(7, 25) / 10, sector = 0.5 * radius * radius * theta, tri = 0.5 * radius * radius * Math.sin(theta), segment = rnd(sector - tri, 2);
		return { marks: 7, text: `A chord subtends ${theta} radians at the centre of a circle of radius ${radius} cm.<br>(i) Find the sector area.<br>(ii) Find the area of the isosceles triangle.<br>(iii) Hence find the minor segment area, correct to 2 decimal places.`, diagram: { type: 'sector', angle: theta * 180 / Math.PI, rLabel: `${radius} cm`, angleLabel: `${theta} rad`, segment: true }, answer: { type: 'numeric', value: segment, tolerance: 0.01, label: 'segment area (cm²), 2 d.p.' }, solution: `<p>Sector = ${rnd(sector, 3)} cm&sup2; and triangle = ½r&sup2;sin &theta; = ${rnd(tri, 3)} cm&sup2;.</p><p>Difference = <strong>${segment} cm&sup2;</strong>.</p>` };
	});

	add('trigplus-solid-two-observers', '3D trigonometry', 3, (r) => {
		const h = r.int(35, 110), a = r.int(22, 48), b = r.int(25, 52), C = r.int(45, 125), p = h / Math.tan(rad(a)), q = h / Math.tan(rad(b)), separation = rnd(Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(rad(C))), 2);
		const verts = { O: [0, 0, 0], P: [p, 0, 0], Q: [q * Math.cos(rad(C)), q * Math.sin(rad(C)), 0], T: [0, 0, h] };
		return { marks: 8, text: `A vertical tower OT is ${h} m high. From ground points P and Q, its elevations are ${a}&deg; and ${b}&deg;, and &angle;POQ = ${C}&deg;.<br>(i) Show that OP = h cot ${a}&deg; and OQ = h cot ${b}&deg;.<br>(ii) Hence find PQ, correct to 2 decimal places.`, diagram: solid(verts, [['O', 'P'], ['O', 'Q', { dash: true }], ['P', 'Q', { dash: true, accent: true, label: 'PQ' }], ['O', 'T', { accent: true, label: 'h' }], ['P', 'T'], ['Q', 'T', { dash: true }]], { angles: [{ at: 'P', from: 'O', to: 'T', label: `${a}&deg;`, r: 18 }, { at: 'Q', from: 'O', to: 'T', label: `${b}&deg;`, r: 18 }], rightAngles: [{ at: 'O', from: 'T', to: 'P' }] }), answer: { type: 'numeric', value: separation, tolerance: 0.01, label: 'PQ (m), 2 d.p.' }, solution: `<p>OP = ${rnd(p, 2)} m and OQ = ${rnd(q, 2)} m.</p><p>Apply the cosine rule in horizontal triangle POQ: <strong>PQ = ${separation} m</strong>.</p>` };
	});

	add('trigplus-solid-wedge-ratio', '3D trigonometry', 3, (r) => {
		const k = r.pick([1, 2, 3, 4]), ratio = rnd((-Math.sqrt(3) + Math.sqrt(3 + 8 * k * k)) / 4, 3);
		const verts = { A: [0, 0, 0], B: [2 * k, 0, 0], C: [2 * k, 8, 0], D: [0, 8, 0], T: [0, 0, ratio * 2 * k], M: [k, 0, 0] };
		const opening = r.pick([
			`In the wedge shown, x = ${2 * k} units and the marked section has a 30&deg; inclination.`,
			`The diagram shows a solid wedge in which x = ${2 * k} units; the marked face rises at 30&deg;.`,
			`A wedge-shaped block has x = ${2 * k} units, with the indicated cross-section inclined at 30&deg;.`
		]);
		return { marks: 8, text: `${opening}<br>(i) Show that 2h&sup2; = x&sup2; &minus; &radic;3hx.<br>(ii) Hence solve for the positive ratio h/x, correct to 3 decimal places.`, diagram: solid(verts, [['A', 'B'], ['B', 'C'], ['C', 'D', { dash: true }], ['D', 'A', { dash: true }], ['A', 'T', { accent: true, label: 'h' }], ['T', 'B'], ['T', 'D', { dash: true }], ['T', 'C'], ['T', 'M', { dash: true }], ['M', 'B']], { faces: [['A', 'B', 'T']], angles: [{ at: 'B', from: 'A', to: 'T', label: '30&deg;', r: 18 }], rightAngles: [{ at: 'A', from: 'T', to: 'B' }] }), answer: { type: 'numeric', value: ratio, tolerance: 0.001, label: 'h/x (3 d.p.)' }, solution: `<p>Put y = h/x. Division by x&sup2; gives 2y&sup2; + &radic;3y &minus; 1 = 0.</p><p>Take the positive root: <strong>h/x = ${ratio}</strong>.</p>` };
	});

	add('trigplus-solid-inclined-plane', '3D trigonometry', 2, (r) => {
		const angle = r.pick([30, 45, 60]), run = r.int(5, 16), rise = angle === 30 ? run / Math.sqrt(3) : angle === 45 ? run : run * Math.sqrt(3), ratio = rnd(rise / run, 3);
		const verts = { A: [0, 0, 0], B: [run, 0, 0], C: [run, 8, 0], D: [0, 8, 0], E: [run, 0, rise], F: [run, 8, rise] };
		return { marks: 5, text: `A rectangular plane rises uniformly through ${angle}&deg; along its line of greatest slope AB.<br>(i) Draw the vertical cross-section.<br>(ii) Find the exact rise/run ratio.<br>(iii) State its decimal value correct to 3 decimal places.`, diagram: solid(verts, [['A', 'B', { dash: true }], ['B', 'C'], ['C', 'D', { dash: true }], ['D', 'A'], ['A', 'E', { accent: true, label: 'slope' }], ['D', 'F'], ['E', 'F'], ['B', 'E', { accent: true, label: 'rise' }], ['C', 'F', { dash: true }]], { faces: [['A', 'D', 'F', 'E']], angles: [{ at: 'A', from: 'B', to: 'E', label: `${angle}&deg;`, r: 18 }], rightAngles: [{ at: 'B', from: 'E', to: 'A' }] }), answer: { type: 'numeric', value: ratio, tolerance: 0.001, label: 'rise/run (3 d.p.)' }, solution: `<p>rise/run = tan ${angle}&deg;, using the exact special-angle value.</p><p><strong>${ratio}</strong> to 3 decimal places.</p>` };
	});

	add('trigplus-solid-pyramid-oblique', '3D trigonometry', 3, (r) => {
		const l = r.int(12, 30), w = r.int(8, 22), h = r.int(9, 26), run = Math.hypot(l / 2, w / 2), angle = rnd(Math.atan(h / run) * 180 / Math.PI, 2);
		const verts = { A: [-l / 2, -w / 2, 0], B: [l / 2, -w / 2, 0], C: [l / 2, w / 2, 0], D: [-l / 2, w / 2, 0], O: [0, 0, 0], T: [0, 0, h] };
		return { marks: 7, text: `A right rectangular pyramid has base ${l} cm by ${w} cm and height ${h} cm.<br>(i) Find AO exactly as a square root.<br>(ii) Hence find the angle between AT and the base, correct to 2 decimal places.`, diagram: solid(verts, [['A', 'B'], ['B', 'C'], ['C', 'D', { dash: true }], ['D', 'A', { dash: true }], ['T', 'A'], ['T', 'B'], ['T', 'C'], ['T', 'D', { dash: true }], ['A', 'O', { dash: true, accent: true }], ['T', 'O', { dash: true, accent: true, label: 'h' }]], { angles: [{ at: 'A', from: 'O', to: 'T', label: '&theta;', r: 18 }], rightAngles: [{ at: 'O', from: 'T', to: 'A' }] }), answer: { type: 'numeric', value: angle, tolerance: 0.01, label: 'angle (degrees), 2 d.p.' }, solution: `<p>AO = ½&radic;(${l}&sup2; + ${w}&sup2;) = ${rnd(run, 3)} cm.</p><p>tan &theta; = ${h}/AO, so <strong>&theta; = ${angle}&deg;</strong>.</p>` };
	});

	add('trigplus-bearing-tower-chain', '3D trigonometry', 3, (r) => {
		const AB = r.int(45, 125), A = r.int(35, 75), B = r.int(40, 80), elev = r.int(18, 45), C = 180 - A - B;
		const AO = AB * Math.sin(rad(B)) / Math.sin(rad(C)), h = rnd(AO * Math.tan(rad(elev)), 2);
		const verts = { A: [0, 0, 0], B: [AB, 0, 0], O: [AO * Math.cos(rad(A)), AO * Math.sin(rad(A)), 0], T: [AO * Math.cos(rad(A)), AO * Math.sin(rad(A)), h] };
		return { marks: 8, text: `Observers A and B are ${AB} m apart. Bearings to the foot O of a tower form horizontal angles A = ${A}&deg; and B = ${B}&deg;. From A, the elevation of T is ${elev}&deg;.<br>(i) Find &angle;AOB.<br>(ii) Use the sine rule to find AO.<br>(iii) Hence find OT, correct to 2 decimal places.`, diagram: solid(verts, [['A', 'B'], ['A', 'O', { dash: true }], ['B', 'O', { dash: true }], ['O', 'T', { accent: true, label: 'OT' }], ['A', 'T'], ['B', 'T', { dash: true }]], { angles: [{ at: 'A', from: 'O', to: 'T', label: `${elev}&deg;`, r: 18 }], rightAngles: [{ at: 'O', from: 'T', to: 'A' }] }), answer: { type: 'numeric', value: h, tolerance: 0.01, label: 'OT (m), 2 d.p.' }, solution: `<p>&angle;AOB = ${C}&deg;. The sine rule gives AO = ${rnd(AO, 2)} m.</p><p>OT = AO tan ${elev}&deg; = <strong>${h} m</strong>.</p>` };
	});
})();
