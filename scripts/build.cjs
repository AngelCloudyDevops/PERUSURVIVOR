const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist'),modules=require('./modules.cjs');
// Estos atlas se conservan como fuentes; simpleStyle no los solicita en ejecución.
const archivedMapArt=new Set(['campo-props-v1','plaza-props-v1','machu-props-v1','ground-tiles-v1'].map(id=>'assets/environment/'+id+'.webp'));
// Prompts y metadatos de autoría: permanecen en Git; el runtime no los solicita.
const archivedCinematics=new Set(['assets/characters/sideral-attack-v1.webp','assets/characters/sideral-domain-v1.png','assets/characters/sideral-domain-v2.png','assets/characters/cristorata-reaction-v2.webp','assets/characters/sandy-court-v1.webp','assets/arenas/gallinazo-lima-night-v1.webp','assets/arenas/gallinazo-lima-night-v2.webp','assets/bosses/gallinazo-comic-v1.webp','assets/characters/makanaky-domain-back-v1.webp','assets/characters/makanaky-domain-portrait-v1.webp','assets/scenarios/cirilo-midnight-court-v1.webp','assets/enemies/extinction-dinosaurs-v1.webp','assets/minibosses/huaco-v1.webp']);
const sourceMetadata=new Set(['assets/characters/chamelin-domain-motion-v1.png','assets/characters/chamelin-v1.png','assets/characters/sideral-ur-v1.json','assets/characters/atlas.json','assets/characters/powers-atlas.json','assets/characters/streamers-atlas.json','assets/enemies/gallinazos-atlas.json','assets/enemies/rivales-atlas.json','assets/characters/kingteka-ultimate-portrait.json','assets/bosses/gallinazo-phase2-frames.json','assets/bosses/gallinazo-rig-frames.json']);
// Authoring manifests are preserved in Git; frame data is already inline in the renderer.
for(const name of ['companion-cheer-v1','cristorata-reaction-v3','cristorata-reaction-v2','cristorata-dragon-v1','cristorata-secret-v1','makanaky-boxing-rig-v1','makanaky-domain-activation-v1','makanaky-domain-back-v1','makanaky-domain-back-v2','makanaky-domain-portrait-v1'])sourceMetadata.add('assets/characters/'+name+'.json');
// Superseded attack sheets remain in Git; runtime loads directional aim atlases.
const directionalAttackIds=new Set(JSON.parse(fs.readFileSync(path.join(root,'src/rendering/walk-art.js'),'utf8').match(/directionalIds:(\[[^\]]*\])/)[1]));
const legacyCourtArt=new Set(['judge-v1','fujimori-objection-v1'].map(id=>'assets/court/'+id+'.webp'));
function archivedAsset(rel){const normalized=rel.split(path.sep).join('/'),oldAttack=normalized.match(/^assets\/attacks\/([a-z0-9-]+)-attack-v1\.webp$/);if(normalized.split('/').at(-1)==='.gitkeep')return true;if(oldAttack&&directionalAttackIds.has(oldAttack[1]))return true;if(legacyCourtArt.has(normalized)&&/judge-joints-v2/.test(fs.readFileSync(path.join(root,'src/rendering/court-art.js'),'utf8')))return true;if(normalized==='assets/arenas/combi-v1.webp'&&/combi-packed-v2/.test(fs.readFileSync(path.join(root,'src/rendering/boss-art.js'),'utf8')))return true;if(normalized==='assets/bosses/chosicano-v1.webp'&&/chosicano-v2/.test(fs.readFileSync(path.join(root,'src/rendering/chosicano-art.js'),'utf8')))return true;if(normalized==='assets/bosses/boss-atlas-v1.webp'&&/boss-atlas-packed-v2/.test(fs.readFileSync(path.join(root,'src/rendering/boss-art.js'),'utf8')))return true;if(sourceMetadata.has(normalized)||archivedCinematics.has(normalized)||normalized.endsWith('.prompt.txt'))return true;return archivedMapArt.has(normalized)&&/simpleStyle\s*:\s*true/.test(fs.readFileSync(path.join(root,'src/rendering/map-art.js'),'utf8'))}
function copy(from,to){fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to)}
function minifyCss(source){
 const strings=[];let css='',quote='',escaped=false;
 for(let i=0;i<source.length;i++){
  const char=source[i],next=source[i+1];
  if(quote){css+=char;if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char===quote)quote='';continue}
  if(char==='"'||char==="'"){quote=char;const marker='\0'+strings.length+'\0',start=css.length;css+=marker;let value=char;i++;for(;i<source.length;i++){const current=source[i];value+=current;if(escaped)escaped=false;else if(current==='\\')escaped=true;else if(current===quote){quote='';break}}strings.push(value);if(quote){css=css.slice(0,start)+value;quote=''}continue}
  if(char==='/'&&next==='*'){i+=2;while(i<source.length&&!(source[i]==='*'&&source[i+1]==='/'))i++;i++;continue}
  css+=char;
 }
 css=css.replace(/\s+/g,' ').replace(/\s*([{},;>])\s*/g,'$1').replace(/:\s+/g,':').replace(/\(\s+/g,'(').replace(/\s+\)/g,')').replace(/;}+/g,'}').trim();
 return css.replace(/\0(\d+)\0/g,(_,index)=>strings[Number(index)]);
}
function build(){
 // dist es una salida reconstruible; comprobar el destino antes de limpiarlo.
 if(path.dirname(out)!==root||path.basename(out)!=='dist')throw new Error('Destino de build inválido');
 if(fs.existsSync(out)&&fs.lstatSync(out).isSymbolicLink())throw new Error('dist no puede ser un enlace simbólico');
 fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
 copy(path.join(root,'src/index.html'),path.join(out,'index.html'));
 fs.writeFileSync(path.join(out,'style.css'),minifyCss(fs.readFileSync(path.join(root,'src/ui/styles.css'),'utf8')));
 for(const m of modules)copy(path.join(root,m.source),path.join(out,m.output));
 fs.cpSync(path.join(root,'public'),out,{recursive:true,filter:source=>!sourceMetadata.has(path.relative(path.join(root,'public'),source).split(path.sep).join('/'))&&!archivedAsset(path.relative(path.join(root,'public'),source))&&!/(?:^|[\\/])(?:.*-)?prompts?\.json$/.test(source)&&!source.endsWith('.prompt.txt')&&(!source.endsWith('.png')||!fs.existsSync(source.slice(0,-4)+'.webp'))&&(!source.endsWith('-walk-v1.webp')||!fs.existsSync(source.replace('-walk-v1.webp','-walk-v2.webp')))});
 fs.cpSync(path.join(root,'backend'),path.join(out,'backend'),{recursive:true});
 fs.writeFileSync(path.join(out,'backend/modules.json'),JSON.stringify(modules.map(m=>m.output)));
 copy(path.join(root,'package-lock.json'),path.join(out,'backend/package-lock.json'));
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));fs.writeFileSync(path.join(out,'backend/package.json'),JSON.stringify({name:manifest.name,version:manifest.version,private:true,scripts:{start:'node cooperative.cjs'},engines:manifest.engines,dependencies:manifest.dependencies})+'\n');
 copy(path.join(root,'ops/hostinger/backup-accounts.py'),path.join(out,'backend/backup-accounts.py'));
 for(const name of ['receive.py','update-release.py','install-staging.py'])copy(path.join(root,'ops/hostinger',name),path.join(out,'backend/ops',name));
 // Identidad reproducible del contenido; cada recurso cambia de URL cuando cambia.
 const digest=crypto.createHash('sha256');function fingerprint(dir){for(const name of fs.readdirSync(dir).sort()){const file=path.join(dir,name);if(fs.statSync(file).isDirectory())fingerprint(file);else{digest.update(path.relative(out,file).split(path.sep).join('/'));digest.update(fs.readFileSync(file))}}}fingerprint(out);const version=digest.digest('hex').slice(0,20);
 const index=path.join(out,'index.html');let html=fs.readFileSync(index,'utf8');for(const mod of modules)if(!html.includes('src="'+mod.output+'"'))html=html.replace('</body>','<script src="'+mod.output+'"></script></body>');html=html.replace('</head>','<meta name="game-version" content="'+version+'"></head>');html=html.replace(/(src|href)="((?:js\/[^"?]+\.js|style\.css))"/g,(_,attribute,file)=>attribute+'="'+file+'?v='+crypto.createHash('sha256').update(fs.readFileSync(path.join(out,file))).digest('hex').slice(0,16)+'"');fs.writeFileSync(index,html);fs.writeFileSync(path.join(out,'version.json'),JSON.stringify({version})+'\n');
 const qa=path.join(out,'qa-portals.html');if(fs.existsSync(qa))fs.unlinkSync(qa);
 console.log('Build listo: dist/ ('+modules.length+' módulos)');
}
module.exports={build,archivedAsset};if(require.main===module)build();
