# Stage 10.12 — Achievement PNG Compatibility Fix

- Converted all achievement illustrations from WebP to normalized 192×192 PNG thumbnails.
- Removed ICC/WebP decoder dependence for Telegram and embedded browsers.
- Updated every achievement asset path to PNG.
- Bumped application and service-worker asset versions to 1201.
- Kept emoji fallback for missing assets.
