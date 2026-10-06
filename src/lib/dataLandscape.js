import { createSpatialEngine } from './spatialEngine.js';
import { terrainAnchors, terrainHeight } from './dataWorld.js';
// One lazy Three renderer shared by the visible hero and closing surface.
const hosts=new Map();
let engine,pending,active,observer,resizeObserver,idleTimer,last=0,elapsed=0,generation=0;
let mouse={x:0,y:0},target={x:0,y:0};
let layout;
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
async function createEngine(){
 if(engine)return engine;if(pending)return pending;const version=generation;
 pending=import('three').then(T=>{
  if(version!==generation||!hosts.size||motion.matches)return null;
  engine=createSpatialEngine(T,{mobile:window.innerWidth<768,
    onContextLost(){active?.classList.remove('landscape-live');},
    onContextRestored(){activate();}
  });
  engine.renderer.domElement.className='landscape-canvas';
  engine.renderer.domElement.__vogelLandscape={getState:getLandscapeState};
  return engine;
 }).catch(()=>null).finally(()=>{pending=null;});return pending;
}
function stop(){engine?.pause();last=0;}
function destroyEngine(){stop();engine?.dispose();engine=null;active?.classList.remove('landscape-live');}
function size(){
 if(!active||!engine)return;
 if(engine.mobile!==(window.innerWidth<768)){destroyEngine();active=null;activate();return;}
 const {width,height}=active.getBoundingClientRect();
 layout={width,height,top:active.offsetTop,parentHeight:active.parentElement.clientHeight};
 engine.resize(width,height);
}
function render(now){
 if(!active||!engine||motion.matches||document.hidden||!hosts.get(active)?.visible)return;
 const dt=Math.min(.05,last?(now-last)/1000:0);last=now;elapsed+=dt;
 const ease=1-Math.exp(-dt/.4);mouse.x+=(target.x-mouse.x)*ease;mouse.y+=(target.y-mouse.y)*ease;
 engine.uniforms.uTime.value=elapsed*Math.PI/10;engine.camera.position.set(mouse.x*.24,4.4+mouse.y*.12,15);
 engine.camera.lookAt(mouse.x*.1,.2,-14);
 engine.camera.updateMatrixWorld();
 if(hosts.get(active)?.variant==='hero'&&!engine.mobile&&layout){
  for(const [name,x,z] of terrainAnchors){
   const point=engine.anchorPoint.set(x,terrainHeight(x,z,engine.uniforms.uTime.value),z).project(engine.camera);
   const markerY=layout.top+(1-point.y)*.5*layout.height;
   active.parentElement.style.setProperty(`--terrain-${name}-x`,`${(point.x+1)*50}%`);
   active.parentElement.style.setProperty(`--terrain-${name}-y`,`${markerY/layout.parentHeight*100}%`);
  }
 }
 active.classList.add('landscape-live');active.dataset.landscapeTime=elapsed.toFixed(2);

}
async function activate(){
 const next=[...hosts].filter(([,s])=>s.visible).sort((a,b)=>b[1].ratio-a[1].ratio)[0]?.[0];
 if(!next||motion.matches||document.hidden){stop();active?.classList.remove('landscape-live');active=null;return;}
 const ready=await createEngine();if(!ready||!hosts.get(next)?.visible||motion.matches||document.hidden)return;
 if(active!==next){active?.classList.remove('landscape-live');active=next;active.append(ready.renderer.domElement);mouse={x:0,y:0};target={x:0,y:0};size();}
 ready.start(render);
}
function pointer(e){
 if(!active||e.pointerType==='touch'||motion.matches)return;const r=active.getBoundingClientRect();
 target={x:Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),y:Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1))};
 clearTimeout(idleTimer);idleTimer=setTimeout(neutral,900);
}
function neutral(){target={x:0,y:0};clearTimeout(idleTimer);}
function preference(){neutral();if(motion.matches){generation++;destroyEngine();}activate();}
export function registerLandscape(host,variant){
 hosts.set(host,{visible:false,ratio:0,variant});
 if(!observer){
  observer=new IntersectionObserver(entries=>{for(const e of entries){const s=hosts.get(e.target);if(s){s.visible=e.isIntersecting&&e.intersectionRatio>.02;s.ratio=e.intersectionRatio;}}activate();},{threshold:[0,.02,.25,.5,.75,1]});
  resizeObserver=new ResizeObserver(size);document.addEventListener('visibilitychange',activate);
  window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('pointerout',neutral);motion.addEventListener('change',preference);
 }
 observer.observe(host);resizeObserver.observe(host);
 return ()=>{
  observer?.unobserve(host);resizeObserver?.unobserve(host);hosts.delete(host);host.classList.remove('landscape-live');
  if(variant==='hero')for(const [name] of terrainAnchors)for(const axis of ['x','y'])host.parentElement.style.removeProperty(`--terrain-${name}-${axis}`);
  if(active===host){stop();active=null;}
  if(!hosts.size){generation++;destroyEngine();observer?.disconnect();resizeObserver?.disconnect();observer=null;resizeObserver=null;clearTimeout(idleTimer);
   document.removeEventListener('visibilitychange',activate);window.removeEventListener('pointermove',pointer);window.removeEventListener('pointerout',neutral);motion.removeEventListener('change',preference);
  }else activate();
 };
}

// Read-only diagnostics used by local lifecycle and pointer tests.
export function getLandscapeState(){return {running:!!engine?.running,active:active?hosts.get(active)?.variant:null,cursor:{...mouse},target:{...target},time:elapsed,hosts:hosts.size};}
