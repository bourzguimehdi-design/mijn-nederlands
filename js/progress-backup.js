/* Export/restore learning data only; never includes API configuration or authentication. */
const ProgressBackup = {
  keys:[
    'mijnNederlandsPlacement','mijnNederlandsPlacementHistory','mijnNederlandsWritingAssessment','mijnNederlandsWritingHistory',
    'mijnNederlandsSpeakingAssessment','mijnNederlandsSpeakingHistory','mijnNederlandsPracticeResult','mijnNederlandsPracticeHistory',
    'mijnNederlandsProgress','mijnNederlandsProgressHistory','mijnNederlandsLearnerProfile','mijnNederlandsLearningProfile',
    'mijnNederlandsWritingAI','mijnNederlandsWritingProgress','mijn_nederlands_daily_plan_v1','mijn_nederlands_curriculum_v1',
    'mijn_nederlands_spaced_reviews_v1','mijn_nederlands_a2_mistake_journal_v1','mijn_nederlands_a2_ai_conversations_v1',
    'mijn_nederlands_a2_conversations_v1','mijn_nederlands_a2_mastery_v1','mijn_nederlands_a2_mock_v1','mijn_nederlands_a2_vocab_v1',
    'mijn_nederlands_question_reports_v1','mijn_nederlands_exam_practice_v1','mijn_nederlands_knm_v1'
  ],
  snapshot(){
    const entries=Object.create(null);
    for(const key of this.keys){const value=localStorage.getItem(key);if(value!==null)entries[key]=value;}
    return {format:'mijn-nederlands-learning-backup',version:1,exportedAt:new Date().toISOString(),entries};
  },
  validate(text){
    if(typeof text!=='string'||text.length>10000000)throw Error('Backup is too large (maximum 10 MB of text).');
    const x=JSON.parse(text);
    if(x?.format!=='mijn-nederlands-learning-backup'||x.version!==1||!x.entries||typeof x.entries!=='object'||Array.isArray(x.entries))throw Error('Not a supported Mijn Nederlands backup.');
    for(const [key,value] of Object.entries(x.entries)){
      if(!this.keys.includes(key)||typeof value!=='string')throw Error('Backup contains an unsupported entry.');
      const parsed=JSON.parse(value);
      if(parsed===null||typeof parsed!=='object')throw Error('Learning entries must contain JSON objects or arrays.');
    }
    if(!Object.keys(x.entries).length)throw Error('Backup contains no learning data.');
    return x;
  },
  restore(backup,replace=false){
    const checked=this.validate(JSON.stringify(backup)),before=new Map(),written=[];
    try{
      for(const [key,value] of Object.entries(checked.entries)){
        const old=localStorage.getItem(key);if(old!==null&&!replace)continue;
        before.set(key,old);localStorage.setItem(key,value);written.push(key);
      }
    }catch(e){
      let failed=false;
      for(const key of written.reverse())try{const old=before.get(key);if(old===null)localStorage.removeItem(key);else localStorage.setItem(key,old);}catch{failed=true;}
      throw Error(failed?'Restore failed and rollback was incomplete. Keep your exported backup.':'Restore failed; original data was restored. '+e.message);
    }
    return written.length;
  },
  download(snapshot=this.snapshot()){
    const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='mijn-nederlands-backup-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  },
  open(){
    A2Studio.open();const root=document.getElementById('a2StudioContent');
    root.innerHTML='<button id="backupBack">← A2 Studio</button><h1>Learning progress backup</h1><p>Download a copy of your lessons, reviews, vocabulary, assessments and practice history. Keep it private: it can contain your written answers. Backups are manual, not cloud sync.</p><button class="primary" id="backupExport">Download my progress</button><h2>Restore a backup</h2><input id="backupFile" type="file" accept=".json,application/json"><div id="backupPreview" role="status"></div><label><input type="checkbox" id="backupReplace"> Replace existing matching entries with the backup. Otherwise only missing entries are restored.</label><p>Replacing first downloads a safety copy of your current progress. No unrelated entries are removed.</p><button id="backupRestore" disabled>Restore selected backup</button>';
    root.querySelector('#backupBack').onclick=()=>A2Studio.render();root.querySelector('#backupExport').onclick=()=>this.download();
    let selected=null;const preview=root.querySelector('#backupPreview'),button=root.querySelector('#backupRestore');
    root.querySelector('#backupFile').onchange=async event=>{
      selected=null;button.disabled=true;
      try{const file=event.target.files[0];if(!file)return;if(file.size>10000000)throw Error('File exceeds 10 MB.');selected=this.validate(await file.text());
        const keys=Object.keys(selected.entries),conflicts=keys.filter(k=>localStorage.getItem(k)!==null).length;
        preview.textContent=keys.length+' learning entries, '+conflicts+' already present. Exported: '+String(selected.exportedAt||'unknown date');button.disabled=false;
      }catch(e){preview.textContent=e.message;}
    };
    button.onclick=()=>{
      if(!selected)return;const replace=root.querySelector('#backupReplace').checked;
      if(!confirm(replace?'Replace matching learning data from this backup? A safety copy will download first.':'Restore only entries missing from this browser?'))return;
      try{if(replace)this.download();const n=this.restore(selected,replace);preview.textContent=n+' entries restored. Reload the app to use the restored progress.';button.disabled=true;}
      catch(e){preview.textContent=e.message;}
    };
  }
};
