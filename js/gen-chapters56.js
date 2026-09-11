// Chapters 5–6: set theory, counting and probability foundations.
window.MG = window.MG || {};
MG.generators = MG.generators || [];
(function () {
	const G = MG.generators;
	const add = (id, topic, subtopic, difficulty, gen) => G.push({ id, topic, subtopic, difficulty, gen });
	const num = (value, label = 'answer', tolerance = 0.000001) => ({ type: 'numeric', value, label, tolerance });
	const multi = (values, labels, tolerance = 0.000001) => ({ type: 'multinumeric', values, labels, tolerance });
	const mc = (r, correct, distractors) => { const choices = r.shuffle([correct, ...distractors]); return { type: 'mc', choices, correct: choices.indexOf(correct) }; };
	const sol = (work, answer) => `<p>${work}</p><p>Answer: <strong>${answer}</strong>.</p>`;
	const venn2 = ({ a, ab, b, none }) => ({ type: 'venn2', aOnly: a, both: ab, bOnly: b, neither: none });

	add('ch56-set-membership-empty', 'Set Theory', 'Membership and the empty set', 1, r => {
		const a = r.int(2, 6), b = a + r.int(2, 5), x = r.int(a, b), inside = x % 2 === 0;
		const correct = inside ? `${x} &isin; A and &empty; &sube; A` : `${x} &notin; A and &empty; &sube; A`;
		return { marks: 2, text: `Let A={n &isin; &#8484; : ${a}&le;n&le;${b} and n is even}. Which statement is true?`, answer: mc(r, correct, [`${x} &isin; A and &empty; &notin; A`, `${x} &notin; A and &empty; &notin; A`, `${x} &isin; A and A=&empty;`]), solution: sol(`Test ${x} against both conditions. The empty set is a subset of every set; it is not an element unless explicitly listed`, correct) };
	});

	add('ch56-roster-builder', 'Set Theory', 'Roster and set-builder notation', 1, r => {
		const divisor = r.int(2, 5), limit = r.int(divisor * 2 + 1, divisor * 5 + 2), values = range(1, limit - 1).filter(x => x % divisor === 0);
		const roster = xs => `{${xs.join(', ')}}`, correct = roster(values);
		return { marks: 2, text: `Which roster represents {x &isin; &#8469; : x&lt;${limit} and ${divisor} divides x}?`, answer: mc(r, correct, [roster([0, ...values]), roster(range(1, limit - 1).filter(x => x % divisor !== 0)), roster([...values, limit])]), solution: sol(`List the positive natural numbers below ${limit} that are divisible by ${divisor}`, correct) };
	});

	add('ch56-equal-equivalent-finite', 'Set Theory', 'Equality, equivalence and finiteness', 1, r => {
		const n = r.int(3, 7), start = r.int(1, 9), letter = r.int(0, 12), A = Array.from({ length: n }, (_, i) => start + i).join(', '), B = Array.from({ length: n }, (_, i) => String.fromCharCode(97 + letter + i)).join(', ');
		return { marks: 2, text: `A={${A}} and B={${B}}. Classify the sets.`, answer: mc(r, 'Equivalent but not equal; both finite', ['Equal and equivalent; both finite', 'Neither equal nor equivalent', 'Equivalent and infinite']), solution: sol(`They contain different elements, but each has cardinality ${n}`, 'equivalent but not equal; finite') };
	});

	add('ch56-subset-proper', 'Set Theory', 'Subsets and proper subsets', 2, r => {
		const n = r.int(3, 7), k = r.int(0, n - 1);
		return { marks: 3, text: `A set S has ${n} elements. How many subsets have exactly ${k} elements, and are all of them proper subsets of S?`, answer: multi([comb(n, k), 1], ['number of subsets', 'enter 1 for yes, 0 for no']), solution: sol(`Choose ${k} of ${n}: C(${n},${k})=${comb(n, k)}. Since ${k}<${n}, none equals S`, `${comb(n, k)}, yes`) };
	});

	add('ch56-power-constrained', 'Set Theory', 'Power sets and constraints', 2, r => {
		const n = r.int(4, 10), a = String.fromCharCode(97 + r.int(0, 9)), b = String.fromCharCode(107 + r.int(0, 9));
		return { marks: 3, text: `S has ${n} elements, including distinct elements ${a} and ${b}. Find (i) |P(S)| and (ii) the number of subsets containing ${a} but not ${b}.`, answer: multi([2 ** n, 2 ** (n - 2)], ['power-set size', 'constrained subsets']), solution: sol(`Each element gives include/exclude, so |P(S)|=2^${n}. Fix ${a} in and ${b} out; the other ${n - 2} elements remain free`, `${2 ** n}, ${2 ** (n - 2)}`) };
	});

	add('ch56-roster-operations', 'Set Theory', 'Union ∪, intersection ∩ and difference ∖', 2, r => {
		const m = r.int(7, 15), divisor = r.int(2, 4), cut = r.int(2, m - 2), A = range(1, m).filter(x => x % divisor !== 0), B = range(1, m).filter(x => x > cut), inter = A.filter(x => B.includes(x));
		return { marks: 4, text: `U={1,...,${m}}, A={${A}}, B={${B}}. Find the cardinalities of A ∪ B, A ∩ B, A ∖ B and A′.`, answer: multi([new Set([...A, ...B]).size, inter.length, A.length - inter.length, m - A.length], ['|A ∪ B|', '|A ∩ B|', '|A ∖ B|', '|A′|']), solution: sol(`Compare the displayed roster entries: ∪ combines both sets, ∩ keeps shared elements, ∖ keeps elements of A outside B, and ′ takes the complement in U`, `${new Set([...A, ...B]).size}, ${inter.length}, ${A.length - inter.length}, ${m - A.length}`) };
	});

	add('ch56-venn-interpret', 'Set Theory', 'Venn-region interpretation', 2, r => {
		const a = r.int(2, 8), ab = r.int(1, 6), b = r.int(2, 8), none = r.int(1, 5);
		return { marks: 3, diagram: venn2({ a, ab, b, none }), text: `The Venn diagram gives disjoint region counts. Find |A&cup;B|, |A&cap;B| and |A&prime;|.`, answer: multi([a + ab + b, ab, b + none], ['union', 'intersection', 'A complement']), solution: sol(`A union uses all three circles' regions; A complement uses B-only and neither`, `${a + ab + b}, ${ab}, ${b + none}`) };
	});

	add('ch56-venn-element-placement', 'Set Theory', 'Element placement in Venn diagrams', 1, r => {
		const divisor = r.int(2, 4), threshold = r.int(5, 12), x = r.int(3, 18), inA = x % divisor === 0, inB = x > threshold, region = inA && inB ? 'A intersection B' : inA ? 'A only' : inB ? 'B only' : 'outside both';
		return { marks: 2, diagram: venn2({ a: 'A only', ab: 'both', b: 'B only', none: 'neither' }), text: `A is the set of integers divisible by ${divisor} and B is the set of integers greater than ${threshold}. In which labelled region should ${x} be placed?`, answer: mc(r, region, ['A only', 'B only', 'A intersection B', 'outside both'].filter(z => z !== region)), solution: sol(`Check the two predicates separately`, region) };
	});

	add('ch56-event-enumeration', 'Probability & Statistics', 'Events and sample spaces', 1, r => {
		const n = r.int(5, 9), t = r.int(4, n + 2), count = range(1, n).filter(x => x < t && x % 2).length;
		return { marks: 2, text: `A fair spinner has outcomes S={1,...,${n}}. Event E is “odd and less than ${t}”. How many outcomes are in E, and what is P(E)? Give the probability exactly or to 4 d.p.`, answer: multi([count, count / n], ['number of outcomes', 'probability']), solution: sol(`Enumerate the odd values below ${t}; there are ${count} among ${n} equally likely outcomes`, `${count}, ${count}/${n}`) };
	});

	add('ch56-dice-predicate', 'Probability & Statistics', 'Dice sample-space predicates', 2, r => {
		const s = r.pick([4, 6, 8]), k = r.int(5, s + 3), pairs = []; for (let i = 1; i <= s; i++) for (let j = 1; j <= s; j++) if (i + j >= k && i !== j) pairs.push([i, j]);
		return { marks: 3, diagram: { type: 'sampleSpace', xLabels: range(1, s), yLabels: range(1, s) }, text: `Two fair ${s}-sided dice are rolled. Count ordered outcomes whose sum is at least ${k} and which are not doubles; hence find the probability exactly or to 4 d.p.`, answer: multi([pairs.length, pairs.length / (s * s)], ['outcome count', 'probability']), solution: sol(`Inspect all ${s * s} ordered cells and remove diagonal cells`, `${pairs.length}, ${pairs.length}/${s * s}`) };
	});

	add('ch56-replacement-compare', 'Probability & Statistics', 'With and without replacement', 2, r => {
		const red = r.int(3, 7), blue = r.int(2, 6), n = red + blue;
		return { marks: 3, text: `A bag has ${red} red and ${blue} blue counters. Find P(two red) (i) with replacement and (ii) without replacement. Give both exactly or to 4 d.p.`, answer: multi([(red / n) ** 2, red * (red - 1) / (n * (n - 1))], ['with replacement', 'without replacement']), solution: sol(`Replacement keeps ${red}/${n}; without replacement the second red chance is ${red - 1}/${n - 1}`, `${red * red}/${n * n}, ${red * (red - 1)}/${n * (n - 1)}`) };
	});

	add('ch56-route-product', 'Probability & Statistics', 'Multiplication principle and routes', 1, r => {
		const a = r.int(2, 5), b = r.int(2, 6), c = r.int(2, 4);
		return { marks: 2, text: `There are ${a} routes from P to Q, ${b} from Q to R and ${c} from R to S. A journey visits each point in order. How many journeys are possible?`, answer: num(a * b * c, 'journeys'), solution: sol(`Use the multiplication principle: ${a}&times;${b}&times;${c}`, a * b * c) };
	});

	add('ch56-multistage-probability', 'Probability & Statistics', 'Multistage probability', 3, r => {
		const p = r.pick([0.2, 0.3, 0.4]), q = r.pick([0.6, 0.7, 0.8]), f = r.pick([0.1, 0.2]); const win = p * q + (1 - p) * f;
		return { marks: 4, text: `A player chooses strategy A with probability ${p}, otherwise B. The win probabilities are ${q} after A and ${f} after B. Find P(win) and P(A | win), exactly or to 4 d.p.`, answer: multi([win, p * q / win], ['P(win)', 'P(A given win)']), solution: sol(`Total probability gives ${p}(${q})+${1 - p}(${f})=${win}; Bayes divides the A-and-win path ${p * q} by ${win}`, `${win}, ${p * q / win}`) };
	});

	add('ch56-geometric-probability', 'Probability & Statistics', 'Geometric probability', 2, r => {
		const L = r.int(8, 15), a = r.int(1, 3), b = r.int(a + 2, L - 1);
		return { marks: 2, text: `A point is selected uniformly on a line segment of length ${L}. What is the probability its distance from the left endpoint lies between ${a} and ${b}, inclusive? Give it exactly or to 4 d.p.`, answer: num((b - a) / L, 'probability'), solution: sol(`Endpoint inclusion has zero effect. Favourable length is ${b}&minus;${a}=${b - a}; divide by ${L}`, `${b - a}/${L}`) };
	});

	add('ch56-ratio-category', 'Probability & Statistics', 'Ratios and categories', 1, r => {
		const a = r.int(2, 6), b = r.int(2, 6), scale = r.int(3, 8);
		return { marks: 2, text: `The ratio of category X to category Y is ${a}:${b}, and there are ${(a + b) * scale} items. Find the number in X and P(a random item is Y), exactly or to 4 d.p.`, answer: multi([a * scale, b / (a + b)], ['number in X', 'P(Y)']), solution: sol(`One ratio part is ${(a + b) * scale}/(${a + b})=${scale}`, `${a * scale}, ${b}/${a + b}`) };
	});

	add('ch56-venn-table-conversion', 'Probability & Statistics', 'Venn and two-way tables', 3, r => {
		const onlyA = r.int(3, 9), both = r.int(2, 7), onlyB = r.int(3, 9), neither = r.int(2, 8), n = onlyA + both + onlyB + neither;
		return { marks: 4, diagram: venn2({ a: onlyA, ab: both, b: onlyB, none: neither }), text: `Convert the Venn regions to a 2&times;2 A/A&prime; by B/B&prime; table. Enter cells (A&cap;B, A&cap;B&prime;, A&prime;&cap;B, A&prime;&cap;B&prime;) and the total.`, answer: multi([both, onlyA, onlyB, neither, n], ['A,B', 'A,not B', 'not A,B', 'neither', 'total']), solution: sol(`Each table cell is exactly one disjoint Venn region; then sum them`, `${both}, ${onlyA}, ${onlyB}, ${neither}, ${n}`) };
	});

	add('ch56-table-constraints', 'Probability & Statistics', 'Constraint-rich tables', 3, r => {
		const a = r.int(5, 12), b = r.int(4, 10), c = r.int(3, 9), d = r.int(4, 11), row = a + b, col = a + c;
		return { marks: 4, text: `<table class="qtable"><tr><th></th><th>B</th><th>B&prime;</th><th>Total</th></tr><tr><th>A</th><td>${a}</td><td>?</td><td>${row}</td></tr><tr><th>A&prime;</th><td>?</td><td>${d}</td><td>?</td></tr><tr><th>Total</th><td>${col}</td><td>?</td><td>?</td></tr></table> Complete the three nontrivial missing values: A&cap;B&prime;, A&prime;&cap;B, and grand total.`, answer: multi([b, c, a + b + c + d], ['A,not B', 'not A,B', 'grand total']), solution: sol(`Subtract known cells from their row and column totals, then sum all four interior cells`, `${b}, ${c}, ${a + b + c + d}`) };
	});

	add('ch56-addition-exclusivity', 'Probability & Statistics', 'Addition rule and exclusivity', 2, r => {
		const a = r.pick([0.3, 0.4, 0.5]), b = r.pick([0.2, 0.3]), i = r.pick([0, 0.1]);
		return { marks: 3, text: `P(A)=${a}, P(B)=${b}, P(A&cap;B)=${i}. Find P(A&cup;B) exactly or to 4 d.p., then classify A,B as mutually exclusive or not.`, answer: multi([a + b - i, i === 0 ? 1 : 0], ['union probability', 'enter 1 if exclusive, 0 otherwise']), solution: sol(`Addition rule: ${a}+${b}&minus;${i}=${a + b - i}. Exclusivity means intersection probability zero`, `${a + b - i}, ${i === 0 ? 'exclusive' : 'not exclusive'}`) };
	});

	add('ch56-probability-validity', 'Probability & Statistics', 'Validity of probability claims', 2, r => {
		const a = r.int(4, 8) / 10, b = r.int(3, 7) / 10, lower = Math.max(0, a + b - 1), claimed = r.pick([0, lower, Math.min(a, b) / 2]), valid = claimed + 1e-9 >= lower && claimed <= Math.min(a, b);
		return { marks: 3, text: `Someone claims P(A)=${a}, P(B)=${b}, P(A&cap;B)=${claimed}. Is this valid?`, answer: mc(r, valid ? 'Valid' : 'Invalid: the union would exceed 1', valid ? ['Invalid: probabilities cannot overlap', 'Invalid: the intersection must equal the product', 'Invalid: the marginals must sum to 1'] : ['Valid', 'Invalid: the intersection exceeds both marginals', 'Invalid: probabilities cannot be decimals']), solution: sol(`An intersection must lie between max(0,${a}+${b}&minus;1)=${Math.max(0, a + b - 1)} and min(${a},${b})=${Math.min(a, b)}`, valid ? 'valid' : 'invalid') };
	});

	add('ch56-conditional-unknown', 'Probability & Statistics', 'Conditional probability unknowns', 3, r => {
		const den = r.pick([2, 4, 5]), numerator = r.int(1, den - 1), scale = r.int(5, 10), b = den * scale, conditional = numerator / den, both = numerator * scale, total = b + r.int(20, 50);
		return { marks: 3, text: `In a survey, ${b} people are in B and P(A|B)=${conditional}. Find |A&cap;B|. If the total is ${total}, also find P(A&cap;B) exactly or to 4 d.p.`, answer: multi([both, both / total], ['intersection count', 'intersection probability']), solution: sol(`Within B, intersection count is ${conditional}&times;${b}=${both}. Divide by the total ${total} for the second probability`, `${both}, ${both}/${total}`) };
	});

	add('ch56-independence-classify', 'Probability & Statistics', 'Independence classification', 3, r => {
		const a = r.pick([0.3, 0.4, 0.5]), b = r.pick([0.2, 0.4, 0.6]), independent = r.pick([true, false]), i = independent ? a * b : a * b / 2;
		return { marks: 3, text: `P(A)=${a}, P(B)=${b}, P(A&cap;B)=${i}. Are A and B independent?`, answer: mc(r, independent ? 'Independent' : 'Not independent', ['Mutually exclusive', independent ? 'Not independent' : 'Independent', 'Cannot be determined']), solution: sol(`Compare P(A&cap;B)=${i} with P(A)P(B)=${a * b}`, independent ? 'independent' : 'not independent') };
	});

	add('ch56-independence-unknown-region', 'Probability & Statistics', 'Independence and unknown regions', 4, r => {
		const a = r.int(2, 5), b = r.int(2, 5), m = r.int(2, 5), c = a * m, x = b * m;
		return { marks: 5, text: `The 2&times;2 frequency cells (A&cap;B, A&cap;B&prime;, A&prime;&cap;B, A&prime;&cap;B&prime;) are ${a}, ${b}, ${c}, x. Events A and B are independent. Find x and the total.`, answer: multi([x, a + b + c + x], ['x', 'total']), solution: sol(`Independence in a 2&times;2 table is equivalent to cross-products: ${a}x=${b}(${c}), so x=${x}`, `${x}, ${a + b + c + x}`) };
	});

	add('ch56-element-versus-subset', 'Set Theory', 'Elements and singleton subsets', 1, r => {
		const first = r.int(1, 8), values = [first, first + r.int(2, 4), first + r.int(5, 8)], x = r.pick(values);
		const correct = `${x} &isin; S and {${x}} &sube; S`;
		return { marks: 2, text: `Let S={${values.join(', ')}}. Which statement correctly distinguishes the element ${x} from its singleton set?`, answer: mc(r, correct, [`${x} &sube; S and {${x}} &isin; S`, `${x} &notin; S and {${x}} &sube; S`, `${x} &isin; S and {${x}} &notin; S`]), solution: sol(`${x} itself is an element; the set containing only ${x} is a subset`, correct) };
	});

	add('ch56-finite-infinite', 'Set Theory', 'Equality, equivalence and finiteness', 1, r => {
		const start = r.int(-8, 8), step = r.int(2, 7);
		return { marks: 2, text: `Classify S={x &isin; &#8484; : x&ge;${start} and x&minus;${start} is divisible by ${step}} as finite, infinite or empty.`, answer: mc(r, 'Infinite', ['Finite', 'Empty', 'Not well-defined']), solution: sol(`The arithmetic sequence ${start}, ${start + step}, ${start + 2 * step}, ... continues without an upper bound`, 'infinite') };
	});

	add('ch56-power-set-list', 'Set Theory', 'Power sets and constraints', 2, r => {
		const a = String.fromCharCode(97 + r.int(0, 8)), b = String.fromCharCode(106 + r.int(0, 8));
		const correct = `P(S)={&empty;, {${a}}, {${b}}, {${a},${b}}}`;
		return { marks: 2, text: `If S={${a},${b}}, which option lists the complete power set?`, answer: mc(r, correct, [`P(S)={{${a}}, {${b}}, {${a},${b}}}`, `P(S)={&empty;, ${a}, ${b}, {${a},${b}}}`, `P(S)={&empty;, {${a},${b}}}`]), solution: sol(`A two-element set has 2²=4 subsets: choose neither, either singleton, or both`, correct) };
	});

	add('ch56-de-morgan', 'Set Theory', 'Venn identities and complements', 2, r => {
		const [a, b] = r.pick([['A', 'B'], ['P', 'Q'], ['X', 'Y'], ['M', 'N'], ['R', 'S'], ['E', 'F'], ['C', 'D'], ['U', 'V']]);
		const union = r.pick([true, false]), left = `(${a}${union ? '&cup;' : '&cap;'}${b})&prime;`;
		const correct = `${a}&prime;${union ? '&cap;' : '&cup;'}${b}&prime;`;
		return { marks: 2, text: `Using De Morgan's law, which expression is equivalent to ${left}?`, answer: mc(r, correct, [`${a}&prime;&cup;${b}&prime;`, `${a}&prime;&cap;${b}&prime;`, `${a}&cap;${b}`].filter(x => x !== correct)), solution: sol(`Complement each set and interchange union with intersection`, correct) };
	});

	add('ch56-nested-conditional', 'Probability & Statistics', 'Conditional probability unknowns', 2, r => {
		const total = r.int(40, 100), a = r.int(18, total - 8), b = r.int(5, a - 3);
		return { marks: 3, text: `In a group of ${total}, event B is a subset of A. There are ${a} in A and ${b} in B. Find P(A|B) and P(B|A), exactly or to 4 d.p.`, answer: multi([1, b / a], ['P(A given B)', 'P(B given A)']), solution: sol(`Every B outcome lies in A, so P(A|B)=1. Restricting to A gives ${b} favourable outcomes from ${a}`, `1, ${b}/${a}`) };
	});

	add('ch56-diagnostic-table', 'Probability & Statistics', 'Diagnostic two-way tables', 3, r => {
		const tp = r.int(40, 90), fn = r.int(3, 15), fp = r.int(4, 18), tn = r.int(45, 100);
		return { marks: 4, text: `<table class="qtable"><tr><th></th><th>Condition</th><th>No condition</th></tr><tr><th>Positive</th><td>${tp}</td><td>${fp}</td></tr><tr><th>Negative</th><td>${fn}</td><td>${tn}</td></tr></table> Find the sensitivity P(positive | condition) and false-positive rate P(positive | no condition), exactly or to 4 d.p.`, answer: multi([tp / (tp + fn), fp / (fp + tn)], ['sensitivity', 'false-positive rate']), solution: sol(`Condition restricts the first column: ${tp}/(${tp}+${fn}). No condition restricts the second: ${fp}/(${fp}+${tn})`, `${tp}/${tp + fn}, ${fp}/${fp + tn}`) };
	});

	add('ch56-repeated-trials', 'Probability & Statistics', 'Multistage probability', 3, r => {
		const n = r.int(3, 7), k = r.int(1, n - 1), successes = r.int(1, 4), outcomes = successes + r.int(2, 6), p = successes / outcomes;
		const value = comb(n, k) * p ** k * (1 - p) ** (n - k);
		return { marks: 4, text: `A trial has success probability ${successes}/${outcomes} and is repeated independently ${n} times. Find the probability of exactly ${k} successes, exactly or to 4 d.p.`, answer: num(value, 'probability'), solution: sol(`Choose the ${k} successful positions, then multiply path probabilities: C(${n},${k})(${successes}/${outcomes})^${k}(${outcomes - successes}/${outcomes})^${n - k}`, value) };
	});

	add('ch56-geometric-border', 'Probability & Statistics', 'Geometric probability', 2, r => {
		const width = r.int(8, 16), height = r.int(7, 14), border = r.int(1, Math.floor(Math.min(width, height) / 3));
		const value = 1 - (width - 2 * border) * (height - 2 * border) / (width * height);
		return { marks: 3, text: `A point is selected uniformly from a ${width} by ${height} rectangle. Find the probability it lies in the border strip of constant width ${border}, exactly or to 4 d.p.`, answer: num(value, 'probability'), solution: sol(`Use the complement: the inner rectangle is ${width - 2 * border} by ${height - 2 * border}. Divide border area by total area`, value) };
	});

	add('ch56-lottery-complement', 'Probability & Statistics', 'Lottery complements', 3, r => {
		const n = r.int(20, 40), tickets = r.int(2, 6), prizes = r.int(2, 5), lose = comb(n - prizes, tickets) / comb(n, tickets);
		return { marks: 4, text: `A lottery has ${n} tickets, ${prizes} distinct winning tickets, and you hold ${tickets} distinct tickets. Winners are selected without replacement. Find the probability you win at least one prize, exactly or to 4 d.p.`, answer: num(1 - lose, 'probability'), solution: sol(`Complement “no prize”: choose all ${tickets} held-ticket positions from the ${n - prizes} nonwinners. Thus P(no win)=C(${n - prizes},${tickets})/C(${n},${tickets})`, `1 &minus; ${comb(n - prizes, tickets)}/${comb(n, tickets)}`) };
	});

	function range(a, b) { return Array.from({ length: b - a + 1 }, (_, i) => a + i); }
	function comb(n, k) { k = Math.min(k, n - k); let v = 1; for (let i = 1; i <= k; i++) v = v * (n - k + i) / i; return v; }
})();
