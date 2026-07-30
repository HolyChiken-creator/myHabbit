# Stage 9.5 Safe Boot
- Immediate synchronous render before any network request.
- Global visible error overlay for JavaScript errors and rejected promises.
- Unregisters old Service Workers and clears Cache Storage.
- Disables Service Worker registration in recovery build.
- Moves Telegram/session/server refresh to non-blocking background boot with timeout.
- Fixes questFromCatalog undefined variable (`i` -> `q`).
- Adds visible HTML fallback so a blank screen is impossible.
