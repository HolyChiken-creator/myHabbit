# myHabbit 10.1.5 — Server diagnostics

Added public diagnostic endpoints:

- `/api/diagnostic`
- `/__diagnostic`

Each request now writes a structured `[myHabbit request]` line to Cloudflare Worker logs.
The diagnostic endpoint writes `[myHabbit diagnostic result]` and returns JSON with:

- deployed version and unique marker;
- confirmation that the Worker was reached;
- presence of ASSETS and TELEGRAM_STATE bindings;
- Durable Object probe status;
- request ID and server timestamp.

If opening `/api/diagnostic` produces Cloudflare 404 and no log entry, the request never reached this Worker, so the issue is deployment/domain routing rather than application code.
