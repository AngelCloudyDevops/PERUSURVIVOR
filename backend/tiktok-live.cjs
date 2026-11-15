'use strict';
const {EventEmitter}=require('node:events');

function cleanUsername(value){return String(value||'').trim().replace(/^@+/,'').toLowerCase()}
function viewerName(data){return String(data?.user?.uniqueId||data?.uniqueId||data?.user?.nickname||data?.nickname||'Espectador').normalize('NFKC').replace(/[^\p{L}\p{N}_. -]/gu,'').replace(/\s+/g,' ').trim().slice(0,20)||'Espectador'}
function giftEvent(data){
 const repeat=Math.max(1,Math.min(999,Number(data?.repeatCount)||1)),streak=Number(data?.giftType)===1;
 if(streak&&!data?.repeatEnd)return null;
 const diamonds=Math.max(0,Number(data?.diamondCount)||Number(data?.gift?.diamondCount)||0)*repeat,name=String(data?.giftName||data?.gift?.name||'Regalo').slice(0,60),rose=/rosa|rose/i.test(name),tier=rose||diamonds<=1?'rose':diamonds<100?'medium':'large';
 return {type:tier,viewer:viewerName(data),gift:name,diamonds,repeat}
}
function createTikTokLive({session,reply,body,connectorFactory,maxConnections=2,now=Date.now}={}){
 const connections=new Map(),streams=new Map(),idleTimers=new Map();
 const factory=connectorFactory||(async username=>{const {TikTokLiveConnection}=await import('tiktok-live-connector');return new TikTokLiveConnection(username,{enableExtendedGiftInfo:true})});
 function send(userId,payload){const text='event: live\ndata: '+JSON.stringify(payload)+'\n\n';for(const stream of streams.get(userId)||[])try{stream.write(text)}catch{}}
 function status(userId){const row=connections.get(userId);return row?{state:row.state,username:row.username,connectedAt:row.connectedAt||null,error:row.error||null}:{state:'disconnected',username:null,connectedAt:null,error:null}}
 function requireAdmin(user){if(!user)throw Object.assign(Error('Inicia sesión'),{status:401});if(user.role!=='admin')throw Object.assign(Error('Solo una cuenta administradora puede conectar un LIVE.'),{status:403})}
 function publish(row,payload){send(row.userId,{...payload,at:now()})}
 function attach(row){
  const on=(name,fn)=>{row.connector.on(name,fn);row.listeners.push([name,fn])};
  on('chat',data=>{if(String(data?.comment||'').trim().toLocaleLowerCase('es')==='!horda')publish(row,{type:'horde',viewer:viewerName(data)})});
  on('like',data=>publish(row,{type:'like',viewer:viewerName(data),count:Math.max(1,Math.min(100,Number(data?.likeCount)||1))}));
  on('gift',data=>{const event=giftEvent(data);if(event)publish(row,event)});
  const shared=data=>publish(row,{type:'share',viewer:viewerName(data)});on('share',shared);
  on('social',data=>{if(/share|comparti/i.test(String(data?.displayType||data?.label||'')))shared(data)});
  on('streamEnd',()=>{row.state='ended';publish(row,{type:'status',state:'ended',message:'El LIVE terminó.'})});
  on('disconnected',()=>{if(row.state!=='disconnected'){row.state='disconnected';publish(row,{type:'status',state:'disconnected',message:'TikTok cerró la conexión.'})}});
  on('error',error=>{row.error=String(error?.message||'Error de TikTok').slice(0,180);publish(row,{type:'status',state:row.state,error:row.error})});
 }
 async function disconnect(userId,message='Conexión cerrada.'){
  clearTimeout(idleTimers.get(userId));idleTimers.delete(userId);
  const row=connections.get(userId);if(!row)return;
  connections.delete(userId);row.state='disconnected';for(const [name,fn]of row.listeners)row.connector.off?.(name,fn);
  try{await row.connector.disconnect?.()}catch{}
  send(userId,{type:'status',state:'disconnected',message,at:now()})
 }
 async function connect(user,username){
  username=cleanUsername(username);if(!/^[a-z0-9._]{2,24}$/.test(username))throw Object.assign(Error('Escribe un usuario de TikTok válido, sin enlace ni contraseña.'),{status:400});
  await disconnect(user.id,'Cambiando de LIVE.');if(connections.size>=maxConnections)throw Object.assign(Error('El servidor ya tiene el máximo de conexiones LIVE de prueba.'),{status:429});
  const connector=await factory(username),row={userId:user.id,username,connector,state:'connecting',connectedAt:null,error:null,listeners:[]};connections.set(user.id,row);attach(row);publish(row,{type:'status',state:'connecting',username});
  try{const result=await connector.connect();if(connections.get(user.id)!==row)throw Object.assign(Error('La conexión fue cancelada.'),{status:409});row.state='connected';row.connectedAt=now();row.error=null;publish(row,{type:'status',state:'connected',username,roomId:String(result?.roomId||'')||null});return status(user.id)}catch(error){connections.delete(user.id);try{await connector.disconnect?.()}catch{}const message=String(error?.message||'No se pudo abrir el LIVE').slice(0,180);send(user.id,{type:'status',state:'error',username,error:message,at:now()});throw Object.assign(Error('No se pudo conectar con @'+username+'. Verifica que esté transmitiendo en público.'),{status:502,cause:error})}
 }
 function open(req,res,user,url){
  requireAdmin(user);if(url.searchParams.get('account')!==user.id)throw Object.assign(Error('La sesión cambió. Recarga la página.'),{status:409});
  clearTimeout(idleTimers.get(user.id));idleTimers.delete(user.id);
  res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-store','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write('retry: 3000\n\n');
  const set=streams.get(user.id)||new Set();set.add(res);streams.set(user.id,set);send(user.id,{type:'status',...status(user.id),at:now()});
  const timer=setInterval(()=>{if(session(req)?.id!==user.id){res.end();return}res.write(': ping\n\n')},25000);timer.unref?.();
  let closed=false;const close=()=>{if(closed)return;closed=true;clearInterval(timer);set.delete(res);if(!set.size){streams.delete(user.id);const idle=setTimeout(()=>{idleTimers.delete(user.id);disconnect(user.id,'La pestaña LIVE se cerró.')},60000);idle.unref?.();idleTimers.set(user.id,idle)}};req.on('close',close);res.on('close',close)
 }
 async function handle(req,res,user,url){
  try{requireAdmin(user);const route=url.pathname;
   if(route==='/api/admin/tiktok-live/events'&&req.method==='GET'){open(req,res,user,url);return true}
   if(req.headers['x-account-id']!==user.id){reply(res,409,{error:'La sesión cambió en otra pestaña. Recarga la página.'});return true}
   if(route==='/api/admin/tiktok-live/status'&&req.method==='GET'){reply(res,200,status(user.id));return true}
   if(route==='/api/admin/tiktok-live/connect'&&req.method==='POST'){const data=await body(req);reply(res,200,await connect(user,data.username));return true}
   if(route==='/api/admin/tiktok-live/disconnect'&&req.method==='POST'){await disconnect(user.id);reply(res,200,status(user.id));return true}
   reply(res,404,{error:'Ruta LIVE no encontrada'});return true
  }catch(error){if(!res.headersSent)reply(res,error.status||500,{error:error.status?error.message:'No se pudo completar la conexión LIVE'});else res.end();return true}
 }
 async function close(){for(const timer of idleTimers.values())clearTimeout(timer);idleTimers.clear();for(const id of [...connections.keys()])await disconnect(id,'Servidor desconectado.');for(const set of streams.values())for(const res of set)res.end();streams.clear()}
 return {handle,connect,disconnect,status,close,connections,streams}
}
module.exports={createTikTokLive,cleanUsername,viewerName,giftEvent};
