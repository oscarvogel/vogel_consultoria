import { clusterDefinitions, dataPosition } from './narrativeScenes.js';

// Immutable endpoints: GPU morphing uses these same positions for points and threads.
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
      colors.push(.46,.62,.76);
      if(i>0 && i%3===0) {
        for(const n of [base+i-1,base+i]) {
          threadFrom.push(...dispersed.slice(n*3,n*3+3));
          threadTo.push(...ordered.slice(n*3,n*3+3));
          threadColors.push(.46,.62,.76);
          threadPatterns.push(...patterns.slice(n*3,n*3+3));threadRoutes.push(-1);
        }
      }
    }
    if(group>0) {
      const previous=clusterDefinitions[group-1];
      // Incomplete relationships grow into a continuous spine during organization.
      threadFrom.push(...previous.scattered,...previous.scattered);
      threadTo.push(...previous.ordered,...c.ordered);
      threadColors.push(1,.74,.33,1,.74,.33);
      dataPosition(...previous.ordered,group-1,0,scratch);threadPatterns.push(scratch.x,scratch.y,scratch.z);
      dataPosition(...c.ordered,group,0,scratch);threadPatterns.push(scratch.x,scratch.y,scratch.z);
      threadRoutes.push((group-1)/3,group/3);
    }
  }
  const extension=phase03?`uniform float uData;uniform float uFlow;uniform float uClarity;uniform float uPulsePhase;
    attribute vec3 aData;attribute float aRoute;varying float vRoute;
    float pulse(float route){return route<0.?0.:exp(-pow((route-uPulsePhase)*22.,2.))*uFlow;}`:'';
  const motion=`${extension} uniform float uOrder;uniform float uClusters;uniform vec2 uPointer;
    attribute vec3 aOrdered;attribute vec3 aColor;varying vec3 vColor;varying float vFade;
    vec3 morph(){vec3 p=mix(position,aOrdered,uOrder);
      ${phase03?'p=mix(p,aData,uData);vRoute=aRoute;':''}
      p.y+=.08*exp(-length(p.xz-vec2(uPointer.x*12.,-20.+uPointer.y*10.))*.25);
      return p;}`;
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
  const pointMaterial=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
    vertexShader:`${motion} void main(){vec4 mv=modelViewMatrix*vec4(morph(),1.);
      vColor=mix(aColor,vec3(1.,.74,.33),uOrder*.38);vFade=uClusters;
      ${phase03?'vColor=mix(aColor,vec3(1.,.74,.33),uOrder*.38*(1.-uFlow)*(1.-uData*.65)*(1.-uClarity*.7));float event=pulse(aRoute);vColor=mix(vColor,vec3(1.,.74,.33),event);vFade*=1.+event*.45;':''}
      gl_Position=projectionMatrix*mv;gl_PointSize=clamp(96./max(1.,-mv.z),2.5,12.);}`,
    fragmentShader:`varying vec3 vColor;varying float vFade;void main(){float d=length(gl_PointCoord-.5)*2.;
      gl_FragColor=vec4(vColor,exp(-d*d*5.)*vFade*.8);}`});
  const lineMaterial=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
    vertexShader:`${motion} void main(){vec4 mv=modelViewMatrix*vec4(morph(),1.);
      vColor=mix(aColor,vec3(1.,.74,.33),uOrder*.45);vFade=uClusters*(.28+uOrder*.34);
      ${phase03?'vFade*=mix(1.,aRoute<0.?.12:.45,uClarity);':''}
      gl_Position=projectionMatrix*mv;}`,
    fragmentShader:phase03?`uniform float uFlow;uniform float uPulsePhase;varying float vRoute;varying vec3 vColor;varying float vFade;
      void main(){float event=vRoute<0.?0.:exp(-pow((vRoute-uPulsePhase)*22.,2.))*uFlow;
      vec3 resting=mix(vColor,vec3(.46,.62,.76),uFlow);
      gl_FragColor=vec4(mix(resting,vec3(1.,.74,.33),event),vFade+event*.35);}`:
      'varying vec3 vColor;varying float vFade;void main(){gl_FragColor=vec4(vColor,vFade);}'});
  const cloud=new T.Points(points,pointMaterial), threads=new T.LineSegments(lines,lineMaterial);
  // Morphs extend outside the original bound; avoid incorrect CPU frustum culling.
  cloud.frustumCulled=false;threads.frustumCulled=false;
  scene.add(cloud,threads);
  let extraGeometry,extraMaterial,extra;
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
    extraMaterial=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
      vertexShader:`attribute float aKind;attribute float aBranch;varying float vKind;varying float vBranch;
        void main(){vKind=aKind;vBranch=aBranch;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`uniform float uIntelligence;uniform float uSelectionPhase;uniform float uConvergence;uniform float uClusters;
        varying float vKind;varying float vBranch;
        void main(){vec3 blue=vec3(.46,.62,.76),amber=vec3(1.,.74,.33);float alpha;vec3 color=blue;
          if(vKind<.5){float selected=1.-step(.25,abs(vBranch-1.));float evaluation=smoothstep(0.,.3,uSelectionPhase);
            float selection=smoothstep(.35,.85,uSelectionPhase);alpha=uIntelligence*evaluation*mix(.42,mix(.06,.85,selected),selection);
            color=mix(blue,amber,selected*selection);}
          else{color=amber;alpha=uConvergence*(vKind<1.5?.55:vKind<2.5?.8:.09);}
          gl_FragColor=vec4(color,alpha*uClusters);}`});
    extra=new T.LineSegments(extraGeometry,extraMaterial);extra.frustumCulled=false;scene.add(extra);
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
      extraGeometry?.dispose();extraMaterial?.dispose();if(extra)scene.remove(extra);},
  };
}
