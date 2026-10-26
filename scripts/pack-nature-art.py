from PIL import Image
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1]
src=root/'public/assets/environment/nature-atlas-v2.png'
im=Image.open(src).convert('RGBA')
out=Image.new('RGBA',(512,256))
cells=[]
for row in range(2):
    for col in range(4):
        box=(round(col*im.width/4),round(row*im.height/2),round((col+1)*im.width/4),round((row+1)*im.height/2))
        tile=im.crop(box)
        # Shared source scale for bird poses preserves body size and the same ground anchor.
        if row==0:
            tile.thumbnail((116,116),Image.Resampling.NEAREST)
            x=col*128+(128-tile.width)//2;y=120-tile.height
        else:
            tile=tile.crop(tile.getchannel("A").point(lambda a:255 if a>64 else 0).getbbox())
            tile.thumbnail((112,104),Image.Resampling.NEAREST)
            tile=tile.crop(tile.getchannel("A").point(lambda a:255 if a>64 else 0).getbbox())
            x=col*128+(128-tile.width)//2;y=248-tile.height
        out.alpha_composite(tile,(x,y))
        cells.append({'row':row,'col':col,'bounds':list(out.crop((col*128,row*128,(col+1)*128,(row+1)*128)).getbbox())})
dest=src.with_suffix('.webp')
out.save(dest,lossless=True,method=6)
audit={'source':str(src.relative_to(root)).replace('\\','/'),'runtime':str(dest.relative_to(root)).replace('\\','/'),'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'runtime_sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'width':512,'height':256,'bytes':dest.stat().st_size,'cells':cells,'method':'Built-in image_gen; transparent 4x2 atlas. Mechanical nearest-neighbor packing only.'}
(root/'docs/nature-art-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'source_size':im.size,'runtime_bytes':dest.stat().st_size,'cells':cells}))
