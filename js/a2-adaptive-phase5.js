/* Phase 5: adaptive A2 daily-plan bridge. No storage keys are deleted. */
const A2AdaptivePhase5 = {
  version: 1,
  dateKey() { return Dashboard.getTodayKey(); },
  completed(record, activity) { return Boolean(record.completed && record.completed[activity.id]); },
  decorate(plan, date = new Date(), completed = {}) {
    if (!plan || !Array.isArray(plan.activities)) return plan;
    if (typeof CurriculumEngine === 'undefined' || typeof A2MockTasks === 'undefined') return plan;
    const next = CurriculumEngine.nextLesson('A2');
    const due = typeof A2VocabularyEngine !== 'undefined' ? A2VocabularyEngine.due(date).length : 0;
    const conversations = typeof A2Conversations !== 'undefined' ? A2Conversations : [];
    const tasks = A2MockTasks;
    const day = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86400000);
    const seenSkills = new Set();
    const seenKinds = new Set();
    const slots = plan.activities;
    // Existing completed work is immutable, including its ID and original activity details.
    for (const a of slots) {
      if (!completed[a.id]) continue;
      if (a.skill) seenSkills.add(a.skill);
      if (a.studioKind) seenKinds.add(a.studioKind === 'assessment' ? a.skill : a.studioKind);
    }
    for (const a of slots) {
      if (completed[a.id] || a.type === 'concept' || !a.skill) continue;
      let skill = a.skill;
      if (seenSkills.has(skill)) {
        const alternatives = ['listening','reading','grammar','speaking','writing','vocabulary'];
        skill = alternatives.find(s => !seenSkills.has(s)) || skill;
      }
      seenSkills.add(skill);
      a.skill = skill;
      let candidate = null;
      if (next && !seenKinds.has('lesson') && (skill === 'grammar' || skill === 'writing')) {
        candidate = {studioKind:'lesson',studioId:next.id,title:`A2 lesson: ${next.title}`,subtitle:'Next structured A2 topic',icon:'📘'};
      } else if (due > 0 && skill === 'vocabulary' && !seenKinds.has('vocabulary')) {
        candidate = {studioKind:'vocabulary',studioId:'due',title:'A2 vocabulary review',subtitle:`${due} words due`,icon:'🧠'};
      } else if (skill === 'speaking' && conversations.length && !seenKinds.has('conversation')) {
        const scenario = conversations[day % conversations.length];
        candidate = {studioKind:'conversation',studioId:scenario.id,title:`A2 conversation: ${scenario.title}`,subtitle:'Guided A2 roleplay',icon:'💬'};
      } else if (skill === 'reading' || skill === 'listening') {
        const available = tasks.filter(t => t.skill === skill);
        if (available.length && !seenKinds.has(skill)) {
          const task = available[day % available.length];
          candidate = {studioKind:'assessment',studioId:task.id,title:`A2 ${skill}: ${task.title}`,subtitle:'Short comprehension sampler',icon:a.icon};
        }
      }
      if (candidate) {
        Object.assign(a,candidate,{type:'a2_studio',source:'a2_studio',level:'A2'});
        seenKinds.add(candidate.studioKind === 'assessment' ? skill : candidate.studioKind);
      } else if (a.type === 'a2_studio') {
        // Remove stale Studio metadata if this slot has been reassigned.
        delete a.studioKind; delete a.studioId; delete a.source;
        a.type = 'skill'; a.title = skill[0].toUpperCase() + skill.slice(1);
        a.subtitle = 'Additional A2 practice'; a.level = 'A2';
      } else if (a.skill !== skill) {
        a.title = skill[0].toUpperCase() + skill.slice(1);
      }
    }
    // Ensure a lesson slot in new plans when possible, without rewriting completed work.
    if (next && !seenKinds.has('lesson')) {
      const target = slots.find(a => !completed[a.id] && a.type === 'skill' && a.skill !== 'vocabulary' && a.type !== 'concept');
      if (target) Object.assign(target,{type:'a2_studio',source:'a2_studio',studioKind:'lesson',studioId:next.id,level:'A2',title:`A2 lesson: ${next.title}`,subtitle:'Next structured A2 topic',icon:'📘'});
    }
    return plan;
  },
  reconcile(record) {
    if (!record || !record.plan || !Array.isArray(record.plan.activities)) return false;
    if (record.phase5Version === this.version) return false;
    const before = JSON.stringify(record.plan);
    this.decorate(record.plan, new Date(), record.completed || {});
    record.phase5Version = this.version;
    return before !== JSON.stringify(record.plan);
  },
  renderSummary() {
    const container = document.getElementById('dashboardPlan');
    if (!container || typeof CurriculumEngine === 'undefined') return;
    let summary = document.getElementById('phase5LearningSummary');
    if (!summary) {
      summary = document.createElement('div');
      summary.id = 'phase5LearningSummary';
      summary.className = 'card curriculum-panel';
      container.parentNode.insertBefore(summary,container);
    }
    const status = CurriculumEngine.getLearningStatus('A2');
    const due = typeof A2VocabularyEngine !== 'undefined' ? A2VocabularyEngine.due().length : 0;
    const record = Dashboard.getDailyRecord();
    const activities = record?.plan?.activities || [];
    const done = activities.filter(a => record.completed?.[a.id]).length;
    const nextTitle = String(status.nextTitle || 'All topic checks passed');
    // textContent only: lesson titles are not interpreted as markup.
    summary.replaceChildren();
    const heading = document.createElement('h3'); heading.textContent = 'Your A2 learning focus';
    const progress = document.createElement('p'); progress.textContent = `${done}/${activities.length} daily activities completed · ${status.passed}/${status.total} A2 checks passed`;
    const next = document.createElement('p'); next.textContent = `Next topic: ${nextTitle} · Vocabulary due: ${due}`;
    const note = document.createElement('p'); note.textContent = 'A2 checks are not an official B1-readiness assessment.';
    summary.append(heading,progress,next,note);
  },
  install() {
    if (this.installed) return;
    this.installed = true;
    const originalCreate = StudyPlanEngine.createTodayPlan;
    StudyPlanEngine.createTodayPlan = function(...args) {
      return A2AdaptivePhase5.decorate(originalCreate.apply(this,args),args[1] || new Date());
    };
    const originalOpen = Dashboard.open;
    Dashboard.open = function(...args) {
      const record = this.getDailyRecord();
      if (record && A2AdaptivePhase5.reconcile(record)) this.saveDailyRecord(record);
      return originalOpen.apply(this,args);
    };
    const originalRender = Dashboard.render;
    Dashboard.render = function(...args) {
      const result = originalRender.apply(this,args);
      A2AdaptivePhase5.renderSummary();
      return result;
    };
    const originalStart = Dashboard.startActivity;
    Dashboard.startActivity = function(activity,index) {
      if (activity?.type === 'a2_studio') {
        this.activeActivity = activity;
        A2AdaptivePhase5.launch(activity);
        return;
      }
      A2AdaptivePhase5.currentTask = null;
      return originalStart.call(this,activity,index);
    };
    const originalCheck = CurriculumEngine.check;
    CurriculumEngine.check = function(id) {
      const result = originalCheck.call(this,id);
      const item = this.find(id);
      const progress = this.load()[id];
      if (item && progress?.lastScore === item.checks.length) A2AdaptivePhase5.finish('lesson',id);
      return result;
    };
    const originalGrade = A2VocabularyEngine.grade;
    A2VocabularyEngine.grade = function(id,correct,now) {
      const result = originalGrade.call(this,id,correct,now);
      if (A2AdaptivePhase5.currentTask?.kind === 'vocabulary') {
        A2AdaptivePhase5.vocabularyCount++;
        if (A2AdaptivePhase5.vocabularyCount >= 3 || this.due().length === 0) A2AdaptivePhase5.finish('vocabulary','due');
      }
      return result;
    };
    const originalConversationRender = A2Conversation.render;
    A2Conversation.render = function() {
      const finished = this.scenario && this.step >= this.scenario.turns.length;
      const result = originalConversationRender.call(this);
      if (finished) A2AdaptivePhase5.finish('conversation',this.scenario.id);
      return result;
    };
    const originalExamRender = A2MockExam.render;
    A2MockExam.render = function() {
      const result = originalExamRender.call(this);
      const button = document.getElementById('examGrade');
      if (button) button.addEventListener('click', () => {
        if (button.disabled && this.task) A2AdaptivePhase5.finish('assessment',this.task.id);
      });
      return result;
    };
  },
  currentTask:null,
  vocabularyCount:0,
  launch(activity) {
    this.currentTask = {date:this.dateKey(),id:activity.id,kind:activity.studioKind,studioId:activity.studioId};
    this.vocabularyCount = 0;
    if (activity.studioKind === 'lesson') {CurriculumEngine.open('A2');CurriculumEngine.openLesson(activity.studioId);}
    else if (activity.studioKind === 'vocabulary') A2VocabularyEngine.open();
    else if (activity.studioKind === 'conversation') A2Conversation.open(activity.studioId);
    else if (activity.studioKind === 'assessment') A2MockExam.open(activity.studioId);
  },
  finish(kind,id) {
    const task = this.currentTask;
    if (!task || task.kind !== kind || task.studioId !== id || task.date !== this.dateKey()) return;
    const record = Dashboard.getDailyRecord();
    if (!record || !record.plan.activities.some(a => a.id === task.id)) return;
    record.completed ||= {};
    if (!record.completed[task.id]) {
      record.completed[task.id] = {resultId:`studio-${kind}-${id}-${Date.now()}`,completedAt:new Date().toISOString()};
      Dashboard.saveDailyRecord(record);
    }
    this.currentTask = null;
    Dashboard.activeActivity = null;
    Dashboard.plan = record.plan;
    Dashboard.open();
  }
};
A2AdaptivePhase5.install();
