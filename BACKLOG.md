# MadJax Learn — Backlog

## Planned

### High Priority
- [ ] Await `AudioContext.resume()` in audio.js for reliable first-interaction audio
- [ ] Add sound on/off toggle and volume control in hub
- [x] PWA support (manifest.json, service worker) for offline play
- [x] Firebase Realtime Database sync for cross-device progress
- [ ] Add `xmlns` attribute to mini avatar and star SVGs for strict compliance

### Medium Priority
- [ ] Parent dashboard — view stats, reset progress, manage profiles
- [ ] Achievements / badge system (e.g., "10 games played", "3-star streak")
- [ ] Streak tracking across games (daily play streaks)
- [ ] Animated transitions between hub and games
- [ ] Loading screen / splash animation on app start

### Low Priority
- [ ] More games per zone (expand beyond 2 per zone)
- [ ] Customizable avatars (colors, accessories)
- [ ] Leaderboard between Maddox and Jaxon
- [ ] Dark mode / theme toggle
- [ ] Haptic feedback on mobile (Vibration API)
- [ ] Accessibility audit (screen reader support, keyboard nav, ARIA labels)

## In Progress
- [ ] Firebase security rules (lock down to `/profiles/maddox` and `/profiles/jaxon` only)
- [ ] GitHub Pages deployment

## Completed

### 2026-03-24 (Session 2)
- [x] Firebase Realtime Database cloud sync (firebase-config.js, firebase-sync.js, storage.js changes)
- [x] PWA manifest, service worker, iOS meta tags, PWA icons
- [x] Offline-first with last-write-wins conflict resolution
- [x] Batch mode in recordGameResult to avoid double Firebase writes

### 2026-03-24
- [x] Complete app rebuild as pure HTML/CSS/JS
- [x] 10 Sonic-themed educational games across 5 zones
- [x] Player selection with SVG avatars
- [x] XP / leveling system (50 levels)
- [x] Star rating per game (1-3 stars)
- [x] Daily ring tracking
- [x] Difficulty scaling per player (Maddox harder, Jaxon easier)
- [x] Full 3-pass audit: core modules, all games, CSS/HTML
- [x] Fix 9 bugs (timer leaks, memory leaks, double-tap, null safety, NaN guard, level cap)
- [x] Project documentation (CLAUDE.md, ERRORS.md, HANDOFFS.md, BACKLOG.md, SKILLS.md)
