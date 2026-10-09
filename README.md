# FormaTrack — Sito web

Sito vetrina ufficiale di **FormaTrack**, il gestionale gratuito per Windows dedicato a formatori e apprendisti (calendario, registro attività, prenotazioni, note e valutazioni). Il sito è pubblicato su **[formatrack.ch](https://formatrack.ch)** ed è realizzato in **HTML, CSS e JavaScript puri**: nessun framework, nessuna dipendenza npm e nessuno step di build.

> Il codice dell'applicazione desktop (Electron + React) si trova nel repository [LoJaeggli09/FormaTrack](https://github.com/LoJaeggli09/FormaTrack). Questo repository contiene **solo** il sito web.

---

## Pagine

| Pagina | File | Contenuto |
|---|---|---|
| Home | `index.html` | Presentazione del prodotto, ruoli, call to action al download |
| Funzionalità | `funzionalita.html` | Calendario, registro attività, prenotazioni, valutazioni |
| Anteprima | `anteprima.html` | Mockup dell'interfaccia dell'app |
| Download | `download.html` | Download dell'installer per Windows 10/11 |
| Supporto | `supporto.html` | FAQ e assistenza |
| Contatti | `contatti.html` | Contatti (`support@formatrack.ch`) |
| Privacy | `privacy.html` | Privacy Policy |

---

## Funzionalità principali

- **Sito statico**: ogni pagina è un file HTML autonomo, servibile da qualsiasi hosting statico (attualmente dietro **CloudFront**).
- **Multilingua**: Italiano (predefinito), English, Deutsch, Français. La lingua viene rilevata dal browser e la scelta dell'utente è salvata in `localStorage` (`ft-lang`). I crawler restano sempre sull'italiano, così l'indicizzazione rimane coerente.
- **Download automatico dell'ultima versione**: `js/download.js` interroga l'API GitHub Releases del repository dell'app e collega il pulsante direttamente all'installer `.exe`/`.msi` più recente, mostrando anche il numero di versione. Se l'API non risponde, il link resta sulla pagina "latest release" di GitHub.
- **SEO**: meta tag Open Graph / Twitter Card, URL canonici, dati strutturati JSON-LD (`Organization`, `WebSite`, `SoftwareApplication`), `sitemap.xml` e `robots.txt`.
- **Performance**: font self-hosted in formato `woff2` con `preload`, nessuna libreria esterna, icone SVG inline tramite `<symbol>`.
- **Responsive**: layout mobile-first con menu a scomparsa sotto i 960 px.
- **Accessibilità**: link "Vai al contenuto", menu richiudibile con `Esc`, attributi `aria-*`, rispetto di `prefers-reduced-motion`.

---

## Stack tecnologico

| Tecnologia | Uso |
|---|---|
| HTML5 | Struttura delle pagine |
| CSS3 (custom properties, grid, flexbox) | Stili e layout responsive (`css/site.css`) |
| JavaScript vanilla (ES2017+) | Menu mobile, traduzioni, download |
| Manrope / Source Sans 3 | Font self-hosted (titoli / testo) |
| GitHub Releases API | Recupero dell'ultima versione dell'app |

---

## Struttura progetto

```text
.
├── index.html                  # Home
├── funzionalita.html           # Funzionalità
├── anteprima.html              # Anteprima dell'app
├── download.html               # Download per Windows
├── supporto.html               # Supporto e FAQ
├── contatti.html               # Contatti
├── privacy.html                # Privacy Policy
├── favicon.ico                 # Favicon (deve restare in root)
├── robots.txt                  # Regole crawler (deve restare in root)
├── sitemap.xml                 # Sitemap per i motori di ricerca (deve restare in root)
├── TODO.md                     # Attività aperte
├── css/
│   └── site.css                # Foglio di stile unico del sito
├── js/
│   ├── site.js                 # Menu mobile (burger)
│   ├── i18n-data.js            # Traduzioni principali (it, en, de, fr)
│   ├── i18n-extra.js           # Traduzioni aggiuntive (unite a i18n-data.js)
│   ├── i18n.js                 # Motore i18n: rilevamento lingua, data-i18n, selettore
│   └── download.js             # Link dinamico all'ultima release GitHub
└── assets/
    ├── logo-mark.png           # Logo nell'header e nel footer
    ├── logo-completo.png       # Logo completo senza sfondo
    ├── icon-512.png            # Icona per i dati strutturati
    ├── favicon-32.png          # Favicon PNG
    ├── apple-touch-icon.png    # Icona iOS
    ├── og-image.png            # Immagine di anteprima per i social (1200×630)
    └── fonts/
        ├── manrope-latin.woff2
        └── source-sans-3-latin.woff2
```

> L'ordine degli script in fondo a ogni pagina è importante: `i18n-data.js` → `i18n-extra.js` → `i18n.js` → `site.js` (→ `download.js` solo in `download.html`).


---

## Guida sviluppatori

### Dove mettere una modifica

| Tipo | Dove |
|---|---|
| Nuovo testo tradotto | Attributo `data-i18n="chiave"` nell'HTML + chiave in `js/i18n-data.js` per **tutte e 4 le lingue** |
| Nuova pagina | Copiare una pagina esistente (head, header, footer), aggiornare `title`, `description`, `canonical`, `og:*`, aggiungerla alla navigazione di tutte le pagine e a `sitemap.xml` |
| Stili | `css/site.css` (usare le variabili CSS esistenti in `:root`) |
| Nuova immagine / icona | `assets/` |
| Nuovo font | `assets/fonts/` + `@font-face` in `css/site.css` + `preload` nelle pagine |
| Repository della release scaricata | Costanti `GITHUB_OWNER` / `GITHUB_REPO` in `js/download.js` |

### Convenzioni

- Percorsi **relativi** per risorse interne (`css/…`, `js/…`, `assets/…`); percorsi **assoluti** (`https://formatrack.ch/…`) solo per meta tag social, canonical e JSON-LD.
- Nessuno spazio nei nomi dei file.
- Ogni nuova chiave i18n va aggiunta in **tutte e 4 le lingue** (it, en, de, fr); in mancanza viene usato l'italiano.
- Il testo italiano resta anche direttamente nell'HTML, così la pagina è leggibile e indicizzabile anche senza JavaScript.
- Aggiornare questo README quando cambia la struttura dei file o si aggiunge una pagina.

---

## Troubleshooting

| Problema | Soluzione |
|---|---|
| Stili o font non caricati | Verificare che le cartelle `css/` e `assets/fonts/` siano state pubblicate e che i percorsi siano relativi |
| Testo mostrato come chiave (es. `nav.download`) | La chiave manca in `js/i18n-data.js` sia nella lingua scelta sia in italiano |
| Il pulsante di download apre la pagina GitHub invece dell'installer | Limite di richieste dell'API GitHub o release senza asset `.exe`/`.msi`: controllare la console del browser |
| Modifiche non visibili online | Invalidare la cache CloudFront (`/*`) |
| Lingua "bloccata" | Rimuovere la chiave `ft-lang` dal `localStorage` del browser |

---

## Prossimi passi consigliati

Vedi anche [`TODO.md`](TODO.md).

- [ ] Sostituire i mockup HTML con screenshot reali dell'app (home e `anteprima.html`)
- [ ] Verificare il dominio canonico (`https://formatrack.ch`) in sitemap, canonical e `og:url`
- [ ] Creare la pagina Termini di utilizzo
- [ ] Unire `i18n-extra.js` in `i18n-data.js` per avere un solo file di traduzioni
