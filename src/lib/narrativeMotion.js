import { setScene, resetScene } from './sceneController.js';

export const NARRATIVE_MEDIA = '(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)';
export const narrativeClearance = () => (document.querySelector('.site-header')?.getBoundingClientRect().bottom || 24) + 92;
const presets = {
  neutral:{}, problems:{intensityDelta:.018,offsetXDelta:-.012,offsetYDelta:.008},
  forest:{intensityDelta:0,offsetXDelta:.006,offsetYDelta:.004},
  order:{intensityDelta:-.008,offsetXDelta:-.006,offsetYDelta:.004},
  connect:{intensityDelta:.012,offsetXDelta:.012,offsetYDelta:0},
  automate:{intensityDelta:.02,offsetXDelta:.006,offsetYDelta:-.01},
  decide:{intensityDelta:-.01,offsetXDelta:0,offsetYDelta:.012},
};

/** One coordinator per page. All semantic content remains in its original flow. */
export function initNarrative(root, {gsap, ScrollTrigger}) {
  const media=gsap.matchMedia();
  const owners=new Set();
  let observer;
  let refreshTimer;
  const ownedAttributes=new Set();
  const originalAttributes=new Map();
  const scope=root instanceof Document?root.body:root;
  const find=selector=>[...scope.querySelectorAll(selector)];
  let restoreFragment=window.matchMedia(NARRATIVE_MEDIA).matches;

  // Assign explicit motion ownership before generic reveals scan this page.
  const identify=()=>{
    let changed=false;
    for(const el of find('main > section, main > article > section, [data-chapter], [data-narrative-steps], [data-narrative-hero]')){
      if(!el.hasAttribute('data-chapter-motion')){el.setAttribute('data-chapter-motion','');ownedAttributes.add(el);changed=true;}
    }
    return changed;
  };
  identify();

  media.add(NARRATIVE_MEDIA,()=>{
    let alive=true;
    const context=gsap.context(()=>{},scope);
    const stops=[];
    const timelines=new Map();
    const heroes=new Set();
    let boundaries=[];
    let stepState=new Map();
    let sceneTrigger;
    const styles=new Map();
    const rememberStyle=el=>{if(el&&!styles.has(el))styles.set(el,el.getAttribute('style'));};

    const setOwned=(el,key,value)=>{
      if(!originalAttributes.has(el))originalAttributes.set(el,new Map());
      const record=originalAttributes.get(el);if(!record.has(key))record.set(key,el.getAttribute(key));
      el.setAttribute(key,value);
    };

    function addHero(host){
      if(heroes.has(host))return;
      const stage=host.querySelector('[data-hero-stage]') || host.firstElementChild;
      const lines=host.querySelectorAll('.hero-line');
      const visual=host.querySelector('.hero-connections');
      host.classList.add('hero-chapter-active');
      const available=innerHeight-narrativeClearance()-24;
      if(!stage || stage.scrollHeight>available){host.classList.remove('hero-chapter-active');return;}
      heroes.add(host);
      [stage,visual,host.querySelector('h1'),...lines,...host.querySelectorAll('.hero-scene,.artifact-path')].forEach(rememberStyle);
      context.add(()=>{
        // Measure the upstream spacer before downstream pins, including async case hooks.
        const tl=gsap.timeline({id:'hero-chapter',scrollTrigger:{id:'hero-chapter',refreshPriority:10,trigger:stage,start:()=>`top ${narrativeClearance()}px`,end:()=>`+=${innerHeight*Number(host.dataset.narrativeHero)/100}`,pin:stage,pinSpacing:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>setOwned(host,'data-narrative-progress',self.progress.toFixed(3))}});
        const clock={progress:0};tl.to(clock,{progress:1,duration:1,ease:'none'},0);
        if(lines.length){
          tl.to(lines,{opacity:.58,duration:.08,stagger:0},.16)
            .to(lines[0],{opacity:1,x:14,scale:1.025,duration:.08},.18)
            .to(lines[0],{opacity:.58,x:0,scale:1,duration:.08},.40)
            .to([lines[1],lines[2]],{opacity:1,x:14,duration:.08},.42)
            .to([lines[1],lines[2]],{opacity:.58,x:0,duration:.08},.65)
            .to(lines[3],{opacity:1,x:14,duration:.08},.67)
            .to(lines,{opacity:1,x:0,scale:1,duration:.10},.88);
        }else{
          const title=host.querySelector('h1');
          if(title)tl.to(title,{x:12,scale:.975,duration:.25,ease:'none'},.15).to(title,{x:0,scale:1,duration:.2},.75);
        }
        if(visual){
          const scenes=visual.querySelectorAll('.hero-scene');
          const paths=visual.querySelectorAll('.artifact-path[pathLength]');
          gsap.set(paths,{strokeDasharray:1,strokeDashoffset:1});
          gsap.set(scenes,{autoAlpha:0});gsap.set(scenes[0],{autoAlpha:1});
          tl.to(visual,{opacity:.75,x:-12,duration:.18},.23)
            .to(scenes[0],{autoAlpha:0,scale:.95,duration:.1},.38)
            .fromTo(scenes[1],{autoAlpha:0,scale:1.04},{autoAlpha:1,scale:1,duration:.1},.38)
            .to(paths,{strokeDashoffset:0,duration:.23,stagger:.015},.42)
            .to(scenes[1],{autoAlpha:0,scale:.95,duration:.1},.65)
            .fromTo(scenes[2],{autoAlpha:0,scale:1.04},{autoAlpha:1,scale:1,duration:.1},.65)
            .to(visual,{opacity:.12,x:0,duration:.1},.88);
        }
        stops.push(()=>host.classList.remove('hero-chapter-active'));
      });
    }

    function addSteps(host){
      if(timelines.has(host))return;
      const copy=host.querySelector('[data-narrative-copy]');
      const visual=host.querySelector('[data-narrative-visual]');
      const steps=[...host.querySelectorAll('[data-narrative-step]')];
      const frames=[...visual?.querySelectorAll('[data-scene-frame]') || []];
      if(!copy || !visual || steps.length<2 || frames.length!==steps.length)return;
      host.classList.add('narrative-enabled');
      if(visual.scrollHeight>innerHeight-narrativeClearance()-24){host.classList.remove('narrative-enabled');return;}
      [visual,...frames].forEach(rememberStyle);
      context.add(()=>{
        let points=[];const clock={progress:0};
        const tl=gsap.timeline({paused:true});
        const setters=frames.map(frame=>({opacity:gsap.quickSetter(frame,'opacity'),visibility:gsap.quickSetter(frame,'visibility'),y:gsap.quickSetter(frame,'y','px'),scale:gsap.quickSetter(frame,'scale')}));
        const distance=()=>Math.max(1,copy.offsetHeight-visual.offsetHeight);
        const rebuild=()=>{
          const top=copy.getBoundingClientRect().top;
          points=steps.map((step,i)=>i===0?0:Math.min(.96,Math.max(0,(step.getBoundingClientRect().top-top)/distance())));
        };
        const update=(progress=tl.progress())=>{
          // Deterministic scene interpolation: refresh and reverse cannot leave stale tweens.
          const index=points.reduce((current,point,i)=>progress>=point?i:current,0);
          const width=index+1<points.length?Math.min(.12,(points[index+1]-points[index])*.3):0;
          const blend=width?Math.max(0,Math.min(1,(progress-points[index+1]+width)/width)):0;
          setters.forEach((set,i)=>{
            const opacity=i===index?1-blend:i===index+1?blend:0;
            set.opacity(opacity);set.visibility(opacity>.001?'visible':'hidden');
            set.y(i===index?-20*blend:20*(1-opacity));set.scale(.975+.025*opacity);
          });
          const state=blend>=.5?index+1:index;
          steps.forEach((step,i)=>step.classList.toggle('is-current',i===state));
          visual.querySelectorAll('[data-progress-index]').forEach((segment,i)=>segment.classList.toggle('is-current',i===state));
          setOwned(host,'data-narrative-state',String(state));stepState.set(host,state);
          updateScene();
        };
        rebuild();
        tl.to(clock,{progress:1,duration:1,ease:'none'}).eventCallback('onUpdate',()=>update());
        update(0);
        const trigger=ScrollTrigger.create({id:host.dataset.chapter||'steps-chapter',trigger:copy,start:()=>`top ${narrativeClearance()}px`,end:()=>`+=${distance()}`,pin:visual,pinSpacing:false,animation:tl,scrub:.6,invalidateOnRefresh:true,onRefresh:self=>{rebuild();tl.progress(self.progress);update(self.progress);}});
        timelines.set(host,trigger);
        stops.push(()=>{host.classList.remove('narrative-enabled');steps.forEach(step=>step.classList.remove('is-current'));visual.querySelectorAll('.is-current').forEach(el=>el.classList.remove('is-current'));});
      });
    }

    function scan(){
      identify();
      for(const host of find('[data-narrative-hero]'))addHero(host);
      for(const host of find('[data-narrative-steps]'))addSteps(host);
      boundaries=find('[data-chapter-motion]').filter(el=>!el.closest('[data-narrative-steps]') || el.hasAttribute('data-narrative-steps'));
      for(const host of boundaries){
        if(owners.has(host))continue;owners.add(host);
        const heading=host.querySelector('h1,h2');
        if(!heading || heading.closest('[data-chapter-motion]')!==host || host.hasAttribute('data-narrative-hero'))continue;
        rememberStyle(heading);
        context.add(()=>{
          const direction=host.dataset.chapter==='projects'?-1:1;
          gsap.fromTo(heading,{x:direction*18,y:12,scale:.985},{x:0,y:0,scale:1,ease:'none',scrollTrigger:{trigger:host,start:'top 95%',end:'top 55%',scrub:.6,invalidateOnRefresh:true}});
          const art=host.querySelectorAll('.chapter-frame-art,.case-image,[data-chapter-outro],.femag-project,.resource-index,.process-intro');
          art.forEach(rememberStyle);
          if(art.length)gsap.to(art,{scale:.965,y:-16,ease:'none',scrollTrigger:{trigger:host,start:'bottom 80%',end:'bottom 40%',scrub:.6,invalidateOnRefresh:true}});
        });
      }
      if(!sceneTrigger)context.add(()=>{
        sceneTrigger=ScrollTrigger.create({id:'ambient-chapters',trigger:scope,start:0,end:()=>ScrollTrigger.maxScroll(window),onUpdate:updateScene,onRefresh:updateScene});
      });
      ScrollTrigger.sort();
      updateScene();
    }
    function updateScene(){
      let active;
      for(const host of boundaries){if(host.getBoundingClientRect().top<innerHeight*.55)active=host;}
      const chapter=active?.dataset.chapter;
      let preset=presets[chapter] || presets.neutral;
      if(chapter==='services')preset=presets[['order','connect','automate','decide'][stepState.get(active)||0]];
      if(chapter==='problems')preset={...presets.problems,intensityDelta:.004+.004*(stepState.get(active)||0)};
      setScene(preset);
    }
    scan();
    observer=new MutationObserver(records=>{
      // ScrollTrigger moves existing nodes during refresh; those are not new chapters.
      const removedChapter=records.some(record=>[...record.removedNodes].some(node=>
        node instanceof Element && !node.isConnected && (node.matches('[data-chapter-motion]') || node.querySelector('[data-chapter-motion]'))));
      if(removedChapter){
        clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>gsap.matchMediaRefresh(),120);return;
      }
      if(!identify())return;
      clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{scan();ScrollTrigger.refresh();},120);
    });
    observer.observe(scope,{childList:true,subtree:true});
    const refresh=()=>{if(!alive)return;clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{scan();ScrollTrigger.refresh();},140);};
    scope.addEventListener('load',refresh,true);
    const resizeObserver=new ResizeObserver(refresh);resizeObserver.observe(scope);
    let resizeTimer;
    const reflow=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>gsap.matchMediaRefresh(),220);};
    window.addEventListener('resize',reflow);
    document.fonts?.ready.then(refresh);
    // Native fragment jumps must be re-applied after pin spacers have been measured.
    let id='';try{if(restoreFragment)id=decodeURIComponent(location.hash.slice(1));}catch{}
    restoreFragment=false;
    const fragmentFrame=id?requestAnimationFrame(()=>{ScrollTrigger.refresh();document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});}):0;
    return ()=>{
      alive=false;cancelAnimationFrame(fragmentFrame);observer?.disconnect();resizeObserver.disconnect();clearTimeout(refreshTimer);clearTimeout(resizeTimer);scope.removeEventListener('load',refresh,true);window.removeEventListener('resize',reflow);
      context.revert();stops.forEach(stop=>stop());
      styles.forEach((value,el)=>value===null?el.removeAttribute('style'):el.setAttribute('style',value));
      originalAttributes.forEach((attrs,el)=>attrs.forEach((value,key)=>value===null?el.removeAttribute(key):el.setAttribute(key,value)));originalAttributes.clear();
      owners.clear();stepState.clear();resetScene();
    };
  });
  return ()=>{
    media.revert();ownedAttributes.forEach(el=>el.removeAttribute('data-chapter-motion'));
    originalAttributes.forEach((attrs,el)=>attrs.forEach((value,key)=>value===null?el.removeAttribute(key):el.setAttribute(key,value)));
    resetScene();
  };
}
