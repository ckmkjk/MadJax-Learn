// ===== RING RUSH — Math problems fall like rings =====
import { Audio } from '../audio.js';

function genProblem(isJaxon) {
  if (isJaxon) {
    // Counting & simple addition up to 10
    const type = Math.random();
    if (type < 0.4) {
      // What comes next?
      const n = Math.floor(Math.random() * 15) + 1;
      return { question: `${n}, ${n + 1}, ?`, answer: n + 2, decoys: [n, n + 3, n - 1].filter(d => d >= 0 && d !== n + 2) };
    } else {
      const a = Math.floor(Math.random() * 6) + 1;
      const b = Math.floor(Math.random() * (10 - a)) + 1;
      return { question: `${a} + ${b}`, answer: a + b, decoys: [a + b + 1, a + b - 1, a + b + 2].filter(d => d > 0 && d !== a + b) };
    }
  }
  // Maddox: up to 100, beginning multiplication
  const type = Math.random();
  if (type < 0.3) {
    // Multiplication (2x, 5x, 10x)
    const bases = [2, 5, 10];
    const base = bases[Math.floor(Math.random() * bases.length)];
    const mult = Math.floor(Math.random() * 10) + 1;
    const ans = base * mult;
    return { question: `${base} × ${mult}`, answer: ans, decoys: [ans + base, ans - base, ans + 1, ans - 1].filter(d => d > 0 && d !== ans) };
  } else if (type < 0.65) {
    // Addition up to 100
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 40) + 5;
    return { question: `${a} + ${b}`, answer: a + b, decoys: [a + b + 1, a + b - 1, a + b + 10, a + b - 10].filter(d => d > 0 && d !== a + b) };
  } else {
    // Subtraction
    const a = Math.floor(Math.random() * 60) + 20;
    const b = Math.floor(Math.random() * (a - 5)) + 1;
    return { question: `${a} − ${b}`, answer: a - b, decoys: [a - b + 1, a - b - 1, a - b + 2, a + b].filter(d => d >= 0 && d !== a - b) };
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const GAME_TIME = 60;
  const NUM_CHOICES = isJaxon ? 3 : 4;

  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  let timeLeft = GAME_TIME;
  let timer = null;
  let countdownTimer = null;
  let active = true;
  let superSpeed = false;
  let currentProblem = null;

  // Build game HTML
  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  gameArea.innerHTML = `
    <div class="game-hud">
      <div class="game-hud__left">
        <div class="game-hud__score" id="rr-score">0</div>
        <div class="game-hud__streak" id="rr-streak">🔥 0</div>
      </div>
      <div class="game-hud__right">
        <div class="game-hud__timer" id="rr-timer">${GAME_TIME}</div>
      </div>
    </div>
    <div class="super-speed-bg" id="rr-speed-bg"></div>
    <div class="game-area" id="rr-area">
      <div class="question-display" id="rr-question"></div>
      <div class="answer-grid ${NUM_CHOICES <= 3 ? 'answer-grid--cols-3' : 'answer-grid--cols-4'}" id="rr-answers"></div>
    </div>
  `;
  container.appendChild(gameArea);

  let scoreEl = gameArea.querySelector('#rr-score');
  let timerEl = gameArea.querySelector('#rr-timer');
  let streakEl = gameArea.querySelector('#rr-streak');
  let questionEl = gameArea.querySelector('#rr-question');
  let answersEl = gameArea.querySelector('#rr-answers');
  let speedBg = gameArea.querySelector('#rr-speed-bg');

  function nextProblem() {
    if (!active) return;
    currentProblem = genProblem(isJaxon);
    questionEl.textContent = currentProblem.question;
    questionEl.style.animation = 'none';
    questionEl.offsetHeight;
    questionEl.style.animation = 'pop-in 0.3s var(--ease-bounce)';

    // Build choices
    let choices = [currentProblem.answer, ...currentProblem.decoys.slice(0, NUM_CHOICES - 1)];
    // Ensure we have enough choices (with iteration cap to prevent infinite loop)
    let attempts = 0;
    while (choices.length < NUM_CHOICES && attempts < 50) {
      const d = currentProblem.answer + Math.floor(Math.random() * 10) - 5;
      if (d > 0 && !choices.includes(d)) choices.push(d);
      attempts++;
    }
    // Fallback: fill with sequential numbers if needed
    for (let f = 1; choices.length < NUM_CHOICES; f++) {
      const d = currentProblem.answer + f;
      if (!choices.includes(d)) choices.push(d);
    }
    choices = shuffle(choices);

    answersEl.innerHTML = choices.map(c => `
      <button class="answer-btn ${isJaxon ? 'jaxon-size' : ''}" data-value="${c}">${c}</button>
    `).join('');

    answersEl.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn, parseInt(btn.dataset.value)));
    });
  }

  function handleAnswer(btn, value) {
    if (!active) return;
    const correct = value === currentProblem.answer;

    // Disable all buttons
    answersEl.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    if (correct) {
      btn.classList.add('correct');
      score++;
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      scoreEl.textContent = score;
      Audio.ring(streak);

      // Super speed at 5 streak
      if (streak >= 5 && !superSpeed) {
        superSpeed = true;
        speedBg.classList.add('active');
        Audio.streak();
      }

      // Update streak display
      if (streak >= 2) {
        streakEl.textContent = `🔥 ${streak}${superSpeed ? ' SUPER!' : ''}`;
        streakEl.classList.add('visible');
        if (superSpeed) streakEl.classList.add('super');
      }
    } else {
      btn.classList.add('wrong');
      streak = 0;
      superSpeed = false;
      speedBg.classList.remove('active');
      streakEl.classList.remove('visible', 'super');
      Audio.wrong();
      // Flash correct answer
      answersEl.querySelectorAll('.answer-btn').forEach(b => {
        if (parseInt(b.dataset.value) === currentProblem.answer) b.classList.add('correct');
      });
    }

    setTimeout(nextProblem, correct ? 400 : 800);
  }

  function tick() {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 5) timerEl.classList.add('warning');
    if (timeLeft <= 0) endGame();
  }

  function endGame() {
    active = false;
    clearInterval(timer);
    Audio.levelComplete();

    const maxPossible = Math.max(score, 25); // estimate max ~25 in 60s
    const result = onComplete(score, maxPossible);

    gameArea.innerHTML = `
      <div class="game-results">
        <div class="game-results__score">${score}</div>
        <div class="game-results__label">rings collected</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${maxStreak >= 5 ? `<div style="color:var(--gold);font-weight:700">🔥 Max streak: ${maxStreak}</div>` : ''}
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="rr-retry">Play Again</button>
          <button class="btn btn-ghost" id="rr-back">Back to Hub</button>
        </div>
      </div>
    `;

    if (result.isRecord) Audio.newRecord();

    gameArea.querySelector('#rr-retry')?.addEventListener('click', () => {
      Audio.tap();
      restart();
    });
    gameArea.querySelector('#rr-back')?.addEventListener('click', () => {
      Audio.tap();
      onBack();
    });
  }

  function restart() {
    score = 0; streak = 0; maxStreak = 0; timeLeft = GAME_TIME;
    active = true; superSpeed = false;
    clearInterval(timer);
    clearInterval(countdownTimer);
    // Rebuild HUD
    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left">
          <div class="game-hud__score" id="rr-score">0</div>
          <div class="game-hud__streak" id="rr-streak">🔥 0</div>
        </div>
        <div class="game-hud__right">
          <div class="game-hud__timer" id="rr-timer">${GAME_TIME}</div>
        </div>
      </div>
      <div class="super-speed-bg" id="rr-speed-bg"></div>
      <div class="game-area" id="rr-area">
        <div class="question-display" id="rr-question"></div>
        <div class="answer-grid ${NUM_CHOICES <= 3 ? 'answer-grid--cols-3' : 'answer-grid--cols-4'}" id="rr-answers"></div>
      </div>
    `;
    // Re-bind element references
    scoreEl = gameArea.querySelector('#rr-score');
    timerEl = gameArea.querySelector('#rr-timer');
    streakEl = gameArea.querySelector('#rr-streak');
    questionEl = gameArea.querySelector('#rr-question');
    answersEl = gameArea.querySelector('#rr-answers');
    speedBg = gameArea.querySelector('#rr-speed-bg');
    startCountdown();
  }

  // Start countdown then game
  function startCountdown() {
    const overlay = document.createElement('div');
    overlay.className = 'countdown-overlay';
    gameArea.appendChild(overlay);
    let count = 3;
    overlay.innerHTML = `<div class="countdown-number">${count}</div>`;
    Audio.countdown();
    countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        overlay.innerHTML = `<div class="countdown-number">${count}</div>`;
        Audio.countdown();
      } else {
        clearInterval(countdownTimer);
        overlay.innerHTML = `<div class="countdown-number" style="color:var(--green)">GO!</div>`;
        Audio.go();
        setTimeout(() => {
          overlay.remove();
          nextProblem();
          timer = setInterval(tick, 1000);
        }, 400);
      }
    }, 800);
  }

  startCountdown();

  return {
    cleanup() {
      active = false;
      clearInterval(timer);
      clearInterval(countdownTimer);
    }
  };
}
