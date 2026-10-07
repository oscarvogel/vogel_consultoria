// Single source for Oscar's profile: the legacy AboutSection and the Phase 05 chapter read the same facts.
export const oscarSkills = [
  'Python', 'Django', 'Django REST Framework', 'MySQL', 'Visual FoxPro', 'PyQt',
  'Facturación electrónica', 'APIs REST', 'Dashboards', 'Automatización', 'Ecommerce', 'Capacitación técnica',
];

export const oscarExperience = [
  {
    period: '2024 - actualidad', year: '2024', milestone: 'Ferretería Avenida',
    title: 'Ferretería Avenida S.A.',
    description: 'Desarrollo y mantenimiento de soluciones internas en Python, Django, DRF y MySQL para gestión, ventas y administración.',
  },
  {
    period: '2021 - 2024', year: '2021', milestone: 'Forestal Garuhapé',
    title: 'Forestal Garuhapé S.A.',
    description: 'Administración, servicios y desarrollo de sistemas internos para acompañar procesos operativos y soporte a usuarios.',
  },
  {
    period: '2008 - 2021', year: '2008', milestone: 'Responsable de sistemas',
    title: 'Responsable de sistemas',
    description: 'Implementación de sistema de ventas y facturación con Visual FoxPro y MySQL, más herramientas internas en Python y Django.',
  },
  {
    period: '1998 - 2003', year: '1998', milestone: 'Docencia en informática',
    title: 'Docencia y dirección en informática',
    description: 'Formación en programación, sistemas de procesamiento de datos y capacitación técnica, base clave para acompañar equipos.',
  },
];

// Homepage milestones, oldest first. Derived from the experience above; nothing is invented.
export const oscarMilestones = [...oscarExperience].reverse().map(({ year, milestone }) => ({ year, milestone }));

// Editorial capability list for the home; concrete technologies stay inside the CV/detail.
export const oscarCapabilities = [
  'Sistemas de gestión', 'Automatización', 'Integraciones', 'Datos y reporting', 'Desarrollo', 'Capacitación',
];

export const oscarProfile = {
  name: 'Oscar Vogel',
  role: 'Desarrollador y consultor tecnológico',
  years: 25,
  cv: '/cv-jose-oscar-vogel.pdf',
};
