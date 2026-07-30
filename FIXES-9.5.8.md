# myHabbit 9.5.8 — Durable Object exports fix

- Added declarative `exports.TelegramStateV2` configuration for Wrangler 4.115+.
- Removed the legacy repeated `migrations` block that caused Cloudflare errors 10065 and 10061.
- Kept the existing `TELEGRAM_STATE` binding and SQLite storage declaration.
- Updated version marker to 9.5.8.
