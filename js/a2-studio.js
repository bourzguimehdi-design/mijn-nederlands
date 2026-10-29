
const A2Studio = {
 esc(value) {return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));},
 open() {if(typeof hideAllSections==='function')hideAllSections();const r=document.getElementById('a2Studio');r.classList.remove('hidden');window.scrollTo(0,0);},
 render() {
   this.open();const root=document.getElementById('a2StudioContent');
   const status=CurriculumEngine.getLearningStatus('A2');
   const due=A2VocabularyEngine.due().length;
   const vocabulary=A2VocabularyEngine.stats();
   let exams=[];try{exams=JSON.parse(localStorage.getItem(A2MockExam.KEY)||'[]');if(!Array.isArray(exams))exams=[];}catch{}
   root.innerHTML='<button id="studioBack">← Dashboard</button><h1>A2 Learning Studio</h1><p>Continue structured lessons, recall vocabulary, practise real-life conversations, and check reading/listening skills.</p>'+
    '<div class="card curriculum-panel"><h2>Your next lesson</h2><p>'+this.esc(status.nextTitle||'All A2 checks passed')+'</p><button class="primary" id="studioLesson">Continue A2 lesson →</button></div>'+
    '<div class="card curriculum-panel"><h2>A2 learning progress</h2><p>'+status.passed+' of '+status.total+' A2 lesson checks passed.</p><p>Your practice targets A2. Short lesson checks, assessed application and long-term retention are tracked separately.</p></div>'+
    '<div class="card curriculum-panel"><h2>Vocabulary review</h2><p>'+vocabulary.reviewedToday+' reviewed today · '+vocabulary.reviewsDue+' reviews due · '+vocabulary.newWords+' new words</p><p>'+vocabulary.scheduled+' scheduled for later. Daily target: '+A2VocabularyEngine.dailyTarget+' words.</p><button class="primary" id="studioVocab">Review vocabulary →</button></div>'+
    '<div class="card curriculum-panel"><h2>Guided conversations</h2><p>Multi-turn roleplay with Dutch prompts and listening. These are guided scenarios, not open-ended AI chat.</p><div id="studioChats"></div><button class="curriculum-topic" id="studioWordGuess">Raad het woord · A2 guessing game →</button></div>'+
    '<div class="card curriculum-panel"><h2>A2-style reading and listening</h2><p>Short practice samplers, not validated official exams. '+exams.length+' completed attempts.</p><div id="studioExams"></div></div>'+
    '<div class="card curriculum-panel"><h2>Exam preparation and Dutch society</h2><p>Short timed mocks for all four language skills, plus introductory KNM topics.</p><button id="studioExamHub" class="primary">A2 exam practice →</button><button id="studioKNM">Dutch society topics →</button></div>'+
    '<div class="card curriculum-panel"><h2>Your progress backup</h2><p>Download your learning history or restore a previous backup.</p><button id="studioBackup">Backup and restore →</button></div>'+
    '<div class="card curriculum-panel"><h2>Writing and speaking</h2><p>Use the existing AI-evaluated writing and speaking assessments in the app. This studio does not change those assessment results.</p><button id="studioDashboard">Open dashboard →</button></div>';
   root.querySelector('#studioExamHub').onclick=()=>A2ExamPractice.open();
   root.querySelector('#studioKNM').onclick=()=>A2ExamPractice.knm();
   root.querySelector('#studioBackup').onclick=()=>ProgressBackup.open();
   root.querySelector('#studioBack').onclick=()=>Dashboard.open();
   root.querySelector('#studioDashboard').onclick=()=>Dashboard.open();
   root.querySelector('#studioLesson').onclick=()=>CurriculumEngine.openNext('A2');
   root.querySelector('#studioVocab').onclick=()=>A2VocabularyEngine.open();
   root.querySelector('#studioWordGuess').onclick=()=>A2WordGuess.open();
   root.querySelector('#studioChats').innerHTML=A2Conversations.map(s=>'<button class="curriculum-topic" data-scenario="'+this.esc(s.id)+'">'+this.esc(s.title)+' →</button>').join('');
   root.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=()=>A2Conversation.open(b.dataset.scenario));
   root.querySelector('#studioExams').innerHTML=A2MockTasks.map(t=>'<button class="curriculum-topic" data-exam="'+this.esc(t.id)+'">'+this.esc(t.skill)+' · '+this.esc(t.title)+' →</button>').join('');
   root.querySelectorAll('[data-exam]').forEach(b=>b.onclick=()=>A2MockExam.open(b.dataset.exam));
 }
};
