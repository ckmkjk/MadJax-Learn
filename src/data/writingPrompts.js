// Writing prompts organized by difficulty level
// Level 1: Letter tracing & name writing (Jaxon - age 5)
// Level 2: Simple words & short responses (Jaxon advanced / Maddox starter)
// Level 3: Full sentences (Maddox - age 7)
// Level 4: Creative writing & stories (Maddox advanced)

export const writingPrompts = {
  1: [
    { type: 'trace', prompt: 'Type the letter A', expected: 'A', hint: 'Just the letter A!' },
    { type: 'trace', prompt: 'Type the letter B', expected: 'B', hint: 'Just the letter B!' },
    { type: 'trace', prompt: 'Type the letter S', expected: 'S', hint: 'S for Sonic!' },
    { type: 'trace', prompt: 'Type the letter T', expected: 'T', hint: 'T for Tails!' },
    { type: 'trace', prompt: 'Type the letter M', expected: 'M', hint: 'M for Maddox!' },
    { type: 'trace', prompt: 'Type the letter J', expected: 'J', hint: 'J for Jaxon!' },
    { type: 'name', prompt: 'Type your name!', expected: null, hint: 'What is your name?' },
    { type: 'trace', prompt: 'Type the letters C-A-T', expected: 'CAT', hint: 'C... A... T...' },
    { type: 'trace', prompt: 'Type the letters D-O-G', expected: 'DOG', hint: 'D... O... G...' },
    { type: 'trace', prompt: 'Type the letters R-U-N', expected: 'RUN', hint: 'R... U... N...' },
    { type: 'trace', prompt: 'Type the word GO', expected: 'GO', hint: 'Sonic says GO!' },
    { type: 'trace', prompt: 'Type the word HI', expected: 'HI', hint: 'Say hi to Tails!' },
  ],
  2: [
    { type: 'word', prompt: 'Tails needs help! Type the word: FAST', expected: 'FAST', hint: 'Sonic is ____!' },
    { type: 'word', prompt: 'Type what Sonic collects: RINGS', expected: 'RINGS', hint: 'Golden ____!' },
    { type: 'word', prompt: 'Type the color of Sonic: BLUE', expected: 'BLUE', hint: 'Sonic is ____!' },
    { type: 'word', prompt: 'Type the bad guy\'s name: EGGMAN', expected: 'EGGMAN', hint: 'Dr. ____!' },
    { type: 'fill', prompt: 'Sonic is very ____. (type a word)', expected: null, hint: 'How fast is Sonic?' },
    { type: 'fill', prompt: 'Tails can ____ a plane. (type a word)', expected: null, hint: 'What does Tails do with his plane?' },
    { type: 'word', prompt: 'Type the word: HERO', expected: 'HERO', hint: 'Sonic is a ____!' },
    { type: 'word', prompt: 'Type the word: SPEED', expected: 'SPEED', hint: 'Sonic has super ____!' },
    { type: 'fill', prompt: 'The rings are ____. (type a color)', expected: null, hint: 'What color are the rings?' },
    { type: 'word', prompt: 'Type: GREEN HILL', expected: 'GREEN HILL', hint: 'The first zone!' },
  ],
  3: [
    { type: 'sentence', prompt: 'Help Tails send a message to Sonic! Write a sentence about running fast.', expected: null, hint: 'Start with "Sonic..."', minWords: 4 },
    { type: 'sentence', prompt: 'Describe what Sonic looks like in one sentence.', expected: null, hint: 'What color is he? What does he wear?', minWords: 4 },
    { type: 'sentence', prompt: 'Write a sentence about your favorite game.', expected: null, hint: 'Start with "My favorite..."', minWords: 4 },
    { type: 'sentence', prompt: 'Tell Tails what you did at school today.', expected: null, hint: 'Start with "Today I..."', minWords: 4 },
    { type: 'sentence', prompt: 'Write a sentence about why Sonic is a hero.', expected: null, hint: 'Sonic is a hero because...', minWords: 4 },
    { type: 'fill-sentence', prompt: 'Sonic ran through the ____ to find the Chaos Emerald.', expected: null, hint: 'Where did Sonic run? A forest? A cave?', minWords: 1 },
    { type: 'sentence', prompt: 'What would you do if you could run as fast as Sonic?', expected: null, hint: 'Start with "If I could..."', minWords: 5 },
    { type: 'sentence', prompt: 'Write a sentence about Tails and his plane.', expected: null, hint: 'Tails flies...', minWords: 4 },
    { type: 'sentence', prompt: 'Describe your favorite food in one sentence.', expected: null, hint: 'Start with "My favorite food..."', minWords: 4 },
    { type: 'sentence', prompt: 'Write a message to cheer Sonic on!', expected: null, hint: 'You can do it...', minWords: 3 },
  ],
  4: [
    { type: 'story', prompt: 'Write 2-3 sentences: Sonic found a new Chaos Emerald! What happened next?', expected: null, hint: 'Where did he find it? What did he do with it?', minWords: 10 },
    { type: 'story', prompt: 'Write 2-3 sentences about an adventure with Tails.', expected: null, hint: 'Where did you go? What did you see?', minWords: 10 },
    { type: 'story', prompt: 'Eggman has a new plan! Write 2-3 sentences about what he\'s up to.', expected: null, hint: 'What did Eggman build? What does he want?', minWords: 10 },
    { type: 'letter', prompt: 'Write a short letter to your favorite Sonic character.', expected: null, hint: 'Dear [character], ...', minWords: 8 },
    { type: 'story', prompt: 'You just discovered a new zone! Describe what it looks like in 2-3 sentences.', expected: null, hint: 'What colors do you see? What sounds do you hear?', minWords: 10 },
    { type: 'opinion', prompt: 'Who is the best Sonic character and why? Write 2-3 sentences.', expected: null, hint: 'I think [character] is the best because...', minWords: 8 },
    { type: 'story', prompt: 'Write a short story: Sonic and Tails discover a hidden treasure!', expected: null, hint: 'Where was it hidden? What was the treasure?', minWords: 12 },
    { type: 'letter', prompt: 'Write a short thank-you note to someone who helped you this week.', expected: null, hint: 'Dear [person], Thank you for...', minWords: 8 },
  ],
}

export function getWritingLevelForProfile(profile) {
  if (profile.age <= 5) {
    return { startLevel: 1, maxLevel: 2 }
  }
  return { startLevel: 2, maxLevel: 4 }
}
