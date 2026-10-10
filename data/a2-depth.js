/* All 22 A2 topics: supplementary guided steps and recall tasks. */
const A2Depth = {
  "perfect_tense": {
    "objective": "Describe completed events in the past.",
    "steps": [
      "Goal: Describe completed events in the past.",
      "Notice the pattern in this example: Ik heb gisteren gewerkt.",
      "Compare the second example: Zij is naar huis gegaan.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I worked yesterday.",
        "answer": "Ik heb gisteren gewerkt."
      },
      {
        "prompt": "She went home.",
        "answer": "Zij is naar huis gegaan."
      }
    ],
    "challenge": "Use perfect tense in three original Dutch sentences about your own experience."
  },
  "past_participle": {
    "objective": "Form regular and common irregular participles.",
    "steps": [
      "Goal: Form regular and common irregular participles.",
      "Notice the pattern in this example: werken → gewerkt",
      "Compare the second example: schrijven → geschreven",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "worked",
        "answer": "werken → gewerkt"
      },
      {
        "prompt": "written",
        "answer": "schrijven → geschreven"
      }
    ],
    "challenge": "Use past participles in three original Dutch sentences about your own experience."
  },
  "imperfect_tense": {
    "objective": "Tell stories using the simple past.",
    "steps": [
      "Goal: Tell stories using the simple past.",
      "Notice the pattern in this example: Ik was gisteren ziek.",
      "Compare the second example: We gingen naar de markt.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I was ill yesterday.",
        "answer": "Ik was gisteren ziek."
      },
      {
        "prompt": "We went to the market.",
        "answer": "We gingen naar de markt."
      }
    ],
    "challenge": "Use simple past in three original Dutch sentences about your own experience."
  },
  "subordinate_clauses": {
    "objective": "Connect ideas with omdat and dat.",
    "steps": [
      "Goal: Connect ideas with omdat and dat.",
      "Notice the pattern in this example: Ik blijf thuis omdat ik ziek ben.",
      "Compare the second example: Ik denk dat hij morgen komt.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I stay home because I am ill.",
        "answer": "Ik blijf thuis omdat ik ziek ben."
      },
      {
        "prompt": "I think he comes tomorrow.",
        "answer": "Ik denk dat hij morgen komt."
      }
    ],
    "challenge": "Use because and that in three original Dutch sentences about your own experience."
  },
  "inversion": {
    "objective": "Start sentences with time or place without losing verb-second order.",
    "steps": [
      "Goal: Start sentences with time or place without losing verb-second order.",
      "Notice the pattern in this example: Na het werk ga ik sporten.",
      "Compare the second example: Morgen heeft zij tijd.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "After work I go exercise.",
        "answer": "Na het werk ga ik sporten."
      },
      {
        "prompt": "Tomorrow she has time.",
        "answer": "Morgen heeft zij tijd."
      }
    ],
    "challenge": "Use inversion in three original Dutch sentences about your own experience."
  },
  "adjective_endings": {
    "objective": "Describe objects with the correct adjective form.",
    "steps": [
      "Goal: Describe objects with the correct adjective form.",
      "Notice the pattern in this example: een mooie auto",
      "Compare the second example: een mooi huis",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "a beautiful car",
        "answer": "een mooie auto"
      },
      {
        "prompt": "a beautiful house",
        "answer": "een mooi huis"
      }
    ],
    "challenge": "Use adjective endings in three original Dutch sentences about your own experience."
  },
  "comparatives": {
    "objective": "Compare people, places and things.",
    "steps": [
      "Goal: Compare people, places and things.",
      "Notice the pattern in this example: Deze trein is sneller.",
      "Compare the second example: Dit is de beste optie.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "This train is faster.",
        "answer": "Deze trein is sneller."
      },
      {
        "prompt": "This is the best option.",
        "answer": "Dit is de beste optie."
      }
    ],
    "challenge": "Use comparisons in three original Dutch sentences about your own experience."
  },
  "prepositions": {
    "objective": "Describe location and movement.",
    "steps": [
      "Goal: Describe location and movement.",
      "Notice the pattern in this example: De fiets staat naast het huis.",
      "Compare the second example: Ik ga naar de winkel.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "The bicycle is next to the house.",
        "answer": "De fiets staat naast het huis."
      },
      {
        "prompt": "I go to the shop.",
        "answer": "Ik ga naar de winkel."
      }
    ],
    "challenge": "Use place and direction in three original Dutch sentences about your own experience."
  },
  "time_expressions": {
    "objective": "Explain when and how often things happen.",
    "steps": [
      "Goal: Explain when and how often things happen.",
      "Notice the pattern in this example: Ik woon hier sinds 2022.",
      "Compare the second example: Ik kom over twee dagen.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I have lived here since 2022.",
        "answer": "Ik woon hier sinds 2022."
      },
      {
        "prompt": "I will come in two days.",
        "answer": "Ik kom over twee dagen."
      }
    ],
    "challenge": "Use time expressions in three original Dutch sentences about your own experience."
  },
  "future_plans": {
    "objective": "Discuss intentions and arrangements.",
    "steps": [
      "Goal: Discuss intentions and arrangements.",
      "Notice the pattern in this example: Ik ga morgen studeren.",
      "Compare the second example: Zullen we afspreken?",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I am going to study tomorrow.",
        "answer": "Ik ga morgen studeren."
      },
      {
        "prompt": "Shall we meet?",
        "answer": "Zullen we afspreken?"
      }
    ],
    "challenge": "Use future plans in three original Dutch sentences about your own experience."
  },
  "reflexive_verbs": {
    "objective": "Talk about routines and feelings.",
    "steps": [
      "Goal: Talk about routines and feelings.",
      "Notice the pattern in this example: Ik voel me goed.",
      "Compare the second example: Zij vergist zich.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I feel good.",
        "answer": "Ik voel me goed."
      },
      {
        "prompt": "She is mistaken.",
        "answer": "Zij vergist zich."
      }
    ],
    "challenge": "Use reflexive verbs in three original Dutch sentences about your own experience."
  },
  "relative_clauses": {
    "objective": "Describe people and objects in more detail.",
    "steps": [
      "Goal: Describe people and objects in more detail.",
      "Notice the pattern in this example: De man die hier werkt.",
      "Compare the second example: Het boek dat ik lees.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "The man who works here.",
        "answer": "De man die hier werkt."
      },
      {
        "prompt": "The book that I read.",
        "answer": "Het boek dat ik lees."
      }
    ],
    "challenge": "Use relative clauses in three original Dutch sentences about your own experience."
  },
  "imperatives": {
    "objective": "Give polite and clear instructions.",
    "steps": [
      "Goal: Give polite and clear instructions.",
      "Notice the pattern in this example: Kom binnen!",
      "Compare the second example: Kunt u mij helpen?",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "Come in!",
        "answer": "Kom binnen!"
      },
      {
        "prompt": "Can you help me?",
        "answer": "Kunt u mij helpen?"
      }
    ],
    "challenge": "Use instructions and requests in three original Dutch sentences about your own experience."
  },
  "appointments": {
    "objective": "Arrange, move and cancel appointments.",
    "steps": [
      "Goal: Arrange, move and cancel appointments.",
      "Notice the pattern in this example: Ik wil graag een afspraak maken.",
      "Compare the second example: Kan ik de afspraak verzetten?",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I would like to make an appointment.",
        "answer": "Ik wil graag een afspraak maken."
      },
      {
        "prompt": "Can I reschedule the appointment?",
        "answer": "Kan ik de afspraak verzetten?"
      }
    ],
    "challenge": "Use making appointments in three original Dutch sentences about your own experience."
  },
  "shopping": {
    "objective": "Ask about products, sizes and refunds.",
    "steps": [
      "Goal: Ask about products, sizes and refunds.",
      "Notice the pattern in this example: Heeft u dit in een andere maat?",
      "Compare the second example: Ik wil dit graag terugbrengen.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "Do you have this in another size?",
        "answer": "Heeft u dit in een andere maat?"
      },
      {
        "prompt": "I would like to return this.",
        "answer": "Ik wil dit graag terugbrengen."
      }
    ],
    "challenge": "Use shopping and returns in three original Dutch sentences about your own experience."
  },
  "healthcare": {
    "objective": "Describe symptoms and make a medical appointment.",
    "steps": [
      "Goal: Describe symptoms and make a medical appointment.",
      "Notice the pattern in this example: Ik heb last van hoofdpijn.",
      "Compare the second example: Ik ben sinds maandag ziek.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I have a headache.",
        "answer": "Ik heb last van hoofdpijn."
      },
      {
        "prompt": "I have been ill since Monday.",
        "answer": "Ik ben sinds maandag ziek."
      }
    ],
    "challenge": "Use at the doctor in three original Dutch sentences about your own experience."
  },
  "housing": {
    "objective": "Report housing problems and ask for repairs.",
    "steps": [
      "Goal: Report housing problems and ask for repairs.",
      "Notice the pattern in this example: De verwarming doet het niet.",
      "Compare the second example: Kunt u dit repareren?",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "The heating is not working.",
        "answer": "De verwarming doet het niet."
      },
      {
        "prompt": "Could you repair this?",
        "answer": "Kunt u dit repareren?"
      }
    ],
    "challenge": "Use housing and repairs in three original Dutch sentences about your own experience."
  },
  "workplace": {
    "objective": "Explain tasks, availability and delays at work.",
    "steps": [
      "Goal: Explain tasks, availability and delays at work.",
      "Notice the pattern in this example: Ik ben vandaag wat later.",
      "Compare the second example: Kunnen we de vergadering verplaatsen?",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I am a little late today.",
        "answer": "Ik ben vandaag wat later."
      },
      {
        "prompt": "Can we move the meeting?",
        "answer": "Kunnen we de vergadering verplaatsen?"
      }
    ],
    "challenge": "Use work communication in three original Dutch sentences about your own experience."
  },
  "email_messages": {
    "objective": "Write short polite personal and practical messages.",
    "steps": [
      "Goal: Write short polite personal and practical messages.",
      "Notice the pattern in this example: Beste mevrouw De Vries,",
      "Compare the second example: Met vriendelijke groet,",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "Dear Ms De Vries,",
        "answer": "Beste mevrouw De Vries,"
      },
      {
        "prompt": "Kind regards,",
        "answer": "Met vriendelijke groet,"
      }
    ],
    "challenge": "Use emails and messages in three original Dutch sentences about your own experience."
  },
  "giving_opinions": {
    "objective": "Give a simple opinion and explain why.",
    "steps": [
      "Goal: Give a simple opinion and explain why.",
      "Notice the pattern in this example: Ik vind het interessant.",
      "Compare the second example: Ik blijf thuis omdat het regent.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "I find it interesting.",
        "answer": "Ik vind het interessant."
      },
      {
        "prompt": "I stay home because it rains.",
        "answer": "Ik blijf thuis omdat het regent."
      }
    ],
    "challenge": "Use opinions and reasons in three original Dutch sentences about your own experience."
  },
  "reading_notices": {
    "objective": "Understand notices, instructions and short announcements.",
    "steps": [
      "Goal: Understand notices, instructions and short announcements.",
      "Notice the pattern in this example: De winkel is wegens vakantie gesloten.",
      "Compare the second example: Alleen op afspraak.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "The shop is closed for holidays.",
        "answer": "De winkel is wegens vakantie gesloten."
      },
      {
        "prompt": "By appointment only.",
        "answer": "Alleen op afspraak."
      }
    ],
    "challenge": "Use reading notices in three original Dutch sentences about your own experience."
  },
  "listening_details": {
    "objective": "Catch times, places and actions in everyday speech.",
    "steps": [
      "Goal: Catch times, places and actions in everyday speech.",
      "Notice the pattern in this example: De trein vertrekt om kwart over acht.",
      "Compare the second example: De afspraak is verplaatst.",
      "Say both examples aloud. Then create a similar sentence about your own life.",
      "Complete the two knowledge checks without looking at the examples; revisit the lesson if you miss one."
    ],
    "translationDrills": [
      {
        "prompt": "The train leaves at 8:15.",
        "answer": "De trein vertrekt om kwart over acht."
      },
      {
        "prompt": "The appointment has been moved.",
        "answer": "De afspraak is verplaatst."
      }
    ],
    "challenge": "Use listening for details in three original Dutch sentences about your own experience."
  }
};
