const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const reviews={};let saves=0;
const sandbox={
  A2Phase61:{normalize:(p)=>p},
  Dashboard:{open(){},getDailyRecord(){return null},saveDailyRecord(){saves++}},
  CurriculumEngine:{nextLesson:()=>({id:'past_participles',title:'Past participles'})},
  SpacedReviewEngine:{getDueReviews:()=>[{concept:'word_order'}],registerMistakes(r){if(reviews[r.id])return 0;reviews[r.id]=r;return 1}},
  console
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('js/a2-phase63.js','utf8'),sandbox);
const bridge=vm.runInContext('A2Phase63',sandbox);
const feedback={corrections:[{original:'Daarom ik heb',suggested:'Daarom heb ik',explanation:'Inversion after daarom'}]};
const session={completedAt:'2026-10-11T20:00:00Z',scenario:'doctor'};
assert.equal(bridge.registerFeedback(session,feedback).registered,1);
assert.equal(bridge.registerFeedback(session,feedback).registered,0);
assert.equal(Object.values(reviews)[0].answers[0].concepts[0],'word_order');
assert.equal(bridge.conceptFor({explanation:'Try to be more detailed'}),null);
const completed={done:{completedAt:'2026-10-11'}};
const plan={activities:[{id:'done',type:'skill',skill:'writing',title:'Writing'}, {id:'new',type:'skill',skill:'reading',title:'Reading'}, {id:'other',type:'skill',skill:'speaking',title:'Speaking'}]};
bridge.adapt(plan,completed);
assert.equal(plan.activities[0].title,'Writing');
assert.equal(plan.activities[1].studioKind,'lesson');
assert.equal(plan.activities[2].concept,'word_order');
console.log('Phase 6.3 integration tests passed (idempotence, conservative tagging, completed preservation, lesson and due review).');
