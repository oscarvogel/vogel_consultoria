// One lazy Three renderer shared by the visible hero and closing surface.
const hosts=new Map();
let engine,pending,active,frame=0,observer,resizeObserver,idleTimer,last=0,elapsed=0,generation=0;
let mouse={x:0,y:0},target={x:0,y:0};
let layout;
const terrainAnchors=[['systems',-8,-8],['automation',4,-13],['data',7,-3]];
function terrainHeight(x,z,time){return Math.sin(x*.36+z*.12)*.46+Math.sin(z*.31-x*.09)*.44+Math.sin(x*.56-z*.18)*Math.sin(z*.24)*.23+Math.exp(-Math.pow((x+2)*.18,2)-Math.pow((z+8)*.12,2))*1.1+Math.sin(z*.18+x*.12+time)*.13;}
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
const heightShader=`float heightAt(vec2 p){
 float r=sin(p.x*.36+p.y*.12)*.46+sin(p.y*.31-p.x*.09)*.44;
 r+=sin(p.x*.56-p.y*.18)*sin(p.y*.24)*.23;
 r+=exp(-pow((p.x+2.)*.18,2.)-pow((p.y+8.)*.12,2.))*1.1;
 return r+sin(p.y*.18+p.x*.12+uTime)*.13;
}`;
const vertexShader=`uniform float uTime; attribute float aLight; attribute float aSize; attribute vec3 aColor;
varying vec3 vColor; varying float vLight; varying float vBlur; varying float vFade;
${heightShader}
void main(){vec3 p=position;p.y=heightAt(p.xz);vec4 mv=modelViewMatrix*vec4(p,1.);
float dist=-mv.z;vColor=aColor;vLight=aLight*(.88+.12*sin(uTime+p.x*.18+p.z*.13));
vBlur=1.-smoothstep(4.,16.,dist);vFade=1.-smoothstep(24.,80.,dist);
gl_Position=projectionMatrix*mv;gl_PointSize=clamp((aSize+vBlur*5.)*110./max(1.,dist),1.,52.);}`;
const fragmentShader=`varying vec3 vColor; varying float vLight; varying float vBlur; varying float vFade;
void main(){float d=length(gl_PointCoord-.5)*2.;float core=exp(-d*d*mix(48.,5.,vBlur));
float halo=exp(-d*d*6.)*.24;float alpha=(core+halo)*vLight*vFade;
if(alpha<.006)discard;gl_FragColor=vec4(vColor,alpha);}`;
async function createEngine(){
 if(engine)return engine;if(pending)return pending;const version=generation;
 pending=import('three').then(T=>{
  if(version!==generation||!hosts.size||motion.matches)return null;
  const renderer=new T.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});
  renderer.setClearColor(0x05090f,0);renderer.domElement.className='landscape-canvas';renderer.domElement.__vogelLandscape={getState:getLandscapeState};
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(47,1,.1,110);
  const pointsGeometry=new T.BufferGeometry(),mobile=window.innerWidth<768;
  const cols=mobile?151:321,rows=mobile?91:181,pos=[],colors=[],lights=[],sizes=[],lines=[];
  const point=(x,z)=>[(x/(cols-1)-.5)*42,0,12-z/(rows-1)*70];
  for(let z=0;z<rows;z++)for(let x=0;x<cols;x++){
   const p=point(x,z);pos.push(...p);
   const seed=Math.abs(Math.sin(x*127.1+z*311.7)*43758.5453)%1;
   const gold=Math.sin(x*.14-z*.12)>.05||seed>.88;
   colors.push(...(gold?[1,.63+seed*.16,.22]:[.12,.28,.4]));
   lights.push((seed>.97?1.15:.28+seed*.56)*(gold?1:.56));sizes.push(seed>.985?2.2:.38+seed*.38);
   if(x<cols-1&&z%4===0)lines.push(...p,...point(x+1,z));
   if(z<rows-1&&x%6===0)lines.push(...p,...point(x,z+1));
  }
  pos.push(0,0,-13);colors.push(1,.75,.34);lights.push(1.35);sizes.push(14);
  pointsGeometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));
  pointsGeometry.setAttribute('aColor',new T.Float32BufferAttribute(colors,3));
  pointsGeometry.setAttribute('aLight',new T.Float32BufferAttribute(lights,1));
  pointsGeometry.setAttribute('aSize',new T.Float32BufferAttribute(sizes,1));
  const uniforms={uTime:{value:0}};
  const material=new T.ShaderMaterial({uniforms,vertexShader,fragmentShader,transparent:true,depthWrite:false,blending:T.AdditiveBlending});
  scene.add(new T.Points(pointsGeometry,material));
  const lineGeometry=new T.BufferGeometry();lineGeometry.setAttribute('position',new T.Float32BufferAttribute(lines,3));
  const lineMaterial=new T.ShaderMaterial({uniforms,vertexShader:`uniform float uTime;varying float vFade;${heightShader}
  void main(){vec3 p=position;p.y=heightAt(p.xz);vec4 mv=modelViewMatrix*vec4(p,1.);vFade=1.-smoothstep(20.,80.,-mv.z);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:'varying float vFade;void main(){gl_FragColor=vec4(.23,.32,.38,.08*vFade);}',transparent:true,depthWrite:false});
  scene.add(new T.LineSegments(lineGeometry,lineMaterial));
  const loss=e=>{e.preventDefault();stop();active?.classList.remove('landscape-live');};
  const restore=()=>{destroyEngine();active=null;activate();};
  renderer.domElement.addEventListener('webglcontextlost',loss);renderer.domElement.addEventListener('webglcontextrestored',restore);
  engine={renderer,scene,camera,uniforms,mobile,anchorPoint:new T.Vector3(),dispose(){
   renderer.domElement.removeEventListener('webglcontextlost',loss);renderer.domElement.removeEventListener('webglcontextrestored',restore);
   pointsGeometry.dispose();material.dispose();lineGeometry.dispose();lineMaterial.dispose();renderer.forceContextLoss();renderer.dispose();renderer.domElement.remove();
  }};return engine;
 }).catch(()=>null).finally(()=>{pending=null;});return pending;
}
function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;}
function destroyEngine(){stop();engine?.dispose();engine=null;active?.classList.remove('landscape-live');}
function size(){
 if(!active||!engine)return;
 if(engine.mobile!==(window.innerWidth<768)){destroyEngine();active=null;activate();return;}
 const {width,height}=active.getBoundingClientRect();
 layout={width,height,top:active.offsetTop,parentHeight:active.parentElement.clientHeight};
 const dpr=Math.min(devicePixelRatio||1,1.5,Math.sqrt(1800000/Math.max(1,width*height)));
 engine.renderer.setPixelRatio(dpr);engine.renderer.setSize(Math.max(1,width),Math.max(1,height));
 engine.camera.aspect=width/Math.max(1,height);engine.camera.updateProjectionMatrix();
}
function render(now){
 frame=0;if(!active||!engine||motion.matches||document.hidden||!hosts.get(active)?.visible)return;
 const dt=Math.min(.05,last?(now-last)/1000:0);last=now;elapsed+=dt;
 const ease=1-Math.exp(-dt/.4);mouse.x+=(target.x-mouse.x)*ease;mouse.y+=(target.y-mouse.y)*ease;
 engine.uniforms.uTime.value=elapsed*Math.PI/10;engine.camera.position.set(mouse.x*.24,4.4+mouse.y*.12,15);
 engine.camera.lookAt(mouse.x*.1,.2,-14);engine.renderer.render(engine.scene,engine.camera);
 if(hosts.get(active)?.variant==='hero'&&!engine.mobile&&layout){
  for(const [name,x,z] of terrainAnchors){
   const point=engine.anchorPoint.set(x,terrainHeight(x,z,engine.uniforms.uTime.value),z).project(engine.camera);
   const markerY=layout.top+(1-point.y)*.5*layout.height;
   active.parentElement.style.setProperty(`--terrain-${name}-x`,`${(point.x+1)*50}%`);
   active.parentElement.style.setProperty(`--terrain-${name}-y`,`${markerY/layout.parentHeight*100}%`);
  }
 }
 active.classList.add('landscape-live');active.dataset.landscapeTime=elapsed.toFixed(2);
 frame=requestAnimationFrame(render);
}
async function activate(){
 const next=[...hosts].filter(([,s])=>s.visible).sort((a,b)=>b[1].ratio-a[1].ratio)[0]?.[0];
 if(!next||motion.matches||document.hidden){stop();active?.classList.remove('landscape-live');active=null;return;}
 const ready=await createEngine();if(!ready||!hosts.get(next)?.visible||motion.matches||document.hidden)return;
 if(active!==next){active?.classList.remove('landscape-live');active=next;active.append(ready.renderer.domElement);mouse={x:0,y:0};target={x:0,y:0};size();}
 if(!frame)frame=requestAnimationFrame(render);
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
export function getLandscapeState(){return {running:!!frame,active:active?hosts.get(active)?.variant:null,cursor:{...mouse},target:{...target},time:elapsed,hosts:hosts.size};}
