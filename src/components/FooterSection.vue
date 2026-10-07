<template>
  <footer class="site-footer" role="contentinfo" aria-label="Pie de página">
    <div class="footer-row">
      <p class="footer-brand">Vogel Consultoría <span>Tecnología con criterio de negocio</span></p>
      <address class="footer-contact">
        <a href="mailto:oscar@vogelconsultoria.com.ar" data-analytics-cta="footer_email" data-analytics-funnel="lead_journey" data-analytics-step="contact">oscar@vogelconsultoria.com.ar</a>
        <a href="https://wa.me/543743667526" data-analytics-cta="footer_whatsapp" data-analytics-funnel="lead_journey" data-analytics-step="contact">+54 3743 66-7526</a>
      </address>
      <nav class="footer-links" aria-label="Enlaces del sitio">
        <a href="/">Inicio</a>
        <a href="/recursos/" data-analytics-cta="footer_resources" data-analytics-funnel="content_discovery" data-analytics-step="footer">Recursos</a>
        <a href="/#contacto" data-analytics-cta="footer_contact_link" data-analytics-funnel="lead_journey" data-analytics-step="contact">Contacto</a>
        <a href="https://www.instagram.com/vogelconsultoria.ar/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Vogel Consultoría" data-analytics-cta="footer_instagram" data-analytics-funnel="social_follow" data-analytics-step="footer">Instagram</a>
        <a href="https://www.linkedin.com/company/123134273/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Vogel Consultoría" data-analytics-cta="footer_linkedin" data-analytics-funnel="social_follow" data-analytics-step="footer">LinkedIn</a>
      </nav>
    </div>
  </footer>
</template>
<style scoped>
.site-footer{border-top:1px solid var(--color-border);padding:40px max(20px,2vw);font-size:14px;color:var(--color-muted)}
.footer-row{display:flex;flex-wrap:wrap;justify-content:space-between;gap:24px 48px;max-width:1520px;margin:auto}
.footer-brand{margin:0;font-weight:600;color:var(--color-heading)}.footer-brand span{display:block;margin-top:4px;font-weight:400;color:var(--color-muted)}
.footer-contact{display:grid;gap:4px;font-style:normal}
.footer-links{display:flex;flex-wrap:wrap;gap:6px 22px}
.site-footer a{display:inline-flex;min-height:32px;align-items:center;transition:color 160ms}.site-footer a:hover,.site-footer a:focus-visible{color:rgb(var(--vogel-amber))}
</style>
