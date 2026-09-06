// Boss batch 9: maximum-difficulty algebraic chains.
window.MG = window.MG || {};
MG.generators = MG.generators || [];

(function () {
	const F = MG.fmt, G = MG.generators;
	const boss = (id, subtopic, gen) => G.push({ id, topic: 'Boss', subtopic, difficulty: 4, gen });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const br = (i, s) => `<br><strong>(${i})</strong> ${s}`;
	const sn = (n) => n < 0 ? `&minus;${Math.abs(n)}` : String(n);
	const fac = (n) => `(x${F.st(-n, '')})`;

	boss('boss9-ap-reconstruction', 'Arithmetic series reconstruction', function (r) {
		const a=r.int(2,9), d=r.int(2,7), p=r.int(3,6), q=p+r.int(3,6), m=r.int(12,20), n=m+r.int(3,7), tp=a+(p-1)*d, tq=a+(q-1)*d, sum=m*(2*a+(m-1)*d)/2, bound=a+(n-1)*d-1;
		return {marks:7,text:`An arithmetic progression has T${F.sub(p)}=${tp} and T${F.sub(q)}=${tq}.${br('i','Find its first term.')}${br('ii','Find its common difference.')}${br('iii',`Find S${F.sub(m)}.`)}${br('iv',`Find the least index j for which T${F.sub('j')}&gt;${bound}.`)}`,answer:multi([a,d,sum,n],['(i) first term','(ii) common difference','(iii) series sum','(iv) least index']),solution:`<p>(i) Subtracting the term equations and back-substituting gives a=<strong>${a}</strong>.</p><p>(ii) (${tq}&minus;${tp})/(${q}&minus;${p})=<strong>${d}</strong>.</p><p>(iii) S${F.sub(m)}=${F.frac(m,2)}[2(${a})+${m-1}(${d})]=<strong>${sum}</strong>.</p><p>(iv) Solving a+(j&minus;1)d&gt;${bound} gives the least integer <strong>${n}</strong>.</p>`};
	});

	boss('boss9-ap-gp-race', 'Interleaved arithmetic and geometric sequences', function (r) {
		const a=r.int(2,5), d=r.int(2,5), n=r.int(5,8), ap=a+(n-1)*d, gp=a*2**(n-1), aps=n*(a+ap)/2, gps=a*(2**n-1);
		return {marks:7,text:`Sequence A is arithmetic with first term ${a} and difference ${d}; sequence B is geometric with the same first term and ratio 2. Consider term number ${n}.${br('i','Find the A-term.')}${br('ii','Find the B-term.')}${br('iii','Find the sum of the first stated number of A-terms.')}${br('iv','Find the corresponding sum for B.')}`,answer:multi([ap,gp,aps,gps],['(i) A term','(ii) B term','(iii) A sum','(iv) B sum']),solution:`<p>(i) A${F.sub(n)}=${a}+(${n}&minus;1)${d}=<strong>${ap}</strong>.</p><p>(ii) B${F.sub(n)}=${a}&times;2${F.sup(n-1)}=<strong>${gp}</strong>.</p><p>(iii) The AP formula gives <strong>${aps}</strong>.</p><p>(iv) ${a}(2${F.sup(n)}&minus;1)=<strong>${gps}</strong>.</p>`};
	});

	boss('boss9-sigma-unknown-bound', 'Sigma notation with unknown bounds', function (r) {
		const u=r.int(2,6), n=r.int(8,15), c=r.int(1,5), count=n-u+1, sum=(u+n)*count/2+c*count, next=n+1+c;
		return {marks:7,text:`For an integer N&ge;${u}, &Sigma;${F.sub(`k=${u}`)}${F.sup('N')}(k${F.st(c,'')})=${sum}.${br('i','Find the number of terms.')}${br('ii','Find N.')}${br('iii','Find the next summand.')}${br('iv','Find the new sum when that summand is included.')}`,answer:multi([count,n,next,sum+next],['(i) number of terms','(ii) upper bound N','(iii) next summand','(iv) extended sum']),solution:`<p>(i) There are N&minus;${u}+1 terms; solving the resulting quadratic gives <strong>${count}</strong>.</p><p>(ii) Hence N=<strong>${n}</strong>.</p><p>(iii) Substitute k=N+1: <strong>${next}</strong>.</p><p>(iv) Add it to the old sum: <strong>${sum+next}</strong>.</p>`};
	});

	boss('boss9-tangent-contact', 'Parameter tangency and contact point', function (r) {
		const h=r.nonzeroInt(-6,6), m=r.nonzeroInt(-5,5), c=-h*h, k=m-2*h, y=m*h+c;
		return {marks:8,text:`The line y=${F.poly([m,c])} is tangent to y=x&sup2;+kx.${br('i',`Show that the intersection equation is x&sup2;+(k&minus;${m})x${F.st(-c,'')}=0.`)}${br('ii','Hence use the discriminant to find k.')}${br('iii','Find the exact point of contact.')}${br('iv','Verify the tangency by writing the intersection equation as a perfect square.')}`,answer:multi([k,h,y,0],['(ii) k','(iii) contact x','(iii) contact y','(iv) discriminant']),solution:`<p>(i) Equating the two expressions for y gives x&sup2;+(k&minus;${m})x${F.st(-c,'')}=0.</p><p>(ii) Its discriminant is (k&minus;${m})&sup2;${F.st(4*c,'')}. Setting this to zero and selecting the value whose repeated root is ${h} gives <strong>k=${sn(k)}</strong>.</p><p>(iii) The repeated root is x=${h}; the line gives y=<strong>${sn(y)}</strong>.</p><p>(iv) Substitution gives (x${F.st(-h,'')})&sup2;=0, so &Delta;=<strong>0</strong>.</p>`};
	});

	boss('boss9-root-power-chain', 'High symmetric powers of roots', function (r) {
		let alpha=r.nonzeroInt(-5,5), beta=r.nonzeroInt(-5,5); while(alpha===beta) beta=r.nonzeroInt(-5,5); const s=alpha+beta,p=alpha*beta,q2=s*s-2*p,q3=s**3-3*p*s,q4=q2*q2-2*p*p;
		return {marks:7,text:`The roots &alpha;, &beta; of x&sup2;${F.st(-s,'x')}${F.st(p,'')}=0 are not to be found individually.${br('i','Find &alpha;+&beta;.')}${br('ii','Find &alpha;&sup2;+&beta;&sup2;.')}${br('iii','Find &alpha;&sup3;+&beta;&sup3;.')}${br('iv','Find &alpha;&sup4;+&beta;&sup4;.')}`,answer:multi([s,q2,q3,q4],['(i) root sum','(ii) sum of squares','(iii) sum of cubes','(iv) sum of fourth powers']),solution:`<p>(i) By Vieta, <strong>${sn(s)}</strong>.</p><p>(ii) s&sup2;&minus;2p=<strong>${q2}</strong>.</p><p>(iii) s&sup3;&minus;3ps=<strong>${sn(q3)}</strong>.</p><p>(iv) (&alpha;&sup2;+&beta;&sup2;)&sup2;&minus;2(&alpha;&beta;)&sup2;=<strong>${q4}</strong>.</p>`};
	});

	boss('boss9-biquadratic-chain', 'Quadratic in disguise', function (r) {
		const u=r.int(1,5), v=u+r.int(1,4), b=-(u*u+v*v), c=u*u*v*v;
		return {marks:7,text:`Consider x&sup4;${F.st(b,'x&sup2;')}${F.st(c,'')}=0. Put z=x&sup2;.${br('i','Find the smaller positive value of z.')}${br('ii','Find the larger positive value of z.')}${br('iii','Find the smallest real root x.')}${br('iv','Find the largest real root x.')}`,answer:multi([u*u,v*v,-v,v],['(i) smaller z','(ii) larger z','(iii) smallest x','(iv) largest x']),solution:`<p>(i) The z-quadratic factors as (z&minus;${u*u})(z&minus;${v*v}), so <strong>${u*u}</strong>.</p><p>(ii) The other value is <strong>${v*v}</strong>.</p><p>(iii) Taking both square-root signs gives the least root <strong>${sn(-v)}</strong>.</p><p>(iv) The greatest is <strong>${v}</strong>.</p>`};
	});

	boss('boss9-parabola-line-parameter', 'Parameterized intersections', function (r) {
		let u,v,m,c,b,q,y1,y2,shown,answers; do { u=r.int(1,5); v=u+r.int(2,5); m=r.int(1,4); c=r.int(1,7); b=m-u-v; q=c+u*v; y1=m*u+c; y2=m*v+c; shown=[Math.abs(b),q,m,c]; answers=[u,v,y1,y2]; } while(answers.some(x=>Math.abs(x)>3&&shown.includes(Math.abs(x))));
		return {marks:7,text:`The parabola y=x&sup2;${F.st(b,'x')}${F.st(q,'')} meets the line y=${F.poly([m,c])}.${br('i','Find the smaller intersection x-coordinate.')}${br('ii','Find the larger intersection x-coordinate.')}${br('iii','Find the y-coordinate at the smaller x-value.')}${br('iv','Find the y-coordinate at the larger x-value.')}`,answer:multi([u,v,y1,y2],['(i) smaller x','(ii) larger x','(iii) smaller-x y','(iv) larger-x y']),solution:`<p>Equating produces x&sup2;${F.st(-(u+v),'x')}${F.st(u*v,'')}=0.</p><p>(i) Factoring gives the smaller root <strong>${u}</strong>.</p><p>(ii) The larger root is <strong>${v}</strong>.</p><p>(iii) Substitution in the line gives <strong>${y1}</strong>.</p><p>(iv) At the larger root it gives <strong>${y2}</strong>.</p>`};
	});

	boss('boss9-restricted-inverse-chain', 'Restricted quadratic inverse', function (r) {
		const h=r.int(1,6), k=r.int(1,6), t=r.int(2,7), input=t*t+k, inv=h+t, fixed=h+r.int(1,4), out=(fixed-h)**2+k;
		return {marks:7,text:`Let f(x)=(x&minus;${h})&sup2;${F.st(k,'')} on x&ge;${h}.${br('i','Find the lower endpoint of the range of f.')}${br('ii','Find the lower endpoint of the domain of f⁻¹.')}${br('iii',`Evaluate f⁻¹(${input}).`)}${br('iv',`Evaluate f(${fixed}).`)}`,answer:multi([k,k,inv,out],['(i) range endpoint','(ii) inverse-domain endpoint','(iii) inverse value','(iv) function value']),solution:`<p>(i) The vertex gives the minimum <strong>${k}</strong>.</p><p>(ii) The inverse domain is the original range, so <strong>${k}</strong>.</p><p>(iii) f⁻¹(y)=${h}+${F.sqrt(`y&minus;${k}`)}, giving <strong>${inv}</strong>.</p><p>(iv) Direct substitution gives <strong>${out}</strong>.</p>`};
	});

	boss('boss9-mobius-inverse-chain', 'Self-inverse rational functions', function (r) {
		const h=r.int(1,6), q=r.int(2,6), x=h+r.int(1,5), image=h+q*q/(x-h); if(!Number.isInteger(image)) return G.find(g=>g.id==='boss9-mobius-inverse-chain').gen(r); const lo=h-q, hi=h+q;
		return {marks:7,text:`Let f(x)=${h}+${F.frac(q*q,`x&minus;${h}`)}, x&ne;${h}.${br('i','Find the excluded value from its range.')}${br('ii',`Evaluate f(${x}).`)}${br('iii','Evaluate f⁻¹ at the result from part (ii).')}${br('iv','Find the larger fixed point where f(x)=x.')}`,answer:multi([h,image,x,hi],['(i) excluded range value','(ii) function value','(iii) inverse value','(iv) larger fixed point']),solution:`<p>(i) The reciprocal term is never zero, so y&ne;<strong>${h}</strong>.</p><p>(ii) Substitution gives <strong>${image}</strong>.</p><p>(iii) Rearrangement shows f⁻¹=f, hence <strong>${x}</strong>.</p><p>(iv) (x&minus;${h})&sup2;=${q*q}, and the larger solution is <strong>${hi}</strong>.</p>`};
	});

	boss('boss9-cubic-reconstruction', 'Cubic reconstruction and symmetry', function (r) {
		const p=r.int(1,3), q=p+r.int(2,3), s=q+r.int(2,3), A=r.pick([1,2,3]), y0=A*(-p)*(-q)*(-s), sum=p+q+s, x2=-A*sum, x1=A*(p*q+p*s+q*s);
		return {marks:7,text:`A cubic has zeros ${p}, ${q}, ${s} and passes through (0, ${y0}). It has form y=A${fac(p)}${fac(q)}${fac(s)}.${br('i','Find A.')}${br('ii','Find the coefficient of x² after expansion.')}${br('iii','Find the coefficient of x after expansion.')}${br('iv','Find the exact x-coordinate of the point of inflection.')}`,answer:multi([A,x2,x1,sum/3],['(i) leading factor A','(ii) x² coefficient','(iii) x coefficient','(iv) exact inflection x'],1e-6),solution:`<p>(i) Substituting the given point gives <strong>${A}</strong>.</p><p>(ii) The x² coefficient is &minus;A times the root sum: <strong>${sn(x2)}</strong>.</p><p>(iii) It is A(pq+ps+qs)=<strong>${x1}</strong>.</p><p>(iv) The inflection abscissa is one third of the root sum: <strong>${sum/3}</strong>.</p>`};
	});

	boss('boss9-transformation-inversion', 'Compound graph transformations', function (r) {
		const x=r.int(1,5), y=r.int(1,5), h=r.int(1,5), k=r.int(1,5), a=r.pick([2,3]), nx=h-x, ny=k-a*y;
		return {marks:6,text:`The point ${F.pt(x,y)} lies on y=f(x). The graph is changed to y=${k}&minus;${a}f(${h}&minus;x).${br('i','Find the image x-coordinate.')}${br('ii','Find the image y-coordinate.')}${br('iii','Recover the original x-coordinate from the image.')}${br('iv','Recover the original y-coordinate from the image.')}`,answer:multi([nx,ny,x,y],['(i) image x','(ii) image y','(iii) recovered x','(iv) recovered y']),solution:`<p>(i) Horizontal reflection then translation gives x'=${h}&minus;${x}=<strong>${sn(nx)}</strong>.</p><p>(ii) y'=${k}&minus;${a}(${y})=<strong>${sn(ny)}</strong>.</p><p>(iii) Reverse x=${h}&minus;x' to obtain <strong>${x}</strong>.</p><p>(iv) Reverse y=(k&minus;y')/${a} to obtain <strong>${y}</strong>.</p>`};
	});

	boss('boss9-rational-full-analysis', 'Rational curve feature chain', function (r) {
		const p=r.int(1,5), q=p+r.int(2,5), z=r.int(1,q-1), A=r.pick([1,2,3]), y0=A*p*q/(p*q), at=q+1, value=A*(at-z)/((at-p)*(at-q));
		return {marks:8,text:`For y=${F.frac(F.poly([A,-A*z]),F.poly([1,-p-q,p*q]))}:${br('i','Show that the denominator factorises into two distinct linear factors.')}${br('ii','Hence find both vertical asymptotes in ascending order.')}${br('iii','Find the x-intercept and the horizontal asymptote.')}${br('iv',`Evaluate y at x=${at}; give the exact value.`)}`,diagram:{type:'graph',xmin:-1,xmax:q+3,ymin:-6,ymax:6,fns:[{fn:(x)=>A*(x-z)/((x-p)*(x-q))}],vlines:[{x:p},{x:q}],hlines:[{y:0}]},answer:multi([p,q,z,value],['(ii) smaller asymptote x','(ii) larger asymptote x','(iii) x-intercept','(iv) exact function value']),solution:`<p>(i) The denominator factors as ${fac(p)}${fac(q)}.</p><p>(ii) Its two zeros give x=<strong>${p}, ${q}</strong>.</p><p>(iii) The numerator vanishes at x=<strong>${z}</strong>; since the denominator has higher degree, y=0 is the horizontal asymptote.</p><p>(iv) Exact substitution gives <strong>${value}</strong>.</p>`};
	});
})();
