<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import logoVogel from '../../assets/brand/vogel-simbolo.svg';

// Cortina breve de marca. Solo en la primera visita de la sesión y nunca con movimiento reducido.
let raf = 0, timer = 0;
onBeforeUnmount(()=>{cancelAnimationFrame(raf);clearTimeout(timer);});
const visible = ref(false);
const count = ref(0);
const leaving = ref(false);

onMounted(() => {
  let seen = false;
  try { seen = sessionStorage.getItem('vogel-intro') === '1'; } catch { /* sin storage: se muestra igual */ }
  if (seen || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  visible.value = true;
  try { sessionStorage.setItem('vogel-intro', '1'); } catch { /* ignorado */ }
  const start = performance.now();
  const duration = 1100;
  const frame = (now) => {
    const t = Math.min(1, (now - start) / duration);
    count.value = Math.round(100 * (1 - (1 - t) ** 3));
    if (t < 1) raf = requestAnimationFrame(frame);
    else { leaving.value = true; timer = window.setTimeout(() => { visible.value = false; }, 520); }
  };
  raf = requestAnimationFrame(frame);
});
</script>
<template>
  <div v-if="visible" class="preloader" :class="{ 'is-leaving': leaving }" aria-hidden="true">
    <img :src="logoVogel" alt="" width="54" height="44" />
    <span>{{ String(count).padStart(3, '0') }}</span>
  </div>
</template>
<style scoped>
.preloader{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;background:rgb(var(--vogel-navy));transition:opacity 520ms ease,transform 520ms var(--ease-out)}
.preloader span{font-family:var(--font-display);font-stretch:var(--display-stretch);font-weight:var(--display-weight);font-size:clamp(3rem,10vw,7rem);letter-spacing:-.04em;color:var(--color-heading);font-variant-numeric:tabular-nums}
.preloader.is-leaving{opacity:0;transform:translateY(-3%);pointer-events:none}
</style>
