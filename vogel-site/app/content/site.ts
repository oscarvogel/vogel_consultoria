// Contact facts, as published in the Vue site's index.html JSON-LD.
export const site = {
  name: 'Vogel Consultoría',
  url: 'https://vogelconsultoria.com.ar',
  email: 'oscar@vogelconsultoria.com.ar',
  phone: '+54 3743 667526',
  instagram: 'https://www.instagram.com/vogelconsultoria.ar/',
  linkedin: 'https://www.linkedin.com/company/123134273/',
}

export const whatsappUrl = (message = 'Hola Vogel Consultoría, quiero hacer una consulta.') =>
  `https://wa.me/543743667526?text=${encodeURIComponent(message)}`

export const diagnosticMail = `mailto:${site.email}?subject=${encodeURIComponent('Quiero agendar un diagnóstico')}`
