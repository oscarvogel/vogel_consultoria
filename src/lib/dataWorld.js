import { evidenceCorner } from './evidenceScenes.js';
import { createClusterWorld } from './clusterWorld.js';
import { heightChunk, opticsChunk, pointFragment, morphChunk, paletteChunk } from './shaders/terrainChunks.js';
export const terrainAnchors=[['systems',-8,-8],['automation',4,-13],['data',7,-3]];
export function terrainHeight(x,z,time){return Math.sin(x*.36+z*.12)*.46+Math.sin(z*.31-x*.09)*.44+Math.sin(x*.56-z*.18)*Math.sin(z*.24)*.23+Math.exp(-Math.pow((x+2)*.18,2)-Math.pow((z+8)*.12,2))*1.1+Math.sin(z*.18+x*.12+time)*.13;}
const hash=(a,b)=>Math.abs(Math.sin(a*127.1+b*311.7)*43758.5453)%1;

const terrainVertex=narrative=>`uniform float uTime;uniform float uDepth;uniform float uIntensity;uniform float uVisibility;uniform float uHeat;uniform float uCool;
attribute float aLight;attribute float aSize;attribute float aSeed;varying vec3 vColor;varying float vSharp;
${heightChunk}${opticsChunk}${morphChunk(narrative)}${paletteChunk}
void main(){vec3 p=position;float h=heightAt(p.xz);p.y=h;p=terrainMorph(p);
 vec4 mv=modelViewMatrix*vec4(p,1.);float dist=-mv.z;
 // Near-field fill-rate guard: only a sparse subset survives as large foreground bokeh.
 if(aSeed<.988*(1.-smoothstep(6.,21.,dist))){gl_Position=vec4(2.,2.,2.,1.);gl_PointSize=0.;vColor=vec3(0.);vSharp=1.;return;}
 // Amber lives on thin ridge lines and the central peak; valleys stay institutional blue.
 float crest=smoothstep(.78,1.32,h);vec2 q=p.xz-vec2(-2.,-8.);float peak=exp(-dot(q,q)*.045);
 float vein=smoothstep(.82,.99,sin(p.x*.14-p.z*.12+sin(p.z*.07)*1.4));
 float sweep=exp(-pow(fract(uTime*.03-p.z*.011+p.x*.004)-.5,2.)*70.);
 // Foreground bokeh carries warm light, as in the reference landscape.
 float near=1.-smoothstep(7.,17.,dist);
 float warm=clamp(crest*.7+peak*.9+vein*.55+near*step(.993,aSeed)*.8,0.,1.)*uHeat;
 float twinkle=.84+.16*sin(uTime*1.9+aSeed*43.);
 float emission=aLight*twinkle*(.34+warm*1.25+peak*peak*uHeat*1.9)*(1.+sweep*warm*1.2);
 if(aSeed>.993)emission*=2.4;
 float fog=exp(-max(0.,dist-10.)*uFog)*(1.-smoothstep(uDepth*.55,uDepth,dist));
 vec3 cool=mix(BLUE,BLUE_LIGHT,aSeed*aSeed)*uCool;
 vColor=mix(cool,mix(AMBER,AMBER_HOT,peak),warm)*emission*fog*uIntensity*uVisibility;
 float energy;gl_PointSize=pointSize(aSize*uPixelRatio*110./max(dist,1.),dist,vSharp,energy);vColor*=energy;
 gl_Position=projectionMatrix*mv;}`;

const gridVertex=narrative=>`uniform float uTime;uniform float uDepth;varying float vFade;${heightChunk}${morphChunk(narrative)}
void main(){vec3 p=position;p.y=heightAt(p.xz);p=terrainMorph(p);vec4 mv=modelViewMatrix*vec4(p,1.);
 vFade=(1.-smoothstep(20.,uDepth,-mv.z))*smoothstep(3.,9.,-mv.z);gl_Position=projectionMatrix*mv;}`;

