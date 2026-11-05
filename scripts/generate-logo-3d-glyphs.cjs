'use strict';
// Genera src/data/logo-3d-glyphs.js: contornos vectoriales de «KICK PERÚ», «ALL» y «STARS» (Luckiest Guy, con kerning)
// para extruirlos con three.js sin FontLoader. Uso:
//   node scripts/generate-logo-3d-glyphs.cjs <fuente.woff|ttf|otf> [salida.js]
// Necesita opentype.js (NO es dependencia del proyecto): instálalo fuera, p. ej. `npm i opentype.js` en una carpeta temporal
// y apunta a ella con OPENTYPE_PATH=<carpeta>/node_modules/opentype.js. La fuente sale de `npm pack @fontsource/luckiest-guy`
// (carpeta files/, WOFF; opentype.js no lee WOFF2). Licencia de la fuente: docs/arte/LOGO_3D_LICENCIAS.md.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),fontFile=process.argv[2],out=path.resolve(process.argv[3]||path.join(root,'src/data/logo-3d-glyphs.js'));
if(!fontFile){console.error('Falta la ruta de la fuente.');process.exit(1)}
let opentype;try{opentype=require(process.env.OPENTYPE_PATH||'opentype.js')}catch{console.error('No se encuentra opentype.js (usa OPENTYPE_PATH).');process.exit(1)}
const buf=fs.readFileSync(fontFile),font=opentype.parse(buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength));
const UNITS=1000,size=UNITS,r=n=>Math.round(n);
// Convierte el camino de opentype (y hacia abajo) a texto compacto con y hacia arriba, base de texto en y=0.
function piece(text){
 const p=font.getPath(text,0,0,size,{kerning:true}),bb=p.getBoundingBox(),x0=bb.x1,parts=[];
 for(const c of p.commands){const X=v=>r(v-x0),Y=v=>r(-v);
  if(c.type==='M'||c.type==='L')parts.push(c.type+X(c.x)+' '+Y(c.y));
  else if(c.type==='Q')parts.push('Q'+X(c.x1)+' '+Y(c.y1)+' '+X(c.x)+' '+Y(c.y));
  else if(c.type==='C')parts.push('C'+X(c.x1)+' '+Y(c.y1)+' '+X(c.x2)+' '+Y(c.y2)+' '+X(c.x)+' '+Y(c.y));
  else if(c.type==='Z')parts.push('Z')}
 return {d:parts.join(''),w:r(bb.x2-bb.x1),y0:r(-bb.y2),y1:r(-bb.y1)}}
const data={units:UNITS,font:'Luckiest Guy',kick:piece('KICK PERÚ'),all:piece('ALL'),stars:piece('STARS')};
const js='// Generado por scripts/generate-logo-3d-glyphs.cjs (Luckiest Guy, Apache-2.0). Solo datos: contornos con y hacia arriba, base en y=0.\n'
 +"// Rutas: M x y, L x y, Q cx cy x y, C c1x c1y c2x c2y x y (Z opcional: los contornos se cierran solos). w = ancho; y0/y1 = límites verticales; unidades = 1000 por em.\n"
 +'P.Logo3dGlyphs='+JSON.stringify(data)+';\n';
fs.writeFileSync(out,js);console.log('Escrito '+out+' ('+js.length+' bytes)');
for(const k of ['kick','all','stars'])console.log(k,'w='+data[k].w,'y0='+data[k].y0,'y1='+data[k].y1);
