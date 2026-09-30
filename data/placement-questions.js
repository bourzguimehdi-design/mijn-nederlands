const placementQuestions = [

  // =====================================================
  // GRAMMAR — A1
  // =====================================================

  {
    id: "grammar_a1_001",
    skill: "grammar",
    level: "A1",
    category: "verbs",
    topic: "present_tense",
    concept: "ik_present_tense",

    question: "Ik ___ in Amsterdam.",

    answers: [
      "woon",
      "woont",
      "wonen",
      "woonde"
    ],

    correct: 0,

    explanation:
      "With 'ik', the verb 'wonen' becomes 'woon': Ik woon in Amsterdam."
  },

  {
    id: "grammar_a1_002",
    skill: "grammar",
    level: "A1",
    category: "verbs",
    topic: "present_tense",
    concept: "hij_zij_present_tense",

    question: "Mijn collega ___ Nederlands.",

    answers: [
      "spreek",
      "spreekt",
      "spreken",
      "gesproken"
    ],

    correct: 1,

    explanation:
      "With hij/zij or a singular person, the verb normally gets -t: mijn collega spreekt."
  },

  {
    id: "grammar_a1_003",
    skill: "grammar",
    level: "A1",
    category: "word_order",
    topic: "basic_word_order",
    concept: "main_clause",

    question: "Welke zin is correct?",

    answers: [
      "Ik vandaag werk thuis.",
      "Ik werk vandaag thuis.",
      "Ik vandaag thuis werk.",
      "Werk ik vandaag thuis."
    ],

    correct: 1,

    explanation:
      "In a normal main clause, the conjugated verb is in the second position: Ik werk vandaag thuis."
  },

  {
    id: "grammar_a1_004",
    skill: "grammar",
    level: "A1",
    category: "articles",
    topic: "articles",
    concept: "de_het",

    question: "Kies het juiste lidwoord: ___ huis",

    answers: [
      "de",
      "het",
      "een de",
      "die"
    ],

    correct: 1,

    explanation:
      "'Huis' is a het-word: het huis."
  },


  // =====================================================
  // GRAMMAR — A2
  // =====================================================

  {
    id: "grammar_a2_001",
    skill: "grammar",
    level: "A2",
    category: "verbs",
    topic: "past_tense",
    concept: "simple_past",

    question: "Gisteren ___ ik naar de supermarkt.",

    answers: [
      "ga",
      "ging",
      "gegaan",
      "gaat"
    ],

    correct: 1,

    explanation:
      "'Ging' is the simple past of 'gaan': gisteren ging ik..."
  },

  {
    id: "grammar_a2_002",
    skill: "grammar",
    level: "A2",
    category: "verbs",
    topic: "perfect_tense",
    concept: "zijn_auxiliary",

    question: "Welke zin is correct?",

    answers: [
      "Ik heb naar huis gegaan.",
      "Ik ben naar huis gegaan.",
      "Ik ben naar huis gaan.",
      "Ik heb naar huis gaan."
    ],

    correct: 1,

    explanation:
      "The perfect tense of 'gaan' uses 'zijn': Ik ben naar huis gegaan."
  },

  {
    id: "grammar_a2_003",
    skill: "grammar",
    level: "A2",
    category: "word_order",
    topic: "subordinate_clauses",
    concept: "omdat_word_order",

    question:
      "Ik blijf thuis omdat ik morgen vroeg ___.",

    answers: [
      "werk moet",
      "moet werken",
      "werken moet",
      "moeten werken"
    ],

    correct: 1,

    explanation:
      "In this subordinate clause, the verb group comes at the end: omdat ik morgen vroeg moet werken."
  },

  {
    id: "grammar_a2_004",
    skill: "grammar",
    level: "A2",
    category: "verbs",
    topic: "separable_verbs",
    concept: "separable_main_clause",

    question:
      "Ik ___ mijn moeder vanavond ___.",

    answers: [
      "bel / op",
      "op / bel",
      "bel / aan",
      "heb / bellen"
    ],

    correct: 0,

    explanation:
      "'Opbellen' is separable in a main clause: Ik bel mijn moeder vanavond op."
  },


  // =====================================================
  // GRAMMAR — B1
  // =====================================================

  {
    id: "grammar_b1_001",
    skill: "grammar",
    level: "B1",
    category: "clauses",
    topic: "conditional",
    concept: "hypothetical_condition",

    question:
      "Als ik meer tijd ___, zou ik vaker Nederlands oefenen.",

    answers: [
      "heb",
      "had",
      "zal hebben",
      "heeft"
    ],

    correct: 1,

    explanation:
      "For this hypothetical construction: Als ik meer tijd had, zou ik..."
  },

  {
    id: "grammar_b1_002",
    skill: "grammar",
    level: "B1",
    category: "word_order",
    topic: "subordinate_clauses",
    concept: "hoewel_word_order",

    question: "Welke zin is correct?",

    answers: [
      "Hoewel ik moe ben, ga ik toch sporten.",
      "Hoewel ik ben moe, ga ik toch sporten.",
      "Hoewel ben ik moe, ik ga toch sporten.",
      "Hoewel ik moe ben, ik toch sporten ga."
    ],

    correct: 0,

    explanation:
      "'Hoewel' introduces a subordinate clause, so the verb moves to the end: hoewel ik moe ben."
  },

  {
    id: "grammar_b1_003",
    skill: "grammar",
    level: "B1",
    category: "relative_clauses",
    topic: "relative_pronouns",
    concept: "die_dat",

    question:
      "De man ___ daar staat, is mijn buurman.",

    answers: [
      "dat",
      "die",
      "wat",
      "waar"
    ],

    correct: 1,

    explanation:
      "'Man' is a de-word, so the relative pronoun is 'die'."
  },

  {
    id: "grammar_b1_004",
    skill: "grammar",
    level: "B1",
    category: "connectors",
    topic: "contrast",
    concept: "desondanks",

    question:
      "Het regende hard. ___ gingen we wandelen.",

    answers: [
      "Omdat",
      "Daarom",
      "Desondanks",
      "Terwijl"
    ],

    correct: 2,

    explanation:
      "'Desondanks' means nevertheless/despite that."
  },


  // =====================================================
  // VOCABULARY — A1
  // =====================================================

  {
    id: "vocabulary_a1_001",
    skill: "vocabulary",
    level: "A1",
    category: "daily_life",
    topic: "appointments",
    concept: "afspraak",

    question: "Wat betekent 'afspraak'?",

    answers: [
      "appointment",
      "address",
      "question",
      "journey"
    ],

    correct: 0,

    explanation:
      "'Afspraak' means appointment or arrangement."
  },

  {
    id: "vocabulary_a1_002",
    skill: "vocabulary",
    level: "A1",
    category: "daily_life",
    topic: "shopping",
    concept: "boodschappen",

    question:
      "Wat betekent 'boodschappen doen'?",

    answers: [
      "to send messages",
      "to go grocery shopping",
      "to clean the house",
      "to visit friends"
    ],

    correct: 1,

    explanation:
      "'Boodschappen doen' means to do grocery shopping."
  },

  {
    id: "vocabulary_a1_003",
    skill: "vocabulary",
    level: "A1",
    category: "transport",
    topic: "transport",
    concept: "station",

    question:
      "Waar neem je meestal de trein?",

    answers: [
      "bij de bakker",
      "op het station",
      "bij de huisarts",
      "op school"
    ],

    correct: 1,

    explanation:
      "You normally take a train at a station."
  },

  {
    id: "vocabulary_a1_004",
    skill: "vocabulary",
    level: "A1",
    category: "time",
    topic: "time",
    concept: "half_drie",

    question:
      "Hoe laat is 'half drie'?",

    answers: [
      "2:30",
      "3:30",
      "2:15",
      "3:15"
    ],

    correct: 0,

    explanation:
      "In Dutch, 'half drie' means half an hour before three: 2:30."
  },


  // =====================================================
  // VOCABULARY — A2
  // =====================================================

  {
    id: "vocabulary_a2_001",
    skill: "vocabulary",
    level: "A2",
    category: "housing",
    topic: "housing",
    concept: "verhuizen",

    question: "Wat betekent 'verhuizen'?",

    answers: [
      "to move house",
      "to rent",
      "to repair",
      "to visit"
    ],

    correct: 0,

    explanation:
      "'Verhuizen' means to move from one home to another."
  },

  {
    id: "vocabulary_a2_002",
    skill: "vocabulary",
    level: "A2",
    category: "transport",
    topic: "transport",
    concept: "vertraging",

    question:
      "De trein heeft vertraging. Wat betekent dat?",

    answers: [
      "The train is early.",
      "The train is delayed.",
      "The train is empty.",
      "The train is cancelled."
    ],

    correct: 1,

    explanation:
      "'Vertraging' means delay."
  },

  {
    id: "vocabulary_a2_003",
    skill: "vocabulary",
    level: "A2",
    category: "healthcare",
    topic: "healthcare",
    concept: "doorverwijzing",

    question:
      "De huisarts verwijst je door naar het ziekenhuis. Wat gebeurt er?",

    answers: [
      "You receive a referral.",
      "You receive medicine immediately.",
      "You change your health insurance.",
      "You cancel the appointment."
    ],

    correct: 0,

    explanation:
      "'Doorverwijzen' means referring someone to another healthcare provider."
  },

  {
    id: "vocabulary_a2_004",
    skill: "vocabulary",
    level: "A2",
    category: "work",
    topic: "employment",
    concept: "solliciteren",

    question:
      "Wat betekent 'solliciteren'?",

    answers: [
      "to resign",
      "to apply for a job",
      "to work overtime",
      "to receive a salary"
    ],

    correct: 1,

    explanation:
      "'Solliciteren' means to apply for a job."
  },


  // =====================================================
  // VOCABULARY — B1
  // =====================================================

  {
    id: "vocabulary_b1_001",
    skill: "vocabulary",
    level: "B1",
    category: "expressions",
    topic: "expressions",
    concept: "rekening_houden_met",

    question:
      "Wat betekent 'rekening houden met'?",

    answers: [
      "to pay an invoice",
      "to take into account",
      "to calculate",
      "to complain"
    ],

    correct: 1,

    explanation:
      "'Rekening houden met' means to take something into account."
  },

  {
    id: "vocabulary_b1_002",
    skill: "vocabulary",
    level: "B1",
    category: "work",
    topic: "employment",
    concept: "arbeidsvoorwaarden",

    question:
      "Wat zijn 'arbeidsvoorwaarden'?",

    answers: [
      "conditions of employment",
      "job advertisements",
      "working colleagues",
      "tax declarations"
    ],

    correct: 0,

    explanation:
      "'Arbeidsvoorwaarden' are employment conditions, such as salary, working hours and leave."
  },

  {
    id: "vocabulary_b1_003",
    skill: "vocabulary",
    level: "B1",
    category: "government",
    topic: "administration",
    concept: "aanvraag",

    question:
      "Wat betekent 'een aanvraag indienen'?",

    answers: [
      "to reject a request",
      "to submit an application",
      "to receive a letter",
      "to make a complaint"
    ],

    correct: 1,

    explanation:
      "'Een aanvraag indienen' means to submit an application."
  },

  {
    id: "vocabulary_b1_004",
    skill: "vocabulary",
    level: "B1",
    category: "communication",
    topic: "formal_language",
    concept: "op_de_hoogte_stellen",

    question:
      "Wat betekent 'iemand op de hoogte stellen'?",

    answers: [
      "to warn someone",
      "to inform someone",
      "to invite someone",
      "to interrupt someone"
    ],

    correct: 1,

    explanation:
      "The expression means to inform or notify someone."
  },


  // =====================================================
  // READING — A1
  // =====================================================

  {
    id: "reading_a1_001",
    skill: "reading",
    level: "A1",
    category: "messages",
    topic: "appointments",
    concept: "simple_message",

    text:
      "Hoi Samir, ik ben tien minuten later. Tot straks! Groetjes, Peter.",

    question:
      "Wat zegt Peter?",

    answers: [
      "He will arrive ten minutes late.",
      "He cannot come.",
      "He arrived ten minutes ago.",
      "He wants to meet tomorrow."
    ],

    correct: 0,

    explanation:
      "Peter says he will be ten minutes late."
  },

  {
    id: "reading_a1_002",
    skill: "reading",
    level: "A1",
    category: "signs",
    topic: "opening_hours",
    concept: "opening_hours",

    text:
      "Openingstijden: maandag t/m vrijdag 09:00–17:00. Zaterdag 10:00–14:00. Zondag gesloten.",

    question:
      "Wanneer is de winkel op zondag open?",

    answers: [
      "09:00–17:00",
      "10:00–14:00",
      "Only in the morning",
      "It is closed."
    ],

    correct: 3,

    explanation:
      "'Zondag gesloten' means closed on Sunday."
  },

  {
    id: "reading_a1_003",
    skill: "reading",
    level: "A1",
    category: "daily_life",
    topic: "transport",
    concept: "simple_schedule",

    text:
      "Bus 5 vertrekt om 08:15 vanaf halte Centrum.",

    question:
      "Hoe laat vertrekt de bus?",

    answers: [
      "08:05",
      "08:15",
      "08:50",
      "15:08"
    ],

    correct: 1,

    explanation:
      "The bus leaves at 08:15."
  },

  {
    id: "reading_a1_004",
    skill: "reading",
    level: "A1",
    category: "messages",
    topic: "work",
    concept: "simple_instruction",

    text:
      "Morgen beginnen we om negen uur. Kom alsjeblieft tien minuten eerder.",

    question:
      "Hoe laat moet je ongeveer komen?",

    answers: [
      "08:50",
      "09:00",
      "09:10",
      "10:00"
    ],

    correct: 0,

    explanation:
      "Ten minutes before 09:00 is 08:50."
  },


  // =====================================================
  // READING — A2
  // =====================================================

  {
    id: "reading_a2_001",
    skill: "reading",
    level: "A2",
    category: "healthcare",
    topic: "appointments",
    concept: "appointment_change",

    text:
      "Beste meneer De Vries, uw afspraak bij de huisarts is verplaatst van dinsdag naar donderdag om 14:30.",

    question:
      "Wanneer is de nieuwe afspraak?",

    answers: [
      "Tuesday at 14:30",
      "Thursday at 14:30",
      "Thursday at 13:30",
      "Tuesday at 13:30"
    ],

    correct: 1,

    explanation:
      "The appointment has been moved to Thursday at 14:30."
  },

  {
    id: "reading_a2_002",
    skill: "reading",
    level: "A2",
    category: "housing",
    topic: "maintenance",
    concept: "maintenance_notice",

    text:
      "Op woensdag 12 oktober komt een monteur tussen 13:00 en 16:00 uur de cv-ketel controleren. Zorg ervoor dat er iemand thuis is.",

    question:
      "Wat moet de bewoner doen?",

    answers: [
      "Call the technician before 13:00.",
      "Make sure someone is home.",
      "Turn off the heating for three days.",
      "Visit the housing company."
    ],

    correct: 1,

    explanation:
      "The notice says someone must be at home when the technician visits."
  },

  {
    id: "reading_a2_003",
    skill: "reading",
    level: "A2",
    category: "work",
    topic: "scheduling",
    concept: "schedule_change",

    text:
      "De vergadering van vrijdagmiddag gaat niet door. We hebben een nieuwe afspraak gemaakt voor maandag om 10:00 uur.",

    question:
      "Wat is er veranderd?",

    answers: [
      "The meeting is now Monday morning.",
      "The meeting is now Friday morning.",
      "The meeting has been cancelled permanently.",
      "The meeting is Monday afternoon."
    ],

    correct: 0,

    explanation:
      "The Friday meeting was cancelled and rescheduled for Monday at 10:00."
  },

  {
    id: "reading_a2_004",
    skill: "reading",
    level: "A2",
    category: "government",
    topic: "administration",
    concept: "document_request",

    text:
      "Voor uw aanvraag hebben wij nog een kopie van uw paspoort nodig. Stuur deze vóór 20 november naar ons op.",

    question:
      "Wat wordt gevraagd?",

    answers: [
      "Pay before 20 November.",
      "Send a passport copy before 20 November.",
      "Collect a passport on 20 November.",
      "Make a new application."
    ],

    correct: 1,

    explanation:
      "They require a copy of the passport before 20 November."
  },


  // =====================================================
  // READING — B1
  // =====================================================

  {
    id: "reading_b1_001",
    skill: "reading",
    level: "B1",
    category: "transport",
    topic: "disruptions",
    concept: "replacement_transport",

    text:
      "Vanwege werkzaamheden rijden er dit weekend geen treinen tussen Utrecht en Amsterdam. Reizigers kunnen gebruikmaken van vervangende bussen. Houd rekening met ongeveer dertig minuten extra reistijd.",

    question:
      "Wat moeten reizigers verwachten?",

    answers: [
      "A journey that is about 30 minutes shorter.",
      "Replacement buses and additional travel time.",
      "Normal trains with fewer seats.",
      "No public transport at all."
    ],

    correct: 1,

    explanation:
      "Replacement buses are available, but travellers should allow approximately 30 extra minutes."
  },

  {
    id: "reading_b1_002",
    skill: "reading",
    level: "B1",
    category: "work",
    topic: "employment",
    concept: "workplace_request",

    text:
      "Vanaf volgende maand verandert het rooster. Medewerkers die vanwege zorgtaken niet op woensdagavond kunnen werken, worden gevraagd dit uiterlijk vrijdag bij hun leidinggevende aan te geven.",

    question:
      "Wat moeten sommige medewerkers vóór vrijdag doen?",

    answers: [
      "Submit their new work schedule.",
      "Tell their manager they cannot work Wednesday evening.",
      "Request additional salary.",
      "Arrange childcare through their employer."
    ],

    correct: 1,

    explanation:
      "Employees who cannot work Wednesday evening because of caring responsibilities should inform their manager."
  },

  {
    id: "reading_b1_003",
    skill: "reading",
    level: "B1",
    category: "municipality",
    topic: "waste",
    concept: "policy_change",

    text:
      "De gemeente verandert vanaf januari de manier waarop grofvuil wordt opgehaald. Inwoners moeten voortaan vooraf online een afspraak maken. Zonder afspraak wordt het afval niet meegenomen.",

    question:
      "Wat verandert er vanaf januari?",

    answers: [
      "Bulky waste will no longer be collected.",
      "Residents must make an appointment before collection.",
      "Residents must take all waste to the municipality.",
      "Collection becomes free."
    ],

    correct: 1,

    explanation:
      "Residents will need to make an online appointment before bulky waste is collected."
  },

  {
    id: "reading_b1_004",
    skill: "reading",
    level: "B1",
    category: "formal_letters",
    topic: "administration",
    concept: "response_deadline",

    text:
      "Wij hebben uw bezwaar ontvangen. U ontvangt normaal gesproken binnen zes weken een beslissing. Als wij meer tijd nodig hebben, krijgt u daar schriftelijk bericht over.",

    question:
      "Wat staat er in de brief?",

    answers: [
      "The objection has been rejected.",
      "A decision always takes more than six weeks.",
      "A decision normally arrives within six weeks.",
      "The recipient must send another objection."
    ],

    correct: 2,

    explanation:
      "The letter says a decision normally follows within six weeks."
  }

];