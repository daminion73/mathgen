// Multi-topic Boss questions: each is a dependent, past-paper-style chain.
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators, rad = MG.degToRad;
	const br = (i, s) => `<br><strong>(${i})</strong> ${s}`;
	const pad = (n) => String((n + 360) % 360).padStart(3, '0');
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 3, gen });
	const multi = (values, labels, tolerance) => ({ type: 'multinumeric', values, labels, tolerance });

	boss('boss-tower-bearings', 'Bearings + Elevation', (r) => {
		const v = r.pick(['fire tower', 'radio mast']), names = r.pick([['Ava', 'Ben'], ['Mia', 'Noah'], ['Ruby', 'Jack']]);
		const h = r.int(24, 65), a = r.pick([24, 28, 32, 36]), b = r.pick([18, 22, 26, 30]), bearingA = r.pick([35, 55, 75, 105]), included = r.pick([60, 75, 90, 105]);
		const da = h / Math.tan(rad(a)), db = h / Math.tan(rad(b)), apart = MG.round(Math.sqrt(da ** 2 + db ** 2 - 2 * da * db * Math.cos(rad(included))), 0);
		const angleA = Math.acos((da ** 2 + apart ** 2 - db ** 2) / (2 * da * apart)) * 180 / Math.PI;
		const walk = MG.round((bearingA + 180 + (r.pick(['clockwise', 'anticlockwise']) === 'clockwise' ? angleA : -angleA) + 360) % 360, 0);
		return { marks: 6, text: `<p>${names[0]} and ${names[1]} observe a ${h} m ${v}. Their angles of elevation are ${a}&deg; and ${b}&deg;. The angle between their ground lines to its base is ${included}&deg;, and the bearing of the base from ${names[0]} is ${pad(bearingA)}&deg;.</p>${br('i', `Find both observers' distances from the base, to the nearest metre.`)}${br('ii', `Hence find how far apart they are, to the nearest metre.`)}${br('iii', `Hence, or otherwise, find the bearing ${names[0]} must walk to ${names[1]}, to the nearest degree.`)}`, answer: multi([MG.round(da, 0), MG.round(db, 0), apart, walk], [`${names[0]} distance (nearest metre)`, `${names[1]} distance (nearest metre)`, 'separation (nearest metre)', 'bearing (nearest degree)'], .5), diagram: { type: 'elevation', h: `${h} m`, ang1: `${a}&deg;`, ang2: `${b}&deg;`, p1: names[0], p2: names[1] }, solution: `<p><strong>(i)</strong> Using tan &theta; = opposite/adjacent, the distances are ${h}/tan ${a}&deg; = <strong>${MG.round(da, 0)} m</strong> and ${h}/tan ${b}&deg; = <strong>${MG.round(db, 0)} m</strong>.</p><p><strong>(ii)</strong> By the cosine rule, d&sup2; = ${F.num(da, 2)}&sup2; + ${F.num(db, 2)}&sup2; &minus; 2(${F.num(da, 2)})(${F.num(db, 2)})cos ${included}&deg;, so <strong>d = ${apart} m</strong>.</p><p><strong>(iii)</strong> The cosine rule gives the angle at ${names[0]} as ${F.num(angleA, 2)}&deg;. Applying it to the back-bearing ${pad(bearingA + 180)}&deg; gives <strong>${pad(walk)}&deg;</strong>.</p>` };
	});

	boss('boss-coordinate-altitude', 'Coordinate geometry + Area', (r) => {
		const context = r.pick(['survey plot', 'triangular reserve']), x1 = r.int(-5, 1), y1 = r.int(-4, 3), dx = r.pick([3, 4, 5]), dy = r.pick([2, 3, 4]), x3 = r.int(-3, 7), y3 = r.int(3, 9);
		const m = dy / dx, c = y1 - m * x1, dist = MG.round(Math.abs(dy * x3 - dx * y3 + dx * y1 - dy * x1) / Math.hypot(dx, dy), 2), base = Math.hypot(dx, dy), area = MG.round(base * dist / 2, 2);
		const ask = r.pick(['gradient', 'intercept']);
		return { marks: 5, text: `<p>A ${context} has vertices A${F.pt(x1, y1)}, B${F.pt(x1 + dx, y1 + dy)} and C${F.pt(x3, y3)}.</p>${br('i', `Find the ${ask} of line AB.`)}${br('ii', 'Find the perpendicular distance from C to AB, correct to 2 decimal places.')}${br('iii', 'Hence, or otherwise, find the area of ABC, correct to 2 decimal places.')}`, answer: multi([ask === 'gradient' ? m : c, dist, area], [ask, 'distance (2 d.p.)', 'area (2 d.p.)'], .01), solution: `<p><strong>(i)</strong> m = (${y1 + dy}${F.st(-y1, '')})/(${x1 + dx}${F.st(-x1, '')}) = ${F.num(m, 3)}; y = mx + c gives c = ${F.num(c, 3)}. Thus the requested value is <strong>${F.num(ask === 'gradient' ? m : c, 3)}</strong>.</p><p><strong>(ii)</strong> Writing AB as ${dy}x &minus; ${dx}y${F.st(dx * y1 - dy * x1, '')} = 0, the point-to-line formula gives <strong>${dist}</strong>.</p><p><strong>(iii)</strong> AB = &radic;(${dx}&sup2;+${dy}&sup2;) = ${F.num(base, 3)}. Area = &frac12;&times;AB&times;height = <strong>${area}</strong>.</p>` };
	});

	boss('boss-circle-tangents', 'Circles + Algebra', (r) => {
		const place = r.pick(['design grid', 'mapping grid']), h = r.int(-4, 4), k = r.int(-3, 3), radius = r.pick([3, 4, 5]), side = r.pick([-1, 1]), px = h + side * (radius + r.int(2, 5)), py = k;
		const q = Math.sqrt((px - h) ** 2 - radius ** 2), m1 = MG.round(radius / q, 2), m2 = -m1;
		return { marks: 6, text: `<p>On a ${place}, C is x&sup2;+y&sup2;${F.st(-2 * h, 'x')}${F.st(-2 * k, 'y')}${F.st(h * h + k * k - radius * radius, '')}=0. Tangents from P${F.pt(px, py)} touch C.</p>${br('i', 'Find the x- and y-coordinates of the centre.')}${br('ii', 'Hence find the radius.')}${br('iii', 'Find both tangent gradients, correct to 2 decimal places.')}`, answer: multi([h, k, radius, Math.min(m1, m2), Math.max(m1, m2)], ['centre x', 'centre y', 'radius', 'smaller gradient (2 d.p.)', 'larger gradient (2 d.p.)'], .01), solution: `<p><strong>(i)</strong> Completing squares gives (x${F.st(-h, '')})&sup2;+(y${F.st(-k, '')})&sup2;=${radius ** 2}, so the centre is <strong>(${h}, ${k})</strong>.</p><p><strong>(ii)</strong> Therefore <strong>r=${radius}</strong>.</p><p><strong>(iii)</strong> Substituting y${F.st(-py, '')}=m(x${F.st(-px, '')}) and setting the quadratic discriminant to zero gives m&sup2;=${radius ** 2}/${q ** 2}. Thus <strong>m=${Math.min(m1, m2)}, ${Math.max(m1, m2)}</strong>.</p>` };
	});

	boss('boss-circle-three-points', 'Coordinate geometry + Circles', (r) => {
		const setting = r.pick(['fountain', 'circular garden']), h = r.int(-4, 4), k = r.int(-3, 3), rr = r.pick([3, 4, 5, 6]), orient = r.pick(['axis', 'rotated']);
		const pts = orient === 'axis' ? [[h + rr, k], [h, k + rr], [h - rr, k]] : [[h + 3, k + 4], [h - 3, k + 4], [h - 3, k - 4]];
		const radius = orient === 'axis' ? rr : 5;
		return { marks: 5, text: `<p>Three points on a ${setting} are A${F.pt(...pts[0])}, B${F.pt(...pts[1])}, C${F.pt(...pts[2])}.</p>${br('i', 'Use perpendicular bisectors to find the centre x-coordinate.')}${br('ii', 'Hence find the centre y-coordinate.')}${br('iii', 'Hence, or otherwise, find the radius.')}`, answer: multi([h, k, radius], ['centre x', 'centre y', 'radius'], .001), solution: `<p><strong>(i)</strong> Equating squared distances OA&sup2; and OB&sup2; gives the first linear equation; OA&sup2;=OC&sup2; gives the second. Solving them gives <strong>x=${h}</strong>.</p><p><strong>(ii)</strong> Substitution gives <strong>y=${k}</strong>.</p><p><strong>(iii)</strong> Distance from (${h},${k}) to A is &radic;[(${pts[0][0]}&minus;${h})&sup2;+(${pts[0][1]}&minus;${k})&sup2;] = <strong>${radius}</strong>.</p>` };
	});

	boss('boss-hidden-quadratic-probability', 'Quadratics + Probability', (r) => {
		const container = r.pick(['bag', 'box']), red = r.int(4, 10), neg = r.int(1, 5), blue = r.int(3, 8), total = red + blue, both = MG.round(red * (red - 1) / (total * (total - 1)), 4), mixed = MG.round(2 * red * blue / (total * (total - 1)), 4);
		return { marks: 6, text: `<p>A ${container} has n red and ${blue} blue counters. The number n is the positive solution of n&sup2;${F.st(neg - red, 'n')}${F.st(-red * neg, '')}=0.</p>${br('i', 'Find n.')}${br('ii', 'Two counters are drawn without replacement. Find P(two red), correct to 4 decimal places.')}${br('iii', 'Hence, or otherwise, find P(one of each), correct to 4 decimal places.')}`, answer: multi([red, both, mixed], ['n', 'P(two red) (4 d.p.)', 'P(one each) (4 d.p.)'], .0005), solution: `<p><strong>(i)</strong> Factorising gives (n&minus;${red})(n+${neg})=0. Hence n=${red} or n=&minus;${neg}; the negative root is rejected because a count cannot be negative. <strong>n=${red}</strong>.</p><p><strong>(ii)</strong> P(RR)=${red}/${total}&times;${red - 1}/${total - 1}=<strong>${both}</strong>.</p><p><strong>(iii)</strong> The orders RB and BR are disjoint: 2&times;${red}/${total}&times;${blue}/${total - 1}=<strong>${mixed}</strong>.</p>` };
	});

	boss('boss-reverse-weighted-probability', 'Probability + Modelling', (r) => {
		const context = r.pick(['arcade', 'training app']), pA = r.pick([.6, .7, .8]), pB = r.pick([.2, .3, .4]), w = r.pick([.4, .5, .6]), targetW = r.pick([.3, .55, .7]), target = targetW * pA + (1 - targetW) * pB, now = MG.round(w * pA + (1 - w) * pB, 4), solved = MG.round((target - pB) / (pA - pB), 2), N = r.pick([120, 200, 350]), expected = MG.round(N * target, 0);
		return { marks: 6, text: `<p>A ${context} selects game A with probability ${w} and game B otherwise. Win probabilities are ${pA} and ${pB} respectively.</p>${br('i', 'Find the current overall win probability, correct to 4 decimal places.')}${br('ii', `The target overall probability is ${F.num(target, 3)}. Find the new probability of selecting A, correct to 2 decimal places.`)}${br('iii', `Hence find the expected wins in ${N} plays, to the nearest whole number.`)}`, answer: multi([now, solved, expected], ['current P(win)', 'new A weight', 'expected wins'], .01), solution: `<p><strong>(i)</strong> Total probability: ${w}(${pA})+${1 - w}(${pB})=<strong>${now}</strong>.</p><p><strong>(ii)</strong> Let x be the new weight. ${pA}x+${pB}(1&minus;x)=${F.num(target, 3)}, so <strong>x=${solved}</strong>.</p><p><strong>(iii)</strong> Expected wins = np = ${N}&times;${F.num(target, 3)} = <strong>${expected}</strong> to the nearest whole number.</p>` };
	});

	boss('boss-similar-right-triangles', 'Similarity + Pythagoras', (r) => {
		const object = r.pick(['roof frame', 'triangular sign']), triple = r.pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]), scale = r.pick([.4,.5,.6,.75]), area = MG.round(.5 * triple[0] * triple[1] * scale ** 2, 2);
		return { marks: 5, text: `<p>A ${object} has side lengths ${triple.join(', ')} m. A smaller, similar frame has hypotenuse ${MG.round(triple[2] * scale, 2)} m.</p>${br('i', 'Use the converse of Pythagoras to identify the hypotenuse; enter its length.')}${br('ii', 'Find the small-to-large scale factor, correct to 2 decimal places.')}${br('iii', 'Hence find the area of the smaller frame, correct to 2 decimal places.')}`, answer: multi([triple[2], scale, area], ['hypotenuse', 'scale factor (2 d.p.)', 'area (2 d.p.)'], .01), solution: `<p><strong>(i)</strong> ${triple[0]}&sup2;+${triple[1]}&sup2;=${triple[0] ** 2 + triple[1] ** 2}=${triple[2]}&sup2;. By the converse of Pythagoras the angle opposite <strong>${triple[2]} m</strong> is 90&deg;.</p><p><strong>(ii)</strong> Corresponding hypotenuses give ${MG.round(triple[2] * scale, 2)}/${triple[2]}=<strong>${scale}</strong>.</p><p><strong>(iii)</strong> Areas scale by the square: &frac12;(${triple[0]})(${triple[1]})(${scale})&sup2;=<strong>${area} m&sup2;</strong>.</p>` };
	});

	boss('boss-variation-units', 'Variation + Rates', (r) => {
		const thing = r.pick(['centripetal force', 'water resistance index']), k = r.pick([.4,.6,.8,1.2]), v1 = r.int(4,9), rcm = r.pick([20,25,40,50]), rad1 = rcm / 100, F1 = k * v1 ** 2 / rad1, v2 = r.int(7,14), rm = r.pick([.3,.5,.8,1.2]), F2 = MG.round(k * v2 ** 2 / rm, 2), pct = MG.round((F2 - F1) / F1 * 100, 1);
		return { marks: 6, text: `<p>For a ${thing}, F varies directly as v&sup2; and inversely as radius r. Initially v=${v1}, r=${rcm} cm and F=${F.num(F1, 2)}.</p>${br('i', 'After converting radius to metres, find the constant k.')}${br('ii', `Find F when v=${v2} and r=${rm} m, correct to 2 decimal places.`)}${br('iii', 'Hence find the percentage change in F, correct to 1 decimal place.')}`, answer: multi([k, F2, pct], ['k', 'new F (2 d.p.)', 'percentage change (1 d.p.)'], .05), solution: `<p><strong>(i)</strong> ${rcm} cm=${rad1} m. Since F=kv&sup2;/r, k=Fr/v&sup2;=<strong>${k}</strong>.</p><p><strong>(ii)</strong> F=${k}(${v2})&sup2;/${rm}=<strong>${F2}</strong>.</p><p><strong>(iii)</strong> Percentage change = (${F2}&minus;${F.num(F1,2)})/${F.num(F1,2)}&times;100=<strong>${pct}%</strong>.</p>` };
	});

	boss('boss-polynomial-factor', 'Polynomials + Algebra', (r) => {
		const context = r.pick(['polynomial P', 'volume model V']), neg = r.nonzeroInt(-6, -1), mid = r.int(neg === -1 ? 2 : 1, 4), roots = r.shuffle([neg, mid, r.int(5,9)]), a=roots[0], b=roots[1], c=roots[2], m=-(a+b+c), q=a*b+a*c+b*c, d=-a*b*c, sorted=roots.slice().sort((x,y)=>x-y);
		return { marks: 5, text: `<p>The ${context}(x)=x&sup3;+mx&sup2;${F.st(q,'x')}${F.st(d,'')}, and (x${F.st(-a,'')}) is a factor.</p>${br('i','Use the factor theorem to find m.')}${br('ii','Hence find the smaller of the other two roots.')}${br('iii','Hence, or otherwise, find the largest root of P(x)=0.')}`, answer: multi([m, sorted.filter(x=>x!==a)[0] ?? sorted[0], sorted[2]], ['m','smaller remaining root','largest root'], .001), solution: `<p><strong>(i)</strong> By the factor theorem P(${a})=0. Substitution and solving gives <strong>m=${m}</strong>.</p><p><strong>(ii)</strong> Division by (x${F.st(-a,'')}) gives x&sup2;${F.st(-(b+c),'x')}${F.st(b*c,'')}=(x${F.st(-b,'')})(x${F.st(-c,'')}). The smaller remaining root is <strong>${Math.min(b,c)}</strong>.</p><p><strong>(iii)</strong> All roots are ${sorted.join(', ')}, so the largest is <strong>${sorted[2]}</strong>.</p>` };
	});

	boss('boss-function-inverse', 'Functions + Equations', (r) => {
		const setting=r.pick(['conversion rule','scoring rule']), a=r.pick([2,3,4]), b=r.int(-8,8), k=r.int(-4,5), fk=a*k+b, c=r.int(-10,12), inv=(c-b)/a, meet=-b/(a+1);
		return { marks:5, text:`<p>A ${setting} is f(x)=${a}x${F.st(b,'')}.</p>${br('i',`Find f(${k}).`)}${br('ii',`Find f${F.sup('&minus;1')}(${c}), correct to 2 decimal places.`)}${br('iii',`Hence solve f(x)=f${F.sup('&minus;1')}(x), correct to 2 decimal places.`)}`, answer:multi([fk,MG.round(inv,2),MG.round(meet,2)],['f(k)','inverse value (2 d.p.)','x (2 d.p.)'],.01), solution:`<p><strong>(i)</strong> f(${k})=${a}(${k})${F.st(b,'')}=<strong>${fk}</strong>.</p><p><strong>(ii)</strong> y=${a}x${F.st(b,'')}; swap x,y and rearrange: f${F.sup('&minus;1')}(x)=(x&minus;${b})/${a}. Thus <strong>${MG.round(inv,2)}</strong>.</p><p><strong>(iii)</strong> ${a}x${F.st(b,'')}=(x&minus;${b})/${a}. Solving gives <strong>x=${MG.round(meet,2)}</strong>.</p>`};
	});

	boss('boss-simultaneous-logs', 'Logarithms + Simultaneous equations', (r) => {
		const story=r.pick(['two positive numbers','two growth factors']), t=r.pick([2,3,.5]), p=r.pick(t===.5?[2,4,6]:[1,2,3]), x=2**p, y=x**t, s=Math.log2(x*y);
		return {marks:5,text:`<p>For ${story} x and y, log${F.sub(2)}x + log${F.sub(2)}y = ${s} and log${F.sub('x')}y = ${t}.</p>${br('i','Use the change-of-base definition to find x.')}${br('ii','Hence find y.')}${br('iii','Hence, or otherwise, find x + y.')}`,answer:multi([x,y,x+y],['x','y','x+y'],.001),solution:`<p><strong>(i)</strong> log${F.sub('x')}y=${t} means y=x${F.sup(t)}. Also log${F.sub(2)}(xy)=${s}, so xy=2${F.sup(s)}. Hence x${F.sup(t+1)}=2${F.sup(s)} and <strong>x=${x}</strong> (x&gt;0, x&ne;1).</p><p><strong>(ii)</strong> y=${x}${F.sup(t)}=<strong>${y}</strong>.</p><p><strong>(iii)</strong> Therefore x+y=<strong>${x+y}</strong>.</p>`};
	});

	boss('boss-symbolic-triangle', 'Algebra + Trigonometry', (r) => {
		const item=r.pick(['steel bracket','triangular sail']), x=r.int(4,10), add=r.pick([1,2]), third=r.int(3,Math.min(8,2*x)), cos=(x*x+(x+add)**2-third**2)/(2*x*(x+add)), theta=Math.acos(cos), angle=MG.round(theta*180/Math.PI,0), area=MG.round(.5*x*(x+add)*Math.sin(theta),2);
		return {marks:6,text:`<p>A ${item} has sides x, x+${add}, and ${third}; the angle &theta; lies between the first two sides. Take x=${x}.</p>${br('i','Show that the cosine rule determines &theta;, then find cos &theta; correct to 2 decimal places.')}${br('ii','Hence find &theta;, to the nearest degree.')}${br('iii','Without using the rounded angle from (ii), find the area correct to 2 decimal places.')}`,answer:multi([MG.round(cos,2),angle,area],['cos theta (2 d.p.)','theta (nearest degree)','area (2 d.p.)'],.5),diagram:{type:'triangle',a:third,b:x+add,c:x,sideLabels:[third,`x+${add}`,'x']},solution:`<p><strong>(i)</strong> Cosine rule: cos &theta;=(${x}&sup2;+${x+add}&sup2;&minus;${third}&sup2;)/(2&times;${x}&times;${x+add})=<strong>${MG.round(cos,2)}</strong>.</p><p><strong>(ii)</strong> &theta;=cos${F.sup('&minus;1')}(${F.num(cos,4)})=<strong>${angle}&deg;</strong>.</p><p><strong>(iii)</strong> Using the unrounded value of &theta;, area=&frac12;ab sin &theta;=<strong>${area}</strong>.</p>`};
	});

	boss('boss-boxplot-decision', 'Statistics + Decision making', (r) => {
		const context=r.pick(['training times','weekly scores']), shift=r.int(0,20), data=[2,4,5,7,8,9,10,12,18].map(x=>x+shift), med=data[4], q1=(data[1]+data[2])/2,q3=(data[6]+data[7])/2,iqr=q3-q1, excluded=data.find(x=>x>med+iqr);
		return {marks:5,text:`<p>A coach records ${context}: ${data.join(', ')}. The rule excludes any value more than one IQR above the median.</p>${br('i','Find the exact median.')}${br('ii','Hence find the exact IQR.')}${br('iii','Hence, or otherwise, enter the exact value excluded by the rule.')}`,answer:multi([med,iqr,excluded],['exact median','exact IQR','exact excluded value'],.001),solution:`<p><strong>(i)</strong> There are 9 ordered values, so the fifth is the median: <strong>${med}</strong>.</p><p><strong>(ii)</strong> Q1=(${data[1]}+${data[2]})/2=${q1}, Q3=(${data[6]}+${data[7]})/2=${q3}; IQR=Q3&minus;Q1=<strong>${iqr}</strong>.</p><p><strong>(iii)</strong> The cut-off is ${med}+${iqr}=${med+iqr}. Since ${excluded}&gt;${med+iqr}, the coach excludes <strong>${excluded}</strong>.</p>`};
	});

	boss('boss-two-leg-journey', 'Bearings + Trigonometry', (r) => {
		const vehicle=r.pick(['rescue boat','survey aircraft']), b1=r.pick([30,45,60,75]), turn=r.pick([70,90,110,125]), b2=(b1+turn)%360,d1=r.int(8,20),d2=r.int(7,18),inside=180-turn,home=MG.round(Math.sqrt(d1*d1+d2*d2-2*d1*d2*Math.cos(rad(inside))),2);
		const east=d1*Math.sin(rad(b1))+d2*Math.sin(rad(b2)), north=d1*Math.cos(rad(b1))+d2*Math.cos(rad(b2)), bearing=MG.round((Math.atan2(-east,-north)*180/Math.PI+360)%360,0);
		return {marks:6,text:`<p>A ${vehicle} travels ${d1} km on bearing ${pad(b1)}&deg;, then ${d2} km on bearing ${pad(b2)}&deg;.</p>${br('i','Find the included angle at the turn.')}${br('ii','Hence find the direct distance home, correct to 2 decimal places.')}${br('iii','Hence, or otherwise, find the return bearing, to the nearest degree.')}`,answer:multi([inside,home,bearing],['included angle','distance (2 d.p.)','return bearing (nearest degree)'],.5),diagram:{type:'bearings',legs:[{bearing:b1,dist:d1,label:`${d1} km`,bearingLabel:`${pad(b1)}&deg;`},{bearing:b2,dist:d2,label:`${d2} km`,bearingLabel:`${pad(b2)}&deg;`}],names:['O','A','B'],close:true},solution:`<p><strong>(i)</strong> The back-bearing at the turn is ${pad(b1+180)}&deg;, so the included angle is ${pad(b1+180)}&deg;&minus;${pad(b2)}&deg;=<strong>${inside}&deg;</strong>.</p><p><strong>(ii)</strong> Cosine rule gives d=&radic;[${d1}&sup2;+${d2}&sup2;&minus;2(${d1})(${d2})cos ${inside}&deg;]=<strong>${home} km</strong>.</p><p><strong>(iii)</strong> Resolving the two legs into north/east components and applying tan${F.sup('&minus;1')} gives the home direction <strong>${pad(bearing)}&deg;</strong>.</p>`};
	});

	// =====================================================================
	// Composed boss chains: a SETUP hides the number n behind algebra, an
	// APPLICATION consumes n in a different topic. 7 setups x 8 applications
	// = 56 distinct structures, each further randomised, so chains stay
	// fresh across hundreds of servings. A short memory rejects recently
	// used setup/application pairs so the same structure is not re-served.
	// =====================================================================

	// each setup(n, r) -> { clause, sol }: a way of defining n without stating it
	const SETUPS = [
		(n, r) => { const m = r.int(2, 6); return {
			clause: `n is the positive solution of x&sup2;${F.st(m - n, 'x')}${F.st(-n * m, '')} = 0`,
			sol: `<p><strong>(i)</strong> Factorising: (x${F.st(-n, '')})(x${F.st(m, '')}) = 0, so x = ${n} or x = ${-m}. The negative root is rejected: <strong>n = ${n}</strong>.</p>` }; },
		(n, r) => { const b = n > 8 ? 2 : r.pick([2, 3]), v = b ** n; return {
			clause: `n satisfies ${b}<sup>n</sup> = ${v}`,
			sol: `<p><strong>(i)</strong> ${v} = ${b}<sup>${n}</sup>, so <strong>n = ${n}</strong>.</p>` }; },
		(n, r) => { const o = r.int(1, n - 1), s = n + o, d = n - o; return {
			clause: `n is the value of x satisfying x + y = ${s} and x &minus; y = ${d}`,
			sol: `<p><strong>(i)</strong> Adding the equations: 2x = ${s + d}, so <strong>n = ${n}</strong> (and y = ${o}).</p>` }; },
		(n, r) => { const a = r.pick([2, 3, 4]), b = r.nonzeroInt(-8, 8), c = a * n + b; return {
			clause: `n = f<sup>&minus;1</sup>(${c}) for the function f(x) = ${a}x${F.st(b, '')}`,
			sol: `<p><strong>(i)</strong> f(n) = ${c} means ${a}n${F.st(b, '')} = ${c}, so n = (${c}${F.st(-b, '')})/${a} = <strong>${n}</strong>.</p>` }; },
		(n, r) => { const a = r.int(2, 5), b = r.int(1, 9), c = a * n - b; return {
			clause: `n satisfies the equation ${a}n &minus; ${b} = ${c}`,
			sol: `<p><strong>(i)</strong> ${a}n = ${c + b}, so <strong>n = ${n}</strong>.</p>` }; },
		(n, r) => { const t = r.int(1, 3), b = r.nonzeroInt(-5, 5), k = n - t * t - b * t; return {
			clause: `n is the remainder when P(x) = x&sup2;${F.st(b, 'x')}${F.st(k, '')} is divided by (x &minus; ${t})`,
			sol: `<p><strong>(i)</strong> By the remainder theorem n = P(${t}) = ${t * t}${F.st(b * t, '')}${F.st(k, '')} = <strong>${n}</strong>.</p>` }; },
		(n) => { const P = n * (n + 1); return {
			clause: `n and n + 1 are consecutive positive integers whose product is ${P}`,
			sol: `<p><strong>(i)</strong> n(n + 1) = ${P} gives n&sup2; + n &minus; ${P} = 0 = (n${F.st(-n, '')})(n + ${n + 1}). The positive root is <strong>n = ${n}</strong>.</p>` }; },
	];

	// each application(n, r) -> { intro, p2, p3, v2, v3, l2, l3, tol?, diagram?, sol }
	const APPS = [
		(n, r) => { const blue = r.int(3, 8), T = n + blue, pRR = MG.round(n * (n - 1) / (T * (T - 1)), 4), pMix = MG.round(2 * n * blue / (T * (T - 1)), 4); return {
			intro: `A bag holds n red and ${blue} blue counters`,
			p2: 'Two counters are drawn without replacement. Find the probability both are red, correct to 4 decimal places.',
			p3: 'Hence, or otherwise, find the probability of one counter of each colour, correct to 4 decimal places.',
			v2: pRR, v3: pMix, l2: 'P(both red) (4 d.p.)', l3: 'P(one of each) (4 d.p.)', tol: .0005,
			sol: `<p><strong>(ii)</strong> P(RR) = ${n}/${T} &times; ${n - 1}/${T - 1} = <strong>${pRR}</strong>.</p><p><strong>(iii)</strong> The orders RB and BR are disjoint: 2 &times; ${n}/${T} &times; ${blue}/${T - 1} = <strong>${pMix}</strong>.</p>` }; },
		(n, r) => { const k = r.int(2, 6), leg = n + k, hyp = MG.round(Math.hypot(n, leg), 2), per = MG.round(n + leg + Math.hypot(n, leg), 2); return {
			intro: `A right-angled steel bracket has perpendicular sides n cm and (n + ${k}) cm`,
			p2: 'Find the length of the hypotenuse, correct to 2 decimal places.',
			p3: 'Hence find the perimeter of the bracket, correct to 2 decimal places.',
			v2: hyp, v3: per, l2: 'hypotenuse (2 d.p.)', l3: 'perimeter (2 d.p.)',
			diagram: { type: 'rightTriangle', base: 'n cm', height: `(n + ${k}) cm`, hyp: 'x' },
			sol: `<p><strong>(ii)</strong> x = &radic;(${n}&sup2; + ${leg}&sup2;) = <strong>${hyp} cm</strong>.</p><p><strong>(iii)</strong> Perimeter = ${n} + ${leg} + ${hyp} = <strong>${per} cm</strong>.</p>` }; },
		(n, r) => { const th = r.pick([45, 60, 80, 100, 120, 135, 150]), arc = MG.round(th / 180 * Math.PI * n, 2), area = MG.round(th / 360 * Math.PI * n * n, 2); return {
			intro: `A garden sprinkler waters a sector of radius n metres and angle ${th}&deg;`,
			p2: 'Find the arc length of the watered edge, correct to 2 decimal places.',
			p3: 'Hence, or otherwise, find the watered area, correct to 2 decimal places.',
			v2: arc, v3: area, l2: 'arc length (2 d.p.)', l3: 'area (2 d.p.)',
			diagram: { type: 'sector', angle: th, rLabel: 'n m', angleLabel: `${th}&deg;` },
			sol: `<p><strong>(ii)</strong> Arc = ${th}/360 &times; 2&pi;(${n}) = <strong>${arc} m</strong>.</p><p><strong>(iii)</strong> Area = ${th}/360 &times; &pi;(${n})&sup2; = <strong>${area} m&sup2;</strong>.</p>` }; },
		(n, r) => { const m = r.int(7, 15), A = r.pick([35, 50, 65, 80, 110, 125]), area = MG.round(.5 * n * m * Math.sin(rad(A)), 2), c = MG.round(Math.sqrt(n * n + m * m - 2 * n * m * Math.cos(rad(A))), 2); return {
			intro: `Triangle PQR has PQ = n cm, PR = ${m} cm and included angle &ang;P = ${A}&deg;`,
			p2: 'Find the area of the triangle, correct to 2 decimal places.',
			p3: 'Hence, or otherwise, find the length QR, correct to 2 decimal places.',
			v2: area, v3: c, l2: 'area (2 d.p.)', l3: 'QR (2 d.p.)',
			sol: `<p><strong>(ii)</strong> Area = &frac12;(${n})(${m})sin ${A}&deg; = <strong>${area} cm&sup2;</strong>.</p><p><strong>(iii)</strong> Cosine rule: QR&sup2; = ${n}&sup2; + ${m}&sup2; &minus; 2(${n})(${m})cos ${A}&deg;, so <strong>QR = ${c} cm</strong>.</p>` }; },
		(n, r) => { const m = r.int(2, 9), dist = MG.round(Math.hypot(n, m), 2); return {
			intro: `On a map grid, a beacon sits at B(n, ${m}) and the depot is at the origin O`,
			p2: 'Find the distance OB, correct to 2 decimal places.',
			p3: 'Hence, or otherwise, find the exact gradient of OB.',
			v2: dist, v3: m / n, l2: 'OB (2 d.p.)', l3: 'exact gradient of OB', tol: .005,
			sol: `<p><strong>(ii)</strong> OB = &radic;(${n}&sup2; + ${m}&sup2;) = <strong>${dist}</strong>.</p><p><strong>(iii)</strong> Gradient = rise/run = <strong>${MG.fracReduced(m, n)}</strong>.</p>` }; },
		(n, r) => { const p = r.pick([4, 6, 8]), t = r.int(3, 7), P0 = 100 * n, A = MG.round(P0 * (1 + p / 100) ** t, 2), I = MG.round(A - P0, 2); return {
			intro: `A deposit of 100n dollars earns ${p}% p.a. compound interest for ${t} years`,
			p2: `Find the value of the investment after ${t} years, correct to 2 decimal places.`,
			p3: 'Hence find the total interest earned, correct to 2 decimal places.',
			v2: A, v3: I, l2: 'final value ($, 2 d.p.)', l3: 'interest ($, 2 d.p.)',
			sol: `<p><strong>(ii)</strong> A = ${P0}(1.0${p})<sup>${t}</sup> = <strong>$${A}</strong>.</p><p><strong>(iii)</strong> Interest = ${A} &minus; ${P0} = <strong>$${I}</strong>.</p>` }; },
		(n, r) => { const mu = r.int(50, 70), k = r.pick([1, 2]), score = mu + k * n, pct = k === 1 ? 16 : 2.5; return {
			intro: `Test scores are normally distributed with mean ${mu} and standard deviation n`,
			p2: `Find the z-score of a result of ${score}.`,
			p3: 'Hence, using the empirical rule, find the percentage of results above this score, correct to 1 decimal place if necessary.',
			v2: k, v3: pct, l2: 'z-score', l3: 'percentage above',
			sol: `<p><strong>(ii)</strong> z = (${score} &minus; ${mu})/${n} = <strong>${k}</strong>.</p><p><strong>(iii)</strong> ${k === 1 ? '68% lie within 1 SD, leaving 32% in the tails' : '95% lie within 2 SDs, leaving 5% in the tails'}; half of that is above: <strong>${pct}%</strong>.</p>` }; },
		(n, r) => { const h = r.int(6, 15), V = MG.round(Math.PI * n * n * h, 2), S = MG.round(2 * Math.PI * n * (n + h), 2); return {
			intro: `A closed cylindrical tank has radius n metres and height ${h} metres`,
			p2: 'Find the volume of the tank, correct to 2 decimal places.',
			p3: 'Find the total surface area of the tank, correct to 2 decimal places.',
			v2: V, v3: S, l2: 'volume (2 d.p.)', l3: 'surface area (2 d.p.)',
			diagram: { type: 'cylinder', rLabel: 'n m', hLabel: `${h} m` },
			sol: `<p><strong>(ii)</strong> V = &pi;r&sup2;h = &pi;(${n})&sup2;(${h}) = <strong>${V} m&sup3;</strong>.</p><p><strong>(iii)</strong> S = 2&pi;r(r + h) = 2&pi;(${n})(${n + h}) = <strong>${S} m&sup2;</strong>.</p>` }; },
	];

	// short-term memory so a setup/application pairing is not re-served soon
	const recentCombos = [];
	const mixBoss = (id, appIdxs) => boss(id, 'Mixed skills', (r) => {
		let si, ci, tries = 0, key;
		do {
			si = r.int(0, SETUPS.length - 1);
			ci = appIdxs[r.int(0, appIdxs.length - 1)];
			key = `${si}:${ci}`;
			tries++;
		} while (tries < 15 && recentCombos.includes(key));
		recentCombos.push(key);
		while (recentCombos.length > 20) recentCombos.shift();
		const n = r.int(4, 12);
		const s = SETUPS[si](n, r), c = APPS[ci](n, r);
		return {
			marks: 6,
			text: `<p>${c.intro}, where ${s.clause}.</p>${br('i', 'Find n.')}${br('ii', c.p2)}${br('iii', c.p3)}`,
			answer: multi([n, c.v2, c.v3], ['n', c.l2, c.l3], c.tol ?? .01),
			diagram: c.diagram,
			solution: s.sol + c.sol,
		};
	});
	mixBoss('boss-mix-measurement', [1, 2, 3, 7]); // bracket, sector, triangle, cylinder
	mixBoss('boss-mix-applications', [0, 4, 5, 6]); // probability, coordinates, interest, z-scores

	boss('boss-exponential-growth', 'Exponential functions + Logarithms', (r) => {
		const population=r.pick(['bacteria culture','online subscribers']), n0=r.int(80,300), a=r.pick([1.08,1.12,1.18,1.25]), t=r.int(4,10), target=r.int(2,5)*n0, nt=MG.round(n0*a**t,0), when=MG.round(Math.log(target/n0)/Math.log(a),2), doubling=MG.round(Math.log(2)/Math.log(a),2);
		return {marks:6,text:`<p>A ${population} follows N=${n0}(${a})${F.sup('t')}, where t is in hours.</p>${br('i',`Find N after ${t} hours, to the nearest whole number.`)}${br('ii',`Find when N first reaches ${target}, correct to 2 decimal places.`)}${br('iii','Hence, or otherwise, find the doubling time, correct to 2 decimal places.')}`,answer:multi([nt,when,doubling],['N (nearest whole number)','time (2 d.p.)','doubling time (2 d.p.)'],.5),solution:`<p><strong>(i)</strong> N=${n0}(${a})${F.sup(t)}=<strong>${nt}</strong> to the nearest whole number.</p><p><strong>(ii)</strong> ${target}=${n0}(${a})${F.sup('t')}; taking logs, t=log(${target}/${n0})/log(${a})=<strong>${when} h</strong>.</p><p><strong>(iii)</strong> For doubling, 2=${a}${F.sup('t')}, so t=log 2/log ${a}=<strong>${doubling} h</strong>.</p>`};
	});
})();
