# MadJax Learn — Error Log

## Resolved

### Session 3: 2026-03-24 — Pokemon Theme + New Features

| # | File | Issue | Fix |
|---|------|-------|-----|
| 10 | `js/games/pattern-portal.js` | Display logic used `seq.slice(0, -1)` which hid last item — but PATTERNS_HARD had `answer !== seq[-1]` causing wrong sequences for Maddox | Changed to show full `seq` with "?" appended after. Answer now correctly represents "what comes next" |
| 11 | `data/patterns.js` | 8 of 13 hard patterns had mismatched answer vs last sequence item | Fixed by aligning display approach — show full seq, answer = next item |

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

## Notes (Session 3: Pokemon Theme + Features)
- Pattern Portal bug was a data/display mismatch — patterns were designed for "what comes next" but code showed "fill in the blank"
- Floor is Lava uses injected `<style>` element for game-specific CSS — cleaned up in `cleanup()`
- Admin dashboard uses dynamic `import()` to lazy-load admin.js only when needed
- Level progression stored in `gameLevels` map in player profile — auto-unlocks on 2+ stars
- All SVGs now include `xmlns` attribute for strict compliance

## Error Patterns to Watch

- **Timer leaks**: Always store interval/timeout IDs and clear them in the game's `cleanup()` function
- **Recursive init**: Never call `init()` from within a game's "Play Again" handler — use a re-render loop instead
- **Null profiles**: `Storage.getCurrentProfile()` can return null — always guard return values
- **Array bounds**: When using level/index lookups, verify the array has entries at the target index
- **Double-tap**: Disable interactive elements immediately after a decisive action (submit, answer)
- **Style injection**: Games that inject `<style>` elements must remove them in `cleanup()`
