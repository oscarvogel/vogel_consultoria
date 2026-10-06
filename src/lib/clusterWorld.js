import { clusterDefinitions } from './narrativeScenes.js';

// Immutable endpoints: GPU morphing uses these same positions for points and threads.
export function createClusterWorld(T, scene, uniforms) {
  const dispersed=[], ordered=[], colors=[], threadFrom=[], threadTo=[], threadColors=[];
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
      colors.push(.46,.62,.76);
      if(i>0 && i%3===0) {
        for(const n of [base+i-1,base+i]) {
          threadFrom.push(...dispersed.slice(n*3,n*3+3));
          threadTo.push(...ordered.slice(n*3,n*3+3));
          threadColors.push(.46,.62,.76);
        }
      }
    }
    if(group>0) {
      const previous=clusterDefinitions[group-1];
      // Incomplete relationships grow into a continuous spine during organization.
      threadFrom.push(...previous.scattered,...previous.scattered);
      threadTo.push(...previous.ordered,...c.ordered);
      threadColors.push(1,.74,.33,1,.74,.33);
    }
  }
  const motion=`uniform float uOrder;uniform float uClusters;uniform vec2 uPointer;
    attribute vec3 aOrdered;attribute vec3 aColor;varying vec3 vColor;varying float vFade;
    vec3 morph(){vec3 p=mix(position,aOrdered,uOrder);
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
  const pointMaterial=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
    vertexShader:`${motion} void main(){vec4 mv=modelViewMatrix*vec4(morph(),1.);
      vColor=mix(aColor,vec3(1.,.74,.33),uOrder*.38);vFade=uClusters;
      gl_Position=projectionMatrix*mv;gl_PointSize=clamp(96./max(1.,-mv.z),2.5,12.);}`,
    fragmentShader:`varying vec3 vColor;varying float vFade;void main(){float d=length(gl_PointCoord-.5)*2.;
      gl_FragColor=vec4(vColor,exp(-d*d*5.)*vFade*.8);}`});
  const lineMaterial=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
    vertexShader:`${motion} void main(){vec4 mv=modelViewMatrix*vec4(morph(),1.);
      vColor=mix(aColor,vec3(1.,.74,.33),uOrder*.45);vFade=uClusters*(.28+uOrder*.34);
      gl_Position=projectionMatrix*mv;}`,
    fragmentShader:'varying vec3 vColor;varying float vFade;void main(){gl_FragColor=vec4(vColor,vFade);}'});
  const cloud=new T.Points(points,pointMaterial), threads=new T.LineSegments(lines,lineMaterial);
  // Morphs extend outside the original bound; avoid incorrect CPU frustum culling.
  cloud.frustumCulled=false;threads.frustumCulled=false;
  scene.add(cloud,threads);
  const newAnchor=new T.Vector3();
  return {
    anchor(index,out) {
      const c=clusterDefinitions[index], p=uniforms.uOrder.value;
      out.fromArray(c.scattered).lerp(newAnchor.fromArray(c.ordered),p);
      out.y+=.08*Math.exp(-Math.hypot(out.x-uniforms.uPointer.value.x*12,out.z+20-uniforms.uPointer.value.y*10)*.25);
      return out;
    },
    dispose(){points.dispose();lines.dispose();pointMaterial.dispose();lineMaterial.dispose();scene.remove(cloud,threads);},
  };
}
