<script setup>
const props = defineProps({ variant: { type: String, default: 'flow' } });
const phase = ({ flow:0, evidence:1.2, network:2.4, method:.6, trajectory:3.2, editorial:4.4 })[props.variant] || 0;
const waves = Array.from({length:3}, (_,row) => Array.from({length:61},(_,index) => ({
 x:index*24, y:48+row*19+Math.sin(index*.14+phase+row*.2)*18+Math.sin(index*.31+phase)*5,
 bright:(index+row*7)%13===0,
})));
const nodes = [
 { x: 34, y: 116 }, { x: 70, y: 302 }, { x: 42, y: 504 },
 { x: 94, y: 682 }, { x: 52, y: 868 },
];
</script>
<template>
 <div class="landscape-traces" :class="'landscape-traces--'+variant" aria-hidden="true">
  <svg v-for="side in ['left','right']" :key="side" :class="'landscape-trace landscape-trace--'+side" viewBox="0 0 160 1000" preserveAspectRatio="none" fill="none" focusable="false">
   <path class="trace-route" d="M34 0V116C34 206 70 214 70 302S42 406 42 504S94 582 94 682S52 778 52 868V1000"/>
   <path class="trace-branch" d="M0 222C26 222 34 194 34 164M0 438C24 438 42 468 42 504M0 766C28 766 52 826 52 868M70 302C90 302 116 338 160 338M94 682C122 682 128 632 160 632"/>
   <g v-for="(node,index) in nodes" :key="index" :transform="`translate(${node.x} ${node.y})`">
    <circle class="trace-node-halo" r="8"/><circle class="trace-node" :r="index===2?2.5:1.8"/>
   </g>
  </svg>
  <svg class="trace-wave" viewBox="0 0 1440 140" preserveAspectRatio="none" fill="none" focusable="false">
   <g v-for="(wave,row) in waves" :key="row">
    <path :class="row===1?'trace-wave-route':'trace-wave-branch'" :d="wave.map((p,index)=>`${index?'L':'M'}${p.x} ${p.y}`).join(' ')"/>
    <circle v-for="(point,index) in wave" :key="index" :cx="point.x" :cy="point.y" :r="point.bright?2:1" :class="point.bright?'trace-wave-node-bright':'trace-wave-node'"/>
   </g>
  </svg>
 </div>
</template>
