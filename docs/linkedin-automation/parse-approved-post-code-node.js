const raw = $json.data || $json.text || $json.content || "";
const sourcePath = $json.fileName || $json.filePath || $json.path || "";

const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
if (!match) {
  throw new Error(`El archivo no tiene front matter valido: ${sourcePath}`);
}

const metaText = match[1];
const body = match[2].trim();
const meta = {};

for (const line of metaText.split(/\r?\n/)) {
  const item = line.match(/^([A-Za-z0-9_-]+):\s*"(.*)"\s*$/) || line.match(/^([A-Za-z0-9_-]+):\s*(.*)\s*$/);
  if (item) {
    meta[item[1]] = item[2].trim();
  }
}

if (meta.estado !== "aprobada") {
  return [];
}

if (!body) {
  throw new Error(`La publicacion no tiene texto: ${sourcePath}`);
}

return [
  {
    json: {
      id: meta.id,
      canal: meta.canal || "linkedin",
      estado: meta.estado,
      fecha_sugerida: meta.fecha_sugerida || "",
      imagen: meta.imagen || "",
      texto: body,
      sourcePath,
    },
  },
];
