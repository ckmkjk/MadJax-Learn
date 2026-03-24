# MadJax Learn — Handoffs

## Last Session: 2026-03-24 (Session 2)

### What Was Done
1. **Firebase Realtime Database sync** — Added cloud sync so player progress follows across devices. New files: `js/firebase-config.js`, `js/firebase-sync.js`. Modified `js/storage.js` with import, `lastModified` field, sync in `saveData()`, remote update handler, batch mode, and `init()` method.
2. **PWA support** — Added `manifest.json`, `sw.js` (service worker), PWA icons in `icons/`, and iOS meta tags in `index.html`. App can now be "Add to Home Screen" on iPads.
3. **Offline-first architecture** — localStorage remains primary store. Firebase syncs when online using last-write-wins with `lastModified` timestamps. 3-second timeout on init so offline startup is never blocked.
4. **Zero game changes** — All 10 game modules unchanged. Only storage.js, app.js, and index.html modified.

### Current State
- All 10 games functional
- Firebase sync integrated (requires Firebase project config)
- PWA ready for iOS home screen install
- 19/19 JS files pass syntax check (2 new files added)
- Branch: `claude/kids-learning-game-app-KwAMU`

### Key Decisions
- **Firebase Realtime Database over Firestore**: Simpler SDK, smaller download, sufficient for 2 players
- **CDN ES module imports**: Firebase SDK loaded from `gstatic.com` — no npm/build tools needed
- **Last-write-wins conflict resolution**: `lastModified` timestamp on each profile, with echo suppression via `_lastPushedTimestamp`
- **Batch mode in recordGameResult**: Prevents double Firebase writes (addXP + recordGameResult both call saveData)
- **Service worker at root**: Cache-first for app shell, network-first for Firebase SDK/data

### Remaining User Steps
1. Set Firebase Realtime Database security rules (lock to `/profiles/maddox` and `/profiles/jaxon`)
2. Enable GitHub Pages deployment
3. Test on iPads with "Add to Home Screen"

### Previous Session: 2026-03-24
1. Complete rebuild as pure HTML/CSS/JS with 10 games
2. 3-pass audit, 9 bug fixes
3. Documentation created (CLAUDE.md, ERRORS.md, BACKLOG.md, SKILLS.md, HANDOFFS.md)
