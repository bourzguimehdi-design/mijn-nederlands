const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('js/a2-phase61.js','utf8');
const context={A2AdaptivePhase5:{decorate:p=>p},CurriculumEngine:{nextLesson:()=>({id:'past-participles',title:'Past participles'})},Dashboard:{open(){},startActivity(){}},PracticeUI:{startFromActivity:async()=>{}},console};

const completed={done:{completedAt:'2026-10-11'}};
const plan={activities:[{id:'done',type:'skill',skill:'reading',level:'B1',title:'Historical reading'},{id:'lesson-slot',type:'skill',skill:'writing',level:'B1'},{id:'reading-slot',type:'a2_studio',studioKind:'assessment',studioId:'static-reading',skill:'reading',level:'B1'}]};
vm.runInNewContext(src+'\nA2Phase61.normalize(plan,completed);',{...context,plan,completed});
assert.equal(plan.activities[0].level,'B1');
assert.equal(plan.activities[1].studioKind,'lesson');
assert.equal(plan.activities[1].level,'A2');
assert.equal(plan.activities[2].type,'skill');
assert.equal(plan.activities[2].level,'A2');
assert.equal(plan.activities[2].studioKind,undefined);
console.log('Phase 6.1 routing checks passed (completed preserved, A2 lesson, no static sampler).');
