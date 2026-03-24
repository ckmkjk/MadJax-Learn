// ===== RING RUN — Daily mixed challenge =====
import { Audio } from '../audio.js';
import { CVC_WORDS, SPELLING_WORDS, LETTER_SOUNDS } from '../../data/words.js';
import { PATTERNS_EASY, PATTERNS_HARD } from '../../data/patterns.js';

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a;
}

// Seed RNG from date so both kids get same set
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function genMathQ(isJaxon, rng) {
  if (isJaxon) {
    const a = Math.floor(rng() * 6) + 1;
    const b = Math.floor(rng() * (10 - a)) + 1;
    return { type: 'math', q: `${a} + ${b} = ?`, answer: a + b,
      choices: shuffle([a + b, a + b + 1, Math.max(1, a + b - 1)]) };
  }
  const a = Math.floor(rng() * 30) + 10;
  const b = Math.floor(rng() * 20) + 5;
  return { type: 'math', q: `${a} + ${b} = ?`, answer: a + b,
    choices: shuffle([a + b, a + b + 1, a + b - 1, a + b + 10]) };
}

function genReadingQ(isJaxon, rng) {
  if (isJaxon) {
    const ls = LETTER_SOUNDS[Math.floor(rng() * LETTER_SOUNDS.length)];
    const others = shuffle(LETTER_SOUNDS.filter(l => l.letter !== ls.letter)).slice(0, 2);
    return { type: 'reading', q: `Which letter says "${ls.sound}"?`, answer: ls.letter,
      choices: shuffle([ls.letter, ...others.map(o => o.letter)]) };
  }
  const word = SPELLING_WORDS[Math.floor(rng() * SPELLING_WORDS.length)];
  const firstLetter = word.word[0].toUpperCase();
  const others = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== firstLetter);
  return { type: 'reading', q: `"${word.word}" starts with?`, answer: firstLetter,
    choices: shuffle([firstLetter, ...shuffle(others).slice(0, 3)]) };
}

function genPatternQ(isJaxon, rng) {
  const pool = isJaxon ? PATTERNS_EASY : PATTERNS_HARD;
  const p = pool[Math.floor(rng() * pool.length)];
  return { type: 'pattern', q: p.seq.slice(0, -1).join(' ') + ' ?', answer: p.answer,
    choices: shuffle([...p.choices]) };
}

export function init(container, ctx) {
  const { isJaxon, storage, onComplete, onBack, starSVG } = ctx;
  const TOTAL = 5;
  let idx = 0;
  let score = 0;
  let active = true;

  // Seed from today's date
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const rng = seededRandom(seed);

  // Generate 5 mixed questions: 2 math, 2 reading, 1 pattern
  const questions = shuffle([
    genMathQ(isJaxon, rng),
    genMathQ(isJaxon, rng),
    genReadingQ(isJaxon, rng),
    genReadingQ(isJaxon, rng),
    genPatternQ(isJaxon, rng),
  ]);

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  // Show weekly rings first
  const weeklyRings = storage.getWeeklyRings();

  function renderQuestion() {
    if (idx >= TOTAL) return endGame();
    const q = questions[idx];
    const sizeClass = isJaxon ? 'jaxon-size' : '';
    const typeLabel = { math: '⚡ Math', reading: '🌿 Reading', pattern: '🔮 Pattern' }[q.type];
    const typeColor = { math: 'var(--blue)', reading: 'var(--green)', pattern: 'var(--purple-light)' }[q.type];

    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left">
          <span style="font-size:0.85rem;color:${typeColor};font-weight:700">${typeLabel}</span>
          <span style="font-size:0.8rem;color:var(--text-dim)">${idx + 1}/${TOTAL}</span>
        </div>
        <div class="game-hud__right"><div class="game-hud__score">${score}</div></div>
      </div>
      <div class="game-area" style="background:radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.05),transparent 60%)">
        <div style="margin-bottom:8px">
          <div class="ring-chain">
            ${[0,1,2,3,4].map(i => `<div class="ring-chain__ring ${i < idx ? 'collected' : ''}">💍</div>`).join('')}
          </div>
        </div>
        <div class="question-display" style="font-size:clamp(1.5rem,5vw,2.5rem)">${q.q}</div>
        <div class="answer-grid answer-grid--cols-${q.choices.length > 3 ? '2' : '3'}" style="max-width:500px">
          ${q.choices.map(c => `
            <button class="answer-btn ${sizeClass}" data-value="${c}">${c}</button>
          `).join('')}
        </div>
      </div>
    `;

    gameArea.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!active) return;
        gameArea.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
        const val = btn.dataset.value;
        const correct = val === String(q.answer);

        if (correct) {
          btn.classList.add('correct');
          score++;
          Audio.ring(idx);
        } else {
          btn.classList.add('wrong');
          Audio.wrong();
          gameArea.querySelectorAll(`.answer-btn[data-value="${q.answer}"]`).forEach(b => b.classList.add('correct'));
        }

        idx++;
        setTimeout(renderQuestion, 800);
      });
    });
  }

  function endGame() {
    active = false;
    Audio.levelComplete();

    // Collect daily ring if scored 3+
    let ringCollected = false;
    if (score >= 3) {
      ringCollected = storage.collectDailyRing();
    }

    const result = onComplete(score, TOTAL);
    const newWeekly = storage.getWeeklyRings();

    gameArea.innerHTML = `
      <div class="game-results">
        <div style="font-size:4rem">💍</div>
        <div class="game-results__score">${score}/${TOTAL}</div>
        <div class="game-results__label">Daily Ring Run</div>
        ${ringCollected ? `
          <div style="color:var(--gold);font-weight:800;font-size:1.1rem;animation:pop-in 0.5s var(--ease-bounce)">
            💍 Daily Ring Collected!
          </div>
        ` : score < 3 ? `
          <div style="color:var(--text-dim);font-size:0.9rem">Get 3+ to earn your daily ring</div>
        ` : `
          <div style="color:var(--text-dim);font-size:0.9rem">Already collected today's ring!</div>
        `}
        <div style="margin:8px 0">
          <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:4px">This week's rings:</div>
          <div class="ring-chain">
            ${[0,1,2,3,4,5,6].map(i => `<div class="ring-chain__ring ${i < newWeekly ? 'collected' : ''}">💍</div>`).join('')}
          </div>
          ${newWeekly >= 7 ? '<div style="color:var(--gold);font-weight:700;margin-top:8px">🎉 Full week! Unlocked!</div>' : ''}
        </div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-ghost" id="rrun-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#rrun-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);
  renderQuestion();

  return { cleanup() { active = false; } };
}
