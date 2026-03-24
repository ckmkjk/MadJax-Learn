// ===== MEMORY MATRIX — Flip cards to find matching pairs =====
import { Audio } from '../audio.js';

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a;
}

function genPairs(isJaxon) {
  if (isJaxon) {
    // 3x4 grid = 6 pairs. Uppercase ↔ lowercase
    const letters = shuffle('ABCDEFGHIJKLMNOP'.split('')).slice(0, 6);
    const pairs = [];
    letters.forEach(l => {
      pairs.push({ id: l, display: l, group: l });
      pairs.push({ id: l + '_lower', display: l.toLowerCase(), group: l });
    });
    return { cards: shuffle(pairs), cols: 4, rows: 3 };
  }
  // Maddox: 4x4 = 8 pairs. Math equation ↔ answer
  const equations = [];
  const used = new Set();
  while (equations.length < 8) {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    const ans = a + b;
    const key = `${a}+${b}`;
    if (!used.has(ans)) {
      used.add(ans);
      equations.push({ eq: `${a}+${b}`, ans });
    }
  }
  const pairs = [];
  equations.forEach(e => {
    pairs.push({ id: e.eq, display: e.eq, group: e.eq });
    pairs.push({ id: e.eq + '_ans', display: String(e.ans), group: e.eq });
  });
  return { cards: shuffle(pairs), cols: 4, rows: 4 };
}

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const { cards, cols, rows } = genPairs(isJaxon);
  let flipped = [];
  let matched = new Set();
  let flips = 0;
  let active = true;
  let locked = false;

  const totalPairs = cards.length / 2;

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  const cellSize = isJaxon ? 80 : 70;

  gameArea.innerHTML = `
    <div class="game-hud">
      <div class="game-hud__left"><span style="font-size:0.85rem;color:var(--text-dim)">Flips: <span id="mm-flips">0</span></span></div>
      <div class="game-hud__right"><span style="font-size:0.85rem;color:var(--text-dim)">Pairs: <span id="mm-matched">0</span>/${totalPairs}</span></div>
    </div>
    <div class="game-area">
      <div class="memory-grid" id="mm-grid" style="grid-template-columns:repeat(${cols}, ${cellSize}px)">
        ${cards.map((card, i) => `
          <div class="memory-card" data-idx="${i}" style="width:${cellSize}px;height:${cellSize}px">
            <div class="memory-card__inner">
              <div class="memory-card__face memory-card__front">?</div>
              <div class="memory-card__face memory-card__back">${card.display}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const flipsEl = gameArea.querySelector('#mm-flips');
  const matchedEl = gameArea.querySelector('#mm-matched');
  const grid = gameArea.querySelector('#mm-grid');

  grid.addEventListener('click', (e) => {
    if (!active || locked) return;
    const cardEl = e.target.closest('.memory-card');
    if (!cardEl || cardEl.classList.contains('flipped')) return;

    const idx = parseInt(cardEl.dataset.idx);
    cardEl.classList.add('flipped');
    flipped.push({ idx, el: cardEl, card: cards[idx] });
    flips++;
    flipsEl.textContent = flips;
    Audio.flip();

    if (flipped.length === 2) {
      locked = true;
      const [a, b] = flipped;

      if (a.card.group === b.card.group) {
        // Match!
        matched.add(a.card.group);
        matchedEl.textContent = matched.size;
        a.el.classList.add('matched');
        b.el.classList.add('matched');
        Audio.match();
        flipped = [];
        locked = false;

        if (matched.size === totalPairs) {
          setTimeout(endGame, 600);
        }
      } else {
        // No match — flip back
        setTimeout(() => {
          a.el.classList.remove('flipped');
          b.el.classList.remove('flipped');
          flipped = [];
          locked = false;
        }, 800);
      }
    }
  });

  function endGame() {
    active = false;
    Audio.levelComplete();
    // Score based on efficiency: fewer flips = better
    const perfectFlips = totalPairs * 2;
    const maxReasonable = totalPairs * 4;
    const efficiency = Math.max(0, 1 - (flips - perfectFlips) / (maxReasonable - perfectFlips));
    const score = Math.round(efficiency * totalPairs);
    const result = onComplete(score, totalPairs);

    gameArea.innerHTML = `
      <div class="game-results">
        <div style="font-size:4rem">🃏</div>
        <div class="game-results__score">${matched.size}/${totalPairs}</div>
        <div class="game-results__label">pairs found in ${flips} flips</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="mm-retry">Play Again</button>
          <button class="btn btn-ghost" id="mm-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#mm-retry')?.addEventListener('click', () => {
      Audio.tap();
      container.querySelector('.game-screen, [style]')?.remove();
      gameArea.remove();
      init(container, ctx);
    });
    gameArea.querySelector('#mm-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);

  return { cleanup() { active = false; } };
}
