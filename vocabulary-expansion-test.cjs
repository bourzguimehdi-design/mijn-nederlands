const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const db=new Map(),fields=new Map();const root={innerHTML:'',querySelector(sel){if(!fields.has(sel))fields.set(sel,{value:'',innerHTML:'',onclick:null,onchange:null,oninput:null});return fields.get(sel);}};
const ctx={console,Date,localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)},document:{getElementById:()=>root},A2Studio:{open(){},render(){},esc:s=>String(s??'').replaceAll('<','&lt;')}};
vm.createContext(ctx);
for(const f of ['data/curriculum.js','data/a2-vocabulary.js','js/a2-vocabulary-engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
const get=s=>vm.runInContext(s,ctx),words=get('A2Vocabulary'),engine=get('A2VocabularyEngine'),lessons=get('DutchCurriculum').filter(l=>l.level==='A2');
const baseline=JSON.parse(fs.readFileSync('vocabulary-expansion-baseline.json','utf8'));
assert.equal(words.length,358);assert.equal(baseline.length,97);assert.equal(new Set(words.map(w=>w.id)).size,358);
for(const old of baseline){const w=words.find(x=>x.id===old.id);for(const [key,value] of Object.entries(old))assert.equal(JSON.stringify(w[key]),JSON.stringify(value),'preserved '+old.id+' '+key);}
for(const l of lessons)assert(words.filter(w=>w.topics.includes(l.id)).length>=5,l.id+' vocabulary coverage');
for(const w of words){assert(w.example&&w.exampleEn,w.id+' bilingual example');assert(w.topics.length&&w.topics.every(t=>lessons.some(l=>l.id===t)));for(const e of w.examples||[])assert(e.nl&&e.en);assert(!/placeholder|required\|/i.test(w.example+w.exampleEn));}
// Old review schedules and unrelated progress survive loading, browsing, searching and mode/topic changes.
const records=Object.fromEntries(baseline.map((w,i)=>[w.id,{stage:3,attempts:7,correctCount:5,due:i===0?'2026-01-01':'2099-01-01',lastReviewed:'2026-10-01'}]));
db.set(engine.KEY,JSON.stringify(records));db.set('mijn_nederlands_curriculum_v1','{"housing":{"passed":true}}');const before=JSON.stringify([...db]);
const stats=engine.stats();assert.equal(stats.newWords,261);assert.equal(stats.reviewsDue,1);assert.equal(stats.scheduled,96);assert.equal(engine.due()[0].id,'0-0');
engine.browse();assert(root.innerHTML.includes('358 words'));assert(root.querySelector('#vBrowseResults').innerHTML.includes('I have an appointment tomorrow.'));
root.querySelector('#vTopic').onchange({target:{value:'feelings_emotions_a2'}});assert(root.querySelector('#vBrowseResults').innerHTML.includes('verdrietig'));assert(!root.querySelector('#vBrowseResults').innerHTML.includes('het vertrek'));
root.querySelector('#vSearch').value='relieved';root.querySelector('#vSearch').oninput();assert(root.querySelector('#vBrowseResults').innerHTML.includes('opgelucht'));assert(!root.querySelector('#vBrowseResults').innerHTML.includes('zenuwachtig'));
assert.equal(JSON.stringify([...db]),before);
engine.topic='all';engine.render();root.querySelector('#vReveal').onclick();assert(root.querySelector('#vFeedback').innerHTML.includes('I have an appointment tomorrow.'));
// Match full lexical words: do not leave an inflection suffix after the blank.
const original=words.find(w=>w.nl==='mooi');assert(original);const oldExample=original.example;original.example='Dat is een mooie fiets.';engine.mode='context';engine.topic='adjective_endings';engine.render();assert(!root.innerHTML.includes('___e fiets'),'no partial-word cloze');original.example=oldExample;
assert.equal(JSON.stringify([...db]),before);
engine.grade('0-0',true,new Date(2026,10,11));const after=engine.load();for(const w of baseline.slice(1))assert.equal(JSON.stringify(after[w.id]),JSON.stringify(records[w.id]));assert.equal(after['0-0'].attempts,8);assert.equal(db.get('mijn_nederlands_curriculum_v1'),'{"housing":{"passed":true}}');
console.log('PASS: 358 cards, 54 topics with >=5 cards, bilingual examples, old97 IDs/content/schedules retained, overdue first, filter/search/reveal and no partial-word cloze or browsing writes.');
