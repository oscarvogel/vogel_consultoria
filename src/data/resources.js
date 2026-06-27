const siteUrl = "https://vogelconsultoria.com.ar";

export const resources = [
  {
    id: "cuando-conviene-sistema-a-medida",
    path: "/recursos/cuando-conviene-sistema-a-medida/",
    eyebrow: "Guia de decision",
    title: "Cuando conviene un sistema a medida para una empresa",
    shortTitle: "Cuando conviene un sistema a medida",
    metaTitle: "Cuando Conviene un Sistema a Medida | Vogel Consultoria",
    metaDescription:
      "Guia para detectar cuando una empresa necesita un sistema a medida y cuando alcanza con ordenar planillas, procesos o herramientas existentes.",
    summary:
      "No todo problema operativo necesita software nuevo. Esta guia ayuda a reconocer cuando un sistema a medida empieza a ser una inversion razonable.",
    primaryService: "sistemas-a-medida",
    readTime: "5 min",
    published: "2026-06-04",
    keywords: ["sistemas a medida", "software a medida", "procesos empresariales"],
    sections: [
      {
        heading: "La senal no es la tecnologia, es la friccion",
        body:
          "Un sistema a medida empieza a tener sentido cuando el equipo repite tareas, copia datos entre lugares, pierde trazabilidad o depende de una persona para saber como sigue un proceso.",
      },
      {
        heading: "Casos donde suele convenir",
        body:
          "Conviene evaluarlo cuando hay muchos usuarios, reglas propias del negocio, necesidad de permisos, reportes recurrentes o integracion entre ventas, administracion, operaciones y direccion.",
      },
      {
        heading: "Casos donde no conviene empezar por software",
        body:
          "Si el proceso todavia cambia cada semana o nadie puede explicar el circuito actual, primero conviene ordenar el flujo. Automatizar o desarrollar sobre desorden suele trasladar el problema a una pantalla nueva.",
      },
      {
        heading: "Como reducir el riesgo",
        body:
          "El camino mas sano es empezar con un modulo minimo util, probarlo con datos reales y medir si reduce tiempo, errores o dependencia de planillas antes de ampliar el alcance.",
      },
    ],
    checklist: [
      "Hay tareas repetidas que consumen horas todas las semanas.",
      "La informacion critica vive en planillas o mensajes aislados.",
      "Se necesitan permisos, trazabilidad o historial de cambios.",
      "Los reportes llegan tarde o con diferencias entre areas.",
      "El proceso tiene reglas propias que una herramienta generica no cubre bien.",
    ],
    ctaText: "Evaluar un sistema a medida",
    ctaUrl: "/sistemas-a-medida/",
  },
  {
    id: "dashboards-ejecutivos-pymes",
    path: "/recursos/dashboards-ejecutivos-pymes/",
    eyebrow: "Gestion y datos",
    title: "Dashboards ejecutivos para PYMEs: que medir primero",
    shortTitle: "Dashboards ejecutivos para PYMEs",
    metaTitle: "Dashboards Ejecutivos para PYMEs: Que Medir Primero | Vogel",
    metaDescription:
      "Indicadores iniciales para dashboards ejecutivos en PYMEs: ventas, rentabilidad, stock, cobranzas y alertas para decidir mejor.",
    summary:
      "Un dashboard ejecutivo no empieza con graficos; empieza con las preguntas que la direccion necesita responder sin esperar reportes manuales.",
    primaryService: "dashboards-ejecutivos",
    readTime: "6 min",
    published: "2026-06-04",
    keywords: ["dashboards ejecutivos", "dashboard pyme", "indicadores de gestion"],
    sections: [
      {
        heading: "Primero las decisiones, despues los graficos",
        body:
          "El tablero debe responder preguntas concretas: que vendimos, con que margen, que se esta atrasando, donde hay stock inmovilizado y que cliente o producto requiere atencion.",
      },
      {
        heading: "Indicadores iniciales recomendados",
        body:
          "Para una PYME suelen ser suficientes ventas por periodo, margen o rentabilidad, cobranzas, stock critico, gastos principales y comparativos contra meses anteriores.",
      },
      {
        heading: "Fuentes de datos posibles",
        body:
          "Un dashboard puede empezar con exportaciones de sistemas, Excel, bases de datos o planillas compartidas. Lo importante es definir una rutina confiable y una sola version de cada indicador.",
      },
      {
        heading: "Cuando automatizar la actualizacion",
        body:
          "La automatizacion conviene cuando el tablero ya se usa para decidir. Antes de eso, es mejor validar que los indicadores elegidos realmente cambian conversaciones y prioridades.",
      },
    ],
    checklist: [
      "La direccion recibe reportes con demora.",
      "Hay diferencias entre numeros de ventas, stock o administracion.",
      "Se toman decisiones sin ver tendencias comparables.",
      "Faltan alertas tempranas sobre desvio de costos o cobranzas.",
      "El equipo arma los mismos informes todas las semanas.",
    ],
    ctaText: "Consultar por un dashboard",
    ctaUrl: "/dashboards-ejecutivos/",
  },
  {
    id: "automatizacion-procesos-administrativos",
    path: "/recursos/automatizacion-procesos-administrativos/",
    eyebrow: "Eficiencia operativa",
    title: "Automatizacion de procesos administrativos: por donde empezar",
    shortTitle: "Automatizacion administrativa",
    metaTitle: "Automatizacion de Procesos Administrativos | Guia Inicial",
    metaDescription:
      "Como elegir el primer proceso administrativo para automatizar: tareas repetitivas, reglas claras, impacto medible y control humano.",
    summary:
      "Automatizar no significa hacer todo de golpe. La mejor primera automatizacion suele ser chica, repetitiva, medible y facil de validar por el equipo.",
    primaryService: "automatizacion-de-procesos",
    readTime: "5 min",
    published: "2026-06-04",
    keywords: ["automatizacion de procesos", "procesos administrativos", "automatizar tareas"],
    sections: [
      {
        heading: "Elegir un flujo repetitivo y visible",
        body:
          "El primer candidato debe repetirse con frecuencia, tener reglas claras y generar costo si se hace tarde o con errores. Por ejemplo: avisos, reportes, controles, carga de datos o conciliaciones.",
      },
      {
        heading: "Mantener control humano",
        body:
          "Una buena automatizacion no elimina criterio. Reduce carga mecanica y deja puntos de revision donde una persona valida excepciones, decisiones sensibles o informacion incompleta.",
      },
      {
        heading: "Medir antes y despues",
        body:
          "Antes de construir conviene estimar horas usadas, errores frecuentes y demoras. Despues se compara contra esos valores para saber si la automatizacion realmente aporto.",
      },
      {
        heading: "Escalar despues de validar",
        body:
          "Cuando una automatizacion chica funciona, se puede conectar con otros pasos: formularios, planillas, correos, dashboards, sistemas internos o asistentes con IA.",
      },
    ],
    checklist: [
      "La tarea se repite todas las semanas o todos los dias.",
      "Las reglas se pueden explicar con claridad.",
      "Hay errores por copiar y pegar informacion.",
      "El equipo pierde tiempo buscando datos o estados.",
      "Se puede medir ahorro de tiempo o reduccion de errores.",
    ],
    ctaText: "Evaluar una automatizacion",
    ctaUrl: "/automatizacion-de-procesos/",
  },
];

export function getResource(id) {
  return resources.find((resource) => resource.id === id) || null;
}

export function getResourceUrl(path) {
  return `${siteUrl}${path}`;
}
