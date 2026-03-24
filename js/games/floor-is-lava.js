// ===== FLOOR IS LAVA — Jump between platforms, answer questions =====
import { Audio } from '../audio.js';
import { genMathQuestion, genReadingQuestion } from '../../data/lava-questions.js';

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const MAX_LIVES = isJaxon ? 4 : 3;
  const TOTAL_QUESTIONS = 15;
  const BASE_SPEED = isJaxon ? 1.2 : 1.8; // platform scroll speed

  let lives = MAX_LIVES;
  let score = 0;
  let questionNum = 0;
  let active = true;
  let animFrameId = null;
  let platformTimer = null;
  let speed = BASE_SPEED;
  let platforms = [];
  let currentQuestion = null;
  let playerX = 50; // percentage
  let playerY = 0;  // will be set based on platform
  let playerOnPlatform = -1;
  let gamePhase = 'question'; // 'question' | 'jumping' | 'result'
  let lavaOffset = 0;

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;position:relative;overflow:hidden;';

  function nextQuestion() {
    if (questionNum >= TOTAL_QUESTIONS || lives <= 0) return endGame();
    gamePhase = 'question';

    // Alternate math and reading
    const isMath = Math.random() < 0.6;
    currentQuestion = isMath ? genMathQuestion(isJaxon) : genReadingQuestion(isJaxon);

    renderGame();
  }

  function renderGame() {
    const heartsHTML = Array(MAX_LIVES).fill(0).map((_, i) =>
      `<span style="font-size:1.2rem;${i >= lives ? 'opacity:0.2' : ''}">${i < lives ? '❤️' : '🖤'}</span>`
    ).join('');

    const platformsHTML = currentQuestion.choices.map((choice, i) => {
      const leftPos = 15 + (i * (70 / (currentQuestion.choices.length - 1 || 1)));
      return `
        <button class="lava-platform" data-idx="${i}" data-value="${choice}"
          style="left:${leftPos}%;bottom:${140 + i * 30}px;animation:platform-float ${2 + i * 0.3}s ease-in-out infinite;">
          <span class="lava-platform__label">${choice}</span>
        </button>
      `;
    }).join('');

    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left">
          <span style="font-size:0.85rem;color:var(--text-dim)">Q${questionNum + 1}/${TOTAL_QUESTIONS}</span>
          <span style="margin-left:8px">${heartsHTML}</span>
        </div>
        <div class="game-hud__right"><div class="game-hud__score">${score}</div></div>
      </div>

      <div class="lava-game-area">
        <!-- Question -->
        <div class="lava-question">
          <div class="lava-question__text">${currentQuestion.question}</div>
        </div>

        <!-- Player character -->
        <div class="lava-player" id="lava-player" style="left:50%;bottom:260px;">
          🧑‍🚀
        </div>

        <!-- Platforms -->
        <div class="lava-platforms" id="lava-platforms">
          ${platformsHTML}
        </div>

        <!-- Lava -->
        <div class="lava-floor">
          <div class="lava-wave lava-wave--1"></div>
          <div class="lava-wave lava-wave--2"></div>
          <div class="lava-bubbles">
            <span class="lava-bubble" style="left:10%;animation-delay:0s">🫧</span>
            <span class="lava-bubble" style="left:30%;animation-delay:0.5s">🫧</span>
            <span class="lava-bubble" style="left:55%;animation-delay:1s">🫧</span>
            <span class="lava-bubble" style="left:80%;animation-delay:1.5s">🫧</span>
          </div>
        </div>
      </div>
    `;

    // Attach platform click handlers
    gameArea.querySelectorAll('.lava-platform').forEach(plat => {
      plat.addEventListener('click', () => handlePlatformTap(plat));
    });
  }

  function handlePlatformTap(plat) {
    if (!active || gamePhase !== 'question') return;
    gamePhase = 'jumping';

    const value = currentQuestion.isWord ? plat.dataset.value : parseInt(plat.dataset.value);
    const correct = value === currentQuestion.answer || String(value) === String(currentQuestion.answer);

    const player = gameArea.querySelector('#lava-player');

    // Animate jump to platform
    if (player) {
      player.style.left = plat.style.left;
      player.style.bottom = plat.style.bottom;
      player.style.transition = 'left 0.3s ease-out, bottom 0.3s ease-out';
    }

    // Disable all platforms
    gameArea.querySelectorAll('.lava-platform').forEach(p => p.disabled = true);

    setTimeout(() => {
      if (correct) {
        plat.classList.add('lava-platform--correct');
        score++;
        Audio.correct();

        // Speed up every 5 correct
        if (score % 5 === 0) {
          speed += 0.3;
        }
      } else {
        plat.classList.add('lava-platform--wrong');
        Audio.wrong();
        lives--;

        // Show correct answer
        gameArea.querySelectorAll('.lava-platform').forEach(p => {
          const pVal = currentQuestion.isWord ? p.dataset.value : parseInt(p.dataset.value);
          if (pVal === currentQuestion.answer || String(pVal) === String(currentQuestion.answer)) {
            p.classList.add('lava-platform--correct');
          }
        });

        // Fall animation
        if (player) {
          player.style.bottom = '20px';
          player.style.transition = 'bottom 0.5s ease-in';
          player.textContent = '😱';
        }
      }

      questionNum++;

      setTimeout(() => {
        if (player) player.textContent = '🧑‍🚀';
        nextQuestion();
      }, correct ? 700 : 1200);
    }, 350);
  }

  function endGame() {
    active = false;
    Audio.levelComplete();
    const result = onComplete(score, TOTAL_QUESTIONS);

    gameArea.innerHTML = `
      <div class="game-results">
        <div style="font-size:4rem">${lives > 0 ? '🌋' : '😵'}</div>
        <div class="game-results__score">${score}/${TOTAL_QUESTIONS}</div>
        <div class="game-results__label">${lives > 0 ? 'platforms conquered!' : 'fell in the lava!'}</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="lava-retry">Play Again</button>
          <button class="btn btn-ghost" id="lava-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#lava-retry')?.addEventListener('click', () => {
      Audio.tap();
      lives = MAX_LIVES; score = 0; questionNum = 0; active = true; speed = BASE_SPEED;
      nextQuestion();
    });
    gameArea.querySelector('#lava-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  // Inject lava-specific styles
  const style = document.createElement('style');
  style.textContent = `
    .lava-game-area {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: linear-gradient(180deg, #1a0a2e 0%, #2d0a1e 60%, #4a0a0a 100%);
    }

    .lava-question {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      text-align: center;
    }

    .lava-question__text {
      font-family: var(--font-heading);
      font-size: clamp(1.2rem, 4vw, 1.8rem);
      font-weight: 800;
      color: white;
      background: rgba(0,0,0,0.5);
      padding: 12px 24px;
      border-radius: 16px;
      border: 2px solid rgba(255,107,53,0.3);
    }

    .lava-player {
      position: absolute;
      font-size: 2.5rem;
      z-index: 5;
      transform: translateX(-50%);
      transition: left 0.3s, bottom 0.3s;
      filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));
    }

    .lava-platform {
      position: absolute;
      transform: translateX(-50%);
      background: linear-gradient(180deg, #5a3a1a, #3d2a0f);
      border: 3px solid #8B6914;
      border-radius: 12px;
      padding: 14px 20px;
      min-width: 70px;
      cursor: pointer;
      z-index: 3;
      transition: transform 0.15s, border-color 0.3s, background 0.3s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }

    .lava-platform:hover {
      transform: translateX(-50%) scale(1.08);
      border-color: #FFD700;
    }

    .lava-platform:active {
      transform: translateX(-50%) scale(0.95);
    }

    .lava-platform__label {
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.1rem;
      color: white;
      text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    }

    .lava-platform--correct {
      background: linear-gradient(180deg, #2a6a1a, #1a4a0f) !important;
      border-color: #00C853 !important;
      box-shadow: 0 0 20px rgba(0,200,83,0.4);
    }

    .lava-platform--wrong {
      background: linear-gradient(180deg, #6a1a1a, #4a0f0f) !important;
      border-color: #CC2936 !important;
      animation: shake 0.4s;
    }

    .lava-floor {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      z-index: 2;
    }

    .lava-wave {
      position: absolute;
      bottom: 0;
      left: -10%;
      width: 120%;
      height: 60px;
      border-radius: 50% 50% 0 0;
    }

    .lava-wave--1 {
      background: linear-gradient(180deg, #FF6B35, #CC2936);
      animation: lava-flow 3s ease-in-out infinite;
    }

    .lava-wave--2 {
      background: linear-gradient(180deg, rgba(255,107,53,0.7), rgba(255,69,0,0.9));
      height: 45px;
      animation: lava-flow 2.5s ease-in-out infinite reverse;
    }

    @keyframes lava-flow {
      0%, 100% { transform: translateX(-3%) scaleY(1); }
      50% { transform: translateX(3%) scaleY(1.15); }
    }

    @keyframes platform-float {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-8px); }
    }

    .lava-bubbles {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
    }

    .lava-bubble {
      position: absolute;
      font-size: 1rem;
      animation: bubble-rise 2s ease-in infinite;
      opacity: 0.6;
    }

    @keyframes bubble-rise {
      0% { transform: translateY(0) scale(0.5); opacity: 0.6; }
      100% { transform: translateY(-40px) scale(1); opacity: 0; }
    }
  `;

  container.appendChild(style);
  container.appendChild(gameArea);
  nextQuestion();

  return {
    cleanup() {
      active = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (platformTimer) clearTimeout(platformTimer);
      style.remove();
    }
  };
}
