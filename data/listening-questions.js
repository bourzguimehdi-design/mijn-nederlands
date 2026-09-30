const listeningQuestions = [

  // =====================================================
  // LISTENING — A1
  // =====================================================

  {
    id: "listening_a1_001",
    skill: "listening",
    level: "A1",
    category: "daily_life",
    topic: "appointments",
    concept: "simple_appointment",

    audio:
      "Hallo, ik bel over mijn afspraak. Ik kom morgen om tien uur.",

    question:
      "Wanneer is de afspraak?",

    answers: [
      "Today at 10:00",
      "Tomorrow at 10:00",
      "Tomorrow at 11:00",
      "Today at 11:00"
    ],

    correct: 1,

    explanation:
      "The speaker says: 'Ik kom morgen om tien uur.'"
  },

  {
    id: "listening_a1_002",
    skill: "listening",
    level: "A1",
    category: "shopping",
    topic: "shopping",
    concept: "simple_price",

    audio:
      "Goedemiddag. De appels kosten twee euro per kilo.",

    question:
      "Hoeveel kosten de appels?",

    answers: [
      "€1 per kilo",
      "€2 per kilo",
      "€3 per kilo",
      "€2 each"
    ],

    correct: 1,

    explanation:
      "The speaker says the apples cost two euros per kilogram."
  },

  {
    id: "listening_a1_003",
    skill: "listening",
    level: "A1",
    category: "transport",
    topic: "transport",
    concept: "departure_time",

    audio:
      "De trein naar Eindhoven vertrekt om kwart over acht van spoor drie.",

    question:
      "Hoe laat vertrekt de trein?",

    answers: [
      "07:45",
      "08:15",
      "08:30",
      "09:15"
    ],

    correct: 1,

    explanation:
      "'Kwart over acht' means 08:15."
  },

  {
    id: "listening_a1_004",
    skill: "listening",
    level: "A1",
    category: "work",
    topic: "work",
    concept: "simple_instruction",

    audio:
      "Goedemorgen. Vandaag beginnen we een half uur later, om half tien.",

    question:
      "Hoe laat begint het werk?",

    answers: [
      "08:30",
      "09:00",
      "09:30",
      "10:30"
    ],

    correct: 2,

    explanation:
      "'Half tien' means 09:30."
  },


  // =====================================================
  // LISTENING — A2
  // =====================================================

  {
    id: "listening_a2_001",
    skill: "listening",
    level: "A2",
    category: "healthcare",
    topic: "appointments",
    concept: "appointment_change",

    audio:
      "Goedemiddag, u spreekt met de huisartsenpraktijk. Uw afspraak van morgen om elf uur kan helaas niet doorgaan. Kunt u vrijdag om half twee komen?",

    question:
      "Wat stelt de huisartsenpraktijk voor?",

    answers: [
      "Come tomorrow at 11:00",
      "Come Friday at 13:30",
      "Come Friday at 14:30",
      "Cancel the appointment completely"
    ],

    correct: 1,

    explanation:
      "The new proposed time is Friday at 'half twee', which is 13:30."
  },

  {
    id: "listening_a2_002",
    skill: "listening",
    level: "A2",
    category: "transport",
    topic: "disruptions",
    concept: "platform_change",

    audio:
      "Let op. De trein naar Rotterdam van tien over vier vertrekt vandaag niet van spoor vijf, maar van spoor acht.",

    question:
      "Wat is er veranderd?",

    answers: [
      "The departure time",
      "The destination",
      "The platform",
      "The train has been cancelled"
    ],

    correct: 2,

    explanation:
      "The train departs from platform 8 instead of platform 5."
  },

  {
    id: "listening_a2_003",
    skill: "listening",
    level: "A2",
    category: "work",
    topic: "scheduling",
    concept: "work_schedule",

    audio:
      "Hoi Youssef. Kun jij donderdag een uur eerder beginnen? Fatima heeft 's ochtends een afspraak en komt pas om tien uur.",

    question:
      "Waarom wordt Youssef gevraagd eerder te beginnen?",

    answers: [
      "Because Fatima will arrive later",
      "Because the office closes early",
      "Because Youssef has an appointment",
      "Because there is a meeting at ten"
    ],

    correct: 0,

    explanation:
      "Fatima has an appointment and will not arrive until 10:00."
  },

  {
    id: "listening_a2_004",
    skill: "listening",
    level: "A2",
    category: "housing",
    topic: "maintenance",
    concept: "maintenance_visit",

    audio:
      "Morgen komt de monteur tussen twaalf en drie naar uw woning. U hoeft de verwarming niet uit te zetten, maar er moet wel iemand thuis zijn.",

    question:
      "Wat moet de bewoner doen?",

    answers: [
      "Turn off the heating",
      "Stay home for the technician",
      "Call the technician at three",
      "Leave the house before noon"
    ],

    correct: 1,

    explanation:
      "Someone needs to be home when the technician arrives."
  },


  // =====================================================
  // LISTENING — B1
  // =====================================================

  {
    id: "listening_b1_001",
    skill: "listening",
    level: "B1",
    category: "work",
    topic: "workplace",
    concept: "policy_change",

    audio:
      "Vanaf volgende maand mogen medewerkers maximaal twee dagen per week thuiswerken. Wie hiervan gebruik wil maken, moet hierover eerst afspraken maken met zijn of haar leidinggevende.",

    question:
      "Wat moeten medewerkers doen als ze thuis willen werken?",

    answers: [
      "Work at home every Friday",
      "Ask their colleagues for permission",
      "Make arrangements with their manager",
      "Submit a new employment contract"
    ],

    correct: 2,

    explanation:
      "Employees first need to make arrangements with their manager."
  },

  {
    id: "listening_b1_002",
    skill: "listening",
    level: "B1",
    category: "municipality",
    topic: "administration",
    concept: "municipal_request",

    audio:
      "U heeft onlangs een aanvraag bij de gemeente ingediend. Helaas ontbreekt er nog een document. Wij verzoeken u een kopie van uw arbeidscontract binnen twee weken op te sturen.",

    question:
      "Wat moet de persoon doen?",

    answers: [
      "Submit a new application",
      "Send a copy of the employment contract",
      "Visit the municipality tomorrow",
      "Wait two weeks before responding"
    ],

    correct: 1,

    explanation:
      "The municipality asks for a copy of the employment contract within two weeks."
  },

  {
    id: "listening_b1_003",
    skill: "listening",
    level: "B1",
    category: "transport",
    topic: "travel",
    concept: "alternative_route",

    audio:
      "Door een storing rijden er momenteel geen treinen tussen Den Bosch en Utrecht. Reizigers richting Utrecht kunnen via Nijmegen reizen. Houd rekening met ongeveer vijfenveertig minuten extra reistijd.",

    question:
      "Wat wordt reizigers naar Utrecht aangeraden?",

    answers: [
      "Wait in Den Bosch",
      "Travel through Nijmegen",
      "Take a bus to Amsterdam",
      "Cancel their ticket"
    ],

    correct: 1,

    explanation:
      "Travellers to Utrecht are advised to travel via Nijmegen."
  },

  {
    id: "listening_b1_004",
    skill: "listening",
    level: "B1",
    category: "healthcare",
    topic: "healthcare",
    concept: "medical_instruction",

    audio:
      "Uw bloedonderzoek laat geen bijzonderheden zien. Omdat uw klachten nog niet zijn verdwenen, wil de huisarts u toch over drie weken opnieuw spreken. Neem eerder contact op als de klachten erger worden.",

    question:
      "Wat moet de patiënt doen?",

    answers: [
      "Immediately go to hospital",
      "Return in three weeks, or contact the doctor sooner if symptoms worsen",
      "Have another blood test tomorrow",
      "Stop contacting the doctor"
    ],

    correct: 1,

    explanation:
      "The doctor wants another consultation in three weeks, unless the symptoms worsen earlier."
  }

];