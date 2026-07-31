# myHabbit 10.1.7 — Brand asset fix

- Removed the duplicate root-level `index.html`; Cloudflare serves only `public/index.html`.
- Kept the canonical hero image at `public/assets/myhabbit-brand.webp`.
- Added a cache-busting version to the hero image URL.
- Added a backward-compatible Worker alias from `/myhabbit-brand.webp` to `/assets/myhabbit-brand.webp`.
- Updated deployment version and marker.
