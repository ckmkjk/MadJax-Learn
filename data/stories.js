// ===== MICRO-STORIES FOR STORY SPRINT =====

// Jaxon stories — simple, read aloud, picture-based answers
export const STORIES_EASY = [
  {
    text: "A big red dog sat on a mat. The dog was happy.",
    question: "What color was the dog?",
    answers: [
      { text: "Red", icon: "🔴", correct: true },
      { text: "Blue", icon: "🔵", correct: false },
      { text: "Green", icon: "🟢", correct: false },
    ]
  },
  {
    text: "The cat jumped up on the bed. It went to sleep.",
    question: "Where did the cat go?",
    answers: [
      { text: "The car", icon: "🚗", correct: false },
      { text: "The bed", icon: "🛏️", correct: true },
      { text: "The tree", icon: "🌳", correct: false },
    ]
  },
  {
    text: "Sam got a big fish from the lake. He was so happy!",
    question: "What did Sam get?",
    answers: [
      { text: "A fish", icon: "🐟", correct: true },
      { text: "A ball", icon: "⚽", correct: false },
      { text: "A hat", icon: "🎩", correct: false },
    ]
  },
  {
    text: "The sun came up. The bird sang a song in the tree.",
    question: "What sang a song?",
    answers: [
      { text: "A dog", icon: "🐕", correct: false },
      { text: "A bird", icon: "🐦", correct: true },
      { text: "A frog", icon: "🐸", correct: false },
    ]
  },
  {
    text: "It was raining. The frog jumped in a big puddle. Splash!",
    question: "What jumped in the puddle?",
    answers: [
      { text: "A cat", icon: "🐱", correct: false },
      { text: "A frog", icon: "🐸", correct: true },
      { text: "A duck", icon: "🦆", correct: false },
    ]
  },
  {
    text: "Mom made three cupcakes. One had pink frosting on top.",
    question: "How many cupcakes did Mom make?",
    answers: [
      { text: "Two", icon: "2️⃣", correct: false },
      { text: "Three", icon: "3️⃣", correct: true },
      { text: "Five", icon: "5️⃣", correct: false },
    ]
  },
  {
    text: "The little turtle walked very slow. The rabbit ran fast past him.",
    question: "Who was slow?",
    answers: [
      { text: "The rabbit", icon: "🐇", correct: false },
      { text: "The turtle", icon: "🐢", correct: true },
      { text: "The bird", icon: "🐦", correct: false },
    ]
  },
  {
    text: "A snowman stood in the yard. He had a carrot nose and button eyes.",
    question: "What was his nose made of?",
    answers: [
      { text: "A stick", icon: "🪵", correct: false },
      { text: "A rock", icon: "🪨", correct: false },
      { text: "A carrot", icon: "🥕", correct: true },
    ]
  },
];

// Maddox stories — reads independently, inference questions
export const STORIES_HARD = [
  {
    text: "Jake looked out the window and saw dark clouds rolling in. He quickly grabbed his umbrella and ran inside to tell his sister to bring in her bike.",
    question: "Why did Jake grab an umbrella?",
    answers: [
      { text: "He was going to the store", correct: false },
      { text: "A storm was coming", correct: true },
      { text: "He was playing a game", correct: false },
      { text: "His sister asked him to", correct: false },
    ]
  },
  {
    text: "The fox tried to reach the grapes on the high vine. After jumping many times, he walked away and said, 'Those grapes are probably sour anyway.'",
    question: "Why did the fox say the grapes were sour?",
    answers: [
      { text: "He tasted them", correct: false },
      { text: "Someone told him", correct: false },
      { text: "He couldn't reach them and was upset", correct: true },
      { text: "They were actually sour", correct: false },
    ]
  },
  {
    text: "Maya's puppy chewed up her homework. She spent the whole evening rewriting it. The next day, her teacher gave her extra credit for such neat handwriting.",
    question: "How did something bad turn into something good?",
    answers: [
      { text: "The puppy learned to stop chewing", correct: false },
      { text: "Her rewritten homework was neater and got extra credit", correct: true },
      { text: "She got a new puppy", correct: false },
      { text: "The teacher didn't notice", correct: false },
    ]
  },
  {
    text: "Captain Blue's spaceship was running low on fuel. He spotted a small planet nearby and decided to land. On the planet, he found crystals that could power his ship for a thousand years!",
    question: "What problem did Captain Blue have?",
    answers: [
      { text: "His ship was broken", correct: false },
      { text: "He was running low on fuel", correct: true },
      { text: "He was lost", correct: false },
      { text: "He found too many crystals", correct: false },
    ]
  },
  {
    text: "Every morning, the old lighthouse keeper climbed 142 steps to light the lamp. Even in storms, he never missed a day. The sailors always knew they were safe when they saw his light.",
    question: "Why was the lighthouse keeper important?",
    answers: [
      { text: "He liked climbing stairs", correct: false },
      { text: "He kept sailors safe by lighting the lamp every day", correct: true },
      { text: "He was the oldest person in town", correct: false },
      { text: "He owned the lighthouse", correct: false },
    ]
  },
  {
    text: "Lily found a mysterious key in the garden. She tried it on every lock in the house. Finally, she tried the old chest in the attic — click! Inside were her grandmother's secret recipes.",
    question: "Where did Lily find the key?",
    answers: [
      { text: "In the attic", correct: false },
      { text: "In the chest", correct: false },
      { text: "In the garden", correct: true },
      { text: "In the kitchen", correct: false },
    ]
  },
  {
    text: "The scientist mixed the red liquid with the blue one. The beaker started bubbling and glowing green! She quickly wrote down everything she saw in her notebook.",
    question: "What did the scientist do AFTER the beaker glowed?",
    answers: [
      { text: "She mixed more liquids", correct: false },
      { text: "She ran away", correct: false },
      { text: "She called her friend", correct: false },
      { text: "She wrote notes about what happened", correct: true },
    ]
  },
  {
    text: "Two brothers built a sandcastle together. The older one made the towers while the younger one dug the moat. When the waves came, they both cheered as the moat filled with water like a real castle!",
    question: "How did the brothers feel when the waves filled the moat?",
    answers: [
      { text: "Sad — the castle was ruined", correct: false },
      { text: "Happy — it looked like a real castle", correct: true },
      { text: "Angry — they had to rebuild", correct: false },
      { text: "Scared of the waves", correct: false },
    ]
  },
  {
    text: "Maria's robot wouldn't turn on. She checked the batteries — dead. She checked the wires — loose. After fixing both problems, the robot beeped and said 'Hello!' Maria jumped with joy.",
    question: "How many problems did the robot have?",
    answers: [
      { text: "One", correct: false },
      { text: "Two", correct: true },
      { text: "Three", correct: false },
      { text: "None", correct: false },
    ]
  },
  {
    text: "The fastest runner in school was Leo. But at the big race, he tripped and fell. Instead of giving up, he got back up and finished the race. Everyone cheered louder for him than for the winner.",
    question: "Why did everyone cheer for Leo even though he didn't win?",
    answers: [
      { text: "He was the fastest", correct: false },
      { text: "He tripped the winner", correct: false },
      { text: "He showed courage by not giving up", correct: true },
      { text: "He was their friend", correct: false },
    ]
  },
];
