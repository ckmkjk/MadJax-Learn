// ===== PLAYER STORAGE & PROFILES =====
import { FirebaseSync } from './firebase-sync.js';

const STORAGE_KEY = 'madjax-learn';

const DEFAULT_PROFILES = {
  maddox: {
    id: 'maddox',
    name: 'Maddox',
    age: 8,
    grade: '3rd',
    theme: 'fire',        // fire/champion trainer
    color: '#CC2936',
    xp: 0,
    level: 1,
    totalStars: 0,
    streak: 0,
    lastPlayedDate: null,
    dailyRings: [],       // array of date strings
    avatar: { trail: 'fire', hat: 'red', color: '#CC2936' },
    unlocks: [],
    bestScores: {},       // { gameId: score }
    gamesPlayed: {},      // { gameId: count }
    starsPerGame: {},     // { gameId: stars (0-3) }
    gameLevels: {},       // { gameId: highest unlocked level (1-3) }
    lastModified: 0,
  },
  jaxon: {
    id: 'jaxon',
    name: 'Jaxon',
    age: 5,
    grade: '1st',
    theme: 'water',       // water/starter trainer
    color: '#3B4CCA',
    xp: 0,
    level: 1,
    totalStars: 0,
    streak: 0,
    lastPlayedDate: null,
    dailyRings: [],
    avatar: { trail: 'water', hat: 'blue', color: '#3B4CCA' },
    unlocks: [],
    bestScores: {},
    gamesPlayed: {},
    starsPerGame: {},
    gameLevels: {},       // { gameId: highest unlocked level (1-3) }
    lastModified: 0,
  }
};

// XP thresholds per level
const LEVEL_XP = [0, 0, 50, 120, 220, 350, 520, 730, 1000, 1340, 1750,
  2250, 2850, 3550, 4400, 5400, 6600, 8000, 9700, 11700, 14000,
  16500, 19500, 23000, 27000, 31500, 36500, 42000, 48000, 55000, 62500,
  70500, 79000, 88000, 98000, 109000, 121000, 134000, 148000, 163000, 179000,
  196000, 214000, 233000, 253000, 275000, 298000, 322000, 348000, 376000, 406000];

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Merge with defaults to handle new fields
      for (const key of Object.keys(DEFAULT_PROFILES)) {
        if (!data.profiles[key]) {
          data.profiles[key] = { ...DEFAULT_PROFILES[key] };
        } else {
          data.profiles[key] = { ...DEFAULT_PROFILES[key], ...data.profiles[key] };
        }
      }
      return data;
    }
  } catch (e) {
    console.warn('Storage load failed:', e);
  }
  return { profiles: JSON.parse(JSON.stringify(DEFAULT_PROFILES)), currentPlayer: null };
}

let _batchMode = false;

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
  if (!_batchMode && data.currentPlayer) {
    const profile = data.profiles[data.currentPlayer];
    profile.lastModified = Date.now();
    FirebaseSync.pushProfile(data.currentPlayer, profile);
  }
}

function _handleRemoteUpdate(playerId, remoteProfile) {
  if (!remoteProfile) return;
  const local = _data.profiles[playerId];
  if (remoteProfile.lastModified > (local.lastModified || 0)) {
    _data.profiles[playerId] = { ...DEFAULT_PROFILES[playerId], ...remoteProfile };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }
}

let _data = loadData();

