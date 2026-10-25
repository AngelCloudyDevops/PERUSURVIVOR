'use strict';
// El contenedor no necesita Docker socket ni privilegios para seguir la release activa.
const fs=require('node:fs'),{spawn}=require('node:child_process');
let child=null,current='',stopping=false;
function update(){if(stopping)return;let release;try{release=fs.realpathSync('/releases/live/current')}catch{return}if(!fs.existsSync(release+'/backend/cooperative.cjs')||child&&current===release)return;
 if(child){child.kill('SIGTERM');return}current=release;child=spawn(process.execPath,[release+'/backend/cooperative.cjs'],{env:{...process.env,NODE_PATH:'/runtime/node_modules'},stdio:'inherit'});child.on('exit',()=>{child=null;if(stopping)process.exit(0)})}
update();setInterval(update,2000);process.on('SIGTERM',()=>{stopping=true;if(child)child.kill('SIGTERM');else process.exit(0);setTimeout(()=>process.exit(0),4000).unref()});
