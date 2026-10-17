export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col justify-end px-5 pt-36 pb-20 sm:px-8 lg:px-12">
      <title>Página no encontrada | Vogel Consultoría</title>
      <meta name="robots" content="noindex" />
      <p className="eyebrow text-muted">Error 404</p>
      <h1 className="mt-6 max-w-5xl text-[clamp(2.5rem,8vw,8.5rem)]">Esta página no existe.</h1>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <a className="btn" href="/">Volver al inicio <span aria-hidden="true">→</span></a>
        <a className="ink-link" href="/soluciones/">Ver soluciones</a>
      </div>
    </section>
  )
}
