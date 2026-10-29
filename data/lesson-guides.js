/* Optional expanded explanations. Original curriculum remains authoritative. */
const DutchLessonGuides = {
  perfect_tense: {
    rules: [
      'Start with the subject and a present-tense form of hebben or zijn: ik heb, zij is.',
      'Form the past participle: werken → gewerkt; maken → gemaakt. Irregular verbs must be learned separately.',
      'Put the past participle at the end of a main clause: Ik heb gisteren gewerkt.',
      'Use zijn for many movement verbs that indicate a destination or change of state: Zij is naar huis gegaan.',
      'In a question, invert the finite verb: Heb je gisteren gewerkt?'
    ],
    mistakes: [
      {wrong:'Ik ben gisteren gewerkt.',right:'Ik heb gisteren gewerkt.',why:'Werken normally takes hebben in the perfect tense.'},
      {wrong:'Zij heeft naar huis gegaan.',right:'Zij is naar huis gegaan.',why:'Gaan takes zijn.'},
      {wrong:'Ik heb gewerkt gisteren.',right:'Ik heb gisteren gewerkt.',why:'In a neutral main clause, the participle typically comes at the end.'}
    ],
    task:'Describe three things you did yesterday. Include one verb with zijn.'
  },
  present_tense: {
    rules:['Remove -en from the infinitive to find the stem: werken → werk.', 'Use the stem for ik: ik werk.', 'Add -t for hij/zij and usually jij: zij werkt.', 'Use the infinitive for plural subjects: wij werken.', 'With inversion and jij after the verb, drop -t: werk jij?'],
    mistakes:[{wrong:'Werk jijt vandaag?',right:'Werk jij vandaag?',why:'The -t disappears when jij follows the finite verb.'}],
    task:'Write one statement and one question about your workweek.'
  },
  articles: {
    rules:['Learn every noun together with de or het.', 'All plural nouns use de.', 'Diminutives ending in -je take het.', 'There is no single rule that predicts de/het for every singular noun.'],
    mistakes:[{wrong:'het tafels',right:'de tafels',why:'Plural nouns take de.'}],
    task:'Name five objects in your home, including their articles.'
  },
  word_order: {
    rules:['In a Dutch main clause, the finite verb normally occupies position two.', 'A time phrase can come first, but the subject then follows the verb.', 'In subordinate clauses introduced by omdat or dat, the finite verb usually moves toward the end.'],
    mistakes:[{wrong:'Morgen ik werk.',right:'Morgen werk ik.',why:'The verb must remain in second position in a main clause.'}],
    task:'Write two sentences beginning with morgen and gisteren.'
  },
  modal_verbs: {
    rules:['Use kunnen for ability, moeten for obligation, mogen for permission, and willen for wishes.', 'Conjugate the modal verb and place the other infinitive at the end: Ik moet morgen werken.', 'For a yes/no question, put the modal verb first: Mag ik hier zitten?'],
    mistakes:[{wrong:'Ik moet werken morgen.',right:'Ik moet morgen werken.',why:'The second infinitive normally goes at the end.'}],
    task:'Write one sentence with each of kunnen, moeten and mogen.'
  },
  prepositions: {
    rules:['Learn prepositions together with common phrases: wachten op, denken aan.', 'Use naar for many destinations: naar huis, naar Amsterdam.', 'Use in for being inside a place: in de winkel.'],
    mistakes:[{wrong:'Ik wacht voor de bus.',right:'Ik wacht op de bus.',why:'Wachten normally combines with op.'}],
    task:'Describe where you are and where you are going today.'
  }
};

// Expanded A2 teaching, 2026-10-29. Stable topic IDs preserve earlier progress.
DutchLessonGuides["reflexive_verbs"] = {
  "rules": [
    "Step 1: decide whether you need a reflexive phrase. Zich voelen and zich vergissen need the pronoun; eten normally does not.",
    "Step 2: match the pronoun to the subject, using the table below. The plural subject jullie still uses je.",
    "Step 3: conjugate the finite verb normally: ik voel, jij voelt, wij voelen. The pronoun is a separate word.",
    "Step 4: in a simple statement, put the pronoun early: Ik voel me vandaag goed. In a question: Voel jij je goed?",
    "With a modal: Ik wil me inschrijven. With perfect tense: Ik heb me ingeschreven. Keep the reflexive pronoun even when the main verb moves to the end.",
    "In a subordinate clause: omdat ik me goed voel. With formal u, zich is a common choice; u is also possible in many constructions."
  ],
  "table": {
    "headers": [
      "Subject",
      "Reflexive pronoun",
      "Example"
    ],
    "rows": [
      [
        "ik",
        "me",
        "Ik voel me goed."
      ],
      [
        "jij / je",
        "je",
        "Jij voelt je goed."
      ],
      [
        "hij / zij / het",
        "zich",
        "Zij voelt zich goed."
      ],
      [
        "wij / we",
        "ons",
        "Wij voelen ons goed."
      ],
      [
        "jullie",
        "je",
        "Jullie voelen je goed."
      ],
      [
        "zij / ze (plural)",
        "zich",
        "Zij voelen zich goed."
      ],
      [
        "u",
        "zich (also u)",
        "U voelt zich goed."
      ]
    ]
  },
  "mistakes": [
    {
      "wrong": "Ik voel goed.",
      "right": "Ik voel me goed.",
      "why": "To say how you feel, use zich voelen."
    },
    {
      "wrong": "Wij voelen zich goed.",
      "right": "Wij voelen ons goed.",
      "why": "Wij takes ons."
    },
    {
      "wrong": "Jullie voelen jullie moe.",
      "right": "Jullie voelen je moe.",
      "why": "The unstressed reflexive form for jullie is je."
    }
  ],
  "task": "Describe how you feel, one morning routine and something you must do. Use three different subjects and one modal verb."
};
DutchLessonGuides["relative_clauses"] = {
  "rules": [
    "Find the noun being described, not a different noun elsewhere in the sentence.",
    "For de fiets, choose die. For het boek, choose dat. For de boeken, choose die.",
    "Build the clause: de fiets + die + ik + gebruik. Then add the main-clause verb: De fiets die ik gebruik, is nieuw.",
    "Avoid replacing die with wie simply because the noun is a person: de man die hier woont. Preposition + wie is a different construction."
  ],
  "table": {
    "headers": [
      "Noun type",
      "Pronoun",
      "Example"
    ],
    "rows": [
      [
        "de-word (singular)",
        "die",
        "de fiets die ik gebruik"
      ],
      [
        "het-word (singular)",
        "dat",
        "het boek dat ik lees"
      ],
      [
        "plural",
        "die",
        "de boeken die ik lees"
      ]
    ]
  },
  "mistakes": [
    {
      "wrong": "De fiets dat ik gebruik.",
      "right": "De fiets die ik gebruik.",
      "why": "Fiets takes de."
    },
    {
      "wrong": "De boeken dat ik lees.",
      "right": "De boeken die ik lees.",
      "why": "Plural nouns take die."
    },
    {
      "wrong": "Het boek dat ik lees het.",
      "right": "Het boek dat ik lees.",
      "why": "Dat already connects the noun to the object position; do not add another het."
    }
  ],
  "task": "Describe an object, a person and several things at home. Include one dat clause and two die clauses."
};
