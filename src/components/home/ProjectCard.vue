<script setup>
import { computed, ref } from 'vue';
const props = defineProps({ card: { type: Object, required: true }, index: { type: Number, default: 0 }, compact: Boolean });
const cardSizes = computed(() => props.compact
  ? '(max-width: 767px) calc(100vw - 48px), (max-width: 1100px) 50vw, 34vw'
  : '(max-width: 767px) calc(100vw - 48px), 1072px');
const failed = ref(false);
// Card art (generated illustration) when available; otherwise the captured cover.
const media = computed(() => props.card.art
  ? { src: props.card.art, srcset: `${props.card.artSmall} 640w, ${props.card.art} 1280w`, width: 1280, height: 1280, position: props.card.artPosition }
  : { src: props.card.image, srcset: props.card.imageSmall ? `${props.card.imageSmall} 800w, ${props.card.image} 1600w` : undefined,
      width: props.card.forest ? 1440 : 1600, height: props.card.forest ? 1151 : 900, position: undefined });
</script>
<template>
  <a class="project-card" :class="{ 'is-compact': compact, 'image-unavailable': failed, 'has-art': !!card.art }" :href="card.href" :data-project-id="card.id"
    :data-analytics-cta="card.cta" data-analytics-funnel="lead_journey" data-analytics-step="home">
    <span class="project-art" :class="{ 'art-contain': card.artFit === 'contain' }" :style="card.artBackground && { background: card.artBackground }" aria-hidden="true">
      <img v-if="!failed" :src="media.src" :srcset="media.srcset" :sizes="media.srcset ? cardSizes : undefined" alt="" :width="media.width" :height="media.height" :style="media.position && { objectPosition: media.position }"
        :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" decoding="async" draggable="false" @error="failed = true" />
    </span>
    <h2 class="project-title">{{ card.title }}</h2>
    <span class="project-meta"><span>{{ card.category }}</span><span>{{ card.tag }}</span></span>
    <span v-if="failed" class="project-image-error">Imagen no disponible · ver proyecto</span>
  </a>
</template>
<style scoped>
.project-card{position:relative;display:block;flex:none;overflow:hidden;border-radius:12px;background:var(--color-panel);isolation:isolate;color:var(--color-heading);container-type:inline-size}
.project-art{position:absolute;inset:0;z-index:-2;overflow:hidden}
.project-art img{width:100%;max-width:none;height:100%;object-fit:cover;object-position:center;transform:translate3d(calc(var(--card-shift,0) * 12px),0,0) scale(1.025)}
/* Logo plates (e.g. Servin) are shown whole in tall cards: grid and mobile carousel. */
.is-compact .art-contain img{object-fit:contain}
@media(max-width:767px){.art-contain img{object-fit:contain}}
.project-card::after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgb(22 21 21/.08),rgb(22 21 21/.1) 38%,rgb(22 21 21/.78))}
.project-title{position:absolute;left:24px;top:50%;width:min(calc(100% - 48px),calc(66vw - 48px));margin:0;transform:translateY(-50%);font-size:clamp(32px,3.4vw,48px);line-height:.92;letter-spacing:-.03em;text-transform:uppercase;text-wrap:balance;color:#F3F1E2;text-shadow:0 0 6px rgb(22 21 21/.7),0 2px 18px rgb(22 21 21/.85),0 0 36px rgb(22 21 21/.6);overflow-wrap:normal}
.project-meta{position:absolute;left:24px;bottom:20px;width:min(calc(100% - 48px),calc(66vw - 48px));display:flex;justify-content:space-between;gap:16px;font-size:13px;line-height:1.45;color:#F3F1E2;text-shadow:0 1px 4px rgb(22 21 21/.9)}
.project-meta>span{min-width:0}.project-meta>span:last-child{text-align:right}
/* Illustrated cards already carry the client's logo in the image: the title sits at the foot, over the scrim, so it never covers it. */
.has-art .project-title{top:auto;bottom:62px;transform:none}
.is-compact.has-art .project-title{top:auto;bottom:80px;left:20px}
.project-card:focus-visible{outline:3px solid var(--color-focus);outline-offset:-4px}
.is-compact .project-title{top:20px;transform:none;width:calc(100% - 40px);left:20px;font-size:clamp(19px,7.4cqw,32px);line-height:1;text-align:left}
.is-compact .project-meta{left:20px;width:calc(100% - 40px);bottom:18px;flex-wrap:wrap;font-size:12px}
.project-image-error{position:absolute;left:24px;bottom:70px;font-size:13px;color:var(--color-muted)}
.image-unavailable::after{background:none}
@media(hover:hover) and (pointer:fine){.project-card:hover .project-title{color:#fff}.project-card:hover .project-art img{scale:1.025;transition:scale 450ms var(--ease-out)}}
@media(max-width:767px){.project-title{width:calc(100% - 40px);left:20px;font-size:clamp(26px,8.4vw,38px)}.project-meta{left:20px;width:calc(100% - 40px);font-size:12px;flex-wrap:wrap;gap:8px}.project-art img{object-position:center;transform:none}.is-compact .project-title{font-size:clamp(24px,8cqw,34px)}}
@media(max-width:767px){.project-card[data-project-id="municipalidad-garuhape"]:not(.is-compact) .project-title{font-size:clamp(24px,7.1vw,29px)}}
@media(prefers-reduced-motion:reduce){.project-art img{transform:none}.project-card:hover .project-art img{scale:1}}
</style>
