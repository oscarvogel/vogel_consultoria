import fs from "node:fs";
import assert from "node:assert/strict";
const source = fs.readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
const channels = Object.fromEntries([...source.matchAll(/--vogel-(\w+):\s*(\d+) (\d+) (\d+)/g)].map(([, key, ...values]) => [key, values.map(Number)]));
const luminance = color => color.map(c => c / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((sum, c, i) => sum + c * [.2126,.7152,.0722][i], 0);
const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
const rows=[];
for(const background of ["navy","deep","slate","raised","charcoal"]) for(const foreground of ["white","gray","muted","blueLight"]){
 const ratio=contrast(channels[foreground],channels[background]);assert(ratio>=4.5, foreground+" / "+background+" below 4.5");rows.push({foreground,background,ratio:Number(ratio.toFixed(2))});
}
for(const [foreground,background] of [["navy","amber"],["white","blue"],["white","bright"]]){
 const ratio=contrast(channels[foreground],channels[background]);assert(ratio>=4.5,foreground+" / "+background+" below 4.5");rows.push({foreground,background,ratio:Number(ratio.toFixed(2))});
}
fs.mkdirSync(new URL("../docs/verificaciones/",import.meta.url),{recursive:true});
// Evidence file only: on Windows an editor or antivirus can hold it open for a moment; that must not fail the check.
function writeEvidence(content){
 const target=new URL("../docs/verificaciones/contraste.json",import.meta.url);
 for(let attempt=1;attempt<=5;attempt++){
  try{fs.writeFileSync(target,content);return;}catch(error){
   if(attempt===5){console.warn("aviso: no se pudo escribir contraste.json ("+error.code+"); la verificación sí pasó");return;}
   Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,250);
  }
 }
}
writeEvidence(JSON.stringify({scope:"Tokens vigentes sobre superficies sólidas. No certifica contraste en cada frame del paisaje, imágenes ni fondos compuestos.",rows},null,2)+"\n");
console.log("ok - "+rows.length+" pares de tokens sobre superficies sólidas superan 4.5:1; paisaje y fondos compuestos fuera del cálculo estático");