// Thin vertical "data pillars" rising from crests, with glowing tips (reference landscape).
const pillarVertex=narrative=>`uniform float uTime;uniform float uDepth;uniform float uIntensity;uniform float uVisibility;uniform float uHeat;
attribute float aEnd;attribute float aHeight;attribute float aSeed;varying vec3 vColor;varying float vSharp;
${heightChunk}${opticsChunk}${morphChunk(narrative)}${paletteChunk}
void main(){vec3 p=position;p.y=heightAt(p.xz);p=terrainMorph(p);p.y+=aEnd*aHeight*(1.-uOrder*.55);
 vec4 mv=modelViewMatrix*vec4(p,1.);float dist=-mv.z;
 float fog=exp(-max(0.,dist-10.)*uFog)*(1.-smoothstep(uDepth*.5,uDepth,dist));
 float beat=.72+.28*sin(uTime*.9+aSeed*6.283);
 vColor=AMBER*fog*uHeat*uIntensity*uVisibility*${'#TIP#'};
 float energy;gl_PointSize=pointSize((2.4+aSeed*3.2)*uPixelRatio*24./max(dist,1.),dist,vSharp,energy);vColor*=energy;
 gl_Position=projectionMatrix*mv;}`;

export function createDataWorld(T, scene, mobile = false, narrative = false, phase03 = false) {
  const pointsGeometry=new T.BufferGeometry();
  const cols=mobile?151:321,rows=mobile?91:181,pos=[],seeds=[],lights=[],sizes=[],lines=[];
  const point=(x,z)=>[(x/(cols-1)-.5)*42,0,12-z/(rows-1)*70];
  for(let z=0;z<rows;z++)for(let x=0;x<cols;x++){
   const p=point(x,z);pos.push(...p);
   const seed=hash(x,z);seeds.push(seed);
   lights.push(seed>.97?1.15:.34+seed*.62);
   sizes.push(seed>.985?1.9+seed:seed>.6?.42+seed*.62:.3+seed*.4);
   if(x<cols-1&&z%4===0)lines.push(...p,...point(x+1,z));
   if(z<rows-1&&x%6===0)lines.push(...p,...point(x,z+1));
  }
  pos.push(-2,0,-8);seeds.push(.999);lights.push(1.4);sizes.push(2.6);
  pointsGeometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));
  pointsGeometry.setAttribute('aSeed',new T.Float32BufferAttribute(seeds,1));
  pointsGeometry.setAttribute('aLight',new T.Float32BufferAttribute(lights,1));
  pointsGeometry.setAttribute('aSize',new T.Float32BufferAttribute(sizes,1));
  const uniforms={uEvidence:{value:0},uEvidenceDock:{value:0},uEvidenceAspect:{value:.5},uTime:{value:0},uIntensity:{value:1},uVisibility:{value:1},uConnections:{value:1},uDepth:{value:80},
    uDispersion:{value:0},uOrder:{value:0},uClusters:{value:0},uPointer:{value:new T.Vector2()},
    uFlow:{value:0},uData:{value:0},uIntelligence:{value:0},uClarity:{value:0},uConvergence:{value:0},uPulsePhase:{value:0},uSelectionPhase:{value:0},
    uFocus:{value:22},uAperture:{value:.9},uHeat:{value:1},uCool:{value:1},uFog:{value:.026},uDust:{value:0},
    uPixelRatio:{value:1},uMaxPoint:{value:64},uViewHeight:{value:900}};
  const additive={uniforms,transparent:true,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,toneMapped:false};
  const material=new T.ShaderMaterial({...additive,vertexShader:terrainVertex(narrative),fragmentShader:pointFragment});
  const terrain=new T.Points(pointsGeometry,material);terrain.name='terrain';
  const lineGeometry=new T.BufferGeometry();lineGeometry.setAttribute('position',new T.Float32BufferAttribute(lines,3));
  const lineMaterial=new T.ShaderMaterial({...additive,vertexShader:gridVertex(narrative),
    fragmentShader:'uniform float uConnections;uniform float uIntensity;varying float vFade;void main(){gl_FragColor=vec4(vec3(.022,.05,.085)*vFade*uConnections*(.4+uIntensity*.6),1.);}'});
  const grid=new T.LineSegments(lineGeometry,lineMaterial);grid.name='grid';
  // Pillars sit on crests chosen deterministically; bases follow heightAt on the GPU.
  const pillarPositions=[],pillarEnds=[],pillarHeights=[],pillarSeeds=[],tipPositions=[],tipHeights=[],tipSeeds=[];
  for(let i=0,tries=0;i<(mobile?20:40)&&tries<4000;tries++){
    const x=(hash(tries,7.3)-.5)*36,z=4-hash(tries,1.9)*40,seed=hash(tries,3.1);
    if(terrainHeight(x,z,0)<.55+seed*.25)continue;
    const height=.55+hash(tries,5.7)**2*1.9;
    pillarPositions.push(x,0,z,x,0,z);pillarEnds.push(0,1);pillarHeights.push(height,height);pillarSeeds.push(seed,seed);
    tipPositions.push(x,0,z);tipHeights.push(height);tipSeeds.push(seed);i++;
  }
  const pillarGeometry=new T.BufferGeometry();
  pillarGeometry.setAttribute('position',new T.Float32BufferAttribute(pillarPositions,3));
  pillarGeometry.setAttribute('aEnd',new T.Float32BufferAttribute(pillarEnds,1));
  pillarGeometry.setAttribute('aHeight',new T.Float32BufferAttribute(pillarHeights,1));
  pillarGeometry.setAttribute('aSeed',new T.Float32BufferAttribute(pillarSeeds,1));
  const pillarMaterial=new T.ShaderMaterial({...additive,
    vertexShader:pillarVertex(narrative).replace('#TIP#','mix(.0,.55,aEnd*aEnd)*beat').replace(/float energy;gl_PointSize=.*?vColor\*=energy;/,''),
    fragmentShader:'varying vec3 vColor;void main(){gl_FragColor=vec4(vColor,1.);}'});
  const pillars=new T.LineSegments(pillarGeometry,pillarMaterial);pillars.name='pillars';pillars.frustumCulled=false;
  const tipGeometry=new T.BufferGeometry();
  tipGeometry.setAttribute('position',new T.Float32BufferAttribute(tipPositions,3));
  tipGeometry.setAttribute('aEnd',new T.Float32BufferAttribute(new Array(tipSeeds.length).fill(1),1));
  tipGeometry.setAttribute('aHeight',new T.Float32BufferAttribute(tipHeights,1));
  tipGeometry.setAttribute('aSeed',new T.Float32BufferAttribute(tipSeeds,1));
  const tipMaterial=new T.ShaderMaterial({...additive,vertexShader:pillarVertex(narrative).replace('#TIP#','(2.2+aSeed*2.4)*beat'),fragmentShader:pointFragment});
  const tips=new T.Points(tipGeometry,tipMaterial);tips.name='pillarTips';tips.frustumCulled=false;
  scene.add(grid,terrain);
  const clusters=narrative?createClusterWorld(T,scene,uniforms,phase03):null;
  scene.add(pillars,tips);
  const optional=(key,uniform)=>value=>{if(value!==undefined)uniforms[uniform].value=value;};
  const setters=[['focus','uFocus'],['aperture','uAperture'],['heat','uHeat'],['cool','uCool'],['fog','uFog'],['dust','uDust']].map(([key,uniform])=>[key,optional(key,uniform)]);
  return { uniforms, frameCorner:(index,progress,out)=>evidenceCorner(index,progress,out,uniforms.uEvidenceAspect.value), anchor:clusters?.anchor,
    setQuality({pixelRatio,maxPoint,height}){uniforms.uPixelRatio.value=pixelRatio;uniforms.uMaxPoint.value=maxPoint;uniforms.uViewHeight.value=height;},
    update(time, state) {
    uniforms.uTime.value=time;
    if(state) {
      uniforms.uIntensity.value=state.intensity;
      uniforms.uVisibility.value=state.visibility;
      uniforms.uConnections.value=state.connections;
      uniforms.uDepth.value=state.depth;
      uniforms.uDispersion.value=state.dispersion??0;
      uniforms.uOrder.value=state.order??0;
      uniforms.uClusters.value=state.clusters??0;
      uniforms.uFlow.value=state.flow??0;uniforms.uData.value=state.data??0;
      uniforms.uIntelligence.value=state.intelligence??0;uniforms.uClarity.value=state.clarity??0;uniforms.uConvergence.value=state.convergence??0;
      uniforms.uPulsePhase.value=state.pulsePhase??0;uniforms.uSelectionPhase.value=state.selectionPhase??0;
      for(const [key,set] of setters)set(state[key]);
    }
  }, dispose() {
    clusters?.dispose();
    for(const o of [terrain,grid,pillars,tips]){o.geometry.dispose();o.material.dispose();}
    scene.clear();
  }};
}
