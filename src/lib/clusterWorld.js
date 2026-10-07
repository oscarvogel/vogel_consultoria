import { clusterDefinitions, dataPosition } from './narrativeScenes.js';
import { opticsChunk, pointFragment, paletteChunk } from './shaders/terrainChunks.js';

export const DUST_PER_POINT = 12, FLOW_PER_SEGMENT = 24;
const additive = T => ({ transparent:true, depthWrite:false, depthTest:false, blending:T.AdditiveBlending, toneMapped:false });

// Immutable endpoints: GPU morphing uses these same positions for points, threads, dust and flow.
export function createClusterWorld(T, scene, uniforms, phase03 = false) {
  const dispersed=[], ordered=[], colors=[], threadFrom=[], threadTo=[], threadColors=[];
  const patterns=[],routes=[],threadPatterns=[],threadRoutes=[],scratch=new T.Vector3();
  const random = i => Math.abs(Math.sin(i*127.1+19.7)*43758.5453)%1;
  for(let group=0;group<4;group++) {
    const c=clusterDefinitions[group], base=dispersed.length/3;
    for(let i=0;i<128;i++) {
      const a=i*2.399963, lane=Math.floor(i/32), step=i%32;
      dispersed.push(c.scattered[0]+(i===0?0:(lane-1.5)*1.1+(random(i+group*131)-.5)*.32),
        c.scattered[1]+(i===0?0:Math.sin(lane*2+group)*.8+(random(i+7)-.5)*.35),
        c.scattered[2]+(i===0?0:(step-15.5)*.19+(random(i+11)-.5)*.6));
      // Narrow, layered paths, rather than a square grid or generic floating cubes.
      ordered.push(c.ordered[0]+(i===0?0:Math.sin(a)*.55),c.ordered[1]+(i===0?0:Math.floor(i/32)*.23),c.ordered[2]+(i===0?0:(i%32-15.5)*.15));
      dataPosition(...ordered.slice(-3),group,i,scratch);patterns.push(scratch.x,scratch.y,scratch.z);routes.push(group/3);
      colors.push(0,0,0);
      if(i>0 && i%3===0) {
        for(const n of [base+i-1,base+i]) {
          threadFrom.push(...dispersed.slice(n*3,n*3+3));
          threadTo.push(...ordered.slice(n*3,n*3+3));
          threadColors.push(0,0,0);
          threadPatterns.push(...patterns.slice(n*3,n*3+3));threadRoutes.push(-1);
        }
      }
    }
    if(group>0) {
      const previous=clusterDefinitions[group-1];
      // Incomplete relationships grow into a continuous spine during organization.
      threadFrom.push(...previous.scattered,...previous.scattered);
      threadTo.push(...previous.ordered,...c.ordered);
      threadColors.push(1,1,1,1,1,1);
      dataPosition(...previous.ordered,group-1,0,scratch);threadPatterns.push(scratch.x,scratch.y,scratch.z);
      dataPosition(...c.ordered,group,0,scratch);threadPatterns.push(scratch.x,scratch.y,scratch.z);
      threadRoutes.push((group-1)/3,group/3);
    }
  }
  // aColor.r flags the amber spine; skeleton colors are computed in the shader.
  const extension=phase03?`uniform float uData;uniform float uFlow;uniform float uClarity;uniform float uPulsePhase;
    attribute vec3 aData;attribute float aRoute;varying float vRoute;
    float pulse(float route){return route<0.?0.:exp(-pow((route-uPulsePhase)*22.,2.))*uFlow;}`:'';
  const motion=`${extension} uniform float uOrder;uniform float uClusters;uniform vec2 uPointer;uniform float uTime;
    attribute vec3 aOrdered;attribute vec3 aColor;varying vec3 vColor;varying float vSharp;
    ${opticsChunk}${paletteChunk}
    vec3 bump(vec3 p){p.y+=.08*exp(-length(p.xz-vec2(uPointer.x*12.,-20.+uPointer.y*10.))*.25);return p;}
    vec3 morph(){vec3 p=mix(position,aOrdered,uOrder);
      ${phase03?'p=mix(p,aData,uData);vRoute=aRoute;':''}
      return bump(p);}`;
  function geometry(from,to,color) {
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(from,3));
    g.setAttribute('aOrdered',new T.Float32BufferAttribute(to,3));
    g.setAttribute('aColor',new T.Float32BufferAttribute(color,3));
    return g;
  }
  const points=geometry(dispersed,ordered,colors), lines=geometry(threadFrom,threadTo,threadColors);
  if(phase03){
    for(const [g,data,route] of [[points,patterns,routes],[lines,threadPatterns,threadRoutes]]){
      g.setAttribute('aData',new T.Float32BufferAttribute(data,3));g.setAttribute('aRoute',new T.Float32BufferAttribute(route,1));
    }
  }
  const pointMaterial=new T.ShaderMaterial({uniforms,...additive(T),
    vertexShader:`${motion} void main(){vec4 mv=modelViewMatrix*vec4(morph(),1.);float dist=-mv.z;
      vec3 c=mix(BLUE_LIGHT*1.05,AMBER*1.4,uOrder*.38);float glow=1.;
      ${phase03?'c=mix(BLUE_LIGHT*1.05,AMBER*1.4,uOrder*.38*(1.-uFlow)*(1.-uData*.65)*(1.-uClarity*.7));float event=pulse(aRoute);c=mix(c,AMBER_HOT*3.2,event);glow+=event*.6;':''}
      vColor=c*glow*uClusters;
      float energy;gl_PointSize=pointSize(uPixelRatio*clamp(128./max(dist,1.),2.4,13.),dist,vSharp,energy);vColor*=energy;
      gl_Position=projectionMatrix*mv;}`,
    fragmentShader:pointFragment});
  const lineMaterial=new T.ShaderMaterial({uniforms,...additive(T),
    vertexShader:`${motion} void main(){vec4 mv=modelViewMatrix*vec4(morph(),1.);
      vColor=mix(BLUE_LIGHT*.7,AMBER*1.8,max(aColor.r,uOrder*.45)*uOrder);vSharp=uClusters*(.2+uOrder*.3);
      ${phase03?'vSharp*=mix(1.,aRoute<0.?.1:.55,uClarity);':''}
      gl_Position=projectionMatrix*mv;}`,
    fragmentShader:phase03?`uniform float uFlow;uniform float uPulsePhase;varying float vRoute;varying vec3 vColor;varying float vSharp;${paletteChunk}
      void main(){float event=vRoute<0.?0.:exp(-pow((vRoute-uPulsePhase)*22.,2.))*uFlow;
      vec3 resting=mix(vColor,BLUE_LIGHT*.7,uFlow);
      gl_FragColor=vec4(mix(resting,AMBER_HOT*3.,event)*(vSharp+event*.6),1.);}`:
      'varying vec3 vColor;varying float vSharp;void main(){gl_FragColor=vec4(vColor*vSharp,1.);}'});
  const cloud=new T.Points(points,pointMaterial), threads=new T.LineSegments(lines,lineMaterial);
  cloud.name='clusters';threads.name='threads';
  // Morphs extend outside the original bound; avoid incorrect CPU frustum culling.
  cloud.frustumCulled=false;threads.frustumCulled=false;
  scene.add(cloud,threads);
  let extraGeometry,extraMaterial,extra,dust,flow;
  if(phase03){
    const positions=[],kinds=[],branches=[];
    function segment(a,b,kind,branch=0){positions.push(...a,...b);kinds.push(kind,kind);branches.push(branch,branch);}
    const node=clusterDefinitions[2].ordered;
    for(const [i,end] of [[0,[0,3,-35]],[1,[5,2,-37]],[2,[10,2,-35]]])segment(node,end,0,i);
    const hub=[4,1,-40],exit=[4,1,-48];
    for(const c of clusterDefinitions)segment(c.ordered,hub,1);
    segment(hub,exit,2);
    const corners=[[0,1,-48],[8,1,-48],[8,5,-48],[0,5,-48]];
    for(let i=0;i<4;i++)segment(corners[i],corners[(i+1)%4],3);
    extraGeometry=new T.BufferGeometry();extraGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    extraGeometry.setAttribute('aKind',new T.Float32BufferAttribute(kinds,1));extraGeometry.setAttribute('aBranch',new T.Float32BufferAttribute(branches,1));
    extraMaterial=new T.ShaderMaterial({uniforms,...additive(T),
      vertexShader:`uniform float uEvidence;uniform float uEvidenceAspect;attribute float aKind;attribute float aBranch;varying float vKind;varying float vBranch;
        void main(){vKind=aKind;vBranch=aBranch;vec3 p=position;if(aKind>2.5){p.x=4.+(position.x-4.)*mix(1.,3.*uEvidenceAspect/4.,uEvidence);p.y=3.+(position.y-3.)*mix(1.,1.5,uEvidence);}gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader:`uniform float uEvidence;uniform float uEvidenceDock;uniform float uIntelligence;uniform float uSelectionPhase;uniform float uConvergence;uniform float uClusters;
        varying float vKind;varying float vBranch;${paletteChunk}
        void main(){vec3 color=BLUE_LIGHT;float alpha;
          if(vKind<.5){float selected=1.-step(.25,abs(vBranch-1.));float evaluation=smoothstep(0.,.3,uSelectionPhase);
            float selection=smoothstep(.35,.85,uSelectionPhase);alpha=uIntelligence*evaluation*mix(.42,mix(.06,.85,selected),selection);
            color=mix(BLUE_LIGHT*1.2,AMBER*4.,selected*selection);}
          else{color=vKind<1.5?AMBER*2.2:vKind<2.5?AMBER_HOT*5.:BLUE_LIGHT;alpha=uConvergence*(vKind<1.5?.55:vKind<2.5?.8:.09);}
          // Evidence contour: HDR amber outline that hands off to the DOM frame.
          if(vKind>2.5)color=mix(BLUE_LIGHT,AMBER*3.,uEvidence);
          alpha*=vKind>2.5?(1.+uEvidence*4.)*(1.-smoothstep(0.,.15,uEvidenceDock)):1.-uEvidence;
          gl_FragColor=vec4(color*alpha*(vKind>2.5?max(.7,uClusters):uClusters),1.);}`});
    extra=new T.LineSegments(extraGeometry,extraMaterial);extra.name='extra';extra.frustumCulled=false;scene.add(extra);
    dust=createDust(T,uniforms,dispersed,ordered,patterns,routes);
    flow=createFlow(T,uniforms,threadFrom,threadTo,threadPatterns,threadRoutes);
    scene.add(dust,flow);
  }
  const newAnchor=new T.Vector3();
  return {
    anchor(index,out) {
      const c=clusterDefinitions[index], p=uniforms.uOrder.value;
      out.fromArray(c.scattered).lerp(newAnchor.fromArray(c.ordered),p);
      if(phase03){dataPosition(...c.ordered,index,0,newAnchor);out.lerp(newAnchor,uniforms.uData.value);}
      out.y+=.08*Math.exp(-Math.hypot(out.x-uniforms.uPointer.value.x*12,out.z+20-uniforms.uPointer.value.y*10)*.25);
      return out;
    },
    dispose(){points.dispose();lines.dispose();pointMaterial.dispose();lineMaterial.dispose();scene.remove(cloud,threads);
      extraGeometry?.dispose();extraMaterial?.dispose();if(extra)scene.remove(extra);
      for(const o of [dust,flow])if(o){o.geometry.dispose();o.material.dispose();scene.remove(o);}},
  };
}

const hash=(a,b)=>Math.abs(Math.sin(a*91.7+b*47.3)*43758.5453)%1;
// Dust: children of every skeleton point, plus a sparse ambient volume that keeps depth on screen.
function createDust(T,uniforms,dispersed,ordered,patterns,routes){
  const count=dispersed.length/3*DUST_PER_POINT,position=new Float32Array(count*3),aOrdered=new Float32Array(count*3),aData=new Float32Array(count*3),aSeed=new Float32Array(count),aRoute=new Float32Array(count);
  for(let i=0;i<count;i++){
    const parent=Math.floor(i/DUST_PER_POINT),seed=hash(i,1),ambient=seed>.72;
    const u=hash(i,2)*2-1,phi=hash(i,3)*6.2832,r=Math.sqrt(1-u*u),dir=[r*Math.cos(phi),u*.7,r*Math.sin(phi)];
    const spread=ambient?[5.5,3.2,2.6]:[1.5,.42,.22],radius=Math.cbrt(hash(i,4));
    for(let k=0;k<3;k++){
      position[i*3+k]=dispersed[parent*3+k]+dir[k]*spread[0]*radius;
      aOrdered[i*3+k]=ordered[parent*3+k]+dir[k]*(ambient?spread[1]:spread[1])*radius;
      aData[i*3+k]=patterns[parent*3+k]+dir[k]*(ambient?spread[2]:spread[2])*radius;
    }
    aSeed[i]=seed;aRoute[i]=routes[parent];
  }
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.BufferAttribute(position,3));g.setAttribute('aOrdered',new T.BufferAttribute(aOrdered,3));
  g.setAttribute('aData',new T.BufferAttribute(aData,3));g.setAttribute('aSeed',new T.BufferAttribute(aSeed,1));g.setAttribute('aRoute',new T.BufferAttribute(aRoute,1));
  const material=new T.ShaderMaterial({uniforms,...additive(T),fragmentShader:pointFragment,
    vertexShader:`uniform float uTime;uniform float uOrder;uniform float uData;uniform float uClusters;uniform float uDust;uniform float uFlow;uniform float uPulsePhase;uniform float uClarity;
    attribute vec3 aOrdered;attribute vec3 aData;attribute float aSeed;attribute float aRoute;varying vec3 vColor;varying float vSharp;${opticsChunk}${paletteChunk}
    void main(){vec3 p=mix(mix(position,aOrdered,uOrder),aData,uData);
      // Layered sine field: slow, divergence-light drift; calmer once the system is ordered.
      float s=aSeed*6.2832,amp=mix(.42,.12,uOrder)*(aSeed>.72?2.2:1.);
      p+=vec3(sin(uTime*.31+s+p.y*.6)+sin(uTime*.17+p.z*.4)*.5,sin(uTime*.23+s*1.7+p.x*.5)*.6,cos(uTime*.27+s*2.3+p.x*.3))*amp;
      vec4 mv=modelViewMatrix*vec4(p,1.);float dist=-mv.z;
      float event=aRoute<0.?0.:exp(-pow((aRoute-uPulsePhase)*22.,2.))*uFlow;
      vec3 c=aSeed>.86?AMBER*1.2:mix(BLUE,BLUE_LIGHT,fract(aSeed*7.));
      c=mix(c,AMBER_HOT*2.,event*.7);
      vColor=c*uDust*uClusters*(aSeed>.72?.55:.9)*(1.-uClarity*.35)*(.75+.25*sin(uTime*1.3+s*5.));
      float energy;gl_PointSize=pointSize(uPixelRatio*(.9+aSeed*1.6)*36./max(dist,1.),dist,vSharp,energy);vColor*=energy;
      gl_Position=projectionMatrix*mv;}`});
  const o=new T.Points(g,material);o.name='dust';o.frustumCulled=false;return o;
}

// Flow: particles travelling along every thread segment; the scroll pulse turns them amber.
function createFlow(T,uniforms,from,to,patterns,routes){
  const segments=from.length/6,count=segments*FLOW_PER_SEGMENT;
  const attrs={aA:3,aAo:3,aAd:3,aB:3,aBo:3,aBd:3,aT:1,aRouteA:1,aRouteB:1};
  const arrays=Object.fromEntries(Object.entries(attrs).map(([k,n])=>[k,new Float32Array(count*n)]));
  for(let s=0;s<segments;s++)for(let j=0;j<FLOW_PER_SEGMENT;j++){
    const i=s*FLOW_PER_SEGMENT+j,a=s*2,b=s*2+1;
    for(let k=0;k<3;k++){
      arrays.aA[i*3+k]=from[a*3+k];arrays.aAo[i*3+k]=to[a*3+k];arrays.aAd[i*3+k]=patterns[a*3+k];
      arrays.aB[i*3+k]=from[b*3+k];arrays.aBo[i*3+k]=to[b*3+k];arrays.aBd[i*3+k]=patterns[b*3+k];
    }
    arrays.aT[i]=(j+hash(i,9)*.6)/FLOW_PER_SEGMENT;arrays.aRouteA[i]=routes[a];arrays.aRouteB[i]=routes[b];
  }
  const g=new T.BufferGeometry();
  // position mirrors aA so bounding/diagnostics stay meaningful; the shader reads endpoints.
  g.setAttribute('position',new T.BufferAttribute(arrays.aA,3));
  for(const [k,n] of Object.entries(attrs))if(k!=='aA')g.setAttribute(k,new T.BufferAttribute(arrays[k],n));
  const material=new T.ShaderMaterial({uniforms,...additive(T),fragmentShader:pointFragment,
    vertexShader:`uniform float uTime;uniform float uOrder;uniform float uData;uniform float uClusters;uniform float uFlow;uniform float uPulsePhase;uniform float uClarity;uniform vec2 uPointer;
    attribute vec3 aAo;attribute vec3 aAd;attribute vec3 aB;attribute vec3 aBo;attribute vec3 aBd;attribute float aT;attribute float aRouteA;attribute float aRouteB;
    varying vec3 vColor;varying float vSharp;${opticsChunk}${paletteChunk}
    void main(){vec3 a=mix(mix(position,aAo,uOrder),aAd,uData),b=mix(mix(aB,aBo,uOrder),aBd,uData);
      float t=fract(aT+uTime*.055*(.35+uFlow*1.4));vec3 p=mix(a,b,t);
      p.y+=.08*exp(-length(p.xz-vec2(uPointer.x*12.,-20.+uPointer.y*10.))*.25);
      vec4 mv=modelViewMatrix*vec4(p,1.);float dist=-mv.z;
      float route=mix(aRouteA,aRouteB,t),secondary=step(route,-.5);
      float event=route<0.?0.:exp(-pow((route-uPulsePhase)*22.,2.))*uFlow;
      float spine=1.-secondary;
      vec3 c=mix(BLUE_LIGHT*1.1,AMBER*1.4,spine*uOrder*.6);
      c=mix(c,AMBER_HOT*3.4,event);
      float presence=uClusters*(.15+uOrder*.6+uFlow*.35)*mix(1.,secondary>.5?.12:.7,uClarity);
      vColor=c*presence*(1.+event);
      float energy;gl_PointSize=pointSize(uPixelRatio*(1.6+spine*1.2)*30./max(dist,1.),dist,vSharp,energy);vColor*=energy;
      gl_Position=projectionMatrix*mv;}`});
  const o=new T.Points(g,material);o.name='threadFlow';o.frustumCulled=false;return o;
}
