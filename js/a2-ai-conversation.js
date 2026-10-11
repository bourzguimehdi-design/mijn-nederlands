/* Phase 6: adaptive Worker conversation. The original scripted scenarios remain available as fallback. */
const A2AIConversation = {
  scenario:null,history:[],turn:0,busy:false,recording:null,
  esc(s){return A2Studio.esc(s);},
  async open(id){
    this.scenario=A2Conversations.find(s=>s.id===id)||{id,title:id};
    this.history=[];this.turn=0;this.busy=false;
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
      const response=await fetch(`${MijnNederlandsAPI.baseURL}/a2/conversation/turn`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario:this.scenario.title,history:answer?this.history.slice(0,-1):this.history,response:answer,turn:this.turn})});
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
    const finished=t.finished||this.turn>=7;
    root.innerHTML=`<button id="aiChatBack">← A2 Learning Studio</button><div class="skill-label">A2 · LIVE ROLEPLAY · TURN ${this.turn}</div><h1>${this.esc(this.scenario.title)}</h1><div class="card curriculum-panel"><p lang="nl" class="a2-dialogue">${this.esc(t.dutch)}</p><button id="aiChatListen">🔊 Listen</button>${t.correction?`<p><strong>Correction:</strong> ${this.esc(t.correction)}</p>`:''}${t.explanation?`<p>${this.esc(t.explanation)}</p>`:''}<p class="small">${this.esc(t.hint)}</p>${finished?'<p>Conversation completed. Great practice!</p><button class="primary" id="aiChatFinish">Finish conversation</button>':'<label for="aiChatInput">Your reply in Dutch</label><textarea id="aiChatInput" rows="3" placeholder="Answer naturally in Dutch"></textarea><div class="a2-actions"><button id="aiChatMic">🎤 Record response</button><button class="primary" id="aiChatSend">Send and get follow-up →</button></div><p id="aiChatError" aria-live="polite"></p>'}</div>`;
    root.querySelector('#aiChatBack').onclick=()=>A2Studio.render();
    root.querySelector('#aiChatListen').onclick=()=>A2Conversation.say(t.dutch);
    if(finished){root.querySelector('#aiChatFinish').onclick=()=>{
      try{const key='mijn_nederlands_a2_ai_conversations_v1';const old=JSON.parse(localStorage.getItem(key)||'[]');old.push({scenario:this.scenario.id,completedAt:new Date().toISOString(),history:this.history});localStorage.setItem(key,JSON.stringify(old.slice(-80)));}catch(e){console.warn(e)}
      if(typeof A2AdaptivePhase5!=='undefined')A2AdaptivePhase5.finish('conversation',this.scenario.id);
      A2Studio.render();};return;}
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
  }
};
