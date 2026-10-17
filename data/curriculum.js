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

// Phase 6 additional A2 coverage: additive IDs, existing progress is retained.
DutchCurriculum.push(...[
  {
    "id": "negation_niet_geen",
    "level": "A2",
    "title": "Negation: niet and geen",
    "goal": "Say what you do not do or do not have.",
    "explanation": "Use geen with indefinite nouns: Ik heb geen auto. Use niet for verbs, adjectives and definite things: Ik werk vandaag niet.",
    "examples": [
      {
        "nl": "Ik heb geen afspraak.",
        "en": "I do not have an appointment."
      },
      {
        "nl": "De winkel is niet open.",
        "en": "The shop is not open."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik heb ___ fiets.",
        "answer": "geen"
      },
      {
        "prompt": "Complete: Ik kom vandaag ___.",
        "answer": "niet"
      }
    ]
  },
  {
    "id": "object_pronouns",
    "level": "A2",
    "title": "Object pronouns",
    "goal": "Use me, je, hem, haar, ons and ze in daily exchanges.",
    "explanation": "Use object pronouns for the person receiving an action: Ik bel hem. Zij helpt ons.",
    "examples": [
      {
        "nl": "Ik zie haar morgen.",
        "en": "I will see her tomorrow."
      },
      {
        "nl": "Kun je me helpen?",
        "en": "Can you help me?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik bel ___. (him)",
        "answer": "hem"
      },
      {
        "prompt": "Complete: Kun je ___ helpen? (me)",
        "answer": "me"
      }
    ]
  },
  {
    "id": "possessives",
    "level": "A2",
    "title": "Possessive words",
    "goal": "Talk about belongings and relationships.",
    "explanation": "Use mijn, jouw/je, zijn, haar, ons/onze, jullie and hun. Ons with singular het words; onze with de words and plurals.",
    "examples": [
      {
        "nl": "Dat is mijn tas.",
        "en": "That is my bag."
      },
      {
        "nl": "Dit is ons huis.",
        "en": "This is our house."
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
      }
    ]
  },
  {
    "id": "question_words",
    "level": "A2",
    "title": "Questions and clarification",
    "goal": "Ask and answer wie, wat, waar, wanneer, waarom and hoe.",
    "explanation": "Start information questions with a question word, then the conjugated verb: Wanneer begint de les?",
    "examples": [
      {
        "nl": "Hoe laat vertrekt de trein?",
        "en": "What time does the train leave?"
      },
      {
        "nl": "Waarom ben je te laat?",
        "en": "Why are you late?"
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
      }
    ]
  },
  {
    "id": "numbers_prices",
    "level": "A2",
    "title": "Numbers, prices and quantities",
    "goal": "Understand prices, dates, measurements and amounts.",
    "explanation": "Dutch prices use a comma for decimals. Ask Hoeveel kost het? and Hoeveel heb je nodig?",
    "examples": [
      {
        "nl": "Het kost twaalf euro vijftig.",
        "en": "It costs twelve euros fifty."
      },
      {
        "nl": "Ik wil twee kilo appels.",
        "en": "I want two kilos of apples."
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
      }
    ]
  },
  {
    "id": "transport_travel",
    "level": "A2",
    "title": "Transport and travel",
    "goal": "Buy tickets, ask about delays and navigate journeys.",
    "explanation": "Use vertrekken, aankomen, overstappen, vertraging and perron to discuss travel.",
    "examples": [
      {
        "nl": "De trein heeft tien minuten vertraging.",
        "en": "The train is delayed ten minutes."
      },
      {
        "nl": "Ik moet in Utrecht overstappen.",
        "en": "I have to change trains in Utrecht."
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
      }
    ]
  },
  {
    "id": "restaurant_food",
    "level": "A2",
    "title": "Food, restaurants and ordering",
    "goal": "Order food, ask about ingredients and make polite requests.",
    "explanation": "Use Ik wil graag..., Mag ik...? and Heeft u...? for polite requests.",
    "examples": [
      {
        "nl": "Mag ik de menukaart, alstublieft?",
        "en": "May I have the menu, please?"
      },
      {
        "nl": "Ik wil graag zonder kaas bestellen.",
        "en": "I would like to order without cheese."
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
      }
    ]
  },
  {
    "id": "family_relationships",
    "level": "A2",
    "title": "Family and relationships",
    "goal": "Describe relatives and social arrangements.",
    "explanation": "Use familie terms and simple connected descriptions: Mijn zus woont in Rotterdam en zij werkt daar.",
    "examples": [
      {
        "nl": "Mijn broer is getrouwd.",
        "en": "My brother is married."
      },
      {
        "nl": "We bezoeken onze ouders zondag.",
        "en": "We are visiting our parents Sunday."
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
      }
    ]
  },
  {
    "id": "daily_routines",
    "level": "A2",
    "title": "Daily routines and frequency",
    "goal": "Describe schedules, habits and recurring activities.",
    "explanation": "Use elke dag, meestal, soms, nooit and vaak to describe how frequently you do something.",
    "examples": [
      {
        "nl": "Ik sport meestal na het werk.",
        "en": "I usually exercise after work."
      },
      {
        "nl": "Op maandag begin ik vroeg.",
        "en": "On Monday I start early."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik sport ___ na het werk. (usually)",
        "answer": "meestal"
      },
      {
        "prompt": "Complete: ___ maandag begin ik vroeg.",
        "answer": "Op"
      }
    ]
  },
  {
    "id": "weather_seasons",
    "level": "A2",
    "title": "Weather and seasons",
    "goal": "Describe weather and make plans based on forecasts.",
    "explanation": "Use Het regent, Het waait, Het is bewolkt and temperatures with graden.",
    "examples": [
      {
        "nl": "Het regent vandaag.",
        "en": "It is raining today."
      },
      {
        "nl": "Morgen wordt het warmer.",
        "en": "Tomorrow it will be warmer."
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
      }
    ]
  },
  {
    "id": "health_pharmacy",
    "level": "A2",
    "title": "Health and pharmacy",
    "goal": "Describe symptoms and understand simple advice.",
    "explanation": "Use Ik heb pijn aan..., sinds..., and Hoe vaak moet ik...? for symptoms and medicine instructions.",
    "examples": [
      {
        "nl": "Ik heb sinds gisteren hoofdpijn.",
        "en": "I have had a headache since yesterday."
      },
      {
        "nl": "Hoe vaak moet ik dit innemen?",
        "en": "How often should I take this?"
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
      }
    ]
  },
  {
    "id": "public_services",
    "level": "A2",
    "title": "Municipality and public services",
    "goal": "Arrange appointments and ask about documents.",
    "explanation": "Use gemeente, afspraak, identiteitsbewijs and formulier in everyday official situations.",
    "examples": [
      {
        "nl": "Ik wil een afspraak maken bij de gemeente.",
        "en": "I want to make an appointment at the municipality."
      },
      {
        "nl": "Moet ik mijn paspoort meenemen?",
        "en": "Do I need to bring my passport?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik wil een ___ maken.",
        "answer": "afspraak"
      },
      {
        "prompt": "Complete: Moet ik mijn paspoort ___?",
        "answer": "meenemen"
      }
    ]
  },
  {
    "id": "money_banking",
    "level": "A2",
    "title": "Banking and payments",
    "goal": "Ask about payments, transfers and bank cards.",
    "explanation": "Use betalen, pinnen, overmaken and rekening to discuss money.",
    "examples": [
      {
        "nl": "Kan ik hier pinnen?",
        "en": "Can I pay by card here?"
      },
      {
        "nl": "Ik heb het geld overgemaakt.",
        "en": "I transferred the money."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Kan ik hier ___?",
        "answer": "pinnen"
      },
      {
        "prompt": "Complete: Ik heb het geld ___.",
        "answer": "overgemaakt"
      }
    ]
  },
  {
    "id": "job_search",
    "level": "A2",
    "title": "Jobs and applications",
    "goal": "Discuss work experience, hours and applying for jobs.",
    "explanation": "Use solliciteren naar, ervaring met and beschikbaar zijn for job applications.",
    "examples": [
      {
        "nl": "Ik heb ervaring met computers.",
        "en": "I have experience with computers."
      },
      {
        "nl": "Ik solliciteer naar deze functie.",
        "en": "I am applying for this position."
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
      }
    ]
  },
  {
    "id": "education_courses",
    "level": "A2",
    "title": "Courses and learning",
    "goal": "Ask about classes, homework and study plans.",
    "explanation": "Use inschrijven voor, huiswerk maken and oefenen met to discuss learning.",
    "examples": [
      {
        "nl": "Ik schrijf me in voor de cursus.",
        "en": "I register for the course."
      },
      {
        "nl": "Ik oefen elke dag Nederlands.",
        "en": "I practise Dutch every day."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Ik schrijf me in ___ de cursus.",
        "answer": "voor"
      },
      {
        "prompt": "Complete: Ik ___ elke dag Nederlands.",
        "answer": "oefen"
      }
    ]
  },
  {
    "id": "inviting_social",
    "level": "A2",
    "title": "Invitations and social plans",
    "goal": "Invite, accept, decline and reschedule politely.",
    "explanation": "Use Heb je zin om...?, Helaas kan ik niet and Zullen we...?",
    "examples": [
      {
        "nl": "Heb je zin om zaterdag te wandelen?",
        "en": "Do you feel like walking on Saturday?"
      },
      {
        "nl": "Helaas kan ik morgen niet.",
        "en": "Unfortunately I cannot tomorrow."
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Heb je ___ om mee te gaan?",
        "answer": "zin"
      },
      {
        "prompt": "Complete: ___ we zondag afspreken?",
        "answer": "Zullen"
      }
    ]
  },
  {
    "id": "emergencies_safety",
    "level": "A2",
    "title": "Emergencies and safety",
    "goal": "Explain urgent situations and follow basic safety instructions.",
    "explanation": "Use Er is..., Bel..., Pas op! and simple imperatives in emergencies.",
    "examples": [
      {
        "nl": "Er is brand in het gebouw.",
        "en": "There is a fire in the building."
      },
      {
        "nl": "Bel onmiddellijk de hulpdiensten.",
        "en": "Call emergency services immediately."
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
      }
    ]
  },
  {
    "id": "complaints_service",
    "level": "A2",
    "title": "Complaints and customer service",
    "goal": "Explain a problem, request help and describe an outcome.",
    "explanation": "Use kapot, werkt niet, terugbrengen and een oplossing to discuss complaints.",
    "examples": [
      {
        "nl": "Dit apparaat werkt niet.",
        "en": "This device does not work."
      },
      {
        "nl": "Kunt u mij een oplossing aanbieden?",
        "en": "Can you offer me a solution?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Dit apparaat ___ niet.",
        "answer": "werkt"
      },
      {
        "prompt": "Complete: Kunt u mij ___?",
        "answer": "helpen"
      }
    ]
  },
  {
    "id": "sequence_storytelling",
    "level": "A2",
    "title": "Telling events in order",
    "goal": "Explain what happened using simple time connectors.",
    "explanation": "Use eerst, daarna, toen, vervolgens and uiteindelijk to put events in order.",
    "examples": [
      {
        "nl": "Eerst ging ik naar de winkel.",
        "en": "First I went to the shop."
      },
      {
        "nl": "Daarna heb ik thuis gekookt.",
        "en": "After that I cooked at home."
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
      }
    ]
  },
  {
    "id": "obligation_permission",
    "level": "A2",
    "title": "Obligation and permission",
    "goal": "Explain what is allowed, required and possible.",
    "explanation": "Use moeten for obligation, mogen for permission and kunnen for ability.",
    "examples": [
      {
        "nl": "Je moet een kaartje kopen.",
        "en": "You must buy a ticket."
      },
      {
        "nl": "Mag ik hier parkeren?",
        "en": "May I park here?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Je ___ een kaartje kopen. (must)",
        "answer": "moet"
      },
      {
        "prompt": "Complete: ___ ik hier parkeren?",
        "answer": "Mag"
      }
    ]
  },
  {
    "id": "conditional_als",
    "level": "A2",
    "title": "Conditions with als",
    "goal": "Make simple conditional plans and explain consequences.",
    "explanation": "With als, the conjugated verb goes to the end of the subordinate clause: Als het regent, blijf ik thuis.",
    "examples": [
      {
        "nl": "Als ik tijd heb, bel ik je.",
        "en": "If I have time, I will call you."
      },
      {
        "nl": "Als het koud is, draag ik een jas.",
        "en": "If it is cold, I wear a coat."
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
      }
    ]
  },
  {
    "id": "prepositions_time",
    "level": "A2",
    "title": "Time prepositions",
    "goal": "Use om, op, in, sinds, voor and na with times and dates.",
    "explanation": "Use om for clock times, op for days and in for months/seasons: om acht uur, op maandag, in oktober.",
    "examples": [
      {
        "nl": "De les begint om negen uur.",
        "en": "The lesson starts at nine."
      },
      {
        "nl": "We spreken op vrijdag af.",
        "en": "We meet on Friday."
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
      }
    ]
  },
  {
    "id": "phone_messages",
    "level": "A2",
    "title": "Phone calls and messages",
    "goal": "Leave a message and request a callback.",
    "explanation": "Use Met ... spreken, Kan ik ... spreken? and Wilt u terugbellen? for calls.",
    "examples": [
      {
        "nl": "Kan ik mevrouw Jansen spreken?",
        "en": "May I speak to Ms Jansen?"
      },
      {
        "nl": "Wilt u mij terugbellen?",
        "en": "Would you call me back?"
      }
    ],
    "checks": [
      {
        "prompt": "Complete: Wilt u mij ___?",
        "answer": "terugbellen"
      },
      {
        "prompt": "Complete: Kan ik u morgen ___?",
        "answer": "bellen"
      }
    ]
  }
,
{
  "id": "colours_and_descriptions",
  "level": "A2",
  "title": "Colours and describing things",
  "goal": "Describe colours, sizes and patterns when shopping or talking about everyday objects.",
  "explanation": "Colour adjectives: rood, blauw, groen, geel, zwart, wit, grijs, bruin, roze and paars. Before a de-noun, adjectives usually add -e: de rode jas. After een with a het-noun, the basic form is common: een blauw shirt. Compare: het blauwe shirt.",
  "examples": [
    {
      "nl": "De rode jas is duur.",
      "en": "The red coat is expensive."
    },
    {
      "nl": "Ik zoek een blauw shirt.",
      "en": "I am looking for a blue shirt."
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
    }
  ]
},
{
  "id": "clothing_and_getting_dressed",
  "level": "A2",
  "title": "Clothes and getting dressed",
  "goal": "Name common clothes and describe what you wear, buy or put on.",
  "explanation": "Useful words: de broek, de jas, de jurk, het shirt, de schoenen, de sokken, de trui. Aankleden is separable: ik kleed me aan; in the perfect tense: ik heb me aangekleed. Aantrekken means to put on an item: ik trek mijn jas aan. Dragen means to wear.",
  "examples": [
    {
      "nl": "Ik trek mijn schoenen aan.",
      "en": "I put on my shoes."
    },
    {
      "nl": "Zij draagt een warme trui.",
      "en": "She is wearing a warm sweater."
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
    }
  ]
},
{
  "id": "locations_and_position",
  "level": "A2",
  "title": "Locations and position",
  "goal": "Say where objects and people are using spatial words and prepositions.",
  "explanation": "Place words: binnen (inside), buiten (outside), op (on), onder (under), in (in), naast (next to), tussen (between), voor (in front of), achter (behind), boven (above/upstairs), beneden (below/downstairs), tegenover (opposite). Use liggen for objects lying somewhere, staan for standing objects, and zitten for some contained locations.",
  "examples": [
    {
      "nl": "De sleutels liggen op de tafel.",
      "en": "The keys are on the table."
    },
    {
      "nl": "De fiets staat naast het huis.",
      "en": "The bicycle is next to the house."
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
    }
  ]
},
{
  "id": "food_meals_cooking",
  "level": "A2",
  "title": "Food, meals and cooking",
  "goal": "Describe daily meals, groceries, ingredients, quantities and simple cooking steps.",
  "explanation": "Use ontbijt, lunch and avondeten for meals; een kilo, een liter, een beetje and genoeg for quantities. Describe cooking with eerst, daarna and ten slotte. For example: Eerst snijd ik de groenten, daarna kook ik de rijst.",
  "examples": [
    {
      "nl": "Ik eet meestal brood met kaas als ontbijt.",
      "en": "I usually eat bread with cheese for breakfast."
    },
    {
      "nl": "Eerst snijd ik de groenten, daarna maak ik de soep.",
      "en": "First I chop the vegetables, then I make the soup."
    }
  ],
  "checks": [
    {
      "prompt": "Complete: Ik eet brood als ___. (breakfast)",
      "answer": "ontbijt"
    },
    {
      "prompt": "Complete: Eerst snijd ik de groenten, ___ kook ik de soep.",
      "answer": "daarna"
    }
  ]
},
{
  "id": "furniture_home_rooms",
  "level": "A2",
  "title": "Furniture, rooms and the home",
  "goal": "Describe rooms, furniture, where objects are placed and everyday household needs.",
  "explanation": "Use de woonkamer, de slaapkamer, de keuken and de badkamer for rooms. Describe furniture with er staat (singular) and er staan (plural): In de woonkamer staat een bank. Er staan twee stoelen naast de tafel.",
  "examples": [
    {
      "nl": "In mijn slaapkamer staat een bed naast de kast.",
      "en": "There is a bed next to the wardrobe in my bedroom."
    },
    {
      "nl": "We zetten de tafel bij het raam.",
      "en": "We put the table by the window."
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
    }
  ]
},
{
  "id": "separable_verbs_a2",
  "level": "A2",
  "title": "Separable verbs (scheidbare werkwoorden)",
  "goal": "Use common separable verbs in main clauses, subordinate clauses, with modal verbs and in the perfect tense.",
  "explanation": "Some Dutch verbs combine a prefix with a verb: binnenkomen (enter), aankomen (arrive), opstaan (get up), meenemen (take along), uitgaan (go out). In a normal main clause, the prefix moves to the end: Ik sta om zeven uur op. With a modal verb, keep the infinitive together: Ik wil vroeg opstaan. In a subordinate clause, the conjugated verb stays together at the end: Ik denk dat hij morgen aankomt. In the perfect tense, ge often comes between prefix and verb: Ik ben aangekomen; ik ben opgestaan. Watch meaning: aankomen means arrive, but binnenkomen means enter a room.",
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
      "prompt": "Complete: Ik sta elke ochtend om zeven uur ___.",
      "answer": "op"
    }
  ]
},
{
  "id": "fixed_preposition_verbs_a2",
  "level": "A2",
  "title": "Verbs with fixed prepositions",
  "goal": "Choose the correct preposition after common verbs and ask simple questions using er + preposition.",
  "explanation": "Some verbs require a particular preposition: wachten op (wait for), denken aan (think about), praten over (talk about), luisteren naar (listen to), zoeken naar (look for), beginnen met (start with), zorgen voor (take care of), geloven in (believe in). The preposition is part of the expression, not a separable verb prefix. Compare: Ik wacht op de bus; Ik denk aan mijn familie. With things, Dutch often uses er + preposition: Ik wacht erop. For people, use preposition + pronoun: Ik wacht op hem. Practise these as complete combinations.",
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
    }
  ]
}
]);
