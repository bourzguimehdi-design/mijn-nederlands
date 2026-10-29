const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const db=new Map();let failKey=null,failOnce=false;
const root={innerHTML:'',querySelector:()=>null,querySelectorAll:()=>[],appendChild(){}};
const ctx={console,Date,JSON,Map,Set,Blob,URL,setTimeout,clearTimeout,setInterval,clearInterval,alert(){},confirm:()=>true,
  localStorage:{getItem:k=>db.has(k)?db.get(k):null,setItem:(k,v)=>{if(k===failKey&&failOnce){failOnce=false;throw Error('Quota');}db.set(k,v);},removeItem:k=>db.delete(k)},
  document:{getElementById:()=>root,createElement:()=>({append(){},textContent:'',style:{}})},window:{scrollTo(){}},
  A2Studio:{open(){},esc:x=>String(x)},A2Conversation:{say(){}},hideAllSections(){},Dashboard:{open(){}}};
vm.createContext(ctx);
for(const file of ['js/progress-backup.js','js/practice-quality.js','data/curriculum.js','data/lesson-guides.js','data/a2-depth.js','data/a2-vocabulary.js','data/a2-exam-content.js','js/curriculum-engine.js','js/a2-exam-practice.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
const get=s=>vm.runInContext(s,ctx),backup=get('ProgressBackup'),quality=get('PracticeQuality'),exam=get('A2ExamPractice');
// No authentication/unrelated entries in export. Default restore preserves conflicting data.
db.set('unrelated-secret','do-not-export');db.set('mijn_nederlands_curriculum_v1',JSON.stringify({reflexive_verbs:{passed:true,lastScore:2}}));
db.set('mijn_nederlands_a2_vocab_v1',JSON.stringify({'0-0':{stage:3,attempts:8,due:'2026-11-02'}}));
const saved=backup.snapshot();assert.equal(Object.keys(saved.entries).length,2);assert(!Object.hasOwn(saved.entries,'unrelated-secret'));
const imported={...saved,entries:{...saved.entries,mijn_nederlands_knm_v1:'[{"id":"work","score":3}]'}};
db.set('mijn_nederlands_a2_vocab_v1','{"newer":true}');assert.equal(backup.restore(imported),1);assert.equal(db.get('mijn_nederlands_a2_vocab_v1'),'{"newer":true}');
assert.equal(backup.restore(saved,true),2);assert.equal(db.get('mijn_nederlands_a2_vocab_v1'),saved.entries.mijn_nederlands_a2_vocab_v1);assert.equal(db.get('unrelated-secret'),'do-not-export');
for(const entries of [{evil:'{}'},{mijn_nederlands_knm_v1:'not json'},{mijn_nederlands_knm_v1:'null'}])assert.throws(()=>backup.validate(JSON.stringify({...saved,entries})));
assert.throws(()=>backup.validate('{bad json'));assert.throws(()=>backup.validate(JSON.stringify({...saved,version:99})));
const before=JSON.stringify([...db]);failKey='mijn_nederlands_knm_v1';failOnce=true;
assert.throws(()=>backup.restore({...saved,entries:{mijn_nederlands_curriculum_v1:'{}',mijn_nederlands_knm_v1:'[]'}},true),/original data was restored/);
assert.equal(JSON.stringify([...db]),before,'quota failure rolls back prior writes');
// Actual screenshot contradiction gets blocked; normal keys and non-relative exercises survive.
const bad={id:'relative',type:'multiple_choice',prompt:'De fiets ___ ik gebruik, is nieuw.',options:['die','dat','wie'],expectedAnswer:'dat',explanation:"Actually 'de fiets' is a de-word, so the correct pronoun is die."};
assert(quality.inspect(bad));assert.equal(quality.inspect({...bad,expectedAnswer:'die'}),null);
assert.equal(quality.inspect({...bad,prompt:'Het boek ___ ik lees, is oud.',expectedAnswer:'dat',explanation:'Singular het-word.'}),null);
assert(quality.inspect({...bad,expectedAnswer:'missing'}));assert(quality.inspect({...bad,options:['die','die']}));
let advanced=0;const ui={answers:[{exerciseId:'other',stage:'guided',correct:true},{exerciseId:'relative',stage:'guided',qualityQuestionIndex:1,correct:false}],currentStage:'guided',currentQuestionIndex:1,getCurrentExercise:()=>bad,nextQuestion:()=>advanced++};
quality.report(ui);assert.equal(ui.answers.length,1);assert.equal(advanced,1);assert.equal(JSON.parse(db.get(quality.KEY)).length,1);
assert(!db.has('mijn_nederlands_a2_mastery_v1'));assert(!db.has('mijn_nederlands_spaced_reviews_v1'));
// Content structure, stable learning IDs, expanded checks and Dutch forms.
const lessons=get('DutchCurriculum'),vocab=get('A2Vocabulary'),guides=get('DutchLessonGuides');
assert.equal(lessons.length,67);assert.equal(lessons.filter(x=>x.level==='A2').length,52);assert.equal(new Set(lessons.map(x=>x.id)).size,67);
assert.equal(vocab.length,97);assert.equal(new Set(vocab.map(x=>x.id)).size,97);assert.equal(vocab[0].id,'0-0');
assert(lessons.find(l=>l.id==='reflexive_verbs').checks.length>=5);assert(guides.reflexive_verbs.table.rows.some(r=>r[0]==='jullie'&&r[1]==='je'));
const relative=lessons.find(l=>l.id==='relative_clauses');assert.equal(relative.checks.find(q=>q.prompt.includes('De fiets')).answer,'die');
// Every objective mock question has a valid answer/explanation; open-ended tasks are unscored.
for(const kind of ['reading','listening','knm'])for(const q of exam.questions(kind)){assert(Number.isInteger(q.answer));assert(q.answer>=0&&q.answer<q.options.length);assert(q.why);assert.equal(new Set(q.options).size,q.options.length);}
for(const kind of ['writing','speaking'])for(const q of exam.questions(kind)){assert(q.model&&q.checks.length>=3);}
for(const kind of ['reading','listening','writing','speaking'])for(const q of exam.questions(kind))assert(lessons.some(l=>l.id===q.topic&&l.level==='A2'),'A2 follow-up lesson exists: '+q.topic);
for(const l of get('KNMLessons'))assert(l.source.startsWith('https://')&&l.questions.length===3);
// Empty questions are never treated as answer zero. Submission saves once and no mastery.
let result;exam.results=r=>{result=r;};root.querySelector=()=>null;
const items=exam.questions('reading');exam.run={id:'test',kind:'reading',items,startedAt:'now'};exam.finish(true);
assert.equal(result.score,0);assert.equal(result.responses[0],null);assert.equal(result.expired,true);assert.equal(exam.read().length,1);
exam.finish();assert.equal(exam.read().length,1,'double submit is harmless');
exam.run={id:'write-test',kind:'writing',items:exam.questions('writing'),startedAt:'now'};exam.finish();assert.equal(result.score,null);
assert.equal(exam.read().length,2);assert(!db.has('mijn_nederlands_a2_mastery_v1'));
// Original completed lesson check remains labelled with its historical denominator.
root.querySelector=()=>({});get("CurriculumEngine.openLesson('reflexive_verbs')");assert(root.innerHTML.includes('Previous check: 2/2 correct'));assert(root.innerHTML.includes('Forms at a glance'));
console.log('PASS: backup whitelist/preview data/default restore/explicit replacement/rollback, contradictory grading rejection and penalty-free reports, lesson IDs and historical checks, 97 vocabulary IDs, valid mock keys and single submission, unscored production tasks.');
