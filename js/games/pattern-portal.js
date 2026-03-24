// ===== PATTERN PORTAL — Complete the pattern sequence =====
import { Audio } from '../audio.js';
import { PATTERNS_EASY, PATTERNS_HARD } from '../../data/patterns.js';

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a;
}

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const patterns = shuffle(isJaxon ? [...PATTERNS_EASY] : [...PATTERNS_HARD]).slice(0, 8);
  const TOTAL = patterns.length;
  let idx = 0;
  let score = 0;
  let active = true;
  let difficulty = 0; // adaptive: increases on correct, decreases on wrong

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  function renderPattern() {
    if (idx >= TOTAL) return endGame();
    const p = patterns[idx];
    const sizeClass = isJaxon ? 'jaxon-size' : '';

    // Show sequence with last item as "?"
    const display = [...p.seq.slice(0, -1)];

    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left"><span style="font-size:0.85rem;color:var(--text-dim)">Portal ${idx + 1}/${TOTAL}</span></div>
        <div class="game-hud__right"><div class="game-hud__score">${score}</div></div>
      </div>
      <div class="game-area" style="background:radial-gradient(ellipse at 50% 30%, rgba(108,79,209,0.1),transparent 70%)">
        <div style="color:var(--purple-light);font-size:0.9rem;margin-bottom:16px">Complete the pattern to open the portal!</div>
        <div class="pattern-display">
          ${display.map(item => `<div class="pattern-item ${sizeClass}" style="background:rgba(255,255,255,0.04)">${item}</div>`).join('')}
          <div class="pattern-item ${sizeClass} missing">?</div>
        </div>
        <div style="font-family:var(--font-heading);font-weight:700;margin-bottom:16px;color:var(--text-dim)">What comes next?</div>
        <div class="answer-grid answer-grid--cols-${p.choices.length}" style="max-width:400px">
          ${p.choices.map(c => `
            <button class="answer-btn ${isJaxon ? 'jaxon-size' : ''}" data-value="${c}" style="font-size:1.8rem">${c}</button>
          `).join('')}
        </div>
      </div>
    `;

    gameArea.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!active) return;
        gameArea.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
        const val = btn.dataset.value;
        const correct = val === p.answer;

        if (correct) {
          btn.classList.add('correct');
          score++;
          difficulty++;
          Audio.correct();
          // Fill in the missing piece
          const missing = gameArea.querySelector('.pattern-item.missing');
          if (missing) {
            missing.textContent = p.answer;
            missing.classList.remove('missing');
            missing.style.animation = 'pop-in 0.3s var(--ease-bounce)';
          }
        } else {
          btn.classList.add('wrong');
          difficulty = Math.max(0, difficulty - 1);
          Audio.wrong();
          gameArea.querySelectorAll(`.answer-btn[data-value="${p.answer}"]`).forEach(b => b.classList.add('correct'));
        }

        idx++;
        setTimeout(renderPattern, 900);
      });
    });
  }

  function endGame() {
    active = false;
    Audio.levelComplete();
    const result = onComplete(score, TOTAL);

    gameArea.innerHTML = `
      <div class="game-results">
        <div style="font-size:4rem">🔮</div>
        <div class="game-results__score">${score}/${TOTAL}</div>
        <div class="game-results__label">portals opened</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="pp-retry">Play Again</button>
          <button class="btn btn-ghost" id="pp-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#pp-retry')?.addEventListener('click', () => { Audio.tap(); idx=0; score=0; active=true; renderPattern(); });
    gameArea.querySelector('#pp-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);
  renderPattern();

  return { cleanup() { active = false; } };
}
