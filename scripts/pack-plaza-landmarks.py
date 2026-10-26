from PIL import Image
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1];src=root/'public/assets/environment/plaza-landmarks-v1.png'
im=Image.open(src).convert('RGBA');out=Image.new('RGBA',(1024,512));cells=[]
# Transparent gap between the generated objects; keep the facade's left cornice intact.
cut=806
for i,(name,box) in enumerate([('fountain',(0,0,cut,im.height)),('facade',(cut,0,im.width,im.height))]):
    tile=im.crop(box);tile=tile.crop(tile.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox());tile.thumbnail((480,480),Image.Resampling.NEAREST)
    tile=tile.crop(tile.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox());x=i*512+(512-tile.width)//2;y=496-tile.height
    out.alpha_composite(tile,(x,y));cells.append({'id':name,'x':x,'y':y,'w':tile.width,'h':tile.height})
dest=src.with_suffix('.webp');out.save(dest,lossless=True,method=6)
audit={'source':'public/assets/environment/'+src.name,'runtime':'public/assets/environment/'+dest.name,'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'runtime_sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'bytes':dest.stat().st_size,'width':1024,'height':512,'cells':cells,'method':'Built-in image_gen; mechanical crop along transparent gap and nearest-neighbor packing.'}
(root/'docs/plaza-landmarks-audit.json').write_text(json.dumps(audit,indent=2)+'\n',encoding='utf8');print(json.dumps(audit))
