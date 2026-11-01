'use strict';
// IP real del cliente: X-Real-IP solo se acepta si el par TCP es un proxy de confianza (TRUSTED_PROXIES: IP/CIDR separados por coma).
const net=require('node:net');
const DEFAULT='127.0.0.0/8,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,fc00::/7',lists=new Map();
const plain=a=>String(a||'').replace(/^::ffff:(?=\d+\.)/i,'');
function trusted(spec){let list=lists.get(spec);if(!list){list=new net.BlockList();for(const s of spec.split(',').map(s=>s.trim()).filter(Boolean)){const [a,bits]=s.split('/'),type=net.isIPv6(a)?'ipv6':'ipv4';try{bits?list.addSubnet(a,Number(bits),type):list.addAddress(a,type)}catch{}}lists.set(spec,list)}return list}
function clientIp(req,spec=process.env.TRUSTED_PROXIES||DEFAULT){const peer=plain(req.socket?.remoteAddress);if(!peer)return '';const real=plain(String(req.headers['x-real-ip']||'').trim());return real&&net.isIP(real)&&net.isIP(peer)&&trusted(spec).check(peer,net.isIPv6(peer)?'ipv6':'ipv4')?real:peer}
module.exports={clientIp};
