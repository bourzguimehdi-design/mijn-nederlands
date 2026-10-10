
/* Guided multi-turn roleplay, NOT an open-ended AI chatbot. */
const A2Conversation = {
  KEY:'mijn_nederlands_a2_conversations_v1',scenario:null,step:0,answers:[],
  open(id) { this.scenario=A2Conversations.find(s=>s.id===id);if(!this.scenario)return;this.step=0;this.answers=[];A2Studio.open();this.render(); },
  say(text) { if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='nl-NL';utterance.rate=.88;window.speechSynthesis.speak(utterance); },
  render() {
    const root=document.getElementById('a2StudioContent'),s=this.scenario;
    if(this.step>=s.turns.length) {
      let saved=[];try{saved=JSON.parse(localStorage.getItem(this.KEY)||'[]');if(!Array.isArray(saved))saved=[];}catch{}
      saved.push({scenario:s.id,completedAt:new Date().toISOString(),responses:this.answers});
      localStorage.setItem(this.KEY,JSON.stringify(saved.slice(-100)));
      root.innerHTML='<button id="chatBack">← A2 Studio</button><h2>Conversation completed</h2><p>You completed '+s.turns.length+' turns. This is guided roleplay, not AI evaluation.</p><div id="chatSummary"></div><button class="primary" id="chatAgain">Try again</button>';
      root.querySelector('#chatSummary').textContent='Practice tip: review your responses and repeat aloud, focusing on word order and clear sentences.';
      root.querySelector('#chatBack').onclick=()=>A2Studio.render();
      root.querySelector('#chatAgain').onclick=()=>this.open(s.id);
      return;
    }
    const turn=s.turns[this.step];
    root.innerHTML='<button id="chatBack">← A2 Studio</button><div class="skill-label">GUIDED A2 ROLEPLAY · '+(this.step+1)+'/'+s.turns.length+'</div><h2>'+A2Studio.esc(s.title)+'</h2><div class="card curriculum-panel"><p lang="nl"><strong>'+A2Studio.esc(turn.nl)+'</strong></p><button id="chatListen">🔊 Listen</button><p class="small">'+A2Studio.esc(turn.hint)+'</p><textarea id="chatInput" rows="3" placeholder="Write your response in Dutch"></textarea><p class="small">Useful words: '+A2Studio.esc(turn.words.join(' · '))+'</p><button class="primary" id="chatNext">Send response →</button><div id="chatError" aria-live="polite"></div></div>';
    root.querySelector('#chatBack').onclick=()=>A2Studio.render();
    root.querySelector('#chatListen').onclick=()=>this.say(turn.nl);
    root.querySelector('#chatNext').onclick=()=>{
      const response=root.querySelector('#chatInput').value.trim();
      if(response.length<5){root.querySelector('#chatError').textContent='Write at least a short Dutch sentence.';return;}
      this.answers.push({prompt:turn.nl,response});this.step++;this.render();
    };
  }
};
