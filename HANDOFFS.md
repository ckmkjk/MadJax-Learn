# MadJax Learn — Handoffs

## Last Session: 2026-03-24

### What Was Done
1. **Complete rebuild** — Rewrote entire app as pure HTML/CSS/JS (previously had React scaffolding). 10 Sonic-themed educational games, player selection, game hub with zone system, XP/leveling, star ratings.
2. **3-pass audit** — Audited all 4 core modules, all 10 game modules, and CSS/HTML for bugs, integration issues, and correctness.
3. **Bug fixes** — Fixed 9 bugs across storage.js, ring-rush.js, memory-matrix.js, and number-blaster.js (see ERRORS.md for full list).
4. **Documentation** — Created CLAUDE.md, ERRORS.md, BACKLOG.md, SKILLS.md, and this file.

### Current State
- All 10 games functional and verified
- Both player profiles (Maddox/Jaxon) working with appropriate difficulty scaling
- 17/17 JS files pass syntax check
- All CSS classes cross-referenced — no orphans or missing references
- Branch: `claude/kids-learning-game-app-KwAMU`

### Key Decisions
- **Pure JS, no React**: Simpler deployment (just open index.html), no build step, faster loading for kids
- **localStorage**: No backend needed — data persists per browser
- **Web Audio API**: No audio files to load — all sounds generated procedurally
- **Difficulty by player**: `Storage.isMaddox()` returns harder content, `Storage.isJaxon()` returns easier content — checked within each game
- **Zone system**: Games grouped into 5 zones (Speed, Math, Words, Brain, Adventure) with 2 games each

### Next Steps
- See BACKLOG.md for planned features
- Priority: await AudioContext.resume() in audio.js, add sound/volume settings, PWA support
