# myHabbit 9.4 — Owner Console

- Закрита зовнішня панель: `/owner-console`.
- Доступ лише через secret `OWNER_PANEL_SECRET` (HttpOnly cookie).
- Онлайн рахується за heartbeat активних авторизованих профілів за останні 2 хвилини.
- Показуються сімʼї, користувачі, ліміт і 30-денний графік.
- Кнопка мʼякого перезапуску очищає лише тимчасову присутність і rate-limit записи, перезапускає службову обробку; сімейні дані не видаляються.

## Cloudflare secrets

```bash
npx wrangler secret put OWNER_PANEL_SECRET
```

Опційно у `wrangler.jsonc` або Cloudflare Variables:

```json
"OWNER_MAX_FAMILIES": "50"
```

Для максимальної ізоляції додатково закрийте `/owner-console*` та `/api/owner/*` через Cloudflare Access.
