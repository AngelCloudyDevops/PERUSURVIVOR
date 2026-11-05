const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const security=require('../desktop/security.cjs');

test('Escritorio: solo el dominio oficial permanece dentro del cliente',()=>{
 assert.equal(security.isGameUrl('https://perusurvivor.michitech.tech/'),true);
 assert.equal(security.isGameUrl('https://perusurvivor.michitech.tech/?desktop=1'),true);
 assert.equal(security.isGameUrl('https://perusurvivor.michitech.tech.evil.test/'),false);
 assert.equal(security.isGameUrl('http://perusurvivor.michitech.tech/'),false);
 assert.equal(security.isGameUrl('not a url'),false);
});

test('Escritorio: enlaces externos se limitan a destinos HTTPS conocidos',()=>{
 assert.equal(security.externalUrl('https://discord.com/invite/example'),'https://discord.com/invite/example');
 assert.equal(security.externalUrl('https://github.com/AngelCloudyDevops/PERUSURVIVOR/issues'),'https://github.com/AngelCloudyDevops/PERUSURVIVOR/issues');
 assert.equal(security.externalUrl('javascript:alert(1)'),null);
 assert.equal(security.externalUrl('https://example.com/'),null);
});

test('Escritorio: Electron queda aislado y produce instalador más portátil',()=>{
 const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'desktop/main.cjs'),'utf8'),offline=fs.readFileSync(path.join(root,'desktop/offline.html'),'utf8'),pkg=require('../package.json');
 assert.match(source,/nodeIntegration:false/);
 assert.match(source,/contextIsolation:true/);
 assert.match(source,/sandbox:true/);
 assert.match(source,/webSecurity:true/);
 assert.match(source,/setPermissionRequestHandler/);
 assert.match(offline,/Content-Security-Policy/);
 const icon=fs.readFileSync(path.join(root,'build/windows/icon.ico'));
 assert.deepEqual([...icon.subarray(0,4)],[0,0,1,0]);
 assert(icon.length>100000);
 assert.deepEqual(pkg.build.win.target.map(target=>target.target),['nsis','portable']);
 assert.equal(pkg.build.appId,'tech.michitech.perusurvivor');
});
