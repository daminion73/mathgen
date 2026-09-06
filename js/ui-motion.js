// MathGen UI motion layer: scroll progress, compact header, reveal-on-scroll, footer wiring.
(function () {
	const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// ---------- scroll progress hairline ----------
	const progress = document.getElementById('scroll-progress');
	let ticking = false;
	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			ticking = false;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
			document.body.classList.toggle('scrolled', window.scrollY > 24);
		});
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	// ---------- reveal-on-scroll ----------
	const targets = document.querySelectorAll('.panel, #question-card, .features, .site-footer .f-col');
	if (!reduced && 'IntersectionObserver' in window) {
		const io = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
			});
		}, { threshold: 0.12 });
		targets.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
	}

	// ---------- footer wiring ----------
	const count = document.getElementById('f-gen-count');
	if (count && window.MG && MG.generators) count.textContent = MG.generators.length;
	const fTopics = document.getElementById('f-topics');
	if (fTopics && window.MG && MG.generators) {
		const topics = [...document.querySelectorAll('.topic-btn')].map((b) => b.dataset.topic).filter((t) => t !== 'All');
		fTopics.innerHTML = topics.map((t) => `<li><button class="f-topic-link" data-topic="${t}">${t}</button></li>`).join('');
		fTopics.addEventListener('click', (e) => {
			const b = e.target.closest('.f-topic-link');
			if (!b) return;
			const btn = document.querySelector(`.topic-btn[data-topic="${b.dataset.topic}"]`);
			if (btn) { btn.click(); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }
		});
	}
})();
