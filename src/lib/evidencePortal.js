import { portalMatrix } from './evidenceScenes.js';

const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const easeInOut=x=>{x=clamp(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};

/** DOM compositor owned by the existing scroll adapter; no RAF or ScrollTrigger. */
export function createEvidencePortal(arc,engine){
  const section=arc.querySelector('[data-forest-evidence]'),stage=section.querySelector('.evidence-stage');
  const intro=section.querySelector('.evidence-intro'),steps=[...section.querySelectorAll('.evidence-step')];
  const figures=steps.map(s=>s.querySelector('.evidence-figure')),copies=steps.map(s=>s.querySelector('.evidence-copy'));
  const image=figures[0].querySelector('.evidence-image'),slot=figures[0].querySelector('.evidence-slot');
  const corners=new Float64Array(8),matrix=new Float64Array(16),scratch=new Float64Array(72);
  const target={x:0,y:0,width:1,height:1};let decoded=false,last=-1,alive=true,lastState,lastOffset;
  function prepare(){const img=image.querySelector('img');img.loading='eager';img.decode().then(()=>{decoded=true;if(alive&&lastState)update(lastState,lastOffset);}).catch(()=>{});}
  function measure(){const r=slot.getBoundingClientRect(),s=stage.getBoundingClientRect();target.x=r.left;target.y=r.top-s.top;target.width=r.width;target.height=r.height;engine.uniforms.uEvidenceAspect.value=r.width/r.height;}
  function update(state,offset){
    lastState=state;lastOffset=offset;
    const decision=arc.querySelector('[data-spatial-scene=decision]');
    decision.style.opacity=String(1-smooth((offset-7.05)/.2));
    stage.style.setProperty('--evidence-surface',String(state.portal));
    intro.style.opacity=String(1-smooth((state.dock-.15)/.35));intro.toggleAttribute('inert',state.dock>.95);
    intro.setAttribute('aria-hidden',String(state.dock>.95));
    const index=state.evidenceStep,blend=state.stepBlend;
    steps.forEach((step,i)=>{
      const focused=step.contains(document.activeElement);
      step.toggleAttribute('inert',!focused&&i!==(blend>.5?index+1:index));
      if(i===(blend>.5?index+1:index))step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');
      step.setAttribute('aria-hidden',String(!focused&&i!==(blend>.5?index+1:index)));
      // Eased hand-offs: outgoing copy lifts away, incoming rises in; figures slide with depth.
      const e=easeInOut(blend);
      const copyOpacity=i===index?1-smooth(blend*2):i===index+1?smooth((blend-.5)*2):0;
      copies[i].style.opacity=String(copyOpacity*smooth((state.dock-.65)/.35));
      copies[i].style.transform=`translateY(${i===index?-e*18:(1-e)*22}px)`;
      figures[i].style.opacity=String((i===index?1-smooth(blend*1.4):i===index+1?smooth(blend*1.4-.4):0)*(i===0?state.imageOpacity*(decoded?1:0):state.dock));
      if(i!==0||offset>=7.9)figures[i].style.transform=i===index?`translate3d(${-e*80}px,0,0) scale(${1-e*.06})`:`translate3d(${(1-e)*80}px,0,0) scale(${.94+e*.06})`;
      const caption=figures[i].querySelector('figcaption');caption.style.opacity=String(state.dock);caption.toggleAttribute('inert',state.dock<.95);
    });
    if(offset<7.2){intro.style.opacity='0';section.setAttribute('inert','');}
    else section.removeAttribute('inert');
    if(offset>=7.9||offset<7.2){image.style.removeProperty('visibility');image.style.removeProperty('transform');section.dataset.portal=offset<7.2?'inactive':'docked';if(offset<7.2)corners.fill(0);}
    else{figures[0].style.removeProperty('transform');section.dataset.portal='projected';}
    if(offset>6.2)prepareOnce();
    if(offset>=7.6&&index!==last){last=index;const next=figures[Math.min(2,index+1)].querySelector('img');next.loading='eager';next.decode().catch(()=>{});}
    section.dataset.step=String(blend>.5?Math.min(2,index+1):index);
  }
  let prepared=false;function prepareOnce(){if(!prepared){prepared=true;prepare();}}
  function project(state){
    if(state.portal<=0||state.dock>=1)return;
    for(let i=0;i<4;i++){
      const point=engine.world.frameCorner(i,state.frame,engine.anchorPoint).project(engine.camera);
      if(point.z<-1||point.z>1){image.style.visibility='hidden';return;}
      const x=(point.x+1)*innerWidth*.5,y=(1-point.y)*innerHeight*.5;
      const tx=target.x+(i===1||i===2?target.width:0),ty=target.y+(i>=2?target.height:0);
      corners[i*2]=x+(tx-x)*state.dock-target.x;corners[i*2+1]=y+(ty-y)*state.dock-target.y;
    }
    image.style.removeProperty('visibility');
    if(portalMatrix(corners,target.width,target.height,matrix,scratch))image.style.transform=`matrix3d(${matrix.join(',')})`;
  }
  function clean(){
    alive=false;arc.querySelector('[data-spatial-scene=decision]').style.removeProperty('opacity');
    section.classList.remove('evidence-enhanced');section.removeAttribute('inert');delete section.dataset.step;delete section.dataset.portal;
    section.querySelectorAll('[style]').forEach(e=>{for(const property of ['opacity','transform','visibility','--evidence-surface'])e.style.removeProperty(property);});
    section.querySelectorAll('[aria-current]').forEach(e=>e.removeAttribute('aria-current'));
    section.querySelectorAll('[inert],[aria-hidden]').forEach(e=>{e.removeAttribute('inert');e.removeAttribute('aria-hidden');});
  }
  section.classList.add('evidence-enhanced');
  return {measure,update,project,clean,getState:()=>({decoded,target:{...target},corners:Array.from(corners)})};
}
