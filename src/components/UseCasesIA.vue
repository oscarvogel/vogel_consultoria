<template>
  <section class="py-18 sm:py-22" aria-labelledby="casos-ia-heading">
    <div class="section-shell">
      <div class="use-cases-heading">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-vogel-amber">Ejemplos para evaluar</p>
          <h2 id="casos-ia-heading" class="reveal mt-3 max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl">Tareas donde una asistencia puede ser útil.</h2>
        </div>
        <p class="max-w-xl text-sm leading-6 text-vogel-muted">Cada caso requiere revisar fuentes, permisos y el nivel de validación adecuado.</p>
      </div>
      <ol class="use-case-list mt-8">
        <li v-for="(item, index) in useCases" :key="item" class="reveal">
          <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <p>{{ item }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
const useCases = [
  "Consultar ventas con preguntas en lenguaje natural.",
  "Resumir o comparar archivos Excel y PDF.",
  "Preparar borradores para preguntas frecuentes de clientes.",
  "Revisar reportes y señalar variaciones para validar.",
  "Consultar procedimientos internos desde un asistente.",
];
</script>

<style scoped>
.use-cases-heading{display:flex;justify-content:space-between;align-items:end;gap:36px}
.use-case-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:64px;list-style:none;padding:0}
.use-case-list li{display:grid;grid-template-columns:44px minmax(0,1fr);gap:12px;padding:22px 0;border-top:1px solid var(--color-border)}
.use-case-list li>span{color:var(--color-action);font-size:12px;font-variant-numeric:tabular-nums}
.use-case-list p{max-width:48ch;color:var(--color-text);font-size:16px;line-height:1.6}
@media(max-width:767px){.use-cases-heading{display:block}.use-cases-heading>p{margin-top:16px}.use-case-list{grid-template-columns:1fr;column-gap:0}.use-case-list li{padding:18px 0}}
</style>
