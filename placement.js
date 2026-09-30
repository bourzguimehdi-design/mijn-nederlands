const placementQuestions = [
  // A1
  {
    id: "g_a1_1",
    skill: "grammar",
    level: "A1",
    question: "Ik ___ in Nederland.",
    answers: ["woon", "woont", "wonen", "woonde"],
    correct: 0,
    topic: "present tense"
  },
  {
    id: "v_a1_1",
    skill: "vocabulary",
    level: "A1",
    question: "Wat betekent 'afspraak'?",
    answers: ["appointment", "address", "question", "journey"],
    correct: 0,
    topic: "everyday vocabulary"
  },
  {
    id: "g_a1_2",
    skill: "grammar",
    level: "A1",
    question: "Zij ___ Nederlands.",
    answers: ["spreek", "spreekt", "spreken", "sprak"],
    correct: 1,
    topic: "present tense"
  },

  // A2
  {
    id: "g_a2_1",
    skill: "grammar",
    level: "A2",
    question: "Gisteren ___ ik naar Amsterdam.",
    answers: ["ga", "ging", "gegaan", "gaat"],
    correct: 1,
    topic: "past tense"
  },
  {
    id: "g_a2_2",
    skill: "grammar",
    level: "A2",
    question: "Welke zin is correct?",
    answers: [
      "Ik heb naar huis gegaan.",
      "Ik ben naar huis gegaan.",
      "Ik ben naar huis gaan.",
      "Ik heb naar huis gaan."
    ],
    correct: 1,
    topic: "perfect tense"
  },
  {
    id: "v_a2_1",
    skill: "vocabulary",
    level: "A2",
    question: "Wat betekent 'verhuizen'?",
    answers: [
      "to move house",
      "to rent",
      "to visit",
      "to wait"
    ],
    correct: 0,
    topic: "everyday vocabulary"
  },
  {
    id: "r_a2_1",
    skill: "reading",
    level: "A2",
    text: "Beste meneer De Vries, uw afspraak bij de huisarts is verplaatst van dinsdag naar donderdag om 14:30.",
    question: "Wanneer is de afspraak?",
    answers: [
      "Tuesday at 14:30",
      "Thursday at 14:30",
      "Thursday at 13:30",
      "Tuesday at 13:30"
    ],
    correct: 1,
    topic: "reading comprehension"
  },
  {
    id: "g_a2_3",
    skill: "grammar",
    level: "A2",
    question: "Ik blijf thuis omdat ik morgen vroeg ___.",
    answers: [
      "moet werken",
      "werken moet",
      "moet werk",
      "werk moet"
    ],
    correct: 1,
    topic: "subordinate clause word order"
  },

  // B1
  {
    id: "g_b1_1",
    skill: "grammar",
    level: "B1",
    question: "Als ik meer tijd ___, zou ik vaker Nederlands oefenen.",
    answers: [
      "heb",
      "had",
      "zal hebben",
      "heeft"
    ],
    correct: 1,
    topic: "conditional structures"
  },
  {
    id: "r_b1_1",
    skill: "reading",
    level: "B1",
    text: "Vanwege werkzaamheden rijden er dit weekend geen treinen tussen Utrecht en Amsterdam. Reizigers kunnen gebruikmaken van vervangende bussen. Houd rekening met ongeveer dertig minuten extra reistijd.",
    question: "Wat moeten reizigers verwachten?",
    answers: [
      "The journey will be about 30 minutes shorter.",
      "There are fewer buses than usual.",
      "They need to use replacement buses and allow extra time.",
      "Trains only run in the morning."
    ],
    correct: 2,
    topic: "reading comprehension"
  },
  {
    id: "v_b1_1",
    skill: "vocabulary",
    level: "B1",
    question: "Wat betekent 'rekening houden met'?",
    answers: [
      "to pay an invoice",
      "to take into account",
      "to calculate",
      "to disagree with"
    ],
    correct: 1,
    topic: "expressions"
  },
  {
    id: "g_b1_2",
    skill: "grammar",
    level: "B1",
    question: "Welke zin is correct?",
    answers: [
      "Hoewel ik moe ben, ga ik toch sporten.",
      "Hoewel ik ben moe, ik ga toch sporten.",
      "Hoewel ben ik moe, ga ik toch sporten.",
      "Hoewel ik moe ben, ik toch sporten ga."
    ],
    correct: 0,
    topic: "subordinate clauses"
  }
];