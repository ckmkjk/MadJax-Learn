// ===== FLOOR IS LAVA — Question Generators =====

// Generate a math question based on difficulty
export function genMathQuestion(isJaxon) {
  if (isJaxon) {
    // First grade: addition/subtraction within 20
    const op = Math.random() < 0.6 ? '+' : '-';
    if (op === '+') {
      const a = Math.floor(Math.random() * 15) + 1;
      const b = Math.floor(Math.random() * (20 - a)) + 1;
      const answer = a + b;
      return { question: `${a} + ${b} = ?`, answer, choices: genChoices(answer, 1, 20) };
    }
    const a = Math.floor(Math.random() * 15) + 5; // 5-19
    const b = Math.floor(Math.random() * a) + 1;
    const answer = a - b;
    return { question: `${a} - ${b} = ?`, answer, choices: genChoices(answer, 0, 20) };
  }
  // Maddox: addition, subtraction, multiplication within 100
  const roll = Math.random();
  if (roll < 0.4) {
    // Addition
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * (100 - a)) + 1;
    const answer = a + b;
    return { question: `${a} + ${b} = ?`, answer, choices: genChoices(answer, 10, 100) };
  }
  if (roll < 0.7) {
    // Subtraction
    const a = Math.floor(Math.random() * 80) + 20;
    const b = Math.floor(Math.random() * a) + 1;
    const answer = a - b;
    return { question: `${a} - ${b} = ?`, answer, choices: genChoices(answer, 0, 100) };
  }
  // Multiplication
  const a = Math.floor(Math.random() * 10) + 2;
  const b = Math.floor(Math.random() * 10) + 2;
  const answer = a * b;
  return { question: `${a} × ${b} = ?`, answer, choices: genChoices(answer, 4, 100) };
}

// Generate a reading/word question
const RHYME_SETS = [
  { word: 'cat', rhymes: 'bat', wrong: ['dog', 'cup', 'pen'] },
  { word: 'dog', rhymes: 'fog', wrong: ['cat', 'sun', 'hen'] },
  { word: 'sun', rhymes: 'fun', wrong: ['hat', 'pig', 'red'] },
  { word: 'bed', rhymes: 'red', wrong: ['cup', 'fox', 'bat'] },
  { word: 'hop', rhymes: 'top', wrong: ['run', 'big', 'fan'] },
  { word: 'bug', rhymes: 'rug', wrong: ['cat', 'hot', 'ten'] },
  { word: 'man', rhymes: 'can', wrong: ['bed', 'pig', 'cup'] },
  { word: 'log', rhymes: 'hog', wrong: ['sun', 'hat', 'big'] },
  { word: 'pin', rhymes: 'win', wrong: ['bat', 'cup', 'dog'] },
  { word: 'ring', rhymes: 'sing', wrong: ['ball', 'tree', 'cake'] },
  { word: 'cake', rhymes: 'lake', wrong: ['fish', 'hand', 'moon'] },
  { word: 'star', rhymes: 'car', wrong: ['book', 'duck', 'rain'] },
  { word: 'tree', rhymes: 'free', wrong: ['ball', 'lamp', 'ring'] },
  { word: 'night', rhymes: 'light', wrong: ['dream', 'snake', 'world'] },
  { word: 'train', rhymes: 'rain', wrong: ['cloud', 'ghost', 'space'] },
];

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a;
}

export function genReadingQuestion(isJaxon) {
  const set = RHYME_SETS[Math.floor(Math.random() * RHYME_SETS.length)];
  const wrongChoices = isJaxon ? set.wrong.slice(0, 2) : set.wrong;
  return {
    question: `What rhymes with "${set.word}"?`,
    answer: set.rhymes,
    choices: shuffle([set.rhymes, ...wrongChoices]),
    isWord: true,
  };
}

// Generate numeric choices around the correct answer
function genChoices(answer, min, max) {
  const choices = new Set([answer]);
  let attempts = 0;
  while (choices.size < 4 && attempts < 50) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const c = answer + (offset === 0 ? 1 : offset);
    if (c >= min && c <= max && c !== answer) choices.add(c);
    attempts++;
  }
  // Fill remaining if needed
  while (choices.size < 4) {
    choices.add(Math.floor(Math.random() * (max - min)) + min);
  }
  return shuffle([...choices]);
}
