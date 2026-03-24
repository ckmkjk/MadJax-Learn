// ===== MAZE RUNNER — Navigate maze, answer questions at gates =====
import { Audio } from '../audio.js';

function genMaze(isJaxon) {
  const size = isJaxon ? 7 : 9;
  // Simple maze using recursive division (simplified)
  const grid = [];
  for (let r = 0; r < size; r++) {
    grid[r] = [];
    for (let c = 0; c < size; c++) {
      // Border walls
      if (r === 0 || c === 0 || r === size - 1 || c === size - 1) {
        grid[r][c] = 'wall';
      } else if (r % 2 === 0 && c % 2 === 0) {
        grid[r][c] = 'wall';
      } else if (r % 2 === 1 && c % 2 === 1) {
        grid[r][c] = 'path';
      } else {
        // Randomly open some passages
        grid[r][c] = Math.random() < 0.55 ? 'path' : 'wall';
      }
    }
  }
  // Ensure start and finish are open
  grid[1][1] = 'start';
  grid[size - 2][size - 2] = 'finish';

  // Ensure there's a rough path (open middle corridors)
  for (let r = 1; r < size - 1; r++) {
    grid[r][Math.floor(size / 2)] = grid[r][Math.floor(size / 2)] === 'start' || grid[r][Math.floor(size / 2)] === 'finish' ? grid[r][Math.floor(size / 2)] : 'path';
  }
  for (let c = 1; c < size - 1; c++) {
    grid[Math.floor(size / 2)][c] = grid[Math.floor(size / 2)][c] === 'start' || grid[Math.floor(size / 2)][c] === 'finish' ? grid[Math.floor(size / 2)][c] : 'path';
  }

  // Add gates (2-3)
  const numGates = isJaxon ? 2 : 3;
  let placed = 0;
  for (let r = 2; r < size - 2 && placed < numGates; r += 2) {
    for (let c = 2; c < size - 2 && placed < numGates; c += 2) {
      if (grid[r][c] === 'path' && Math.random() < 0.3) {
        grid[r][c] = 'gate';
        placed++;
      }
    }
  }

  return { grid, size };
}

