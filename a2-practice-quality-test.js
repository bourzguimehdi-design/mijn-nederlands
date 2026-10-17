// Regression checks for 2026-10-17 A2 practice update. Run: node a2-practice-quality-test.js
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const curriculum=fs.readFileSync('js/curriculum-engine.js','utf8');
const practice=fs.readFileSync('js/practice-ui.js','utf8');
const speaking=fs.readFileSync('js/a2-ai-conversation.js','utf8');
for(const [name,source] of [['curriculum',curriculum],['practice',practice],['speaking',speaking]]) {
  new vm.Script(source,{filename:name+'.js'});
}
const context=vm.createContext({});
vm.runInContext(curriculum+'\nthis.engine=CurriculumEngine;',context);
const engine=context.engine;
assert.equal(engine.isCorrectAnswer({prompt:'Ask "Where do you live?"',answer:'Waar woon je?'},'Waar woon je ?'),true);
assert.equal(engine.isCorrectAnswer({prompt:'Ask "Do you speak Dutch?"',answer:'Spreek je Nederlands?'},'Spreek je nederlands ?'),true);
assert.equal(engine.isCorrectAnswer({prompt:'Ask "Where do you live?"',answer:'Waar woon je?'},'Waar werkt je?'),false);
assert.match(practice,/session\.title = activity\.title/);
assert.match(speaking,/title:'Your A2 grammar review'/);
assert.match(speaking,/at least TWO distinct graded exercises per category/);
console.log('PASS: harmless punctuation, case, wrong answer rejection, short heading, balanced A2 prompt');
