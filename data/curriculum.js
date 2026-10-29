const DutchCurriculum = [
  {
    "id": "introductions",
    "level": "A1",
    "title": "Introducing yourself",
    "goal": "Introduce yourself and ask basic personal questions.",
    "explanation": "Use ik ben for identity, ik heet for names, and waar woon je? to ask where someone lives.",
    "examples": [
      {
        "nl": "Ik heet Samira.",
        "en": "My name is Samira."
      },
      {
        "nl": "Ik woon in Eindhoven.",
        "en": "I live in Eindhoven."
      }
    ],
    "checks": [
      {
        "prompt": "How do you say “I live in Utrecht”?",
        "answer": "Ik woon in Utrecht."
      },
      {
        "prompt": "How do you ask “What is your name?”",
        "answer": "Hoe heet je?"
      }
    ]
  },
  {
    "id": "present_tense",
    "level": "A1",
    "title": "Present tense",
    "goal": "Describe routines using common present-tense verbs.",
    "explanation": "Regular verbs: ik werk, jij werkt, wij werken. With inversion, the -t disappears after jij: werk jij?",
    "examples": [
      {
        "nl": "Ik werk vandaag.",
        "en": "I work today."
      },
      {
        "nl": "Werk jij morgen?",
        "en": "Are you working tomorrow?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ___ in Nederland. (werken)",
        "answer": "werk"
      },
      {
        "prompt": "Complete: ___ jij vandaag? (werken)",
        "answer": "Werk"
      }
    ]
  },
  {
    "id": "articles",
    "level": "A1",
    "title": "De and het",
    "goal": "Choose articles and recognize noun gender.",
    "explanation": "Dutch singular nouns use de or het. Plurals always use de. Learn each noun with its article.",
    "examples": [
      {
        "nl": "de tafel",
        "en": "the table"
      },
      {
        "nl": "het huis",
        "en": "the house"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ huis",
        "answer": "het"
      },
      {
        "prompt": "Complete: ___ tafels",
        "answer": "de"
      }
    ]
  },
  {
    "id": "pronouns",
    "level": "A1",
    "title": "Personal pronouns",
    "goal": "Use subject pronouns in simple sentences.",
    "explanation": "Ik, jij/je, hij, zij/ze, wij/we, jullie and zij/ze are subject pronouns.",
    "examples": [
      {
        "nl": "Wij leren Nederlands.",
        "en": "We learn Dutch."
      },
      {
        "nl": "Zij woont hier.",
        "en": "She lives here."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ leer Nederlands. (I)",
        "answer": "Ik"
      },
      {
        "prompt": "Complete: ___ wonen hier. (we)",
        "answer": "Wij"
      }
    ]
  },
  {
    "id": "question_formation",
    "level": "A1",
    "title": "Questions",
    "goal": "Ask yes/no and question-word questions.",
    "explanation": "Yes/no questions begin with the conjugated verb. Question-word questions begin with words like waar, wanneer, waarom and hoe.",
    "examples": [
      {
        "nl": "Woon je hier?",
        "en": "Do you live here?"
      },
      {
        "nl": "Waar werk je?",
        "en": "Where do you work?"
      }
    ],
    "checks": [
      {
        "prompt": "Ask “Where do you live?”",
        "answer": "Waar woon je?"
      },
      {
        "prompt": "Ask “Do you speak Dutch?”",
        "answer": "Spreek je Nederlands?"
      }
    ]
  },
  {
    "id": "negation",
    "level": "A1",
    "title": "Niet and geen",
    "goal": "Make simple negative statements.",
    "explanation": "Use geen with indefinite nouns, and niet with verbs, adjectives and definite phrases.",
    "examples": [
      {
        "nl": "Ik heb geen auto.",
        "en": "I do not have a car."
      },
      {
        "nl": "Ik werk vandaag niet.",
        "en": "I am not working today."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik heb ___ fiets.",
        "answer": "geen"
      },
      {
        "prompt": "Complete: Ik kom ___ morgen.",
        "answer": "niet"
      }
    ]
  },
  {
    "id": "numbers_time",
    "level": "A1",
    "title": "Numbers and time",
    "goal": "Talk about appointments, prices and time.",
    "explanation": "Use om for clock times, op for days, and the 24-hour clock for formal appointments.",
    "examples": [
      {
        "nl": "De afspraak is om negen uur.",
        "en": "The appointment is at nine."
      },
      {
        "nl": "Ik kom op maandag.",
        "en": "I come on Monday."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: De les begint ___ acht uur.",
        "answer": "om"
      },
      {
        "prompt": "Complete: Ik werk ___ dinsdag.",
        "answer": "op"
      }
    ]
  },
  {
    "id": "modal_verbs",
    "level": "A1",
    "title": "Modal verbs",
    "goal": "Express ability, permission, obligation and wishes.",
    "explanation": "Modal verbs such as kunnen, mogen, moeten and willen take the conjugated position; the main infinitive moves to the end.",
    "examples": [
      {
        "nl": "Ik moet morgen werken.",
        "en": "I must work tomorrow."
      },
      {
        "nl": "Mag ik hier zitten?",
        "en": "May I sit here?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ___ Nederlands leren. (want)",
        "answer": "wil"
      },
      {
        "prompt": "Complete: Wij moeten morgen ___. (work)",
        "answer": "werken"
      }
    ]
  },
  {
    "id": "separable_verbs",
    "level": "A1",
    "title": "Separable verbs",
    "goal": "Use everyday verbs such as opstaan and meenemen.",
    "explanation": "In a main clause, the prefix moves to the end. In an infinitive, the verb stays together.",
    "examples": [
      {
        "nl": "Ik sta om zeven uur op.",
        "en": "I get up at seven."
      },
      {
        "nl": "Ik wil vroeg opstaan.",
        "en": "I want to get up early."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ___ om zes uur ___. (opstaan)",
        "answer": "sta op"
      },
      {
        "prompt": "Complete: Ik wil morgen vroeg ___.",
        "answer": "opstaan"
      }
    ]
  },
  {
    "id": "word_order",
    "level": "A1",
    "title": "Main-clause word order",
    "goal": "Place the finite verb in second position.",
    "explanation": "In Dutch main clauses the conjugated verb comes second, even when a time phrase begins the sentence.",
    "examples": [
      {
        "nl": "Morgen ga ik naar school.",
        "en": "Tomorrow I go to school."
      },
      {
        "nl": "Vandaag werk ik thuis.",
        "en": "Today I work from home."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Morgen ___ ik naar huis. (gaan)",
        "answer": "ga"
      },
      {
        "prompt": "Complete: Vandaag ___ zij vrij. (zijn)",
        "answer": "is"
      }
    ]
  },
  {
    "id": "perfect_tense",
    "level": "A2",
    "title": "Perfect tense",
    "goal": "Describe completed events in the past.",
    "explanation": "Use the perfect tense to report completed events in conversation, including events with gisteren. Build a frame with a present form of hebben or zijn and a participle. Most verbs take hebben. Learn common zijn combinations: gaan, komen, vertrekken, blijven and worden. Movement alone does not automatically mean zijn.",
    "examples": [
      {
        "nl": "Ik heb gisteren gewerkt.",
        "en": "I worked yesterday."
      },
      {
        "nl": "Zij is naar huis gegaan.",
        "en": "She went home."
      },
      {
        "nl": "We hebben gisteren samen gekookt.",
        "en": "We cooked together yesterday. Hebben matches plural we."
      },
      {
        "nl": "Hij is om acht uur vertrokken.",
        "en": "He left at eight. Vertrekken takes zijn."
      },
      {
        "nl": "Ik heb een uur gefietst.",
        "en": "I cycled for an hour. This describes cycling as an activity."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ___ gisteren gewerkt.",
        "answer": "heb"
      },
      {
        "prompt": "Complete: Zij is naar huis ___. (gaan)",
        "answer": "gegaan"
      },
      {
        "prompt": "Complete: Wij ___ gisteren gekookt. (hebben)",
        "answer": "hebben"
      },
      {
        "prompt": "Complete: Hij is vroeg ___. (vertrekken)",
        "answer": "vertrokken"
      },
      {
        "prompt": "Complete: Ik heb de rekening ___. (betalen)",
        "answer": "betaald"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "past_participle",
    "level": "A2",
    "title": "Past participles",
    "goal": "Form regular and common irregular participles.",
    "explanation": "A past participle carries the completed action in heb gewerkt or ben gegaan. For regular verbs, identify the stem and choose -t or -d. Keep normal spelling: maken gives gemaakt. Strong and mixed verbs need their own learned forms. A participle is not a present-tense conjugation.",
    "examples": [
      {
        "nl": "werken → gewerkt",
        "en": "worked"
      },
      {
        "nl": "schrijven → geschreven",
        "en": "written"
      },
      {
        "nl": "Ik heb de deur geopend.",
        "en": "I opened the door. Openen is regular and takes -d."
      },
      {
        "nl": "Zij heeft lang gereisd.",
        "en": "She travelled for a long time. Choose from reizen, not only the respelled stem."
      },
      {
        "nl": "We hebben hem opgebeld.",
        "en": "We phoned him. Ge sits between op and beld."
      }
    ],
    "checks": [
      {
        "prompt": "Past participle of werken",
        "answer": "gewerkt"
      },
      {
        "prompt": "Past participle of schrijven",
        "answer": "geschreven"
      },
      {
        "prompt": "Past participle of betalen",
        "answer": "betaald"
      },
      {
        "prompt": "Past participle of opbellen",
        "answer": "opgebeld"
      },
      {
        "prompt": "Past participle of reizen",
        "answer": "gereisd"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "imperfect_tense",
    "level": "A2",
    "title": "Simple past",
    "goal": "Tell stories using the simple past.",
    "explanation": "The simple past describes past situations, repeated habits and stories. Was, had, kon and moest are especially common. Regular verbs use -te/-ten or -de/-den; frequent irregular verbs change their vowel. Learn singular and plural together. Simple past and perfect overlap; do not assume only one tense can describe a past event.",
    "examples": [
      {
        "nl": "Ik was gisteren ziek.",
        "en": "I was ill yesterday."
      },
      {
        "nl": "We gingen naar de markt.",
        "en": "We went to the market."
      },
      {
        "nl": "Vroeger woonde ik in Casablanca.",
        "en": "I used to live in Casablanca. Woonde describes a past situation."
      },
      {
        "nl": "We waren moe en hadden geen tijd.",
        "en": "We were tired and had no time. Plural we takes waren and hadden."
      },
      {
        "nl": "Gisteren moest ik vroeg werken.",
        "en": "Yesterday I had to work early. Moest is finite; werken stays infinitive."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ___ moe. (zijn, past)",
        "answer": "was"
      },
      {
        "prompt": "Complete: Wij ___ naar huis. (gaan, past)",
        "answer": "gingen"
      },
      {
        "prompt": "Complete: Wij ___ vorig jaar in Lyon. (wonen, past)",
        "answer": "woonden"
      },
      {
        "prompt": "Complete: Zij (plural) ___ geen tijd. (hebben, past)",
        "answer": "hadden"
      },
      {
        "prompt": "Complete: Ik ___ vroeg werken. (moeten, past)",
        "answer": "moest"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "subordinate_clauses",
    "level": "A2",
    "title": "Because and that",
    "goal": "Connect ideas with omdat and dat.",
    "explanation": "Omdat introduces a reason; dat introduces the content of a thought or report. In a simple subordinate clause the conjugated verb comes near the end, unlike a main clause. Build the two messages separately before joining them. Compare Ik ben moe with omdat ik moe ben.",
    "examples": [
      {
        "nl": "Ik blijf thuis omdat ik ziek ben.",
        "en": "I stay home because I am ill."
      },
      {
        "nl": "Ik denk dat hij morgen komt.",
        "en": "I think he comes tomorrow."
      },
      {
        "nl": "Ik weet dat de les om negen uur begint.",
        "en": "I know the lesson starts at nine. Begint ends the dat clause."
      },
      {
        "nl": "Omdat ik moet werken, kom ik later.",
        "en": "Because I must work, I will come later. The main clause starts kom ik."
      },
      {
        "nl": "Ik kom later, want ik moet werken.",
        "en": "I will come later because I must work. Want keeps normal main-clause order."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ... omdat ik moe ___.",
        "answer": "ben"
      },
      {
        "prompt": "Complete: Ik denk dat zij morgen ___. (komen)",
        "answer": "komt"
      },
      {
        "prompt": "Complete: Ik weet dat hij Nederlands ___. (spreken)",
        "answer": "spreekt"
      },
      {
        "prompt": "Complete: Ik blijf thuis omdat ik ziek ___. (zijn)",
        "answer": "ben"
      },
      {
        "prompt": "Put in order: denk / dat / Ik / zij / komt / morgen",
        "answer": "Ik denk dat zij morgen komt."
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "inversion",
    "level": "A2",
    "title": "Inversion",
    "goal": "Start sentences with time or place without losing verb-second order.",
    "explanation": "Dutch main clauses normally put the conjugated verb in position two. Position means a sentence part, not a word: na het werk fills one position. When time or place comes first, the subject follows the verb. Inversion changes the focus without changing the main message.",
    "examples": [
      {
        "nl": "Na het werk ga ik sporten.",
        "en": "After work I go exercise."
      },
      {
        "nl": "Morgen heeft zij tijd.",
        "en": "Tomorrow she has time."
      },
      {
        "nl": "Om acht uur begint de vergadering.",
        "en": "The meeting starts at eight. The whole time phrase is position one."
      },
      {
        "nl": "Daarna hebben we samen gegeten.",
        "en": "Afterwards we ate together. Hebben is second; gegeten remains at the end."
      },
      {
        "nl": "Vandaag werk jij thuis.",
        "en": "Today you work from home. Jij follows werk, so no -t."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Morgen ___ ik vrij. (zijn)",
        "answer": "ben"
      },
      {
        "prompt": "Complete: Daarna ___ we koffie. (drinken)",
        "answer": "drinken"
      },
      {
        "prompt": "Complete: Na de les ___ ik naar huis. (gaan)",
        "answer": "ga"
      },
      {
        "prompt": "Complete: Vandaag ___ jij thuis. (werken)",
        "answer": "werk"
      },
      {
        "prompt": "Put in order: thuis / Morgen / werkt / zij",
        "answer": "Morgen werkt zij thuis."
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "adjective_endings",
    "level": "A2",
    "title": "Adjective endings",
    "goal": "Describe objects with the correct adjective form.",
    "explanation": "Before a noun, an adjective usually ends in -e. An important exception is an indefinite singular het-word: een mooi huis. Learn the noun article first. After zijn, the adjective normally stays uninflected: de auto is mooi. Adding -e can also change the spelling of the stem.",
    "examples": [
      {
        "nl": "een mooie auto",
        "en": "a beautiful car"
      },
      {
        "nl": "een mooi huis",
        "en": "a beautiful house"
      },
      {
        "nl": "Wij zoeken een rustige buurt.",
        "en": "We are looking for a quiet neighbourhood. Buurt is a de-word, so rustige takes -e."
      },
      {
        "nl": "Dat is een groot raam.",
        "en": "That is a large window. Raam is a singular het-word after een."
      },
      {
        "nl": "Het grote raam is open.",
        "en": "The large window is open. Het gives grote before the noun; open stays uninflected after is."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: een mooi___ auto",
        "answer": "e"
      },
      {
        "prompt": "Complete: een ___ huis. (mooi/mooie)",
        "answer": "mooi"
      },
      {
        "prompt": "Complete: de ___ kamer (groot/grote)",
        "answer": "grote"
      },
      {
        "prompt": "Complete: een ___ probleem (groot/grote)",
        "answer": "groot"
      },
      {
        "prompt": "Complete: De stoelen zijn ___. (nieuw/nieuwe)",
        "answer": "nieuw"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "comparatives",
    "level": "A2",
    "title": "Comparisons",
    "goal": "Compare people, places and things.",
    "explanation": "Use a comparative to compare options: groter, goedkoper, sneller. A superlative identifies an extreme within a group: de goedkoopste winkel or het goedkoopst. Learn irregular forms and distinguish a difference with dan from equality with als.",
    "examples": [
      {
        "nl": "Deze trein is sneller.",
        "en": "This train is faster."
      },
      {
        "nl": "Dit is de beste optie.",
        "en": "This is the best option."
      },
      {
        "nl": "Deze kamer is groter dan mijn oude kamer.",
        "en": "This room is bigger than my old room. Groter uses dan."
      },
      {
        "nl": "De bus is even duur als de trein.",
        "en": "The bus costs as much as the train. Equal degree uses even ... als."
      },
      {
        "nl": "Dit is de beste oplossing.",
        "en": "This is the best solution. Beste is the irregular superlative of goed."
      }
    ],
    "checks": [
      {
        "prompt": "Comparative of snel",
        "answer": "sneller"
      },
      {
        "prompt": "Complete: Dit is de ___ optie. (goed: superlative)",
        "answer": "beste"
      },
      {
        "prompt": "Comparative of duur",
        "answer": "duurder"
      },
      {
        "prompt": "Complete: Deze trein is sneller ___ de bus.",
        "answer": "dan"
      },
      {
        "prompt": "Complete: Het is even duur ___ gisteren.",
        "answer": "als"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "prepositions",
    "level": "A2",
    "title": "Place and direction",
    "goal": "Describe location and movement.",
    "explanation": "Prepositions describe the relationship between a place, object and movement. Naar often points to a destination; in and op can describe a location. Choose from the scene, not an English translation alone. Fixed verb/preposition combinations have a separate lesson.",
    "examples": [
      {
        "nl": "De fiets staat naast het huis.",
        "en": "The bicycle is next to the house."
      },
      {
        "nl": "Ik ga naar de winkel.",
        "en": "I go to the shop."
      },
      {
        "nl": "Ik ga van mijn werk naar huis.",
        "en": "I go home from work. Van names the starting point; naar the destination."
      },
      {
        "nl": "De sleutels liggen in de lade.",
        "en": "The keys are in the drawer. In expresses a contained location."
      },
      {
        "nl": "De apotheek is tegenover het station.",
        "en": "The pharmacy is opposite the station. Tegenover relates two locations."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ga ___ Amsterdam.",
        "answer": "naar"
      },
      {
        "prompt": "Complete: De tas ligt ___ de tafel. (on)",
        "answer": "op"
      },
      {
        "prompt": "Complete: Ik ben ___ de winkel. (inside)",
        "answer": "in"
      },
      {
        "prompt": "Complete: De bank staat ___ de tafel en de kast. (between)",
        "answer": "tussen"
      },
      {
        "prompt": "Complete: Ik fiets ___ mijn werk naar huis. (from)",
        "answer": "van"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "time_expressions",
    "level": "A2",
    "title": "Time expressions",
    "goal": "Explain when and how often things happen.",
    "explanation": "Time expressions tell when something happens, how long a situation lasts and how often it repeats. Dutch often uses the present for a situation that began in the past and is still true. Contrast a starting point with a duration, and a future interval with a past one.",
    "examples": [
      {
        "nl": "Ik woon hier sinds 2022.",
        "en": "I have lived here since 2022."
      },
      {
        "nl": "Ik kom over twee dagen.",
        "en": "I will come in two days."
      },
      {
        "nl": "Ik leer al zes maanden Nederlands.",
        "en": "I have been learning Dutch for six months. The Dutch present describes a continuing situation."
      },
      {
        "nl": "Twee weken geleden ben ik verhuisd.",
        "en": "I moved two weeks ago. Geleden follows the interval."
      },
      {
        "nl": "Over tien minuten begint de les.",
        "en": "The lesson starts in ten minutes. Over points forward from now."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik woon hier ___ 2022.",
        "answer": "sinds"
      },
      {
        "prompt": "Complete: Ik kom ___ drie dagen.",
        "answer": "over"
      },
      {
        "prompt": "Complete: Ik ben drie dagen ___ aangekomen. (ago)",
        "answer": "geleden"
      },
      {
        "prompt": "Complete: Ik leer ___ twee jaar Nederlands. (already/so far)",
        "answer": "al"
      },
      {
        "prompt": "Complete: De bus komt ___ vijf minuten. (from now)",
        "answer": "over"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "future_plans",
    "level": "A2",
    "title": "Future plans",
    "goal": "Discuss intentions and arrangements.",
    "explanation": "Dutch future plans need no special verb ending. Use the present with a clear future time for arrangements, gaan plus infinitive for intentions, and zullen for proposals or expectations. Choose what fits your purpose instead of adding gaan to every future sentence.",
    "examples": [
      {
        "nl": "Ik ga morgen studeren.",
        "en": "I am going to study tomorrow."
      },
      {
        "nl": "Zullen we afspreken?",
        "en": "Shall we meet?"
      },
      {
        "nl": "Volgende week bezoek ik mijn ouders.",
        "en": "Next week I will visit my parents. Present tense plus future time is sufficient."
      },
      {
        "nl": "We gaan samen Nederlands oefenen.",
        "en": "We are going to practise Dutch together. Gaan is finite; oefenen is infinitive."
      },
      {
        "nl": "Zal ik een tafel reserveren?",
        "en": "Shall I reserve a table? Zal ik offers an action."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ___ morgen koken. (going to)",
        "answer": "ga"
      },
      {
        "prompt": "Complete: ___ we morgen bellen? (shall)",
        "answer": "Zullen"
      },
      {
        "prompt": "Complete: Wij ___ morgen studeren. (going to)",
        "answer": "gaan"
      },
      {
        "prompt": "Complete: ___ ik u helpen? (shall)",
        "answer": "Zal"
      },
      {
        "prompt": "Complete: Ik ga vanavond ___. (koken)",
        "answer": "koken"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "reflexive_verbs",
    "level": "A2",
    "title": "Reflexive verbs",
    "goal": "Talk about routines and feelings.",
    "explanation": "A reflexive pronoun refers back to the subject: Ik was me means I wash myself. Some Dutch verbs also need this pronoun where English does not: ik vergis me (I am mistaken), ik voel me goed (I feel well). Learn the verb as a phrase, such as zich vergissen, and change zich to match the subject. Do not add a reflexive pronoun to every verb.",
    "examples": [
      {
        "nl": "Ik was me.",
        "en": "I wash myself. Me refers to ik."
      },
      {
        "nl": "Ik was de auto.",
        "en": "I wash the car. The object is the car, so there is no reflexive pronoun."
      },
      {
        "nl": "Jij voelt je moe.",
        "en": "You feel tired. Jij takes je."
      },
      {
        "nl": "Hij vergist zich.",
        "en": "He is mistaken. Hij takes zich."
      },
      {
        "nl": "Wij haasten ons.",
        "en": "We hurry. Wij takes ons."
      },
      {
        "nl": "Jullie voelen je beter.",
        "en": "You (plural) feel better. Jullie takes je, not jullie."
      },
      {
        "nl": "Voel je je goed?",
        "en": "Do you feel well? The first je is the subject; the second is reflexive."
      },
      {
        "nl": "Ik moet me aankleden.",
        "en": "I must get dressed. Moet is finite; aankleden is the infinitive at the end."
      },
      {
        "nl": "Ik heb me vergist.",
        "en": "I made a mistake. Heb is finite; vergist is the participle."
      },
      {
        "nl": "Omdat ik me niet goed voel, blijf ik thuis.",
        "en": "Because I do not feel well, I stay home. In the omdat clause voel comes at the end."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik voel ___ vandaag moe.",
        "answer": "me"
      },
      {
        "prompt": "Complete: Wij haasten ___ naar de trein.",
        "answer": "ons"
      },
      {
        "prompt": "Complete: Jullie vergissen ___.",
        "answer": "je"
      },
      {
        "prompt": "Complete: Zij (plural) voelen ___ beter.",
        "answer": "zich"
      },
      {
        "prompt": "Complete: Ik moet ___ aankleden.",
        "answer": "me"
      },
      {
        "prompt": "Put in order: je / Voel / goed / je",
        "answer": "Voel je je goed?"
      }
    ]
  },
  {
    "id": "relative_clauses",
    "level": "A2",
    "title": "Relative clauses",
    "goal": "Describe people and objects in more detail.",
    "explanation": "A relative clause adds information about a noun: de fiets die ik gebruik (the bicycle that I use). First identify that noun and its article. Use die for de-words and all plural nouns; use dat for singular het-words. This is a different job from the conjunction dat in Ik denk dat hij komt. In a simple relative clause, put the finite verb after the other information.",
    "examples": [
      {
        "nl": "De fiets die ik gebruik, is nieuw.",
        "en": "The bicycle that I use is new. Fiets is a de-word, so use die."
      },
      {
        "nl": "Het boek dat ik lees, is interessant.",
        "en": "The book that I read is interesting. Boek is singular and takes het, so use dat."
      },
      {
        "nl": "De boeken die ik lees, zijn interessant.",
        "en": "The books that I read are interesting. Plural nouns take die, even when the singular uses het."
      },
      {
        "nl": "De buurman die naast mij woont, is aardig.",
        "en": "The neighbour who lives next to me is kind. Woont ends the relative clause."
      },
      {
        "nl": "Dat is het huis dat ik wil kopen.",
        "en": "That is the house that I want to buy. The relative clause ends with the verb group wil kopen."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: De fiets ___ ik gebruik, is nieuw.",
        "answer": "die"
      },
      {
        "prompt": "Complete: Het boek ___ ik lees, is oud.",
        "answer": "dat"
      },
      {
        "prompt": "Complete: De huizen ___ hier staan, zijn duur.",
        "answer": "die"
      },
      {
        "prompt": "Complete: Het meisje ___ hier woont, heet Sara.",
        "answer": "dat"
      },
      {
        "prompt": "Put in order: de man / Dat is / hier werkt / die",
        "answer": "Dat is de man die hier werkt."
      }
    ]
  },
  {
    "id": "imperatives",
    "level": "A2",
    "title": "Instructions and requests",
    "goal": "Give polite and clear instructions.",
    "explanation": "Use an imperative for a direct instruction, a request form for a service interaction, and a warning when attention is urgent. The direct form usually uses the verb stem without a subject. Politeness depends on the relationship and situation, not just adding one polite word.",
    "examples": [
      {
        "nl": "Kom binnen!",
        "en": "Come in!"
      },
      {
        "nl": "Kunt u mij helpen?",
        "en": "Can you help me?"
      },
      {
        "nl": "Vul uw naam hier in.",
        "en": "Fill in your name here. Invullen separates into vul ... in."
      },
      {
        "nl": "Kunt u wat langzamer spreken?",
        "en": "Can you speak a little more slowly? The request uses u and an infinitive."
      },
      {
        "nl": "Wacht alstublieft bij de ingang.",
        "en": "Please wait at the entrance. Wacht is the direct verb form; the location makes it usable."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ even! (wachten)",
        "answer": "Wacht"
      },
      {
        "prompt": "Make a formal request starting with Kunt u: Can you help me?",
        "answer": "Kunt u mij helpen?",
        "acceptedAnswers": [
          "Kunt u me helpen?"
        ]
      },
      {
        "prompt": "Complete: ___ de deur, alstublieft. (openen, instruction)",
        "answer": "Open"
      },
      {
        "prompt": "Complete: Vul het formulier ___. (invullen)",
        "answer": "in"
      },
      {
        "prompt": "Complete: Kunt u mij ___? (helpen)",
        "answer": "helpen"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "appointments",
    "level": "A2",
    "title": "Making appointments",
    "goal": "Arrange, move and cancel appointments.",
    "explanation": "A useful appointment conversation states the service, proposes a date and time, confirms the details and explains any change. Maken arranges an appointment, verzetten moves it, and afzeggen cancels it. These are different actions: make your intention explicit.",
    "examples": [
      {
        "nl": "Ik wil graag een afspraak maken.",
        "en": "I would like to make an appointment."
      },
      {
        "nl": "Kan ik de afspraak verzetten?",
        "en": "Can I reschedule the appointment?"
      },
      {
        "nl": "Heeft u vrijdag om half tien tijd?",
        "en": "Are you available Friday at 9:30? Half tien is half an hour before ten."
      },
      {
        "nl": "Ik kan helaas niet komen. Kan het ook maandag?",
        "en": "Unfortunately I cannot come. Would Monday also work? Explain unavailability and offer an alternative."
      },
      {
        "nl": "Dus donderdag om elf uur. Moet ik iets meenemen?",
        "en": "So Thursday at eleven. Should I bring anything? Repeat the agreement and ask about preparation."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik wil een afspraak ___.",
        "answer": "maken"
      },
      {
        "prompt": "Complete: Kan ik de afspraak ___? (reschedule)",
        "answer": "verzetten",
        "acceptedAnswers": [
          "verplaatsen"
        ]
      },
      {
        "prompt": "Complete: Ik wil mijn afspraak ___. (cancel)",
        "answer": "afzeggen"
      },
      {
        "prompt": "Complete: De afspraak is ___ woensdag.",
        "answer": "op"
      },
      {
        "prompt": "Write the time as digits: half tien",
        "answer": "9:30"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "shopping",
    "level": "A2",
    "title": "Shopping and returns",
    "goal": "Ask about products, sizes and refunds.",
    "explanation": "Shopping language needs more than product names: ask about size, availability and price, then explain a problem or requested exchange. Use polite question patterns and specific details. This lesson practises language, not a claim that every shop has the same returns policy.",
    "examples": [
      {
        "nl": "Heeft u dit in een andere maat?",
        "en": "Do you have this in another size?"
      },
      {
        "nl": "Ik wil dit graag terugbrengen.",
        "en": "I would like to return this."
      },
      {
        "nl": "Deze broek is te klein. Heeft u een grotere maat?",
        "en": "These trousers are too small. Do you have a larger size? Te klein explains the problem; grotere maat requests a solution."
      },
      {
        "nl": "Kan ik dit shirt ruilen voor een blauw shirt?",
        "en": "Can I exchange this shirt for a blue one? Ruilen voor names the desired replacement."
      },
      {
        "nl": "Hoeveel kosten deze schoenen?",
        "en": "How much do these shoes cost? Plural schoenen takes kosten."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Heeft u dit in een andere ___? (size)",
        "answer": "maat"
      },
      {
        "prompt": "Complete: Ik wil dit graag ___. (bring back)",
        "answer": "terugbrengen",
        "acceptedAnswers": [
          "retourneren"
        ]
      },
      {
        "prompt": "Complete: Mag ik deze jas ___? (try on)",
        "answer": "passen"
      },
      {
        "prompt": "Complete: Hoeveel ___ deze schoenen? (kosten)",
        "answer": "kosten"
      },
      {
        "prompt": "Complete: Deze broek is ___ klein. (too)",
        "answer": "te"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "healthcare",
    "level": "A2",
    "title": "At the doctor",
    "goal": "Describe symptoms and make a medical appointment.",
    "explanation": "When describing a health problem, say what you feel, where it is, when it started and what help you are asking for. Use short factual sentences instead of inventing a diagnosis. The examples teach Dutch communication only; they are not medical instructions.",
    "examples": [
      {
        "nl": "Ik heb last van hoofdpijn.",
        "en": "I have a headache."
      },
      {
        "nl": "Ik ben sinds maandag ziek.",
        "en": "I have been ill since Monday."
      },
      {
        "nl": "Ik heb sinds gisteren last van mijn keel.",
        "en": "My throat has been bothering me since yesterday. The phrase identifies location and starting time."
      },
      {
        "nl": "De pijn wordt erger als ik loop.",
        "en": "The pain gets worse when I walk. An als clause describes the condition clearly."
      },
      {
        "nl": "Kunt u uitleggen wat ik nu moet doen?",
        "en": "Can you explain what I should do now? The question asks for clear next steps."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik heb last ___ hoofdpijn.",
        "answer": "van"
      },
      {
        "prompt": "Complete: Ik ben ___ dinsdag ziek.",
        "answer": "sinds"
      },
      {
        "prompt": "Complete: Ik heb last ___ mijn keel.",
        "answer": "van"
      },
      {
        "prompt": "Complete: Ik ___ misselijk. (zijn)",
        "answer": "ben"
      },
      {
        "prompt": "Complete: Kunt u dat ___? (repeat)",
        "answer": "herhalen"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "housing",
    "level": "A2",
    "title": "Housing and repairs",
    "goal": "Report housing problems and ask for repairs.",
    "explanation": "To report a housing problem, identify the object and room, describe what is wrong, say when it began and request a practical next step. The same structure works for heating, doors and leaks. It is language practice, not advice about legal repair responsibilities.",
    "examples": [
      {
        "nl": "De verwarming doet het niet.",
        "en": "The heating is not working."
      },
      {
        "nl": "Kunt u dit repareren?",
        "en": "Could you repair this?"
      },
      {
        "nl": "Er lekt water onder de gootsteen.",
        "en": "Water is leaking under the sink. The verb and location describe the observable issue."
      },
      {
        "nl": "De deur gaat sinds gisteren niet meer dicht.",
        "en": "The door has not closed properly since yesterday. Niet meer expresses a change from before."
      },
      {
        "nl": "Kunt u vrijdag een monteur sturen?",
        "en": "Can you send a technician on Friday? A polite question requests a concrete next step."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: De verwarming doet het ___. (not)",
        "answer": "niet"
      },
      {
        "prompt": "Complete: Kunt u dit ___? (repair)",
        "answer": "repareren"
      },
      {
        "prompt": "Complete: Er is een ___ in de badkamer. (leak)",
        "answer": "lekkage"
      },
      {
        "prompt": "Complete: De deur gaat niet ___. (closed)",
        "answer": "dicht"
      },
      {
        "prompt": "Complete: Hoe laat komt de ___? (technician)",
        "answer": "monteur"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "workplace",
    "level": "A2",
    "title": "Work communication",
    "goal": "Explain tasks, availability and delays at work.",
    "explanation": "Clear work communication states the task, current status, deadline and any help needed. Keep a delay message specific and polite. Use a reason and propose an alternative rather than saying only that something is impossible.",
    "examples": [
      {
        "nl": "Ik ben vandaag wat later.",
        "en": "I am a little late today."
      },
      {
        "nl": "Kunnen we de vergadering verplaatsen?",
        "en": "Can we move the meeting?"
      },
      {
        "nl": "Ik ben bezig met het rapport. Het is morgen klaar.",
        "en": "I am working on the report. It will be ready tomorrow. The message gives status and expected completion."
      },
      {
        "nl": "Kun je de gegevens voor drie uur sturen?",
        "en": "Can you send the data before three? The request includes a deadline."
      },
      {
        "nl": "De test duurt langer omdat een onderdeel ontbreekt.",
        "en": "The test takes longer because a part is missing. Ontbreekt goes at the end after omdat."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ben vandaag wat ___. (later)",
        "answer": "later"
      },
      {
        "prompt": "Complete: Kunnen we de vergadering ___? (move to another time)",
        "answer": "verplaatsen",
        "acceptedAnswers": [
          "verzetten"
        ]
      },
      {
        "prompt": "Complete: Ik ben bezig ___ het rapport.",
        "answer": "met"
      },
      {
        "prompt": "Complete: Ik ben klaar ___ deze taak.",
        "answer": "met"
      },
      {
        "prompt": "Complete: Stuur het uiterlijk ___. (Friday)",
        "answer": "vrijdag"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "email_messages",
    "level": "A2",
    "title": "Emails and messages",
    "goal": "Write short polite personal and practical messages.",
    "explanation": "A short practical email needs a recipient-appropriate greeting, the reason for writing, essential details, a clear request and a closing. Short complete sentences are more useful than a long unexplained story. Informal messages can be warmer, but the reader still needs to know what to do.",
    "examples": [
      {
        "nl": "Beste mevrouw De Vries,",
        "en": "Dear Ms De Vries,"
      },
      {
        "nl": "Met vriendelijke groet,",
        "en": "Kind regards,"
      },
      {
        "nl": "Beste mevrouw Jansen, ik heb een vraag over mijn afspraak.",
        "en": "Dear Ms Jansen, I have a question about my appointment. The opening identifies the purpose."
      },
      {
        "nl": "Kunt u bevestigen dat de afspraak op vrijdag is?",
        "en": "Can you confirm the appointment is on Friday? The request tells the reader which detail to check."
      },
      {
        "nl": "Hoi Noor, helaas kan ik morgen niet komen. Zullen we zondag afspreken?",
        "en": "Hi Noor, unfortunately I cannot come tomorrow. Shall we meet Sunday? An informal message gives a reason to write and an alternative."
      }
    ],
    "checks": [
      {
        "prompt": "Formal email opening: ___ mevrouw",
        "answer": "Beste"
      },
      {
        "prompt": "Formal closing: Met vriendelijke ___",
        "answer": "groet",
        "acceptedAnswers": [
          "groeten"
        ]
      },
      {
        "prompt": "Complete: Ik heb een vraag ___ mijn afspraak.",
        "answer": "over"
      },
      {
        "prompt": "Complete: Met vriendelijke ___.",
        "answer": "groet"
      },
      {
        "prompt": "Complete: Kunt ___ mij terugbellen? (formal you)",
        "answer": "u"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "giving_opinions",
    "level": "A2",
    "title": "Opinions and reasons",
    "goal": "Give a simple opinion and explain why.",
    "explanation": "An opinion becomes useful when the listener knows what you think and why. Ik vind often evaluates something; ik denk dat introduces a belief. According to me is usually volgens mij. Keep your claim modest when it is a preference rather than an established fact.",
    "examples": [
      {
        "nl": "Ik vind het interessant.",
        "en": "I find it interesting."
      },
      {
        "nl": "Ik blijf thuis omdat het regent.",
        "en": "I stay home because it rains."
      },
      {
        "nl": "Ik vind de trein prettig omdat ik onderweg kan lezen.",
        "en": "I like the train because I can read on the way. The reason ends with the verb group kan lezen."
      },
      {
        "nl": "Volgens mij is deze route sneller.",
        "en": "I think this route is faster. The finite verb follows the opening phrase."
      },
      {
        "nl": "Ik ben het met je eens, maar het is wel duur.",
        "en": "I agree with you, but it is expensive. Maar adds a qualification while keeping main-clause order."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ___ dit leuk.",
        "answer": "vind"
      },
      {
        "prompt": "Complete: Ik blijf thuis omdat het ___. (regenen)",
        "answer": "regent"
      },
      {
        "prompt": "Complete: Ik ___ deze film leuk. (find)",
        "answer": "vind"
      },
      {
        "prompt": "Complete: Volgens mij ___ dit beter. (zijn)",
        "answer": "is"
      },
      {
        "prompt": "Complete: Ik ben het met je ___. (agree)",
        "answer": "eens"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "reading_notices",
    "level": "A2",
    "title": "Reading notices",
    "goal": "Understand notices, instructions and short announcements.",
    "explanation": "Read a short notice in layers: identify what it concerns, find the important change or condition, then decide what action is needed. Do not translate every word before checking dates, negation and exceptions. The correct answer must come from the notice, not from what is usually true.",
    "examples": [
      {
        "nl": "De winkel is wegens vakantie gesloten.",
        "en": "The shop is closed for holidays."
      },
      {
        "nl": "Alleen op afspraak.",
        "en": "By appointment only."
      },
      {
        "nl": "De winkel is tot en met vrijdag gesloten.",
        "en": "The shop is closed through Friday. Friday is included; do not infer it opens on Friday."
      },
      {
        "nl": "Meld u uiterlijk maandag aan.",
        "en": "Register no later than Monday. Uiterlijk signals a deadline, not the event date."
      },
      {
        "nl": "De afspraak is verplaatst naar donderdag.",
        "en": "The appointment has been moved to Thursday. The new day is Thursday; the old day may be different."
      }
    ],
    "checks": [
      {
        "prompt": "Meaning of “gesloten”",
        "answer": "closed",
        "acceptedAnswers": [
          "shut"
        ]
      },
      {
        "prompt": "Meaning of “alleen op afspraak”",
        "answer": "by appointment only",
        "acceptedAnswers": [
          "only by appointment",
          "appointment only"
        ]
      },
      {
        "prompt": "Notice: De winkel is alleen op zondag dicht. Which day is it closed? (Dutch)",
        "answer": "zondag"
      },
      {
        "prompt": "Notice: Bel uiterlijk vrijdag. Which word means no later than?",
        "answer": "uiterlijk"
      },
      {
        "prompt": "Notice: De les is verplaatst naar dinsdag. What is the new day? (Dutch)",
        "answer": "dinsdag"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "listening_details",
    "level": "A2",
    "title": "Listening for details",
    "goal": "Catch times, places and actions in everyday speech.",
    "explanation": "Listen first for the situation and purpose, then for one category of detail at a time: time, place, number or action. Spoken corrections such as niet ... maar ... often change the important answer. The written drills prepare these skills; use the app listening practice for actual audio evidence.",
    "examples": [
      {
        "nl": "De trein vertrekt om kwart over acht.",
        "en": "The train leaves at 8:15."
      },
      {
        "nl": "De afspraak is verplaatst.",
        "en": "The appointment has been moved."
      },
      {
        "nl": "Niet om twee uur, maar om half drie.",
        "en": "Not at two, but at half past two. The final corrected time is 14:30 in this afternoon context."
      },
      {
        "nl": "De bus vertrekt vanaf de achterkant van het station.",
        "en": "The bus leaves from the back of the station. Achterkant is a location clue."
      },
      {
        "nl": "Neem uw identiteitsbewijs mee.",
        "en": "Bring your identity document. Meenemen describes the required action, not an arrival time."
      }
    ],
    "checks": [
      {
        "prompt": "What time is “kwart over acht”?",
        "answer": "8:15"
      },
      {
        "prompt": "Meaning of “verplaatst”",
        "answer": "moved",
        "acceptedAnswers": [
          "rescheduled",
          "relocated"
        ]
      },
      {
        "prompt": "Write the time as digits: half negen",
        "answer": "8:30"
      },
      {
        "prompt": "Message: Niet maandag maar woensdag. Which day? (Dutch)",
        "answer": "woensdag"
      },
      {
        "prompt": "Message: Neem uw paspoort mee. What must you bring? (Dutch noun)",
        "answer": "paspoort"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "narrating_events",
    "level": "B1",
    "title": "Narrating experiences",
    "goal": "Tell a connected story with sequence and reasons.",
    "explanation": "Use eerst, daarna, vervolgens, uiteindelijk and past tenses to make a coherent account.",
    "examples": [
      {
        "nl": "Eerst ging ik werken, daarna bezocht ik vrienden.",
        "en": "First I went to work, then I visited friends."
      },
      {
        "nl": "Uiteindelijk besloot ik thuis te blijven.",
        "en": "Eventually I decided to stay home."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Eerst at ik, ___ ging ik weg.",
        "answer": "daarna"
      },
      {
        "prompt": "Complete: ___ besloot ik te stoppen.",
        "answer": "Uiteindelijk"
      }
    ]
  },
  {
    "id": "argumentation",
    "level": "B1",
    "title": "Supporting an opinion",
    "goal": "Express and support a viewpoint with examples.",
    "explanation": "State your view, give a reason, and introduce an example or contrast.",
    "examples": [
      {
        "nl": "Volgens mij is dit een goed idee, omdat het tijd bespaart.",
        "en": "In my opinion this is a good idea because it saves time."
      },
      {
        "nl": "Aan de andere kant kost het geld.",
        "en": "On the other hand it costs money."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ mij is dit nuttig.",
        "answer": "Volgens"
      },
      {
        "prompt": "Complete: Aan de andere ___.",
        "answer": "kant"
      }
    ]
  },
  {
    "id": "complex_connectors",
    "level": "B1",
    "title": "Complex connectors",
    "goal": "Connect clauses with contrast, consequence and conditions.",
    "explanation": "Use hoewel for concession, daarom for consequence, and als for conditions.",
    "examples": [
      {
        "nl": "Hoewel het regent, ga ik fietsen.",
        "en": "Although it is raining, I am going cycling."
      },
      {
        "nl": "Het is laat, daarom ga ik naar huis.",
        "en": "It is late, so I am going home."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ het regent, ga ik toch.",
        "answer": "Hoewel"
      },
      {
        "prompt": "Complete: Het is laat, ___ vertrek ik.",
        "answer": "daarom"
      }
    ]
  },
  {
    "id": "formal_requests",
    "level": "B1",
    "title": "Formal requests",
    "goal": "Write and speak with appropriate register.",
    "explanation": "Use conditional phrases to soften requests and explain what action you expect.",
    "examples": [
      {
        "nl": "Zou u mij hierover kunnen informeren?",
        "en": "Could you inform me about this?"
      },
      {
        "nl": "Ik hoor graag van u.",
        "en": "I look forward to hearing from you."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ u mij kunnen helpen?",
        "answer": "Zou"
      },
      {
        "prompt": "Complete: Ik hoor graag van ___.",
        "answer": "u"
      }
    ]
  },
  {
    "id": "summarizing",
    "level": "B1",
    "title": "Summarizing information",
    "goal": "Summarize the main points of a text or conversation.",
    "explanation": "Identify the central idea, supporting points and conclusion without copying every detail.",
    "examples": [
      {
        "nl": "De belangrijkste boodschap is dat de regels veranderen.",
        "en": "The main message is that the rules are changing."
      },
      {
        "nl": "Kort samengevat zijn er twee opties.",
        "en": "In short, there are two options."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Kort ___.",
        "answer": "samengevat"
      },
      {
        "prompt": "Complete: De belangrijkste ___ is duidelijk.",
        "answer": "boodschap"
      }
    ]
  },
  {
    "id": "negation_niet_geen",
    "level": "A2",
    "title": "Negation: niet and geen",
    "goal": "Say what you do not do or do not have.",
    "explanation": "Geen negates an indefinite noun or amount; niet negates an action, quality, definite object or another part of a message. Start by identifying what you are denying. Dutch placement depends on the structure, so learn short patterns and avoid a single rule that puts niet at the end of every sentence.",
    "examples": [
      {
        "nl": "Ik heb geen afspraak.",
        "en": "I do not have an appointment."
      },
      {
        "nl": "De winkel is niet open.",
        "en": "The shop is not open."
      },
      {
        "nl": "Ik heb geen fiets.",
        "en": "I do not have a bicycle. An indefinite noun uses geen."
      },
      {
        "nl": "Ik vind deze fiets niet duur.",
        "en": "I do not find this bicycle expensive. Niet negates the adjective duur."
      },
      {
        "nl": "Ik heb het formulier nog niet ingevuld.",
        "en": "I have not filled in the form yet. Nog niet precedes the final participle."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik heb ___ fiets. (no bicycle)",
        "answer": "geen"
      },
      {
        "prompt": "Complete: Ik kom vandaag ___. (not)",
        "answer": "niet"
      },
      {
        "prompt": "Complete: Ik drink ___ koffie. (none)",
        "answer": "geen"
      },
      {
        "prompt": "Complete: De winkel is ___ open. (not)",
        "answer": "niet"
      },
      {
        "prompt": "Complete: Ik kan ___ komen. (not)",
        "answer": "niet"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "object_pronouns",
    "level": "A2",
    "title": "Object pronouns",
    "goal": "Use me, je, hem, haar, ons and ze in daily exchanges.",
    "explanation": "Object pronouns replace the person or thing receiving an action. Compare subject hij with object hem: Hij belt mij; ik bel hem. Keep the subject clear before choosing the object form. At A2, learn common direct-object patterns before more complex indirect-object distinctions.",
    "examples": [
      {
        "nl": "Ik zie haar morgen.",
        "en": "I will see her tomorrow."
      },
      {
        "nl": "Kun je me helpen?",
        "en": "Can you help me?"
      },
      {
        "nl": "Mijn zus belt mij morgen.",
        "en": "My sister will phone me tomorrow. Mij is the object; mijn zus is the subject."
      },
      {
        "nl": "Kun je ons helpen?",
        "en": "Can you help us? Ons is the object; je is the subject."
      },
      {
        "nl": "Ik ga met haar naar de les.",
        "en": "I am going to class with her. After met use haar, not zij."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik bel ___. (him)",
        "answer": "hem"
      },
      {
        "prompt": "Complete: Kun je ___ helpen? (me)",
        "answer": "me",
        "acceptedAnswers": [
          "mij"
        ]
      },
      {
        "prompt": "Complete: Ik help ___. (her)",
        "answer": "haar"
      },
      {
        "prompt": "Complete: Hij praat met ___. (me: stressed form)",
        "answer": "mij"
      },
      {
        "prompt": "Complete: Kun je ___ bellen? (us)",
        "answer": "ons"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "possessives",
    "level": "A2",
    "title": "Possessive words",
    "goal": "Talk about belongings and relationships.",
    "explanation": "Possessive words identify who something belongs to and normally replace de/het before the noun. Choose the owner first, then check the noun only for ons/onze. Do not confuse jouw (your) with jou (you), or uw (your, formal) with u (you).",
    "examples": [
      {
        "nl": "Dat is mijn tas.",
        "en": "That is my bag."
      },
      {
        "nl": "Dit is ons huis.",
        "en": "This is our house."
      },
      {
        "nl": "Ons huis heeft een tuin.",
        "en": "Our house has a garden. Huis is a singular het-word."
      },
      {
        "nl": "Onze buren zijn aardig.",
        "en": "Our neighbours are kind. Plural buren takes onze."
      },
      {
        "nl": "Is dit jouw tas of haar tas?",
        "en": "Is this your bag or her bag? The forms identify different owners."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Dit is ___ huis. (our)",
        "answer": "ons"
      },
      {
        "prompt": "Complete: Dat is ___ fiets. (my)",
        "answer": "mijn"
      },
      {
        "prompt": "Complete: Dit zijn ___ boeken. (our)",
        "answer": "onze"
      },
      {
        "prompt": "Complete: Is dat ___ telefoon? (formal your)",
        "answer": "uw"
      },
      {
        "prompt": "Complete: De tas is van ___. (me)",
        "answer": "mij"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "question_words",
    "level": "A2",
    "title": "Questions and clarification",
    "goal": "Ask and answer wie, wat, waar, wanneer, waarom and hoe.",
    "explanation": "Use the question word that matches the missing information, then the finite verb and subject in a normal information question. A reason, location, time and quantity are different answer types. Useful clarification questions help you keep communicating when you miss a word.",
    "examples": [
      {
        "nl": "Hoe laat vertrekt de trein?",
        "en": "What time does the train leave?"
      },
      {
        "nl": "Waarom ben je te laat?",
        "en": "Why are you late?"
      },
      {
        "nl": "Hoe lang duurt de cursus?",
        "en": "How long does the course last? The answer needs a duration, not just a start time."
      },
      {
        "nl": "Welke trein moet ik nemen?",
        "en": "Which train should I take? Welke selects a train; nemen stays at the end."
      },
      {
        "nl": "Wat bedoelt u met dit woord?",
        "en": "What do you mean by this word? This asks for clarification politely."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ vertrekt de trein? (when)",
        "answer": "Wanneer"
      },
      {
        "prompt": "Complete: ___ heet je? (how)",
        "answer": "Hoe"
      },
      {
        "prompt": "Complete: ___ kost dit? (how much)",
        "answer": "Hoeveel"
      },
      {
        "prompt": "Complete: ___ ben je te laat? (why)",
        "answer": "Waarom"
      },
      {
        "prompt": "Complete: ___ bus gaat naar het centrum? (which)",
        "answer": "Welke"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "numbers_prices",
    "level": "A2",
    "title": "Numbers, prices and quantities",
    "goal": "Understand prices, dates, measurements and amounts.",
    "explanation": "Dutch numbers reverse the English order within many two-digit numbers: drieëntwintig is twenty-three. Prices, measurements and quantities add another layer: listen for the unit and decimal comma. Ask for confirmation if a number matters rather than guessing from one sound.",
    "examples": [
      {
        "nl": "Het kost twaalf euro vijftig.",
        "en": "It costs twelve euros fifty."
      },
      {
        "nl": "Ik wil twee kilo appels.",
        "en": "I want two kilos of apples."
      },
      {
        "nl": "Dat kost twaalf euro vijftig.",
        "en": "That costs twelve euros fifty. The phrase names euros and the fractional amount."
      },
      {
        "nl": "Ik wil anderhalve kilo appels.",
        "en": "I would like one and a half kilos of apples. Anderhalve kilo expresses 1.5 kg."
      },
      {
        "nl": "Bedoelt u vijftien of vijftig euro?",
        "en": "Do you mean fifteen or fifty euros? A clarification protects against a misunderstood number."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ kost dit?",
        "answer": "Hoeveel"
      },
      {
        "prompt": "Complete: Ik wil twee ___ appels. (kilos)",
        "answer": "kilo"
      },
      {
        "prompt": "Write drieëntwintig in digits",
        "answer": "23"
      },
      {
        "prompt": "Write € 12,50 as digits without the euro sign",
        "answer": "12,50"
      },
      {
        "prompt": "Complete: Ik koop drie ___ water. (liters)",
        "answer": "liter"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "transport_travel",
    "level": "A2",
    "title": "Transport and travel",
    "goal": "Buy tickets, ask about delays and navigate journeys.",
    "explanation": "A journey involves a destination, departure and arrival, possible transfers and a platform or stop. Read or listen for which part changed. Learn travel words as action phrases, not only isolated nouns, so you can ask for the next step.",
    "examples": [
      {
        "nl": "De trein heeft tien minuten vertraging.",
        "en": "The train is delayed ten minutes."
      },
      {
        "nl": "Ik moet in Utrecht overstappen.",
        "en": "I have to change trains in Utrecht."
      },
      {
        "nl": "De trein naar Utrecht vertrekt van spoor zes.",
        "en": "The train to Utrecht leaves from track six. The destination and track are separate details."
      },
      {
        "nl": "Ik moet in Tilburg overstappen.",
        "en": "I need to change in Tilburg. The modal keeps overstappen together at the end."
      },
      {
        "nl": "Hoe laat kom ik in Amsterdam aan?",
        "en": "What time do I arrive in Amsterdam? Aankomen separates into kom ... aan in this question."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: De trein heeft tien minuten ___.",
        "answer": "vertraging"
      },
      {
        "prompt": "Complete: Ik moet in Utrecht ___.",
        "answer": "overstappen"
      },
      {
        "prompt": "Complete: De trein ___ om negen uur aan. (komen)",
        "answer": "komt"
      },
      {
        "prompt": "Complete: Is deze trein ___ naar Utrecht? (direct)",
        "answer": "rechtstreeks"
      },
      {
        "prompt": "Complete: Waar moet ik ___? (change trains)",
        "answer": "overstappen"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "restaurant_food",
    "level": "A2",
    "title": "Food, restaurants and ordering",
    "goal": "Order food, ask about ingredients and make polite requests.",
    "explanation": "A restaurant conversation moves from asking for a table to ordering, checking details and paying. Use polite requests and be precise about quantities or ingredients. If food restrictions matter, explain them directly and ask the staff rather than relying on a guess about a dish.",
    "examples": [
      {
        "nl": "Mag ik de menukaart, alstublieft?",
        "en": "May I have the menu, please?"
      },
      {
        "nl": "Ik wil graag zonder kaas bestellen.",
        "en": "I would like to order without cheese."
      },
      {
        "nl": "Heeft u een tafel voor twee personen?",
        "en": "Do you have a table for two? The request gives the number of guests."
      },
      {
        "nl": "Ik wil graag soep zonder room.",
        "en": "I would like soup without cream. Zonder identifies an ingredient you do not want."
      },
      {
        "nl": "Mag ik de rekening, alstublieft?",
        "en": "May I have the bill, please? This is a standard polite payment request."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ ik de rekening krijgen?",
        "answer": "Mag"
      },
      {
        "prompt": "Complete: Ik wil ___ koffie.",
        "answer": "graag"
      },
      {
        "prompt": "Complete: Een tafel ___ twee personen.",
        "answer": "voor"
      },
      {
        "prompt": "Complete: Soep ___ kaas, alstublieft. (without)",
        "answer": "zonder"
      },
      {
        "prompt": "Complete: Kunnen we ___ betalen? (separately)",
        "answer": "apart"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "family_relationships",
    "level": "A2",
    "title": "Family and relationships",
    "goal": "Describe relatives and social arrangements.",
    "explanation": "Family words describe relationships, but a useful introduction also gives a few connected details about people. Choose possessives and singular/plural verbs carefully. Avoid assuming one household structure: describe your own family or an invented one accurately.",
    "examples": [
      {
        "nl": "Mijn broer is getrouwd.",
        "en": "My brother is married."
      },
      {
        "nl": "We bezoeken onze ouders zondag.",
        "en": "We are visiting our parents Sunday."
      },
      {
        "nl": "Mijn zus woont in Rotterdam en werkt daar.",
        "en": "My sister lives and works in Rotterdam. One subject can serve two coordinated verbs."
      },
      {
        "nl": "Onze ouders komen zondag op bezoek.",
        "en": "Our parents are visiting on Sunday. Plural ouders takes onze and komen."
      },
      {
        "nl": "Ik bel mijn broer omdat hij jarig is.",
        "en": "I am calling my brother because it is his birthday. The reason clause ends in is."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Mijn ___ is de dochter van mijn ouders.",
        "answer": "zus"
      },
      {
        "prompt": "Complete: We bezoeken ___ ouders. (our)",
        "answer": "onze"
      },
      {
        "prompt": "Complete: Mijn moeder en vader zijn mijn ___.",
        "answer": "ouders"
      },
      {
        "prompt": "Complete: Mijn broer ___ in Utrecht. (wonen)",
        "answer": "woont"
      },
      {
        "prompt": "Complete: We bezoeken ___ familie. (our)",
        "answer": "onze"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "daily_routines",
    "level": "A2",
    "title": "Daily routines and frequency",
    "goal": "Describe schedules, habits and recurring activities.",
    "explanation": "A routine combines an activity, a time and frequency. Use the present for repeated actions, but distinguish a normal habit from one unusual day. Time phrases can come first if you keep the finite verb second. Some common routine verbs are separable.",
    "examples": [
      {
        "nl": "Ik sport meestal na het werk.",
        "en": "I usually exercise after work."
      },
      {
        "nl": "Op maandag begin ik vroeg.",
        "en": "On Monday I start early."
      },
      {
        "nl": "Elke ochtend sta ik om zeven uur op.",
        "en": "Every morning I get up at seven. Time first causes inversion; op ends the separable verb."
      },
      {
        "nl": "Ik ga meestal na het werk sporten.",
        "en": "I usually exercise after work. Meestal describes the habit, not a fixed appointment."
      },
      {
        "nl": "Op zondag hoef ik niet vroeg op te staan.",
        "en": "On Sunday I do not have to get up early. Niet hoeven expresses absence of necessity."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik sport ___ na het werk. (usually)",
        "answer": "meestal"
      },
      {
        "prompt": "Complete: ___ maandag begin ik vroeg. (on)",
        "answer": "Op"
      },
      {
        "prompt": "Complete: ___ ochtend drink ik thee. (every)",
        "answer": "Elke"
      },
      {
        "prompt": "Complete: Meestal ___ ik om zeven uur op. (staan)",
        "answer": "sta"
      },
      {
        "prompt": "Complete: Ik sport ___. (sometimes)",
        "answer": "soms"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "weather_seasons",
    "level": "A2",
    "title": "Weather and seasons",
    "goal": "Describe weather and make plans based on forecasts.",
    "explanation": "Use weather language to describe conditions and explain plans. Some expressions have a weather verb (het regent); others have zijn plus a description (het is koud). Learn the whole phrase and a time marker, then connect it to a practical decision.",
    "examples": [
      {
        "nl": "Het regent vandaag.",
        "en": "It is raining today."
      },
      {
        "nl": "Morgen wordt het warmer.",
        "en": "Tomorrow it will be warmer."
      },
      {
        "nl": "Het is bewolkt, maar het regent niet.",
        "en": "It is cloudy, but it is not raining. A description and a weather verb use different patterns."
      },
      {
        "nl": "In de herfst waait het vaak.",
        "en": "It is often windy in autumn. The opening seasonal phrase requires inversion."
      },
      {
        "nl": "Als het morgen regent, blijven we binnen.",
        "en": "If it rains tomorrow, we will stay inside. The weather condition affects a plan."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Het ___ vandaag. (rains)",
        "answer": "regent"
      },
      {
        "prompt": "Complete: Het is twintig ___.",
        "answer": "graden"
      },
      {
        "prompt": "Complete: Het ___ hard. (snowing)",
        "answer": "sneeuwt"
      },
      {
        "prompt": "Complete: Het is twintig ___.",
        "answer": "graden"
      },
      {
        "prompt": "Complete: ___ de zomer is het vaak warm.",
        "answer": "In"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "health_pharmacy",
    "level": "A2",
    "title": "Health and pharmacy",
    "goal": "Describe symptoms and understand simple advice.",
    "explanation": "At a pharmacy, you need to describe your question and understand the instructions given for the specific product. Learn words for packaging, timing and clarification. The lesson does not prescribe medicines or doses: practise asking a professional to explain the label.",
    "examples": [
      {
        "nl": "Ik heb sinds gisteren hoofdpijn.",
        "en": "I have had a headache since yesterday."
      },
      {
        "nl": "Hoe vaak moet ik dit innemen?",
        "en": "How often should I take this?"
      },
      {
        "nl": "Ik kom mijn medicijnen ophalen.",
        "en": "I am here to collect my medicines. Ophalen states the purpose of the visit."
      },
      {
        "nl": "Wat betekent deze instructie op de verpakking?",
        "en": "What does this instruction on the packaging mean? The question refers to the exact written instruction."
      },
      {
        "nl": "Bedoelt u voor of na het eten?",
        "en": "Do you mean before or after food? Confirm the contrast rather than guessing."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik heb pijn ___ mijn rug.",
        "answer": "aan"
      },
      {
        "prompt": "Complete: Ik ben ___ gisteren ziek.",
        "answer": "sinds"
      },
      {
        "prompt": "Complete: Ik wil mijn medicijnen ___. (collect)",
        "answer": "ophalen"
      },
      {
        "prompt": "Complete: Wat staat er op de ___? (packaging)",
        "answer": "verpakking"
      },
      {
        "prompt": "Complete: ___ vaak moet ik dit gebruiken?",
        "answer": "Hoe"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "public_services",
    "level": "A2",
    "title": "Municipality and public services",
    "goal": "Arrange appointments and ask about documents.",
    "explanation": "For an everyday official interaction, explain the purpose, ask which documents are needed and confirm the next step. Learn the vocabulary of appointments, applications and forms. Procedures differ by service, so these examples practise questions rather than promise a particular legal requirement.",
    "examples": [
      {
        "nl": "Ik wil een afspraak maken bij de gemeente.",
        "en": "I want to make an appointment at the municipality."
      },
      {
        "nl": "Moet ik mijn paspoort meenemen?",
        "en": "Do I need to bring my passport?"
      },
      {
        "nl": "Ik wil mijn nieuwe adres doorgeven.",
        "en": "I want to report my new address. Doorgeven stays infinitive after wil."
      },
      {
        "nl": "Welke documenten moet ik meenemen?",
        "en": "Which documents should I bring? Welke introduces the requested list."
      },
      {
        "nl": "Kunt u controleren of het formulier compleet is?",
        "en": "Can you check whether the form is complete? Of introduces an indirect yes/no question."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik wil een ___ maken. (appointment)",
        "answer": "afspraak"
      },
      {
        "prompt": "Complete: Moet ik mijn paspoort ___? (bring along)",
        "answer": "meenemen"
      },
      {
        "prompt": "Complete: Welke documenten moet ik ___? (bring along)",
        "answer": "meenemen"
      },
      {
        "prompt": "Complete: Wat moet ik hier ___? (fill in)",
        "answer": "invullen"
      },
      {
        "prompt": "Complete: Ik heb een vraag over mijn ___. (application)",
        "answer": "aanvraag"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "money_banking",
    "level": "A2",
    "title": "Banking and payments",
    "goal": "Ask about payments, transfers and bank cards.",
    "explanation": "Payment language distinguishes a transaction, its method and its status. Betalen means pay; pinnen means pay by card in a shop context; overmaken means transfer money. A rekening can mean an account or a bill, so read the surrounding words. These examples are language practice, not financial advice.",
    "examples": [
      {
        "nl": "Kan ik hier pinnen?",
        "en": "Can I pay by card here?"
      },
      {
        "nl": "Ik heb het geld overgemaakt.",
        "en": "I transferred the money."
      },
      {
        "nl": "Kan ik met mijn pinpas betalen?",
        "en": "Can I pay with my debit card? Met introduces the payment method."
      },
      {
        "nl": "Ik heb het bedrag gisteren overgemaakt.",
        "en": "I transferred the amount yesterday. Overmaken forms overgemaakt in the perfect."
      },
      {
        "nl": "Er staat een onbekend bedrag op mijn rekening.",
        "en": "There is an unfamiliar amount on my account. The message describes an observation, not a confirmed cause."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Kan ik hier ___? (pay by card)",
        "answer": "pinnen"
      },
      {
        "prompt": "Complete: Ik heb het geld ___. (transferred)",
        "answer": "overgemaakt"
      },
      {
        "prompt": "Complete: Ik wil ___ betalen. (cash)",
        "answer": "contant"
      },
      {
        "prompt": "Complete: Ik heb het bedrag ___. (transfer: participle)",
        "answer": "overgemaakt"
      },
      {
        "prompt": "Complete: Kan ik ___ mijn pinpas betalen?",
        "answer": "met"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "job_search",
    "level": "A2",
    "title": "Jobs and applications",
    "goal": "Discuss work experience, hours and applying for jobs.",
    "explanation": "A short application connects your experience to the role and gives clear availability. Solliciteren naar means apply for a position; ervaring met names experience with a tool or task. A factual example supports your skill more effectively than a list of adjectives.",
    "examples": [
      {
        "nl": "Ik heb ervaring met computers.",
        "en": "I have experience with computers."
      },
      {
        "nl": "Ik solliciteer naar deze functie.",
        "en": "I am applying for this position."
      },
      {
        "nl": "Ik solliciteer naar de functie van medewerker.",
        "en": "I am applying for the staff position. Naar belongs with solliciteren."
      },
      {
        "nl": "Ik heb ervaring met het plannen van werkzaamheden.",
        "en": "I have experience planning work. Met introduces the experience area."
      },
      {
        "nl": "Vanaf maandag ben ik beschikbaar voor een gesprek.",
        "en": "From Monday I am available for an interview. A starting phrase first requires inversion."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik heb ervaring ___ computers.",
        "answer": "met"
      },
      {
        "prompt": "Complete: Ik solliciteer ___ deze functie.",
        "answer": "naar"
      },
      {
        "prompt": "Complete: Ik ben beschikbaar ___ november. (starting from)",
        "answer": "vanaf"
      },
      {
        "prompt": "Complete: Ik ben verantwoordelijk ___ de planning.",
        "answer": "voor"
      },
      {
        "prompt": "Complete: Ik solliciteer ___ deze functie.",
        "answer": "naar"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "education_courses",
    "level": "A2",
    "title": "Courses and learning",
    "goal": "Ask about classes, homework and study plans.",
    "explanation": "Course communication includes choosing a course, registering, asking about its schedule and explaining learning difficulties. Separate the course start date from the registration deadline. Learn action phrases so you can ask for help and continue learning independently.",
    "examples": [
      {
        "nl": "Ik schrijf me in voor de cursus.",
        "en": "I register for the course."
      },
      {
        "nl": "Ik oefen elke dag Nederlands.",
        "en": "I practise Dutch every day."
      },
      {
        "nl": "Ik wil me inschrijven voor de avondcursus.",
        "en": "I want to register for the evening course. The reflexive pronoun remains with inschrijven."
      },
      {
        "nl": "Hoe vaak hebben we les?",
        "en": "How often do we have lessons? Hoe vaak asks frequency."
      },
      {
        "nl": "Kunt u nog een voorbeeld geven?",
        "en": "Can you give another example? A concrete request helps the teacher respond."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik schrijf me in ___ de cursus.",
        "answer": "voor"
      },
      {
        "prompt": "Complete: Ik ___ elke dag Nederlands. (practise)",
        "answer": "oefen"
      },
      {
        "prompt": "Complete: Ik wil ___ inschrijven voor de cursus.",
        "answer": "me"
      },
      {
        "prompt": "Complete: Ik ___ mijn huiswerk. (maken)",
        "answer": "maak"
      },
      {
        "prompt": "Complete: Hoe ___ duurt de les? (duration)",
        "answer": "lang"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "inviting_social",
    "level": "A2",
    "title": "Invitations and social plans",
    "goal": "Invite, accept, decline and reschedule politely.",
    "explanation": "A useful invitation includes the activity, day/time and location. An acceptance confirms the plan; a refusal can be polite and offer another time. Distinguish a suggestion from an agreed arrangement, and do not assume that a vague reply confirms every detail.",
    "examples": [
      {
        "nl": "Heb je zin om zaterdag te wandelen?",
        "en": "Do you feel like walking on Saturday?"
      },
      {
        "nl": "Helaas kan ik morgen niet.",
        "en": "Unfortunately I cannot tomorrow."
      },
      {
        "nl": "Heb je zin om zaterdag te wandelen?",
        "en": "Would you like to walk on Saturday? Om ... te introduces the activity."
      },
      {
        "nl": "Leuk! Zullen we om twee uur bij het station afspreken?",
        "en": "Great! Shall we meet at the station at two? The proposal includes time and place."
      },
      {
        "nl": "Helaas kan ik zaterdag niet. Kan het ook zondag?",
        "en": "Unfortunately I cannot on Saturday. Would Sunday work? The refusal offers an alternative."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Heb je ___ om mee te gaan?",
        "answer": "zin"
      },
      {
        "prompt": "Complete: ___ we zondag afspreken? (shall)",
        "answer": "Zullen"
      },
      {
        "prompt": "Complete: Heb je zin ___ mee te gaan?",
        "answer": "om"
      },
      {
        "prompt": "Complete: Zullen we koffie ___? (drinken)",
        "answer": "drinken"
      },
      {
        "prompt": "Complete: Helaas ___ ik morgen niet. (kunnen)",
        "answer": "kan"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "emergencies_safety",
    "level": "A2",
    "title": "Emergencies and safety",
    "goal": "Explain urgent situations and follow basic safety instructions.",
    "explanation": "In an urgent situation, short clear language communicates the location and observable problem. Learn to understand warnings and instructions without treating this language lesson as emergency-response training. For a real emergency, follow the instructions of the relevant local service.",
    "examples": [
      {
        "nl": "Er is brand in het gebouw.",
        "en": "There is a fire in the building."
      },
      {
        "nl": "Bel onmiddellijk de hulpdiensten.",
        "en": "Call emergency services immediately."
      },
      {
        "nl": "Er komt rook uit de keuken.",
        "en": "Smoke is coming from the kitchen. This reports an observable sign without inventing a cause."
      },
      {
        "nl": "Het adres is Parkstraat twaalf, op de tweede verdieping.",
        "en": "The address is 12 Parkstraat, on the second floor. A clear location helps the listener identify the place."
      },
      {
        "nl": "Kunt u de instructie herhalen?",
        "en": "Can you repeat the instruction? Ask again instead of guessing what was said."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Er ___ brand.",
        "answer": "is"
      },
      {
        "prompt": "Complete: ___ op!",
        "answer": "Pas"
      },
      {
        "prompt": "Complete: ___ op! (watch out)",
        "answer": "Pas"
      },
      {
        "prompt": "Complete: Er ___ rook in de gang. (zijn)",
        "answer": "is"
      },
      {
        "prompt": "Complete: ___ toegang. (no)",
        "answer": "Geen"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "complaints_service",
    "level": "A2",
    "title": "Complaints and customer service",
    "goal": "Explain a problem, request help and describe an outcome.",
    "explanation": "An effective complaint separates facts from the solution you want. State the product or service, explain what went wrong and ask a concrete question. Keep the tone firm and polite. This lesson does not assume the same refund or repair rights in every situation.",
    "examples": [
      {
        "nl": "Dit apparaat werkt niet.",
        "en": "This device does not work."
      },
      {
        "nl": "Kunt u mij een oplossing aanbieden?",
        "en": "Can you offer me a solution?"
      },
      {
        "nl": "Ik heb een blauwe jas besteld, maar een rode gekregen.",
        "en": "I ordered a blue coat but received a red one. The sentence contrasts the order and actual delivery."
      },
      {
        "nl": "Het apparaat gaat niet aan. Kunt u het controleren?",
        "en": "The device will not turn on. Can you check it? State the failure, then ask for a next step."
      },
      {
        "nl": "Wanneer kan ik een reactie verwachten?",
        "en": "When can I expect a response? The question asks about follow-up timing."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Dit apparaat ___ niet. (work)",
        "answer": "werkt"
      },
      {
        "prompt": "Complete: Kunt u mij ___? (help)",
        "answer": "helpen"
      },
      {
        "prompt": "Complete: Er ___ een onderdeel. (is missing)",
        "answer": "ontbreekt"
      },
      {
        "prompt": "Complete: Ik wil deze jas ___. (exchange)",
        "answer": "ruilen"
      },
      {
        "prompt": "Complete: Kunt u het apparaat ___? (check)",
        "answer": "controleren"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "sequence_storytelling",
    "level": "A2",
    "title": "Telling events in order",
    "goal": "Explain what happened using simple time connectors.",
    "explanation": "Sequence words help a listener follow events. Eerst gives the first step, daarna the next, vervolgens a further step and uiteindelijk the final result. Toen can locate an event in a past story. Keep verb-second order even when a sequence word comes first.",
    "examples": [
      {
        "nl": "Eerst ging ik naar de winkel.",
        "en": "First I went to the shop."
      },
      {
        "nl": "Daarna heb ik thuis gekookt.",
        "en": "After that I cooked at home."
      },
      {
        "nl": "Eerst heb ik gewerkt. Daarna ben ik gaan sporten.",
        "en": "First I worked. Afterwards I went to exercise. Each sequence word fills the first position."
      },
      {
        "nl": "Toen ik thuiskwam, stond het eten klaar.",
        "en": "When I came home, the food was ready. The first toen clause has final thuiskwam."
      },
      {
        "nl": "Uiteindelijk hebben we een oplossing gevonden.",
        "en": "Eventually we found a solution. Uiteindelijk introduces the outcome."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ ging ik naar de winkel. (first)",
        "answer": "Eerst"
      },
      {
        "prompt": "Complete: ___ heb ik thuis gekookt. (afterwards)",
        "answer": "Daarna"
      },
      {
        "prompt": "Complete: ___ heb ik gewerkt, daarna heb ik gekookt. (first)",
        "answer": "Eerst"
      },
      {
        "prompt": "Complete: Daarna ___ ik naar huis. (gaan, past)",
        "answer": "ging"
      },
      {
        "prompt": "Complete: ___ hebben we een oplossing gevonden. (eventually)",
        "answer": "Uiteindelijk"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "obligation_permission",
    "level": "A2",
    "title": "Obligation and permission",
    "goal": "Explain what is allowed, required and possible.",
    "explanation": "Modal verbs distinguish what is necessary, allowed and possible. Moeten expresses obligation, mogen permission, and kunnen ability or possibility. Negative forms change the meaning substantially: you must not do something is different from you do not have to do it.",
    "examples": [
      {
        "nl": "Je moet een kaartje kopen.",
        "en": "You must buy a ticket."
      },
      {
        "nl": "Mag ik hier parkeren?",
        "en": "May I park here?"
      },
      {
        "nl": "Je mag hier niet parkeren.",
        "en": "You are not allowed to park here. Mogen plus niet expresses prohibition."
      },
      {
        "nl": "Je hoeft morgen niet te werken.",
        "en": "You do not have to work tomorrow. Niet hoeven ... te removes necessity."
      },
      {
        "nl": "Ik kan vrijdag wel komen.",
        "en": "I can come on Friday. Wel contrasts a possible time with an impossible one."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Je ___ een kaartje kopen. (must)",
        "answer": "moet"
      },
      {
        "prompt": "Complete: ___ ik hier parkeren? (may: asking permission)",
        "answer": "Mag"
      },
      {
        "prompt": "Complete: Je ___ hier niet roken. (not allowed)",
        "answer": "mag"
      },
      {
        "prompt": "Complete: Je hoeft niet ___ wachten.",
        "answer": "te"
      },
      {
        "prompt": "Complete: Wij moeten morgen ___. (werken)",
        "answer": "werken"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "conditional_als",
    "level": "A2",
    "title": "Conditions with als",
    "goal": "Make simple conditional plans and explain consequences.",
    "explanation": "Als introduces a condition (if) or a repeated situation (when). It forms a subordinate clause, so a simple finite verb goes near the end. Learn both clause orders. A future condition can normally use the present in Dutch; you do not need a future helper in every clause.",
    "examples": [
      {
        "nl": "Als ik tijd heb, bel ik je.",
        "en": "If I have time, I will call you."
      },
      {
        "nl": "Als het koud is, draag ik een jas.",
        "en": "If it is cold, I wear a coat."
      },
      {
        "nl": "Als ik tijd heb, help ik je.",
        "en": "If I have time, I will help you. The verbs are heb at the end and help before ik."
      },
      {
        "nl": "Ik neem de bus als het regent.",
        "en": "I take the bus if it rains. The condition follows the main clause."
      },
      {
        "nl": "Als ik moet werken, kan ik niet komen.",
        "en": "If I have to work, I cannot come. The first clause ends with moet werken."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Als ik tijd ___, bel ik je.",
        "answer": "heb"
      },
      {
        "prompt": "Complete: Als het koud ___, draag ik een jas.",
        "answer": "is"
      },
      {
        "prompt": "Complete: Als jij tijd ___, kom dan langs. (hebben)",
        "answer": "hebt"
      },
      {
        "prompt": "Complete: Als het regent, ___ ik thuis. (blijven)",
        "answer": "blijf"
      },
      {
        "prompt": "Put in order: tijd / als / Ik / ik / kom / heb",
        "answer": "Ik kom als ik tijd heb."
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "prepositions_time",
    "level": "A2",
    "title": "Time prepositions",
    "goal": "Use om, op, in, sinds, voor and na with times and dates.",
    "explanation": "Time prepositions describe a point, period, starting moment or deadline. Choose the relationship first: at nine, on Friday and in November are different types. Keep deadlines separate from appointments so the reader knows whether an action is due before a time or happens exactly then.",
    "examples": [
      {
        "nl": "De les begint om negen uur.",
        "en": "The lesson starts at nine."
      },
      {
        "nl": "We spreken op vrijdag af.",
        "en": "We meet on Friday."
      },
      {
        "nl": "De cursus begint in november op een maandag.",
        "en": "The course begins in November on a Monday. Month and day use different prepositions."
      },
      {
        "nl": "Ik werk van negen tot vijf.",
        "en": "I work from nine to five. Van ... tot sets the interval."
      },
      {
        "nl": "Stuur het formulier voor vrijdag terug.",
        "en": "Return the form before Friday. The phrase gives a deadline before that day, not a Friday appointment."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: De les begint ___ negen uur.",
        "answer": "om"
      },
      {
        "prompt": "Complete: We spreken ___ vrijdag af.",
        "answer": "op"
      },
      {
        "prompt": "Complete: De cursus begint ___ november.",
        "answer": "in"
      },
      {
        "prompt": "Complete: We werken van negen ___ vijf.",
        "answer": "tot"
      },
      {
        "prompt": "Complete: ___ de les drink ik koffie. (after)",
        "answer": "Na"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "phone_messages",
    "level": "A2",
    "title": "Phone calls and messages",
    "goal": "Leave a message and request a callback.",
    "explanation": "On the phone, identify yourself, ask for the right person and state the purpose briefly. If the person is unavailable, leave a message with a callback request and repeat important details. Telephone communication often needs explicit confirmation because gestures and written context are missing.",
    "examples": [
      {
        "nl": "Kan ik mevrouw Jansen spreken?",
        "en": "May I speak to Ms Jansen?"
      },
      {
        "nl": "Wilt u mij terugbellen?",
        "en": "Would you call me back?"
      },
      {
        "nl": "Goedemiddag, u spreekt met Sam. Kan ik mevrouw Jansen spreken?",
        "en": "Good afternoon, this is Sam. May I speak to Ms Jansen? The opening identifies both caller and intended recipient."
      },
      {
        "nl": "Wilt u doorgeven dat ik morgen terugbel?",
        "en": "Could you pass on that I will call back tomorrow? Doorgeven introduces a message to another person."
      },
      {
        "nl": "Dus vrijdag om half tien. Bedankt voor uw hulp.",
        "en": "So Friday at 9:30. Thank you for your help. Repeating the detail helps catch misunderstandings."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Wilt u mij ___? (call back)",
        "answer": "terugbellen"
      },
      {
        "prompt": "Complete: Kan ik u morgen ___? (call by phone)",
        "answer": "bellen"
      },
      {
        "prompt": "Complete: U spreekt ___ Sam.",
        "answer": "met"
      },
      {
        "prompt": "Complete: Mag ik een bericht ___? (leave)",
        "answer": "achterlaten"
      },
      {
        "prompt": "Complete: Kunt u uw naam ___? (spell)",
        "answer": "spellen"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "colours_and_descriptions",
    "level": "A2",
    "title": "Colours and describing things",
    "goal": "Describe colours, sizes and patterns when shopping or talking about everyday objects.",
    "explanation": "Describe an item by colour, size and another useful quality. Colour words are adjectives, so their form depends on position and the noun phrase. Learn de/het together with nouns rather than treating every colour as a fixed unchanging label.",
    "examples": [
      {
        "nl": "De rode jas is duur.",
        "en": "The red coat is expensive."
      },
      {
        "nl": "Ik zoek een blauw shirt.",
        "en": "I am looking for a blue shirt."
      },
      {
        "nl": "Ik zoek een lichtblauw shirt.",
        "en": "I am looking for a light-blue shirt. Shirt is singular het after een, so no added -e."
      },
      {
        "nl": "De witte schoenen staan bij de deur.",
        "en": "The white shoes are by the door. Plural nouns use the inflected before-noun form."
      },
      {
        "nl": "Mijn jas is groen en waterdicht.",
        "en": "My coat is green and waterproof. After is the adjectives stay in their base form."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik draag een ___ shirt. (blue)",
        "answer": "blauw"
      },
      {
        "prompt": "Complete: De ___ broek is nieuw. (black)",
        "answer": "zwarte"
      },
      {
        "prompt": "Complete: het ___ shirt (blauw/blauwe)",
        "answer": "blauwe"
      },
      {
        "prompt": "Complete: De schoenen zijn ___. (wit/witte)",
        "answer": "wit"
      },
      {
        "prompt": "Complete: een ___ jas (rood/rode)",
        "answer": "rode"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "clothing_and_getting_dressed",
    "level": "A2",
    "title": "Clothes and getting dressed",
    "goal": "Name common clothes and describe what you wear, buy or put on.",
    "explanation": "Distinguish getting dressed, putting on a particular item and wearing it. Zich aankleden describes dressing yourself; aantrekken names an item you put on; dragen describes wearing it. These verbs connect clothing vocabulary to reflexive and separable-verb patterns.",
    "examples": [
      {
        "nl": "Ik trek mijn schoenen aan.",
        "en": "I put on my shoes."
      },
      {
        "nl": "Zij draagt een warme trui.",
        "en": "She is wearing a warm sweater."
      },
      {
        "nl": "Ik kleed me na het douchen aan.",
        "en": "I get dressed after showering. Me refers to ik; aan closes the separable verb."
      },
      {
        "nl": "Zij trekt haar schoenen uit.",
        "en": "She takes her shoes off. The object is schoenen; uit belongs to uittrekken."
      },
      {
        "nl": "Wij dragen vandaag warme truien.",
        "en": "We are wearing warm sweaters today. Dragen describes what is being worn, not the act of putting it on."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik trek mijn jas ___.",
        "answer": "aan"
      },
      {
        "prompt": "Complete: Zij draagt een warme ___. (sweater)",
        "answer": "trui"
      },
      {
        "prompt": "Complete: Wij kleden ___ aan.",
        "answer": "ons"
      },
      {
        "prompt": "Complete: Ik trek mijn schoenen ___. (take off)",
        "answer": "uit"
      },
      {
        "prompt": "Complete: Ik heb me ___. (aankleden)",
        "answer": "aangekleed"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "locations_and_position",
    "level": "A2",
    "title": "Locations and position",
    "goal": "Say where objects and people are using spatial words and prepositions.",
    "explanation": "Dutch often uses staan, liggen, zitten and hangen where English uses a general is. Choose from the object and situation, then add a clear place phrase. These are useful tendencies, not a rigid rule that every long object always takes liggen.",
    "examples": [
      {
        "nl": "De sleutels liggen op de tafel.",
        "en": "The keys are on the table."
      },
      {
        "nl": "De fiets staat naast het huis.",
        "en": "The bicycle is next to the house."
      },
      {
        "nl": "Het boek ligt naast de laptop.",
        "en": "The book is lying next to the laptop. A resting book is described with ligt."
      },
      {
        "nl": "De jas hangt achter de deur.",
        "en": "The coat hangs behind the door. Hangen names a suspended position."
      },
      {
        "nl": "Er zit een sleutel in mijn tas.",
        "en": "There is a key in my bag. Zitten can describe a contained location."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: De kat zit ___ de tafel. (under)",
        "answer": "onder"
      },
      {
        "prompt": "Complete: De winkel is ___ het station. (opposite)",
        "answer": "tegenover"
      },
      {
        "prompt": "Complete: De sleutels ___ op tafel. (liggen)",
        "answer": "liggen"
      },
      {
        "prompt": "Complete: De kast ___ naast het bed. (staan)",
        "answer": "staat"
      },
      {
        "prompt": "Complete: De jas ___ aan de kapstok. (hangen)",
        "answer": "hangt"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "food_meals_cooking",
    "level": "A2",
    "title": "Food, meals and cooking",
    "goal": "Describe daily meals, groceries, ingredients, quantities and simple cooking steps.",
    "explanation": "Food language combines meals, quantities, preparation and sequence. Learn verbs as actions you can explain in a simple recipe. Separate what you eat from when you eat it, and ask about preferences or ingredients instead of assuming everyone eats the same foods.",
    "examples": [
      {
        "nl": "Ik eet meestal brood met kaas als ontbijt.",
        "en": "I usually eat bread with cheese for breakfast."
      },
      {
        "nl": "Eerst snijd ik de groenten, daarna maak ik de soep.",
        "en": "First I chop the vegetables, then I make the soup."
      },
      {
        "nl": "Eerst was ik de groenten en daarna snijd ik ze.",
        "en": "First I wash the vegetables and then I cut them. Ze replaces the plural object groenten."
      },
      {
        "nl": "Voeg een beetje water toe.",
        "en": "Add a little water. Toe is the separable part of toevoegen."
      },
      {
        "nl": "Ik heb genoeg rijst voor twee personen.",
        "en": "I have enough rice for two people. Genoeg describes quantity; voor names the number served."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik eet brood als ___. (breakfast)",
        "answer": "ontbijt"
      },
      {
        "prompt": "Complete: Eerst snijd ik de groenten, ___ kook ik de soep. (afterwards)",
        "answer": "daarna"
      },
      {
        "prompt": "Complete: Ik ___ om acht uur. (have breakfast)",
        "answer": "ontbijt"
      },
      {
        "prompt": "Complete: Daarna ___ ik de rijst. (koken)",
        "answer": "kook"
      },
      {
        "prompt": "Complete: Ik voeg water ___.",
        "answer": "toe"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "furniture_home_rooms",
    "level": "A2",
    "title": "Furniture, rooms and the home",
    "goal": "Describe rooms, furniture, where objects are placed and everyday household needs.",
    "explanation": "Describe a home by introducing a room, saying what is in it and locating the furniture. Dutch often introduces a new object with er staat or er staan. A known object can then become the subject: De bank staat naast het raam. Learn noun articles for later adjective and pronoun choices.",
    "examples": [
      {
        "nl": "In mijn slaapkamer staat een bed naast de kast.",
        "en": "There is a bed next to the wardrobe in my bedroom."
      },
      {
        "nl": "We zetten de tafel bij het raam.",
        "en": "We put the table by the window."
      },
      {
        "nl": "In de slaapkamer staat een bed.",
        "en": "There is a bed in the bedroom. The location comes first; staat agrees with singular bed."
      },
      {
        "nl": "Er staan twee stoelen bij het raam.",
        "en": "There are two chairs by the window. Plural stoelen requires staan."
      },
      {
        "nl": "Het bureau staat tussen de kast en het bed.",
        "en": "The desk is between the wardrobe and the bed. Tussen relates the desk to two reference objects."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: In de woonkamer ___ een bank. (stands)",
        "answer": "staat"
      },
      {
        "prompt": "Complete: De kleding ligt in de ___. (wardrobe)",
        "answer": "kast"
      },
      {
        "prompt": "Complete: Er ___ twee kasten in de kamer. (staan)",
        "answer": "staan"
      },
      {
        "prompt": "Complete: ___ bureau staat bij het raam. (de/het)",
        "answer": "Het"
      },
      {
        "prompt": "Complete: In de keuken ___ een tafel. (staan)",
        "answer": "staat"
      }
    ],
    "legacyCheckCount": 2,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "separable_verbs_a2",
    "level": "A2",
    "title": "Separable verbs (scheidbare werkwoorden)",
    "goal": "Use common separable verbs in main clauses, subordinate clauses, with modal verbs and in the perfect tense.",
    "explanation": "A separable verb combines a stressed prefix and a verb into a meaning you learn together: opstaan, aankomen, meenemen. Its parts separate when it is the finite verb in a main clause, but remain together as an infinitive after a modal or as a final verb in a simple subordinate clause. The prefix is not a free preposition.",
    "examples": [
      {
        "nl": "Mag ik binnenkomen?",
        "en": "May I come in?"
      },
      {
        "nl": "De trein komt om acht uur aan.",
        "en": "The train arrives at eight."
      },
      {
        "nl": "Ik neem mijn jas mee.",
        "en": "I take my coat along."
      },
      {
        "nl": "Ik denk dat zij vroeg opstaat.",
        "en": "I think she gets up early."
      },
      {
        "nl": "Neem je je paspoort mee?",
        "en": "Are you taking your passport along? Mee belongs to meenemen; the two je forms have different jobs."
      },
      {
        "nl": "Ik weet dat de trein om negen uur aankomt.",
        "en": "I know the train arrives at nine. The finite separable verb stays together at the end of the dat clause."
      },
      {
        "nl": "Zij heeft haar moeder opgebeld.",
        "en": "She phoned her mother. Ge sits inside opbellen."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: De trein komt om negen uur ___. (arrives)",
        "answer": "aan"
      },
      {
        "prompt": "Complete: Mag ik ___? (enter the room)",
        "answer": "binnenkomen"
      },
      {
        "prompt": "Complete: Ik sta elke ochtend om zeven uur ___. (get up)",
        "answer": "op"
      },
      {
        "prompt": "Complete: Ik moet vroeg ___. (get up)",
        "answer": "opstaan"
      },
      {
        "prompt": "Complete: Zij heeft mij ___. (opbellen)",
        "answer": "opgebeld"
      },
      {
        "prompt": "Complete: Ik weet dat hij morgen ___. (aankomen)",
        "answer": "aankomt"
      }
    ],
    "legacyCheckCount": 3,
    "teachingRevision": "2026-10-29-depth"
  },
  {
    "id": "fixed_preposition_verbs_a2",
    "level": "A2",
    "title": "Verbs with fixed prepositions",
    "goal": "Choose the correct preposition after common verbs and ask simple questions using er + preposition.",
    "explanation": "Learn a fixed preposition together with its verb: wachten op, denken aan, luisteren naar. English and Dutch do not always choose matching prepositions. Unlike a separable prefix, the preposition belongs to an object phrase; it does not simply move to the end of every main clause.",
    "examples": [
      {
        "nl": "Ik wacht op de bus.",
        "en": "I am waiting for the bus."
      },
      {
        "nl": "Wij praten over ons werk.",
        "en": "We talk about our work."
      },
      {
        "nl": "Zij luistert naar muziek.",
        "en": "She listens to music."
      },
      {
        "nl": "Ik begin met koken.",
        "en": "I start cooking."
      },
      {
        "nl": "We praten over de planning.",
        "en": "We are talking about the schedule. Over belongs with praten about a topic."
      },
      {
        "nl": "Ik denk aan mijn familie.",
        "en": "I am thinking about my family. Aan is part of this denken combination."
      },
      {
        "nl": "Wacht je op de uitslag? Ja, ik wacht erop.",
        "en": "Are you waiting for the result? Yes, I am waiting for it. Erop refers to the previously mentioned thing."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik wacht ___ de trein.",
        "answer": "op"
      },
      {
        "prompt": "Complete: We praten ___ onze vakantie.",
        "answer": "over"
      },
      {
        "prompt": "Complete: Hij luistert ___ de radio.",
        "answer": "naar"
      },
      {
        "prompt": "Complete: We beginnen ___ de opdracht.",
        "answer": "met"
      },
      {
        "prompt": "Complete: Zij zorgt ___ haar kind.",
        "answer": "voor"
      },
      {
        "prompt": "Complete: Ik denk ___ mijn familie.",
        "answer": "aan"
      }
    ],
    "legacyCheckCount": 3,
    "teachingRevision": "2026-10-29-depth"
  }
];
