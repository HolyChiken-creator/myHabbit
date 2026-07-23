# Stage 10.11 — Achievement icon loading fix

- Added cache-busting to every achievement WebP.
- Replaced lazy loading with eager loading for visible achievement cards.
- Added an emoji fallback instead of empty white tiles.
- Service Worker now rejects HTML/SPA fallback responses for image URLs.
- Invalid cached achievement responses are removed automatically.
- Achievement artwork now uses `object-fit: contain`.
- Updated app, CSS and Service Worker versions to 1101.
