// ===== NUMBER BLASTER — Tap bubbles that add up to target =====
import { Audio } from '../audio.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

function genRound(isJaxon) {
  if (isJaxon) {
    const target = Math.floor(Math.random() * 16) + 5; // 5-20 (first grade level)
    const a = Math.floor(Math.random() * (target - 1)) + 1;
    const b = target - a;
    // Add 3 decoys
    const decoys = [];
    while (decoys.length < 3) {
      const d = Math.floor(Math.random() * 15) + 1;
      if (d !== a && d !== b && !decoys.includes(d)) decoys.push(d);
    }
    return { target, correct: [a, b], bubbles: shuffle([a, b, ...decoys]) };
  }
  // Maddox: target 10-50, 3-5 bubbles
  const numCorrect = Math.floor(Math.random() * 3) + 2; // 2-4
  const target = Math.floor(Math.random() * 41) + 10;
  const correct = [];
  let remaining = target;
  for (let i = 0; i < numCorrect - 1; i++) {
    const max = Math.max(1, remaining - (numCorrect - i - 1));
    const val = Math.floor(Math.random() * Math.min(max, 15)) + 1;
    correct.push(val);
    remaining -= val;
  }
  correct.push(remaining);
  // Decoys
  const decoys = [];
  while (decoys.length < 3) {
    const d = Math.floor(Math.random() * 20) + 1;
    if (!correct.includes(d) && !decoys.includes(d)) decoys.push(d);
  }
  return { target, correct, bubbles: shuffle([...correct, ...decoys]) };
}

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const TOTAL_ROUNDS = 8;
  let round = 0;
  let score = 0;
  let currentRound = null;
  let selected = [];
  let active = true;

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  function render() {
    currentRound = genRound(isJaxon);
    selected = [];
    const selectedSum = 0;

    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left">
          <div style="font-size:0.8rem;color:var(--text-dim)">Round ${round + 1}/${TOTAL_ROUNDS}</div>
        </div>
        <div class="game-hud__right">
          <div class="game-hud__score">${score}</div>
        </div>
      </div>
      <div class="game-area">
        <div style="margin-bottom:16px;font-size:0.9rem;color:var(--text-dim)">Tap numbers that add up to:</div>
        <div class="question-display" style="color:var(--gold)">${currentRound.target}</div>
        <div id="nb-sum" style="font-family:var(--font-heading);font-size:1.2rem;margin-bottom:16px;min-height:30px;color:var(--text-dim)"></div>
        <div id="nb-bubbles" style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;max-width:400px">
          ${currentRound.bubbles.map((n, i) => `
            <div class="number-bubble ${isJaxon ? 'jaxon-size' : ''}" data-idx="${i}" data-value="${n}"
              style="position:relative;background:linear-gradient(135deg,rgba(27,111,244,0.3),rgba(27,111,244,0.1));animation:float ${1.5+i*0.3}s ease-in-out infinite">
              ${n}
            </div>
          `).join('')}
        </div>
        <button class="btn btn-gold" id="nb-submit" style="margin-top:24px;opacity:0.3;pointer-events:none">Check Sum</button>
      </div>
    `;

    const sumEl = gameArea.querySelector('#nb-sum');
    const submitBtn = gameArea.querySelector('#nb-submit');

    gameArea.querySelectorAll('.number-bubble').forEach(bubble => {
      bubble.addEventListener('click', () => {
        if (!active) return;
        const idx = parseInt(bubble.dataset.idx);
        const val = parseInt(bubble.dataset.value);
        if (selected.includes(idx)) {
          // Deselect
          selected = selected.filter(i => i !== idx);
          bubble.classList.remove('selected');
          Audio.tap();
        } else {
          selected.push(idx);
          bubble.classList.add('selected');
          Audio.pop();
        }
        // Update sum display
        const sum = selected.reduce((s, i) => s + parseInt(gameArea.querySelectorAll('.number-bubble')[i].dataset.value), 0);
        sumEl.textContent = selected.length > 0 ? `${selected.map(i => gameArea.querySelectorAll('.number-bubble')[i].dataset.value).join(' + ')} = ${sum}` : '';
        submitBtn.style.opacity = selected.length > 0 ? '1' : '0.3';
        submitBtn.style.pointerEvents = selected.length > 0 ? 'auto' : 'none';
      });
    });

    submitBtn.addEventListener('click', () => {
      if (!active) return;
      const sum = selected.reduce((s, i) => s + parseInt(gameArea.querySelectorAll('.number-bubble')[i].dataset.value), 0);
      if (sum === currentRound.target) {
        score++;
        // Disable submit immediately to prevent double-tap
        submitBtn.style.pointerEvents = 'none';
        Audio.correct();
        // Pop selected bubbles
        selected.forEach(i => {
          const b = gameArea.querySelectorAll('.number-bubble')[i];
          b.classList.add('popped');
        });
        setTimeout(() => {
          round++;
          if (round >= TOTAL_ROUNDS) endGame();
          else render();
        }, 500);
      } else {
        Audio.wrong();
        // Shake
        gameArea.querySelectorAll('.number-bubble.selected').forEach(b => {
          b.style.animation = 'shake 0.4s';
          b.classList.remove('selected');
        });
        selected = [];
        sumEl.textContent = 'Not quite — try again!';
      }
    });
  }

  function endGame() {
    active = false;
    Audio.levelComplete();
    const result = onComplete(score, TOTAL_ROUNDS);

    gameArea.innerHTML = `
      <div class="game-results">
        <div class="game-results__score">${score}/${TOTAL_ROUNDS}</div>
        <div class="game-results__label">targets hit</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="nb-retry">Play Again</button>
          <button class="btn btn-ghost" id="nb-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#nb-retry')?.addEventListener('click', () => { Audio.tap(); round=0; score=0; active=true; render(); });
    gameArea.querySelector('#nb-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);
  render();

  return { cleanup() { active = false; } };
}
