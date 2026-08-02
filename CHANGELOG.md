# 11.2.2

- Fixed Owner seasonal sticker testing toggle so the shop refreshes immediately.
- Added 40 animated Christmas Cozy stickers from the supplied pack.
- Added Lottie rendering with safe visual fallback.
- Updated PWA cache revision.

# 11.2.0

- У музеї показуються лише 5 останніх стікерів на телефоні та 10 на великих екранах.
- Натискання на стікер переводить у Колекції та відкриває потрібний альбом.
- Після відкриття боксу можна одразу відкрити наступний, якщо вистачає монет.
- У Owner Console додана помітна кнопка швидкого переходу до тестування сезонних стікерпаків.

# 11.1.6

- Added 50 animated stickers to the Halloween Cute collection.
- Added static WebP posters for faster album previews and mobile fallback.
- Enabled media paths for the Halloween collection.
- Updated PWA cache revision.

# 11.1.5

- Owner-only seasonal sticker testing switch.
- Easter Bunny renamed to Egg Party.
- Dates use day + month without year.
- Bunny Love animated stickers now include poster previews to prevent empty album cells.

# myHabbit 11.1.5

- Bunny Love розширено з 40 до 60 стікерів.
- Додано 20 нових статичних WebP-стікерів без зміни існуючих 40 анімованих.
- Нові стікери отримали нумерацію #041–#060 для колекції та подарунків.
- Оновлено кеш PWA.

# myHabbit 11.1.5

- Зафіксовано портретну орієнтацію для встановленої PWA.
- Виправлено висоту модальних вікон при відкритті клавіатури на iPhone/iPad.
- Поля вводу автоматично прокручуються у видиму частину екрана.
- Кнопки модальних форм залишаються доступними над клавіатурою.
- Оновлено кеш Service Worker.

# Changelog

## 11.1.5

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

## 11.2.2 — Egg Party & seasonal packs repair
- Added 62 animated Egg Party stickers converted from Telegram TGS to Lottie JSON.
- Fixed Christmas and Halloween collections not updating when an older saved session had the same item count but stale media paths.
- Built-in sticker collection definitions now reconcile on every app upgrade while user ownership remains preserved by sticker ID.
- Improved animated-sticker fallback and diagnostics.

## 11.2.3
- Collaborative family appearance progression with per-member contributions.
- Five unlockable family card themes; admin selects an unlocked style.
- Verified and strengthened Leave a Sticker and Level Rewards actions.
