// ===== ADMIN DASHBOARD — Parent Controls =====

export function showLogin(app, showScreen, showPlayerSelect, Storage, Audio, ZONES, starSVG) {
  showScreen('admin-login', (el) => {
    el.innerHTML = `
      <div class="admin-login">
        <div class="admin-login__icon">🔒</div>
        <h2 class="admin-login__title">Parent Dashboard</h2>
        <p class="admin-login__subtitle">Enter PIN to continue</p>
        <div class="admin-pin-display" id="pin-display">
          <span class="admin-pin-dot"></span>
          <span class="admin-pin-dot"></span>
          <span class="admin-pin-dot"></span>
          <span class="admin-pin-dot"></span>
        </div>
        <div id="pin-error" style="color:var(--coral);font-size:0.85rem;min-height:24px;margin-bottom:8px"></div>
        <div class="admin-numpad" id="numpad">
          ${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(n =>
            n === '' ? '<div class="admin-numpad__key admin-numpad__key--empty"></div>' :
            `<button class="admin-numpad__key" data-key="${n}">${n}</button>`
          ).join('')}
        </div>
        <button class="btn btn-ghost" id="admin-back" style="margin-top:16px">Back</button>
      </div>
    `;

    let pin = '';
    const dots = el.querySelectorAll('.admin-pin-dot');
    const errorEl = el.querySelector('#pin-error');

    function updateDots() {
      dots.forEach((d, i) => d.classList.toggle('filled', i < pin.length));
    }

    el.querySelector('#numpad').addEventListener('click', (e) => {
      const key = e.target.closest('[data-key]')?.dataset.key;
      if (key === undefined) return;
      Audio.tap();

      if (key === '⌫') {
        pin = pin.slice(0, -1);
        errorEl.textContent = '';
        updateDots();
        return;
      }

      if (pin.length >= 4) return;
      pin += key;
      updateDots();

      if (pin.length === 4) {
        if (Storage.checkPin(pin)) {
          showDashboard(app, showScreen, showPlayerSelect, Storage, Audio, ZONES, starSVG);
        } else {
          errorEl.textContent = 'Incorrect PIN';
          setTimeout(() => { pin = ''; updateDots(); errorEl.textContent = ''; }, 1000);
        }
      }
    });

    el.querySelector('#admin-back')?.addEventListener('click', () => {
      Audio.tap();
      showPlayerSelect();
    });
  });
}

function showDashboard(app, showScreen, showPlayerSelect, Storage, Audio, ZONES, starSVG) {
  showScreen('admin-dashboard', (el) => {
    const profiles = Storage.getProfiles();

    el.innerHTML = `
      <div class="admin-dashboard">
        <div class="admin-header">
          <h2 class="admin-header__title">Parent Dashboard</h2>
          <button class="btn btn-ghost" id="admin-exit">Back to Game</button>
        </div>

        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="stats">Player Stats</button>
          <button class="admin-tab" data-tab="settings">Settings</button>
        </div>

        <div class="admin-content" id="admin-content">
          ${renderStatsTab(profiles, ZONES, starSVG)}
        </div>
      </div>
    `;

    // Tab switching
    el.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        Audio.tap();
        el.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const content = el.querySelector('#admin-content');
        if (tab.dataset.tab === 'stats') {
          content.innerHTML = renderStatsTab(Storage.getProfiles(), ZONES, starSVG);
          attachResetHandlers(content, Storage, Audio, ZONES, starSVG, el);
        } else {
          content.innerHTML = renderSettingsTab(Storage);
          attachSettingsHandlers(content, Storage, Audio);
        }
      });
    });

    attachResetHandlers(el.querySelector('#admin-content'), Storage, Audio, ZONES, starSVG, el);

    el.querySelector('#admin-exit')?.addEventListener('click', () => {
      Audio.tap();
      showPlayerSelect();
    });
  });
}

