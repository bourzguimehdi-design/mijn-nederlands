const fs=require('fs'),vm=require('vm'),assert=require('assert');
const store=new Map();
const context=vm.createContext({
  console,Date,Math,JSON,Number,String,Array,Object,Set,
  localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},
  ProfileEngine:{refresh:()=>({preferences:{weekdayMinutes:60,weekendMinutes:60},concepts:{},skills:{writing:{assessed:true,score:60},speaking:{assessed:true,score:60},reading:{assessed:true,score:60},listening:{assessed:true,score:60},grammar:{assessed:true,score:60},vocabulary:{assessed:true,score:60}}}),getConceptPriorityScore:()=>0},
  hideAllSections:()=>{},window:{scrollTo:()=>{}},
  document:{getElementById:()=>null},
  escapeHTML:s=>s
});
for(const file of ['js/study-plan-engine.js','js/dashboard.js']) vm.runInContext(fs.readFileSync(file,'utf8'),context);
const plan=vm.runInContext('StudyPlanEngine.createTodayPlan(ProfileEngine.refresh(),new Date("2026-10-09T12:00:00"))',context);
assert(plan.activities.every(a=>a.type==='concept'||a.type==='skill'));
assert.strictEqual(plan.plannedMinutes,60);
assert.strictEqual(plan.activities.reduce((sum,a)=>sum+a.minutes,0),60);
assert.strictEqual(new Set(plan.activities.map(a=>a.id)).size,plan.activities.length);
vm.runInContext('Dashboard.open()',context);
const first=vm.runInContext('Dashboard.getNextActivity()',context);
vm.runInContext('Dashboard.activeActivity=Dashboard.getNextActivity()',context);
vm.runInContext('Dashboard.completeActivity({id:"test-session",completedAt:new Date().toISOString()})',context);
assert(vm.runInContext('Dashboard.isActivityComplete(Dashboard.plan.activities[0])',context));
assert.notStrictEqual(vm.runInContext('Dashboard.getNextActivity().id',context),first.id);
vm.runInContext('Dashboard.open()',context);
assert(vm.runInContext('Dashboard.isActivityComplete(Dashboard.plan.activities[0])',context));
console.log('PASS: plan fully usable, 60 minutes, unique IDs, completion persisted after reopen');
