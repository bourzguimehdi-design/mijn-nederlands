/* A2 mastery bridge. Additive data only; never clears old curriculum or Daily Plan progress. */
const A2Mastery = {
  KEY: 'mijn_nederlands_a2_mastery_v1',
  pending: null,
  read() {
    try { const x=JSON.parse(localStorage.getItem(this.KEY)||'{}'); return x && typeof x==='object' && !Array.isArray(x) ? x : {}; }
    catch (_) { return {}; }
  },
  write(data) { localStorage.setItem(this.KEY,JSON.stringify(data)); },
  stats() {
    const records=this.read();
    const topics=typeof DutchCurriculum==='undefined' ? [] : DutchCurriculum.filter(t=>t.level==='A2');
    return {total:topics.length, mastered:topics.filter(t=>records[t.id]?.mastered===true).length};
  },
  // This uses existing AI-generated concept practice; it is a first mastery gate,
  // not yet a separately blueprint-controlled, invigilated assessment.
  async start(id) {
    const lesson=CurriculumEngine.find(id);
    if (!lesson || lesson.level!=='A2') return;
    if (this.pending) return;
    if (typeof PracticeUI==='undefined' || typeof ProfileEngine==='undefined') {
      alert('AI practice is unavailable. Your lesson progress is unchanged.'); return;
    }
    const task=typeof A2AdaptivePhase5!=='undefined' ? A2AdaptivePhase5.currentTask : null;
    this.pending={id, dailyTask:task?.kind==='lesson' && task.studioId===id ? {...task} : null};
    // Give the generator a human-readable A2 objective, not an opaque snake_case ID.
    const target=`${lesson.title}. Goal: ${lesson.goal}. Focus: ${lesson.explanation}`;
    try {
      await PracticeUI.startFromActivity({
        id:`a2-mastery-${id}-${Date.now()}`,type:'concept',concept:target,masteryTopicId:id,
        minutes:9,level:'A2',source:'a2_mastery_assessment',title:`A2 assessment: ${lesson.title}`
      });
    } catch (error) {
      this.pending=null;
      console.error('A2 assessment could not start',error);
      CurriculumEngine.open('A2'); CurriculumEngine.openLesson(id);
      alert('Could not generate the AI assessment. Try again when the connection is available.');
    }
  },
  record(result) {
    const p=this.pending;
    if (!p || !result || result.source!=='a2_mastery_assessment' || result.masteryTopicId!==p.id || result.level!=='A2') return;
    // Never award mastery from ungraded answers or too few exercises.
    const answers=Array.isArray(result.answers)?result.answers:[];
    const graded=answers.filter(a=>typeof a.correct==='boolean');
    const correct=graded.filter(a=>a.correct).length;
    // At least five objectively graded items and no missing grades.
    const eligible=graded.length>=5 && graded.length===answers.length;
    const passed=eligible && correct/graded.length>=0.8;
    // A result can complete the daily task without awarding mastery.
    const all=this.read(), prev=all[p.id]||{};
    all[p.id]={...prev,mastered:prev.mastered===true||passed,attempts:(prev.attempts||0)+1,
      lastAttemptAt:new Date().toISOString(),lastScore:graded.length?Math.round(100*correct/graded.length):null,
      lastGradedCount:graded.length,lastPassed:passed,lastResultId:result.id||null,
      status:passed?'initial_mastery':eligible?'retry_due':'insufficient_assessment'};
    try { this.write(all); } catch(e) { console.error('Could not save mastery result',e); }
    // Failed assessments still close the scheduled learning activity.
    if (p.dailyTask && typeof A2AdaptivePhase5!=='undefined') {
      A2AdaptivePhase5.currentTask=p.dailyTask;
      A2AdaptivePhase5.finish('lesson',p.id);
    }
    if (!passed && typeof SpacedReviewEngine!=='undefined' && typeof SpacedReviewEngine.registerMistakes==='function') {
      // Existing PracticeUI saves individual incorrect answers and schedules reviews.
      // Do not double-register them here.
    }
    this.pending=null;
    const msg=passed?'Initial mastery achieved; a later review is still needed.':
      eligible?'Assessment completed; topic needs another attempt. Your Daily Plan task is done.':
      'Assessment completed, but fewer than five graded answers were available. No mastery awarded.';
    const root=typeof PracticeUI!=='undefined' && typeof PracticeUI.getRoot==='function' ? PracticeUI.getRoot() : null;
    if (root) { const note=document.createElement('p'); note.className='card curriculum-panel'; note.textContent=msg; root.appendChild(note); }
  },
  install() {
    if (this.installed || typeof Storage==='undefined' || typeof Storage.savePracticeResult!=='function') return;
    this.installed=true;
    if (typeof CurriculumEngine!=='undefined' && typeof CurriculumEngine.openLesson==='function') {
      const openLesson=CurriculumEngine.openLesson;
      CurriculumEngine.openLesson=function(id) {
        const response=openLesson.call(this,id);
        const root=document.getElementById('curriculum');
        const lesson=this.find(id);
        if (root && lesson?.level==='A2') {
          const rec=A2Mastery.read()[id];
          const info=document.createElement('p');
          info.className='small';
          info.textContent=rec?.mastered ? '✓ Initial mastery achieved (later review still needed).' :
            rec?.attempts ? `Assessment attempts: ${rec.attempts} · Last score: ${rec.lastScore ?? 'ungraded'}% · Not yet mastered.` :
            'Mastery not assessed yet. A quick check does not award mastery.';
          root.querySelector('.curriculum-lesson')?.appendChild(info);
        }
        return response;
      };
    }
    const original=Storage.savePracticeResult;
    Storage.savePracticeResult=function(...args) {
      const result=original.apply(this,args);
      // Defer until PracticeUI has finished its own completion workflow.
      if (result) Promise.resolve().then(()=>A2Mastery.record(result));
      return result;
    };
  }
};
A2Mastery.install();