function renderStatsTab(profiles, ZONES, starSVG) {
  return ['maddox', 'jaxon'].map(id => {
    const p = profiles[id];
    const allGames = ZONES.flatMap(z => z.games);
    const totalPlayed = Object.values(p.gamesPlayed || {}).reduce((s, c) => s + c, 0);

    return `
      <div class="admin-player-card">
        <div class="admin-player-card__header" style="border-left:4px solid ${p.color}">
          <h3>${p.name}</h3>
          <span class="admin-badge">Level ${p.level}</span>
        </div>
        <div class="admin-stats-grid">
          <div class="admin-stat">
            <div class="admin-stat__value">${p.xp}</div>
            <div class="admin-stat__label">Total XP</div>
          </div>
          <div class="admin-stat">
            <div class="admin-stat__value">${p.totalStars}</div>
            <div class="admin-stat__label">Stars Earned</div>
          </div>
          <div class="admin-stat">
            <div class="admin-stat__value">${totalPlayed}</div>
            <div class="admin-stat__label">Games Played</div>
          </div>
          <div class="admin-stat">
            <div class="admin-stat__value">${p.streak || 0}🔥</div>
            <div class="admin-stat__label">Day Streak</div>
          </div>
        </div>

        <div class="admin-games-list">
          <h4 style="margin-bottom:8px;color:var(--text-dim);font-size:0.85rem">Game Progress</h4>
          ${allGames.map(g => {
            const stars = p.starsPerGame?.[g.id] || 0;
            const best = p.bestScores?.[g.id] || 0;
            const played = p.gamesPlayed?.[g.id] || 0;
            const gameLevel = p.gameLevels?.[g.id] || 1;
            return `
              <div class="admin-game-row">
                <span class="admin-game-row__icon">${g.icon}</span>
                <span class="admin-game-row__name">${g.name}</span>
                <span class="admin-game-row__level">Lv${gameLevel}</span>
                <span class="admin-game-row__stars">${[0,1,2].map(i => starSVG(14, i < stars)).join('')}</span>
                <span class="admin-game-row__info">Best: ${best} | Played: ${played}</span>
                <button class="btn-tiny btn-danger" data-reset-game="${g.id}" data-player="${id}" title="Reset">✕</button>
              </div>
            `;
          }).join('')}
        </div>

        <button class="btn btn-danger btn-sm" data-reset-player="${id}" style="margin-top:12px">
          Reset All Progress for ${p.name}
        </button>
      </div>
    `;
  }).join('');
}

function renderSettingsTab(Storage) {
  return `
    <div class="admin-settings">
      <div class="admin-setting-group">
        <h4>Change PIN</h4>
        <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
          <input type="password" id="new-pin" maxlength="4" pattern="[0-9]*" inputmode="numeric"
            placeholder="New 4-digit PIN" class="admin-input" style="width:160px">
          <button class="btn btn-primary btn-sm" id="save-pin">Save</button>
        </div>
        <div id="pin-msg" style="font-size:0.8rem;margin-top:4px;min-height:20px"></div>
      </div>

      <div class="admin-setting-group" style="margin-top:24px">
        <h4>About</h4>
        <p style="color:var(--text-dim);font-size:0.85rem;margin-top:4px">
          MadJax Learn — Pokemon-themed educational games<br>
          Built for Maddox (age 8) & Jaxon (age 5)
        </p>
      </div>
    </div>
  `;
}

function attachResetHandlers(content, Storage, Audio, ZONES, starSVG, el) {
  // Reset individual game
  content.querySelectorAll('[data-reset-game]').forEach(btn => {
    btn.addEventListener('click', () => {
      const gameId = btn.dataset.resetGame;
      const playerId = btn.dataset.player;
      if (confirm(`Reset progress for this game?`)) {
        Audio.tap();
        Storage.resetGameProgress(playerId, gameId);
        // Re-render stats
        el.querySelector('#admin-content').innerHTML = renderStatsTab(Storage.getProfiles(), ZONES, starSVG);
        attachResetHandlers(el.querySelector('#admin-content'), Storage, Audio, ZONES, starSVG, el);
      }
    });
  });

  // Reset all player progress
  content.querySelectorAll('[data-reset-player]').forEach(btn => {
    btn.addEventListener('click', () => {
      const playerId = btn.dataset.resetPlayer;
      if (confirm(`Reset ALL progress for ${playerId}? This cannot be undone.`)) {
        Audio.tap();
        Storage.resetPlayerProgress(playerId);
        el.querySelector('#admin-content').innerHTML = renderStatsTab(Storage.getProfiles(), ZONES, starSVG);
        attachResetHandlers(el.querySelector('#admin-content'), Storage, Audio, ZONES, starSVG, el);
      }
    });
  });
}

function attachSettingsHandlers(content, Storage, Audio) {
  const saveBtn = content.querySelector('#save-pin');
  const input = content.querySelector('#new-pin');
  const msg = content.querySelector('#pin-msg');

  saveBtn?.addEventListener('click', () => {
    const val = input.value.trim();
    if (val.length !== 4 || !/^\d{4}$/.test(val)) {
      msg.textContent = 'PIN must be exactly 4 digits';
      msg.style.color = 'var(--coral)';
      return;
    }
    Storage.setPin(val);
    Audio.correct();
    msg.textContent = 'PIN saved!';
    msg.style.color = 'var(--green)';
    input.value = '';
  });
}
