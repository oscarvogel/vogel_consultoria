import fs from "fs/promises";
import path from "path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.resolve("outputs/vogel-growth-tracker");
const outputPath = path.join(outputDir, "seguimiento-crecimiento-web-vogel.xlsx");

const wb = Workbook.create();

const COLORS = {
  navy: "#062236",
  blue: "#1584DC",
  cyan: "#64D9EA",
  pale: "#EAF7FB",
  surface: "#F6FAFC",
  header: "#D8EEF6",
  text: "#102A3A",
  amber: "#F4AD13",
  green: "#DDF4E7",
  red: "#FCE4E4",
  gray: "#E7EDF1",
};

function setValues(ws, range, values) {
  ws.getRange(range).values = values;
}

function styleRange(ws, range, style = {}) {
  const r = ws.getRange(range);
  if (style.fill) r.format.fill.color = style.fill;
  if (style.fontColor) r.format.font.color = style.fontColor;
  if (style.bold !== undefined) r.format.font.bold = style.bold;
  if (style.size) r.format.font.size = style.size;
  if (style.wrap !== undefined) r.format.wrapText = style.wrap;
  if (style.hAlign) r.format.horizontalAlignment = style.hAlign;
  if (style.vAlign) r.format.verticalAlignment = style.vAlign;
  if (style.numberFormat) r.numberFormat = style.numberFormat;
}

function title(ws, range, text) {
  setValues(ws, range, [[text]]);
  ws.mergeCells(range);
  styleRange(ws, range, {
    fill: COLORS.navy,
    fontColor: "#FFFFFF",
    bold: true,
    size: 16,
    hAlign: "center",
    vAlign: "center",
  });
}

function setWidths(ws, widths) {
  widths.forEach((width, index) => {
    ws.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = width;
  });
}

function addTable(ws, range, name) {
  const table = ws.tables.add(range, true, name);
  table.style = "TableStyleMedium2";
  return table;
}

function fillBlankRows(headers, count) {
  return Array.from({ length: count }, () => headers.map(() => ""));
}

const dashboard = wb.worksheets.add("Dashboard");
const semanal = wb.worksheets.add("Semanal");
const campanias = wb.worksheets.add("Campanas UTM");
const acciones = wb.worksheets.add("Acciones SEO");
const diccionario = wb.worksheets.add("Diccionario");

