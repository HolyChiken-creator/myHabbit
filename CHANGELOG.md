# Changelog

## 11.1.2

- Fixed repeated Teddy message “Монетки чекають”.
- The coin reminder is now shown once per profile and eligibility cycle.
- The reminder resets only after the balance drops below 1000 coins and later reaches the threshold again.
- Updated PWA cache version.

## 11.1.0

- Підготовлена стабільна база для майбутніх Full та Update-only архівів.
- Зафіксовані постійні шляхи `public/assets/` і `public/assets/stickers/`.
- Додана автоматична перевірка структури перед deploy.
- Узгоджені версії у `package.json`, `VERSION` та `public/VERSION.txt`.
- Додані правила Git, документація структури й процесу патчів.
- Прибрані системні файли `desktop.ini`.

## 11.1.1
- Fixed coin transfer normalize error.
- Sticker reveals now use collection numbers.
- Family Activity strictly isolated by familyId and ignores legacy demo events.
- Reduced Match-3 mobile animation load.
