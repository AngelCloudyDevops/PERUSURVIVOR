const {app,BrowserWindow,Menu,session,shell}=require('electron');
const path=require('node:path');
const {GAME_URL,isGameUrl,externalUrl}=require('./security.cjs');

app.setAppUserModelId('tech.michitech.perusurvivor');
app.enableSandbox();

function openExternal(raw){const url=externalUrl(raw);if(!url)return false;shell.openExternal(url);return true}

function createMenu(window){return Menu.buildFromTemplate([
 {label:'Juego',submenu:[
  {label:'Recargar',accelerator:'CmdOrCtrl+R',click:()=>window.webContents.reload()},
  {label:'Pantalla completa',accelerator:'F11',click:()=>window.setFullScreen(!window.isFullScreen())},
  {type:'separator'},
  {label:'Salir',accelerator:'Alt+F4',click:()=>app.quit()},
 ]},
 {label:'Ayuda',submenu:[
  {label:'Abrir versión web',click:()=>shell.openExternal(GAME_URL)},
  {label:'Reportar un problema',click:()=>shell.openExternal('https://github.com/AngelCloudyDevops/PERUSURVIVOR/issues')},
 ]},
])}

async function loadGame(window){
 try{await window.loadURL(GAME_URL)}catch(error){
  if(!window.isDestroyed())await window.loadFile(path.join(__dirname,'offline.html'));
  console.error('No se pudo cargar Kick All Stars Perú:',error.message);
 }
}

function createWindow(){
 const gameSession=session.fromPartition('persist:perusurvivor');
 gameSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
 gameSession.setPermissionCheckHandler(()=>false);
 const window=new BrowserWindow({
  title:'Kick All Stars Perú',
  width:1440,
  height:900,
  minWidth:960,
  minHeight:600,
  backgroundColor:'#071522',
  show:false,
  autoHideMenuBar:true,
  icon:path.join(__dirname,'..','build','windows','icon.ico'),
  webPreferences:{
   partition:'persist:perusurvivor',
   nodeIntegration:false,
   contextIsolation:true,
   sandbox:true,
   webSecurity:true,
   allowRunningInsecureContent:false,
   devTools:false,
  },
 });
 Menu.setApplicationMenu(createMenu(window));
 window.once('ready-to-show',()=>window.show());
 window.webContents.setWindowOpenHandler(({url})=>{if(isGameUrl(url))window.loadURL(url);else openExternal(url);return {action:'deny'}});
 window.webContents.on('will-navigate',(event,url)=>{if(isGameUrl(url)||url.startsWith('file:'))return;event.preventDefault();openExternal(url)});
 window.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&input.key==='F11'){event.preventDefault();window.setFullScreen(!window.isFullScreen())}});
 loadGame(window);
 return window;
}

app.whenReady().then(()=>{
 createWindow();
 app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});

