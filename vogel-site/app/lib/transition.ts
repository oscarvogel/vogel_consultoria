import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLARE, goToPose, holdPillar } from './pillar'
import { lenis, prefersReducedMotion } from './smooth'

gsap.registerPlugin(ScrollTrigger)

type Nav = (to: string) => Promise<void> | void
let veil: HTMLElement | null = null
let navigate: Nav | null = null
let busy = false

export function registerVeil(el: HTMLElement | null, nav: Nav | null) {
  veil = el
  navigate = nav
}

/** Resolve when `test` is true (checked every frame), or after `ms` regardless. */
const until = (test: () => boolean, ms = 2500) =>
  new Promise<void>((resolve) => {
    const end = performance.now() + ms
    const tick = () => (test() || performance.now() > end ? resolve() : requestAnimationFrame(tick))
    tick()
  })

const frames = (n: number) => new Promise<void>((r) => (function tick(i: number) { i <= 0 ? r() : requestAnimationFrame(() => tick(i - 1)) })(n))

/** Link text without arrows, or the path when the link is an icon. */
const labelFor = (a: HTMLAnchorElement, url: URL) => a.textContent?.replace(/[→↗↓←↑]/g, '').replace(/\s+/g, ' ').trim() || url.pathname

/**
 * Route change as one continuous gesture, so the pillar is never lost:
 *   1. the pillar swells and centres (FLARE) while a glass veil wipes up over the page, its leading edge a scan line;
 *   2. the new route renders underneath, scroll resets, ScrollTrigger re-measures;
 *   3. the veil keeps rising and leaves, and the pillar settles into the first station of the new page.
 * Reduced motion: no veil, a plain client-side navigation.
 */
export async function transitionTo(url: URL, label: string) {
  if (busy || !navigate) return
  busy = true
  const to = url.pathname + url.search + url.hash
  try {
    if (!veil || prefersReducedMotion()) {
      await navigate(to)
      return
    }
    const q = gsap.utils.selector(veil)
    const [name, path, bar] = [q('[data-name]')[0], q('[data-path]')[0], q('[data-bar]')[0]]
    name.textContent = label
    path.textContent = url.pathname

    holdPillar(true)
    goToPose(FLARE, 0.7)
    veil.style.pointerEvents = 'auto'
    lenis?.stop()
    gsap.set(veil, { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set([name, path], { autoAlpha: 0, y: 14 })
    gsap.set(bar, { scaleX: 0 })

    await gsap
      .timeline()
      .to(veil, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.inOut' })
      .to([name, path], { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, 0.35)
      .to(bar, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, 0.2)

    // navigate() resolves before React has committed the route: wait until <main> actually holds the new page.
    const before = document.getElementById('contenido')?.firstElementChild
    await navigate(to)
    await until(() => window.location.pathname === url.pathname && document.getElementById('contenido')?.firstElementChild !== before)
    await frames(2)
    // The new route is in the DOM. Scroll was reset by the root; re-measure pinned scenes, then honour a #hash.
    ScrollTrigger.refresh()
    if (url.hash) {
      // Heights keep settling after the route mounts (fonts, lazy images, pin-spacers): re-aim a few times behind the veil.
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      await document.fonts.ready
      for (let i = 0; target && i < 3; i++) {
        ScrollTrigger.refresh()
        // React Router already jumped to the hash at commit time, before pin-spacers existed: aim again with absolute numbers.
        const top = Math.round(target.getBoundingClientRect().top + window.scrollY)
        window.scrollTo(0, top)
        lenis?.scrollTo(top, { immediate: true, force: true })
        await new Promise((r) => setTimeout(r, 180))
      }
    }
    await frames(2)

    holdPillar(false) // the pillar now eases from the flare to the page's first station
    await gsap
      .timeline()
      .to([name, path], { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power2.in' })
      .to(veil, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power3.inOut' }, 0.1)
  } finally {
    if (veil) {
      veil.style.pointerEvents = 'none'
      gsap.set(veil, { clipPath: 'inset(100% 0% 0% 0%)' })
    }
    holdPillar(false)
    lenis?.start()
    busy = false
  }
}

/** Decide whether a click is an in-site navigation we should take over. Returns the target or null. */
export function internalTarget(event: MouseEvent): { url: URL; label: string } | null {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const a = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || a.getAttribute('rel')?.includes('external')) return null
  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  // Files (pdf, svg, xml) and the legacy redirect pages are real documents, not routes.
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return null
  return { url, label: labelFor(a, url) }
}
