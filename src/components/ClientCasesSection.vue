<template>
  <section id="clientes" class="py-16 sm:py-20" aria-labelledby="clientes-heading">
    <div class="section-shell">
      <div class="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div class="reveal">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Cliente y proyecto</p>
          <h2 id="clientes-heading" class="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            Tecnología aplicada a la operación real
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-vogel-muted sm:text-base">
            Mostramos el tipo de problema que estamos resolviendo y el alcance del sistema, sin convertir el caso en una lista de funcionalidades sueltas.
          </p>
        </div>

        <article class="reveal reveal-d1 overflow-hidden rounded-3xl border border-vogel-amber/30 bg-gradient-to-br from-vogel-navy via-vogel-deep to-vogel-blue/20 shadow-glow">
          <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
            <div>
              <div class="flex items-center gap-3">
                <span class="flex h-14 w-14 items-center justify-center rounded-2xl border border-vogel-amber/50 bg-vogel-amber/10 font-display text-2xl font-extrabold text-vogel-amber" aria-hidden="true">F</span>
                <div>
                  <p class="font-display text-2xl font-bold text-white">FEMAG</p>
                  <a
                    href="https://femag.com.ar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-vogel-blueLight transition hover:text-white"
                  >
                    femag.com.ar ↗
                  </a>
                </div>
              </div>
              <p class="mt-5 inline-flex rounded-full border border-vogel-blue/40 bg-vogel-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-vogel-blueLight">
                Sistema a medida en desarrollo
              </p>
            </div>

            <div>
              <h3 class="font-display text-2xl font-bold text-white sm:text-3xl">
                Gestión operativa para una fábrica de fécula de mandioca
              </h3>
              <p class="mt-4 text-sm leading-relaxed text-vogel-gray sm:text-base">
                Estamos desarrollando una aplicación de escritorio conectada a MySQL para ordenar clientes, productos, transporte, órdenes de carga, remitos, cuenta corriente, permisos y auditoría.
              </p>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div v-for="detail in details" :key="detail" class="flex items-start gap-3 rounded-2xl border border-vogel-gray/15 bg-white/[0.04] px-4 py-3 text-sm text-vogel-gray">
                  <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-vogel-amber" aria-hidden="true"></span>
                  <span>{{ detail }}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const details = [
  "Aplicación local para 5/6 puestos en red interna",
  "Dashboard central y menú operativo simple",
  "Órdenes de carga y remitos imprimibles",
  "Importación incremental desde MySQL y DBF",
];
</script>
