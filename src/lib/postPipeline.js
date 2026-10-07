// HDR scene target → dual-filter bloom → filmic composite. One fullscreen triangle,
// no EffectComposer. Scene shaders write linear HDR; only the composite writes sRGB.
const vertexShader=`varying vec2 vUv;void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,0.,1.);}`;
const tap13=`vec3 s(vec2 o){return texture2D(tSrc,vUv+o*uTexel).rgb;}
vec3 down13(){vec3 a=s(vec2(-2.,2.)),b=s(vec2(0.,2.)),c=s(vec2(2.,2.)),d=s(vec2(-2.,0.)),e=s(vec2(0.)),f=s(vec2(2.,0.)),
 g=s(vec2(-2.,-2.)),h=s(vec2(0.,-2.)),i=s(vec2(2.,-2.)),j=s(vec2(-1.,1.)),k=s(vec2(1.,1.)),l=s(vec2(-1.,-1.)),m=s(vec2(1.,-1.));
 return e*.125+(a+c+g+i)*.03125+(b+d+f+h)*.0625+(j+k+l+m)*.125;}`;
const prefilterShader=`uniform sampler2D tSrc;uniform vec2 uTexel;uniform float uThreshold;uniform float uKnee;varying vec2 vUv;${tap13}
void main(){vec3 c=down13();float br=max(c.r,max(c.g,c.b));
 float soft=clamp(br-uThreshold+uKnee,0.,2.*uKnee);soft=soft*soft/(4.*uKnee+1e-4);
 // Clamp fireflies so isolated HDR sparks bloom softly instead of flickering.
 c*=max(soft,br-uThreshold)/max(br,1e-4);gl_FragColor=vec4(min(c,vec3(24.)),1.);}`;
const downShader=`uniform sampler2D tSrc;uniform vec2 uTexel;varying vec2 vUv;${tap13}void main(){gl_FragColor=vec4(down13(),1.);}`;
const upShader=`uniform sampler2D tSrc;uniform sampler2D tBase;uniform vec2 uTexel;uniform float uRadius;varying vec2 vUv;
vec3 s(vec2 o){return texture2D(tSrc,vUv+o*uTexel*uRadius).rgb;}
void main(){vec3 t=s(vec2(0.))*4.+(s(vec2(-1.,0.))+s(vec2(1.,0.))+s(vec2(0.,-1.))+s(vec2(0.,1.)))*2.
 +s(vec2(-1.,-1.))+s(vec2(1.,-1.))+s(vec2(-1.,1.))+s(vec2(1.,1.));
 gl_FragColor=vec4(texture2D(tBase,vUv).rgb+t/16.,1.);}`;
const compositeShader=`uniform sampler2D tScene;uniform sampler2D tBloom;uniform vec2 uResolution;
uniform float uBloom;uniform float uExposure;uniform float uAberration;uniform float uGrain;uniform float uVignette;uniform float uTime;uniform float uFade;
uniform vec3 uBase;uniform vec3 uHaze;uniform vec2 uHazeCenter;varying vec2 vUv;
// Stephen Hill's fitted ACES, applied in linear space.
vec3 aces(vec3 c){const mat3 i=mat3(.59719,.07600,.02840,.35458,.90834,.13383,.04823,.01566,.83777);
 const mat3 o=mat3(1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602);
 c=i*c;vec3 a=c*(c+.0245786)-.000090537;vec3 b=c*(.983729*c+.4329510)+.238081;return clamp(o*(a/b),0.,1.);}
vec3 srgb(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(vec3(.0031308),c));}
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
void main(){vec2 c=vUv-.5;float aspect=uResolution.x/uResolution.y;float r2=dot(c*vec2(aspect,1.),c*vec2(aspect,1.));
 // Radial chromatic offset in pixels (≈uAberration at the corners, zero at the center).
 vec2 shift=c/max(length(c),1e-4)*r2*uAberration/uResolution;
 vec3 hdr=vec3(texture2D(tScene,vUv+shift).r,texture2D(tScene,vUv).g,texture2D(tScene,vUv-shift).b);
 hdr+=texture2D(tBloom,vUv).rgb*uBloom;
 vec3 color=srgb(aces(hdr*uExposure))*uFade;
 // Atmospheric navy haze lives in the composite so canvas and page share one ground.
 vec2 hp=(vUv-uHazeCenter)*vec2(aspect*.55,1.);vec3 ground=uBase+uHaze*exp(-dot(hp,hp)*5.5)*uFade;
 color=ground+color*(1.-ground);
 float v=smoothstep(.28,1.05,length(c*vec2(aspect*.82,1.)));color=mix(color,uBase,v*uVignette);
 color+=(hash(gl_FragCoord.xy+floor(uTime*24.)*vec2(37.,17.))-.5)*uGrain;
 gl_FragColor=vec4(color,1.);}`;

export const POST_LEVELS=5;
/** Draw calls and textures added on top of the scene; tests read these. */
export const POST_BUDGET=Object.freeze({calls:POST_LEVELS*2,textures:POST_LEVELS*2,geometries:1});

