/* Phase 6: adaptive Worker conversation. The original scripted scenarios remain available as fallback. */
const A2AIConversation = {
  scenario:null,history:[],turn:0,busy:false,recording:null,mode:'guided',maxTurns:8,
  esc(s){return A2Studio.esc(s);},
  async open(id){
    this.scenario=A2Conversations.find(s=>s.id===id)||{id,title:id};
    this.history=[];this.turn=0;this.busy=false;this.maxTurns=8;
    A2Studio.open();
    await this.next('');
  },
  async next(answer){
    if(this.busy)return;
    this.busy=true;
    const root=document.getElementById('a2StudioContent');
    if(answer)this.history.push({role:'learner',text:answer});
    root.innerHTML=`<button id="aiChatBack">← A2 Learning Studio</button><div class="skill-label">A2 · AI CONVERSATION</div><h1>${this.esc(this.scenario.title)}</h1><div class="card curriculum-panel"><p id="aiChatStatus" aria-live="polite">Preparing your next conversation turn…</p></div>`;
    root.querySelector('#aiChatBack').onclick=()=>A2Studio.render();
    try{
      const response=await fetch(`${MijnNederlandsAPI.baseURL}/a2/conversation/turn`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario:this.scenario.title,history:answer?this.history.slice(0,-1):this.history,response:answer,turn:this.turn,maxTurns:this.maxTurns})});
      const data=await response.json();if(!response.ok||data.status!=='success')throw Error(data.error||'Worker unavailable');
      const t=data.turn;this.history.push({role:'tutor',text:t.dutch});this.turn++;
      this.render(t);
    }catch(e){
      root.querySelector('#aiChatStatus').textContent=`The AI conversation could not load (${e.message}). Your previous responses are preserved in this session.`;
      const retry=document.createElement('button');retry.textContent='Retry';retry.onclick=()=>{if(answer)this.history.pop();this.busy=false;this.next(answer)};
      const fallback=document.createElement('button');fallback.textContent='Use guided conversation instead';fallback.onclick=()=>A2Conversation.open(this.scenario.id);
      root.append(retry,fallback);
    }finally{this.busy=false;}
  },
  render(t){
    const root=document.getElementById('a2StudioContent');
    const finished=t.finished||this.turn>=this.maxTurns;
    root.innerHTML=`<button id="aiChatBack">← A2 Learning Studio</button><div class="skill-label">A2 · LIVE ROLEPLAY · TURN ${this.turn} / ${this.maxTurns}</div><h1>${this.esc(this.scenario.title)}</h1><div class="card curriculum-panel"><p lang="nl" class="a2-dialogue">${this.esc(t.dutch)}</p><button id="aiChatListen">🔊 Listen</button>${t.correction?`<p><strong>Correction:</strong> ${this.esc(t.correction)}</p>`:''}${t.explanation?`<p>${this.esc(t.explanation)}</p>`:''}<p class="small">${this.esc(t.hint)}</p>${finished?'<p>Conversation completed. Great practice!</p><button class="primary" id="aiChatFinish">Finish conversation</button>':'<label for="aiChatInput">Your reply in Dutch</label><textarea id="aiChatInput" rows="5" style="display:block;width:100%;box-sizing:border-box;min-height:125px;margin:12px 0" placeholder="Answer naturally in Dutch"></textarea><div class="a2-actions"><button id="aiChatMic">🎤 Record response</button><button class="primary" id="aiChatSend">Send and get follow-up →</button></div><p id="aiChatError" aria-live="polite"></p>'}<div class="a2-actions"><button id="aiChatEnd">End conversation & view feedback</button>${!finished?'<button id="aiChatExtend">Extended mode · up to 12 turns</button>':''}</div><details style="margin-top:18px"><summary>Conversation history (${this.history.length} messages)</summary><div id="aiChatHistory">${this.history.map(h=>`<p><strong>${h.role==='learner'?'You':'Tutor'}:</strong> ${this.esc(h.text)}</p>`).join('')}</div></details></div>`;
    root.querySelector('#aiChatBack').onclick=()=>A2Studio.render();
    root.querySelector('#aiChatListen').onclick=()=>A2Conversation.say(t.dutch);
    root.querySelector('#aiChatEnd').onclick=()=>this.finish();
    const extend=root.querySelector('#aiChatExtend');
    if(extend)extend.onclick=()=>{this.maxTurns=12;this.render(t);};
    if(finished){root.querySelector('#aiChatFinish').onclick=()=>this.finish();return;}
    const input=root.querySelector('#aiChatInput');
    root.querySelector('#aiChatSend').onclick=()=>{const answer=input.value.trim();if(answer.length<3){root.querySelector('#aiChatError').textContent='Please enter a Dutch response.';return;}this.next(answer)};
    root.querySelector('#aiChatMic').onclick=async()=>{
      const button=root.querySelector('#aiChatMic');const error=root.querySelector('#aiChatError');
      try{
        if(!this.recording){if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error('Microphone recording is not supported in this browser.');
          const stream=await navigator.mediaDevices.getUserMedia({audio:true});const chunks=[];const rec=new MediaRecorder(stream);this.recording={rec,stream,chunks};rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.start();button.textContent='⏹ Stop and transcribe';error.textContent='Recording…';
        }else{
          const {rec,stream,chunks}=this.recording;this.recording=null;button.disabled=true;button.textContent='Transcribing…';
          rec.onstop=async()=>{stream.getTracks().forEach(track=>track.stop());try{const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});const result=await MijnNederlandsAPI.transcribeSpeaking(blob);input.value=result.transcript||'';error.textContent=input.value?'Check your transcript, then send.':'No speech detected. Try again.';}catch(e){error.textContent=e.message}finally{button.disabled=false;button.textContent='🎤 Record response'}};rec.stop();
        }
      }catch(e){error.textContent=e.message;button.disabled=false;button.textContent='🎤 Record response'}
    };
  },
  cleanFeedback(feedback, history) {
    const learner = (history || []).filter(h => h.role === 'learner').map(h => String(h.text || ''));
    const normalize = value => String(value || '').normalize('NFC').toLocaleLowerCase('nl')
      .replace(/[.,!?;:“”"'‘’\u2010-\u2015]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterances = learner.map(normalize).filter(Boolean);
    const corrections = Array.isArray(feedback?.corrections) ? feedback.corrections : [];
    const seen = new Set();
    const valid = corrections.filter(c => {
      const original = normalize(c?.original), suggested = normalize(c?.suggested);
      if (!original || !suggested || original === suggested) return false;
      if (!utterances.some(u => u === original || u.includes(original))) return false;
      const key = original + '|' + suggested;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 4);
    return {...feedback, corrections: valid};
  },
  // Optional generated A2 practice, separate from curriculum mastery and Daily Plan.
  async practiseFeedback(session) {
    if (!session?.feedback || typeof PracticeUI === 'undefined') return;
    const feedback=session.feedback;
    const corrections=Array.isArray(feedback.corrections) ? feedback.corrections.slice(0,3) : [];
    const suggestions=Array.isArray(feedback.nextPractice) ? feedback.nextPractice.slice(0,3) : [];
    const concepts=corrections.map(c => {
      const category=typeof A2Phase64 !== 'undefined' ? A2Phase64.conceptFor(c) : null;
      return {category, original:String(c.original||'').slice(0,200), suggested:String(c.suggested||'').slice(0,200), explanation:String(c.explanation||'').slice(0,250)};
    });
    if (!concepts.length && !suggestions.length) return;
    const targets=concepts.map(c => [c.category||'Dutch A2 grammar', c.explanation, 'Learner wrote: '+c.original, 'Correction: '+c.suggested].join('. '));
    const concept=[
      'Personalized Dutch CEFR A2 follow-up lesson after a speaking conversation.',
      'Teach the grammar behind these errors, then generate new guided exercises and feedback.',
      'Use NEW everyday contexts and sentences, not copies of the conversation.',
      'Targets: '+targets.concat(suggestions.map(String)).join(' | ').slice(0,1100)
    ].join(' ');
    const btn=document.getElementById('a2PractiseFeedback');
    if(btn){btn.disabled=true;btn.textContent='Preparing your A2 lesson…';}
    try {
      await PracticeUI.startFromActivity({
        type:'concept',source:'a2_speaking_followup',level:'A2',
        minutes:12,concept,title:'Personalized A2 review from speaking'
      });
    } catch(e) {
      if(btn){btn.disabled=false;btn.textContent='Practise my mistakes now';}
      const status=document.getElementById('a2FollowupError');
      if(status)status.textContent='Could not generate your lesson: '+e.message;
    }
  },
  async finish(){
    if(this.busy)return;
    if(this.recording){try{this.recording.rec.stop();this.recording.stream.getTracks().forEach(t=>t.stop())}catch(_){}this.recording=null;}
    this.busy=true;
    const root=document.getElementById('a2StudioContent');
    const count=this.history.filter(h=>h.role==='learner').length;
    const session={scenario:this.scenario.id,completedAt:new Date().toISOString(),history:this.history.map(h=>({...h})),learnerTurns:count};
    const key='mijn_nederlands_a2_ai_conversations_v1';
    try{const old=JSON.parse(localStorage.getItem(key)||'[]');old.push(session);localStorage.setItem(key,JSON.stringify(old.slice(-80)));}catch(e){console.warn('Could not save conversation',e)}
    root.innerHTML=`<button id="aiChatBack">← A2 Learning Studio</button><div class="skill-label">A2 · SPEAKING FEEDBACK</div><h1>${this.esc(this.scenario.title)}</h1><div class="card curriculum-panel"><p role="status" id="a2FeedbackLoading">Analysing your ${count} Dutch responses…</p></div>`;
    root.querySelector('#aiChatBack').onclick=()=>A2Studio.render();
    let feedback=null,error='';
    if(count){
      try{
        const response=await fetch(`${MijnNederlandsAPI.baseURL}/a2/conversation/feedback`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario:this.scenario.title,history:session.history})});
        const data=await response.json();
        if(!response.ok||data.status!=='success'||!data.feedback)throw Error(data.error||'Feedback unavailable');
        feedback=this.cleanFeedback(data.feedback, session.history);
        session.feedback=feedback;
        session.reviewTracking = typeof A2Phase63 !== 'undefined' ? A2Phase63.registerFeedback(session, feedback) : {registered:0,concepts:[]};
        try{const all=JSON.parse(localStorage.getItem(key)||'[]');const match=all.findLastIndex(x=>x.completedAt===session.completedAt&&x.scenario===session.scenario);if(match>=0){all[match]=session;localStorage.setItem(key,JSON.stringify(all));}}catch(e){console.warn('Feedback not saved',e)}
      }catch(e){error=e.message;}
    }
    const items=(arr)=>Array.isArray(arr)&&arr.length?`<ul>${arr.slice(0,5).map(x=>`<li>${this.esc(String(x))}</li>`).join('')}</ul>`:'<p>No specific findings from this short conversation.</p>';
    const corrections=feedback?.corrections?.length?`<h3>Corrections and suggestions</h3>${feedback.corrections.slice(0,5).map(x=>`<div style="margin:12px 0"><p><strong>Your words:</strong> <span lang="nl">${this.esc(x.original||'')}</span></p><p><strong>Suggested:</strong> <span lang="nl">${this.esc(x.suggested||'')}</span></p><p>${this.esc(x.explanation||'')}</p></div>`).join('')}`:'<p>No specific grammar corrections identified.</p>';
    const reviewNote=feedback && session.reviewTracking ? `<p><strong>Mistake journal:</strong> ${Number(session.reviewTracking.saved||0)} correction(s) saved. ${session.reviewTracking.registered ? `${session.reviewTracking.registered} review category/categories scheduled: ${this.esc(session.reviewTracking.concepts.join(', '))}.` : 'No new spaced-review schedule was created (unclassified correction, duplicate, or already registered).'} </p>` : '';
    const report=feedback?`<p>${this.esc(feedback.summary||'')}</p><h3>What went well</h3>${items(feedback.strengths)}<h3>What to improve</h3>${items(feedback.improvements)}${corrections}<h3>Suggested next practice</h3><p class="small">These are AI suggestions, not automatically scheduled tasks. Genuine corrections are saved to your mistake journal and eligible categories are added to spaced reviews.</p>${items(feedback.nextPractice)}`:`<p><strong>AI feedback is unavailable${error?`: ${this.esc(error)}`:''}.</strong> Your conversation is saved. This is not a grammar assessment.</p><button id="a2RetryFeedback">Retry AI feedback</button>`;
    root.innerHTML=`<button id="aiChatBack">← A2 Learning Studio</button><div class="skill-label">A2 · SPEAKING FEEDBACK</div><h1>${this.esc(this.scenario.title)}</h1><div class="card curriculum-panel"><p>You gave ${count} Dutch response${count===1?'':'s'}.</p>${report}${reviewNote}${feedback && ((feedback.corrections||[]).length || (feedback.nextPractice||[]).length) ? '<div class="a2-actions"><button id="a2PractiseFeedback" class="primary">Practise my mistakes now · A2 · 12 min</button></div><p class="small">Optional generated lesson and fresh exercises. Does not complete another Daily Plan task or award curriculum mastery.</p><p id="a2FollowupError" role="status"></p>' : ''}${count<3?'<p>At least three responses are required to complete a Daily Plan activity.</p>':''}<details><summary>Review conversation</summary>${session.history.map(h=>`<p><strong>${h.role==='learner'?'You':'Tutor'}:</strong> ${this.esc(h.text)}</p>`).join('')}</details><div class="a2-actions"><button id="aiChatAgain">Practise again</button><button id="aiChatDone" class="primary">Back to Daily Plan</button></div></div>`;
    root.querySelector('#aiChatBack').onclick=()=>A2Studio.render();
    root.querySelector('#aiChatAgain').onclick=()=>this.open(this.scenario.id);
    root.querySelector('#aiChatDone').onclick=()=>Dashboard.open();
    const followup=root.querySelector('#a2PractiseFeedback');
    if(followup)followup.onclick=()=>this.practiseFeedback(session);
    const retry=root.querySelector('#a2RetryFeedback');if(retry)retry.onclick=()=>{this.busy=false;this.finish();};
    if(count>=3&&typeof A2AdaptivePhase5!=='undefined'){
      const task=A2AdaptivePhase5.currentTask;
      if(task?.kind==='conversation'&&task.studioId===this.scenario.id){
        const record=Dashboard.getDailyRecord();
        if(record?.plan?.activities?.some(a=>a.id===task.id)){
          record.completed ||= {};
          if(!record.completed[task.id]){record.completed[task.id]={resultId:`speaking-${Date.now()}`,completedAt:new Date().toISOString()};Dashboard.saveDailyRecord(record);}
          A2AdaptivePhase5.currentTask=null;
        }
      }
    }
    this.busy=false;
  }

};
