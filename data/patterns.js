// ===== PATTERN SEQUENCES FOR PATTERN PORTAL =====
// Display: show full seq, then "?" — answer is what comes NEXT

const SHAPES = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⬜', '⬛'];
const SHAPE_NAMES = ['⭐', '💎', '🔶', '🔷', '❤️', '🌙', '☀️', '🍀'];

// Patterns for Jaxon — AB, ABB, ABC (first-grade appropriate)
export const PATTERNS_EASY = [
  // AB alternating
  { seq: ['🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', choices: ['🔵', '🟢', '🟡'] },
  { seq: ['🟢', '🟡', '🟢', '🟡', '🟢'], answer: '🟡', choices: ['🔴', '🟡', '🔵'] },
  { seq: ['🟡', '🟢', '🟡', '🟢', '🟡'], answer: '🟢', choices: ['🟡', '🟢', '🔴'] },
  { seq: ['❤️', '🌙', '❤️', '🌙', '❤️'], answer: '🌙', choices: ['🌙', '❤️', '☀️'] },
  { seq: ['☀️', '🌙', '☀️', '🌙', '☀️'], answer: '🌙', choices: ['☀️', '🌙', '⭐'] },
  { seq: ['💎', '⭐', '💎', '⭐', '💎'], answer: '⭐', choices: ['⭐', '💎', '🔶'] },
  { seq: ['🔶', '🔷', '🔶', '🔷', '🔶'], answer: '🔷', choices: ['🔶', '🔷', '🔴'] },
  // AAB repeating
  { seq: ['⭐', '⭐', '💎', '⭐', '⭐'], answer: '💎', choices: ['💎', '⭐', '🔶'] },
  { seq: ['🔴', '🔴', '🔵', '🔴', '🔴'], answer: '🔵', choices: ['🔴', '🔵', '🟢'] },
  { seq: ['🔵', '🔵', '🔴', '🔵', '🔵'], answer: '🔴', choices: ['🔵', '🟢', '🔴'] },
  { seq: ['🟣', '🟣', '🟡', '🟣', '🟣'], answer: '🟡', choices: ['🟣', '🟡', '🔵'] },
  // ABC repeating
  { seq: ['🔴', '🔵', '🟢', '🔴', '🔵'], answer: '🟢', choices: ['🟢', '🔴', '🟡'] },
  { seq: ['🌙', '☀️', '⭐', '🌙', '☀️'], answer: '⭐', choices: ['⭐', '🌙', '☀️'] },
  // Counting (first grade)
  { seq: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'], answer: '5️⃣', choices: ['5️⃣', '6️⃣', '3️⃣'] },
  // Growing pattern
  { seq: ['🔴', '🔴', '🔵', '🔴', '🔴', '🔵'], answer: '🔴', choices: ['🔴', '🔵', '🟢'] },
  { seq: ['⭐', '💎', '💎', '⭐', '💎', '💎'], answer: '⭐', choices: ['⭐', '💎', '🔶'] },
];

// Complex patterns for Maddox — ABB, ABBC, growing, numeric, two-attribute
export const PATTERNS_HARD = [
  // ABB repeating
  { seq: ['🔴', '🔵', '🔵', '🔴', '🔵'], answer: '🔵', choices: ['🔴', '🔵', '🟢', '🟡'] },
  { seq: ['⭐', '💎', '💎', '⭐', '💎'], answer: '💎', choices: ['⭐', '💎', '🔶', '❤️'] },
  // ABC repeating
  { seq: ['🔴', '🔵', '🟢', '🔴', '🔵', '🟢', '🔴'], answer: '🔵', choices: ['🔴', '🔵', '🟢', '🟡'] },
  { seq: ['🔴', '🟡', '🔵', '🔴', '🟡', '🔵'], answer: '🔴', choices: ['🔴', '🟡', '🔵', '🟢'] },
  { seq: ['🌙', '☀️', '⭐', '🌙', '☀️'], answer: '⭐', choices: ['🌙', '☀️', '⭐', '💎'] },
  // AAB repeating
  { seq: ['🟡', '🟡', '🔴', '🟡', '🟡', '🔴', '🟡'], answer: '🟡', choices: ['🟡', '🔴', '🔵', '🟢'] },
  { seq: ['🔴', '🔴', '🔵', '🔴', '🔴', '🔵'], answer: '🔴', choices: ['🔴', '🔵', '🟢', '🟡'] },
  // AB alternating (long)
  { seq: ['🔴', '🔵', '🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', choices: ['🔴', '🔵', '🟣', '🟢'] },
  // AABB repeating
  { seq: ['❤️', '❤️', '🌙', '🌙', '❤️', '❤️', '🌙'], answer: '🌙', choices: ['❤️', '🌙', '☀️', '⭐'] },
  { seq: ['⭐', '⭐', '💎', '💎', '⭐', '⭐'], answer: '💎', choices: ['⭐', '💎', '🔶', '❤️'] },
  // ABB complete cycle
  { seq: ['🔴', '🔵', '🔵', '🔴', '🔵', '🔵'], answer: '🔴', choices: ['🔴', '🔵', '🟢', '🟡'] },
  // Counting sequences
  { seq: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'], answer: '6️⃣', choices: ['6️⃣', '7️⃣', '4️⃣', '8️⃣'] },
  { seq: ['2️⃣', '4️⃣', '6️⃣', '8️⃣'], answer: '🔟', choices: ['9️⃣', '🔟', '7️⃣', '5️⃣'] },
  { seq: ['1️⃣', '1️⃣', '2️⃣', '2️⃣', '3️⃣'], answer: '3️⃣', choices: ['3️⃣', '4️⃣', '2️⃣', '1️⃣'] },
  // ABCD pattern
  { seq: ['🔴', '🔵', '🟢', '🟡', '🔴', '🔵', '🟢'], answer: '🟡', choices: ['🟡', '🔴', '🟢', '🔵'] },
  // Mirror pattern
  { seq: ['🔴', '🔵', '🟢', '🔵', '🔴', '🔵', '🟢'], answer: '🔵', choices: ['🔵', '🔴', '🟢', '🟡'] },
  // Growing groups
  { seq: ['🔴', '🔵', '🔵', '🔴', '🔴', '🔵', '🔵', '🔵'], answer: '🔴', choices: ['🔴', '🔵', '🟢', '🟡'] },
];
