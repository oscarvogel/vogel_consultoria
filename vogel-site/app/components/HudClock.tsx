import { useEffect, useState } from 'react'

/** Argentina time, ticking once a second. Renders a placeholder until mounted so the prerendered HTML never goes stale. */
export default function HudClock() {
  const [now, setNow] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return <span>{now || '--:--:--'} ART</span>
}
