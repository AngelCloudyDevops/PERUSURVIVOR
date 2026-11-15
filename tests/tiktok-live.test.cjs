const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/systems/tiktok-live.js'),'utf8');

function runtime(admin=true){
 const P={state:{mode:'play',mapTime:0,enemySerial:0,player:{x:10,y:20,hp:50,maxHp:100},enemies:[],effects:[]},Profile:{admin:()=>admin},Coop:{active:false},Entities:{enemy:()=>({x:0,y:0,hp:20,max:20,speed:60,r:13,evolution:0,evolutionApplied:true})},MinionEvolution:{profiles:[{hp:1,speed:1},{hp:1.35,speed:1.06},{hp:1.85,speed:1.12}],rank:e=>e.evolution||0},Terrain:{resolve(){}},Audio:{fx(){}},Game:{start(){},update(){},finish(){}},EnemyArt:{draw(){return true},labelTop:e=>e.y-50}};
 vm.runInNewContext(source,{P,console,Date,Math});return P
}

test('sanitizes viewer names and keeps a safe fallback',()=>{const live=runtime().TikTokLive;assert.equal(live.sanitize('  Ana🔥  LIVE!! '),'Ana LIVE');assert.equal(live.sanitize('🔥🔥'),'Espectador');assert.equal(live.sanitize('123456789012345678901234'),'12345678901234567890')});

test('admin events create ranked minions carrying the viewer label',()=>{const P=runtime(),live=P.TikTokLive;live.enabled=true;const enemy=live.spawn('Mishi🔥',2,'large');assert.equal(enemy.tiktokViewer,'Mishi');assert.equal(enemy.tiktokGift,'large');assert.equal(enemy.evolution,2);assert.equal(P.state.enemies.length,1);assert.equal(enemy.max,37)});

test('non admins cannot queue interactive events',()=>{const P=runtime(false),live=P.TikTokLive;live.enabled=true;assert.equal(live.queueEvent('rose','Intruso'),false);assert.equal(live.queue.length,0)});

test('likes create one bounded event every 25 interactions',()=>{const P=runtime(),live=P.TikTokLive;live.enabled=true;for(let i=0;i<49;i++)live.like('Fan');assert.equal(live.queue.length,1);assert.equal(live.queue[0].type,'like-wave')});

test('build manifest and admin-only interface are wired',()=>{const modules=fs.readFileSync(path.join(root,'scripts/modules.cjs'),'utf8'),css=fs.readFileSync(path.join(root,'src/ui/styles.css'),'utf8');assert.match(modules,/src\/systems\/tiktok-live\.js/);assert.match(css,/body:not\(\[data-account-admin="true"\]\) #tiktok-live-open/);assert.match(source,/SIMULACIÓN SIN CONEXIÓN/)});
