import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { registerVeil } from '../lib/transition'

/**
 * The page-transition veil: translucent ink with backdrop blur, so the pillar's flare still glows through it.
 * Its top edge is an amber scan line; it carries the destination as a HUD readout and a progress bar.
 * Hidden (clipped) at rest and never in the tab order. lib/transition.ts drives it.
 */
export default function TransitionVeil() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  // navigate() changes identity between renders; the veil only needs the latest one.
  const nav = useRef(navigate)
  nav.current = navigate

  useEffect(() => {
    registerVeil(ref.current, (to) => nav.current(to))
    return () => registerVeil(null, null)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[65] bg-[rgb(2_15_31/0.78)] backdrop-blur-xl"
      style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
    >
      {/* Leading edge: the line that sweeps the screen. */}
      <div className="absolute top-0 right-0 left-0 h-px bg-amber shadow-[0_0_24px_6px_rgb(245_172_5/0.55)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgb(243_241_226/0.045)_1px,transparent_1px),linear-gradient(90deg,rgb(243_241_226/0.045)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute inset-x-5 bottom-10 sm:inset-x-8 lg:inset-x-12">
        <p className="eyebrow text-amber" data-path />
        <p data-name className="display mt-3 text-[clamp(2.25rem,7vw,7rem)]" />
        <div className="mt-8 h-px bg-cream/15">
          <div data-bar className="h-px origin-left bg-amber" />
        </div>
      </div>
    </div>
  )
}
