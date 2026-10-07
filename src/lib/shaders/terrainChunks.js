// Shared GLSL for every world layer. Colors are linear HDR; the post composite tone-maps.
export const heightChunk=`float heightAt(vec2 p){
 float r=sin(p.x*.36+p.y*.12)*.46+sin(p.y*.31-p.x*.09)*.44;
 r+=sin(p.x*.56-p.y*.18)*sin(p.y*.24)*.23;
 r+=exp(-pow((p.x+2.)*.18,2.)-pow((p.y+8.)*.12,2.))*1.1;
 return r+sin(p.y*.18+p.x*.12+uTime)*.13;
}`;

// Optics shared by terrain, pillars and particle layers: circle of confusion in device pixels.
export const opticsChunk=`uniform float uFocus;uniform float uAperture;uniform float uPixelRatio;uniform float uMaxPoint;uniform float uViewHeight;uniform float uFog;
float cocPx(float d){float near=uAperture*max(0.,uFocus-d)/max(d,.5);float far=uAperture*max(0.,d-uFocus)/max(d,.5)*.1;return (near+far)*uViewHeight*.032;}
float pointSize(float base,float d,out float sharp,out float energy){
 float coc=cocPx(d);float size=clamp(base+coc,1.,uMaxPoint);
 sharp=clamp(1.-coc/max(base*1.5,1.),0.,1.);
 // Larger discs spread the same light: keep perceived energy roughly constant.
 energy=clamp(pow((base+1.)/(size+1.),1.35),.025,1.);return size;}`;

export const pointFragment=`varying vec3 vColor;varying float vSharp;
void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;
 float gauss=exp(-d*d*6.);float disc=smoothstep(1.,.78,d)*(.72+.28*smoothstep(.45,.92,d));
 vec3 c=vColor*mix(disc,gauss,vSharp);if(c.r+c.g+c.b<.003)discard;gl_FragColor=vec4(c,1.);}`;

export const morphChunk=narrative=>narrative?`uniform float uDispersion;uniform float uOrder;uniform vec2 uPointer;
vec3 terrainMorph(vec3 p){vec3 ordered=vec3(p.x,p.y*.18,p.z);
 p.x+=sin(p.z*.65+p.x*.8)*uDispersion*.48;
 p.y+=sin(p.x*1.1-p.z*.3)*uDispersion*.38;
 p=mix(p,ordered,uOrder);
 p.y+=.08*exp(-length(p.xz-vec2(uPointer.x*12.,-20.+uPointer.y*10.))*.25);
 return p;}`:'uniform float uOrder;vec3 terrainMorph(vec3 p){return p;}';

// Brand palette in linear space: Vogel amber #FFBC54 and the institutional blues.
// Deeper than the sRGB swatch: ACES lifts and desaturates highlights back towards #FFBC54.
export const paletteChunk=`const vec3 AMBER=vec3(1.,.36,.035);const vec3 AMBER_HOT=vec3(1.,.5,.12);
const vec3 BLUE=vec3(.06,.15,.28);const vec3 BLUE_LIGHT=vec3(.21,.36,.52);`;
