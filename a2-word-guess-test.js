// Regression checks for Raad het woord and A2 verbs. Run from repo root: node a2-word-guess-test.js
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const curriculum=fs.readFileSync('data/curriculum.js','utf8');
const game=fs.readFileSync('js/a2-word-guess.js','utf8');
const studio=fs.readFileSync('js/a2-studio.js','utf8');
const html=fs.readFileSync('index.html','utf8');
for(const [name,source] of [['curriculum',curriculum],['game',game],['studio',studio]])new vm.Script(source,{filename:name+'.js'});
const lessons=vm.runInNewContext(curriculum+'; DutchCurriculum');
const ids=lessons.map(x=>x.id);
assert.equal(new Set(ids).size,ids.length,'Curriculum IDs must be unique');
for(const id of ['separable_verbs_a2','fixed_preposition_verbs_a2']){
 const lesson=lessons.find(x=>x.id===id);
 assert.equal(lesson?.level,'A2');
 assert.ok(lesson.checks.length>=3);
}
const gameObject=vm.runInNewContext(game+'; A2WordGuess');
assert.ok(gameObject.bank.length>=6);
assert.ok(gameObject.bank.every(x=>x.word&&x.hint&&x.kind));
assert.match(game,/A2AIConversation\.finish\(\)/);
assert.match(studio,/studioWordGuess/);
assert.match(html,/js\/a2-word-guess\.js/);
console.log('PASS: unique A2 curriculum IDs, two A2 verb lessons, word-game integration and feedback wiring');
