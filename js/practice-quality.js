/* Conservative checks, not a guarantee that AI content is factually correct. */
const PracticeQuality = {
  KEY:'mijn_nederlands_question_reports_v1',
  inspect(q){
    if(!q || typeof q.prompt!=='string' || !q.prompt.trim())return 'Missing question text.';
    if(q.type==='multiple_choice'){
      const norm=x=>String(x).trim().toLowerCase();
      if(!Array.isArray(q.options)||q.options.length<2)return 'Missing answer options.';
      if(new Set(q.options.map(norm)).size!==q.options.length)return 'Duplicate answer options.';
      if(!q.options.some(x=>norm(x)===norm(q.expectedAnswer)))return 'Answer key does not match any option.';
      // Only a direct antecedent at the start: do not guess noun gender from arbitrary prose.
      const match=q.prompt.trim().match(/^(de|het)\s+[\p{L}-]+\s+_{2,}/iu);
      if(match && ['die','dat'].includes(norm(q.expectedAnswer)) && q.options.some(x=>norm(x)==='die') && q.options.some(x=>norm(x)==='dat')){
        const expected=match[1].toLowerCase()==='de'?'die':'dat';
        if(norm(q.expectedAnswer)!==expected)return 'The relative-pronoun key conflicts with the stated de/het article.';
      }
      const stated=String(q.explanation||'').match(/correct (?:relative )?pronoun is\s+['"“”‘’]?(die|dat)\b/i);
      if(stated && ['die','dat'].includes(norm(q.expectedAnswer)) && norm(stated[1])!==norm(q.expectedAnswer))return 'The explanation contradicts the answer key.';
    }
    return null;
  },
  report(ui,reason='Learner flagged the question or grading'){
    const q=ui.getCurrentExercise();if(!q)return;
    let reports;try{reports=JSON.parse(localStorage.getItem(this.KEY)||'[]');}catch{reports=[];}
    if(!Array.isArray(reports))reports=[];
    reports.push({exercise:q,reason,stage:ui.currentStage,sessionId:ui.currentSession?.id||null,reportedAt:new Date().toISOString()});
    try{localStorage.setItem(this.KEY,JSON.stringify(reports.slice(-100)));}
    catch{alert('Could not save the report. The question will still be skipped without penalty.');}
    // Results and spaced reviews are saved only at session completion. Remove a grade already shown.
    const i=ui.answers.findLastIndex(a=>a.exerciseId===q.id&&a.stage===ui.currentStage&&a.qualityQuestionIndex===ui.currentQuestionIndex);
    if(i>=0)ui.answers.splice(i,1);
    ui.nextQuestion();
  },
  mount(ui,blocked=null){
    const root=ui.getRoot();if(!root)return;
    root.querySelector('#practiceQuality')?.remove();
    const panel=document.createElement('div');panel.id='practiceQuality';panel.className='card curriculum-panel';
    const note=document.createElement('p');note.textContent=blocked?'Question withheld: '+blocked+' Skip it without affecting your score or mistake journal.':'Question or grading looks wrong? Report and skip it without affecting your score or mistake journal.';
    const button=document.createElement('button');button.type='button';button.textContent=blocked?'Skip invalid question':'Report and skip question';button.onclick=()=>this.report(ui,blocked||undefined);
    panel.append(note,button);root.appendChild(panel);
  },
  block(ui,q){
    const issue=this.inspect(q);if(!issue)return false;
    const root=ui.getRoot();if(root){root.innerHTML='<div class="practice-shell"><h2>Question needs review</h2></div>';this.mount(ui,issue);ui.showScreen();}return true;
  }
};
