import { createSpatialEngine } from './spatialEngine.js';
import { createCameraRig } from './cameraRig.js';
import { createSpatialSceneController } from './sceneController.js';
import { narrativeScenes, narrativeRanges } from './narrativeScenes.js';
import { loadSiteMotion } from '../composables/useSiteMotion.js';

const clamp=value=>Math.max(0,Math.min(1,value));
/** An adapter for the same core: one scroll owner, no additional animation loop. */
export function mountSpatialNarrative(host) {
  const page=host.closest('.home-page'), arc=page.querySelector('.narrative-arc');
  const hero=arc.querySelector('.landscape-hero'), progress=arc.querySelector('.narrative-progress');
  const labels=[...arc.querySelectorAll('.spatial-cluster-labels li')];
  const count=progress.querySelector('.narrative-count'), current=progress.querySelector('.narrative-current');
  const controller=createSpatialSceneController(narrativeScenes,narrativeRanges);
  const eligibility=matchMedia('(min-width:1024px) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  let disposed=false, generation=0, cleanSession;
  host.className='spatial-narrative-host';
  async function reconcile() {
    const version=++generation;cleanSession?.();cleanSession=undefined;
    arc.classList.remove('narrative-unavailable');
    if(disposed||!eligibility.matches) return;
    let engine, rig, trigger, resize, intersection, idle, inView=false, distance=1, start=0, handoff=0;
    const widths=new Float32Array(4), heights=new Float32Array(4), xs=new Float32Array(4), ys=new Float32Array(4);
    const reading=[];
    let activeIndex=-1, worldPointerX=0, worldPointerY=0;
    function neutral(){rig?.setPointer(0,0);worldPointerX=worldPointerY=0;clearTimeout(idle);}
    function pointer(e){if(e.pointerType==='touch'||!inView)return;
      worldPointerX=e.clientX/innerWidth*2-1;worldPointerY=e.clientY/innerHeight*2-1;
      rig.setPointer(worldPointerX,worldPointerY);clearTimeout(idle);idle=setTimeout(neutral,900);}
    function clean() {
      trigger?.kill();resize?.disconnect();intersection?.disconnect();clearTimeout(idle);
      window.removeEventListener('pointermove',pointer);window.removeEventListener('pointerout',neutral);
      engine?.dispose();page.classList.remove('narrative-live');
      arc.style.removeProperty('--intro-retreat');progress.style.opacity='0';
      labels.forEach(label=>{label.style.opacity='0';label.style.removeProperty('transform');});
      host.style.opacity='0';
    }
    cleanSession=clean;
    function fail(){clean();arc.classList.add('narrative-unavailable');}
    function measure() {
      distance=Math.max(1,arc.offsetHeight-innerHeight);
      start=arc.getBoundingClientRect().top+scrollY;
      engine.resize(innerWidth,innerHeight);
      labels.forEach((label,i)=>{widths[i]=label.offsetWidth;heights[i]=label.offsetHeight;});
      // Reading region is stable in x; y follows native scroll without per-frame DOM reads.
      reading.length=0;
      arc.querySelectorAll('.narrative-copy').forEach(copy=>{
        const r=copy.getBoundingClientRect();reading.push({right:r.left+460,top:r.top+scrollY,bottom:r.top+scrollY+copy.offsetHeight});
      });
      update();
    }
    function update() {
      const offset=scrollY-start, p=clamp(offset/distance);
      handoff=clamp((offset-distance)/innerHeight);
      const state=controller.setProgress(p);rig.setTransition(state.from,state.to,state.blend);
      arc.style.setProperty('--intro-retreat',String(clamp(offset/innerHeight)));
      progress.style.setProperty('--arc-progress',String(p));progress.style.opacity=String(1-handoff);
      const index=p<.38?0:p<.82?1:2;
      if(index!==activeIndex){activeIndex=index;count.textContent=`0${index+1} / 03`;current.textContent=['INTRO','COMPLEJIDAD','SISTEMAS'][index];}
      // World persists through the handoff, then pauses under the editorial sections.
      host.style.opacity=String(1-handoff);
      const intro=1-clamp(p/.38), lower=handoff*82;
      host.style.maskImage=`linear-gradient(transparent ${intro*22+lower}%,#000 ${intro*50+lower+(1-intro)*(1-handoff)*8}%,#000 88%,transparent)`;
      if(offset>=distance+innerHeight||offset<-innerHeight){engine.pause();neutral();labels.forEach(l=>l.style.opacity='0');}
      else if(inView)engine.start(render);
    }
    function render(now,dt,elapsed) {
      rig.update(dt);
      const state=controller.getState();engine.world.update(elapsed*Math.PI/10,state);
      engine.uniforms.uIntensity.value*=1-handoff*.8;
      engine.uniforms.uClusters.value*=1-handoff;
      engine.uniforms.uConnections.value*=1-handoff*.8;
      const pointer=engine.uniforms.uPointer.value, follow=1-Math.exp(-dt/.4);
      pointer.x+=(worldPointerX-pointer.x)*follow;pointer.y+=(worldPointerY-pointer.y)*follow;
      engine.camera.updateMatrixWorld();
      for(let i=0;i<labels.length;i++) {
        const anchor=engine.world.anchor(i,engine.anchorPoint);
        anchor.project(engine.camera);
        let x=(anchor.x+1)*innerWidth*.5+14, y=(1-anchor.y)*innerHeight*.5-28;
        let visible=state.clusters>.7&&handoff<.1&&anchor.z>=-1&&anchor.z<=1&&x>24&&x+widths[i]<innerWidth-130&&y>120&&y+heights[i]<innerHeight-40;
        // Leave the editorial column quiet and resolve nearby label overlaps with a small offset.
        for(const region of reading)if(x<region.right&&y>region.top-scrollY-30&&y<region.bottom-scrollY+30)visible=false;
        for(let j=0;j<i;j++)if(xs[j]>=0&&Math.abs(y-ys[j])<heights[i]+14&&x<xs[j]+widths[j]+14&&x+widths[i]>xs[j]-14)y=ys[j]+heights[j]+14;
        visible=visible&&y+heights[i]<innerHeight-40;
        xs[i]=visible?x:-1;ys[i]=y;
        labels[i].style.opacity=visible?String(state.clusters*(1-handoff)):'0';
        if(visible)labels[i].style.transform=`translate3d(${x}px,${y}px,0)`;
      }
      page.classList.add('narrative-live');
    }
    try {
      const [T,{ScrollTrigger}]=await Promise.all([import('three'),loadSiteMotion()]);
      await document.fonts?.ready;
      if(disposed||version!==generation||!eligibility.matches)return;
      engine=createSpatialEngine(T,{narrative:true,onContextLost(){page.classList.remove('narrative-live');labels.forEach(l=>l.style.opacity='0');},onContextRestored(){measure();},onError:fail});
      rig=createCameraRig(T,engine.camera);
      const canvas=engine.renderer.domElement;canvas.className='spatial-canvas';host.append(canvas);
      // Same read-only diagnostic contract as Phase 1; snapshot is development-only evidence tooling.
      canvas.__vogelSpatial={getState:()=>({...engine.getState(),progress:controller.getState().progress,from:controller.getState().from.id,to:controller.getState().to.id,
        order:controller.getState().order,dispersion:controller.getState().dispersion,handoff,position:engine.camera.position.toArray(),quaternion:engine.camera.quaternion.toArray(),
        geometryIds:engine.scene.children.map(o=>o.geometry.uuid),bufferIds:engine.scene.children.map(o=>o.geometry.attributes.position.array.byteLength)}),
        ...(import.meta.env.DEV?{snapshot({poster=false}={}){
          const time=engine.uniforms.uTime.value, clusters=engine.uniforms.uClusters.value,
            position=engine.camera.position.clone(), quaternion=engine.camera.quaternion.clone();
          engine.uniforms.uTime.value=0;
          if(poster){engine.camera.position.set(9,14,8);engine.camera.lookAt(0,1,-22);engine.uniforms.uClusters.value=2.2;}
          engine.renderer.render(engine.scene,engine.camera);
          const image=canvas.toDataURL('image/png');engine.uniforms.uTime.value=time;
          engine.uniforms.uClusters.value=clusters;
          engine.camera.position.copy(position);engine.camera.quaternion.copy(quaternion);return image;}}:{})};
      measure();
      trigger=ScrollTrigger.create({id:'vogel-spatial-narrative',trigger:arc,start:'top top',end:()=>`+=${arc.offsetHeight}`,invalidateOnRefresh:true,onUpdate:update,onRefresh:measure});
      resize=new ResizeObserver(()=>{measure();ScrollTrigger.refresh();});resize.observe(arc);
      intersection=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)update();else {engine.pause();neutral();labels.forEach(l=>l.style.opacity='0');}});
      intersection.observe(arc);
      window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('pointerout',neutral);
    } catch {if(version===generation&&!disposed)fail();}
  }
  eligibility.addEventListener('change',reconcile);reconcile();
  return ()=>{disposed=true;generation++;eligibility.removeEventListener('change',reconcile);cleanSession?.();};
}
