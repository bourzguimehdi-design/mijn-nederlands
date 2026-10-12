const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context={console,Date,document:{getElementById:()=>null},
Dashboard:{getTodayKey:()=> '2026-10-11',getDailyRecord:()=>null,create:0,open(){},render(){},startActivity(){},saveDailyRecord(){}},
StudyPlanEngine:{createTodayPlan:()=>({activities:[]})},
CurriculumEngine:{nextLesson:()=>({id:'a2-perfect',title:'Perfect tense'}),getLearningStatus:()=>({passed:2,total:22,nextTitle:'Perfect tense'}),check(){},find(){return {checks:[1,2]}},load(){return {}}},
A2MockTasks:[{id:'listen-1',skill:'listening',title:'Voicemail'},{id:'read-1',skill:'reading',title:'Notice'}],
A2VocabularyEngine:{due:()=>[{id:1}],grade(){}},A2Conversations:[{id:'doctor',title:'Doctor'}],
A2Conversation:{render(){}},A2MockExam:{render(){}}};
vm.createContext(context);vm.runInContext(fs.readFileSync('js/a2-adaptive-phase5.js','utf8'),context);
const sample={activities:[
{id:'review',type:'concept',title:'Review',minutes:15},
{id:'writing',type:'skill',skill:'writing',title:'Writing',minutes:20},
{id:'speaking',type:'skill',skill:'speaking',title:'Speaking',minutes:15},
{id:'reading',type:'skill',skill:'reading',title:'Reading',minutes:15},
{id:'vocab1',type:'skill',skill:'vocabulary',title:'Vocabulary',minutes:5},
{id:'vocab2',type:'skill',skill:'vocabulary',title:'Vocabulary',minutes:20}
]};
const completed={review:{resultId:'1'},writing:{resultId:'2'},speaking:{resultId:'3'},reading:{resultId:'4'},vocab1:{resultId:'5'}};
const snapshot=JSON.stringify(sample.activities.slice(0,5));
const record={date:'2026-10-11',plan:sample,completed};
assert.equal(vm.runInContext('A2AdaptivePhase5',context).reconcile(record),true);
assert.equal(JSON.stringify(sample.activities.slice(0,5)),snapshot,'completed activities preserved');
assert.equal(sample.activities[5].skill,'listening','duplicate vocabulary changed to listening');
assert.equal(sample.activities[5].studioKind,'assessment');
assert.equal(Object.keys(completed).length,5);
assert.equal(vm.runInContext('A2AdaptivePhase5',context).reconcile(record),false,'migration idempotent');
const fresh={activities:[{id:'w',type:'skill',skill:'writing'},{id:'s',type:'skill',skill:'speaking'},{id:'v1',type:'skill',skill:'vocabulary'},{id:'v2',type:'skill',skill:'vocabulary'}]};
vm.runInContext('A2AdaptivePhase5',context).decorate(fresh,new Date('2026-10-11T12:00:00'));
assert.equal(fresh.activities[0].studioKind,'lesson');
assert.equal(fresh.activities[1].studioKind,'conversation');
assert.equal(fresh.activities[2].studioKind,'vocabulary');
assert.notEqual(fresh.activities[3].skill,'vocabulary');
console.log('PASS: Phase 5 migration, completed history, duplicate avoidance, A2 routing');
