// ===== MAIN APP — ROUTING & SCREEN MANAGEMENT =====
import { Storage } from './storage.js';
import { Audio } from './audio.js';
import { createAvatar, createMiniAvatar, starSVG } from './avatars.js';

const app = document.getElementById('app');
let currentScreen = null;
let currentGame = null;

// ===== SCREEN MANAGEMENT =====
function showScreen(id, buildFn) {
  // Exit current
  if (currentScreen) {
    currentScreen.classList.remove('active');
    currentScreen.classList.add('exit');
    const old = currentScreen;
    setTimeout(() => old.remove(), 300);
  }
  // Build new
  const el = document.createElement('div');
  el.className = `screen ${id}`;
  el.id = `screen-${id}`;
  buildFn(el);
  app.appendChild(el);
  // Force reflow then activate
  el.offsetHeight;
  requestAnimationFrame(() => el.classList.add('active'));
  currentScreen = el;
}

// ===== PLAYER SELECT SCREEN =====
function showPlayerSelect() {
  currentGame = null;
  showScreen('player-select', (el) => {
    const profiles = Storage.getProfiles();
    el.innerHTML = `
      <div class="speed-lines" style="position:absolute;inset:0;pointer-events:none"></div>
      <div class="text-center" style="position:relative;z-index:1">
        <h1 class="player-select__title">MadJax Learn</h1>
        <p class="player-select__subtitle">Choose your player</p>
      </div>
      <div class="player-cards" style="position:relative;z-index:1">
        ${buildPlayerCard('maddox', profiles.maddox)}
        ${buildPlayerCard('jaxon', profiles.jaxon)}
      </div>
    `;

    el.querySelectorAll('.player-card').forEach(card => {
      card.addEventListener('click', () => {
        Audio.init();
        Audio.tap();
        const id = card.dataset.player;
        Storage.setCurrentPlayer(id);
        showHub();
      });
    });
  });
}

function buildPlayerCard(id, profile) {
  const themeClass = id === 'maddox' ? 'player-card--maddox' : 'player-card--jaxon';
  return `
    <div class="player-card ${themeClass}" data-player="${id}">
      <div class="player-card__avatar">${createAvatar(id)}</div>
      <div class="player-card__name">${profile.name}</div>
      <div class="player-card__stats">
        <span class="player-card__stat">
          <span class="player-card__stat-icon">${starSVG(16, true)}</span>
          ${profile.totalStars}
        </span>
        <span class="player-card__stat">
          <span class="player-card__stat-icon">⚡</span>
          Lv ${profile.level}
        </span>
      </div>
      <div class="player-card__streak">
        ${profile.streak > 1 ? `🔥 ${profile.streak} day streak` : ''}
      </div>
      <div class="player-card__tap">TAP TO PLAY</div>
    </div>
  `;
}

// ===== GAME HUB =====
const ZONES = [
  {
    id: 'math', name: 'Speed Zone', desc: 'Math challenges — be fast, be accurate',
    theme: 'zone-card--math', icon: '⚡',
    games: [
      { id: 'ring-rush', name: 'Ring Rush', icon: '💍', module: './games/ring-rush.js' },
      { id: 'number-blaster', name: 'Number Blaster', icon: '💥', module: './games/number-blaster.js' },
      { id: 'speed-duel', name: 'Speed Duel', icon: '⚔️', module: './games/speed-duel.js' },
    ]
  },
  {
    id: 'reading', name: 'Word Jungle', desc: 'Reading & spelling adventures',
    theme: 'zone-card--reading', icon: '🌿',
    games: [
      { id: 'word-builder', name: 'Word Builder', icon: '🔤', module: './games/word-builder.js' },
      { id: 'story-sprint', name: 'Story Sprint', icon: '📖', module: './games/story-sprint.js' },
      { id: 'letter-splash', name: 'Letter Splash', icon: '💧', module: './games/letter-splash.js' },
    ]
  },
  {
    id: 'puzzle', name: 'Puzzle Dimension', desc: 'Logic, memory & pattern challenges',
    theme: 'zone-card--puzzle', icon: '🔮',
    games: [
      { id: 'pattern-portal', name: 'Pattern Portal', icon: '🌀', module: './games/pattern-portal.js' },
      { id: 'memory-matrix', name: 'Memory Matrix', icon: '🃏', module: './games/memory-matrix.js' },
      { id: 'maze-runner', name: 'Maze Runner', icon: '🏃', module: './games/maze-runner.js' },
    ]
  },
  {
    id: 'daily', name: 'Daily Ring Run', desc: 'Mixed daily challenge — earn your ring!',
    theme: 'zone-card--daily', icon: '💍',
    games: [
      { id: 'ring-run', name: 'Ring Run', icon: '🏆', module: './games/ring-run.js' },
    ]
  }
];

