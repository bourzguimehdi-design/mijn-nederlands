const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
assert(html.includes('id="dashboardHistory"'));assert(html.includes('id="a2OverviewNext"'));
const source=fs.readFileSync(__dirname+'/js/dashboard.js','utf8');
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{textContent:'',style:{},setAttribute(k,v){this[k]=v}});return nodes.get(id)}
const context={console,document:{getElementById:node},CurriculumEngine:{getLearningStatus:()=>({passed:2,total:46,nextTitle:'Simple past'})},SpacedReviewEngine:{getDueReviews:()=>[{concept:'word_order'}]},A2Phase64:{load:()=>[{id:'1'},{id:'2'}]}};
vm.createContext(context);vm.runInContext(source,context);vm.runInContext('Dashboard.renderA2Overview()',context);
assert.equal(node('a2OverviewCount').textContent,'2 / 46 topic checks passed');
assert.equal(node('a2OverviewNext').textContent,'Simple past');
assert.equal(node('a2OverviewDue').textContent,'1');assert.equal(node('a2OverviewMistakes').textContent,'2');
assert.equal(node('a2OverviewProgress')['aria-valuenow'],'2');assert.equal(node('a2OverviewBar').style.width,'4%');
console.log('PASS: A2-first dashboard renders existing progress without changing data');
