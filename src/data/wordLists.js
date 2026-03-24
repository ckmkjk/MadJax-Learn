// Word lists organized by difficulty level
// Level 1: Letter recognition & sounds (Jaxon - age 5)
// Level 2: CVC words & simple sight words (Jaxon advanced / Maddox starter)
// Level 3: Harder sight words & short sentences (Maddox - age 7)
// Level 4: Complex words & reading comprehension (Maddox advanced)

export const wordChallenges = {
  1: [
    { type: 'letter-sound', prompt: 'Which letter makes the "buh" sound?', answer: 'B', choices: ['B', 'D', 'P'] },
    { type: 'letter-sound', prompt: 'Which letter makes the "sss" sound?', answer: 'S', choices: ['S', 'Z', 'C'] },
    { type: 'letter-sound', prompt: 'Which letter makes the "mmm" sound?', answer: 'M', choices: ['M', 'N', 'W'] },
    { type: 'letter-sound', prompt: 'Which letter makes the "tuh" sound?', answer: 'T', choices: ['T', 'D', 'P'] },
    { type: 'letter-sound', prompt: 'Which letter makes the "kuh" sound?', answer: 'K', choices: ['K', 'G', 'Q'] },
    { type: 'letter-sound', prompt: 'Which letter makes the "fff" sound?', answer: 'F', choices: ['F', 'V', 'P'] },
    { type: 'letter-name', prompt: 'Find the letter A', answer: 'A', choices: ['A', 'E', 'O'] },
    { type: 'letter-name', prompt: 'Find the letter R', answer: 'R', choices: ['P', 'R', 'B'] },
    { type: 'letter-name', prompt: 'Find the letter G', answer: 'G', choices: ['C', 'G', 'Q'] },
    { type: 'rhyme', prompt: 'What rhymes with CAT?', answer: 'HAT', choices: ['DOG', 'HAT', 'CUP'] },
    { type: 'rhyme', prompt: 'What rhymes with FUN?', answer: 'RUN', choices: ['RUN', 'FIG', 'COP'] },
    { type: 'rhyme', prompt: 'What rhymes with BIG?', answer: 'PIG', choices: ['BAG', 'PIG', 'BUS'] },
    { type: 'rhyme', prompt: 'What rhymes with HOP?', answer: 'TOP', choices: ['HIT', 'TOP', 'HUG'] },
    { type: 'rhyme', prompt: 'What rhymes with RED?', answer: 'BED', choices: ['RAN', 'RUG', 'BED'] },
    { type: 'letter-sound', prompt: 'Which letter makes the "lll" sound?', answer: 'L', choices: ['L', 'R', 'I'] },
    { type: 'letter-name', prompt: 'Find the letter W', answer: 'W', choices: ['M', 'W', 'V'] },
  ],
  2: [
    { type: 'sight-word', prompt: 'Which word is "the"?', answer: 'the', choices: ['the', 'teh', 'hte'] },
    { type: 'sight-word', prompt: 'Which word is "and"?', answer: 'and', choices: ['ant', 'and', 'add'] },
    { type: 'sight-word', prompt: 'Which word is "said"?', answer: 'said', choices: ['sad', 'said', 'sid'] },
    { type: 'sight-word', prompt: 'Which word is "have"?', answer: 'have', choices: ['hav', 'have', 'gave'] },
    { type: 'cvc', prompt: 'Sound it out: C-A-T', answer: 'CAT', choices: ['CAT', 'CUT', 'COT'] },
    { type: 'cvc', prompt: 'Sound it out: D-O-G', answer: 'DOG', choices: ['DIG', 'DOG', 'DAG'] },
    { type: 'cvc', prompt: 'Sound it out: R-U-N', answer: 'RUN', choices: ['RAN', 'RUN', 'RIN'] },
    { type: 'cvc', prompt: 'Sound it out: H-O-P', answer: 'HOP', choices: ['HIP', 'HOP', 'HAP'] },
    { type: 'cvc', prompt: 'Sound it out: S-I-T', answer: 'SIT', choices: ['SAT', 'SET', 'SIT'] },
    { type: 'cvc', prompt: 'Sound it out: B-U-G', answer: 'BUG', choices: ['BAG', 'BIG', 'BUG'] },
    { type: 'sight-word', prompt: 'Which word is "was"?', answer: 'was', choices: ['waz', 'was', 'saw'] },
    { type: 'sight-word', prompt: 'Which word is "you"?', answer: 'you', choices: ['yoo', 'you', 'yuo'] },
    { type: 'cvc', prompt: 'Sound it out: P-I-N', answer: 'PIN', choices: ['PAN', 'PEN', 'PIN'] },
    { type: 'cvc', prompt: 'Sound it out: M-A-P', answer: 'MAP', choices: ['MAP', 'MOP', 'MIP'] },
    { type: 'sight-word', prompt: 'Which word is "like"?', answer: 'like', choices: ['lick', 'like', 'lake'] },
    { type: 'sight-word', prompt: 'Which word is "come"?', answer: 'come', choices: ['come', 'came', 'comb'] },
  ],
  3: [
    { type: 'sight-word', prompt: 'Which word is "because"?', answer: 'because', choices: ['becuse', 'because', 'becaus'] },
    { type: 'sight-word', prompt: 'Which word is "friend"?', answer: 'friend', choices: ['freind', 'friend', 'frend'] },
    { type: 'sight-word', prompt: 'Which word is "would"?', answer: 'would', choices: ['woud', 'would', 'wuld'] },
    { type: 'sight-word', prompt: 'Which word is "their"?', answer: 'their', choices: ['there', 'their', 'thier'] },
    { type: 'sentence', prompt: 'Sonic ran _____ fast.', answer: 'very', choices: ['very', 'vary', 'verry'] },
    { type: 'sentence', prompt: 'Tails can _____ his plane.', answer: 'fly', choices: ['fli', 'fly', 'flie'] },
    { type: 'sentence', prompt: 'The rings _____ golden.', answer: 'are', choices: ['is', 'are', 'was'] },
    { type: 'sentence', prompt: 'Eggman _____ to catch Sonic.', answer: 'tried', choices: ['tryed', 'tried', 'treid'] },
    { type: 'sight-word', prompt: 'Which word is "people"?', answer: 'people', choices: ['people', 'peple', 'pepole'] },
    { type: 'sight-word', prompt: 'Which word is "could"?', answer: 'could', choices: ['coud', 'could', 'culd'] },
    { type: 'sentence', prompt: 'Sonic is the _____ hedgehog alive.', answer: 'fastest', choices: ['fastest', 'fastes', 'fastist'] },
    { type: 'sentence', prompt: 'They _____ to Green Hill Zone.', answer: 'went', choices: ['goed', 'went', 'wented'] },
    { type: 'sight-word', prompt: 'Which word is "through"?', answer: 'through', choices: ['threw', 'through', 'throu'] },
    { type: 'sight-word', prompt: 'Which word is "enough"?', answer: 'enough', choices: ['enuf', 'enough', 'enugh'] },
    { type: 'sentence', prompt: 'The Chaos Emeralds _____ powerful.', answer: 'are', choices: ['is', 'are', 'were'] },
    { type: 'sight-word', prompt: 'Which word is "different"?', answer: 'different', choices: ['diferent', 'different', 'diffrent'] },
  ],
  4: [
    { type: 'vocab', prompt: 'What does "swift" mean?', answer: 'Fast', choices: ['Slow', 'Fast', 'Tall'] },
    { type: 'vocab', prompt: 'What does "enormous" mean?', answer: 'Very big', choices: ['Very small', 'Very big', 'Very fast'] },
    { type: 'vocab', prompt: 'What does "brave" mean?', answer: 'Not afraid', choices: ['Not afraid', 'Very tired', 'Very happy'] },
    { type: 'comprehension', prompt: 'Sonic runs fast to collect rings. What does Sonic collect?', answer: 'Rings', choices: ['Stars', 'Rings', 'Coins'] },
    { type: 'comprehension', prompt: 'Tails built a plane because he wanted to fly. Why did Tails build a plane?', answer: 'To fly', choices: ['To drive', 'To fly', 'To swim'] },
    { type: 'grammar', prompt: 'Which is correct?', answer: 'He ran quickly.', choices: ['He ran quick.', 'He ran quickly.', 'He runned quick.'] },
    { type: 'grammar', prompt: 'Which is correct?', answer: "They're fast.", choices: ["Their fast.", "There fast.", "They're fast."] },
    { type: 'vocab', prompt: 'What does "determined" mean?', answer: 'Won\'t give up', choices: ['Very tired', 'Won\'t give up', 'Very scared'] },
    { type: 'comprehension', prompt: 'Knuckles guards the Master Emerald on Angel Island. Where is the Master Emerald?', answer: 'Angel Island', choices: ['Green Hill', 'Angel Island', 'Chemical Plant'] },
    { type: 'grammar', prompt: 'Which is correct?', answer: 'Sonic and Tails are friends.', choices: ['Sonic and Tails is friends.', 'Sonic and Tails are friends.', 'Sonic and Tails am friends.'] },
    { type: 'vocab', prompt: 'What does "villain" mean?', answer: 'Bad guy', choices: ['Hero', 'Bad guy', 'Helper'] },
    { type: 'comprehension', prompt: 'Amy chased Sonic because she likes him. Why did Amy chase Sonic?', answer: 'She likes him', choices: ['She was scared', 'She likes him', 'She was angry'] },
    { type: 'grammar', prompt: 'Pick the past tense: Sonic _____ all the rings.', answer: 'collected', choices: ['collect', 'collected', 'collecting'] },
    { type: 'vocab', prompt: 'What does "ancient" mean?', answer: 'Very old', choices: ['Very new', 'Very old', 'Very big'] },
    { type: 'grammar', prompt: 'Which is correct?', answer: "The hedgehog's speed is amazing.", choices: ["The hedgehogs speed is amazing.", "The hedgehog's speed is amazing.", "The hedgehogs' speed is amazing."] },
    { type: 'comprehension', prompt: 'Shadow looks like Sonic but has red stripes. How is Shadow different from Sonic?', answer: 'Red stripes', choices: ['Blue stripes', 'Red stripes', 'Green stripes'] },
  ],
}

export function getWordLevelForProfile(profile) {
  if (profile.age <= 5) {
    return { startLevel: 1, maxLevel: 2 }
  }
  return { startLevel: 2, maxLevel: 4 }
}
