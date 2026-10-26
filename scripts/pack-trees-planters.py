from PIL import Image
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1];src=root/'public/assets/environment/trees-planters-v1.png';im=Image.open(src).convert('RGBA');out=Image.new('RGBA',(512,512));cells=[]
boxes=[('tree-olive',(0,0,580,666)),('tree-emerald',(580,0,im.width,666)),('planter-horizontal',(0,666,880,im.height)),('planter-vertical',(880,666,im.width,im.height))]
for i,(name,box) in enumerate(boxes):
    tile=im.crop(box);tile=tile.crop(tile.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox());tile.thumbnail((232,232),Image.Resampling.NEAREST);tile=tile.crop(tile.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox());x=i%2*256+(256-tile.width)//2;y=i//2*256+248-tile.height;out.alpha_composite(tile,(x,y));cells.append({'id':name,'x':x,'y':y,'w':tile.width,'h':tile.height})
dest=src.with_suffix('.webp');out.save(dest,lossless=True,exact=True,method=6)
audit={'source':'public/assets/environment/'+src.name,'runtime':'public/assets/environment/'+dest.name,'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'runtime_sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'bytes':dest.stat().st_size,'width':512,'height':512,'cells':cells,'method':'Built-in image_gen; mechanical isolated-object cropping and nearest-neighbor packing.'}
(root/'docs/trees-planters-audit.json').write_text(json.dumps(audit,indent=2)+'\n',encoding='utf8');print(json.dumps(audit))
