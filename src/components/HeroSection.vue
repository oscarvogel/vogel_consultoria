<script setup>
import ActionButton from "./ActionButton.vue";
import StoryArtifact from "./StoryArtifact.vue";
</script>

<template>
  <section
    data-narrative-hero="160"
    data-chapter="neutral"
    id="inicio"
    class="hero-section"
    data-analytics-view="home_entry"
    data-analytics-funnel="lead_journey"
    data-analytics-step="home"
    aria-labelledby="hero-title"
  >
    <div class="hero-shell section-shell" data-hero-stage>
      <div class="hero-connections" aria-hidden="true">
        <div class="hero-scene"><StoryArtifact mode="order" /></div>
        <div class="hero-scene"><StoryArtifact mode="connect" /></div>
        <div class="hero-scene"><StoryArtifact mode="resolve" /></div>
      </div>
      <div class="hero-copy">
        <p class="hero-eyebrow"><span aria-hidden="true"></span> Consultoría tecnológica para empresas</p>
        <h1 id="hero-title">
          <span class="hero-line">Datos claros.</span>
          <span class="hero-line">Procesos</span>
          <span class="hero-line">conectados.</span>
          <span class="hero-line hero-line--accent">Mejores decisiones.</span>
        </h1>
        <div class="hero-support">
          <p>
            Implementamos sistemas, automatización e IA para ordenar operaciones, ahorrar tiempo y decidir con datos confiables.
          </p>
          <div class="hero-actions">
            <ActionButton
              label="Agendar diagnóstico"
              href="#contacto"
              variant="accent"
              data-analytics-cta="hero_diagnostic"
              data-analytics-funnel="lead_journey"
              data-analytics-step="home"
            />
            <ActionButton
              label="Ver casos"
              href="#casos"
              variant="secondary"
              data-analytics-cta="hero_view_cases"
              data-analytics-funnel="lead_journey"
              data-analytics-step="home"
            />
          </div>
        </div>
      </div>

      <div class="hero-footer" aria-label="Capacidades principales">
        <span>Sistemas a medida</span>
        <span>Automatización</span>
        <span>Inteligencia artificial aplicada</span>
        <a href="#soluciones" aria-label="Desplazarse a problemas y soluciones">
          <span>Explorar soluciones</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4v15m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section{min-height:min(880px,calc(100svh - 90px));display:flex;align-items:center;padding-block:clamp(56px,8vh,104px) 34px;overflow:clip}
.hero-shell{display:flex;min-height:inherit;flex-direction:column;justify-content:center}
.hero-copy{width:100%;max-width:1280px}
.hero-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:clamp(24px,4vh,42px);color:var(--color-link);font-size:.75rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.hero-eyebrow span{width:7px;height:7px;border-radius:50%;background:var(--color-action);box-shadow:0 0 20px rgb(var(--vogel-amber)/.38)}
.hero-copy h1{font-size:clamp(3.3rem,8.25vw,8.4rem);font-weight:720;line-height:.86;letter-spacing:-.04em}
.hero-line{display:block}
.hero-line--accent{color:rgb(var(--vogel-blueLight));margin-top:.06em}
.hero-support{display:grid;grid-template-columns:minmax(0,520px) auto;align-items:end;gap:36px;margin-top:clamp(28px,5vh,54px)}
.hero-support>p{max-width:47ch;color:var(--color-text);font-size:clamp(1rem,1.4vw,1.2rem);line-height:1.7}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px}
.hero-footer{display:grid;grid-template-columns:1fr 1fr 1fr auto;align-items:center;gap:20px;margin-top:clamp(54px,9vh,100px);padding-right:220px;padding-top:20px;border-top:1px solid rgb(var(--vogel-blueLight)/.24);color:var(--color-muted);font-size:.78rem;letter-spacing:.025em}
.hero-footer>a{display:flex;align-items:center;gap:12px;color:var(--color-text);font-size:.75rem;white-space:nowrap}
.hero-footer>a svg{width:18px;height:18px;transition:transform 180ms var(--ease-out)}
.hero-footer>a:hover svg{transform:translateY(3px)}
@media(max-width:1279px){.hero-support{grid-template-columns:1fr;gap:24px}.hero-footer{grid-template-columns:1fr 1fr;gap:14px 18px;padding-right:0}.hero-footer>a{grid-column:1/-1;grid-row:auto;justify-self:start}}
@media(max-width:767px){.hero-section{min-height:auto;padding-block:52px 24px}.hero-shell{min-height:0}.hero-eyebrow{font-size:.65rem;margin-bottom:30px}.hero-copy h1{font-size:clamp(3.2rem,13vw,5.6rem);line-height:.91;letter-spacing:-.04em}.hero-line--accent{max-width:11ch}.hero-support{grid-template-columns:1fr;gap:24px;margin-top:32px}.hero-actions{gap:10px}.hero-footer{grid-template-columns:1fr 1fr;gap:14px 18px;margin-top:40px;font-size:.7rem}.hero-footer span:nth-child(3){max-width:19ch}}
@media(max-width:380px){.hero-copy h1{font-size:clamp(2.9rem,12.6vw,3.2rem)}.hero-actions :deep(.action-button){padding-inline:16px}}
@media(prefers-reduced-motion:reduce){.hero-footer>a svg{transition:none}}
</style>
