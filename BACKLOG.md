# MadJax Learn — Backlog

## Planned

### High Priority
- [ ] Await `AudioContext.resume()` in audio.js for reliable first-interaction audio
- [ ] Add sound on/off toggle and volume control in hub

### Medium Priority
- [ ] Achievements / badge system (e.g., "10 games played", "3-star streak")
- [ ] Animated transitions between hub and games
- [ ] Loading screen / splash animation on app start
- [ ] More Pokemon-themed games (Pokemon Catch math game, Type Matchup reading game)

### Low Priority
- [ ] Customizable trainer avatars (colors, accessories)
- [ ] Leaderboard between Maddox and Jaxon
- [ ] Dark mode / theme toggle
- [ ] Haptic feedback on mobile (Vibration API)
- [ ] Accessibility audit (screen reader support, keyboard nav, ARIA labels)

## In Progress
- [ ] Firebase security rules (lock down to `/profiles/maddox` and `/profiles/jaxon` only)

## Completed

### 2026-03-24 (Session 3)
- [x] Fix Pattern Portal bug — display logic showed wrong sequence for Maddox (hard patterns)
- [x] Pokemon theme conversion — zones, avatars, colors, icons all Pokemon-themed
- [x] Jaxon first-grade difficulty bump — math to 20, CVC words, 4-letter words
- [x] New game: Floor is Lava — math + reading interactive platform game
- [x] Level progression system — 3 levels per game, unlock with 2+ stars
- [x] Admin/parent dashboard — PIN-protected (1234), view stats, reset progress
- [x] New Lava Badge Arena zone for adventure games
- [x] Updated service worker cache (v2) with new files
- [x] Added `xmlns` attribute to all SVGs (avatars.js)

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
- [x] GitHub Pages deployment
