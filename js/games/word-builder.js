// ===== WORD BUILDER — Drag/tap letters to spell words =====
import { Audio } from '../audio.js';
import { CVC_WORDS, FIRST_GRADE_WORDS, SPELLING_WORDS } from '../../data/words.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

function getWordList(isJaxon) {
  if (isJaxon) {
    // Mix CVC and first-grade 4-letter words
    const mixed = shuffle([...CVC_WORDS, ...FIRST_GRADE_WORDS]);
    return mixed.slice(0, 8);
  }
  return shuffle([...SPELLING_WORDS]).slice(0, 8);
}

export function init(container, ctx) {
  const { isJaxon, onComplete, onBack, starSVG } = ctx;
  const words = getWordList(isJaxon);
  const TOTAL = words.length;
  let idx = 0;
  let score = 0;
  let active = true;
  let currentSlots = [];
  let slotIndex = 0;

  const gameArea = document.createElement('div');
  gameArea.style.cssText = 'display:flex;flex-direction:column;height:100%;padding-top:56px;';

  function renderWord() {
    if (idx >= TOTAL) return endGame();
    const w = words[idx];
    const word = w.word.toUpperCase();
    slotIndex = 0;
    currentSlots = new Array(word.length).fill(null);

    // Generate letters: word letters + decoys (Maddox only)
    let letters = word.split('');
    const decoys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => !letters.includes(l));
    if (isJaxon) {
      // First grade: add 1 decoy letter for mild challenge
      letters = [...letters, ...shuffle(decoys).slice(0, 1)];
    } else {
      letters = [...letters, ...shuffle(decoys).slice(0, 2)];
    }
    letters = shuffle(letters);

    const sizeClass = isJaxon ? 'jaxon-size' : '';

    gameArea.innerHTML = `
      <div class="game-hud">
        <div class="game-hud__left">
          <span style="font-size:0.85rem;color:var(--text-dim)">${idx + 1}/${TOTAL}</span>
        </div>
        <div class="game-hud__right">
          <div class="game-hud__score">${score}</div>
        </div>
      </div>
      <div class="game-area">
        <div style="font-size:3rem;margin-bottom:8px">${w.hint}</div>
        ${isJaxon ? `<div style="font-size:0.9rem;color:var(--text-dim);margin-bottom:16px">Spell: ${word}</div>` : ''}
        <div class="letter-slots" id="wb-slots">
          ${word.split('').map((_, i) => `<div class="letter-slot ${sizeClass}" data-idx="${i}"></div>`).join('')}
        </div>
        <div class="letter-tray" id="wb-tray">
          ${letters.map((l, i) => `<div class="letter-tile ${sizeClass}" data-letter="${l}" data-tidx="${i}">${l}</div>`).join('')}
        </div>
      </div>
    `;

    const slotEls = gameArea.querySelectorAll('.letter-slot');
    const tileEls = gameArea.querySelectorAll('.letter-tile');

    tileEls.forEach(tile => {
      tile.addEventListener('click', () => {
        if (!active || tile.classList.contains('used')) return;
        const letter = tile.dataset.letter;

        // Place in next empty slot
        if (slotIndex >= word.length) return;
        currentSlots[slotIndex] = { letter, tileIdx: parseInt(tile.dataset.tidx) };
        slotEls[slotIndex].textContent = letter;
        slotEls[slotIndex].classList.add('filled');
        tile.classList.add('used');
        Audio.snap();
        slotIndex++;

        // Check if complete
        if (slotIndex === word.length) {
          const spelled = currentSlots.map(s => s.letter).join('');
          if (spelled === word) {
            // Correct!
            score++;
            slotEls.forEach(s => s.classList.add('correct'));
            Audio.correct();
            setTimeout(() => { idx++; renderWord(); }, 800);
          } else {
            // Wrong — bounce back
            Audio.wrong();
            setTimeout(() => {
              currentSlots.forEach((s, i) => {
                if (s) {
                  slotEls[i].textContent = '';
                  slotEls[i].classList.remove('filled');
                  tileEls[s.tileIdx].classList.remove('used');
                }
              });
              currentSlots = new Array(word.length).fill(null);
              slotIndex = 0;
            }, 600);
          }
        }
      });
    });

    // Allow clicking slots to remove letters
    slotEls.forEach((slot, i) => {
      slot.addEventListener('click', () => {
        if (!active || !currentSlots[i]) return;
        const s = currentSlots[i];
        tileEls[s.tileIdx].classList.remove('used');
        slot.textContent = '';
        slot.classList.remove('filled');
        currentSlots[i] = null;
        // Recalculate slotIndex
        slotIndex = currentSlots.findIndex(s => s === null);
        if (slotIndex === -1) slotIndex = currentSlots.length;
        Audio.tap();
      });
    });
  }

  function endGame() {
    active = false;
    Audio.levelComplete();
    const result = onComplete(score, TOTAL);

    gameArea.innerHTML = `
      <div class="game-results">
        <div class="game-results__score">${score}/${TOTAL}</div>
        <div class="game-results__label">words spelled</div>
        <div class="game-results__stars">
          ${[0,1,2].map(i => `<div class="game-results__star ${i < result.stars ? 'earned' : ''}" style="animation-delay:${i*0.15}s">${starSVG(40, i < result.stars)}</div>`).join('')}
        </div>
        ${result.isRecord ? '<div class="game-results__record">🎆 NEW RECORD!</div>' : ''}
        <div class="game-results__xp">+${result.xpGained} XP</div>
        <div class="game-results__actions">
          <button class="btn btn-primary" id="wb-retry">Play Again</button>
          <button class="btn btn-ghost" id="wb-back">Back to Hub</button>
        </div>
      </div>
    `;

    gameArea.querySelector('#wb-retry')?.addEventListener('click', () => { Audio.tap(); idx=0; score=0; active=true; renderWord(); });
    gameArea.querySelector('#wb-back')?.addEventListener('click', () => { Audio.tap(); onBack(); });
  }

  container.appendChild(gameArea);
  renderWord();

  return { cleanup() { active = false; } };
}
