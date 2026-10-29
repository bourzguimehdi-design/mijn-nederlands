const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const storage=new Map();const fields=new Map();const root={innerHTML:'',querySelector(selector){return fields.get(selector)||{onclick:null};}};
const ctx={console,Date,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById:id=>id==='curriculum'?root:null},window:{scrollTo(){}},Dashboard:{open(){}}};
vm.createContext(ctx);
for(const file of ['data/curriculum.js','data/lesson-guides.js','data/a2-depth.js','js/curriculum-engine.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
const get=e=>vm.runInContext(e,ctx),lessons=get('DutchCurriculum'),guides=get('DutchLessonGuides'),depth=get('A2Depth'),engine=get('CurriculumEngine');
const a2=lessons.filter(l=>l.level==='A2');
assert.equal(a2.length,52);assert.equal(lessons.length,67);assert.equal(new Set(lessons.map(l=>l.id)).size,67);
for(const l of a2){
  assert(l.explanation.length>=140,l.id+' substantive overview');
  assert(l.examples.length>=5,l.id+' worked examples');assert(l.examples.every(e=>e.nl&&e.en),l.id);
  assert(l.checks.length>=5,l.id+' checks');assert(l.checks.every(q=>q.prompt&&typeof q.answer==='string'&&q.answer.trim()),l.id+' nonempty keys');
  assert(guides[l.id]?.rules.length>=4,l.id+' topic-specific rules');assert(guides[l.id].mistakes.length>=2,l.id+' pitfalls');
  assert(depth[l.id]?.translationDrills.length>=3,l.id+' guided production');assert(depth[l.id].challenge.length>=50,l.id+' independent task');
  assert(!depth[l.id].steps.some(s=>/^Goal:|Notice the pattern in this example:|Compare the second example:/.test(s)),l.id+' no placeholder teaching');
  const before=JSON.stringify([...storage]);engine.openLesson(l.id);
  for(const heading of ['Understand','Examples','Step by step','Common mistakes','Guided practice','Quick understanding check'])assert(root.innerHTML.includes(heading),l.id+' renders '+heading);
  assert.equal(JSON.stringify([...storage]),before,'reading lesson cannot rewrite progress');
}
// Earlier 2- or 3-question scores keep their historical denominator and completed pass.
const records={};for(const l of a2)records[l.id]={passed:true,lastScore:l.legacyCheckCount||l.checks.length,attempts:4,lastCheckedAt:'2026-10-01'};
records.unrelated={passed:true,lastScore:2};engine.save(records);
const old=JSON.stringify(engine.load());
for(const l of a2){engine.openLesson(l.id);const n=records[l.id].lastScore;assert(root.innerHTML.includes('Previous check: '+n+'/'+n+' correct'),l.id+' original denominator');}
assert.equal(JSON.stringify(engine.load()),old);assert.equal(engine.stats('A2').passed,52);
// Newly completed checks store the new denominator, retain an older pass even on failure.
const l=a2.find(x=>x.id==='separable_verbs_a2');
for(let i=0;i<l.checks.length;i++)fields.set('[data-answer="'+i+'"]',{value:'wrong'});
fields.set('#curriculumFeedback',{innerHTML:''});engine.check(l.id);
assert.equal(engine.load()[l.id].passed,true);assert.equal(engine.load()[l.id].lastCheckTotal,l.checks.length);assert.equal(engine.load()[l.id].attempts,5);assert.deepEqual(JSON.parse(JSON.stringify(engine.load().unrelated)),records.unrelated);
// Verify important rule forms independently from generated answer arrays.
function q(id,contains){const item=a2.find(l=>l.id===id);return item.checks.find(x=>x.prompt.includes(contains));}
assert.equal(q('past_participle','reizen').answer,'gereisd');assert.equal(q('past_participle','opbellen').answer,'opgebeld');
assert.equal(q('separable_verbs_a2','opbellen').answer,'opgebeld');assert.equal(q('fixed_preposition_verbs_a2','beginnen').answer,'met');
assert.equal(q('possessives','boeken').answer,'onze');assert.equal(q('adjective_endings','een ___ huis').answer,'mooi');
assert.equal(q('listening_details','half negen').answer,'8:30');
assert(engine.isCorrectAnswer(q('appointments','reschedule'),'verplaatsen'));
assert(engine.isCorrectAnswer(q('workplace','move to another time'),'verzetten'));
assert(engine.isCorrectAnswer(q('object_pronouns','(me)'),'mij'));
assert(engine.isCorrectAnswer(q('email_messages','Formal closing'),'groeten'));
assert(engine.isCorrectAnswer(q('reading_notices','alleen op afspraak'),'only by appointment'));
assert(!engine.isCorrectAnswer(q('appointments','reschedule'),'annuleren'),'cancel is not reschedule');
assert(!engine.isCorrectAnswer(q('adjective_endings','een ___ huis'),''),'blank is not a correct uninflected adjective');
assert(engine.isCorrectAnswer(q('prepositions','De tas'),'De tas ligt op de tafel.'));
console.log('PASS: all 52 A2 lessons meet depth checks and render, historic scores/passes retained, failed retries preserve history, new totals saved, key grammar forms/valid alternatives/blank rejection.');
