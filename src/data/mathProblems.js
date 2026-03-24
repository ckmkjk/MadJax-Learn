// Math problems organized by difficulty level
// Level 1: Counting & recognition (Jaxon - age 5)
// Level 2: Simple addition/subtraction within 10 (Jaxon advanced / Maddox starter)
// Level 3: Addition/subtraction within 20 (Maddox - age 7)
// Level 4: Harder problems, missing numbers (Maddox advanced)

export const mathProblems = {
  1: [
    { question: 'How many rings? 🟡🟡🟡', answer: 3, choices: [2, 3, 4] },
    { question: 'How many rings? 🟡🟡🟡🟡🟡', answer: 5, choices: [4, 5, 6] },
    { question: 'How many rings? 🟡🟡', answer: 2, choices: [1, 2, 3] },
    { question: 'How many rings? 🟡🟡🟡🟡', answer: 4, choices: [3, 4, 5] },
    { question: 'How many rings? 🟡', answer: 1, choices: [1, 2, 3] },
    { question: 'How many rings? 🟡🟡🟡🟡🟡🟡', answer: 6, choices: [5, 6, 7] },
    { question: 'Which is bigger: 3 or 5?', answer: 5, choices: [3, 5] },
    { question: 'Which is bigger: 7 or 4?', answer: 7, choices: [4, 7] },
    { question: 'Which is bigger: 2 or 8?', answer: 8, choices: [2, 8] },
    { question: 'Which is smaller: 6 or 3?', answer: 3, choices: [6, 3] },
    { question: 'What comes after 5?', answer: 6, choices: [4, 6, 7] },
    { question: 'What comes after 9?', answer: 10, choices: [8, 10, 11] },
    { question: 'What comes before 4?', answer: 3, choices: [2, 3, 5] },
    { question: 'What shape has 3 sides?', answer: 'Triangle', choices: ['Square', 'Triangle', 'Circle'] },
    { question: 'What shape has 4 equal sides?', answer: 'Square', choices: ['Square', 'Triangle', 'Circle'] },
    { question: 'What shape is round?', answer: 'Circle', choices: ['Square', 'Triangle', 'Circle'] },
  ],
  2: [
    { question: '2 + 1 = ?', answer: 3, choices: [2, 3, 4] },
    { question: '3 + 2 = ?', answer: 5, choices: [4, 5, 6] },
    { question: '4 + 3 = ?', answer: 7, choices: [6, 7, 8] },
    { question: '5 + 2 = ?', answer: 7, choices: [6, 7, 8] },
    { question: '1 + 6 = ?', answer: 7, choices: [5, 7, 8] },
    { question: '5 + 5 = ?', answer: 10, choices: [9, 10, 11] },
    { question: '4 + 4 = ?', answer: 8, choices: [7, 8, 9] },
    { question: '3 - 1 = ?', answer: 2, choices: [1, 2, 3] },
    { question: '5 - 2 = ?', answer: 3, choices: [2, 3, 4] },
    { question: '7 - 3 = ?', answer: 4, choices: [3, 4, 5] },
    { question: '6 - 4 = ?', answer: 2, choices: [1, 2, 3] },
    { question: '8 - 5 = ?', answer: 3, choices: [2, 3, 4] },
    { question: '10 - 3 = ?', answer: 7, choices: [6, 7, 8] },
    { question: '9 - 4 = ?', answer: 5, choices: [4, 5, 6] },
    { question: '2 + 5 = ?', answer: 7, choices: [6, 7, 8] },
    { question: '6 + 3 = ?', answer: 9, choices: [8, 9, 10] },
  ],
  3: [
    { question: '8 + 5 = ?', answer: 13, choices: [12, 13, 14] },
    { question: '7 + 6 = ?', answer: 13, choices: [12, 13, 14] },
    { question: '9 + 4 = ?', answer: 13, choices: [12, 13, 14] },
    { question: '6 + 8 = ?', answer: 14, choices: [13, 14, 15] },
    { question: '9 + 7 = ?', answer: 16, choices: [15, 16, 17] },
    { question: '8 + 9 = ?', answer: 17, choices: [16, 17, 18] },
    { question: '7 + 7 = ?', answer: 14, choices: [13, 14, 15] },
    { question: '15 - 7 = ?', answer: 8, choices: [7, 8, 9] },
    { question: '13 - 6 = ?', answer: 7, choices: [6, 7, 8] },
    { question: '17 - 9 = ?', answer: 8, choices: [7, 8, 9] },
    { question: '14 - 8 = ?', answer: 6, choices: [5, 6, 7] },
    { question: '16 - 7 = ?', answer: 9, choices: [8, 9, 10] },
    { question: '11 + 5 = ?', answer: 16, choices: [15, 16, 17] },
    { question: '12 + 6 = ?', answer: 18, choices: [17, 18, 19] },
    { question: '20 - 8 = ?', answer: 12, choices: [11, 12, 13] },
    { question: '18 - 9 = ?', answer: 9, choices: [8, 9, 10] },
  ],
  4: [
    { question: '? + 8 = 15', answer: 7, choices: [6, 7, 8] },
    { question: '? + 6 = 14', answer: 8, choices: [7, 8, 9] },
    { question: '12 - ? = 5', answer: 7, choices: [6, 7, 8] },
    { question: '? - 9 = 8', answer: 17, choices: [16, 17, 18] },
    { question: '7 + ? = 16', answer: 9, choices: [8, 9, 10] },
    { question: '20 - ? = 11', answer: 9, choices: [8, 9, 10] },
    { question: '? + ? = 10 (same number)', answer: 5, choices: [4, 5, 6] },
    { question: '15 - ? = 9', answer: 6, choices: [5, 6, 7] },
    { question: '? + 7 = 13', answer: 6, choices: [5, 6, 7] },
    { question: '18 - ? = 9', answer: 9, choices: [8, 9, 10] },
    { question: '6 + 5 + 2 = ?', answer: 13, choices: [12, 13, 14] },
    { question: '3 + 4 + 5 = ?', answer: 12, choices: [11, 12, 13] },
    { question: '10 + 10 = ?', answer: 20, choices: [18, 19, 20] },
    { question: '9 + 9 = ?', answer: 18, choices: [17, 18, 19] },
    { question: '8 + 8 = ?', answer: 16, choices: [15, 16, 17] },
    { question: '7 + 8 + 2 = ?', answer: 17, choices: [16, 17, 18] },
  ],
}

export function getProblemsForProfile(profile) {
  if (profile.age <= 5) {
    return { startLevel: 1, maxLevel: 2 }
  }
  return { startLevel: 2, maxLevel: 4 }
}
