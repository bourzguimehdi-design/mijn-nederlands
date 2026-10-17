import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const workerPath=process.argv[2] || new URL('./worker-word-game.mjs',import.meta.url).pathname;
// data import permits testing the repository's .js Worker without package.json changes.
const source=fs.readFileSync(workerPath,'utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const originalFetch=globalThis.fetch;
let calls=[], modelResult={answer:'yes'}, status=200, rawOutput;
globalThis.fetch=async(url,init)=>{
  assert.equal(url,'https://api.openai.com/v1/responses');
  calls.push(JSON.parse(init.body));
  return Response.json({output:[{type:'message',content:[{type:'output_text',text:rawOutput ?? JSON.stringify(modelResult)}]}]},{status});
};
const scenario=word=>`Raad het woord. Secret answer: ${word} (category: voorwerp). Answer ONLY the learner's yes/no question.`;
const request=async(body,env={OPENAI_API_KEY:'test-placeholder'})=>{
  const response=await worker.fetch(new Request('https://example.test/a2/conversation/turn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),env);
  return {status:response.status,body:await response.json()};
};
const game={scenarioId:'raad_het_woord',scenario:scenario('wortel'),response:'Is het een ding?',history:[],turn:1,maxTurns:30};
try {
  const allowed={yes:'Ja.',no:'Nee.',sometimes:'Soms.',depends:'Dat hangt ervan af.',unclear:'Dat is niet duidelijk. Stel één korte ja/nee-vraag.',not_yes_no:'Stel een ja/nee-vraag.',unknown:'Dat weet ik niet zeker.'};
  for(const [answer,dutch] of Object.entries(allowed)){
    // Even if a model adds free text, it never reaches the learner.
    modelResult={answer,dutch:'Het is een wortel. Is het oranje?',hint:'oranje',finished:true};
    const result=await request(game);
    assert.equal(result.status,200);
    assert.deepEqual(result.body.turn,{dutch,hint:'',correction:'',explanation:'',finished:false});
    assert(!dutch.includes('?'));
    assert(!dutch.includes('wortel'));
  }
  assert(calls.every(x=>x.text.format.name==='a2_word_game_answer'));
  assert(calls.at(-1).instructions.includes('immutable secret for this round is wortel'));
  assert(!calls.at(-1).instructions.includes('exactly one natural follow-up'));
  for(const word of ['appel','fiets','hand','stoel','wortel','sleutel','knie','banaan']){
    modelResult={answer:'no'};
    const history=[{role:'learner',text:'Kun je het eten?'},{role:'tutor',text:'Nee.'}];
    assert.equal((await request({...game,scenario:scenario(word),history,turn:29})).body.turn.finished,false);
    assert(calls.at(-1).instructions.includes(`immutable secret for this round is ${word}`));
    assert.deepEqual(JSON.parse(calls.at(-1).input).history,history);
  }
  for(const answer of ['__proto__','Ja. Is het oranje?','wortel',null]){
    modelResult={answer};
    assert.equal((await request(game)).status,502);
  }
  rawOutput='not JSON'; assert.equal((await request(game)).status,502); rawOutput=undefined;
  const before=calls.length;
  for(const change of [{scenario:scenario('hond')},{scenario:'missing secret'},{response:''},{response:'x'.repeat(1501)}]){
    assert.equal((await request({...game,...change})).status,400);
  }
  assert.equal(calls.length,before);
  assert.equal((await request(game,{})).status,500);
  status=503; assert.equal((await request(game)).status,502); status=200;
  modelResult={dutch:'Wat wilt u kopen?',hint:'',correction:'',explanation:'',finished:false};
  const normal=await request({scenario:'In de winkel',response:'Ik zoek brood.',turn:1,maxTurns:12});
  assert.equal(normal.status,200);
  assert.equal(calls.at(-1).text.format.name,'a2_conversation_turn');
  assert(calls.at(-1).instructions.includes('exactly one natural follow-up question'));
  assert.equal(normal.body.turn.dutch,'Wat wilt u kopen?');
  console.log('PASS: game routing, all eight secrets, fixed replies, history, late turns, output rejection, input validation, API errors, normal conversation compatibility. AI replies mocked; semantic accuracy and live deployment NOT tested.');
} finally {globalThis.fetch=originalFetch;}
