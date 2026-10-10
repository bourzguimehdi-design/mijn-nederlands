/* Curated learning objectives and introductory lessons. */
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
    "explanation": "Use hebben or zijn with a past participle. Movement/change-of-state verbs often use zijn. The participle normally goes at the end.",
    "examples": [
      {
        "nl": "Ik heb gisteren gewerkt.",
        "en": "I worked yesterday."
      },
      {
        "nl": "Zij is naar huis gegaan.",
        "en": "She went home."
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
      }
    ]
  },
  {
    "id": "past_participle",
    "level": "A2",
    "title": "Past participles",
    "goal": "Form regular and common irregular participles.",
    "explanation": "Many regular participles use ge- plus stem plus -d or -t. Irregular forms must be learned individually.",
    "examples": [
      {
        "nl": "werken → gewerkt",
        "en": "worked"
      },
      {
        "nl": "schrijven → geschreven",
        "en": "written"
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
      }
    ]
  },
  {
    "id": "imperfect_tense",
    "level": "A2",
    "title": "Simple past",
    "goal": "Tell stories using the simple past.",
    "explanation": "The imperfect is common in narratives and with zijn, hebben and modal verbs. Learn frequent irregular forms.",
    "examples": [
      {
        "nl": "Ik was gisteren ziek.",
        "en": "I was ill yesterday."
      },
      {
        "nl": "We gingen naar de markt.",
        "en": "We went to the market."
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
      }
    ]
  },
  {
    "id": "subordinate_clauses",
    "level": "A2",
    "title": "Because and that",
    "goal": "Connect ideas with omdat and dat.",
    "explanation": "In a subordinate clause, the conjugated verb usually moves to the end.",
    "examples": [
      {
        "nl": "Ik blijf thuis omdat ik ziek ben.",
        "en": "I stay home because I am ill."
      },
      {
        "nl": "Ik denk dat hij morgen komt.",
        "en": "I think he comes tomorrow."
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
      }
    ]
  },
  {
    "id": "inversion",
    "level": "A2",
    "title": "Inversion",
    "goal": "Start sentences with time or place without losing verb-second order.",
    "explanation": "When another phrase comes first, place the conjugated verb before the subject.",
    "examples": [
      {
        "nl": "Na het werk ga ik sporten.",
        "en": "After work I go exercise."
      },
      {
        "nl": "Morgen heeft zij tijd.",
        "en": "Tomorrow she has time."
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
      }
    ]
  },
  {
    "id": "adjective_endings",
    "level": "A2",
    "title": "Adjective endings",
    "goal": "Describe objects with the correct adjective form.",
    "explanation": "Most adjectives before nouns take -e. One common exception is an indefinite singular het-word: een mooi huis.",
    "examples": [
      {
        "nl": "een mooie auto",
        "en": "a beautiful car"
      },
      {
        "nl": "een mooi huis",
        "en": "a beautiful house"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: een mooi___ auto",
        "answer": "e"
      },
      {
        "prompt": "Complete: een mooi___ huis",
        "answer": ""
      }
    ]
  },
  {
    "id": "comparatives",
    "level": "A2",
    "title": "Comparisons",
    "goal": "Compare people, places and things.",
    "explanation": "Use -er for comparisons and -st(e) for superlatives; some forms are irregular.",
    "examples": [
      {
        "nl": "Deze trein is sneller.",
        "en": "This train is faster."
      },
      {
        "nl": "Dit is de beste optie.",
        "en": "This is the best option."
      }
    ],
    "checks": [
      {
        "prompt": "Comparative of snel",
        "answer": "sneller"
      },
      {
        "prompt": "Superlative of goed",
        "answer": "beste"
      }
    ]
  },
  {
    "id": "prepositions",
    "level": "A2",
    "title": "Place and direction",
    "goal": "Describe location and movement.",
    "explanation": "Use in, op, naast, tussen, tegenover and naar. Distinguish location from direction.",
    "examples": [
      {
        "nl": "De fiets staat naast het huis.",
        "en": "The bicycle is next to the house."
      },
      {
        "nl": "Ik ga naar de winkel.",
        "en": "I go to the shop."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ga ___ Amsterdam.",
        "answer": "naar"
      },
      {
        "prompt": "Complete: De tas ligt ___ de tafel.",
        "answer": "op"
      }
    ]
  },
  {
    "id": "time_expressions",
    "level": "A2",
    "title": "Time expressions",
    "goal": "Explain when and how often things happen.",
    "explanation": "Use sinds for a starting point, al for duration, over for future time, and geleden for time ago.",
    "examples": [
      {
        "nl": "Ik woon hier sinds 2022.",
        "en": "I have lived here since 2022."
      },
      {
        "nl": "Ik kom over twee dagen.",
        "en": "I will come in two days."
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
      }
    ]
  },
  {
    "id": "future_plans",
    "level": "A2",
    "title": "Future plans",
    "goal": "Discuss intentions and arrangements.",
    "explanation": "Use gaan + infinitive for intentions, zullen for proposals or predictions, and the present tense for scheduled future events.",
    "examples": [
      {
        "nl": "Ik ga morgen studeren.",
        "en": "I am going to study tomorrow."
      },
      {
        "nl": "Zullen we afspreken?",
        "en": "Shall we meet?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ___ morgen koken. (going to)",
        "answer": "ga"
      },
      {
        "prompt": "Complete: ___ we morgen bellen?",
        "answer": "Zullen"
      }
    ]
  },
  {
    "id": "reflexive_verbs",
    "level": "A2",
    "title": "Reflexive verbs",
    "goal": "Talk about routines and feelings.",
    "explanation": "Some Dutch verbs use a reflexive pronoun: me, je, zich, ons.",
    "examples": [
      {
        "nl": "Ik voel me goed.",
        "en": "I feel good."
      },
      {
        "nl": "Zij vergist zich.",
        "en": "She is mistaken."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik voel ___ goed.",
        "answer": "me"
      },
      {
        "prompt": "Complete: Hij vergist ___.",
        "answer": "zich"
      }
    ]
  },
  {
    "id": "relative_clauses",
    "level": "A2",
    "title": "Relative clauses",
    "goal": "Describe people and objects in more detail.",
    "explanation": "Use die for de-words and plurals, dat for singular het-words. The verb usually goes to the end of the relative clause.",
    "examples": [
      {
        "nl": "De man die hier werkt.",
        "en": "The man who works here."
      },
      {
        "nl": "Het boek dat ik lees.",
        "en": "The book that I read."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: het huis ___ ik koop",
        "answer": "dat"
      },
      {
        "prompt": "Complete: de vrouw ___ hier woont",
        "answer": "die"
      }
    ]
  },
  {
    "id": "imperatives",
    "level": "A2",
    "title": "Instructions and requests",
    "goal": "Give polite and clear instructions.",
    "explanation": "The informal imperative often uses the verb stem. Use alstublieft or zou u ... kunnen for politeness.",
    "examples": [
      {
        "nl": "Kom binnen!",
        "en": "Come in!"
      },
      {
        "nl": "Kunt u mij helpen?",
        "en": "Can you help me?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: ___ even! (wachten)",
        "answer": "Wacht"
      },
      {
        "prompt": "Ask politely: “Can you help me?”",
        "answer": "Kunt u mij helpen?"
      }
    ]
  },
  {
    "id": "appointments",
    "level": "A2",
    "title": "Making appointments",
    "goal": "Arrange, move and cancel appointments.",
    "explanation": "Use a clear date/time, confirm availability, and explain changes politely.",
    "examples": [
      {
        "nl": "Ik wil graag een afspraak maken.",
        "en": "I would like to make an appointment."
      },
      {
        "nl": "Kan ik de afspraak verzetten?",
        "en": "Can I reschedule the appointment?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik wil een afspraak ___.",
        "answer": "maken"
      },
      {
        "prompt": "Complete: Kan ik de afspraak ___?",
        "answer": "verzetten"
      }
    ]
  },
  {
    "id": "shopping",
    "level": "A2",
    "title": "Shopping and returns",
    "goal": "Ask about products, sizes and refunds.",
    "explanation": "Practice polite questions, describing a problem, and explaining what you need.",
    "examples": [
      {
        "nl": "Heeft u dit in een andere maat?",
        "en": "Do you have this in another size?"
      },
      {
        "nl": "Ik wil dit graag terugbrengen.",
        "en": "I would like to return this."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Heeft u dit in een andere ___?",
        "answer": "maat"
      },
      {
        "prompt": "Complete: Ik wil dit graag ___.",
        "answer": "terugbrengen"
      }
    ]
  },
  {
    "id": "healthcare",
    "level": "A2",
    "title": "At the doctor",
    "goal": "Describe symptoms and make a medical appointment.",
    "explanation": "Use ik heb last van for symptoms and sinds for duration. Be precise about when a problem began.",
    "examples": [
      {
        "nl": "Ik heb last van hoofdpijn.",
        "en": "I have a headache."
      },
      {
        "nl": "Ik ben sinds maandag ziek.",
        "en": "I have been ill since Monday."
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
      }
    ]
  },
  {
    "id": "housing",
    "level": "A2",
    "title": "Housing and repairs",
    "goal": "Report housing problems and ask for repairs.",
    "explanation": "Describe the issue, where it is, and when it started.",
    "examples": [
      {
        "nl": "De verwarming doet het niet.",
        "en": "The heating is not working."
      },
      {
        "nl": "Kunt u dit repareren?",
        "en": "Could you repair this?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: De verwarming doet het ___.",
        "answer": "niet"
      },
      {
        "prompt": "Complete: Kunt u dit ___?",
        "answer": "repareren"
      }
    ]
  },
  {
    "id": "workplace",
    "level": "A2",
    "title": "Work communication",
    "goal": "Explain tasks, availability and delays at work.",
    "explanation": "Use short, clear statements and polite requests to colleagues.",
    "examples": [
      {
        "nl": "Ik ben vandaag wat later.",
        "en": "I am a little late today."
      },
      {
        "nl": "Kunnen we de vergadering verplaatsen?",
        "en": "Can we move the meeting?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik ben vandaag wat ___.",
        "answer": "later"
      },
      {
        "prompt": "Complete: Kunnen we de vergadering ___?",
        "answer": "verplaatsen"
      }
    ]
  },
  {
    "id": "email_messages",
    "level": "A2",
    "title": "Emails and messages",
    "goal": "Write short polite personal and practical messages.",
    "explanation": "Use a greeting, reason for writing, clear request and closing.",
    "examples": [
      {
        "nl": "Beste mevrouw De Vries,",
        "en": "Dear Ms De Vries,"
      },
      {
        "nl": "Met vriendelijke groet,",
        "en": "Kind regards,"
      }
    ],
    "checks": [
      {
        "prompt": "Formal email opening: ___ mevrouw",
        "answer": "Beste"
      },
      {
        "prompt": "Formal closing: Met vriendelijke ___",
        "answer": "groet"
      }
    ]
  },
  {
    "id": "giving_opinions",
    "level": "A2",
    "title": "Opinions and reasons",
    "goal": "Give a simple opinion and explain why.",
    "explanation": "Use ik vind, volgens mij, want and omdat. Remember the verb moves to the end after omdat.",
    "examples": [
      {
        "nl": "Ik vind het interessant.",
        "en": "I find it interesting."
      },
      {
        "nl": "Ik blijf thuis omdat het regent.",
        "en": "I stay home because it rains."
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
      }
    ]
  },
  {
    "id": "reading_notices",
    "level": "A2",
    "title": "Reading notices",
    "goal": "Understand notices, instructions and short announcements.",
    "explanation": "Look for the purpose, key dates, conditions and required action in short practical texts.",
    "examples": [
      {
        "nl": "De winkel is wegens vakantie gesloten.",
        "en": "The shop is closed for holidays."
      },
      {
        "nl": "Alleen op afspraak.",
        "en": "By appointment only."
      }
    ],
    "checks": [
      {
        "prompt": "Meaning of “gesloten”",
        "answer": "closed"
      },
      {
        "prompt": "Meaning of “alleen op afspraak”",
        "answer": "by appointment only"
      }
    ]
  },
  {
    "id": "listening_details",
    "level": "A2",
    "title": "Listening for details",
    "goal": "Catch times, places and actions in everyday speech.",
    "explanation": "Listen once for the main idea, then again for numbers, dates, places and what the speaker wants.",
    "examples": [
      {
        "nl": "De trein vertrekt om kwart over acht.",
        "en": "The train leaves at 8:15."
      },
      {
        "nl": "De afspraak is verplaatst.",
        "en": "The appointment has been moved."
      }
    ],
    "checks": [
      {
        "prompt": "What time is “kwart over acht”?",
        "answer": "8:15"
      },
      {
        "prompt": "Meaning of “verplaatst”",
        "answer": "moved"
      }
    ]
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
  }
];
