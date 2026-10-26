from PIL import Image
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1];src=root/'public/assets/environment/street-furniture-v1.png';im=Image.open(src).convert('RGBA');out=Image.new('RGBA',(512,256));cells=[]
for i,(name,l,r) in enumerate([('park-bench',0,893),('colonial-bench',893,1821),('lamp',1821,im.width)]):
    tile=im.crop((l,0,r,im.height));tile=tile.crop(tile.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox());tile.thumbnail((240,112) if i<2 else (96,120),Image.Resampling.NEAREST);tile=tile.crop(tile.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox())
    x=i*256+(256-tile.width)//2 if i<2 else (128-tile.width)//2;y=(120 if i<2 else 252)-tile.height
    out.alpha_composite(tile,(x,y));cells.append({'id':name,'x':x,'y':y,'w':tile.width,'h':tile.height})
dest=src.with_suffix('.webp');out.save(dest,lossless=True,exact=True,method=6)
audit={'source':'public/assets/environment/'+src.name,'runtime':'public/assets/environment/'+dest.name,'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'runtime_sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'bytes':dest.stat().st_size,'width':512,'height':256,'cells':cells,'method':'Built-in image_gen; mechanical transparent-gap cropping and nearest-neighbor packing.'}
(root/'docs/street-furniture-audit.json').write_text(json.dumps(audit,indent=2)+'\n',encoding='utf8');print(json.dumps(audit))
