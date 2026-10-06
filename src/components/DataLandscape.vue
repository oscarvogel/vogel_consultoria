<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
const props = defineProps({ variant: { type: String, default: 'hero' } });
const host = ref(null);
let unregister, disposed = false;
onMounted(async () => {
 try { const { registerLandscape } = await import('../lib/dataLandscape.js');
 if (!disposed) unregister = registerLandscape(host.value, props.variant);
 } catch { /* Static landscape remains visible. */ }
});
onUnmounted(() => { disposed = true; unregister?.(); });
</script>
<template><div ref="host" class="data-landscape" :class="'data-landscape--'+variant" aria-hidden="true"><img class="landscape-poster" :src="'/landscape/data-terrain.webp'" alt="" width="1672" height="660" :loading="variant==='hero'?'eager':'lazy'" decoding="async"/></div></template>