// Dashboard
title(dashboard, "A1:J1", "Vogel Consultoria - Seguimiento semanal de crecimiento web");
setValues(dashboard, "A3:J3", [[
  "Lectura general",
  "Semana actual",
  "Sesiones",
  "Usuarios activos",
  "Clics Google",
  "Impresiones Google",
  "CTR",
  "Contactos",
  "Mejor canal",
  "Proxima accion",
]]);
setValues(dashboard, "A4:J4", [[
  "Completar cada viernes despues de revisar GA4 y Search Console.",
  "=IFERROR(MAX(Semanal!A2:A53),\"\")",
  "=IFERROR(LOOKUP(2,1/(Semanal!A2:A53<>\"\"),Semanal!D2:D53),\"\")",
  "=IFERROR(LOOKUP(2,1/(Semanal!A2:A53<>\"\"),Semanal!E2:E53),\"\")",
  "=IFERROR(LOOKUP(2,1/(Semanal!A2:A53<>\"\"),Semanal!K2:K53),\"\")",
  "=IFERROR(LOOKUP(2,1/(Semanal!A2:A53<>\"\"),Semanal!L2:L53),\"\")",
  "=IFERROR(LOOKUP(2,1/(Semanal!A2:A53<>\"\"),Semanal!M2:M53),\"\")",
  "=IFERROR(LOOKUP(2,1/(Semanal!A2:A53<>\"\"),Semanal!S2:S53),\"\")",
  "=IFERROR(LOOKUP(2,1/(Semanal!A2:A53<>\"\"),Semanal!H2:H53),\"\")",
  "=IFERROR(INDEX('Acciones SEO'!C2:C101,MATCH(\"Pendiente\",'Acciones SEO'!E2:E101,0)),\"\")",
]]);
styleRange(dashboard, "A3:J3", { fill: COLORS.header, bold: true, hAlign: "center", wrap: true });
styleRange(dashboard, "A4:J4", { fill: COLORS.surface, wrap: true });
setValues(dashboard, "A7:D7", [["Indicador", "Semana actual", "Semana anterior", "Variacion"]]);
setValues(dashboard, "A8:D15", [
  ["Sesiones", "=C4", "=IFERROR(LOOKUP(2,1/(Semanal!A2:A52<>\"\"),Semanal!D2:D52),\"\")", "=IFERROR((B8-C8)/C8,\"\")"],
  ["Usuarios activos", "=D4", "=IFERROR(LOOKUP(2,1/(Semanal!A2:A52<>\"\"),Semanal!E2:E52),\"\")", "=IFERROR((B9-C9)/C9,\"\")"],
  ["Clics Google", "=E4", "=IFERROR(LOOKUP(2,1/(Semanal!A2:A52<>\"\"),Semanal!K2:K52),\"\")", "=IFERROR((B10-C10)/C10,\"\")"],
  ["Impresiones Google", "=F4", "=IFERROR(LOOKUP(2,1/(Semanal!A2:A52<>\"\"),Semanal!L2:L52),\"\")", "=IFERROR((B11-C11)/C11,\"\")"],
  ["CTR Google", "=G4", "=IFERROR(LOOKUP(2,1/(Semanal!A2:A52<>\"\"),Semanal!M2:M52),\"\")", "=IFERROR(B12-C12,\"\")"],
  ["Contactos", "=H4", "=IFERROR(LOOKUP(2,1/(Semanal!A2:A52<>\"\"),Semanal!S2:S52),\"\")", "=IFERROR((B13-C13)/C13,\"\")"],
  ["Sesiones Instagram bio", "=IFERROR(SUMIFS('Campanas UTM'!F2:F101,'Campanas UTM'!B2:B101,\"instagram\",'Campanas UTM'!D2:D101,\"portal_automatizaciones_junio_2026\"),0)", "", ""],
  ["Notas", "Cargar hallazgos y decisiones abajo.", "", ""],
]);
styleRange(dashboard, "A7:D7", { fill: COLORS.header, bold: true, hAlign: "center" });
styleRange(dashboard, "A8:D15", { fill: COLORS.surface, wrap: true });
styleRange(dashboard, "D8:D14", { numberFormat: "0.0%" });
setValues(dashboard, "F7:J7", [["Fecha", "Hallazgo", "Decision", "Responsable", "Estado"]]);
setValues(dashboard, "F8:J17", [
  ["2026-06-05", "Se crea tracker semanal para medir GA4, Search Console y UTMs.", "Medir todos los viernes.", "Oscar / Codex", "Activo"],
  ...fillBlankRows(["Fecha", "Hallazgo", "Decision", "Responsable", "Estado"], 9),
]);
styleRange(dashboard, "F7:J7", { fill: COLORS.header, bold: true, hAlign: "center" });
styleRange(dashboard, "F8:J17", { fill: COLORS.surface, wrap: true });
setWidths(dashboard, [210, 120, 120, 120, 120, 110, 230, 180, 120, 160]);
dashboard.freezePanes.freezeRows(3);

// Semanal
const semanalHeaders = [
  "Semana inicio",
  "Semana fin",
  "Fuente revision",
  "Sesiones",
  "Usuarios activos",
  "Usuarios nuevos",
  "Eventos",
  "Canal principal",
  "Direct",
  "Organic Search",
  "Referral",
  "Organic Social",
  "Clics GSC",
  "Impresiones GSC",
  "CTR GSC",
  "Posicion media",
  "Pagina principal",
  "Consulta principal",
  "Contactos totales",
  "whatsapp_click",
  "contact_form_submit",
  "email_click",
  "Estado indexacion",
  "Estado seguridad",
  "Lectura semanal",
];
setValues(semanal, "A1:Y1", [semanalHeaders]);
setValues(semanal, "A2:Y53", [
  [
    "2026-05-28",
    "2026-06-03",
    "GA4 + Search Console",
    55,
    34,
    31,
    273,
    "Direct",
    33,
    6,
    15,
    1,
    6,
    12,
    0.5,
    9.6,
    "/",
    "sistemas a medida",
    "",
    "",
    "",
    "",
    "Varias paginas ya indexadas; recursos nuevos pendientes de reintento por cuota.",
    "Revision enviada tras retirar /instaladores/.",
    "Muestra chica, pero hay crecimiento inicial fuerte. Prioridad: sostener publicaciones con UTM y revisar conversiones.",
  ],
  ...fillBlankRows(semanalHeaders, 51),
]);
styleRange(semanal, "A1:Y1", { fill: COLORS.navy, fontColor: "#FFFFFF", bold: true, hAlign: "center", wrap: true });
styleRange(semanal, "A2:Y53", { fill: COLORS.surface, wrap: true });
styleRange(semanal, "A2:B53", { numberFormat: "yyyy-mm-dd" });
styleRange(semanal, "O2:O53", { numberFormat: "0.0%" });
addTable(semanal, "A1:Y53", "TablaSemanal");
setWidths(semanal, [105, 105, 150, 85, 110, 110, 85, 130, 80, 105, 85, 105, 90, 115, 85, 95, 140, 150, 95, 105, 125, 90, 220, 180, 280]);
semanal.freezePanes.freezeRows(1);

