# Stage 9.6 Diagnostic Clean Boot

This build intentionally replaces the normal application screen with a minimal ES5-compatible diagnostic page.
It does not start Telegram, API calls, localStorage, IndexedDB, the normal app, or a service worker.
It attempts to unregister all service workers and clear Cache Storage.

After deploy, open `/recovery-96.html?v=20260723` directly as a second independent test.
