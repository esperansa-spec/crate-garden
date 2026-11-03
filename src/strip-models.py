import json,struct,sys,base64
src,out=sys.argv[1],sys.argv[2]
names=['character','brick','block-coin','platform','coin','grass','grass-small','flag','cloud']
res={}
for n in names:
    b=open(f'{src}/models/{n}.glb','rb').read()
    l=struct.unpack('<I',b[12:16])[0]; j=json.loads(b[20:20+l]); rest=b[20+l:]
    for k in ['images','textures','samplers']: j.pop(k,None)
    for m in j.get('materials',[]):
        m.get('pbrMetallicRoughness',{}).pop('baseColorTexture',None)
    js=json.dumps(j,separators=(',',':')).encode()
    js+=b' '*((4-len(js)%4)%4)
    nb=b[:12]+struct.pack('<I',len(js))+b'JSON'+js+rest
    nb=nb[:8]+struct.pack('<I',len(nb))+nb[12:]
    res[n]=base64.b64encode(nb).decode()
res['colormap']=base64.b64encode(open(f'{src}/models/Textures/colormap.png','rb').read()).decode()
open(out,'w').write('const ASSETS='+json.dumps(res)+';')
print({k:len(v) for k,v in res.items()})
