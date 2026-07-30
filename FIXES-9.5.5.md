# myHabbit 9.5.5 — Stability Repair

- Rebuilt from the last stable 9.5.3 base.
- Removed the risky inline image error handler introduced in 9.5.4.
- Activity icon paths are rendered only as image sources, never as visible text.
- Missing activity images fall back to an emoji through a delegated error listener.
- Escaped activity text and timestamps.
- Updated PWA cache version.
- ZIP root matches the Cloudflare repository root.
