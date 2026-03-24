# MadJax Learn — Error Log

## Resolved

### Session: 2026-03-24 — Full Audit

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `js/games/ring-rush.js` | Countdown timer not cleared on cleanup — leaked intervals | Track countdown interval ID, clear in cleanup |
| 2 | `js/games/ring-rush.js` | "Play Again" recursively called `init()` — memory leak | Replace with re-render loop, no recursive init |
| 3 | `js/games/ring-rush.js` | Decoy ring generation could infinite loop when few valid options remain | Cap attempts at 100 with fallback value |
| 4 | `js/games/ring-rush.js` | `maxPossible` set to 15 but games can yield 25 rings — star scoring skewed | Raised `maxPossible` to 25 |
| 5 | `js/games/memory-matrix.js` | "Play Again" recursively called `init()` — memory leak | Replace with re-render pattern |
| 6 | `js/games/number-blaster.js` | Double-tap submit on correct answer triggered duplicate score | Disable submit button immediately on correct answer |
| 7 | `js/storage.js` | `recordGameResult()` returned `{}` when profile is null — downstream code accessed `.stars`, `.isRecord` as undefined | Return typed default `{ stars: 0, isRecord: false, xpGained: 0, newLevel: 1 }` |
| 8 | `js/storage.js` | `addXP()` level-up loop accessed `LEVEL_XP[51]` (undefined) at level 50 boundary | Add explicit `LEVEL_XP[p.level + 1] !== undefined` guard |
| 9 | `js/storage.js` | `getLevelProgress()` division by zero when `next === current` — returned NaN | Guard with `range > 0` check, return 1 when at cap |

## Known Issues

| # | File | Issue | Severity | Notes |
|---|------|-------|----------|-------|
| 1 | `js/audio.js:10` | `AudioContext.resume()` not awaited — audio may not play on first interaction in some browsers | Medium | Affects iOS Safari and strict autoplay browsers |
| 2 | `js/avatars.js:122,130,143` | Mini avatars and star SVGs missing `xmlns` attribute | Low | Browsers handle gracefully, only matters for strict XML parsers |

## Notes (Session 2: Firebase + PWA)
- No new bugs found during implementation
- Firebase sync uses fire-and-forget writes — SDK handles offline queuing automatically
- `_handleRemoteUpdate` in storage.js writes directly to localStorage (bypasses `saveData`) to avoid echo loops
- Service worker caches Firebase CDN separately from app shell (`FIREBASE_CDN_CACHE`)

## Error Patterns to Watch

- **Timer leaks**: Always store interval/timeout IDs and clear them in the game's `cleanup()` function
- **Recursive init**: Never call `init()` from within a game's "Play Again" handler — use a re-render loop instead
- **Null profiles**: `Storage.getCurrentProfile()` can return null — always guard return values
- **Array bounds**: When using level/index lookups, verify the array has entries at the target index
- **Double-tap**: Disable interactive elements immediately after a decisive action (submit, answer)