export function createPostPipeline(T, renderer, { levels = POST_LEVELS } = {}) {
  const triangle=new T.BufferGeometry();
  triangle.setAttribute('position',new T.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));
  const quad=new T.Mesh(triangle);quad.frustumCulled=false;
  const quadScene=new T.Scene();quadScene.add(quad);
  const quadCamera=new T.OrthographicCamera(-1,1,1,-1,0,1);
  const gl=renderer.getContext?.();
  // Float color buffers are required to keep HDR highlights for bloom; fall back to 8-bit.
  const float=!!(renderer.extensions?.has?.('EXT_color_buffer_float')||renderer.extensions?.has?.('EXT_color_buffer_half_float'));
  const type=float?T.HalfFloatType:T.UnsignedByteType;
  const target=(samples=0)=>new T.WebGLRenderTarget(1,1,{type,samples,depthBuffer:samples>0||false,minFilter:T.LinearFilter,magFilter:T.LinearFilter,generateMipmaps:false});
  let samples=0, sceneTarget=target(0);
  const down=[...Array(levels)].map(()=>target()), up=[...Array(levels-1)].map(()=>target());
  const material=(fragmentShader,uniforms)=>new T.ShaderMaterial({vertexShader,fragmentShader,uniforms,depthTest:false,depthWrite:false,blending:T.NoBlending,toneMapped:false});
  const prefilter=material(prefilterShader,{tSrc:{value:null},uTexel:{value:new T.Vector2()},uThreshold:{value:float?1:.72},uKnee:{value:.5}});
  const downs=down.slice(1).map(()=>material(downShader,{tSrc:{value:null},uTexel:{value:new T.Vector2()}}));
  const ups=up.map(()=>material(upShader,{tSrc:{value:null},tBase:{value:null},uTexel:{value:new T.Vector2()},uRadius:{value:1}}));
  const uniforms={tScene:{value:null},tBloom:{value:null},uResolution:{value:new T.Vector2(1,1)},
    uBloom:{value:.5},uExposure:{value:1},uAberration:{value:.9},uGrain:{value:1.4/255},uVignette:{value:.55},uTime:{value:0},uFade:{value:1},
    uBase:{value:new T.Vector3(5/255,9/255,15/255)},uHaze:{value:new T.Vector3(.018,.034,.052)},uHazeCenter:{value:new T.Vector2(.5,.36)}};
  const composite=material(compositeShader,uniforms);
  let width=1,height=1,bloomScale=.5,sceneCalls=0;
  function pass(mat,out){quad.material=mat;renderer.setRenderTarget(out);renderer.render(quadScene,quadCamera);}
  return {
    uniforms, float, get sceneCalls(){return sceneCalls;}, get samples(){return samples;},
    configure({ msaa = 0, bloomScale: scale = .5 } = {}) {
      bloomScale=scale;
      const wanted=float&&gl&&'getParameter' in gl?Math.min(msaa,gl.getParameter(gl.MAX_SAMPLES)||0):0;
      if(wanted!==samples){samples=wanted;sceneTarget.dispose();sceneTarget=target(samples);sceneTarget.setSize(width,height);}
      this.setSize(width,height);
    },
    setSize(w,h) {
      width=Math.max(1,Math.round(w));height=Math.max(1,Math.round(h));
      sceneTarget.setSize(width,height);uniforms.uResolution.value.set(width,height);
      let bw=Math.max(1,Math.round(width*bloomScale)),bh=Math.max(1,Math.round(height*bloomScale));
      for(let i=0;i<levels;i++){down[i].setSize(bw,bh);if(i<levels-1)up[i].setSize(bw,bh);bw=Math.max(1,bw>>1);bh=Math.max(1,bh>>1);}
    },
    render(scene,camera) {
      renderer.setRenderTarget(sceneTarget);renderer.clear();renderer.render(scene,camera);
      sceneCalls=renderer.info.render.calls;
      prefilter.uniforms.tSrc.value=sceneTarget.texture;prefilter.uniforms.uTexel.value.set(1/width,1/height);pass(prefilter,down[0]);
      for(let i=1;i<levels;i++){const m=downs[i-1];m.uniforms.tSrc.value=down[i-1].texture;m.uniforms.uTexel.value.set(1/down[i-1].width,1/down[i-1].height);pass(m,down[i]);}
      for(let i=levels-2;i>=0;i--){const m=ups[i],src=i===levels-2?down[i+1]:up[i+1];
        m.uniforms.tSrc.value=src.texture;m.uniforms.tBase.value=down[i].texture;m.uniforms.uTexel.value.set(1/src.width,1/src.height);pass(m,up[i]);}
      uniforms.tScene.value=sceneTarget.texture;uniforms.tBloom.value=up[0].texture;
      pass(composite,null);
    },
    dispose() {
      triangle.dispose();sceneTarget.dispose();[...down,...up].forEach(t=>t.dispose());
      [prefilter,...downs,...ups,composite].forEach(m=>m.dispose());
    },
  };
}
