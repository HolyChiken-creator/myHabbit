# myHabbit 11.2.0 — Sticker Flow & Compact Museum

Це єдина базова структура проєкту для GitHub, Cloudflare Workers і наступних update-only патчів.

## Головні правила структури

- `src/worker.js` — активний Cloudflare Worker, API та Durable Object.
- `public/` — єдиний корінь PWA та статичних ресурсів.
- `public/assets/` — зображення, досягнення та інші ресурси.
- `public/assets/stickers/` — постійне розташування стікерпаків; шлях не переносити.
- `public/content/` — JSON-каталоги квестів, досягнень, магазину й щоденних завдань.
- `public/icons/` — PWA-іконки та локальні SVG.
- `docs/` — документація структури й правил патчів.
- `scripts/` — локальні перевірки перед Pull Request та deploy.

Не створюйте дублікати `index.html`, `app.js`, `styles.css` або `sw.js` у корені репозиторію. Їхнє робоче місце — тільки `public/`.

## Перевірка

```bash
npm install
npm run check
npm run validate
```

## Deploy

```bash
npm run deploy
```

`predeploy` автоматично перевіряє синтаксис Worker і структуру проєкту.

## Update-only патчі

Патч розпаковується поверх попередньої стабільної версії у новому Git branch. Він повинен містити тільки нові та змінені файли зі збереженням їхніх шляхів. Правила описані у `docs/PATCHING.md`.
