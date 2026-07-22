# myHabbit 2.0

Приватна сімейна PWA для 2–5 людей: спільні квести, особисті навички, досягнення та магазин реальних можливостей.

## Готові екрани
- лендінг для ПК;
- головна панель;
- особисті, спільні, парні й лімітовані квести;
- створення власних квестів;
- спільний магазин з обмеженим запасом;
- персональні й колективні покупки;
- колекція досягнень;
- профілі інших учасників зі статусом виконаного;
- сімейна стрічка активності;
- ручний калькулятор калорій без зовнішньої бази;
- PWA-режим.

Повна технічна схема: [ARCHITECTURE.md](ARCHITECTURE.md).


## GitHub і Cloudflare

- GitHub-репозиторій: `myHabbit`
- Cloudflare Worker: `myhabbit`
- GitHub Actions автоматично розгортає Worker із гілки `main`.

У **GitHub → Settings → Secrets and variables → Actions** додайте:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `TELEGRAM_BOT_TOKEN`

Telegram-токен не зберігається у файлах проєкту. Workflow передає його в Cloudflare як encrypted secret і автоматично налаштовує webhook, меню Mini App та команди бота.
