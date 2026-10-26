from PIL import Image
from collections import deque
import json
im=Image.open('public/assets/bosses/gallinazo-phase2-v1.png').convert('RGBA'); w,h=im.size; a=bytearray(v>150 for v in im.getchannel('A').getdata()); found=[]
for start in range(w*h):
 if not a[start]: continue
 a[start]=0; q=deque([start]); n=0; l=w; r=0; top=h; bottom=0; pixels=[]
 while q:
  p=q.pop(); pixels.append(p); y,x=divmod(p,w); n+=1; l=min(l,x);r=max(r,x);top=min(top,y);bottom=max(bottom,y)
  for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
   if 0<=nx<w and 0<=ny<h:
    j=ny*w+nx
    if a[j]: a[j]=0;q.append(j)
 if n>1000: found.append((n,(l,top,r+1,bottom+1),pixels))
assert len(found)==8, 'Expected exactly eight complete bodies'
found.sort(key=lambda item:(0 if item[1][1]<400 else 1,item[1][0]))
out=Image.new('RGBA',(2048,1024)); src=im.load(); dst=out.load(); metadata=[]
for i,(n,(l,top,r,bottom),pixels) in enumerate(found):
 assert r-l<500 and bottom-top<490
 ox=(i%4)*512+(512-(r-l))//2; oy=(i//4)*512+481-(bottom-top)
 for p in pixels:
  y,x=divmod(p,w); dst[ox+x-l,oy+y-top]=src[x,y]
 metadata.append({'source_bounds':[l,top,r,bottom],'pixels':n,'packed_bounds':[ox,oy,ox+r-l,oy+bottom-top]})
out.save('public/assets/bosses/gallinazo-phase2-v1.webp',quality=88,method=6)
with open('public/assets/bosses/gallinazo-phase2-frames.json','w') as f: json.dump(metadata,f,indent=2)
print('Packed eight complete connected bodies without resizing:',out.size)
