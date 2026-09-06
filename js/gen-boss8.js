// Boss batch 8: niche advanced multi-part chains.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const dp = (x, d) => MG.round(x, d);
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 3, gen });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const num = (value, label, tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	// Boss chains begin with a modelling/proof step; entered answers belong to (ii)-(iv).
	const br = (i, s) => i === 'i'
		? `<br><strong>(i)</strong> Show that the given information leads to the relation needed below.<br><strong>(ii)</strong> ${s}`
		: `<br><strong>(${i === 'ii' ? 'iii' : 'iv'})</strong> ${s}`;

	boss('boss8-perp-circumcentre', 'Perpendicular bisectors and circumcentres', function (r) {
		let h, k, u, v; do { h=r.int(-6,6); k=r.int(-6,6); u=r.int(2,7); v=r.int(2,7); } while(u===v);
		const A=[h-u,k], B=[h+u,k], C=[h,k+v], oy=k+(v*v-u*u)/(2*v), rad2=u*u+(oy-k)*(oy-k);
		return { marks:6, text:`Triangle ABC has A${F.pt(...A)}, B${F.pt(...B)} and C${F.pt(...C)}.${br('i','Find the x-coordinate of the perpendicular bisector of AB.')}${br('ii','Find the y-coordinate of the circumcentre.')}${br('iii','Find the square of the circumradius.')}`,
			diagram:{type:'graph',xmin:h-u-2,xmax:h+u+2,ymin:Math.min(k,k+v)-2,ymax:Math.max(k,k+v)+2,grid:true,points:[[...A,'A'],[...B,'B'],[...C,'C']]},
			answer:multi([h,oy,rad2],['bisector x','circumcentre y (exact)','radius squared (exact)']), solution:`<p>AB is horizontal, so its perpendicular bisector passes through its midpoint; this establishes the relation in (i).</p>\n<p>(ii) The midpoint has x-coordinate <strong>${h}</strong>.</p>\n<p>(iii) Put O = (${h},y) and equate OA&sup2; and OC&sup2;; solving gives y = <strong>${oy}</strong>.</p>\n<p>(iv) OA&sup2;=${u}&sup2;+(${oy}&minus;${k})&sup2;=<strong>${rad2}</strong>.</p>` };
	});

	boss('boss8-reflect-line', 'Reflection of a point in a line', function (r) {
		const c=r.int(-8,8), p=r.int(-7,7), q=r.int(-7,7), s=p+q-c, x=p-s, y=q-s;
		return {marks:6,text:`Point P is ${F.pt(p,q)} and line l is x + y = ${c}.${br('i','Find the signed value x_P+y_P-c.')}${br('ii','Find the x-coordinate of the reflection of P in l.')}${br('iii','Find its y-coordinate.')}`,diagram:{type:'graph',xmin:Math.min(p,-8)-2,xmax:Math.max(p,8)+2,ymin:Math.min(q,c-8)-2,ymax:Math.max(q,c+8)+2,grid:true,fns:[{fn:(X)=>c-X}],points:[[p,q,'P']]},answer:multi([s,x,y],['signed substitution','reflected x','reflected y']),solution:`<p>For x+y=c the normal vector is (1,1); reflection subtracts the signed substitution from both coordinates.</p>\n<p>(i) The substitution is <strong>${s}</strong>.</p>\n<p>(ii) x'=${p}&minus;(${s})=<strong>${x}</strong>.</p>\n<p>(iii) y'=${q}&minus;(${s})=<strong>${y}</strong>.</p>`};
	});

	boss('boss8-collinear-parameter', 'Collinearity with parameters', function (r) {
		const x1=r.int(-5,3), y1=r.int(-5,5), dx=r.nonzeroInt(1,6), dy=r.nonzeroInt(-6,6), t=r.int(2,7), x2=x1+dx, y2=y1+dy, X=x1+t*dx, Y=y1+t*dy;
		return {marks:6,text:`A=${F.pt(x1,y1)}, B=${F.pt(x2,y2)} and C=(${X}, k) are collinear.${br('i','Find the horizontal scale factor from AB to AC.')}${br('ii','Find k.')}${br('iii','Find AC/AB.')}`,diagram:{type:'graph',xmin:Math.min(x1,x2,X)-2,xmax:Math.max(x1,x2,X)+2,ymin:Math.min(y1,y2,Y)-2,ymax:Math.max(y1,y2,Y)+2,grid:true,fns:[{fn:(x)=>y1+(x-x1)*dy/dx}],points:[[x1,y1,'A'],[x2,y2,'B']]},answer:multi([t,Y,t],['scale factor','k','length ratio']),solution:`<p>Collinear directed vectors must be scalar multiples.</p>\n<p>(i) (${X}&minus;${x1})/${dx}=<strong>${t}</strong>.</p>\n<p>(ii) k=${y1}+${t}(${dy})=<strong>${Y}</strong>.</p>\n<p>(iii) Lengths scale by the positive factor, so AC/AB=<strong>${t}</strong>.</p>`};
	});

	boss('boss8-circle-line-chord', 'Circle and line intersections', function (r) {
		const R=r.int(5,13), d=r.int(1,R-1), half=Math.sqrt(R*R-d*d);
		return {marks:6,text:`The circle x&sup2;+y&sup2;=${R*R} meets the line y=${d}. Give non-integer answers correct to 2 decimal places.${br('i','Find the positive x-coordinate of intersection.')}${br('ii','Find the chord length cut off by the line.')}`,diagram:{type:'graph',xmin:-R-2,xmax:R+2,ymin:-R-2,ymax:R+2,grid:true,fns:[{fn:()=>d}],circles:[{c:[0,0],r:R,mark:true}]},answer:multi([dp(half,2),dp(2*half,2)],['positive x (2 d.p.)','chord (2 d.p.)'],0.006),solution:`<p>Substitution gives x&sup2;=${R*R}&minus;${d*d}.</p>\n<p>(i) x=<strong>${dp(half,2)}</strong>.</p>\n<p>(ii) Symmetry places endpoints at opposite x-values, so length=<strong>${dp(2*half,2)}</strong>.</p>`};
	});

	boss('boss8-circle-tangents', 'Tangents from an external point', function (r) {
		const R=r.int(3,9), D=R+r.int(2,9), L=Math.sqrt(D*D-R*R), area=R*L/2;
		return {marks:6,text:`A point P is ${D} cm from the centre O of a circle of radius ${R} cm. PT is tangent at T. Give non-integer answers correct to 2 decimal places.${br('i','Find PT.')}${br('ii','Find the area of triangle OPT.')}`,diagram:{type:'graph',xmin:-R-2,xmax:D+2,ymin:-R-2,ymax:R+2,circles:[{c:[0,0],r:R,mark:true}],points:[[0,0,'O'],[D,0,'P']]},answer:multi([dp(L,2),dp(area,2)],['PT (2 d.p.)','area (2 d.p.)'],0.006),solution:`<p>A radius to a tangent is perpendicular, making OPT right-angled.</p>\n<p>(i) PT=&radic;(${D*D}&minus;${R*R})=<strong>${dp(L,2)} cm</strong>.</p>\n<p>(ii) Area=&frac12;&times;${R}&times;PT=<strong>${dp(area,2)} cm&sup2;</strong>.</p>`};
	});

	boss('boss8-locus-bisectors', 'Loci and equidistance', function (r) {
		const a=r.int(-8,8), b=a+r.int(4,12), c=r.int(-7,7), x=(a+b)/2, dist=Math.abs(c-x);
		return {marks:5,text:`A point Q=(x,${c}) is equidistant from A=(${a},${c-2}) and B=(${b},${c-2}).${br('i','Find x.')}${br('ii','Find the horizontal distance from Q to the line x=0.')}`,diagram:{type:'graph',xmin:Math.min(a,0)-2,xmax:Math.max(b,0)+2,ymin:c-4,ymax:c+2,grid:true,points:[[a,c-2,'A'],[b,c-2,'B']]},answer:multi([x,Math.abs(x)],['x (exact)','distance (exact)']),solution:`<p>The locus equidistant from A and B is the perpendicular bisector of AB.</p>\n<p>(i) x=(${a}+${b})/2=<strong>${x}</strong>.</p>\n<p>(ii) Distance to the y-axis is |x|=<strong>${Math.abs(x)}</strong>.</p>`};
	});

	boss('boss8-projectile-parabola', 'Quadratic projectile modelling', function (r) {
		const a=r.int(1,4), T=2*r.int(4,10), h=r.int(2,12), tv=T/2, max=h+a*T*T/4;
		return {marks:6,text:`A ball's height is H(t)=&minus;${a}t&sup2;+${a*T}t+${h} metres.${br('i','Find the time at the axis of symmetry.')}${br('ii','Find the maximum height.')}${br('iii','Find H(1).')}`,diagram:{type:'graph',xmin:0,xmax:T+2,ymin:0,ymax:max+5,grid:true,fns:[{fn:(t)=>-a*t*t+a*T*t+h}]},answer:multi([tv,max,h+a*T-a],['time (s)','maximum height (m)','H(1) (m)']),solution:`<p>The vertex occurs at t=&minus;b/(2a).</p>\n<p>(i) t=${a*T}/(2&times;${a})=<strong>${tv}</strong>.</p>\n<p>(ii) Substitution gives <strong>${max} m</strong>.</p>\n<p>(iii) H(1)=&minus;${a}+${a*T}+${h}=<strong>${h+a*T-a} m</strong>.</p>`};
	});

	boss('boss8-fencing-vertex', 'Fencing optimisation by a vertex', function (r) {
		const P=4*r.int(9,25), x=P/4, area=x*(P-2*x);
		return {marks:6,text:`A rectangular pen beside a river uses ${P} m of fencing on the other three sides. Let each perpendicular side be x.${br('i','Write the river-parallel side when x is the optimal value by finding the vertex of A=x(${P}&minus;2x).')}${br('ii','Find the optimal x.')}${br('iii','Find the maximum area.')}`,diagram:{type:'graph',xmin:0,xmax:P/2,ymin:0,ymax:area+P,grid:true,fns:[{fn:(x)=>x*(P-2*x)}]},answer:multi([P/2,x,area],['parallel side (m)','x (m)','maximum area (m squared)']),solution:`<p>A(x)=&minus;2x&sup2;+${P}x, a downward parabola with vertex at x=${P}/(2&times;2).</p>\n<p>(i) At the vertex the long side is ${P}&minus;2(${x})=<strong>${P/2} m</strong>.</p>\n<p>(ii) x=<strong>${x} m</strong>.</p>\n<p>(iii) A=${x}&times;${P/2}=<strong>${area} m&sup2;</strong>.</p>`};
	});

	boss('boss8-linear-quadratic-chain', 'Simultaneous linear-quadratic chains', function (r) {
		const u=r.int(-6,1), v=u+r.int(2,7), m=r.nonzeroInt(-4,4), c=r.int(-8,8), B=m-u-v, C=c+u*v, y1=m*u+c, y2=m*v+c;
		const xmin=u-2, xmax=v+2, vertexX=-B/2, ys=[m*xmin+c,m*xmax+c,xmin*xmin+B*xmin+C,xmax*xmax+B*xmax+C,vertexX*vertexX+B*vertexX+C];
		return {marks:7,text:`The line y=${F.poly([m,c])} meets y=${F.poly([1,B,C])}.${br('i','Find the smaller x-coordinate.')}${br('ii','Find the larger x-coordinate.')}${br('iii','Find the y-coordinate at the smaller root.')}`,diagram:{type:'graph',xmin,xmax,ymin:Math.min(...ys)-2,ymax:Math.max(...ys)+2,xstep:1000,ystep:1000,grid:true,fns:[{fn:(x)=>m*x+c},{fn:(x)=>x*x+B*x+C}]},answer:multi([u,v,y1],['smaller x','larger x','corresponding y']),solution:`<p>Equating and collecting gives (x&minus;${u})(x&minus;${v})=0.</p>\n<p>(i) The smaller root is <strong>${u}</strong>.</p>\n<p>(ii) The larger root is <strong>${v}</strong>.</p>\n<p>(iii) Substituting in the line gives <strong>${y1}</strong>.</p>`};
	});

	boss('boss8-parabola-features', 'Parabola intercepts and translations', function (r) {
		const p=r.int(-7,-1), q=r.int(1,8), shift=r.nonzeroInt(-5,5), axis=(p+q)/2;
		const xmin=Math.min(p,p+shift)-2, xmax=Math.max(q,q+shift)+2, vertexY=-(((q-p)/2)**2);
		return {marks:6,text:`The graph y=(x&minus;${p})(x&minus;${q}) is translated ${Math.abs(shift)} units ${shift>0?'right':'left'}.${br('i','Find its original axis of symmetry.')}${br('ii','Find the smaller translated x-intercept.')}${br('iii','Find the larger translated x-intercept.')}`,diagram:{type:'graph',xmin,xmax,ymin:vertexY-3,ymax:Math.max(5,(xmin-p)*(xmin-q),(xmax-p-shift)*(xmax-q-shift))+2,grid:true,fns:[{fn:(x)=>(x-p)*(x-q)},{fn:(x)=>(x-p-shift)*(x-q-shift)}]},answer:multi([axis,p+shift,q+shift],['axis (exact)','smaller intercept','larger intercept']),solution:`<p>The axis is halfway between the two roots; horizontal translation adds the signed shift to every x-coordinate.</p>\n<p>(i) Axis x=<strong>${axis}</strong>.</p>\n<p>(ii) Smaller intercept=<strong>${p+shift}</strong>.</p>\n<p>(iii) Larger intercept=<strong>${q+shift}</strong>.</p>`};
	});

	boss('boss8-graph-transform', 'Transformations of graphs', function (r) {
		const h=r.nonzeroInt(-6,6), k=r.nonzeroInt(-6,6), s=r.pick([2,3,4]), x=r.int(-5,5), fx=r.int(-8,8);
		return {marks:5,text:`A point (${x},${fx}) lies on y=f(x). The graph is transformed to y=${s}f(x&minus;${h})+${k}.${br('i','Find the transformed x-coordinate.')}${br('ii','Find the transformed y-coordinate.')}`,diagram:{type:'graph',xmin:Math.min(0,x)-3,xmax:Math.max(0,x)+3,ymin:Math.min(0,fx)-3,ymax:Math.max(0,fx)+3,grid:true,points:[[x,fx,'P']]},answer:multi([x+h,s*fx+k],['new x','new y']),solution:`<p>Replacing x by x&minus;h moves points horizontally by h; outside scaling and translation affect y.</p>\n<p>(i) New x=<strong>${x+h}</strong>.</p>\n<p>(ii) New y=${s}(${fx})+${k}=<strong>${s*fx+k}</strong>.</p>`};
	});

	boss('boss8-variation-chain', 'Direct and inverse variation chains', function (r) {
		const k=r.int(2,9), x=r.int(2,8), z=r.int(2,7), y=k*x*x/z, X=r.int(2,9), Z=r.int(2,9), Y=k*X*X/Z;
		return {marks:6,text:`y varies directly as x&sup2; and inversely as z. When x=${x}, z=${z}, y=${y}.${br('i','Find the constant k.')}${br('ii',`Find y when x=${X}, z=${Z}, correct to 2 decimal places.`)}`,answer:multi([k,dp(Y,2)],['k (exact)','y (2 d.p.)'],0.006),solution:`<p>The model is y=kx&sup2;/z.</p>\n<p>(i) k=yz/x&sup2;=<strong>${k}</strong>.</p>\n<p>(ii) y=${k}&times;${X*X}/${Z}=<strong>${dp(Y,2)}</strong>.</p>`};
	});

	boss('boss8-common-base-exponential', 'Exponential equations with common bases', function (r) {
		const base=r.pick([2,3,5]), a=r.int(2,6), b=r.int(-8,8), root=r.int(-5,8), n=a*root+b;
		return {marks:6,text:`Solve ${base}<sup>${a}x${b>=0?'+':'&minus;'}${Math.abs(b)}</sup> = ${base}<sup>${n}</sup>.${br('i','Equate exponents and find ax.')}${br('ii','Find x.')}`,answer:multi([n-b,root],['ax','x']),solution:`<p>Equal positive bases (not 1) have equal exponents.</p>\n<p>(i) ${a}x=${n}&minus;(${b})=<strong>${n-b}</strong>.</p>\n<p>(ii) Dividing by ${a} gives x=<strong>${root}</strong>.</p>`};
	});

	boss('boss8-surd-equation-check', 'Surd equations and extraneous-root checks', function (r) {
		const root=r.int(1,12), a=r.int(1,8), b=(root+a)*(root+a)-root, cand=-(2*a+1)-root;
		return {marks:7,text:`Solve &radic;(x+${b}) = x+${a}. Squaring produces two candidates.${br('i','Find the valid solution.')}${br('ii','Find the rejected candidate.')}${br('iii','Evaluate the right side at the rejected candidate.')}`,answer:multi([root,cand,cand+a],['valid x','extraneous x','rejected RHS']),solution:`<p>Squaring is not reversible unless the right side is non-negative, so every candidate must be checked.</p>\n<p>(i) x=<strong>${root}</strong> satisfies both sides numerically.</p>\n<p>(ii) Factoring the squared quadratic gives the other candidate <strong>${cand}</strong>.</p>\n<p>(iii) Its right side is <strong>${cand+a}</strong>, negative, while a square root cannot be negative.</p>`};
	});

	boss('boss8-algebraic-fractions', 'Algebraic fraction chains', function (r) {
		const a=r.int(2,9), b=r.int(2,9), root=r.int(1,12), K=a/(root+b);
		return {marks:6,text:`For x&ne;&minus;${b}, ${a}/(x+${b}) = ${K}. Give non-integer answers exactly.${br('i','Find x+b.')}${br('ii','Find x.')}`,answer:multi([a/K,root],['x+b (exact)','x (exact)']),solution:`<p>Multiply both sides by x+${b} before dividing by the nonzero coefficient.</p>\n<p>(i) x+${b}=${a}/${K}=<strong>${a/K}</strong>.</p>\n<p>(ii) x=<strong>${root}</strong>.</p>`};
	});

	boss('boss8-literal-rearrangement', 'Literal equations and rearrangement', function (r) {
		const u=r.int(3,12), v=r.int(2,10), t=r.int(2,9), s=(u+v)*t/2, solved=2*s/t-v;
		return {marks:5,text:`The formula s=(u+v)t/2 has s=${s}, v=${v}, t=${t}.${br('i','Find 2s/t.')}${br('ii','Rearrange and find u.')}`,answer:multi([2*s/t,solved],['2s/t (exact)','u']),solution:`<p>Multiply by 2, divide by t, then subtract v.</p>\n<p>(i) 2s/t=<strong>${2*s/t}</strong>.</p>\n<p>(ii) u=2s/t&minus;v=<strong>${solved}</strong>.</p>`};
	});

	boss('boss8-gcd-lcm-chain', 'GCD and LCM scheduling', function (r) {
		const g=r.int(2,12), a=r.int(2,9), b=r.int(2,9), gcd=MG.gcd(a,b), A=g*a/gcd, B=g*b/gcd, Gd=MG.gcd(A,B), L=A*B/Gd;
		return {marks:6,text:`Two warning lights flash every ${A} seconds and ${B} seconds.${br('i','Find their greatest common divisor.')}${br('ii','Find their least common multiple.')}${br('iii','How many simultaneous flashes occur after the start up to and including 10 minutes?')}`,answer:multi([Gd,L,Math.floor(600/L)],['GCD','LCM (s)','simultaneous flashes']),solution:`<p>Use LCM(a,b)=ab/GCD(a,b).</p>\n<p>(i) GCD=<strong>${Gd}</strong>.</p>\n<p>(ii) LCM=<strong>${L} s</strong>.</p>\n<p>(iii) Excluding the starting flash, floor(600/${L})=<strong>${Math.floor(600/L)}</strong>.</p>`};
	});

	boss('boss8-multileg-speed', 'Multi-leg speed and unit conversion', function (r) {
		const d1=5*r.int(4,16), v1=10*r.int(4,10), d2=5*r.int(4,16), v2=10*r.int(3,9), time=d1/v1+d2/v2, avg=(d1+d2)/time;
		return {marks:6,text:`A trip has ${d1} km at ${v1} km/h, then ${d2} km at ${v2} km/h. Give non-integer answers correct to 2 decimal places.${br('i','Find total time in minutes.')}${br('ii','Find average speed in km/h.')}`,answer:multi([dp(60*time,2),dp(avg,2)],['time (minutes, 2 d.p.)','average speed (2 d.p.)'],0.006),solution:`<p>Times, not speeds, are added: t=d/v.</p>\n<p>(i) Total time=<strong>${dp(60*time,2)} min</strong>.</p>\n<p>(ii) Average=total distance/total time=<strong>${dp(avg,2)} km/h</strong>.</p>`};
	});

	boss('boss8-pipe-rates', 'Work rates and pipes', function (r) {
		const a=r.int(4,14), b=r.int(5,16), rate=1/a+1/b, t=1/rate;
		return {marks:6,text:`Pipe A fills a tank alone in ${a} h and pipe B in ${b} h.${br('i','Find their combined fraction of a tank per hour, correct to 3 decimal places.')}${br('ii','Find the joint filling time correct to 2 decimal places.')}`,answer:multi([dp(rate,3),dp(t,2)],['rate (3 decimal places)','time (2 decimal places)'],0.006),solution:`<p>Independent work rates add.</p>\n<p>(i) 1/${a}+1/${b}=<strong>${dp(rate,3)}</strong> tank/h.</p>\n<p>(ii) Reciprocal time=<strong>${dp(t,2)} h</strong>.</p>`};
	});

	boss('boss8-mixture-concentration', 'Mixture concentration equations', function (r) {
		const p=r.int(10,35), q=r.int(55,90), V=r.int(2,12), W=r.int(2,12), pct=(p*V+q*W)/(V+W);
		return {marks:6,text:`Mix ${V} L of a ${p}% solution with ${W} L of a ${q}% solution. Give non-integer answers correct to 2 decimal places.${br('i','Find the amount of pure substance in litres.')}${br('ii','Find the final concentration percentage.')}`,answer:multi([dp((p*V+q*W)/100,2),dp(pct,2)],['pure amount (L, 2 d.p.)','concentration (2 d.p.)'],0.006),solution:`<p>Pure amounts add while total volume is ${V+W} L.</p>\n<p>(i) Pure amount=<strong>${dp((p*V+q*W)/100,2)} L</strong>.</p>\n<p>(ii) Percentage=<strong>${dp(pct,2)}%</strong>.</p>`};
	});

	boss('boss8-markup-margin-gst', 'Markup, margin and GST chains', function (r) {
		const cost=10*r.int(8,40), markup=r.int(15,65), sell=cost*(1+markup/100), gst=sell*1.1, margin=100*(sell-cost)/sell;
		return {marks:7,text:`An item costs $${cost}. It is marked up by ${markup}% before 10% GST. Give non-integer answers correct to 2 decimal places.${br('i','Find the pre-GST selling price.')}${br('ii','Find the GST-inclusive price.')}${br('iii','Find profit as a percentage of the pre-GST selling price (the margin).')}`,answer:multi([dp(sell,2),dp(gst,2),dp(margin,2)],['pre-GST ($, 2 d.p.)','with GST ($, 2 d.p.)','margin (2 d.p.)'],0.006),solution:`<p>Markup uses cost as denominator; margin uses selling price.</p>\n<p>(i) Price=<strong>$${dp(sell,2)}</strong>.</p>\n<p>(ii) Multiply by 1.10: <strong>$${dp(gst,2)}</strong>.</p>\n<p>(iii) 100(sell&minus;cost)/sell=<strong>${dp(margin,2)}%</strong>.</p>`};
	});

	boss('boss8-ratio-change', 'Ratio sharing after transfers', function (r) {
		const a=r.int(2,8), b=r.int(2,8), unit=5*r.int(3,15), move=r.int(2,Math.max(2,a*unit-1)), A=a*unit-move, B=b*unit+move;
		return {marks:6,text:`Ali and Bea share money in ratio ${a}:${b}, with each ratio unit worth $${unit}. Ali then gives Bea $${move}.${br('i','Find Ali’s new amount.')}${br('ii','Find Bea’s new amount.')}${br('iii','Find the new ratio A:B as a decimal correct to 2 decimal places.')}`,answer:multi([A,B,dp(A/B,2)],['Ali ($)','Bea ($)','A/B (2 decimal places)'],0.006),solution:`<p>A transfer preserves the total but changes both shares.</p>\n<p>(i) Ali=<strong>$${A}</strong>.</p>\n<p>(ii) Bea=<strong>$${B}</strong>.</p>\n<p>(iii) A/B=<strong>${dp(A/B,2)}</strong>.</p>`};
	});

	boss('boss8-frustum-similarity', 'Frustums and similar-volume ratios', function (r) {
		const R=r.int(5,12), H=r.int(9,20), scale=r.pick([0.25,0.4,0.5,0.6]), r2=R*scale, h2=H*scale, frac=1-scale**3, vol=Math.PI*R*R*H*frac/3;
		return {marks:7,text:`A cone of radius ${R} cm and height ${H} cm has a smaller similar cone of linear scale ${scale} removed from its tip. Give non-integer answers correct to 2 decimal places.${br('i','Find the removed cone radius.')}${br('ii','Find the fraction of original volume remaining.')}${br('iii','Find the frustum volume.')}`,diagram:{type:'cone',rLabel:`${R} cm`,hLabel:`${H} cm`,frustumFrac:scale},answer:multi([dp(r2,2),dp(frac,2),dp(vol,2)],['small radius (2 d.p.)','volume fraction (2 d.p.)','volume (2 d.p.)'],0.006),solution:`<p>For similar solids, volumes scale as the cube of the linear scale.</p>\n<p>(i) Radius=<strong>${dp(r2,2)} cm</strong>.</p>\n<p>(ii) Remaining fraction=1&minus;${scale}&sup3;=<strong>${dp(frac,2)}</strong>.</p>\n<p>(iii) Multiply &pi;R&sup2;H/3 by that fraction: <strong>${dp(vol,2)} cm&sup3;</strong>.</p>`};
	});

	boss('boss8-box-diagonal', 'Three-dimensional Pythagoras', function (r) {
		const a=r.int(3,15), b=r.int(3,15), c=r.int(3,15), base=Math.hypot(a,b), space=Math.hypot(a,b,c);
		return {marks:6,text:`A rectangular box measures ${a} cm by ${b} cm by ${c} cm. Give non-integer answers correct to 2 decimal places.${br('i','Find a base diagonal.')}${br('ii','Find the space diagonal.')}`,diagram:{type:'cuboid',lLabel:`${a} cm`,wLabel:`${b} cm`,hLabel:`${c} cm`,diagonal:true,baseDiagonal:true,diagLabel:'d'},answer:multi([dp(base,2),dp(space,2)],['base diagonal (2 d.p.)','space diagonal (2 d.p.)'],0.006),solution:`<p>Apply Pythagoras in the base, then in the vertical cross-section.</p>\n<p>(i) Base diagonal=&radic;(${a*a}+${b*b})=<strong>${dp(base,2)} cm</strong>.</p>\n<p>(ii) Space diagonal=&radic;(${a*a}+${b*b}+${c*c})=<strong>${dp(space,2)} cm</strong>.</p>`};
	});

	boss('boss8-polygon-angle-chain', 'Polygon interior and exterior angles', function (r) {
		const n=r.int(5,18), sum=(n-2)*180, ext=360/n, interior=180-ext;
		return {marks:6,text:`A regular polygon has ${n} sides. Give non-integer answers correct to 2 decimal places.${br('i','Find the sum of interior angles.')}${br('ii','Find one exterior angle.')}${br('iii','Find one interior angle.')}`,...(n<=12?{diagram:{type:'polygon',n}}:{}),answer:multi([sum,dp(ext,2),dp(interior,2)],['sum (degrees)','exterior (2 d.p.)','interior (2 d.p.)'],0.006),solution:`<p>Interior sum is (n&minus;2)180&deg;, while equal exterior turns total 360&deg;.</p>\n<p>(i) Sum=<strong>${sum}&deg;</strong>.</p>\n<p>(ii) Exterior=<strong>${dp(ext,2)}&deg;</strong>.</p>\n<p>(iii) Interior=180&minus;exterior=<strong>${dp(interior,2)}&deg;</strong>.</p>`};
	});

	boss('boss8-combined-weighted-mean', 'Combined means and weighted averages', function (r) {
		const n1=r.int(8,30), n2=r.int(8,30), m1=r.int(45,85), m2=r.int(45,85), total=n1*m1+n2*m2, mean=total/(n1+n2);
		return {marks:6,text:`Class A has ${n1} students with mean ${m1}; class B has ${n2} students with mean ${m2}. Give non-integer answers correct to 2 decimal places.${br('i','Find the combined score total.')}${br('ii','Find the combined mean.')}`,answer:multi([total,dp(mean,2)],['combined total','combined mean (2 d.p.)'],0.006),solution:`<p>A combined mean must weight each class mean by its class size.</p>\n<p>(i) Total=${n1}&times;${m1}+${n2}&times;${m2}=<strong>${total}</strong>.</p>\n<p>(ii) Divide by ${n1+n2}: <strong>${dp(mean,2)}</strong>.</p>`};
	});
})();