function genGateQuestion(isJaxon) {
  if (isJaxon) {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    const ans = a + b;
    return { q: `${a} + ${b} = ?`, answer: ans, choices: [ans, ans + 1, Math.max(1, ans - 1)] };
  }
  const a = Math.floor(Math.random() * 20) + 5;
  const b = Math.floor(Math.random() * 15) + 1;
  const sub = Math.random() < 0.5;
  if (sub) {
    return { q: `${a} − ${b} = ?`, answer: a - b, choices: [a - b, a - b + 1, a - b - 1, a + b] };
  }
  return { q: `${a} + ${b} = ?`, answer: a + b, choices: [a + b, a + b + 1, a + b - 1, a + b + 10] };
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a;
}

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const { grid, size } = genMaze(isJaxon);
  let playerR = 1, playerC = 1;
  let gatesOpened = 0;
  let totalGates = 0;
  let moves = 0;
  let active = true;
  let gateModal = false;
  const trail = new Set();
  trail.add(`${playerR},${playerC}`);

  // Count gates
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (grid[r][c] === 'gate') totalGates++;

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';
  const cellPx = isJaxon ? 44 : 36;

  function renderMaze() {
    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left"><span style="font-size:0.85rem;color:var(--text-dim)">Moves: ${moves}</span></div>
        <div class="game-hud__right"><span style="font-size:0.85rem;color:var(--text-dim)">Gates: ${gatesOpened}/${totalGates}</span></div>
      </div>
      <div class="game-area" style="position:relative">
        <div class="maze-container" id="maze" style="grid-template-columns:repeat(${size},${cellPx}px)">
          ${grid.map((row, r) => row.map((cell, c) => {
            let cls = 'maze-cell ';
            let content = '';
            if (r === playerR && c === playerC) {
              cls += 'maze-cell--player';
              content = isJaxon ? '💧' : '⚡';
            } else if (cell === 'wall') {
              cls += 'maze-cell--wall';
            } else if (cell === 'gate') {
              cls += 'maze-cell--gate';
              content = '🔒';
            } else if (cell === 'finish') {
              cls += 'maze-cell--finish';
              content = '🏆';
            } else if (trail.has(`${r},${c}`)) {
              cls += 'maze-cell--trail';
            } else {
              cls += 'maze-cell--path';
            }
            return `<div class="${cls}" style="width:${cellPx}px;height:${cellPx}px;font-size:${cellPx*0.45}px">${content}</div>`;
          }).join('')).join('')}
        </div>
        <div style="margin-top:20px;display:flex;gap:8px;justify-content:center">
          <button class="btn btn-ghost" data-dir="up" style="font-size:1.5rem;padding:12px 20px">↑</button>
        </div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button class="btn btn-ghost" data-dir="left" style="font-size:1.5rem;padding:12px 20px">←</button>
          <button class="btn btn-ghost" data-dir="down" style="font-size:1.5rem;padding:12px 20px">↓</button>
          <button class="btn btn-ghost" data-dir="right" style="font-size:1.5rem;padding:12px 20px">→</button>
        </div>
      </div>
    `;

    // Direction buttons
    gameArea.querySelectorAll('[data-dir]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!active || gateModal) return;
        const dir = btn.dataset.dir;
        let nr = playerR, nc = playerC;
        if (dir === 'up') nr--;
        if (dir === 'down') nr++;
        if (dir === 'left') nc--;
        if (dir === 'right') nc++;
        tryMove(nr, nc);
      });
    });
  }

  function tryMove(nr, nc) {
    if (nr < 0 || nc < 0 || nr >= size || nc >= size) return;
    const cell = grid[nr][nc];
    if (cell === 'wall') return;

    if (cell === 'gate') {
      // Show gate question
      showGateQuestion(nr, nc);
      return;
    }

    playerR = nr;
    playerC = nc;
    moves++;
    trail.add(`${nr},${nc}`);
    Audio.tap();

    if (cell === 'finish') {
      endGame();
      return;
    }

    renderMaze();
  }

  function showGateQuestion(gr, gc) {
    gateModal = true;
    const q = genGateQuestion(isJaxon);

    const modal = document.createElement('div');
    modal.className = 'gate-modal';
    modal.innerHTML = `
      <div class="gate-modal__content">
        <div style="font-size:1.5rem;margin-bottom:8px">🔒</div>
        <div style="font-family:var(--font-heading);font-size:1.8rem;font-weight:900;margin-bottom:20px">${q.q}</div>
        <div class="answer-grid answer-grid--cols-${q.choices.length > 3 ? '2' : '3'}" style="max-width:300px;margin:0 auto">
          ${shuffle(q.choices.filter((v,i,a)=>a.indexOf(v)===i)).map(c => `
            <button class="answer-btn ${isJaxon ? 'jaxon-size' : ''}" data-value="${c}">${c}</button>
          `).join('')}
        </div>
      </div>
    `;

    gameArea.querySelector('.game-area').appendChild(modal);

    modal.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.value);
        if (val === q.answer) {
          grid[gr][gc] = 'path';
          gatesOpened++;
          playerR = gr;
          playerC = gc;
          moves++;
          trail.add(`${gr},${gc}`);
          Audio.correct();
        } else {
          Audio.wrong();
        }
        modal.remove();
        gateModal = false;
        renderMaze();
      });
    });
  }

  // Keyboard controls
  function handleKey(e) {
    if (!active || gateModal) return;
    let nr = playerR, nc = playerC;
    if (e.key === 'ArrowUp' || e.key === 'w') nr--;
    else if (e.key === 'ArrowDown' || e.key === 's') nr++;
    else if (e.key === 'ArrowLeft' || e.key === 'a') nc--;
    else if (e.key === 'ArrowRight' || e.key === 'd') nc++;
    else return;
    e.preventDefault();
    tryMove(nr, nc);
  }
  document.addEventListener('keydown', handleKey);

  function endGame() {
    active = false;
    document.removeEventListener('keydown', handleKey);
    Audio.levelComplete();

    const maxScore = totalGates + 1; // gates opened + reaching finish
    const score = gatesOpened + 1;
    const result = onComplete(score, maxScore);

    gameArea.innerHTML = `
      <div class="game-results">
        <div style="font-size:4rem">🏆</div>
        <div class="game-results__score">Maze Complete!</div>
        <div class="game-results__label">${moves} moves, ${gatesOpened}/${totalGates} gates opened</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="mr-retry">New Maze</button>
          <button class="btn btn-ghost" id="mr-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#mr-retry')?.addEventListener('click', () => {
      Audio.tap(); gameArea.remove(); init(container, ctx);
    });
    gameArea.querySelector('#mr-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);
  renderMaze();

  return {
    cleanup() {
      active = false;
      document.removeEventListener('keydown', handleKey);
    }
  };
}
