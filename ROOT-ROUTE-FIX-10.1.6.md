# myHabbit 10.1.6 — Root Route Fix

- restored `public/index.html`;
- forced `/` and `/index.html` through the Worker;
- explicitly serves `/index.html` from `env.ASSETS`;
- added root asset status logs and diagnostic headers;
- disables caching for the entry HTML;
- leaves Owner Console, API, Durable Objects and Telegram logic unchanged.
