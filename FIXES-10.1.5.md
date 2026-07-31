# myHabbit 10.1.5 — Stable Deploy Recovery

- Built from the current 10.1.4 feature set while preserving the same verified Worker and declarative Durable Object exports configuration as the known working build.
- Kept `workers_dev: true`, `exports.TelegramStateV2`, SQLite storage and existing Durable Object binding unchanged.
- Refreshed Service Worker cache namespace to prevent clients from remaining on stale 10.1.2 assets after deployment.
- Updated application asset query versions for a clean client refresh.
- Preserved Family Activity scrolling window, localization fixes and expanded cozy audio system.
- No Durable Object migration or data reset is included.
