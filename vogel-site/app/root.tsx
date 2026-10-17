import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation, useNavigationType } from 'react-router'
import './app.css'
import archivo from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url'
import { lenis, useSmoothScroll } from './lib/smooth'
import { useReveals } from './lib/reveal'
import { initAnalytics, trackEvent } from './lib/analytics.js'
import TargetCursor from './components/reactbits/TargetCursor'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Pillar from './components/Pillar'
import { homeStations, usePillarJourney } from './lib/pillar'
import { internalTarget, transitionTo } from './lib/transition'
import TransitionVeil from './components/TransitionVeil'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Both faces are on the first screen: preloading them avoids the swap that shifts the hero (CLS).
export const links = () =>
  [archivo, '/fonts/chillax-variable.woff2'].map((href) => ({ rel: 'preload', as: 'font', type: 'font/woff2', href, crossOrigin: 'anonymous' as const }))

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020f1f" />
        <link rel="icon" type="image/svg+xml" href="/logo-vogel.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  useSmoothScroll()
  // GA4 loads only after consent; the banner and Privacidad button are the Vue site's, unchanged.
  useEffect(initAnalytics, [])
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  const first = useRef(true)
  const announcer = useRef<HTMLDivElement>(null)

  // Order matters (child layout effects have already run: the new route is in the DOM):
  // 1) back to the top for a pushed page, BEFORE the reveals measure what is below the fold;
  useLayoutEffect(() => {
    if (first.current || navType === 'POP' || hash) return
    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true, force: true })
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  // 2) the page's reveals, 3) the pillar's journey (needs pin-spacers from the route's own effects).
  useReveals(pathname)
  usePillarJourney(pathname === '/' ? homeStations : 'auto', pathname)

  // Client-side navigation for every internal link, with the veil transition (lib/transition.ts).
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const hit = internalTarget(event)
      if (!hit) return
      const same = hit.url.pathname === window.location.pathname
      if (same && hit.url.hash) return // in-page anchor: Lenis scrolls to it
      event.preventDefault()
      if (same) lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' })
      else void transitionTo(hit.url, hit.label)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // After each client navigation: re-measure, announce, move focus, report the page view.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      const title = document.title
      if (announcer.current) announcer.current.textContent = title
      if (navType !== 'POP' && !hash) document.getElementById('contenido')?.focus({ preventScroll: true })
      trackEvent('page_view', { page_path: pathname, page_title: title })
    })
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:bg-amber focus:px-4 focus:py-3 focus:text-ink-dark">
        Saltar al contenido
      </a>
      <Pillar />
      <div aria-hidden="true" className="grain" />
      <TransitionVeil />
      <div ref={announcer} role="status" aria-live="polite" className="sr-only" />
      <Nav />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      {/* Only fine pointers get it (the component checks); targets are marked .cursor-target. */}
      <TargetCursor cursorColor="#f3f1e2" spinDuration={4} />
    </>
  )
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <main id="contenido" className="flex min-h-svh flex-col justify-end px-5 pt-36 pb-20 sm:px-8 lg:px-12">
      <title>{notFound ? 'Página no encontrada | Vogel Consultoría' : 'Error | Vogel Consultoría'}</title>
      <meta name="robots" content="noindex" />
      <p className="eyebrow text-muted">{notFound ? 'Error 404' : 'Error'}</p>
      <h1 className="mt-6 max-w-5xl text-[clamp(3rem,8vw,8.5rem)]">{notFound ? 'Esta página no existe.' : 'Algo falló.'}</h1>
      <div className="mt-10">
        <a className="btn" href="/">Volver al inicio <span aria-hidden="true">→</span></a>
      </div>
    </main>
  )
}
