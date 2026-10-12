const fs=require('fs'),vm=require('vm'),assert=require('assert');
const saved={};let finished=0;
const context={
  console,Date,Promise,
  localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},
  Storage:{savePracticeResult:x=>x},
  DutchCurriculum:[{id:'simple_past',level:'A2'}],
  CurriculumEngine:{find:id=>({id,level:'A2',title:'Simple past'})},
  A2AdaptivePhase5:{currentTask:null,finish:()=>{finished++}},
  PracticeUI:{getRoot:()=>null},
  SpacedReviewEngine:{registerMistakes:()=>{}},
  document:{getElementById:()=>null},alert:()=>{}
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/a2-mastery.js','utf8'),context);
function submit(answers){
  context.A2AdaptivePhase5.currentTask={kind:'lesson',studioId:'simple_past',date:'today',id:'plan-1'};
  vm.runInContext("A2Mastery.pending={id:'simple_past',dailyTask:{kind:'lesson',studioId:'simple_past',date:'today',id:'plan-1'}}",context);
  context.Storage.savePracticeResult({id:'test-'+finished,source:'a2_mastery_assessment',concept:'simple_past',answers});
  return new Promise(r=>setImmediate(r));
}
(async()=>{
 await submit([true,true,false,false,true].map(correct=>({correct})));
 assert.equal(finished,1);assert.equal(JSON.parse(saved.mijn_nederlands_a2_mastery_v1).simple_past.mastered,false);
 await submit([true,true,true,true,false].map(correct=>({correct})));
 assert.equal(finished,2);assert.equal(JSON.parse(saved.mijn_nederlands_a2_mastery_v1).simple_past.mastered,true);
 await submit([false,false,false,false,false].map(correct=>({correct})));
 assert.equal(finished,3);assert.equal(JSON.parse(saved.mijn_nederlands_a2_mastery_v1).simple_past.mastered,true);
 await submit([true,true,true,true].map(correct=>({correct})));
 assert.equal(finished,4);assert.equal(JSON.parse(saved.mijn_nederlands_a2_mastery_v1).simple_past.lastPassed,false);
 console.log('PASS: failure completes task; >=5 graded + 80% mastery; mastery retained; insufficient assessment rejected');
})().catch(e=>{console.error(e);process.exitCode=1});
