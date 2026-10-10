
/* Independent vocabulary recall; does not mutate grammar spaced-review records. */
const A2VocabularyEngine = {
  KEY: 'mijn_nederlands_a2_vocab_v1',
  intervals: [1, 3, 7, 14, 30],
  load() {
    try { const x=JSON.parse(localStorage.getItem(this.KEY)||'{}'); return x&&typeof x==='object'?x:{}; }
    catch { return {}; }
  },
  save(x) { localStorage.setItem(this.KEY,JSON.stringify(x)); },
  date(d=new Date()) { return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); },
  nextDate(days,now=new Date()) { const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+days);return this.date(d); },
  due(now=new Date()) {
    const records=this.load(),today=this.date(now);
    return A2Vocabulary.filter(w=>!records[w.id]||records[w.id].due<=today);
  },
  grade(id,correct,now=new Date()) {
    if(!A2Vocabulary.some(w=>w.id===id)) throw new Error('Unknown word');
    const records=this.load(),prev=records[id]||{stage:0,attempts:0};
    const stage=correct?Math.min(prev.stage+1,this.intervals.length-1):0;
    records[id]={stage,attempts:prev.attempts+1,correctCount:(prev.correctCount||0)+(correct?1:0),
      due:this.nextDate(correct?this.intervals[stage]:1,now),lastReviewed:this.date(now)};
    this.save(records);return records[id];
  },
  current:null,
  open() { A2Studio.open();this.render(); },
  render() {
    const root=document.getElementById('a2StudioContent');
    const due=this.due(),total=A2Vocabulary.length;
    if(!due.length) { root.innerHTML='<h2>Vocabulary review</h2><p>All '+total+' words reviewed for now. Come back when they are due.</p><button id="vBack">Back to A2 Studio</button>';root.querySelector('#vBack').onclick=()=>A2Studio.render();return; }
    const word=due[0];this.current=word.id;
    root.innerHTML='<button id="vBack">← A2 Studio</button><h2>Vocabulary review</h2><p>'+due.length+' due of '+total+' words</p><div class="card curriculum-panel"><div class="skill-label">'+A2Studio.esc(word.group)+'</div><h2 lang="nl">'+A2Studio.esc(word.nl)+'</h2><p>What does this mean in English?</p><input id="vAnswer" autocomplete="off" placeholder="Your answer"><button class="primary" id="vReveal">Reveal answer</button><div id="vFeedback" aria-live="polite"></div></div>';
    root.querySelector('#vBack').onclick=()=>A2Studio.render();
    root.querySelector('#vReveal').onclick=()=>{
      const given=root.querySelector('#vAnswer').value.trim().toLowerCase().replace(/[.!?]+$/,'');
      const exact=given===word.en.toLowerCase();
      root.querySelector('#vFeedback').innerHTML='<p><strong>'+A2Studio.esc(word.en)+'</strong></p><p lang="nl">'+A2Studio.esc(word.example)+'</p><p>'+(exact?'Your typed answer matches. Confirm below.':'Decide whether you recalled the meaning correctly.')+'</p><button id="vAgain">Again</button> <button class="primary" id="vGood">Remembered</button>';
      root.querySelector('#vAgain').onclick=()=>{this.grade(word.id,false);this.render();};
      root.querySelector('#vGood').onclick=()=>{this.grade(word.id,true);this.render();};
    };
  }
};