// Campanas UTM
const campHeaders = [
  "Fecha",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "Sesiones",
  "Usuarios",
  "Contactos",
  "URL usada",
  "Publicacion / contexto",
  "Resultado",
  "Proxima accion",
];
setValues(campanias, "A1:L1", [campHeaders]);
setValues(campanias, "A2:L101", [
  [
    "2026-06-04",
    "instagram",
    "bio",
    "portal_automatizaciones_junio_2026",
    "perfil_empresa",
    "",
    "",
    "",
    "https://vogelconsultoria.com.ar/automatizaciones/?utm_source=instagram&utm_medium=bio&utm_campaign=portal_automatizaciones_junio_2026&utm_content=perfil_empresa",
    "Perfil empresa vogelconsultoria.ar",
    "Pendiente de medir 24-48h",
    "Revisar GA4 por source/medium/campaign.",
  ],
  [
    "2026-06-04",
    "whatsapp",
    "direct_message",
    "portal_automatizaciones_junio_2026",
    "imagen_portal_estudios_contables",
    "",
    "",
    "",
    "https://vogelconsultoria.com.ar/automatizaciones/?utm_source=whatsapp&utm_medium=direct_message&utm_campaign=portal_automatizaciones_junio_2026&utm_content=imagen_portal_estudios_contables",
    "Envio manual por WhatsApp",
    "Pendiente",
    "Comparar contra Instagram y LinkedIn.",
  ],
  [
    "2026-06-04",
    "linkedin",
    "social",
    "portal_automatizaciones_junio_2026",
    "imagen_portal_estudios_contables",
    "",
    "",
    "",
    "https://vogelconsultoria.com.ar/automatizaciones/?utm_source=linkedin&utm_medium=social&utm_campaign=portal_automatizaciones_junio_2026&utm_content=imagen_portal_estudios_contables",
    "Post LinkedIn",
    "Pendiente",
    "Publicar o reforzar si no hay sesiones.",
  ],
  ...fillBlankRows(campHeaders, 97),
]);
styleRange(campanias, "A1:L1", { fill: COLORS.navy, fontColor: "#FFFFFF", bold: true, hAlign: "center", wrap: true });
styleRange(campanias, "A2:L101", { fill: COLORS.surface, wrap: true });
styleRange(campanias, "A2:A101", { numberFormat: "yyyy-mm-dd" });
addTable(campanias, "A1:L101", "TablaCampanas");
setWidths(campanias, [105, 105, 130, 230, 190, 85, 85, 85, 430, 230, 140, 220]);
campanias.freezePanes.freezeRows(1);

// Acciones SEO
const accionHeaders = [
  "Fecha alta",
  "Area",
  "Accion",
  "Impacto esperado",
  "Estado",
  "Prioridad",
  "Responsable",
  "Fecha objetivo",
  "Evidencia / link",
  "Resultado",
];
setValues(acciones, "A1:J1", [accionHeaders]);
setValues(acciones, "A2:J101", [
  ["2026-06-05", "Medicion", "Revisar GA4 por campania UTM de Instagram bio.", "Entender si el perfil nuevo ya deriva trafico.", "Pendiente", "Alta", "Codex", "2026-06-06", "GA4 > Adquisicion > Trafico", ""],
  ["2026-06-05", "SEO", "Reintentar solicitud de indexacion de paginas /recursos/ cuando resetee la cuota.", "Acelerar aparicion de contenido nuevo en Google.", "Pendiente", "Alta", "Codex", "2026-06-06", "Search Console", ""],
  ["2026-06-05", "Contenido", "Preparar segunda publicacion: dashboards ejecutivos para pymes.", "Sostener senales sociales y generar visitas a pagina de dashboards.", "Pendiente", "Media", "Oscar / Codex", "2026-06-10", "Instagram / LinkedIn", ""],
  ["2026-06-05", "Conversion", "Verificar si se registran whatsapp_click y contact_form_submit despues de compartir links.", "Medir conversion real, no solo trafico.", "Pendiente", "Alta", "Codex", "2026-06-07", "GA4 > Eventos clave", ""],
  ...fillBlankRows(accionHeaders, 96),
]);
styleRange(acciones, "A1:J1", { fill: COLORS.navy, fontColor: "#FFFFFF", bold: true, hAlign: "center", wrap: true });
styleRange(acciones, "A2:J101", { fill: COLORS.surface, wrap: true });
styleRange(acciones, "A2:A101", { numberFormat: "yyyy-mm-dd" });
styleRange(acciones, "H2:H101", { numberFormat: "yyyy-mm-dd" });
addTable(acciones, "A1:J101", "TablaAcciones");
setWidths(acciones, [105, 110, 330, 260, 110, 100, 130, 120, 210, 240]);
acciones.freezePanes.freezeRows(1);

