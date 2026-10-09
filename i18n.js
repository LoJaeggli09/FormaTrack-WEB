(() => {
  const STORAGE_LANG = 'ft-lang';
  const DEFAULT_LANG = (window.FT_I18N && window.FT_I18N.default) || 'it';
  const DATA = (window.FT_I18N && window.FT_I18N.data) || {};

  // Lingua del browser (es. "de-CH" -> "de"), solo tra quelle supportate.
  // I crawler restano sulla lingua predefinita, così l'indicizzazione resta in italiano.
  const detectBrowserLang = () => {
    if (/bot|crawl|spider|slurp|lighthouse/i.test(navigator.userAgent || '')) return null;
    const prefs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
    for (const l of prefs) {
      const code = String(l || '').toLowerCase().split('-')[0];
      if (DATA[code]) return code;
    }
    return null;
  };

  const getLang = () => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG);
      if (saved && DATA[saved]) return saved;
    } catch (e) {}
    return detectBrowserLang() || DEFAULT_LANG;
  };

  const t = (key, lang) => {
    const dict = DATA[lang] || {};
    if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
    const fallback = DATA[DEFAULT_LANG] || {};
    return Object.prototype.hasOwnProperty.call(fallback, key) ? fallback[key] : key;
  };

  // persist = true solo quando la lingua è scelta dall'utente: il rilevamento
  // automatico non viene salvato, così segue il browser finché non si sceglie.
  const applyLang = (lang, persist = false) => {
    if (!DATA[lang]) lang = DEFAULT_LANG;

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'), lang);
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'), lang);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'), lang));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), lang));
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    if (persist) {
      try { localStorage.setItem(STORAGE_LANG, lang); } catch (e) {}
    }
  };

  window.FTI18n = {
    t: (key) => t(key, getLang()),
    getLang,
    applyLang
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (lang) applyLang(lang, true);
  });

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getLang());
  });
})();
