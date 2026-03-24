// ===== STORY SPRINT — Read story, answer comprehension question =====
import { Audio } from '../audio.js';
import { STORIES_EASY, STORIES_HARD } from '../../data/stories.js';

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a;
}

function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 1.05;
    speechSynthesis.speak(u);
  }
}

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const stories = shuffle(isJaxon ? [...STORIES_EASY] : [...STORIES_HARD]).slice(0, 6);
  const TOTAL = stories.length;
  let idx = 0;
  let score = 0;
  let active = true;

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  function renderStory() {
    if (idx >= TOTAL) return endGame();
    const story = stories[idx];
    const sizeClass = isJaxon ? 'jaxon-size' : '';
    const answers = shuffle([...story.answers]);

    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left"><span style="font-size:0.85rem;color:var(--text-dim)">Story ${idx + 1}/${TOTAL}</span></div>
        <div class="game-hud__right"><div class="game-hud__score">${score}</div></div>
      </div>
      <div class="game-area" style="overflow-y:auto">
        <div class="story-box ${sizeClass}">${story.text}</div>
        ${isJaxon ? '<button class="btn btn-ghost" id="ss-hear" style="margin-bottom:16px;font-size:0.85rem">🔊 Read to me</button>' : ''}
        <div style="font-family:var(--font-heading);font-weight:700;font-size:1.1rem;margin-bottom:16px;text-align:center">${story.question}</div>
        <div class="answer-grid answer-grid--cols-${isJaxon ? '3' : '2'}" style="max-width:500px;width:100%">
          ${answers.map(a => `
            <button class="answer-btn ${isJaxon ? 'jaxon-size' : ''}" data-correct="${a.correct}" style="flex-direction:column;gap:4px">
              ${a.icon ? `<span style="font-size:1.5rem">${a.icon}</span>` : ''}
              <span>${a.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    if (isJaxon) {
      speak(story.text);
      gameArea.querySelector('#ss-hear')?.addEventListener('click', () => speak(story.text));
    }

    gameArea.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!active) return;
        gameArea.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
        const correct = btn.dataset.correct === 'true';

        if (correct) {
          btn.classList.add('correct');
          score++;
          Audio.correct();
        } else {
          btn.classList.add('wrong');
          Audio.wrong();
          gameArea.querySelectorAll('.answer-btn[data-correct="true"]').forEach(b => b.classList.add('correct'));
        }

        idx++;
        setTimeout(renderStory, 1000);
      });
    });
  }

  function endGame() {
    active = false;
    window.speechSynthesis?.cancel();
    Audio.levelComplete();
    const result = onComplete(score, TOTAL);

    gameArea.innerHTML = `
      <div class="game-results">
        <div style="font-size:4rem">📖</div>
        <div class="game-results__score">${score}/${TOTAL}</div>
        <div class="game-results__label">stories completed</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="ss-retry">Play Again</button>
          <button class="btn btn-ghost" id="ss-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#ss-retry')?.addEventListener('click', () => { Audio.tap(); idx=0; score=0; active=true; renderStory(); });
    gameArea.querySelector('#ss-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);
  renderStory();

  return { cleanup() { active = false; window.speechSynthesis?.cancel(); } };
}
