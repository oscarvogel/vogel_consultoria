import { useEffect, useId, useState } from 'react'
import { SYMBOL, SYMBOL_VIEWBOX } from '../assets/brand/symbol-paths'

// Logo colours; the blue is lifted on the glow/stroke because #0b61c8 alone is too dark on the ink background.
const BLUE = '#0b61c8'
const BLUE_LIT = '#4a9bff'
const AMBER = '#f5ac05'
const CREAM = '#f3f1e2'

/**
 * The official symbol as a living lightning outline, in pure SVG: the same three traced paths as
 * vogel-simbolo.svg, with an animated turbulence + displacement filter for the crackle and blurred
 * copies for the glow. No canvas, so no visible rectangle. Static when reduced motion is set.
 */
export default function ElectricMark({ className = '', label = 'Vogel Consultoría' }: { className?: string; label?: string }) {
  const id = useId().replace(/:/g, '')
  const [still, setStill] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setStill(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const outline = (stroke: string, width: number, path: string, extra = {}) => (
    <path d={path} fill="none" stroke={stroke} strokeWidth={width} strokeLinejoin="round" fillRule="evenodd" {...extra} />
  )

  return (
    <svg viewBox={SYMBOL_VIEWBOX} role="img" aria-label={label} className={className} overflow="visible">
      <defs>
        {/* Crackle: noise re-seeded a few times a second pushes the outline sideways. */}
        <filter id={`${id}-crackle`} x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.017" numOctaves={2} seed={3} result="noise">
            {!still && <animate attributeName="seed" values="3;8;5;11;2;9;6;14" dur="1.1s" calcMode="discrete" repeatCount="indefinite" />}
            {!still && <animate attributeName="baseFrequency" values="0.011 0.017;0.014 0.012;0.011 0.017" dur="5s" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={still ? 0 : 34} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${id}-glow-wide`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={70} />
        </filter>
        <filter id={`${id}-glow-tight`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
      </defs>

      {/* Glow: wide halo and a tighter bloom, so the mark lights the pillar behind it. */}
      <g filter={`url(#${id}-glow-wide)`} opacity={0.55}>
        <path d={SYMBOL.blue} fill={BLUE} fillRule="evenodd" />
        <path d={SYMBOL.white} fill={AMBER} fillRule="evenodd" opacity={0.6} />
        <path d={SYMBOL.amber} fill={AMBER} fillRule="evenodd" />
      </g>
      <g filter={`url(#${id}-glow-tight)`} opacity={0.8}>
        {outline(BLUE_LIT, 14, SYMBOL.blue)}
        {outline(AMBER, 14, SYMBOL.white)}
        {outline(AMBER, 26, SYMBOL.amber)}
      </g>

      {/* Lightning: the displaced outline, hot core in cream over the coloured edge. */}
      <g filter={`url(#${id}-crackle)`}>
        {outline(BLUE_LIT, 10, SYMBOL.blue)}
        {outline(AMBER, 10, SYMBOL.white)}
        {outline(CREAM, 4, SYMBOL.white)}
        {outline(CREAM, 4, SYMBOL.blue)}
      </g>

      {/* Crisp base so the symbol stays legible when the crackle peaks. */}
      <path d={SYMBOL.blue} fill={BLUE} fillOpacity={0.35} fillRule="evenodd" />
      <path d={SYMBOL.white} fill={CREAM} fillOpacity={0.16} fillRule="evenodd" />
      <path d={SYMBOL.amber} fill={AMBER} fillRule="evenodd" />
    </svg>
  )
}
