const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const today=new Date(2026,9,29,12);
class Clock extends Date {constructor(...args){super(...(args.length?args:[today.getTime()]));}static now(){return today.getTime();}}
function setup(db={},record=null){
  const nodes={};
  const root={innerHTML:'',querySelector(id){return nodes[id] ||= {value:'',innerHTML:''};}};
  const ctx={console,Date:Clock,localStorage:{getItem:k=>db[k]||null,setItem:(k,v)=>{db[k]=v;}},document:{getElementById:()=>root},
    A2Studio:{open(){},render(){},esc:x=>String(x)},
    Dashboard:{getTodayKey:()=> '2026-10-29',getDailyRecord:()=>record,saveDailyRecord:r=>{record=r;},open(){},render(){},startActivity(){}},
    StudyPlanEngine:{createTodayPlan:()=>({activities:[]})},
    CurriculumEngine:{nextLesson:()=>null,check(){},find(){},load:()=>({})},
    A2MockTasks:[],A2Conversations:[],A2Conversation:{render(){}},A2MockExam:{render(){}}};
  vm.createContext(ctx);
  for(const p of ['data/a2-vocabulary.js','js/a2-vocabulary-engine.js'])vm.runInContext(fs.readFileSync(p,'utf8'),ctx);
  return {ctx,db,nodes,root,get:e=>vm.runInContext(e,ctx)};
}
const a=setup(),e=a.get('A2VocabularyEngine'),words=a.get('A2Vocabulary'),total=words.length;
assert.equal(e.stats().total,97);
assert.equal(e.stats().newWords,total);assert.equal(e.stats().reviewsDue,0);
for(const w of words.slice(0,9))e.grade(w.id,true);
assert.equal(e.due().length,total-9);assert.equal(e.stats().reviewedToday,9);assert.equal(e.stats().scheduled,9);
const snapshot=JSON.stringify(a.db);
const reloaded=setup(a.db).get('A2VocabularyEngine');
assert.equal(reloaded.due().length,total-9);assert.equal(reloaded.stats().reviewedToday,9);
assert.equal(JSON.stringify(a.db),snapshot,'reading/reloading must not rewrite saved progress');
assert(reloaded.planSubtitle(true).includes('Daily activity completed'));
assert(reloaded.planSubtitle(true).includes(`${total-9} available now (0 reviews + ${total-9} new)`));
const future=new Date(2026,10,1,12);assert.equal(reloaded.stats(future).reviewsDue,9);
assert.equal(reloaded.stats(future).reviewedToday,0);assert.equal(reloaded.due(future)[0].id,words[0].id);
const overdue=setup();const oe=overdue.get('A2VocabularyEngine');
oe.grade(words[60].id,false,new Date(2026,9,27,12));
assert.equal(oe.due()[0].id,words[60].id,'overdue learned words precede new words');
const keys=Object.keys(oe.load());assert.equal(keys.length,1);
assert.equal(oe.load()[words[60].id].due,'2026-10-28','existing scheduling unchanged');
oe.grade(words[60].id,false);assert.equal(oe.load()[words[60].id].due,'2026-10-30');
assert.equal(oe.due().some(w=>w.id===words[60].id),false);
// Session resume: two saved reviews before launch, third completes stable daily ID once.
const record={date:'2026-10-29',plan:{activities:[{id:'vocab',type:'a2_studio',studioKind:'vocabulary',studioId:'due',subtitle:'70 words due'}]},completed:{old:{resultId:'keep'}}};
const b=setup({},record),be=b.get('A2VocabularyEngine');
be.grade(words[0].id,true);be.grade(words[1].id,true);
const planBefore=JSON.stringify(record.plan),oldBefore=JSON.stringify(record.completed.old);
vm.runInContext(fs.readFileSync('js/a2-adaptive-phase5.js','utf8'),b.ctx);
const bridge=b.get('A2AdaptivePhase5');bridge.launch(record.plan.activities[0]);
assert.equal(bridge.vocabularyCount,2);
be.grade(words[2].id,true);
assert(record.completed.vocab);assert.equal(JSON.stringify(record.plan),planBefore);
assert.equal(JSON.stringify(record.completed.old),oldBefore);
assert.equal(be.stats().reviewedToday,3);
// Review UI records the actual schedule and moves forward after confirmation.
const ui=setup(),ue=ui.get('A2VocabularyEngine');ue.open();
assert(ui.root.innerHTML.includes(`0 reviews due · ${total} new words`));
ui.nodes['#vReveal'].onclick();ui.nodes['#vGood'].onclick();
assert(ui.root.innerHTML.includes('review saved. Next review: 2026-11-01.'));
assert(ui.root.innerHTML.includes('1 words reviewed today'));
assert.equal(ue.due().length,total-1);
console.log('PASS: expanded bank remaining counts, reload persistence, new/due split, scheduled returns, overdue priority, resume 2+1 daily target, unchanged plan/history, saved-review UI.');
