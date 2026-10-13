const fs=require('fs'),vm=require('vm'),assert=require('assert');
const base=__dirname;
const context={console,Date,JSON,Math,Promise,localStorage:{getItem:()=>null,setItem:()=>{}},
  ProfileEngine:{refresh:()=>({})},PracticeEngine:{createConceptSession:(concept)=>({concept,level:'A1',practiceType:'concept'})},
  CurriculumEngine:{find:id=>context.DutchCurriculum.find(x=>x.id===id)},
  PracticeUI:null};
vm.createContext(context);
vm.runInContext(fs.readFileSync(base+'/data/curriculum.js','utf8')+'\nthis.DutchCurriculum=DutchCurriculum;',context);
vm.runInContext(fs.readFileSync(base+'/data/a2-vocabulary.js','utf8')+'\nthis.A2Vocabulary=A2Vocabulary;',context);
vm.runInContext(fs.readFileSync(base+'/js/practice-ui.js','utf8')+'\nthis.PracticeUI=PracticeUI;',context);
context.PracticeUI.start=async s=>s;
(async()=>{
const target=context.DutchCurriculum.find(x=>x.level==='A2'&& /Because and that/i.test(x.title));assert(target,'Because and that lesson missing');
const session=await context.PracticeUI.startFromActivity({type:'concept',concept:`${target.title}. Goal: ${target.goal}. Focus: ${target.explanation}`,level:'A2',source:'a2_mastery_assessment',masteryTopicId:target.id});
assert.strictEqual(session.level,'A2');assert.strictEqual(session.masteryTopicId,target.id);assert(session.concept.includes('Goal:'));
assert(context.DutchCurriculum.some(x=>x.id==='food_meals_cooking'));
assert(context.DutchCurriculum.some(x=>x.id==='furniture_home_rooms'));
assert.strictEqual(new Set(context.DutchCurriculum.map(x=>x.id)).size,context.DutchCurriculum.length);
assert.strictEqual(new Set(context.A2Vocabulary.map(x=>x.id)).size,context.A2Vocabulary.length);
console.log('PASS: A2 assessment level, descriptive objective, topic mapping, unique curriculum/vocab IDs');
})().catch(e=>{console.error(e);process.exit(1)});
