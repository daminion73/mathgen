// MathGen app: chat-style question flow, filtering, answer checking, progress
(function () {
	const $ = (sel, el) => (el || document).querySelector(sel);
	const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

	const state = {
		topic: 'All',
		subtopic: 'All',
		bossSubtopic: 'All',
		difficulty: loadDifficulty(), // 0 = any; 4 = maximum
		variety: loadVariety(),
		seedCounter: Math.floor(Math.random() * 1e9),
		current: null, // { gen, q, seed, solved, solutionShown }
		stats: loadStats(),
		lastTopic: null,
		worksheet: null,
	};

	function loadDifficulty() {
		try {
			const saved = localStorage.getItem('mg-difficulty');
			if (saved !== null && /^[0-4]$/.test(saved)) return Number(saved);
		} catch { /* storage unavailable */ }
		return 0;
	}

	function loadVariety() {
		try {
			const saved = localStorage.getItem('mg-variety');
			if (['random', 'balanced', 'maximum'].includes(saved)) return saved;
		} catch { /* storage unavailable */ }
		return 'balanced';
	}

	function setVariety(value, persist = true) {
		state.variety = value;
		if (persist) try { localStorage.setItem('mg-variety', value); } catch { /* storage unavailable */ }
		$$('.variety-option').forEach((button) => {
			const active = button.dataset.variety === value;
			button.classList.toggle('active', active);
			button.setAttribute('aria-pressed', String(active));
		});
	}

	function setDifficulty(value, persist = true) {
		state.difficulty = value;
		if (persist) try { localStorage.setItem('mg-difficulty', String(value)); } catch { /* storage unavailable */ }
		$$('.diff-btn').forEach((b) => {
			const active = Number(b.dataset.diff) === value;
			b.classList.toggle('active', active);
			b.setAttribute('aria-pressed', String(active));
		});
	}

	function loadStats() {
		try {
			const saved = JSON.parse(localStorage.getItem('mg-stats') || '{}');
			if (!saved || Array.isArray(saved) || typeof saved !== 'object') return {};
			return Object.fromEntries(Object.entries(saved).filter(([, value]) =>
				value && Number.isInteger(value.attempted) && value.attempted >= 0 &&
				Number.isInteger(value.correct) && value.correct >= 0 && value.correct <= value.attempted));
		} catch { return {}; }
	}
	function saveStats() {
		try { localStorage.setItem('mg-stats', JSON.stringify(state.stats)); } catch { /* storage unavailable */ }
	}
	function bumpStat(topic, ok) {
		if (!state.current || state.current.attemptRecorded) return;
		const s = state.stats[topic] || { attempted: 0, correct: 0 };
		s.attempted++; if (ok) s.correct++;
		state.current.attemptRecorded = true;
		state.stats[topic] = s; saveStats(); renderStats();
	}

	const compare = (a, b) => a.localeCompare(b, 'en', { numeric: true });
	const questionKey = (gen, q) => JSON.stringify([gen.id, q.text, q.diagram], (_key, value) => typeof value === 'function' ? String(value) : value);
	const TOPICS = ['All', ...[...new Set(MG.generators.map((g) => g.topic))].sort(compare)];
	const BOSS_AREAS = [
		['Probability, Sets & Statistics', /probab|bayes|conditional|urn|dice|coin|venn|set-|expected|variance|normal|zscore|binomial|committee|counting|lottery|frequency|mean|median|quartile|stdev|boxplot|cumfreq|sampling|defect|draws|trials/],
		['Sequences, Growth & Finance', /sequence|series|\bap\b|\bgp\b|recurrence|compound|loan|interest|annuity|depreciation|growth|decay|halflife/],
		['Trigonometry & Bearings', /trig|sine|cosine|bearing|elevation|depression|tower|angle of/],
		['Coordinate Geometry & Loci', /coordinate|line-circle|gradient|midpoint|locus|parabola|reflect|perp|centroid|shoelace|circle-line/],
		['Geometry & Measurement', /geometry|circle|triangle|polygon|sector|segment|area|volume|cuboid|pyramid|cone|sphere|frustum|similar|tangent|cyclic|chord|solid|rectangle|square|annulus|heron|kite|trapezium|diagonal|shape/],
		['Algebra & Functions', /algebra|polynomial|quadratic|surd|log|exponential|simultaneous|equation|inequal|ratio|proportion|variation|remainder|vieta|discriminant|root|factor|absolute|fraction|linear|inverse|domain|composition|transform/],
	];
	function bossArea(gen) {
		const key = `${gen.id} ${gen.subtopic}`.toLowerCase();
		return (BOSS_AREAS.find(([, pattern]) => pattern.test(key)) || ['Number, Rates & Applications'])[0];
	}

	// ---------- menu page (test selection) ----------
	const TOPIC_BLURBS = {
		'All': 'Every topic mixed into one endless paper — the closest thing to a real exam sitting.',
		'Boss': 'Multi-part past-paper chains that mix several topics per question. The final tier.',
		'Sketch': 'Draw the curve yourself on the grid — branches, asymptotes and all. Checked automatically.',
		'Trigonometry': 'Exact values, sine and cosine rules, bearings, elevation and 3D solids.',
		'Geometry': 'Circle theorems, similarity, angle chases and exact lengths.',
		'Advanced Geometry': 'Past-paper style multi-step figures and proofs.',
		'Coordinate Geometry': 'Lines, distances, midpoints and gradients.',
		'Algebra': 'Absolute-value and rational inequalities, exponential and log equations, surds.',
		'Functions': 'Inverse functions, domains, composition and parametric elimination.',
		'Polynomials': 'Remainder and factor theorems, division chains.',
		'Logarithms': 'Exponential models and logarithm manipulation.',
		'Set Theory': 'Membership, notation, subsets, power sets, operations and Venn diagrams.',
		'Probability & Statistics': 'Trees, Venn diagrams, conditional probability and counting.',
		'Quadratic Theory': 'Sum and product of roots, discriminants and worded optimisation.',
		'Locus & Coordinate Geometry': 'Parabola loci, tangency, circles and perpendicular distance.',
		'Inequalities & Regions': 'Compound regions, absolute-value boundaries and lattice points.',
		'Sequences & Series': 'APs, GPs, limiting sums and sigma notation.',
		'Curve Sketching': 'Rational curves, asymptotes, reciprocals and symmetry.',
		'Spatial Reasoning': '3D constraints, surface paths, cross-sections, projection angles and optimisation.',
		'Probability Reasoning': '6.01–6.08 extensions: sample spaces, sets, tables, conditional trees and strategy decisions.',
		'Random Variables': '6.7.01 extensions: missing probabilities, order statistics and conditional distributions.',
		'Expectation & Variance': '6.7.02–03 extensions: fair games, transformed scores, sampling risk and hidden mixtures.',
		'Normal Distributions': '6.7.04 extensions: z-score tables, inverse percentiles, calibration and selection bias.',
	};

	function topicInfo(topic) {
		const gens = MG.generators.filter((g) => topic === 'All' || g.topic === topic);
		const subs = new Set(gens.map((g) => topic === 'Boss' ? bossArea(g) : g.subtopic));
		const dmin = Math.min(...gens.map((g) => g.difficulty));
		const dmax = Math.max(...gens.map((g) => g.difficulty));
		return { count: gens.length, subs: subs.size, dmin, dmax };
	}

	function diffSpan(dmin, dmax) {
		const star = (d) => d >= 4 ? '♛' : '★'.repeat(d);
		return dmin === dmax ? star(dmin) : `${star(dmin)}–${star(dmax)}`;
	}

	function menuCard(topic, idx, featured) {
		const i = topicInfo(topic);
		const title = topic === 'All' ? 'Mixed paper' : topic === 'Boss' ? '♛ Boss gauntlet' : topic === 'Sketch' ? '✏ Curve drawing' : topic;
		const code = featured ? ['MIX', 'BOSS', 'DRAW'][idx] : String(idx + 1).padStart(2, '0');
		const s = state.stats[topic];
		const accuracy = s?.attempted ? Math.round(s.correct / s.attempted * 100) : null;
		const progress = accuracy === null ? '' : `<div class="tc-progress"><span>${accuracy}% FIRST-TRY ACCURACY</span><span>${s.attempted} ATTEMPT${s.attempted === 1 ? '' : 'S'}</span><div class="bar"><div class="bar-fill" style="width:${accuracy}%"></div></div></div>`;
		const search = [topic, title, TOPIC_BLURBS[topic], ...subtopicsFor(topic)].join(' ').toLowerCase();
		return `<article class="test-card ${featured ? 'tc-featured' : ''}" data-topic="${topic}" data-search="${search}">
			<div class="tc-top"><span class="tc-code">${code}</span><span class="tc-diff" title="difficulty range">${diffSpan(i.dmin, i.dmax)}</span></div>
			<h4 class="tc-title">${title}</h4>
			<p class="tc-desc">${TOPIC_BLURBS[topic] || 'Worksheet-calibre generated questions with worked solutions.'}</p>
			<div class="tc-meta"><span>${i.count} QUESTION TYPES</span><span>${i.subs} SUBTOPIC${i.subs === 1 ? '' : 'S'}</span></div>
			${progress}
			<div class="tc-actions"><button class="btn tc-practice" aria-label="Practise ${title}">PRACTISE →</button><button class="btn btn-ghost tc-worksheet" aria-label="Create ${title} worksheet">WORKSHEET</button></div>
		</article>`;
	}

	function renderContinuePanel() {
		let topic = state.lastTopic;
		try { topic = localStorage.getItem('mg-last-topic') || topic; } catch { /* storage unavailable */ }
		const panel = $('#continue-panel');
		if (!topic || !TOPICS.includes(topic)) { panel.hidden = true; return; }
		const title = topic === 'All' ? 'Mixed paper' : topic;
		const s = state.stats[topic], detail = s?.attempted ? `${s.correct}/${s.attempted} correct on the first try` : 'Ready for another generated question';
		panel.innerHTML = `<div class="continue-mark" aria-hidden="true">↗</div><div><span class="continue-kicker">CONTINUE WHERE YOU LEFT OFF</span><h3>${title}</h3><p>${detail}</p></div><button id="continue-start" class="btn btn-primary">RESUME →</button>`;
		panel.hidden = false;
		$('#continue-start').addEventListener('click', () => startPractice(topic));
	}

	function filterMenu(query = '') {
		const needle = query.trim().toLowerCase();
		let visible = 0;
		$$('#menu-page .test-card').forEach((card) => {
			card.hidden = Boolean(needle) && !card.dataset.search.includes(needle);
			if (!card.hidden) visible++;
		});
		$('#topic-search-count').textContent = needle ? `${visible} result${visible === 1 ? '' : 's'}` : `${TOPICS.length} topics`;
		$('#topic-search-clear').hidden = !needle;
	}

	function renderMenu() {
		const featured = ['All', 'Boss', 'Sketch'].filter((t) => t === 'All' || TOPICS.includes(t));
		const regular = TOPICS.filter((t) => t !== 'All' && !featured.includes(t)).sort((a, b) => a.localeCompare(b));
		$('#menu-featured').innerHTML = featured.map((t, i) => menuCard(t, i, true)).join('');
		$('#menu-grid').innerHTML = regular.map((t, i) => menuCard(t, i, false)).join('');
		$$('#menu-page .test-card').forEach((card) => {
			card.addEventListener('click', (event) => { if (!event.target.closest('button')) startPractice(card.dataset.topic); });
			$('.tc-practice', card).addEventListener('click', () => startPractice(card.dataset.topic));
			$('.tc-worksheet', card).addEventListener('click', () => { startPractice(card.dataset.topic); createWorksheet(); });
		});
		renderContinuePanel();
		filterMenu($('#topic-search')?.value || '');
	}

	function startPractice(topic) {
		state.topic = topic;
		state.subtopic = 'All';
		state.bossSubtopic = 'All';
		state.lastTopic = topic;
		try { localStorage.setItem('mg-last-topic', topic); } catch { /* storage unavailable */ }
		// A topic change must never inherit a restrictive filter from another test.
		setDifficulty(0);
		$('#menu-page').hidden = true;
		$('#worksheet-page').hidden = true;
		$('#practice-page').hidden = false;
		renderTopics(); renderSubtopics();
		newQuestion();
		window.scrollTo(0, 0);
		$('#question-card').focus({ preventScroll: true });
	}

	function showMenu() {
		$('#practice-page').hidden = true;
		$('#menu-page').hidden = false;
		renderMenu();
		window.scrollTo(0, 0);
		$('.menu-title').focus({ preventScroll: true });
	}

	function subtopicsFor(topic) {
		const set = new Set(MG.generators.filter((g) => topic === 'All' || g.topic === topic).map((g) => topic === 'Boss' ? bossArea(g) : g.subtopic));
		return ['All', ...[...set].sort(compare)];
	}

	function pool() {
		return MG.generators.filter((g) =>
			(state.topic === 'All' || g.topic === state.topic) &&
			(state.subtopic === 'All' || (state.topic === 'Boss' ? bossArea(g) : g.subtopic) === state.subtopic) &&
			(state.topic !== 'Boss' || state.bossSubtopic === 'All' || g.subtopic === state.bossSubtopic) &&
			(state.difficulty === 0 || g.difficulty === state.difficulty));
	}

	// ---------- sidebar ----------
	function renderTopics() {
		const nav = $('#topics');
		nav.innerHTML = TOPICS.map((t) =>
			`<button class="topic-btn ${t === state.topic ? 'active' : ''} ${t === 'Boss' ? 'topic-boss' : ''}" data-topic="${t}">${t === 'Boss' ? '♛ Boss' : t === 'Sketch' ? '✏ Sketch' : t}</button>`).join('');
		$$('.topic-btn', nav).forEach((b) => b.addEventListener('click', () => {
			startPractice(b.dataset.topic);
		}));
	}

	function renderSubtopics() {
		const el = $('#subtopics');
		const subs = subtopicsFor(state.topic);
		$('label[for="subtopics"]').textContent = state.topic === 'Boss' ? 'BOSS SUBJECT' : 'SUBTOPIC';
		el.innerHTML = subs.map((s) => `<option value="${s}" ${s === state.subtopic ? 'selected' : ''}>${s === 'All' ? (state.topic === 'Boss' ? 'All Boss subjects' : 'All subtopics') : s}</option>`).join('');
		renderBossSubtopics();
	}

	function renderBossSubtopics() {
		const group = $('#boss-subtopic-group'), el = $('#boss-subtopics');
		const visible = state.topic === 'Boss' && state.subtopic !== 'All';
		group.hidden = !visible;
		if (!visible) { state.bossSubtopic = 'All'; return; }
		const subs = [...new Set(MG.generators.filter((g) => g.topic === 'Boss' && bossArea(g) === state.subtopic).map((g) => g.subtopic))].sort(compare);
		if (!subs.includes(state.bossSubtopic)) state.bossSubtopic = 'All';
		el.innerHTML = ['All', ...subs].map((s) => `<option value="${s}" ${s === state.bossSubtopic ? 'selected' : ''}>${s === 'All' ? 'All subtopics in subject' : s}</option>`).join('');
		$('#boss-subtopic-name').textContent = state.bossSubtopic === 'All' ? '' : state.bossSubtopic;
	}

	function renderStats() {
		const el = $('#stats');
		const entries = Object.entries(state.stats);
		if (!entries.length) { el.innerHTML = '<p class="muted">Answer questions to see your progress here.</p>'; return; }
		el.innerHTML = entries.map(([t, s]) => {
			const pct = s.attempted ? Math.round(s.correct / s.attempted * 100) : 0;
			return `<div class="stat-row"><span>${t}</span><span class="stat-nums">${s.correct}/${s.attempted}</span>
<div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div></div>`;
		}).join('');
	}

	function diffBadge(d) {
		return d >= 4 ? '<span class="badge badge-boss">♛ BOSS</span>' : `<span class="badge badge-diff" title="difficulty">${'★'.repeat(d)}${'☆'.repeat(3 - d)}</span>`;
	}

	// ---------- chat helpers ----------
	let chatEl = null;

	function bubble(role, html, cls = '') {
		const el = document.createElement('div');
		el.className = `bubble ${role} ${cls}`;
		el.innerHTML = role === 'bot'
			? `<span class="avatar">∑</span><div class="bubble-body">${html}</div>`
			: `<div class="bubble-body">${html}</div>`;
		chatEl.appendChild(el);
		// Moving the page while a sketch is being drawn shifts the canvas under
		// the pointer, especially when delayed feedback arrives after Clear.
		if (el.scrollIntoView && state.current?.q.answer.type !== 'sketch') el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		return el;
	}

	function botReply(html, cls, delay = 550) {
		const current = state.current;
		const t = bubble('bot', '<span class="tdot"></span><span class="tdot"></span><span class="tdot"></span>', 'typing');
		setTimeout(() => {
			t.remove();
			if (state.current !== current || (cls === 'hint-bubble' && current.solutionShown)) return;
			const reply = bubble('bot', html, cls);
			const announcer = $('#status-announcer');
			if (announcer) announcer.textContent = reply.textContent;
		}, delay);
	}

	// ---------- numbered worksheets: one snapshot, matching separate solutions ----------
	function worksheetAnswer(q, questionIndex) {
		const a = q.answer, id = `worksheet-answer-${questionIndex}`;
		let fields = '';
		if (a.type === 'numeric') {
			fields = `<label><span>${a.label || 'Answer'}</span><input data-part="0" type="text" inputmode="decimal" autocomplete="off"></label>`;
		} else if (a.type === 'multinumeric') {
			fields = a.values.map((_, i) => `<label><span>${a.labels[i]}</span><input data-part="${i}" type="text" inputmode="decimal" autocomplete="off"></label>`).join('');
		} else if (a.type === 'text') {
			fields = `<label><span>Answer</span><input data-part="0" type="text" autocomplete="off" placeholder="${a.placeholder || ''}"></label>`;
		} else if (a.type === 'mc') {
			fields = `<label><span>Selected option</span><select data-part="0"><option value="">Choose…</option>${a.choices.map((_, i) => `<option value="${i}">${'ABCD'[i]}</option>`).join('')}</select></label>`;
		} else {
			fields = `<label class="worksheet-manual"><input data-part="0" type="checkbox"><span>I checked my work against the solution and marked this correct</span></label>`;
		}
		return `<section class="worksheet-answer" id="${id}" data-question="${questionIndex}" data-type="${a.type}"><h3>YOUR ANSWER</h3><div class="worksheet-answer-fields">${fields}</div><p class="worksheet-result" role="status"></p></section>`;
	}

	function markWorksheet() {
		if (!state.worksheet) return;
		let correctParts = 0, totalParts = 0, fullQuestions = 0;
		state.worksheet.forEach(({ q }, i) => {
			const box = $(`.worksheet-answer[data-question="${i}"]`), controls = $$('[data-part]', box), a = q.answer;
			let results;
			if (a.type === 'numeric') {
				const value = parseNum(controls[0].value);
				results = [value === null ? null : Math.abs(value - a.value) <= (a.tolerance ?? 0.01)];
			} else if (a.type === 'multinumeric') {
				results = controls.map((control, part) => { const value = parseNum(control.value); return value === null ? null : Math.abs(value - a.values[part]) <= (a.tolerance ?? 0.01); });
			} else if (a.type === 'text') {
				const value = normalizeText(controls[0].value);
				results = [value ? a.accept.map(normalizeText).includes(value) : null];
			} else if (a.type === 'mc') {
				results = [controls[0].value === '' ? null : Number(controls[0].value) === a.correct];
			} else {
				results = [controls[0].checked ? true : null];
			}
			const right = results.filter((result) => result === true).length, answered = results.filter((result) => result !== null).length;
			correctParts += right; totalParts += results.length;
			const full = right === results.length;
			if (full) fullQuestions++;
			const article = box.closest('.worksheet-question');
			article.classList.toggle('worksheet-correct', full);
			article.classList.toggle('worksheet-partial', !full && right > 0);
			article.classList.toggle('worksheet-wrong', !full && answered > 0 && right === 0);
			$('.worksheet-result', box).textContent = !answered ? 'Not answered' : full ? `Correct — ${right}/${results.length}` : `${right}/${results.length} correct`;
		});
		$('#worksheet-score').textContent = `${fullQuestions}/${state.worksheet.length} questions fully correct · ${correctParts}/${totalParts} checked answers correct`;
		$('#worksheet-mark').textContent = 'Re-mark worksheet';
	}

	function createWorksheet() {
		const candidates = pool();
		if (!candidates.length) return;
		const seed = state.seedCounter++;
		const rng = MG.RNG(seed);
		const count = Math.min(Number($('#worksheet-count').value), candidates.length);
		const entries = rng.shuffle(candidates).slice(0, count).map((gen) => ({ gen, q: gen.gen(rng) }));
		entries.sort((a, b) => compare(a.gen.topic, b.gen.topic) ||
			compare(a.gen.subtopic, b.gen.subtopic) || a.gen.difficulty - b.gen.difficulty ||
			a.q.marks - b.q.marks || compare(a.gen.id, b.gen.id));
		const marks = entries.reduce((sum, entry) => sum + entry.q.marks, 0);
		state.worksheet = entries;
		const diagram = (q) => q.diagram ? `<figure class="diagram-wrap">${MG.diagram(q.diagram)}<figcaption>Diagram not to scale</figcaption></figure>` : '';
		$('#worksheet-content').innerHTML = `<div class="worksheet-heading">
			<p class="eyebrow">MATHGEN / WORKSHEET ${seed}</p><h1>${state.topic === 'All' ? 'Mixed' : state.topic} worksheet</h1>
			<p>${count} questions · ${marks} marks · ${state.difficulty === 4 ? 'Maximum difficulty / Boss' : state.difficulty === 0 ? 'All difficulties' : 'Difficulty ' + state.difficulty}</p>
			<p>Grouped by topic and subtopic. Show your reasoning and keep exact values until the final step.</p>
			<p class="name-line">Name: ________________________ &nbsp; Date: ______________</p>
			${count < Number($('#worksheet-count').value) ? '<p>All matching question types are included once; no repeats added to fill the paper.</p>' : ''}
		</div>` + entries.map(({ gen, q }, i) => `<article class="worksheet-question" data-generator="${gen.id}">
			<div class="worksheet-question-head"><h2>Question ${i + 1}</h2><span>${q.marks} marks</span></div>
			<p class="eyebrow">${gen.topic} / ${gen.subtopic}</p><div class="q-text">${q.text}</div>${diagram(q)}
			${q.answer.type === 'mc' ? `<ol type="A" class="worksheet-choices">${q.answer.choices.map((c) => `<li>${c}</li>`).join('')}</ol>` : ''}
			${q.answer.type === 'sketch' ? `<div class="diagram-wrap">${MG.diagram({ ...q.answer, type: 'graph', grid: true })}</div>` : ''}
			<div class="working-space" aria-label="Space for working"></div>
			${worksheetAnswer(q, i)}
		</article>`).join('') + `<section id="worksheet-key" ${$('#worksheet-solutions').checked ? '' : 'hidden'}>
			<h1>Worked solutions</h1><p>Answer key / worksheet ${seed}</p>` + entries.map(({ gen, q }, i) =>
			`<article class="worksheet-solution"><h2>Question ${i + 1} · ${gen.subtopic}</h2>${q.solution}</article>`).join('') + '</section>';
		$('#practice-page').hidden = true;
		$('#worksheet-page').hidden = false;
		$('#worksheet-mark').disabled = false;
		$('#worksheet-mark').textContent = 'Mark worksheet';
		$('#worksheet-score').textContent = '';
		window.scrollTo(0, 0);
		$('#worksheet-page').focus({ preventScroll: true });
	}

	// ---------- question flow ----------
	function newQuestion() {
		const p = pool();
		const card = $('#question-card');
		state.current = null;
		$('#worksheet-create').disabled = !p.length;
		if (!p.length) { card.innerHTML = '<h2>No matching questions</h2><p>There are no questions at this difficulty for the selected topic and subtopic. Choose another topic or explicitly change the difficulty. Easier questions will not be substituted.</p>'; return; }
		let seed = state.seedCounter++;
		const rng = MG.RNG(seed * 2654435761 % 4294967296);
		// avoid re-serving recently seen generators so consecutive questions feel fresh
		const recent = state.recent || (state.recent = []);
		const fresh = p.filter((g) => !recent.includes(g.id));
		const pickFrom = fresh.length ? fresh : p;
		const gen = pickFrom[Math.floor(rng.next() * pickFrom.length)];
		recent.push(gen.id);
		const requestedMemory = state.variety === 'maximum' ? 30 : state.variety === 'balanced' ? 10 : 0;
		const memory = Math.max(0, Math.min(requestedMemory, p.length - 1));
		while (recent.length > memory) recent.shift();
		let q;
		try { q = gen.gen(rng); } catch (e) { console.error(gen.id, e); return newQuestion(); }
		const recentPrompts = state.recentPrompts || (state.recentPrompts = []);
		let promptKey = questionKey(gen, q);
		for (let attempt = 1; requestedMemory && recentPrompts.includes(promptKey) && attempt < 12; attempt++) {
			seed = state.seedCounter++;
			try { q = gen.gen(MG.RNG(seed * 2654435761 % 4294967296)); } catch (e) { console.error(gen.id, e); return newQuestion(); }
			promptKey = questionKey(gen, q);
		}
		recentPrompts.push(promptKey);
		while (recentPrompts.length > requestedMemory) recentPrompts.shift();
		state.current = { gen, q, seed, solved: false, solutionShown: false };

		card.innerHTML = `
			<div class="q-anim">
				<div class="chat" id="chat"></div>
				<div id="input-bar"></div>
				<div class="q-actions">
					<button id="hint-btn" class="btn-link">Hint 💡</button>
					<button id="reveal-btn" class="btn-link">Show solution <span class="arr">→</span></button>
					<button id="next-btn" class="btn btn-primary">Next question</button>
				</div>
			</div>`;
		chatEl = $('#chat');

		const diagramHtml = q.diagram ? `<figure class="diagram-wrap">${MG.diagram(q.diagram)}<figcaption>Diagram not to scale</figcaption></figure>` : '';
		const meta = `<div class="q-meta">
			<span class="badge">${gen.topic}</span>
			<span class="badge badge-sub">${gen.subtopic}</span>
			<span class="badge badge-marks">${q.marks} mark${q.marks > 1 ? 's' : ''}</span>
			${diffBadge(gen.difficulty)}
		</div>`;

		let choicesHtml = '';
		if (q.answer.type === 'mc') {
			choicesHtml = `<div class="chat-choices">` + q.answer.choices.map((c, i) =>
				`<button class="chat-choice" data-i="${i}"><span class="mc-letter">${'ABCD'[i]}</span><span>${c}</span></button>`).join('') + `</div>`;
		}
		bubble('bot', `${meta}<div class="q-text">${q.text}</div>${diagramHtml}${choicesHtml}`);

		buildInputBar(q);

		if (q.answer.type === 'mc') {
			$$('.chat-choice', chatEl).forEach((b) => b.addEventListener('click', () => {
				if (state.current.solved) return;
				const i = Number(b.dataset.i);
				bubble('user', `<strong>${'ABCD'[i]}.</strong> ${q.answer.choices[i]}`);
				judge(i === q.answer.correct);
			}));
		}

		$('#reveal-btn').addEventListener('click', () => showSolution());
		$('#next-btn').addEventListener('click', newQuestion);
		setupHints(q);
		const first = $('#input-bar input'); if (first) first.focus({ preventScroll: true });
	}

	// ---------- progressive hints ----------
	// Hints are the working steps of the solution, revealed one at a time.
	// Steps containing <strong> are excluded because they carry the final answer,
	// so a hint can never reveal the result itself.
	function setupHints(q) {
		const btn = $('#hint-btn');
		const steps = (String(q.solution).match(/<p>[\s\S]*?<\/p>/g) || []).slice(0, -1)
			.filter((p) => !p.includes('<strong>'));
		if (!steps.length) { btn.style.display = 'none'; return; }
		state.current.hints = steps;
		state.current.hintIdx = 0;
		btn.addEventListener('click', () => {
			const cur = state.current;
			if (cur.solutionShown || cur.hintIdx >= cur.hints.length) return;
			const step = cur.hints[cur.hintIdx++];
			botReply(`<em>Hint ${cur.hintIdx} of ${cur.hints.length}:</em> ${step}`, 'hint-bubble');
			if (cur.hintIdx >= cur.hints.length) {
				btn.disabled = true;
				btn.textContent = 'No more hints';
			}
		});
	}

	// ---------- sketch pad (draw-the-curve questions) ----------
	// Geometry mirrors R.graph in diagrams.js: viewBox 360x260, padding 34.
	const SK = { strokes: [] };

	function initSketchPad(a) {
		SK.strokes = [];
		const svg = $('#sketch-pad svg');
		if (!svg) return;
		svg.classList.add('sketch-svg');
		const W = 360, H = 260, pad = 34;
		const toGraph = (e) => {
			const screen = svg.createSVGPoint();
			screen.x = e.clientX; screen.y = e.clientY;
			const { x: px, y: py } = screen.matrixTransform(svg.getScreenCTM().inverse());
			const x = a.xmin + (px - pad) / (W - 2 * pad) * (a.xmax - a.xmin);
			const y = a.ymin + (H - pad - py) / (H - 2 * pad) * (a.ymax - a.ymin);
			return [x, y];
		};
		const inside = ([x, y]) => x >= a.xmin && x <= a.xmax && y >= a.ymin && y <= a.ymax;
		const toPx = (p) => [pad + (p[0] - a.xmin) / (a.xmax - a.xmin) * (W - 2 * pad), H - pad - (p[1] - a.ymin) / (a.ymax - a.ymin) * (H - 2 * pad)];
		let cur = null, pathEl = null, pointer = null;
		const dOf = (stroke) => stroke.map((p, i) => `${i ? 'L' : 'M'} ${toPx(p)[0].toFixed(1)} ${toPx(p)[1].toFixed(1)}`).join(' ');
		svg.addEventListener('pointerdown', (e) => {
			if (cur || e.button !== 0 || state.current.solved) return;
			const p = toGraph(e);
			if (!inside(p)) return;
			e.preventDefault();
			svg.setPointerCapture(e.pointerId);
			pointer = e.pointerId;
			cur = [p];
			pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			pathEl.setAttribute('class', 'user-stroke');
			pathEl.setAttribute('fill', 'none');
			svg.appendChild(pathEl);
		});
		const finish = () => {
			if (cur && cur.length >= 2) SK.strokes.push(cur);
			else if (pathEl) pathEl.remove();
			cur = null; pathEl = null; pointer = null;
		};
		const append = (e) => {
			if (!cur || e.pointerId !== pointer) return;
			const p = toGraph(e), last = cur[cur.length - 1];
			if (!inside(p)) {
				// End at the plot boundary, rather than clamping a whole off-grid stroke.
				let t = 1;
				for (const [axis, lo, hi] of [[0, a.xmin, a.xmax], [1, a.ymin, a.ymax]]) {
					if (p[axis] < lo) t = Math.min(t, (lo - last[axis]) / (p[axis] - last[axis]));
					if (p[axis] > hi) t = Math.min(t, (hi - last[axis]) / (p[axis] - last[axis]));
				}
				cur.push([last[0] + t * (p[0] - last[0]), last[1] + t * (p[1] - last[1])]);
				pathEl.setAttribute('d', dOf(cur));
				finish();
				return;
			}
			cur.push(p);
			pathEl.setAttribute('d', dOf(cur));
		};
		svg.addEventListener('pointermove', (e) => {
			const events = e.getCoalescedEvents?.();
			for (const event of events?.length ? events : [e]) append(event);
		});
		svg.addEventListener('pointerup', (e) => { if (e.pointerId === pointer) { append(e); finish(); } });
		svg.addEventListener('pointercancel', (e) => { if (e.pointerId === pointer) finish(); });
		svg.addEventListener('lostpointercapture', (e) => { if (e.pointerId === pointer) finish(); });
	}

	function clearSketch() {
		SK.strokes = [];
		$$('#sketch-pad svg .user-stroke').forEach((p) => p.remove());
		$('#sketch-pad').classList.remove('shake');
		$('#sketch-features').classList.remove('shake');
		$('#sketch-feedback').textContent = '';
	}

	function sketchFields(a) {
		const asymptotes = a.asymptotes || {}, fields = [];
		if (asymptotes.vertical?.length) fields.push({ id: 'vertical', label: 'Vertical asymptote x-value(s)', expected: asymptotes.vertical, kind: 'list' });
		if (asymptotes.horizontal?.length) fields.push({ id: 'horizontal', label: 'Horizontal asymptote y-value(s)', expected: asymptotes.horizontal, kind: 'list' });
		if (asymptotes.oblique) {
			fields.push({ id: 'oblique-m', label: 'Oblique asymptote gradient m', expected: asymptotes.oblique[0], kind: 'number' });
			fields.push({ id: 'oblique-c', label: 'Oblique asymptote intercept c', expected: asymptotes.oblique[1], kind: 'number' });
		}
		if (asymptotes.parabolic) {
			['a', 'b', 'c'].forEach((name, i) => fields.push({ id: `parabolic-${name}`, label: `Parabolic asymptote coefficient ${name}`, expected: asymptotes.parabolic[i], kind: 'number' }));
		}
		if (!fields.length) fields.push({ id: 'asymptotes', label: 'Asymptotes', expected: [], kind: 'list' });
		fields.push({ id: 'x-intercepts', label: 'x-intercept value(s)', expected: a.xIntercepts, kind: 'list' });
		fields.push({ id: 'y-intercept', label: 'y-intercept value', expected: a.yIntercept === null ? [] : [a.yIntercept], kind: 'list' });
		return fields;
	}

	function buildInputBar(q) {
		const bar = $('#input-bar');
		const a = q.answer;
		if (a.type === 'sketch') {
			const fields = sketchFields(a);
			bar.innerHTML = `<div class="sketch-wrap">
				<div class="sketch-pad" id="sketch-pad">${MG.diagram({ type: 'graph', grid: true, xmin: a.xmin, xmax: a.xmax, ymin: a.ymin, ymax: a.ymax, xstep: a.xstep, ystep: a.ystep, degreesAxis: a.degreesAxis })}</div>
				<div class="sketch-features" id="sketch-features">
					<h3>STATE THE CURVE FEATURES</h3>
					<div class="sketch-feature-grid">${fields.map((field) => `<label><span>${field.label}</span><input id="sketch-${field.id}" type="text" inputmode="decimal" autocomplete="off" placeholder="${field.kind === 'list' ? 'Comma-separated, or none' : 'Value'}"></label>`).join('')}</div>
					<p class="hint">Use x-values for x-intercepts and y-values for y-intercepts. Fractions or decimals are accepted.</p>
				</div>
				<div class="sketch-actions">
					<button id="sketch-clear" class="btn-link">↺ Clear sketch</button>
					<button id="check-btn" class="btn btn-primary">Check curve + features</button>
				</div>
				<p class="hint center">Draw only the curve. Use separate strokes for separate branches; enter asymptotes below instead of drawing their guide lines.</p>
				<div id="sketch-feedback" class="hint" role="status" aria-live="polite"></div>
			</div>`;
			initSketchPad(a);
			$('#sketch-clear').addEventListener('click', clearSketch);
			$('#check-btn').addEventListener('click', check);
			$$('#sketch-features input').forEach((input) => input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); }));
			return;
		}
		if (a.type === 'mc') { bar.innerHTML = `<p class="hint center">Pick an option above.</p>`; return; }
		if (a.type === 'self') {
			bar.innerHTML = `<div class="chip-row">
				<button class="chip" id="self-show">Work it out on paper, then show the solution →</button>
			</div>`;
			$('#self-show').addEventListener('click', () => {
				showSolution();
				askSelfMark();
			});
			return;
		}
		if (a.type === 'numeric' || a.type === 'text') {
			const label = a.type === 'numeric' ? (a.label || 'answer') : 'answer';
			const ph = a.type === 'text' ? (a.placeholder || 'Type your answer…') : `Enter ${label}…`;
			bar.innerHTML = `<div class="chat-input" id="chat-input">
				<label class="sr-only" for="${a.type === 'numeric' ? 'num-0' : 'text-0'}">${label}</label>
				<input type="text" id="${a.type === 'numeric' ? 'num-0' : 'text-0'}" placeholder="${ph}" autocomplete="off" ${a.type === 'numeric' ? 'inputmode="decimal"' : ''}>
				<button id="check-btn" class="send-btn" title="Send answer">→</button>
			</div>
			${a.type === 'text' ? '<p class="hint center">Use ^ for powers and sqrt() for roots — spacing doesn\'t matter.</p>' : ''}`;
		} else if (a.type === 'multinumeric') {
			bar.innerHTML = `<div class="chat-input multi" id="chat-input">
				<div class="multi-grid">` + a.values.map((_, i) =>
					`<label class="multi-row"><span>${a.labels[i]}</span><input type="text" inputmode="decimal" id="num-${i}" autocomplete="off"></label>`).join('') +
				`</div>
				<button id="check-btn" class="send-btn" title="Send answers">→</button>
			</div>
			<p class="hint center">Fractions like 3/4 are fine.</p>`;
		}
		$('#check-btn').addEventListener('click', check);
		$$('#input-bar input').forEach((inp) => inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); }));
	}

	function normalizeText(s) {
		return s.toLowerCase()
			.replace(/\s+/g, '')
			.replace(/−|–/g, '-')
			.replace(/\*\*/g, '^')
			.replace(/√/g, 'sqrt')
			.replace(/[{}\[\]]/g, (m) => m === '{' || m === '[' ? '(' : ')');
	}

	function parseNum(s) {
		s = (s || '').trim().replace(/−|–/g, '-');
		if (/^-?\d+\s*\/\s*-?\d+$/.test(s)) {
			const [n, d] = s.split('/').map(Number), value = n / d;
			return Number.isFinite(value) ? value : null;
		}
		if (!/^-?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
		const value = Number(s.replace(/,/g, ''));
		return Number.isFinite(value) ? value : null;
	}

	function parseSketchList(raw) {
		const value = (raw || '').trim().toLowerCase();
		if (/^(none|no|n\/a|∅)$/.test(value)) return [];
		if (!value) return null;
		const tokens = value.match(/-?\d+(?:\.\d+)?(?:\s*\/\s*-?\d+(?:\.\d+)?)?/g) || [];
		const remainder = value.replace(/-?\d+(?:\.\d+)?(?:\s*\/\s*-?\d+(?:\.\d+)?)?/g, '').replace(/[;,\s]/g, '');
		if (!tokens.length || remainder) return null;
		return tokens.map(parseNum);
	}

	function checkSketchFeatures(a) {
		const tolerance = .035, details = [];
		for (const field of sketchFields(a)) {
			const raw = $(`#sketch-${field.id}`).value;
			if (field.kind === 'number') {
				const value = parseNum(raw);
				if (value === null) return null;
				details.push({ label: field.label, ok: Math.abs(value - field.expected) <= tolerance });
				continue;
			}
			const values = parseSketchList(raw);
			if (values === null || values.some((value) => value === null)) return null;
			const remaining = [...field.expected];
			const ok = values.length === remaining.length && values.every((value) => {
				const index = remaining.findIndex((expected) => Math.abs(value - expected) <= tolerance);
				if (index < 0) return false;
				remaining.splice(index, 1);
				return true;
			});
			details.push({ label: field.label, ok });
		}
		return { ok: details.every((detail) => detail.ok), details };
	}

	function nudgeInput() {
		const box = $('#chat-input') || $('#sketch-features') || $('#sketch-pad');
		if (!box) return;
		box.classList.remove('shake');
		void box.offsetWidth;
		box.classList.add('shake');
	}

	function check() {
		const { q } = state.current;
		if (state.current.solved) return;
		const a = q.answer;

		if (a.type === 'numeric') {
			const v = parseNum($('#num-0').value);
			if (v === null) { nudgeInput(); return; }
			bubble('user', `${a.label ? a.label + ': ' : ''}<strong>${$('#num-0').value.trim()}</strong>`);
			judge(Math.abs(v - a.value) <= (a.tolerance ?? 0.01));
		} else if (a.type === 'multinumeric') {
			const raw = a.values.map((_, i) => $(`#num-${i}`).value);
			const vals = raw.map(parseNum);
			if (vals.some((v) => v === null)) { nudgeInput(); return; }
			bubble('user', a.labels.map((l, i) => `${l}: <strong>${raw[i].trim()}</strong>`).join('<br>'));
			judge(vals.every((v, i) => Math.abs(v - a.values[i]) <= (a.tolerance ?? 0.01)));
		} else if (a.type === 'text') {
			const rawV = $('#text-0').value;
			const v = normalizeText(rawV);
			if (!v) { nudgeInput(); return; }
			bubble('user', `<strong>${rawV.trim().replace(/</g, '&lt;')}</strong>`);
			judge(a.accept.map(normalizeText).includes(v));
		} else if (a.type === 'sketch') {
			const res = MG.scoreSketch(a, SK.strokes);
			const features = checkSketchFeatures(a);
			if (!res || !features) { nudgeInput(); return; }
			const intercept = (label, result) => `${label}: ${result.total ? `${result.hit}/${result.total} located` : 'none in this window'}${result.extra ? ' — unexpected axis crossing' : ''}`;
			$('#sketch-feedback').innerHTML = `<p>Curve coverage: ${Math.floor(res.cover * 100)}% (need 85%). Line accuracy: ${Math.floor(res.clean * 100)}% (need 90%).</p>
				<p>${intercept('X-intercepts', res.x)}. ${intercept('Y-intercept', res.y)}.</p>
				<p>Entered features: ${features.details.map((detail) => `${detail.label} ${detail.ok ? '✓' : '— check this entry'}`).join('; ')}.</p>
				<p>${!res.branchesOK ? 'A visible branch is missing or incomplete. ' : ''}${!res.x.ok || !res.y.ok ? 'Recheck where your curve crosses or touches each axis. ' : ''}${res.clean < .9 ? 'Remove stray lines or adjust the curve shape. ' : ''}${res.cover < .85 ? 'Extend the curve across the visible plotting area. ' : ''}${res.ok ? 'Curve and intercept checks passed. ' : ''}${features.ok ? 'Entered asymptotes and intercepts passed.' : 'Recheck the entered curve features.'}</p>`;
			if (res.ok && features.ok) {
				bubble('user', '✏️ <em>Submitted curve, asymptotes and intercepts for checking.</em>');
				judge(true);
			} else {
				// Detailed sketch feedback is already visible beside the drawing. Avoid
				// delayed chat bubbles that can arrive during a clear-and-redraw attempt.
				bumpStat(state.current.gen.topic, false);
			}
		}
	}

	function judge(ok) {
		const { q, gen } = state.current;
		const current = state.current;
		bumpStat(gen.topic, ok);
		if (ok) {
			state.current.solved = true;
			botReply(`✓ <strong>Correct!</strong> ${q.answerShown ? 'Answer: ' + q.answerShown : ''}`, 'feedback-good');
			setTimeout(() => { if (state.current === current) showSolution(true); }, 700);
		} else {
			botReply(`✗ Not quite — adjust your answer and send it again, or press <em>Show solution</em>.`, 'feedback-bad');
		}
	}

	function showSolution(silent) {
		const { q } = state.current;
		if (state.current.solutionShown) return;
		state.current.solutionShown = true;
		const hintBtn = $('#hint-btn'); if (hintBtn) hintBtn.style.display = 'none';
		const revealBtn = $('#reveal-btn'); if (revealBtn) revealBtn.hidden = true;
		if (q.answer.type !== 'self') {
			$$('#input-bar input, #input-bar button, .chat-choice').forEach((control) => { control.disabled = true; });
		}
		botReply(`<h3 class="sol-title">Worked solution</h3>${q.solution}`, 'solution-bubble', silent ? 750 : 550);
	}

	function askSelfMark() {
		const current = state.current;
		setTimeout(() => {
			if (state.current !== current) return;
			const barEl = $('#input-bar');
			barEl.innerHTML = `<div class="chip-row">
				<span class="hint">How did you go?</span>
				<button class="chip chip-good" id="self-right">✓ I got it right</button>
				<button class="chip chip-bad" id="self-wrong">✗ I got it wrong</button>
			</div>`;
			$('#self-right').addEventListener('click', () => { bumpStat(state.current.gen.topic, true); bubble('user', 'I got it right ✓'); botReply('Nice work! Hit <em>Next question</em> for another.', 'feedback-good'); barEl.innerHTML = ''; });
			$('#self-wrong').addEventListener('click', () => { bumpStat(state.current.gen.topic, false); bubble('user', 'I got it wrong ✗'); botReply('All good — read the solution closely and try a similar one next.', 'feedback-bad'); barEl.innerHTML = ''; });
		}, 1400);
	}

	// ripple origin for pill button press glow
	document.addEventListener('pointerdown', (e) => {
		const btn = e.target.closest('.btn, .chip, .send-btn, .chat-choice');
		if (!btn) return;
		const rect = btn.getBoundingClientRect();
		btn.style.setProperty('--rx', `${((e.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
		btn.style.setProperty('--ry', `${((e.clientY - rect.top) / rect.height * 100).toFixed(1)}%`);
	});

	// ---------- init ----------
	renderMenu();
	renderTopics();
	renderSubtopics();
	renderStats();
	setVariety(state.variety, false);
	$$('.diff-btn').forEach((b) => {
		b.classList.toggle('active', Number(b.dataset.diff) === state.difficulty);
		b.setAttribute('aria-pressed', String(Number(b.dataset.diff) === state.difficulty));
	});
	$('#back-menu').addEventListener('click', showMenu);
	$('#worksheet-create').addEventListener('click', createWorksheet);
	$('#worksheet-new').addEventListener('click', createWorksheet);
	$('#worksheet-back').addEventListener('click', () => {
		$('#worksheet-page').hidden = true;
		$('#practice-page').hidden = false;
		window.scrollTo(0, 0);
		$('#question-card').focus({ preventScroll: true });
	});
	$('#worksheet-solutions').addEventListener('change', (e) => { $('#worksheet-key').hidden = !e.target.checked; });
	$('#worksheet-print').addEventListener('click', () => window.print());
	$('#worksheet-mark').addEventListener('click', markWorksheet);
	$('#subtopics').addEventListener('change', (e) => { state.subtopic = e.target.value; state.bossSubtopic = 'All'; renderBossSubtopics(); newQuestion(); });
	$('#boss-subtopics').addEventListener('change', (e) => { state.bossSubtopic = e.target.value; renderBossSubtopics(); newQuestion(); });
	$$('.diff-btn').forEach((b) => b.addEventListener('click', () => {
		setDifficulty(Number(b.dataset.diff));
		newQuestion();
	}));
	$$('.variety-option').forEach((button) => button.addEventListener('click', () => setVariety(button.dataset.variety)));
	$('#reset-stats').addEventListener('click', () => {
		if (!confirm('Reset all progress? This cannot be undone.')) return;
		state.stats = {}; saveStats(); renderStats();
		if (!$('#menu-page').hidden) renderMenu();
	});
	$('#topic-search').addEventListener('input', (event) => filterMenu(event.target.value));
	$('#topic-search').addEventListener('keydown', (event) => { if (event.key === 'Escape') { event.target.value = ''; filterMenu(); } });
	$('#topic-search-clear').addEventListener('click', () => { $('#topic-search').value = ''; filterMenu(); $('#topic-search').focus(); });
	document.addEventListener('keydown', (event) => {
		if (event.key === '/' && !$('#menu-page').hidden && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
			event.preventDefault(); $('#topic-search').focus();
		}
	});
	// count-up animation for the generator total
	(function () {
		const el = $('#gen-count'), total = MG.generators.length;
		if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = total; return; }
		const t0 = performance.now(), dur = 1100;
		(function tick(now) {
			const p = Math.min(1, (now - t0) / dur);
			el.textContent = Math.round(total * (1 - Math.pow(1 - p, 3)));
			if (p < 1) requestAnimationFrame(tick);
		})(t0);
	})();
})();
