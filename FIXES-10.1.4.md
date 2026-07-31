# myHabbit 10.1.4 — Cloudflare declarative exports hotfix

- Restored the required declarative `exports` configuration for `TelegramStateV2`.
- The update-only archive now includes `wrangler.jsonc`, so an older repository cannot keep the legacy `migrations` flow by accident.
- No user data or Durable Object storage is reset.