export const Storage = {
  async init() {
    try {
      await FirebaseSync.init(_handleRemoteUpdate);
    } catch (e) {
      console.warn('Firebase init failed, using offline mode:', e);
    }
  },

  getProfiles() {
    return _data.profiles;
  },

  getProfile(id) {
    return _data.profiles[id];
  },

  getCurrentPlayer() {
    return _data.currentPlayer;
  },

  getCurrentProfile() {
    if (!_data.currentPlayer) return null;
    return _data.profiles[_data.currentPlayer];
  },

  setCurrentPlayer(id) {
    _data.currentPlayer = id;
    // Update streak
    const profile = _data.profiles[id];
    const today = new Date().toDateString();
    if (profile.lastPlayedDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (profile.lastPlayedDate === yesterday) {
        profile.streak += 1;
      } else {
        profile.streak = 1;
      }
      profile.lastPlayedDate = today;
    }
    saveData(_data);
  },

  addXP(amount) {
    const p = this.getCurrentProfile();
    if (!p) return;
    p.xp += amount;
    // Check level up
    while (p.level < 50 && LEVEL_XP[p.level + 1] !== undefined && p.xp >= LEVEL_XP[p.level + 1]) {
      p.level += 1;
    }
    saveData(_data);
    return p.level;
  },

  recordGameResult(gameId, score, maxScore) {
    const p = this.getCurrentProfile();
    if (!p) return { stars: 0, isRecord: false, xpGained: 0, newLevel: 1 };

    _batchMode = true;

    // Track games played
    p.gamesPlayed[gameId] = (p.gamesPlayed[gameId] || 0) + 1;

    // Check for new record
    const isRecord = !p.bestScores[gameId] || score > p.bestScores[gameId];
    if (isRecord) p.bestScores[gameId] = score;

    // Calculate stars (1-3)
    const pct = score / maxScore;
    const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0;

    // Only add star difference (don't remove earned stars)
    const prev = p.starsPerGame[gameId] || 0;
    if (stars > prev) {
      p.totalStars += (stars - prev);
      p.starsPerGame[gameId] = stars;
    }

    // XP: base 10 per correct + bonus
    const xpGained = score * 10 + (isRecord ? 25 : 0) + (stars === 3 ? 15 : 0);
    this.addXP(xpGained);

    // Level progression: unlock next level if 2+ stars
    let leveledUp = false;
    if (stars >= 2) {
      const currentGameLevel = p.gameLevels?.[gameId] || 1;
      if (currentGameLevel < 3) {
        if (!p.gameLevels) p.gameLevels = {};
        if (!p.gameLevels[gameId] || p.gameLevels[gameId] < currentGameLevel + 1) {
          p.gameLevels[gameId] = currentGameLevel + 1;
          leveledUp = true;
        }
      }
    }

    _batchMode = false;
    saveData(_data);
    return { stars, isRecord, xpGained, newLevel: p.level, leveledUp };
  },

  collectDailyRing() {
    const p = this.getCurrentProfile();
    if (!p) return;
    const today = new Date().toDateString();
    if (!p.dailyRings.includes(today)) {
      p.dailyRings.push(today);
      saveData(_data);
      return true;
    }
    return false;
  },

  getWeeklyRings() {
    const p = this.getCurrentProfile();
    if (!p) return 0;
    const now = Date.now();
    const weekAgo = now - 7 * 86400000;
    return p.dailyRings.filter(d => new Date(d).getTime() > weekAgo).length;
  },

  addUnlock(unlockId) {
    const p = this.getCurrentProfile();
    if (!p || p.unlocks.includes(unlockId)) return;
    p.unlocks.push(unlockId);
    saveData(_data);
  },

  hasUnlock(unlockId) {
    const p = this.getCurrentProfile();
    return p?.unlocks.includes(unlockId) || false;
  },

  getBestScore(gameId) {
    const p = this.getCurrentProfile();
    return p?.bestScores[gameId] || 0;
  },

  getTotalStarsForZone(gameIds) {
    const p = this.getCurrentProfile();
    if (!p) return 0;
    return gameIds.reduce((sum, id) => sum + (p.starsPerGame[id] || 0), 0);
  },

  isJaxon() {
    return _data.currentPlayer === 'jaxon';
  },

  isMaddox() {
    return _data.currentPlayer === 'maddox';
  },

  getLevelProgress() {
    const p = this.getCurrentProfile();
    if (!p) return 0;
    const current = LEVEL_XP[p.level] || 0;
    const next = LEVEL_XP[p.level + 1] || current + 1000;
    const range = next - current;
    return range > 0 ? (p.xp - current) / range : 1;
  },

  // ===== LEVEL PROGRESSION =====
  getGameLevel(gameId) {
    const p = this.getCurrentProfile();
    if (!p) return 1;
    return p.gameLevels?.[gameId] || 1;
  },

  unlockNextLevel(gameId) {
    const p = this.getCurrentProfile();
    if (!p) return;
    const current = p.gameLevels?.[gameId] || 1;
    if (current < 3) {
      if (!p.gameLevels) p.gameLevels = {};
      p.gameLevels[gameId] = current + 1;
      saveData(_data);
    }
  },

  // ===== ADMIN METHODS =====
  getPin() {
    try {
      return localStorage.getItem('madjax-admin-pin') || '1234';
    } catch { return '1234'; }
  },

  setPin(pin) {
    try {
      localStorage.setItem('madjax-admin-pin', pin);
    } catch (e) {
      console.warn('Failed to save PIN:', e);
    }
  },

  checkPin(pin) {
    return pin === this.getPin();
  },

  resetGameProgress(playerId, gameId) {
    const p = _data.profiles[playerId];
    if (!p) return;
    const oldStars = p.starsPerGame[gameId] || 0;
    p.totalStars = Math.max(0, p.totalStars - oldStars);
    delete p.bestScores[gameId];
    delete p.gamesPlayed[gameId];
    delete p.starsPerGame[gameId];
    if (p.gameLevels) delete p.gameLevels[gameId];
    saveData(_data);
  },

  resetPlayerProgress(playerId) {
    const name = _data.profiles[playerId]?.name;
    _data.profiles[playerId] = { ...JSON.parse(JSON.stringify(DEFAULT_PROFILES[playerId])) };
    if (name) _data.profiles[playerId].name = name;
    saveData(_data);
  },

  getAllData() {
    return _data;
  }
};
