// ===== SPEED MATH DUEL — 2-player split screen =====
import { Audio } from '../audio.js';

function genProblem() {
  // Uses EASIER difficulty so Jaxon can compete
  const type = Math.random();
  if (type < 0.5) {
    const a = Math.floor(Math.random() * 8) + 1;
    const b = Math.floor(Math.random() * 8) + 1;
    return { question: `${a} + ${b}`, answer: a + b };
  } else {
    const a = Math.floor(Math.random() * 10) + 3;
    const b = Math.floor(Math.random() * a) + 1;
    return { question: `${a} − ${b}`, answer: a - b };
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

export function init(container, ctx) {
  const { onComplete, onBack, starSVG } = ctx;
  const TOTAL_ROUNDS = 10;
  let round = 0;
  let scores = { left: 0, right: 0 };
  let currentProblem = null;
  let answered = false;
  let active = true;

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  function renderRound() {
    if (round >= TOTAL_ROUNDS) return endGame();
    currentProblem = genProblem();
    answered = false;

    const choices = shuffle([
      currentProblem.answer,
      currentProblem.answer + 1,
      Math.max(0, currentProblem.answer - 1),
    ]);

    gameArea.innerHTML = `
      <div class="duel-question">
        <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:4px">Round ${round + 1}/${TOTAL_ROUNDS}</div>
        <div class="duel-question__text">${currentProblem.question} = ?</div>
      </div>
      <div class="duel-container">
        <div class="duel-side duel-side--left" data-side="left">
          <div class="duel-side__player" style="color:var(--blue)">⚡ Maddox</div>
          <div class="duel-side__score">${scores.left}</div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:160px;margin-top:16px">
            ${choices.map(c => `<button class="answer-btn" data-value="${c}" data-side="left" style="font-size:1.5rem">${c}</button>`).join('')}
          </div>
        </div>
        <div class="duel-side duel-side--right" data-side="right">
          <div class="duel-side__player" style="color:var(--teal)">💧 Jaxon</div>
          <div class="duel-side__score">${scores.right}</div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:160px;margin-top:16px">
            ${choices.map(c => `<button class="answer-btn" data-value="${c}" data-side="right" style="font-size:1.5rem">${c}</button>`).join('')}
          </div>
        </div>
      </div>
    `;

    gameArea.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn));
    });
  }

  function handleAnswer(btn) {
    if (answered || !active) return;
    answered = true;
    const val = parseInt(btn.dataset.value);
    const side = btn.dataset.side;
    const correct = val === currentProblem.answer;

    // Disable all
    gameArea.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    if (correct) {
      btn.classList.add('correct');
      scores[side]++;
      Audio.correct();
    } else {
      btn.classList.add('wrong');
      Audio.wrong();
      // Show correct
      gameArea.querySelectorAll(`.answer-btn[data-value="${currentProblem.answer}"]`).forEach(b => b.classList.add('correct'));
    }

    round++;
    setTimeout(renderRound, 1000);
  }

  function endGame() {
    active = false;
    Audio.levelComplete();
    const winner = scores.left > scores.right ? 'Maddox' : scores.right > scores.left ? 'Jaxon' : 'Tie';
    const winnerEmoji = scores.left > scores.right ? '⚡' : scores.right > scores.left ? '💧' : '🤝';

    // Record result for current player
    const myScore = Math.max(scores.left, scores.right);
    const result = onComplete(myScore, TOTAL_ROUNDS);

    gameArea.innerHTML = `
      <div class="game-results">
        <div style="font-size:4rem">${winnerEmoji}</div>
        <div class="game-results__score">${winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`}</div>
        <div style="display:flex;gap:40px;margin:16px 0">
          <div class="text-center">
            <div style="color:var(--blue);font-weight:700">⚡ Maddox</div>
            <div style="font-size:2rem;font-weight:900">${scores.left}</div>
          </div>
          <div class="text-center">
            <div style="color:var(--teal);font-weight:700">💧 Jaxon</div>
            <div style="font-size:2rem;font-weight:900">${scores.right}</div>
          </div>
        </div>
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="sd-retry">Rematch!</button>
          <button class="btn btn-ghost" id="sd-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#sd-retry')?.addEventListener('click', () => {
      Audio.tap(); round=0; scores={left:0,right:0}; active=true; renderRound();
    });
    gameArea.querySelector('#sd-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);
  renderRound();

  return { cleanup() { active = false; } };
}
