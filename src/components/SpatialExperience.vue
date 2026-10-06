<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { loadSiteMotion } from '../composables/useSiteMotion.js';
import { createSpatialSceneController } from '../lib/sceneController.js';
import { spatialScenes } from '../lib/spatialScenes.js';
import { createSpatialEngine } from '../lib/spatialEngine.js';
import { createCameraRig } from '../lib/cameraRig.js';
import { terrainAnchors, terrainHeight } from '../lib/dataWorld.js';
import '../styles/spatial.css';
import { mountSpatialNarrative } from '../lib/mountSpatialNarrative.js';

const props=defineProps({ narrative:{type:Boolean,default:false},phase03:{type:Boolean,default:false} });
const host = ref(null);
let disposed = false, generation = 0, stopSession, eligibility;
const controller = props.narrative ? null : createSpatialSceneController(spatialScenes);
async function reconcile() {
  const version = ++generation;
  stopSession?.(); stopSession = undefined;
  if (disposed || !eligibility.matches) return;
  let engine, trigger, resize, visibility, idle;
  const page = host.value.closest('.home-page'), main = page.querySelector('main');
  const hero = main.querySelector('.landscape-hero');
  const surfaces = [...main.querySelectorAll('.data-landscape')];
  const heroSurface = hero.querySelector('.data-landscape');
  let heroLayout, inView = false, heroMode = true;
  const clean = () => {
    trigger?.kill(); resize?.disconnect(); visibility?.disconnect(); clearTimeout(idle);
    window.removeEventListener('pointermove', pointer); window.removeEventListener('pointerout', neutral);
    engine?.dispose(); page.classList.remove('spatial-live'); host.value?.classList.remove('spatial-hero');
    for(const surface of surfaces) surface.classList.remove('spatial-surface-live');
    for(const [name] of terrainAnchors) for(const axis of ['x','y']) hero.style.removeProperty(`--terrain-${name}-${axis}`);
  };
  let rig;
  function neutral() { rig?.setPointer(0,0); clearTimeout(idle); }
  function pointer(event) {
    if(event.pointerType === 'touch' || !inView) return;
    rig.setPointer(event.clientX / innerWidth * 2 - 1, event.clientY / innerHeight * 2 - 1);
    clearTimeout(idle); idle = setTimeout(neutral,900);
  }
  function measure() {
    host.value.style.height = `${heroSurface.clientHeight}px`;
    if(trigger) updateProgress(trigger);
    engine.resize(host.value.clientWidth, host.value.clientHeight);
    const r = host.value.getBoundingClientRect();
    heroLayout = { top: r.top - hero.getBoundingClientRect().top, height: r.height, parentHeight: hero.clientHeight };
  }
  function updateProgress(self) {
    const state = controller.setProgress(self.progress);
    rig.setTransition(state.from,state.to,state.blend);
    // Intro keeps the original lower terrain composition; the rest uses a narrow test strip.
    heroMode = self.scroll() < hero.offsetHeight * .5;
    host.value.classList.toggle('spatial-hero', heroMode);
    const fade = Math.max(0,Math.min(1,(self.scroll()/hero.offsetHeight-.15)/.65));
    host.value.style.bottom = `${(innerHeight-hero.clientHeight)*(1-fade)}px`;
    const stripStart = Math.max(0,100-160/Math.max(1,host.value.clientHeight)*100);
    host.value.style.maskImage = `linear-gradient(transparent ${fade*stripStart}%,#000 ${20+fade*80}%,#000 ${65+fade*35}%,rgba(0,0,0,${fade}))`;
    host.value.style.opacity = String(1-fade*.55);
    if(heroLayout) heroLayout.top = host.value.getBoundingClientRect().top - hero.getBoundingClientRect().top;
  }
  try {
    const [T, { ScrollTrigger }] = await Promise.all([import('three'),loadSiteMotion()]);
    await document.fonts?.ready;
    if(disposed || version !== generation || !eligibility.matches) return;
    engine = createSpatialEngine(T, {
      onContextLost() { page.classList.remove('spatial-live'); },
      onContextRestored() { measure(); },
      onError: clean,
    });
    rig = createCameraRig(T,engine.camera);
    const state = controller.getState(); rig.setTransition(state.from,state.to,state.blend);
    engine.renderer.domElement.className = 'spatial-canvas';
    host.value.append(engine.renderer.domElement);
    engine.renderer.domElement.__vogelSpatial = { getState: () => ({ ...engine.getState(),
      progress: controller.getState().progress, from: controller.getState().from.id, to: controller.getState().to.id,
      position: engine.camera.position.toArray(), quaternion: engine.camera.quaternion.toArray() }) };
    trigger = ScrollTrigger.create({ id: 'vogel-spatial-core', trigger: main, start: 'top top',
      end: () => Math.max(1, main.offsetHeight - innerHeight), invalidateOnRefresh: true,
      onUpdate: updateProgress, onRefresh: updateProgress });
    updateProgress(trigger);
    resize = new ResizeObserver(measure); resize.observe(host.value); resize.observe(heroSurface);
    measure();
    visibility = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if(inView) engine.start(render); else { engine.pause(); neutral(); }
    });
    visibility.observe(main);
    function render(now, dt, elapsed) {
      rig.update(dt); engine.world.update(elapsed*Math.PI/10,controller.getState());
      engine.camera.updateMatrixWorld();
      if(heroMode && heroLayout) {
        for(const [name,x,z] of terrainAnchors) {
          const point = engine.anchorPoint.set(x,terrainHeight(x,z,engine.uniforms.uTime.value),z).project(engine.camera);
          // Project the fixed viewport surface into the Hero's local HTML coordinates.
          const y = heroLayout.top + (1-point.y)*.5*heroLayout.height;
          hero.style.setProperty(`--terrain-${name}-x`,`${(point.x+1)*50}%`);
          hero.style.setProperty(`--terrain-${name}-y`,`${y/heroLayout.parentHeight*100}%`);
        }
      }
      page.classList.add('spatial-live');
    }
    for(const surface of surfaces) surface.classList.add('spatial-surface-live');
    window.addEventListener('pointermove',pointer,{passive:true}); window.addEventListener('pointerout',neutral);
    stopSession = clean;
  } catch { clean(); /* The existing posters remain visible. */ }
}
onMounted(() => {
  if(props.narrative){stopSession=mountSpatialNarrative(host.value,{phase03:props.phase03});return;}
  eligibility = matchMedia('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  eligibility.addEventListener('change',reconcile); reconcile();
});
onUnmounted(() => { disposed = true; generation++; eligibility?.removeEventListener('change',reconcile); stopSession?.(); });
</script>
<template><div ref="host" class="spatial-experience" aria-hidden="true"></div></template>
