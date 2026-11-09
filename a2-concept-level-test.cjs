const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const ctx={console:{log(){},error(){}},Date,Promise,ProfileEngine:{refresh:()=>({skills:{writing:{level:'A1'},grammar:{level:'A1'}},concepts:{}})}};
vm.createContext(ctx);
vm.runInContext(read('js/practice-engine.js')+'\nthis.engine=PracticeEngine;',ctx);
vm.runInContext(read('js/practice-ui.js')+'\nthis.ui=PracticeUI;',ctx);
ctx.ui.start=async s=>s;
(async()=>{
 const profile=ctx.ProfileEngine.refresh();
 // Real engine previously derives A1 from this profile.
 assert.equal(ctx.engine.createConceptSession('spelling',profile).level,'A1');
 for(const activity of [{type:'concept',concept:'spelling',id:'weak-1'},{type:'concept',concept:'spelling',level:'A2',source:'spaced_review',id:'review-1'}]){
  const s=await ctx.ui.startFromActivity(activity);assert.equal(s.level,'A2');assert(s.activities.every(a=>a.level==='A2'));assert.equal(s.dailyActivityId,activity.id);
 }
 assert.equal((await ctx.ui.startFromActivity({type:'concept',concept:'articles',level:'A1',source:'curriculum_practice'})).level,'A1');
 // Exercise actual Daily Plan routing wrapper against an old A1 saved review.
 const passed=[];ctx.A2AdaptivePhase5={decorate:p=>p};ctx.CurriculumEngine={nextLesson:()=>null};ctx.Dashboard={startActivity(a){passed.push(a);},open(){},getDailyRecord:()=>null};
 vm.runInContext(read('js/a2-phase61.js')+'\nthis.phase=A2Phase61;',ctx);
 const old={id:'saved-review',type:'concept',concept:'spelling',source:'spaced_review',level:'A1'};const before=JSON.stringify(old);
 ctx.Dashboard.startActivity(old,0);assert.equal(passed[0].level,'A2');assert.equal(passed[0].id,old.id);assert.equal(JSON.stringify(old),before);
 const done={...old,id:'done'},pending={...old};ctx.phase.normalize({activities:[done,pending]},{done:true});assert.equal(done.level,'A1');assert.equal(pending.level,'A2');
 // Test error remediation's real generator with old A1 evidence and capture API request.
 vm.runInContext(read('js/error-lesson-engine.js')+'\nthis.errorEngine=ErrorLessonEngine;',ctx);
 const evidence={level:'A1',learnerAnswer:'boomen'};ctx.errorEngine.getLessonContext=()=>({concept:'spelling',level:'A1',evidenceCount:1,mistakes:[evidence],skills:['writing']});
 let requested;ctx.MijnNederlandsAPI={generatePractice:async s=>{requested=s;return {status:'success',practice:{explanation:{title:'A2 spelling'}}};}};
 const r=await ctx.errorEngine.generateLesson('spelling');assert.equal(requested.level,'A2');assert.equal(r.targetLevel,'A2');assert.equal(evidence.level,'A1');
 assert.equal(profile.skills.writing.level,'A1');
 console.log('PASS: A2 concept and spaced review targets/stages, legacy launch IDs, completed-plan preservation, explicit A1 curriculum, A2 remediation with unchanged historic evidence.');
})().catch(e=>{console.error(e);process.exitCode=1;});
