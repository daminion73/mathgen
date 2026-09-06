// Probability & Statistics question generators
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const F = MG.fmt, G = MG.generators;
	const add = (id, subtopic, difficulty, gen) => G.push({ id, topic: 'Probability & Statistics', subtopic, difficulty, gen });
	const dp = (x, n = 4) => MG.round(x, n);
	const num = (value, label = 'probability', tolerance = 0.0005) => ({ type: 'numeric', value, tolerance, label });
	const multi = (values, labels, tolerance = 0.0005) => ({ type: 'multinumeric', values, labels, tolerance });
	const choose = (n, k) => { let v = 1; for (let i = 1; i <= k; i++) v = v * (n - i + 1) / i; return v; };
	const tree = (a, b, A = 'A', B = 'B') => ({ type: 'tree2', stage1: [{ label: A, prob: `${a}/${a + b}` }, { label: B, prob: `${b}/${a + b}` }], stage2: [[{ label: A, prob: `${a - 1}/${a + b - 1}` }, { label: B, prob: `${b}/${a + b - 1}` }], [{ label: A, prob: `${a}/${a + b - 1}` }, { label: B, prob: `${b - 1}/${a + b - 1}` }]] });

	add('ps-tree-chain', 'Dependent probability', 2, (r) => {
		const a = r.int(4, 10), b = r.int(3, 9), names = r.pick([['red', 'blue'], ['senior', 'junior'], ['local', 'visitor']]);
		const aa = dp(a * (a - 1) / ((a + b) * (a + b - 1))), diff = dp(2 * a * b / ((a + b) * (a + b - 1)));
		const raw = [a * (a - 1), 2 * a * b, b * (b - 1)], best = raw.indexOf(Math.max(...raw)), outcomes = [`both ${names[0]}`, 'different categories', `both ${names[1]}`];
		const choices = r.shuffle(outcomes), correct = choices.indexOf(outcomes[best]);
		return { marks: 5, text: `A group contains ${a} ${names[0]} and ${b} ${names[1]} members. Two are selected without replacement. (i) Calculate P(both ${names[0]}) to 4 d.p. (ii) Calculate P(different categories) to 4 d.p. (iii) Which outcome is most likely?`, diagram: tree(a, b, names[0], names[1]), answer: { type: 'mc', choices, correct }, solution: `<p>(i) ${F.frac(a, a + b)}&times;${F.frac(a - 1, a + b - 1)}=<strong>${aa}</strong>. (ii) Add the two mixed paths: <strong>${diff}</strong>. (iii) Comparing all three probabilities gives <strong>${outcomes[best]}</strong>.</p>` };
	});

	add('ps-tree-reverse', 'Dependent probability', 3, (r) => {
		const a = r.int(4, 9), b = r.int(4, 9), n = a + b, pGiven = dp((a - 1) / (n - 1)), diff = dp(2 * a * b / (n * (n - 1)));
		return { marks: 6, text: `A bag has ${a} gold and ${b} silver tokens. Two are drawn without replacement. Find (i) P(the second is gold | the first is gold) and (ii) P(exactly one is gold), each correct to 4 d.p.`, diagram: tree(a, b, 'gold', 'silver'), answer: multi([pGiven, diff], ['(i) conditional probability (4 d.p.)', '(ii) probability (4 d.p.)']), solution: `<p>(i) After one gold is removed, P=${F.frac(a - 1, n - 1)}=<strong>${pGiven}</strong>.</p><p>(ii) GS or SG gives ${F.frac(a, n)}${F.frac(b, n - 1)}+${F.frac(b, n)}${F.frac(a, n - 1)}=<strong>${diff}</strong>.</p>` };
	});

	add('ps-weighted-height', 'Binomial probability', 2, (r) => {
		const men = r.pick([40, 50, 60, 70]), pm = r.pick([3, 4, 5, 6]), pw = r.pick([1, 2, 3]), n = r.pick([4, 5, 6]), p = (men / 100) * (pm / 100) + (1 - men / 100) * (pw / 100), value = dp(choose(n, 1) * p * (1 - p) ** (n - 1));
		return { marks: 4, text: `In a town, ${men}% of people are men. ${pm}% of men and ${pw}% of women are taller than 180 cm. If ${n} people are selected independently, find the probability that exactly one is taller than 180 cm, correct to 4 decimal places.`, answer: num(value), solution: `<p>P(over 180)=${men / 100}(${pm / 100})+${1 - men / 100}(${pw / 100})=${dp(p, 4)}.</p><p>${n}p(1-p)${F.sup(n - 1)}=<strong>${value}</strong>.</p>` };
	});

	add('ps-binomial-exact', 'Binomial probability', 2, (r) => {
		const den = r.pick([5, 8, 10]), top = r.int(1, den - 2), n = r.pick([5, 6, 7]), k = r.int(2, Math.min(3, n - 1)), p = top / den, value = dp(choose(n, k) * p ** k * (1 - p) ** (n - k));
		return { marks: 4, text: `A component passes inspection with probability ${top}/${den}, independently. Find the probability that exactly ${k} of ${n} components pass, correct to 4 decimal places.`, answer: num(value), solution: `<p>There are ${choose(n, k)} arrangements. Thus P=${choose(n, k)}(${F.frac(top, den)})${F.sup(k)}(${F.frac(den - top, den)})${F.sup(n - k)}=<strong>${value}</strong>.</p>` };
	});

	add('ps-table-conditional', 'Conditional probability', 2, (r) => {
		const ay = r.int(8, 25), an = r.int(5, 20), by = r.int(7, 24), bn = r.int(6, 22), mode = r.pick(['givenY', 'givenA', 'notA']);
		const value = dp(mode === 'givenY' ? ay / (ay + by) : mode === 'givenA' ? ay / (ay + an) : bn / (by + bn));
		const ask = mode === 'givenY' ? 'P(A | Yes)' : mode === 'givenA' ? 'P(Yes | A)' : 'P(No | not A)';
		return { marks: 4, text: `A survey produced the table:<br><table class="qtable"><tr><th></th><th>Yes</th><th>No</th></tr><tr><th>A</th><td>${ay}</td><td>${an}</td></tr><tr><th>B</th><td>${by}</td><td>${bn}</td></tr></table>Find ${ask}, correct to 4 decimal places.`, answer: num(value), solution: `<p>Restrict the denominator to the group after the conditioning bar. The required ratio is <strong>${value}</strong>.</p>` };
	});

	add('ps-table-reconstruct', 'Conditional probability', 3, (r) => {
		const a = r.int(18, 35), b = r.int(15, 30), yes = r.int(16, 32), ay = r.int(6, Math.min(a, yes) - 3), total = a + b, by = yes - ay, value = dp(by / b);
		return { marks: 6, text: `Among ${total} students, ${a} are in group A and ${yes} answered Yes. Of group A, ${ay} answered Yes. Complete the implied two-way table, then find P(Yes | group B), correct to 4 decimal places.`, answer: num(value), solution: `<p>Group B has ${b} students and ${by} Yes responses. Hence P(Yes|B)=${F.frac(by, b)}=<strong>${value}</strong>.</p>` };
	});

	add('ps-venn-unknown', 'Sets & Venn diagrams', 3, (r) => {
		const x = r.int(2, 8), fixed = { a: r.int(3, 9), b: r.int(3, 9), c: r.int(3, 9), ab: r.int(1, 5), ac: r.int(1, 5), bc: r.int(1, 5), none: r.int(1, 5) }, total = Object.values(fixed).reduce((s, v) => s + v, 0) + x, atLeastTwo = fixed.ab + fixed.ac + fixed.bc + x, value = dp(atLeastTwo / total);
		const shown = { ...fixed, abc: 'x' };
		return { marks: 7, text: `The Venn diagram represents ${total} people. The central region is x. (i) Find x. (ii) Hence find P(a randomly chosen person belongs to at least two sets), correct to 4 decimal places.`, diagram: { type: 'venn3', labelA: 'A', labelB: 'B', labelC: 'C', v: shown }, answer: multi([x, value], ['(i) x', '(ii) probability (4 d.p.)']), solution: `<p>(i) Subtracting the seven displayed fixed regions from ${total} gives <strong>x=${x}</strong>.</p><p>(ii) Add the four regions lying in two or more circles and divide by ${total}: <strong>${value}</strong>.</p>` };
	});

	add('ps-venn-conditional', 'Sets & Venn diagrams', 2, (r) => {
		const ao = r.int(5, 16), bo = r.int(5, 16), both = r.int(2, 9), neither = r.int(2, 8), value = dp(both / (ao + both));
		return { marks: 4, text: `The Venn diagram shows a survey. Given that a person is in A, find the probability that the person is also in B, correct to 4 decimal places.`, diagram: { type: 'venn2', labelA: 'A', labelB: 'B', aOnly: ao, bOnly: bo, both, neither }, answer: num(value), solution: `<p>The restricted sample space A has ${ao + both} people, of whom ${both} are also in B. P(B|A)=${F.frac(both, ao + both)}=<strong>${value}</strong>.</p>` };
	});

	add('ps-at-least-one', 'Repeated trials', 2, (r) => {
		const den = r.pick([4, 5, 8, 10]), top = r.int(1, den - 1), n = r.int(3, 8), q = (den - top) / den, value = dp(1 - q ** n);
		return { marks: 4, text: `The probability of success on each independent trial is ${top}/${den}. Find the probability of at least one success in ${n} trials, correct to 4 decimal places.`, answer: num(value), solution: `<p>P(at least one)=1-P(none)=1-(${F.frac(den - top, den)})${F.sup(n)}=<strong>${value}</strong>.</p>` };
	});

	add('ps-minimum-trials', 'Repeated trials', 3, (r) => {
		const den = r.pick([4, 5, 8, 10]), top = r.int(1, den - 1), target = r.pick([0.8, 0.9, 0.95, 0.99]), q = (den - top) / den, value = Math.floor(Math.log(1 - target) / Math.log(q)) + 1;
		return { marks: 6, text: `A player succeeds independently with probability ${top}/${den} per attempt. Find the smallest number n of attempts for which P(at least one success) is greater than ${target}.`, answer: num(value, 'smallest n', 0.001), solution: `<p>Require 1-(${F.frac(den - top, den)})${F.sup('n')}&gt;${target}. Thus n&gt;${dp(Math.log(1 - target) / Math.log(q), 3)}, so the smallest integer is <strong>${value}</strong>.</p>` };
	});

	add('ps-game-expected', 'Expected value', 2, (r) => {
		const cost = r.int(2, 7), den = r.pick([8, 10, 12]), win = r.int(cost + 3, cost + 12), mid = r.int(1, cost + 2), p1 = r.int(1, 2), p2 = r.int(1, 3), lose = den - p1 - p2, ev = dp((p1 * win + p2 * mid) / den - cost, 2);
		return { marks: 4, text: `A game costs $${cost}. It pays $${win} on ${p1}/${den} of plays, $${mid} on ${p2}/${den}, and $0 otherwise. Find the expected net gain per play, correct to 2 decimal places.`, answer: num(ev, 'expected net gain ($, 2 d.p.)', 0.01), solution: `<p>E(net)=${F.frac(`${p1}(${win})+${p2}(${mid})+${lose}(0)`, den)}-${cost}=<strong>$${ev}</strong>.</p>` };
	});

	add('ps-game-fair', 'Expected value', 3, (r) => {
		const den = r.pick([8, 10, 12]), p1 = r.int(1, 3), p2 = r.int(1, 3), prize1 = r.int(8, 20), prize2 = r.int(2, 7), value = dp((p1 * prize1 + p2 * prize2) / den, 2);
		return { marks: 6, text: `A game pays $${prize1} with probability ${p1}/${den}, $${prize2} with probability ${p2}/${den}, and nothing otherwise. Determine the fair entry fee, correct to 2 decimal places, and explain why charging more favours the organiser.`, answer: num(value, 'fair fee ($, 2 d.p.)', 0.01), solution: `<p>A fair fee equals expected payout: ${F.frac(`${p1}(${prize1})+${p2}(${prize2})`, den)}=<strong>$${value}</strong>. A larger fee makes the player's expected net return negative.</p>` };
	});

	add('ps-bayes-chain', 'Conditional probability', 3, (r) => {
		const pa = r.pick([0.3, 0.4, 0.6, 0.7]), hitA = r.pick([0.7, 0.8, 0.9]), hitB = r.pick([0.1, 0.2, 0.3]), hit = pa * hitA + (1 - pa) * hitB, value = dp(pa * hitA / hit);
		return { marks: 7, text: `Machine A makes ${pa * 100}% of items and machine B makes the rest. Their defect rates are ${hitA * 10}% and ${hitB * 10}% respectively. An item is defective. Find P(it came from A), correct to 4 decimal places.`, diagram: { type: 'tree2', stage1: [{ label: 'A', prob: String(pa) }, { label: 'B', prob: String(dp(1 - pa, 1)) }], stage2: [[{ label: 'defective', prob: String(hitA / 10) }, { label: 'sound', prob: String(dp(1 - hitA / 10, 2)) }], [{ label: 'defective', prob: String(hitB / 10) }, { label: 'sound', prob: String(dp(1 - hitB / 10, 2)) }]] }, answer: num(value), solution: `<p>P(A and defective)=${pa}(${hitA / 10}). Divide this by the total defect probability ${dp(pa * hitA / 10 + (1 - pa) * hitB / 10, 4)} to obtain <strong>${value}</strong>.</p>` };
	});
})();