function showHub() {
  const profile = Storage.getCurrentProfile();
  if (!profile) return showPlayerSelect();

  showScreen('hub', (el) => {
    el.innerHTML = `
      <div class="hub__header">
        <div class="hub__player-info">
          <div class="hub__player-avatar">${createMiniAvatar(profile.id)}</div>
          <div>
            <div class="hub__player-name">${profile.name}</div>
            <div class="hub__player-level">Level ${profile.level}</div>
          </div>
        </div>
        <div class="hub__player-stats">
          <div class="hub__stat">${starSVG(16, true)} <span class="hub__stat-value">${profile.totalStars}</span></div>
          <div class="hub__stat">⚡ <span class="hub__stat-value">${profile.xp}</span></div>
        </div>
      </div>
      <div class="hub__zones dot-grid">
        ${ZONES.map(zone => buildZoneCard(zone, profile)).join('')}
      </div>
    `;

    // Zone expand/collapse and game launch
    el.querySelectorAll('.zone-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking a game entry, launch the game
        const gameEntry = e.target.closest('.game-entry');
        if (gameEntry) {
          e.stopPropagation();
          Audio.tap();
          launchGame(gameEntry.dataset.gameId, gameEntry.dataset.module);
          return;
        }
        // Toggle zone expansion
        Audio.tap();
        const list = card.querySelector('.zone-card__games-list');
        if (list) {
          const isVisible = list.style.display !== 'none';
          // Close all others
          el.querySelectorAll('.zone-card__games-list').forEach(l => l.style.display = 'none');
          list.style.display = isVisible ? 'none' : 'flex';
        }
      });
    });

    // Switch player button
    el.querySelector('.hub__player-avatar')?.addEventListener('click', () => {
      Audio.tap();
      showPlayerSelect();
    });
  });
}

function buildZoneCard(zone, profile) {
  const totalStars = Storage.getTotalStarsForZone(zone.games.map(g => g.id));
  const maxStars = zone.games.length * 3;

  return `
    <div class="zone-card ${zone.theme}">
      <div class="zone-card__icon">${zone.icon}</div>
      <div class="zone-card__info">
        <h3 class="zone-card__name">${zone.name}</h3>
        <p class="zone-card__desc">${zone.desc}</p>
        <div class="zone-card__progress">
          <div class="progress-bar" style="flex:1">
            <div class="progress-fill" style="width:${(totalStars/maxStars)*100}%"></div>
          </div>
          <span class="zone-card__stars">${starSVG(14, true)} ${totalStars}/${maxStars}</span>
        </div>
        <div class="zone-card__games-list" style="display:none">
          ${zone.games.map(g => `
            <div class="game-entry" data-game-id="${g.id}" data-module="${g.module}">
              <span class="game-entry__icon">${g.icon}</span>
              <span class="game-entry__name">${g.name}</span>
              <span class="game-entry__best">
                ${Storage.getBestScore(g.id) ? `Best: ${Storage.getBestScore(g.id)}` : ''}
              </span>
              <span>${[0,1,2].map(i => starSVG(14, i < (profile.starsPerGame[g.id] || 0))).join('')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ===== GAME LAUNCHER =====
async function launchGame(gameId, modulePath) {
  try {
    const module = await import(modulePath);
    showScreen('game-screen', (el) => {
      el.classList.add('game-screen');
      // Add back button
      const backBtn = document.createElement('button');
      backBtn.className = 'back-btn';
      backBtn.innerHTML = '← Back';
      backBtn.addEventListener('click', () => {
        Audio.tap();
        if (currentGame?.cleanup) currentGame.cleanup();
        currentGame = null;
        showHub();
      });
      el.appendChild(backBtn);

      // Init game
      currentGame = module.init(el, {
        storage: Storage,
        audio: Audio,
        isJaxon: Storage.isJaxon(),
        isMaddox: Storage.isMaddox(),
        profile: Storage.getCurrentProfile(),
        onComplete: (score, maxScore) => {
          return Storage.recordGameResult(gameId, score, maxScore);
        },
        onBack: () => {
          if (currentGame?.cleanup) currentGame.cleanup();
          currentGame = null;
          showHub();
        },
        starSVG,
      });
    });
  } catch (err) {
    console.error('Failed to load game:', err);
    showHub();
  }
}

// ===== GLOBAL: Prevent double-tap zoom on iOS =====
let lastTap = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 300) e.preventDefault();
  lastTap = now;
}, { passive: false });

// ===== INIT =====
Storage.init().then(() => showPlayerSelect());
