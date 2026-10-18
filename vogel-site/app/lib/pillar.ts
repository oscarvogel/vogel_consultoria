import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PillarApi } from '../components/reactbits/LightPillar'
import { prefersReducedMotion } from './smooth'

gsap.registerPlugin(ScrollTrigger)

/**
 * One light pillar for the whole site (mounted in root.tsx). A Pose is everything about how it looks;
 * the journey interpolates between poses as a pure function of scroll, so it is continuous and never jumps.
 */
export type Pose = {
  x: number // vw offset from centre
  y: number // vh offset
  scale: number
  opacity: number
  rot: number // pillarRotation, degrees
  width: number
  intensity: number
  twist: number
  bloom: number
  top: string
  bottom: string
}

const BLUE = '#0b61c8'
const SKY = '#2f7dff'
const AMBER = '#f5ac05'

const base: Pose = { x: 0, y: 0, scale: 1, opacity: 1, rot: 25, width: 3, intensity: 1, twist: 0.4, bloom: 0.5, top: BLUE, bottom: AMBER }
const pose = (p: Partial<Pose>): Pose => ({ ...base, ...p })

/** Interior pages keep the pillar as a quiet presence at the edge until phase 2/3 give them their own journey. */
export const QUIET = pose({ x: 24, opacity: 0.4, width: 1.6, intensity: 0.65, rot: 14 })

const NUMBERS = ['x', 'y', 'scale', 'opacity', 'rot', 'width', 'intensity', 'twist', 'bloom'] as const
const COLORS = ['top', 'bottom'] as const

export function mix(a: Pose, b: Pose, t: number): Pose {
  const out = { ...a }
  for (const k of NUMBERS) out[k] = a[k] + (b[k] - a[k]) * t
  for (const k of COLORS) out[k] = a[k] === b[k] ? a[k] : (gsap.utils.interpolate(a[k], b[k], t) as string)
  return out
}

type Handle = { wrap: HTMLElement; api: { current: PillarApi | null } }
let handle: Handle | null = null
let cur: Pose = pose({})
let tween: gsap.core.Tween | null = null

// Overall gain: the pillar is additive light, so at full strength it washes out body copy sitting on top of it.
const GAIN = { intensity: 0.62, bloom: 0.55 }

function paint(p: Pose) {
  if (!handle) return
  // On phones the pillar stays near the centre: the viewport has no room for the side stations.
  const phone = window.innerWidth < 768
  const k = phone ? 0.3 : 1
  // The 150vw wrapper covers a whole phone screen, so it also gets dimmer there.
  gsap.set(handle.wrap, { x: (p.x * k * window.innerWidth) / 100, y: (p.y * window.innerHeight) / 100, scale: p.scale, opacity: p.opacity * (phone ? 0.6 : 1) })
  handle.api.current?.set({ pillarRotation: p.rot, pillarWidth: p.width, intensity: p.intensity * GAIN.intensity, twist: p.twist, bloom: p.bloom * GAIN.bloom, topColor: p.top, bottomColor: p.bottom })
}

/** Transition pose: the pillar swells and centres while the veil covers the page. */
export const FLARE = pose({ x: 0, rot: 0, width: 5, intensity: 1.7, bloom: 1, twist: 0.9, top: SKY, bottom: AMBER })

// While a page transition runs, the scroll journey stands down so it cannot fight the flare tween.
let hold = false
export const holdPillar = (v: boolean) => {
  hold = v
}

export function registerPillar(h: Handle | null) {
  handle = h
  if (!h) return
  paint(cur)
  // LightPillar is a lazy chunk: its api appears a moment after mount, then gets the current pose.
  let tries = 0
  const wait = () => {
    if (handle !== h || tries++ > 300) return
    if (h.api.current) paint(cur)
    else requestAnimationFrame(wait)
  }
  wait()
}

/** Glide to a pose over `duration` seconds (route changes, reduced states). */
export function goToPose(to: Pose, duration = 1.2) {
  tween?.kill()
  const from = { ...cur }
  const o = { t: 0 }
  tween = gsap.to(o, {
    t: 1,
    duration,
    ease: 'power3.inOut',
    onUpdate: () => {
      cur = mix(from, to, o.t)
      paint(cur)
    },
  })
}

type Key = { at: number; pose: Pose } // at: 0..1 down the section
export type Station = { id: string; keys: Key[] }

// Interior pages are not annotated section by section: every top-level block of <main> gets a station,
// alternating sides and palettes, kept quieter than the home because these pages are denser with text.
const AUTO: Pose[] = [
  pose({ x: 24, rot: 12, width: 1.8, intensity: 0.75, opacity: 0.85 }),
  pose({ x: -24, rot: -10, width: 2, intensity: 0.7, top: SKY, opacity: 0.85 }),
  pose({ x: 8, rot: 4, width: 1.6, intensity: 0.6, top: AMBER, bottom: BLUE, opacity: 0.75 }),
  pose({ x: -12, rot: -4, width: 2.2, intensity: 0.7, top: SKY, bottom: AMBER, opacity: 0.85 }),
]

