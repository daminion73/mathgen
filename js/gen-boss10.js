// Boss batch 10: maximum-difficulty geometry, trigonometry and probability chains.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const dp = (x, d) => MG.round(x, d);
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 4, gen });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const br = (i, s) => `<br><strong>(${i})</strong> ${s}`;

	boss('boss10-focus-directrix', 'Parabolic loci from focus and directrix', function (r) {
		const h=r.int(-5,5), k=r.int(-5,5), p=r.int(2,6), x=r.int(1,5), y=k+(x*x)/(4*p);
		return {marks:7,text:`Point P moves so that its distance from F${F.pt(h,k+p)} equals its perpendicular distance from the line y=${k-p}.${br('i','Find the y-coordinate of the vertex.')}${br('ii','Find the focal length.')}${br('iii',`At horizontal displacement ${x} from the axis, find the y-coordinate of P exactly.`)}`,answer:multi([k,p,y],['(i) vertex y','(ii) focal length','(iii) point y (exact)']),solution:`<p>(i) The vertex is midway between focus and directrix, so y=<strong>${k}</strong>.</p><p>(ii) Their separation is ${2*p}, hence the focal length is <strong>${p}</strong>.</p><p>(iii) From (x&minus;${h})&sup2;=4(${p})(y&minus;${k}), y=<strong>${y}</strong>.</p>`};
	});

	boss('boss10-apollonius-circle', 'Apollonius circle loci', function (r) {
		const a=r.int(2,7), k=r.pick([2,3]), centre=(k*k*a-a)/(k*k-1), rad2=k*k*(2*a)**2/(k*k-1)**2;
		return {marks:7,text:`A${F.pt(-a,0)} and B${F.pt(a,0)} are fixed. The locus of P satisfies PA=${k}PB. Give exact answers.${br('i','Find the x-coordinate of the centre after completing the square.')}${br('ii','Find the radius squared.')}${br('iii','Find the positive x-intercept of the locus.')}`,answer:multi([centre,rad2,centre+Math.sqrt(rad2)],['(i) centre x (exact)','(ii) radius squared (exact)','(iii) positive intercept (exact)']),solution:`<p>Square PA=${k}PB and collect terms.</p><p>(i) Completing the square gives centre x=<strong>${centre}</strong>.</p><p>(ii) The constant gives r&sup2;=<strong>${rad2}</strong>.</p><p>(iii) On the x-axis the right intercept is centre plus radius: <strong>${centre+Math.sqrt(rad2)}</strong>.</p>`};
	});

	boss('boss10-two-loci', 'Intersection of perpendicular-bisector loci', function (r) {
		const h=r.int(-5,5), k=r.int(-5,5), a=r.int(2,7), b=r.int(2,7), dy=(a*a-b*b)/(2*b), py=k+dy, pa2=a*a+dy*dy;
		return {marks:7,text:`A${F.pt(h-a,k)}, B${F.pt(h+a,k)} and C${F.pt(h,k-b)} are fixed. P is equidistant from A and B, and also from A and C.${br('i','Show that P lies on x='+h+'.')}${br('ii','By equating squared distances, find its y-coordinate exactly.')}${br('iii','Hence find PA&sup2; exactly.')}${br('iv','State the radius squared of the circle through A, B and C.')}`,answer:multi([h,py,pa2,pa2],['(i) P x','(ii) P y (exact)','(iii) PA squared (exact)','(iv) circumradius squared (exact)']),solution:`<p>(i) The perpendicular bisector of AB is x=<strong>${h}</strong>.</p><p>(ii) Put y=${k}+d. Then PA&sup2;=${a*a}+d&sup2; and PC&sup2;=(d+${b})&sup2;, so d=${dy} and y=<strong>${py}</strong>.</p><p>(iii) Thus PA&sup2;=<strong>${pa2}</strong>.</p><p>(iv) P is the circumcentre, so the radius squared is also <strong>${pa2}</strong>.</p>`};
	});

	boss('boss10-midpoint-locus', 'Midpoint locus of a constrained segment', function (r) {
		const c=r.int(8,20), t=r.int(2,c-2), mx=t/2, my=(c-t)/2, sum=c/2;
		return {marks:6,text:`A=(u,0) and B=(0,v) lie on the positive axes and u+v=${c}. M is the midpoint of AB.${br('i',`When u=${t}, find the x-coordinate of M.`)}${br('ii','Find the corresponding y-coordinate.')}${br('iii','Find the constant value of x_M+y_M, thereby identifying the midpoint locus.')}`,answer:multi([mx,my,sum],['(i) midpoint x (exact)','(ii) midpoint y (exact)','(iii) locus constant (exact)']),solution:`<p>M=(${F.frac('u','2')},${F.frac('v','2')}).</p><p>(i) x=<strong>${mx}</strong>.</p><p>(ii) Since v=${c}&minus;${t}, y=<strong>${my}</strong>.</p><p>(iii) x+y=(u+v)/2=<strong>${sum}</strong>.</p>`};
	});

	boss('boss10-feasible-maximum', 'Linear programming over a triangular region', function (r) {
		const a=r.int(4,9), b=r.int(3,8), p=r.int(2,6), q=r.int(2,6), vals=[0,p*a,q*b], max=Math.max(...vals), vertex=vals[1]>=vals[2]?[a,0]:[0,b];
		return {marks:7,text:`Consider x&ge;0, y&ge;0 and ${b}x+${a}y&le;${a*b}. Let Z=${p}x+${q}y.${br('i','Find the non-origin x-intercept of the boundary.')}${br('ii','Find its non-origin y-intercept.')}${br('iii','Find the maximum value of Z.')}${br('iv','Find x+y at a vertex where that maximum occurs.')}`,answer:multi([a,b,max,vertex[0]+vertex[1]],['(i) x-intercept','(ii) y-intercept','(iii) maximum Z','(iv) maximizing x+y']),solution:`<p>The feasible vertices are (0,0), (${a},0), (0,${b}).</p><p>(i) x=<strong>${a}</strong>.</p><p>(ii) y=<strong>${b}</strong>.</p><p>(iii) Comparing 0, ${p*a}, ${q*b} gives <strong>${max}</strong>.</p><p>(iv) At a maximizing vertex, x+y=<strong>${vertex[0]+vertex[1]}</strong>.</p>`};
	});

	boss('boss10-strip-polygon', 'Area of an inequality polygon', function (r) {
		const a=r.int(5,12), b=r.int(2,a-1), outer=2*a*a, strip=2*a*b, area=outer-strip;
		return {marks:8,text:`The region satisfies |x|+|y|&le;${a} and |x+y|&ge;${b}.${br('i','Show that the outer boundary is a diamond and derive its area.')}${br('ii','Use u=x+y and v=x&minus;y to describe the outer diamond in the uv-plane.')}${br('iii','Remembering the area scale factor, find the area removed by |u|&lt;'+b+'.')}${br('iv','Hence find the area of the required region.')}`,answer:multi([strip,area],['(iii) removed area','(iv) required area']),solution:`<p>(i) Its diagonals both have length ${2*a}, giving ${F.frac(1,2)}(${2*a})&sup2;=<strong>${outer}</strong>.</p><p>(ii) The identity |x|+|y|=max(|u|,|v|) gives |u|,|v|&le;<strong>${a}</strong>.</p><p>(iii) The strip is ${2*b} by ${2*a} in uv-coordinates. Since |&part;(x,y)/&part;(u,v)|=1/2, its area is <strong>${strip}</strong>.</p><p>(iv) ${outer}&minus;${strip}=<strong>${area}</strong>.</p>`};
	});

	boss('boss10-trig-quadratic', 'Quadratic trigonometric equations', function (r) {
		const pair=r.pick([[0.5,-0.5],[0.5,-1],[-0.5,1]]), s=pair[0]+pair[1], prod=pair[0]*pair[1];
		const angles=pair.includes(1)?[0,60,300]:pair.includes(-1)?[60,180,300]:[60,120,240,300];
		const lead=r.pick(['Solve completely:','Without a graph, solve:','Using exact values, solve:','Factor first, then solve:']);
		return {marks:7,text:`${lead} For 0&deg;&le;&theta;&le;360&deg;, cos&sup2;&theta;${F.st(-s,'cos&theta;')}${F.st(prod,'')}=0.${br('i','How many distinct solutions are there?')}${br('ii','Find the smallest solution in degrees.')}${br('iii','Find the largest solution in degrees.')}`,answer:multi([angles.length,Math.min(...angles),Math.max(...angles)],['(i) solution count','(ii) smallest angle (degrees)','(iii) largest angle (degrees)']),solution:`<p>The quadratic factors to (cos&theta;&minus;${pair[0]})(cos&theta;&minus;${pair[1]})=0.</p><p>(i) There are <strong>${angles.length}</strong> solutions.</p><p>(ii) The smallest is <strong>${Math.min(...angles)}&deg;</strong>.</p><p>(iii) The largest is <strong>${Math.max(...angles)}&deg;</strong>.</p>`};
	});

	boss('boss10-exact-quadrant', 'Exact values and identities', function (r) {
		const tri=r.pick([[3,4,5],[5,12,13],[8,15,17]]), quad=r.pick([2,4]), sin=(quad===2?1:-1)*tri[0]/tri[2], cos=(quad===2?-1:1)*tri[1]/tri[2], value=sin/(1+cos);
		const name=r.pick(['&theta;','&alpha;','&phi;']);
		return {marks:6,text:`Angle ${name} lies in quadrant ${quad===2?'II':'IV'} and |tan${name}|=${F.frac(tri[0],tri[1])}. Give exact answers.${br('i',`Find sin${name}.`)}${br('ii',`Find cos${name}.`)}${br('iii',`Evaluate sin${name}/(1+cos${name}).`)}`,answer:multi([sin,cos,value],['(i) sine (exact)','(ii) cosine (exact)','(iii) expression (exact)']),solution:`<p>Use a ${tri[0]}-${tri[1]}-${tri[2]} reference triangle and quadrant signs.</p><p>(i) The sine is <strong>${sin}</strong>.</p><p>(ii) The cosine is <strong>${cos}</strong>.</p><p>(iii) Substitution and simplification gives <strong>${value}</strong>.</p>`};
	});

	boss('boss10-sector-segment', 'Sector and segment chains', function (r) {
		const R=r.int(4,12), angle=r.pick([60,90,120]), perimeter=2*R+Math.PI*R*angle/180, sector=Math.PI*R*R*angle/360, triangle=0.5*R*R*Math.sin(angle*Math.PI/180);
		return {marks:7,text:`A sector has central angle ${angle}&deg; and perimeter ${dp(perimeter,2)} cm.${br('i','Find its radius correct to 2 decimal places.')}${br('ii','Find its sector area correct to 2 decimal places.')}${br('iii','Find the area of the minor segment correct to 2 decimal places.')}`,answer:multi([dp(R,2),dp(sector,2),dp(sector-triangle,2)],['(i) radius (2 d.p.)','(ii) sector area (2 d.p.)','(iii) segment area (2 d.p.)'],0.006),solution:`<p>Perimeter=2r+r&theta;, with &theta; in radians.</p><p>(i) Solving gives r=<strong>${R} cm</strong>.</p><p>(ii) Area=${F.frac('1','2')}r&sup2;&theta;=<strong>${dp(sector,2)} cm&sup2;</strong>.</p><p>(iii) Subtracting ${F.frac('1','2')}r&sup2;sin&theta; gives <strong>${dp(sector-triangle,2)} cm&sup2;</strong>.</p>`};
	});

	boss('boss10-3d-cuboid-trig', 'Three-dimensional trigonometry', function (r) {
		const scale=r.int(1,6), a=3*scale, b=4*scale, h=12*scale, base=5*scale, space=13*scale, elev=dp(Math.atan(h/base)*180/Math.PI,2);
		const object=r.pick(['storage crate','glass display case','rectangular room']);
		return {marks:8,text:`A ${object} is cuboid-shaped, with horizontal side lengths ${a} cm and ${b} cm, and vertical height ${h} cm.${br('i','Show that the square of the base diagonal is the sum of the squares of the horizontal sides.')}${br('ii','Hence find the space diagonal exactly.')}${br('iii','Find the angle the space diagonal makes with the base, correct to 2 decimal places.')}${br('iv','Find the angle it makes with a vertical edge, correct to 2 decimal places.')}`,diagram:{type:'solid3d',verts:{A:[0,0,0],B:[a,0,0],C:[a,b,0],D:[0,b,0],E:[0,0,h],F:[a,0,h],G:[a,b,h],H:[0,b,h]},edges:[['A','B'],['B','C'],['C','D',{dash:true}],['D','A',{dash:true}],['E','F'],['F','G'],['G','H'],['H','E'],['A','E'],['B','F'],['C','G'],['D','H',{dash:true}],['A','C',{dash:true,accent:true}],['A','G',{accent:true,label:'d'}]],angles:[{at:'A',from:'C',to:'G',label:'&theta;'}],rightAngles:[{at:'C',from:'A',to:'G'}]},answer:multi([base,space,elev,dp(90-elev,2)],['(i) base diagonal (cm)','(ii) space diagonal (cm), exact','(iii) elevation (2 d.p.)','(iv) angle to vertical (2 d.p.)'],0.006),solution:`<p>(i) By Pythagoras, &radic;(${a}&sup2;+${b}&sup2;)=<strong>${base} cm</strong>.</p><p>(ii) A second application gives &radic;(${base}&sup2;+${h}&sup2;)=<strong>${space} cm</strong>.</p><p>(iii) tan&theta;=${h}/${base}, so &theta;=<strong>${elev}&deg;</strong>.</p><p>(iv) The complementary angle is <strong>${dp(90-elev,2)}&deg;</strong>.</p>`};
	});

	boss('boss10-without-replacement', 'Conditional probability without replacement', function (r) {
		const red=r.int(3,8), blue=r.int(3,8), n=red+blue, rb=red/n*blue/(n-1), mixed=2*rb, cond=rb/mixed;
		return {marks:7,text:`A bag contains ${red} red and ${blue} blue counters. Two are drawn without replacement. Give exact answers.${br('i','Find P(red then blue).')}${br('ii','Find P(exactly one red).')}${br('iii','Given exactly one red, find P(the first counter was red).')}`,answer:multi([rb,mixed,cond],['(i) red then blue (exact)','(ii) exactly one red (exact)','(iii) conditional probability (exact)']),solution:`<p>(i) Multiply successive fractions: <strong>${rb}</strong>.</p><p>(ii) Either order is possible, giving <strong>${mixed}</strong>.</p><p>(iii) Divide the first probability by the second: <strong>${cond}</strong>.</p>`};
	});

	boss('boss10-complement-counting', 'Complementary counting and conditioning', function (r) {
		const n=r.int(5,10), draws=r.int(2,4), total=2**draws, none=((n-1)/n)**draws, atleast=1-none, exactly=draws*(1/n)*((n-1)/n)**(draws-1), cond=exactly/atleast;
		return {marks:7,text:`A fair ${n}-sided spinner is spun ${draws} times independently. A target number is fixed. Give exact answers.${br('i','Find the number of binary target/not-target patterns.')}${br('ii','Find the probability the target occurs at least once.')}${br('iii','Given it occurs at least once, find the probability it occurs exactly once.')}`,answer:multi([total,atleast,cond],['(i) pattern count','(ii) at least once (exact)','(iii) exactly once conditional (exact)']),solution:`<p>(i) Each spin has two status choices, giving <strong>${total}</strong> patterns.</p><p>(ii) Complementing no targets gives <strong>${atleast}</strong>.</p><p>(iii) The exactly-once probability is ${exactly}; division by part (ii) gives <strong>${cond}</strong>.</p>`};
	});
})();
