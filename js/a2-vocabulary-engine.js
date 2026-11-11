
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
  topic:'all',
  topics() {
    return typeof DutchCurriculum === 'undefined' ? [] : DutchCurriculum.filter(t=>t.level==='A2');
  },
  matchesTopic(word) { return this.topic==='all'||(word.topics||[]).includes(this.topic); },
  topicControls() {
    return '<label for="vTopic">Learning topic</label><select id="vTopic"><option value="all"'+(this.topic==='all'?' selected':'')+'>All A2 topics</option>'+this.topics().map(t=>'<option value="'+A2Studio.esc(t.id)+'"'+(this.topic===t.id?' selected':'')+'>'+A2Studio.esc(t.title)+'</option>').join('')+'</select>';
  },
  bindTopic(root,render) { root.querySelector('#vTopic').onchange=event=>{this.topic=event.target.value;render();}; },
  exampleHTML(word) {
    const examples=[{nl:word.example,en:word.exampleEn},...(word.examples||[])];
    return examples.map(e=>'<p lang="nl">'+A2Studio.esc(e.nl)+'</p><p lang="en" class="small">'+A2Studio.esc(e.en||'')+'</p>').join('')+(word.note?'<p class="small">'+A2Studio.esc(word.note)+'</p>':'');
  },
  browse() {
    A2Studio.open();const root=document.getElementById('a2StudioContent');
    root.innerHTML='<button id="vBack">← A2 Studio</button><h2>Vocabulary word bank</h2><p>'+A2Vocabulary.length+' words and useful phrases across '+this.topics().length+' A2 learning topics. Read examples here without changing your review schedule.</p>'+this.topicControls()+'<label for="vSearch">Find a Dutch or English word</label><input id="vSearch" type="search" autocomplete="off" placeholder="For example: verdrietig or appointment"><button class="primary" id="vPractise">Review this topic →</button><div id="vBrowseResults"></div>';
    const show=()=>{
      const query=root.querySelector('#vSearch').value.trim().toLocaleLowerCase();
      const words=A2Vocabulary.filter(w=>this.matchesTopic(w)&&(!query||[w.nl,w.en,w.example].join(' ').toLocaleLowerCase().includes(query)));
      root.querySelector('#vBrowseResults').innerHTML='<p role="status">'+words.length+' words in this selection</p>'+words.map(w=>'<div class="card curriculum-panel"><h3 lang="nl">'+A2Studio.esc(w.nl)+'</h3><p>'+A2Studio.esc(w.en)+'</p>'+this.exampleHTML(w)+'</div>').join('')+(!words.length?'<p>No matching words. Try another word or topic.</p>':'');
    };
    root.querySelector('#vSearch').oninput=show;
    this.bindTopic(root,show);root.querySelector('#vBack').onclick=()=>A2Studio.render();
    root.querySelector('#vPractise').onclick=()=>{this.notice='';this.render();};show();
  },
  mode:'meaning',
  current:null,
  notice:'',
  open() { this.notice='';this.topic='all';A2Studio.open();this.render(); },
  render() {
    const root=document.getElementById('a2StudioContent');
    const due=this.due().filter(w=>this.matchesTopic(w)),total=A2Vocabulary.length;
    const s=this.stats();
    const summary='<p>'+s.reviewedToday+' words reviewed today · Daily target: '+this.dailyTarget+'</p><p>'+s.reviewsDue+' reviews due · '+s.newWords+' new words · '+s.scheduled+' scheduled for later</p><p>Daily completion is a small practice target, not completion of the whole word bank. Previously reviewed words return on their scheduled dates.</p>'+(this.notice?'<p role="status">'+A2Studio.esc(this.notice)+'</p>':'');
    const navigation='<button id="vBrowse">Browse all words and examples →</button>'+this.topicControls();
    if(!due.length) {
      root.innerHTML='<h2>Vocabulary review</h2>'+summary+navigation+'<p>No reviews or new words available in this selection right now. You can still browse all its examples.</p><button id="vBack">Back to A2 Studio</button>';
      root.querySelector('#vBack').onclick=()=>A2Studio.render();root.querySelector('#vBrowse').onclick=()=>this.browse();this.bindTopic(root,()=>this.render());return;
    }
    const word=due[0];this.current=word.id;
    const example=String(word.example||'');
    const escaped=String(word.nl).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const context=example.replace(new RegExp('(?<![\\p{L}\\p{N}])'+escaped+'(?![\\p{L}\\p{N}])','iu'),'___');
    const cloze=this.mode==='context'&&context!==example;
    const prompt=this.mode==='meaning'?word.nl:cloze?context:word.en;
    const expected=this.mode==='meaning'?word.en:word.nl;
    const instruction=this.mode==='meaning'?'What does this mean in English?':cloze?'Complete the Dutch sentence.':'Recall the Dutch word or phrase.';
    const modes='<label for="vMode">Practice mode</label><select id="vMode">'+[['meaning','Dutch → English'],['production','English → Dutch'],['context','Sentence recall']].map(([v,l])=>'<option value="'+v+'"'+(v===this.mode?' selected':'')+'>'+l+'</option>').join('')+'</select>';

    root.innerHTML='<button id="vBack">← A2 Studio</button><h2>Vocabulary review</h2>'+summary+navigation+modes+'<p>'+due.length+' available now of '+total+' words</p><div class="card curriculum-panel"><div class="skill-label">'+A2Studio.esc(word.group)+'</div><h2 lang="nl">'+A2Studio.esc(prompt)+'</h2><p>'+instruction+'</p><input id="vAnswer" autocomplete="off" placeholder="Your answer"><button class="primary" id="vReveal">Reveal answer</button><div id="vFeedback" aria-live="polite"></div></div>';
    root.querySelector('#vBack').onclick=()=>A2Studio.render();
    root.querySelector('#vBrowse').onclick=()=>this.browse();
    this.bindTopic(root,()=>this.render());
    root.querySelector('#vMode').onchange=event=>{this.mode=event.target.value;this.render();};
    root.querySelector('#vReveal').onclick=()=>{
      const given=root.querySelector('#vAnswer').value.trim().toLowerCase().replace(/[.!?]+$/,'');
      const exact=given===expected.toLowerCase();
      root.querySelector('#vFeedback').innerHTML='<p><strong>'+A2Studio.esc(expected)+'</strong></p><p lang="nl">'+A2Studio.esc(word.example)+'</p><p lang="en" class="small">'+A2Studio.esc(word.exampleEn||'')+'</p>'+(word.note?'<p class="small">'+A2Studio.esc(word.note)+'</p>':'')+'<p>'+(exact?'Your typed answer matches. Confirm below.':'Decide whether you recalled the meaning correctly.')+'</p><button id="vAgain">Again</button> <button class="primary" id="vGood">Remembered</button>';
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
