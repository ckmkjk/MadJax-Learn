# MadJax Learn — Claude Code Instructions

## Project Overview
MadJax Learn is a Sonic-themed educational game app for two kids: **Maddox** (age 8, harder difficulty) and **Jaxon** (age 5, easier difficulty). Pure HTML/CSS/JS — no frameworks, no build tools, no dependencies.

## Tech Stack
- **ES Modules** loaded via `<script type="module">`
- **localStorage** for persistence (profiles, scores, progress)
- **Web Audio API** for all sound effects (no audio files)
- **SVG** for avatars and star icons (inline, no image files)
- **Google Fonts**: Rubik + Nunito

## Architecture

```
index.html              Entry point — loads app.js as ES module
js/
  app.js                Main controller: player select, hub, game launcher
  storage.js            localStorage wrapper: profiles, scores, XP, levels
  audio.js              Web Audio API sound effects (all procedurally generated)
  avatars.js            SVG avatar generators (createAvatar, createMiniAvatar, starSVG)
  games/
    ring-rush.js        Tap rings in sequence (reaction speed)
    number-blaster.js   Math problems (add/subtract/multiply)
    speed-duel.js       Quick-fire math race
    word-builder.js     Spell words from scrambled letters
    story-sprint.js     Reading comprehension
    letter-splash.js    Letter recognition / phonics
    pattern-portal.js   Pattern completion
    memory-matrix.js    Grid memory game
    maze-runner.js      Navigate mazes
    ring-run.js         Collect rings in a runner game
css/
  main.css              Global styles, variables, animations
  player-select.css     Player selection screen
  hub.css               Game hub / zone select
  games.css             Shared game UI styles
data/
  words.js              Word lists for word-builder
  patterns.js           Pattern data for pattern-portal
  stories.js            Story passages for story-sprint
```

## Game Module Pattern
Every game exports a single `init(container, ctx)` function that:
1. Receives a DOM container and a context object `{ player, onComplete, onExit }`
2. Renders game UI into the container
3. Returns a `cleanup()` function that removes event listeners and clears timers
4. Calls `ctx.onComplete({ score, maxScore })` when the game ends
5. Calls `ctx.onExit()` when the player quits early

## Conventions
- No TypeScript, no JSX, no transpilation
- Template literals for HTML generation
- `const` by default, `let` when mutation is needed
- Difficulty adapts based on player: `Storage.isMaddox()` / `Storage.isJaxon()`
- All intervals/timeouts must be tracked and cleared in cleanup
- Games must not recursively call `init()` (use loops or re-render patterns)
- Avoid `innerHTML` for user-provided content (XSS)

## Testing
- No test framework — validate with: `node --check js/<file>.js`
- Manual testing: open `index.html` in a browser (no server required, but ES modules need HTTP — use `npx serve .` or similar)
- Verify both player profiles (Maddox and Jaxon) for difficulty differences

## Commit Rules
Before every commit, update the following files to reflect changes made in the session:
1. **BACKLOG.md** — Move completed items, add new planned items
2. **ERRORS.md** — Log any bugs found/fixed, update known issues
3. **HANDOFFS.md** — Update session summary, current state, and next steps
