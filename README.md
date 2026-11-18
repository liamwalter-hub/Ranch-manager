# Ranch Manager

A real-time, decision-based ranch management sim. You've bought Thistle Creek Ranch in Montana and inherited its staff: run it like an employer.

- Design docs: [`design/`](design/) (start with `game-concept-and-design.md`; the build plan is `tech-plan.md`)
- Play: https://liamwalter-hub.github.io/Ranch-manager/

## Playing on an Android phone
1. Open the link above in Chrome.
2. Tap ⋮ → **Add to Home screen** (or **Install app**).
3. Launch it from the home screen. It works offline.
4. When a new version is deployed, a "New version available" banner appears; tap it to reload.

## Developing
```
npm install
npm run dev       # local dev server
npm test          # engine tests
npm run build     # production build into dist/
```
Every push to `main` or a `ccr-*` branch builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).
