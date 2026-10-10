
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const mem=new Map();
const ctx={localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)},
Date,console,window:{},document:{},DutchLessonGuides:{}};
vm.createContext(ctx);
for(const file of ['data/curriculum.js','data/a2-depth.js','data/a2-vocabulary.js','data/a2-conversations.js','data/a2-mock-tasks.js','js/a2-vocabulary-engine.js','js/a2-conversation.js','js/a2-mock-exam.js','js/a2-studio.js']){
 vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
assert.equal(vm.runInContext("DutchCurriculum.filter(x=>x.level==='A2').length",ctx),22);
assert.equal(vm.runInContext("Object.keys(A2Depth).length",ctx),22);
assert.equal(vm.runInContext("A2Vocabulary.length",ctx),43);
assert.equal(vm.runInContext("A2Conversations.length",ctx),5);
assert.equal(vm.runInContext("A2MockTasks.length",ctx),4);
const first=vm.runInContext("A2Vocabulary[0].id",ctx);
vm.runInContext(`A2VocabularyEngine.grade('${first}',true,new Date(2026,9,10))`,ctx);
assert.equal(vm.runInContext(`A2VocabularyEngine.load()['${first}'].due`,ctx),'2026-10-13');
assert.equal(vm.runInContext(`A2VocabularyEngine.due(new Date(2026,9,11)).some(x=>x.id==='${first}')`,ctx),false);
vm.runInContext(`A2VocabularyEngine.grade('${first}',false,new Date(2026,9,13))`,ctx);
assert.equal(vm.runInContext(`A2VocabularyEngine.load()['${first}'].due`,ctx),'2026-10-14');
assert.equal(vm.runInContext(`A2VocabularyEngine.load()['${first}'].stage`,ctx),0);
console.log('PASS: 22 depth guides, 43 vocabulary cards, 5 guided scenarios, 4 exam samplers, review progression');
