/* Phase 6.3: conservative speaking-feedback -> spaced-review -> daily-plan bridge.
   Additive only. Does not rewrite completed activities or reset learner data. */
const A2Phase63 = {
  version: 1,
  conceptFor(correction) {
    const text = [correction?.original, correction?.suggested, correction?.explanation]
      .filter(x => typeof x === 'string').join(' ').toLowerCase();
    if (!text.trim()) return null;
    if (/\b(daarom|inversie|inversion|word order|woordvolgorde|verb before the subject|werkwoord voor het onderwerp)\b/.test(text)) return 'word_order';
    if (/\b(past participle|voltooid deelwoord|perfect tense|voltooide tijd|hebben or zijn|hebben of zijn)\b/.test(text)) return 'perfect_tense';
    if (/\b(verb conjugation|werkwoordvervoeging|conjugat)/.test(text)) return 'verb_conjugation';
    if (/\b(adjective ending|bijvoeglijk naamwoord|adjectiv)/.test(text)) return 'adjective_endings';
    if (/\b(preposition|voorzetsel)/.test(text)) return 'prepositions';
    return null; // Avoid inventing a grammar diagnosis for ambiguous suggestions.
  },
  registerFeedback(session, feedback) {
    if (!session?.completedAt || !Array.isArray(feedback?.corrections) || typeof SpacedReviewEngine === 'undefined') return {registered:0, concepts:[]};
    const answers = feedback.corrections.map(c => ({
      correct: false,
      concepts: this.conceptFor(c) ? [this.conceptFor(c)] : []
    })).filter(a => a.concepts.length);
    if (!answers.length) return {registered:0,concepts:[]};
    const result = {id:`a2-speaking-${session.completedAt}-${session.scenario || 'general'}`,answers};
    const registered = SpacedReviewEngine.registerMistakes(result);
    return {registered,concepts:[...new Set(answers.flatMap(a=>a.concepts))]};
  },
  adapt(plan, completed = {}) {
    if (!Array.isArray(plan?.activities)) return plan;
    const slots = plan.activities;
    const next = typeof CurriculumEngine !== 'undefined' ? CurriculumEngine.nextLesson('A2') : null;
    if (next && !slots.some(a=>!completed[a.id] && a.studioKind==='lesson')) {
      const slot=slots.find(a=>!completed[a.id] && a.type!=='concept' && a.skill!=='vocabulary');
      if (slot) Object.assign(slot,{type:'a2_studio',source:'a2_studio',studioKind:'lesson',studioId:next.id,skill:'grammar',title:`New lesson: ${next.title}`,subtitle:'A2 curriculum · guided lesson and topic check',level:'A2'});
    }
    const due = typeof SpacedReviewEngine !== 'undefined' ? SpacedReviewEngine.getDueReviews() : [];
    if (due.length && !slots.some(a=>!completed[a.id] && a.type==='concept' && a.concept===due[0].concept)) {
      const slot=slots.find(a=>!completed[a.id] && a.type==='skill' && a.skill!=='vocabulary' && !a.studioKind);
      if (slot) Object.assign(slot,{type:'concept',source:'spaced_review',concept:due[0].concept,skill:'grammar',title:`Review: ${due[0].concept.replace(/_/g,' ')}`,subtitle:'Due spaced review · based on previous mistakes',level:'A2'});
    }
    return plan;
  },
  install() {
    if (this.installed) return;
    this.installed=true;
    const original=A2Phase61.normalize;
    A2Phase61.normalize=function(plan,completed){
      return A2Phase63.adapt(original.call(this,plan,completed),completed);
    };
    // Existing saved plans are only reconciled once, and completed slots are immutable.
    const open=Dashboard.open;
    Dashboard.open=function(...args){
      const record=this.getDailyRecord();
      if(record?.plan && record.phase63Version!==A2Phase63.version){
        A2Phase63.adapt(record.plan,record.completed||{});
        record.phase63Version=A2Phase63.version;
        this.saveDailyRecord(record);
      }
      return open.apply(this,args);
    };
  }
};
A2Phase63.install();
