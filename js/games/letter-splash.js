// ===== LETTER SPLASH — Letters rain down, tap the correct one =====
import { Audio } from '../audio.js';
import { LETTER_SOUNDS, PHONICS_WORDS, CVC_WORDS } from '../../data/words.js';

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a;
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.8;
    u.pitch = 1.1;
    speechSynthesis.speak(u);
  }
}

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const TOTAL = 10;
  let round = 0;
  let score = 0;
  let active = true;

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  function genChallenge() {
    if (isJaxon) {
      // Mix: 50% letter sounds, 50% CVC word starting letter (first grade)
      if (Math.random() < 0.5) {
        const target = LETTER_SOUNDS[Math.floor(Math.random() * LETTER_SOUNDS.length)];
        const others = shuffle(LETTER_SOUNDS.filter(l => l.letter !== target.letter)).slice(0, 3);
        return {
          prompt: `What makes the "${target.sound}" sound?`,
          speak: target.sound,
          answer: target.letter,
          choices: shuffle([target.letter, ...others.map(o => o.letter)]),
        };
      }
      // CVC word mode: what letter does this word start with?
      const w = CVC_WORDS[Math.floor(Math.random() * CVC_WORDS.length)];
      const answer = w.word[0].toUpperCase();
      const others = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== answer);
      return {
        prompt: `${w.hint} "${w.word.toUpperCase()}" starts with?`,
        speak: w.word,
        answer,
        choices: shuffle([answer, ...shuffle(others).slice(0, 3)]),
      };
    }
    // Maddox: tap the letter the word starts/ends with
    const word = PHONICS_WORDS[Math.floor(Math.random() * PHONICS_WORDS.length)];
    const startOrEnd = Math.random() < 0.5 ? 'starts' : 'ends';
    const answer = startOrEnd === 'starts' ? word[0].toUpperCase() : word[word.length - 1].toUpperCase();
    const others = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== answer);
    return {
      prompt: `"${word.toUpperCase()}" ${startOrEnd} with?`,
      speak: word,
      answer,
      choices: shuffle([answer, ...shuffle(others).slice(0, 3)]),
    };
  }

  function renderRound() {
    if (round >= TOTAL) return endGame();
    const ch = genChallenge();
    const sizeClass = isJaxon ? 'jaxon-size' : '';

    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left"><span style="font-size:0.85rem;color:var(--text-dim)">${round + 1}/${TOTAL}</span></div>
        <div class="game-hud__right"><div class="game-hud__score">${score}</div></div>
      </div>
      <div class="game-area" style="background:linear-gradient(180deg,rgba(0,188,212,0.05),rgba(0,188,212,0.15))">
        <div style="font-size:1rem;color:var(--teal);margin-bottom:8px">Tap the letter!</div>
        <div class="question-display" style="font-size:clamp(1.5rem,5vw,2.5rem)">${ch.prompt}</div>
        <button class="btn btn-ghost" id="ls-hear" style="margin-bottom:24px;font-size:0.85rem">🔊 Hear it again</button>
        <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
          ${ch.choices.map(letter => `
            <div class="rain-drop ${sizeClass}" data-letter="${letter}" style="position:relative">
              ${letter}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Speak the sound
    speak(ch.speak);

    gameArea.querySelector('#ls-hear')?.addEventListener('click', () => speak(ch.speak));

    gameArea.querySelectorAll('.rain-drop').forEach(drop => {
      drop.addEventListener('click', () => {
        if (!active) return;
        const letter = drop.dataset.letter;
        const correct = letter === ch.answer;

        gameArea.querySelectorAll('.rain-drop').forEach(d => d.style.pointerEvents = 'none');

        if (correct) {
          drop.classList.add('splash');
          score++;
          Audio.splash();
        } else {
          drop.style.borderColor = 'var(--coral)';
          Audio.wrong();
          // Show correct
          gameArea.querySelectorAll('.rain-drop').forEach(d => {
            if (d.dataset.letter === ch.answer) d.style.borderColor = 'var(--green)';
          });
        }

        round++;
        setTimeout(renderRound, 800);
      });
    });
  }

  function endGame() {
    active = false;
    Audio.levelComplete();
    const result = onComplete(score, TOTAL);

    gameArea.innerHTML = `
      <div class="game-results">
        <div style="font-size:4rem">💧</div>
        <div class="game-results__score">${score}/${TOTAL}</div>
        <div class="game-results__label">letters caught</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="ls-retry">Play Again</button>
          <button class="btn btn-ghost" id="ls-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#ls-retry')?.addEventListener('click', () => { Audio.tap(); round=0; score=0; active=true; renderRound(); });
    gameArea.querySelector('#ls-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);
  renderRound();

  return { cleanup() { active = false; } };
}
