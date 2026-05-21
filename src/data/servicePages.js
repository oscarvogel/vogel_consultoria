import sistemasImage from "../assets/services/cards/sistemas-a-medida.webp";
import dashboardsImage from "../assets/services/cards/dashboards-ejecutivos.webp";
import automatizacionImage from "../assets/services/cards/automatizacion-procesos.webp";
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
    metaTitle: "Sistemas a Medida para Empresas en Argentina | Vogel Consultoria",
    metaDescription:
      "Desarrollamos sistemas a medida para ordenar procesos, integrar informacion y mejorar trazabilidad operativa en empresas argentinas.",
    summary:
      "Vogel Consultoria desarrolla sistemas a medida para empresas que necesitan ordenar procesos, conectar areas y dejar de depender de planillas dispersas.",
    image: sistemasImage,
    imageAlt: "Panel digital para sistemas a medida y trazabilidad de procesos",
    ctaLabel: "Consultar por un sistema",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero consultar por un sistema a medida para mi empresa."),
    problems: [
      "Procesos criticos repartidos entre planillas, mensajes y sistemas que no se hablan.",
      "Falta de trazabilidad para saber quien hizo que, cuando y con que datos.",
      "Reportes manuales que consumen tiempo y llegan tarde para decidir.",
    ],
    includes: [
      "Relevamiento del flujo real de trabajo y usuarios involucrados.",
      "Diseno de pantallas, permisos, datos y reportes necesarios.",
      "Desarrollo progresivo con validaciones y ajustes sobre casos reales.",
      "Documentacion basica y acompanamiento para adopcion interna.",
    ],
    process: [
      "Diagnostico del circuito actual y puntos de friccion.",
      "Prototipo funcional de los flujos principales.",
      "Implementacion por modulos para reducir riesgo operativo.",
      "Puesta en marcha, ajustes y soporte inicial.",
    ],
    deliverables: ["Aplicacion web o interna", "Modelo de datos", "Reportes operativos", "Usuarios y permisos"],
    faqs: [
      {
        question: "Cuanto tarda desarrollar un sistema a medida?",
        answer:
          "Depende del alcance, pero conviene empezar con un modulo minimo util. Muchos proyectos pueden iniciar con una primera version operativa en semanas y luego crecer por etapas.",
      },
      {
        question: "Se puede integrar con sistemas existentes?",
        answer:
          "Si. Primero se revisa que datos existen, como se accede a ellos y que nivel de integracion es seguro y conveniente para la operacion.",
      },
      {
        question: "Necesito tener todo definido antes de empezar?",
        answer:
          "No. El trabajo comienza con diagnostico y priorizacion para convertir necesidades operativas en un alcance implementable.",
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
    metaTitle: "Dashboards Ejecutivos para PYMEs en Argentina | Vogel Consultoria",
    metaDescription:
      "Disenamos dashboards ejecutivos para integrar ventas, stock, costos y rentabilidad en indicadores claros para decidir mejor.",
    summary:
      "Vogel Consultoria crea dashboards ejecutivos para convertir datos dispersos en indicadores claros, comparables y accionables.",
    image: dashboardsImage,
    imageAlt: "Dashboard ejecutivo con graficos e indicadores de negocio",
    ctaLabel: "Quiero un dashboard",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero consultar por un dashboard ejecutivo para mi empresa."),
    problems: [
      "La informacion existe, pero esta dispersa entre planillas, sistemas y reportes manuales.",
      "Los indicadores llegan tarde o con diferencias entre areas.",
      "La direccion no tiene una vista clara de ventas, stock, costos o rentabilidad.",
    ],
    includes: [
      "Definicion de KPIs relevantes para la direccion.",
      "Integracion de fuentes disponibles: Excel, bases de datos o sistemas existentes.",
      "Visualizaciones claras para seguimiento periodico.",
      "Alertas o cortes por periodo, sucursal, vendedor, producto o unidad de negocio cuando aplica.",
    ],
    process: [
      "Seleccion de indicadores y preguntas de negocio.",
      "Revision de fuentes y calidad de datos.",
      "Construccion del tablero inicial.",
      "Ajuste con usuarios y entrega de version operativa.",
    ],
    deliverables: ["Tablero ejecutivo", "KPIs documentados", "Filtros de analisis", "Rutina de actualizacion"],
    faqs: [
      {
        question: "Que datos necesito para empezar un dashboard?",
        answer:
          "Alcanza con identificar las fuentes actuales y las decisiones que se quieren mejorar. Pueden ser planillas, bases de datos o exportaciones de sistemas existentes.",
      },
      {
        question: "El dashboard se actualiza automaticamente?",
        answer:
          "Puede automatizarse si las fuentes lo permiten. Cuando no conviene automatizar todo al inicio, se define una rutina simple y confiable de actualizacion.",
      },
      {
        question: "Sirve para empresas chicas?",
        answer:
          "Si. Un dashboard bien acotado ayuda especialmente cuando la empresa crece y las decisiones ya no pueden depender solo de intuicion o planillas aisladas.",
      },
    ],
    related: ["automatizacion-de-procesos", "sistemas-a-medida", "talleres-ia"],
  },
  "automatizacion-de-procesos": {
    id: "automatizacion-de-procesos",
    path: "/automatizacion-de-procesos/",
    eyebrow: "Automatizacion de procesos",
    title: "Automatizacion de procesos para empresas",
    shortTitle: "Automatizacion de procesos",
    metaTitle: "Automatizacion de Procesos para Empresas | Vogel Consultoria",
    metaDescription:
      "Automatizamos tareas administrativas y operativas para reducir carga manual, errores repetitivos y demoras entre areas.",
    summary:
      "Vogel Consultoria automatiza procesos administrativos y operativos para que los equipos reduzcan tareas repetitivas y trabajen con informacion mas confiable.",
    image: automatizacionImage,
    imageAlt: "Flujo digital de automatizacion de procesos empresariales",
    ctaLabel: "Automatizar un proceso",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero evaluar la automatizacion de un proceso de mi empresa."),
    problems: [
      "Carga manual repetida en varias herramientas.",
      "Errores por copiar y pegar informacion entre planillas, correos y sistemas.",
      "Demoras porque una tarea depende de avisos o controles manuales.",
    ],
    includes: [
      "Mapa simple del proceso actual y sus puntos de perdida de tiempo.",
      "Priorizacion de automatizaciones por impacto y esfuerzo.",
      "Implementacion de integraciones, alertas, reportes o asistentes internos segun el caso.",
      "Validacion con usuarios para evitar automatizar pasos mal definidos.",
    ],
    process: [
      "Detectar tareas repetitivas y reglas de negocio.",
      "Elegir un flujo acotado para automatizar primero.",
      "Construir y probar con datos reales.",
      "Medir ahorro de tiempo, errores evitados y ajustes necesarios.",
    ],
    deliverables: ["Mapa del proceso", "Automatizacion funcional", "Reglas documentadas", "Indicadores de seguimiento"],
    faqs: [
      {
        question: "Que procesos conviene automatizar primero?",
        answer:
          "Los mejores candidatos son repetitivos, tienen reglas claras y generan costo cuando se hacen tarde o con errores.",
      },
      {
        question: "Automatizar reemplaza al equipo?",
        answer:
          "El objetivo es liberar tiempo de tareas mecanicas para que el equipo pueda controlar, analizar y resolver casos que requieren criterio.",
      },
      {
        question: "Se puede automatizar si usamos Excel?",
        answer:
          "Si. Muchas automatizaciones empiezan conectando planillas existentes y ordenando el flujo antes de pasar a sistemas mas completos.",
      },
    ],
    related: ["dashboards-ejecutivos", "sistemas-a-medida", "talleres-ia"],
  },
  "desarrollo-web": {
    id: "desarrollo-web",
    path: "/desarrollo-web/",
    eyebrow: "Desarrollo web",
    title: "Desarrollo web profesional en Argentina",
    shortTitle: "Desarrollo web",
    metaTitle: "Desarrollo Web Profesional en Argentina | Vogel Consultoria",
    metaDescription:
      "Creamos sitios web institucionales y comerciales con diseno responsive, estructura clara, SEO tecnico y foco en conversion.",
    summary:
      "Vogel Consultoria desarrolla sitios web profesionales para empresas que necesitan presentar servicios, generar confianza y facilitar el contacto comercial.",
    image: webImage,
    imageAlt: "Sitio web profesional responsive orientado a conversion",
    ctaLabel: "Quiero mejorar mi web",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero consultar por desarrollo o mejora de una pagina web."),
    problems: [
      "El sitio actual no explica claramente que ofrece la empresa.",
      "La experiencia en celular no acompana la forma en que consultan los clientes.",
      "Faltan estructura SEO, llamadas a la accion y contenido confiable.",
    ],
    includes: [
      "Arquitectura de informacion orientada a servicios y conversion.",
      "Diseno responsive alineado a la marca.",
      "Implementacion tecnica con buenas practicas de velocidad y SEO.",
      "Integracion de contacto, WhatsApp, formularios o contenido administrable cuando aplica.",
    ],
    process: [
      "Definir objetivos comerciales y paginas necesarias.",
      "Ordenar contenido y jerarquia visual.",
      "Implementar la web y revisar en desktop/mobile.",
      "Publicar, medir y ajustar mensajes clave.",
    ],
    deliverables: ["Sitio responsive", "Metadatos SEO", "Formulario o CTA", "Publicacion en hosting"],
    faqs: [
      {
        question: "Pueden mejorar una web existente?",
        answer:
          "Si. Primero se audita la estructura actual y se decide si conviene ajustar, redisenar por partes o reconstruir con una base mas mantenible.",
      },
      {
        question: "La web queda preparada para Google?",
        answer:
          "Se implementan bases tecnicas de SEO, metadatos, estructura semantica y velocidad. El posicionamiento tambien depende del contenido, autoridad y competencia.",
      },
      {
        question: "Puedo sumar nuevas paginas despues?",
        answer:
          "Si. La estructura se plantea para crecer con nuevos servicios, casos, recursos o landing pages especificas.",
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
    metaTitle: "Talleres de IA para Empresas y Equipos | Vogel Consultoria",
    metaDescription:
      "Capacitaciones practicas de inteligencia artificial para equipos que quieren aplicar IA con criterio, seguridad y utilidad real.",
    summary:
      "Vogel Consultoria dicta talleres practicos de IA para que equipos y lideres identifiquen usos reales, riesgos y formas responsables de adopcion.",
    image: talleresImage,
    imageAlt: "Capacitacion practica de inteligencia artificial para equipos",
    ctaLabel: "Consultar por un taller",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero consultar por un taller de IA para mi equipo."),
    problems: [
      "El equipo usa IA de manera aislada, sin criterios comunes.",
      "Hay interes por aplicar IA pero no esta claro donde aporta valor.",
      "Faltan pautas para cuidar datos, revisar resultados y evitar usos riesgosos.",
    ],
    includes: [
      "Introduccion practica adaptada al rubro y nivel del equipo.",
      "Ejercicios con tareas reales de administracion, ventas, analisis o soporte.",
      "Criterios de uso responsable, validacion y proteccion de informacion.",
      "Mapa inicial de oportunidades de IA para seguir trabajando.",
    ],
    process: [
      "Relevar perfil del equipo y objetivos del taller.",
      "Preparar ejemplos cercanos al trabajo real.",
      "Dictar la capacitacion con ejercicios guiados.",
      "Cerrar con oportunidades priorizadas y proximos pasos.",
    ],
    deliverables: ["Taller practico", "Material de apoyo", "Ejercicios aplicados", "Mapa de oportunidades"],
    faqs: [
      {
        question: "El equipo necesita conocimientos tecnicos?",
        answer:
          "No. Los talleres se adaptan al nivel del grupo y priorizan usos practicos, criterios de validacion y formas seguras de trabajo.",
      },
      {
        question: "Puede ser para un area especifica?",
        answer:
          "Si. Puede orientarse a administracion, ventas, direccion, estudios contables, soporte u otros equipos con tareas concretas.",
      },
      {
        question: "Incluye herramientas concretas?",
        answer:
          "Si, pero el foco no es una herramienta aislada. Se trabaja sobre criterios, casos de uso y buenas practicas transferibles.",
      },
    ],
    related: ["automatizacion-de-procesos", "dashboards-ejecutivos", "sistemas-a-medida"],
  },
};

export function getServicePage(id) {
  return servicePages[id] || null;
}

export function getRelatedServices(page) {
  return page.related.map((id) => servicePages[id]).filter(Boolean);
}

export function getServiceUrl(path) {
  return `${siteUrl}${path}`;
}
