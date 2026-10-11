/* Phase 6.4: evidence-preserving, additive feedback journal. No migrations or resets. */
const A2Phase64 = {
  KEY: 'mijn_nederlands_a2_mistake_journal_v1',
  maxEntries: 250,
  load() { try { const x=JSON.parse(localStorage.getItem(this.KEY)||'[]'); return Array.isArray(x)?x:[]; } catch(_) { return []; } },
  conceptFor(c) {
    const t=[c?.original,c?.suggested,c?.explanation].filter(x=>typeof x==='string').join(' ').toLowerCase();
    // Only match grammar-specific explanations; lexical examples alone are insufficient evidence.
    if (/subordinate.clause|bijzin|werkwoord.*eind|verb.*end of the (?:clause|sentence)|omdat.*(?:verb|werkwoord)|dat.*(?:verb|werkwoord)/.test(t)) return 'sentence_structure';
    if (/inversi|inversion|word.order|woordvolgorde|verb.*before.*subject|verb.*second.position|werkwoord.*tweede.positie|daarom.*(?:verb|werkwoord)/.test(t)) return 'word_order';
    if (/time.expression|tijdsaanduiding|tijdsuitdrukking|time.phrase/.test(t)) return 'time_expressions';
    if (/past.participle|voltooid.deelwoord/.test(t)) return 'past_participle';
    if (/perfect.tense|voltooide.tijd|hebben.of.zijn/.test(t)) return 'perfect_tense';
    if (/conjugat|werkwoordvervoeging|subject.verb.agreement/.test(t)) return 'verb_conjugation';
    if (/preposition|voorzetsel/.test(t)) return 'prepositions';
    if (/article|lidwoord|\bde\b.*\bhet\b/.test(t)) return 'articles';
    return null;
  },
  relatedTopic(concept) {
    const map={sentence_structure:'subordinate_clauses',word_order:'inversion',time_expressions:'time_expressions',past_participle:'past_participle',perfect_tense:'perfect_tense',verb_conjugation:'verb_conjugation',articles:'articles',prepositions:'prepositions'};
    const id=map[concept]||concept;
    return typeof CurriculumEngine!=='undefined' && CurriculumEngine.find(id) ? id : null;
  },
  register(session, feedback) {
    if (!session?.completedAt || !Array.isArray(feedback?.corrections)) return {registered:0,concepts:[],saved:0};
    const prior=this.load(); const seen=new Set(prior.map(x=>x.id)); const additions=[];
    feedback.corrections.forEach((c,i)=>{
      const original=String(c?.original||'').trim().slice(0,600), suggested=String(c?.suggested||'').trim().slice(0,600);
      if (!original || !suggested || original===suggested) return;
      const id=`${session.completedAt}:${session.scenario||'general'}:${i}`;
      if (seen.has(id)) return;
      const concept=this.conceptFor(c);
      additions.push({id,createdAt:session.completedAt,scenario:session.scenario||'general',original,suggested,explanation:String(c.explanation||'').slice(0,900),concept,topicId:concept?this.relatedTopic(concept):null,source:'speaking_ai_feedback',reviewed:false});
    });
    if (!additions.length) return {registered:0,concepts:[],saved:0};
    // Commit journal before updating review schedules; a failed storage write must not be disguised as success.
    try { localStorage.setItem(this.KEY,JSON.stringify([...prior,...additions].slice(-this.maxEntries))); }
    catch(e) { console.warn('A2 mistake journal could not be saved',e); return {registered:0,concepts:[],saved:0,error:'storage_unavailable'}; }
    let registered=0; const concepts=[...new Set(additions.map(x=>x.concept).filter(Boolean))];
    if (typeof SpacedReviewEngine!=='undefined' && concepts.length) {
      const result={id:`a2-speaking-${session.completedAt}-${session.scenario||'general'}`,answers:concepts.map(concept=>({correct:false,concepts:[concept]}))};
      try { registered=SpacedReviewEngine.registerMistakes(result); }
      catch(e) { console.warn('Review scheduling failed; journal is preserved',e); }
    }
    return {registered,concepts,saved:additions.length};
  },
  forTopic(topicId) { return this.load().filter(x=>x.topicId===topicId).slice(-3).reverse(); },
  escape(s) { return String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); },
  install() {
    if (this.installed) return; this.installed=true;
    // Wrap only the registration function; keep Phase 6.3 plan logic intact.
    if (typeof A2Phase63!=='undefined') A2Phase63.registerFeedback=(session,feedback)=>this.register(session,feedback);
    if (typeof CurriculumEngine!=='undefined') {
      const original=CurriculumEngine.openLesson;
      CurriculumEngine.openLesson=function(id) {
        original.call(this,id);
        const root=document.getElementById('curriculum');
        const target=root?.querySelector('#curriculumPractice');
        if(!target) return;
        const mistakes=A2Phase64.forTopic(id);
        if(!mistakes.length) return;
        const panel=document.createElement('div');panel.className='card curriculum-panel';
        panel.innerHTML='<h2>Review your own mistakes</h2><p>These examples come from previous AI feedback. Check the correction and try a new sentence.</p>'+mistakes.map(x=>`<details class="curriculum-mistake"><summary lang="nl">${A2Phase64.escape(x.original)}</summary><p lang="nl"><strong>Suggested:</strong> ${A2Phase64.escape(x.suggested)}</p><p>${A2Phase64.escape(x.explanation)}</p></details>`).join('');
        target.before(panel);
      };
    }
  }
};
A2Phase64.install();
