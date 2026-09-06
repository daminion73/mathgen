// Sequences & Series question generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Sequences & Series', subtopic, difficulty, gen });
	const num = (value, label = 'answer', tolerance = 0.001) => ({ type: 'numeric', value, tolerance, label });
	const multi = (values, labels, tolerance = 0.001) => ({ type: 'multinumeric', values, labels, tolerance });
	const text = (accept) => ({ type: 'text', accept });
	const table = (heads, row) => `<table class="qtable"><tr>${heads.map((x) => `<th>${x}</th>`).join('')}</tr><tr>${row.map((x) => `<td>${x}</td>`).join('')}</tr></table>`;
	const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); };

	add('ss-ap-recover', 'Arithmetic sequences', 1, (r) => {
		const a = r.int(-12, 12), d = r.nonzeroInt(-6, 7), p = r.int(3, 7), q = r.int(p + 3, p + 8), n = r.int(q + 2, q + 8), tp = a + (p - 1) * d, tq = a + (q - 1) * d, tn = a + (n - 1) * d;
		return { marks: 4, text: `An AP has T${F.sub(p)}=${tp} and T${F.sub(q)}=${tq}. Find its first term, common difference and T${F.sub(n)}.`, answer: multi([a, d, tn], ['first term', 'common difference', `T${n}`]), solution: `<p>d=(${tq}&minus;${tp})/(${q}&minus;${p})=${d}, so a=${a} and T${F.sub(n)}=<strong>${tn}</strong>.</p>` };
	});

	add('ss-ap-sum-n', 'Arithmetic series', 2, (r) => {
		const a = r.int(1, 9), d = r.int(2, 7), n = r.int(12, 30), total = n * (2 * a + (n - 1) * d) / 2;
		return { marks: 4, text: `For an AP, S${F.sub('m')}=${F.frac('m', 2)}[${2 * a}+(m&minus;1)${d}]. If S${F.sub('m')}=${total}, find the positive integer m.`, answer: num(n, 'm'), solution: `<p>Solve m[${2 * a}+(m&minus;1)${d}]/2=${total}. The positive root is <strong>${n}</strong>.</p>` };
	});

	add('ss-ap-least-sum', 'Arithmetic series', 2, (r) => {
		const a = r.int(2, 10), d = r.int(1, 6), n = r.int(14, 35), prev = (n - 1) * (2 * a + (n - 2) * d) / 2, now = n * (2 * a + (n - 1) * d) / 2, v = Math.floor((prev + now) / 2);
		return { marks: 5, text: `An AP begins ${a}, ${a + d}, ${a + 2 * d}, … . Find the least n for which S${F.sub('n')}&gt;${v}.`, answer: num(n, 'least n'), solution: `<p>S${F.sub(n - 1)}=${prev}&le;${v}, while S${F.sub(n)}=${now}&gt;${v}. Hence <strong>n=${n}</strong>.</p>` };
	});

	add('ss-ap-two-sums', 'Arithmetic series', 3, (r) => {
		const a = r.int(-5, 8), d = r.nonzeroInt(-3, 5), p = r.int(4, 7), q = r.int(9, 14), m = r.int(16, 24), S = (n) => n * (2 * a + (n - 1) * d) / 2;
		return { marks: 7, text: `An AP satisfies S${F.sub(p)}=${S(p)} and S${F.sub(q)}=${S(q)}.<br>(i) Find a and d.<br>(ii) Hence find S${F.sub(m)}.`, answer: multi([a, d, S(m)], ['a', 'd', `S${m}`]), solution: `<p>Substitution in S${F.sub('n')}=n[2a+(n&minus;1)d]/2 gives a=${a}, d=${d}.</p><p>S${F.sub(m)}=<strong>${S(m)}</strong>.</p>` };
	});

	add('ss-gp-fraction-chain', 'Geometric sequences', 2, (r) => {
		const den = r.pick([2, 3, 4]), rn = r.pick([1, -1]), a = r.int(2, 9) * den ** 6, p = r.int(2, 4), k = p + r.int(3, 5), ratio = rn / den, tp = a * ratio ** (p - 1), tk = a * ratio ** (k - 1);
		return { marks: 5, text: `A GP has T${F.sub(p)}=${tp} and exact ratio ${F.frac(rn, den)}. Find T${F.sub(k)} exactly.`, answer: num(tk, 'exact term'), solution: `<p>T${F.sub(k)}=${tp}(${F.frac(rn, den)})${F.sup(k - p)}=<strong>${tk}</strong>.</p>` };
	});

	add('ss-gp-least-small', 'Geometric sequences', 2, (r) => {
		const den = r.pick([2, 3, 4]), a = r.int(2, 8) * den ** 3, n = r.int(7, 13), tn = a / den ** (n - 1), prev = a / den ** (n - 2), eps = (tn + prev) / 2;
		return { marks: 5, text: `A positive GP has first term ${a} and ratio ${F.frac(1, den)}. Find the least n such that T${F.sub('n')}&lt;${MG.round(eps, 6)}. Give an exact integer.`, answer: num(n, 'least n'), solution: `<p>T${F.sub(n - 1)}=${prev} is above the bound and T${F.sub(n)}=${tn} is below it. Thus <strong>n=${n}</strong>.</p>` };
	});

	add('ss-gp-limit', 'Geometric series', 2, (r) => {
		const den = r.int(3, 9), rn = r.nonzeroInt(-den + 1, den - 1), a = r.int(2, 12), value = a * den / (den - rn);
		return { marks: 4, text: `Find S${F.sub('&infin;')} for the GP with first term ${a} and ratio ${F.frac(rn, den)}, correct to 3 decimal places.`, answer: num(MG.round(value, 3), 'limiting sum', 0.001), solution: `<p>S${F.sub('&infin;')}=a/(1&minus;r)=<strong>${value.toFixed(3)}</strong>.</p>` };
	});

	add('ss-recurring', 'Geometric series', 1, (r) => {
		const block = r.int(11, 98), g = gcd(block, 99), p = block / g, q = 99 / g;
		return { marks: 3, text: `Express 0.${block}${block}${block}… as an exact fraction in lowest terms.`, answer: text([`${p}/${q}`, `${p} / ${q}`]), solution: `<p>The recurring tail is ${block}/99=<strong>${p}/${q}</strong>.</p>` };
	});

	add('ss-sigma-upper', 'Sigma notation', 2, (r) => {
		const n = r.int(8, 22), c = r.int(1, 6), total = n * (n + 1) / 2 + c * n;
		return { marks: 4, text: `Given &Sigma;${F.sub('k=1')}${F.sup('n')}(k+${c})=${total}, find the positive integer n.`, answer: num(n, 'upper limit n'), solution: `<p>n(n+1)/2+${c}n=${total}; the positive root is <strong>${n}</strong>.</p>` };
	});

	add('ss-sigma-ap', 'Sigma notation', 1, (r) => {
		const m = r.int(2, 7), c = r.int(-6, 6), n = r.int(8, 18), value = m * n * (n + 1) / 2 + c * n;
		return { marks: 4, text: `Evaluate &Sigma;${F.sub('k=1')}${F.sup(n)}(${m}k${F.st(c, '')}).`, answer: num(value, 'sum'), solution: `<p>${m}n(n+1)/2${F.st(c * n, '')}=<strong>${value}</strong>.</p>` };
	});

	add('ss-interleaved', 'AP and GP', 3, (r) => {
		const e = r.nonzeroInt(-4, 4), d = 2 * e, a = e, terms = [a + d, a + 4 * d, a + 13 * d], ratio = 3, sum = 10 * (2 * a + 19 * d);
		const opening = r.pick([
			`The 2nd, 5th and 14th terms of an AP form a GP. The common difference of the AP is ${d}.`,
			`In an arithmetic sequence with common difference ${d}, the terms T${F.sub(2)}, T${F.sub(5)} and T${F.sub(14)} form a geometric sequence.`,
			`An AP has common difference ${d}, and its 2nd, 5th and 14th terms are consecutive terms of a GP.`
		]);
		return { marks: 8, text: `${opening}<br>(i) Show that the first term of the AP is half its common difference.<br>(ii) Write down the first term.<br>(iii) Find the common ratio of the GP and S${F.sub(20)} of the AP.`, answer: multi([a, ratio, sum], ['AP first term', 'GP ratio', 'AP S20']), solution: `<p>(a+4d)² = (a+d)(a+13d) expands to a² + 8ad + 16d² = a² + 14ad + 13d², so 3d² = 6ad and a = d/2 = ${a}.</p><p>The three terms are ${terms.join(', ')}, so r = ${ratio}.</p><p>S${F.sub(20)} = 10(2a + 19d) = <strong>${sum}</strong>.</p>` };
	});

	add('ss-partial-sums', 'Arithmetic series', 2, (r) => {
		const a = r.int(-4, 7), d = r.nonzeroInt(-3, 5), n = r.int(8, 15), S = (k) => k * (2 * a + (k - 1) * d) / 2, value = a + (n - 1) * d;
		const pts = Array.from({ length: 5 }, (_, i) => [i + 1, S(i + 1)]);
		return { marks: 4, text: `The plotted points are the first five partial sums of an AP. Its first term is ${a} and common difference is ${d}. Find T${F.sub(n)}.`, diagram: { type: 'graph', xmin: 0, xmax: 6, ymin: Math.min(-5, ...pts.map(p => p[1])) - 1, ymax: Math.max(5, ...pts.map(p => p[1])) + 1, grid: true, points: pts }, answer: num(value, `T${n}`), solution: `<p>T${F.sub(n)}=a+(${n}&minus;1)d=<strong>${value}</strong>.</p>` };
	});

	add('ss-compound', 'Financial applications', 2, (r) => {
		const p = r.int(12, 40) * 1000, rate = r.pick([0.04, 0.05, 0.06, 0.075]), n = r.int(5, 12), value = MG.round(p * (1 + rate) ** n, 2);
		return { marks: 4, text: `$${p} is invested for ${n} years at ${rate * 100}% p.a., compounded annually. Find the balance correct to 2 decimal places.`, answer: num(value, 'balance', 0.01), solution: `<p>A=${p}(1+${rate})${F.sup(n)}=<strong>$${value.toFixed(2)}</strong>.</p>` };
	});

	add('ss-annuity', 'Financial applications', 3, (r) => {
		const dep = r.int(10, 30) * 100, rate = r.pick([0.04, 0.05, 0.06]), n = r.int(8, 15), fund = MG.round(dep * (1 + rate) * ((1 + rate) ** n - 1) / rate, 2), paid = dep * n;
		return { marks: 7, text: `$${dep} is deposited at the beginning of each year for ${n} years at ${rate * 100}% p.a.<br>(i) Find total deposits.<br>(ii) Find the final fund correct to 2 decimal places.<br>(iii) Find interest earned correct to 2 decimal places.`, answer: multi([paid, fund, MG.round(fund - paid, 2)], ['total deposits', 'fund (2 decimal places)', 'interest (2 decimal places)'], 0.01), solution: `<p>Deposits=$${paid}. The annuity-due sum is $${fund.toFixed(2)}, hence interest is $${(fund - paid).toFixed(2)}.</p>` };
	});

	add('ss-loan', 'Financial applications', 3, (r) => {
		const p = r.int(20, 60) * 1000, annual = r.pick([0.06, 0.072, 0.084]), years = r.int(3, 8), i = annual / 12, n = years * 12, pay = MG.round(p * i * (1 + i) ** n / ((1 + i) ** n - 1), 2), total = MG.round(pay * n, 2);
		return { marks: 7, text: `A $${p} loan is repaid monthly over ${years} years at ${annual * 100}% p.a., compounded monthly.<br>(i) Find the monthly repayment correct to 2 decimal places.<br>(ii) Find the total repaid correct to 2 decimal places.`, answer: multi([pay, total], ['monthly repayment (2 decimal places)', 'total repaid (2 decimal places)'], 0.01), solution: `<p>Using i=${i} and ${n} payments gives $${pay.toFixed(2)} monthly and <strong>$${total.toFixed(2)}</strong> in total.</p>` };
	});
})();
