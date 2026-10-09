(() => {
  /* Menu mobile */
  const toggle = document.querySelector('.burger');
  const panel = document.getElementById('site-nav');
  if (toggle && panel) {
    const set = (open) => {
      panel.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => set(!panel.classList.contains('open')));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-in')) set(false);
    });
    window.matchMedia('(min-width:960px)').addEventListener('change', () => set(false));
  }
})();
