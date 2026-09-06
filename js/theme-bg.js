(function () {
  const root = document.documentElement;
  function preferredTheme() {
    try { const saved = localStorage.getItem('mg-theme'); if (saved) return saved; } catch { /* unavailable */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    if (persist) { try { localStorage.setItem('mg-theme', theme); } catch { /* unavailable */ } }
  }
  applyTheme(preferredTheme(), false);
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
    const bg = document.getElementById('math-bg');
    if (!bg) return;
    const glyphs = ['∑', '∫', 'π', '√', '∞', 'Δ', 'θ', 'φ', '≈', '±', '∂', 'λ', '≤', '∝'];
    for (let i = 0; i < 22; i++) {
      const glyph = document.createElement('span');
      glyph.className = 'math-glyph';
      glyph.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      const duration = 38 + Math.random() * 32;
      const twinkle = 4 + Math.random() * 6;
      glyph.style.cssText = `top:${Math.random() * 96}%;font-size:${14 + Math.random() * 28}px;animation-duration:${duration}s,${twinkle}s;animation-delay:${-Math.random() * duration}s,${-Math.random() * twinkle}s;--rise:${-12 + Math.random() * 24}px`;
      bg.appendChild(glyph);
    }
    // gentle pointer parallax on the whole glyph field
    if (window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let raf = 0;
      document.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          const dx = (e.clientX / window.innerWidth - 0.5) * 14;
          const dy = (e.clientY / window.innerHeight - 0.5) * 10;
          bg.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        });
      }, { passive: true });
    }
  });
})();
