let modules;
let animation;
let portal;
let revision = 0;
export const reducedPortfolioMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export function loadPortfolioMotion() {
  modules ||= Promise.all([import('gsap'), import('gsap/Flip')]).then(([motion, flip]) => {
    const gsap = motion.gsap || motion.default;
    const Flip = flip.Flip || flip.default;
    gsap.registerPlugin(Flip);
    return { gsap, Flip };
  });
  // A failed download must not be cached: the next interaction may retry once the network recovers.
  modules.catch(() => { modules = undefined; });
  return modules;
}
function fadeOut(element, onComplete) {
  const fade = element.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out' });
  fade.onfinish = onComplete;
  return { kill: () => { fade.cancel(); onComplete(); } };
}
export function cancelSharedImage() {
  revision++;
  animation?.kill(); animation = null;
  portal?.remove(); portal = null;
}
/** Temporary DOM image joins card and reader. No additional persistent render loop. */
export async function revealSharedImage(source, target) {
  cancelSharedImage();
  if (!source || !target || reducedPortfolioMotion()) return;
  const current = revision;
  let Flip;
  try { ({ Flip } = await loadPortfolioMotion()); } catch { return; }
  if (current !== revision || !target.isConnected) return;
  portal = document.createElement('div');
  portal.className = 'portfolio-image-bridge';
  portal.setAttribute('aria-hidden', 'true');
  Object.assign(portal.style, { left: `${source.rect.left}px`, top: `${source.rect.top}px`, width: `${source.rect.width}px`, height: `${source.rect.height}px` });
  const image = document.createElement('img'); image.src = source.src; image.alt = '';
  image.style.objectPosition = source.position || 'center';
  portal.append(image); document.body.append(portal);
  const element = portal;
  const done = () => { element.remove(); if (portal === element) portal = null; animation = null; };
  // Card art and reader capture can differ: fade the bridge out instead of cutting to the target.
  const differs = target.currentSrc && target.currentSrc !== source.src;
  animation = Flip.fit(element, target, { duration: .65, ease: 'expo.out', absolute: true,
    onComplete: () => { if (differs && current === revision) animation = fadeOut(element, done); else done(); } });
}
