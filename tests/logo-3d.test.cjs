'use strict';
const test=require('node:test'),assert=require('node:assert'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');

test('los glifos del logo 3D definen rutas para ambos textos',()=>{
 const context={};context.P={};vm.createContext(context);vm.runInContext(read('src/data/logo-3d-glyphs.js'),context);
 const G=context.P.Logo3dGlyphs;assert.ok(G&&G.units>0);
 for(const key of ['kick','all','stars']){assert.match(G[key].d,/^M[-\d]/,key);assert.ok(G[key].w>0&&G[key].y1>G[key].y0,key)}
 assert.ok(read('src/data/logo-3d-glyphs.js').length<20000);
});

test('logo-3d.js se evalúa sin window ni THREE y no hace nada',()=>{
 const context={P:{Wordmark:{image(){return true}}}};vm.createContext(context);
 vm.runInContext(read('src/ui/logo-3d.js'),context);
 const L=context.P.Logo3d;assert.equal(L.supported(),false);assert.equal(L.attach({}),false);L.release();
 assert.equal(context.P.Wordmark.image({querySelector(){return {}}},'x',false),true);
});

test('el módulo del servidor no necesita three.js: la dependencia solo está en el HTML',()=>{
 assert.ok(!require('../scripts/modules.cjs').some(m=>/three/i.test(m.source)));
 assert.match(read('src/index.html'),/<script src="vendor\/three-r160\.min\.js"><\/script><script src="js\/data\.js">/);
});

test('el build publica vendor/three-r160.min.js y su licencia',()=>{
 const dist=path.join(root,'dist');if(!fs.existsSync(path.join(dist,'index.html')))require('node:child_process').execFileSync(process.execPath,[path.join(root,'scripts/build.cjs')],{cwd:root});
 assert.ok(fs.statSync(path.join(dist,'vendor/three-r160.min.js')).size>100000);
 assert.ok(fs.existsSync(path.join(dist,'vendor/three-LICENSE.txt')));
 assert.ok(fs.existsSync(path.join(dist,'js/logo-3d.js'))&&fs.existsSync(path.join(dist,'js/logo-3d-glyphs.js')));
 assert.match(fs.readFileSync(path.join(dist,'index.html'),'utf8'),/vendor\/three-r160\.min\.js/);
});
