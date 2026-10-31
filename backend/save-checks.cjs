'use strict';
// Verosimilitud de guardados frente al guardado anterior. El cliente calcula el gacha y las monedas, así que el servidor
// solo acepta cambios que el juego normal puede producir. Las cotas son teóricas (nunca estadísticas) para no rechazar partidas legítimas.
const MAX_RUN=1170,MIN_RUN_MS=15000; // reward(): 5000 rivales/5 + 60*2 + 50 de victoria; una partida con monedas dura >= 15 s
const COST=60; // P.Gacha.cost: cada tirada cuesta 60 y su reembolso máximo es 15–60 (neto <= 0)
function createSaveChecks({db,rules,now}){
 const runs=p=>Object.values(p.characters).reduce((n,c)=>n+c.runs,0);
 const refunds=p=>{const M=rules().Meta;return Object.keys(p.characters).reduce((n,id)=>n+M.refund(id,p),0)};
 const grants=(id,kind,column)=>new Set(db.prepare(`SELECT ${column} AS v FROM admin_actions WHERE target_id=? AND kind=?`).all(id,kind).map(r=>r.v).filter(Boolean));
 const warn=(user,why)=>console.warn('[saves] '+user.id+': '+why);
 // Devuelve un texto de rechazo, o null si el guardado es verosímil. Sin guardado previo valida lo posible y recorta (clamp) en vez de rechazar.
 function check(user,previous,next){
  if(user.role==='admin')return null; // el cliente admin completa colección y monedas por diseño (ui/profile.js)
  let old=null;if(previous)try{old=rules().Meta.normalize(JSON.parse(previous.payload).progress)}catch{warn(user,'guardado previo ilegible: se trata como primera sincronización')}
  if(!old){ // importación de invitado: sin historial, solo se recorta lo imposible (wallet <= earned siempre; las skins solo las concede el admin)
   if(next.wallet>next.earned){warn(user,'wallet '+next.wallet+' > earned '+next.earned+': recortado');next.wallet=next.earned}
   if(next.earned>MAX_RUN*runs(next))warn(user,'earned '+next.earned+' sin partidas que lo expliquen');
   if(next.skins.unlocked.length||Object.values(next.skins.equipped).some(s=>s!=='base')){warn(user,'skins sin concesión: descartadas');next.skins={unlocked:[],equipped:{}}}
   return null;
  }
  const earned=next.earned-old.earned;if(earned<0)return 'earned no puede disminuir';
  const elapsed=Math.max(0,now()-(previous.updated_at||0)),cap=Math.min(MAX_RUN*Math.max(0,runs(next)-runs(old)),2*MAX_RUN*(Math.ceil(elapsed/MIN_RUN_MS)+1));
  if(earned>cap)return 'earned sube más de lo que permiten las partidas y el tiempo transcurrido';
  const available=old.wallet+earned+refunds(old);
  if(next.wallet>available)return 'wallet supera lo ganado más reembolsos';
  const given=grants(user.id,'character','character_id'),fresh=next.unlocked.filter(id=>!old.unlocked.includes(id)&&!given.has(id));
  if(fresh.length>Math.max(0,next.gacha.draws-old.gacha.draws)||fresh.length*COST>available)return 'personajes desbloqueados sin tiradas que los expliquen';
  const skins=grants(user.id,'skin',"json_extract(result,'$.skinId')");
  if(next.skins.unlocked.some(id=>!old.skins.unlocked.includes(id)&&!skins.has(id)))return 'skins sin concesión';
  return null;
 }
 return {check};
}
module.exports={createSaveChecks};
