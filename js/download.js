(() => {
  const GITHUB_OWNER = 'LoJaeggli09';
  const GITHUB_REPO = 'FormaTrack';

  const btn = document.querySelector('.download-cta');
  if (!btn) return;
  const label = btn.querySelector('.download-label');
  const versionEls = document.querySelectorAll('.download-version');
  const t = (key, fallback) => (window.FTI18n ? window.FTI18n.t(key) : fallback);

  const setBusy = (busy) => {
    btn.classList.toggle('is-loading', busy);
    if (busy) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
  };

  const pickAsset = (release) => {
    const assets = Array.isArray(release.assets) ? release.assets : [];
    return assets.find((a) => /\.(exe|msi)$/i.test(a.name)) || assets[0];
  };

  const main = async () => {
    setBusy(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const release = await res.json();
      const asset = pickAsset(release);
      if (!asset) throw new Error('Nessun asset trovato nella release più recente.');

      btn.href = asset.browser_download_url;
      btn.setAttribute('download', asset.name);
      const tag = (release.tag_name || '').trim();
      if (tag) versionEls.forEach((el) => { el.textContent = `FormaTrack ${tag}`; });
    } catch (err) {
      // Fallback: il link resta sulla pagina "latest release" di GitHub.
      console.error(err);
      btn.title = t('download.fallbackError', 'Impossibile contattare GitHub al momento.');
    } finally {
      setBusy(false);
    }
  };

  document.addEventListener('DOMContentLoaded', main);
})();
