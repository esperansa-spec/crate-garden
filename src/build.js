const fs=require('fs');const lv=JSON.parse(fs.readFileSync('levels.json','utf8'));
function minSteps(m){const H=m.length,W=Math.max(...m.map(r=>r.length));let walls=new Set,goals=new Set,boxes=[],p;
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=m[y][x]||' ',k=y*W+x;if(c=='#')walls.add(k);if('.*+'.includes(c))goals.add(k);if('$*'.includes(c))boxes.push(k);if('@+'.includes(c))p=k;}
const D=[1,-1,W,-W];const enc=(p,b)=>p+'|'+b.slice().sort((a,c)=>a-c).join(',');let q=[[p,boxes]],seen=new Set([enc(p,boxes)]),d=0;
while(q.length){const nq=[];for(const [pp,b] of q){if(b.every(x=>goals.has(x)))return d;for(const dd of D){const n=pp+dd;if(walls.has(n))continue;let nb=b;if(b.includes(n)){const m2=n+dd;if(walls.has(m2)||b.includes(m2))continue;nb=b.map(x=>x==n?m2:x);}const k=enc(n,nb);if(seen.has(k))continue;seen.add(k);nq.push([n,nb]);}}q=nq;d++;}return -1;}
lv.forEach(l=>{if(l.par==null){const t=Date.now();l.par=minSteps(l.map);console.log(l.name,l.par,(Date.now()-t)+"ms")}});fs.writeFileSync("levels.json",JSON.stringify(lv));
let h=fs.readFileSync('game.src.html','utf8');
h=h.replace('/*ASSETS*/',()=>fs.readFileSync('assets.js','utf8')).replace('/*LEVELS*/',()=>JSON.stringify(lv));
fs.writeFileSync(process.argv[2],h);console.log('bytes',h.length);
