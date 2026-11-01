from PIL import Image
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1];src=root/'public/assets/environment/campo-landmarks-v1.png';im=Image.open(src).convert('RGBA');out=Image.new('RGBA',(512,256));cells=[]
for i,(name,l,r) in enumerate([('monument',0,861),('picnic-cloth',861,1528),('picnic-basket',1528,im.width)]):
    tile=im.crop((l,0,r,im.height));tile=tile.crop(tile.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox());tile.thumbnail((232,232) if i==0 else (232,112),Image.Resampling.NEAREST);tile=tile.crop(tile.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox());x=(256-tile.width)//2 if i==0 else 256+(256-tile.width)//2;y=(248 if i==0 or i==2 else 120)-tile.height;out.alpha_composite(tile,(x,y));cells.append({'id':name,'x':x,'y':y,'w':tile.width,'h':tile.height})
dest=src.with_suffix('.webp');out.save(dest,lossless=True,exact=True,method=6)
audit={'source':'public/assets/environment/'+src.name,'runtime':'public/assets/environment/'+dest.name,'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'runtime_sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'bytes':dest.stat().st_size,'width':512,'height':256,'cells':cells,'method':'Built-in image_gen; mechanical transparent-gap cropping and nearest-neighbor packing.'}
(root/'docs/arte/auditorias/campo-landmarks-audit.json').write_text(json.dumps(audit,indent=2)+'\n',encoding='utf8');print(json.dumps(audit))
