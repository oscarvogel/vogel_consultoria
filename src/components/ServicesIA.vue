<template>
  <section class="py-18 sm:py-22" aria-labelledby="servicios-ia-heading">
    <div class="section-shell">
      <div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-vogel-amber">Capacidades</p>
          <h2 id="servicios-ia-heading" class="reveal mt-3 max-w-xl font-display text-3xl font-bold text-white sm:text-4xl">Formas de incorporar IA al trabajo.</h2>
        </div>
        <ul class="ia-service-list">
          <li v-for="service in services" :key="service.title" class="reveal">
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </li>
      </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  { title: "Consultoría y priorización", description: "Identificar tareas posibles y ordenar los casos según sus fuentes, permisos y necesidad de revisión." },
  { title: "Asistentes internos", description: "Organizar consultas y procedimientos del equipo en herramientas con alcance definido." },
  { title: "Automatización de procesos", description: "Incorporar asistencia en pasos acotados, con revisión humana donde corresponda." },
  { title: "Integración con sistemas", description: "Evaluar cómo conectar las herramientas con la información y los sistemas disponibles." },
  { title: "Capacitación práctica", description: "Talleres para que cada equipo aplique criterios compartidos a tareas reales." },
];
</script>

<style scoped>
.ia-service-list{margin:0;padding:0;list-style:none;border-top:1px solid var(--color-border)}
.ia-service-list li{padding:18px 0;border-bottom:1px solid var(--color-border)}
.ia-service-list h3{font-family:var(--font-display);font-size:18px;font-weight:550;color:var(--color-text)}
.ia-service-list p{max-width:68ch;margin-top:6px;font-size:14px;line-height:1.6;color:var(--color-muted)}
</style>
