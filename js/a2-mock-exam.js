
/* Small A2-style practice sampler, not an official or calibrated mock exam. */
const A2MockExam = {
 KEY:'mijn_nederlands_a2_mock_v1',task:null,answers:[],
 open(id) { this.task=A2MockTasks.find(t=>t.id===id);if(!this.task)return;this.answers=[];A2Studio.open();this.render(); },
 render() {
   const root=document.getElementById('a2StudioContent'),t=this.task;
   root.innerHTML='<button id="examBack">← A2 Studio</button><div class="skill-label">A2-STYLE '+A2Studio.esc(t.skill.toUpperCase())+' PRACTICE</div><h2>'+A2Studio.esc(t.title)+'</h2>'+
    (t.skill==='reading'?'<div class="card curriculum-panel" lang="nl">'+A2Studio.esc(t.passage)+'</div>':'<p>Listen to the Dutch audio, then answer the questions.</p><button class="primary" id="examListen">🔊 Play Dutch</button>')+
    t.questions.map((q,i)=>'<fieldset class="card curriculum-panel"><legend>'+(i+1)+'. '+A2Studio.esc(q.q)+'</legend>'+q.options.map((o,j)=>'<label style="display:block;padding:6px"><input type="radio" name="eq'+i+'" value="'+j+'"> '+A2Studio.esc(o)+'</label>').join('')+'</fieldset>').join('')+
    '<button class="primary" id="examGrade">Check answers</button><div id="examFeedback" aria-live="polite"></div>';
   root.querySelector('#examBack').onclick=()=>A2Studio.render();
   if(t.skill==='listening')root.querySelector('#examListen').onclick=()=>{
     if(!('speechSynthesis' in window)){root.querySelector('#examFeedback').textContent='Speech playback is unavailable in this browser.';return;}
     window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.passage);u.lang='nl-NL';u.rate=.88;window.speechSynthesis.speak(u);
   };
   root.querySelector('#examGrade').onclick=()=>{
     const responses=t.questions.map((q,i)=>root.querySelector('input[name="eq'+i+'"]:checked')?.value);
     if(responses.some(v=>v===undefined)){root.querySelector('#examFeedback').textContent='Answer every question first.';return;}
     const score=responses.filter((v,i)=>Number(v)===t.questions[i].answer).length;
     let history=[];try{history=JSON.parse(localStorage.getItem(this.KEY)||'[]');if(!Array.isArray(history))history=[];}catch{}
     history.push({id:t.id,skill:t.skill,score,total:t.questions.length,completedAt:new Date().toISOString()});
     localStorage.setItem(this.KEY,JSON.stringify(history.slice(-100)));
     root.querySelector('#examFeedback').innerHTML='<div class="card curriculum-panel"><h3>'+score+'/'+t.questions.length+' correct</h3><p>Saved as A2-style practice. This is not an official CEFR score.</p></div>';
     root.querySelector('#examGrade').disabled=true;
   };
 }
};
