import { phase03Config, samplePhase03 } from './narrativeScenes.js';

const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export const evidenceConfig=Object.freeze({
  start:7.2,portalEnd:7.9,height:10.8,caseHeight:3.6,
  steps:Object.freeze([{start:7.9,end:8.8},{start:8.8,end:9.7},{start:9.7,end:10.8}].map(Object.freeze)),
  camera:Object.freeze({id:'evidence',position:[4,3,-38],target:[4,3,-48],fov:45}),
});
/** Shared by the contour shader and HTML projection; TL, TR, BR, BL. */
export function evidenceCorner(index,progress,out,aspect=.5){
  const x=index===0||index===3?-1:1,y=index<2?1:-1;
  return out.set(4+x*(4+(3*aspect-4)*progress),3+y*(2+(3-2)*progress),-48);
}
/** No clock: every visual state is reconstructed from document offset. */
export function sampleEvidence(controller,offset,out=controller.getState()){
  offset=Number.isFinite(offset)?offset:0;
  samplePhase03(controller,offset,out);
  out.portal=smooth((offset-7.2)/.7);
  out.frame=smooth((offset-7.2)/.4);
  out.dock=smooth((offset-7.45)/.45);
  out.imageOpacity=smooth((offset-7.3)/.4);
  out.canvasOpacity=1-smooth((offset-7.45)/.45);
  out.evidenceStep=offset<8.8?0:offset<9.7?1:2;
  out.stepBlend=offset<8.8?smooth((offset-8.6)/.2):offset<9.7?smooth((offset-9.5)/.2):0;
  // The spatial indicator is a narrative device: it must be fully gone before the editorial half begins.
  out.evidenceExit=smooth((offset-10.2)/.3);
  if(offset>=7.2){out.chapter='evidence';out.chapterIndex=7;out.localProgress=clamp((offset-7.2)/3.6);}
  return out;
}

/** CSS homography mapping a local rectangle to four screen points. Scratch is caller-owned. */
export function portalMatrix(corners,width,height,out,scratch){
  scratch.fill(0);
  for(let i=0;i<4;i++){
    const x=i===0||i===3?0:width,y=i<2?0:height,X=corners[i*2],Y=corners[i*2+1],a=i*18,b=a+9;
    scratch[a]=x;scratch[a+1]=y;scratch[a+2]=1;scratch[a+6]=-X*x;scratch[a+7]=-X*y;scratch[a+8]=X;
    scratch[b+3]=x;scratch[b+4]=y;scratch[b+5]=1;scratch[b+6]=-Y*x;scratch[b+7]=-Y*y;scratch[b+8]=Y;
  }
  for(let col=0;col<8;col++){
    let pivot=col;for(let r=col+1;r<8;r++)if(Math.abs(scratch[r*9+col])>Math.abs(scratch[pivot*9+col]))pivot=r;
    for(let j=col;j<9;j++){const v=scratch[col*9+j];scratch[col*9+j]=scratch[pivot*9+j];scratch[pivot*9+j]=v;}
    const divisor=scratch[col*9+col];if(Math.abs(divisor)<1e-10)return false;
    for(let j=col;j<9;j++)scratch[col*9+j]/=divisor;
    for(let r=0;r<8;r++)if(r!==col){const f=scratch[r*9+col];for(let j=col;j<9;j++)scratch[r*9+j]-=f*scratch[col*9+j];}
  }
  out.fill(0);out[0]=scratch[8];out[4]=scratch[17];out[12]=scratch[26];
  out[1]=scratch[35];out[5]=scratch[44];out[13]=scratch[53];out[3]=scratch[62];out[7]=scratch[71];out[10]=out[15]=1;
  return true;
}
