# myHabbit — підключення Telegram-бота

## 1. GitHub Secrets

У репозиторії `myHabbit` відкрийте:

`Settings → Secrets and variables → Actions → New repository secret`

Додайте три секрети:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `TELEGRAM_BOT_TOKEN`

Не записуйте токен у `wrangler.jsonc`, `.dev.vars.example`, JavaScript або README.

## 2. Запуск деплою

Завантажте файли в гілку `main`. Workflow `.github/workflows/deploy.yml`:

1. перевірить JavaScript;
2. перевірить токен через Telegram `getMe`;
3. отримає username нового бота;
4. розгорне Cloudflare Worker `myhabbit`;
5. збереже Telegram-дані як encrypted secrets;
6. встановить webhook;
7. створить кнопку Mini App з назвою `myHabbit`;
8. встановить команди бота.

## 3. Локальний запуск

Скопіюйте `.dev.vars.example` у `.dev.vars` і заповніть значення тільки локально. Файл `.dev.vars` уже має бути в `.gitignore`.

## Безпека

Якщо Telegram-токен був опублікований або переданий у відкритому місці, перевипустіть його через BotFather і замініть GitHub Secret `TELEGRAM_BOT_TOKEN`.
