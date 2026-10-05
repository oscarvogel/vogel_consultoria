<script setup>
import {ref,onMounted,onUnmounted} from 'vue';
defineProps({label:{type:String,required:true}});
const expanded=ref(false);
let media;
function sync(){expanded.value=media.matches;}
onMounted(()=>{media=window.matchMedia('(min-width:640px)');sync();media.addEventListener('change',sync);});
onUnmounted(()=>media?.removeEventListener('change',sync));
</script>
<template>
 <details class="responsive-details" :open="expanded" @toggle="expanded=$event.target.open">
  <summary>{{ label }}</summary>
  <div class="details-content"><slot /></div>
 </details>
</template>
<style scoped>
summary{cursor:pointer;min-height:48px;display:list-item;padding:14px 0;color:var(--color-link);font-weight:600;touch-action:manipulation}
.details-content{padding-top:16px}
@media(min-width:640px){summary{display:none}.details-content{padding-top:0}}
</style>
