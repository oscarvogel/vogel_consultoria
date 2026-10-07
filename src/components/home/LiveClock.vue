<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// Hora de Argentina: el sitio se presenta desde Misiones. Se calcula en el cliente para no congelar la hora en el HTML.
const time = ref('');
const format = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' });
let timer = 0;
const tick = () => { time.value = format.format(new Date()); };
onMounted(() => { tick(); timer = window.setInterval(tick, 1000); });
onUnmounted(() => window.clearInterval(timer));
</script>
<template>
  <p class="live-clock" aria-hidden="true"><span>AR</span><time>{{ time }}</time><i aria-hidden="true"></i></p>
</template>
<style scoped>
.live-clock{display:flex;align-items:center;gap:10px;margin:0;font-size:12px;letter-spacing:.04em;color:var(--color-text);font-variant-numeric:tabular-nums}
.live-clock i{width:7px;height:7px;border-radius:50%;background:rgb(var(--vogel-amber));animation:clock-pulse 2s ease-in-out infinite}
@keyframes clock-pulse{50%{opacity:.25}}
</style>
