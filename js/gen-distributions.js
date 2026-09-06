// Boss extensions of 6.7.01–04: distributions, moments, sampling and normal tables.
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, round = x => MG.round(x, 4), sum = xs => xs.reduce((a, b) => a + b, 0);
	const add = (id, topic, subtopic, gen) => MG.generators.push({ id, topic, subtopic, difficulty: 4, gen });
	const ol = (...xs) => `<ol type="i">${xs.map(x => `<li>${x}</li>`).join('')}</ol>`;
	const table = (xs, ps) => `<table class="qtable"><tr><th scope="row">x</th>${xs.map(x => `<td>${x}</td>`).join('')}</tr><tr><th scope="row">P(X=x)</th>${ps.map(p => `<td>${p}</td>`).join('')}</tr></table>`;
	const answer = (values, labels) => ({ type: 'multinumeric', values: values.map(round), labels: labels.map((s, i) => `(${['i','ii','iii','iv'][i]}) ${s}`), tolerance: .00006 });
	const precision = 'Give non-integer answers correct to 4 decimal places; use unrounded values in subsequent parts.';
	const choose = (n, k) => { if (k < 0 || k > n) return 0; let v = 1; for (let i = 1; i <= k; i++) v *= (n - i + 1) / i; return v; };
	const moments = (xs, ps) => { const mean = sum(xs.map((x, i) => x * ps[i])); return { mean, variance: sum(xs.map((x, i) => (x - mean) ** 2 * ps[i])) }; };
	const sample = (n, without = false) => ({ type: 'sampleSpace', xLabels: Array.from({ length: n }, (_, i) => i + 1), yLabels: Array.from({ length: n }, (_, i) => i + 1), excludeDiagonal: without });

	add('rv-weighted-normalisation', 'Random Variables', 'Normalisation and conditional moments', r => {
		const m = r.int(3, 6), c = r.int(1, 5), xs = Array.from({ length: m + 1 }, (_, i) => i), weights = xs.map(x => x + c), total = sum(weights), ps = weights.map(w => w / total), cut = r.int(1, m - 1);
		const tail = sum(ps.slice(cut)), conditional = sum(xs.slice(cut).map(x => x * ps[x])) / tail, v = moments(xs, ps);
		return { marks: 10, text: `X has probability mass function P(X=x)=k(x+${c}) for integer x=0,1,…,${m}, and zero otherwise. The chart shows unnormalised weights, not probabilities. ${precision}${ol('Find k by normalising the entire support.', `Find P(X≥${cut}).`, `Find E(X | X≥${cut}); explain why the original probabilities must be renormalised.`, 'Find Var(X).')}`,
			diagram: { type: 'discreteBars', labels: xs, heights: weights, yTitle: 'Unnormalised weight x + ' + c }, answer: answer([1 / total, tail, conditional, v.variance], ['k', 'tail probability', 'conditional mean', 'variance']),
			solution: `<p>(i) Σ(x+${c})=${total}, so k=<strong>${round(1 / total)}</strong>.</p><p>(ii) Sum the weights from ${cut} to ${m} and divide by ${total}: <strong>${round(tail)}</strong>.</p><p>(iii) E(X | X≥${cut})=Σ[xP(X=x)]/P(X≥${cut}), summing only over the restricted support, giving <strong>${round(conditional)}</strong>.</p><p>(iv) E(X)=${round(v.mean)}. Compute Σx²P(X=x)−[E(X)]² using exact fractions: <strong>${round(v.variance)}</strong>.</p>` };
	});

	add('rv-missing-mass-moments', 'Random Variables', 'Recovering probabilities from a mean', r => {
		const xs = [0, r.int(1, 3), r.int(4, 6), r.int(7, 10)], w = xs.map(() => r.int(2, 9)), total = sum(w), ps = w.map(x => x / total), v = moments(xs, ps), meanNum = sum(xs.map((x, i) => x * w[i]));
		return { marks: 11, text: `A distribution has the table below and exact mean E(X)=${F.frac(meanNum, total)}. ${table(xs, ['a', F.frac(w[1], total), 'b', F.frac(w[3], total)])}${precision}${ol('Recover a using both normalisation and the mean constraint.', 'Recover b.', 'Find Var(X).', `Find E(X | X≥${xs[2]}).`)}`,
			answer: answer([ps[0], ps[2], v.variance, (xs[2] * w[2] + xs[3] * w[3]) / (w[2] + w[3])], ['a', 'b', 'variance', 'conditional mean']),
			solution: `<p>The missing mass satisfies a+b=${F.frac(w[0] + w[2], total)}. The mean equation is ${xs[1]}(${F.frac(w[1], total)})+${xs[2]}b+${xs[3]}(${F.frac(w[3], total)})=${F.frac(meanNum, total)}.</p><p>(i–ii) Solving gives a=<strong>${round(ps[0])}</strong> and b=<strong>${round(ps[2])}</strong>.</p><p>(iii) Σx²p(x)−[E(X)]²=<strong>${round(v.variance)}</strong>.</p><p>(iv) Restrict to the last two outcomes and renormalise: (${xs[2]}×${w[2]}+${xs[3]}×${w[3]})/(${w[2]}+${w[3]})=<strong>${round((xs[2] * w[2] + xs[3] * w[3]) / (w[2] + w[3]))}</strong>.</p>` };
	});

	add('rv-maximum-without-replacement', 'Random Variables', 'Distribution of an order statistic', r => {
		const n = r.int(5, 10), cut = r.int(3, n - 1), xs = Array.from({ length: n - 1 }, (_, i) => i + 2), ps = xs.map(x => 2 * (x - 1) / (n * (n - 1))), v = moments(xs, ps), withMean = sum(Array.from({ length: n }, (_, i) => (i + 1) * (2 * i + 1) / n ** 2));
		return { marks: 11, text: `Two distinct cards are drawn without replacement from cards 1,…,${n}. X is the larger number. Each dot represents an ordered physical draw; the diagonal is excluded. ${precision}${ol(`Derive the mass function, then find P(X=${cut}).`, 'Find E(X).', 'Find Var(X).', 'If the first card were replaced before the second draw, find the new E(X).')}`, diagram: sample(n, true),
			answer: answer([2 * (cut - 1) / (n * (n - 1)), v.mean, v.variance, withMean], ['point probability', 'mean without replacement', 'variance without replacement', 'mean with replacement']),
			solution: `<p>For X=x, the other card can be any of 1,…,x−1, in either order. Hence P(X=x)=2(x−1)/[${n}(${n - 1})], x=2,…,${n}.</p><p>(i) Substitute x=${cut}: <strong>${round(2 * (cut - 1) / (n * (n - 1)))}</strong>.</p><p>(ii) Σxp(x)=<strong>${round(v.mean)}</strong>. (iii) Σx²p(x)−[Σxp(x)]²=<strong>${round(v.variance)}</strong>.</p><p>(iv) With replacement, P(X≤x)=x²/${n ** 2}, so P(X=x)=[x²−(x−1)²]/${n ** 2}. Summing xp(x) gives <strong>${round(withMean)}</strong>.</p>` };
	});

	add('rv-zero-truncated-binomial', 'Random Variables', 'Conditioning an entire distribution', r => {
		const n = r.int(4, 8), top = r.int(2, 7), p = top / 10, xs = Array.from({ length: n + 1 }, (_, i) => i), ps = xs.map(x => choose(n, x) * p ** x * (1 - p) ** (n - x)), survive = 1 - ps[0], qs = ps.map((q, i) => i ? q / survive : 0), v = moments(xs, qs);
		return { marks: 11, text: `A batch has ${n} independent trials, each succeeding with exact probability ${top}/10. X counts successes. Only batches with at least one success are retained; Y is the success count of a randomly chosen retained batch. ${precision}${ol('Find the probability that a batch is retained.', 'Find P(Y=1).', 'Find E(Y).', 'Find Var(Y), explaining why np(1−p) cannot be applied directly to Y.')}`,
			answer: answer([survive, qs[1], v.mean, v.variance], ['retention probability', 'conditional point probability', 'conditional mean', 'conditional variance']),
			solution: `<p>(i) P(X≥1)=1−(1−${top}/10)<sup>${n}</sup>=<strong>${round(survive)}</strong>.</p><p>(ii) Divide ${n}(${top}/10)(1−${top}/10)<sup>${n - 1}</sup> by the retention probability: <strong>${round(qs[1])}</strong>.</p><p>(iii) Removing the zero outcome removes no contribution to E(X), so E(Y)=np/P(X≥1)=<strong>${round(v.mean)}</strong>.</p><p>(iv) E(X²)=np(1−p)+(np)². Thus Var(Y)=E(X²)/P(X≥1)−[E(Y)]²=<strong>${round(v.variance)}</strong>. Selection changes the distribution, so Y is not binomial.</p>` };
	});

	add('ev-sampling-variance', 'Expectation & Variance', 'Replacement changes risk, not the mean', r => {
		const red = r.int(4, 9), blue = r.int(5, 11), n = r.int(3, 4), N = red + blue, p = red / N, without = n * p * (1 - p) * (N - n) / (N - 1), withVar = n * p * (1 - p);
		return { marks: 10, text: `A bag contains ${red} red and ${blue} blue counters. X counts red counters in ${n} draws without replacement; Y counts red counters in ${n} draws with replacement. Construct the distributions or use indicator variables to justify your answers. ${precision}${ol('Find E(X).', 'Find Var(X).', 'Find Var(Y).', 'Find P(X≥2); do not use a binomial model for X.')}`,
			answer: answer([n * p, without, withVar, sum(Array.from({ length: n - 1 }, (_, i) => choose(red, i + 2) * choose(blue, n - i - 2) / choose(N, n)))], ['mean without replacement', 'variance without replacement', 'variance with replacement', 'tail probability without replacement']),
			solution: `<p>P(X=x)=C(${red},x)C(${blue},${n}−x)/C(${N},${n}). Both models have mean np, so (i) <strong>${round(n * p)}</strong>.</p><p>(ii) Without replacement the indicators are negatively correlated. Var(X)=np(1−p)(${N - n}/${N - 1})=<strong>${round(without)}</strong>.</p><p>(iii) With replacement the draws are independent: Var(Y)=np(1−p)=<strong>${round(withVar)}</strong>.</p><p>(iv) Sum the hypergeometric masses from 2 to ${n}: <strong>${round(sum(Array.from({ length: n - 1 }, (_, i) => choose(red, i + 2) * choose(blue, n - i - 2) / choose(N, n))))}</strong>.</p>` };
	});

	add('ev-affine-batch-risk', 'Expectation & Variance', 'Linear transformations and independent totals', r => {
		const xs = [0, 1, r.int(3, 5), r.int(6, 9)], weights = xs.map(() => r.int(2, 8)), total = sum(weights), ps = weights.map(w => w / total), v = moments(xs, ps), rate = r.int(2, 6), fee = r.int(5, 13), n = r.int(8, 25);
		return { marks: 11, text: `The chart gives relative frequencies for a discrete score X; treat the normalised frequencies as exact probabilities. A game's net gain is G=${rate}X−${fee} dollars. ${n} games are independent. ${precision}${ol('Find E(G) per game.', 'Find Var(G) per game.', `Find the standard deviation of total net gain over ${n} games.`, 'Replace the fixed fee by c. Find the fair fee c per game.')}`,
			diagram: { type: 'discreteBars', labels: xs, heights: weights, yTitle: 'Relative frequency' }, answer: answer([rate * v.mean - fee, rate ** 2 * v.variance, rate * Math.sqrt(n * v.variance), rate * v.mean], ['mean net gain ($)', 'variance ($²)', 'total standard deviation ($)', 'fair fee ($)']),
			solution: `<p>Normalise weights by ${total}. This gives E(X)=${round(v.mean)} and Var(X)=${round(v.variance)}.</p><p>(i) E(G)=${rate}E(X)−${fee}=<strong>${round(rate * v.mean - fee)}</strong>.</p><p>(ii) A fixed fee has no variance; scaling by ${rate} scales variance by ${rate ** 2}. Var(G)=<strong>${round(rate ** 2 * v.variance)}</strong>.</p><p>(iii) Independence makes variances add, not standard deviations: SD(total)=√[${n}Var(G)]=<strong>${round(rate * Math.sqrt(n * v.variance))}</strong>.</p><p>(iv) E(${rate}X−c)=0 requires c=${rate}E(X)=<strong>${round(rate * v.mean)}</strong>.</p>` };
	});

	add('ev-dice-jackpot', 'Expectation & Variance', 'Inverse fair-game design', r => {
		const n = r.int(5, 8), small = r.int(2, 5), fee = r.int(2, 4), highCount = 2, midCount = 4, jackpot = (fee * n * n - small * midCount) / highCount, pHigh = highCount / n ** 2, pMid = midCount / n ** 2, variance = jackpot ** 2 * pHigh + small ** 2 * pMid - fee ** 2;
		return { marks: 12, text: `Roll two independent fair ${n}-sided dice numbered 1,…,${n}. The payout is J dollars if the absolute difference is ${n - 1}, $${small} if it is ${n - 2}, and $0 otherwise. Entry costs $${fee}. ${precision}${ol('Find the probability of a positive payout by counting ordered outcomes.', 'Choose J so that the game is fair.', 'With this J, find the variance of net gain.', 'Given that a payout is positive, find its expected value.')}`, diagram: sample(n),
			answer: answer([(highCount + midCount) / n ** 2, jackpot, variance, fee / ((highCount + midCount) / n ** 2)], ['positive payout probability', 'fair jackpot ($)', 'net-gain variance ($²)', 'conditional mean payout ($)']),
			solution: `<p>A positive difference d has 2(${n}−d) ordered outcomes. Thus the jackpot occurs in 2 outcomes and the smaller prize in 4. (i) P(positive)=6/${n ** 2}=<strong>${round(6 / n ** 2)}</strong>.</p><p>(ii) Fairness requires [2J+4(${small})]/${n ** 2}=${fee}, so J=<strong>${round(jackpot)}</strong>.</p><p>(iii) Subtracting an entry fee does not change variance. E(payout²)−E(payout)²=<strong>${round(variance)}</strong>.</p><p>(iv) Divide the unconditional mean payout by P(positive), since zero payouts contribute nothing: <strong>${round(fee / (6 / n ** 2))}</strong>.</p>` };
	});

	add('ev-hidden-bag-mixture', 'Expectation & Variance', 'Mixtures and hidden dependence', r => {
		const a = r.int(6, 9), b = r.int(1, 4), prior = r.int(2, 7), p = prior / 10, pa = a / 10, pb = b / 10, mean = 2 * (p * pa + (1 - p) * pb), both = p * pa ** 2 + (1 - p) * pb ** 2, variance = mean + 2 * both - mean ** 2;
		return { marks: 12, text: `Bag A has ${a} red and ${10 - a} blue counters; bag B has ${b} red and ${10 - b} blue. A bag is chosen once: P(A)=${prior}/10. Two counters are drawn with replacement from that same bag. X counts red counters. Draws are independent given the bag, but the bag choice is shared. ${precision}${ol('Find P(X=2).', 'Find E(X).', 'Find Var(X) without treating the unconditional draws as independent.', 'Given X=2, find P(the chosen bag was A).')}`,
			diagram: { type: 'tree2', stage1: [{ label: 'A', prob: `${prior}/10` }, { label: 'B', prob: `${10 - prior}/10` }], stage2: [[{ label: 'RR', prob: 'pA²' }, { label: 'not RR', prob: '1−pA²' }], [{ label: 'RR', prob: 'pB²' }, { label: 'not RR', prob: '1−pB²' }]] },
			answer: answer([both, mean, variance, p * pa ** 2 / both], ['two-red probability', 'mean', 'variance', 'posterior bag probability']),
			solution: `<p>Write pA=${a}/10 and pB=${b}/10. (i) Weight the two conditional probabilities: P(X=2)=(${prior}/10)pA²+(${10 - prior}/10)pB²=<strong>${round(both)}</strong>.</p><p>(ii) E(X)=2[(${prior}/10)pA+(${10 - prior}/10)pB]=<strong>${round(mean)}</strong>.</p><p>(iii) On {0,1,2}, X²=X+2·1{X=2}. Hence Var(X)=E(X)+2P(X=2)−E(X)²=<strong>${round(variance)}</strong>. Mixing two different bag rates creates unconditional dependence.</p><p>(iv) Bayes gives (${prior}/10)pA²/P(X=2)=<strong>${round(p * pa ** 2 / both)}</strong>.</p>` };
	});

	// Positive-z CDF table entries, rounded to 4 d.p., as in worksheet 6.7.04.
	// These printed entries are the numerical givens; never grade against hidden higher precision.
	const lookup = [[.4,.6554],[.8,.7881],[1.2,.8849],[1.6,.9452],[2,.9772],[2.4,.9918]];
	const normalTable = pairs => `<p>Use Φ(z)=P(Z≤z) and the supplied table values as given in your calculations; Φ(−z)=1−Φ(z).</p><table class="qtable"><tr><th>z</th>${pairs.map(p => `<td>${p[0]}</td>`).join('')}</tr><tr><th>Φ(z)</th>${pairs.map(p => `<td>${p[1]}</td>`).join('')}</tr></table>`;

	add('nd-conditioned-interval', 'Normal Distributions', 'Symmetry and conditional normal areas', r => {
		const [a, b] = r.shuffle(lookup).slice(0, 2).sort((x, y) => x[0] - y[0]), mu = r.int(40, 80), sd = r.int(5, 15), central = a[1] + b[1] - 1;
		return { marks: 10, text: `X is normal with mean ${mu} and standard deviation ${sd}. Let L=${F.num(mu - b[0] * sd, 2)}, M=${F.num(mu - a[0] * sd, 2)} and U=${F.num(mu + a[0] * sd, 2)}. ${normalTable([a,b])}${precision}${ol('Find P(X&lt;L).', 'Find P(L&lt;X&lt;U).', 'Find P(X&gt;M | L&lt;X&lt;U).', 'Find P(X&gt;U | X&gt;L).')}`, diagram: { type: 'normal', shadeFromZ: -b[0], shadeToZ: a[0] },
			answer: answer([1 - b[1], central, (2 * a[1] - 1) / central, (1 - a[1]) / b[1]], ['left-tail probability', 'interval probability', 'conditional interval probability', 'conditional upper-tail probability']),
			solution: `<p>Standardising L,M,U gives −${b[0]}, −${a[0]}, ${a[0]}. (i) By symmetry, 1−Φ(${b[0]})=<strong>${round(1 - b[1])}</strong>.</p><p>(ii) Φ(${a[0]})−[1−Φ(${b[0]})]=<strong>${round(central)}</strong>.</p><p>(iii) Within (L,U), the event X>M is (M,U); divide its central area 2Φ(${a[0]})−1 by part (ii): <strong>${round((2 * a[1] - 1) / central)}</strong>.</p><p>(iv) X>U is contained in X>L. Divide 1−Φ(${a[0]}) by Φ(${b[0]}): <strong>${round((1 - a[1]) / b[1])}</strong>.</p>` };
	});

	add('nd-inverse-parameters', 'Normal Distributions', 'Recovering mean and spread from percentiles', r => {
		const [a,b] = r.shuffle(lookup).slice(0,2), mu = r.int(50,100), sd = r.int(5,15), low = mu - a[0] * sd, high = mu + b[0] * sd;
		return { marks: 11, text: `A normal variable X has unknown mean μ and positive standard deviation σ. The cutoff ${F.num(low,2)} corresponds exactly to z=−${a[0]}, and cutoff ${F.num(high,2)} corresponds exactly to z=${b[0]}. Their approximate cumulative probabilities are ${F.num(1-a[1],4)} and ${b[1]}. ${normalTable([a,b])}${precision}${ol('Recover σ by solving the two standardisation equations.', 'Recover μ.', 'Find P(X lies between the two cutoffs).', 'Find the cutoff c exceeded by the same proportion that falls below the lower given cutoff.')}`,
			diagram: { type: 'normal', shadeFromZ: -a[0], shadeToZ: b[0] }, answer: answer([sd, mu, a[1]+b[1]-1, mu+a[0]*sd], ['standard deviation', 'mean', 'interval probability', 'symmetric upper cutoff']),
			solution: `<p>The equations are μ−${a[0]}σ=${F.num(low,2)} and μ+${b[0]}σ=${F.num(high,2)}. Subtracting eliminates μ: (${F.num(a[0]+b[0],2)})σ=${F.num(high-low,2)}.</p><p>(i) σ=<strong>${sd}</strong>; substituting back gives (ii) μ=<strong>${mu}</strong>.</p><p>(iii) The area is Φ(${b[0]})−Φ(−${a[0]})=<strong>${round(a[1]+b[1]-1)}</strong>.</p><p>(iv) Reflect the lower cutoff about μ: c=μ+${a[0]}σ=<strong>${round(mu+a[0]*sd)}</strong>.</p>` };
	});

	add('nd-calibration-acceptance', 'Normal Distributions', 'Calibration and tolerance windows', r => {
		const [z,cdf] = r.pick(lookup.slice(1,5)), sd = r.int(4,12), centre = r.int(60,110), shift = r.int(3,12), mu=centre+shift, lo=centre-z*sd, hi=centre+z*sd, batch=r.int(15,45)*100;
		return { marks: 11, text: `Measurements X are normal with mean ${mu} and standard deviation ${sd}. A calibration subtracts a fixed c, so Y=X−c. Values of Y are accepted from ${F.num(lo,2)} to ${F.num(hi,2)}. Choose c to maximise acceptance; subtracting a constant does not change spread. ${normalTable([[z,cdf]])}${precision}${ol('Find the optimal calibration c.', 'Find the maximum acceptance probability.', `Find the expected number rejected in ${batch} independent measurements.`, 'Find the probability that two independent calibrated measurements are both rejected on the same side of the interval.')}`,
			diagram: { type:'normal', shadeFromZ:-z, shadeToZ:z }, answer:answer([shift,2*cdf-1,batch*2*(1-cdf),2*(1-cdf)**2],['calibration c','acceptance probability','expected rejected count','same-tail probability']),
			solution:`<p>A symmetric unimodal density places the most mass in a fixed-width interval when its mean is at the midpoint ${centre}. Thus E(Y)=${mu}−c=${centre}, giving (i) c=<strong>${shift}</strong>.</p><p>(ii) The endpoints are now ±${z} standard deviations, so acceptance is 2Φ(${z})−1=<strong>${round(2*cdf-1)}</strong>.</p><p>(iii) Expected rejects=${batch}[2(1−Φ(${z}))]=<strong>${round(batch*2*(1-cdf))}</strong>.</p><p>(iv) Both below or both above are disjoint paths: 2[1−Φ(${z})]²=<strong>${round(2*(1-cdf)**2)}</strong>.</p>` };
	});

	add('nd-extreme-selection', 'Normal Distributions', 'Selection bias and repeated normal observations', r => {
		const [a,b]=r.shuffle(lookup).slice(0,2).sort((x,y)=>x[0]-y[0]), n=r.int(3,7), mu=r.int(30,70), sd=r.int(4,12), lo=mu+a[0]*sd, hi=mu+b[0]*sd, p=1-a[1], q=1-b[1];
		return {marks:11,text:`Independent observations are normal with mean ${mu} and standard deviation ${sd}. An observation is flagged if it exceeds ${F.num(lo,2)} and is extreme if it exceeds ${F.num(hi,2)}. ${normalTable([a,b])}${precision}${ol('Find P(extreme | flagged).', `Among ${n} unselected independent observations, find P(at least one is extreme).`, `Among ${n} independent observations, find P(exactly one is extreme and every other observation is not flagged).`, `Given all ${n} independent observations are flagged, find P(at least one is extreme).`)}`,
			diagram:{type:'normal',shadeFromZ:b[0],shadeToZ:3.4},answer:answer([q/p,1-(1-q)**n,n*q*a[1]**(n-1),1-(1-q/p)**n],['conditional extreme probability','at-least-one probability','specified pattern probability','selected-sample probability']),
			solution:`<p>The two upper-tail rates are p=1−Φ(${a[0]})=${round(p)} and q=1−Φ(${b[0]})=${round(q)}. Extreme is a subset of flagged.</p><p>(i) q/p=<strong>${round(q/p)}</strong>.</p><p>(ii) Complement no extremes: 1−(1−q)<sup>${n}</sup>=<strong>${round(1-(1-q)**n)}</strong>.</p><p>(iii) Choose the position of the extreme; each remaining observation must be below the lower threshold: ${n}q[Φ(${a[0]})]<sup>${n-1}</sup>=<strong>${round(n*q*a[1]**(n-1))}</strong>.</p><p>(iv) Conditioning each independent observation on its own flag preserves independence but changes the extreme rate to q/p. Hence 1−(1−q/p)<sup>${n}</sup>=<strong>${round(1-(1-q/p)**n)}</strong>.</p>`};
	});
})();
