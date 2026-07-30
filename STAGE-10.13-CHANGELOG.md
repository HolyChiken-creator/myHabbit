# Stage 10.13 — PWA Experience & Shareable Backup

- One-time install onboarding with separate Telegram Mini App, iOS and Android/browser instructions.
- Telegram `addToHomeScreen()` support when available, plus browser install prompt fallback.
- Optional profile status: Telegram User, PWA User or Browser User.
- PWA installation reward: +100 XP and achievement “Завжди поруч”.
- Encrypted JSON backup can now be downloaded or shared through the device share sheet.
- Backup metadata upgraded to format version 2 while import remains compatible with existing encrypted backups.
- Drag-and-drop JSON import on supported browsers.
- Service worker and asset query versions bumped to avoid stale frontend files.
