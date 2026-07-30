# Stage 9.1 — Cloudflare root 404 fix

- Routes every request through the Worker with `assets.run_worker_first: true`.
- Explicitly serves `public/index.html` for `/`.
- Preserves `/api/*` handling.
- Adds SPA fallback to `index.html` for browser navigation routes.
- Returns a clear 503 diagnostic if the `ASSETS` binding is missing.
- Keeps all Stage 1–9 functionality and offline assets.
