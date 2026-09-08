(function () {
  const root = document.documentElement;
  const symbols = ['∑', '∫', '∬', 'π', '√', '∞', 'Δ', 'θ', 'φ', '≈', '≠', '±', '∂', 'λ', '≤', '≥', '∝', '∈', '⊂', '∪', '∩', '∀', '∃', 'α', 'β', 'γ', 'σ', 'μ', 'Ω', 'ℝ', 'ℤ', 'ℕ', 'ƒ′', 'x²'];
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stopBackground = () => {};
  let pointer = null;

  function stored(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
  }
  function preferredTheme() {
    const saved = stored('mg-theme', '');
    return saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function preferredBackground() {
    const saved = stored('mg-background', 'drift');
    return saved === 'pit' ? 'pit' : 'drift';
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  }
  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    if (persist) save('mg-theme', theme);
  }

  function makeGlyph(className = '') {
    const glyph = document.createElement('span');
    glyph.className = `math-glyph ${className}`.trim();
    glyph.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    return glyph;
  }

  function createDrift(bg) {
    bg.className = 'symbol-drift';
    for (let i = 0; i < 42; i++) {
      const glyph = makeGlyph();
      const duration = 30 + Math.random() * 38;
      const twinkle = 3 + Math.random() * 7;
      glyph.style.cssText = `top:${Math.random() * 97}%;font-size:${12 + Math.random() * 34}px;animation-duration:${duration}s,${twinkle}s;animation-delay:${-Math.random() * duration}s,${-Math.random() * twinkle}s;--rise:${-24 + Math.random() * 48}px`;
      bg.appendChild(glyph);
    }
  }

  function createPit(bg) {
    bg.className = 'symbol-pit';
    const bodies = [];
    const count = reduced ? 48 : 74;
    for (let i = 0; i < count; i++) {
      const glyph = makeGlyph('pit-glyph');
      const size = 14 + Math.random() * 26;
      const body = {
        el: glyph,
        size,
        x: Math.random() * Math.max(1, innerWidth - size),
        y: innerHeight * (.54 + Math.random() * .42),
        vx: 0,
        vy: 0,
        spin: -10 + Math.random() * 20,
      };
      glyph.style.fontSize = `${size}px`;
      bg.appendChild(glyph);
      bodies.push(body);
    }

    let frame = 0;
    function draw() {
      const width = innerWidth, floor = innerHeight - 8;
      for (const body of bodies) {
        if (!reduced) {
          if (pointer) {
            const dx = body.x + body.size / 2 - pointer.x;
            const dy = body.y + body.size / 2 - pointer.y;
            const distance = Math.hypot(dx, dy) || 1;
            if (distance < 125) {
              const force = (125 - distance) / 125 * 2.2;
              body.vx += dx / distance * force;
              body.vy += dy / distance * force - .12;
            }
          }
          body.vy += .045;
          body.vx *= .982;
          body.vy *= .986;
          body.x += body.vx;
          body.y += body.vy;
          if (body.x < 2) { body.x = 2; body.vx = Math.abs(body.vx) * .62; }
          if (body.x + body.size > width - 2) { body.x = width - body.size - 2; body.vx = -Math.abs(body.vx) * .62; }
          if (body.y + body.size > floor) { body.y = floor - body.size; body.vy = -Math.abs(body.vy) * .38; body.vx *= .9; }
          if (body.y < innerHeight * .35) { body.y = innerHeight * .35; body.vy = Math.abs(body.vy) * .4; }
          body.spin += body.vx * .22;
        }
        body.el.style.transform = `translate3d(${body.x.toFixed(1)}px,${body.y.toFixed(1)}px,0) rotate(${body.spin.toFixed(1)}deg)`;
      }
      if (!reduced && root.dataset.background === 'pit') frame = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (frame) cancelAnimationFrame(frame); };
  }

  function applyBackground(mode, persist = true) {
    const bg = document.getElementById('math-bg');
    if (!bg) return;
    stopBackground();
    stopBackground = () => {};
    bg.replaceChildren();
    bg.removeAttribute('style');
    root.dataset.background = mode;
    if (mode === 'pit') stopBackground = createPit(bg);
    else createDrift(bg);
    if (persist) save('mg-background', mode);
    document.querySelectorAll('.background-option').forEach((button) => {
      const active = button.dataset.background === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  applyTheme(preferredTheme(), false);
  root.dataset.background = preferredBackground();

  document.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    const bg = document.getElementById('math-bg');
    if (!bg || root.dataset.background !== 'drift' || reduced) return;
    const dx = (event.clientX / innerWidth - .5) * 18;
    const dy = (event.clientY / innerHeight - .5) * 12;
    bg.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer = null; });

  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

    const dialog = document.getElementById('settings-dialog');
    const open = document.getElementById('settings-toggle');
    const close = document.getElementById('settings-close');
    if (open && dialog) open.addEventListener('click', () => dialog.showModal());
    if (close && dialog) close.addEventListener('click', () => dialog.close());
    if (dialog) dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    document.querySelectorAll('.background-option').forEach((button) => {
      button.addEventListener('click', () => applyBackground(button.dataset.background));
    });
    applyBackground(preferredBackground(), false);
  });
})();
