// Difficult multi-step spatial-reasoning problems for Years 10–11.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const G = MG.generators;
	const round2 = (x) => MG.round(x, 2);
	const multi = (values, labels) => ({ type: 'multinumeric', values, labels, tolerance: 0.006 });
	const add = (id, subtopic, gen) => G.push({ id, topic: 'Spatial Reasoning', subtopic, difficulty: 4, gen });
	const ol = (...items) => `<ol type="i">${items.map((x) => `<li>${x}</li>`).join('')}</ol>`;
	const box = (a, b, h, edgeLabels) => ({
		type: 'solid3d', pad: 48,
		verts: { A:[0,0,0], B:[a,0,0], C:[a,b,0], D:[0,b,0], E:[0,0,h], F:[a,0,h], G:[a,b,h], H:[0,b,h] },
		edges: [['A','B',edgeLabels && {label:`${a} cm`}],['B','C',edgeLabels && {label:`${b} cm`}],['C','D',{dash:true}],['D','A',{dash:true}],['E','F'],['F','G'],['G','H'],['H','E'],['A','E',edgeLabels && {label:`${h} cm`,labelOffset:[-30,4]}],['B','F'],['C','G'],['D','H',{dash:true}]]
	});

	add('spatial-volume-cuboid', 'Recovering dimensions from constraints', function (r) {
		const a=r.int(4,11), b=a+r.int(2,7), h=r.int(7,18), V=a*b*h;
		const base=Math.hypot(a,b), space=Math.hypot(a,b,h), angle=Math.atan2(h,base)*180/Math.PI;
		const d=box(a,b,h,false);
		d.edges[0][2]={label:'x'}; d.edges[1][2]={label:'y'};
		return { marks:10, text:`A sealed cuboid has base perimeter ${2*(a+b)} cm, squared base diagonal ${a*a+b*b} cm&sup2;, and volume ${V} cm&sup3;. Its base sides satisfy x&lt;y. No individual dimension is given. Give non-integer answers correct to 2 decimal places.${ol('Derive a quadratic equation for the base sides, then find the shorter side x.','Use the constraints to find the vertical height.','Hence find the space diagonal AG.','Find the angle AG makes with the base plane.')}`, diagram:d,
			answer:multi([a,h,round2(space),round2(angle)],['(i) shorter base side x (cm)','(ii) height (cm)','(iii) AG (cm, 2 d.p.)','(iv) angle to base (degrees, 2 d.p.)']),
			solution:`<p>(i) x+y=${a+b} and x&sup2;+y&sup2;=${a*a+b*b}. Squaring the sum gives 2xy=${(a+b)**2}&minus;${a*a+b*b}, so xy=${a*b}. The base sides solve t&sup2;&minus;${a+b}t+${a*b}=0, giving ${a} and ${b}. Thus x=<strong>${a} cm</strong>.</p><p>(ii) The base area is ${a*b}, hence h=${V}/${a*b}=<strong>${h} cm</strong>.</p><p>(iii) AG is the hypotenuse of a right triangle whose other sides are the base diagonal and height, so AG=&radic;(${a*a+b*b}+${h}&sup2;)=<strong>${round2(space)} cm</strong>.</p><p>(iv) Its horizontal projection is the base diagonal. Thus tan &theta;=${h}/&radic;(${a*a+b*b}), giving <strong>${round2(angle)}&deg;</strong>.</p>` };
	});

	add('spatial-surface-route', 'Shortest paths on a cuboid surface', function (r) {
		const a=r.int(5,14), b=r.int(4,12), h=r.int(7,17);
		const routes=[Math.hypot(a+b,h),Math.hypot(a+h,b),Math.hypot(b+h,a)], shortest=Math.min(...routes);
		const d=box(a,b,h,true);
		return { marks:9, text:`An ant travels from vertex A to the opposite vertex G of a ${a} cm by ${b} cm by ${h} cm cuboid, staying on its surface. Three essentially different two-face unfoldings must be compared. Give lengths correct to 2 decimal places.${ol(`Unfold so the ${a} cm and ${b} cm edges lie end-to-end; find the straight route.`,`Unfold so the ${a} cm and ${h} cm edges lie end-to-end; find the straight route.`,`Unfold so the ${b} cm and ${h} cm edges lie end-to-end; find the straight route.`,'Hence find the shortest possible surface distance.')}`, diagram:d,
			answer:multi(routes.map(round2).concat(round2(shortest)),['(i) first route (cm, 2 d.p.)','(ii) second route (cm, 2 d.p.)','(iii) third route (cm, 2 d.p.)','(iv) shortest route (cm, 2 d.p.)']),
			solution:`<p>Each unfolding turns two adjacent faces into one rectangle; a shortest route within it is its diagonal. The space diagonal is not a valid surface route.</p><p>(i) &radic;((${a}+${b})&sup2;+${h}&sup2;)=<strong>${round2(routes[0])} cm</strong>.</p><p>(ii) &radic;((${a}+${h})&sup2;+${b}&sup2;)=<strong>${round2(routes[1])} cm</strong>.</p><p>(iii) &radic;((${b}+${h})&sup2;+${a}&sup2;)=<strong>${round2(routes[2])} cm</strong>.</p><p>(iv) Comparing all three gives <strong>${round2(shortest)} cm</strong>.</p>` };
	});

	add('spatial-square-pyramid-angles', 'Projections and sloping-face angles', function (r) {
		const s=r.int(6,16), h=r.int(7,19), slant=Math.hypot(h,s/2), edge=Math.hypot(h,s/Math.sqrt(2));
		const faceAng=Math.atan2(h,s/2)*180/Math.PI, edgeAng=Math.atan2(h,s/Math.sqrt(2))*180/Math.PI;
		const d={type:'solid3d',pad:48,verts:{A:[0,0,0],B:[s,0,0],C:[s,s,0],D:[0,s,0],O:[s/2,s/2,0],T:[s/2,s/2,h],M:[s/2,0,0]},faces:[['A','B','T']],edges:[['A','B',{label:`${s} cm`,labelOffset:[0,34]}],['B','C'],['C','D',{dash:true}],['D','A',{dash:true}],['T','A'],['T','B'],['T','C'],['T','D'],['T','O',{dash:true,label:`${h} cm`,labelOffset:[32,4]}],['O','M',{dash:true}],['T','M',{accent:true}]],rightAngles:[{at:'O',from:'T',to:'M'}]};
		return { marks:9, text:`T is vertically above the centre O of a square base ABCD of side ${s} cm, and TO=${h} cm. M is the midpoint of AB. Give non-integer answers correct to 2 decimal places.${ol('Find OM.','Find the slant height TM of face TAB.','Find the angle between face TAB and the base.','Find the angle between sloping edge TA and the base plane.')}`, diagram:d,
			answer:multi([s/2,round2(slant),round2(faceAng),round2(edgeAng)],['(i) OM (cm)','(ii) TM (cm, 2 d.p.)','(iii) face-base angle (degrees, 2 d.p.)','(iv) edge-base angle (degrees, 2 d.p.)']),
			solution:`<p>(i) The centre-to-midpoint distance is half a side: <strong>${s/2} cm</strong>.</p><p>(ii) TO is perpendicular to the base, so triangle TOM is right angled and TM=&radic;(${h}&sup2;+(${s}/2)&sup2;)=<strong>${round2(slant)} cm</strong>.</p><p>(iii) The dihedral angle is seen in the perpendicular cross-section TOM: tan &theta;=${h}/(${s}/2), hence <strong>${round2(faceAng)}&deg;</strong>.</p><p>(iv) AO is the projection of TA and AO=${s}/&radic;2. Thus tan &phi;=${h}/(${s}/&radic;2), giving <strong>${round2(edgeAng)}&deg;</strong>.</p>` };
	});

	add('spatial-pyramid-cross-section', 'Parallel cross-sections and similarity', function (r) {
		const B=r.int(9,20), H=r.int(12,25), t=r.int(4,H-3), side=B*t/H, area=side*side;
		const smallV=area*t/3, wholeV=B*B*H/3, frustum=wholeV-smallV;
		const d={type:'solid3d',verts:{A:[0,0,0],B:[B,0,0],C:[B,B,0],D:[0,B,0],T:[B/2,B/2,H],P:[B/2-side/2,B/2-side/2,H-t],Q:[B/2+side/2,B/2-side/2,H-t],R:[B/2+side/2,B/2+side/2,H-t],S:[B/2-side/2,B/2+side/2,H-t]},edges:[['A','B',{label:`${B} cm`}],['B','C'],['C','D',{dash:true}],['D','A',{dash:true}],['T','A'],['T','B'],['T','C'],['T','D'],['P','Q',{accent:true}],['Q','R',{accent:true}],['R','S',{accent:true,dash:true}],['S','P',{accent:true}]]};
		return { marks:9, text:`A square pyramid has base side ${B} cm and perpendicular height ${H} cm. A plane parallel to the base cuts it ${t} cm down from the apex, forming a smaller similar square pyramid above the plane. Give non-integer answers correct to 2 decimal places.${ol('Find the linear scale factor (small pyramid : whole pyramid).','Find the side length of the square cross-section.','Find the area of the cross-section.','Find the volume of the frustum below the plane.')}`, diagram:d,
			answer:multi([round2(t/H),round2(side),round2(area),round2(frustum)],['(i) scale factor (2 d.p.)','(ii) cross-section side (cm, 2 d.p.)','(iii) cross-section area (cm², 2 d.p.)','(iv) frustum volume (cm³, 2 d.p.)']),
			solution:`<p>(i) Corresponding heights give scale factor ${t}/${H}=<strong>${round2(t/H)}</strong>.</p><p>(ii) Similarity gives side ${B}(${t}/${H})=<strong>${round2(side)} cm</strong>.</p><p>(iii) Area scales as the square of the linear factor: ${B}&sup2;(${t}/${H})&sup2;=<strong>${round2(area)} cm&sup2;</strong>.</p><p>(iv) Subtract the small pyramid from the whole: ${B}&sup2;(${H})/3&minus;(${side})&sup2;(${t})/3=<strong>${round2(frustum)} cm&sup3;</strong>.</p>` };
	});

	add('spatial-frame-optimisation', 'Discrete optimisation of a cuboid', function (r) {
		const n=r.int(9,24), wire=4*n, candidates=[];
		for(let x=1;x<n/2;x++) candidates.push({x,h:n-2*x,v:x*x*(n-2*x)});
		const best=candidates.reduce((p,c)=>c.v>p.v?c:p), count=candidates.length;
		const d=box(best.x,best.x,best.h,false);
		return { marks:8, text:`A cuboid frame has a square base of integer side x cm and integer height h cm. Its 12 edges use exactly ${wire} cm of wire, with no overlap or waste. Both dimensions are positive integers.${ol('Show that h can be written in terms of x, then state the number of feasible integer values of x.','By comparing the feasible volumes (or successive differences), find the value of x giving maximum volume.','Find the corresponding height.','Find the maximum enclosed volume.')}`, diagram:d,
			answer:multi([count,best.x,best.h,best.v],['(i) number of feasible x-values','(ii) maximizing x (cm)','(iii) corresponding h (cm)','(iv) maximum volume (cm³)']),
			solution:`<p>The eight horizontal edges total 8x and the four vertical edges total 4h. Hence 8x+4h=${wire}, so h=${n}&minus;2x.</p><p>(i) Positivity gives x=1,2,...,${count}: <strong>${count}</strong> values.</p><p>(ii) Compare V=x&sup2;(${n}&minus;2x) over these integers; the largest occurs at x=<strong>${best.x} cm</strong>. This finite comparison proves the maximum without calculus.</p><p>(iii) h=${n}&minus;2(${best.x})=<strong>${best.h} cm</strong>.</p><p>(iv) V=${best.x}&sup2;(${best.h})=<strong>${best.v} cm&sup3;</strong>.</p>` };
	});

	add('spatial-triangular-prism', 'Recovering a prism from ratio and volume', function (r) {
		const ratios=r.pick([[3,4],[5,12],[8,15],[7,24]]), p=ratios[0], q=ratios[1], k=r.int(2,7), L=r.int(8,20), V=p*q*k*k*L/2;
		const u=p*k,v=q*k,hyp=Math.hypot(u,v), diag=Math.hypot(hyp,L), angle=Math.atan2(L,hyp)*180/Math.PI;
		const d={type:'solid3d',verts:{A:[0,0,0],B:[u,0,0],C:[0,0,v],D:[0,L,0],E:[u,L,0],F:[0,L,v]},faces:[['A','B','C']],edges:[['A','B'],['B','C'],['C','A'],['D','E'],['E','F'],['F','D',{dash:true}],['A','D',{label:`${L} cm`}],['B','E'],['C','F'],['B','F',{accent:true,label:'d'}]],rightAngles:[{at:'A',from:'B',to:'C'}]};
		return { marks:9, text:`A right triangular prism is ${L} cm long and has volume ${V} cm&sup3;. The perpendicular legs of each triangular end are in the ratio ${p}:${q}. Let their lengths be ${p}k and ${q}k centimetres. Give non-integer answers correct to 2 decimal places.${ol('Use the volume to find k.','Hence find the hypotenuse of a triangular end.','Find the diagonal BF of the rectangular face built on that hypotenuse.','Find the angle BF makes with the triangular end plane.')}`, diagram:d,
			answer:multi([k,round2(hyp),round2(diag),round2(angle)],['(i) k','(ii) end hypotenuse (cm, 2 d.p.)','(iii) BF (cm, 2 d.p.)','(iv) angle to end plane (degrees, 2 d.p.)']),
			solution:`<p>(i) Volume=(${p}k)(${q}k)${L}/2=${V}, so k&sup2;=${k*k} and positive k=<strong>${k}</strong>.</p><p>(ii) Pythagoras on the end gives &radic;((${u})&sup2;+(${v})&sup2;)=<strong>${round2(hyp)} cm</strong>.</p><p>(iii) Unfolding the rectangular face, BF=&radic;(${hyp}&sup2;+${L}&sup2;)=<strong>${round2(diag)} cm</strong>.</p><p>(iv) The projection of BF onto the end plane is its hypotenuse, so tan &theta;=${L}/${hyp}; &theta;=<strong>${round2(angle)}&deg;</strong>.</p>` };
	});
})();
