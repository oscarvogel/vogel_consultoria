import { evidenceConfig, sampleEvidence } from './evidenceScenes.js';
import { createEvidencePortal } from './evidencePortal.js';
import { createSpatialEngine } from './spatialEngine.js';
import { createCameraRig } from './cameraRig.js';
import { createCameraPath } from './cameraPath.js';
import { createSpatialSceneController } from './sceneController.js';
import { narrativeScenes, narrativeRanges, phase03Config, samplePhase03, narrativeChapters } from './narrativeScenes.js';
import { loadTextMotion } from '../composables/useSiteMotion.js';
import { createNarrativeText } from './narrativeText.js';

const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{value=clamp(value);return value*value*(3-2*value);};
/** An adapter for the same core: one scroll owner, no additional animation loop. */
export function mountSpatialNarrative(host, { phase03 = false, phase04 = false } = {}) {
  const page=host.closest('.home-page'), arc=page.querySelector('.narrative-arc');
  const hero=arc.querySelector('.landscape-hero'), progress=arc.querySelector('.narrative-progress');
  const labels=[...arc.querySelectorAll('.spatial-cluster-labels li')];
  const count=progress.querySelector('.narrative-count'), current=progress.querySelector('.narrative-current');
  const rail=[...progress.querySelectorAll('.narrative-rail li')];
  const controller=createSpatialSceneController(phase03?phase03Config.scenes:narrativeScenes,phase03?phase03Config.ranges:narrativeRanges);
  const eligibility=matchMedia('(min-width:1024px) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  let disposed=false, generation=0, cleanSession;
  host.className='spatial-narrative-host';
  async function reconcile() {
    const version=++generation;cleanSession?.();cleanSession=undefined;
    arc.classList.remove('narrative-unavailable');
    if(disposed||!eligibility.matches) return;
    let portal, engine, rig, trigger, resize, intersection, idle, text, textMotion, inView=false, distance=1, start=0, handoff=0, unit=1, exitDistance=1;
    const widths=new Float32Array(4), heights=new Float32Array(4), xs=new Float32Array(4), ys=new Float32Array(4);
    const reading=[];
    let activeIndex=-1, worldPointerX=0, worldPointerY=0, path, cameraPose, beat=0, lastBeat=0, velocity=0;
    function neutral(){rig?.setPointer(0,0);worldPointerX=worldPointerY=0;clearTimeout(idle);}
    function navigateEvidence(){if(!phase04||!page.classList.contains('narrative-live'))return;const id=location.hash.slice(1),index=['evidencia-registrar','evidencia-revisar','evidencia-decidir'].indexOf(id);if(index<0)return;const beat=evidenceConfig.steps[index];scrollTo({top:start+unit*(beat.start+.15),behavior:'instant'});update();}
    function pointer(e){if(e.pointerType==='touch'||!inView||(phase04&&controller.getState().chapter==='evidence'))return;
      worldPointerX=e.clientX/innerWidth*2-1;worldPointerY=e.clientY/innerHeight*2-1;
      rig.setPointer(worldPointerX,worldPointerY);clearTimeout(idle);idle=setTimeout(neutral,900);}
    function clean() {
      trigger?.kill();resize?.disconnect();intersection?.disconnect();clearTimeout(idle);
      window.removeEventListener('hashchange',navigateEvidence);
      window.removeEventListener('pointermove',pointer);window.removeEventListener('pointerout',neutral);
      portal?.clean();text?.clean();text=undefined;engine?.dispose();page.classList.remove('narrative-live','spatial-context-lost');
      progress.querySelectorAll('.narrative-rail li').forEach(li=>li.classList.remove('is-active','is-past'));
      arc.style.removeProperty('--intro-retreat');progress.style.opacity='0';
      labels.forEach(label=>{label.style.opacity='0';label.style.removeProperty('transform');});
      host.style.opacity='0';
      host.style.visibility='hidden';
    }
    cleanSession=clean;
    function fail(){clean();arc.classList.add('narrative-unavailable');}
    function syncVisibility(){const r=arc.getBoundingClientRect();inView=r.bottom>0&&r.top<innerHeight;}
    function measure() {
      // Resize/context recovery may arrive before queued intersection entries.
      // Read current bounds once at those lifecycle boundaries, never per frame.
      syncVisibility();
      unit=phase03?arc.offsetHeight/(phase04?evidenceConfig.height:phase03Config.height):innerHeight;
      distance=Math.max(1,phase03?unit*phase03Config.end:arc.offsetHeight-innerHeight);
      exitDistance=Math.max(1,arc.offsetHeight-distance);
      start=arc.getBoundingClientRect().top+scrollY;
      engine.resize(innerWidth,innerHeight);
      portal?.measure();
      labels.forEach((label,i)=>{widths[i]=label.offsetWidth;heights[i]=label.offsetHeight;});
      text?.measure();
      // Reading region is stable in x; y follows native scroll without per-frame DOM reads.
      reading.length=0;
      arc.querySelectorAll('.narrative-copy').forEach(copy=>{
        const r=copy.getBoundingClientRect();reading.push({right:r.left+460,top:r.top+scrollY,bottom:r.top+scrollY+copy.offsetHeight});
      });
      update();
    }
    function update() {
      const offset=scrollY-start, p=clamp(offset/distance);
      handoff=clamp((offset-distance)/exitDistance);
      const state=phase04?sampleEvidence(controller,offset/unit):phase03?samplePhase03(controller,offset/unit):controller.setProgress(p);
      beat=offset/unit;
      if(path){
        // One continuous flight through every chapter pose; the evidence portal needs a still camera.
        path.sample(beat,cameraPose);rig.setPose(cameraPose.position,cameraPose.target,cameraPose.fov);
        rig.setCalm(phase04?clamp((beat-7.05)/.15):0);if(phase04&&beat>=7.2)neutral();
        rig.setLens((state.lens??0)*(phase04?1-(state.portal??0):1));
      }else rig.setTransition(state.from,state.to,state.blend);
      if(phase04){handoff=1-state.canvasOpacity;portal?.update(state,offset/unit);}
      arc.style.setProperty('--intro-retreat',String(clamp(offset/innerHeight)));
      progress.style.setProperty('--arc-progress',String(p));progress.style.opacity=String(phase04?1-state.evidenceExit:1-handoff);
      const index=phase03?state.chapterIndex:p<.38?0:p<.82?1:2;
      if(index!==activeIndex){
        const forward=index>activeIndex;activeIndex=index;
        count.textContent=`${narrativeChapters[index].number} / ${phase04?'08':phase03?'07':'03'}`;current.textContent=narrativeChapters[index].label;
        rail.forEach((li,i)=>{li.classList.toggle('is-active',i===index);li.classList.toggle('is-past',i<index);});
        // Restart the label swap animation only on chapter change (one forced style flush).
        progress.classList.remove('is-swapping','is-back');void progress.offsetWidth;progress.classList.add('is-swapping');if(!forward)progress.classList.add('is-back');
      }
      text?.update(scrollY,innerHeight);
      if(phase04){const sub=progress.querySelector('.narrative-substep'),step=Number(arc.querySelector('[data-forest-evidence]').dataset.step)||0;sub.textContent=offset/unit>=7.9?`0${step+1} / ${['REGISTRAR','REVISAR','DECIDIR'][step]}`:'';}
      // World persists through the handoff, then pauses under the editorial sections.
      host.style.opacity=String(1-handoff);
      const intro=1-clamp(phase03?offset/(unit*1.14):p/.38), lower=phase04?0:handoff*82;
      host.style.maskImage=`linear-gradient(transparent ${intro*22+lower}%,#000 ${intro*50+lower+(1-intro)*(1-handoff)*8}%,#000 88%,transparent)`;
      if((phase04?offset/unit>=7.9:offset>=arc.offsetHeight)||offset<-innerHeight){if(phase04){rig.update(0);engine.world.update(engine.getState().elapsed*Math.PI/10,state);engine.uniforms.uEvidence.value=state.frame;engine.uniforms.uEvidenceDock.value=state.dock;}engine.pause();neutral();labels.forEach(l=>l.style.opacity='0');}
      else if(inView){if(phase04&&offset/unit>=7.2)render(0,0,engine.getState().elapsed);engine.start(render);}
      if(phase04&&!engine.getState().lost)page.classList.add('narrative-live');
    }
    function render(now,dt,elapsed) {
      if(dt>0){velocity+=((beat-lastBeat)/dt-velocity)*(1-Math.exp(-dt/.12));lastBeat=beat;}
      rig.setVelocity(velocity);rig.update(dt,elapsed);
      const state=controller.getState();engine.world.update(elapsed*Math.PI/10,state);
      engine.uniforms.uEvidence.value=phase04?state.frame:0;
      engine.uniforms.uEvidenceDock.value=phase04?state.dock:0;
      engine.uniforms.uIntensity.value*=1-handoff*.8;
      engine.uniforms.uClusters.value*=(1-handoff)*(phase04?1-(state.portal??0)*.85:1);
      // Near-camera dust would read as smoke while flying into the evidence frame.
      if(phase04)engine.uniforms.uDust.value*=1-smooth((state.portal??0)*2.2);
      engine.uniforms.uConnections.value*=1-handoff*.8;
      const post=engine.post.uniforms;
      post.uBloom.value=(state.bloom??.5)*(1-handoff);post.uExposure.value=state.exposure??1;
      const pointer=engine.uniforms.uPointer.value, follow=1-Math.exp(-dt/.4);
      pointer.x+=(worldPointerX-pointer.x)*follow;pointer.y+=(worldPointerY-pointer.y)*follow;
      engine.camera.updateMatrixWorld();
      portal?.project(state);
      for(let i=0;i<labels.length;i++) {
        const anchor=engine.world.anchor(i,engine.anchorPoint);
        anchor.project(engine.camera);
        let x=(anchor.x+1)*innerWidth*.5+14, y=(1-anchor.y)*innerHeight*.5-28;
        // Resolve nearby label overlaps with a small offset, then fade by distance to every
        // forbidden edge (viewport, indicator, editorial column) instead of toggling.
        for(let j=0;j<i;j++)if(xs[j]>=0&&Math.abs(y-ys[j])<heights[i]+14&&x<xs[j]+widths[j]+14&&x+widths[i]>xs[j]-14)y=ys[j]+heights[j]+14;
        let margin=Math.min(x-24,innerWidth-130-(x+widths[i]),y-120,innerHeight-40-(y+heights[i]));
        for(const region of reading)if(y>region.top-scrollY-30&&y<region.bottom-scrollY+30)margin=Math.min(margin,x-region.right);
        const gate=(!phase04||state.chapter!=='evidence')&&anchor.z>=-1&&anchor.z<=1?smooth((state.clusters-.6)/.3)*(1-smooth(handoff/.1)):0;
        const opacity=gate*smooth(margin/48);
        xs[i]=opacity>0?x:-1;ys[i]=y;
        labels[i].style.opacity=opacity>.002?opacity.toFixed(3):'0';
        if(opacity>0)labels[i].style.transform=`translate3d(${x}px,${y}px,0)`;
      }
      page.classList.add('narrative-live');
      // Split lines only once the live typography applies; splitting earlier forces a
      // later re-split whose height change shifts the page through scroll anchoring.
      if(!text&&textMotion){text=createNarrativeText(textMotion,arc);text.measure();text.update(scrollY,innerHeight);}
      if(host.style.visibility==='hidden')host.style.visibility='visible';
    }
    try {
      const [T,{ScrollTrigger,gsap,SplitText}]=await Promise.all([import('three'),loadTextMotion()]);
      await document.fonts?.ready;
      if(disposed||version!==generation||!eligibility.matches)return;
      textMotion={gsap,SplitText};
      engine=createSpatialEngine(T,{narrative:true,phase03,onContextLost(){host.style.visibility='hidden';if(phase04)page.classList.add('spatial-context-lost');else {page.classList.remove('narrative-live');text?.clean();text=undefined;}labels.forEach(l=>l.style.opacity='0');},onContextRestored(){page.classList.remove('spatial-context-lost');measure();},onError:fail});
      rig=createCameraRig(T,engine.camera);
      if(phase03){path=createCameraPath(T,{evidence:phase04});cameraPose={position:new T.Vector3(),target:new T.Vector3(),fov:45};}
      if(phase04)portal=createEvidencePortal(arc,engine);
      const canvas=engine.renderer.domElement;canvas.className='spatial-canvas';host.append(canvas);
      // Same read-only diagnostic contract as Phase 1; snapshot is development-only evidence tooling.
      const bufferRegistry=new WeakMap();let nextBuffer=0;
      engine.scene.children.forEach(o=>Object.values(o.geometry.attributes).forEach(a=>{
        if(!bufferRegistry.has(a.array))bufferRegistry.set(a.array,++nextBuffer);
      }));
      canvas.__vogelSpatial={getState:()=>({...engine.getState(),phase:phase04?4:phase03?3:2,
        ...(phase04?{portal:controller.getState().portal,dock:controller.getState().dock,canvasOpacity:controller.getState().canvasOpacity,evidenceStep:controller.getState().evidenceStep,projection:portal.getState()}:{}),progress:controller.getState().progress,from:controller.getState().from.id,to:controller.getState().to.id,
        ...(phase03?{chapter:controller.getState().chapter,chapterIndex:controller.getState().chapterIndex,localProgress:controller.getState().localProgress,
          flow:controller.getState().flow,data:controller.getState().data,intelligence:controller.getState().intelligence,
          clarity:controller.getState().clarity,convergence:controller.getState().convergence,pulsePhase:controller.getState().pulsePhase,selectionPhase:controller.getState().selectionPhase,
          attributes:engine.scene.children.map(o=>Object.fromEntries(Object.entries(o.geometry.attributes).map(([key,a])=>[key,{id:bufferRegistry.get(a.array)??-1,attributeId:a.id,bytes:a.array.byteLength}]))),
          uniformValues:Object.fromEntries(Object.entries(engine.uniforms).filter(([key,u])=>key!=='uTime'&&typeof u.value==='number').map(([key,u])=>[key,u.value]))}:{}),
        // Path mode reports the pure scroll pose; the rendered camera adds pointer, accents and breathing.
        order:controller.getState().order,dispersion:controller.getState().dispersion,handoff,
        position:(path?rig.pose.position:engine.camera.position).toArray(),quaternion:(path?rig.pose.quaternion:engine.camera.quaternion).toArray(),
        renderedPosition:engine.camera.position.toArray(),settled:rig.settled,beat,
        geometryIds:engine.scene.children.map(o=>o.geometry.uuid),bufferIds:engine.scene.children.map(o=>o.geometry.attributes.position.array.byteLength)}),
        ...(import.meta.env.DEV?{snapshot({poster=false}={}){
          const time=engine.uniforms.uTime.value, clusters=engine.uniforms.uClusters.value,
            position=engine.camera.position.clone(), quaternion=engine.camera.quaternion.clone(), fov=engine.camera.fov;
          engine.uniforms.uTime.value=0;if(path)rig.applyPose();
          const pointer=engine.uniforms.uPointer.value.clone();engine.uniforms.uPointer.value.set(0,0);
          if(poster){engine.camera.position.set(phase03?12:9,14,phase03?3:8);engine.camera.lookAt(0,1,phase03?-28:-22);engine.uniforms.uClusters.value=phase03?1.2:2.2;engine.camera.updateProjectionMatrix();}
          engine.renderFrame();
          const image=canvas.toDataURL('image/png');engine.uniforms.uTime.value=time;
          engine.uniforms.uClusters.value=clusters;
          engine.uniforms.uPointer.value.copy(pointer);
          engine.camera.position.copy(position);engine.camera.quaternion.copy(quaternion);engine.camera.fov=fov;engine.camera.updateProjectionMatrix();return image;}}:{})};
      if(phase04)page.classList.add('narrative-live');
      measure();
      trigger=ScrollTrigger.create({id:'vogel-spatial-narrative',trigger:arc,start:'top top',end:()=>`+=${arc.offsetHeight}`,invalidateOnRefresh:true,onUpdate:update,onRefresh:measure});
      if(phase04){window.addEventListener('hashchange',navigateEvidence);navigateEvidence();}
      resize=new ResizeObserver(()=>{measure();ScrollTrigger.refresh();});resize.observe(arc);
      intersection=new IntersectionObserver(()=>{syncVisibility();if(inView)update();else {engine.pause();neutral();labels.forEach(l=>l.style.opacity='0');}});
      intersection.observe(arc);
      window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('pointerout',neutral);
    } catch {if(version===generation&&!disposed)fail();}
  }
  eligibility.addEventListener('change',reconcile);reconcile();
  return ()=>{disposed=true;generation++;eligibility.removeEventListener('change',reconcile);cleanSession?.();};
}
