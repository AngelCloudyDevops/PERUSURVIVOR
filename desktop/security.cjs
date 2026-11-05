const GAME_URL='https://perusurvivor.michitech.tech/';
const GAME_ORIGIN=new URL(GAME_URL).origin;
const SAFE_EXTERNAL_ORIGINS=new Set([
 'https://discord.com',
 'https://www.discord.com',
 'https://github.com',
]);

function safeUrl(raw){try{return new URL(raw)}catch{return null}}
function isGameUrl(raw){const url=safeUrl(raw);return !!url&&url.origin===GAME_ORIGIN}
function externalUrl(raw){const url=safeUrl(raw);if(!url||url.protocol!=='https:'||(!SAFE_EXTERNAL_ORIGINS.has(url.origin)&&url.origin!==GAME_ORIGIN))return null;return url.href}

module.exports={GAME_URL,GAME_ORIGIN,safeUrl,isGameUrl,externalUrl};
