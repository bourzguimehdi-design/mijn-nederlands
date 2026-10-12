/* Phase 4B: non-destructive bridge between the existing planner and A2 Studio.
   Existing daily plans and stored progress are never migrated or rewritten. */
const A2DailyIntegration = {
  vocabularyCount: 0,
  currentTask: null,
  decorate(plan, date = new Date()) {
    if (!plan || !Array.isArray(plan.activities)) return plan;
    if (typeof CurriculumEngine === 'undefined' || typeof A2MockTasks === 'undefined') return plan;
    const next = CurriculumEngine.nextLesson('A2');
    const due = typeof A2VocabularyEngine !== 'undefined' ? A2VocabularyEngine.due(date).length : 0;
    const conversations = typeof A2Conversations !== 'undefined' ? A2Conversations : [];
    const tasks = A2MockTasks;
    const day = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86400000);
    const used = new Set();
    // Keep the adaptive/spaced-review concept slot untouched. Replace only skill slots.
    for (const activity of plan.activities) {
      if (activity.type === 'concept' || !activity.skill) continue;
      let candidate = null;
      if (next && !used.has('lesson') && activity.skill === 'grammar') {
        candidate = {type:'a2_studio', studioKind:'lesson', studioId:next.id, title:`A2 lesson: ${next.title}`, subtitle:'Structured A2 learning path', icon:'📘'};
      } else if (due > 0 && !used.has('vocabulary') && activity.skill === 'vocabulary') {
        candidate = {type:'a2_studio', studioKind:'vocabulary', studioId:'due', title:'A2 vocabulary review', subtitle:`${due} words due`, icon:'🧠'};
      } else if (activity.skill === 'reading' || activity.skill === 'listening') {
        const available = tasks.filter(t => t.skill === activity.skill);
        if (available.length && !used.has(activity.skill)) {
          const task = available[day % available.length];
          candidate = {type:'a2_studio', studioKind:'assessment', studioId:task.id, title:`A2 ${activity.skill}: ${task.title}`, subtitle:'Short A2 comprehension practice', icon:activity.icon};
        }
      } else if (activity.skill === 'speaking' && conversations.length && !used.has('conversation')) {
        const scenario = conversations[day % conversations.length];
        candidate = {type:'a2_studio', studioKind:'conversation', studioId:scenario.id, title:`A2 conversation: ${scenario.title}`, subtitle:'Guided roleplay (not AI graded)', icon:'💬'};
      }
      if (candidate) {
        used.add(candidate.studioKind === 'assessment' ? activity.skill : candidate.studioKind);
        Object.assign(activity, candidate, {source:'a2_studio', level:'A2'});
      }
    }
    // A new lesson deserves a slot even if grammar was not selected today.
    if (next && !used.has('lesson')) {
      const replacement = plan.activities.find(a => a.type === 'skill' && a.skill !== 'vocabulary');
      if (replacement) Object.assign(replacement, {type:'a2_studio', studioKind:'lesson', studioId:next.id, source:'a2_studio', level:'A2', title:`A2 lesson: ${next.title}`, subtitle:'Structured A2 learning path', icon:'📘'});
    }
    return plan;
  },
  launch(activity) {
    this.currentTask = {date:Dashboard.getTodayKey(), id:activity.id, kind:activity.studioKind, studioId:activity.studioId};
    this.vocabularyCount = 0;
    if (activity.studioKind === 'lesson') { CurriculumEngine.open('A2'); CurriculumEngine.openLesson(activity.studioId); }
    else if (activity.studioKind === 'vocabulary') A2VocabularyEngine.open();
    else if (activity.studioKind === 'conversation') A2Conversation.open(activity.studioId);
    else if (activity.studioKind === 'assessment') A2MockExam.open(activity.studioId);
  },
  finish(kind, id) {
    const task = this.currentTask;
    if (!task || task.kind !== kind || task.studioId !== id || task.date !== Dashboard.getTodayKey()) return;
    const record = Dashboard.getDailyRecord();
    if (!record || !record.plan.activities.some(a => a.id === task.id)) return;
    if (!record.completed) record.completed = {};
    if (!record.completed[task.id]) {
      record.completed[task.id] = {resultId:`studio-${kind}-${id}-${Date.now()}`, completedAt:new Date().toISOString()};
      Dashboard.saveDailyRecord(record);
    }
    this.currentTask = null;
    Dashboard.activeActivity = null;
  },
  install() {
    const originalPlan = StudyPlanEngine.createTodayPlan;
    StudyPlanEngine.createTodayPlan = function(...args) {
      const plan = originalPlan.apply(this,args);
      return A2DailyIntegration.decorate(plan, args[1] || new Date());
    };
    const originalStart = Dashboard.startActivity;
    Dashboard.startActivity = function(activity,index) {
      if (activity?.type === 'a2_studio') {this.activeActivity = activity; A2DailyIntegration.launch(activity); return;}
      A2DailyIntegration.currentTask = null;
      return originalStart.call(this,activity,index);
    };
    const originalCheck = CurriculumEngine.check;
    CurriculumEngine.check = function(id) {
      const result = originalCheck.call(this,id);
      const item = this.find(id);
      const progress = this.load()[id];
      if (item && progress?.lastScore === item.checks.length) A2DailyIntegration.finish('lesson',id);
      return result;
    };
    const originalGrade = A2VocabularyEngine.grade;
    A2VocabularyEngine.grade = function(id,correct,now) {
      const result = originalGrade.call(this,id,correct,now);
      if (A2DailyIntegration.currentTask?.kind === 'vocabulary') {
        A2DailyIntegration.vocabularyCount++;
        if (A2DailyIntegration.vocabularyCount >= 3 || this.due().length === 0) A2DailyIntegration.finish('vocabulary','due');
      }
      return result;
    };
    // These activities persist their own results before rendering completion.
    const originalConversationRender = A2Conversation.render;
    A2Conversation.render = function() {
      const finished = this.scenario && this.step >= this.scenario.turns.length;
      const result = originalConversationRender.call(this);
      if (finished) A2DailyIntegration.finish('conversation',this.scenario.id);
      return result;
    };
    const originalExamRender = A2MockExam.render;
    A2MockExam.render = function() {
      const result = originalExamRender.call(this);
      const button = document.getElementById('examGrade');
      if (button) button.addEventListener('click', () => {
        if (button.disabled && this.task) A2DailyIntegration.finish('assessment',this.task.id);
      });
      return result;
    };
  }
};
A2DailyIntegration.install();
