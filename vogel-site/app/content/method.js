// Método Vogel: the consultancy's working language, not a registered methodology.
export const methodSteps = [
  { id: 'observar', label: 'Observar', text: 'Entender cómo trabaja hoy la operación.', detail: 'Personas, procesos, herramientas e información.' },
  { id: 'ordenar', label: 'Ordenar', text: 'Identificar qué merece ser simplificado antes de automatizar.', detail: 'No digitalizar desorden.' },
  { id: 'conectar', label: 'Conectar', text: 'Unir sistemas, datos y tareas donde genera valor.', detail: '' },
  { id: 'decidir', label: 'Decidir', text: 'Transformar información en lectura operativa.', detail: '' },
  { id: 'mejorar', label: 'Mejorar', text: 'Medir, ajustar y acompañar la evolución.', detail: '' },
].map((step, index) => ({ ...step, number: String(index + 1).padStart(2, '0') }));

// Diagram vocabulary: inputs converge on the system, the system leads to a decision.
export const methodInputs = ['Personas', 'Procesos', 'Datos', 'Tecnología'];
