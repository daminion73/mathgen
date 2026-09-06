// MathGen utilities: seeded RNG + math HTML formatting
window.MG = window.MG || {};

MG.RNG = function (seed) {
	let s = seed >>> 0;
	return {
		next() {
			// mulberry32
			s |= 0; s = (s + 0x6D2B79F5) | 0;
			let t = Math.imul(s ^ (s >>> 15), 1 | s);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		},
		int(lo, hi) { return lo + Math.floor(this.next() * (hi - lo + 1)); },
		pick(arr) { return arr[Math.floor(this.next() * arr.length)]; },
		shuffle(arr) {
			const a = arr.slice();
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(this.next() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
			}
			return a;
		},
		sign() { return this.next() < 0.5 ? -1 : 1; },
		nonzeroInt(lo, hi) { let v = 0; while (v === 0) v = this.int(lo, hi); return v; },
	};
};

// ---- math formatting helpers (HTML, offline, no libs) ----
MG.fmt = {
	sup(s) { return `<sup>${s}</sup>`; },
	sub(s) { return `<sub>${s}</sub>`; },
	// stacked fraction
	frac(n, d) { return `<span class="frac"><span class="num">${n}</span><span class="den">${d}</span></span>`; },
	sqrt(x) { return `<span class="sqrt">&radic;<span class="rad">${x}</span></span>`; },
	deg(x) { return `${x}&deg;`; },
	// coefficient formatting: co(1,'x') -> 'x', co(-1,'x') -> '-x', co(3,'x') -> '3x'
	co(c, v) {
		if (c === 0) return '';
		if (c === 1) return v;
		if (c === -1) return '-' + v;
		return c + v;
	},
	// signed term for appending: st(3,'x') -> ' + 3x', st(-3,'x') -> ' - 3x'
	st(c, v) {
		if (c === 0) return '';
		const abs = Math.abs(c);
		const term = v ? (abs === 1 ? v : abs + v) : String(abs);
		return (c > 0 ? ' + ' : ' &minus; ') + term;
	},
	// leading term: lt(-2,'x') -> '-2x'
	lt(c, v) {
		if (c === 0) return '0';
		const abs = Math.abs(c);
		const term = v ? (abs === 1 ? v : abs + v) : String(abs);
		return (c < 0 ? '&minus;' : '') + term;
	},
	// polynomial string from coefficient array [a,b,c] => ax^2+bx+c
	poly(coeffs, variable = 'x') {
		const n = coeffs.length - 1;
		let out = '';
		coeffs.forEach((c, i) => {
			const p = n - i;
			if (c === 0) return;
			const v = p === 0 ? '' : (p === 1 ? variable : `${variable}<sup>${p}</sup>`);
			out += out === '' ? MG.fmt.lt(c, v) : MG.fmt.st(c, v);
		});
		return out || '0';
	},
	num(x, dp = 2) {
		const r = Math.round(x * 10 ** dp) / 10 ** dp;
		return String(r);
	},
	// x-coordinate pair
	pt(x, y) { return `(${x}, ${y})`; },
};

// gcd for simplifying
MG.gcd = function g(a, b) { a = Math.abs(a); b = Math.abs(b); return b ? g(b, a % b) : a; };

// simplify surd: n -> [k, r] with sqrt(n) = k*sqrt(r)
MG.simplifySurd = function (n) {
	let k = 1, r = n;
	for (let i = 2; i * i <= r; i++) {
		while (r % (i * i) === 0) { r /= i * i; k *= i; }
	}
	return [k, r];
};

// format fraction reduced: returns HTML
MG.fracReduced = function (n, d) {
	const g = MG.gcd(n, d);
	n /= g; d /= g;
	if (d < 0) { d = -d; n = -n; }
	if (d === 1) return String(n);
	if (n < 0) return `&minus;${MG.fmt.frac(-n, d)}`;
	return MG.fmt.frac(n, d);
};

MG.round = (x, dp) => Math.round(x * 10 ** dp) / 10 ** dp;
MG.degToRad = (d) => d * Math.PI / 180;
