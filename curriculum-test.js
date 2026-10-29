const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const store = new Map();
const ctx = vm.createContext({
  console, Date, JSON, String, Number, Object, Array, Set,
  localStorage: {
    getItem: key => store.get(key) || null,
    setItem: (key, value) => store.set(key, value)
  },
  document: { getElementById: () => null }
});
vm.runInContext(fs.readFileSync('data/curriculum.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync('js/curriculum-engine.js', 'utf8'), ctx);
const topics = vm.runInContext('DutchCurriculum', ctx);
const engine = vm.runInContext('CurriculumEngine', ctx);
assert(topics.length >= 35);
assert.strictEqual(new Set(topics.map(x => x.id)).size, topics.length);
for (const topic of topics) {
  assert(['A1', 'A2', 'B1'].includes(topic.level));
  assert(topic.goal && topic.explanation && topic.examples.length >= 2);
  assert(topic.checks.length >= 2 && topic.checks.every(q => typeof q.answer === 'string'));
}
assert(engine.stats('A2').total >= 20);
assert.strictEqual(engine.normalize('  HEB. '), 'heb');
engine.save({ perfect_tense: { lastScore: 2, passed: true } });
assert.strictEqual(engine.load().perfect_tense.passed, true);
assert.strictEqual(engine.stats('A2').passed, 1);
console.log(`PASS: ${topics.length} unique structured lessons; A2 coverage ${engine.stats('A2').total}; safe progress persistence`);
