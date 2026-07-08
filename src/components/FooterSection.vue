<template>
  <footer class="border-t border-vogel-gray/10 py-10" role="contentinfo" aria-label="Pie de página">
    <div class="section-shell grid gap-6 text-sm text-vogel-gray sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <h3 class="font-semibold text-white">Vogel Consultoría</h3>
        <p class="mt-2">Soluciones integrales</p>
      </div>
      <address class="not-italic">
        <p>Email: <a href="mailto:oscar@vogelconsultoria.com.ar" class="hover:text-white" data-analytics-cta="footer_email" data-analytics-funnel="lead_journey" data-analytics-step="contact">oscar@vogelconsultoria.com.ar</a></p>
        <p class="mt-1">WhatsApp: <a href="https://wa.me/543743667526" class="hover:text-white" data-analytics-cta="footer_whatsapp" data-analytics-funnel="lead_journey" data-analytics-step="contact">+54 3743 66-7526</a></p>
        <p class="mt-1">Argentina</p>
      </address>
      <div>
        <h3 class="font-semibold text-white">Links rápidos</h3>
        <div class="mt-2 flex flex-wrap gap-4">
          <a href="#inicio" class="hover:text-white">Inicio</a>
          <a href="#servicios" class="hover:text-white">Servicios</a>
          <a href="/recursos/" class="hover:text-white" data-analytics-cta="footer_resources" data-analytics-funnel="content_discovery" data-analytics-step="footer">Recursos</a>
          <a href="#soluciones" class="hover:text-white">Soluciones</a>
          <a href="#nosotros" class="hover:text-white">Quién soy</a>
          <a href="#contacto" class="hover:text-white" data-analytics-cta="footer_contact_link" data-analytics-funnel="lead_journey" data-analytics-step="contact">Contacto</a>
        </div>
      </div>
      <div>
        <h3 class="font-semibold text-white">Redes</h3>
        <div class="mt-3 flex flex-wrap gap-3">
          <a
            href="https://www.instagram.com/vogelconsultoria.ar/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full border border-vogel-gray/15 bg-white/[0.04] px-3 py-2 font-semibold text-vogel-gray transition hover:border-vogel-amber/60 hover:bg-vogel-amber/10 hover:text-white"
            aria-label="Instagram de Vogel Consultoría"
            data-analytics-cta="footer_instagram"
            data-analytics-funnel="social_follow"
            data-analytics-step="footer"
          >
            <span class="flex h-6 w-6 items-center justify-center rounded-full border border-vogel-amber/45 text-xs font-bold text-vogel-amber" aria-hidden="true">IG</span>
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/123134273/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full border border-vogel-gray/15 bg-white/[0.04] px-3 py-2 font-semibold text-vogel-gray transition hover:border-vogel-blueLight/60 hover:bg-vogel-blue/15 hover:text-white"
            aria-label="LinkedIn de Vogel Consultoría"
            data-analytics-cta="footer_linkedin"
            data-analytics-funnel="social_follow"
            data-analytics-step="footer"
          >
            <span class="flex h-6 w-6 items-center justify-center rounded-full border border-vogel-blueLight/45 text-xs font-bold text-vogel-blueLight" aria-hidden="true">in</span>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
