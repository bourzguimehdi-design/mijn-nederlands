/* A2 Raad het woord: fixed secret per round, AI-generated Dutch replies, existing speaking feedback. */
const A2WordGuess = {
  bank: [
    {word:'appel',kind:'fruit',hint:'Je kunt het eten. Het groeit aan een boom.'},
    {word:'fiets',kind:'voorwerp',hint:'Je gebruikt het om naar je werk te gaan.'},
    {word:'hand',kind:'lichaamsdeel',hint:'Je gebruikt het om iets vast te houden.'},
    {word:'stoel',kind:'meubel',hint:'Je kunt erop zitten.'},
    {word:'wortel',kind:'groente',hint:'Het is vaak oranje.'},
    {word:'sleutel',kind:'voorwerp',hint:'Je gebruikt het bij een deur.'},
    {word:'knie',kind:'lichaamsdeel',hint:'Je buigt het als je loopt.'},
    {word:'banaan',kind:'fruit',hint:'Het is meestal geel en lang.'}
  ],
  secret:null,history:[],questions:0,busy:false,finished:false,hints:0,hintText:'',
  esc(s){return A2Studio.esc(s);},
  open(){
    const previous=this.secret?.word;
    const options=this.bank.filter(x=>x.word!==previous);
    this.secret=options[Math.floor(Math.random()*options.length)];
    this.history=[];this.questions=0;this.hints=0;this.hintText='';this.busy=false;this.finished=false;
    A2Studio.open();this.render('Ik heb een woord gekozen. Stel ja/nee-vragen in het Nederlands om het te raden!');
  },
  render(reply='',error=''){
    const root=document.getElementById('a2StudioContent');
    const transcript=this.history.slice(-12).map(h=>'<p><strong>'+this.esc(h.role==='learner'?'Jij':'Spelleider')+':</strong> '+this.esc(h.text)+'</p>').join('');
    root.innerHTML='<button id="wordBack">← A2 Learning Studio</button><div class="skill-label">A2 · SPREEKSPEL</div><h1>Raad het woord</h1><div class="card curriculum-panel"><p>Stel vragen zoals: Is het een dier? Kun je het eten? Gebruik je het thuis?</p><p><strong>Vragen: '+this.questions+'</strong></p><p lang="nl" class="a2-dialogue">'+this.esc(reply)+'</p><button id="wordListen">🔊 Listen</button><div>'+transcript+'</div>'+(this.finished?'':'<label for="wordInput">Jouw vraag of gok in het Nederlands</label><textarea id="wordInput" rows="3" style="display:block;width:100%;box-sizing:border-box;margin:12px 0"></textarea><div class="a2-actions"><button id="wordSend" class="primary">Vraag stellen →</button><button id="wordMic">🎤 Record</button><button id="wordHint">Hint</button><button id="wordGiveUp">Give up</button></div><p id="wordHintText" role="status" lang="nl"'+(this.hintText?'':' hidden')+'>'+this.esc(this.hintText)+'</p>')+'<p id="wordError" role="status">'+this.esc(error)+'</p>'+(this.finished?'<button id="wordFeedback" class="primary">Get A2 speaking feedback →</button><button id="wordAgain">Play again</button>':'')+'</div>';
    root.querySelector('#wordBack').onclick=()=>A2Studio.render();
    root.querySelector('#wordListen').onclick=()=>A2Conversation.say(reply);
    if(this.finished){
      root.querySelector('#wordAgain').onclick=()=>this.open();
      root.querySelector('#wordFeedback').onclick=()=>this.feedback();
      return;
    }
    root.querySelector('#wordSend').onclick=()=>this.ask(root.querySelector('#wordInput').value.trim());
    root.querySelector('#wordHint').onclick=()=>this.showHint();
    root.querySelector('#wordGiveUp').onclick=()=>this.end(false);
    root.querySelector('#wordMic').onclick=async()=>{
      const error=root.querySelector('#wordError');
      const recordedInput=root.querySelector('#wordInput');
      try {
        if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error('Microphone not supported');
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        const chunks=[];const rec=new MediaRecorder(stream);
        rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
        rec.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());try{
          const form=new FormData();form.append('audio',new Blob(chunks,{type:rec.mimeType||'audio/webm'}),'question.webm');
          const response=await fetch(MijnNederlandsAPI.baseURL+'/transcribe-speaking',{method:'POST',body:form});
          const data=await response.json();const text=data.transcription||data.text||data.transcript||'';
          if(!response.ok||!text)throw Error(data.error||'Transcription unavailable');
          if(this.finished||!recordedInput.isConnected)return;
          this.render('', 'Check the recognized text below, then send your question.');
          const input=document.getElementById('wordInput');
          input.value=String(text);input.focus();
        }catch(e){this.render('',e.message);}};
        rec.start();error.textContent='Recording… press Stop to send.';
        const btn=root.querySelector('#wordMic');btn.textContent='⏹ Stop';btn.onclick=()=>rec.stop();
      }catch(e){error.textContent=e.message;}
    };
  },
  showHint(){
    if(this.finished||!this.secret)return;
    this.hints=Math.min(this.hints+1,2);
    this.hintText='Hint: '+this.secret.hint+(this.hints>1?' Categorie: '+this.secret.kind+'.':'');
    const panel=document.getElementById('wordHintText');
    if(panel){panel.hidden=false;panel.textContent=this.hintText;panel.scrollIntoView({block:'nearest',behavior:'smooth'});}
  },
  async ask(question){
    if(this.busy||this.finished)return;
    if(question.length<3){this.render('','Write a short Dutch question first.');return;}
    this.busy=true;this.questions++;
    this.history.push({role:'learner',text:question});
    const normalized=question.toLocaleLowerCase('nl-NL');
    if(normalized.includes(this.secret.word)&&/(is het|is dat|bedoel|antwoord|raad|denk)/.test(normalized)){this.busy=false;this.end(true);return;}
    this.render('Even nadenken…');
    try{
      const scenario='Raad het woord. Secret answer: '+this.secret.word+' (category: '+this.secret.kind+'). Answer ONLY the learner\'s yes/no question in short natural CEFR A2 Dutch. Never reveal the secret unless the learner explicitly guesses the exact word. Do not change the secret or ask unrelated questions.';
      const response=await fetch(MijnNederlandsAPI.baseURL+'/a2/conversation/turn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario,scenarioId:'raad_het_woord',history:this.history.slice(0,-1),response:question,turn:this.questions,maxTurns:30})});
      const data=await response.json();if(!response.ok||data.status!=='success'||!data.turn?.dutch)throw Error(data.error||'AI unavailable');
      const reply=String(data.turn.dutch);
      // Guard against accidental disclosure of the secret in generated replies.
      if(reply.toLocaleLowerCase('nl-NL').includes(this.secret.word))throw Error('The AI revealed the answer; try another question.');
      this.history.push({role:'tutor',text:reply});this.render(reply);
    }catch(e){
      this.history.push({role:'tutor',text:'Probeer een andere vraag.'});
      this.render('Probeer een andere vraag.',e.message);
    }finally{this.busy=false;}
  },
  end(won){
    this.finished=true;
    const message=won?'Goed geraden! Het woord was '+this.secret.word+'.':'Het woord was '+this.secret.word+'. Goed geprobeerd!';
    this.history.push({role:'tutor',text:message});this.render(message);
  },
  feedback(){
    A2AIConversation.scenario={id:'raad_het_woord',title:'Raad het woord'};
    A2AIConversation.history=this.history.map(h=>({...h}));
    A2AIConversation.turn=this.questions;A2AIConversation.busy=false;
    return A2AIConversation.finish();
  }
};
