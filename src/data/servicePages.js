import sistemasImage from "../assets/services/cards/sistemas-a-medida.webp";
import dashboardsImage from "../assets/services/cards/dashboards-ejecutivos.webp";
import automatizacionImage from "../assets/services/cards/automatizacion-procesos.webp";
import contaflowImage from "../assets/services/cards/contaflow-api.webp";
import webImage from "../assets/services/cards/desarrollo-web.webp";
import talleresImage from "../assets/services/cards/talleres-capacitacion-ia.webp";

const siteUrl = "https://vogelconsultoria.com.ar";
const whatsappBase = "https://wa.me/543743667526";

function whatsappUrl(message) {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

export const servicePages = {
  "sistemas-a-medida": {
    id: "sistemas-a-medida",
    path: "/sistemas-a-medida/",
    eyebrow: "Sistemas a medida",
    title: "Sistemas a medida para empresas en Argentina",
    shortTitle: "Sistemas a medida",
    metaTitle: "Sistemas a Medida para Empresas en Argentina | Vogel Consultoría",
    metaDescription:
      "Desarrollamos sistemas a medida para ordenar procesos, integrar información y mejorar trazabilidad operativa en empresas argentinas.",
    summary:
      "Vogel Consultoría desarrolla sistemas a medida para empresas que necesitan ordenar procesos, conectar áreas y dejar de depender de planillas dispersas.",
    image: sistemasImage,
    imageAlt: "Panel digital para sistemas a medida y trazabilidad de procesos",
    ctaLabel: "Consultar por un sistema",
    ctaUrl: whatsappUrl("Hola Vogel Consultoría, quiero consultar por un sistema a medida para mi empresa."),
    problems: [
      "Procesos críticos repartidos entre planillas, mensajes y sistemas que no se hablan.",
      "Falta de trazabilidad para saber quién hizo qué, cuándo y con qué datos.",
      "Reportes manuales que consumen tiempo y llegan tarde para decidir.",
    ],
    includes: [
      "Relevamiento del flujo real de trabajo y usuarios involucrados.",
      "Diseño de pantallas, permisos, datos y reportes necesarios.",
      "Desarrollo progresivo con validaciones y ajustes sobre casos reales.",
      "Documentación básica y acompañamiento para adopción interna.",
    ],
    process: [
      "Diagnóstico del circuito actual y puntos de fricción.",
      "Prototipo funcional de los flujos principales.",
      "Implementación por módulos para reducir riesgo operativo.",
      "Puesta en marcha, ajustes y soporte inicial.",
    ],
    deliverables: ["Aplicación web o interna", "Modelo de datos", "Reportes operativos", "Usuarios y permisos"],
    faqs: [
      {
        question: "¿Cuánto tarda desarrollar un sistema a medida?",
        answer:
          "Depende del alcance, pero conviene empezar con un módulo mínimo útil. Muchos proyectos pueden iniciar con una primera versión operativa en semanas y luego crecer por etapas.",
      },
      {
        question: "¿Se puede integrar con sistemas existentes?",
        answer:
          "Sí. Primero se revisa qué datos existen, cómo se accede a ellos y qué nivel de integración es seguro y conveniente para la operación.",
      },
      {
        question: "¿Necesito tener todo definido antes de empezar?",
        answer:
          "No. El trabajo comienza con diagnóstico y priorización para convertir necesidades operativas en un alcance implementable.",
      },
    ],
    related: ["dashboards-ejecutivos", "automatizacion-de-procesos", "desarrollo-web"],
  },
  "dashboards-ejecutivos": {
    id: "dashboards-ejecutivos",
    path: "/dashboards-ejecutivos/",
    eyebrow: "Dashboards ejecutivos",
    title: "Dashboards ejecutivos para PYMEs en Argentina",
    shortTitle: "Dashboards ejecutivos",
    metaTitle: "Dashboards Ejecutivos para PYMEs en Argentina | Vogel Consultoría",
    metaDescription:
      "Diseñamos dashboards ejecutivos para integrar ventas, stock, costos y rentabilidad en indicadores claros para decidir mejor.",
    summary:
      "Vogel Consultoría crea dashboards ejecutivos para convertir datos dispersos en indicadores claros, comparables y accionables.",
    image: dashboardsImage,
    imageAlt: "Dashboard ejecutivo con gráficos e indicadores de negocio",
    ctaLabel: "Quiero un dashboard",
    ctaUrl: whatsappUrl("Hola Vogel Consultoría, quiero consultar por un dashboard ejecutivo para mi empresa."),
    problems: [
      "La información existe, pero está dispersa entre planillas, sistemas y reportes manuales.",
      "Los indicadores llegan tarde o con diferencias entre áreas.",
      "La dirección no tiene una vista clara de ventas, stock, costos o rentabilidad.",
    ],
    includes: [
      "Definición de KPIs relevantes para la dirección.",
      "Integración de fuentes disponibles: Excel, bases de datos o sistemas existentes.",
      "Visualizaciones claras para seguimiento periódico.",
      "Alertas o cortes por período, sucursal, vendedor, producto o unidad de negocio cuando aplica.",
    ],
    process: [
      "Selección de indicadores y preguntas de negocio.",
      "Revisión de fuentes y calidad de datos.",
      "Construcción del tablero inicial.",
      "Ajuste con usuarios y entrega de versión operativa.",
    ],
    deliverables: ["Tablero ejecutivo", "KPIs documentados", "Filtros de análisis", "Rutina de actualización"],
    faqs: [
      {
        question: "¿Qué datos necesito para empezar un dashboard?",
        answer:
          "Alcanza con identificar las fuentes actuales y las decisiones que se quieren mejorar. Pueden ser planillas, bases de datos o exportaciones de sistemas existentes.",
      },
      {
        question: "¿El dashboard se actualiza automáticamente?",
        answer:
          "Puede automatizarse si las fuentes lo permiten. Cuando no conviene automatizar todo al inicio, se define una rutina simple y confiable de actualización.",
      },
      {
        question: "¿Sirve para empresas chicas?",
        answer:
          "Sí. Un dashboard bien acotado ayuda especialmente cuando la empresa crece y las decisiones ya no pueden depender solo de intuición o planillas aisladas.",
      },
    ],
    related: ["automatizacion-de-procesos", "sistemas-a-medida", "talleres-ia"],
  },
  "automatizacion-de-procesos": {
    id: "automatizacion-de-procesos",
    path: "/automatizacion-de-procesos/",
    eyebrow: "Automatización de procesos",
    title: "Automatización de procesos para empresas",
    shortTitle: "Automatización de procesos",
    metaTitle: "Automatización de Procesos para Empresas | Vogel Consultoría",
    metaDescription:
      "Automatizamos tareas administrativas y operativas para reducir carga manual, errores repetitivos y demoras entre áreas.",
    summary:
      "Vogel Consultoría automatiza procesos administrativos y operativos para que los equipos reduzcan tareas repetitivas y trabajen con información más confiable.",
    image: automatizacionImage,
    imageAlt: "Flujo digital de automatización de procesos empresariales",
    ctaLabel: "Automatizar un proceso",
    ctaUrl: whatsappUrl("Hola Vogel Consultoría, quiero evaluar la automatización de un proceso de mi empresa."),
    problems: [
      "Carga manual repetida en varias herramientas.",
      "Errores por copiar y pegar información entre planillas, correos y sistemas.",
      "Demoras porque una tarea depende de avisos o controles manuales.",
    ],
    includes: [
      "Mapa simple del proceso actual y sus puntos de pérdida de tiempo.",
      "Priorización de automatizaciones por impacto y esfuerzo.",
      "Implementación de integraciones, alertas, reportes o asistentes internos segun el caso.",
      "Validación con usuarios para evitar automatizar pasos mal definidos.",
    ],
    process: [
      "Detectar tareas repetitivas y reglas de negocio.",
      "Elegir un flujo acotado para automatizar primero.",
      "Construir y probar con datos reales.",
      "Medir ahorro de tiempo, errores evitados y ajustes necesarios.",
    ],
    deliverables: ["Mapa del proceso", "Automatización funcional", "Reglas documentadas", "Indicadores de seguimiento"],
    faqs: [
      {
        question: "¿Qué procesos conviene automatizar primero?",
        answer:
          "Los mejores candidatos son repetitivos, tienen reglas claras y generan costo cuando se hacen tarde o con errores.",
      },
      {
        question: "¿Automatizar reemplaza al equipo?",
        answer:
          "El objetivo es liberar tiempo de tareas mecanicas para que el equipo pueda controlar, analizar y resolver casos que requieren criterio.",
      },
      {
        question: "¿Se puede automatizar si usamos Excel?",
        answer:
          "Sí. Muchas automatizaciones empiezan conectando planillas existentes y ordenando el flujo antes de pasar a sistemas más completos.",
      },
    ],
    related: ["dashboards-ejecutivos", "sistemas-a-medida", "talleres-ia"],
  },
  "contaflow-api-facturacion-electronica": {
    id: "contaflow-api-facturacion-electronica",
    path: "/contaflow-api-facturacion-electronica/",
    eyebrow: "ContaFlow API de Facturación Electrónica",
    title: "ContaFlow: facturación electrónica por API sin pelearte con AFIP/ARCA",
    shortTitle: "ContaFlow API",
    metaTitle: "ContaFlow API de Facturación Electrónica | Vogel Consultoría",
    metaDescription:
      "API de facturación electrónica para desarrolladores. Emiti comprobantes con AFIP/ARCA y recibi CAE, número de factura, vencimiento o errores detallados.",
    summary:
      "Una API pensada para desarrolladores que necesitan emitir comprobantes electrónicos de forma simple, estable y con respuestas claras.",
    image: contaflowImage,
    imageAlt: "Interfaz técnica de API para facturación electrónica con respuestas claras",
    ctaLabel: "Quiero integrar ContaFlow",
    ctaUrl: whatsappUrl("Hola, quiero consultar por ContaFlow, la API de facturación electrónica para integrar con mi sistema."),
    secondaryCtaLabel: "Consultar documentación técnica",
    secondaryCtaUrl: "#documentacion-tecnica",
    intro:
      "Integramos la complejidad fiscal por vos. Tu sistema envia los datos del comprobante y ContaFlow responde con el CAE, el número de factura generado, el vencimiento del CAE o el error detallado en caso de rechazo.",
    problems: [
      "Equipos que pierden días interpretando servicios, errores y validaciones de AFIP/ARCA.",
      "Sistemas de gestión, ERPs o e-commerce que necesitan emitir comprobantes sin sumar fricción fiscal al producto.",
      "Integraciones que requieren respuestas claras para operar en producción, auditar solicitudes y resolver rechazos.",
    ],
    benefits: [
      {
        title: "Para desarrolladores",
        description: "Evita perder tiempo interpretando servicios, errores y validaciones de AFIP/ARCA.",
      },
      {
        title: "Respuesta clara",
        description: "Cada solicitud devuelve estado, CAE, número de factura, vencimiento o error detallado.",
      },
      {
        title: "Integración simple",
        description: "Ideal para sistemas de gestión, ERPs, e-commerce, apps internas y plataformas administrativas.",
      },
      {
        title: "Menos fricción",
        description: "Tu equipo se enfoca en el producto. Nosotros resolvemos la capa fiscal.",
      },
      {
        title: "Pensado para producción",
        description: "API keys, trazabilidad de solicitudes, control de errores y monitoreo operativo.",
      },
      {
        title: "Listo para crecer",
        description: "Diseñado para integrarse con multiples clientes, sistemas externos y asistentes GPT personalizados.",
      },
    ],
    includes: [
      "Endpoint de emisión para enviar los datos necesarios del comprobante.",
      "Respuesta normalizada con estado, CAE, número de factura y vencimiento cuando AFIP/ARCA autoriza.",
      "Errores detallados cuando la operación es rechazada, para mostrarlos o registrarlos sin interpretar respuestas crudas.",
      "Gestión de API keys, trazabilidad de solicitudes y monitoreo operativo para uso en producción.",
    ],
    process: [
      "Revisamos el caso de uso, tipo de comprobantes y sistema que necesita integrarse.",
      "Definimos el flujo de autenticación, datos requeridos y manejo de respuestas.",
      "Probamos emisiones y rechazos controlados para validar la integración del lado cliente.",
      "Dejamos el circuito listo para operar con seguimiento y soporte técnico.",
    ],
    deliverables: ["API de emisión", "CAE y número de factura", "Errores normalizados", "Trazabilidad operativa"],
    apiExamples: {
      success: `{
  "ok": true,
  "estado": "AUTORIZADO",
  "cae": "74382910456789",
  "numero_factura": "0001-00001234",
  "vencimiento_cae": "2026-06-25",
  "mensaje": "Comprobante autorizado"
}`,
      error: `{
  "ok": false,
  "estado": "RECHAZADO",
  "error": {
    "codigo": "1003",
    "mensaje": "CUIT receptor invalido"
  }
}`,
    },
    faqs: [
      {
        question: "¿Para que tipo de sistemas sirve ContaFlow?",
        answer:
          "Sirve para ERPs, sistemas de gestión, e-commerce, apps internas, plataformas administrativas y software factories que necesitan emitir facturas electrónicas desde su propio producto.",
      },
      {
        question: "¿Qué devuelve la API cuando AFIP/ARCA autoriza?",
        answer:
          "Devuelve una respuesta lista para usar con estado de la operación, CAE autorizado, número de factura generado, fecha de vencimiento del CAE y mensaje de autorización.",
      },
      {
        question: "¿Qué pasa si AFIP/ARCA rechaza la operación?",
        answer:
          "ContaFlow responde con estado rechazado y un error detallado para que el sistema pueda registrarlo, mostrarlo o disparar el circuito de corrección correspondiente.",
      },
    ],
    related: ["automatizacion-de-procesos", "sistemas-a-medida", "dashboards-ejecutivos"],
  },
  "desarrollo-web": {
    id: "desarrollo-web",
    path: "/desarrollo-web/",
    eyebrow: "Desarrollo web",
    title: "Desarrollo web profesional en Argentina",
    shortTitle: "Desarrollo web",
    metaTitle: "Desarrollo Web Profesional en Argentina | Vogel Consultoría",
    metaDescription:
      "Creamos sitios web institucionales y comerciales con diseño responsive, estructura clara, SEO técnico y foco en conversión.",
    summary:
      "Vogel Consultoría desarrolla sitios web profesionales para empresas que necesitan presentar servicios, generar confianza y facilitar el contacto comercial.",
    image: webImage,
    imageAlt: "Sitio web profesional responsive orientado a conversión",
    ctaLabel: "Quiero mejorar mi web",
    ctaUrl: whatsappUrl("Hola Vogel Consultoría, quiero consultar por desarrollo o mejora de una página web."),
    problems: [
      "El sitio actual no explica claramente qué ofrece la empresa.",
      "La experiencia en celular no acompaña la forma en que consultan los clientes.",
      "Faltan estructura SEO, llamadas a la acción y contenido confiable.",
    ],
    includes: [
      "Arquitectura de información orientada a servicios y conversión.",
      "Diseño responsive alineado a la marca.",
      "Implementación técnica con buenas prácticas de velocidad y SEO.",
      "Integración de contacto, WhatsApp, formularios o contenido administrable cuando aplica.",
    ],
    process: [
      "Definir objetivos comerciales y páginas necesarias.",
      "Ordenar contenido y jerarquía visual.",
      "Implementar la web y revisar en desktop/mobile.",
      "Publicar, medir y ajustar mensajes clave.",
    ],
    deliverables: ["Sitio responsive", "Metadatos SEO", "Formulario o CTA", "Publicación en hosting"],
    faqs: [
      {
        question: "¿Pueden mejorar una web existente?",
        answer:
          "Sí. Primero se audita la estructura actual y se decide si conviene ajustar, rediseñar por partes o reconstruir con una base más mantenible.",
      },
      {
        question: "¿La web queda preparada para Google?",
        answer:
          "Se implementan bases técnicas de SEO, metadatos, estructura semántica y velocidad. El posicionamiento también depende del contenido, autoridad y competencia.",
      },
      {
        question: "¿Puedo sumar nuevas páginas después?",
        answer:
          "Sí. La estructura se plantea para crecer con nuevos servicios, casos, recursos o landing pages específicas.",
      },
    ],
    related: ["sistemas-a-medida", "dashboards-ejecutivos", "automatizacion-de-procesos"],
  },
  "talleres-ia": {
    id: "talleres-ia",
    path: "/talleres-ia/",
    eyebrow: "Talleres IA",
    title: "Talleres de IA para empresas y equipos",
    shortTitle: "Talleres IA",
    metaTitle: "Talleres de IA para Empresas y Equipos | Vogel Consultoría",
    metaDescription:
      "Capacitaciones prácticas de inteligencia artificial para equipos que quieren aplicar IA con criterio, seguridad y utilidad real.",
    summary:
      "Vogel Consultoría dicta talleres prácticos de IA para que equipos y líderes identifiquen usos reales, riesgos y formas responsables de adopción.",
    image: talleresImage,
    imageAlt: "Capacitación práctica de inteligencia artificial para equipos",
    ctaLabel: "Consultar por un taller",
    ctaUrl: whatsappUrl("Hola Vogel Consultoría, quiero consultar por un taller de IA para mi equipo."),
    problems: [
      "El equipo usa IA de manera aislada, sin criterios comunes.",
      "Hay interés por aplicar IA pero no está claro donde aporta valor.",
      "Faltan pautas para cuidar datos, revisar resultados y evitar usos riesgosos.",
    ],
    includes: [
      "Introducción práctica adaptada al rubro y nivel del equipo.",
      "Ejercicios con tareas reales de administración, ventas, análisis o soporte.",
      "Criterios de uso responsable, validación y protección de información.",
      "Mapa inicial de oportunidades de IA para seguir trabajando.",
    ],
    process: [
      "Relevar perfil del equipo y objetivos del taller.",
      "Preparar ejemplos cercanos al trabajo real.",
      "Dictar la capacitación con ejercicios guiados.",
      "Cerrar con oportunidades priorizadas y próximos pasos.",
    ],
    deliverables: ["Taller práctico", "Material de apoyo", "Ejercicios aplicados", "Mapa de oportunidades"],
    faqs: [
      {
        question: "¿El equipo necesita conocimientos técnicos?",
        answer:
          "No. Los talleres se adaptan al nivel del grupo y priorizan usos prácticos, criterios de validación y formas seguras de trabajo.",
      },
      {
        question: "¿Puede ser para un área específica?",
        answer:
          "Sí. Puede orientarse a administración, ventas, dirección, estudios contables, soporte u otros equipos con tareas concretas.",
      },
      {
        question: "¿Incluye herramientas concretas?",
        answer:
          "Sí, pero el foco no es una herramienta aislada. Se trabaja sobre criterios, casos de uso y buenas prácticas transferibles.",
      },
    ],
    related: ["automatizacion-de-procesos", "dashboards-ejecutivos", "sistemas-a-medida"],
  },
};

Object.assign(servicePages, {
  "mantenimiento-de-equipos": {
    id: "mantenimiento-de-equipos", path: "/mantenimiento-de-equipos/", eyebrow: "Gestión de mantenimiento",
    title: "Sistema de mantenimiento de equipos para flotas y operaciones", shortTitle: "Mantenimiento de equipos",
    metaTitle: "Sistema de Mantenimiento de Equipos | Vogel Consultoría",
    metaDescription: "Sistema web a medida para mantenimiento preventivo y correctivo de flotas, equipos, lecturas, órdenes de trabajo, alertas e historial trazable.",
    summary: "Un sistema web a medida para ordenar el mantenimiento de camiones, tractores, acoplados, máquinas y vehículos, con historial y trazabilidad por equipo.",
    intro: "Centralizamos equipos, lecturas, planes preventivos, solicitudes y órdenes de trabajo para que mantenimiento pueda anticiparse a vencimientos y trabajar con información confiable.",
    image: sistemasImage, imageAlt: "Ilustración de sistemas para gestión operativa",
    ctaLabel: "Consultar por mantenimiento", ctaUrl: whatsappUrl("Hola Vogel Consultoría, quiero consultar por un sistema de gestión de mantenimiento de equipos."),
    problems: ["El historial de cada equipo está repartido entre planillas, mensajes y registros difíciles de consultar.", "Los vencimientos por fecha, kilómetros u horas se controlan tarde o dependen de una persona.", "Las solicitudes y órdenes no tienen una trazabilidad clara desde el aviso hasta el cierre."],
    includes: ["Ficha de equipos, lecturas de kilómetros y horómetro, relaciones y baja lógica con historial.", "Planes de mantenimiento preventivo con vencimientos y panel de próximos servicios.", "Solicitudes, avisos y órdenes de trabajo con responsables, prioridad, tareas y repuestos.", "Alertas, reportes, permisos por empresa o sucursal y auditoría de operaciones sensibles."],
    process: ["Relevar la flota, los tipos de lectura y el circuito actual de mantenimiento.", "Priorizar un circuito vertical con equipos representativos y reglas verificables.", "Implementar por módulos, validando con usuarios y datos reales del piloto.", "Ajustar alertas, reportes, permisos y operación antes de ampliar el alcance."],
    deliverables: ["Ficha e historial de equipos", "Planes preventivos", "Órdenes de trabajo", "Alertas y reportes"],
    faqs: [
      {question: "¿Qué equipos se pueden administrar?", answer: "El sistema puede trabajar con camiones, tractores, acoplados, máquinas, vehículos livianos y otros equipos que la operación necesite incorporar."},
      {question: "¿El mantenimiento preventivo se calcula por fecha o uso?", answer: "Puede considerar fecha, kilómetros u horas de uso, según las reglas definidas para cada plan y equipo."},
      {question: "¿Conviene implementar todo de una vez?", answer: "No necesariamente. Recomendamos comenzar con un circuito acotado y un piloto de equipos representativos para reducir riesgo y validar la operación."}
    ], related: ["sistemas-a-medida", "dashboards-ejecutivos", "automatizacion-de-procesos"]
  },
  "integraciones-whatsapp": {
    id: "integraciones-whatsapp", path: "/integraciones-whatsapp/", eyebrow: "Integraciones con WhatsApp",
    title: "Integraciones y automatizaciones con WhatsApp para empresas", shortTitle: "Integraciones con WhatsApp",
    metaTitle: "Integraciones con WhatsApp para Empresas | Vogel Consultoría",
    metaDescription: "Integramos WhatsApp con sistemas y procesos empresariales: consultas, notificaciones, seguimiento, atención humana y registro trazable de interacciones.",
    summary: "Integramos WhatsApp a los sistemas y procesos de tu empresa para reducir tareas manuales, responder mejor y dejar cada interacción trazable.",
    intro: "Diseñamos el circuito completo: qué evento inicia el contacto, qué información necesita el equipo y cómo se registra cada respuesta para que la automatización sea útil y controlable.",
    image: automatizacionImage, imageAlt: "Ilustración de integración entre sistemas y procesos",
    ctaLabel: "Consultar integración WhatsApp", ctaUrl: whatsappUrl("Hola Vogel Consultoría, quiero consultar por una integración de WhatsApp con mi empresa."),
    problems: ["Las consultas llegan por WhatsApp pero quedan fuera del sistema de gestión.", "El equipo copia datos entre chats, planillas y sistemas para responder o hacer seguimiento.", "No hay reglas claras para notificar, escalar una conversación o dejar evidencia del contacto."],
    includes: ["Relevamiento de casos de uso: consultas, avisos, confirmaciones, seguimiento y soporte.", "Conexión con sistemas existentes, formularios, bases de datos o automatizaciones internas.", "Reglas para respuestas, derivaciones, alertas y registro de cada interacción.", "Pruebas con usuarios, documentación del circuito y acompañamiento para la puesta en marcha."],
    process: ["Definir el objetivo comercial u operativo y los datos que deben quedar registrados.", "Elegir un flujo inicial acotado, medible y seguro para el equipo.", "Implementar la integración y probar respuestas, errores y casos de excepción.", "Medir adopción y tiempos de respuesta para ajustar antes de sumar nuevos flujos."],
    deliverables: ["Flujo de WhatsApp", "Integración con sistemas", "Reglas de atención", "Registro y métricas"],
    faqs: [
      {question: "¿Se puede conectar WhatsApp con mi sistema actual?", answer: "Primero revisamos qué datos expone el sistema y qué nivel de integración es conveniente. A partir de eso definimos una conexión segura y mantenible."},
      {question: "¿La automatización reemplaza la atención humana?", answer: "No. Puede resolver pasos repetitivos y ordenar la información, mientras el equipo conserva el control de los casos que requieren criterio."},
      {question: "¿Puedo empezar con un solo proceso?", answer: "Sí. Un flujo inicial acotado permite validar utilidad, tiempos de respuesta y calidad del registro antes de ampliar la integración."}
    ], related: ["automatizacion-de-procesos", "sistemas-a-medida", "talleres-ia"]
  }
});

export function getServicePage(id) {
  return servicePages[id] || null;
}

export function getRelatedServices(page) {
  return page.related.map((id) => servicePages[id]).filter(Boolean);
}

export function getServiceUrl(path) {
  return `${siteUrl}${path}`;
}
