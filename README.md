# The Growth–Emissions Divide

A D3.js narrative visualization (martini-glass structure) built for CS416, tracking how GDP per capita and CO2 emissions per capita have moved together — and apart — across countries from 1990 to 2022, using World Bank World Development Indicators data.

## Structure

- `index.html` — the site
- `css/style.css` — styling
- `js/` — application code (`state.js`, `scenes.js`, `chart.js`, `annotations.js`, `tooltip.js`, `main.js`)
- `lib/` — vendored D3 v7 and d3-annotation (no CDN dependency)
- `data/wdi_growth_emissions.json` — preprocessed dataset actually shipped to the browser
- `preprocess/build_data.py` — one-time script that produces `data/wdi_growth_emissions.json` from the raw WDI CSV export (not included in this repo — see script header)

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000/ in a browser.

## Deploy to GitHub Pages

1. `git init` (if not already) and commit these files.
2. Push to a GitHub repo.
3. In the repo's Settings → Pages, set Source to "Deploy from a branch", branch `main`, folder `/ (root)`.
4. The site will be live at `https://<username>.github.io/<repo>/`.
