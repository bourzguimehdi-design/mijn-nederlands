/* Short timed mocks and KNM foundations, separate from mastery and official results. */
const A2ExamPractice = {
  KEY:'mijn_nederlands_exam_practice_v1',KNM_KEY:'mijn_nederlands_knm_v1',run:null,timer:null,recording:false,
  esc(x){return A2Studio.esc(x);},
  read(key=this.KEY){try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[];}catch{return [];}},
  stop(){
    clearInterval(this.timer);this.timer=null;this.run=null;
    if(window.speechSynthesis)window.speechSynthesis.cancel();
    if(this.recording){this.recording=false;SpeakingRecorder.stop().catch(()=>{});}
  },
  open(){
    this.stop();A2Studio.open();const root=document.getElementById('a2StudioContent'),history=this.read();
    root.innerHTML='<button id="examHubBack">← A2 Studio</button><h1>A2 exam practice</h1><p>Original short mocks for focused practice. These are not full-length DUO exams and do not award official results or curriculum mastery.</p><div class="card curriculum-panel"><h2>Choose a short mock</h2>'+[['reading','Reading · 6 questions · 12 min'],['listening','Listening · 6 questions · 12 min'],['writing','Writing · 4 tasks · 20 min'],['speaking','Speaking · 6 tasks · 12 min'],['knm','KNM foundations · 15 questions · 15 min']].map(([id,title])=>'<button class="curriculum-topic" data-short-exam="'+id+'">'+title+' →</button>').join('')+'</div><div class="card curriculum-panel"><h2>Official exam orientation</h2><p>DUO lists these full exam times: '+A2ExamContent.officialFormats.map(([s,m])=>s+' '+m+' min').join(' · ')+'. A2 writing is on paper; practising typed answers here is preparation, not a replica.</p><a href="'+A2ExamContent.officialPractice+'" target="_blank" rel="noopener">Open official DUO practice exams</a><p>Check which requirements apply to you with DUO/IND. This app does not determine your eligibility.</p></div><h2>Your practice attempts</h2>'+(history.length?history.slice(-10).reverse().map(r=>'<button class="curriculum-topic" data-attempt="'+this.esc(r.id)+'">'+this.esc(r.kind)+' · '+this.esc(r.completedAt.slice(0,10))+' · '+(r.score===null?'submitted; self-review':r.score+'/'+r.total)+' →</button>').join(''):'<p>No short mock attempts yet.</p>');
    root.querySelector('#examHubBack').onclick=()=>A2Studio.render();
    root.querySelectorAll('[data-short-exam]').forEach(b=>b.onclick=()=>this.start(b.dataset.shortExam));
    root.querySelectorAll('[data-attempt]').forEach(b=>b.onclick=()=>this.results(history.find(r=>r.id===b.dataset.attempt)));
  },
  questions(kind){return kind==='knm'?KNMLessons.flatMap(l=>l.questions.map(q=>({...q,topic:'knm-'+l.id}))):A2ExamContent[kind];},
  start(kind){
    this.stop();const items=this.questions(kind);if(!Array.isArray(items))return;
    const minutes=kind==='writing'?20:kind==='knm'?15:12;
    this.run={id:'short-'+Date.now(),kind,items,deadline:Date.now()+minutes*60000,startedAt:new Date().toISOString()};
    A2Studio.open();const root=document.getElementById('a2StudioContent');
    const choices=kind==='reading'||kind==='listening'||kind==='knm';
    root.innerHTML='<button id="shortBack">← Exit mock</button><h1>'+this.esc(kind)+' · short mock</h1><p id="examClock" role="timer"></p><p>'+(choices?'Answers and explanations appear after submission. Unanswered questions count as incorrect.':'Answers are saved for self-review with model examples and optional AI feedback. No automatic official score.')+'</p>'+items.map((q,i)=>'<section class="card curriculum-panel">'+(kind==='reading'?'<p lang="nl">'+this.esc(q.text)+'</p>':kind==='listening'?'<button type="button" data-audio="'+i+'">🔊 Listen</button>':'')+'<h2 style="font-size:1.15rem" lang="nl">'+(i+1)+'. '+this.esc(q.q)+'</h2>'+(choices?q.options.map((o,j)=>'<label style="display:block;padding:8px"><input type="radio" name="short'+i+'" value="'+j+'"> '+this.esc(o)+'</label>').join(''):'<textarea data-response="'+i+'" aria-label="Answer '+(i+1)+'" rows="4" style="width:100%;box-sizing:border-box"></textarea>'+(kind==='speaking'?'<button data-record="'+i+'" type="button">🎤 Record answer</button>':''))+'</section>').join('')+'<p id="shortStatus" role="status"></p><button class="primary" id="shortSubmit">Finish and review</button>';
    root.querySelector('#shortBack').onclick=()=>{if(confirm('Exit this mock? Unsubmitted answers will not be saved.'))this.open();};
    root.querySelector('#shortSubmit').onclick=()=>{if(!choices||items.every((q,i)=>root.querySelector('input[name="short'+i+'"]:checked'))||confirm('Some questions are unanswered. Submit anyway?'))this.finish(false);};
    root.querySelectorAll('[data-audio]').forEach(b=>b.onclick=()=>{
      if(!window.speechSynthesis){root.querySelector('#shortStatus').textContent='Dutch audio is unavailable. Exit this mock and try a browser with speech playback.';return;}
      A2Conversation.say(items[Number(b.dataset.audio)].text);
    });
    root.querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>this.recordAnswer(b));
    const run=this.run;this.tick();this.timer=setInterval(()=>{const section=document.getElementById('a2Studio');if(this.run!==run||!root.querySelector('#examClock')||section?.classList?.contains('hidden'))this.stop();else this.tick();},1000);
  },
  tick(){
    if(!this.run)return;const seconds=Math.max(0,Math.ceil((this.run.deadline-Date.now())/1000));
    const node=document.getElementById('examClock');if(node)node.textContent='Time left: '+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
    if(!seconds)this.finish(true);
  },
  async recordAnswer(button){
    const run=this.run,root=document.getElementById('a2StudioContent'),field=root.querySelector('[data-response="'+button.dataset.record+'"]'),status=root.querySelector('#shortStatus');
    if(this.recording && this.recording!==button){status.textContent='Stop the current recording first.';return;}
    if(this.recording===button){
      this.recording=false;button.disabled=true;button.textContent='Transcribing…';
      try{const audio=await SpeakingRecorder.stop();const result=await MijnNederlandsAPI.transcribeSpeaking(audio);if(this.run!==run)return;
        const text=String(result.transcript||result.transcription||result.text||'').trim();if(!text)throw Error('No speech recognized. Try again or type.');
        field.value=text;status.textContent='Review and edit the transcription before finishing the mock.';
      }catch(e){if(this.run===run)status.textContent=e.message;}finally{button.disabled=false;button.textContent='🎤 Record answer';}
    }else{
      button.disabled=true;
      try{await SpeakingRecorder.start();if(this.run!==run){await SpeakingRecorder.stop();return;}this.recording=button;button.textContent='⏹ Stop recording';status.textContent='Recording Dutch…';}
      catch(e){status.textContent=e.message;}finally{button.disabled=false;}
    }
  },
  finish(expired=false){
    const run=this.run;if(!run)return;const root=document.getElementById('a2StudioContent'),choices=['reading','listening','knm'].includes(run.kind);
    const responses=run.items.map((q,i)=>choices?(root.querySelector('input[name="short'+i+'"]:checked')?.value??null):(root.querySelector('[data-response="'+i+'"]')?.value.trim()||''));
    const result={id:run.id,kind:run.kind,items:run.items,responses,total:run.items.length,score:choices?responses.filter((a,i)=>a!==null&&Number(a)===run.items[i].answer).length:null,startedAt:run.startedAt,completedAt:new Date().toISOString(),expired,aiFeedback:{}};
    try{const history=this.read();history.push(result);localStorage.setItem(this.KEY,JSON.stringify(history.slice(-100)));}
    catch(e){alert('Could not save the attempt. Results are still shown; export/copy important answers before leaving.');}
    this.stop();this.results(result);
  },
  results(result){
    if(!result)return;this.stop();A2Studio.open();const root=document.getElementById('a2StudioContent');
    root.innerHTML='<button id="resultBack">← Exam practice</button><h1>Practice results</h1><p>'+(result.score===null?'Answers submitted · self-review, not a pass/fail result':result.score+'/'+result.total+' correct')+(result.expired?' · Time expired':'')+'</p><p>Saved practice is separate from curriculum mastery and official exam results.</p>'+result.items.map((q,i)=>'<section class="card curriculum-panel"><h2 style="font-size:1.15rem">'+(i+1)+'. '+this.esc(q.q)+'</h2><p><strong>Your answer:</strong> '+this.esc(result.score===null?result.responses[i]||'(not answered)':result.responses[i]===null?'(not answered)':q.options[Number(result.responses[i])])+'</p>'+(q.options?'<p><strong>Answer:</strong> '+this.esc(q.options[q.answer])+'</p><p>'+this.esc(q.why)+'</p>'+(q.text?'<details><summary>Read the text/transcript</summary><p lang="nl">'+this.esc(q.text)+'</p></details>':''):'<details><summary>Model example and checklist</summary><p lang="nl">'+this.esc(q.model)+'</p><ul>'+q.checks.map(c=>'<li>'+this.esc(c)+'</li>').join('')+'</ul><p>Other correct answers are possible. For speaking, text review cannot judge pronunciation.</p></details><button data-exam-ai="'+i+'"'+(!result.responses[i]?' disabled':'')+'>Get AI text feedback</button><p id="examAI'+i+'" role="status">'+this.esc(result.aiFeedback?.[i]||'')+'</p>')+'<button data-review-topic="'+this.esc(q.topic||'')+'">Review related lesson →</button></section>').join('');
    root.querySelector('#resultBack').onclick=()=>this.open();
    root.querySelectorAll('[data-review-topic]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.reviewTopic;
      if(id.startsWith('knm-'))return this.lesson(id.slice(4));
      CurriculumEngine.open('A2');if(CurriculumEngine.find(id))CurriculumEngine.openLesson(id);
    });
    root.querySelectorAll('[data-exam-ai]').forEach(b=>b.onclick=async()=>{
      const i=Number(b.dataset.examAi),q=result.items[i],node=root.querySelector('#examAI'+i);b.disabled=true;node.textContent='Getting text feedback…';
      try{const response=await MijnNederlandsAPI.evaluatePracticeAnswer({level:'A2',practiceType:'skill',skill:result.kind},{prompt:q.q,context:'This is original A2 practice. Model is an example, not the only correct wording. Requirements: '+q.checks.join(' '),expectedAnswer:q.model},result.responses[i]);
        const e=response.evaluation;if(!e||typeof e!=='object')throw Error('Feedback unavailable.');
        const message=[e.feedback,e.correction,e.explanation].filter(x=>typeof x==='string'&&x.trim()).join(' ');if(!message)throw Error('No text feedback returned.');
        node.textContent=message;result.aiFeedback ||= {};result.aiFeedback[i]=message;
        const history=this.read(),index=history.findIndex(x=>x.id===result.id);if(index>=0){history[index]=result;localStorage.setItem(this.KEY,JSON.stringify(history));}
      }catch(e){node.textContent=e.message;}finally{b.disabled=false;}
    });
  },
  knm(){
    this.stop();A2Studio.open();const root=document.getElementById('a2StudioContent'),history=this.read(this.KNM_KEY);
    root.innerHTML='<button id="knmBack">← A2 Studio</button><h1>Dutch society · KNM foundations</h1><p>Five introductory themes with practical language and knowledge checks. This is a starting collection, not complete KNM syllabus coverage. Sources checked 29 October 2026.</p>'+KNMLessons.map(l=>'<button class="curriculum-topic" data-knm="'+l.id+'">'+this.esc(l.title)+' · '+(history.some(r=>r.id===l.id)?'practised':'not practised')+' →</button>').join('')+'<button class="primary" id="knmMock">Try the KNM short mock →</button>';
    root.querySelector('#knmBack').onclick=()=>A2Studio.render();root.querySelector('#knmMock').onclick=()=>this.start('knm');root.querySelectorAll('[data-knm]').forEach(b=>b.onclick=()=>this.lesson(b.dataset.knm));
  },
  lesson(id){
    this.stop();const l=KNMLessons.find(x=>x.id===id);if(!l)return;A2Studio.open();const root=document.getElementById('a2StudioContent');
    root.innerHTML='<button id="knmList">← Society topics</button><h1>'+this.esc(l.title)+'</h1><div class="card curriculum-panel"><p>'+this.esc(l.text)+'</p><p lang="nl"><strong>'+this.esc(l.example)+'</strong></p><a href="'+l.source+'" target="_blank" rel="noopener">Read the source</a></div>'+l.questions.map((q,i)=>'<fieldset class="card curriculum-panel"><legend>'+this.esc(q.q)+'</legend>'+q.options.map((o,j)=>'<label style="display:block;padding:8px"><input type="radio" name="knm'+i+'" value="'+j+'"> '+this.esc(o)+'</label>').join('')+'</fieldset>').join('')+'<button class="primary" id="knmCheck">Check understanding</button><div id="knmFeedback" role="status"></div>';
    root.querySelector('#knmList').onclick=()=>this.knm();root.querySelector('#knmCheck').onclick=()=>{
      const values=l.questions.map((q,i)=>root.querySelector('input[name="knm'+i+'"]:checked')?.value),feedback=root.querySelector('#knmFeedback');
      if(values.some(v=>v===undefined)){feedback.textContent='Answer every question first.';return;}
      const score=values.filter((v,i)=>Number(v)===l.questions[i].answer).length,history=this.read(this.KNM_KEY);history.push({id:l.id,score,total:l.questions.length,completedAt:new Date().toISOString()});
      try{localStorage.setItem(this.KNM_KEY,JSON.stringify(history.slice(-200)));feedback.innerHTML='<h2>'+score+'/'+l.questions.length+'</h2>'+l.questions.map(q=>'<p>'+this.esc(q.why)+'</p>').join('');root.querySelector('#knmCheck').disabled=true;}catch{feedback.textContent='Could not save this check. Your prior history is unchanged.';}
    };
  }
};
