<template>
  <section id="casos" class="py-20 sm:py-24" aria-labelledby="mini-cases-heading">
    <div class="section-shell">
      <div class="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div class="reveal">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Mini-casos</p>
          <h2 id="mini-cases-heading" class="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            Problemas reales, soluciones aplicadas con criterio
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-vogel-muted sm:text-base">
            Compartimos casos anónimos cuando no corresponde publicar nombres, pero sí el tipo de problema,
            la solución y el resultado operativo buscado.
          </p>
        </div>

        <div class="grid gap-5">
          <article
            v-for="(miniCase, index) in miniCases"
            :key="miniCase.rubro"
            class="reveal rounded-3xl border border-vogel-gray/20 bg-white/[0.04] p-5 shadow-glow sm:p-7"
            :class="`reveal-d${index + 1}`"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-vogel-blueLight">Caso anonimo</p>
                <h3 class="mt-2 font-display text-2xl font-bold text-white">{{ miniCase.rubro }}</h3>
              </div>
              <span class="w-fit rounded-full border border-vogel-amber/35 bg-vogel-amber/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-vogel-amber">
                Datos de produccion
              </span>
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-3">
              <div class="rounded-2xl border border-vogel-gray/15 bg-vogel-navy/45 p-4">
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-vogel-amber">Problema</p>
                <p class="mt-3 text-sm leading-relaxed text-vogel-gray">{{ miniCase.problema }}</p>
              </div>
              <div class="rounded-2xl border border-vogel-gray/15 bg-vogel-navy/45 p-4">
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-vogel-amber">Solucion</p>
                <p class="mt-3 text-sm leading-relaxed text-vogel-gray">{{ miniCase.solucion }}</p>
              </div>
              <div class="rounded-2xl border border-vogel-gray/15 bg-vogel-navy/45 p-4">
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-vogel-amber">Resultado</p>
                <p class="mt-3 text-sm leading-relaxed text-vogel-gray">{{ miniCase.resultado }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const miniCases = [
  {
    rubro: "Forestal",
    problema: "falta de datos de produccion para seguir el trabajo operativo con informacion confiable.",
    solucion: "sistema de recoleccion de datos en campo para registrar informacion desde el lugar donde ocurre la operacion.",
    resultado: "dashboards interactivos para visualizar produccion, comparar informacion y facilitar decisiones de gestion.",
  },
];
</script>
