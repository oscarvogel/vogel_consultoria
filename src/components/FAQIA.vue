<template>
  <section class="py-18 sm:py-22" aria-labelledby="faq-ia-heading">
    <div class="section-shell">
      <h2 id="faq-ia-heading" class="reveal font-display text-3xl font-bold text-white sm:text-4xl">Objeciones frecuentes</h2>

      <div class="mt-9 grid gap-4 md:grid-cols-2">
        <article
          v-for="(faq, i) in faqs"
          :key="faq.question"
          class="reveal card-hover rounded-2xl p-5"
          :class="`reveal-d${(i % 2) + 1}`"
        >
          <h3 class="font-display text-base font-semibold text-white">{{ faq.question }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-vogel-muted">{{ faq.answer }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const faqs = [
  {
    question: "¿Necesito saber de tecnología?",
    answer: "No. Nosotros traducimos todo a lenguaje de negocio y te guiamos paso a paso.",
  },
  {
    question: "¿Tengo que cambiar mis sistemas?",
    answer: "En la mayoría de los casos no. Integramos la IA con lo que ya usás y mejoramos sobre esa base.",
  },
  {
    question: "¿Esto es caro?",
    answer: "Se puede empezar de forma gradual con proyectos acotados y retorno visible en poco tiempo.",
  },
  {
    question: "¿Puedo empezar con algo chico?",
    answer: "Sí. Recomendamos un primer caso de alto impacto y baja complejidad para validar resultados rápido.",
  },
];
</script>