// Diccionario
title(diccionario, "A1:F1", "Diccionario de metricas y rutina semanal");
setValues(diccionario, "A3:F3", [["Metrica", "Fuente", "Que significa", "Como leerla", "Meta inicial", "Notas"]]);
setValues(diccionario, "A4:F18", [
  ["Sesiones", "GA4", "Visitas o grupos de interacciones en la web.", "Debe crecer semana a semana, evitando depender solo de Direct.", "Crecimiento sostenido", ""],
  ["Usuarios activos", "GA4", "Personas activas en el periodo.", "Ayuda a ver alcance real.", "Subir con trafico calificado", ""],
  ["Eventos", "GA4", "Interacciones registradas en la web.", "Sirve para detectar actividad, pero no todo evento es contacto.", "Aumentar sin inflar artificialmente", ""],
  ["Eventos clave", "GA4", "Acciones importantes como formulario, WhatsApp o email.", "Es la metrica mas cercana a oportunidades comerciales.", "Medir todas las semanas", ""],
  ["Clics", "Search Console", "Visitas desde resultados de Google.", "Indica trafico organico real.", "Crecer desde 6 clics base", ""],
  ["Impresiones", "Search Console", "Veces que la web aparecio en Google.", "Primero crecen impresiones, despues clics.", "Aumentar visibilidad", ""],
  ["CTR", "Search Console", "Clics dividido impresiones.", "Si baja con mas impresiones puede ser normal; revisar titulos.", "Mantener saludable", ""],
  ["Posicion media", "Search Console", "Ranking promedio en Google.", "Menor numero es mejor.", "Bajar progresivamente", ""],
  ["utm_source", "Campanas", "Origen del trafico: instagram, whatsapp, linkedin.", "Comparar canales.", "Usar siempre", ""],
  ["utm_medium", "Campanas", "Tipo de medio: bio, social, direct_message.", "Distingue contexto dentro del canal.", "Usar siempre", ""],
  ["utm_campaign", "Campanas", "Nombre de campania.", "Agrupa publicaciones de una iniciativa.", "portal_automatizaciones_junio_2026", ""],
  ["utm_content", "Campanas", "Variante o pieza compartida.", "Ayuda a saber que post o bio rindio.", "perfil_empresa, imagen_portal...", ""],
  ["Rutina", "Proceso", "Todos los viernes cargar datos de GA4 + GSC.", "Primero datos, despues decisiones.", "17:00 semanal", ""],
  ["Decision", "Proceso", "Cada semana dejar 1-3 acciones concretas.", "Evitar mirar metricas sin ejecutar mejoras.", "3 acciones max.", ""],
  ["Cuidado", "Proceso", "No sobreinterpretar muestras chicas.", "Mirar tendencia de 3-4 semanas.", "Paciencia + constancia", ""],
]);
styleRange(diccionario, "A3:F3", { fill: COLORS.header, bold: true, hAlign: "center", wrap: true });
styleRange(diccionario, "A4:F18", { fill: COLORS.surface, wrap: true });
addTable(diccionario, "A3:F18", "TablaDiccionario");
setWidths(diccionario, [140, 130, 260, 260, 190, 210]);
diccionario.freezePanes.freezeRows(3);

for (const ws of [dashboard, semanal, campanias, acciones, diccionario]) {
  const used = ws.getUsedRange();
  used.format.font.name = "Arial";
  used.format.font.color = COLORS.text;
  used.format.verticalAlignment = "top";
}

await fs.mkdir(outputDir, { recursive: true });

const inspect = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "formula error scan",
});
console.log(inspect.ndjson);

const renderChecks = [
  ["Dashboard", "A1:J17"],
  ["Semanal", "A1:Y12"],
  ["Campanas UTM", "A1:L12"],
  ["Acciones SEO", "A1:J12"],
  ["Diccionario", "A1:F18"],
];

for (const [sheetName, range] of renderChecks) {
  await wb.render({ sheetName, range, scale: 1, format: "png" });
}

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(outputPath);

console.log(JSON.stringify({ outputPath }));
