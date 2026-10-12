/* Phase 6.1: A2-first daily routing. Additive; never clears learner storage. */
const A2Phase61 = {
  version: 1,
  normalize(plan, completed = {}) {
    if (!plan || !Array.isArray(plan.activities)) return plan;
    const slots = plan.activities;
    const next = CurriculumEngine.nextLesson('A2');
    const open = slots.filter(a => !completed[a.id]);
    // Only unfinished slots are adjusted. The first available non-review slot is a lesson.
    if (next && !slots.some(a => a.studioKind === 'lesson' && !completed[a.id])) {
      const slot = open.find(a => a.type !== 'concept' && a.skill !== 'vocabulary');
      if (slot) Object.assign(slot, {type:'a2_studio',source:'a2_studio',studioKind:'lesson',studioId:next.id,
        skill:'grammar',title:`New lesson: ${next.title}`,subtitle:'A2 curriculum · guided explanation and topic check',level:'A2'});
    }
    for (const a of open) {
      if (a.type === 'concept') continue; // retain personal weakness / spaced review routing
      if (a.studioKind === 'assessment') {
        // The legacy three-question sampler must not masquerade as fresh AI practice.
        delete a.studioKind; delete a.studioId;
        a.type = 'skill'; a.source = 'phase61';
      }
      if (a.studioKind === 'lesson' || a.studioKind === 'vocabulary' || a.studioKind === 'conversation') continue;
      if (['reading','listening','writing','speaking','grammar','vocabulary'].includes(a.skill)) {
        a.type = 'skill'; a.source = 'phase61'; a.level = 'A2';
        a.title = `A2 ${a.skill[0].toUpperCase()}${a.skill.slice(1)} practice`;
        a.subtitle = next ? `A2 practice · current topic: ${next.title}` : 'A2 practice · curriculum review';
        a.curriculumTopicId = next?.id || null;
      }
    }
    return plan;
  },
  install() {
    if (this.installed) return; this.installed = true;
    const previous = A2AdaptivePhase5.decorate;
    A2AdaptivePhase5.decorate = function(plan, date, completed) {
      return A2Phase61.normalize(previous.call(this,plan,date,completed),completed);
    };
    // Reconcile existing unfinished activities once; never overwrite completed activities.
    const priorOpen = Dashboard.open;
    Dashboard.open = function(...args) {
      const record = this.getDailyRecord();
      if (record?.plan && record.phase61Version !== A2Phase61.version) {
        A2Phase61.normalize(record.plan,record.completed || {});
        record.phase61Version = A2Phase61.version;
        this.saveDailyRecord(record);
      }
      return priorOpen.apply(this,args);
    };
    // Force A2 for every unfinished skill activity, including plans saved before Phase 6.1.
    const priorStart = Dashboard.startActivity;
    Dashboard.startActivity = function(activity,index) {
      if (activity?.type !== 'concept' && activity?.skill && activity?.studioKind !== 'lesson' && activity?.studioKind !== 'vocabulary' && activity?.studioKind !== 'conversation') {
        const normalized = {...activity,type:'skill',level:'A2',source:'phase61'};
        this.activeActivity = activity; // preserve original daily-plan ID for completion
        return Promise.resolve(PracticeUI.startFromActivity(normalized)).catch(e => console.error('A2 practice failed:',e));
      }
      return priorStart.call(this,activity,index);
    };
  }
};
A2Phase61.install();
