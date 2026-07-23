# Stage 9.2 — Splash recovery hotfix

- App bundle renamed to `app92.js` so an old Service Worker cannot return a stale cached bundle.
- Service Worker renamed to `sw92.js` and cache version bumped.
- Added a hard splash watchdog that always releases the UI after 6 seconds.
- Existing `app.js` and `sw.js` are kept synchronized for future deployments.
