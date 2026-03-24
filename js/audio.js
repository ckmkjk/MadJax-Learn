// ===== WEB AUDIO API SOUND ENGINE =====
// Zero external dependencies — all sounds generated with oscillators

let ctx = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15, attack = 0.01, decay = null) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (decay || duration));
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

function playNoise(duration, volume = 0.08) {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 1;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  source.start(c.currentTime);
}

export const Audio = {
  // Satisfying "ding" — correct answer
  correct() {
    playTone(880, 0.15, 'sine', 0.12, 0.005);
    setTimeout(() => playTone(1320, 0.2, 'sine', 0.1, 0.005), 60);
  },

  // Soft "bonk" — wrong answer
  wrong() {
    playTone(220, 0.2, 'triangle', 0.1, 0.005, 0.15);
    playNoise(0.08, 0.04);
  },

  // Quick click/pop — button tap
  tap() {
    playTone(660, 0.06, 'sine', 0.06, 0.003);
  },

  // Ring collect sound — escalating pitch
  ring(combo = 0) {
    const baseFreq = 523 + (combo * 80); // escalates with streak
    playTone(baseFreq, 0.1, 'sine', 0.1, 0.005);
    setTimeout(() => playTone(baseFreq * 1.5, 0.08, 'sine', 0.08, 0.005), 40);
  },

  // Streak activate — whoosh
  streak() {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.4);
  },

  // Level complete jingle — short celebration
  levelComplete() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, 'sine', 0.1, 0.01), i * 120);
    });
    setTimeout(() => {
      playTone(1047, 0.5, 'triangle', 0.08, 0.01);
    }, notes.length * 120);
  },

  // New record fanfare
  newRecord() {
    const notes = [523, 659, 784, 880, 1047, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.1, 0.008), i * 80);
    });
  },

  // Countdown beep
  countdown() {
    playTone(440, 0.12, 'square', 0.06, 0.005);
  },

  // Go! sound
  go() {
    playTone(880, 0.3, 'sine', 0.12, 0.01);
  },

  // Water splash (for Jaxon)
  splash() {
    playNoise(0.15, 0.1);
    playTone(300, 0.2, 'sine', 0.06, 0.01, 0.15);
    setTimeout(() => playNoise(0.1, 0.06), 80);
  },

  // Pop (for bubbles)
  pop() {
    playTone(1200, 0.08, 'sine', 0.1, 0.003);
    playNoise(0.04, 0.05);
  },

  // Card flip
  flip() {
    playTone(500, 0.06, 'triangle', 0.06, 0.003);
  },

  // Match found
  match() {
    playTone(660, 0.12, 'sine', 0.1, 0.005);
    setTimeout(() => playTone(880, 0.15, 'sine', 0.08, 0.005), 80);
  },

  // Letter snap into place
  snap() {
    playTone(800, 0.08, 'sine', 0.08, 0.003);
    playNoise(0.03, 0.03);
  },

  // Unlock sound
  unlock() {
    const notes = [440, 554, 659, 880];
    notes.forEach((f, i) => setTimeout(() => playTone(f, 0.15, 'sine', 0.08), i * 70));
  },

  // Ensure audio context is ready (call on first user interaction)
  init() {
    getCtx();
  }
};
