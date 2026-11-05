'use strict';
const crypto=require('node:crypto');
const MAX_TRACK_SIZE=50*1024*1024,MAX_TRACKS=20,MAX_LIBRARY_SIZE=500*1024*1024;
const TYPES=new Set(['audio/mpeg','audio/ogg','audio/wav','audio/webm','audio/mp4','audio/aac','audio/flac','audio/x-flac']);
const MAP_IDS=new Set(['campo','plaza','machu','halloween','navidad','ruta-chosicano','distrito-gabinete','santuario-niebla','azoteas-lima','archivo-final']);
const BUILTIN_CHOICES=new Set(['original','tema1','tema2','alternate','none']);
function createMusic({db,reply,now=Date.now,bodyTimeout=60000}={}){
 db.exec(`CREATE TABLE IF NOT EXISTS music_tracks(
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL CHECK(size BETWEEN 1 AND ${MAX_TRACK_SIZE}),
  content BLOB NOT NULL,
  uploader_id TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL
 );`);
 db.exec(`CREATE TABLE IF NOT EXISTS music_map_policies(
  map_id TEXT PRIMARY KEY,
  default_choice TEXT NOT NULL,
  allowed_choices TEXT NOT NULL,
  allow_player_choice INTEGER NOT NULL CHECK(allow_player_choice IN (0,1)),
  updated_at INTEGER NOT NULL
 );`);
 const metadata=row=>({id:row.id,title:row.title,type:row.content_type,size:row.size,createdAt:row.created_at});
 const choiceExists=choice=>BUILTIN_CHOICES.has(choice)||/^server:[a-f0-9-]{36}$/i.test(choice)&&!!db.prepare('SELECT 1 FROM music_tracks WHERE id=?').get(choice.slice(7));
 const normalizeChoices=choices=>[...new Set((Array.isArray(choices)?choices:[]).map(String).filter(choiceExists))].slice(0,25);
 const policy=row=>{if(!row)return null;let allowed=[];try{allowed=normalizeChoices(JSON.parse(row.allowed_choices))}catch{}if(!allowed.length)allowed=['original','tema1','tema2','alternate','none'];const fallback=allowed.includes(row.default_choice)?row.default_choice:allowed[0];return {mapId:row.map_id,defaultChoice:fallback,allowedChoices:allowed,allowPlayerChoice:!!row.allow_player_choice,updatedAt:row.updated_at}};
 const policies=()=>db.prepare('SELECT * FROM music_map_policies ORDER BY map_id').all().map(policy);
 const canManage=user=>!!user&&(user.role==='admin'||!!user.entitlements?.music);
 function json(res,status,data){reply(res,status,data)}
 function requireManager(req,res,user){if(!user){json(res,401,{error:'Inicia sesión para gestionar la música'});return false}if(req.headers['x-account-id']!==user.id){json(res,409,{error:'La sesión cambió en otra pestaña. Recarga antes de continuar.'});return false}if(!canManage(user)){json(res,403,{error:'Tu cuenta no tiene permiso para gestionar música'});return false}return true}
 async function readAudio(req){
  const declared=Number(req.headers['content-length']);if(Number.isFinite(declared)&&(declared<1||declared>MAX_TRACK_SIZE))throw Object.assign(Error('La pista debe pesar entre 1 byte y 50 MB'),{status:413});
  const chunks=[];let size=0;const timer=setTimeout(()=>req.destroy(Object.assign(Error('Tiempo de subida agotado'),{status:408})),bodyTimeout);
  try{for await(const chunk of req){size+=chunk.length;if(size>MAX_TRACK_SIZE)throw Object.assign(Error('La pista supera 50 MB'),{status:413});chunks.push(chunk)}}finally{clearTimeout(timer)}
  if(!size)throw Object.assign(Error('La pista está vacía'),{status:400});return Buffer.concat(chunks,size)
 }
 async function readJson(req){
  const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>65536)throw Object.assign(Error('Configuración demasiado grande'),{status:413});chunks.push(chunk)}
  try{return JSON.parse(Buffer.concat(chunks,size).toString('utf8')||'{}')}catch{throw Object.assign(Error('Configuración inválida'),{status:400})}
 }
 async function handle(req,res,user,url){
  const route=url.pathname;
  if(route==='/api/music'&&req.method==='GET'){
   const rows=db.prepare('SELECT id,title,content_type,size,created_at FROM music_tracks ORDER BY created_at DESC,id DESC').all();json(res,200,{tracks:rows.map(metadata),policies:policies(),canManage:canManage(user),limit:MAX_TRACK_SIZE});return;
  }
  const policyMatch=route.match(/^\/api\/music\/policy\/([a-z0-9-]+)$/i);
  if(policyMatch&&req.method==='PUT'){
   if(!requireManager(req,res,user))return;const mapId=policyMatch[1].toLowerCase();if(!MAP_IDS.has(mapId)){json(res,400,{error:'Mapa no reconocido'});return}
   const body=await readJson(req),allowed=normalizeChoices(body.allowedChoices);if(!allowed.length){json(res,400,{error:'Elige al menos un tema permitido'});return}const defaultChoice=String(body.defaultChoice||'');if(!allowed.includes(defaultChoice)){json(res,400,{error:'El tema predeterminado debe estar permitido'});return}
   const updatedAt=now();db.prepare(`INSERT INTO music_map_policies(map_id,default_choice,allowed_choices,allow_player_choice,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(map_id) DO UPDATE SET default_choice=excluded.default_choice,allowed_choices=excluded.allowed_choices,allow_player_choice=excluded.allow_player_choice,updated_at=excluded.updated_at`).run(mapId,defaultChoice,JSON.stringify(allowed),body.allowPlayerChoice?1:0,updatedAt);json(res,200,{policy:policy(db.prepare('SELECT * FROM music_map_policies WHERE map_id=?').get(mapId))});return;
  }
  const match=route.match(/^\/api\/music\/([a-f0-9-]{36})(?:\/file)?$/i);
  if(match&&req.method==='GET'&&route.endsWith('/file')){
   const row=db.prepare('SELECT content_type,size,content FROM music_tracks WHERE id=?').get(match[1]);if(!row){json(res,404,{error:'Pista no encontrada'});return}
   const range=(req.headers.range||'').match(/^bytes=(\d*)-(\d*)$/),headers={'Content-Type':row.content_type,'Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'};
   if(range){let start=range[1]?Number(range[1]):0,end=range[2]?Number(range[2]):row.size-1;if(!range[1]&&range[2]){const suffix=Number(range[2]);start=Math.max(0,row.size-suffix);end=row.size-1}if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||end<start||start>=row.size){res.writeHead(416,{...headers,'Content-Range':'bytes */'+row.size});res.end();return}end=Math.min(end,row.size-1);const body=row.content.subarray(start,end+1);res.writeHead(206,{...headers,'Content-Length':body.length,'Content-Range':`bytes ${start}-${end}/${row.size}`});res.end(body);return}
   res.writeHead(200,{...headers,'Content-Length':row.size});res.end(row.content);return;
  }
  if(route==='/api/music'&&req.method==='POST'){
   if(!requireManager(req,res,user))return;const type=(req.headers['content-type']||'').split(';')[0].trim().toLowerCase();if(!TYPES.has(type)){json(res,415,{error:'Formato de audio no permitido'});return}
   let title;try{title=decodeURIComponent(String(req.headers['x-music-name']||''))}catch{title=''}title=title.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,120);if(!title){json(res,400,{error:'La pista necesita un nombre'});return}
   const count=db.prepare('SELECT COUNT(*) AS count,COALESCE(SUM(size),0) AS size FROM music_tracks').get();if(count.count>=MAX_TRACKS){json(res,409,{error:'La biblioteca alcanzó el máximo de 20 pistas'});return}
   const content=await readAudio(req);if(count.size+content.length>MAX_LIBRARY_SIZE){json(res,409,{error:'La biblioteca alcanzó su límite total de 500 MB'});return}
   const id=crypto.randomUUID(),createdAt=now();db.prepare('INSERT INTO music_tracks VALUES(?,?,?,?,?,?,?)').run(id,title,type,content.length,content,user.id,createdAt);json(res,201,{track:{id,title,type,size:content.length,createdAt},canManage:true,limit:MAX_TRACK_SIZE});return;
  }
  if(match&&req.method==='PATCH'&&!route.endsWith('/file')){
   if(!requireManager(req,res,user))return;let title;try{title=decodeURIComponent(String(req.headers['x-music-name']||''))}catch{title=''}title=title.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,120);if(!title){json(res,400,{error:'La pista necesita un nombre'});return}
   const changed=db.prepare('UPDATE music_tracks SET title=? WHERE id=?').run(title,match[1]);if(!changed.changes){json(res,404,{error:'Pista no encontrada'});return}const row=db.prepare('SELECT id,title,content_type,size,created_at FROM music_tracks WHERE id=?').get(match[1]);json(res,200,{track:metadata(row)});return;
  }
  if(match&&req.method==='DELETE'&&!route.endsWith('/file')){
   if(!requireManager(req,res,user))return;const removed=db.prepare('DELETE FROM music_tracks WHERE id=?').run(match[1]);if(!removed.changes){json(res,404,{error:'Pista no encontrada'});return}const removedChoice='server:'+match[1];for(const row of db.prepare('SELECT * FROM music_map_policies').all()){const current=policy(row),allowed=current.allowedChoices.filter(choice=>choice!==removedChoice);if(!allowed.length)allowed.push('alternate');const fallback=allowed.includes(current.defaultChoice)?current.defaultChoice:allowed[0];db.prepare('UPDATE music_map_policies SET default_choice=?,allowed_choices=?,updated_at=? WHERE map_id=?').run(fallback,JSON.stringify(allowed),now(),row.map_id)}json(res,200,{ok:true});return;
  }
  json(res,404,{error:'Ruta no encontrada'});
 }
 return {handle,canManage};
}
module.exports={createMusic,MAX_TRACK_SIZE};
