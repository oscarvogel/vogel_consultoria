<script setup>
import { nextTick, onMounted, onUnmounted, shallowRef } from "vue";

const emit = defineEmits(["close", "showProgram"]);

const EVENT_EXPIRES_AT = new Date("2026-05-28T00:00:00-03:00");
const isVisible = shallowRef(false);
const modalRef = shallowRef(null);
let previousActiveElement = null;

function shouldShowModal() {
  return new Date() < EVENT_EXPIRES_AT;
}

function restoreFocus() {
  if (previousActiveElement instanceof HTMLElement) {
    previousActiveElement.focus({ preventScroll: true });
  }
}

function closeModal() {
  if (!isVisible.value) return;
  isVisible.value = false;
  emit("close");
  nextTick(restoreFocus);
}

function showProgram() {
  if (!isVisible.value) return;
  isVisible.value = false;
  emit("showProgram");
  nextTick(restoreFocus);
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

onMounted(async () => {
  if (!shouldShowModal()) return;

  previousActiveElement = document.activeElement;
  isVisible.value = true;
  document.addEventListener("keydown", handleKeydown);
  await nextTick();
  modalRef.value?.focus({ preventScroll: true });
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="event-modal">
      <div
        v-if="isVisible"
        ref="modalRef"
        class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto overflow-x-hidden bg-vogel-navy/85 px-4 py-5 backdrop-blur-md sm:items-center sm:py-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
        tabindex="-1"
      >
        <button
          type="button"
          class="fixed inset-0 cursor-default"
          aria-label="Cerrar aviso de charla"
          @click="closeModal"
        ></button>

        <article class="relative my-auto w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.5rem] border border-vogel-amber/35 bg-vogel-deep shadow-glow-lg sm:max-w-3xl sm:rounded-[2rem]">
          <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(242,169,0,0.18),transparent_34%),radial-gradient(circle_at_82%_0%,rgba(30,95,168,0.42),transparent_40%),linear-gradient(135deg,#0f2a44,#081d33)]"></div>
          <button
            type="button"
            class="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-vogel-gray transition hover:border-vogel-amber hover:text-vogel-amber"
            aria-label="Cerrar"
            @click="closeModal"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div class="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div class="relative hidden min-h-[420px] border-r border-white/10 bg-vogel-navy/50 p-8 lg:block">
              <div class="absolute inset-x-8 top-8 grid gap-3 rounded-3xl border border-white/10 bg-white p-5">
                <img src="/logo-cpce.png" alt="CPCE Misiones" class="mx-auto h-14 w-auto object-contain" />
                <div class="h-px bg-slate-200"></div>
                <img src="/logo-vogel.png" alt="Vogel Consultoría" class="mx-auto h-16 w-auto object-contain" />
              </div>
              <div class="absolute inset-x-8 bottom-8 rounded-3xl border border-vogel-blue/35 bg-vogel-blue/15 p-6">
                <p class="text-sm font-semibold tracking-[0.12em] text-vogel-amber">27/05/2026 · 18:00 - 20:00</p>
                <p class="mt-3 font-display text-4xl font-bold leading-none text-white">IA</p>
                <p class="mt-2 text-sm leading-relaxed text-vogel-gray">
                  Modalidad híbrida para contadores matriculados en el CPCEM.
                </p>
              </div>
            </div>

            <div class="p-5 sm:p-8 lg:p-10">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-vogel-amber">
                Charla empresarial 2026
              </p>
              <h2 id="event-modal-title" class="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
                IA para Profesionales en Ciencias Económicas
              </h2>
              <p id="event-modal-description" class="mt-4 text-sm leading-relaxed text-vogel-gray sm:text-base">
                Un encuentro práctico para contadores matriculados en el CPCEM: NotebookLM, Codex, Excel/Copilot y criterios de uso responsable en estudios contables.
              </p>

              <dl class="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055]">
                <div class="grid gap-1 border-b border-white/10 px-5 py-4 sm:grid-cols-[7.25rem_1fr] sm:items-center">
                  <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-vogel-muted">Fecha</dt>
                  <dd class="text-base font-semibold leading-snug text-white sm:text-lg">Miércoles 27/05/2026</dd>
                </div>
                <div class="grid gap-1 border-b border-white/10 px-5 py-4 sm:grid-cols-[7.25rem_1fr] sm:items-center">
                  <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-vogel-muted">Horario</dt>
                  <dd class="text-base font-semibold leading-snug text-white sm:text-lg">18:00 - 20:00 hs</dd>
                </div>
                <div class="grid gap-1 px-5 py-4 sm:grid-cols-[7.25rem_1fr] sm:items-center">
                  <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-vogel-muted">Modalidad</dt>
                  <dd class="text-base font-semibold leading-snug text-white sm:text-lg">Híbrida <span class="text-base font-medium text-vogel-gray/80">(presencial y virtual)</span></dd>
                </div>
              </dl>

              <div class="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full border border-vogel-amber bg-vogel-amber px-5 py-3 text-sm font-semibold text-vogel-deep transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vogel-amber focus-visible:ring-offset-2 focus-visible:ring-offset-vogel-deep"
                  data-analytics-cta="event_modal_show_program"
                  data-analytics-funnel="lead_journey"
                  data-analytics-step="home"
                  @click="showProgram"
                >
                  Ver temario
                </button>
                <a
                  href="/estado-whatsapp-charla-ia-2026.png"
                  class="inline-flex items-center justify-center rounded-full border border-vogel-gray/35 px-5 py-3 text-center text-sm font-semibold text-vogel-gray transition hover:border-vogel-amber hover:text-vogel-amber"
                  data-analytics-cta="event_modal_state_image"
                  data-analytics-funnel="lead_journey"
                  data-analytics-step="home"
                >
                  Ver imagen para estados
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.event-modal-enter-active,
.event-modal-leave-active {
  transition: opacity 180ms ease;
}

.event-modal-enter-from,
.event-modal-leave-to {
  opacity: 0;
}
</style>
