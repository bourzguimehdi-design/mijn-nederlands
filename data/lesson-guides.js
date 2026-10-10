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
