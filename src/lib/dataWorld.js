import { createClusterWorld } from './clusterWorld.js';
export const terrainAnchors=[['systems',-8,-8],['automation',4,-13],['data',7,-3]];
export function terrainHeight(x,z,time){return Math.sin(x*.36+z*.12)*.46+Math.sin(z*.31-x*.09)*.44+Math.sin(x*.56-z*.18)*Math.sin(z*.24)*.23+Math.exp(-Math.pow((x+2)*.18,2)-Math.pow((z+8)*.12,2))*1.1+Math.sin(z*.18+x*.12+time)*.13;}
const heightShader=`float heightAt(vec2 p){
 float r=sin(p.x*.36+p.y*.12)*.46+sin(p.y*.31-p.x*.09)*.44;
 r+=sin(p.x*.56-p.y*.18)*sin(p.y*.24)*.23;
 r+=exp(-pow((p.x+2.)*.18,2.)-pow((p.y+8.)*.12,2.))*1.1;
 return r+sin(p.y*.18+p.x*.12+uTime)*.13;
}`;
const vertexShader=`uniform float uTime; uniform float uDepth; attribute float aLight; attribute float aSize; attribute vec3 aColor;
varying vec3 vColor; varying float vLight; varying float vBlur; varying float vFade;
${heightShader}
void main(){vec3 p=position;p.y=heightAt(p.xz);vec4 mv=modelViewMatrix*vec4(p,1.);
float dist=-mv.z;vColor=aColor;vLight=aLight*(.88+.12*sin(uTime+p.x*.18+p.z*.13));
vBlur=1.-smoothstep(4.,16.,dist);vFade=1.-smoothstep(24.,uDepth,dist);
gl_Position=projectionMatrix*mv;gl_PointSize=clamp((aSize+vBlur*5.)*110./max(1.,dist),1.,52.);}`;
const fragmentShader=`uniform float uIntensity; uniform float uVisibility; varying vec3 vColor; varying float vLight; varying float vBlur; varying float vFade;
void main(){float d=length(gl_PointCoord-.5)*2.;float core=exp(-d*d*mix(48.,5.,vBlur));
float halo=exp(-d*d*6.)*.24;float alpha=(core+halo)*vLight*vFade*uIntensity*uVisibility;
if(alpha<.006)discard;gl_FragColor=vec4(vColor,alpha);}`;

export function createDataWorld(T, scene, mobile = false, narrative = false, phase03 = false) {
  const pointsGeometry=new T.BufferGeometry();
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
  const uniforms={uTime:{value:0},uIntensity:{value:1},uVisibility:{value:1},uConnections:{value:1},uDepth:{value:80},
    uDispersion:{value:0},uOrder:{value:0},uClusters:{value:0},uPointer:{value:new T.Vector2()},
    uFlow:{value:0},uData:{value:0},uIntelligence:{value:0},uClarity:{value:0},uConvergence:{value:0},uPulsePhase:{value:0},uSelectionPhase:{value:0}};
  const morphShader=narrative?`uniform float uDispersion;uniform float uOrder;uniform vec2 uPointer;
    vec3 terrainMorph(vec3 p){vec3 ordered=vec3(p.x,p.y*.18,p.z);
      p.x+=sin(p.z*.65+p.x*.8)*uDispersion*.48;
      p.y+=sin(p.x*1.1-p.z*.3)*uDispersion*.38;
      p=mix(p,ordered,uOrder);
      p.y+=.08*exp(-length(p.xz-vec2(uPointer.x*12.,-20.+uPointer.y*10.))*.25);
      return p;}`:'';
  const morph=source=>narrative?source.replace('void main()',`${morphShader}\nvoid main()`).replace('p.y=heightAt(p.xz);','p.y=heightAt(p.xz);p=terrainMorph(p);'):source;
  const terrainVertex=narrative?vertexShader.replace('vColor=aColor;',
    'vColor=mix(vec3(.16,.29,.41),aColor,smoothstep(.55,.95,sin(p.x*.17-p.z*.11))*.6+.08);'):vertexShader;
  const material=new T.ShaderMaterial({uniforms,vertexShader:morph(terrainVertex),fragmentShader,transparent:true,depthWrite:false,blending:T.AdditiveBlending});
  scene.add(new T.Points(pointsGeometry,material));
  const lineGeometry=new T.BufferGeometry();lineGeometry.setAttribute('position',new T.Float32BufferAttribute(lines,3));
  const lineMaterial=new T.ShaderMaterial({uniforms,vertexShader:morph(`uniform float uTime;uniform float uDepth;varying float vFade;${heightShader}
  void main(){vec3 p=position;p.y=heightAt(p.xz);vec4 mv=modelViewMatrix*vec4(p,1.);vFade=1.-smoothstep(20.,uDepth,-mv.z);gl_Position=projectionMatrix*mv;}`),
  fragmentShader:'uniform float uConnections;varying float vFade;void main(){gl_FragColor=vec4(.23,.32,.38,.08*vFade*uConnections);}',transparent:true,depthWrite:false});
  scene.add(new T.LineSegments(lineGeometry,lineMaterial));
  const clusters=narrative?createClusterWorld(T,scene,uniforms,phase03):null;
  return { uniforms, anchor:clusters?.anchor, update(time, state) {
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
    }
  }, dispose() {
    clusters?.dispose();
    pointsGeometry.dispose(); material.dispose(); lineGeometry.dispose(); lineMaterial.dispose();
    scene.clear();
  }};
}
