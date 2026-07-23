# Stage 10.8 — Smart Sync + Menu Button

- Removed 1.5-second continuous polling.
- Immediate push remains after user changes.
- One forced refresh on launch, focus, reconnect, and returning from background.
- During the first minute: refresh every 20 seconds.
- Afterwards: refresh every 5 minutes while the app is actively used.
- Background and idle refreshes stop automatically.
- Added a centered SVG menu icon with improved button alignment and press feedback.
- Updated PWA cache versions.
