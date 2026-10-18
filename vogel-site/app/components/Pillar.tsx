import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PillarApi } from './reactbits/LightPillar'
import { registerPillar } from '../lib/pillar'

// WebGL stays out of the first bundle and out of the prerendered HTML: it mounts after hydration.
const LightPillar = lazy(() => import('./reactbits/LightPillar'))

/**
 * The site's single light pillar. Fixed behind everything and never unmounted on navigation, so it can
 * travel across sections and pages. The wrapper is wider than the viewport so that moving it sideways
 * never exposes an empty strip. lib/pillar.ts moves it and restyles it; React never re-renders it.
 */
export default function Pillar() {
  const wrap = useRef<HTMLDivElement>(null)
  const api = useRef<PillarApi | null>(null)
  const [live, setLive] = useState(false)
  const [light, setLight] = useState(false)

  useEffect(() => {
    // Phones and touch devices get the same pillar at low resolution, per the brief.
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const update = () => setLight(mq.matches)
    update()
    mq.addEventListener('change', update)
    setLive(true)
    return () => mq.removeEventListener('change', update)
  }, [])

  useLayoutEffect(() => {
    registerPillar({ wrap: wrap.current!, api })
    return () => registerPillar(null)
  }, [live])

  return (
    <div ref={wrap} aria-hidden="true" className="pointer-events-none fixed top-0 -left-[25vw] -z-10 h-svh w-[150vw] will-change-transform">
      {live && (
        <Suspense fallback={null}>
          <LightPillar
            apiRef={api}
            topColor="#0b61c8"
            bottomColor="#f5ac05"
            quality={light ? 'low' : 'medium'}
            interactive={!light}
            clickPulse={false}
            rotationSpeed={0.25}
            noiseIntensity={0.6}
          />
        </Suspense>
      )}
    </div>
  )
}
