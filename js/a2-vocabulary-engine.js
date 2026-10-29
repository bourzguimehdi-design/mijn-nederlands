
/* Independent vocabulary recall; does not mutate grammar spaced-review records. */
const A2VocabularyEngine = {
  KEY: 'mijn_nederlands_a2_vocab_v1',
  intervals: [1, 3, 7, 14, 30],
  dailyTarget: 3,
  load() {
    try { const x=JSON.parse(localStorage.getItem(this.KEY)||'{}'); return x&&typeof x==='object'?x:{}; }
    catch { return {}; }
  },
  save(x) { localStorage.setItem(this.KEY,JSON.stringify(x)); },
  date(d=new Date()) { return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); },
  nextDate(days,now=new Date()) { const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+days);return this.date(d); },
  due(now=new Date()) {
    const records=this.load(),today=this.date(now);
    // Revisit overdue learned words before introducing new ones. Keep IDs and schedules intact.
    return A2Vocabulary.filter(w=>!records[w.id]||records[w.id].due<=today)
      .sort((a,b)=>{
        const x=records[a.id],y=records[b.id];
        if(!x||!y)return x?-1:y?1:0;
        return String(x.due).localeCompare(String(y.due));
      });
  },
  stats(now=new Date()) {
    const records=this.load(),today=this.date(now);
    let newWords=0,reviewsDue=0,reviewedToday=0,scheduled=0,nextDue=null;
    for(const word of A2Vocabulary){
      const record=records[word.id];
      if(!record){newWords++;continue;}
      if(record.lastReviewed===today)reviewedToday++;
      if(record.due<=today)reviewsDue++;
      else if(record.due){scheduled++;if(!nextDue||record.due<nextDue)nextDue=record.due;}
    }
    return {total:A2Vocabulary.length,newWords,reviewsDue,reviewedToday,scheduled,nextDue,due:newWords+reviewsDue};
  },
  planSubtitle(completed=false,now=new Date()) {
    const s=this.stats(now);
    return (completed?'Daily activity completed':`Daily target: ${Math.min(s.reviewedToday,this.dailyTarget)}/${this.dailyTarget} words reviewed`)+
      ` · ${s.due} available now (${s.reviewsDue} reviews + ${s.newWords} new)`;
  },
  grade(id,correct,now=new Date()) {
    if(!A2Vocabulary.some(w=>w.id===id)) throw new Error('Unknown word');
    const records=this.load(),prev=records[id]||{stage:0,attempts:0};
    const stage=correct?Math.min(prev.stage+1,this.intervals.length-1):0;
    records[id]={stage,attempts:prev.attempts+1,correctCount:(prev.correctCount||0)+(correct?1:0),
      due:this.nextDate(correct?this.intervals[stage]:1,now),lastReviewed:this.date(now)};
    this.save(records);return records[id];
  },
  mode:'meaning',
  current:null,
  notice:'',
  open() { this.notice='';A2Studio.open();this.render(); },
  render() {
    const root=document.getElementById('a2StudioContent');
    const due=this.due(),total=A2Vocabulary.length;
    const s=this.stats();
    const summary='<p>'+s.reviewedToday+' words reviewed today · Daily target: '+this.dailyTarget+'</p><p>'+s.reviewsDue+' reviews due · '+s.newWords+' new words · '+s.scheduled+' scheduled for later</p><p>Daily completion is a small practice target, not completion of the whole word bank. Previously reviewed words return on their scheduled dates.</p>'+(this.notice?'<p role="status">'+A2Studio.esc(this.notice)+'</p>':'');
    if(!due.length) { root.innerHTML='<h2>Vocabulary review</h2>'+summary+'<p>All '+total+' words reviewed for now.'+(s.nextDue?' Next review: '+A2Studio.esc(s.nextDue)+'.':'')+'</p><button id="vBack">Back to A2 Studio</button>';root.querySelector('#vBack').onclick=()=>A2Studio.render();return; }
    const word=due[0];this.current=word.id;
    const example=String(word.example||'');
    const escaped=String(word.nl).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const context=example.replace(new RegExp(escaped,'i'),'___');
    const cloze=this.mode==='context'&&context!==example;
    const prompt=this.mode==='meaning'?word.nl:cloze?context:word.en;
    const expected=this.mode==='meaning'?word.en:word.nl;
    const instruction=this.mode==='meaning'?'What does this mean in English?':cloze?'Complete the Dutch sentence.':'Recall the Dutch word or phrase.';
    const modes='<label for="vMode">Practice mode</label><select id="vMode">'+[['meaning','Dutch → English'],['production','English → Dutch'],['context','Sentence recall']].map(([v,l])=>'<option value="'+v+'"'+(v===this.mode?' selected':'')+'>'+l+'</option>').join('')+'</select>';

    root.innerHTML='<button id="vBack">← A2 Studio</button><h2>Vocabulary review</h2>'+summary+modes+'<p>'+due.length+' available now of '+total+' words</p><div class="card curriculum-panel"><div class="skill-label">'+A2Studio.esc(word.group)+'</div><h2 lang="nl">'+A2Studio.esc(prompt)+'</h2><p>'+instruction+'</p><input id="vAnswer" autocomplete="off" placeholder="Your answer"><button class="primary" id="vReveal">Reveal answer</button><div id="vFeedback" aria-live="polite"></div></div>';
    root.querySelector('#vBack').onclick=()=>A2Studio.render();
    root.querySelector('#vMode').onchange=event=>{this.mode=event.target.value;this.render();};
    root.querySelector('#vReveal').onclick=()=>{
      const given=root.querySelector('#vAnswer').value.trim().toLowerCase().replace(/[.!?]+$/,'');
      const exact=given===expected.toLowerCase();
      root.querySelector('#vFeedback').innerHTML='<p><strong>'+A2Studio.esc(expected)+'</strong></p><p lang="nl">'+A2Studio.esc(word.example)+'</p><p>'+(exact?'Your typed answer matches. Confirm below.':'Decide whether you recalled the meaning correctly.')+'</p><button id="vAgain">Again</button> <button class="primary" id="vGood">Remembered</button>';
      const recordReview=correct=>{
        const saved=this.grade(word.id,correct);
        this.notice=word.nl+' — review saved. Next review: '+saved.due+'.';
        this.render();
      };
      root.querySelector('#vAgain').onclick=()=>recordReview(false);
      root.querySelector('#vGood').onclick=()=>recordReview(true);
    };
  }
};