function resolve(stations: Station[] | 'auto') {
  if (stations === 'auto')
    return Array.from(document.querySelectorAll<HTMLElement>('#contenido > *')).map((el, i) => ({ el, keys: [{ at: i === 0 ? 0.3 : 0.5, pose: AUTO[i % AUTO.length] }] }))
  return stations.map((s) => ({ el: document.querySelector<HTMLElement>(`[data-pillar="${s.id}"]`), keys: s.keys }))
}

/**
 * Journey: each section marks itself with data-pillar="<id>". A key sits where the viewport centre crosses
 * `at` of that section, and between two consecutive keys (the end of one section and the start of the next
 * included) the pillar eases from one pose to the other. Keys are placed inside sections, never on a boundary,
 * so every boundary is a long, smooth run instead of a cut.
 */
export function usePillarJourney(stations: Station[] | 'auto', key = '') {
  useLayoutEffect(() => {
    tween?.kill()
    if (prefersReducedMotion()) {
      cur = stations === 'auto' ? AUTO[0] : stations[0].keys[0].pose
      paint(cur)
      return
    }
    let frames: { y: number; pose: Pose }[] = []

    const measure = () => {
      const next: typeof frames = []
      for (const s of resolve(stations)) {
        const el = s.el
        if (!el) continue
        // A pinned section is measured through its pin-spacer: that box has the real scroll extent.
        const box = (el.closest('.pin-spacer') as HTMLElement | null) ?? el
        const r = box.getBoundingClientRect()
        const top = r.top + window.scrollY
        for (const k of s.keys) next.push({ y: top + k.at * r.height - window.innerHeight / 2, pose: k.pose })
      }
      frames = next.sort((a, b) => a.y - b.y)
    }

    const ease = gsap.parseEase('sine.inOut')
    const sample = (y: number): Pose => {
      if (y <= frames[0].y) return frames[0].pose
      const last = frames[frames.length - 1]
      if (y >= last.y) return last.pose
      let i = 0
      while (frames[i + 1].y <= y) i++
      const a = frames[i]
      const b = frames[i + 1]
      return mix(a.pose, b.pose, ease((y - a.y) / Math.max(1, b.y - a.y)))
    }

    // Damped follow: the pillar trails the scroll slightly, which reads as weight instead of a hard scrub.
    const tick = (_time: number, dt: number) => {
      if (hold || !frames.length) return
      cur = mix(cur, sample(window.scrollY), 1 - Math.exp(-(dt / 1000) * 7))
      paint(cur)
    }

    measure()
    gsap.ticker.add(tick)
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('load', measure)
    return () => {
      gsap.ticker.remove(tick)
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('load', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

/** The home journey. Poses are tuned so the pillar sits behind whatever the section is about. */
export const homeStations: Station[] = [
  { id: 'hero', keys: [
    { at: 0.1, pose: pose({ x: 14, rot: 24, width: 3.2, intensity: 1.05 }) },
    { at: 0.8, pose: pose({ x: -6, rot: 12, width: 2.3, intensity: 0.85, top: SKY }) },
  ] },
  { id: 'clientes', keys: [{ at: 0.5, pose: pose({ x: 0, rot: 3, width: 1.5, intensity: 0.6, opacity: 0.8 }) }] },
  { id: 'soluciones', keys: [
    { at: 0.12, pose: pose({ x: -20, rot: -8, width: 2.1, intensity: 0.95, top: AMBER, bottom: BLUE }) },
    { at: 0.88, pose: pose({ x: 10, rot: 7, width: 2.4, intensity: 1, top: SKY, bottom: AMBER }) },
  ] },
  { id: 'metodo', keys: [
    { at: 0.2, pose: pose({ x: -16, rot: 0, width: 2.4, intensity: 0.8, twist: 0.2 }) },
    { at: 0.85, pose: pose({ x: -16, rot: 0, width: 3.4, intensity: 1.3, twist: 0.9, bloom: 0.8 }) },
  ] },
  { id: 'proyectos', keys: [{ at: 0.5, pose: pose({ x: 2, rot: -12, width: 2.2, intensity: 0.85, top: SKY }) }] },
  { id: 'estudio', keys: [{ at: 0.5, pose: pose({ x: -22, rot: 4, width: 1.9, intensity: 0.9, top: AMBER, bottom: SKY }) }] },
  { id: 'contacto', keys: [{ at: 0.5, pose: pose({ x: 28, rot: 0, width: 3.4, intensity: 1.15, bloom: 0.8, twist: 0.6 }) }] },
]
